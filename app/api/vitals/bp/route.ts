// app/api/vitals/bp/route.ts
// 💓 BP Logging API

import { NextRequest, NextResponse } from 'next/server';
import { logBP } from '@/lib/vitals/queries';
import { LogBPInput } from '@/lib/vitals/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & LogBPInput;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (!input.systolicBp || !input.diastolicBp) {
      return NextResponse.json(
        { success: false, error: 'systolicBp and diastolicBp are required' },
        { status: 400 }
      );
    }
    
    // Validate ranges
    if (input.systolicBp < 60 || input.systolicBp > 250) {
      return NextResponse.json(
        { success: false, error: 'Systolic BP must be between 60 and 250 mmHg' },
        { status: 400 }
      );
    }
    
    if (input.diastolicBp < 40 || input.diastolicBp > 150) {
      return NextResponse.json(
        { success: false, error: 'Diastolic BP must be between 40 and 150 mmHg' },
        { status: 400 }
      );
    }
    
    const entry = await logBP(userId, input, tenantId);
    
    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging BP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log blood pressure' },
      { status: 500 }
    );
  }
}


