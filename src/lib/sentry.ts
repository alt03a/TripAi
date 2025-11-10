// Error tracking and monitoring setup
// In production, integrate with services like Sentry, LogRocket, etc.

interface ErrorContext {
  user?: {
    id: string;
    email?: string;
  };
  extra?: Record<string, any>;
  tags?: Record<string, string>;
}

class ErrorTracker {
  private isProduction = import.meta.env.PROD;

  captureError(error: Error, context?: ErrorContext) {
    if (this.isProduction) {
      // TODO: Send to error tracking service (Sentry, etc.)
      console.error('[Error Tracking]', error, context);
    } else {
      console.error('Error:', error, context);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (this.isProduction) {
      // TODO: Send to error tracking service
      console.log(`[${level.toUpperCase()}]`, message, context);
    } else {
      console.log(message, context);
    }
  }

  setUser(user: { id: string; email?: string }) {
    // TODO: Set user context in error tracking service
    if (!this.isProduction) {
      console.log('[Error Tracking] User set:', user);
    }
  }

  clearUser() {
    // TODO: Clear user context in error tracking service
  }
}

export const errorTracker = new ErrorTracker();
