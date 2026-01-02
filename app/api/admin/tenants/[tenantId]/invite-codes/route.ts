// app/api/admin/tenants/[tenantId]/invite-codes/route.ts
// 🎫 Invite Codes API - Manage tenant invite codes

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// ============================================
// GET - List invite codes for tenant
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    
    const { data, error } = await supabase
      .from('tenant_invite_codes')
      .select('*')
      .eq('tenant_id', params.tenantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invite codes:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch invite codes' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Invite codes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new invite code
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    if (!body.code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }
    
    // Check if code already exists
    const { data: existing } = await supabase
      .from('tenant_invite_codes')
      .select('id')
      .eq('code', body.code.toUpperCase())
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An invite code with this value already exists' },
        { status: 409 }
      );
    }
    
    const { data, error } = await supabase
      .from('tenant_invite_codes')
      .insert({
        tenant_id: params.tenantId,
        code: body.code.toUpperCase(),
        description: body.description || null,
        max_uses: body.max_uses || null,
        expires_at: body.expires_at || null,
        assigned_role: body.assigned_role || null,
        metadata: body.metadata || {},
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invite code:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create invite code' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Create invite code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


