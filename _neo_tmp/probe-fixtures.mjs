// probe-fixtures.mjs — tính giá trị MỚI cho từng fixture test bị ảnh hưởng bởi fix 合去
import { analyze } from '../src/engine/chart.js';

import { analyzeTongGen } from '../src/engine/tonggen.js';
import { analyzeKu } from '../src/engine/ku.js';
import { starPower } from '../src/engine/star-power.js';
import { scanWealthCareerYingqi } from '../src/engine/yingqi-wealth.js';
import { scanBranchYingqi } from '../src/engine/yingqi-branch.js';
import { scanFuyin } from '../src/engine/fuyin.js';
import { sanyuanJiuyun } from '../src/engine/sanyuan-jiuyun.js';
import { idealHouse } from '../src/engine/ideal-house.js';
import { buildChartBrief } from '../src/engine/ai.js';

function show(name, R) {
  const c = R.chart, s = R.strength, y = R.yong, pq = R.patternQuality, pat = R.pattern;
  console.log(`\n══ ${name}: ${c.pillars.year.gan}${c.pillars.year.zhi} ${c.pillars.month.gan}${c.pillars.month.zhi} ${c.pillars.day.gan}${c.pillars.day.zhi} ${c.pillars.time.gan}${c.pillars.time.zhi} ══`);
  console.log(`  ${s.level} ${(s.ratio * 100).toFixed(1)}% | cách: ${pat.vi} | PQ: ${pq ? pq.quality : '?'}`);
  if (pq && pq.diseases) pq.diseases.forEach((d) => console.log(`    bệnh: [${d.via}] ${(d.note || '').slice(0, 90)}`));
  if (pq && pq.heTiedNote) console.log(`    合绊: ${(pq.heTiedNote || '').slice(0, 90)}`);
  console.log(`  DỤNG: ${y.primary} | ${y.method.join('+')} | ${(y.reasons || []).join(' ').slice(0, 160)}`);
  const tg = analyzeTongGen(R);
  console.log(`  tonggen Dụng: ${tg.dung.verdict} | whenReveal: ${(tg.whenReveal || []).join(',')}`);
  const sp = starPower(R);
  const tai = sp.items.find((x) => x.key === 'cai');
  const quan = sp.items.find((x) => x.key === 'guan');
  if (tai) console.log(`  starPower Tài: ${tai.wx} ${tai.verdict} | Quan: ${quan ? quan.wx + ' ' + quan.verdict : '-'}`);
}

// 1. spR — 1993-10-21 00:30 nam (fixture chính: starPower/tonggen/ku/yingqi/decade/败格)
const spR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
show('spR 1993-10-21 00:30', spR);
const wc = scanWealthCareerYingqi(spR, 2026, 12);
console.log('  yingqi caiYears:', (wc.caiYears || []).map((x) => x.year).slice(0, 8).join(','));
const by = scanBranchYingqi(spR, 2026, 12);
const b2035 = (by.events || []).find((e) => e.year === 2035);
const b2026 = (by.events || []).find((e) => e.year === 2026);
const b2036 = (by.events || []).find((e) => e.year === 2036);
console.log('  branch 2035:', b2035 ? b2035.type + ' groups=' + (b2035.groups || []).map((g) => g.group).join('/') : '(none)');
console.log('  branch 2026:', b2026 ? b2026.type + ' groups=' + (b2026.groups || []).map((g) => g.group).join('/') : '(none)');
console.log('  branch 2036:', b2036 ? b2036.type + ' grade=' + (b2036.grade || '') + ' tone=' + (b2036.tone || '') + ' dy=' + (b2036.dy || '') : '(none)');
console.log('  catYears:', (by.catYears || []).slice(0, 10).join(','));
const ku = analyzeKu(spR, 2026);
console.log('  ku locked:', (ku.locked || []).map((k) => k.storeLabel).join(','), '| unlocked events:', (ku.events || []).length);
const ih = idealHouse(spR, 20);
console.log('  idealHouse floors tốt:', (ih.idealFloors || []).slice(0, 4).map((f) => f.floor + '=' + f.wx).join(', '), '| avoid:', (ih.avoidFloors || []).slice(0, 3).map((f) => f.floor + '=' + f.wx).join(', '));
const sy = sanyuanJiuyun(spR, 2026);
console.log('  cửu vận align:', (sy.align || '').slice(0, 80));
const tq = (t) => { try { const a = analyze(1993, 10, 21, 0, 30, 'nam', 2026); } catch (e) {} };
// decade best (dayun rank) cho spR
try {
  const { rankDayun } = await import('../src/engine/dayun-rank.js');
  const dr = rankDayun(spR);
  const top = (dr.ranked || dr || []).slice(0, 2);
  console.log('  decade top:', JSON.stringify(top).slice(0, 200));
} catch (e) { console.log('  rankDayun probe err:', e.message); }

// 2. fuR — fuyin fixture (same chart 00:30)
const fuR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const fpm = scanFuyin(fuR, 1995).items.find((i) => i.type === '伏吟' && i.pillar === 'day');
const zf = scanFuyin(fuR, 2019).items.find((i) => i.type === '支伏吟' && i.pillar === 'day');
const pn = scanFuyin(fuR, 2001).items[0];
console.log(`\n══ fuyin (1995/2019/2001): sev PhụcNgâm=${fpm && fpm.severity} ChiPhục=${zf && zf.severity} PhảnNgâm=${pn && pn.severity}`);

// 3. R1990 — lưu nguyệt geju
const RU = analyze(1990, 6, 15, 10, 0, 'nam', 2026);
const lmG = computeLiuyue(RU, 2026, RU.patternQuality);
console.log(`\n══ RU lưu nguyệt: best gejuDelta min = ${Math.min(...(lmG.best || []).map((m) => m.gejuDelta))} (cần ≥0)`);

