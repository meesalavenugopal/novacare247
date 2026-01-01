import { Activity, Phone, Mail, Clock, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:+914012345678" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Phone size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">+91 40 1234 5678</span>
            </a>
            <div className="w-px h-4 bg-gray-200"></div>
            <a href="mailto:care@novacare247.com" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Mail size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">care@novacare247.com</span>
            </a>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Clock size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">Mon-Sun: 24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-50 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="NovaCare247" 
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.classList.remove('hidden');
                  }}
                />
                <div className="w-9 h-9 bg-primary-600 rounded-xl items-center justify-center hidden">
                  <Activity className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">NovaCare</span><sup className="text-[10px] text-gray-500 ml-0.5 font-normal">™</sup>
                </h1>
                <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                  Your Health, Our Priority
                  <span className="bg-[#f29123] text-white text-[9px] font-bold px-1.5 py-0.5 animate-pulse">24/7</span>
                </p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary-600">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:info@novacare247.com" className="flex items-center gap-2 hover:text-primary-600">
                <Mail size={16} />
                <span>info@novacare247.com</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="NovaCare Logo" 
                    className="w-9 h-9 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.classList.remove('hidden');
                    }}
                  />
                  <div className="w-9 h-9 bg-primary-600 rounded-xl items-center justify-center hidden">
                    <Activity className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">
                    NovaCare<sup className="text-[10px] text-gray-400 ml-0.5 font-normal">™</sup>
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    Your Health, Our Priority
                    <span className="bg-[#f29123] text-white text-[9px] font-bold px-1.5 py-0.5 animate-pulse">24/7</span>
                  </p>
                </div>
              </div>
              <p className="text-sm mb-6 leading-relaxed">
                Providing expert physiotherapy care with experienced doctors and modern facilities. 
                Your journey to better health starts here.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/disclaimer" className="hover:text-primary-400 transition-colors">Disclaimer</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
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
                  <span>Kukatpally, Hyderabad, Telangana 500072</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-primary-400" />
                  </div>
                  <a href="tel:+914012345678" className="hover:text-primary-400 transition-colors">
                    +91 40 1234 5678
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-primary-400" />
                  </div>
                  <a href="mailto:care@novacare247.com" className="hover:text-primary-400 transition-colors">
                    care@novacare247.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={16} className="text-primary-400" />
                  </div>
                  <span>Mon-Sun: 0:00 AM - 11:59 PM<br />Sunday: Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-gray-500">
                &copy; 2026 NovaCare<sup className="text-[10px] text-gray-400">™</sup> 24/7 Physiotherapy Clinics. All rights reserved.
              </p>
              <div className="flex gap-6 mt-3 md:mt-0">
                <Link to="/privacy-policy" className="text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</Link>
                <Link to="/disclaimer" className="text-gray-500 hover:text-primary-400 transition-colors">Disclaimer</Link>
                <Link to="/contact" className="text-gray-500 hover:text-primary-400 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
