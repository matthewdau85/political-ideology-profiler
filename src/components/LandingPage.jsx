import React from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../utils/resultsStore';

export default function LandingPage() {
  const stats = getStats();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container">
          <p className="landing-label mono">Political Quiz &amp; Analysis Tool</p>
          <h1 className="landing-title">Political Ideology Profiler</h1>
          <p className="landing-subtitle">
            Find out where you stand politically. Compare your views with
            historical figures, discover your ideological group, and see how
            you compare with people around the world.
          </p>
          <div className="landing-actions">
            <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
            <Link to="/methodology" className="btn btn-secondary">How It Works</Link>
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
            <h3>Economic &amp; Social Scores</h3>
            <p>Answer 24 questions to get scored on two dimensions: economic (left to right) and social (progressive to conservative).</p>
          </div>
          <div className="feature-card card">
            <h3>Historical Match</h3>
            <p>See which historical political figures — from Karl Marx to Milton Friedman — you're most aligned with.</p>
          </div>
          <div className="feature-card card">
            <h3>Personality Type</h3>
            <p>Get matched to one of 8 political personality types with a breakdown of how closely you fit each one.</p>
          </div>
          <div className="feature-card card">
            <h3>Challenge a Friend</h3>
            <p>Send a link to a friend, have them take the quiz, and compare your political positions side by side.</p>
          </div>
          <div className="feature-card card">
            <h3>Track Over Time</h3>
            <p>Create a free account and retake the quiz to see how your views change over months and years.</p>
          </div>
          <div className="feature-card card">
            <h3>Anonymous &amp; Open</h3>
            <p>All results are anonymous. Aggregated data is available for journalists and researchers to explore.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Where do you stand?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            24 questions. About 8 minutes. A full political profile with charts and comparisons.
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
