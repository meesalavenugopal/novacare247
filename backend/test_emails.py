"""
Test script to send all email templates
Run: python test_emails.py
"""

import sys
sys.path.insert(0, '.')

from app.email_service import email_service

# Test email recipient
TEST_EMAIL = "meesalavenugopal@gmail.com"

def test_all_emails():
    print("\n" + "="*60)
    print("Testing All NovaCare 24/7 Email Templates")
    print("="*60 + "\n")
    
    results = []
    
    # 1. Booking Confirmation
    print("1. Sending Booking Confirmation...")
    result = email_service.send_booking_confirmation(
        to_email=TEST_EMAIL,
        patient_name="Venugopal Meesala",
        doctor_name="Priya Sharma",
        doctor_specialization="Sports Physiotherapy",
        booking_date="January 5, 2025",
        booking_time="10:00 AM",
        consultation_type="In-Clinic Visit",
        booking_id=1001
    )
    results.append(("Booking Confirmation", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 2. Booking Reminder
    print("2. Sending Booking Reminder...")
    result = email_service.send_booking_reminder(
        to_email=TEST_EMAIL,
        patient_name="Venugopal Meesala",
        doctor_name="Priya Sharma",
        booking_date="January 5, 2025",
        booking_time="10:00 AM",
        consultation_type="Video Consultation",
        booking_id=1001
    )
    results.append(("Booking Reminder", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 3. Booking Cancellation
    print("3. Sending Booking Cancellation...")
    result = email_service.send_booking_cancellation(
        to_email=TEST_EMAIL,
        patient_name="Venugopal Meesala",
        doctor_name="Priya Sharma",
        booking_date="January 5, 2025",
        booking_time="10:00 AM",
        cancellation_reason="Schedule conflict"
    )
    results.append(("Booking Cancellation", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 4. Booking Completed (Feedback Request)
    print("4. Sending Booking Completed (Feedback)...")
    result = email_service.send_booking_completed(
        to_email=TEST_EMAIL,
        patient_name="Venugopal Meesala",
        doctor_name="Priya Sharma",
        booking_date="January 4, 2025",
        booking_id=1000
    )
    results.append(("Booking Completed", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 5. Welcome Email
    print("5. Sending Welcome Email...")
    result = email_service.send_welcome_email(
        to_email=TEST_EMAIL,
        user_name="Venugopal Meesala"
    )
    results.append(("Welcome Email", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 6. Password Reset
    print("6. Sending Password Reset...")
    result = email_service.send_password_reset(
        to_email=TEST_EMAIL,
        user_name="Venugopal Meesala",
        reset_token="abc123xyz789token"
    )
    results.append(("Password Reset", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 7. Contact Confirmation
    print("7. Sending Contact Confirmation...")
    result = email_service.send_contact_confirmation(
        to_email=TEST_EMAIL,
        name="Test User",
        message="I would like to inquire about your physiotherapy services for lower back pain treatment. What are your available slots?"
    )
    results.append(("Contact Confirmation", result))
    print(f"   ✓ Sent: {result}\n")
    
    # 8. Contact Notification (Admin)
    print("8. Sending Contact Notification (Admin)...")
    result = email_service.send_contact_notification(
        admin_email=TEST_EMAIL,
        name="Test User",
        email="testuser@example.com",
        phone="+91 98765 12345",
        subject_text="Inquiry about services",
        message="I would like to inquire about your physiotherapy services for lower back pain treatment. What are your available slots?"
    )
    results.append(("Contact Notification", result))
    print(f"   ✓ Sent: {result}\n")
    
    # Summary
    print("="*60)
    print("SUMMARY")
    print("="*60)
    
    success_count = sum(1 for _, r in results if r)
    fail_count = len(results) - success_count
    
    for name, success in results:
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"  {status}: {name}")
    
    print(f"\n  Total: {success_count}/{len(results)} emails sent successfully")
    print("="*60 + "\n")
    
    if fail_count > 0:
        print("⚠️  Some emails failed. Check SMTP configuration.")
        return False
    else:
        print("✅ All email templates tested successfully!")
        print(f"📧 Check inbox: {TEST_EMAIL}")
        return True

if __name__ == "__main__":
    test_all_emails()
