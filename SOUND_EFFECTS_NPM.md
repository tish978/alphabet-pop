# Sound Effects Using NPM Package (ZzFX)

## ✅ What's Installed

**zzfx** - Ultra-lightweight programmatic sound generator (~1KB)

- **No MP3 files needed** - sounds are generated in code!
- **Works offline** - no external dependencies
- **Perfect for kids** - fun, playful sounds
- **MIT Licensed** - free to use

## How It Works

The app uses **ZzFX** to generate sounds programmatically. No sound files needed!

Sounds are defined as simple arrays of parameters:
```javascript
pop: [0.3, 0, 0.02, 0.02, , , 0.3, ...] // Bubble pop!
shake: [0.2, 0, 0.1, 0.1, ...] // Gentle wobble
click: [0.8, 0, 0.05, 0.05, ...] // Button click
```

## Current Sound Effects

1. **Pop** - When bubble is popped correctly ✨
2. **Success** - Celebration after correct answer 🎉
3. **Shake** - When wrong bubble is clicked 🔔
4. **Click** - Button interactions 🖱️
5. **Whoosh** - Menu open/close 🌬️

## Configuration

In `app.js`:

```javascript
const soundConfig = {
    enabled: true, // Set to false to disable all sounds
    volume: 0.3, // Volume (0.0 to 1.0)
    useFiles: false // Set to true to use MP3 files instead
};
```

## Customizing Sounds

Edit the `soundPresets` object in `app.js` to tweak sounds:

```javascript
const soundPresets = {
    pop: [frequency, attack, sustain, release, type, pitch, volume, ...],
    // ... adjust parameters to change the sound
};
```

ZzFX Parameters:
- `frequency` - Pitch of the sound (0.1-2.0)
- `attack` - Attack time (0-1)
- `sustain` - Sustain time (0-1)
- `release` - Release time (0-1)
- `volume` - Volume (0-1)

## Testing

1. **Start server:**
   ```bash
   npm run dev
   ```

2. **Test sounds:**
   - Click correct bubble → hear pop + success
   - Click wrong bubble → hear shake
   - Click buttons → hear click
   - Open menu → hear whoosh

3. **Adjust volumes** in `app.js` if needed

## Fallback to MP3 Files

If you prefer MP3 files:

1. Set `soundConfig.useFiles = true` in `app.js`
2. Add MP3 files to `sounds/` folder:
   - `pop.mp3`
   - `shake.mp3`
   - `click.mp3`
   - `whoosh.mp3`
   - `success.mp3`

The app will automatically use MP3 files when `useFiles` is true.

## Benefits of ZzFX

✅ **No files needed** - everything in code  
✅ **Tiny size** - under 1KB  
✅ **Works offline** - no external dependencies  
✅ **Instant sounds** - no loading time  
✅ **Customizable** - tweak parameters in code  
✅ **Consistent** - same sounds every time  

## Alternative Packages

If you want to explore other options:

- **jsfxr** - Similar to zzfx, more presets
- **soundfx** (by rse) - Has actual sound files included

But **zzfx** is the lightest and most flexible for our needs!

## Troubleshooting

**No sounds playing?**
- Check `soundConfig.enabled = true`
- Open browser console for errors
- Verify zzfx is loaded (check `<script>` tag in HTML)

**Sounds too loud/quiet?**
- Adjust `soundConfig.volume` (default 0.3)
- Or set individual volumes: `playSound('pop', 0.5)`

**Want different sounds?**
- Edit `soundPresets` in `app.js`
- Or set `useFiles: true` and add MP3 files

