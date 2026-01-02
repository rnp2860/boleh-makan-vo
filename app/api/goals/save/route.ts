import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // Get Supabase client inside handler (avoids build-time errors)
    const supabase = getSupabaseServiceClient();
    const { 
      user_id, 
      goal_description, 
      metric_target,
      start_date,
      end_date
    } = await req.json();

    if (!user_id || !goal_description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: user_id and goal_description' 
      }, { status: 400 });
    }

    // Calculate next week's dates if not provided
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7 || 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    const goalStartDate = start_date || nextMonday.toISOString().split('T')[0];
    const goalEndDate = end_date || nextSunday.toISOString().split('T')[0];

    // Insert the goal into the database
    const { data, error } = await supabase
      .from('user_weekly_goals')
      .insert({
        user_id,
        goal_description,
        metric_target: metric_target || {},
        start_date: goalStartDate,
        end_date: goalEndDate,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        goal_id: data.id,
        goal_description: data.goal_description,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      },
      message: 'Challenge accepted! Good luck! 🎯'
    });

  } catch (err: any) {
    console.error('Save goal error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Failed to save goal' 
    }, { status: 500 });
  }
}

