# ✅ QA Testing Checklist: Type It In + Malaysian Database

## Pre-Migration Testing

### 🔍 Test 1: Verify Current Behavior (Before Migration)

Test what happens when searching for abbreviations:

| Test | Input | Expected (Current) | Pass/Fail |
|------|-------|-------------------|-----------|
| 1.1 | Type "ckt" | Generic/wrong result (crab legs?) | ☐ |
| 1.2 | Type "bkt" | Generic/wrong result | ☐ |
| 1.3 | Type "nasi lemak" | Should work (exact match) | ☐ |
| 1.4 | Type "char kuey teow" | Should work (exact match) | ☐ |

**Terminal Logs to Check:**
```
❌ Malaysian DB: No match found for: ckt
🔍 No Malaysian match found, trying generic database
```

---

## Migration Steps

### 📋 Step 1: Run Aliases Migration

**Option A - Supabase Dashboard:**
1. ☐ Go to https://supabase.com/dashboard
2. ☐ Select your Boleh Makan project
3. ☐ Go to "SQL Editor"
4. ☐ Copy contents of `supabase/migrations/20260103_add_food_aliases.sql`
5. ☐ Paste into SQL Editor
6. ☐ Click "Run"
7. ☐ Wait for success message

**Option B - Supabase CLI:**
```bash
☐ supabase db push
```

### 📋 Step 2: Verify Migration Success

Run this SQL in Supabase SQL Editor:

```sql
-- Check if "ckt" alias exists
SELECT name_en, name_bm, aliases 
FROM malaysian_foods 
WHERE 'ckt' = ANY(aliases);
```

**Expected Result:**
```
name_en: Char Kuey Teow
name_bm: Char Kuey Teow
aliases: ['ckt', 'char koay teow', 'fried flat noodles', ...]
```

☐ **Result matches expected** → Continue
☐ **No result or error** → Check migration logs, re-run migration

---

## Post-Migration Testing

### 🎯 Test 2: Abbreviation Search (Primary Focus)

| Test | Input | Expected Result | Badge | Pass/Fail |
|------|-------|----------------|-------|-----------|
| 2.1 | ckt | Char Kuey Teow | 🇲🇾 MALAYSIAN DATABASE | ☐ |
| 2.2 | bkt | Bak Kut Teh | 🇲🇾 MALAYSIAN DATABASE | ☐ |
| 2.3 | ytf | Yong Tau Foo | 🇲🇾 MALAYSIAN DATABASE | ☐ |
| 2.4 | maggi | Maggi Goreng | 🇲🇾 MALAYSIAN DATABASE | ☐ |

**How to Test:**
1. Go to `/check-food`
2. Click "Type It In" button
3. Type the input
4. Click "Analyze"
5. Check:
   - Food name matches expected
   - "🇲🇾 MALAYSIAN DATABASE" badge shows
   - Nutrition data looks correct
   - Condition ratings show (diabetes, BP, cholesterol, CKD)

**Terminal Logs Should Show:**
```
📝 Text input received: ckt
🇲🇾 Searching Malaysian database for: ckt
✅ Malaysian DB: Alias match found - Char Kuey Teow
```

### 🎯 Test 3: Misspelling Search

| Test | Input | Expected Result | Pass/Fail |
|------|-------|----------------|-----------|
| 3.1 | roti chanai | Roti Canai (Plain) | ☐ |
| 3.2 | nasik lemak | Nasi Lemak | ☐ |
| 3.3 | teh tarek | Teh Tarik | ☐ |
| 3.4 | maggie goreng | Maggi Goreng | ☐ |

### 🎯 Test 4: Variation Search

| Test | Input | Expected Result | Pass/Fail |
|------|-------|----------------|-----------|
| 4.1 | fried rice | Nasi Goreng Kampung | ☐ |
| 4.2 | chicken rice | Nasi Ayam | ☐ |
| 4.3 | butter prata | Roti Planta | ☐ |
| 4.4 | milk tea | Teh Tarik | ☐ |

### 🎯 Test 5: Exact Name Search (Should Still Work)

| Test | Input | Expected Result | Pass/Fail |
|------|-------|----------------|-----------|
| 5.1 | nasi lemak | Nasi Lemak variations | ☐ |
| 5.2 | char kuey teow | Char Kuey Teow | ☐ |
| 5.3 | roti canai | Roti Canai (Plain) | ☐ |
| 5.4 | teh tarik | Teh Tarik | ☐ |
| 5.5 | laksa | Laksa variations | ☐ |

### 🎯 Test 6: Compound Dishes

| Test | Input | Expected Result | Pass/Fail |
|------|-------|----------------|-----------|
| 6.1 | nasi lemak ayam goreng | Nasi Lemak with Fried Chicken | ☐ |
| 6.2 | nasi lemak rendang | Nasi Lemak with Rendang | ☐ |
| 6.3 | roti canai telur | Roti Canai (Egg) | ☐ |
| 6.4 | mee goreng mamak | Mee Goreng Mamak | ☐ |

### 🎯 Test 7: Partial Word Search

| Test | Input | Expected Result | Pass/Fail |
|------|-------|----------------|-----------|
| 7.1 | ayam | Any chicken dish | ☐ |
| 7.2 | goreng | Any fried dish | ☐ |
| 7.3 | nasi | Any rice dish | ☐ |
| 7.4 | roti | Any roti variation | ☐ |

### 🎯 Test 8: Non-Malaysian Food (Fallback)

| Test | Input | Expected Behavior | Badge | Pass/Fail |
|------|-------|------------------|-------|-----------|
| 8.1 | pizza | Generic/AI estimate | AI ESTIMATE | ☐ |
| 8.2 | burger | Generic/AI estimate | AI ESTIMATE | ☐ |
| 8.3 | spaghetti | Generic/AI estimate | AI ESTIMATE | ☐ |

**Terminal Logs Should Show:**
```
❌ Malaysian DB: No match found for: pizza
🔍 No Malaysian match found, trying generic database for: "pizza"
```

---

## UI/UX Testing

### 🎨 Test 9: Visual Elements

| Element | Expected | Pass/Fail |
|---------|----------|-----------|
| 9.1 | Type It In button visible on /check-food | ☐ |
| 9.2 | Text input modal opens when clicked | ☐ |
| 9.3 | Placeholder text: "e.g. Nasi Lemak Ayam Goreng" | ☐ |
| 9.4 | Enter key triggers analyze | ☐ |
| 9.5 | Analyze button disabled when input empty | ☐ |
| 9.6 | Loading state shows during analysis | ☐ |
| 9.7 | 🇲🇾 MALAYSIAN DATABASE badge shows (emerald green) | ☐ |
| 9.8 | Food name displays (English + BM if available) | ☐ |
| 9.9 | Nutrition data displays correctly | ☐ |
| 9.10 | Condition rating dots show (4 colors) | ☐ |
| 9.11 | Dr. Reza tip displays | ☐ |

### 🎨 Test 10: Edge Cases

| Test | Scenario | Expected Behavior | Pass/Fail |
|------|----------|------------------|-----------|
| 10.1 | Empty input | Analyze button disabled | ☐ |
| 10.2 | Only spaces | Analyze button disabled | ☐ |
| 10.3 | Very long text (100+ chars) | Should still process | ☐ |
| 10.4 | Special characters: "nasi lemak!!!" | Should strip and match | ☐ |
| 10.5 | Numbers: "2 nasi lemak" | Should still find nasi lemak | ☐ |
| 10.6 | Gibberish: "asdfghjkl" | Should show no results or AI estimate | ☐ |

---

## Performance Testing

### ⚡ Test 11: Speed & Responsiveness

| Test | Expected Time | Actual Time | Pass/Fail |
|------|--------------|-------------|-----------|
| 11.1 | Type It In modal opens | < 100ms | _______ | ☐ |
| 11.2 | Search "ckt" | < 2 seconds | _______ | ☐ |
| 11.3 | Search "nasi lemak" | < 2 seconds | _______ | ☐ |
| 11.4 | Search non-Malaysian food | < 3 seconds | _______ | ☐ |

---

## Error Handling

### 🚨 Test 12: Error Scenarios

| Test | Scenario | Expected Behavior | Pass/Fail |
|------|----------|------------------|-----------|
| 12.1 | Network error (offline) | Error message shows | ☐ |
| 12.2 | API timeout | Error message shows | ☐ |
| 12.3 | Invalid API response | Graceful fallback | ☐ |
| 12.4 | Database connection error | Error message shows | ☐ |

---

## Cross-Device Testing

### 📱 Test 13: Device Compatibility

| Device | Test "ckt" | Modal UI | Badge Visible | Pass/Fail |
|--------|-----------|----------|--------------|-----------|
| 13.1 Desktop (Chrome) | ☐ | ☐ | ☐ | ☐ |
| 13.2 Desktop (Firefox) | ☐ | ☐ | ☐ | ☐ |
| 13.3 Desktop (Safari) | ☐ | ☐ | ☐ | ☐ |
| 13.4 Mobile (iOS) | ☐ | ☐ | ☐ | ☐ |
| 13.5 Mobile (Android) | ☐ | ☐ | ☐ | ☐ |
| 13.6 Tablet | ☐ | ☐ | ☐ | ☐ |

---

## Final Verification

### ✅ Test 14: End-to-End Flow

Complete this full flow:

☐ **Step 1:** Go to `/check-food`
☐ **Step 2:** Click "Type It In" button
☐ **Step 3:** Type "ckt"
☐ **Step 4:** Click "Analyze" (or press Enter)
☐ **Step 5:** Wait for result
☐ **Step 6:** Verify:
   - ☐ Food name: "Char Kuey Teow"
   - ☐ Badge: "🇲🇾 MALAYSIAN DATABASE" (emerald green)
   - ☐ Calories shown (should be ~400-700 kcal depending on serving)
   - ☐ Condition ratings visible (4 dots)
   - ☐ Dr. Reza tip displays
☐ **Step 7:** Adjust portion (if applicable)
☐ **Step 8:** Click "Log Meal"
☐ **Step 9:** Verify meal saved to dashboard
☐ **Step 10:** Check meal appears in history with correct data

---

## Sign-Off

### 📝 Test Summary

**Date Tested:** _________________
**Tester Name:** _________________
**Environment:** ☐ Production ☐ Staging ☐ Development

**Results:**
- Total Tests: 14 categories
- Passed: _____
- Failed: _____
- Blocked: _____

**Critical Issues Found:**
_________________________________________
_________________________________________
_________________________________________

**Non-Critical Issues:**
_________________________________________
_________________________________________

**Overall Status:** ☐ PASS ☐ FAIL ☐ PARTIAL

**Notes:**
_________________________________________
_________________________________________
_________________________________________

**Approved By:** _________________
**Date:** _________________

---

## 🎯 Success Criteria

For this feature to be considered "DONE":

- ☐ **Migration executed** - Aliases are in database
- ☐ **"ckt" search works** - Returns Char Kuey Teow
- ☐ **Badge displays** - 🇲🇾 MALAYSIAN DATABASE shows
- ☐ **No console errors** - Clean browser console
- ☐ **Terminal logs correct** - Shows Malaysian DB match
- ☐ **Mobile works** - Tested on at least iOS or Android
- ☐ **At least 10/14 test categories pass**

**If all criteria met → Ship it! 🚀**

