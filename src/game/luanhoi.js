// ============================================================================
//  TỬ VONG · ÂM PHỦ · LỤC ĐẠO LUÂN HỒI (P21 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §30.
//  · CHẾT chỉ vì ĐÓI (No = 0 làm Khí huyết cạn) hoặc BỆNH NẶNG không chữa (> 12 giờ chơi). Mọi nguyên nhân khác: NGẤT.
//    Âm Đức cấp 4 còn lượt thì tỉnh lại (amduc.trySave). Trước khi chết luôn cảnh báo (Khí huyết < 15 vì đói / bệnh).
//  · Âm phủ cân nghiệp: điểm = Âm Đức × 3 + Phúc Khí tích lũy KIẾP NÀY / 200 − Nghiệp × 4 → 6 cõi.
//    Canh Mạnh Bà: uống → quên 70% tay nghề; từ chối → giữ ký ức nhưng cõi tụt một bậc.
//  · Ba cõi trên đầu thai ngay; ba cõi dưới là đoạn chơi ngắn (≤ 25 phút, thoát sớm bằng việc tốt), không bao giờ khoá.
//  · Kiếp sau: LÁ SỐ HƯ CẤU do Âm phủ cấp (ngày sinh thật của người chơi KHÔNG đổi, KHÔNG rời máy — vẫn dùng cho các gian
//    xem quẻ); tiền mang theo −50%; Tiền Trang + nhà là di sản (trừ 20% tang phí ở tiền gửi); Phúc Khí đang có −50%;
//    Phúc Khí tích lũy / cảnh giới GIỮ (đạo căn); Nghiệp trừ theo cõi; Sổ Luân Hồi ghi mỗi kiếp một dòng.
// ============================================================================
import { adScore, adState } from './amduc.js';

export const PATHS = [
  { id: 'thien', name: 'Thiên đạo', min: 120, charts: 3, start: 5000, keepRealm: true, text: 'chọn 1 trong 3 lá số đẹp, gia thế khá (5 lượng bạc khởi nghiệp)' },
  { id: 'atula', name: 'A-tu-la đạo', min: 80, charts: 2, start: 300, stamina: 1.15, karmaMul: 1.2, text: 'dòng võ: thể lực +15%, nhưng Nghiệp sinh ra ×1,2 kiếp này' },
  { id: 'nhan', name: 'Nhân đạo', min: 20, charts: 1, start: 300, text: 'lá số được rút, khởi đầu như người mới (300 đồng)' },
  { id: 'sucsinh', name: 'Súc sinh đạo', min: -20, interlude: 20, karma: -20, text: 'một kiếp linh thú ngắn (20 phút) rồi đầu thai Nhân đạo' },
  { id: 'ngaquy', name: 'Ngạ quỷ đạo', min: -60, interlude: 25, karma: -40, text: 'một kiếp quỷ đói ngắn — chờ người sống cúng cô hồn (tối đa 25 phút)' },
  { id: 'diangu', name: 'Địa ngục đạo', min: -Infinity, interlude: 20, karmaTo: 5, text: 'trả nghiệp ở Thập Điện — đào nghiệp thạch (20 phút)' },
];
export const STARVE_LOW = 15, ILL_DEATH_H = 12, FUNERAL = 0.2;
/** Khí huyết vừa về 0: 'death' (đói / bệnh nặng không chữa) | 'faint' */
export function causeOf(L) {
  if ((L.full ?? 100) <= 0) return { kind: 'death', cause: 'chết đói' };
  if (L.ill && L.ill.sev >= 1 && !L.ill.cureAt && (L.ill.h || 0) >= ILL_DEATH_H) return { kind: 'death', cause: 'bệnh nặng không chữa' };
  return { kind: 'faint' };
}
/** đang nguy kịch vì đói / bệnh (để cảnh báo, xám màn hình) */
export const dying = (L) => L.hp < STARVE_LOW && ((L.full ?? 100) < 5 || !!(L.ill && L.ill.sev >= 1 && !L.ill.cureAt));
/** điểm cân nghiệp. lifeXp = Phúc Khí tích lũy trong kiếp này */
export const weigh = (L, lifeXp) => Math.round(adScore(L) * 3 + Math.max(0, lifeXp) / 200 - Math.max(0, L.nghiep || 0) * 4);
export function pathFor(score, refuseSoup = false) {
  let i = PATHS.findIndex((p) => score >= p.min); if (i < 0) i = PATHS.length - 1;
  if (refuseSoup) i = Math.min(PATHS.length - 1, i + 1);
  return PATHS[i];
}
// lá số hư cấu: rút ngày giờ sinh trong khoảng 1940–2010 (tất định theo hạt) — không liên quan ngày sinh thật
function h32(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export function fictionalCharts(seed, n, gender = 'nam') {
  const out = [];
  for (let k = 0; k < n; k++) {
    const r = h32(`${seed}|${k}`), r2 = h32(`${seed}|${k}|b`);
    out.push({ year: 1940 + (r % 71), month: 1 + ((r >>> 8) % 12), day: 1 + ((r >>> 12) % 28), hour: (r2 % 24), minute: (r2 >>> 6) % 60, gender, fictional: true });
  }
  return out;
}
/**
 * Chết → Âm phủ: cân nghiệp, chọn cõi, áp di sản / mất mát. Không đổi ngày sinh thật (state.player.birth).
 * life: state.life; ctx: { lifeXp, refuseSoup, name, chartText, realmName, cause, now }
 * Trả { score, path, charts (lá số hư cấu để chọn), lost: { wallet, phuc, funeral }, interlude }.
 */
export function judge(s, L, ctx = {}) {
  const score = weigh(L, ctx.lifeXp || 0), path = pathFor(score, !!ctx.refuseSoup), now = ctx.now || Date.now();
  const wallet = Math.floor((L.xu || 0) * 0.5); L.xu -= wallet;
  const funeral = Math.floor((L.bank || 0) * FUNERAL); L.bank = (L.bank || 0) - funeral;
  const phuc = Math.floor((s.phucKhi || 0) * 0.5); s.phucKhi -= phuc;
  // Âm Đức: đem cân — cõi lành tiêu phần đã dùng, cõi dữ không tiêu
  const A = adState(L); if (path.min >= 20) A.score = Math.max(0, A.score - Math.max(0, Math.round(score / 3 / 2)));
  // Nghiệp theo cõi
  if (path.karma) L.nghiep = Math.max(0, (L.nghiep || 0) + path.karma);
  if (path.karmaTo != null) L.nghiep = Math.min(L.nghiep || 0, path.karmaTo);
  // tay nghề: uống canh Mạnh Bà quên 70% (máy chủ giữ sổ nghề — client báo cho Guild khi có P8)
  L.skillKeep = ctx.refuseSoup ? 1 : 0.3;
  // hồi sinh thể trạng
  L.hp = 80; L.full = 80; L.wake = 80; L.ill = null; L.debt = Math.floor((L.debt || 0) * 0.5);
  const charts = path.charts ? fictionalCharts(`${now}|${ctx.name || ''}`, path.charts, ctx.gender || 'nam') : fictionalCharts(`${now}|${ctx.name || ''}`, 1, ctx.gender || 'nam');
  const life = { n: (L.lives?.length || 0) + 1, name: ctx.name || '', chart: ctx.chartText || '', realm: ctx.realmName || '', cause: ctx.cause || '', path: path.name, at: now, score };
  L.lives = [...(L.lives || []), life].slice(-40);
  const interlude = path.interlude ? { path: path.id, until: now + path.interlude * 60000, started: now } : null;
  L.afterlife = interlude;
  if (!interlude && path.start) L.xu += path.start * 100; // gia thế kiếp mới (đồng → xu)
  return { score, path, charts, lost: { wallet, phuc, funeral }, interlude };
}
/** việc tốt trong đoạn chơi cõi dưới: rút ngắn (phút) */
export function shorten(L, minutes, now = Date.now()) {
  const A = L.afterlife; if (!A) return null;
  A.until = Math.max(now, A.until - minutes * 60000);
  return A;
}
/** đoạn chơi cõi dưới đã xong chưa → đầu thai Nhân đạo */
export function interludeDone(L, now = Date.now()) {
  const A = L.afterlife; if (!A || now < A.until) return false;
  L.afterlife = null; L.xu += 300 * 100; return true;
}
/** đầu thai với lá số đã chọn (hư cấu): trả hồ sơ nhân vật mới cho main.js (yong tính bằng engine ở main) */
export function reborn(s, chart) { s.incarnation = { chart, at: Date.now(), n: (s.incarnation?.n || 0) + 1 }; return s.incarnation; }
/** Đắc Đạo: phi thăng — giữ danh hiệu Chân Nhân, có thể bắt đầu kiếp mới tùy chọn */
export function ascend(s, L, now = Date.now()) { s.ascended = { at: now, count: (s.ascended?.count || 0) + 1 }; L.lives = [...(L.lives || []), { n: (L.lives?.length || 0) + 1, path: 'Phi thăng — Chân Nhân', at: now }]; return s.ascended; }
