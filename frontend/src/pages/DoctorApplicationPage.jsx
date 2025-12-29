import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  UserPlus, Upload, CheckCircle, AlertCircle, FileText, 
  GraduationCap, Building2, Mail, Phone, MapPin, Calendar,
  Stethoscope, Award, BookOpen, ClipboardCheck, ArrowRight,
  ArrowLeft, Loader2, Eye, X
} from 'lucide-react';
import { onboardingAPI, uploadAPI, branchesAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

const DoctorApplicationPage = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id');
  const checkEmail = searchParams.get('email');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Information
    specialization: '',
    qualification: '',
    experience_years: '',
    medical_council_registration_number: '',
    registration_state: '',
    registration_year: '',
    
    // Current/Previous Employment
    current_hospital: '',
    current_designation: '',
    previous_experience: '',
    
    // Documents (URLs after upload)
    medical_license_url: '',
    degree_certificate_url: '',
    photo_url: '',
    id_proof_url: '',
    address_proof_url: '',
    
    // Additional Information
    bio: '',
    languages_spoken: '',
    available_days: [],
    preferred_branch: '',
    
    // Agreement
    terms_accepted: false,
    background_check_consent: false,
  });

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await branchesAPI.getStates('India');
        setStatesList(res.data || []);
      } catch (err) {
        console.error('Failed to load states:', err);
      }
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.state) {
        try {
          const res = await branchesAPI.getCities('India', formData.state);
          setCitiesList(res.data || []);
        } catch (err) {
          console.error('Failed to load cities:', err);
        }
      } else {
        setCitiesList([]);
      }
    };
    loadCities();
  }, [formData.state]);

  // Check application status if ID and email provided
  useEffect(() => {
    if (applicationId && checkEmail) {
      checkApplicationStatus();
    }
  }, [applicationId, checkEmail]);

  const checkApplicationStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await onboardingAPI.checkStatus(applicationId, checkEmail);
      setStatusData(res.data);
    } catch (err) {
      setError('Could not find application. Please check your application ID and email.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const fileUrl = await uploadAPI.uploadToS3(file, 'onboarding');
      setFormData(prev => ({
        ...prev,
        [field]: fileUrl
      }));
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.first_name && formData.last_name && formData.email && 
               formData.phone && formData.date_of_birth && formData.gender;
      case 2:
        return formData.specialization && formData.qualification && 
               formData.experience_years && formData.medical_council_registration_number;
      case 3:
        return formData.medical_license_url && formData.degree_certificate_url && formData.photo_url;
      case 4:
        return formData.terms_accepted && formData.background_check_consent;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError('Please accept the terms and consent to background check');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create application
      const createRes = await onboardingAPI.createApplication({
        ...formData,
        languages_spoken: formData.languages_spoken.split(',').map(l => l.trim()),
        experience_years: parseInt(formData.experience_years),
        registration_year: formData.registration_year ? parseInt(formData.registration_year) : null,
      });
      
      const appId = createRes.data.id;
      
      // Submit application
      await onboardingAPI.submitApplication(appId);
      
      setApplicationData({ id: appId, email: formData.email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'General Physician',
    'Physiotherapy',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Dermatology',
    'Pediatrics',
    'Gynecology',
    'ENT',
    'Ophthalmology',
    'Psychiatry',
    'General Surgery',
    'Other'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Render status check view
  if (statusData) {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      ai_verified: 'bg-purple-100 text-purple-800',
      verification_approved: 'bg-green-100 text-green-800',
      verification_rejected: 'bg-red-100 text-red-800',
      interview_scheduled: 'bg-yellow-100 text-yellow-800',
      interview_completed: 'bg-indigo-100 text-indigo-800',
      training_in_progress: 'bg-orange-100 text-orange-800',
      training_completed: 'bg-teal-100 text-teal-800',
      pending_activation: 'bg-cyan-100 text-cyan-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Helmet>
          <title>Application Status | NovaCare 24/7</title>
        </Helmet>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
              <p className="text-gray-600 mt-2">Application ID: {applicationId}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Current Status</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[statusData.status] || 'bg-gray-100'}`}>
                    {statusData.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                
                {statusData.message && (
                  <p className="text-gray-700">{statusData.message}</p>
                )}

                {statusData.next_steps && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                    <p className="text-blue-800">{statusData.next_steps}</p>
                  </div>
                )}

                {statusData.interview_date && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Interview Scheduled</h3>
                    <p className="text-yellow-800">
                      {new Date(statusData.interview_date).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <Link 
                to="/apply-doctor"
                className="block text-center text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Application Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render success view
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Helmet>
          <title>Application Submitted | NovaCare 24/7</title>
        </Helmet>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for applying to join NovaCare 24/7. Our team will review your application 
              and get back to you within 3-5 business days.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-blue-900 mb-2">Save Your Application Details</h2>
              <p className="text-blue-800 mb-4">
                You can track your application status using these details:
              </p>
              <div className="bg-white rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600">Application ID</p>
                <p className="font-mono font-bold text-lg">{applicationData?.id}</p>
                <p className="text-sm text-gray-600 mt-3">Email</p>
                <p className="font-medium">{applicationData?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to={`/apply-doctor?id=${applicationData?.id}&email=${encodeURIComponent(applicationData?.email)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Check Application Status
              </Link>
              
              <div>
                <Link 
                  to="/"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Progress steps
  const steps = [
    { number: 1, label: 'Personal Info', icon: UserPlus },
    { number: 2, label: 'Professional', icon: Stethoscope },
    { number: 3, label: 'Documents', icon: FileText },
    { number: 4, label: 'Review', icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>Apply as Doctor | NovaCare 24/7</title>
        <meta name="description" content="Join NovaCare 24/7 as a healthcare professional. Apply now and become part of our growing team of expert doctors." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Our Medical Team</h1>
          <p className="text-gray-600 mt-2">
            Apply to become a part of NovaCare 24/7's network of healthcare professionals
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max sm:min-w-0">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center gap-2 sm:gap-3 ${s.number <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.number < step ? 'bg-green-500 text-white' :
                    s.number === step ? 'bg-primary-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {s.number < step ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="hidden md:block font-medium text-sm whitespace-nowrap">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-6 sm:w-12 md:w-20 h-1 mx-1 sm:mx-2 md:mx-4 rounded flex-shrink-0 ${
                    s.number < step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="doctor@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, city: '' }));
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {statesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.state}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                    {citiesList.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="XXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-primary-600" />
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., MBBS, MD, BPT, MPT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Council Registration No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="medical_council_registration_number"
                    value={formData.medical_council_registration_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration State
                  </label>
                  <input
                    type="text"
                    name="registration_state"
                    value={formData.registration_state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="State of registration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Year
                  </label>
                  <input
                    type="number"
                    name="registration_year"
                    value={formData.registration_year}
                    onChange={handleInputChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Year of registration"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Current/Previous Employment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Hospital/Clinic
                    </label>
                    <input
                      type="text"
                      name="current_hospital"
                      value={formData.current_hospital}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Hospital/Clinic name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Designation
                    </label>
                    <input
                      type="text"
                      name="current_designation"
                      value={formData.current_designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your designation"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Experience
                  </label>
                  <textarea
                    name="previous_experience"
                    value={formData.previous_experience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Briefly describe your previous work experience..."
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Additional Details</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    name="languages_spoken"
                    value={formData.languages_spoken}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., English, Hindi, Telugu (comma-separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.available_days.includes(day)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                Upload Documents
              </h2>
              
              <p className="text-gray-600">
                Please upload clear, legible copies of your documents. Supported formats: PDF, JPG, PNG (Max 5MB each)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical License */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <Award className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900 mb-1">
                      Medical License <span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Medical Council Registration Certificate</p>
                    
                    {formData.medical_license_url ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'medical_license_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Degree Certificate */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <GraduationCap className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900 mb-1">
                      Degree Certificate <span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">MBBS/MD/BPT/MPT Certificate</p>
                    
                    {formData.degree_certificate_url ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'degree_certificate_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Photo */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <UserPlus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900 mb-1">
                      Professional Photo <span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Passport size photograph</p>
                    
                    {formData.photo_url ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload
                        </span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'photo_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* ID Proof */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900 mb-1">ID Proof</p>
                    <p className="text-sm text-gray-500 mb-4">Aadhaar/PAN/Passport</p>
                    
                    {formData.id_proof_url ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'id_proof_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about yourself, your expertise, and why you want to join NovaCare 24/7..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-primary-600" />
                Review Your Application
              </h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {formData.first_name} {formData.last_name}</p>
                    <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                    <p><span className="text-gray-500">DOB:</span> {formData.date_of_birth}</p>
                    <p><span className="text-gray-500">Location:</span> {formData.city}, {formData.state}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary-600" />
                    Professional Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Specialization:</span> {formData.specialization}</p>
                    <p><span className="text-gray-500">Qualification:</span> {formData.qualification}</p>
                    <p><span className="text-gray-500">Experience:</span> {formData.experience_years} years</p>
                    <p><span className="text-gray-500">Reg. No:</span> {formData.medical_council_registration_number}</p>
                    <p><span className="text-gray-500">Current Hospital:</span> {formData.current_hospital || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-lg ${formData.medical_license_url ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <CheckCircle className="w-5 h-5 mb-1" />
                      <p className="text-sm font-medium">Medical License</p>
                    </div>
                    <div className={`p-3 rounded-lg ${formData.degree_certificate_url ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <CheckCircle className="w-5 h-5 mb-1" />
                      <p className="text-sm font-medium">Degree Certificate</p>
                    </div>
                    <div className={`p-3 rounded-lg ${formData.photo_url ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <CheckCircle className="w-5 h-5 mb-1" />
                      <p className="text-sm font-medium">Photo</p>
                    </div>
                    <div className={`p-3 rounded-lg ${formData.id_proof_url ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      <CheckCircle className="w-5 h-5 mb-1" />
                      <p className="text-sm font-medium">ID Proof</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Consent */}
              <div className="border-t pt-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that all the information provided is accurate and complete. I agree to the{' '}
                    <Link to="/terms-of-service" className="text-primary-600 hover:underline" target="_blank">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary-600 hover:underline" target="_blank">
                      Privacy Policy
                    </Link>.
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="background_check_consent"
                    checked={formData.background_check_consent}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to a background verification check, including verification of my medical credentials, 
                    professional history, and identity documents. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.terms_accepted || !formData.background_check_consent}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Check Status Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already applied?{' '}
            <button 
              onClick={() => {
                const id = prompt('Enter your Application ID:');
                const email = prompt('Enter your Email:');
                if (id && email) {
                  window.location.href = `/apply-doctor?id=${id}&email=${encodeURIComponent(email)}`;
                }
              }}
              className="text-primary-600 hover:underline font-medium"
            >
              Check Application Status
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorApplicationPage;
