import React from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

const figures = [
  {
    name: 'Vladimir Lenin',
    dates: '1870–1924',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lenin_in_1920_%28cropped%29.jpg/330px-Lenin_in_1920_%28cropped%29.jpg',
    imageAlt: 'Vladimir Lenin, circa 1920',
    imageSource: 'https://en.wikipedia.org/wiki/Vladimir_Lenin',
    description: [
      `Vladimir Ilyich Ulyanov, known as Lenin, was the principal theorist and leader of the Bolshevik Revolution and the first head of the Soviet state. Building on the Marxist tradition, Lenin developed the theory of vanguard-party Leninism — the idea that a disciplined revolutionary party of professional organizers was necessary to lead the working class to power, as workers alone would develop only "trade union consciousness" rather than full revolutionary understanding. His April Theses of 1917 redirected the Bolshevik movement toward immediate socialist revolution, and by October of that year his party had seized state power in Russia, dissolving the Constituent Assembly and establishing one-party rule.`,
      `Lenin's economic and political legacy is deeply contested. He introduced the New Economic Policy (NEP) in 1921 to stabilize a devastated economy, permitting limited private trade while retaining state control of major industry — a pragmatic retreat he regarded as temporary. He also authorized the creation of the Cheka, the political police, which undertook mass executions and established the first Soviet concentration camps. His successors, particularly Stalin, vastly extended the repressive architecture Lenin had built. Historians including Robert Service, Moshe Lewin, and Lars Lih debate the degree of continuity between Leninism and Stalinism, but the institutional framework Lenin established — party monopoly, secret police, and the suppression of political opposition — provided the infrastructure for the terror that followed his death.`,
    ],
    references: [
      'Service, Robert. Lenin: A Biography. Harvard University Press, 2000.',
      'Kotkin, Stephen. Stalin, Vol. 1: Paradoxes of Power, 1878–1928. Penguin Press, 2014.',
      'Lih, Lars T. Lenin Rediscovered: "What Is to Be Done?" in Context. Haymarket Books, 2008.',
      'Pipes, Richard. The Russian Revolution. Knopf, 1990.',
      'Lewin, Moshe. Lenin\'s Last Struggle. University of Michigan Press, 2005.',
    ],
  },
  {
    name: 'Joseph Stalin',
    dates: '1878–1953',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Joseph_Stalin_in_1932_%284%29_%28cropped%29%282%29.jpg/330px-Joseph_Stalin_in_1932_%284%29_%28cropped%29%282%29.jpg',
    imageAlt: 'Joseph Stalin, 1943',
    imageSource: 'https://en.wikipedia.org/wiki/Joseph_Stalin',
    description: [
      `Joseph Vissarionovich Stalin rose from a modest Georgian background to become General Secretary of the Communist Party of the Soviet Union, a position he used to consolidate absolute personal power over the world's largest country. Stalin's ideology blended Marxist-Leninist economics with a fierce Russian nationalism and a theory of "socialism in one country" — the view that the Soviet Union could and must build socialism independently, without waiting for world revolution. This doctrine justified the rapid, coercive industrialization of the First Five-Year Plan (1928–1932) and the forced collectivization of Soviet agriculture, which transformed the USSR into a major industrial power within a generation.`,
      `The human cost of Stalinism was catastrophic. Collectivization caused a famine in Ukraine and Kazakhstan (the Holodomor) that killed an estimated 3.5 to 7 million people. The Great Terror of 1936–38 saw approximately 750,000 executions and the imprisonment of millions in the Gulag network of forced-labour camps. Stalin also deported entire ethnic groups — Chechens, Crimean Tatars, Volga Germans — in mass operations that cost hundreds of thousands of lives. Historians including Robert Conquest, Timothy Snyder, and Stephen Kotkin have documented these crimes in meticulous detail. Stalin's defenders note his pivotal role in the Soviet defeat of Nazi Germany and the rapid industrialization that made it possible; his critics argue that the cost in human lives makes any such accounting morally incoherent.`,
    ],
    references: [
      'Kotkin, Stephen. Stalin, Vol. 2: Waiting for Hitler, 1929–1941. Penguin Press, 2017.',
      'Conquest, Robert. The Great Terror: A Reassessment. Oxford University Press, 1990.',
      'Snyder, Timothy. Bloodlands: Europe Between Hitler and Stalin. Basic Books, 2010.',
      'Applebaum, Anne. Gulag: A History. Doubleday, 2003.',
      'Montefiore, Simon Sebag. Stalin: The Court of the Red Tsar. Knopf, 2004.',
    ],
  },
  {
    name: 'Mao Zedong',
    dates: '1893–1976',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mao_Zedong_1950_Portrait_%283x4_cropped%29%282%29.jpg/330px-Mao_Zedong_1950_Portrait_%283x4_cropped%29%282%29.jpg',
    imageAlt: 'Mao Zedong, 1963',
    imageSource: 'https://en.wikipedia.org/wiki/Mao_Zedong',
    description: [
      `Mao Zedong led the Chinese Communist Party to victory in the Chinese Civil War and proclaimed the People's Republic of China in 1949. His ideological contribution — often called Maoism or Mao Zedong Thought — adapted Marxism-Leninism to agrarian conditions, placing the revolutionary peasantry rather than the urban proletariat at the center of the communist project. Mao theorized protracted guerrilla warfare, the mass line (leadership that synthesizes popular sentiment into correct political guidance), and uninterrupted revolution as mechanisms of social transformation. His military and organizational writings, including On Guerrilla Warfare and On Contradiction, remain studied in military colleges and revolutionary movements worldwide.`,
      `Mao's governance produced two of the deadliest catastrophes of the twentieth century. The Great Leap Forward (1958–1962), an attempt to rapidly industrialize China through mass mobilization and the collectivization of agriculture, resulted in a famine that killed between 15 and 55 million people — the largest famine in recorded history. The Cultural Revolution (1966–1976) unleashed Red Guard violence against intellectuals, party cadres, and perceived class enemies, destroying much of China's cultural heritage and causing an estimated one to two million deaths, with far larger numbers imprisoned or displaced. Historians including Frank Dikötter, Jonathan Spence, and Jung Chang have documented these events in extensive archival detail, while the Chinese Communist Party's official 1981 assessment acknowledged Mao's "gross mistakes" during the Cultural Revolution while upholding his overall legacy.`,
    ],
    references: [
      'Dikötter, Frank. Mao\'s Great Famine: The History of China\'s Most Devastating Catastrophe. Walker & Company, 2010.',
      'Spence, Jonathan D. Mao Zedong. Viking, 1999.',
      'Chang, Jung, and Jon Halliday. Mao: The Unknown Story. Knopf, 2005.',
      'Short, Philip. Mao: A Life. Henry Holt, 1999.',
      'Schram, Stuart R. The Thought of Mao Tse-tung. Cambridge University Press, 1989.',
    ],
  },
  {
    name: 'Josip Broz Tito',
    dates: '1892–1980',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Josip_Broz_Tito_uniform_portrait.jpg/330px-Josip_Broz_Tito_uniform_portrait.jpg',
    imageAlt: 'Josip Broz Tito in uniform',
    imageSource: 'https://en.wikipedia.org/wiki/Josip_Broz_Tito',
    description: [
      `Josip Broz Tito led the Yugoslav Partisans to victory over Nazi occupation during World War II and governed the Socialist Federal Republic of Yugoslavia from 1945 until his death in 1980. Tito is historically distinctive for two major reasons: he was the only communist leader in Eastern Europe to successfully break with Stalin's authority (the Tito–Stalin Split of 1948), maintaining Yugoslavia's independence from Moscow while preserving socialist governance; and he co-founded the Non-Aligned Movement in 1961, positioning Yugoslavia as a leader of the developing world between the US and Soviet blocs. Within Yugoslavia, his system of "workers' self-management" gave enterprise employees formal control over production decisions, representing a significant structural departure from Soviet-style central planning.`,
      `Tito's rule was not without its authoritarian features. The immediate postwar period saw mass executions of Chetniks, Ustasha collaborators, and others in events such as the Bleiburg repatriations, with casualty estimates ranging into the tens of thousands. Political dissent was suppressed through the secret police (UDBA), and the dissident Milovan Djilas — once among Tito's closest comrades — was imprisoned for criticizing the party elite in The New Class (1957). Tito managed Yugoslavia's complex ethnic tensions through a combination of federal structures and firm suppression of nationalism; the collapse of the country after his death, culminating in the wars of the 1990s, has led some historians to argue that his system deferred rather than resolved those tensions. Scholars including Stevan K. Pavlowitch and Jože Pirjevec have produced comprehensive reassessments of his legacy.`,
    ],
    references: [
      'Pavlowitch, Stevan K. Hitler\'s New Disorder: The Second World War in Yugoslavia. Columbia University Press, 2008.',
      'Pirjevec, Jože. Tito and His Comrades. University of Wisconsin Press, 2018.',
      'Djilas, Milovan. The New Class: An Analysis of the Communist System. Harcourt Brace, 1957.',
      'Lampe, John R. Yugoslavia as History: Twice There Was a Country. Cambridge University Press, 2000.',
      'West, Richard. Tito and the Rise and Fall of Yugoslavia. Carroll & Graf, 1994.',
    ],
  },
  {
    name: 'Fidel Castro',
    dates: '1926–2016',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Fidel_Castro_1950s.jpg/330px-Fidel_Castro_1950s.jpg',
    imageAlt: 'Fidel Castro in Washington, 1959',
    imageSource: 'https://en.wikipedia.org/wiki/Fidel_Castro',
    description: [
      `Fidel Castro led the Cuban Revolution that overthrew the Batista dictatorship in 1959 and governed Cuba as Prime Minister and later President until 2008, making him one of the longest-serving heads of government in modern history. His revolutionary ideology was eclectic: formally Marxist-Leninist after 1961, it also drew heavily on Cuban nationalism and the anti-imperialist tradition of José Martí. The revolution's early social programmes — universal literacy campaigns, healthcare expansion, and land reform — produced genuine advances in human development. Cuba's literacy rate became among the highest in Latin America, and its healthcare system, though limited by scarcity, achieved indicators comparable to far wealthier nations.`,
      `Castro's Cuba also maintained a repressive single-party state throughout his rule. Political opponents, gay men, religious believers, and dissidents were imprisoned or sent to UMAP forced-labour camps during the 1960s. Thousands were executed in the years immediately following the revolution. Independent civil society was systematically suppressed, and freedom of the press was extinguished. The US economic embargo compounded Cuba's development challenges while providing Castro with a ready external explanation for domestic failure. Approximately one million Cubans emigrated, including much of the island's professional and managerial class. Historians including Julia Sweig, Lillian Guerra, and Ada Ferrer have examined the revolution's legacy with careful attention to both its social achievements and its political costs.`,
    ],
    references: [
      'Sweig, Julia E. Cuba: What Everyone Needs to Know. Oxford University Press, 2009.',
      'Guerra, Lillian. Visions of Power in Cuba: Revolution, Redemption, and Resistance. University of North Carolina Press, 2012.',
      'Ferrer, Ada. Cuba: An American History. Scribner, 2021.',
      'Quirk, Robert E. Fidel Castro. W. W. Norton, 1993.',
      'Gott, Richard. Cuba: A New History. Yale University Press, 2004.',
    ],
  },
];

export default function AuthoritarianLeftPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 800 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Historical Figures
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
        Authoritarian Left
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-xl)', maxWidth: 640 }}>
        Figures in the authoritarian left quadrant combined collectivist economic programmes —
        state ownership, central planning, and redistribution — with centralized political control.
        Their movements produced significant social transformations alongside documented records
        of repression and state violence.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
        <Link to="/figures" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>← All Quadrants</Link>
        <span className="mono" style={{ fontSize: 12, color: 'var(--color-border)' }}>|</span>
        <Link to="/figures/authoritarian-right" className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Auth Right</Link>
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
                Authoritarian Left
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
          The authoritarian left quadrant on the Ideology Compass maps economic left (collective
          ownership, redistribution, state intervention in markets) against high social authoritarianism
          (centralized political control, restricted civil liberties, vanguard or one-party governance).
          The five figures profiled above represent distinct national and historical variants of this
          combination — from European Bolshevism to East Asian Maoism to Caribbean revolutionary nationalism.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Historical figure placements are approximations based on their documented public positions
          and are subject to ongoing scholarly debate. See the{' '}
          <Link to="/methodology" style={{ color: 'var(--color-accent)' }}>Methodology page</Link> for
          details on how the two-axis model is constructed and applied.
        </p>
      </div>
    </div>
  );
}
