// ============================================================================
//  BỘ CẤU KIỆN GOTHIC ANH (lâu đài thế kỷ 13–14) — theo docs/tienphu-nghiencuu/04-gothic.md (phần chung A–D).
//  Vật liệu (texture canvas thủ tục, UV chiếu hộp theo mét), hình học (đùn mặt có lỗ, tấm mái kín), vòm nhọn,
//  cửa sổ lancet / song đá (tracery) có khung sâu + gờ mũ (hood mould), tường mặt có lỗ, trụ ốp (buttress) giật cấp,
//  lỗ châu mai (merlon 2,0 / crenel 0,7 / lan can 1,0 + 1,0 m — A2), mái dốc thẳng có đầu hồi đá (coped gable),
//  tháp tròn có chân xiên, ống khói, đèn lồng thoát khói.
//  Khung cục bộ của MỘT MẶT TƯỜNG: u = dọc tường, y = cao, w = pháp tuyến ra ngoài (mặt ngoài tường ở w = t/2).
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, cyl, beam, lathe, ribAlong, V } from './kit.js';
export { Acc, box, boxB, cyl, beam, lathe, ribAlong, V };

const PI = Math.PI;

// ---------------------------------------------------------------- khung (frame) ghép hình
export class Fr {
  constructor(m = new THREE.Matrix4()) { this.m = m; }
  static at(x = 0, z = 0, ry = 0, y = 0) { return new Fr(new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z)); }
  sub(x = 0, z = 0, ry = 0, y = 0) { return new Fr(this.m.clone().multiply(Fr.at(x, z, ry, y).m)); }
  add(acc, key, g) { if (g) acc.add(key, g.applyMatrix4(this.m)); return g; }
  plat(acc, p) { const v = new THREE.Vector3(p.x || 0, 0, p.z || 0).applyMatrix4(this.m), e = this.m.elements; acc.plat({ ...p, x: v.x, z: v.z, top: p.top + e[13], ry: (p.ry || 0) + Math.atan2(e[8], e[10]) }); }
}

// ---------------------------------------------------------------- bảng màu (04 §B và §6 từng công trình)
export const GO = {
  S: { wall: '#B9A57E', dress: '#CBB991' },                      // sa thạch Penshurst / Bodiam
  P: { wall: '#D8CDB4', dress: '#E6DCC4' },                      // đá vôi Paris (Sainte-Chapelle)
  K: { wall: '#B3A27F', dress: '#C9B48A', rubble: true },        // đá vụn Stanton Harcourt
  G: { wall: '#9A968C', dress: '#B98F6A' },                      // đá vôi xám Beaumaris / Ludlow, khung sa thạch đỏ
  Q: { wall: '#8F877A', dress: '#B7AA8E', rubble: true },        // đá vụn Dartington
  L: { wall: '#8E8A80', dress: '#A39E8F', wash: '#E0DCCF', rubble: true }, // đá vụn quét vôi (doanh trại)
  R: { wall: '#9C5A43', dress: '#B07058' },                      // sa thạch đỏ Kenilworth
  O: { wall: '#C8B68F', dress: '#D6C7A2' },                      // đá vôi Oxford (Merton)
  H: { wall: '#7C806F', dress: '#C7AE78' },                      // sa thạch xám lục Harlech, chi tiết sa thạch vàng
  W: { wall: '#8E8A80', dress: '#C9C2B0', wash: '#E8E4D8' },     // Conwy quét vôi trắng
  B: { wall: '#C9C2B0', dress: '#B5A07C', band: '#8A6A4E' },     // Caernarfon: đá vôi sáng xen dải sa thạch nâu
};
export const COL = {
  slate: '#4A4F57', hallRoof: '#5A5550', stoneSlate: '#6E6658', libRoof: '#7A7264', lead: '#7D8288', leadOld: '#8A9095', clay: '#8E4B34',
  oak: '#5B4330', oakD: '#4A3526', chestnut: '#6A4C34', plaster: '#E4DCC8', glassB: '#1F3F8C', glassR: '#9E1B1B', gold: '#C9A24A',
  floor: '#9B5A3C', turf: '#6E8B3D', leaf: '#4E6B33', brick: '#A4553A', boards: '#7B6A55', willow: '#7A5C3E',
};

// ---------------------------------------------------------------- texture thủ tục
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = (c, f = 1, a = 1) => `rgba(${c.map((x) => Math.max(0, Math.min(255, Math.round(x * f)))).join(',')},${a})`;
export const darken = (h, f) => '#' + hex(h).map((x) => Math.max(0, Math.min(255, Math.round(x * f))).toString(16).padStart(2, '0')).join('');
function canvasTex(n, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = n; draw(c.getContext('2d'), n);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}
/** đá xây: S m một ô texture; hàng cao course m (đá đẽo) hoặc lộn xộn (đá vụn); dải màu; quét vôi bong */
function masonry(base, { S = 4, course = 0.4, rubble = false, band = null, wash = null, seed = 1, mortar = 1.16 } = {}) {
  return canvasTex(512, (g, N) => {
    const R = rng(seed), b = hex(base), px = N / S, rows = Math.round(S / course), rh = N / rows;
    g.fillStyle = rgb(b, mortar); g.fillRect(0, 0, N, N);
    for (let r = 0; r < rows; r++) {
      const col = band && r % band.every < (band.n || 1) ? hex(band.col) : b;
      const sub = rubble ? 2 : 1;
      for (let s = 0; s < sub; s++) {
        const y = r * rh + (s * rh) / sub, h = rh / sub;
        let x = -R() * px * 0.8;
        while (x < N) {
          const w = (rubble ? 0.25 + 0.5 * R() : 0.55 + 0.85 * R()) * px, f = 0.86 + 0.24 * R(), gp = rubble ? 3 : 2;
          const yo = rubble ? (R() - 0.5) * 3 : 0;
          g.fillStyle = rgb(col, f); g.fillRect(x + gp, y + gp + yo, w - gp, h - gp);
          if (x + w > N) g.fillRect(x - N + gp, y + gp + yo, w - gp, h - gp);
          g.fillStyle = rgb(col, f * 1.07, 0.5); g.fillRect(x + gp, y + gp + yo, w - gp, 2); // cạnh trên sáng
          x += w;
        }
      }
    }
    for (let i = 0; i < 9000; i++) { g.fillStyle = R() < 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'; g.fillRect(R() * N, R() * N, 1.6, 1.6); }
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(40,45,30,${0.03 + 0.04 * R()})`; g.beginPath(); g.arc(R() * N, R() * N, 10 + 40 * R(), 0, 2 * PI); g.fill(); } // vết ẩm / địa y
    if (wash) { const w = hex(wash); for (let i = 0; i < 380; i++) { g.fillStyle = rgb(w, 0.97 + 0.05 * R(), 0.55 + 0.3 * R()); g.beginPath(); g.arc(R() * N, R() * N, 18 + 30 * R(), 0, 2 * PI); g.fill(); } }
  });
}
function rowsTex(base, { S = 3, rows = 12, wMin = 0.25, wMax = 0.45, seed = 3, gap = 1.25, shadow = 0.55 } = {}) {
  return canvasTex(512, (g, N) => {
    const R = rng(seed), b = hex(base), px = N / S, rh = N / rows;
    g.fillStyle = rgb(b, 0.55); g.fillRect(0, 0, N, N);
    for (let r = 0; r < rows; r++) {
      let x = -R() * px * 0.3; const y = r * rh;
      while (x < N) { const w = (wMin + (wMax - wMin) * R()) * px, f = 0.82 + 0.3 * R(); g.fillStyle = rgb(b, f); g.fillRect(x + gap, y, w - gap, rh); if (x + w > N) g.fillRect(x - N + gap, y, w - gap, rh); x += w; }
      g.fillStyle = rgb(b, shadow, 0.9); g.fillRect(0, y + rh - 3, N, 3);
    }
    for (let i = 0; i < 5000; i++) { g.fillStyle = R() < 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)'; g.fillRect(R() * N, R() * N, 1.5, 1.5); }
  });
}
function leadTex(base, seed = 5) {
  return canvasTex(512, (g, N) => {
    const R = rng(seed), b = hex(base); g.fillStyle = rgb(b); g.fillRect(0, 0, N, N);
    for (let i = 0; i < 60; i++) { g.fillStyle = rgb(b, 0.9 + 0.2 * R(), 0.25); g.beginPath(); g.arc(R() * N, R() * N, 20 + 50 * R(), 0, 2 * PI); g.fill(); }
    const sw = N / 6; for (let i = 0; i < 6; i++) { g.fillStyle = rgb(b, 0.7); g.fillRect(i * sw, 0, 4, N); g.fillStyle = rgb(b, 1.25); g.fillRect(i * sw + 4, 0, 3, N); } // gân cuộn
    for (const y of [N / 2 - 2, N - 3]) { g.fillStyle = rgb(b, 0.72); g.fillRect(0, y, N, 3); }
  });
}
function glassTex(stained, seed = 7) {
  return canvasTex(512, (g, N) => {
    const R = rng(seed);
    if (!stained) { // ô kính quả trám chì (quarry) — S 1,2 m
      g.fillStyle = '#28323a'; g.fillRect(0, 0, N, N);
      for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${90 + 60 * R()},${110 + 50 * R()},${120 + 40 * R()},0.25)`; g.fillRect(R() * N, R() * N, 26, 26); }
      g.strokeStyle = '#7d8286'; g.lineWidth = 2.5; const s = N / 8;
      for (let i = -8; i <= 16; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s + N, N); g.stroke(); g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s - N, N); g.stroke(); }
      return;
    }
    const pal = ['#1F3F8C', '#1F3F8C', '#24489c', '#9E1B1B', '#9E1B1B', '#c9a24a', '#2f6a3a', '#5a2a6a', '#1a2f6a'];
    const c = 16; for (let y = 0; y < N; y += c) for (let x = 0; x < N; x += c) { g.fillStyle = pal[Math.floor(R() * pal.length)]; g.fillRect(x, y, c, c); }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const cx = (i + 0.5) * N / 4, cy = (j + 0.5) * N / 4; g.fillStyle = '#9E1B1B'; g.beginPath(); g.arc(cx, cy, 46, 0, 2 * PI); g.fill(); g.fillStyle = '#1F3F8C'; g.beginPath(); g.arc(cx, cy, 36, 0, 2 * PI); g.fill(); g.fillStyle = '#d8b860'; g.beginPath(); g.arc(cx, cy, 14, 0, 2 * PI); g.fill(); g.strokeStyle = '#d8b860'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 46, 0, 2 * PI); g.stroke(); }
    g.strokeStyle = '#101010'; g.lineWidth = 2; for (let y = 0; y <= N; y += c) { g.beginPath(); g.moveTo(0, y); g.lineTo(N, y); g.stroke(); } for (let x = 0; x <= N; x += c * 2) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, N); g.stroke(); }
  });
}
function plankTex(base, { S = 2.4, plank = 0.2, iron = true, seed = 9 } = {}) {
  return canvasTex(512, (g, N) => {
    const R = rng(seed), b = hex(base), n = Math.round(S / plank), pw = N / n;
    for (let i = 0; i < n; i++) { g.fillStyle = rgb(b, 0.85 + 0.25 * R()); g.fillRect(i * pw, 0, pw, N); g.fillStyle = rgb(b, 0.55); g.fillRect(i * pw, 0, 2, N); for (let k = 0; k < 14; k++) { g.fillStyle = rgb(b, 0.75 + 0.3 * R(), 0.5); g.fillRect(i * pw + R() * pw, R() * N, 1.2, 30 + 80 * R()); } }
    if (iron) for (const y of [0.18, 0.5, 0.82]) { const yy = y * N; g.fillStyle = '#1e1c1a'; g.fillRect(0, yy, N, 12); for (let x = 10; x < N; x += 26) { g.fillStyle = '#4a4440'; g.beginPath(); g.arc(x, yy + 6, 3.5, 0, 2 * PI); g.fill(); } }
  });
}
function noiseTex(base, seed = 11, amp = 0.3, blob = 6) {
  return canvasTex(256, (g, N) => { const R = rng(seed), b = hex(base); g.fillStyle = rgb(b); g.fillRect(0, 0, N, N); for (let i = 0; i < 2500; i++) { g.fillStyle = rgb(b, 1 - amp + 2 * amp * R(), 0.5); g.beginPath(); g.arc(R() * N, R() * N, 1 + blob * R(), 0, 2 * PI); g.fill(); } });
}
function clothTex(seed = 13) { // vải thêu huy hiệu: dải đỏ / lam, viền vàng, sư tử / hoa huệ cách điệu
  return canvasTex(512, (g, N) => {
    const cols = [COL.glassR, COL.glassB]; const w = N / 4;
    for (let i = 0; i < 4; i++) { g.fillStyle = cols[i % 2]; g.fillRect(i * w, 0, w, N); }
    g.fillStyle = COL.gold; g.fillRect(0, 0, N, 22); g.fillRect(0, N - 22, N, 22);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const cx = (i + 0.5) * w, cy = (j + 0.5) * N / 2; g.fillStyle = COL.gold; g.beginPath(); g.moveTo(cx, cy - 50); g.lineTo(cx + 26, cy - 8); g.lineTo(cx + 12, cy - 4); g.lineTo(cx + 30, cy + 40); g.lineTo(cx, cy + 22); g.lineTo(cx - 30, cy + 40); g.lineTo(cx - 12, cy - 4); g.lineTo(cx - 26, cy - 8); g.closePath(); g.fill(); }
    for (let x = 0; x < N; x += 32) { g.fillStyle = COL.gold; g.beginPath(); g.moveTo(x, N - 22); g.lineTo(x + 16, N - 4); g.lineTo(x + 32, N - 22); g.fill(); }
  });
}
function tileFloorTex() { return canvasTex(256, (g, N) => { const s = N / 8; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#9B5A3C' : '#c49a5e'; g.fillRect(i * s, j * s, s, s); g.strokeStyle = '#5a3a28'; g.strokeRect(i * s, j * s, s, s); } }); }

/** bề rộng thật (m) một ô texture theo khoá vật liệu — UV = toạ độ thế giới / S */
export function texScale(key) {
  if (/^(wall|base)/.test(key)) return 4; if (/^dress/.test(key)) return 2; if (/^(slate|roofHall|stoneSlate|roofLib)/.test(key)) return 3;
  if (/^lead/.test(key)) return 4; if (key === 'clay') return 2; if (key === 'glass') return 1.2; if (key === 'stained') return 2.4;
  if (/^(door|boards)/.test(key)) return 2.4; if (/^(oak|plaster|cloth|floor|turf|leaf|willow)/.test(key)) return 2; return 1;
}
/** UV chiếu hộp theo mét cho mọi phần của acc (gọi một lần sau khi dựng xong) */
export function finishUV(acc) {
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (const [key, list] of acc.parts) {
    const S = texScale(key);
    for (const g of list) {
      const p = g.attributes.position, uv = new Float32Array(p.count * 2);
      for (let i = 0; i < p.count; i += 3) {
        a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
        n.subVectors(b, a).cross(c.clone().sub(a)); const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
        for (let k = 0; k < 3; k++) { const v = k === 0 ? a : k === 1 ? b : c; let U, W; if (ay >= ax && ay >= az) { U = v.x; W = v.z; } else if (ax >= az) { U = v.z; W = v.y; } else { U = v.x; W = v.y; } uv[(i + k) * 2] = U / S; uv[(i + k) * 2 + 1] = W / S; }
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    }
  }
  return acc;
}

let MATS = null;
/** vật liệu Gothic: wall/base/dress + mã bảng màu (S, P, K, G, Q, L, R, O, H, W, B), mái, kính, gỗ, vải… */
export function goMats() {
  if (MATS) return MATS;
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.88, ...o }), M = {};
  const T = (t, col, o = {}) => std(t ? { map: t, ...o } : { color: col, ...o });
  let seed = 21;
  for (const [k, p] of Object.entries(GO)) {
    M['wall' + k] = T(masonry(p.wall, { rubble: p.rubble, course: p.band ? 1 / 3 : 0.4, band: p.band && { every: 6, n: 2, col: p.band }, wash: p.wash, seed: seed++ }), p.wash || p.wall);
    M['base' + k] = T(masonry(darken(p.wall, 0.8), { rubble: false, course: 0.5, seed: seed++ }), darken(p.wall, 0.8));
    M['dress' + k] = T(masonry(p.dress, { S: 2, course: 1 / 3, seed: seed++, mortar: 1.08 }), p.dress);
  }
  Object.assign(M, {
    slate: T(rowsTex(COL.slate, { rows: 12, seed: 2 }), COL.slate), roofHall: T(rowsTex(COL.hallRoof, { rows: 13, seed: 4, wMin: 0.3, wMax: 0.6 }), COL.hallRoof),
    stoneSlate: T(rowsTex(COL.stoneSlate, { rows: 13, seed: 6, wMin: 0.3, wMax: 0.7 }), COL.stoneSlate), roofLib: T(rowsTex(COL.libRoof, { rows: 13, seed: 8, wMin: 0.3, wMax: 0.7 }), COL.libRoof),
    clay: T(rowsTex(COL.clay, { S: 2, rows: 12, wMin: 0.24, wMax: 0.3, seed: 10, shadow: 0.5 }), COL.clay),
    lead: T(leadTex(COL.lead), COL.lead, { roughness: 0.6, metalness: 0.25 }), leadOld: T(leadTex(COL.leadOld, 9), COL.leadOld, { roughness: 0.6, metalness: 0.2 }),
    ridge: std({ color: '#3c3a38' }), ridgeClay: std({ color: '#7a3e2a' }),
    glass: T(glassTex(false), '#28323a', { roughness: 0.25, metalness: 0.3 }), stained: T(glassTex(true), COL.glassB, { roughness: 0.3, emissive: '#1a1030', emissiveIntensity: 0.4 }),
    door: T(plankTex('#5a3f2a'), COL.oak), boards: T(plankTex(COL.boards, { iron: false, plank: 0.25 }), COL.boards),
    oak: T(noiseTex(COL.oak, 3, 0.18, 3), COL.oak), oakD: T(noiseTex(COL.oakD, 4, 0.18, 3), COL.oakD), chestnut: T(noiseTex(COL.chestnut, 5, 0.18, 3), COL.chestnut),
    plaster: T(noiseTex(COL.plaster, 6, 0.06, 8), COL.plaster), cloth: T(clothTex(), COL.glassR, { roughness: 0.95, side: THREE.DoubleSide }),
    gold: std({ color: COL.gold, roughness: 0.35, metalness: 0.7 }), iron: std({ color: '#26231f', roughness: 0.5, metalness: 0.5 }), dark: std({ color: '#15130f', roughness: 1 }),
    floor: T(tileFloorTex(), COL.floor), turf: T(noiseTex(COL.turf, 7, 0.25, 4), COL.turf), leaf: T(noiseTex(COL.leaf, 8, 0.35, 5), COL.leaf, { roughness: 0.8 }),
    brick: T(masonry(COL.brick, { S: 2, course: 0.075 * 2, seed: 77 }), COL.brick), willow: T(noiseTex(COL.willow, 9, 0.2, 2), COL.willow),
    water: std({ color: '#4a6a72', roughness: 0.15, metalness: 0.2 }), rose: std({ color: '#b8324a', roughness: 0.7 }),
  });
  MATS = M; return M;
}

// ---------------------------------------------------------------- hình học
const v2 = ([x, y]) => new THREE.Vector2(x, y);
/** đùn đa giác (u, y) (có lỗ) dày d theo w, từ w = z0 tới z0 + d */
export function ext(outer, holes, d, z0 = 0) {
  const s = new THREE.Shape(outer.map(v2)); for (const h of holes || []) if (h && h.length > 2) s.holes.push(new THREE.Path(h.map(v2)));
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 4 }); g.translate(0, 0, z0); return g;
}
/** đùn biên dạng (w, y) dọc u từ u0 tới u1 (trụ ốp, gờ chỉ, chân tường, mái hắt) */
export function extU(pts, u0, u1) { const g = ext(pts, null, u1 - u0); g.rotateY(-PI / 2); g.translate(u1, 0, 0); return g; }
/** tấm kín: mặt trên là đa giác lồi pts (V, ngược chiều kim đồng hồ nhìn từ ngoài), dày th về phía trong */
export function prism(pts, th) {
  const n = new THREE.Vector3(); for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n.x += (a.y - b.y) * (a.z + b.z); n.y += (a.z - b.z) * (a.x + b.x); n.z += (a.x - b.x) * (a.y + b.y); } n.normalize();
  const bot = pts.map((p) => p.clone().addScaledVector(n, -th)), P = [], tri = (a, b, c) => P.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 1; i < pts.length - 1; i++) { tri(pts[0], pts[i], pts[i + 1]); tri(bot[0], bot[i + 1], bot[i]); }
  for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; tri(pts[i], bot[i], bot[j]); tri(pts[i], bot[j], pts[j]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals(); return g;
}
/** lăng trụ đa giác đều n cạnh (cạnh phẳng hướng +z khi rot = 0), apothem a0 dưới / a1 trên */
export function polyCyl(n, a0, a1, h, x = 0, y = 0, z = 0, rot = 0) {
  const r0 = a0 / Math.cos(PI / n), r1 = a1 / Math.cos(PI / n), g = new THREE.CylinderGeometry(r1, r0, h, n); g.rotateY(PI / n - rot); g.translate(x, y + h / 2, z); return g;
}
/** đỉnh đa giác đều (pháp tuyến cạnh k: góc 2πk/n + rot, cùng quy ước tower.js) */
export function pverts(n, a, rot = 0) { const r = a / Math.cos(PI / n); return Array.from({ length: n }, (_, k) => { const t = (2 * PI * k) / n + PI / n + rot; return [Math.cos(t) * r, Math.sin(t) * r]; }); }
/** các cạnh đa giác đều: tâm cạnh, pháp tuyến, dài, ry (khung mặt tường: +w = pháp tuyến) */
export function psides(n, a, rot = 0) {
  return Array.from({ length: n }, (_, k) => { const t = (2 * PI * k) / n + rot, nx = Math.cos(t), nz = Math.sin(t); return { k, nx, nz, mx: nx * a, mz: nz * a, len: 2 * a * Math.tan(PI / n), ry: Math.atan2(nx, nz) }; });
}

// ---------------------------------------------------------------- vòm nhọn và ô cửa
/** điểm vòm từ chân trái tới chân phải: equi (vòm đều, r = w), lancet (r = 1,5 w), drop (r = 0,72 w), four (4 tâm), round, square */
export function archPts(w, ys, kind = 'equi', n = 7, cx = 0) {
  const hw = w / 2; if (kind === 'square') return [[cx - hw, ys], [cx + hw, ys]];
  const L = [];
  if (kind === 'four') { const r1 = w * 0.24, c = -hw + r1, a1 = 0.36 * PI, m = Math.max(2, n - 2); for (let i = 0; i <= m; i++) { const a = PI - ((PI - a1) * i) / m; L.push([c + r1 * Math.cos(a), ys + r1 * Math.sin(a)]); } L.push([0, ys + w * 0.32]); }
  else if (kind === 'round') { for (let i = 0; i <= n; i++) { const a = PI - (PI / 2) * (i / n); L.push([hw * Math.cos(a), ys + hw * Math.sin(a)]); } }
  else { const k = kind === 'lancet' ? 1.5 : kind === 'drop' ? 0.72 : 1, r = k * w, c = -hw + r, ta = Math.acos(Math.max(-1, Math.min(1, -c / r))); for (let i = 0; i <= n; i++) { const a = PI - ((PI - ta) * i) / n; L.push([c + r * Math.cos(a), ys + r * Math.sin(a)]); } }
  const R = L.slice(0, -1).reverse().map(([x, y]) => [-x, y]);
  return [...L, ...R].map(([x, y]) => [x + cx, y]);
}
export function apexOf(w, kind = 'equi') { if (kind === 'square') return 0; if (kind === 'four') return w * 0.32; if (kind === 'round') return w / 2; const k = kind === 'lancet' ? 1.5 : kind === 'drop' ? 0.72 : 1, r = k * w, c = -w / 2 + r; return Math.sqrt(r * r - c * c); }
/** lá chẽ (cusp): m thuỳ trên đầu vòm — mũi chẽ nhô vào trong */
function cusp(pts, m, depth, cx, ys) {
  const N = pts.length - 1;
  return pts.map(([x, y], i) => { const t = i / N, d = depth * Math.pow(1 - Math.abs(Math.sin(PI * m * t)), 3) * Math.pow(Math.sin(PI * t), 0.6), dx = cx - x, dy = ys - 0.15 - y, L = Math.hypot(dx, dy) || 1; return [x + (dx / L) * d, y + (dy / L) * d]; });
}
/** đường bao ô mở (u tâm, rộng w, đáy y0, chân vòm ys, kiểu đầu head) — ngược chiều kim đồng hồ */
export function outline(o, extra = 0) {
  const w = o.w + 2 * extra, hw = w / 2, head = o.head || 'equi';
  return [[o.u - hw, o.y0 - extra], [o.u + hw, o.y0 - extra], ...archPts(w, o.ys, head, head === 'square' ? 1 : 8, o.u).reverse().map(([x, y]) => [x, head === 'square' ? y + extra : y])];
}
const lightPts = (uc, lw, yb, top, head, cu) => {
  if (head === 'square') { const ap = apexOf(lw, 'drop'), sp = top - ap; let a = archPts(lw, sp, 'drop', 12, uc); if (cu) a = cusp(a, cu, lw * 0.16, uc, sp); return [[uc - lw / 2, yb], [uc + lw / 2, yb], ...a.reverse()]; }
  const n = cu === 5 ? 15 : 12; let a = archPts(lw, top, head, n, uc); if (cu) a = cusp(a, cu, lw * 0.17, uc, top);
  return [[uc - lw / 2, yb], [uc + lw / 2, yb], ...a.reverse()];
};
/** lá k thuỳ (0 = tròn) — ô hoa trên đầu cửa sổ (oculus / quatrefoil / trefoil) */
export function foil(cx, cy, r, k = 4, c = 0.3, N = 40) { return Array.from({ length: N }, (_, j) => { const t = (2 * PI * j) / N + (k === 3 ? PI / 2 : 0), rr = k ? r * (1 - c * Math.pow(Math.abs(Math.sin((k * t) / 2)), 1.3)) : r; return [cx + rr * Math.cos(t), cy + rr * Math.sin(t)]; }); }
function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0; return Math.hypot(px - ax - t * dx, py - ay - t * dy); }
function polyDist(px, py, polys) { let d = Infinity; for (const P of polys) for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; d = Math.min(d, segDist(px, py, a[0], a[1], b[0], b[1])); } return d; }
/** ô hoa lớn nhất vừa giữa đầu vòm và các ô sáng (tâm trên trục u) */
function bestOculus(u, ylo, yhi, polys, m, k, rMax) { let best = null; for (let i = 0; i <= 20; i++) { const yc = ylo + ((yhi - ylo) * i) / 20, r = Math.min(rMax, polyDist(u, yc, polys) - m); if (r > 0.12 && (!best || r > best.r)) best = { yc, r }; } return best ? foil(u, best.yc, best.r, k, k ? 0.3 : 0, k ? 48 : 28) : null; }
/**
 * lỗ của song đá (tracery) trong ô cửa o: tr = { n (số ô sáng), cusp (3 | 5), transom (0..1), oc (k thuỳ ô hoa, -1 = không), pairs (2 cặp + ô hoa lớn) }
 * trả mảng đa giác lỗ (toạ độ u, y)
 */
export function traceryHoles(o) {
  const tr = o.tr || {}, head = o.head || 'equi', m = tr.m ?? 0.1, mm = tr.mm ?? 0.14, out = [], ol = outline(o);
  if (tr.pairs) {
    const pw = (o.w - 2 * m - mm) / 2, ysS = o.ys - 0.06 * o.w;
    const subs = [-1, 1].map((s) => ({ u: o.u + s * (pw / 2 + mm / 2), w: pw, y0: o.y0 + m, ys: ysS, head: 'equi', tr: { n: 2, cusp: tr.cusp, oc: tr.subOc ?? 3, m: 0.07, mm: 0.11 } }));
    const obst = [ol]; for (const s of subs) { const h = traceryHoles({ ...s, y0: o.y0 }); out.push(...h); obst.push(...h, outline(s)); }
    const big = bestOculus(o.u, ysS + apexOf(pw) + 0.2, o.ys + apexOf(o.w, head), obst, m, tr.oc ?? 6, o.w * 0.4); if (big) out.push(big);
    return out;
  }
  const n = tr.n || 1, lw = (o.w - 2 * m - (n - 1) * mm) / n, top = head === 'square' ? o.ys - m : o.ys - 0.05 * o.w;
  const yt = tr.transom ? o.y0 + (o.ys - o.y0) * tr.transom : null;
  for (let i = 0; i < n; i++) {
    const uc = o.u - o.w / 2 + m + lw / 2 + i * (lw + mm), lh = head === 'square' ? 'square' : n === 1 ? head : 'equi';
    if (yt) { out.push([[uc - lw / 2, o.y0 + m], [uc + lw / 2, o.y0 + m], [uc + lw / 2, yt - mm / 2], [uc - lw / 2, yt - mm / 2]]); out.push(lightPts(uc, lw, yt + mm / 2, top, lh, tr.cusp)); }
    else out.push(lightPts(uc, lw, o.y0 + m, top, lh, tr.cusp));
  }
  if (n >= 2 && head !== 'square' && (tr.oc ?? 4) >= 0) { const ap = top + apexOf(lw); const oc = bestOculus(o.u, ap + 0.15, o.ys + apexOf(o.w, head), [ol, ...out], m, tr.oc ?? 4, o.w * 0.36); if (oc) out.push(oc); }
  return out;
}
/** khung U (chấn song, thành cửa vát) quanh ô mở, bản rộng b */
function frameU(o, b) {
  const hw = o.w / 2, head = o.head || 'equi', n = head === 'square' ? 1 : 8;
  const inner = archPts(o.w, o.ys, head, n, o.u), outer = archPts(o.w + 2 * b, o.ys, head, n, o.u).reverse();
  if (head === 'square') { inner.forEach((p) => p); outer.forEach((p) => { p[1] += b; }); }
  return [[o.u - hw - b, o.y0 - (o.door ? 0 : b * 0.4)], [o.u - hw, o.y0 - (o.door ? 0 : b * 0.4)], ...inner, [o.u + hw, o.y0 - (o.door ? 0 : b * 0.4)], [o.u + hw + b, o.y0 - (o.door ? 0 : b * 0.4)], ...outer];
}
/** gờ mũ (hood mould / label) trên đầu ô mở, có đầu chặn */
function hoodPts(o, b) {
  const head = o.head || 'equi';
  if (head === 'square') { const xl = o.u - o.w / 2 - b - 0.18, xr = o.u + o.w / 2 + b + 0.18, yt = o.ys + b + 0.24; return [[xl, yt], [xl, yt - 0.5], [xl + 0.16, yt - 0.5], [xl + 0.16, yt - 0.15], [xr - 0.16, yt - 0.15], [xr - 0.16, yt - 0.5], [xr, yt - 0.5], [xr, yt]]; }
  const wo = o.w + 2 * (b + 0.2), wi = o.w + 2 * (b + 0.05), out = archPts(wo, o.ys, head, 8, o.u), inn = archPts(wi, o.ys, head, 8, o.u).reverse(), dy = 0.32;
  return [[o.u - wo / 2, o.ys - dy], ...out, [o.u + wo / 2, o.ys - dy], [o.u + wi / 2, o.ys - dy], ...inn, [o.u - wi / 2, o.ys - dy]];
}
/** khe bắn (thường hoặc chữ thập) — đa giác */
export function slitPts(o) {
  const hw = (o.w || 0.14) / 2, y0 = o.y0, y1 = o.ys;
  if (!o.cross) return [[o.u - hw, y0], [o.u + hw, y0], [o.u + hw, y1], [o.u - hw, y1]];
  const yc = (y0 + y1) / 2 + 0.15, a = 0.32, h2 = hw;
  return [[o.u - hw, y0], [o.u + hw, y0], [o.u + hw, yc - h2], [o.u + a, yc - h2], [o.u + a, yc + h2], [o.u + hw, yc + h2], [o.u + hw, y1], [o.u - hw, y1], [o.u - hw, yc + h2], [o.u - a, yc + h2], [o.u - a, yc - h2], [o.u - hw, yc - h2]];
}
export const holeOf = (o) => (o.slit ? slitPts(o) : outline(o));
/**
 * phụ kiện một ô mở trong khung mặt tường F (tường dày t): kính lùi sâu, song đá, khung U, gờ mũ, bậu; cửa đi: cánh gỗ đinh sắt + 2 lớp vòm.
 * o: { u, w, y0, ys, head, tr, door, slit, cross, glass: 'glass'|'stained', hood, frame }
 */
export function openingParts(F, acc, o, t, dress) {
  const face = t / 2, wg = face - Math.min(0.55, t * 0.42);
  if (o.slit) { F.add(acc, 'dark', ext(slitPts(o), null, 0.04, wg)); if (o.frame !== false) F.add(acc, dress, ext([[o.u - 0.32, o.y0 - 0.2], [o.u + 0.32, o.y0 - 0.2], [o.u + 0.32, o.ys + 0.2], [o.u - 0.32, o.ys + 0.2]], [slitPts(o)], 0.06, face - 0.02)); return; }
  const ol = outline(o);
  if (o.door) {
    if (o.open ?? o.w >= 2.39) { const lh = o.ys - o.y0 + apexOf(o.w, o.head || 'equi') * 0.45, lw = o.w / 2 - 0.08; for (const sd of [-1, 1]) F.add(acc, 'door', boxB(0.1, lh, lw, o.u + sd * (o.w / 2 - 0.07), o.y0, wg - 0.06 - lw / 2)); } // lối vào chính: hai cánh mở vào trong (không chặn va chạm)
    else F.add(acc, 'door', ext(ol, null, 0.12, wg - 0.06));
    F.add(acc, dress, ext(frameU(o, 0.16), null, 0.3, face - 0.22));
    F.add(acc, dress, ext(frameU({ ...o, w: o.w + 0.32 }, 0.14), null, 0.22, face - 0.16));
  } else {
    F.add(acc, o.glass || 'glass', ext(ol, null, 0.04, wg - 0.02));
    if (o.tr) F.add(acc, dress, ext(ol, traceryHoles(o), 0.14, wg + 0.02));
    if (o.frame !== false) F.add(acc, dress, ext(frameU(o, 0.14), null, 0.26, face - 0.2));
    F.add(acc, dress, boxB(o.w + 0.4, 0.14, 0.34, o.u, o.y0 - 0.2, face - 0.02));            // bậu dốc
  }
  if (o.hood !== false) F.add(acc, dress, ext(hoodPts(o, o.door ? 0.3 : 0.14), null, 0.14, face + 0.02));
}
/** mặt tường có lỗ cửa: đa giác từ u0 tới u1, đáy yb, đỉnh top (số hoặc danh sách điểm đi từ u1 về u0) */
export function wallFace(F, acc, { key, dress, u0, u1, yb = 0, top, t, ops = [] }) {
  const outer = [[u0, yb], [u1, yb], ...(Array.isArray(top) ? top : [[u1, top], [u0, top]])];
  F.add(acc, key, ext(outer, ops.map(holeOf), t, -t / 2));
  for (const o of ops) openingParts(F, acc, o, t, dress);
}
/** đoạn [u0,u1] trừ các khoảng bị ô mở cắt ngang ở cao y */
export function freeSpans(u0, u1, y, ops, pad = 0.25) {
  const cut = ops.filter((o) => o.y0 - 0.35 < y + 0.3 && (o.slit ? o.ys : o.ys + apexOf(o.w, o.head || 'equi')) + 0.35 > y).map((o) => [o.u - (o.w || 0.14) / 2 - pad - 0.3, o.u + (o.w || 0.14) / 2 + pad + 0.3]).sort((a, b) => a[0] - b[0]);
  const out = []; let s = u0; for (const [a, b] of cut) { if (a > s + 0.3) out.push([s, Math.min(a, u1)]); s = Math.max(s, b); } if (u1 > s + 0.3) out.push([s, u1]); return out;
}
/** gờ chỉ (string course) có mặt vát — biên dạng (w, y) ở mặt tường */
export const stringProf = (t, y, p = 0.14, h = 0.24) => [[t / 2 - 0.15, y], [t / 2 + p, y], [t / 2 + p, y + h * 0.45], [t / 2, y + h], [t / 2 - 0.15, y + h]];
/** chân tường giật vát (plinth / base course) */
export const plinthProf = (t, h, p = 0.25) => [[-t / 2 + 0.1, 0], [t / 2 + p, 0], [t / 2 + p, h], [t / 2, h + p * 1.2], [-t / 2 + 0.1, h + p * 1.2]];

// ---------------------------------------------------------------- trụ ốp (buttress) và tháp nhọn nhỏ (pinnacle)
/** trụ ốp giật cấp tại u (khung mặt tường F): sâu d, rộng bw, cao h; stages = số cấp; pin = có pinnacle trên đỉnh */
export function buttress(F, acc, key, dress, { u, t, d, bw, h, stages = 2, pin = 0, y0 = 0 }) {
  const w0 = t / 2 - 0.2, pts = [[w0, y0], [t / 2 + d, y0]]; let dd = d;
  for (let s = 0; s < stages; s++) { const yS = y0 + ((h - y0) * (s + 1)) / (stages + (pin ? 0 : 0.35)); const dn = s === stages - 1 ? (pin ? dd : 0) : dd * 0.68; pts.push([t / 2 + dd, yS]); if (s < stages - 1) { pts.push([t / 2 + dn, yS + (dd - dn) * 1.3]); dd = dn; } }
  if (!pin) { const yl = pts[pts.length - 1][1]; pts.push([t / 2, yl + dd * 1.25], [w0, yl + dd * 1.25]); }
  else { const yl = pts[pts.length - 1][1]; pts.push([w0, yl]); }
  F.add(acc, key, extU(pts, u - bw / 2, u + bw / 2));
  for (let i = 2; i < pts.length - 2; i += 2) { const [wa, ya] = pts[i]; F.add(acc, dress, boxB(bw + 0.08, 0.12, 0.2, u, ya - 0.06, wa - 0.06)); } // bậu giọt nước ở mỗi cấp
  if (pin) pinnacle(F, acc, dress, u, pts[pts.length - 1][1], t / 2 + dd / 2, Math.min(bw, dd) * 0.9, pin);
}
/** tháp nhọn nhỏ: thân vuông có đầu hồi nhỏ 4 mặt + chóp 4 cạnh có móc lá (crocket) + hoa đầu (finial) */
export function pinnacle(F, acc, key, u, y, w, s, h) {
  const hb = h * 0.38; F.add(acc, key, boxB(s, hb, s, u, y, w));
  for (let k = 0; k < 4; k++) { const ry = (k * PI) / 2, g = ext([[-s / 2, 0], [s / 2, 0], [0, s * 0.55]], null, 0.12, s / 2 - 0.06); g.rotateY(ry); g.translate(u, y + hb, w); F.add(acc, key, g); }
  const sp = cyl(s * 0.62, 0.02, h - hb, 0, 0, 0, 4); sp.rotateY(PI / 4); sp.translate(u, y + hb, w); F.add(acc, key, sp);
  for (let i = 1; i <= 3; i++) { const yy = y + hb + ((h - hb) * i) / 4.2, rr = s * 0.62 * (1 - i / 4.2); for (let k = 0; k < 4; k++) { const a = (k * PI) / 2 + PI / 4; F.add(acc, key, box(0.14, 0.14, 0.14, u + Math.cos(a) * rr * 1.05, yy, w + Math.sin(a) * rr * 1.05)); } }
  F.add(acc, key, lathe([[0.001, 0], [0.14, 0.05], [0.07, 0.18], [0.16, 0.26], [0.001, 0.42]], u, y + h - 0.05, w, 8));
}

// ---------------------------------------------------------------- lỗ châu mai (A2): merlon 2,0 × 1,0 m · crenel 0,7 m · lan can ngực 1,0 m
export const CREN = { mw: 2.0, cw: 0.7, mh: 1.0, bh: 1.0, pt: 0.55 };
/** chia đoạn dài L: bắt đầu và kết thúc bằng merlon */
function merlonSplit(L, mw, cw) { const n = Math.max(1, Math.round((L + cw) / (mw + cw))); const w = n > 1 ? (L - (n - 1) * cw) / n : L; return { n, w }; }
/** lan can răng cưa thẳng trong khung F: dọc u ∈ [u0,u1], tâm bề dày ở w = wc, chân ở y */
export function crenelRun(F, acc, key, dress, { u0, u1, y, wc = 0, c = CREN, slits = true }) {
  const L = u1 - u0, { n, w } = merlonSplit(L, c.mw, c.cw);
  F.add(acc, key, boxB(L, c.bh, c.pt, (u0 + u1) / 2, y, wc));
  F.add(acc, dress, boxB(L + 0.04, 0.12, c.pt + 0.06, (u0 + u1) / 2, y + c.bh - 0.06, wc));   // bậu crenel
  for (let i = 0; i < n; i++) {
    const um = u0 + w / 2 + i * (w + c.cw);
    F.add(acc, key, boxB(w, c.mh, c.pt, um, y + c.bh, wc)); F.add(acc, dress, boxB(w + 0.04, 0.1, c.pt + 0.04, um, y + c.bh + c.mh - 0.05, wc));
    if (slits && w > 1.2 && i % 2 === 0) F.add(acc, 'dark', box(0.1, c.mh * 0.62, 0.04, um, y + c.bh + c.mh * 0.44, wc + c.pt / 2 + 0.005));
  }
}
/** lan can răng cưa vòng tròn tâm (cx, cz) bán kính ngoài r */
export function crenelRing(F, acc, key, dress, { cx = 0, cz = 0, r, y, c = CREN, slits = true }) {
  const ri = r - c.pt; F.add(acc, key, annulus(cx, cz, ri, r, y, c.bh, 40)); F.add(acc, dress, annulus(cx, cz, ri - 0.03, r + 0.03, y + c.bh - 0.06, 0.12, 40));
  const C = 2 * PI * (r - c.pt / 2), n = Math.max(3, Math.round(C / (c.mw + c.cw))), da = (2 * PI) / n, aw = da * (c.mw / (c.mw + c.cw));
  for (let i = 0; i < n; i++) {
    const a0 = i * da; F.add(acc, key, sector(cx, cz, ri, r, a0, a0 + aw, y + c.bh, c.mh)); F.add(acc, dress, sector(cx, cz, ri - 0.02, r + 0.02, a0, a0 + aw, y + c.bh + c.mh - 0.05, 0.1));
    if (slits && i % 2 === 0) { const am = a0 + aw / 2; F.add(acc, 'dark', box(0.1, c.mh * 0.62, 0.04, cx + Math.cos(am) * (r + 0.005), y + c.bh + c.mh * 0.44, cz + Math.sin(am) * (r + 0.005), PI / 2 - am)); }
  }
}
/** lan can răng cưa quanh đa giác đều (n, apothem tâm bề dày ac) — mỗi cạnh mở và đóng bằng merlon */
export function crenelPoly(F, acc, key, dress, { n, ac, y, rot = 0, c = CREN, gaps = [] }) {
  for (const s of psides(n, ac, rot)) {
    const f = F.sub(s.mx, s.mz, s.ry), L = s.len + c.pt * Math.tan(PI / n) * 0.9;
    const g = gaps.find((q) => q.k === s.k);
    if (g) { crenelRun(f, acc, key, dress, { u0: -L / 2, u1: -g.w / 2, y, c }); crenelRun(f, acc, key, dress, { u0: g.w / 2, u1: L / 2, y, c }); }
    else crenelRun(f, acc, key, dress, { u0: -L / 2, u1: L / 2, y, c });
  }
}
/** vành khăn kín (đùn đa giác có lỗ). Mặt cắt vẽ với y = −sin để sau rotateX(−π/2) góc a đo từ +x về +z */
export function annulus(cx, cz, r0, r1, y, h, N = 32) {
  const ring = (r) => Array.from({ length: N }, (_, i) => [Math.cos((2 * PI * i) / N) * r, -Math.sin((2 * PI * i) / N) * r]);
  const g = ext(ring(r1), [ring(r0)], h); g.rotateX(-PI / 2); g.translate(cx, y, cz); return g;
}
/** quạt vành (merlon cong) từ góc a0 tới a1 */
export function sector(cx, cz, r0, r1, a0, a1, y, h) {
  const N = Math.max(2, Math.ceil(((a1 - a0) / (2 * PI)) * 40)), P = [];
  for (let i = 0; i <= N; i++) { const a = a0 + ((a1 - a0) * i) / N; P.push([Math.cos(a) * r1, -Math.sin(a) * r1]); }
  for (let i = N; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / N; P.push([Math.cos(a) * r0, -Math.sin(a) * r0]); }
  const g = ext(P, null, h); g.rotateX(-PI / 2); g.translate(cx, y, cz); return g;
}

// ---------------------------------------------------------------- mái dốc thẳng (C.1: không cong) + đầu hồi đá
/**
 * mái hai dốc trong khung F (nóc dọc x): mép tường ngoài ở z = ±D/2, đỉnh tường yE, dốc pitch (độ), vươn hiên ov,
 * x từ xl tới xr. Trả { yRidge (mặt trên nóc), yTop(z) }.
 */
export function gableRoof(F, acc, key, { xl, xr, D, yE, pitch = 50, ov = 0.45, th = 0.28, ridgeKey = 'ridge', zc = 0 }) {
  const tp = Math.tan((pitch * PI) / 180), tv = th / Math.cos((pitch * PI) / 180), h = D / 2;
  const yT = (z) => yE + tv + (h - Math.abs(z - zc)) * tp, ye = yT(zc + h + ov), yr = yT(zc);
  F.add(acc, key, prism([V(xl, ye, zc + h + ov), V(xr, ye, zc + h + ov), V(xr, yr, zc), V(xl, yr, zc)], th));
  F.add(acc, key, prism([V(xr, ye, zc - h - ov), V(xl, ye, zc - h - ov), V(xl, yr, zc), V(xr, yr, zc)], th));
  F.add(acc, ridgeKey, box(xr - xl, 0.22, 0.34, (xl + xr) / 2, yr + 0.02, zc));
  return { yRidge: yr, yT, tp, tv };
}
/** mái chóp đa giác (n mặt) từ apothem a (cao y) lên đỉnh yA; aTop > 0 → cụt ở apothem aTop (để đặt đèn lồng) */
export function pyramidRoof(F, acc, key, { n, a, y, yA, aTop = 0, rot = 0, th = 0.25, cx = 0, cz = 0 }) {
  const vb = pverts(n, a, rot), vt = pverts(n, Math.max(aTop, 0.001), rot), yt = y + (yA - y) * (1 - aTop / a);
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n, A = V(vb[k][0] + cx, y, vb[k][1] + cz), B = V(vb[j][0] + cx, y, vb[j][1] + cz);
    if (aTop > 0) F.add(acc, key, prism([B, A, V(vt[k][0] + cx, yt, vt[k][1] + cz), V(vt[j][0] + cx, yt, vt[j][1] + cz)], th));
    else F.add(acc, key, prism([B, A, V(cx, yA, cz)], th));
  }
  return yt;
}
/**
 * đầu hồi đá nhô trên mái (parapet / coped gable) trong khung mặt hồi Fg (u ngang hồi, w ra ngoài): tường tam giác + đá lợp hồi (coping)
 * + đá chân hồi (kneeler) + hoa đầu hồi (finial: 'cross' | 'pin' | 'ball' | 'cross+').
 */
export function copedGable(Fg, acc, key, dress, { D, yE, tp, tv, t, rise = 0.32, finial = 'pin', ops = [] }) {
  const h = D / 2, f = (u) => yE + tv + rise + (h - Math.abs(u)) * tp, yA = f(0);
  Fg.add(acc, key, ext([[-h, yE - 0.01], [h, yE - 0.01], [h, f(h)], [0, yA], [-h, f(-h)]], ops.map(holeOf), t, -t / 2));
  for (const o of ops) openingParts(Fg, acc, o, t, dress);
  const e = 0.14, ct = 0.3, cs = ct / Math.cos(Math.atan(tp));
  const ye = yA - (h + e) * tp; Fg.add(acc, dress, ext([[-h - e, ye], [0, yA], [h + e, ye], [h + e, ye + cs], [0, yA + cs], [-h - e, ye + cs]], null, t + 0.2, -(t + 0.2) / 2));
  for (const s of [-1, 1]) Fg.add(acc, dress, boxB(0.75, 0.55, t + 0.26, s * (h - 0.25), f(h) - 0.42, 0));      // kneeler
  finialAt(Fg, acc, dress, 0, yA + cs - 0.05, 0, finial);
  return yA + cs;
}
export function finialAt(F, acc, key, u, y, w, kind = 'pin') {
  if (kind === 'cross' || kind === 'cross+') { F.add(acc, key, boxB(0.22, 1.3, 0.2, u, y, w)); F.add(acc, key, box(0.8, 0.2, 0.2, u, y + 0.9, w)); if (kind === 'cross+') for (const s of [-1, 1]) F.add(acc, key, box(0.2, 0.2, 0.22, u + s * 0.4, y + 0.9, w)); }
  else if (kind === 'ball') F.add(acc, key, lathe([[0.001, 0], [0.18, 0.02], [0.12, 0.2], [0.26, 0.42], [0.001, 0.72]], u, y, w, 10));
  else if (kind === 'pin') { F.add(acc, key, boxB(0.36, 0.5, 0.36, u, y, w)); const sp = cyl(0.26, 0.02, 1.0, u, y + 0.5, w, 4); F.add(acc, key, sp); }
}
/** đường mái hắt / gờ đầu tường có hàng đỡ (corbel table) dọc u */
export function eaveCourse(F, acc, dress, { u0, u1, y, t, corbels = true }) {
  F.add(acc, dress, extU([[t / 2 - 0.2, y - 0.32], [t / 2 + 0.1, y - 0.32], [t / 2 + 0.26, y - 0.1], [t / 2 + 0.26, y], [t / 2 - 0.2, y]], u0, u1));
  if (corbels) for (let u = u0 + 0.5; u < u1 - 0.3; u += 0.9) F.add(acc, dress, extU([[t / 2 - 0.1, y - 0.62], [t / 2 + 0.05, y - 0.62], [t / 2 + 0.2, y - 0.4], [t / 2 + 0.2, y - 0.32], [t / 2 - 0.1, y - 0.32]], u - 0.14, u + 0.14));
}
/** góc đá đẽo (quoin) xen dài / ngắn ở mép u = uEdge (dấu s = hướng vào tường) */
export function quoins(F, acc, dress, { uEdge, s, y0, y1, t }) { let i = 0; for (let y = y0; y < y1 - 0.3; y += 0.46, i++) { const L = i % 2 ? 0.45 : 0.85; F.add(acc, dress, boxB(L, 0.4, 0.05, uEdge + (s * L) / 2, y, t / 2 + 0.01)); } }

// ---------------------------------------------------------------- ống khói
/** ống khói áp tường tại u: bầu lò (chimney breast) nhô d từ y0 tới yE, thân bát giác cao tới yTop, đầu khói có mũ */
export function chimney(F, acc, key, dress, { u, t, yE, yTop, y0 = 0, bw = 1.8, d = 0.9, oct = true }) {
  F.add(acc, key, extU([[t / 2 - 0.2, y0], [t / 2 + d, y0], [t / 2 + d, yE - 1.2], [t / 2 + d * 0.6, yE - 0.6], [t / 2 + d * 0.6, yE], [t / 2 - 0.2, yE]], u - bw / 2, u + bw / 2));
  const wc = t / 2 + d * 0.6 - 0.5, hb = Math.max(0.5, yTop - yE);
  F.add(acc, key, boxB(bw * 0.8, hb * 0.35, 1.0, u, yE, wc));
  if (oct) { F.add(acc, dress, polyCyl(8, 0.42, 0.4, hb * 0.65, u, yE + hb * 0.35, wc)); F.add(acc, dress, polyCyl(8, 0.55, 0.42, 0.25, u, yTop - 0.25, wc)); F.add(acc, 'dark', polyCyl(8, 0.26, 0.26, 0.04, u, yTop, wc)); }
  else { F.add(acc, key, boxB(bw * 0.7, hb * 0.65, 0.8, u, yE + hb * 0.35, wc)); F.add(acc, dress, boxB(bw * 0.8, 0.25, 0.95, u, yTop - 0.25, wc)); }
}

// ---------------------------------------------------------------- tượng / linh vật bóng đùn
export function silh(F, acc, key, pts, s, t, x, y, z, ry = 0) { const g = ext(pts.map(([a, b]) => [a * s, b * s]), null, t * s, -(t * s) / 2); g.rotateY(ry); g.translate(x, y, z); F.add(acc, key, g); }
/** đại bàng đá (Eagle Tower) — dáng đậu, cánh khép, đầu quay ngang */
export const EAGLE = [[-0.3, 0], [0.3, 0], [0.26, 0.18], [0.42, 0.55], [0.36, 0.95], [0.22, 1.12], [0.3, 1.32], [0.48, 1.36], [0.3, 1.46], [0.14, 1.5], [-0.04, 1.4], [-0.12, 1.16], [-0.3, 0.95], [-0.5, 0.4], [-0.62, 0.1]];
/** sư tử đứng (Harcourt) */
export const LION = [[-0.5, 0], [-0.38, 0], [-0.36, 0.3], [0.22, 0.3], [0.26, 0], [0.38, 0], [0.4, 0.42], [0.52, 0.62], [0.46, 0.84], [0.3, 0.86], [0.24, 0.66], [-0.3, 0.6], [-0.46, 0.82], [-0.56, 0.78], [-0.44, 0.52]];
