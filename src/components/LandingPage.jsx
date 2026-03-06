import React from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../utils/resultsStore';

export default function LandingPage() {
  const stats = getStats();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container">
          <p className="landing-label mono">Political Science Research Tool</p>
          <h1 className="landing-title">Political Ideology Profiler</h1>
          <p className="landing-subtitle">
            Discover where you stand on the ideological spectrum. Compare your views with
            historical political figures, classify your ideology, and contribute to an
            open political science dataset.
          </p>
          <div className="landing-actions">
            <Link to="/quiz" className="btn btn-primary">Begin the Assessment</Link>
            <Link to="/methodology" className="btn btn-secondary">Read the Methodology</Link>
          </div>
          {stats.totalResponses > 0 && (
            <p className="landing-stat mono">
              {stats.totalResponses.toLocaleString()} responses collected
            </p>
          )}
        </div>
      </header>

      <section className="landing-features container">
        <div className="feature-grid">
          <div className="feature-card card">
            <h3>Two-Axis Analysis</h3>
            <p>Plot your position on economic (left–right) and social (progressive–conservative) axes using 24 calibrated questions.</p>
          </div>
          <div className="feature-card card">
            <h3>Historical Alignment</h3>
            <p>Compare your ideology with 17 historical figures from Karl Marx to Milton Friedman.</p>
          </div>
          <div className="feature-card card">
            <h3>Cluster Classification</h3>
            <p>Get classified into one of 8 ideological clusters with probability scores and detailed descriptions.</p>
          </div>
          <div className="feature-card card">
            <h3>Debate Mode</h3>
            <p>Generate a debate link, have a friend take the quiz, and compare your ideological positions side by side.</p>
          </div>
          <div className="feature-card card">
            <h3>Ideology Tracker</h3>
            <p>Create an account to retake the quiz over time and visualize how your ideology evolves.</p>
          </div>
          <div className="feature-card card">
            <h3>Open Dataset</h3>
            <p>All anonymized results contribute to a public dataset for journalists and researchers.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Where do you stand?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            24 questions. 8 minutes. A detailed ideological profile.
          </p>
          <Link to="/quiz" className="btn btn-accent">Start the Quiz</Link>
        </div>
      </section>

      <style>{`
        .landing-header {
          padding: var(--spacing-3xl) 0;
          text-align: center;
          border-bottom: 1px solid var(--color-border);
        }
        .landing-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: var(--spacing-md);
        }
        .landing-title {
          font-size: 48px;
          margin-bottom: var(--spacing-lg);
          letter-spacing: -0.5px;
        }
        .landing-subtitle {
          font-size: 18px;
          color: var(--color-text-secondary);
          max-width: 640px;
          margin: 0 auto var(--spacing-xl);
          line-height: 1.7;
        }
        .landing-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }
        .landing-stat {
          margin-top: var(--spacing-xl);
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .landing-features {
          padding: var(--spacing-3xl) 0;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }
        .feature-card h3 {
          font-size: 18px;
          margin-bottom: var(--spacing-sm);
        }
        .feature-card p {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        .landing-cta {
          padding: 0 0 var(--spacing-3xl);
        }
        @media (max-width: 768px) {
          .landing-title { font-size: 32px; }
          .landing-subtitle { font-size: 16px; }
        }
      `}</style>
    </div>
  );
}
