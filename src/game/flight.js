// ============================================================================
//  PHI HÀNH ĐỘC BẢN — máy trạng thái bay (P15 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §22.
//  5 trạng thái: 1 Cất cánh (0,8 s) · 2 Trôi tại chỗ (tốc độ ngang < 0,5 m/s) · 3 Hành trình · 4 Tăng tốc / bổ nhào
//  (giữ chạy nhanh hoặc hạ nhanh hơn 6 m/s — ×1,5 như nhau mọi vật cưỡi) · 5 Hạ cánh (0,6 s). 0 = không bay.
//  Tốc độ theo bậc hiếm vật cưỡi (quyết định 14): +5% mỗi bậc trên bậc 1, tối đa +20%; trần chung với pháp môn /
//  cảnh giới +35% (P20). Trộn tư thế giữa các trạng thái 0,25 s (k trong 0–1).
// ============================================================================
export const FS = { OFF: 0, TAKEOFF: 1, HOVER: 2, CRUISE: 3, BOOST: 4, LAND: 5 };
export const FS_NAME = ['', 'Cất cánh', 'Trôi', 'Hành trình', 'Tăng tốc', 'Hạ cánh'];
export const TAKEOFF_S = 0.8, LAND_S = 0.6, BLEND_S = 0.25, BOOST = 1.5, DIVE_V = 6;
export const rarityBonus = (rarity = 1) => Math.min(0.2, 0.05 * Math.max(0, (rarity | 0) - 1));
export const SPEED_CAP = 0.35; // trần chung: bậc hiếm + pháp môn / cảnh giới
export function newFlight() { return { s: FS.OFF, t: 0, prev: FS.OFF, k: 1 }; }
function go(F, s) { if (F.s === s) return; F.prev = F.s; F.s = s; F.t = 0; F.k = 0; }
/**
 * Một bước: inp { want (đang muốn bay), speedH (m/s ngang), sprint, vy (m/s, âm = hạ), alt (m trên mặt đất) }.
 * Trả F (đổi tại chỗ). Hạ cánh xong → OFF; main.js tắt player.flying khi thấy OFF.
 */
export function step(F, inp, dt) {
  F.t += dt; F.k = Math.min(1, F.k + dt / BLEND_S);
  if (F.s === FS.OFF) { if (inp.want) go(F, FS.TAKEOFF); return F; }
  if (F.s === FS.LAND) { if (F.t >= LAND_S) go(F, FS.OFF); return F; }
  if (!inp.want) { go(F, FS.LAND); return F; }
  if (F.s === FS.TAKEOFF && F.t < TAKEOFF_S) return F;
  const boost = inp.sprint || (inp.vy ?? 0) < -DIVE_V;
  go(F, boost ? FS.BOOST : (inp.speedH ?? 0) < 0.5 ? FS.HOVER : FS.CRUISE);
  return F;
}
/** hệ số tốc độ bay: tăng tốc ×1,5 × (1 + bậc hiếm + pháp môn, trần +35%); cất / hạ cánh chậm lại */
export function speedMul(F, rarity = 1, extra = 0) {
  const base = 1 + Math.min(SPEED_CAP, rarityBonus(rarity) + extra);
  return (F.s === FS.BOOST ? BOOST : F.s === FS.TAKEOFF || F.s === FS.LAND ? 0.4 : 1) * base;
}
/** độ cao cộng thêm khi cất cánh (0 → 3 m trong 0,8 s) / hạ cánh (giảm chấn về 0) */
export function liftOffset(F) {
  if (F.s === FS.TAKEOFF) return 3 * Math.min(1, F.t / TAKEOFF_S);
  if (F.s === FS.LAND) return 3 * (1 - Math.min(1, F.t / LAND_S));
  return 3;
}
