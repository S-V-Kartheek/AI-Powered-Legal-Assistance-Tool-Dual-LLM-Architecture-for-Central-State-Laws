import fetch from 'node-fetch';

const BHASHINI_PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline/list';
const INFERENCE_API_KEY = process.env.INFERENCEAPIKEY || 'W5WdUovCGx87wGCvu4Wcw7lFlk90_gUDV8RXpVu3vr3HuylR2BrrIwQSEGz0l9Lk';

const BHASHINI_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': INFERENCE_API_KEY
};

async function listTTSModels() {
  const body = {
    task: 'tts'
  };
  const response = await fetch(BHASHINI_PIPELINE_URL, {
    method: 'POST',
    headers: BHASHINI_HEADERS,
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (result && result.pipelineResponse) {
    for (const service of result.pipelineResponse) {
      if (service.languages && service.languages.length > 0) {
        const langs = service.languages.map(l => l.sourceLanguage).join(', ');
        const gender = service.gender || 'unknown';
        console.log(`Service ID: ${service.serviceId}`);
        console.log(`  Languages: ${langs}`);
        console.log(`  Gender: ${gender}`);
        if (gender.toLowerCase() === 'male') {
          console.log('  --> Supports MALE voice');
        } else if (gender.toLowerCase() === 'female') {
          console.log('  --> Supports FEMALE voice');
        } else {
          console.log('  --> Gender unknown or not specified');
        }
        console.log('---');
      }
    }
  } else {
    console.error('No TTS services found or error:', result);
  }
}

listTTSModels(); 