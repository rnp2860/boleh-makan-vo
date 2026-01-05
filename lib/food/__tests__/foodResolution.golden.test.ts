import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { resolveFood, _testing } from '../resolveFood';

type GoldenCase = {
  inputType: 'text';
  input: string;
  expectedContainsAny: string[];
  mustUseDatabase: boolean;
};

const GOLDEN_CASES: GoldenCase[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'food_golden_cases.json'), 'utf-8')
);

const NEGATIVE_CASES: { input: string }[] = [
  { input: 'random nonsense xyz' },
  { input: 'abcdefg dish' },
  { input: 'plastic spoon meal' },
  { input: 'unknown food foo bar' },
  { input: 'just water please' },
  { input: 'mystery space rock' }
];

const CASE_TIMEOUT = 20000;
const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const describeIfConfigured = SUPABASE_CONFIGURED ? describe : describe.skip;

if (!SUPABASE_CONFIGURED) {
  // eslint-disable-next-line no-console
  console.warn(
    'Skipping food resolution golden tests because Supabase env vars are not configured.'
  );
}

describeIfConfigured('food resolution golden cases', () => {
  GOLDEN_CASES.forEach((testCase) => {
    it(
      `resolves "${testCase.input}" via database`,
      async () => {
        const result = await resolveFood({
          inputType: 'text',
          rawName: testCase.input
        });

        if (testCase.mustUseDatabase) {
          expect(result.source).toBe('malaysian_db');
          expect(result.confidence).toBeGreaterThanOrEqual(_testing.MIN_DB_CONFIDENCE);
          expect(result.matchedFood).toBeTruthy();

          const resolvedText = `${result.matchedFood?.name_en || ''} ${result.matchedFood?.name_bm || ''}`.toLowerCase();
          const matched = testCase.expectedContainsAny.some((token) =>
            resolvedText.includes(token.toLowerCase())
          );

          expect(matched).toBe(true);
        } else {
          expect(result.source).toBe('ai_estimate');
        }
      },
      CASE_TIMEOUT
    );
  });
});

describeIfConfigured('food resolution negative cases', () => {
  NEGATIVE_CASES.forEach((testCase) => {
    it(
      `falls back to AI for "${testCase.input}"`,
      async () => {
        const result = await resolveFood({
          inputType: 'text',
          rawName: testCase.input
        });

        expect(result.source).toBe('ai_estimate');
      },
      CASE_TIMEOUT
    );
  });
});

