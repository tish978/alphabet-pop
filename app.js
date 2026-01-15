// Game State
const gameState = {
    mode: null, // 'uppercase', 'lowercase', or 'mixed'
    currentTarget: null,
    bubbles: [],
    isPlaying: false
};

// Sound Effects Configuration
const soundConfig = {
    enabled: true, // Set to false to disable all sound effects
    volume: 0.3, // Volume for sound effects (0.0 to 1.0) - lower for generated sounds
    useFiles: false, // Set to true to use MP3 files instead of generated sounds
    sounds: {
        pop: '/sounds/pop.mp3', // Bubble pop sound (success) - fallback if useFiles is true
        shake: '/sounds/shake.mp3', // Bubble shake sound (wrong) - fallback if useFiles is true
        click: '/sounds/click.mp3', // Button click sound - fallback if useFiles is true
        whoosh: '/sounds/whoosh.mp3', // Menu open/close - fallback if useFiles is true
        success: '/sounds/success.mp3' // Celebration sound - fallback if useFiles is true
    }
};

// Kid-friendly sound presets using zzfx (programmatically generated - no files needed!)
// Format: [frequency, attack, sustain, release, type, pitch, volume, ...]
// These generate fun, playful sounds perfect for preschoolers
const soundPresets = {
    // Satisfying pop sound when bubble is popped correctly
    pop: [0.3, 0, 0.02, 0.02, , , 0.3, 0.02, 0.15, -0.2, 0.1, , 0.98, 0.3, , 0.04, 0.98, 0.01],
    
    // Gentle wobble/shake sound when wrong bubble is clicked
    shake: [0.2, 0, 0.1, 0.1, , 0.3, 0.2, 0.3, , , -0.3, 0.1, 0.8, -0.5, , 0.1, 0.7, 0.01],
    
    // Subtle click sound for button interactions
    click: [0.8, 0, 0.05, 0.05, , , 0.15, 0.1, 0.3, , 0.1, , 0.9, 0.5, , 0.05, 0.8, 0.02],
    
    // Smooth whoosh sound for menu transitions
    whoosh: [0.5, 0.1, 0.2, 0.2, , 0.2, 0.2, 0.4, , , -0.5, 0.3, 0.6, -0.3, , 0.15, 0.7, 0.03],
    
    // Celebration chime sound after success
    success: [0.6, 0, 0.3, 0.3, , 0.4, 0.4, 0.5, , 0.2, 0.3, 0.5, 0.9, 0.8, 0.2, 0.25, 0.95, 0.05]
};

// Speech Synthesis - Enhanced with better voice selection
const synth = window.speechSynthesis;
let currentVoice = null;
const voiceConfig = {
    method: 'browser', // 'browser', 'audio', or 'cloud'
    audioEnabled: true, // Set to false to disable audio file fallback
    cloudEnabled: false // Set to true to enable cloud TTS API
};

// Voice config initialized

// Better voice selection - prioritize natural, expressive voices
function initializeVoice() {
    const voices = synth.getVoices();
    
    if (voices.length === 0) {
        // Wait for voices to load
        synth.addEventListener('voiceschanged', initializeVoice, { once: true });
        return;
    }
    
    // Priority list: natural voices that sound friendly for kids
    // Chrome has some excellent built-in voices like Google US English voices
    const voicePriority = [
        // Google WaveNet voices (Chrome - best quality)
        /google.*us english.*female/i,
        /en-us.*wavenet.*f/i,
        /en-us.*neural.*f/i,
        // Natural sounding voices
        /samantha/i, // macOS - very natural
        /karen/i,    // macOS Australian - friendly
        /zira/i,     // Windows - female
        // Other good options
        /female/i,
        /en.*female/i,
        // Fallback to any English voice
        /en-us/i,
        /en-gb/i,
        /english/i
    ];
    
    // Find the best matching voice
    for (const pattern of voicePriority) {
        const matched = voices.find(v => 
            v.lang.toLowerCase().includes('en') && 
            pattern.test(v.name)
        );
        if (matched) {
            currentVoice = matched;
            console.log('🎤 Selected voice:', matched.name, matched.lang);
            return;
        }
    }
    
    // Final fallback
    currentVoice = voices.find(v => v.lang.includes('en')) || voices[0];
    if (currentVoice) {
        console.log('🎤 Using fallback voice:', currentVoice.name);
    }
}

// Play sound effect (uses zzfx for programmatic sounds or falls back to MP3 files)
function playSound(soundName, volume = null) {
    if (!soundConfig.enabled) return;
    
    if (!soundPresets[soundName] && !soundConfig.sounds[soundName]) {
        return; // Silently fail if sound not found
    }
    
    const playVolume = volume !== null ? volume : soundConfig.volume;
    
    // Use zzfx for programmatic sounds (default - no files needed!)
    if (!soundConfig.useFiles && soundPresets[soundName]) {
        try {
            const zzfxFunc = window.zzfx;
            
            if (zzfxFunc && typeof zzfxFunc === 'function') {
                const preset = soundPresets[soundName].slice(); // Clone array
                // Override volume in preset (volume is at index 6)
                if (preset.length > 6) {
                    preset[6] = playVolume;
                }
                zzfxFunc(...preset);
                return;
            }
        } catch (error) {
            // Fall through to file-based sounds
        }
    }
    
    // Fallback to MP3 files if enabled or if zzfx fails
    const soundPath = soundConfig.sounds[soundName];
    if (!soundPath) return;
    
    try {
        const audio = new Audio(soundPath);
        audio.volume = playVolume;
        audio.play().catch(() => {
            // Silently fail if audio can't play
        });
    } catch (error) {
        // Silently fail if audio creation fails
    }
}

// Enhanced speak function with multiple methods
async function speak(text, rate = 1.1, pitch = 1.2) {
    if (synth.speaking) {
        synth.cancel();
    }
    
    // Try audio files first (if enabled)
    if (voiceConfig.audioEnabled) {
        const audioPlayed = await tryPlayAudio(text);
        if (audioPlayed) {
            return;
        }
    }
    
    // Try cloud TTS (if enabled)
    if (voiceConfig.cloudEnabled && await tryCloudTTS(text)) {
        return;
    }
    
    // Fallback to browser speech synthesis with enhanced settings
    speakWithBrowser(text, rate, pitch);
}

// Play pre-recorded audio file
async function tryPlayAudio(text) {
    try {
        // Normalize text for filename (remove punctuation, lowercase)
        const audioText = text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
        // Use absolute path for audio files (works with Express static serving)
        const audioPath = `/audio/${audioText}.mp3`;
        
        const audio = new Audio(audioPath);
        let resolved = false;
        
        return new Promise((resolve) => {
            // Longer timeout for slower connections
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(false); // File doesn't exist or took too long
                }
            }, 1500); // Wait 1.5 seconds for file to load
            
            // Try to play once loaded - listen to multiple events
            const tryPlay = () => {
                if (!resolved && audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                    clearTimeout(timeout);
                    audio.play().then(() => {
                        audio.onended = () => {
                            if (!resolved) {
                                resolved = true;
                                resolve(true);
                            }
                        };
                    }).catch(() => {
                        if (!resolved) {
                            resolved = true;
                            resolve(false);
                        }
                    });
                }
            };
            
            // Listen to multiple load events
            audio.oncanplay = tryPlay;
            audio.oncanplaythrough = tryPlay;
            audio.onloadeddata = tryPlay;
            
            audio.onerror = () => {
                if (!resolved) {
                    clearTimeout(timeout);
                    resolved = true;
                    resolve(false);
                }
            };
            
            // Set preload to auto for faster loading
            audio.preload = 'auto';
            // Try to load
            audio.load();
            
            // Also check if already loaded
            if (audio.readyState >= 2) {
                tryPlay();
            }
        });
    } catch (error) {
        return false;
    }
}

// Cloud TTS API (requires backend endpoint)
async function tryCloudTTS(text) {
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) return false;
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve(true);
            };
            audio.onerror = () => {
                URL.revokeObjectURL(audioUrl);
                resolve(false);
            };
            audio.play().catch(() => resolve(false));
        });
    } catch (error) {
        return false;
    }
}

// Enhanced browser speech with better prosody
function speakWithBrowser(text, rate = 1.1, pitch = 1.2) {
    if (!currentVoice) {
        initializeVoice();
    }
    
    // For simple phrases, speak directly
    // For complex text, split into phrases for more natural speech
    const hasPunctuation = /[.!?]/.test(text);
    
    if (!hasPunctuation) {
        // Simple phrase - speak directly with enhanced settings
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = currentVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 1.0;
        synth.speak(utterance);
        return;
    }
    
    // Complex text - split into phrases
    const phrases = text.split(/[.!?]+/).filter(p => p.trim());
    
    if (phrases.length === 0) {
        phrases.push(text);
    }
    
    let phraseIndex = 0;
    
    function speakNextPhrase() {
        if (phraseIndex >= phrases.length) return;
        
        const phrase = phrases[phraseIndex].trim();
        if (!phrase) {
            phraseIndex++;
            speakNextPhrase();
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.voice = currentVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
            phraseIndex++;
            setTimeout(() => speakNextPhrase(), 100); // Small pause between phrases
        };
        
        synth.speak(utterance);
        phraseIndex++;
    }
    
    speakNextPhrase();
}

// Praise phrases
const praisePhrases = [
    "You're a superstar!",
    "Amazing job!",
    "You're awesome!",
    "Fantastic!",
    "Way to go!",
    "You're incredible!",
    "Perfect!",
    "Excellent work!",
    "You're doing great!",
    "Wonderful!"
];

// Get random praise phrase
function getRandomPraise() {
    return praisePhrases[Math.floor(Math.random() * praisePhrases.length)];
}

// Generate random letters
function getRandomLetter(mode) {
    if (mode === 'uppercase') {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    } else if (mode === 'lowercase') {
        return String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    } else { // mixed
        const isUpper = Math.random() > 0.5;
        return isUpper 
            ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
            : String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
}

// Generate distractors (non-target letters)
function generateDistractors(target, mode, count = 5) {
    const distractors = [];
    const used = new Set([target]);
    
    while (distractors.length < count) {
        let letter = getRandomLetter(mode);
        // Ensure it's not the target and not already added
        while (used.has(letter)) {
            letter = getRandomLetter(mode);
        }
        distractors.push(letter);
        used.add(letter);
    }
    
    return distractors;
}

// Create bubble element
function createBubble(letter, index) {
    const bubble = document.createElement('div');
    bubble.className = `bubble bubble-color-${(index % 6) + 1} float`;
    bubble.textContent = letter;
    bubble.dataset.letter = letter;
    
    // Touch and click handlers
    bubble.addEventListener('click', handleBubbleClick);
    bubble.addEventListener('touchend', handleBubbleClick);
    
    return bubble;
}

// Handle bubble click/tap
function handleBubbleClick(event) {
    if (!gameState.isPlaying) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const bubble = event.currentTarget;
    const tappedLetter = bubble.dataset.letter;
    
    if (tappedLetter === gameState.currentTarget) {
        // Success!
        handleSuccess(bubble);
    } else {
        // Incorrect
        handleIncorrect(bubble, tappedLetter);
    }
}

// Handle successful pop
function handleSuccess(bubble) {
    gameState.isPlaying = false;
    
    // Play pop sound effect immediately
    playSound('pop', 0.8);
    
    // Add pop animation
    bubble.classList.remove('float');
    bubble.classList.add('pop');
    
    // Confetti effect
    createConfetti(bubble);
    
    // Play success celebration sound after a short delay
    setTimeout(() => {
        playSound('success', 0.5);
    }, 200);
    
    // Praise
    const praise = getRandomPraise();
    speak(praise, 1.2, 1.3);
    
    // Reset after animation
    setTimeout(() => {
        startNewRound();
    }, 2000);
}

// Handle incorrect tap
async function handleIncorrect(bubble, tappedLetter) {
    // Play shake sound effect
    playSound('shake', 0.5);
    
    // Shake animation
    bubble.classList.remove('float');
    bubble.classList.add('shake');
    
    // Get letter name (uppercase letter)
    const letterName = tappedLetter.toUpperCase();
    const targetName = gameState.currentTarget.toUpperCase();
    
    // Provide feedback - correction phrase with audio file
    const correctionPhrase = `That's the letter ${letterName}. Try again!`;
    await speak(correctionPhrase, 1.0, 1.1);
    
    // After correction plays, remind about the target (short pause)
    setTimeout(() => {
        speak(`Let's find the letter ${targetName}!`, 1.0, 1.2);
    }, 600);
    
    // Restore float animation
    setTimeout(() => {
        bubble.classList.remove('shake');
        bubble.classList.add('float');
    }, 500);
}

// Start a new round
function startNewRound() {
    const container = document.getElementById('bubbles-container');
    container.innerHTML = '';
    
    // Generate new target
    gameState.currentTarget = getRandomLetter(gameState.mode);
    
    // Display target
    document.getElementById('target-letter').textContent = gameState.currentTarget;
    
    // Generate bubbles (1 target + 5 distractors)
    const distractors = generateDistractors(gameState.currentTarget, gameState.mode, 5);
    const allLetters = [gameState.currentTarget, ...distractors];
    
    // Shuffle
    for (let i = allLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
    }
    
    // Create bubbles
    gameState.bubbles = allLetters.map((letter, index) => {
        const bubble = createBubble(letter, index);
        container.appendChild(bubble);
        return bubble;
    });
    
    gameState.isPlaying = true;
    
    // Speak the prompt
    const targetName = gameState.currentTarget.toUpperCase();
    setTimeout(() => {
        speak(`Can you pop the letter ${targetName}?`, 1.0, 1.2);
    }, 300);
}

// Confetti effect
function createConfetti(element) {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particles = [];
    const colors = ['#ff6b9d', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ffd3a5', '#c7ceea', '#ffffff'];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: centerX,
            y: centerY,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            gravity: 0.3,
            life: 1.0
        });
    }
    
    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let alive = false;
        particles.forEach(particle => {
            if (particle.life > 0) {
                alive = true;
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += particle.gravity;
                particle.rotation += particle.rotationSpeed;
                particle.life -= 0.02;
                
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
            }
        });
        
        if (alive) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Set game mode
function setMode(mode) {
    gameState.mode = mode;
    
    // Update mode indicator
    const indicators = {
        'uppercase': 'ABC',
        'lowercase': 'abc',
        'mixed': 'Aa'
    };
    document.getElementById('mode-indicator').textContent = indicators[mode];
    
    // Hide menu
    document.getElementById('menu-overlay').classList.add('hidden');
    
    // Start game
    startNewRound();
}

// Menu handlers with sound effects
document.getElementById('mode-uppercase').addEventListener('click', () => {
    playSound('click', 0.4);
    setMode('uppercase');
});
document.getElementById('mode-lowercase').addEventListener('click', () => {
    playSound('click', 0.4);
    setMode('lowercase');
});
document.getElementById('mode-mixed').addEventListener('click', () => {
    playSound('click', 0.4);
    setMode('mixed');
});

document.getElementById('menu-btn').addEventListener('click', () => {
    playSound('whoosh', 0.5);
    document.getElementById('menu-overlay').classList.remove('hidden');
    gameState.isPlaying = false;
    if (synth.speaking) {
        synth.cancel();
    }
});

document.getElementById('close-menu').addEventListener('click', () => {
    playSound('whoosh', 0.5);
    document.getElementById('menu-overlay').classList.add('hidden');
    if (gameState.mode) {
        gameState.isPlaying = true;
    }
});

// Touch shielding - prevent zoom and scroll
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    // Prevent scroll
    if (e.touches.length > 1) {
        e.preventDefault();
        return;
    }
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const diffY = Math.abs(touchY - touchStartY);
    const diffX = Math.abs(touchX - touchStartX);
    
    // If significant movement, prevent default (zoom/scroll)
    if (diffY > 10 || diffX > 10) {
        // Allow touch on interactive elements
        const target = e.target;
        if (!target.closest('.bubble') && !target.closest('button')) {
            e.preventDefault();
        }
    }
}, { passive: false });

document.addEventListener('touchcancel', (e) => {
    e.preventDefault();
}, { passive: false });

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Initialize on load
window.addEventListener('load', () => {
    initializeVoice();
    
    // zzfx loaded via inline script in index.html
    
    // Handle canvas resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('confetti-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

