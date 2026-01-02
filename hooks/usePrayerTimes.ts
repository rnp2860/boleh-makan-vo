// hooks/usePrayerTimes.ts
// 🕌 React Hook for Prayer Times

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PrayerTimes,
  PrayerTimesResponse,
  MALAYSIAN_CITIES,
} from '@/lib/types/ramadan';
import {
  fetchPrayerTimes,
  getPrayerTimesWithCache,
  formatTime,
  minutesUntil,
  timeUntil,
  calculateImsakTime,
  PrayerTimesProvider,
} from '@/lib/ramadan/prayer-times';

// ============================================
// HOOK: usePrayerTimes
// ============================================

interface UsePrayerTimesOptions {
  zone?: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
  provider?: PrayerTimesProvider;
  imsakOffset?: number; // minutes before Subuh
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
}

interface UsePrayerTimesReturn {
  isLoading: boolean;
  error: string | null;
  prayerTimes: PrayerTimes | null;
  response: PrayerTimesResponse | null;
  
  // Formatted times (12h format)
  formattedTimes: {
    imsak: string;
    subuh: string;
    syuruk: string;
    zohor: string;
    asar: string;
    maghrib: string;
    isyak: string;
  } | null;
  
  // Countdown to next prayer
  nextPrayer: {
    name: string;
    name_bm: string;
    time: string;
    minutesUntil: number;
    countdown: { hours: number; minutes: number };
  } | null;
  
  // Current prayer period
  currentPeriod: {
    name: string;
    name_bm: string;
  };
  
  // Fasting specific
  imsak: string | null; // Sahur end time
  maghrib: string | null; // Iftar time
  fastingDuration: number | null; // hours
  
  // Actions
  refresh: () => Promise<void>;
  setLocation: (cityName: string) => void;
}

const PRAYER_NAMES = {
  imsak: { en: 'Imsak', bm: 'Imsak' },
  subuh: { en: 'Subuh', bm: 'Subuh' },
  syuruk: { en: 'Syuruk', bm: 'Syuruk' },
  zohor: { en: 'Zohor', bm: 'Zohor' },
  asar: { en: 'Asar', bm: 'Asar' },
  maghrib: { en: 'Maghrib', bm: 'Maghrib' },
  isyak: { en: 'Isyak', bm: 'Isyak' },
};

export function usePrayerTimes(options: UsePrayerTimesOptions = {}): UsePrayerTimesReturn {
  const {
    zone: initialZone = 'WLY01',
    latitude: initialLat,
    longitude: initialLng,
    cityName: initialCity = 'Kuala Lumpur',
    provider = 'jakim',
    imsakOffset = -10,
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PrayerTimesResponse | null>(null);
  const [zone, setZone] = useState(initialZone);
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPrayerTimesWithCache({
        zone,
        latitude,
        longitude,
        provider,
        date: new Date(),
      });

      if (result) {
        // Calculate Imsak if not provided
        if (!result.times.imsak && result.times.subuh) {
          result.times.imsak = calculateImsakTime(result.times.subuh, imsakOffset);
        }
        setResponse(result);
      } else {
        setError('Failed to fetch prayer times');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching prayer times');
    } finally {
      setIsLoading(false);
    }
  }, [zone, latitude, longitude, provider, imsakOffset]);

  const refresh = useCallback(async () => {
    await fetchTimes();
  }, [fetchTimes]);

  const setLocation = useCallback((cityName: string) => {
    const city = MALAYSIAN_CITIES[cityName];
    if (city) {
      setZone(city.zone);
      setLatitude(city.lat);
      setLongitude(city.lng);
    }
  }, []);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const prayerTimes = useMemo(() => {
    return response?.times || null;
  }, [response]);

  const formattedTimes = useMemo(() => {
    if (!prayerTimes) return null;

    return {
      imsak: formatTime(prayerTimes.imsak),
      subuh: formatTime(prayerTimes.subuh),
      syuruk: formatTime(prayerTimes.syuruk),
      zohor: formatTime(prayerTimes.zohor),
      asar: formatTime(prayerTimes.asar),
      maghrib: formatTime(prayerTimes.maghrib),
      isyak: formatTime(prayerTimes.isyak),
    };
  }, [prayerTimes]);

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Order of prayers throughout the day
    const prayerOrder: (keyof PrayerTimes)[] = [
      'imsak', 'subuh', 'syuruk', 'zohor', 'asar', 'maghrib', 'isyak'
    ];

    for (const prayer of prayerOrder) {
      const timeStr = prayerTimes[prayer];
      if (!timeStr) continue;

      const [hours, mins] = timeStr.split(':').map(Number);
      const prayerMinutes = hours * 60 + mins;

      if (prayerMinutes > currentMinutes) {
        const minsUntil = minutesUntil(timeStr, now);
        return {
          name: PRAYER_NAMES[prayer].en,
          name_bm: PRAYER_NAMES[prayer].bm,
          time: timeStr,
          minutesUntil: minsUntil,
          countdown: timeUntil(timeStr, now),
        };
      }
    }

    // If all prayers have passed, next is Imsak tomorrow
    if (prayerTimes.imsak) {
      const minsUntil = minutesUntil(prayerTimes.imsak, now);
      return {
        name: 'Imsak (Tomorrow)',
        name_bm: 'Imsak (Esok)',
        time: prayerTimes.imsak,
        minutesUntil: minsUntil,
        countdown: timeUntil(prayerTimes.imsak, now),
      };
    }

    return null;
  }, [prayerTimes, currentTime]);

  const currentPeriod = useMemo(() => {
    if (!prayerTimes) return { name: 'Unknown', name_bm: 'Tidak diketahui' };

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const getMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const imsakMins = getMinutes(prayerTimes.imsak);
    const subuhMins = getMinutes(prayerTimes.subuh);
    const syurukMins = getMinutes(prayerTimes.syuruk);
    const zohorMins = getMinutes(prayerTimes.zohor);
    const asarMins = getMinutes(prayerTimes.asar);
    const maghribMins = getMinutes(prayerTimes.maghrib);
    const isyakMins = getMinutes(prayerTimes.isyak);

    if (currentMinutes < imsakMins) {
      return { name: 'Sahur Time', name_bm: 'Waktu Sahur' };
    } else if (currentMinutes < subuhMins) {
      return { name: 'Imsak', name_bm: 'Imsak' };
    } else if (currentMinutes < syurukMins) {
      return { name: 'Subuh', name_bm: 'Subuh' };
    } else if (currentMinutes < zohorMins) {
      return { name: 'Dhuha', name_bm: 'Dhuha' };
    } else if (currentMinutes < asarMins) {
      return { name: 'Zohor', name_bm: 'Zohor' };
    } else if (currentMinutes < maghribMins) {
      return { name: 'Asar', name_bm: 'Asar' };
    } else if (currentMinutes < isyakMins) {
      return { name: 'Maghrib', name_bm: 'Maghrib' };
    } else {
      return { name: 'Isyak', name_bm: 'Isyak' };
    }
  }, [prayerTimes, currentTime]);

  const imsak = useMemo(() => prayerTimes?.imsak || null, [prayerTimes]);
  const maghrib = useMemo(() => prayerTimes?.maghrib || null, [prayerTimes]);

  const fastingDuration = useMemo(() => {
    if (!imsak || !maghrib) return null;

    const [imsakH, imsakM] = imsak.split(':').map(Number);
    const [maghribH, maghribM] = maghrib.split(':').map(Number);

    const imsakMinutes = imsakH * 60 + imsakM;
    const maghribMinutes = maghribH * 60 + maghribM;

    return Math.round(((maghribMinutes - imsakMinutes) / 60) * 10) / 10;
  }, [imsak, maghrib]);

  // ============================================
  // EFFECTS
  // ============================================

  // Initial fetch
  useEffect(() => {
    fetchTimes();
  }, [fetchTimes]);

  // Update current time every minute
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval]);

  // Refresh at midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const msUntilMidnight = midnight.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      fetchTimes();
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [fetchTimes]);

  // ============================================
  // RETURN
  // ============================================

  return {
    isLoading,
    error,
    prayerTimes,
    response,
    formattedTimes,
    nextPrayer,
    currentPeriod,
    imsak,
    maghrib,
    fastingDuration,
    refresh,
    setLocation,
  };
}

export default usePrayerTimes;

