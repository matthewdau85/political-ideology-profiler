const PRODUCT_CONFIG = {
  deep_analysis: {
    productKey: 'deep_analysis',
    envVar: 'STRIPE_PRICE_DEEP_ANALYSIS',
    mode: 'payment',
    entitlementFeatures: ['deep_analysis'],
  },
  report: {
    productKey: 'report',
    envVar: 'STRIPE_PRICE_REPORT',
    mode: 'payment',
    entitlementFeatures: ['report'],
  },
  country_compare: {
    productKey: 'country_compare',
    envVar: 'STRIPE_PRICE_COUNTRY_COMPARE',
    legacyEnvVar: 'STRIPE_PRICE_COUNTRY_COMPARISON',
    mode: 'payment',
    entitlementFeatures: ['country_compare'],
  },
  friend_compare: {
    productKey: 'friend_compare',
    envVar: 'STRIPE_PRICE_FRIEND_COMPARE',
    legacyEnvVar: 'STRIPE_PRICE_FRIEND_COMPARISON',
    mode: 'payment',
    entitlementFeatures: ['friend_compare'],
  },
  premium_membership: {
    productKey: 'premium_membership',
    envVar: 'STRIPE_PRICE_PREMIUM_MEMBERSHIP',
    legacyEnvVar: 'STRIPE_PRICE_MEMBERSHIP',
    mode: 'subscription',
    entitlementFeatures: ['premium_membership', 'premium_all'],
  },
};

const PRODUCT_ALIASES = {
  country_comparison: 'country_compare',
  friend_comparison: 'friend_compare',
};

function envValue(config) {
  return process.env[config.envVar] || (config.legacyEnvVar ? process.env[config.legacyEnvVar] : '') || '';
}

export function normalizeProductKey(productKey) {
  const key = String(productKey || '').trim();
  return PRODUCT_ALIASES[key] || key;
}

export function listProductKeys() {
  return Object.keys(PRODUCT_CONFIG);
}

export function getProductConfig(productKey) {
  const normalized = normalizeProductKey(productKey);
  const config = PRODUCT_CONFIG[normalized];
  if (!config) return null;
  const priceId = envValue(config);
  return {
    ...config,
    normalizedKey: normalized,
    priceId,
  };
}

export function getProductFromPriceId(priceId) {
  const entries = Object.entries(PRODUCT_CONFIG);
  for (const [key, config] of entries) {
    if (envValue(config) === priceId) {
      return {
        ...config,
        normalizedKey: key,
        priceId,
      };
    }
  }
  return null;
}

export function requiredStripePriceEnvVars() {
  return Object.values(PRODUCT_CONFIG).map((config) => config.envVar);
}
