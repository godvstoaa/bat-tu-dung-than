// [loop 207] Cross-feature consistency — overlapping features must agree.
// Catches user-visible contradictions (e.g., two cards showing different "best hours").
import { analyze, computeLiuNian } from './src/engine/chart.js';
import { bestHourToday } from './src/engine/best-hour.js';
import { dailyBriefing } from './src/engine/daily-briefing.js';
import { analyzeLiunianDeep } from './src/engine/liunian-pro.js';

let fails = 0, checks = 0;
const check = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  ✗ ${label} ${detail}`); } };

for (const [y, m, d, h, g] of [[1990,5,14,13,'nam'],[1988,11,3,23,'nữ'],[1975,7,20,6,'nữ']]) {
  const R = analyze(y, m, d, h, 0, g, 2026);
  const tag = `${g} ${y}`;

  // 1. bestHourToday vs dailyBriefing.bestHours — must agree on the TOP hour (highest score)
  const bh = bestHourToday(R, 2026, 6, 15, R.patternQuality?.patternYong);
  const db = dailyBriefing(R, 2026, 6, 15, R.patternQuality);
  const bhTop = bh.best[0]?.zhi;
  const dbTop = db.bestHours[0]?.zhi;
  check(`${tag} best-hour sources agree on #1`, bhTop === dbTop, `(bestHour=${bhTop} daily=${dbTop})`);

  // 2. computeLiuNian (card) vs analyzeLiunianDeep (brief) — same rating for same year
  for (const yr of [2025, 2026, 2027]) {
    const cardRow = (R.liunian || []).find((l) => l.year === yr)
      || computeLiuNian(y, m, d, h, 0, g, yr).find((l) => l.year === yr);
    const deep = analyzeLiunianDeep(R, yr);
    if (cardRow) {
      check(`${tag} ${yr} liunian card vs deep rating match`, cardRow.rating === deep.rating, `(card=${cardRow.rating} deep=${deep.rating})`);
    }
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Cross-feature consistency: ${checks - fails}/${checks} passed`);
if (fails === 0) console.log('🎉 Overlapping features agree (no user-visible contradictions)');
process.exit(fails > 0 ? 1 : 0);
