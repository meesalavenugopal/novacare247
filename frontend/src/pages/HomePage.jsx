import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Phone, Calendar, Users, Award, Star, 
  CheckCircle, Activity, Heart, Zap, MapPin, Clock,
  Stethoscope, Brain, Bone, Shield
} from 'lucide-react';
import { doctorsAPI, servicesAPI, testimonialsAPI } from '../services/api';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsRes, servicesRes, testimonialsRes] = await Promise.all([
        doctorsAPI.getAll(),
        servicesAPI.getAll(),
        testimonialsAPI.getAll(),
      ]);
      setDoctors(doctorsRes.data.slice(0, 4));
      setServices(servicesRes.data.slice(0, 6));
      setTestimonials(testimonialsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Patients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Activity, value: '5', label: 'Expert Doctors' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
  ];

  const features = [
    { icon: Heart, title: 'Personalized Care', desc: 'Treatment plans tailored to your specific needs and goals' },
    { icon: Zap, title: 'Modern Equipment', desc: 'State-of-the-art physiotherapy equipment and techniques' },
    { icon: CheckCircle, title: 'Expert Team', desc: 'Highly qualified and experienced physiotherapists' },
    { icon: Shield, title: 'Safe & Effective', desc: 'Evidence-based treatments with proven results' },
  ];

  const serviceIcons = [Stethoscope, Brain, Bone, Activity, Heart, Zap];

  const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean Premium Design */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-gradient-to-bl from-primary-100/60 via-primary-50/30 to-transparent rounded-bl-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary-100/50 to-transparent rounded-full -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-primary-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[90vh] py-16">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 px-4 py-2 rounded-full mb-8 shadow-sm">
                <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary-700">Hyderabad's Premier Physiotherapy Clinic</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Move Better.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">Live Better.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Expert physiotherapy care with personalized treatment plans. 
                Our specialists help you recover faster and stay stronger.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  to="/book" 
                  className="group bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-4 px-8 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
                >
                  Book Appointment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="tel:+919876543210" 
                  className="group bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-gray-700 py-4 px-8 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 shadow-sm"
                >
                  <Phone size={20} className="text-primary-600" />
                  +91 98765 43210
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-primary-100">
                <div>
                  <p className="text-3xl font-bold text-primary-700">10K+</p>
                  <p className="text-sm text-gray-500">Happy Patients</p>
                </div>
                <div className="w-px h-12 bg-primary-200"></div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">15+</p>
                  <p className="text-sm text-gray-500">Years Experience</p>
                </div>
                <div className="w-px h-12 bg-primary-200"></div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-primary-700">4.9</span>
                    <Star className="w-5 h-5 fill-secondary-400 text-secondary-400" />
                  </div>
                  <p className="text-sm text-gray-500">Patient Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Main Image with Blob Shape */}
                <div className="relative">
                  {/* Blob Background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-100 rounded-[3rem] transform rotate-6"></div>
                  
                  {/* Image Container */}
                  <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                      alt="Professional Physiotherapy Session"
                      className="w-full h-[450px] lg:h-[520px] object-cover rounded-[2rem]"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-3 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent rounded-[2rem]"></div>
                    
                    {/* Bottom Content on Image */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                              <Activity className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Expert Care</p>
                              <p className="text-sm text-gray-500">Personalized Treatment Plans</p>
                            </div>
                          </div>
                          <div className="flex -space-x-3">
                            {doctorImages.slice(0, 3).map((img, i) => (
                              <img key={i} src={img} alt="" className="w-10 h-10 rounded-full border-3 border-white object-cover shadow" />
                            ))}
                            <div className="w-10 h-10 rounded-full bg-primary-500 border-3 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                              +2
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge - Top Right */}
                <div className="absolute -top-3 -right-3 lg:top-4 lg:-right-6 z-20">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge - Left */}
                <div className="absolute top-1/3 -left-4 lg:-left-8 z-20 hidden md:block">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl px-5 py-4 shadow-xl shadow-primary-500/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8" />
                      <div>
                        <p className="font-bold text-lg">15+ Years</p>
                        <p className="text-primary-100 text-sm">Experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300 shadow-lg group-hover:shadow-primary-500/30">
                  <stat.icon className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                  alt="Physiotherapy Session"
                  className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary-100 rounded-2xl -z-0"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary-100 rounded-2xl -z-0"></div>
              
              {/* Experience Badge */}
              <div className="absolute bottom-8 right-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-primary-100">Years of Excellence</p>
              </div>
            </div>

            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                About Chinamayi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Why Thousands Trust
                <span className="text-primary-600"> Chinamayi</span> for Their Recovery
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                At Chinamayi Physiotherapy Clinics, we combine decades of expertise with 
                compassionate care to deliver exceptional outcomes. Our holistic approach 
                ensures every treatment is personalized to your unique needs and goals.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-gray-500 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group"
              >
                Learn More About Us 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Care Solutions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From rehabilitation to pain management, we offer a full spectrum of physiotherapy services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <div 
                  key={service.id} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{service.price}</span>
                      <span className="text-gray-400 text-sm ml-1">/ session</span>
                    </div>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock size={14} />
                      {service.duration} mins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-colors"
            >
              View All Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Dedicated professionals committed to your recovery and well-being
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={doctorImages[index % doctorImages.length]}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-600">
                      {doctor.specialization}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.full_name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <Award size={14} className="text-secondary-500" />
                    {doctor.experience_years} years experience
                  </p>
                  <Link 
                    to={`/book/${doctor.id}`} 
                    className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/doctors" 
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group text-lg"
            >
              View All Doctors 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-primary-900/95"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Patients Say
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Real stories from real patients who found relief and recovery at Chinamayi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.patient_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.patient_name}</p>
                    <p className="text-white/60 text-sm">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/95 to-primary-600/95"></div>
            </div>
            
            <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Recovery?
              </h2>
              <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
                Book your appointment today and take the first step towards a pain-free, 
                active life. Our expert team is ready to help you achieve your health goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/book" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-colors shadow-lg text-lg"
                >
                  Book Appointment Now
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl transition-colors text-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call Us</p>
                <p className="text-xl font-semibold">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Visit Us</p>
                <p className="text-xl font-semibold">Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Working Hours</p>
                <p className="text-xl font-semibold">Mon-Sat: 9AM - 8PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
