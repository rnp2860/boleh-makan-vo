'use client';

// 🇲🇾 Boleh Makan Hero Section

import React from 'react';
import { WaitlistForm } from './WaitlistForm';
import { Users, Heart, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                100% Percuma • AI-Powered
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Makan Bijak,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Hidup Sihat
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Malaysia&apos;s first <strong>FREE</strong> AI health companion for managing{' '}
              <span className="text-emerald-600 font-medium">diabetes</span>,{' '}
              <span className="text-emerald-600 font-medium">darah tinggi</span>,{' '}
              <span className="text-emerald-600 font-medium">kolesterol</span>, and{' '}
              <span className="text-emerald-600 font-medium">kidney health</span>.
            </p>
            
            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">
                  <strong className="text-slate-800">10 juta+</strong> rakyat Malaysia
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-slate-600">
                  dengan <strong className="text-slate-800">penyakit kronik</strong>
                </span>
              </div>
            </div>
            
            {/* Mobile: Show form inline */}
            <div className="lg:hidden">
              <WaitlistForm variant="hero" source="hero_mobile" />
            </div>
          </div>
          
          {/* Right Column - Form Card */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Jadi yang pertama
                </h2>
                <p className="text-slate-600">
                  Sertai waitlist untuk akses awal
                </p>
              </div>
              
              <WaitlistForm 
                variant="hero" 
                source="hero_desktop"
                showRamadanCheckbox
              />
              
              <p className="text-xs text-slate-400 text-center mt-4">
                Percuma selamanya. Tiada kad kredit diperlukan.
              </p>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-xs">Scroll untuk lebih</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

