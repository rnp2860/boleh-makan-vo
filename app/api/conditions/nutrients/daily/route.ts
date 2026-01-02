// app/api/conditions/nutrients/daily/route.ts
// 🏥 Daily Nutrient Summary API

import { NextRequest, NextResponse } from 'next/server';
import { getDailyNutrientSummary, getDailyNutrientSummaries } from '@/lib/conditions/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Single day query
    if (date) {
      const summary = await getDailyNutrientSummary(userId, date);
      
      return NextResponse.json({
        success: true,
        summary,
      });
    }

    // Date range query
    if (startDate && endDate) {
      const summaries = await getDailyNutrientSummaries(userId, startDate, endDate);
      
      return NextResponse.json({
        success: true,
        summaries,
      });
    }

    // Default to today
    const today = new Date().toISOString().split('T')[0];
    const summary = await getDailyNutrientSummary(userId, today);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Daily nutrients GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


