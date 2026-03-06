import React, { useState } from 'react';
import { deleteAllResults } from '../utils/resultsStore';
import { deleteAccount, getSession } from '../utils/authStore';

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
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Privacy &amp; Data Policy</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.8 }}>
        Last updated: March 2026. This policy explains what data we collect, how we use it, and your rights.
      </p>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>What We Collect</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The Political Ideology Profiler collects only the minimum data necessary to function.
          All quiz results are <strong>anonymized</strong> and stored locally in your browser.
        </p>
        <h3 style={{ fontSize: 16, marginBottom: 'var(--spacing-sm)' }}>Data we store locally:</h3>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Economic and social scores (anonymized)</li>
          <li>Political personality type classification</li>
          <li>Quiz response timestamps</li>
          <li>Country (only if you choose to provide it)</li>
          <li>Dimension scores for the radar analysis</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>What We Do NOT Collect</h2>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li><strong>Real names</strong> — never collected</li>
          <li><strong>Email addresses</strong> — only if you voluntarily create an account</li>
          <li><strong>IP addresses</strong> — not logged or stored by our application</li>
          <li><strong>Browser fingerprints</strong> — not collected</li>
          <li><strong>Individual quiz answers</strong> — only aggregate scores are stored</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Advertising &amp; Cookies</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          This site uses <strong>Google AdSense</strong> to display advertisements. Google and its
          advertising partners may use cookies and similar technologies to serve ads based on your
          prior visits to this site or other websites. These cookies allow Google and its partners
          to show you relevant ads across the internet.
        </p>
        <h3 style={{ fontSize: 16, marginBottom: 'var(--spacing-sm)' }}>Third-party cookies used:</h3>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li><strong>Google AdSense</strong> — serves display advertisements and may set cookies to personalize ads</li>
          <li><strong>Google DoubleClick (DART)</strong> — may use cookies to serve ads based on your browsing history</li>
        </ul>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: 'var(--spacing-md)' }}>
          You can opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Google's Ad Settings
          </a>{' '}
          or the{' '}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Digital Advertising Alliance opt-out page
          </a>.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>User Accounts</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Account creation is <strong>optional</strong>. If you create an account, your email is used
          solely for authentication and is stored separately from your quiz results.
          Your quiz data is never linked to your email in the public dataset.
          You can delete your account and all associated data at any time from the Profile page.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Dataset &amp; Research Use</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Anonymized, aggregate data may be accessed through the public API for research and
          journalistic purposes. Individual results cannot be traced to any person. The dataset
          includes only aggregate statistics: average scores, type distributions, and
          country-level summaries.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Data Storage</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          All quiz data is currently stored in your browser's localStorage. This means your data
          stays on your device unless you choose to share it. In future versions with backend
          integration, data will be stored in encrypted databases with the same anonymization
          guarantees.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Your Rights (GDPR / CCPA)</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          Regardless of where you live, you have the right to:
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li><strong>Access</strong> — view all data we store about you (visible on your Profile page)</li>
          <li><strong>Delete</strong> — permanently remove all your data using the button below</li>
          <li><strong>Opt out of personalized ads</strong> — via the cookie consent banner or Google's ad settings</li>
          <li><strong>Withdraw consent</strong> — you can clear cookies at any time through your browser settings</li>
        </ul>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: 'var(--spacing-md)' }}>
          For questions about your data, contact us at the email listed on our{' '}
          <a href="/about" style={{ color: 'var(--color-accent)' }}>About page</a>.
        </p>
      </div>

      {session && (
        <div className="card" style={{ borderColor: 'var(--color-danger)', borderStyle: 'dashed' }}>
          <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)', color: 'var(--color-danger)' }}>
            Delete Your Data
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-lg)' }}>
            You have the right to delete all your stored data at any time.
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
      )}
    </div>
  );
}
