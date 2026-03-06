import React from 'react';
import AdSlot from './AdSlot';

export default function MethodologyPage() {
  return (
    <div className="methodology-page container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Research Methodology
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>How It Works</h1>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Two-Axis Political Model</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The Political Ideology Profiler uses a two-dimensional model to classify political ideology.
          The <strong>economic axis</strong> ranges from left-leaning (-10) to right-leaning (+10).
          The <strong>social axis</strong> ranges from progressive (-10) to conservative (+10).
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          This approach builds on established political science frameworks including the Nolan Chart,
          the Political Compass model, and Pew Research Center's political typology studies.
          Two-axis models provide significantly more nuance than the traditional left-right spectrum
          by distinguishing economic positions from social and cultural values.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Question Design</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The quiz contains 24 questions divided across four policy domains: Economic Views,
          Social Values, Institutions, and Public Policy. Each question offers four responses
          calibrated to represent distinct ideological positions.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Every response carries an <strong>economic weight</strong> and a <strong>social weight</strong> between
          -3 and +3. Users also assign an importance level (Low, Medium, High) that modifies
          the weight of each response. This importance weighting allows the system to distinguish
          between casual preferences and deeply held convictions.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Scoring Algorithm</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          Scores are calculated using weighted normalization. For each axis, the sum of
          (answer weight &times; importance multiplier) is divided by the theoretical maximum,
          then scaled to the -10 to +10 range. This produces normalized scores that are
          comparable across different response patterns.
        </p>
        <div className="mono" style={{ background: 'var(--color-bg)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', fontSize: 13, lineHeight: 1.8 }}>
          score = clamp((weightedSum / maxPossible) &times; 10, -10, 10)<br />
          maxPossible = 3 &times; totalImportanceWeight
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Type Classification</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          You are matched to one of eight political personality types based on how close your
          scores are to each type's center point. Types are defined by economic and social ranges
          based on political science research. Each type assignment includes a percentage showing
          how closely your position matches that type.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The eight types span the full political spectrum: Democratic Socialist, Structural
          Social Democrat, Progressive Liberal, Technocratic Liberal, Market Liberal, Conservative
          Liberal, Traditional Conservative, and Nationalist Populist.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Radar Dimensions</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The seven-dimension radar analysis derives additional ideological dimensions from
          quiz responses: State Capacity, Labour Power, Anti-Monopoly, Globalism, Progressivism,
          Economic Left, and Movement Orientation. These dimensions provide a more granular
          view of ideological positioning beyond the two primary axes.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Limitations</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          All ideological typologies are simplifications. Two dimensions cannot capture the full
          complexity of political belief. This tool is designed as an educational and analytical
          starting point, not a definitive classification.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Question framing, cultural context, and response bias can influence results. Historical
          figure placements are approximations based on their public policy positions and are
          subject to scholarly debate.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>References</h2>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2.2, fontSize: 14, paddingLeft: 'var(--spacing-lg)' }}>
          <li>Downs, Anthony. <em>An Economic Theory of Democracy</em>. Harper & Row, 1957.</li>
          <li>Inglehart, Ronald. <em>Cultural Evolution: People's Motivations Are Changing, and Reshaping the World</em>. Cambridge University Press, 2018.</li>
          <li>Nolan, David. "Classifying and Analyzing Politico-Economic Systems." <em>The Individualist</em>, 1971.</li>
          <li>The Political Compass. politicalcompass.org</li>
          <li>Pew Research Center. "Political Typology Quiz." pewresearch.org</li>
          <li>Kitschelt, Herbert. <em>The Transformation of European Social Democracy</em>. Cambridge University Press, 1994.</li>
          <li>Mudde, Cas. <em>Populist Radical Right Parties in Europe</em>. Cambridge University Press, 2007.</li>
        </ul>
      </div>

      <AdSlot placement="methodology_sidebar" />
    </div>
  );
}
