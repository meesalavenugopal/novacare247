import { useState, useEffect } from 'react';
import { Settings, Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { settingsAPI } from '../../services/api';

const categoryColors = {
  general: 'bg-blue-100 text-blue-700',
  contact: 'bg-green-100 text-green-700',
  social: 'bg-purple-100 text-purple-700',
  seo: 'bg-orange-100 text-orange-700',
  appearance: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700'
};

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    category: 'general',
    description: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSetting) {
        await settingsAPI.update(editingSetting.id, formData);
      } else {
        await settingsAPI.create(formData);
      }
      loadSettings();
      closeModal();
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Failed to save setting');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;
    try {
      await settingsAPI.delete(id);
      loadSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Failed to delete setting');
    }
  };

  const openEditModal = (setting) => {
    setEditingSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value,
      category: setting.category || 'general',
      description: setting.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSetting(null);
    setFormData({
      key: '',
      value: '',
      category: 'general',
      description: ''
    });
  };

  const categories = [...new Set(settings.map(s => s.category || 'other'))];
  
  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (setting.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (setting.category || 'other') === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group settings by category
  const groupedSettings = filteredSettings.reduce((acc, setting) => {
    const category = setting.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {});

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
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Manage website configuration settings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          Add Setting
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Settings by Category */}
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${categoryColors[category] || categoryColors.other}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <span className="text-gray-400 text-sm font-normal">({categorySettings.length})</span>
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categorySettings.map((setting) => (
                  <tr key={setting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {setting.key}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="max-w-xs truncate" title={setting.value}>
                        {setting.value}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {setting.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(setting)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(setting.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filteredSettings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'No settings match your search.' 
              : 'No settings found. Add your first setting!'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingSetting ? 'Edit Setting' : 'Add New Setting'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 font-mono"
                  placeholder="site_name"
                  required
                  disabled={!!editingSetting}
                />
                {editingSetting && (
                  <p className="text-xs text-gray-500 mt-1">Key cannot be changed after creation</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Setting value..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="general">General</option>
                  <option value="contact">Contact</option>
                  <option value="social">Social</option>
                  <option value="seo">SEO</option>
                  <option value="appearance">Appearance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="What this setting does..."
                />
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
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Save size={16} />
                  {editingSetting ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
