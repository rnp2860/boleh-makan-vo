// app/api/admin/tenants/[tenantId]/admins/route.ts
// 👥 Tenant Admins API - Manage tenant administrators

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// ============================================
// GET - List admins for tenant
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    
    const { data, error } = await supabase
      .from('tenant_admins')
      .select('*')
      .eq('tenant_id', params.tenantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tenant admins:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch admins' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Tenant admins API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Invite new admin
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    if (!body.email || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Email and role are required' },
        { status: 400 }
      );
    }
    
    // Check if admin already exists for this tenant
    const { data: existing } = await supabase
      .from('tenant_admins')
      .select('id')
      .eq('tenant_id', params.tenantId)
      .eq('email', body.email.toLowerCase())
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already an admin for this tenant' },
        { status: 409 }
      );
    }
    
    // Create admin invite
    // In a real app, you'd also send an email invitation
    const { data, error } = await supabase
      .from('tenant_admins')
      .insert({
        tenant_id: params.tenantId,
        user_id: `pending_${Date.now()}`, // Temporary until user accepts
        email: body.email.toLowerCase(),
        display_name: body.display_name || null,
        role: body.role,
        invited_by: body.invited_by || null,
        invited_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tenant admin:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to invite admin' },
        { status: 500 }
      );
    }
    
    // TODO: Send invitation email
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Create tenant admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


