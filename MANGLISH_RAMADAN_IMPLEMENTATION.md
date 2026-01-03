# Language Consistency (Manglish) + Ramadan Mode Feature

## Implementation Summary

### ✅ PART 1: Language Consistency - Convert App to Manglish

**Files Updated:**

1. **`components/MobileLayout.tsx`** - Navigation/Sidebar
   - "Diary" → "Utama"
   - "Report" → "Laporan"
   - "Me" → "Profil"
   - "Ask Dr. Reza" → "Tanya Dr. Reza"

2. **`app/dashboard/page.tsx`** - Dashboard Page
   - "Today" → "Hari Ini"
   - "Yesterday" → "Semalam"
   - "Welcome back" → "Selamat kembali"
   - "Log Food" → "Log Makanan"
   - "Log Vitals" → "Log Bacaan"
   - "Glucose, BP, Weight" → "Glukosa, BP, Berat"
   - "Weekly Insights" → "Statistik Mingguan"
   - "Log your first 3 days to unlock!" → "Log 3 hari pertama untuk buka!"
   - "Today's Meals" → "Makanan Hari Ini"
   - "Share Day" → "Kongsi"
   - "No meals tracked today" → "Tiada makanan dilog hari ini"
   - "Ready to start your health journey?" → "Bersedia untuk mulakan perjalanan sihat anda?"
   - "Generate Weekly Report" → "Jana Laporan Mingguan"

3. **`app/check-food/page.tsx`** - Check Food Page
   - "Take a Photo" → "Ambil Gambar"
   - "Type It In" → "Taip Sendiri"
   - "Photo scanning works best..." → "Scan gambar paling sesuai untuk makanan Malaysia..."
   - "Type to search..." → "Taip untuk cari 500+ makanan Malaysia..."
   - "Analyzing your meal..." → "Menganalisis makanan anda..."
   - "Help me identify this!" → "Tolong saya kenal pasti ini!"
   - "What food is this?" → "Makanan apa ini?"
   - "Total Calories" → "Jumlah Kalori"
   - "Portion Size" → "Saiz Porsi"
   - "Ingredients Detected" → "Bahan Dikesan"
   - "Add Missing" → "Tambah Yang Terlepas"
   - "Add Side Dishes" → "Tambah Lauk Pauk"
   - "Add Drink" → "Tambah Minuman"
   - "What meal is this?" → "Jenis Hidangan"
   - Meal types: Breakfast → Sarapan, Lunch → Tengahari, Dinner → Malam, Snack → Snek
   - "Where did you get this?" → "Dari Mana Anda Dapat Ini?"
   - "How was it prepared?" → "Bagaimana Ia Disediakan?"
   - "Please Verify" → "Sila Verifikasi"
   - "Saving..." → "Menyimpan..."
   - "Cancel & Try Again" → "Batal & Cuba Lagi"

4. **`app/profile/page.tsx`** - Profile Page
   - "Daily Calorie Target" → "Sasaran Kalori Harian"
   - "Override only if..." → "Override hanya jika anda ada sasaran khusus..."
   - "How We Calculate" → "Cara Kami Mengira"
   - "Your Data" → "Data Anda"
   - "Download My Data" → "Muat Turun Data Saya"
   - "Exporting..." → "Mengexport..."
   - "Includes:" → "Termasuk:"
   - "Read Full Privacy Policy" → "Baca Dasar Privasi Penuh"
   - "Danger Zone" → "Zon Bahaya"
   - "Delete Account" → "Padam Akaun"
   - "Delete" → "Padam"
   - "Account Deleted" → "Akaun Dipadam"

**Technical Note:**
- Nutrition labels kept in English (Calories, Carbs, Protein, Fat, Sodium, Fiber) as per requirements
- Medical terms kept in English with BM in brackets where needed
- Units (kcal, g, mg) kept in English

### ✅ PART 2: Ramadan Mode Feature

**Database Migration:**
- ✅ Already exists: `supabase/migrations/20260102_ramadan_mode.sql`
- Tables: ramadan_settings, ramadan_daily_log, ramadan_qada_log, ramadan_dates
- All required fields present (sahur_time, iftar_time, glucose tracking, etc.)

**Frontend Implementation:**

1. **`app/profile/page.tsx`** - Ramadan Toggle
   - Added Ramadan Mode toggle section with 🌙 icon
   - Toggle persists to localStorage (`boleh_makan_ramadan_mode`)
   - Shows Sahur/Iftar time slots when enabled
   - Displays info: "3:00 AM - 5:30 AM" (Sahur), "7:00 PM - 9:00 PM" (Iftar)

2. **`app/check-food/page.tsx`** - Dynamic Meal Types
   - Detects Ramadan mode from localStorage
   - When Ramadan Mode ON: Shows Sahur 🌙 and Iftar 🌅 instead of regular meals
   - Auto-selects meal type based on time:
     - 3-6 AM → Sahur
     - 6-9 PM → Iftar
   - Save button updates text: "Log Sahur 🌙" or "Log Iftar 🌅"

3. **`app/dashboard/page.tsx`** - Ramadan Widget
   - Displays green gradient widget when Ramadan Mode active
   - Shows "Ramadan Mubarak" header with 🌙
   - Tracks Sahur/Iftar logging status:
     - "✅ Logged" when meal logged
     - "⏳ Belum log" when not yet logged
   - Displays hydration tip: "💡 Tip: Minum air secukupnya antara Iftar dan Sahur"

4. **`lib/ai/dr-reza-prompt.ts`** - Dr. Reza Ramadan Context
   - Enhanced `buildRamadanContext()` function
   - FOR SAHUR advice:
     - Recommends slow-releasing carbs (oat, brown rice, whole grain)
     - Encourages protein and fiber
     - Warns against salty foods
     - Example: "Untuk sahur, pilihan bagus! Oat dengan kurma bagi tenaga tahan lama."
   - FOR IFTAR advice:
     - Recommends starting with dates and water (Sunnah)
     - Warns against overeating
     - Suggests balanced meals
     - Example: "Untuk berbuka, mulakan dengan kurma dan air dulu ya."

5. **`lib/advisorPrompts.ts`**
   - Added {ramadan_context} placeholder to system prompt
   - Will be populated with Ramadan-specific guidance when mode is active

### 🧪 Testing Checklist

#### Language Testing:
- [x] Navigation shows BM (Utama, Profil, Laporan)
- [x] Buttons show BM (Simpan, Batal, Tukar, Log Makanan, Log Bacaan)
- [x] Meal types show BM (Sarapan, Tengahari, Malam, Snek)
- [x] Nutrition labels stay EN (Calories, Carbs, Protein, Fat)
- [x] Dr. Reza speaks Manglish (via enhanced prompts)

#### Ramadan Mode Testing:
- [x] Toggle appears in Profile page
- [x] Toggle saves to localStorage
- [x] When ON: meal types change to Sahur/Iftar in check-food page
- [x] When ON: Dashboard shows Ramadan widget
- [x] When ON: Dr. Reza gives Ramadan-specific advice
- [x] When OFF: Everything reverts to normal

### 📝 Implementation Notes

1. **localStorage Strategy:**
   - `boleh_makan_ramadan_mode` stores boolean value
   - Checked across dashboard, check-food, and profile pages
   - Simple implementation without backend dependency initially
   - Can be synced to Supabase later if needed

2. **Meal Type Detection:**
   - Sahur/Iftar logged status checked from meals array
   - Filters by meal_type field (needs to be saved with meal data)
   - Time-based auto-selection for better UX

3. **Ramadan Dates:**
   - Migration includes ramadan_dates table with 2025-2027 dates
   - Can be expanded to calculate prayer times dynamically
   - Current implementation uses fixed time ranges

4. **Future Enhancements:**
   - Sync Ramadan mode to backend user_profiles table
   - Add prayer time API integration
   - Implement Qada (replacement fasting) tracking
   - Add glucose monitoring during fasting
   - Ramadan nutrition reports

### 🚀 Deployment

Ready to commit and push:

```bash
git add .
git commit -m "feat: Manglish language consistency + Ramadan mode feature"
git push
```

### 📄 Files Modified

1. `components/MobileLayout.tsx`
2. `app/dashboard/page.tsx`
3. `app/check-food/page.tsx`
4. `app/profile/page.tsx`
5. `lib/ai/dr-reza-prompt.ts`
6. `lib/advisorPrompts.ts`

### 📄 Files Referenced (No Changes Needed)

1. `supabase/migrations/20260102_ramadan_mode.sql` (already exists)
2. `hooks/useRamadanMode.ts` (already exists for future backend integration)
3. `components/ramadan/*` (already exist for future features)

---

**Implementation Status:** ✅ COMPLETE

All requirements from the task have been implemented. The app now has consistent Manglish language throughout and a functional Ramadan Mode feature with localStorage persistence, dynamic meal types, dashboard widget, and enhanced Dr. Reza guidance.

