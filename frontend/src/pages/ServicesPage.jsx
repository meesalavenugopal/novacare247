import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, IndianRupee, ArrowRight, Stethoscope, Brain, Bone, Activity, Heart, Zap, Shield, Sparkles, Dumbbell, Hand } from 'lucide-react';
import { servicesAPI } from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceIcons = [Stethoscope, Brain, Bone, Activity, Heart, Zap, Shield, Sparkles, Dumbbell, Hand];
  
  const serviceImages = [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80',
  ];

  const benefits = [
    { icon: Shield, title: 'Evidence-Based', desc: 'All treatments backed by clinical research' },
    { icon: Heart, title: 'Patient-Centered', desc: 'Personalized care for every individual' },
    { icon: Zap, title: 'Quick Results', desc: 'Effective treatments for faster recovery' },
    { icon: Sparkles, title: 'Modern Techniques', desc: 'Latest physiotherapy methods and equipment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 to-primary-900/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Comprehensive
              <span className="block text-secondary-400">Physiotherapy Care</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              From pain management to sports rehabilitation, we offer a complete 
              range of physiotherapy services designed to help you achieve optimal health.
            </p>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Treatment Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Expert care for all your physiotherapy needs
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = serviceIcons[index % serviceIcons.length];
                return (
                  <div 
                    key={service.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={serviceImages[index % serviceImages.length]}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-7 h-7 text-primary-600" />
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-secondary-500 text-white px-4 py-2 rounded-full font-bold">
                        ₹{service.price}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={18} />
                          <span>{service.duration} minutes</span>
                        </div>
                        <Link 
                          to="/book"
                          className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 group/link"
                        >
                          Book Now
                          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Your Journey to Recovery
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A simple, effective process designed for your comfort and recovery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Book Appointment', desc: 'Schedule a convenient time with our specialists' },
              { step: '02', title: 'Initial Assessment', desc: 'Comprehensive evaluation of your condition' },
              { step: '03', title: 'Treatment Plan', desc: 'Personalized therapy program for your needs' },
              { step: '04', title: 'Recovery Journey', desc: 'Regular sessions and progress monitoring' },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
                
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-secondary-600/95"></div>
            </div>
            
            <div className="relative z-10 py-16 px-8 md:py-20 md:px-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Begin Your Treatment?
                  </h2>
                  <p className="text-white/90 text-lg mb-6">
                    Book your first appointment today and take the first step 
                    towards a pain-free, active life.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/book" 
                      className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
                    >
                      Book Appointment
                    </Link>
                    <Link 
                      to="/contact" 
                      className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-4">Quick Facts</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-white/90">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Clock size={16} />
                        </div>
                        <span>30-60 minute sessions</span>
                      </li>
                      <li className="flex items-center gap-3 text-white/90">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                        <span>100% safe treatments</span>
                      </li>
                      <li className="flex items-center gap-3 text-white/90">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Heart size={16} />
                        </div>
                        <span>Personalized care plans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
