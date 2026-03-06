import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDebateById } from '../utils/resultsStore';
import IdeologyScatter from '../charts/IdeologyScatter';
import RadarAnalysis from '../charts/RadarAnalysis';
import { percentOverlap } from '../utils/math';

export default function FriendCompare() {
  const { id } = useParams();
  const debate = useMemo(() => getDebateById(id), [id]);

  if (!debate || !debate.user1 || !debate.user2) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Comparison not ready</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          Both participants need to complete the quiz.
        </p>
        <Link to="/debate/new" className="btn btn-primary">Start a Debate</Link>
      </div>
    );
  }

  const { user1, user2 } = debate;
  const eDiff = Math.abs(user1.economic - user2.economic).toFixed(1);
  const sDiff = Math.abs(user1.social - user2.social).toFixed(1);
  const overlap = percentOverlap(
    { economic: user1.economic, social: user1.social },
    { economic: user2.economic, social: user2.social },
    ['economic', 'social']
  );

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Friend Comparison
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-xl)' }}>Ideology Comparison</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-accent)' }}>Participant 1</span>
          <h3 style={{ fontSize: 18, margin: 'var(--spacing-sm) 0' }}>{user1.cluster}</h3>
          <div className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            E: {user1.economic} | S: {user1.social}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-economic-left)' }}>Participant 2</span>
          <h3 style={{ fontSize: 18, margin: 'var(--spacing-sm) 0' }}>{user2.cluster}</h3>
          <div className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            E: {user2.economic} | S: {user2.social}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Position Comparison</h3>
        <IdeologyScatter
          economic={user1.economic}
          social={user1.social}
          closestFigures={[{ name: 'Participant 2', economic: user2.economic, social: user2.social, id: 'p2' }]}
        />
      </div>

      {user1.radarScores?.length > 0 && user2.radarScores?.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Radar Comparison</h3>
          <RadarAnalysis
            radarScores={user1.radarScores}
            secondaryScores={user2.radarScores}
            labels={['Participant 1', 'Participant 2']}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Economic Gap</span>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{eDiff}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Social Gap</span>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{sDiff}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Overlap</span>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{overlap}%</div>
        </div>
      </div>

      {debate.summary && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Debate Summary</h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontStyle: 'italic' }}>
            "{debate.summary}"
          </p>
        </div>
      )}
    </div>
  );
}
