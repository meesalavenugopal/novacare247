import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { testimonialsAPI } from '../../services/api';
import { format } from 'date-fns';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg">
                    {testimonial.patient_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.patient_name}</p>
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

              <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-500">
                  {format(new Date(testimonial.created_at), 'MMM d, yyyy')}
                </p>
                <div className="flex gap-2">
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
