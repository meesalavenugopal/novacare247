import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { siteSettingsAPI, servicesAPI, branchesAPI } from '../services/api';

const Footer = () => {
  const [contactSettings, setContactSettings] = useState({
    phone: '+91 98765 43210',
    email: 'info@novacare247.com',
    address: '123 Health Street, Medical District, Hyderabad - 500001',
    business_hours: 'Mon - Sat: 9:00 AM - 8:00 PM'
  });
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await siteSettingsAPI.getGrouped();
        if (res.data.contact) {
          setContactSettings({
            phone: res.data.contact.phone || '+91 98765 43210',
            email: res.data.contact.email || 'info@novacare247.com',
            address: res.data.contact.address || '123 Health Street, Medical District, Hyderabad - 500001',
            business_hours: res.data.contact.business_hours || 'Mon - Sat: 9:00 AM - 8:00 PM'
          });
        }
      } catch (error) {
        console.error('Failed to load contact settings:', error);
      }
    };

    const loadServices = async () => {
      try {
        const res = await servicesAPI.getAll();
        setServices(res.data.slice(0, 6)); // Show top 6 services
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };

    const loadBranches = async () => {
      try {
        const res = await branchesAPI.getAll();
        setBranches(res.data.filter(b => b.is_active).slice(0, 4)); // Show top 4 active branches
      } catch (error) {
        console.error('Failed to load branches:', error);
      }
    };

    loadSettings();
    loadServices();
    loadBranches();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="NovaCare Logo" 
                  className="w-9 h-9 object-contain"
                />
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
              <li><Link to="/apply-doctor" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Join as Doctor</Link></li>
              <li><Link to="/apply-clinic" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Partner Your Clinic</Link></li>
              <li><Link to="/apply-doctor/status" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Check Application Status</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3 text-sm">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>
                    <Link 
                      to={`/services/${service.slug}`} 
                      className="hover:text-primary-400 transition-colors flex items-center gap-2"
                    >
                      <ArrowRight size={14} /> {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li className="hover:text-primary-400 transition-colors">Manual Therapy</li>
                  <li className="hover:text-primary-400 transition-colors">Sports Rehabilitation</li>
                  <li className="hover:text-primary-400 transition-colors">Post-Surgical Care</li>
                  <li className="hover:text-primary-400 transition-colors">Neurological Therapy</li>
                  <li className="hover:text-primary-400 transition-colors">Pediatric Physiotherapy</li>
                </>
              )}
              <li className="pt-2">
                <Link 
                  to="/services" 
                  className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-medium"
                >
                  View All Services <ArrowRight size={14} />
                </Link>
              </li>
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
                <span>{contactSettings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <a href={`tel:${contactSettings.phone.replace(/\s/g, '')}`} className="hover:text-primary-400 transition-colors">
                  {contactSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-primary-400" />
                </div>
                <a href={`mailto:${contactSettings.email}`} className="hover:text-primary-400 transition-colors">
                  {contactSettings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} className="text-primary-400" />
                </div>
                <span>{contactSettings.business_hours}<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Branches Row above the line */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex flex-wrap justify-center gap-6">
          {branches.length > 0 ? (
            branches.map((branch) => (
              <div key={branch.id} className="flex flex-col items-center text-sm text-gray-400 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary-400" />
                  <span className="font-medium text-white">{branch.name}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{branch.city}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col items-center text-sm text-gray-400 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary-400" />
                  <span className="font-medium text-white">Bangalore</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Bangalore</span>
              </div>
            </>
          )}
          <Link 
            to="/branches" 
            className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-medium border border-primary-400 rounded px-2 py-0.5 ml-2"
          >
            View All Branches <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      {/* Bottom Bar with Hyderabad */}
      <div className="border-t border-gray-800 mt-6">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            {/* Removed static Hyderabad location from bottom bar */}
            <p className="text-gray-500">&copy; 2025 NovaCare<sup className="text-[10px] text-gray-400">™</sup> 24/7 Physiotherapy Clinics. All rights reserved.</p>
            <div className="flex gap-6 mt-3 md:mt-0 flex-wrap justify-center">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" className="text-gray-500 hover:text-primary-400 transition-colors">Refund Policy</Link>
              <Link to="/disclaimer" className="text-gray-500 hover:text-primary-400 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
