// app/api/corrections/recent/route.ts
// 🔄 RLHF Corrections API - Fetches recent user corrections for prompt injection

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export interface CorrectionEntry {
  ai_suggested_name: string;
  food_name: string;    // User corrected name
  correction_count: number;
}

export async function GET() {
  try {
    // Fetch food_logs where user corrected the name (ai_suggested_name differs from food_name)
    // Group by ai_suggested_name → food_name pairs and count occurrences
    const { data: corrections, error } = await supabase
      .from('food_logs')
      .select('ai_suggested_name, meal_name')
      .eq('was_user_corrected', true)
      .not('ai_suggested_name', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200); // Get recent 200 corrections

    if (error) {
      console.error('❌ Error fetching corrections:', error);
      return NextResponse.json({ corrections: [] });
    }

    if (!corrections || corrections.length === 0) {
      console.log('📋 No user corrections found yet');
      return NextResponse.json({ corrections: [] });
    }

    // Group corrections and count occurrences
    const correctionMap = new Map<string, { correctedName: string; count: number }>();

    for (const entry of corrections) {
      const aiName = entry.ai_suggested_name?.toLowerCase().trim();
      const userCorrectedName = entry.meal_name?.trim();

      if (!aiName || !userCorrectedName) continue;
      if (aiName === userCorrectedName.toLowerCase()) continue; // Not actually a correction

      // Use ai_suggested_name as key
      const existing = correctionMap.get(aiName);
      if (existing) {
        // If same correction, increment count
        // If different correction, keep the one with more votes (or keep first seen)
        if (existing.correctedName.toLowerCase() === userCorrectedName.toLowerCase()) {
          existing.count++;
        }
        // else: different users corrected same AI name differently - keep first one
      } else {
        correctionMap.set(aiName, { correctedName: userCorrectedName, count: 1 });
      }
    }

    // Convert to array and sort by count (most corrections first)
    const sortedCorrections: CorrectionEntry[] = Array.from(correctionMap.entries())
      .map(([aiName, { correctedName, count }]) => ({
        ai_suggested_name: aiName,
        food_name: correctedName,
        correction_count: count,
      }))
      .sort((a, b) => b.correction_count - a.correction_count)
      .slice(0, 50); // Top 50 most corrected items

    console.log(`📋 Found ${sortedCorrections.length} unique corrections`);

    return NextResponse.json({ 
      corrections: sortedCorrections,
      total_count: corrections.length 
    });

  } catch (err: any) {
    console.error('❌ Corrections API error:', err);
    return NextResponse.json({ corrections: [], error: err.message });
  }
}

