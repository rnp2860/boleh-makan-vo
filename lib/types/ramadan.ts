// lib/types/ramadan.ts
// 🌙 RAMADAN MODE - TypeScript Types

// ============================================
// DATABASE TYPES
// ============================================

export interface RamadanSettings {
  id: string;
  user_id: string;
  year: number;
  enabled: boolean;
  
  // Location
  location_lat: number | null;
  location_lng: number | null;
  location_name: string;
  location_zone: string; // JAKIM zone code
  
  // Timing offsets (minutes)
  imsak_offset_minutes: number;
  iftar_reminder_minutes: number;
  sahur_reminder_minutes: number;
  
  // Glucose targets (mmol/L)
  glucose_target_fasting: number;
  glucose_target_post_iftar: number;
  glucose_alert_low: number;
  glucose_alert_high: number;
  
  // Notifications
  notifications_enabled: boolean;
  sahur_notification: boolean;
  iftar_notification: boolean;
  hydration_reminders: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface RamadanDailyLog {
  id: string;
  user_id: string;
  date: string;
  fasting_day: number;
  
  // Prayer times (cached)
  imsak_time: string | null;
  subuh_time: string | null;
  maghrib_time: string | null;
  isyak_time: string | null;
  
  // Sahur
  sahur_logged: boolean;
  sahur_time: string | null;
  sahur_calories: number | null;
  sahur_carbs: number | null;
  sahur_protein: number | null;
  sahur_fat: number | null;
  sahur_notes: string | null;
  
  // Iftar
  iftar_logged: boolean;
  iftar_time: string | null;
  iftar_calories: number | null;
  iftar_carbs: number | null;
  iftar_protein: number | null;
  iftar_fat: number | null;
  iftar_notes: string | null;
  
  // Additional
  additional_calories: number;
  
  // Fasting status
  fasting_completed: boolean;
  fasting_broken: boolean;
  fasting_broken_reason: FastingBrokenReason | null;
  fasting_broken_time: string | null;
  
  // Glucose (mmol/L)
  glucose_sahur: number | null;
  glucose_midday: number | null;
  glucose_pre_iftar: number | null;
  glucose_post_iftar: number | null;
  
  // Summary
  total_calories: number | null;
  water_intake_liters: number | null;
  energy_level: 1 | 2 | 3 | 4 | 5 | null;
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface RamadanQadaLog {
  id: string;
  user_id: string;
  ramadan_year: number;
  missed_date: string;
  missed_reason: string | null;
  qada_completed: boolean;
  qada_date: string | null;
  qada_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RamadanDates {
  id: number;
  year: number;
  start_date: string;
  end_date: string;
  eid_date: string;
  source: 'estimated' | 'confirmed' | 'official';
  created_at: string;
}

// ============================================
// ENUMS & TYPES
// ============================================

export type FastingBrokenReason = 
  | 'medical'
  | 'travel'
  | 'illness'
  | 'menstruation'
  | 'pregnancy'
  | 'breastfeeding'
  | 'elderly'
  | 'other';

export type MealType = 'sahur' | 'iftar' | 'post_tarawih';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

// ============================================
// PRAYER TIMES
// ============================================

export interface PrayerTimes {
  imsak: string;    // Sahur deadline
  subuh: string;    // Fajr
  syuruk: string;   // Sunrise
  zohor: string;    // Dhuhr
  asar: string;     // Asr
  maghrib: string;  // Iftar time
  isyak: string;    // Isha
}

export interface PrayerTimesResponse {
  date: string;
  hijri_date: string;
  location: string;
  zone: string;
  times: PrayerTimes;
}

// JAKIM Zone codes for Malaysian states
export const JAKIM_ZONES: Record<string, string> = {
  // Johor
  'JHR01': 'Pulau Aur dan Pulau Pemanggil',
  'JHR02': 'Johor Bahru, Kota Tinggi, Mersing, Kulai',
  'JHR03': 'Kluang, Pontian',
  'JHR04': 'Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak',
  
  // Kedah
  'KDH01': 'Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)',
  'KDH02': 'Kuala Muda, Yan, Pendang',
  'KDH03': 'Padang Terap, Sik',
  'KDH04': 'Baling',
  'KDH05': 'Bandar Baharu, Kulim',
  'KDH06': 'Langkawi',
  'KDH07': 'Gunung Jerai',
  
  // Kelantan
  'KTN01': 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku',
  'KTN02': 'Gua Musang (Daerah Galas Dan Bertam), Jeli, Jajahan Kecil Lojing',
  
  // Melaka
  'MLK01': 'SELURUH NEGERI MELAKA',
  
  // Negeri Sembilan
  'NGS01': 'Tampin, Jempol',
  'NGS02': 'Jelebu, Kuala Pilah, Rembau',
  'NGS03': 'Port Dickson, Seremban',
  
  // Pahang
  'PHG01': 'Pulau Tioman',
  'PHG02': 'Kuantan, Pekan, Rompin, Muadzam Shah',
  'PHG03': 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka',
  'PHG04': 'Bentong, Lipis, Raub',
  'PHG05': 'Genting Highlands, Cameron Highlands',
  
  // Perlis
  'PLS01': 'Kangar, Padang Besar, Arau',
  
  // Pulau Pinang
  'PNG01': 'Seluruh Negeri Pulau Pinang',
  
  // Perak
  'PRK01': 'Tapah, Slim River, Tanjung Malim',
  'PRK02': 'Kuala Kangsar, Sg. Siput, Ipoh, Kampar, Batu Gajah, Seri Iskandar',
  'PRK03': 'Lenggong, Pengkalan Hulu, Grik',
  'PRK04': 'Temengor, Belum',
  'PRK05': 'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Manjung, Lumut, Sitiawan, Pulau Pangkor',
  'PRK06': 'Selama, Taiping, Bagan Serai, Parit Buntar',
  'PRK07': 'Bukit Larut',
  
  // Sabah
  'SBH01': 'Bahagian Sandakan (Timur), ## Bukit Garam, ## ## Meliau, Temanggong, Tambisan, Bandar Sandakan, Sukau',
  'SBH02': 'Beluran, ## Telupit, Kuamut, Bahagian Sandakan (Barat)',
  'SBH03': 'Lahad Datu, Silabukan, Kunak, Semporna, Tungku, Bahagian Tawau (Timur)',
  'SBH04': 'Bandar Tawau, Balong, Merotai, Kalabakan, Bahagian Tawau (Barat)',
  'SBH05': 'Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat',
  'SBH06': 'Gunung Kinabalu',
  'SBH07': 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat',
  'SBH08': 'Pensiangan, ## Keningau, Tambunan, Nabawan, Bahagian Pedalaman (Atas)',
  'SBH09': 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pa Sia, Membakut, Bahagian Pedalaman (Bawah)',
  
  // Sarawak
  'SWK01': 'Limbang, Lawas, Sundar, Trusan',
  'SWK02': 'Miri, Niah, Bekenu, Marudi, Sibuti',
  'SWK03': 'Tatau, Suai, Belaga, Pandan, Sebauh, Bintulu',
  'SWK04': 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit',
  'SWK05': 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai',
  'SWK06': 'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkilili, Betong, Spaoh, Pusa, Saratok',
  'SWK07': 'Serian, Simunjan, Samarahan, Sebuyau, Meludam',
  'SWK08': 'Kuching, Bau, Lundu, Sematan',
  'SWK09': 'Zon Khas (Kampung Patarikan)',
  
  // Selangor
  'SGR01': 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam',
  'SGR02': 'Kuala Selangor, Sabak Bernam',
  'SGR03': 'Klang, Kuala Langat',
  
  // Terengganu
  'TRG01': 'Kuala Terengganu, Marang, Kuala Nerus',
  'TRG02': 'Besut, Setiu',
  'TRG03': 'Hulu Terengganu',
  'TRG04': 'Dungun, Kemaman',
  
  // Wilayah Persekutuan
  'WLY01': 'Kuala Lumpur, Putrajaya',
  'WLY02': 'Labuan',
};

// Major Malaysian cities with coordinates
export const MALAYSIAN_CITIES: Record<string, { lat: number; lng: number; zone: string; name_bm: string }> = {
  'Kuala Lumpur': { lat: 3.1390, lng: 101.6869, zone: 'WLY01', name_bm: 'Kuala Lumpur' },
  'George Town': { lat: 5.4141, lng: 100.3288, zone: 'PNG01', name_bm: 'George Town' },
  'Ipoh': { lat: 4.5975, lng: 101.0901, zone: 'PRK02', name_bm: 'Ipoh' },
  'Johor Bahru': { lat: 1.4927, lng: 103.7414, zone: 'JHR02', name_bm: 'Johor Bahru' },
  'Kuching': { lat: 1.5535, lng: 110.3593, zone: 'SWK08', name_bm: 'Kuching' },
  'Kota Kinabalu': { lat: 5.9804, lng: 116.0735, zone: 'SBH07', name_bm: 'Kota Kinabalu' },
  'Shah Alam': { lat: 3.0733, lng: 101.5185, zone: 'SGR01', name_bm: 'Shah Alam' },
  'Petaling Jaya': { lat: 3.1073, lng: 101.6067, zone: 'SGR01', name_bm: 'Petaling Jaya' },
  'Kuantan': { lat: 3.8077, lng: 103.3260, zone: 'PHG02', name_bm: 'Kuantan' },
  'Kota Bharu': { lat: 6.1254, lng: 102.2381, zone: 'KTN01', name_bm: 'Kota Bharu' },
  'Melaka': { lat: 2.1896, lng: 102.2501, zone: 'MLK01', name_bm: 'Melaka' },
  'Alor Setar': { lat: 6.1248, lng: 100.3678, zone: 'KDH01', name_bm: 'Alor Setar' },
  'Kuala Terengganu': { lat: 5.3117, lng: 103.1324, zone: 'TRG01', name_bm: 'Kuala Terengganu' },
  'Seremban': { lat: 2.7259, lng: 101.9424, zone: 'NGS03', name_bm: 'Seremban' },
  'Putrajaya': { lat: 2.9264, lng: 101.6964, zone: 'WLY01', name_bm: 'Putrajaya' },
};

// ============================================
// INPUT TYPES
// ============================================

export interface RamadanSettingsInput {
  user_id: string;
  year?: number;
  enabled?: boolean;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  location_zone?: string;
  imsak_offset_minutes?: number;
  iftar_reminder_minutes?: number;
  sahur_reminder_minutes?: number;
  glucose_target_fasting?: number;
  glucose_target_post_iftar?: number;
  glucose_alert_low?: number;
  glucose_alert_high?: number;
  notifications_enabled?: boolean;
  sahur_notification?: boolean;
  iftar_notification?: boolean;
  hydration_reminders?: boolean;
}

export interface RamadanDailyLogInput {
  user_id: string;
  date: string;
  fasting_day?: number;
  sahur_logged?: boolean;
  sahur_time?: string;
  sahur_calories?: number;
  sahur_carbs?: number;
  sahur_protein?: number;
  sahur_fat?: number;
  sahur_notes?: string;
  iftar_logged?: boolean;
  iftar_time?: string;
  iftar_calories?: number;
  iftar_carbs?: number;
  iftar_protein?: number;
  iftar_fat?: number;
  iftar_notes?: string;
  additional_calories?: number;
  fasting_completed?: boolean;
  fasting_broken?: boolean;
  fasting_broken_reason?: FastingBrokenReason;
  fasting_broken_time?: string;
  glucose_sahur?: number;
  glucose_midday?: number;
  glucose_pre_iftar?: number;
  glucose_post_iftar?: number;
  total_calories?: number;
  water_intake_liters?: number;
  energy_level?: EnergyLevel;
  notes?: string;
}

// ============================================
// COMPUTED TYPES
// ============================================

export interface FastingStatus {
  isFasting: boolean;
  currentMealWindow: 'sahur' | 'fasting' | 'iftar' | 'night';
  nextMeal: 'sahur' | 'iftar';
  timeUntilNextMeal: number; // minutes
  timeUntilImsak: number | null; // minutes (only during sahur window)
  timeUntilMaghrib: number | null; // minutes (only during fasting)
  fastingDuration: number; // total fasting hours today
  fastingProgress: number; // percentage 0-100
}

export interface RamadanStats {
  totalDaysFasted: number;
  daysCompleted: number;
  daysBroken: number;
  currentStreak: number;
  longestStreak: number;
  averageGlucoseFasting: number | null;
  averageGlucosePostIftar: number | null;
  averageCaloriesPerDay: number;
  averageWaterIntake: number;
  averageEnergyLevel: number | null;
  qadaDaysOwed: number;
}

export interface RamadanProgress {
  currentDay: number;
  totalDays: number;
  percentComplete: number;
  daysRemaining: number;
  isRamadan: boolean;
  isEid: boolean;
  ramadanDates: RamadanDates | null;
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_RAMADAN_SETTINGS: Partial<RamadanSettings> = {
  enabled: false,
  location_name: 'Kuala Lumpur',
  location_zone: 'WLY01',
  location_lat: 3.1390,
  location_lng: 101.6869,
  imsak_offset_minutes: -10,
  iftar_reminder_minutes: 15,
  sahur_reminder_minutes: 30,
  glucose_target_fasting: 5.5,
  glucose_target_post_iftar: 7.8,
  glucose_alert_low: 3.9,
  glucose_alert_high: 10.0,
  notifications_enabled: true,
  sahur_notification: true,
  iftar_notification: true,
  hydration_reminders: true,
};

// ============================================
// FOOD RECOMMENDATIONS
// ============================================

export interface RamadanFoodRecommendation {
  name: string;
  name_bm: string;
  category: 'complex_carb' | 'protein' | 'fiber' | 'hydration' | 'dates' | 'avoid';
  meal: 'sahur' | 'iftar' | 'both';
  benefits: string;
  benefits_bm: string;
  glycemicIndex: 'low' | 'medium' | 'high';
  diabeticFriendly: boolean;
}

export const SAHUR_RECOMMENDATIONS: RamadanFoodRecommendation[] = [
  {
    name: 'Oatmeal with dates',
    name_bm: 'Oat dengan kurma',
    category: 'complex_carb',
    meal: 'sahur',
    benefits: 'Slow-release energy throughout the day',
    benefits_bm: 'Tenaga perlahan sepanjang hari',
    glycemicIndex: 'low',
    diabeticFriendly: true,
  },
  {
    name: 'Brown rice porridge',
    name_bm: 'Bubur beras perang',
    category: 'complex_carb',
    meal: 'sahur',
    benefits: 'High fiber, sustained energy',
    benefits_bm: 'Tinggi serat, tenaga berpanjangan',
    glycemicIndex: 'medium',
    diabeticFriendly: true,
  },
  {
    name: 'Eggs with whole wheat bread',
    name_bm: 'Telur dengan roti gandum',
    category: 'protein',
    meal: 'sahur',
    benefits: 'Protein keeps you full longer',
    benefits_bm: 'Protein membuatkan anda kenyang lebih lama',
    glycemicIndex: 'low',
    diabeticFriendly: true,
  },
  {
    name: 'Greek yogurt with nuts',
    name_bm: 'Yogurt Greek dengan kacang',
    category: 'protein',
    meal: 'sahur',
    benefits: 'Probiotics and healthy fats',
    benefits_bm: 'Probiotik dan lemak sihat',
    glycemicIndex: 'low',
    diabeticFriendly: true,
  },
];

export const IFTAR_RECOMMENDATIONS: RamadanFoodRecommendation[] = [
  {
    name: 'Dates (3 pieces)',
    name_bm: 'Kurma (3 biji)',
    category: 'dates',
    meal: 'iftar',
    benefits: 'Sunnah, quick natural energy',
    benefits_bm: 'Sunnah, tenaga semula jadi yang cepat',
    glycemicIndex: 'medium',
    diabeticFriendly: true,
  },
  {
    name: 'Water and light soup',
    name_bm: 'Air dan sup ringan',
    category: 'hydration',
    meal: 'iftar',
    benefits: 'Rehydrate gently before main meal',
    benefits_bm: 'Hidrasi perlahan sebelum makanan utama',
    glycemicIndex: 'low',
    diabeticFriendly: true,
  },
  {
    name: 'Grilled chicken with vegetables',
    name_bm: 'Ayam panggang dengan sayuran',
    category: 'protein',
    meal: 'iftar',
    benefits: 'Lean protein, low glucose spike',
    benefits_bm: 'Protein tanpa lemak, lonjakan glukosa rendah',
    glycemicIndex: 'low',
    diabeticFriendly: true,
  },
];

export const FOODS_TO_AVOID_RAMADAN: RamadanFoodRecommendation[] = [
  {
    name: 'Sugary drinks (Sirap, Bandung)',
    name_bm: 'Minuman manis (Sirap, Bandung)',
    category: 'avoid',
    meal: 'both',
    benefits: 'Causes rapid glucose spike',
    benefits_bm: 'Menyebabkan lonjakan glukosa mendadak',
    glycemicIndex: 'high',
    diabeticFriendly: false,
  },
  {
    name: 'Deep fried foods',
    name_bm: 'Makanan goreng',
    category: 'avoid',
    meal: 'both',
    benefits: 'Heavy, causes fatigue and thirst',
    benefits_bm: 'Berat, menyebabkan keletihan dan dahaga',
    glycemicIndex: 'high',
    diabeticFriendly: false,
  },
  {
    name: 'White rice in large portions',
    name_bm: 'Nasi putih dalam kuantiti besar',
    category: 'avoid',
    meal: 'both',
    benefits: 'High GI, rapid glucose spike',
    benefits_bm: 'GI tinggi, lonjakan glukosa cepat',
    glycemicIndex: 'high',
    diabeticFriendly: false,
  },
];

// ============================================
// LOCALIZATION
// ============================================

export const RAMADAN_LABELS = {
  en: {
    sahur: 'Sahur',
    iftar: 'Iftar',
    imsak: 'Imsak',
    subuh: 'Subuh',
    maghrib: 'Maghrib',
    fasting: 'Fasting',
    breakFast: 'Break Fast',
    dayOf: 'Day',
    daysLeft: 'days left',
    timeUntilIftar: 'Time until Iftar',
    timeUntilSahur: 'Time until Sahur',
    fastingComplete: 'Fasting Complete',
    fastingBroken: 'Fasting Broken',
    logSahur: 'Log Sahur Meal',
    logIftar: 'Log Iftar Meal',
    ramadanMubarak: 'Ramadan Mubarak',
    eidMubarak: 'Eid Mubarak',
  },
  bm: {
    sahur: 'Sahur',
    iftar: 'Berbuka',
    imsak: 'Imsak',
    subuh: 'Subuh',
    maghrib: 'Maghrib',
    fasting: 'Berpuasa',
    breakFast: 'Berbuka Puasa',
    dayOf: 'Hari',
    daysLeft: 'hari lagi',
    timeUntilIftar: 'Masa sehingga berbuka',
    timeUntilSahur: 'Masa sehingga sahur',
    fastingComplete: 'Puasa Sempurna',
    fastingBroken: 'Puasa Batal',
    logSahur: 'Log Makanan Sahur',
    logIftar: 'Log Makanan Berbuka',
    ramadanMubarak: 'Ramadan Mubarak',
    eidMubarak: 'Selamat Hari Raya',
  },
};

