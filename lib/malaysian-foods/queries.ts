// 🇲🇾 Malaysian Food Database Queries

import { getSupabaseClient } from '@/lib/supabase';
import { MalaysianFood, MalaysianFoodRow, FoodCategory } from './types';
import { rowToMalaysianFood } from './utils';

// ============================================
// SEARCH FOODS
// ============================================

export async function searchMalaysianFoods(
  query: string,
  options?: {
    limit?: number;
    category?: FoodCategory;
    tags?: string[];
  }
): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  const limit = options?.limit || 20;
  
  // Use the database function for optimized search
  const { data, error } = await supabase
    .rpc('search_malaysian_foods', {
      search_term: query,
      limit_count: limit
    });
  
  if (error) {
    console.error('Food search error:', error);
    throw new Error('Failed to search foods');
  }
  
  let results = (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
  
  // Apply additional filters if provided
  if (options?.category) {
    results = results.filter(f => f.category === options.category);
  }
  
  if (options?.tags && options.tags.length > 0) {
    results = results.filter(f => 
      options.tags!.some(tag => f.tags.includes(tag))
    );
  }
  
  return results;
}

// ============================================
// GET FOOD BY ID
// ============================================

export async function getMalaysianFoodById(id: string): Promise<MalaysianFood | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Get food error:', error);
    throw new Error('Failed to get food');
  }
  
  return rowToMalaysianFood(data as MalaysianFoodRow);
}

// ============================================
// GET POPULAR FOODS
// ============================================

export async function getPopularFoods(limit: number = 10): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get popular foods error:', error);
    throw new Error('Failed to get popular foods');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// GET FOODS BY CATEGORY
// ============================================

export async function getFoodsByCategory(
  category: FoodCategory,
  limit: number = 50
): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .eq('category', category)
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get foods by category error:', error);
    throw new Error('Failed to get foods by category');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// GET FOODS BY TAG
// ============================================

export async function getFoodsByTag(
  tag: string,
  limit: number = 50
): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .contains('tags', [tag])
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get foods by tag error:', error);
    throw new Error('Failed to get foods by tag');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// INCREMENT POPULARITY
// ============================================

export async function incrementFoodPopularity(foodId: string): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.rpc('increment_food_popularity', {
    food_id: foodId
  });
  
  if (error) {
    console.error('Increment popularity error:', error);
    // Don't throw - this is not critical
  }
}

// ============================================
// GET CONDITION-SAFE FOODS
// ============================================

export async function getConditionSafeFoods(
  condition: 'diabetes' | 'hypertension' | 'cholesterol' | 'ckd',
  limit: number = 20
): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const ratingColumn = `${condition}_rating`;
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .eq(ratingColumn, 'safe')
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get condition-safe foods error:', error);
    throw new Error('Failed to get condition-safe foods');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// GET RAMADAN FOODS
// ============================================

export async function getRamadanFoods(limit: number = 30): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .contains('tags', ['ramadan'])
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get Ramadan foods error:', error);
    throw new Error('Failed to get Ramadan foods');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// GET LOW GI FOODS
// ============================================

export async function getLowGIFoods(limit: number = 20): Promise<MalaysianFood[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('*')
    .eq('gi_category', 'low')
    .order('popularity_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Get low GI foods error:', error);
    throw new Error('Failed to get low GI foods');
  }
  
  return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
}

// ============================================
// GET ALL CATEGORIES WITH COUNTS
// ============================================

export async function getCategoryCounts(): Promise<Record<FoodCategory, number>> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('malaysian_foods')
    .select('category');
  
  if (error) {
    console.error('Get category counts error:', error);
    throw new Error('Failed to get category counts');
  }
  
  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  
  return counts as Record<FoodCategory, number>;
}

