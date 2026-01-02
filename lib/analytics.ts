// lib/analytics.ts
// 📊 Simple Analytics Tracking Utility
// Privacy-respecting event tracking for metrics

// ============================================
// TYPES
// ============================================

export interface AnalyticsEvent {
  event_name: string;
  event_properties?: Record<string, any>;
  page_path?: string;
  user_id?: string;
  session_id?: string;
}

export type EventName =
  | 'page_view'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'meal_logged'
  | 'meal_deleted'
  | 'vital_logged'
  | 'food_corrected'
  | 'chat_message_sent'
  | 'report_generated'
  | 'data_exported'
  | 'account_deleted'
  | 'goal_set'
  | 'condition_toggled';

// ============================================
// SESSION MANAGEMENT
// ============================================

let cachedSessionId: string | null = null;
let cachedUserId: string | null = null;

/**
 * Get or generate a session ID (stored in sessionStorage)
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  if (cachedSessionId) return cachedSessionId;
  
  let sessionId = sessionStorage.getItem('boleh_makan_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('boleh_makan_session_id', sessionId);
  }
  cachedSessionId = sessionId;
  return sessionId;
}

/**
 * Get user ID from localStorage
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  if (cachedUserId) return cachedUserId;
  
  cachedUserId = localStorage.getItem('boleh_makan_user_id');
  return cachedUserId;
}

/**
 * Set user ID (called during identification)
 */
export function identifyUser(userId: string): void {
  cachedUserId = userId;
  if (typeof window !== 'undefined') {
    localStorage.setItem('boleh_makan_user_id', userId);
  }
  
  // Track identification event
  trackEvent('user_identified', { user_id: userId });
}

// ============================================
// EVENT TRACKING
// ============================================

// Event queue for batching
let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;
const FLUSH_INTERVAL = 2000; // 2 seconds
const MAX_QUEUE_SIZE = 10;

/**
 * Track an analytics event
 */
export function trackEvent(
  eventName: EventName | string,
  properties: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return;
  
  const event: AnalyticsEvent = {
    event_name: eventName,
    event_properties: properties,
    page_path: window.location.pathname,
    user_id: getUserId() || undefined,
    session_id: getSessionId(),
  };
  
  // Add to queue
  eventQueue.push(event);
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', eventName, properties);
  }
  
  // Flush if queue is full
  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    flushEvents();
  } else {
    // Schedule flush
    if (!flushTimeout) {
      flushTimeout = setTimeout(flushEvents, FLUSH_INTERVAL);
    }
  }
}

/**
 * Track a page view
 */
export function trackPageView(pageName: string): void {
  trackEvent('page_view', { page: pageName });
}

/**
 * Flush queued events to the server
 */
async function flushEvents(): Promise<void> {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  
  if (eventQueue.length === 0) return;
  
  // Get events to flush
  const eventsToFlush = [...eventQueue];
  eventQueue = [];
  
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: eventsToFlush }),
    });
    
    if (!response.ok) {
      // Re-add failed events to queue (with limit)
      if (eventQueue.length < MAX_QUEUE_SIZE * 2) {
        eventQueue.unshift(...eventsToFlush);
      }
      console.error('Analytics flush failed:', response.status);
    }
  } catch (error) {
    // Re-add failed events to queue (with limit)
    if (eventQueue.length < MAX_QUEUE_SIZE * 2) {
      eventQueue.unshift(...eventsToFlush);
    }
    console.error('Analytics flush error:', error);
  }
}

/**
 * Force flush all pending events (call on page unload)
 */
export function forceFlush(): void {
  if (eventQueue.length === 0) return;
  
  // Use sendBeacon for reliable delivery on page unload
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const data = JSON.stringify({ events: eventQueue });
    navigator.sendBeacon('/api/analytics/track', data);
    eventQueue = [];
  } else {
    flushEvents();
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Track onboarding started
 */
export function trackOnboardingStarted(): void {
  trackEvent('onboarding_started', {});
}

/**
 * Track onboarding completed
 */
export function trackOnboardingCompleted(goals: string[], conditions: string[]): void {
  trackEvent('onboarding_completed', {
    goal_count: goals.length,
    condition_count: conditions.length,
    has_conditions: conditions.length > 0,
  });
}

/**
 * Track meal logged
 */
export function trackMealLogged(mealType: string, hasImage: boolean, source: string): void {
  trackEvent('meal_logged', {
    meal_type: mealType,
    has_image: hasImage,
    source: source, // 'camera' | 'gallery' | 'text'
  });
}

/**
 * Track meal deleted
 */
export function trackMealDeleted(mealId: string): void {
  trackEvent('meal_deleted', {
    meal_id: mealId,
  });
}

/**
 * Track vital logged
 */
export function trackVitalLogged(vitalType: string, context: string): void {
  trackEvent('vital_logged', {
    vital_type: vitalType,
    context: context,
  });
}

/**
 * Track food name correction (RLHF)
 */
export function trackFoodCorrected(originalName: string, correctedName: string): void {
  trackEvent('food_corrected', {
    was_corrected: originalName.toLowerCase() !== correctedName.toLowerCase(),
  });
}

/**
 * Track chat message sent
 */
export function trackChatMessageSent(): void {
  trackEvent('chat_message_sent', {});
}

/**
 * Track report generated
 */
export function trackReportGenerated(): void {
  trackEvent('report_generated', {});
}

/**
 * Track data exported
 */
export function trackDataExported(): void {
  trackEvent('data_exported', {});
}

/**
 * Track account deleted
 */
export function trackAccountDeleted(): void {
  trackEvent('account_deleted', {});
}

