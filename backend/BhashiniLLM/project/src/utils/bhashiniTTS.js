import fetch from 'node-fetch';

const BHASHINI_PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const INFERENCE_API_KEY = process.env.INFERENCEAPIKEY;

const BHASHINI_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': INFERENCE_API_KEY
};

/**
 * Convert text to speech using Bhashini pipeline API.
 * @param {string} text - The text to convert to speech.
 * @param {string} targetLanguage - The language code for TTS (e.g., 'hi', 'te', 'en').
 * @param {string} ttsServiceId - The TTS service ID to use (e.g., 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4').
 * @param {string} gender - The gender for the TTS voice ('male' or 'female').
 * @returns {Promise<string|null>} - Base64 audio or null on error.
 */
export async function testBhashiniTTS(text, targetLanguage, ttsServiceId, gender = 'female') {
  try {
    const body = {
      pipelineTasks: [
        {
          taskType: 'tts',
          config: {
            language: { sourceLanguage: targetLanguage },
            serviceId: ttsServiceId,
            gender: gender,
            samplingRate: 8000
          }
        }
      ],
      inputData: {
        input: [
          { source: text }
        ]
      }
    };
    const response = await fetch(BHASHINI_PIPELINE_URL, {
      method: 'POST',
      headers: BHASHINI_HEADERS,
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (result && result.pipelineResponse && result.pipelineResponse[0] && result.pipelineResponse[0].audio && result.pipelineResponse[0].audio[0] && result.pipelineResponse[0].audio[0].audioContent) {
      return result.pipelineResponse[0].audio[0].audioContent;
    } else {
      console.error('TTS error:', result);
      return null;
    }
  } catch (error) {
    console.error('TTS function error:', error);
    return null;
  }
}
