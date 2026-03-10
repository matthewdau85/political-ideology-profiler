import { requireRedis } from './_lib/redis';
import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';

const STATS_KEY = 'ideology_stats';
const COUNTRY_VALUES_KEY_PREFIX = 'ideology_country_values';

function median(values = []) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function withThreshold(data, threshold = 100) {
  return data.responses >= threshold ? data : { responses: data.responses, suppressed: true };
}

function parseHashStats(raw) {
  const clusters = {};
  const typologies = {};
  const countries = {};
  const ageBands = {};
  const topIssuesByCountry = {};

  for (const [key, value] of Object.entries(raw)) {
    const num = Number(value);
    if (key.startsWith('cluster:')) {
      clusters[key.slice(8)] = num;
    } else if (key.startsWith('typology:')) {
      typologies[key.slice(9)] = num;
    } else if (key.startsWith('country:')) {
      const rest = key.slice(8);
      const lastColon = rest.lastIndexOf(':');
      const countryName = rest.slice(0, lastColon);
      const field = rest.slice(lastColon + 1);
      if (!countries[countryName]) countries[countryName] = { count: 0, totalEconomic: 0, totalSocial: 0 };
      countries[countryName][field] = num;
    } else if (key.startsWith('ageBand:')) {
      const rest = key.slice(8);
      const lastColon = rest.lastIndexOf(':');
      const band = rest.slice(0, lastColon);
      const field = rest.slice(lastColon + 1);
      if (!ageBands[band]) ageBands[band] = { count: 0, totalEconomic: 0, totalSocial: 0 };
      ageBands[band][field] = num;
    } else if (key.startsWith('topIssue:')) {
      const rest = key.slice(9);
      const firstColon = rest.indexOf(':');
      const countryName = rest.slice(0, firstColon);
      const issue = rest.slice(firstColon + 1);
      if (!topIssuesByCountry[countryName]) topIssuesByCountry[countryName] = {};
      topIssuesByCountry[countryName][issue] = num;
    }
  }

  return {
    totalResponses: Number(raw.totalResponses) || 0,
    totalEconomic: Number(raw.totalEconomic) || 0,
    totalSocial: Number(raw.totalSocial) || 0,
    clusters,
    typologies,
    countries,
    ageBands,
    topIssuesByCountry,
  };
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['GET'])) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkRateLimit(req, res, 'stats', { limit: 30, window: '1 m' }))) return;

  try {
    const redis = requireRedis();
    const raw = (await redis.hgetall(STATS_KEY)) || {};
    const stats = parseHashStats(raw);

    const avgEconomic = stats.totalResponses > 0 ? Math.round((stats.totalEconomic / stats.totalResponses) * 10) / 10 : 0;
    const avgSocial = stats.totalResponses > 0 ? Math.round((stats.totalSocial / stats.totalResponses) * 10) / 10 : 0;

    // Fetch per-country medians from separate lists
    const countryStats = {};
    for (const [name, data] of Object.entries(stats.countries)) {
      const computed = {
        responses: data.count,
        avgEconomic: Math.round((data.totalEconomic / data.count) * 10) / 10,
        avgSocial: Math.round((data.totalSocial / data.count) * 10) / 10,
      };

      // Only fetch value lists for countries above the suppression threshold
      if (data.count >= 100) {
        const [econValues, socialValues] = await Promise.all([
          redis.lrange(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:economic`, 0, -1),
          redis.lrange(`${COUNTRY_VALUES_KEY_PREFIX}:${name}:social`, 0, -1),
        ]);
        computed.medianEconomic = Math.round(median(econValues.map(Number)) * 10) / 10;
        computed.medianSocial = Math.round(median(socialValues.map(Number)) * 10) / 10;
      }

      countryStats[name] = withThreshold(computed);
    }

    const ageBandStats = {};
    for (const [band, data] of Object.entries(stats.ageBands)) {
      ageBandStats[band] = withThreshold({
        responses: data.count,
        avgEconomic: Math.round((data.totalEconomic / data.count) * 10) / 10,
        avgSocial: Math.round((data.totalSocial / data.count) * 10) / 10,
      });
    }

    const topIssuesByCountry = {};
    for (const [country, issues] of Object.entries(stats.topIssuesByCountry)) {
      const responses = stats.countries[country]?.count || 0;
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
