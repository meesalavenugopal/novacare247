import { Activity, Stethoscope, Clock, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const App = () => {
  // Configure your application URLs here
  // For local development, use localhost ports
  // For production, use subdomain URLs
  const isDev = window.location.hostname === 'localhost';
  
  const PHYSIO_URL = isDev ? 'http://localhost:5173' : 'https://physio.novacare247.com';
  const GENERAL_MEDICINE_URL = isDev ? '#' : 'https://medicine.novacare247.com';

  const services = [
    {
      title: 'NovaCare™',
      subtitle: 'Physiotherapy Clinics',
      badge: '24/7',
      icon: Activity,
      description: 'Expert physiotherapy services for pain relief, rehabilitation, and wellness',
      url: PHYSIO_URL,
      available: true,
      bgColor: 'bg-primary-50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      buttonBg: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'NovaCare™',
      subtitle: 'General Medicine',
      badge: '24/7',
      icon: Stethoscope,
      description: 'Comprehensive general medicine care for all your health needs',
      url: GENERAL_MEDICINE_URL,
      available: false,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  NovaCare<span className="text-primary-600">247</span>
                </h1>
                <p className="text-sm text-gray-500">Your Health, Our Priority</p>
              </div>
            </div>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Healthcare That Never Sleeps
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Access quality healthcare services 24 hours a day, 7 days a week. 
            Choose the care that fits your needs.
          </p>
          <div className="flex items-center justify-center gap-4 text-primary-100">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>24/7 Available</span>
            </div>
            <div className="w-px h-5 bg-primary-400"></div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>Multiple Locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Our Services</h3>
            <p className="text-gray-600">Choose the healthcare service you need</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl overflow-hidden ${service.bgColor} transition-all duration-300 hover:shadow-xl`}
              >
                {/* Coming Soon Overlay */}
                {!service.available && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-2">
                        Coming Soon
                      </div>
                      <p className="text-gray-600">Launching in 2026</p>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center`}>
                      <service.icon className={service.iconColor} size={32} />
                    </div>
                    <span className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-gray-800 mb-1">
                      {service.title}
                    </h4>
                    <p className={`text-xl font-semibold ${service.iconColor}`}>
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={service.url}
                    className={`inline-flex items-center gap-2 px-6 py-3 ${service.buttonBg} text-white font-semibold rounded-xl transition-all ${!service.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => !service.available && e.preventDefault()}
                  >
                    {service.available ? 'Visit Now' : 'Coming Soon'}
                    {service.available && <ArrowRight size={18} />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <p className="text-gray-600">Round the Clock Care</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <p className="text-gray-600">Expert Doctors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
              <p className="text-gray-600">Locations</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <p className="text-gray-600">Happy Patients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h5 className="font-bold text-white">NovaCare247</h5>
                <p className="text-sm text-gray-400">Your Health, Our Priority</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
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

export default App;
