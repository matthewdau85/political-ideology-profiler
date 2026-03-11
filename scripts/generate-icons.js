/**
 * Placeholder icon generator for app stores.
 *
 * Replace the generated placeholder icons with real artwork before
 * submitting to app stores. Required sizes:
 *
 *   PWA:      192x192, 512x512
 *   iOS:      1024x1024 (App Store), 180x180 (home screen)
 *   Android:  48, 72, 96, 144, 192, 512 (mdpi → xxxhdpi)
 *
 * For production, use a tool like https://icon.kitchen or
 * https://www.appicon.co to generate all sizes from a single 1024x1024 PNG.
 *
 * This script creates minimal SVG-based placeholder PNGs so the build works.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

mkdirSync(iconsDir, { recursive: true });

// Create a simple SVG placeholder and save as SVG (browsers handle SVG fine for dev)
function createPlaceholderSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <text x="50%" y="45%" text-anchor="middle" dominant-baseline="central"
        fill="#ffffff" font-family="serif" font-size="${size * 0.35}" font-weight="bold">IC</text>
  <text x="50%" y="72%" text-anchor="middle" dominant-baseline="central"
        fill="#888888" font-family="sans-serif" font-size="${size * 0.08}">Ideology Compass</text>
</svg>`;
}

// For now, write SVG files as placeholders
// In production, replace these with real PNG icons
const sizes = [48, 72, 96, 144, 180, 192, 512, 1024];

for (const size of sizes) {
  const svg = createPlaceholderSVG(size);
  writeFileSync(join(iconsDir, `icon-${size}.svg`), svg);
  console.log(`Created icon-${size}.svg`);
}

// Also create PNG-named SVG files for manifest compatibility during development
// Replace these with actual PNGs before app store submission
for (const size of [192, 512]) {
  const svg = createPlaceholderSVG(size);
  writeFileSync(join(iconsDir, `icon-${size}.png`), svg);
  console.log(`Created icon-${size}.png (SVG placeholder — replace with real PNG for production)`);
}

console.log('\nDone! Replace placeholder icons with real artwork before submitting to app stores.');
