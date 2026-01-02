// lib/conditions/queries.ts
// 🏥 Comorbidity Queries - Database operations for conditions

import { getSupabaseServiceClient } from '@/lib/supabase';
import {
  ConditionType,
  UserCondition,
  ConditionNutrientTarget,
  UserNutrientTarget,
  NutrientTarget,
  DailyNutrientSummary,
  AddUserConditionInput,
  UpdateUserConditionInput,
  SetUserNutrientTargetInput,
  ConditionCode,
  NutrientCode,
  ConditionsByCategory,
} from './types';

// ============================================
// CONDITION TYPES (System Reference)
// ============================================

/**
 * Get all active condition types
 */
export async function getConditionTypes(): Promise<ConditionType[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('condition_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching condition types:', error);
    return [];
  }
  
  return (data || []).map(mapConditionType);
}

/**
 * Get condition types grouped by category
 */
export async function getConditionTypesByCategory(): Promise<ConditionsByCategory> {
  const conditions = await getConditionTypes();
  
  return {
    metabolic: conditions.filter(c => c.category === 'metabolic'),
    cardiovascular: conditions.filter(c => c.category === 'cardiovascular'),
    renal: conditions.filter(c => c.category === 'renal'),
    other: conditions.filter(c => c.category === 'other'),
  };
}

/**
 * Get a single condition type by code
 */
export async function getConditionTypeByCode(code: ConditionCode): Promise<ConditionType | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('condition_types')
    .select('*')
    .eq('code', code)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return mapConditionType(data);
}

// ============================================
// USER CONDITIONS
// ============================================

/**
 * Get all conditions for a user
 */
export async function getUserConditions(userId: string): Promise<UserCondition[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_conditions')
    .select(`
      *,
      condition:condition_types(*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('is_primary', { ascending: false });
  
  if (error) {
    console.error('Error fetching user conditions:', error);
    return [];
  }
  
  return (data || []).map(mapUserCondition);
}

/**
 * Get user's primary condition
 */
export async function getUserPrimaryCondition(userId: string): Promise<UserCondition | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_conditions')
    .select(`
      *,
      condition:condition_types(*)
    `)
    .eq('user_id', userId)
    .eq('is_primary', true)
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    // Default to first active condition
    const { data: firstCondition } = await supabase
      .from('user_conditions')
      .select(`*, condition:condition_types(*)`)
      .eq('user_id', userId)
      .eq('is_active', true)
      .limit(1)
      .single();
    
    return firstCondition ? mapUserCondition(firstCondition) : null;
  }
  
  return mapUserCondition(data);
}

/**
 * Check if user has a specific condition
 */
export async function userHasCondition(userId: string, conditionCode: ConditionCode): Promise<boolean> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_conditions')
    .select('id')
    .eq('user_id', userId)
    .eq('condition_code', conditionCode)
    .eq('is_active', true)
    .single();
  
  return !!data && !error;
}

/**
 * Add a condition for a user
 */
export async function addUserCondition(
  userId: string,
  input: AddUserConditionInput,
  tenantId?: string
): Promise<{ success: boolean; condition?: UserCondition; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Check if already exists
  const { data: existing } = await supabase
    .from('user_conditions')
    .select('id, is_active')
    .eq('user_id', userId)
    .eq('condition_code', input.conditionCode)
    .single();
  
  if (existing) {
    if (existing.is_active) {
      return { success: false, error: 'Condition already added' };
    }
    
    // Reactivate existing condition
    const { data, error } = await supabase
      .from('user_conditions')
      .update({
        is_active: true,
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select(`*, condition:condition_types(*)`)
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, condition: mapUserCondition(data) };
  }
  
  // Insert new condition
  const { data, error } = await supabase
    .from('user_conditions')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      condition_code: input.conditionCode,
      diagnosed_date: input.diagnosedDate,
      severity: input.severity,
      on_medication: input.onMedication ?? false,
      medication_names: input.medicationNames,
      medication_notes: input.medicationNotes,
      managing_doctor: input.managingDoctor,
      hospital_clinic: input.hospitalClinic,
      is_primary: input.isPrimary ?? false,
    })
    .select(`*, condition:condition_types(*)`)
    .single();
  
  if (error) {
    console.error('Error adding user condition:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, condition: mapUserCondition(data) };
}

/**
 * Update a user condition
 */
export async function updateUserCondition(
  conditionId: string,
  input: UpdateUserConditionInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('user_conditions')
    .update({
      ...input,
      medication_names: input.medicationNames,
      medication_notes: input.medicationNotes,
      managing_doctor: input.managingDoctor,
      hospital_clinic: input.hospitalClinic,
      is_primary: input.isPrimary,
      is_active: input.isActive,
    })
    .eq('id', conditionId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Remove (deactivate) a user condition
 */
export async function removeUserCondition(
  conditionId: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserCondition(conditionId, { isActive: false });
}

/**
 * Set user's primary condition
 */
export async function setPrimaryCondition(
  userId: string,
  conditionCode: ConditionCode
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // First, unset all as primary
  await supabase
    .from('user_conditions')
    .update({ is_primary: false })
    .eq('user_id', userId);
  
  // Then set the specified one as primary
  const { error } = await supabase
    .from('user_conditions')
    .update({ is_primary: true })
    .eq('user_id', userId)
    .eq('condition_code', conditionCode)
    .eq('is_active', true);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// NUTRIENT TARGETS
// ============================================

/**
 * Get combined nutrient targets for a user
 * Uses the database function that combines condition defaults with user overrides
 */
export async function getUserNutrientTargets(userId: string): Promise<NutrientTarget[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase.rpc('get_user_nutrient_targets', {
    p_user_id: userId,
  });
  
  if (error) {
    console.error('Error fetching nutrient targets:', error);
    return [];
  }
  
  return (data || []).map((row: any) => ({
    nutrientCode: row.nutrient_code as NutrientCode,
    minValue: row.min_value,
    maxValue: row.max_value,
    unit: row.unit,
    isPerKgBodyWeight: row.is_per_kg_body_weight,
    priority: row.priority,
    source: row.source,
    guidance: row.guidance,
    guidanceMs: row.guidance_ms,
  }));
}

/**
 * Get default nutrient targets for a specific condition
 */
export async function getConditionNutrientTargets(
  conditionCode: ConditionCode
): Promise<ConditionNutrientTarget[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('condition_nutrient_targets')
    .select('*')
    .eq('condition_code', conditionCode)
    .order('priority');
  
  if (error) {
    console.error('Error fetching condition nutrient targets:', error);
    return [];
  }
  
  return (data || []).map(mapConditionNutrientTarget);
}

/**
 * Get user's personal nutrient target overrides
 */
export async function getUserNutrientTargetOverrides(userId: string): Promise<UserNutrientTarget[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_nutrient_targets')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user nutrient overrides:', error);
    return [];
  }
  
  return (data || []).map(mapUserNutrientTarget);
}

/**
 * Set a user's personal nutrient target
 */
export async function setUserNutrientTarget(
  userId: string,
  input: SetUserNutrientTargetInput,
  tenantId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('user_nutrient_targets')
    .upsert({
      user_id: userId,
      tenant_id: tenantId,
      nutrient_code: input.nutrientCode,
      min_value: input.minValue,
      max_value: input.maxValue,
      unit: input.unit,
      is_per_kg_body_weight: input.isPerKgBodyWeight ?? false,
      source: input.source,
      source_name: input.sourceName,
      source_date: input.sourceDate,
      source_notes: input.sourceNotes,
    }, {
      onConflict: 'user_id,nutrient_code',
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Remove a user's personal nutrient target override
 */
export async function removeUserNutrientTarget(
  userId: string,
  nutrientCode: NutrientCode
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('user_nutrient_targets')
    .delete()
    .eq('user_id', userId)
    .eq('nutrient_code', nutrientCode);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// DAILY NUTRIENT SUMMARY
// ============================================

/**
 * Get daily nutrient summary for a user
 */
export async function getDailyNutrientSummary(
  userId: string,
  date: string
): Promise<DailyNutrientSummary | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('daily_nutrient_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return mapDailyNutrientSummary(data);
}

/**
 * Get daily nutrient summaries for a date range
 */
export async function getDailyNutrientSummaries(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyNutrientSummary[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('daily_nutrient_summary')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching daily summaries:', error);
    return [];
  }
  
  return (data || []).map(mapDailyNutrientSummary);
}

/**
 * Update daily nutrient summary (typically called after food log changes)
 */
export async function updateDailyNutrientSummary(
  userId: string,
  date: string,
  nutrients: Partial<Omit<DailyNutrientSummary, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'>>,
  tenantId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('daily_nutrient_summary')
    .upsert({
      user_id: userId,
      tenant_id: tenantId,
      date,
      calories: nutrients.calories,
      carbs_g: nutrients.carbsG,
      protein_g: nutrients.proteinG,
      fat_g: nutrients.fatG,
      sodium_mg: nutrients.sodiumMg,
      potassium_mg: nutrients.potassiumMg,
      phosphorus_mg: nutrients.phosphorusMg,
      cholesterol_mg: nutrients.cholesterolMg,
      saturated_fat_g: nutrients.saturatedFatG,
      trans_fat_g: nutrients.transFatG,
      fiber_g: nutrients.fiberG,
      sugar_g: nutrients.sugarG,
      purine_mg: nutrients.purineMg,
      fructose_g: nutrients.fructoseG,
      alcohol_g: nutrients.alcoholG,
      meals_logged: nutrients.mealsLogged,
      snacks_logged: nutrients.snacksLogged,
    }, {
      onConflict: 'user_id,date',
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// MAPPING HELPERS
// ============================================

function mapConditionType(row: any): ConditionType {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nameMs: row.name_ms,
    category: row.category,
    description: row.description,
    descriptionMs: row.description_ms,
    icon: row.icon,
    color: row.color,
    isActive: row.is_active,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  };
}

function mapUserCondition(row: any): UserCondition {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    conditionCode: row.condition_code,
    diagnosedDate: row.diagnosed_date,
    severity: row.severity,
    onMedication: row.on_medication,
    medicationNames: row.medication_names,
    medicationNotes: row.medication_notes,
    managingDoctor: row.managing_doctor,
    hospitalClinic: row.hospital_clinic,
    isPrimary: row.is_primary,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    condition: row.condition ? mapConditionType(row.condition) : undefined,
  };
}

function mapConditionNutrientTarget(row: any): ConditionNutrientTarget {
  return {
    id: row.id,
    conditionCode: row.condition_code,
    nutrientCode: row.nutrient_code,
    minValue: row.min_value,
    maxValue: row.max_value,
    unit: row.unit,
    isPerKgBodyWeight: row.is_per_kg_body_weight,
    priority: row.priority,
    guidance: row.guidance,
    guidanceMs: row.guidance_ms,
    sourceReference: row.source_reference,
    createdAt: row.created_at,
  };
}

function mapUserNutrientTarget(row: any): UserNutrientTarget {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    nutrientCode: row.nutrient_code,
    minValue: row.min_value,
    maxValue: row.max_value,
    unit: row.unit,
    isPerKgBodyWeight: row.is_per_kg_body_weight,
    source: row.source,
    sourceName: row.source_name,
    sourceDate: row.source_date,
    sourceNotes: row.source_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDailyNutrientSummary(row: any): DailyNutrientSummary {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    date: row.date,
    calories: row.calories,
    carbsG: row.carbs_g,
    proteinG: row.protein_g,
    fatG: row.fat_g,
    sodiumMg: row.sodium_mg,
    potassiumMg: row.potassium_mg,
    phosphorusMg: row.phosphorus_mg,
    cholesterolMg: row.cholesterol_mg,
    saturatedFatG: row.saturated_fat_g,
    transFatG: row.trans_fat_g,
    fiberG: row.fiber_g,
    sugarG: row.sugar_g,
    purineMg: row.purine_mg,
    fructoseG: row.fructose_g,
    alcoholG: row.alcohol_g,
    mealsLogged: row.meals_logged,
    snacksLogged: row.snacks_logged,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


