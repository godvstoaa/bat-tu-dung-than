// ============================================================================
//  GIẢI ÁN — lõi chiều sâu của Huyền Quán (docs/GAME-MMO-PROMPT-PLAN.md §B2, P2).
//  Khách NPC mang ngày sinh thật + câu hỏi đời thường; người chơi đi 6 bước luận,
//  ĐÁP ÁN do engine cổ pháp tính (analyze → R), không phải do người viết tay.
//  Án Cổ: 38 lá số kinh điển, đáp án lấy từ chính sách cổ (CLASSICAL_CASES.known).
//  Thuần logic, không DOM → test bằng node (scripts/test-game-cases.mjs).
// ============================================================================
import { analyze, computeLiuNian } from '../engine/chart.js';
import { GAN, ZHI, WX_VI } from '../engine/constants.js';
import { QIONGTONG_TIAOHOU, DITIANSUI_MAXIMS } from '../engine/kb.js';
import { CLASSICAL_CASES } from '../engine/classical-cases.js';

export const WX = ['木', '火', '土', '金', '水'];
const GANS = Object.keys(GAN);
const ZHIS = Object.keys(ZHI);

import { hashSeed, rng, makeNpc } from './npc.js';
export { hashSeed, rng, makeNpc };
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// --- dựng án: các bước + đáp án (key) từ engine
const ADVICE = {
  木: { color: 'xanh lá', dir: 'Đông', work: 'giáo dục, cây trồng, xuất bản' },
  火: { color: 'đỏ, tím', dir: 'Nam', work: 'truyền thông, ẩm thực, điện' },
  土: { color: 'vàng, nâu', dir: 'Đông Bắc / Tây Nam', work: 'bất động sản, xây dựng, nông nghiệp' },
  金: { color: 'trắng, bạc', dir: 'Tây', work: 'tài chính, cơ khí, pháp luật' },
  水: { color: 'đen, xanh biển', dir: 'Bắc', work: 'vận tải, thương mại, du lịch' },
};
export const ADVICE_CARDS = ADVICE;

// Cùng Thông Bảo Giám chỉ ghi một phần tổ hợp «can ngày × tháng» → thiếu thì lấy tháng cùng mùa.
const SEASON = { 寅: 0, 卯: 0, 辰: 0, 巳: 1, 午: 1, 未: 1, 申: 2, 酉: 2, 戌: 2, 亥: 3, 子: 3, 丑: 3 };
export function tiaohouQuote(gan, monthZhi) {
  const T = QIONGTONG_TIAOHOU || {};
  const exact = T[`${gan}${monthZhi}月`];
  if (exact) return { month: monthZhi, text: exact };
  const alt = Object.keys(T).find((k) => k[0] === gan && SEASON[k[1]] === SEASON[monthZhi]);
  return alt ? { month: alt[1], text: T[alt], season: true } : null;
}

const gzVi = (gz) => [...gz].map((c) => GAN[c]?.vi || ZHI[c]?.vi || c).join(' ');

export function buildCase(npc, nowYear = new Date().getFullYear()) {
  const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, nowYear);
  const P = R.chart.pillars;
  const pillars = { year: P.year.gan + P.year.zhi, month: P.month.gan + P.month.zhi, day: P.day.gan + P.day.zhi, time: P.time.gan + P.time.zhi };
  const r = rng(hashSeed(npc.key + ':tiles'));
  const used = new Set(Object.values(pillars).join(''));
  const distract = shuffle(r, [...GANS, ...ZHIS].filter((c) => !used.has(c))).slice(0, 3);
  const tiles = shuffle(r, [...Object.values(pillars).flatMap((gz) => [...gz]), ...distract]);

  const pct = R.wx.pct;
  const sorted = [...WX].sort((a, b) => pct[b] - pct[a]);
  const st = R.strength;
  const strengthKey = st.strong === true ? 'vuong' : st.strong === false ? 'nhuoc' : 'trung';
  // lưu niên: cửa sổ 10 năm của engine không cố định theo năm tham chiếu → gộp 2 lần tính, lấy 6 năm từ năm nay
  const byYear = new Map();
  for (const ref of [nowYear, nowYear + 6]) {
    try { for (const x of computeLiuNian(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, R.yong, ref)) if (!byYear.has(x.year)) byYear.set(x.year, x); } catch (e) { /* bỏ qua */ }
  }
  if (!byYear.size) for (const x of R.liunian) byYear.set(x.year, x);
  const years = [...byYear.values()].filter((x) => x.year >= nowYear).sort((a2, b2) => a2.year - b2.year).slice(0, 6);
  const best = Math.max(...years.map((x) => x.score));
  const dm = R.chart.dayMaster;
  const qt = tiaohouQuote(dm.gan, R.chart.monthZhi);
  const maxims = Array.isArray(DITIANSUI_MAXIMS) ? DITIANSUI_MAXIMS : [];

  return {
    kind: 'npc', npc, R, pillars, tiles,
    keys: {
      pillars,
      wx: { strong: sorted[0], weak: sorted[4], pct },
      strength: { verdict: strengthKey, lenh: !!st.deLenh, dia: !!st.deDia, the: st.support > st.oppose, level: st.level },
      yong: { primary: R.yong.primary, secondary: R.yong.secondary || R.yong.xi || null, avoid: R.yong.avoid || [] },
      timing: { years: years.map((x) => ({ year: x.year, gz: x.ganZhi, score: x.score, rating: x.rating })), best },
      advice: { good: [R.yong.primary, R.yong.secondary || R.yong.xi].filter(Boolean), bad: R.yong.avoid || [] },
    },
    cite: {
      pillars: `Năm tính từ tiết Lập Xuân, tháng theo tiết khí (tiết trước: ${R.chart.jieqi?.prev?.name || '—'}), giờ theo 12 canh hai tiếng (Ngũ Thử Độn). Ngày ${pillars.day} (${gzVi(pillars.day)}) tra lịch vạn niên.`,
      strength: maxims.length ? maxims[hashSeed(npc.key) % maxims.length] : '',
      yong: qt ? `Cùng Thông Bảo Giám (穷通宝鉴) — ${dm.gan} tháng ${qt.month}${qt.season ? ' (cùng mùa)' : ''}: ${qt.text}` : '',
    },
    explain: {
      strength: `${st.level || ''} · ${st.deLenh ? 'đắc lệnh' : 'thất lệnh'} · ${st.deDia ? 'đắc địa (có gốc)' : 'không gốc vững'} · lực trợ ${(+st.support).toFixed(1)} / khắc-tiết ${(+st.oppose).toFixed(1)}.`,
      yong: (R.yong.reasons || []).slice(0, 2).join(' '),
      method: (R.yong.method || []).join(' + '),
    },
  };
}

// --- chấm từng bước. Trả { score 0..1, ok, msg }
export const STEP_WEIGHTS = { pillars: 0.2, wx: 0.1, strength: 0.2, yong: 0.25, timing: 0.1, advice: 0.15 };
export const STEP_ORDER = ['pillars', 'wx', 'strength', 'yong', 'timing', 'advice'];
export const STEP_TITLE = { pillars: 'Lập trụ', wx: 'Đếm ngũ hành', strength: 'Vượng hay nhược', yong: 'Tìm Dụng thần', timing: 'Chọn năm thuận', advice: 'Lời khuyên', ge: 'Định cách cục' };

export function gradePillars(key, answer, hints = 0) {
  let ok = 0;
  for (const p of ['year', 'month', 'day', 'time']) for (let i = 0; i < 2; i++) if ((answer[p] || '')[i] === key[p][i]) ok++;
  const raw = ok / 8;
  return { score: Math.max(0, raw - 0.15 * hints), ok: ok === 8, msg: `Đúng ${ok}/8 chữ${hints ? ` · dùng ${hints} gợi ý` : ''}.` };
}

export function gradeWx(key, { strong, weak }) {
  const near = (a, b) => Math.abs(key.pct[a] - key.pct[b]) <= 2; // gần bằng nhau → chấp nhận
  const s = strong === key.strong || near(strong, key.strong);
  const w = weak === key.weak || near(weak, key.weak);
  return { score: (s ? 0.5 : 0) + (w ? 0.5 : 0), ok: s && w, msg: `Vượng nhất: ${WX_VI[key.strong]} (${Math.round(key.pct[key.strong])}%) · yếu nhất: ${WX_VI[key.weak]} (${Math.round(key.pct[key.weak])}%).` };
}

export function gradeStrength(key, { verdict, lenh, dia, the }) {
  const v = verdict === key.verdict;
  const flags = [lenh === key.lenh, dia === key.dia, the === key.the].filter(Boolean).length;
  const score = (v ? 0.6 : 0) + 0.4 * (flags / 3);
  const lab = { vuong: 'Thân vượng', nhuoc: 'Thân nhược', trung: 'Trung hoà' }[key.verdict];
  return { score, ok: v && flags === 3, msg: `${lab}. Đắc lệnh: ${key.lenh ? 'có' : 'không'} · đắc địa: ${key.dia ? 'có' : 'không'} · đắc thế: ${key.the ? 'có' : 'không'}.` };
}

export function gradeYong(key, el) {
  const score = el === key.primary ? 1 : el && el === key.secondary ? 0.5 : 0;
  return { score, ok: score === 1, msg: `Dụng thần: ${WX_VI[key.primary]}${key.secondary ? ` (phụ ${WX_VI[key.secondary]})` : ''}.` };
}

export function gradeTiming(key, year) {
  const y = key.years.find((x) => x.year === year);
  const sc = y ? y.score : -Infinity;
  const bestY = key.years.find((x) => x.score === key.best);
  const score = !y ? 0 : sc >= key.best ? 1 : sc >= key.best - 3 ? 0.7 : 0.2;
  return { score, ok: score === 1, msg: `Năm thuận nhất: ${bestY?.year} (${bestY?.gz}).` };
}

export function gradeAdvice(key, picks) {
  const good = picks.filter((e) => key.good.includes(e)).length;
  const bad = picks.filter((e) => key.bad.includes(e)).length;
  const score = Math.max(0, Math.min(1, good / Math.max(1, Math.min(2, key.good.length)) - 0.5 * bad));
  return { score, ok: score === 1, msg: `Nên theo hành ${key.good.map((e) => WX_VI[e]).join(', ')}; tránh ${key.bad.map((e) => WX_VI[e]).join(', ') || '—'}.` };
}

export function totalScore(results, weights = STEP_WEIGHTS) {
  let s = 0, w = 0;
  for (const [k, r] of Object.entries(results)) { if (weights[k] == null) continue; s += weights[k] * r.score; w += weights[k]; }
  return w ? s / w : 0;
}

export function gradeLabel(t) {
  return t >= 0.9 ? 'Xuất sắc' : t >= 0.75 ? 'Giỏi' : t >= 0.55 ? 'Khá' : 'Cần ôn thêm';
}

// --- Án Cổ (lá số kinh điển): 3 bước, đáp án theo sách
export const GE_VI = {
  正官格: 'Chính Quan cách', 七殺格: 'Thất Sát cách', 正財格: 'Chính Tài cách', 偏財格: 'Thiên Tài cách',
  食神格: 'Thực Thần cách', 傷官格: 'Thương Quan cách', 正印格: 'Chính Ấn cách', 偏印格: 'Thiên Ấn cách',
  羊刃格: 'Dương Nhận cách', 建祿格: 'Kiến Lộc cách', 從財格: 'Tòng Tài cách', 從殺格: 'Tòng Sát cách',
  從兒格: 'Tòng Nhi cách', 專旺格: 'Chuyên Vượng cách', 從強格: 'Tòng Cường cách', 化氣格: 'Hoá Khí cách',
  曲直格: 'Khúc Trực cách', 從旺格: 'Tòng Vượng cách',
};

export function classicalList() {
  return CLASSICAL_CASES.filter((c) => c.known && (c.known.yongElement || c.known.strength || c.known.ge));
}

export function buildClassical(id) {
  const c = CLASSICAL_CASES.find((x) => x.id === id);
  if (!c) return null;
  const k = c.known;
  const special = ['从格', '专旺'].includes(c.category);
  // tòng / chuyên vượng là BẢN CHẤT cách cục — ưu tiên hơn vượng/nhược thường: ai trả lời đúng
  // «Cách đặc biệt» (chip tong) phải được điểm, dù sách cổ ghi thêm thân vượng/nhược kèm theo.
  const verdict = special ? 'tong' : k.strength === 'vượng' ? 'vuong' : k.strength === 'nhược' ? 'nhuoc' : k.strength === '中和' ? 'trung' : null;
  const r = rng(hashSeed(id));
  const geOpts = k.ge ? shuffle(r, [k.ge, ...shuffle(r, Object.keys(GE_VI).filter((g) => g !== k.ge)).slice(0, 3)]) : null;
  const steps = [verdict && 'strength', geOpts && 'ge', WX.includes(k.yongElement) && 'yong'].filter(Boolean);
  return {
    kind: 'classical', id, c, steps,
    pillars: { year: c.pillars.year, month: c.pillars.month, day: c.pillars.day, time: c.pillars.hour },
    keys: { strength: { verdict }, ge: k.ge, geOpts, yong: { primary: k.yongElement, secondary: null } },
    cite: { all: `${c.principle || ''} — ${c.source}` },
  };
}

export function gradeClassicalStrength(key, verdict) {
  const lab = { vuong: 'Thân vượng', nhuoc: 'Thân nhược', trung: 'Trung hoà', tong: 'Cách đặc biệt (tòng / chuyên vượng)' }[key.verdict];
  const ok = verdict === key.verdict;
  return { score: ok ? 1 : 0, ok, msg: `Sách cổ luận: ${lab}.` };
}
export function gradeGe(key, ge) {
  const ok = ge === key;
  return { score: ok ? 1 : 0, ok, msg: `Cách cục theo sách: ${GE_VI[key] || key} (${key}).` };
}

// --- tiến bộ tu học: trung bình động theo kỹ năng
export function addMastery(mastery, results) {
  const m = { ...(mastery || {}) };
  for (const [k, r] of Object.entries(results)) {
    const cur = m[k] || { n: 0, avg: 0 };
    const n = Math.min(cur.n + 1, 20); // nhớ khoảng 20 lần gần nhất
    m[k] = { n, avg: cur.avg + (r.score - cur.avg) / n };
  }
  return m;
}
export const SKILL_VI = { pillars: 'Lập trụ', wx: 'Ngũ hành', strength: 'Vượng nhược', yong: 'Dụng thần', timing: 'Ứng kỳ', advice: 'Lời khuyên', ge: 'Cách cục' };

export { gzVi };

// --- chấm cả bài (dùng chung client + máy chủ). Phòng thủ: bài từ client không tin cậy.
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
export function gradeStep(cs, k, a, hints = 0) {
  const K = cs.keys;
  switch (k) {
    case 'pillars': {
      const p = obj(a);
      const clean = Object.fromEntries(['year', 'month', 'day', 'time'].map((x) => [x, typeof p[x] === 'string' ? p[x].slice(0, 2) : '']));
      return gradePillars(K.pillars, clean, Math.max(0, Math.min(4, hints | 0)));
    }
    case 'wx': { const w = obj(a); return gradeWx(K.wx, { strong: w.strong, weak: w.weak }); }
    case 'strength': { const s = obj(a); return gradeStrength(K.strength, { verdict: s.verdict, lenh: !!s.lenh, dia: !!s.dia, the: !!s.the }); }
    case 'yong': return gradeYong(K.yong, typeof a === 'string' ? a : null);
    case 'timing': return gradeTiming(K.timing, Number(a));
    case 'advice': return gradeAdvice(K.advice, Array.isArray(a) ? [...new Set(a.filter((x) => WX.includes(x)))].slice(0, 2) : []);
    default: return { score: 0, ok: false, msg: '' };
  }
}
export function gradeAnswers(cs, answers) {
  const A = obj(answers);
  const results = {};
  for (const k of STEP_ORDER) results[k] = gradeStep(cs, k, A[k], A.hints);
  return { results, total: totalScore(results) };
}

// Khoá khách thống nhất client ↔ máy chủ: ngày (YYYY-MM-DD) · khe · mã ổn định u
export const npcKey = (date, slot, u) => `${date}:${slot}:${u}`;
export const COOP_STEP_POINTS = 20;
