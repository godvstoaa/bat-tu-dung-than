// ============================================================================
//  REGRESSION FINAL — kiểm tra toàn diện sau 22 chu kỳ intensive multi-agent
//  (52 bugs fixed, 17 new features, 170 modules).
//
//  Mục tiêu:
//    1. analyze() + buildChartBrief() trên 12 lá số đa dạng (1930-2010).
//    2. Với MỖI lá số, test TẤT CẢ 17 module feature mới.
//    3. Check: 0 crash, 0 undefined leak.
//    4. Báo cáo: total calls, total passes, mọi failure.
//
//  Chạy: node regression-final.mjs
// ============================================================================
import { analyze } from './src/engine/chart.js';
import { buildChartBrief } from './src/engine/ai.js';
import { chenggu } from './src/engine/chenggu.js';
import { analyzeLiunian12 } from './src/engine/liunian-12shen.js';
import { analyzeNobleStars } from './src/engine/noble-stars.js';
import { sanshishu } from './src/engine/sanshishu.js';
import { analyzeMangpaiView } from './src/engine/mangpai-view.js';
import { huangdao12 } from './src/engine/huangdao.js';
import { waterActivation } from './src/engine/water-activation.js';
import { annualSihuaToNatal } from './src/engine/ziwei-liunian-sihua.js';
import { physiognomyOverview } from './src/engine/physiognomy.js';
import { yinzhaiOverview } from './src/engine/yinzhai.js';
import { cezi } from './src/engine/cezi.js';
import { qizheng } from './src/engine/qizheng.js';
import { xiaoliuren } from './src/engine/xiaoliuren.js';
import { taiyi } from './src/engine/taiyi.js';
import { qiuqian } from './src/engine/qiuqian.js';
import { annualTabooOverview } from './src/engine/annual-taboo.js';
import { dominantGod } from './src/engine/dominant-god.js';

// ---------------------------------------------------------------------------
// 12 LÁ SỐ ĐA DẠNG (1930-2010): nam/nu, đủ mùa, đủ giờ, đủ can-chi extremes.
// ---------------------------------------------------------------------------
const CHARTS = [
  { label: '1930-nam-03-15-06:00', y: 1930, m: 3, d: 15, h: 6, min: 0, g: 'nam' },
  { label: '1942-nu-07-22-12:30',  y: 1942, m: 7, d: 22, h: 12, min: 30, g: 'nu' },
  { label: '1955-nam-11-08-18:00', y: 1955, m: 11, d: 8, h: 18, min: 0, g: 'nam' },
  { label: '1968-nu-02-29-23:59',  y: 1968, m: 2, d: 29, h: 23, min: 59, g: 'nu' }, // năm nhuận
  { label: '1973-nam-05-01-05:15', y: 1973, m: 5, d: 1, h: 5, min: 15, g: 'nam' },
  { label: '1981-nu-09-14-09:45',  y: 1981, m: 9, d: 14, h: 9, min: 45, g: 'nu' },
  { label: '1990-nam-06-15-14:30', y: 1990, m: 6, d: 15, h: 14, min: 30, g: 'nam' },
  { label: '1996-nu-12-25-00:30',  y: 1996, m: 12, d: 25, h: 0, min: 30, g: 'nu' },
  { label: '2000-nam-08-08-20:00', y: 2000, m: 8, d: 8, h: 20, min: 0, g: 'nam' },
  { label: '2007-nu-04-04-07:30',  y: 2007, m: 4, d: 4, h: 7, min: 30, g: 'nu' },
  { label: '2010-nam-10-10-16:20', y: 2010, m: 10, d: 10, h: 16, min: 20, g: 'nam' },
  { label: '1948-nu-01-06-22:00',  y: 1948, m: 1, d: 6, h: 22, min: 0, g: 'nu' },
];
const REF_YEAR = 2026;

// ---------------------------------------------------------------------------
// 17 MODULE FEATURE MỚI — signature + cách gọi.
//  Mỗi entry: { name, run: (R) => result }  (R = kết quả analyze).
//  Các module tương tác (physiognomy/yinzhai/cezi/qiuqian/xiaoliuren/taiyi/
//  huangdao/annualTaboo) KHÔNG phụ thuộc R → gọi với tham số cố định.
// ---------------------------------------------------------------------------
const FEATURES = [
  { name: 'chenggu',                run: (R) => chenggu(R) },
  { name: 'analyzeLiunian12',       run: (R) => analyzeLiunian12(R, REF_YEAR) },
  { name: 'analyzeNobleStars',      run: (R) => analyzeNobleStars(R) },
  { name: 'sanshishu',              run: (R) => sanshishu(R) },
  { name: 'analyzeMangpaiView',     run: (R) => analyzeMangpaiView(R) },
  { name: 'huangdao12',             run: (R) => huangdao12(REF_YEAR, 6, 15) },
  { name: 'waterActivation',        run: (R) => waterActivation(REF_YEAR) },
  { name: 'annualSihuaToNatal',     run: (R) => annualSihuaToNatal(R, REF_YEAR) },
  { name: 'physiognomyOverview',    run: (R) => physiognomyOverview() },
  { name: 'yinzhaiOverview',        run: (R) => yinzhaiOverview() },
  { name: "cezi('福')",              run: (R) => cezi('福') },
  { name: 'qizheng',                run: (R) => qizheng(R.chart.input.year, R.chart.input.month, R.chart.input.day, R.chart.input.hour, R.chart.input.minute) },
  { name: 'xiaoliuren',             run: (R) => xiaoliuren(6, 15, 11) }, // tháng/ngày/giờ cố định
  { name: 'taiyi',                  run: (R) => taiyi(REF_YEAR) },
  { name: "qiuqian('test')",        run: (R) => qiuqian('test') },
  { name: 'annualTabooOverview',    run: (R) => annualTabooOverview(REF_YEAR) },
  { name: 'dominantGod',            run: (R) => dominantGod(R) },
];

// ---------------------------------------------------------------------------
// Detector "undefined leak": chuỗi JSON hoá để tìm 'undefined' / 'NaN' literal
//  xuất hiện trong kết quả (dấu hiệu bug render).
// ---------------------------------------------------------------------------
function leakCheck(name, result) {
  const issues = [];
  let serialized;
  try {
    serialized = JSON.stringify(result);
  } catch (e) {
    // Có thể có circular ref — fallback stringify nông.
    try {
      serialized = JSON.stringify(result, (k, v) =>
        typeof v === 'object' && v !== null ? Object.assign({}, v) : v, 2);
    } catch (_) {
      return [`<không serialize được: ${e.message}>`];
    }
  }
  if (serialized == null) return ['<result null/undefined>'];
  if (/\bundefined\b/.test(serialized)) issues.push("chứa 'undefined' literal");
  if (/\bNaN\b/.test(serialized)) issues.push("chứa 'NaN' literal");
  return issues;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
let totalCalls = 0;
let totalPass = 0;
let totalFail = 0;
const crashes = [];
const leaks = [];
const perFeatureFails = {};

console.log('='.repeat(70));
console.log(' REGRESSION FINAL — 12 charts × (analyze + buildChartBrief + 17 features)');
console.log('='.repeat(70));

const t0 = Date.now();

for (const c of CHARTS) {
  console.log(`\n--- ${c.label} ---`);
  // 1. analyze()
  let R;
  try {
    R = analyze(c.y, c.m, c.d, c.h, c.min, c.g, REF_YEAR);
    totalCalls++;
    if (!R || !R.chart || !R.yong) {
      totalFail++; crashes.push({ chart: c.label, step: 'analyze', err: 'R/chart/yong rỗng' });
      console.log(`  ❌ analyze: kết quả rỗng — bỏ qua chart này`);
      continue;
    }
    totalPass++;
    console.log(`  ✓ analyze: pattern=${R.pattern?.vi || '?'} yong=${R.yong?.primary || '?'}`);
  } catch (e) {
    totalCalls++; totalFail++;
    crashes.push({ chart: c.label, step: 'analyze', err: e.message, stack: e.stack });
    console.log(`  ❌ analyze THREW: ${e.message}`);
    continue;
  }

  // 2. buildChartBrief()
  let brief;
  try {
    totalCalls++;
    brief = buildChartBrief(R);
    if (typeof brief !== 'string' || brief.length < 100) {
      totalFail++;
      leaks.push({ chart: c.label, step: 'buildChartBrief', issue: `brief quá ngắn (${brief?.length})` });
      console.log(`  ❌ buildChartBrief: brief rỗng/ngắn (${brief?.length})`);
    } else if (/\bundefined\b/.test(brief) || /\bNaN\b/.test(brief)) {
      totalFail++;
      leaks.push({ chart: c.label, step: 'buildChartBrief', issue: "brief chứa undefined/NaN literal" });
      console.log(`  ⚠ buildChartBrief: OK nhưng brief chứa 'undefined'/'NaN' (được phép trong try/catch fallback)`);
      totalPass++;
    } else {
      totalPass++;
      console.log(`  ✓ buildChartBrief: ${brief.length} ký tự`);
    }
  } catch (e) {
    totalFail++;
    crashes.push({ chart: c.label, step: 'buildChartBrief', err: e.message, stack: e.stack });
    console.log(`  ❌ buildChartBrief THREW: ${e.message}`);
  }

  // 3. 17 feature modules
  for (const f of FEATURES) {
    totalCalls++;
    try {
      const res = f.run(R);
      if (res == null) {
        totalFail++;
        perFeatureFails[f.name] = (perFeatureFails[f.name] || 0) + 1;
        crashes.push({ chart: c.label, step: f.name, err: 'trả về null/undefined' });
        console.log(`    ❌ ${f.name}: trả null/undefined`);
        continue;
      }
      // leak check
      const leaksFound = leakCheck(f.name, res);
      if (leaksFound.length) {
        totalFail++;
        perFeatureFails[f.name] = (perFeatureFails[f.name] || 0) + 1;
        leaks.push({ chart: c.label, step: f.name, issue: leaksFound.join('; ') });
        console.log(`    ⚠ ${f.name}: ${leaksFound.join('; ')}`);
      } else {
        totalPass++;
      }
    } catch (e) {
      totalFail++;
      perFeatureFails[f.name] = (perFeatureFails[f.name] || 0) + 1;
      crashes.push({ chart: c.label, step: f.name, err: e.message, stack: e.stack });
      console.log(`    ❌ ${f.name} THREW: ${e.message}`);
    }
  }
}

const elapsed = Date.now() - t0;

// ---------------------------------------------------------------------------
// BÁO CÁO
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(70));
console.log(' BÁO CÁO REGRESSION FINAL');
console.log('='.repeat(70));
console.log(` Charts test         : ${CHARTS.length}`);
console.log(` Tổng feature/module : ${FEATURES.length}`);
console.log(` Tổng calls          : ${totalCalls}`);
console.log(` PASS                : ${totalPass}`);
console.log(` FAIL                : ${totalFail}`);
console.log(` Crashes (throw/rỗng): ${crashes.length}`);
console.log(` Undefined/NaN leaks : ${leaks.length}`);
console.log(` Thời gian           : ${elapsed} ms`);

if (Object.keys(perFeatureFails).length) {
  console.log('\n Fails theo module:');
  for (const [name, n] of Object.entries(perFeatureFails).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${name}: ${n}`);
  }
}

if (crashes.length) {
  console.log('\n CHI TIẾT CRASHES:');
  for (const c of crashes) {
    console.log(`   [${c.chart}] ${c.step}: ${c.err}`);
    if (c.stack) console.log(`     ${c.stack.split('\n').slice(1, 3).join('\n     ')}`);
  }
}

if (leaks.length) {
  console.log('\n CHI TIẾT LEAKS:');
  for (const l of leaks) {
    console.log(`   [${l.chart}] ${l.step}: ${l.issue}`);
  }
}

// Phán định cuối
console.log('\n' + '-'.repeat(70));
const clean = crashes.length === 0 && leaks.length === 0;
if (clean) {
  console.log(' ✅ REGRESSION PASS — 0 crash, 0 undefined/NaN leak. Engine ổn định.');
} else {
  console.log(` ❌ REGRESSION FAIL — ${crashes.length} crash, ${leaks.length} leak cần xem.`);
}
console.log('-'.repeat(70));

process.exit(clean ? 0 : 1);
