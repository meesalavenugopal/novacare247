import { FileText, Scale, AlertTriangle, Shield, Clock, Ban, RefreshCw, Gavel, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement',
          text: 'By accessing or using NovaCare247 services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to use our services independently. Minors may use our services with parental or guardian consent and supervision.'
        }
      ]
    },
    {
      icon: Scale,
      title: 'Use of Services',
      content: [
        {
          subtitle: 'Permitted Use',
          text: 'Our services are intended for personal, non-commercial use to access healthcare information and book appointments with our healthcare providers.'
        },
        {
          subtitle: 'Account Responsibility',
          text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Healthcare Disclaimer',
      content: [
        {
          subtitle: 'Not Emergency Services',
          text: 'Our services are not intended for medical emergencies. If you are experiencing a medical emergency, please call emergency services immediately.'
        },
        {
          subtitle: 'Professional Advice',
          text: 'Information provided through our platform does not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.'
        }
      ]
    },
    {
      icon: Clock,
      title: 'Appointments & Cancellations',
      content: [
        {
          subtitle: 'Booking Policy',
          text: 'Appointments are subject to availability. We reserve the right to reschedule or cancel appointments due to unforeseen circumstances.'
        },
        {
          subtitle: 'Cancellation Policy',
          text: 'Cancellations must be made at least 4 hours before the scheduled appointment. Late cancellations may be subject to fees.'
        }
      ]
    },
    {
      icon: Ban,
      title: 'Prohibited Activities',
      content: [
        {
          subtitle: 'Restrictions',
          text: 'You may not use our services for any unlawful purpose, to harass or harm others, or to interfere with the proper functioning of our platform.'
        },
        {
          subtitle: 'Content',
          text: 'You may not upload or transmit any content that is harmful, offensive, or infringes on the rights of others.'
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain continuous service availability but do not guarantee uninterrupted access. We are not liable for any damages resulting from service interruptions.'
        },
        {
          subtitle: 'Medical Outcomes',
          text: 'While we facilitate access to healthcare services, we are not responsible for medical outcomes or the actions of individual healthcare providers.'
        }
      ]
    },
    {
      icon: RefreshCw,
      title: 'Modifications',
      content: [
        {
          subtitle: 'Terms Updates',
          text: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to our website.'
        },
        {
          subtitle: 'Notification',
          text: 'We will notify users of significant changes via email or prominent notice on our platform. Continued use constitutes acceptance of modified terms.'
        }
      ]
    },
    {
      icon: Gavel,
      title: 'Governing Law',
      content: [
        {
          subtitle: 'Jurisdiction',
          text: 'These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be resolved in the courts of Hyderabad.'
        },
        {
          subtitle: 'Severability',
          text: 'If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.'
        }
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText size={18} />
              Terms of Service
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using NovaCare247 services. These terms govern your use of our platform and services.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="text-primary-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 pt-2">{section.title}</h2>
                </div>
                <div className="space-y-6 ml-16">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-primary-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                If you have any questions about these Terms of Service, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:legal@novacare247.com" 
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  <Mail size={20} />
                  legal@novacare247.com
                </a>
                <a 
                  href="tel:+914012345678" 
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-400 transition-colors"
                >
                  <Phone size={20} />
                  +91 40 1234 5678
                </a>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/privacy-policy" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium border border-primary-200 px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Shield size={20} />
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <Phone size={20} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfServicePage;
