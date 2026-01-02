// 🇲🇾 Malaysian Food Categories API

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { FOOD_CATEGORIES } from '@/lib/malaysian-foods/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // Get counts for each category
    const { data, error } = await supabase
      .from('malaysian_foods')
      .select('category');
    
    if (error) {
      console.error('Get categories error:', error);
      return NextResponse.json({ 
        error: 'Failed to get categories' 
      }, { status: 500 });
    }
    
    // Count foods per category
    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }
    
    // Merge with category metadata
    const categories = FOOD_CATEGORIES.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0,
    })).filter(cat => cat.count > 0);
    
    return NextResponse.json({
      categories,
      totalFoods: data.length,
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

