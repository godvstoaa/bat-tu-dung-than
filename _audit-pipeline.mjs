// [loop 162 audit] Verify NO analyze() fallback path silently triggers.
// Each fallback default below = a hidden crash. We assert all are populated.
import { analyze } from './src/engine/chart.js';

const cases = [
  // [year, month, day, hour, minute, gender]
  [1990, 5, 14, 13, 0, 'nam'],
  [1988, 11, 3, 23, 30, 'nữ'],
  [2001, 1, 1, 0, 0, 'nam'],
  [1975, 7, 20, 6, 0, 'nữ'],
  [1995, 9, 9, 12, 0, 'nam'],
  [1983, 3, 15, 18, 45, 'nữ'],
  [2005, 12, 31, 5, 15, 'nam'],
];

let fails = 0, checks = 0;
const check = (label, cond, detail = '') => {
  checks++;
  if (!cond) { fails++; console.log(`  ✗ ${label} ${detail}`); }
};

for (const [y, m, d, h, mi, g] of cases) {
  const R = analyze(y, m, d, h, mi, g, 2026);
  const tag = `${g} ${y}/${m}/${d} ${h}:${mi}`;
  // 1. liunian MUST be populated (the loop-161 bug)
  check(`${tag} liunian.length>0`, Array.isArray(R.liunian) && R.liunian.length > 0, `(len=${R.liunian?.length})`);
  // each liunian row has score & rating (not undefined)
  if (R.liunian?.length) {
    const bad = R.liunian.filter((r) => typeof r.score !== 'number' || typeof r.rating !== 'string');
    check(`${tag} liunian rows have score+rating`, bad.length === 0, `(${bad.length} bad)`);
  }
  // 2. dayun MUST be populated
  check(`${tag} dayun.length>0`, Array.isArray(R.dayun) && R.dayun.length > 0, `(len=${R.dayun?.length})`);
  // 3. synthesis MUST have paragraphs (not fallback {paragraphs:[]})
  check(`${tag} synthesis.paragraphs>0`, Array.isArray(R.synthesis?.paragraphs) && R.synthesis.paragraphs.length > 0, `(len=${R.synthesis?.paragraphs?.length})`);
  // 4. patternQuality populated (not null fallback)
  check(`${tag} patternQuality!=null`, R.patternQuality != null);
  if (R.patternQuality) {
    check(`${tag} patternQuality.quality defined`, typeof R.patternQuality.quality === 'string' && R.patternQuality.quality.length > 0);
    check(`${tag} patternQuality has summary`, typeof R.patternQuality.summary === 'string' && R.patternQuality.summary.length > 0);
  }
  // 5. liuqin populated (not [] fallback)
  check(`${tag} liuqin.length>0`, Array.isArray(R.liuqin) && R.liuqin.length > 0, `(len=${R.liuqin?.length})`);
  // 6. remedy populated (not {twelveLaws:[]} fallback)
  check(`${tag} remedy.twelveLaws>0`, Array.isArray(R.remedy?.twelveLaws) && R.remedy.twelveLaws.length > 0, `(len=${R.remedy?.twelveLaws?.length})`);
  // 7. yong MUST be defined (the heart of the reading)
  check(`${tag} yong defined`, R.yong != null && typeof R.yong === 'object');
  if (R.yong) {
    check(`${tag} yong.primary (用神) defined`, typeof R.yong.primary === 'string' && R.yong.primary.length > 0, `(${R.yong.primary})`);
    check(`${tag} yong has method`, typeof R.yong.method === 'string' || R.yong.method != null);
  }
  // 8. kongwang present (object, not null) — analyzeKongwang should work
  check(`${tag} kongwang object`, R.kongwang != null && typeof R.kongwang === 'object');
  // 9. wx has all 5 elements
  check(`${tag} wx.score 5 elements`, R.wx?.score && Object.keys(R.wx.score).length === 5);
  // 10. each liunian rating is in the known set (scoreLiunianYear vocab)
  if (R.liunian?.length) {
    const validRatings = ['Đại cát', 'Cát', 'Bình', 'Hơi kỵ', 'Hung', 'Đại hung'];
    const weirdbird = R.liunian.filter((r) => !validRatings.includes(r.rating));
    check(`${tag} liunian ratings valid`, weirdbird.length === 0, `(weird: ${[...new Set(weirdbird.map((r) => r.rating))].join(',')})`);
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Pipeline audit: ${checks - fails}/${checks} passed, ${fails} fail`);
if (fails === 0) console.log('🎉 NO silent fallback triggered — pipeline healthy');

// --- [loop 162] rateClass regression guard ---
// Lưu Niên (scoreLiunianYear) ratings MUST get a colored class, never rate-mid
// for extreme values. Previously 'Đại cát'/'Đại hung'/'Hơi kỵ' fell to rate-mid.
import fs from 'fs';
const expected = {
  'Đại cát': 'rate-cat', 'Cát': 'rate-cat',
  'Bình hòa': 'rate-mid', 'Bình': 'rate-mid',
  'Hơi nghịch': 'rate-bad', 'Hơi kỵ': 'rate-bad',
  'Hung': 'rate-hung', 'Đại hung': 'rate-hung',
};
const src = fs.readFileSync('./src/main.js', 'utf8');
const rcMatch = src.match(/function rateClass\(rating\)\s*\{([\s\S]*?)\n\}/);
let rcFails = 0;
if (!rcMatch) { console.log('  ✗ rateClass not found'); rcFails++; }
else {
  const body = rcMatch[1];
  for (const [label, cls] of Object.entries(expected)) {
    if (!body.includes(`'${label}'`)) { console.log(`  ✗ rateClass missing '${label}' → ${cls}`); rcFails++; }
  }
}
console.log(`rateClass guard: ${rcFails === 0 ? '✓ both vocabs covered' : rcFails + ' missing'}`);
process.exit((fails + rcFails) > 0 ? 1 : 0);

