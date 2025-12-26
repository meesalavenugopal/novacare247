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
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 px-6"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                    alt="Physiotherapy Session"
                    className="w-full h-[550px] object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">15+</p>
                      <p className="text-gray-500 text-sm">Years Experience</p>
                    </div>
                  </div>
                </div>

                {/* Small decorative element */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-100 rounded-2xl -z-10"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span className="text-teal-700 font-medium text-sm">About Us</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Trusted Care for Your
                <span className="text-teal-600"> Recovery Journey</span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                At Chinamayi Physiotherapy Clinics, we combine decades of expertise with 
                compassionate care to deliver exceptional outcomes. Our holistic approach 
                ensures every treatment is personalized to your unique needs and goals.
              </p>
              
              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl transition-colors"
              >
                Learn More About Us 
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700 font-medium text-sm">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Comprehensive physiotherapy solutions tailored to your recovery needs
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <div 
                  key={service.id} 
                  className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-teal-500 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-500 mb-5 line-clamp-2 text-sm leading-relaxed">{service.description}</p>
                  
                  {/* Price & Duration */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">₹{service.price}</span>
                      <span className="text-gray-400 text-sm">/ session</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock size={14} />
                      <span>{service.duration} mins</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-14">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-colors"
            >
              View All Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              <span className="text-teal-700 font-medium text-sm">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Experts
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Skilled professionals dedicated to your recovery journey
            </p>
          </div>
          
          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={doctorImages[index % doctorImages.length]}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Specialization Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-teal-600">
                      {doctor.specialization}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.full_name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                    <Award size={14} className="text-teal-500" />
                    {doctor.experience_years} years experience
                  </p>
                  <Link 
                    to={`/book/${doctor.id}`} 
                    className="block w-full text-center bg-gray-900 hover:bg-teal-600 text-white font-medium py-3 rounded-xl transition-colors duration-300"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-14">
            <Link 
              to="/doctors" 
              className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 group text-lg"
            >
              View All Doctors 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span className="text-amber-700 font-medium text-sm">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Patients Say
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Real experiences from real patients who found relief with us
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {testimonial.patient_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.patient_name}</p>
                    <p className="text-gray-500 text-sm">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Recovery?
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Book your appointment today and take the first step towards a pain-free, 
              active life. Our expert team is ready to help you achieve your health goals.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/book" 
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-10 rounded-xl transition-colors text-lg"
              >
                Book Appointment Now
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-10 rounded-xl transition-colors text-lg border border-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Call Us</p>
                <p className="text-lg font-semibold text-gray-900">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Visit Us</p>
                <p className="text-lg font-semibold text-gray-900">Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Working Hours</p>
                <p className="text-lg font-semibold text-gray-900">Mon-Sat: 9AM - 8PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
