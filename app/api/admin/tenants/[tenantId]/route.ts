// app/api/admin/tenants/[tenantId]/route.ts
// 🏢 Tenant Detail API - Get, update, delete individual tenant

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// ============================================
// GET - Get tenant details
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', params.tenantId)
      .single();
    
    if (error || !tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Get tenant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH - Update tenant
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    // Build update object (only include fields that are provided)
    const updateData: Record<string, any> = {};
    
    const allowedFields = [
      'name', 'type', 'status', 'plan',
      'logo_url', 'logo_dark_url', 'favicon_url',
      'primary_color', 'secondary_color', 'accent_color',
      'background_color', 'text_color', 'custom_css',
      'custom_domain', 'subdomain',
      'contact_email', 'support_email', 'billing_email', 'contact_phone',
      'settings', 'default_language', 'supported_languages', 'timezone',
      'trial_ends_at', 'subscription_started_at', 'subscription_ends_at',
    ];
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }
    
    updateData.updated_at = new Date().toISOString();
    
    const { data: tenant, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', params.tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tenant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Update tenant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete tenant
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    
    // Prevent deleting the default tenant
    if (params.tenantId === '00000000-0000-0000-0000-000000000001') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the default tenant' },
        { status: 403 }
      );
    }
    
    // Check if tenant has users
    const { data: usersCount } = await supabase
      .from('user_weekly_goals')
      .select('id', { count: 'exact' })
      .eq('tenant_id', params.tenantId);
    
    if (usersCount && usersCount.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete tenant with active users. Please migrate users first.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', params.tenantId);
    
    if (error) {
      console.error('Error deleting tenant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete tenant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


