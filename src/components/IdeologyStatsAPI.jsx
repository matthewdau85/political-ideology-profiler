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
      description: 'Local preview of aggregate quiz statistics from this device.',
    },
  };

  const jsonStr = JSON.stringify(apiResponse, null, 2);

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Public API
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-md)' }}>Statistics Preview</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.7 }}>
        A preview of the aggregate statistics from quizzes completed on this device.
        When a backend is added, this data will be available as a public API endpoint with anonymized, aggregate data only.
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

      <div className="card">
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Note</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          This is a local preview only. The data shown reflects quizzes taken on this device.
          A live API endpoint with cross-user aggregate statistics will be available once
          backend infrastructure is in place. No personal information will ever be included.
        </p>
      </div>
    </div>
  );
}
