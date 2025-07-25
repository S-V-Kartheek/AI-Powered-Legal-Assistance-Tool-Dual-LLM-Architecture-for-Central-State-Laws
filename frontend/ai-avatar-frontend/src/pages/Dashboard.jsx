import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} ({user.role === 'police' ? 'Police' : 'Citizen'})</h1>
          <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
        </div>
        {user.role === 'police' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Chat" desc="Help from Higher Official" onClick={() => navigate('/chat')} />
            <FeatureCard title="Law Bot" desc="FIR Assistant" onClick={() => navigate('/law-bot')} />
            <FeatureCard title="Therapy Bot" desc="Your Advisor [Bhasini API]" onClick={() => navigate('/therapy-bot')} />
            <FeatureCard title="Secret Message" desc="Send Evidence" onClick={() => navigate('/stego-bot')} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Chat" desc="Community Help (Legal Advisor/Social Activist)" onClick={() => navigate('/chat')} />
            <FeatureCard title="Law Bot" desc="Know my Case" onClick={() => navigate('/law-bot')} />
            <FeatureCard title="Therapy Bot" desc="Your Advisor [Bhashini API]" onClick={() => navigate('/therapy-bot')} />
            {/* Secret Message not needed for Citizen */}
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, onClick }) => (
  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer" onClick={onClick}>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-700 mb-4">{desc}</p>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Go</button>
  </div>
);

export default Dashboard; 