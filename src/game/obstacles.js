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

// ---------------------------------------------------------------------------
// Hỗ trợ World 3D (landmarks.js gọi; thuần để test Node chạy trực tiếp).
// ---------------------------------------------------------------------------

/** Khối chặn dọc tường Huyền Thành (bán kính `radius`, `nSeg` đoạn cung): mỗi đoạn 3 khối —
 *  giữa + 2 điểm lệch 1/6 vào hai đầu. Bước khối ~5,2 m nhỏ hơn đường kính khối ~6,8 m nên
 *  các khối chồng lên nhau → vòng tường kín (không còn lỗ hở ~8 m ở mối nối như bản cũ
 *  chỉ chặn 1 khối giữa đoạn). Đoạn cổng Nam (sin giữa > 0,985) vẫn bỏ qua để chừa lối. */
export function cityWallBlocks(radius = 158, nSeg = 64) {
  const out = [];
  for (let i = 0; i < nSeg; i++) {
    const a0 = (i / nSeg) * Math.PI * 2, a1 = ((i + 1) / nSeg) * Math.PI * 2, am = (a0 + a1) / 2;
    if (Math.abs(Math.sin(am)) > 0.985 && Math.sin(am) > 0) continue; // chừa cổng Nam (+Z)
    const x0 = Math.cos(a0) * radius, z0 = Math.sin(a0) * radius, x1 = Math.cos(a1) * radius, z1 = Math.sin(a1) * radius;
    for (const t of [1 / 6, 1 / 2, 5 / 6]) out.push({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, r: 3.4 });
  }
  return out;
}

/** Viền vách quanh nền bậc cấp tại (x, z), xoay ry, kích thước w×d: đánh dấu dải ô đặc dày `band`
 *  quanh mép — người không trèo lên nóc từ hông (như court.js › EDGE). Phía +z cục bộ (mặt bậc
 *  thang) chừa lối rộng 2·stairW quanh trục giữa để vẫn leo lên được. */
export function markTerraceEdges(x, z, ry, w, d, { band = 0.5, stairW = 0 } = {}) {
  const hw = w / 2, hd = d / 2, c = Math.cos(ry), s = Math.sin(ry);
  const pt = (lx, lz) => [x + c * lx + s * lz, z - s * lx + c * lz]; // local → world (quy ước landmarks.local)
  const line = (lx0, lz0, lx1, lz1, ix, iz, open) => {
    const n = Math.max(2, Math.ceil(Math.hypot(lx1 - lx0, lz1 - lz0) / (CELL * 0.25))); // lấy mẫu dày, hết lỗ chéo
    for (let k = 0; k <= n; k++) {
      const t = k / n, lx = lx0 + (lx1 - lx0) * t, lz = lz0 + (lz1 - lz0) * t;
      if (open && Math.abs(lx) < stairW) continue; // cửa bậc chính diện
      for (let e = 0; e * 0.25 < band; e++) { // dải dày `band` theo pháp tuyến vào lòng nền
        const [wx, wz] = pt(lx + ix * e * 0.25, lz + iz * e * 0.25);
        markSolidCell(cellOf(wx), cellOf(wz));
      }
    }
  };
  line(-hw, -hd, hw, -hd, 0, 1);       // mép sau (−z cục bộ) — pháp tuyến vào trong là +z
  line(hw, -hd, hw, hd, -1, 0);        // mép phải (+x cục bộ)
  line(hw, hd, -hw, hd, 0, -1, true);  // mép trước (+z cục bộ, mặt bậc) — mở cửa giữa
  line(-hw, hd, -hw, -hd, 1, 0);       // mép trái (−x cục bộ)
}

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
