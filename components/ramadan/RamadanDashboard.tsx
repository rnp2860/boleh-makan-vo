// components/ramadan/RamadanDashboard.tsx
// 🌙 Main Ramadan Dashboard Component

'use client';

import { useState, useMemo } from 'react';
import { 
  Moon, 
  Settings, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Activity,
  ChevronRight,
} from 'lucide-react';
import FastingCountdown from './FastingCountdown';
import PrayerTimeCard, { QuickPrayerTimes } from './PrayerTimeCard';
import RamadanStatsComponent from './RamadanStats';
import SahurIftarGuide, { IftarReminder } from './SahurIftarGuide';
import { 
  RamadanSettings,
  RamadanDailyLog,
  FastingStatus,
  RamadanProgress,
  RamadanStats,
  RAMADAN_LABELS,
} from '@/lib/types/ramadan';
import { PrayerTimes } from '@/lib/types/ramadan';
import { getFastingMotivation } from '@/lib/ramadan/fasting-utils';

interface RamadanDashboardProps {
  settings: RamadanSettings;
  todayLog: RamadanDailyLog | null;
  prayerTimes: PrayerTimes | null;
  fastingStatus: FastingStatus | null;
  progress: RamadanProgress;
  stats: RamadanStats | null;
  onLogSahur: () => void;
  onLogIftar: () => void;
  onLogGlucose: (type: 'sahur' | 'midday' | 'pre_iftar' | 'post_iftar') => void;
  onMarkFastingComplete: () => void;
  onMarkFastingBroken: (reason: string) => void;
  onOpenSettings: () => void;
  lang?: 'en' | 'bm';
  className?: string;
}

export default function RamadanDashboard({
  settings,
  todayLog,
  prayerTimes,
  fastingStatus,
  progress,
  stats,
  onLogSahur,
  onLogIftar,
  onLogGlucose,
  onMarkFastingComplete,
  onMarkFastingBroken,
  onOpenSettings,
  lang = 'en',
  className = '',
}: RamadanDashboardProps) {
  const [showIftarReminder, setShowIftarReminder] = useState(true);
  const labels = RAMADAN_LABELS[lang];

  // Motivation message
  const motivationMessage = useMemo(() => {
    if (!fastingStatus) return '';
    return getFastingMotivation(progress, fastingStatus, lang);
  }, [progress, fastingStatus, lang]);

  // Determine if we should show iftar reminder
  const shouldShowIftarReminder = useMemo(() => {
    if (!fastingStatus || !showIftarReminder) return false;
    return fastingStatus.currentMealWindow === 'iftar' && !todayLog?.iftar_logged;
  }, [fastingStatus, showIftarReminder, todayLog]);

  // Quick actions based on current window
  const quickActions = useMemo(() => {
    if (!fastingStatus) return [];

    const actions: { label: string; action: () => void; icon: typeof Moon; color: string }[] = [];

    switch (fastingStatus.currentMealWindow) {
      case 'sahur':
        if (!todayLog?.sahur_logged) {
          actions.push({
            label: lang === 'en' ? 'Log Sahur' : 'Log Sahur',
            action: onLogSahur,
            icon: Moon,
            color: 'bg-purple-600',
          });
        }
        actions.push({
          label: lang === 'en' ? 'Log Glucose' : 'Log Glukosa',
          action: () => onLogGlucose('sahur'),
          icon: Activity,
          color: 'bg-blue-600',
        });
        break;

      case 'fasting':
        actions.push({
          label: lang === 'en' ? 'Check Glucose' : 'Semak Glukosa',
          action: () => onLogGlucose('midday'),
          icon: Activity,
          color: 'bg-blue-600',
        });
        break;

      case 'iftar':
        if (!todayLog?.iftar_logged) {
          actions.push({
            label: lang === 'en' ? 'Log Iftar' : 'Log Berbuka',
            action: onLogIftar,
            icon: Moon,
            color: 'bg-orange-600',
          });
        }
        if (!todayLog?.fasting_completed && todayLog?.iftar_logged) {
          actions.push({
            label: lang === 'en' ? 'Complete Fast' : 'Selesai Puasa',
            action: onMarkFastingComplete,
            icon: CheckCircle,
            color: 'bg-green-600',
          });
        }
        break;

      case 'night':
        if (!todayLog?.fasting_completed && todayLog?.iftar_logged) {
          actions.push({
            label: lang === 'en' ? 'Complete Fast' : 'Selesai Puasa',
            action: onMarkFastingComplete,
            icon: CheckCircle,
            color: 'bg-green-600',
          });
        }
        break;
    }

    return actions;
  }, [fastingStatus, todayLog, onLogSahur, onLogIftar, onLogGlucose, onMarkFastingComplete, lang]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Moon className="w-7 h-7 text-emerald-500" />
            {labels.ramadanMubarak}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? `Day ${progress.currentDay} of ${progress.totalDays}`
              : `${labels.dayOf} ${progress.currentDay} daripada ${progress.totalDays}`
            }
          </p>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Motivation Message */}
      {motivationMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">
            {motivationMessage}
          </p>
        </div>
      )}

      {/* Iftar Reminder */}
      {shouldShowIftarReminder && (
        <IftarReminder 
          lang={lang} 
          onDismiss={() => setShowIftarReminder(false)} 
        />
      )}

      {/* Fasting Countdown */}
      {fastingStatus && prayerTimes && (
        <FastingCountdown
          fastingStatus={fastingStatus}
          imsakTime={prayerTimes.imsak}
          maghribTime={prayerTimes.maghrib}
          lang={lang}
        />
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-xl flex items-center justify-between hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}

      {/* Today's Status */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          {lang === 'en' ? 'Today\'s Status' : 'Status Hari Ini'}
        </h3>
        
        <div className="space-y-3">
          {/* Sahur Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-500" />
              <span className="text-slate-600 dark:text-slate-300">
                {lang === 'en' ? 'Sahur' : 'Sahur'}
              </span>
            </div>
            {todayLog?.sahur_logged ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{todayLog.sahur_calories} kcal</span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">
                {lang === 'en' ? 'Not logged' : 'Belum dilog'}
              </span>
            )}
          </div>

          {/* Iftar Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-orange-500" />
              <span className="text-slate-600 dark:text-slate-300">
                {lang === 'en' ? 'Iftar' : 'Berbuka'}
              </span>
            </div>
            {todayLog?.iftar_logged ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{todayLog.iftar_calories} kcal</span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">
                {lang === 'en' ? 'Not logged' : 'Belum dilog'}
              </span>
            )}
          </div>

          {/* Fasting Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">
                {lang === 'en' ? 'Fasting' : 'Puasa'}
              </span>
            </div>
            {todayLog?.fasting_broken ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{labels.fastingBroken}</span>
              </div>
            ) : todayLog?.fasting_completed ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{labels.fastingComplete}</span>
              </div>
            ) : (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                {lang === 'en' ? 'In progress' : 'Sedang berjalan'}
              </span>
            )}
          </div>

          {/* Glucose Readings */}
          {(todayLog?.glucose_sahur || todayLog?.glucose_midday || todayLog?.glucose_post_iftar) && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {lang === 'en' ? 'Glucose Readings' : 'Bacaan Glukosa'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {todayLog?.glucose_sahur && (
                  <div>
                    <p className="text-xs text-slate-500">Sahur</p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {todayLog.glucose_sahur}
                    </p>
                  </div>
                )}
                {todayLog?.glucose_midday && (
                  <div>
                    <p className="text-xs text-slate-500">
                      {lang === 'en' ? 'Midday' : 'T.Hari'}
                    </p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {todayLog.glucose_midday}
                    </p>
                  </div>
                )}
                {todayLog?.glucose_post_iftar && (
                  <div>
                    <p className="text-xs text-slate-500">
                      {lang === 'en' ? 'Post-Iftar' : 'Selepas'}
                    </p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {todayLog.glucose_post_iftar}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prayer Times */}
      {prayerTimes && (
        <QuickPrayerTimes
          imsakTime={prayerTimes.imsak}
          maghribTime={prayerTimes.maghrib}
          lang={lang}
        />
      )}

      {/* Meal Guide based on current window */}
      {fastingStatus && (
        <SahurIftarGuide
          mealType={fastingStatus.currentMealWindow === 'sahur' ? 'sahur' : 'iftar'}
          hasDiabetes={true}
          lang={lang}
          onLogMeal={fastingStatus.currentMealWindow === 'sahur' ? onLogSahur : onLogIftar}
        />
      )}

      {/* Statistics */}
      {stats && (
        <RamadanStatsComponent
          stats={stats}
          progress={progress}
          lang={lang}
        />
      )}
    </div>
  );
}

