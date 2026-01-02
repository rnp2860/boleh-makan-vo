'use client';

// 🇲🇾 Problem Section - Malaysian Health Statistics

import React from 'react';
import { Droplet, HeartPulse, Activity, Filter } from 'lucide-react';

const CONDITIONS = [
  {
    icon: Droplet,
    condition: 'Diabetes',
    conditionBm: 'Kencing Manis',
    stats: '3.6 juta',
    color: 'emerald',
    description: 'rakyat Malaysia',
  },
  {
    icon: HeartPulse,
    condition: 'Hypertension',
    conditionBm: 'Darah Tinggi',
    stats: '6.7 juta',
    color: 'rose',
    description: 'rakyat Malaysia',
  },
  {
    icon: Activity,
    condition: 'High Cholesterol',
    conditionBm: 'Kolesterol Tinggi',
    stats: '7.5 juta',
    color: 'amber',
    description: 'rakyat Malaysia',
  },
  {
    icon: Filter,
    condition: 'Kidney Disease',
    conditionBm: 'Buah Pinggang',
    stats: '5 juta',
    color: 'indigo',
    description: 'rakyat Malaysia',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-700',
    stats: 'text-emerald-600',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'bg-rose-100 text-rose-600',
    text: 'text-rose-700',
    stats: 'text-rose-600',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-700',
    stats: 'text-amber-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'bg-indigo-100 text-indigo-600',
    text: 'text-indigo-700',
    stats: 'text-indigo-600',
  },
};

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            &ldquo;Nak makan apa yang{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              selamat
            </span>{' '}
            untuk kesihatan saya?&rdquo;
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Jutaan rakyat Malaysia bertanya soalan ini setiap hari
          </p>
        </div>
        
        {/* Condition Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONDITIONS.map((item) => {
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            const Icon = item.icon;
            
            return (
              <div
                key={item.condition}
                className={`relative ${colors.bg} ${colors.border} border rounded-2xl p-6 
                           transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.icon} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Condition Name */}
                <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>
                  {item.conditionBm}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{item.condition}</p>
                
                {/* Stats */}
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${colors.stats}`}>
                    {item.stats}
                  </span>
                  <span className="text-sm text-slate-500">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Closing Line */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-2xl">🍽️</span>
            <p className="text-lg text-slate-700 font-medium">
              Setiap hidangan adalah{' '}
              <span className="text-emerald-600">keputusan kesihatan</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;

