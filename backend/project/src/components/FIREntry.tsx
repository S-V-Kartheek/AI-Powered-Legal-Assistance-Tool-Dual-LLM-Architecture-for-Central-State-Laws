import React, { useState } from 'react';
import { Save, Zap, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    analysisTimeout?: ReturnType<typeof setTimeout>;
  }
}

export default function FIREntry() {
  const [formData, setFormData] = useState({
    complainantName: '',
    complainantContact: '',
    complainantAddress: '',
    complaint: '',
    incidentDate: '',
    incidentLocation: ''
  });
  const [predictions, setPredictions] = useState<{
    acts: string[];
    sections: string[];
    category: string;
    priority: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleComplaintChange = (value: string) => {
    setFormData({ ...formData, complaint: value });
    
    // Simulate AI analysis after 2 seconds of no typing
    if (window.analysisTimeout) clearTimeout(window.analysisTimeout);
    window.analysisTimeout = setTimeout(() => {
      if (value.length > 50) {
        analyzeComplaint();
      }
    }, 2000);
  };

  const analyzeComplaint = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI prediction
    setTimeout(() => {
      const mockPredictions = {
        acts: ['Indian Penal Code (IPC)', 'Bharatiya Nyaya Sanhita (BNS)'],
        sections: ['Section 379 - Theft', 'Section 323 - Voluntarily causing hurt'],
        category: 'Property Crime',
        priority: 'Medium'
      };
      
      setPredictions(mockPredictions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle FIR submission
    alert('FIR submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Save className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FIR Entry</h3>
          <p className="text-sm text-gray-600">Register a new First Information Report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complainant Name *
            </label>
            <input
              type="text"
              value={formData.complainantName}
              onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.complainantContact}
              onChange={(e) => setFormData({ ...formData, complainantContact: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Date *
            </label>
            <input
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Location *
            </label>
            <input
              type="text"
              value={formData.incidentLocation}
              onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complainant Address *
          </label>
          <textarea
            value={formData.complainantAddress}
            onChange={(e) => setFormData({ ...formData, complainantAddress: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Details *
          </label>
          <textarea
            value={formData.complaint}
            onChange={(e) => handleComplaintChange(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the incident in detail..."
            required
          />
          
          {isAnalyzing && (
            <div className="mt-2 flex items-center gap-2 text-blue-600">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Analyzing complaint with AI...</span>
            </div>
          )}
        </div>

        {predictions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">AI Predictions</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Applicable Acts:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {predictions.acts.map((act, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {act}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Relevant Sections:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {predictions.sections.map((section, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {section}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Category:</h5>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {predictions.category}
                </span>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Priority:</h5>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  predictions.priority === 'High' ? 'bg-red-100 text-red-800' :
                  predictions.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {predictions.priority}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Submit FIR
          </button>
        </div>
      </form>
    </div>
  );
}