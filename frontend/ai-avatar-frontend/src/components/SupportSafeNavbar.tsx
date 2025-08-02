import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/// <reference types="vite/client" />
// Type definitions for navigation items
interface NavItem {
  name: string;
  icon: string;
  path?: string;
  url?: string;
  internal?: boolean;
  external?: boolean;
}

function SupportSafeNavbar(props) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to check if a link is active
  const isActive = (href: string) => location.pathname === href;

  // Navigation items with proper links
  const chatUrl = import.meta.env.VITE_CHAT_API_URL;
  const projectUrl = import.meta.env.VITE_PROJECT_API_URL;
  const lawUrl = import.meta.env.VITE_LAW_API_URL;
  const stegoUrl = import.meta.env.VITE_STEGO_API_URL;
  const bhashiniUrl = import.meta.env.VITE_BHASHINI_API_URL;
  const loginUrl = import.meta.env.VITE_LOGIN_API_URL;
  let navItems: NavItem[] = [];
  
  if (!user) {
    // Navigation for non-authenticated users
    navItems = [
      { name: 'Home', path: '/', icon: '🏠', external: false },
      { name: 'Community Help', url: chatUrl, icon: '💬', external: true },
      { name: 'Therapy Bot', path: '/therapy-bot', icon: '🧠', external: false },
      { name: 'Your Advisor', url: bhashiniUrl, icon: '🌍', external: true },
      { name: 'Police Portal', url: projectUrl, icon: '📊', external: true },
    ];
  } else if (user.role === 'police') {
    // Navigation for police users
    navItems = [
      { name: 'Home', path: '/', icon: '🏠', external: false },
      { name: 'Help from Higher Official', url: chatUrl, icon: '💬', external: true },
      { name: 'FIR Assistant', url: lawUrl, icon: '⚖️', external: true },
      { name: 'Police Assistant', url: projectUrl, icon: '📊', external: true },
      { name: 'Send Evidence', url: stegoUrl, icon: '🔐', external: true },
      { name: 'Therapy Bot', path: '/therapy-bot', icon: '🧠', external: false },
      { name: 'Your Advisor (Local Language)', url: bhashiniUrl, icon: '🌍', external: true },
    ];
  } else {
    // Navigation for regular citizens
    navItems = [
      { name: 'Home', path: '/', icon: '🏠', external: false },
      { name: 'Community Help', url: chatUrl, icon: '💬', external: true },
      { name: 'Know My Case', url: lawUrl, icon: '⚖️', external: true },
      { name: 'Register FIR', url: projectUrl, icon: '📊', external: true },
      { name: 'Stego Bot', url: stegoUrl, icon: '🔐', external: true },
      { name: 'Therapy Bot', path: '/therapy-bot', icon: '🧠', external: false },
      { name: 'Your Advisor (Local Language)', url: bhashiniUrl, icon: '🌍', external: true },
    ];
  }

  // External services (if needed)
  const externalServices = [
    { name: 'AI Avatar Backend', url: loginUrl, icon: '🤖' },
    { name: 'CHAT Service', url: chatUrl, icon: '💭' },
    { name: 'Stego Bot Service', url: stegoUrl, icon: '🔐' },
    { name: 'Law Bot Service', url: lawUrl, icon: '⚖️' },
    { name: 'Your Advisor (Local Language)', url: bhashiniUrl, icon: '🧠'},
  ];


  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <nav
      className={`supportsafe-navbar${props.className ? ' ' + props.className : ''}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Brand/Logo */}
      <div className="supportsafe-nav-brand">
        <Link to="/" className="focus:outline-none" aria-label="SupportSafe Home">
          <span className="text-xl font-bold">
            KavalAi-<span style={{ color: '#3b82f6' }}>DLLM</span>
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="supportsafe-nav-links hidden md:flex">
        {navItems.map((item) => (
          item.external ? (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="supportsafe-nav-link"
              title={item.name}
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </a>
          ) : (
            <Link
              key={item.name}
              to={item.path || '/'}
              className={`supportsafe-nav-link ${isActive(item.path || '') ? 'active' : ''}`}
              title={item.name}
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </Link>
          )
        ))}

        {/* User Authentication */}
        <div className="flex items-center space-x-4 ml-6">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="supportsafe-nav-link px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Logout"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="supportsafe-nav-link px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors duration-200"
              >
                🔑 Sign In
              </Link>
              <Link
                to="/signup"
                className="supportsafe-nav-link px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold transition-colors duration-200"
              >
                ✨ Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
          aria-label="Toggle mobile menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path || '/'}
                  className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.path || '')
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              )
            ))}

            {/* Mobile Authentication */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome, {user.name || user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-colors duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/signin"
                    className="block px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔑 Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✨ Create Account
                  </Link>
                </div>
              )}
            </div>

            {/* External Services (Mobile) */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                External Services
              </div>
              {externalServices.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{service.icon}</span>
                  {service.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* External Services Dropdown (Desktop) */}
      <div className="hidden md:block relative group">
        <button className="supportsafe-nav-link flex items-center space-x-1">
          <span>🔗</span>
          <span>Services</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              External Services
            </div>
            {externalServices.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="mr-2">{service.icon}</span>
                {service.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SupportSafeNavbar; 
