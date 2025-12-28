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
                <svg className="w-7 h-7 text-white" viewBox="0 0 100 100" fill="currentColor">
                  {/* Lotus with Caduceus - Medical Symbol */}
                  {/* Lotus petals */}
                  <path d="M50 8 C50 8 38 22 38 32 C38 40 43 44 50 44 C57 44 62 40 62 32 C62 22 50 8 50 8" opacity="0.95" />
                  <path d="M50 15 C50 15 30 28 25 38 C22 44 28 48 36 45 C42 42 50 35 50 35" opacity="0.8" />
                  <path d="M50 15 C50 15 70 28 75 38 C78 44 72 48 64 45 C58 42 50 35 50 35" opacity="0.8" />
                  <path d="M50 22 C50 22 22 32 15 42 C12 48 20 52 30 48 C38 45 50 38 50 38" opacity="0.65" />
                  <path d="M50 22 C50 22 78 32 85 42 C88 48 80 52 70 48 C62 45 50 38 50 38" opacity="0.65" />
                  {/* Caduceus staff */}
                  <rect x="48" y="42" width="4" height="50" rx="1" />
                  {/* Snake wrapping around staff */}
                  <path d="M50 50 C58 52 56 58 50 60 C44 62 42 68 50 70 C58 72 56 78 50 80 C44 82 44 88 50 90" 
                        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">NovaCare<sup className="text-[10px] text-gray-400 ml-0.5 font-normal">™</sup></h3>
                <p className="text-xs text-primary-400 flex items-center gap-1.5">
                  Physiotherapy Clinics
                  <span className="bg-[#f29123] text-white text-[9px] font-bold px-1.5 py-0.5">24/7</span>
                </p>
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
                <span>info@novacare247.com</span>
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
            <p className="text-gray-500">&copy; 2025 NovaCare<sup className="text-[10px] text-gray-400">™</sup> 24/7 Physiotherapy Clinics. All rights reserved.</p>
            <div className="flex gap-6 mt-3 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
