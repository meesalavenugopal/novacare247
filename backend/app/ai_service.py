"""
AI Service module for OpenAI integration
Provides AI-powered features throughout the application
"""
from openai import OpenAI
from app.config import settings
from typing import Optional, List, Dict
import json

# Initialize OpenAI client
client = None

def get_openai_client():
    global client
    if client is None and settings.OPENAI_API_KEY:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return client


def generate_chat_response(
    messages: List[Dict[str, str]],
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None
) -> Optional[str]:
    """
    Generate a response using OpenAI chat completion
    """
    openai_client = get_openai_client()
    if not openai_client:
        return None
    
    try:
        response = openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=max_tokens or settings.OPENAI_MAX_TOKENS,
            temperature=temperature or settings.OPENAI_TEMPERATURE
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return None


def generate_service_description(service_name: str, short_description: str) -> Optional[Dict]:
    """
    Generate detailed service content using AI
    Returns: benefits, conditions_treated, treatment_process, faqs, detailed_description
    """
    prompt = f"""You are a medical content writer for a physiotherapy clinic called NovaCare 24/7.
    
Generate comprehensive content for this physiotherapy service:
Service Name: {service_name}
Short Description: {short_description}

Provide a JSON response with these fields:
1. "detailed_description": A 2-paragraph detailed description (professional, informative)
2. "benefits": Array of 6 benefits (short phrases)
3. "conditions_treated": Array of 8 conditions this treats
4. "treatment_process": Array of 5 objects with "step", "title", "description"
5. "faqs": Array of 3 objects with "question" and "answer"

Respond ONLY with valid JSON, no markdown or explanations."""

    messages = [
        {"role": "system", "content": "You are a professional medical content writer specializing in physiotherapy. Always respond with valid JSON only."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=2000, temperature=0.7)
    if response:
        try:
            # Clean response if it has markdown code blocks
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def generate_doctor_bio(name: str, specialization: str, experience_years: int, qualification: str) -> Optional[Dict]:
    """
    Generate doctor bio and story using AI
    Returns: bio, story, expertise
    """
    prompt = f"""You are a medical content writer for a physiotherapy clinic called NovaCare 24/7.

Generate professional content for this doctor profile:
Name: {name}
Specialization: {specialization}
Experience: {experience_years} years
Qualification: {qualification}

Provide a JSON response with:
1. "bio": A 2-sentence professional bio (under 150 characters)
2. "story": A 3-paragraph inspiring story about their journey in physiotherapy (300-400 words)
3. "expertise": Array of 5 specific expertise areas

Respond ONLY with valid JSON, no markdown or explanations."""

    messages = [
        {"role": "system", "content": "You are a professional medical content writer. Always respond with valid JSON only."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=1500, temperature=0.7)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def generate_ai_reply_to_inquiry(inquiry_name: str, inquiry_message: str, inquiry_subject: str) -> Optional[str]:
    """
    Generate a professional reply to a contact inquiry
    """
    prompt = f"""You are a customer service representative for NovaCare 24/7 Physiotherapy Clinics.

Generate a professional, warm, and helpful reply to this customer inquiry:

Customer Name: {inquiry_name}
Subject: {inquiry_subject}
Message: {inquiry_message}

Guidelines:
- Be professional yet warm and empathetic
- Address their concerns directly
- Offer next steps or solutions
- Include a call-to-action (book appointment, call us, etc.)
- Keep it concise (150-200 words)
- Sign off as "NovaCare 24/7 Team"

Write the reply only, no explanations."""

    messages = [
        {"role": "system", "content": "You are a helpful and professional customer service representative for a physiotherapy clinic."},
        {"role": "user", "content": prompt}
    ]
    
    return generate_chat_response(messages, max_tokens=500, temperature=0.7)


def generate_testimonial_response(patient_name: str, rating: int, content: str) -> Optional[str]:
    """
    Generate a thank you response for a testimonial
    """
    sentiment = "wonderful" if rating >= 4 else "valuable"
    
    prompt = f"""You are responding on behalf of NovaCare 24/7 Physiotherapy Clinics to a patient testimonial.

Patient: {patient_name}
Rating: {rating}/5 stars
Their testimonial: {content}

Write a brief, warm thank you response (2-3 sentences):
- Thank them for their {sentiment} feedback
- Express that their recovery journey matters to us
- Wish them continued health

Write the response only, no explanations."""

    messages = [
        {"role": "system", "content": "You are a warm and professional healthcare provider responding to patient feedback."},
        {"role": "user", "content": prompt}
    ]
    
    return generate_chat_response(messages, max_tokens=150, temperature=0.7)


def analyze_symptoms(symptoms: str) -> Optional[Dict]:
    """
    Analyze patient symptoms and suggest relevant services/specialists
    """
    prompt = f"""You are a medical assistant for a physiotherapy clinic.

A patient describes these symptoms: {symptoms}

Analyze and provide:
1. "summary": Brief summary of the condition (1-2 sentences)
2. "possible_conditions": Array of 2-3 possible conditions
3. "recommended_services": Array of 2-3 relevant physiotherapy services
4. "urgency": "low", "medium", or "high"
5. "specialist_type": Type of physiotherapist to see (e.g., "Orthopedic", "Sports", "Neurological")

IMPORTANT: This is for informational purposes only. Always recommend consulting a professional.

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are a helpful medical assistant providing preliminary guidance. Always recommend professional consultation."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=500, temperature=0.5)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def chat_with_assistant(user_message: str, conversation_history: List[Dict] = None) -> Optional[str]:
    """
    General chat with AI assistant for the clinic
    """
    system_prompt = """You are a helpful AI assistant for NovaCare 24/7 Physiotherapy Clinics.

About NovaCare 24/7:
- Premier physiotherapy clinic chain in India
- Offers services: Manual Therapy, Electrotherapy, Exercise Therapy, Sports Injury Treatment, Stroke Rehabilitation, Back Pain Treatment, Neck Pain Treatment, Dry Needling, Cupping Therapy
- Available 24/7 with clinic visits, home visits, and video consultations
- Expert team of qualified physiotherapists

You can help with:
- Information about services and treatments
- General physiotherapy advice
- Booking guidance
- Answering FAQs about physiotherapy

Always be professional, empathetic, and helpful. For specific medical advice, recommend booking an appointment with our specialists."""

    messages = [{"role": "system", "content": system_prompt}]
    
    if conversation_history:
        messages.extend(conversation_history)
    
    messages.append({"role": "user", "content": user_message})
    
    return generate_chat_response(messages, max_tokens=500, temperature=0.7)


def generate_blog_article(topic: str, keywords: Optional[str] = None, target_audience: Optional[str] = None) -> Optional[Dict]:
    """
    Generate a complete blog article about physiotherapy topics
    Returns: title, slug, excerpt, content (HTML), meta_description, category, tags, featured_image_alt
    """
    audience = target_audience or "general public seeking physiotherapy information"
    kw = keywords or topic
    
    prompt = f"""You are a professional medical content writer for NovaCare 24/7 Physiotherapy Clinic blog.

Write a comprehensive blog article about: {topic}

Target Audience: {audience}
Keywords to include naturally: {kw}

Provide a JSON response with these fields:
1. "title": SEO-optimized title (50-60 characters)
2. "slug": URL-friendly slug (lowercase, hyphens)
3. "excerpt": Compelling summary (150-160 characters)
4. "content": Full article content in HTML format with:
   - Introduction paragraph
   - 4-5 main sections with h2 headings
   - Bullet points where appropriate
   - Practical tips or exercises
   - Conclusion with call-to-action mentioning NovaCare
   - Use <p>, <h2>, <ul>, <li>, <strong>, <em> tags
   - Minimum 800 words
5. "meta_description": SEO meta description (150-160 characters)
6. "category": One of: "Pain Management", "Exercise & Rehabilitation", "Sports & Fitness", "Health Tips", "Treatment Guides", "Patient Stories"
7. "tags": Array of 4-6 relevant tags
8. "featured_image_alt": Alt text for featured image

Make the content:
- Evidence-based and accurate
- Easy to read and engaging
- SEO-optimized with natural keyword usage
- Helpful and actionable
- Professional but approachable tone

Respond ONLY with valid JSON, no markdown code blocks."""

    messages = [
        {"role": "system", "content": "You are an expert medical content writer specializing in physiotherapy and rehabilitation. Write accurate, engaging, SEO-friendly content. Always respond with valid JSON only."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=4000, temperature=0.7)
    if response:
        try:
            # Clean response if it has markdown code blocks
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return None
    return None


def generate_blog_outline(topic: str) -> Optional[Dict]:
    """
    Generate a blog article outline for review before full generation
    """
    prompt = f"""You are a content strategist for a physiotherapy clinic blog.

Create a detailed outline for a blog article about: {topic}

Provide a JSON response with:
1. "suggested_title": SEO-optimized title
2. "target_audience": Who this article is for
3. "main_keyword": Primary SEO keyword
4. "secondary_keywords": Array of 3-4 related keywords
5. "sections": Array of objects with "heading" and "key_points" (array of bullet points)
6. "estimated_word_count": Number
7. "suggested_category": Article category

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are an expert content strategist. Respond with valid JSON only."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=1000, temperature=0.7)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def improve_blog_content(content: str, improvement_type: str = "general") -> Optional[str]:
    """
    Improve existing blog content
    improvement_type: "seo", "readability", "engagement", "general"
    """
    improvements = {
        "seo": "Optimize for search engines while keeping it natural",
        "readability": "Make it easier to read with simpler sentences and better structure",
        "engagement": "Make it more engaging with hooks, questions, and compelling CTAs",
        "general": "Improve overall quality, clarity, and impact"
    }
    
    prompt = f"""You are a professional content editor for a physiotherapy blog.

Improve the following content. Focus on: {improvements.get(improvement_type, improvements["general"])}

Original content:
{content}

Provide the improved content in HTML format. Keep the same structure but enhance the writing.
Respond with the improved HTML content only, no explanations."""

    messages = [
        {"role": "system", "content": "You are an expert content editor. Provide only the improved content."},
        {"role": "user", "content": prompt}
    ]
    
    return generate_chat_response(messages, max_tokens=4000, temperature=0.6)


# ============ DOCTOR ONBOARDING AI FUNCTIONS ============

def verify_doctor_credentials(
    name: str,
    license_number: str,
    license_authority: str,
    qualification: str,
    experience_years: int,
    specialization: str
) -> Optional[Dict]:
    """
    AI-assisted verification of doctor credentials.
    Returns analysis, score, flags, and recommendations for human review.
    NOTE: This is AI-ASSISTED only - requires human approval.
    """
    prompt = f"""You are a medical credentials verification assistant for NovaCare 24/7 Physiotherapy Clinics.

Analyze the following doctor application for potential issues. This is for PRELIMINARY SCREENING only.
A human administrator will make the final verification decision.

Applicant Details:
- Name: {name}
- License Number: {license_number}
- Issuing Authority: {license_authority}
- Qualification: {qualification}
- Experience: {experience_years} years
- Specialization: {specialization}

Analyze and provide a JSON response with:
1. "score": Preliminary confidence score 0-100 based on information completeness
2. "analysis": Object with:
   - "license_format_valid": Boolean - does license format look valid for Indian physiotherapy councils?
   - "qualification_recognized": Boolean - is the qualification recognized (BPT, MPT, DPT, PhD)?
   - "experience_reasonable": Boolean - does experience align with qualification timeline?
   - "specialization_valid": Boolean - is specialization legitimate in physiotherapy?
3. "flags": Array of concerns that need human attention (e.g., "License format unusual", "Very high experience claim")
4. "recommendations": Array of actions for human reviewer (e.g., "Verify license with State Council", "Request additional certificates")
5. "verification_steps": Array of suggested verification steps for the human reviewer
6. "notes": Brief summary for the reviewer

IMPORTANT: This is preliminary AI analysis only. Always recommend human verification for:
- License authenticity with issuing authority
- Degree certificate verification
- Background checks

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are a careful medical credentials screening assistant. Flag any concerns for human review. Always recommend human verification for important credentials."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=1000, temperature=0.3)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def generate_interview_questions(
    name: str,
    specialization: str,
    experience_years: int,
    qualification: str
) -> Optional[Dict]:
    """
    Generate customized interview questions for doctor candidates.
    """
    prompt = f"""You are an interview coordinator for NovaCare 24/7 Physiotherapy Clinics.

Generate interview questions for this physiotherapist candidate:
- Name: {name}
- Specialization: {specialization}
- Experience: {experience_years} years
- Qualification: {qualification}

Create a JSON response with 10 interview questions across these categories:
1. "clinical_knowledge": 3 questions about their specialization
2. "patient_handling": 2 questions about patient communication and care
3. "ethics_compliance": 2 questions about medical ethics and professional conduct
4. "platform_fit": 2 questions about working with NovaCare's model (home visits, video consults, 24/7 availability)
5. "scenario_based": 1 complex scenario question

Each question should be an object with:
- "question": The interview question
- "category": Category name
- "expected_points": Array of 2-3 key points a good answer should cover
- "difficulty": "basic", "intermediate", or "advanced"

Adjust difficulty based on experience level.

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are an expert physiotherapy interviewer. Create thoughtful, relevant questions."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=2000, temperature=0.6)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def generate_training_content(topic: str, for_specialization: str = None) -> Optional[Dict]:
    """
    Generate AI-powered training module content for doctor onboarding.
    """
    spec_context = f" with focus on {for_specialization}" if for_specialization else ""
    
    prompt = f"""You are a training content creator for NovaCare 24/7 Physiotherapy Clinics.

Create training module content about: {topic}{spec_context}

Generate a JSON response with:
1. "title": Module title
2. "description": Brief description (1-2 sentences)
3. "content": HTML formatted training content with:
   - Introduction
   - 3-4 main sections with h2 headings
   - Key points as bullet lists
   - Best practices
   - Do's and Don'ts
   - Summary
4. "duration_minutes": Estimated reading/learning time
5. "quiz_questions": Array of 5 multiple choice questions, each with:
   - "question": The question
   - "options": Array of 4 options
   - "correct_answer": Index of correct option (0-3)
   - "explanation": Why this is correct
6. "key_takeaways": Array of 3-5 main points to remember

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are an expert medical training content creator. Create clear, professional training materials."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=3000, temperature=0.6)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def analyze_doctor_performance(
    total_bookings: int,
    completed_bookings: int,
    average_rating: float,
    total_reviews: int,
    cancellation_rate: float,
    response_time_minutes: float
) -> Optional[Dict]:
    """
    AI analysis of doctor performance for monitoring phase.
    """
    prompt = f"""You are a quality assurance analyst for NovaCare 24/7 Physiotherapy Clinics.

Analyze this doctor's performance metrics:
- Total Bookings: {total_bookings}
- Completed Bookings: {completed_bookings}
- Average Rating: {average_rating}/5.0
- Total Reviews: {total_reviews}
- Cancellation Rate: {cancellation_rate}%
- Average Response Time: {response_time_minutes} minutes

Provide a JSON analysis with:
1. "overall_score": 0-100 performance score
2. "rating": "excellent", "good", "average", "needs_improvement", or "concerning"
3. "strengths": Array of 2-3 strong areas
4. "areas_for_improvement": Array of specific improvement suggestions
5. "flags": Array of any concerning patterns (empty if none)
6. "recommendations": Array of actionable recommendations
7. "summary": 2-3 sentence summary for admin review

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are a fair and constructive performance analyst. Provide balanced, actionable feedback."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=800, temperature=0.5)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None


def generate_onboarding_email(
    recipient_name: str,
    email_type: str,
    context: Dict = None
) -> Optional[Dict]:
    """
    Generate professional onboarding emails.
    email_type: "application_received", "verification_approved", "verification_rejected", 
                "interview_scheduled", "interview_passed", "interview_failed",
                "training_started", "training_completed", "activated", "suspended"
    """
    context = context or {}
    
    prompt = f"""You are a professional email writer for NovaCare 24/7 Physiotherapy Clinics.

Write a {email_type.replace('_', ' ')} email for a doctor onboarding process.

Recipient: {recipient_name}
Additional Context: {json.dumps(context)}

Provide a JSON response with:
1. "subject": Email subject line
2. "body_html": Professional HTML email body with:
   - Warm greeting
   - Clear message about the status
   - Next steps if applicable
   - Contact information for questions
   - Professional sign-off
3. "body_text": Plain text version

Keep the tone professional, warm, and encouraging.

Respond ONLY with valid JSON."""

    messages = [
        {"role": "system", "content": "You are a professional healthcare communications specialist. Write clear, empathetic emails."},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_chat_response(messages, max_tokens=1000, temperature=0.6)
    if response:
        try:
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            return json.loads(response.strip())
        except json.JSONDecodeError:
            return None
    return None

