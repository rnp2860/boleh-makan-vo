# Meal Logging Entry Points

**Generated:** 2026-01-06  
**Purpose:** Document all ways a user can create/log a meal in Boleh Makan

---

## Summary

There is **ONE primary meal logging page** (`/check-food`) with **multiple navigation entry points** across the app. All meal creation flows converge on this single page and ultimately call the same backend API endpoints.

---

## 1. Primary Meal Logging Page

### `/check-food` (app/check-food/page.tsx)

**File:** `app/check-food/page.tsx` (2,146 lines)

**Description:** The main meal logging interface. This is where ALL meal creation happens.

**Features:**
- 📸 **Photo Scan** (Primary CTA): Upload/capture food image → AI analysis
- ⌨️ **Text Input** (Secondary CTA): Type food name → Smart search/AI validation
- 🔍 **Smart Search Modal**: Search Malaysian foods database
- 🎛️ **Portion Controls**: Adjust serving size, kuah level, exclude components
- 🥗 **Add Missing Items**: Add custom ingredients not detected by AI
- 🐷 **Halal Safety Check**: Frontend keyword detection + user confirmation modal

**API Endpoints Called:**

1. **`POST /api/smart-analyze`** (Line 418)
   - Used for BOTH image and text input
   - Input: `{ image, type: "image" | "text", text, user_conditions }`
   - Returns: Full nutrition analysis with AI suggestions
   - **Refactored:** Now uses `resolveFood()` module internally

2. **`POST /api/log-meal`** (Line 791)
   - Final step: Save meal to database
   - Input: `{ meal_name, calories, protein, carbs, fat, sodium, sugar, image_base64, user_id, components, meal_type, meal_context, preparation_style, ai_suggested_name, was_user_corrected }`
   - Returns: `{ success, data, image_url, streak }`

3. **`POST /api/recalculate-nutrition`** (Used when user corrects food name)
   - Input: `{ food_name, portion_size, user_conditions }`
   - Returns: Updated nutrition data
   - **Refactored:** Now uses `resolveFood()` module internally

**Code Flow (Photo Scan):**
```
User clicks "Scan Photo"
  ↓
Select/capture image → Store in `image` state
  ↓
User confirms photo → `analyzeFood()` called
  ↓
POST /api/smart-analyze (type: "image", image: base64)
  ↓
AI analyzes → Returns food name + nutrition
  ↓
If potentially non-halal → Show halal confirmation modal (`setShowHalalModal(true)`)
  ↓
User confirms halal → Store in `baseResult` state
  ↓
User adjusts portion/kuah/exclusions (optional)
  ↓
User clicks "Log Meal"
  ↓
POST /api/log-meal → Save to database
  ↓
Redirect to /dashboard with streak celebration
```

**Code Flow (Text Input):**
```
User clicks "Type Your Food"
  ↓
Opens text input modal (`setShowTextInput(true)`)
  ↓
User types food name → `handleTextSubmit()` called
  ↓
POST /api/smart-analyze (type: "text", text: "nasi lemak")
  ↓
Backend calls resolveFood() → Check Malaysian DB first
  ↓
If DB match found → Return verified nutrition data (source: "malaysian_db")
  ↓
If no DB match → AI estimate (source: "ai_estimate")
  ↓
Store in `baseResult` state
  ↓
User sees suggested food with source badge ("🇲🇾 Verified DB" or "Estimated")
  ↓
User confirms or corrects name
  ↓
User clicks "Log Meal"
  ↓
POST /api/log-meal → Save to database
  ↓
Redirect to /dashboard
```

---

## 2. Navigation Entry Points to `/check-food`

### 2.1 Dashboard - "Log Makanan" Button

**File:** `app/dashboard/page.tsx` (Line 441-455)

**UI:** Prominent gradient button (teal/emerald) in "Quick Actions" section

**Code:**
```tsx
<Link 
  href="/check-food"
  className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl..."
>
  <p className="text-white font-bold text-sm">Log Makanan</p>
  <p className="text-teal-100 text-xs">Scan atau taip</p>
</Link>
```

**How to Reproduce:**
1. Navigate to `/dashboard`
2. Scroll to "Quick Actions" section
3. Click "Log Makanan" button

---

### 2.2 Dashboard - Locked Weekly Chart CTA

**File:** `app/dashboard/page.tsx` (Line 525-530)

**UI:** CTA button appears inside the locked weekly chart overlay (shown when user has logged < 3 days)

**Code:**
```tsx
<Link 
  href="/check-food" 
  className="bg-gradient-to-r from-teal-500 to-teal-600..."
>
  📸 Log Makanan Hari Ini
</Link>
```

**How to Reproduce:**
1. Navigate to `/dashboard` as a new user (< 3 days logged)
2. See locked weekly chart overlay
3. Click "📸 Log Makanan Hari Ini" button

---

### 2.3 Bottom Navigation Bar - Central FAB

**File:** `components/MobileLayout.tsx` (Line 77-84)

**UI:** Large floating action button (FAB) in the center of the bottom nav bar (blue camera icon)

**Code:**
```tsx
<Link href="/check-food" className="relative -top-6">
  <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center...">
    {/* Camera Icon */}
  </div>
</Link>
```

**How to Reproduce:**
1. Navigate to any page in the app (`/dashboard`, `/profile`, `/reports`, etc.)
2. Look at bottom navigation bar
3. Click the large blue camera button in the center

**Note:** This FAB is visible on ALL pages (except `/check-food` itself and print views).

---

### 2.4 Direct URL Navigation

**URL:** `https://bolehmakan.my/check-food`

**How to Reproduce:**
1. Type URL directly in browser
2. Bookmark the page
3. Share link with others

---

## 3. Backend Meal Creation Logic

### 3.1 `POST /api/log-meal`

**File:** `app/api/log-meal/route.ts` (132 lines)

**Purpose:** The ONLY endpoint that actually inserts a meal into the database.

**Process:**
1. Accept meal data (name, macros, image, user_id, metadata)
2. Upload image to Supabase Storage (`meal-images` bucket) if provided
3. Insert row into `food_logs` table
4. Update user streak (calls `updateStreak()` from `lib/streakCalculator`)
5. Return success + streak info

**RLHF Fields:**
- `ai_suggested_name`: Original AI suggestion
- `was_user_corrected`: Boolean flag if user corrected the name

**Enterprise Fields:**
- `meal_context`: Where meal was eaten (hawker, restaurant, home, etc.)
- `preparation_style`: How it was cooked
- `sugar_source_detected`: If added sugar detected
- `is_ramadan_log`: If logged during Ramadan mode

---

### 3.2 `POST /api/smart-analyze`

**File:** `app/api/smart-analyze/route.ts` (869 lines)

**Purpose:** AI-powered food recognition and nutrition analysis (does NOT save to database).

**Refactored:** Now uses `resolveFood()` from `lib/food/resolveFood.ts` for all food identification.

**Process (Image Input):**
1. Receive base64 image
2. Call OpenAI GPT-4o-mini with food recognition prompt
3. Get AI's initial guess (e.g., "Nasi Lemak")
4. Call `resolveFood({ inputType: "image", visionName: aiGuess, userConditions })`
5. If Malaysian DB match found → Return verified data
6. If no DB match → Return AI estimate
7. Return full response with `source` field ("malaysian_db" or "ai_estimate")

**Process (Text Input):**
1. Receive text query (e.g., "roti canai")
2. Call `resolveFood({ inputType: "text", rawName: query, userConditions })`
3. Check Malaysian DB (exact → alias → fuzzy → partial match)
4. If no DB match → Validate with AI
5. Return nutrition data with `source` field

**Resolution Order (enforced by `resolveFood()`):**
1. Exact DB match (confidence: 1.0)
2. Alias match (confidence: 0.95)
3. Fuzzy match (confidence: 0.9)
4. Partial token match (confidence: 0.6)
5. AI fallback (confidence varies)

---

### 3.3 `POST /api/recalculate-nutrition`

**File:** `app/api/recalculate-nutrition/route.ts`

**Purpose:** When user corrects the food name, recalculate nutrition.

**Refactored:** Now uses `resolveFood({ inputType: "text", rawName: correctedName })` instead of direct AI prompts.

**Process:**
1. Receive corrected food name
2. Call `resolveFood()` to search DB first
3. If DB match → Return verified nutrition
4smaller4. If no DB match → AI estimation with `TEXT_INPUT_VALIDATION_PROMPT`
5. Return updated nutrition data

---

## 4. Context Functions (Not Direct Entry Points)

### 4.1 `addMeal()` from `FoodContext`

**File:** `context/FoodContext.tsx` (Line 187)

**Purpose:** React Context helper function that wraps `/api/log-meal`.

**Used By:** `app/check-food/page.tsx` after user confirms meal

**Process:**
1. Upload image to Supabase Storage (if exists)
2. Prepare meal data object
3. Insert into `food_logs` table via Supabase client
4. Update local state
5. Show success toast

**Note:** This is NOT an entry point. It's a helper function called by the check-food page.

---

## 5. Deprecated/Legacy Endpoints (NOT USED)

### 5.1 `POST /api/analyze-food`

**File:** `app/api/analyze-food/route.ts`

**Status:** ⚠️ Exists in codebase but **NOT called by current UI**.

**History:** Likely a legacy endpoint from before `/api/smart-analyze` was created.

**Recommendation:** Audit and remove if confirmed unused.

---

### 5.2 `POST /api/voice-log`

**File:** `app/api/voice-log/route.ts`

**Status:** ⚠️ Exists in codebase but **NOT called by current UI**.

**History:** Likely for voice input feature that was removed/replaced by text input.

**Recommendation:** Audit and remove if confirmed unused.

---

## 6. Smart Food Search Component

### `SmartFoodSearch.tsx`

**File:** `components/food/SmartFoodSearch.tsx` (250+ lines)

**Status:** ✅ **Component exists** but **NOT YET integrated** into `app/check-food/page.tsx`.

**Purpose:** Dedicated search component for Malaysian foods with semantic filtering.

**API Endpoint:** `POST /api/foods/smart-search`

**Features:**
- Real-time search of Malaysian foods database
- Semantic keyword detection (e.g., "low gi", "diabetic safe")
- Filter by health conditions
- Display nutrition info + health ratings

**Current Usage:** NOT used in production UI yet. Exists as a standalone component ready for integration.

**Planned Integration:** Should replace the current text input flow in `check-food/page.tsx` as the primary text-first entry point.

---

## 7. Acceptance Test Coverage

### Test Case 1: Photo Scan Flow
1. Navigate to `/dashboard`
2. Click "Log Makanan" button
3. Upload photo of "Nasi Lemak"
4. Verify AI suggests "Nasi Lemak" with source badge ("🇲🇾 Verified DB")
5. Click "Log Meal"
6. Verify meal saved to database
7. Verify redirected to dashboard with streak update

### Test Case 2: Text Input Flow
1. Navigate to `/check-food`
2. Click "Type Your Food"
3. Type "roti canai"
4. Verify resolves to Malaysian DB (source: "malaysian_db")
5. Verify shows verified nutrition data
6. Click "Log Meal"
7. Verify meal saved

### Test Case 3: User Correction Flow
1. Log a meal via photo scan
2. AI suggests "Fried Rice" (generic, confidence: 0.8)
3. User clicks "Correct" and types "Nasi Goreng Kampung"
4. Verify `resolveFood()` searches Malaysian DB first
5. If DB match → Show "🇲🇾 Verified DB" badge
6. If no match → Show "Estimated" badge
7. Log meal with `was_user_corrected: true`

### Test Case 4: Bottom Nav FAB
1. Navigate to `/profile`
2. Click center camera FAB
3. Verify navigates to `/check-food`

---

## 8. Key Files Reference

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `app/check-food/page.tsx` | Main meal logging UI | 2,146 | ✅ Active |
| `app/api/log-meal/route.ts` | Save meal to DB | 132 | ✅ Active |
| `app/api/smart-analyze/route.ts` | AI food analysis | 869 | ✅ Active (Refactored) |
| `app/api/recalculate-nutrition/route.ts` | Recalc on correction | ~200 | ✅ Active (Refactored) |
| `lib/food/resolveFood.ts` | Canonical food resolver | 338 | ✅ Active (NEW) |
| `context/FoodContext.tsx` | React context helpers | ~400 | ✅ Active |
| `app/dashboard/page.tsx` | Dashboard with CTA | 737 | ✅ Active |
| `components/MobileLayout.tsx` | Bottom nav with FAB | 98 | ✅ Active |
| `components/food/SmartFoodSearch.tsx` | Smart search component | 250+ | ⚠️ Not Yet Integrated |
| `app/api/analyze-food/route.ts` | Legacy analysis endpoint | ~100 | ⚠️ Likely Unused |
| `app/api/voice-log/route.ts` | Legacy voice logging | ~100 | ⚠️ Likely Unused |

---

## 9. Current UX Priorities (As of 2026-01-06)

Based on recent refactoring work:

1. ✅ **Photo scan is secondary** with explicit confirmation required
2. ✅ **Text input is primary** (faster, more accurate for Malaysian foods)
3. ✅ **Source badges** ("🇲🇾 Verified DB" vs "Estimated") always visible
4. ✅ **Confidence labels** (High/Medium/Low) shown before saving
5. ✅ **Malaysian DB prioritized** in all resolution paths
6. ✅ **RLHF tracking** (AI suggestions vs user corrections) enabled

---

## 10. Next Steps for Integration

### Recommended: Integrate `SmartFoodSearch` component

**Current State:** Text input in `check-food/page.tsx` uses a basic modal with direct API calls.

**Desired State:** Replace with `SmartFoodSearch` component for:
- Real-time search as user types
- Semantic filtering (low GI, diabetic safe, etc.)
- Better UX with health ratings displayed upfront

**Implementation:**
1. Import `SmartFoodSearch` into `app/check-food/page.tsx`
2. Replace current `showTextInput` modal with `<SmartFoodSearch onSelectFood={handleFoodSelected} />`
3. Map selected food from `SmartFoodSearch` to `baseResult` state
4. Keep existing portion controls and "Log Meal" flow

---

## 11. Tenant-Specific Entry Points

### `/t/[tenantSlug]/check-food`

**File:** `app/t/[tenantSlug]/dashboard/page.tsx` (Line 63)

**Purpose:** Tenant-scoped meal logging (for enterprise clients)

**URL Pattern:** `/t/mycompany/check-food`

**Note:** Mirrors consumer flow but with tenant isolation.

---

## Conclusion

**Primary Entry Point:** `/check-food` page  
**Navigation Paths:** 4 (Dashboard button, Locked chart CTA, Bottom nav FAB, Direct URL)  
**Backend Endpoints:** 2 active (`/api/log-meal`, `/api/smart-analyze`), 1 correction (`/api/recalculate-nutrition`)  
**Food Resolution:** Unified via `lib/food/resolveFood.ts` (Malaysian DB prioritized)  
**Smart Search Component:** Exists but not yet integrated into primary flow

All meal logging flows are **centralized** and **well-defined**, with a clear separation between UI entry points and backend logic.

---

**Report End**

