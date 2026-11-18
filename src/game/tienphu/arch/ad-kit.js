// ============================================================================
//  BỘ CÔNG CỤ ART DECO (U Thiên) — vật liệu, texture canvas thủ tục, khối có góc bo, tường có ô cửa sâu, cửa sổ khung
//  kim loại mảnh, lan can ống trắng, pergola, mái hiên công-xôn. Theo docs/tienphu-nghiencuu/05-artdeco.md (phần chung).
//  Khung cục bộ: gốc = tâm mặt bằng (y = 0), +z = mặt tiền. Chỉ import (đọc) từ kit.js.
// ============================================================================
import * as THREE from 'three';
import { box, boxB, slabXY, V } from './kit.js';

// ---------------------------------------------------------------- màu (05 › §2 bảng màu chung + §6 từng công trình)
export const AD = {
  brick: '#d8c48c', joint: '#1b1b1b', vjoint: '#d0bb82', render: '#ecebe4', renderPink: '#e6c9b8', faience: '#e8dcc0', faiB: '#141414',
  brickRed: '#c9a77a', lime: '#d9cfb8', stoneW: '#e7e2d6', stone: '#d6d0c2', floor: '#b9b6ae', coping: '#e2ddd0', frame: '#2a2c2e',
  glass: '#9fb4bf', rail: '#f2f2ee', gold: '#c8a050', chrome: '#d0d4d8', steel: '#c9ced3', granite: '#161616', spandrel: '#5b6066',
  gdoor: '#3b3f44', conc: '#bdb9b0', poolTile: '#f4f6f6', water: '#5fa9c4', mirror: '#2e4a52', cabin: '#2f5fa8', tango: '#e8b830',
  gblock: '#cfe3e8', pinkG: '#e7b8c0', blueG: '#9fc0d8', glow: '#ffe6b0', wood: '#8a5a36', woodDk: '#3b2a1e', grass: '#6a9a48',
  hedge: '#3f5f2e', pave: '#c9b9a0', floorWood: '#b88a58', bronze: '#6b5a3a', clay: '#b5633a',
};

// ---------------------------------------------------------------- texture canvas (chỉ trong trình duyệt)
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shade(hex, v) { const c = new THREE.Color(hex); c.offsetHSL(0, 0, v); return '#' + c.getHexString(); }
function canvasTex(w, h, draw, repeat = true) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
/** gạch ốp Cavrois: 1 tile = 1 × 1 m; 20 hàng (bước 5 cm = viên 43 mm + mạch) — mạch NGANG lõm sơn đen, mạch ĐỨNG mảnh cùng màu vàng (05 §1c) */
function brickTex(base, joint, vj, seed = 7) {
  return canvasTex(512, 512, (g, w, h) => {
    const r = rng(seed), ch = h / 20, bl = w / 4;                 // viên 0,25 m (≈ 232 mm Hilversum)
    g.fillStyle = vj; g.fillRect(0, 0, w, h);
    for (let row = 0; row < 20; row++) {
      const y = row * ch, off = (row % 2) * bl / 2;
      for (let x = -bl; x < w + bl; x += bl) { g.fillStyle = shade(base, 0.03 + (r() - 0.5) * 0.06); g.fillRect(x + off + 1, y, bl - 2, ch); }
      g.fillStyle = joint; g.fillRect(0, y + ch - 3.5, w, 3.5);     // mạch ngang đen lõm (≈ 7 mm)
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, y + ch - 5, w, 1.5); // bóng mép lõm
    }
  });
}
/** zigzag gạch hai màu (Chrysler tầng 24–27) — tile = 2 m × 1 dải */
const zigTex = () => canvasTex(512, 128, (g, w, h) => {
  g.fillStyle = AD.faiB; g.fillRect(0, 0, w, h);
  for (const [col, y0, amp] of [[AD.brick, 0.18, 0.62], [AD.gold, 0.42, 0.3]]) {
    g.fillStyle = col; g.beginPath(); const n = 8, s = w / n;
    g.moveTo(0, h * y0); for (let i = 0; i <= n; i++) { g.lineTo(i * s, h * (y0 + (i % 2 ? amp : 0))); }
    for (let i = n; i >= 0; i--) g.lineTo(i * s, h * (y0 + (i % 2 ? amp : 0)) + h * 0.14); g.closePath(); g.fill();
  }
}, true);
/** spandrel nhôm có chevron (05 lầu §7) */
const chevTex = () => canvasTex(256, 128, (g, w, h) => {
  g.fillStyle = AD.spandrel; g.fillRect(0, 0, w, h); g.strokeStyle = '#8f969c'; g.lineWidth = 7;
  for (let i = 0; i < 3; i++) { const y = h * (0.78 - i * 0.26); g.beginPath(); g.moveTo(w * 0.08, y + 18); g.lineTo(w / 2, y - 14); g.lineTo(w * 0.92, y + 18); g.stroke(); }
  g.strokeStyle = '#2f3337'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4);
}, false);
/** cửa gara thép có rãnh ngang */
const gdoorTex = () => canvasTex(128, 128, (g, w, h) => { g.fillStyle = AD.gdoor; g.fillRect(0, 0, w, h); for (let i = 1; i < 10; i++) { g.fillStyle = '#23262a'; g.fillRect(0, (i * h) / 10, w, 3); g.fillStyle = '#5a5f66'; g.fillRect(0, (i * h) / 10 + 3, w, 2); } }, false);
/** kính màu Barillet (ô vuông hình học hồng / xanh / trắng, chì đen) */
const stainedTex = () => canvasTex(256, 256, (g, w, h) => {
  const r = rng(31), cols = [AD.pinkG, AD.blueG, '#f4efe6', '#d98fa0', '#7fa6c6', '#efe0b8'];
  g.fillStyle = '#222'; g.fillRect(0, 0, w, h);
  const cell = w / 4; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(i * cell + 3, j * cell + 3, cell - 6, cell - 6); if (r() > 0.5) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.beginPath(); g.moveTo(i * cell + 3, j * cell + 3); g.lineTo((i + 1) * cell - 3, j * cell + 3); g.lineTo(i * cell + 3, (j + 1) * cell - 3); g.fill(); } }
}, false);
/** kính ghép tam giác trắng + hồng (vườn Guevrekian 1925) */
const triGlassTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = '#2a2c2e'; g.fillRect(0, 0, w, h);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { const x = (i * w) / 2, y = (j * h) / 4, cw = w / 2, chh = h / 4;
    g.fillStyle = '#f2f0ea'; g.beginPath(); g.moveTo(x + 3, y + 3); g.lineTo(x + cw - 3, y + 3); g.lineTo(x + 3, y + chh - 3); g.fill();
    g.fillStyle = '#f0c8cc'; g.beginPath(); g.moveTo(x + cw - 3, y + 6); g.lineTo(x + cw - 3, y + chh - 3); g.lineTo(x + 6, y + chh - 3); g.fill(); }
}, false);
/** vòm Eltham: bê tông lỗ chỗ 720 cốc kính */
const domeTex = () => canvasTex(1024, 256, (g, w, h) => { g.fillStyle = '#cfcac0'; g.fillRect(0, 0, w, h); for (let j = 0; j < 12; j++) { const n = Math.max(12, Math.round(72 * (1 - j / 14))); for (let i = 0; i < n; i++) { g.fillStyle = '#9fb0b4'; g.beginPath(); g.arc((i + 0.5 + (j % 2) * 0.5) * (w / n), (j + 0.5) * (h / 12), 5.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#eef8fb'; g.beginPath(); g.arc((i + 0.5 + (j % 2) * 0.5) * (w / n), (j + 0.5) * (h / 12), 3.6, 0, Math.PI * 2); g.fill(); } } }); // 720 cốc kính Eltham (≈ 60 × 12)
/** biển chữ kim loại vàng trên nền đen (chữ nổi tên công trình) */
function signTex(text, { vertical = false, w = 1024, h = 160, fg = AD.gold, bg = AD.faiB, font = 'bold' } = {}) {
  return canvasTex(vertical ? h : w, vertical ? w : h, (g, W, H) => {
    g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.strokeStyle = fg; g.lineWidth = 4; g.strokeRect(6, 6, W - 12, H - 12);
    if (vertical) { const ch = [...text], step = (H - 40) / ch.length; g.font = `${font} ${Math.floor(step * 0.78)}px "Century Gothic", "Futura", "Arial", sans-serif`; ch.forEach((c, i) => g.fillText(c, W / 2, 20 + step * (i + 0.5))); }
    else { g.font = `${font} ${Math.floor(H * 0.56)}px "Century Gothic", "Futura", "Arial", sans-serif`; g.fillText(text, W / 2, H / 2 + 2); }
  }, false);
}
/** bảng điểm tennis chữ số kiểu Deco */
const scoreTex = () => canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#16301f'; g.fillRect(0, 0, w, h); g.strokeStyle = AD.gold; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#f2ead2'; g.font = 'bold 54px "Century Gothic", Arial, sans-serif'; g.textAlign = 'center'; g.fillText('JEU · SET', w / 2, 70); g.font = 'bold 96px "Century Gothic", Arial, sans-serif'; g.fillText('6 – 4', w / 2, 190); });
/** mặt đồng hồ (tháp Pavillon du Tourisme) */
const clockTex = () => canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f3ecd8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b1b1b'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h / 2, 118, 0, Math.PI * 2); g.stroke(); for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; g.lineWidth = i % 3 ? 5 : 12; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 96, h / 2 + Math.sin(a) * 96); g.lineTo(w / 2 + Math.cos(a) * 112, h / 2 + Math.sin(a) * 112); g.stroke(); } g.lineWidth = 9; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + 60, h / 2 - 30); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - 10, h / 2 - 90); g.stroke(); }, false);

// ---------------------------------------------------------------- vật liệu
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
const withMap = (t, col, o = {}) => std(t ? { map: t, color: '#ffffff', ...o } : { color: col, ...o });
let MATS = null;
export function adMats() {
  if (MATS) return MATS;
  const glowM = (c, i = 0.9) => std({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4 });
  MATS = {
    brick: withMap(brickTex(AD.brick, AD.joint, AD.vjoint), AD.brick, { roughness: 0.8 }),
    brickRed: withMap(brickTex(AD.brickRed, '#5a4630', '#bf9c70', 11), AD.brickRed),
    render: std({ color: AD.render }), renderPink: std({ color: AD.renderPink }), faience: std({ color: AD.faience, roughness: 0.35 }), faiB: std({ color: AD.faiB, roughness: 0.25 }),
    lime: std({ color: AD.lime, roughness: 0.75 }), stoneW: std({ color: AD.stoneW, roughness: 0.7 }), stone: std({ color: AD.stone, roughness: 0.75 }),
    floor: std({ color: AD.floor }), floorWood: std({ color: AD.floorWood, roughness: 0.6 }), concW: std({ color: AD.render, roughness: 0.8 }), conc: std({ color: AD.conc }),
    coping: std({ color: AD.coping, roughness: 0.7 }), frame: std({ color: AD.frame, roughness: 0.5, metalness: 0.3 }),
    glass: std({ color: AD.glass, roughness: 0.18, metalness: 0.25 }), rail: std({ color: AD.rail, roughness: 0.45 }),
    gold: std({ color: AD.gold, roughness: 0.35, metalness: 0.55 }), chrome: std({ color: AD.chrome, roughness: 0.22, metalness: 0.5 }), steel: std({ color: AD.steel, roughness: 0.3, metalness: 0.45 }),
    granite: std({ color: AD.granite, roughness: 0.22 }), spandrel: withMap(chevTex(), AD.spandrel, { roughness: 0.5, metalness: 0.3 }), zig: withMap(zigTex(), AD.faiB, { roughness: 0.5 }),
    gdoor: withMap(gdoorTex(), AD.gdoor, { roughness: 0.55, metalness: 0.3 }), poolTile: std({ color: AD.poolTile, roughness: 0.3 }), water: std({ color: AD.water, roughness: 0.08, metalness: 0.1 }),
    mirror: std({ color: AD.mirror, roughness: 0.04, metalness: 0.2 }), cabin: std({ color: AD.cabin, roughness: 0.5 }), tango: std({ color: AD.tango, roughness: 0.5 }),
    gblock: glowM(AD.gblock, 0.35), stained: withMap(stainedTex(), AD.pinkG, { emissive: '#ffffff', emissiveIntensity: 0.15, roughness: 0.3 }), triGlass: withMap(triGlassTex(), '#f0c8cc', { roughness: 0.3 }),
    dome: withMap(domeTex(), '#cfcac0'), glow: glowM(AD.glow, 1.0), wood: std({ color: AD.wood, roughness: 0.6 }), woodDk: std({ color: AD.woodDk, roughness: 0.6 }),
    grass: std({ color: AD.grass }), hedge: std({ color: AD.hedge }), pave: std({ color: AD.pave }), bronze: std({ color: AD.bronze, roughness: 0.4, metalness: 0.5 }), clay: std({ color: AD.clay }),
    book: std({ color: '#7a3b2a', roughness: 0.7 }), book2: std({ color: '#2f4a6a', roughness: 0.7 }),
    signTower: withMap(signTex('THIÊN KIM LÂU'), AD.gold, { roughness: 0.35, metalness: 0.3 }), signCine: withMap(signTex('CINÉMA', { vertical: true, w: 1024, h: 200 }), AD.gold, { roughness: 0.4 }),
    signGym: withMap(signTex('GYMNASE', { fg: AD.faiB, bg: AD.render }), AD.render), signPool: withMap(signTex('PISCINE', { fg: '#ffffff', bg: AD.cabin }), AD.cabin), signGar: withMap(signTex('GARAGE', { fg: AD.faiB, bg: AD.stoneW }), AD.stoneW),
    score: withMap(scoreTex(), '#16301f'), clock: withMap(clockTex(), '#f3ecd8'),
  };
  return MATS;
}
/** khoá vật liệu cần UV theo mét thế giới (gạch sọc: tile = 1 m) */
const WORLD_UV = { brick: 1, brickRed: 1 };

// ---------------------------------------------------------------- UV
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _n = new THREE.Vector3(), _t = new THREE.Vector3();
/** UV chiếu theo trục trội của pháp tuyến từng tam giác (sọc gạch luôn nằm ngang, liền qua mặt cong) */
export function worldUV(g, s = 1) {
  const p = g.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i += 3) {
    _a.fromBufferAttribute(p, i); _b.fromBufferAttribute(p, i + 1); _c.fromBufferAttribute(p, i + 2);
    _n.subVectors(_c, _b).cross(_t.subVectors(_a, _b)); const ax = Math.abs(_n.x), ay = Math.abs(_n.y), az = Math.abs(_n.z);
    for (let j = 0; j < 3; j++) { const x = p.getX(i + j), y = p.getY(i + j), z = p.getZ(i + j); let u, v; if (ay >= ax && ay >= az) { u = x; v = z; } else if (ax >= az) { u = z; v = y; } else { u = x; v = y; } uv[2 * (i + j)] = u / s; uv[2 * (i + j) + 1] = v / s; }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}
export function finalizeUV(acc) { for (const [k, s] of Object.entries(WORLD_UV)) for (const g of acc.parts.get(k) || []) worldUV(g, s); }
/** UV dải trang trí trên một mặt: u theo mét dọc mặt / rep, v = (y − yb) / hb */
export function bandUV(g, F, yb, hb, rep = 2) {
  const p = g.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); uv[2 * i] = ((x - F.ax) * F.ux + (z - F.az) * F.uz) / rep; uv[2 * i + 1] = (y - yb) / hb; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}

// ---------------------------------------------------------------- hình
const area2 = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length]; s += x0 * y1 - x1 * y0; } return s; };
const dedupe = (pts) => pts.filter((p, i) => { const q = pts[(i + pts.length - 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-4; });
/** lăng trụ đứng: đa giác mặt bằng [[x, z], …] (có lỗ) đùn từ y0 lên h — khối kín */
export function prism(pts, y0, h, holes = []) {
  let o = dedupe(pts).map(([x, z]) => [x, -z]); if (area2(o) > 0) o = o.reverse();             // vỏ: chiều kim đồng hồ
  const s = new THREE.Shape(o.map(([a, b]) => new THREE.Vector2(a, b)));
  for (const hp of holes) { let q = dedupe(hp).map(([x, z]) => [x, -z]); if (area2(q) < 0) q = q.reverse(); s.holes.push(new THREE.Path(q.map(([a, b]) => new THREE.Vector2(a, b)))); }
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 12 }); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g;
}
/** chữ nhật bo góc: r = { fl, fr, bl, br } (f = +z, b = −z, l = −x, r = +x) */
export function rrect(x0, x1, z0, z1, r = {}, seg = 8) {
  const lim = Math.min((x1 - x0) / 2, (z1 - z0) / 2), R = (k) => Math.max(0, Math.min(r[k] || 0, lim)), out = [];
  const arc = (cx, cz, rr, a0) => { if (rr < 1e-3) { out.push([cx, cz]); return; } for (let i = 0; i <= seg; i++) { const a = a0 + (Math.PI / 2) * (i / seg); out.push([cx + Math.cos(a) * rr, cz + Math.sin(a) * rr]); } };
  arc(x1 - R('fr'), z1 - R('fr'), R('fr'), 0); arc(x0 + R('fl'), z1 - R('fl'), R('fl'), Math.PI / 2);
  arc(x0 + R('bl'), z0 + R('bl'), R('bl'), Math.PI); arc(x1 - R('br'), z0 + R('br'), R('br'), 1.5 * Math.PI);
  return out;
}
export const insetR = (r = {}, d) => ({ fl: Math.max(0, (r.fl || 0) - d), fr: Math.max(0, (r.fr || 0) - d), bl: Math.max(0, (r.bl || 0) - d), br: Math.max(0, (r.br || 0) - d) });
/** vòng (tường bao / gờ) giữa chữ nhật bo góc ngoài và trong */
export const ringPrism = (x0, x1, z0, z1, r, t, y0, h, out = 0) => prism(rrect(x0 - out, x1 + out, z0 - out, z1 + out, insetR(r, -out)), y0, h, [rrect(x0 + t, x1 - t, z0 + t, z1 - t, insetR(r, t))]);
/** ống trụ nối hai điểm */
export function tube(a, b, r, seg = 6) {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length(), g = new THREE.CylinderGeometry(r, r, L, seg, 1);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); return g;
}
export const cylY = (r, h, x, y, z, seg = 16, r1 = r) => { const g = new THREE.CylinderGeometry(r1, r, h, seg); g.translate(x, y + h / 2, z); return g; };

// ---------------------------------------------------------------- MẶT TƯỜNG (khung cục bộ một mặt: u dọc mặt, y, w theo pháp tuyến ra ngoài)
/** mặt từ A(ax, az) đến B (nhìn từ ngoài: trái → phải), pháp tuyến ngoài (nx, nz) */
export function face(ax, az, bx, bz, nx, nz) { const L = Math.hypot(bx - ax, bz - az) || 1e-6, ux = (bx - ax) / L, uz = (bz - az) / L; return { ax, az, ux, uz, nx, nz, L, ry: Math.atan2(-uz, ux) }; }
/** hộp trong khung mặt: u0..u1 × y0..y1 × w0..w1 (w < 0 = vào trong tường) */
export function fbox(F, u0, u1, y0, y1, w0, w1) { const u = (u0 + u1) / 2, w = (w0 + w1) / 2; return box(Math.abs(u1 - u0), Math.abs(y1 - y0), Math.abs(w1 - w0), F.ax + F.ux * u + F.nx * w, (y0 + y1) / 2, F.az + F.uz * u + F.nz * w, F.ry); }
/** ma trận khung mặt: (u, y, w) cục bộ → thế giới (dùng cho hình đùn trong mặt phẳng tường) */
export const faceMat = (F) => new THREE.Matrix4().set(F.ux, 0, F.nx, F.ax, 0, 1, 0, 0, F.uz, 0, F.nz, F.az, 0, 0, 0, 1);
export const uOf = (F, x, z) => (x - F.ax) * F.ux + (z - F.az) * F.uz;

/** tường dày t (từ mặt ngoài vào trong) có các ô mở {u0,u1,y0,y1}: chia dải ngang, gộp dải giống nhau */
export function wallOpen(acc, F, y0, y1, ops, key, t, u0 = 0, u1 = F.L) {
  const ys = new Set([y0, y1]); for (const o of ops) { ys.add(Math.max(y0, Math.min(y1, o.y0))); ys.add(Math.max(y0, Math.min(y1, o.y1))); }
  const Y = [...ys].sort((a, b) => a - b); let prev = null;
  const flush = () => { if (!prev) return; let u = u0; for (const [a, b] of prev.cut) { if (a > u + 1e-4) acc.add(key, fbox(F, u, a, prev.ya, prev.yb, -t, 0)); u = Math.max(u, b); } if (u1 > u + 1e-4) acc.add(key, fbox(F, u, u1, prev.ya, prev.yb, -t, 0)); prev = null; };
  for (let i = 0; i < Y.length - 1; i++) {
    const ya = Y[i], yb = Y[i + 1]; if (yb - ya < 1e-4) continue; const ym = (ya + yb) / 2;
    const cut = ops.filter((o) => o.y0 < ym && o.y1 > ym).map((o) => [Math.max(u0, o.u0), Math.min(u1, o.u1)]).sort((a, b) => a[0] - b[0]), sig = JSON.stringify(cut);
    if (prev && prev.sig === sig) prev.yb = yb; else { flush(); prev = { ya, yb, cut, sig }; }
  }
  flush();
}
/**
 * lắp ô cửa: kính lùi vào, khung kim loại ≤ 6 cm (05 sai lầm 5), đố đứng mỗi m mét, đố ngang tr[], bậu cửa (trừ cửa đi).
 * o.door = { c, w, h } — vùng cửa đi để trống (lối vào) · o.open — chỉ khung (kính hạ / cửa mở) · o.fk — khoá khung (vd 'gold')
 */
export function fillOpening(acc, F, o, t) {
  const d = -Math.min(0.2, t * 0.5), fw = 0.06, fk = o.fk || 'frame', L = o.u1 - o.u0;
  const bar = (u0, u1, y0, y1) => acc.add(fk, fbox(F, u0, u1, y0, y1, d - 0.035, d + 0.035));
  if (o.kind === 'void') return;                                                                  // ô khoét để phần riêng lắp (cửa tròn…)
  if (o.kind === 'gdoor') { // cửa gara thép cuốn (mở: cuốn lên còn 0,5 m)
    acc.add('gdoor', fbox(F, o.u0, o.u1, o.open ? o.y1 - 0.5 : o.y0, o.y1, d - 0.08, d)); bar(o.u0, o.u1, o.y1 - fw, o.y1);
    acc.add('frame', fbox(F, o.u0 - 0.08, o.u0, o.y0, o.y1, -0.05, 0.03)); acc.add('frame', fbox(F, o.u1, o.u1 + 0.08, o.y0, o.y1, -0.05, 0.03)); return;
  }
  const D = o.door, dl = D ? D.c - D.w / 2 : 0, dr = D ? D.c + D.w / 2 : 0, dt = D ? o.y0 + D.h : 0;
  if (!o.open) {
    const g = (u0, u1, y0, y1) => { if (u1 - u0 > 0.02 && y1 - y0 > 0.02) acc.add(o.gk || 'glass', fbox(F, u0, u1, y0, y1, d - 0.012, d + 0.012)); };
    if (D) { g(o.u0, dl, o.y0, o.y1); g(dr, o.u1, o.y0, o.y1); g(dl, dr, dt, o.y1); } else g(o.u0, o.u1, o.y0, o.y1);
  }
  bar(o.u0, o.u1, o.y1 - fw, o.y1); bar(o.u0, o.u0 + fw, o.y0, o.y1); bar(o.u1 - fw, o.u1, o.y0, o.y1);
  if (!D) bar(o.u0, o.u1, o.y0, o.y0 + fw); else { bar(o.u0, dl, o.y0, o.y0 + fw); bar(dr, o.u1, o.y0, o.y0 + fw); bar(dl - fw, dl, o.y0, dt); bar(dr, dr + fw, o.y0, dt); bar(dl - fw, dr + fw, dt - fw, dt); }
  if (!o.open) {
    const nm = Math.max(1, Math.round(L / (o.m || 1.2)));
    for (let i = 1; i < nm; i++) { const u = o.u0 + (L * i) / nm; if (D && u > dl - 0.05 && u < dr + 0.05) { if (dt < o.y1 - 0.1) bar(u - fw / 2, u + fw / 2, dt, o.y1); } else bar(u - fw / 2, u + fw / 2, o.y0, o.y1); }
    for (const ty of o.tr || []) { if (ty <= o.y0 + 0.05 || ty >= o.y1 - 0.05) continue; if (D && ty < dt) { bar(o.u0, dl, ty - fw / 2, ty + fw / 2); bar(dr, o.u1, ty - fw / 2, ty + fw / 2); } else bar(o.u0, o.u1, ty - fw / 2, ty + fw / 2); }
  }
  if (o.sill !== false && o.kind !== 'door') acc.add('coping', fbox(F, o.u0 - 0.06, o.u1 + 0.06, o.y0 - 0.07, o.y0, -t * 0.6, 0.07));
}

/**
 * Ô cửa một tầng theo mẫu (05 §5 các công trình): 'band[:nhóm m]' băng ngang có trụ ngắt · 'ribbon' băng liền · 'tall:n' cửa kéo
 * đứng kiểu Mỹ · 'french:n' cửa sổ-cửa đi · 'small:n' ô nhỏ · 'clere[:nhóm]' băng sát trần · 'grid' kính lưới cả tầng ·
 * 'cellar:n' ô cửa hầm · 'door:w' cửa đi giữa mặt (mở) — ghép bằng '|', vd 'door:2.6|band'
 */
export function storeyOps(pat, L, yf, sh, m0 = 0.9) {
  const ops = []; if (!pat || pat === 'blank' || L < 1.6) return ops;
  const parts = pat.split('|').map((p) => { const [k, a] = p.split(':'); return [k, a ? +a : 0]; });
  const excl = [];
  for (const [k, v] of parts) if (k === 'door') { const w = v || 2.6, c = L / 2, h = Math.min(3.2, sh - 0.6); ops.push({ u0: c - w / 2 - 0.5, u1: c + w / 2 + 0.5, y0: yf, y1: yf + h, kind: 'door', door: { c, w, h: h - 0.5 }, m: 0.5, tr: [] }); excl.push([c - w / 2 - 1.3, c + w / 2 + 1.3]); }
  const even = (n, w, y0, y1, extra) => { const out = []; for (let i = 0; i < n; i++) { const c = (L * (i + 0.5)) / n; out.push({ u0: c - w / 2, u1: c + w / 2, y0, y1, ...extra }); } return out; };
  for (const [k, v] of parts) {
    let list = [];
    if (k === 'band' || k === 'ribbon' || k === 'clere') {
      const h = k === 'clere' ? 1.2 : Math.min(1.7, sh - 1.6), y0 = k === 'clere' ? yf + sh - 1.75 : yf + 0.95, g = k === 'ribbon' ? 1e9 : v || 5.0, use = L - 2 * m0;
      if (use > 0.8) { const n = Math.max(1, Math.round(use / (g + 0.9))), gw = (use - (n - 1) * 0.9) / n; for (let i = 0; i < n; i++) list.push({ u0: m0 + i * (gw + 0.9), u1: m0 + i * (gw + 0.9) + gw, y0, y1: y0 + h, kind: 'band', m: 1.0, tr: [] }); }
    } else if (k === 'tall') list = even(v || 2, 1.3, yf + 0.7, yf + sh - 0.75, { kind: 'tall', m: 1.3, tr: [yf + 0.7 + (sh - 1.45) * 0.55] });
    else if (k === 'french') { const h = Math.min(2.9, sh - 0.9); list = even(v || 2, 1.6, yf, yf + h, { kind: 'door', m: 0.8, tr: [yf + h * 0.78], sill: false }); }
    else if (k === 'small') list = even(v || 2, 0.9, yf + sh - 1.9, yf + sh - 1.0, { kind: 'small', m: 0.9, tr: [] });
    else if (k === 'cellar') list = even(v || 3, 1.2, yf + sh - 0.75, yf + sh - 0.3, { kind: 'small', m: 0.6, tr: [] });
    else if (k === 'grid') list = [{ u0: m0, u1: L - m0, y0: yf + 0.3, y1: yf + sh - 0.45, kind: 'grid', m: 1.2, tr: Array.from({ length: Math.floor((sh - 0.75) / 1.2) }, (_, i) => yf + 0.3 + 1.2 * (i + 1)) }];
    for (const o of list) { let pieces = [[o.u0, o.u1]]; for (const [a, b] of excl) pieces = pieces.flatMap(([p, q]) => (q <= a || p >= b ? [[p, q]] : [[p, Math.min(q, a)], [Math.max(p, b), q]])); for (const [p, q] of pieces) if (q - p >= (o.kind === 'band' || o.kind === 'grid' ? 0.9 : o.u1 - o.u0 - 1e-3)) ops.push({ ...o, u0: p, u1: q }); }
  }
  return ops;
}

// ---------------------------------------------------------------- lan can ống trắng (Cavrois, Molitor «lisse» — 05 §2, sai lầm 8)
/** pts [[x, z], …]: đường mép; y: chân trụ; h: cao tới tay vịn; skip(x, z) → true = bỏ đoạn (bị khối cao hơn che) */
export function tubeRail(acc, pts, y, { h = 1.1, step = 1.6, closed = true, skip = null, key = 'rail', bars = [0.42, 0.78] } = {}) {
  const P = closed ? [...pts, pts[0]] : pts, posts = new Set();
  const post = (x, z) => { const k = `${x.toFixed(2)},${z.toFixed(2)}`; if (posts.has(k)) return; posts.add(k); acc.add(key, tube(V(x, y, z), V(x, y + h, z), 0.028, 6)); };
  for (let i = 0; i < P.length - 1; i++) {
    const [ax, az] = P[i], [bx, bz] = P[i + 1], L = Math.hypot(bx - ax, bz - az); if (L < 1e-3) continue;
    const n = Math.max(1, Math.round(L / step)); let run = null;
    const at = (t) => [ax + (bx - ax) * t, az + (bz - az) * t];
    const flush = () => { if (!run) return; const [x0, z0] = at(run[0]), [x1, z1] = at(run[1]); for (const hh of [h, ...bars]) acc.add(key, tube(V(x0, y + hh, z0), V(x1, y + hh, z1), hh === h ? 0.032 : 0.02, 6)); post(x1, z1); run = null; };
    for (let j = 0; j < n; j++) { const [mx, mz] = at((j + 0.5) / n); if (skip && skip(mx, mz)) { flush(); continue; } const [px, pz] = at(j / n); post(px, pz); if (!run) run = [j / n, (j + 1) / n]; else run[1] = (j + 1) / n; }
    flush();
  }
}
// ---------------------------------------------------------------- pergola bê tông (Cavrois tầng 2, Empain)
export function pergola(acc, { x: [x0, x1], z: [z0, z1], y0, h, dir = 'x', post = 3.2, slat = 0.62, key = 'concW', posts = true }) {
  const yt = y0 + h, along = dir === 'x', L = along ? x1 - x0 : z1 - z0, n = Math.max(1, Math.round(L / post));
  if (posts) for (let i = 0; i <= n; i++) { const t = i / n; for (const s of [0, 1]) { const x = along ? x0 + (x1 - x0) * t : s ? x1 : x0, z = along ? (s ? z1 : z0) : z0 + (z1 - z0) * t; acc.add(key, boxB(0.26, h - 0.45, 0.26, x, y0, z)); } }
  for (const s of [0, 1]) acc.add(key, along ? boxB(x1 - x0 + 0.5, 0.45, 0.26, (x0 + x1) / 2, yt - 0.45, s ? z1 : z0) : boxB(0.26, 0.45, z1 - z0 + 0.5, s ? x1 : x0, yt - 0.45, (z0 + z1) / 2));
  const m = Math.max(2, Math.round(L / slat));
  for (let i = 0; i <= m; i++) { const t = i / m; if (along) acc.add(key, boxB(0.12, 0.32, z1 - z0 + 0.9, x0 + (x1 - x0) * t, yt - 0.1, (z0 + z1) / 2)); else acc.add(key, boxB(x1 - x0 + 0.9, 0.32, 0.12, (x0 + x1) / 2, yt - 0.1, z0 + (z1 - z0) * t)); }
}
/** mái hiên công-xôn mỏng (bê tông, mép 0,18 m), r: bo góc; posts: [[x, z]] cột thép mảnh nếu cần */
export function canopy(acc, { x: [x0, x1], z: [z0, z1], y, t = 0.18, r = {}, key = 'concW', posts = [], edge = null }) {
  acc.add(key, prism(rrect(x0, x1, z0, z1, r), y, t));
  if (edge) acc.add(edge, ringPrism(x0, x1, z0, z1, r, 0.06, y + t * 0.3, t * 0.4, 0.02));
  for (const [x, z] of posts) acc.add('frame', cylY(0.07, y, x, 0, z, 8));
}
/** bậc thang ngoài: mép trên tại (cx, cz) theo hướng dir ('+z' | '-z' | '+x' | '-x'), rộng w, cao h; khai mặt đi được */
export function steps(acc, { cx, cz, w, h, dir = '+z', key = 'stone', run = 0.32, rise = 0.165, cheek = 'brick', y0 = 0 }) {
  const n = Math.max(1, Math.round(h / rise)), r = h / n, sx = dir === '+x' ? 1 : dir === '-x' ? -1 : 0, sz = dir === '+z' ? 1 : dir === '-z' ? -1 : 0;
  for (let i = 1; i <= n; i++) { const off = (n - i + 0.5) * run, x = cx + sx * off, z = cz + sz * off, top = y0 + r * i; acc.add(key, sx ? boxB(run, top - y0 + 0.001, w, x, y0, z) : boxB(w, top - y0 + 0.001, run, x, y0, z)); acc.plat({ x, z, w: sx ? run + 0.02 : w, d: sx ? w : run + 0.02, top }); }
  if (cheek) for (const s of [-1, 1]) { const L = n * run, x = cx + sx * L / 2 + (sx ? 0 : s * (w / 2 + 0.18)), z = cz + sz * L / 2 + (sz ? 0 : s * (w / 2 + 0.18)); acc.add(cheek, sx ? boxB(L, h * 0.55 + y0, 0.36, x, 0, z) : boxB(0.36, h * 0.55 + y0, L, x, 0, z)); }
  return n * run;
}
export { box, boxB, slabXY, V };
