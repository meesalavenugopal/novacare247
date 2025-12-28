import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Stethoscope, Brain, Bone, Activity, Heart, Zap, Shield, Sparkles, Dumbbell, Hand, CheckCircle } from 'lucide-react';
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
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=400&fit=crop',
  ];

  const benefits = [
    { icon: Shield, title: 'Evidence-Based', desc: 'All treatments backed by clinical research' },
    { icon: Heart, title: 'Patient-Centered', desc: 'Personalized care for every individual' },
    { icon: Zap, title: 'Quick Results', desc: 'Effective treatments for faster recovery' },
    { icon: Sparkles, title: 'Modern Techniques', desc: 'Latest physiotherapy methods and equipment' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80"
            alt="Services Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[50vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Services</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Comprehensive
                <br />
                <span className="text-primary-600">Physiotherapy Care</span>
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                From pain management to sports rehabilitation, we offer a complete 
                range of physiotherapy services designed to help you achieve optimal health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              We're a network of outpatient physical rehabilitation experts
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">1,900+</p>
              <p className="text-gray-600">centers with a wide range of physical therapy services</p>
            </div>
            <div className="text-center md:border-x md:border-gray-200 md:px-8">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">39</p>
              <p className="text-gray-600">states with our centers, serving a community near you</p>
            </div>
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">375+</p>
              <p className="text-gray-600">partnerships with university, college and community organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Treatments</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Our Treatment Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Expert care for all your physiotherapy needs
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const IconComponent = serviceIcons[index % serviceIcons.length];
                const serviceImage = serviceImages[index % serviceImages.length];
                return (
                  <div 
                    key={service.id} 
                    className="bg-white border border-gray-200 hover:border-primary-300 transition-colors flex flex-col h-full"
                  >
                    {/* Service Image */}
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={serviceImage}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Service Header */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-primary-600 font-bold">₹{service.price}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Clock size={14} />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{service.description}</p>
                      
                      <Link 
                        to="/book"
                        className="inline-flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm py-2.5 px-4 transition-colors mt-auto"
                      >
                        Book Now
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Your Journey to Recovery
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A simple, effective process designed for your comfort and recovery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector Line - Full width behind steps */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-primary-200 -translate-y-1/2"></div>
            
            {[
              { step: '01', title: 'Book Appointment', desc: 'Schedule a convenient time with our specialists' },
              { step: '02', title: 'Initial Assessment', desc: 'Comprehensive evaluation of your condition' },
              { step: '03', title: 'Treatment Plan', desc: 'Personalized therapy program for your needs' },
              { step: '04', title: 'Recovery Journey', desc: 'Regular sessions and progress monitoring' },
            ].map((item, index) => (
              <div key={index} className="relative text-center z-10">
                <div className="w-16 h-16 bg-primary-600 mx-auto mb-6 flex items-center justify-center text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Begin Your Treatment?
                </h2>
                <p className="text-primary-100 text-lg mb-6">
                  Book your first appointment today and take the first step 
                  towards a pain-free, active life.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/book" 
                    className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 transition-colors"
                  >
                    Book Appointment
                  </Link>
                  <Link 
                    to="/contact" 
                    className="border border-white text-white hover:bg-white/10 font-semibold py-3 px-6 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Facts</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-primary-100">
                      <CheckCircle size={18} className="text-white" />
                      <span>30-60 minute sessions</span>
                    </li>
                    <li className="flex items-center gap-3 text-primary-100">
                      <CheckCircle size={18} className="text-white" />
                      <span>100% safe treatments</span>
                    </li>
                    <li className="flex items-center gap-3 text-primary-100">
                      <CheckCircle size={18} className="text-white" />
                      <span>Personalized care plans</span>
                    </li>
                    <li className="flex items-center gap-3 text-primary-100">
                      <CheckCircle size={18} className="text-white" />
                      <span>Expert physiotherapists</span>
                    </li>
                  </ul>
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
