// app/api/log-vital/route.ts
// 🩺 API endpoint for logging user vitals

import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // Get Supabase client inside handler (avoids build-time errors)
    const supabase = getSupabaseServiceClient();
    const body = await req.json();
    
    // Log incoming request for debugging
    console.log('📊 Log Vital API called:', {
      vital_type: body.vital_type,
      user_id: body.user_id ? '✓ present' : '✗ missing',
    });

    const {
      user_id,
      vital_type,
      reading_value,
      unit,
      context_tag,
      measured_at,
      // For BP, we might receive both values
      bp_systolic,
      bp_diastolic,
    } = body;

    // Validate required fields
    if (!user_id) {
      console.error('❌ Missing user_id');
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Ensure user_id is a string
    const safeUserId = String(user_id);
    const timestamp = measured_at || new Date().toISOString();

    // Handle Blood Pressure (two values)
    if (vital_type === 'blood_pressure' || (bp_systolic && bp_diastolic)) {
      const systolic = parseFloat(bp_systolic);
      const diastolic = parseFloat(bp_diastolic);

      if (isNaN(systolic) || isNaN(diastolic)) {
        return NextResponse.json(
          { success: false, error: 'Invalid blood pressure values' },
          { status: 400 }
        );
      }

      // Insert both readings
      const vitalsToInsert = [
        {
          user_id: safeUserId,
          vital_type: 'bp_systolic',
          reading_value: systolic,
          unit: 'mmHg',
          context_tag: context_tag || 'general',
          measured_at: timestamp,
        },
        {
          user_id: safeUserId,
          vital_type: 'bp_diastolic',
          reading_value: diastolic,
          unit: 'mmHg',
          context_tag: context_tag || 'general',
          measured_at: timestamp,
        },
      ];

      const { data, error } = await supabase
        .from('user_vitals')
        .insert(vitalsToInsert)
        .select();

      if (error) {
        console.error('❌ Supabase insert error (BP):', error);
        
        // Check for UUID type mismatch error
        if (error.code === '22P02' && error.message.includes('uuid')) {
          console.error('⚠️ Database schema issue: user_id column expects UUID but received string');
          console.error('💡 Fix: Run this SQL in Supabase: ALTER TABLE user_vitals ALTER COLUMN user_id TYPE text;');
          return NextResponse.json(
            { 
              success: false, 
              error: 'Database configuration error. Please contact support.',
              hint: 'user_id column needs to be TEXT type, not UUID'
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      console.log('✅ Blood pressure saved:', { systolic, diastolic });
      return NextResponse.json({
        success: true,
        data,
        message: `Blood pressure ${systolic}/${diastolic} mmHg saved`,
      });
    }

    // Handle single vital (Glucose, Weight, Waist)
    if (!vital_type || reading_value === undefined) {
      return NextResponse.json(
        { success: false, error: 'vital_type and reading_value are required' },
        { status: 400 }
      );
    }

    const numValue = parseFloat(reading_value);
    if (isNaN(numValue)) {
      return NextResponse.json(
        { success: false, error: 'reading_value must be a number' },
        { status: 400 }
      );
    }

    const vitalData = {
      user_id: safeUserId,
      vital_type,
      reading_value: numValue,
      unit: unit || getDefaultUnit(vital_type),
      context_tag: context_tag || 'general',
      measured_at: timestamp,
    };

    const { data, error } = await supabase
      .from('user_vitals')
      .insert([vitalData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      
      // Check for UUID type mismatch error
      if (error.code === '22P02' && error.message.includes('uuid')) {
        console.error('⚠️ Database schema issue: user_id column expects UUID but received string');
        console.error('💡 Fix: Run this SQL in Supabase: ALTER TABLE user_vitals ALTER COLUMN user_id TYPE text;');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database configuration error. Please contact support.',
            hint: 'user_id column needs to be TEXT type, not UUID'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Vital saved:', { vital_type, reading_value: numValue });
    return NextResponse.json({
      success: true,
      data,
      message: `${vital_type} reading saved`,
    });

  } catch (err: any) {
    console.error('❌ Log vital API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper: Get default unit for vital type
function getDefaultUnit(vitalType: string): string {
  switch (vitalType) {
    case 'glucose':
      return 'mmol/L';
    case 'bp_systolic':
    case 'bp_diastolic':
      return 'mmHg';
    case 'weight':
      return 'kg';
    case 'waist_circumference':
      return 'cm';
    default:
      return '';
  }
}

