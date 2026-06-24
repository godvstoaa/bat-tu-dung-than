// ============================================================================
//  FINAL COMPREHENSIVE FUZZ — 14 module mới (cycles 1-16) × 8 lá số đa dạng
//
//  Module test:
//   1.  analyze                (base chart build — engine/chart.js)
//   2.  buildChartBrief        (AI brief — engine/ai.js, bao gồm tất cả section)
//   3.  chenggu                (称骨)
//   4.  analyzeLiunian12       (12神 lưu niên)
//   5.  analyzeNobleStars      (贵人)
//   6.  sanshishu              (三世书)
//   7.  analyzeMangpaiView     (盲派象法)
//   8.  huangdao12             (黄道 — cho 1 ngày)
//   9.  waterActivation        (kích thủy)
//  10.  annualSihuaToNatal     (lưu niên tứ hóa → bẩm sinh)
//  11.  annualTabooOverview    (tổng quan cấm kỵ năm)
//  12.  physiognomyOverview    (tướng số)
//  13.  yinzhaiOverview        (âm trạch)
//  14.  cezi('福')             (châm tự)
//  15.  qizheng                (七政四余 — uses astronomy-engine, đo riêng)
//
//  Kiểm: 0 crash, 0 undefined/NaN leak.
//  Timing: đo riêng qizheng (real astronomy) để biết chậm bao nhiêu.
//
//  Chạy: node fuzz-final-audit.mjs
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
import { annualTabooOverview } from './src/engine/annual-taboo.js';
import { physiognomyOverview } from './src/engine/physiognomy.js';
import { yinzhaiOverview } from './src/engine/yinzhai.js';
import { cezi } from './src/engine/cezi.js';
import { qizheng } from './src/engine/qizheng.js';

const SCAN_YEAR = 2026;

// 8 lá số đa dạng: phủ nhiều thập kỷ + giới + giờ sinh khác nhau.
const CHARTS = [
  { label: 'Nam 1990 tháng 6 trưa',         y: 1990, m: 6,  d: 15, h: 12,  min: 0,  g: 'nam' },
  { label: 'Nữ 1985 tháng 1 sáng',          y: 1985, m: 1,  d: 8,  h: 7,   min: 30, g: 'nữ'  },
  { label: 'Nam 2000 tháng 12 tối',         y: 2000, m: 12, d: 28, h: 21,  min: 15, g: 'nam' },
  { label: 'Nữ 1976 tháng 3 đêm khuya',     y: 1976, m: 3,  d: 3,  h: 23,  min: 45, g: 'nữ'  },
  { label: 'Nam 1999 tháng 8 chiều',        y: 1999, m: 8,  d: 20, h: 17,  min: 0,  g: 'nam' },
  { label: 'Nữ 1992 tháng 5 sớm',           y: 1992, m: 5,  d: 12, h: 5,   min: 0,  g: 'nữ'  },
  { label: 'Nam 1988 tháng 10 trưa',        y: 1988, m: 10, d: 5,  h: 11,  min: 30, g: 'nam' },
  { label: 'Nữ 2005 tháng 2 trưa',          y: 2005, m: 2,  d: 14, h: 13,  min: 0,  g: 'nữ'  },
];

let CRASHES = 0;
let LEAKS = 0;
const crashLog = [];
const leakLog = [];

// Aggregated timing per module (ms)
const timings = {};
function recTime(name, ms) {
  if (!timings[name]) timings[name] = { n: 0, total: 0, max: 0 };
  timings[name].n++;
  timings[name].total += ms;
  if (ms > timings[name].max) timings[name].max = ms;
}

// Đệ quy tìm "undefined"/"NaN" rò rỉ trong output string hóa.
function findLeaks(obj, path, label) {
  if (obj == null) return;
  let s;
  try { s = typeof obj === 'string' ? obj : JSON.stringify(obj); } catch { return; }
  if (s == null) return;
  const m = s.match(/\bundefined\b|\bNaN\b/g);
  if (m && m.length > 0) {
    LEAKS += m.length;
    leakLog.push(`${label} @ ${path}: ${m.length}× [${s.slice(0, 100)}…]`);
  }
}

function runModule(label, fnName, fn) {
  const t0 = performance.now();
  try {
    const out = fn();
    const ms = performance.now() - t0;
    recTime(fnName, ms);
    if (out === undefined || out === null) {
      LEAKS++;
      leakLog.push(`${label} / ${fnName}: trả về ${out}`);
      return null;
    }
    findLeaks(out, fnName, label);
    return out;
  } catch (e) {
    const ms = performance.now() - t0;
    recTime(fnName, ms);
    CRASHES++;
    crashLog.push(`${label} / ${fnName}: ${e.message}`);
    return null;
  }
}

// kiểm trả về cơ bản: phải có trường "chốt".
function sanity(label, fnName, out, requiredKeys) {
  if (!out) return;
  const missing = requiredKeys.filter((k) => out[k] === undefined || out[k] === null);
  if (missing.length) {
    LEAKS++;
    leakLog.push(`${label} / ${fnName}: thiếu key [${missing.join(',')}]`);
  }
}

console.log('════════ FINAL AUDIT FUZZ — 14 MODULE × 8 LÁ SỐ ════════');
console.log(`Scan year = ${SCAN_YEAR}`);
console.log(`Modules  : 14 (analyze, buildChartBrief, chenggu, liunian12, nobleStars,`);
console.log(`           sanshishu, mangpaiView, huangdao12, waterActivation, annualSihua,`);
console.log(`           annualTaboo, physiognomy, yinzhai, cezi) + qizheng riêng\n`);

// ── Cezi + physiognomy + yinzhai không phụ thuộc lá số → chạy 1 lần (data cố định).
//    Nhưng task yêu cầu test across charts → vẫn chạy cho mỗi chart để bắt leak phụ thuộc input.
//    Tuy nhiên chúng là data cố định → chạy 1 lần đủ; ta log riêng.
console.log('── DATA MODULES (input-độc lập, chạy 1 lần) ──');
{
  const tag = '[static]';
  const ph = runModule(tag, 'physiognomyOverview', () => physiognomyOverview());
  sanity(tag, 'physiognomyOverview', ph, ['totals']);
  const yz = runModule(tag, 'yinzhaiOverview', () => yinzhaiOverview());
  // yinzhaiOverview không có required key chốt cố định — chỉ check leak.
  const cz = runModule(tag, "cezi('福')", () => cezi('福'));
  sanity(tag, "cezi('福')", cz, ['hexagram', 'wxVi']);
  console.log('  ✓ physiognomy / yinzhai / cezi xong.');
}

console.log('\n── CHART-DEPENDENT MODULES × 8 lá số ──');
for (const c of CHARTS) {
  const tag = `[${c.g} ${c.y}-${String(c.m).padStart(2,'0')}-${String(c.d).padStart(2,'0')} ${String(c.h).padStart(2,'0')}:${String(c.min).padStart(2,'0')}] ${c.label}`;
  console.log(`\n── ${tag} ──`);

  // 1. analyze(base)
  let R = null;
  const tA = performance.now();
  try {
    R = analyze(c.y, c.m, c.d, c.h, c.min, c.g, SCAN_YEAR);
    recTime('analyze', performance.now() - tA);
  } catch (e) {
    recTime('analyze', performance.now() - tA);
    CRASHES++;
    crashLog.push(`${tag} / analyze(base): ${e.message}`);
    console.log('  ⚠ analyze(base) THROW — bỏ qua chart này.');
    continue;
  }
  if (!R || !R.chart || !R.chart.pillars) {
    LEAKS++;
    leakLog.push(`${tag} / analyze(base): R.chart.pillars missing`);
    continue;
  }

  // 2. buildChartBrief(R) — bao gồm qizheng section mới
  const brief = runModule(tag, 'buildChartBrief', () => buildChartBrief(R));
  if (brief && brief.length < 500) {
    LEAKS++;
    leakLog.push(`${tag} / buildChartBrief: brief quá ngắn (${brief.length} chars) — có thể thiếu section`);
  }
  // spot-check qizheng section có mặt trong brief (sau khi wired)
  if (brief && !brief.includes('七政四余')) {
    LEAKS++;
    leakLog.push(`${tag} / buildChartBrief: thiếu section '七政四余' trong brief`);
  }

  // 3. chenggu
  const cg = runModule(tag, 'chenggu', () => chenggu(R));
  sanity(tag, 'chenggu', cg, ['totalStr', 'summary', 'interpretation']);

  // 4. analyzeLiunian12
  const l12 = runModule(tag, 'analyzeLiunian12', () => analyzeLiunian12(R, SCAN_YEAR));
  sanity(tag, 'analyzeLiunian12', l12, ['year', 'positions', 'mine']);

  // 5. analyzeNobleStars
  const noble = runModule(tag, 'analyzeNobleStars', () => analyzeNobleStars(R));
  sanity(tag, 'analyzeNobleStars', noble, ['stars']);

  // 6. sanshishu
  const ss = runModule(tag, 'sanshishu', () => sanshishu(R));
  sanity(tag, 'sanshishu', ss, ['yearGanZhi', 'pastLife']);

  // 7. analyzeMangpaiView
  const mpv = runModule(tag, 'analyzeMangpaiView', () => analyzeMangpaiView(R));
  sanity(tag, 'analyzeMangpaiView', mpv, ['summary']);

  // 8. huangdao12(year, month, day)
  const hd = runModule(tag, 'huangdao12', () => huangdao12(SCAN_YEAR, c.m, c.d));
  sanity(tag, 'huangdao12', hd, ['deity']);

  // 9. waterActivation(year)
  const wa = runModule(tag, 'waterActivation', () => waterActivation(SCAN_YEAR));
  sanity(tag, 'waterActivation', wa, ['yun', 'summary']);

  // 10. annualSihuaToNatal(R, year)
  const lnsh = runModule(tag, 'annualSihuaToNatal', () => annualSihuaToNatal(R, SCAN_YEAR));
  sanity(tag, 'annualSihuaToNatal', lnsh, ['year', 'activated', 'summary']);

  // 11. annualTabooOverview(scanYear)
  const ato = runModule(tag, 'annualTabooOverview', () => annualTabooOverview(SCAN_YEAR));
  sanity(tag, 'annualTabooOverview', ato, ['results', 'summary']);

  // 12. qizheng — REAL ASTRONOMY, đo riêng (có thể chậm/edge case)
  const qz = runModule(tag, 'qizheng', () => qizheng(c.y, c.m, c.d, c.h, c.min));
  sanity(tag, 'qizheng', qz, ['luminaries', 'siyu', 'palaceOfMing', 'chart']);

  console.log('  ✓ chart xong (14 module).');
}

// ─────────────────────────── TIMING REPORT ───────────────────────────
console.log('\n═══════════════ TIMING ═══════════════');
console.log('Module                   | n   | avg(ms) | max(ms)');
console.log('-------------------------|-----|---------|--------');
const sorted = Object.entries(timings).sort((a, b) => (b[1].total / b[1].n) - (a[1].total / a[1].n));
for (const [name, t] of sorted) {
  const avg = (t.total / t.n).toFixed(2);
  const max = t.max.toFixed(2);
  console.log(`${name.padEnd(25)} | ${String(t.n).padStart(3)} | ${avg.padStart(7)} | ${max.padStart(6)}`);
}
const qzT = timings['qizheng'];
if (qzT) {
  console.log(`\n七政四余 (real astronomy-engine):`);
  console.log(`  avg = ${(qzT.total / qzT.n).toFixed(2)} ms / chart, max = ${qzT.max.toFixed(2)} ms.`);
}

// ─────────────────────────── BÁO CÁO ───────────────────────────
console.log('\n═══════════════ KẾT QUẢ FUZZ ═══════════════');
console.log(`Charts chạy       : ${CHARTS.length}`);
console.log(`CRASH (throw)     : ${CRASHES}`);
console.log(`LEAK  (undef/NaN/thiếu key/brief thiếu section): ${LEAKS}`);

if (crashLog.length) {
  console.log('\n── CRASHES ──');
  for (const l of crashLog) console.log('  X', l);
}
if (leakLog.length) {
  console.log('\n── LEAKS (cần đánh giá thủ công; có thể nhiễu key mô tả) ──');
  for (const l of leakLog) console.log('  !', l);
}

if (CRASHES === 0 && LEAKS === 0) {
  console.log('\nPASS: 0 crash, 0 undefined leak qua toàn bộ 8 lá số × 14 module.');
  process.exit(0);
} else {
  console.log('\nCO VAN DE can kiem tra (xem danh sach tren).');
  process.exit(1);
}
