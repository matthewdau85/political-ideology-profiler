const clusters = [
  {
    id: 'democratic-socialist',
    name: 'Democratic Socialist',
    economicRange: [-10, -5.5],
    socialRange: [-10, -2],
    description: 'You believe in fundamental economic transformation through democratic means. Public ownership of key industries, universal social programs, and deep wealth redistribution are central to your vision. You combine economic radicalism with progressive social values.',
    color: '#dc2626',
    traits: ['Anti-capitalist', 'Pro-worker ownership', 'Universal programs', 'Internationalist'],
  },
  {
    id: 'structural-social-democrat',
    name: 'Structural Social Democrat',
    economicRange: [-5.5, -2.5],
    socialRange: [-10, -1],
    description: 'You support a strong welfare state and significant government intervention in the economy, but within a mixed-economy framework. You believe in regulated capitalism with robust social protections, public healthcare, and free education.',
    color: '#e85d04',
    traits: ['Strong welfare state', 'Mixed economy', 'Pro-regulation', 'Social investment'],
  },
  {
    id: 'progressive-liberal',
    name: 'Progressive Liberal',
    economicRange: [-2.5, 0.5],
    socialRange: [-10, -2],
    description: 'You combine moderate economic positions with strongly progressive social values. You support market economics with meaningful social safety nets, and you champion civil rights, diversity, and environmental action.',
    color: '#7c3aed',
    traits: ['Socially progressive', 'Market-friendly', 'Rights-focused', 'Environmentalist'],
  },
  {
    id: 'technocratic-liberal',
    name: 'Technocratic Liberal',
    economicRange: [-1.5, 2],
    socialRange: [-3, 1],
    description: 'You believe in evidence-based policy, market mechanisms, and institutional reform. You tend toward the political center, favoring pragmatic solutions over ideological purity. Expertise and data should guide governance.',
    color: '#0891b2',
    traits: ['Evidence-based', 'Centrist', 'Institutionalist', 'Pragmatic'],
  },
  {
    id: 'market-liberal',
    name: 'Market Liberal',
    economicRange: [2, 6],
    socialRange: [-5, 1],
    description: 'You believe free markets are the most effective mechanism for prosperity. You support deregulation, free trade, and limited government intervention while maintaining relatively moderate or liberal social positions.',
    color: '#2563eb',
    traits: ['Free market', 'Deregulation', 'Free trade', 'Individual liberty'],
  },
  {
    id: 'conservative-liberal',
    name: 'Conservative Liberal',
    economicRange: [1, 5],
    socialRange: [1, 4],
    description: 'You combine economic conservatism with moderate social traditionalism. You believe in fiscal responsibility, lower taxes, strong institutions, and a measured approach to social change that respects tradition.',
    color: '#1d4ed8',
    traits: ['Fiscal conservative', 'Moderate traditionalist', 'Institutional', 'Gradualist'],
  },
  {
    id: 'traditional-conservative',
    name: 'Traditional Conservative',
    economicRange: [0, 7],
    socialRange: [4, 8],
    description: 'You believe in preserving established social institutions, traditional values, and cultural continuity. Economically, you support free enterprise tempered by national interest and community responsibility.',
    color: '#1e3a5f',
    traits: ['Traditionalist', 'Family values', 'National identity', 'Free enterprise'],
  },
  {
    id: 'nationalist-populist',
    name: 'Nationalist Populist',
    economicRange: [-3, 4],
    socialRange: [5, 10],
    description: 'You prioritize national sovereignty, cultural identity, and the interests of ordinary citizens over globalist elites. You may hold economically varied positions but strongly favor social conservatism and immigration restriction.',
    color: '#78350f',
    traits: ['Nationalist', 'Anti-elite', 'Immigration-restrictionist', 'Sovereigntist'],
  },
];

export function classifyCluster(economic, social) {
  const scored = clusters.map(cluster => {
    const eMin = cluster.economicRange[0];
    const eMax = cluster.economicRange[1];
    const sMin = cluster.socialRange[0];
    const sMax = cluster.socialRange[1];

    const eMid = (eMin + eMax) / 2;
    const sMid = (sMin + sMax) / 2;

    const eDist = Math.abs(economic - eMid) / ((eMax - eMin) / 2 + 1);
    const sDist = Math.abs(social - sMid) / ((sMax - sMin) / 2 + 1);
    const distance = Math.sqrt(eDist * eDist + sDist * sDist);

    const inRange =
      economic >= eMin - 1 && economic <= eMax + 1 &&
      social >= sMin - 1 && social <= sMax + 1;

    return {
      ...cluster,
      distance,
      inRange,
      probability: Math.max(0, 1 - distance / 3),
    };
  });

  scored.sort((a, b) => a.distance - b.distance);
  const total = scored.reduce((s, c) => s + c.probability, 0);
  return scored.map(c => ({
    ...c,
    probability: total > 0 ? c.probability / total : 0,
  }));
}

export default clusters;
