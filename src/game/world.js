// ============================================================================
//  HUYỀN QUÁN — bản đồ lưới 20×14, vật cản, vị trí các gian, tìm đường BFS.
//  Toạ độ theo ô (float); ô (c, r) phủ [c, c+1) × [r, r+1).
// ============================================================================

import { hasStation, TEXT } from './features.js';
import { walkable } from './terrain.js';
import { blockedByBuilding, platformTop } from './obstacles.js';

export const COLS = 20;
export const ROWS = 14;
export const TILE = 32;

// block: các hình chữ nhật chặn đường {c, r, w, h}. spot: chỗ khách đứng để vào gian.
const ALL_STATIONS = [
  { id: 'thay', name: 'Bàn Thầy Tử Bình', verb: 'Ngồi trước bàn thầy', block: [{ c: 7, r: 1, w: 6, h: 3 }, { c: 9, r: 4, w: 2, h: 1 }], spot: { x: 10, y: 5.5 }, label: { x: 10, y: 0.75 } },
  { id: 'tra', name: 'Trà Thất', verb: 'Ngồi bồ đoàn uống trà', block: [{ c: 1, r: 1, w: 5, h: 2 }], spot: { x: 3.5, y: 3.6 }, label: { x: 3.5, y: 0.75 } },
  { id: 'compass', name: 'La Bàn Đài', verb: 'Xem la bàn hướng nhà', block: [{ c: 15, r: 1, w: 3, h: 2 }], spot: { x: 16.5, y: 3.6 }, label: { x: 16.5, y: 0.75 } },
  { id: 'xam', name: 'Ống Xăm', verb: 'Xin một quẻ xăm', block: [{ c: 2, r: 6, w: 2, h: 2 }], spot: { x: 4.6, y: 7 }, label: { x: 3, y: 5.6 } },
  { id: 'huong', name: 'Lư Hương', verb: 'Thắp một tuần nhang', block: [{ c: 9, r: 7, w: 2, h: 1 }], spot: { x: 10, y: 8.7 }, label: { x: 10, y: 6.2 } },
  { id: 'lich', name: 'Bảng Lịch Ngày', verb: 'Xem lịch hôm nay', block: [{ c: 16, r: 6, w: 2, h: 2 }], spot: { x: 15.4, y: 7 }, label: { x: 17, y: 5.6 } },
  { id: 'sen', name: 'Hồ Sen', verb: 'Thả đèn hoa đăng', block: [{ c: 6, r: 10, w: 8, h: 2 }], spot: { x: 14.6, y: 10.9 }, label: { x: 10, y: 9.7 } },
  // Khách hỏi việc (Giải Án, P2) — 3 khách NPC đứng chờ, đổi mỗi ngày
  { id: 'an0', kind: 'case', slot: 0, name: 'Khách hỏi việc', verb: 'Giải án cho khách', block: [{ c: 5, r: 8, w: 1, h: 1 }], spot: { x: 5.5, y: 9.4 }, label: { x: 5.5, y: 7.6 } },
  { id: 'an1', kind: 'case', slot: 1, name: 'Khách hỏi việc', verb: 'Giải án cho khách', block: [{ c: 14, r: 8, w: 1, h: 1 }], spot: { x: 14.5, y: 9.4 }, label: { x: 14.5, y: 7.6 } },
  { id: 'an2', kind: 'case', slot: 2, name: 'Khách hỏi việc', verb: 'Giải án cho khách', block: [{ c: 14, r: 4, w: 1, h: 1 }], spot: { x: 14.5, y: 5.4 }, label: { x: 14.5, y: 3.6 } },
];

// Sảnh nghề ngoài thế giới (docs/GAME-NOI-DUNG-THEO-APP.md) — world: toạ độ mét (khớp terrain.js › CLEARINGS)
export const HALLS = [
  { id: 'trach', region: 'lichduong', name: 'Sảnh Trạch Nhật', verb: 'Chọn ngày cho khách', world: { x: 735, z: -36 } },
  { id: 'duongtrach', region: 'phongthuy', name: 'Sảnh Dương Trạch', verb: 'Xem nhà cho khách', world: { x: -806, z: 62 } },
  { id: 'dieuhau', region: 'cungthong', name: 'Sảnh Điều Hậu', verb: 'Xem khí hậu lá số', world: { x: 480, z: 420 } },
  { id: 'thuvien', region: 'thulau', name: 'Thư Lâu', verb: 'Đọc tầng thư hôm nay', world: { x: 0, z: -630 } },
  { id: 'hophon', region: 'thanh', name: 'Bàn Hợp Hôn', verb: 'Xem hợp hôn (án chung)', world: { x: -40, z: 40 } },
  { id: 'tuvi', region: 'trichthien', name: 'Sảnh Tử Vi', verb: 'An sao Tử Vi', world: { x: -567, z: 503 } },
  { id: 'tuongphap', region: 'manh', name: 'Sảnh Tượng Pháp', verb: 'Đọc tượng Manh phái', world: { x: 654, z: -441 } },
  { id: 'cachcuc', region: 'tubinh', name: 'Sảnh Cách Cục', verb: 'Định cách cục', world: { x: -521, z: -538 } },
];
for (const h of HALLS) {
  const tx = h.world.x / 1.6 + 10, ty = h.world.z / 1.6 + 7;
  ALL_STATIONS.push({ ...h, kind: 'desk', block: [], spot: { x: tx, y: ty + 1.6 }, label: { x: tx, y: ty } });
}

// ---------------------------------------------------------------------------
// ĐIỆN VÀO ĐƯỢC (docs/GAME-V2-THIET-KE.md §S4–S5): không gian trong điện đặt ở rìa Đông ngoài bản đồ
// (trên biển mây — ra khỏi sàn là chạm nước). Cửa ngoài thế giới «door», lối ra trong điện «exit».
// Toạ độ mét; tâm điện = origin, lối vào ở phía +z, bàn thờ phía −z.
// ---------------------------------------------------------------------------
export const ROOMS = [
  { id: 'chinhdien', name: 'Chính Điện Tam Thanh', region: 'thanh', door: { x: 0, z: -58 }, origin: { x: 1500, z: 0 }, w: 34, d: 28, h: 14,
    deities: [['deity_lingbao', -6.5], ['deity_yuanshi', 0], ['deity_daode', 6.5]], npc: 'que' },
  { id: 'vanxuong', name: 'Văn Xương Các', region: 'thulau', door: { x: 0, z: -652 }, origin: { x: 1600, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_wenchang', 0]] },
  { id: 'daumau', name: 'Đẩu Mẫu Điện', region: 'trichthien', door: { x: -566, z: 566 }, origin: { x: 1700, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_doumu', 0]] },
  { id: 'laoquan', name: 'Lão Quân Điện', region: 'tubinh', door: { x: -564, z: -510 }, origin: { x: 1800, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_daode', 0]] },
];
export const roomAt = (x, z) => ROOMS.find((r) => Math.abs(x - r.origin.x) <= r.w / 2 + 1 && Math.abs(z - r.origin.z) <= r.d / 2 + 1) || null;
const toTile = (x, z) => ({ x: x / 1.6 + 10, y: z / 1.6 + 7 });
for (const r of ROOMS) {
  const inside = toTile(r.origin.x, r.origin.z + r.d / 2 - 3.2);
  const exitW = { x: r.origin.x, z: r.origin.z + r.d / 2 - 1.2 };
  const doorT = toTile(r.door.x, r.door.z);
  ALL_STATIONS.push({ id: `door_${r.id}`, kind: 'door', room: r.id, name: r.name, verb: `Vào ${r.name}`, block: [], world: r.door, spot: { x: doorT.x, y: doorT.y + 1.2 }, label: doorT, to: inside });
  ALL_STATIONS.push({ id: `exit_${r.id}`, kind: 'exit', room: r.id, name: 'Cửa điện', verb: 'Ra khỏi điện', block: [], world: exitW, spot: toTile(exitW.x, exitW.z), label: toTile(exitW.x, exitW.z), to: { x: doorT.x, y: doorT.y + 2.2 } });
  if (r.npc === 'que') { const q = { x: r.origin.x - r.w / 2 + 8.5, z: r.origin.z + 1 }; ALL_STATIONS.push({ id: 'que', kind: 'desk', room: r.id, name: 'Thầy Giải Quẻ', verb: 'Xin thầy gieo quẻ', block: [], world: q, spot: toTile(q.x + 1.4, q.z), label: toTile(q.x, q.z) }); }
}

// Gian bật theo bản build (iOS tắt gian bói). Vật cản vẫn tính đủ mọi công trình.
export const STATIONS = ALL_STATIONS
  .filter((s) => hasStation(s.id))
  .map((s) => (s.id === 'huong' ? { ...s, name: TEXT.huong, verb: TEXT.huongVerb } : s));

// Cây và trang trí cũng chặn đường.
export const PROPS = [
  { type: 'peach', c: 1, r: 10 },
  { type: 'pine', c: 18, r: 10 },
  { type: 'peach', c: 6, r: 5 },
  { type: 'pine', c: 13, r: 5 },
];

export const START = { x: 12.2, y: 9.2 }; // trong sân, lệch khỏi lối giữa (không vướng gian nào)

export function stationById(id) {
  return STATIONS.find((s) => s.id === id) || null;
}

// Lưới vật cản: true = chặn.
function buildGrid() {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isGate = r === ROWS - 1 && (c === 9 || c === 10);
      if (r === 0 || c === 0 || c === COLS - 1 || (r === ROWS - 1 && !isGate)) g[r][c] = true;
    }
  }
  // Cổng tam quan mở ra thế giới Huyền Giới (hàng 13, cột 9–10 để trống).
  for (const st of ALL_STATIONS) for (const b of st.block) {
    for (let r = b.r; r < b.r + b.h; r++) for (let c = b.c; c < b.c + b.w; c++) g[r][c] = true;
  }
  for (const p of PROPS) g[p.r][p.c] = true;
  return g;
}

export const GRID = buildGrid();

// Ô trong sân quán dùng lưới; ngoài sân là thế giới mở (luôn «trống» ở mức ô — địa hình xét riêng).
export const inCourtTile = (c, r) => c >= 0 && r >= 0 && c < COLS && r < ROWS;
export function blockedTile(c, r) {
  if (!inCourtTile(c, r)) return false;
  return GRID[r][c];
}

// Toạ độ ô ↔ mét thế giới (khớp models.js: 1 ô = 1.6 m, tâm sân = (10, 7))
const U = 1.6;
export const tileToWorld = (x, y) => ({ x: (x - 10) * U, z: (y - 7) * U });
export const worldToTile = (X, Z) => ({ x: X / U + 10, y: Z / U + 7 });

const R = 0.28; // bán kính va chạm của khách (theo ô)

// from (tuỳ chọn, toạ độ ô) để xét độ dốc khi đi trên địa hình.
export function blockedAt(x, y, from = null) {
  if (blockedTile(Math.floor(x - R), Math.floor(y - R)) || blockedTile(Math.floor(x + R), Math.floor(y - R))
    || blockedTile(Math.floor(x - R), Math.floor(y + R)) || blockedTile(Math.floor(x + R), Math.floor(y + R))) return true;
  if (inCourtTile(Math.floor(x), Math.floor(y))) return false;
  const w = tileToWorld(x, y);
  if (blockedByBuilding(w.x, w.z)) return true;
  if (platformTop(w.x, w.z) != null) return false; // trên nền bậc cấp: đi thoải mái
  const f = from ? tileToWorld(from.x, from.y) : null;
  return !walkable(w.x, w.z, f?.x, f?.z);
}

// Ô trống gần nhất với (x, y) — dùng khi click vào công trình.
function nearestFree(x, y) {
  const c0 = Math.floor(x), r0 = Math.floor(y);
  if (!blockedTile(c0, r0)) return { c: c0, r: r0 };
  let best = null, bd = Infinity;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (GRID[r][c]) continue;
    const d = (c + 0.5 - x) ** 2 + (r + 0.5 - y) ** 2;
    if (d < bd) { bd = d; best = { c, r }; }
  }
  return best;
}

// BFS 8 hướng (không cắt góc) từ vị trí hiện tại tới điểm đích → danh sách điểm cần đi.
export function findPath(from, to) {
  // ngoài sân: đi thẳng tới đích (địa hình chặn dốc/nước trong lúc đi)
  if (!inCourtTile(Math.floor(from.x), Math.floor(from.y)) || !inCourtTile(Math.floor(to.x), Math.floor(to.y))) return [{ x: to.x, y: to.y }];
  const start = { c: Math.floor(from.x), r: Math.floor(from.y) };
  const goal = nearestFree(to.x, to.y);
  if (!goal) return [];
  const exactOk = !blockedAt(to.x, to.y);
  const key = (c, r) => r * COLS + c;
  const prev = new Map([[key(start.c, start.r), null]]);
  const q = [start];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (q.length) {
    const cur = q.shift();
    if (cur.c === goal.c && cur.r === goal.r) break;
    for (const [dc, dr] of dirs) {
      const c = cur.c + dc, r = cur.r + dr;
      if (blockedTile(c, r) || prev.has(key(c, r))) continue;
      if (dc && dr && (blockedTile(cur.c + dc, cur.r) || blockedTile(cur.c, cur.r + dr))) continue;
      prev.set(key(c, r), cur);
      q.push({ c, r });
    }
  }
  if (!prev.has(key(goal.c, goal.r))) return [];
  const tiles = [];
  for (let n = goal; n; n = prev.get(key(n.c, n.r))) tiles.unshift(n);
  const pts = tiles.slice(1).map((t) => ({ x: t.c + 0.5, y: t.r + 0.5 }));
  if (exactOk) {
    if (pts.length) pts[pts.length - 1] = { x: to.x, y: to.y };
    else pts.push({ x: to.x, y: to.y });
  }
  return pts;
}

// Gian nằm tại điểm click (theo vùng chặn hoặc chỗ đứng).
export function stationAt(x, y) {
  for (const st of STATIONS) {
    for (const b of st.block) if (x >= b.c && x < b.c + b.w && y >= b.r - 0.6 && y < b.r + b.h) return st;
    if (Math.hypot(x - st.spot.x, y - st.spot.y) < 0.6) return st;
  }
  return null;
}

export function nearestStation(pos, maxDist = 1.5) {
  let best = null, bd = maxDist;
  for (const st of STATIONS) {
    const d = Math.hypot(pos.x - st.spot.x, pos.y - st.spot.y);
    if (d <= bd) { bd = d; best = st; }
  }
  return best;
}
