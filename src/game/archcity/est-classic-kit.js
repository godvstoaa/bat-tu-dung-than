// ============================================================================
//  BỘ CẤU KIỆN PHỤ CHO HỌ «CLASSIC» (est-classic.js) — Palladio · Lâu đài Pháp · Biệt thự Pháp.
//  Chỉ import bộ kiến trúc Pháp của tiên phủ (tienphu/arch/fr-kit.js) + vật liệu lặp theo mét (archcity/mats.js).
//  Mọi cấu kiện mặt đứng dựng trong KHUNG MẶT: u = x dọc mặt, y đứng, mặt tường tại z = 0, ngoài +z; đặt bằng put().
//  Khoá vật liệu (đừng dùng tiền tố stone*/base* cho phần thân — estatekit coi là NỀN, không mờ khi vào nhà):
//   nền: plinth · step · floor   thân: wall · rust · ash · trim · cap · col · tileRoof · tileRidge · slate · lead · chim · wood · shutter
//   chi tiết (bậc vừa bỏ — MID): carve · statue · louver · railBar · groove · potAFeu
// ============================================================================
import * as THREE from 'three';
import {
  Acc, boxB, cyl, beam, slabXY, lathe, gridSurface, ribAlong, V, put, pane, slabHoles, rectPts, archPts, opening,
  pilaster, entab, band, balus, keystone, refends, insetPoly, frMats, ORD,
} from '../tienphu/arch/fr-kit.js';
import { tiled, retex, consolidate } from './mats.js';

export const MID = /^(carve|statue|louver|railBar|groove|potAFeu|dentil|baluster|trophy)/;

// ---------------------------------------------------------------- vật liệu theo phong cách (+ biến thể biệt thự)
// [texture lặp, màu nhuộm]; texture: stone 427 px/m, plaster 256 px/m, marble 512 px/m, tile 512 px/m, brick 533 px/m, plank 512 px/m
const PAL = {
  // Palladio (Veneto): vữa trắng ngà trên gạch, chân tường đá khía rãnh, cột vữa trắng, ngói ống (coppi) đỏ nâu
  palladian: { wall: ['plaster', '#efe4c8'], rust: ['plaster', '#d9caa8'], trim: ['plaster', '#f7f3ea'], col: ['plaster', '#f4f0e6'], roof: ['tile', '#ad5d3c'], ridge: ['tile', '#8f4a30'], slate: ['brick', '#4a525c'], plinth: ['stone', '#cbbf9f'], floor: ['marble', '#e7e0d2'], door: ['plank', '#5a3a24'], shutter: ['plank', '#5a3a24'], chim: ['plaster', '#e8dcc2'] },
  // Loire (Chambord, Azay, Cheverny): đá tuffeau trắng kem xây khối, mái đá đen ardoise, chì, ống khói đá
  chateau: { wall: ['stone', '#f1ecdf'], rust: ['stone', '#e9e3d1'], trim: ['plaster', '#f4f0e5'], col: ['plaster', '#f2eee3'], roof: ['tile', '#ad5d3c'], ridge: ['tile', '#8f4a30'], slate: ['brick', '#39424d'], plinth: ['stone', '#bdb39a'], floor: ['marble', '#ddd5c5'], door: ['plank', '#4b3324'], shutter: ['plank', '#4b3324'], chim: ['stone', '#e9e2d0'] },
  // biệt thự Pháp (Hà Nội 1920–30, Đà Lạt, hôtel particulier Paris) — 3 biến thể màu vách / cửa chớp / mái
  phap: { wall: ['plaster', '#ead39f'], rust: ['plaster', '#e2c88e'], trim: ['plaster', '#f6f2e9'], col: ['plaster', '#f2eee4'], roof: ['tile', '#b0623f'], ridge: ['tile', '#8f4a30'], slate: ['brick', '#454f5b'], plinth: ['stone', '#b9b2a2'], floor: ['marble', '#e2ddd2'], door: ['plank', '#4a3020'], shutter: ['plank', '#3f6a4e'], chim: ['brick', '#a4553c'] },
  phap1: { wall: ['plaster', '#e6b965'], rust: ['plaster', '#ddb15e'], shutter: ['plank', '#2f5c43'], roof: ['tile', '#b4603c'] },
  phap2: { wall: ['plaster', '#ebe8de'], rust: ['stone', '#d9d4c6'], shutter: ['plank', '#58717f'], slate: ['brick', '#3d4652'], chim: ['plaster', '#e3e0d6'] },
};
const MCACHE = new Map();
/** { over (khoá → vật liệu lặp, cho retex), mats (đủ khoá cho Acc.build) } */
export function classicMats(id, variant = 0) {
  const k = `${id}:${variant}`;
  if (MCACHE.has(k)) return MCACHE.get(k);
  const p = { ...(PAL[id] || PAL.palladian), ...(id === 'phap' && variant ? PAL['phap' + variant] : {}) };
  const T = (n, o = {}) => tiled(p[n][0], p[n][1], { rough: 1, ...o });
  const D = THREE.DoubleSide;
  const over = {
    wall: T('wall'), rust: T('rust', { bump: 1.2 }), ash: T('rust', { bump: 1.1 }), trim: T('trim', { bump: 0.7 }), cap: T('trim', { bump: 0.6 }), carve: T('trim', { bump: 0.6 }),
    col: T('col', { rough: 0.8, bump: 0.4 }), statue: T('col', { rough: 0.7, bump: 0.3 }),
    tileRoof: T('roof', { rough: 0.95, side: D }), tileRidge: T('ridge', { rough: 0.95 }), slate: T('slate', { rough: 0.7, bump: 0.9, side: D }),
    plinth: T('plinth'), step: tiled(p.plinth[0], shade(p.plinth[1], 0.93), { rough: 1 }), floor: T('floor', { rough: 0.6, bump: 0.4 }),
    wood: T('door', { rough: 0.8 }), shutter: T('shutter', { rough: 0.8 }), louver: T('shutter', { rough: 0.8 }), chim: T('chim'),
  };
  const fr = frMats();
  const mats = { ...fr, ...over, inside: new THREE.MeshStandardMaterial({ color: '#5d564a', roughness: 1 }) };
  const r = { over, mats };
  MCACHE.set(k, r); return r;
}
function shade(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(f); return '#' + c.getHexString(); }
/** post cho estatekit: UV theo mét + vật liệu lặp → gộp theo ảnh texture */
export const finisher = (id, variant = 0) => (g) => { retex(g, classicMats(id, variant).over); return consolidate(g); };

/** đổi tên khoá mặc định của fr-kit (stone*, ptStone …) sang khoá thân — để estatekit không xếp vào NỀN */
const REKEY = { stone: 'ash', stoneDk: 'trim', stoneRef: 'rust', ptStone: 'trim', carrara: 'trim', amour: 'trim', ptRef: 'rust' };
export function sanitize(acc) {
  for (const [a, b] of Object.entries(REKEY)) { const L = acc.parts.get(a); if (!L) continue; acc.parts.delete(a); for (const g of L) acc.add(b, g); }
  return acc;
}
/** pháp tuyến phẳng (mái nhiều mặt — tránh bóng mềm vắt qua bờ góc) */
export function flat(g) { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('normal'); n.computeVertexNormals(); return n; }

// ---------------------------------------------------------------- nền + bậc
/** bậc thẳng từ mép z0 ra ngoài theo dấu sg (z), rộng w, cao H — mỗi bậc ≤ 0,165 m, mặt bậc 0,34 m; má bậc hai bên */
export function stairs(acc, cx, z0, sg, w, H, cheek = true) {
  const n = Math.max(1, Math.ceil(H / 0.165)), rise = H / n, run = 0.34;
  for (let i = 0; i < n; i++) { const top = rise * (i + 1), off = run * (n - i - 0.5); acc.add('step', boxB(w, top, run, cx, 0, z0 + sg * off)); acc.plat({ x: cx, z: z0 + sg * off, w, d: run + 0.02, top }); }
  if (cheek && H > 0.4) for (const e of [-1, 1]) {
    const L = n * run, x = cx + e * (w / 2 + 0.25);
    acc.add('plinth', slabXY([[0, 0], [L, 0], [L, 0.35], [0.2, H + 0.25], [0, H + 0.25]].map(([a, b]) => [a, b]), 0.5, 0, 0, 0).rotateY(-sg * Math.PI / 2).translate(x, 0, z0));
  }
  return n * run;
}
/** nền (w + 2,4) × (d + 2,4) cao b.plinth + gờ đầu nền + chân + sàn đá trong nhà + bậc giữa trước (sau nếu back) */
export function plinthBase(acc, b, o = {}) {
  const PW = b.w + 2.4, PD = b.d + 2.4, P = b.plinth, sw = o.sw ?? Math.min(6, b.w * 0.3);
  acc.add('plinth', boxB(PW, Math.max(0.05, P - 0.16), PD, 0, 0, 0));
  acc.add('step', boxB(PW + 0.16, 0.16, PD + 0.16, 0, P - 0.16, 0));
  acc.add('step', boxB(PW + 0.1, 0.24, PD + 0.1, 0, 0, 0));
  acc.add('floor', boxB(b.w - 0.7, 0.02, b.d - 0.7, 0, P, 0));
  acc.plat({ x: 0, z: 0, w: PW, d: PD, top: P });
  if (o.front !== false) stairs(acc, 0, PD / 2, 1, sw, P);
  if (b.back) stairs(acc, 0, -PD / 2, -1, Math.min(6, b.w * 0.3), P);
  return { PW, PD };
}

// ---------------------------------------------------------------- ô cửa
const holePoly = (h) => (h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h, 8) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h));
/**
 * Một ô cửa trong khung mặt (lỗ đã khoét trong tường): kính lùi, bậu, khung chỉ, + tuỳ chọn:
 * h = { kind: rect|arch, x, y0, w, h, door, hood: cornice|tri|seg|flat, apron, shutter, cross, keystone, balc: {dep, iron}, fw }
 */
export function windowC(acc, h) {
  const fw = h.fw ?? 0.16;
  opening(acc, h, 0, { reveal: 0.26, sillKey: 'trim', frame: h.noFrame ? null : { w: fw, d: 0.07, key: 'trim', sill: h.kind === 'rect' && !h.door }, key: h.kind === 'arch' && h.keystone ? { w: 0.42, h: 0.62, d: 0.15, k: 'trim' } : null });
  if (h.kind === 'rect' && h.keystone) keystone(acc, h.x, h.y0 + h.h + fw + 0.12, 0.07, 0.42, 0.5, 0.14, false, 'trim');
  if (h.cross && !h.door) { // croisée: đố đứng + đố ngang bằng đá (Phục Hưng Pháp)
    acc.add('trim', boxB(0.14, h.h, 0.14, h.x, h.y0, -0.19)); acc.add('trim', boxB(h.w, 0.14, 0.14, h.x, h.y0 + h.h * 0.63, -0.19));
  }
  if (h.door && h.leaves !== false) doorLeaves(acc, h);
  if (h.hood) hoodC(acc, h, fw);
  if (h.apron) { const W = h.w + 2 * fw; balus(acc, h.x - W / 2, h.x + W / 2, h.y0 - 0.12 - 0.8, 0.1, { h: 0.8, cut: 'tileBalus', key: 'trim', capKey: 'trim', deW: 0.2, dep: 0.18 }); }
  if (h.shutter) shutters(acc, h, fw);
  if (h.balc) balconyC(acc, h.x - h.w / 2 - fw - (h.balc.ext ?? 0.25), h.x + h.w / 2 + fw + (h.balc.ext ?? 0.25), h.y0 - (h.balc.dy ?? 0.12), h.balc.dep ?? 0.55, h.balc);
}
/** hai cánh cửa gỗ mở vào trong áp má cửa (khe giữa thông) + ô kính vòm / ô thoáng phía trên */
function doorLeaves(acc, h) {
  const hl = Math.min(h.kind === 'arch' ? h.h - h.w / 2 : h.h - 0.05, 3.0), lw = h.w / 2 - 0.05;
  for (const sx of [-1, 1]) {
    const x = h.x + sx * (h.w / 2 - 0.07), zc = -0.3 - lw / 2;
    acc.add('wood', boxB(0.07, hl, lw, x, h.y0, zc));
    acc.add('wood', boxB(0.11, hl * 0.32, lw * 0.66, x, h.y0 + 0.22, zc)); acc.add('wood', boxB(0.11, hl * 0.42, lw * 0.66, x, h.y0 + hl * 0.48, zc));
  }
  if (h.kind === 'arch') {
    const r = h.w / 2, ys = h.y0 + h.h - r, pts = [];
    for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; pts.push([h.x + r * Math.cos(a), ys + r * Math.sin(a)]); }
    acc.add('tileGlass', pane(pts, -0.24)); acc.add('trim', boxB(h.w, 0.14, 0.2, h.x, ys - 0.14, -0.24));
    for (const a of [0.55, 1.57, 2.59]) acc.add('trim', beam(V(h.x, ys, -0.2), V(h.x + Math.cos(a) * r, ys + Math.sin(a) * r, -0.2), 0.035, 0.04)); // nan quạt
  } else if (h.h > 3.05) {
    acc.add('tileGlass', pane(rectPts(h.x - h.w / 2, h.y0 + 3.06, h.x + h.w / 2, h.y0 + h.h), -0.24)); acc.add('trim', boxB(h.w, 0.14, 0.2, h.x, h.y0 + 2.94, -0.24));
  }
}
/** mũ cửa: diềm + gờ (cornice) trên 2 công-xon; tri = trán tam giác, seg = trán cung, flat = gờ không công-xon */
export function hoodC(acc, h, fw = 0.16) {
  const W = h.w + 2 * fw + 0.16, top = h.y0 + h.h + fw, x = h.x;
  acc.add('trim', boxB(W, 0.22, 0.1, x, top, 0.05));
  acc.add('trim', boxB(W + 0.26, 0.16, 0.32, x, top + 0.22, 0.16));
  if (h.hood !== 'flat') for (const sx of [-1, 1]) acc.add('carve', slabXY([[0, 0], [0.24, 0.05], [0.24, 0.55], [0.06, 0.55], [0, 0.3]], 0.15, 0, 0, 0).rotateY(-Math.PI / 2).translate(x + sx * (W / 2 + 0.02), top - 0.33, 0));
  const a = W / 2 + 0.14, y = top + 0.38;
  if (h.hood === 'tri') { const hh = a * 0.4; acc.add('trim', slabXY([[-a, 0], [a, 0], [0, hh]], 0.32, x, y, 0.16)); acc.add('wall', slabXY([[-a + 0.3, 0.02], [a - 0.3, 0.02], [0, hh - 0.18]], 0.06, x, y, 0.33)); }
  if (h.hood === 'seg') {
    const s = a * 0.34, R = (a * a + s * s) / (2 * s), cy = s - R, f0 = Math.asin(a / R), pts = [];
    for (let i = 0; i <= 10; i++) { const f = -f0 + (2 * f0 * i) / 10; pts.push([R * Math.sin(f), cy + R * Math.cos(f)]); }
    acc.add('trim', slabXY([[a, 0], [-a, 0], ...pts], 0.32, x, y, 0.16));
  }
}
/** cửa chớp (persiennes) mở áp tường hai bên, lá sách nghiêng */
function shutters(acc, h, fw) {
  const lw = h.w / 2 + 0.03, hh = h.kind === 'arch' ? h.h - h.w / 2 + 0.2 : h.h;
  for (const sx of [-1, 1]) {
    const cx = h.x + sx * (h.w / 2 + fw + lw / 2 + 0.03);
    acc.add('shutter', boxB(lw, hh, 0.04, cx, h.y0, 0.03));
    for (const e of [-1, 1]) acc.add('shutter', boxB(0.07, hh, 0.07, cx + e * (lw / 2 - 0.035), h.y0, 0.05));
    acc.add('shutter', boxB(lw - 0.1, 0.08, 0.07, cx, h.y0 + hh * 0.48, 0.05));
    for (let y = h.y0 + 0.14; y < h.y0 + hh - 0.12; y += 0.16) { const g = new THREE.PlaneGeometry(lw - 0.14, 0.085); g.rotateX(-0.75); g.translate(cx, y, 0.075); acc.add('louver', g); } // lá sách: tấm nghiêng (2 tam giác)
  }
}
/** ban công: tấm đá trên công-xon + lan can sắt rèn (song + vòng) hoặc con tiện đá (iron: false) */
export function balconyC(acc, x0, x1, y, dep, o = {}) {
  const xm = (x0 + x1) / 2, L = x1 - x0;
  acc.add('trim', boxB(L + 0.16, 0.16, dep + 0.02, xm, y - 0.16, dep / 2)); acc.add('trim', boxB(L + 0.28, 0.08, 0.12, xm, y - 0.08, dep + 0.03));
  const nc = Math.max(2, Math.round(L / 1.3) + 1);
  for (let i = 0; i < nc; i++) { const x = x0 + 0.12 + ((L - 0.24) * i) / (nc - 1); acc.add('carve', slabXY([[0, 0], [dep * 0.92, 0], [dep * 0.92, -0.12], [0.18, -0.55], [0, -0.55]], 0.14, 0, 0, 0).rotateY(-Math.PI / 2).translate(x, y - 0.16, 0)); }
  if (o.iron === false) { balus(acc, x0, x1, y, dep - 0.2, { h: 0.95, cut: 'tileBalus', key: 'trim', capKey: 'trim', deW: 0.3, dep: 0.26, des: [xm] }); return; }
  const zf = dep - 0.05, H = 0.98;
  for (const yy of [y + 0.06, y + H]) { acc.add('iron', boxB(L, 0.05, 0.06, xm, yy, zf)); for (const x of [x0 + 0.03, x1 - 0.03]) acc.add('iron', boxB(0.06, 0.05, dep, x, yy, dep / 2)); }
  acc.add('iron', boxB(L, 0.04, 0.04, xm, y + 0.62, zf));
  for (let x = x0 + 0.1; x < x1 - 0.05; x += 0.12) acc.add('railBar', boxB(0.022, H - 0.06, 0.022, x, y + 0.08, zf));
  for (const x of [x0 + 0.03, x1 - 0.03]) for (let z = 0.12; z < dep - 0.08; z += 0.12) acc.add('railBar', boxB(0.022, H - 0.06, 0.022, x, y + 0.08, z));
  for (let x = x0 + 0.35; x < x1 - 0.2; x += 0.48) { const t = new THREE.TorusGeometry(0.13, 0.014, 4, 12); t.translate(x, y + 0.36, zf); acc.add('railBar', t); }
}
/** đá góc (chaînes d'angle) so le dài / ngắn hai đầu mặt */
export function quoins(acc, L, y0, y1, key = 'ash', proj = 0.06, wl = 1.0, ws = 0.6) {
  let i = 0;
  for (let y = y0; y + 0.12 < y1; y += 0.48, i++) { const hh = Math.min(0.42, y1 - y - 0.06); for (const sx of [-1, 1]) { const w = i % 2 ? ws : wl; acc.add(key, boxB(w, hh, proj, sx * (L / 2 - w / 2), y + 0.03, proj / 2)); } }
}

// ---------------------------------------------------------------- MẶT ĐỨNG
/**
 * Mặt dài L: tường có lỗ + đá khía rãnh tầng trệt + ô cửa + chỉ tầng + đá góc + pilaster lưới + entablature đỉnh.
 * F = { P, top, t, wallKey, storeys: [{ y0, h }], xs: [...], win(s, i, x) → spec|null, rust: { to }, bands: [[y, h, proj]],
 *       quoins: { to, key }, pil: { xs, ords[], W, proj }, ent: { ord, H, mod } }
 */
export function facade(acc, L, F) {
  const t = F.t ?? 0.45, holes = [];
  F.storeys.forEach((st, s) => F.xs.forEach((x, i) => { const w = F.win(s, i, x); if (w) holes.push({ kind: 'rect', ...w, x: w.x ?? x, y0: st.y0 + (w.dy || 0), glass: 'tileGlass' }); }));
  for (const x of F.extraHoles || []) holes.push(x);
  acc.add(F.wallKey || 'wall', slabHoles(rectPts(-L / 2, F.P, L / 2, F.top), holes.map(holePoly), 0, t));
  if (F.rust) refends(acc, -L / 2, L / 2, F.P + 0.02, F.rust.to, 0, holes.filter((h) => h.y0 < F.rust.to), { course: F.rust.course || 0.56, proj: 0.06, key: F.rust.key || 'rust', vous: 0.42, nv: 7 });
  for (const h of holes) windowC(acc, h);
  for (const [y, hh, pr] of F.bands || []) band(acc, -L / 2 - 0.04, L / 2 + 0.04, y, hh, 0, pr, 'trim', t);
  if (F.quoins) quoins(acc, L, F.quoins.from ?? F.P, F.quoins.to, F.quoins.key || 'ash');
  if (F.pil) F.storeys.forEach((st, s) => { const ord = F.pil.ords[s] || 'doric', H = st.h - (F.pil.gap ?? 0.45) - (s === F.storeys.length - 1 && F.ent ? F.ent.H : 0); if (H < 1) return; for (const x of F.pil.xs) pilaster(acc, ord, x, st.y0 + 0.02, 0, H, F.pil.W, F.pil.proj ?? 0.1, { key: 'trim', capKey: 'cap', light: true }); });
  if (F.ent) { // entablature dọc mặt + khối góc của gờ (phần vươn) để hai mặt gặp nhau kín ở góc nhà
    const H = F.ent.H, Cn = H * ORD[F.ent.ord].parts[2], ext = Cn * 1.08;
    entab(acc, F.ent.ord, -L / 2, L / 2, F.top - H, 0, H, { key: 'trim', capKey: 'trim', mod: F.ent.mod, dep: t + 0.1 });
    for (const sx of [-1, 1]) { acc.add('trim', boxB(ext, Cn * 0.55, ext, sx * (L / 2 + ext / 2), F.top - Cn * 0.55, ext / 2)); acc.add('trim', boxB(ext * 0.55, Cn * 0.3, ext * 0.55, sx * (L / 2 + ext * 0.275), F.top - Cn * 0.85, ext * 0.275)); }
  }
  return holes;
}
/** dựng 4 mặt quanh chu vi w × d: face(which, L) → F; which = front | back | side */
export function fourFaces(acc, b, face) {
  const hw = b.w / 2, hd = b.d / 2;
  for (const [L, x, z, ry, which] of [[b.w, 0, hd, 0, 'front'], [b.w, 0, -hd, Math.PI, 'back'], [b.d, hw, 0, Math.PI / 2, 'side'], [b.d, -hw, 0, -Math.PI / 2, 'side']]) {
    const f = new Acc(); facade(f, L, face(which, L, Math.sign(x || 1))); put(acc, f, x, 0, z, ry);
  }
}
/** tâm n ô đều trên đoạn [a, b] */
export const spread = (a, b, n) => Array.from({ length: n }, (_, i) => a + ((b - a) * (i + 0.5)) / n);
/** chia mặt L thành n ô (n lẻ khi odd), chừa trụ góc e mỗi đầu, nhịp ≈ target */
export function bayXs(L, target, e, odd = true) { let n = Math.max(1, Math.round((L - 2 * e) / target)); if (odd && n % 2 === 0) n += (L - 2 * e) / n > target ? 1 : -1; n = Math.max(1, n); return spread(-L / 2 + e, L / 2 - e, n); }

// ---------------------------------------------------------------- MÁI
/** mái co vào từ đa giác mép mái (mặt bằng [[x,z]…]): prof [[co vào, cao]…] — hip / mansard / chóp; pháp tuyến phẳng.
 *  Trả { top, ring(d) → điểm vòng ở độ co d } */
export function roofC(acc, poly, y, prof, key, capKey, o = {}) {
  const rows = prof.map(([d, h]) => insetPoly(poly, d).map(([x, z]) => V(x, y + h, z))); rows.forEach((r) => r.reverse());
  acc.add(key, flat(gridSurface(rows, true)));
  const last = insetPoly(poly, prof[prof.length - 1][0]), yt = y + prof[prof.length - 1][1];
  const cap = new THREE.ShapeGeometry(new THREE.Shape(last.map(([x, z]) => new THREE.Vector2(x, -z)))); cap.rotateX(-Math.PI / 2); cap.translate(0, yt + 0.01, 0); acc.add(o.topKey || capKey, cap);
  for (let i = 0; i < poly.length; i++) acc.add(capKey, ribAlong(prof.map(([d, h]) => { const q = insetPoly(poly, d)[i]; return V(q[0], y + h + 0.06, q[1]); }), o.rib ?? 0.16, 0.12));
  // bờ nóc (cạnh dài nhất của đa giác đỉnh)
  if (last.length === 4) { const [a, b2, c] = last, l1 = Math.hypot(b2[0] - a[0], b2[1] - a[1]), l2 = Math.hypot(c[0] - b2[0], c[1] - b2[1]); const p = l1 > l2 ? [a, b2, c, last[3]] : [b2, c, last[3], a]; const m1 = [(p[0][0] + p[3][0]) / 2, (p[0][1] + p[3][1]) / 2], m2 = [(p[1][0] + p[2][0]) / 2, (p[1][1] + p[2][1]) / 2]; acc.add(capKey, ribAlong([V(m1[0], yt + 0.08, m1[1]), V(m2[0], yt + 0.08, m2[1])], o.ridgeW ?? 0.3, 0.2)); }
  // diềm mái (độ dày mép hiên)
  acc.add(o.eaveKey || capKey, ribAlong([...poly, poly[0]].map(([x, z]) => V(x, y - 0.06, z)), 0.2, 0.16));
  for (let k = 1; k < prof.length - 1; k++) if (o.breakRib) acc.add(capKey, ribAlong([...insetPoly(poly, prof[k][0]), insetPoly(poly, prof[k][0])[0]].map(([x, z]) => V(x, y + prof[k][1] + 0.04, z)), 0.18, 0.14)); // bờ gãy mansard (brisis)
  return { top: yt, at: (d) => insetPoly(poly, d) };
}
export const rectPoly = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];

/** khối tròn xoay mặt vuông / chữ nhật (dôme à l'impériale, mái chóp vuông): biên dạng prof [[r, y]] theo NỬA CẠNH; ax, az = nửa cạnh */
export function squareLathe(prof, x, y, z, ax, az) {
  const g = new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(Math.max(0.001, r * Math.SQRT2), h)), 4); g.rotateY(Math.PI / 4); g.scale(1, 1, az / ax); g.translate(x, y, z);
  return flat(g);
}
/** chóp nhọn chì + quả cầu vàng (épi de faîtage) */
export function finial(acc, x, y, z, h = 1.6) {
  acc.add('lead', lathe([[0.001, 0], [0.22, 0], [0.12, 0.25], [0.2, 0.42], [0.06, 0.6], [0.04, h - 0.2], [0.001, h]], x, y, z, 8));
  acc.add('gilt', new THREE.SphereGeometry(0.13, 8, 6).translate(x, y + h * 0.62, z));
}
/** ống khói xây: thân + gờ mũ + ống gốm */
export function chimneyC(acc, x, y0, z, w, d, h, o = {}) {
  const k = o.key || 'chim';
  acc.add(k, boxB(w, h, d, x, y0, z));
  acc.add('trim', boxB(w + 0.2, 0.14, d + 0.2, x, y0 + h - 0.5, z)); acc.add('trim', boxB(w + 0.3, 0.2, d + 0.3, x, y0 + h, z));
  if (o.panel) for (const s of [-1, 1]) acc.add(k, boxB(w * 0.62, h * 0.5, 0.05, x, y0 + h * 0.35, z + s * (d / 2 + 0.02)));
  const n = Math.max(1, Math.round(w / 0.55));
  for (let i = 0; i < n; i++) acc.add('chim', cyl(0.13, 0.1, 0.5, x - w / 2 + (w * (i + 0.5)) / n, y0 + h + 0.2, z, 7));
}

// ---------------------------------------------------------------- cửa sổ mái
/** lucarne Phục Hưng (Chambord / Blois): mặt đá, cửa croisée, pilaster, gờ, trán tam giác có chóp nhọn; mái đá đen hai dốc phía sau. Đáy (x, y), mặt hướng ry */
export function lucarneRen(acc, x, y, z, ry, w = 1.7, h = 2.6, back = 2.4) {
  const t = new Acc(), wi = w - 0.62, hi = h - 0.55;
  t.add('ash', slabHoles(rectPts(-w / 2, 0, w / 2, h), [rectPts(-wi / 2, 0.32, wi / 2, 0.32 + hi)], 0, 0.3));
  t.add('tileGlass', pane(rectPts(-wi / 2, 0.32, wi / 2, 0.32 + hi), -0.2));
  t.add('trim', boxB(0.12, hi, 0.12, 0, 0.32, -0.12)); t.add('trim', boxB(wi, 0.12, 0.12, 0, 0.32 + hi * 0.62, -0.12));
  for (const s of [-1, 1]) t.add('trim', boxB(0.24, h, 0.12, s * (w / 2 - 0.12), 0, 0.06));
  t.add('trim', boxB(w + 0.3, 0.16, 0.3, 0, h, 0.04)); t.add('trim', boxB(w + 0.42, 0.12, 0.38, 0, h + 0.16, 0.06));
  const gh = w * 0.7, g0 = h + 0.28;
  t.add('ash', slabXY([[-w / 2, 0], [w / 2, 0], [0, gh]], 0.3, 0, g0, -0.15));
  for (const s of [-1, 1]) t.add('trim', beam(V(s * (w / 2 + 0.12), g0, 0.02), V(0, g0 + gh + 0.12, 0.02), 0.34, 0.14));
  for (const s of [-1, 1]) { t.add('carve', lathe([[0.001, 0], [0.12, 0], [0.12, 0.3], [0.05, 0.5], [0.07, 0.7], [0.001, 1.0]], s * (w / 2 + 0.08), g0, 0.04, 6)); }
  t.add('carve', lathe([[0.001, 0], [0.1, 0], [0.05, 0.25], [0.08, 0.45], [0.001, 0.9]], 0, g0 + gh + 0.1, 0.02, 6));
  cartoucheSmall(t, 0, g0 + gh * 0.36, 0.0, w * 0.26);
  // mái hai dốc phía sau + má bên
  const yr = g0 + gh + 0.05;
  for (const s of [-1, 1]) t.add('slate', flat(gridSurface([[V(s * (w / 2 + 0.25), g0 - 0.05, -0.05), V(0, yr, -0.05)], [V(s * (w / 2 + 0.25), g0 - 0.05, -back), V(0, yr, -back)]])));
  for (const s of [-1, 1]) t.add('slate', boxB(0.1, g0, back - 0.3, s * (w / 2 - 0.05), 0, -back / 2 - 0.15));
  t.add('lead', ribAlong([V(0, yr + 0.05, -0.05), V(0, yr + 0.05, -back)], 0.12, 0.1));
  put(acc, t, x, y, z, ry);
}
function cartoucheSmall(acc, x, y, z, s) { const pts = []; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; pts.push([Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.62]); } acc.add('carve', slabXY(pts, 0.08, x, y, z + 0.04)); }
/** lucarne mái Mansard (Paris / Hà Nội): khung vữa, cửa vòm hoặc mắt bò (oeil-de-bœuf), mũ chì cong / tam giác */
export function lucarneMan(acc, x, y, z, ry, w = 1.3, h = 2.0, kind = 'arch', back = 1.8) {
  const t = new Acc();
  if (kind === 'oeil') {
    const r = w * 0.42, yc = h * 0.5;
    const ring = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ring.push([Math.cos(a) * r, yc + Math.sin(a) * r]); }
    t.add('trim', slabHoles(rectPts(-w / 2, 0, w / 2, h), [ring], 0, 0.25)); t.add('tileGlass', pane(ring, -0.16));
    const tor = new THREE.TorusGeometry(r + 0.07, 0.08, 4, 16); tor.translate(0, yc, 0.04); t.add('trim', tor);
    t.add('lead', slabXY(Array.from({ length: 11 }, (_, i) => { const a = (i / 10) * Math.PI; return [Math.cos(a) * (w / 2 + 0.15), Math.sin(a) * w * 0.32]; }), back, 0, h - 0.02, -back / 2 + 0.12));
  } else {
    const wi = w - 0.44, hi = h - 0.42, holeP = kind === 'arch' ? archPts(0, 0.26, wi, hi, 8) : rectPts(-wi / 2, 0.26, wi / 2, 0.26 + hi);
    t.add('trim', slabHoles(rectPts(-w / 2, 0, w / 2, h), [holeP], 0, 0.25)); t.add('tileGlass', pane(holeP, -0.16));
    t.add('trim', boxB(0.08, hi, 0.08, 0, 0.26, -0.12));
    for (const s of [-1, 1]) t.add('trim', boxB(0.16, h, 0.1, s * (w / 2 - 0.08), 0, 0.05));
    t.add('trim', boxB(w + 0.24, 0.14, 0.3, 0, h, 0.05));
    if (kind === 'tri') { const a = w / 2 + 0.18; t.add('trim', slabXY([[-a, 0], [a, 0], [0, a * 0.55]], 0.3, 0, h + 0.14, 0.05)); for (const s of [-1, 1]) t.add('slate', flat(gridSurface([[V(s * a, h + 0.14, -0.1), V(0, h + 0.14 + a * 0.55, -0.1)], [V(s * a, h + 0.14, -back), V(0, h + 0.14 + a * 0.55, -back)]]))); }
    else t.add('lead', slabXY(Array.from({ length: 11 }, (_, i) => { const a = (i / 10) * Math.PI; return [Math.cos(a) * (w / 2 + 0.12), Math.sin(a) * w * 0.3]; }), back, 0, h + 0.12, -back / 2 + 0.15));
  }
  for (const s of [-1, 1]) t.add('slate', boxB(0.08, h, back - 0.2, s * (w / 2 - 0.04), 0, -back / 2 - 0.1));
  put(acc, t, x, y, z, ry);
}

// ---------------------------------------------------------------- tháp nhỏ treo góc (tourelle en encorbellement)
/** tourelle tròn bán kính r, tâm (x, z): công-xon hình nón (cul-de-lampe) y0 → y1, thân tới yTop, chỉ vòng theo tầng, cửa sổ nhỏ hướng ang,
 *  mái nón đá đen cao roofH + chóp chì */
export function turret(acc, x, z, r, y0, y1, yTop, o = {}) {
  const seg = 16;
  acc.add('ash', lathe([[0.001, 0], [0.25, 0], [0.28, 0.25], [r * 0.45, (y1 - y0) * 0.45], [r * 0.82, (y1 - y0) * 0.78], [r + 0.08, y1 - y0 - 0.05], [r + 0.08, y1 - y0], [0.001, y1 - y0]], x, y0, z, seg));
  for (let k = 0; k < 3; k++) acc.add('trim', lathe([[r * (0.4 + 0.2 * k), 0], [r * (0.42 + 0.2 * k) + 0.06, 0.06], [r * (0.4 + 0.2 * k), 0.14]], x, y0 + (y1 - y0) * (0.35 + 0.22 * k), z, seg));
  acc.add('ash', lathe([[r, 0], [r, yTop - y1]], x, y1, z, seg));
  for (const yy of o.rings || []) acc.add('trim', lathe([[r - 0.05, 0], [r + 0.1, 0.02], [r + 0.1, 0.18], [r - 0.05, 0.2]], x, yy, z, seg));
  acc.add('trim', lathe([[r - 0.05, 0], [r + 0.16, 0.08], [r + 0.22, 0.36], [r - 0.05, 0.42]], x, yTop - 0.42, z, seg)); // gờ đỉnh (mâchicoulis giả)
  for (const [yy, a, ww, hh] of o.wins || []) { const t = new Acc(); t.add('tileGlass', pane(rectPts(-ww / 2, 0, ww / 2, hh), 0.02)); t.add('trim', slabHoles(rectPts(-ww / 2 - 0.16, -0.16, ww / 2 + 0.16, hh + 0.16), [rectPts(-ww / 2, 0, ww / 2, hh)], 0.12, 0.16)); t.add('trim', boxB(0.1, hh, 0.1, 0, 0, 0.04)); t.add('trim', boxB(ww, 0.1, 0.1, 0, hh * 0.62, 0.04)); put(acc, t, x + Math.sin(a) * (r - 0.04), yy, z + Math.cos(a) * (r - 0.04), a); }
  const H = o.roofH ?? r * 2.6;
  acc.add('slate', lathe([[r + 0.32, 0], [r + 0.22, 0.25], [r * 0.7, H * 0.32], [r * 0.32, H * 0.72], [0.05, H]], x, yTop, z, seg));
  acc.add('lead', lathe([[r + 0.34, 0], [r + 0.34, 0.08], [r + 0.24, 0.12]], x, yTop - 0.04, z, seg));
  finial(acc, x, yTop + H - 0.1, z, o.fin ?? 1.6);
  return { top: yTop + H + (o.fin ?? 1.6) };
}

// ---------------------------------------------------------------- TRÁN TƯỜNG (fronton) + mái che phía sau
/** trán tam giác trên đỉnh entablature: x0..x1 (đã tính vươn gờ), chân y, mặt trước zf, dốc pitch; mái (roofKey) kéo về zBack */
export function pediment(acc, x0, x1, y, zf, pitch, zBack, roofKey = 'tileRoof', o = {}) {
  const a = (x1 - x0) / 2, xm = (x0 + x1) / 2, H = a * pitch;
  acc.add(o.tympKey || 'wall', slabXY([[-a + 0.5, 0], [a - 0.5, 0], [0, H - 0.4]], 0.4, xm, y, zf - 0.5));
  acc.add('trim', boxB(2 * a - 0.2, 0.2, 0.9, xm, y, zf - 0.35));
  for (const s of [-1, 1]) {
    acc.add('trim', beam(V(xm + s * a, y + 0.05, zf - 0.32), V(xm, y + H + 0.1, zf - 0.32), 0.95, 0.42));
    acc.add('trim', beam(V(xm + s * (a + 0.05), y + 0.24, zf - 0.28), V(xm, y + H + 0.3, zf - 0.28), 0.95, 0.14));
    acc.add(roofKey, flat(gridSurface([[V(xm + s * (a + 0.12), y + 0.38, zf + 0.15), V(xm, y + H + 0.46, zf + 0.15)], [V(xm + s * (a + 0.12), y + 0.38, zBack), V(xm, y + H + 0.46, zBack)]])));
  }
  if (roofKey === 'tileRoof') acc.add('tileRidge', ribAlong([V(xm, y + H + 0.52, zf + 0.2), V(xm, y + H + 0.52, zBack)], 0.3, 0.2));
  if (o.oculus) { const t = new THREE.TorusGeometry(o.oculus, 0.1, 4, 16); t.translate(xm, y + H * 0.42, zf - 0.28); acc.add('trim', t); acc.add('tileGlass', new THREE.CircleGeometry(o.oculus, 16).translate(xm, y + H * 0.42, zf - 0.3)); }
  return { top: y + H + 0.5, H };
}
/** khối tròn xoay có pháp tuyến phẳng theo mặt (vòm nhiều múi) */
export const latheF = (prof, x, y, z, seg) => flat(lathe(prof, x, y, z, seg));
export { holePoly };
