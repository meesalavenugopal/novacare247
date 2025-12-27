import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  Facebook, Instagram, Twitter, Linkedin,
  ArrowRight
} from 'lucide-react';
import { contactAPI } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: Mail, title: 'Email', value: 'info@chinamayi.com', link: 'mailto:info@chinamayi.com' },
    { icon: MapPin, title: 'Address', value: 'Banjara Hills, Hyderabad', link: '#' },
    { icon: Clock, title: 'Hours', value: 'Mon-Sat: 9AM - 8PM', link: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, link: '#', label: 'Facebook' },
    { icon: Instagram, link: '#', label: 'Instagram' },
    { icon: Twitter, link: '#', label: 'Twitter' },
    { icon: Linkedin, link: '#', label: 'LinkedIn' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-600 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=80"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-900/60"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary-200 font-medium text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6">
              We're Here to Help You
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Have questions about our services or need to schedule an appointment? 
              Reach out to us - we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="bg-white border border-gray-200 p-6 hover:border-primary-300 transition-colors text-center"
              >
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{info.title}</h3>
                <p className="text-gray-600 text-sm">{info.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 p-8 md:p-10">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary-50 border border-primary-100 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Send a Message</span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-2">Get in Touch</h2>
                    <p className="text-gray-600">Fill out the form and we'll respond as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-sm"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info & Map */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-primary-600 p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
                <p className="text-primary-100 mb-6 text-sm">
                  Need immediate assistance? Give us a call or book an appointment online.
                </p>
                <div className="space-y-4">
                  <a href="tel:+919876543210" className="flex items-center gap-4 bg-white/10 p-4 hover:bg-white/20 transition-colors">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-200">Call Now</p>
                      <p className="font-bold">+91 98765 43210</p>
                    </div>
                  </a>
                  <a href="mailto:info@chinamayi.com" className="flex items-center gap-4 bg-white/10 p-4 hover:bg-white/20 transition-colors">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-200">Email Us</p>
                      <p className="font-bold">info@chinamayi.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="relative h-56">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5772776427337!2d78.43091287485899!3d17.41516440153699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c1c3d5d8af%3A0x7b6eb9d8b9e7f5e5!2sBanjara%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1703600000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-800 mb-2">Main Clinic</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    123, Road No. 10, Banjara Hills,<br />
                    Hyderabad, Telangana 500034
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm hover:text-primary-700"
                  >
                    Get Directions <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Follow Us</h3>
                <p className="text-gray-600 text-sm mb-4">Stay connected for health tips and updates.</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className="w-10 h-10 bg-gray-100 hover:bg-primary-600 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'How do I book an appointment?', a: 'You can book online through our website, call us, or visit our clinic in person.' },
              { q: 'What should I bring to my first appointment?', a: 'Please bring any relevant medical reports, X-rays, or MRI scans, and wear comfortable clothing.' },
              { q: 'Do you accept insurance?', a: 'Yes, we accept most major health insurance plans. Please contact us for specific coverage details.' },
              { q: 'How long is each session?', a: 'Sessions typically range from 30 to 60 minutes depending on the treatment type.' },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
