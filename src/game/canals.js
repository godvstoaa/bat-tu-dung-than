// ============================================================================
//  THỦY ĐẠO BÁT MÔN (thuần JS, nhẹ — terrain.js, cityblocks.js, river3d.js, water.js, test dùng chung).
//  Quy hoạch thủy theo Kỳ Môn Độn Giáp: nước NẠP ở HƯU MÔN (cửa Bắc, cung Khảm — Thủy, cát môn) → chảy dọc đại lộ
//  Khảm vào HỘ THÀNH HÀ (hào nước bát giác ôm tường Nội Thành, tụ khí quanh Trung Cung) → vòng qua Sinh Môn (Cấn),
//  Thương Môn (Chấn) → THỦY KHẨU ở ĐỖ MÔN (Tốn, Đông Nam — giữ tài) → theo đại lộ Tốn qua thủy môn Ngoại Thành
//  → kênh dẫn xuống sông Huyền Hà (waterways.js).
//  2026-11-10 làm lại cho THUYỀN LỚN vào thành: hào 25,5 m (u 162,5–188 — chỉ nới ra ngoài được: trong là tường
//  Nội Thành 160,5, tháp góc, cổng), kênh đại lộ 22 m NẰM GIỮA đại lộ (v −11…+11, đường hai bên v ±11…±19), sâu 3,5 m.
//  Mặt nước −0,8, đáy −4,3; cầu vòm lưng gù tĩnh không ≥ 5,5 m (river3d.js).
// ============================================================================
import { GUA } from './batquai.js';

export const MOAT = { a: 175.25, w: 25.5 };                            // hào Nội Thành (trung đoạn, bề rộng) → u 162,5–188
export const MOAT_LANE = 180.7;                                        // lạch thuyền trong hào: nửa ngoài (chân trong cầu hào là mặt cổng Nội Thành → vòm cầu nằm ở nửa ngoài)
export const AVE_CANAL = { gua: ['kan', 'xun'], v0: -11, v1: 11, u0: MOAT.a, u1: 640 }; // kênh dọc đại lộ: nạp (Khảm) · khẩu (Tốn)
export const OUTLET = { gua: 'xun', u0: 640, u1: 694 };                // Tốn: kênh xuyên thủy môn Ngoại Thành (672) ra ngoài
export const CANAL_BED = -4.3, CANAL_WATER = -0.8;
export const CANAL_CLEAR = 5.5;                                        // tĩnh không tối thiểu dưới cầu trong thành (m trên mặt nước)
export const AVE_HALF_CANAL = 19;                                     // nửa bề rộng đại lộ có kênh (kênh 11 + đường 8)
const OCT = GUA.map((g) => g.dir);
const octU = (x, z) => { let m = -Infinity; for (const [dx, dz] of OCT) m = Math.max(m, x * dx + z * dz); return m; };
const CANAL_G = AVE_CANAL.gua.map((id) => GUA.find((g) => g.id === id));
const OUT_G = GUA.find((g) => g.id === OUTLET.gua);

/** điểm (x, z) thế giới có nằm trong lòng kênh / hào trong thành không (pad: nới ra hai bờ) */
export function inCanal(x, z, pad = 0) {
  const o = octU(x, z);
  if (o > MOAT.a - MOAT.w / 2 - pad && o < MOAT.a + MOAT.w / 2 + pad) return true;
  for (const g of CANAL_G) {
    const [dx, dz] = g.dir, u = dx * x + dz * z, v = -dz * x + dx * z;
    const u1 = g === OUT_G ? OUTLET.u1 : AVE_CANAL.u1;
    if (u > AVE_CANAL.u0 - pad && u < u1 + pad && v > AVE_CANAL.v0 - pad && v < AVE_CANAL.v1 + pad) return true;
  }
  return false;
}
/** nửa bề rộng đại lộ phía bên s của cung g trong lưới phố (đại lộ Khảm / Tốn có kênh giữa: 19 m mỗi bên) */
export const aveHalf = (gid, s, base = 7) => (AVE_CANAL.gua.includes(gid) ? AVE_HALF_CANAL : base);
const Wg = (g, u, v) => ({ x: g.dir[0] * u - g.dir[1] * v, z: g.dir[1] * u + g.dir[0] * v });
/** tuyến dòng chảy tâm kênh: [{ x, z }] — Hưu Môn → đại lộ Khảm → hào (Đông) → đại lộ Tốn → Đỗ Môn → thủy môn */
export function flowPath() {
  const [kan, xun] = CANAL_G, mid = 0;
  const pts = [];
  for (let u = AVE_CANAL.u1 - 6; u >= MOAT_LANE + 4; u -= 12) pts.push(Wg(kan, u, mid));
  // hào: từ cung Khảm theo chiều kim đồng hồ (nhìn từ trên: Bắc → Đông Bắc → Đông → Đông Nam)
  const a0 = Math.atan2(Wg(kan, MOAT_LANE, mid).z, Wg(kan, MOAT_LANE, mid).x), a1 = Math.atan2(Wg(xun, MOAT_LANE, mid).z, Wg(xun, MOAT_LANE, mid).x);
  const steps = 48;
  for (let i = 1; i < steps; i++) {
    const ang = a0 + ((a1 - a0 + Math.PI * 4) % (Math.PI * 2)) * (i / steps);
    const dx = Math.cos(ang), dz = Math.sin(ang), k = MOAT_LANE / octU(dx, dz);
    pts.push({ x: dx * k, z: dz * k });
  }
  for (let u = MOAT_LANE + 4; u <= OUTLET.u1 - 2; u += 12) pts.push(Wg(xun, u, mid));
  return pts;
}
/** vòng hào khép kín (thuyền NPC chạy vòng): [{ x, z }] */
export function moatLoop(n = 96) {
  const pts = [];
  for (let i = 0; i < n; i++) { const ang = (i / n) * Math.PI * 2, dx = Math.cos(ang), dz = Math.sin(ang), k = MOAT_LANE / octU(dx, dz); pts.push({ x: dx * k, z: dz * k }); }
  return pts;
}

// ---------------------------------------------------------------------------
// NỐI RA NGOÀI THÀNH — mỗi tuyến [x, z, mực nước], hw = nửa bề rộng mặt nước, depth = sâu dưới mực, bank = bờ thoải:
//  · NẠP (EXT_IN): suối núi từ khe Bắc (Thư Lâu Lâm) đổ xuống men chân tường Bắc vào Hưu Môn — mực nước bám địa
//    hình (thác ghềnh chỗ dốc). Suối nhỏ, thuyền không vào.
//  · KHẨU (LINK): kênh 22 m từ thủy môn Đỗ Môn (u 694) xuôi về sông Huyền Hà — mực nước hạ dần −0,8 → −6 (mực sông),
//    dòng chảy mạnh hơn kênh trong thành; thuyền không buồm đi được hai chiều.
// ---------------------------------------------------------------------------
export const EXT_IN = [[0, -692, -0.8], [16, -692, -0.8], [40, -692, -0.8], [64, -692, -0.8], [88, -692, -0.8], [112, -692, -0.8], [136, -692, -0.8], [160, -692, -0.8], [184, -716, 0.6], [184, -740, 7.9], [184, -764, 16.7], [184, -788, 24.3], [184, -812, 30.6], [184, -836, 42], [184, -860, 56.4], [184, -884, 69.4], [160, -908, 91.6]];
const LINK_XZ = [[491, 491], [506, 520], [520, 560], [531, 610], [538, 665], [542, 720], [545, 775], [546, 835]];
export const LINK = (() => {
  let L = 0; const d = [0];
  for (let i = 1; i < LINK_XZ.length; i++) { L += Math.hypot(LINK_XZ[i][0] - LINK_XZ[i - 1][0], LINK_XZ[i][1] - LINK_XZ[i - 1][1]); d.push(L); }
  return LINK_XZ.map(([x, z], i) => [x, z, -0.8 + (-6 + 0.8) * (d[i] / L)]);
})();
export const EXT_HW = 4.2, EXT_DEPTH = 1.4, EXT_BANK = 7;              // suối nạp
export const LINK_HW = 11, LINK_DEPTH = 3.5, LINK_BANK = 6;           // kênh dẫn ra sông
// tương thích tên cũ: EXT_OUT = tuyến khẩu (nay là kênh dẫn 22 m)
export const EXT_OUT = LINK;
const extBox = (P, pad) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, z] of P) { a = Math.min(a, x); b = Math.min(b, z); c = Math.max(c, x); d = Math.max(d, z); } return [a - pad, b - pad, c + pad, d + pad]; };
export const EXT_PATHS = [
  { id: 'in', P: EXT_IN, hw: EXT_HW, depth: EXT_DEPTH, bank: EXT_BANK, flow: 0.8 },
  { id: 'link', P: LINK, hw: LINK_HW, depth: LINK_DEPTH, bank: LINK_BANK, flow: 0.9 },
].map((e) => ({ ...e, box: extBox(e.P, e.hw + e.bank + 2) }));
/** khoảng cách tới tuyến + mực nước nội suy: { d, level, hw, depth, bank, tx, tz, flow, id } (gần nhất), null nếu ngoài vùng */
export function extNear(x, z) {
  let best = null;
  for (const E of EXT_PATHS) {
    const { P, box } = E;
    if (x < box[0] || x > box[2] || z < box[1] || z > box[3]) continue;
    for (let i = 0; i + 1 < P.length; i++) {
      const [ax, az, la] = P[i], [bx, bz, lb] = P[i + 1], vx = bx - ax, vz = bz - az, ll = vx * vx + vz * vz;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / ll));
      const d = Math.hypot(x - ax - vx * t, z - az - vz * t);
      if (!best || d - E.hw < best.d - best.hw) { const l = Math.sqrt(ll); best = { d, level: la + (lb - la) * t, hw: E.hw, depth: E.depth, bank: E.bank, tx: vx / l, tz: vz / l, flow: E.flow, id: E.id }; }
    }
  }
  return best;
}
const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** khắc lòng suối / kênh dẫn ngoài thành vào độ cao h tại (x, z) */
export function extCarve(x, z, h) {
  const n = extNear(x, z); if (!n || n.d > n.hw + n.bank) return h;
  const bed = n.level - n.depth;
  return Math.min(h, bed + (h - bed) * sst(n.hw * (n.id === 'link' ? 0.85 : 0.6), n.hw + n.bank, n.d));
}
