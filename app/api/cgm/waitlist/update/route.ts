// app/api/cgm/waitlist/update/route.ts
// 📊 CGM Waitlist Update API - Update user preferences

import { NextRequest, NextResponse } from 'next/server';
import { updateWaitlistPreferences } from '@/lib/cgm/waitlist';
import { WaitlistUpdateRequest } from '@/lib/cgm/types';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');
    
    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json() as WaitlistUpdateRequest;
    
    const result = await updateWaitlistPreferences(entryId, body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


