'use client';

// 🇲🇾 Malaysian Food Category Browser

import React, { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useFoodCategories, type FoodCategory } from '@/hooks/useFoodSearch';
import type { FoodSearchResult } from '@/types/food';

interface FoodCategoryBrowserProps {
  onSelectFood: (food: FoodSearchResult) => void;
  userConditions?: string[];
  className?: string;
}

export function FoodCategoryBrowser({
  onSelectFood,
  userConditions = [],
  className = '',
}: FoodCategoryBrowserProps) {
  const { categories, isLoading, error } = useFoodCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFoods, setCategoryFoods] = useState<FoodSearchResult[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  
  const handleCategoryClick = async (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setCategoryFoods([]);
      return;
    }
    
    setSelectedCategory(categoryName);
    setLoadingFoods(true);
    
    try {
      const response = await fetch(`/api/foods/category/${encodeURIComponent(categoryName)}?limit=30`);
      const data = await response.json();
      setCategoryFoods(data.results || []);
    } catch (err) {
      console.error('Load category foods error:', err);
    } finally {
      setLoadingFoods(false);
    }
  };
  
  // Get worst rating for display
  const getWorstRating = (food: FoodSearchResult) => {
    const ratings = [];
    if (userConditions.includes('diabetes')) ratings.push(food.diabetes_rating);
    if (userConditions.includes('hypertension')) ratings.push(food.hypertension_rating);
    if (userConditions.includes('cholesterol')) ratings.push(food.cholesterol_rating);
    if (userConditions.includes('ckd')) ratings.push(food.ckd_rating);
    
    if (ratings.includes('limit')) return 'limit';
    if (ratings.includes('caution')) return 'caution';
    return 'safe';
  };
  
  const getRatingColor = (rating: string) => {
    if (rating === 'limit') return 'bg-red-100 text-red-700';
    if (rating === 'caution') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`text-center py-8 text-red-500 ${className}`}>
        {error}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className={`p-3 rounded-xl text-center transition-all duration-200 ${
              selectedCategory === cat.name
                ? 'bg-emerald-100 border-2 border-emerald-500'
                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="text-xs font-medium text-slate-700 truncate">
              {cat.name.replace('_', ' ')}
            </div>
            <div className="text-xs text-slate-400">
              {cat.count} items
            </div>
          </button>
        ))}
      </div>
      
      {/* Category Foods */}
      {selectedCategory && (
        <div className="mt-4">
          {loadingFoods ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {categoryFoods.map((food) => {
                const rating = userConditions.length > 0 ? getWorstRating(food) : 'safe';
                
                return (
                  <button
                    key={food.id}
                    onClick={() => onSelectFood(food)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl
                             border border-slate-100 hover:border-emerald-200
                             transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">
                        {food.name_bm}
                      </div>
                      <div className="text-sm text-slate-500">
                        {food.serving_description} • {Math.round(food.calories_kcal)} kcal
                      </div>
                    </div>
                    
                    {userConditions.length > 0 && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        getRatingColor(rating)
                      }`}>
                        {rating}
                      </div>
                    )}
                    
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FoodCategoryBrowser;


