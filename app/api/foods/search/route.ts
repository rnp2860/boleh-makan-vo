// 🇲🇾 Malaysian Food Search API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { MalaysianFoodRow } from '@/lib/malaysian-foods/types';
import { rowToMalaysianFood } from '@/lib/malaysian-foods/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    if (!query.trim() && !category && !tag) {
      return NextResponse.json({ 
        error: 'Search query, category, or tag required' 
      }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    let results: MalaysianFoodRow[] = [];
    
    if (query.trim()) {
      // Use the database search function
      const { data, error } = await supabase
        .rpc('search_malaysian_foods', {
          search_term: query.trim(),
          limit_count: limit
        });
      
      if (error) {
        console.error('Food search error:', error);
        return NextResponse.json({ 
          error: 'Search failed' 
        }, { status: 500 });
      }
      
      results = data as MalaysianFoodRow[];
    } else if (category) {
      // Search by category
      const { data, error } = await supabase
        .from('malaysian_foods')
        .select('*')
        .eq('category', category)
        .order('popularity_score', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Category search error:', error);
        return NextResponse.json({ 
          error: 'Category search failed' 
        }, { status: 500 });
      }
      
      results = data as MalaysianFoodRow[];
    } else if (tag) {
      // Search by tag
      const { data, error } = await supabase
        .from('malaysian_foods')
        .select('*')
        .contains('tags', [tag])
        .order('popularity_score', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Tag search error:', error);
        return NextResponse.json({ 
          error: 'Tag search failed' 
        }, { status: 500 });
      }
      
      results = data as MalaysianFoodRow[];
    }
    
    // Apply additional filters if both query and category/tag are provided
    if (query.trim() && category) {
      results = results.filter(r => r.category === category);
    }
    
    if (query.trim() && tag) {
      results = results.filter(r => r.tags?.includes(tag));
    }
    
    const foods = results.map(rowToMalaysianFood);
    
    return NextResponse.json({
      foods,
      count: foods.length,
      query: query || undefined,
      category: category || undefined,
      tag: tag || undefined,
    });
    
  } catch (error) {
    console.error('Food search error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

