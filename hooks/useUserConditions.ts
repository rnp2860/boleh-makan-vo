'use client';

// hooks/useUserConditions.ts
// 🏥 User Conditions Hook - Fetch and manage user health conditions

import { useState, useEffect, useCallback } from 'react';
import {
  UserCondition,
  ConditionType,
  ConditionCode,
  AddUserConditionInput,
  UpdateUserConditionInput,
  ConditionsByCategory,
} from '@/lib/conditions/types';

// ============================================
// TYPES
// ============================================

interface UseUserConditionsResult {
  conditions: UserCondition[];
  primaryCondition: UserCondition | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addCondition: (input: AddUserConditionInput) => Promise<{ success: boolean; error?: string }>;
  updateCondition: (id: string, input: UpdateUserConditionInput) => Promise<{ success: boolean; error?: string }>;
  removeCondition: (id: string) => Promise<{ success: boolean; error?: string }>;
  setPrimary: (conditionCode: ConditionCode) => Promise<{ success: boolean; error?: string }>;
  hasCondition: (conditionCode: ConditionCode) => boolean;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasCKD: boolean;
  hasGout: boolean;
  hasDyslipidemia: boolean;
}

interface UseConditionTypesResult {
  conditionTypes: ConditionType[];
  conditionsByCategory: ConditionsByCategory;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// USER CONDITIONS HOOK
// ============================================

export function useUserConditions(userId: string | null): UseUserConditionsResult {
  const [conditions, setConditions] = useState<UserCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conditions
  const fetchConditions = useCallback(async () => {
    if (!userId) {
      setConditions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conditions/user?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setConditions(data.conditions);
      } else {
        setError(data.error || 'Failed to fetch conditions');
      }
    } catch (err) {
      console.error('Error fetching conditions:', err);
      setError('Failed to load conditions');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  // Add condition
  const addCondition = useCallback(async (input: AddUserConditionInput) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const response = await fetch('/api/conditions/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConditions();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to add condition' };
    }
  }, [userId, fetchConditions]);

  // Update condition
  const updateCondition = useCallback(async (id: string, input: UpdateUserConditionInput) => {
    try {
      const response = await fetch(`/api/conditions/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConditions();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to update condition' };
    }
  }, [fetchConditions]);

  // Remove condition
  const removeCondition = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/conditions/user/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchConditions();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to remove condition' };
    }
  }, [fetchConditions]);

  // Set primary condition
  const setPrimary = useCallback(async (conditionCode: ConditionCode) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const response = await fetch('/api/conditions/user/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, conditionCode }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConditions();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to set primary condition' };
    }
  }, [userId, fetchConditions]);

  // Helper: has condition
  const hasCondition = useCallback((conditionCode: ConditionCode) => {
    return conditions.some(c => c.conditionCode === conditionCode && c.isActive);
  }, [conditions]);

  // Primary condition
  const primaryCondition = conditions.find(c => c.isPrimary) || conditions[0] || null;

  // Common condition checks
  const hasDiabetes = conditions.some(c => 
    ['diabetes_t1', 'diabetes_t2', 'prediabetes', 'gestational_diabetes'].includes(c.conditionCode)
  );
  const hasHypertension = hasCondition('hypertension');
  const hasCKD = conditions.some(c => c.conditionCode.startsWith('ckd_'));
  const hasGout = hasCondition('gout');
  const hasDyslipidemia = hasCondition('dyslipidemia');

  return {
    conditions,
    primaryCondition,
    isLoading,
    error,
    refetch: fetchConditions,
    addCondition,
    updateCondition,
    removeCondition,
    setPrimary,
    hasCondition,
    hasDiabetes,
    hasHypertension,
    hasCKD,
    hasGout,
    hasDyslipidemia,
  };
}

// ============================================
// CONDITION TYPES HOOK
// ============================================

export function useConditionTypes(): UseConditionTypesResult {
  const [conditionTypes, setConditionTypes] = useState<ConditionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('/api/conditions/types');
        const data = await response.json();

        if (data.success) {
          setConditionTypes(data.types);
        } else {
          setError(data.error || 'Failed to fetch condition types');
        }
      } catch (err) {
        console.error('Error fetching condition types:', err);
        setError('Failed to load condition types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypes();
  }, []);

  // Group by category
  const conditionsByCategory: ConditionsByCategory = {
    metabolic: conditionTypes.filter(c => c.category === 'metabolic'),
    cardiovascular: conditionTypes.filter(c => c.category === 'cardiovascular'),
    renal: conditionTypes.filter(c => c.category === 'renal'),
    other: conditionTypes.filter(c => c.category === 'other'),
  };

  return {
    conditionTypes,
    conditionsByCategory,
    isLoading,
    error,
  };
}


