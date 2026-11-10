// ============================================================================
//  SÔNG HUYỀN HÀ (thuần, tất định — terrain.js khắc lòng sông, water.js lấy dòng chảy, water3d vẽ, test).
//  Sông lớn chạy thuyền buồm: mặt nước ~150 m (140–180, khúc quanh rộng hơn), lạch giữa sâu 8–11 m, bãi bồi
//  nông hai bên, bờ dốc ~22 m lên đất. Vào thế giới từ rìa Tây (thượng nguồn ngoài bản đồ), lượn qua chân núi
//  Trích Thiên, vòng phía Nam Ngoại Thành (mép nước cách tường ≥ 90 m), đổ vào hồ Cùng Thông.
//  Toạ độ mét thế giới mới (đã ×1,6). Không import terrain.js (terrain.js import file này).
// ============================================================================

export const WATER_LEVEL = -6;            // mực sông / hồ (= terrain.WATER)
// điểm điều khiển tim sông (spline Catmull-Rom đi qua) — thượng nguồn → hạ nguồn
export const RIVER_CTRL = [
  [-1560, 500], [-1300, 560], [-1040, 600], [-800, 650], [-580, 750], [-360, 850],
  [-80, 905], [220, 912], [480, 900], [660, 900], [800, 905],
];
export const RIVER = { halfW: 75, bank: 22, deep: 10, flow: 1.3, flowEdge: 0.3 };

// --- dải điểm tim sông (cách ~6 m): x, z, s (chiều dài tích luỹ), tx, tz (tiếp tuyến), w (nửa bề rộng), k (độ cong có dấu)
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map((i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
const PTS = (() => {
  const C = RIVER_CTRL, raw = [];
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
    out.push({ x: raw[i][0], z: raw[i][1], s, tx, tz, w: RIVER.halfW, k: 0 });
  }
  // độ cong (đổi hướng / quãng) làm trơn → khúc quanh rộng thêm, lạch dồn về bờ lõm
  for (let i = 1; i < out.length - 1; i++) {
    const a = out[i - 1], c = out[i + 1];
    const cross = a.tx * c.tz - a.tz * c.tx, ds = (c.s - a.s) || 1;
    out[i].k = Math.asin(Math.max(-1, Math.min(1, cross))) / ds;
  }
  const K = out.map((p) => p.k);
  for (let it = 0; it < 6; it++) for (let i = 2; i < out.length - 2; i++) out[i].k = (K[i - 2] + K[i - 1] * 2 + K[i] * 3 + K[i + 1] * 2 + K[i + 2]) / 9;
  for (const p of out) p.w = RIVER.halfW + 6 * Math.sin(p.s / 230) + Math.min(16, Math.abs(p.k) * 9000);
  return out;
})();
export const riverPoints = () => PTS;
export const RIVER_LEN = PTS[PTS.length - 1].s;

// --- lưới tra nhanh: ô 48 m → các đoạn có thể ảnh hưởng (trong nửa bề rộng + bờ)
const CELL = 48, REACH = RIVER.halfW + 16 + RIVER.bank + 8;
const BOX = (() => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const p of PTS) { a = Math.min(a, p.x); b = Math.min(b, p.z); c = Math.max(c, p.x); d = Math.max(d, p.z); } return [a - REACH, b - REACH, c + REACH, d + REACH]; })();
const GW = Math.ceil((BOX[2] - BOX[0]) / CELL), GH = Math.ceil((BOX[3] - BOX[1]) / CELL);
const GRID = (() => {
  const g = Array.from({ length: GW * GH }, () => []);
  for (let i = 0; i < PTS.length - 1; i++) {
    const a = PTS[i], b = PTS[i + 1];
    const i0 = Math.max(0, Math.floor((Math.min(a.x, b.x) - REACH - BOX[0]) / CELL)), i1 = Math.min(GW - 1, Math.floor((Math.max(a.x, b.x) + REACH - BOX[0]) / CELL));
    const j0 = Math.max(0, Math.floor((Math.min(a.z, b.z) - REACH - BOX[1]) / CELL)), j1 = Math.min(GH - 1, Math.floor((Math.max(a.z, b.z) + REACH - BOX[1]) / CELL));
    for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) g[j * GW + ii].push(i);
  }
  return g;
})();

/**
 * Vị trí so với sông: null nếu xa; { o (lệch ngang có dấu, + = bên phải xuôi dòng), s, tx, tz, w, k }
 */
export function riverNear(x, z) {
  if (x < BOX[0] || x > BOX[2] || z < BOX[1] || z > BOX[3]) return null;
  const gi = Math.min(GW - 1, Math.floor((x - BOX[0]) / CELL)), gj = Math.min(GH - 1, Math.floor((z - BOX[1]) / CELL));
  const list = GRID[gj * GW + gi];
  if (!list || !list.length) return null;
  let best = null, bd = Infinity;
  for (const i of list) {
    const a = PTS[i], b = PTS[i + 1], vx = b.x - a.x, vz = b.z - a.z, ll = vx * vx + vz * vz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (z - a.z) * vz) / ll));
    const px = a.x + vx * t, pz = a.z + vz * t, d = Math.hypot(x - px, z - pz);
    if (d < bd) { bd = d; best = { i, t, px, pz }; }
  }
  if (!best || bd > REACH) return null;
  const a = PTS[best.i], b = PTS[best.i + 1], t = best.t;
  let tx = a.tx + (b.tx - a.tx) * t, tz = a.tz + (b.tz - a.tz) * t; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
  const o = (x - best.px) * -tz + (z - best.pz) * tx; // pháp tuyến phải = (−tz, tx)
  return { o, d: bd, s: a.s + (b.s - a.s) * t, tx, tz, w: a.w + (b.w - a.w) * t, k: a.k + (b.k - a.k) * t };
}

const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** lệch chuẩn hoá có tính lạch dồn về bờ lõm ở khúc quanh: n' (0 = tim lạch, ±1 = mép nước) */
function laneN(r) {
  const shift = Math.max(-0.28, Math.min(0.28, -r.k * 2600)); // k > 0 rẽ trái → bờ lõm bên phải (+o)
  return (r.o / r.w) - shift;
}
/** độ sâu nước theo mặt cắt (m, ≥ 0) — lạch giữa sâu 8–10 m, bãi bồi 0,5–3 m, mép 0,3 m */
export function riverDepth(r) {
  const n = Math.abs(laneN(r)), ao = Math.abs(r.o / r.w);
  if (ao > 1) return 0;
  const lane = n <= 0.55 ? RIVER.deep - 2 * (n / 0.55) ** 2 : n <= 0.82 ? 8 - 5.5 * sst(0.55, 0.82, n) : 2.5 - 2.2 * sst(0.82, 1.15, n);
  return Math.max(0.3, Math.min(lane, 0.3 + (1 - ao) * 40)); // sát mép luôn nông dần về 0,3
}
/** khắc lòng sông vào độ cao tự nhiên h tại (x, z) */
export function riverCarve(x, z, h) {
  const r = riverNear(x, z); if (!r) return h;
  const beyond = Math.abs(r.o) - r.w;
  if (beyond <= 0) return Math.min(h, WATER_LEVEL - riverDepth(r));
  if (beyond >= RIVER.bank) return h;
  // bờ: từ mép nước (mực −0,3) lên tới đất tự nhiên trong RIVER.bank m — không bao giờ đắp cao hơn đất
  const edge = WATER_LEVEL - 0.3, tt = sst(0, RIVER.bank, beyond);
  return Math.min(h, edge + (Math.max(h, edge) - edge) * tt);
}
/** dòng chảy mặt (m/s, hướng xuôi dòng) tại điểm trên sông, null nếu không ở trong lòng sông */
export function riverFlow(x, z) {
  const r = riverNear(x, z); if (!r || Math.abs(r.o) > r.w) return null;
  const n = Math.min(1, Math.abs(laneN(r)));
  const v = RIVER.flowEdge + (RIVER.flow - RIVER.flowEdge) * Math.max(0, 1 - n * n) * (1 + Math.min(0.25, Math.abs(r.k) * 1500));
  return { x: r.tx * v, z: r.tz * v, speed: v };
}
