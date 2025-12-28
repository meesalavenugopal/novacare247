from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Milestone
from app.schemas import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/milestones", tags=["Milestones"])


@router.get("/", response_model=List[MilestoneResponse])
def get_milestones(db: Session = Depends(get_db)):
    """Get all active milestones (public endpoint)"""
    milestones = db.query(Milestone).filter(
        Milestone.is_active == True
    ).order_by(Milestone.display_order, Milestone.year).all()
    return milestones


@router.get("/all/", response_model=List[MilestoneResponse])
def get_all_milestones(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all milestones including inactive (admin only)"""
    milestones = db.query(Milestone).order_by(Milestone.display_order, Milestone.year).all()
    return milestones


@router.get("/{milestone_id}/", response_model=MilestoneResponse)
def get_milestone(milestone_id: int, db: Session = Depends(get_db)):
    """Get milestone by ID"""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone


@router.post("/", response_model=MilestoneResponse)
def create_milestone(
    milestone_data: MilestoneCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new milestone (admin only)"""
    new_milestone = Milestone(**milestone_data.model_dump())
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone


@router.put("/{milestone_id}/", response_model=MilestoneResponse)
def update_milestone(
    milestone_id: int,
    milestone_data: MilestoneUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update milestone (admin only)"""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    update_data = milestone_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(milestone, key, value)
    
    db.commit()
    db.refresh(milestone)
    return milestone


@router.delete("/{milestone_id}/")
def delete_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete milestone (admin only)"""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    db.delete(milestone)
    db.commit()
    return {"message": "Milestone deleted successfully"}
