// context/AnalyticsContext.tsx
// 📊 Analytics Provider - Wraps app for automatic tracking
// Designed to fail silently - never block user experience

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { 
  trackPageView, 
  getSessionId, 
  getUserId, 
  forceFlush,
  trackEvent 
} from '@/lib/analytics';

// ============================================
// CONTEXT
// ============================================

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (pageName: string) => void;
  sessionId: string | null;
  userId: string | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// ============================================
// SAFE WRAPPERS (never throw)
// ============================================

function safeTrackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    trackEvent(eventName, properties || {});
  } catch (e) {
    // Silent fail - analytics should never block
  }
}

function safeTrackPageView(pageName: string) {
  try {
    trackPageView(pageName);
  } catch (e) {
    // Silent fail
  }
}

function safeGetSessionId(): string | null {
  try {
    return getSessionId();
  } catch (e) {
    return null;
  }
}

function safeGetUserId(): string | null {
  try {
    return getUserId();
  } catch (e) {
    return null;
  }
}

// ============================================
// PROVIDER
// ============================================

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Initialize session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Initialize session ID
        safeGetSessionId();
        
        // Track initial page view
        safeTrackPageView(pathname);
        
        // Setup beforeunload to flush events
        const handleBeforeUnload = () => {
          try {
            forceFlush();
          } catch (e) {
            // Silent fail
          }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      } catch (e) {
        // Silent fail - don't let analytics break the app
      }
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      safeTrackPageView(pathname);
    }
  }, [pathname]);

  // Context value with safe wrappers
  const value: AnalyticsContextType = {
    trackEvent: safeTrackEvent,
    trackPageView: safeTrackPageView,
    sessionId: typeof window !== 'undefined' ? safeGetSessionId() : null,
    userId: typeof window !== 'undefined' ? safeGetUserId() : null,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    // Return no-op functions if outside provider (for server components)
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      sessionId: null,
      userId: null,
    };
  }
  return context;
}

