// ============================================================================
//  sample-case.js — case Chart Lab mẫu xác định
// ============================================================================
import { analyze } from '../engine/chart.js';

export const SAMPLE = {
  year: 1990, month: 6, day: 15, hour: 10, minute: 0, gender: 'nam',
  label: '1990-06-15 10:00 nam',
};

export function buildSampleResult() {
  const R = analyze(SAMPLE.year, SAMPLE.month, SAMPLE.day, SAMPLE.hour, SAMPLE.minute, SAMPLE.gender);
  const p = R.chart.pillars;
  const pillars = `${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${p.time.gan}${p.time.zhi}`;
  return { R, pillars, sample: SAMPLE };
}
