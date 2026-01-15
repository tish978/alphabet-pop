# Testing Guide for Alphabet Pop

## Quick Test (Without Server)

1. **Open the HTML file directly:**
   - Double-click `index.html` or drag it into your browser
   - Works for basic functionality, but **voice will not work** (requires HTTPS/localhost)

## Full Testing with Local Server

Since PWAs and Web Speech API require HTTPS or localhost, use a local web server:

### Option 1: Python (if installed)

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000

### Option 2: Node.js (if installed)

Install a simple server:
```bash
npx http-server -p 8000
```

Then open: http://localhost:8000

### Option 3: VS Code Live Server

If using VS Code:
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Option 4: PHP (if installed)

```bash
php -S localhost:8000
```

Then open: http://localhost:8000

## Testing Checklist

### Basic Functionality
- [ ] Menu overlay appears on load
- [ ] Can select game modes (ABC, abc, Aa)
- [ ] Menu closes when mode is selected
- [ ] Menu button in top-left opens menu
- [ ] Target letter displays correctly
- [ ] 6 bubbles appear with letters

### Game Mechanics
- [ ] Clicking correct bubble triggers:
  - [ ] Pop animation
  - [ ] Confetti effect
  - [ ] Voice praise phrase
  - [ ] New round starts after 2 seconds
- [ ] Clicking wrong bubble triggers:
  - [ ] Shake animation
  - [ ] Voice correction (e.g., "That's the letter D. Let's try to find B!")
  - [ ] Bubble returns to floating state

### Voice/Speech
- [ ] Initial prompt: "Can you pop the letter X?"
- [ ] Success feedback speaks praise phrase
- [ ] Error feedback speaks correction
- [ ] Voice sounds enthusiastic (higher pitch)

### Touch/Mobile Testing
- [ ] Large bubbles are easy to tap
- [ ] No accidental zoom (pinch gesture)
- [ ] No accidental scroll (swipe gesture)
- [ ] Single tap works reliably
- [ ] Menu buttons are tappable

### Visual Design
- [ ] Midnight theme (dark navy/indigo background)
- [ ] Bubbles have vibrant colors
- [ ] Bubbles float with gentle animation
- [ ] Glassmorphism effect on menu
- [ ] Text is readable (high contrast)
- [ ] Responsive on different screen sizes

### PWA Features
- [ ] Install prompt appears (if icons are present)
- [ ] App works offline after first visit
- [ ] Service worker registers successfully
- [ ] Can be installed to home screen

### Game Modes
- [ ] **Uppercase mode:** Only shows A-Z
- [ ] **Lowercase mode:** Only shows a-z
- [ ] **Mixed mode:** Shows both uppercase and lowercase randomly

## Browser Testing

Test in multiple browsers:

- **Chrome/Edge:** Full PWA support + voice
- **Safari (iOS):** Full PWA support, voice works
- **Firefox:** Voice works, limited PWA features
- **Mobile browsers:** Test on actual device or browser DevTools

## Mobile Device Testing

### On iOS:
1. Connect device to same network as computer
2. Start local server (see options above)
3. Find your computer's IP address:
   - Windows: `ipconfig` → IPv4 Address
   - Mac/Linux: `ifconfig` → inet address
4. Open on device: `http://YOUR_IP:8000`
5. Add to Home Screen for PWA testing

### On Android:
1. Same steps as iOS
2. Or use Chrome DevTools remote debugging

## Common Issues & Solutions

### Voice not working?
- **Problem:** Opened file:// directly
- **Solution:** Use local server (http://localhost:8000)
- **Note:** Some browsers need HTTPS even for localhost (try Chrome)

### Service Worker not registering?
- Check browser console for errors
- Ensure using localhost, not file://
- Clear browser cache and reload

### Icons not showing?
- App works without icons
- Generate `icon-192.png` and `icon-512.png` from `icon.svg` for PWA install
- Use online tools like [CloudConvert](https://cloudconvert.com/svg-to-png)

### Touch gestures not blocked?
- Test on actual mobile device (not just DevTools)
- Ensure `touch-action: manipulation` is working
- Check viewport meta tag is present

## Debug Mode

Open browser DevTools (F12) and check:
- **Console:** Look for errors or service worker messages
- **Application tab:** Check service worker status, cache, manifest
- **Network tab:** Verify files load correctly

## Performance Testing

- Bubbles should animate smoothly (60fps)
- Confetti should not lag
- Voice should not interrupt game flow
- Menu should respond instantly

## Accessibility Testing

- Text is large enough (Fredoka One font)
- High contrast (yellow text on dark background)
- Touch targets are at least 44x44px (bubbles are 100-140px)

