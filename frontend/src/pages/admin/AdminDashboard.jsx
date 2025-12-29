import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Stethoscope, Star, Clock, TrendingUp } from 'lucide-react';
import { adminAPI, bookingsAPI } from '../../services/api';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, todayRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        bookingsAPI.getToday(),
      ]);
      console.log('Dashboard stats:', statsRes.data);
      console.log('Today bookings:', todayRes.data);
      setStats(statsRes.data);
      setTodayBookings(todayRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Doctors', value: stats.total_doctors, icon: Stethoscope, link: '/admin/doctors' },
    { label: 'Total Patients', value: stats.total_patients, icon: Users, link: '#' },
    { label: 'Total Bookings', value: stats.total_bookings, icon: Calendar, link: '/admin/bookings' },
    { label: 'Pending Bookings', value: stats.pending_bookings, icon: Clock, link: '/admin/bookings' },
    { label: "Today's Appointments", value: stats.today_bookings, icon: TrendingUp, link: '/admin/bookings' },
    { label: 'Active Services', value: stats.total_services, icon: Star, link: '/admin/services' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link 
            key={index}
            to={stat.link}
            className="bg-white border border-gray-200 p-6 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {todayBookings.length > 0 ? (
            <div className="space-y-4">
              {todayBookings.slice(0, 5).map((booking) => (
                <div 
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {booking.patient_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{booking.patient_name}</p>
                      <p className="text-xs text-gray-500">{booking.patient_phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 text-sm">{booking.booking_time}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-primary-50 text-primary-700 border border-primary-100' :
                      booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                      'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
