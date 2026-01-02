// app/api/ramadan/route.ts
// 🌙 Ramadan Mode API Routes

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// GET - Fetch Ramadan settings and data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const type = searchParams.get('type') || 'settings'; // settings, log, stats, dates

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    switch (type) {
      case 'settings': {
        const { data, error } = await supabase
          .from('ramadan_settings')
          .select('*')
          .eq('user_id', userId)
          .eq('year', parseInt(year))
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return NextResponse.json({ success: true, data });
      }

      case 'log': {
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('ramadan_daily_log')
          .select('*')
          .eq('user_id', userId)
          .eq('date', date)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return NextResponse.json({ success: true, data });
      }

      case 'stats': {
        // Get Ramadan dates for the year
        const { data: ramadanDates } = await supabase
          .from('ramadan_dates')
          .select('*')
          .eq('year', parseInt(year))
          .single();

        if (!ramadanDates) {
          return NextResponse.json({ success: true, data: null });
        }

        // Get all logs for this Ramadan
        const { data: logs, error } = await supabase
          .from('ramadan_daily_log')
          .select('*')
          .eq('user_id', userId)
          .gte('date', ramadanDates.start_date)
          .lte('date', ramadanDates.end_date)
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }

        // Calculate statistics
        const stats = calculateStats(logs || []);

        // Get qada count
        const { data: qadaLogs } = await supabase
          .from('ramadan_qada_log')
          .select('*')
          .eq('user_id', userId)
          .eq('ramadan_year', parseInt(year))
          .eq('qada_completed', false);

        stats.qadaDaysOwed = qadaLogs?.length || 0;

        return NextResponse.json({ 
          success: true, 
          data: stats,
          logs,
          ramadanDates,
        });
      }

      case 'dates': {
        const { data, error } = await supabase
          .from('ramadan_dates')
          .select('*')
          .eq('year', parseInt(year))
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Ramadan API GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Ramadan data' },
      { status: 500 }
    );
  }
}

// POST - Create or update Ramadan settings/logs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, user_id, ...data } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    switch (type) {
      case 'settings': {
        const year = data.year || new Date().getFullYear();
        
        const { data: result, error } = await supabase
          .from('ramadan_settings')
          .upsert(
            {
              user_id,
              year,
              ...data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,year' }
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({ success: true, data: result });
      }

      case 'log': {
        const date = data.date || new Date().toISOString().split('T')[0];
        
        const { data: result, error } = await supabase
          .from('ramadan_daily_log')
          .upsert(
            {
              user_id,
              date,
              ...data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,date' }
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({ success: true, data: result });
      }

      case 'qada': {
        const { data: result, error } = await supabase
          .from('ramadan_qada_log')
          .upsert(
            {
              user_id,
              ...data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,missed_date' }
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({ success: true, data: result });
      }

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Ramadan API POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save Ramadan data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate statistics
function calculateStats(logs: any[]) {
  if (!logs || logs.length === 0) {
    return {
      totalDaysFasted: 0,
      daysCompleted: 0,
      daysBroken: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageGlucoseFasting: null,
      averageGlucosePostIftar: null,
      averageCaloriesPerDay: 0,
      averageWaterIntake: 0,
      averageEnergyLevel: null,
      qadaDaysOwed: 0,
    };
  }

  const totalDaysFasted = logs.length;
  const daysCompleted = logs.filter(l => l.fasting_completed).length;
  const daysBroken = logs.filter(l => l.fasting_broken).length;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const log of logs) {
    if (log.fasting_completed && !log.fasting_broken) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Current streak from most recent
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].fasting_completed && !logs[i].fasting_broken) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate averages
  const glucoseFastingValues = logs
    .filter(l => l.glucose_midday !== null)
    .map(l => l.glucose_midday);

  const glucosePostIftarValues = logs
    .filter(l => l.glucose_post_iftar !== null)
    .map(l => l.glucose_post_iftar);

  const calorieValues = logs
    .filter(l => l.total_calories !== null)
    .map(l => l.total_calories);

  const waterValues = logs
    .filter(l => l.water_intake_liters !== null)
    .map(l => l.water_intake_liters);

  const energyValues = logs
    .filter(l => l.energy_level !== null)
    .map(l => l.energy_level);

  const average = (arr: number[]): number | null =>
    arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null;

  return {
    totalDaysFasted,
    daysCompleted,
    daysBroken,
    currentStreak,
    longestStreak,
    averageGlucoseFasting: average(glucoseFastingValues),
    averageGlucosePostIftar: average(glucosePostIftarValues),
    averageCaloriesPerDay: Math.round(average(calorieValues) || 0),
    averageWaterIntake: average(waterValues) || 0,
    averageEnergyLevel: average(energyValues),
    qadaDaysOwed: daysBroken, // Will be updated with actual qada count
  };
}

