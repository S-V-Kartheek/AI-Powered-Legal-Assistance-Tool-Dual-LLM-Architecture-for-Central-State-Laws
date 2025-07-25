// TypeScript: Add missing types for SpeechRecognition
// These are available in browsers but may not be in TS by default

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  // Minimal SpeechRecognition type for TS
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
  }
  interface SpeechRecognitionEvent extends Event {
    results: {
      0: {
        0: {
          transcript: string;
        }
      }
    }
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      const SpeechRecognitionCtor = (window.SpeechRecognition || window.webkitSpeechRecognition) as typeof window.SpeechRecognition;
      if (SpeechRecognitionCtor) {
        this.recognition = new SpeechRecognitionCtor();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  startListening(language: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.lang = language;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (_event: SpeechRecognitionErrorEvent) => {
        reject(new Error(_event.error));
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

// Bhashini API Configuration
const BHASHINI_CONFIG = {
  userId: 'ef7620e0bfea434886a6a1a62e37b0cb',
  apiKey: 'W5WdUovCGx87wGCvu4Wcw7lFlk90_gUDV8RXpVu3vr3HuylR2BrrIwQSEGz0l9Lk',
  baseUrl: 'https://meity-auth.ulcacontrib.org'
};

const BHASHINI_HEADERS = {
  'Authorization': `Bearer ${BHASHINI_CONFIG.apiKey}`,
  'Content-Type': 'application/json',
  'UserID': BHASHINI_CONFIG.userId
};

// Language code mapping for Bhashini API
const BHASHINI_LANGUAGE_MAP: Record<string, string> = {
  'en-US': 'en',
  'hi-IN': 'hi',
  'bn-IN': 'bn',
  'te-IN': 'te',
  'mr-IN': 'mr',
  'ta-IN': 'ta',
  'gu-IN': 'gu',
  'kn-IN': 'kn',
  'ml-IN': 'ml',
  'pa-IN': 'pa',
  'or-IN': 'or',
  'as-IN': 'as',
  'ur-IN': 'ur',
  'sd-IN': 'sd',
  'kok-IN': 'kok',
  'ne-IN': 'ne',
  'mai-IN': 'mai',
  'bho-IN': 'bho',
  'mni-IN': 'mni',
  'sa-IN': 'sa'
};

// Bhashini API Translation Service
export const bhashiniTranslationService = {
  async getModelId(taskType: string, sourceLang: string, targetLang: string): Promise<string | null> {
    const payload = {
      task: taskType,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      domain: 'all',
      submitter: 'all',
      userId: null
    };
    try {
      const response = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/search`, {
        method: 'POST',
        headers: BHASHINI_HEADERS,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        return data.data[0].modelId;
      }
      return null;
    } catch (e) {
      console.error('Bhashini model search error:', e);
      return null;
    }
  },

  async translateToEnglish(sourceText: string, sourceLang: string): Promise<string> {
    // Use language code mapping if needed
    const srcLang = sourceLang.split('-')[0];
    const modelId = await this.getModelId('translation', srcLang, 'en');
    if (!modelId) {
      console.error('No modelId found for translation');
      return sourceText;
    }
    const payload = {
      modelId: modelId,
      task: 'translation',
      input: [
        { source: sourceText }
      ],
      language: {
        sourceLanguage: srcLang,
        targetLanguage: 'en'
      }
    };
    try {
      const response = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/compute`, {
        method: 'POST',
        headers: BHASHINI_HEADERS,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && data.output && data.output[0] && data.output[0].target) {
        return data.output[0].target;
      } else {
        console.error('Translation error:', data);
        return sourceText;
      }
    } catch (e) {
      console.error('Exception calling Bhashini pipeline:', e);
      return sourceText;
    }
  },

  async translateFromEnglish(text: string, toLanguage: string): Promise<string> {
    if (toLanguage === 'en-US' || toLanguage === 'en') {
      return text;
    }
    // Use language code mapping if needed
    const tgtLang = toLanguage.split('-')[0];
    const modelId = await this.getModelId('translation', 'en', tgtLang);
    if (!modelId) {
      console.error('No modelId found for translation');
      return text;
    }
    const payload = {
      modelId: modelId,
      task: 'translation',
      input: [
        { source: text }
      ],
      language: {
        sourceLanguage: 'en',
        targetLanguage: tgtLang
      }
    };
    try {
      const response = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/compute`, {
        method: 'POST',
        headers: BHASHINI_HEADERS,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && data.output && data.output[0] && data.output[0].target) {
        return data.output[0].target;
      } else {
        console.error('Translation error:', data);
        return text;
      }
    } catch (e) {
      console.error('Exception calling Bhashini pipeline:', e);
      return text;
    }
  }
};

export const mockLLMService = {
  async processQuery(query: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced LLM responses for government services
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('license') || queryLower.includes('driving') || queryLower.includes('renew')) {
      return 'To renew your driver\'s license, you can visit our online portal at gov.example.com/license-renewal or visit any DMV office with your current license, proof of residence, and renewal fee. The process typically takes 15-20 minutes online or 30-45 minutes in person.';
    }
    
    if (queryLower.includes('passport')) {
      return 'To apply for a passport, you need Form DS-11, proof of U.S. citizenship (birth certificate or naturalization certificate), valid photo ID, passport photo, and fees ($130 for adults). Apply at any passport acceptance facility or post office. Processing takes 6-8 weeks for routine service.';
    }
    
    if (queryLower.includes('office') || queryLower.includes('hours') || queryLower.includes('time')) {
      return 'Our government offices are open Monday through Friday from 8:00 AM to 5:00 PM, and Saturday from 9:00 AM to 1:00 PM. We are closed on federal holidays. For urgent matters, please call our 24/7 helpline at 1-800-GOV-HELP.';
    }
    
    if (queryLower.includes('tax') || queryLower.includes('filing')) {
      return 'For tax-related services, you can file online at irs.gov, visit our tax assistance center, or call 1-800-829-1040. Tax filing deadline is April 15th. Free filing assistance is available for households earning less than $73,000 annually.';
    }
    
    if (queryLower.includes('birth certificate') || queryLower.includes('vital records')) {
      return 'To obtain a birth certificate, visit our vital records office with valid ID and $25 fee. You can also apply online at vitalrecords.gov. Processing takes 3-5 business days in person or 2-3 weeks by mail. Certified copies are available for legal purposes.';
    }
    
    if (queryLower.includes('social security') || queryLower.includes('ssn')) {
      return 'For Social Security services, visit your local SSA office or go to ssa.gov. You can apply for a new card, replacement card, or update your information online. Bring valid identification and required documents. Most services are free of charge.';
    }
    
    return 'Thank you for your inquiry about government services. Based on your question, I recommend visiting our main service center at 123 Government Plaza or calling our citizen helpline at 1-800-GOV-HELP for personalized assistance. Our staff can provide detailed information and guide you through the specific process you need.';
  }
};

// Google LLM API Service
export const googleLLMService = {
  async processQuery(query: string): Promise<string> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyBdxZ6zZID1bEirZrtXbJsrfDSDGhrgxi0'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: query }
              ]
            }
          ]
        })
      });
      const data = await response.json();
      if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Gemini API error:', data);
        return 'Sorry, there was an error processing your request.';
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, there was an error processing your request.';
    }
  }
};