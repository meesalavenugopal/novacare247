from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from app.database import get_db
from app.models import Service
from app.schemas import ServiceCreate, ServiceResponse, ServiceUpdate, ServicePublic
from app.auth import get_admin_user
from app.models import User
from app.utils.slugs import generate_service_slug

router = APIRouter(prefix="/api/services", tags=["Services"])


def build_service_public(service: Service) -> ServicePublic:
    """Helper to build ServicePublic response with parsed JSON fields"""
    # Parse JSON fields
    benefits = None
    if service.benefits:
        try:
            benefits = json.loads(service.benefits)
        except:
            benefits = [service.benefits]
    
    conditions = None
    if service.conditions_treated:
        try:
            conditions = json.loads(service.conditions_treated)
        except:
            conditions = [service.conditions_treated]
    
    process = None
    if service.treatment_process:
        try:
            process = json.loads(service.treatment_process)
        except:
            process = None
    
    faqs = None
    if service.faqs:
        try:
            faqs = json.loads(service.faqs)
        except:
            faqs = None
    
    return ServicePublic(
        id=service.id,
        slug=service.slug,
        name=service.name,
        description=service.description,
        detailed_description=service.detailed_description,
        duration=service.duration,
        price=service.price,
        image=service.image,
        icon=service.icon,
        benefits=benefits,
        conditions_treated=conditions,
        treatment_process=process,
        faqs=faqs,
        is_active=service.is_active
    )


@router.get("/", response_model=List[ServiceResponse])
def get_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all active services (public endpoint)"""
    services = db.query(Service).filter(Service.is_active == True).order_by(Service.id).offset(skip).limit(limit).all()
    return services

@router.get("/all/", response_model=List[ServiceResponse])
def get_all_services(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all services including inactive (admin only)"""
    services = db.query(Service).order_by(Service.id).offset(skip).limit(limit).all()
    return services


@router.get("/slug/{slug}/", response_model=ServicePublic)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get service by slug (SEO-friendly URL)"""
    service = db.query(Service).filter(Service.slug == slug).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return build_service_public(service)


@router.get("/{service_id}/", response_model=ServicePublic)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get service by ID with full details"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return build_service_public(service)

@router.post("/", response_model=ServiceResponse)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new service (admin only)"""
    # Generate unique slug from service name
    slug = generate_service_slug(db, service_data.name)
    service_dict = service_data.model_dump()
    service_dict['slug'] = slug
    new_service = Service(**service_dict)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.put("/{service_id}/", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update service (admin only)"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}/")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete service (admin only)"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service.is_active = False
    db.commit()
    return {"message": "Service deleted successfully"}
