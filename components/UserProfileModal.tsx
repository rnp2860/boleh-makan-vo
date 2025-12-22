'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'diabetes' | 'hypertension' | 'cholesterol' | 'muscle_gain';
  customCalorieLimit?: number; 
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

export default function UserProfileModal({ open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<UserProfile>({
    age: 30,
    gender: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'sedentary',
    goal: 'maintenance',
    customCalorieLimit: undefined
  });

  const [calculatedTDEE, setCalculatedTDEE] = useState<number>(0);

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        try { setFormData(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [open]);

  // Real-time Calculator
  useEffect(() => {
    let bmr;
    // Prevent NaN if inputs are empty during typing
    const w = formData.weight || 0;
    const h = formData.height || 0;
    const a = formData.age || 0;

    if (formData.gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (multipliers[formData.activityLevel] || 1.2));
    
    if (formData.goal === 'weight_loss') setCalculatedTDEE(tdee - 500);
    else if (formData.goal === 'weight_gain' || formData.goal === 'muscle_gain') setCalculatedTDEE(tdee + 300);
    else if (['diabetes', 'hypertension', 'cholesterol'].includes(formData.goal)) setCalculatedTDEE(tdee - 250);
    else setCalculatedTDEE(tdee);

  }, [formData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_profile', JSON.stringify(formData));
    onSave(formData);
    onClose();
  };

  // Helper to handle goal selection (Tap-to-Select)
  const GoalButton = ({ value, label, icon }: { value: string, label: string, icon: string }) => (
    <button
      type="button"
      onClick={() => setFormData({ ...formData, goal: value as any })}
      className={`p-3 rounded-xl border text-left transition-all relative ${
        formData.goal === value 
          ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-xs font-bold leading-tight ${formData.goal === value ? 'text-teal-700' : 'text-slate-600'}`}>
        {label}
      </div>
      {formData.goal === value && (
        <div className="absolute top-2 right-2 text-teal-500 text-xs">●</div>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-800">Your Profile</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Section 1: Vitals */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Physical Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Age - Using val || '' to fix sticky zero */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-colors"
                        value={formData.age || ''} 
                        onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} 
                    />
                </div>
                {/* Gender */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button type="button" onClick={() => setFormData({...formData, gender: 'male'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.gender === 'male' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>Male</button>
                        <button type="button" onClick={() => setFormData({...formData, gender: 'female'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.gender === 'female' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>Female</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Height */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Height (cm)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-colors"
                        value={formData.height || ''} 
                        onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} 
                    />
                </div>
                {/* Weight */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-colors"
                        value={formData.weight || ''} 
                        onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} 
                    />
                </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Goals (Grid Layout) */}
          <div className="space-y-3">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Health Goal</h3>
             <div className="grid grid-cols-2 gap-2">
                <GoalButton value="weight_loss" label="Lose Weight" icon="📉" />
                <GoalButton value="maintenance" label="Maintain" icon="⚖️" />
                <GoalButton value="muscle_gain" label="Build Muscle" icon="💪" />
                <GoalButton value="diabetes" label="Diabetes Care" icon="🩸" />
                <GoalButton value="hypertension" label="Low Salt (BP)" icon="🫀" />
                <GoalButton value="cholesterol" label="Low Fat/Chol" icon="🍔" />
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Calorie Override */}
          <div className="space-y-3">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Metabolic Target</h3>
             <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <p className="text-xs text-teal-600 font-bold uppercase">Dr. Reza recommends</p>
                        <p className="text-2xl font-black text-teal-800">{calculatedTDEE} <span className="text-sm font-medium">kcal</span></p>
                    </div>
                </div>
                
                <div className="bg-white p-2 rounded-lg border border-teal-200 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 pl-2">CUSTOM:</span>
                    <input 
                       type="number" 
                       placeholder="Override..."
                       className="flex-1 p-1 text-sm font-bold text-slate-800 outline-none"
                       value={formData.customCalorieLimit || ''}
                       onChange={(e) => setFormData({...formData, customCalorieLimit: e.target.value ? Number(e.target.value) : undefined})}
                    />
                </div>
             </div>
          </div>
        </div>

        {/* Footer (Save Button) */}
        <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
           <button 
             onClick={handleSubmit}
             className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
           >
             Save Updates
           </button>
        </div>

      </div>
    </div>
  );
}