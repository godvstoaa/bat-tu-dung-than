// ============================================================================
//  CẤU KIỆN CHUNG cho họ «west» của biệt phủ (est-west.js — Moorish / Tuscan / Địa Trung Hải), docs/bietphu/west.md.
//  Dựng từ hình cơ bản của tiên phủ (tienphu/arch/kit.js: Acc, rectRoof, roofProfile, lathe, ribAlong; mg-kit sweepXY —
//  CHỈ import) + vật liệu lặp theo mét (archcity/mats.js: tiled / boxUV / consolidate).
//  Khung MẶT ĐỨNG cục bộ (Fc): x = dọc mặt (phải khi đứng ngoài nhìn vào), y = lên (tuyệt đối), z = pháp tuyến ra ngoài,
//  mặt ngoài vách tại z = 0, vách dày t lùi về −z.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, lathe, beam, ribAlong, rectRoof, roofProfile, V } from '../tienphu/arch/kit.js';
import { sweepXY } from '../tienphu/arch/mg-kit.js';
import { tiled, boxUV, consolidate, SPAN } from './mats.js';

export { Acc, box, boxB, lathe, beam, V, sweepXY };
const PI = Math.PI;

// ---------------------------------------------------------------- vật liệu theo phong cách
/** bảng màu (estate-layout STYLES: moorish wall #f1e9da trim #2f6b8a roof #b5562e · tuscan wall #e2c48e trim #6b4a2a roof #b8613a
 *  · diatrunghai wall #f6f1e6 trim #2f6b8a roof #c0653b) — chỉnh sắc cho texture nhuộm (texture vữa sáng ~0,85) */
export const PAL = {
  moorish: { wall: '#f4ecdc', trim: '#e6dac2', ashlar: '#d8ccb2', marble: '#efeadf', azul: '#3d77a0', tile: '#b5562e', tileG: '#3f7d5e', wood: '#5a3a24', door: '#4a2f1d', shutter: '#3d6a52', floor: '#e6e0d2', plinth: '#cdbfa3', brick: '#c99a74', glass: '#22303a', iron: '#23211f' },
  tuscan: { wall: '#ddb47c', trim: '#ead9b8', ashlar: '#9a978a', marble: '#e9e4d8', azul: '#7d6a52', tile: '#b8613a', tileG: '#a8583a', wood: '#6a4426', door: '#4f321d', shutter: '#4f6a43', floor: '#b97a5a', plinth: '#a49f90', brick: '#b0704e', glass: '#26323a', iron: '#211f1d' },
  diatrunghai: { wall: '#f8f4ea', trim: '#ffffff', ashlar: '#dcd3c0', marble: '#f0ece2', azul: '#2f6b8a', tile: '#c0653b', tileG: '#b45e38', wood: '#7a5534', door: '#2f5f7e', shutter: '#2f6b8a', floor: '#c27c5c', plinth: '#d8d0bf', brick: '#c07a58', glass: '#24323c', iron: '#1f1f22' },
};
/** biến thể biệt thự Địa Trung Hải: 0 Andalucía (cửa chớp lam), 1 Provence (vách kem đất, chớp xanh xám), 2 Cycladic (trắng tinh, chớp xanh đậm) */
const PALV = { 'diatrunghai:1': { wall: '#f2e4c8', trim: '#fbf6ea', shutter: '#6f8f86', door: '#5d7a72', tile: '#b25d38', ashlar: '#d6c6a4' }, 'diatrunghai:2': { wall: '#fbfaf6', shutter: '#24557e', door: '#24557e', tile: '#c97a4c', ashlar: '#e2e4e2' } };
const MC = new Map();
/** khoá → vật liệu. Khoá nền (BASE_KEY estatekit): floor, plinth, step. Khoá chi tiết bậc vừa bỏ: rib*, railBar*, lattice*, baluster*, carve* */
export function westMats(style, variant = 0) {
  const ck = `${style}:${variant | 0}`; if (MC.has(ck)) return MC.get(ck);
  const c = { ...(PAL[style] || PAL.diatrunghai), ...(PALV[ck] || {}) }, D = THREE.DoubleSide;
  const m = {
    wall: tiled('plaster', c.wall, { rough: 1 }), trim: tiled('plaster', c.trim, { rough: 0.95 }),
    ashlar: tiled('stone', c.ashlar, { rough: 1 }), pietra: tiled('marble', shade(c.ashlar, 0.92), { rough: 0.85, bump: 0.4 }), marble: tiled('marble', c.marble, { rough: 0.7, bump: 0.5 }),
    azul: tiled('brick', c.azul, { rough: 0.35, bump: 0.6 }), azulW: tiled('brick', '#e9e6dc', { rough: 0.35, bump: 0.6 }),
    tileR: tiled('tile', c.tile, { rough: 0.95, side: D }), ribR: tiled('tile', shade(c.tile, 0.9), { rough: 0.95 }), ridgeR: tiled('tile', shade(c.tile, 0.82), { rough: 0.95 }),
    tileG: tiled('tile', c.tileG, { rough: 0.45, side: D }), ribG: tiled('tile', shade(c.tileG, 0.88), { rough: 0.45 }),
    wood: tiled('plank', c.wood, { rough: 0.95 }), door: tiled('plank', c.door, { rough: 0.85 }), shutter: tiled('plank', c.shutter, { rough: 0.8 }),
    soffit: tiled('plank', shade(c.wood, 1.25), { rough: 1, side: D }), brick: tiled('brick', c.brick, { rough: 1, bump: 1.1 }),
    floor: tiled('stone', c.floor, { rough: 0.9, bump: 0.5 }), plinth: tiled('stone', c.plinth, { rough: 1 }), step: tiled('stone', shade(c.plinth, 1.05), { rough: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: c.glass, roughness: 0.12, metalness: 0.55, side: D }),
    shade: new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 1 }),
    iron: new THREE.MeshStandardMaterial({ color: c.iron, roughness: 0.5, metalness: 0.7 }),
    gold: new THREE.MeshStandardMaterial({ color: '#c9a43a', roughness: 0.35, metalness: 0.85 }),
  };
  m.railBar = m.iron; m.carveA = m.azul; m.lattice = m.trim; m.latticeW = m.wood; m.carve = m.trim; m.baluster = m.ashlar; m.balusterW = m.wood; m.ribG2 = m.ribG;
  MC.set(ck, m); return m;
}
function shade(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(f); return '#' + c.getHexString(); }
const ROOFK = /^(tileR|ribR|ridgeR|tileG|ribG)/;
/** post(group): UV theo mét cho vật liệu lặp → gộp theo ảnh texture (archcity/mats consolidate); kính giữ lưới riêng */
export const finishWest = () => (g) => {
  g.traverse((o) => {
    if (!o.isMesh) return;
    const t = o.material?.userData?.tiled;
    if (t) o.geometry = boxUV(o.geometry, { roof: ROOFK.test(o.name), span: SPAN[t] || 1 });
    if (o.name === 'glass') o.userData.keep = true;
  });
  return consolidate(g);
};

// ---------------------------------------------------------------- khung mặt đứng
export class Fc {
  constructor(acc, ry = 0, ox = 0, oz = 0, oy = 0) { this.acc = acc; this.ry = ry; this.ox = ox; this.oz = oz; this.oy = oy; }
  add(key, g) { if (!g) return g; if (this.ry) g.rotateY(this.ry); g.translate(this.ox, this.oy, this.oz); this.acc.add(key, g); return g; }
  /** mặt con lùi / tiến dz theo pháp tuyến (dz > 0 ra ngoài) */
  off(dz) { return new Fc(this.acc, this.ry, this.ox + Math.sin(this.ry) * dz, this.oz + Math.cos(this.ry) * dz, this.oy); }
  /** điểm cục bộ → thế giới */
  pt(x, y, z) { const c = Math.cos(this.ry), s = Math.sin(this.ry); return V(x * c + z * s + this.ox, y + this.oy, -x * s + z * c + this.oz); }
}
/** bốn mặt của khối W × D tâm (cx, cz): 'f' +z, 'b' −z, 'r' +x, 'l' −x — trả { F, L (bề dài mặt) } */
export function sides(acc, W, D, cx = 0, cz = 0) {
  return {
    f: { F: new Fc(acc, 0, cx, cz + D / 2), L: W }, b: { F: new Fc(acc, PI, cx, cz - D / 2), L: W },
    r: { F: new Fc(acc, PI / 2, cx + W / 2, cz), L: D }, l: { F: new Fc(acc, -PI / 2, cx - W / 2, cz), L: D },
  };
}

// ---------------------------------------------------------------- vòm
/** đường vòm (đa giác lỗ, ngược chiều kim đồng hồ): chân (cx ± w/2, y0), thẳng hs tới chân vòm rồi:
 *  rect · round (bán nguyệt) · seg (vòm hạ, cao 0,3 nửa nhịp) · horse (móng ngựa: tâm cao hơn chân vòm 0,36 R, R = w/2 / 0,94)
 *  · lobed (nhiều múi: bán nguyệt khoét n múi, mũi nhọn quay vào trong) */
export function archPoly(kind, cx, y0, w, hs, o = {}) {
  const r = w / 2, ys = y0 + hs, pts = [[cx - r, y0], [cx + r, y0]];
  if (kind === 'rect') { pts.push([cx + r, ys], [cx - r, ys]); return pts; }
  if (hs > 0.02) pts.push([cx + r, ys]);
  const seg = o.seg || 14;
  if (kind === 'round') for (let i = 0; i <= seg; i++) { const f = (PI * i) / seg; pts.push([cx + r * Math.cos(f), ys + r * Math.sin(f)]); }
  else if (kind === 'lobed') {
    const n = o.lobes || 4, c = r * (o.depth || 0.15), N = n * 8;
    for (let i = 0; i <= N; i++) { const f = (PI * i) / N, rho = r - c * (1 - Math.sqrt(Math.abs(Math.cos(n * f)))); pts.push([cx + rho * Math.cos(f), ys + rho * Math.sin(f)]); }
  } else if (kind === 'seg') {
    const rise = r * (o.rise || 0.3), R = (r * r + rise * rise) / (2 * rise), yc = ys + rise - R, a = Math.asin(r / R);
    for (let i = 0; i <= seg; i++) { const f = PI / 2 - a + (2 * a * i) / seg; pts.push([cx + R * Math.cos(f), yc + R * Math.sin(f)]); }
  } else { // horse
    const R = r / 0.94, k = Math.sqrt(R * R - r * r), yc = ys + k, a0 = -Math.asin(k / R);
    for (let i = 0; i <= seg + 2; i++) { const f = a0 + ((PI - 2 * a0) * i) / (seg + 2); pts.push([cx + R * Math.cos(f), yc + R * Math.sin(f)]); }
  }
  return dedupe(pts);
}
/** cao đỉnh vòm trên chân vòm */
export function archRise(kind, w, o = {}) { const r = w / 2; return kind === 'rect' ? 0 : kind === 'seg' ? r * (o.rise || 0.3) : kind === 'horse' ? r / 0.94 + Math.sqrt((r / 0.94) ** 2 - r * r) : r; }
function dedupe(p) { const out = []; for (const q of p) { const l = out[out.length - 1]; if (!l || Math.hypot(q[0] - l[0], q[1] - l[1]) > 1e-3) out.push(q); } const a = out[0], z = out[out.length - 1]; if (Math.hypot(a[0] - z[0], a[1] - z[1]) < 1e-3) out.pop(); return out; }
/** đường cong vòm (chỉ phần cong, phải → trái) — cho gờ viền vòm */
export function archCurve(kind, cx, ys, w, o = {}) { return archPoly(kind, cx, ys, w, 0, o).slice(2); }

// ---------------------------------------------------------------- vách có lỗ
/** đa giác (+ lỗ) trong mặt XY đùn dày t về −z (mặt ngoài z = z0) */
export function extXY(outer, holes = [], t = 0.4, z0 = 0) {
  const sh = new THREE.Shape(outer.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 2 }); g.translate(0, 0, z0 - t); return g;
}
/** đa giác lỗ của một ô cửa o = { cx, y (bậu), w, hs, kind, pair (cửa sổ đôi ajimez: khe giữa) } */
export function opPolys(o) {
  if (o.pair) { const w = (o.w - o.pair) / 2; return [archPoly(o.kind, o.cx - (o.pair + w) / 2, o.y, w, o.hs, o), archPoly(o.kind, o.cx + (o.pair + w) / 2, o.y, w, o.hs, o)]; }
  return [archPoly(o.kind, o.cx, o.y, o.w, o.hs, o)];
}
/** VÁCH x0..x1 × y0..y1 dày t trên mặt F với các ô cửa ops (ô chạm chân vách → khe cửa đi) */
export function wallPanel(F, key, x0, x1, y0, y1, t, ops = [], z0 = 0) {
  const holes = [], notch = [];
  for (const o of ops) (o.y <= y0 + 0.01 ? notch : holes).push(o);
  notch.sort((a, b) => a.cx - b.cx);
  const outer = [[x0, y0]];
  for (const o of notch) for (const p of opPolys({ ...o, y: y0 })) outer.push(p[0], ...p.slice(2).reverse(), p[1]);
  outer.push([x1, y0], [x1, y1], [x0, y1]);
  F.add(key, extXY(dedupe(outer), holes.flatMap(opPolys), t, z0));
}

// ---------------------------------------------------------------- trang trí ô cửa
/**
 * Trang trí ô cửa o trên mặt F (vách dày t): kính lõm, khung + song, bậu, viền đá / alfiz, cửa chớp mở, song sắt.
 * o.dress: { glass, frame: khoá khung gỗ, sill: khoá bậu, surround: khoá viền, alfiz: khoá khung alfiz, cap: khoá mày cửa,
 *            shutter: true, grille: true, lattice: true (song gỗ celosía), door: true (cánh cửa đi mở vào trong) }
 */
export function dressOp(F, o, t, d = o.dress || {}) {
  const polys = opPolys(o), rise = archRise(o.kind, o.pair ? (o.w - o.pair) / 2 : o.w, o), yTop = o.y + o.hs + rise;
  if (d.glass !== false && !d.door && !d.open) for (const p of polys) { const g = new THREE.ShapeGeometry(new THREE.Shape(p.map(([x, y]) => new THREE.Vector2(x, y))), 2); g.translate(0, 0, -t * 0.55); F.add('glass', g); }
  if (d.frame && !d.door && !d.open) { // khung + song kính: đố đứng giữa, đố ngang ở chân vòm (hoặc 2/3 cao)
    for (const p of polys) {
      let x0 = Infinity, x1 = -Infinity; for (const q of p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); }
      const cx = (x0 + x1) / 2, z = -t * 0.5;
      F.add(d.frame, boxB(0.07, o.hs + rise * 0.9, 0.08, cx, o.y, z));
      F.add(d.frame, box(x1 - x0, 0.07, 0.08, cx, o.y + (o.kind === 'rect' ? o.hs * 0.66 : o.hs), z));
      F.add(d.frame, boxB(x1 - x0, 0.09, 0.1, cx, o.y, z));
    }
  }
  if (d.sill) F.add(d.sill, boxB(o.w + 0.3, 0.12, t * 0.35 + 0.16, o.cx, o.y - 0.12, 0.16 - (t * 0.35 + 0.16) / 2));
  if (d.consoles) for (const s of [-1, 1]) F.add(d.consoles, boxB(0.16, 0.36, 0.2, o.cx + s * (o.w / 2 + 0.02), o.y - 0.48, 0.1));
  if (d.surround) { // viền đá nổi: hai má + lanh tô (vòm: gờ theo đường vòm)
    const bw = d.bw || 0.2, pr = 0.07;
    for (const s of [-1, 1]) F.add(d.surround, boxB(bw, o.hs + (o.kind === 'rect' ? bw : 0), pr, o.cx + s * (o.w / 2 + bw / 2), o.y, pr / 2));
    if (o.kind === 'rect') F.add(d.surround, boxB(o.w + 2 * bw, bw, pr, o.cx, o.y + o.hs, pr / 2));
    else F.add(d.surround, sweepXY(archCurve(o.kind, o.cx, o.y + o.hs, o.w + bw, { ...o, seg: o.w > 2 ? 14 : 9 }), bw, pr * 2, 0));
    if (d.cap) { F.add(d.cap, boxB(o.w + 2 * bw + 0.3, 0.1, 0.24, o.cx, yTop + (o.kind === 'rect' ? bw : bw * 0.7), 0.1)); F.add(d.cap, boxB(o.w + 2 * bw + 0.1, 0.14, 0.16, o.cx, yTop + (o.kind === 'rect' ? bw : bw * 0.7) - 0.12, 0.06)); }
  }
  if (d.alfiz) { // alfiz: khung chữ nhật quanh vòm Hồi giáo (+ gờ theo vòm)
    const m = 0.16, bw = 0.12, x0 = o.cx - o.w / 2 - m - bw - (o.kind === 'horse' ? o.w * 0.04 : 0), x1 = 2 * o.cx - x0, y1 = yTop + m + bw;
    F.add(d.alfiz, boxB(bw, y1 - (o.y + o.hs * 0.55), 0.05, x0 + bw / 2, o.y + o.hs * 0.55, 0.025)); F.add(d.alfiz, boxB(bw, y1 - (o.y + o.hs * 0.55), 0.05, x1 - bw / 2, o.y + o.hs * 0.55, 0.025));
    F.add(d.alfiz, boxB(x1 - x0, bw, 0.05, o.cx, y1 - bw, 0.025));
    for (const p of polys) { const c = p.slice(o.hs > 0.02 ? 2 : 1); if (c.length > 3) F.add('carveA', sweepXY(c.map(([x, y]) => [x + Math.sign(x - (p[0][0] + p[1][0]) / 2) * 0.06, y + 0.06]), 0.11, 0.08, 0.02)); }
  }
  if (o.pair && d.colonnette) { const r = 0.07, h = o.hs; F.add(d.colonnette, lathe([[0.001, 0], [r * 1.5, 0], [r, 0.14], [r * 0.9, h - 0.2], [r * 1.3, h - 0.12], [r * 1.9, h], [0.001, h]], o.cx, o.y, -t * 0.4, 6)); }
  if (d.shutter && o.kind !== 'horse') { // cửa chớp mở áp vách hai bên (persiane / volets): khung + nan ngang
    const h = o.kind === 'rect' ? o.hs : o.hs + rise * 0.5, lw = o.w / 2;
    for (const s of [-1, 1]) {
      const cx = o.cx + s * (o.w / 2 + (d.surround ? (d.bw || 0.2) : 0.04) + lw / 2);
      F.add('shutter', boxB(lw, h, 0.05, cx, o.y + 0.02, 0.06));
      for (let y = o.y + 0.25; y < o.y + h - 0.15; y += 0.24) F.add('lattice' + (d.latKey || ''), box(lw - 0.1, 0.035, 0.03, cx, y, 0.1));
    }
  }
  if (d.grille) { // song sắt (reja) nổi ra 0,12 m trước ô cửa
    const n = Math.max(3, Math.round(o.w / 0.14)), zg = 0.13, h = o.hs + rise * (o.kind === 'rect' ? 0 : 0.55);
    for (let i = 1; i < n; i++) F.add('railBar', boxB(0.025, h, 0.025, o.cx - o.w / 2 + (o.w * i) / n, o.y, zg));
    for (const y of [o.y + 0.08, o.y + h * 0.5, o.y + h - 0.06]) F.add('iron', box(o.w + 0.1, 0.04, 0.035, o.cx, y, zg));
    for (const s of [-1, 1]) F.add('iron', box(0.04, 0.04, 0.16, o.cx + s * (o.w / 2 + 0.03), o.y + h - 0.06, zg / 2));
  }
  if (d.lattice) for (const p of polys) { // song gỗ ô trám (celosía / mashrabiya) lõm trong ô cửa
    let x0 = Infinity, x1 = -Infinity; for (const q of p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); }
    const W = x1 - x0, H = o.hs, n = Math.max(2, Math.round(W / 0.18));
    for (let i = 1; i < n; i++) F.add('latticeW', boxB(0.03, H, 0.04, x0 + (W * i) / n, o.y, -t * 0.3));
    for (let y = o.y + 0.2; y < o.y + H; y += 0.2) F.add('latticeW', box(W, 0.03, 0.04, (x0 + x1) / 2, y, -t * 0.3));
  }
  if (d.door) { // cánh cửa đi gỗ mở hẳn vào trong, áp mặt trong vách hai bên ô cửa (không chiếm sàn) + ô vòm trên chân vòm: song sắt
    const lw = o.w / 2 - 0.02, h = o.hs + (o.kind === 'horse' ? rise * 0.55 : 0) - 0.02;
    for (const s of [-1, 1]) {
      const x = o.cx + s * (o.w / 2 + lw / 2 + 0.03);
      F.add('door', boxB(lw, h, 0.08, x, o.y, -t - 0.06));
      for (const y of [0.35, h * 0.5, h - 0.3]) F.add('iron', box(lw * 0.9, 0.06, 0.1, x, o.y + y, -t - 0.06));
    }
    if (o.kind !== 'rect' && o.kind !== 'horse') { const n = Math.max(4, Math.round(o.w / 0.22)); for (let i = 1; i < n; i++) { const x = o.cx - o.w / 2 + (o.w * i) / n, xr = Math.abs(x - o.cx) / (o.w / 2), hh = rise * Math.sqrt(Math.max(0, 1 - xr * xr)) * 0.94; if (hh > 0.1) F.add('railBar', boxB(0.03, hh, 0.03, x, o.y + o.hs, -t * 0.5)); } F.add('iron', box(o.w, 0.07, 0.07, o.cx, o.y + o.hs, -t * 0.5)); }
  }
  return yTop;
}

// ---------------------------------------------------------------- cột
/** cột Nasrid (Alhambra, sân Sư Tử): thân mảnh, vòng cổ nhiều nấc, đầu cột khối + tấm đệm (cimacio) — h tới mặt đệm */
export function nasridCol(acc, key, x, y, z, h, r = 0.13, seg = 10) {
  const hc = Math.min(0.55, h * 0.2), hs = h - hc;
  acc.add(key, lathe([[0.001, 0], [r * 1.55, 0], [r * 1.55, 0.06], [r * 1.25, 0.12], [r * 1.1, 0.2], [r, 0.26], [r * 0.92, hs - 0.2], [r * 1.12, hs - 0.16], [r * 0.95, hs - 0.1], [r * 1.12, hs - 0.04], [r * 1.0, hs], [0.001, hs]], x, y, z, seg));
  acc.add(key, lathe([[0.001, 0], [r * 1.05, 0], [r * 1.6, hc * 0.45], [r * 1.7, hc * 0.5], [r * 1.7, hc * 0.86], [0.001, hc * 0.86]], x, y + hs, z, 4).rotateY(0));
  acc.add(key, boxB(r * 3.6, hc * 0.14, r * 3.6, x, y + h - hc * 0.14, z));
}
/** cột thức Tuscan (Vignola: cao 7 D, chân xuyến + đế vuông, thân thu 1/6, đầu bầu dục + tấm vuông) — h tổng, D đường kính chân */
export function tuscanCol(acc, key, x, y, z, h, D, seg = 12) {
  const r = D / 2, hb = D * 0.5, hc = D * 0.5, hs = h - hb - hc;
  acc.add(key, boxB(D * 1.32, hb * 0.48, D * 1.32, x, y, z));
  acc.add(key, lathe([[0.001, 0], [r * 1.3, 0], [r * 1.34, hb * 0.2], [r * 1.28, hb * 0.42], [r * 1.12, hb * 0.5], [r * 1.05, hb * 0.52], [0.001, hb * 0.52]], x, y + hb * 0.48, z, seg));
  acc.add(key, lathe([[0.001, 0], [r, 0], [r * 1.005, hs * 0.33], [r * 0.95, hs * 0.66], [r * 0.83, hs], [0.001, hs]], x, y + hb, z, seg));
  acc.add(key, lathe([[0.001, 0], [r * 0.9, 0], [r * 0.9, hc * 0.12], [r * 0.83, hc * 0.2], [r * 0.83, hc * 0.36], [r * 0.95, hc * 0.42], [r * 1.12, hc * 0.62], [0.001, hc * 0.62]], x, y + hb + hs, z, seg));
  acc.add(key, boxB(D * 1.3, hc * 0.38, D * 1.3, x, y + h - hc * 0.38, z));
}

// ---------------------------------------------------------------- vòm cuốn (arcade) trên mặt F
/**
 * Dãy vòm trên mặt F: arches [{ cx, w, kind, lobes }] cùng chân vòm ys; vách cuốn (spandrel) dày t từ ys tới yTop;
 * trụ dưới chân vòm: khe giữa hai vòm ≤ colMax → cột (col(x) dựng), rộng hơn → trụ vuông. z0: mặt ngoài.
 */
export function arcade(F, { key = 'wall', arches, y0, ys, yTop, t = 0.4, z0 = 0, x0, x1, col, colMax = 0.7, pierKey = key, archKey = null, archBw = 0.12, endPier = false }) {
  arches = [...arches].sort((a, b) => a.cx - b.cx);
  const ops = arches.map((a) => ({ ...a, y: ys, hs: 0 }));
  wallPanel(F, key, x0, x1, ys, yTop, t, ops, z0);
  // trụ: giữa các vòm + hai đầu
  const ed = [x0, ...arches.flatMap((a) => [a.cx - a.w / 2, a.cx + a.w / 2]), x1];
  for (let i = 0; i < ed.length; i += 2) {
    const a = ed[i], b = ed[i + 1], g = b - a; if (g < 0.02) continue;
    const end = i === 0 || i === ed.length - 2;
    if (g <= colMax && col && !(endPier && end)) col((a + b) / 2, z0 - t / 2, g);
    else F.add(pierKey, boxB(g, ys - y0, t, (a + b) / 2, y0, z0 - t / 2));
  }
  if (archKey) for (const a of arches) F.add(archKey, sweepXY(archCurve(a.kind, a.cx, ys, a.w + archBw, a), archBw, 0.08, z0 + 0.03));
}

// ---------------------------------------------------------------- dải ngang quanh khối
/** dải hộp quanh chu vi W × D (tâm cx, cz) tại y, cao h, nhô out ngoài mặt vách (dày vào trong 0,25) */
export function ring(acc, key, W, D, y, h, out, cx = 0, cz = 0) {
  const dep = out + 0.25;
  acc.add(key, boxB(W + 2 * out, h, dep, cx, y, cz + D / 2 + out - dep / 2)); acc.add(key, boxB(W + 2 * out, h, dep, cx, y, cz - D / 2 - out + dep / 2));
  acc.add(key, boxB(dep, h, D, cx + W / 2 + out - dep / 2, y, cz)); acc.add(key, boxB(dep, h, D, cx - W / 2 - out + dep / 2, y, cz));
}
/** phào nhiều nấc: steps [[h, out], …] từ dưới lên */
export function cornice(acc, key, W, D, y, steps, cx = 0, cz = 0) { let yy = y; for (const [h, out] of steps) { ring(acc, key, W, D, yy, h, out, cx, cz); yy += h; } return yy; }
/** đá góc (quoins) so le ở bốn góc khối */
export function quoins(acc, key, W, D, y0, y1, cx = 0, cz = 0, s = 0.42) {
  let i = 0;
  for (let y = y0; y < y1 - s * 0.6; y += s, i++) {
    const L = i % 2 ? 0.55 : 0.9, h = s - 0.05;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      acc.add(key, boxB(L, h, 0.06, cx + sx * (W / 2 - L / 2 + 0.01), y, cz + sz * (D / 2 + 0.02)));
      acc.add(key, boxB(0.06, h, i % 2 ? 0.9 : 0.55, cx + sx * (W / 2 + 0.02), y, cz + sz * (D / 2 - (i % 2 ? 0.45 : 0.275) + 0.01)));
    }
  }
}

// ---------------------------------------------------------------- nền, bậc
/** nền (W × D) cao h, tâm (cx, cz): thân đá + mặt lát + gờ; stairs [{ side: 'f'|'b'|'l'|'r', w, c }] — bậc ≤ 0,16 m, mặt 0,32 m */
export function plinthBase(acc, W, D, h, stairs = [], cx = 0, cz = 0, o = {}) {
  if (h > 0.05) { acc.add('plinth', boxB(W, h - 0.1, D, cx, 0, cz)); acc.add('plinth', boxB(W + 0.16, 0.18, D + 0.16, cx, 0, cz)); }
  acc.add('floor', boxB(W + (o.lip ?? 0.1), 0.12, D + (o.lip ?? 0.1), cx, Math.max(0, h - 0.12), cz));
  for (const s of stairs) {
    const n = Math.max(1, Math.ceil(h / 0.16)), rise = h / n, run = 0.32, fz = s.side === 'f' || s.side === 'b', sg = s.side === 'f' || s.side === 'r' ? 1 : -1, edge = fz ? D / 2 : W / 2;
    for (let i = 0; i < n; i++) {
      const top = rise * (i + 1), off = edge + run * (n - i - 0.5);
      if (fz) acc.add('step', boxB(s.w, top, run, cx + (s.c || 0), 0, cz + sg * off)); else acc.add('step', boxB(run, top, s.w, cx + sg * off, 0, cz + (s.c || 0)));
    }
    if (o.cheeks !== false && h > 0.3) for (const e of [-1, 1]) { const L = n * run + 0.1; if (fz) acc.add('plinth', boxB(0.36, h + 0.08, L, cx + (s.c || 0) + e * (s.w / 2 + 0.18), 0, cz + sg * (edge + L / 2))); else acc.add('plinth', boxB(L, h + 0.08, 0.36, cx + sg * (edge + L / 2), 0, cz + (s.c || 0) + e * (s.w / 2 + 0.18))); }
  }
}

// ---------------------------------------------------------------- mái
/**
 * MÁI CHÓP CỤT (hip) ngói ống: khối W × D tâm (cx, cz), đỉnh vách yw; vươn over, độ dốc slope; nóc chạy theo cạnh dài.
 * keys { tile, rib, ridge, soffit, rafter } — rafter: khoá xà gỗ thò ra dưới diềm (sporto Tuscan) hoặc null.
 * Trả { top }.
 */
export function hipRoof(acc, { W, D, yw, over = 1.0, slope = 0.42, cx = 0, cz = 0, keys = {}, rib = 0.42, lift = 0, rafter = 0.62, rs = null }) {
  if (rs == null) rs = Math.min(1, Math.max(0.45, Math.min(W, D) / 6));
  const K = { tile: 'tileR', rib: 'ribR', ridge: 'ridgeR', soffit: 'soffit', ...keys }, rot = D > W + 1e-6;
  const A = rot ? D : W, B = rot ? W : D, ex = A / 2 + over, ez = B / 2 + over;
  const prof = roofProfile(ez, [slope], 0, 6), yE = yw - over * slope + 0.16;
  const r = rectRoof({ type: 'hip', ex, ez, yE, prof, lift, rib: rib * (0.6 + 0.4 * rs), ribW: 0.15 * (0.6 + 0.4 * rs), thick: 0.18 * rs, xs: Math.max(8, Math.round(A / 1.5)) });
  const out = new Acc();
  out.add(K.tile, r.tiles);
  if (r.ribs && K.rib) out.add(K.rib, r.ribs);
  out.add(K.ridge, r.eaveEdge);
  for (const pts of r.ridges) out.add(K.ridge, ribAlong(pts.filter((_, i, a) => i % 2 === 0 || i === a.length - 1).map((p) => V(p.x, p.y - 0.18 + 0.18 * rs, p.z)), 0.3 * rs, 0.22 * rs));
  if (r.ridgeX > 0.05) out.add(K.ridge, ribAlong([V(-r.ridgeX - 0.1, r.top + 0.16 * rs, 0), V(r.ridgeX + 0.1, r.top + 0.16 * rs, 0)], 0.32 * rs, 0.26 * rs));
  if (K.soffit) { const s = r.tiles.clone(); s.translate(0, -0.16, 0); out.add(K.soffit, s); }
  if (K.rafter) { // xà gỗ (correnti) dưới diềm, cách rafter m — từ mặt vách ra mép
    for (const sz of [1, -1]) for (let x = -A / 2 + 0.3; x <= A / 2 - 0.3; x += rafter) out.add(K.rafter, beam(V(x, yw - 0.02, sz * (B / 2 - 0.05)), V(x, yw - 0.02 - (over - 0.12) * slope, sz * (B / 2 + over - 0.12)), 0.1, 0.13));
    for (const sx of [1, -1]) for (let z = -B / 2 + 0.3; z <= B / 2 - 0.3; z += rafter) out.add(K.rafter, beam(V(sx * (A / 2 - 0.05), yw - 0.02, z), V(sx * (A / 2 + over - 0.12), yw - 0.02 - (over - 0.12) * slope, z), 0.13, 0.1));
  }
  for (const [k, l] of out.parts) for (const g of l) { if (rot) g.rotateY(PI / 2); g.translate(cx, 0, cz); acc.add(k, g); }
  return { top: r.top + 0.3 };
}
/** MÁI HAI MÁI (gable) ngói ống, nóc theo x: hai đầu hồi tam giác vách (khoá wall) dày t trên mặt ±x; vươn over (dọc), overG (hồi) */
export function gableRoof(acc, { W, D, yw, over = 0.6, overG = 0.35, slope = 0.42, t = 0.4, keys = {}, rib = 0.42 }) {
  const K = { tile: 'tileR', rib: 'ribR', ridge: 'ridgeR', soffit: 'soffit', wall: 'wall', ...keys }, ex = W / 2 + overG, ez = D / 2 + over;
  const prof = roofProfile(ez, [slope], 0, 6), yE = yw - over * slope + 0.16;
  const r = rectRoof({ type: 'gable', ex, ez, yE, prof, rib, ribW: 0.15, thick: 0.18, xs: Math.max(8, Math.round(W / 1.5)) });
  acc.add(K.tile, r.tiles); if (r.ribs && K.rib) acc.add(K.rib, r.ribs); acc.add(K.ridge, r.eaveEdge);
  acc.add(K.ridge, ribAlong([V(-ex - 0.05, r.top + 0.16, 0), V(ex + 0.05, r.top + 0.16, 0)], 0.32, 0.26));
  for (const sx of [-1, 1]) { acc.add(K.ridge, ribAlong([V(sx * ex, yE - 0.05, ez), V(sx * ex, r.top + 0.05, 0), V(sx * ex, yE - 0.05, -ez)], 0.22, 0.24)); }
  if (K.soffit) { const s = r.tiles.clone(); s.translate(0, -0.16, 0); acc.add(K.soffit, s); }
  for (const sx of [-1, 1]) { // đầu hồi
    const g = extXY([[-D / 2, yw - 0.02], [D / 2, yw - 0.02], [0, r.top - 0.12]], [], t, 0); g.rotateY(sx * PI / 2); g.translate(sx * W / 2, 0, 0); acc.add(K.wall, g);
  }
  return { top: r.top + 0.3 };
}
/** lan can đặc + răng cưa (almenas) Andalus quanh đường gấp khúc pts [[x, z]] tại y: tường thấp h, merlon bậc có chóp */
export function merlonParapet(acc, key, pts, y, { h = 0.9, t = 0.35, mw = 0.62, pitch = 1.15, mh = 0.75, closed = true, cap = 'trim' } = {}) {
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue;
    const ry = Math.atan2(-(b[1] - a[1]), b[0] - a[0]), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
    acc.add(key, box(L + t, h, t, mx, y + h / 2, mz, ry)); acc.add(cap, box(L + t + 0.08, 0.08, t + 0.08, mx, y + h + 0.04, mz, ry));
    const m = Math.max(1, Math.floor(L / pitch));
    for (let k = 0; k < m; k++) {
      const tt = (k + 0.5) / m, x = a[0] + (b[0] - a[0]) * tt, z = a[1] + (b[1] - a[1]) * tt, yb = y + h + 0.08;
      acc.add(key, box(mw, mh * 0.62, t, x, yb + mh * 0.31, z, ry)); acc.add(key, box(mw * 0.62, mh * 0.24, t, x, yb + mh * 0.74, z, ry));
      const p = new THREE.ConeGeometry(mw * 0.31 * Math.SQRT2, mh * 0.2, 4); p.rotateY(PI / 4 + ry); p.translate(x, yb + mh * 0.96, z); acc.add(cap, p);
    }
  }
}
/** lan can tiện (balustrade) dọc đoạn a→b mặt bằng tại y: đế + tay vịn khoá rail, con tiện khoá bal (bậc vừa bỏ) */
export function balustrade(acc, a, b, y, { h = 1.0, rail = 'trim', bal = 'baluster', pitch = 0.28, dep = 0.3, posts = 3.0 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ry = Math.atan2(-(b[1] - a[1]), b[0] - a[0]), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
  acc.add(rail, box(L, 0.16, dep, mx, y + 0.08, mz, ry)); acc.add(rail, box(L + 0.06, 0.12, dep + 0.1, mx, y + h - 0.06, mz, ry));
  const np = Math.max(1, Math.round(L / posts));
  for (let k = 0; k <= np; k++) { const x = a[0] + ux * (L * k) / np, z = a[1] + uz * (L * k) / np; acc.add(rail, box(0.34, h, 0.34, x, y + h / 2, z, ry)); }
  const n = Math.floor(L / pitch);
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) * (L / n), x = a[0] + ux * s, z = a[1] + uz * s, hb = h - 0.28;
    acc.add(bal, lathe([[0.001, 0], [0.07, 0], [0.06, hb * 0.12], [0.1, hb * 0.38], [0.085, hb * 0.6], [0.045, hb * 0.78], [0.055, hb * 0.9], [0.07, hb], [0.001, hb]], x, y + 0.16, z, 6));
  }
}
/** lan can sắt (ban công) dọc đoạn a→b tại y: song đứng khoá railBar (bậc vừa bỏ) + tay vịn + thanh đáy khoá iron */
export function ironRail(acc, a, b, y, { h = 1.0, pitch = 0.15 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ry = Math.atan2(-(b[1] - a[1]), b[0] - a[0]), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
  acc.add('iron', box(L, 0.05, 0.06, mx, y + h, mz, ry)); acc.add('iron', box(L, 0.04, 0.04, mx, y + 0.1, mz, ry)); acc.add('iron', box(L, 0.03, 0.03, mx, y + h - 0.18, mz, ry));
  const n = Math.max(2, Math.round(L / pitch));
  for (let k = 0; k <= n; k++) { const x = a[0] + ((b[0] - a[0]) * k) / n, z = a[1] + ((b[1] - a[1]) * k) / n; acc.add('railBar', box(0.022, h, 0.022, x, y + h / 2, z, ry)); }
  for (let k = 1; k < n; k += 3) { const x = a[0] + ((b[0] - a[0]) * (k + 0.5)) / n, z = a[1] + ((b[1] - a[1]) * (k + 0.5)) / n, g = new THREE.TorusGeometry(0.06, 0.012, 3, 7); g.rotateY(ry); g.translate(x, y + h - 0.12, z); acc.add('railBar', g); }
}
/** ống khói vữa với mũ ngói nhỏ (Địa Trung Hải / Tuscan) */
export function chimney(acc, x, y, z, h = 2.0, w = 0.9) {
  acc.add('wall', boxB(w, h, w * 0.75, x, y, z)); acc.add('trim', boxB(w + 0.14, 0.12, w * 0.75 + 0.14, x, y + h, z));
  for (const s of [-1, 1]) acc.add('wall', boxB(0.18, 0.42, w * 0.75, x + s * (w / 2 - 0.09), y + h + 0.12, z));
  hipRoof(acc, { W: w + 0.1, D: w * 0.75 + 0.1, yw: y + h + 0.6, over: 0.12, slope: 0.5, cx: x, cz: z, keys: { rib: null, soffit: null }, rafter: 0 });
}
