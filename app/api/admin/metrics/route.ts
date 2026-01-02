// app/api/admin/metrics/route.ts
// 📊 Admin Dashboard Metrics API

import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseServiceClient();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Parallel fetch all metrics
    const [
      totalUsersResult,
      activeTodayResult,
      newTodayResult,
      newWeekResult,
      mealsTodayResult,
      mealsWeekResult,
      vitalsTodayResult,
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('food_logs').select('user_id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('food_logs').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('food_logs').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('user_vitals').select('*', { count: 'exact', head: true }).gte('created_at', today),
    ]);

    const metrics = {
      users: {
        total: totalUsersResult.count || 0,
        active_today: activeTodayResult.count || 0,
        new_today: newTodayResult.count || 0,
        new_week: newWeekResult.count || 0,
      },
      meals: {
        logged_today: mealsTodayResult.count || 0,
        logged_week: mealsWeekResult.count || 0,
      },
      vitals: {
        logged_today: vitalsTodayResult.count || 0,
      },
      timestamp: now.toISOString(),
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

