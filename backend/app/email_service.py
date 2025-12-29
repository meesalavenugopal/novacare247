"""
Email Service for NovaCare 24/7
Handles all email notifications using SMTP
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Optional
import logging
from jinja2 import Environment, FileSystemLoader
from app.config import settings

logger = logging.getLogger(__name__)

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "templates" / "email"

# Initialize Jinja2 environment
template_env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    autoescape=True
)


class EmailService:
    """Email service for sending transactional emails"""
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAIL_FROM
        self.from_name = settings.EMAIL_FROM_NAME or "NovaCare 24/7"
    
    def _get_smtp_connection(self):
        """Create SMTP connection"""
        server = smtplib.SMTP(self.smtp_host, self.smtp_port)
        server.starttls()
        server.login(self.smtp_user, self.smtp_password)
        return server
    
    def _render_template(self, template_name: str, context: dict) -> str:
        """Render HTML template with context"""
        template = template_env.get_template(template_name)
        return template.render(**context)
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_text: Optional[str] = None
    ) -> bool:
        """Send an email"""
        if not self.smtp_user or not self.smtp_password:
            logger.warning("Email not configured. Skipping email send.")
            return False
        
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email
            
            # Add plain text version
            if plain_text:
                msg.attach(MIMEText(plain_text, "plain"))
            
            # Add HTML version
            msg.attach(MIMEText(html_content, "html"))
            
            # Send email
            with self._get_smtp_connection() as server:
                server.sendmail(self.from_email, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    # ==================== Booking Emails ====================
    
    def send_booking_confirmation(
        self,
        to_email: str,
        patient_name: str,
        doctor_name: str,
        doctor_specialization: str,
        booking_date: str,
        booking_time: str,
        consultation_type: str,
        booking_id: int
    ) -> bool:
        """Send booking confirmation email"""
        context = {
            "patient_name": patient_name,
            "doctor_name": doctor_name,
            "doctor_specialization": doctor_specialization,
            "booking_date": booking_date,
            "booking_time": booking_time,
            "consultation_type": consultation_type,
            "booking_id": booking_id,
            "support_phone": "+91 98765 43210",
            "support_email": "support@novacare247.com"
        }
        
        html_content = self._render_template("booking_confirmation.html", context)
        subject = f"Booking Confirmed - Appointment with Dr. {doctor_name}"
        
        return self.send_email(to_email, subject, html_content)
    
    def send_booking_reminder(
        self,
        to_email: str,
        patient_name: str,
        doctor_name: str,
        booking_date: str,
        booking_time: str,
        consultation_type: str,
        booking_id: int
    ) -> bool:
        """Send booking reminder email (24 hours before)"""
        context = {
            "patient_name": patient_name,
            "doctor_name": doctor_name,
            "booking_date": booking_date,
            "booking_time": booking_time,
            "consultation_type": consultation_type,
            "booking_id": booking_id,
            "support_phone": "+91 98765 43210"
        }
        
        html_content = self._render_template("booking_reminder.html", context)
        subject = f"Reminder: Appointment Tomorrow with Dr. {doctor_name}"
        
        return self.send_email(to_email, subject, html_content)
    
    def send_booking_cancellation(
        self,
        to_email: str,
        patient_name: str,
        doctor_name: str,
        booking_date: str,
        booking_time: str,
        cancellation_reason: Optional[str] = None
    ) -> bool:
        """Send booking cancellation email"""
        context = {
            "patient_name": patient_name,
            "doctor_name": doctor_name,
            "booking_date": booking_date,
            "booking_time": booking_time,
            "cancellation_reason": cancellation_reason,
            "support_phone": "+91 98765 43210"
        }
        
        html_content = self._render_template("booking_cancellation.html", context)
        subject = "Appointment Cancelled - NovaCare 24/7"
        
        return self.send_email(to_email, subject, html_content)
    
    def send_booking_completed(
        self,
        to_email: str,
        patient_name: str,
        doctor_name: str,
        booking_date: str,
        booking_id: int
    ) -> bool:
        """Send email after session completion asking for feedback"""
        context = {
            "patient_name": patient_name,
            "doctor_name": doctor_name,
            "booking_date": booking_date,
            "booking_id": booking_id,
            "feedback_url": f"https://novacare247.com/feedback/{booking_id}"
        }
        
        html_content = self._render_template("booking_completed.html", context)
        subject = "How was your session? - NovaCare 24/7"
        
        return self.send_email(to_email, subject, html_content)
    
    # ==================== User Emails ====================
    
    def send_welcome_email(
        self,
        to_email: str,
        user_name: str
    ) -> bool:
        """Send welcome email to new users"""
        context = {
            "user_name": user_name,
            "login_url": "https://novacare247.com/login"
        }
        
        html_content = self._render_template("welcome.html", context)
        subject = "Welcome to NovaCare 24/7 - Your Health Partner"
        
        return self.send_email(to_email, subject, html_content)
    
    def send_password_reset(
        self,
        to_email: str,
        user_name: str,
        reset_token: str
    ) -> bool:
        """Send password reset email"""
        context = {
            "user_name": user_name,
            "reset_url": f"https://novacare247.com/reset-password?token={reset_token}",
            "expiry_hours": 24
        }
        
        html_content = self._render_template("password_reset.html", context)
        subject = "Reset Your Password - NovaCare 24/7"
        
        return self.send_email(to_email, subject, html_content)
    
    # ==================== Contact Emails ====================
    
    def send_contact_confirmation(
        self,
        to_email: str,
        name: str,
        message: str
    ) -> bool:
        """Send confirmation when someone submits contact form"""
        context = {
            "name": name,
            "message": message,
            "support_phone": "+91 98765 43210"
        }
        
        html_content = self._render_template("contact_confirmation.html", context)
        subject = "We received your message - NovaCare 24/7"
        
        return self.send_email(to_email, subject, html_content)
    
    def send_contact_notification(
        self,
        admin_email: str,
        name: str,
        email: str,
        phone: str,
        subject_text: str,
        message: str
    ) -> bool:
        """Notify admin about new contact inquiry"""
        context = {
            "name": name,
            "email": email,
            "phone": phone,
            "subject": subject_text,
            "message": message
        }
        
        html_content = self._render_template("contact_notification.html", context)
        subject = f"New Contact Inquiry from {name}"
        
        return self.send_email(admin_email, subject, html_content)


# Singleton instance
email_service = EmailService()
