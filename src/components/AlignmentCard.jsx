import React from 'react';

export default function AlignmentCard({ figure, rank = 1 }) {
  if (!figure) return null;

  return (
    <div className="alignment-card card">
      <div className="alignment-content">
        <div className="alignment-portrait">
          <img src={figure.image || `/assets/figure-images/${figure.id}.svg`} alt={figure.name} />
        </div>
        <div className="alignment-info">
          {rank === 1 && (
            <span className="mono alignment-label">You most align with</span>
          )}
          {rank > 1 && (
            <span className="mono alignment-label">#{rank} closest match</span>
          )}
          <h3 className="alignment-name">{figure.name}</h3>
          <p className="alignment-desc">{figure.description}</p>
          <span className="mono alignment-distance">
            Distance: {figure.distance?.toFixed(1) || '—'}
          </span>
        </div>
      </div>

      <style>{`
        .alignment-card { overflow: hidden; }
        .alignment-content { display: flex; gap: var(--spacing-lg); align-items: flex-start; }
        .alignment-portrait {
          flex-shrink: 0; width: 80px; height: 80px;
          border-radius: var(--radius-md); overflow: hidden;
          background: var(--color-bg);
        }
        .alignment-portrait img { width: 100%; height: 100%; object-fit: cover; }
        .alignment-label {
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--color-accent); display: block; margin-bottom: 4px;
        }
        .alignment-name { font-size: 20px; margin-bottom: var(--spacing-sm); }
        .alignment-desc {
          font-size: 14px; color: var(--color-text-secondary); line-height: 1.6;
          margin-bottom: var(--spacing-sm);
        }
        .alignment-distance { font-size: 11px; color: var(--color-text-secondary); }
        @media (max-width: 480px) {
          .alignment-content { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
