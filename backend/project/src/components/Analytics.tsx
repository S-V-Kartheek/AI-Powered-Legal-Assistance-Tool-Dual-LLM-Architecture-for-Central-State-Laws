import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

export default function Analytics() {
  const [viewMode, setViewMode] = useState<'act' | 'daily' | 'monthly'>('act');

  const analyticsData = {
    totalFIRs: 15,
    pendingFIRs: 4,
    resolvedFIRs: 11,
    underInvestigation: 2,
    actWiseData: [
      { name: 'IPC Sections', count: 65 },
      { name: 'BNS Sections', count: 42 },
      { name: 'CRPC Sections', count: 28 },
      { name: 'Special Acts', count: 15 }
    ],
    dailyData: [
      { date: '2025-01-10', count: 8 },
      { date: '2025-01-11', count: 12 },
      { date: '2025-01-12', count: 6 },
      { date: '2025-01-13', count: 15 },
      { date: '2025-01-14', count: 9 },
      { date: '2025-01-15', count: 11 },
      { date: '2025-01-16', count: 14 }
    ],
    monthlyData: [
      { month: 'Oct 2024', count: 120 },
      { month: 'Nov 2024', count: 95 },
      { month: 'Dec 2024', count: 110 },
      { month: 'Jan 2025', count: 75 }
    ]
  };

  type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
  const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
          <p className="text-sm text-gray-600">Comprehensive FIR statistics and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total FIRs"
          value={analyticsData.totalFIRs}
          icon={BarChart3}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pending FIRs"
          value={analyticsData.pendingFIRs}
          icon={Calendar}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Resolved FIRs"
          value={analyticsData.resolvedFIRs}
          icon={TrendingUp}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Under Investigation"
          value={analyticsData.underInvestigation}
          icon={PieChart}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Detailed Analysis</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('act')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'act'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Act-wise
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {viewMode === 'act' && analyticsData.actWiseData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{item.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.count / Math.max(...analyticsData.actWiseData.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 w-8 text-right">{item.count}</span>
              </div>
            </div>
          ))}

          {viewMode === 'daily' && analyticsData.dailyData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{new Date(item.date).toLocaleDateString()}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(item.count / Math.max(...analyticsData.dailyData.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 w-8 text-right">{item.count}</span>
              </div>
            </div>
          ))}

          {viewMode === 'monthly' && analyticsData.monthlyData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{item.month}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(item.count / Math.max(...analyticsData.monthlyData.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 w-8 text-right">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}