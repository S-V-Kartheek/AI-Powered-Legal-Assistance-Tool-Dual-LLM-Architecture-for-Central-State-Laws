import React, { useState, useEffect } from 'react';
import { FileText, Search, BarChart3, History, Plus } from 'lucide-react';
import FIREntry from './FIREntry';
import FIRTracker from './FIRTracker';
import FIRHistory from './FIRHistory';
import Analytics from './Analytics';

interface Complaint {
  id: number;
  name: string;
  aadhar: string;
  address: string;
  type: string;
  description: string;
  datetime: string;
  location: string;
  status: string;
}

// No props needed for PoliceDashboard
export default function PoliceDashboard() {
  const [activeTab, setActiveTab] = useState<'entry' | 'tracker' | 'history' | 'analytics' | 'acceptcase'>('entry');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  useEffect(() => {
    if (activeTab === 'acceptcase') {
      fetch('/api/complaints')
        .then(res => res.json())
        .then((data: Complaint[]) => setComplaints(data.filter((c) => c.status === 'pending')));
    }
  }, [activeTab]);

  const tabs = [
    { id: 'entry', label: 'FIR Entry', icon: Plus },
    { id: 'tracker', label: 'FIR Tracker', icon: Search },
    { id: 'history', label: 'FIR History', icon: History },
    { id: 'analytics', label: 'Analysis', icon: BarChart3 },
    { id: 'acceptcase', label: 'Accept Case', icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Police Dashboard</h2>
        <p className="text-gray-600">Manage FIRs and track investigations efficiently</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'entry' && <FIREntry />}
          {activeTab === 'tracker' && <FIRTracker />}
          {activeTab === 'history' && <FIRHistory />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'acceptcase' && (
            <div>
              <h3 className="text-lg font-bold mb-4">Pending Complaints</h3>
              {complaints.length === 0 && <div className="text-gray-500">No pending complaints.</div>}
              <div className="grid gap-4">
                {complaints.map((c: Complaint) => (
                  <div key={c.id} className="bg-gray-50 border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">{c.type}</div>
                      <div className="text-gray-700 text-sm">{c.description}</div>
                      <div className="text-xs text-gray-500 mt-1">By: {c.name} | Aadhar: {c.aadhar} | {c.address}</div>
                      <div className="text-xs text-gray-500">Date/Time: {c.datetime} | Location: {c.location}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded" disabled>Accept</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" disabled>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}