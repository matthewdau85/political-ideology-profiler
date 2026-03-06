import React, { useMemo, useState } from 'react';
import { getStats } from '../utils/resultsStore';

export default function IdeologyStatsAPI() {
  const stats = useMemo(() => getStats(), []);
  const [copied, setCopied] = useState(false);

  const apiResponse = {
    status: 'ok',
    data: {
      totalResponses: stats.totalResponses,
      averageEconomicScore: stats.avgEconomic,
      averageSocialScore: stats.avgSocial,
      clusterDistribution: stats.clusterDistribution,
      responsesByCountry: Object.entries(stats.countryDistribution).reduce((acc, [country, data]) => {
        acc[country] = {
          responses: data.count,
          averageEconomic: data.avgEconomic,
          averageSocial: data.avgSocial,
        };
        return acc;
      }, {}),
    },
    meta: {
      anonymized: true,
      generatedAt: new Date().toISOString(),
      description: 'Anonymized aggregate ideology statistics from the Political Ideology Profiler.',
    },
  };

  const jsonStr = JSON.stringify(apiResponse, null, 2);

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Public API
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-md)' }}>Ideology Dataset API</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.7 }}>
        Anonymized, aggregate ideology statistics for journalists, researchers, and political scientists.
        All data is fully anonymized — no individual results or personal information are included.
      </p>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h3>GET /api/ideology-stats</h3>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              navigator.clipboard?.writeText(jsonStr);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
        <pre style={{
          background: 'var(--color-bg)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-md)',
          overflow: 'auto',
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
          maxHeight: 500,
        }}>
          {jsonStr}
        </pre>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Usage</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          This endpoint returns aggregate statistics only. Individual quiz responses cannot be
          accessed through this API. Data includes:
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Average economic and social scores across all respondents</li>
          <li>Distribution of ideological cluster classifications</li>
          <li>Response counts and average scores by country</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Citation</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          If you use this dataset in published research or journalism, please cite as:
        </p>
        <div className="mono" style={{
          background: 'var(--color-bg)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)',
          fontSize: 12, marginTop: 'var(--spacing-md)',
        }}>
          Political Ideology Profiler Dataset. [Year]. Anonymized aggregate ideology statistics.
          Available at: [URL]/api/ideology-stats
        </div>
      </div>

      <div className="privacy-notice">
        All data returned by this API is fully anonymized. No individual responses, email addresses,
        IP addresses, or personally identifiable information are included.
      </div>
    </div>
  );
}
