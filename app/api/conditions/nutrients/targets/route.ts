// app/api/conditions/nutrients/targets/route.ts
// 🏥 Nutrient Targets API - Get and set nutrient targets

import { NextRequest, NextResponse } from 'next/server';
import { getUserNutrientTargets, setUserNutrientTarget, removeUserNutrientTarget } from '@/lib/conditions/queries';
import { SetUserNutrientTargetInput, NutrientCode } from '@/lib/conditions/types';

// GET - Fetch user's nutrient targets
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

    const targets = await getUserNutrientTargets(userId);

    return NextResponse.json({
      success: true,
      targets,
    });
  } catch (error) {
    console.error('Nutrient targets GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Set a custom nutrient target
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tenantId, ...input } = body as { userId: string; tenantId?: string } & SetUserNutrientTargetInput;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!input.nutrientCode) {
      return NextResponse.json(
        { success: false, error: 'Nutrient code is required' },
        { status: 400 }
      );
    }

    const result = await setUserNutrientTarget(userId, input, tenantId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Nutrient targets POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a custom nutrient target
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const nutrientCode = searchParams.get('nutrientCode') as NutrientCode;

    if (!userId || !nutrientCode) {
      return NextResponse.json(
        { success: false, error: 'User ID and nutrient code are required' },
        { status: 400 }
      );
    }

    const result = await removeUserNutrientTarget(userId, nutrientCode);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Nutrient targets DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


