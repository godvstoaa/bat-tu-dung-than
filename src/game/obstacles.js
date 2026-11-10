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
/** Bỏ ô đặc (công trình bị phá — law/raze). */
export function unmarkSolidCell(i, j) { solid.delete(ck(i, j)); }
export const cellOf = (v) => Math.floor(v / CELL);

/** Khối chữ nhật đặc (theo trục) từ (x0, z0) tới (x1, z1). */
export function addSolidRect(x0, z0, x1, z1) {
  for (let i = cellOf(Math.min(x0, x1)); i <= cellOf(Math.max(x0, x1) - 1e-6); i++)
    for (let j = cellOf(Math.min(z0, z1)); j <= cellOf(Math.max(z0, z1) - 1e-6); j++) solid.add(ck(i, j));
}
/** Đặc trong hộp xoay tâm (x, z), nửa cạnh hw (trục x cục bộ) × hd (trục z cục bộ), xoay ry (quy ước three.js:
 *  x cục bộ → (cos ry, −sin ry), z cục bộ → (sin ry, cos ry)). Nhà phố Ngoại Thành — không cắt lát model. */
export function addSolidOBB(x, z, hw, hd, ry) {
  const c = Math.cos(ry), s = Math.sin(ry), R = Math.hypot(hw, hd);
  for (let i = cellOf(x - R); i <= cellOf(x + R); i++) for (let j = cellOf(z - R); j <= cellOf(z + R); j++) {
    const px = (i + 0.5) * CELL - x, pz = (j + 0.5) * CELL - z;
    const lx = px * c - pz * s, lz = px * s + pz * c;
    if (Math.abs(lx) <= hw && Math.abs(lz) <= hd) solid.add(ck(i, j));
  }
}
/** Đặc trong hình tròn (gốc cây, cột, tháp góc) — ô lưới, không vào danh sách vòng duyệt tuyến tính */
export function addSolidCircle(x, z, r) {
  for (let i = cellOf(x - r); i <= cellOf(x + r); i++) for (let j = cellOf(z - r); j <= cellOf(z + r); j++) {
    if (((i + 0.5) * CELL - x) ** 2 + ((j + 0.5) * CELL - z) ** 2 <= r * r) solid.add(ck(i, j));
  }
}
/** Đặc dải thẳng từ A tới B, nửa bề dày hw (tường thành) */
export function addSolidSegment(ax, az, bx, bz, hw) {
  const L = Math.hypot(bx - ax, bz - az) || 1;
  addSolidOBB((ax + bx) / 2, (az + bz) / 2, L / 2, hw, Math.atan2(-(bz - az), bx - ax));
}
/** Bỏ đặc trong chữ nhật (khoét lối đi qua cổng). */
export function clearSolidRect(x0, z0, x1, z1) {
  for (let i = cellOf(Math.min(x0, x1)); i <= cellOf(Math.max(x0, x1) - 1e-6); i++)
    for (let j = cellOf(Math.min(z0, z1)); j <= cellOf(Math.max(z0, z1) - 1e-6); j++) solid.delete(ck(i, j));
}

// lớp va chạm của phòng nội thất dựng lười (đồ đạc nhà riêng đổi được): mỗi phòng một tập ô, bỏ được
const dyn = new Set(), roomCells = new Map();
export function setRoomSolids(key, obbs) {
  clearRoomSolids(key);
  const cells = new Set();
  for (const { x, z, hw, hd, ry = 0 } of obbs) {
    const c = Math.cos(ry), s = Math.sin(ry), R = Math.hypot(hw, hd);
    for (let i = cellOf(x - R); i <= cellOf(x + R); i++) for (let j = cellOf(z - R); j <= cellOf(z + R); j++) {
      const px = (i + 0.5) * CELL - x, pz = (j + 0.5) * CELL - z, lx = px * c - pz * s, lz = px * s + pz * c;
      if (Math.abs(lx) <= hw && Math.abs(lz) <= hd) { const k = ck(i, j); cells.add(k); dyn.add(k); }
    }
  }
  roomCells.set(key, cells);
}
export function clearRoomSolids(key) { const c = roomCells.get(key); if (c) for (const k of c) dyn.delete(k); roomCells.delete(key); }
export const solidAt = (x, z) => { const k = ck(cellOf(x), cellOf(z)); return solid.has(k) || dyn.has(k); };

// Vùng chừa trống quanh điểm đứng của trạm / cửa điện (world.js đăng ký): phần LẤP ĐẶC công trình
// (collide.js › solidifyCells) không được phủ lên — cửa điện hay nằm trong hốc hiên trước mặt tiền.
const reserved = [];
export function reserveClear(x, z, r) { reserved.push({ x, z, r }); }
export function isReserved(x, z) { for (const v of reserved) if ((x - v.x) ** 2 + (z - v.z) ** 2 < v.r * v.r) return true; return false; }
export const solidCount = () => solid.size;
/** có vùng chừa trống của trạm nào trong khung (x0, z0)–(x1, z1) không (công trình có cửa trạm: không phá được) */
export function reservedWithin(x0, z0, x1, z1) { for (const v of reserved) if (v.x > x0 - v.r && v.x < x1 + v.r && v.z > z0 - v.r && v.z < z1 + v.r) return true; return false; }

// Nền chữ nhật xoay ry (cùng quy ước local() của landmarks.js), mặt trên ở độ cao top
// nền chia theo ô 64 m (hàng trăm nền của biệt phủ / biệt thự — tra tuyến tính mỗi lần groundY là quá chậm)
const PB = 64, pbuckets = new Map();
// bot: mặt dưới (cầu cao — người bơi / đi dưới gầm cầu không bị nhấc lên mặt cầu), mặc định đặc tới đất
export function addPlatform(x, z, w, d, ry, top, bot = -Infinity) {
  const r = { x, z, hw: w / 2, hd: d / 2, c: Math.cos(ry), s: Math.sin(ry), top, bot }, R = Math.hypot(w, d) / 2;
  rects.push(r);
  for (let i = Math.floor((x - R) / PB); i <= Math.floor((x + R) / PB); i++) for (let j = Math.floor((z - R) / PB); j <= Math.floor((z + R) / PB); j++) {
    const k = i * 100000 + j; let b = pbuckets.get(k); if (!b) pbuckets.set(k, (b = [])); b.push(r);
  }
}

// ---------------------------------------------------------------------------
// Hỗ trợ World 3D (landmarks.js gọi; thuần để test Node chạy trực tiếp).
// ---------------------------------------------------------------------------

// (Khối chặn tường thành: batquai.js › octWallBlocks — tường bát giác Bát Quái Thành.)

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
// Nhân vật đứng yên (NPC, khách hỏi việc…): vòng chặn động, render3d cập nhật mỗi khung —
// người chơi không còn đi xuyên / đứng chồng lên NPC
let actors = [];
export function setActors(list) { actors = list; }
export function actorAt(x, z, pad = 0) {
  for (const a of actors) { const r = a.r + pad; if ((x - a.x) ** 2 + (z - a.z) ** 2 < r * r) return a; }
  return null;
}
export function blockedByBuilding(x, z) {
  for (const [dx, dz] of BODY) if (solidAt(x + dx, z + dz)) return true;
  for (const c of circles) if ((x - c.x) ** 2 + (z - c.z) ** 2 < c.r * c.r) return true;
  if (actors.length && actorAt(x, z, 0.3)) return true;
  return false;
}

// sàn phòng nội thất lưới (rooms.js đăng ký): tra nhanh theo ô lưới thay vì thêm ~90 nền vào rects
let dynFloor = null, dynX = Infinity;
export function setDynFloor(x0, fn) { dynX = x0; dynFloor = fn; }
/** đỉnh nền cao nhất tại (x, z); y (tuỳ chọn) = cao độ người — bỏ qua nền có mặt dưới cao hơn đầu người (gầm cầu) */
export function platformTop(x, z, y = null) {
  if (dynFloor && x > dynX) { const f = dynFloor(x, z); if (f != null) return f; }
  let t = null;
  for (const r of pbuckets.get(Math.floor(x / PB) * 100000 + Math.floor(z / PB)) || []) {
    if (y != null && y < r.bot - 0.3) continue;
    const dx = x - r.x, dz = z - r.z;
    const lx = r.c * dx - r.s * dz, lz = r.s * dx + r.c * dz;
    if (Math.abs(lx) < r.hw && Math.abs(lz) < r.hd) t = t == null ? r.top : Math.max(t, r.top);
  }
  return t;
}

// ---------------------------------------------------------------------------
// ĐỈNH CÔNG TRÌNH (leo trèo / đứng trên mái): hộp xoay có cao độ đỉnh TUYỆT ĐỐI (m) — nhà phố, tường thành, công trình
// GLB (collide.addFootprint), biệt phủ / biệt thự, tháp, cây. tallTopAt(x, z) = đỉnh cao nhất chứa điểm (null nếu không có).
// ---------------------------------------------------------------------------
const TB = 32, tall = new Map();
export function addTall(x, z, hw, hd, ry, top) {
  const r = { x, z, hw, hd, c: Math.cos(ry), s: Math.sin(ry), top }, R = Math.hypot(hw, hd);
  for (let i = Math.floor((x - R) / TB); i <= Math.floor((x + R) / TB); i++) for (let j = Math.floor((z - R) / TB); j <= Math.floor((z + R) / TB); j++) {
    const k = i * 100000 + j; let b = tall.get(k); if (!b) tall.set(k, (b = [])); b.push(r);
  }
  return r; // giữ để hạ đỉnh khi công trình bị phá (r.top = −∞) / dựng lại
}
export function tallTopAt(x, z) {
  let t = null;
  for (const r of tall.get(Math.floor(x / TB) * 100000 + Math.floor(z / TB)) || []) {
    const dx = x - r.x, dz = z - r.z, lx = r.c * dx - r.s * dz, lz = r.s * dx + r.c * dz;
    if (Math.abs(lx) <= r.hw + 0.35 && Math.abs(lz) <= r.hd + 0.35) t = t == null ? r.top : Math.max(t, r.top);
  }
  return t;
}
/** ô có đặc (thân người) không — dùng cho leo trèo */
export const solidAtBody = (x, z) => blockedByBuilding(x, z);
