// 🇲🇾 Example: Integrating Malaysian Food Search into Food Logging

import React, { useState } from 'react';
import { MalaysianFoodSearch, FoodDetailModal } from '@/components/food';
import type { FoodSearchResult, MalaysianFood } from '@/types/food';

// Example integration in your existing food logging page/component
export function FoodLoggingExample() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  
  // Get user's conditions from profile/context
  const userConditions = ['diabetes', 'hypertension']; // Example
  
  const handleFoodSelect = (food: FoodSearchResult) => {
    setSelectedFoodId(food.id);
  };
  
  const handleLogMeal = async (food: MalaysianFood, multiplier: number) => {
    // Calculate nutrition based on multiplier
    const logEntry = {
      malaysian_food_id: food.id,
      food_name: food.name_bm,
      serving_description: food.serving_description,
      serving_multiplier: multiplier,
      
      // Calculated values
      calories: Math.round(food.calories_kcal * multiplier),
      carbs: Math.round(food.carbs_g * multiplier),
      protein: food.protein_g ? Math.round(food.protein_g * multiplier) : null,
      fat: food.total_fat_g ? Math.round(food.total_fat_g * multiplier) : null,
      sugar: food.sugar_g ? Math.round(food.sugar_g * multiplier) : null,
      fiber: food.fiber_g ? Math.round(food.fiber_g * multiplier) : null,
      sodium: food.sodium_mg ? Math.round(food.sodium_mg * multiplier) : null,
    };
    
    // Save to your database
    try {
      const response = await fetch('/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_type: 'lunch', // or get from user selection
          ...logEntry,
        }),
      });
      
      if (response.ok) {
        console.log('Meal logged successfully');
        setShowSearch(false);
        setSelectedFoodId(null);
        // Show success toast, refresh meal list, etc.
      }
    } catch (error) {
      console.error('Failed to log meal:', error);
    }
  };
  
  const handleManualEntry = () => {
    // Fall back to your existing manual entry flow
    console.log('User chose manual entry');
    setShowSearch(false);
    // Navigate to manual entry page or show manual entry form
  };
  
  return (
    <div>
      {/* Your existing UI */}
      <button
        onClick={() => setShowSearch(true)}
        className="px-6 py-3 bg-emerald-600 text-white rounded-xl"
      >
        Add Food
      </button>
      
      {/* Malaysian Food Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50">
          <MalaysianFoodSearch
            onSelectFood={handleFoodSelect}
            onManualEntry={handleManualEntry}
            userConditions={userConditions}
          />
        </div>
      )}
      
      {/* Food Detail Modal */}
      <FoodDetailModal
        foodId={selectedFoodId}
        onClose={() => setSelectedFoodId(null)}
        onLogMeal={handleLogMeal}
        userConditions={userConditions}
      />
    </div>
  );
}

// ============================================
// Database Schema Update for food_logs
// ============================================

// Add this column to your existing food_logs table:
/*
ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS malaysian_food_id UUID 
  REFERENCES malaysian_foods(id) ON DELETE SET NULL;

ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS serving_multiplier DECIMAL(4,2) DEFAULT 1.0;

CREATE INDEX IF NOT EXISTS idx_food_logs_malaysian_food 
  ON food_logs(malaysian_food_id);
*/

// ============================================
// API Route: Log Meal
// ============================================

// app/api/meals/log/route.ts
/*
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = // get from auth session
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        user_id: userId,
        malaysian_food_id: body.malaysian_food_id,
        meal_type: body.meal_type,
        food_name: body.food_name,
        serving_description: body.serving_description,
        serving_multiplier: body.serving_multiplier,
        calories: body.calories,
        carbs: body.carbs,
        protein: body.protein,
        fat: body.fat,
        sugar: body.sugar,
        fiber: body.fiber,
        sodium: body.sodium,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log meal' }, { status: 500 });
  }
}
*/

