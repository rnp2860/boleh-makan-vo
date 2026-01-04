// 🇲🇾 Malaysian Food Search API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    
    console.log('[Search API] Query:', query);
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    const supabase = getSupabaseClient();
    
    // Strategy 1: Try RPC function first (has advanced fuzzy matching)
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('search_malaysian_foods', {
          search_term: query,
          limit_count: limit
        });
      
      if (!rpcError && rpcData) {
        console.log('[Search API] RPC results:', rpcData.length);
        return NextResponse.json(rpcData);
      }
      
      console.warn('[Search API] RPC failed, falling back to direct query:', rpcError);
    } catch (rpcErr) {
      console.warn('[Search API] RPC exception, falling back:', rpcErr);
    }
    
    // Strategy 2: Fallback to direct query with alias support
    console.log('[Search API] Using fallback direct query');
    
    // First: Search by name (English and Malay)
    const { data: nameResults, error: nameError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .or(`name_en.ilike.%${query}%,name_bm.ilike.%${query}%`)
      .limit(50);
    
    if (nameError) {
      console.error('[Search API] Name search error:', nameError);
      return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 });
    }
    
    console.log('[Search API] Name results:', nameResults?.length || 0);
    
    // Second: Search by exact alias match (Supabase array contains)
    const { data: aliasResults, error: aliasError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .contains('aliases', [query])
      .limit(20);
    
    if (aliasError) {
      console.warn('[Search API] Alias search error (continuing):', aliasError);
    }
    
    console.log('[Search API] Alias results:', aliasResults?.length || 0);
    
    // Combine and deduplicate results
    const allResults = [...(nameResults || [])];
    const existingIds = new Set(allResults.map((f: any) => f.id));
    
    if (aliasResults) {
      for (const food of aliasResults) {
        if (!existingIds.has(food.id)) {
          allResults.push(food);
          existingIds.add(food.id);
        }
      }
    }
    
    console.log('[Search API] Combined results:', allResults.length);
    
    // Score and rank results
    const scored = allResults.map((food: any) => {
      let score = 0;
      const nameEn = food.name_en?.toLowerCase() || '';
      const nameBm = food.name_bm?.toLowerCase() || '';
      const aliases = (food.aliases || []).map((a: string) => a.toLowerCase());
      
      // Exact alias match (highest priority for shortcuts like "ckt")
      if (aliases.includes(query)) {
        score += 1000;
      }
      
      // Exact name match
      if (nameEn === query || nameBm === query) {
        score += 900;
      }
      
      // Starts with query
      if (nameEn.startsWith(query) || nameBm.startsWith(query)) {
        score += 500;
      }
      
      // Contains query
      if (nameEn.includes(query) || nameBm.includes(query)) {
        score += 200;
      }
      
      // Alias partial match
      if (aliases.some((a: string) => a.includes(query))) {
        score += 150;
      }
      
      // Popularity boost
      score += (food.popularity_score || 0) * 0.5;
      
      return { ...food, _score: score };
    });
    
    // Sort by score descending, then limit
    const results = scored
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score, ...food }) => food);
    
    console.log('[Search API] Final results:', results.length);
    if (results.length > 0) {
      console.log('[Search API] Top result:', results[0].name_en);
    }
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('[Search API] Fatal error:', error);
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 });
  }
}
