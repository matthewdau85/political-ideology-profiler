import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const quadrants = [
  {
    slug: 'authoritarian-left',
    label: 'Authoritarian Left',
    color: '#2563eb',
    description:
      'Collective ownership and redistribution combined with centralized political control. Five figures spanning European Bolshevism, East Asian Maoism, and Caribbean revolutionary nationalism.',
    figures: ['Vladimir Lenin', 'Joseph Stalin', 'Mao Zedong', 'Josip Broz Tito', 'Fidel Castro'],
    axes: ['Economic: Left', 'Social: Authoritarian'],
  },
  {
    slug: 'authoritarian-right',
    label: 'Authoritarian Right',
    color: '#dc2626',
    description:
      'Defence of hierarchy, tradition, and national authority combined with capitalist or corporatist economics. Ranges from Burke\'s philosophical conservatism to Mussolini\'s explicit fascism.',
    figures: ['Edmund Burke', 'Joseph de Maistre', 'Winston Churchill', 'Francisco Franco', 'Benito Mussolini'],
    axes: ['Economic: Right', 'Social: Authoritarian'],
  },
  {
    slug: 'libertarian-left',
    label: 'Libertarian Left',
    color: '#7c3aed',
    description:
      'Worker self-management and collective economics combined with radical anti-authoritarianism and opposition to both state and capital. Spans mutualism, anarcho-communism, syndicalism, and social ecology.',
    figures: ['Pierre-Joseph Proudhon', 'Peter Kropotkin', 'Emma Goldman', 'Buenaventura Durruti', 'Murray Bookchin'],
    axes: ['Economic: Left', 'Social: Libertarian'],
  },
  {
    slug: 'libertarian-right',
    label: 'Libertarian Right',
    color: '#d97706',
    description:
      'Free markets, private property, and limited government. The classical liberal tradition from Locke and Smith through twentieth-century Austrian and Chicago economics.',
    figures: ['John Locke', 'Adam Smith', 'Friedrich Hayek', 'Milton Friedman', 'Robert Nozick'],
    axes: ['Economic: Right', 'Social: Libertarian'],
  },
];

export default function FiguresIndexPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 800 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Reference
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
        Historical Figures
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-2xl)', maxWidth: 640 }}>
        Twenty historical thinkers and leaders — five per quadrant — whose documented political
        positions map onto the two-axis model used by the Ideology Compass. Each profile includes
        biographical context, an honest assessment of both achievements and documented harms,
        and references to major scholarly works from academic publishers.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
        {quadrants.map(q => (
          <Link
            key={q.slug}
            to={`/figures/${q.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                padding: 'var(--spacing-xl)',
                height: '100%',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = q.color;
                e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <span style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: q.color,
                  flexShrink: 0,
                }} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: q.color }}>
                  {q.label}
                </span>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 'var(--spacing-lg)' }}>
                {q.description}
              </p>

              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                {q.axes.map(a => (
                  <span key={a} className="mono" style={{
                    display: 'inline-block',
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    marginRight: 6,
                    marginBottom: 4,
                  }}>
                    {a}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                  Figures
                </span>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {q.figures.join(' · ')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AdSlot placement="figures_footer" />

      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-md)' }}>How Figures Are Placed</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          Each historical figure is positioned on the Ideology Compass's two-axis grid based on
          their documented public positions on economic and social questions — their writings,
          speeches, legislation, and governance — rather than their self-identification or
          partisan affiliation. Placements are approximations and are contested in the scholarly
          literature; the profiles here note significant interpretive debates where they exist.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          For full details on the two-axis model and scoring methodology, see the{' '}
          <Link to="/methodology" style={{ color: 'var(--color-accent)' }}>Methodology page</Link>.
          To see where you fall on the same grid, take the{' '}
          <Link to="/quiz" style={{ color: 'var(--color-accent)' }}>quiz</Link>.
        </p>
      </div>
    </div>
  );
}
