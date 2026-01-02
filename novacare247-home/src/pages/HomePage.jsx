import { Activity, Stethoscope, Clock, MapPin, ArrowRight, Heart, Phone, Calendar, Award, Shield, Zap, CheckCircle, Users, Star } from 'lucide-react';
import Layout from '../components/Layout';

const HomePage = () => {
  // Configure your application URLs here
  const PHYSIO_URL = 'https://physio.novacare247.com';
  const GENERAL_MEDICINE_URL = 'https://medicine.novacare247.com';

  const services = [
    {
      title: 'NovaCare™',
      subtitle: 'Physiotherapy Clinics',
      badge: '24/7',
      icon: Activity,
      description: 'Expert physiotherapy services for pain relief, rehabilitation, and wellness. Personalized treatment plans delivered by certified physiotherapists to restore mobility and enhance your quality of life.',
      url: PHYSIO_URL,
      available: true,
      bgColor: 'bg-primary-50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      buttonBg: 'bg-primary-600 hover:bg-primary-700',
      rounded: '',
    },
    {
      title: 'NovaCare™',
      subtitle: 'General Medicine at Home',
      badge: '24/7',
      icon: Stethoscope,
      description: 'Comprehensive medical care at your doorstep. Our medical assistants visit with diagnostic equipment while physicians consult digitally for accurate diagnosis and treatment.',
      url: GENERAL_MEDICINE_URL,
      available: false,
      bgColor: 'bg-white',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      buttonBg: 'bg-primary-600 hover:bg-primary-700',
      rounded: '',
    }
  ];

  const features = [
    { icon: Heart, title: 'Personalized Care', desc: 'Tailored treatment for your needs' },
    { icon: Zap, title: 'Modern Facilities', desc: 'Advanced clinics & home tech' },
    { icon: Shield, title: 'Expert Guidance', desc: 'Certified specialists always' },
    { icon: CheckCircle, title: 'Flexible Options', desc: 'Clinic visits or home care' },
  ];

  return (
    <Layout>
      {/* Hero Section - Clean Professional Design */}
      <section className="relative min-h-[65vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80"
            alt="Healthcare Services"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[65vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Healthcare That
                <br />
                <span className="text-primary-600">Comes to You</span>
              </h1>
              
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Experience comprehensive healthcare with NovaCare™ 24/7. From expert physiotherapy at our clinics to innovative home-based digital consultations for general medicine—bringing quality care wherever you need it.
              </p>

              {/* Info Pills */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-[rgb(242,145,35)] text-white px-4 py-2 rounded-full">
                  <Clock size={18} />
                  <span className="font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full">
                  <MapPin size={18} />
                  <span className="font-medium">Clinic & Home Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="pb-16 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Card 1 */}
            <div className="bg-primary-400 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Care</h3>
              <p className="text-white/80 text-sm mb-4">
                Professional healthcare services tailored to your specific needs and preferences.
              </p>
              <a href={PHYSIO_URL} className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                Book Appointment
              </a>
            </div>
            
            {/* Card 2 */}
            <div className="bg-primary-500 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
              <p className="text-white/80 text-sm mb-4">
                Round-the-clock home visits with real-time digital consultations from specialists.
              </p>
              <a href="tel:+914012345678" className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                +91 40 1234 5678
              </a>
            </div>
            
            {/* Card 3 */}
            <div className="bg-primary-600 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-white/80 text-sm mb-4">
                Schedule clinic appointments or home visits online at your convenience.
              </p>
              <a href={PHYSIO_URL} className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                Make An Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              We're a network of healthcare experts
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">50+</p>
              <p className="text-gray-600">expert doctors across multiple specialties</p>
            </div>
            <div className="text-center md:border-x md:border-gray-200 md:px-8">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">10+</p>
              <p className="text-gray-600">locations serving communities near you</p>
            </div>
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">10K+</p>
              <p className="text-gray-600">happy patients with successful treatments</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Why Choose <span className="text-primary-600">NovaCare™ 24/7?</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                At NovaCare™ 24/7, we offer the best of both worlds—expert physiotherapy at our state-of-the-art clinics and innovative home-based digital consultations for general medicine. Our hybrid approach combines convenience with clinical excellence, ensuring you receive the right care in the right setting.
              </p>
              
              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white border border-gray-200">
                    <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <a 
                href={PHYSIO_URL}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 transition-colors text-sm w-fit"
              >
                Learn More <ArrowRight size={16} />
              </a>
            </div>
            
            {/* Right Column - Image & Stats */}
            <div className="flex flex-col gap-4">
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80"
                  alt="Healthcare Excellence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-semibold text-lg">Expert Care</p>
                  <p className="text-white/80 text-sm">Dedicated to your wellness</p>
                </div>
              </div>
              
              <div className="bg-primary-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <Award className="w-12 h-12" />
                  <div>
                    <h3 className="text-3xl font-bold">24/7</h3>
                    <p className="text-primary-100">Round the Clock Healthcare Services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Our Services</h3>
            <p className="text-gray-600">Choose the healthcare service you need</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`relative ${service.rounded} overflow-hidden ${service.bgColor} shadow-sm transition-all duration-300 hover:shadow-lg`}
              >
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
                    className={`inline-flex items-center gap-2 px-6 py-3 ${service.buttonBg} text-white font-semibold rounded-xl transition-all`}
                  >
                    Visit Now
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-100 mb-8">
              Our dedicated team is here to support your wellness journey every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+914012345678" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
