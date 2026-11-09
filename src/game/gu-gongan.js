// ============================================================================
//  ĐƯỜNG THẦY · TAB «ÁN CỔ» (docs/GAME-THIET-KE-CHOT.md P0-1) — đọc án cổ 命例,
//  tự đoán 2–3 bước rồi ĐỐI CHIẾU HAI PHÁN: cổ pháp nguyên văn vs engine tự tiêu
//  (analyzeSummary — classical-runner.js:179, lần đầu được dùng trong game).
//  Thuần logic, không DOM: que-ui.js chỉ render theo object trả về.
//
//  Luật chốt thiết kế (GAME-THIET-KE-CHOT.md P0-1 + GAME-HUYEN-QUAN-SPEC.md §11):
//  • 1 án/ngày, chỉ án confidence:'high' trong CLASSICAL_CASES (classical-cases.js:23,
//    38 án — 29 án high), chọn theo hashSeed('gongan:' + key); que-ui truyền
//    key = `${who}|${today}` nên án đổi theo từng ngày.
//  • 3 bước hỏi (① thân vượng/nhược ② hành dụng ③ phán cổ tóm tắt); cổ pháp tranh
//    cãi về dụng (known.yongElement null) → LƯỢC bước ②, còn 2 bước.
//  • Chấm: grade(step, ans) NỘI BỘ trả 0/1 — que-ui KHÔNG có gradeStep; tổng X/n
//    chỉ hiển thị trong panel. KHÔNG ghi state.deskLog (Q7 — state.js đang khóa),
//    KHÔNG có điều kiện qua: bảng đối chiếu luôn hiện sau khi trả lời.
//  • Cách cục cổ pháp vs engine KHÁC NHAU là bình thường — engine chưa bám được
//    mọi phán cổ (so accuracy: scripts/classical-accuracy.mjs). Trục strength với
//    án known '中和' bỏ chấm, đúng quy ước S-check của classical-accuracy.mjs.
//  • Bước 4 «bắt phán ghép» (đợt 2, cùng file): gắn known.verdict của một án khác
//    lên 4 trụ hiện tại; dạy vạch mặt phán ghép từ ANTI_MANIPULATION_DATA
//    (anti-manipulation-data.js › groundingRules GR5 — CONTRADICTION SURFACING).
// ============================================================================
import { CLASSICAL_CASES } from '../engine/classical-cases.js';
import { analyzeSummary } from '../engine/classical-runner.js';
import { ANTI_MANIPULATION_DATA } from '../engine/anti-manipulation-data.js';
import { WX_VI } from '../engine/constants.js';
import { hashSeed, rng } from './npc.js';

const POOL = () => CLASSICAL_CASES.filter((c) => c.confidence === 'high');
const STRENGTH_VI = { 'vượng': 'vượng', 'nhược': 'nhược', '中和': 'trung hoà' };
const ENGINE_STRENGTH = (strong) => (strong === true ? 'vượng' : strong === false ? 'nhược' : 'không chốt vượng/nhược');
const YONG_OPTS = ['木', '火', '土', '金', '水'].map((w) => `${w} — ${WX_VI[w] || ''}`);
const OPPOSITE = {
  'vượng': 'thân nhược — không đủ sức gánh',
  'nhược': 'thân quá vượng — khí mạnh lấn',
  '中和': 'thân lệch hẳn — hoặc quá vượng hoặc quá nhược',
};

/** Chấm 1 bước: đúng đáp án → 1 điểm, sai → 0. NỘI BỘ — que-ui không chấm. */
function grade(step, ans) {
  return ans === step.answer ? 1 : 0;
}

/** Chấm cả panel: tổng X/n + dấu từng bước. que-ui chỉ render kết quả này. */
export function gradeGongan(gongan, answers) {
  let score = 0;
  const marks = gongan.steps.map((st) => {
    const ok = grade(st, answers ? answers[st.key] : undefined) === 1;
    if (ok) score += 1;
    return { key: st.key, ok };
  });
  return { score, total: gongan.total, marks };
}

/** Bảng đối chiếu hai phán của 1 án: cổ pháp nguyên văn vs analyzeSummary. */
export function compareCase(c) {
  const s = analyzeSummary({ year: c.pillars.year, month: c.pillars.month, day: c.pillars.day, time: c.pillars.hour }, 'male');
  // Trục strength: án '中和' cổ pháp không chấm (quy ước classical-accuracy.mjs S-check) → null.
  const classicStrength = STRENGTH_VI[c.known.strength] || 'không nêu';
  const engineStrength = ENGINE_STRENGTH(s.strengthStrong);
  const strengthMatch = c.known.strength === '中和'
    ? null
    : classicStrength === engineStrength || (classicStrength === 'trung hoà' && s.strengthStrong == null);
  // Trục dụng: cổ pháp tranh cãi (null) → không chấm; có chốt thì so với Dụng chính của engine.
  const yongMatch = c.known.yongElement == null ? null : c.known.yongElement === s.yongPrimary;
  // Trục cách: khác nhau là bình thường — chỉ đánh dấu, không chấm điểm.
  const geMatch = c.known.ge == null ? null : c.known.ge === s.patternName;
  return {
    classic: { verdict: c.known.verdict, principle: c.principle, person: c.person, source: c.source, strength: classicStrength, yong: c.known.yongElement, ge: c.known.ge },
    engine: { strength: engineStrength, strengthLevel: s.strengthLevel, yong: s.yongPrimary || null, ge: s.patternName, geVi: s.patternVi, quality: s.patternQualityQuality },
    axes: { strength: { match: strengthMatch }, yong: { match: yongMatch }, ge: { match: geMatch } },
    note: 'Cách cục cổ pháp và engine khác nhau là bình thường — engine này chưa bám được mọi phán cổ (so accuracy: scripts/classical-accuracy.mjs).',
  };
}

/** Bước 4 «bắt phán ghép»: verdict của án khác gắn lên án hiện tại + bài vạch mặt (GR5). */
function buildFake(c, decoy) {
  const gr5 = ANTI_MANIPULATION_DATA.groundingRules.find((r) => r.id === 'GR5');
  return {
    ofId: decoy.id,
    ofPerson: decoy.person,
    verdict: decoy.known.verdict,
    reveal: `Phán trên KHÔNG phải của án này — đó là phán của án khác (${decoy.person}). Đối chiếu bảng phía trên: engine tự tiêu 4 trụ KHÔNG khớp phán ghép — tiền đề sai phải vạch mặt, không chấp nhận theo.`,
    lesson: `${gr5.rule} Cách nói đúng: ${gr5.template}`,
  };
}

/**
 * Án cổ hôm nay.
 * @param key    chốt định danh người chơi + ngày (que-ui truyền `${who}|${today}`)
 *               → hashSeed('gongan:' + key) chọn 1 án/ngày, cùng key ra cùng án.
 * @param today  ngày hiển thị, cũng dùng để chọn án «khác» cho bước 4 (deterministic).
 * @returns { id, person, source, note, pillars, pillarsText, steps, total, compare, fake }
 */
export function buildGongan(key, today = '') {
  const cases = POOL();
  const seed = hashSeed(`gongan:${key}`);
  const c = cases[seed % cases.length];
  const r = rng(seed ^ 0x9e3779b9);
  // án «khác» cho bước 4: offset 1..n-1 so với án hiện tại — luôn khác án đang đọc
  const off = 1 + (hashSeed(`gongan:${key}:${today}:ghep`) % (cases.length - 1));
  const decoy = cases[(seed % cases.length + off) % cases.length];

  const steps = [];
  steps.push({
    key: 'strength',
    prompt: 'Từ 4 trụ, cổ pháp đoán thế nào?',
    options: ['vượng', 'nhược', 'trung hoà'],
    answer: STRENGTH_VI[c.known.strength] || 'trung hoà',
  });
  if (c.known.yongElement) {
    steps.push({
      key: 'yong',
      prompt: 'Cổ pháp chọn Dụng Thần hành nào?',
      options: YONG_OPTS,
      answer: YONG_OPTS.find((o) => o.startsWith(c.known.yongElement)) || c.known.yongElement,
    });
  }
  // bước 3 — phán cổ tóm tắt: 1 lựa chọn đúng (mệnh đề đầu của known.verdict), 1 lựa chọn theo hướng khác
  const firstClause = String(c.known.verdict || '').split(/[;。]/).map((x) => x.trim()).filter(Boolean)[0] || String(c.known.verdict || '');
  const trueText = `Phán cổ: ${firstClause}`;
  const yongOpp = c.known.yongElement
    ? `phải kỵ hành ${c.known.yongElement}, chọn Dụng Thần hẳn khác`
    : 'Dụng Thần phải chọn hẳn hành khác (khác phán cổ)';
  const falseText = `Theo hướng khác: ${OPPOSITE[c.known.strength] || 'thân lệch'}, ${yongOpp}.`;
  const opts = Math.floor(r() * 2) ? [falseText, trueText] : [trueText, falseText];
  steps.push({ key: 'verdict', prompt: 'Phán cổ của án này nói gì?', options: opts, answer: trueText });

  return {
    id: c.id,
    today,
    person: c.person,
    source: c.source,
    note: c.note,
    pillars: c.pillars,
    pillarsText: `${c.pillars.year} ${c.pillars.month} ${c.pillars.day} ${c.pillars.hour}`,
    steps,
    total: steps.length,
    compare: compareCase(c),
    fake: buildFake(c, decoy),
  };
}
