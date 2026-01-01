import { Activity, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
