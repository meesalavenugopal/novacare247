import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Phone, Calendar, Users, Award, Star, 
  CheckCircle, Activity, Heart, Zap, MapPin, Clock,
  Stethoscope, Brain, Bone, Shield, ChevronLeft, ChevronRight, Quote
} from 'lucide-react';
import { doctorsAPI, servicesAPI, testimonialsAPI } from '../services/api';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
      {/* Hero Section - Clean Professional Design */}
      <section className="relative min-h-[85vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
            alt="Physiotherapy Professional"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[85vh] flex items-center py-16">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Expert Physiotherapy
                <br />
                <span className="text-primary-600">For Your Recovery</span>
              </h1>
              
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                At Chinamayi Physiotherapy Clinics, we provide personalized treatment 
                plans to help you recover faster and live pain-free. Our experienced 
                specialists are dedicated to your well-being.
              </p>
              
              {/* CTA Button */}
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-600/30"
              >
                Check Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-0 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Card 1 */}
            <div className="bg-primary-400 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Care</h3>
              <p className="text-white/80 text-sm mb-4">
                Treatment plans tailored to your specific needs and recovery goals.
              </p>
              <Link to="/book" className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                Book Appointment
              </Link>
            </div>
            
            {/* Card 2 */}
            <div className="bg-primary-500 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Emergency Care</h3>
              <p className="text-white/80 text-sm mb-4">
                Quick response for urgent physiotherapy needs and consultations.
              </p>
              <a href="tel:+919876543210" className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                +91 98765 43210
              </a>
            </div>
            
            {/* Card 3 */}
            <div className="bg-primary-600 p-6 text-white">
              <div className="w-12 h-12 border-2 border-white/30 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-white/80 text-sm mb-4">
                Schedule your appointment online at your convenience.
              </p>
              <Link to="/book" className="inline-flex items-center gap-1 text-sm border border-white/50 px-4 py-2 hover:bg-white/10 transition-colors">
                Make An Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Bento Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main About Card */}
            <div className="lg:col-span-2 bg-white p-8 shadow-sm">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Why Choose <span className="text-primary-600">Chinamayi?</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At Chinamayi Physiotherapy Clinics, we combine decades of expertise with 
                compassionate care to deliver exceptional outcomes. Our holistic approach 
                ensures every treatment is personalized to your unique needs.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 transition-colors text-sm"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
            
            {/* Experience Card */}
            <div className="bg-primary-600 p-6 text-white flex flex-col justify-center">
              <Award className="w-10 h-10 mb-4" />
              <h3 className="text-4xl font-bold mb-1">15+</h3>
              <p className="text-primary-100">Years of Excellence</p>
            </div>
            
            {/* Feature Cards Row */}
            <div className="bg-white p-6 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Personalized Care</h4>
              <p className="text-gray-500 text-sm">Treatment plans tailored to you</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Modern Equipment</h4>
              <p className="text-gray-500 text-sm">Latest therapy technology</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Safe & Effective</h4>
              <p className="text-gray-500 text-sm">Evidence-based treatments</p>
            </div>
            
            {/* Image Card */}
            <div className="lg:col-span-2 lg:row-span-2 overflow-hidden relative h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                alt="Physiotherapy Session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-semibold">Expert Care</p>
                <p className="text-white/80 text-sm">Dedicated to your recovery</p>
              </div>
            </div>
            
            <div className="bg-primary-50 p-6">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Expert Team</h4>
              <p className="text-gray-500 text-sm">Certified specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              What We <span className="text-primary-600">Offer</span>
            </h2>
          </div>
          
          {/* Bento Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              const isLarge = index === 0 || index === 3;
              return (
                <div 
                  key={service.id} 
                  className={`bg-gray-50 p-6 hover:bg-primary-50 transition-colors group ${isLarge ? 'lg:col-span-2' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">{service.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-primary-600 font-bold">₹{service.price}</span>
                        <span className="text-gray-400 text-sm">{service.duration} mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 transition-colors text-sm"
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section - Bento Grid */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-200 font-medium text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl font-bold text-white mt-2">Meet Our Experts</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="bg-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/20 transition-colors"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={doctorImages[index % doctorImages.length]}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary-200 bg-white/10 px-2 py-1">
                    {doctor.specialization}
                  </span>
                  <h3 className="font-semibold text-white mt-2">{doctor.full_name}</h3>
                  <p className="text-primary-200 text-sm mb-3">{doctor.experience_years} years exp.</p>
                  <Link 
                    to={`/book/${doctor.id}`} 
                    className="block w-full text-center bg-white text-primary-600 font-medium py-2 text-sm hover:bg-primary-50 transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/doctors" className="text-white hover:text-primary-200 font-medium inline-flex items-center gap-2">
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              What <span className="text-primary-600">Patients Say</span>
            </h2>
          </div>
          
          {testimonials.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 shadow-sm relative">
                <Quote className="w-10 h-10 text-primary-100 absolute top-6 left-6" />
                
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg mb-6 text-center leading-relaxed">
                  "{testimonials[currentTestimonial]?.content}"
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-primary-600 flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial]?.patient_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[currentTestimonial]?.patient_name}</p>
                    <p className="text-primary-600 text-sm">Verified Patient</p>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'bg-primary-600 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Recovery?
            </h2>
            <p className="text-primary-100 mb-8">
              Book your appointment today and take the first step towards a pain-free life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/book" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 transition-colors"
              >
                Book Appointment
              </Link>
              <a 
                href="tel:+919876543210" 
                className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-6 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Call Us</p>
                <p className="text-white font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Visit Us</p>
                <p className="text-white font-medium">Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-end">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Working Hours</p>
                <p className="text-white font-medium">Mon-Sat: 9AM - 8PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
