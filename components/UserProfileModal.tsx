'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'diabetes' | 'hypertension' | 'cholesterol' | 'muscle_gain';
  customCalorieLimit?: number; // OPTIONAL OVERRIDE
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

  // Load existing profile when modal opens
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        try { setFormData(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [open]);

  // Real-time Calculator for the UI
  useEffect(() => {
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    } else {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    }
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (multipliers[formData.activityLevel] || 1.2));
    
    // MEDICAL LOGIC UPDATE:
    if (formData.goal === 'weight_loss') {
      setCalculatedTDEE(tdee - 500); // Aggressive Cut
    } else if (formData.goal === 'weight_gain' || formData.goal === 'muscle_gain') {
      setCalculatedTDEE(tdee + 300); // Surplus
    } else if (['diabetes', 'hypertension', 'cholesterol'].includes(formData.goal)) {
      setCalculatedTDEE(tdee - 250); // Therapeutic Deficit (Metabolic Health)
    } else {
      setCalculatedTDEE(tdee); // Maintenance
    }

  }, [formData.age, formData.gender, formData.height, formData.weight, formData.activityLevel, formData.goal]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_profile', JSON.stringify(formData));
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-teal-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>⚙️</span> Patient Profile
          </h2>
          <button onClick={onClose} className="text-teal-100 hover:text-white text-xl">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
              <input type="number" required className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.age} onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as any})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
              <input type="number" required className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.height} onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
              <input type="number" required className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.weight} onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Activity Level</label>
            <select className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}>
              <option value="sedentary">Sedentary (Office Job)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="active">Active (Daily Exercise)</option>
              <option value="very_active">Very Active (Physical Job)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Health Goal</label>
            <select className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value as any})}>
              <option value="weight_loss">Lose Weight (Potong Lemak)</option>
              <option value="maintenance">Maintain Weight (Jaga Badan)</option>
              <option value="muscle_gain">Build Muscle (Abang Sado)</option>
              <option value="diabetes">Diabetes (Kencing Manis)</option>
              <option value="hypertension">Hypertension (Darah Tinggi)</option>
              <option value="cholesterol">High Cholesterol (Kolesterol)</option>
            </select>
          </div>

          {/* Calorie Calculator Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-600">Recommended Daily Limit:</span>
              <span className="text-lg font-bold text-teal-600">{calculatedTDEE} kcal</span>
            </div>
            
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custom Limit (Optional)</label>
              <div className="flex gap-2">
                 <input 
                   type="number" 
                   placeholder={`e.g. ${calculatedTDEE}`}
                   className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                   value={formData.customCalorieLimit || ''}
                   onChange={(e) => setFormData({...formData, customCalorieLimit: e.target.value ? Number(e.target.value) : undefined})}
                 />
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, customCalorieLimit: undefined})}
                   className="px-3 py-1 text-xs text-slate-400 hover:text-red-500"
                 >
                   Reset
                 </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Leave blank to use Dr. Reza's recommendation.</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md">
            Save Profile
          </button>

        </form>
      </div>
    </div>
  );
}