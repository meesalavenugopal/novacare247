from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Testimonial
from app.schemas import TestimonialCreate, TestimonialResponse, TestimonialUpdate
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])

@router.get("/", response_model=List[TestimonialResponse])
def get_testimonials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get approved testimonials (public endpoint)"""
    testimonials = db.query(Testimonial).filter(
        Testimonial.is_approved == True
    ).order_by(Testimonial.created_at.desc(), Testimonial.id).offset(skip).limit(limit).all()
    return testimonials

@router.get("/all/", response_model=List[TestimonialResponse])
def get_all_testimonials(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all testimonials (admin only)"""
    testimonials = db.query(Testimonial).order_by(
        Testimonial.created_at.desc(), Testimonial.id
    ).offset(skip).limit(limit).all()
    return testimonials

@router.post("/", response_model=TestimonialResponse)
def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db)
):
    """Submit a new testimonial (public endpoint)"""
    new_testimonial = Testimonial(**testimonial_data.model_dump())
    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)
    return new_testimonial

@router.put("/{testimonial_id}/", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Approve/update testimonial (admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_data = testimonial_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(testimonial, key, value)
    
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/{testimonial_id}/")
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete testimonial (admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    db.delete(testimonial)
    db.commit()
    return {"message": "Testimonial deleted successfully"}
