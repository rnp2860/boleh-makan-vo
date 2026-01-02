'use client';

// components/vitals/VitalStatusBadge.tsx
// 💓 Status Badge - Visual indicator for vital status

import React from 'react';
import { VitalStatus } from '@/lib/vitals/types';
import { getStatusLabel, getStatusColor, STATUS_COLORS } from '@/lib/vitals/status';

// ============================================
// TYPES
// ============================================

interface VitalStatusBadgeProps {
  status: VitalStatus;
  label?: string;
  language?: 'en' | 'ms';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function VitalStatusBadge({
  status,
  label,
  language = 'en',
  size = 'md',
  showDot = true,
  className = '',
}: VitalStatusBadgeProps) {
  const statusLabel = label || getStatusLabel(status, language);
  const color = getStatusColor(status);
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {showDot && (
        <span
          className={`rounded-full ${dotSizes[size]}`}
          style={{ backgroundColor: color }}
        />
      )}
      {statusLabel}
    </span>
  );
}

// ============================================
// STATUS DOT ONLY
// ============================================

interface StatusDotProps {
  status: VitalStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  className = '',
}: StatusDotProps) {
  const color = getStatusColor(status);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  return (
    <span className={`relative inline-flex ${className}`}>
      <span
        className={`rounded-full ${sizeClasses[size]}`}
        style={{ backgroundColor: color }}
      />
      {pulse && (status === 'high' || status === 'critical') && (
        <span
          className={`absolute inline-flex rounded-full ${sizeClasses[size]} opacity-75 animate-ping`}
          style={{ backgroundColor: color }}
        />
      )}
    </span>
  );
}

// ============================================
// STATUS INDICATOR BAR
// ============================================

interface StatusBarProps {
  status: VitalStatus;
  value: number;
  min?: number;
  max?: number;
  targetMin?: number;
  targetMax?: number;
  className?: string;
}

export function StatusBar({
  status,
  value,
  min = 0,
  max = 100,
  targetMin,
  targetMax,
  className = '',
}: StatusBarProps) {
  const color = getStatusColor(status);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Calculate target zone position
  const targetMinPercent = targetMin !== undefined 
    ? ((targetMin - min) / (max - min)) * 100 
    : undefined;
  const targetMaxPercent = targetMax !== undefined 
    ? ((targetMax - min) / (max - min)) * 100 
    : undefined;
  
  return (
    <div className={`relative h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      {/* Target zone indicator */}
      {targetMinPercent !== undefined && targetMaxPercent !== undefined && (
        <div
          className="absolute h-full bg-green-200 opacity-50"
          style={{
            left: `${targetMinPercent}%`,
            width: `${targetMaxPercent - targetMinPercent}%`,
          }}
        />
      )}
      
      {/* Value bar */}
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

// ============================================
// TREND INDICATOR
// ============================================

interface TrendIndicatorProps {
  trend: 'improving' | 'worsening' | 'stable' | 'insufficient_data';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  language?: 'en' | 'ms';
  className?: string;
}

const TREND_CONFIG = {
  improving: {
    icon: '↓',
    color: STATUS_COLORS.normal,
    label: { en: 'Improving', ms: 'Bertambah Baik' },
  },
  worsening: {
    icon: '↑',
    color: STATUS_COLORS.high,
    label: { en: 'Worsening', ms: 'Memburuk' },
  },
  stable: {
    icon: '→',
    color: STATUS_COLORS.borderline,
    label: { en: 'Stable', ms: 'Stabil' },
  },
  insufficient_data: {
    icon: '•',
    color: '#9CA3AF',
    label: { en: 'No trend', ms: 'Tiada trend' },
  },
};

export function TrendIndicator({
  trend,
  size = 'md',
  showLabel = true,
  language = 'en',
  className = '',
}: TrendIndicatorProps) {
  const config = TREND_CONFIG[trend];
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${sizeClasses[size]} ${className}`}
      style={{ color: config.color }}
    >
      <span className="text-lg">{config.icon}</span>
      {showLabel && <span>{config.label[language]}</span>}
    </span>
  );
}


