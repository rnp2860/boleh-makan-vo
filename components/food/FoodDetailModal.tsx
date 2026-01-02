'use client';

// 🇲🇾 Malaysian Food Detail Modal

import React, { useState, useMemo } from 'react';
import { X, Minus, Plus, AlertTriangle, CheckCircle, XCircle, Info, Utensils } from 'lucide-react';
import { MalaysianFood, ConditionRating, DAILY_LIMITS } from '@/lib/malaysian-foods/types';
import { 
  calculateAdjustedNutrients, 
  getConditionWarnings,
  getRatingColor,
  formatServing,
  formatCalories,
  getGILabel,
  getGIColor,
} from '@/lib/malaysian-foods/utils';

interface FoodDetailModalProps {
  food: MalaysianFood;
  isOpen: boolean;
  onClose: () => void;
  onLogFood: (food: MalaysianFood, multiplier: number) => void;
  userConditions?: string[];
  isLogging?: boolean;
}

const PORTION_PRESETS = [0.5, 1, 1.5, 2];

export function FoodDetailModal({
  food,
  isOpen,
  onClose,
  onLogFood,
  userConditions = [],
  isLogging = false,
}: FoodDetailModalProps) {
  const [multiplier, setMultiplier] = useState(1);
  const [customMultiplier, setCustomMultiplier] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  
  // Calculate adjusted nutrients based on multiplier
  const adjustedNutrients = useMemo(() => 
    calculateAdjustedNutrients(food, multiplier),
    [food, multiplier]
  );
  
  // Get condition warnings
  const warnings = useMemo(() => 
    getConditionWarnings(food, userConditions, multiplier),
    [food, userConditions, multiplier]
  );
  
  if (!isOpen) return null;
  
  const handleMultiplierChange = (newMultiplier: number) => {
    setMultiplier(newMultiplier);
    setShowCustom(false);
  };
  
  const handleCustomMultiplier = () => {
    const value = parseFloat(customMultiplier);
    if (!isNaN(value) && value > 0 && value <= 10) {
      setMultiplier(value);
    }
  };
  
  const handleLog = () => {
    onLogFood(food, multiplier);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl 
                      overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-slate-100">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">{food.nameBm}</h2>
            <p className="text-sm text-slate-500">{food.nameEn}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Serving Size */}
          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="text-sm text-emerald-600 font-medium mb-1">Saiz Hidangan</div>
            <div className="text-2xl font-bold text-emerald-700">
              {formatServing(food, multiplier)}
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-1">
              {formatCalories(adjustedNutrients.caloriesKcal)}
            </div>
          </div>
          
          {/* Portion Selector */}
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">Saiz Portion</div>
            <div className="flex gap-2 flex-wrap">
              {PORTION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleMultiplierChange(preset)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    multiplier === preset && !showCustom
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}x
                </button>
              ))}
              <button
                onClick={() => setShowCustom(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showCustom
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lain
              </button>
            </div>
            
            {showCustom && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setMultiplier(Math.max(0.25, multiplier - 0.25))}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={customMultiplier || multiplier}
                  onChange={(e) => setCustomMultiplier(e.target.value)}
                  onBlur={handleCustomMultiplier}
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-center font-medium"
                  step="0.25"
                  min="0.25"
                  max="10"
                />
                <button
                  onClick={() => setMultiplier(Math.min(10, multiplier + 0.25))}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {/* Condition Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-600">Peringatan Kesihatan</div>
              {warnings.map((warning, index) => (
                <WarningCard key={index} warning={warning} />
              ))}
            </div>
          )}
          
          {/* GI Information */}
          {(food.glycemicIndex || food.giCategory) && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Indeks Glisemik (GI)</span>
              </div>
              <div className={`text-lg font-bold ${getGIColor(food.glycemicIndex)}`}>
                {getGILabel(food.glycemicIndex, food.giCategory)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {food.giCategory === 'low' && 'Rendah GI - sesuai untuk kawalan gula darah'}
                {food.giCategory === 'medium' && 'Sederhana GI - makan dengan bahagian kecil'}
                {food.giCategory === 'high' && 'Tinggi GI - boleh menyebabkan lonjakan gula darah'}
              </p>
            </div>
          )}
          
          {/* Nutrition Details */}
          <div>
            <div className="text-sm font-medium text-slate-600 mb-3">Maklumat Pemakanan</div>
            <div className="grid grid-cols-2 gap-3">
              <NutrientItem 
                label="Karbohidrat" 
                value={adjustedNutrients.carbsG} 
                unit="g"
                dailyPercent={Math.round((adjustedNutrients.carbsG / DAILY_LIMITS.carbs) * 100)}
              />
              <NutrientItem 
                label="Gula" 
                value={adjustedNutrients.sugarG} 
                unit="g"
                dailyPercent={adjustedNutrients.sugarG ? Math.round((adjustedNutrients.sugarG / DAILY_LIMITS.sugar) * 100) : undefined}
                warning={adjustedNutrients.sugarG && adjustedNutrients.sugarG > 15}
              />
              <NutrientItem 
                label="Protein" 
                value={adjustedNutrients.proteinG} 
                unit="g"
              />
              <NutrientItem 
                label="Lemak" 
                value={adjustedNutrients.totalFatG} 
                unit="g"
              />
              <NutrientItem 
                label="Lemak Tepu" 
                value={adjustedNutrients.saturatedFatG} 
                unit="g"
                dailyPercent={adjustedNutrients.saturatedFatG ? Math.round((adjustedNutrients.saturatedFatG / DAILY_LIMITS.saturatedFat) * 100) : undefined}
                warning={adjustedNutrients.saturatedFatG && adjustedNutrients.saturatedFatG > 7}
              />
              <NutrientItem 
                label="Sodium" 
                value={adjustedNutrients.sodiumMg} 
                unit="mg"
                dailyPercent={adjustedNutrients.sodiumMg ? Math.round((adjustedNutrients.sodiumMg / DAILY_LIMITS.sodium) * 100) : undefined}
                warning={adjustedNutrients.sodiumMg && adjustedNutrients.sodiumMg > 600}
              />
              <NutrientItem 
                label="Kolesterol" 
                value={adjustedNutrients.cholesterolMg} 
                unit="mg"
                dailyPercent={adjustedNutrients.cholesterolMg ? Math.round((adjustedNutrients.cholesterolMg / DAILY_LIMITS.cholesterol) * 100) : undefined}
              />
              <NutrientItem 
                label="Fosforus" 
                value={adjustedNutrients.phosphorusMg} 
                unit="mg"
              />
            </div>
          </div>
          
          {/* Source Info */}
          <div className="text-xs text-slate-400 text-center pt-2">
            Sumber data: {food.source === 'myfcd' ? 'Malaysian Food Composition Database' : 
                         food.source === 'hpb' ? 'Health Promotion Board Singapore' :
                         food.source === 'ai_estimated' ? 'AI Anggaran' : 'Manual'}
            {food.verified && ' ✓ Disahkan'}
          </div>
        </div>
        
        {/* Footer - Log Button */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            onClick={handleLog}
            disabled={isLogging}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300
                       text-white font-semibold rounded-xl transition-colors
                       flex items-center justify-center gap-2"
          >
            {isLogging ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                Log Makanan Ini
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// WARNING CARD
// ============================================

interface WarningCardProps {
  warning: {
    condition: string;
    rating: ConditionRating;
    message: string;
    detail?: string;
  };
}

function WarningCard({ warning }: WarningCardProps) {
  const conditionLabels: Record<string, string> = {
    diabetes: 'Diabetes',
    hypertension: 'Darah Tinggi',
    cholesterol: 'Kolesterol',
    ckd: 'Penyakit Buah Pinggang',
  };
  
  const Icon = warning.rating === 'safe' ? CheckCircle :
               warning.rating === 'caution' ? AlertTriangle :
               XCircle;
  
  return (
    <div className={`p-3 rounded-xl border ${getRatingColor(warning.rating)}`}>
      <div className="flex items-start gap-2">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-sm">
            {conditionLabels[warning.condition] || warning.condition}
          </div>
          <p className="text-sm opacity-80 mt-0.5">{warning.message}</p>
          {warning.detail && (
            <p className="text-xs opacity-60 mt-1">{warning.detail}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// NUTRIENT ITEM
// ============================================

interface NutrientItemProps {
  label: string;
  value: number | undefined;
  unit: string;
  dailyPercent?: number;
  warning?: boolean;
}

function NutrientItem({ label, value, unit, dailyPercent, warning }: NutrientItemProps) {
  if (value === undefined || value === null) {
    return (
      <div className="bg-slate-50 rounded-lg p-3">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-300">-</div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg p-3 ${warning ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-lg font-semibold ${warning ? 'text-amber-600' : 'text-slate-800'}`}>
        {value}{unit}
      </div>
      {dailyPercent !== undefined && (
        <div className="text-xs text-slate-400">
          {dailyPercent}% harian
        </div>
      )}
    </div>
  );
}

export default FoodDetailModal;

