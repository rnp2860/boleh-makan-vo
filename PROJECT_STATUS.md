# BOLEH MAKAN - Project Status (Dec 2025)

## 1. Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI Model:** Groq API (Llama 4 Scout - `meta-llama/llama-4-scout-17b-16e-instruct`)
- **Backend/DB:** Supabase (Storage active, Database pending)
- **Deployment:** Vercel (Connected via GitHub)

## 2. Core Features (Implemented)
- **Vision Analysis:** - Scans food images for ingredients.
  - Estimates macros (Carbs, Protein, Fat, Calories).
  - Provides "Dr. Reza" verdict (Malaysian dietitian persona).
- **Logic Engines:**
  - **"Blindfold Mode":** If user edits ingredients manually, AI ignores the image and recalculates based on text only (fixes hallucination).
  - **"Medical Deficit":** - Weight Loss: -500 kcal
    - Muscle Gain: +300 kcal
    - Diabetes/Hypertension/Cholesterol: -250 kcal (Therapeutic deficit)
    - Maintenance: 0 change
- **User Profile:**
  - Modal with Mobile-first UI (Tap-to-select goals, clear inputs).
  - Custom Calorie Override (User can force a manual limit).
- **Dashboard:**
  - Daily Calorie Tracker (Currently uses `localStorage` in browser).
  - Visual Progress Bar (Green/Red based on limit).

## 3. Current State
- **GitHub:** Repo `boleh-makan-vo` is live and synced.
- **Vercel:** Deployment is active. 
- **Bug Fixes:** - Fixed "Sticky Zero" on inputs.
  - Fixed "Greyed Out" inputs on mobile.
  - Fixed Model Decommission error (Switched to Llama 4).

## 4. Roadmap (To-Do)
- [ ] **Database Connection:** Move Daily Stats from `localStorage` to Supabase DB (so data survives browser clear).
- [ ] **Authentication:** Allow users to Log In to save their history.
- [ ] **History Tab:** View past days/weeks.
- [ ] **Gamification:** Streaks or badges for hitting macro goals.