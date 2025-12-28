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
    specialization: str
    qualification: Optional[str]
    experience_years: int
    bio: Optional[str]
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

class BookingWithDoctor(BookingResponse):
    doctor_name: str
    doctor_specialization: str

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: Optional[int] = 60
    price: Optional[int] = 500
    image: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[int] = None
    image: Optional[str] = None
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
