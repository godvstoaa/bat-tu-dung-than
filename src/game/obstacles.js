// Va chạm của kiến trúc (toạ độ mét thế giới). Thuần JS (world.js + world3d.js + test Node dùng chung).
//  - lưới ô đặc 0,5 m: cắt lát hình khối model ở tầm thân người (collide.js) + khối chữ nhật thủ công
//  - vòng tròn chặn (công trình thủ công cũ: tường thành, cột điện)
//  - nền bậc cấp đi lên được (mặt trên ở độ cao top)
export const CELL = 0.5;
// v4 (thành ×10, ~23.000 nhà ≈ 18 triệu ô): Set<number> vượt trần ~16,7 triệu phần tử của JS → lưới ô 0,5 m lưu dạng
// BITSET theo mảnh 64 × 64 ô (32 m): Map<mảnh, Uint8Array(512)>. Cùng giao diện add / delete / has / size với Set cũ.
const solid = (() => {
  const T = new Map(); let n = 0;
  const loc = (k) => { const i = Math.floor(k / SPAN) - OFF, j = (k % SPAN) - OFF; return [((i >> 6) * 4096) + (j >> 6), ((i & 63) << 6) | (j & 63)]; };
  return {
    add(k) { const [t, b] = loc(k); let a = T.get(t); if (!a) { a = new Uint8Array(512); T.set(t, a); } const m = 1 << (b & 7); if (!(a[b >> 3] & m)) { a[b >> 3] |= m; n++; } },
    delete(k) { const [t, b] = loc(k), a = T.get(t); if (!a) return; const m = 1 << (b & 7); if (a[b >> 3] & m) { a[b >> 3] &= ~m; n--; } },
    has(k) { const [t, b] = loc(k), a = T.get(t); return !!a && !!(a[b >> 3] & (1 << (b & 7))); },
    get size() { return n; },
  };
})();
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
/** Khoét lối tròn (cửa nhà dãy phố AAA — GDD BLD-thanh-23 khoét cổng 1,6 m): bỏ ô đặc trong bán kính r. */
export function carveSolidCircle(x, z, r) {
  for (let i = cellOf(x - r); i <= cellOf(x + r); i++) for (let j = cellOf(z - r); j <= cellOf(z + r); j++) {
    if (((i + 0.5) * CELL - x) ** 2 + ((j + 0.5) * CELL - z) ** 2 <= r * r) solid.delete(ck(i, j));
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
// sky: nền TRỜI (quận đảo bay y 460 — terrain.js › SKY_DISTRICT): chỉ tính khi lời gọi biết cao độ người
// (motion.groundHeight truyền y). Lời gọi 2D không y (world3d.groundY cho camera clamp, world.blockedAt,
// dân phố) bỏ qua nền trời — người dưới đảo không bị nhấc lên 460, spawn (3,43) không bị kẹp camera (GAME-TROI-THIET-KE §5.4).
// base: NỀN ĐẢO (tiên phủ) — trong một HỐ (addPit: lòng hồ) thì nền đảo không tính, chỉ còn đáy hồ + nền khác (cầu, đảo giữa hồ)
export function addPlatform(x, z, w, d, ry, top, bot = -Infinity, sky = false, base = false) {
  const r = { x, z, hw: w / 2, hd: d / 2, c: Math.cos(ry), s: Math.sin(ry), top, bot, sky, base }, R = Math.hypot(w, d) / 2;
  rects.push(r);
  for (let i = Math.floor((x - R) / PB); i <= Math.floor((x + R) / PB); i++) for (let j = Math.floor((z - R) / PB); j <= Math.floor((z + R) / PB); j++) {
    const k = i * 100000 + j; let b = pbuckets.get(k); if (!b) pbuckets.set(k, (b = [])); b.push(r);
  }
}

/** nền ĐA GIÁC ĐỀU (sàn lầu tiên phủ): n cạnh, apothem a, cạnh phẳng trên trục cục bộ (tienphu/tower.js › polyVerts) */
export function addPolyPlatform(x, z, n, a, ry, top, bot = -Infinity, base = false) {
  const r = { x, z, hw: a / Math.cos(Math.PI / n), hd: a / Math.cos(Math.PI / n), c: Math.cos(ry), s: Math.sin(ry), top, bot, sky: false, base, n, a };
  r.nc = Array.from({ length: n }, (_, k) => [Math.cos((2 * Math.PI * k) / n), Math.sin((2 * Math.PI * k) / n)]);
  rects.push(r);
  const R = r.hw;
  for (let i = Math.floor((x - R) / PB); i <= Math.floor((x + R) / PB); i++) for (let j = Math.floor((z - R) / PB); j <= Math.floor((z + R) / PB); j++) {
    const k = i * 100000 + j; let b = pbuckets.get(k); if (!b) pbuckets.set(k, (b = [])); b.push(r);
  }
  return r;
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
/** y (tuỳ chọn) = cao độ chân người: có thì xét thêm VẬT CẢN THEO TẦNG (solid3 — vách / đồ của nhà nhiều tầng) */
export function blockedByBuilding(x, z, y = null) {
  for (const [dx, dz] of BODY) if (solidAt(x + dx, z + dz)) return true;
  for (const c of circles) if ((x - c.x) ** 2 + (z - c.z) ** 2 < c.r * c.r) return true;
  if (actors.length && actorAt(x, z, 0.3)) return true;
  if (y != null && (s3.size || dyn3.size)) for (const [dx, dz] of BODY) if (solid3At(x + dx, z + dz, y)) return true;
  return false;
}
/** như blockedByBuilding nhưng BỎ vòng chặn nhân vật — NPC tự kiểm chỗ đứng / bước kế (không tự chặn chính mình) */
export function blockedStatic(x, z, y = null) {
  const a = actors; actors = [];
  try { return blockedByBuilding(x, z, y); } finally { actors = a; }
}

// ---------------------------------------------------------------------------
// VẬT CẢN THEO TẦNG (tiên phủ — toà 10 tầng, docs/TIEN-PHU-MANIFEST.md §4): ô 0,5 m mang khoảng cao [y0, y1].
// Chặn thân người khi khoảng đó giao (y + 0,3, y + 1,75) — bậc / thảm thấp hơn 0,3 m không chặn, trần tầng trên không chặn.
// Lời gọi 2D (không y: A* dân phố, camera) bỏ qua lớp này. s3: tĩnh (vách, cột, lan can); dyn3: đồ bài trí đổi được.
// ---------------------------------------------------------------------------
const s3 = new Map(), dyn3 = new Map(), room3 = new Map();
const pushRange = (M, k, y0, y1) => { let a = M.get(k); if (!a) M.set(k, (a = [])); a.push(y0, y1); };
const eachOBBCell = (x, z, hw, hd, ry, fn) => {
  const c = Math.cos(ry), s = Math.sin(ry), R = Math.hypot(hw, hd);
  for (let i = cellOf(x - R); i <= cellOf(x + R); i++) for (let j = cellOf(z - R); j <= cellOf(z + R); j++) {
    const px = (i + 0.5) * CELL - x, pz = (j + 0.5) * CELL - z, lx = px * c - pz * s, lz = px * s + pz * c;
    // nửa ô dung sai: vách mỏng 0,2 m vẫn phủ ít nhất một hàng ô
    if (Math.abs(lx) <= Math.max(hw, CELL * 0.5) && Math.abs(lz) <= Math.max(hd, CELL * 0.5)) fn(ck(i, j));
  }
};
/** khối đặc theo tầng: hộp xoay (cùng quy ước addSolidOBB), cao từ y0 tới y1 (m tuyệt đối) */
export function addSolid3(x, z, hw, hd, ry, y0, y1) { eachOBBCell(x, z, hw, hd, ry, (k) => pushRange(s3, k, y0, y1)); }
/** đồ bài trí theo tầng (dựng lười, đổi được): obbs [{ x, z, hw, hd, ry, y0, y1 }] */
export function setRoomSolids3(key, obbs) {
  clearRoomSolids3(key);
  const own = [];
  for (const o of obbs) eachOBBCell(o.x, o.z, o.hw, o.hd, o.ry || 0, (k) => { pushRange(dyn3, k, o.y0, o.y1); own.push(k, o.y0, o.y1); });
  room3.set(key, own);
}
export function clearRoomSolids3(key) {
  const own = room3.get(key); if (!own) return;
  for (let n = 0; n < own.length; n += 3) {
    const a = dyn3.get(own[n]); if (!a) continue;
    for (let q = 0; q < a.length; q += 2) if (a[q] === own[n + 1] && a[q + 1] === own[n + 2]) { a.splice(q, 2); break; }
    if (!a.length) dyn3.delete(own[n]);
  }
  room3.delete(key);
}
const BODY_LO = 0.3, BODY_HI = 1.75;
const hitRange = (a, y) => { if (a) for (let q = 0; q < a.length; q += 2) if (a[q] < y + BODY_HI && a[q + 1] > y + BODY_LO) return true; return false; };
export function solid3At(x, z, y) { const k = ck(cellOf(x), cellOf(z)); return hitRange(s3.get(k), y) || hitRange(dyn3.get(k), y); }
export const solid3Count = () => s3.size;
/** chỉ số ô → khoá ô (tienphu/voxel.js) */
export const cellKey = (i, j) => ck(i, j);
// LỚP VOXEL (tiên phủ — vật cản lấy từ chính lưới hình): theo khoá phủ, thay nguyên khi dựng lại (đổi tuỳ biến / chủ đề tầng)
const vox2 = new Map();
/** cells3: Map<khoá ô, [y0, y1, …]> (lớp theo tầng) · cells2: Set<khoá ô> (đặc 2D — chặn cả A* / dân phố) */
export function setVoxelLayer(key, cells3, cells2) {
  clearRoomSolids3(key);
  const own = [];
  for (const [k, ranges] of cells3) for (let q = 0; q < ranges.length; q += 2) { pushRange(dyn3, k, ranges[q], ranges[q + 1]); own.push(k, ranges[q], ranges[q + 1]); }
  room3.set(key, own);
  const old = vox2.get(key); if (old) for (const k of old) dyn.delete(k);
  const mine = new Set(); for (const k of cells2) if (!dyn.has(k)) { dyn.add(k); mine.add(k); }
  vox2.set(key, mine);
  return { cells3: cells3.size, cells2: mine.size };
}

// VÙNG MỞ: dải trời Cửu Trọng Thiên nằm ngoài mép biển mây (T.EDGE) — motion.js không chặn đi trong vùng này
const openZones = [];
export function addOpenZone(x0, z0, x1, z1) { openZones.push({ x0, z0, x1, z1 }); }
export const inOpenZone = (x, z) => openZones.some((o) => x > o.x0 && x < o.x1 && z > o.z0 && z < o.z1);

// HỐ (lòng hồ tiên phủ): elip { x, z, rx, rz, ry } hoặc chữ nhật { x, z, hw, hd, ry, rect } — đáy ở bottom (m tuyệt đối)
const pits = [], pitB = new Map();
export function addPit(p) {
  const q = { ...p, c: Math.cos(p.ry || 0), s: Math.sin(p.ry || 0) }, R = Math.hypot(p.rx ?? p.hw, p.rz ?? p.hd);
  pits.push(q);
  for (let i = Math.floor((p.x - R) / PB); i <= Math.floor((p.x + R) / PB); i++) for (let j = Math.floor((p.z - R) / PB); j <= Math.floor((p.z + R) / PB); j++) {
    const k = i * 100000 + j; let b = pitB.get(k); if (!b) pitB.set(k, (b = [])); b.push(q);
  }
}
// y0 / y1 (tuỳ chọn): hố chỉ khoét nền base có mặt trên trong [y0, y1] (lỗ thang khoét đúng một sàn tầng); bottom (tuỳ chọn): đáy
const inPit = (q, x, z) => { const dx = x - q.x, dz = z - q.z, lx = q.c * dx - q.s * dz, lz = q.s * dx + q.c * dz; return q.rect ? Math.abs(lx) < q.hw && Math.abs(lz) < q.hd : (lx / q.rx) ** 2 + (lz / q.rz) ** 2 < 1; };
export function pitsAt(x, z) { const out = []; for (const q of pitB.get(Math.floor(x / PB) * 100000 + Math.floor(z / PB)) || []) if (inPit(q, x, z)) out.push(q); return out; }
export function pitAt(x, z) { for (const q of pitB.get(Math.floor(x / PB) * 100000 + Math.floor(z / PB)) || []) if (inPit(q, x, z)) return q; return null; }
const pitCuts = (ps, top) => { for (const q of ps) if ((q.y0 ?? -Infinity) <= top && top <= (q.y1 ?? Infinity)) return true; return false; };

// sàn phòng nội thất lưới (rooms.js đăng ký): tra nhanh theo ô lưới thay vì thêm ~90 nền vào rects
let dynFloor = null, dynX = Infinity;
export function setDynFloor(x0, fn) { dynX = x0; dynFloor = fn; }
/** đỉnh nền cao nhất tại (x, z); y (tuỳ chọn) = cao độ người — bỏ qua nền có mặt dưới cao hơn đầu người (gầm cầu) */
export function platformTop(x, z, y = null) {
  if (dynFloor && x > dynX) { const f = dynFloor(x, z); if (f != null) return f; }
  let t = null;
  const ps = pits.length ? pitsAt(x, z) : null, pit = ps && ps.length ? ps : null;
  if (pit) for (const q of pit) if (q.bottom != null && (y == null || y >= q.bottom - 0.3)) t = t == null ? q.bottom : Math.max(t, q.bottom);
  for (const r of pbuckets.get(Math.floor(x / PB) * 100000 + Math.floor(z / PB)) || []) {
    if (pit && r.base && pitCuts(pit, r.top)) continue; // lòng hồ / lỗ thang khoét qua nền base
    if (r.sky && y == null) continue; // nền trời (đảo bay y 460): chỉ tính khi lời gọi biết cao độ người
    if (y != null && y < r.bot - 0.3) continue;
    const dx = x - r.x, dz = z - r.z;
    const lx = r.c * dx - r.s * dz, lz = r.s * dx + r.c * dz;
    if (Math.abs(lx) < r.hw && Math.abs(lz) < r.hd && (!r.n || r.nc.every(([cx, cz]) => lx * cx + lz * cz <= r.a))) t = t == null ? r.top : Math.max(t, r.top);
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
