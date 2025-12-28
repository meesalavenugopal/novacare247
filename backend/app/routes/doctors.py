from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models import Doctor, User, UserRole, Slot, DoctorConsultationFee, DoctorReview
from app.schemas import (
    DoctorResponse, DoctorCreate, DoctorUpdate, DoctorPublic,
    DoctorCreateWithUser, SlotResponse, SlotCreate, SlotUpdate,
    BranchInfo, ConsultationFeeResponse, ConsultationFeeCreate,
    DoctorReviewResponse, DoctorReviewCreate
)
from app.auth import get_admin_user, get_password_hash

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


import json

def build_doctor_public(doctor: Doctor, country: Optional[str] = None) -> DoctorPublic:
    """Helper to build DoctorPublic response with branch and fees"""
    # Build branch info if available
    branch_info = None
    if doctor.branch:
        branch_info = BranchInfo(
            id=doctor.branch.id,
            name=doctor.branch.name,
            city=doctor.branch.city,
            state=doctor.branch.state,
            country=doctor.branch.country
        )
    
    # Build consultation fees (filter by country if specified)
    fees = []
    for fee in doctor.consultation_fees:
        if country is None or fee.country.lower() == country.lower():
            fees.append(ConsultationFeeResponse(
                id=fee.id,
                doctor_id=fee.doctor_id,
                consultation_type=fee.consultation_type,
                country=fee.country,
                fee=fee.fee,
                currency=fee.currency,
                is_available=fee.is_available
            ))
    
    # Parse expertise JSON to list
    expertise_list = None
    if doctor.expertise:
        try:
            expertise_list = json.loads(doctor.expertise)
        except:
            expertise_list = [doctor.expertise]  # Fallback if not valid JSON
    
    return DoctorPublic(
        id=doctor.id,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        experience_years=doctor.experience_years,
        bio=doctor.bio,
        story=doctor.story,
        expertise=expertise_list,
        consultation_fee=doctor.consultation_fee,
        profile_image=doctor.profile_image,
        is_available=doctor.is_available,
        full_name=doctor.user.full_name,
        rating=doctor.rating / 10.0 if doctor.rating else 4.5,  # Convert to x.x format
        branch=branch_info,
        consultation_fees=fees
    )


@router.get("/", response_model=List[DoctorPublic])
def get_doctors(
    skip: int = 0, 
    limit: int = 100, 
    country: Optional[str] = Query(None, description="Filter fees by country"),
    branch_id: Optional[int] = Query(None, description="Filter by branch"),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    consultation_type: Optional[str] = Query(None, description="Filter by consultation type (clinic/home/video)"),
    db: Session = Depends(get_db)
):
    """Get all available doctors (public endpoint) with optional filters"""
    query = db.query(Doctor).options(
        joinedload(Doctor.user),
        joinedload(Doctor.branch),
        joinedload(Doctor.consultation_fees)
    ).join(User).filter(
        Doctor.is_available == True,
        User.is_active == True
    )
    
    # Apply filters
    if branch_id:
        query = query.filter(Doctor.branch_id == branch_id)
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    if consultation_type:
        # Filter doctors who offer this consultation type
        query = query.join(DoctorConsultationFee).filter(
            DoctorConsultationFee.consultation_type == consultation_type,
            DoctorConsultationFee.is_available == True
        )
    
    doctors = query.offset(skip).limit(limit).all()
    
    return [build_doctor_public(doctor, country) for doctor in doctors]


@router.get("/all/", response_model=List[DoctorResponse])
def get_all_doctors(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all doctors (admin only)"""
    doctors = db.query(Doctor).offset(skip).limit(limit).all()
    return doctors

@router.get("/{doctor_id}/", response_model=DoctorPublic)
def get_doctor(
    doctor_id: int, 
    country: Optional[str] = Query(None, description="Filter fees by country"),
    db: Session = Depends(get_db)
):
    """Get doctor by ID"""
    doctor = db.query(Doctor).options(
        joinedload(Doctor.user),
        joinedload(Doctor.branch),
        joinedload(Doctor.consultation_fees)
    ).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return build_doctor_public(doctor, country)

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
        branch_id=doctor_data.branch_id,
        specialization=doctor_data.specialization,
        qualification=doctor_data.qualification,
        experience_years=doctor_data.experience_years,
        bio=doctor_data.bio,
        consultation_fee=doctor_data.consultation_fee,
        profile_image=doctor_data.profile_image,
        rating=doctor_data.rating or 45
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor

@router.put("/{doctor_id}/", response_model=DoctorResponse)
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

@router.delete("/{doctor_id}/")
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
@router.get("/{doctor_id}/slots/", response_model=List[SlotResponse])
def get_doctor_slots(doctor_id: int, db: Session = Depends(get_db)):
    """Get doctor's available slots"""
    slots = db.query(Slot).filter(
        Slot.doctor_id == doctor_id,
        Slot.is_active == True
    ).all()
    return slots

@router.post("/{doctor_id}/slots/", response_model=SlotResponse)
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

@router.put("/slots/{slot_id}/", response_model=SlotResponse)
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

@router.delete("/slots/{slot_id}/")
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


# ============ CONSULTATION FEE MANAGEMENT ============

@router.get("/{doctor_id}/fees/", response_model=List[ConsultationFeeResponse])
def get_doctor_fees(doctor_id: int, db: Session = Depends(get_db)):
    """Get doctor's consultation fees by type and country"""
    fees = db.query(DoctorConsultationFee).filter(
        DoctorConsultationFee.doctor_id == doctor_id
    ).all()
    return fees


@router.post("/{doctor_id}/fees/", response_model=ConsultationFeeResponse)
def create_doctor_fee(
    doctor_id: int,
    fee_data: ConsultationFeeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a consultation fee for doctor (admin only)"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if fee already exists for this type and country
    existing = db.query(DoctorConsultationFee).filter(
        DoctorConsultationFee.doctor_id == doctor_id,
        DoctorConsultationFee.consultation_type == fee_data.consultation_type,
        DoctorConsultationFee.country == fee_data.country
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"Fee for {fee_data.consultation_type} in {fee_data.country} already exists"
        )
    
    new_fee = DoctorConsultationFee(
        doctor_id=doctor_id,
        consultation_type=fee_data.consultation_type,
        country=fee_data.country,
        fee=fee_data.fee,
        currency=fee_data.currency,
        is_available=fee_data.is_available
    )
    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)
    return new_fee


@router.put("/fees/{fee_id}/", response_model=ConsultationFeeResponse)
def update_doctor_fee(
    fee_id: int,
    fee_data: ConsultationFeeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update a consultation fee (admin only)"""
    fee = db.query(DoctorConsultationFee).filter(DoctorConsultationFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee not found")
    
    fee.consultation_type = fee_data.consultation_type
    fee.country = fee_data.country
    fee.fee = fee_data.fee
    fee.currency = fee_data.currency
    fee.is_available = fee_data.is_available
    
    db.commit()
    db.refresh(fee)
    return fee


@router.delete("/fees/{fee_id}/")
def delete_doctor_fee(
    fee_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete a consultation fee (admin only)"""
    fee = db.query(DoctorConsultationFee).filter(DoctorConsultationFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee not found")
    
    db.delete(fee)
    db.commit()
    return {"message": "Consultation fee deleted successfully"}


# ============ DOCTOR REVIEWS ENDPOINTS ============

@router.get("/{doctor_id}/reviews/", response_model=List[DoctorReviewResponse])
def get_doctor_reviews(
    doctor_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get approved reviews for a specific doctor (public endpoint)"""
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    reviews = db.query(DoctorReview).filter(
        DoctorReview.doctor_id == doctor_id,
        DoctorReview.is_approved == True
    ).order_by(DoctorReview.created_at.desc()).offset(skip).limit(limit).all()
    
    return reviews


@router.post("/{doctor_id}/reviews/", response_model=DoctorReviewResponse)
def submit_doctor_review(
    doctor_id: int,
    review_data: DoctorReviewCreate,
    db: Session = Depends(get_db)
):
    """Submit a review for a doctor (public endpoint, requires approval)"""
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    new_review = DoctorReview(
        doctor_id=doctor_id,
        patient_name=review_data.patient_name,
        patient_image=review_data.patient_image,
        content=review_data.content,
        rating=review_data.rating,
        treatment_type=review_data.treatment_type,
        is_approved=False,  # Requires admin approval
        is_verified=False
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@router.get("/reviews/all/", response_model=List[DoctorReviewResponse])
def get_all_reviews(
    skip: int = 0,
    limit: int = 100,
    doctor_id: Optional[int] = Query(None, description="Filter by doctor"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all reviews including unapproved (admin only)"""
    query = db.query(DoctorReview)
    if doctor_id:
        query = query.filter(DoctorReview.doctor_id == doctor_id)
    
    reviews = query.order_by(DoctorReview.created_at.desc()).offset(skip).limit(limit).all()
    return reviews


@router.put("/reviews/{review_id}/", response_model=DoctorReviewResponse)
def update_review(
    review_id: int,
    is_approved: Optional[bool] = None,
    is_verified: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Approve/verify a review (admin only)"""
    review = db.query(DoctorReview).filter(DoctorReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if is_approved is not None:
        review.is_approved = is_approved
    if is_verified is not None:
        review.is_verified = is_verified
    
    db.commit()
    db.refresh(review)
    return review


@router.delete("/reviews/{review_id}/")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete a review (admin only)"""
    review = db.query(DoctorReview).filter(DoctorReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}
