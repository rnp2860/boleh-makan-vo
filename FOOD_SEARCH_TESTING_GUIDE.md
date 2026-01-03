# 🇲🇾 Improved Food Search - Testing & Deployment Guide

## Overview
This document guides you through testing and deploying the improved Malaysian food search functionality with better fuzzy matching, compound dish support, and helpful suggestions.

## Changes Made

### 1. Database Changes
- **Enhanced search function** with better fuzzy matching algorithm
- **Common aliases** added for 100+ popular Malaysian foods
- **Word-order flexible** matching for compound dishes

### 2. Frontend Components
- **SearchSuggestions** component for helpful hints
- **FoodSearch.tsx** updated with suggestions integration
- **MalaysianFoodSearch.tsx** improved empty states

---

## Deployment Steps

### Step 1: Apply Database Migrations

Run the SQL migrations in order:

```bash
# Connect to your Supabase project
# Via Supabase Dashboard -> SQL Editor, or via CLI

# 1. Apply improved search function
supabase migration apply 20260103_improved_food_search.sql

# 2. Add common aliases to foods
supabase migration apply 20260103_add_food_aliases.sql
```

**Or manually via Supabase Dashboard:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20260103_improved_food_search.sql`
3. Run the migration
4. Copy contents of `supabase/migrations/20260103_add_food_aliases.sql`
5. Run the migration

**Verify migrations:**
```sql
-- Check if search function is updated
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'search_malaysian_foods';

-- Check if aliases were added
SELECT name_en, aliases 
FROM malaysian_foods 
WHERE name_en LIKE '%Nasi Lemak%' 
LIMIT 5;
```

### Step 2: Deploy Frontend Changes

The frontend changes are already in place. Just deploy your Next.js app:

```bash
# Build and test locally first
npm run build
npm run start

# Or deploy to Vercel/your hosting
vercel deploy --prod
```

---

## Testing Guide

### Test Cases - Compound Dishes

Test these searches to verify compound dish matching works:

#### Test 1: "nasi lemak rendang"
**Expected:** Should find "Nasi Lemak Rendang Ayam" or similar
**Why:** Tests multi-word matching in any order

```
Search: "nasi lemak rendang"
✅ Should match: Nasi Lemak Rendang Ayam
✅ Should match: Nasi Lemak with Rendang
✅ Should match: Nasi Lemak Ayam Rendang
```

#### Test 2: "ayam goreng"
**Expected:** Should find all fried chicken dishes
**Why:** Tests partial word matching

```
Search: "ayam goreng"
✅ Should match: Ayam Goreng Berempah
✅ Should match: Nasi Lemak Ayam Goreng
✅ Should match: Maggi Goreng with Ayam
```

#### Test 3: "goreng ayam" (reversed)
**Expected:** Should find same results as "ayam goreng"
**Why:** Tests word order flexibility

```
Search: "goreng ayam"
✅ Should match same results as "ayam goreng"
```

### Test Cases - Partial Words

#### Test 4: "goreng"
**Expected:** Should find all fried dishes

```
Search: "goreng"
✅ Should match: Mee Goreng
✅ Should match: Nasi Goreng
✅ Should match: Ayam Goreng
✅ Should match: Pisang Goreng
✅ Should match: Maggi Goreng
```

#### Test 5: "lemak"
**Expected:** Should find all nasi lemak variations

```
Search: "lemak"
✅ Should match: Nasi Lemak
✅ Should match: Nasi Lemak Rendang
✅ Should match: Nasi Lemak Ayam Goreng
```

### Test Cases - Common Misspellings

#### Test 6: "roti chanai"
**Expected:** Should find "Roti Canai"

```
Search: "roti chanai"
✅ Should match: Roti Canai (Plain)
✅ Should show "Did you mean: roti canai"
```

#### Test 7: "nasik lemak"
**Expected:** Should find "Nasi Lemak"

```
Search: "nasik lemak"
✅ Should match: Nasi Lemak variations
✅ Should work via alias matching
```

#### Test 8: "teh tarek"
**Expected:** Should find "Teh Tarik"

```
Search: "teh tarek"
✅ Should match: Teh Tarik
✅ Should show "Did you mean: teh tarik"
```

### Test Cases - Aliases

#### Test 9: "ckt"
**Expected:** Should find "Char Kuey Teow"

```
Search: "ckt"
✅ Should match: Char Kuey Teow
✅ Should be top result
```

#### Test 10: "bkt"
**Expected:** Should find "Bak Kut Teh"

```
Search: "bkt"
✅ Should match: Bak Kut Teh
✅ Should be top result
```

#### Test 11: "ytf"
**Expected:** Should find "Yong Tau Foo"

```
Search: "ytf"
✅ Should match: Yong Tau Foo
```

### Test Cases - Suggestions

#### Test 12: Type "nasi" (partial)
**Expected:** Should show suggestions

```
Search: "nasi"
✅ Should show suggestions:
   - nasi lemak
   - nasi goreng
   - nasi ayam
   - nasi campur
   - nasi briyani
```

#### Test 13: No results
**Expected:** Should show helpful suggestions

```
Search: "asdfasdf"
✅ Should show "No results"
✅ Should show suggestions with popular foods
✅ Should show "Log Manual Entry" button
```

#### Test 14: Empty search
**Expected:** Should show popular searches

```
Search: "" (empty)
✅ Should show popular searches:
   - nasi lemak
   - roti canai
   - mee goreng
   - teh tarik
```

---

## Manual Testing Checklist

### Desktop Browser Testing
- [ ] Open food search in Chrome/Edge
- [ ] Test all test cases above
- [ ] Verify suggestions appear correctly
- [ ] Check "Did you mean" functionality
- [ ] Test keyboard navigation (arrow keys, enter)
- [ ] Verify recent searches work
- [ ] Check search performance (should be fast, < 300ms)

### Mobile Testing
- [ ] Open on mobile browser
- [ ] Test touch interactions
- [ ] Verify suggestions are readable
- [ ] Check keyboard popup behavior
- [ ] Test scrolling in results
- [ ] Verify responsive layout

### Edge Cases
- [ ] Very long search queries (50+ chars)
- [ ] Special characters in search (é, ñ, etc.)
- [ ] Numbers in search (e.g., "3 layer tea")
- [ ] Search with multiple spaces
- [ ] Unicode characters (emojis)
- [ ] Copy-paste from other sources

---

## Performance Testing

### Search Speed
Expected performance:
- **< 100ms** - Database query
- **< 300ms** - Total response time
- **< 50ms** - Frontend rendering

Test with browser DevTools Network tab:
```
1. Open DevTools → Network
2. Search for "nasi lemak"
3. Check API call timing
4. Should see fast response
```

### Load Testing
Test with multiple rapid searches:
```
1. Type "nasi" → wait → "nasik" → wait → "nasi lemak"
2. Should handle rapid changes smoothly
3. Should debounce API calls (300ms)
4. No lag in UI
```

---

## Verification SQL Queries

Run these to verify everything is working:

### Check Search Function
```sql
-- Test compound dish search
SELECT name_en, name_bm 
FROM search_malaysian_foods('nasi lemak rendang', 10);

-- Test partial word search
SELECT name_en, name_bm 
FROM search_malaysian_foods('goreng', 10);

-- Test alias search
SELECT name_en, name_bm, aliases 
FROM search_malaysian_foods('ckt', 5);

-- Test misspelling via alias
SELECT name_en, name_bm, aliases 
FROM search_malaysian_foods('roti chanai', 5);
```

### Check Aliases Were Added
```sql
-- Count foods with aliases
SELECT COUNT(*) as foods_with_aliases 
FROM malaysian_foods 
WHERE aliases IS NOT NULL 
  AND array_length(aliases, 1) > 0;

-- Sample aliases
SELECT name_en, aliases 
FROM malaysian_foods 
WHERE aliases IS NOT NULL 
LIMIT 20;

-- Check specific aliases
SELECT name_en, aliases 
FROM malaysian_foods 
WHERE 'ckt' = ANY(aliases) 
   OR 'bkt' = ANY(aliases)
   OR 'ytf' = ANY(aliases);
```

---

## Troubleshooting

### Issue: Search returns no results for compound dishes

**Solution:**
```sql
-- Verify search function is updated
SELECT routine_name, last_altered 
FROM information_schema.routines 
WHERE routine_name = 'search_malaysian_foods';

-- If not updated, re-run migration:
-- Copy contents of 20260103_improved_food_search.sql and run
```

### Issue: Aliases not working

**Solution:**
```sql
-- Check if aliases exist
SELECT COUNT(*) FROM malaysian_foods 
WHERE aliases IS NOT NULL;

-- If count is 0 or very low, re-run:
-- Copy contents of 20260103_add_food_aliases.sql and run
```

### Issue: Suggestions not showing

**Check:**
1. Verify `SearchSuggestions.tsx` is imported correctly
2. Check browser console for errors
3. Verify component is rendered in DOM

### Issue: "Did you mean" not appearing

**Check:**
1. The query needs to match a key in `COMMON_CORRECTIONS`
2. Test with known misspellings: "chanai", "tarek", "nasik"

### Issue: Search is slow

**Check:**
1. Verify indexes exist:
```sql
SELECT * FROM pg_indexes 
WHERE tablename = 'malaysian_foods';
```

2. If indexes are missing:
```sql
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_en_lower 
ON malaysian_foods(LOWER(name_en));

CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_bm_lower 
ON malaysian_foods(LOWER(name_bm));
```

---

## Success Metrics

After deployment, monitor these metrics:

### User Experience
- ✅ Users can find compound dishes easily
- ✅ Common misspellings are handled
- ✅ Search feels instant (< 300ms)
- ✅ Helpful suggestions reduce failed searches

### Technical Metrics
- ✅ Database query time < 100ms
- ✅ API response time < 300ms
- ✅ Zero-result searches < 10% of total
- ✅ Suggestion click-through rate > 20%

### Search Quality
- ✅ Top result is relevant > 90% of time
- ✅ Desired result in top 5 > 95% of time
- ✅ Zero-result rate decreases by 50%

---

## Next Steps (Future Improvements)

### Phase 2 Enhancements:
1. **Levenshtein distance** for better fuzzy matching
2. **Search analytics** to track popular queries
3. **Personalized suggestions** based on user history
4. **Voice search** integration
5. **Auto-complete** as user types
6. **Search history** with ability to clear
7. **Category filters** in search results
8. **Sort options** (relevance, calories, popularity)

### Advanced Features:
- Search by nutrition range ("high protein foods")
- Search by meal time ("breakfast foods")
- Search by dietary restrictions ("halal vegetarian")
- Image-based search
- Multi-language search (Tamil, Chinese, etc.)

---

## Support

If you encounter issues:
1. Check this testing guide first
2. Run verification SQL queries
3. Check browser console for errors
4. Verify database migrations were applied
5. Test with simple queries first (e.g., "nasi")

**Note:** Always test in a staging environment before production deployment!

