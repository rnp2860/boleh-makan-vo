# 🍽️ BOLEH MAKAN - Master Project Record
**Version:** 1.0.0  
**Last Updated:** January 2, 2026  
**Platform:** Next.js 16 + Supabase + OpenAI  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [File Structure](#file-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Core Features](#core-features)
8. [AI Systems](#ai-systems)
9. [Components Reference](#components-reference)
10. [Environment Variables](#environment-variables)
11. [Changelog](#changelog)

---

## 🎯 Project Overview

**Boleh Makan** is a Malaysian food intelligence platform designed to help users:
- Track meals with AI-powered food recognition
- Monitor health vitals (glucose, blood pressure, weight)
- Receive culturally-aware nutritional advice from "Dr. Reza" AI
- Calculate daily health scores based on food choices and vitals
- Visualize correlations between meals and glucose levels

### Target Users
- Diabetic patients monitoring glucose-food relationships
- Health-conscious Malaysians tracking nutrition
- Enterprise clients (B2B) for employee wellness programs

### Unique Value Propositions
1. **Malaysian Cultural Accuracy** - Recognizes Nasi Kandar, Char Kuey Teow, etc.
2. **Halal Safety Net** - Flags potentially non-halal ingredients
3. **RLHF Learning** - Improves from user corrections
4. **Glucose-Food Correlation** - Visual timeline of meals vs blood sugar

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.0 | React framework with App Router |
| React | 19.2.3 | UI library |
| Tailwind CSS | 4.x | Styling |
| Recharts | 3.6.0 | Data visualization (charts) |
| Lucide React | 0.562.0 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | - | Serverless functions |
| Supabase | 2.89.0 | Database + Auth + Storage |
| OpenAI | 6.15.0 | GPT-4o-mini for vision & chat |

### AI/ML
| Model | Purpose |
|-------|---------|
| gpt-4o-mini | Food vision analysis, nutrition estimation, Dr. Reza advice |
| RLHF System | User correction learning (custom implementation) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Hosting & deployment |
| Supabase | PostgreSQL database |
| GitHub | Version control |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  /                    → B2B Landing Page                    │
│  /dashboard           → Main App Dashboard                  │
│  /check-food          → Food Scanner & Analysis             │
│  /chat                → Dr. Reza Chat Interface             │
│  /profile             → User Settings & Health Goals        │
│  /reports             → Weekly Reports & Insights           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js API Routes)           │
├─────────────────────────────────────────────────────────────┤
│  /api/smart-analyze   → AI Food Recognition + RLHF          │
│  /api/log-meal        → Save meal to database               │
│  /api/log-vital       → Save vitals to database             │
│  /api/user/score      → Calculate Boleh Score               │
│  /api/corrections     → RLHF correction data                │
│  /api/chat-dr-reza    → AI Health Advisor                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Supabase)                    │
├─────────────────────────────────────────────────────────────┤
│  food_logs            → Meal entries with nutrition         │
│  user_vitals          → Glucose, BP, Weight readings        │
│  food_library         → Verified Malaysian food database    │
│  user_weekly_goals    → Health goal prescriptions           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI LAYER (OpenAI)                        │
├─────────────────────────────────────────────────────────────┤
│  Vision Analysis      → gpt-4o-mini with image input        │
│  RLHF Injection       → User corrections in prompt          │
│  Dr. Reza Advisor     → Culturally-aware health advice      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
boleh-makan/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # B2B Landing Page (public)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard (private)
│   │   └── layout.tsx            # Dashboard layout with MobileLayout
│   ├── check-food/
│   │   └── page.tsx              # Food scanner & analysis
│   ├── chat/
│   │   └── page.tsx              # Dr. Reza chat interface
│   ├── profile/
│   │   └── page.tsx              # User profile & settings
│   ├── report/
│   │   └── page.tsx              # Weekly report view
│   ├── reports/
│   │   └── page.tsx              # Reports list
│   └── api/                      # API Routes
│       ├── smart-analyze/        # AI food analysis + RLHF
│       ├── analyze-food/         # Legacy food analysis
│       ├── log-meal/             # Save meal entries
│       ├── log-vital/            # Save vital readings
│       ├── user/score/           # Boleh Score calculation
│       ├── corrections/recent/   # RLHF corrections data
│       ├── chat-dr-reza/         # AI chat endpoint
│       ├── recalculate-nutrition/# Recalc after name edit
│       ├── vitals/today/         # Today's vital readings
│       ├── search-food/          # Food search
│       ├── voice-log/            # Voice input processing
│       ├── goals/
│       │   ├── save/             # Save health goals
│       │   └── generate-prescription/ # AI goal generation
│       └── reports/
│           ├── generate/         # Generate PDF reports
│           └── insight/          # AI insights
│
├── components/                   # Reusable React components
│   ├── BolehScoreWidget.tsx      # Circular health score gauge
│   ├── RiskChart.tsx             # Glucose-meal correlation chart
│   ├── LogVitalsModal.tsx        # Vitals logging modal
│   ├── MealDetailsModal.tsx      # Meal detail view
│   ├── MobileLayout.tsx          # Mobile app shell with nav
│   ├── DateStrip.tsx             # Horizontal date selector
│   ├── DailyProgress.tsx         # Daily calorie progress
│   ├── WeeklyChart.tsx           # Weekly stats chart
│   ├── DaySummaryShare.tsx       # Shareable day summary
│   ├── InfoModal.tsx             # Educational tooltips
│   ├── Logo.tsx                  # Custom SVG logo
│   └── VitalityHUD.tsx           # Vitals display widget
│
├── lib/                          # Utility libraries
│   ├── visionPrompts.ts          # AI vision prompt + RLHF
│   ├── advisorPrompts.ts         # Dr. Reza prompt
│   ├── calculateBolehScore.ts    # Score calculation logic
│   └── supabaseClient.ts         # Supabase client init
│
├── context/
│   └── FoodContext.tsx           # Global food/meal state
│
├── types/
│   └── database.ts               # TypeScript interfaces
│
├── data/
│   └── malaysian_food_anchors.ts # Known Malaysian dishes
│
├── public/assets/                # Static images
│   ├── avatar-*.png              # Dr. Reza avatar states
│   └── icon-*.png                # Health goal icons
│
└── supabase/migrations/          # Database migrations
    ├── add_meal_type_column.sql
    └── create_user_weekly_goals_table.sql
```

---

## 🗄️ Database Schema

### Table: `food_logs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | text | User identifier |
| `meal_name` | text | Food name (final, after user edit) |
| `calories` | integer | Total calories |
| `protein` | numeric | Protein in grams |
| `carbs` | numeric | Carbohydrates in grams |
| `fat` | numeric | Fat in grams |
| `sodium` | numeric | Sodium in mg |
| `sugar` | numeric | Sugar in grams |
| `portion_size` | numeric | Portion multiplier (default 1) |
| `image_url` | text | Supabase storage URL |
| `components` | jsonb | Food components array |
| `analysis_data` | text | Dr. Reza analysis text |
| `meal_type` | text | Breakfast/Lunch/Dinner/Snack/Other |
| `created_at` | timestamp | Log timestamp |
| **Enterprise Fields** | | |
| `meal_context` | text | hawker_stall/home_cooked/restaurant/fast_food/office_canteen/unknown |
| `preparation_style` | text | deep_fried/stir_fried/steamed/soup_boiled/gravy_curry/raw_fresh/grilled/unknown |
| `sugar_source_detected` | boolean | AI detected added sugar |
| `is_ramadan_log` | boolean | Logged during Ramadan |
| **RLHF Fields** | | |
| `ai_suggested_name` | text | Original AI prediction |
| `was_user_corrected` | boolean | User edited the name |

### Table: `user_vitals`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | text | User identifier |
| `vital_type` | text | glucose/bp_systolic/bp_diastolic/weight/waist_circumference |
| `reading_value` | numeric | The measurement value |
| `unit` | text | mmol/L, mmHg, kg, cm |
| `context_tag` | text | fasting/pre_meal/post_meal_2hr/general |
| `measured_at` | timestamp | When measurement was taken |
| `created_at` | timestamp | Record creation time |

### Table: `food_library`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Food name |
| `calories` | integer | Calories per serving |
| `protein` | numeric | Protein in grams |
| `carbs` | numeric | Carbs in grams |
| `fat` | numeric | Fat in grams |
| `sodium_mg` | numeric | Sodium in mg |
| `sugar_g` | numeric | Sugar in grams |
| `category` | text | Mamak/Malay/Chinese/Indian/Western/Beverage/Dessert |
| `valid_lauk` | jsonb | Array of valid side dishes |
| `health_tags` | jsonb | Array of tags (high_sodium, high_sugar, etc.) |

---

## 🔌 API Endpoints

### Food Analysis

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/smart-analyze` | POST | AI food recognition with RLHF |
| `/api/analyze-food` | POST | Legacy food analysis |
| `/api/recalculate-nutrition` | POST | Recalculate after name edit |
| `/api/search-food` | POST | Search food database |

**POST /api/smart-analyze**
```typescript
// Request
{
  type: "image" | "text",
  data: string, // base64 image or food name
  healthConditions: string[]
}

// Response
{
  success: true,
  source: "database" | "vision_estimate",
  confidence: 0.85,
  data: {
    food_name: "Nasi Kandar Ayam Goreng",
    category: "Mamak",
    macros: { calories, protein_g, carbs_g, fat_g, sugar_g, sodium_mg },
    components: [...],
    analysis_content: "Dr. Reza advice...",
    is_potentially_pork: false,
    detected_protein: "chicken"
  }
}
```

### Meal Logging

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/log-meal` | POST | Save meal to database |

**POST /api/log-meal**
```typescript
// Request
{
  user_id: string,
  meal_name: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  sodium: number,
  sugar: number,
  portion_size: number,
  image_url: string,
  meal_type: string,
  meal_context: string,
  preparation_style: string,
  sugar_source_detected: boolean,
  is_ramadan_log: boolean,
  ai_suggested_name: string,
  was_user_corrected: boolean
}
```

### Vitals Logging

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/log-vital` | POST | Save vital reading |
| `/api/vitals/today` | GET | Get today's readings |

**POST /api/log-vital**
```typescript
// Request
{
  user_id: string,
  vital_type: "glucose" | "bp_systolic" | "bp_diastolic" | "weight",
  reading_value: number,
  context_tag: "fasting" | "pre_meal" | "post_meal_2hr" | "general"
}
```

### Boleh Score

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/score` | GET/POST | Calculate daily Boleh Score |

**GET /api/user/score?user_id=xxx&date=2026-01-02**
```typescript
// Response
{
  score: 78,
  insight: "Watch the fried foods today!",
  breakdown: {
    base: 70,
    consistency_bonus: 6,
    context_penalty: -3,
    prep_penalty: 0,
    sugar_penalty: 0,
    medical_penalty: 0,
    medical_bonus: 5,
    healthy_bonus: 0
  }
}
```

### RLHF Corrections

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/corrections/recent` | GET | Get user corrections for AI |

### Chat & Reports

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat-dr-reza` | POST | AI health advisor chat |
| `/api/reports/generate` | POST | Generate PDF report |
| `/api/reports/insight` | POST | Get AI insights |
| `/api/goals/save` | POST | Save health goals |
| `/api/goals/generate-prescription` | POST | AI goal generation |

---

## ⭐ Core Features

### 1. AI Food Scanner
- Camera capture or gallery upload
- GPT-4o-mini vision analysis
- Malaysian cultural dish recognition
- Halal safety detection
- RLHF learning from corrections

### 2. Boleh Score
- Daily health score (0-100)
- Factors: meal consistency, context, preparation, sugar, vitals
- Color-coded gauge (Green/Yellow/Red)
- Personalized insights

### 3. Risk Correlation Chart
- Timeline visualization
- Glucose readings (blue line)
- Meal markers (teal dots)
- Context tags in tooltips
- Reference lines for target/high levels

### 4. Vitals Logging
- Glucose (fasting/pre-meal/post-meal/general)
- Blood Pressure (systolic/diastolic)
- Weight
- Today's latest reading display

### 5. Dr. Reza AI Advisor
- Culturally-aware nutritional advice
- Health condition personalization
- Malaysian food expertise
- Friendly, approachable tone

### 6. RLHF Correction System
- User can edit AI food predictions
- Corrections stored in database
- Injected into AI prompts dynamically
- Consensus voting (corrections with 2+ users prioritized)
- Advisory approach (AI verifies before applying)

---

## 🧠 AI Systems

### Vision Prompt Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  🧠 LEARNED VISUAL CONTEXT & CORRECTIONS (RLHF ADVISORY)    │
│  - User corrections from database                            │
│  - Conditional logic: "check if it is actually"              │
│  - PAUSE → LOOK → DECIDE flow                                │
└──────────────────────────────────────────────────────────────┘
                              +
┌──────────────────────────────────────────────────────────────┐
│  🔬 FORENSIC ANALYSIS PROTOCOL                               │
│  - Step 1: Scan for "Fingerprints"                           │
│  - Step 2: Determine Identity                                │
│  - Step 3: Output JSON                                       │
└──────────────────────────────────────────────────────────────┘
                              +
┌──────────────────────────────────────────────────────────────┐
│  🇲🇾 CULTURAL SPECIFICITY RULES                              │
│  - Nasi Kandar detection                                     │
│  - Nasi Lemak vs Nasi Ayam                                   │
│  - Forbidden generic labels                                  │
└──────────────────────────────────────────────────────────────┘
                              +
┌──────────────────────────────────────────────────────────────┐
│  🐷 HALAL SAFETY NET                                         │
│  - Pork keyword detection                                    │
│  - Ambiguous red meat flagging                               │
│  - Protein identification                                    │
└──────────────────────────────────────────────────────────────┘
                              +
┌──────────────────────────────────────────────────────────────┐
│  🏪 ENTERPRISE CONTEXT DETECTION                             │
│  - Meal context (hawker/restaurant/home)                     │
│  - Preparation style detection                               │
│  - Sugar source detection                                    │
└──────────────────────────────────────────────────────────────┘
```

### Boleh Score Calculation

```typescript
calculateDailyScore(userId, date):
  Base Score: 70
  
  + Consistency Bonus: +2 per meal logged (max +10)
  - Context Penalty: -3 for hawker_stall or fast_food
  - Prep Penalty: -3 for deep_fried
  - Sugar Penalty: -5 if sugar_source_detected
  - Medical Penalty: -10 if glucose > 8.0 or BP > 130/80
  + Medical Bonus: +5 if glucose 4.0-7.0
  + Healthy Bonus: +5 for steamed/raw_fresh/soup_boiled
  
  Final: Clamp(0, 100)
```

---

## 🧩 Components Reference

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `BolehScoreWidget` | Circular health score gauge | `userId`, `date` |
| `RiskChart` | Glucose-meal correlation chart | `foodLogs`, `vitals`, `date` |
| `LogVitalsModal` | Vitals logging modal | `isOpen`, `onClose`, `onSuccess` |
| `MealDetailsModal` | Meal detail view | `meal`, `onClose`, `onDelete` |
| `MobileLayout` | Mobile app shell with bottom nav | `children` |
| `DateStrip` | Horizontal date selector | `selectedDate`, `onDateChange` |
| `DailyProgress` | Daily calorie/macro progress | `consumed`, `budget`, `macros` |
| `WeeklyChart` | Weekly stats bar chart | `data` |
| `InfoModal` | Educational tooltips | `title`, `content`, `isOpen` |
| `Logo` | Custom SVG logo | `className` |

---

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Optional: Google Gemini (future)
GEMINI_API_KEY=...
```

---

## 📜 Changelog

### January 2, 2026

#### RLHF Correction System
- Created `/api/corrections/recent` endpoint
- Added `generateCorrectionInjection()` function
- Added `buildVisionPromptWithCorrections()` function
- Updated `smart-analyze` to inject corrections dynamically
- Refined to ADVISORY approach (PAUSE → LOOK → DECIDE)

#### Risk Chart Improvements
- Fixed "Zombie Icon" bug (chart refresh after delete)
- Added context tags to glucose tooltip (Fasting/Pre-meal/Post-meal)
- Separated glucose dots from meal icons (no overlap)
- Fixed layout issues (margins, label clipping)

#### Vitals Logging
- Fixed save button functionality
- Added UX hints for each vital type
- Added "Today's Latest" reading display
- Sticky modal (stays open after save)

#### Food Analysis
- Added RLHF user correction feature (pencil edit)
- Added `ai_suggested_name` and `was_user_corrected` fields
- Added recalculate-nutrition endpoint for name changes
- Updated helper text with Malaysian food examples

#### Dashboard
- Added Boleh Score Widget
- Added Risk Correlation Chart
- Added Log Vitals quick action
- Added educational InfoModals

#### Infrastructure
- Split landing page (`/`) from dashboard (`/dashboard`)
- Added professional Logo component
- Fixed navigation routing
- Added MealDetailsModal bottom padding for nav bar

---

## 📊 Metrics & Costs

### Estimated API Costs (per scan)
| Model | Cost |
|-------|------|
| gpt-4o-mini (vision) | ~$0.001-0.002 |
| gpt-4o-mini (text) | ~$0.0001-0.0005 |

### Estimated Monthly Costs
| Users | Scans/day | Monthly Cost |
|-------|-----------|--------------|
| 100 | 3 | ~$9-18 |
| 1,000 | 3 | ~$90-180 |
| 10,000 | 3 | ~$900-1,800 |

---

## 🚀 Deployment

```bash
# Development
npm run dev

# Build
npm run build

# Production (Vercel)
git push origin main  # Auto-deploys via Vercel
```

---

## 📞 Support

**Repository:** https://github.com/rnp2860/boleh-makan-vo  
**Platform:** Vercel  
**Database:** Supabase  

---

*This document is auto-generated for project records. Last updated: January 2, 2026*

