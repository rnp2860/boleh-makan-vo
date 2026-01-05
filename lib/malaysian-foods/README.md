# 🇲🇾 Malaysian Foods - Smart Search Module

A comprehensive food search system with intelligent health filtering for Malaysian foods.

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Components](#-components)
- [Examples](#-examples)
- [Testing](#-testing)
- [Architecture](#-architecture)

---

## 🚀 Quick Start

```typescript
import { searchFoods } from '@/lib/malaysian-foods';

// Simple search
const result = await searchFoods({ query: 'nasi lemak' });

// Smart search with automatic keyword detection
const result = await searchFoods({ query: 'low gi nasi' });
// Automatically filters for low GI foods

// With explicit filters
const result = await searchFoods({
  query: 'kuih',
  diabeticSafe: true,
  maxCalories: 200,
});
```

---

## ✨ Features

### 🧠 Semantic Keyword Detection
Automatically detects health-related keywords in queries:
- **Low GI**: `low gi`, `rendah gi`
- **Diabetic-Safe**: `diabetic`, `kencing manis`
- **Hypertension-Safe**: `low sodium`, `darah tinggi`
- **Cholesterol-Safe**: `heart healthy`, `kolesterol`
- **CKD-Safe**: `kidney`, `buah pinggang`

### 🎯 Flexible Filtering
- GI category filtering (low, medium, high)
- Condition-based filtering (diabetes, hypertension, cholesterol, CKD)
- Nutritional constraints (max calories, carbs, sodium)
- Category and tag filtering

### 🔒 Safety First
- **Read-only operations** - no database writes
- **Error handling** - returns empty array on failure
- **Type-safe** - full TypeScript support
- **Input validation** - sanitized queries

### ⚡ Performance
- Optimized database queries
- Configurable result limits
- Query time tracking
- Efficient filtering

---

## 📦 Installation

The module is already integrated into your project. No additional installation needed.

### File Structure

```
lib/malaysian-foods/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript types
├── utils.ts                    # Utility functions
├── queries.ts                  # Database queries
├── smartSearch.ts              # Smart search service ⭐
├── SMART_SEARCH_USAGE.md       # Comprehensive guide
├── IMPLEMENTATION_SUMMARY.md   # Technical details
└── __tests__/
    └── smartSearch.test.ts     # Test suite
```

---

## 💻 Usage

### Basic Search

```typescript
import { searchFoods } from '@/lib/malaysian-foods';

const result = await searchFoods({
  query: 'nasi lemak',
  limit: 20,
});

console.log(result.results);        // Array of foods
console.log(result.totalCount);     // Total matches
console.log(result.appliedFilters); // Applied filters
console.log(result.searchTime);     // Query time (ms)
```

### Semantic Search

```typescript
// Automatically applies Low GI filter
const result = await searchFoods({
  query: 'low gi nasi',
});

// Automatically applies Diabetic Safe filter
const result = await searchFoods({
  query: 'diabetic friendly kuih',
});

// Combines multiple filters
const result = await searchFoods({
  query: 'low gi diabetic safe noodles',
});
```

### Explicit Filters

```typescript
const result = await searchFoods({
  query: 'ayam',
  diabeticSafe: true,
  hypertensionSafe: true,
  cholesterolSafe: true,
  maxCalories: 400,
  maxSodium: 500,
  limit: 15,
});
```

### Convenience Functions

```typescript
import {
  searchLowGIFoods,
  searchDiabeticSafeFoods,
  searchConditionSafeFoods,
  getRecommendedFoods,
} from '@/lib/malaysian-foods';

// Low GI foods
const lowGI = await searchLowGIFoods('nasi', 10);

// Diabetic-safe foods
const diabeticSafe = await searchDiabeticSafeFoods('kuih', 10);

// Multi-condition safe foods
const multiCondition = await searchConditionSafeFoods(
  'ayam',
  ['diabetes', 'hypertension'],
  10
);

// Recommended foods for user
const recommended = await getRecommendedFoods(
  ['diabetes', 'hypertension'],
  10
);
```

---

## 📖 API Reference

### `searchFoods(options)`

Main search function with semantic filtering.

**Parameters:**
```typescript
interface SmartSearchOptions {
  query: string;                 // Search query (required)
  limit?: number;                // Max results (default: 20)
  
  // Semantic filters
  lowGIOnly?: boolean;           // Only low GI foods
  diabeticSafe?: boolean;        // Only diabetic-safe foods
  hypertensionSafe?: boolean;    // Only hypertension-safe foods
  cholesterolSafe?: boolean;     // Only cholesterol-safe foods
  ckdSafe?: boolean;             // Only CKD-safe foods
  
  // Nutritional constraints
  maxCalories?: number;          // Max calories per serving
  maxCarbs?: number;             // Max carbs per serving
  maxSodium?: number;            // Max sodium per serving
  
  // Category filter
  category?: string;             // Food category
  tags?: string[];               // Food tags
}
```

**Returns:**
```typescript
interface SmartSearchResult {
  results: MalaysianFood[];      // Matching foods
  totalCount: number;             // Total matches
  appliedFilters: string[];       // Applied filter names
  searchTime: number;             // Query time (ms)
}
```

### `searchLowGIFoods(query, limit?)`

Quick search for low GI foods only.

**Parameters:**
- `query: string` - Search query
- `limit?: number` - Max results (default: 20)

**Returns:** `Promise<MalaysianFood[]>`

### `searchDiabeticSafeFoods(query, limit?)`

Quick search for diabetic-safe foods only.

**Parameters:**
- `query: string` - Search query
- `limit?: number` - Max results (default: 20)

**Returns:** `Promise<MalaysianFood[]>`

### `searchConditionSafeFoods(query, conditions, limit?)`

Search for foods safe for multiple conditions.

**Parameters:**
- `query: string` - Search query
- `conditions: Array<'diabetes' | 'hypertension' | 'cholesterol' | 'ckd'>` - Conditions
- `limit?: number` - Max results (default: 20)

**Returns:** `Promise<MalaysianFood[]>`

### `getRecommendedFoods(conditions, limit?)`

Get popular foods safe for specified conditions.

**Parameters:**
- `conditions: Array<'diabetes' | 'hypertension' | 'cholesterol' | 'ckd'>` - Conditions
- `limit?: number` - Max results (default: 10)

**Returns:** `Promise<MalaysianFood[]>`

---

## 🎨 Components

### `<SmartFoodSearch />`

React component with debounced search and visual feedback.

**Props:**
```typescript
interface SmartFoodSearchProps {
  onSelectFood?: (food: MalaysianFood) => void;
  userConditions?: string[];
  placeholder?: string;
  maxResults?: number;
  showFilters?: boolean;
}
```

**Usage:**
```typescript
import { SmartFoodSearch } from '@/components/food';

function MyPage() {
  return (
    <SmartFoodSearch
      onSelectFood={(food) => console.log(food)}
      userConditions={['diabetes', 'hypertension']}
      maxResults={20}
      showFilters={true}
    />
  );
}
```

---

## 📝 Examples

### Example 1: Diabetic User Searching Breakfast

```typescript
const result = await searchFoods({
  query: 'roti',
  diabeticSafe: true,
  maxCalories: 300,
  limit: 10,
});
```

### Example 2: Hypertensive User Searching Lunch

```typescript
const result = await searchFoods({
  query: 'ayam',
  hypertensionSafe: true,
  maxSodium: 400,
  limit: 10,
});
```

### Example 3: User with Multiple Conditions

```typescript
const result = await searchFoods({
  query: 'sayur',
  diabeticSafe: true,
  hypertensionSafe: true,
  cholesterolSafe: true,
  limit: 10,
});
```

### Example 4: Meal Planning

```typescript
// Get recommended breakfast foods
const breakfast = await getRecommendedFoods(['diabetes'], 5);

// Search for low-calorie snacks
const snacks = await searchFoods({
  query: 'kuih',
  maxCalories: 150,
  category: 'snacks',
  limit: 10,
});
```

---

## 🧪 Testing

### Run Tests

```bash
npm test smartSearch.test.ts
```

### Test Coverage

- ✅ Basic search functionality
- ✅ Semantic keyword detection
- ✅ Explicit filters
- ✅ Nutritional constraints
- ✅ Convenience functions
- ✅ Error handling
- ✅ Performance benchmarks
- ✅ Integration scenarios

### Manual Testing

```typescript
// Test 1: Basic search
const test1 = await searchFoods({ query: 'nasi' });
console.assert(test1.results.length > 0);

// Test 2: Low GI filter
const test2 = await searchFoods({ query: 'nasi', lowGIOnly: true });
console.assert(test2.results.every(f => f.giCategory === 'low'));

// Test 3: Semantic detection
const test3 = await searchFoods({ query: 'low gi nasi' });
console.assert(test3.appliedFilters.includes('Low GI'));
```

---

## 🏗️ Architecture

### Data Flow

```
User Query
    ↓
Semantic Keyword Detection
    ↓
Query Cleaning
    ↓
Database Query (Supabase)
    ↓
Filter Application
    ↓
Result Transformation
    ↓
Return Results
```

### Database Schema

```sql
-- malaysian_foods table
CREATE TABLE malaysian_foods (
  id UUID PRIMARY KEY,
  name_en VARCHAR NOT NULL,
  name_bm VARCHAR NOT NULL,
  aliases TEXT[],
  category VARCHAR NOT NULL,
  tags TEXT[],
  
  -- Nutrition
  calories_kcal NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  sugar_g NUMERIC,
  fiber_g NUMERIC,
  sodium_mg NUMERIC,
  protein_g NUMERIC,
  
  -- Health Ratings
  gi_category VARCHAR,
  diabetes_rating VARCHAR,
  hypertension_rating VARCHAR,
  cholesterol_rating VARCHAR,
  ckd_rating VARCHAR,
  
  -- Metadata
  popularity_score INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  source VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Type System

```typescript
// Core types
type GICategory = 'low' | 'medium' | 'high';
type ConditionRating = 'safe' | 'caution' | 'limit';
type FoodCategory = 'rice_dishes' | 'noodles' | 'breads' | ...;

// Main interface
interface MalaysianFood {
  id: string;
  nameEn: string;
  nameBm: string;
  category: FoodCategory;
  caloriesKcal: number;
  carbsG: number;
  giCategory?: GICategory;
  diabetesRating?: ConditionRating;
  // ... more fields
}
```

---

## 📚 Documentation

### Complete Guides

1. **[SMART_SEARCH_USAGE.md](./SMART_SEARCH_USAGE.md)** - Comprehensive usage guide
2. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
3. **[SMART_SEARCH_QUICKSTART.md](../../SMART_SEARCH_QUICKSTART.md)** - Quick start guide
4. **[examples/smart-search-example.tsx](../../examples/smart-search-example.tsx)** - Live examples

### Quick Links

- [API Reference](#-api-reference)
- [Components](#-components)
- [Examples](#-examples)
- [Testing](#-testing)

---

## 🤝 Support

### Common Issues

**No results found:**
- Verify `malaysian_foods` table exists
- Check Supabase connection
- Review console logs

**Slow queries:**
- Reduce limit parameter
- Check database indexes
- Monitor `searchTime` in results

**Filters not working:**
- Verify column values in database
- Check that data is properly seeded
- Review `appliedFilters` in results

### Debug Mode

```typescript
const result = await searchFoods({ query: 'nasi' });
console.log('Debug:', {
  query: 'nasi',
  resultsCount: result.results.length,
  totalCount: result.totalCount,
  appliedFilters: result.appliedFilters,
  searchTime: result.searchTime,
  firstResult: result.results[0]?.nameEn,
});
```

---

## 📊 Performance

### Benchmarks

- Simple search: ~50-200ms
- Filtered search: ~100-300ms
- Multiple constraints: ~150-400ms

### Optimization Tips

1. Use appropriate limits (default: 20)
2. Combine filters for smaller result sets
3. Cache popular queries
4. Monitor search time

---

## 🎯 Best Practices

### DO ✅

```typescript
// Use semantic keywords
searchFoods({ query: 'low gi nasi' })

// Combine filters
searchFoods({ 
  query: 'ayam',
  diabeticSafe: true,
  maxCalories: 400 
})

// Check results
if (result.results.length === 0) {
  console.log('No results found');
}
```

### DON'T ❌

```typescript
// Don't use empty queries
searchFoods({ query: '' })  // Returns empty array

// Don't use excessive limits
searchFoods({ query: 'nasi', limit: 1000 })  // Slow

// Don't ignore errors
const result = await searchFoods({ query: 'test' });
// Always check result.results.length
```

---

## 🔄 Version History

### v1.0.0 (2026-01-05)
- ✅ Initial release
- ✅ Semantic keyword detection
- ✅ Explicit filters
- ✅ Nutritional constraints
- ✅ Convenience functions
- ✅ React component
- ✅ API route
- ✅ Comprehensive tests
- ✅ Full documentation

---

## 📄 License

Part of the Boleh Makan project.

---

## 🙏 Acknowledgments

Built with:
- Next.js
- TypeScript
- Supabase
- React

---

**Ready to use!** Start with the [Quick Start](#-quick-start) guide above. 🚀

