const REQUIRED_CLIENT_ENV = {
  VITE_SUPABASE_URL: 'Supabase project URL (https://<project-ref>.supabase.co).',
  VITE_SUPABASE_ANON_KEY: 'Supabase anon/public key used by the browser client.',
};

function normalize(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return '';
  return trimmed;
}

export function readClientEnv(name) {
  return normalize(import.meta.env[name]);
}

export function getClientConfig() {
  return {
    supabaseUrl: readClientEnv('VITE_SUPABASE_URL'),
    supabaseAnonKey: readClientEnv('VITE_SUPABASE_ANON_KEY'),
    stripePublishableKey: readClientEnv('VITE_STRIPE_PUBLISHABLE_KEY'),
    mode: import.meta.env.MODE,
    isProd: Boolean(import.meta.env.PROD),
  };
}

export function validateClientEnv() {
  const missing = Object.keys(REQUIRED_CLIENT_ENV).filter((key) => !readClientEnv(key));
  const { isProd, mode } = getClientConfig();

  const details = missing.map((key) => `${key}: ${REQUIRED_CLIENT_ENV[key]}`);

  return {
    ok: missing.length === 0,
    missing,
    mode,
    isProd,
    details,
    summary:
      missing.length === 0
        ? 'All required client environment variables are present.'
        : `Missing required client environment variables: ${missing.join(', ')}`,
  };
}


export function getEnv(name, fallback = '') {
  const value = readClientEnv(name);
  return value || fallback;
}

export function assertClientEnv() {
  const status = validateClientEnv();
  if (!status.ok) {
    throw new Error(status.summary);
  }
  return getClientConfig();
}

export function stripePublishableKey() {
  return readClientEnv('VITE_STRIPE_PUBLISHABLE_KEY');
}
