// app/api/cgm/waitlist/count/route.ts
// 📊 CGM Waitlist Count API - Get total waitlist count

import { NextRequest, NextResponse } from 'next/server';
import { getWaitlistCount } from '@/lib/cgm/waitlist';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    
    const count = await getWaitlistCount(tenantId);
    
    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', count: 0 },
      { status: 500 }
    );
  }
}


