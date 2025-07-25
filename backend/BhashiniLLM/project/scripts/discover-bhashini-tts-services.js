import fetch from 'node-fetch';

const API_KEY = process.env.INFERENCEAPIKEY || 'W5WdUovCGx87wGCvu4Wcw7lFlk90_gUDV8RXpVu3vr3HuylR2BrrIwQSEGz0l9Lk';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': API_KEY
};

const endpoints = [
  'https://dhruva-api.bhashini.gov.in/services/inference/model/list',
  'https://dhruva-api.bhashini.gov.in/services/inference/pipeline/list',
  'https://dhruva-api.bhashini.gov.in/services/inference/services/list'
];

const payloads = [
  { task: 'tts' },
  { pipelineTasks: [{ taskType: 'tts' }] },
  { taskType: 'tts' }
];

async function tryEndpoints() {
  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        console.log(`\nTrying endpoint: ${endpoint}`);
        console.log(`Payload: ${JSON.stringify(payload)}`);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && (data.models || data.pipelineResponse || data.services)) {
          const list = data.models || data.pipelineResponse || data.services;
          for (const service of list) {
            const langs = (service.languages || []).map(l => l.sourceLanguage).join(', ');
            const gender = service.gender || 'unknown';
            console.log(`Service ID: ${service.serviceId || service.modelId}`);
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
        } else {
          console.log('No TTS services found or error:', data);
        }
      } catch (err) {
        console.error(`Error querying ${endpoint}:`, err);
      }
    }
  }
}

tryEndpoints(); 