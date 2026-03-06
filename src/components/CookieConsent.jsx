import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
      padding: 'var(--spacing-md) 0',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--spacing-md)', flexWrap: 'wrap',
      }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, flex: 1, minWidth: 240 }}>
          This site uses cookies for advertising through Google AdSense. Third-party cookies
          may be used to show you personalized ads.{' '}
          <a href="/privacy" style={{ color: 'var(--color-accent)' }}>Learn more</a>
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexShrink: 0 }}>
          <button className="btn btn-sm btn-secondary" onClick={decline}>
            Decline
          </button>
          <button className="btn btn-sm btn-primary" onClick={accept}>
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}

export function hasConsent() {
  return localStorage.getItem(CONSENT_KEY) === 'accepted';
}
