// app/api/user/streak/route.ts
// 🔥 User Streak API Endpoint

import { NextResponse } from 'next/server';
import { getStreak, getStreakMessage } from '@/lib/streakCalculator';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'user_id is required' 
      }, { status: 400 });
    }

    const streakInfo = await getStreak(userId);
    const message = getStreakMessage(streakInfo.currentStreak);

    return NextResponse.json({
      success: true,
      currentStreak: streakInfo.currentStreak,
      longestStreak: streakInfo.longestStreak,
      lastLogDate: streakInfo.lastLogDate,
      message,
    });

  } catch (error: any) {
    console.error('Streak API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to get streak info' 
    }, { status: 500 });
  }
}

