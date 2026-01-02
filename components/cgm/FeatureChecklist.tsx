'use client';

// components/cgm/FeatureChecklist.tsx
// 📊 Feature Checklist - Multi-select CGM feature preferences

import React from 'react';
import { Check, Sparkles, RefreshCw, TrendingUp, Bell, BarChart3, Share2, Target, Download } from 'lucide-react';
import { CGMFeatureCode, CGMFeatureInfo } from '@/lib/cgm/types';
import { CGM_FEATURES } from '@/lib/cgm/devices';

// ============================================
// ICON MAP
// ============================================

const FEATURE_ICONS: Record<string, React.ElementType> = {
  auto_sync: RefreshCw,
  meal_correlation: TrendingUp,
  predictive_alerts: Bell,
  trend_analysis: BarChart3,
  doctor_sharing: Share2,
  ai_insights: Sparkles,
  time_in_range: Target,
  export_reports: Download,
};

// ============================================
// TYPES
// ============================================

interface FeatureChecklistProps {
  selectedFeatures: CGMFeatureCode[];
  onChange: (features: CGMFeatureCode[]) => void;
  maxSelections?: number;
  showPremiumBadge?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FeatureChecklist({
  selectedFeatures,
  onChange,
  maxSelections,
  showPremiumBadge = true,
  className = '',
}: FeatureChecklistProps) {
  const handleToggle = (code: CGMFeatureCode) => {
    if (selectedFeatures.includes(code)) {
      onChange(selectedFeatures.filter(f => f !== code));
    } else {
      if (maxSelections && selectedFeatures.length >= maxSelections) {
        // Remove first and add new
        onChange([...selectedFeatures.slice(1), code]);
      } else {
        onChange([...selectedFeatures, code]);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedFeatures.length === CGM_FEATURES.length) {
      onChange([]);
    } else {
      onChange(CGM_FEATURES.map(f => f.code));
    }
  };

  return (
    <div className={className}>
      {/* Header with select all */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the features you're most interested in
          {maxSelections && (
            <span className="ml-1 text-gray-400">
              ({selectedFeatures.length}/{maxSelections})
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
        >
          {selectedFeatures.length === CGM_FEATURES.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CGM_FEATURES.map((feature) => (
          <FeatureItem
            key={feature.code}
            feature={feature}
            isSelected={selectedFeatures.includes(feature.code)}
            onToggle={() => handleToggle(feature.code)}
            showPremiumBadge={showPremiumBadge}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// FEATURE ITEM
// ============================================

interface FeatureItemProps {
  feature: CGMFeatureInfo;
  isSelected: boolean;
  onToggle: () => void;
  showPremiumBadge: boolean;
}

function FeatureItem({
  feature,
  isSelected,
  onToggle,
  showPremiumBadge,
}: FeatureItemProps) {
  const Icon = FEATURE_ICONS[feature.code] || Sparkles;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative flex items-start p-4 rounded-xl border-2 transition-all text-left
        ${isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-700'
        }
      `}
    >
      {/* Checkbox */}
      <div className={`
        w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 transition-colors
        ${isSelected
          ? 'bg-violet-500 border-violet-500'
          : 'border-gray-300 dark:border-gray-600'
        }
      `}>
        {isSelected && <Check className="h-3 w-3 text-white" />}
      </div>

      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
        ${isSelected
          ? 'bg-violet-100 dark:bg-violet-800/50'
          : 'bg-gray-100 dark:bg-gray-700'
        }
      `}>
        <Icon className={`h-5 w-5 ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            font-medium text-sm
            ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}
          `}>
            {feature.label}
          </span>
          {showPremiumBadge && feature.isPremium && (
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded">
              Premium
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {feature.description}
        </span>
      </div>
    </button>
  );
}

// ============================================
// COMPACT VERSION
// ============================================

interface FeatureChecklistCompactProps {
  selectedFeatures: CGMFeatureCode[];
  onChange: (features: CGMFeatureCode[]) => void;
  className?: string;
}

export function FeatureChecklistCompact({
  selectedFeatures,
  onChange,
  className = '',
}: FeatureChecklistCompactProps) {
  const handleToggle = (code: CGMFeatureCode) => {
    if (selectedFeatures.includes(code)) {
      onChange(selectedFeatures.filter(f => f !== code));
    } else {
      onChange([...selectedFeatures, code]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {CGM_FEATURES.map((feature) => {
        const isSelected = selectedFeatures.includes(feature.code);
        const Icon = FEATURE_ICONS[feature.code] || Sparkles;

        return (
          <button
            key={feature.code}
            type="button"
            onClick={() => handleToggle(feature.code)}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${isSelected
                ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon className="h-3.5 w-3.5 mr-1.5" />
            {feature.label}
            {feature.isPremium && (
              <Sparkles className="h-3 w-3 ml-1 text-amber-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}


