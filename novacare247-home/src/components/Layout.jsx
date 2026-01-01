import { Activity, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="NovaCare247" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-primary-600 font-bold text-xl">N</span>';
                  }}
                />
              </div>
              <div className="relative">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-primary-600">NovaCare<sup className="text-xs">™</sup></span> 
                  <span className="flex items-center gap-1.5 bg-[rgb(242,145,35)] text-white text-xs font-medium px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span>24 | 7</span>
                  </span>
                </h1>
                <p className="text-sm text-gray-500">Your Health, Our Priority</p>
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
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h5 className="font-bold text-white">NovaCare247</h5>
                <p className="text-sm text-gray-400">Your Health, Our Priority</p>
              </div>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2026 NovaCare247. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
