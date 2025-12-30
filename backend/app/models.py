from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date, Time, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(20), default=UserRole.PATIENT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    bookings = relationship("Booking", back_populates="patient", foreign_keys="Booking.patient_id")

class ConsultationType(str, enum.Enum):
    CLINIC = "clinic"
    HOME = "home"
    VIDEO = "video"

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # Optional branch assignment
    slug = Column(String(255), unique=True, index=True)  # URL-friendly unique identifier
    specialization = Column(String(255), nullable=False)
    qualification = Column(String(500))
    experience_years = Column(Integer, default=0)
    bio = Column(Text)
    story = Column(Text)  # Doctor's journey/story for profile page
    expertise = Column(Text)  # JSON array of expertise areas e.g. '["Pain Management", "Manual Therapy"]'
    consultation_fee = Column(Integer, default=500)  # Legacy/default fee
    profile_image = Column(String(500))
    is_available = Column(Boolean, default=True)
    rating = Column(Integer, default=45)  # Rating out of 50 (display as 4.5/5.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    branch = relationship("Branch", back_populates="doctors")
    slots = relationship("Slot", back_populates="doctor")
    bookings = relationship("Booking", back_populates="doctor")
    consultation_fees = relationship("DoctorConsultationFee", back_populates="doctor", cascade="all, delete-orphan")
    reviews = relationship("DoctorReview", back_populates="doctor", cascade="all, delete-orphan")


class DoctorConsultationFee(Base):
    """Fee structure per doctor based on consultation type and country"""
    __tablename__ = "doctor_consultation_fees"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    consultation_type = Column(String(20), nullable=False)  # clinic, home, video
    country = Column(String(100), nullable=False, default="India")
    fee = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR")
    is_available = Column(Boolean, default=True)  # Whether doctor offers this type
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="consultation_fees")


class DoctorReview(Base):
    """Patient reviews for individual doctors"""
    __tablename__ = "doctor_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_name = Column(String(255), nullable=False)
    patient_image = Column(String(500))  # Optional patient photo URL
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)  # 1-5 star rating
    treatment_type = Column(String(100))  # e.g., "Knee Pain Treatment", "Post-Surgery Rehab"
    is_verified = Column(Boolean, default=False)  # Verified patient
    is_approved = Column(Boolean, default=False)  # Admin approved
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="reviews")


class Slot(Base):
    __tablename__ = "slots"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    day_of_week = Column(Integer)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    slot_duration = Column(Integer, default=30)  # Duration in minutes
    is_active = Column(Boolean, default=True)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="slots")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    booking_date = Column(Date, nullable=False)
    booking_time = Column(Time, nullable=False)
    consultation_type = Column(String(20), default=ConsultationType.CLINIC)  # clinic, home, video
    status = Column(String(20), default=BookingStatus.PENDING)
    patient_name = Column(String(255))
    patient_phone = Column(String(20))
    patient_email = Column(String(255))
    symptoms = Column(Text)
    notes = Column(Text)
    cancellation_reason = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("User", back_populates="bookings", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="bookings")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True)  # URL-friendly unique identifier
    description = Column(Text)
    detailed_description = Column(Text)  # Full detailed description for profile page
    duration = Column(Integer, default=60)  # Duration in minutes
    price = Column(Integer, default=500)
    image = Column(String(500))
    icon = Column(String(50))  # Icon name for display
    benefits = Column(Text)  # JSON array of benefits
    conditions_treated = Column(Text)  # JSON array of conditions
    treatment_process = Column(Text)  # JSON array of treatment steps
    faqs = Column(Text)  # JSON array of FAQs
    home_available = Column(Boolean, default=True)  # Whether home visit is available for this service
    video_available = Column(Boolean, default=False)  # Whether video consultation is available for this service
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # New fields for richer story content
    subtitle = Column(String(255))
    image_url = Column(String(500))
    story_type = Column(String(50))  # e.g., 'video', 'article'
    tips = Column(Text)  # JSON string or comma-separated tips

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ============ SITE CONFIGURATION MODELS ============

class SiteSetting(Base):
    """Key-value store for site-wide settings like phone, email, address, etc."""
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=False)
    category = Column(String(50), default="general")  # general, contact, social, hero, etc.
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SiteStat(Base):
    """Statistics displayed on the website (1,900+ centers, 39 states, etc.)"""
    __tablename__ = "site_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False)  # e.g., "Rehabilitation Centers"
    value = Column(String(50), nullable=False)   # e.g., "1,900+"
    description = Column(String(255))            # e.g., "centers with a wide range of services"
    icon = Column(String(50))                    # e.g., "MapPin", "Users", "Award"
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Branch(Base):
    """Clinic branch locations with country support for international expansion"""
    __tablename__ = "branches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)          # e.g., "Kukatpally Branch"
    country = Column(String(100), nullable=False, default="India")
    state = Column(String(100), nullable=False)         # e.g., "Telangana"
    city = Column(String(100), nullable=False)          # e.g., "Hyderabad"
    address = Column(Text)                              # Full address
    pincode = Column(String(20))
    phone = Column(String(20))
    email = Column(String(255))
    latitude = Column(String(50))                       # For map integration
    longitude = Column(String(50))
    business_hours = Column(String(255))                # e.g., "Mon-Sat: 9AM-8PM"
    is_active = Column(Boolean, default=True)
    is_headquarters = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctors = relationship("Doctor", back_populates="branch")


class Milestone(Base):
    """Company milestones/timeline for About page"""
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(10), nullable=False)           # e.g., "2010"
    title = Column(String(255), nullable=False)         # e.g., "Foundation"
    description = Column(Text)                          # e.g., "NovaCare was established..."
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class BlogCategory(str, enum.Enum):
    CONDITIONS = "conditions"
    EXERCISES = "exercises"
    RECOVERY = "recovery"
    PREVENTION = "prevention"
    LIFESTYLE = "lifestyle"
    SPORTS = "sports"


class OnboardingStatus(str, enum.Enum):
    """Doctor onboarding application status"""
    DRAFT = "draft"                      # Application started but not submitted
    SUBMITTED = "submitted"              # Application submitted, pending review
    VERIFICATION_PENDING = "verification_pending"  # AI verified, awaiting human approval
    VERIFICATION_APPROVED = "verification_approved"  # Human approved credentials
    VERIFICATION_REJECTED = "verification_rejected"  # Credentials rejected
    INTERVIEW_SCHEDULED = "interview_scheduled"      # Interview scheduled
    INTERVIEW_COMPLETED = "interview_completed"      # Interview done, pending review
    INTERVIEW_PASSED = "interview_passed"            # Passed interview
    INTERVIEW_FAILED = "interview_failed"            # Failed interview
    TRAINING_PENDING = "training_pending"            # Training not started
    TRAINING_IN_PROGRESS = "training_in_progress"    # Training ongoing
    TRAINING_COMPLETED = "training_completed"        # Training completed
    ACTIVATION_PENDING = "activation_pending"        # Awaiting final human approval
    ACTIVATED = "activated"                          # Profile is live
    SUSPENDED = "suspended"                          # Account suspended
    REJECTED = "rejected"                            # Application rejected


class ClinicOnboardingStatus(str, enum.Enum):
    """Clinic/Branch onboarding application status"""
    DRAFT = "draft"                          # Application started but not submitted
    SUBMITTED = "submitted"                  # Application submitted, pending review
    DOCUMENTATION_PENDING = "documentation_pending"      # Awaiting document verification
    DOCUMENTATION_APPROVED = "documentation_approved"    # Documents verified
    DOCUMENTATION_REJECTED = "documentation_rejected"    # Documents rejected
    SITE_VERIFICATION_PENDING = "site_verification_pending"  # Awaiting site inspection
    SITE_VERIFICATION_SCHEDULED = "site_verification_scheduled"  # Inspection scheduled
    SITE_VERIFICATION_COMPLETED = "site_verification_completed"  # Inspection done
    SITE_VERIFICATION_PASSED = "site_verification_passed"        # Passed inspection
    SITE_VERIFICATION_FAILED = "site_verification_failed"        # Failed inspection
    CONTRACT_PENDING = "contract_pending"                # Awaiting contract signing
    CONTRACT_SIGNED = "contract_signed"                  # Contract signed
    SETUP_PENDING = "setup_pending"                      # Awaiting platform setup
    SETUP_COMPLETED = "setup_completed"                  # Platform setup done
    TRAINING_PENDING = "training_pending"                # Training not started
    TRAINING_IN_PROGRESS = "training_in_progress"        # Training ongoing
    TRAINING_COMPLETED = "training_completed"            # Training completed
    ACTIVATION_PENDING = "activation_pending"            # Awaiting final approval
    ACTIVATED = "activated"                              # Clinic is live
    SUSPENDED = "suspended"                              # Account suspended
    REJECTED = "rejected"                                # Application rejected


class PartnershipTier(str, enum.Enum):
    """Clinic partnership tier"""
    BASIC = "basic"        # 25% commission
    PARTNER = "partner"    # 20% commission
    PREMIUM = "premium"    # 15% commission


class DoctorOnboardingApplication(Base):
    """Doctor onboarding application with full workflow tracking"""
    __tablename__ = "doctor_onboarding_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Personal Information
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    date_of_birth = Column(Date)
    gender = Column(String(20))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100), default="India")
    pincode = Column(String(20))
    profile_image = Column(String(500))
    
    # Professional Information
    specialization = Column(String(255))
    qualification = Column(String(500))
    experience_years = Column(Integer, default=0)
    current_employer = Column(String(255))
    
    # License & Credentials
    license_number = Column(String(100))
    license_issuing_authority = Column(String(255))
    license_expiry_date = Column(Date)
    license_document_url = Column(String(500))  # S3 URL
    degree_certificate_url = Column(String(500))  # S3 URL
    additional_certifications = Column(Text)  # JSON array of certification URLs
    
    # Preferred Branch
    preferred_branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    
    # Application Status
    status = Column(String(50), default=OnboardingStatus.DRAFT)
    submitted_at = Column(DateTime)
    
    # AI Verification
    ai_verification_score = Column(Integer)  # 0-100
    ai_verification_notes = Column(Text)  # JSON with AI analysis
    ai_verification_completed_at = Column(DateTime)
    
    # Human Verification
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verification_notes = Column(Text)
    verified_at = Column(DateTime)
    
    # Interview
    interview_scheduled_at = Column(DateTime)
    interview_meeting_link = Column(String(500))
    interview_notes = Column(Text)
    ai_interview_questions = Column(Text)  # JSON array of AI-generated questions
    interview_score = Column(Integer)  # 0-100
    interview_conducted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    interview_completed_at = Column(DateTime)
    
    # Training
    training_started_at = Column(DateTime)
    training_modules_completed = Column(Text)  # JSON array of completed modules
    training_completed_at = Column(DateTime)
    training_score = Column(Integer)  # 0-100
    
    # Activation
    activated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    activated_at = Column(DateTime)
    activation_notes = Column(Text)
    
    # Linked Doctor Account (after activation)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    
    # Rejection/Suspension
    rejection_reason = Column(Text)
    rejected_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejected_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    preferred_branch = relationship("Branch", foreign_keys=[preferred_branch_id])
    verifier = relationship("User", foreign_keys=[verified_by])
    interviewer = relationship("User", foreign_keys=[interview_conducted_by])
    activator = relationship("User", foreign_keys=[activated_by])
    rejector = relationship("User", foreign_keys=[rejected_by])
    doctor = relationship("Doctor", foreign_keys=[doctor_id])


class OnboardingActivityLog(Base):
    """Audit log for all onboarding activities"""
    __tablename__ = "onboarding_activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("doctor_onboarding_applications.id"), nullable=False)
    action = Column(String(100), nullable=False)  # e.g., "status_changed", "document_uploaded"
    old_value = Column(Text)
    new_value = Column(Text)
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for system/AI actions
    performed_by_type = Column(String(20), default="human")  # human, ai, system
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("DoctorOnboardingApplication")
    user = relationship("User", foreign_keys=[performed_by])


class TrainingModule(Base):
    """Training modules for doctor onboarding"""
    __tablename__ = "training_modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    content = Column(Text)  # HTML or Markdown content
    video_url = Column(String(500))
    duration_minutes = Column(Integer, default=30)
    display_order = Column(Integer, default=0)
    is_mandatory = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    quiz_questions = Column(Text)  # JSON array of quiz questions
    passing_score = Column(Integer, default=70)  # Minimum score to pass
    created_at = Column(DateTime, default=datetime.utcnow)


class BlogArticle(Base):
    """Blog articles for content marketing and SEO"""
    __tablename__ = "blog_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    excerpt = Column(Text)                              # Short description for listings
    content = Column(Text, nullable=False)              # Full article content (markdown)
    category = Column(String(50), default="conditions")
    author = Column(String(255))
    author_role = Column(String(255))
    read_time = Column(String(50))                      # e.g., "8 min read"
    image = Column(String(500))                         # Featured image URL
    tags = Column(Text)                                 # JSON array of tags
    faqs = Column(Text)                                 # JSON array of FAQs [{question, answer}]
    is_featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ClinicOnboardingApplication(Base):
    """Clinic/Branch onboarding application with full workflow tracking"""
    __tablename__ = "clinic_onboarding_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Clinic Information
    clinic_name = Column(String(255), nullable=False)
    business_type = Column(String(100))  # Sole Proprietorship, Partnership, Pvt Ltd, etc.
    registration_number = Column(String(100))
    gst_number = Column(String(50))
    established_year = Column(Integer)
    
    # Contact Information
    owner_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    alternate_phone = Column(String(20))
    website = Column(String(255))
    
    # Location
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100), default="India")
    pincode = Column(String(20))
    latitude = Column(String(50))
    longitude = Column(String(50))
    
    # Facility Details
    total_rooms = Column(Integer)
    treatment_rooms = Column(Integer)
    has_parking = Column(Boolean, default=False)
    has_wheelchair_access = Column(Boolean, default=False)
    operating_hours = Column(String(255))  # e.g., "Mon-Sat: 9AM-8PM"
    services_offered = Column(Text)  # JSON array of service types
    equipment_list = Column(Text)  # JSON array of equipment
    
    # Staff Information
    total_physiotherapists = Column(Integer, default=0)
    staff_credentials = Column(Text)  # JSON array of staff with credentials
    
    # Documents (S3 URLs)
    registration_certificate_url = Column(String(500))
    gst_certificate_url = Column(String(500))
    owner_id_proof_url = Column(String(500))
    facility_photos_urls = Column(Text)  # JSON array of photo URLs
    insurance_certificate_url = Column(String(500))
    
    # Partnership Details
    partnership_tier = Column(String(20), default=PartnershipTier.BASIC)
    commission_rate = Column(Integer, default=25)  # Percentage
    
    # Application Status
    status = Column(String(50), default=ClinicOnboardingStatus.DRAFT)
    submitted_at = Column(DateTime)
    
    # Documentation Verification
    documentation_verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    documentation_notes = Column(Text)
    documentation_verified_at = Column(DateTime)
    
    # Site Verification
    site_verification_scheduled_at = Column(DateTime)
    site_verification_type = Column(String(20))  # virtual, physical
    site_verification_notes = Column(Text)
    site_verification_photos = Column(Text)  # JSON array of inspection photos
    site_verification_score = Column(Integer)  # 0-100
    site_verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    site_verified_at = Column(DateTime)
    
    # Contract
    contract_document_url = Column(String(500))
    contract_signed_at = Column(DateTime)
    contract_start_date = Column(Date)
    contract_end_date = Column(Date)
    
    # Setup
    setup_completed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    setup_completed_at = Column(DateTime)
    setup_notes = Column(Text)
    
    # Training
    training_scheduled_at = Column(DateTime)
    training_attendees = Column(Text)  # JSON array of attendee names
    training_completed_at = Column(DateTime)
    training_notes = Column(Text)
    training_score = Column(Integer)  # 0-100
    
    # Activation
    activated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    activated_at = Column(DateTime)
    activation_notes = Column(Text)
    
    # Linked Branch (after activation)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    
    # Rejection/Suspension
    rejection_reason = Column(Text)
    rejected_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejected_at = Column(DateTime)
    
    # Performance (updated monthly)
    performance_score = Column(Integer)  # 0-100
    last_performance_review = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    documentation_verifier = relationship("User", foreign_keys=[documentation_verified_by])
    site_verifier = relationship("User", foreign_keys=[site_verified_by])
    setup_user = relationship("User", foreign_keys=[setup_completed_by])
    activator = relationship("User", foreign_keys=[activated_by])
    rejector = relationship("User", foreign_keys=[rejected_by])
    branch = relationship("Branch", foreign_keys=[branch_id])


class ClinicOnboardingActivityLog(Base):
    """Audit log for clinic onboarding activities"""
    __tablename__ = "clinic_onboarding_activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("clinic_onboarding_applications.id"), nullable=False)
    action = Column(String(100), nullable=False)  # e.g., "status_changed", "document_uploaded"
    old_value = Column(Text)
    new_value = Column(Text)
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    performed_by_type = Column(String(20), default="human")  # human, system
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("ClinicOnboardingApplication")
    user = relationship("User", foreign_keys=[performed_by])
