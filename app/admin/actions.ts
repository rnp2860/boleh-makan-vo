// app/admin/actions.ts
// 🔐 Admin Server Actions

'use server';

import { cookies, headers } from 'next/headers';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { AdminUser, DashboardMetrics } from '@/lib/types/admin';

const ADMIN_SESSION_KEY = 'boleh_makan_admin_session';

/**
 * Get admin user from request
 * This checks both cookie session and a mock userId for development
 */
export async function getAdminFromRequest(): Promise<AdminUser | null> {
  try {
    // Check for admin session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_KEY);
    
    // For development: also check for userId in query params or localStorage simulation
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    
    let targetUserId: string | null = null;

    if (sessionCookie?.value) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        if (new Date(sessionData.expires_at) > new Date()) {
          targetUserId = sessionData.user_id;
        }
      } catch {
        // Invalid session cookie
      }
    }

    // Fallback: For development, check if user exists in admin_users table
    if (!targetUserId && userId) {
      targetUserId = userId;
    }

    if (!targetUserId) {
      // For development without proper auth, try to get first admin
      const supabase = getSupabaseServiceClient();
      const { data: firstAdmin } = await supabase
        .from('admin_users')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (firstAdmin) {
        return firstAdmin as AdminUser;
      }
      return null;
    }

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    // Update last activity
    await supabase
      .from('admin_users')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', data.id);

    return data as AdminUser;
  } catch (err) {
    console.error('Error getting admin from request:', err);
    return null;
  }
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = getSupabaseServiceClient();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Get user counts
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  // Active users today (users who logged food today)
  const { count: activeToday } = await supabase
    .from('food_logs')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', today);

  // Active users this week
  const { data: activeWeekData } = await supabase
    .from('food_logs')
    .select('user_id')
    .gte('created_at', weekAgo);
  const activeWeek = new Set(activeWeekData?.map(d => d.user_id) || []).size;

  // Active users this month
  const { data: activeMonthData } = await supabase
    .from('food_logs')
    .select('user_id')
    .gte('created_at', monthAgo);
  const activeMonth = new Set(activeMonthData?.map(d => d.user_id) || []).size;

  // New users today
  const { count: newToday } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  // New users this week
  const { count: newWeek } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo);

  // New users this month
  const { count: newMonth } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthAgo);

  // Meals logged
  const { count: mealsToday } = await supabase
    .from('food_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  const { count: mealsWeek } = await supabase
    .from('food_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo);

  const { count: mealsMonth } = await supabase
    .from('food_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthAgo);

  // Vitals logged today
  const { count: vitalsToday } = await supabase
    .from('user_vitals')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  // Average glucose (last 7 days)
  const { data: glucoseData } = await supabase
    .from('user_vitals')
    .select('reading_value')
    .eq('vital_type', 'glucose')
    .gte('created_at', weekAgo);

  const avgGlucose = glucoseData && glucoseData.length > 0
    ? glucoseData.reduce((sum, d) => sum + d.reading_value, 0) / glucoseData.length
    : null;

  // Calculate growth rate (week over week)
  const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { count: prevWeekUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', prevWeekStart)
    .lt('created_at', weekAgo);

  const growthRate = prevWeekUsers && prevWeekUsers > 0
    ? Math.round((((newWeek || 0) - prevWeekUsers) / prevWeekUsers) * 100)
    : 0;

  // Analytics events (AI queries approximation)
  const { count: aiQueries } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'meal_logged')
    .gte('created_at', today);

  const { count: aiQueriesWeek } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'meal_logged')
    .gte('created_at', weekAgo);

  // Estimated AI costs (rough estimate: $0.01 per query)
  const costPerQuery = 0.01;
  const estimatedCostToday = (aiQueries || 0) * costPerQuery;
  const estimatedCostMonth = (aiQueriesWeek || 0) * 4 * costPerQuery;

  return {
    users: {
      total: totalUsers || 0,
      active_today: activeToday || 0,
      active_week: activeWeek,
      active_month: activeMonth,
      new_today: newToday || 0,
      new_week: newWeek || 0,
      new_month: newMonth || 0,
      growth_rate: growthRate,
    },
    meals: {
      logged_today: mealsToday || 0,
      logged_week: mealsWeek || 0,
      logged_month: mealsMonth || 0,
      avg_per_user: totalUsers && totalUsers > 0 ? Math.round((mealsMonth || 0) / totalUsers) : 0,
    },
    ai: {
      queries_today: aiQueries || 0,
      queries_week: aiQueriesWeek || 0,
      tokens_today: (aiQueries || 0) * 500, // Estimated tokens per query
      estimated_cost_today: estimatedCostToday,
      estimated_cost_month: estimatedCostMonth,
    },
    vitals: {
      logged_today: vitalsToday || 0,
      avg_glucose: avgGlucose ? Math.round(avgGlucose * 10) / 10 : null,
      alerts_triggered: 0, // TODO: Implement alerts tracking
    },
    engagement: {
      onboarding_completion_rate: 85, // TODO: Calculate from actual data
      day7_retention_rate: 45, // TODO: Calculate from actual data
      day30_retention_rate: 25, // TODO: Calculate from actual data
      avg_session_duration: 5.2, // TODO: Calculate from analytics
    },
  };
}

/**
 * Get recent activity for dashboard
 */
export async function getRecentActivity(limit: number = 10) {
  const supabase = getSupabaseServiceClient();

  const { data: recentMeals } = await supabase
    .from('food_logs')
    .select('id, user_id, food_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data: recentVitals } = await supabase
    .from('user_vitals')
    .select('id, user_id, vital_type, reading_value, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  // Combine and sort
  const activities = [
    ...(recentMeals || []).map(m => ({
      type: 'meal' as const,
      id: m.id,
      user_id: m.user_id,
      description: `Logged: ${m.food_name}`,
      timestamp: m.created_at,
    })),
    ...(recentVitals || []).map(v => ({
      type: 'vital' as const,
      id: v.id,
      user_id: v.user_id,
      description: `${v.vital_type}: ${v.reading_value}`,
      timestamp: v.created_at,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
   .slice(0, limit);

  return activities;
}

/**
 * Get top foods logged
 */
export async function getTopFoods(limit: number = 10) {
  const supabase = getSupabaseServiceClient();

  const { data } = await supabase
    .from('food_logs')
    .select('food_name, category')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (!data) return [];

  // Count occurrences
  const counts: Record<string, { count: number; category: string }> = {};
  data.forEach(d => {
    const name = d.food_name || 'Unknown';
    if (!counts[name]) {
      counts[name] = { count: 0, category: d.category || 'Other' };
    }
    counts[name].count++;
  });

  // Sort and return top N
  return Object.entries(counts)
    .map(([food_name, { count, category }]) => ({ food_name, count, category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get user growth data for charts
 */
export async function getUserGrowthData(days: number = 30) {
  const supabase = getSupabaseServiceClient();
  const data: { date: string; total_users: number; new_users: number; active_users: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const nextDateStr = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // New users on this day
    const { count: newUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr)
      .lt('created_at', nextDateStr);

    // Active users on this day
    const { data: activeData } = await supabase
      .from('food_logs')
      .select('user_id')
      .gte('created_at', dateStr)
      .lt('created_at', nextDateStr);

    const activeUsers = new Set(activeData?.map(d => d.user_id) || []).size;

    // Total users up to this day
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', nextDateStr);

    data.push({
      date: dateStr,
      total_users: totalUsers || 0,
      new_users: newUsers || 0,
      active_users: activeUsers,
    });
  }

  return data;
}

