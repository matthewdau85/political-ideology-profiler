import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAllResults } from '../utils/resultsStore';
import { deleteAccount, getSession } from '../utils/authStore';

export default function PrivacyPage() {
  const [deleted, setDeleted] = useState(false);
  const session = getSession();

  const handleDeleteAll = async () => {
    deleteAllResults();
    if (session) {
      await deleteAccount();
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
          The Ideology Compass collects only the minimum data necessary to function.
          Your full quiz results are stored locally in your browser. If you accept cookies,
          we also send a small amount of <strong>anonymized</strong> data to our server to
          build aggregate statistics (see "Data We Send to Our Server" below).
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
          Your quiz data is never linked to your email.
          You can delete your account and all associated data at any time from the Profile page.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Data We Send to Our Server</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          If you accept cookies, we send the following <strong>anonymized</strong> data to our server
          when you complete the quiz. This is used solely to build aggregate statistics
          (e.g., average scores by country):
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Your economic score (a number from -10 to +10)</li>
          <li>Your social score (a number from -10 to +10)</li>
          <li>Your political personality type (e.g., "Progressive Liberal")</li>
          <li>Your country (if provided)</li>
        </ul>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: 'var(--spacing-md)' }}>
          We do <strong>not</strong> send your individual quiz answers, your name, your email,
          your IP address, or any other identifying information. If you decline cookies,
          no data is sent to our server at all.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Data Storage</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          <strong>On your device:</strong> Your full quiz results (including individual answers,
          charts, and comparisons) are stored in your browser's localStorage. This data never
          leaves your device unless you accept cookies.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <strong>On our server:</strong> Only the anonymized data listed above is stored.
          Server data is kept in an encrypted database and is used exclusively for aggregate
          statistics. It cannot be traced back to any individual.
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
          For questions about your data, <Link to="/contact" style={{ color: 'var(--color-accent)' }}>contact us</Link>.
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
