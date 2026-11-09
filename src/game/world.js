// ============================================================================
//  HUYỀN QUÁN — vị trí các gian, vật cản, tìm đường.
//  Toạ độ người chơi theo ô 1,6 m (float): ô (x, y) ↔ mét (X, Z) = ((x − 10)·1,6, (y − 7)·1,6).
//  Bố cục sân quán: court.js (Sơn Môn). Va chạm: obstacles.js (lưới 0,5 m — cắt lát model + khối tay).
//  Tìm đường: đi thẳng nếu không vướng; không thì A* trên lưới nửa ô (0,8 m), rút gọn theo tầm nhìn thẳng.
// ============================================================================

import { hasStation, TEXT } from './features.js';
import { walkable } from './terrain.js';
import { blockedByBuilding, platformTop } from './obstacles.js';
import { COURT_STATIONS, START_M, toTile } from './court.js';

// Bản 2D dự phòng (render.js) vẫn vẽ sân cũ 20×14 ô
export const COLS = 20;
export const ROWS = 14;
export const TILE = 32;
export const PROPS = [];

const NAMES = {
  thay: ['Bàn Thầy Tử Bình', 'Ngồi trước bàn thầy'],
  tra: ['Trà Thất', 'Ngồi bồ đoàn uống trà'],
  compass: ['La Bàn Đài', 'Xem la bàn hướng nhà'],
  xam: ['Ống Xăm', 'Xin một quẻ xăm'],
  huong: ['Lư Hương', 'Thắp một tuần nhang'],
  lich: ['Bảng Lịch Ngày', 'Xem lịch hôm nay'],
  sen: ['Hồ Sen', 'Thả đèn hoa đăng'],
  tangy: ['Tàng Y Các', 'Xem trang phục, phụ kiện'],
  an0: ['Khách hỏi việc', 'Giải án cho khách'],
  an1: ['Khách hỏi việc', 'Giải án cho khách'],
  an2: ['Khách hỏi việc', 'Giải án cho khách'],
};
// block: chữ nhật theo ô {c, r, w, h} (bấm vào công trình → gian). spot: chỗ khách đứng. court: dữ liệu dựng 3D (mét)
const ALL_STATIONS = Object.keys(NAMES).map((id) => {
  const c = COURT_STATIONS.find((s) => s.id === id);
  const a = toTile(c.block[0], c.block[1]), b = toTile(c.block[2], c.block[3]);
  const st = { id, name: NAMES[id][0], verb: NAMES[id][1], block: [{ c: a.x, r: a.y, w: b.x - a.x, h: b.y - a.y }], spot: toTile(...c.spot), label: toTile(...c.label), court: c };
  if (id.startsWith('an')) Object.assign(st, { kind: 'case', slot: Number(id[2]) });
  return st;
});

// Sảnh nghề ngoài thế giới (docs/GAME-NOI-DUNG-THEO-APP.md) — world: toạ độ mét (khớp terrain.js › CLEARINGS)
export const HALLS = [
  { id: 'trach', region: 'lichduong', name: 'Sảnh Trạch Nhật', verb: 'Chọn ngày cho khách', world: { x: 735, z: -36 } },
  { id: 'duongtrach', region: 'phongthuy', name: 'Sảnh Dương Trạch', verb: 'Xem nhà cho khách', world: { x: -806, z: 62 } },
  { id: 'dieuhau', region: 'cungthong', name: 'Sảnh Điều Hậu', verb: 'Xem khí hậu lá số', world: { x: 480, z: 420 } },
  { id: 'thuvien', region: 'thulau', name: 'Thư Lâu', verb: 'Đọc tầng thư hôm nay', world: { x: 0, z: -630 } },
  { id: 'hophon', region: 'thanh', name: 'Bàn Hợp Hôn', verb: 'Xem hợp hôn (án chung)', world: { x: -48, z: 8 } },
  { id: 'tuvi', region: 'trichthien', name: 'Sảnh Tử Vi', verb: 'An sao Tử Vi', world: { x: -567, z: 503 } },
  { id: 'tuongphap', region: 'manh', name: 'Sảnh Tượng Pháp', verb: 'Đọc tượng Manh phái', world: { x: 654, z: -441 } },
  { id: 'cachcuc', region: 'tubinh', name: 'Sảnh Cách Cục', verb: 'Định cách cục', world: { x: -521, z: -538 } },
];
for (const h of HALLS) {
  const t = toTile(h.world.x, h.world.z);
  ALL_STATIONS.push({ ...h, kind: 'desk', block: [], spot: { x: t.x, y: t.y + 1.6 }, label: t });
}

// ---------------------------------------------------------------------------
// Nhãn địa danh thế giới mở — cùng khuôn với HALLS: name + world (toạ độ mét).
// landmarks.js đặt mô hình + biển tên đúng theo toạ độ này (một nguồn duy nhất,
// không lệch nhau). Thuần nhãn, KHÔNG đẩy vào ALL_STATIONS: trạm bấm-được phải
// liệt kê trong features.js › ALL (hasStation) — đẩy trạm lạ vào chỉ tạo trạm
// ảo mở bảng lỗi. Người chơi biết chỗ qua biển tên 3D tại điểm này.
// ---------------------------------------------------------------------------
export const PLACES = [
  { id: 'amvancoc', name: 'Am Vân Cốc', world: { x: -56, z: -163 } }, // sườn Hậu Sơn, cạnh quần thể điện (0,-116)
  { id: 'laotung', name: 'Lão Tùng', world: { x: 6, z: 72 } }, // gác cổng Sơn Môn (0, z1+1.2 › court.js › COURT) — trong tầm bark 16 m của render3d › GATE_SM
];

// ---------------------------------------------------------------------------
// ĐIỆN VÀO ĐƯỢC (docs/GAME-V2-THIET-KE.md §S4–S5): không gian trong điện đặt ở rìa Đông ngoài bản đồ
// (trên biển mây — ra khỏi sàn là chạm nước). Cửa ngoài thế giới «door», lối ra trong điện «exit».
// Toạ độ mét; tâm điện = origin, lối vào ở phía +z, bàn thờ phía −z.
// ---------------------------------------------------------------------------
export const ROOMS = [
  { id: 'chinhdien', name: 'Chính Điện Tam Thanh', region: 'thanh', door: { x: 0, z: -84 }, origin: { x: 1500, z: 0 }, w: 34, d: 28, h: 14,
    deities: [['deity_lingbao', -6.5], ['deity_yuanshi', 0], ['deity_daode', 6.5]], npc: 'que' },
  { id: 'vanxuong', name: 'Văn Xương Các', region: 'thulau', door: { x: 0, z: -652 }, origin: { x: 1600, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_wenchang', 0]] },
  { id: 'daumau', name: 'Đẩu Mẫu Điện', region: 'trichthien', door: { x: -566, z: 566 }, origin: { x: 1700, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_doumu', 0]] },
  { id: 'laoquan', name: 'Lão Quân Điện', region: 'tubinh', door: { x: -564, z: -510 }, origin: { x: 1800, z: 0 }, w: 24, d: 20, h: 12, deities: [['deity_daode', 0]] },
  // Sơn Môn: cửa trước mặt hai điện phụ (sect.js) — Tây: hành lang đại vận; Đông: Thái Tuế (web, iOS tắt)
  { id: 'vanmenh', name: 'Vận Mệnh Các', region: 'thanh', door: { x: -38.6, z: -40 }, origin: { x: 1900, z: 0 }, w: 20, d: 72, h: 11, deities: [], kind: 'vanmenh' },
  // x=1850 nằm trong biên server (maxX 1210 ô = 1920 m — protocol.js bỏ gói mv vượt biên;
  // x=2000 cũ = 1260 ô, đi trong điện gửi mv bị vứt). Cách Lão Quân Điện (1800, mép 1812)
  // và Vận Mệnh Các (1900, mép 1890) để các điện không chồng hình lên nhau.
  { id: 'thaitue', name: 'Thái Tuế Điện', region: 'thanh', door: { x: 38.6, z: -40 }, origin: { x: 1850, z: 0 }, w: 28, d: 24, h: 13, deities: [], kind: 'thaitue' },
];
// Vận Mệnh Các: bia tổng quan ở lối vào + 9 cổng đại vận dọc lối giữa (vanmenh.js › VAN_GATES)
export const VAN_GATE_Z = (i) => 25 - i * 6; // toạ độ z cổng i so với tâm điện (cổng 9 ở −23, trước bàn lễ)
export const VAN_STELE = { x: -5.5, z: 29.5 };
export const roomAt = (x, z) => ROOMS.find((r) => Math.abs(x - r.origin.x) <= r.w / 2 + 1 && Math.abs(z - r.origin.z) <= r.d / 2 + 1) || null;
for (const r of ROOMS) {
  const inside = toTile(r.origin.x, r.origin.z + r.d / 2 - 3.2);
  const exitW = { x: r.origin.x, z: r.origin.z + r.d / 2 - 1.2 };
  const doorT = toTile(r.door.x, r.door.z);
  ALL_STATIONS.push({ id: `door_${r.id}`, kind: 'door', room: r.id, name: r.name, verb: `Vào ${r.name}`, block: [], world: r.door, spot: { x: doorT.x, y: doorT.y + 1.2 }, label: doorT, to: inside });
  ALL_STATIONS.push({ id: `exit_${r.id}`, kind: 'exit', room: r.id, name: 'Cửa điện', verb: 'Ra khỏi điện', block: [], world: exitW, spot: toTile(exitW.x, exitW.z), label: toTile(exitW.x, exitW.z), to: { x: doorT.x, y: doorT.y + 2.2 } });
  if (r.npc === 'que') { const q = { x: r.origin.x - r.w / 2 + 8.5, z: r.origin.z + 1 }; ALL_STATIONS.push({ id: 'que', kind: 'desk', room: r.id, name: 'Thầy Giải Quẻ', verb: 'Xin thầy gieo quẻ', block: [], world: q, spot: toTile(q.x + 1.4, q.z), label: toTile(q.x, q.z) }); }
  if (r.kind === 'vanmenh') {
    const b = { x: r.origin.x + VAN_STELE.x, z: r.origin.z + VAN_STELE.z };
    ALL_STATIONS.push({ id: 'vanbia', kind: 'van', room: r.id, name: 'Bia Vận Mệnh', verb: 'Đọc bia quỹ tích đời', block: [], world: b, spot: toTile(b.x + 1.6, b.z + 0.4), label: toTile(b.x, b.z) });
    for (let i = 0; i < 9; i++) {
      const gz = { x: r.origin.x, z: r.origin.z + VAN_GATE_Z(i) };
      ALL_STATIONS.push({ id: `van${i}`, kind: 'van', slot: i, room: r.id, name: `Cổng Đại Vận ${i + 1}`, verb: 'Bước vào thập kỷ này', block: [], world: gz, spot: toTile(gz.x, gz.z + 1.5), label: toTile(gz.x, gz.z) });
    }
  }
  if (r.kind === 'thaitue') {
    const q = { x: r.origin.x, z: r.origin.z - 2.2 };
    ALL_STATIONS.push({ id: 'thaitue', kind: 'van', room: r.id, name: 'Bàn Lễ Thái Tuế', verb: 'Xem Thái Tuế năm nay', block: [], world: q, spot: toTile(q.x, q.z), label: toTile(q.x, q.z - 4) });
  }
}

// Gian bật theo bản build (iOS tắt gian bói). Vật cản vẫn tính đủ mọi công trình.
export const STATIONS = ALL_STATIONS
  .filter((s) => hasStation(s.id))
  .map((s) => (s.id === 'huong' ? { ...s, name: TEXT.huong, verb: TEXT.huongVerb } : s));

export const START = toTile(START_M.x, START_M.z);

export function stationById(id) {
  return STATIONS.find((s) => s.id === id) || null;
}

// ---------------------------------------------------------------------------
// NPC-AI G2 · BARK TRẠM — KHÔNG còn map trạm→pool ở đây (audit F1 dọn helper
// chết: barkPoolOfStation/STATION_BARK_POOL từng trỏ 8/9 id pool không tồn tại
// và không có consumer nào gọi). Một đường duy nhất: pool bark nằm trong
// bark-pool.js, consumer (stations.js, render3d.js) gọi pickBark(poolId,
// dayKey) trực tiếp theo id pool — trạm câm khi pool thiếu (§05.3).
// ---------------------------------------------------------------------------

// Toạ độ ô ↔ mét thế giới
const U = 1.6;
export const tileToWorld = (x, y) => ({ x: (x - 10) * U, z: (y - 7) * U });
export const worldToTile = (X, Z) => ({ x: X / U + 10, y: Z / U + 7 });

// from (tuỳ chọn, toạ độ ô) để xét độ dốc khi đi trên địa hình.
export function blockedAt(x, y, from = null) {
  const w = tileToWorld(x, y);
  if (blockedByBuilding(w.x, w.z)) return true;
  if (platformTop(w.x, w.z) != null) return false; // trên nền bậc cấp: đi thoải mái
  const f = from ? tileToWorld(from.x, from.y) : null;
  return !walkable(w.x, w.z, f?.x, f?.z);
}

// đi thẳng được từ a tới b? (lấy mẫu mỗi 0,2 ô)
function clearLine(a, b) {
  const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / 0.2));
  let prev = a;
  for (let k = 1; k <= n; k++) {
    const p = { x: a.x + (b.x - a.x) * (k / n), y: a.y + (b.y - a.y) * (k / n) };
    if (blockedAt(p.x, p.y, prev)) return false;
    prev = p;
  }
  return true;
}

// điểm trống gần nhất quanh (x, y) — bấm vào công trình thì đi tới chân nó
function nearestFreePoint(x, y) {
  if (!blockedAt(x, y)) return { x, y };
  for (let r = 0.5; r <= 10; r += 0.5) for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2, p = { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r };
    if (!blockedAt(p.x, p.y)) return p;
  }
  return null;
}

const STEP = 0.5;      // ô A* = nửa ô (0,8 m)
const MAX_NODES = 60000;

/**
 * Đường đi từ from tới to (toạ độ ô) → danh sách điểm. Rỗng = không tới được.
 * A* 8 hướng (không cắt góc) trong khung bao hai điểm + lề 40 ô.
 */
export function findPath(from, to) {
  const goal = nearestFreePoint(to.x, to.y);
  if (!goal) return [];
  if (clearLine(from, goal)) return [{ x: goal.x, y: goal.y }];
  // đích rất xa (sảnh nghề ngoài thế giới): đi thẳng, gặp núi / nước thì dừng — đi xa dùng trạm đi nhanh
  if (Math.hypot(goal.x - from.x, goal.y - from.y) > 150) return [{ x: goal.x, y: goal.y }];
  const pad = 40;
  const x0 = Math.min(from.x, goal.x) - pad, y0 = Math.min(from.y, goal.y) - pad;
  const W = Math.ceil((Math.abs(goal.x - from.x) + 2 * pad) / STEP) + 1, H = Math.ceil((Math.abs(goal.y - from.y) + 2 * pad) / STEP) + 1;
  const px = (i) => x0 + i * STEP, py = (j) => y0 + j * STEP;
  const si = Math.round((from.x - x0) / STEP), sj = Math.round((from.y - y0) / STEP);
  const gi = Math.round((goal.x - x0) / STEP), gj = Math.round((goal.y - y0) / STEP);
  const N = W * H, g = new Float32Array(N).fill(Infinity), f = new Float32Array(N), came = new Int32Array(N).fill(-1);
  const state = new Uint8Array(N); // 0 chưa xét · 1 trống · 2 chặn · 3 đã đóng
  const free = (i, j) => {
    if (i < 0 || j < 0 || i >= W || j >= H) return false;
    const k = j * W + i;
    if (!state[k]) state[k] = blockedAt(px(i), py(j)) ? 2 : 1;
    return state[k] !== 2;
  };
  const heap = [];
  const push = (k) => { heap.push(k); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (f[heap[p]] <= f[heap[i]]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last; let i = 0;
      for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && f[heap[l]] < f[heap[m]]) m = l; if (r < heap.length && f[heap[r]] < f[heap[m]]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; }
    }
    return top;
  };
  const hOf = (i, j) => { const dx = Math.abs(i - gi), dy = Math.abs(j - gj); return Math.max(dx, dy) + 0.414 * Math.min(dx, dy); };
  const s0 = sj * W + si; g[s0] = 0; f[s0] = hOf(si, sj); push(s0);
  const dirs = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
  let found = -1, seen = 0;
  while (heap.length && seen < MAX_NODES) {
    const k = pop(); if (state[k] === 3) continue;
    state[k] = 3; seen++;
    const i = k % W, j = (k - i) / W;
    if (Math.abs(i - gi) <= 1 && Math.abs(j - gj) <= 1) { found = k; break; }
    for (const [di, dj, c] of dirs) {
      const ni = i + di, nj = j + dj;
      if (!free(ni, nj)) continue;
      if (di && dj && (!free(i + di, j) || !free(i, j + dj))) continue;
      const nk = nj * W + ni; if (state[nk] === 3) continue;
      const ng = g[k] + c;
      if (ng < g[nk]) { g[nk] = ng; came[nk] = k; f[nk] = ng + hOf(ni, nj); push(nk); }
    }
  }
  if (found < 0) return [];
  const pts = [];
  for (let k = found; k >= 0 && k !== s0; k = came[k]) { const i = k % W; pts.unshift({ x: px(i), y: py((k - i) / W) }); }
  pts.push({ x: goal.x, y: goal.y });
  // rút gọn: từ mỗi điểm nhảy tới điểm xa nhất còn nhìn thẳng thấy
  const out = []; let cur = from, idx = 0;
  while (idx < pts.length) {
    let best = idx;
    for (let k = pts.length - 1; k > idx; k--) if (clearLine(cur, pts[k])) { best = k; break; }
    out.push(pts[best]); cur = pts[best]; idx = best + 1;
  }
  return out;
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
