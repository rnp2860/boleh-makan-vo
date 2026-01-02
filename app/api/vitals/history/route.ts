// app/api/vitals/history/route.ts
// 💓 Vitals History API

import { NextRequest, NextResponse } from 'next/server';
import { getVitalsHistory } from '@/lib/vitals/queries';
import { VitalsHistoryFilter, VitalType } from '@/lib/vitals/types';

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
    
    const filter: VitalsHistoryFilter = {};
    
    const vitalType = searchParams.get('vitalType');
    if (vitalType && ['bp', 'weight', 'glucose', 'labs'].includes(vitalType)) {
      filter.vitalType = vitalType as VitalType;
    }
    
    const startDate = searchParams.get('startDate');
    if (startDate) filter.startDate = startDate;
    
    const endDate = searchParams.get('endDate');
    if (endDate) filter.endDate = endDate;
    
    const limit = searchParams.get('limit');
    if (limit) filter.limit = parseInt(limit);
    
    const offset = searchParams.get('offset');
    if (offset) filter.offset = parseInt(offset);
    
    const entries = await getVitalsHistory(userId, filter);
    
    return NextResponse.json({ success: true, entries });
  } catch (error: any) {
    console.error('Error fetching vitals history:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vitals history' },
      { status: 500 }
    );
  }
}


