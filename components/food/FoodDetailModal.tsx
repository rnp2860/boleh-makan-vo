'use client';

// 🇲🇾 Malaysian Food Detail Modal

import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useFoodDetail } from '@/hooks/useFoodSearch';
import type { MalaysianFood, ConditionRating } from '@/types/food';

const SERVING_PRESETS = [
  { multiplier: 0.5, label: 'Half' },
  { multiplier: 1.0, label: 'Normal' },
  { multiplier: 1.5, label: '1.5x' },
  { multiplier: 2.0, label: 'Double' },
];

interface FoodDetailModalProps {
  foodId: string | null;
  onClose: () => void;
  onLogMeal: (food: MalaysianFood, multiplier: number) => void;
  userConditions?: string[];
}

export function FoodDetailModal({
  foodId,
  onClose,
  onLogMeal,
  userConditions = [],
}: FoodDetailModalProps) {
  const { food, isLoading, error } = useFoodDetail(foodId);
  const [servingMultiplier, setServingMultiplier] = useState(1.0);
  const [customGrams, setCustomGrams] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'diabetes' | 'bp' | 'cholesterol' | 'kidney'>('basic');
  
  useEffect(() => {
    if (food) {
      setCustomGrams(food.serving_grams.toString());
    }
  }, [food]);
  
  if (!foodId) return null;
  
  const handleCustomGramsChange = (value: string) => {
    setCustomGrams(value);
    const grams = parseFloat(value);
    if (!isNaN(grams) && food) {
      setServingMultiplier(grams / food.serving_grams);
    }
  };
  
  const handleLog = () => {
    if (food) {
      onLogMeal(food, servingMultiplier);
      onClose();
    }
  };
  
  // Calculate adjusted nutrition
  const adjustedNutrition = food ? {
    calories: Math.round(food.calories_kcal * servingMultiplier),
    carbs: Math.round(food.carbs_g * servingMultiplier),
    sugar: food.sugar_g ? Math.round(food.sugar_g * servingMultiplier) : null,
    fiber: food.fiber_g ? Math.round(food.fiber_g * servingMultiplier) : null,
    sodium: food.sodium_mg ? Math.round(food.sodium_mg * servingMultiplier) : null,
    potassium: food.potassium_mg ? Math.round(food.potassium_mg * servingMultiplier) : null,
    total_fat: food.total_fat_g ? Math.round(food.total_fat_g * servingMultiplier) : null,
    saturated_fat: food.saturated_fat_g ? Math.round(food.saturated_fat_g * servingMultiplier) : null,
    trans_fat: food.trans_fat_g ? Math.round(food.trans_fat_g * servingMultiplier) : null,
    cholesterol: food.cholesterol_mg ? Math.round(food.cholesterol_mg * servingMultiplier) : null,
    protein: food.protein_g ? Math.round(food.protein_g * servingMultiplier) : null,
    phosphorus: food.phosphorus_mg ? Math.round(food.phosphorus_mg * servingMultiplier) : null,
  } : null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Maklumat Makanan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>
          )}
          
          {food && (
            <div className="p-4 space-y-6">
              {/* Food Header */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{food.name_bm}</h3>
                <p className="text-slate-500">{food.name_en}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {food.category.replace('_', ' ')}
                  </span>
                  {food.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Condition Warnings */}
              {userConditions.length > 0 && (
                <div className="space-y-2">
                  {userConditions.map((condition) => {
                    const rating = food[`${condition}_rating` as keyof MalaysianFood] as ConditionRating;
                    return (
                      <ConditionAlert key={condition} condition={condition} rating={rating} />
                    );
                  })}
                </div>
              )}
              
              {/* Serving Size Adjustment */}
              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Saiz hidangan / Serving size
                </label>
                
                {/* Preset Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {SERVING_PRESETS.map((preset) => (
                    <button
                      key={preset.multiplier}
                      onClick={() => {
                        setServingMultiplier(preset.multiplier);
                        setCustomGrams((food.serving_grams * preset.multiplier).toString());
                      }}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                        servingMultiplier === preset.multiplier
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                {/* Custom Grams Input */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newGrams = Math.max(10, parseFloat(customGrams || '0') - 10);
                      handleCustomGramsChange(newGrams.toString());
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <input
                    type="number"
                    value={customGrams}
                    onChange={(e) => handleCustomGramsChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center font-medium"
                  />
                  <span className="text-sm text-slate-600">g</span>
                  <button
                    onClick={() => {
                      const newGrams = parseFloat(customGrams || '0') + 10;
                      handleCustomGramsChange(newGrams.toString());
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Standard: {food.serving_grams}g ({food.serving_description})
                </p>
              </div>
              
              {/* Nutrition Tabs */}
              <div>
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-slate-200">
                  <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
                    Basic
                  </TabButton>
                  <TabButton active={activeTab === 'diabetes'} onClick={() => setActiveTab('diabetes')}>
                    Diabetes
                  </TabButton>
                  <TabButton active={activeTab === 'bp'} onClick={() => setActiveTab('bp')}>
                    Blood Pressure
                  </TabButton>
                  <TabButton active={activeTab === 'cholesterol'} onClick={() => setActiveTab('cholesterol')}>
                    Cholesterol
                  </TabButton>
                  <TabButton active={activeTab === 'kidney'} onClick={() => setActiveTab('kidney')}>
                    Kidney
                  </TabButton>
                </div>
                
                {activeTab === 'basic' && adjustedNutrition && (
                  <div className="grid grid-cols-2 gap-4">
                    <NutrientItem label="Calories" value={adjustedNutrition.calories} unit="kcal" />
                    <NutrientItem label="Carbs" value={adjustedNutrition.carbs} unit="g" />
                    <NutrientItem label="Protein" value={adjustedNutrition.protein} unit="g" />
                    <NutrientItem label="Fat" value={adjustedNutrition.total_fat} unit="g" />
                  </div>
                )}
                
                {activeTab === 'diabetes' && adjustedNutrition && (
                  <div className="space-y-3">
                    <NutrientItem label="Carbohydrates" value={adjustedNutrition.carbs} unit="g" />
                    <NutrientItem label="Sugar" value={adjustedNutrition.sugar} unit="g" />
                    <NutrientItem label="Fiber" value={adjustedNutrition.fiber} unit="g" />
                    {food.glycemic_index && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">GI Index</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{food.glycemic_index}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            food.gi_category === 'low' ? 'bg-emerald-100 text-emerald-700' :
                            food.gi_category === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {food.gi_category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'bp' && adjustedNutrition && (
                  <div className="space-y-3">
                    <NutrientItem label="Sodium" value={adjustedNutrition.sodium} unit="mg" warning={adjustedNutrition.sodium !== null && adjustedNutrition.sodium > 600} />
                    <NutrientItem label="Potassium" value={adjustedNutrition.potassium} unit="mg" />
                  </div>
                )}
                
                {activeTab === 'cholesterol' && adjustedNutrition && (
                  <div className="space-y-3">
                    <NutrientItem label="Total Fat" value={adjustedNutrition.total_fat} unit="g" />
                    <NutrientItem label="Saturated Fat" value={adjustedNutrition.saturated_fat} unit="g" warning={adjustedNutrition.saturated_fat !== null && adjustedNutrition.saturated_fat > 5} />
                    <NutrientItem label="Trans Fat" value={adjustedNutrition.trans_fat} unit="g" warning={adjustedNutrition.trans_fat !== null && adjustedNutrition.trans_fat > 0} />
                    <NutrientItem label="Cholesterol" value={adjustedNutrition.cholesterol} unit="mg" warning={adjustedNutrition.cholesterol !== null && adjustedNutrition.cholesterol > 100} />
                  </div>
                )}
                
                {activeTab === 'kidney' && adjustedNutrition && (
                  <div className="space-y-3">
                    <NutrientItem label="Protein" value={adjustedNutrition.protein} unit="g" />
                    <NutrientItem label="Phosphorus" value={adjustedNutrition.phosphorus} unit="mg" />
                    <NutrientItem label="Potassium" value={adjustedNutrition.potassium} unit="mg" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {food && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={handleLog}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                       rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log This Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function NutrientItem({ 
  label, 
  value, 
  unit, 
  warning 
}: { 
  label: string; 
  value: number | null; 
  unit: string; 
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">
          {value !== null ? `${value} ${unit}` : 'N/A'}
        </span>
        {warning && value !== null && (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        )}
      </div>
    </div>
  );
}

function ConditionAlert({ condition, rating }: { condition: string; rating: ConditionRating }) {
  const conditionLabels: Record<string, string> = {
    diabetes: 'Diabetes',
    hypertension: 'Darah Tinggi',
    cholesterol: 'Kolesterol',
    ckd: 'Buah Pinggang',
  };
  
  const ratingConfig = {
    safe: {
      icon: CheckCircle,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      iconColor: 'text-emerald-600',
      label: 'Selamat / Safe',
    },
    caution: {
      icon: Info,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      iconColor: 'text-amber-600',
      label: 'Berhati-hati / Caution',
    },
    limit: {
      icon: AlertTriangle,
      color: 'bg-red-50 border-red-200 text-red-700',
      iconColor: 'text-red-600',
      label: 'Had / Limit',
    },
  };
  
  const config = ratingConfig[rating];
  const Icon = config.icon;
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${config.color}`}>
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">
          {conditionLabels[condition]}: {config.label}
        </p>
      </div>
    </div>
  );
}

export default FoodDetailModal;
