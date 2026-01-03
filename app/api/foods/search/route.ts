// 🇲🇾 Malaysian Food Search API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import type { FoodSearchResult } from '@/types/food';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }
    
    const supabase = getSupabaseClient();
    
    // Use the search_malaysian_foods RPC function
    const { data, error } = await supabase
      .rpc('search_malaysian_foods', {
        search_term: query,
        limit_count: limit
      });
    
    if (error) {
      console.error('Food search error:', error);
      return NextResponse.json(
        { error: 'Failed to search foods' },
        { status: 500 }
      );
    }
    
    // Transform to FoodSearchResult format
    const results: FoodSearchResult[] = (data || []).map((food: any) => ({
      id: food.id,
      name_en: food.name_en,
      name_bm: food.name_bm,
      category: food.category,
      serving_description: food.serving_description,
      serving_grams: food.serving_grams,
      calories_kcal: food.calories_kcal,
      carbs_g: food.carbs_g,
      protein_g: food.protein_g,
      diabetes_rating: food.diabetes_rating,
      hypertension_rating: food.hypertension_rating,
      cholesterol_rating: food.cholesterol_rating,
      ckd_rating: food.ckd_rating,
      popularity_score: food.popularity_score || 0,
    }));
    
    return NextResponse.json({ results });
    
  } catch (error) {
    console.error('Food search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
