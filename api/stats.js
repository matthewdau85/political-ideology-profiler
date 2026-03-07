import { Redis } from '@upstash/redis';
import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';

const STATS_KEY = 'ideology_stats';

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

function median(values = []) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function withThreshold(data, threshold = 100) {
  return data.responses >= threshold ? data : { responses: data.responses, suppressed: true };
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET'])) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'stats', { limit: 30, window: '1 m' }))) return;

  try {
    const redis = getRedis();
    const stats = (await redis.get(STATS_KEY)) || {
      totalResponses: 0,
      totalEconomic: 0,
      totalSocial: 0,
      clusters: {},
      typologies: {},
      countries: {},
      ageBands: {},
      topIssuesByCountry: {},
    };

    const avgEconomic = stats.totalResponses > 0 ? Math.round((stats.totalEconomic / stats.totalResponses) * 10) / 10 : 0;
    const avgSocial = stats.totalResponses > 0 ? Math.round((stats.totalSocial / stats.totalResponses) * 10) / 10 : 0;

    const countryStats = {};
    for (const [name, data] of Object.entries(stats.countries || {})) {
      const computed = {
        responses: data.count,
        avgEconomic: Math.round((data.totalEconomic / data.count) * 10) / 10,
        avgSocial: Math.round((data.totalSocial / data.count) * 10) / 10,
        medianEconomic: Math.round(median(data.economicValues || []) * 10) / 10,
        medianSocial: Math.round(median(data.socialValues || []) * 10) / 10,
      };
      countryStats[name] = withThreshold(computed);
    }

    const ageBandStats = {};
    for (const [band, data] of Object.entries(stats.ageBands || {})) {
      ageBandStats[band] = withThreshold({
        responses: data.count,
        avgEconomic: Math.round((data.totalEconomic / data.count) * 10) / 10,
        avgSocial: Math.round((data.totalSocial / data.count) * 10) / 10,
      });
    }

    const topIssuesByCountry = {};
    for (const [country, issues] of Object.entries(stats.topIssuesByCountry || {})) {
      const responses = stats.countries?.[country]?.count || 0;
      if (responses < 100) {
        topIssuesByCountry[country] = { responses, suppressed: true };
      } else {
        topIssuesByCountry[country] = {
          responses,
          topIssues: Object.entries(issues).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([issue, count]) => ({ issue, count })),
        };
      }
    }

    return res.status(200).json({
      status: 'ok',
      data: {
        totalResponses: stats.totalResponses,
        averageEconomicScore: avgEconomic,
        averageSocialScore: avgSocial,
        clusterDistribution: stats.clusters,
        typologyDistribution: stats.typologies,
        responsesByCountry: countryStats,
        responsesByAgeBand: ageBandStats,
        topIssuesByCountry,
      },
      meta: {
        anonymized: true,
        subgroupThreshold: 100,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('stats error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
