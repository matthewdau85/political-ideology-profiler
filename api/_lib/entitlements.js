import { adminInsert, adminPatch, adminSelect } from './supabaseAdmin';
import { getProductConfig, getProductFromPriceId, listProductKeys, normalizeProductKey } from './billingConfig';

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

export function validFeatures() {
  return listProductKeys();
}

export function getPriceForProduct(productKey) {
  const config = getProductConfig(productKey);
  return config?.priceId || null;
}

export function getFeatureFromPriceId(priceId) {
  return getProductFromPriceId(priceId)?.normalizedKey || null;
}

export function entitlementFeaturesForProduct(productKey) {
  const config = getProductConfig(productKey);
  return config?.entitlementFeatures || [];
}

export async function listEntitlements(userId) {
  if (!userId) return {};
  const rows = await adminSelect('entitlements', `user_id=eq.${encodeURIComponent(userId)}&select=*`);
  return normalizeEntitlementRows(rows);
}

export async function hasEntitlement(userId, feature) {
  const normalizedFeature = normalizeProductKey(feature);
  const all = await listEntitlements(userId);
  const direct = all[normalizedFeature];
  const premiumAll = all.premium_all;
  const membership = all.premium_membership;
  return Boolean((direct && direct.active) || (premiumAll && premiumAll.active) || (membership && membership.active));
}

async function upsertEntitlement(userId, feature, isActive, receipt = {}) {
  if (!userId || !feature) return;

  const now = new Date().toISOString();
  await adminInsert(
    'entitlements',
    {
      user_id: userId,
      feature,
      feature_key: feature,
      active: Boolean(isActive),
      status: isActive ? 'active' : 'revoked',
      source: receipt.source || 'system',
      stripe_session_id: receipt.stripeSessionId || null,
      stripe_customer_id: receipt.stripeCustomerId || null,
      stripe_subscription_id: receipt.stripeSubscriptionId || null,
      stripe_payment_intent_id: receipt.stripePaymentIntentId || null,
      granted_at: isActive ? now : null,
      revoked_at: isActive ? null : now,
      expires_at: receipt.expiresAt || null,
      metadata: receipt,
      updated_at: now,
    },
    { upsert: true, onConflict: 'user_id,feature' },
  );
}

export async function grantProductEntitlements(userId, productKey, receipt = {}) {
  const features = entitlementFeaturesForProduct(productKey);
  if (!features.length) return;
  for (const feature of features) {
    await upsertEntitlement(userId, feature, true, receipt);
  }
}

export async function revokeProductEntitlements(userId, productKey, metadata = {}) {
  const features = entitlementFeaturesForProduct(productKey);
  if (!features.length) return;
  for (const feature of features) {
    await upsertEntitlement(userId, feature, false, metadata);
  }
}

export async function recordPayment(payment) {
  const payload = {
    user_id: payment.userId || null,
    feature: payment.productKey || payment.feature || null,
    product_key: payment.productKey || payment.feature || null,
    status: payment.status || 'unknown',
    amount_total: payment.amountCents || payment.amountTotal || null,
    amount_cents: payment.amountCents || payment.amountTotal || null,
    currency: payment.currency || null,
    stripe_event_id: payment.stripeEventId || null,
    stripe_session_id: payment.stripeCheckoutSessionId || payment.stripeSessionId || null,
    stripe_checkout_session_id: payment.stripeCheckoutSessionId || payment.stripeSessionId || null,
    stripe_customer_id: payment.stripeCustomerId || null,
    stripe_subscription_id: payment.stripeSubscriptionId || null,
    stripe_payment_intent_id: payment.stripePaymentIntentId || null,
    metadata: payment.rawEvent || payment.metadata || {},
    raw_event: payment.rawEvent || payment.metadata || {},
    occurred_at: payment.occurredAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const canUpsertByEvent = Boolean(payload.stripe_event_id);

  await adminInsert(
    'payments',
    payload,
    canUpsertByEvent
      ? { upsert: true, onConflict: 'stripe_event_id' }
      : { upsert: false },
  );
}

export async function markWebhookEventProcessing(eventId, eventType, rawEvent) {
  const now = new Date().toISOString();
  await adminInsert(
    'processed_webhook_events',
    {
      stripe_event_id: eventId,
      stripe_event_type: eventType,
      status: 'processing',
      raw_event: rawEvent,
      processed_at: now,
      created_at: now,
      updated_at: now,
    },
    { upsert: true, onConflict: 'stripe_event_id' },
  );
}

export async function markWebhookEventProcessed(eventId) {
  const now = new Date().toISOString();
  await adminPatch(
    'processed_webhook_events',
    `stripe_event_id=eq.${encodeURIComponent(eventId)}`,
    {
      status: 'processed',
      error_message: null,
      updated_at: now,
      processed_at: now,
    },
  );
}

export async function markWebhookEventFailed(eventId, errorMessage) {
  const now = new Date().toISOString();
  await adminPatch(
    'processed_webhook_events',
    `stripe_event_id=eq.${encodeURIComponent(eventId)}`,
    {
      status: 'failed',
      error_message: String(errorMessage || 'unknown error').slice(0, 1000),
      updated_at: now,
      processed_at: now,
    },
  );
}

export async function isWebhookEventProcessed(eventId) {
  const rows = await adminSelect(
    'processed_webhook_events',
    `stripe_event_id=eq.${encodeURIComponent(eventId)}&select=stripe_event_id,status&limit=1`,
  );
  const row = rows?.[0];
  return row?.status === 'processed';
}

export async function resolveUserIdFromStripeReferences({ userId, stripeCustomerId, stripeSubscriptionId, stripePaymentIntentId }) {
  if (userId) return userId;

  const filters = [];
  if (stripePaymentIntentId) filters.push(`stripe_payment_intent_id=eq.${encodeURIComponent(stripePaymentIntentId)}`);
  if (stripeSubscriptionId) filters.push(`stripe_subscription_id=eq.${encodeURIComponent(stripeSubscriptionId)}`);
  if (stripeCustomerId) filters.push(`stripe_customer_id=eq.${encodeURIComponent(stripeCustomerId)}`);

  if (!filters.length) return null;

  const query = `${filters.join('&')}&select=user_id,occurred_at&order=occurred_at.desc&limit=1`;
  const rows = await adminSelect('payments', query);
  return rows?.[0]?.user_id || null;
}
