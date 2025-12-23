# BOLEH MAKAN - Project Status (Dec 2025)

## 1. Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI Model:** Groq API (Llama 4 Scout - `meta-llama/llama-4-scout-17b-16e-instruct`)
- **Backend/DB:** Supabase (Storage active, Database pending)
- **Deployment:** Vercel (Connected via GitHub)

## 2. Core Features (Implemented)
- **Vision Analysis:** Scans food images -> identifies ingredients -> estimates macros.
- **Logic Engines:**
  - **"Blindfold Mode":** AI prioritizes manual text edits over image analysis (anti-hallucination).
  - **"Medical Deficit":** Adjusts targets for Weight Loss (-500), Muscle Gain (+300), and Sickness (-250).
- **User Profile:** Mobile-first modal with "tap-to-select" inputs and custom calorie overrides.
- **Dashboard:** Real-time calorie tracker (currently LocalStorage) with visual progress bar.

## 3. Current State
- **GitHub:** Repo `boleh-makan-vo` is live and synced.
- **Vercel:** Deployment is active.
- **Bug Fixes:** Solved "Sticky Zero" inputs and mobile UI contrast issues.

## 4. IMMEDIATE ACTION PLAN (Hour 5 & 6)

### Phase 1: "Humanizing" Dr. Reza (Design & Assets)
- [ ] **Asset Injection:** Create `public/assets/` folder.
  - Upload `avatar-header.png` (Pixar-style Dr. Reza).
  - Upload `avatar-profile.png` (Dr. Reza + Word Cloud).
  - Upload 6x `icon-[goal].png` (Upin & Ipin style 3D icons for goals).
- [ ] **UI Overhaul:**
  - **Header:** Replace text with Avatar + Speech Bubble ("Jom makan sihat!").
  - **Profile:** Replace text buttons with the new Visual Grid of icons.

### Phase 2: The Accuracy Engine (Logic Guardrails)
- [ ] **Portion Control UI:** Add `0.5x`, `1x`, `1.5x` buttons to result card for instant math correction.
- [ ] **Reference Anchoring:** Create `data/food-db.ts` with "Golden Standard" calories for top 20 Malaysian foods (Nasi Lemak, Teh Tarik, etc.).
- [ ] **Prompt Engineering (Chain-of-Thought):**
  - Force AI to: *List Inventory -> Estimate Volume -> Check Reference DB -> Calculate.*
- [ ] **Consistency Config:** Set API `temperature` to `0.1` to stop random guessing.
- [ ] **Transparency:** Show itemized breakdown (Receipt style) so users can see *what* was counted.

### Phase 3: Backend (Data Persistence)
- [ ] **Database:** Connect Supabase to store User Profiles and Food Logs permanently.
- [ ] **Auth:** Simple login (Email/Google) so users own their data.
- [ ] **History Tab:** View past daily logs.

## 5. Future Scalability (Post-MVP)
- **Native Mobile App:** Port to React Native + Expo (for App Store/Play Store launch).
- **Growth & Marketing:** Use **Gamma.app** to generate landing pages and pitch decks for investor presentations.