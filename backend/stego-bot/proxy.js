const express = require('express');
const axios = require('axios');
const steggy = require('steggy-noencrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const StegCloak = require('stegcloak');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors()); // Add this line to enable CORS for all origins

// Middleware to parse JSON bodies
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Proxy endpoint for Replicate API
app.post('/proxy/replicate', async (req, res) => {
  try {
    const { prompt, width, height } = req.body;
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'b21cbe271e65c1718f2999b038c18b45e21e4fba7d3d90dadd9e0b02b2abb9f3', // FLUX.1 [schnell]
        input: { prompt, width, height, num_outputs: 1 }
      },
      {
        headers: {
          'Authorization': 'Token r8_bJwtIfYgL6K2zAH2jAVckO7xhseFtgu0QOv1T',
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data.detail : 'Proxy request failed'
    });
  }
});

// Proxy endpoint to check prediction status
app.get('/proxy/replicate/:predictionId', async (req, res) => {
  try {
    const { predictionId } = req.params;
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': 'Token r8_bJwtIfYgL6K2zAH2jAVckO7xhseFtgu0QOv1T'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy status error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data.detail : 'Proxy status request failed'
    });
  }
});

// --- IMAGE STEGANOGRAPHY ENDPOINTS ---
// Encode: POST /steggy/encode (multipart form with image and text)
app.post('/steggy/encode', upload.single('image'), (req, res) => {
  try {
    if (!req.file || !req.body.text) {
      return res.status(400).json({ error: 'image and text are required' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const text = req.body.text;
    
    // Encode text into image
    const encodedImage = steggy.encode(imageBuffer, text);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.set('Content-Type', 'image/png');
    res.send(encodedImage);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Image encoding failed', details: error.message });
  }
});

// Decode: POST /steggy/decode (multipart form with image)
app.post('/steggy/decode', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'image is required' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    
    // Decode text from image
    const decodedText = steggy.decode(imageBuffer);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ text: decodedText });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Image decoding failed', details: error.message });
  }
});

// --- STEGCLOAK TEXT STEGANOGRAPHY ENDPOINTS ---
// Encode: POST /stegcloak/encode { cover, secret, password }
app.post('/stegcloak/encode', (req, res) => {
  try {
    const { cover, secret, password } = req.body;
    if (!cover || !secret) {
      return res.status(400).json({ error: 'cover and secret are required' });
    }
    const stegged = StegCloak.hide(secret, password || '', cover);
    res.json({ stegged });
  } catch (error) {
    res.status(500).json({ error: 'Encoding failed', details: error.message });
  }
});

// Decode: POST /stegcloak/decode { stegged, password }
app.post('/stegcloak/decode', (req, res) => {
  try {
    const { stegged, password } = req.body;
    if (!stegged) {
      return res.status(400).json({ error: 'stegged is required' });
    }
    const secret = StegCloak.reveal(stegged, password || '');
    res.json({ secret });
  } catch (error) {
    res.status(500).json({ error: 'Decoding failed', details: error.message });
  }
});

// Simple /api/chat endpoint for TherapyBot
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({ response: `Echo: ${message}` });
});

// Serve static files (e.g., index.html, lib/stegcloak.min.js if added later)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Stego Bot server running at http://localhost:${port}`);
}); 