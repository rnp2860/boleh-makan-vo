// app/api/conditions/user/primary/route.ts
// 🏥 Set Primary Condition API

import { NextRequest, NextResponse } from 'next/server';
import { setPrimaryCondition } from '@/lib/conditions/queries';
import { ConditionCode } from '@/lib/conditions/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, conditionCode } = body as { userId: string; conditionCode: ConditionCode };

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!conditionCode) {
      return NextResponse.json(
        { success: false, error: 'Condition code is required' },
        { status: 400 }
      );
    }

    const result = await setPrimaryCondition(userId, conditionCode);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set primary condition error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


