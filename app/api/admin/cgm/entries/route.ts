// app/api/admin/cgm/entries/route.ts
// 📊 Admin CGM Waitlist Entries API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    // const adminUser = await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const status = searchParams.get('status');
    
    const supabase = getSupabaseServiceClient();
    
    let query = supabase
      .from('cgm_waitlist')
      .select('*')
      .order('queue_position', { ascending: true })
      .order('queue_boost', { ascending: false });
    
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error('Failed to fetch entries:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch entries' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      entries: data,
    });
  } catch (error) {
    console.error('Admin CGM entries error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


