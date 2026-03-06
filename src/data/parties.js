const parties = {
  Australia: [
    { name: 'Australian Greens', economic: -5, social: -6, color: '#00953B' },
    { name: 'Australian Labor Party', economic: -2.5, social: -2.5, color: '#E13940' },
    { name: 'Liberal Party', economic: 3.5, social: 2, color: '#0047AB' },
    { name: 'National Party', economic: 2, social: 4, color: '#006644' },
    { name: 'One Nation', economic: 0, social: 7, color: '#F36C21' },
  ],
  'United States': [
    { name: 'Democratic Party (Progressive)', economic: -4, social: -5, color: '#3333FF' },
    { name: 'Democratic Party (Centrist)', economic: -1, social: -2.5, color: '#6666FF' },
    { name: 'Republican Party (Moderate)', economic: 4, social: 2, color: '#FF6666' },
    { name: 'Republican Party (MAGA)', economic: 2, social: 6, color: '#FF0000' },
    { name: 'Libertarian Party', economic: 8, social: -3, color: '#FFD700' },
  ],
  'United Kingdom': [
    { name: 'Labour Party', economic: -3, social: -3, color: '#DC241f' },
    { name: 'Liberal Democrats', economic: -0.5, social: -3.5, color: '#FAA61A' },
    { name: 'Conservative Party', economic: 3, social: 2.5, color: '#0087DC' },
    { name: 'Green Party', economic: -5.5, social: -6, color: '#6AB023' },
    { name: 'Reform UK', economic: 2, social: 6, color: '#12B6CF' },
  ],
  Germany: [
    { name: 'Die Linke', economic: -7, social: -5, color: '#BE3075' },
    { name: 'SPD', economic: -3, social: -2.5, color: '#EB001F' },
    { name: 'Grüne', economic: -3.5, social: -5.5, color: '#64A12D' },
    { name: 'FDP', economic: 5, social: -1.5, color: '#FFED00' },
    { name: 'CDU/CSU', economic: 2, social: 2, color: '#000000' },
    { name: 'AfD', economic: 1, social: 7, color: '#009EE0' },
  ],
  Sweden: [
    { name: 'Vänsterpartiet', economic: -7, social: -5, color: '#DA291C' },
    { name: 'Socialdemokraterna', economic: -4, social: -3, color: '#ED1B34' },
    { name: 'Miljöpartiet', economic: -4, social: -6, color: '#83CF39' },
    { name: 'Centerpartiet', economic: 2, social: -2, color: '#009933' },
    { name: 'Moderaterna', economic: 4, social: 1, color: '#52BDEC' },
    { name: 'Sverigedemokraterna', economic: -1, social: 7, color: '#DDDD00' },
  ],
};

export default parties;
