// ============================================================================
//  FUZZ — 9 module mới nhất qua 10 lá số đa dạng
//  chenggu, liunian-12shen, noble-stars, sanshishu, mangpai-view, huangdao,
//  water-activation, ziwei-liunian-sihua, annual-taboo
//
//  Kiểm: 0 crash, 0 undefined leak (trả về null/undefined khi đáng lẽ phải có data).
//  Chạy: node fuzz-new-modules.mjs
// ============================================================================
import { analyze } from './src/engine/chart.js';
import { chenggu } from './src/engine/chenggu.js';
import { analyzeLiunian12 } from './src/engine/liunian-12shen.js';
import { analyzeNobleStars } from './src/engine/noble-stars.js';
import { sanshishu } from './src/engine/sanshishu.js';
import { analyzeMangpaiView } from './src/engine/mangpai-view.js';
import { huangdao12, huangdaoInYear } from './src/engine/huangdao.js';
import { waterActivation, waterActivationBrief } from './src/engine/water-activation.js';
import { annualSihuaToNatal } from './src/engine/ziwei-liunian-sihua.js';
import { annualTabooOverview, checkAnnualTaboo } from './src/engine/annual-taboo.js';

const SCAN_YEAR = 2026;

// 10 lá số đa dạng: năm/giới/giờ khác nhau bao phủ nhiều can-chi + vượng suy.
const CHARTS = [
  { label: 'Nam 1990 tháng 6 trưa',        y: 1990, m: 6,  d: 15, h: 12,  min: 0,  g: 'nam' },
  { label: 'Nữ 1985 tháng 1 sáng',         y: 1985, m: 1,  d: 8,  h: 7,   min: 30, g: 'nữ'  },
  { label: 'Nam 2000 tháng 12 tối',        y: 2000, m: 12, d: 28, h: 21,  min: 15, g: 'nam' },
  { label: 'Nữ 1976 tháng 3 đêm khuya',    y: 1976, m: 3,  d: 3,  h: 23,  min: 45, g: 'nữ'  },
  { label: 'Nam 1999 tháng 8 chiều',       y: 1999, m: 8,  d: 20, h: 17,  min: 0,  g: 'nam' },
  { label: 'Nữ 1992 tháng 5 sớm',          y: 1992, m: 5,  d: 12, h: 5,   min: 0,  g: 'nữ'  },
  { label: 'Nam 1988 tháng 10 trưa',       y: 1988, m: 10, d: 5,  h: 11,  min: 30, g: 'nam' },
  { label: 'Nữ 2005 tháng 2 trưa',         y: 2005, m: 2,  d: 14, h: 13,  min: 0,  g: 'nữ'  },
  { label: 'Nam 1970 tháng 7 sáng sớm',    y: 1970, m: 7,  d: 1,  h: 3,   min: 15, g: 'nam' },
  { label: 'Nữ 2010 tháng 11 tối',         y: 2010, m: 11, d: 22, h: 20,  min: 0,  g: 'nữ'  },
];

let CRASHES = 0;
let LEAKS = 0;
const crashLog = [];
const leakLog = [];

// Đệ quy tìm chuỗi "undefined"/"NaN" rò rỉ trong output string hóa.
function findLeaks(obj, path, label) {
  if (obj == null) return;
  let s;
  try { s = typeof obj === 'string' ? obj : JSON.stringify(obj); } catch { return; }
  if (s == null) return;
  // Bỏ qua key chữ "undefined"/"NaN" cố ý, chỉ flag giá trị leaking.
  const m = s.match(/\bundefined\b|\bNaN\b/g);
  if (m && m.length > 0) {
    // lọc nhiễu: bỏ qua path chứa key tự mô tả (hiếm) — flag tất cả để đánh giá thủ công
    LEAKS += m.length;
    leakLog.push(`${label} @ ${path}: ${m.length}× [${s.slice(0, 80)}…]`);
  }
}

function runModule(label, fnName, fn) {
  try {
    const out = fn();
    if (out === undefined || out === null) {
      LEAKS++;
      leakLog.push(`${label} / ${fnName}: trả về ${out}`);
      return null;
    }
    findLeaks(out, fnName, label);
    return out;
  } catch (e) {
    CRASHES++;
    crashLog.push(`${label} / ${fnName}: ${e.message}`);
    return null;
  }
}

// kiểm trả về cơ bản: phải có trường "chốt" (summary hoặc activated/positions/results)
function sanity(label, fnName, out, requiredKeys) {
  if (!out) return;
  const missing = requiredKeys.filter((k) => out[k] === undefined || out[k] === null);
  if (missing.length) {
    LEAKS++;
    leakLog.push(`${label} / ${fnName}: thiếu key [${missing.join(',')}]`);
  }
}

console.log('════════ FUZZ 9 MODULE MỚI × 10 LÁ SỐ ════════');
console.log(`Scan year = ${SCAN_YEAR}\n`);

for (const c of CHARTS) {
  const tag = `[${c.g} ${c.y}-${String(c.m).padStart(2,'0')}-${String(c.d).padStart(2,'0')} ${String(c.h).padStart(2,'0')}:${String(c.min).padStart(2,'0')}] ${c.label}`;
  console.log(`\n── ${tag} ──`);

  // Build chart once
  let R = null;
  try {
    R = analyze(c.y, c.m, c.d, c.h, c.min, c.g, SCAN_YEAR);
  } catch (e) {
    CRASHES++;
    crashLog.push(`${tag} / analyze(base): ${e.message}`);
    console.log('  ⚠ analyze(base) THROW — bỏ qua chart này.');
    continue;
  }

  // 1. chenggu(R)
  const cg = runModule(tag, 'chenggu', () => chenggu(R));
  sanity(tag, 'chenggu', cg, ['totalStr', 'summary', 'interpretation']);

  // 2. analyzeLiunian12(R, scanYear)
  const l12 = runModule(tag, 'analyzeLiunian12', () => analyzeLiunian12(R, SCAN_YEAR));
  sanity(tag, 'analyzeLiunian12', l12, ['year', 'positions', 'mine']);

  // 3. analyzeNobleStars(R)
  const noble = runModule(tag, 'analyzeNobleStars', () => analyzeNobleStars(R));
  sanity(tag, 'analyzeNobleStars', noble, ['stars']);

  // 4. sanshishu(R)
  const ss = runModule(tag, 'sanshishu', () => sanshishu(R));
  sanity(tag, 'sanshishu', ss, ['yearGanZhi', 'pastLife']);

  // 5. analyzeMangpaiView(R)
  const mpv = runModule(tag, 'analyzeMangpaiView', () => analyzeMangpaiView(R));
  sanity(tag, 'analyzeMangpaiView', mpv, ['summary']);

  // 6. huangdao12(year,month,day) + huangdaoInYear(year)
  const hd = runModule(tag, 'huangdao12', () => huangdao12(SCAN_YEAR, c.m, c.d));
  sanity(tag, 'huangdao12', hd, ['deity']);
  const hdy = runModule(tag, 'huangdaoInYear', () => huangdaoInYear(SCAN_YEAR));
  sanity(tag, 'huangdaoInYear', hdy, ['yellowDays']);

  // 7. waterActivation(year) + brief
  const wa = runModule(tag, 'waterActivation', () => waterActivation(SCAN_YEAR));
  sanity(tag, 'waterActivation', wa, ['yun', 'summary']);
  runModule(tag, 'waterActivationBrief', () => waterActivationBrief(SCAN_YEAR));

  // 8. annualSihuaToNatal(R, year)
  const lnsh = runModule(tag, 'annualSihuaToNatal', () => annualSihuaToNatal(R, SCAN_YEAR));
  sanity(tag, 'annualSihuaToNatal', lnsh, ['year', 'activated', 'summary']);

  // 9. annualTabooOverview(scanYear) + checkAnnualTaboo(dir, year)
  const ato = runModule(tag, 'annualTabooOverview', () => annualTabooOverview(SCAN_YEAR));
  sanity(tag, 'annualTabooOverview', ato, ['results', 'summary']);
  runModule(tag, 'checkAnnualTaboo', () => checkAnnualTaboo('Bắc', SCAN_YEAR));

  console.log('  ✓ 9 module chạy xong (xem log crash/leak phía dưới nếu có).');
}

// ─────────────────────────── BÁO CÁO ───────────────────────────
console.log('\n═══════════════ KẾT QUẢ FUZZ ═══════════════');
console.log(`Charts chạy       : ${CHARTS.length}`);
console.log(`Module / chart    : 9 (+ 2 phụ) → tối đa ~${CHARTS.length * 11} lượt gọi`);
console.log(`CRASH (throw)     : ${CRASHES}`);
console.log(`LEAK  (undefined/NaN/thiếu key): ${LEAKS}`);

if (crashLog.length) {
  console.log('\n── CRASHES ──');
  for (const l of crashLog) console.log('  ❌', l);
}
if (leakLog.length) {
  console.log('\n── LEAKS (cần đánh giá thủ công; có thể là nhiễu key mô tả) ──');
  for (const l of leakLog) console.log('  ⚠', l);
}

if (CRASHES === 0 && LEAKS === 0) {
  console.log('\n✅ PASS: 0 crash, 0 undefined leak qua toàn bộ 10 lá số × 9 module.');
  process.exit(0);
} else {
  console.log('\n⛔ Có vấn đề cần kiểm tra (xem danh sách trên).');
  process.exit(1);
}
