// app/api/vitals/weight/route.ts
// 💓 Weight Logging API

import { NextRequest, NextResponse } from 'next/server';
import { logWeight } from '@/lib/vitals/queries';
import { LogWeightInput } from '@/lib/vitals/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & LogWeightInput;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (!input.weightKg) {
      return NextResponse.json(
        { success: false, error: 'weightKg is required' },
        { status: 400 }
      );
    }
    
    // Validate range
    if (input.weightKg < 20 || input.weightKg > 300) {
      return NextResponse.json(
        { success: false, error: 'Weight must be between 20 and 300 kg' },
        { status: 400 }
      );
    }
    
    const entry = await logWeight(userId, input, tenantId);
    
    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging weight:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log weight' },
      { status: 500 }
    );
  }
}


