import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Star, Calendar, MapPin, GraduationCap, Stethoscope } from 'lucide-react';
import { doctorsAPI } from '../services/api';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-800/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
              Our Medical Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet Our Expert
              <span className="block text-secondary-400">Physiotherapists</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Our team of highly qualified doctors brings years of experience and 
              specialized expertise to help you on your journey to recovery and wellness.
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

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-14 h-14 bg-primary-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{doctors.length}</p>
              <p className="text-gray-500">Expert Doctors</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-14 h-14 bg-secondary-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Award className="w-7 h-7 text-secondary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">50+</p>
              <p className="text-gray-500">Years Combined Exp</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Star className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">4.9</p>
              <p className="text-gray-500">Average Rating</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-14 h-14 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">10+</p>
              <p className="text-gray-500">Specializations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Doctor Image */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={doctorImages[index % doctorImages.length]}
                      alt={doctor.full_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary-600 mb-3">
                        {doctor.specialization}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{doctor.full_name}</h3>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">4.9</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">
                    {/* Qualification */}
                    {doctor.qualification && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <GraduationCap size={18} className="text-primary-500" />
                        <span className="text-sm">{doctor.qualification}</span>
                      </div>
                    )}

                    {/* Experience & Fee */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <Award size={18} className="text-secondary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{doctor.experience_years}+ Years</p>
                          <p className="text-xs text-gray-500">Experience</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-primary-600">₹{doctor.consultation_fee}</p>
                        <p className="text-xs text-gray-500">Per Session</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                    )}

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-3 h-3 rounded-full ${doctor.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`text-sm font-medium ${doctor.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {doctor.is_available ? 'Available for appointments' : 'Currently unavailable'}
                      </span>
                    </div>

                    {/* Book Button */}
                    <Link 
                      to={`/book/${doctor.id}`}
                      className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
                        doctor.is_available 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Calendar size={18} />
                        {doctor.is_available ? 'Book Appointment' : 'Unavailable'}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-secondary-600/95"></div>
            </div>
            
            <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need Help Choosing a Doctor?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Our team can help you find the right specialist for your needs. 
                Contact us for a free consultation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/contact" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-colors shadow-lg"
                >
                  Contact Us
                </Link>
                <Link 
                  to="/book" 
                  className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl transition-colors"
                >
                  Book Any Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
