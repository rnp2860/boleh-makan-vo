// app/api/admin/tenants/route.ts
// 🏢 Tenant Management API - List and create tenants

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { TenantCreateRequest } from '@/lib/types/tenant';

// ============================================
// GET - List all tenants
// ============================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('tenants')
      .select('id, slug, name, type, status, logo_url, user_count, plan, created_at')
      .order('created_at', { ascending: false });
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tenants:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tenants' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Tenants API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new tenant
// ============================================

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.contact_email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, contact_email' },
        { status: 400 }
      );
    }
    
    // Check if slug is unique
    const { data: existing } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', body.slug.toLowerCase())
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A tenant with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Calculate trial end date if plan is trial
    let trialEndsAt = null;
    if (body.plan === 'trial') {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14); // 14 day trial
      trialEndsAt = trialEnd.toISOString();
    }
    
    // Create tenant
    const { data: tenant, error } = await supabase
      .from('tenants')
      .insert({
        name: body.name,
        slug: body.slug.toLowerCase(),
        type: body.type || 'corporate',
        status: body.plan === 'trial' ? 'trial' : 'active',
        plan: body.plan || 'trial',
        logo_url: body.logo_url || null,
        primary_color: body.primary_color || '#10B981',
        secondary_color: body.secondary_color || '#059669',
        accent_color: body.accent_color || '#F59E0B',
        custom_domain: body.custom_domain || null,
        subdomain: body.subdomain || null,
        contact_email: body.contact_email,
        support_email: body.support_email || body.contact_email,
        billing_email: body.billing_email || body.contact_email,
        settings: body.settings || {
          features: {
            ai_enabled: true,
            ramadan_mode: true,
            cgm_integration: false,
            export_enabled: true,
            voice_logging: true,
            custom_foods: true,
            reports: true,
            vitals_tracking: true,
          },
          limits: {
            max_users: null,
            ai_queries_per_day: 50,
            storage_gb: 10,
            data_retention_days: 365,
          },
          onboarding: {
            required_fields: ['age', 'diabetes_type'],
            skip_allowed: false,
            custom_welcome_message: null,
          },
          notifications: {
            email_enabled: true,
            push_enabled: true,
            sms_enabled: false,
          },
          privacy: {
            anonymized_analytics: false,
            data_sharing_allowed: true,
          },
        },
        trial_ends_at: trialEndsAt,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tenant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create tenant' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: tenant }, { status: 201 });
  } catch (error) {
    console.error('Create tenant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


