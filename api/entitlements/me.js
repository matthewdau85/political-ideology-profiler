import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { listEntitlements } from '../_lib/entitlements';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET'])) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'entitlements-me', { limit: 60, window: '1 m' }))) return;

  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const entitlements = await listEntitlements(user.id);
  return res.status(200).json({ userId: user.id, entitlements });
}
