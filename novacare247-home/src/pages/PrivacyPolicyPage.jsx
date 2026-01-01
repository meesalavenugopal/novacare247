import { Shield, Lock, Eye, FileText, Users, Bell, Phone, Mail, ArrowLeft, Database, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly, including your name, email address, phone number, and medical information when you book appointments or register for our services.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, and pages visited.'
        }
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to provide healthcare services, process appointments, and communicate with you about your care.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We analyze usage patterns to improve our services, develop new features, and enhance user experience.'
        }
      ]
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Healthcare Providers',
          text: 'We may share your medical information with healthcare providers involved in your care, with your consent.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law or to protect the rights, safety, and property of NovaCare247 and others.'
        }
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Protection Measures',
          text: 'We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your information for as long as necessary to provide services and comply with legal obligations.'
        }
      ]
    },
    {
      icon: Users,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings.'
        },
        {
          subtitle: 'Deletion',
          text: 'You may request deletion of your personal information, subject to legal and operational requirements.'
        }
      ]
    },
    {
      icon: Bell,
      title: 'Updates to This Policy',
      content: [
        {
          subtitle: 'Policy Changes',
          text: 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our services.'
        },
        {
          subtitle: 'Effective Date',
          text: 'This Privacy Policy is effective as of January 1, 2026, and was last updated on January 1, 2026.'
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
              <Shield size={18} />
              Privacy Policy
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At NovaCare247, we are committed to protecting your privacy and ensuring the security of your personal and health information.
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
              <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
              <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:privacy@novacare247.com" 
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  <Mail size={20} />
                  privacy@novacare247.com
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
              to="/terms-of-service" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium border border-primary-200 px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <FileText size={20} />
              Terms of Service
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

export default PrivacyPolicyPage;
