# Food Resolution Golden Tests

This suite guards the canonical resolver (`lib/food/resolveFood.ts`) from regressions.

## Setup

1) Create `.env.local` in the repo root.
2) Add the required Supabase env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) (Optional) Add any other env needed by your local setup.

## Run

```bash
npm run test:golden
```

## Expected
- Tests should execute (not skip) when the env vars are present.
- If env vars are missing, Vitest will skip the golden suite.

