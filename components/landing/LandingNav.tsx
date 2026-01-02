'use client';

// 🇲🇾 Landing Page Navigation

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl 
                           flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${
              isScrolled ? 'text-slate-900' : 'text-slate-900'
            }`}>
              Boleh Makan
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ciri-ciri
            </a>
            <a
              href="#ramadan"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ramadan 🌙
            </a>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log Masuk
            </Link>
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#signup"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 
                        text-white font-semibold text-sm px-5 py-2.5 rounded-full 
                        transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Sertai Waitlist
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#features"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ciri-ciri
            </a>
            <a
              href="#ramadan"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ramadan 🌙
            </a>
            <Link
              href="/dashboard"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log Masuk
            </Link>
            <a
              href="#signup"
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 
                        text-white font-semibold py-3 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sertai Waitlist
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default LandingNav;

