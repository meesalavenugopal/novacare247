import { useState } from 'react';
import { Phone, Search, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import { format } from 'date-fns';

const CheckBookingPage = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const response = await bookingsAPI.checkByPhone(phone);
      setBookings(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error checking booking:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-primary-600" size={18} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={18} />;
      case 'completed':
        return <CheckCircle className="text-primary-600" size={18} />;
      default:
        return <AlertCircle className="text-yellow-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary-50 text-primary-700 border border-primary-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'completed':
        return 'bg-primary-50 text-primary-700 border border-primary-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[40vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
            alt="Check Booking Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[40vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Track Appointment</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Check Booking
                <br />
                <span className="text-primary-600">Status</span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                Enter your phone number to view and track your appointment details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Search Form */}
            <div className="bg-white border border-gray-200 p-6 mb-8">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Search size={18} />
                  )}
                  Search
                </button>
              </form>
            </div>

            {/* Results */}
            {searched && (
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 p-6 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(booking.status)}
                          <span className={`px-3 py-1 text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">#{booking.id}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center">
                            <User className="text-primary-600" size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Doctor</p>
                            <p className="font-medium text-gray-800 text-sm">{booking.doctor_name}</p>
                            <p className="text-xs text-gray-600">{booking.doctor_specialization}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center">
                            <Calendar className="text-primary-600" size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium text-gray-800 text-sm">
                              {format(new Date(booking.booking_date), 'EEEE, MMM d, yyyy')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center">
                            <Clock className="text-primary-600" size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium text-gray-800 text-sm">{booking.booking_time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                      <Calendar className="text-gray-400" size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bookings Found</h3>
                    <p className="text-gray-600 text-sm">
                      No appointments found for this phone number.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckBookingPage;
