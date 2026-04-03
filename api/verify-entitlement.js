import { applyCors } from './_lib/cors.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { getAuthenticatedUser } from './_lib/auth.js';
import { hasEntitlement, validFeatures } from './_lib/entitlements.js';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET'])) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'verify-entitlement', { limit: 60, window: '1 m' }))) return;

  const feature = String(req.query.feature || 'deep_analysis');
  if (!validFeatures.includes(feature)) {
    return res.status(400).json({ error: 'Invalid feature' });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const entitled = await hasEntitlement(user.id, feature);
  return res.status(200).json({ entitled, feature });
}
