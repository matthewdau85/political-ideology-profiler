// Advertisement configuration
// Supports Google AdSense, Carbon Ads, and custom sponsor banners

const adConfig = {
  enabled: true,
  provider: 'adsense', // 'adsense' | 'carbon' | 'custom'

  adsense: {
    clientId: 'ca-pub-2818167207301077', // ca-pub-XXXXX
    slots: {
      quiz_midpoint: '',
      results_footer: '',
      methodology_sidebar: '',
    },
  },

  carbon: {
    serve: '', // Carbon Ads serve URL
    placement: '', // Carbon Ads placement
  },

  custom: {
    banners: {
      quiz_midpoint: {
        text: 'Support independent political research',
        link: '#',
        enabled: true,
      },
      results_footer: {
        text: 'Ideology Compass — Open dataset for researchers',
        link: '#',
        enabled: true,
      },
      methodology_sidebar: {
        text: 'Based on peer-reviewed political science methodology',
        link: '#',
        enabled: true,
      },
    },
  },
};

export function isAdEnabled(placement) {
  if (!adConfig.enabled) return false;
  if (adConfig.provider === 'custom') {
    return adConfig.custom.banners[placement]?.enabled ?? false;
  }
  return true;
}

export function getAdConfig(placement) {
  return {
    provider: adConfig.provider,
    placement,
    config: adConfig[adConfig.provider],
  };
}

export default adConfig;
