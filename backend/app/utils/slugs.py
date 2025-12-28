"""
Utility functions for generating unique slugs
"""
import re
from sqlalchemy.orm import Session


def generate_slug(text: str) -> str:
    """Generate URL-friendly slug from text"""
    if not text:
        return ""
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def generate_unique_slug(db: Session, model, base_text: str, existing_id: int = None) -> str:
    """
    Generate a unique slug for a model, appending numbers if necessary.
    
    Args:
        db: Database session
        model: SQLAlchemy model class (must have 'slug' and 'id' columns)
        base_text: Text to generate slug from
        existing_id: If updating, the ID of the current record to exclude from check
    
    Returns:
        A unique slug string
    """
    base_slug = generate_slug(base_text)
    
    if not base_slug:
        base_slug = "item"
    
    slug = base_slug
    counter = 1
    
    while True:
        # Check if slug exists
        query = db.query(model).filter(model.slug == slug)
        
        # Exclude current record when updating
        if existing_id:
            query = query.filter(model.id != existing_id)
        
        existing = query.first()
        
        if not existing:
            return slug
        
        # Append counter and try again
        counter += 1
        slug = f"{base_slug}-{counter}"
        
        # Safety limit
        if counter > 1000:
            import uuid
            return f"{base_slug}-{uuid.uuid4().hex[:8]}"


def generate_doctor_slug(db: Session, doctor_name: str, existing_id: int = None) -> str:
    """Generate unique slug for a doctor"""
    from app.models import Doctor
    
    # Prefix with 'dr-' for doctors
    if not doctor_name.lower().startswith('dr'):
        base_text = f"dr-{doctor_name}"
    else:
        base_text = doctor_name
    
    return generate_unique_slug(db, Doctor, base_text, existing_id)


def generate_service_slug(db: Session, service_name: str, existing_id: int = None) -> str:
    """Generate unique slug for a service"""
    from app.models import Service
    return generate_unique_slug(db, Service, service_name, existing_id)
