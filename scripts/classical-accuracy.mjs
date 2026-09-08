#!/usr/bin/env node
// ============================================================================
//  scripts/classical-accuracy.mjs — REGRESSION RUNNER cho kho 命例 cổ điển
// ============================================================================
//  • Nạp CLASSICAL_CASES (src/engine/classical-cases.js) — lá số nổi tiếng
//    trong 《滴天髓阐微》/《造化元钥》/《渊海子平》/《千里命稿》… với kết luận
//    công khai đã được xác thực.
//  • Chạy engine qua classical-runner.analyzeSummary() (đường 4 trụ trực tiếp,
//    tái dụng nguyên chuỗi analyze() của chart.js).
//  • [school-option] Chấm MỖI case dưới CẢ HAI trường phái:
//      - ditian (滴天髓 — khoan, DEFAULT: corpus nguồn 滴天髓阐微)
//      - ziping (子平真詮 — nghiêm)
//    Cột case: [S] | [P•ditian][Y•ditian] | [P•ziping][Y•ziping].
//  • Chấm:
//      [S] strength  — cổ pháp 'vượng'/'nhược'  ↔ R.strength.level (chữ chứa; không phụ thuộc phái)
//      [P] pattern   — cổ pháp ge (汉字)          ↔ R.pattern.name (map 汉字↔Việt, fuzzy)
//      [Y] yong      — cổ pháp yongElement (exact 汉字) ↔ R.yong.primary
//    Mặc định CHỈ chấm case confidence='high'; field null/'中和' → SKIP.
//    Cờ --all để chấm cả case 'medium'.
//  • EXIT CODE LUÔN 0 (report-only).
//  Chạy:  node scripts/classical-accuracy.mjs [--all]
// ============================================================================

import { CLASSICAL_CASES } from '../src/engine/classical-cases.js';
import { analyzeSummary } from '../src/engine/classical-runner.js';

const INCLUDE_MEDIUM = process.argv.includes('--all');
const GREEN = '', RED = '', DIM = '', BOLD = '', RESET = ''; // giữ plain — log file friendly

// [school-option] hai trường phái — ditian xếp TRƯỚC (default, corpus 滴天髓-sourced)
const SCHOOLS = ['ditian', 'ziping'];

// ---- Map cách cổ ↔ engine (fuzzy contains, sau chuẩn hoá 汉字) --------------
const SIMP_TRAD = { 从: '從', 伤: '傷', 杀: '殺', 双: '雙', 寿: '壽', 桶: '桶' };
const normalizeGe = (s) => String(s || '')
  .replace(/[从伤杀双寿]/g, (c) => SIMP_TRAD[c] || c)
  .replace(/仁壽|仁寿/g, '')
  .replace(/阳刃/g, '羊刃')
  .replace(/格$/g, '');

function geAgrees(classicalGe, engineName) {
  if (!classicalGe || !engineName) return false;
  const a = normalizeGe(classicalGe);
  const b = normalizeGe(engineName);
  if (a === b) return true;
  if (b.includes(a) || a.includes(b)) return true;
  // alias cổ ↔ engine: 从官/从杀 → 從殺; 月刃 → 羊刃; 曲直仁寿 → 曲直
  const ALIAS = { 從官: ['從殺'], 月刃: ['羊刃'], 炎上: ['從旺', '炎上'], 潤下: ['從旺', '潤下'], 曲直: ['從旺', '曲直'], 從勢: ['從財', '從殺', '從兒'], 從旺: ['炎上', '曲直', '稼穡', '從革', '潤下', '從旺'], 從兒: ['食神', '從兒'], 從財: ['從財', '正財', '偏財'], 從殺: ['七殺', '正官', '從殺'] }; // [cập nhật] 2 chiều + special-name mapping
  for (const [k, v] of Object.entries(ALIAS)) {
    if (a.includes(k) && v.some((x) => b.includes(x))) return true;
  }
  return false;
}

// ---- chuẩn bị cases ----------------------------------------------------------
const cases = CLASSICAL_CASES.filter((c) => INCLUDE_MEDIUM || c.confidence === 'high');
const skippedMedium = CLASSICAL_CASES.length - cases.length;

const rows = [];
const mkSchoolStats = () => ({ scored: 0, pass: 0 });
const stats = {
  total: 0, checked: 0,
  strength: mkSchoolStats(),                       // S không phụ thuộc phái
  pattern: { ditian: mkSchoolStats(), ziping: mkSchoolStats() },
  yong:    { ditian: mkSchoolStats(), ziping: mkSchoolStats() },
};

console.log('='.repeat(100));
console.log('CLASSICAL CASE CORPUS — độ khớp engine ↔ kết luận cổ điển (DUAL-SCHOOL)');
console.log(`Tổng corpus: ${CLASSICAL_CASES.length} 命例 | chấm: ${cases.length} (confidence=high${INCLUDE_MEDIUM ? '+medium' : ''}) | bỏ qua medium: ${skippedMedium}`);
console.log('Cột: [S] vượng suy | [P][Y] phái ditian (滴天髓, DEFAULT) | [P][Y] phái ziping (子平真詮)');
console.log('='.repeat(100));

for (const c of cases) {
  stats.total += 1;
  const line = { id: c.id, person: c.person, category: c.category, checks: {}, detail: [] };
  try {
    // [school-option] chạy CẢ HAI phái trên cùng tứ trụ
    const R = {};
    for (const sc of SCHOOLS) {
      R[sc] = analyzeSummary(
        { year: c.pillars.year, month: c.pillars.month, day: c.pillars.day, time: c.pillars.hour },
        'male',
        { school: sc },
      );
    }
    line.R = R;

    // ---- [S] strength (giống nhau ở cả 2 phái — lấy ditian làm đại diện) ----
    const sCheck = (() => {
      const klass = c.known.strength;
      if (!klass || klass === '中和') return { status: 'SKIP', why: `cổ pháp: ${klass || 'không nêu'}` };
      const eng = /vượng/i.test(R.ditian.strengthLevel) ? 'vượng' : /nhược/i.test(R.ditian.strengthLevel) ? 'nhược' : '?';
      return { status: eng === klass ? 'PASS' : 'FAIL', klass, eng };
    })();
    line.checks.S = sCheck;
    if (sCheck.status !== 'SKIP') {
      stats.strength.scored += 1;
      if (sCheck.status === 'PASS') stats.strength.pass += 1;
      else line.detail.push(`S: cổ pháp «${sCheck.klass}» ↔ engine «${R.ditian.strengthLevel}» (effRatio=${R.ditian.strengthEffRatio})`);
    }

    // ---- [P] pattern — chấm RIÊNG từng phái ----
    line.checks.P = {};
    for (const sc of SCHOOLS) {
      const klass = c.known.ge;
      if (!klass) { line.checks.P[sc] = { status: 'SKIP', why: 'cách cổ không nêu / tranh cãi' }; continue; }
      const agree = geAgrees(klass, R[sc].patternName);
      line.checks.P[sc] = { status: agree ? 'PASS' : 'FAIL', klass, eng: `${R[sc].patternName} (${R[sc].patternVi}, type=${R[sc].patternType})` };
    }
    for (const sc of SCHOOLS) {
      const pCheck = line.checks.P[sc];
      if (pCheck.status === 'SKIP') continue;
      stats.pattern[sc].scored += 1;
      if (pCheck.status === 'PASS') stats.pattern[sc].pass += 1;
      else line.detail.push(`P (${sc}): cổ pháp «${pCheck.klass}» ↔ engine «${pCheck.eng}»`);
    }

    // ---- [Y] yong element — chấm RIÊNG từng phái ----
    line.checks.Y = {};
    for (const sc of SCHOOLS) {
      const klass = c.known.yongElement;
      if (!klass) { line.checks.Y[sc] = { status: 'SKIP', why: 'yong cổ pháp null (tranh cãi)' }; continue; }
      line.checks.Y[sc] = { status: R[sc].yongPrimary === klass ? 'PASS' : 'FAIL', klass, eng: R[sc].yongPrimary };
    }
    for (const sc of SCHOOLS) {
      const yCheck = line.checks.Y[sc];
      if (yCheck.status === 'SKIP') continue;
      stats.yong[sc].scored += 1;
      if (yCheck.status === 'PASS') stats.yong[sc].pass += 1;
      else line.detail.push(`Y (${sc}): cổ pháp «${yCheck.klass}» ↔ engine «${yCheck.eng}» (secondary=${R[sc].yongSecondary || '—'})`);
    }

    stats.checked += 1;
  } catch (e) {
    line.checks.ERR = { status: 'FAIL', why: e.message };
    line.detail.push(`ERROR: ${e.message}`);
  }
  rows.push(line);
}

// ---- in từng case -------------------------------------------------------------
const tag = (x) => (x ? (x.status === 'PASS' ? '[PASS]' : x.status === 'SKIP' ? '[ -- ]' : '[FAIL]') : '[ -- ]');
for (const r of rows) {
  const flags = [tag(r.checks.S), tag(r.checks.P?.ditian), tag(r.checks.Y?.ditian), tag(r.checks.P?.ziping), tag(r.checks.Y?.ziping)].join('');
  const anyFail = [r.checks.S, r.checks.P?.ditian, r.checks.Y?.ditian, r.checks.P?.ziping, r.checks.Y?.ziping, r.checks.ERR].some((x) => x && x.status === 'FAIL');
  console.log(`${anyFail ? RED : ''}${flags}${RESET} ${r.id} (${r.category}) — ${r.person}`);
  for (const d of r.detail) console.log(`        LỆCH: ${d}`);
}
if (rows.length !== stats.total) console.log(`(in ${rows.length} / tổng ${stats.total})`);

// ---- khác biệt phái (case hai phái cùng khớp / lệch khác nhau) ------------------
const diffRows = rows.filter((r) => SCHOOLS.some((sc) => ['P', 'Y'].some((k) => r.checks[k]?.[sc] && r.checks[k][sc].status !== r.checks[k][SCHOOLS[0]]?.status && r.checks[k][sc].status !== 'SKIP')));
if (diffRows.length) {
  console.log('-'.repeat(100));
  console.log('KHÁC BIỆT GIỮA CÁC PHÁI (case hai trường phái cho kết quả chấm KHÁC nhau):');
  for (const r of diffRows) {
    const parts = [];
    for (const k of ['P', 'Y']) {
      const a = r.checks[k]?.ditian?.status, b = r.checks[k]?.ziping?.status;
      if (a && b && a !== b && a !== 'SKIP' && b !== 'SKIP') parts.push(`${k}: ditian=${a} vs ziping=${b}`);
    }
    if (parts.length) console.log(`  • ${r.id}: ${parts.join(' | ')}`);
  }
}

// ---- tổng hợp ------------------------------------------------------------------
const pct = (p) => (p.scored ? Math.round((p.pass / p.scored) * 100) : null);
console.log('='.repeat(100));
console.log('TỔNG KẾT ĐỘ CHÍNH XÁC (chỉ case confidence=high, bỏ SKIP) — trường phái mặc định: ditian (滴天髓)');
console.log('='.repeat(100));
console.log(`Case đã phân tích : ${stats.checked}/${stats.total}`);
const fmt = (name, p) => `${name}: ${p.pass}/${p.scored}${pct(p) != null ? ` = ${pct(p)}%` : ''}`;
const fmtDual = (st) => SCHOOLS.map((sc) => `${sc} ${st[sc].pass}/${st[sc].scored}${pct(st[sc]) != null ? ` = ${pct(st[sc])}%` : ''}`).join(' | ');
console.log(`  [S] Vượng suy  — ${fmt('strength', stats.strength)} (không phụ thuộc phái)`);
console.log(`  [P] Cách cục   — ${fmtDual(stats.pattern)}`);
console.log(`  [Y] Dụng thần  — ${fmtDual(stats.yong)}`);
for (const sc of SCHOOLS) {
  const ts = stats.strength.scored + stats.pattern[sc].scored + stats.yong[sc].scored;
  const tp = stats.strength.pass + stats.pattern[sc].pass + stats.yong[sc].pass;
  console.log(`  TỔNG           — ${sc === SCHOOLS[0] ? 'ditian (default)' : 'ziping'}: ${tp}/${ts}${ts ? ` = ${Math.round((tp / ts) * 100)}%` : ''}`);
}

if (rows.some((r) => r.detail.length)) {
  console.log('-'.repeat(100));
  console.log('DANH SÁCH LỆCH (cho vòng distillation engine):');
  for (const r of rows) {
    for (const d of r.detail) console.log(`  • ${r.id}: ${d}`);
  }
}
console.log('(Report-only — exit 0.)');
process.exitCode = 0;
