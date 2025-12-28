import { useState } from 'react';
import { Bot, Sparkles, FileText, User, MessageSquare, Loader2, Copy, Check, Stethoscope } from 'lucide-react';
import { aiAPI } from '../../services/api';

const AdminAITools = () => {
  const [activeTab, setActiveTab] = useState('service');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Service content form
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    keywords: ''
  });
  
  // Doctor content form
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    experience_years: ''
  });
  
  // Inquiry reply form
  const [inquiryForm, setInquiryForm] = useState({
    customer_name: '',
    inquiry_message: ''
  });

  // Symptom analysis form
  const [symptomForm, setSymptomForm] = useState({
    symptoms: '',
    duration: '',
    severity: 'moderate'
  });

  const handleGenerateServiceContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await aiAPI.generateServiceContent({
        service_name: serviceForm.service_name,
        short_description: serviceForm.keywords || serviceForm.service_name
      });
      if (response.data.success && response.data.content) {
        setResult(JSON.stringify(response.data.content, null, 2));
      } else {
        setResult(response.data.message || 'Error generating content. Please try again.');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setResult('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDoctorContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await aiAPI.generateDoctorContent({
        name: doctorForm.name,
        specialization: doctorForm.specialization,
        experience_years: parseInt(doctorForm.experience_years),
        qualification: doctorForm.specialization // Using specialization as qualification
      });
      if (response.data.success && response.data.content) {
        setResult(JSON.stringify(response.data.content, null, 2));
      } else {
        setResult(response.data.message || 'Error generating content. Please try again.');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setResult('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInquiryReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await aiAPI.generateInquiryReply({
        inquiry_name: inquiryForm.customer_name,
        inquiry_subject: 'General Inquiry',
        inquiry_message: inquiryForm.inquiry_message
      });
      if (response.data.success) {
        setResult(response.data.reply);
      } else {
        setResult(response.data.message || 'Error generating reply. Please try again.');
      }
    } catch (error) {
      console.error('Error generating reply:', error);
      setResult('Error generating reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSymptoms = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await aiAPI.analyzeSymptoms({
        symptoms: `${symptomForm.symptoms}. Duration: ${symptomForm.duration}. Severity: ${symptomForm.severity}`
      });
      if (response.data.success) {
        const analysis = response.data;
        const formattedResult = `
📋 SYMPTOM ANALYSIS REPORT
${'-'.repeat(40)}

📝 Summary:
${analysis.summary || 'N/A'}

🔍 Possible Conditions:
${(analysis.possible_conditions || []).map(c => `  • ${c}`).join('\n')}

💊 Recommended Services:
${(analysis.recommended_services || []).map(s => `  • ${s}`).join('\n')}

⚠️ Urgency Level: ${analysis.urgency?.toUpperCase() || 'N/A'}

👨‍⚕️ Recommended Specialist: ${analysis.specialist_type || 'N/A'}

${'-'.repeat(40)}
⚠️ DISCLAIMER: ${analysis.message || 'This is for informational purposes only. Please consult our specialists for proper diagnosis.'}
        `.trim();
        setResult(formattedResult);
      } else {
        setResult(response.data.message || 'Error analyzing symptoms. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setResult('Error analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'service', label: 'Service Content', icon: FileText },
    { id: 'doctor', label: 'Doctor Bio', icon: User },
    { id: 'inquiry', label: 'Inquiry Reply', icon: MessageSquare },
    { id: 'symptoms', label: 'Symptom Analysis', icon: Stethoscope }
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Content Tools</h1>
            <p className="text-gray-600">Generate content using AI assistance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'service' && (
            <form onSubmit={handleGenerateServiceContent} className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Generate Service Description</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.service_name}
                  onChange={(e) => setServiceForm({...serviceForm, service_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Sports Rehabilitation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={serviceForm.keywords}
                  onChange={(e) => setServiceForm({...serviceForm, keywords: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="injury recovery, athletes, performance"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Generate Content
              </button>
            </form>
          )}

          {activeTab === 'doctor' && (
            <form onSubmit={handleGenerateDoctorContent} className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Generate Doctor Bio</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Orthopedic Physiotherapy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={doctorForm.experience_years}
                  onChange={(e) => setDoctorForm({...doctorForm, experience_years: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="10"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Generate Bio
              </button>
            </form>
          )}

          {activeTab === 'inquiry' && (
            <form onSubmit={handleGenerateInquiryReply} className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Generate Inquiry Reply</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={inquiryForm.customer_name}
                  onChange={(e) => setInquiryForm({...inquiryForm, customer_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Message</label>
                <textarea
                  value={inquiryForm.inquiry_message}
                  onChange={(e) => setInquiryForm({...inquiryForm, inquiry_message: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="Customer's inquiry message..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Generate Reply
              </button>
            </form>
          )}

          {activeTab === 'symptoms' && (
            <form onSubmit={handleAnalyzeSymptoms} className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Analyze Patient Symptoms</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
                <textarea
                  value={symptomForm.symptoms}
                  onChange={(e) => setSymptomForm({...symptomForm, symptoms: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="lower back pain, stiffness in morning, difficulty bending"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={symptomForm.duration}
                  onChange={(e) => setSymptomForm({...symptomForm, duration: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="2 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={symptomForm.severity}
                  onChange={(e) => setSymptomForm({...symptomForm, severity: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Analyze Symptoms
              </button>
            </form>
          )}
        </div>

        {/* Result Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Generated Content</h2>
            {result && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-1 rounded border hover:bg-gray-50"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Loader2 size={32} className="animate-spin mb-4 text-primary-500" />
              <p>Generating content with AI...</p>
            </div>
          ) : result ? (
            <div className="bg-gray-50 rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-800 font-sans">{result}</pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bot size={48} className="mb-4" />
              <p>Fill out the form and generate content</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">💡 Tips for better results</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Be specific with service names and keywords for more targeted content</li>
          <li>• Include relevant specializations when generating doctor bios</li>
          <li>• Copy the generated content directly to use in forms</li>
          <li>• Review and edit AI-generated content before publishing</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminAITools;
