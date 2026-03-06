import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPermalink, getStats } from '../utils/resultsStore';
import figures from '../data/figures';
import IdeologyScatter from '../charts/IdeologyScatter';
import RadarAnalysis from '../charts/RadarAnalysis';
import AlignmentCard from './AlignmentCard';
import ShareCardGenerator from './ShareCardGenerator';
import AdSlot from './AdSlot';

export default function ResultsPage() {
  const { id } = useParams();
  const result = useMemo(() => getPermalink(id), [id]);
  const stats = useMemo(() => getStats(), []);

  if (!result) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Result not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          This result may have been deleted or doesn't exist.
        </p>
        <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
      </div>
    );
  }

  const closestFiguresFull = (result.closestFigures || []).map(cf => {
    const full = figures.find(f => f.id === cf.id || f.name === cf.name);
    return { ...full, ...cf };
  });

  return (
    <div className="results-page container">
      {/* Cluster classification */}
      <div className="results-header">
        <span className="mono results-label">Your Political Profile</span>
        <h1 className="results-cluster" style={{ color: result.clusterColor }}>
          {result.cluster}
        </h1>
        <p className="results-cluster-desc">{result.clusterDescription}</p>
      </div>

      {/* Axis scores */}
      <div className="results-scores">
        <div className="score-box">
          <span className="mono score-label">Economic Score</span>
          <span className={`score-value ${result.economic < 0 ? 'score-negative' : 'score-positive'}`}>
            {result.economic > 0 ? '+' : ''}{result.economic}
          </span>
          <span className="score-range mono">{result.economic < 0 ? 'Left-leaning' : 'Right-leaning'}</span>
        </div>
        <div className="score-box">
          <span className="mono score-label">Social Score</span>
          <span className={`score-value ${result.social < 0 ? 'score-negative' : 'score-positive'}`}>
            {result.social > 0 ? '+' : ''}{result.social}
          </span>
          <span className="score-range mono">{result.social < 0 ? 'Progressive' : 'Conservative'}</span>
        </div>
      </div>

      {/* Top alignment */}
      <section className="results-section">
        <h2 className="section-title">Closest Historical Figures</h2>
        {closestFiguresFull.map((fig, i) => (
          <div key={fig.id || i} style={{ marginBottom: 'var(--spacing-md)' }}>
            <AlignmentCard figure={fig} rank={i + 1} />
          </div>
        ))}
      </section>

      {/* Scatter chart */}
      <section className="results-section">
        <h2 className="section-title">Where You Land</h2>
        <div className="card">
          <IdeologyScatter
            economic={result.economic}
            social={result.social}
            closestFigures={closestFiguresFull}
            showAllFigures
          />
        </div>
      </section>

      {/* Radar analysis */}
      {result.radarScores?.length > 0 && (
        <section className="results-section">
          <h2 className="section-title">Your Political Dimensions</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 'var(--spacing-md)' }}>
            Beyond the two main axes, your answers reveal seven deeper dimensions of political thinking.
            Higher scores indicate stronger alignment with that dimension.
          </p>
          <div className="card">
            <RadarAnalysis radarScores={result.radarScores} />
            <div className="radar-legend">
              {[
                { name: 'State Capacity', desc: 'Support for a strong, active government that manages the economy and public services.' },
                { name: 'Labour Power', desc: 'Support for workers\u2019 rights, unions, and employee influence over workplaces.' },
                { name: 'Anti-Monopoly', desc: 'Opposition to concentrated corporate power and support for regulation or public alternatives.' },
                { name: 'Globalism', desc: 'Openness to international cooperation, immigration, and cross-border institutions.' },
                { name: 'Progressivism', desc: 'Support for social change, civil rights expansion, and challenging traditional norms.' },
                { name: 'Economic Left', desc: 'Preference for redistribution, public ownership, and reducing economic inequality.' },
                { name: 'Movement Orientation', desc: 'Inclination toward grassroots activism and systemic change over incremental reform.' },
              ].map(d => {
                const score = result.radarScores.find(r => r.dimension === d.name);
                return (
                  <div key={d.name} className="radar-legend-item">
                    <div className="radar-legend-header">
                      <span className="radar-legend-name">{d.name}</span>
                      {score && <span className="mono radar-legend-score">{score.value}/100</span>}
                    </div>
                    <p className="radar-legend-desc">{d.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cluster probabilities */}
      {result.clusters?.length > 0 && (
        <section className="results-section">
          <h2 className="section-title">How You Fit Each Type</h2>
          <div className="card">
            <div className="cluster-list">
              {result.clusters.filter(c => c.probability > 0.01).map(c => (
                <div key={c.id} className="cluster-item">
                  <div className="cluster-item-header">
                    <span className="cluster-dot" style={{ background: c.color }} />
                    <span className="cluster-item-name">{c.name}</span>
                    <span className="mono cluster-item-prob">{Math.round(c.probability * 100)}%</span>
                  </div>
                  <div className="cluster-bar-bg">
                    <div className="cluster-bar-fill" style={{ width: `${c.probability * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top issues */}
      {result.topIssues?.length > 0 && (
        <section className="results-section">
          <h2 className="section-title">Your Top Issues</h2>
          <div className="card">
            <ol className="top-issues-list">
              {result.topIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Dataset comparison */}
      {stats.totalResponses > 1 && (
        <section className="results-section">
          <h2 className="section-title">How You Compare</h2>
          <div className="card">
            <div className="compare-stats">
              <div className="compare-stat">
                <span className="mono compare-stat-label">Dataset Average Economic</span>
                <span className="compare-stat-value">{stats.avgEconomic}</span>
                <span className="mono compare-stat-you">You: {result.economic}</span>
              </div>
              <div className="compare-stat">
                <span className="mono compare-stat-label">Dataset Average Social</span>
                <span className="compare-stat-value">{stats.avgSocial}</span>
                <span className="mono compare-stat-you">You: {result.social}</span>
              </div>
              <div className="compare-stat">
                <span className="mono compare-stat-label">Total Responses</span>
                <span className="compare-stat-value">{stats.totalResponses}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Share card */}
      <section className="results-section">
        <h2 className="section-title">Share Your Results</h2>
        <ShareCardGenerator result={result} />
      </section>

      {/* Explore more */}
      <section className="results-section">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Explore More</h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
            Dig deeper into your results or challenge a friend.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/deep-analysis" className="btn btn-sm btn-accent">Deep Analysis</Link>
            <Link to="/country-comparison" className="btn btn-sm btn-secondary">Country Comparison</Link>
            <Link to="/debate/new" className="btn btn-sm btn-secondary">Challenge a Friend</Link>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="results-section" style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        <Link to="/quiz" className="btn btn-secondary">Retake Quiz</Link>
        <Link to="/map" className="btn btn-secondary">Global Map</Link>
      </section>

      <AdSlot placement="results_footer" />

      <style>{`
        .results-page { padding: var(--spacing-xl) 0 var(--spacing-3xl); max-width: 760px; }
        .results-header { text-align: center; margin-bottom: var(--spacing-2xl); }
        .results-label {
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--color-accent); display: block; margin-bottom: var(--spacing-sm);
        }
        .results-cluster { font-size: 36px; margin-bottom: var(--spacing-md); }
        .results-cluster-desc {
          font-size: 15px; color: var(--color-text-secondary); max-width: 560px;
          margin: 0 auto; line-height: 1.7;
        }
        .results-scores {
          display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);
          margin-bottom: var(--spacing-2xl);
        }
        .score-box {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: var(--spacing-lg); text-align: center;
        }
        .score-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px; }
        .score-value { font-size: 36px; font-weight: 700; font-family: var(--font-heading); display: block; }
        .score-range { font-size: 11px; color: var(--color-text-secondary); display: block; margin-top: 4px; }
        .results-section { margin-bottom: var(--spacing-2xl); }
        .cluster-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .cluster-item-header { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: 4px; }
        .cluster-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .cluster-item-name { flex: 1; font-size: 14px; }
        .cluster-item-prob { font-size: 13px; color: var(--color-text-secondary); }
        .cluster-bar-bg { height: 6px; background: var(--color-bg); border-radius: 3px; overflow: hidden; }
        .cluster-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .radar-legend {
          display: grid; grid-template-columns: 1fr; gap: var(--spacing-md);
          margin-top: var(--spacing-xl); padding-top: var(--spacing-xl);
          border-top: 1px solid var(--color-border);
        }
        .radar-legend-item {}
        .radar-legend-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .radar-legend-name { font-size: 14px; font-weight: 600; }
        .radar-legend-score { font-size: 12px; color: var(--color-accent); }
        .radar-legend-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
        .top-issues-list { padding-left: var(--spacing-lg); font-size: 14px; line-height: 2; color: var(--color-text-secondary); }
        .compare-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--spacing-lg); }
        .compare-stat { text-align: center; }
        .compare-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-secondary); display: block; margin-bottom: 4px; }
        .compare-stat-value { font-size: 28px; font-weight: 700; font-family: var(--font-heading); display: block; }
        .compare-stat-you { font-size: 12px; color: var(--color-accent); display: block; margin-top: 4px; }
        @media (max-width: 480px) {
          .results-scores { grid-template-columns: 1fr; }
          .results-cluster { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}
