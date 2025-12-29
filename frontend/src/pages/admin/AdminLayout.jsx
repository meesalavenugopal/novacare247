import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Stethoscope, MessageSquare, 
  Star, Menu, X, LogOut, Home, MapPin, Settings, BarChart3, Flag, MessageCircle, Bot,
  ChevronRight, Activity, FileText, UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      navigate('/login');
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/admin/onboarding', label: 'Doctor Onboarding', icon: UserPlus },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/services', label: 'Services', icon: Activity },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
    { path: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { path: '/admin/reviews', label: 'Reviews', icon: MessageCircle },
    { path: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { path: '/admin/branches', label: 'Branches', icon: MapPin },
    { path: '/admin/milestones', label: 'Milestones', icon: Flag },
    { path: '/admin/stats', label: 'Site Stats', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/ai-tools', label: 'AI Tools', icon: Bot },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-primary-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`}>
        {/* Logo Section */}
        <div className="p-5 border-b border-primary-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="NovaCare Logo" 
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">NovaCare<sup className="text-[10px] text-primary-300 ml-0.5 font-normal">™</sup></h1>
                <p className="text-primary-300 text-xs flex items-center gap-1.5">
                  Admin Dashboard
                  <span className="bg-[#f29123] text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">24/7</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-primary-300 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 h-[calc(100vh-180px)] overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                  active 
                    ? 'bg-primary-400/30' 
                    : 'bg-primary-800/50 group-hover:bg-primary-700/50'
                }`}>
                  <item.icon size={16} />
                </div>
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-primary-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary-800 bg-primary-900/80">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-primary-200 hover:bg-primary-800 hover:text-white rounded-lg transition-colors mb-1"
          >
            <div className="w-8 h-8 bg-primary-800/50 rounded-md flex items-center justify-center">
              <Home size={18} />
            </div>
            <span className="text-sm font-medium">Back to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-colors w-full"
          >
            <div className="w-8 h-8 bg-red-500/20 rounded-md flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>

            <div className="flex-1 lg:flex-none"></div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
