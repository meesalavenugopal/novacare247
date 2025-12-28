import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Check, Trash2, Eye, X, Sparkles, Loader2, Copy } from 'lucide-react';
import { contactAPI, aiAPI } from '../../services/api';
import { format } from 'date-fns';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const response = await contactAPI.getAll();
      setInquiries(response.data);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      loadInquiries();
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await contactAPI.delete(id);
      loadInquiries();
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const openInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setAiReply('');
    setCopied(false);
    if (!inquiry.is_read) {
      await handleMarkAsRead(inquiry.id);
    }
  };

  const handleGenerateReply = async () => {
    if (!selectedInquiry) return;
    setGeneratingReply(true);
    try {
      const response = await aiAPI.generateInquiryReply({
        inquiry_name: selectedInquiry.name,
        inquiry_subject: selectedInquiry.subject || 'General Inquiry',
        inquiry_message: selectedInquiry.message
      });
      if (response.data.success) {
        setAiReply(response.data.reply);
      } else {
        alert('Failed to generate reply. Please try again.');
      }
    } catch (error) {
      console.error('Error generating reply:', error);
      alert('Failed to generate reply');
    } finally {
      setGeneratingReply(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Inquiries</h1>
        <p className="text-gray-600">Messages from the contact form</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="divide-y">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${!inquiry.is_read ? 'bg-primary-50/50' : ''}`}
                onClick={() => openInquiry(inquiry)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      !inquiry.is_read ? 'bg-primary-50 border border-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${!inquiry.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {inquiry.name}
                        </p>
                        {!inquiry.is_read && (
                          <span className="w-2 h-2 bg-primary-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{inquiry.subject || 'No subject'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(inquiry.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2 ml-14">
                  {inquiry.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No inquiries yet</p>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg">
                  {selectedInquiry.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedInquiry.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedInquiry.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:text-primary-600">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:text-primary-600">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
              </div>

              {selectedInquiry.subject && (
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedInquiry.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {/* AI Reply Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">AI-Generated Reply</p>
                  <button
                    onClick={handleGenerateReply}
                    disabled={generatingReply}
                    className="flex items-center gap-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
                  >
                    {generatingReply ? (
                      <><Loader2 size={14} className="animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles size={14} /> Generate Reply</>
                    )}
                  </button>
                </div>
                {aiReply && (
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mt-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-purple-600 font-medium">AI Suggestion</span>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                      >
                        <Copy size={12} />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiReply}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="btn-primary flex-1 text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
