import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, User, Mail, Phone, Award, Clock, Sparkles, Loader2, DollarSign, MapPin, Video, Home, Building } from 'lucide-react';
import { doctorsAPI, aiAPI } from '../../services/api';

const CONSULTATION_TYPES = ['clinic', 'home', 'video'];
const COUNTRIES = [
  { code: 'India', currency: 'INR', symbol: '₹' },
  { code: 'USA', currency: 'USD', symbol: '$' },
];

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [generatingBio, setGeneratingBio] = useState(false);
  
  // Fee Management State
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorFees, setDoctorFees] = useState([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
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
    });
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
    });
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
                        <div className="w-10 h-10 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                          {doctor.user?.full_name?.charAt(0) || 'D'}
                        </div>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleManageFees(doctor)}
                          className="p-2 text-green-600 hover:bg-green-50"
                          title="Manage Fees"
                        >
                          <DollarSign size={18} />
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
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
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

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
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
    </div>
  );
};

export default AdminDoctors;
