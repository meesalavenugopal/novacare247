import { useState, useEffect } from 'react';
import { BarChart3, Plus, Pencil, Trash2, X, Users, Calendar, Award, Heart, Star, Clock } from 'lucide-react';
import { statsAPI } from '../../services/api';

const iconOptions = [
  { value: 'users', label: 'Users', Icon: Users },
  { value: 'calendar', label: 'Calendar', Icon: Calendar },
  { value: 'award', label: 'Award', Icon: Award },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'star', label: 'Star', Icon: Star },
  { value: 'clock', label: 'Clock', Icon: Clock },
  { value: 'chart', label: 'Chart', Icon: BarChart3 },
];

const getIconComponent = (iconName) => {
  const iconOption = iconOptions.find(opt => opt.value === iconName);
  return iconOption ? iconOption.Icon : BarChart3;
};

const AdminStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    description: '',
    icon: 'users',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await statsAPI.getAllAdmin();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStat) {
        await statsAPI.update(editingStat.id, formData);
      } else {
        await statsAPI.create(formData);
      }
      loadStats();
      closeModal();
    } catch (error) {
      console.error('Error saving stat:', error);
      alert('Failed to save stat');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    try {
      await statsAPI.delete(id);
      loadStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      alert('Failed to delete stat');
    }
  };

  const openEditModal = (stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      description: stat.description || '',
      icon: stat.icon || 'users',
      display_order: stat.display_order,
      is_active: stat.is_active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStat(null);
    setFormData({
      label: '',
      value: '',
      description: '',
      icon: 'users',
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
          <h1 className="text-2xl font-bold text-gray-900">Site Stats</h1>
          <p className="text-gray-600">Manage statistics displayed on the website</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          Add Stat
        </button>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.filter(s => s.is_active).map((stat) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <div key={stat.id} className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white">
              <IconComponent size={32} className="mb-3" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-primary-100">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Stats Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.map((stat) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <tr key={stat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <IconComponent size={20} className="text-primary-600" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{stat.label}</td>
                  <td className="px-6 py-4 text-gray-600 font-bold">{stat.value}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{stat.description || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{stat.display_order}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${stat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(stat)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stats.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No stats found. Add your first stat!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingStat ? 'Edit Stat' : 'Add New Stat'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Happy Patients"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="10,000+"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Additional context..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {iconOptions.map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({...formData, icon: value})}
                      className={`p-3 rounded-lg border ${formData.icon === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <Icon size={20} className={formData.icon === value ? 'text-primary-600' : 'text-gray-600'} />
                    </button>
                  ))}
                </div>
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
                  {editingStat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
