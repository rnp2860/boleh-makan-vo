'use client';

// 🔍 Smart Food Search Component
// Uses the Smart Search service for intelligent food filtering

import { useState, useCallback, useEffect } from 'react';
import { searchFoods, SmartSearchResult, MalaysianFood } from '@/lib/malaysian-foods';

interface SmartFoodSearchProps {
  onSelectFood?: (food: MalaysianFood) => void;
  userConditions?: string[];
  placeholder?: string;
  maxResults?: number;
  showFilters?: boolean;
  initialQuery?: string;
}

export function SmartFoodSearch({
  onSelectFood,
  userConditions = [],
  placeholder = 'Search foods (e.g., "low gi nasi", "diabetic friendly kuih")',
  maxResults = 20,
  showFilters = true,
  initialQuery = '',
}: SmartFoodSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<SmartSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isEstimating, setIsEstimating] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResult(null);
      return;
    }

    performSearch(debouncedQuery);
  }, [debouncedQuery]);

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);

    try {
      // Build search options based on user conditions
      const searchOptions: any = {
        query: searchQuery,
        limit: maxResults,
      };

      // Auto-apply condition filters if user has conditions
      if (userConditions.includes('diabetes') || userConditions.includes('type2_diabetes')) {
        searchOptions.diabeticSafe = true;
      }
      if (userConditions.includes('hypertension')) {
        searchOptions.hypertensionSafe = true;
      }
      if (userConditions.includes('dyslipidemia') || userConditions.includes('high_cholesterol')) {
        searchOptions.cholesterolSafe = true;
      }
      if (userConditions.includes('ckd') || userConditions.includes('kidney_disease')) {
        searchOptions.ckdSafe = true;
      }

      const searchResult = await searchFoods(searchOptions);
      setResult(searchResult);
    } catch (error) {
      console.error('[SmartFoodSearch] Search error:', error);
      // Service already handles errors, but log for debugging
    } finally {
      setIsLoading(false);
    }
  }, [maxResults, userConditions]);

  const handleFoodSelect = (food: MalaysianFood) => {
    if (onSelectFood) {
      onSelectFood(food);
    }
    // Optionally clear search after selection
    // setQuery('');
    // setResult(null);
  };

  const handleAIEstimate = async () => {
    setIsEstimating(true);
    try {
      const res = await fetch('/api/ai-estimate-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: debouncedQuery,
          user_conditions: userConditions || []
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.food) {
        const aiFood: MalaysianFood = {
          id: data.food.id,
          nameEn: data.food.nameEn || data.food.food_name,
          nameBm: data.food.nameBm || data.food.food_name,
          aliases: [],
          category: data.food.category || 'snacks',
          tags: data.food.health_tags || [],
          servingDescription: data.food.serving_size || '1 serving',
          servingGrams: 400,
          caloriesKcal: data.food.calories,
          carbsG: data.food.carbs_g,
          sugarG: data.food.sugar_g || 0,
          fiberG: data.food.fiber_g || 0,
          sodiumMg: data.food.sodium_mg || 0,
          totalFatG: data.food.fat_g,
          proteinG: data.food.protein_g,
          popularityScore: 0,
          source: 'ai_estimated',
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any;
        
        // Add extra properties for compatibility
        (aiFood as any).dr_reza_analysis = data.food.dr_reza_analysis;
        (aiFood as any).analysis_content = data.food.analysis_content;
        (aiFood as any).halal_status = data.food.halal_status;
        (aiFood as any).health_tags = data.food.health_tags;
        (aiFood as any).is_potentially_pork = data.food.is_potentially_pork;
        (aiFood as any).risk_analysis = data.food.risk_analysis;
        
        if (onSelectFood) {
          onSelectFood(aiFood);
        }
      } else {
        alert(data.error || 'AI estimation failed. Please try a more specific food name.');
      }
    } catch (err) {
      console.error('AI estimation error:', err);
      alert('Failed to estimate food. Please check your connection and try again.');
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Applied Filters */}
      {showFilters && result && result.appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filters:</span>
          {result.appliedFilters.map((filter, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full"
            >
              {filter}
            </span>
          ))}
        </div>
      )}

      {/* Search Results */}
      {result && (
        <div className="space-y-2">
          {/* Results Header */}
          {result.results.length > 0 && (
            <div className="text-sm text-gray-600">
              Found {result.totalCount} result{result.totalCount !== 1 ? 's' : ''} 
              {result.searchTime && ` in ${result.searchTime}ms`}
            </div>
          )}

          {/* AI Fallback - Show when no DB results */}
          {result.results.length === 0 && debouncedQuery.length > 2 && !isLoading && (
            <div className="p-6 text-center space-y-4">
              <div className="text-slate-400">
                <p className="font-semibold mb-2 text-slate-600">❌ Not in our database</p>
                <p className="text-sm">
                  We have 1,600+ Malaysian foods verified, but "<span className="font-semibold text-slate-700">{debouncedQuery}</span>" isn't one of them yet.
                </p>
              </div>
              
              <button
                onClick={handleAIEstimate}
                disabled={isEstimating}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-bold text-sm hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEstimating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Dr. Reza sedang kira...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>Ask Dr. Reza to Estimate</span>
                  </>
                )}
              </button>
              
              <p className="text-xs text-slate-400">
                AI will estimate nutrition based on typical recipes
              </p>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleFoodSelect(food)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Food Name */}
                    <h3 className="font-semibold text-gray-900">
                      {food.nameEn}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {food.nameBm}
                    </p>

                    {/* Serving Info */}
                    <p className="text-xs text-gray-500 mt-1">
                      {food.servingDescription} ({food.servingGrams}g)
                    </p>

                    {/* Nutrition Summary */}
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="font-medium text-gray-700">
                        {food.caloriesKcal} kcal
                      </span>
                      <span className="text-gray-600">
                        {food.carbsG}g carbs
                      </span>
                      {food.proteinG && (
                        <span className="text-gray-600">
                          {food.proteinG}g protein
                        </span>
                      )}
                    </div>

                    {/* Health Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {food.giCategory === 'low' && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                          Low GI
                        </span>
                      )}
                      {food.diabetesRating === 'safe' && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          Diabetic Safe
                        </span>
                      )}
                      {food.hypertensionRating === 'safe' && (
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                          Low Sodium
                        </span>
                      )}
                      {food.verified && (
                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category Icon */}
                  <div className="ml-4 text-2xl">
                    {getCategoryIcon(food.category)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!query && !result && (
        <div className="text-sm text-gray-500 space-y-2 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">💡 Search Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Try "low gi nasi" for low glycemic index rice dishes</li>
            <li>Search "diabetic friendly kuih" for safe desserts</li>
            <li>Use "low sodium ayam" for hypertension-friendly chicken</li>
            <li>Type in English or Bahasa Malaysia</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function to get category icon
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
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
  return icons[category] || '🍽️';
}

