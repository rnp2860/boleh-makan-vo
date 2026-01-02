'use client';

// 🇲🇾 Trust Section - Credibility Badges

import React from 'react';
import { Shield, Database, Heart, Award } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Database,
    title: 'Data Tempatan',
    description: 'Berdasarkan Malaysian Food Composition Database (MyFCD)',
  },
  {
    icon: Shield,
    title: 'Privasi Terjamin',
    description: 'Data anda selamat dan tidak dikongsi dengan pihak ketiga',
  },
  {
    icon: Heart,
    title: 'Percuma Selamanya',
    description: 'Ciri asas percuma tanpa had - tiada majikan diperlukan',
  },
  {
    icon: Award,
    title: 'Rujukan Sah',
    description: 'Data kesihatan berdasarkan NHMS 2023 dan garis panduan KKM',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Kenapa Percaya Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Dibina untuk{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              rakyat Malaysia
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kami faham keperluan unik kesihatan rakyat Malaysia
          </p>
        </div>
        
        {/* Trust Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm
                          text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-emerald-50 mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Stats Bar */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                3,000+
              </div>
              <div className="text-slate-600">Makanan Malaysia</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                100%
              </div>
              <div className="text-slate-600">Percuma untuk ciri asas</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                4
              </div>
              <div className="text-slate-600">Keadaan kesihatan disokong</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;

