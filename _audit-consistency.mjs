// [loop 207] Cross-feature consistency — overlapping features must broadly agree.
// (Relaxed from v1: exact-match was too strict — these are independent composites /
//  different analysis levels, so we check OVERLAP / polarity-bucket agreement, not exact.)
import { analyze } from './src/engine/chart.js';
import { bestHourToday } from './src/engine/best-hour.js';
import { dailyBriefing } from './src/engine/daily-briefing.js';
import { analyzeLiunianDeep } from './src/engine/liunian-pro.js';

let fails = 0, checks = 0;
const check = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  ✗ ${label} ${detail}`); } };

// polarity bucket: cat / bình / hung (Đại cát/Cát → cat; Bình → bình; Hơi kỵ/Hung/Đại hung → hung)
const bucket = (r) => {
  if (!r) return '?';
  if (r.includes('cát') || r === 'Cát') return 'cat';
  if (r === 'Bình') return 'bình';
  return 'hung'; // Hơi kỵ / Hung / Đại hung / Kỵ
};

for (const [y, m, d, h, g] of [[1990,5,14,13,'nam'],[1988,11,3,23,'nữ'],[1975,7,20,6,'nữ'],[2000,4,5,6,'nam']]) {
  const R = analyze(y, m, d, h, 0, g, 2026);
  const tag = `${g} ${y}`;

  // 1. bestHourToday vs dailyBriefing.bestHours — top-3 must OVERLAP ≥2
  //   (independent composites w/ different weights → exact #1 may differ on near-ties,
  //   but they should broadly agree on the good hours)
  const bh = bestHourToday(R, 2026, 6, 15, R.patternQuality?.patternYong);
  const db = dailyBriefing(R, 2026, 6, 15, R.patternQuality);
  const bhSet = new Set((bh.best || []).slice(0, 3).map((x) => x.zhi));
  const dbSet = new Set((db.bestHours || []).slice(0, 3).map((x) => x.zhi));
  const overlap = [...bhSet].filter((z) => dbSet.has(z)).length;
  check(`${tag} best-hour top-3 overlap ≥2`, overlap >= 2, `(overlap=${overlap}, bestHour=[${[...bhSet]}] daily=[${[...dbSet]}])`);

  // 2. liunian card (adjusted) vs deep — must agree on POLARITY bucket
  //   (card = scoreLiunianYear + 格局 layer; deep = scoreLiunianYear + 进气退气 — different
  //   refinements, but both should put the year in the same cat/bình/hung bucket)
  for (const yr of [2025, 2026, 2027]) {
    const cardRow = (R.liunian || []).find((l) => l.year === yr);
    if (!cardRow) continue;
    const deep = analyzeLiunianDeep(R, yr);
    check(`${tag} ${yr} liunian polarity match`, bucket(cardRow.rating) === bucket(deep.rating), `(card=${cardRow.rating}[${bucket(cardRow.rating)}] deep=${deep.rating}[${bucket(deep.rating)}])`);
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Cross-feature consistency: ${checks - fails}/${checks} passed`);
if (fails === 0) console.log('🎉 Overlapping features broadly agree (no polarity contradictions)');
process.exit(fails > 0 ? 1 : 0);
