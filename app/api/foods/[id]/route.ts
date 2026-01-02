// 🇲🇾 Malaysian Food Detail API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { MalaysianFoodRow } from '@/lib/malaysian-foods/types';
import { rowToMalaysianFood } from '@/lib/malaysian-foods/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Food ID required' 
      }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('malaysian_foods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'Food not found' 
        }, { status: 404 });
      }
      console.error('Get food error:', error);
      return NextResponse.json({ 
        error: 'Failed to get food' 
      }, { status: 500 });
    }
    
    const food = rowToMalaysianFood(data as MalaysianFoodRow);
    
    return NextResponse.json({ food });
    
  } catch (error) {
    console.error('Get food error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Increment popularity when food is logged
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Food ID required' 
      }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    // Increment popularity score
    const { error } = await supabase.rpc('increment_food_popularity', {
      food_id: id
    });
    
    if (error) {
      console.error('Increment popularity error:', error);
      // Don't fail the request, just log
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Increment popularity error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

