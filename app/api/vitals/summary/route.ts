// app/api/vitals/summary/route.ts
// 💓 Vitals Summary API - Get latest vitals for a user

import { NextRequest, NextResponse } from 'next/server';
import { getVitalsSummary } from '@/lib/vitals/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const heightCm = searchParams.get('heightCm');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const summary = await getVitalsSummary(
      userId,
      heightCm ? parseInt(heightCm) : undefined
    );
    
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    console.error('Error fetching vitals summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vitals summary' },
      { status: 500 }
    );
  }
}


