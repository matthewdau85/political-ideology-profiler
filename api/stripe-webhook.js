import { applyCors } from './_lib/cors.js';
import { grantEntitlement, revokeEntitlement } from './_lib/entitlements.js';
import { verifyStripeWebhookSignature } from './_lib/stripe.js';
import { getRedis } from './_lib/redis.js';

const PROCESSED_EVENTS_PREFIX = 'stripe_event:';
const EVENT_TTL_SECONDS = 60 * 60 * 24; // 24 hours

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

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];
  if (!webhookSecret || !signature) {
    return res.status(503).json({ error: 'Stripe webhook not configured' });
  }

  const rawBody = await getRawBody(req);
  const isValid = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(rawBody.toString());

  // Idempotency: skip already-processed events
  const redis = getRedis();
  if (redis) {
    const eventKey = `${PROCESSED_EVENTS_PREFIX}${event.id}`;
    const alreadyProcessed = await redis.get(eventKey);
    if (alreadyProcessed) {
      return res.status(200).json({ received: true, duplicate: true });
    }
    await redis.set(eventKey, '1', { ex: EVENT_TTL_SECONDS });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const feature = session.metadata?.feature;
        const userId = session.metadata?.userId;
        if (feature && userId) {
          await grantEntitlement(userId, feature, {
            source: event.type,
            stripeSessionId: session.id,
            amountTotal: session.amount_total,
            currency: session.currency,
            receiptEmail: session.customer_email,
          });
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const userId = charge.metadata?.userId;
        const feature = charge.metadata?.feature;
        if (feature && userId) {
          await revokeEntitlement(userId, feature, {
            source: event.type,
            stripeChargeId: charge.id,
          });
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const object = event.data.object;
        const userId = object.metadata?.userId;
        if (userId) {
          await revokeEntitlement(userId, 'premium_membership', {
            source: event.type,
            stripeObjectId: object.id,
          });
        }
        break;
      }
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('stripe webhook error', error);
    return res.status(500).json({ error: 'Webhook handling failed' });
  }
}
