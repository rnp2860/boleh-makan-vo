// app/api/conditions/types/route.ts
// 🏥 Condition Types API - Get available condition types

import { NextRequest, NextResponse } from 'next/server';
import { getConditionTypes, getConditionTypesByCategory } from '@/lib/conditions/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get('grouped') === 'true';

    if (grouped) {
      const conditionsByCategory = await getConditionTypesByCategory();
      return NextResponse.json({
        success: true,
        conditionsByCategory,
      });
    }

    const types = await getConditionTypes();

    return NextResponse.json({
      success: true,
      types,
    });
  } catch (error) {
    console.error('Condition types API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


