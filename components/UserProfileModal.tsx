'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  // Updated to match our 6 specific Health Hero icons
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'diabetes' | 'hypertension' | 'cholesterol' | 'muscle_gain';
  customCalorieLimit?: number; 
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

// THE 6 HEALTH HERO GOALS
const GOAL_OPTIONS = [
  { id: 'weight_loss', label: 'Turun Berat', sub: 'Lose Weight', icon: '/assets/icon-weight-loss.png' },
  { id: 'maintenance', label: 'Kekal Sihat', sub: 'Maintain', icon: '/assets/icon-maintain.png' },
  { id: 'muscle_gain', label: 'Naik Otot', sub: 'Build Muscle', icon: '/assets/icon-muscle.png' },
  { id: 'diabetes', label: 'Kencing Manis', sub: 'Diabetes Care', icon: '/assets/icon-diabetes.png' },
  { id: 'hypertension', label: 'Kurang Garam', sub: 'Low Salt / BP', icon: '/assets/icon-low-salt.png' },
  { id: 'cholesterol', label: 'Rendah Kolesterol', sub: 'Heart Health', icon: '/assets/icon-low-fat.png' },
];

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

  // Real-time Calculator Logic
  useEffect(() => {
    let bmr;
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
    
    // Logic Deficits
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Your Profile</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Section 1: Vitals */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Physical Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        value={formData.age || ''} 
                        onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} 
                    />
                </div>
                {/* Gender */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 h-[54px]">
                        <button type="button" onClick={() => setFormData({...formData, gender: 'male'})} className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'male' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Male</button>
                        <button type="button" onClick={() => setFormData({...formData, gender: 'female'})} className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'female' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Female</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Height */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Height (cm)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        value={formData.height || ''} 
                        onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} 
                    />
                </div>
                {/* Weight */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        value={formData.weight || ''} 
                        onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} 
                    />
                </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Goals (NEW GRID LAYOUT) */}
          <div className="space-y-3">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Health Goal</h3>
             <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: option.id as any })}
                    className={`
                      relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                      ${formData.goal === option.id 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500' 
                        : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50'}
                    `}
                  >
                    {/* Icon Image */}
                    <div className="w-16 h-16 mb-2 relative">
                      <Image 
                          src={option.icon} 
                          alt={option.label} 
                          fill 
                          className="object-contain" 
                          sizes="64px"
                      />
                    </div>
                    
                    {/* Label */}
                    <span className="text-sm font-bold text-slate-800 text-center leading-tight">
                      {option.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 text-center mt-1">
                      {option.sub}
                    </span>

                    {/* Checkmark Badge */}
                    {formData.goal === option.id && (
                       <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    )}
                  </button>
                ))}
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Dr. Reza's Prescription */}
          <div className="space-y-3">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Dr. Reza's Plan</h3>
             
             {/* Prescription Card */}
             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-4 items-center relative overflow-hidden">
                
                {/* Dr. Reza Avatar (Full Body) */}
                <div className="w-20 h-24 relative flex-shrink-0 -mb-8 self-end">
                   <Image 
                     src="/assets/avatar-profile.png" 
                     alt="Dr. Reza"
                     fill
                     className="object-contain object-bottom"
                   />
                </div>

                <div className="flex-1 z-10">
                    <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Daily Target</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-black text-emerald-800 tracking-tight">{calculatedTDEE}</p>
                      <span className="text-sm font-bold text-emerald-600">kcal</span>
                    </div>
                    <p className="text-[10px] text-emerald-600/80 leading-tight mt-1">
                      Based on your vitals and the <strong>{GOAL_OPTIONS.find(g => g.id === formData.goal)?.label}</strong> protocol.
                    </p>
                </div>
             </div>
             
             {/* Manual Override */}
             <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 mt-2">
                 <span className="text-xs font-bold text-slate-400 uppercase">Manual Override:</span>
                 <input 
                    type="number" 
                    placeholder="Set custom limit..."
                    className="flex-1 p-1 text-sm font-bold text-slate-800 outline-none placeholder:font-normal"
                    value={formData.customCalorieLimit || ''}
                    onChange={(e) => setFormData({...formData, customCalorieLimit: e.target.value ? Number(e.target.value) : undefined})}
                 />
             </div>
          </div>
        </div>

        {/* Footer (Save Button) */}
        <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
           <button 
             onClick={handleSubmit}
             className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
           >
             <span>Confirm Profile</span>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </button>
        </div>

      </div>
    </div>
  );
}