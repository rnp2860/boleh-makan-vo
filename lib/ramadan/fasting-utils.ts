// lib/ramadan/fasting-utils.ts
// 🌙 Fasting Utilities for Ramadan Mode

import { 
  RamadanDates, 
  RamadanDailyLog, 
  RamadanSettings,
  FastingStatus,
  RamadanStats,
  RamadanProgress,
  FastingBrokenReason,
  RAMADAN_LABELS
} from '@/lib/types/ramadan';
import { 
  parseTimeToDate, 
  minutesUntil, 
  isTimeBetween, 
  getFastingDuration 
} from './prayer-times';

// ============================================
// RAMADAN DATE UTILITIES
// ============================================

/**
 * Check if a date falls within Ramadan
 */
export function isDateInRamadan(date: Date, ramadanDates: RamadanDates): boolean {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(ramadanDates.start_date);
  const endDate = new Date(ramadanDates.end_date);
  
  return checkDate >= startDate && checkDate <= endDate;
}

/**
 * Check if today is Eid
 */
export function isEidDay(date: Date, ramadanDates: RamadanDates): boolean {
  const checkDate = date.toISOString().split('T')[0];
  return checkDate === ramadanDates.eid_date;
}

/**
 * Calculate the fasting day number (1-30)
 */
export function calculateFastingDay(date: Date, ramadanDates: RamadanDates): number {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(ramadanDates.start_date);
  startDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(1, Math.min(30, diffDays + 1));
}

/**
 * Get Ramadan progress
 */
export function getRamadanProgress(
  date: Date,
  ramadanDates: RamadanDates | null
): RamadanProgress {
  if (!ramadanDates) {
    return {
      currentDay: 0,
      totalDays: 30,
      percentComplete: 0,
      daysRemaining: 30,
      isRamadan: false,
      isEid: false,
      ramadanDates: null,
    };
  }

  const isRamadan = isDateInRamadan(date, ramadanDates);
  const isEid = isEidDay(date, ramadanDates);
  
  if (!isRamadan) {
    const startDate = new Date(ramadanDates.start_date);
    const daysUntilRamadan = Math.ceil((startDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      currentDay: 0,
      totalDays: 30,
      percentComplete: 0,
      daysRemaining: daysUntilRamadan > 0 ? daysUntilRamadan : 0,
      isRamadan: false,
      isEid,
      ramadanDates,
    };
  }

  const currentDay = calculateFastingDay(date, ramadanDates);
  const totalDays = 30;
  const percentComplete = Math.round((currentDay / totalDays) * 100);
  const daysRemaining = totalDays - currentDay;

  return {
    currentDay,
    totalDays,
    percentComplete,
    daysRemaining,
    isRamadan: true,
    isEid,
    ramadanDates,
  };
}

// ============================================
// FASTING STATUS UTILITIES
// ============================================

/**
 * Determine current fasting status
 */
export function getFastingStatus(
  currentTime: Date,
  imsakTime: string,
  maghribTime: string,
  sahurStartOffset: number = -60 // 1 hour before imsak
): FastingStatus {
  const now = currentTime;
  const currentHour = now.getHours();
  const currentMinutes = currentHour * 60 + now.getMinutes();
  
  // Parse times
  const [imsakHour, imsakMin] = imsakTime.split(':').map(Number);
  const [maghribHour, maghribMin] = maghribTime.split(':').map(Number);
  
  const imsakMinutes = imsakHour * 60 + imsakMin;
  const maghribMinutes = maghribHour * 60 + maghribMin;
  const sahurStartMinutes = imsakMinutes + sahurStartOffset;
  
  // Calculate fasting duration
  const fastingDuration = getFastingDuration(imsakTime, maghribTime);
  
  // Determine current meal window
  let currentMealWindow: 'sahur' | 'fasting' | 'iftar' | 'night';
  let isFasting: boolean;
  let nextMeal: 'sahur' | 'iftar';
  let timeUntilNextMeal: number;
  let timeUntilImsak: number | null = null;
  let timeUntilMaghrib: number | null = null;
  let fastingProgress = 0;
  
  // Night time (after Isyak until midnight)
  if (currentMinutes >= maghribMinutes + 180 || currentMinutes < sahurStartMinutes) {
    // After dinner / Night
    if (currentMinutes < sahurStartMinutes) {
      currentMealWindow = 'night';
      isFasting = false;
      nextMeal = 'sahur';
      timeUntilNextMeal = sahurStartMinutes - currentMinutes;
    } else {
      currentMealWindow = 'night';
      isFasting = false;
      nextMeal = 'sahur';
      // Calculate time until sahur (next day)
      timeUntilNextMeal = (24 * 60 - currentMinutes) + sahurStartMinutes;
    }
  }
  // Sahur window (1 hour before imsak until imsak)
  else if (currentMinutes >= sahurStartMinutes && currentMinutes < imsakMinutes) {
    currentMealWindow = 'sahur';
    isFasting = false;
    nextMeal = 'iftar';
    timeUntilNextMeal = maghribMinutes - currentMinutes;
    timeUntilImsak = imsakMinutes - currentMinutes;
  }
  // Fasting period (imsak until maghrib)
  else if (currentMinutes >= imsakMinutes && currentMinutes < maghribMinutes) {
    currentMealWindow = 'fasting';
    isFasting = true;
    nextMeal = 'iftar';
    timeUntilNextMeal = maghribMinutes - currentMinutes;
    timeUntilMaghrib = maghribMinutes - currentMinutes;
    
    // Calculate fasting progress
    const fastingElapsed = currentMinutes - imsakMinutes;
    const totalFastingMinutes = maghribMinutes - imsakMinutes;
    fastingProgress = Math.round((fastingElapsed / totalFastingMinutes) * 100);
  }
  // Iftar window (maghrib until ~3 hours after)
  else {
    currentMealWindow = 'iftar';
    isFasting = false;
    nextMeal = 'sahur';
    // Calculate time until sahur (next day)
    timeUntilNextMeal = (24 * 60 - currentMinutes) + sahurStartMinutes;
    fastingProgress = 100;
  }
  
  return {
    isFasting,
    currentMealWindow,
    nextMeal,
    timeUntilNextMeal,
    timeUntilImsak,
    timeUntilMaghrib,
    fastingDuration,
    fastingProgress,
  };
}

/**
 * Format countdown display
 */
export function formatCountdown(minutes: number): string {
  if (minutes < 0) return '00:00';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

/**
 * Format countdown with hours:minutes:seconds
 */
export function formatCountdownDetailed(minutes: number): { hours: string; minutes: string } {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(mins).padStart(2, '0'),
  };
}

// ============================================
// STATISTICS UTILITIES
// ============================================

/**
 * Calculate Ramadan statistics
 */
export function calculateRamadanStats(
  logs: RamadanDailyLog[],
  qadaDaysOwed: number = 0
): RamadanStats {
  if (!logs || logs.length === 0) {
    return {
      totalDaysFasted: 0,
      daysCompleted: 0,
      daysBroken: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageGlucoseFasting: null,
      averageGlucosePostIftar: null,
      averageCaloriesPerDay: 0,
      averageWaterIntake: 0,
      averageEnergyLevel: null,
      qadaDaysOwed,
    };
  }

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalDaysFasted = sortedLogs.length;
  const daysCompleted = sortedLogs.filter(l => l.fasting_completed).length;
  const daysBroken = sortedLogs.filter(l => l.fasting_broken).length;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const log of sortedLogs) {
    if (log.fasting_completed && !log.fasting_broken) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Current streak (from most recent)
  for (let i = sortedLogs.length - 1; i >= 0; i--) {
    if (sortedLogs[i].fasting_completed && !sortedLogs[i].fasting_broken) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate averages
  const glucoseFastingValues = sortedLogs
    .filter(l => l.glucose_midday !== null)
    .map(l => l.glucose_midday!);
  
  const glucosePostIftarValues = sortedLogs
    .filter(l => l.glucose_post_iftar !== null)
    .map(l => l.glucose_post_iftar!);
  
  const calorieValues = sortedLogs
    .filter(l => l.total_calories !== null)
    .map(l => l.total_calories!);
  
  const waterValues = sortedLogs
    .filter(l => l.water_intake_liters !== null)
    .map(l => l.water_intake_liters!);
  
  const energyValues = sortedLogs
    .filter(l => l.energy_level !== null)
    .map(l => l.energy_level!);

  const average = (arr: number[]): number | null => 
    arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null;

  return {
    totalDaysFasted,
    daysCompleted,
    daysBroken,
    currentStreak,
    longestStreak,
    averageGlucoseFasting: average(glucoseFastingValues),
    averageGlucosePostIftar: average(glucosePostIftarValues),
    averageCaloriesPerDay: Math.round(average(calorieValues) || 0),
    averageWaterIntake: average(waterValues) || 0,
    averageEnergyLevel: average(energyValues),
    qadaDaysOwed: qadaDaysOwed + daysBroken,
  };
}

// ============================================
// FASTING BROKEN REASONS
// ============================================

export const FASTING_BROKEN_REASONS: Record<FastingBrokenReason, { en: string; bm: string }> = {
  medical: {
    en: 'Medical emergency',
    bm: 'Kecemasan perubatan',
  },
  travel: {
    en: 'Traveling (Musafir)',
    bm: 'Musafir',
  },
  illness: {
    en: 'Illness',
    bm: 'Sakit',
  },
  menstruation: {
    en: 'Menstruation',
    bm: 'Haid',
  },
  pregnancy: {
    en: 'Pregnancy',
    bm: 'Mengandung',
  },
  breastfeeding: {
    en: 'Breastfeeding',
    bm: 'Menyusukan anak',
  },
  elderly: {
    en: 'Elderly/Weak',
    bm: 'Tua/Lemah',
  },
  other: {
    en: 'Other reason',
    bm: 'Sebab lain',
  },
};

// ============================================
// GLUCOSE UTILITIES FOR RAMADAN
// ============================================

/**
 * Check if glucose reading is within safe fasting range
 */
export function isGlucoseSafeForFasting(
  glucoseValue: number,
  settings: RamadanSettings
): { safe: boolean; level: 'low' | 'normal' | 'high' | 'critical'; message: string; message_bm: string } {
  const { glucose_alert_low, glucose_alert_high, glucose_target_fasting } = settings;

  if (glucoseValue < glucose_alert_low) {
    return {
      safe: false,
      level: 'critical',
      message: 'DANGER: Blood sugar too low! Consider breaking fast immediately.',
      message_bm: 'BAHAYA: Gula darah terlalu rendah! Pertimbangkan untuk berbuka segera.',
    };
  }

  if (glucoseValue > glucose_alert_high) {
    return {
      safe: true, // Can continue fasting but needs attention
      level: 'high',
      message: 'Caution: Blood sugar is elevated. Monitor closely.',
      message_bm: 'Perhatian: Gula darah tinggi. Pantau dengan teliti.',
    };
  }

  if (glucoseValue < glucose_target_fasting - 1) {
    return {
      safe: true,
      level: 'low',
      message: 'Blood sugar is on the lower side. Rest if feeling weak.',
      message_bm: 'Gula darah agak rendah. Berehat jika berasa lemah.',
    };
  }

  return {
    safe: true,
    level: 'normal',
    message: 'Blood sugar is within target range. Keep fasting!',
    message_bm: 'Gula darah dalam julat sasaran. Teruskan berpuasa!',
  };
}

/**
 * Get glucose checking recommendations during Ramadan
 */
export function getGlucoseCheckRecommendations(
  currentMealWindow: 'sahur' | 'fasting' | 'iftar' | 'night'
): { when: string; when_bm: string; reason: string; reason_bm: string }[] {
  const recommendations = [
    {
      when: 'Before Sahur',
      when_bm: 'Sebelum Sahur',
      reason: 'Baseline reading to start the fast',
      reason_bm: 'Bacaan asas untuk memulakan puasa',
    },
    {
      when: 'Midday (10-11 AM)',
      when_bm: 'Tengah hari (10-11 pagi)',
      reason: 'Check if glucose is stable during fast',
      reason_bm: 'Semak jika glukosa stabil semasa puasa',
    },
    {
      when: 'Before Iftar',
      when_bm: 'Sebelum Berbuka',
      reason: 'Ensure safe to continue and prepare for iftar',
      reason_bm: 'Pastikan selamat untuk teruskan dan bersedia berbuka',
    },
    {
      when: '2 hours after Iftar',
      when_bm: '2 jam selepas Berbuka',
      reason: 'Monitor post-meal glucose spike',
      reason_bm: 'Pantau lonjakan glukosa selepas makan',
    },
  ];

  return recommendations;
}

// ============================================
// MESSAGE TEMPLATES
// ============================================

/**
 * Get motivational message based on fasting progress
 */
export function getFastingMotivation(
  progress: RamadanProgress,
  fastingStatus: FastingStatus,
  lang: 'en' | 'bm' = 'en'
): string {
  const messages = {
    en: {
      earlyFast: `Day ${progress.currentDay} of Ramadan. Stay strong! ${fastingStatus.fastingProgress}% through today's fast.`,
      midFast: `Halfway through! Only ${formatCountdown(fastingStatus.timeUntilMaghrib || 0)} until Iftar.`,
      nearIftar: `Almost there! Just ${formatCountdown(fastingStatus.timeUntilMaghrib || 0)} until Iftar. You've got this!`,
      iftar: `Alhamdulillah! Time for Iftar. Remember to break fast with dates and water.`,
      sahur: `Sahur time! ${formatCountdown(fastingStatus.timeUntilImsak || 0)} until Imsak. Eat well!`,
      night: `Rest well! Sahur starts in ${formatCountdown(fastingStatus.timeUntilNextMeal)}.`,
      lastDays: `The blessed last 10 nights of Ramadan. Increase your ibadah!`,
      eid: `Eid Mubarak! 🌙 Selamat Hari Raya!`,
    },
    bm: {
      earlyFast: `Hari ${progress.currentDay} Ramadan. Teruskan! ${fastingStatus.fastingProgress}% puasa hari ini.`,
      midFast: `Separuh sudah! Hanya ${formatCountdown(fastingStatus.timeUntilMaghrib || 0)} lagi untuk berbuka.`,
      nearIftar: `Hampir sampai! Hanya ${formatCountdown(fastingStatus.timeUntilMaghrib || 0)} lagi. Anda mampu!`,
      iftar: `Alhamdulillah! Masa berbuka. Ingat berbuka dengan kurma dan air.`,
      sahur: `Masa sahur! ${formatCountdown(fastingStatus.timeUntilImsak || 0)} lagi untuk Imsak. Makan dengan baik!`,
      night: `Rehat dengan baik! Sahur bermula dalam ${formatCountdown(fastingStatus.timeUntilNextMeal)}.`,
      lastDays: `10 malam terakhir Ramadan yang diberkati. Tingkatkan ibadah!`,
      eid: `Selamat Hari Raya! 🌙 Eid Mubarak!`,
    },
  };

  const m = messages[lang];

  if (progress.isEid) return m.eid;
  if (progress.currentDay > 20) return m.lastDays;
  
  switch (fastingStatus.currentMealWindow) {
    case 'sahur':
      return m.sahur;
    case 'fasting':
      if (fastingStatus.fastingProgress < 50) return m.earlyFast;
      if (fastingStatus.timeUntilMaghrib && fastingStatus.timeUntilMaghrib < 60) return m.nearIftar;
      return m.midFast;
    case 'iftar':
      return m.iftar;
    case 'night':
      return m.night;
    default:
      return m.earlyFast;
  }
}

// ============================================
// DIETARY RECOMMENDATIONS
// ============================================

/**
 * Get meal recommendations based on time and user conditions
 */
export function getMealRecommendations(
  mealType: 'sahur' | 'iftar',
  hasDiabetes: boolean,
  lang: 'en' | 'bm' = 'en'
): string[] {
  const recommendations = {
    sahur: {
      diabetic: {
        en: [
          '🥣 Complex carbs: Oatmeal, brown rice, whole grain bread',
          '🥚 Protein: Eggs, Greek yogurt, lean chicken',
          '🥤 Hydration: Drink plenty of water',
          '⏰ Eat as close to Imsak as possible',
          '❌ Avoid: White rice, sugary cereals, fried foods',
        ],
        bm: [
          '🥣 Karbohidrat kompleks: Oat, beras perang, roti gandum',
          '🥚 Protein: Telur, yogurt Greek, ayam tanpa lemak',
          '🥤 Hidrasi: Minum banyak air',
          '⏰ Makan sedekat mungkin dengan Imsak',
          '❌ Elakkan: Nasi putih, bijirin bergula, makanan goreng',
        ],
      },
      regular: {
        en: [
          '🍚 Balanced meal with rice, protein, and vegetables',
          '🥤 Stay hydrated with water and light drinks',
          '🍌 Include fruits for vitamins',
          '⏰ Don\'t skip Sahur!',
        ],
        bm: [
          '🍚 Makanan seimbang dengan nasi, protein, dan sayuran',
          '🥤 Kekal terhidrat dengan air dan minuman ringan',
          '🍌 Sertakan buah-buahan untuk vitamin',
          '⏰ Jangan skip Sahur!',
        ],
      },
    },
    iftar: {
      diabetic: {
        en: [
          '🌴 Start with 3 dates and water (Sunnah)',
          '🍲 Wait 15-20 mins before main meal',
          '🥗 Main meal: Grilled protein + vegetables + small portion carbs',
          '❌ Avoid: Sugary drinks (Sirap, Bandung), fried foods',
          '📊 Check glucose 2 hours after eating',
        ],
        bm: [
          '🌴 Mulakan dengan 3 biji kurma dan air (Sunnah)',
          '🍲 Tunggu 15-20 minit sebelum makan utama',
          '🥗 Makanan utama: Protein panggang + sayuran + sedikit karbohidrat',
          '❌ Elakkan: Minuman manis (Sirap, Bandung), makanan goreng',
          '📊 Semak glukosa 2 jam selepas makan',
        ],
      },
      regular: {
        en: [
          '🌴 Break fast with dates and water',
          '🍲 Don\'t overeat - eat slowly',
          '🥗 Include vegetables and protein',
          '🥤 Continue hydrating throughout the night',
        ],
        bm: [
          '🌴 Berbuka dengan kurma dan air',
          '🍲 Jangan makan berlebihan - makan perlahan',
          '🥗 Sertakan sayuran dan protein',
          '🥤 Teruskan hidrasi sepanjang malam',
        ],
      },
    },
  };

  const mealRecs = recommendations[mealType];
  const condition = hasDiabetes ? 'diabetic' : 'regular';
  
  return mealRecs[condition][lang];
}

