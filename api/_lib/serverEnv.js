import { requiredStripePriceEnvVars } from './billingConfig';

const REQUIRED_SERVER_ENV = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'APP_ORIGIN',
  ...requiredStripePriceEnvVars(),
];

export function validateServerEnv({ allowMissingPrices = false } = {}) {
  const missing = REQUIRED_SERVER_ENV.filter((name) => {
    if (allowMissingPrices && name.startsWith('STRIPE_PRICE_')) return false;
    const value = process.env[name];
    return !value || !String(value).trim();
  });

  return {
    ok: missing.length === 0,
    missing,
  };
}

export function assertServerEnv(options = {}) {
  const status = validateServerEnv(options);
  if (!status.ok) {
    const message = `Missing required server environment variables: ${status.missing.join(', ')}`;
    const error = new Error(message);
    error.code = 'MISSING_SERVER_ENV';
    throw error;
  }
  return true;
}
