# 🩺 Dr. Reza AI - Visual Reference Card

## 🎯 The Upgrade at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE: Generic Advice                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User: Has Diabetes + Hypertension                          │
│  Food: Nasi Lemak (580 cal, 58g carbs, 720mg sodium)       │
│                                                              │
│  Dr. Reza Says:                                             │
│  "This Nasi Lemak has high calories and carbs.              │
│   Try to eat in moderation."                                │
│                                                              │
│  ❌ Mentions only 1-2 nutrients                             │
│  ❌ No condition-specific warnings                          │
│  ❌ No today's context                                      │
│  ❌ Generic advice                                          │
└─────────────────────────────────────────────────────────────┘

                            ⬇️  UPGRADE  ⬇️

┌─────────────────────────────────────────────────────────────┐
│  AFTER: Multi-Condition Analysis                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Same User & Food                                           │
│                                                              │
│  Dr. Reza Says:                                             │
│  "Nasi Lemak - 🟡 BERHATI-HATI                             │
│                                                              │
│   Untuk keadaan anda:                                       │
│                                                              │
│   • 🩸 Diabetes: At 58g carbs, expect glucose spike to     │
│     9-11 mmol/L in 45 mins. You've had 95g carbs today     │
│     (53% of 180g target).                                   │
│                                                              │
│   • 💉 Darah Tinggi: Contains 720mg sodium (36% of         │
│     daily limit). Combined with 1150mg already today,       │
│     you'll be at 94% of limit. BP may spike.                │
│                                                              │
│   Tips: Cuba minta 'kuah sikit', skip extra sambal.        │
│   Consider lighter dinner - grilled fish with ulam!"        │
│                                                              │
│  ✅ Analyzes ALL conditions                                 │
│  ✅ Specific predictions with numbers                       │
│  ✅ Today's cumulative intake                               │
│  ✅ Malaysian alternatives                                  │
│  ✅ Actionable advice                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Features Comparison

| Feature | Before | After |
|---------|--------|-------|
| **Conditions Analyzed** | 1 (50%) | All (100%) |
| **Specific Numbers** | Rare | Always |
| **Glucose Predictions** | ❌ | ✅ 9-11 mmol/L |
| **Today's Context** | ❌ | ✅ With % |
| **Malaysian Swaps** | Sometimes | Always |
| **Tone** | Clinical | Warm & Friendly |
| **Food Name Memory** | ❌ Lost on edit | ✅ Preserved |

---

## 🚀 Implementation Checklist

### ✅ Files Added
- [ ] `lib/ai/dr-reza-prompt.ts`
- [ ] `lib/user/health-profile.ts`

### ✅ Files Updated
- [ ] `app/api/chat-dr-reza/route.ts`

### ✅ Frontend Integration
```typescript
// In your meal logging component
{
  useEnhancedPrompt: true, // ← Add this
  mealContext: {           // ← Add this
    foodName: food.name_en,
    originalFoodName: food.name_en,
    serving: `${multiplier}x ${food.serving_description}`,
    nutrition: { /* all nutrients */ },
    ...getConditionRatingsFromFood(food),
  }
}
```

### ✅ Testing
- [ ] Multi-condition user → mentions all conditions
- [ ] Edit meal → preserves food name
- [ ] Today's intake → shows cumulative totals
- [ ] Malaysian alternatives → suggested

---

## 💡 Key Concepts

### 1. Multi-Condition Analysis
```
User has: [Diabetes, Hypertension, Cholesterol]

Dr. Reza analyzes food against:
✅ Diabetes   → Carbs, sugar, GI
✅ Hypertension → Sodium
✅ Cholesterol → Sat fat, trans fat

NOT just one!
```

### 2. Context Preservation
```typescript
// ❌ Wrong - loses context
mealContext: {
  foodName: 'nasi lemak', // User typed this
}

// ✅ Right - preserves original
mealContext: {
  foodName: originalFoodName, // "Nasi Lemak Rendang Ayam"
  originalFoodName: 'Nasi Lemak Rendang Ayam',
}
```

### 3. Today's Awareness
```
Already eaten today:
- 1200 cal (60% of 2000 target)
- 95g carbs (53% of 180g target)
- 1150mg sodium (58% of 2000mg target)

New meal adds:
- 580 cal → Total: 1780 cal (89%)
- 58g carbs → Total: 153g (85%)
- 720mg sodium → Total: 1870mg (94%) ⚠️

Dr. Reza warns about approaching sodium limit!
```

---

## 🎯 Traffic Light System

### 🟢 SELAMAT (Safe)
- All conditions: Safe levels
- No warnings needed
- Encourage this choice

### 🟡 BERHATI-HATI (Caution)
- Some conditions: Moderate risk
- Watch portions
- Provide specific tips

### 🔴 HADKAN (Limit)
- Multiple conditions: High risk
- Limit intake
- Suggest alternatives

---

## 📱 Response Format

```markdown
**[FOOD NAME]** - Overall: 🟢/🟡/🔴

**Untuk keadaan anda:**

• 🩸 **Diabetes**: [Specific impact with numbers]
• 💉 **Darah Tinggi**: [Specific impact with numbers]
• 💊 **Kolesterol**: [Specific impact with numbers]
• 🫘 **Buah Pinggang**: [Specific impact with numbers]

**Overall:** [Summary assessment]

**Tips:** [One actionable Malaysian suggestion]
```

---

## 🔧 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Only 1 condition mentioned | Set `useEnhancedPrompt: true` |
| Food name gets shortened | Preserve `originalFoodName` |
| Today's intake shows 0 | Check `food_logs` table |
| No response | Verify OpenAI API key |
| Generic advice | Include `mealContext` |

---

## 📚 Documentation Files

1. **DR_REZA_AI_UPGRADE.md** (19KB)
   - Complete technical docs
   - Architecture diagrams
   - Database schema
   - Testing guide

2. **DR_REZA_QUICK_START.md** (10KB)
   - 30-second overview
   - 3-step implementation
   - Code examples

3. **DR_REZA_IMPLEMENTATION_SUMMARY.md** (12KB)
   - Executive summary
   - Migration steps
   - Success metrics

---

## 🎉 Ready to Deploy!

```bash
# 1. Copy files
cp lib/ai/dr-reza-prompt.ts [your-project]/lib/ai/
cp lib/user/health-profile.ts [your-project]/lib/user/

# 2. Update API
# Modify app/api/chat-dr-reza/route.ts

# 3. Update frontend
# Add useEnhancedPrompt + mealContext

# 4. Test
npm run dev
```

### Total Time: ~30 minutes

---

## ✅ Success Criteria

After implementation, verify:

- [ ] Multi-condition user sees analysis for ALL conditions
- [ ] Specific predictions provided (e.g., "9-11 mmol/L")
- [ ] Today's cumulative intake shown with percentages
- [ ] Malaysian alternatives suggested (not Western)
- [ ] Food name preserved when editing servings
- [ ] Response is warm and encouraging
- [ ] No medical diagnoses given
- [ ] Concise (2-3 paragraphs max)

---

**Print this card for quick reference!**

🇲🇾 **Helping Malaysians live healthier lives!** 🩺

