// lib/vitals/calculations.ts
// 💓 Vital Calculations - BMI, trends, averages

import { VitalsLogEntry, VitalTrendPoint, VitalsTrend, VitalType } from './types';
import { classifyBP, classifyGlucose, classifyHbA1c, classifyBMI, classifyEGFR } from './status';

// ============================================
// BMI CALCULATION
// ============================================

/**
 * Calculate BMI from weight and height
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Calculate ideal weight range for a given height (Asian BMI 18.5-23)
 */
export function calculateIdealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(23 * heightM * heightM * 10) / 10,
  };
}

// ============================================
// WEIGHT CHANGE CALCULATION
// ============================================

export interface WeightChange {
  value: number;
  direction: 'up' | 'down' | 'same';
  percent: number;
  period: string;
  periodMs: string;
}

/**
 * Calculate weight change from history
 */
export function calculateWeightChange(
  currentWeight: number,
  history: VitalsLogEntry[],
  days: number = 7
): WeightChange | null {
  const weightEntries = history
    .filter(e => e.weightKg !== undefined)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  if (weightEntries.length < 2) return null;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Find entry closest to cutoff date
  const previousEntry = weightEntries.find(e => new Date(e.recordedAt) <= cutoffDate);
  if (!previousEntry || !previousEntry.weightKg) return null;
  
  const change = currentWeight - previousEntry.weightKg;
  const percent = (change / previousEntry.weightKg) * 100;
  
  const periodLabel = days === 7 ? 'week' : days === 30 ? 'month' : `${days} days`;
  const periodLabelMs = days === 7 ? 'minggu' : days === 30 ? 'bulan' : `${days} hari`;
  
  return {
    value: Math.round(change * 10) / 10,
    direction: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'same',
    percent: Math.round(percent * 10) / 10,
    period: periodLabel,
    periodMs: periodLabelMs,
  };
}

// ============================================
// AVERAGE CALCULATIONS
// ============================================

/**
 * Calculate average BP over a period
 */
export function calculateAverageBP(entries: VitalsLogEntry[]): {
  avgSystolic: number;
  avgDiastolic: number;
  count: number;
} | null {
  const bpEntries = entries.filter(e => e.systolicBp && e.diastolicBp);
  if (bpEntries.length === 0) return null;
  
  const totalSystolic = bpEntries.reduce((sum, e) => sum + (e.systolicBp || 0), 0);
  const totalDiastolic = bpEntries.reduce((sum, e) => sum + (e.diastolicBp || 0), 0);
  
  return {
    avgSystolic: Math.round(totalSystolic / bpEntries.length),
    avgDiastolic: Math.round(totalDiastolic / bpEntries.length),
    count: bpEntries.length,
  };
}

/**
 * Calculate average glucose over a period
 */
export function calculateAverageGlucose(entries: VitalsLogEntry[]): {
  avgGlucose: number;
  count: number;
} | null {
  const glucoseEntries = entries.filter(e => e.glucoseMmol);
  if (glucoseEntries.length === 0) return null;
  
  const total = glucoseEntries.reduce((sum, e) => sum + (e.glucoseMmol || 0), 0);
  
  return {
    avgGlucose: Math.round((total / glucoseEntries.length) * 10) / 10,
    count: glucoseEntries.length,
  };
}

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Generate trend data for a vital type
 */
export function generateTrendData(
  entries: VitalsLogEntry[],
  vitalType: VitalType,
  days: number = 30
): VitalsTrend | null {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  let filteredEntries: VitalsLogEntry[];
  let getValue: (e: VitalsLogEntry) => number | undefined;
  let label: string;
  let unit: string;
  
  switch (vitalType) {
    case 'bp':
      filteredEntries = entries.filter(e => e.systolicBp && new Date(e.recordedAt) >= cutoffDate);
      getValue = (e) => e.systolicBp;
      label = 'Systolic BP';
      unit = 'mmHg';
      break;
    case 'weight':
      filteredEntries = entries.filter(e => e.weightKg && new Date(e.recordedAt) >= cutoffDate);
      getValue = (e) => e.weightKg;
      label = 'Weight';
      unit = 'kg';
      break;
    case 'glucose':
      filteredEntries = entries.filter(e => e.glucoseMmol && new Date(e.recordedAt) >= cutoffDate);
      getValue = (e) => e.glucoseMmol;
      label = 'Blood Glucose';
      unit = 'mmol/L';
      break;
    case 'labs':
      filteredEntries = entries.filter(e => e.hba1cPercent && new Date(e.recordedAt) >= cutoffDate);
      getValue = (e) => e.hba1cPercent;
      label = 'HbA1c';
      unit = '%';
      break;
    default:
      return null;
  }
  
  if (filteredEntries.length === 0) return null;
  
  // Sort by date ascending for trend
  filteredEntries.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  
  const data: VitalTrendPoint[] = filteredEntries.map(e => ({
    date: e.recordedAt.split('T')[0],
    value: getValue(e) || 0,
    status: getStatusForEntry(e, vitalType),
  }));
  
  const current = data[data.length - 1]?.value;
  const previous = data.length > 1 ? data[0]?.value : undefined;
  const change = current && previous ? current - previous : undefined;
  const changePercent = change && previous ? (change / previous) * 100 : undefined;
  
  // Determine trend direction
  let trend: VitalsTrend['trend'] = 'insufficient_data';
  if (data.length >= 3 && change !== undefined) {
    // For BP, glucose, HbA1c - going down is improving
    // For weight - depends on context, but generally down is improving for diabetics
    const improving = change < 0;
    const worsening = change > 0;
    const stable = Math.abs(change) < (current * 0.02); // Within 2%
    
    if (stable) trend = 'stable';
    else if (improving) trend = 'improving';
    else if (worsening) trend = 'worsening';
  }
  
  return {
    vitalType,
    label,
    unit,
    data,
    current,
    previous,
    change: change ? Math.round(change * 10) / 10 : undefined,
    changePercent: changePercent ? Math.round(changePercent * 10) / 10 : undefined,
    trend,
  };
}

function getStatusForEntry(entry: VitalsLogEntry, vitalType: VitalType): string | undefined {
  switch (vitalType) {
    case 'bp':
      if (entry.systolicBp && entry.diastolicBp) {
        return classifyBP(entry.systolicBp, entry.diastolicBp).status;
      }
      break;
    case 'glucose':
      if (entry.glucoseMmol && entry.glucoseTiming) {
        return classifyGlucose(entry.glucoseMmol, entry.glucoseTiming).status;
      }
      break;
    case 'labs':
      if (entry.hba1cPercent) {
        return classifyHbA1c(entry.hba1cPercent).status;
      }
      break;
  }
  return undefined;
}

// ============================================
// TIME CALCULATIONS
// ============================================

/**
 * Calculate days since a date
 */
export function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string, language: 'en' | 'ms' = 'en'): string {
  const days = daysSince(dateString);
  
  if (days === 0) {
    return language === 'ms' ? 'Hari ini' : 'Today';
  }
  if (days === 1) {
    return language === 'ms' ? 'Semalam' : 'Yesterday';
  }
  if (days < 7) {
    return language === 'ms' ? `${days} hari lepas` : `${days} days ago`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return language === 'ms' ? `${weeks} minggu lepas` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return language === 'ms' ? `${months} bulan lepas` : `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  const years = Math.floor(days / 365);
  return language === 'ms' ? `${years} tahun lepas` : `${years} year${years > 1 ? 's' : ''} ago`;
}

// ============================================
// ESTIMATED A1C FROM AVERAGE GLUCOSE
// ============================================

/**
 * Estimate HbA1c from average glucose (Nathan formula)
 * This is an approximation, not a replacement for lab test
 */
export function estimateHbA1cFromGlucose(avgGlucoseMmol: number): number {
  // Formula: HbA1c = (avgGlucose + 2.59) / 1.59
  // This is the ADAG formula converted for mmol/L
  const avgMgdl = avgGlucoseMmol * 18.02;
  const hba1c = (avgMgdl + 46.7) / 28.7;
  return Math.round(hba1c * 10) / 10;
}


