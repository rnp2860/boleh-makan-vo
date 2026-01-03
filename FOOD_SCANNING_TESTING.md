# 🧪 Testing Guide: Malaysian Database Food Scanning

## Quick Test Cases

### ✅ Test 1: Scan Popular Malaysian Food (Should Match Malaysian DB)

**Foods to try:**
- Nasi Lemak
- Char Kuey Teow
- Roti Canai
- Nasi Kandar
- Mee Goreng Mamak
- Teh Tarik
- Laksa
- Rendang
- Satay

**Expected Result:**
```
✅ Badge: "🇲🇾 MALAYSIAN DATABASE"
✅ Food name: Accurate Malaysian name (English + BM)
✅ Nutrition: Verified Malaysian data
✅ Ratings: Shows diabetes, hypertension, cholesterol, CKD ratings
```

**Terminal Log:**
```
🔍 Searching Malaysian database for vision result: "Nasi Lemak"
✅ Malaysian DB match for vision result "Nasi Lemak" → "Nasi Lemak with Sambal, Egg, Anchovies" (95% confidence)
```

---

### ✅ Test 2: Scan Non-Malaysian Food (Should Use Generic DB/AI)

**Foods to try:**
- Pizza
- Burger
- Pasta
- Sushi
- Taco

**Expected Result:**
```
✅ Badge: "✓ VERIFIED" or "AI ESTIMATE"
✅ Food name: Generic international name
✅ Nutrition: From generic database or AI estimate
```

**Terminal Log:**
```
🔍 Searching Malaysian database for vision result: "Pizza Margherita"
❌ Malaysian DB: No match found for: Pizza Margherita
🔍 No Malaysian match found, trying generic database for: "Pizza Margherita"
✅ Generic DB hit for "Pizza Margherita" → "Pizza, cheese" (85% confidence)
```

---

### ✅ Test 3: Text Input (Type It In) - Already Working

**Text to type:**
- "ckt" (alias for Char Kuey Teow)
- "bkt" (alias for Bak Kut Teh)
- "nasi lemak"
- "mee goreng"

**Expected Result:**
```
✅ Badge: "🇲🇾 MALAYSIAN DATABASE"
✅ Instant match from text input
✅ No vision AI needed
```

**Terminal Log:**
```
📝 Text input received: ckt
✅ Malaysian DB hit for "ckt" → "Char Kuey Teow" (95% confidence)
```

---

## 🐛 Debugging

### Check Terminal Logs

When you scan a food, look for these logs in your terminal:

1. **Vision AI Response:**
```
🔍 Vision result: { food_name: "Nasi Lemak Ayam Goreng", confidence_score: 0.9 }
```

2. **Malaysian Database Search:**
```
🇲🇾 Searching Malaysian database for: Nasi Lemak Ayam Goreng
✅ Malaysian DB: Exact match found - Nasi Lemak with Sambal, Egg, Anchovies, Chicken
```

3. **Final Result:**
```
✅ Using malaysian_database data for "Nasi Lemak with Sambal, Egg, Anchovies, Chicken" (95% confidence)
```

### Common Issues

**Issue:** Vision detects Malaysian food but shows "AI ESTIMATE"
**Fix:** Check if food exists in `malaysian_foods` table
**Check:** Terminal should show: `❌ Malaysian DB: No match found for: [food name]`

**Issue:** Wrong food matched
**Fix:** The vision AI name might be slightly different from database name
**Check:** Look at the fuzzy matching score in terminal logs

**Issue:** Malaysian badge not showing
**Fix:** Check `baseResult.source` value in browser console
**Debug:** Add `console.log('Result source:', baseResult.source)` in check-food page

---

## 📊 Test Results Template

```
Test Date: _____________
Tester: ________________

| Food Scanned | Expected Badge | Actual Badge | Pass? | Notes |
|--------------|---------------|--------------|-------|-------|
| Nasi Lemak   | 🇲🇾 MALAYSIAN DB | _____________ | ☐ ☑  |       |
| Char Kuey Teow | 🇲🇾 MALAYSIAN DB | _____________ | ☐ ☑  |       |
| Pizza        | ✓ VERIFIED/AI EST | _____________ | ☐ ☑  |       |
| Burger       | ✓ VERIFIED/AI EST | _____________ | ☐ ☑  |       |
| Roti Canai   | 🇲🇾 MALAYSIAN DB | _____________ | ☐ ☑  |       |

Terminal Logs:
_________________________________________________________
_________________________________________________________
_________________________________________________________

Issues Found:
_________________________________________________________
_________________________________________________________
```

---

## 🔧 Manual Testing Steps

### Step 1: Scan a Malaysian Food
1. Go to `/check-food`
2. Take photo or upload image of "Nasi Lemak"
3. Wait for analysis

### Step 2: Verify Badge
- Look for "🇲🇾 MALAYSIAN DATABASE" badge (emerald green)
- Should appear at top-left of food card

### Step 3: Check Nutrition Data
- Calories should match Malaysian database
- Condition ratings should be present (diabetes, BP, cholesterol, CKD)
- Food name should include Malay translation

### Step 4: Check Terminal Logs
- Open browser DevTools → Console
- Or check server terminal
- Look for "✅ Malaysian DB match for vision result"

### Step 5: Test Fallback
1. Scan a non-Malaysian food (pizza, burger)
2. Should show "AI ESTIMATE" or "✓ VERIFIED" (not Malaysian badge)
3. Terminal should show: "❌ Malaysian DB: No match found"

---

## 🎯 Success Criteria

✅ **Vision → Malaysian DB matching works**
✅ **"🇲🇾 MALAYSIAN DATABASE" badge displays**
✅ **Accurate nutrition from Malaysian database**
✅ **Fallback to generic database works**
✅ **No build errors**
✅ **No runtime errors in browser console**

---

## 📞 Support

If you encounter issues:
1. Check terminal logs for error messages
2. Verify Malaysian food exists in database
3. Check `malaysian_foods` table in Supabase
4. Review `/lib/malaysianFoodDatabaseLookup.ts` matching logic

---

**Last Updated:** January 3, 2026

