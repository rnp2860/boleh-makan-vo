// components/ramadan/PrayerTimeCard.tsx
// 🕌 Prayer Times Display Component

'use client';

import { useMemo } from 'react';
import { 
  Moon, 
  Sun, 
  Sunrise, 
  Clock, 
  Coffee, 
  Sunset,
  ChevronRight 
} from 'lucide-react';
import { PrayerTimes, RAMADAN_LABELS } from '@/lib/types/ramadan';
import { formatTime } from '@/lib/ramadan/prayer-times';

interface PrayerTimeCardProps {
  prayerTimes: PrayerTimes;
  currentPeriod: string;
  hijriDate?: string;
  location?: string;
  lang?: 'en' | 'bm';
  className?: string;
  compact?: boolean;
}

interface PrayerTimeItem {
  key: keyof PrayerTimes;
  name: string;
  name_bm: string;
  icon: typeof Moon;
  color: string;
  isFastingRelated?: boolean;
}

const PRAYER_ITEMS: PrayerTimeItem[] = [
  { key: 'imsak', name: 'Imsak', name_bm: 'Imsak', icon: Moon, color: 'text-indigo-400', isFastingRelated: true },
  { key: 'subuh', name: 'Subuh', name_bm: 'Subuh', icon: Moon, color: 'text-purple-400' },
  { key: 'syuruk', name: 'Syuruk', name_bm: 'Syuruk', icon: Sunrise, color: 'text-orange-400' },
  { key: 'zohor', name: 'Zohor', name_bm: 'Zohor', icon: Sun, color: 'text-yellow-400' },
  { key: 'asar', name: 'Asar', name_bm: 'Asar', icon: Sun, color: 'text-amber-400' },
  { key: 'maghrib', name: 'Maghrib', name_bm: 'Maghrib', icon: Sunset, color: 'text-red-400', isFastingRelated: true },
  { key: 'isyak', name: 'Isyak', name_bm: 'Isyak', icon: Moon, color: 'text-blue-400' },
];

export default function PrayerTimeCard({
  prayerTimes,
  currentPeriod,
  hijriDate,
  location,
  lang = 'en',
  className = '',
  compact = false,
}: PrayerTimeCardProps) {
  const labels = RAMADAN_LABELS[lang];

  // Filter for compact view (only fasting-related times)
  const displayItems = useMemo(() => {
    if (compact) {
      return PRAYER_ITEMS.filter(item => item.isFastingRelated);
    }
    return PRAYER_ITEMS;
  }, [compact]);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {lang === 'en' ? 'Prayer Times' : 'Waktu Solat'}
            </h3>
            {hijriDate && (
              <p className="text-sm opacity-90">{hijriDate}</p>
            )}
          </div>
          {location && (
            <div className="text-right">
              <p className="text-sm font-medium">{location}</p>
              <p className="text-xs opacity-80">
                {lang === 'en' ? 'Current: ' : 'Sekarang: '}{currentPeriod}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {displayItems.map((item) => {
          const time = prayerTimes[item.key];
          const Icon = item.icon;
          const isActive = currentPeriod.toLowerCase().includes(item.key);
          const isFastingTime = item.isFastingRelated;

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-4 transition-colors
                ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}
                ${isFastingTime ? 'border-l-4 border-emerald-500' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className={`font-medium ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {lang === 'en' ? item.name : item.name_bm}
                  </p>
                  {isFastingTime && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.key === 'imsak' 
                        ? (lang === 'en' ? 'End of Sahur' : 'Tamat Sahur')
                        : (lang === 'en' ? 'Iftar Time' : 'Waktu Berbuka')
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-mono text-lg ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                  {formatTime(time)}
                </span>
                {isActive && (
                  <ChevronRight className="w-5 h-5 text-emerald-500 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact View - Show full times link */}
      {compact && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center">
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            {lang === 'en' ? 'View all prayer times →' : 'Lihat semua waktu solat →'}
          </button>
        </div>
      )}
    </div>
  );
}

// Inline component for quick display
export function QuickPrayerTimes({
  imsakTime,
  maghribTime,
  lang = 'en',
}: {
  imsakTime: string;
  maghribTime: string;
  lang?: 'en' | 'bm';
}) {
  return (
    <div className="flex items-center justify-center gap-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
      <div className="text-center">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
          <Moon className="w-4 h-4" />
          <span className="text-xs font-medium">
            {lang === 'en' ? 'Imsak' : 'Imsak'}
          </span>
        </div>
        <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">
          {formatTime(imsakTime)}
        </span>
      </div>
      
      <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
      
      <div className="text-center">
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
          <Sunset className="w-4 h-4" />
          <span className="text-xs font-medium">
            {lang === 'en' ? 'Maghrib' : 'Maghrib'}
          </span>
        </div>
        <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">
          {formatTime(maghribTime)}
        </span>
      </div>
    </div>
  );
}

