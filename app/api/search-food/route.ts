import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Get Supabase client inside handler (avoids build-time errors)
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('cat'); // 'drink' | 'dessert' | 'general'
    
    // 1. Safety Check
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    console.log('[Search Food API] Query:', query, 'Category:', category);

    // 2. BUILD THE QUERY - Now using malaysian_foods table
    // We select specific columns and map them to the expected format
    let dbQuery = supabase
      .from('malaysian_foods')
      .select('id, name_en, name_bm, aliases, category, subcategory, serving_description, serving_grams, calories_kcal, protein_g, carbs_g, total_fat_g, popularity_score')
      .or(`name_en.ilike.%${query}%,name_bm.ilike.%${query}%`)
      .limit(50); // Get more results initially for better filtering

    // 3. APPLY CATEGORY FILTERS (Optional refinement)
    // If user clicked "Add Drink", filter by category
    if (category === 'drink') {
      dbQuery = dbQuery.eq('category', 'Beverages'); 
    }
    // If user clicked "Add Dessert", filter for desserts/snacks
    if (category === 'dessert') {
      dbQuery = dbQuery.or('category.eq.Desserts,category.eq.Snacks,subcategory.ilike.%kuih%');
    }

    // 4. EXECUTE
    const { data, error } = await dbQuery;

    if (error) throw error;

    console.log('[Search Food API] Initial results:', data?.length || 0);

    // 5. Also search aliases
    const queryLower = query.toLowerCase().trim();
    const { data: aliasData } = await supabase
      .from('malaysian_foods')
      .select('id, name_en, name_bm, aliases, category, subcategory, serving_description, serving_grams, calories_kcal, protein_g, carbs_g, total_fat_g, popularity_score')
      .contains('aliases', [queryLower])
      .limit(20);

    console.log('[Search Food API] Alias results:', aliasData?.length || 0);

    // Combine and deduplicate
    const allResults = [...(data || [])];
    const existingIds = new Set(allResults.map((f: any) => f.id));
    
    if (aliasData) {
      for (const food of aliasData) {
        if (!existingIds.has(food.id)) {
          allResults.push(food);
          existingIds.add(food.id);
        }
      }
    }

    // 6. SMART SORTING with alias priority
    // We want exact matches first (including aliases), then startsWith, then shorter names
    const sortedData = allResults.sort((a, b) => {
      const aNameEn = (a.name_en || '').toLowerCase();
      const aNameBm = (a.name_bm || '').toLowerCase();
      const bNameEn = (b.name_en || '').toLowerCase();
      const bNameBm = (b.name_bm || '').toLowerCase();
      const aAliases = (a.aliases || []).map((x: string) => x.toLowerCase());
      const bAliases = (b.aliases || []).map((x: string) => x.toLowerCase());
      
      // Check for exact alias match (highest priority)
      const aExactAlias = aAliases.includes(queryLower);
      const bExactAlias = bAliases.includes(queryLower);
      if (aExactAlias && !bExactAlias) return -1;
      if (!aExactAlias && bExactAlias) return 1;
      
      // Prioritize startsWith (e.g. "Teh..." comes before "Bak Kut Teh")
      const aStarts = aNameEn.startsWith(queryLower) || aNameBm.startsWith(queryLower);
      const bStarts = bNameEn.startsWith(queryLower) || bNameBm.startsWith(queryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then prioritize by popularity
      const aPop = a.popularity_score || 0;
      const bPop = b.popularity_score || 0;
      if (aPop !== bPop) return bPop - aPop;
      
      // Then prioritize shorter names
      return aNameEn.length - bNameEn.length;
    });

    // 7. Transform to expected format (matching old food_library structure)
    const formattedResults = sortedData.slice(0, 20).map((food: any) => ({
      name: food.name_en,
      name_bm: food.name_bm,
      calories: food.calories_kcal,
      protein: food.protein_g,
      carbs: food.carbs_g,
      fat: food.total_fat_g,
      serving_size: `${food.serving_grams || 100}g`,
      serving_description: food.serving_description,
      tags: food.category,
      source: 'malaysian_foods',
      id: food.id
    }));

    console.log('[Search Food API] Final results:', formattedResults.length);

    return NextResponse.json(formattedResults);
    
  } catch (error: any) {
    console.error("[Search Food API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}