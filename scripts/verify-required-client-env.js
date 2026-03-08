import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = {
  VITE_SUPABASE_URL: 'Supabase project URL (https://<project-ref>.supabase.co)',
  VITE_SUPABASE_ANON_KEY: 'Supabase anon/public key used by the browser client',
};

const ENV_FILES = ['.env', '.env.local', '.env.production', '.env.production.local'];

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const contents = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function collectCandidateEnv(cwd) {
  const merged = {};
  for (const file of ENV_FILES) {
    const filePath = path.join(cwd, file);
    Object.assign(merged, parseEnvFile(filePath));
  }
  return merged;
}

function normalize(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return '';
  return trimmed;
}

const fileEnv = collectCandidateEnv(process.cwd());

const missing = Object.keys(REQUIRED).filter((key) => {
  const fromProcess = normalize(process.env[key]);
  const fromFiles = normalize(fileEnv[key]);
  return !fromProcess && !fromFiles;
});

if (missing.length > 0) {
  console.error('\n❌ Missing required client env vars for build:');
  for (const key of missing) {
    console.error(`- ${key}: ${REQUIRED[key]}`);
  }
  console.error('\nSet these in your shell or .env files before building locally.');
  console.error('For Vercel, define them in Project Settings → Environment Variables and redeploy.\n');
  process.exit(1);
}

console.log('✅ Required client env vars present for build.');
