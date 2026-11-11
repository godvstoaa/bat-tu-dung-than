// ============================================================================
//  THỦY HỆ HUYỀN GIỚI v4 (thuần, tất định — terrain.js khắc lòng sông, water.js lấy dòng chảy, water3d vẽ,
//  citylayout.js tránh nhà / dựng cầu, test). Không import terrain.js (terrain.js import file này).
//
//  Thế giới v4 (8.192 m, Bát Quái Thành tường trung đoạn 2.125 m):
//  · SÔNG HUYỀN HÀ (kênh 'main'): vào thế giới từ rìa Tây, qua THỦY MÔN Khôn vào thành, chảy theo vòng bát giác
//    trung đoạn ~1.360 m (giữa vành 1.050 và 1.500) qua ba khu phía Nam Ngoại Thành (Khôn → Ly / Nam Môn cảng → Tốn),
//    xuyên hồ CÙNG THÔNG (khu Tốn, trong thành), ra THỦY MÔN Tốn rồi chảy về rìa Đông.
//    Trong thành: rộng 120 m, KÈ ĐÁ THẲNG ĐỨNG (mặt thành y 0, mặt nước −6), sát kè vẫn sâu ≥ 2,5 m cho thuyền cập.
//    Ngoài thành: rộng ~150 m, bãi bồi + bờ dốc tự nhiên như bản cũ.
//  · NAM KHÊ (kênh 'namkhe'): nhánh nhỏ rộng 44 m từ rìa Nam, qua THỦY MÔN Ly vào thành, đổ vào Huyền Hà ở Nam Môn.
//  Vì đi theo vòng bát giác nên sông cắt vuông góc 3 đại lộ Khôn / Ly / Tốn (chỗ dựng 3 cầu lớn, citylayout.js).
//
//  Khung cục bộ cung (batquai.js): u theo trục cung (tâm → cổng), v ngang.
// ============================================================================
import { GUA, toWorld } from './batquai.js';

export const WATER_LEVEL = -6;            // mực sông / hồ (= terrain.WATER)
export const CITY_WALL_A = 2125;          // trung đoạn tường Ngoại Thành v4 (= terrain.CITY_OCT = citylayout.CITY.A)
export const CITY_FLAT_A = CITY_WALL_A + 40; // mặt thành phẳng y 0 tới đây; bên trong: sông / hồ bờ kè thẳng đứng
export const RIVER_ARC_U = 1360;          // sông chảy theo vòng bát giác trung đoạn này trong thành
// (giữa vành 1.050 và 1.500; mặt nước u 1.300–1.420 → sảnh Tử Vi u 1.210 / cửa Đẩu Mẫu Điện u 1.281 của thành cũ
//  — world.js — vẫn trên đất khô tới khi giai đoạn 2 dời về khu mới)
export const LAKE_U = 1300;
export const QUAY_W = 10;                 // lối đi trên kè (giữa mép nước và dãy nhà)

const OCT_DIRS = Array.from({ length: 8 }, (_, k) => [Math.cos(Math.PI / 2 + k * Math.PI / 4), Math.sin(Math.PI / 2 + k * Math.PI / 4)]);
/** trung đoạn bát giác qua điểm (x, z) — = u trong cung chứa điểm */
export const octMax = (x, z) => { let m = -Infinity; for (const [dx, dz] of OCT_DIRS) { const d = x * dx + z * dz; if (d > m) m = d; } return m; };
const G = (id) => GUA.find((g) => g.id === id);
const W = (gid, u, v) => { const p = toWorld(G(gid), u, v); return [Math.round(p.x * 10) / 10, Math.round(p.z * 10) / 10]; };

// HỒ CÙNG THÔNG — trong thành, khu Tốn (u 1.300, lệch về phía Chấn để đại lộ Tốn đi ngoài bờ). Bờ kè thẳng đứng.
const LK = W('xun', LAKE_U, -270);
export const LAKE = { id: 'cungthong', name: 'Cùng Thông Hồ', x: LK[0], z: LK[1], r: 165, bedEdge: WATER_LEVEL - 3, bedMid: WATER_LEVEL - 8 };
/** đáy hồ tại (x, z) nếu trong lòng hồ, ngược lại null */
export function lakeBed(x, z) {
  const d = Math.hypot(x - LAKE.x, z - LAKE.z);
  if (d > LAKE.r) return null;
  const k = 1 - (d / LAKE.r) ** 2;
  return LAKE.bedEdge + (LAKE.bedMid - LAKE.bedEdge) * k;
}

// --- kênh: điểm điều khiển tim sông (spline Catmull-Rom đi qua) — thượng nguồn → hạ nguồn
const A = RIVER_ARC_U;
export const CHANNEL_DEFS = [
  {
    id: 'main', name: 'Huyền Hà', wIn: 60, wOut: 75, deep: 10, flow: 1.3, flowEdge: 0.3,
    ctrl: [
      [-4300, 1350], [-3600, 1420], [-2900, 1400], [-2350, 1330],
      W('kun', CITY_WALL_A, 420), W('kun', 1750, 360), W('kun', 1500, 300), W('kun', A, 150), W('kun', A, 0), W('kun', A, -264),
      W('li', A, 528), W('li', A, 264), W('li', A, 0), W('li', A, -264), W('li', A, -528),
      W('xun', A, 264), W('xun', A, 0), W('xun', A - 10, -110), [LAKE.x, LAKE.z], W('xun', 1480, -320), W('xun', 1750, -330),
      W('xun', CITY_WALL_A, -330), W('xun', 2400, -330), [2500, 1600], [3200, 1750], [3900, 1820], [4400, 1850],
    ],
  },
  {
    id: 'namkhe', name: 'Nam Khê', wIn: 22, wOut: 30, deep: 5, flow: 0.9, flowEdge: 0.25,
    ctrl: [W('li', 4300, -420), W('li', 3600, -420), W('li', 2900, -440), W('li', CITY_WALL_A, -420), W('li', 1700, -420), W('li', 1400, -420), W('li', A + 10, -420)],
  },
];
// tên cũ: điểm điều khiển sông chính (terrain.RIVER)
export const RIVER_CTRL = CHANNEL_DEFS[0].ctrl;
export const RIVER = { halfW: 75, halfWIn: 60, bank: 22, deep: 10, flow: 1.3, flowEdge: 0.3 };

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map((i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// dải điểm tim kênh (cách ~6 m): x, z, s (chiều dài tích luỹ), tx, tz (tiếp tuyến), w (nửa bề rộng), k (độ cong có dấu),
// city (0 = trong thành bờ kè … 1 = ngoài thành bờ tự nhiên), deep, ch (id kênh)
function buildChannel(def) {
  const C = def.ctrl, raw = [];
  for (let i = 0; i < C.length - 1; i++) {
    const p0 = C[Math.max(0, i - 1)], p1 = C[i], p2 = C[i + 1], p3 = C[Math.min(C.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 6));
    for (let j = 0; j < n; j++) raw.push(catmull(p0, p1, p2, p3, j / n));
  }
  raw.push(C[C.length - 1]);
  const out = []; let s = 0;
  for (let i = 0; i < raw.length; i++) {
    const a = raw[Math.max(0, i - 1)], b = raw[Math.min(raw.length - 1, i + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    if (i) s += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
    out.push({ x: raw[i][0], z: raw[i][1], s, tx, tz, w: def.wOut, k: 0, ch: def.id, deep: def.deep, out: 1 });
  }
  for (let i = 1; i < out.length - 1; i++) {
    const a = out[i - 1], c = out[i + 1];
    const cross = a.tx * c.tz - a.tz * c.tx, ds = (c.s - a.s) || 1;
    out[i].k = Math.asin(Math.max(-1, Math.min(1, cross))) / ds;
  }
  const K = out.map((p) => p.k);
  for (let it = 0; it < 6; it++) for (let i = 2; i < out.length - 2; i++) out[i].k = (K[i - 2] + K[i - 1] * 2 + K[i] * 3 + K[i + 1] * 2 + K[i + 2]) / 9;
  for (const p of out) {
    p.out = sst(CITY_WALL_A - 60, CITY_WALL_A + 200, octMax(p.x, p.z)); // 0 trong thành → 1 ngoài thành
    const wOut = def.wOut + (def.id === 'main' ? 6 * Math.sin(p.s / 230) + Math.min(16, Math.abs(p.k) * 9000) : 0);
    p.w = def.wIn + (wOut - def.wIn) * p.out;
  }
  return out;
}
const CH = CHANNEL_DEFS.map((d) => ({ def: d, pts: buildChannel(d) }));
/** điểm tim sông chính (tên cũ — boats, water3d, bản đồ) */
export const riverPoints = () => CH[0].pts;
export const RIVER_LEN = CH[0].pts[CH[0].pts.length - 1].s;
/** mọi kênh: [{ id, name, wIn, wOut, deep, pts }] */
export const channels = () => CH.map((c) => ({ ...c.def, pts: c.pts }));
export const channelPoints = (id) => (CH.find((c) => c.def.id === id) || CH[0]).pts;

// --- lưới tra nhanh: ô 48 m → các đoạn (mọi kênh) có thể ảnh hưởng (trong nửa bề rộng + bờ)
const CELL = 48, REACH = RIVER.halfW + 16 + RIVER.bank + 8;
const SEG = []; // [kênh, chỉ số điểm đầu đoạn]
for (let c = 0; c < CH.length; c++) for (let i = 0; i < CH[c].pts.length - 1; i++) SEG.push([c, i]);
const BOX = (() => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const ch of CH) for (const p of ch.pts) { a = Math.min(a, p.x); b = Math.min(b, p.z); c = Math.max(c, p.x); d = Math.max(d, p.z); } return [a - REACH, b - REACH, c + REACH, d + REACH]; })();
const GW = Math.ceil((BOX[2] - BOX[0]) / CELL), GH = Math.ceil((BOX[3] - BOX[1]) / CELL);
const GRID = (() => {
  const g = new Map();
  for (let si = 0; si < SEG.length; si++) {
    const P = CH[SEG[si][0]].pts, a = P[SEG[si][1]], b = P[SEG[si][1] + 1];
    const i0 = Math.max(0, Math.floor((Math.min(a.x, b.x) - REACH - BOX[0]) / CELL)), i1 = Math.min(GW - 1, Math.floor((Math.max(a.x, b.x) + REACH - BOX[0]) / CELL));
    const j0 = Math.max(0, Math.floor((Math.min(a.z, b.z) - REACH - BOX[1]) / CELL)), j1 = Math.min(GH - 1, Math.floor((Math.max(a.z, b.z) + REACH - BOX[1]) / CELL));
    for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) { const k = j * GW + ii; let l = g.get(k); if (!l) g.set(k, (l = [])); l.push(si); }
  }
  return g;
})();

/**
 * Vị trí so với sông gần nhất (mọi kênh): null nếu xa; { o (lệch ngang có dấu, + = bên phải xuôi dòng), d, s, tx, tz,
 * w (nửa bề rộng mặt nước), k, ch (id kênh), deep, quay (true = trong thành, bờ kè thẳng đứng) }
 */
export function riverNear(x, z) {
  if (x < BOX[0] || x > BOX[2] || z < BOX[1] || z > BOX[3]) return null;
  const gi = Math.min(GW - 1, Math.floor((x - BOX[0]) / CELL)), gj = Math.min(GH - 1, Math.floor((z - BOX[1]) / CELL));
  const list = GRID.get(gj * GW + gi);
  if (!list) return null;
  let best = null, bd = Infinity;
  for (const si of list) {
    const P = CH[SEG[si][0]].pts, i = SEG[si][1], a = P[i], b = P[i + 1], vx = b.x - a.x, vz = b.z - a.z, ll = vx * vx + vz * vz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (z - a.z) * vz) / ll));
    const px = a.x + vx * t, pz = a.z + vz * t, d = Math.hypot(x - px, z - pz);
    const wa = a.w + (b.w - a.w) * t;
    if (d - wa < bd) { bd = d - wa; best = { P, i, t, px, pz, d }; } // gần MÉP nước nhất (kênh nhỏ đổ vào sông lớn)
  }
  if (!best || bd > REACH - RIVER.halfW) return null;
  const { P, i, t } = best, a = P[i], b = P[i + 1];
  let tx = a.tx + (b.tx - a.tx) * t, tz = a.tz + (b.tz - a.tz) * t; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
  const o = (x - best.px) * -tz + (z - best.pz) * tx; // pháp tuyến phải = (−tz, tx)
  return { o, d: best.d, s: a.s + (b.s - a.s) * t, tx, tz, w: a.w + (b.w - a.w) * t, k: a.k + (b.k - a.k) * t, ch: a.ch, deep: a.deep, quay: octMax(x, z) < CITY_FLAT_A };
}

/** lệch chuẩn hoá có tính lạch dồn về bờ lõm ở khúc quanh: n' (0 = tim lạch, ±1 = mép nước) */
function laneN(r) {
  const shift = r.quay ? 0 : Math.max(-0.28, Math.min(0.28, -r.k * 2600)); // k > 0 rẽ trái → bờ lõm bên phải (+o)
  return (r.o / r.w) - shift;
}
/** độ sâu nước theo mặt cắt (m, ≥ 0) — sông chính: lạch giữa sâu 8–10 m, bãi bồi 0,5–3 m; trong thành sát kè ≥ 2,5 m */
export function riverDepth(r) {
  const n = Math.abs(laneN(r)), ao = Math.abs(r.o / r.w), sc = (r.deep || RIVER.deep) / RIVER.deep;
  if (ao > 1) return 0;
  const lane = (n <= 0.55 ? RIVER.deep - 2 * (n / 0.55) ** 2 : n <= 0.82 ? 8 - 5.5 * sst(0.55, 0.82, n) : 2.5 - 2.2 * sst(0.82, 1.15, n)) * sc;
  if (r.quay) return Math.max(2.5 * Math.min(1, sc * 1.6), lane);
  return Math.max(0.3, Math.min(lane, 0.3 + (1 - ao) * 40)); // sát mép luôn nông dần về 0,3
}
/** khắc lòng sông vào độ cao h tại (x, z) — trong thành: kè đứng (ngoài mép nước giữ nguyên h) */
export function riverCarve(x, z, h) {
  const r = riverNear(x, z); if (!r) return h;
  const beyond = Math.abs(r.o) - r.w;
  if (beyond <= 0) return Math.min(h, WATER_LEVEL - riverDepth(r));
  if (r.quay || beyond >= RIVER.bank) return h;
  // bờ tự nhiên: từ mép nước (mực −0,3) lên tới đất tự nhiên trong RIVER.bank m — không bao giờ đắp cao hơn đất
  const edge = WATER_LEVEL - 0.3, tt = sst(0, RIVER.bank, beyond);
  return Math.min(h, edge + (Math.max(h, edge) - edge) * tt);
}
/** dòng chảy mặt (m/s, hướng xuôi dòng) tại điểm trên sông, null nếu không ở trong lòng sông */
export function riverFlow(x, z) {
  const r = riverNear(x, z); if (!r || Math.abs(r.o) > r.w) return null;
  const def = CHANNEL_DEFS.find((d) => d.id === r.ch) || CHANNEL_DEFS[0];
  const n = Math.min(1, Math.abs(laneN(r)));
  const v = def.flowEdge + (def.flow - def.flowEdge) * Math.max(0, 1 - n * n) * (1 + Math.min(0.25, Math.abs(r.k) * 1500));
  return { x: r.tx * v, z: r.tz * v, speed: v };
}
/** có nước (sông / hồ) tại (x, z)? pad > 0 nới ra (vd. tránh xây nhà sát kè) */
export function isWater(x, z, pad = 0) {
  if (Math.hypot(x - LAKE.x, z - LAKE.z) <= LAKE.r + pad) return true;
  const r = riverNear(x, z);
  return !!r && Math.abs(r.o) <= r.w + pad;
}
/** thủy môn: chỗ mỗi kênh băng qua tường thành (u = CITY_WALL_A) — [{ id, ch, x, z, tx, tz, w }] */
export function waterGates() {
  const out = [];
  for (const c of CH) {
    const P = c.pts;
    for (let i = 0; i < P.length - 1; i++) {
      const a = octMax(P[i].x, P[i].z) - CITY_WALL_A, b = octMax(P[i + 1].x, P[i + 1].z) - CITY_WALL_A;
      if ((a <= 0) !== (b <= 0)) {
        const t = a / (a - b), p = P[i], q = P[i + 1];
        out.push({ id: `thuymon-${c.def.id}-${out.filter((g) => g.ch === c.def.id).length}`, ch: c.def.id, x: p.x + (q.x - p.x) * t, z: p.z + (q.z - p.z) * t, tx: p.tx, tz: p.tz, w: p.w + (q.w - p.w) * t, inflow: a > 0 });
      }
    }
  }
  return out;
}
