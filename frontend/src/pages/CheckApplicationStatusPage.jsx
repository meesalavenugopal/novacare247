import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ClipboardCheck, AlertCircle, Loader2, 
  ArrowRight, CheckCircle, Clock, Calendar, X,
  UserPlus, FileCheck, GraduationCap, Activity
} from 'lucide-react';
import { onboardingAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

const CheckApplicationStatusPage = () => {
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusData, setStatusData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!applicationId.trim() || !email.trim()) {
      setError('Please enter both Application ID and Email');
      return;
    }

    setLoading(true);
    setError('');
    setStatusData(null);

    try {
      const res = await onboardingAPI.checkStatus(applicationId.trim(), email.trim());
      setStatusData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Application not found. Please check your Application ID and Email.');
      } else {
        setError(err.response?.data?.detail || 'Failed to check status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FileCheck },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ClipboardCheck },
    ai_verified: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Activity },
    verification_approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    verification_rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
    interview_scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar },
    interview_completed: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: CheckCircle },
    training_in_progress: { bg: 'bg-orange-100', text: 'text-orange-800', icon: GraduationCap },
    training_completed: { bg: 'bg-teal-100', text: 'text-teal-800', icon: CheckCircle },
    pending_activation: { bg: 'bg-cyan-100', text: 'text-cyan-800', icon: Clock },
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
  };

  const getStatusInfo = (status) => {
    return statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClipboardCheck };
  };

  const workflowSteps = [
    { key: 'submitted', label: 'Application Submitted' },
    { key: 'verification', label: 'Verification' },
    { key: 'interview', label: 'Interview' },
    { key: 'training', label: 'Training' },
    { key: 'active', label: 'Active' },
  ];

  const getCurrentStep = (status) => {
    if (status === 'draft' || status === 'submitted') return 0;
    if (status.includes('verif') || status === 'ai_verified') return 1;
    if (status.includes('interview')) return 2;
    if (status.includes('training')) return 3;
    if (status === 'pending_activation' || status === 'active') return 4;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      <Helmet>
        <title>Check Application Status | NovaCare 24/7</title>
        <meta name="description" content="Check the status of your doctor application at NovaCare 24/7" />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Check Application Status</h1>
          <p className="text-gray-600 mt-2">
            Track your doctor application progress at NovaCare 24/7
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
                <button type="button" onClick={() => setError('')} className="ml-auto">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your Application ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter the email you used to apply"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status Result */}
        {statusData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${getStatusInfo(statusData.status).bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {(() => {
                  const StatusIcon = getStatusInfo(statusData.status).icon;
                  return <StatusIcon className={`w-8 h-8 ${getStatusInfo(statusData.status).text}`} />;
                })()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application Found</h2>
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusInfo(statusData.status).bg} ${getStatusInfo(statusData.status).text}`}>
                {statusData.status?.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Progress Tracker */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-4">Application Progress</h3>
              <div className="flex items-center justify-between">
                {workflowSteps.map((step, index) => {
                  const currentStep = getCurrentStep(statusData.status);
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-primary-600 text-white' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className="text-xs text-gray-500 mt-2 text-center max-w-[60px]">{step.label}</span>
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className={`w-8 sm:w-12 h-1 mx-1 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Message */}
            {statusData.message && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Status Details</h3>
                <p className="text-gray-700">{statusData.message}</p>
              </div>
            )}

            {/* Next Steps */}
            {statusData.next_steps && (
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                <p className="text-blue-800">{statusData.next_steps}</p>
              </div>
            )}

            {/* Interview Date */}
            {statusData.interview_date && (
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interview Scheduled
                </h3>
                <p className="text-yellow-800 text-lg font-medium">
                  {new Date(statusData.interview_date).toLocaleString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center pt-4 border-t">
              <button
                onClick={() => {
                  setStatusData(null);
                  setApplicationId('');
                  setEmail('');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Check Another Application
              </button>
            </div>
          </div>
        )}

        {/* Apply Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Haven't applied yet?{' '}
            <Link to="/apply-doctor" className="text-primary-600 hover:underline font-medium">
              Apply Now <ArrowRight className="w-4 h-4 inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckApplicationStatusPage;
