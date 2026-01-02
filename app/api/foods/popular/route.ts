// 🇲🇾 Popular Malaysian Foods API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { MalaysianFoodRow } from '@/lib/malaysian-foods/types';
import { rowToMalaysianFood } from '@/lib/malaysian-foods/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const condition = searchParams.get('condition'); // diabetes, hypertension, cholesterol, ckd
    
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('malaysian_foods')
      .select('*')
      .order('popularity_score', { ascending: false })
      .limit(limit);
    
    // Filter by condition-safe if specified
    if (condition) {
      const ratingColumn = `${condition}_rating`;
      query = query.in(ratingColumn, ['safe', 'caution']);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Get popular foods error:', error);
      return NextResponse.json({ 
        error: 'Failed to get popular foods' 
      }, { status: 500 });
    }
    
    const foods = (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
    
    return NextResponse.json({
      foods,
      count: foods.length,
    });
    
  } catch (error) {
    console.error('Get popular foods error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

