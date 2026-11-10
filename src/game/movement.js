// ============================================================================
//  PHÉP DI CHUYỂN ĐẶC QUYỀN — danh mục tĩnh (P14 / P15, thuần JS). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §21, §22, §25.1.
//  ĐẠP NƯỚC (WATER_WALK): 4 nguồn
//   · Thủy Thượng Phiêu (thân pháp, khí công): Dụng thần Thủy cấp 10 / Hỷ thần Thủy cấp 12 — 2 thể lực / giây
//   · Lăng Ba Vi Bộ (thân pháp, tiên đạo): mọi mệnh cấp 15 + đã một lần đủ chuỗi 7 ngày nhiệm vụ mệnh — 2,5 / giây, chạy +10%
//   · Hài Hộ Thân (trang bị Ngọc, khí công) · Định Thủy Châu (pháp bảo Ngọc, tiên đạo) — bị động, không tốn thể lực
//  Hết thể lực (thân pháp): mất phép tới khi lên bờ, rơi xuống bơi; kiệt sức ở nước sâu → đuối nước (Khí huyết −3 / giây).
// ============================================================================
export const WATER_WALK = [
  { id: 'thuy_thuong_phieu', name: 'Thủy Thượng Phiêu', source: 'SKILL', fx: 'qi', stamina: 2, speed: 1 },
  { id: 'lang_ba', name: 'Lăng Ba Vi Bộ', source: 'SKILL', fx: 'lotus', stamina: 2.5, speed: 1.1 },
  { id: 'hai_ho_than', name: 'Hài Hộ Thân', source: 'VIP_ITEM', fx: 'qi', stamina: 0, speed: 1 },
  { id: 'dinh_thuy_chau', name: 'Định Thủy Châu', source: 'VIP_ITEM', fx: 'lotus', stamina: 0, speed: 1 },
];
export const DROWN_HP = 3; // Khí huyết / giây khi kiệt sức giữa nước sâu
/**
 * Phép đạp nước tốt nhất người này đang có (đồ bị động trước — không tốn sức), null nếu không có.
 * ctx: { level, yong: { primary, accent }, owned: [id món Tàng Y Các], everPerk (đã đủ chuỗi 7 ngày nhiệm vụ mệnh) }
 */
export function waterWalkOf({ level = 0, yong = null, owned = [], everPerk = false } = {}) {
  if (owned.includes('dinh_thuy_chau')) return WATER_WALK[3];
  if (owned.includes('hai_ho_than')) return WATER_WALK[2];
  if (level >= 15 && everPerk) return WATER_WALK[1];
  if ((yong?.primary === '水' && level >= 10) || (yong?.accent === '水' && level >= 12)) return WATER_WALK[0];
  return null;
}
/** tiêu thể lực mỗi khung khi đang đạp nước; trả false khi vừa hết (mất phép tới khi lên bờ) */
export function spendWaterWalk(p, ww, dt) {
  if (!ww || !ww.stamina) return true;
  p.stamina = Math.max(0, (p.stamina ?? 0) - ww.stamina * dt);
  return p.stamina > 0;
}
export const FX_CODE = { qi: 1, lotus: 2 }; // mạng: mv b khi w = 5
