// lib/streakCalculator.ts
// 🔥 Daily Logging Streak Calculator

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// TYPES
// ============================================

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
  isNewRecord: boolean;
  streakIncreased: boolean;
  isMilestone: boolean;
  milestoneValue?: number;
}

export interface UserStreakData {
  current_streak: number;
  longest_streak: number;
  last_log_date: string | null;
  streak_updated_at: string | null;
}

// Milestone values that trigger celebration
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get date string in YYYY-MM-DD format
 */
function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get yesterday's date string
 */
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday);
}

/**
 * Get today's date string
 */
function getTodayString(): string {
  return getDateString(new Date());
}

/**
 * Check if a streak value is a milestone
 */
function checkMilestone(streak: number): { isMilestone: boolean; milestoneValue?: number } {
  if (STREAK_MILESTONES.includes(streak)) {
    return { isMilestone: true, milestoneValue: streak };
  }
  return { isMilestone: false };
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Update user's streak based on log date
 * 
 * Logic:
 * - If last_log_date is yesterday: increment current_streak
 * - If last_log_date is today: no change
 * - If last_log_date is older: reset current_streak to 1
 * - Update longest_streak if current > longest
 */
export async function updateStreak(userId: string, logDate?: Date): Promise<StreakInfo> {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const logDateStr = logDate ? getDateString(logDate) : today;
  
  try {
    // Get current streak data
    const { data: userData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('current_streak, longest_streak, last_log_date, streak_updated_at')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching streak data:', fetchError);
      throw fetchError;
    }

    // Default values for new users
    let currentStreak = userData?.current_streak || 0;
    let longestStreak = userData?.longest_streak || 0;
    const lastLogDate = userData?.last_log_date || null;
    
    let streakIncreased = false;
    let isNewRecord = false;

    // Calculate new streak
    if (lastLogDate === today || lastLogDate === logDateStr) {
      // Already logged today - no change
      console.log('📊 Streak: Already logged today, no change');
    } else if (lastLogDate === yesterday) {
      // Consecutive day - increment streak!
      currentStreak += 1;
      streakIncreased = true;
      console.log(`🔥 Streak increased to ${currentStreak}!`);
    } else {
      // Streak broken or first log - reset to 1
      if (currentStreak > 0) {
        console.log(`💔 Streak broken (was ${currentStreak}, last log: ${lastLogDate})`);
      }
      currentStreak = 1;
      streakIncreased = lastLogDate !== null; // Only "increased" if they had logged before
    }

    // Check for new record
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      isNewRecord = true;
      console.log(`🏆 New longest streak record: ${longestStreak}!`);
    }

    // Check for milestone
    const milestone = checkMilestone(currentStreak);

    // Update database
    const updateData = {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_log_date: logDateStr,
      streak_updated_at: new Date().toISOString(),
    };

    // Try to update existing profile, or create new one
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updateData,
      }, {
        onConflict: 'id'
      });

    if (updateError) {
      console.error('Error updating streak:', updateError);
      // Don't throw - return what we calculated anyway
    }

    return {
      currentStreak,
      longestStreak,
      lastLogDate: logDateStr,
      isNewRecord,
      streakIncreased,
      ...milestone,
    };

  } catch (error) {
    console.error('Streak calculation error:', error);
    // Return safe defaults
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastLogDate: today,
      isNewRecord: false,
      streakIncreased: false,
      isMilestone: false,
    };
  }
}

/**
 * Get current streak info for a user (without updating)
 */
export async function getStreak(userId: string): Promise<StreakInfo> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('current_streak, longest_streak, last_log_date')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const today = getTodayString();
    const yesterday = getYesterdayString();
    const lastLogDate = data?.last_log_date || null;
    let currentStreak = data?.current_streak || 0;
    const longestStreak = data?.longest_streak || 0;

    // Check if streak is still valid
    // If last log was not today or yesterday, streak is broken
    if (lastLogDate && lastLogDate !== today && lastLogDate !== yesterday) {
      currentStreak = 0;
    }

    return {
      currentStreak,
      longestStreak,
      lastLogDate,
      isNewRecord: false,
      streakIncreased: false,
      isMilestone: false,
    };

  } catch (error) {
    console.error('Error fetching streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null,
      isNewRecord: false,
      streakIncreased: false,
      isMilestone: false,
    };
  }
}

/**
 * Get encouraging message based on streak length
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak <= 2) return "You're getting started! 🌱";
  if (streak <= 6) return "Nice streak going! 🔥";
  if (streak <= 13) return "One week strong! 💪";
  if (streak <= 29) return "Two weeks! You're on fire! 🔥🔥";
  if (streak <= 59) return "One month! Incredible! 🏆";
  if (streak <= 89) return "Two months strong! 💎";
  return "Legendary dedication! 👑";
}

/**
 * Get celebration message for milestone streaks
 */
export function getMilestoneMessage(streak: number): { title: string; subtitle: string } {
  switch (streak) {
    case 7:
      return { title: "🎉 7 Day Streak!", subtitle: "You've logged meals for one whole week!" };
    case 14:
      return { title: "🔥 14 Day Streak!", subtitle: "Two weeks of healthy tracking!" };
    case 30:
      return { title: "🏆 30 Day Streak!", subtitle: "A full month! You're unstoppable!" };
    case 60:
      return { title: "💎 60 Day Streak!", subtitle: "Two months of dedication!" };
    case 90:
      return { title: "👑 90 Day Streak!", subtitle: "Three months strong! Legendary!" };
    case 180:
      return { title: "⭐ 180 Day Streak!", subtitle: "Half a year! Incredible achievement!" };
    case 365:
      return { title: "🎊 365 Day Streak!", subtitle: "ONE FULL YEAR! You're a champion!" };
    default:
      return { title: `🔥 ${streak} Day Streak!`, subtitle: "Keep up the amazing work!" };
  }
}

