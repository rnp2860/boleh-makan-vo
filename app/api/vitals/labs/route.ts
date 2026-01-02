// app/api/vitals/labs/route.ts
// 💓 Lab Results Logging API

import { NextRequest, NextResponse } from 'next/server';
import { logLabs } from '@/lib/vitals/queries';
import { LogLabsInput } from '@/lib/vitals/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & LogLabsInput;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (!input.labDate) {
      return NextResponse.json(
        { success: false, error: 'labDate is required' },
        { status: 400 }
      );
    }
    
    // Must have at least one lab value
    const hasValue = input.hba1cPercent || input.ldlMmol || input.hdlMmol || 
                     input.triglyceridesMmol || input.egfr || input.uricAcidUmol ||
                     input.totalCholesterolMmol || input.creatinineUmol;
    
    if (!hasValue) {
      return NextResponse.json(
        { success: false, error: 'At least one lab value is required' },
        { status: 400 }
      );
    }
    
    const entry = await logLabs(userId, input, tenantId);
    
    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging labs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log lab results' },
      { status: 500 }
    );
  }
}


