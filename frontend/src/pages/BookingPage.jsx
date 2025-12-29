import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ChevronLeft, ChevronRight, Star, Award, GraduationCap } from 'lucide-react';
import { doctorsAPI, bookingsAPI } from '../services/api';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import SEO from '../components/SEO';

const doctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
];

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    symptoms: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === parseInt(doctorId));
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(2);
      }
    }
  }, [doctorId, doctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await bookingsAPI.getAvailableSlots(selectedDoctor.id, dateStr);
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        doctor_id: selectedDoctor.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        ...formData,
      };

      const response = await bookingsAPI.create(bookingData);
      setBookingId(response.data.id);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  };

  const goToPreviousWeek = () => {
    const newStart = addDays(weekStart, -7);
    if (newStart >= startOfWeek(new Date(), { weekStartsOn: 1 })) {
      setWeekStart(newStart);
    }
  };

  const goToNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section - Matching HomePage Style */}
        <section className="relative min-h-[40vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
          {/* Background Image - Right Side */}
          <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
              alt="Success Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="min-h-[40vh] flex items-center py-12">
              <div className="max-w-xl">
                <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Success</span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                  Booking
                  <br />
                  <span className="text-primary-600">Confirmed!</span>
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  Your appointment has been successfully booked. You will receive a confirmation shortly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto bg-white border border-gray-200 p-8">
              <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Booking ID:</strong> #{bookingId}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Doctor:</strong> {selectedDoctor.full_name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {selectedTime}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 transition-colors"
                >
                  Go Home
                </button>
                <button
                  onClick={() => navigate('/check-booking')}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 transition-colors"
                >
                  Check Status
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Book Physiotherapy Appointment Online"
        description="Book your physiotherapy appointment online at NovaCare. Easy scheduling with expert physiotherapists in Hyderabad, Vizag, Vijayawada. Same-day appointments available!"
        keywords="book physiotherapy appointment, online physio booking, physiotherapist appointment, book physio near me, NovaCare booking, physio consultation booking"
        canonical="https://novacare247.com/booking"
        noindex={false}
      />
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[40vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
            alt="Booking Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[40vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Schedule Visit</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Book an
                <br />
                <span className="text-primary-600">Appointment</span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                Choose your preferred doctor and time slot for your physiotherapy session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="hidden sm:inline font-medium">Select Doctor</span>
            </div>
            <div className={`w-16 md:w-24 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="hidden sm:inline font-medium">Choose Slot</span>
            </div>
            <div className={`w-16 md:w-24 h-0.5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="hidden sm:inline font-medium">Your Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Select a Doctor</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor, index) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="bg-white border border-gray-200 text-left hover:border-primary-300 hover:shadow-md transition-all overflow-hidden group"
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

                      {/* Availability */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`w-2 h-2 ${doctor.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={`text-sm ${doctor.is_available ? 'text-green-600' : 'text-red-600'}`}>
                          {doctor.is_available ? 'Available for appointments' : 'Currently unavailable'}
                        </span>
                      </div>

                      {/* Book Button */}
                      <div 
                        className={`block w-full text-center py-3 font-medium transition-colors ${
                          doctor.is_available 
                            ? 'bg-primary-600 group-hover:bg-primary-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Calendar size={16} />
                          {doctor.is_available ? 'Select Doctor' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {step === 2 && selectedDoctor && (
            <div>
              <button
                onClick={() => { setStep(1); setSelectedDoctor(null); }}
                className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft size={16} /> Change Doctor
              </button>

              <div className="bg-white border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {selectedDoctor.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedDoctor.full_name}</h3>
                    <p className="text-primary-600 text-sm">{selectedDoctor.specialization}</p>
                    <p className="text-sm text-gray-500">₹{selectedDoctor.consultation_fee} per consultation</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary-600" />
                    Select Date
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={goToPreviousWeek}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={weekStart <= startOfWeek(new Date(), { weekStartsOn: 1 })}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-medium text-gray-700 text-sm">
                      {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </span>
                    <button 
                      onClick={goToNextWeek}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {getDaysOfWeek().map((date) => {
                      const isPast = date < new Date().setHours(0, 0, 0, 0);
                      const isSunday = date.getDay() === 0;
                      const isSelected = isSameDay(date, selectedDate);
                      const isDisabled = isPast || isSunday;

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => !isDisabled && handleDateSelect(date)}
                          disabled={isDisabled}
                          className={`p-3 text-center transition-colors ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : isDisabled
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-primary-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <div className="text-xs">{format(date, 'EEE')}</div>
                          <div className="font-semibold">{format(date, 'd')}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-primary-600" />
                    Available Slots for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-500 text-sm">Loading slots...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`py-2 px-3 text-sm font-medium transition-colors ${
                            slot.time === selectedTime
                              ? 'bg-primary-600 text-white'
                              : slot.available
                              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8 text-sm">
                      No slots available for this date. Please select another date.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setStep(2)}
                className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft size={16} /> Change Time Slot
              </button>

              <div className="bg-white border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Appointment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedDoctor.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Specialization</p>
                    <p className="font-medium">{selectedDoctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Consultation Fee</p>
                    <p className="font-medium text-primary-600">₹{selectedDoctor.consultation_fee}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-6">Enter Your Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User size={14} className="inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone size={14} className="inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="patient_phone"
                      value={formData.patient_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail size={14} className="inline mr-1" />
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="patient_email"
                      value={formData.patient_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText size={14} className="inline mr-1" />
                      Symptoms / Reason for Visit
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-sm"
                      placeholder="Briefly describe your symptoms or reason for consultation"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 mt-6 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
