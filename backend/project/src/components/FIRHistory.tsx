import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { History, Filter, Download } from 'lucide-react';

const FIRHistory = forwardRef((props, ref) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complaints, setComplaints] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchComplaints = () => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(data));
  };

  useImperativeHandle(ref, () => ({
    refetch: fetchComplaints
  }));

  useEffect(() => {
    fetchComplaints();
  }, []);

  const clearHistory = async () => {
    await fetch('/api/complaints', { method: 'DELETE' });
    fetchComplaints();
    setShowConfirm(false);
  };

  const filteredComplaints = complaints.filter((c: any) => {
    if (categoryFilter !== 'all' && c.type?.toLowerCase() !== categoryFilter) return false;
    if (dateRange.start && new Date(c.datetime) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(c.datetime) > new Date(dateRange.end)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FIR History</h3>
          <p className="text-sm text-gray-600">View historical FIR records and statistics</p>
        </div>
        <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => setShowConfirm(true)}>
          Clear History
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete all history records? This cannot be undone.</p>
            <div className="flex gap-2 mt-4 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={clearHistory}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="theft">Theft</option>
              <option value="violence">Violence</option>
              <option value="fraud">Fraud</option>
              <option value="traffic">Traffic</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complainant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.datetime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.status === 'accepted' && (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-1">Under Investigation</span>
                        <div className="flex gap-2 mt-1">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700" onClick={async () => {
                            await fetch(`/api/complaints/${c.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'closed' })
                            });
                            setComplaints((prev: any) => prev.map((item: any) => item.id === c.id ? { ...item, status: 'closed' } : item));
                          }}>Case Completed</button>
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700" onClick={async () => {
                            await fetch(`/api/complaints/${c.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'cannot_move_further' })
                            });
                            setComplaints((prev: any) => prev.map((item: any) => item.id === c.id ? { ...item, status: 'cannot_move_further' } : item));
                          }}>Cannot Move Further</button>
                        </div>
                      </div>
                    )}
                    {c.status === 'closed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Case Completed</span>
                    )}
                    {c.status === 'cannot_move_further' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">Cannot Move Further</span>
                    )}
                    {c.status === 'rejected' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default FIRHistory;