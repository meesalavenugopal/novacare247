import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Clock, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'Book Appointment', path: '/book' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar - Dark Teal Premium */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white py-2.5 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-primary-100">
              <Phone size={14} className="text-secondary-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 text-primary-100">
              <Mail size={14} className="text-secondary-400" />
              <span>info@chinamayi.com</span>
            </div>
            <div className="flex items-center gap-2 text-primary-100">
              <Clock size={14} className="text-secondary-400" />
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/check-booking" className="text-primary-100 hover:text-white transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse"></span>
              Check Booking Status
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Dark Teal Premium */}
      <nav className="bg-primary-900 sticky top-0 z-50 shadow-lg shadow-primary-900/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-secondary-500/30">
                <svg className="w-7 h-7 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="35" r="10" />
                  <path d="M35 50 Q50 70 65 50 Q50 90 35 50" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Chinamayi</h1>
                <p className="text-xs text-primary-300">Physiotherapy Clinics</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-200 hover:text-white hover:bg-primary-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-primary-200">Hi, {user.full_name}</span>
                  {isAdmin() && (
                    <Link to="/admin" className="px-4 py-2 border border-primary-600 text-primary-200 hover:bg-primary-800 rounded-lg text-sm font-medium transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-primary-200 hover:text-white font-medium px-4 py-2 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-secondary-500/30 transition-all">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-primary-700">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium py-3 px-4 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-200 hover:bg-primary-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="my-2 border-primary-700" />
                {user ? (
                  <>
                    <span className="text-primary-200 px-4">Hi, {user.full_name}</span>
                    {isAdmin() && (
                      <Link to="/admin" className="text-secondary-400 font-medium px-4 py-3">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={logout} className="bg-primary-700 text-white py-3 px-4 rounded-lg font-medium mt-2">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-primary-200 font-medium py-3 px-4">
                      Login
                    </Link>
                    <Link to="/register" className="bg-secondary-500 text-white py-3 px-4 rounded-lg font-medium text-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
