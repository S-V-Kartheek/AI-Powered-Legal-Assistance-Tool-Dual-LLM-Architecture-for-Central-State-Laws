export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
}

export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  currentStep: string | null;
  inputText: string;
  originalTranscription: string; // New: raw speech-to-text in user's language
  translatedText: string;
  llmResponse: string;
  finalResponse: string;
  selectedLanguage: Language;
  inputMethod: 'voice' | 'text';
}