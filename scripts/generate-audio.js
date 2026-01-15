/**
 * Audio Generation Script for Alphabet Pop
 * 
 * Generates MP3 audio files using Google Cloud Text-to-Speech
 * 
 * Prerequisites:
 * 1. Install: npm install @google-cloud/text-to-speech
 * 2. Set up Google Cloud credentials: GOOGLE_APPLICATION_CREDENTIALS
 * 3. Run: node scripts/generate-audio.js
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new TextToSpeechClient();

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, '..', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// All phrases to generate
const phrases = {
  // Letter prompts (A-Z)
  letters: Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // A-Z
    return `Can you pop the letter ${letter}?`;
  }),
  
  // Praise phrases
  praise: [
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
  ],
  
  // Correction phrases - one for each wrong letter
  corrections: Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // A-Z
    return `That's the letter ${letter}. Try again!`;
  }),
  
  // Target reminder phrases - one for each target letter
  targetReminders: Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // A-Z
    return `Let's find the letter ${letter}!`;
  })
};

// Normalize text to filename
function textToFilename(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// Generate audio for a phrase
async function generateAudio(text, voiceName = 'en-US-Wavenet-F') {
  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: voiceName,
      ssmlGender: 'FEMALE'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: 1.2, // Slightly higher pitch for kids
      speakingRate: 1.1,
      volumeGainDb: 2.0 // Slightly louder
    }
  };
  
  try {
    const [response] = await client.synthesizeSpeech(request);
    const filename = `${textToFilename(text)}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    fs.writeFileSync(filepath, response.audioContent, 'binary');
    console.log(`✅ Generated: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating "${text}":`, error.message);
    return false;
  }
}

// Generate all audio files
async function generateAll() {
  console.log('🎤 Starting audio generation...\n');
  console.log('Voice: en-US-Wavenet-F (Natural Female)\n');
  
  let success = 0;
  let failed = 0;
  
  // Generate letter prompts
  console.log('📝 Generating letter prompts...');
  for (const phrase of phrases.letters) {
    if (await generateAudio(phrase)) {
      success++;
    } else {
      failed++;
    }
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Generate praise phrases
  console.log('\n🎉 Generating praise phrases...');
  for (const phrase of phrases.praise) {
    if (await generateAudio(phrase)) {
      success++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Generate correction phrases
  if (phrases.corrections.length > 0) {
    console.log('\n💬 Generating correction phrases...');
    for (const phrase of phrases.corrections) {
      if (await generateAudio(phrase)) {
        success++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Generate target reminder phrases (optional - can use browser speech too)
  if (phrases.targetReminders && phrases.targetReminders.length > 0) {
    console.log('\n🎯 Generating target reminder phrases...');
    for (const phrase of phrases.targetReminders) {
      if (await generateAudio(phrase)) {
        success++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`\n✨ Done! Generated ${success} files, ${failed} failed.`);
  console.log(`📁 Audio files saved to: ${audioDir}`);
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${path.resolve(process.argv[1])}` ||
                    process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || !process.argv[1] || process.argv[1].includes('generate-audio')) {
  generateAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateAudio, textToFilename };

