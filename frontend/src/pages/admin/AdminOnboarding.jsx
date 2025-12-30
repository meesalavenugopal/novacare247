import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, CheckCircle, XCircle, Clock, FileText, Video, GraduationCap, 
  UserPlus, AlertTriangle, ChevronRight, Search, Filter, Eye, 
  MessageSquare, Calendar, Star, MoreVertical, RefreshCw, Zap,
  Download, ExternalLink, User, Phone, Mail, MapPin, Briefcase,
  Award, Shield, Building, History, Image
} from 'lucide-react';
import { onboardingAPI, branchesAPI } from '../../services/api';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  verification_pending: 'bg-yellow-100 text-yellow-800',
  verification_approved: 'bg-green-100 text-green-800',
  verification_rejected: 'bg-red-100 text-red-800',
  interview_scheduled: 'bg-purple-100 text-purple-800',
  interview_completed: 'bg-purple-100 text-purple-800',
  interview_passed: 'bg-green-100 text-green-800',
  interview_failed: 'bg-red-100 text-red-800',
  training_pending: 'bg-orange-100 text-orange-800',
  training_in_progress: 'bg-orange-100 text-orange-800',
  training_completed: 'bg-green-100 text-green-800',
  activation_pending: 'bg-indigo-100 text-indigo-800',
  activated: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  verification_pending: 'Verification Pending',
  verification_approved: 'Verified',
  verification_rejected: 'Verification Rejected',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Done',
  interview_passed: 'Interview Passed',
  interview_failed: 'Interview Failed',
  training_pending: 'Training Pending',
  training_in_progress: 'Training In Progress',
  training_completed: 'Training Completed',
  activation_pending: 'Activation Pending',
  activated: 'Activated',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

const AdminOnboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Handle applicationId from URL params (coming from AdminDoctors)
  useEffect(() => {
    const applicationId = searchParams.get('applicationId');
    if (applicationId && applications.length > 0) {
      const app = applications.find(a => a.id === parseInt(applicationId));
      if (app) {
        setSelectedApplication(app);
        // Clear the URL param after selecting
        setSearchParams({});
      } else {
        // If not found in current list, fetch directly
        onboardingAPI.getApplication(applicationId)
          .then(res => {
            setSelectedApplication(res.data);
            setSearchParams({});
          })
          .catch(err => console.error('Failed to load application:', err));
      }
    }
  }, [searchParams, applications]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        onboardingAPI.getDashboardStats(),
        onboardingAPI.getApplications(filter !== 'all' ? filter : null)
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action, data = {}) => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      let response;
      switch (action) {
        case 'ai_verify':
          response = await onboardingAPI.runAIVerification(selectedApplication.id);
          alert(`AI Verification Complete!\nScore: ${response.data.score}/100\n\nFlags: ${response.data.flags.join(', ') || 'None'}\n\nPlease review and approve/reject.`);
          break;
        case 'approve_verification':
          await onboardingAPI.humanVerify(selectedApplication.id, { approved: true, notes: data.notes });
          alert('Verification approved! Ready to schedule interview.');
          break;
        case 'reject_verification':
          await onboardingAPI.humanVerify(selectedApplication.id, { approved: false, notes: data.notes });
          alert('Verification rejected.');
          break;
        case 'generate_questions':
          response = await onboardingAPI.generateInterviewQuestions(selectedApplication.id);
          alert(`Generated ${response.data.questions.length} interview questions!`);
          break;
        case 'schedule_interview':
          await onboardingAPI.scheduleInterview(selectedApplication.id, {
            scheduled_at: data.scheduled_at,
            meeting_link: data.meeting_link
          });
          alert('Interview scheduled!');
          break;
        case 'complete_interview':
          await onboardingAPI.completeInterview(selectedApplication.id, {
            score: data.score,
            notes: data.notes,
            passed: data.passed
          });
          alert(data.passed ? 'Interview passed! Ready for training.' : 'Interview not passed.');
          break;
        case 'start_training':
          await onboardingAPI.startTraining(selectedApplication.id);
          alert('Training started!');
          break;
        case 'complete_training':
          await onboardingAPI.completeTraining(selectedApplication.id, data.score);
          alert('Training completed! Ready for final activation.');
          break;
        case 'activate':
          response = await onboardingAPI.activateDoctor(selectedApplication.id, {
            approved: true,
            notes: data.notes,
            branch_id: data.branch_id
          });
          alert(`Doctor activated!\n\nTemporary Password: ${response.data.temp_password}\n\nPlease share this securely with the doctor.`);
          break;
        case 'reject':
          await onboardingAPI.activateDoctor(selectedApplication.id, {
            approved: false,
            notes: data.notes
          });
          alert('Application rejected.');
          break;
        case 'suspend':
          await onboardingAPI.suspendDoctor(selectedApplication.id, data.reason);
          alert('Doctor suspended.');
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
        return { label: 'Run AI Verification', action: 'ai_verify', icon: Zap };
      case 'verification_pending':
        return { label: 'Review & Approve', action: 'review_verification', icon: CheckCircle };
      case 'verification_approved':
        return { label: 'Schedule Interview', action: 'schedule_interview', icon: Calendar };
      case 'interview_scheduled':
        return { label: 'Complete Interview', action: 'complete_interview', icon: Video };
      case 'interview_passed':
      case 'training_pending':
        return { label: 'Start Training', action: 'start_training', icon: GraduationCap };
      case 'training_in_progress':
        return { label: 'Complete Training', action: 'complete_training', icon: CheckCircle };
      case 'training_completed':
      case 'activation_pending':
        return { label: 'Activate Doctor', action: 'activate', icon: UserPlus };
      case 'activated':
        return { label: 'View Profile', action: 'view', icon: Eye };
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Onboarding</h1>
          <p className="text-gray-500">Manage doctor applications and onboarding workflow</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <StatCard 
            label="Total" 
            value={stats.total_applications} 
            icon={Users}
            color="gray"
            onClick={() => setFilter('all')}
          />
          <StatCard 
            label="Pending Verification" 
            value={stats.pending_verification} 
            icon={FileText}
            color="yellow"
            onClick={() => setFilter(['submitted', 'verification_pending'])}
          />
          <StatCard 
            label="Pending Interview" 
            value={stats.pending_interview} 
            icon={Video}
            color="purple"
            onClick={() => setFilter(['verification_approved', 'interview_scheduled', 'interview_completed'])}
          />
          <StatCard 
            label="Training Pending" 
            value={stats.training_pending} 
            icon={Clock}
            color="orange"
            onClick={() => setFilter('training_pending')}
          />
          <StatCard 
            label="In Training" 
            value={stats.pending_training} 
            icon={GraduationCap}
            color="orange"
            onClick={() => setFilter(['interview_passed', 'training_pending', 'training_in_progress'])}
          />
          <StatCard 
            label="Pending Activation" 
            value={stats.pending_activation} 
            icon={UserPlus}
            color="indigo"
            onClick={() => setFilter(['training_completed', 'activation_pending'])}
          />
          <StatCard 
            label="Activated (Month)" 
            value={stats.activated_this_month} 
            icon={CheckCircle}
            color="green"
            onClick={() => setFilter('activated')}
          />
          <StatCard 
            label="Rejected (Month)" 
            value={stats.rejected_this_month} 
            icon={XCircle}
            color="red"
            onClick={() => setFilter(['rejected', 'verification_rejected', 'interview_failed'])}
          />
        </div>
      )}

      {/* Workflow Overview */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Onboarding Workflow</h2>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {[
            { step: 1, label: 'Application', icon: FileText },
            { step: 2, label: 'AI + Human Verification', icon: CheckCircle },
            { step: 3, label: 'Interview', icon: Video },
            { step: 4, label: 'Training', icon: GraduationCap },
            { step: 5, label: 'Human Activation', icon: UserPlus },
            { step: 6, label: 'Active', icon: Star },
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  idx < 2 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs mt-2 text-center text-gray-600">{item.label}</span>
              </div>
              {idx < 5 && <ChevronRight className="text-gray-300 flex-shrink-0" size={20} />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          <AlertTriangle className="inline w-3 h-3 mr-1" />
          Steps 2 & 5 require human approval for credential verification and final activation
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={Array.isArray(filter) ? 'all' : filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Applications</option>
          <option value="submitted">Submitted</option>
          <option value="verification_pending">Verification Pending</option>
          <option value="verification_approved">Verified</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="interview_passed">Interview Passed</option>
          <option value="training_pending">Training Pending</option>
          <option value="training_in_progress">Training In Progress</option>
          <option value="training_completed">Training Completed</option>
          <option value="activation_pending">Activation Pending</option>
          <option value="activated">Activated</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => {
                const nextAction = getNextAction(app.status);
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {app.profile_image ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={app.profile_image} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {app.full_name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.specialization || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{app.experience_years || 0} years</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[app.status] || 'bg-gray-100'}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {app.ai_verification_score !== null ? (
                        <span className={`font-medium ${
                          app.ai_verification_score >= 70 ? 'text-green-600' : 
                          app.ai_verification_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {app.ai_verification_score}/100
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {nextAction && (
                          <button
                            onClick={() => openModal(nextAction.action, app)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            <nextAction.icon size={14} />
                            {nextAction.label}
                          </button>
                        )}
                        {nextAction?.action !== 'view' && (
                          <button
                            onClick={() => openModal('view', app)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {showModal && (
        <ActionModal
          type={modalType}
          application={selectedApplication}
          onClose={() => setShowModal(false)}
          onAction={handleAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, onClick }) => {
  const colors = {
    gray: 'bg-gray-50 text-gray-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg ${colors[color]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs mt-1 opacity-80">{label}</p>
    </div>
  );
};

const DocumentCard = ({ title, icon: Icon, url, description, type = 'document' }) => {
  if (!url) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <h6 className="font-medium text-gray-400">{title}</h6>
          <p className="text-sm text-gray-400">Not uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-primary-300 transition">
      <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
        {type === 'image' && url ? (
          <img src={url} alt={title} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <Icon size={20} className="text-primary-600" />
        )}
      </div>
      <div className="flex-1">
        <h6 className="font-medium text-gray-900">{title}</h6>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex gap-2">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          title="View in new tab"
        >
          <ExternalLink size={18} />
        </a>
        <a 
          href={url} 
          download
          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          title="Download"
        >
          <Download size={18} />
        </a>
      </div>
    </div>
  );
};

const TimelineItem = ({ title, date, icon: Icon, completed, isLast, details }) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          <Icon size={16} />
        </div>
        {!isLast && (
          <div className={`w-0.5 h-full min-h-[40px] ${completed ? 'bg-green-200' : 'bg-gray-200'}`} />
        )}
      </div>
      <div className="flex-1 pb-4">
        <p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>{title}</p>
        {date && (
          <p className="text-xs text-gray-500">{new Date(date).toLocaleString()}</p>
        )}
        {details && (
          <p className="text-xs text-primary-600 mt-1">{details}</p>
        )}
        {!completed && !date && (
          <p className="text-xs text-gray-400">Pending</p>
        )}
      </div>
    </div>
  );
};

const ActionModal = ({ type, application, onClose, onAction, loading }) => {
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState(70);
  const [passed, setPassed] = useState(true);
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [branchId, setBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (type === 'view' || type === 'activate') {
      branchesAPI.getAll().then(res => setBranches(res.data)).catch(() => {});
    }
  }, [type]);

  const renderContent = () => {
    switch (type) {
      case 'ai_verify':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Run AI-powered verification on this application. The AI will analyze:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>License number format validity</li>
              <li>Qualification recognition</li>
              <li>Experience timeline consistency</li>
              <li>Specialization legitimacy</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              <AlertTriangle className="inline w-4 h-4 mr-1" />
              AI verification is for preliminary screening only. Human approval is required after this step.
            </div>
            <button
              onClick={() => onAction('ai_verify')}
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : <><Zap size={16} /> Run AI Verification</>}
            </button>
          </div>
        );
      
      case 'review_verification':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded p-4">
              <h4 className="font-medium mb-2">AI Verification Results</h4>
              <p className="text-2xl font-bold text-primary-600">
                Score: {application.ai_verification_score}/100
              </p>
              {application.ai_verification_notes && (
                <div className="mt-2 text-sm text-gray-600">
                  {(() => {
                    try {
                      const notes = JSON.parse(application.ai_verification_notes);
                      return (
                        <>
                          {notes.flags?.length > 0 && (
                            <div className="text-red-600">
                              <strong>Flags:</strong> {notes.flags.join(', ')}
                            </div>
                          )}
                          {notes.recommendations?.length > 0 && (
                            <div className="text-yellow-600 mt-1">
                              <strong>Recommendations:</strong> {notes.recommendations.join(', ')}
                            </div>
                          )}
                        </>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>
            <textarea
              placeholder="Verification notes (required for rejection)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-3">
              <button
                onClick={() => onAction('approve_verification', { notes })}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Approve Verification'}
              </button>
              <button
                onClick={() => onAction('reject_verification', { notes })}
                disabled={loading || !notes}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        );
      
      case 'schedule_interview':
        return (
          <div className="space-y-4">
            <button
              onClick={() => onAction('generate_questions')}
              disabled={loading}
              className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2"
            >
              <Zap size={16} /> Generate AI Interview Questions
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (optional)</label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => onAction('schedule_interview', { scheduled_at: scheduledAt, meeting_link: meetingLink })}
              disabled={loading || !scheduledAt}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Schedule Interview'}
            </button>
          </div>
        );
      
      case 'complete_interview':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Notes</label>
              <textarea
                placeholder="Interview feedback and observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={passed}
                  onChange={() => setPassed(true)}
                  className="text-primary-600"
                />
                <span className="text-green-600 font-medium">Passed</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!passed}
                  onChange={() => setPassed(false)}
                  className="text-primary-600"
                />
                <span className="text-red-600 font-medium">Not Passed</span>
              </label>
            </div>
            <button
              onClick={() => onAction('complete_interview', { score, notes, passed })}
              disabled={loading || !notes}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Interview Result'}
            </button>
          </div>
        );
      
      case 'start_training':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Start the training program for this candidate. They will need to complete all mandatory modules.
            </p>
            <button
              onClick={() => onAction('start_training')}
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Start Training'}
            </button>
          </div>
        );
      
      case 'complete_training':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Training Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => onAction('complete_training', { score })}
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Training'}
            </button>
          </div>
        );
      
      case 'activate':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
              <CheckCircle className="inline w-4 h-4 mr-1" />
              This is the final step. Activating will create a doctor profile and user account.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Assignment</label>
              <input
                type="number"
                placeholder="Branch ID (optional)"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <textarea
              placeholder="Activation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-3">
              <button
                onClick={() => onAction('activate', { notes, branch_id: branchId ? parseInt(branchId) : null })}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Activate Doctor'}
              </button>
              <button
                onClick={() => onAction('reject', { notes })}
                disabled={loading || !notes}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        );
      
      case 'view':
        return (
          <div className="flex flex-col h-full">
            {/* Tabs - Fixed */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              {[
                { id: 'details', label: 'Details', icon: User },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'verification', label: 'Verification', icon: Shield },
                { id: 'timeline', label: 'Timeline', icon: History },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto mt-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  {application.profile_image ? (
                    <img 
                      src={application.profile_image} 
                      alt={application.full_name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-2xl font-bold text-primary-600">
                        {application.full_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{application.full_name}</h4>
                    <p className="text-primary-600 font-medium">{application.specialization}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${statusColors[application.status]}`}>
                      {statusLabels[application.status]}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User size={16} /> Personal Information
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{application.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>DOB: {application.date_of_birth || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span>Gender: {application.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={16} /> Address
                  </h5>
                  <p className="text-sm text-gray-600">
                    {application.address && `${application.address}, `}
                    {application.city && `${application.city}, `}
                    {application.state && `${application.state}, `}
                    {application.country || 'India'}
                    {application.pincode && ` - ${application.pincode}`}
                  </p>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase size={16} /> Professional Information
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Specialization:</span>
                      <p className="font-medium">{application.specialization}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Qualification:</span>
                      <p className="font-medium">{application.qualification}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <p className="font-medium">{application.experience_years} years</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Employer:</span>
                      <p className="font-medium">{application.current_employer || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Preferred Branch:</span>
                      <p className="font-medium">
                        {branches.find(b => b.id === application.preferred_branch_id)?.name || `ID: ${application.preferred_branch_id}`}
                      </p>
                    </div>
                    {application.additional_certifications && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Additional Certifications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(() => {
                            try {
                              const certs = JSON.parse(application.additional_certifications);
                              return certs.map((cert, i) => (
                                <span key={i} className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">
                                  {cert}
                                </span>
                              ));
                            } catch {
                              return <span className="text-sm">{application.additional_certifications}</span>;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Award size={16} /> License Information
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">License Number:</span>
                      <p className="font-medium font-mono">{application.license_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Issuing Authority:</span>
                      <p className="font-medium">{application.license_issuing_authority || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expiry Date:</span>
                      <p className="font-medium">{application.license_expiry_date || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Review uploaded documents and credentials before approving.
                </p>
                
                {/* Profile Image */}
                <DocumentCard
                  title="Profile Photo"
                  icon={Image}
                  url={application.profile_image}
                  type="image"
                />

                {/* License Document */}
                <DocumentCard
                  title="Medical License"
                  icon={Award}
                  url={application.license_document_url}
                  description={`License #: ${application.license_number}`}
                />

                {/* Degree Certificate */}
                <DocumentCard
                  title="Degree Certificate"
                  icon={GraduationCap}
                  url={application.degree_certificate_url}
                  description={application.qualification}
                />

                {/* ID Proof */}
                <DocumentCard
                  title="ID Proof"
                  icon={Shield}
                  url={application.id_proof_url}
                />

                {/* Resume */}
                <DocumentCard
                  title="Resume / CV"
                  icon={FileText}
                  url={application.resume_url}
                />

                {!application.license_document_url && !application.degree_certificate_url && 
                 !application.id_proof_url && !application.resume_url && !application.profile_image && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-4">
                {/* AI Verification Results */}
                {application.ai_verification_score !== null && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-500" /> AI Verification Results
                    </h5>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`text-3xl font-bold ${
                        application.ai_verification_score >= 70 ? 'text-green-600' : 
                        application.ai_verification_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {application.ai_verification_score}/100
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              application.ai_verification_score >= 70 ? 'bg-green-500' : 
                              application.ai_verification_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${application.ai_verification_score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {application.ai_verification_notes && (
                      <div className="text-sm space-y-2">
                        {(() => {
                          try {
                            const notes = JSON.parse(application.ai_verification_notes);
                            return (
                              <>
                                {/* Analysis Breakdown */}
                                {notes.analysis && (
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    {Object.entries(notes.analysis).map(([key, value]) => (
                                      <div key={key} className="flex items-center gap-2">
                                        {value ? (
                                          <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                          <XCircle size={14} className="text-red-500" />
                                        )}
                                        <span className="text-gray-600">
                                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* Flags */}
                                {notes.flags?.length > 0 && (
                                  <div className="bg-red-50 border border-red-200 rounded p-2">
                                    <span className="font-medium text-red-700">⚠️ Flags:</span>
                                    <ul className="list-disc list-inside text-red-600 mt-1">
                                      {notes.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                                    </ul>
                                  </div>
                                )}
                                {/* Recommendations */}
                                {notes.recommendations?.length > 0 && (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <span className="font-medium text-yellow-700">📋 Recommendations:</span>
                                    <ul className="list-disc list-inside text-yellow-700 mt-1">
                                      {notes.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                    </ul>
                                  </div>
                                )}
                                {/* Verification Steps */}
                                {notes.verification_steps?.length > 0 && (
                                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                    <span className="font-medium text-blue-700">✅ Verification Steps:</span>
                                    <ol className="list-decimal list-inside text-blue-700 mt-1">
                                      {notes.verification_steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                  </div>
                                )}
                                {/* General Notes */}
                                {notes.notes && (
                                  <div className="bg-gray-100 rounded p-2 text-gray-600 mt-2">
                                    {notes.notes}
                                  </div>
                                )}
                              </>
                            );
                          } catch {
                            return <p className="text-gray-600">{application.ai_verification_notes}</p>;
                          }
                        })()}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Completed: {application.ai_verification_completed_at ? new Date(application.ai_verification_completed_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                )}

                {/* Human Verification */}
                {application.verified_at && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" /> Human Verification
                    </h5>
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Verified By:</span> Admin #{application.verified_by}
                      </p>
                      {application.verification_notes && (
                        <p className="text-gray-600">
                          <span className="font-medium">Notes:</span> {application.verification_notes}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Verified at: {new Date(application.verified_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Interview Results */}
                {application.interview_score !== null && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Video size={16} className="text-purple-500" /> Interview Results
                    </h5>
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Score:</span> 
                        <span className={`ml-1 font-bold ${application.interview_score >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {application.interview_score}/100
                        </span>
                      </p>
                      {application.interview_scheduled_at && (
                        <p className="text-gray-600">
                          <span className="font-medium">Scheduled:</span> {new Date(application.interview_scheduled_at).toLocaleString()}
                        </p>
                      )}
                      {application.interview_meeting_link && (
                        <p className="text-gray-600">
                          <span className="font-medium">Meeting:</span>{' '}
                          <a href={application.interview_meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            Join Link <ExternalLink size={12} className="inline" />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Training Results */}
                {application.training_score !== null && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap size={16} className="text-orange-500" /> Training Results
                    </h5>
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Score:</span>
                        <span className={`ml-1 font-bold ${application.training_score >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {application.training_score}/100
                        </span>
                      </p>
                      {application.training_completed_at && (
                        <p className="text-xs text-gray-400">
                          Completed: {new Date(application.training_completed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!application.ai_verification_score && !application.verified_at && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>Verification not started yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-1">
                <TimelineItem 
                  title="Application Created"
                  date={application.created_at}
                  icon={FileText}
                  completed={true}
                />
                <TimelineItem 
                  title="Application Submitted"
                  date={application.submitted_at}
                  icon={CheckCircle}
                  completed={!!application.submitted_at}
                />
                <TimelineItem 
                  title="AI Verification Completed"
                  date={application.ai_verification_completed_at}
                  icon={Zap}
                  completed={!!application.ai_verification_completed_at}
                  details={application.ai_verification_score ? `Score: ${application.ai_verification_score}/100` : null}
                />
                <TimelineItem 
                  title="Human Verification Approved"
                  date={application.verified_at}
                  icon={Shield}
                  completed={!!application.verified_at}
                  details={application.verification_notes}
                />
                <TimelineItem 
                  title="Interview Scheduled"
                  date={application.interview_scheduled_at}
                  icon={Calendar}
                  completed={!!application.interview_scheduled_at}
                />
                <TimelineItem 
                  title="Interview Completed"
                  date={application.interview_score !== null ? application.interview_scheduled_at : null}
                  icon={Video}
                  completed={application.interview_score !== null}
                  details={application.interview_score ? `Score: ${application.interview_score}/100` : null}
                />
                <TimelineItem 
                  title="Training Completed"
                  date={application.training_completed_at}
                  icon={GraduationCap}
                  completed={!!application.training_completed_at}
                  details={application.training_score ? `Score: ${application.training_score}/100` : null}
                />
                <TimelineItem 
                  title="Doctor Activated"
                  date={application.activated_at}
                  icon={UserPlus}
                  completed={!!application.activated_at}
                  isLast={true}
                  details={application.doctor_id ? `Doctor ID: ${application.doctor_id}` : null}
                />
              </div>
            )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white rounded-lg w-full flex flex-col ${
        type === 'view' ? 'max-w-3xl h-[85vh]' : 'max-w-lg max-h-[90vh]'
      }`}>
        <div className={`p-6 ${type === 'view' ? 'flex flex-col h-full overflow-hidden' : ''}`}>
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold">
              {type === 'view' ? 'Application Details' : `${application?.full_name}`}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle size={20} />
            </button>
          </div>
          <div className={type === 'view' ? 'flex-1 overflow-hidden' : ''}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminOnboarding;
