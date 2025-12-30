from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, time, datetime
from app.models import UserRole, BookingStatus

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

# Doctor Schemas
class DoctorBase(BaseModel):
    specialization: str
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None
    story: Optional[str] = None  # Doctor's journey/story
    expertise: Optional[str] = None  # JSON array of expertise areas
    consultation_fee: Optional[int] = 500
    profile_image: Optional[str] = None
    rating: Optional[int] = 45  # Rating out of 50

class DoctorCreate(DoctorBase):
    user_id: int
    branch_id: Optional[int] = None

class DoctorCreateWithUser(DoctorBase):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    password: str
    branch_id: Optional[int] = None

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    branch_id: Optional[int]
    slug: Optional[str]
    is_available: bool
    created_at: datetime
    user: UserResponse
    
    class Config:
        from_attributes = True

class DoctorUpdate(BaseModel):
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    story: Optional[str] = None
    expertise: Optional[str] = None  # JSON string of expertise array
    consultation_fee: Optional[int] = None
    profile_image: Optional[str] = None
    is_available: Optional[bool] = None
    branch_id: Optional[int] = None
    rating: Optional[int] = None


# Consultation Fee Schemas
class ConsultationFeeBase(BaseModel):
    consultation_type: str  # clinic, home, video
    country: str = "India"
    fee: int
    currency: str = "INR"
    is_available: bool = True

class ConsultationFeeCreate(ConsultationFeeBase):
    doctor_id: int

class ConsultationFeeResponse(ConsultationFeeBase):
    id: int
    doctor_id: int
    
    class Config:
        from_attributes = True


# Doctor Review Schemas
class DoctorReviewBase(BaseModel):
    patient_name: str
    content: str
    rating: int = 5
    treatment_type: Optional[str] = None
    patient_image: Optional[str] = None

class DoctorReviewCreate(DoctorReviewBase):
    doctor_id: int

class DoctorReviewResponse(DoctorReviewBase):
    id: int
    doctor_id: int
    is_verified: bool
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Branch info for doctor response
class BranchInfo(BaseModel):
    id: int
    name: str
    city: str
    state: str
    country: str
    
    class Config:
        from_attributes = True


class DoctorPublic(BaseModel):
    id: int
    slug: Optional[str] = None
    specialization: str
    qualification: Optional[str]
    experience_years: int
    bio: Optional[str]
    story: Optional[str] = None  # Doctor's journey/story
    expertise: Optional[List[str]] = None  # List of expertise areas
    consultation_fee: int  # Default/legacy fee
    profile_image: Optional[str]
    is_available: bool
    full_name: str
    rating: float  # Displayed as x.x out of 5.0
    branch: Optional[BranchInfo] = None
    consultation_fees: List[ConsultationFeeResponse] = []
    
    class Config:
        from_attributes = True

# Slot Schemas
class SlotBase(BaseModel):
    day_of_week: int
    start_time: time
    end_time: time
    slot_duration: Optional[int] = 30

class SlotCreate(SlotBase):
    doctor_id: int

class SlotResponse(SlotBase):
    id: int
    doctor_id: int
    is_active: bool
    
    class Config:
        from_attributes = True

class SlotUpdate(BaseModel):
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    slot_duration: Optional[int] = None
    is_active: Optional[bool] = None

class AvailableSlot(BaseModel):
    time: time
    available: bool

# Booking Schemas
class BookingBase(BaseModel):
    doctor_id: int
    booking_date: date
    booking_time: str  # Accept as string like "09:00"
    consultation_type: str = "clinic"  # clinic, home, video
    patient_name: str
    patient_phone: str
    patient_email: Optional[EmailStr] = None
    symptoms: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BaseModel):
    id: int
    doctor_id: int
    booking_date: date
    booking_time: time  # Return as time object (Pydantic will serialize)
    consultation_type: Optional[str] = "clinic"  # clinic, home, video
    patient_name: str
    patient_phone: str
    patient_email: Optional[EmailStr] = None
    symptoms: Optional[str] = None
    patient_id: Optional[int] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    cancellation_reason: Optional[str] = None

class BookingWithDoctor(BookingResponse):
    doctor_name: str
    doctor_specialization: str

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    duration: Optional[int] = 60
    price: Optional[int] = 500
    image: Optional[str] = None
    icon: Optional[str] = None
    benefits: Optional[str] = None  # JSON string
    conditions_treated: Optional[str] = None  # JSON string
    treatment_process: Optional[str] = None  # JSON string
    faqs: Optional[str] = None  # JSON string
    home_available: Optional[bool] = True  # Whether home visit is available
    video_available: Optional[bool] = False  # Whether video consultation is available

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    slug: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class ServicePublic(BaseModel):
    """Public service response with parsed JSON fields"""
    id: int
    slug: Optional[str] = None
    name: str
    description: Optional[str]
    detailed_description: Optional[str]
    duration: int
    price: int
    image: Optional[str]
    icon: Optional[str]
    benefits: Optional[List[str]] = None
    conditions_treated: Optional[List[str]] = None
    treatment_process: Optional[List[dict]] = None
    faqs: Optional[List[dict]] = None
    home_available: bool = True
    video_available: bool = False
    is_active: bool
    
    class Config:
        from_attributes = True


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[int] = None
    image: Optional[str] = None
    icon: Optional[str] = None
    benefits: Optional[str] = None
    conditions_treated: Optional[str] = None
    treatment_process: Optional[str] = None
    faqs: Optional[str] = None
    home_available: Optional[bool] = None
    video_available: Optional[bool] = None
    is_active: Optional[bool] = None

# Testimonial Schemas
class TestimonialBase(BaseModel):
    patient_name: str
    content: str
    rating: Optional[int] = 5
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    story_type: Optional[str] = None
    tips: Optional[str] = None  # Comma-separated or JSON string

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialResponse(TestimonialBase):
    id: int
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestimonialUpdate(BaseModel):
    is_approved: Optional[bool] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    story_type: Optional[str] = None
    tips: Optional[str] = None

# Contact Inquiry Schemas
class ContactInquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactInquiryCreate(ContactInquiryBase):
    pass

class ContactInquiryResponse(ContactInquiryBase):
    id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardStats(BaseModel):
    total_doctors: int
    total_patients: int
    total_bookings: int
    pending_bookings: int
    today_bookings: int
    total_services: int


# ============ SITE CONFIGURATION SCHEMAS ============

# SiteSetting Schemas
class SiteSettingBase(BaseModel):
    key: str
    value: str
    category: Optional[str] = "general"
    description: Optional[str] = None

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSettingResponse(SiteSettingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SiteSettingUpdate(BaseModel):
    value: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None


# SiteStat Schemas
class SiteStatBase(BaseModel):
    label: str
    value: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = 0

class SiteStatCreate(SiteStatBase):
    pass

class SiteStatResponse(SiteStatBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class SiteStatUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


# Branch Schemas (with country for international expansion)
class BranchBase(BaseModel):
    name: str
    country: Optional[str] = "India"
    state: str
    city: str
    address: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    business_hours: Optional[str] = None
    is_headquarters: Optional[bool] = False

class BranchCreate(BranchBase):
    pass

class BranchResponse(BranchBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class BranchUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    business_hours: Optional[str] = None
    is_active: Optional[bool] = None
    is_headquarters: Optional[bool] = None

class BranchWithDoctorCount(BranchResponse):
    doctor_count: int


# Milestone Schemas
class MilestoneBase(BaseModel):
    year: str
    title: str
    description: Optional[str] = None
    display_order: Optional[int] = 0

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(MilestoneBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MilestoneUpdate(BaseModel):
    year: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


# ============ DOCTOR ONBOARDING SCHEMAS ============

class OnboardingApplicationBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = "India"
    pincode: Optional[str] = None
    profile_image: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    current_employer: Optional[str] = None
    license_number: Optional[str] = None
    license_issuing_authority: Optional[str] = None
    license_expiry_date: Optional[date] = None
    license_document_url: Optional[str] = None
    degree_certificate_url: Optional[str] = None
    additional_certifications: Optional[str] = None  # JSON string
    preferred_branch_id: Optional[int] = None


class OnboardingApplicationCreate(OnboardingApplicationBase):
    pass


class OnboardingApplicationSubmit(BaseModel):
    """Submit application for review"""
    pass


class OnboardingApplicationResponse(OnboardingApplicationBase):
    id: int
    status: str
    submitted_at: Optional[datetime] = None
    ai_verification_score: Optional[int] = None
    ai_verification_notes: Optional[str] = None
    ai_verification_completed_at: Optional[datetime] = None
    verified_by: Optional[int] = None
    verification_notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    interview_scheduled_at: Optional[datetime] = None
    interview_meeting_link: Optional[str] = None
    interview_score: Optional[int] = None
    training_score: Optional[int] = None
    training_completed_at: Optional[datetime] = None
    doctor_id: Optional[int] = None
    activated_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OnboardingApplicationUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    profile_image: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    current_employer: Optional[str] = None
    license_number: Optional[str] = None
    license_issuing_authority: Optional[str] = None
    license_expiry_date: Optional[date] = None
    license_document_url: Optional[str] = None
    degree_certificate_url: Optional[str] = None
    additional_certifications: Optional[str] = None
    preferred_branch_id: Optional[int] = None


class AIVerificationRequest(BaseModel):
    """Request AI verification of credentials"""
    application_id: int


class AIVerificationResponse(BaseModel):
    """AI verification result"""
    score: int
    analysis: dict
    recommendations: List[str]
    flags: List[str]


class HumanVerificationRequest(BaseModel):
    """Human approval/rejection of verification"""
    approved: bool
    notes: Optional[str] = None


class ScheduleInterviewRequest(BaseModel):
    """Schedule interview for applicant"""
    scheduled_at: datetime
    meeting_link: Optional[str] = None


class AIInterviewQuestionsRequest(BaseModel):
    """Generate AI interview questions"""
    application_id: int


class AIInterviewQuestionsResponse(BaseModel):
    """AI-generated interview questions"""
    questions: List[dict]  # [{question, category, expected_points}]


class CompleteInterviewRequest(BaseModel):
    """Complete interview with score and notes"""
    score: int  # 0-100
    notes: str
    passed: bool


class TrainingModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: int = 30
    display_order: int = 0
    is_mandatory: bool = True
    quiz_questions: Optional[str] = None  # JSON string
    passing_score: int = 70


class TrainingModuleCreate(TrainingModuleBase):
    pass


class TrainingModuleResponse(TrainingModuleBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TrainingModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    display_order: Optional[int] = None
    is_mandatory: Optional[bool] = None
    quiz_questions: Optional[str] = None
    passing_score: Optional[int] = None
    is_active: Optional[bool] = None


class CompleteTrainingRequest(BaseModel):
    """Mark training module as completed"""
    module_id: int
    score: int  # Quiz score


class ActivationRequest(BaseModel):
    """Human approval for activation"""
    approved: bool
    notes: Optional[str] = None
    branch_id: Optional[int] = None  # Final branch assignment


class OnboardingActivityLogResponse(BaseModel):
    id: int
    application_id: int
    action: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    performed_by: Optional[int] = None
    performed_by_type: str
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class OnboardingDashboardStats(BaseModel):
    """Dashboard statistics for onboarding"""
    total_applications: int
    pending_verification: int
    pending_interview: int
    training_pending: int
    pending_training: int
    pending_activation: int
    activated_this_month: int
    rejected_this_month: int
