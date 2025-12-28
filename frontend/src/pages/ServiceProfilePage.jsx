import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Phone,
  Clock,
  Star,
  Hand,
  Zap,
  Dumbbell,
  Shield,
  Activity,
  Brain,
  Bone,
  Sparkles,
  Heart
} from 'lucide-react';
import { servicesAPI } from '../services/api';
import SEO from '../components/SEO';

// Icon mapping for dynamic icon rendering
const iconMap = {
  Hand,
  Zap,
  Dumbbell,
  Shield,
  Activity,
  Brain,
  Bone,
  Sparkles,
  Heart
};

const ServiceProfilePage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop';

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await servicesAPI.getById(id);
      setService(response.data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get icon component by name
  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={32} /> : <Activity size={32} />;
  };

  // Toggle FAQ accordion
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
        <Link to="/services" className="text-primary-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  // Use image from backend, fallback to default
  const serviceImage = service.image || defaultImage;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${service.name} - Physiotherapy Treatment`}
        description={`${service.description} Expert ${service.name} treatment at NovaCare. Book appointment now in Hyderabad, Vizag.`}
        keywords={`${service.name}, ${service.name} treatment, ${service.name} physiotherapy, physio for ${service.name}, NovaCare ${service.name}`}
        canonical={`https://novacare247.com/services/${id}`}
        service={service}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={serviceImage}
            alt={service.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-700/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/services" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 text-sm">
            <ArrowLeft size={16} /> Back to All Services
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Service Icon */}
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-white">
              {getIcon(service.icon)}
            </div>
            
            {/* Service Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{service.name}</h1>
              <p className="text-lg text-white/90 max-w-2xl">
                {service.description}
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                <Link 
                  to="/book"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Calendar size={18} />
                  Book This Treatment
                </Link>
                <a 
                  href="tel:+1234567890"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone size={18} />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      {service.detailed_description && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Treatment</h2>
              <div className="prose prose-lg text-gray-600 whitespace-pre-line">
                {service.detailed_description}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of {service.name}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover how this treatment can help improve your health and well-being.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <span className="text-gray-800 font-medium leading-tight">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Conditions Treated */}
      {service.conditions_treated && service.conditions_treated.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Conditions We Treat</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {service.name} is effective for treating these conditions and more.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {service.conditions_treated.map((condition, index) => (
                <span 
                  key={index}
                  className="bg-primary-50 text-primary-700 px-5 py-2.5 rounded-full text-sm font-medium"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Treatment Process */}
      {service.treatment_process && service.treatment_process.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Treatment Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our step-by-step approach ensures the best outcomes for your treatment.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform md:-translate-x-1/2"></div>
                
                {service.treatment_process.map((step, index) => (
                  <div 
                    key={index}
                    className={`relative flex items-start gap-6 mb-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Step number circle */}
                    <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg transform -translate-x-1/2 z-10">
                      {step.step}
                    </div>
                    
                    {/* Content card */}
                    <div className={`ml-16 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                    }`}>
                      <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Got questions? We've got answers. Learn more about {service.name}.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {service.faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border-b border-gray-200 last:border-0"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-5 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="text-primary-600 flex-shrink-0" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="pb-5 text-gray-600 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Treatment?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Book an appointment with our expert physiotherapists and take the first step towards recovery.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/book"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              <Calendar size={20} />
              Book Appointment
            </Link>
            <Link 
              to="/doctors"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <Star size={20} />
              Meet Our Experts
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>+91 1234567890</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceProfilePage;
