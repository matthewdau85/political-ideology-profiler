import { applyCors } from './_lib/cors';
import { grantEntitlement, revokeEntitlement } from './_lib/entitlements';
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
