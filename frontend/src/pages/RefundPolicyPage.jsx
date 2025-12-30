import { Link } from 'react-router-dom';
import { RefreshCw, Clock, CreditCard, AlertCircle, CheckCircle, XCircle, HelpCircle, Mail, FileText, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const RefundPolicyPage = () => {
  const sections = [
    {
      icon: Clock,
      title: '1. Appointment Cancellation',
      content: [
        {
          subtitle: 'Free Cancellation (24+ Hours)',
          text: 'Appointments cancelled more than 24 hours before the scheduled time are eligible for a full refund. The refund will be processed within 5-7 business days to the original payment method.'
        },
        {
          subtitle: 'Late Cancellation (12-24 Hours)',
          text: 'Cancellations made between 12-24 hours before the appointment will incur a 25% cancellation fee. The remaining 75% will be refunded or credited to your account.'
        },
        {
          subtitle: 'Last-Minute Cancellation (Less than 12 Hours)',
          text: 'Cancellations made less than 12 hours before the appointment will incur a 50% cancellation fee. We understand emergencies happen - please contact us if you have special circumstances.'
        }
      ]
    },
    {
      icon: RefreshCw,
      title: '2. Rescheduling Policy',
      content: [
        {
          subtitle: 'Free Rescheduling',
          text: 'You can reschedule your appointment free of charge if done at least 12 hours before the scheduled time. Rescheduled appointments are subject to availability.'
        },
        {
          subtitle: 'Multiple Reschedules',
          text: 'Patients can reschedule up to 2 times per appointment without any penalty. Additional reschedules may be subject to a nominal fee of ₹100.'
        },
        {
          subtitle: 'No-Show Policy',
          text: 'Failure to attend a scheduled appointment without prior notice ("no-show") will result in forfeiture of the full appointment fee. No refund will be provided for no-shows.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: '3. Refund Process',
      content: [
        {
          subtitle: 'Processing Time',
          text: 'Refunds are typically processed within 5-7 business days after approval. The actual credit to your account may take an additional 3-5 business days depending on your bank or payment provider.'
        },
        {
          subtitle: 'Refund Methods',
          text: 'Refunds are issued to the original payment method. Credit/debit card refunds go back to the same card. UPI payments are refunded to the same UPI ID. Cash payments are refunded via bank transfer.'
        },
        {
          subtitle: 'Partial Refunds',
          text: 'In cases where partial services were rendered or late cancellation fees apply, the refund amount will be adjusted accordingly. You will receive a detailed breakdown of any deductions.'
        }
      ]
    },
    {
      icon: CheckCircle,
      title: '4. Eligible for Full Refund',
      content: [
        {
          subtitle: 'Doctor Unavailability',
          text: 'If your appointment is cancelled due to doctor unavailability or clinic closure, you are entitled to a full refund or free rescheduling to another time slot.'
        },
        {
          subtitle: 'Technical Issues',
          text: 'For online consultations, if technical difficulties on our end prevent the session from occurring, you will receive a full refund or free rescheduling.'
        },
        {
          subtitle: 'Duplicate Bookings',
          text: 'If you accidentally made duplicate bookings, the duplicate payment will be fully refunded upon verification.'
        }
      ]
    },
    {
      icon: XCircle,
      title: '5. Non-Refundable Services',
      content: [
        {
          subtitle: 'Completed Appointments',
          text: 'Services that have been fully rendered are non-refundable. This includes completed physiotherapy sessions, consultations, and treatments.'
        },
        {
          subtitle: 'Treatment Packages',
          text: 'Multi-session treatment packages are non-refundable once any session has been utilized. Unused sessions may be transferred to a family member with prior approval.'
        },
        {
          subtitle: 'Special Promotions',
          text: 'Services purchased at promotional or discounted rates may have different or no refund eligibility. Please check the terms at the time of purchase.'
        }
      ]
    },
    {
      icon: AlertCircle,
      title: '6. Special Circumstances',
      content: [
        {
          subtitle: 'Medical Emergencies',
          text: 'We understand that genuine medical emergencies occur. With proper documentation (hospital records, doctor\'s note), late cancellation fees may be waived at our discretion.'
        },
        {
          subtitle: 'Natural Disasters',
          text: 'In case of natural disasters, government-mandated lockdowns, or other force majeure events, full refunds will be provided for affected appointments.'
        },
        {
          subtitle: 'Dissatisfaction',
          text: 'If you are unsatisfied with your treatment, please contact us within 48 hours. We will review your case and may offer a follow-up session, credit, or partial refund based on the circumstances.'
        }
      ]
    }
  ];

  const cancellationTiers = [
    { time: '24+ Hours Before', refund: '100%', fee: 'None', color: 'green' },
    { time: '12-24 Hours Before', refund: '75%', fee: '25%', color: 'yellow' },
    { time: 'Less than 12 Hours', refund: '50%', fee: '50%', color: 'orange' },
    { time: 'No-Show', refund: '0%', fee: '100%', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Refund & Cancellation Policy | NovaCare 24/7 Physiotherapy"
        description="Understand NovaCare 24/7's refund and cancellation policy for physiotherapy appointments. Learn about our fair cancellation fees, refund process, and rescheduling options."
        keywords="NovaCare refund policy, physiotherapy cancellation, appointment refund, booking cancellation policy, reschedule appointment"
        canonical="https://novacare247.com/refund-policy"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <RefreshCw className="w-4 h-4" />
              Fair & Transparent
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              We understand plans change. Our policy is designed to be fair to both patients and healthcare providers while ensuring quality care remains accessible.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: December 30, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Quick Reference Guide</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-100 py-4 px-6 font-semibold text-gray-700 text-sm">
              <div>Cancellation Time</div>
              <div className="text-center">Refund Amount</div>
              <div className="text-center">Cancellation Fee</div>
              <div className="text-center">Status</div>
            </div>
            {cancellationTiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-4 py-4 px-6 border-t border-gray-100 items-center">
                <div className="font-medium text-gray-900">{tier.time}</div>
                <div className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    tier.color === 'green' ? 'bg-green-100 text-green-700' :
                    tier.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    tier.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tier.refund}
                  </span>
                </div>
                <div className="text-center text-gray-600">{tier.fee}</div>
                <div className="text-center">
                  {tier.color === 'green' ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> :
                   tier.color === 'red' ? <XCircle className="w-5 h-5 text-red-500 mx-auto" /> :
                   <AlertCircle className="w-5 h-5 text-yellow-500 mx-auto" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Fairness</h2>
            <p className="text-gray-700 leading-relaxed">
              At NovaCare 24/7 Physiotherapy Clinics, we strive to provide flexible booking options while maintaining the highest standards of care. We understand that life is unpredictable, and sometimes you may need to cancel or reschedule appointments. This policy outlines our approach to refunds and cancellations, ensuring transparency and fairness for all patients.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-100 pb-12 last:border-0">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 pt-2">{section.title}</h2>
                </div>
                <div className="space-y-6 ml-16">
                  {section.content.map((item, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* How to Cancel */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. How to Cancel or Request Refund</h2>
                <div className="space-y-4 text-gray-600">
                  <p><strong>Online:</strong> Log in to your account, go to "My Bookings", and click "Cancel Appointment" next to the relevant booking.</p>
                  <p><strong>Phone:</strong> Call our support line at 1800-XXX-XXXX (Toll Free) during business hours.</p>
                  <p><strong>Email:</strong> Send a cancellation request to bookings@novacare247.com with your booking ID and registered phone number.</p>
                  <p><strong>Track Refund:</strong> You can track your refund status in "My Bookings" → "Refund History" or by contacting our support team.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              NovaCare reserves the right to modify this refund and cancellation policy at any time. Changes will be effective immediately upon posting on our website. We encourage you to review this policy periodically. Bookings made prior to policy changes will be governed by the policy in effect at the time of booking.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Questions About Refunds?</h2>
                <p className="text-primary-100 leading-relaxed mb-4">
                  If you have questions about our refund policy or need assistance with a cancellation, our support team is here to help.
                </p>
                <div className="space-y-2 text-primary-50">
                  <p><strong>Email:</strong> bookings@novacare247.com</p>
                  <p><strong>Phone:</strong> 1800-XXX-XXXX (Toll Free)</p>
                  <p><strong>Hours:</strong> Monday - Saturday, 9 AM - 8 PM</p>
                </div>
                <div className="mt-6">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/terms-of-service" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Terms of Service
            </Link>
            <Link 
              to="/privacy-policy" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Privacy Policy
            </Link>
            <Link 
              to="/book" 
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicyPage;
