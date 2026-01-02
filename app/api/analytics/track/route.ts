// app/api/analytics/track/route.ts
// 📊 Analytics Event Tracking Endpoint
// Designed to fail silently - never block user experience

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface AnalyticsEvent {
  event_name: string;
  event_properties?: Record<string, any>;
  page_path?: string;
  user_id?: string;
  session_id?: string;
}

// Helper to safely get Supabase client
function getAnalyticsSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key);
}

export async function POST(req: Request) {
  // Always return success to client - analytics should never block
  const successResponse = NextResponse.json({ success: true });
  
  try {
    // Get Supabase client - if not available, just return success
    const supabase = getAnalyticsSupabase();
    if (!supabase) {
      console.warn('📊 Analytics: Supabase not configured, skipping');
      return successResponse;
    }
    
    let events: AnalyticsEvent[] = [];
    
    // Handle both JSON body and sendBeacon (text body)
    const contentType = req.headers.get('content-type');
    try {
      if (contentType?.includes('application/json')) {
        const body = await req.json();
        events = body.events || [body];
      } else {
        // sendBeacon sends as text/plain
        const text = await req.text();
        const body = JSON.parse(text);
        events = body.events || [body];
      }
    } catch {
      // Invalid JSON - just return success (don't block)
      console.warn('📊 Analytics: Invalid JSON payload');
      return successResponse;
    }
    
    if (!events || events.length === 0) {
      return successResponse;
    }

    // Prepare events for insertion
    const eventsToInsert = events.map(event => ({
      user_id: event.user_id ? String(event.user_id) : null,
      event_name: event.event_name || 'unknown',
      event_properties: event.event_properties || {},
      page_path: event.page_path || null,
      session_id: event.session_id || null,
      created_at: new Date().toISOString(),
    }));

    // Insert events into database
    const { error } = await supabase
      .from('analytics_events')
      .insert(eventsToInsert);

    if (error) {
      // Table doesn't exist or other DB error - log but don't fail
      if (error.code === '42P01') {
        // Table not found - this is expected if migration hasn't run
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Analytics: Table not found, logging to console');
          eventsToInsert.forEach(e => console.log('  →', e.event_name, e.event_properties));
        }
      } else {
        console.warn('📊 Analytics insert warning:', error.code, error.message);
      }
      return successResponse;
    }

    return NextResponse.json({ 
      success: true, 
      stored: true,
      count: eventsToInsert.length 
    });

  } catch (err: any) {
    // Log but don't fail - analytics should never block
    console.warn('📊 Analytics error (non-blocking):', err.message);
    return successResponse;
  }
}

