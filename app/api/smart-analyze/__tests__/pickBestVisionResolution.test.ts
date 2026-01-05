import { describe, it, expect } from 'vitest';
import { pickBestVisionResolution } from '../route';

const mkResolution = (source: 'malaysian_db' | 'ai_estimate', confidence: number) => ({
  source,
  confidence,
  matchedFood: source === 'malaysian_db' ? { name_en: 'Test', name_bm: 'Uji' } : undefined,
  debug: { strategy: 'fuzzy' as const },
});

describe('pickBestVisionResolution', () => {
  it('prefers malaysian_db with highest confidence', () => {
    const candidates = [{ name: 'nasi lemak', confidence: 0.9 }, { name: 'roti canai', confidence: 0.8 }];
    const result = pickBestVisionResolution(candidates as any, [
      { candidate: candidates[0] as any, resolution: mkResolution('malaysian_db', 0.85) as any },
      { candidate: candidates[1] as any, resolution: mkResolution('malaysian_db', 0.9) as any },
    ]);
    expect(result?.candidate.name).toBe('roti canai');
  });

  it('falls back to first when no db match', () => {
    const candidates = [{ name: 'unknown', confidence: 0.6 }, { name: 'other', confidence: 0.5 }];
    const result = pickBestVisionResolution(candidates as any, [
      { candidate: candidates[0] as any, resolution: mkResolution('ai_estimate', 0.6) as any },
      { candidate: candidates[1] as any, resolution: mkResolution('ai_estimate', 0.7) as any },
    ]);
    expect(result?.candidate.name).toBe('unknown');
  });
});

