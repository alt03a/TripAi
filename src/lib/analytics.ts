// Analytics and monitoring utilities

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isProduction = import.meta.env.PROD;

  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // In production, send to analytics service
    if (this.isProduction) {
      // TODO: Integrate with analytics provider (Mixpanel, GA4, etc.)
      this.sendToAnalytics(event);
    } else {
      console.log('[Analytics]', event);
    }
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Placeholder for analytics integration
    // Could use fetch to send to analytics endpoint
  }

  // Page view tracking
  trackPageView(path: string) {
    this.track('page_view', { path });
  }

  // User action tracking
  trackUserAction(action: string, details?: Record<string, any>) {
    this.track('user_action', { action, ...details });
  }

  // Error tracking
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance', { metric, value, unit });
  }
}

export const analytics = new Analytics();

// Performance monitoring
export const measurePerformance = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  analytics.trackPerformance(label, duration);
  return duration;
};

export const measureAsyncPerformance = async (label: string, fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  const duration = performance.now() - start;
  analytics.trackPerformance(label, duration);
  return duration;
};
