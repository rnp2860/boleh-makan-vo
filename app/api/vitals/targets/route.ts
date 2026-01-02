// app/api/vitals/targets/route.ts
// 💓 Vital Targets API

import { NextRequest, NextResponse } from 'next/server';
import { getVitalTargets, updateVitalTargets } from '@/lib/vitals/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const targets = await getVitalTargets(userId);
    
    return NextResponse.json({ success: true, targets });
  } catch (error: any) {
    console.error('Error fetching vital targets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vital targets' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const targets = await updateVitalTargets(userId, input, tenantId);
    
    return NextResponse.json({ success: true, targets });
  } catch (error: any) {
    console.error('Error updating vital targets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update vital targets' },
      { status: 500 }
    );
  }
}


