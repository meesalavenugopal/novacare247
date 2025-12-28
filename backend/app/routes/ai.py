"""
AI-powered endpoints for enhanced user experience
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import random
from app.database import get_db
from app.models import User, BlogArticle
from app.auth import get_admin_user
from app import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI"])

# ============ Curated Blog Topics for Daily Posts ============
DAILY_BLOG_TOPICS = [
    # Back Pain Topics
    {"topic": "10 Effective Exercises for Lower Back Pain Relief", "keywords": "lower back pain, exercises, stretching, relief", "audience": "office workers and adults with sedentary lifestyles"},
    {"topic": "Understanding Sciatica: Causes, Symptoms, and Treatment", "keywords": "sciatica, leg pain, nerve pain, treatment", "audience": "people experiencing leg pain and numbness"},
    {"topic": "How Poor Posture Causes Back Pain and Ways to Fix It", "keywords": "posture, back pain, ergonomics, desk work", "audience": "office professionals and students"},
    {"topic": "Best Sleeping Positions for Back Pain Relief", "keywords": "sleeping positions, back pain, mattress, pillow", "audience": "people with chronic back issues"},
    {"topic": "Lumbar Disc Herniation: What You Need to Know", "keywords": "disc herniation, slipped disc, spine, treatment", "audience": "patients with disc problems"},
    
    # Neck Pain Topics
    {"topic": "Tech Neck: How Smartphones Are Hurting Your Spine", "keywords": "tech neck, smartphone, posture, neck pain", "audience": "young adults and teenagers"},
    {"topic": "Simple Neck Stretches You Can Do at Your Desk", "keywords": "neck stretches, desk exercises, office workout", "audience": "office workers"},
    {"topic": "Cervical Spondylosis: Causes and Management", "keywords": "cervical spondylosis, neck arthritis, treatment", "audience": "middle-aged and older adults"},
    {"topic": "Whiplash Injury: Recovery and Rehabilitation", "keywords": "whiplash, car accident, neck injury, recovery", "audience": "accident victims"},
    
    # Sports Injuries
    {"topic": "Common Running Injuries and How to Prevent Them", "keywords": "running injuries, prevention, knee pain, shin splints", "audience": "runners and joggers"},
    {"topic": "Rotator Cuff Injuries: Treatment and Recovery", "keywords": "rotator cuff, shoulder injury, sports injury", "audience": "athletes and active adults"},
    {"topic": "ACL Injury Rehabilitation: A Complete Guide", "keywords": "ACL tear, knee injury, rehabilitation, sports", "audience": "athletes and sports enthusiasts"},
    {"topic": "Tennis Elbow: Causes and Effective Treatments", "keywords": "tennis elbow, elbow pain, tendinitis", "audience": "tennis players and manual workers"},
    {"topic": "Ankle Sprain Recovery: Step-by-Step Rehabilitation", "keywords": "ankle sprain, recovery, rehabilitation, exercises", "audience": "athletes and active individuals"},
    {"topic": "Preventing Sports Injuries: Warm-up and Cool-down Tips", "keywords": "sports injury prevention, warm-up, stretching", "audience": "athletes and fitness enthusiasts"},
    
    # Joint Pain
    {"topic": "Knee Pain: Common Causes and When to See a Doctor", "keywords": "knee pain, arthritis, joint pain, treatment", "audience": "adults with knee problems"},
    {"topic": "Osteoarthritis Management Through Physiotherapy", "keywords": "osteoarthritis, joint pain, physiotherapy, exercise", "audience": "elderly and arthritis patients"},
    {"topic": "Frozen Shoulder: Symptoms, Stages, and Treatment", "keywords": "frozen shoulder, adhesive capsulitis, shoulder pain", "audience": "middle-aged adults"},
    {"topic": "Hip Pain: Causes and Physiotherapy Solutions", "keywords": "hip pain, hip arthritis, exercises, treatment", "audience": "adults with hip problems"},
    
    # Post-Surgery Rehabilitation
    {"topic": "Recovery After Knee Replacement Surgery", "keywords": "knee replacement, surgery recovery, rehabilitation", "audience": "knee replacement patients"},
    {"topic": "Post-Surgery Rehabilitation: What to Expect", "keywords": "post-surgery, rehabilitation, recovery, physiotherapy", "audience": "surgery patients"},
    {"topic": "Hip Replacement Recovery: A Comprehensive Guide", "keywords": "hip replacement, surgery, recovery, exercises", "audience": "hip replacement patients"},
    {"topic": "Returning to Sports After ACL Surgery", "keywords": "ACL surgery, sports return, rehabilitation", "audience": "athletes post-surgery"},
    
    # Neurological Conditions
    {"topic": "Stroke Rehabilitation: The Role of Physiotherapy", "keywords": "stroke, rehabilitation, recovery, neurological", "audience": "stroke patients and caregivers"},
    {"topic": "Parkinson's Disease and Exercise: Benefits and Tips", "keywords": "Parkinson's, exercise, balance, movement", "audience": "Parkinson's patients and families"},
    {"topic": "Managing Multiple Sclerosis with Physiotherapy", "keywords": "multiple sclerosis, MS, physiotherapy, management", "audience": "MS patients"},
    {"topic": "Balance Disorders: Causes and Vestibular Rehabilitation", "keywords": "balance, vertigo, vestibular, rehabilitation", "audience": "people with balance issues"},
    
    # Lifestyle and Prevention
    {"topic": "Ergonomic Workspace Setup: A Complete Guide", "keywords": "ergonomics, workspace, office setup, posture", "audience": "remote workers and office employees"},
    {"topic": "Benefits of Regular Stretching for Overall Health", "keywords": "stretching, flexibility, health benefits", "audience": "general public"},
    {"topic": "How to Maintain Good Posture Throughout the Day", "keywords": "posture, daily habits, spine health", "audience": "everyone"},
    {"topic": "Exercise Tips for Seniors: Staying Active Safely", "keywords": "senior exercise, elderly fitness, safe workouts", "audience": "seniors and caregivers"},
    {"topic": "Desk Exercises: Stay Active During Work Hours", "keywords": "desk exercises, office fitness, sedentary lifestyle", "audience": "office workers"},
    {"topic": "The Importance of Core Strengthening", "keywords": "core exercises, abs, back strength, stability", "audience": "fitness enthusiasts"},
    
    # Specific Treatments
    {"topic": "Understanding Dry Needling: Benefits and What to Expect", "keywords": "dry needling, trigger points, muscle pain", "audience": "people considering dry needling"},
    {"topic": "Cupping Therapy: Ancient Technique for Modern Pain Relief", "keywords": "cupping therapy, muscle recovery, pain relief", "audience": "people interested in alternative therapies"},
    {"topic": "Electrotherapy in Physiotherapy: How It Works", "keywords": "electrotherapy, TENS, muscle stimulation", "audience": "patients curious about electrotherapy"},
    {"topic": "Manual Therapy: Hands-on Healing for Pain Relief", "keywords": "manual therapy, massage, mobilization", "audience": "patients seeking hands-on treatment"},
    {"topic": "Hydrotherapy: Water-Based Rehabilitation", "keywords": "hydrotherapy, aquatic therapy, water exercises", "audience": "rehabilitation patients"},
    
    # Pain Management
    {"topic": "Understanding Chronic Pain and How to Manage It", "keywords": "chronic pain, pain management, treatment", "audience": "chronic pain sufferers"},
    {"topic": "Fibromyalgia: Living Well with Chronic Pain", "keywords": "fibromyalgia, chronic pain, management, exercise", "audience": "fibromyalgia patients"},
    {"topic": "Headaches and Physiotherapy: A Natural Approach", "keywords": "headaches, migraines, physiotherapy, treatment", "audience": "headache sufferers"},
    {"topic": "TMJ Disorders: Causes and Treatment Options", "keywords": "TMJ, jaw pain, treatment, exercises", "audience": "people with jaw problems"},
    
    # Women's Health
    {"topic": "Pregnancy and Back Pain: Safe Exercises and Relief", "keywords": "pregnancy, back pain, prenatal exercise", "audience": "pregnant women"},
    {"topic": "Postpartum Recovery: Rebuilding Core Strength", "keywords": "postpartum, core strength, recovery, diastasis recti", "audience": "new mothers"},
    {"topic": "Pelvic Floor Exercises: Why They Matter", "keywords": "pelvic floor, kegel exercises, women's health", "audience": "women of all ages"},
    
    # Pediatric
    {"topic": "Childhood Developmental Delays: Early Intervention", "keywords": "developmental delays, pediatric physiotherapy, children", "audience": "parents of young children"},
    {"topic": "Sports Injuries in Young Athletes: Prevention and Care", "keywords": "youth sports, injuries, prevention, treatment", "audience": "parents and young athletes"},
    
    # Mental Health Connection
    {"topic": "The Connection Between Physical Activity and Mental Health", "keywords": "exercise, mental health, anxiety, depression", "audience": "general public"},
    {"topic": "Stress Relief Through Movement and Exercise", "keywords": "stress relief, exercise, relaxation, wellness", "audience": "stressed individuals"},
    
    # Seasonal Topics
    {"topic": "Winter Exercise Tips: Staying Active in Cold Weather", "keywords": "winter exercise, cold weather, indoor workouts", "audience": "fitness enthusiasts"},
    {"topic": "Monsoon Health: Preventing Injuries in Rainy Season", "keywords": "monsoon, rainy season, injury prevention, safety", "audience": "Indian readers"},
    {"topic": "Summer Workout Safety: Beating the Heat", "keywords": "summer exercise, heat safety, hydration", "audience": "outdoor exercisers"},
]

# ============ Stock Images for Blog Articles ============
BLOG_IMAGES = {
    # Back Pain
    "back": [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",  # Person stretching
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",  # Physio session
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&h=450&fit=crop",  # Back exercise
    ],
    # Neck Pain
    "neck": [
        "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?w=800&h=450&fit=crop",  # Neck pain
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&h=450&fit=crop",  # Office worker
    ],
    # Sports
    "sports": [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",  # Running
        "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=450&fit=crop",  # Sports physio
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=450&fit=crop",  # Athletic
    ],
    # Exercise/Stretching
    "exercise": [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop",  # Stretching
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=450&fit=crop",  # Exercise class
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",  # Workout
    ],
    # Rehabilitation
    "rehab": [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop",  # Therapy
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=450&fit=crop",  # Medical care
    ],
    # Elderly/Seniors
    "seniors": [
        "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&h=450&fit=crop",  # Senior exercise
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=450&fit=crop",  # Active elderly
    ],
    # Office/Ergonomics
    "office": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",  # Office setup
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&h=450&fit=crop",  # Desk work
    ],
    # General Health/Wellness
    "wellness": [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",  # Meditation
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",  # Wellness
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop",  # Health
    ],
    # Knee/Joints
    "joints": [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",  # Joint therapy
        "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=450&fit=crop",  # Physio
    ],
    # Pregnancy/Women
    "women": [
        "https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=800&h=450&fit=crop",  # Prenatal
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",  # Exercise
    ],
    # Default
    "default": [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    ]
}

def get_relevant_image(topic: str) -> str:
    """Get a relevant image based on the topic keywords"""
    topic_lower = topic.lower()
    
    if any(word in topic_lower for word in ["back", "spine", "lumbar", "sciatica", "disc"]):
        images = BLOG_IMAGES["back"]
    elif any(word in topic_lower for word in ["neck", "cervical", "whiplash", "tech neck"]):
        images = BLOG_IMAGES["neck"]
    elif any(word in topic_lower for word in ["sport", "running", "athlete", "acl", "tennis", "ankle"]):
        images = BLOG_IMAGES["sports"]
    elif any(word in topic_lower for word in ["stretch", "exercise", "workout", "core"]):
        images = BLOG_IMAGES["exercise"]
    elif any(word in topic_lower for word in ["surgery", "rehab", "stroke", "parkinson"]):
        images = BLOG_IMAGES["rehab"]
    elif any(word in topic_lower for word in ["senior", "elderly", "older adult"]):
        images = BLOG_IMAGES["seniors"]
    elif any(word in topic_lower for word in ["office", "desk", "ergonomic", "posture", "workspace"]):
        images = BLOG_IMAGES["office"]
    elif any(word in topic_lower for word in ["knee", "hip", "joint", "arthritis", "shoulder", "frozen"]):
        images = BLOG_IMAGES["joints"]
    elif any(word in topic_lower for word in ["pregnancy", "postpartum", "pelvic", "women"]):
        images = BLOG_IMAGES["women"]
    elif any(word in topic_lower for word in ["stress", "mental", "wellness", "sleep"]):
        images = BLOG_IMAGES["wellness"]
    else:
        images = BLOG_IMAGES["default"]
    
    return random.choice(images)


# ============ Request/Response Schemas ============

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = None

class ChatResponse(BaseModel):
    response: str
    success: bool

class SymptomAnalysisRequest(BaseModel):
    symptoms: str

class SymptomAnalysisResponse(BaseModel):
    summary: Optional[str] = None
    possible_conditions: Optional[List[str]] = None
    recommended_services: Optional[List[str]] = None
    urgency: Optional[str] = None
    specialist_type: Optional[str] = None
    success: bool
    message: Optional[str] = None

class GenerateServiceContentRequest(BaseModel):
    service_name: str
    short_description: str

class GenerateDoctorContentRequest(BaseModel):
    name: str
    specialization: str
    experience_years: int
    qualification: str

class GenerateInquiryReplyRequest(BaseModel):
    inquiry_name: str
    inquiry_subject: str
    inquiry_message: str

class GenerateBlogArticleRequest(BaseModel):
    topic: str
    keywords: Optional[str] = None
    target_audience: Optional[str] = None

class GenerateBlogOutlineRequest(BaseModel):
    topic: str

class ImproveBlogContentRequest(BaseModel):
    content: str
    improvement_type: Optional[str] = "general"  # seo, readability, engagement, general

class GenerateContentResponse(BaseModel):
    content: Optional[Dict] = None
    success: bool
    message: Optional[str] = None


# ============ Public AI Endpoints ============

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(request: ChatRequest):
    """
    Chat with AI assistant for general inquiries
    Available to all users
    """
    response = ai_service.chat_with_assistant(
        request.message,
        request.conversation_history
    )
    
    if response:
        return ChatResponse(response=response, success=True)
    else:
        return ChatResponse(
            response="I'm sorry, I'm unable to respond right now. Please try again or contact us directly at +91 1234567890.",
            success=False
        )


@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
def analyze_symptoms(request: SymptomAnalysisRequest):
    """
    Analyze symptoms and suggest relevant services
    Includes disclaimer about professional consultation
    """
    result = ai_service.analyze_symptoms(request.symptoms)
    
    if result:
        return SymptomAnalysisResponse(
            summary=result.get("summary"),
            possible_conditions=result.get("possible_conditions"),
            recommended_services=result.get("recommended_services"),
            urgency=result.get("urgency"),
            specialist_type=result.get("specialist_type"),
            success=True,
            message="This is for informational purposes only. Please consult our specialists for proper diagnosis."
        )
    else:
        return SymptomAnalysisResponse(
            success=False,
            message="Unable to analyze symptoms. Please describe your symptoms to our specialists directly."
        )


# ============ Admin AI Endpoints ============

@router.post("/generate/service-content", response_model=GenerateContentResponse)
def generate_service_content(
    request: GenerateServiceContentRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate detailed service content using AI (Admin only)
    Returns: detailed_description, benefits, conditions_treated, treatment_process, faqs
    """
    result = ai_service.generate_service_description(
        request.service_name,
        request.short_description
    )
    
    if result:
        return GenerateContentResponse(content=result, success=True)
    else:
        return GenerateContentResponse(
            success=False,
            message="Failed to generate content. Please try again."
        )


@router.post("/generate/doctor-content", response_model=GenerateContentResponse)
def generate_doctor_content(
    request: GenerateDoctorContentRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate doctor bio and story using AI (Admin only)
    Returns: bio, story, expertise
    """
    result = ai_service.generate_doctor_bio(
        request.name,
        request.specialization,
        request.experience_years,
        request.qualification
    )
    
    if result:
        return GenerateContentResponse(content=result, success=True)
    else:
        return GenerateContentResponse(
            success=False,
            message="Failed to generate content. Please try again."
        )


@router.post("/generate/inquiry-reply")
def generate_inquiry_reply(
    request: GenerateInquiryReplyRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate a professional reply to a contact inquiry (Admin only)
    """
    result = ai_service.generate_ai_reply_to_inquiry(
        request.inquiry_name,
        request.inquiry_message,
        request.inquiry_subject
    )
    
    if result:
        return {"reply": result, "success": True}
    else:
        return {"reply": None, "success": False, "message": "Failed to generate reply."}


@router.post("/generate/testimonial-response")
def generate_testimonial_response(
    patient_name: str,
    rating: int,
    content: str,
    admin: User = Depends(get_admin_user)
):
    """
    Generate a thank you response for a testimonial (Admin only)
    """
    result = ai_service.generate_testimonial_response(patient_name, rating, content)
    
    if result:
        return {"response": result, "success": True}
    else:
        return {"response": None, "success": False, "message": "Failed to generate response."}


# ============ Blog AI Endpoints ============

@router.post("/generate/blog-article")
def generate_blog_article(
    request: GenerateBlogArticleRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate a complete blog article using AI (Admin only)
    Returns: title, slug, excerpt, content (HTML), meta_description, category, tags
    """
    result = ai_service.generate_blog_article(
        request.topic,
        request.keywords,
        request.target_audience
    )
    
    if result:
        return {"article": result, "success": True}
    else:
        return {"article": None, "success": False, "message": "Failed to generate article. Please try again."}


@router.post("/generate/blog-outline")
def generate_blog_outline(
    request: GenerateBlogOutlineRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate a blog article outline for review (Admin only)
    """
    result = ai_service.generate_blog_outline(request.topic)
    
    if result:
        return {"outline": result, "success": True}
    else:
        return {"outline": None, "success": False, "message": "Failed to generate outline."}


@router.post("/improve/blog-content")
def improve_blog_content(
    request: ImproveBlogContentRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Improve existing blog content (Admin only)
    """
    result = ai_service.improve_blog_content(request.content, request.improvement_type)
    
    if result:
        return {"improved_content": result, "success": True}
    else:
        return {"improved_content": None, "success": False, "message": "Failed to improve content."}


def generate_slug(text: str) -> str:
    """Generate URL-friendly slug from text"""
    import re
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


@router.get("/blog/available-topics")
def get_available_topics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """
    Get list of topics that haven't been used yet (Admin only)
    """
    # Get all existing article titles/slugs
    existing_articles = db.query(BlogArticle.title, BlogArticle.slug).all()
    existing_titles = {a.title.lower() for a in existing_articles}
    existing_slugs = {a.slug for a in existing_articles}
    
    # Filter out used topics
    available_topics = []
    for topic_data in DAILY_BLOG_TOPICS:
        topic_slug = generate_slug(topic_data["topic"])
        # Check if topic or similar slug exists
        if (topic_data["topic"].lower() not in existing_titles and 
            topic_slug not in existing_slugs):
            available_topics.append(topic_data)
    
    return {
        "available_topics": available_topics,
        "total_topics": len(DAILY_BLOG_TOPICS),
        "used_topics": len(DAILY_BLOG_TOPICS) - len(available_topics),
        "remaining_topics": len(available_topics)
    }


@router.post("/generate/daily-article")
def generate_daily_article(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """
    Generate a daily blog article from available topics (Admin only)
    Automatically picks an unused topic and generates content
    """
    # Get all existing article titles/slugs
    existing_articles = db.query(BlogArticle.title, BlogArticle.slug).all()
    existing_titles = {a.title.lower() for a in existing_articles}
    existing_slugs = {a.slug for a in existing_articles}
    
    # Filter out used topics
    available_topics = []
    for topic_data in DAILY_BLOG_TOPICS:
        topic_slug = generate_slug(topic_data["topic"])
        if (topic_data["topic"].lower() not in existing_titles and 
            topic_slug not in existing_slugs):
            available_topics.append(topic_data)
    
    if not available_topics:
        return {
            "success": False,
            "message": "All topics have been used! Add more topics to continue.",
            "article": None
        }
    
    # Pick a random topic from available ones
    selected_topic = random.choice(available_topics)
    
    # Generate article using AI
    result = ai_service.generate_blog_article(
        selected_topic["topic"],
        selected_topic["keywords"],
        selected_topic["audience"]
    )
    
    if result:
        return {
            "success": True,
            "article": result,
            "topic_used": selected_topic,
            "remaining_topics": len(available_topics) - 1
        }
    else:
        return {
            "success": False,
            "message": "Failed to generate article. Please try again.",
            "article": None
        }


@router.post("/generate/daily-article-and-publish")
def generate_and_publish_daily_article(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """
    Generate and immediately publish a daily blog article (Admin only)
    One-click solution for daily content
    """
    # Get all existing article titles/slugs
    existing_articles = db.query(BlogArticle.title, BlogArticle.slug).all()
    existing_titles = {a.title.lower() for a in existing_articles}
    existing_slugs = {a.slug for a in existing_articles}
    
    # Filter out used topics
    available_topics = []
    for topic_data in DAILY_BLOG_TOPICS:
        topic_slug = generate_slug(topic_data["topic"])
        if (topic_data["topic"].lower() not in existing_titles and 
            topic_slug not in existing_slugs):
            available_topics.append(topic_data)
    
    if not available_topics:
        return {
            "success": False,
            "message": "All topics have been used! Add more topics to continue.",
            "article": None
        }
    
    # Pick a random topic from available ones
    selected_topic = random.choice(available_topics)
    
    # Generate article using AI
    result = ai_service.generate_blog_article(
        selected_topic["topic"],
        selected_topic["keywords"],
        selected_topic["audience"]
    )
    
    if not result:
        return {
            "success": False,
            "message": "Failed to generate article. Please try again.",
            "article": None
        }
    
    # Create and save the article
    try:
        import json
        
        # Map AI category to our categories
        category_map = {
            'Pain Management': 'conditions',
            'Exercise & Rehabilitation': 'exercises',
            'Sports & Fitness': 'sports',
            'Health Tips': 'lifestyle',
            'Treatment Guides': 'recovery',
            'Patient Stories': 'lifestyle'
        }
        
        article_slug = result.get("slug") or generate_slug(result.get("title", selected_topic["topic"]))
        
        # Estimate read time
        content = result.get("content", "")
        word_count = len(content.replace("<", " <").split())
        read_time = f"{max(1, word_count // 200)} min read"
        
        # Get relevant image based on topic
        article_image = get_relevant_image(selected_topic["topic"])
        
        new_article = BlogArticle(
            title=result.get("title", selected_topic["topic"]),
            slug=article_slug,
            excerpt=result.get("excerpt", ""),
            content=content,
            category=category_map.get(result.get("category"), "conditions"),
            author="NovaCare Team",
            author_role="Medical Content Team",
            read_time=read_time,
            image=article_image,
            tags=json.dumps(result.get("tags", [])),
            faqs=json.dumps([]),
            is_published=True,
            is_featured=False
        )
        
        db.add(new_article)
        db.commit()
        db.refresh(new_article)
        
        return {
            "success": True,
            "message": "Article generated and published successfully!",
            "article": {
                "id": new_article.id,
                "title": new_article.title,
                "slug": new_article.slug,
                "category": new_article.category,
                "image": new_article.image
            },
            "topic_used": selected_topic,
            "remaining_topics": len(available_topics) - 1
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Failed to save article: {str(e)}",
            "article": None
        }
