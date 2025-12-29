import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('cat'); // 'drink' | 'dessert' | 'general'
    
    // 1. Safety Check
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // 2. BUILD THE QUERY
    // We select specific columns to keep the response light
    let dbQuery = supabase
      .from('food_library')
      .select('name, calories, protein, carbs, fat, serving_size, tags, source')
      // 🛡️ THE TITANIUM FILTER: Exclude USDA noise (Litehouse, etc.)
      .not('source', 'ilike', '%USDA%') 
      .ilike('name', `%${query}%`)
      .limit(20); // Increase limit slightly since results are now higher quality

    // 3. APPLY CATEGORY FILTERS (Optional refinement)
    // If user clicked "Add Drink", we prioritize liquid items
    if (category === 'drink') {
      dbQuery = dbQuery.ilike('tags', '%kuih_muih%'); 
    }
    // If user clicked "Add Dessert", we look for sweets
    if (category === 'dessert') {
      dbQuery = dbQuery.or('tags.ilike.%kuih_muih%,tags.ilike.%snack%');
    }

    // 4. EXECUTE
    const { data, error } = await dbQuery;

    if (error) throw error;

    // 5. SMART SORTING (Frontend can't always trust DB sort)
    // We want exact matches first (e.g. "Teh" before "Teh Tarik")
    // and shorter names first (less noise)
    const sortedData = data?.sort((a, b) => {
      // Prioritize startsWith (e.g. "Teh..." comes before "Bak Kut Teh")
      const aStarts = a.name.toLowerCase().startsWith(query.toLowerCase());
      const bStarts = b.name.toLowerCase().startsWith(query.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then prioritize shorter names
      return a.name.length - b.name.length;
    });

    return NextResponse.json(sortedData || []);
    
  } catch (error: any) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}