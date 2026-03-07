import { getEnv } from './env';

const providers = [];
let initialized = false;

function initDefaultProviders() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const plausibleDomain = getEnv('VITE_PLAUSIBLE_DOMAIN');
  if (plausibleDomain && typeof window.plausible === 'function') {
    registerProvider({
      track(name, properties) {
        window.plausible(name, { props: properties, u: window.location.href, d: plausibleDomain });
      },
    });
  }

  const posthogKey = getEnv('VITE_POSTHOG_KEY');
  if (posthogKey && window.posthog?.capture) {
    registerProvider({
      track(name, properties) {
        window.posthog.capture(name, properties);
      },
    });
  }
}

export function registerProvider(provider) {
  providers.push(provider);
}

export function trackEvent(name, properties = {}) {
  initDefaultProviders();

  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    console.log('[Analytics]', event.name, event.properties);
  }

  for (const provider of providers) {
    try {
      provider.track(event.name, event.properties);
    } catch (e) {
      console.warn('[Analytics] Provider error:', e);
    }
  }
}

export const Events = {
  QUIZ_STARTED: 'quiz_started',
  QUESTION_ANSWERED: 'question_answered',
  QUIZ_COMPLETED: 'quiz_completed',
  REPORT_VIEWED: 'report_viewed',
  PREMIUM_CLICKED: 'premium_clicked',
  PREMIUM_PURCHASED: 'purchase_completed',
  SHARE_CLICKED: 'share_clicked',
  REPORT_DOWNLOADED: 'report_downloaded',
  DEBATE_CREATED: 'debate_created',
  DEBATE_COMPLETED: 'debate_completed',
  ACCOUNT_CREATED: 'account_created',
  PROFILE_VIEWED: 'profile_viewed',
  RESULT_SHARED: 'result_shared',
};
