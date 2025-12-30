"""
Doctor Onboarding API Routes
Complete workflow: Application → AI Verification → Human Approval → Interview → Training → Activation
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
import json

from app.database import get_db
from app.models import (
    DoctorOnboardingApplication, OnboardingActivityLog, TrainingModule,
    OnboardingStatus, Doctor, User, UserRole, Branch
)
from app.schemas import (
    OnboardingApplicationCreate, OnboardingApplicationResponse, OnboardingApplicationUpdate,
    AIVerificationResponse, HumanVerificationRequest, ScheduleInterviewRequest,
    AIInterviewQuestionsResponse, CompleteInterviewRequest, CompleteTrainingRequest,
    ActivationRequest, TrainingModuleCreate, TrainingModuleResponse, TrainingModuleUpdate,
    OnboardingActivityLogResponse, OnboardingDashboardStats
)
from app.auth import get_admin_user, get_password_hash
from app.ai_service import (
    verify_doctor_credentials, generate_interview_questions,
    generate_training_content, generate_onboarding_email
)

router = APIRouter(prefix="/api/onboarding", tags=["Doctor Onboarding"])


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
    """Log an onboarding activity"""
    log = OnboardingActivityLog(
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
    application: DoctorOnboardingApplication,
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


# ============ PUBLIC ENDPOINTS (For Applicants) ============

@router.post("/apply/", response_model=OnboardingApplicationResponse)
def create_application(
    application: OnboardingApplicationCreate,
    db: Session = Depends(get_db)
):
    """Create a new doctor onboarding application"""
    # Check if email already has an active application
    existing = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.email == application.email,
        DoctorOnboardingApplication.status.notin_([
            OnboardingStatus.REJECTED,
            OnboardingStatus.ACTIVATED
        ])
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An application with this email is already in progress"
        )
    
    db_application = DoctorOnboardingApplication(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    log_activity(
        db=db,
        application_id=db_application.id,
        action="application_created",
        new_value=OnboardingStatus.DRAFT,
        performed_by_type="system"
    )
    
    return db_application


@router.put("/apply/{application_id}/", response_model=OnboardingApplicationResponse)
def update_application(
    application_id: int,
    updates: OnboardingApplicationUpdate,
    db: Session = Depends(get_db)
):
    """Update a draft application"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Can only update draft applications"
        )
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(application, key, value)
    
    application.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(application)
    
    return application


@router.post("/apply/{application_id}/submit/", response_model=OnboardingApplicationResponse)
def submit_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Submit application for review"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Application already submitted"
        )
    
    # Validate required fields
    required_fields = ['full_name', 'email', 'phone', 'specialization', 
                       'qualification', 'license_number']
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
        new_status=OnboardingStatus.SUBMITTED,
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
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id,
        DoctorOnboardingApplication.email == email
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {
        "id": application.id,
        "status": application.status,
        "submitted_at": application.submitted_at,
        "current_stage": get_stage_description(application.status)
    }


def get_stage_description(status: str) -> dict:
    """Get human-readable stage information"""
    stages = {
        "draft": {"stage": 1, "name": "Application", "description": "Complete your application"},
        "submitted": {"stage": 1, "name": "Application", "description": "Application under review"},
        "verification_pending": {"stage": 2, "name": "Verification", "description": "Credentials being verified"},
        "verification_approved": {"stage": 2, "name": "Verification", "description": "Credentials verified"},
        "verification_rejected": {"stage": 2, "name": "Verification", "description": "Verification failed"},
        "interview_scheduled": {"stage": 3, "name": "Interview", "description": "Interview scheduled"},
        "interview_completed": {"stage": 3, "name": "Interview", "description": "Interview under review"},
        "interview_passed": {"stage": 3, "name": "Interview", "description": "Interview passed"},
        "interview_failed": {"stage": 3, "name": "Interview", "description": "Interview not passed"},
        "training_pending": {"stage": 4, "name": "Training", "description": "Training not started"},
        "training_in_progress": {"stage": 4, "name": "Training", "description": "Training in progress"},
        "training_completed": {"stage": 4, "name": "Training", "description": "Training completed"},
        "activation_pending": {"stage": 5, "name": "Activation", "description": "Awaiting final approval"},
        "activated": {"stage": 6, "name": "Active", "description": "Profile is live!"},
        "suspended": {"stage": 0, "name": "Suspended", "description": "Account suspended"},
        "rejected": {"stage": 0, "name": "Rejected", "description": "Application rejected"},
    }
    return stages.get(status, {"stage": 0, "name": "Unknown", "description": "Unknown status"})


# ============ ADMIN ENDPOINTS ============

@router.get("/admin/dashboard/", response_model=OnboardingDashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get onboarding dashboard statistics"""
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    total = db.query(func.count(DoctorOnboardingApplication.id)).scalar()
    
    pending_verification = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status.in_([
            OnboardingStatus.SUBMITTED,
            OnboardingStatus.VERIFICATION_PENDING
        ])
    ).scalar()
    
    pending_interview = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status.in_([
            OnboardingStatus.VERIFICATION_APPROVED,
            OnboardingStatus.INTERVIEW_SCHEDULED,
            OnboardingStatus.INTERVIEW_COMPLETED
        ])
    ).scalar()
    
    training_pending = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status == OnboardingStatus.TRAINING_PENDING
    ).scalar()
    
    pending_training = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status.in_([
            OnboardingStatus.INTERVIEW_PASSED,
            OnboardingStatus.TRAINING_PENDING,
            OnboardingStatus.TRAINING_IN_PROGRESS
        ])
    ).scalar()
    
    pending_activation = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status.in_([
            OnboardingStatus.TRAINING_COMPLETED,
            OnboardingStatus.ACTIVATION_PENDING
        ])
    ).scalar()
    
    activated_this_month = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status == OnboardingStatus.ACTIVATED,
        DoctorOnboardingApplication.activated_at >= month_start
    ).scalar()
    
    rejected_this_month = db.query(func.count(DoctorOnboardingApplication.id)).filter(
        DoctorOnboardingApplication.status.in_([
            OnboardingStatus.REJECTED,
            OnboardingStatus.VERIFICATION_REJECTED,
            OnboardingStatus.INTERVIEW_FAILED
        ]),
        DoctorOnboardingApplication.rejected_at >= month_start
    ).scalar()
    
    return OnboardingDashboardStats(
        total_applications=total or 0,
        pending_verification=pending_verification or 0,
        pending_interview=pending_interview or 0,
        training_pending=training_pending or 0,
        pending_training=pending_training or 0,
        pending_activation=pending_activation or 0,
        activated_this_month=activated_this_month or 0,
        rejected_this_month=rejected_this_month or 0
    )


@router.get("/admin/applications/", response_model=List[OnboardingApplicationResponse])
def list_applications(
    status: Optional[str] = Query(None),
    statuses: Optional[str] = Query(None),  # Comma-separated list
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """List all applications with optional status filter"""
    query = db.query(DoctorOnboardingApplication)
    
    if statuses:
        # Support multiple statuses as comma-separated list
        status_list = [s.strip() for s in statuses.split(',')]
        query = query.filter(DoctorOnboardingApplication.status.in_(status_list))
    elif status:
        query = query.filter(DoctorOnboardingApplication.status == status)
    
    applications = query.order_by(
        DoctorOnboardingApplication.updated_at.desc()
    ).offset(skip).limit(limit).all()
    
    return applications


@router.get("/admin/applications/{application_id}/", response_model=OnboardingApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get single application details"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application


@router.get("/admin/applications/by-doctor/{doctor_id}/", response_model=OnboardingApplicationResponse)
def get_application_by_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get application details by linked doctor ID"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.doctor_id == doctor_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="No application found for this doctor")
    
    return application


@router.get("/admin/applications/{application_id}/logs/", response_model=List[OnboardingActivityLogResponse])
def get_application_logs(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Get activity logs for an application"""
    logs = db.query(OnboardingActivityLog).filter(
        OnboardingActivityLog.application_id == application_id
    ).order_by(OnboardingActivityLog.created_at.desc()).all()
    
    return logs


# ============ VERIFICATION WORKFLOW ============

@router.post("/admin/applications/{application_id}/ai-verify/", response_model=AIVerificationResponse)
def run_ai_verification(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Run AI verification on credentials (requires human approval after)"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status not in [OnboardingStatus.SUBMITTED, OnboardingStatus.VERIFICATION_PENDING]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot verify application in {application.status} status"
        )
    
    # Run AI verification
    result = verify_doctor_credentials(
        name=application.full_name,
        license_number=application.license_number or "",
        license_authority=application.license_issuing_authority or "",
        qualification=application.qualification or "",
        experience_years=application.experience_years or 0,
        specialization=application.specialization or ""
    )
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail="AI verification failed. Please try again."
        )
    
    # Save AI results
    application.ai_verification_score = result.get("score", 0)
    application.ai_verification_notes = json.dumps(result)
    application.ai_verification_completed_at = datetime.utcnow()
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.VERIFICATION_PENDING,
        performed_by=admin.id,
        performed_by_type="ai",
        notes=f"AI verification completed. Score: {result.get('score', 0)}/100. Awaiting human approval."
    )
    
    return AIVerificationResponse(
        score=result.get("score", 0),
        analysis=result.get("analysis", {}),
        recommendations=result.get("recommendations", []),
        flags=result.get("flags", [])
    )


@router.post("/admin/applications/{application_id}/verify/")
def human_verify_application(
    application_id: int,
    request: HumanVerificationRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Human approval/rejection of verification (REQUIRED step)"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.VERIFICATION_PENDING:
        raise HTTPException(
            status_code=400,
            detail="Application must be in verification_pending status"
        )
    
    application.verified_by = admin.id
    application.verification_notes = request.notes
    application.verified_at = datetime.utcnow()
    
    if request.approved:
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.VERIFICATION_APPROVED,
            performed_by=admin.id,
            notes=f"Credentials verified by admin. Notes: {request.notes or 'None'}"
        )
        return {"message": "Verification approved", "next_step": "Schedule interview"}
    else:
        application.rejection_reason = request.notes
        application.rejected_by = admin.id
        application.rejected_at = datetime.utcnow()
        
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.VERIFICATION_REJECTED,
            performed_by=admin.id,
            notes=f"Credentials rejected. Reason: {request.notes or 'Not specified'}"
        )
        return {"message": "Verification rejected", "reason": request.notes}


# ============ INTERVIEW WORKFLOW ============

@router.post("/admin/applications/{application_id}/generate-questions/", response_model=AIInterviewQuestionsResponse)
def generate_ai_interview_questions(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Generate AI interview questions for the candidate"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    result = generate_interview_questions(
        name=application.full_name,
        specialization=application.specialization or "",
        experience_years=application.experience_years or 0,
        qualification=application.qualification or ""
    )
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview questions"
        )
    
    # Flatten questions from all categories
    all_questions = []
    for category in ["clinical_knowledge", "patient_handling", "ethics_compliance", 
                     "platform_fit", "scenario_based"]:
        if category in result:
            all_questions.extend(result[category])
    
    # Save questions
    application.ai_interview_questions = json.dumps(all_questions)
    db.commit()
    
    log_activity(
        db=db,
        application_id=application.id,
        action="interview_questions_generated",
        performed_by=admin.id,
        performed_by_type="ai",
        notes=f"Generated {len(all_questions)} interview questions"
    )
    
    return AIInterviewQuestionsResponse(questions=all_questions)


@router.post("/admin/applications/{application_id}/schedule-interview/")
def schedule_interview(
    application_id: int,
    request: ScheduleInterviewRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Schedule interview for the candidate"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.VERIFICATION_APPROVED:
        raise HTTPException(
            status_code=400,
            detail="Application must be verified before scheduling interview"
        )
    
    application.interview_scheduled_at = request.scheduled_at
    application.interview_meeting_link = request.meeting_link
    application.interview_conducted_by = admin.id
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.INTERVIEW_SCHEDULED,
        performed_by=admin.id,
        notes=f"Interview scheduled for {request.scheduled_at}"
    )
    
    return {"message": "Interview scheduled", "scheduled_at": request.scheduled_at}


@router.post("/admin/applications/{application_id}/complete-interview/")
def complete_interview(
    application_id: int,
    request: CompleteInterviewRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Complete interview with score and result"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.INTERVIEW_SCHEDULED:
        raise HTTPException(
            status_code=400,
            detail="Interview must be scheduled first"
        )
    
    application.interview_score = request.score
    application.interview_notes = request.notes
    application.interview_completed_at = datetime.utcnow()
    
    if request.passed:
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.INTERVIEW_PASSED,
            performed_by=admin.id,
            notes=f"Interview passed. Score: {request.score}/100"
        )
        
        # Auto-transition to training pending
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.TRAINING_PENDING,
            performed_by=admin.id,
            performed_by_type="system",
            notes="Ready for training"
        )
        
        return {"message": "Interview passed", "next_step": "Start training"}
    else:
        application.rejection_reason = request.notes
        application.rejected_by = admin.id
        application.rejected_at = datetime.utcnow()
        
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.INTERVIEW_FAILED,
            performed_by=admin.id,
            notes=f"Interview not passed. Score: {request.score}/100"
        )
        
        return {"message": "Interview not passed", "score": request.score}


# ============ TRAINING WORKFLOW ============

@router.get("/training-modules/", response_model=List[TrainingModuleResponse])
def list_training_modules(
    db: Session = Depends(get_db)
):
    """List all active training modules"""
    modules = db.query(TrainingModule).filter(
        TrainingModule.is_active == True
    ).order_by(TrainingModule.display_order).all()
    
    return modules


@router.post("/admin/training-modules/", response_model=TrainingModuleResponse)
def create_training_module(
    module: TrainingModuleCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Create a new training module"""
    db_module = TrainingModule(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module


@router.post("/admin/training-modules/generate/", response_model=TrainingModuleResponse)
def generate_ai_training_module(
    topic: str = Query(...),
    specialization: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Generate a training module using AI"""
    result = generate_training_content(topic, specialization)
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate training content"
        )
    
    module = TrainingModule(
        title=result.get("title", topic),
        description=result.get("description", ""),
        content=result.get("content", ""),
        duration_minutes=result.get("duration_minutes", 30),
        quiz_questions=json.dumps(result.get("quiz_questions", [])),
        is_mandatory=True,
        is_active=True
    )
    
    db.add(module)
    db.commit()
    db.refresh(module)
    
    return module


@router.post("/admin/applications/{application_id}/start-training/")
def start_training(
    application_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Start training for an applicant"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.TRAINING_PENDING:
        raise HTTPException(
            status_code=400,
            detail="Application must pass interview first"
        )
    
    application.training_started_at = datetime.utcnow()
    application.training_modules_completed = json.dumps([])
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.TRAINING_IN_PROGRESS,
        performed_by=admin.id,
        notes="Training started"
    )
    
    return {"message": "Training started"}


@router.post("/admin/applications/{application_id}/complete-training/")
def complete_training(
    application_id: int,
    score: int = Query(..., ge=0, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Mark training as completed"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.TRAINING_IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail="Training must be in progress"
        )
    
    application.training_completed_at = datetime.utcnow()
    application.training_score = score
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.TRAINING_COMPLETED,
        performed_by=admin.id,
        notes=f"Training completed. Score: {score}/100"
    )
    
    # Auto-transition to activation pending
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.ACTIVATION_PENDING,
        performed_by=admin.id,
        performed_by_type="system",
        notes="Awaiting final activation approval"
    )
    
    return {"message": "Training completed", "next_step": "Final activation approval"}


# ============ ACTIVATION WORKFLOW (Human Approval Required) ============

@router.post("/admin/applications/{application_id}/activate/")
def activate_doctor(
    application_id: int,
    request: ActivationRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Final activation of doctor profile (HUMAN APPROVAL REQUIRED)"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.ACTIVATION_PENDING:
        raise HTTPException(
            status_code=400,
            detail="Application must complete training first"
        )
    
    if not request.approved:
        application.rejection_reason = request.notes
        application.rejected_by = admin.id
        application.rejected_at = datetime.utcnow()
        
        update_application_status(
            db=db,
            application=application,
            new_status=OnboardingStatus.REJECTED,
            performed_by=admin.id,
            notes=f"Activation rejected. Reason: {request.notes or 'Not specified'}"
        )
        
        return {"message": "Activation rejected"}
    
    # Check if user already exists with this email
    existing_user = db.query(User).filter(User.email == application.email).first()
    
    if existing_user:
        # Use existing user account
        user = existing_user
        user.role = UserRole.DOCTOR
        user.is_active = True
        db.commit()
        temp_password = None  # User already has a password
    else:
        # Create new user account
        import secrets
        temp_password = secrets.token_urlsafe(12)
        
        user = User(
            email=application.email,
            hashed_password=get_password_hash(temp_password),
            full_name=application.full_name,
            phone=application.phone,
            role=UserRole.DOCTOR,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Check if doctor profile already exists for this user
    existing_doctor = db.query(Doctor).filter(Doctor.user_id == user.id).first()
    
    if existing_doctor:
        doctor = existing_doctor
        doctor.is_available = True
        db.commit()
    else:
        # Create doctor profile
        from app.utils.slugs import generate_doctor_slug
        slug = generate_doctor_slug(db, application.full_name)
        
        branch_id = request.branch_id or application.preferred_branch_id
        
        doctor = Doctor(
            user_id=user.id,
            branch_id=branch_id,
            slug=slug,
            specialization=application.specialization or "",
            qualification=application.qualification,
            experience_years=application.experience_years or 0,
            profile_image=application.profile_image,
            is_available=True
        )
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
    
    # Link doctor to application
    application.doctor_id = doctor.id
    application.activated_by = admin.id
    application.activated_at = datetime.utcnow()
    application.activation_notes = request.notes
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.ACTIVATED,
        performed_by=admin.id,
        notes=f"Doctor activated. Profile ID: {doctor.id}"
    )
    
    return {
        "message": "Doctor activated successfully",
        "doctor_id": doctor.id,
        "temp_password": temp_password if temp_password else "Using existing credentials",
        "note": "Send this temporary password to the doctor securely" if temp_password else "Doctor can use existing login"
    }


# ============ MONITORING ============

@router.post("/admin/applications/{application_id}/suspend/")
def suspend_doctor(
    application_id: int,
    reason: str = Query(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Suspend an activated doctor"""
    application = db.query(DoctorOnboardingApplication).filter(
        DoctorOnboardingApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != OnboardingStatus.ACTIVATED:
        raise HTTPException(
            status_code=400,
            detail="Can only suspend activated doctors"
        )
    
    # Deactivate doctor profile
    if application.doctor_id:
        doctor = db.query(Doctor).filter(Doctor.id == application.doctor_id).first()
        if doctor:
            doctor.is_available = False
            db.commit()
    
    application.rejection_reason = reason
    application.rejected_by = admin.id
    application.rejected_at = datetime.utcnow()
    
    update_application_status(
        db=db,
        application=application,
        new_status=OnboardingStatus.SUSPENDED,
        performed_by=admin.id,
        notes=f"Doctor suspended. Reason: {reason}"
    )
    
    return {"message": "Doctor suspended", "reason": reason}
