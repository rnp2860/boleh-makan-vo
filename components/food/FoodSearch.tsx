'use client';

// 🇲🇾 Malaysian Food Search Component

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { MalaysianFood } from '@/lib/malaysian-foods/types';
import { useFoodSearch, getRecentFoods, addRecentFood } from '@/hooks/useFoodSearch';
import { formatCalories, getRatingColor, getRatingIcon } from '@/lib/malaysian-foods/utils';

interface FoodSearchProps {
  onSelectFood: (food: MalaysianFood) => void;
  userConditions?: string[];
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function FoodSearch({
  onSelectFood,
  userConditions = [],
  placeholder = 'Cari makanan... / Search food...',
  autoFocus = false,
  className = '',
}: FoodSearchProps) {
  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearResults,
  } = useFoodSearch({ debounceMs: 300 });
  
  const [isFocused, setIsFocused] = useState(false);
  const [recentFoods, setRecentFoods] = useState<MalaysianFood[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load recent foods on mount
  useEffect(() => {
    setRecentFoods(getRecentFoods());
  }, []);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (food: MalaysianFood) => {
    addRecentFood(food);
    setRecentFoods(getRecentFoods());
    onSelectFood(food);
    clearResults();
    setIsFocused(false);
    
    // Increment popularity
    fetch(`/api/foods/${food.id}`, { method: 'POST' }).catch(() => {});
  };
  
  const showResults = isFocused && (results.length > 0 || query.length >= 2);
  const showRecent = isFocused && query.length < 2 && recentFoods.length > 0;
  
  // Get relevant condition rating for a food
  const getRelevantRating = (food: MalaysianFood): { condition: string; rating: string } | null => {
    if (userConditions.includes('diabetes') && food.diabetesRating) {
      return { condition: 'diabetes', rating: food.diabetesRating };
    }
    if (userConditions.includes('hypertension') && food.hypertensionRating) {
      return { condition: 'hypertension', rating: food.hypertensionRating };
    }
    if (userConditions.includes('dyslipidemia') && food.cholesterolRating) {
      return { condition: 'cholesterol', rating: food.cholesterolRating };
    }
    if (userConditions.includes('ckd') && food.ckdRating) {
      return { condition: 'ckd', rating: food.ckdRating };
    }
    return null;
  };
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl 
                     text-slate-800 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearResults}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          </div>
        )}
      </div>
      
      {/* Results Dropdown */}
      {(showResults || showRecent) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 
                        max-h-[60vh] overflow-y-auto">
          
          {/* Recent Foods */}
          {showRecent && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 uppercase">
                <Clock className="w-3 h-3" />
                Baru dicari / Recently searched
              </div>
              {recentFoods.map((food) => (
                <FoodSearchItem
                  key={food.id}
                  food={food}
                  onClick={() => handleSelect(food)}
                  relevantRating={getRelevantRating(food)}
                />
              ))}
            </div>
          )}
          
          {/* Search Results */}
          {showResults && (
            <div className="p-2">
              {results.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 uppercase">
                    <TrendingUp className="w-3 h-3" />
                    {results.length} hasil / results
                  </div>
                  {results.map((food) => (
                    <FoodSearchItem
                      key={food.id}
                      food={food}
                      onClick={() => handleSelect(food)}
                      query={query}
                      relevantRating={getRelevantRating(food)}
                    />
                  ))}
                </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-slate-500 text-sm mb-2">
                    Tiada hasil untuk &quot;{query}&quot;
                  </p>
                  <p className="text-slate-400 text-xs">
                    No results found. Try a different search term.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="p-4 text-center text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// FOOD SEARCH ITEM
// ============================================

interface FoodSearchItemProps {
  food: MalaysianFood;
  onClick: () => void;
  query?: string;
  relevantRating?: { condition: string; rating: string } | null;
}

function FoodSearchItem({ food, onClick, query, relevantRating }: FoodSearchItemProps) {
  // Highlight matching text
  const highlightText = (text: string, searchQuery?: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-lg
                 text-left transition-colors duration-150"
    >
      {/* Food Icon/Category Emoji */}
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
        {getCategoryEmoji(food.category)}
      </div>
      
      {/* Food Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 truncate">
          {highlightText(food.nameBm, query)}
        </div>
        <div className="text-sm text-slate-500 truncate">
          {highlightText(food.nameEn, query)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">
            {food.servingDescription} • {formatCalories(food.caloriesKcal)}
          </span>
          {food.giCategory && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              food.giCategory === 'low' ? 'bg-green-100 text-green-700' :
              food.giCategory === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              GI {food.giCategory}
            </span>
          )}
        </div>
      </div>
      
      {/* Condition Rating Badge */}
      {relevantRating && (
        <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${
          getRatingColor(relevantRating.rating as 'safe' | 'caution' | 'limit')
        }`}>
          {getRatingIcon(relevantRating.rating as 'safe' | 'caution' | 'limit')}
        </div>
      )}
    </button>
  );
}

// Helper to get emoji for category
function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    rice_dishes: '🍚',
    noodles: '🍜',
    breads: '🫓',
    kuih: '🍡',
    drinks: '🥤',
    protein: '🍗',
    vegetables: '🥬',
    fruits: '🍌',
    porridge: '🥣',
    soups: '🍲',
    desserts: '🍨',
    snacks: '🥠',
  };
  return emojis[category] || '🍽️';
}

export default FoodSearch;

