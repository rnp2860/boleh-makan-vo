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

          {/* No Results */}
          {result.results.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No foods found</p>
              <p className="text-sm">
                Try different keywords or remove some filters
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

