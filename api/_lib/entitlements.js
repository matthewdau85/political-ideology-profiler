import { adminInsert, adminSelect } from './supabaseAdmin';

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

function normalizeEntitlementRows(rows) {
  const byFeature = {};
  for (const row of rows || []) {
    byFeature[row.feature] = {
      active: Boolean(row.active),
      feature: row.feature,
      source: row.source,
      stripeSessionId: row.stripe_session_id,
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      grantedAt: row.granted_at,
      revokedAt: row.revoked_at,
      expiresAt: row.expires_at,
      metadata: row.metadata || {},
      updatedAt: row.updated_at,
    };
  }
  return byFeature;
}

export async function listEntitlements(userId) {
  if (!userId) return {};
  const rows = await adminSelect('entitlements', `user_id=eq.${encodeURIComponent(userId)}&select=*`);
  return normalizeEntitlementRows(rows);
}

export async function hasEntitlement(userId, feature) {
  const all = await listEntitlements(userId);
  const direct = all[feature];
  const membership = all.premium_membership;
  return Boolean((direct && direct.active) || (membership && membership.active));
}

export async function grantEntitlement(userId, feature, receipt = {}) {
  if (!userId || !feature) return;
  await adminInsert(
    'entitlements',
    {
      user_id: userId,
      feature,
      active: true,
      source: receipt.source || 'system',
      stripe_session_id: receipt.stripeSessionId || null,
      stripe_customer_id: receipt.stripeCustomerId || null,
      stripe_subscription_id: receipt.stripeSubscriptionId || null,
      stripe_payment_intent_id: receipt.stripePaymentIntentId || null,
      granted_at: new Date().toISOString(),
      revoked_at: null,
      expires_at: receipt.expiresAt || null,
      metadata: receipt,
      updated_at: new Date().toISOString(),
    },
    { upsert: true, onConflict: 'user_id,feature' }
  );
}

export async function revokeEntitlement(userId, feature, metadata = {}) {
  if (!userId || !feature) return;
  await adminInsert(
    'entitlements',
    {
      user_id: userId,
      feature,
      active: false,
      source: metadata.source || 'system',
      stripe_session_id: metadata.stripeSessionId || null,
      stripe_customer_id: metadata.stripeCustomerId || null,
      stripe_subscription_id: metadata.stripeSubscriptionId || null,
      stripe_payment_intent_id: metadata.stripePaymentIntentId || null,
      revoked_at: new Date().toISOString(),
      metadata,
      updated_at: new Date().toISOString(),
    },
    { upsert: true, onConflict: 'user_id,feature' }
  );
}

export async function recordPayment(payment) {
  await adminInsert(
    'payments',
    {
      user_id: payment.userId || null,
      feature: payment.feature || null,
      status: payment.status || 'unknown',
      amount_total: payment.amountTotal || null,
      currency: payment.currency || null,
      stripe_event_id: payment.stripeEventId || null,
      stripe_session_id: payment.stripeSessionId || null,
      stripe_customer_id: payment.stripeCustomerId || null,
      stripe_subscription_id: payment.stripeSubscriptionId || null,
      stripe_payment_intent_id: payment.stripePaymentIntentId || null,
      metadata: payment.metadata || {},
      occurred_at: payment.occurredAt || new Date().toISOString(),
    },
    { upsert: true, onConflict: 'stripe_event_id' }
  );
}

export function getFeatureFromPriceId(priceId) {
  return PRICE_TO_FEATURE[priceId] || null;
}

export function getPriceForFeature(feature) {
  return FEATURE_PRICE_MAP[feature] || null;
}

export const validFeatures = Object.keys(FEATURE_PRICE_MAP);
