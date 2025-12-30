"""
Clinic/Branch Onboarding API Routes
Complete workflow: Application → Documentation → Site Verification → Contract → Setup → Training → Activation
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
import json

from app.database import get_db
from app.models import (
    ClinicOnboardingApplication, ClinicOnboardingActivityLog,
    ClinicOnboardingStatus, PartnershipTier, Branch, User
)
from app.schemas import (
    ClinicOnboardingApplicationCreate, ClinicOnboardingApplicationResponse,
    ClinicOnboardingApplicationUpdate, VerifyDocumentationRequest,
    ScheduleSiteVerificationRequest, CompleteSiteVerificationRequest,
    SignContractRequest, CompleteSetupRequest, ScheduleTrainingRequest,
    CompleteClinicTrainingRequest, ActivateClinicRequest,
    ClinicOnboardingActivityLogResponse, ClinicOnboardingDashboardStats
)
from app.auth import get_admin_user

router = APIRouter(prefix="/api/clinic-onboarding", tags=["Clinic Onboarding"])


# ============ HELPER FUNCTIONS ============

def log_activity(
    db: Session,
    application_id: int,
    action: str,
    old_value: Optional[str] = None,
    new_value: Optional[str] = None,
    performed_by: Optional[int] = None,
    performed_by_type: str = "human",
    notes: Optional[str] = None
):
    """Log a clinic onboarding activity"""
    log = ClinicOnboardingActivityLog(
        application_id=application_id,
        action=action,
        old_value=old_value,
        new_value=new_value,
        performed_by=performed_by,
        performed_by_type=performed_by_type,
        notes=notes
    )
    db.add(log)
    db.commit()


def update_application_status(
    db: Session,
    application: ClinicOnboardingApplication,
    new_status: str,
    performed_by: Optional[int] = None,
    performed_by_type: str = "human",
    notes: Optional[str] = None
):
    """Update application status with logging"""
    old_status = application.status
    application.status = new_status
    application.updated_at = datetime.utcnow()
    db.commit()
    
    log_activity(
        db=db,
        application_id=application.id,
        action="status_changed",
        old_value=old_status,
        new_value=new_status,
        performed_by=performed_by,
        performed_by_type=performed_by_type,
        notes=notes
    )


def get_commission_rate(tier: str) -> int:
    """Get commission rate based on partnership tier"""
    rates = {
        "basic": 25,
        "partner": 20,
        "premium": 15
    }
    return rates.get(tier, 25)


def get_stage_description(status: str) -> dict:
    """Get human-readable stage information"""
    stages = {
        "draft": {"stage": 1, "name": "Application", "description": "Complete your application"},
        "submitted": {"stage": 1, "name": "Application", "description": "Application under review"},
        "documentation_pending": {"stage": 2, "name": "Documentation", "description": "Documents being verified"},
        "documentation_approved": {"stage": 2, "name": "Documentation", "description": "Documents verified"},
        "documentation_rejected": {"stage": 2, "name": "Documentation", "description": "Documents rejected"},
        "site_verification_pending": {"stage": 3, "name": "Site Verification", "description": "Awaiting inspection scheduling"},
        "site_verification_scheduled": {"stage": 3, "name": "Site Verification", "description": "Inspection scheduled"},
        "site_verification_completed": {"stage": 3, "name": "Site Verification", "description": "Inspection under review"},
        "site_verification_passed": {"stage": 3, "name": "Site Verification", "description": "Inspection passed"},
        "site_verification_failed": {"stage": 3, "name": "Site Verification", "description": "Inspection failed"},
        "contract_pending": {"stage": 4, "name": "Contract", "description": "Awaiting contract signing"},
        "contract_signed": {"stage": 4, "name": "Contract", "description": "Contract signed"},
        "setup_pending": {"stage": 5, "name": "Setup", "description": "Platform setup in progress"},
        "setup_completed": {"stage": 5, "name": "Setup", "description": "Platform setup completed"},
        "training_pending": {"stage": 6, "name": "Training", "description": "Training not started"},
        "training_in_progress": {"stage": 6, "name": "Training", "description": "Training in progress"},
        "training_completed": {"stage": 6, "name": "Training", "description": "Training completed"},
        "activation_pending": {"stage": 7, "name": "Activation", "description": "Awaiting final approval"},
        "activated": {"stage": 8, "name": "Active", "description": "Clinic is live!"},
        "suspended": {"stage": 0, "name": "Suspended", "description": "Account suspended"},
        "rejected": {"stage": 0, "name": "Rejected", "description": "Application rejected"},
    }
    return stages.get(status, {"stage": 0, "name": "Unknown", "description": "Unknown status"})


# ============ PUBLIC ENDPOINTS (For Clinic Applicants) ============

@router.post("/apply/", response_model=ClinicOnboardingApplicationResponse)
def create_application(
    application: ClinicOnboardingApplicationCreate,
    db: Session = Depends(get_db)
):
    """Create a new clinic onboarding application"""
    # Check if email already has an active application
    existing = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.email == application.email,
        ClinicOnboardingApplication.status.notin_([
            ClinicOnboardingStatus.REJECTED,
            ClinicOnboardingStatus.ACTIVATED
        ])
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An application with this email is already in progress"
        )
    
    # Set commission rate based on tier
    commission_rate = get_commission_rate(application.partnership_tier)
    
    db_application = ClinicOnboardingApplication(
        **application.dict(),
        commission_rate=commission_rate
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    log_activity(
        db=db,
        application_id=db_application.id,
        action="application_created",
        new_value=ClinicOnboardingStatus.DRAFT,
        performed_by_type="system"
    )
    
    return db_application


@router.put("/apply/{application_id}/", response_model=ClinicOnboardingApplicationResponse)
def update_application(
    application_id: int,
    updates: ClinicOnboardingApplicationUpdate,
    db: Session = Depends(get_db)
):
    """Update a draft application"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != ClinicOnboardingStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Can only update draft applications"
        )
    
    update_data = updates.dict(exclude_unset=True)
    
    # Update commission rate if tier changes
    if 'partnership_tier' in update_data:
        update_data['commission_rate'] = get_commission_rate(update_data['partnership_tier'])
    
    for key, value in update_data.items():
        setattr(application, key, value)
    
    application.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(application)
    
    return application


@router.post("/apply/{application_id}/submit/", response_model=ClinicOnboardingApplicationResponse)
def submit_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Submit application for review"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != ClinicOnboardingStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Application already submitted"
        )
    
    # Validate required fields
    required_fields = ['clinic_name', 'owner_name', 'email', 'phone', 'address', 'city', 'state']
    missing = [f for f in required_fields if not getattr(application, f)]
    
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing)}"
        )
    
    application.submitted_at = datetime.utcnow()
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.SUBMITTED,
        performed_by_type="system",
        notes="Application submitted by applicant"
    )
    
    db.refresh(application)
    return application


@router.get("/apply/{application_id}/status/")
def check_application_status(
    application_id: int,
    email: str = Query(...),
    db: Session = Depends(get_db)
):
    """Check application status (public endpoint with email verification)"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id,
        ClinicOnboardingApplication.email == email
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {
        "id": application.id,
        "clinic_name": application.clinic_name,
        "status": application.status,
        "submitted_at": application.submitted_at,
        "current_stage": get_stage_description(application.status),
        "partnership_tier": application.partnership_tier,
        "commission_rate": application.commission_rate
    }


# ============ ADMIN ENDPOINTS ============

@router.get("/admin/dashboard/", response_model=ClinicOnboardingDashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get clinic onboarding dashboard statistics"""
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    total = db.query(func.count(ClinicOnboardingApplication.id)).scalar()
    
    pending_documentation = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.SUBMITTED,
            ClinicOnboardingStatus.DOCUMENTATION_PENDING
        ])
    ).scalar()
    
    pending_site_verification = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.DOCUMENTATION_APPROVED,
            ClinicOnboardingStatus.SITE_VERIFICATION_PENDING,
            ClinicOnboardingStatus.SITE_VERIFICATION_SCHEDULED,
            ClinicOnboardingStatus.SITE_VERIFICATION_COMPLETED
        ])
    ).scalar()
    
    pending_contract = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.SITE_VERIFICATION_PASSED,
            ClinicOnboardingStatus.CONTRACT_PENDING
        ])
    ).scalar()
    
    pending_setup = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.CONTRACT_SIGNED,
            ClinicOnboardingStatus.SETUP_PENDING
        ])
    ).scalar()
    
    pending_training = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.SETUP_COMPLETED,
            ClinicOnboardingStatus.TRAINING_PENDING,
            ClinicOnboardingStatus.TRAINING_IN_PROGRESS
        ])
    ).scalar()
    
    pending_activation = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.TRAINING_COMPLETED,
            ClinicOnboardingStatus.ACTIVATION_PENDING
        ])
    ).scalar()
    
    activated_this_month = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status == ClinicOnboardingStatus.ACTIVATED,
        ClinicOnboardingApplication.activated_at >= month_start
    ).scalar()
    
    rejected_this_month = db.query(func.count(ClinicOnboardingApplication.id)).filter(
        ClinicOnboardingApplication.status.in_([
            ClinicOnboardingStatus.REJECTED,
            ClinicOnboardingStatus.DOCUMENTATION_REJECTED,
            ClinicOnboardingStatus.SITE_VERIFICATION_FAILED
        ]),
        ClinicOnboardingApplication.rejected_at >= month_start
    ).scalar()
    
    return ClinicOnboardingDashboardStats(
        total_applications=total or 0,
        pending_documentation=pending_documentation or 0,
        pending_site_verification=pending_site_verification or 0,
        pending_contract=pending_contract or 0,
        pending_setup=pending_setup or 0,
        pending_training=pending_training or 0,
        pending_activation=pending_activation or 0,
        activated_this_month=activated_this_month or 0,
        rejected_this_month=rejected_this_month or 0
    )


@router.get("/admin/applications/", response_model=List[ClinicOnboardingApplicationResponse])
def list_applications(
    status: Optional[str] = Query(None),
    statuses: Optional[str] = Query(None),  # Comma-separated list
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """List all clinic applications with optional status filter"""
    query = db.query(ClinicOnboardingApplication)
    
    if statuses:
        # Support multiple statuses as comma-separated list
        status_list = [s.strip() for s in statuses.split(',')]
        query = query.filter(ClinicOnboardingApplication.status.in_(status_list))
    elif status:
        query = query.filter(ClinicOnboardingApplication.status == status)
    
    applications = query.order_by(
        ClinicOnboardingApplication.updated_at.desc()
    ).offset(skip).limit(limit).all()
    
    return applications


@router.get("/admin/applications/{application_id}/", response_model=ClinicOnboardingApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get single application details"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application


@router.get("/admin/applications/{application_id}/logs/", response_model=List[ClinicOnboardingActivityLogResponse])
def get_application_logs(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get activity logs for an application"""
    logs = db.query(ClinicOnboardingActivityLog).filter(
        ClinicOnboardingActivityLog.application_id == application_id
    ).order_by(ClinicOnboardingActivityLog.created_at.desc()).all()
    
    return logs


# ============ DOCUMENTATION VERIFICATION ============

@router.post("/admin/applications/{application_id}/verify-documentation/")
def verify_documentation(
    application_id: int,
    request: VerifyDocumentationRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Verify clinic documentation"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.SUBMITTED,
        ClinicOnboardingStatus.DOCUMENTATION_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot verify documentation in {application.status} status"
        )
    
    application.documentation_verified_by = admin.id
    application.documentation_notes = request.notes
    application.documentation_verified_at = datetime.utcnow()
    
    if request.approved:
        update_application_status(
            db=db,
            application=application,
            new_status=ClinicOnboardingStatus.DOCUMENTATION_APPROVED,
            performed_by=admin.id,
            notes=request.notes
        )
    else:
        update_application_status(
            db=db,
            application=application,
            new_status=ClinicOnboardingStatus.DOCUMENTATION_REJECTED,
            performed_by=admin.id,
            notes=request.notes
        )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


# ============ SITE VERIFICATION ============

@router.post("/admin/applications/{application_id}/schedule-site-verification/")
def schedule_site_verification(
    application_id: int,
    request: ScheduleSiteVerificationRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Schedule site verification"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.DOCUMENTATION_APPROVED,
        ClinicOnboardingStatus.SITE_VERIFICATION_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot schedule site verification in {application.status} status"
        )
    
    application.site_verification_scheduled_at = request.scheduled_at
    application.site_verification_type = request.verification_type
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.SITE_VERIFICATION_SCHEDULED,
        performed_by=admin.id,
        notes=f"Site verification ({request.verification_type}) scheduled for {request.scheduled_at}"
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


@router.post("/admin/applications/{application_id}/complete-site-verification/")
def complete_site_verification(
    application_id: int,
    request: CompleteSiteVerificationRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Complete site verification"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.SITE_VERIFICATION_SCHEDULED,
        ClinicOnboardingStatus.SITE_VERIFICATION_COMPLETED
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot complete site verification in {application.status} status"
        )
    
    application.site_verification_score = request.score
    application.site_verification_notes = request.notes
    if request.photos:
        application.site_verification_photos = json.dumps(request.photos)
    application.site_verified_by = admin.id
    application.site_verified_at = datetime.utcnow()
    
    if request.passed:
        update_application_status(
            db=db,
            application=application,
            new_status=ClinicOnboardingStatus.SITE_VERIFICATION_PASSED,
            performed_by=admin.id,
            notes=f"Site verification passed with score {request.score}"
        )
    else:
        update_application_status(
            db=db,
            application=application,
            new_status=ClinicOnboardingStatus.SITE_VERIFICATION_FAILED,
            performed_by=admin.id,
            notes=f"Site verification failed: {request.notes}"
        )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


# ============ CONTRACT ============

@router.post("/admin/applications/{application_id}/sign-contract/")
def sign_contract(
    application_id: int,
    request: SignContractRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Sign partnership contract"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.SITE_VERIFICATION_PASSED,
        ClinicOnboardingStatus.CONTRACT_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot sign contract in {application.status} status"
        )
    
    application.contract_document_url = request.contract_document_url
    application.contract_start_date = request.start_date
    application.contract_end_date = request.end_date
    application.contract_signed_at = datetime.utcnow()
    application.partnership_tier = request.partnership_tier
    application.commission_rate = get_commission_rate(request.partnership_tier)
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.CONTRACT_SIGNED,
        performed_by=admin.id,
        notes=f"Contract signed. Tier: {request.partnership_tier}, Commission: {application.commission_rate}%"
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


# ============ SETUP ============

@router.post("/admin/applications/{application_id}/complete-setup/")
def complete_setup(
    application_id: int,
    request: CompleteSetupRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Complete platform setup for clinic"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.CONTRACT_SIGNED,
        ClinicOnboardingStatus.SETUP_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot complete setup in {application.status} status"
        )
    
    application.setup_completed_by = admin.id
    application.setup_completed_at = datetime.utcnow()
    application.setup_notes = request.notes
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.SETUP_COMPLETED,
        performed_by=admin.id,
        notes=request.notes or "Platform setup completed"
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


# ============ TRAINING ============

@router.post("/admin/applications/{application_id}/schedule-training/")
def schedule_training(
    application_id: int,
    request: ScheduleTrainingRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Schedule staff training"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.SETUP_COMPLETED,
        ClinicOnboardingStatus.TRAINING_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot schedule training in {application.status} status"
        )
    
    application.training_scheduled_at = request.scheduled_at
    application.training_attendees = json.dumps(request.attendees)
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.TRAINING_IN_PROGRESS,
        performed_by=admin.id,
        notes=f"Training scheduled for {request.scheduled_at} with {len(request.attendees)} attendees"
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


@router.post("/admin/applications/{application_id}/complete-training/")
def complete_training(
    application_id: int,
    request: CompleteClinicTrainingRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Complete staff training"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != ClinicOnboardingStatus.TRAINING_IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot complete training in {application.status} status"
        )
    
    application.training_completed_at = datetime.utcnow()
    application.training_score = request.score
    application.training_notes = request.notes
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.TRAINING_COMPLETED,
        performed_by=admin.id,
        notes=f"Training completed with score {request.score}"
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


# ============ ACTIVATION ============

@router.post("/admin/applications/{application_id}/activate/")
def activate_clinic(
    application_id: int,
    request: ActivateClinicRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Activate clinic on platform"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [
        ClinicOnboardingStatus.TRAINING_COMPLETED,
        ClinicOnboardingStatus.ACTIVATION_PENDING
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot activate in {application.status} status"
        )
    
    if not request.approved:
        update_application_status(
            db=db,
            application=application,
            new_status=ClinicOnboardingStatus.ACTIVATION_PENDING,
            performed_by=admin.id,
            notes=request.notes or "Activation pending - requires review"
        )
        db.refresh(application)
        return {"success": True, "status": application.status}
    
    # Create Branch for the clinic
    branch = Branch(
        name=application.clinic_name,
        country=application.country,
        state=application.state,
        city=application.city,
        address=application.address,
        pincode=application.pincode,
        phone=application.phone,
        email=application.email,
        latitude=application.latitude,
        longitude=application.longitude,
        business_hours=application.operating_hours,
        is_active=True
    )
    db.add(branch)
    db.commit()
    db.refresh(branch)
    
    # Link application to branch
    application.branch_id = branch.id
    application.activated_by = admin.id
    application.activated_at = datetime.utcnow()
    application.activation_notes = request.notes
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.ACTIVATED,
        performed_by=admin.id,
        notes=f"Clinic activated and linked to branch {branch.id}"
    )
    
    db.refresh(application)
    return {
        "success": True,
        "status": application.status,
        "branch_id": branch.id
    }


# ============ REJECTION & SUSPENSION ============

@router.post("/admin/applications/{application_id}/reject/")
def reject_application(
    application_id: int,
    reason: str = Query(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Reject clinic application"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status == ClinicOnboardingStatus.ACTIVATED:
        raise HTTPException(
            status_code=400,
            detail="Cannot reject an activated clinic. Use suspend instead."
        )
    
    application.rejection_reason = reason
    application.rejected_by = admin.id
    application.rejected_at = datetime.utcnow()
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.REJECTED,
        performed_by=admin.id,
        notes=reason
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}


@router.post("/admin/applications/{application_id}/suspend/")
def suspend_clinic(
    application_id: int,
    reason: str = Query(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Suspend an activated clinic"""
    application = db.query(ClinicOnboardingApplication).filter(
        ClinicOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != ClinicOnboardingStatus.ACTIVATED:
        raise HTTPException(
            status_code=400,
            detail="Can only suspend activated clinics"
        )
    
    # Deactivate the linked branch
    if application.branch_id:
        branch = db.query(Branch).filter(Branch.id == application.branch_id).first()
        if branch:
            branch.is_active = False
            db.commit()
    
    application.rejection_reason = reason
    application.rejected_by = admin.id
    application.rejected_at = datetime.utcnow()
    
    update_application_status(
        db=db,
        application=application,
        new_status=ClinicOnboardingStatus.SUSPENDED,
        performed_by=admin.id,
        notes=reason
    )
    
    db.refresh(application)
    return {"success": True, "status": application.status}
