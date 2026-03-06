import React, { useState, useEffect } from 'react';
import { getStats } from '../utils/resultsStore';

export default function IdeologyStatsAPI() {
  const [copied, setCopied] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => {
        if (json.data?.totalResponses > 0) {
          setServerData(json);
          setSource('server');
        } else {
          throw new Error('empty');
        }
      })
      .catch(() => {
        // Fall back to local stats
        const local = getStats();
        const localResponse = {
          status: 'ok',
          data: {
            totalResponses: local.totalResponses,
            averageEconomicScore: local.avgEconomic,
            averageSocialScore: local.avgSocial,
            clusterDistribution: local.clusterDistribution,
            responsesByCountry: Object.entries(local.countryDistribution).reduce((acc, [country, d]) => {
              acc[country] = { responses: d.count, avgEconomic: d.avgEconomic, avgSocial: d.avgSocial };
              return acc;
            }, {}),
          },
          meta: {
            anonymized: true,
            generatedAt: new Date().toISOString(),
            description: 'Local preview of aggregate quiz statistics from this device.',
          },
        };
        setServerData(localResponse);
        setSource('local');
      });
  }, []);

  const jsonStr = serverData ? JSON.stringify(serverData, null, 2) : 'Loading...';

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Aggregate Statistics
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-md)' }}>
        {source === 'server' ? 'Global Statistics' : 'Statistics Preview'}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.7 }}>
        {source === 'server'
          ? 'Anonymized, aggregate statistics from all quiz participants. No individual results or personal information are included.'
          : 'A preview of aggregate statistics. Once the server is configured, this page will show data from all participants.'}
      </p>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h3>GET /api/stats</h3>
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
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>What's Included</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          This endpoint returns aggregate statistics only. Individual quiz responses cannot be
          accessed. Data includes:
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Average economic and social scores across all participants</li>
          <li>Distribution of political personality types</li>
          <li>Response counts and average scores by country</li>
        </ul>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Privacy</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          All data is fully anonymized. No individual responses, email addresses,
          IP addresses, or personally identifiable information are included.
          {source === 'local' && ' Currently showing local data from this device only.'}
        </p>
      </div>
    </div>
  );
}
