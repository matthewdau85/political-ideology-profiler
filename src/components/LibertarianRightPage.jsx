import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const figures = [
  {
    name: 'John Locke',
    dates: '1632–1704',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/JohnLocke.png/330px-JohnLocke.png',
    imageAlt: 'John Locke, portrait by Kneller',
    imageSource: 'https://en.wikipedia.org/wiki/John_Locke',
    description: [
      `John Locke is the foundational theorist of classical liberalism and one of the most influential philosophers in the history of Western political thought. His Two Treatises of Government (1689) demolished the divine-right absolutism of Robert Filmer and established the framework that would shape liberal democratic theory for centuries: natural rights (life, liberty, and property) that precede the state; government as a trust established by consent to protect those rights; and the right of revolution when government betrays that trust. The Second Treatise's theory of legitimate property — that labour mixed with natural resources generates ownership — provided both a defence of private property and a critique of arbitrary seizure. Locke's Letter Concerning Toleration argued for the separation of church and state and religious liberty, though he excluded atheists and Catholics from toleration on pragmatic grounds.`,
      `Locke's theoretical liberalism coexisted with a direct personal involvement in Atlantic slavery that has received serious scholarly attention since the 1990s. He was a shareholder in the Royal African Company, an investor in Bahamian plantation ventures, and assisted in drafting the Fundamental Constitutions of Carolina (1669), which granted slave owners absolute power over enslaved people. His labour theory of property, which grounds ownership in the work one does, was not applied to enslaved people who were themselves forced to labour. Scholars including Barbara Arneil, James Farr, and Wayne Glausser have examined this tension in detail, while others including Jeremy Waldron have argued that Locke's theoretical framework contains resources for a critique of slavery that its author failed to apply. The gap between Locke's universal natural-rights language and his slaveholding practice represents one of the defining contradictions of the liberal tradition he founded.`,
    ],
    references: [
      'Arneil, Barbara. John Locke and America: The Defence of English Colonialism. Oxford University Press, 1996.',
      'Tully, James. A Discourse on Property: John Locke and His Adversaries. Cambridge University Press, 1980.',
      'Waldron, Jeremy. God, Locke, and Equality: Christian Foundations of Locke\'s Political Thought. Cambridge University Press, 2002.',
      'Locke, John. Two Treatises of Government. 1689. Ed. Peter Laslett. Cambridge University Press, 1988.',
      'Dunn, John. The Political Thought of John Locke. Cambridge University Press, 1969.',
    ],
  },
  {
    name: 'Adam Smith',
    dates: '1723–1790',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/AdamSmith.jpg/330px-AdamSmith.jpg',
    imageAlt: 'Adam Smith, portrait',
    imageSource: 'https://en.wikipedia.org/wiki/Adam_Smith',
    description: [
      `Adam Smith, the Scottish moral philosopher and political economist, is the foundational theorist of market economics and one of the most cited thinkers in the history of economic thought. The Wealth of Nations (1776) provided the first systematic analysis of how market exchange, the division of labour, and the price mechanism could coordinate economic activity across millions of individuals without central direction. His metaphor of the "invisible hand" — the idea that individuals pursuing self-interest in competitive markets tend to produce socially beneficial outcomes — became the central image of liberal economic theory. Smith argued against mercantilism (government management of trade to accumulate national wealth) and in favour of free exchange, making him a foundational source for arguments against protectionism and state economic intervention.`,
      `The Adam Smith claimed by libertarian right economics is a selective portrait. Smith was deeply critical of merchants and manufacturers, whom he regarded as systematically conspiring against the public interest. He supported progressive taxation, public education funded by the state, regulations to protect workers from employer combinations, and severe restrictions on the power of joint-stock companies. His earlier work, The Theory of Moral Sentiments (1759), grounded economic life in sympathy and social sentiment rather than pure self-interest — a context that his twentieth-century interpreters frequently omitted. Scholars including Emma Rothschild, Amartya Sen, and Nicholas Phillipson have produced major reassessments of Smith that recover the full complexity of his thought against the simplified libertarian appropriation, while acknowledging the genuine importance of his case for market coordination.`,
    ],
    references: [
      'Rothschild, Emma. Economic Sentiments: Adam Smith, Condorcet, and the Enlightenment. Harvard University Press, 2001.',
      'Sen, Amartya. "Open and Closed Impartiality." Journal of Philosophy 99:9, 2002.',
      'Phillipson, Nicholas. Adam Smith: An Enlightened Life. Yale University Press, 2010.',
      'Smith, Adam. The Wealth of Nations. 1776. Ed. R.H. Campbell and A.S. Skinner. Oxford University Press, 1976.',
      'Muller, Jerry Z. Adam Smith in His Time and Ours. Princeton University Press, 1993.',
    ],
  },
  {
    name: 'Friedrich Hayek',
    dates: '1899–1992',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Friedrich_Hayek_portrait.jpg/330px-Friedrich_Hayek_portrait.jpg',
    imageAlt: 'Friedrich Hayek',
    imageSource: 'https://en.wikipedia.org/wiki/Friedrich_Hayek',
    description: [
      `Friedrich Hayek was an Austrian-British economist and political philosopher who became the most influential theorist of the libertarian right in the twentieth century. His intellectual programme had two central pillars. The first was the "knowledge problem" in economics: the argument, developed most precisely in "The Use of Knowledge in Society" (1945), that the information necessary for economic coordination is dispersed across millions of individuals and embedded in tacit practices rather than explicit data, making central planning epistemically impossible regardless of the intentions or computing power of the planners. The second was a broader theory of spontaneous order: the idea that the most valuable human institutions — markets, common law, language, moral traditions — are not designed but emerge from the unintended consequences of individual actions following rules.`,
      `The Road to Serfdom (1944), Hayek's most widely read work, argued that central economic planning inevitably tends toward totalitarianism — not because planners are malicious but because the coercion required to implement any comprehensive economic plan escalates without limit once the principle of planning is accepted. This argument, widely read as a response to Nazi and Soviet totalitarianism, made him internationally prominent. Hayek won the Nobel Memorial Prize in Economics in 1974 (shared with Gunnar Myrdal) and exercised significant influence on the Thatcher and Reagan administrations. His critics — including John Maynard Keynes, who admired parts of The Road to Serfdom but disputed its economic analysis, and more recently scholars including Philip Mirowski and Angus Burgin — have questioned both the empirical basis of his economic theory and the political uses to which it was put. His support for the Pinochet regime in Chile, which he visited and praised, remains a significant controversy in assessments of his legacy.`,
    ],
    references: [
      'Hayek, Friedrich A. The Road to Serfdom. 1944. University of Chicago Press, 2007.',
      'Burgin, Angus. The Great Persuasion: Reinventing Free Markets Since the Depression. Harvard University Press, 2012.',
      'Mirowski, Philip. Never Let a Serious Crisis Go to Waste. Verso, 2013.',
      'Caldwell, Bruce. Hayek\'s Challenge: An Intellectual Biography of F.A. Hayek. University of Chicago Press, 2004.',
      'Ebenstein, Alan. Friedrich Hayek: A Biography. Palgrave, 2001.',
    ],
  },
  {
    name: 'Milton Friedman',
    dates: '1912–2006',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Portrait_of_Milton_Friedman.jpg/330px-Portrait_of_Milton_Friedman.jpg',
    imageAlt: 'Milton Friedman',
    imageSource: 'https://en.wikipedia.org/wiki/Milton_Friedman',
    description: [
      `Milton Friedman was an American economist at the University of Chicago who became the leading academic advocate for free-market economics and monetarism in the second half of the twentieth century. His technical economic contributions were substantial: Capitalism and Freedom (1962) argued the case for market solutions to problems typically addressed by government; A Monetary History of the United States (1963, with Anna Schwartz) established that the Federal Reserve's contraction of the money supply transformed the 1929 stock crash into the Great Depression — a thesis that fundamentally reshaped macroeconomic history and central banking practice; and his 1968 presidential address to the American Economic Association introduced the natural rate of unemployment and the accelerationist critique of inflationary demand management that became the basis for monetarist stabilization policy.`,
      `Friedman won the Nobel Memorial Prize in Economics in 1976 and his ideas — school vouchers, the negative income tax, the all-volunteer military, the abolition of occupational licensing — profoundly shaped policy debates across the political spectrum. His influence on the Chicago Boys, the economists who advised the Pinochet government in Chile during and after the 1973 coup, has generated sustained critical scrutiny: Friedman visited Chile in 1975, met with Pinochet, and wrote a public letter advising "shock treatment" economic liberalization, at a time when the regime's systematic use of torture and murder was well documented. The relationship between free-market economic liberalism and political authoritarianism — exemplified by Chile — has been a central point of contention in assessments of his legacy. Scholars including Johan Van Overtveldt, Lanny Ebenstein, and Naomi Klein have offered sharply divergent assessments.`,
    ],
    references: [
      'Friedman, Milton. Capitalism and Freedom. University of Chicago Press, 1962.',
      'Friedman, Milton, and Anna Jacobson Schwartz. A Monetary History of the United States, 1867–1960. Princeton University Press, 1963.',
      'Ebenstein, Lanny. Milton Friedman: A Biography. Palgrave Macmillan, 2007.',
      'Klein, Naomi. The Shock Doctrine: The Rise of Disaster Capitalism. Metropolitan Books, 2007.',
      'Van Overtveldt, Johan. The Chicago School: How the University of Chicago Assembled the Thinkers Who Revolutionized Economics and Business. Agate B2, 2007.',
    ],
  },
  {
    name: 'Robert Nozick',
    dates: '1938–2002',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Robert_Nozick_1977_Libertarian_Review_cover.jpg/330px-Robert_Nozick_1977_Libertarian_Review_cover.jpg',
    imageAlt: 'Robert Nozick',
    imageSource: 'https://en.wikipedia.org/wiki/Robert_Nozick',
    description: [
      `Robert Nozick was an American political philosopher at Harvard whose Anarchy, State, and Utopia (1974) became the most rigorous academic statement of libertarian political theory and a direct challenge to the dominant liberal egalitarianism of his colleague John Rawls. Where Rawls's A Theory of Justice (1971) justified redistribution on the grounds of what rational agents would choose behind a "veil of ignorance" about their social position, Nozick argued that redistributive taxation violates individual rights. His entitlement theory of justice held that holdings are just if they arise from just acquisition or just transfer — making any pattern-imposing redistribution an illegitimate interference with the free choices of individuals.`,
      `Nozick's minimal state — a "nightwatchman" state limited to protecting individuals against violence, theft, and fraud, and to enforcing contracts — represented the most philosophically developed libertarian alternative to the welfare state in academic political philosophy. His Wilt Chamberlain argument, demonstrating that any patterned distributive principle will be continually disrupted by free exchanges, remains a standard reference in debates about equality and markets. Later in his career Nozick significantly moderated his earlier libertarianism, acknowledging in The Examined Life (1989) that Anarchy, State, and Utopia had been "seriously inadequate" in its treatment of the moral complexity of social life — a reconsideration that his libertarian admirers have largely ignored. Philosophers including G.A. Cohen, Jonathan Wolff, and Samuel Freeman have produced major critical responses to his framework.`,
    ],
    references: [
      'Nozick, Robert. Anarchy, State, and Utopia. Basic Books, 1974.',
      'Cohen, G.A. Self-Ownership, Freedom, and Equality. Cambridge University Press, 1995.',
      'Wolff, Jonathan. Robert Nozick: Property, Justice and the Minimal State. Stanford University Press, 1991.',
      'Freeman, Samuel, ed. The Cambridge Companion to Rawls. Cambridge University Press, 2003.',
      'Schaefer, David Lewis. Robert Nozick: The Man and His Ideas. Continuum, 2011.',
    ],
  },
];

export default function LibertarianRightPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 800 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Historical Figures
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
        Libertarian Right
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-xl)', maxWidth: 640 }}>
        Figures in the libertarian right quadrant combined advocacy for free markets, private
        property, and limited government with opposition to state intervention in economic and
        personal life. Their intellectual tradition runs from classical liberalism through
        twentieth-century libertarianism and neoliberal political economy.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
        <Link to="/figures" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>← All Quadrants</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-left" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Left</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-right" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Right</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/libertarian-left" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Lib Left</Link>
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
                Libertarian Right
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
          The libertarian right quadrant maps economic right-of-centre positions — free markets,
          private property, limited redistribution — against low social authoritarianism: opposition
          to state interference in personal choices and civil liberties. The five figures above
          represent the classical liberal tradition (Locke, Smith) and its twentieth-century
          successors in Austrian and Chicago economics (Hayek, Friedman) and analytical political
          philosophy (Nozick).
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
