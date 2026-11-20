// ============================================================================
//  BỘ CÔNG CỤ RIÊNG CHO HỌ HIỆN ĐẠI (est-modern.js) — tầng kính / tường có ô mở sâu, tấm sàn công-xôn, tường chắn mái,
//  lan can kính, lam gỗ đứng, bục nền + bậc. Dựng trên các hàm của bộ Art Deco tiên phủ (tienphu/arch/ad-kit.js: face,
//  fbox, wallOpen, fillOpening, steps — CHỈ import) + vật liệu lặp theo mét (archcity/mats.js) + 2 texture canvas riêng:
//  kính phản chiếu trời (dải chuyển trời → đất theo từng ô kính) và bê tông trần Ando (tấm 1,8 × 0,9 m, 6 lỗ ty).
//  Khung cục bộ: gốc tâm đáy, mặt tiền +z. Mặt F của ad-kit: u chạy trái → phải nhìn từ ngoài, w > 0 ra ngoài.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB } from '../tienphu/arch/kit.js';
import { face, fbox, wallOpen, fillOpening, steps as adSteps, prism, cylY } from '../tienphu/arch/ad-kit.js';
import { tiled, retex, consolidate } from './mats.js';

export { Acc, box, boxB, face, fbox, prism, cylY };

// ---------------------------------------------------------------- texture canvas (trình duyệt; node kiểm số dùng canvas giả)
function canvasTex(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext && c.getContext('2d'); if (g) draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/** kính: UV hộp mặc định (0–1 mỗi ô kính) → trên sáng (phản chiếu trời), dưới tối (phản chiếu đất / cây), vệt sáng chéo mờ */
function glassTex([sky, mid, low], seed = 3) {
  return canvasTex(256, 512, (g, w, h) => {
    const r = rng(seed), gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, sky); gr.addColorStop(0.42, mid); gr.addColorStop(0.6, low); gr.addColorStop(1, low);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) { // mây phản chiếu ở nửa trên
      g.fillStyle = `rgba(255,255,255,${0.05 + r() * 0.08})`; g.beginPath(); g.ellipse(r() * w, r() * h * 0.4, 30 + r() * 70, 8 + r() * 14, 0, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = 'rgba(20,30,28,0.25)'; for (let i = 0; i < 14; i++) { const x = r() * w, ww = 10 + r() * 40, hh = h * (0.08 + r() * 0.12); g.fillRect(x, h * 0.58 - hh, ww, hh); } // bóng cây xa
    g.save(); g.globalAlpha = 0.1; g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(w * 0.15, 0); g.lineTo(w * 0.45, 0); g.lineTo(w * 0.05, h); g.lineTo(-w * 0.25, h); g.fill(); g.restore();
  });
}
/** bê tông trần kiểu Tadao Ando: 1 tile = 1 tấm cốp pha 1,8 × 0,9 m (1024 × 512 px ≈ 569 px/m), mạch tấm, 6 lỗ ty bước 0,6 m */
function concTex() {
  return canvasTex(1024, 512, (g, w, h) => {
    const r = rng(17); g.fillStyle = '#bdbab3'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { const v = Math.floor(170 + r() * 40); g.fillStyle = `rgba(${v},${v - 2},${v - 6},0.10)`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 90, 10 + r() * 50, r() * 3, 0, Math.PI * 2); g.fill(); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(60,60,58,${0.08 + r() * 0.15})`; g.fillRect(r() * w, r() * h, 1.5, 1.5); } // rỗ khí
    g.fillStyle = 'rgba(70,70,68,0.55)'; g.fillRect(0, 0, w, 3); g.fillRect(0, 0, 3, h);                       // mạch tấm
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, 3, w, 2); g.fillRect(3, 0, 2, h);
    for (const fx of [1 / 6, 3 / 6, 5 / 6]) for (const fy of [0.25, 0.75]) {                                    // lỗ ty Ø ≈ 3 cm
      const x = fx * w, y = fy * h; g.fillStyle = '#8e8b85'; g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#5f5d59'; g.beginPath(); g.arc(x + 1, y + 1, 6.5, 0, Math.PI * 2); g.fill();
    }
  });
}

/** vữa trát trắng mịn (1 tile = 2 × 2 m, 512 px → 256 px/m): nền sáng albedo cao, đốm cát, vệt bay mờ — để khối trắng đọc là TRẮNG */
function renderTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const r = rng(29); g.fillStyle = '#f4f3ef'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(${200 + r() * 30},${198 + r() * 30},${190 + r() * 30},0.07)`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 60, 8 + r() * 30, r() * 3, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 3; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(r() * w, r() * h, 20 + r() * 50, r() * 6, r() * 6 + 1.2); g.stroke(); }
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(120,118,110,${0.06 + r() * 0.1})`; g.fillRect(r() * w, r() * h, 1.2, 1.2); }
  });
}
/** vải rèm sợi lanh: nếp đứng (UV hộp 0–1 theo tấm rèm → 9 nếp mỗi tấm) */
function curtainTex() {
  return canvasTex(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0), n = 9;
    for (let i = 0; i <= n * 2; i++) gr.addColorStop(i / (n * 2), i % 2 ? '#d9d2c4' : '#f6f2ea');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(41); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(150,140,120,${r() * 0.08})`; g.fillRect(r() * w, r() * h, 1, 3); }
  });
}
const flatTex = (c) => canvasTex(8, 8, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); });

// ---------------------------------------------------------------- vật liệu theo bảng màu phong cách
const CACHE = new Map(), TEXC = {};
const rep = (t, u, v) => { if (t) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(u, v); } return t; };
/**
 * pal: { [khoá]: [loại texture lặp, màu] | THREE.Material } + glass: [trời, giữa, đất], frame, rail, metal (màu).
 * Trả { mats (đủ mọi khoá cho Acc.build), over (khoá texture lặp → retex đổi UV theo mét), post }.
 */
export function styleMats(id, pal) {
  if (CACHE.has(id)) return CACHE.get(id);
  const over = {};
  for (const [k, v] of Object.entries(pal)) {
    if (Array.isArray(v) && typeof v[0] === 'string' && ['plaster', 'stone', 'plank', 'marble', 'brick', 'lacquer', 'tile'].includes(v[0])) over[k] = tiled(v[0], v[1], v[2] || {});
    else if (v === 'conc') over[k] = new THREE.MeshStandardMaterial({ map: TEXC.conc ||= rep(concTex(), 1 / 1.8, 1 / 0.9), color: '#ffffff', roughness: 0.92 });
    else if (Array.isArray(v) && v[0] === 'render') over[k] = new THREE.MeshStandardMaterial({ map: TEXC.render ||= rep(renderTex(), 0.5, 0.5), color: v[1], roughness: 0.88 });
  }
  const gt = glassTex(pal.glass || ['#d6e4ec', '#8ea7b6', '#3a4851'], id.length * 7);
  const glass = new THREE.MeshStandardMaterial({ map: gt, color: '#ffffff', roughness: 0.1, metalness: 0.2, emissive: '#ffffff', emissiveMap: gt, emissiveIntensity: 0.2, transparent: true, opacity: 0.6 });
  const metal = (c, r = 0.45) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.55 });
  const glassRail = new THREE.MeshStandardMaterial({ map: TEXC.gr ||= flatTex('#e4f0f2'), color: '#ffffff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.32, depthWrite: false });
  const curtain = new THREE.MeshStandardMaterial({ map: TEXC.cu ||= curtainTex(), color: pal.curtain || '#ffffff', roughness: 0.95 });
  const mats = { ...over, glass, glassRail, curtain, frame: metal(pal.frame || '#2a2d31'), fin: metal(pal.frame || '#2a2d31'), railBar: metal(pal.rail || '#2a2d31', 0.35), metal: metal(pal.metal || '#2b2e33', 0.5), chrome: metal('#cfd3d6', 0.2) };
  const out = { mats, over, post: (g) => consolidate(retex(g, over)) };
  CACHE.set(id, out); return out;
}

// ---------------------------------------------------------------- mặt & ô mở
/** bốn mặt của hộp x0..x1 × z0..z1 (f = +z, r = +x, b = −z, l = −x) */
export const F4 = (x0, x1, z0, z1) => ({ f: face(x0, z1, x1, z1, 0, 1), r: face(x1, z1, x1, z0, 1, 0), b: face(x1, z0, x0, z0, 0, -1), l: face(x0, z0, x0, z1, -1, 0) });
/** vách kính suốt (curtain wall) trên đoạn mar..L−mar của mặt dài L: đố đứng bước m, đố ngang tr[], cửa đi giữa (door = { w, h, dc }) */
export const cw = (L, y0, y1, { m = 1.6, tr = [], door = null, mar = 0, open = false } = {}) => ({ u0: mar, u1: L - mar, y0, y1, kind: 'grid', m, tr, sill: false, open, door: door ? { c: L / 2 + (door.dc || 0), w: door.w, h: door.h } : undefined });
/** cửa sổ đục tại tâm c (u), rộng w */
export const win = (c, w, y0, y1, o = {}) => ({ u0: c - w / 2, u1: c + w / 2, y0, y1, kind: 'band', m: 1.4, tr: [], ...o });
/** cửa băng (fenêtre en longueur) từ mar tới L − mar */
export const rib = (L, y0, y1, { mar = 1.0, m = 1.5 } = {}) => ({ u0: mar, u1: L - mar, y0, y1, kind: 'band', m, tr: [] });

/**
 * Một tầng tường trên chu vi hộp: ops = { f, r, b, l: [ô mở] | 'none' (không dựng mặt đó) } — tường dày t (vào trong), kính lùi.
 * fin > 0: gân đố nhô ra ngoài (kiểu Seagram) tại mỗi đố đứng của vách kính. fk: khoá khung (frame | wood …).
 */
export function storey(acc, [x0, x1, z0, z1], y0, y1, ops, { key = 'wall', t = 0.3, fk = 'frame', fin = 0 } = {}) {
  const FF = F4(x0, x1, z0, z1);
  for (const k of ['f', 'r', 'b', 'l']) {
    const list = ops[k]; if (list === 'none') continue; const F = FF[k], L = list || [];
    wallOpen(acc, F, y0, y1, L, key, t);
    for (const o of L) {
      fillOpening(acc, F, { fk, ...o }, t);
      if (fin && o.kind === 'grid' && !o.open) {
        const nm = Math.max(1, Math.round((o.u1 - o.u0) / (o.m || 1.2))), d = -Math.min(0.2, t * 0.5), D = o.door;
        for (let i = 0; i <= nm; i++) { const u = o.u0 + ((o.u1 - o.u0) * i) / nm; if (D && u > D.c - D.w / 2 - 0.1 && u < D.c + D.w / 2 + 0.1) continue; acc.add('fin', fbox(F, u - 0.03, u + 0.03, o.y0, o.y1, d, fin)); }
      }
    }
  }
}
/** rèm vải sau kính: các đoạn [u0, u1] trên mặt F, treo từ y1 xuống y0, cách mặt ngoài w (âm = trong nhà) */
export function curtains(acc, F, segs, y0, y1, { w = -0.42 } = {}) { for (const [a, b] of segs) acc.add('curtain', fbox(F, a, b, y0, y1, w - 0.05, w)); }
/** hai cánh cửa đi mở vuông góc vào trong (cửa trục xoay): mặt F, tâm u = c, khe w, cao h; kind 'glass' (khung thép + kính) | 'wood' */
export function doorLeaves(acc, F, c, w, y0, h, { kind = 'glass', d = 0.15 } = {}) {
  const lw = w / 2 - 0.08;
  for (const s of [-1, 1]) {
    const u = c + s * (w / 2 - 0.06), a = -d - 0.05, b = -d - 0.05 - lw;
    if (kind === 'wood') { acc.add('wood', fbox(F, u - 0.03, u + 0.03, y0 + 0.01, y0 + h - 0.02, b, a)); continue; }
    acc.add('glass', fbox(F, u - 0.01, u + 0.01, y0 + 0.08, y0 + h - 0.08, b + 0.06, a - 0.06));
    for (const [y1, y2] of [[y0 + 0.01, y0 + 0.12], [y0 + h - 0.08, y0 + h - 0.02]]) acc.add('frame', fbox(F, u - 0.025, u + 0.025, y1, y2, b, a));
    for (const [w1, w2] of [[b, b + 0.06], [a - 0.06, a]]) acc.add('frame', fbox(F, u - 0.025, u + 0.025, y0 + 0.01, y0 + h - 0.02, w1, w2));
  }
}
/** khung hộp nhô quanh ô cửa (cadre — Ando / Corbusier): mặt F, u0..u1 × y0..y1, nhô out, dày e */
export function cadre(acc, F, u0, u1, y0, y1, { out = 0.45, e = 0.22, key = 'slab', back = 0.1 } = {}) {
  acc.add(key, fbox(F, u0 - e, u1 + e, y1, y1 + e, -back, out)); acc.add(key, fbox(F, u0 - e, u1 + e, y0 - e, y0, -back, out));
  acc.add(key, fbox(F, u0 - e, u0, y0, y1, -back, out)); acc.add(key, fbox(F, u1, u1 + e, y0, y1, -back, out));
}

// ---------------------------------------------------------------- tấm, tường chắn mái, lan can
/** tấm sàn / mái phẳng: mặt trên ở yTop, dày t */
export const slab = (acc, key, x0, x1, z0, z1, yTop, t = 0.45) => acc.add(key, boxB(x1 - x0, t, z1 - z0, (x0 + x1) / 2, yTop - t, (z0 + z1) / 2));
/** lớp mặt mái (sỏi / đá lát) lùi vào e, dày 0,04 */
export const roofSkin = (acc, key, x0, x1, z0, z1, y, e = 0.3) => acc.add(key, boxB(x1 - x0 - 2 * e, 0.04, z1 - z0 - 2 * e, (x0 + x1) / 2, y, (z0 + z1) / 2));
/** tường chắn mái cao h dày t trên mép trong hộp + gờ đỉnh (coping); skip: ['f', …] mặt không dựng */
export function parapet(acc, key, [x0, x1, z0, z1], y, h, { t = 0.25, cop = 'coping', skip = [] } = {}) {
  const W = x1 - x0, D = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const P = { f: [W, t, cx, z1 - t / 2], b: [W, t, cx, z0 + t / 2], l: [t, D - 2 * t, x0 + t / 2, cz], r: [t, D - 2 * t, x1 - t / 2, cz] };
  for (const [k, [w, d, x, z]] of Object.entries(P)) { if (skip.includes(k)) continue; acc.add(key, boxB(w, h, d, x, y, z)); if (cop) acc.add(cop, boxB(w + 0.06, 0.06, d + 0.06, x, y + h, z)); }
}
/** lan can kính: tấm kính 20 mm + tay vịn thép + chân kẹp; pts đường mép [[x, z], …] */
export function gRail(acc, pts, y, { h = 1.05, closed = false, glass = 'glassRail', top = 'railBar' } = {}) {
  const P = closed ? [...pts, pts[0]] : pts;
  for (let i = 0; i < P.length - 1; i++) {
    const [ax, az] = P[i], [bx, bz] = P[i + 1], L = Math.hypot(bx - ax, bz - az); if (L < 0.05) continue;
    const ry = Math.atan2(-(bz - az), bx - ax), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    acc.add(glass, box(L, h - 0.14, 0.024, mx, y + 0.08 + (h - 0.14) / 2, mz, ry));
    acc.add(top, box(L + 0.05, 0.05, 0.06, mx, y + h - 0.025, mz, ry));
    acc.add(top, box(L, 0.08, 0.09, mx, y + 0.04, mz, ry));
  }
}
/** lan can gỗ: trụ bước step + tay vịn + 2 thanh ngang */
export function woodRail(acc, pts, y, { h = 1.0, step = 1.6, key = 'railWood' } = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az); if (L < 0.05) continue;
    const ry = Math.atan2(-(bz - az), bx - ax), mx = (ax + bx) / 2, mz = (az + bz) / 2, n = Math.max(1, Math.round(L / step));
    acc.add(key, box(L + 0.1, 0.07, 0.12, mx, y + h - 0.035, mz, ry));
    for (const hh of [0.35, 0.65]) acc.add(key, box(L, 0.04, 0.05, mx, y + hh, mz, ry));
    for (let j = 0; j <= n; j++) { const t = j / n; acc.add(key, boxB(0.09, h, 0.09, ax + (bx - ax) * t, y, az + (bz - az) * t)); }
  }
}
/** lam đứng trước mặt F (khung mặt): thanh rộng sw, sâu sd, bước step, cách mặt off; ray trên / dưới khoá rk */
export function louvers(acc, F, u0, u1, y0, y1, { step = 0.26, sw = 0.05, sd = 0.16, off = 0.3, key = 'lattice', rk = 'wood' } = {}) {
  const n = Math.max(1, Math.floor((u1 - u0) / step));
  for (let i = 0; i <= n; i++) { const u = u0 + ((u1 - u0) * i) / n; acc.add(key, fbox(F, u - sw / 2, u + sw / 2, y0 + 0.08, y1 - 0.08, off, off + sd)); }
  if (rk) { acc.add(rk, fbox(F, u0 - 0.05, u1 + 0.05, y1 - 0.08, y1, off - 0.02, off + sd + 0.02)); acc.add(rk, fbox(F, u0 - 0.05, u1 + 0.05, y0, y0 + 0.08, off - 0.02, off + sd + 0.02)); }
}
/** lam ngang (che nắng) trước mặt F */
export function hLouvers(acc, F, u0, u1, y0, y1, { step = 0.3, th = 0.04, sd = 0.22, off = 0.25, key = 'lattice' } = {}) {
  const n = Math.max(1, Math.floor((y1 - y0) / step));
  for (let i = 0; i <= n; i++) { const y = y0 + ((y1 - y0) * i) / n; acc.add(key, fbox(F, u0, u1, y - th / 2, y + th / 2, off, off + sd)); }
}

// ---------------------------------------------------------------- nền
/** bục nền W × D cao h (gờ hắt bóng 0,25 m chân nếu h ≥ 0,8) + bậc: stairs [{ side: ±1, w, cx }] (mặt ±z) | [{ sx: ±1, w, cz }] (mặt ±x) */
export function podium(acc, W, D, h, { stairs = [], key = 'stone', reveal = true } = {}) {
  if (reveal && h >= 0.8) { acc.add(key, boxB(W - 0.5, 0.25, D - 0.5, 0, 0, 0)); acc.add(key, boxB(W, h - 0.25, D, 0, 0.25, 0)); }
  else acc.add(key, boxB(W, h, D, 0, 0, 0));
  for (const s of stairs) {
    if (s.sx) adSteps(acc, { cx: (s.sx * W) / 2, cz: s.cz || 0, w: s.w, h, dir: s.sx > 0 ? '+x' : '-x', key, cheek: null });
    else adSteps(acc, { cx: s.cx || 0, cz: (s.side * D) / 2, w: s.w, h, dir: s.side > 0 ? '+z' : '-z', key, cheek: null });
  }
}
/** trụ / cột vuông s × s từ y0 tới y1 */
export const post = (acc, key, x, z, s, y0, y1, sz = s) => acc.add(key, boxB(s, y1 - y0, sz, x, y0, z));
/** cột thép chữ thập (Mies, Barcelona Pavilion) */
export function cruciform(acc, key, x, z, y0, y1, a = 0.26, e = 0.05) { acc.add(key, boxB(a, y1 - y0, e, x, y0, z)); acc.add(key, boxB(e, y1 - y0, a, x, y0, z)); }
/** gộp acc con (xoay ry quanh y rồi dời) vào acc */
export function mergeAcc(dst, src, { ry = 0, x = 0, y = 0, z = 0 } = {}) {
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
  for (const [k, list] of src.parts) for (const g of list) dst.add(k, g.applyMatrix4(m));
}
