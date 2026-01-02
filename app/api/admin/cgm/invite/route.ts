// app/api/admin/cgm/invite/route.ts
// 📊 Admin CGM Waitlist Invite to Beta API

import { NextRequest, NextResponse } from 'next/server';
import { inviteToBeta } from '@/lib/cgm/waitlist';

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    // const adminUser = await requireAdminAuth();
    
    const { entryIds } = await request.json();
    
    if (!entryIds || !Array.isArray(entryIds) || entryIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Entry IDs are required' },
        { status: 400 }
      );
    }
    
    const result = await inviteToBeta(entryIds);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      invitedCount: result.invitedCount,
    });
  } catch (error) {
    console.error('Admin CGM invite error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


