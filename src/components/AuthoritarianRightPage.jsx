import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const figures = [
  {
    name: 'Edmund Burke',
    dates: '1729–1797',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sir_Joshua_Reynolds_-_Edmund_Burke%2C_1729_-_1797._Statesman%2C_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland.jpg/330px-Sir_Joshua_Reynolds_-_Edmund_Burke%2C_1729_-_1797._Statesman%2C_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland.jpg',
    imageAlt: 'Edmund Burke, portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Edmund_Burke',
    description: [
      `Edmund Burke, the Anglo-Irish statesman and political philosopher, is widely regarded as the founding theorist of modern conservatism. His Reflections on the Revolution in France (1790), written before the Terror, predicted the revolution's descent into tyranny on the basis of its abstract rationalism — its willingness to demolish inherited institutions in pursuit of idealized principles divorced from historical experience. Burke argued that political wisdom is not the property of individual reason but is embedded in the accumulated customs, traditions, and institutions that societies inherit across generations. Radical change, however theoretically compelling, risks destroying the uncodified social knowledge that holds communities together.`,
      `Burke's conservatism was not simply a defence of the status quo. He supported American independence, opposed the East India Company's abuses in Bengal (prosecuting Warren Hastings over eighteen years), and argued for Catholic emancipation in Ireland. His thought is therefore better understood as a defence of organic, evolving institutions against the violence of revolutionary abstraction than as a justification for any particular social hierarchy. Burke accepted hierarchy as natural but insisted it carry obligations. His placement in the authoritarian right reflects his conviction that social order, religious tradition, and inherited authority are indispensable to political life — not his support for despotism, which he consistently opposed. Political theorists including Russell Kirk, Yuval Levin, and Jesse Norman have produced major scholarly reassessments of his relevance to contemporary conservatism.`,
    ],
    references: [
      'Kirk, Russell. The Conservative Mind: From Burke to Eliot. Regnery, 1953.',
      'Levin, Yuval. The Great Debate: Edmund Burke, Thomas Paine, and the Birth of Right and Left. Basic Books, 2014.',
      'Norman, Jesse. Edmund Burke: The First Conservative. Basic Books, 2013.',
      'Burke, Edmund. Reflections on the Revolution in France. 1790. Oxford University Press, 1993.',
      'Bromwich, David. The Intellectual Life of Edmund Burke. Harvard University Press, 2014.',
    ],
  },
  {
    name: 'Joseph de Maistre',
    dates: '1753–1821',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Portrait_of_Joseph_de_Maistre.jpg/330px-Portrait_of_Joseph_de_Maistre.jpg',
    imageAlt: 'Joseph de Maistre, portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Joseph_de_Maistre',
    description: [
      `Joseph de Maistre was a Savoyard diplomat and counter-revolutionary philosopher whose work represents the most uncompromising intellectual reaction to the French Revolution. Where Burke criticized the revolution's methods while accepting some of its aspirations, de Maistre rejected the entire Enlightenment project. For de Maistre, reason unconstrained by religious authority produces not freedom but chaos and blood — the guillotine was not a corruption of revolutionary idealism but its logical expression. His major works, including Considerations on France (1796) and The Pope (1821), argued for the absolute supremacy of papal authority over temporal monarchs and the necessity of violence, hereditary order, and the executioner as structural pillars of all human societies.`,
      `De Maistre's thought is often characterized as the purest expression of theocratic conservatism — the view that legitimate political order flows downward from divine authority through pope and king to subjects, with no basis in popular sovereignty. Isaiah Berlin memorably described him as a prophetic figure of the twentieth-century authoritarian right: his celebration of irrationality, violence, and organic community over individual reason anticipated themes in fascist thought, though the connection is contested. De Maistre's direct influence was primarily on continental ultramontane Catholicism; his broader relevance became apparent only retrospectively. Contemporary political theorists including Carolina Armenteros and Richard Lebrun have produced important scholarly editions and reassessments of his work within its historical context.`,
    ],
    references: [
      'Armenteros, Carolina. The French Idea of History: Joseph de Maistre and His Heirs. Cornell University Press, 2011.',
      'Berlin, Isaiah. "Joseph de Maistre and the Origins of Fascism." In The Crooked Timber of Humanity. Princeton University Press, 1990.',
      'Lebrun, Richard A. Joseph de Maistre: An Intellectual Militant. McGill-Queen\'s University Press, 1988.',
      'de Maistre, Joseph. Considerations on France. Trans. Richard Lebrun. Cambridge University Press, 1994.',
      'Bradley, Owen. A Modern Maistre: The Social and Political Thought of Joseph de Maistre. University of Nebraska Press, 1999.',
    ],
  },
  {
    name: 'Winston Churchill',
    dates: '1874–1965',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/330px-Sir_Winston_Churchill_-_19086236948.jpg',
    imageAlt: 'Sir Winston Churchill',
    imageSource: 'https://en.wikipedia.org/wiki/Winston_Churchill',
    description: [
      `Winston Churchill served as Prime Minister of the United Kingdom during its most existential crisis — the Second World War — and is credited, more than any other single figure, with sustaining British resistance to Nazi Germany during the period 1940–41 when the country stood without major allies. His wartime leadership, characterized by extraordinary rhetorical force and strategic tenacity, placed him among the most consequential political figures of the twentieth century. As a politician across five decades he occupied both Liberal and Conservative positions, overseeing significant social reforms as President of the Board of Trade (1908–10) and serving as one of the architects of the post-Boer-War reconstruction of South Africa.`,
      `Churchill's record is also marked by decisions whose human costs are now the subject of serious historical scrutiny. As Colonial Secretary he oversaw British campaigns against Kurdish and Arab rebels in the 1920s and supported the use of chemical weapons against "uncivilised tribes." As Prime Minister during the Bengal Famine of 1943, his War Cabinet's policies — including the restriction of food imports to India and the prioritization of British strategic stockpiles — contributed to a famine that killed between two and three million people. Churchill's own recorded statements about Indians were contemptuous. Historians including Madhusree Mukerjee, Arthur Herman, and Andrew Roberts have debated the extent of his personal culpability versus structural and wartime constraints. His authoritarian right placement reflects his defence of empire, class hierarchy, and strong executive power alongside his genuine anti-fascism.`,
    ],
    references: [
      'Mukerjee, Madhusree. Churchill\'s Secret War: The British Empire and the Ravaging of India During World War II. Basic Books, 2010.',
      'Roberts, Andrew. Churchill: Walking with Destiny. Viking, 2018.',
      'Herman, Arthur. Gandhi & Churchill: The Epic Rivalry That Destroyed an Empire and Forged Our Age. Bantam Books, 2008.',
      'Gilbert, Martin. Churchill: A Life. Henry Holt, 1991.',
      'Toye, Richard. Churchill\'s Empire: The World That Made Him and the World He Made. Macmillan, 2010.',
    ],
  },
  {
    name: 'Francisco Franco',
    dates: '1892–1975',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Francisco_Franco_posed_portrait_photograph.jpg/330px-Francisco_Franco_posed_portrait_photograph.jpg',
    imageAlt: 'Francisco Franco, official portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Francisco_Franco',
    description: [
      `Francisco Franco was the Spanish general who led the Nationalist uprising against the elected Republican government in 1936, triggering the Spanish Civil War, and governed Spain as a military dictator from 1939 until his death in 1975. Franco's regime — the Franquista state — combined nationalist authoritarianism with Catholicism, corporatism, and the suppression of regional identities (Catalan, Basque, and Galician languages were banned). His ideological foundations were eclectic rather than programmatic: early Francoism drew on fascist models and Falangist rhetoric, while later decades saw a shift toward Catholic social teaching and, from the late 1950s, a technocratic economic liberalization managed by Opus Dei-linked ministers.`,
      `The violence of Franco's regime was extensive and systematic. The repression following the Civil War included mass executions, imprisonment, and forced labour; estimates of those killed range from 100,000 to over 200,000. The Valle de los Caídos monument, built by Republican forced labourers, became a symbol of the regime's use of commemorative architecture to legitimize its origins. Unlike Hitler and Mussolini, Franco kept Spain formally neutral in World War II — a decision that ultimately preserved his regime from the post-war reckoning faced by his fascist contemporaries. Historians including Paul Preston, Stanley Payne, and Antony Beevor have produced detailed histories of Francoism, with Preston's biography offering the most comprehensive critical assessment.`,
    ],
    references: [
      'Preston, Paul. Franco: A Biography. Basic Books, 1994.',
      'Payne, Stanley G. The Franco Regime, 1936–1975. University of Wisconsin Press, 1987.',
      'Beevor, Antony. The Battle for Spain: The Spanish Civil War 1936–1939. Weidenfeld & Nicolson, 2006.',
      'Box, Zira. Spain in the Age of Franco: The Political Construction of Identity. Routledge, 2020.',
      'Graham, Helen. The Spanish Civil War: A Very Short Introduction. Oxford University Press, 2005.',
    ],
  },
  {
    name: 'Benito Mussolini',
    dates: '1883–1945',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Benito_Mussolini_Portrait.jpg/330px-Benito_Mussolini_Portrait.jpg',
    imageAlt: 'Benito Mussolini',
    imageSource: 'https://en.wikipedia.org/wiki/Benito_Mussolini',
    description: [
      `Benito Mussolini was the founder of fascism and ruled Italy as Il Duce from 1922 to 1943, establishing the first fascist state in history. Beginning as a radical socialist journalist, Mussolini broke with the left after World War I and developed fascism as a synthesis of nationalism, corporatism, and militant anti-communism. His March on Rome in 1922 brought him to power through the threat of violence and the acquiescence of King Victor Emmanuel III. The subsequent consolidation of the Fascist state — abolishing opposition parties, suppressing the press, establishing the secret police (OVRA), and institutionalizing the cult of the leader — provided a model that Hitler would adapt and radicalize. Mussolini's corporatist economic model nominally reconciled capital and labour under state direction, though in practice it protected capitalist ownership while destroying trade union independence.`,
      `Mussolini's international record includes the invasion and colonization of Ethiopia (1935–36), carried out with poison gas and the deliberate targeting of civilians and Red Cross facilities, and the colonization of Libya, which involved systematic massacres and the internment of large portions of the Cyrenaican population in concentration camps — events documented by scholars including Angelo Del Boca and Giorgio Rochat. Italy's racial laws of 1938 stripped Italian Jews of citizenship and property; the subsequent deportation of Jews under German occupation, which Mussolini's government facilitated, resulted in the deaths of approximately 8,000 Italian Jews. Historians including R.J.B. Bosworth, Denis Mack Smith, and Emilio Gentile have produced major scholarly reassessments of Mussolini's regime that recover its full scope of violence beyond the more familiar German comparison.`,
    ],
    references: [
      'Bosworth, R.J.B. Mussolini. Arnold, 2002.',
      'Gentile, Emilio. The Sacralization of Politics in Fascist Italy. Harvard University Press, 1996.',
      'Mack Smith, Denis. Mussolini. Knopf, 1982.',
      'Del Boca, Angelo. Italians, Brava Gente? Neri Pozza Editore, 2005.',
      'Paxton, Robert O. The Anatomy of Fascism. Knopf, 2004.',
    ],
  },
];

export default function AuthoritarianRightPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 800 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Historical Figures
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
        Authoritarian Right
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-xl)', maxWidth: 640 }}>
        Figures in the authoritarian right quadrant combined hierarchical social and political
        order — tradition, nationalism, religious authority, or racial ideology — with economies
        ranging from state corporatism to managed capitalism. Their movements defended existing
        property structures while dismantling liberal democratic institutions.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
        <Link to="/figures" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>← All Quadrants</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-left" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Left</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/libertarian-left" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Lib Left</Link>
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
                Authoritarian Right
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
          The authoritarian right quadrant maps economic right-of-centre positions — defence of
          private property, opposition to socialist redistribution, and varying degrees of market
          acceptance — against high social authoritarianism: nationalism, tradition, hierarchical
          authority, and the restriction of democratic participation. The five figures above span
          a range from Burke's philosophical conservatism to the explicit fascism of Mussolini.
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
