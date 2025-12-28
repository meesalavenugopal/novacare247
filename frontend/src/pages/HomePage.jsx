import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Phone, Calendar, Users, Award, Star, 
  CheckCircle, Activity, Heart, Zap, MapPin, Clock,
  Stethoscope, Brain, Bone, Shield, ChevronLeft, ChevronRight, Quote,
  Map, Building, UserCheck
} from 'lucide-react';
import { doctorsAPI, servicesAPI, testimonialsAPI, siteStatsAPI, siteSettingsAPI } from '../services/api';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);
  const [heroSettings, setHeroSettings] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Icon mapping for stats
  const iconMap = {
    MapPin, Map, Users, Award, Star, Building, UserCheck, Heart, Activity
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsRes, servicesRes, testimonialsRes, statsRes, settingsRes] = await Promise.all([
        doctorsAPI.getAll(),
        servicesAPI.getAll(),
        testimonialsAPI.getAll(),
        siteStatsAPI.getAll(),
        siteSettingsAPI.getGrouped(),
      ]);
      setDoctors(doctorsRes.data.slice(0, 4));
      setServices(servicesRes.data.slice(0, 6));
      setTestimonials(testimonialsRes.data.slice(0, 3));
      
      // Map stats with icons
      const statsData = statsRes.data.slice(0, 4).map(stat => ({
        ...stat,
        icon: iconMap[stat.icon] || MapPin
      }));
      setStats(statsData);
      
      // Set hero settings
      if (settingsRes.data.hero) {
        setHeroSettings(settingsRes.data.hero);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback stats if API fails
      setStats([
        { icon: MapPin, value: '1,900+', label: 'Rehabilitation Centers' },
        { icon: Users, value: '39', label: 'States Nationwide' },
        { icon: Award, value: '375+', label: 'University Partnerships' },
        { icon: Star, value: '4.9', label: 'Patient Rating' },
      ]);
    }
  };

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
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1200&q=80"
            alt="Physiotherapy Treatment"
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
                At NovaCare 24/7 Physiotherapy Clinics, we provide personalized treatment 
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
      <section className="pb-16 -mt-20 relative z-20">
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

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Why Choose <span className="text-primary-600">NovaCare 24/7?</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                At NovaCare 24/7 Physiotherapy Clinics, we combine decades of expertise with 
                compassionate care to deliver exceptional outcomes. Our holistic approach 
                ensures every treatment is personalized to your unique needs.
              </p>
              
              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200">
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Personalized Care</h4>
                    <p className="text-gray-600 text-sm">Treatment plans tailored to you</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200">
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Modern Equipment</h4>
                    <p className="text-gray-600 text-sm">Latest therapy technology</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200">
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Safe & Effective</h4>
                    <p className="text-gray-600 text-sm">Evidence-based treatments</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white border border-gray-200">
                  <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expert Team</h4>
                    <p className="text-gray-600 text-sm">Certified specialists</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 transition-colors text-sm w-fit"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
            
            {/* Right Column - Image & Stats */}
            <div className="flex flex-col gap-4">
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                  alt="Physiotherapy Session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-semibold text-lg">Expert Care</p>
                  <p className="text-white/80 text-sm">Dedicated to your recovery</p>
                </div>
              </div>
              
              <div className="bg-primary-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <Award className="w-12 h-12" />
                  <div>
                    <h3 className="text-3xl font-bold">15+</h3>
                    <p className="text-primary-100">Years of Excellence in Physiotherapy</p>
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
          <div className="text-center mb-10">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              What We <span className="text-primary-600">Offer</span>
            </h2>
          </div>
          
          {/* Bento Services Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <div 
                  key={service.id} 
                  className="bg-white border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:border-primary-600 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-primary-600 font-bold text-lg">₹{service.price}</span>
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

      {/* Doctors Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-200 font-medium text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl font-bold text-white mt-2">Meet Our Experts</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="bg-white overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={doctorImages[index % doctorImages.length]}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 inline-block mb-3">
                    {doctor.specialization}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-lg">{doctor.full_name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{doctor.experience_years} years experience</p>
                  {doctor.bio && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{doctor.bio}</p>
                  )}
                  <Link 
                    to={`/doctors/${doctor.id}`} 
                    className="text-primary-600 font-medium text-xs hover:underline flex items-center gap-1 mb-3"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    View Profile
                  </Link>
                  <Link 
                    to={`/book/${doctor.id}`} 
                    className="block w-full text-center bg-primary-600 text-white font-medium py-2.5 text-sm hover:bg-primary-700 transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/doctors" className="text-white hover:text-primary-200 font-medium inline-flex items-center gap-2 border border-white/30 px-6 py-2.5 hover:bg-white/10 transition-colors">
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Patient Success Stories Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Success Stories</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Patient <span className="text-primary-600">Success Stories</span>
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Real stories from our patients who have regained their mobility, confidence, and quality of life with NovaCare 24/7.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
                <img src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'women' : 'men'}/${44 + idx * 21}.jpg`} alt={`Patient ${t.patient_name}`} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-primary-100" />
                <h4 className="font-semibold text-gray-900 mb-1">{t.patient_name}</h4>
                <p className="text-primary-600 text-xs mb-2">{t.rating >= 4 ? 'Success Story' : 'Patient'}</p>
                <p className="text-gray-600 text-sm mb-3">“{t.content.length > 90 ? t.content.slice(0, 87) + '…' : t.content}”</p>
                <Link to={`/stories/${t.id}`} className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                  Read {t.patient_name}'s Story
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              What <span className="text-primary-600">Patients Say</span>
            </h2>
          </div>
          
          {testimonials.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 p-8 relative">
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
      <section className="py-20 bg-primary-600">
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
                className="border border-white/50 hover:bg-white/10 text-white font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-6 bg-primary-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-primary-300 text-xs">Call Us</p>
                <p className="text-white font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-primary-300 text-xs">Visit Us</p>
                <p className="text-white font-medium">Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-end">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-primary-300 text-xs">Working Hours</p>
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
