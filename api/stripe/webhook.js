import { applyCors } from '../_lib/cors';
import { verifyStripeWebhookSignature } from '../_lib/stripe';
import {
  getFeatureFromPriceId,
  grantProductEntitlements,
  isWebhookEventProcessed,
  markWebhookEventFailed,
  markWebhookEventProcessed,
  markWebhookEventProcessing,
  recordPayment,
  resolveUserIdFromStripeReferences,
  revokeProductEntitlements,
} from '../_lib/entitlements';
import { normalizeProductKey } from '../_lib/billingConfig';
import { validateServerEnv } from '../_lib/serverEnv';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function stripeTimeToIso(seconds) {
  if (!seconds) return new Date().toISOString();
  return new Date(seconds * 1000).toISOString();
}

function baseIdentifiers(object) {
  return {
    userId: object?.metadata?.userId || null,
    stripeCustomerId: object?.customer || null,
    stripeSubscriptionId: object?.subscription || object?.id || null,
    stripePaymentIntentId: object?.payment_intent || null,
  };
}

function productFromSession(session) {
  const direct = normalizeProductKey(session?.metadata?.productKey || session?.metadata?.feature || '');
  if (direct) return direct;

  const line = session?.line_items?.data?.[0];
  const priceId = line?.price?.id || session?.metadata?.priceId || null;
  return priceId ? getFeatureFromPriceId(priceId) : null;
}

async function recordEventPayment(event, object, productKey, status, identifiers, amountCents, currency) {
  await recordPayment({
    stripeEventId: event.id,
    status,
    userId: identifiers.userId,
    productKey,
    amountCents,
    currency,
    stripeCheckoutSessionId: object?.id?.startsWith?.('cs_') ? object.id : null,
    stripeCustomerId: identifiers.stripeCustomerId,
    stripeSubscriptionId: identifiers.stripeSubscriptionId,
    stripePaymentIntentId: identifiers.stripePaymentIntentId,
    rawEvent: event,
    occurredAt: stripeTimeToIso(object?.created),
  });
}

async function applyEntitlementChange({ active, userId, productKey, source, identifiers, expiresAt, reason }) {
  if (!userId || !productKey) return;

  const metadata = {
    source,
    reason: reason || null,
    stripeCustomerId: identifiers.stripeCustomerId,
    stripeSubscriptionId: identifiers.stripeSubscriptionId,
    stripePaymentIntentId: identifiers.stripePaymentIntentId,
    stripeSessionId: identifiers.stripeCheckoutSessionId || null,
    expiresAt: expiresAt || null,
  };

  if (active) {
    await grantProductEntitlements(userId, productKey, metadata);
  } else {
    await revokeProductEntitlements(userId, productKey, metadata);
  }
}

async function processEvent(event) {
  const object = event.data?.object || {};

  switch (event.type) {
    case 'checkout.session.completed': {
      const identifiers = {
        ...baseIdentifiers(object),
        stripeCheckoutSessionId: object.id,
      };
      const productKey = productFromSession(object);
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);

      await recordEventPayment(
        event,
        object,
        productKey,
        'checkout_completed',
        identifiers,
        object.amount_total || null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: true,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
      });
      break;
    }

    case 'invoice.paid': {
      const identifiers = baseIdentifiers(object);
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);
      const productKey = 'premium_membership';

      await recordEventPayment(
        event,
        object,
        productKey,
        'invoice_paid',
        identifiers,
        object.amount_paid || object.amount_due || null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: true,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
      });
      break;
    }

    case 'invoice.payment_failed': {
      const identifiers = baseIdentifiers(object);
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);
      const productKey = 'premium_membership';

      await recordEventPayment(
        event,
        object,
        productKey,
        'invoice_payment_failed',
        identifiers,
        object.amount_due || null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: false,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
        reason: 'payment_failed',
      });
      break;
    }

    case 'customer.subscription.updated': {
      const identifiers = baseIdentifiers(object);
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);
      const productKey = 'premium_membership';
      const subStatus = object.status || 'unknown';
      const entitlementActive = ['active', 'trialing'].includes(subStatus);

      await recordEventPayment(
        event,
        object,
        productKey,
        `subscription_${subStatus}`,
        identifiers,
        null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: entitlementActive,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
        reason: `subscription_status_${subStatus}`,
        expiresAt: object.current_period_end ? stripeTimeToIso(object.current_period_end) : null,
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const identifiers = baseIdentifiers(object);
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);
      const productKey = 'premium_membership';

      await recordEventPayment(
        event,
        object,
        productKey,
        'subscription_deleted',
        identifiers,
        null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: false,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
        reason: 'subscription_deleted',
      });
      break;
    }

    case 'charge.refunded': {
      const identifiers = {
        ...baseIdentifiers(object),
        stripeSubscriptionId: object?.invoice || null,
      };
      identifiers.userId = await resolveUserIdFromStripeReferences(identifiers);

      const productKey = normalizeProductKey(object?.metadata?.productKey || object?.metadata?.feature || '')
        || (object?.metadata?.isMembership === 'true' ? 'premium_membership' : null);

      await recordEventPayment(
        event,
        object,
        productKey,
        'charge_refunded',
        identifiers,
        object.amount_refunded || object.amount || null,
        object.currency || null,
      );

      await applyEntitlementChange({
        active: false,
        userId: identifiers.userId,
        productKey,
        source: event.type,
        identifiers,
        reason: 'refunded',
      });
      break;
    }

    default:
      break;
  }
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const envStatus = validateServerEnv({ allowMissingPrices: false });
  if (!envStatus.ok) {
    return res.status(503).json({ error: 'Server billing environment is not configured', missing: envStatus.missing });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];
  if (!webhookSecret || !signature) {
    return res.status(503).json({ error: 'Stripe webhook not configured' });
  }

  const rawBody = await getRawBody(req);
  if (rawBody.length > 256 * 1024) {
    return res.status(413).json({ error: 'Webhook payload too large' });
  }
  const valid = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(rawBody.toString());

  if (await isWebhookEventProcessed(event.id)) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  await markWebhookEventProcessing(event.id, event.type, event);

  try {
    await processEvent(event);
    await markWebhookEventProcessed(event.id);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[stripe/webhook] processing failed', error);
    await markWebhookEventFailed(event.id, error.message || String(error));
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
