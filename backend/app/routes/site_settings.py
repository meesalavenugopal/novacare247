from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import SiteSetting
from app.schemas import SiteSettingCreate, SiteSettingResponse, SiteSettingUpdate
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/site-settings", tags=["Site Settings"])


@router.get("/", response_model=List[SiteSettingResponse])
def get_all_settings(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all site settings (public endpoint)"""
    query = db.query(SiteSetting)
    if category:
        query = query.filter(SiteSetting.category == category)
    return query.all()


@router.get("/by-key/{key}/")
def get_setting_by_key(key: str, db: Session = Depends(get_db)):
    """Get a specific setting by key"""
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting with key '{key}' not found")
    return {"key": setting.key, "value": setting.value}


@router.get("/category/{category}/", response_model=List[SiteSettingResponse])
def get_settings_by_category(category: str, db: Session = Depends(get_db)):
    """Get settings by category"""
    settings = db.query(SiteSetting).filter(SiteSetting.category == category).all()
    return settings


@router.get("/grouped/")
def get_settings_grouped(db: Session = Depends(get_db)):
    """Get all settings grouped by category"""
    settings = db.query(SiteSetting).all()
    grouped = {}
    for setting in settings:
        if setting.category not in grouped:
            grouped[setting.category] = {}
        grouped[setting.category][setting.key] = setting.value
    return grouped


@router.post("/", response_model=SiteSettingResponse)
def create_setting(
    setting_data: SiteSettingCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new site setting (admin only)"""
    # Check if key already exists
    existing = db.query(SiteSetting).filter(SiteSetting.key == setting_data.key).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Setting with key '{setting_data.key}' already exists")
    
    new_setting = SiteSetting(**setting_data.model_dump())
    db.add(new_setting)
    db.commit()
    db.refresh(new_setting)
    return new_setting


@router.put("/by-key/{key}/", response_model=SiteSettingResponse)
def update_setting_by_key(
    key: str,
    setting_data: SiteSettingUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update setting by key (admin only)"""
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting with key '{key}' not found")
    
    update_data = setting_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)
    
    db.commit()
    db.refresh(setting)
    return setting


@router.delete("/by-key/{key}/")
def delete_setting_by_key(
    key: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete setting by key (admin only)"""
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting with key '{key}' not found")
    
    db.delete(setting)
    db.commit()
    return {"message": f"Setting '{key}' deleted successfully"}


@router.post("/bulk/")
def upsert_settings_bulk(
    settings: List[SiteSettingCreate],
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create or update multiple settings at once (admin only)"""
    results = []
    for setting_data in settings:
        existing = db.query(SiteSetting).filter(SiteSetting.key == setting_data.key).first()
        if existing:
            # Update existing
            for field, value in setting_data.model_dump().items():
                setattr(existing, field, value)
            results.append({"key": setting_data.key, "action": "updated"})
        else:
            # Create new
            new_setting = SiteSetting(**setting_data.model_dump())
            db.add(new_setting)
            results.append({"key": setting_data.key, "action": "created"})
    
    db.commit()
    return {"message": "Bulk operation completed", "results": results}


@router.put("/{setting_id}/", response_model=SiteSettingResponse)
def update_setting_by_id(
    setting_id: int,
    setting_data: SiteSettingUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update setting by ID (admin only)"""
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    update_data = setting_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)
    
    db.commit()
    db.refresh(setting)
    return setting


@router.delete("/{setting_id}/")
def delete_setting_by_id(
    setting_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete setting by ID (admin only)"""
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    db.delete(setting)
    db.commit()
    return {"message": "Setting deleted successfully"}
