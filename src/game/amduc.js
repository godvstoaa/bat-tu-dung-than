// ============================================================================
//  ÂM ĐỨC — điểm danh vận khí (P17 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §24.
//  · Lần đầu vào game mỗi ngày: gieo quẻ vận khí (điểm ngày theo lá số — engine dailyGuidance, main.js truyền vào).
//  · Ngày được tính «sinh hoạt điều độ» khi trong ngày: chơi ≥ 20 phút, ăn ≥ 2 bữa, ngủ ở chỗ ngủ đã trả / nhà riêng.
//    Điều độ → Âm Đức +1, chuỗi +1; cấp vận khí theo chuỗi (1–3 · 4–7 · 8–14 · 15+). Chỉ đăng nhập thì không đủ.
//  · Quên một ngày: không mất điểm, TẠM NGỪNG hiệu ứng; có lại 2 ngày điều độ liền → hiệu ứng trở lại ở cấp cũ trừ 1.
//  · Âm Đức không phải tiền: không mua bán / đổi / chuyển. Âm thì không phạt, chỉ không có trợ lực.
//  · Hiệu ứng cộng dồn: c1 No tụt chậm 5%, hao Tỉnh khi làm −5% · c2 rủi ro lao động −50%, thuốc −5% · c3 thưởng đơn /
//    nhiệm vụ +10% · c4 một lần thoát chết (Khí huyết về 0 → tỉnh lại Khí huyết 1, không mất tiền) rồi Âm Đức về 0.
//  · Tổn hao: phá công trình bị kết án −5 · bỏ ca / gian lận việc làm −2 · bỏ mặc bệnh quá 24 giờ −3 / ngày.
//  Lưu trong state.life (L.amduc). Trước P8 client giữ; máy chủ nhận cấp qua job_task để giảm rủi ro (kẹp 0–4).
// ============================================================================
export const TIERS = [
  { min: 0, name: 'Chưa có vận khí' },
  { min: 1, name: 'Thân Tâm An Lạc', text: 'No tụt chậm hơn 5% · làm việc đỡ mệt 5%' },
  { min: 4, name: 'Quý Nhân Mỉm Cười', text: 'rủi ro lao động giảm một nửa · thầy thuốc bớt 5%' },
  { min: 8, name: 'Thời Vận Hanh Thông', text: 'thưởng đơn hàng / nhiệm vụ +10%' },
  { min: 15, name: 'Phúc Trạch Vô Cương', text: 'một lần thoát chết' },
];
export const NEED = { minutes: 20, meals: 2 };
export const PENALTY = { convict: -5, quit: -2, neglect: -3 };
export const tierOfStreak = (n) => { let t = 0; for (let i = 1; i < TIERS.length; i++) if (n >= TIERS[i].min) t = i; return t; };

export function adState(L) {
  if (!L.amduc || typeof L.amduc !== 'object') L.amduc = { score: 0, streak: 0, paused: null, saveReady: false, day: null, que: null, log: [] };
  const A = L.amduc; if (!Array.isArray(A.log)) A.log = [];
  return A;
}
/** cấp đang có hiệu lực (0 khi đang tạm ngừng hoặc Âm Đức âm) */
export function tier(L) {
  const A = adState(L);
  if (A.paused || A.score < 0) return 0;
  return tierOfStreak(A.streak);
}
const nextDay = (d) => { const t = new Date(`${d}T12:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };
function addLog(A, delta, reason, at) { A.log.push({ d: delta, r: reason, at }); if (A.log.length > 30) A.log.shift(); }

/** chốt ngày cũ khi sang ngày mới (có thể nhảy nhiều ngày — mỗi ngày vắng là một ngày quên) */
function closeDay(L, A, now) {
  const D = A.day; if (!D) return null;
  const ok = D.minutes >= NEED.minutes && D.meals >= NEED.meals && D.slept;
  if (ok) {
    A.score += 1; addLog(A, 1, 'Ngày sinh hoạt điều độ', now);
    if (A.paused) { A.paused.need -= 1; if (A.paused.need <= 0) { A.streak = TIERS[A.paused.tier]?.min || 0; A.paused = null; } }
    else A.streak += 1;
    if (tierOfStreak(A.streak) >= 4 && !A.paused) A.saveReady = true; // đã dùng thì chuỗi về 0 — phải tích lại 15 ngày
  } else if (!A.paused && A.streak > 0) A.paused = { need: 2, tier: Math.max(0, tierOfStreak(A.streak) - 1) };
  else if (A.paused) A.paused.need = 2; // đang chờ bật lại mà lại quên → đếm lại
  return ok;
}
/**
 * Vào ngày (gọi khi vào game / sang ngày). que = { score, label } quẻ vận khí ngày (main.js tính từ lá số).
 * Trả { newDay, closed: [true|false…], que } — que chỉ có khi là lần đầu trong ngày.
 */
export function enterDay(L, dateStr, que = null, now = Date.now()) {
  const A = adState(L);
  if (A.day?.date === dateStr) return { newDay: false };
  const closed = [];
  if (A.day) {
    closed.push(closeDay(L, A, now));
    // các ngày vắng giữa chừng: quên
    for (let d = nextDay(A.day.date), guard = 0; d < dateStr && guard < 60; d = nextDay(d), guard++) { A.day = { date: d, minutes: 0, meals: 0, slept: false }; closed.push(closeDay(L, A, now)); }
  }
  A.day = { date: dateStr, minutes: 0, meals: 0, slept: false };
  A.que = que ? { date: dateStr, ...que } : null;
  return { newDay: true, closed, que: A.que };
}
/** tiến độ trong ngày */
export function tickDay(L, { minutes = 0, meal = false, slept = false } = {}) {
  const A = adState(L); if (!A.day) return;
  A.day.minutes += minutes; if (meal) A.day.meals += 1; if (slept) A.day.slept = true;
}
export const dayProgress = (L) => { const D = adState(L).day; return D ? { ...D, ok: D.minutes >= NEED.minutes && D.meals >= NEED.meals && D.slept } : null; };
/** tổn hao (âm) — không xuống dưới −50 */
export function penalize(L, kind, now = Date.now()) {
  const A = adState(L), d = PENALTY[kind] || 0; if (!d) return 0;
  A.score = Math.max(-50, A.score + d); addLog(A, d, { convict: 'Phá công trình bị kết án', quit: 'Bỏ ca / gian lận việc làm', neglect: 'Bỏ mặc bệnh quá 24 giờ' }[kind], now);
  return d;
}
/** cấp 4: dùng lượt thoát chết (gọi khi Khí huyết vừa về 0). Trả true nếu được cứu. Âm Đức về 0, chuỗi về 0. */
export function trySave(L, now = Date.now()) {
  const A = adState(L);
  if (tier(L) < 4 || !A.saveReady) return false;
  A.saveReady = false; A.usedSave = true; A.score = 0; A.streak = 0; A.paused = null; addLog(A, 0, 'Thoát chết — Phúc Trạch Vô Cương', now);
  L.hp = 1;
  return true;
}
/** hệ số hiệu ứng theo cấp (cộng dồn) */
export function effects(L) {
  const t = tier(L);
  return { fullRate: t >= 1 ? 0.95 : 1, workWake: t >= 1 ? 0.95 : 1, risk: t >= 2 ? 0.5 : 1, med: t >= 2 ? 0.95 : 1, order: t >= 3 ? 1.1 : 1, save: t >= 4 };
}
export const adScore = (L) => adState(L).score;
