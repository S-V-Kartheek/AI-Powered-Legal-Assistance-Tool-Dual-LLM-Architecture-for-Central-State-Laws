import React, { useState } from 'react';
import { Search, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { FIR } from '../types';

export default function FIRTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockFIRs: FIR[] = [
    {
      id: '1',
      firNumber: 'FIR/2025/001',
      complaint: 'Theft of motorcycle from parking area',
      complainantName: 'Rajesh Kumar',
      complainantContact: '+91 9876543210',
      status: 'under_investigation',
      predictedActs: ['IPC', 'BNS'],
      predictedSections: ['Section 379'],
      assignedOfficer: 'Inspector Sharma',
      dateRegistered: '2025-01-15',
      lastUpdated: '2025-01-16',
      priority: 'medium',
      category: 'Property Crime'
    },
    {
      id: '2',
      firNumber: 'FIR/2025/002',
      complaint: 'Domestic violence case',
      complainantName: 'Priya Singh',
      complainantContact: '+91 9876543211',
      status: 'registered',
      predictedActs: ['IPC', 'PWDVA'],
      predictedSections: ['Section 498A'],
      dateRegistered: '2025-01-16',
      lastUpdated: '2025-01-16',
      priority: 'high',
      category: 'Violence'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_investigation':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_investigation':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFIRs = mockFIRs.filter(fir => {
    const matchesSearch = fir.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fir.complainantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fir.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FIR Tracker</h3>
          <p className="text-sm text-gray-600">Track and manage FIR status</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by FIR number or complainant name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="registered">Registered</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredFIRs.map((fir) => (
          <div key={fir.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{fir.firNumber}</h4>
                <p className="text-gray-600">{fir.complaint}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Complainant:</span>
                <p className="text-gray-900">{fir.complainantName}</p>
                <p className="text-sm text-gray-600">{fir.complainantContact}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Date Registered:</span>
                <p className="text-gray-900">{new Date(fir.dateRegistered).toLocaleDateString()}</p>
                {fir.assignedOfficer && (
                  <>
                    <span className="text-sm font-medium text-gray-700">Assigned Officer:</span>
                    <p className="text-gray-900">{fir.assignedOfficer}</p>
                  </>
                )}
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <p className="text-gray-900">{fir.category}</p>
                <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                <p className="text-gray-900">{new Date(fir.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(fir.status)}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fir.status)}`}>
                    {fir.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(fir.priority)}`}>
                  {fir.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Update Status
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFIRs.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No FIRs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}