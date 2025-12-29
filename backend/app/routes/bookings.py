from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import date, time, datetime, timedelta
from app.database import get_db
from app.models import Booking, Doctor, Slot, User, BookingStatus
from app.schemas import (
    BookingCreate, BookingResponse, BookingUpdate, 
    BookingWithDoctor, AvailableSlot
)
from app.auth import get_current_active_user, get_admin_user, get_doctor_user
from app.email_service import email_service

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

def get_available_time_slots(doctor_id: int, booking_date: date, db: Session) -> List[dict]:
    """Get available time slots for a doctor on a specific date"""
    day_of_week = booking_date.weekday()
    
    # Get doctor's slots for this day
    slots = db.query(Slot).filter(
        Slot.doctor_id == doctor_id,
        Slot.day_of_week == day_of_week,
        Slot.is_active == True
    ).all()
    
    if not slots:
        return []
    
    # Get existing bookings for this doctor on this date
    existing_bookings = db.query(Booking).filter(
        Booking.doctor_id == doctor_id,
        Booking.booking_date == booking_date,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
    ).all()
    
    booked_times = {b.booking_time for b in existing_bookings}
    
    available_slots = []
    for slot in slots:
        current_time = datetime.combine(booking_date, slot.start_time)
        end_time = datetime.combine(booking_date, slot.end_time)
        
        while current_time < end_time:
            slot_time = current_time.time()
            is_available = slot_time not in booked_times
            
            # Don't show past slots for today
            if booking_date == date.today() and slot_time <= datetime.now().time():
                is_available = False
            
            available_slots.append({
                "time": slot_time.strftime("%H:%M"),
                "available": is_available
            })
            current_time += timedelta(minutes=slot.slot_duration)
    
    return available_slots

@router.get("/available-slots/{doctor_id}/{booking_date}")
def get_available_slots(
    doctor_id: int, 
    booking_date: date,
    db: Session = Depends(get_db)
):
    """Get available slots for a doctor on a specific date"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    slots = get_available_time_slots(doctor_id, booking_date, db)
    return {"date": booking_date, "slots": slots}

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new booking (public endpoint)"""
    # Parse booking_time string to time object
    booking_time = datetime.strptime(booking_data.booking_time, "%H:%M").time()
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == booking_data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if not doctor.is_available:
        raise HTTPException(status_code=400, detail="Doctor is not available")
    
    # Check if slot is available
    existing_booking = db.query(Booking).filter(
        Booking.doctor_id == booking_data.doctor_id,
        Booking.booking_date == booking_data.booking_date,
        Booking.booking_time == booking_time,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
    ).first()
    
    if existing_booking:
        raise HTTPException(status_code=400, detail="This slot is already booked")
    
    # Map consultation type to display name
    consultation_type_display = {
        "clinic": "In-Clinic Visit",
        "home": "Home Visit",
        "video": "Video Consultation"
    }.get(booking_data.consultation_type, "Clinic Visit")
    
    # Create booking
    new_booking = Booking(
        doctor_id=booking_data.doctor_id,
        booking_date=booking_data.booking_date,
        booking_time=booking_time,
        consultation_type=booking_data.consultation_type,
        patient_name=booking_data.patient_name,
        patient_phone=booking_data.patient_phone,
        patient_email=booking_data.patient_email,
        symptoms=booking_data.symptoms,
        status=BookingStatus.PENDING
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # Send booking received email (pending status)
    if new_booking.patient_email:
        background_tasks.add_task(
            email_service.send_booking_received,
            to_email=new_booking.patient_email,
            patient_name=new_booking.patient_name,
            doctor_name=doctor.user.full_name,
            doctor_specialization=doctor.specialization or "Physiotherapy",
            booking_date=new_booking.booking_date.strftime("%B %d, %Y"),
            booking_time=new_booking.booking_time.strftime("%I:%M %p"),
            consultation_type=consultation_type_display,
            booking_id=new_booking.id
        )
    
    return new_booking

@router.get("/", response_model=List[BookingResponse])
def get_all_bookings(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all bookings (admin only)"""
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    bookings = query.order_by(Booking.booking_date.desc(), Booking.booking_time, Booking.id).offset(skip).limit(limit).all()
    return bookings

@router.get("/today/", response_model=List[BookingResponse])
def get_today_bookings(
    db: Session = Depends(get_db),
    user: User = Depends(get_doctor_user)
):
    """Get today's bookings"""
    today = date.today()
    query = db.query(Booking).filter(Booking.booking_date == today)
    
    # If doctor, only show their bookings
    if user.role == "doctor" and user.doctor_profile:
        query = query.filter(Booking.doctor_id == user.doctor_profile.id)
    
    bookings = query.order_by(Booking.booking_time).all()
    return bookings

@router.get("/doctor/{doctor_id}/", response_model=List[BookingResponse])
def get_doctor_bookings(
    doctor_id: int,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_doctor_user)
):
    """Get bookings for a specific doctor"""
    query = db.query(Booking).filter(Booking.doctor_id == doctor_id)
    
    if start_date:
        query = query.filter(Booking.booking_date >= start_date)
    if end_date:
        query = query.filter(Booking.booking_date <= end_date)
    
    bookings = query.order_by(Booking.booking_date, Booking.booking_time).all()
    return bookings

@router.get("/{booking_id}/", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    """Get booking by ID"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{booking_id}/", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_doctor_user)
):
    """Update booking status (doctor/admin only)"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Store old status to detect changes
    old_status = booking.status
    
    update_data = booking_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(booking, key, value)
    
    db.commit()
    db.refresh(booking)
    
    # Send email notifications based on status change
    new_status = booking.status
    if old_status != new_status and booking.patient_email:
        doctor = db.query(Doctor).filter(Doctor.id == booking.doctor_id).first()
        
        # Map consultation type to display name
        consultation_type_display = {
            "clinic": "In-Clinic Visit",
            "home": "Home Visit",
            "video": "Video Consultation"
        }.get(booking.consultation_type, "Clinic Visit")
        
        if new_status == BookingStatus.CONFIRMED and doctor:
            # Send confirmation email
            background_tasks.add_task(
                email_service.send_booking_confirmation,
                to_email=booking.patient_email,
                patient_name=booking.patient_name,
                doctor_name=doctor.user.full_name,
                doctor_specialization=doctor.specialization or "Physiotherapy",
                booking_date=booking.booking_date.strftime("%B %d, %Y"),
                booking_time=booking.booking_time.strftime("%I:%M %p"),
                consultation_type=consultation_type_display,
                booking_id=booking.id
            )
        elif new_status == BookingStatus.COMPLETED and doctor:
            # Send feedback request email
            background_tasks.add_task(
                email_service.send_booking_completed,
                to_email=booking.patient_email,
                patient_name=booking.patient_name,
                doctor_name=doctor.user.full_name,
                booking_date=booking.booking_date.strftime("%B %d, %Y"),
                booking_id=booking.id
            )
        elif new_status == BookingStatus.CANCELLED and doctor:
            # Send cancellation email
            background_tasks.add_task(
                email_service.send_booking_cancellation,
                to_email=booking.patient_email,
                patient_name=booking.patient_name,
                doctor_name=doctor.user.full_name,
                booking_date=booking.booking_date.strftime("%B %d, %Y"),
                booking_time=booking.booking_time.strftime("%I:%M %p"),
                cancellation_reason=booking.cancellation_reason
            )
    
    return booking

@router.delete("/{booking_id}/")
def cancel_booking(
    booking_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Cancel a booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Get doctor info before cancelling
    doctor = db.query(Doctor).filter(Doctor.id == booking.doctor_id).first()
    
    booking.status = BookingStatus.CANCELLED
    db.commit()
    
    # Send cancellation email in background
    if booking.patient_email and doctor:
        background_tasks.add_task(
            email_service.send_booking_cancellation,
            to_email=booking.patient_email,
            patient_name=booking.patient_name,
            doctor_name=doctor.user.full_name,
            booking_date=booking.booking_date.strftime("%B %d, %Y"),
            booking_time=booking.booking_time.strftime("%I:%M %p")
        )
    
    return {"message": "Booking cancelled successfully"}

@router.get("/check/{phone}/")
def check_booking_by_phone(
    phone: str,
    db: Session = Depends(get_db)
):
    """Check booking status by phone number"""
    bookings = db.query(Booking).filter(
        Booking.patient_phone == phone
    ).order_by(Booking.booking_date.desc()).limit(10).all()
    
    result = []
    for booking in bookings:
        doctor = db.query(Doctor).filter(Doctor.id == booking.doctor_id).first()
        result.append({
            "id": booking.id,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "status": booking.status,
            "doctor_name": doctor.user.full_name if doctor else "Unknown",
            "doctor_specialization": doctor.specialization if doctor else "Unknown"
        })
    
    return result
