const requiredClientEnv = {
  VITE_SUPABASE_URL: 'Supabase project URL for secure authentication.',
  VITE_SUPABASE_ANON_KEY: 'Supabase anon key for client auth sessions.',
};

export function getEnv(name, fallback = '') {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value : fallback;
}

export function validateClientEnv() {
  const missing = Object.keys(requiredClientEnv).filter((key) => !getEnv(key));
  if (missing.length === 0) return { ok: true, missing: [] };

  const isProd = import.meta.env.PROD;
  if (isProd) {
    console.error('[env] Missing required environment variables:', missing.join(', '));
  }

  return {
    ok: !isProd,
    missing,
    message: missing.map((key) => `${key}: ${requiredClientEnv[key]}`).join('\n'),
  };
}

export function stripePublishableKey() {
  return getEnv('VITE_STRIPE_PUBLISHABLE_KEY') || getEnv('VITE_STRIPE_PUBLIC_KEY');
}
