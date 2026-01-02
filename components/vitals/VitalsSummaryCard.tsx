'use client';

// components/vitals/VitalsSummaryCard.tsx
// 💓 Summary Card - Display latest vitals in a compact card

import React from 'react';
import { HeartPulse, Scale, Droplet, TestTube, ChevronRight, AlertCircle } from 'lucide-react';
import { VitalsSummary, VitalType, BPReading, WeightReading, GlucoseReading, LabsReading } from '@/lib/vitals/types';
import { VITAL_TYPES } from '@/lib/vitals/constants';
import { formatRelativeTime } from '@/lib/vitals/calculations';
import { VitalStatusBadge, StatusDot } from './VitalStatusBadge';

// ============================================
// TYPES
// ============================================

interface VitalsSummaryCardProps {
  summary: VitalsSummary;
  language?: 'en' | 'ms';
  onLogClick?: (type: VitalType) => void;
  onViewClick?: (type: VitalType) => void;
  compact?: boolean;
  className?: string;
}

// ============================================
// ICON MAP
// ============================================

const VITAL_ICONS = {
  bp: HeartPulse,
  weight: Scale,
  glucose: Droplet,
  labs: TestTube,
};

// ============================================
// MAIN COMPONENT
// ============================================

export function VitalsSummaryCard({
  summary,
  language = 'en',
  onLogClick,
  onViewClick,
  compact = false,
  className = '',
}: VitalsSummaryCardProps) {
  const hasAnyVitals = !!(summary.bp || summary.weight || summary.glucose || summary.labs);
  
  if (!hasAnyVitals) {
    return (
      <div className={`rounded-2xl bg-background border border-border p-6 ${className}`}>
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-muted" />
          </div>
          <p className="text-foreground-muted text-sm mb-4">
            {language === 'ms' 
              ? 'Tiada data vital direkod lagi' 
              : 'No vitals recorded yet'}
          </p>
          <button
            onClick={() => onLogClick?.('bp')}
            className="text-sm font-medium text-primary hover:underline"
          >
            {language === 'ms' ? 'Mula merekod' : 'Start logging'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-2xl bg-background border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          {language === 'ms' ? 'Vital Terkini' : 'Recent Vitals'}
        </h3>
        {onViewClick && (
          <button
            onClick={() => onViewClick('bp')}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {language === 'ms' ? 'Lihat semua' : 'View all'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Vitals Grid */}
      <div className={compact ? 'divide-y divide-border' : 'grid grid-cols-2 gap-px bg-border'}>
        {summary.bp && (
          <BPSummaryItem
            data={summary.bp}
            language={language}
            compact={compact}
            onLog={() => onLogClick?.('bp')}
            onView={() => onViewClick?.('bp')}
          />
        )}
        
        {summary.weight && (
          <WeightSummaryItem
            data={summary.weight}
            language={language}
            compact={compact}
            onLog={() => onLogClick?.('weight')}
            onView={() => onViewClick?.('weight')}
          />
        )}
        
        {summary.glucose && (
          <GlucoseSummaryItem
            data={summary.glucose}
            language={language}
            compact={compact}
            onLog={() => onLogClick?.('glucose')}
            onView={() => onViewClick?.('glucose')}
          />
        )}
        
        {summary.labs && (
          <LabsSummaryItem
            data={summary.labs}
            language={language}
            compact={compact}
            onLog={() => onLogClick?.('labs')}
            onView={() => onViewClick?.('labs')}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// BP ITEM
// ============================================

interface SummaryItemProps<T> {
  data: T;
  language: 'en' | 'ms';
  compact: boolean;
  onLog?: () => void;
  onView?: () => void;
}

function BPSummaryItem({ data, language, compact, onLog, onView }: SummaryItemProps<BPReading>) {
  const Icon = VITAL_ICONS.bp;
  const typeInfo = VITAL_TYPES.bp;
  
  return (
    <div className="bg-background p-4 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeInfo.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">
              {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
            </p>
            <p className="text-lg font-bold text-foreground">
              {data.systolic}/{data.diastolic}
              <span className="text-sm font-normal text-muted ml-1">mmHg</span>
            </p>
          </div>
        </div>
        <StatusDot status={data.status} pulse={data.status === 'critical'} />
      </div>
      
      <div className="flex items-center justify-between">
        <VitalStatusBadge status={data.status} size="sm" language={language} />
        <span className="text-xs text-muted">
          {formatRelativeTime(data.recordedAt, language)}
        </span>
      </div>
      
      {data.pulse && (
        <p className="text-xs text-foreground-muted mt-2">
          {language === 'ms' ? 'Denyutan' : 'Pulse'}: {data.pulse} bpm
        </p>
      )}
    </div>
  );
}

// ============================================
// WEIGHT ITEM
// ============================================

function WeightSummaryItem({ data, language, compact, onLog, onView }: SummaryItemProps<WeightReading>) {
  const Icon = VITAL_ICONS.weight;
  const typeInfo = VITAL_TYPES.weight;
  
  return (
    <div className="bg-background p-4 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeInfo.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">
              {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
            </p>
            <p className="text-lg font-bold text-foreground">
              {data.weightKg}
              <span className="text-sm font-normal text-muted ml-1">kg</span>
            </p>
          </div>
        </div>
        {data.bmi && (
          <span className="text-xs px-2 py-1 bg-muted/20 rounded-full text-foreground-muted">
            BMI {data.bmi}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <VitalStatusBadge status={data.status} size="sm" language={language} />
        <span className="text-xs text-muted">
          {formatRelativeTime(data.recordedAt, language)}
        </span>
      </div>
      
      {data.change && (
        <p className="text-xs mt-2">
          <span className={data.change.direction === 'down' ? 'text-green-600' : data.change.direction === 'up' ? 'text-red-500' : 'text-muted'}>
            {data.change.direction === 'up' ? '↑' : data.change.direction === 'down' ? '↓' : '→'}
            {' '}{Math.abs(data.change.value)} kg
          </span>
          <span className="text-muted"> {language === 'ms' ? 'minggu lepas' : 'past week'}</span>
        </p>
      )}
    </div>
  );
}

// ============================================
// GLUCOSE ITEM
// ============================================

function GlucoseSummaryItem({ data, language, compact, onLog, onView }: SummaryItemProps<GlucoseReading>) {
  const Icon = VITAL_ICONS.glucose;
  const typeInfo = VITAL_TYPES.glucose;
  
  const timingLabels: Record<string, { en: string; ms: string }> = {
    fasting: { en: 'Fasting', ms: 'Puasa' },
    before_meal: { en: 'Before meal', ms: 'Sebelum makan' },
    after_meal: { en: 'After meal', ms: 'Selepas makan' },
    bedtime: { en: 'Bedtime', ms: 'Waktu tidur' },
    random: { en: 'Random', ms: 'Rawak' },
  };
  
  return (
    <div className="bg-background p-4 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeInfo.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">
              {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
            </p>
            <p className="text-lg font-bold text-foreground">
              {data.glucoseMmol}
              <span className="text-sm font-normal text-muted ml-1">mmol/L</span>
            </p>
          </div>
        </div>
        <StatusDot status={data.status} pulse={data.status === 'critical' || data.status === 'low'} />
      </div>
      
      <div className="flex items-center justify-between">
        <VitalStatusBadge status={data.status} size="sm" language={language} />
        <span className="text-xs text-muted">
          {formatRelativeTime(data.recordedAt, language)}
        </span>
      </div>
      
      <p className="text-xs text-foreground-muted mt-2">
        {timingLabels[data.timing]?.[language] || data.timing}
      </p>
    </div>
  );
}

// ============================================
// LABS ITEM
// ============================================

function LabsSummaryItem({ data, language, compact, onLog, onView }: SummaryItemProps<LabsReading>) {
  const Icon = VITAL_ICONS.labs;
  const typeInfo = VITAL_TYPES.labs;
  
  // Show most important lab value
  const primaryValue = data.hba1cPercent 
    ? { value: data.hba1cPercent, unit: '%', label: 'HbA1c', status: data.hba1cStatus }
    : data.ldlMmol
    ? { value: data.ldlMmol, unit: 'mmol/L', label: 'LDL', status: data.ldlStatus }
    : data.egfr
    ? { value: data.egfr, unit: '', label: 'eGFR', status: data.egfrStatus }
    : null;
  
  return (
    <div className="bg-background p-4 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeInfo.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">
              {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
            </p>
            {primaryValue ? (
              <p className="text-lg font-bold text-foreground">
                {primaryValue.label}: {primaryValue.value}
                <span className="text-sm font-normal text-muted ml-1">{primaryValue.unit}</span>
              </p>
            ) : (
              <p className="text-sm text-foreground-muted">
                {language === 'ms' ? 'Tiada data' : 'No data'}
              </p>
            )}
          </div>
        </div>
        {primaryValue?.status && (
          <StatusDot status={primaryValue.status} />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        {primaryValue?.status ? (
          <VitalStatusBadge status={primaryValue.status} size="sm" language={language} />
        ) : (
          <span />
        )}
        <span className="text-xs text-muted">
          {formatRelativeTime(data.recordedAt, language)}
        </span>
      </div>
      
      {data.labProvider && (
        <p className="text-xs text-foreground-muted mt-2">
          {data.labProvider}
        </p>
      )}
    </div>
  );
}

// ============================================
// COMPACT VITAL CARD (for dashboard)
// ============================================

interface CompactVitalCardProps {
  type: VitalType;
  value: string;
  unit: string;
  status: import('@/lib/vitals/types').VitalStatus;
  subtext?: string;
  onClick?: () => void;
  className?: string;
}

export function CompactVitalCard({
  type,
  value,
  unit,
  status,
  subtext,
  onClick,
  className = '',
}: CompactVitalCardProps) {
  const Icon = VITAL_ICONS[type];
  const typeInfo = VITAL_TYPES[type];
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-xl bg-background border border-border
        hover:border-primary/30 hover:shadow-sm transition-all
        text-left group ${className}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${typeInfo.color}15` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: typeInfo.color }} />
        </div>
        <StatusDot status={status} size="sm" />
      </div>
      
      <p className="text-lg font-bold text-foreground">
        {value}
        <span className="text-xs font-normal text-muted ml-1">{unit}</span>
      </p>
      
      {subtext && (
        <p className="text-xs text-muted truncate">{subtext}</p>
      )}
    </button>
  );
}


