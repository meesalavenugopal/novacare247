import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { siteStatsAPI, siteSettingsAPI } from '../services/api';
import SEO from '../components/SEO';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([
    { value: '10,000+', label: 'Happy Patients' },
    { value: '15+', label: 'Years Experience' },
  ]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await siteStatsAPI.getAll();
      // Get specific stats for login page (happy patients and years experience)
      const allStats = response.data;
      const happyPatients = allStats.find(s => s.label.toLowerCase().includes('patient'));
      const experience = allStats.find(s => s.label.toLowerCase().includes('experience') || s.label.toLowerCase().includes('years'));
      
      if (happyPatients || experience) {
        setStats([
          { value: happyPatients?.value || '10,000+', label: happyPatients?.label || 'Happy Patients' },
          { value: experience?.value || '15+', label: experience?.label || 'Years Experience' },
        ]);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Login | NovaCare Physiotherapy - Patient Portal"
        description="Login to your NovaCare account to manage appointments, track recovery progress, and access personalized physiotherapy care."
        keywords="login, patient portal, NovaCare login, physiotherapy account"
        canonical="https://novacare247.com/login"
        noindex={true}
      />
      
      <section className="relative min-h-[85vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[45%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
            alt="Physiotherapy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[85vh] flex items-center py-16">
            {/* Left Content */}
            <div className="hidden lg:block max-w-md">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Welcome Back
                <br />
                <span className="text-primary-600">To NovaCare 24/7</span>
              </h1>
              
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Sign in to your account to manage appointments, track your recovery progress, 
              and access your personalized health records with our expert physiotherapists.
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats[0]?.value}</p>
                  <p className="text-sm text-gray-500">{stats[0]?.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats[1]?.value}</p>
                  <p className="text-sm text-gray-500">{stats[1]?.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container - Right Side */}
      <div className="absolute top-0 right-0 w-full lg:w-[45%] h-full flex items-center justify-center p-8 lg:p-12 z-20">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 p-8 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign In to Your Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 border border-gray-100 p-3">
                  <p className="font-medium text-gray-700">Admin</p>
                  <p className="text-gray-500">admin@novacare247.com</p>
                  <p className="text-gray-500">admin123</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-3">
                  <p className="font-medium text-gray-700">Doctor</p>
                  <p className="text-gray-500">dr.priya@novacare247.com</p>
                  <p className="text-gray-500">doctor123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default LoginPage;
