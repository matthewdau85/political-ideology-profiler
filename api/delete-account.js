import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';
import { getAuthenticatedUser } from './_lib/auth';
import { getRedis } from './_lib/redis';

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'delete-account', { limit: 5, window: '1 m' }))) return;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return res.status(503).json({ error: 'Account deletion is not configured' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error('Supabase delete user failed:', data);
      return res.status(500).json({ error: 'Failed to delete account' });
    }

    // Clean up Redis entitlements for deleted user
    const redis = getRedis();
    if (redis) {
      await redis.del(`entitlements:${user.id}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('delete-account error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
