import { useState, useCallback, useRef } from 'react';
import { VoiceAssistantState, ProcessingStep, Language } from '../types';
import { 
  SpeechRecognitionService, 
  bhashiniTranslationService, 
  googleLLMService 
} from '../utils/speechUtils';
import { SUPPORTED_LANGUAGES } from '../data/languages';

const initialSteps: ProcessingStep[] = [
  {
    id: 'speech-to-text',
    name: 'Converting Speech to Text',
    status: 'pending',
    description: 'Converting your voice input to English text using Bashing API'
  },
  {
    id: 'llm-processing',
    name: 'Processing with LLM',
    status: 'pending',
    description: 'Analyzing your question with our AI model'
  },
  {
    id: 'translation',
    name: 'Translating Response',
    status: 'pending',
    description: 'Converting response to your local language using Bashing API'
  },
  {
    id: 'text-to-speech',
    name: 'Generating Audio',
    status: 'pending',
    description: 'Creating voice response using Bashing API'
  }
];

export const useVoiceAssistant = () => {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    isProcessing: false,
    currentStep: null,
    inputText: '',
    originalTranscription: '', // New state for raw transcription
    translatedText: '',
    llmResponse: '',
    finalResponse: '',
    selectedLanguage: SUPPORTED_LANGUAGES[0],
    inputMethod: 'voice'
  });

  const [steps, setSteps] = useState<ProcessingStep[]>(initialSteps);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAudioBase64, setTtsAudioBase64] = useState<string | null>(null);
  const [ttsAudioFilename, setTtsAudioFilename] = useState<string | null>(null);
  
  const speechRecognition = useRef(new SpeechRecognitionService());

  const updateStep = useCallback((stepId: string, updates: Partial<ProcessingStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const resetSteps = useCallback(() => {
    setSteps(initialSteps.map(step => ({ ...step, status: 'pending' as const })));
  }, []);

  const startListening = useCallback(async () => {
    if (!speechRecognition.current.isAvailable()) {
      alert('Speech recognition is not available in your browser.');
      return;
    }

    setState(prev => ({ ...prev, isListening: true, inputText: '' }));
    
    try {
      const transcript = await speechRecognition.current.startListening(state.selectedLanguage.code);
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        inputText: transcript, 
        originalTranscription: transcript // Store the raw transcription
      }));
      
      // Auto-process after voice input
      await processQuery(transcript);
    } catch (error) {
      console.error('Speech recognition error:', error);
      setState(prev => ({ 
        ...prev, 
        isListening: false 
      }));
      alert('Failed to recognize speech. Please try again.');
    }
  }, [state.selectedLanguage.code]);

  const stopListening = useCallback(() => {
    speechRecognition.current.stopListening();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const processQuery = useCallback(async (query: string = state.inputText) => {
    if (!query.trim()) return;

    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      translatedText: '', 
      llmResponse: '', 
      finalResponse: '' 
    }));
    setTtsAudioBase64(null);
    setTtsAudioFilename(null);
    resetSteps();

    try {
      // Step 1: Translation to English (if not already in English)
      updateStep('speech-to-text', { status: 'processing' });
      setState(prev => ({ ...prev, currentStep: 'speech-to-text' }));
      
      // Always use the original transcription for translation
      const originalText = state.originalTranscription || query;
      let englishText = originalText;
      if (state.selectedLanguage.code !== 'en-US') {
        englishText = await bhashiniTranslationService.translateToEnglish(originalText, state.selectedLanguage.code);
      }
      setState(prev => ({ ...prev, translatedText: englishText }));
      console.log('Translated to English:', englishText); // Log translated text
      updateStep('speech-to-text', { status: 'completed' });

      // Step 2: LLM Processing (Google LLM)
      updateStep('llm-processing', { status: 'processing' });
      setState(prev => ({ ...prev, currentStep: 'llm-processing' }));
      const llmResponse = await googleLLMService.processQuery(englishText);
      setState(prev => ({ ...prev, llmResponse }));
      console.log('LLM Response:', llmResponse); // Log LLM response
      updateStep('llm-processing', { status: 'completed' });

      // Step 3: Translate LLM response back to user's language if needed
      updateStep('translation', { status: 'processing' });
      setState(prev => ({ ...prev, currentStep: 'translation' }));
      let localizedResponse = llmResponse;
      if (state.selectedLanguage.code !== 'en-US') {
        localizedResponse = await bhashiniTranslationService.translateFromEnglish(llmResponse, state.selectedLanguage.code);
      }
      setState(prev => ({ ...prev, finalResponse: localizedResponse }));
      console.log('Response translated to user language:', localizedResponse); // Log response translation
      updateStep('translation', { status: 'completed' });

      // Step 4: Text-to-Speech preparation (Bhashini TTS API)
      updateStep('text-to-speech', { status: 'processing' });
      setState(prev => ({ ...prev, currentStep: 'text-to-speech' }));
      try {
        // Map language code to TTS service ID (updated to match available services)
        let ttsServiceId = '';
        let targetLanguage = state.selectedLanguage.code.split('-')[0];
        switch (targetLanguage) {
          case 'en':
            ttsServiceId = 'ai4bharat/indic-tts-coqui-misc-gpu--t4';
            break;
          case 'hi':
          case 'gu':
          case 'mr':
          case 'or':
          case 'pa':
          case 'bn':
            ttsServiceId = 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4';
            break;
          case 'te':
          case 'ta':
          case 'ml':
          case 'kn':
            ttsServiceId = 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4';
            break;
          default:
            ttsServiceId = 'ai4bharat/indic-tts-coqui-misc-gpu--t4'; // fallback to English model
        }
        // Debug log for TTS parameters
        console.log('TTS API call params:', {
          text: localizedResponse,
          targetLanguage,
          ttsServiceId,
          gender: 'female'
        });
        const ttsRes = await fetch('http://localhost:5001/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: localizedResponse,
            targetLanguage,
            ttsServiceId,
            gender: 'female'
          })
        });
        const ttsData = await ttsRes.json();
        if (ttsRes.ok && ttsData.audioBase64) {
          setTtsAudioBase64(ttsData.audioBase64);
          setTtsAudioFilename(ttsData.filename || null);
          setState(prev => ({ ...prev, ttsError: null }));
        } else {
          setTtsAudioBase64(null);
          setTtsAudioFilename(null);
          setState(prev => ({ ...prev, ttsError: ttsData.error || 'TTS failed. No model available.' }));
        }
      } catch (ttsErr) {
        console.error('TTS fetch error:', ttsErr);
        setTtsAudioBase64(null);
        setTtsAudioFilename(null);
        setState(prev => ({ ...prev, ttsError: 'TTS server error. Please try again.' }));
      }
      updateStep('text-to-speech', { status: 'completed' });

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentStep: null 
      }));

    } catch (error) {
      console.error('Processing error:', error);
      const currentStep = state.currentStep;
      if (currentStep) {
        updateStep(currentStep, { status: 'error' });
      }
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentStep: null 
      }));
      alert('Failed to process your query. Please try again.');
    }
  }, [state.inputText, state.selectedLanguage.code, state.currentStep, updateStep, resetSteps]);

  // Remove all browser TTS code (textToSpeech, playAudio, stopAudio, etc). Only use Bhashini TTS via backend API and setTtsAudioBase64.

  const setInputText = useCallback((text: string) => {
    setState(prev => ({ ...prev, inputText: text }));
  }, []);

  const setInputMethod = useCallback((method: 'voice' | 'text') => {
    setState(prev => ({ ...prev, inputMethod: method, inputText: '' }));
  }, []);

  const setSelectedLanguage = useCallback((language: Language) => {
    setState(prev => ({ ...prev, selectedLanguage: language }));
  }, []);

  return {
    ...state,
    steps,
    isSpeaking,
    ttsAudioBase64,
    ttsAudioFilename,
    setSelectedLanguage,
    setInputMethod,
    setInputText,
    startListening,
    stopListening,
    processQuery,
    // playAudio, // Removed as per edit hint
    resetSteps
  };
};