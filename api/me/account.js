import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { adminDelete, adminDeleteAuthUser } from '../_lib/supabaseAdmin';
import { requireCaptcha } from '../_lib/botProtection';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['DELETE'])) return;
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'me-account-delete', { limit: 10, window: '1 h' }))) return;

  if (!(await requireCaptcha(req, res))) return;

  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  try {
    await adminDelete('profiles', `id=eq.${encodeURIComponent(user.id)}`);
    await adminDelete('quiz_results', `user_id=eq.${encodeURIComponent(user.id)}`);
    await adminDelete('entitlements', `user_id=eq.${encodeURIComponent(user.id)}`);
    await adminDelete('payments', `user_id=eq.${encodeURIComponent(user.id)}`);
    await adminDeleteAuthUser(user.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('me/account delete error:', err);
    return res.status(500).json({ error: 'Unable to delete account' });
  }
}
