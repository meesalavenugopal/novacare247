import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Clock, IndianRupee, Sparkles, Loader2, Home, Video } from 'lucide-react';
import { servicesAPI, aiAPI, uploadAPI } from '../../services/api';
import ImageUpload from '../../components/admin/ImageUpload';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 500,
    home_available: true,
    video_available: false,
    image: '',
  });
  const [originalImage, setOriginalImage] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAllAdmin();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'duration' || name === 'price' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
      } else {
        await servicesAPI.create(formData);
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      home_available: service.home_available !== false,
      video_available: service.video_available === true,
      image: service.image || '',
    });
    setOriginalImage(service.image || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 500,
      home_available: true,
      video_available: false,
      image: '',
    });
    setOriginalImage('');
  };

  // Cleanup orphaned uploads when cancelling
  const handleCancelModal = async () => {
    if (formData.image && formData.image !== originalImage) {
      try {
        await uploadAPI.deleteFile(formData.image);
      } catch (err) {
        console.error('Failed to cleanup:', err);
      }
    }
    setShowModal(false);
    setEditingService(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingService(null);
    resetForm();
    setShowModal(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert('Please enter service name first');
      return;
    }
    setGeneratingDesc(true);
    try {
      const response = await aiAPI.generateServiceContent({
        service_name: formData.name,
        short_description: formData.description || formData.name
      });
      if (response.data.success && response.data.content) {
        setFormData(prev => ({
          ...prev,
          description: response.data.content.detailed_description || prev.description
        }));
      } else {
        alert('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description');
    } finally {
      setGeneratingDesc(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-600">Manage your clinic's services</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 overflow-hidden">
              {/* Service Image */}
              {service.image && (
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium ${
                    service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-primary-600" />
                    {service.duration} mins
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee size={16} className="text-primary-600" />
                    {service.price}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs mb-4">
                  <span className={`flex items-center gap-1 px-2 py-1 ${service.home_available !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    <Home size={12} /> Home
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-1 ${service.video_available === true ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                    <Video size={12} /> Video
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="btn-outline flex-1 text-sm py-2"
                  >
                    <Edit size={16} className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={handleCancelModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., Manual Therapy"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generatingDesc}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                  >
                    {generatingDesc ? (
                      <><Loader2 size={14} className="animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles size={14} /> Generate with AI</>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                  placeholder="Brief description of the service..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Availability</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="home_available"
                      checked={formData.home_available}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <Home size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Home Visit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="video_available"
                      checked={formData.video_available}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <Video size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Video Call</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Clinic visits are always available</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                  folder="services"
                  placeholder="Upload service image"
                  aspectRatio="landscape"
                  originalValue={originalImage}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCancelModal} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
