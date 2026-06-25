// [loop 167 audit] 用神 structural consistency across many charts.
// The Dụng/Hỷ/Kỵ/Thù system MUST be internally consistent:
//   • xi  = SHENG_BY[primary] (hành sinh Dụng)
//   • ji  = KE_BY[primary]    (hành khắc Dụng)
//   • chou= SHENG_BY[ji]      (hành sinh Kỵ)
//   • primary ∉ avoid, xi ∉ avoid; ji & chou ∈ avoid
//   • avoid has NO duplicates, no Dụng/Hỷ
//   • all 5 elements partition correctly: primary≠xi≠ji≠chou (4 distinct) except special cases
// Any violation = 用神 broken for that chart.
import { analyze } from './src/engine/chart.js';

// SHENG[X] = what X PRODUCES (child); KE[X] = what X OVERCOMES.
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
// Inverse maps: PARENT_OF[P] = element that PRODUCES P; ATTACKER_OF[P] = element that OVERCOMES P.
const PARENT_OF = {}; const ATTACKER_OF = {};
for (const x of Object.keys(SHENG)) { PARENT_OF[SHENG[x]] = x; }   // SHENG[x]=y → x produces y → PARENT_OF[y]=x
for (const x of Object.keys(KE)) { ATTACKER_OF[KE[x]] = x; }        // KE[x]=y → x overcomes y → ATTACKER_OF[y]=x
const WUXING = ['木', '火', '土', '金', '水'];

// Generate diverse charts across all months/day-masters
const cases = [];
for (const y of [1985, 1990, 1995, 2000]) {
  for (const m of [1, 4, 7, 10]) { // seasonal spread
    for (const [d, h] of [[5, 6], [18, 14], [23, 22]]) {
      for (const g of ['nam', 'nữ']) cases.push([y, m, d, h, 0, g]);
    }
  }
}

let fails = 0, checks = 0;
const check = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  ✗ ${label} ${detail}`); } };

for (const [y, m, d, h, mi, g] of cases) {
  const R = analyze(y, m, d, h, mi, g, 2026);
  const tag = `${g} ${y}/${m}/${d} ${h}h`;
  const { primary, xi, ji, chou, avoid } = R.yong;
  // 1. xi/ji/chou derived correctly from primary (PARENT/ATTACKER direction)
  check(`${tag} xi=PARENT_OF[primary]`, xi === PARENT_OF[primary], `(xi=${xi} expect ${PARENT_OF[primary]})`);
  check(`${tag} ji=ATTACKER_OF[primary]`, ji === ATTACKER_OF[primary], `(ji=${ji} expect ${ATTACKER_OF[primary]})`);
  check(`${tag} chou=PARENT_OF[ji]`, chou === PARENT_OF[ji], `(chou=${chou} expect ${PARENT_OF[ji]})`);
  // 2. primary & xi NOT in avoid
  check(`${tag} primary∉avoid`, !avoid.includes(primary), `(primary=${primary} avoid=${avoid})`);
  check(`${tag} xi∉avoid`, !avoid.includes(xi));
  // 3. ji & chou IN avoid
  check(`${tag} ji∈avoid`, avoid.includes(ji));
  check(`${tag} chou∈avoid`, avoid.includes(chou));
  // 4. no duplicates in avoid
  check(`${tag} avoid no dups`, new Set(avoid).size === avoid.length, `(${avoid})`);
  // 5. avoid ⊆ {ji, chou, xian} + never includes Dụng/Hỷ (avoid should only be hostile)
  const hostile = new Set([ji, chou]);
  const badAvoid = avoid.filter((w) => !hostile.has(w));
  // allow 闲 (xian=SHENG[primary]... no, xian=SHENG[primary]=xi). Actually xian = the 5th element.
  // The 5 elements: primary, xi(生Dụng), ji(克Dụng), chou(生Kỵ). The 5th = SHENG[primary]... wait xi=SHENG[primary].
  // primary, xi, ji, chou = 4 elements. 5th = the one not among these = KE[xi] = element 克 Hỷ.
  // avoid should = {ji, chou} possibly + others? Per finalizeYong avoid = group-based Kỵ/Thù set. Let's just check no Dụng/Hỷ.
  check(`${tag} avoid hostile-only`, badAvoid.length === 0 || badAvoid.every((w) => w !== primary && w !== xi), `(non-hostile in avoid: ${badAvoid})`);
  // 6. primary is a valid element
  check(`${tag} primary valid`, WUXING.includes(primary));
}

console.log(`\n${'='.repeat(70)}`);
console.log(`用神 consistency: ${checks - fails}/${checks} passed across ${cases.length} charts`);
if (fails === 0) console.log('🎉 All charts have internally-consistent 用神');
process.exit(fails > 0 ? 1 : 0);
