// 📝 Smart Search - Complete Integration Example
// This file shows how to integrate Smart Search into your app

'use client';

import { useState } from 'react';
import { SmartFoodSearch } from '@/components/food';
import { searchFoods, MalaysianFood } from '@/lib/malaysian-foods';

// ============================================
// EXAMPLE 1: Basic Component Usage
// ============================================

export function Example1_BasicUsage() {
  const [selectedFood, setSelectedFood] = useState<MalaysianFood | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Malaysian Foods</h1>
      
      <SmartFoodSearch
        onSelectFood={setSelectedFood}
        placeholder="Try: 'low gi nasi', 'diabetic friendly kuih'"
        maxResults={20}
        showFilters={true}
      />

      {selectedFood && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <h2 className="font-semibold text-lg">{selectedFood.nameEn}</h2>
          <p className="text-gray-600">{selectedFood.nameBm}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Calories: {selectedFood.caloriesKcal} kcal</p>
            <p>Carbs: {selectedFood.carbsG}g</p>
            {selectedFood.giCategory && (
              <p>GI Category: {selectedFood.giCategory}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 2: With User Conditions
// ============================================

export function Example2_WithConditions() {
  const [selectedFood, setSelectedFood] = useState<MalaysianFood | null>(null);
  
  // Simulate user conditions (in real app, get from user profile)
  const userConditions = ['diabetes', 'hypertension'];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Personalized Food Search</h1>
        <p className="text-sm text-gray-600">
          Showing foods safe for: {userConditions.join(', ')}
        </p>
      </div>
      
      <SmartFoodSearch
        onSelectFood={setSelectedFood}
        userConditions={userConditions}  // Auto-applies condition filters
        placeholder="Search foods safe for your conditions..."
        maxResults={15}
        showFilters={true}
      />

      {selectedFood && (
        <FoodDetailCard food={selectedFood} />
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 3: Direct Service Usage (No Component)
// ============================================

export function Example3_DirectService() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MalaysianFood[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await searchFoods({
        query,
        limit: 10,
        // Optional explicit filters
        diabeticSafe: true,
        maxCalories: 500,
      });

      setResults(result.results);
      setFilters(result.appliedFilters);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Search Implementation</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search foods..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {filters.length > 0 && (
        <div className="mb-4 flex gap-2">
          {filters.map((filter, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
            >
              {filter}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {results.map((food) => (
          <div key={food.id} className="p-4 border rounded-lg hover:border-emerald-500">
            <h3 className="font-semibold">{food.nameEn}</h3>
            <p className="text-sm text-gray-600">{food.nameBm}</p>
            <p className="text-sm text-gray-500 mt-1">
              {food.caloriesKcal} kcal • {food.carbsG}g carbs
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Advanced Filtering
// ============================================

export function Example4_AdvancedFiltering() {
  const [results, setResults] = useState<MalaysianFood[]>([]);
  const [filters, setFilters] = useState({
    lowGI: false,
    diabeticSafe: false,
    maxCalories: 500,
    maxCarbs: 50,
  });

  const handleSearch = async (query: string) => {
    const result = await searchFoods({
      query,
      lowGIOnly: filters.lowGI,
      diabeticSafe: filters.diabeticSafe,
      maxCalories: filters.maxCalories,
      maxCarbs: filters.maxCarbs,
      limit: 20,
    });

    setResults(result.results);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Advanced Food Search</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Filters Panel */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold">Filters</h2>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.lowGI}
              onChange={(e) => setFilters({ ...filters, lowGI: e.target.checked })}
              className="rounded"
            />
            <span>Low GI Only</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.diabeticSafe}
              onChange={(e) => setFilters({ ...filters, diabeticSafe: e.target.checked })}
              className="rounded"
            />
            <span>Diabetic Safe</span>
          </label>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Calories: {filters.maxCalories}
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={filters.maxCalories}
              onChange={(e) => setFilters({ ...filters, maxCalories: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Carbs: {filters.maxCarbs}g
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={filters.maxCarbs}
              onChange={(e) => setFilters({ ...filters, maxCarbs: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <input
            type="text"
            placeholder="Search foods..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Results Panel */}
        <div className="space-y-2">
          <h2 className="font-semibold">{results.length} Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((food) => (
              <div key={food.id} className="p-3 border rounded-lg">
                <h3 className="font-medium">{food.nameEn}</h3>
                <div className="text-xs text-gray-600 mt-1">
                  {food.caloriesKcal} kcal • {food.carbsG}g carbs
                  {food.giCategory && ` • ${food.giCategory} GI`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Meal Planning Assistant
// ============================================

export function Example5_MealPlanning() {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<MalaysianFood[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const handleAddFood = (food: MalaysianFood) => {
    setSelectedFoods([...selectedFoods, food]);
    setTotalCalories(totalCalories + food.caloriesKcal);
  };

  const handleRemoveFood = (index: number) => {
    const food = selectedFoods[index];
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
    setTotalCalories(totalCalories - food.caloriesKcal);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meal Planning Assistant</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Panel */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <SmartFoodSearch
            onSelectFood={handleAddFood}
            placeholder={`Search ${mealType} foods...`}
            maxResults={10}
            showFilters={true}
          />
        </div>

        {/* Meal Summary Panel */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-4">
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Plan
          </h2>

          {selectedFoods.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No foods added yet. Search and select foods to add to your meal.
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {selectedFoods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{food.nameEn}</p>
                      <p className="text-xs text-gray-600">
                        {food.caloriesKcal} kcal • {food.carbsG}g carbs
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFood(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Calories:</span>
                  <span>{totalCalories} kcal</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Total Carbs:</span>
                  <span>
                    {selectedFoods.reduce((sum, f) => sum + f.carbsG, 0).toFixed(1)}g
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENT: Food Detail Card
// ============================================

function FoodDetailCard({ food }: { food: MalaysianFood }) {
  return (
    <div className="mt-6 p-6 bg-white border-2 border-emerald-200 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{food.nameEn}</h2>
          <p className="text-gray-600">{food.nameBm}</p>
          <p className="text-sm text-gray-500 mt-1">
            {food.servingDescription} ({food.servingGrams}g)
          </p>
        </div>
        <span className="text-3xl">{getCategoryIcon(food.category)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Calories</p>
          <p className="text-lg font-semibold">{food.caloriesKcal} kcal</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Carbs</p>
          <p className="text-lg font-semibold">{food.carbsG}g</p>
        </div>
        {food.proteinG && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Protein</p>
            <p className="text-lg font-semibold">{food.proteinG}g</p>
          </div>
        )}
        {food.totalFatG && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Fat</p>
            <p className="text-lg font-semibold">{food.totalFatG}g</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {food.giCategory === 'low' && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Low GI
          </span>
        )}
        {food.diabetesRating === 'safe' && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Diabetic Safe
          </span>
        )}
        {food.hypertensionRating === 'safe' && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Low Sodium
          </span>
        )}
        {food.verified && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
            ✓ Verified
          </span>
        )}
      </div>
    </div>
  );
}

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

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export default function SmartSearchExamples() {
  const [activeExample, setActiveExample] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold mb-4">Smart Search Examples</h1>
          <div className="flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setActiveExample(num)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeExample === num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Example {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeExample === 1 && <Example1_BasicUsage />}
        {activeExample === 2 && <Example2_WithConditions />}
        {activeExample === 3 && <Example3_DirectService />}
        {activeExample === 4 && <Example4_AdvancedFiltering />}
        {activeExample === 5 && <Example5_MealPlanning />}
      </div>
    </div>
  );
}

