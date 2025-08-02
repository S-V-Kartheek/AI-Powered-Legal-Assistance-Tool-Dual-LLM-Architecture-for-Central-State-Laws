import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import banner from '../assets/banner.png'; // Temporarily removed
import SupportSafeNavbar from '../components/SupportSafeNavbar';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useAuth } from '../context/AuthContext';

 

// Modal component - improved implementation
const Modal = ({ children, show, onClose }) => {
  if (!show) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <button 
            onClick={onClose} 
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close modal"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [currentForm, setCurrentForm] = useState(null); // 'signin', 'signup', or null
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Get the user from AuthContext

  const handleShowSignIn = () => {
    setCurrentForm('signin');
  };

  const handleShowSignUp = () => {
    setCurrentForm('signup');
  };

  const handleCloseForm = () => {
    setCurrentForm(null);
  };

  const handleImageError = (imageName) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [imageName]: true
    }));
  };

  const getImageSrc = (imageName) => {
    if (imageLoadErrors[imageName]) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjA4IiBoZWlnaHQ9IjIwOCIgdmlld0JveD0iMCAwIDIwOCAyMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDgiIGhlaWdodD0iMjA4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDQgMTU2QzEyMC4xODMgMTU2IDEzMy4zMzMgMTQyLjg1IDEzMy4zMzMgMTI2LjY2N0MxMzMuMzMzIDExMC40ODMgMTIwLjE4MyA5Ny4zMzMzIDEwNCA5Ny4zMzMzQzg3LjgxNjcgOTcuMzMzMyA3NC42NjY3IDExMC40ODMgNzQuNjY2NyAxMjYuNjY3Qzc0LjY2NjcgMTQyLjg1IDg3LjgxNjcgMTU2IDEwNCAxNTZaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDQgMTQ2LjY2N0MxMTUuNzIgMTQ2LjY2NyAxMjUuMzMzIDEzNy4wNSAxMjUuMzMzIDEyNS4zMzNDMTI1LjMzMyAxMTMuNjE3IDExNS43MiAxMDQgMTA0IDEwNEM5Mi4yOCAxMDQgODIuNjY2NyAxMTMuNjE3IDgyLjY2NjcgMTI1LjMzM0M4Mi42NjY3IDEzNy4wNSA5Mi4yOCAxNDYuNjY3IDEwNCAxNDYuNjY3WiIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4K';
    }
    return `/images/${imageName}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <SupportSafeNavbar className="home-compact" />
      <div className="flex flex-col h-full max-w-6xl mx-auto w-full pt-16">
        <div className="flex items-center mt-12 mb-16 gap-28">
          <div className="flex flex-col gap-3">
            <h1 className="font-extrabold text-[32px] text-gray-800">
            AI-Powered Legal Assistance Tool with Dual LLM Architecture for {' '}
              <span className="text-blue-700">Central & State Laws</span>
            </h1>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              Our AI-driven legal platform uses a unique dual LLM architecture for precise legal guidance on both Central and State laws in India.
              It features two specialized LLMs: one for Central laws (IPC, CrPC, BNS) and another for State-specific legislation. A <b>Rule & Act Selector Module</b> automatically directs queries to the correct jurisdiction. Plus, a <b>Digital Initiative Linker (DIL)</b> integrates with government platforms like e-Courts and DigiLocker via APIs.
              This system ensures accurate, jurisdiction-specific legal assistance, bridging gaps between citizens, police, and the judiciary through seamless digital integration.
            </p>
       
            {/* Buttons to toggle Sign In / Sign Up forms */}
            {!user && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleShowSignIn}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Sign In'}
              </button>
              <button
                onClick={handleShowSignUp}
                disabled={isLoading}
                className="px-6 py-3 text-lg text-blue-700 rounded-lg border border-blue-700 shadow-md transform hover:scale-105 hover:bg-blue-700 hover:text-white duration-200 ease-in-out font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Create Account'}
              </button>
            </div>
            )}

          

            {/* Show user info and navigation if logged in */}
            {user && (
              <div className="flex flex-col gap-4 mt-6">
                  <p className="text-lg text-gray-700">
                  {user.role === 'police' ? (
                    <>Welcome, <span className="font-semibold text-blue-700">{user.name}</span>!</>
                  ) : (
                    <>Welcome <span className="font-semibold text-blue-700">Citizen of India</span>!</>
                  )}
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  {user.role === 'police' ? (
                    // Police user buttons
                    <>
                      <a
                        href="https://ai-powered-legal-assistance-tool-dual-70lt.onrender.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Send Evidence
                      </a>
                      <Link
                        to="/therapy-bot"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Therapy Assistant
                      </Link>
                      <a
                        href="https://law-backend-sfjs.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Legal Assistant
                      </a>
                      <a
                        href="https://project-backend-p73p.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-400 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Police Portal
                      </a>
                      <a
                        href="https://bhashinillm-backend.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        MultiLingual Assistant
                      </a>
                    </>
                  ) : (
                    // Citizen user buttons
                    <>
                      <a
                        href="https://chatroom-nkdd.onrender.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-lg text-white rounded-lg shadow-md font-semibold"
                        >
                        Community Chat
                      </a>
                      <Link
                        to="/therapy-bot"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Therapy Assistant
                      </Link>
                      <a
                        href="https://law-backend-sfjs.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Legal Assistant
                      </a>
                      <a
                        href="https://project-backend-p73p.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-400 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        Police Portal
                      </a>
                      <a
                        href="https://bhashinillm-backend.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animated-btn px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-lg text-white rounded-lg shadow-md font-semibold"
                      >
                        MultiLingual Assistant
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}
                 <div className="flex flex-row flex-wrap gap-20 mt-5 justify-center items-end">
                <img 
                  src={getImageSrc('image1.webp')}
                  alt="Legal AI Illustration 1" 
                  aria-label="AI Legal Illustration 1"
                  className="w-52 h-52 object-cover rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                  style={{ marginBottom: '2rem' }}
                  onError={() => handleImageError('image1.webp')}
                />
                <img 
                  src={getImageSrc('image2.webp')}
                  alt="Legal AI Illustration 2" 
                  aria-label="AI Legal Illustration 2"
                  className="w-52 h-52 object-cover rounded-2xl shadow-xl transform transition duration-300 hover:scale-110 hover:shadow-2xl animate-fade-in-up"
                  style={{ marginBottom: '2rem' }}
                  onError={() => handleImageError('image2.webp')}
                />
                <img 
                  src={getImageSrc('image3.png')}
                  alt="Legal AI Illustration 3" 
                  aria-label="AI Legal Illustration 3"
                  className="w-52 h-52 object-cover rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                  style={{ marginBottom: '2rem' }}
                  onError={() => handleImageError('image3.png')}
                />
              </div>

          </div>
          {/* Temporarily removed banner image
          <img
            src={banner}
            width={500}
            height={500}
            alt="banner"
            className="scale-x-[-1]"
          />
          */}
        </div>

        {/* Modal for Sign In / Sign Up forms */}
        <Modal show={currentForm !== null} onClose={handleCloseForm}>
          {currentForm === 'signin' && <SignIn />}
          {currentForm === 'signup' && <SignUp onSwitchToSignIn={handleShowSignIn} />}
        </Modal>

      </div>
    </div>
  );
}

export default Home; 
