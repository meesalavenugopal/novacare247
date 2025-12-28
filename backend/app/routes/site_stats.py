from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import SiteStat
from app.schemas import SiteStatCreate, SiteStatResponse, SiteStatUpdate
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/site-stats", tags=["Site Stats"])


@router.get("/", response_model=List[SiteStatResponse])
def get_stats(db: Session = Depends(get_db)):
    """Get all active site statistics (public endpoint)"""
    stats = db.query(SiteStat).filter(
        SiteStat.is_active == True
    ).order_by(SiteStat.display_order).all()
    return stats


@router.get("/all", response_model=List[SiteStatResponse])
def get_all_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all stats including inactive (admin only)"""
    stats = db.query(SiteStat).order_by(SiteStat.display_order).all()
    return stats


@router.get("/{stat_id}", response_model=SiteStatResponse)
def get_stat(stat_id: int, db: Session = Depends(get_db)):
    """Get stat by ID"""
    stat = db.query(SiteStat).filter(SiteStat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    return stat


@router.post("/", response_model=SiteStatResponse)
def create_stat(
    stat_data: SiteStatCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new site statistic (admin only)"""
    new_stat = SiteStat(**stat_data.model_dump())
    db.add(new_stat)
    db.commit()
    db.refresh(new_stat)
    return new_stat


@router.put("/{stat_id}", response_model=SiteStatResponse)
def update_stat(
    stat_id: int,
    stat_data: SiteStatUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update stat (admin only)"""
    stat = db.query(SiteStat).filter(SiteStat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    
    update_data = stat_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(stat, key, value)
    
    db.commit()
    db.refresh(stat)
    return stat


@router.delete("/{stat_id}")
def delete_stat(
    stat_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete stat (admin only)"""
    stat = db.query(SiteStat).filter(SiteStat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    
    db.delete(stat)
    db.commit()
    return {"message": "Stat deleted successfully"}
