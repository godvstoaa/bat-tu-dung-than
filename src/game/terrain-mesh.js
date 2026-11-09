// ============================================================================
//  HUYỀN GIỚI — phần TÍNH TOÁN thuần của thế giới (không THREE, không DOM) để chạy được trong
//  Web Worker (gen.worker.js): lưới địa hình từng chunk, trọng số lớp mặt đất, vị trí cây,
//  bản đồ độ sâu nước. Luồng chính chỉ còn gói mảng số vào BufferGeometry / texture.
// ============================================================================
import * as T from './terrain.js';
import { inCourt } from './court.js';
import { CITY_R, roadField, makeRoadSampler } from './roads.js';
import { rng } from './textures.js';

export const CHUNK = 128;
export const CHUNKS = T.WORLD / CHUNK; // 16 × 16

// Mặt đất = trộn 4 lớp kết cấu (ground-tex.js) theo trọng số từng đỉnh; màu đỉnh chỉ còn là
// «tông» nhân thêm (khô/ướt, cát, đáy hồ, sáng tối vĩ mô) — hết cảnh thảm xanh đổ màu phẳng.
const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const TINT = { lush: [0.94, 1.0, 0.9], dry: [1.12, 1.03, 0.72], sand: [1.42, 1.3, 1.1], bed: [0.5, 0.56, 0.56] };
// → out: [cỏ, đất, đá, tuyết, tông R, G, B]
export function groundAt(x, z, h, s, out = new Float32Array(7)) {
  const set = (g, d, r, sn, t, k = 1) => { out[0] = g; out[1] = d; out[2] = r; out[3] = sn; out[4] = t[0] * k; out[5] = t[1] * k; out[6] = t[2] * k; return out; };
  if (h < T.WATER - 0.5) return set(0, 1, 0, 0, TINT.bed);
  if (h < T.WATER + 1.4) return set(0, 1, 0.1, 0, TINT.sand, 0.95 + 0.1 * sst(T.WATER - 0.5, T.WATER + 1.4, h));
  const v = T.fbm(x / 70 + 3, z / 70 - 5, 3), dryK = Math.max(0, Math.min(1, (h - 110) / 150 + v * 0.35));
  const k = 0.88 + 0.22 * (0.5 + 0.5 * Math.sin(x * 0.07 + Math.cos(z * 0.05) * 3));
  const tint = [0, 1, 2].map((c) => TINT.lush[c] + (TINT.dry[c] - TINT.lush[c]) * dryK);
  let dirt = 0.85 * sst(0.16, 0.4, T.fbm(x / 34 + 11, z / 34 - 7, 3)); // mảng đất trống
  if (Math.hypot(x, z) < CITY_R + 6) dirt = Math.max(dirt, 0.4 + 0.3 * sst(0.0, 0.3, T.fbm(x / 12, z / 12, 2))); // đất nện trong thành
  const rock = Math.max(0, Math.min(1, (s - 0.72 - 0.15 * v) / 0.38)); // đá lộ ở dốc > ~36°
  const rw = Math.abs(Math.hypot(x, z) - CITY_R); // chân tường thành: dải đất nện ẩm
  if (rw < 5) dirt = Math.max(dirt, 1 - sst(2, 5, rw));
  const snow = h > 290 ? Math.max(0, Math.min(1, (h - 290) / 60)) * (1 - rock * 0.6) : 0;
  return set((1 - rock) * (1 - dirt * 0.6), dirt * (1 - rock), rock, snow, tint, k);
}

// Lưới một chunk (seg × seg ô) + skirt chống nứt. Trả mảng số (chuyển giao được giữa luồng).
const GA = new Float32Array(7);
export function chunkData(cx, cz, seg) {
  const x0 = -T.HALF + cx * CHUNK, z0 = -T.HALF + cz * CHUNK, step = CHUNK / seg;
  const vs = seg + 1, ring = seg * 4, total = vs * vs + ring;
  const pos = new Float32Array(total * 3), col = new Float32Array(total * 3), nor = new Float32Array(total * 3), spl = new Float32Array(total * 4);
  const idx = new Uint32Array(seg * seg * 6 + ring * 6);
  let ni = 0;
  // lấy mẫu thêm 1 vòng viền ngoài chunk → pháp tuyến ở mép tính giống hệt chunk bên cạnh (hết đường kẻ)
  const W = vs + 2, H = new Float32Array(W * W);
  for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
    const x = x0 + (i - 1) * step, z = z0 + (j - 1) * step;
    let h = T.heightAt(x, z);
    if (inCourt(x, z)) h -= 0.08; // sân Sơn Môn lát đá ở y = 0 → hạ địa hình 8 cm, không chập mặt sân
    H[j * W + i] = h;
  }
  const hAt = (i, j) => H[(j + 1) * W + (i + 1)];
  let lo = Infinity, hi = -Infinity;
  for (let j = 0; j < vs; j++) for (let i = 0; i < vs; i++) {
    const k = (j * vs + i) * 3, h = hAt(i, j);
    pos[k] = x0 + i * step; pos[k + 1] = h; pos[k + 2] = z0 + j * step;
    if (h < lo) lo = h; if (h > hi) hi = h;
    const dx = (hAt(i + 1, j) - hAt(i - 1, j)) / (2 * step), dz = (hAt(i, j + 1) - hAt(i, j - 1)) / (2 * step);
    const n = Math.hypot(dx, 1, dz);
    nor[k] = -dx / n; nor[k + 1] = 1 / n; nor[k + 2] = -dz / n;
    groundAt(pos[k], pos[k + 2], h, Math.hypot(dx, dz), GA);
    const q = (j * vs + i) * 4;
    spl[q] = GA[0]; spl[q + 1] = GA[1]; spl[q + 2] = GA[2]; spl[q + 3] = GA[3];
    col[k] = GA[4]; col[k + 1] = GA[5]; col[k + 2] = GA[6];
  }
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) {
    const a = j * vs + i, b = a + 1, c = a + vs, d = c + 1;
    idx[ni++] = a; idx[ni++] = c; idx[ni++] = b; idx[ni++] = b; idx[ni++] = c; idx[ni++] = d;
  }
  // skirt: viền thả xuống 10 m che kẽ hở giữa chunk khác LOD
  const border = [];
  for (let i = 0; i < seg; i++) border.push(i);
  for (let j = 0; j < seg; j++) border.push(j * vs + seg);
  for (let i = seg; i > 0; i--) border.push(seg * vs + i);
  for (let j = seg; j > 0; j--) border.push(j * vs);
  const base = vs * vs;
  border.forEach((v, n) => {
    const k = (base + n) * 3;
    for (let c = 0; c < 3; c++) { pos[k + c] = pos[v * 3 + c]; col[k + c] = col[v * 3 + c]; nor[k + c] = nor[v * 3 + c]; }
    for (let c = 0; c < 4; c++) spl[(base + n) * 4 + c] = spl[v * 4 + c];
    pos[k + 1] -= 10;
  });
  for (let n = 0; n < border.length; n++) {
    const a = border[n], b = border[(n + 1) % border.length], a2 = base + n, b2 = base + ((n + 1) % border.length);
    idx[ni++] = a; idx[ni++] = b; idx[ni++] = a2; idx[ni++] = b; idx[ni++] = b2; idx[ni++] = a2;
  }
  // độ chênh mặt trên: chunk phẳng không đổ bóng (đỡ tốn, và hết cảnh sân phẳng bị chính
  // nền đất bên dưới phủ bóng xám)
  return { cx, cz, seg, pos, nor, col, spl, idx, relief: hi - lo };
}

let ROAD = null;
const roadAt = (x, z) => { if (!ROAD) ROAD = makeRoadSampler(roadField(1024)); return ROAD(x, z); };

// Vị trí rừng: mật độ từ treeDensity, 2 loài; không mọc giữa đường
export function treeList() {
  const pine = [], leaf = [];
  const tr = rng(17);
  for (let x = -T.EDGE; x < T.EDGE; x += 11) for (let z = -T.EDGE; z < T.EDGE; z += 11) {
    const px = x + (tr() - 0.5) * 9, pz = z + (tr() - 0.5) * 9;
    const dn = T.treeDensity(px, pz);
    if (tr() > dn * 0.75) continue;
    if (roadAt(px, pz) < 2.5) continue;
    const h = T.heightAt(px, pz);
    (h > 140 || tr() < 0.35 ? pine : leaf).push({ x: px, y: h - 0.3, z: pz, s: 0.75 + tr() * 0.7, r: tr() * 6.28 });
  }
  return { pine, leaf };
}

// Độ sâu nước (m, âm = dưới mặt nước) trên lưới DEP × DEP phủ cả thế giới — mã hoá half-float
export function depthData(DEP, toHalf) {
  const out = new Uint16Array(DEP * DEP), st = T.WORLD / DEP;
  for (let j = 0; j < DEP; j++) {
    const z = -T.HALF + (j + 0.5) * st;
    for (let i = 0; i < DEP; i++) out[j * DEP + i] = toHalf(T.heightAt(-T.HALF + (i + 0.5) * st, z) - T.WATER);
  }
  return out;
}
