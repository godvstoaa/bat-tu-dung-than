// [loop 163 audit] Verify every brief section produces content.
// Each section is wrapped in try/catch → silent empty on failure. If a section's
// engine fn is mis-imported/mis-called, it vanishes from AI context. We call
// extendBrief across many charts and flag any section that NEVER appears.
import { analyze } from './src/engine/chart.js';
import { extendBrief } from './src/engine/brief-extender.js';

const cases = [
  [1990, 5, 14, 13, 0, 'nam'], [1988, 11, 3, 23, 30, 'nữ'],
  [2001, 1, 1, 0, 0, 'nam'], [1975, 7, 20, 6, 0, 'nữ'],
  [1995, 9, 9, 12, 0, 'nam'], [1983, 3, 15, 18, 45, 'nữ'],
  [2005, 12, 31, 5, 15, 'nam'], [1992, 6, 6, 9, 0, 'nữ'],
  [1979, 2, 14, 21, 0, 'nam'], [1997, 10, 28, 15, 30, 'nữ'],
];

// Sections expected on essentially every chart (non-conditional, or conditional-but-common).
// KHÔNG VONG excluded — it's correctly gated on R.kongwang.affected.length (only charts
// with a void pillar show it).
const REQUIRED = [
  'HÀN-NOÃN-TÁO-THẤP', 'NGŨ HÀNH LƯU THÔNG', 'MỆNH CÁCH TẦNG LỚP',
  'MỆNH CUNG', 'TỬ NỮ', 'THAI NGUYÊN', 'TÀI KHỐ', 'SỨC KHOẺ',
  'ĐẠI VẬN THẬP THẦN', 'ĐẠI VẬN TƯƠNG TÁC', 'NGŨ ĐỨC', 'NẠP ÂM QUAN HỆ',
  'PHỐI NGÃU', 'SỰ NGHIỆP', 'HỌC VẤN', 'MỆNH CHỦ/THÂN CHỦ', 'DÒNG ĐỜI',
];
// Conditional section — verify it appears for charts WITH a void pillar.
const CONDITIONAL = { 'KHÔNG VONG': 'R.kongwang.affected.length > 0' };

const sectionCounts = {};
let totalLen = 0, minLen = Infinity;
for (const [y, m, d, h, mi, g] of cases) {
  const R = analyze(y, m, d, h, mi, g, 2026);
  let brief;
  try { brief = extendBrief(R); }
  catch (e) { console.log(`✗ extendBrief THREW for ${g} ${y}: ${e.message}`); continue; }
  if (typeof brief !== 'string') { console.log(`✗ extendBrief returned non-string for ${g} ${y}: ${typeof brief}`); continue; }
  totalLen += brief.length;
  minLen = Math.min(minLen, brief.length);
  for (const sec of REQUIRED) {
    if (brief.includes(sec)) sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
  }
}

let fails = 0;
console.log(`Brief section coverage across ${cases.length} charts (min len/chart: ${minLen}, avg: ${(totalLen/cases.length).toFixed(0)} chars):\n`);
for (const sec of REQUIRED) {
  const c = sectionCounts[sec] || 0;
  const ok = c >= Math.ceil(cases.length * 0.8); // present in ≥80% of charts
  if (!ok) fails++;
  console.log(`  ${ok ? '✓' : '✗'} ${sec.padEnd(24)} ${c}/${cases.length}${ok ? '' : '  ← MISSING (section broken?)'}`);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Brief audit: ${REQUIRED.length - fails}/${REQUIRED.length} required sections healthy`);
// Conditional check: 空亡 must appear for charts that have a void pillar.
let condFail = 0;
for (const [sec, _cond] of Object.entries(CONDITIONAL)) {
  // Re-scan: for each chart WITH a void pillar, the section must appear.
  let voidCharts = 0, voidWithSection = 0;
  for (const [y, m, d, h, mi, g] of cases) {
    const R = analyze(y, m, d, h, mi, g, 2026);
    if (R.kongwang && R.kongwang.affected && R.kongwang.affected.length) {
      voidCharts++;
      const brief = extendBrief(R);
      if (typeof brief === 'string' && brief.includes(sec)) voidWithSection++;
    }
  }
  const ok = voidWithSection === voidCharts;
  if (!ok) condFail = 1;
  console.log(`  ${ok ? '✓' : '✗'} ${sec.padEnd(24)} conditional: appears in ${voidWithSection}/${voidCharts} void-pillar charts`);
}
if (fails === 0 && condFail === 0) console.log('🎉 All brief sections produce content (incl. conditional 空亡)');
process.exit((fails + condFail) > 0 ? 1 : 0);
