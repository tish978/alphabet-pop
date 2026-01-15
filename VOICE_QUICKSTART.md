# Quick Start: Better Voices for Kids

## What Changed?

✅ **Enhanced browser voice selection** - Automatically finds the best available voices  
✅ **Support for pre-recorded audio files** - Use professional voices (works offline)  
✅ **Optional cloud TTS API** - Generate natural voices on-demand  

The app now tries voices in this order:
1. Audio files (if available) - Best quality
2. Cloud TTS (if enabled) - Natural voices
3. Enhanced browser speech - Improved selection

## Option 1: Use Enhanced Browser Voices (Immediate)

**Works right now!** The app automatically finds better voices:

- **Chrome:** Uses Google WaveNet voices (built-in, very natural)
- **Safari/macOS:** Uses Samantha or Karen (excellent quality)
- **Edge:** Uses Microsoft voices
- **Firefox:** Uses system voices

**Just restart the app** - the improved voice selection is automatic!

## Option 2: Generate Audio Files (Best Quality)

### Quick Setup (5 minutes)

1. **Get Google Cloud free tier:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project (free tier includes $300 credit)
   - Enable "Cloud Text-to-Speech API"
   - Create service account → Download JSON key

2. **Set credentials:**
   ```bash
   # Windows
   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\credentials.json
   
   # Mac/Linux
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Generate audio files:**
   ```bash
   node scripts/generate-audio.js
   ```

   This creates an `audio/` folder with all MP3 files for:
   - All letter prompts (A-Z)
   - All praise phrases
   - Common correction phrases

5. **Test locally:**
   ```bash
   npm run dev
   ```

6. **Deploy to Railway:**
   - Audio files are included automatically
   - App will use audio files when available
   - Falls back to browser speech if audio missing

### Alternative: Use ElevenLabs (Premium Quality)

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Generate voices using their web interface or API
3. Download MP3 files
4. Place in `audio/` folder with correct naming (see VOICE_SETUP.md)

## Option 3: Enable Cloud TTS (Live Generation)

1. **Set up Google Cloud** (same as Option 2)

2. **Add to Railway environment variables:**
   ```
   GOOGLE_CLOUD_TTS_ENABLED=true
   GOOGLE_APPLICATION_CREDENTIALS=<upload JSON file>
   ```

3. **Enable in app.js:**
   ```javascript
   voiceConfig.cloudEnabled = true;
   ```

4. **Redeploy** - voices will be generated on-demand

## Testing Voice Quality

After setup, open browser console and check:
- `🎤 Selected voice: <voice name>` - Shows which browser voice is used
- Audio files will play automatically if available
- Cloud TTS will generate if enabled

## Recommended Setup

**For best experience:**
1. ✅ Enhanced browser voices (automatic - already done!)
2. ✅ Generate audio files for common phrases (5 min setup)
3. ⚪ Cloud TTS for dynamic content (optional)

## Cost

- **Enhanced browser voices:** Free (automatic)
- **Google Cloud TTS:** Free tier includes 4 million characters/month
- **ElevenLabs:** Paid (best quality)

For a kids app, Google Cloud free tier is usually enough!

## Need Help?

See [VOICE_SETUP.md](VOICE_SETUP.md) for detailed instructions.

