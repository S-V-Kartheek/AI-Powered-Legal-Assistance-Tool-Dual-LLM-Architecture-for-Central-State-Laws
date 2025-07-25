import React from 'react';
import { User } from '../types';
import PoliceDashboard from './PoliceDashboard';
import CitizenDashboard from './CitizenDashboard';
import Header from './Header';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="py-6">
        {user.role === 'police' ? (
          <PoliceDashboard user={user} />
        ) : (
          <CitizenDashboard user={user} />
        )}
      </main>
    </div>
  );
}