# 🚀 Smart Search - Quick Start Guide

## Get Started in 3 Steps

### Step 1: Import the Service
```typescript
import { searchFoods } from '@/lib/malaysian-foods';
```

### Step 2: Search Foods
```typescript
const result = await searchFoods({
  query: 'low gi nasi',  // Automatically applies Low GI filter
  limit: 20,
});
```

### Step 3: Use Results
```typescript
result.results.forEach(food => {
  console.log(`${food.nameEn} - ${food.caloriesKcal} kcal`);
});

console.log('Filters applied:', result.appliedFilters);
// Output: ['Low GI']
```

---

## ✨ Smart Features

### Automatic Keyword Detection

The search **automatically** detects health keywords:

```typescript
// ✅ Detects "low gi"
searchFoods({ query: 'low gi nasi' })
// Returns only low GI rice dishes

// ✅ Detects "diabetic"
searchFoods({ query: 'diabetic friendly kuih' })
// Returns only diabetic-safe desserts

// ✅ Detects "low sodium"
searchFoods({ query: 'low sodium ayam' })
// Returns only low-sodium chicken dishes

// ✅ Works in Bahasa Malaysia
searchFoods({ query: 'rendah gi nasi' })
// Returns only low GI rice dishes
```

### Supported Keywords

| Health Concern | English Keywords | Bahasa Keywords |
|----------------|------------------|-----------------|
| **Low GI** | `low gi`, `low glycemic` | `rendah gi`, `indeks glikemik rendah` |
| **Diabetes** | `diabetic`, `diabetes`, `diabetic safe` | `kencing manis`, `selamat untuk diabetes` |
| **Hypertension** | `hypertension`, `low sodium` | `darah tinggi`, `rendah sodium` |
| **Cholesterol** | `cholesterol`, `heart healthy` | `kolesterol`, `rendah kolesterol` |
| **CKD** | `ckd`, `kidney`, `renal` | `buah pinggang` |

---

## 🎯 Common Use Cases

### Use Case 1: Diabetic User Searching Breakfast

```typescript
const result = await searchFoods({
  query: 'roti',
  diabeticSafe: true,
  maxCalories: 300,
});

// Returns bread options safe for diabetics under 300 calories
```

### Use Case 2: Hypertensive User Searching Lunch

```typescript
const result = await searchFoods({
  query: 'ayam',
  hypertensionSafe: true,
  maxSodium: 400,
});

// Returns chicken dishes safe for hypertension with low sodium
```

### Use Case 3: User with Multiple Conditions

```typescript
const result = await searchFoods({
  query: 'sayur',
  diabeticSafe: true,
  hypertensionSafe: true,
  cholesterolSafe: true,
});

// Returns vegetables safe for all three conditions
```

### Use Case 4: Calorie-Conscious User

```typescript
const result = await searchFoods({
  query: 'kuih',
  maxCalories: 200,
  maxCarbs: 30,
});

// Returns desserts under 200 calories and 30g carbs
```

---

## 🧰 Convenience Functions

### Quick Low GI Search
```typescript
import { searchLowGIFoods } from '@/lib/malaysian-foods';

const foods = await searchLowGIFoods('nasi', 10);
// Returns 10 low GI rice dishes
```

### Quick Diabetic-Safe Search
```typescript
import { searchDiabeticSafeFoods } from '@/lib/malaysian-foods';

const foods = await searchDiabeticSafeFoods('kuih', 10);
// Returns 10 diabetic-safe desserts
```

### Multi-Condition Search
```typescript
import { searchConditionSafeFoods } from '@/lib/malaysian-foods';

const foods = await searchConditionSafeFoods(
  'ayam',
  ['diabetes', 'hypertension'],
  10
);
// Returns 10 chicken dishes safe for both conditions
```

### Get Recommendations
```typescript
import { getRecommendedFoods } from '@/lib/malaysian-foods';

const recommended = await getRecommendedFoods(
  ['diabetes', 'hypertension'],
  10
);
// Returns 10 popular foods safe for both conditions
```

---

## 🎨 React Component

### Basic Usage

```typescript
import { SmartFoodSearch } from '@/components/food';

function MyPage() {
  const handleSelect = (food) => {
    console.log('Selected:', food.nameEn);
  };

  return (
    <SmartFoodSearch
      onSelectFood={handleSelect}
      placeholder="Search foods..."
      maxResults={20}
    />
  );
}
```

### With User Conditions

```typescript
import { SmartFoodSearch } from '@/components/food';

function MyPage() {
  const userConditions = ['diabetes', 'hypertension'];

  return (
    <SmartFoodSearch
      onSelectFood={(food) => console.log(food)}
      userConditions={userConditions}  // Auto-applies filters
      showFilters={true}
    />
  );
}
```

---

## 🌐 API Route

### Make HTTP Request

```bash
# Basic search
curl "http://localhost:3000/api/foods/smart-search?q=nasi"

# With filters
curl "http://localhost:3000/api/foods/smart-search?q=kuih&diabeticSafe=true&maxCalories=200"

# Multiple constraints
curl "http://localhost:3000/api/foods/smart-search?q=ayam&diabeticSafe=true&hypertensionSafe=true"
```

### Response Format

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "123",
        "nameEn": "Nasi Lemak",
        "nameBm": "Nasi Lemak",
        "caloriesKcal": 400,
        "carbsG": 50,
        "giCategory": "medium",
        "diabetesRating": "caution",
        ...
      }
    ],
    "totalCount": 15,
    "appliedFilters": ["Low GI", "Diabetic Safe"],
    "searchTime": 120
  }
}
```

---

## 🔍 Result Structure

```typescript
interface SmartSearchResult {
  results: MalaysianFood[];      // Array of matching foods
  totalCount: number;             // Total matches in database
  appliedFilters: string[];       // Human-readable filter list
  searchTime: number;             // Query time in milliseconds
}

interface MalaysianFood {
  id: string;
  nameEn: string;                 // English name
  nameBm: string;                 // Bahasa Malaysia name
  category: string;               // e.g., 'rice_dishes', 'noodles'
  servingDescription: string;     // e.g., '1 pinggan', '1 bungkus'
  servingGrams: number;           // Serving size in grams
  caloriesKcal: number;           // Calories per serving
  carbsG: number;                 // Carbs per serving
  giCategory?: 'low' | 'medium' | 'high';
  diabetesRating?: 'safe' | 'caution' | 'limit';
  hypertensionRating?: 'safe' | 'caution' | 'limit';
  cholesterolRating?: 'safe' | 'caution' | 'limit';
  ckdRating?: 'safe' | 'caution' | 'limit';
  // ... more fields
}
```

---

## ⚡ Performance Tips

1. **Use appropriate limits**
   ```typescript
   searchFoods({ query: 'nasi', limit: 10 })  // Faster
   ```

2. **Combine filters for faster queries**
   ```typescript
   searchFoods({ 
     query: 'nasi',
     diabeticSafe: true,  // Reduces result set
     maxCalories: 400,    // Further reduces results
   })
   ```

3. **Check search time**
   ```typescript
   const result = await searchFoods({ query: 'nasi' });
   console.log(`Search took ${result.searchTime}ms`);
   ```

---

## 🛡️ Error Handling

The service **never throws errors** - it always returns a result:

```typescript
// ✅ Safe - always returns an array
const result = await searchFoods({ query: 'invalid' });
if (result.results.length === 0) {
  console.log('No results found');
}

// ✅ Extra safety with try-catch
try {
  const result = await searchFoods({ query: 'nasi' });
  // Use results
} catch (error) {
  // This rarely happens - errors are caught internally
  console.error('Unexpected error:', error);
}
```

---

## 📚 Full Documentation

For complete documentation, see:
- **`lib/malaysian-foods/SMART_SEARCH_USAGE.md`** - Comprehensive guide
- **`lib/malaysian-foods/IMPLEMENTATION_SUMMARY.md`** - Technical details
- **`lib/malaysian-foods/smartSearch.ts`** - Source code

---

## 🎉 You're Ready!

Start using Smart Search now:

```typescript
import { searchFoods } from '@/lib/malaysian-foods';

const result = await searchFoods({ 
  query: 'low gi diabetic safe nasi' 
});

console.log(`Found ${result.totalCount} results`);
console.log('Filters:', result.appliedFilters);
result.results.forEach(food => {
  console.log(`- ${food.nameEn} (${food.caloriesKcal} kcal)`);
});
```

**That's it!** The Smart Search feature is ready to use. 🚀

