// app/api/conditions/user/[id]/route.ts
// 🏥 User Condition API - Update and delete individual conditions

import { NextRequest, NextResponse } from 'next/server';
import { updateUserCondition, removeUserCondition } from '@/lib/conditions/queries';
import { UpdateUserConditionInput } from '@/lib/conditions/types';

// PATCH - Update a condition
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json() as UpdateUserConditionInput;

    const result = await updateUserCondition(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User condition PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a condition
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await removeUserCondition(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User condition DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


