import React, { useEffect, useState } from 'react';
import { trackEvent, Events } from '../utils/analytics';
import { verifyEntitlement, startCheckout } from '../utils/premiumApi';

const FEATURES = {
  deep_analysis: { label: 'Deep Analysis', price: '$5' },
  report: { label: 'Political Personality Report', price: '$12' },
  country_comparison: { label: 'Country Comparison', price: '$5' },
  friend_comparison: { label: 'Friend Comparison', price: '$3' },
  premium_membership: { label: 'Premium Membership', price: '$25/year' },
};

export default function PremiumGate({ feature = 'deep_analysis', children }) {
  const [status, setStatus] = useState('loading'); // loading|locked|unlocked|error
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      try {
        const result = await verifyEntitlement(feature);
        if (!mounted) return;
        setStatus(result.entitled ? 'unlocked' : 'locked');
      } catch (error) {
        if (!mounted) return;
        setStatus('error');
        setMessage(error.message);
      }
    }

    checkAccess();
    return () => {
      mounted = false;
    };
  }, [feature]);

  const info = FEATURES[feature] || FEATURES.deep_analysis;

  const handleUpgrade = async () => {
    try {
      trackEvent(Events.PREMIUM_CLICKED, { feature });
      await startCheckout(feature);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  if (status === 'loading') {
    return <div className="card" style={{ textAlign: 'center' }}>Checking entitlement…</div>;
  }

  if (status === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate card" style={{ textAlign: 'center' }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Premium Feature
      </span>
      <h3 style={{ margin: 'var(--spacing-md) 0 var(--spacing-sm)' }}>{info.label}</h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-lg)' }}>
        Unlock this feature for <strong>{info.price}</strong>. Access is validated server-side after payment.
      </p>
      {status === 'error' && (
        <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{message || 'Unable to verify access right now.'}</p>
      )}
      <button className="btn btn-accent" onClick={handleUpgrade}>
        Upgrade with Stripe
      </button>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        Secure checkout. Refunds and renewals are handled automatically.
      </p>
    </div>
  );
}
