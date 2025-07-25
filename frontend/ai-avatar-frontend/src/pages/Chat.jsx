import React, { useState, useEffect } from 'react';
import SupportSafeNavbar from '../components/SupportSafeNavbar';

const Chat = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <SupportSafeNavbar />
      
      {iframeError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>❌ Chat Service Not Available</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            The chat service at http://localhost:5001 is not running.
          </p>
          <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            <p>To fix this:</p>
            <ol style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              <li>Open a new terminal</li>
              <li>Navigate to: <code>backend\CHAT</code></li>
              <li>Run: <code>node server.js</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      )}
      
      <iframe
        src="http://localhost:5001"
        title="Chat"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          opacity: iframeLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default Chat; 