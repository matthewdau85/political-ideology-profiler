import React, { useState } from 'react';
import { trackEvent, Events } from '../utils/analytics';

const FEATURES = {
  deep_analysis: { label: 'Deep Analysis' },
  report: { label: 'Political Personality Report' },
  country_comparison: { label: 'Country Comparison' },
  friend_comparison: { label: 'Friend Comparison' },
  premium_membership: { label: 'Premium Membership' },
};

export default function PremiumGate({ feature = 'deep_analysis', children, onUnlock }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const purchased = JSON.parse(localStorage.getItem('premium_purchases') || '{}');
      return purchased[feature] || purchased.premium_membership || false;
    } catch {
      return false;
    }
  });

  const info = FEATURES[feature] || FEATURES.deep_analysis;

  const handlePreview = () => {
    trackEvent(Events.PREMIUM_CLICKED, { feature });

    // Free preview mode — unlock content for this session
    const purchased = JSON.parse(localStorage.getItem('premium_purchases') || '{}');
    purchased[feature] = true;
    localStorage.setItem('premium_purchases', JSON.stringify(purchased));
    setUnlocked(true);
    onUnlock?.();
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate card" style={{ textAlign: 'center' }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Premium Feature
      </span>
      <h3 style={{ margin: 'var(--spacing-md) 0 var(--spacing-sm)' }}>{info.label}</h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-lg)' }}>
        This is a premium feature. Paid plans are coming soon — for now, enjoy a free preview.
      </p>
      <button className="btn btn-accent" onClick={handlePreview}>
        Unlock Free Preview
      </button>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        No payment required during the preview period.
      </p>
    </div>
  );
}
