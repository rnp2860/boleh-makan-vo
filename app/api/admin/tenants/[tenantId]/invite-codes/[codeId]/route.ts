// app/api/admin/tenants/[tenantId]/invite-codes/[codeId]/route.ts
// 🎫 Individual Invite Code API - Update and delete

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// ============================================
// PATCH - Update invite code
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; codeId: string }> }
) {
  try {
    const { tenantId, codeId } = await params;
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    const updateData: Record<string, any> = {};
    
    if ('description' in body) updateData.description = body.description;
    if ('max_uses' in body) updateData.max_uses = body.max_uses;
    if ('expires_at' in body) updateData.expires_at = body.expires_at;
    if ('is_active' in body) updateData.is_active = body.is_active;
    if ('assigned_role' in body) updateData.assigned_role = body.assigned_role;
    if ('metadata' in body) updateData.metadata = body.metadata;
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tenant_invite_codes')
      .update(updateData)
      .eq('id', codeId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating invite code:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update invite code' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update invite code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete invite code
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; codeId: string }> }
) {
  try {
    const { tenantId, codeId } = await params;
    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase
      .from('tenant_invite_codes')
      .delete()
      .eq('id', codeId)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting invite code:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete invite code' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invite code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


