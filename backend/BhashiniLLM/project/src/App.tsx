import React from 'react';
import { Languages, Shield, Headphones } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { InputSection } from './components/InputSection';
import { ProcessingSteps } from './components/ProcessingSteps';
import { ResponseSection } from './components/ResponseSection';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';

function App() {
  const {
    inputMethod,
    inputText,
    isListening,
    isProcessing,
    selectedLanguage,
    finalResponse,
    steps,
    isSpeaking,
    startListening,
    stopListening,
    processQuery,
    playAudio,
    stopAudio,
    setInputText,
    setInputMethod,
    setSelectedLanguage,
    originalTranscription,
    translatedText,
    llmResponse,
    ttsAudioBase64,
    ttsAudioFilename,
    ttsError
  } = useVoiceAssistant();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Languages className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Multilingual Voice Assistant</h1>
                <p className="text-sm text-gray-600">Government Services Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask Your Question</h2>
              <InputSection
                inputMethod={inputMethod}
                onInputMethodChange={setInputMethod}
                inputText={inputText}
                onInputTextChange={setInputText}
                isListening={isListening}
                isProcessing={isProcessing}
                onStartVoiceInput={startListening}
                onStopVoiceInput={stopListening}
                onSubmitText={() => processQuery()}
                originalTranscription={originalTranscription}
                selectedLanguage={selectedLanguage}
                translatedText={translatedText}
              />
            </div>

            {/* Response Section */}
            {finalResponse && (
              <ResponseSection
                response={finalResponse}
                language={selectedLanguage.name}
                isSpeaking={isSpeaking}
                onPlayAudio={playAudio}
                onStopAudio={stopAudio}
                llmResponse={llmResponse} // Pass LLM response in English
                ttsAudioBase64={ttsAudioBase64} // Pass TTS audio
                ttsAudioFilename={ttsAudioFilename} // Pass TTS audio filename
                ttsError={ttsError}
              />
            )}
          </div>

          {/* Processing Steps & Info */}
          <div className="space-y-6">
            {/* Processing Steps */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Status</h3>
              <ProcessingSteps steps={steps} />
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Processing</p>
                    <p className="text-xs text-gray-600">All data is processed securely using Bashing API</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Languages className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Multi-Language Support</p>
                    <p className="text-xs text-gray-600">Communicate in your preferred language</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Headphones className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Voice & Text Input</p>
                    <p className="text-xs text-gray-600">Choose your preferred interaction method</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
              <ol className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  Select your preferred language
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  Choose voice or text input
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  Ask your question about government services
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  Listen to the response in your language
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Powered by Bashing API • Multilingual AI Assistant</p>
            <p className="mt-1">© 2025 Government Services Portal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;