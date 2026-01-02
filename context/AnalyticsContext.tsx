// context/AnalyticsContext.tsx
// 📊 Analytics Provider - Wraps app for automatic tracking

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
// PROVIDER
// ============================================

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Initialize session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize session ID
      getSessionId();
      
      // Track initial page view
      trackPageView(pathname);
      
      // Setup beforeunload to flush events
      const handleBeforeUnload = () => {
        forceFlush();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  // Context value
  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    sessionId: typeof window !== 'undefined' ? getSessionId() : null,
    userId: typeof window !== 'undefined' ? getUserId() : null,
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

