import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Calendar, GraduationCap, Stethoscope, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary-200 font-medium text-sm uppercase tracking-wider">Our Medical Team</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6">
              Meet Our Expert Physiotherapists
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Our team of highly qualified doctors brings years of experience and 
              specialized expertise to help you on your journey to recovery and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{doctors.length}</p>
              <p className="text-gray-600 text-sm">Expert Doctors</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="text-gray-600 text-sm">Years Combined Exp</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">4.9</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">10+</p>
              <p className="text-gray-600 text-sm">Specializations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Doctors</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Choose Your Specialist
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="bg-white border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  {/* Doctor Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={doctorImages[index % doctorImages.length]}
                      alt={doctor.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900 text-sm">4.9</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 inline-block mb-3">
                      {doctor.specialization}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.full_name}</h3>
                    
                    {/* Qualification */}
                    {doctor.qualification && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <GraduationCap size={16} className="text-primary-600" />
                        <span className="text-sm">{doctor.qualification}</span>
                      </div>
                    )}

                    {/* Experience & Fee */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary-50 border border-primary-100 flex items-center justify-center">
                          <Award size={16} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{doctor.experience_years}+ Years</p>
                          <p className="text-xs text-gray-500">Experience</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-primary-600">₹{doctor.consultation_fee}</p>
                        <p className="text-xs text-gray-500">Per Session</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                    )}

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 ${doctor.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`text-sm ${doctor.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {doctor.is_available ? 'Available for appointments' : 'Currently unavailable'}
                      </span>
                    </div>

                    {/* Book Button */}
                    <Link 
                      to={`/book/${doctor.id}`}
                      className={`block w-full text-center py-3 font-medium transition-colors ${
                        doctor.is_available 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Calendar size={16} />
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
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help Choosing a Doctor?
            </h2>
            <p className="text-primary-100 mb-8">
              Our team can help you find the right specialist for your needs. 
              Contact us for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                to="/book" 
                className="border border-white/50 text-white hover:bg-white/10 font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                Book Any Doctor <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
