from sqlalchemy.orm import Session
from app.models import User, Doctor, Service, Slot, UserRole, Testimonial, SiteSetting, SiteStat, Branch, Milestone
from app.auth import get_password_hash
from datetime import time

def seed_new_tables(db: Session):
    """Seed new tables (SiteSetting, SiteStat, Branch, Milestone) if they're empty"""
    
    # Seed Site Settings if empty
    if db.query(SiteSetting).count() == 0:
        print("Seeding site settings...")
        site_settings_data = [
            # Contact settings
            {"key": "phone", "value": "+91 40 1234 5678", "category": "contact", "description": "Main contact phone number"},
            {"key": "phone_secondary", "value": "+91 98765 43210", "category": "contact", "description": "Secondary phone number"},
            {"key": "email", "value": "care@novacare247.com", "category": "contact", "description": "Main contact email"},
            {"key": "address", "value": "Kukatpally, Hyderabad, Telangana 500072", "category": "contact", "description": "Main clinic address"},
            {"key": "business_hours", "value": "Mon-Sat: 9:00 AM - 8:00 PM", "category": "contact", "description": "Business hours"},
            
            # Social media links
            {"key": "facebook", "value": "https://facebook.com/novacare247", "category": "social", "description": "Facebook page URL"},
            {"key": "instagram", "value": "https://instagram.com/novacare247", "category": "social", "description": "Instagram profile URL"},
            {"key": "twitter", "value": "https://twitter.com/novacare247", "category": "social", "description": "Twitter profile URL"},
            {"key": "linkedin", "value": "https://linkedin.com/company/novacare247", "category": "social", "description": "LinkedIn page URL"},
            {"key": "youtube", "value": "https://youtube.com/novacare247", "category": "social", "description": "YouTube channel URL"},
            
            # Hero section
            {"key": "hero_title", "value": "Your Journey to Pain-Free Living Starts Here", "category": "hero", "description": "Main hero section title"},
            {"key": "hero_subtitle", "value": "Expert physiotherapy care tailored to your unique needs. Our certified specialists use evidence-based techniques to help you recover faster and live better.", "category": "hero", "description": "Hero section subtitle"},
            {"key": "hero_image", "value": "/images/hero-physio.jpg", "category": "hero", "description": "Hero section background image"},
            
            # About section
            {"key": "about_title", "value": "About Novacare 24/7 Physiotherapy", "category": "about", "description": "About section title"},
            {"key": "about_description", "value": "Founded in 2015, Novacare 24/7 Physiotherapy has been dedicated to providing exceptional physiotherapy care. Our mission is to help patients recover from injuries, manage chronic conditions, and improve their overall quality of life.", "category": "about", "description": "About section description"},
            
            # General settings
            {"key": "clinic_name", "value": "Novacare 24/7 Physiotherapy", "category": "general", "description": "Clinic name"},
            {"key": "tagline", "value": "Healing Hands, Caring Hearts", "category": "general", "description": "Clinic tagline"},
        ]
        
        for setting_data in site_settings_data:
            setting = SiteSetting(**setting_data)
            db.add(setting)
        db.commit()
    
    # Seed Site Stats if empty
    if db.query(SiteStat).count() == 0:
        print("Seeding site stats...")
        site_stats_data = [
            {"label": "Rehabilitation Centers", "value": "1,900+", "description": "centers with a wide range of services designed to support your rehabilitation journey", "icon": "MapPin", "display_order": 1},
            {"label": "States Covered", "value": "39", "description": "states across India with our comprehensive physiotherapy network", "icon": "Map", "display_order": 2},
            {"label": "Healthcare Partnerships", "value": "375+", "description": "hospital partnerships ensuring seamless patient care and referrals", "icon": "Building", "display_order": 3},
            {"label": "Happy Patients", "value": "50,000+", "description": "patients successfully treated and rehabilitated", "icon": "Users", "display_order": 4},
            {"label": "Expert Therapists", "value": "200+", "description": "certified physiotherapists across all branches", "icon": "UserCheck", "display_order": 5},
            {"label": "Years of Experience", "value": "15+", "description": "years of trusted physiotherapy care", "icon": "Award", "display_order": 6}
        ]
        
        for stat_data in site_stats_data:
            stat = SiteStat(**stat_data)
            db.add(stat)
        db.commit()
    
    # Seed Branches if empty
    if db.query(Branch).count() == 0:
        print("Seeding branches...")
        branches_data = [
            {"name": "Novacare Kukatpally", "country": "India", "state": "Telangana", "city": "Hyderabad", "address": "Plot No. 123, KPHB Colony, Kukatpally", "phone": "+91 40 1234 5678", "email": "kukatpally@novacare247.com", "is_headquarters": True, "latitude": 17.4947, "longitude": 78.3996},
            {"name": "Novacare Gachibowli", "country": "India", "state": "Telangana", "city": "Hyderabad", "address": "1st Floor, Financial District, Gachibowli", "phone": "+91 40 2345 6789", "email": "gachibowli@novacare247.com", "is_headquarters": False, "latitude": 17.4400, "longitude": 78.3489},
            {"name": "Novacare Secunderabad", "country": "India", "state": "Telangana", "city": "Secunderabad", "address": "Near Clock Tower, Secunderabad", "phone": "+91 40 3456 7890", "email": "secunderabad@novacare247.com", "is_headquarters": False, "latitude": 17.4399, "longitude": 78.4983},
            {"name": "Novacare Bangalore", "country": "India", "state": "Karnataka", "city": "Bangalore", "address": "HSR Layout, Sector 2, Bangalore", "phone": "+91 80 1234 5678", "email": "bangalore@novacare247.com", "is_headquarters": False, "latitude": 12.9121, "longitude": 77.6446},
            {"name": "Novacare Mumbai", "country": "India", "state": "Maharashtra", "city": "Mumbai", "address": "Andheri West, Mumbai", "phone": "+91 22 1234 5678", "email": "mumbai@novacare247.com", "is_headquarters": False, "latitude": 19.1364, "longitude": 72.8296}
        ]
        
        for branch_data in branches_data:
            branch = Branch(**branch_data)
            db.add(branch)
        db.commit()
    
    # Seed Milestones if empty
    if db.query(Milestone).count() == 0:
        print("Seeding milestones...")
        milestones_data = [
            {"year": 2015, "title": "Foundation", "description": "Novacare Physiotherapy was founded with a vision to provide world-class physiotherapy care in Hyderabad."},
            {"year": 2017, "title": "First Expansion", "description": "Opened our second branch in Gachibowli, expanding our reach to the IT corridor of Hyderabad."},
            {"year": 2019, "title": "Multi-City Presence", "description": "Expanded to Bangalore and Mumbai, establishing Novacare as a national brand in physiotherapy care."},
            {"year": 2021, "title": "Technology Integration", "description": "Launched online booking system and tele-physiotherapy services to enhance patient convenience."},
            {"year": 2023, "title": "Excellence Award", "description": "Received the National Healthcare Excellence Award for outstanding contribution to physiotherapy services."},
            {"year": 2024, "title": "1900+ Centers", "description": "Achieved milestone of 1900+ rehabilitation centers across 39 states with 375+ hospital partnerships."}
        ]
        
        for milestone_data in milestones_data:
            milestone = Milestone(**milestone_data)
            db.add(milestone)
        db.commit()

def seed_database(db: Session):
    """Seed the database with initial data"""
    
    # Always try to seed new tables first
    seed_new_tables(db)
    
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@novacare247.com").first()
    if admin:
        return  # Core database already seeded
    
    print("Seeding database...")
    
    # Create admin user
    admin_user = User(
        email="admin@novacare247.com",
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
            "email": "dr.priya@novacare247.com",
            "full_name": "Dr. Priya Sharma",
            "phone": "9876543211",
            "specialization": "Orthopedic Physiotherapy",
            "qualification": "BPT, MPT (Ortho), PhD",
            "experience_years": 12,
            "bio": "Dr. Priya Sharma is a renowned orthopedic physiotherapist with over 12 years of experience in treating musculoskeletal disorders, sports injuries, and post-operative rehabilitation.",
            "consultation_fee": 800
        },
        {
            "email": "dr.rajesh@novacare247.com",
            "full_name": "Dr. Rajesh Kumar",
            "phone": "9876543212",
            "specialization": "Neurological Physiotherapy",
            "qualification": "BPT, MPT (Neuro)",
            "experience_years": 8,
            "bio": "Dr. Rajesh Kumar specializes in neurological rehabilitation including stroke recovery, Parkinson's disease, and spinal cord injuries. His patient-centric approach has helped hundreds recover mobility.",
            "consultation_fee": 700
        },
        {
            "email": "dr.anitha@novacare247.com",
            "full_name": "Dr. Anitha Reddy",
            "phone": "9876543213",
            "specialization": "Sports Physiotherapy",
            "qualification": "BPT, MPT (Sports), CSCS",
            "experience_years": 10,
            "bio": "Dr. Anitha Reddy is a certified sports physiotherapist who has worked with professional athletes and sports teams. She specializes in injury prevention, rehabilitation, and performance enhancement.",
            "consultation_fee": 900
        },
        {
            "email": "dr.venkat@novacare247.com",
            "full_name": "Dr. Venkat Rao",
            "phone": "9876543214",
            "specialization": "Pediatric Physiotherapy",
            "qualification": "BPT, MPT (Pediatrics)",
            "experience_years": 7,
            "bio": "Dr. Venkat Rao is passionate about helping children with developmental delays, cerebral palsy, and other pediatric conditions achieve their full potential through specialized therapy.",
            "consultation_fee": 600
        },
        {
            "email": "dr.lakshmi@novacare247.com",
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
            "patient_name": "Lizzy Thomas",
            "subtitle": "Recovered from Knee Injury",
            "content": "After my accident, I never thought I'd walk pain-free again. Thanks to NovaCare's expert team, I'm back on my feet and even jogging! The encouragement and care I received made all the difference. I'm so grateful!",
            "rating": 5,
            "is_approved": True,
            "image_url": "https://randomuser.me/api/portraits/women/44.jpg",
            "story_type": "article",
            "tips": "Trust the process and celebrate small wins,Stay positive even when progress is slow,Lean on your support system—family friends and your care team"
        },
        {
            "patient_name": "Kelly Raj",
            "subtitle": "Sports Injury Recovery",
            "content": "Kelly Raj, a passionate amateur cricketer, faced a major setback after a ligament injury during a local match. With personalized care and encouragement from NovaCare, he's back to playing cricket with his friends!",
            "rating": 5,
            "is_approved": True,
            "image_url": "https://randomuser.me/api/portraits/men/32.jpg",
            "story_type": "article",
            "tips": "Follow your physiotherapist's advice and stay consistent,Don't rush—healing takes time and patience,Stay positive and focus on your goals"
        },
        {
            "patient_name": "Anitha Reddy",
            "subtitle": "Chronic Back Pain Relief",
            "content": "For over six years, Anitha struggled with chronic lower back pain. Everything changed when she visited NovaCare. Her treatment plan included gentle manual therapy, progressive exercises, and posture correction. Today, she is pain-free and enjoys hiking, dancing, and playing with her son.",
            "rating": 5,
            "is_approved": True,
            "image_url": "https://randomuser.me/api/portraits/women/65.jpg",
            "story_type": "article",
            "tips": "Don't ignore persistent pain—seek professional help early,Stay consistent with your exercises even when progress feels slow,Choose a clinic where you feel supported and understood"
        },
        {
            "patient_name": "Padma Rani",
            "subtitle": "Stroke Recovery Journey",
            "content": "My mother's stroke recovery was remarkable thanks to Dr. Rajesh's neurological expertise. Forever grateful for the compassionate care at NovaCare!",
            "rating": 5,
            "is_approved": True,
            "image_url": "https://randomuser.me/api/portraits/women/55.jpg",
            "story_type": "article",
            "tips": "Patience and persistence are key,Family involvement makes a difference,Celebrate every milestone"
        },
        {
            "patient_name": "Karthik Reddy",
            "subtitle": "Professional Athlete",
            "content": "Clean facility, professional staff, and excellent treatment. The online booking system makes it so convenient. As a professional athlete, I trust only NovaCare for my recovery.",
            "rating": 4,
            "is_approved": True,
            "image_url": "https://randomuser.me/api/portraits/men/45.jpg",
            "story_type": "article",
            "tips": "Prioritize proper recovery,Communicate openly with your therapist,Follow through on your home exercises"
        }
    ]
    
    for testimonial_data in testimonials_data:
        testimonial = Testimonial(**testimonial_data)
        db.add(testimonial)
    
    db.commit()
    
    print("Database seeded successfully!")

