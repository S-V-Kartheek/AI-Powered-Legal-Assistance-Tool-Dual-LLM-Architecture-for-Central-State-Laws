// Convert to ESM
// Change all require to import
// Change module.exports to export
// Rename file to llm-proxy.mjs

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
import { testBhashiniTTS } from './src/utils/bhashiniTTS.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

// Validate required environment variables
if (!GOOGLE_API_KEY) {
  console.warn('Warning: GOOGLE_API_KEY is not set. LLM functionality will not work.');
}

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BhashiniLLM backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/llm', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }
    const body = {
      contents: [
        {
          parts: [
            { text: query }
          ]
        }
      ]
    };
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'LLM error' });
    }
    const llmText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text: llmText });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text, targetLanguage, ttsServiceId, gender } = req.body;
  if (!text || !targetLanguage || !ttsServiceId) {
    return res.status(400).json({ error: 'Missing text, targetLanguage, or ttsServiceId' });
  }
  
  // Check if INFERENCEAPIKEY is set
  if (!process.env.INFERENCEAPIKEY) {
    return res.status(500).json({ error: 'TTS API key not configured. Please set INFERENCEAPIKEY environment variable.' });
  }
  
  try {
    const audioBase64 = await testBhashiniTTS(text, targetLanguage, ttsServiceId, gender);
    if (!audioBase64) {
      return res.status(500).json({ error: 'TTS failed or no audio returned.' });
    }
    // Save audio to file in the fixed path
    const filename = `audio_${Date.now()}.wav`;
    const audioDir = path.join(__dirname, 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, Buffer.from(audioBase64, 'base64'));
    res.json({ audioBase64, filename, message: 'TTS successful' });
  } catch (err) {
    console.error('TTS API error:', err);
    res.status(500).json({ error: 'TTS error', details: err.message });
  }
});

// Serve audio files statically
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Serve frontend build statically
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`LLM/TTS proxy server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    console.error('You can set a different port using the PORT environment variable.');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 
