import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  let navItems: NavItem[] = [
    { name: 'Home', url: 'http://localhost:5174', icon: '🏠', external: true },
    { name: 'Community Help', url: 'http://localhost:5003', icon: '💬', internal: true },
    { name: 'Know My Case', url: 'http://localhost:8000', icon: '⚖️', external: true },
    { name: 'Police service portal', url: 'http://localhost:5176', icon: '📊', external: true },
    { name: 'Stego Bot', url: 'http://localhost:3002', icon: '🔐', external: true },
    { name: 'Therapy Bot', url: 'http://localhost:5174/therapy-bot', icon: '🧠', internal: true },
    { name: 'Your Advisor (Local Language)', url: 'http://localhost:9000/', icon: '🌍', internal: true },
  ];
  if (user && user.role === 'police') {
    navItems = [
      { name: 'Home', url: 'http://localhost:5174', icon: '🏠', external: true }, // always main home
      { name: 'Help from Higher Official', url: 'http://localhost:5003', icon: '💬', external: true },
      { name: 'FIR Assistant', url: 'http://localhost:8000', icon: '⚖️', external: true },
      { name: 'Police Assistant', url: 'http://localhost:5176', icon: '📊', external: true },
      { name: 'Send Evidence', url: 'http://localhost:3002', icon: '🔐', external: true },
      { name: 'Therapy Bot', url: 'http://localhost:5174/therapy-bot', icon: '🧠', internal: true },
      { name: 'Your Advisor (Local Language)', url: 'http://localhost:9000/', icon: '🌍', external: true },
    ];
  }

  // External services (if needed)
  const externalServices = [
    { name: 'AI Avatar Backend', url: 'http://localhost:3000', icon: '🤖' },
    { name: 'CHAT Service', url: 'http://localhost:5003', icon: '💭' },
    { name: 'Stego Bot Service', url: 'http://localhost:3002', icon: '🔐' },
    { name: 'Law Bot Service', url: 'http://localhost:8000', icon: '⚖️' },
    { name: 'Your Advisor (Local Language)', url: 'http://localhost:9000/', icon: '🧠'},
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
            Support<span style={{ color: '#3b82f6' }}>Safe</span>
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
                ✨ Sign Up
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
                    ✨ Sign Up
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