import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { doctorsAPI, bookingsAPI } from '../services/api';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

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
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. You will receive a confirmation shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
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
                className="btn-outline flex-1"
              >
                Go Home
              </button>
              <button
                onClick={() => navigate('/check-booking')}
                className="btn-primary flex-1"
              >
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-white/90">Choose your doctor and preferred time slot</p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="hidden sm:inline font-medium">Select Doctor</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="hidden sm:inline font-medium">Choose Slot</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="hidden sm:inline font-medium">Your Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select a Doctor</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {doctor.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{doctor.full_name}</h3>
                        <p className="text-primary-600 text-sm">{doctor.specialization}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doctor.experience_years} years experience</p>
                    <p className="text-primary-600 font-semibold">₹{doctor.consultation_fee}</p>
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
                className="text-primary-600 hover:underline mb-4 flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Change Doctor
              </button>

              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-primary-600" />
                    Select Date
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={goToPreviousWeek}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      disabled={weekStart <= startOfWeek(new Date(), { weekStartsOn: 1 })}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium text-gray-700">
                      {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </span>
                    <button 
                      onClick={goToNextWeek}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight size={20} />
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
                          className={`p-3 rounded-lg text-center transition-colors ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : isDisabled
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-primary-100 text-gray-700'
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
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-primary-600" />
                    Available Slots for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading slots...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            slot.time === selectedTime
                              ? 'bg-primary-600 text-white'
                              : slot.available
                              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
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
                className="text-primary-600 hover:underline mb-4 flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Change Time Slot
              </button>

              <div className="bg-white rounded-xl shadow p-6 mb-6">
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

              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-6">Enter Your Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User size={16} className="inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone size={16} className="inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="patient_phone"
                      value={formData.patient_phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail size={16} className="inline mr-1" />
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="patient_email"
                      value={formData.patient_email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText size={16} className="inline mr-1" />
                      Symptoms / Reason for Visit
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field"
                      placeholder="Briefly describe your symptoms or reason for consultation"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
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
