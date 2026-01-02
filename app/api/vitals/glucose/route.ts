// app/api/vitals/glucose/route.ts
// 💓 Glucose Logging API

import { NextRequest, NextResponse } from 'next/server';
import { logGlucose } from '@/lib/vitals/queries';
import { LogGlucoseInput } from '@/lib/vitals/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & LogGlucoseInput;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (!input.glucoseMmol || !input.glucoseTiming) {
      return NextResponse.json(
        { success: false, error: 'glucoseMmol and glucoseTiming are required' },
        { status: 400 }
      );
    }
    
    // Validate range
    if (input.glucoseMmol < 1 || input.glucoseMmol > 35) {
      return NextResponse.json(
        { success: false, error: 'Glucose must be between 1 and 35 mmol/L' },
        { status: 400 }
      );
    }
    
    const entry = await logGlucose(userId, input, tenantId);
    
    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging glucose:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log glucose' },
      { status: 500 }
    );
  }
}


