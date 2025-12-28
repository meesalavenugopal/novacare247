"""
AI-powered endpoints for enhanced user experience
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.database import get_db
from app.models import User
from app.auth import get_admin_user
from app import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI"])


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
