// app/api/conditions/user/route.ts
// 🏥 User Conditions API - Get and add user conditions

import { NextRequest, NextResponse } from 'next/server';
import { getUserConditions, addUserCondition, setPrimaryCondition } from '@/lib/conditions/queries';
import { AddUserConditionInput, ConditionCode } from '@/lib/conditions/types';

// GET - Fetch user's conditions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const conditions = await getUserConditions(userId);

    return NextResponse.json({
      success: true,
      conditions,
    });
  } catch (error) {
    console.error('User conditions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add a condition for user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & AddUserConditionInput;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!input.conditionCode) {
      return NextResponse.json(
        { success: false, error: 'Condition code is required' },
        { status: 400 }
      );
    }

    const result = await addUserCondition(userId, input, tenantId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      condition: result.condition,
    }, { status: 201 });
  } catch (error) {
    console.error('User conditions POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


