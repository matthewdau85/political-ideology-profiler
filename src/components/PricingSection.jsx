import React from 'react';
import { Link } from 'react-router-dom';
import { trackEvent, Events } from '../utils/analytics';

const plans = [
  { id: 'deep_analysis', name: 'Deep Analysis', price: 5, link: '/deep-analysis', features: ['7-dimension radar analysis', 'Detailed type breakdown', 'Ideological summary narrative'] },
  { id: 'report', name: 'Personality Report', price: 12, link: '/deep-analysis', features: ['Downloadable PDF report', 'Full ideological profile', 'Historical figure comparisons'] },
  { id: 'country_comparison', name: 'Country Comparison', price: 5, link: '/country-comparison', features: ['5 country party comparisons', 'Closest party alignment', 'Distance scoring'] },
  { id: 'friend_comparison', name: 'Friend Comparison', price: 3, link: '/debate/new', features: ['Generate debate link', 'Side-by-side comparison', 'Overlap percentage'] },
  { id: 'premium_membership', name: 'Premium Membership', price: 25, yearly: true, featured: true, link: '/deep-analysis', features: ['All premium features', 'Ideology evolution tracking', 'Unlimited debate links', 'Server-side result backup'] },
];

export default function PricingSection() {
  return (
    <div className="pricing-page container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
        <h1 className="section-title">Premium Features</h1>
        <p className="section-subtitle">Unlock deeper ideological analysis and comparison tools.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--spacing-lg)',
      }}>
        {plans.map(plan => (
          <div key={plan.id} className="card" style={{
            textAlign: 'center',
            border: plan.featured ? '2px solid var(--color-accent)' : undefined,
            position: 'relative',
          }}>
            {plan.featured && (
              <span className="mono" style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--color-accent)', color: '#fff', padding: '2px 12px',
                borderRadius: 100, fontSize: 11,
              }}>
                Best Value
              </span>
            )}
            <h3 style={{ fontSize: 18, marginBottom: 'var(--spacing-sm)' }}>{plan.name}</h3>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-heading)', margin: 'var(--spacing-md) 0' }}>
              ${plan.price}
              {plan.yearly && <span style={{ fontSize: 14, fontWeight: 400 }}>/year</span>}
            </div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', lineHeight: 2 }}>
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <Link
              to={plan.link}
              className={`btn btn-sm ${plan.featured ? 'btn-accent' : 'btn-secondary'}`}
              style={{ width: '100%' }}
              onClick={() => trackEvent(Events.PREMIUM_CLICKED, { plan: plan.id })}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
