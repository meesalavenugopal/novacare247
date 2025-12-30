import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Building2, Upload, CheckCircle, AlertCircle, FileText, 
  Mail, Phone, MapPin, Calendar, Users, Clock, Car, 
  Accessibility, Award, ClipboardCheck, ArrowRight,
  ArrowLeft, Loader2, Eye, X, Camera, Stethoscope
} from 'lucide-react';
import { clinicOnboardingAPI, uploadAPI, branchesAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

const ClinicApplicationPage = () => {
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
    // Clinic Information
    clinic_name: '',
    business_type: '',
    registration_number: '',
    gst_number: '',
    established_year: '',
    
    // Contact Information
    owner_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    website: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Facility Details
    total_rooms: '',
    treatment_rooms: '',
    has_parking: false,
    has_wheelchair_access: false,
    operating_hours: '',
    services_offered: [],
    equipment_list: [],
    
    // Staff Information
    total_physiotherapists: '',
    
    // Documents (URLs after upload)
    registration_certificate_url: '',
    gst_certificate_url: '',
    owner_id_proof_url: '',
    facility_photos_urls: [],
    insurance_certificate_url: '',
    
    // Partnership
    partnership_tier: 'basic',
    
    // Agreement
    terms_accepted: false,
    partnership_agreement_accepted: false,
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
      const res = await clinicOnboardingAPI.checkStatus(applicationId, checkEmail);
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

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service]
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment_list: prev.equipment_list.includes(equipment)
        ? prev.equipment_list.filter(e => e !== equipment)
        : [...prev.equipment_list, equipment]
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
      const fileUrl = await uploadAPI.uploadToS3Public(file, 'documents');
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

  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file sizes
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return;
      }
    }

    setLoading(true);
    setError('');
    
    try {
      const uploadPromises = files.map(file => uploadAPI.uploadToS3Public(file, 'documents'));
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        facility_photos_urls: [...prev.facility_photos_urls, ...urls]
      }));
    } catch (err) {
      setError('Failed to upload files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      facility_photos_urls: prev.facility_photos_urls.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.clinic_name && formData.owner_name && formData.email && 
               formData.phone && formData.business_type;
      case 2:
        return formData.address && formData.city && formData.state && formData.pincode;
      case 3:
        return formData.total_rooms && formData.treatment_rooms && 
               formData.services_offered.length > 0;
      case 4:
        return formData.registration_certificate_url && formData.owner_id_proof_url &&
               formData.facility_photos_urls.length >= 3;
      case 5:
        return formData.terms_accepted && formData.partnership_agreement_accepted;
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
    if (!validateStep(5)) {
      setError('Please accept the terms and partnership agreement');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map form data to backend schema
      const applicationPayload = {
        clinic_name: formData.clinic_name,
        business_type: formData.business_type || null,
        registration_number: formData.registration_number || null,
        gst_number: formData.gst_number || null,
        established_year: formData.established_year ? parseInt(formData.established_year) : null,
        owner_name: formData.owner_name,
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternate_phone || null,
        website: formData.website || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        country: "India",
        pincode: formData.pincode || null,
        total_rooms: formData.total_rooms ? parseInt(formData.total_rooms) : null,
        treatment_rooms: formData.treatment_rooms ? parseInt(formData.treatment_rooms) : null,
        has_parking: formData.has_parking,
        has_wheelchair_access: formData.has_wheelchair_access,
        operating_hours: formData.operating_hours || null,
        services_offered: JSON.stringify(formData.services_offered),
        equipment_list: JSON.stringify(formData.equipment_list),
        total_physiotherapists: formData.total_physiotherapists ? parseInt(formData.total_physiotherapists) : 0,
        registration_certificate_url: formData.registration_certificate_url || null,
        gst_certificate_url: formData.gst_certificate_url || null,
        owner_id_proof_url: formData.owner_id_proof_url || null,
        facility_photos_urls: JSON.stringify(formData.facility_photos_urls),
        insurance_certificate_url: formData.insurance_certificate_url || null,
        partnership_tier: formData.partnership_tier,
      };
      
      // Create application
      const createRes = await clinicOnboardingAPI.createApplication(applicationPayload);
      const appId = createRes.data.id;
      
      // Submit application
      await clinicOnboardingAPI.submitApplication(appId);
      
      setApplicationData({ id: appId, email: formData.email, clinic_name: formData.clinic_name });
      setSuccess(true);
    } catch (err) {
      console.error('Application submission error:', err);
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const errorMessages = detail.map(e => 
            `${e.loc ? e.loc.join(' > ') : 'Field'}: ${e.msg}`
          ).join(', ');
          setError(errorMessages);
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Failed to submit application. Please check all fields and try again.');
        }
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited',
    'LLP',
    'Trust',
    'Society',
    'Other'
  ];

  const serviceTypes = [
    'Orthopedic Physiotherapy',
    'Neurological Physiotherapy',
    'Sports Physiotherapy',
    'Pediatric Physiotherapy',
    'Geriatric Physiotherapy',
    'Cardiac Rehabilitation',
    'Post-Surgical Rehabilitation',
    'Pain Management',
    'Manual Therapy',
    'Electrotherapy',
    'Hydrotherapy',
    'Women\'s Health Physiotherapy'
  ];

  const equipmentTypes = [
    'TENS Machine',
    'Ultrasound Therapy',
    'Interferential Therapy (IFT)',
    'Shortwave Diathermy',
    'Laser Therapy',
    'Traction Unit',
    'Exercise Equipment',
    'Parallel Bars',
    'Treatment Tables',
    'Hot/Cold Packs',
    'Resistance Bands',
    'Balance Equipment'
  ];

  const partnershipTiers = [
    { id: 'basic', name: 'Basic', commission: '25%', benefits: ['Standard listing', 'Booking management'] },
    { id: 'partner', name: 'Partner', commission: '20%', benefits: ['Featured listing', 'Priority support', 'Monthly reports'] },
    { id: 'premium', name: 'Premium', commission: '15%', benefits: ['Top listing', 'Dedicated account manager', 'Marketing support', 'Analytics dashboard'] },
  ];

  // Render status check view
  if (statusData) {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      documentation_pending: 'bg-yellow-100 text-yellow-800',
      documentation_approved: 'bg-green-100 text-green-800',
      documentation_rejected: 'bg-red-100 text-red-800',
      site_verification_pending: 'bg-orange-100 text-orange-800',
      site_verification_scheduled: 'bg-purple-100 text-purple-800',
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

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Helmet>
          <title>Clinic Application Status | NovaCare 24/7</title>
        </Helmet>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Clinic Application Status</h1>
              <p className="text-gray-600 mt-2">Application ID: {applicationId}</p>
              <p className="text-gray-600">{statusData.clinic_name}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Current Status</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[statusData.status] || 'bg-gray-100'}`}>
                    {statusData.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                
                {statusData.current_stage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Stage {statusData.current_stage.stage}</p>
                    <p className="font-medium text-gray-900">{statusData.current_stage.name}</p>
                    <p className="text-gray-600">{statusData.current_stage.description}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Partnership Tier</p>
                  <p className="font-medium text-gray-900 capitalize">{statusData.partnership_tier}</p>
                  <p className="text-sm text-gray-600">Commission Rate: {statusData.commission_rate}%</p>
                </div>
              </div>

              <Link 
                to="/apply-clinic"
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
              Thank you for applying to partner with NovaCare 24/7. Our team will review your 
              application and contact you within 5-7 business days.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-blue-900 mb-2">Save Your Application Details</h2>
              <p className="text-blue-800 mb-4">
                You can track your application status using these details:
              </p>
              <div className="bg-white rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600">Clinic Name</p>
                <p className="font-medium text-lg">{applicationData?.clinic_name}</p>
                <p className="text-sm text-gray-600 mt-3">Application ID</p>
                <p className="font-mono font-bold text-lg">{applicationData?.id}</p>
                <p className="text-sm text-gray-600 mt-3">Email</p>
                <p className="font-medium">{applicationData?.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">What Happens Next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Documentation Review</p>
                    <p className="text-sm text-gray-600">Our team will verify your documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Site Verification</p>
                    <p className="text-sm text-gray-600">Virtual or physical inspection of your facility</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contract & Setup</p>
                    <p className="text-sm text-gray-600">Sign partnership agreement and platform setup</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Training & Activation</p>
                    <p className="text-sm text-gray-600">Staff training and go-live!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to={`/apply-clinic?id=${applicationData?.id}&email=${encodeURIComponent(applicationData?.email)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ClipboardCheck className="w-5 h-5" />
                Check Application Status
              </Link>
              <div>
                <Link 
                  to="/"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Return to Homepage
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
    { number: 1, title: 'Clinic Info', icon: Building2 },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Facilities', icon: Stethoscope },
    { number: 4, title: 'Documents', icon: FileText },
    { number: 5, title: 'Partnership', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>Partner Your Clinic | NovaCare 24/7</title>
        <meta name="description" content="Partner your physiotherapy clinic with NovaCare 24/7. Join our network and grow your practice with our booking platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Partner Your Clinic with NovaCare 24/7
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our network of trusted physiotherapy clinics and reach more patients. 
            Complete the form below to start your partnership journey.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              
              return (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary-600 text-white' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                      step > s.number ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Step 1: Clinic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary-600" />
                Clinic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    name="clinic_name"
                    value={formData.clinic_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your clinic name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="number"
                    name="established_year"
                    value={formData.established_year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 2015"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Business registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="GST registration number"
                  />
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-4">Owner/Manager Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner/Manager Name *
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="clinic@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    name="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Landline or alternate mobile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://www.yourclinic.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary-600" />
                Clinic Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Building name, street address, landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select state</option>
                    {statesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={!formData.state}
                  >
                    <option value="">Select city</option>
                    {citiesList.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="500001"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    name="operating_hours"
                    value={formData.operating_hours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Mon-Sat: 9AM-8PM"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Facilities */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-primary-600" />
                Facility Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms *
                  </label>
                  <input
                    type="number"
                    name="total_rooms"
                    value={formData.total_rooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Total number of rooms"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Rooms *
                  </label>
                  <input
                    type="number"
                    name="treatment_rooms"
                    value={formData.treatment_rooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Dedicated treatment rooms"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Physiotherapists
                  </label>
                  <input
                    type="number"
                    name="total_physiotherapists"
                    value={formData.total_physiotherapists}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Staff count"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_parking"
                      checked={formData.has_parking}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="flex items-center gap-1">
                      <Car className="w-4 h-4" /> Parking Available
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_wheelchair_access"
                      checked={formData.has_wheelchair_access}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="flex items-center gap-1">
                      <Accessibility className="w-4 h-4" /> Wheelchair Access
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Offered * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceTypes.map(service => (
                      <label
                        key={service}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.services_offered.includes(service)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services_offered.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Equipment Available (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipmentTypes.map(equipment => (
                      <label
                        key={equipment}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.equipment_list.includes(equipment)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.equipment_list.includes(equipment)}
                          onChange={() => handleEquipmentToggle(equipment)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm">{equipment}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                Required Documents
              </h2>
              
              <p className="text-gray-600">
                Upload the following documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
              </p>

              <div className="space-y-6">
                {/* Registration Certificate */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Registration Certificate *
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.registration_certificate_url ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                        <a 
                          href={formData.registration_certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'registration_certificate_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* GST Certificate */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Registration Certificate
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.gst_certificate_url ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                        <a 
                          href={formData.gst_certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'gst_certificate_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Owner ID Proof */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner/Manager ID Proof *
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.owner_id_proof_url ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                        <a 
                          href={formData.owner_id_proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'owner_id_proof_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Insurance Certificate */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Certificate (if applicable)
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.insurance_certificate_url ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Uploaded</span>
                        <a 
                          href={formData.insurance_certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'insurance_certificate_url')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Facility Photos */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Photos * (Minimum 3 photos: Reception, Treatment Room, Equipment)
                  </label>
                  <div className="space-y-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                      <Camera className="w-5 h-5" />
                      <span>Add Photos</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={handleMultipleFileUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {formData.facility_photos_urls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.facility_photos_urls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Facility ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      {formData.facility_photos_urls.length}/3 minimum photos uploaded
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Partnership & Terms */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary-600" />
                Partnership Tier
              </h2>
              
              <p className="text-gray-600">
                Choose your partnership tier. You can upgrade anytime.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {partnershipTiers.map(tier => (
                  <label
                    key={tier.id}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.partnership_tier === tier.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="partnership_tier"
                      value={tier.id}
                      checked={formData.partnership_tier === tier.id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    {tier.id === 'partner' && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                      <p className="text-2xl font-bold text-primary-600 mt-2">{tier.commission}</p>
                      <p className="text-sm text-gray-500">Commission</p>
                      <ul className="mt-4 space-y-2 text-left">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                ))}
              </div>

              <div className="border-t pt-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-primary-600 hover:underline" target="_blank">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-primary-600 hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                    {' '}*
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="partnership_agreement_accepted"
                    checked={formData.partnership_agreement_accepted}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">
                    I understand and accept the partnership terms including the commission structure 
                    and agree to maintain quality standards as required by NovaCare 24/7 *
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Link 
              to="/apply-clinic/status" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Check your application status
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicApplicationPage;
