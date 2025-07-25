import React, { useState } from 'react';
import { Shield, Users, Lock, User } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'police' | 'citizen';
  department?: string;
  badge?: string;
};

interface AuthLoginProps {
  onLogin: (user: User) => void;
}

export default function AuthLogin({ onLogin }: AuthLoginProps) {
  const [loginType, setLoginType] = useState<'police' | 'citizen'>('police');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    badgeNumber: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const mockUser: User = {
      id: '1',
      name: loginType === 'police' ? 'Officer ' : 'Citizen User',
      email: credentials.email,
      role: loginType,
      department: loginType === 'police' ? 'Investigation' : undefined,
      badge: loginType === 'police' ? credentials.badgeNumber : undefined
    };
    
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-900 text-white p-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-200" />
          <h1 className="text-2xl font-bold">Police Service Portal</h1>
          <p className="text-blue-200 mt-2">AI-Powered Multilingual Assistance</p>
        </div>

        <div className="p-6">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginType('police')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                loginType === 'police'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Police
            </button>
            <button
              onClick={() => setLoginType('citizen')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                loginType === 'citizen'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Citizen
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {loginType === 'police' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Number
                </label>
                <div className="relative">
                  <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={credentials.badgeNumber}
                    onChange={(e) => setCredentials({ ...credentials, badgeNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter badge number"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Powered by BHASHINI AI Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}