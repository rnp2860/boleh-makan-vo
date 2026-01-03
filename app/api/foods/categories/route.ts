// 🇲🇾 Malaysian Food Categories API

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface CategoryCount {
  category: string;
  count: number;
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // Get all categories with their counts
    const { data, error } = await supabase
      .from('malaysian_foods')
      .select('category');
    
    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }
    
    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    (data || []).forEach((item: { category: string }) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    
    // Transform to array with icons
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        icon: getCategoryIcon(name),
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
    
    return NextResponse.json(categories);
    
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'rice_dishes': '🍚',
    'noodles': '🍜',
    'breads': '🍞',
    'drinks': '🥤',
    'protein': '🍗',
    'kuih': '🧁',
    'desserts': '🍨',
    'fruits': '🍌',
    'porridge': '🥣',
    'breakfast': '🍳',
    'vegetables': '🥬',
    'soup': '🍲',
    'snacks': '🍿',
    'fast_food': '🍔',
    'dim_sum': '🥟',
    'curry': '🍛',
    'condiments': '🧂',
  };
  return icons[category] || '🍽️';
}
