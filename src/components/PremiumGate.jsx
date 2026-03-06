import React, { useState } from 'react';
import { trackEvent, Events } from '../utils/analytics';

const PRICES = {
  deep_analysis: { label: 'Deep Analysis', price: 5 },
  report: { label: 'Political Personality Report', price: 12 },
  country_comparison: { label: 'Country Comparison', price: 5 },
  friend_comparison: { label: 'Friend Comparison', price: 3 },
  premium_membership: { label: 'Premium Membership (yearly)', price: 25 },
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

  const info = PRICES[feature] || PRICES.deep_analysis;

  const handlePurchase = () => {
    trackEvent(Events.PREMIUM_PURCHASED, { feature, price: info.price });

    // Mock purchase — replace with Stripe integration
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
        Unlock this feature for a one-time payment.
      </p>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 'var(--spacing-lg)' }}>
        ${info.price}
      </div>
      <button className="btn btn-accent" onClick={handlePurchase}>
        Unlock Now
      </button>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        Development mode — mock purchase. Stripe integration ready.
      </p>
    </div>
  );
}
