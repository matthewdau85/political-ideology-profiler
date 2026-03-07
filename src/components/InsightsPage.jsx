import React, { useEffect, useState } from 'react';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((payload) => setData(payload.data))
      .catch(() => setError('Unable to load insights right now.'));
  }, []);

  if (error) {
    return <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>{error}</div>;
  }

  if (!data) {
    return <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>Loading insights…</div>;
  }

  const total = data.totalResponses || 0;

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 980 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Insights Dashboard
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)' }}>/insights</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        Based on {total.toLocaleString()} responses. Subgroup insights are shown only where n ≥ 100.
      </p>

      <section className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3>Typology Distribution</h3>
        <ul style={{ lineHeight: 1.9 }}>
          {Object.entries(data.typologyDistribution || {}).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
            <li key={name}><strong>{name}</strong>: {count} ({total ? Math.round((count / total) * 100) : 0}%)</li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3>Typology by Country</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'var(--spacing-md)' }}>
          {Object.entries(data.responsesByCountry || {}).map(([country, stats]) => (
            <div key={country} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{country}</div>
              {stats.suppressed ? (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Suppressed (n&lt;100)</div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  n={stats.responses} · avg E {stats.avgEconomic} · avg S {stats.avgSocial}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3>Typology by Age Group</h3>
        <ul style={{ lineHeight: 1.9 }}>
          {Object.entries(data.responsesByAgeBand || {}).map(([ageBand, stats]) => (
            <li key={ageBand}>
              <strong>{ageBand}</strong>: {stats.suppressed ? 'Suppressed (n<100)' : `n=${stats.responses}, avg E ${stats.avgEconomic}, avg S ${stats.avgSocial}`}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Top Issues by Country</h3>
        {Object.entries(data.topIssuesByCountry || {}).map(([country, payload]) => (
          <div key={country} style={{ marginBottom: 12 }}>
            <strong>{country}</strong>{' '}
            {payload.suppressed ? (
              <span style={{ color: 'var(--color-text-secondary)' }}>Suppressed (n&lt;100)</span>
            ) : (
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {payload.topIssues.map((i) => `${i.issue} (${i.count})`).join(', ')}
              </span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
