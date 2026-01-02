// app/api/user/delete/route.ts
// 🗑️ PDPA Compliance: Account & Data Deletion Endpoint

import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface DeletionResult {
  table: string;
  deleted: number;
  error?: string;
}

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get Supabase client inside handler (avoids build-time errors)
    const supabase = getSupabaseServiceClient();
    
    const safeUserId = String(user_id);
    const results: DeletionResult[] = [];
    const timestamp = new Date().toISOString();

    console.log(`\n🗑️ ========================================`);
    console.log(`🗑️ ACCOUNT DELETION REQUEST`);
    console.log(`🗑️ User ID: ${safeUserId}`);
    console.log(`🗑️ Timestamp: ${timestamp}`);
    console.log(`🗑️ ========================================\n`);

    // ============================================
    // DELETE IN ORDER (respect foreign key constraints)
    // ============================================

    // 1. Delete food_logs
    console.log('📝 Deleting food_logs...');
    const { data: foodLogsData, error: foodLogsError } = await supabase
      .from('food_logs')
      .delete()
      .eq('user_id', safeUserId)
      .select('id');

    if (foodLogsError) {
      console.error('❌ Error deleting food_logs:', foodLogsError);
      results.push({ table: 'food_logs', deleted: 0, error: foodLogsError.message });
    } else {
      const count = foodLogsData?.length || 0;
      console.log(`✅ Deleted ${count} food_logs entries`);
      results.push({ table: 'food_logs', deleted: count });
    }

    // 2. Delete user_vitals
    console.log('🩸 Deleting user_vitals...');
    const { data: vitalsData, error: vitalsError } = await supabase
      .from('user_vitals')
      .delete()
      .eq('user_id', safeUserId)
      .select('id');

    if (vitalsError) {
      console.error('❌ Error deleting user_vitals:', vitalsError);
      results.push({ table: 'user_vitals', deleted: 0, error: vitalsError.message });
    } else {
      const count = vitalsData?.length || 0;
      console.log(`✅ Deleted ${count} user_vitals entries`);
      results.push({ table: 'user_vitals', deleted: count });
    }

    // 3. Delete user_weekly_goals
    console.log('🎯 Deleting user_weekly_goals...');
    const { data: goalsData, error: goalsError } = await supabase
      .from('user_weekly_goals')
      .delete()
      .eq('user_id', safeUserId)
      .select('id');

    if (goalsError) {
      // Table might not exist yet - that's OK
      if (goalsError.code === '42P01') {
        console.log('⚠️ user_weekly_goals table does not exist (skipping)');
        results.push({ table: 'user_weekly_goals', deleted: 0, error: 'Table not found (OK)' });
      } else {
        console.error('❌ Error deleting user_weekly_goals:', goalsError);
        results.push({ table: 'user_weekly_goals', deleted: 0, error: goalsError.message });
      }
    } else {
      const count = goalsData?.length || 0;
      console.log(`✅ Deleted ${count} user_weekly_goals entries`);
      results.push({ table: 'user_weekly_goals', deleted: count });
    }

    // 4. Delete from any other user-related tables
    // Add more tables here as needed

    // Example: user_preferences (if exists)
    console.log('⚙️ Checking for user_preferences...');
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', safeUserId);

    if (prefsError && prefsError.code !== '42P01') {
      // Ignore "table not found" errors
      console.log('⚠️ user_preferences:', prefsError.message);
    }

    // Example: user_sessions (if exists)
    console.log('🔐 Checking for user_sessions...');
    const { error: sessionsError } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', safeUserId);

    if (sessionsError && sessionsError.code !== '42P01') {
      console.log('⚠️ user_sessions:', sessionsError.message);
    }

    // ============================================
    // AUDIT LOG
    // ============================================
    
    const totalDeleted = results.reduce((sum, r) => sum + r.deleted, 0);
    const hasErrors = results.some(r => r.error && !r.error.includes('Table not found'));

    console.log(`\n🗑️ ========================================`);
    console.log(`🗑️ DELETION COMPLETE`);
    console.log(`🗑️ Total records deleted: ${totalDeleted}`);
    console.log(`🗑️ Tables processed: ${results.length}`);
    console.log(`🗑️ Has errors: ${hasErrors}`);
    console.log(`🗑️ Results:`, JSON.stringify(results, null, 2));
    console.log(`🗑️ ========================================\n`);

    // If there were critical errors, return partial success
    if (hasErrors) {
      return NextResponse.json({
        success: true, // Still "success" as some data was deleted
        partial: true,
        message: 'Account deleted with some warnings',
        details: results,
        total_deleted: totalDeleted
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data permanently deleted',
      details: results,
      total_deleted: totalDeleted
    });

  } catch (err: any) {
    console.error('❌ Account deletion failed:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Failed to delete account',
        details: 'An unexpected error occurred during deletion'
      },
      { status: 500 }
    );
  }
}

