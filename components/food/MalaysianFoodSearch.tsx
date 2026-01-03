'use client';

// 🇲🇾 Malaysian Food Search Component

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Utensils, Loader2, Plus } from 'lucide-react';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import type { FoodSearchResult, ConditionRating } from '@/types/food';
import { SearchSuggestions } from './SearchSuggestions';

interface MalaysianFoodSearchProps {
  onSelectFood: (food: FoodSearchResult) => void;
  onManualEntry?: () => void;
  userConditions?: string[]; // ['diabetes', 'hypertension', etc.]
}

export function MalaysianFoodSearch({
  onSelectFood,
  onManualEntry,
  userConditions = [],
}: MalaysianFoodSearchProps) {
  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { results, isLoading, error, search, clearResults, recentSearches } = useFoodSearch();
  
  useEffect(() => {
    search(query);
    setShowRecent(query.length === 0);
  }, [query, search]);
  
  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);
  
  const handleClear = () => {
    setQuery('');
    clearResults();
    setShowRecent(true);
    inputRef.current?.focus();
  };
  
  const handleSelect = (food: FoodSearchResult) => {
    onSelectFood(food);
  };
  
  const displayResults = showRecent && results.length === 0 ? recentSearches : results;
  const showNoResults = query.length >= 2 && !isLoading && results.length === 0 && !showRecent;
  const showSuggestions = query.length < 2 || showNoResults;
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari makanan Malaysia..."
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}
        
        {!isLoading && showRecent && recentSearches.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <Clock className="w-4 h-4" />
              <span>Carian terkini / Recent searches</span>
            </div>
            <div className="space-y-2">
              {recentSearches.map((food) => (
                <FoodResultCard
                  key={food.id}
                  food={food}
                  onSelect={handleSelect}
                  userConditions={userConditions}
                  isRecent
                />
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && !showRecent && results.length > 0 && (
          <div className="p-4 space-y-2">
            {results.map((food) => (
              <FoodResultCard
                key={food.id}
                food={food}
                onSelect={handleSelect}
                userConditions={userConditions}
              />
            ))}
          </div>
        )}
        
        {showNoResults && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Tiada hasil / No results
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              Kami tidak menemui &quot;{query}&quot; dalam database kami.
              Cuba cari dengan istilah lain atau tambah secara manual.
            </p>
            {onManualEntry && (
              <button
                onClick={onManualEntry}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium
                         rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Log Manual Entry
              </button>
            )}
          </div>
        )}
        
        {/* Search Suggestions */}
        {showSuggestions && !isLoading && (
          <SearchSuggestions
            query={query}
            onSuggestionClick={(suggestion) => {
              setQuery(suggestion);
              inputRef.current?.focus();
            }}
            className="border-t-0"
          />
        )}
      </div>
    </div>
  );
}

interface FoodResultCardProps {
  food: FoodSearchResult;
  onSelect: (food: FoodSearchResult) => void;
  userConditions: string[];
  isRecent?: boolean;
}

function FoodResultCard({ food, onSelect, userConditions, isRecent }: FoodResultCardProps) {
  // Determine worst rating for user's conditions
  const getWorstRating = (): ConditionRating => {
    const ratings: ConditionRating[] = [];
    
    if (userConditions.includes('diabetes')) ratings.push(food.diabetes_rating);
    if (userConditions.includes('hypertension')) ratings.push(food.hypertension_rating);
    if (userConditions.includes('cholesterol')) ratings.push(food.cholesterol_rating);
    if (userConditions.includes('ckd')) ratings.push(food.ckd_rating);
    
    if (ratings.includes('limit')) return 'limit';
    if (ratings.includes('caution')) return 'caution';
    return 'safe';
  };
  
  const worstRating = userConditions.length > 0 ? getWorstRating() : 'safe';
  
  const ratingColors = {
    safe: 'bg-emerald-500',
    caution: 'bg-amber-500',
    limit: 'bg-red-500',
  };
  
  const categoryColors: Record<string, string> = {
    rice_dishes: 'bg-amber-100 text-amber-700',
    noodles: 'bg-orange-100 text-orange-700',
    protein: 'bg-rose-100 text-rose-700',
    vegetables: 'bg-emerald-100 text-emerald-700',
    drinks: 'bg-blue-100 text-blue-700',
    kuih: 'bg-purple-100 text-purple-700',
    desserts: 'bg-pink-100 text-pink-700',
    fast_food: 'bg-slate-100 text-slate-700',
  };
  
  const categoryColor = categoryColors[food.category] || 'bg-slate-100 text-slate-700';
  
  return (
    <button
      onClick={() => onSelect(food)}
      className="w-full text-left p-4 bg-white hover:bg-slate-50 border border-slate-200
                rounded-xl transition-all duration-200 hover:shadow-md group"
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${ratingColors[worstRating]} mt-2 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          {/* Food Name */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                {food.name_bm}
              </h3>
              <p className="text-sm text-slate-500">{food.name_en}</p>
            </div>
            {isRecent && (
              <TrendingUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
          </div>
          
          {/* Category & Serving */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>
              {food.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-500">
              {food.serving_description}
            </span>
          </div>
          
          {/* Nutrition Summary */}
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-medium">{Math.round(food.calories_kcal)} kcal</span>
            <span className="text-slate-400">•</span>
            <span>{Math.round(food.carbs_g)}g carbs</span>
            {food.protein_g && (
              <>
                <span className="text-slate-400">•</span>
                <span>{Math.round(food.protein_g)}g protein</span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default MalaysianFoodSearch;

