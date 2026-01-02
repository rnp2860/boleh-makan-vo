// app/api/user/export/route.ts
// 📦 PDPA Compliance: Data Export Endpoint

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const safeUserId = String(userId);
    const exportDate = new Date().toISOString();

    console.log(`📦 ========================================`);
    console.log(`📦 DATA EXPORT REQUEST`);
    console.log(`📦 User ID: ${safeUserId}`);
    console.log(`📦 Timestamp: ${exportDate}`);
    console.log(`📦 ========================================\n`);

    // ============================================
    // FETCH ALL USER DATA
    // ============================================

    // 1. Fetch food_logs
    console.log('🍽️ Fetching food_logs...');
    const { data: foodLogs, error: foodLogsError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', safeUserId)
      .order('created_at', { ascending: false });

    if (foodLogsError) {
      console.error('❌ Error fetching food_logs:', foodLogsError);
    } else {
      console.log(`✅ Found ${foodLogs?.length || 0} food_logs entries`);
    }

    // 2. Fetch user_vitals
    console.log('🩸 Fetching user_vitals...');
    const { data: vitals, error: vitalsError } = await supabase
      .from('user_vitals')
      .select('*')
      .eq('user_id', safeUserId)
      .order('measured_at', { ascending: false });

    if (vitalsError) {
      console.error('❌ Error fetching user_vitals:', vitalsError);
    } else {
      console.log(`✅ Found ${vitals?.length || 0} user_vitals entries`);
    }

    // 3. Fetch user_weekly_goals
    console.log('🎯 Fetching user_weekly_goals...');
    let healthGoals: any[] = [];
    const { data: goals, error: goalsError } = await supabase
      .from('user_weekly_goals')
      .select('*')
      .eq('user_id', safeUserId)
      .order('created_at', { ascending: false });

    if (goalsError) {
      // Table might not exist - that's OK
      if (goalsError.code === '42P01') {
        console.log('⚠️ user_weekly_goals table does not exist (skipping)');
      } else {
        console.error('❌ Error fetching user_weekly_goals:', goalsError);
      }
    } else {
      healthGoals = goals || [];
      console.log(`✅ Found ${healthGoals.length} user_weekly_goals entries`);
    }

    // ============================================
    // CALCULATE METADATA
    // ============================================

    const allDates: Date[] = [];

    // Collect dates from food_logs
    if (foodLogs) {
      foodLogs.forEach(log => {
        if (log.created_at) allDates.push(new Date(log.created_at));
      });
    }

    // Collect dates from vitals
    if (vitals) {
      vitals.forEach(vital => {
        if (vital.measured_at) allDates.push(new Date(vital.measured_at));
        if (vital.created_at) allDates.push(new Date(vital.created_at));
      });
    }

    // Collect dates from goals
    if (healthGoals) {
      healthGoals.forEach(goal => {
        if (goal.created_at) allDates.push(new Date(goal.created_at));
      });
    }

    // Sort dates
    allDates.sort((a, b) => a.getTime() - b.getTime());

    const firstActivity = allDates.length > 0 
      ? allDates[0].toISOString().split('T')[0] 
      : null;
    const lastActivity = allDates.length > 0 
      ? allDates[allDates.length - 1].toISOString().split('T')[0] 
      : null;

    // ============================================
    // BUILD EXPORT OBJECT
    // ============================================

    const exportData = {
      export_date: exportDate,
      user_id: safeUserId,
      data: {
        food_logs: foodLogs || [],
        vitals: vitals || [],
        health_goals: healthGoals,
      },
      metadata: {
        total_meals_logged: foodLogs?.length || 0,
        total_vitals_logged: vitals?.length || 0,
        total_health_goals: healthGoals.length,
        first_activity: firstActivity,
        last_activity: lastActivity,
        export_version: '1.0',
        platform: 'Boleh Makan Intelligence',
      },
      pdpa_notice: {
        statement: 'This export contains all your personal data stored by Boleh Makan Intelligence.',
        compliance: 'PDPA 2010 (Malaysia Personal Data Protection Act)',
        rights: [
          'Right to access personal data',
          'Right to correct personal data',
          'Right to withdraw consent',
          'Right to request deletion',
        ],
        contact: 'For data inquiries, contact: privacy@bolehmakan.ai',
      },
    };

    console.log(`\n📦 ========================================`);
    console.log(`📦 EXPORT COMPLETE`);
    console.log(`📦 Total records: ${(foodLogs?.length || 0) + (vitals?.length || 0) + healthGoals.length}`);
    console.log(`📦 ========================================\n`);

    return NextResponse.json(exportData);

  } catch (err: any) {
    console.error('❌ Data export failed:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Failed to export data',
      },
      { status: 500 }
    );
  }
}

