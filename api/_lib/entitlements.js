import { getRedis } from './redis';

const FEATURE_PRICE_MAP = {
  deep_analysis: process.env.STRIPE_PRICE_DEEP_ANALYSIS,
  report: process.env.STRIPE_PRICE_REPORT,
  country_comparison: process.env.STRIPE_PRICE_COUNTRY_COMPARISON,
  friend_comparison: process.env.STRIPE_PRICE_FRIEND_COMPARISON,
  premium_membership: process.env.STRIPE_PRICE_MEMBERSHIP,
};

const PRICE_TO_FEATURE = Object.entries(FEATURE_PRICE_MAP).reduce((acc, [feature, price]) => {
  if (price) acc[price] = feature;
  return acc;
}, {});

function keyForUser(userId) {
  return `entitlements:${userId}`;
}

export async function listEntitlements(userId) {
  const redis = getRedis();
  if (!redis || !userId) return {};
  return (await redis.hgetall(keyForUser(userId))) || {};
}

export async function hasEntitlement(userId, feature) {
  const all = await listEntitlements(userId);
  const parse = (v) => {
    if (!v) return null;
    try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return null; }
  };
  const direct = parse(all[feature]);
  const membership = parse(all.premium_membership);
  return Boolean((direct && direct.active) || (membership && membership.active));
}

export async function grantEntitlement(userId, feature, receipt = {}) {
  const redis = getRedis();
  if (!redis || !userId || !feature) return;
  await redis.hset(keyForUser(userId), {
    [feature]: JSON.stringify({
      active: true,
      grantedAt: new Date().toISOString(),
      ...receipt,
    }),
  });
}

export async function revokeEntitlement(userId, feature, metadata = {}) {
  const redis = getRedis();
  if (!redis || !userId || !feature) return;
  await redis.hset(keyForUser(userId), {
    [feature]: JSON.stringify({
      active: false,
      revokedAt: new Date().toISOString(),
      ...metadata,
    }),
  });
}

export function getFeatureFromPriceId(priceId) {
  return PRICE_TO_FEATURE[priceId] || null;
}

export function getPriceForFeature(feature) {
  return FEATURE_PRICE_MAP[feature] || null;
}

export const validFeatures = Object.keys(FEATURE_PRICE_MAP);
