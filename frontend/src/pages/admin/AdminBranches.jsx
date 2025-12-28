import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, X, Building2, Phone, Mail, Clock } from 'lucide-react';
import { branchesAPI } from '../../services/api';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    pincode: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    business_hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
    is_active: true,
    is_headquarters: false
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await branchesAPI.getAllAdmin();
      setBranches(response.data);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await branchesAPI.update(editingBranch.id, formData);
      } else {
        await branchesAPI.create(formData);
      }
      loadBranches();
      closeModal();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Failed to save branch');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await branchesAPI.delete(id);
      loadBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch');
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      country: branch.country,
      state: branch.state,
      city: branch.city,
      address: branch.address || '',
      pincode: branch.pincode || '',
      phone: branch.phone || '',
      email: branch.email || '',
      latitude: branch.latitude || '',
      longitude: branch.longitude || '',
      business_hours: branch.business_hours || '',
      is_active: branch.is_active,
      is_headquarters: branch.is_headquarters
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
      pincode: '',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
      business_hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      is_active: true,
      is_headquarters: false
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600">Manage clinic branch locations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          Add Branch
        </button>
      </div>

      {/* Branches Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="text-primary-600" size={20} />
                <h3 className="font-semibold text-gray-900">{branch.name}</h3>
              </div>
              <div className="flex gap-1">
                {branch.is_headquarters && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">HQ</span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${branch.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {branch.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p className="flex items-center gap-2">
                <MapPin size={14} />
                {branch.city}, {branch.state}, {branch.country}
              </p>
              {branch.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {branch.phone}
                </p>
              )}
              {branch.email && (
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  {branch.email}
                </p>
              )}
              {branch.business_hours && (
                <p className="flex items-center gap-2">
                  <Clock size={14} />
                  {branch.business_hours}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(branch)}
                className="flex-1 flex items-center justify-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(branch.id)}
                className="flex items-center justify-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No branches found. Add your first branch!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={formData.business_hours}
                    onChange={(e) => setFormData({...formData, business_hours: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Mon-Sat: 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_headquarters}
                      onChange={(e) => setFormData({...formData, is_headquarters: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">Headquarters</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingBranch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBranches;
