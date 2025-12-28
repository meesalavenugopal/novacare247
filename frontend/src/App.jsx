import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckBookingPage from './pages/CheckBookingPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminInquiries from './pages/admin/AdminInquiries';

import StoryPage from './pages/StoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
          <Route path="/doctors" element={<><Navbar /><DoctorsPage /><Footer /></>} />
          <Route path="/services" element={<><Navbar /><ServicesPage /><Footer /></>} />
          <Route path="/book/:doctorId?" element={<><Navbar /><BookingPage /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><RegisterPage /><Footer /></>} />
          <Route path="/check-booking" element={<><Navbar /><CheckBookingPage /><Footer /></>} />
          
          {/* Dynamic Patient Story Route */}
          <Route path="/stories/:id" element={<><Navbar /><StoryPage /><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
