import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { adminInsert, adminSelect } from '../_lib/supabaseAdmin';

function sanitizeProfile(body = {}) {
  return {
    display_name: body.displayName ? String(body.displayName).slice(0, 80) : null,
    country: body.country ? String(body.country).slice(0, 60) : null,
    age_band: body.ageBand ? String(body.ageBand).slice(0, 20) : null,
    methodology_version: body.methodologyVersion ? String(body.methodologyVersion).slice(0, 20) : null,
    quiz_version: body.quizVersion ? String(body.quizVersion).slice(0, 20) : null,
    updated_at: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET', 'PATCH'])) return;
  if (!(await checkRateLimit(req, res, 'me-profile', { limit: 120, window: '1 m' }))) return;

  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  try {
    if (req.method === 'GET') {
      const rows = await adminSelect('profiles', `id=eq.${encodeURIComponent(user.id)}&select=*`);
      return res.status(200).json({ profile: rows?.[0] || null });
    }

    if (req.method === 'PATCH') {
      const payload = sanitizeProfile(req.body || {});
      const [profile] = await adminInsert('profiles', {
        id: user.id,
        email: user.email || null,
        ...payload,
      }, { upsert: true, onConflict: 'id' });

      return res.status(200).json({ profile });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('me/profile error:', err);
    return res.status(500).json({ error: 'Unable to manage profile' });
  }
}
