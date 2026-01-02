// app/api/vitals/[id]/route.ts
// 💓 Single Vital Entry API - Delete or Update

import { NextRequest, NextResponse } from 'next/server';
import { deleteVitalsEntry, updateVitalsEntry } from '@/lib/vitals/queries';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    await deleteVitalsEntry(userId, id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting vitals entry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete entry' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, ...updates } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const entry = await updateVitalsEntry(userId, id, updates);
    
    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    console.error('Error updating vitals entry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update entry' },
      { status: 500 }
    );
  }
}


