// app/api/vitals/today/route.ts
// 📊 API endpoint for fetching today's latest vital readings

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const dateParam = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Get start and end of today
    const today = dateParam ? new Date(dateParam) : new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all vitals for today
    const { data: vitalsData, error } = await supabase
      .from('user_vitals')
      .select('*')
      .eq('user_id', String(userId))
      .gte('measured_at', today.toISOString())
      .lt('measured_at', tomorrow.toISOString())
      .order('measured_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching today vitals:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Process and group by vital type, getting the latest for each
    const readings: Record<string, any> = {};

    // Group vitals by type
    const vitalsByType: Record<string, any[]> = {};
    (vitalsData || []).forEach((vital: any) => {
      const type = vital.vital_type;
      if (!vitalsByType[type]) {
        vitalsByType[type] = [];
      }
      vitalsByType[type].push(vital);
    });

    // Get latest glucose reading
    if (vitalsByType['glucose']?.length > 0) {
      const latest = vitalsByType['glucose'][0];
      readings['glucose'] = {
        value: latest.reading_value,
        time: formatTime(latest.measured_at),
        context: formatContext(latest.context_tag),
      };
    }

    // Get latest BP reading (combine systolic and diastolic)
    if (vitalsByType['bp_systolic']?.length > 0) {
      const latestSystolic = vitalsByType['bp_systolic'][0];
      // Find matching diastolic (same timestamp or closest)
      const latestDiastolic = vitalsByType['bp_diastolic']?.[0];
      
      readings['bp'] = {
        value: latestSystolic.reading_value,
        value2: latestDiastolic?.reading_value || 0,
        time: formatTime(latestSystolic.measured_at),
      };
    }

    // Get latest weight reading
    if (vitalsByType['weight']?.length > 0) {
      const latest = vitalsByType['weight'][0];
      readings['weight'] = {
        value: latest.reading_value,
        time: formatTime(latest.measured_at),
      };
    }

    // Get latest waist reading
    if (vitalsByType['waist_circumference']?.length > 0) {
      const latest = vitalsByType['waist_circumference'][0];
      readings['waist_circumference'] = {
        value: latest.reading_value,
        time: formatTime(latest.measured_at),
      };
    }

    console.log('📊 Today\'s latest readings:', readings);

    return NextResponse.json({
      success: true,
      readings,
      count: vitalsData?.length || 0,
    });

  } catch (err: any) {
    console.error('❌ Vitals today API error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Helper: Format time to readable string
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

// Helper: Format context tag to readable string
function formatContext(context: string): string {
  const map: Record<string, string> = {
    'fasting': 'Fasting',
    'pre_meal': 'Pre-Meal',
    'post_meal_2hr': '2hr Post-Meal',
    'general': 'General',
  };
  return map[context] || context;
}

