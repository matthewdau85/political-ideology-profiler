import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { createCheckoutSession } from '../_lib/stripe';
import { getPriceForProduct, validFeatures } from '../_lib/entitlements';
import { normalizeProductKey } from '../_lib/billingConfig';
import { validateServerEnv } from '../_lib/serverEnv';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!(await checkRateLimit(req, res, 'checkout', { limit: 20, window: '1 m' }))) return;

  const envStatus = validateServerEnv({ allowMissingPrices: false });
  if (!envStatus.ok) {
    return res.status(503).json({
      error: 'Billing environment is not configured',
      missing: envStatus.missing,
    });
  }

  try {
    const requestedProduct = req.body?.productKey || req.body?.feature;
    const productKey = normalizeProductKey(requestedProduct);

    if (!validFeatures().includes(productKey)) {
      return res.status(400).json({ error: 'Invalid product key' });
    }

    const priceId = getPriceForProduct(productKey);
    if (!priceId) {
      return res.status(503).json({ error: `Price not configured for ${productKey}` });
    }

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const appOrigin = process.env.APP_ORIGIN;
    const mode = productKey === 'premium_membership' ? 'subscription' : 'payment';

    const session = await createCheckoutSession({
      mode,
      priceId,
      successUrl: `${appOrigin}/profile?checkout=success&product=${encodeURIComponent(productKey)}`,
      cancelUrl: `${appOrigin}/pricing?checkout=cancelled&product=${encodeURIComponent(productKey)}`,
      productKey,
      userId: user.id,
      email: user.email || '',
    });

    return res.status(200).json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[stripe/create-checkout-session] error', error);
    return res.status(500).json({ error: 'Unable to create checkout session' });
  }
}
