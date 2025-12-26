from sqlalchemy.orm import Session
from app.models import User, Doctor, Service, Slot, UserRole, Testimonial
from app.auth import get_password_hash
from datetime import time

def seed_database(db: Session):
    """Seed the database with initial data"""
    
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@chinamayi.com").first()
    if admin:
        return  # Database already seeded
    
    print("Seeding database...")
    
    # Create admin user
    admin_user = User(
        email="admin@chinamayi.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        phone="9876543210",
        role=UserRole.ADMIN
    )
    db.add(admin_user)
    db.commit()
    
    # Create doctors
    doctors_data = [
        {
            "email": "dr.priya@chinamayi.com",
            "full_name": "Dr. Priya Sharma",
            "phone": "9876543211",
            "specialization": "Orthopedic Physiotherapy",
            "qualification": "BPT, MPT (Ortho), PhD",
            "experience_years": 12,
            "bio": "Dr. Priya Sharma is a renowned orthopedic physiotherapist with over 12 years of experience in treating musculoskeletal disorders, sports injuries, and post-operative rehabilitation.",
            "consultation_fee": 800
        },
        {
            "email": "dr.rajesh@chinamayi.com",
            "full_name": "Dr. Rajesh Kumar",
            "phone": "9876543212",
            "specialization": "Neurological Physiotherapy",
            "qualification": "BPT, MPT (Neuro)",
            "experience_years": 8,
            "bio": "Dr. Rajesh Kumar specializes in neurological rehabilitation including stroke recovery, Parkinson's disease, and spinal cord injuries. His patient-centric approach has helped hundreds recover mobility.",
            "consultation_fee": 700
        },
        {
            "email": "dr.anitha@chinamayi.com",
            "full_name": "Dr. Anitha Reddy",
            "phone": "9876543213",
            "specialization": "Sports Physiotherapy",
            "qualification": "BPT, MPT (Sports), CSCS",
            "experience_years": 10,
            "bio": "Dr. Anitha Reddy is a certified sports physiotherapist who has worked with professional athletes and sports teams. She specializes in injury prevention, rehabilitation, and performance enhancement.",
            "consultation_fee": 900
        },
        {
            "email": "dr.venkat@chinamayi.com",
            "full_name": "Dr. Venkat Rao",
            "phone": "9876543214",
            "specialization": "Pediatric Physiotherapy",
            "qualification": "BPT, MPT (Pediatrics)",
            "experience_years": 7,
            "bio": "Dr. Venkat Rao is passionate about helping children with developmental delays, cerebral palsy, and other pediatric conditions achieve their full potential through specialized therapy.",
            "consultation_fee": 600
        },
        {
            "email": "dr.lakshmi@chinamayi.com",
            "full_name": "Dr. Lakshmi Devi",
            "phone": "9876543215",
            "specialization": "Women's Health Physiotherapy",
            "qualification": "BPT, MPT (Women's Health)",
            "experience_years": 9,
            "bio": "Dr. Lakshmi Devi specializes in women's health issues including prenatal and postnatal care, pelvic floor dysfunction, and menopause-related conditions.",
            "consultation_fee": 700
        }
    ]
    
    for doc_data in doctors_data:
        # Create user
        user = User(
            email=doc_data["email"],
            hashed_password=get_password_hash("doctor123"),
            full_name=doc_data["full_name"],
            phone=doc_data["phone"],
            role=UserRole.DOCTOR
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create doctor profile
        doctor = Doctor(
            user_id=user.id,
            specialization=doc_data["specialization"],
            qualification=doc_data["qualification"],
            experience_years=doc_data["experience_years"],
            bio=doc_data["bio"],
            consultation_fee=doc_data["consultation_fee"]
        )
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
        
        # Create slots for each doctor (Monday to Saturday)
        for day in range(6):  # 0=Monday to 5=Saturday
            # Morning slot
            morning_slot = Slot(
                doctor_id=doctor.id,
                day_of_week=day,
                start_time=time(9, 0),
                end_time=time(13, 0),
                slot_duration=30
            )
            db.add(morning_slot)
            
            # Evening slot
            evening_slot = Slot(
                doctor_id=doctor.id,
                day_of_week=day,
                start_time=time(16, 0),
                end_time=time(20, 0),
                slot_duration=30
            )
            db.add(evening_slot)
        
        db.commit()
    
    # Create services
    services_data = [
        {
            "name": "Manual Therapy",
            "description": "Hands-on techniques to improve mobility, reduce pain, and restore function in muscles and joints.",
            "duration": 45,
            "price": 600
        },
        {
            "name": "Electrotherapy",
            "description": "Use of electrical modalities like TENS, ultrasound, and IFT for pain relief and tissue healing.",
            "duration": 30,
            "price": 400
        },
        {
            "name": "Exercise Therapy",
            "description": "Customized exercise programs to strengthen muscles, improve flexibility, and enhance overall fitness.",
            "duration": 60,
            "price": 500
        },
        {
            "name": "Post-Surgical Rehabilitation",
            "description": "Specialized rehabilitation programs for patients recovering from orthopedic surgeries.",
            "duration": 60,
            "price": 800
        },
        {
            "name": "Sports Injury Treatment",
            "description": "Comprehensive treatment for sports-related injuries including sprains, strains, and tears.",
            "duration": 45,
            "price": 700
        },
        {
            "name": "Stroke Rehabilitation",
            "description": "Specialized therapy to help stroke patients regain movement, balance, and independence.",
            "duration": 60,
            "price": 900
        },
        {
            "name": "Back Pain Treatment",
            "description": "Evidence-based treatment for acute and chronic back pain conditions.",
            "duration": 45,
            "price": 600
        },
        {
            "name": "Neck Pain Treatment",
            "description": "Comprehensive care for cervical pain, stiffness, and related conditions.",
            "duration": 45,
            "price": 600
        },
        {
            "name": "Dry Needling",
            "description": "Advanced technique using thin needles to release muscle trigger points and reduce pain.",
            "duration": 30,
            "price": 500
        },
        {
            "name": "Cupping Therapy",
            "description": "Traditional therapy using suction cups to improve blood flow and reduce muscle tension.",
            "duration": 30,
            "price": 400
        }
    ]
    
    for service_data in services_data:
        service = Service(**service_data)
        db.add(service)
    
    db.commit()
    
    # Create testimonials
    testimonials_data = [
        {
            "patient_name": "Ramesh Babu",
            "content": "I had severe back pain for years. After just 2 weeks of treatment at Chinamayi, I feel like a new person. Highly recommended!",
            "rating": 5,
            "is_approved": True
        },
        {
            "patient_name": "Sunitha Krishnan",
            "content": "Dr. Priya is amazing! Her expertise in orthopedic physiotherapy helped me recover from my knee surgery faster than expected.",
            "rating": 5,
            "is_approved": True
        },
        {
            "patient_name": "Arun Prakash",
            "content": "The sports rehabilitation program here is world-class. As a professional athlete, I trust only Chinamayi for my recovery.",
            "rating": 5,
            "is_approved": True
        },
        {
            "patient_name": "Padma Rani",
            "content": "My mother's stroke recovery was remarkable thanks to Dr. Rajesh's neurological expertise. Forever grateful!",
            "rating": 5,
            "is_approved": True
        },
        {
            "patient_name": "Karthik Reddy",
            "content": "Clean facility, professional staff, and excellent treatment. The online booking system makes it so convenient.",
            "rating": 4,
            "is_approved": True
        }
    ]
    
    for testimonial_data in testimonials_data:
        testimonial = Testimonial(**testimonial_data)
        db.add(testimonial)
    
    db.commit()
    print("Database seeded successfully!")
