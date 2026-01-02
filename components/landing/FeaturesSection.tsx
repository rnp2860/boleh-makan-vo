'use client';

// 🇲🇾 Features Section - Why Boleh Makan

import React from 'react';
import { Utensils, ClipboardCheck, Moon, MessageCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: Utensils,
    title: 'Malaysian Food Database',
    titleBm: 'Pangkalan Data Makanan Malaysia',
    description: 'Nasi lemak, char kuey teow, roti canai - kami faham makanan anda',
    highlight: '3,000+ makanan Malaysia',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    icon: ClipboardCheck,
    title: 'Condition-Aware Advice',
    titleBm: 'Nasihat Mengikut Keadaan',
    description: 'Bukan sekadar kalori - sodium untuk darah tinggi, karbohidrat untuk diabetes, protein untuk buah pinggang',
    highlight: 'Khusus untuk ANDA',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
  {
    icon: Moon,
    title: 'Ramadan Mode',
    titleBm: 'Mod Ramadan',
    description: 'Perancangan sahur, panduan berbuka, pengurusan glukosa semasa berpuasa',
    highlight: 'Direka khas untuk puasa',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
  },
  {
    icon: MessageCircle,
    title: 'Dr. Reza AI',
    titleBm: 'AI Jurulatih Kesihatan',
    description: 'Tanya apa sahaja tentang makanan dan kesihatan, dalam BM atau English',
    highlight: 'Dalam poket anda',
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Ciri-Ciri Utama
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Kenapa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Boleh Makan
            </span>?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Aplikasi kesihatan yang benar-benar memahami keperluan rakyat Malaysia
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={feature.title}
                className={`relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 
                           border border-white/50 shadow-sm
                           transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Icon with gradient background */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                                shadow-lg mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Highlight Badge */}
                <div className="inline-block px-3 py-1 bg-white/80 rounded-full text-sm font-medium 
                              text-slate-600 mb-4 shadow-sm">
                  {feature.highlight}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.titleBm}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{feature.title}</p>
                
                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

