import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist/assets');
const maxJsBytes = 650 * 1024;

if (!fs.existsSync(distDir)) {
  console.error('dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const file of files) {
  const fullPath = path.join(distDir, file);
  const size = fs.statSync(fullPath).size;
  if (size > maxJsBytes) {
    failed = true;
    console.error(`Budget exceeded: ${file} ${(size / 1024).toFixed(1)}KB > ${(maxJsBytes / 1024).toFixed(0)}KB`);
  }
}

if (failed) process.exit(1);
console.log('Bundle budget check passed.');
