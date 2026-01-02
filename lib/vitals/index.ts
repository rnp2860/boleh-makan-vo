// lib/vitals/index.ts
// 💓 Health Vitals Module - Barrel Export

// Types
export type {
  VitalType,
  GlucoseTiming,
  BPArm,
  BPPosition,
  VitalSource,
  VitalStatus,
  TargetSetBy,
  VitalsLogEntry,
  VitalTargets,
  VitalReading,
  BPReading,
  WeightReading,
  GlucoseReading,
  LabsReading,
  VitalsSummary,
  LogBPInput,
  LogWeightInput,
  LogGlucoseInput,
  LogLabsInput,
  UpdateTargetsInput,
  VitalsHistoryFilter,
  VitalsHistoryItem,
  VitalTrendPoint,
  VitalsTrend,
  VitalsReminder,
} from './types';

// Constants
export {
  DEFAULT_VITAL_TARGETS,
  VITAL_TYPES,
  GLUCOSE_TIMING_OPTIONS,
  BP_CLASSIFICATIONS,
  BMI_CLASSIFICATIONS,
  GLUCOSE_RANGES,
  HBA1C_CLASSIFICATIONS,
  LIPID_RANGES,
  EGFR_CLASSIFICATIONS,
  URIC_ACID_RANGES,
  REMINDER_THRESHOLDS,
  GLUCOSE_MGDL_TO_MMOL,
  GLUCOSE_MMOL_TO_MGDL,
  convertGlucoseToMmol,
  convertGlucoseToMgdl,
  LBS_TO_KG,
  KG_TO_LBS,
  convertWeightToKg,
  convertWeightToLbs,
} from './constants';

// Status classification
export {
  STATUS_LABELS,
  STATUS_COLORS,
  getStatusLabel,
  getStatusColor,
  classifyBP,
  classifyGlucose,
  classifyHbA1c,
  classifyLDL,
  classifyHDL,
  classifyTriglycerides,
  classifyEGFR,
  classifyUricAcid,
  classifyBMI,
  classifyWeight,
} from './status';

// Calculations
export {
  calculateBMI,
  calculateIdealWeightRange,
  calculateWeightChange,
  calculateAverageBP,
  calculateAverageGlucose,
  generateTrendData,
  daysSince,
  formatRelativeTime,
  estimateHbA1cFromGlucose,
} from './calculations';

// Queries
export {
  logBP,
  logWeight,
  logGlucose,
  logLabs,
  deleteVitalsEntry,
  updateVitalsEntry,
  getVitalsSummary,
  getVitalsHistory,
  getLatestVitals,
  getVitalTargets,
  updateVitalTargets,
} from './queries';

// AI Context
export {
  buildVitalsAIContext,
  generateVitalsReminders,
} from './ai-context';


