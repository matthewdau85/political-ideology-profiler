import React from 'react';
import { deleteAllResults } from '../utils/resultsStore';
import { deleteAccount, getSession } from '../utils/authStore';
import { useState } from 'react';

export default function PrivacyPage() {
  const [deleted, setDeleted] = useState(false);
  const session = getSession();

  const handleDeleteAll = () => {
    deleteAllResults();
    if (session) {
      deleteAccount();
    }
    setDeleted(true);
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Privacy & Data Policy</h1>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>What We Collect</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The Political Ideology Profiler collects only the minimum data necessary to function.
          All quiz results are <strong>anonymized</strong> and stored locally in your browser.
        </p>
        <h3 style={{ fontSize: 16, marginBottom: 'var(--spacing-sm)' }}>Data we store:</h3>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Economic axis score (anonymized)</li>
          <li>Social axis score (anonymized)</li>
          <li>Ideological cluster classification</li>
          <li>Quiz response timestamps</li>
          <li>Country (only if voluntarily provided)</li>
          <li>Radar dimension scores</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>What We Do NOT Collect</h2>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li><strong>Real names</strong> — never collected</li>
          <li><strong>Email addresses</strong> — only if you voluntarily create an account</li>
          <li><strong>IP addresses</strong> — not logged or stored</li>
          <li><strong>Browser fingerprints</strong> — not collected</li>
          <li><strong>Tracking cookies</strong> — none used</li>
          <li><strong>Individual quiz answers</strong> — only aggregate scores are stored in the dataset</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>User Accounts</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Account creation is <strong>optional</strong>. If you create an account, your email is used
          solely for authentication and is stored separately from your quiz results.
          Your ideology data is never linked to your email in the public dataset.
          You can delete your account and all associated data at any time from the Profile page.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Dataset & Research Use</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Anonymized, aggregate data may be accessed through the public API for research and
          journalistic purposes. Individual results cannot be traced to any person. The dataset
          includes only aggregate statistics: average scores, cluster distributions, and
          country-level summaries.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Data Storage</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          All data is currently stored in your browser's localStorage. This means your data
          stays on your device unless you choose to share it. In future versions with backend
          integration, data will be stored in encrypted databases with the same anonymization
          guarantees.
        </p>
      </div>

      <div className="card" style={{ borderColor: 'var(--color-danger)', borderStyle: 'dashed' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)', color: 'var(--color-danger)' }}>
          Delete Your Data
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-lg)' }}>
          You have the right to delete all your stored ideology data at any time.
          This action is permanent and cannot be undone.
        </p>
        {deleted ? (
          <p style={{ color: 'var(--color-success)', fontWeight: 500 }}>
            All your data has been deleted.
          </p>
        ) : (
          <button className="btn btn-danger" onClick={handleDeleteAll}>
            Delete All My Data
          </button>
        )}
      </div>
    </div>
  );
}
