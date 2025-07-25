import React, { useRef, useState } from 'react';
import SupportSafeNavbar from '../components/SupportSafeNavbar';

const StegoBot = () => {
  // State for encode
  const [encodeImage, setEncodeImage] = useState(null);
  const [encodeImageName, setEncodeImageName] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [encodeStatus, setEncodeStatus] = useState('');
  const [encodeStatusType, setEncodeStatusType] = useState('info');
  const [encodedImageUrl, setEncodedImageUrl] = useState('');
  const [isEncoding, setIsEncoding] = useState(false);

  // State for decode
  const [decodeImage, setDecodeImage] = useState(null);
  const [decodeImageName, setDecodeImageName] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [decodeStatus, setDecodeStatus] = useState('');
  const [decodeStatusType, setDecodeStatusType] = useState('info');
  const [isDecoding, setIsDecoding] = useState(false);

  // Refs for file inputs
  const encodeInputRef = useRef();
  const decodeInputRef = useRef();

  // Handlers for encode
  const handleEncodeImageChange = (e) => {
    const file = e.target.files[0];
    setEncodeImage(file);
    setEncodeImageName(file ? file.name : '');
    setEncodedImageUrl('');
    setEncodeStatus('');
  };

  const handleEncode = async () => {
    if (!encodeImage) {
      setEncodeStatus('Please select a PNG image to encode.');
      setEncodeStatusType('error');
      return;
    }
    if (!secretMessage.trim()) {
      setEncodeStatus('Please enter a secret message.');
      setEncodeStatusType('error');
      return;
    }
    setIsEncoding(true);
    setEncodeStatus('Encoding message...', 'info');
    setEncodeStatusType('info');
    setEncodedImageUrl('');
    try {
      const formData = new FormData();
      formData.append('image', encodeImage);
      formData.append('text', secretMessage);
      const res = await fetch('http://localhost:3002/steggy/encode', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Encoding failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setEncodedImageUrl(url);
      setEncodeStatus('✅ Message encoded successfully! Click the image to download.', 'success');
      setEncodeStatusType('success');
    } catch (err) {
      setEncodeStatus('Encoding failed. Please try again.', 'error');
      setEncodeStatusType('error');
    } finally {
      setIsEncoding(false);
    }
  };

  // Handlers for decode
  const handleDecodeImageChange = (e) => {
    const file = e.target.files[0];
    setDecodeImage(file);
    setDecodeImageName(file ? file.name : '');
    setDecodedMessage('');
    setDecodeStatus('');
  };

  const handleDecode = async () => {
    if (!decodeImage) {
      setDecodeStatus('Please select a PNG image to decode.');
      setDecodeStatusType('error');
      return;
    }
    setIsDecoding(true);
    setDecodeStatus('Decoding message...', 'info');
    setDecodeStatusType('info');
    setDecodedMessage('');
    try {
      const formData = new FormData();
      formData.append('image', decodeImage);
      const res = await fetch('http://localhost:3002/steggy/decode', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Decoding failed');
      const data = await res.json();
      if (data.text) {
        setDecodedMessage(data.text);
        setDecodeStatus('✅ Message decoded successfully!', 'success');
        setDecodeStatusType('success');
      } else {
        setDecodeStatus('❌ No hidden message found in this image.', 'error');
        setDecodeStatusType('error');
      }
    } catch (err) {
      setDecodeStatus('Decoding failed. Please try again.', 'error');
      setDecodeStatusType('error');
    } finally {
      setIsDecoding(false);
    }
  };

  // Download handler for encoded image
  const handleDownload = () => {
    if (encodedImageUrl) {
      const link = document.createElement('a');
      link.href = encodedImageUrl;
      link.download = 'encoded_message.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SupportSafeNavbar />
      <div className="max-w-5xl mx-auto pt-28 pb-12 px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            🔐 Steganography Bot
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Hide and reveal secret messages within images using advanced steganography techniques
          </p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Encode Card */}
          <section className="card bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                🔒
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Encode Message</h2>
                <p className="text-sm text-gray-500 mt-1">Hide your secret message in a PNG image</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Select PNG Image</label>
              <div className="relative">
                <input
                  ref={encodeInputRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={handleEncodeImageChange}
                />
                <button
                  type="button"
                  className={`w-full py-3 px-4 border-2 border-dashed rounded-lg text-gray-500 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition font-medium ${encodeImage ? 'border-green-400 bg-green-50 text-green-700' : ''}`}
                  onClick={() => encodeInputRef.current.click()}
                >
                  {encodeImageName ? `📁 ${encodeImageName}` : '📁 Choose a PNG image file'}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Secret Message</label>
              <textarea
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:bg-white bg-gray-50 font-medium resize-vertical min-h-[100px] transition"
                placeholder="Enter your secret message here..."
                value={secretMessage}
                onChange={e => setSecretMessage(e.target.value)}
                rows={4}
              />
            </div>
            <button
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleEncode}
              disabled={isEncoding}
            >
              {isEncoding ? <span className="loading spinner-border animate-spin w-5 h-5 border-2 border-white border-t-blue-500 rounded-full"></span> : '🔒 Encode & Download'}
            </button>
            {encodedImageUrl && (
              <div className="image-preview mt-4 text-center">
                <img
                  src={encodedImageUrl}
                  alt="Encoded Preview"
                  className="max-w-full max-h-48 rounded-lg shadow-md cursor-pointer inline-block"
                  onClick={handleDownload}
                  title="Click to download"
                />
                <div className="text-xs text-gray-500 mt-2">Click the image to download</div>
              </div>
            )}
            {encodeStatus && (
              <div className={`mt-4 p-3 rounded-lg font-semibold text-sm ${encodeStatusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : encodeStatusType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {encodeStatus}
              </div>
            )}
          </section>
          {/* Decode Card */}
          <section className="card bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                🔍
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Decode Message</h2>
                <p className="text-sm text-gray-500 mt-1">Extract hidden messages from encoded images</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Select PNG Image</label>
              <div className="relative">
                <input
                  ref={decodeInputRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={handleDecodeImageChange}
                />
                <button
                  type="button"
                  className={`w-full py-3 px-4 border-2 border-dashed rounded-lg text-gray-500 bg-gray-50 hover:border-green-400 hover:bg-green-50 transition font-medium ${decodeImage ? 'border-green-400 bg-green-50 text-green-700' : ''}`}
                  onClick={() => decodeInputRef.current.click()}
                >
                  {decodeImageName ? `📁 ${decodeImageName}` : '📁 Choose a PNG image file'}
                </button>
              </div>
            </div>
            <button
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleDecode}
              disabled={isDecoding}
            >
              {isDecoding ? <span className="loading spinner-border animate-spin w-5 h-5 border-2 border-white border-t-green-500 rounded-full"></span> : '🔍 Decode Message'}
            </button>
            {decodedMessage && (
              <div className="decoded-message mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 break-words">
                {decodedMessage}
              </div>
            )}
            {decodeStatus && (
              <div className={`mt-4 p-3 rounded-lg font-semibold text-sm ${decodeStatusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : decodeStatusType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {decodeStatus}
              </div>
            )}
          </section>
        </main>
        <section className="features grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="feature bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 text-gray-700 shadow">
            <div className="feature-icon text-3xl mb-2">🛡️</div>
            <h3 className="font-bold text-lg mb-1">Secure</h3>
            <p className="text-sm opacity-90">Messages are hidden using advanced steganography techniques</p>
          </div>
          <div className="feature bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 text-gray-700 shadow">
            <div className="feature-icon text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-lg mb-1">Fast</h3>
            <p className="text-sm opacity-90">Quick encoding and decoding with minimal image quality loss</p>
          </div>
          <div className="feature bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 text-gray-700 shadow">
            <div className="feature-icon text-3xl mb-2">🔒</div>
            <h3 className="font-bold text-lg mb-1">Private</h3>
            <p className="text-sm opacity-90">Your messages remain completely hidden from prying eyes</p>
          </div>
        </section>
      </div>
  </div>
);
};

export default StegoBot; 