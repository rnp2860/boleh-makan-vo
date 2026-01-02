// lib/ramadan/prayer-times.ts
// 🕌 Prayer Times API Integration for Malaysian Cities

import { PrayerTimes, PrayerTimesResponse, JAKIM_ZONES } from '@/lib/types/ramadan';

// ============================================
// JAKIM E-SOLAT API (Official Malaysian Source)
// ============================================

const JAKIM_API_BASE = 'https://www.e-solat.gov.my/index.php';

/**
 * Fetch prayer times from JAKIM E-Solat API
 * @param zone JAKIM zone code (e.g., 'WLY01' for Kuala Lumpur)
 * @param date Date to fetch prayer times for
 */
export async function fetchJAKIMPrayerTimes(
  zone: string,
  date: Date = new Date()
): Promise<PrayerTimesResponse | null> {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // JAKIM API endpoint
    const url = `${JAKIM_API_BASE}?r=esolatApi/takwimsolat&period=date&zone=${zone}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('JAKIM API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.prayerTime || data.prayerTime.length === 0) {
      console.error('JAKIM API returned no data');
      return null;
    }

    // Find the prayer time for the requested date
    const dateStr = `${day}-${month}-${year}`;
    const dayData = data.prayerTime.find((d: any) => d.date === dateStr) || data.prayerTime[0];

    return {
      date: `${year}-${month}-${day}`,
      hijri_date: dayData.hijri || '',
      location: JAKIM_ZONES[zone] || zone,
      zone: zone,
      times: {
        imsak: dayData.imsak || '',
        subuh: dayData.fajr || '',
        syuruk: dayData.syuruk || '',
        zohor: dayData.dhuhr || '',
        asar: dayData.asr || '',
        maghrib: dayData.maghrib || '',
        isyak: dayData.isha || '',
      },
    };
  } catch (error) {
    console.error('Error fetching JAKIM prayer times:', error);
    return null;
  }
}

// ============================================
// ALADHAN API (Backup / International)
// ============================================

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

/**
 * Fetch prayer times from Aladhan API (backup source)
 * @param latitude Location latitude
 * @param longitude Location longitude
 * @param date Date to fetch prayer times for
 */
export async function fetchAladhanPrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): Promise<PrayerTimesResponse | null> {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    
    // Method 3 = Muslim World League, which works well for Malaysia
    // Method 4 = Umm Al-Qura for more conservative Imsak times
    const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-3,0,0,0,0,0,0,0`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Aladhan API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      console.error('Aladhan API returned invalid data');
      return null;
    }

    const timings = data.data.timings;
    const dateInfo = data.data.date;

    return {
      date: dateInfo.gregorian.date,
      hijri_date: `${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year}`,
      location: `${latitude}, ${longitude}`,
      zone: 'ALADHAN',
      times: {
        imsak: timings.Imsak || '',
        subuh: timings.Fajr || '',
        syuruk: timings.Sunrise || '',
        zohor: timings.Dhuhr || '',
        asar: timings.Asr || '',
        maghrib: timings.Maghrib || '',
        isyak: timings.Isha || '',
      },
    };
  } catch (error) {
    console.error('Error fetching Aladhan prayer times:', error);
    return null;
  }
}

// ============================================
// WAKTU SOLAT API (Malaysian Community API)
// ============================================

const WAKTUSOLAT_API_BASE = 'https://waktusolat.app/api/v2';

/**
 * Fetch prayer times from waktusolat.app API
 * @param zone JAKIM zone code
 * @param date Date to fetch prayer times for
 */
export async function fetchWaktuSolatPrayerTimes(
  zone: string,
  date: Date = new Date()
): Promise<PrayerTimesResponse | null> {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const url = `${WAKTUSOLAT_API_BASE}/solat/${zone}?year=${year}&month=${month}`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('WaktuSolat API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.prayers || data.prayers.length === 0) {
      return null;
    }

    // Find the prayer time for the requested date
    const day = date.getDate();
    const dayData = data.prayers.find((d: any) => d.day === day) || data.prayers[0];

    return {
      date: `${year}-${month}-${String(day).padStart(2, '0')}`,
      hijri_date: dayData.hijri || '',
      location: data.zone || zone,
      zone: zone,
      times: {
        imsak: dayData.imsak || '',
        subuh: dayData.fajr || '',
        syuruk: dayData.syuruk || '',
        zohor: dayData.dhuhr || '',
        asar: dayData.asr || '',
        maghrib: dayData.maghrib || '',
        isyak: dayData.isha || '',
      },
    };
  } catch (error) {
    console.error('Error fetching WaktuSolat prayer times:', error);
    return null;
  }
}

// ============================================
// UNIFIED PRAYER TIMES FETCHER
// ============================================

export type PrayerTimesProvider = 'jakim' | 'aladhan' | 'waktusolat';

interface FetchPrayerTimesOptions {
  zone?: string;
  latitude?: number;
  longitude?: number;
  date?: Date;
  provider?: PrayerTimesProvider;
}

/**
 * Unified function to fetch prayer times with fallback
 */
export async function fetchPrayerTimes(
  options: FetchPrayerTimesOptions
): Promise<PrayerTimesResponse | null> {
  const {
    zone = 'WLY01',
    latitude = 3.1390,
    longitude = 101.6869,
    date = new Date(),
    provider = 'jakim',
  } = options;

  let result: PrayerTimesResponse | null = null;

  // Try primary provider
  switch (provider) {
    case 'jakim':
      result = await fetchJAKIMPrayerTimes(zone, date);
      break;
    case 'waktusolat':
      result = await fetchWaktuSolatPrayerTimes(zone, date);
      break;
    case 'aladhan':
      result = await fetchAladhanPrayerTimes(latitude, longitude, date);
      break;
  }

  // Fallback chain if primary fails
  if (!result && provider !== 'waktusolat') {
    console.log('Primary API failed, trying WaktuSolat...');
    result = await fetchWaktuSolatPrayerTimes(zone, date);
  }

  if (!result && provider !== 'aladhan') {
    console.log('WaktuSolat failed, trying Aladhan...');
    result = await fetchAladhanPrayerTimes(latitude, longitude, date);
  }

  return result;
}

// ============================================
// TIME UTILITIES
// ============================================

/**
 * Parse time string (HH:MM) to Date object for today
 */
export function parseTimeToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Format time for display
 */
export function formatTime(timeStr: string, format: '12h' | '24h' = '12h'): string {
  if (!timeStr) return '--:--';
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  if (format === '24h') {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Calculate minutes until a specific time
 */
export function minutesUntil(targetTimeStr: string, fromDate: Date = new Date()): number {
  const targetDate = parseTimeToDate(targetTimeStr, fromDate);
  
  // If target time has passed today, assume it's for tomorrow
  if (targetDate < fromDate) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  
  return Math.round((targetDate.getTime() - fromDate.getTime()) / (1000 * 60));
}

/**
 * Calculate hours and minutes until a specific time
 */
export function timeUntil(targetTimeStr: string, fromDate: Date = new Date()): { hours: number; minutes: number } {
  const totalMinutes = minutesUntil(targetTimeStr, fromDate);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

/**
 * Check if current time is between two times
 */
export function isTimeBetween(
  currentTime: Date,
  startTimeStr: string,
  endTimeStr: string
): boolean {
  const startTime = parseTimeToDate(startTimeStr, currentTime);
  const endTime = parseTimeToDate(endTimeStr, currentTime);
  
  // Handle overnight ranges (e.g., 22:00 to 05:00)
  if (endTime < startTime) {
    return currentTime >= startTime || currentTime < endTime;
  }
  
  return currentTime >= startTime && currentTime < endTime;
}

/**
 * Get fasting duration in hours
 */
export function getFastingDuration(imsakTime: string, maghribTime: string): number {
  const imsak = parseTimeToDate(imsakTime);
  const maghrib = parseTimeToDate(maghribTime);
  
  const durationMs = maghrib.getTime() - imsak.getTime();
  return Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;
}

/**
 * Calculate Imsak time from Subuh with offset
 */
export function calculateImsakTime(subuhTime: string, offsetMinutes: number = -10): string {
  const subuh = parseTimeToDate(subuhTime);
  subuh.setMinutes(subuh.getMinutes() + offsetMinutes);
  
  const hours = String(subuh.getHours()).padStart(2, '0');
  const minutes = String(subuh.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

// ============================================
// PRAYER TIMES CACHE
// ============================================

interface CachedPrayerTimes {
  data: PrayerTimesResponse;
  fetchedAt: number;
  expiresAt: number;
}

const prayerTimesCache = new Map<string, CachedPrayerTimes>();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Get prayer times with caching
 */
export async function getPrayerTimesWithCache(
  options: FetchPrayerTimesOptions
): Promise<PrayerTimesResponse | null> {
  const { zone = 'WLY01', date = new Date() } = options;
  const dateStr = date.toISOString().split('T')[0];
  const cacheKey = `${zone}-${dateStr}`;
  
  // Check cache
  const cached = prayerTimesCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await fetchPrayerTimes(options);
  
  if (data) {
    prayerTimesCache.set(cacheKey, {
      data,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION_MS,
    });
  }
  
  return data;
}

/**
 * Clear prayer times cache
 */
export function clearPrayerTimesCache(): void {
  prayerTimesCache.clear();
}

/**
 * Get cache status
 */
export function getCacheStatus(): { size: number; keys: string[] } {
  return {
    size: prayerTimesCache.size,
    keys: Array.from(prayerTimesCache.keys()),
  };
}

