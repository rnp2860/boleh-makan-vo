// hooks/useRamadanMode.ts
// 🌙 React Hook for Ramadan Mode State Management

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import {
  RamadanSettings,
  RamadanDailyLog,
  RamadanDates,
  RamadanProgress,
  FastingStatus,
  RamadanStats,
  DEFAULT_RAMADAN_SETTINGS,
  RamadanSettingsInput,
  RamadanDailyLogInput,
} from '@/lib/types/ramadan';
import {
  getRamadanProgress,
  getFastingStatus,
  calculateRamadanStats,
  calculateFastingDay,
} from '@/lib/ramadan/fasting-utils';

// ============================================
// HOOK: useRamadanMode
// ============================================

interface UseRamadanModeOptions {
  userId: string | null;
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
}

interface UseRamadanModeReturn {
  // State
  isLoading: boolean;
  error: string | null;
  settings: RamadanSettings | null;
  todayLog: RamadanDailyLog | null;
  ramadanDates: RamadanDates | null;
  
  // Computed
  isRamadanMode: boolean;
  progress: RamadanProgress;
  fastingStatus: FastingStatus | null;
  stats: RamadanStats | null;
  
  // Actions
  enableRamadanMode: () => Promise<void>;
  disableRamadanMode: () => Promise<void>;
  updateSettings: (settings: Partial<RamadanSettingsInput>) => Promise<void>;
  updateTodayLog: (log: Partial<RamadanDailyLogInput>) => Promise<void>;
  logSahur: (data: { calories: number; carbs?: number; protein?: number; fat?: number; notes?: string }) => Promise<void>;
  logIftar: (data: { calories: number; carbs?: number; protein?: number; fat?: number; notes?: string }) => Promise<void>;
  markFastingComplete: () => Promise<void>;
  markFastingBroken: (reason: string) => Promise<void>;
  logGlucose: (type: 'sahur' | 'midday' | 'pre_iftar' | 'post_iftar', value: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRamadanMode({
  userId,
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: UseRamadanModeOptions): UseRamadanModeReturn {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<RamadanSettings | null>(null);
  const [todayLog, setTodayLog] = useState<RamadanDailyLog | null>(null);
  const [ramadanDates, setRamadanDates] = useState<RamadanDates | null>(null);
  const [allLogs, setAllLogs] = useState<RamadanDailyLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const supabase = getSupabaseClient();
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchRamadanDates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ramadan_dates')
        .select('*')
        .eq('year', currentYear)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is OK
        console.error('Error fetching Ramadan dates:', error);
      }
      
      setRamadanDates(data || null);
    } catch (err) {
      console.error('Error fetching Ramadan dates:', err);
    }
  }, [supabase, currentYear]);

  const fetchSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('ramadan_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('year', currentYear)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Ramadan settings:', error);
      }
      
      setSettings(data || null);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  }, [supabase, userId, currentYear]);

  const fetchTodayLog = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('ramadan_daily_log')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today\'s log:', error);
      }
      
      setTodayLog(data || null);
    } catch (err) {
      console.error('Error fetching today log:', err);
    }
  }, [supabase, userId, today]);

  const fetchAllLogs = useCallback(async () => {
    if (!userId || !ramadanDates) return;

    try {
      const { data, error } = await supabase
        .from('ramadan_daily_log')
        .select('*')
        .eq('user_id', userId)
        .gte('date', ramadanDates.start_date)
        .lte('date', ramadanDates.end_date)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching all logs:', error);
      }
      
      setAllLogs(data || []);
    } catch (err) {
      console.error('Error fetching all logs:', err);
    }
  }, [supabase, userId, ramadanDates]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchRamadanDates(),
        fetchSettings(),
        fetchTodayLog(),
      ]);
      
      if (ramadanDates) {
        await fetchAllLogs();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load Ramadan data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchRamadanDates, fetchSettings, fetchTodayLog, fetchAllLogs, ramadanDates]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isRamadanMode = useMemo(() => {
    return settings?.enabled || false;
  }, [settings]);

  const progress = useMemo(() => {
    return getRamadanProgress(currentTime, ramadanDates);
  }, [currentTime, ramadanDates]);

  const fastingStatus = useMemo(() => {
    if (!isRamadanMode || !todayLog?.imsak_time || !todayLog?.maghrib_time) {
      return null;
    }
    
    return getFastingStatus(
      currentTime,
      todayLog.imsak_time,
      todayLog.maghrib_time,
      settings?.sahur_reminder_minutes ? -settings.sahur_reminder_minutes : -60
    );
  }, [currentTime, isRamadanMode, todayLog, settings]);

  const stats = useMemo(() => {
    if (!allLogs || allLogs.length === 0) return null;
    return calculateRamadanStats(allLogs);
  }, [allLogs]);

  // ============================================
  // ACTIONS
  // ============================================

  const enableRamadanMode = useCallback(async () => {
    if (!userId) return;

    try {
      const newSettings = {
        user_id: userId,
        year: currentYear,
        enabled: true,
        ...DEFAULT_RAMADAN_SETTINGS,
      };

      const { error } = await supabase
        .from('ramadan_settings')
        .upsert(newSettings, { onConflict: 'user_id,year' });

      if (error) throw error;
      
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [supabase, userId, currentYear, fetchSettings]);

  const disableRamadanMode = useCallback(async () => {
    if (!userId || !settings) return;

    try {
      const { error } = await supabase
        .from('ramadan_settings')
        .update({ enabled: false, updated_at: new Date().toISOString() })
        .eq('id', settings.id);

      if (error) throw error;
      
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [supabase, userId, settings, fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<RamadanSettingsInput>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('ramadan_settings')
        .upsert(
          {
            user_id: userId,
            year: currentYear,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,year' }
        );

      if (error) throw error;
      
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [supabase, userId, currentYear, fetchSettings]);

  const updateTodayLog = useCallback(async (updates: Partial<RamadanDailyLogInput>) => {
    if (!userId) return;

    try {
      const fastingDay = ramadanDates 
        ? calculateFastingDay(new Date(), ramadanDates)
        : 1;

      const { error } = await supabase
        .from('ramadan_daily_log')
        .upsert(
          {
            user_id: userId,
            date: today,
            fasting_day: fastingDay,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        );

      if (error) throw error;
      
      await fetchTodayLog();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [supabase, userId, today, ramadanDates, fetchTodayLog]);

  const logSahur = useCallback(async (data: {
    calories: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    notes?: string;
  }) => {
    await updateTodayLog({
      sahur_logged: true,
      sahur_time: new Date().toISOString(),
      sahur_calories: data.calories,
      sahur_carbs: data.carbs,
      sahur_protein: data.protein,
      sahur_fat: data.fat,
      sahur_notes: data.notes,
    });
  }, [updateTodayLog]);

  const logIftar = useCallback(async (data: {
    calories: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    notes?: string;
  }) => {
    await updateTodayLog({
      iftar_logged: true,
      iftar_time: new Date().toISOString(),
      iftar_calories: data.calories,
      iftar_carbs: data.carbs,
      iftar_protein: data.protein,
      iftar_fat: data.fat,
      iftar_notes: data.notes,
    });
  }, [updateTodayLog]);

  const markFastingComplete = useCallback(async () => {
    await updateTodayLog({
      fasting_completed: true,
      fasting_broken: false,
    });
  }, [updateTodayLog]);

  const markFastingBroken = useCallback(async (reason: string) => {
    await updateTodayLog({
      fasting_completed: false,
      fasting_broken: true,
      fasting_broken_reason: reason as any,
      fasting_broken_time: new Date().toISOString(),
    });
  }, [updateTodayLog]);

  const logGlucose = useCallback(async (
    type: 'sahur' | 'midday' | 'pre_iftar' | 'post_iftar',
    value: number
  ) => {
    const updates: Partial<RamadanDailyLogInput> = {};
    
    switch (type) {
      case 'sahur':
        updates.glucose_sahur = value;
        break;
      case 'midday':
        updates.glucose_midday = value;
        break;
      case 'pre_iftar':
        updates.glucose_pre_iftar = value;
        break;
      case 'post_iftar':
        updates.glucose_post_iftar = value;
        break;
    }
    
    await updateTodayLog(updates);
  }, [updateTodayLog]);

  // ============================================
  // EFFECTS
  // ============================================

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [userId]);

  // Fetch all logs when ramadan dates are loaded
  useEffect(() => {
    if (ramadanDates && userId) {
      fetchAllLogs();
    }
  }, [ramadanDates, userId, fetchAllLogs]);

  // Update current time every minute
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval]);

  // ============================================
  // RETURN
  // ============================================

  return {
    isLoading,
    error,
    settings,
    todayLog,
    ramadanDates,
    isRamadanMode,
    progress,
    fastingStatus,
    stats,
    enableRamadanMode,
    disableRamadanMode,
    updateSettings,
    updateTodayLog,
    logSahur,
    logIftar,
    markFastingComplete,
    markFastingBroken,
    logGlucose,
    refresh,
  };
}

export default useRamadanMode;

