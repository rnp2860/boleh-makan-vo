// 🇲🇾 Malaysian Food Detail API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import type { MalaysianFood } from '@/types/food';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Food ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('malaysian_foods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Food not found' },
          { status: 404 }
        );
      }
      console.error('Food detail error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch food details' },
        { status: 500 }
      );
    }
    
    const food: MalaysianFood = {
      id: data.id,
      name_en: data.name_en,
      name_bm: data.name_bm,
      aliases: data.aliases || [],
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags || [],
      
      serving_description: data.serving_description,
      serving_description_en: data.serving_description_en,
      serving_grams: data.serving_grams,
      
      calories_kcal: data.calories_kcal,
      carbs_g: data.carbs_g,
      sugar_g: data.sugar_g,
      fiber_g: data.fiber_g,
      glycemic_index: data.glycemic_index,
      gi_category: data.gi_category,
      
      sodium_mg: data.sodium_mg,
      potassium_mg: data.potassium_mg,
      
      total_fat_g: data.total_fat_g,
      saturated_fat_g: data.saturated_fat_g,
      trans_fat_g: data.trans_fat_g,
      cholesterol_mg: data.cholesterol_mg,
      
      protein_g: data.protein_g,
      phosphorus_mg: data.phosphorus_mg,
      
      diabetes_rating: data.diabetes_rating,
      hypertension_rating: data.hypertension_rating,
      cholesterol_rating: data.cholesterol_rating,
      ckd_rating: data.ckd_rating,
      
      image_url: data.image_url,
      source: data.source,
      verified: data.verified,
      popularity_score: data.popularity_score || 0,
      
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    
    return NextResponse.json(food);
    
  } catch (error) {
    console.error('Food detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Increment popularity score when food is viewed/logged
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    
    if (action === 'increment_popularity') {
      const supabase = getSupabaseClient();
      
      const { error } = await supabase.rpc('increment_food_popularity', {
        food_id: id
      });
      
      if (error) {
        console.error('Failed to increment popularity:', error);
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Food action API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
