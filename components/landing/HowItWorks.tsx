'use client';

// 🇲🇾 How It Works Section

import React from 'react';
import { UserPlus, Camera, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Daftar & Pilih',
    description: 'Daftar percuma dan pilih keadaan kesihatan anda',
    color: 'emerald',
  },
  {
    step: 2,
    icon: Camera,
    title: 'Log Makanan',
    description: 'Log makanan dengan carian mudah atau ambil gambar',
    color: 'indigo',
  },
  {
    step: 3,
    icon: Sparkles,
    title: 'Dapat Nasihat',
    description: 'Terima nasihat khusus untuk kesihatan anda',
    color: 'amber',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'text-emerald-600',
    number: 'bg-emerald-600',
    border: 'border-emerald-200',
  },
  indigo: {
    bg: 'bg-indigo-100',
    icon: 'text-indigo-600',
    number: 'bg-indigo-600',
    border: 'border-indigo-200',
  },
  amber: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    number: 'bg-amber-600',
    border: 'border-amber-200',
  },
};

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Mudah & Cepat
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Bagaimana Ia Berfungsi
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tiga langkah mudah untuk mula mengawal kesihatan anda
          </p>
        </div>
        
        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              const Icon = step.icon;
              
              return (
                <div key={step.step} className="relative">
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm
                                 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 z-10">
                    {/* Step number */}
                    <div className={`absolute -top-4 left-8 ${colors.number} text-white 
                                    w-8 h-8 rounded-full flex items-center justify-center 
                                    font-bold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`${colors.bg} w-16 h-16 rounded-2xl flex items-center 
                                    justify-center mb-6 mt-2`}>
                      <Icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow (mobile) */}
                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

