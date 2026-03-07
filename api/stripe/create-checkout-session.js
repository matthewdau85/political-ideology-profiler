import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { getPriceForFeature, validFeatures } from '../_lib/entitlements';
import { createCheckoutSession } from '../_lib/stripe';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'checkout', { limit: 20, window: '1 m' }))) return;

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Stripe is not configured' });
  }

  const { feature } = req.body || {};
  if (!validFeatures.includes(feature)) {
    return res.status(400).json({ error: 'Invalid feature' });
  }

  const priceId = getPriceForFeature(feature);
  if (!priceId) {
    return res.status(503).json({ error: `Price not configured for ${feature}` });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const appOrigin = process.env.APP_ORIGIN;
  if (!appOrigin) {
    return res.status(503).json({ error: 'APP_ORIGIN is required' });
  }

  const mode = feature === 'premium_membership' ? 'subscription' : 'payment';

  const session = await createCheckoutSession({
    mode,
    priceId,
    successUrl: `${appOrigin}/profile?checkout=success`,
    cancelUrl: `${appOrigin}/pricing?checkout=cancelled`,
    feature,
    userId: user.id,
    email: user.email || '',
  });

  return res.status(200).json({ checkoutUrl: session.url });
}
