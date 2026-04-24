import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const figures = [
  {
    name: 'Pierre-Joseph Proudhon',
    dates: '1809–1865',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Pierre-Joseph_Proudhon.jpg/330px-Pierre-Joseph_Proudhon.jpg',
    imageAlt: 'Pierre-Joseph Proudhon, portrait by Courbet',
    imageSource: 'https://en.wikipedia.org/wiki/Pierre-Joseph_Proudhon',
    description: [
      `Pierre-Joseph Proudhon, the French political philosopher and journalist, was the first person to call himself an anarchist and remains one of the foundational theorists of libertarian socialist thought. His 1840 pamphlet What Is Property? delivered the famous answer: "Property is theft" — by which he meant not all possession but the appropriation of surplus value by owners who do not labour, the extraction of rent and interest that he called "exploitation." His positive alternative was mutualism: a system of federated, self-managed workers' associations exchanging goods at cost price, supported by mutual credit banks providing interest-free loans. This vision was anti-statist (he opposed both capitalism and state socialism) and anti-authoritarian: Proudhon famously quarrelled with Marx over the role of revolutionary dictatorship, arguing that any transitional state would simply reproduce domination.`,
      `Proudhon's legacy within the libertarian left is complicated by views that place him sharply outside modern progressive consensus. He held strongly patriarchal views about women, arguing they were unsuited to public and political life — positions that drew sharp contemporary criticism from George Sand and others. His writings on Jews were at times virulently antisemitic, a fact that scholars including Robert Graham and K. Steven Vincent have addressed with varying degrees of contextual mitigation. Proudhon's broader influence on anarchist, syndicalist, and mutualist traditions has been immense: his federalist vision directly shaped the organizational forms of the International Workingmen's Association and, through Bakunin and later thinkers, the entire anarchist tradition. His critique of both state and capital remains a foundational reference point for libertarian socialist theory.`,
    ],
    references: [
      'Vincent, K. Steven. Pierre-Joseph Proudhon and the Rise of French Republican Socialism. Oxford University Press, 1984.',
      'Graham, Robert, ed. Anarchism: A Documentary History of Libertarian Ideas, Vol. 1. Black Rose Books, 2005.',
      'Woodcock, George. Pierre-Joseph Proudhon: His Life and Work. Black Rose Books, 1987.',
      'Proudhon, Pierre-Joseph. What Is Property? Trans. Donald R. Kelley and Bonnie G. Smith. Cambridge University Press, 1994.',
      'Ehrenberg, John. Proudhon and His Age. Humanity Books, 1996.',
    ],
  },
  {
    name: 'Peter Kropotkin',
    dates: '1842–1921',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Peter_Kropotkin_circa_1900.jpg/330px-Peter_Kropotkin_circa_1900.jpg',
    imageAlt: 'Peter Kropotkin, circa 1900',
    imageSource: 'https://en.wikipedia.org/wiki/Peter_Kropotkin',
    description: [
      `Peter Kropotkin was a Russian geographer, evolutionary biologist, and the most systematic theorist of anarcho-communism. Born into the Russian nobility and trained as a scientist, Kropotkin brought a naturalist's methodology to political philosophy. His most influential theoretical work, Mutual Aid: A Factor of Evolution (1902), argued against social Darwinist readings of nature — the view that competition was the primary engine of evolutionary success — by marshalling evidence that cooperation, solidarity, and mutual support were equally significant survival strategies across species and human societies. This empirical grounding gave his anarchism a distinctive scientific texture: he presented communal self-organization not as a utopian ideal but as a tendency already operating in human communities.`,
      `Kropotkin's anarcho-communist vision called for the abolition of both private property and the state, to be replaced by voluntary federations of communes managing production and distribution collectively. The Conquest of Bread (1892), his most accessible work, sketched the practical organization of a post-revolutionary society, addressing agriculture, housing, and industrial production with unusual concreteness. He supported the Allied powers in World War I — a position that alienated much of the anarchist movement and drew a famous rebuke from Emma Goldman. His return to Russia after the 1917 revolution, and his disillusionment with Bolshevik terror, produced a final statement of principled opposition to revolutionary dictatorship. Scholars including Martin Miller, Caroline Cahm, and Ruth Kinna have produced careful intellectual biographies and reassessments of his contributions to political thought.`,
    ],
    references: [
      'Miller, Martin A. Kropotkin. University of Chicago Press, 1976.',
      'Cahm, Caroline. Kropotkin and the Rise of Revolutionary Anarchism 1872–1886. Cambridge University Press, 1989.',
      'Kinna, Ruth. Kropotkin: Reviewing the Classical Anarchist Tradition. Edinburgh University Press, 2016.',
      'Kropotkin, Peter. Mutual Aid: A Factor of Evolution. 1902. Dover Publications, 2006.',
      'Kropotkin, Peter. The Conquest of Bread. 1892. AK Press, 2012.',
    ],
  },
  {
    name: 'Emma Goldman',
    dates: '1869–1940',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Emma_Goldman_seated.jpg/330px-Emma_Goldman_seated.jpg',
    imageAlt: 'Emma Goldman',
    imageSource: 'https://en.wikipedia.org/wiki/Emma_Goldman',
    description: [
      `Emma Goldman was a Lithuanian-born anarchist organizer, orator, and writer who became one of the most prominent radical voices in early twentieth-century America. Her anarchism integrated Kropotkinian communism with a fierce individualism and an unprecedented attention to gender, sexuality, and personal liberation. She was among the first public figures in the United States to advocate for birth control, free love, and the liberation of women from domestic servitude as inseparable from the anarchist project — positions that brought her into repeated conflict with both the state and more conventional elements of the left. Her lecture tours drew thousands, and her journal Mother Earth (1906–1917) was a significant platform for anarchist, feminist, and literary thought.`,
      `Goldman was deported from the United States in 1919, along with Alexander Berkman, during the post-WWI Red Scare under J. Edgar Hoover's direction. Her experience of the Soviet Union, documented in My Disillusionment in Russia (1923), produced an early and rigorous critique of Bolshevik authoritarianism — she was appalled by the suppression of the Kronstadt sailors' uprising and the party's systematic destruction of independent working-class organization. This willingness to criticize the Soviet Union from the left distinguished her from many contemporaries and gave her analysis lasting relevance. In Spain during the Civil War she supported the anarchist CNT-FAI. Her autobiography Living My Life (1931) remains a landmark of radical writing, and scholars including Candace Falk, Alice Wexler, and Kathy Ferguson have produced major biographical and theoretical reassessments of her work.`,
    ],
    references: [
      'Wexler, Alice. Emma Goldman: An Intimate Life. Pantheon Books, 1984.',
      'Falk, Candace. Love, Anarchy, and Emma Goldman. Rutgers University Press, 1990.',
      'Ferguson, Kathy E. Emma Goldman: Political Thinking in the Streets. Rowman & Littlefield, 2011.',
      'Goldman, Emma. Living My Life. 2 vols. 1931. Dover Publications, 1970.',
      'Goldman, Emma. My Disillusionment in Russia. Doubleday, Page & Company, 1923.',
    ],
  },
  {
    name: 'Buenaventura Durruti',
    dates: '1896–1936',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Buenaventura_Durruti.jpg/330px-Buenaventura_Durruti.jpg',
    imageAlt: 'Buenaventura Durruti',
    imageSource: 'https://en.wikipedia.org/wiki/Buenaventura_Durruti',
    description: [
      `Buenaventura Durruti was a Spanish anarcho-syndicalist militant and military commander who became the most charismatic figure of the Spanish anarchist movement during the 1930s. A metalworker by trade and an organizer for the Confederación Nacional del Trabajo (CNT) — the anarcho-syndicalist trade union that at its peak represented over a million Spanish workers — Durruti spent much of the 1920s in exile or underground, hunted by successive Spanish and Latin American governments for his role in bank robberies, assassinations of political figures, and revolutionary agitation. His life embodied the insurrectionary tradition within Spanish anarchism: the belief that capitalism and the state had to be attacked directly rather than through parliamentary or electoral methods.`,
      `When Franco's coup triggered the Civil War in July 1936, Durruti organized and led the Durruti Column — a militia of anarchist volunteers that marched from Barcelona to the Aragon front within days of the uprising. In the territories it controlled, the column oversaw the collectivization of agricultural land and industry, the most extensive experiment in anarchist economic self-management in history. Hundreds of communities reorganized production without bosses, landlords, or currency — documented by scholars including Gaston Leval, Martha Ackelsberg, and Antony Beevor. Durruti was killed in November 1936 during the defence of Madrid under circumstances that remain disputed (friendly fire, nationalist sniper, or accident). His death at the height of the Spanish Revolution made him the iconic martyr of anarcho-syndicalism.`,
    ],
    references: [
      'Paz, Abel. Durruti in the Spanish Revolution. AK Press, 2007.',
      'Ackelsberg, Martha A. Free Women of Spain: Anarchism and the Struggle for the Emancipation of Women. AK Press, 2005.',
      'Beevor, Antony. The Battle for Spain: The Spanish Civil War 1936–1939. Weidenfeld & Nicolson, 2006.',
      'Leval, Gaston. Collectives in the Spanish Revolution. Freedom Press, 1975.',
      'Thomas, Hugh. The Spanish Civil War. Harper & Row, 1961.',
    ],
  },
  {
    name: 'Murray Bookchin',
    dates: '1921–2006',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Murray_Bookchin.JPG/330px-Murray_Bookchin.JPG',
    imageAlt: 'Murray Bookchin',
    imageSource: 'https://en.wikipedia.org/wiki/Murray_Bookchin',
    description: [
      `Murray Bookchin was an American anarchist theorist and ecologist who developed libertarian municipalism — also called communalism — as a systematic alternative to both capitalism and state socialism. Beginning in the 1960s as a pioneer of social ecology (the analysis of environmental degradation as rooted in social hierarchies rather than human nature per se), Bookchin argued that ecological sustainability was inseparable from social liberation. His major theoretical works, including The Ecology of Freedom (1982) and The Rise of Urbanization and the Decline of Citizenship (1987), drew on classical Athenian democracy, Enlightenment reason, and the libertarian socialist tradition to develop a vision of direct democratic confederation.`,
      `Bookchin's libertarian municipalism proposed that power should be organized in face-to-face neighborhood and town assemblies (communes), confederated at regional and national levels, with economic life organized through collectively managed enterprises accountable to these assemblies. He was sharply critical of what he called "lifestyle anarchism" — individualist and primitivist strands of anarchism that he regarded as politically ineffective — a critique he made in Social Anarchism or Lifestyle Anarchism (1995) that generated significant controversy within anarchist circles. His ideas have had an unusual posthumous influence: the Kurdish political movement in Rojava (northern Syria), under the leadership of Abdullah Öcalan, explicitly adopted Bookchin's democratic confederalism as the organizational model for its liberated territories. Scholars including Janet Biehl, Damian White, and Andy Price have produced important assessments of his theoretical legacy.`,
    ],
    references: [
      'Bookchin, Murray. The Ecology of Freedom: The Emergence and Dissolution of Hierarchy. Cheshire Books, 1982.',
      'Biehl, Janet. The Politics of Social Ecology: Libertarian Municipalism. Black Rose Books, 1998.',
      'White, Damian F. Bookchin: A Critical Appraisal. Pluto Press, 2008.',
      'Price, Andy. Recovering Bookchin: Social Ecology and the Crises of Our Time. New Compass Press, 2012.',
      'Biehl, Janet. Ecology or Catastrophe: The Life of Murray Bookchin. Oxford University Press, 2015.',
    ],
  },
];

export default function LibertarianLeftPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 800 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Historical Figures
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
        Libertarian Left
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-xl)', maxWidth: 640 }}>
        Figures in the libertarian left quadrant combined collectivist economics — opposition to
        private ownership of productive resources and advocacy for worker self-management — with
        radical anti-authoritarianism: hostility to the state, hierarchy, and centralized power
        in all forms, including within revolutionary movements themselves.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
        <Link to="/figures" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>← All Quadrants</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-left" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Left</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-right" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Right</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/libertarian-right" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Lib Right</Link>
      </div>

      {figures.map((fig, i) => (
        <div key={fig.name} className="card" style={{ marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ flexShrink: 0 }}>
              <img
                src={fig.image}
                alt={fig.imageAlt}
                onError={e => { e.target.style.display = 'none'; }}
                style={{
                  width: 110,
                  height: 130,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  display: 'block',
                }}
              />
              <a
                href={fig.imageSource}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, color: 'var(--color-text-secondary)', display: 'block', marginTop: 4 }}
                className="mono"
              >
                via Wikipedia
              </a>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--color-accent)', letterSpacing: 1, textTransform: 'uppercase' }}>
                Libertarian Left
              </span>
              <h2 style={{ fontSize: 26, margin: '4px 0 2px' }}>{fig.name}</h2>
              <span className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{fig.dates}</span>
            </div>
          </div>

          {fig.description.map((para, j) => (
            <p key={j} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, marginBottom: j < fig.description.length - 1 ? 'var(--spacing-md)' : 0 }}>
              {para}
            </p>
          ))}

          <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Key References
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {fig.references.map((ref, k) => (
                <li key={k} style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: 'var(--spacing-md)', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--color-accent)' }}>—</span>
                  {ref}
                </li>
              ))}
            </ul>
          </div>

          {i === 1 && <AdSlot placement="figures_inline" />}
        </div>
      ))}

      <AdSlot placement="figures_footer" />

      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-md)' }}>About This Quadrant</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The libertarian left quadrant combines economic collectivism — opposition to capitalist
          property relations and advocacy for worker control of production — with social and
          political anti-authoritarianism: opposition to the state, to hierarchy, and to
          concentrated power in any institutional form. The five figures above span mutualism,
          anarcho-communism, syndicalism, and social ecology.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Historical figure placements are approximations. See the{' '}
          <Link to="/methodology" style={{ color: 'var(--color-accent)' }}>Methodology page</Link> for
          how the two-axis model is constructed.
        </p>
      </div>
    </div>
  );
}
