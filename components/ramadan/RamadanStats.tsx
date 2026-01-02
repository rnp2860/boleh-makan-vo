// components/ramadan/RamadanStats.tsx
// 📊 Ramadan Statistics Component

'use client';

import { useMemo } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Droplets, 
  Activity,
  Calendar,
  AlertCircle,
  Trophy,
  Target
} from 'lucide-react';
import { RamadanStats, RamadanProgress } from '@/lib/types/ramadan';

interface RamadanStatsProps {
  stats: RamadanStats;
  progress: RamadanProgress;
  lang?: 'en' | 'bm';
  className?: string;
}

interface StatCardProps {
  icon: typeof Flame;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, subValue, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-white/20`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          {subValue && (
            <p className="text-xs opacity-70">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RamadanStatsComponent({
  stats,
  progress,
  lang = 'en',
  className = '',
}: RamadanStatsProps) {
  const labels = useMemo(() => ({
    en: {
      yourProgress: 'Your Ramadan Progress',
      daysCompleted: 'Days Completed',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      avgGlucose: 'Avg Glucose (Fasting)',
      avgCalories: 'Avg Daily Calories',
      waterIntake: 'Avg Water Intake',
      energyLevel: 'Avg Energy',
      qadaDays: 'Qada Days Owed',
      fastingCompleted: 'fasting completed',
      daysBroken: 'days broken',
      days: 'days',
      liters: 'L/day',
      kcal: 'kcal/day',
      mmolL: 'mmol/L',
      outOf: 'out of',
    },
    bm: {
      yourProgress: 'Kemajuan Ramadan Anda',
      daysCompleted: 'Hari Selesai',
      currentStreak: 'Streak Semasa',
      longestStreak: 'Streak Terpanjang',
      avgGlucose: 'Purata Glukosa (Puasa)',
      avgCalories: 'Purata Kalori Harian',
      waterIntake: 'Purata Pengambilan Air',
      energyLevel: 'Purata Tenaga',
      qadaDays: 'Qada Yang Perlu',
      fastingCompleted: 'puasa selesai',
      daysBroken: 'hari batal',
      days: 'hari',
      liters: 'L/hari',
      kcal: 'kcal/hari',
      mmolL: 'mmol/L',
      outOf: 'daripada',
    },
  }), []);

  const t = labels[lang];

  // Calculate completion percentage
  const completionPercent = progress.totalDays > 0 
    ? Math.round((stats.daysCompleted / progress.totalDays) * 100)
    : 0;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header with Progress Ring */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <h3 className="font-semibold text-lg mb-4">{t.yourProgress}</h3>
        
        <div className="flex items-center justify-between">
          {/* Progress Ring */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/20"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${completionPercent * 2.51} 251`}
                className="text-white"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{stats.daysCompleted}</span>
              <span className="text-xs opacity-80">/{progress.totalDays}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 justify-end">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-sm">{stats.currentStreak} {t.days} streak</span>
            </div>
            {stats.daysBroken > 0 && (
              <div className="flex items-center gap-2 justify-end">
                <AlertCircle className="w-4 h-4 text-red-300" />
                <span className="text-sm">{stats.daysBroken} {t.daysBroken}</span>
              </div>
            )}
            {stats.qadaDaysOwed > 0 && (
              <div className="flex items-center gap-2 justify-end">
                <Calendar className="w-4 h-4 text-orange-300" />
                <span className="text-sm">{stats.qadaDaysOwed} qada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {/* Current Streak */}
        <StatCard
          icon={Flame}
          label={t.currentStreak}
          value={stats.currentStreak}
          subValue={t.days}
          color="text-orange-500"
          bgColor="bg-orange-50 dark:bg-orange-900/20"
        />

        {/* Longest Streak */}
        <StatCard
          icon={Trophy}
          label={t.longestStreak}
          value={stats.longestStreak}
          subValue={t.days}
          color="text-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-900/20"
        />

        {/* Average Glucose */}
        {stats.averageGlucoseFasting !== null && (
          <StatCard
            icon={Activity}
            label={t.avgGlucose}
            value={stats.averageGlucoseFasting.toFixed(1)}
            subValue={t.mmolL}
            color="text-blue-500"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />
        )}

        {/* Average Calories */}
        {stats.averageCaloriesPerDay > 0 && (
          <StatCard
            icon={Target}
            label={t.avgCalories}
            value={stats.averageCaloriesPerDay}
            subValue={t.kcal}
            color="text-purple-500"
            bgColor="bg-purple-50 dark:bg-purple-900/20"
          />
        )}

        {/* Water Intake */}
        {stats.averageWaterIntake > 0 && (
          <StatCard
            icon={Droplets}
            label={t.waterIntake}
            value={stats.averageWaterIntake.toFixed(1)}
            subValue={t.liters}
            color="text-cyan-500"
            bgColor="bg-cyan-50 dark:bg-cyan-900/20"
          />
        )}

        {/* Energy Level */}
        {stats.averageEnergyLevel !== null && (
          <StatCard
            icon={TrendingUp}
            label={t.energyLevel}
            value={`${stats.averageEnergyLevel.toFixed(1)}/5`}
            color="text-green-500"
            bgColor="bg-green-50 dark:bg-green-900/20"
          />
        )}
      </div>

      {/* Qada Reminder */}
      {stats.qadaDaysOwed > 0 && (
        <div className="mx-4 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {lang === 'en' 
                  ? `${stats.qadaDaysOwed} Qada Days to Replace`
                  : `${stats.qadaDaysOwed} Hari Qada Perlu Diganti`
                }
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {lang === 'en'
                  ? 'Replace before next Ramadan'
                  : 'Ganti sebelum Ramadan seterusnya'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

