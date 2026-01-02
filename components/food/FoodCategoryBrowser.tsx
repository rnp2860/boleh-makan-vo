'use client';

// 🇲🇾 Malaysian Food Category Browser

import React, { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useFoodCategories } from '@/hooks/useFoodSearch';
import { MalaysianFood, FoodCategory } from '@/lib/malaysian-foods/types';
import { formatCalories, getRatingColor, getRatingIcon } from '@/lib/malaysian-foods/utils';

interface FoodCategoryBrowserProps {
  onSelectFood: (food: MalaysianFood) => void;
  userConditions?: string[];
  className?: string;
}

export function FoodCategoryBrowser({
  onSelectFood,
  userConditions = [],
  className = '',
}: FoodCategoryBrowserProps) {
  const { categories, isLoading, error } = useFoodCategories();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [categoryFoods, setCategoryFoods] = useState<MalaysianFood[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  
  const handleCategoryClick = async (categoryId: FoodCategory) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setCategoryFoods([]);
      return;
    }
    
    setSelectedCategory(categoryId);
    setLoadingFoods(true);
    
    try {
      const response = await fetch(`/api/foods/search?category=${categoryId}&limit=30`);
      const data = await response.json();
      setCategoryFoods(data.foods || []);
    } catch (err) {
      console.error('Load category foods error:', err);
    } finally {
      setLoadingFoods(false);
    }
  };
  
  // Get relevant rating for display
  const getRelevantRating = (food: MalaysianFood) => {
    if (userConditions.includes('diabetes') && food.diabetesRating) {
      return food.diabetesRating;
    }
    if (userConditions.includes('hypertension') && food.hypertensionRating) {
      return food.hypertensionRating;
    }
    return null;
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
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`p-3 rounded-xl text-center transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-emerald-100 border-2 border-emerald-500'
                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="text-xs font-medium text-slate-700 truncate">
              {cat.labelBm}
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
                const rating = getRelevantRating(food);
                
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
                        {food.nameBm}
                      </div>
                      <div className="text-sm text-slate-500">
                        {food.servingDescription} • {formatCalories(food.caloriesKcal)}
                      </div>
                    </div>
                    
                    {rating && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        getRatingColor(rating)
                      }`}>
                        {getRatingIcon(rating)}
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

