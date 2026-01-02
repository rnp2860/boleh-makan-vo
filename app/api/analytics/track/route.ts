// app/api/analytics/track/route.ts
// 📊 Analytics Event Tracking Endpoint

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

interface AnalyticsEvent {
  event_name: string;
  event_properties?: Record<string, any>;
  page_path?: string;
  user_id?: string;
  session_id?: string;
}

export async function POST(req: Request) {
  try {
    let events: AnalyticsEvent[] = [];
    
    // Handle both JSON body and sendBeacon (text body)
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const body = await req.json();
      events = body.events || [body];
    } else {
      // sendBeacon sends as text/plain
      const text = await req.text();
      try {
        const body = JSON.parse(text);
        events = body.events || [body];
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
      }
    }
    
    if (!events || events.length === 0) {
      return NextResponse.json({ success: false, error: 'No events provided' }, { status: 400 });
    }

    // Prepare events for insertion
    const eventsToInsert = events.map(event => ({
      user_id: event.user_id ? String(event.user_id) : null,
      event_name: event.event_name,
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
      // If table doesn't exist, log but don't fail
      if (error.code === '42P01') {
        console.log('📊 Analytics table not found - events logged to console only');
        console.log('📊 Events:', JSON.stringify(eventsToInsert, null, 2));
        return NextResponse.json({ success: true, stored: false, reason: 'table_not_found' });
      }
      
      console.error('📊 Analytics insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      stored: true,
      count: eventsToInsert.length 
    });

  } catch (err: any) {
    console.error('📊 Analytics error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

