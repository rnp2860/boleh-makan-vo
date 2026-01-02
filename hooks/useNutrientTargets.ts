'use client';

// hooks/useNutrientTargets.ts
// 🏥 Nutrient Targets Hook - Fetch and manage nutrient targets

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  NutrientTarget,
  NutrientCode,
  DailyNutrientSummary,
  NutrientWarning,
  NutrientBarData,
  SetUserNutrientTargetInput,
  ConditionCode,
} from '@/lib/conditions/types';
import {
  checkDailyNutrients,
  generateNutrientBars,
  calculateRemainingNutrients,
  adjustTargetsForWeight,
} from '@/lib/conditions/nutrient-utils';

// ============================================
// TYPES
// ============================================

interface UseNutrientTargetsResult {
  targets: NutrientTarget[];
  adjustedTargets: NutrientTarget[]; // Adjusted for body weight
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setTarget: (input: SetUserNutrientTargetInput) => Promise<{ success: boolean; error?: string }>;
  removeTarget: (nutrientCode: NutrientCode) => Promise<{ success: boolean; error?: string }>;
  getTarget: (nutrientCode: NutrientCode) => NutrientTarget | undefined;
}

interface UseDailyNutrientsResult {
  summary: DailyNutrientSummary | null;
  warnings: NutrientWarning[];
  nutrientBars: NutrientBarData[];
  remaining: Partial<Record<NutrientCode, { remaining: number; percentage: number; unit: string }>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseNutrientWarningsResult {
  warnings: NutrientWarning[];
  hasWarnings: boolean;
  hasCriticalWarnings: boolean;
  getWarningsForNutrient: (nutrientCode: NutrientCode) => NutrientWarning[];
}

// ============================================
// NUTRIENT TARGETS HOOK
// ============================================

export function useNutrientTargets(
  userId: string | null,
  weightKg?: number
): UseNutrientTargetsResult {
  const [targets, setTargets] = useState<NutrientTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch targets
  const fetchTargets = useCallback(async () => {
    if (!userId) {
      setTargets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conditions/nutrients/targets?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setTargets(data.targets);
      } else {
        setError(data.error || 'Failed to fetch targets');
      }
    } catch (err) {
      console.error('Error fetching nutrient targets:', err);
      setError('Failed to load nutrient targets');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Adjust targets for body weight
  const adjustedTargets = useMemo(() => {
    if (weightKg && weightKg > 0) {
      return adjustTargetsForWeight(targets, weightKg);
    }
    return targets;
  }, [targets, weightKg]);

  // Set a custom target
  const setTarget = useCallback(async (input: SetUserNutrientTargetInput) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const response = await fetch('/api/conditions/nutrients/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTargets();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to set target' };
    }
  }, [userId, fetchTargets]);

  // Remove a custom target
  const removeTarget = useCallback(async (nutrientCode: NutrientCode) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const response = await fetch(`/api/conditions/nutrients/targets?userId=${userId}&nutrientCode=${nutrientCode}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchTargets();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to remove target' };
    }
  }, [userId, fetchTargets]);

  // Get a specific target
  const getTarget = useCallback((nutrientCode: NutrientCode) => {
    return adjustedTargets.find(t => t.nutrientCode === nutrientCode);
  }, [adjustedTargets]);

  return {
    targets,
    adjustedTargets,
    isLoading,
    error,
    refetch: fetchTargets,
    setTarget,
    removeTarget,
    getTarget,
  };
}

// ============================================
// DAILY NUTRIENTS HOOK
// ============================================

export function useDailyNutrients(
  userId: string | null,
  date: string,
  targets: NutrientTarget[],
  userConditions: ConditionCode[]
): UseDailyNutrientsResult {
  const [summary, setSummary] = useState<DailyNutrientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch daily summary
  const fetchSummary = useCallback(async () => {
    if (!userId || !date) {
      setSummary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conditions/nutrients/daily?userId=${userId}&date=${date}`);
      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        // No summary for this date is okay
        setSummary(null);
      }
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      setError('Failed to load daily nutrients');
    } finally {
      setIsLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Calculate warnings
  const warnings = useMemo(() => {
    if (!summary || targets.length === 0) return [];
    return checkDailyNutrients(summary, targets, userConditions);
  }, [summary, targets, userConditions]);

  // Generate nutrient bars for dashboard
  const nutrientBars = useMemo(() => {
    if (!summary || targets.length === 0) return [];
    return generateNutrientBars(summary, targets, userConditions);
  }, [summary, targets, userConditions]);

  // Calculate remaining nutrients
  const remaining = useMemo(() => {
    if (!summary || targets.length === 0) return {};
    return calculateRemainingNutrients(summary, targets);
  }, [summary, targets]);

  return {
    summary,
    warnings,
    nutrientBars,
    remaining,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}

// ============================================
// NUTRIENT WARNINGS HOOK
// ============================================

export function useNutrientWarnings(
  warnings: NutrientWarning[]
): UseNutrientWarningsResult {
  const hasWarnings = warnings.length > 0;
  const hasCriticalWarnings = warnings.some(w => w.level === 'danger');

  const getWarningsForNutrient = useCallback((nutrientCode: NutrientCode) => {
    return warnings.filter(w => w.nutrient === nutrientCode);
  }, [warnings]);

  return {
    warnings,
    hasWarnings,
    hasCriticalWarnings,
    getWarningsForNutrient,
  };
}

// ============================================
// COMBINED HEALTH CONTEXT HOOK
// ============================================

interface UseHealthContextResult {
  conditions: ConditionCode[];
  targets: NutrientTarget[];
  dailySummary: DailyNutrientSummary | null;
  warnings: NutrientWarning[];
  nutrientBars: NutrientBarData[];
  isLoading: boolean;
  hasHypertension: boolean;
  hasCKD: boolean;
  hasGout: boolean;
  hasDyslipidemia: boolean;
}

export function useHealthContext(
  userId: string | null,
  date?: string
): UseHealthContextResult {
  const [conditions, setConditions] = useState<ConditionCode[]>([]);
  const [targets, setTargets] = useState<NutrientTarget[]>([]);
  const [dailySummary, setDailySummary] = useState<DailyNutrientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = date || new Date().toISOString().split('T')[0];

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const [conditionsRes, targetsRes, summaryRes] = await Promise.all([
          fetch(`/api/conditions/user?userId=${userId}`),
          fetch(`/api/conditions/nutrients/targets?userId=${userId}`),
          fetch(`/api/conditions/nutrients/daily?userId=${userId}&date=${today}`),
        ]);

        const [conditionsData, targetsData, summaryData] = await Promise.all([
          conditionsRes.json(),
          targetsRes.json(),
          summaryRes.json(),
        ]);

        if (conditionsData.success) {
          setConditions(conditionsData.conditions.map((c: any) => c.conditionCode));
        }

        if (targetsData.success) {
          setTargets(targetsData.targets);
        }

        if (summaryData.success) {
          setDailySummary(summaryData.summary);
        }
      } catch (err) {
        console.error('Error fetching health context:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [userId, today]);

  // Calculate warnings and bars
  const warnings = useMemo(() => {
    if (!dailySummary || targets.length === 0) return [];
    return checkDailyNutrients(dailySummary, targets, conditions);
  }, [dailySummary, targets, conditions]);

  const nutrientBars = useMemo(() => {
    if (!dailySummary || targets.length === 0) return [];
    return generateNutrientBars(dailySummary, targets, conditions);
  }, [dailySummary, targets, conditions]);

  // Condition flags
  const hasHypertension = conditions.includes('hypertension');
  const hasCKD = conditions.some(c => c.startsWith('ckd_'));
  const hasGout = conditions.includes('gout');
  const hasDyslipidemia = conditions.includes('dyslipidemia');

  return {
    conditions,
    targets,
    dailySummary,
    warnings,
    nutrientBars,
    isLoading,
    hasHypertension,
    hasCKD,
    hasGout,
    hasDyslipidemia,
  };
}


