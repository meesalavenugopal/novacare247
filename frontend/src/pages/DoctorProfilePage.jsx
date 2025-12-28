import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Star, Calendar, GraduationCap, MapPin, Clock, Phone, Mail, ArrowLeft, Building2, Video, Home, Building, Quote, BadgeCheck } from 'lucide-react';
import { doctorsAPI } from '../services/api';

const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=600&fit=crop&crop=face';

  useEffect(() => {
    loadDoctor();
    loadReviews();
  }, [id]);

  const loadDoctor = async () => {
    try {
      const response = await doctorsAPI.getById(id);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error loading doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await doctorsAPI.getReviews(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Get consultation type icon
  const getConsultationIcon = (type) => {
    switch (type) {
      case 'clinic': return <Building size={16} />;
      case 'home': return <Home size={16} />;
      case 'video': return <Video size={16} />;
      default: return <Building size={16} />;
    }
  };

  // Get consultation type label
  const getConsultationLabel = (type) => {
    switch (type) {
      case 'clinic': return 'In-Clinic Visit';
      case 'home': return 'Home Visit';
      case 'video': return 'Video Consultation';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
        <Link to="/doctors" className="text-primary-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Doctors
        </Link>
      </div>
    );
  }

  // Use profile_image from backend, fallback to default
  const doctorImage = doctor.profile_image || defaultImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="container mx-auto px-4">
          <Link to="/doctors" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 text-sm">
            <ArrowLeft size={16} /> Back to All Doctors
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Doctor Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              <img 
                src={doctorImage}
                alt={doctor.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Doctor Info */}
            <div className="text-center md:text-left">
              <span className="text-primary-200 font-medium text-sm uppercase tracking-wider">
                {doctor.specialization}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
                {doctor.full_name}
              </h1>
              
              {doctor.qualification && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 mb-3">
                  <GraduationCap size={18} />
                  <span>{doctor.qualification}</span>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 mb-6">
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span>{doctor.experience_years}+ Years Experience</span>
                </div>
                {doctor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-white font-semibold">{doctor.rating}</span>
                  </div>
                )}
                {doctor.branch && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{doctor.branch.name}, {doctor.branch.city}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link 
                  to={`/book/${doctor.id}`}
                  className="bg-white text-primary-600 font-medium px-6 py-3 hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Book Appointment
                </Link>
                <span className={`px-4 py-3 font-medium ${doctor.is_available ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {doctor.is_available ? '● Available Now' : '○ Currently Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {doctor.full_name}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {doctor.bio || `${doctor.full_name} is a dedicated ${doctor.specialization.toLowerCase()} specialist with ${doctor.experience_years} years of experience in helping patients recover and improve their quality of life. Their patient-centric approach and expertise make them one of the most sought-after physiotherapists at NovaCare 24/7.`}
                </p>
              </div>

              {/* Specializations */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
                <div className="grid grid-cols-2 gap-3">
                  {doctor.expertise && doctor.expertise.length > 0 ? (
                    doctor.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary-500"></span>
                        {skill}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary-500"></span>
                        {doctor.specialization}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary-500"></span>
                        Pain Management
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary-500"></span>
                        Manual Therapy
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary-500"></span>
                        Rehabilitation
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Journey/Story */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{doctor.full_name.split(' ').slice(-1)[0]}'s Journey</h2>
                <div className="prose text-gray-600">
                  {doctor.story ? (
                    doctor.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="mb-4">
                        With a passion for healing and {doctor.experience_years} years of dedicated practice, {doctor.full_name.split(' ')[0]} has helped thousands of patients regain their mobility and live pain-free lives.
                      </p>
                      <p className="mb-4">
                        Specializing in {doctor.specialization.toLowerCase()}, they bring a unique combination of clinical expertise and compassionate care to every patient interaction. Their approach focuses on understanding each patient's individual needs and creating personalized treatment plans.
                      </p>
                      <p>
                        "Every patient's journey to recovery is unique, and I'm honored to be a part of that journey," says {doctor.full_name.split(' ')[0]}. "At NovaCare 24/7, we believe in treating the whole person, not just the symptoms."
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Patient Reviews */}
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Patient Reviews</h2>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          {/* Patient Avatar */}
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            {review.patient_image ? (
                              <img 
                                src={review.patient_image} 
                                alt={review.patient_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-primary-600 font-bold text-lg">
                                {review.patient_name.charAt(0)}
                              </span>
                            )}
                          </div>
                          
                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{review.patient_name}</h4>
                              {review.is_verified && (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  <BadgeCheck size={12} />
                                  Verified
                                </span>
                              )}
                            </div>
                            
                            {review.treatment_type && (
                              <p className="text-sm text-primary-600 mb-2">{review.treatment_type}</p>
                            )}
                            
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            
                            <p className="text-gray-600 leading-relaxed">
                              <Quote size={14} className="inline text-gray-300 mr-1" />
                              {review.content}
                            </p>
                            
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(review.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Quote size={32} className="mx-auto mb-3 text-gray-300" />
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Consultation Fees */}
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Fees</h3>
                
                {doctor.consultation_fees && doctor.consultation_fees.length > 0 ? (
                  <div className="space-y-3">
                    {doctor.consultation_fees
                      .filter(fee => fee.country === 'India' && fee.is_available)
                      .map((fee) => (
                        <div key={fee.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-2 text-gray-700">
                            {getConsultationIcon(fee.consultation_type)}
                            <span className="text-sm">{getConsultationLabel(fee.consultation_type)}</span>
                          </div>
                          <span className="font-bold text-primary-600">
                            {fee.currency === 'INR' ? '₹' : '$'}{fee.fee}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50">
                    <p className="text-2xl font-bold text-primary-600 mb-1">₹{doctor.consultation_fee}</p>
                    <p className="text-gray-500 text-sm">Per Session</p>
                  </div>
                )}
                
                <Link 
                  to={`/book/${doctor.id}`}
                  className="block w-full text-center bg-primary-600 text-white font-medium py-3 mt-4 hover:bg-primary-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>

              {/* Branch Info */}
              {doctor.branch && (
                <div className="bg-white p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Clinic Location</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-primary-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{doctor.branch.name}</p>
                        <p className="text-sm">{doctor.branch.city}, {doctor.branch.state}</p>
                        <p className="text-sm">{doctor.branch.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a href="tel:+914012345678" className="flex items-center gap-3 text-gray-600 hover:text-primary-600">
                    <Phone size={18} />
                    <span>+91 40 1234 5678</span>
                  </a>
                  <a href="mailto:care@novacare247.com" className="flex items-center gap-3 text-gray-600 hover:text-primary-600">
                    <Mail size={18} />
                    <span>care@novacare247.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Recovery Journey?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Book an appointment with {doctor.full_name} today and take the first step towards a pain-free life.
          </p>
          <Link 
            to={`/book/${doctor.id}`}
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium px-8 py-3 hover:bg-primary-50 transition-colors"
          >
            <Calendar size={18} />
            Book Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfilePage;
