// ============================================================================
//  studio-analyze.js — bảng Tứ Trụ / dụng thần / đại vận, không synthesize /100
// ============================================================================
import {
  buildChart, scoreWuXing, analyzeStrength, findYongShen, computeDaYun,
} from '../engine/chart.js';
import { detectInteractions } from '../engine/interactions.js';
import { computePattern } from '../engine/pattern.js';

export function pillarLine(p) {
  return `${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${p.time.gan}${p.time.zhi}`;
}

export function analyzeStudio(input) {
  const year = Number(input.year);
  const month = Number(input.month);
  const day = Number(input.day);
  const hour = input.hour == null ? 12 : Number(input.hour);
  const minute = input.minute == null ? 0 : Number(input.minute);
  const gender = input.gender === 'nu' ? 'nu' : 'nam';
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
