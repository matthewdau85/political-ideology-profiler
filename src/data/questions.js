// 24 political ideology questions across 4 sections
// Each answer has economic weight and social weight (-3 to +3)
// Economic: negative = left/socialist, positive = right/market liberal
// Social: negative = progressive, positive = conservative
// Answer order is intentionally varied per question to avoid positional bias.

const questions = [
  // === SECTION 1: ECONOMIC VIEWS (Questions 1-6) ===
  {
    id: 1,
    section: 'Economic Views',
    text: 'What role should the government play in the economy?',
    answers: [
      { text: 'Light regulation to ensure fair competition, but markets should lead.', economic: 1.5, social: 0 },
      { text: 'The state should own and control major industries for the public good.', economic: -3, social: 0 },
      { text: 'Minimal government intervention — free markets allocate resources best.', economic: 3, social: 0.5 },
      { text: 'Strong regulation and redistribution, but with private enterprise.', economic: -1.5, social: -0.5 },
    ],
  },
  {
    id: 2,
    section: 'Economic Views',
    text: 'How should wealth inequality be addressed?',
    answers: [
      { text: 'Inequality is natural and motivating — redistribution harms growth.', economic: 3, social: 1 },
      { text: 'Progressive taxation and strong social safety nets.', economic: -1.5, social: -0.5 },
      { text: 'Abolish the billionaire class through wealth caps and redistribution.', economic: -3, social: -0.5 },
      { text: 'Encourage wealth creation with modest tax incentives for giving.', economic: 1, social: 0 },
    ],
  },
  {
    id: 3,
    section: 'Economic Views',
    text: 'What is your view on universal basic income (UBI)?',
    answers: [
      { text: 'Worth exploring as a supplement to existing welfare programs.', economic: -0.5, social: -0.5 },
      { text: 'A terrible idea — people should earn their living.', economic: 2.5, social: 1.5 },
      { text: 'Essential — everyone deserves unconditional economic security.', economic: -2, social: -1 },
      { text: 'Too expensive and could reduce work incentives.', economic: 1.5, social: 0.5 },
    ],
  },
  {
    id: 4,
    section: 'Economic Views',
    text: 'How should healthcare be funded?',
    answers: [
      { text: 'Fully private — competition drives quality and lowers costs.', economic: 3, social: 0.5 },
      { text: 'Fully public, single-payer system — healthcare is a right.', economic: -2.5, social: -0.5 },
      { text: 'Private insurance with subsidies for those who can\'t afford it.', economic: 1.5, social: 0 },
      { text: 'Public-private mix with universal coverage guaranteed.', economic: -0.5, social: 0 },
    ],
  },
  {
    id: 5,
    section: 'Economic Views',
    text: 'What is your view on trade unions?',
    answers: [
      { text: 'Strong unions are essential for balancing corporate power.', economic: -1.5, social: -0.5 },
      { text: 'Unions distort labor markets and should be minimized.', economic: 2.5, social: 0.5 },
      { text: 'Workers\' councils should co-manage major enterprises.', economic: -3, social: -1 },
      { text: 'Unions serve a purpose but shouldn\'t have too much power.', economic: 1, social: 0 },
    ],
  },
  {
    id: 6,
    section: 'Economic Views',
    text: 'How should housing be managed?',
    answers: [
      { text: 'Market-based with targeted subsidies for low-income households.', economic: 1, social: 0 },
      { text: 'Public housing for all — housing should not be a commodity.', economic: -2.5, social: -0.5 },
      { text: 'Let the free market determine housing — deregulate construction.', economic: 2.5, social: 0 },
      { text: 'Strong rent controls and government-funded affordable housing.', economic: -1.5, social: -0.5 },
    ],
  },

  // === SECTION 2: SOCIAL VALUES (Questions 7-12) ===
  {
    id: 7,
    section: 'Social Values',
    text: 'What is your view on immigration?',
    answers: [
      { text: 'Strict limits to preserve cultural identity and national security.', economic: 0, social: 3 },
      { text: 'Open borders — freedom of movement is a human right.', economic: -0.5, social: -3 },
      { text: 'Controlled immigration based on economic needs.', economic: 0.5, social: 1 },
      { text: 'Welcoming immigration with integration support programs.', economic: -0.5, social: -1.5 },
    ],
  },
  {
    id: 8,
    section: 'Social Values',
    text: 'How should society approach LGBTQ+ rights?',
    answers: [
      { text: 'Legal equality and protections, but let social attitudes evolve naturally.', economic: 0, social: -1 },
      { text: 'Traditional values should guide policy on family and marriage.', economic: 0, social: 3 },
      { text: 'Full equality in all areas, with proactive anti-discrimination measures.', economic: 0, social: -3 },
      { text: 'Civil unions are fine, but marriage should remain traditional.', economic: 0, social: 1.5 },
    ],
  },
  {
    id: 9,
    section: 'Social Values',
    text: 'What role should religion play in public life?',
    answers: [
      { text: 'Religious values can inform policy without theocracy.', economic: 0, social: 1.5 },
      { text: 'Strict separation — religion has no place in governance.', economic: 0, social: -2.5 },
      { text: 'A nation\'s laws should reflect its dominant religious tradition.', economic: 0, social: 3 },
      { text: 'Personal faith is fine but should not influence legislation.', economic: 0, social: -1 },
    ],
  },
  {
    id: 10,
    section: 'Social Values',
    text: 'How should drug policy be handled?',
    answers: [
      { text: 'Decriminalize personal use, invest in treatment programs.', economic: 0, social: -1 },
      { text: 'Strict enforcement — drug use undermines social order.', economic: 0, social: 2.5 },
      { text: 'Maintain current laws but focus more on rehabilitation.', economic: 0, social: 0.5 },
      { text: 'Full decriminalization and legalization with harm reduction.', economic: 0, social: -2.5 },
    ],
  },
  {
    id: 11,
    section: 'Social Values',
    text: 'What is your view on criminal justice?',
    answers: [
      { text: 'Tough on crime — strong deterrents keep society safe.', economic: 0.5, social: 2.5 },
      { text: 'Major reform: reduce incarceration, focus on rehabilitation.', economic: -0.5, social: -1.5 },
      { text: 'Balance punishment and rehabilitation within existing systems.', economic: 0, social: 0.5 },
      { text: 'Abolish prisons — invest in restorative justice and social support.', economic: -1, social: -3 },
    ],
  },
  {
    id: 12,
    section: 'Social Values',
    text: 'How should education be structured?',
    answers: [
      { text: 'School choice and vouchers to drive educational quality.', economic: 1.5, social: 0.5 },
      { text: 'Free public education through university with progressive curriculum.', economic: -2, social: -1.5 },
      { text: 'Parents should control education — including homeschooling and religious schools.', economic: 1, social: 2.5 },
      { text: 'Well-funded public schools with some curriculum flexibility.', economic: -0.5, social: -0.5 },
    ],
  },

  // === SECTION 3: INSTITUTIONS (Questions 13-18) ===
  {
    id: 13,
    section: 'Institutions',
    text: 'What is your view on democracy?',
    answers: [
      { text: 'Strengthen democratic institutions with more participatory elements.', economic: -0.5, social: -1 },
      { text: 'Strong executive leadership is needed — too much democracy causes gridlock.', economic: 0.5, social: 2 },
      { text: 'Direct democracy and citizens\' assemblies should replace representative systems.', economic: -1, social: -2 },
      { text: 'Representative democracy works well and should be preserved.', economic: 0.5, social: 0.5 },
    ],
  },
  {
    id: 14,
    section: 'Institutions',
    text: 'How should the media be regulated?',
    answers: [
      { text: 'Media should support national values and security.', economic: 0.5, social: 2.5 },
      { text: 'Free market media with minimal regulation.', economic: 1.5, social: 0 },
      { text: 'Strong public media and regulations against media monopolies.', economic: -2, social: -1 },
      { text: 'Independent public broadcaster with press freedom protections.', economic: -0.5, social: -0.5 },
    ],
  },
  {
    id: 15,
    section: 'Institutions',
    text: 'What is your view on international institutions (UN, EU, etc.)?',
    answers: [
      { text: 'Useful for trade but should not override national sovereignty.', economic: 1, social: 1.5 },
      { text: 'Strengthen them toward global governance and cooperation.', economic: -1, social: -2 },
      { text: 'Important partners, but national interests come first in key areas.', economic: 0, social: 0 },
      { text: 'Most international institutions are ineffective or harmful — withdraw.', economic: 1, social: 3 },
    ],
  },
  {
    id: 16,
    section: 'Institutions',
    text: 'How should the military be funded?',
    answers: [
      { text: 'Strong military is essential for national security and global influence.', economic: 1, social: 1.5 },
      { text: 'Drastically cut military spending — invest in diplomacy and social programs.', economic: -2.5, social: -1.5 },
      { text: 'Maximum military strength — peace through strength.', economic: 1.5, social: 2.5 },
      { text: 'Moderate military adequate for defense, no foreign adventurism.', economic: -0.5, social: -0.5 },
    ],
  },
  {
    id: 17,
    section: 'Institutions',
    text: 'What is your view on central banking and monetary policy?',
    answers: [
      { text: 'Central banks should focus primarily on price stability.', economic: 1.5, social: 0 },
      { text: 'Public banking — monetary policy should serve the people, not Wall Street.', economic: -2.5, social: -0.5 },
      { text: 'Independent central banks with a mandate to support full employment.', economic: -0.5, social: 0 },
      { text: 'Return to the gold standard or abolish central banking entirely.', economic: 3, social: 1 },
    ],
  },
  {
    id: 18,
    section: 'Institutions',
    text: 'How should technology companies be regulated?',
    answers: [
      { text: 'No regulation — the market will correct bad actors.', economic: 3, social: 0 },
      { text: 'Strong antitrust enforcement and data privacy regulations.', economic: -1, social: -0.5 },
      { text: 'Break them up and create public alternatives for critical infrastructure.', economic: -2.5, social: -1 },
      { text: 'Light touch regulation to encourage innovation.', economic: 1.5, social: 0 },
    ],
  },

  // === SECTION 4: PUBLIC POLICY (Questions 19-24) ===
  {
    id: 19,
    section: 'Public Policy',
    text: 'What is your view on climate change policy?',
    answers: [
      { text: 'Carbon tax and incentives for renewable energy transition.', economic: -0.5, social: -0.5 },
      { text: 'Climate regulation hurts the economy — adapt rather than restrict.', economic: 2.5, social: 1.5 },
      { text: 'Green New Deal — massive public investment to transform the economy.', economic: -2.5, social: -1.5 },
      { text: 'Market-based solutions like cap-and-trade are most efficient.', economic: 1.5, social: 0 },
    ],
  },
  {
    id: 20,
    section: 'Public Policy',
    text: 'How should taxation work?',
    answers: [
      { text: 'Flat tax or consumption tax — simple and fair for all.', economic: 2, social: 0.5 },
      { text: 'Wealth tax, high marginal rates, and close all loopholes.', economic: -3, social: -0.5 },
      { text: 'Minimize all taxation — government spending is inherently wasteful.', economic: 3, social: 1 },
      { text: 'Progressive income tax with strong social spending.', economic: -1, social: 0 },
    ],
  },
  {
    id: 21,
    section: 'Public Policy',
    text: 'What is your view on gun policy?',
    answers: [
      { text: 'Protect gun rights with reasonable regulations.', economic: 0, social: 1 },
      { text: 'Ban civilian ownership of firearms except for specific licensed purposes.', economic: 0, social: -2 },
      { text: 'Unrestricted gun ownership is a fundamental right.', economic: 0.5, social: 2.5 },
      { text: 'Strict background checks, licensing, and limits on military-style weapons.', economic: 0, social: -0.5 },
    ],
  },
  {
    id: 22,
    section: 'Public Policy',
    text: 'How should a country handle its national debt?',
    answers: [
      { text: 'Borrow for productive investment, balance budgets in good times.', economic: -0.5, social: 0 },
      { text: 'Balanced budget amendment — never spend more than you take in.', economic: 3, social: 1 },
      { text: 'Reduce debt through spending cuts and economic growth.', economic: 2, social: 0.5 },
      { text: 'Deficits don\'t matter if they fund social investment — Modern Monetary Theory.', economic: -2.5, social: -0.5 },
    ],
  },
  {
    id: 23,
    section: 'Public Policy',
    text: 'What is your view on foreign aid?',
    answers: [
      { text: 'Eliminate foreign aid — focus entirely on domestic priorities.', economic: 1, social: 3 },
      { text: 'Maintain or modestly increase aid focused on development outcomes.', economic: -0.5, social: -0.5 },
      { text: 'Dramatically increase aid and cancel developing world debt.', economic: -2, social: -2 },
      { text: 'Aid should serve strategic national interests.', economic: 0.5, social: 1 },
    ],
  },
  {
    id: 24,
    section: 'Public Policy',
    text: 'What is the most important issue facing your country?',
    answers: [
      { text: 'Climate change and environmental destruction.', economic: -1, social: -1.5 },
      { text: 'Immigration, cultural identity, and national security.', economic: 0, social: 2.5 },
      { text: 'Cost of living and economic growth.', economic: 1, social: 0 },
      { text: 'Economic inequality and the concentration of wealth.', economic: -2.5, social: -1 },
    ],
  },
];

export const sections = ['Economic Views', 'Social Values', 'Institutions', 'Public Policy'];

export const importanceWeights = {
  Low: 0.5,
  Medium: 1.0,
  High: 1.5,
};

export default questions;
