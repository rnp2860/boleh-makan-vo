# 🚀 Dr. Reza AI - Quick Start Guide

## 30-Second Overview

Dr. Reza AI now analyzes meals against **ALL** user health conditions simultaneously, providing specific warnings and Malaysian-friendly alternatives.

---

## Implementation in 3 Steps

### Step 1: Import Required Functions

```typescript
import { getConditionRatingsFromFood } from '@/lib/ai/dr-reza-prompt';
```

### Step 2: Call Enhanced API

```typescript
// After user logs a meal
const analyzeMeal = async (food, servingMultiplier) => {
  const response = await fetch('/api/chat-dr-reza', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      message: 'Analyze this meal for my conditions',
      useEnhancedPrompt: true, // ← Enable multi-condition system
      mealContext: {
        foodName: food.name_en,
        originalFoodName: food.name_en,
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
        ...getConditionRatingsFromFood(food),
      }
    })
  });
  
  const { reply } = await response.json();
  return reply;
};
```

### Step 3: Display Response

```tsx
<div className="p-4 bg-white rounded-xl">
  <p className="text-sm text-gray-700 whitespace-pre-wrap">
    {drRezaAdvice}
  </p>
</div>
```

---

## Complete Example: FoodDetailModal

```typescript
'use client';

import { useState } from 'react';
import { getConditionRatingsFromFood } from '@/lib/ai/dr-reza-prompt';

export function FoodDetailModal({ food, userId, onClose }) {
  const [servingMultiplier, setServingMultiplier] = useState(1.0);
  const [drRezaAdvice, setDrRezaAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalFoodName] = useState(food.name_en); // Preserve original
  
  const analyzeMeal = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat-dr-reza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: 'Analyze this meal for my health conditions',
          useEnhancedPrompt: true,
          mealContext: {
            foodName: originalFoodName, // Use preserved name
            originalFoodName,
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
            ...getConditionRatingsFromFood(food),
          }
        })
      });
      
      const { reply } = await response.json();
      setDrRezaAdvice(reply);
    } catch (error) {
      console.error('Dr. Reza analysis failed:', error);
      setDrRezaAdvice('Sorry, I could not analyze this meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleServingChange = (multiplier) => {
    setServingMultiplier(multiplier);
    // Re-analyze with new serving size
    analyzeMeal();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Food Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{food.name_bm}</h2>
          <p className="text-gray-600">{food.name_en}</p>
        </div>
        
        {/* Serving Selector */}
        <div className="p-6 border-b">
          <h3 className="font-semibold mb-3">Serving Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1.0, 1.5, 2.0].map(multiplier => (
              <button
                key={multiplier}
                onClick={() => handleServingChange(multiplier)}
                className={`py-2 rounded-lg font-medium ${
                  servingMultiplier === multiplier
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {multiplier === 0.5 ? 'Half' : 
                 multiplier === 1.0 ? 'Normal' :
                 multiplier === 1.5 ? '1.5x' : 'Double'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Nutrition Summary */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-xl font-bold">
                {Math.round(food.calories_kcal * servingMultiplier)} kcal
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-xl font-bold">
                {Math.round(food.carbs_g * servingMultiplier)}g
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-xl font-bold">
                {Math.round(food.protein_g * servingMultiplier)}g
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sodium</p>
              <p className="text-xl font-bold">
                {Math.round(food.sodium_mg * servingMultiplier)}mg
              </p>
            </div>
          </div>
        </div>
        
        {/* Dr. Reza Analysis */}
        <div className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🩺</span> Dr. Reza's Analysis
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : drRezaAdvice ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {drRezaAdvice}
              </p>
            </div>
          ) : (
            <button
              onClick={analyzeMeal}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white 
                       font-semibold rounded-xl transition-colors"
            >
              Get Dr. Reza's Advice
            </button>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold
                     hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Log meal logic here
              onClose();
            }}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                     hover:bg-emerald-700 transition-colors"
          >
            Log This Meal
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Key Points to Remember

### ✅ DO:
- Set `useEnhancedPrompt: true` for multi-condition analysis
- Preserve `originalFoodName` when editing meals
- Include complete `nutrition` object with all nutrients
- Pass `getConditionRatingsFromFood(food)` for context

### ❌ DON'T:
- Forget to multiply nutrition by serving multiplier
- Lose food name context when editing
- Omit condition ratings from meal context
- Use generic error messages

---

## Testing Your Implementation

### Test 1: Multi-Condition User
```typescript
// User with Diabetes + Hypertension logs Nasi Lemak
// Expected: Advice mentions BOTH conditions with specific numbers
```

### Test 2: Meal Edit
```typescript
// User changes serving from 1x to 1.5x
// Expected: Dr. Reza updates advice for new serving size
//           Still refers to full food name
```

### Test 3: No Conditions
```typescript
// User with no health conditions logs any meal
// Expected: General nutrition advice, no condition warnings
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Only one condition mentioned | Set `useEnhancedPrompt: true` |
| Food name gets shortened | Preserve `originalFoodName` |
| Today's intake shows 0 | Check `food_logs` table has data |
| No response | Verify OpenAI API key is set |

---

## Next Steps

1. ✅ Implement in your food logging component
2. ✅ Test with users who have multiple conditions
3. ✅ Monitor response quality
4. ✅ Gather user feedback

For detailed documentation, see **DR_REZA_AI_UPGRADE.md**

---

**Need help?** Check the full documentation or troubleshooting guide.

🇲🇾 Happy coding!

