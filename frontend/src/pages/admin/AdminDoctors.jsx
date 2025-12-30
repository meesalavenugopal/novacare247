import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, User, Mail, Phone, Award, Clock, Sparkles, Loader2, DollarSign, MapPin, Video, Home, Building, IndianRupee, CalendarDays, ToggleLeft, ToggleRight } from 'lucide-react';
import { doctorsAPI, aiAPI, uploadAPI } from '../../services/api';
import ImageUpload from '../../components/admin/ImageUpload';

const CONSULTATION_TYPES = ['clinic', 'home', 'video'];
const COUNTRIES = [
  { code: 'India', currency: 'INR', symbol: '₹' },
  { code: 'USA', currency: 'USD', symbol: '$' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
];

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [originalProfileImage, setOriginalProfileImage] = useState(''); // Track original image for cleanup
  
  // Fee Management State
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorFees, setDoctorFees] = useState([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  
  // Slot Management State
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotFormData, setSlotFormData] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30,
  });
  
  const [feeFormData, setFeeFormData] = useState({
    consultation_type: 'clinic',
    country: 'India',
    fee: 500,
    currency: 'INR',
    is_available: true,
  });
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    qualification: '',
    experience_years: 0,
    bio: '',
    consultation_fee: 500,
    profile_image: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await doctorsAPI.getAllAdmin();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorFees = async (doctorId) => {
    setLoadingFees(true);
    try {
      const response = await doctorsAPI.getFees(doctorId);
      setDoctorFees(response.data);
    } catch (error) {
      console.error('Error loading fees:', error);
      setDoctorFees([]);
    } finally {
      setLoadingFees(false);
    }
  };

  const loadDoctorSlots = async (doctorId) => {
    setLoadingSlots(true);
    try {
      const response = await doctorsAPI.getSlots(doctorId);
      setDoctorSlots(response.data);
    } catch (error) {
      console.error('Error loading slots:', error);
      setDoctorSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotInputChange = (e) => {
    const { name, value } = e.target;
    setSlotFormData(prev => ({
      ...prev,
      [name]: name === 'day_of_week' || name === 'slot_duration' ? parseInt(value) : value
    }));
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await doctorsAPI.updateSlot(editingSlot.id, slotFormData);
      } else {
        await doctorsAPI.createSlot(selectedDoctor.id, slotFormData);
      }
      await loadDoctorSlots(selectedDoctor.id);
      resetSlotForm();
    } catch (error) {
      console.error('Error saving slot:', error);
      alert(error.response?.data?.detail || 'Failed to save slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      await doctorsAPI.deleteSlot(slotId);
      await loadDoctorSlots(selectedDoctor.id);
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Failed to delete slot');
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setSlotFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      slot_duration: slot.slot_duration,
    });
  };

  const handleManageSlots = (doctor) => {
    setSelectedDoctor(doctor);
    setShowSlotModal(true);
    loadDoctorSlots(doctor.id);
    resetSlotForm();
  };

  const resetSlotForm = () => {
    setEditingSlot(null);
    setSlotFormData({
      day_of_week: 0,
      start_time: '09:00',
      end_time: '17:00',
      slot_duration: 30,
    });
  };

  const handleToggleAvailability = async (doctor) => {
    try {
      await doctorsAPI.update(doctor.id, {
        is_available: !doctor.is_available,
      });
      loadDoctors();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  const getDayLabel = (dayNum) => {
    return DAYS_OF_WEEK.find(d => d.value === dayNum)?.label || 'Unknown';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'consultation_fee' ? parseInt(value) || 0 : value
    }));
  };

  const handleFeeInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'country') {
      const country = COUNTRIES.find(c => c.code === value);
      setFeeFormData(prev => ({
        ...prev,
        country: value,
        currency: country?.currency || 'INR',
      }));
    } else {
      setFeeFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (name === 'fee' ? parseInt(value) || 0 : value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor.id, {
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience_years: formData.experience_years,
          bio: formData.bio,
          consultation_fee: formData.consultation_fee,
          profile_image: formData.profile_image,
        });
      } else {
        await doctorsAPI.create(formData);
      }
      setShowModal(false);
      setEditingDoctor(null);
      resetForm();
      loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert(error.response?.data?.detail || 'Failed to save doctor');
    }
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFee) {
        await doctorsAPI.updateFee(editingFee.id, {
          ...feeFormData,
          doctor_id: selectedDoctor.id,
        });
      } else {
        await doctorsAPI.createFee(selectedDoctor.id, {
          ...feeFormData,
          doctor_id: selectedDoctor.id,
        });
      }
      await loadDoctorFees(selectedDoctor.id);
      resetFeeForm();
    } catch (error) {
      console.error('Error saving fee:', error);
      alert(error.response?.data?.detail || 'Failed to save fee');
    }
  };

  const handleDeleteFee = async (feeId) => {
    if (!confirm('Are you sure you want to delete this fee?')) return;
    try {
      await doctorsAPI.deleteFee(feeId);
      await loadDoctorFees(selectedDoctor.id);
    } catch (error) {
      console.error('Error deleting fee:', error);
      alert('Failed to delete fee');
    }
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setFeeFormData({
      consultation_type: fee.consultation_type,
      country: fee.country,
      fee: fee.fee,
      currency: fee.currency,
      is_available: fee.is_available,
    });
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      full_name: doctor.user?.full_name || '',
      email: doctor.user?.email || '',
      phone: doctor.user?.phone || '',
      password: '',
      specialization: doctor.specialization,
      qualification: doctor.qualification || '',
      experience_years: doctor.experience_years,
      bio: doctor.bio || '',
      consultation_fee: doctor.consultation_fee,
      profile_image: doctor.profile_image || '',
    });
    setOriginalProfileImage(doctor.profile_image || ''); // Track original for cleanup
    setShowModal(true);
  };

  const handleManageFees = (doctor) => {
    setSelectedDoctor(doctor);
    setShowFeeModal(true);
    loadDoctorFees(doctor.id);
    resetFeeForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorsAPI.delete(id);
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      qualification: '',
      experience_years: 0,
      bio: '',
      consultation_fee: 500,
      profile_image: '',
    });
    setOriginalProfileImage('');
  };

  // Cleanup orphaned uploads when cancelling
  const handleCancelModal = async () => {
    // If a new image was uploaded but not saved, delete it from S3
    if (formData.profile_image && formData.profile_image !== originalProfileImage) {
      try {
        await uploadAPI.deleteFile(formData.profile_image);
        console.log('Cleaned up orphaned upload');
      } catch (err) {
        console.error('Failed to cleanup:', err);
      }
    }
    setShowModal(false);
    setEditingDoctor(null);
    resetForm();
  };

  const resetFeeForm = () => {
    setEditingFee(null);
    setFeeFormData({
      consultation_type: 'clinic',
      country: 'India',
      fee: 500,
      currency: 'INR',
      is_available: true,
    });
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    resetForm();
    setShowModal(true);
  };

  const handleGenerateBio = async () => {
    if (!formData.full_name || !formData.specialization) {
      alert('Please enter name and specialization first');
      return;
    }
    setGeneratingBio(true);
    try {
      const response = await aiAPI.generateDoctorContent({
        name: formData.full_name,
        specialization: formData.specialization,
        experience_years: formData.experience_years || 5,
        qualification: formData.qualification || formData.specialization
      });
      if (response.data.success && response.data.content) {
        setFormData(prev => ({
          ...prev,
          bio: response.data.content.bio || prev.bio
        }));
      } else {
        alert('Failed to generate bio. Please try again.');
      }
    } catch (error) {
      console.error('Error generating bio:', error);
      alert('Failed to generate bio');
    } finally {
      setGeneratingBio(false);
    }
  };

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'clinic': return <Building size={16} className="text-blue-500" />;
      case 'home': return <Home size={16} className="text-green-500" />;
      case 'video': return <Video size={16} className="text-purple-500" />;
      default: return <DollarSign size={16} />;
    }
  };

  const getCurrencySymbol = (currency) => {
    return COUNTRIES.find(c => c.currency === currency)?.symbol || currency;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-gray-600">Manage your clinic's doctors</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      {/* Doctors Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Specialization</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Base Fee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {doctor.profile_image ? (
                          <img 
                            src={doctor.profile_image} 
                            alt={doctor.user?.full_name} 
                            className="w-10 h-10 object-cover rounded-full border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold rounded-full">
                            {doctor.user?.full_name?.charAt(0) || 'D'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{doctor.user?.full_name}</p>
                          <p className="text-sm text-gray-500">{doctor.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doctor.specialization}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.experience_years} years</td>
                    <td className="px-6 py-4 text-gray-600">₹{doctor.consultation_fee}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium ${
                        doctor.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => window.open(`/doctors/${doctor.slug}`, '_blank')}
                          className="p-2 text-primary-600 hover:bg-primary-50"
                          title="View Profile"
                        >
                          <User size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(doctor)}
                          className={`p-2 ${doctor.is_available ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={doctor.is_available ? 'Set Offline' : 'Set Online'}
                        >
                          {doctor.is_available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => handleManageSlots(doctor)}
                          className="p-2 text-blue-600 hover:bg-blue-50"
                          title="Manage Slots"
                        >
                          <CalendarDays size={18} />
                        </button>
                        <button
                          onClick={() => handleManageFees(doctor)}
                          className="p-2 text-green-600 hover:bg-green-50"
                          title="Manage Consultation Fees"
                        >
                          <IndianRupee size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="p-2 text-gray-600 hover:bg-gray-100"
                          title="Edit Doctor"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="p-2 text-red-600 hover:bg-red-50"
                          title="Delete Doctor"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={handleCancelModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingDoctor && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          className="input-field pl-10"
                          placeholder="Dr. John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input-field pl-10"
                          placeholder="doctor@clinic.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Create password"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="e.g., Orthopedic Physiotherapy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., BPT, MPT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <button
                    type="button"
                    onClick={handleGenerateBio}
                    disabled={generatingBio}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                  >
                    {generatingBio ? (
                      <><Loader2 size={14} className="animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles size={14} /> Generate with AI</>
                    )}
                  </button>
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                  placeholder="Brief description about the doctor..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <ImageUpload
                  value={formData.profile_image}
                  onChange={(url) => setFormData({...formData, profile_image: url})}
                  folder="doctors"
                  placeholder="Upload doctor photo"
                  aspectRatio="square"
                  originalValue={originalProfileImage}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCancelModal} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Management Modal */}
      {showFeeModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Manage Consultation Fees
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedDoctor.user?.full_name} - {selectedDoctor.specialization}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowFeeModal(false);
                  setSelectedDoctor(null);
                  resetFeeForm();
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Add/Edit Fee Form */}
              <form onSubmit={handleFeeSubmit} className="bg-gray-50 p-4 mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">
                  {editingFee ? 'Edit Fee' : 'Add New Fee'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="consultation_type"
                      value={feeFormData.consultation_type}
                      onChange={handleFeeInputChange}
                      className="input-field"
                    >
                      {CONSULTATION_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      name="country"
                      value={feeFormData.country}
                      onChange={handleFeeInputChange}
                      className="input-field"
                    >
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.code} ({country.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee ({getCurrencySymbol(feeFormData.currency)})
                    </label>
                    <input
                      type="number"
                      name="fee"
                      value={feeFormData.fee}
                      onChange={handleFeeInputChange}
                      min="0"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                    <div className="flex items-center h-10">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_available"
                          checked={feeFormData.is_available}
                          onChange={handleFeeInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-700">
                          {feeFormData.is_available ? 'Yes' : 'No'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-primary">
                    {editingFee ? 'Update Fee' : 'Add Fee'}
                  </button>
                  {editingFee && (
                    <button type="button" onClick={resetFeeForm} className="btn-outline">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Fees Table */}
              <div className="border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fee</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loadingFees ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                    ) : doctorFees.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No consultation fees configured. Add one above.
                        </td>
                      </tr>
                    ) : (
                      doctorFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getConsultationIcon(fee.consultation_type)}
                              <span className="capitalize">{fee.consultation_type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span>{fee.country}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {getCurrencySymbol(fee.currency)}{fee.fee}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium ${
                              fee.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {fee.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditFee(fee)}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                                title="Edit Fee"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteFee(fee.id)}
                                className="p-1 text-red-600 hover:bg-red-50"
                                title="Delete Fee"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Quick Setup Buttons */}
              {doctorFees.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-3">
                    <strong>Quick Setup:</strong> Add all fee types for a country at once
                  </p>
                  <div className="flex gap-2">
                    {COUNTRIES.map(country => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={async () => {
                          const baseFee = country.code === 'India' ? 500 : 50;
                          const fees = [
                            { type: 'clinic', fee: baseFee },
                            { type: 'home', fee: Math.round(baseFee * 1.5) },
                            { type: 'video', fee: Math.round(baseFee * 0.8) },
                          ];
                          for (const f of fees) {
                            try {
                              await doctorsAPI.createFee(selectedDoctor.id, {
                                doctor_id: selectedDoctor.id,
                                consultation_type: f.type,
                                country: country.code,
                                fee: f.fee,
                                currency: country.currency,
                                is_available: true,
                              });
                            } catch (err) {
                              console.error('Error creating fee:', err);
                            }
                          }
                          await loadDoctorFees(selectedDoctor.id);
                        }}
                        className="btn-outline text-sm"
                      >
                        Setup {country.code} Fees
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slot Management Modal */}
      {showSlotModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Manage Availability Slots
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedDoctor.user?.full_name} - {selectedDoctor.specialization}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowSlotModal(false);
                  setSelectedDoctor(null);
                  resetSlotForm();
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Add/Edit Slot Form */}
              <form onSubmit={handleSlotSubmit} className="bg-gray-50 p-4 mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">
                  {editingSlot ? 'Edit Slot' : 'Add New Slot'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select
                      name="day_of_week"
                      value={slotFormData.day_of_week}
                      onChange={handleSlotInputChange}
                      className="input-field"
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={slotFormData.start_time}
                      onChange={handleSlotInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={slotFormData.end_time}
                      onChange={handleSlotInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <select
                      name="slot_duration"
                      value={slotFormData.slot_duration}
                      onChange={handleSlotInputChange}
                      className="input-field"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-primary">
                    {editingSlot ? 'Update Slot' : 'Add Slot'}
                  </button>
                  {editingSlot && (
                    <button type="button" onClick={resetSlotForm} className="btn-outline">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Slots Table */}
              <div className="border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">End Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loadingSlots ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                    ) : doctorSlots.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No slots configured. Add one above.
                        </td>
                      </tr>
                    ) : (
                      doctorSlots.sort((a, b) => a.day_of_week - b.day_of_week).map((slot) => (
                        <tr key={slot.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-blue-500" />
                              <span className="font-medium">{getDayLabel(slot.day_of_week)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-400" />
                              <span>{slot.start_time}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-400" />
                              <span>{slot.end_time}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {slot.slot_duration} mins
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditSlot(slot)}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                                title="Edit Slot"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="p-1 text-red-600 hover:bg-red-50"
                                title="Delete Slot"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Quick Setup Buttons */}
              {doctorSlots.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-3">
                    <strong>Quick Setup:</strong> Add standard working hours for weekdays
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={async () => {
                        // Add Mon-Fri 9am-5pm
                        for (let day = 0; day <= 4; day++) {
                          try {
                            await doctorsAPI.createSlot(selectedDoctor.id, {
                              day_of_week: day,
                              start_time: '09:00',
                              end_time: '17:00',
                              slot_duration: 30,
                            });
                          } catch (err) {
                            console.error('Error creating slot:', err);
                          }
                        }
                        await loadDoctorSlots(selectedDoctor.id);
                      }}
                      className="btn-outline text-sm"
                    >
                      Mon-Fri (9 AM - 5 PM)
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        // Add Mon-Sat 9am-6pm
                        for (let day = 0; day <= 5; day++) {
                          try {
                            await doctorsAPI.createSlot(selectedDoctor.id, {
                              day_of_week: day,
                              start_time: '09:00',
                              end_time: '18:00',
                              slot_duration: 30,
                            });
                          } catch (err) {
                            console.error('Error creating slot:', err);
                          }
                        }
                        await loadDoctorSlots(selectedDoctor.id);
                      }}
                      className="btn-outline text-sm"
                    >
                      Mon-Sat (9 AM - 6 PM)
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        // Add all 7 days
                        for (let day = 0; day <= 6; day++) {
                          try {
                            await doctorsAPI.createSlot(selectedDoctor.id, {
                              day_of_week: day,
                              start_time: '10:00',
                              end_time: '20:00',
                              slot_duration: 30,
                            });
                          } catch (err) {
                            console.error('Error creating slot:', err);
                          }
                        }
                        await loadDoctorSlots(selectedDoctor.id);
                      }}
                      className="btn-outline text-sm"
                    >
                      All Week (10 AM - 8 PM)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
