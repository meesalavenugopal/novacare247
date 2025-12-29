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
