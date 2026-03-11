import crypto from 'crypto';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeHeaders() {
  return {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

function toForm(data) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }
  return params.toString();
}

export async function createCheckoutSession(payload) {
  const form = {
    mode: payload.mode,
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
    'line_items[0][price]': payload.priceId,
    'line_items[0][quantity]': 1,
    'metadata[feature]': payload.feature,
    'metadata[userId]': payload.userId,
    'metadata[email]': payload.email || '',
    customer_email: payload.email || undefined,
    allow_promotion_codes: true,
  };

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: stripeHeaders(),
    body: toForm(form),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Unable to create checkout session');
  }
  return data;
}

export function verifyStripeWebhookSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const pairs = signatureHeader.split(',').map((v) => v.split('='));
  const sigMap = Object.fromEntries(pairs);
  const timestamp = sigMap.t;
  const expected = sigMap.v1;
  if (!timestamp || !expected) return false;

  const payload = `${timestamp}.${rawBody.toString()}`;
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(digest);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
