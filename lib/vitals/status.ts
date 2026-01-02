// lib/vitals/status.ts
// 💓 Vital Status Classification - Determine normal/borderline/high

import { VitalStatus, VitalTargets, GlucoseTiming } from './types';
import {
  BP_CLASSIFICATIONS,
  BMI_CLASSIFICATIONS,
  HBA1C_CLASSIFICATIONS,
  LIPID_RANGES,
  EGFR_CLASSIFICATIONS,
  URIC_ACID_RANGES,
  DEFAULT_VITAL_TARGETS,
} from './constants';

// ============================================
// STATUS LABELS
// ============================================

export const STATUS_LABELS: Record<VitalStatus, { en: string; ms: string }> = {
  normal: { en: 'Normal', ms: 'Normal' },
  elevated: { en: 'Elevated', ms: 'Meningkat' },
  borderline: { en: 'Borderline', ms: 'Sempadan' },
  high: { en: 'High', ms: 'Tinggi' },
  low: { en: 'Low', ms: 'Rendah' },
  critical: { en: 'Critical', ms: 'Kritikal' },
};

export const STATUS_COLORS: Record<VitalStatus, string> = {
  normal: '#22C55E',    // green
  elevated: '#84CC16',  // lime
  borderline: '#F59E0B', // amber
  high: '#EF4444',      // red
  low: '#3B82F6',       // blue
  critical: '#DC2626',  // dark red
};

export function getStatusLabel(status: VitalStatus, language: 'en' | 'ms' = 'en'): string {
  return STATUS_LABELS[status][language];
}

export function getStatusColor(status: VitalStatus): string {
  return STATUS_COLORS[status];
}

// ============================================
// BLOOD PRESSURE CLASSIFICATION
// ============================================

export function classifyBP(systolic: number, diastolic: number): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  // Hypertensive Crisis
  if (systolic >= 180 || diastolic >= 120) {
    return {
      status: 'critical',
      label: BP_CLASSIFICATIONS.crisis.label,
      labelMs: BP_CLASSIFICATIONS.crisis.labelMs,
    };
  }
  
  // Stage 2 Hypertension
  if (systolic >= 140 || diastolic >= 90) {
    return {
      status: 'high',
      label: BP_CLASSIFICATIONS.stage2.label,
      labelMs: BP_CLASSIFICATIONS.stage2.labelMs,
    };
  }
  
  // Stage 1 Hypertension
  if (systolic >= 130 || diastolic >= 80) {
    return {
      status: 'borderline',
      label: BP_CLASSIFICATIONS.stage1.label,
      labelMs: BP_CLASSIFICATIONS.stage1.labelMs,
    };
  }
  
  // Elevated
  if (systolic >= 120 && diastolic < 80) {
    return {
      status: 'elevated',
      label: BP_CLASSIFICATIONS.elevated.label,
      labelMs: BP_CLASSIFICATIONS.elevated.labelMs,
    };
  }
  
  // Normal
  return {
    status: 'normal',
    label: BP_CLASSIFICATIONS.normal.label,
    labelMs: BP_CLASSIFICATIONS.normal.labelMs,
  };
}

// ============================================
// GLUCOSE CLASSIFICATION
// ============================================

export function classifyGlucose(
  value: number,
  timing: GlucoseTiming,
  targets: Partial<VitalTargets> = {}
): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  const t = { ...DEFAULT_VITAL_TARGETS, ...targets };
  
  // Hypoglycemia (low)
  if (value < t.targetFastingGlucoseMin) {
    return {
      status: 'low',
      label: 'Low (Hypoglycemia)',
      labelMs: 'Rendah (Hipoglisemia)',
    };
  }
  
  // Fasting or before meal
  if (timing === 'fasting' || timing === 'before_meal') {
    if (value <= t.targetFastingGlucoseMax) {
      return { status: 'normal', label: 'Normal', labelMs: 'Normal' };
    }
    if (value <= 10) {
      return { status: 'borderline', label: 'Above Target', labelMs: 'Melebihi Sasaran' };
    }
    if (value <= 14) {
      return { status: 'high', label: 'High', labelMs: 'Tinggi' };
    }
    return { status: 'critical', label: 'Very High', labelMs: 'Sangat Tinggi' };
  }
  
  // Post-meal or random
  if (value <= t.targetPostmealGlucoseMax) {
    return { status: 'normal', label: 'Normal', labelMs: 'Normal' };
  }
  if (value <= 14) {
    return { status: 'borderline', label: 'Above Target', labelMs: 'Melebihi Sasaran' };
  }
  if (value <= 20) {
    return { status: 'high', label: 'High', labelMs: 'Tinggi' };
  }
  return { status: 'critical', label: 'Very High', labelMs: 'Sangat Tinggi' };
}

// ============================================
// HBA1C CLASSIFICATION
// ============================================

export function classifyHbA1c(value: number): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  if (value < 5.7) {
    return {
      status: 'normal',
      label: HBA1C_CLASSIFICATIONS.normal.label,
      labelMs: HBA1C_CLASSIFICATIONS.normal.labelMs,
    };
  }
  if (value < 6.5) {
    return {
      status: 'borderline',
      label: HBA1C_CLASSIFICATIONS.prediabetes.label,
      labelMs: HBA1C_CLASSIFICATIONS.prediabetes.labelMs,
    };
  }
  if (value < 8.0) {
    return {
      status: 'high',
      label: HBA1C_CLASSIFICATIONS.diabetes.label,
      labelMs: HBA1C_CLASSIFICATIONS.diabetes.labelMs,
    };
  }
  return {
    status: 'critical',
    label: HBA1C_CLASSIFICATIONS.poorControl.label,
    labelMs: HBA1C_CLASSIFICATIONS.poorControl.labelMs,
  };
}

// ============================================
// LDL CLASSIFICATION
// ============================================

export function classifyLDL(
  value: number,
  hasHeartDisease: boolean = false
): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  const target = hasHeartDisease ? 1.8 : 2.6;
  
  if (value <= target) {
    return { status: 'normal', label: 'Optimal', labelMs: 'Optimum' };
  }
  if (value <= 3.4) {
    return { status: 'borderline', label: 'Near Optimal', labelMs: 'Hampir Optimum' };
  }
  if (value <= 4.1) {
    return { status: 'high', label: 'Borderline High', labelMs: 'Sempadan Tinggi' };
  }
  if (value <= 4.9) {
    return { status: 'high', label: 'High', labelMs: 'Tinggi' };
  }
  return { status: 'critical', label: 'Very High', labelMs: 'Sangat Tinggi' };
}

// ============================================
// HDL CLASSIFICATION
// ============================================

export function classifyHDL(
  value: number,
  gender: 'male' | 'female' = 'male'
): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  const lowThreshold = gender === 'male' ? 1.0 : 1.2;
  
  if (value < lowThreshold) {
    return { status: 'low', label: 'Low (Risk Factor)', labelMs: 'Rendah (Faktor Risiko)' };
  }
  if (value < 1.5) {
    return { status: 'normal', label: 'Normal', labelMs: 'Normal' };
  }
  return { status: 'normal', label: 'Optimal', labelMs: 'Optimum' };
}

// ============================================
// TRIGLYCERIDES CLASSIFICATION
// ============================================

export function classifyTriglycerides(value: number): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  if (value < 1.7) {
    return { status: 'normal', label: 'Normal', labelMs: 'Normal' };
  }
  if (value < 2.3) {
    return { status: 'borderline', label: 'Borderline', labelMs: 'Sempadan' };
  }
  if (value < 5.6) {
    return { status: 'high', label: 'High', labelMs: 'Tinggi' };
  }
  return { status: 'critical', label: 'Very High', labelMs: 'Sangat Tinggi' };
}

// ============================================
// EGFR CLASSIFICATION (Kidney Function)
// ============================================

export function classifyEGFR(value: number): {
  status: VitalStatus;
  label: string;
  labelMs: string;
  stage: string;
} {
  if (value >= 90) {
    return { ...EGFR_CLASSIFICATIONS.normal, status: 'normal' };
  }
  if (value >= 60) {
    return { ...EGFR_CLASSIFICATIONS.mildDecrease, status: 'borderline' };
  }
  if (value >= 45) {
    return { ...EGFR_CLASSIFICATIONS.moderateDecrease, status: 'high' };
  }
  if (value >= 30) {
    return { ...EGFR_CLASSIFICATIONS.severeDecrease, status: 'high' };
  }
  if (value >= 15) {
    return { ...EGFR_CLASSIFICATIONS.kidneyFailure, status: 'critical' };
  }
  return { ...EGFR_CLASSIFICATIONS.endStage, status: 'critical' };
}

// ============================================
// URIC ACID CLASSIFICATION
// ============================================

export function classifyUricAcid(
  value: number,
  gender: 'male' | 'female' = 'male'
): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  const threshold = gender === 'male' ? 420 : 360;
  
  if (value <= threshold) {
    return { status: 'normal', label: 'Normal', labelMs: 'Normal' };
  }
  if (value <= threshold * 1.2) {
    return { status: 'borderline', label: 'Borderline', labelMs: 'Sempadan' };
  }
  return { status: 'high', label: 'High', labelMs: 'Tinggi' };
}

// ============================================
// BMI CLASSIFICATION (Asian WHO)
// ============================================

export function classifyBMI(bmi: number): {
  status: VitalStatus;
  label: string;
  labelMs: string;
} {
  if (bmi < 18.5) {
    return {
      status: 'low',
      label: BMI_CLASSIFICATIONS.underweight.label,
      labelMs: BMI_CLASSIFICATIONS.underweight.labelMs,
    };
  }
  if (bmi < 23) {
    return {
      status: 'normal',
      label: BMI_CLASSIFICATIONS.normal.label,
      labelMs: BMI_CLASSIFICATIONS.normal.labelMs,
    };
  }
  if (bmi < 25) {
    return {
      status: 'borderline',
      label: BMI_CLASSIFICATIONS.overweight.label,
      labelMs: BMI_CLASSIFICATIONS.overweight.labelMs,
    };
  }
  if (bmi < 30) {
    return {
      status: 'high',
      label: BMI_CLASSIFICATIONS.obese1.label,
      labelMs: BMI_CLASSIFICATIONS.obese1.labelMs,
    };
  }
  return {
    status: 'critical',
    label: BMI_CLASSIFICATIONS.obese2.label,
    labelMs: BMI_CLASSIFICATIONS.obese2.labelMs,
  };
}

// ============================================
// WEIGHT STATUS (vs target)
// ============================================

export function classifyWeight(
  weightKg: number,
  targetWeightKg?: number,
  heightCm?: number
): {
  status: VitalStatus;
  label: string;
  labelMs: string;
  bmi?: number;
} {
  // If we have height, calculate BMI
  if (heightCm && heightCm > 0) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiResult = classifyBMI(bmi);
    return { ...bmiResult, bmi: Math.round(bmi * 10) / 10 };
  }
  
  // If we have a target, compare to target
  if (targetWeightKg) {
    const diff = weightKg - targetWeightKg;
    const percentDiff = (diff / targetWeightKg) * 100;
    
    if (Math.abs(percentDiff) <= 2) {
      return { status: 'normal', label: 'At Target', labelMs: 'Mencapai Sasaran' };
    }
    if (percentDiff > 0) {
      if (percentDiff <= 5) {
        return { status: 'borderline', label: 'Slightly Above', labelMs: 'Sedikit Melebihi' };
      }
      return { status: 'high', label: 'Above Target', labelMs: 'Melebihi Sasaran' };
    }
    return { status: 'normal', label: 'Below Target', labelMs: 'Bawah Sasaran' };
  }
  
  // No comparison available
  return { status: 'normal', label: 'Recorded', labelMs: 'Direkod' };
}


