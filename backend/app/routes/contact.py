from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ContactInquiry
from app.schemas import ContactInquiryCreate, ContactInquiryResponse
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("/", response_model=ContactInquiryResponse)
def create_inquiry(
    inquiry_data: ContactInquiryCreate,
    db: Session = Depends(get_db)
):
    """Submit a contact inquiry (public endpoint)"""
    new_inquiry = ContactInquiry(**inquiry_data.model_dump())
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)
    return new_inquiry

@router.get("/", response_model=List[ContactInquiryResponse])
def get_inquiries(
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all contact inquiries (admin only)"""
    query = db.query(ContactInquiry)
    if unread_only:
        query = query.filter(ContactInquiry.is_read == False)
    inquiries = query.order_by(ContactInquiry.created_at.desc()).offset(skip).limit(limit).all()
    return inquiries

@router.put("/{inquiry_id}/read")
def mark_as_read(
    inquiry_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Mark inquiry as read (admin only)"""
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    inquiry.is_read = True
    db.commit()
    return {"message": "Inquiry marked as read"}

@router.delete("/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete inquiry (admin only)"""
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    db.delete(inquiry)
    db.commit()
    return {"message": "Inquiry deleted successfully"}
