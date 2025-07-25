import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ResponseSectionProps {
  response: string;
  language: string;
  isSpeaking: boolean;
  onPlayAudio: () => void;
  onStopAudio: () => void;
  llmResponse?: string; // Add prop for LLM response in English
  ttsAudioBase64?: string | null; // Add prop for TTS audio
  ttsAudioFilename?: string | null; // Add prop for TTS audio filename
}

export const ResponseSection: React.FC<ResponseSectionProps & { ttsError?: string }> = ({
  response,
  language,
  isSpeaking,
  onPlayAudio,
  onStopAudio,
  llmResponse,
  ttsAudioBase64,
  ttsAudioFilename,
  ttsError
}) => {
  if (!response) return null;

  // Remove all browser TTS code. Only play audio from ttsAudioBase64 prop using an <audio> tag if available.

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-800">Response</h3>
        <button
          onClick={isSpeaking ? onStopAudio : onPlayAudio}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking 
              ? 'bg-red-100 hover:bg-red-200 text-red-600' 
              : 'bg-green-100 hover:bg-green-200 text-green-600'
          }`}
          title={isSpeaking ? 'Stop audio' : 'Play audio'}
        >
          {isSpeaking ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Show LLM response in English if available and different from translated */}
      {llmResponse && llmResponse !== response && (
        <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded">
          <p className="text-xs text-gray-500 mb-1">LLM Response (English):</p>
          <p className="text-gray-700">{llmResponse}</p>
        </div>
      )}
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="font-semibold mb-2">Response ({language}):</div>
        <div className="text-gray-900 whitespace-pre-line">{response}</div>
      </div>
      {/* Show error if TTS failed */}
      {ttsError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          <strong>Text-to-Speech Error:</strong> {ttsError}
        </div>
      )}
      {/* Audio player for TTS output */}
      {!ttsError && ttsAudioBase64 && (
        <div className="mt-2">
          <audio controls src={`data:audio/wav;base64,${ttsAudioBase64}`} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {/* Download link for audio file */}
      {!ttsError && ttsAudioFilename && (
        <div className="mt-2">
          <a href={`/audio/${ttsAudioFilename}`} download className="text-blue-600 underline">Download Audio File</a>
        </div>
      )}
    </div>
  );
};