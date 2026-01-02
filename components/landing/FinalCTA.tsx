'use client';

// 🇲🇾 Final CTA Section

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { WaitlistForm } from './WaitlistForm';

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm 
                         rounded-full mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Sertai 1,000+ yang menunggu
            </span>
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Jadi yang pertama menggunakan{' '}
            <span className="text-emerald-200">Boleh Makan</span>
          </h2>
          
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Daftar sekarang untuk akses awal dan ciri-ciri eksklusif. 
            Percuma selamanya, tiada kad kredit diperlukan.
          </p>
        </div>
        
        {/* Form Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">Akses Awal</span>
            </div>
            
            <WaitlistForm 
              variant="final"
              source="final_cta"
              showConditions
              showRamadanCheckbox
              showNameField
            />
          </div>
          
          {/* Subtext */}
          <p className="text-center text-emerald-100 text-sm mt-6">
            Percuma selamanya. Tiada majikan atau insurans diperlukan.
            <br />
            <span className="opacity-75">Data anda selamat dan tidak dikongsi.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;

