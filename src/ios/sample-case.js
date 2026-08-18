// ============================================================================
//  sample-case.js — case studio mẫu (không gọi analyze() đầy đủ)
// ============================================================================
import { analyzeStudio } from './studio-analyze.js';

export const SAMPLE = {
  year: 1990, month: 6, day: 15, hour: 10, minute: 0, gender: 'nam',
  label: '1990-06-15 10:00 nam',
};

export function buildSampleResult() {
  const R = analyzeStudio(SAMPLE);
  return { R, pillars: R.pillars, sample: SAMPLE };
}
