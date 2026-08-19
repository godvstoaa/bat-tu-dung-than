// ============================================================================
//  studio-analyze.js — trụ + dụng thần + đại vận; synthesize bị stub, không điểm mệnh
// ============================================================================
import {
  buildChart, scoreWuXing, analyzeStrength, findYongShen, computeDaYun,
} from '../engine/chart.js';
import { detectInteractions } from '../engine/interactions.js';
import { computePattern } from '../engine/pattern.js';

export function pillarLine(p) {
  return `${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${p.time.gan}${p.time.zhi}`;
}

function normGender(g) {
  const s = String(g || '').toLowerCase();
  if (s === 'nu' || s === 'nữ' || s === 'female') return 'nu';
  return 'nam';
}

/** R-shape family.js expects; synthesize bị stub. */
export function toFamilyR(input) {
  const studio = analyzeStudio(input);
  return {
    chart: studio.chart,
    wx: studio.wx,
    strength: studio.strength,
    interactions: studio.interactions,
    pattern: studio.pattern,
    yong: studio.yong,
    dayun: studio.dayun,
    synthesis: { score: 50 },
    pillars: studio.pillars,
  };
}

export function analyzeStudio(input) {
  const year = Number(input.year);
  const month = Number(input.month);
  const day = Number(input.day);
  const hour = input.hour == null ? 12 : Number(input.hour);
  const minute = input.minute == null ? 0 : Number(input.minute);
  const gender = normGender(input.gender);
  const chart = buildChart(year, month, day, hour, minute, gender);
  const wx = scoreWuXing(chart);
  const strength = analyzeStrength(chart, wx);
  const interactions = detectInteractions(chart.pillars);
  const pattern = computePattern(chart, wx, strength, interactions);
  const yong = findYongShen(chart, wx, strength, pattern, interactions);
  const dayun = computeDaYun(year, month, day, hour, minute, gender, yong);
  return {
    input: { year, month, day, hour, minute, gender },
    chart, wx, strength, interactions, pattern, yong, dayun,
    pillars: pillarLine(chart.pillars),
  };
}
