import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Clock, Mail, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { siteSettingsAPI } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({
    phone: '+91 98765 43210',
    email: 'info@novacare247.com',
    business_hours: 'Mon - Sat: 9 AM - 8 PM'
  });
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await siteSettingsAPI.getGrouped();
        const data = response.data;
        if (data.contact) {
          setSettings({
            phone: data.contact.phone || '+91 98765 43210',
            email: data.contact.email || 'info@novacare247.com',
            business_hours: data.contact.business_hours || 'Mon - Sat: 9 AM - 8 PM'
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar - Elegant Minimal */}
      <div className="bg-white border-b border-gray-100 py-2 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Phone size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">{settings.phone}</span>
            </a>
            <div className="w-px h-4 bg-gray-200"></div>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Mail size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">{settings.email}</span>
            </a>
            <div className="w-px h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center">
                <Clock size={12} className="text-primary-600" />
              </div>
              <span className="font-medium">{settings.business_hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/check-booking" 
              className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group"
            >
              <Calendar size={14} />
              <span>Track Appointment</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Clean White with Shadow on Scroll */}
      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-gray-200/60' : 'shadow-sm'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 100 100" fill="currentColor">
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
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles size={8} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  NovaCare
                </h1>
                <p className="text-[11px] font-medium text-primary-500 tracking-wide uppercase flex items-center gap-1.5">
                  Physiotherapy Clinics
                  <span className="bg-[#f29123] text-white text-[9px] font-bold px-1.5 py-0.5 animate-pulse">24/7</span>
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 font-medium text-[15px] transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* CTA & Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.full_name?.split(' ')[0]}</span>
                  </div>
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/book" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
                  >
                    <Calendar size={16} />
                    Book Appointment
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="container mx-auto px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium py-3 px-4 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="my-3 border-t border-gray-100"></div>
              
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="text-primary-600 font-medium px-4 py-3 hover:bg-primary-50 rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="text-left text-gray-600 font-medium px-4 py-3 hover:bg-gray-50 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 font-medium px-4 py-3 hover:bg-gray-50 rounded-xl" 
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/book" 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 px-4 rounded-xl font-medium mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Calendar size={18} />
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
