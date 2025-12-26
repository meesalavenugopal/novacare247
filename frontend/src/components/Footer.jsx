import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="35" r="10" />
                  <path d="M35 50 Q50 70 65 50 Q50 90 35 50" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Chinamayi</h3>
                <p className="text-xs">Physiotherapy Clinics</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Providing expert physiotherapy care with experienced doctors and modern facilities. 
              Your journey to better health starts here.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Our Doctors</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Services</Link></li>
              <li><Link to="/book" className="hover:text-primary-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Manual Therapy</li>
              <li>Electrotherapy</li>
              <li>Sports Rehabilitation</li>
              <li>Post-Surgical Care</li>
              <li>Neurological Therapy</li>
              <li>Pediatric Physiotherapy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-primary-400" />
                <span>123 Health Street, Medical District, Hyderabad - 500001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-400" />
                <span>info@chinamayi.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="flex-shrink-0 mt-0.5 text-primary-400" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 Chinamayi Physiotherapy Clinics. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
