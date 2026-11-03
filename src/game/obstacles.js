// Va chạm của kiến trúc đặt động (landmarks): vòng tròn chặn đường + nền bậc cấp đi lên được.
// Toạ độ mét thế giới. Thuần JS (world.js + world3d.js dùng chung).
const circles = [];
const rects = [];

export function addBlock(x, z, r) { circles.push({ x, z, r }); }

// Nền chữ nhật xoay ry (cùng quy ước local() của landmarks.js), mặt trên ở độ cao top
export function addPlatform(x, z, w, d, ry, top) { rects.push({ x, z, hw: w / 2, hd: d / 2, c: Math.cos(ry), s: Math.sin(ry), top }); }

export function blockedByBuilding(x, z) {
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
