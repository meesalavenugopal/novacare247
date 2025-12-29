import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Sparkles, Loader2, Pencil } from 'lucide-react';
import { testimonialsAPI, aiAPI, uploadAPI } from '../../services/api';
import { format } from 'date-fns';
import ImageUpload from '../../components/admin/ImageUpload';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // testimonial being edited
  const [originalImage, setOriginalImage] = useState(''); // Track original for cleanup
  const [generatingContent, setGeneratingContent] = useState(null); // ID of testimonial generating content for
  const [form, setForm] = useState({
    patient_name: '',
    content: '',
    rating: 5,
    subtitle: '',
    image_url: '',
    story_type: '',
    tips: '',
  });

  const handleGenerateContent = async (testimonial) => {
    setGeneratingContent(testimonial.id);
    try {
      const response = await aiAPI.chat(
        `Generate a professional thank you response for this patient testimonial. Patient: ${testimonial.patient_name}, Rating: ${testimonial.rating}/5, Their testimonial: "${testimonial.content}". Write a brief, warm thank you response (2-3 sentences).`,
        null
      );
      if (response.data.success) {
        alert(`Suggested Response:\n\n${response.data.response}`);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      alert('Failed to generate response');
    } finally {
      setGeneratingContent(null);
    }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial.id);
    setOriginalImage(testimonial.image_url || '');
    setForm({
      patient_name: testimonial.patient_name || '',
      content: testimonial.content || '',
      rating: testimonial.rating || 5,
      subtitle: testimonial.subtitle || '',
      image_url: testimonial.image_url || '',
      story_type: testimonial.story_type || '',
      tips: testimonial.tips || '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSave = async () => {
    try {
      await testimonialsAPI.update(editing, form);
      setEditing(null);
      loadTestimonials();
    } catch (error) {
      alert('Failed to update testimonial');
    }
  };

  const handleFormCancel = async () => {
    // Cleanup orphaned uploads
    if (form.image_url && form.image_url !== originalImage) {
      try {
        await uploadAPI.deleteFile(form.image_url);
      } catch (err) {
        console.error('Failed to cleanup:', err);
      }
    }
    setEditing(null);
    setOriginalImage('');
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAllAdmin();
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      await testimonialsAPI.update(id, { is_approved: approved });
      loadTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Failed to update testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
        <p className="text-gray-600">Manage patient testimonials</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-gray-200 p-6">
              {editing === testimonial.id ? (
                <div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Patient Name</label>
                    <input name="patient_name" value={form.patient_name} onChange={handleFormChange} className="input input-bordered w-full" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Subtitle</label>
                    <input name="subtitle" value={form.subtitle} onChange={handleFormChange} className="input input-bordered w-full" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Patient Photo</label>
                    <ImageUpload
                      value={form.image_url}
                      onChange={(url) => setForm({...form, image_url: url})}
                      folder="testimonials"
                      placeholder="Upload patient photo"
                      aspectRatio="square"
                      originalValue={originalImage}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Story Type</label>
                    <input name="story_type" value={form.story_type} onChange={handleFormChange} className="input input-bordered w-full" placeholder="article or video" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Content</label>
                    <textarea name="content" value={form.content} onChange={handleFormChange} className="textarea textarea-bordered w-full" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Tips (comma separated)</label>
                    <input name="tips" value={form.tips} onChange={handleFormChange} className="input input-bordered w-full" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1">Rating</label>
                    <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleFormChange} className="input input-bordered w-20" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleFormSave} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={handleFormCancel} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg">
                        {testimonial.patient_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.patient_name}</p>
                        {testimonial.subtitle && <p className="text-xs text-gray-500">{testimonial.subtitle}</p>}
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium ${
                      testimonial.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {testimonial.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  {testimonial.image_url && (
                    <img src={testimonial.image_url} alt="story" className="w-full max-h-40 object-cover rounded mb-2" />
                  )}
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  {testimonial.tips && (
                    <ul className="text-xs text-primary-700 mb-2 list-disc pl-5">
                      {testimonial.tips.split(',').map((tip, i) => <li key={i}>{tip.trim()}</li>)}
                    </ul>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      {format(new Date(testimonial.created_at), 'MMM d, yyyy')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateContent(testimonial)}
                        disabled={generatingContent === testimonial.id}
                        className="p-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                        title="Generate AI Response"
                      >
                        {generatingContent === testimonial.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Sparkles size={18} />
                        )}
                      </button>
                      <button onClick={() => handleEdit(testimonial)} className="p-2 text-blue-600 hover:bg-blue-50" title="Edit">
                        Edit
                      </button>
                      {!testimonial.is_approved && (
                        <button
                          onClick={() => handleApprove(testimonial.id, true)}
                          className="p-2 text-green-600 hover:bg-green-50"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {testimonial.is_approved && (
                        <button
                          onClick={() => handleApprove(testimonial.id, false)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50"
                          title="Unapprove"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No testimonials yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
