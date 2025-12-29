import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';


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
import AdminBranches from './pages/admin/AdminBranches';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMilestones from './pages/admin/AdminMilestones';
import AdminStats from './pages/admin/AdminStats';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAITools from './pages/admin/AdminAITools';
import AdminBlog from './pages/admin/AdminBlog';
import StoryPage from './pages/StoryPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ServiceProfilePage from './pages/ServiceProfilePage';
import LocationPage from './pages/LocationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AllBranchesPage from './pages/AllBranchesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
          <Route path="/doctors" element={<><Navbar /><DoctorsPage /><Footer /></>} />
          <Route path="/doctors/:slug" element={<><Navbar /><DoctorProfilePage /><Footer /></>} />
          <Route path="/services" element={<><Navbar /><ServicesPage /><Footer /></>} />
          <Route path="/services/:slug" element={<><Navbar /><ServiceProfilePage /><Footer /></>} />
          <Route path="/book/:doctorId?" element={<><Navbar /><BookingPage /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/branches" element={<><Navbar /><AllBranchesPage /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><RegisterPage /><Footer /></>} />
          <Route path="/check-booking" element={<><Navbar /><CheckBookingPage /><Footer /></>} />
          
          {/* Dynamic Patient Story Route */}
          <Route path="/stories/:id" element={<><Navbar /><StoryPage /><Footer /></>} />
          
          {/* Location-Based SEO Pages */}
          <Route path="/physiotherapy/:location" element={<><Navbar /><LocationPage /><Footer /></>} />
          <Route path="/:treatment/:location" element={<><Navbar /><LocationPage /><Footer /></>} />
          
          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicyPage /><Footer /></>} />
          <Route path="/terms-of-service" element={<><Navbar /><TermsOfServicePage /><Footer /></>} />
          
          {/* Blog Pages */}
          <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogPostPage /><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="branches" element={<AdminBranches />} />
            <Route path="milestones" element={<AdminMilestones />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="ai-tools" element={<AdminAITools />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
