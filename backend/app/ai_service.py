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
