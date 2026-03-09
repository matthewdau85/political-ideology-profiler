import { applyCors } from '../_lib/cors';
import { checkRateLimit } from '../_lib/rateLimit';
import { getAuthenticatedUser } from '../_lib/auth';
import { adminDelete, adminInsert, adminSelect } from '../_lib/supabaseAdmin';
import { requireCaptcha } from '../_lib/botProtection';
import { inRangeNumber, parseIsoDate, rejectUnexpectedKeys } from '../_lib/validation';

function sanitizeResult(result = {}) {
  if (!inRangeNumber(result.economic, -10, 10) || !inRangeNumber(result.social, -10, 10)) {
    throw new Error('Invalid score range');
  }

  if (!inRangeNumber(result.typologyConfidence ?? 0, 0, 1)) {
    throw new Error('Invalid typology confidence');
  }

  const occurredAt = result.timestamp ? parseIsoDate(result.timestamp) : new Date();
  if (!occurredAt) throw new Error('Invalid timestamp');

  return {
    economic_score: Number(result.economic),
    social_score: Number(result.social),
    ideological_cluster: String(result.cluster || '').slice(0, 120),
    typology: String(result.typology || '').slice(0, 120),
    secondary_typology: result.secondaryTypology ? String(result.secondaryTypology).slice(0, 120) : null,
    typology_fit_score: Number(result.typologyConfidence ?? 0),
    radar_scores: Array.isArray(result.radarScores) ? result.radarScores : [],
    top_issues: Array.isArray(result.topIssues) ? result.topIssues.slice(0, 5) : [],
    country: String(result.country || 'Unknown').slice(0, 60),
    age_band: String(result.ageBand || 'Unknown').slice(0, 20),
    closest_figures: Array.isArray(result.closestFigures) ? result.closestFigures : [],
    methodology_version: String(result.methodologyVersion || '2026.1').slice(0, 20),
    quiz_version: String(result.quizVersion || '2.1').slice(0, 20),
    source: 'web',
    occurred_at: occurredAt.toISOString(),
  };
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET', 'POST', 'DELETE'])) return;
  if (!(await checkRateLimit(req, res, 'me-results', { limit: 120, window: '1 m' }))) return;

  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  try {
    if (req.method === 'GET') {
      const rows = await adminSelect(
        'quiz_results',
        `user_id=eq.${encodeURIComponent(user.id)}&select=*&order=occurred_at.asc`
      );
      return res.status(200).json({ results: rows || [] });
    }

    if (req.method === 'POST') {
      if (rejectUnexpectedKeys(res, req.body || {}, ['id','economic','social','cluster','clusterColor','clusterDescription','clusters','closestFigures','radarScores','topIssues','country','importanceUsed','timestamp','answers','typology','secondaryTypology','typologyConfidence','ageBand','methodologyVersion','quizVersion','captchaToken'])) return;
      if (!(await requireCaptcha(req, res, { required: true }))) return;
      const payload = sanitizeResult(req.body || {});
      const [saved] = await adminInsert('quiz_results', {
        user_id: user.id,
        ...payload,
      });
      return res.status(201).json({ result: saved });
    }

    if (req.method === 'DELETE') {
      await adminDelete('quiz_results', `user_id=eq.${encodeURIComponent(user.id)}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('me/results error:', err);
    return res.status(500).json({ error: 'Unable to manage quiz results' });
  }
}
