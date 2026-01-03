# 🩺 Dr. Reza AI - Multi-Condition Health Advisor Upgrade

## Overview

Upgraded Dr. Reza AI assistant to provide comprehensive, condition-aware health advice for Malaysians managing multiple chronic conditions (Diabetes, Hypertension, Cholesterol, CKD).

### Key Improvements

1. **Multi-Condition Analysis** - Analyzes food against ALL user conditions simultaneously
2. **Specific Impact Warnings** - Provides exact numbers and percentages for each condition
3. **Meal Context Preservation** - Maintains full food names even when edited
4. **Today's Intake Awareness** - Considers cumulative daily consumption
5. **Malaysian Cultural Awareness** - Suggests local alternatives, not Western swaps

---

## What Was Built

### 1. Enhanced Prompt System

**File: `lib/ai/dr-reza-prompt.ts`**

Core features:
- `getDrRezaSystemPrompt()` - Generates condition-aware system prompt
- `buildMealAnalysisMessage()` - Constructs meal context for analysis
- `UserHealthProfile` interface - Complete user health data structure
- `MealContext` interface - Comprehensive meal data for analysis

Key capabilities:
- Handles 14+ condition types (diabetes t1/t2, CKD stages 1-5, etc.)
- Calculates percentage of daily targets
- Includes latest vitals (glucose, BP, weight)
- Ramadan mode support
- Preserves original food names on edits

### 2. User Health Profile Helpers

**File: `lib/user/health-profile.ts`**

Functions:
- `getUserHealthProfile()` - Fetches complete health profile
- `getTodayIntake()` - Calculates cumulative daily nutrition
- `getUserConditions()` - Quick condition fetch
- `updateUserConditions()` - Update user's conditions
- `updateNutrientTargets()` - Update daily targets

### 3. Updated Dr. Reza API

**File: `app/api/chat-dr-reza/route.ts`**

Changes:
- Added `mealContext` parameter for food analysis
- Added `useEnhancedPrompt` flag (backward compatible)
- Integrates new prompt system
- Fetches complete health profile + today's intake
- Builds comprehensive meal analysis messages

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGS MEAL                            │
│         (e.g., "Nasi Lemak Rendang Ayam")                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend: FoodDetailModal                       │
│   • Captures full food name                                 │
│   • Calculates nutrition × serving multiplier               │
│   • Preserves originalFoodName on edit                      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         API Call: /api/chat-dr-reza (POST)                  │
│   Payload:                                                  │
│   {                                                          │
│     userId: "...",                                          │
│     message: "Analyze this meal",                           │
│     useEnhancedPrompt: true,                                │
│     mealContext: {                                          │
│       foodName: "Nasi Lemak Rendang Ayam",                 │
│       originalFoodName: "Nasi Lemak Rendang Ayam",         │
│       serving: "1x 1 pinggan",                              │
│       nutrition: { calories, carbs, ... },                  │
│       diabetes_rating: "caution",                           │
│       hypertension_rating: "limit",                         │
│       ...                                                    │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Dr. Reza API Route Logic                            │
│                                                              │
│   1. getUserHealthProfile(userId)                           │
│      → conditions: ['diabetes_t2', 'hypertension']          │
│      → targets: { carbs_g: 180, sodium_mg: 2000, ... }     │
│      → currentVitals: { glucose: 8.5, bp: 140/90 }         │
│                                                              │
│   2. getTodayIntake(userId)                                 │
│      → calories: 1200, carbs_g: 95g, sodium_mg: 1150mg     │
│                                                              │
│   3. getDrRezaSystemPrompt(healthProfile)                   │
│      → Builds comprehensive condition-aware prompt          │
│                                                              │
│   4. buildMealAnalysisMessage(mealContext)                  │
│      → Formats meal data for analysis                       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              OpenAI GPT-4 Analysis                          │
│                                                              │
│   System Prompt includes:                                   │
│   • All user conditions with specific guidelines            │
│   • Today's intake with % of targets                        │
│   • Latest vitals                                           │
│   • Instructions to analyze ALL conditions                  │
│                                                              │
│   User Message includes:                                    │
│   • Full food name (preserved)                              │
│   • Complete nutrition breakdown                            │
│   • Database condition ratings                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Dr. Reza's Multi-Condition Analysis               │
│                                                              │
│   **Nasi Lemak Rendang Ayam** - Overall: 🟡 BERHATI-HATI   │
│                                                              │
│   **Untuk keadaan anda:**                                   │
│                                                              │
│   • 🩸 **Diabetes**: At 58g carbs, expect glucose to       │
│     rise to 9-11 mmol/L in 45 mins. You've had 95g carbs   │
│     today (53% of 180g target).                             │
│                                                              │
│   • 💉 **Darah Tinggi**: Contains 720mg sodium (36% of     │
│     daily limit). Combined with 1150mg already today,       │
│     you'll be at 94% of limit. BP may spike.                │
│                                                              │
│   **Overall:** 🟡 Ok in moderation - watch portions         │
│                                                              │
│   **Tips:** Cuba minta "kuah sikit" untuk rendang, and     │
│   skip the extra sambal. Drink lots of water to help with  │
│   sodium. Consider a lighter dinner - grilled fish with    │
│   ulam would balance out today's intake!                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Basic Meal Analysis

```typescript
// Frontend - After user logs meal
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.id,
    message: 'Analyze this meal for my health conditions',
    useEnhancedPrompt: true, // Use new multi-condition system
    mealContext: {
      foodName: food.name_en,
      originalFoodName: food.name_en, // Preserve for edits
      serving: `${servingMultiplier}x ${food.serving_description}`,
      nutrition: {
        calories: food.calories_kcal * servingMultiplier,
        carbs_g: food.carbs_g * servingMultiplier,
        protein_g: food.protein_g * servingMultiplier,
        fat_g: food.total_fat_g * servingMultiplier,
        sodium_mg: food.sodium_mg * servingMultiplier,
        saturated_fat_g: food.saturated_fat_g * servingMultiplier,
        sugar_g: food.sugar_g * servingMultiplier,
        cholesterol_mg: food.cholesterol_mg * servingMultiplier,
        phosphorus_mg: food.phosphorus_mg * servingMultiplier,
        potassium_mg: food.potassium_mg * servingMultiplier,
      },
      diabetes_rating: food.diabetes_rating,
      hypertension_rating: food.hypertension_rating,
      cholesterol_rating: food.cholesterol_rating,
      ckd_rating: food.ckd_rating,
    }
  })
});

const { reply } = await response.json();
// Display reply to user
```

### Preserving Food Name on Edit

```typescript
// When user edits serving size
const [editedMeal, setEditedMeal] = useState({
  ...originalMeal,
  originalFoodName: originalMeal.foodName, // IMPORTANT: Preserve this!
  servingMultiplier: 1.5, // User changed from 1x to 1.5x
});

// When asking Dr. Reza about edited meal
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    message: 'How about if I have 1.5 servings instead?',
    mealContext: {
      foodName: editedMeal.originalFoodName, // Use original name!
      serving: `${editedMeal.servingMultiplier}x ${food.serving_description}`,
      nutrition: calculateAdjustedNutrition(food, editedMeal.servingMultiplier),
      // ... rest of context
    }
  })
});
```

### General Conversation (No Meal Context)

```typescript
// For general health questions
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    message: 'What should I eat for dinner that is good for my conditions?',
    useEnhancedPrompt: true,
    // No mealContext - just general advice
  })
});
```

---

## Response Format

Dr. Reza now provides structured, condition-specific analysis:

### Example Response (User has Diabetes + Hypertension)

```markdown
**Char Kuey Teow** - Overall: 🔴 HADKAN

Wah, CKT memang sedap! But let me break down how this affects your conditions:

**Untuk keadaan anda:**

• 🩸 **Diabetes**: This has 72g carbs - that's quite high! Your glucose will likely spike to 11-13 mmol/L in about 45 mins. You've already had 120g carbs today (67% of your 180g target), so this meal puts you at 107% for the day.

• 💉 **Darah Tinggi**: The kicap (dark soy sauce) means 980mg sodium - that's 49% of your daily limit in one meal! Combined with the 1,100mg you've had today, you'll hit 104% of your 2,000mg limit. Your blood pressure will likely go up.

**Overall:** 🔴 Better to limit this - too high in both carbs and sodium for your conditions

**Tips:** Next time, cuba Kuey Teow Soup instead - same taste profile but less oil and you can control the sodium by asking for "kuah sikit". Or try Hor Fun with vegetables - similar texture but lower GI and less sodium. For dinner tonight, go light - grilled fish with ulam would help balance things out, ok?
```

### Key Features of Response

1. **Traffic Light Rating** - 🟢 🟡 🔴 for quick assessment
2. **Condition-Specific Breakdown** - Individual analysis for each condition
3. **Actual Numbers** - Specific nutrient amounts and percentages
4. **Today's Context** - References cumulative daily intake
5. **Predicted Impact** - "glucose will spike to 11-13 mmol/L"
6. **Malaysian Alternatives** - Local food swaps, not Western
7. **Actionable Tips** - Specific, practical suggestions

---

## Database Schema Requirements

### User Profile Table (`user_profiles`)

```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,
  name TEXT,
  health_conditions TEXT[], -- Array of condition codes
  daily_targets JSONB, -- { calories, carbs_g, sodium_mg, etc. }
  ramadan_mode_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example daily_targets structure:
{
  "calories": 1800,
  "carbs_g": 180,
  "sugar_g": 25,
  "sodium_mg": 2000,
  "saturated_fat_g": 13,
  "cholesterol_mg": 200,
  "protein_g": 60,
  "phosphorus_mg": 800,
  "potassium_mg": 2000
}
```

### Food Logs Table (`food_logs`)

```sql
CREATE TABLE food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  malaysian_food_id UUID REFERENCES malaysian_foods(id),
  meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
  
  -- Food details (denormalized)
  food_name TEXT NOT NULL,
  serving_description TEXT,
  serving_multiplier DECIMAL DEFAULT 1.0,
  
  -- Calculated nutrition
  calories DECIMAL,
  carbs DECIMAL,
  protein DECIMAL,
  fat DECIMAL,
  sugar DECIMAL,
  sodium DECIMAL,
  
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Vitals Table (`user_vitals`)

```sql
CREATE TABLE user_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  vital_type TEXT NOT NULL, -- 'glucose', 'blood_pressure', 'weight'
  reading_value DECIMAL NOT NULL,
  reading_value_secondary DECIMAL, -- For BP diastolic
  context_tag TEXT, -- 'fasting', 'post_meal', 'before_bed'
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Configuration

### Environment Variables

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Default Targets

If user hasn't set custom targets, these defaults are used:

```typescript
const DEFAULT_TARGETS = {
  calories: 2000,
  carbs_g: 200,
  sugar_g: 25,
  sodium_mg: 2300,
  saturated_fat_g: 13,
  cholesterol_mg: 300,
  protein_g: 60,
  phosphorus_mg: 1000,
  potassium_mg: 2500,
};
```

### Condition-Specific Targets

Automatically adjusted based on conditions:

**Diabetes:**
- Carbs: 150-200g/day
- Sugar: <25g/day

**Hypertension:**
- Sodium: <2000mg/day
- Potassium: 2000-3000mg/day

**High Cholesterol:**
- Saturated fat: <13g/day
- Trans fat: 0g
- Cholesterol: <200mg/day

**CKD (Stage 3-5):**
- Protein: 40-60g/day (stage-dependent)
- Phosphorus: <800mg/day
- Potassium: <2000mg/day
- Sodium: <2000mg/day

---

## Testing

### Test Case 1: Multi-Condition User

**Setup:**
- User conditions: Diabetes T2, Hypertension
- Today's intake: 1200 cal, 95g carbs, 1150mg sodium

**Test Meal:** Nasi Lemak Rendang Ayam (580 cal, 58g carbs, 720mg sodium)

**Expected Response:**
✅ Mentions BOTH diabetes and hypertension
✅ Provides specific glucose prediction
✅ Warns about sodium (36% of limit + already at 58%)
✅ References today's cumulative intake
✅ Suggests Malaysian alternative

### Test Case 2: Meal Edit Preserves Context

**Setup:**
- User logs: "Nasi Lemak Rendang Ayam" (1x serving)
- User edits to: 0.5x serving

**Expected Response:**
✅ Still refers to "Nasi Lemak Rendang Ayam" (not shortened)
✅ Adjusts nutrition advice for 0.5x serving
✅ Updates glucose and sodium predictions accordingly

### Test Case 3: CKD + Diabetes

**Setup:**
- User conditions: CKD Stage 3, Diabetes T2
- Test meal: Grilled Chicken (high protein, low carb)

**Expected Response:**
✅ Warns about protein intake for CKD
✅ Praises low carbs for diabetes
✅ Mentions phosphorus content
✅ Provides balanced assessment for both conditions

### Test Case 4: No Conditions (General User)

**Setup:**
- User conditions: None
- Test meal: Any food

**Expected Response:**
✅ Provides general nutrition guidance
✅ Focuses on calories and macros
✅ Still warm and Malaysian-friendly
✅ No condition-specific warnings

---

## Migration Guide

### For Existing Implementations

1. **Add Enhanced Prompt Files:**
```bash
# New files to add
lib/ai/dr-reza-prompt.ts
lib/user/health-profile.ts
```

2. **Update API Route:**
```bash
# Modify existing
app/api/chat-dr-reza/route.ts
```

3. **Update Frontend Components:**
```typescript
// In your meal logging component
import { getConditionRatingsFromFood } from '@/lib/ai/dr-reza-prompt';

// When calling Dr. Reza API
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    message: 'Analyze this meal',
    useEnhancedPrompt: true, // NEW: Enable enhanced system
    mealContext: {
      // NEW: Full meal context
      foodName: food.name_en,
      originalFoodName: food.name_en,
      serving: `${multiplier}x ${food.serving_description}`,
      nutrition: { /* ... */ },
      ...getConditionRatingsFromFood(food),
    }
  })
});
```

### Backward Compatibility

The enhanced system is **fully backward compatible**:

```typescript
// Old way (still works)
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    message: 'What should I eat?',
    // useEnhancedPrompt defaults to false
  })
});

// New way (recommended)
const response = await fetch('/api/chat-dr-reza', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    message: 'Analyze this meal',
    useEnhancedPrompt: true, // Opt-in to new system
    mealContext: { /* ... */ }
  })
});
```

---

## Troubleshooting

### Issue: Dr. Reza doesn't mention all conditions

**Cause:** `useEnhancedPrompt` not set to `true`

**Solution:**
```typescript
// Make sure to enable enhanced prompt
{
  useEnhancedPrompt: true,
  // ...
}
```

### Issue: Food name gets shortened/lost on edit

**Cause:** Not preserving `originalFoodName`

**Solution:**
```typescript
// When editing meal, preserve original name
const [editedMeal, setEditedMeal] = useState({
  ...originalMeal,
  originalFoodName: originalMeal.foodName, // Keep this!
});

// Use originalFoodName in mealContext
mealContext: {
  foodName: editedMeal.originalFoodName || editedMeal.foodName,
  // ...
}
```

### Issue: Today's intake shows 0

**Cause:** `food_logs` table query might be failing

**Debug:**
```typescript
// Add logging in getTodayIntake()
const intake = await getTodayIntake(userId);
console.log('Today intake:', intake);
```

**Check:**
- `logged_at` timestamps are correct
- Date filtering matches user's timezone
- `food_logs` table has data

### Issue: No condition-specific advice

**Cause:** User's `health_conditions` array is empty

**Debug:**
```typescript
// Check user profile
const profile = await getUserHealthProfile(userId);
console.log('Conditions:', profile.conditions);
```

**Solution:**
- Ensure user has completed onboarding
- Verify `health_conditions` saved to database
- Check array format: `['diabetes_t2', 'hypertension']`

---

## Performance Considerations

### Caching

Consider caching user health profiles:

```typescript
// Simple in-memory cache (expires after 5 minutes)
const profileCache = new Map<string, { profile: UserHealthProfile, expires: number }>();

export async function getCachedHealthProfile(userId: string): Promise<UserHealthProfile> {
  const cached = profileCache.get(userId);
  if (cached && cached.expires > Date.now()) {
    return cached.profile;
  }
  
  const profile = await getUserHealthProfile(userId);
  profileCache.set(userId, {
    profile,
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  });
  
  return profile;
}
```

### Query Optimization

The enhanced system makes 3-4 database queries:
1. User profile (with conditions & targets)
2. Today's food logs (for intake calculation)
3. Latest vitals (glucose, BP, weight)

**Optimization tips:**
- Use Supabase's `select()` to fetch only needed columns
- Consider database indexing on frequently queried fields
- Parallel queries with `Promise.all()` (already implemented)

### API Response Time

Expected timings:
- Database queries: 50-150ms
- OpenAI GPT-4 call: 1-3 seconds
- **Total:** ~1.5-3.5 seconds

To reduce:
- Use `gpt-4o-mini` instead of `gpt-4` (faster, cheaper)
- Implement response streaming for real-time feel
- Cache common meal analyses

---

## Future Enhancements

### Phase 2

1. **Medication Tracking**
   - Track medications and timing
   - Warn about food-drug interactions
   - Consider medication schedules in advice

2. **Exercise Integration**
   - Factor in physical activity
   - Adjust targets based on exercise
   - Post-workout meal suggestions

3. **Meal Planning**
   - Weekly meal plan generator
   - Shopping list creation
   - Recipe suggestions

### Phase 3

1. **AI-Powered Insights**
   - Pattern recognition in eating habits
   - Predict glucose spikes before meals
   - Personalized timing recommendations

2. **Social Features**
   - Share meal plans
   - Community recipes
   - Support groups

3. **Healthcare Provider Integration**
   - Export reports for doctors
   - Share data with dietitians
   - Medication sync

---

## Support

For issues or questions:
1. Check this documentation
2. Review test cases above
3. Check troubleshooting section
4. Verify database schema matches requirements

---

**Status: ✅ PRODUCTION READY**

**Version:** 2.0
**Date:** January 2026
**Maintained by:** Boleh Makan Development Team

🇲🇾 **Built with love for the Malaysian community!**

