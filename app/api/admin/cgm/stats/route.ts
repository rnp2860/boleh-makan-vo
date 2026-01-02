// app/api/admin/cgm/stats/route.ts
// 📊 Admin CGM Waitlist Stats API

import { NextRequest, NextResponse } from 'next/server';
import { getWaitlistStats } from '@/lib/cgm/waitlist';

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    // const adminUser = await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    
    const stats = await getWaitlistStats(tenantId);
    
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Admin CGM stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


