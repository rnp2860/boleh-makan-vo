// lib/vitals/queries.ts
// 💓 Vitals Queries - Database operations for vitals logging

import { getSupabaseServiceClient } from '@/lib/supabase';
import {
  VitalsLogEntry,
  VitalTargets,
  VitalsSummary,
  LogBPInput,
  LogWeightInput,
  LogGlucoseInput,
  LogLabsInput,
  UpdateTargetsInput,
  VitalsHistoryFilter,
  BPReading,
  WeightReading,
  GlucoseReading,
  LabsReading,
} from './types';
import { DEFAULT_VITAL_TARGETS } from './constants';
import { classifyBP, classifyGlucose, classifyHbA1c, classifyLDL, classifyEGFR, classifyWeight } from './status';
import { daysSince, calculateBMI } from './calculations';

// ============================================
// VITALS LOG OPERATIONS
// ============================================

/**
 * Log blood pressure reading
 */
export async function logBP(
  userId: string,
  input: LogBPInput,
  tenantId?: string
): Promise<VitalsLogEntry> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('vitals_log')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      recorded_at: input.recordedAt || new Date().toISOString(),
      systolic_bp: input.systolicBp,
      diastolic_bp: input.diastolicBp,
      pulse: input.pulse,
      bp_arm: input.bpArm,
      bp_position: input.bpPosition,
      notes: input.notes,
      source: 'manual',
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalsLogEntry(data);
}

/**
 * Log weight measurement
 */
export async function logWeight(
  userId: string,
  input: LogWeightInput,
  tenantId?: string
): Promise<VitalsLogEntry> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('vitals_log')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      recorded_at: input.recordedAt || new Date().toISOString(),
      weight_kg: input.weightKg,
      body_fat_percent: input.bodyFatPercent,
      waist_cm: input.waistCm,
      notes: input.notes,
      source: 'manual',
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalsLogEntry(data);
}

/**
 * Log glucose reading
 */
export async function logGlucose(
  userId: string,
  input: LogGlucoseInput,
  tenantId?: string
): Promise<VitalsLogEntry> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('vitals_log')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      recorded_at: input.recordedAt || new Date().toISOString(),
      glucose_mmol: input.glucoseMmol,
      glucose_timing: input.glucoseTiming,
      notes: input.notes,
      source: 'manual',
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalsLogEntry(data);
}

/**
 * Log lab results
 */
export async function logLabs(
  userId: string,
  input: LogLabsInput,
  tenantId?: string
): Promise<VitalsLogEntry> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('vitals_log')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      recorded_at: new Date().toISOString(),
      hba1c_percent: input.hba1cPercent,
      total_cholesterol_mmol: input.totalCholesterolMmol,
      ldl_mmol: input.ldlMmol,
      hdl_mmol: input.hdlMmol,
      triglycerides_mmol: input.triglyceridesMmol,
      egfr: input.egfr,
      uric_acid_umol: input.uricAcidUmol,
      creatinine_umol: input.creatinineUmol,
      lab_date: input.labDate,
      lab_provider: input.labProvider,
      notes: input.notes,
      source: 'manual',
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalsLogEntry(data);
}

/**
 * Delete vitals entry
 */
export async function deleteVitalsEntry(
  userId: string,
  entryId: string
): Promise<void> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('vitals_log')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);
  
  if (error) throw new Error(error.message);
}

/**
 * Update vitals entry
 */
export async function updateVitalsEntry(
  userId: string,
  entryId: string,
  updates: Partial<VitalsLogEntry>
): Promise<VitalsLogEntry> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('vitals_log')
    .update({
      notes: updates.notes,
      recorded_at: updates.recordedAt,
    })
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalsLogEntry(data);
}

// ============================================
// VITALS RETRIEVAL
// ============================================

/**
 * Get vitals summary (latest of each type)
 */
export async function getVitalsSummary(
  userId: string,
  userHeightCm?: number
): Promise<VitalsSummary> {
  const supabase = getSupabaseServiceClient();
  
  // Use RPC function for optimized query
  const { data, error } = await supabase
    .rpc('get_user_vitals_summary', { p_user_id: userId });
  
  if (error) {
    console.error('Error fetching vitals summary:', error);
    return {};
  }
  
  const summary: VitalsSummary = {};
  
  // Process BP
  if (data?.bp) {
    const bpClassification = classifyBP(data.bp.systolic, data.bp.diastolic);
    summary.bp = {
      systolic: data.bp.systolic,
      diastolic: data.bp.diastolic,
      pulse: data.bp.pulse,
      status: bpClassification.status,
      statusLabel: bpClassification.label,
      recordedAt: data.bp.recordedAt,
      daysAgo: daysSince(data.bp.recordedAt),
    };
  }
  
  // Process Weight
  if (data?.weight) {
    const bmi = userHeightCm ? calculateBMI(data.weight.weightKg, userHeightCm) : undefined;
    const weightClassification = classifyWeight(data.weight.weightKg, undefined, userHeightCm);
    summary.weight = {
      weightKg: data.weight.weightKg,
      bmi,
      bodyFatPercent: data.weight.bodyFatPercent,
      waistCm: data.weight.waistCm,
      status: weightClassification.status,
      statusLabel: weightClassification.label,
      recordedAt: data.weight.recordedAt,
      daysAgo: daysSince(data.weight.recordedAt),
    };
  }
  
  // Process Glucose
  if (data?.glucose) {
    const glucoseClassification = classifyGlucose(data.glucose.glucoseMmol, data.glucose.timing);
    summary.glucose = {
      glucoseMmol: data.glucose.glucoseMmol,
      timing: data.glucose.timing,
      status: glucoseClassification.status,
      statusLabel: glucoseClassification.label,
      recordedAt: data.glucose.recordedAt,
      daysAgo: daysSince(data.glucose.recordedAt),
    };
  }
  
  // Process Labs
  if (data?.labs) {
    const labs: LabsReading = {
      hba1cPercent: data.labs.hba1cPercent,
      ldlMmol: data.labs.ldlMmol,
      hdlMmol: data.labs.hdlMmol,
      triglyceridesMmol: data.labs.triglyceridesMmol,
      egfr: data.labs.egfr,
      labDate: data.labs.labDate,
      labProvider: data.labs.labProvider,
      recordedAt: data.labs.recordedAt,
      daysAgo: daysSince(data.labs.recordedAt),
    };
    
    if (data.labs.hba1cPercent) {
      labs.hba1cStatus = classifyHbA1c(data.labs.hba1cPercent).status;
    }
    if (data.labs.ldlMmol) {
      labs.ldlStatus = classifyLDL(data.labs.ldlMmol).status;
    }
    if (data.labs.egfr) {
      labs.egfrStatus = classifyEGFR(data.labs.egfr).status;
    }
    
    summary.labs = labs;
  }
  
  return summary;
}

/**
 * Get vitals history with filters
 */
export async function getVitalsHistory(
  userId: string,
  filter: VitalsHistoryFilter = {}
): Promise<VitalsLogEntry[]> {
  const supabase = getSupabaseServiceClient();
  
  let query = supabase
    .from('vitals_log')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false });
  
  // Apply type filter
  if (filter.vitalType) {
    switch (filter.vitalType) {
      case 'bp':
        query = query.not('systolic_bp', 'is', null);
        break;
      case 'weight':
        query = query.not('weight_kg', 'is', null);
        break;
      case 'glucose':
        query = query.not('glucose_mmol', 'is', null);
        break;
      case 'labs':
        query = query.or('hba1c_percent.not.is.null,ldl_mmol.not.is.null,egfr.not.is.null');
        break;
    }
  }
  
  // Apply date filters
  if (filter.startDate) {
    query = query.gte('recorded_at', filter.startDate);
  }
  if (filter.endDate) {
    query = query.lte('recorded_at', filter.endDate);
  }
  
  // Apply pagination
  if (filter.limit) {
    query = query.limit(filter.limit);
  }
  if (filter.offset) {
    query = query.range(filter.offset, filter.offset + (filter.limit || 50) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) throw new Error(error.message);
  return (data || []).map(mapVitalsLogEntry);
}

/**
 * Get latest N entries for a vital type
 */
export async function getLatestVitals(
  userId: string,
  vitalType: 'bp' | 'weight' | 'glucose' | 'labs',
  limit: number = 10
): Promise<VitalsLogEntry[]> {
  return getVitalsHistory(userId, { vitalType, limit });
}

// ============================================
// VITAL TARGETS
// ============================================

/**
 * Get user's vital targets
 */
export async function getVitalTargets(userId: string): Promise<VitalTargets> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_vital_targets')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }
  
  if (!data) {
    return { ...DEFAULT_VITAL_TARGETS, userId };
  }
  
  return mapVitalTargets(data);
}

/**
 * Update user's vital targets
 */
export async function updateVitalTargets(
  userId: string,
  input: UpdateTargetsInput,
  tenantId?: string
): Promise<VitalTargets> {
  const supabase = getSupabaseServiceClient();
  
  const updateData: Record<string, any> = {
    user_id: userId,
    tenant_id: tenantId,
  };
  
  if (input.targetSystolicMax !== undefined) updateData.target_systolic_max = input.targetSystolicMax;
  if (input.targetDiastolicMax !== undefined) updateData.target_diastolic_max = input.targetDiastolicMax;
  if (input.targetFastingGlucoseMin !== undefined) updateData.target_fasting_glucose_min = input.targetFastingGlucoseMin;
  if (input.targetFastingGlucoseMax !== undefined) updateData.target_fasting_glucose_max = input.targetFastingGlucoseMax;
  if (input.targetPostmealGlucoseMax !== undefined) updateData.target_postmeal_glucose_max = input.targetPostmealGlucoseMax;
  if (input.targetHba1cMax !== undefined) updateData.target_hba1c_max = input.targetHba1cMax;
  if (input.targetLdlMax !== undefined) updateData.target_ldl_max = input.targetLdlMax;
  if (input.targetHdlMin !== undefined) updateData.target_hdl_min = input.targetHdlMin;
  if (input.targetTriglyceridesMax !== undefined) updateData.target_triglycerides_max = input.targetTriglyceridesMax;
  if (input.targetWeightKg !== undefined) updateData.target_weight_kg = input.targetWeightKg;
  if (input.targetBmiMax !== undefined) updateData.target_bmi_max = input.targetBmiMax;
  if (input.targetEgfrMin !== undefined) updateData.target_egfr_min = input.targetEgfrMin;
  if (input.setBy !== undefined) updateData.set_by = input.setBy;
  if (input.doctorName !== undefined) updateData.doctor_name = input.doctorName;
  if (input.notes !== undefined) updateData.notes = input.notes;
  
  const { data, error } = await supabase
    .from('user_vital_targets')
    .upsert(updateData, { onConflict: 'user_id' })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return mapVitalTargets(data);
}

// ============================================
// MAPPERS
// ============================================

function mapVitalsLogEntry(row: any): VitalsLogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    recordedAt: row.recorded_at,
    
    // BP
    systolicBp: row.systolic_bp,
    diastolicBp: row.diastolic_bp,
    pulse: row.pulse,
    bpArm: row.bp_arm,
    bpPosition: row.bp_position,
    
    // Weight
    weightKg: row.weight_kg ? parseFloat(row.weight_kg) : undefined,
    bodyFatPercent: row.body_fat_percent ? parseFloat(row.body_fat_percent) : undefined,
    waistCm: row.waist_cm ? parseFloat(row.waist_cm) : undefined,
    
    // Glucose
    glucoseMmol: row.glucose_mmol ? parseFloat(row.glucose_mmol) : undefined,
    glucoseTiming: row.glucose_timing,
    
    // Labs
    hba1cPercent: row.hba1c_percent ? parseFloat(row.hba1c_percent) : undefined,
    totalCholesterolMmol: row.total_cholesterol_mmol ? parseFloat(row.total_cholesterol_mmol) : undefined,
    ldlMmol: row.ldl_mmol ? parseFloat(row.ldl_mmol) : undefined,
    hdlMmol: row.hdl_mmol ? parseFloat(row.hdl_mmol) : undefined,
    triglyceridesMmol: row.triglycerides_mmol ? parseFloat(row.triglycerides_mmol) : undefined,
    egfr: row.egfr ? parseFloat(row.egfr) : undefined,
    uricAcidUmol: row.uric_acid_umol,
    creatinineUmol: row.creatinine_umol,
    
    // Meta
    source: row.source,
    notes: row.notes,
    labDate: row.lab_date,
    labProvider: row.lab_provider,
    
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapVitalTargets(row: any): VitalTargets {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    
    targetSystolicMax: row.target_systolic_max,
    targetDiastolicMax: row.target_diastolic_max,
    
    targetFastingGlucoseMin: parseFloat(row.target_fasting_glucose_min),
    targetFastingGlucoseMax: parseFloat(row.target_fasting_glucose_max),
    targetPostmealGlucoseMax: parseFloat(row.target_postmeal_glucose_max),
    targetHba1cMax: parseFloat(row.target_hba1c_max),
    
    targetTotalCholesterolMax: parseFloat(row.target_total_cholesterol_max || '5.2'),
    targetLdlMax: parseFloat(row.target_ldl_max),
    targetHdlMin: parseFloat(row.target_hdl_min),
    targetTriglyceridesMax: parseFloat(row.target_triglycerides_max),
    
    targetWeightKg: row.target_weight_kg ? parseFloat(row.target_weight_kg) : undefined,
    targetBmiMax: parseFloat(row.target_bmi_max),
    
    targetEgfrMin: parseFloat(row.target_egfr_min),
    targetUricAcidMax: row.target_uric_acid_max,
    
    setBy: row.set_by,
    doctorName: row.doctor_name,
    notes: row.notes,
    
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


