// app/api/admin/cgm/export/route.ts
// 📊 Admin CGM Waitlist Export API

import { NextRequest, NextResponse } from 'next/server';
import { exportWaitlistCSV } from '@/lib/cgm/waitlist';

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    // const adminUser = await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    
    const csv = await exportWaitlistCSV(tenantId);
    
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=cgm-waitlist-${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error) {
    console.error('Admin CGM export error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


