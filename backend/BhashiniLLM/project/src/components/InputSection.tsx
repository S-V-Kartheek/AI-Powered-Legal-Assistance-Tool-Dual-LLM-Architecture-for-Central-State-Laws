import React, { useRef } from 'react';
import { Mic, MicOff, Type, Send } from 'lucide-react';
import { VoiceWaveform } from './VoiceWaveform';

interface InputSectionProps {
  inputMethod: 'voice' | 'text';
  onInputMethodChange: (method: 'voice' | 'text') => void;
  inputText: string;
  onInputTextChange: (text: string) => void;
  isListening: boolean;
  isProcessing: boolean;
  onStartVoiceInput: () => void;
  onStopVoiceInput: () => void;
  onSubmitText: () => void;
  originalTranscription?: string;
  selectedLanguage?: { code: string; name: string };
  translatedText?: string;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputMethod,
  onInputMethodChange,
  inputText,
  onInputTextChange,
  isListening,
  isProcessing,
  onStartVoiceInput,
  onStopVoiceInput,
  onSubmitText,
  originalTranscription,
  selectedLanguage,
  translatedText
}) => {
  const canSubmitText = inputText.trim().length > 0 && !isProcessing;

  return (
    <div className="space-y-4">
      {/* Input Method Toggle */}
      <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        <button
          onClick={() => onInputMethodChange('voice')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMethod === 'voice'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Mic className="h-4 w-4 inline mr-2" />
          Voice
        </button>
        <button
          onClick={() => onInputMethodChange('text')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMethod === 'text'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Type className="h-4 w-4 inline mr-2" />
          Text
        </button>
      </div>

      {/* Voice Input */}
      {inputMethod === 'voice' && (
        <div className="flex flex-col items-center space-y-4">
          <VoiceWaveform isActive={isListening} className="mb-2" />
          
          {!isListening ? (
            <button
              onClick={onStartVoiceInput}
              disabled={isProcessing}
              className="w-16 h-16 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Mic className="h-8 w-8 text-white" />
            </button>
          ) : (
            <button
              onClick={onStopVoiceInput}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse"
            >
              <MicOff className="h-8 w-8 text-white" />
            </button>
          )}
          
          <p className="text-sm text-gray-600 text-center">
            {isListening ? 'Listening... Speak your question' : 'Tap to start speaking'}
          </p>
        </div>
      )}

      {/* Text Input */}
      {inputMethod === 'text' && (
        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => onInputTextChange(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isProcessing}
          />
          <button
            onClick={onSubmitText}
            disabled={!canSubmitText}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Question</span>
          </button>
        </div>
      )}

      {/* Display original transcription for voice input */}
      {inputMethod === 'voice' && originalTranscription && !isListening && (
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 mb-1">
            Original transcription{selectedLanguage && selectedLanguage.code !== 'en-US' ? ` (${selectedLanguage.name})` : ''}:
          </p>
          <p className="text-gray-800">{originalTranscription}</p>
        </div>
      )}

      {/* Display transcribed (translated) text for voice input */}
      {inputMethod === 'voice' && translatedText && !isListening && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Transcribed text (English):</p>
          <p className="text-blue-900">{translatedText}</p>
        </div>
      )}
    </div>
  );
};