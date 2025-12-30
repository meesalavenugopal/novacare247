import { Link } from 'react-router-dom';
import { AlertTriangle, Info, Stethoscope, Globe, Scale, FileWarning, Mail, FileText, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const DisclaimerPage = () => {
  const sections = [
    {
      icon: Stethoscope,
      title: '1. Medical Disclaimer',
      content: [
        {
          subtitle: 'Not a Substitute for Professional Advice',
          text: 'The information provided on this website is for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.'
        },
        {
          subtitle: 'No Doctor-Patient Relationship',
          text: 'Browsing this website or using our online resources does not create a doctor-patient relationship. A formal doctor-patient relationship is only established after you have booked an appointment and been seen by one of our qualified physiotherapists.'
        },
        {
          subtitle: 'Emergency Situations',
          text: 'If you are experiencing a medical emergency, call your local emergency services immediately. Do not rely on this website for emergency medical needs. Our services are for non-emergency physiotherapy care only.'
        }
      ]
    },
    {
      icon: Info,
      title: '2. Information Accuracy',
      content: [
        {
          subtitle: 'Content Accuracy',
          text: 'While we strive to provide accurate and up-to-date information, NovaCare 24/7 makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, services, or related graphics contained on this website.'
        },
        {
          subtitle: 'Third-Party Information',
          text: 'This website may contain references to third-party research, studies, or medical information. We do not guarantee the accuracy of third-party content and recommend verifying such information with qualified healthcare professionals.'
        },
        {
          subtitle: 'Changes Without Notice',
          text: 'We reserve the right to modify, update, or remove any content on this website without prior notice. Treatment protocols, pricing, and service availability may change at any time.'
        }
      ]
    },
    {
      icon: FileWarning,
      title: '3. Treatment Outcomes',
      content: [
        {
          subtitle: 'No Guaranteed Results',
          text: 'Individual results from physiotherapy treatment may vary. We do not guarantee specific outcomes or recovery times. The effectiveness of treatment depends on various factors including the nature of the condition, patient compliance, overall health, and other individual circumstances.'
        },
        {
          subtitle: 'Patient Testimonials',
          text: 'Testimonials and success stories displayed on this website represent individual experiences. These results are not typical and should not be interpreted as a guarantee of similar outcomes for all patients.'
        },
        {
          subtitle: 'Professional Assessment Required',
          text: 'Accurate diagnosis and appropriate treatment plans can only be determined through proper clinical assessment by our qualified physiotherapists. Information on this website should not be used for self-diagnosis.'
        }
      ]
    },
    {
      icon: Globe,
      title: '4. Website Usage',
      content: [
        {
          subtitle: 'Use at Your Own Risk',
          text: 'Your use of this website and reliance on any information provided is solely at your own risk. NovaCare 24/7 shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, this website.'
        },
        {
          subtitle: 'External Links',
          text: 'This website may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot be responsible for their privacy policies or content. Linking does not imply endorsement.'
        },
        {
          subtitle: 'Technical Issues',
          text: 'We do not guarantee uninterrupted, timely, or error-free website operation. We are not liable for any temporary unavailability of the website due to technical issues, maintenance, or factors beyond our control.'
        }
      ]
    },
    {
      icon: Scale,
      title: '5. Limitation of Liability',
      content: [
        {
          subtitle: 'Maximum Liability',
          text: 'To the maximum extent permitted by applicable law, NovaCare 24/7 and its directors, employees, partners, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.'
        },
        {
          subtitle: 'Service Limitations',
          text: 'Our liability for any claim related to our services shall not exceed the amount paid by you for the specific service giving rise to the claim. This limitation applies regardless of the legal theory under which the claim is made.'
        },
        {
          subtitle: 'Indemnification',
          text: 'You agree to indemnify and hold harmless NovaCare 24/7 from any claims, damages, or expenses arising from your use of this website or violation of these terms.'
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: '6. Professional Qualifications',
      content: [
        {
          subtitle: 'Qualified Practitioners',
          text: 'All physiotherapists at NovaCare 24/7 are qualified and registered professionals. However, the display of qualifications on this website does not constitute a warranty of specific expertise for every condition.'
        },
        {
          subtitle: 'Scope of Practice',
          text: 'Our physiotherapists practice within their scope of competence as defined by applicable regulations. For conditions outside this scope, we will refer you to appropriate specialists.'
        },
        {
          subtitle: 'Continuous Education',
          text: 'While our team undergoes continuous professional development, the latest medical research and treatment protocols may not be immediately reflected in our practice or website content.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Legal Disclaimer | NovaCare 24/7 Physiotherapy"
        description="Read NovaCare 24/7's legal disclaimer regarding medical information, treatment outcomes, website usage, and limitation of liability for our physiotherapy services."
        keywords="NovaCare disclaimer, physiotherapy legal notice, medical disclaimer, healthcare liability, treatment disclaimer"
        canonical="https://novacare247.com/disclaimer"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Important Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Legal Disclaimer
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Please read this disclaimer carefully before using our website or services. By accessing this website, you acknowledge and agree to the terms outlined below.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: December 30, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-yellow-800 mb-2">Important Notice</h2>
              <p className="text-yellow-700">
                The content on this website is provided for informational purposes only and should not be considered medical advice. 
                Always consult with a qualified healthcare professional before starting any treatment program. If you are experiencing 
                a medical emergency, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              NovaCare 24/7 Physiotherapy Clinics ("NovaCare", "we", "us", or "our") operates the website novacare247.com 
              and provides physiotherapy services across India. This legal disclaimer governs your use of our website and 
              services. By accessing or using our website, you agree to be bound by this disclaimer. If you do not agree 
              with any part of this disclaimer, please do not use our website or services.
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

          {/* Intellectual Property */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, videos, and software, 
              is the property of NovaCare 24/7 or its content suppliers and is protected by Indian and international copyright, 
              trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
              republish, download, store, or transmit any of the material on our website without our prior written consent, 
              except for personal, non-commercial use.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              This disclaimer shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              from this disclaimer or your use of our website shall be subject to the exclusive jurisdiction of the courts 
              located in Hyderabad, Telangana, India.
            </p>
          </div>

          {/* Severability */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of this disclaimer is found to be invalid or unenforceable by a court of competent jurisdiction, 
              the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall 
              be modified to the minimum extent necessary to make it valid and enforceable while preserving its intent.
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
                  If you have any questions about this Legal Disclaimer or need clarification on any points, 
                  please don't hesitate to contact us:
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
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link 
              to="/privacy-policy" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Terms of Service
            </Link>
            <Link 
              to="/refund-policy" 
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Refund Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisclaimerPage;
