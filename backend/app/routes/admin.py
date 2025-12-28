from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import User, Doctor, Booking, Service, BookingStatus, UserRole
from app.schemas import DashboardStats
from app.auth import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get dashboard statistics (admin only)"""
    total_doctors = db.query(Doctor).count()
    total_patients = db.query(User).filter(User.role == UserRole.PATIENT).count()
    total_bookings = db.query(Booking).count()
    pending_bookings = db.query(Booking).filter(Booking.status == BookingStatus.PENDING).count()
    today_bookings = db.query(Booking).filter(Booking.booking_date == date.today()).count()
    total_services = db.query(Service).filter(Service.is_active == True).count()
    
    return DashboardStats(
        total_doctors=total_doctors,
        total_patients=total_patients,
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        today_bookings=today_bookings,
        total_services=total_services
    )

@router.get("/users/")
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get all users (admin only)"""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.id).offset(skip).limit(limit).all()
    return users
