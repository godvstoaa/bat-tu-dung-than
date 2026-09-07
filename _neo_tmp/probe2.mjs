// probe2 — giá trị mới cho các assertion còn lại (lmG, year-daily, decade, 2036, floors, ku)
import { analyze } from '../src/engine/chart.js';
import { computeLiuyue } from '../src/engine/liuyue.js';
import { scanWealthCareerYingqi } from '../src/engine/yingqi-wealth.js';
import { scanBranchYingqi } from '../src/engine/yingqi-branch.js';
import { rankDayun } from '../src/engine/dayun-rank.js';

const RU = analyze(1990, 6, 15, 10, 0, 'nam', 2026);
const lmG = computeLiuyue(RU, 2026, RU.patternQuality);
console.log('══ RU (1990-06-15) lưu nguyệt ══');
(lmG.best || []).slice(0, 4).forEach((m) => console.log(`  best T${m.m + 1} ${m.ganZhi} gejuDelta=${m.gejuDelta}`));

// year-daily cho RU
try {
  const { yearDaily } = await import('../src/engine/year-daily.js');
  const yd = yearDaily(RU, 2026);
  const days = (yd.days || yd || []);
  const top = (Array.isArray(days) ? days : []).filter((d) => d.gejuDelta != null).sort((a, b) => (b.gejuDelta || 0) - (a.gejuDelta || 0)).slice(0, 3);
  console.log('  year-daily top gejuDelta:', top.map((d) => d.date + ':' + d.gejuDelta).join(', '));
  console.log('  year-daily min gejuDelta among top?:', (Array.isArray(days) ? days : []).filter((d) => d.gejuDelta > 0).length, 'positive days');
} catch (e) { console.log('  year-daily probe err:', e.message.slice(0, 80)); }

const spR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
console.log('\n══ spR 1993 details ══');
console.log('  yong: primary=' + spR.yong.primary + ' xi=' + spR.yong.xi + ' ji=' + spR.yong.ji);
const wc = scanWealthCareerYingqi(spR, 2026, 12);
console.log('  wc.caiStatus:', wc.caiStatus, '| guanStatus:', wc.guanStatus);
console.log('  wc.caiYears:', (wc.caiYears || []).map((x) => x.year).join(','));
const by = scanBranchYingqi(spR, 2026, 12);
const b2035 = (by.events || []).find((e) => e.year === 2035 && e.branch === '酉');
console.log('  by2035:', b2035 ? JSON.stringify({ type: b2035.type, groups: (b2035.groups || []).map((g) => g.group) }) : 'none');
const b2036 = (by.events || []).find((e) => e.year === 2036);
console.log('  by2036:', JSON.stringify({ grade: b2036 && b2036.grade, tone: b2036 && b2036.tone, dy: b2036 && b2036.dy, type: b2036 && b2036.type }));
console.log('  by.catYears:', JSON.stringify(by.catYears || []));
console.log('  by.peakYears:', JSON.stringify(by.peakYears || []));
const dr = rankDayun(spR);
const arr = dr.ranked || dr;
console.log('  decade ranked top2:', (Array.isArray(arr) ? arr : []).slice(0, 2).map((x) => x.ganZhi + '(' + x.totalScore + ')').join(' vs '));
const dz2036 = (Array.isArray(arr) ? arr : []).find((x) => x.ganZhi === '丙辰');
console.log('  丙辰 decade:', dz2036 ? JSON.stringify({ score: dz2036.totalScore, interaction: dz2036.interaction }) : 'n/a');

// ku
import { analyzeKu } from '../src/engine/ku.js';
const ku = analyzeKu(spR, 2026);
console.log('  ku locked labels:', (ku.locked || []).map((k) => k.storeLabel + '(' + (k.wx || '') + ')').join(','), '| events:', JSON.stringify((ku.events || []).slice(0, 3).map((e) => e.year + ':' + e.tone)));

// ideal floors
import { idealHouse } from '../src/engine/ideal-house.js';
const ih = idealHouse(spR, 20);
console.log('  ideal floors:', (ih.idealFloors || []).map((f) => f.floor + '=' + f.wx).join(','));
console.log('  avoid floors:', (ih.avoidFloors || []).map((f) => f.floor + '=' + f.wx).join(','));

// tonggen for spR
import { analyzeTongGen } from '../src/engine/tonggen.js';
const tg = analyzeTongGen(spR);
console.log('  tonggen dung verdict:', tg.dung.verdict, '| whenReveal:', (tg.whenReveal || []).join(','));
