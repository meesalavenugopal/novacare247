from app.database import SessionLocal
from app.models import Testimonial

testimonials_data = [
    {
        "patient_name": "Lizzy Thomas",
        "subtitle": "Recovered from Knee Injury",
        "content": "After my accident, I never thought I would walk pain-free again. Thanks to NovaCare's expert team, I'm back on my feet and even jogging! The encouragement and care I received made all the difference. I'm so grateful!",
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

if __name__ == "__main__":
    db = SessionLocal()
    for t in testimonials_data:
        db.add(Testimonial(**t))
    db.commit()
    db.close()
    print("Testimonials seeded successfully!")
