// Analytics utility — logs to console by default
// Structure supports PostHog, Plausible, or Google Analytics integration

const providers = [];

export function registerProvider(provider) {
  providers.push(provider);
}

export function trackEvent(name, properties = {}) {
  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  // Console logging for development
  if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    console.log('[Analytics]', event.name, event.properties);
  }

  // Forward to registered providers
  for (const provider of providers) {
    try {
      provider.track(event.name, event.properties);
    } catch (e) {
      console.warn('[Analytics] Provider error:', e);
    }
  }
}

// Pre-defined events
export const Events = {
  QUIZ_STARTED: 'quiz_started',
  QUESTION_ANSWERED: 'question_answered',
  QUIZ_COMPLETED: 'quiz_completed',
  PREMIUM_CLICKED: 'premium_clicked',
  PREMIUM_PURCHASED: 'premium_purchased',
  SHARE_CLICKED: 'share_clicked',
  REPORT_DOWNLOADED: 'report_downloaded',
  DEBATE_CREATED: 'debate_created',
  DEBATE_COMPLETED: 'debate_completed',
  ACCOUNT_CREATED: 'account_created',
  PROFILE_VIEWED: 'profile_viewed',
  RESULT_SHARED: 'result_shared',
};
