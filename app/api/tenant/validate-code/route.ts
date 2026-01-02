// app/api/tenant/validate-code/route.ts
// 🎫 Validate Invite Code API - For signup flow

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }
    
    // Find the invite code
    const { data: inviteCode, error: inviteError } = await supabase
      .from('tenant_invite_codes')
      .select(`
        id,
        code,
        max_uses,
        current_uses,
        expires_at,
        is_active,
        tenant_id,
        tenants (
          id,
          slug,
          name,
          logo_url,
          primary_color,
          type,
          status
        )
      `)
      .eq('code', code.toUpperCase())
      .single();
    
    if (inviteError || !inviteCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid invite code' },
        { status: 404 }
      );
    }
    
    // Check if code is active
    if (!inviteCode.is_active) {
      return NextResponse.json(
        { success: false, error: 'This invite code is no longer active' },
        { status: 400 }
      );
    }
    
    // Check if code is expired
    if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This invite code has expired' },
        { status: 400 }
      );
    }
    
    // Check usage limits
    if (inviteCode.max_uses && inviteCode.current_uses >= inviteCode.max_uses) {
      return NextResponse.json(
        { success: false, error: 'This invite code has reached its maximum uses' },
        { status: 400 }
      );
    }
    
    // Check if tenant is active
    const tenant = inviteCode.tenants as any;
    if (!tenant || tenant.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'The organization associated with this code is not available' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        logo_url: tenant.logo_url,
        primary_color: tenant.primary_color,
        type: tenant.type,
      },
    });
  } catch (error) {
    console.error('Validate code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


