import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Bell, Mail, FileText } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you book an appointment or create an account, we collect your name, email address, phone number, date of birth, gender, and address. This information is essential for providing our physiotherapy services and maintaining your health records.'
        },
        {
          subtitle: 'Health Information',
          text: 'To provide effective treatment, we collect medical history, current health conditions, symptoms, treatment preferences, and progress notes. This sensitive information is handled with the highest level of confidentiality.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our website, including IP address, browser type, pages visited, time spent on pages, and referring URLs. This helps us improve our services.'
        }
      ]
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to schedule appointments, provide physiotherapy treatments, maintain treatment records, and communicate about your care and follow-up sessions.'
        },
        {
          subtitle: 'Communication',
          text: 'We may send appointment reminders, treatment updates, health tips, and promotional offers. You can opt out of marketing communications at any time.'
        },
        {
          subtitle: 'Improvement',
          text: 'We analyze usage patterns to improve our website, services, and patient experience. This data is aggregated and anonymized where possible.'
        }
      ]
    },
    {
      icon: Lock,
      title: '3. Data Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols. Your personal and health information is stored in encrypted databases.'
        },
        {
          subtitle: 'Access Controls',
          text: 'Only authorized healthcare professionals and staff members can access your health records. All access is logged and monitored for security purposes.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security audits and vulnerability assessments to ensure our systems meet the highest security standards.'
        }
      ]
    },
    {
      icon: UserCheck,
      title: '4. Your Rights',
      content: [
        {
          subtitle: 'Access & Correction',
          text: 'You have the right to access your personal data and request corrections if any information is inaccurate or incomplete.'
        },
        {
          subtitle: 'Deletion',
          text: 'You may request deletion of your personal data, subject to legal and regulatory requirements for maintaining health records.'
        },
        {
          subtitle: 'Data Portability',
          text: 'Upon request, we can provide your health records in a portable format for transfer to another healthcare provider.'
        },
        {
          subtitle: 'Withdraw Consent',
          text: 'You can withdraw consent for marketing communications at any time without affecting the lawfulness of prior processing.'
        }
      ]
    },
    {
      icon: Bell,
      title: '5. Cookies & Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies for website functionality, user authentication, and session management. These cannot be disabled.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics tools to understand how visitors use our website. You can opt out of analytics cookies through your browser settings.'
        },
        {
          subtitle: 'Marketing Cookies',
          text: 'With your consent, we may use marketing cookies to show relevant advertisements. You can manage your cookie preferences at any time.'
        }
      ]
    },
    {
      icon: FileText,
      title: '6. Third-Party Sharing',
      content: [
        {
          subtitle: 'Healthcare Partners',
          text: 'We may share your information with other healthcare providers involved in your care, with your consent or as required for treatment continuity.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We work with trusted service providers for payment processing, SMS notifications, and cloud hosting. These providers are contractually bound to protect your data.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, court order, or to protect the rights, property, or safety of NovaCare, our patients, or others.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Privacy Policy | NovaCare 24/7 Physiotherapy"
        description="Learn how NovaCare 24/7 Physiotherapy protects your personal and health information. Our privacy policy explains data collection, usage, security measures, and your rights."
        keywords="NovaCare privacy policy, physiotherapy data protection, health data privacy, patient privacy rights, medical data security"
        canonical="https://novacare247.com/privacy-policy"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Your Privacy Matters
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              At NovaCare 24/7 Physiotherapy, we are committed to protecting your personal and health information. This policy explains how we collect, use, and safeguard your data.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              NovaCare 24/7 Physiotherapy Clinics ("NovaCare", "we", "us", or "our") operates the website novacare247.com and provides physiotherapy services across India. We understand that your health information is sensitive and personal. This Privacy Policy describes how we collect, use, disclose, and protect your information when you use our website and services.
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

          {/* Children's Privacy */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are available to patients of all ages, including minors. For patients under 18 years of age, we require parental or guardian consent for data collection and treatment. Parents and guardians have the right to access, correct, or delete their child's information.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal and health information for as long as necessary to provide our services and comply with legal obligations. Medical records are retained in accordance with applicable healthcare regulations in India, typically for a minimum of 3 years after the last treatment. You may request deletion of non-essential data at any time.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="text-primary-100 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, wish to exercise your rights, or have concerns about how we handle your data, please contact us:
                </p>
                <div className="space-y-2 text-primary-50">
                  <p><strong>Email:</strong> privacy@novacare247.com</p>
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
              to="/terms-of-service" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Terms of Service
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
