import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="35" r="10" />
                  <path d="M35 50 Q50 70 65 50 Q50 90 35 50" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Chinamayi</h3>
                <p className="text-xs text-primary-400">Physiotherapy Clinics</p>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              Providing expert physiotherapy care with experienced doctors and modern facilities. 
              Your journey to better health starts here.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-9 h-9 bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-9 h-9 bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="w-9 h-9 bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Our Doctors</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Services</Link></li>
              <li><Link to="/book" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Book Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-primary-400 transition-colors">Manual Therapy</li>
              <li className="hover:text-primary-400 transition-colors">Electrotherapy</li>
              <li className="hover:text-primary-400 transition-colors">Sports Rehabilitation</li>
              <li className="hover:text-primary-400 transition-colors">Post-Surgical Care</li>
              <li className="hover:text-primary-400 transition-colors">Neurological Therapy</li>
              <li className="hover:text-primary-400 transition-colors">Pediatric Physiotherapy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-primary-400" />
                </div>
                <span>123 Health Street, Medical District, Hyderabad - 500001</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-primary-400" />
                </div>
                <span>info@chinamayi.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} className="text-primary-400" />
                </div>
                <span>Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500">&copy; 2025 Chinamayi Physiotherapy Clinics. All rights reserved.</p>
            <div className="flex gap-6 mt-3 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
