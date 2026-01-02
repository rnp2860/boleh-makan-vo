'use client';

// components/cgm/CGMTeaser.tsx
// 📊 CGM Teaser Card - Dashboard widget to promote CGM waitlist

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ChevronRight, Users, Zap, TrendingUp, Sparkles } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface CGMTeaserProps {
  /** Variant style */
  variant?: 'default' | 'compact' | 'banner';
  /** Optional tenant slug for path */
  tenantSlug?: string;
  /** Custom class name */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CGMTeaser({
  variant = 'default',
  tenantSlug,
  className = '',
}: CGMTeaserProps) {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const basePath = tenantSlug ? `/t/${tenantSlug}` : '';
  
  // Fetch waitlist count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/cgm/waitlist/count');
        const data = await res.json();
        if (data.success) {
          setWaitlistCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      }
    };
    
    fetchCount();
  }, []);

  // Compact variant for sidebars
  if (variant === 'compact') {
    return (
      <Link
        href={`${basePath}/cgm`}
        className={`
          block p-4 rounded-xl
          bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10
          border border-violet-200 dark:border-violet-800
          hover:from-violet-500/20 hover:to-fuchsia-500/20
          transition-all duration-300
          ${className}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-500 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              CGM Integration
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400">
              Coming Soon
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </Link>
    );
  }

  // Banner variant for top of page
  if (variant === 'banner') {
    return (
      <div className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
        p-4 md:p-6
        ${className}
      `}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 80 80">
            <pattern id="cgm-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cgm-pattern)" />
          </svg>
        </div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                🚀 CGM Integration Coming Soon!
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Auto-sync your FreeStyle Libre or Dexcom data
                {waitlistCount && waitlistCount > 100 && (
                  <span className="ml-2 text-white/90">
                    • {waitlistCount.toLocaleString()} waiting
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <Link
            href={`${basePath}/cgm`}
            className="
              inline-flex items-center justify-center
              px-5 py-2.5 rounded-lg
              bg-white text-purple-700 font-semibold
              hover:bg-white/90 transition-colors
              shadow-lg shadow-purple-900/20
            "
          >
            Join Waitlist
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-violet-50 to-fuchsia-50
      dark:from-violet-950/50 dark:to-fuchsia-950/50
      border border-violet-200 dark:border-violet-800
      p-6
      ${className}
    `}>
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-4">
          <Sparkles className="h-3 w-3 mr-1.5" />
          Coming Soon
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          CGM Integration
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Connect your FreeStyle Libre or Dexcom for automatic glucose tracking
        </p>
        
        {/* Features preview */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { icon: Zap, label: 'Auto-sync readings' },
            { icon: TrendingUp, label: 'Meal correlations' },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <Icon className="h-4 w-4 text-violet-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        
        {/* Waitlist count */}
        {waitlistCount && waitlistCount > 50 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Users className="h-4 w-4" />
            <span>
              <strong className="text-gray-700 dark:text-gray-200">
                {waitlistCount.toLocaleString()}
              </strong>
              {' '}people waiting
            </span>
          </div>
        )}
        
        {/* CTA */}
        <Link
          href={`${basePath}/cgm`}
          className="
            inline-flex items-center justify-center w-full
            px-4 py-3 rounded-xl
            bg-gradient-to-r from-violet-600 to-fuchsia-600
            text-white font-semibold
            hover:from-violet-700 hover:to-fuchsia-700
            transition-all duration-300
            shadow-lg shadow-violet-500/25
            group
          "
        >
          <Activity className="h-5 w-5 mr-2 group-hover:animate-pulse" />
          Join the Waitlist
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// ============================================
// MINI VERSION
// ============================================

export function CGMTeaserMini({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/cgm"
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg
        bg-violet-100 dark:bg-violet-900/30
        text-violet-700 dark:text-violet-300
        hover:bg-violet-200 dark:hover:bg-violet-900/50
        transition-colors text-sm font-medium
        ${className}
      `}
    >
      <Activity className="h-4 w-4" />
      <span>CGM Coming Soon</span>
      <ChevronRight className="h-3 w-3" />
    </Link>
  );
}


