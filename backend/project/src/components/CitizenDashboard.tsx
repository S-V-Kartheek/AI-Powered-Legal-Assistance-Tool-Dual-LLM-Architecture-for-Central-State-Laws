import React, { useState, useEffect } from 'react';
import { MessageSquare, FileText, Phone, Globe } from 'lucide-react';
import { User, Complaint } from '../types';

// No props needed for CitizenDashboard
// Complaint form modal
type ComplaintFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function ComplaintForm({ open, onClose, onSuccess }: ComplaintFormProps) {
  const [form, setForm] = useState({
    name: '',
    aadhar: '',
    address: '',
    type: '',
    description: '',
    datetime: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  if (!open) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false); setSuccess(true); setForm({ name: '', aadhar: '', address: '', type: '', description: '', datetime: '', location: '' });
    if (onSuccess) { onSuccess(); }
    setTimeout(onClose, 1500);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">File Complaint</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input name="aadhar" value={form.aadhar} onChange={handleChange} placeholder="Aadhar Number" className="w-full p-2 border rounded" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" required />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type of Complaint" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input name="datetime" value={form.datetime} onChange={handleChange} placeholder="Date & Time" className="w-full p-2 border rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
        {success && <div className="text-green-600 mt-2">Complaint submitted!</div>}
      </form>
    </div>
  );
}

export default function CitizenDashboard({ user }: { user: User }) {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [query, setQuery] = useState('');
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'inbox'>('services');
  const [inbox, setInbox] = useState<Complaint[]>([]);

  useEffect(() => {
    if (activeTab === 'inbox') {
      fetch('/api/complaints')
        .then(res => res.json())
        .then((data: Complaint[]) => {
          setInbox(data.filter(c => c.status === 'accepted' && c.policeMessage && c.email === user.email));
        });
    }
  }, [activeTab, user.email]);

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिन्दी' },
    { code: 'tamil', name: 'தமிழ்' },
    { code: 'telugu', name: 'తెలుగు' },
    { code: 'bengali', name: 'বাংলা' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Citizen Services</h2>
        <p className="text-gray-600">Get assistance in your preferred language</p>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('services')}
        >Services</button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'inbox' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('inbox')}
        >Inbox</button>
      </div>
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Quick Assistance</h3>
            </div>
            <p className="text-gray-600 mb-4">Get instant help with common queries and procedures</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">File Complaint</h3>
            </div>
            <p className="text-gray-600 mb-4">Submit your complaint online with guided assistance</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setComplaintOpen(true)}
            >
              File Now
            </button>
          </div>
        </div>
      )}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4">Inbox</h3>
          {inbox.length === 0 ? (
            <div className="text-gray-500">No messages from police yet.</div>
          ) : (
            <div className="space-y-4">
              {inbox.map((c) => (
                <div key={c.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-semibold mb-1">{c.type}</div>
                  <div className="text-gray-700 text-sm mb-2">{c.description}</div>
                  <div className="text-xs text-gray-500 mb-2">Filed on: {c.datetime}</div>
                  <div className="text-blue-700 font-medium">Message from Police:</div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-1 text-gray-900">{c.policeMessage}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ComplaintForm open={complaintOpen} onClose={() => setComplaintOpen(false)} onSuccess={() => {}} />
    </div>
  );
}