// ============================================================================
//  CẦU & THỦY MÔN (thuần, tất định — river3d / landmarks dựng hình + nền đi được, boats.js kiểm tĩnh không và
//  trụ cầu, test). Mỗi cầu: { id, kind, x, z, ax, az (hướng băng qua nước, đơn vị), L (nửa chiều dài băng qua),
//  f (nửa phần đỉnh phẳng), H (độ cao đỉnh mặt cầu, tuyệt đối), y0 / y1 (cao độ hai đầu), W (bề rộng), water (mực nước
//  dưới cầu), thick (dày mặt cầu), piers: [{ x, z, r }] }.
//  Cầu lưng gù trong thành (kiểu Tô Châu): tĩnh không ≥ 5,5 m trên mặt nước ở giữa lòng kênh, chân cầu nằm gọn trong
//  lòng nước (không chắn đường bờ), lên xuống bằng bậc đá thoải (mỗi bậc ≤ 0,55 m — motion.STEP_UP 0,65).
// ============================================================================
import { GUA, OCT_A, toWorld, gateWidth } from './batquai.js';
import { MOAT, AVE_CANAL, OUTLET, CANAL_WATER, CANAL_CLEAR } from './canals.js';
import { RINGS, BELT, TRUNG_A, OUTER_A } from './cityblocks.js';
import * as T from './terrain.js';

export const DECK_T = 0.6;                                  // dày mặt cầu (đáy cầu = mặt − 0,6)
const HUMP_H = CANAL_WATER + CANAL_CLEAR + DECK_T;          // đỉnh mặt cầu thành: 5,3 m
const QUAY = 0.35;                                          // mặt bờ kè
export const ARCH_R = CANAL_CLEAR;                          // vòm cuốn: cao 5,5 m trên mặt nước (tĩnh không)
export const ARCH_W = 7.5;                                  // nửa bề rộng lòng vòm (vòm bán elip rộng 15 m — thuyền hoa 3,6 m có ~3 m lệch hai bên)

/** cao độ mặt cầu tại toạ độ t dọc hướng băng qua (−L…L) */
export function deckTop(b, t) {
  if (b.r0 != null) { // dốc riêng từng đầu: r0 / r1 = chiều dài dốc lên từ đầu −L / xuống tới đầu +L (0 = phẳng tới đầu)
    const e = (k) => (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, k)))) / 2;
    if (b.r0 > 0 && t < -b.L + b.r0) return b.y0 + (b.H - b.y0) * e((t + b.L) / b.r0);
    if (b.r1 > 0 && t > b.L - b.r1) return b.y1 + (b.H - b.y1) * e((b.L - t) / b.r1);
    return b.H;
  }
  const a = Math.abs(t);
  if (a <= b.f) return b.H;
  if (a >= b.L) return t < 0 ? b.y0 : b.y1;
  const k = (a - b.f) / (b.L - b.f), e = (1 - Math.cos(Math.PI * (1 - k))) / 2; // cosin: thoải ở chân, thoải ở đỉnh
  return (t < 0 ? b.y0 : b.y1) + (b.H - (t < 0 ? b.y0 : b.y1)) * e;
}
/** toạ độ cục bộ (t dọc băng qua, n ngang) của điểm (x, z) */
export const localOf = (b, x, z) => ({ t: (x - b.x) * b.ax + (z - b.z) * b.az, n: -(x - b.x) * b.az + (z - b.z) * b.ax });

let CITY = null;
/** cầu trong thành: 8 cầu qua hào (8 đại lộ) + cầu qua kênh Khảm / Tốn ở mọi vành phố / vành phủ */
export function cityBridges() {
  if (CITY) return CITY;
  const out = [];
  const outEdge = MOAT.a + MOAT.w / 2;
  const ring0 = RINGS[0];
  for (const g of GUA) {
    // chân trong = mặt ngoài cổng Nội Thành (cổng nhô ra hào), chân ngoài = trên bờ kè ngoài hào
    const di = gateWidth(g) / (g.id === 'kan' ? 2.76 : 2.13), u0 = OCT_A + di / 2, u1 = outEdge + 6; // chân ngoài trên bờ kè (trước vành 195,5)
    if (AVE_CANAL.gua.includes(g.id)) {
      // KHẢM / TỐN — kênh đổ vào hào ngay trước cổng: CẦU GÁC (thủy kiều trên cột) — bậc đá lên từ mặt cổng, mặt cầu bằng
      // cao 5,3 m chạy dọc trục tới cầu vành ${ring0.a} (bằng phẳng trên miệng kênh); gầm thông thuyền cả dọc lẫn ngang
      const uA = ring0.a, cA = toWorld(g, (u0 + uA) / 2, 0);
      out.push({ id: `moat_${g.id}`, kind: 'moat', open: true, x: cA.x, z: cA.z, ax: g.dir[0], az: g.dir[1], L: (uA - u0) / 2, r0: 7.5, r1: 0, H: HUMP_H, y0: 0, y1: HUMP_H, W: 10, water: CANAL_WATER, thick: DECK_T, cols: [-(uA - u0) / 2 + 7.5, (uA - u0) / 2 - 1], piers: [] });
      const cB = toWorld(g, uA, 0);
      out.push({ id: `canal_${g.id}_${uA}`, kind: 'canal', open: true, x: cB.x, z: cB.z, ax: -g.dir[1], az: g.dir[0], L: 21, r0: 9.4, r1: 9.4, H: HUMP_H, y0: QUAY, y1: QUAY, W: ring0.w + 2, water: CANAL_WATER, thick: DECK_T, cols: [-AVE_CANAL.v1 - 0.4, AVE_CANAL.v1 + 0.4], piers: [] });
      continue;
    }
    const c = toWorld(g, (u0 + u1) / 2, 0);
    out.push({ id: `moat_${g.id}`, kind: 'moat', x: c.x, z: c.z, ax: g.dir[0], az: g.dir[1], L: (u1 - u0) / 2, f: 3, H: HUMP_H, y0: 0, y1: QUAY, W: Math.min(gateWidth(g) - 4, 20), water: CANAL_WATER, thick: DECK_T, arch: ARCH_R, archW: Math.min(ARCH_W, outEdge - (u0 + u1) / 2 - 0.3), archT: 0, piers: [] }); // vòm dưới đỉnh cầu (nửa ngoài hào = lạch thuyền, canals.MOAT_LANE)
  }
  const crossU = [...RINGS, BELT.ringIn, BELT.ringOut].filter((r) => r.a > outEdge + 4);
  for (const id of AVE_CANAL.gua) {
    const g = GUA.find((q) => q.id === id), u1max = id === OUTLET.gua ? OUTLET.u1 : AVE_CANAL.u1;
    for (const r of crossU) {
      if (r.a > u1max - 4 || Math.abs(r.a - TRUNG_A) < 14 || Math.abs(r.a - OUTER_A) < 14 || r === ring0) continue; // trong thủy môn thì không dựng cầu · vành đầu: cầu gác ở trên
      const c = toWorld(g, r.a, 0), ax = -g.dir[1], az = g.dir[0]; // băng qua theo v
      out.push({ id: `canal_${id}_${r.a}`, kind: 'canal', x: c.x, z: c.z, ax, az, L: AVE_CANAL.v1 + 0.6, f: 3, H: HUMP_H, y0: QUAY, y1: QUAY, W: r.w + 2, water: CANAL_WATER, thick: DECK_T, arch: ARCH_R, archW: ARCH_W, piers: [] });
    }
  }
  CITY = out;
  return out;
}

// cầu sông / thủy môn thêm lúc chạy (landmarks dựng cầu lớn Huyền Hà; cityblocks3d dựng thủy môn)
const EXTRA = [];
export function addBridge(b) { EXTRA.push(b); return b; }
export const allBridges = () => [...cityBridges(), ...riverBridges(), ...EXTRA];

// CẦU LỚN HUYỀN HÀ (Nam Môn Đại Kiều): thẳng Nam từ cổng Cảnh Môn (Ly), băng sông chỗ cắt vuông góc. Hai bờ cao
// 16–22 m nên mặt cầu gần như bằng (đỉnh = bờ cao + 1,5 m), tĩnh không giữa dòng ~28 m — thuyền buồm cột 12 m qua thoải
// mái. Nhịp giữa 40 m trên lạch, các nhịp 30 m; trụ đá có va chạm cho thuyền / người bơi.
export const RIVER_BRIDGE = { x: 0, z0: 805, z1: 1015, W: 12, thick: 1.4, mid: 40, span: 30, pierW: 4.4 };
let RB = null;
export function riverBridges() {
  if (RB) return RB;
  const R = RIVER_BRIDGE, L = (R.z1 - R.z0) / 2, z = (R.z0 + R.z1) / 2;
  const y0 = T.heightAt(R.x, R.z0), y1 = T.heightAt(R.x, R.z1);
  const b = { id: 'river_nammon', kind: 'river', name: 'Nam Môn Đại Kiều', x: R.x, z, ax: 0, az: 1, L, f: 34, H: Math.max(y0, y1, T.WATER + 15 + R.thick) + 1.5, y0, y1, W: R.W, water: T.WATER, thick: R.thick, piers: [], spans: [] };
  // trụ: ±mid/2, rồi cách span ra hai phía — chỉ trụ đứng dưới nước / chân bờ (đáy dưới mặt nước)
  for (const sg of [-1, 1]) for (let t = R.mid / 2; t < L - 6; t += R.span) {
    const pz = z + sg * t;
    if (T.heightAt(R.x, pz) > T.WATER + 2) continue; // trên bờ khô: ramp tựa đất, khỏi trụ
    b.piers.push({ x: R.x, z: pz, r: R.pierW / 2 + 0.6, t: sg * t, hw: R.W / 2 + 0.8, hd: R.pierW / 2 });
  }
  RB = [b];
  return RB;
}
/** thủy môn trên đường kênh (tĩnh không cố định, trụ hai bên) — để thuyền buồm cột cao bị chặn */
export function waterGates() {
  const out = [];
  for (const id of AVE_CANAL.gua) {
    const g = GUA.find((q) => q.id === id);
    for (const A of [TRUNG_A, ...(id === OUTLET.gua ? [OUTER_A] : [])]) { const c = toWorld(g, A, 0); out.push({ id: `wg_${id}_${A}`, x: c.x, z: c.z, ax: g.dir[0], az: g.dir[1], halfLen: 6, halfW: 11, clear: 7, water: CANAL_WATER }); }
  }
  return out;
}

/**
 * Tĩnh không tại (x, z): khoảng từ mặt nước tới đáy công trình phía trên (m), Infinity nếu không có gì che.
 * Dùng cho thuyền: thuyền cao hơn tĩnh không thì không qua được.
 */
export function clearanceAt(x, z) {
  let c = Infinity;
  for (const b of allBridges()) {
    if (Math.abs(x - b.x) > b.L + b.W && Math.abs(z - b.z) > b.L + b.W) continue;
    const { t, n } = localOf(b, x, z);
    if (Math.abs(t) > b.L || Math.abs(n) > b.W / 2 + 0.5) continue;
    let under = deckTop(b, t) - b.thick - b.water;
    if (b.arch) { const at = (t - (b.archT || 0)) / (b.archW || b.arch); under = Math.min(under, Math.abs(at) < 1 ? b.arch * Math.sqrt(1 - at * at) : 0); } // ngoài lòng vòm là tường đá
    c = Math.min(c, under);
  }
  for (const w of waterGates()) {
    const t = (x - w.x) * w.ax + (z - w.z) * w.az, n = -(x - w.x) * w.az + (z - w.z) * w.ax;
    if (Math.abs(t) <= w.halfLen && Math.abs(n) <= w.halfW) c = Math.min(c, w.clear);
  }
  return c;
}
/** trụ cầu (vật cản cho thuyền / người bơi): [{ x, z, r }] */
export const piers = () => allBridges().flatMap((b) => b.piers || []);

/** nền đi được theo dốc mặt cầu: lát mỏng (0,45 m — bậc ≤ 0,55 m) dọc hướng băng qua — addPlatform(x, z, w, d, ry, top) */
export function bridgePlatforms(b, step = 0.45) {
  const out = [], n = Math.ceil((2 * b.L) / step), ds = (2 * b.L) / n, ry = Math.atan2(-b.az, b.ax);
  for (let i = 0; i < n; i++) {
    const t = -b.L + (i + 0.5) * ds;
    out.push({ x: b.x + b.ax * t, z: b.z + b.az * t, w: ds + 0.02, d: b.W, ry, top: deckTop(b, t) });
  }
  return out;
}
