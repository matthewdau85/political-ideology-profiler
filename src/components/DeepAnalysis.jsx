import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPermalink } from '../utils/resultsStore';
import RadarAnalysis from '../charts/RadarAnalysis';
import PremiumGate from './PremiumGate';

export default function DeepAnalysis() {
  const { id } = useParams();
  const result = useMemo(() => {
    if (id) return getPermalink(id);
    // Try to get most recent result
    const all = JSON.parse(localStorage.getItem('ideology_permalinks') || '{}');
    const keys = Object.keys(all);
    return keys.length ? all[keys[keys.length - 1]] : null;
  }, [id]);

  if (!result) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>No results found</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          Take the quiz first to access deep analysis.
        </p>
        <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Premium Feature
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Deep Ideological Analysis</h1>

      <PremiumGate feature="deep_analysis">
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Seven-Dimension Radar</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Your ideological profile broken down across seven analytical dimensions.
          </p>
          <RadarAnalysis radarScores={result.radarScores || []} />
        </div>

        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Dimension Analysis</h2>
          {(result.radarScores || []).map(dim => (
            <div key={dim.dimension} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{dim.dimension}</span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{dim.value}/100</span>
              </div>
              <div style={{ height: 8, background: 'var(--color-bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${dim.value}%`, borderRadius: 4,
                  background: dim.value > 60 ? 'var(--color-accent)' : 'var(--color-text)',
                  opacity: 0.6, transition: 'width 0.5s ease',
                }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {getDimensionDescription(dim.dimension, dim.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Ideological Summary</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            As a <strong>{result.cluster}</strong>, your ideological profile places you at
            economic {result.economic > 0 ? '+' : ''}{result.economic} and social {result.social > 0 ? '+' : ''}{result.social}.
            {result.economic < -3 && ' Your economic views favor significant state intervention and redistribution.'}
            {result.economic >= -3 && result.economic <= 3 && ' Your economic views are centrist, balancing market mechanisms with social investment.'}
            {result.economic > 3 && ' Your economic views favor market mechanisms and limited government intervention.'}
            {result.social < -3 && ' Socially, you hold strongly progressive positions on civil liberties and social change.'}
            {result.social >= -3 && result.social <= 3 && ' Socially, you hold moderate positions, balancing tradition with progressive change.'}
            {result.social > 3 && ' Socially, you hold conservative positions, valuing tradition and established institutions.'}
          </p>
        </div>
      </PremiumGate>
    </div>
  );
}

function getDimensionDescription(dimension, value) {
  const level = value > 65 ? 'high' : value > 35 ? 'moderate' : 'low';
  const descriptions = {
    'State Capacity': { high: 'Strong belief in government capacity to solve problems.', moderate: 'Balanced view on government role.', low: 'Skeptical of government effectiveness.' },
    'Labour Power': { high: 'Strong support for workers\' rights and union power.', moderate: 'Moderate support for organized labor.', low: 'Preference for flexible labor markets.' },
    'Anti-Monopoly': { high: 'Strong support for breaking up concentrated economic power.', moderate: 'Some concern about corporate concentration.', low: 'Comfortable with market consolidation.' },
    'Globalism': { high: 'Strong internationalist orientation.', moderate: 'Balanced between global cooperation and national interest.', low: 'Preference for national sovereignty.' },
    'Progressivism': { high: 'Strongly progressive on social and cultural issues.', moderate: 'Moderate social views.', low: 'Preference for traditional social values.' },
    'Economic Left': { high: 'Strong preference for economic redistribution.', moderate: 'Centrist economic position.', low: 'Preference for market-led economics.' },
    'Movement Orientation': { high: 'Aligned with social movements and grassroots activism.', moderate: 'Some engagement with movement politics.', low: 'Preference for institutional channels.' },
  };
  return descriptions[dimension]?.[level] || '';
}
