// app/ramadan/page.tsx
// 🌙 Ramadan Mode Main Page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, ArrowLeft, Settings, AlertCircle } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import RamadanDashboard from '@/components/ramadan/RamadanDashboard';
import { useRamadanMode } from '@/hooks/useRamadanMode';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useFood } from '@/context/FoodContext';

export default function RamadanPage() {
  const router = useRouter();
  const { userId } = useFood();
  const [lang, setLang] = useState<'en' | 'bm'>('en');

  // Ramadan mode hook
  const {
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
    logSahur,
    logIftar,
    markFastingComplete,
    markFastingBroken,
    logGlucose,
    updateTodayLog,
  } = useRamadanMode({ userId });

  // Prayer times hook
  const {
    prayerTimes,
    isLoading: prayerTimesLoading,
    error: prayerTimesError,
  } = usePrayerTimes({
    zone: settings?.location_zone || 'WLY01',
    imsakOffset: settings?.imsak_offset_minutes || -10,
  });

  // Update today's log with prayer times
  useEffect(() => {
    if (prayerTimes && userId && progress.isRamadan) {
      updateTodayLog({
        imsak_time: prayerTimes.imsak,
        subuh_time: prayerTimes.subuh,
        maghrib_time: prayerTimes.maghrib,
        isyak_time: prayerTimes.isyak,
      });
    }
  }, [prayerTimes, userId, progress.isRamadan]);

  // Handle meal logging with modal (simplified for now)
  const handleLogSahur = async () => {
    // TODO: Open meal logging modal
    // For now, just log a placeholder
    const calories = prompt('Enter sahur calories:');
    if (calories) {
      await logSahur({ calories: parseInt(calories) });
    }
  };

  const handleLogIftar = async () => {
    const calories = prompt('Enter iftar calories:');
    if (calories) {
      await logIftar({ calories: parseInt(calories) });
    }
  };

  const handleLogGlucose = async (type: 'sahur' | 'midday' | 'pre_iftar' | 'post_iftar') => {
    const value = prompt(`Enter glucose reading (mmol/L):`);
    if (value) {
      await logGlucose(type, parseFloat(value));
    }
  };

  const handleMarkFastingBroken = async () => {
    const reason = prompt('Why was fasting broken? (medical/travel/illness/other)');
    if (reason) {
      await markFastingBroken(reason);
    }
  };

  // Loading state
  if (isLoading || prayerTimesLoading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Moon className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
            <p className="text-slate-500">Loading Ramadan Mode...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Not in Ramadan mode - show enable option
  if (!isRamadanMode) {
    return (
      <MobileLayout>
        <div className="min-h-screen p-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Ramadan Mode</h1>
          </div>

          {/* Enable Ramadan Mode Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
            <Moon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ramadan Mubarak! 🌙</h2>
            <p className="opacity-90 mb-6">
              Enable Ramadan Mode for fasting-focused tracking, prayer time reminders, 
              and specialized meal guidance for diabetics.
            </p>

            {progress.isRamadan ? (
              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <p className="text-sm opacity-90">
                  Ramadan {progress.ramadanDates?.year} is active!
                </p>
                <p className="font-bold">
                  Day {progress.currentDay} of {progress.totalDays} • {progress.daysRemaining} days remaining
                </p>
              </div>
            ) : (
              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <p className="text-sm opacity-90">
                  Ramadan {ramadanDates?.year || new Date().getFullYear()} starts:
                </p>
                <p className="font-bold">
                  {ramadanDates?.start_date || 'Loading...'}
                </p>
              </div>
            )}

            <button
              onClick={enableRamadanMode}
              className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              Enable Ramadan Mode
            </button>
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">
              Features Include:
            </h3>
            
            {[
              { icon: '🕌', title: 'Prayer Times', desc: 'Accurate times for your location' },
              { icon: '⏰', title: 'Fasting Countdown', desc: 'Time until Iftar/Sahur' },
              { icon: '📊', title: 'Glucose Tracking', desc: 'Fasting-specific monitoring' },
              { icon: '🍽️', title: 'Meal Guidance', desc: 'Sahur & Iftar recommendations' },
              { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss Sahur or Iftar' },
              { icon: '📈', title: 'Ramadan Stats', desc: 'Track your fasting progress' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{feature.title}</p>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Error state
  if (error || prayerTimesError) {
    return (
      <MobileLayout>
        <div className="min-h-screen p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Error loading Ramadan data</p>
            </div>
            <p className="text-sm text-red-500 mt-2">{error || prayerTimesError}</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Main Ramadan Dashboard
  return (
    <MobileLayout>
      <div className="min-h-screen p-4 pb-24">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md text-sm ${
                lang === 'en' 
                  ? 'bg-white dark:bg-slate-600 shadow' 
                  : 'text-slate-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('bm')}
              className={`px-3 py-1 rounded-md text-sm ${
                lang === 'bm' 
                  ? 'bg-white dark:bg-slate-600 shadow' 
                  : 'text-slate-500'
              }`}
            >
              BM
            </button>
          </div>
        </div>

        {/* Dashboard */}
        {settings && (
          <RamadanDashboard
            settings={settings}
            todayLog={todayLog}
            prayerTimes={prayerTimes}
            fastingStatus={fastingStatus}
            progress={progress}
            stats={stats}
            onLogSahur={handleLogSahur}
            onLogIftar={handleLogIftar}
            onLogGlucose={handleLogGlucose}
            onMarkFastingComplete={markFastingComplete}
            onMarkFastingBroken={handleMarkFastingBroken}
            onOpenSettings={() => router.push('/ramadan/settings')}
            lang={lang}
          />
        )}
      </div>
    </MobileLayout>
  );
}

