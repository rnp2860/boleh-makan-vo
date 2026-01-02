'use client';

// 🌙 Ramadan Section - Special Highlight

import React from 'react';
import { Moon, Sun, Clock, Heart, Check } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { WaitlistForm } from './WaitlistForm';

const BENEFITS = [
  'Perancangan sahur untuk glukosa stabil',
  'Panduan berbuka untuk elak lonjakan gula',
  'Integrasi waktu solat',
  '30 hari tips puasa untuk setiap keadaan',
];

export function RamadanSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600" />
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/islamic-pattern.svg')] bg-repeat" />
      </div>
      
      {/* Moon decorations */}
      <div className="absolute top-10 right-10 opacity-20">
        <Moon className="w-32 h-32 text-white" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Sun className="w-24 h-24 text-white" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm 
                           rounded-full mb-6">
              <Moon className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Ramadan 2026
              </span>
            </div>
            
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Puasa dengan{' '}
              <span className="text-amber-200">yakin</span>
            </h2>
            
            <p className="text-lg text-amber-100 mb-8">
              Mod Ramadan khas untuk pesakit diabetes dan keadaan kronik.
              Berbuka dengan tenang, sahur dengan bijak.
            </p>
            
            {/* Countdown */}
            <div className="mb-8">
              <p className="text-amber-200 text-sm font-medium mb-3 flex items-center justify-center lg:justify-start gap-2">
                <Clock className="w-4 h-4" />
                Ramadan bermula dalam
              </p>
              <CountdownTimer />
            </div>
            
            {/* Benefits List */}
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column - Form */}
          <div className="lg:pl-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-amber-500" />
                <span className="text-amber-600 font-semibold">Ciri Khas Ramadan</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Sertai untuk Ramadan
              </h3>
              <p className="text-slate-600 mb-6">
                Daftar sekarang dan dapatkan akses awal ke mod Ramadan
              </p>
              
              <WaitlistForm 
                variant="ramadan" 
                source="ramadan_section"
                showRamadanCheckbox={false}
              />
              
              <p className="text-xs text-slate-400 text-center mt-4">
                Dijamin percuma. Sedia sebelum 1 Ramadan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RamadanSection;

