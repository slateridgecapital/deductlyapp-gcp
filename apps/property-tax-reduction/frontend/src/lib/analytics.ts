type GtagEvent = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>
) => void;

declare global {
  interface Window {
    gtag?: GtagEvent;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackConversionSignup() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion_event_signup", {
      event_timeout: 2000,
    });
  }
}
