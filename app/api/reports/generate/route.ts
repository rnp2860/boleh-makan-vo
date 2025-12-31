import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🎯 HEALTH LIMITS
const DAILY_SODIUM_LIMIT = 2000; // mg
const DAILY_SUGAR_LIMIT = 25;    // g

// 📊 Calculate status based on percentage of limit
function getHealthStatus(average: number, limit: number): 'Safe' | 'Warning' | 'Danger' {
  const percentage = (average / limit) * 100;
  if (percentage <= 80) return 'Safe';
  if (percentage <= 100) return 'Warning';
  return 'Danger';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const user_id = searchParams.get('user_id');

    // Validate inputs
    if (!start_date || !end_date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: start_date and end_date' 
      }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('food_logs')
      .select('*')
      .gte('created_at', `${start_date}T00:00:00`)
      .lte('created_at', `${end_date}T23:59:59`)
      .order('created_at', { ascending: false });

    // Add user filter if provided
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // If no logs found, return empty report
    if (!logs || logs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          period: { start_date, end_date },
          total_logs: 0,
          summary_stats: null,
          meal_breakdown: null,
          macro_distribution: null,
          sodium_sugar_watch: null,
          gallery_data: []
        }
      });
    }

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  📊 SECTION 1: SUMMARY STATS                                     ║
    // ╚══════════════════════════════════════════════════════════════════╝
    
    const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const totalProtein = logs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = logs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = logs.reduce((sum, log) => sum + (log.fat || 0), 0);
    const totalSodium = logs.reduce((sum, log) => sum + (log.sodium || 0), 0);
    const totalSugar = logs.reduce((sum, log) => sum + (log.sugar || 0), 0);

    // Calculate number of unique days in the range
    const uniqueDays = new Set(
      logs.map(log => new Date(log.created_at).toISOString().split('T')[0])
    ).size;

    const avgDailySodium = uniqueDays > 0 ? Math.round(totalSodium / uniqueDays) : 0;
    const avgDailySugar = uniqueDays > 0 ? Math.round((totalSugar / uniqueDays) * 10) / 10 : 0;
    const avgDailyCalories = uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0;

    const summaryStats = {
      total_calories: totalCalories,
      total_protein: Math.round(totalProtein),
      total_carbs: Math.round(totalCarbs),
      total_fat: Math.round(totalFat),
      total_sodium: Math.round(totalSodium),
      total_sugar: Math.round(totalSugar * 10) / 10,
      avg_daily_calories: avgDailyCalories,
      avg_daily_sodium: avgDailySodium,
      avg_daily_sugar: avgDailySugar,
      total_meals: logs.length,
      total_days: uniqueDays
    };

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  🍽️ SECTION 2: MEAL BREAKDOWN                                    ║
    // ╚══════════════════════════════════════════════════════════════════╝
    
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'];
    const mealBreakdown: Record<string, { 
      count: number; 
      calories: number; 
      percentage: number;
      avg_calories: number;
    }> = {};

    mealTypes.forEach(type => {
      const mealsOfType = logs.filter(log => (log.meal_type || 'Other') === type);
      const typeCalories = mealsOfType.reduce((sum, log) => sum + (log.calories || 0), 0);
      
      mealBreakdown[type] = {
        count: mealsOfType.length,
        calories: typeCalories,
        percentage: totalCalories > 0 ? Math.round((typeCalories / totalCalories) * 100) : 0,
        avg_calories: mealsOfType.length > 0 ? Math.round(typeCalories / mealsOfType.length) : 0
      };
    });

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  🥗 SECTION 3: MACRO DISTRIBUTION                                ║
    // ╚══════════════════════════════════════════════════════════════════╝
    
    // Calculate calories from each macro (Protein: 4kcal/g, Carbs: 4kcal/g, Fat: 9kcal/g)
    const proteinCalories = totalProtein * 4;
    const carbsCalories = totalCarbs * 4;
    const fatCalories = totalFat * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

    const macroDistribution = {
      protein: {
        grams: Math.round(totalProtein),
        calories: Math.round(proteinCalories),
        percentage: totalMacroCalories > 0 ? Math.round((proteinCalories / totalMacroCalories) * 100) : 0
      },
      carbs: {
        grams: Math.round(totalCarbs),
        calories: Math.round(carbsCalories),
        percentage: totalMacroCalories > 0 ? Math.round((carbsCalories / totalMacroCalories) * 100) : 0
      },
      fat: {
        grams: Math.round(totalFat),
        calories: Math.round(fatCalories),
        percentage: totalMacroCalories > 0 ? Math.round((fatCalories / totalMacroCalories) * 100) : 0
      }
    };

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  ⚠️ SECTION 4: SODIUM/SUGAR WATCH                                ║
    // ╚══════════════════════════════════════════════════════════════════╝
    
    const sodiumStatus = getHealthStatus(avgDailySodium, DAILY_SODIUM_LIMIT);
    const sugarStatus = getHealthStatus(avgDailySugar, DAILY_SUGAR_LIMIT);

    const sodiumSugarWatch = {
      sodium: {
        avg_daily: avgDailySodium,
        limit: DAILY_SODIUM_LIMIT,
        percentage_of_limit: Math.round((avgDailySodium / DAILY_SODIUM_LIMIT) * 100),
        status: sodiumStatus,
        message: sodiumStatus === 'Safe' 
          ? '✅ Great job! Your sodium intake is within healthy limits.'
          : sodiumStatus === 'Warning'
            ? '⚠️ Watch out! You\'re approaching the daily sodium limit.'
            : '🚨 High sodium intake detected. Consider reducing salty foods.'
      },
      sugar: {
        avg_daily: avgDailySugar,
        limit: DAILY_SUGAR_LIMIT,
        percentage_of_limit: Math.round((avgDailySugar / DAILY_SUGAR_LIMIT) * 100),
        status: sugarStatus,
        message: sugarStatus === 'Safe'
          ? '✅ Excellent! Your sugar intake is well controlled.'
          : sugarStatus === 'Warning'
            ? '⚠️ Careful! You\'re nearing the recommended sugar limit.'
            : '🚨 High sugar intake detected. Try reducing sweet drinks and desserts.'
      }
    };

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  🖼️ SECTION 5: GALLERY DATA                                      ║
    // ╚══════════════════════════════════════════════════════════════════╝
    
    const galleryData = logs.map(log => ({
      id: log.id,
      image_url: log.image_url,
      food_name: log.meal_name,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fat: log.fat,
      meal_type: log.meal_type || 'Other',
      created_at: log.created_at,
      portion_size: log.portion_size
    }));

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  📦 FINAL RESPONSE                                               ║
    // ╚══════════════════════════════════════════════════════════════════╝

    return NextResponse.json({
      success: true,
      data: {
        period: {
          start_date,
          end_date,
          total_days: uniqueDays
        },
        total_logs: logs.length,
        summary_stats: summaryStats,
        meal_breakdown: mealBreakdown,
        macro_distribution: macroDistribution,
        sodium_sugar_watch: sodiumSugarWatch,
        gallery_data: galleryData
      }
    });

  } catch (err: any) {
    console.error('Report generation error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Failed to generate report' 
    }, { status: 500 });
  }
}

