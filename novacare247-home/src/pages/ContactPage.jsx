import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ArrowLeft, Activity, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Use relative path for Vercel deployment, localhost for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/contact' 
        : 'http://localhost:3000/api/contact';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 40 1234 5678', '+91 40 1234 5679'],
      action: 'tel:+914012345678'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['care@novacare247.com', 'support@novacare247.com'],
      action: 'mailto:care@novacare247.com'
    },
    {
      icon: MapPin,
      title: 'Head Office',
      details: ['NovaCare247 Healthcare Pvt. Ltd.', 'Hitech City, Hyderabad 500081'],
      action: null
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['24/7 Healthcare Services', 'Admin: Mon-Sat, 9 AM - 6 PM'],
      action: null
    }
  ];

  const services = [
    {
      icon: Activity,
      title: 'NovaCare™ Physiotherapy',
      description: 'For physiotherapy related inquiries',
      email: 'physio@novacare247.com',
      phone: '+91 40 1234 5680',
      comingSoon: true
    },
    {
      icon: Stethoscope,
      title: 'NovaCare™ General Medicine',
      description: 'For general medicine inquiries',
      email: 'medicine@novacare247.com',
      phone: '+91 40 1234 5681',
      comingSoon: true
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80"
            alt="Contact Us"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[50vh] flex flex-col justify-center py-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium w-fit"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MessageCircle size={18} />
                Contact Us
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Get in Touch
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="text-primary-600" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm">
                    {info.action && i === 0 ? (
                      <a href={info.action} className="hover:text-primary-600 transition-colors">
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Service Contacts */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Anil Reddy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="anil.reddy@example.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="+91 40 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="appointment">Appointment Help</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Failed to send message. Please try again later or contact us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Service-Specific Contacts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service-Specific Contacts</h2>
              <div className="space-y-6">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-2xl p-6 border ${service.comingSoon ? 'bg-gray-50 border-gray-200' : 'bg-primary-50 border-primary-100'}`}
                  >
                    {service.comingSoon && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${service.comingSoon ? 'bg-gray-200' : 'bg-primary-100'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <service.icon className={service.comingSoon ? 'text-gray-500' : 'text-primary-600'} size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="space-y-2">
                          <a 
                            href={`mailto:${service.email}`} 
                            className={`flex items-center gap-2 text-sm ${service.comingSoon ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'}`}
                            onClick={e => service.comingSoon && e.preventDefault()}
                          >
                            <Mail size={16} />
                            {service.email}
                          </a>
                          <a 
                            href={`tel:${service.phone.replace(/\s/g, '')}`} 
                            className={`flex items-center gap-2 text-sm ${service.comingSoon ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'}`}
                            onClick={e => service.comingSoon && e.preventDefault()}
                          >
                            <Phone size={16} />
                            {service.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Notice */}
              <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Medical Emergency?
                </h3>
                <p className="text-red-700 text-sm mb-3">
                  For medical emergencies, please call emergency services immediately.
                </p>
                <a 
                  href="tel:108" 
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
                >
                  <Phone size={18} />
                  Call 108 (Emergency)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
