// Bhashini ULCA TTS API test utility (CommonJS version for Node.js)
const fetch = require('node-fetch');

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

/**
 * Convert text to speech using Bhashini pipeline API.
 * @param {string} text - The text to convert to speech.
 * @param {string} targetLanguage - The language code for TTS (e.g., 'hi', 'te', 'en').
 * @param {string} ttsServiceId - The TTS service ID to use (e.g., 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4').
 * @returns {Promise<string|null>} - Base64 audio or null on error.
 */
async function testBhashiniTTS(text: string, targetLanguage: string, ttsServiceId: string): Promise<string | null> {
  try {
    // 1. Find a TTS model for the language and gender
    const modelSearchPayload = {
      task: 'tts',
      sourceLanguage: targetLanguage,
      gender: 'female', // Default gender, can be overridden by fallback
      domain: 'general',
      submitter: 'all',
      userId: null
    };

    let searchRes = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/search`, {
      method: 'POST',
      headers: BHASHINI_HEADERS,
      body: JSON.stringify(modelSearchPayload)
    });
    let searchData = await searchRes.json();

    // Fallback: try the other gender if none found
    if (!searchData.data || !searchData.data[0] || !searchData.data[0].modelId) {
      const fallbackGender = modelSearchPayload.gender === 'female' ? 'male' : 'female';
      modelSearchPayload.gender = fallbackGender;
      searchRes = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/search`, {
        method: 'POST',
        headers: BHASHINI_HEADERS,
        body: JSON.stringify(modelSearchPayload)
      });
      searchData = await searchRes.json();
      if (!searchData.data || !searchData.data[0] || !searchData.data[0].modelId) {
        console.error('No TTS model found for language', targetLanguage);
        return null;
      }
    }

    const modelId = searchData.data[0].modelId;
    console.log('Using TTS model:', modelId);

    // 2. Synthesize speech
    const ttsPayload = {
      modelId,
      task: 'tts',
      input: [{ source: text }],
      config: {
        gender: 'female', // Default gender, can be overridden by fallback
        language: { sourceLanguage: targetLanguage }
      }
    };

    // [REMOVED] Old TTS endpoint call at line 63
    // const ttsRes = await fetch(`${BHASHINI_CONFIG.baseUrl}/ulca/apis/v0/model/compute`, {
    //   method: 'POST',
    //   headers: BHASHINI_HEADERS,
    //   body: JSON.stringify(ttsPayload)
    // });
    // const ttsData = await ttsRes.json();
    // if (ttsData && ttsData.audio && ttsData.audio[0] && ttsData.audio[0].audioContent) {
    //   return ttsData.audio[0].audioContent;
    // } else {
    //   console.error('TTS error:', ttsData);
    //   return null;
    // }
    // At the end, if all else fails
    return null;
  } catch (error) {
    console.error('TTS function error:', error);
    return null;
  }
}

// Standalone test runner
if (require.main === module) {
  (async () => {
    const audioBase64 = await testBhashiniTTS('भारत मेरा देश है', 'hi', 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4');
    if (audioBase64) {
      console.log('Audio base64 output (truncated):', audioBase64.slice(0, 100) + '...');
    } else {
      console.log('No audio returned.');
    }
  })();
}

module.exports = { testBhashiniTTS }; 