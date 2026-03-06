import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPermalink } from '../utils/resultsStore';
import figures from '../data/figures';
import IdeologyScatter from '../charts/IdeologyScatter';
import RadarAnalysis from '../charts/RadarAnalysis';
import AlignmentCard from './AlignmentCard';
import ShareCardGenerator from './ShareCardGenerator';

export default function ResultPermalink() {
  const { id } = useParams();
  const result = useMemo(() => getPermalink(id), [id]);

  if (!result) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Result not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          This result link may be invalid or the data has been deleted.
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
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          Shared Result
        </span>
        <h1 style={{ fontSize: 36, color: result.clusterColor, marginBottom: 'var(--spacing-sm)' }}>
          {result.cluster}
        </h1>
        <div className="mono" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Economic: {result.economic > 0 ? '+' : ''}{result.economic} | Social: {result.social > 0 ? '+' : ''}{result.social}
        </div>
      </div>

      {closestFiguresFull.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <AlignmentCard figure={closestFiguresFull[0]} rank={1} />
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ideological Position</h3>
        <IdeologyScatter
          economic={result.economic}
          social={result.social}
          closestFigures={closestFiguresFull}
          showAllFigures
        />
      </div>

      {result.radarScores?.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ideological Radar</h3>
          <RadarAnalysis radarScores={result.radarScores} />
        </div>
      )}

      <ShareCardGenerator result={result} />

      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
        <Link to="/quiz" className="btn btn-accent">Take the Quiz Yourself</Link>
      </div>
    </div>
  );
}
