import React, { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, className = '' }) => {
  const [bars, setBars] = useState<number[]>([1, 1, 1, 1, 1]);

  useEffect(() => {
    if (!isActive) {
      setBars([1, 1, 1, 1, 1]);
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 100 + 20));
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`flex items-center justify-center space-x-1 h-8 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          style={{
            height: isActive ? `${height}%` : '20%',
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
};