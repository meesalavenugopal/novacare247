import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, CheckCircle, XCircle, Clock, FileText, Users, 
  AlertTriangle, ChevronRight, Search, Filter, Eye, 
  Calendar, MapPin, MoreVertical, RefreshCw,
  Phone, Mail, Briefcase, Shield, History, Image, 
  Car, Accessibility, Globe, DollarSign
} from 'lucide-react';
import { clinicOnboardingAPI } from '../../services/api';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  documentation_pending: 'bg-yellow-100 text-yellow-800',
  documentation_approved: 'bg-green-100 text-green-800',
  documentation_rejected: 'bg-red-100 text-red-800',
  site_verification_pending: 'bg-orange-100 text-orange-800',
  site_verification_scheduled: 'bg-purple-100 text-purple-800',
  site_verification_completed: 'bg-indigo-100 text-indigo-800',
  site_verification_passed: 'bg-green-100 text-green-800',
  site_verification_failed: 'bg-red-100 text-red-800',
  contract_pending: 'bg-yellow-100 text-yellow-800',
  contract_signed: 'bg-green-100 text-green-800',
  setup_pending: 'bg-blue-100 text-blue-800',
  setup_completed: 'bg-green-100 text-green-800',
  training_pending: 'bg-orange-100 text-orange-800',
  training_in_progress: 'bg-purple-100 text-purple-800',
  training_completed: 'bg-green-100 text-green-800',
  activation_pending: 'bg-cyan-100 text-cyan-800',
  activated: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  documentation_pending: 'Docs Pending',
  documentation_approved: 'Docs Approved',
  documentation_rejected: 'Docs Rejected',
  site_verification_pending: 'Site Pending',
  site_verification_scheduled: 'Site Scheduled',
  site_verification_completed: 'Site Reviewed',
  site_verification_passed: 'Site Passed',
  site_verification_failed: 'Site Failed',
  contract_pending: 'Contract Pending',
  contract_signed: 'Contract Signed',
  setup_pending: 'Setup Pending',
  setup_completed: 'Setup Done',
  training_pending: 'Training Pending',
  training_in_progress: 'Training Active',
  training_completed: 'Training Done',
  activation_pending: 'Activation Pending',
  activated: 'Activated',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

const AdminClinicOnboarding = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        clinicOnboardingAPI.getDashboardStats(),
        clinicOnboardingAPI.getApplications(filter !== 'all' ? filter : null)
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error loading clinic onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action, data = {}) => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      switch (action) {
        case 'approve_documentation':
          await clinicOnboardingAPI.verifyDocumentation(selectedApplication.id, { approved: true, notes: data.notes });
          alert('Documentation approved! Ready for site verification.');
          break;
        case 'reject_documentation':
          await clinicOnboardingAPI.verifyDocumentation(selectedApplication.id, { approved: false, notes: data.notes });
          alert('Documentation rejected.');
          break;
        case 'schedule_site_verification':
          await clinicOnboardingAPI.scheduleSiteVerification(selectedApplication.id, {
            scheduled_at: data.scheduled_at,
            verification_type: data.verification_type
          });
          alert('Site verification scheduled!');
          break;
        case 'complete_site_verification':
          await clinicOnboardingAPI.completeSiteVerification(selectedApplication.id, {
            score: data.score,
            notes: data.notes,
            passed: data.passed,
            photos: data.photos
          });
          alert(data.passed ? 'Site verification passed!' : 'Site verification failed.');
          break;
        case 'sign_contract':
          await clinicOnboardingAPI.signContract(selectedApplication.id, {
            contract_document_url: data.contract_document_url,
            start_date: data.start_date,
            end_date: data.end_date,
            partnership_tier: data.partnership_tier
          });
          alert('Contract signed!');
          break;
        case 'complete_setup':
          await clinicOnboardingAPI.completeSetup(selectedApplication.id, { notes: data.notes });
          alert('Platform setup completed!');
          break;
        case 'schedule_training':
          await clinicOnboardingAPI.scheduleTraining(selectedApplication.id, {
            scheduled_at: data.scheduled_at,
            attendees: data.attendees
          });
          alert('Training scheduled!');
          break;
        case 'complete_training':
          await clinicOnboardingAPI.completeTraining(selectedApplication.id, {
            score: data.score,
            notes: data.notes
          });
          alert('Training completed!');
          break;
        case 'activate':
          await clinicOnboardingAPI.activateClinic(selectedApplication.id, {
            approved: true,
            notes: data.notes
          });
          alert('Clinic activated and live on platform!');
          break;
        case 'reject':
          await clinicOnboardingAPI.rejectApplication(selectedApplication.id, data.reason);
          alert('Application rejected.');
          break;
        case 'suspend':
          await clinicOnboardingAPI.suspendClinic(selectedApplication.id, data.reason);
          alert('Clinic suspended.');
          break;
        default:
          break;
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Action error:', error);
      alert('Action failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type, app) => {
    setSelectedApplication(app);
    setModalType(type);
    setShowModal(true);
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'submitted':
      case 'documentation_pending':
        return { label: 'Review Documents', action: 'review_documentation', icon: FileText };
      case 'documentation_approved':
      case 'site_verification_pending':
        return { label: 'Schedule Site Visit', action: 'schedule_site_verification', icon: MapPin };
      case 'site_verification_scheduled':
        return { label: 'Complete Verification', action: 'complete_site_verification', icon: CheckCircle };
      case 'site_verification_passed':
      case 'contract_pending':
        return { label: 'Sign Contract', action: 'sign_contract', icon: FileText };
      case 'contract_signed':
      case 'setup_pending':
        return { label: 'Complete Setup', action: 'complete_setup', icon: Shield };
      case 'setup_completed':
      case 'training_pending':
        return { label: 'Schedule Training', action: 'schedule_training', icon: Users };
      case 'training_in_progress':
        return { label: 'Complete Training', action: 'complete_training', icon: CheckCircle };
      case 'training_completed':
      case 'activation_pending':
        return { label: 'Activate Clinic', action: 'activate', icon: Building2 };
      case 'activated':
        return { label: 'View Details', action: 'view', icon: Eye };
      default:
        return null;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Onboarding</h1>
          <p className="text-gray-600">Manage clinic partnership applications</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total"
            value={stats.total_applications}
            icon={Building2}
            color="gray"
            onClick={() => setFilter('all')}
            active={filter === 'all'}
          />
          <StatCard
            label="Docs Pending"
            value={stats.pending_documentation}
            icon={FileText}
            color="yellow"
            onClick={() => setFilter(['submitted', 'documentation_pending'])}
            active={filter === 'submitted,documentation_pending' || (Array.isArray(filter) && filter.includes('submitted'))}
          />
          <StatCard
            label="Site Verification"
            value={stats.pending_site_verification}
            icon={MapPin}
            color="orange"
            onClick={() => setFilter(['documentation_approved', 'site_verification_pending', 'site_verification_scheduled'])}
            active={Array.isArray(filter) && filter.includes('site_verification_pending')}
          />
          <StatCard
            label="Contract"
            value={stats.pending_contract}
            icon={FileText}
            color="purple"
            onClick={() => setFilter(['site_verification_passed', 'contract_pending'])}
            active={Array.isArray(filter) && filter.includes('contract_pending')}
          />
          <StatCard
            label="Setup"
            value={stats.pending_setup}
            icon={Shield}
            color="blue"
            onClick={() => setFilter(['contract_signed', 'setup_pending'])}
            active={Array.isArray(filter) && filter.includes('setup_pending')}
          />
          <StatCard
            label="Training"
            value={stats.pending_training}
            icon={Users}
            color="indigo"
            onClick={() => setFilter(['setup_completed', 'training_pending', 'training_in_progress'])}
            active={Array.isArray(filter) && filter.includes('training_pending')}
          />
          <StatCard
            label="Activation"
            value={stats.pending_activation}
            icon={CheckCircle}
            color="cyan"
            onClick={() => setFilter(['training_completed', 'activation_pending'])}
            active={Array.isArray(filter) && filter.includes('activation_pending')}
          />
          <StatCard
            label="Activated (Month)"
            value={stats.activated_this_month}
            icon={Building2}
            color="green"
            onClick={() => setFilter('activated')}
            active={filter === 'activated'}
          />
          <StatCard
            label="Rejected (Month)"
            value={stats.rejected_this_month}
            icon={XCircle}
            color="red"
            onClick={() => setFilter(['rejected', 'documentation_rejected', 'site_verification_failed'])}
            active={filter === 'rejected'}
          />
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by clinic name, owner, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={Array.isArray(filter) ? filter.join(',') : filter}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(',')) {
              setFilter(val.split(','));
            } else {
              setFilter(val);
            }
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Applications</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="documentation_pending">Docs Pending</option>
          <option value="documentation_approved">Docs Approved</option>
          <option value="documentation_rejected">Docs Rejected</option>
          <option value="site_verification_pending">Site Verification Pending</option>
          <option value="site_verification_scheduled">Site Scheduled</option>
          <option value="site_verification_passed">Site Passed</option>
          <option value="site_verification_failed">Site Failed</option>
          <option value="contract_pending">Contract Pending</option>
          <option value="contract_signed">Contract Signed</option>
          <option value="setup_pending">Setup Pending</option>
          <option value="setup_completed">Setup Completed</option>
          <option value="training_pending">Training Pending</option>
          <option value="training_in_progress">Training In Progress</option>
          <option value="training_completed">Training Completed</option>
          <option value="activation_pending">Activation Pending</option>
          <option value="activated">Activated</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => {
                const nextAction = getNextAction(app.status);
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.clinic_name}</p>
                          <p className="text-sm text-gray-500">{app.owner_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{app.city}</p>
                      <p className="text-sm text-gray-500">{app.state}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        app.partnership_tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                        app.partnership_tier === 'partner' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.partnership_tier}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{app.commission_rate}% commission</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal('view', app)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {nextAction && nextAction.action !== 'view' && (
                          <button
                            onClick={() => openModal(nextAction.action, app)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                          >
                            <nextAction.icon className="w-4 h-4" />
                            {nextAction.label}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApplication && createPortal(
        <ActionModal
          type={modalType}
          application={selectedApplication}
          onClose={() => setShowModal(false)}
          onAction={handleAction}
          loading={actionLoading}
        />,
        document.body
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color, onClick, active }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-left ${
        active ? 'border-primary-500 bg-primary-50' : 'border-transparent bg-white hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </button>
  );
};

// Action Modal Component
const ActionModal = ({ type, application, onClose, onAction, loading }) => {
  const [formData, setFormData] = useState({
    notes: '',
    reason: '',
    scheduled_at: '',
    verification_type: 'virtual',
    score: 80,
    passed: true,
    contract_document_url: '',
    start_date: '',
    end_date: '',
    partnership_tier: application.partnership_tier || 'basic',
    attendees: [''],
  });
  const [activeTab, setActiveTab] = useState('details');

  const handleSubmit = () => {
    switch (type) {
      case 'review_documentation':
        // Show approve/reject buttons
        break;
      case 'schedule_site_verification':
        onAction('schedule_site_verification', {
          scheduled_at: formData.scheduled_at,
          verification_type: formData.verification_type
        });
        break;
      case 'complete_site_verification':
        onAction('complete_site_verification', {
          score: formData.score,
          notes: formData.notes,
          passed: formData.passed
        });
        break;
      case 'sign_contract':
        onAction('sign_contract', {
          contract_document_url: formData.contract_document_url,
          start_date: formData.start_date,
          end_date: formData.end_date,
          partnership_tier: formData.partnership_tier
        });
        break;
      case 'complete_setup':
        onAction('complete_setup', { notes: formData.notes });
        break;
      case 'schedule_training':
        onAction('schedule_training', {
          scheduled_at: formData.scheduled_at,
          attendees: formData.attendees.filter(a => a.trim())
        });
        break;
      case 'complete_training':
        onAction('complete_training', {
          score: formData.score,
          notes: formData.notes
        });
        break;
      case 'activate':
        onAction('activate', { notes: formData.notes });
        break;
      default:
        break;
    }
  };

  const parseJSON = (str) => {
    try {
      return JSON.parse(str || '[]');
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{application.clinic_name}</h2>
            <p className="text-sm text-gray-500">Application #{application.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b flex-shrink-0">
          <div className="flex gap-4">
            {['details', 'documents', 'facility', 'timeline'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  Clinic Information
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Clinic Name" value={application.clinic_name} />
                  <InfoRow label="Business Type" value={application.business_type} />
                  <InfoRow label="Registration #" value={application.registration_number} />
                  <InfoRow label="GST Number" value={application.gst_number} />
                  <InfoRow label="Established" value={application.established_year} />
                  <InfoRow label="Website" value={application.website} link />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Owner" value={application.owner_name} />
                  <InfoRow label="Email" value={application.email} />
                  <InfoRow label="Phone" value={application.phone} />
                  <InfoRow label="Alternate Phone" value={application.alternate_phone} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Location
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Address" value={application.address} />
                  <InfoRow label="City" value={application.city} />
                  <InfoRow label="State" value={application.state} />
                  <InfoRow label="Pincode" value={application.pincode} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  Partnership
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Tier" value={application.partnership_tier} className="capitalize" />
                  <InfoRow label="Commission" value={`${application.commission_rate}%`} />
                  <InfoRow label="Status" value={statusLabels[application.status]} />
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard
                  label="Registration Certificate"
                  url={application.registration_certificate_url}
                  required
                />
                <DocumentCard
                  label="GST Certificate"
                  url={application.gst_certificate_url}
                />
                <DocumentCard
                  label="Owner ID Proof"
                  url={application.owner_id_proof_url}
                  required
                />
                <DocumentCard
                  label="Insurance Certificate"
                  url={application.insurance_certificate_url}
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Facility Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {parseJSON(application.facility_photos_urls).map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Facility ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Facility Tab */}
          {activeTab === 'facility' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{application.total_rooms || '-'}</p>
                  <p className="text-sm text-gray-600">Total Rooms</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{application.treatment_rooms || '-'}</p>
                  <p className="text-sm text-gray-600">Treatment Rooms</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{application.total_physiotherapists || '-'}</p>
                  <p className="text-sm text-gray-600">Physiotherapists</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {application.has_parking && <Car className="w-5 h-5 text-green-600" />}
                    {application.has_wheelchair_access && <Accessibility className="w-5 h-5 text-green-600" />}
                    {!application.has_parking && !application.has_wheelchair_access && <span className="text-gray-400">-</span>}
                  </div>
                  <p className="text-sm text-gray-600">Amenities</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {parseJSON(application.services_offered).map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Equipment Available</h4>
                <div className="flex flex-wrap gap-2">
                  {parseJSON(application.equipment_list).map((equipment, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {equipment}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Operating Hours</h4>
                <p className="text-gray-600">{application.operating_hours || 'Not specified'}</p>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <TimelineItem
                label="Application Submitted"
                date={application.submitted_at}
                completed={!!application.submitted_at}
              />
              <TimelineItem
                label="Documentation Verified"
                date={application.documentation_verified_at}
                notes={application.documentation_notes}
                completed={!!application.documentation_verified_at}
              />
              <TimelineItem
                label="Site Verification"
                date={application.site_verified_at}
                notes={`Score: ${application.site_verification_score || '-'}/100`}
                completed={!!application.site_verified_at}
              />
              <TimelineItem
                label="Contract Signed"
                date={application.contract_signed_at}
                completed={!!application.contract_signed_at}
              />
              <TimelineItem
                label="Setup Completed"
                date={application.setup_completed_at}
                notes={application.setup_notes}
                completed={!!application.setup_completed_at}
              />
              <TimelineItem
                label="Training Completed"
                date={application.training_completed_at}
                notes={`Score: ${application.training_score || '-'}/100`}
                completed={!!application.training_completed_at}
              />
              <TimelineItem
                label="Activated"
                date={application.activated_at}
                notes={application.activation_notes}
                completed={!!application.activated_at}
              />
            </div>
          )}

          {/* Action Forms */}
          {type !== 'view' && (
            <div className="mt-6 pt-6 border-t">
              {type === 'review_documentation' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Review Documentation</h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about the documentation..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => onAction('approve_documentation', { notes: formData.notes })}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve Documents
                    </button>
                    <button
                      onClick={() => onAction('reject_documentation', { notes: formData.notes })}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject Documents
                    </button>
                  </div>
                </div>
              )}

              {type === 'schedule_site_verification' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Schedule Site Verification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification Type</label>
                      <select
                        value={formData.verification_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, verification_type: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="virtual">Virtual (Video Call)</option>
                        <option value="physical">Physical (On-site)</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.scheduled_at}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Verification'}
                  </button>
                </div>
              )}

              {type === 'complete_site_verification' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Complete Site Verification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Score (0-100)</label>
                      <input
                        type="number"
                        value={formData.score}
                        onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
                      <select
                        value={formData.passed}
                        onChange={(e) => setFormData(prev => ({ ...prev, passed: e.target.value === 'true' }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="true">Passed</option>
                        <option value="false">Failed</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Verification notes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Complete Verification'}
                  </button>
                </div>
              )}

              {type === 'sign_contract' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Sign Partnership Contract</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contract Document URL</label>
                    <input
                      type="url"
                      value={formData.contract_document_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, contract_document_url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Tier</label>
                    <select
                      value={formData.partnership_tier}
                      onChange={(e) => setFormData(prev => ({ ...prev, partnership_tier: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="basic">Basic (25% commission)</option>
                      <option value="partner">Partner (20% commission)</option>
                      <option value="premium">Premium (15% commission)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.contract_document_url || !formData.start_date || !formData.end_date}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Signing...' : 'Sign Contract'}
                  </button>
                </div>
              )}

              {type === 'complete_setup' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Complete Platform Setup</h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Setup notes (doctors added, services configured, etc.)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Completing...' : 'Mark Setup Complete'}
                  </button>
                </div>
              )}

              {type === 'schedule_training' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Schedule Staff Training</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                    {formData.attendees.map((attendee, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={attendee}
                          onChange={(e) => {
                            const newAttendees = [...formData.attendees];
                            newAttendees[index] = e.target.value;
                            setFormData(prev => ({ ...prev, attendees: newAttendees }));
                          }}
                          placeholder="Attendee name"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        {index === formData.attendees.length - 1 && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, attendees: [...prev.attendees, ''] }))}
                            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            +
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.scheduled_at}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Training'}
                  </button>
                </div>
              )}

              {type === 'complete_training' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Complete Training</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Training Score (0-100)</label>
                    <input
                      type="number"
                      value={formData.score}
                      onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Training notes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Completing...' : 'Complete Training'}
                  </button>
                </div>
              )}

              {type === 'activate' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Activate Clinic</h3>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      Activating this clinic will create a new branch on the platform and make it visible to patients.
                    </p>
                  </div>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Activation notes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Activating...' : 'Activate Clinic'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value, link, className = '' }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    {link && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
        {value}
      </a>
    ) : (
      <span className={`text-gray-900 ${className}`}>{value || '-'}</span>
    )}
  </div>
);

const DocumentCard = ({ label, url, required }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-gray-900">{label}</span>
      {required && <span className="text-xs text-red-500">Required</span>}
    </div>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary-600 hover:underline"
      >
        <FileText className="w-4 h-4" />
        View Document
      </a>
    ) : (
      <span className="text-gray-400 text-sm">Not uploaded</span>
    )}
  </div>
);

const TimelineItem = ({ label, date, notes, completed }) => (
  <div className="flex items-start gap-4">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      completed ? 'bg-green-100' : 'bg-gray-100'
    }`}>
      {completed ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <Clock className="w-4 h-4 text-gray-400" />
      )}
    </div>
    <div className="flex-1">
      <p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
      {date && <p className="text-sm text-gray-500">{new Date(date).toLocaleString()}</p>}
      {notes && completed && <p className="text-sm text-gray-600 mt-1">{notes}</p>}
    </div>
  </div>
);

export default AdminClinicOnboarding;
