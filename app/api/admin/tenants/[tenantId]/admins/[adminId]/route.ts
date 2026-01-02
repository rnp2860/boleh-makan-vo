// app/api/admin/tenants/[tenantId]/admins/[adminId]/route.ts
// 👥 Individual Tenant Admin API - Update and delete

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// ============================================
// PATCH - Update admin
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; adminId: string }> }
) {
  try {
    const { tenantId, adminId } = await params;
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    const updateData: Record<string, any> = {};
    
    if ('role' in body) updateData.role = body.role;
    if ('display_name' in body) updateData.display_name = body.display_name;
    if ('is_active' in body) updateData.is_active = body.is_active;
    if ('permissions_override' in body) updateData.permissions_override = body.permissions_override;
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tenant_admins')
      .update(updateData)
      .eq('id', adminId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tenant admin:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update admin' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update tenant admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove admin
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; adminId: string }> }
) {
  try {
    const { tenantId, adminId } = await params;
    const supabase = getSupabaseServiceClient();
    
    // Check if this is the last owner
    const { data: admins } = await supabase
      .from('tenant_admins')
      .select('id, role')
      .eq('tenant_id', tenantId)
      .eq('role', 'owner');
    
    const currentAdmin = admins?.find(a => a.id === adminId);
    
    if (currentAdmin?.role === 'owner' && admins && admins.length === 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the last owner of a tenant' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('tenant_admins')
      .delete()
      .eq('id', adminId)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting tenant admin:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to remove admin' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete tenant admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


