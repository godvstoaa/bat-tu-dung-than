// Va chạm của kiến trúc (toạ độ mét thế giới). Thuần JS (world.js + world3d.js + test Node dùng chung).
//  - lưới ô đặc 0,5 m: cắt lát hình khối model ở tầm thân người (collide.js) + khối chữ nhật thủ công
//  - vòng tròn chặn (công trình thủ công cũ: tường thành, cột điện)
//  - nền bậc cấp đi lên được (mặt trên ở độ cao top)
export const CELL = 0.5;
const solid = new Set();
const OFF = 40000, SPAN = 80000;
const ck = (i, j) => (i + OFF) * SPAN + (j + OFF);
const circles = [];
const rects = [];

export function addBlock(x, z, r) { circles.push({ x, z, r }); }

/** Đánh dấu ô đặc (chỉ số ô CELL). */
export function markSolidCell(i, j) { solid.add(ck(i, j)); }
export const cellOf = (v) => Math.floor(v / CELL);

/** Khối chữ nhật đặc (theo trục) từ (x0, z0) tới (x1, z1). */
export function addSolidRect(x0, z0, x1, z1) {
  for (let i = cellOf(Math.min(x0, x1)); i <= cellOf(Math.max(x0, x1) - 1e-6); i++)
    for (let j = cellOf(Math.min(z0, z1)); j <= cellOf(Math.max(z0, z1) - 1e-6); j++) solid.add(ck(i, j));
}
/** Bỏ đặc trong chữ nhật (khoét lối đi qua cổng). */
export function clearSolidRect(x0, z0, x1, z1) {
  for (let i = cellOf(Math.min(x0, x1)); i <= cellOf(Math.max(x0, x1) - 1e-6); i++)
    for (let j = cellOf(Math.min(z0, z1)); j <= cellOf(Math.max(z0, z1) - 1e-6); j++) solid.delete(ck(i, j));
}

export const solidAt = (x, z) => solid.has(ck(cellOf(x), cellOf(z)));
export const solidCount = () => solid.size;

// Nền chữ nhật xoay ry (cùng quy ước local() của landmarks.js), mặt trên ở độ cao top
export function addPlatform(x, z, w, d, ry, top) { rects.push({ x, z, hw: w / 2, hd: d / 2, c: Math.cos(ry), s: Math.sin(ry), top }); }

// Thân khách: tâm + 4 điểm lệch 0,3 m (đủ chặn tường mỏng một ô)
const BODY = [[0, 0], [0.3, 0], [-0.3, 0], [0, 0.3], [0, -0.3]];
export function blockedByBuilding(x, z) {
  for (const [dx, dz] of BODY) if (solidAt(x + dx, z + dz)) return true;
  for (const c of circles) if ((x - c.x) ** 2 + (z - c.z) ** 2 < c.r * c.r) return true;
  return false;
}

export function platformTop(x, z) {
  let t = null;
  for (const r of rects) {
    const dx = x - r.x, dz = z - r.z;
    const lx = r.c * dx - r.s * dz, lz = r.s * dx + r.c * dz;
    if (Math.abs(lx) < r.hw && Math.abs(lz) < r.hd) t = t == null ? r.top : Math.max(t, r.top);
  }
  return t;
}
