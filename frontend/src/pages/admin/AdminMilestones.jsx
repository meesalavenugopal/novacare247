import { useState, useEffect } from 'react';
import { Flag, Plus, Pencil, Trash2, X } from 'lucide-react';
import { milestonesAPI } from '../../services/api';

const AdminMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const response = await milestonesAPI.getAllAdmin();
      setMilestones(response.data);
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        await milestonesAPI.update(editingMilestone.id, formData);
      } else {
        await milestonesAPI.create(formData);
      }
      loadMilestones();
      closeModal();
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Failed to save milestone');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await milestonesAPI.delete(id);
      loadMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('Failed to delete milestone');
    }
  };

  const openEditModal = (milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description || '',
      display_order: milestone.display_order,
      is_active: milestone.is_active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMilestone(null);
    setFormData({
      year: '',
      title: '',
      description: '',
      display_order: 0,
      is_active: true
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
          <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-600">Manage company timeline and achievements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          Add Milestone
        </button>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
          
          {milestones
            .sort((a, b) => parseInt(b.year) - parseInt(a.year))
            .map((milestone, index) => (
            <div key={milestone.id} className="relative flex gap-6 mb-8 last:mb-0">
              {/* Year circle */}
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 flex-shrink-0">
                {milestone.year}
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{milestone.title}</h3>
                    <p className="text-gray-600 mt-1">{milestone.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${milestone.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {milestone.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        Order: {milestone.display_order}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(milestone)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Flag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No milestones found. Add your first milestone!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Major Achievement"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Describe this milestone..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
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
                  {editingMilestone ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMilestones;
