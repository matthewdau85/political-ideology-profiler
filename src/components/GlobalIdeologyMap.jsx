import React, { useMemo, useState, lazy, Suspense } from 'react';
import { getStats } from '../utils/resultsStore';

// Lazy load the map components for performance
const ComposableMap = lazy(() => import('react-simple-maps').then(m => ({ default: m.ComposableMap })));
const Geographies = lazy(() => import('react-simple-maps').then(m => ({ default: m.Geographies })));
const Geography = lazy(() => import('react-simple-maps').then(m => ({ default: m.Geography })));
const ZoomableGroup = lazy(() => import('react-simple-maps').then(m => ({ default: m.ZoomableGroup })));

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map country names to ISO/GeoJSON names
const COUNTRY_MAP = {
  'United States': 'United States of America',
  'United Kingdom': 'United Kingdom',
  'Australia': 'Australia',
  'Germany': 'Germany',
  'Sweden': 'Sweden',
  'Canada': 'Canada',
  'France': 'France',
  'New Zealand': 'New Zealand',
};

function getEconomicColor(value) {
  if (value === null || value === undefined) return '#e2e0dc';
  const t = (value + 10) / 20;
  const r = Math.round(37 + t * (220 - 37));
  const g = Math.round(99 + (1 - Math.abs(t - 0.5) * 2) * 50);
  const b = Math.round(235 + t * (38 - 235));
  return `rgb(${r},${g},${b})`;
}

function getSocialColor(value) {
  if (value === null || value === undefined) return '#e2e0dc';
  const t = (value + 10) / 20;
  const r = Math.round(124 + t * (217 - 124));
  const g = Math.round(58 + (1 - Math.abs(t - 0.5) * 2) * 50);
  const b = Math.round(237 + t * (6 - 237));
  return `rgb(${r},${g},${b})`;
}

export default function GlobalIdeologyMap() {
  const stats = useMemo(() => getStats(), []);
  const [metric, setMetric] = useState('economic'); // economic | social
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const countryScores = useMemo(() => {
    const scores = {};
    for (const [name, data] of Object.entries(stats.countryDistribution)) {
      const geoName = COUNTRY_MAP[name] || name;
      scores[geoName] = {
        displayName: name,
        count: data.count,
        avgEconomic: data.avgEconomic,
        avgSocial: data.avgSocial,
      };
    }
    return scores;
  }, [stats]);

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Global Dataset
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-md)' }}>Geographic Ideology Map</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        Ideological trends by country based on anonymized quiz responses.
      </p>

      {/* Metric toggle */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
        <button
          className={`btn btn-sm ${metric === 'economic' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMetric('economic')}
        >
          Economic Axis
        </button>
        <button
          className={`btn btn-sm ${metric === 'social' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMetric('social')}
        >
          Social Axis
        </button>
      </div>

      {/* Map */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--spacing-xl)', position: 'relative' }}>
        <Suspense fallback={
          <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
            Loading map...
          </div>
        }>
          <ComposableMap
            projectionConfig={{ scale: 147, center: [0, 20] }}
            style={{ width: '100%', height: 'auto' }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const name = geo.properties.name;
                    const data = countryScores[name];
                    const value = data
                      ? (metric === 'economic' ? data.avgEconomic : data.avgSocial)
                      : null;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={metric === 'economic' ? getEconomicColor(value) : getSocialColor(value)}
                        stroke="#faf9f6"
                        strokeWidth={0.5}
                        style={{
                          hover: { fill: '#c4a035', outline: 'none' },
                          pressed: { outline: 'none' },
                          default: { outline: 'none' },
                        }}
                        onMouseEnter={() => setHoveredCountry(data ? { name: data.displayName, ...data } : { name })}
                        onMouseLeave={() => setHoveredCountry(null)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </Suspense>

        {hoveredCountry && (
          <div style={{
            position: 'absolute', bottom: 16, left: 16, background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: 13, pointerEvents: 'none',
          }}>
            <strong>{hoveredCountry.name}</strong>
            {hoveredCountry.count > 0 && (
              <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                Responses: {hoveredCountry.count} | Econ: {hoveredCountry.avgEconomic} | Social: {hoveredCountry.avgSocial}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          {metric === 'economic' ? 'Socialist (-10)' : 'Progressive (-10)'}
        </span>
        <div style={{
          flex: 1, height: 8, borderRadius: 4,
          background: metric === 'economic'
            ? 'linear-gradient(to right, #2563eb, #e2e0dc, #dc2626)'
            : 'linear-gradient(to right, #7c3aed, #e2e0dc, #d97706)',
        }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          {metric === 'economic' ? 'Market Liberal (+10)' : 'Conservative (+10)'}
        </span>
      </div>

      {/* Country table */}
      {Object.keys(countryScores).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Country Data</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Country', 'Responses', 'Avg Economic', 'Avg Social'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(countryScores).sort((a, b) => b.count - a.count).map(c => (
                  <tr key={c.displayName}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)' }}>{c.displayName}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)' }}>{c.count}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', color: c.avgEconomic < 0 ? 'var(--color-economic-left)' : 'var(--color-economic-right)' }}>{c.avgEconomic}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', color: c.avgSocial < 0 ? 'var(--color-social-prog)' : 'var(--color-social-cons)' }}>{c.avgSocial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {Object.keys(countryScores).length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No Geographic Data Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
            Country data will appear as users complete the quiz with location selected.
          </p>
        </div>
      )}
    </div>
  );
}
