import { Link } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale, CreditCard, Clock, Shield, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: '1. Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement',
          text: 'By accessing or using the NovaCare 24/7 website (novacare247.com) or our physiotherapy services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to use our services independently. Minors may use our services with parental or guardian consent and supervision.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the modified terms.'
        }
      ]
    },
    {
      icon: FileText,
      title: '2. Services Description',
      content: [
        {
          subtitle: 'Physiotherapy Services',
          text: 'NovaCare provides professional physiotherapy services including assessment, diagnosis, treatment planning, therapeutic exercises, manual therapy, electrotherapy, and rehabilitation programs. All services are provided by qualified and licensed physiotherapists.'
        },
        {
          subtitle: 'Online Booking',
          text: 'Our website allows you to book appointments, view available time slots, access your treatment history, and communicate with our team. The availability of specific services may vary by location.'
        },
        {
          subtitle: 'Health Information',
          text: 'Information provided on our website is for general educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for personalized medical advice.'
        }
      ]
    },
    {
      icon: Clock,
      title: '3. Appointments & Cancellations',
      content: [
        {
          subtitle: 'Booking',
          text: 'Appointments can be booked online through our website or by calling our clinic. A confirmation will be sent via email and/or SMS. Please ensure your contact information is accurate.'
        },
        {
          subtitle: 'Cancellation Policy',
          text: 'We request at least 24 hours notice for appointment cancellations or rescheduling. Repeated no-shows or late cancellations may result in a cancellation fee or restrictions on future bookings.'
        },
        {
          subtitle: 'Late Arrivals',
          text: 'If you arrive late for your appointment, your session may be shortened to avoid delays for other patients. If you are more than 15 minutes late, we may need to reschedule your appointment.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: '4. Payments & Fees',
      content: [
        {
          subtitle: 'Service Fees',
          text: 'Fees for our services are displayed on our website and at our clinics. We reserve the right to modify fees with reasonable notice. The applicable fee will be the rate in effect at the time of your appointment.'
        },
        {
          subtitle: 'Payment Methods',
          text: 'We accept cash, credit/debit cards, UPI, net banking, and major digital wallets. Payment is due at the time of service unless other arrangements have been made.'
        },
        {
          subtitle: 'Insurance',
          text: 'We work with various insurance providers. Please verify coverage with your insurance company before your appointment. We can provide invoices and documentation for insurance claims.'
        },
        {
          subtitle: 'Refunds',
          text: 'Refunds for prepaid services are available upon request, subject to our refund policy. Cancellation fees may apply as per our cancellation policy.'
        }
      ]
    },
    {
      icon: Shield,
      title: '5. Patient Responsibilities',
      content: [
        {
          subtitle: 'Accurate Information',
          text: 'You agree to provide accurate and complete information about your health history, current conditions, medications, and any other relevant information for safe and effective treatment.'
        },
        {
          subtitle: 'Treatment Compliance',
          text: 'For optimal results, you should follow the treatment plan, complete prescribed exercises, attend follow-up appointments, and communicate any concerns or changes in your condition.'
        },
        {
          subtitle: 'Respectful Conduct',
          text: 'We expect all patients to treat our staff and other patients with respect. We reserve the right to refuse service to anyone who engages in abusive, threatening, or inappropriate behavior.'
        }
      ]
    },
    {
      icon: AlertCircle,
      title: '6. Limitation of Liability',
      content: [
        {
          subtitle: 'Treatment Outcomes',
          text: 'While we strive to provide the best possible care, we cannot guarantee specific treatment outcomes. Results vary based on individual conditions, compliance, and other factors beyond our control.'
        },
        {
          subtitle: 'Website Availability',
          text: 'We do not guarantee uninterrupted or error-free operation of our website. We are not liable for any damages arising from website unavailability, errors, or security breaches.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'To the maximum extent permitted by law, our total liability for any claim arising from our services shall not exceed the amount you paid for the specific service giving rise to the claim.'
        }
      ]
    },
    {
      icon: XCircle,
      title: '7. Prohibited Activities',
      content: [
        {
          subtitle: 'Website Misuse',
          text: 'You may not use our website for any unlawful purpose, to transmit malware, to interfere with website operations, to impersonate others, or to collect information about other users without consent.'
        },
        {
          subtitle: 'Intellectual Property',
          text: 'All content on our website, including text, images, logos, and software, is protected by copyright and trademark laws. You may not copy, reproduce, or distribute our content without written permission.'
        },
        {
          subtitle: 'Account Security',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access to your account.'
        }
      ]
    },
    {
      icon: Scale,
      title: '8. Governing Law & Disputes',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These Terms of Service are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.'
        },
        {
          subtitle: 'Dispute Resolution',
          text: 'We encourage patients to first contact us directly to resolve any concerns. If a dispute cannot be resolved informally, it may be referred to mediation before pursuing legal action.'
        },
        {
          subtitle: 'Severability',
          text: 'If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Terms of Service | NovaCare 24/7 Physiotherapy"
        description="Read the Terms of Service for NovaCare 24/7 Physiotherapy. Understand your rights and responsibilities when using our physiotherapy services and website."
        keywords="NovaCare terms of service, physiotherapy terms and conditions, patient agreement, service terms, healthcare terms"
        canonical="https://novacare247.com/terms-of-service"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Legal Agreement
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Please read these terms carefully before using our physiotherapy services or website. By using NovaCare 24/7, you agree to these terms.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: December 28, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to NovaCare 24/7</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the NovaCare 24/7 Physiotherapy Clinics website (novacare247.com) and physiotherapy services provided by NovaCare ("we", "us", or "our"). By booking an appointment, creating an account, or using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms.
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

          {/* Medical Disclaimer */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Medical Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The information provided on our website and during consultations is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on our website.
                </p>
              </div>
            </div>
          </div>

          {/* Indemnification */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless NovaCare, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of our services, your violation of these Terms, or your violation of any rights of another.
            </p>
          </div>

          {/* Termination */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your access to our services at any time, without notice, for conduct that we believe violates these Terms, is harmful to other patients or staff, or is otherwise inappropriate. Upon termination, your right to use our website and services will immediately cease.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                <p className="text-primary-100 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service or need assistance, please contact us:
                </p>
                <div className="space-y-2 text-primary-50">
                  <p><strong>Email:</strong> legal@novacare247.com</p>
                  <p><strong>Phone:</strong> 1800-XXX-XXXX (Toll Free)</p>
                  <p><strong>Address:</strong> NovaCare 24/7 Physiotherapy Clinics, India</p>
                </div>
                <div className="mt-6">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
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
              <CheckCircle className="w-5 h-5" />
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
