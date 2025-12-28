from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import Branch, Doctor
from app.schemas import BranchCreate, BranchResponse, BranchUpdate, BranchWithDoctorCount
from app.auth import get_admin_user
from app.models import User

router = APIRouter(prefix="/api/branches", tags=["Branches"])


@router.get("/", response_model=List[BranchResponse])
def get_branches(
    country: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all active branches (public endpoint) with optional filters"""
    query = db.query(Branch).filter(Branch.is_active == True)
    
    if country:
        query = query.filter(Branch.country == country)
    if state:
        query = query.filter(Branch.state == state)
    if city:
        query = query.filter(Branch.city == city)
    
    return query.all()


@router.get("/all/", response_model=List[BranchResponse])
def get_all_branches(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all branches including inactive (admin only)"""
    return db.query(Branch).all()


@router.get("/countries/")
def get_countries(db: Session = Depends(get_db)):
    """Get list of unique countries with branches"""
    countries = db.query(Branch.country).filter(
        Branch.is_active == True
    ).distinct().all()
    return [c[0] for c in countries]


@router.get("/states/")
def get_states(country: Optional[str] = None, db: Session = Depends(get_db)):
    """Get list of unique states, optionally filtered by country"""
    query = db.query(Branch.state).filter(Branch.is_active == True)
    if country:
        query = query.filter(Branch.country == country)
    states = query.distinct().all()
    return [s[0] for s in states]


@router.get("/cities/")
def get_cities(
    country: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of unique cities, optionally filtered by country/state"""
    query = db.query(Branch.city).filter(Branch.is_active == True)
    if country:
        query = query.filter(Branch.country == country)
    if state:
        query = query.filter(Branch.state == state)
    cities = query.distinct().all()
    return [c[0] for c in cities]


@router.get("/with-counts/")
def get_branches_with_doctor_counts(db: Session = Depends(get_db)):
    """Get branches with doctor counts"""
    branches = db.query(Branch).filter(Branch.is_active == True).all()
    result = []
    for branch in branches:
        doctor_count = db.query(func.count(Doctor.id)).filter(
            Doctor.branch_id == branch.id
        ).scalar()
        branch_dict = {
            "id": branch.id,
            "name": branch.name,
            "country": branch.country,
            "state": branch.state,
            "city": branch.city,
            "address": branch.address,
            "pincode": branch.pincode,
            "phone": branch.phone,
            "email": branch.email,
            "latitude": branch.latitude,
            "longitude": branch.longitude,
            "business_hours": branch.business_hours,
            "is_active": branch.is_active,
            "is_headquarters": branch.is_headquarters,
            "doctor_count": doctor_count
        }
        result.append(branch_dict)
    return result


@router.get("/headquarters/", response_model=BranchResponse)
def get_headquarters(db: Session = Depends(get_db)):
    """Get the headquarters branch"""
    hq = db.query(Branch).filter(
        Branch.is_headquarters == True,
        Branch.is_active == True
    ).first()
    if not hq:
        raise HTTPException(status_code=404, detail="Headquarters not found")
    return hq


@router.get("/{branch_id}/", response_model=BranchResponse)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """Get branch by ID"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch


@router.post("/", response_model=BranchResponse)
def create_branch(
    branch_data: BranchCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new branch (admin only)"""
    new_branch = Branch(**branch_data.model_dump())
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    return new_branch


@router.put("/{branch_id}/", response_model=BranchResponse)
def update_branch(
    branch_id: int,
    branch_data: BranchUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Update branch (admin only)"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    
    update_data = branch_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(branch, key, value)
    
    db.commit()
    db.refresh(branch)
    return branch


@router.delete("/{branch_id}/")
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Delete branch (admin only)"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    
    # Check if any doctors are assigned
    doctor_count = db.query(func.count(Doctor.id)).filter(
        Doctor.branch_id == branch_id
    ).scalar()
    if doctor_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete branch with {doctor_count} assigned doctors"
        )
    
    db.delete(branch)
    db.commit()
    return {"message": "Branch deleted successfully"}
