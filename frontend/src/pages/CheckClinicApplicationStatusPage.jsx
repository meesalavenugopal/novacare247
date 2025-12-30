import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, ClipboardCheck, Loader2, AlertCircle } from 'lucide-react';
import { clinicOnboardingAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

const CheckClinicApplicationStatusPage = () => {
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusData, setStatusData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!applicationId || !email) {
      setError('Please enter both Application ID and Email');
      return;
    }

    setLoading(true);
    setError('');
    setStatusData(null);

    try {
      const res = await clinicOnboardingAPI.checkStatus(applicationId, email);
      setStatusData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No application found with these details. Please check your Application ID and Email.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    submitted: 'bg-blue-100 text-blue-800 border-blue-200',
    documentation_pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    documentation_approved: 'bg-green-100 text-green-800 border-green-200',
    documentation_rejected: 'bg-red-100 text-red-800 border-red-200',
    site_verification_pending: 'bg-orange-100 text-orange-800 border-orange-200',
    site_verification_scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
    site_verification_completed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    site_verification_passed: 'bg-green-100 text-green-800 border-green-200',
    site_verification_failed: 'bg-red-100 text-red-800 border-red-200',
    contract_pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    contract_signed: 'bg-green-100 text-green-800 border-green-200',
    setup_pending: 'bg-blue-100 text-blue-800 border-blue-200',
    setup_completed: 'bg-green-100 text-green-800 border-green-200',
    training_pending: 'bg-orange-100 text-orange-800 border-orange-200',
    training_in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    training_completed: 'bg-green-100 text-green-800 border-green-200',
    activation_pending: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    activated: 'bg-green-100 text-green-800 border-green-200',
    suspended: 'bg-red-100 text-red-800 border-red-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const stageDescriptions = {
    1: { name: 'Application', description: 'Your application is being reviewed' },
    2: { name: 'Documentation', description: 'Document verification in progress' },
    3: { name: 'Site Verification', description: 'Facility inspection scheduled or completed' },
    4: { name: 'Contract', description: 'Partnership agreement stage' },
    5: { name: 'Setup', description: 'Platform configuration in progress' },
    6: { name: 'Training', description: 'Staff training scheduled or in progress' },
    7: { name: 'Activation', description: 'Final approval pending' },
    8: { name: 'Active', description: 'Your clinic is live on NovaCare!' },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>Check Clinic Application Status | NovaCare 24/7</title>
        <meta name="description" content="Check the status of your clinic partnership application with NovaCare 24/7." />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Check Clinic Application Status
          </h1>
          <p className="text-gray-600">
            Enter your application details to view the current status
          </p>
        </div>

        {/* Search Form */}
        {!statusData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application ID
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your application ID (e.g., 123)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="clinic@example.com"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600">
                Haven't applied yet?{' '}
                <Link 
                  to="/apply-clinic" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Partner your clinic
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Status Display */}
        {statusData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{statusData.clinic_name}</h2>
              <p className="text-gray-600">Application ID: {statusData.id}</p>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Current Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize border ${statusColors[statusData.status] || 'bg-gray-100'}`}>
                  {statusData.status?.replace(/_/g, ' ')}
                </span>
              </div>

              {statusData.current_stage && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{statusData.current_stage.stage}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{statusData.current_stage.name}</p>
                      <p className="text-sm text-gray-600">{statusData.current_stage.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Partnership Details */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-medium text-blue-900 mb-3">Partnership Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Tier</p>
                  <p className="font-medium text-blue-900 capitalize">{statusData.partnership_tier}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Commission Rate</p>
                  <p className="font-medium text-blue-900">{statusData.commission_rate}%</p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Application Progress</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                {Object.entries(stageDescriptions).map(([stageNum, stage]) => {
                  const currentStage = statusData.current_stage?.stage || 1;
                  const stageNumber = parseInt(stageNum);
                  const isCompleted = stageNumber < currentStage;
                  const isCurrent = stageNumber === currentStage;
                  const isFuture = stageNumber > currentStage;

                  return (
                    <div key={stageNum} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? '✓' : stageNum}
                      </div>
                      <div className={`flex-1 ${isFuture ? 'opacity-50' : ''}`}>
                        <p className={`font-medium ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>
                          {stage.name}
                        </p>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStatusData(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Check Another Application
              </button>
              <Link
                to="/contact"
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your application?</p>
          <p className="text-gray-600">
            Email us at{' '}
            <a href="mailto:clinics@novacare247.com" className="text-primary-600 hover:underline">
              clinics@novacare247.com
            </a>
            {' '}or call{' '}
            <a href="tel:+919876543210" className="text-primary-600 hover:underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckClinicApplicationStatusPage;
