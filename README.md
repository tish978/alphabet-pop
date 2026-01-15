# Alphabet Pop 🎈

A touch-first Progressive Web App (PWA) designed for preschoolers (ages 2–5) to learn letter recognition through an engaging bubble-popping game.

## Features

- **Three Game Modes:**
  - Uppercase (A-Z)
  - Lowercase (a-z)
  - Mixed (random uppercase and lowercase)

- **Engaging Gameplay:**
  - Voice prompts using Web Speech API
  - Visual and audio feedback
  - Confetti celebrations on success
  - Gentle corrections on mistakes

- **PWA Capabilities:**
  - Works offline
  - Installable on mobile devices
  - Fullscreen experience

- **Preschooler-Friendly:**
  - Large touch targets
  - Touch gesture prevention (zoom/scroll)
  - High-contrast "Midnight Learning" theme
  - Distraction-free interface

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
# Development server (with npm)
npm run dev
# or
npm start

# Alternative: Simple Python server
python -m http.server 8000
```

Open http://localhost:3000 (or 8000 for Python server) in your browser.

**Note:** Voice features require HTTPS or localhost (not file://).

The app works best on tablets and mobile devices, but also functions on desktop browsers.

See [TESTING.md](TESTING.md) for complete testing instructions.

### Deploy to Railway

1. Push code to GitHub/GitLab
2. Connect repository to [Railway](https://railway.app)
3. Railway auto-detects Node.js and deploys
4. Your app will be live at `your-app.railway.app`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### PWA Setup

For full PWA features (offline support and installation):

1. **Icons:** Generate PNG icons from `icon.svg`:
   - Create `icon-192.png` (192x192 pixels)
   - Create `icon-512.png` (512x512 pixels)
   - You can use online tools like [CloudConvert](https://cloudconvert.com/svg-to-png) or [RealFaviconGenerator](https://realfavicongenerator.net/)
   
2. **Installation:**
   - Open in a supported browser (Chrome, Edge, Safari)
   - Install the app when prompted, or use the browser's install option
   - The app will work offline after the first visit
   
**Note:** The app will work without icons, but they're required for proper PWA installation on some platforms.

## Browser Compatibility

- Chrome/Edge: Full support including PWA features
- Safari (iOS): Full support, PWA installable on iOS 11.3+
- Firefox: Full support, limited PWA features

**Note:** Web Speech API requires HTTPS (or localhost for development). Voice synthesis may not work in all browsers.

## Voice Configuration

The app supports multiple voice methods for better, more natural voices:

1. **Enhanced Browser Speech** (Default) - Automatically finds best available browser voices
2. **Pre-recorded Audio Files** (Best quality) - See [VOICE_SETUP.md](VOICE_SETUP.md)
3. **Cloud TTS API** (Optional) - Google Cloud TTS for live generation

For detailed voice setup instructions, see [VOICE_SETUP.md](VOICE_SETUP.md).

## Customization

The app uses Tailwind CSS via CDN. To customize:
- Edit `styles.css` for custom animations and styles
- Modify `app.js` to adjust game logic, difficulty, or feedback phrases
- Update `manifest.json` to change PWA metadata
- See `VOICE_SETUP.md` for voice customization options

## Future Enhancements

- Phonics mode (letter sounds)
- Progressive difficulty (more bubbles)
- Multi-language support
- Progress tracking

## License

This project is open source and available for educational use.

