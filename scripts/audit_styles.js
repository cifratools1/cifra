const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full.replace(/\\/g, '/'));
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));

// Emoji regex: symbols, emoticons, pictographs
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// Old Tailwind colors regex
const oldColorsRegex = /\b(slate|zinc|neutral|stone|blue|sky|indigo|violet|emerald|amber|orange)-\d{2,3}\b/g;

// Hex colors regex
const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;

console.log('=== 1. EMOJI AUDIT IN SRC/ ===');
let totalEmojis = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      console.log(`${f}:${idx + 1}: ${line.trim()}`);
      totalEmojis++;
    }
  });
});
if (totalEmojis === 0) {
  console.log('✅ No emojis found in any TS/TSX source file!');
} else {
  console.log(`⚠️ Found ${totalEmojis} emoji occurrences.`);
}

console.log('\n=== 2. TAILWIND HARDCODED COLOR AUDIT (slate-, blue-, etc.) ===');
const colorCountsByFile = {};
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(oldColorsRegex);
  if (matches) {
    colorCountsByFile[f] = matches;
  }
});

const sortedFiles = Object.entries(colorCountsByFile).sort((a, b) => b[1].length - a[1].length);
for (const [file, matches] of sortedFiles) {
  const uniq = [...new Set(matches)];
  console.log(`${file} (${matches.length} uses): ${uniq.join(', ')}`);
}

console.log('\n=== 3. HARDCODED HEX CODES AUDIT ===');
const hexCountsByFile = {};
files.forEach(f => {
  // Ignore globals.css (checked separately), openGraph/twitter generators where canvas/Satori colors are needed
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(hexRegex);
  if (matches) {
    hexCountsByFile[f] = matches;
  }
});
for (const [file, matches] of Object.entries(hexCountsByFile)) {
  const uniq = [...new Set(matches)];
  console.log(`${file} (${matches.length} hex): ${uniq.join(', ')}`);
}
