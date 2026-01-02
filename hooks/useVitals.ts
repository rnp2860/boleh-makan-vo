'use client';

// hooks/useVitals.ts
// 💓 Vitals Hooks - React hooks for vitals data management

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  VitalsSummary,
  VitalsLogEntry,
  VitalTargets,
  LogBPInput,
  LogWeightInput,
  LogGlucoseInput,
  LogLabsInput,
  UpdateTargetsInput,
  VitalsHistoryFilter,
  VitalType,
} from '@/lib/vitals/types';

// ============================================
// QUERY KEYS
// ============================================

export const VITALS_QUERY_KEYS = {
  summary: (userId: string) => ['vitals', 'summary', userId],
  history: (userId: string, filter?: VitalsHistoryFilter) => ['vitals', 'history', userId, filter],
  targets: (userId: string) => ['vitals', 'targets', userId],
  latest: (userId: string, type: VitalType) => ['vitals', 'latest', userId, type],
};

// ============================================
// VITALS SUMMARY HOOK
// ============================================

interface UseVitalsSummaryOptions {
  userId: string;
  userHeightCm?: number;
}

export function useVitalsSummary({ userId, userHeightCm }: UseVitalsSummaryOptions) {
  const { data, isLoading, error, refetch } = useQuery<VitalsSummary>({
    queryKey: VITALS_QUERY_KEYS.summary(userId),
    queryFn: async () => {
      const response = await fetch(`/api/vitals/summary?userId=${userId}${userHeightCm ? `&heightCm=${userHeightCm}` : ''}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch vitals summary');
      return result.summary;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    summary: data || {},
    isLoading,
    error,
    refetch,
  };
}

// ============================================
// VITALS HISTORY HOOK
// ============================================

interface UseVitalsHistoryOptions {
  userId: string;
  filter?: VitalsHistoryFilter;
}

export function useVitalsHistory({ userId, filter }: UseVitalsHistoryOptions) {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage } = useQuery<VitalsLogEntry[]>({
    queryKey: VITALS_QUERY_KEYS.history(userId, filter),
    queryFn: async () => {
      const params = new URLSearchParams({ userId });
      if (filter?.vitalType) params.set('vitalType', filter.vitalType);
      if (filter?.startDate) params.set('startDate', filter.startDate);
      if (filter?.endDate) params.set('endDate', filter.endDate);
      if (filter?.limit) params.set('limit', String(filter.limit));
      if (filter?.offset) params.set('offset', String(filter.offset));

      const response = await fetch(`/api/vitals/history?${params}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch vitals history');
      return result.entries;
    },
    enabled: !!userId,
  });

  return {
    entries: data || [],
    isLoading,
    error,
    refetch,
  };
}

// ============================================
// VITAL TARGETS HOOK
// ============================================

export function useVitalTargets(userId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<VitalTargets>({
    queryKey: VITALS_QUERY_KEYS.targets(userId),
    queryFn: async () => {
      const response = await fetch(`/api/vitals/targets?userId=${userId}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch targets');
      return result.targets;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateTargetsInput) => {
      const response = await fetch('/api/vitals/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update targets');
      return result.targets;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.targets(userId) });
      toast.success('Targets updated');
    },
    onError: (err: Error) => {
      toast.error('Failed to update targets', { description: err.message });
    },
  });

  return {
    targets: data,
    isLoading,
    error,
    updateTargets: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

// ============================================
// LOG VITALS HOOKS
// ============================================

export function useLogBP(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogBPInput) => {
      const response = await fetch('/api/vitals/bp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to log BP');
      return result.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.summary(userId) });
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.history(userId, { vitalType: 'bp' }) });
      toast.success('Blood pressure logged');
    },
    onError: (err: Error) => {
      toast.error('Failed to log blood pressure', { description: err.message });
    },
  });
}

export function useLogWeight(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogWeightInput) => {
      const response = await fetch('/api/vitals/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to log weight');
      return result.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.summary(userId) });
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.history(userId, { vitalType: 'weight' }) });
      toast.success('Weight logged');
    },
    onError: (err: Error) => {
      toast.error('Failed to log weight', { description: err.message });
    },
  });
}

export function useLogGlucose(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogGlucoseInput) => {
      const response = await fetch('/api/vitals/glucose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to log glucose');
      return result.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.summary(userId) });
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.history(userId, { vitalType: 'glucose' }) });
      toast.success('Blood glucose logged');
    },
    onError: (err: Error) => {
      toast.error('Failed to log glucose', { description: err.message });
    },
  });
}

export function useLogLabs(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogLabsInput) => {
      const response = await fetch('/api/vitals/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...input }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to log labs');
      return result.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.summary(userId) });
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.history(userId, { vitalType: 'labs' }) });
      toast.success('Lab results saved');
    },
    onError: (err: Error) => {
      toast.error('Failed to save lab results', { description: err.message });
    },
  });
}

// ============================================
// DELETE VITALS HOOK
// ============================================

export function useDeleteVitals(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      const response = await fetch(`/api/vitals/${entryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete entry');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_QUERY_KEYS.summary(userId) });
      queryClient.invalidateQueries({ queryKey: ['vitals', 'history', userId] });
      toast.success('Entry deleted');
    },
    onError: (err: Error) => {
      toast.error('Failed to delete entry', { description: err.message });
    },
  });
}

// ============================================
// COMBINED VITALS HOOK
// ============================================

export function useVitals(userId: string, userHeightCm?: number) {
  const summary = useVitalsSummary({ userId, userHeightCm });
  const targets = useVitalTargets(userId);
  const logBP = useLogBP(userId);
  const logWeight = useLogWeight(userId);
  const logGlucose = useLogGlucose(userId);
  const logLabs = useLogLabs(userId);
  const deleteEntry = useDeleteVitals(userId);

  return {
    // Summary
    summary: summary.summary,
    isSummaryLoading: summary.isLoading,
    summaryError: summary.error,
    refetchSummary: summary.refetch,
    
    // Targets
    targets: targets.targets,
    isTargetsLoading: targets.isLoading,
    updateTargets: targets.updateTargets,
    
    // Log functions
    logBP: logBP.mutateAsync,
    isLoggingBP: logBP.isPending,
    
    logWeight: logWeight.mutateAsync,
    isLoggingWeight: logWeight.isPending,
    
    logGlucose: logGlucose.mutateAsync,
    isLoggingGlucose: logGlucose.isPending,
    
    logLabs: logLabs.mutateAsync,
    isLoggingLabs: logLabs.isPending,
    
    deleteEntry: deleteEntry.mutateAsync,
    isDeleting: deleteEntry.isPending,
  };
}


