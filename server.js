import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handle Google Cloud credentials for Railway
// If credentials are provided as base64-encoded JSON in environment variable
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const credentialsJson = Buffer.from(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      'base64'
    ).toString('utf-8');
    
    const credentialsPath = join(os.tmpdir(), 'google-credentials.json');
    fs.writeFileSync(credentialsPath, credentialsJson);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    console.log('✅ Google Cloud credentials configured from environment variable');
  } catch (error) {
    console.log('⚠️ Could not decode credentials from environment variable');
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing for TTS API
app.use(express.json());

// Enable compression
app.use(compression());

// Serve static files
app.use(express.static(__dirname, {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache static assets (including sound files)
    if (path.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|mp3|wav|ogg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache HTML with shorter duration for updates
    if (path.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    // PWA manifest and service worker - no cache
    if (path.match(/(manifest\.json|service-worker\.js)$/)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Optional: Cloud TTS API endpoint (Google Cloud TTS)
// Requires GOOGLE_APPLICATION_CREDENTIALS or API key
app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  // Check if Google Cloud TTS is configured
  const useGoogleTTS = process.env.GOOGLE_CLOUD_TTS_ENABLED === 'true';
  
  if (useGoogleTTS) {
    try {
      // Dynamic import for optional dependency
      const { TextToSpeechClient } = await import('@google-cloud/text-to-speech');
      const client = new TextToSpeechClient();
      
      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: process.env.GOOGLE_VOICE_NAME || 'en-US-Wavenet-F', // Female voice
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 1.2, // Slightly higher pitch for kids
          speakingRate: 1.1,
          volumeGainDb: 2.0 // Slightly louder
        }
      });
      
      res.type('audio/mpeg');
      res.send(response.audioContent);
    } catch (error) {
      console.error('Google Cloud TTS error:', error);
      res.status(500).json({ error: 'TTS service unavailable' });
    }
  } else {
    // Cloud TTS not enabled
    res.status(503).json({ error: 'Cloud TTS not configured' });
  }
});

// Service Worker - must be served from root
app.get('/service-worker.js', (req, res) => {
  res.sendFile(join(__dirname, 'service-worker.js'), {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/'
    }
  });
});

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Alphabet Pop server running on http://localhost:${PORT}`);
  console.log(`📱 PWA ready - install on your device!`);
});

