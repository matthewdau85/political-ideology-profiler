import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPermalink } from '../utils/resultsStore';
import parties from '../data/parties';
import { findClosestParties } from '../utils/calcResults';
import PremiumGate from './PremiumGate';

export default function CountryComparison() {
  const { id } = useParams();
  const [expanded, setExpanded] = useState(null);

  const result = useMemo(() => {
    if (id) return getPermalink(id);
    const all = JSON.parse(localStorage.getItem('ideology_permalinks') || '{}');
    const keys = Object.keys(all);
    return keys.length ? all[keys[keys.length - 1]] : null;
  }, [id]);

  const partyComparisons = useMemo(() => {
    if (!result) return {};
    return findClosestParties(result.economic, result.social, parties);
  }, [result]);

  if (!result) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>No results found</h2>
        <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Premium Feature
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Country Party Comparison</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        See which political parties across 5 countries align closest with your ideology.
      </p>

      <PremiumGate feature="country_comparison">
        {Object.entries(partyComparisons).map(([country, countryParties]) => (
          <div key={country} className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === country ? null : country)}
            >
              <h3 style={{ fontSize: 18 }}>{country}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  Closest: <strong style={{ color: 'var(--color-text)' }}>{countryParties[0]?.name}</strong>
                </span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {expanded === country ? '\u25B2' : '\u25BC'}
                </span>
              </div>
            </div>

            {expanded === country && (
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                {countryParties.map((party, i) => (
                  <div key={party.name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: i < countryParties.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: party.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14 }}>{party.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      Distance: {party.distance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </PremiumGate>
    </div>
  );
}
