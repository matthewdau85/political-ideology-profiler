import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';
import { getAuthenticatedUser } from './_lib/auth';
import { getRedis } from './_lib/redis';

const MAX_RESULTS_PER_USER = 100;

function resultsKey(userId) {
  return `user_results:${userId}`;
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET', 'POST'])) return;

  const redis = getRedis();
  if (!redis) {
    return res.status(503).json({ error: 'Storage not configured' });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'GET') {
    if (!(await checkRateLimit(req, res, 'results-get', { limit: 60, window: '1 m' }))) return;

    const raw = await redis.lrange(resultsKey(user.id), 0, MAX_RESULTS_PER_USER - 1);
    const results = raw.map(item => {
      try { return typeof item === 'string' ? JSON.parse(item) : item; } catch { return null; }
    }).filter(Boolean);

    return res.status(200).json({ results });
  }

  if (req.method === 'POST') {
    if (!(await checkRateLimit(req, res, 'results-post', { limit: 10, window: '1 m' }))) return;

    const { result } = req.body || {};
    if (!result || typeof result.economic !== 'number' || typeof result.social !== 'number') {
      return res.status(400).json({ error: 'Invalid result data' });
    }

    const entry = {
      id: result.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      economic: result.economic,
      social: result.social,
      cluster: String(result.cluster || 'Unknown').slice(0, 100),
      typology: String(result.typology || 'Unknown').slice(0, 80),
      topIssues: Array.isArray(result.topIssues) ? result.topIssues.slice(0, 5) : [],
      radarScores: Array.isArray(result.radarScores) ? result.radarScores : [],
      closestFigures: Array.isArray(result.closestFigures) ? result.closestFigures.slice(0, 3) : [],
      timestamp: new Date().toISOString(),
    };

    await redis.lpush(resultsKey(user.id), JSON.stringify(entry));
    await redis.ltrim(resultsKey(user.id), 0, MAX_RESULTS_PER_USER - 1);

    return res.status(200).json({ ok: true, id: entry.id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
