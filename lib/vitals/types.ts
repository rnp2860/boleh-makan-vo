// lib/vitals/types.ts
// 💓 Health Vitals Types - TypeScript definitions

// ============================================
// ENUMS & LITERAL TYPES
// ============================================

export type VitalType = 'bp' | 'weight' | 'glucose' | 'labs';

export type GlucoseTiming = 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';

export type BPArm = 'left' | 'right';

export type BPPosition = 'sitting' | 'standing' | 'lying';

export type VitalSource = 'manual' | 'device_sync' | 'lab_import' | 'cgm';

export type VitalStatus = 'normal' | 'elevated' | 'borderline' | 'high' | 'low' | 'critical';

export type TargetSetBy = 'self' | 'doctor' | 'system';

// ============================================
// VITALS LOG ENTRY
// ============================================

export interface VitalsLogEntry {
  id: string;
  userId: string;
  tenantId?: string;
  recordedAt: string;
  
  // Blood Pressure
  systolicBp?: number;
  diastolicBp?: number;
  pulse?: number;
  bpArm?: BPArm;
  bpPosition?: BPPosition;
  
  // Weight & Body
  weightKg?: number;
  bodyFatPercent?: number;
  waistCm?: number;
  
  // Glucose
  glucoseMmol?: number;
  glucoseTiming?: GlucoseTiming;
  
  // Labs
  hba1cPercent?: number;
  totalCholesterolMmol?: number;
  ldlMmol?: number;
  hdlMmol?: number;
  triglyceridesMmol?: number;
  egfr?: number;
  uricAcidUmol?: number;
  creatinineUmol?: number;
  
  // Metadata
  source: VitalSource;
  notes?: string;
  labDate?: string;
  labProvider?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// VITAL TARGETS
// ============================================

export interface VitalTargets {
  id?: string;
  userId: string;
  tenantId?: string;
  
  // BP targets
  targetSystolicMax: number;
  targetDiastolicMax: number;
  
  // Glucose targets (mmol/L)
  targetFastingGlucoseMin: number;
  targetFastingGlucoseMax: number;
  targetPostmealGlucoseMax: number;
  targetHba1cMax: number;
  
  // Lipid targets (mmol/L)
  targetTotalCholesterolMax: number;
  targetLdlMax: number;
  targetHdlMin: number;
  targetTriglyceridesMax: number;
  
  // Weight targets
  targetWeightKg?: number;
  targetBmiMax: number;
  
  // Kidney targets
  targetEgfrMin: number;
  targetUricAcidMax: number;
  
  // Metadata
  setBy: TargetSetBy;
  doctorName?: string;
  notes?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// VITAL READINGS (for display)
// ============================================

export interface VitalReading<T = number> {
  value: T;
  unit: string;
  status: VitalStatus;
  statusLabel: string;
  recordedAt: string;
  daysAgo: number;
  target?: {
    min?: number;
    max?: number;
  };
}

export interface BPReading {
  systolic: number;
  diastolic: number;
  pulse?: number;
  status: VitalStatus;
  statusLabel: string;
  recordedAt: string;
  daysAgo: number;
  arm?: BPArm;
  position?: BPPosition;
}

export interface WeightReading {
  weightKg: number;
  bmi?: number;
  bodyFatPercent?: number;
  waistCm?: number;
  status: VitalStatus;
  statusLabel: string;
  recordedAt: string;
  daysAgo: number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'same';
    period: string;
  };
}

export interface GlucoseReading {
  glucoseMmol: number;
  timing: GlucoseTiming;
  status: VitalStatus;
  statusLabel: string;
  recordedAt: string;
  daysAgo: number;
}

export interface LabsReading {
  hba1cPercent?: number;
  hba1cStatus?: VitalStatus;
  ldlMmol?: number;
  ldlStatus?: VitalStatus;
  hdlMmol?: number;
  hdlStatus?: VitalStatus;
  triglyceridesMmol?: number;
  egfr?: number;
  egfrStatus?: VitalStatus;
  uricAcidUmol?: number;
  labDate?: string;
  labProvider?: string;
  recordedAt: string;
  daysAgo: number;
}

// ============================================
// VITALS SUMMARY (latest of each type)
// ============================================

export interface VitalsSummary {
  bp?: BPReading;
  weight?: WeightReading;
  glucose?: GlucoseReading;
  labs?: LabsReading;
}

// ============================================
// INPUT TYPES
// ============================================

export interface LogBPInput {
  systolicBp: number;
  diastolicBp: number;
  pulse?: number;
  bpArm?: BPArm;
  bpPosition?: BPPosition;
  recordedAt?: string;
  notes?: string;
}

export interface LogWeightInput {
  weightKg: number;
  bodyFatPercent?: number;
  waistCm?: number;
  recordedAt?: string;
  notes?: string;
}

export interface LogGlucoseInput {
  glucoseMmol: number;
  glucoseTiming: GlucoseTiming;
  recordedAt?: string;
  notes?: string;
}

export interface LogLabsInput {
  hba1cPercent?: number;
  totalCholesterolMmol?: number;
  ldlMmol?: number;
  hdlMmol?: number;
  triglyceridesMmol?: number;
  egfr?: number;
  uricAcidUmol?: number;
  creatinineUmol?: number;
  labDate: string;
  labProvider?: string;
  notes?: string;
}

export interface UpdateTargetsInput {
  targetSystolicMax?: number;
  targetDiastolicMax?: number;
  targetFastingGlucoseMin?: number;
  targetFastingGlucoseMax?: number;
  targetPostmealGlucoseMax?: number;
  targetHba1cMax?: number;
  targetLdlMax?: number;
  targetHdlMin?: number;
  targetTriglyceridesMax?: number;
  targetWeightKg?: number;
  targetBmiMax?: number;
  targetEgfrMin?: number;
  setBy?: TargetSetBy;
  doctorName?: string;
  notes?: string;
}

// ============================================
// HISTORY TYPES
// ============================================

export interface VitalsHistoryFilter {
  vitalType?: VitalType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface VitalsHistoryItem {
  id: string;
  recordedAt: string;
  vitalType: VitalType;
  values: Record<string, number | string | undefined>;
  status: VitalStatus;
  statusLabel: string;
  notes?: string;
}

// ============================================
// TREND DATA
// ============================================

export interface VitalTrendPoint {
  date: string;
  value: number;
  status?: VitalStatus;
}

export interface VitalsTrend {
  vitalType: VitalType;
  label: string;
  unit: string;
  data: VitalTrendPoint[];
  current?: number;
  previous?: number;
  change?: number;
  changePercent?: number;
  trend: 'improving' | 'worsening' | 'stable' | 'insufficient_data';
}

// ============================================
// REMINDER TYPES
// ============================================

export interface VitalsReminder {
  type: 'bp' | 'weight' | 'glucose' | 'labs';
  message: string;
  messageMs: string;
  priority: 'low' | 'medium' | 'high';
  daysSinceLastLog: number;
}


