# Voice Setup Guide - Better AI Voices for Kids

The app now supports multiple voice methods to provide more natural, engaging voices for kids. Here's how to set them up:

## Voice Priority System

The app tries voices in this order:
1. **Pre-recorded Audio Files** (Best quality, works offline)
2. **Cloud TTS API** (Natural voices, requires internet)
3. **Enhanced Browser Speech** (Improved selection, works offline)

## Option 1: Pre-Recorded Audio Files (Recommended)

### Best Quality & Works Offline

Create an `audio/` folder and add MP3 files for each phrase:

```
audio/
  ├── can-you-pop-the-letter-a.mp3
  ├── can-you-pop-the-letter-b.mp3
  ├── youre-a-superstar.mp3
  ├── amazing-job.mp3
  └── ... (all praise phrases)
```

### How to Generate Audio Files

#### Option A: Use Google Cloud TTS (Free tier available)

1. **Set up Google Cloud:**
   ```bash
   # Install Google Cloud SDK
   npm install -g @google-cloud/text-to-speech
   
   # Or use Python:
   pip install google-cloud-text-to-speech
   ```

2. **Generate audio files:**
   ```javascript
   // generate-audio.js
   const textToSpeech = require('@google-cloud/text-to-speech');
   const fs = require('fs');
   const util = require('util');
   
   const client = new textToSpeech.TextToSpeechClient();
   
   const phrases = [
     "Can you pop the letter A?",
     "Can you pop the letter B?",
     // ... all letters A-Z
     "You're a superstar!",
     "Amazing job!",
     // ... all praise phrases
   ];
   
   async function generateAudio(text) {
     const request = {
       input: { text },
       voice: {
         languageCode: 'en-US',
         name: 'en-US-Wavenet-F', // Female voice - very natural
         ssmlGender: 'FEMALE'
       },
       audioConfig: {
         audioEncoding: 'MP3',
         pitch: 1.2,
         speakingRate: 1.1,
         volumeGainDb: 2.0
       }
     };
     
     const [response] = await client.synthesizeSpeech(request);
     const filename = `audio/${text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}.mp3`;
     fs.writeFileSync(filename, response.audioContent, 'binary');
     console.log(`Generated: ${filename}`);
   }
   
   // Generate all phrases
   phrases.forEach(phrase => {
     generateAudio(phrase);
   });
   ```

#### Option B: Use Amazon Polly (Free tier available)

```bash
# Install AWS CLI
pip install boto3

# Generate audio
python generate-polly-audio.py
```

#### Option C: Use ElevenLabs (Best quality, paid)

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Use their web interface or API to generate natural voices
3. Download MP3 files
4. Place in `audio/` folder

#### Option D: Hire a Voice Actor

For the best experience, hire a professional voice actor:
- Record all phrases in a studio
- Export as MP3 files
- Place in `audio/` folder

### Audio File Naming

Audio files should be named based on the normalized text:
- "Can you pop the letter A?" → `can-you-pop-the-letter-a.mp3`
- "You're a superstar!" → `youre-a-superstar.mp3`

The app automatically normalizes text to match filenames.

## Option 2: Cloud TTS API (Live Generation)

### Enable Google Cloud TTS

1. **Set up Google Cloud:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project
   - Enable "Cloud Text-to-Speech API"
   - Create service account credentials
   - Download JSON key file

2. **Install dependency:**
   ```bash
   npm install @google-cloud/text-to-speech
   ```

3. **Set environment variables:**
   ```bash
   # Option 1: Service account JSON file
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
   
   # Option 2: API key (less secure)
   export GOOGLE_CLOUD_TTS_ENABLED="true"
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
   ```

4. **Enable in app.js:**
   ```javascript
   voiceConfig.cloudEnabled = true;
   ```

5. **Set on Railway:**
   - Add `GOOGLE_CLOUD_TTS_ENABLED=true`
   - Upload credentials JSON file or use secret management

### Voice Options

Available Google Cloud voices:
- `en-US-Wavenet-F` - Natural female (recommended)
- `en-US-Wavenet-D` - Natural male
- `en-US-Neural2-C` - Very natural female
- `en-US-Neural2-D` - Very natural male
- `en-US-News-K` - Professional news voice

Set via environment variable:
```bash
export GOOGLE_VOICE_NAME="en-US-Wavenet-F"
```

## Option 3: Enhanced Browser Speech (Default)

The app now has better voice selection that automatically finds the best available browser voice:

- **Chrome:** Uses Google WaveNet voices (if available)
- **Safari/macOS:** Uses Samantha or Karen (very natural)
- **Edge:** Uses Microsoft voices
- **Firefox:** Uses available system voices

### Improving Browser Voices

1. **On Windows:** Install better voices from Microsoft Store
2. **On macOS:** System voices are already excellent
3. **On Chrome:** Google WaveNet voices are built-in

## Comparison

| Method | Quality | Offline | Cost | Setup |
|--------|---------|---------|------|-------|
| **Pre-recorded Audio** | ⭐⭐⭐⭐⭐ | ✅ Yes | Free-$ | Medium |
| **Cloud TTS (Google)** | ⭐⭐⭐⭐ | ❌ No | Free tier | Easy |
| **Cloud TTS (ElevenLabs)** | ⭐⭐⭐⭐⭐ | ❌ No | Paid | Easy |
| **Browser Enhanced** | ⭐⭐⭐ | ✅ Yes | Free | Automatic |

## Recommended Setup

1. **Start with Enhanced Browser Speech** (automatic, works immediately)
2. **Generate audio files** for common phrases (letters A-Z, praise phrases)
3. **Enable Cloud TTS** for dynamic phrases (optional, for best quality)

## Quick Test

After setting up:

1. **Audio files:** Create `audio/test.mp3` with any voice
2. **Test in console:**
   ```javascript
   await speak("test");
   ```
3. Check console logs to see which voice method is used

## Troubleshooting

**No voice plays:**
- Check browser console for errors
- Verify HTTPS (required for some APIs)
- Ensure audio files are in correct format (MP3)

**Cloud TTS not working:**
- Verify credentials are set correctly
- Check Railway logs for errors
- Ensure API is enabled in Google Cloud Console

**Voice still sounds robotic:**
- Try audio files (best option)
- Use Google Cloud WaveNet voices
- Consider ElevenLabs for premium quality

## Next Steps

1. Generate audio files for all letters and phrases
2. Test locally with `npm run dev`
3. Deploy to Railway with audio files included
4. Optionally enable Cloud TTS for dynamic content

