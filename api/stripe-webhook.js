import { applyCors } from './_lib/cors';
import { grantEntitlement, revokeEntitlement, recordPayment } from './_lib/entitlements';
import { verifyStripeWebhookSignature } from './_lib/stripe';

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

function sessionMetadata(session) {
  return {
    userId: session.metadata?.userId || null,
    feature: session.metadata?.feature || null,
  };
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, feature } = sessionMetadata(session);

        await recordPayment({
          stripeEventId: event.id,
          status: 'checkout_completed',
          userId,
          feature,
          amountTotal: session.amount_total,
          currency: session.currency,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer || null,
          stripeSubscriptionId: session.subscription || null,
          stripePaymentIntentId: session.payment_intent || null,
          metadata: session,
          occurredAt: new Date(session.created * 1000).toISOString(),
        });

        if (feature && userId) {
          await grantEntitlement(userId, feature, {
            source: event.type,
            stripeSessionId: session.id,
            stripeCustomerId: session.customer || null,
            stripeSubscriptionId: session.subscription || null,
            stripePaymentIntentId: session.payment_intent || null,
            amountTotal: session.amount_total,
            currency: session.currency,
          });
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const userId = charge.metadata?.userId || null;
        const feature = charge.metadata?.feature || null;

        await recordPayment({
          stripeEventId: event.id,
          status: 'charge_refunded',
          userId,
          feature,
          amountTotal: charge.amount_refunded || charge.amount,
          currency: charge.currency,
          stripeCustomerId: charge.customer || null,
          stripePaymentIntentId: charge.payment_intent || null,
          metadata: charge,
          occurredAt: new Date(charge.created * 1000).toISOString(),
        });

        if (feature && userId) {
          await revokeEntitlement(userId, feature, {
            source: event.type,
            stripeCustomerId: charge.customer || null,
            stripePaymentIntentId: charge.payment_intent || null,
          });
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object;
        const userId = obj.metadata?.userId || null;
        const feature = 'premium_membership';

        await recordPayment({
          stripeEventId: event.id,
          status: event.type,
          userId,
          feature,
          amountTotal: obj.amount_due || obj.amount_paid || null,
          currency: obj.currency || null,
          stripeCustomerId: obj.customer || null,
          stripeSubscriptionId: obj.subscription || obj.id || null,
          metadata: obj,
          occurredAt: new Date((obj.created || Date.now() / 1000) * 1000).toISOString(),
        });

        if (userId) {
          await revokeEntitlement(userId, feature, {
            source: event.type,
            stripeCustomerId: obj.customer || null,
            stripeSubscriptionId: obj.subscription || obj.id || null,
          });
        }
        break;
      }
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('stripe webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
