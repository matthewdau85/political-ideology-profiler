import crypto from 'crypto';
import { applyCors } from '../_lib/cors';
import { adminSelect } from '../_lib/supabaseAdmin';

function isAdminAuthorized(req) {
  const configuredToken = process.env.ADMIN_API_TOKEN;
  if (!configuredToken) return false;

  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!bearer) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(bearer), Buffer.from(configuredToken));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET'])) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!isAdminAuthorized(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const [payments, entitlements, webhooks] = await Promise.all([
      adminSelect('payments', 'select=*&order=occurred_at.desc&limit=200'),
      adminSelect('entitlements', 'select=*&order=updated_at.desc&limit=200'),
      adminSelect('processed_webhook_events', 'select=*&order=updated_at.desc&limit=200'),
    ]);

    return res.status(200).json({
      payments,
      entitlements,
      webhookEvents: webhooks,
      summary: {
        successfulPayments: payments.filter((p) => String(p.status).includes('paid') || String(p.status).includes('checkout_completed')).length,
        failedPayments: payments.filter((p) => String(p.status).includes('failed')).length,
        activeEntitlements: entitlements.filter((e) => e.active).length,
        revokedEntitlements: entitlements.filter((e) => !e.active).length,
        failedWebhookEvents: webhooks.filter((w) => w.status === 'failed').length,
      },
    });
  } catch (error) {
    console.error('[admin/billing-overview] error', error);
    return res.status(500).json({ error: 'Unable to load billing overview' });
  }
}
