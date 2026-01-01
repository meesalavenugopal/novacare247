import { AlertTriangle, Info, Heart, Phone, Mail, ArrowLeft, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const DisclaimerPage = () => {
  const sections = [
    {
      icon: Info,
      title: 'General Information',
      content: 'The information provided on this website is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information contained on the website.'
    },
    {
      icon: Heart,
      title: 'Medical Disclaimer',
      content: 'The content on this website is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.'
    },
    {
      icon: Shield,
      title: 'No Doctor-Patient Relationship',
      content: 'The use of this website and the content provided does not create a doctor-patient relationship between you and NovaCare247 or any of our healthcare providers. A doctor-patient relationship is only established when you receive in-person consultation or treatment at our facilities.'
    },
    {
      icon: FileText,
      title: 'Treatment Results',
      content: 'Individual results may vary. The success stories and testimonials presented on this website represent the experiences of specific individuals and may not be typical. Your results may differ based on various factors including your medical condition, age, lifestyle, and adherence to treatment plans.'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Situations',
      content: 'This website is not intended for emergency use. If you are experiencing a medical emergency, please call emergency services immediately or visit the nearest emergency room. Do not rely on information from this website in emergency situations.'
    },
    {
      icon: Info,
      title: 'Third-Party Links',
      content: 'Our website may contain links to third-party websites. We have no control over the content, privacy policies, or practices of third-party websites and assume no responsibility for them. We encourage you to review the terms and privacy policies of any third-party websites you visit.'
    },
    {
      icon: Shield,
      title: 'Limitation of Liability',
      content: 'In no event shall NovaCare247, its directors, employees, or affiliates be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of this website or the information contained herein, whether based on contract, tort, strict liability, or otherwise.'
    },
    {
      icon: FileText,
      title: 'Changes to Disclaimer',
      content: 'We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.'
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 via-white to-orange-50">
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Disclaimer</h1>
                <p className="text-gray-600 mt-2">Important legal information</p>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-orange-900">Important Notice:</strong> Please read this disclaimer carefully before using our website and services. 
                By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Last Updated: January 1, 2026
            </p>
          </div>
        </section>

        {/* Disclaimer Sections */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {section.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About This Disclaimer?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              If you have any questions or concerns about this disclaimer, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+914012345678" 
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                <Phone size={20} />
                <span>+91 40 1234 5678</span>
              </a>
              <a 
                href="mailto:care@novacare247.com" 
                className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-900 transition-colors"
              >
                <Mail size={20} />
                <span>care@novacare247.com</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DisclaimerPage;
