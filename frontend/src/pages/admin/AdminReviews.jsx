import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageCircle, BadgeCheck, Sparkles, Loader2 } from 'lucide-react';
import { reviewsAPI, aiAPI } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [generatingResponse, setGeneratingResponse] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await reviewsAPI.update(reviewId, { is_approved: true });
      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await reviewsAPI.update(reviewId, { is_approved: false });
      loadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsAPI.delete(reviewId);
      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleToggleVerified = async (review) => {
    try {
      await reviewsAPI.update(review.id, { is_verified: !review.is_verified });
      loadReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleGenerateResponse = async (review) => {
    setGeneratingResponse(review.id);
    try {
      const response = await aiAPI.chat(
        `Generate a professional thank you response for this doctor review at NovaCare 24/7 Physiotherapy. Patient: ${review.patient_name}, Rating: ${review.rating}/5, Review: "${review.content}". Write a brief, warm thank you response (2-3 sentences).`,
        null
      );
      if (response.data.success) {
        alert(`Suggested Response:\n\n${response.data.response}`);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      alert('Failed to generate response');
    } finally {
      setGeneratingResponse(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.is_approved;
    if (filter === 'approved') return review.is_approved;
    return true;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
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
          <h1 className="text-2xl font-bold text-gray-900">Doctor Reviews</h1>
          <p className="text-gray-600">Manage patient reviews for doctors</p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reviews.filter(r => !r.is_approved).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.is_approved).length}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">{review.patient_name}</span>
                  {review.is_verified && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      <BadgeCheck size={12} />
                      Verified
                    </span>
                  )}
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                
                <p className="text-gray-600 mb-2">{review.content}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {review.treatment_type && (
                    <span className="bg-gray-100 px-2 py-1 rounded">{review.treatment_type}</span>
                  )}
                  <span>Doctor ID: {review.doctor_id}</span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!review.is_approved ? (
                  <>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded">
                    ✓ Approved
                  </span>
                )}
                
                <button
                  onClick={() => handleToggleVerified(review)}
                  className={`text-sm px-3 py-2 rounded ${
                    review.is_verified
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  title={review.is_verified ? 'Remove verified' : 'Mark as verified'}
                >
                  <BadgeCheck size={14} />
                </button>

                <button
                  onClick={() => handleGenerateResponse(review)}
                  disabled={generatingResponse === review.id}
                  className="text-sm bg-purple-50 text-purple-600 px-3 py-2 rounded hover:bg-purple-100 disabled:opacity-50"
                  title="Generate AI Response"
                >
                  {generatingResponse === review.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                </button>
                
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No reviews found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
