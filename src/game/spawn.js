// ============================================================================
//  NƠI XUẤT HIỆN (v4 · G3) — thay cho MỘT điểm chung (sân Sơn Môn, máy chủ gán cứng).
//  Kết hợp: lần đầu vào → Tân Thủ (đi kèm hướng dẫn tân thủ); các lần sau người chơi chọn:
//    · chỗ lần trước (mặc định, lưu trên máy + đám mây)
//    · nhà riêng (nếu có)
//    · miếu ứng Dụng thần (Thủy → Khảm, Mộc → Chấn, Hỏa → Ly, Thổ → Cấn, Kim → Càn)
//    · sân Sơn Môn (trung tâm)
//  Module THUẦN — toạ độ thật do nơi gọi đưa vào (ctx), để đổi sang bố cục thành v4 (citylayout.spawnPoints) chỉ cần đổi ctx.
// ============================================================================

export const WARD_OF_WX = { 水: 'kan', 木: 'zhen', 火: 'li', 土: 'gen', 金: 'qian' };
export const WX_VI = { 水: 'Thủy', 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim' };
const MAX_AGE = 30 * 86400000; // vị trí cũ hơn 30 ngày thì không gợi ý nữa

/**
 * ctx: { lastPos: {x,z,at}|null, home: {x,z,name}|null, templeOf(ward) → {x,z,name}|null, plaza: {x,z}, yong: '水'…,
 *        firstTime: bool, now }
 * Trả danh sách lựa chọn [{ id, label, x, z, def? }] — lựa chọn đầu là mặc định.
 */
export function spawnOptions(ctx) {
  const now = ctx.now ?? Date.now(), out = [];
  if (ctx.firstTime) return [{ id: 'tanthu', label: '🏮 Tân Thủ — bắt đầu hành trình', x: ctx.plaza.x, z: ctx.plaza.z, def: true }];
  const lp = ctx.lastPos;
  if (lp && Number.isFinite(lp.x) && Number.isFinite(lp.z) && now - (lp.at || 0) < MAX_AGE) out.push({ id: 'last', label: '📍 Chỗ lần trước', x: lp.x, z: lp.z });
  if (ctx.home) out.push({ id: 'home', label: `🏡 Về nhà (${ctx.home.name || 'nhà riêng'})`, x: ctx.home.x, z: ctx.home.z });
  const ward = WARD_OF_WX[ctx.yong];
  const t = ward && ctx.templeOf?.(ward);
  if (t) out.push({ id: 'menh', label: `☯ Miếu hợp mệnh ${WX_VI[ctx.yong]} — ${t.name}`, x: t.x, z: t.z });
  out.push({ id: 'plaza', label: '⛩ Sân Sơn Môn (trung tâm)', x: ctx.plaza.x, z: ctx.plaza.z });
  out[0].def = true;
  return out;
}

/** có nên lưu vị trí này làm «chỗ lần trước» không (bỏ dải phòng nội thất / tù / mỏ — x ≥ roomX0, toạ độ hỏng) */
export function savablePos(x, z, roomX0) {
  return Number.isFinite(x) && Number.isFinite(z) && x < roomX0 - 50;
}
