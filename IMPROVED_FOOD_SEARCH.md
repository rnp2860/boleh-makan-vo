# 🔍 Improved Malaysian Food Search

## Overview

Enhanced search functionality for the Boleh Makan app with better fuzzy matching, compound dish support, and intelligent suggestions. Now users can find their favorite Malaysian foods more easily, even with partial names, misspellings, or different word orders.

## Key Improvements

### 1. **Compound Dish Matching** 🍛
Users can now search for dishes with multiple components:
- **"nasi lemak rendang"** → Finds "Nasi Lemak Rendang Ayam"
- **"ayam goreng"** → Finds all fried chicken dishes
- **"mee goreng mamak"** → Finds Mamak-style fried noodles

### 2. **Flexible Word Order** 🔄
Search terms work in any order:
- **"ayam goreng"** = **"goreng ayam"**
- **"rendang nasi lemak"** = **"nasi lemak rendang"**

### 3. **Partial Word Matching** 🎯
Find foods by partial names:
- **"goreng"** → All fried dishes (Mee Goreng, Nasi Goreng, Ayam Goreng, etc.)
- **"lemak"** → All Nasi Lemak variations
- **"rendang"** → All Rendang dishes

### 4. **Common Misspellings** ✍️
Handles common variations and typos:
- **"roti chanai"** → "Roti Canai"
- **"nasik lemak"** → "Nasi Lemak"
- **"teh tarek"** → "Teh Tarik"

### 5. **Alias Matching** 🏷️
Popular abbreviations and nicknames:
- **"CKT"** → Char Kuey Teow
- **"BKT"** → Bak Kut Teh
- **"YTF"** → Yong Tau Foo

### 6. **Smart Suggestions** 💡
Helpful hints when:
- Starting to type (shows popular foods)
- No results found (suggests alternatives)
- Misspelled words (shows "Did you mean...")

## Architecture

### Backend (Database)

**Enhanced Search Function:**
```sql
search_malaysian_foods(search_term TEXT, limit_count INTEGER)
```

**Features:**
- Multi-word tokenization
- Word order independence
- Fuzzy matching with priority ranking
- Alias support
- Performance optimized with indexes

**Priority Ranking:**
1. Exact matches (highest)
2. Alias matches
3. Starts with query
4. All words present (compound matching)
5. Contains query
6. Partial word matches
7. Full-text search (fallback)

### Frontend Components

#### SearchSuggestions Component
```typescript
<SearchSuggestions 
  query={query}
  onSuggestionClick={(suggestion) => setQuery(suggestion)}
/>
```

**Features:**
- Category-based suggestions
- Popular searches
- "Did you mean" corrections
- Context-aware hints

#### Updated Food Search Components
- `FoodSearch.tsx` - Inline search with dropdown
- `MalaysianFoodSearch.tsx` - Full-page search modal

Both now include:
- Search suggestions
- Better empty states
- Improved result ranking

## Database Schema Additions

### Aliases Field
```sql
aliases TEXT[] -- Array of alternative names, abbreviations, misspellings
```

### Examples:
```sql
-- Char Kuey Teow
aliases: ['ckt', 'char koay teow', 'fried flat noodles']

-- Nasi Lemak
aliases: ['nasik lemak', 'nasi lemak biasa', 'coconut rice']

-- Roti Canai
aliases: ['roti chanai', 'roti chennai', 'prata', 'paratha']
```

## Usage Examples

### Basic Search
```typescript
import { FoodSearch } from '@/components/food';

function MyComponent() {
  return (
    <FoodSearch
      onSelectFood={(food) => console.log('Selected:', food)}
      userConditions={['diabetes']}
      placeholder="Cari makanan..."
      autoFocus
    />
  );
}
```

### Full-Page Search
```typescript
import { MalaysianFoodSearch } from '@/components/food';

function SearchPage() {
  return (
    <MalaysianFoodSearch
      onSelectFood={(food) => logMeal(food)}
      onManualEntry={() => showManualEntryModal()}
      userConditions={['diabetes', 'hypertension']}
    />
  );
}
```

### Search Suggestions Only
```typescript
import { SearchSuggestions } from '@/components/food';

function MySearchComponent() {
  const [query, setQuery] = useState('');
  
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchSuggestions
        query={query}
        onSuggestionClick={(suggestion) => setQuery(suggestion)}
      />
    </>
  );
}
```

## Search Algorithm

### Step 1: Tokenization
```
Input: "nasi lemak rendang"
Tokens: ["nasi", "lemak", "rendang"]
```

### Step 2: Matching
Check against:
1. Exact name match
2. Starts with query
3. All tokens present in name (any order)
4. Contains query
5. Alias match
6. Individual token matches

### Step 3: Ranking
```sql
Score = 
  1000 (if exact match)
  + 500 (if starts with)
  + 300 (if all words present)
  + 50 × (matching word count)
  + 200 (if alias match)
  + 0.1 × popularity_score
```

### Step 4: Results
Return top N results sorted by score

## Performance

### Benchmarks
- **Database query:** < 100ms
- **API response:** < 300ms
- **UI rendering:** < 50ms
- **Total user experience:** < 500ms

### Optimizations
1. **Database indexes** on name_en, name_bm (lowercase)
2. **GIN indexes** for arrays (aliases, tags)
3. **Frontend debouncing** (300ms)
4. **Request cancellation** (abort previous searches)
5. **Result caching** (recent searches)

## Common Aliases Added

### Popular Dishes (100+)
- Nasi Lemak variations (15+)
- Roti Canai variations (10+)
- Mee/Noodle dishes (20+)
- Rice dishes (15+)
- Drinks (20+)
- Kuih/Desserts (10+)
- Protein dishes (15+)

### Abbreviations
- CKT (Char Kuey Teow)
- BKT (Bak Kut Teh)
- YTF (Yong Tau Foo)

### Common Misspellings
- chanai → canai
- tarek → tarik
- nasik → nasi
- maggie → maggi
- wan tan → wantan

## Files Changed

### Database Migrations
```
supabase/migrations/
  ├── 20260103_improved_food_search.sql    # Enhanced search function
  └── 20260103_add_food_aliases.sql        # Common aliases
```

### Frontend Components
```
components/food/
  ├── SearchSuggestions.tsx               # NEW - Suggestions component
  ├── FoodSearch.tsx                       # UPDATED - Added suggestions
  ├── MalaysianFoodSearch.tsx              # UPDATED - Better empty states
  └── index.ts                             # UPDATED - Export new component
```

### Documentation
```
├── FOOD_SEARCH_TESTING_GUIDE.md          # Comprehensive testing guide
└── IMPROVED_FOOD_SEARCH.md               # This file
```

## Testing

See `FOOD_SEARCH_TESTING_GUIDE.md` for detailed testing instructions.

### Quick Test Cases
```javascript
// Test compound dishes
search("nasi lemak rendang") // ✅ Should find Nasi Lemak Rendang Ayam

// Test partial words
search("goreng") // ✅ Should find all fried dishes

// Test word order
search("ayam goreng") === search("goreng ayam") // ✅ Should match

// Test misspellings
search("roti chanai") // ✅ Should find Roti Canai

// Test aliases
search("ckt") // ✅ Should find Char Kuey Teow
```

## Deployment

### Prerequisites
- Supabase project with `malaysian_foods` table
- Next.js app deployed
- TypeScript support

### Steps

1. **Apply database migrations:**
```bash
# Via Supabase Dashboard → SQL Editor
# Copy and run:
# 1. 20260103_improved_food_search.sql
# 2. 20260103_add_food_aliases.sql
```

2. **Deploy frontend:**
```bash
npm run build
npm run start
# Or: vercel deploy --prod
```

3. **Verify:**
```bash
# Test search API
curl "https://your-app.com/api/foods/search?q=nasi+lemak+rendang"
```

## Monitoring

### Key Metrics
- **Search success rate** (results found / total searches)
- **Zero-result rate** (should decrease by 50%)
- **Average query time** (< 300ms)
- **Suggestion click-through rate** (> 20%)
- **Top searched terms** (for future optimization)

### Analytics Events
```typescript
// Track search queries
trackEvent('food_search', {
  query: string,
  results_count: number,
  selected_result: string | null,
  suggestion_clicked: boolean,
});
```

## Future Enhancements

### Phase 2
- [ ] Levenshtein distance for advanced fuzzy matching
- [ ] Search by nutrition range ("high protein")
- [ ] Voice search integration
- [ ] Auto-complete dropdown
- [ ] Search history management

### Phase 3
- [ ] Image-based search
- [ ] Multi-language support (Tamil, Chinese)
- [ ] Personalized suggestions based on history
- [ ] Search by meal time or occasion
- [ ] Dietary restriction filters

## Troubleshooting

### Search returns no results
1. Check if migrations were applied
2. Verify aliases exist: `SELECT aliases FROM malaysian_foods LIMIT 10`
3. Test with simple query: "nasi"

### Slow search performance
1. Check database indexes exist
2. Verify API response time in Network tab
3. Check for database connection issues

### Suggestions not showing
1. Verify `SearchSuggestions.tsx` is imported
2. Check browser console for errors
3. Clear browser cache

## Contributing

### Adding New Aliases
```sql
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['new_alias1', 'new_alias2'])
WHERE name_en LIKE '%Food Name%';
```

### Improving Search Ranking
Modify the search function ranking logic in:
`supabase/migrations/20260103_improved_food_search.sql`

### Adding Suggestions
Update the `SUGGESTIONS` object in:
`components/food/SearchSuggestions.tsx`

## Support

For issues or questions:
1. Check `FOOD_SEARCH_TESTING_GUIDE.md`
2. Review this README
3. Inspect browser console
4. Verify database migrations

---

**Built with ❤️ for the Malaysian community**

*Helping users find their favorite foods with ease!*

