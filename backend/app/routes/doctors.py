from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Doctor, User, UserRole, Slot
from app.schemas import (
    DoctorResponse, DoctorCreate, DoctorUpdate, DoctorPublic,
    DoctorCreateWithUser, SlotResponse, SlotCreate, SlotUpdate
)
from app.auth import get_admin_user, get_password_hash

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

@router.get("/", response_model=List[DoctorPublic])
def get_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all available doctors (public endpoint)"""
    doctors = db.query(Doctor).join(User).filter(
        Doctor.is_available == True,
        User.is_active == True
    ).offset(skip).limit(limit).all()
    
    result = []
    for doctor in doctors:
        doc_data = DoctorPublic(
            id=doctor.id,
            specialization=doctor.specialization,
            qualification=doctor.qualification,
            experience_years=doctor.experience_years,
            bio=doctor.bio,
            consultation_fee=doctor.consultation_fee,
            profile_image=doctor.profile_image,
            is_available=doctor.is_available,
            full_name=doctor.user.full_name
        )
        result.append(doc_data)
    return result

@router.get("/all", response_model=List[DoctorResponse])
def get_all_doctors(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all doctors (admin only)"""
    doctors = db.query(Doctor).offset(skip).limit(limit).all()
    return doctors

@router.get("/{doctor_id}", response_model=DoctorPublic)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Get doctor by ID"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return DoctorPublic(
        id=doctor.id,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        experience_years=doctor.experience_years,
        bio=doctor.bio,
        consultation_fee=doctor.consultation_fee,
        profile_image=doctor.profile_image,
        is_available=doctor.is_available,
        full_name=doctor.user.full_name
    )

@router.post("/", response_model=DoctorResponse)
def create_doctor(
    doctor_data: DoctorCreateWithUser,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new doctor with user account (admin only)"""
    # Check if email exists
    existing_user = db.query(User).filter(User.email == doctor_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user account
    hashed_password = get_password_hash(doctor_data.password)
    new_user = User(
        email=doctor_data.email,
        hashed_password=hashed_password,
        full_name=doctor_data.full_name,
        phone=doctor_data.phone,
        role=UserRole.DOCTOR
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create doctor profile
    new_doctor = Doctor(
        user_id=new_user.id,
        specialization=doctor_data.specialization,
        qualification=doctor_data.qualification,
        experience_years=doctor_data.experience_years,
        bio=doctor_data.bio,
        consultation_fee=doctor_data.consultation_fee,
        profile_image=doctor_data.profile_image
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    doctor_data: DoctorUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update doctor (admin only)"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doctor, key, value)
    
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete doctor (admin only)"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Deactivate user instead of deleting
    doctor.user.is_active = False
    doctor.is_available = False
    db.commit()
    return {"message": "Doctor deleted successfully"}

# Slot management
@router.get("/{doctor_id}/slots", response_model=List[SlotResponse])
def get_doctor_slots(doctor_id: int, db: Session = Depends(get_db)):
    """Get doctor's available slots"""
    slots = db.query(Slot).filter(
        Slot.doctor_id == doctor_id,
        Slot.is_active == True
    ).all()
    return slots

@router.post("/{doctor_id}/slots", response_model=SlotResponse)
def create_doctor_slot(
    doctor_id: int,
    slot_data: SlotCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a slot for doctor (admin only)"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    new_slot = Slot(
        doctor_id=doctor_id,
        day_of_week=slot_data.day_of_week,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        slot_duration=slot_data.slot_duration
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.put("/slots/{slot_id}", response_model=SlotResponse)
def update_slot(
    slot_id: int,
    slot_data: SlotUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update a slot (admin only)"""
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    update_data = slot_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(slot, key, value)
    
    db.commit()
    db.refresh(slot)
    return slot

@router.delete("/slots/{slot_id}")
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete a slot (admin only)"""
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}
