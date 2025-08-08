export function trackEvent(eventName: string, data?: any) {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(eventName, data);
  }
}

// Specific tracking functions
export function trackDomainInquiry(domain: string) {
  trackEvent('domain-inquiry', { domain });
}

export function trackEmailSignup(domain: string) {
  trackEvent('email-signup', { domain });
}

export function trackCTAClick(button: string, domain: string) {
  trackEvent('cta-click', { button, domain });
}