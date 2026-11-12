// ============================================================================
//  NƯỚC (thuần — motion.js, boats.js, water3d.js, test dùng chung): mực nước, độ sâu, loại nước, dòng chảy, gió,
//  sóng. Sóng = tổng 4 sóng sin theo hướng gió (cùng hằng số với shader water3d.waveGLSL → người bơi / thuyền nổi
//  khớp đúng mặt sóng nhìn thấy). Đơn vị mét, giây.
// ============================================================================
import * as T from './terrain.js';
import { inCanal, CANAL_WATER, MOAT, AVE_CANAL, OUTLET, extNear } from './canals.js';
import { riverNear, riverFlow } from './waterways.js';
import { GUA } from './batquai.js';
import { pondAt } from './court.js';

const G = 9.81;
// đồng hồ nước dùng chung (giây): water3d.tick đặt mỗi khung (cùng uT của shader) → người bơi / thuyền nổi khớp sóng nhìn thấy
let CLOCK = 0;
export const setWaterTime = (t) => { CLOCK = t; };
export const waterTime = () => CLOCK;
// thành phần sóng: góc lệch so với hướng gió (rad), bước sóng (m), biên độ tương đối (tổng ≈ 1)
export const WAVES = [
  { ang: 0.0, len: 11, a: 0.42 },
  { ang: 0.55, len: 6.5, a: 0.28 },
  { ang: -0.75, len: 3.9, a: 0.18 },
  { ang: 2.3, len: 17, a: 0.12 },
].map((w, i) => ({ ...w, k: (2 * Math.PI) / w.len, w: Math.sqrt(G * (2 * Math.PI) / w.len), ph: i * 1.9 }));
// biên độ sóng (m, nửa đỉnh–đáy) theo loại nước
export const AMP = { canal: 0.08, moat: 0.1, link: 0.12, stream: 0.04, river: 0.32, lake: 0.45, pond: 0.014 };

/** gió toàn cục đổi chậm theo thời gian (giây): { dx, dz (đơn vị), speed m/s } — tất định, mọi máy như nhau */
export function wind(t = 0) {
  const h = t / 3600;
  const a = 0.9 + 0.7 * Math.sin(h * 0.37) + 0.35 * Math.sin(h * 1.13 + 1.7);
  const speed = 3.2 + 2.4 * (0.5 + 0.5 * Math.sin(h * 0.61 + 0.4));
  return { dx: Math.cos(a), dz: Math.sin(a), speed, a };
}
/** độ cao mặt sóng so với mực tĩnh tại (x, z), thời điểm t, biên độ amp */
export function waveHeight(x, z, t, amp, W = wind(t)) {
  if (!amp) return 0;
  let h = 0;
  for (const w of WAVES) {
    const c = Math.cos(W.a + w.ang), s = Math.sin(W.a + w.ang);
    h += w.a * Math.sin(w.k * (x * c + z * s) - w.w * t + w.ph);
  }
  return h * amp;
}
/** độ dốc mặt sóng (đạo hàm theo x, z) — thuyền chòng chành / chồm */
export function waveSlope(x, z, t, amp, W = wind(t)) {
  let gx = 0, gz = 0;
  for (const w of WAVES) {
    const c = Math.cos(W.a + w.ang), s = Math.sin(W.a + w.ang), q = Math.cos(w.k * (x * c + z * s) - w.w * t + w.ph) * w.a * w.k;
    gx += q * c; gz += q * s;
  }
  return { gx: gx * amp, gz: gz * amp };
}

const OCT = GUA.map((g) => g.dir);
const octU = (x, z) => { let m = -Infinity; for (const [dx, dz] of OCT) m = Math.max(m, x * dx + z * dz); return m; };
const KAN = GUA.find((g) => g.id === 'kan'), XUN = GUA.find((g) => g.id === 'xun');
const CANAL_FLOW = 0.3, MOAT_FLOW = 0.22;
/** dòng chảy kênh / hào (theo quy hoạch Bát Môn): Khảm chảy vào hào, hào chảy vòng Bắc → Đông → Đông Nam, Tốn chảy ra */
function canalFlow(x, z) {
  const o = octU(x, z);
  if (o > MOAT.a - MOAT.w / 2 - 0.5 && o < MOAT.a + MOAT.w / 2 + 0.5) {
    // hào: tiếp tuyến theo chiều kim đồng hồ (nhìn từ trên, Bắc = −z): (x, z) → (−z, x) chuẩn hoá; nửa Tây gần như lặng
    const r = Math.hypot(x, z) || 1, tx = -z / r, tz = x / r, east = x > 0 ? 1 : 0.2;
    return { x: tx * MOAT_FLOW * east, z: tz * MOAT_FLOW * east, kind: 'moat' };
  }
  for (const [g, sgn] of [[KAN, -1], [XUN, 1]]) {
    const u = g.dir[0] * x + g.dir[1] * z, v = -g.dir[1] * x + g.dir[0] * z;
    const u1 = g === XUN ? OUTLET.u1 : AVE_CANAL.u1;
    if (u > AVE_CANAL.u0 - 1 && u < u1 + 1 && Math.abs(v) < AVE_CANAL.v1 + 0.5) {
      const edge = 1 - (v / AVE_CANAL.v1) ** 2; // chảy nhanh giữa kênh, chậm sát kè
      return { x: g.dir[0] * sgn * CANAL_FLOW * Math.max(0.2, edge), z: g.dir[1] * sgn * CANAL_FLOW * Math.max(0.2, edge), kind: 'canal' };
    }
  }
  return { x: 0, z: 0, kind: 'canal' };
}

/**
 * Nước tại (x, z): null nếu khô; { level (mực tĩnh), ground (đáy), depth, kind, flow: {x, z}, amp }.
 * Chưa tính cầu / nền (motion.js lo phần đó).
 */
export function waterAt(x, z) {
  // hồ sen sân Sơn Môn: nước tĩnh, gợn rất nhẹ (court.pondAt — lội được)
  const pd = pondAt(x, z);
  if (pd) return { level: pd.level, ground: pd.floor, depth: pd.level - pd.floor, kind: 'pond', flow: { x: 0, z: 0 }, amp: 0.02 };
  // v4: hào / kênh / suối cũ (canals.js) đã bỏ khỏi địa hình — chỉ còn nước thế giới (sông, hồ) ở mực T.WATER
  const ground = T.heightAt(x, z);
  if (ground >= T.WATER - 0.02) return null;
  const rf = riverFlow(x, z), depth = T.WATER - ground;
  if (rf) return { level: T.WATER, ground, depth, kind: 'river', flow: { x: rf.x, z: rf.z }, amp: worldAmp(depth) };
  const W = wind(0);
  return { level: T.WATER, ground, depth, kind: 'lake', flow: { x: W.dx * 0.04, z: W.dz * 0.04 }, amp: worldAmp(depth) * 1.15 };
}
const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** biên độ sóng mặt nước thế giới (sông / hồ) theo độ sâu — cùng công thức với shader world3d (nông thì lặng) */
export const worldAmp = (d) => (0.15 + 0.25 * sst(1, 10, d)) * sst(0, 1.5, d);
/** mực nước có sóng tại thời điểm t (null nếu khô) */
export function surfaceAt(x, z, t) {
  const w = waterAt(x, z); if (!w) return null;
  const amp = w.kind === 'river' || w.kind === 'lake' ? w.amp : w.amp * Math.min(1, w.depth / 1.5);
  return w.level + waveHeight(x, z, t, amp);
}
export { riverNear };
