# 🔍 Smart Search Usage Guide

## Overview

The Smart Search service provides intelligent filtering for the `malaysian_foods` table with semantic understanding of health-related queries. It automatically detects keywords like "low gi", "diabetic safe", and applies appropriate filters.

## Key Features

✅ **READ-ONLY**: No database writes, only queries  
✅ **Semantic Filtering**: Understands natural language health queries  
✅ **Error Handling**: Returns empty array on failure  
✅ **Service Layer**: Separated from UI components  
✅ **No Schema Changes**: Works with existing database structure  

---

## Basic Usage

### 1. Simple Text Search

```typescript
import { searchFoods } from '@/lib/malaysian-foods';

// Basic search
const result = await searchFoods({
  query: 'nasi lemak',
  limit: 10,
});

console.log(result.results); // Array of MalaysianFood
console.log(result.totalCount); // Total matching records
console.log(result.appliedFilters); // Which filters were applied
```

### 2. Semantic Search (Auto-Detection)

The service automatically detects health-related keywords:

```typescript
// Automatically applies low GI filter
const lowGI = await searchFoods({
  query: 'low gi nasi',
});

// Automatically applies diabetic-safe filter
const diabeticSafe = await searchFoods({
  query: 'diabetic friendly kuih',
});

// Combines filters
const result = await searchFoods({
  query: 'low gi diabetic safe noodles',
});
// Returns: noodles that are both low GI AND diabetic safe
```

### 3. Explicit Filters

```typescript
// Explicit low GI filter
const result = await searchFoods({
  query: 'roti',
  lowGIOnly: true,
  limit: 20,
});

// Multiple condition filters
const result = await searchFoods({
  query: 'ayam',
  diabeticSafe: true,
  hypertensionSafe: true,
  cholesterolSafe: true,
});
```

### 4. Nutritional Constraints

```typescript
// Max calories constraint
const result = await searchFoods({
  query: 'kuih',
  maxCalories: 200,
  limit: 15,
});

// Multiple constraints
const result = await searchFoods({
  query: 'nasi',
  maxCalories: 400,
  maxCarbs: 50,
  maxSodium: 500,
});
```

---

## Convenience Functions

### Search Low GI Foods

```typescript
import { searchLowGIFoods } from '@/lib/malaysian-foods';

const foods = await searchLowGIFoods('nasi', 10);
// Returns only low GI foods matching "nasi"
```

### Search Diabetic-Safe Foods

```typescript
import { searchDiabeticSafeFoods } from '@/lib/malaysian-foods';

const foods = await searchDiabeticSafeFoods('kuih', 10);
// Returns only diabetic-safe foods matching "kuih"
```

### Search Condition-Safe Foods

```typescript
import { searchConditionSafeFoods } from '@/lib/malaysian-foods';

// Foods safe for multiple conditions
const foods = await searchConditionSafeFoods(
  'ayam goreng',
  ['diabetes', 'hypertension'],
  10
);
```

### Get Recommended Foods

```typescript
import { getRecommendedFoods } from '@/lib/malaysian-foods';

// Get popular foods safe for user's conditions
const recommended = await getRecommendedFoods(
  ['diabetes', 'hypertension', 'cholesterol'],
  10
);
// Returns top 10 popular foods safe for all 3 conditions
```

---

## Integration Examples

### Example 1: Search Component

```typescript
'use client';

import { useState } from 'react';
import { searchFoods, SmartSearchResult } from '@/lib/malaysian-foods';

export function FoodSearchComponent() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SmartSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResult = await searchFoods({
        query,
        limit: 20,
      });
      setResult(searchResult);
    } catch (error) {
      console.error('Search failed:', error);
      // Error already handled - empty results returned
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search foods (e.g., 'low gi nasi')"
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>

      {result && (
        <div>
          <p>Found {result.totalCount} results in {result.searchTime}ms</p>
          {result.appliedFilters.length > 0 && (
            <div>
              Filters: {result.appliedFilters.join(', ')}
            </div>
          )}
          
          <ul>
            {result.results.map((food) => (
              <li key={food.id}>
                {food.nameEn} - {food.caloriesKcal} kcal
                {food.giCategory && ` (${food.giCategory} GI)`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Example 2: API Route

```typescript
// app/api/smart-search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { searchFoods } from '@/lib/malaysian-foods';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const lowGI = searchParams.get('lowGI') === 'true';
  const diabeticSafe = searchParams.get('diabeticSafe') === 'true';
  
  const result = await searchFoods({
    query,
    lowGIOnly: lowGI,
    diabeticSafe,
    limit: 20,
  });
  
  return NextResponse.json(result);
}
```

### Example 3: Personalized Search

```typescript
import { searchFoods } from '@/lib/malaysian-foods';

async function searchForUser(query: string, userConditions: string[]) {
  const options: any = {
    query,
    limit: 20,
  };
  
  // Apply filters based on user's conditions
  if (userConditions.includes('diabetes')) {
    options.diabeticSafe = true;
  }
  if (userConditions.includes('hypertension')) {
    options.hypertensionSafe = true;
  }
  if (userConditions.includes('dyslipidemia')) {
    options.cholesterolSafe = true;
  }
  if (userConditions.includes('ckd')) {
    options.ckdSafe = true;
  }
  
  return await searchFoods(options);
}

// Usage
const userConditions = ['diabetes', 'hypertension'];
const result = await searchForUser('nasi', userConditions);
```

---

## Semantic Keywords Supported

### Low GI
- `low gi`
- `low glycemic`
- `rendah gi`
- `indeks glikemik rendah`

### Diabetic-Safe
- `diabetic`
- `diabetes`
- `diabetic safe`
- `diabetic friendly`
- `safe for diabetes`
- `kencing manis`
- `selamat untuk diabetes`

### Hypertension-Safe
- `hypertension`
- `high blood pressure`
- `low sodium`
- `darah tinggi`
- `rendah sodium`
- `hipertensi`

### Cholesterol-Safe
- `cholesterol`
- `low cholesterol`
- `heart healthy`
- `kolesterol`
- `rendah kolesterol`

### CKD-Safe
- `ckd`
- `kidney`
- `renal`
- `buah pinggang`

---

## Response Structure

```typescript
interface SmartSearchResult {
  results: MalaysianFood[];      // Array of matching foods
  totalCount: number;             // Total matches in database
  appliedFilters: string[];       // Human-readable filter list
  searchTime: number;             // Query time in milliseconds
}

interface MalaysianFood {
  id: string;
  nameEn: string;
  nameBm: string;
  category: FoodCategory;
  servingDescription: string;
  servingGrams: number;
  caloriesKcal: number;
  carbsG: number;
  giCategory?: 'low' | 'medium' | 'high';
  diabetesRating?: 'safe' | 'caution' | 'limit';
  hypertensionRating?: 'safe' | 'caution' | 'limit';
  cholesterolRating?: 'safe' | 'caution' | 'limit';
  ckdRating?: 'safe' | 'caution' | 'limit';
  // ... more fields
}
```

---

## Error Handling

The service includes comprehensive error handling:

```typescript
// ✅ GOOD: Always returns a result, never throws
const result = await searchFoods({ query: 'invalid' });
// If error occurs: result.results = []

// ✅ GOOD: Check for empty results
if (result.results.length === 0) {
  console.log('No results found or error occurred');
}

// ✅ GOOD: Use try-catch for extra safety
try {
  const result = await searchFoods({ query: 'nasi' });
  // Handle results
} catch (error) {
  // This should rarely happen as errors are caught internally
  console.error('Unexpected error:', error);
}
```

---

## Performance Tips

1. **Use appropriate limits**: Default is 20, max recommended is 50
2. **Combine filters**: More filters = faster queries (smaller result set)
3. **Cache popular queries**: Consider caching common searches
4. **Monitor search time**: Use `result.searchTime` to track performance

---

## Testing Examples

```typescript
// Test 1: Basic search
const test1 = await searchFoods({ query: 'nasi lemak' });
console.assert(test1.results.length > 0, 'Should find nasi lemak');

// Test 2: Low GI filter
const test2 = await searchFoods({ query: 'nasi', lowGIOnly: true });
console.assert(
  test2.results.every(f => f.giCategory === 'low'),
  'All results should be low GI'
);

// Test 3: Semantic detection
const test3 = await searchFoods({ query: 'low gi nasi' });
console.assert(
  test3.appliedFilters.includes('Low GI'),
  'Should auto-detect low GI filter'
);

// Test 4: Empty query
const test4 = await searchFoods({ query: '' });
console.assert(test4.results.length === 0, 'Empty query returns no results');

// Test 5: Error handling
const test5 = await searchFoods({ query: 'test' });
console.assert(Array.isArray(test5.results), 'Always returns array');
```

---

## Database Schema Reference

The service queries these columns from `malaysian_foods`:

```sql
-- Identity
name_en, name_bm, aliases

-- Categorization
category, tags

-- Nutrition
calories_kcal, carbs_g, sugar_g, fiber_g, sodium_mg, 
total_fat_g, saturated_fat_g, protein_g

-- Health Ratings
gi_category ('low' | 'medium' | 'high')
diabetes_rating ('safe' | 'caution' | 'limit')
hypertension_rating ('safe' | 'caution' | 'limit')
cholesterol_rating ('safe' | 'caution' | 'limit')
ckd_rating ('safe' | 'caution' | 'limit')

-- Metadata
popularity_score, verified, source
```

---

## Migration from Old Search

If you have existing search code, here's how to migrate:

```typescript
// OLD (basic search)
const { data } = await supabase
  .from('malaysian_foods')
  .select('*')
  .ilike('name_en', `%${query}%`);

// NEW (smart search)
const result = await searchFoods({ query });
const data = result.results;

// OLD (manual filtering)
const { data } = await supabase
  .from('malaysian_foods')
  .select('*')
  .eq('gi_category', 'low')
  .eq('diabetes_rating', 'safe');

// NEW (semantic search)
const result = await searchFoods({
  query: 'low gi diabetic safe',
});
```

---

## Support

For issues or questions:
1. Check that `malaysian_foods` table exists
2. Verify Supabase connection in `lib/supabase.ts`
3. Check console logs for detailed error messages
4. Ensure database has proper indexes for performance

---

## Summary

✅ **Simple**: Just call `searchFoods()` with your query  
✅ **Smart**: Automatically detects health keywords  
✅ **Safe**: Read-only, error-handled, returns empty array on failure  
✅ **Fast**: Optimized queries with proper indexing  
✅ **Flexible**: Multiple convenience functions for common use cases  

Start with basic usage and add filters as needed!

