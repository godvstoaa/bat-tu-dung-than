// ============================================================================
//  BỘ CẤU KIỆN CỔ ĐIỂN PHÁP (Versailles) — dùng cho arch/tancodien.js. Theo docs/tienphu-nghiencuu/06-tancodien.md
//  (Phần chung §1 thức cột Vignola, §2 ngữ pháp mặt vườn, §3 bảng màu, §4 sai lầm phải tránh, §6 ngân sách cấu kiện).
//  Mọi cấu kiện dựng trong KHUNG MẶT ĐỨNG cục bộ: u = x (dọc mặt), y đứng, mặt ngoài hướng +z; đặt vào công trình bằng put().
//  Khoá vật liệu bắt đầu bằng 'tile' = mặt hở (kính, lan can cắt hình, giàn, mái lá) — bản vẽ không tô đen.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Acc, box, boxB, cyl, beam, slabXY, lathe, gridSurface, ribAlong, V } from './kit.js';
export { Acc, box, boxB, cyl, beam, slabXY, lathe, gridSurface, ribAlong, V };

// ---------------------------------------------------------------- bảng màu (06 › Phần chung §3, mục «Vật liệu và màu» từng công trình)
export const FC = {
  stone: '#e4d6b6', stoneDk: '#cdbb94', groove: '#9c8b6a', lead: '#868c90', leadDome: '#6e767c', slate: '#3b444c',
  gilt: '#c9a43a', gold: '#d4af37', brick: '#9e4a35', brickTrim: '#e6dcc6', rose: '#b97a72', frame: '#efebe0', glass: '#2e3b44',
  iron: '#1e1e1e', incarnat: '#b5525a', incVein: '#e8c9c4', campan: '#9c6b5e', campanG: '#7f8a6a', languedoc: '#8e2a2e',
  turquin: '#5d6c7a', violette: '#6a4b6b', carrara: '#f0eee8', ptStone: '#e6d9bc', ptFrame: '#f2efe6', amour: '#eee8dc',
  statue: '#f2f0eb', oran: '#dccba3', oranSh: '#8e7e60', boxGreen: '#2f5e3a', trellis: '#4f6b4a', satory: '#d8cbb0',
  marbleV: '#c9c7c2', water: '#5f7f86', leaf: '#3e6a33',
};

// ---------------------------------------------------------------- texture thủ tục (chỉ trong trình duyệt)
function canvasTex(w, h, draw, srgb = true) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
/** đá tảng: nền ấm, lấm tấm, mạch ngang mỗi 64 px (0,5 m khi 1 ô = 2 m), mạch đứng so le */
function stoneTex(base, joint, a = 0.22) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const v = rnd(); g.fillStyle = `rgba(${v > 0.5 ? '255,250,235' : '90,75,50'},${0.04 + rnd() * 0.06})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 2); }
    g.globalAlpha = a; g.strokeStyle = joint; g.lineWidth = 1.2;
    for (let r = 0; r < 4; r++) { const y = r * 64 + 0.5; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 2; c++) { const x = c * 128 + (r % 2) * 64 + 0.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
    g.globalAlpha = 1;
  });
}
function brickTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#cfc2a8'; g.fillRect(0, 0, w, h);
    const rows = 26, bh = h / rows;
    for (let r = 0; r < rows; r++) for (let c = -1; c < 9; c++) { const x = c * 32 + (r % 2) * 16; const t = rnd(); g.fillStyle = t < 0.33 ? '#9e4a35' : t < 0.66 ? '#8f4230' : '#a8553e'; g.fillRect(x + 1, r * bh + 1, 30, bh - 2); }
  });
}
/** tường khía rãnh «à refends»: rãnh ngang lõm mỗi 0,5 m (64 px khi 1 ô = 2 m), mép sáng dưới rãnh */
function refendTex(base, dark) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const v = rnd(); g.fillStyle = `rgba(${v > 0.5 ? '255,250,235' : '90,75,50'},${0.04 + rnd() * 0.06})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 2); }
    for (let r = 0; r < 4; r++) { const y = r * 64; g.fillStyle = dark; g.fillRect(0, y, w, 7); g.fillStyle = 'rgba(70,55,30,0.35)'; g.fillRect(0, y + 7, w, 3); g.fillStyle = 'rgba(255,248,230,0.45)'; g.fillRect(0, y - 3, w, 3); }
    g.globalAlpha = 0.12; g.strokeStyle = dark; for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const x = c * 128 + (r % 2) * 64; g.beginPath(); g.moveTo(x, r * 64); g.lineTo(x, r * 64 + 64); g.stroke(); } g.globalAlpha = 1;
  });
}
/** răng cưa (denticules): khối sáng xen khe tối, 12 răng / ô 1,92 m */
function dentilTex() { return canvasTex(256, 32, (g, w, h) => { g.fillStyle = '#5e5039'; g.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { g.fillStyle = '#efe3c6'; g.fillRect(i * (w / 12) + 2, 0, w / 12 * 0.62, h); g.fillStyle = '#c9b88f'; g.fillRect(i * (w / 12) + 2 + w / 12 * 0.52, 0, w / 12 * 0.1, h); } }); }
/** đá hồng incarnat Caunes-Minervois: nền đỏ hồng, vân trắng loang */
function marbleTex(base, vein, dark, blot = 1) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(0,0,0,${(0.03 + rnd() * 0.05) * blot})`; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 8 + rnd() * 30, 4 + rnd() * 14, rnd() * 3, 0, 7); g.fill(); }
    g.strokeStyle = vein; for (let i = 0; i < 26; i++) { g.globalAlpha = 0.25 + rnd() * 0.45; g.lineWidth = 0.6 + rnd() * 2.2; g.beginPath(); let x = rnd() * w, y = rnd() * h; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rnd() - 0.3) * 60; y += (rnd() - 0.5) * 50; g.lineTo(x, y); } g.stroke(); }
    g.globalAlpha = 0.35; g.strokeStyle = dark; for (let i = 0; i < 10; i++) { g.lineWidth = 0.6; g.beginPath(); g.moveTo(rnd() * w, rnd() * h); g.lineTo(rnd() * w, rnd() * h); g.stroke(); }
    g.globalAlpha = 1;
  });
}
/** kính chia ô nhỏ (petits bois): khung gỗ trắng ngà, cols × rows ô, phản chiếu trời nhẹ */
function glassTex(cols, rows, round = false) {
  return canvasTex(128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#46596a'); gr.addColorStop(0.45, FC.glass); gr.addColorStop(1, '#1f2a31'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(200,220,235,0.10)'; g.beginPath(); g.moveTo(0, h * 0.2); g.lineTo(w, 0); g.lineTo(w, h * 0.12); g.lineTo(0, h * 0.34); g.fill();
    g.fillStyle = FC.frame; const fb = 7, mb = 3;
    g.fillRect(0, 0, w, fb); g.fillRect(0, h - fb, w, fb); g.fillRect(0, 0, fb, h); g.fillRect(w - fb, 0, fb, h);
    if (!round) g.fillRect(w / 2 - 2.5, 0, 5, h);                                                 // đố giữa hai cánh
    for (let c = 1; c < cols * 2; c++) if (c !== cols) g.fillRect((c * w) / (cols * 2) - mb / 2, 0, mb, h);
    for (let r = 1; r < rows; r++) g.fillRect(0, (r * h) / rows - mb / 2, w, mb);
  });
}
/** con tiện quả lê (balustre en poire) cắt hình — 1 con / ô, nền trong suốt */
function balusTex(col = FC.stone, sh = FC.stoneDk) {
  return canvasTex(64, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const prof = [[0, 0.10], [0.06, 0.10], [0.09, 0.075], [0.22, 0.13], [0.34, 0.165], [0.46, 0.17], [0.58, 0.14], [0.70, 0.085], [0.80, 0.06], [0.86, 0.07], [0.90, 0.11], [0.94, 0.12], [1, 0.12]];
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, sh); gr.addColorStop(0.42, col); gr.addColorStop(0.6, '#f4ead2'); gr.addColorStop(1, sh);
    g.fillStyle = gr; g.beginPath();
    prof.forEach(([t, r], i) => { const y = h - t * h, x = w / 2 - r * w * 1.6; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    [...prof].reverse().forEach(([t, r]) => g.lineTo(w / 2 + r * w * 1.6, h - t * h)); g.closePath(); g.fill();
  });
}
/** song sắt (grille) sơn đen đầu giáo dát vàng */
function grilleTex() {
  return canvasTex(64, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = FC.iron;
    for (const x of [8, 24, 40, 56]) { g.fillRect(x - 2, 18, 4, h - 18); g.fillStyle = FC.gilt; g.beginPath(); g.moveTo(x - 5, 22); g.lineTo(x, 2); g.lineTo(x + 5, 22); g.fill(); g.fillStyle = FC.iron; }
    g.fillRect(0, 34, w, 5); g.fillRect(0, h - 40, w, 5); g.fillRect(0, h - 10, w, 10);
    g.strokeStyle = FC.gilt; g.lineWidth = 2.5; g.beginPath(); g.arc(w / 2, h - 70, 12, 0, 7); g.stroke();
  });
}
/** giàn mắt cáo (treillage) ô vuông, nền trong suốt */
function trellisTex() {
  return canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = FC.trellis; for (let i = 0; i < 8; i++) { g.fillRect(i * 16, 0, 4, h); g.fillRect(0, i * 16, w, 4); } });
}
/** lát đá cẩm thạch đen trắng ô cờ (péristyle Grand Trianon) */
function checkTex() { return canvasTex(128, 128, (g, w, h) => { for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { g.fillStyle = (r + c) % 2 ? '#2b2b2d' : '#ece8e0'; g.fillRect(c * 64, r * 64, 64, 64); } }); }
/** trần ô lõm (caissons) có hoa hồng — Temple de l'Amour */
function cofferTex() {
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = FC.amour; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const x = c * 64, y = r * 64; g.fillStyle = '#cfc6b4'; g.fillRect(x + 8, y + 8, 48, 48); g.fillStyle = '#e2dbcb'; g.fillRect(x + 14, y + 14, 36, 36); g.fillStyle = '#b9ad94'; g.beginPath(); g.arc(x + 32, y + 32, 8, 0, 7); g.fill(); }
  });
}
/** diềm chạm (rinceaux / guirlandes) cho frieze */
function friezeTex(base) {
  return canvasTex(256, 32, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,65,40,0.55)'; g.lineWidth = 2;
    for (let i = 0; i < 4; i++) { const x = i * 64; g.beginPath(); g.moveTo(x, h / 2); g.bezierCurveTo(x + 16, 2, x + 32, 2, x + 32, h / 2); g.bezierCurveTo(x + 32, h - 2, x + 48, h - 2, x + 64, h / 2); g.stroke(); g.beginPath(); g.arc(x + 16, h / 2 + 4, 4, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 48, h / 2 - 4, 4, 0, 7); g.stroke(); }
  });
}
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.82, ...o });
let MATS = null;
export function frMats() {
  if (MATS) return MATS;
  const st = stoneTex(FC.stone, '#a8956c'), pt = stoneTex(FC.ptStone, '#ad9a74', 0.18), or = stoneTex(FC.oran, '#8e7e60', 0.35), am = stoneTex(FC.amour, '#b8ae98', 0.12);
  const inc = marbleTex(FC.incarnat, FC.incVein, '#6d2a30'), lan = marbleTex(FC.languedoc, '#d9a3a0', '#4a1416'), tur = marbleTex(FC.turquin, '#c9d0d6', '#2e3640'), vio = marbleTex(FC.violette, '#d7c4d2', '#2f1f2e'), car = marbleTex(FC.carrara, '#d6d4cf', '#b4b2ac', 0.25), cam = marbleTex(FC.campan, FC.campanG, '#4a3a30');
  const T = (t, o) => std(t ? { map: t, ...o } : o);
  const cut = (t, col) => std(t ? { map: t, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85 } : { color: col, side: THREE.DoubleSide });
  const gl = (c, r) => { const t = glassTex(c, r); return std(t ? { map: t, roughness: 0.18, metalness: 0.35, side: THREE.DoubleSide } : { color: FC.glass, side: THREE.DoubleSide }); };
  MATS = {
    stone: T(st, { color: st ? '#ffffff' : FC.stone }), stoneDk: T(st, { color: '#ece0c4' }), carve: T(st, { color: '#f6ecd4', roughness: 0.75 }),
    groove: std({ color: FC.groove }), ptStone: T(pt, { color: pt ? '#ffffff' : FC.ptStone }), oran: T(or, { color: or ? '#ffffff' : FC.oran }), oranSh: std({ color: FC.oranSh }),
    amour: T(am, { color: am ? '#ffffff' : FC.amour, roughness: 0.6 }), statue: std({ color: FC.statue, roughness: 0.55 }), statueB: std({ color: '#3d3a2f', roughness: 0.4, metalness: 0.5 }),
    lead: std({ color: FC.lead, roughness: 0.55, metalness: 0.35 }), leadDome: std({ color: FC.leadDome, roughness: 0.45, metalness: 0.45 }), slate: std({ color: FC.slate, roughness: 0.7 }),
    tileSlate: std({ color: FC.slate, roughness: 0.65, side: THREE.DoubleSide }), tileLead: std({ color: FC.leadDome, roughness: 0.45, metalness: 0.45, side: THREE.DoubleSide }),
    gilt: std({ color: FC.gilt, roughness: 0.32, metalness: 0.75 }), gold: std({ color: FC.gold, roughness: 0.25, metalness: 0.85 }),
    brick: T(brickTex(), { color: '#ffffff' }), brickTrim: T(st, { color: '#f4ecdc' }), rose: std({ color: FC.rose }), frame: std({ color: FC.frame, roughness: 0.6 }),
    iron: std({ color: FC.iron, roughness: 0.5, metalness: 0.5 }), incarnat: T(inc, { color: inc ? '#ffffff' : FC.incarnat, roughness: 0.35 }),
    campan: T(cam, { color: cam ? '#ffffff' : FC.campan, roughness: 0.35 }), languedoc: T(lan, { color: lan ? '#ffffff' : FC.languedoc, roughness: 0.3 }),
    turquin: T(tur, { color: tur ? '#ffffff' : FC.turquin, roughness: 0.3 }), violette: T(vio, { color: vio ? '#ffffff' : FC.violette, roughness: 0.3 }),
    carrara: T(car, { color: car ? '#ffffff' : FC.carrara, roughness: 0.35 }), boxGreen: std({ color: FC.boxGreen, roughness: 0.6 }), leaf: std({ color: FC.leaf, roughness: 0.9 }),
    fruit: std({ color: '#e0901e', roughness: 0.5 }), water: std({ color: FC.water, roughness: 0.08, metalness: 0.3 }), floor: std({ color: '#d9d0bd' }),
    floorChk: T(checkTex(), { color: '#ffffff', roughness: 0.3 }), coffer: T(cofferTex(), { color: '#ffffff' }), frieze: T(friezeTex('#efe7d6'), { color: '#ffffff' }),
    tileGlass: gl(2, 6), tileGlass4: gl(2, 4), tileGlass3: gl(2, 3), tileGlassO: gl(4, 10), tileGlassR: gl(3, 3),
    tileBalus: cut(balusTex(), FC.stone), tileBalusW: cut(balusTex('#f1ece2', '#c9c3b6'), FC.carrara), tileBalusP: cut(balusTex(FC.ptStone, '#c9b994'), FC.ptStone),
    tileGrille: cut(grilleTex(), FC.iron), stoneRef: T(refendTex(FC.stone, '#8c7a58'), { color: '#ffffff' }), oranRef: T(refendTex(FC.oran, '#6e5f45'), { color: '#ffffff' }), ptRef: T(refendTex(FC.ptStone, '#8f7d5c'), { color: '#ffffff' }), dentil: T(dentilTex(), { color: '#ffffff' }), tileTrellis: cut(trellisTex(), FC.trellis), inside: std({ color: '#6f6656' }), rock: std({ color: '#8a8170', roughness: 0.95, flatShading: true }), trellisW: std({ color: FC.trellis, roughness: 0.7 }), flower: std({ color: '#d9576e', roughness: 0.8 }), satory: T(stoneTex(FC.satory, '#a29274', 0.15), { color: '#ffffff' }),
  };
  return MATS;
}

/** UV chiếu hộp theo toạ độ thế giới (1 ô texture = s m) cho mọi khoá đá / gạch / đá hoa — gọi cuối mỗi bộ dựng */
export function finishUV(acc, scale = { floorChk: 1.2, dentil: 1.92 }, s0 = 2) {
  for (const [key, list] of acc.parts) {
    if (key.startsWith('tile') || key === 'frieze' || key === 'coffer') continue;
    const s = scale[key] || s0;
    for (const g of list) {
      const p = g.attributes.position, n = p.count, uv = new Float32Array(n * 2), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), nr = new THREE.Vector3();
      for (let i = 0; i < n; i += 3) {
        a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
        nr.subVectors(c, b).cross(new THREE.Vector3().subVectors(a, b)); const ax = Math.abs(nr.x), ay = Math.abs(nr.y), az = Math.abs(nr.z);
        for (let k = 0; k < 3; k++) { const q = k === 0 ? a : k === 1 ? b : c; let u, v; if (ay >= ax && ay >= az) { u = q.x; v = q.z; } else if (ax >= az) { u = q.z; v = q.y; } else { u = q.x; v = q.y; } uv[(i + k) * 2] = u / s; uv[(i + k) * 2 + 1] = v / s; }
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    }
  }
}

// ---------------------------------------------------------------- đặt khối con
/** gộp acc con vào acc: quay ry quanh trục đứng rồi dời (x, y, z) — kể cả mặt đi được (plats) */
export function put(acc, sub, x = 0, y = 0, z = 0, ry = 0) {
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
  for (const [k, l] of sub.parts) for (const g of l) acc.add(k, g.applyMatrix4(m));
  const c = Math.cos(ry), s = Math.sin(ry);
  for (const q of sub.plats) acc.plat({ ...q, x: x + c * q.x + s * q.z, z: z - s * q.x + c * q.z, top: q.top + y, ry: (q.ry || 0) + ry });
}
/** dời toàn bộ hình + mặt đi được (đưa tâm khung bao về gốc) */
export function recenter(acc, dx, dz) { for (const l of acc.parts.values()) for (const g of l) g.translate(dx, 0, dz); for (const q of acc.plats) { q.x += dx; q.z += dz; } }
/** hình phẳng (đa giác [u,v] trong mặt XY) → ShapeGeometry hướng +z, UV chuẩn hoá 0..1 theo khung bao (cho kính chia ô) */
export function pane(pts, z = 0) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(pts.map(([a, b]) => new THREE.Vector2(a, b))));
  const p = g.attributes.position, uv = g.attributes.uv; let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < p.count; i++) { x0 = Math.min(x0, p.getX(i)); x1 = Math.max(x1, p.getX(i)); y0 = Math.min(y0, p.getY(i)); y1 = Math.max(y1, p.getY(i)); }
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x0) / (x1 - x0 || 1), (p.getY(i) - y0) / (y1 - y0 || 1));
  g.translate(0, 0, z); return g;
}
/** đa giác có lỗ đùn dày t: mặt trước tại z = zf, đùn vào trong (−z) */
export function slabHoles(outer, holes, zf, t) {
  const s = new THREE.Shape(outer.map(([a, b]) => new THREE.Vector2(a, b)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([a, b]) => new THREE.Vector2(a, b))));
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, steps: 1, curveSegments: 6 }); g.translate(0, 0, zf - t); return g;
}
export const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** đường bao ô vòm bán nguyệt: tâm ngang xc, đáy y0, rộng w, đỉnh vòm y0 + h */
export function archPts(xc, y0, w, h, seg = 10) { const r = w / 2, ys = y0 + h - r, pts = [[xc - r, y0], [xc + r, y0]]; for (let i = 0; i <= seg; i++) { const t = (i / seg) * Math.PI; pts.push([xc + r * Math.cos(t), ys + r * Math.sin(t)]); } return pts; }
/** nửa bề rộng lỗ (hình chữ nhật + vòm) tại cao độ y, cộng lề m; null nếu ngoài lỗ */
export function holeHalf(h, y, m = 0) {
  if (y < h.y0 - m || y > h.y0 + h.h + m) return null;
  if (h.kind === 'arch') { const r = h.w / 2, ys = h.y0 + h.h - r; if (y <= ys) return r + m; const rr = r + m, dy = y - ys; return dy >= rr ? null : Math.sqrt(rr * rr - dy * dy); }
  return h.w / 2 + m;
}
/** vành (khung) quanh một ô: đường bao ngoài phình ra fw — đùn dày d, mặt trước z = zf + d */
export function ringFrame(h, fw, zf, d) {
  if (h.kind === 'arch') { // khung vòm: dải chữ U ngược (hai chân + vòng cung)
    const r = h.w / 2, ys = h.y0 + h.h - r, R = r + fw, pts = [];
    for (let i = 0; i <= 9; i++) { const t = (i / 9) * Math.PI; pts.push([h.x + R * Math.cos(t), ys + R * Math.sin(t)]); }
    pts.push([h.x - R, h.y0]); pts.push([h.x - r, h.y0]);
    for (let i = 9; i >= 0; i--) { const t = (i / 9) * Math.PI; pts.push([h.x + r * Math.cos(t), ys + r * Math.sin(t)]); }
    pts.push([h.x + r, h.y0]); pts.push([h.x + R, h.y0]);
    return slabHoles(pts, [], zf + d, d);
  }
  const a = h.x - h.w / 2, b = h.x + h.w / 2, t = h.y0 + h.h;
  if (h.sill) return slabHoles(rectPts(a - fw, h.y0 - fw, b + fw, t + fw), [rectPts(a, h.y0, b, t)], zf + d, d);
  return slabHoles([[a - fw, h.y0], [a, h.y0], [a, t], [b, t], [b, h.y0], [b + fw, h.y0], [b + fw, t + fw], [a - fw, t + fw]], [], zf + d, d);
}

// ---------------------------------------------------------------- thức cột Vignola (06 › Phần chung §1)
/** cao cột theo D · phần chia entablature (architrave / frieze / cornice) */
export const ORD = {
  tuscan: { col: 7, ent: 1.75, parts: [0.3, 0.33, 0.37] },
  doric: { col: 8, ent: 2.0, parts: [0.25, 0.375, 0.375] },
  ionic: { col: 9, ent: 2.25, parts: [0.28, 0.3, 0.42] },
  corinthian: { col: 10, ent: 2.5, parts: [0.3, 0.3, 0.4] },
};
const ACANTHUS = [[-0.42, 0], [0.42, 0], [0.5, 0.5], [0.34, 0.66], [0.2, 1], [0, 0.82], [-0.2, 1], [-0.34, 0.66], [-0.5, 0.5]];
/** một lá acanthe đùn mỏng, chân tại (x,y,z), quay mặt theo góc a (pháp tuyến), nghiêng ra ngoài tilt */
function leaf(w, h, t, x, y, z, a, tilt) {
  const g = slabXY(ACANTHUS.map(([u, v]) => [u * w, v * h]), t); g.rotateX(tilt); g.rotateY(a); g.translate(x, y, z); return g;
}
/**
 * CỘT TRÒN đủ đế (attic base) – thân thu ⅙ có bụng (entasis) – đầu cột theo thức. H = cao toàn cột (gồm đế, đầu), D = đường kính chân.
 * opts: key (thân), capKey (đầu cột, mặc định 'carve'), baseKey, fluted (số rãnh), seg, ry (hướng mặt chính, cho cuộn Ionic), plinth (true)
 */
export function column(acc, ord, x, y, z, H, D, o = {}) {
  const key = o.key || 'stone', ck = o.capKey || 'carve', bk = o.baseKey || ck, seg = o.seg || 12, r = D / 2, ry = o.ry || 0;
  const hb = 0.5 * D, hc = ord === 'corinthian' ? 1.17 * D : ord === 'ionic' ? 0.42 * D : 0.5 * D, hs = H - hb - hc, rt = r * 5 / 6;
  // đế: plinth vuông + hai xuyến + lõm
  if (o.plinth !== false) acc.add(bk, boxB(1.36 * D, 0.17 * D, 1.36 * D, x, y, z, ry));
  acc.add(bk, lathe([[0.001, 0.17 * D], [0.66 * D, 0.17 * D], [0.67 * D, 0.26 * D], [0.56 * D, 0.34 * D], [0.6 * D, 0.42 * D], [0.53 * D, 0.5 * D], [0.001, 0.5 * D]], x, y, z, seg));
  // thân: bụng ⅓ dưới thẳng rồi thu tới ⅚ ở đỉnh
  const ys = [0, 0.03, 0.33, 0.66, 1], rs = [r * 1.06, r, r, r * 0.955, rt];
  if (o.fluted) {
    const nf = o.fluted, ns = nf * 4, rows = [];
    rows.push(Array.from({ length: ns }, () => V(x, y + hb, z)));
    for (let i = 0; i < ys.length; i++) { const yy = y + hb + ys[i] * hs; rows.push(Array.from({ length: ns }, (_, j) => { const t = (j / ns) * Math.PI * 2, f = i === 0 || i === ys.length - 1 ? 1 : 1 - 0.07 * Math.pow(Math.max(0, Math.cos(nf * t)), 0.6); return V(x + Math.cos(t) * rs[i] * f, yy, z + Math.sin(t) * rs[i] * f); })); }
    rows.push(Array.from({ length: ns }, () => V(x, y + hb + hs, z)));
    acc.add(key, gridSurface(rows, true));
  } else acc.add(key, lathe([[0.001, 0], ...ys.map((t, i) => [rs[i], t * hs]), [0.001, hs]], x, y + hb, z, seg));
  // đầu cột
  const yc = y + hb + hs, cap = new Acc();
  if (ord === 'tuscan' || ord === 'doric') {
    cap.add(ck, lathe([[0.001, 0], [rt * 1.12, 0], [rt * 1.12, 0.06 * D], [rt, 0.1 * D], [rt, 0.2 * D], [rt * 1.08, 0.22 * D], [0.62 * D, 0.33 * D], [0.001, 0.33 * D]], 0, 0, 0, seg));
    cap.add(ck, boxB(1.24 * D, 0.17 * D, 1.24 * D, 0, 0.33 * D, 0));
  } else if (ord === 'ionic') {
    cap.add(ck, lathe([[0.001, 0], [rt * 1.1, 0], [rt * 1.1, 0.05 * D], [0.56 * D, 0.2 * D], [0.001, 0.2 * D]], 0, 0, 0, seg));
    cap.add(ck, boxB(1.05 * D, 0.1 * D, 0.8 * D, 0, 0.2 * D, 0));                                  // đệm cuộn (canal)
    for (const sx of [-1, 1]) {
      const v = new THREE.CylinderGeometry(0.2 * D, 0.2 * D, 0.82 * D, 7); v.rotateX(Math.PI / 2); v.translate(sx * 0.5 * D, 0.16 * D, 0); cap.add(ck, v); // cuộn (pulvinus)
      if (!o.noEye) for (const sz of [-1, 1]) cap.add('groove', boxB(0.12 * D, 0.12 * D, 0.03, sx * 0.5 * D, 0.1 * D, sz * 0.425 * D)); // mắt cuộn
    }
    cap.add(ck, boxB(0.96 * D, 0.12 * D, 0.96 * D, 0, 0.3 * D, 0));                                   // abacus
  } else { // corinthian: chuông + 2 hàng 8 lá + 4 cuộn góc + abacus cong vát góc
    const hcb = 1.0 * D;
    cap.add(ck, lathe([[0.001, 0], [rt * 1.1, 0], [rt * 1.1, 0.06 * D], [rt, 0.08 * D], [rt * 1.02, 0.5 * D], [0.5 * D, hcb], [0.001, hcb]], 0, 0, 0, seg));
    for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + (row ? Math.PI / 8 : 0), rr = rt * (row ? 1.0 : 1.04);
      cap.add(ck, leaf(0.3 * D, (row ? 0.62 : 0.4) * D, 0.035 * D, Math.sin(a) * rr, 0.06 * D, Math.cos(a) * rr, a, 0.18 + row * 0.1));
    }
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + (i * Math.PI) / 2, s = new THREE.TorusGeometry(0.1 * D, 0.035 * D, 4, 8); s.rotateY(a + Math.PI / 2); s.translate(Math.sin(a) * 0.62 * D, 0.86 * D, Math.cos(a) * 0.62 * D); cap.add(ck, s); }
    const ab = []; for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2 + Math.PI / 8; ab.push([Math.cos(t) * 0.78 * D, Math.sin(t) * 0.78 * D]); }
    const ag = new THREE.ExtrudeGeometry(new THREE.Shape(ab.map(([a, b]) => new THREE.Vector2(a, b))), { depth: 0.17 * D, bevelEnabled: false }); ag.rotateX(-Math.PI / 2); ag.translate(0, hcb, 0); cap.add(ck, ag);
    cap.add(ck, boxB(0.14 * D, 0.14 * D, 0.06 * D, 0, hcb + 0.01 * D, 0.72 * D));                   // hoa abacus
  }
  put(acc, cap, x, yc, z, ry);
  return { top: y + H, rt };
}
/**
 * PILASTER áp tường (mặt tường z = zf, nhô proj ra +z): bề rộng W (= D), cao H gồm đế và đầu theo thức.
 * fluted: số rãnh (Petit Trianon) · key: thân · capKey
 */
export function pilaster(acc, ord, x, y, zf, H, W, proj = 0.18, o = {}) {
  const key = o.key || 'stone', ck = o.capKey || 'carve', hb = 0.5 * W, hc = ord === 'corinthian' ? 1.17 * W : ord === 'ionic' ? 0.42 * W : 0.5 * W, hs = H - hb - hc;
  const P = (w, h, d, yy, zz = 0) => acc.add(ck, boxB(w, h, d, x, yy, zf + d / 2 + zz));
  P(W * 1.3, 0.2 * W, proj + 0.1, y); P(W * 1.12, 0.3 * W, proj + 0.05, y + 0.2 * W);
  acc.add(key, boxB(W, hs, proj, x, y + hb, zf + proj / 2));
  if (o.fluted) { const n = o.fluted; for (let i = 0; i < n; i++) acc.add('groove', boxB(W * 0.07, hs * 0.86, 0.03, x - W * 0.38 + (i * W * 0.76) / (n - 1), y + hb + hs * 0.07, zf + proj + 0.005)); }
  const yc = y + hb + hs;
  if (ord === 'tuscan' || ord === 'doric') { P(W * 1.04, 0.1 * W, proj + 0.02, yc); P(W * 1.14, 0.2 * W, proj + 0.06, yc + 0.1 * W); P(W * 1.26, 0.2 * W, proj + 0.1, yc + 0.3 * W); }
  else if (ord === 'ionic') {
    P(W * 1.04, 0.2 * W, proj + 0.03, yc); P(W * 1.16, 0.08 * W, proj + 0.07, yc + 0.32 * W);
    for (const sx of [-1, 1]) { const v = new THREE.CylinderGeometry(0.17 * W, 0.17 * W, proj + 0.06, 8); v.rotateX(Math.PI / 2); v.translate(x + sx * 0.46 * W, yc + 0.18 * W, zf + (proj + 0.06) / 2); acc.add(ck, v); }
  } else {
    P(W, 0.98 * W, proj, yc);
    if (o.light) acc.add(ck, boxB(W * 0.5, 0.5 * W, 0.06, x, yc + 0.1 * W, zf + proj + 0.03)); else for (const i of [-1, 0, 1]) acc.add(ck, leaf(0.34 * W, 0.62 * W, 0.04 * W, x + i * 0.34 * W, yc + 0.05 * W, zf + proj + 0.01, 0, 0.22));
    for (const sx of [-1, 1]) acc.add(ck, boxB(0.18 * W, 0.18 * W, proj + 0.12, x + sx * 0.52 * W, yc + 0.78 * W, zf + (proj + 0.12) / 2));
    P(W * 1.36, 0.17 * W, proj + 0.14, yc + 0.98 * W);
  }
  return { top: y + H };
}
/**
 * ENTABLATURE (architrave + frieze + cornice) dọc x0..x1, chân tại y, mặt trước z = zf, lùi vào tới zf − dep.
 * opts: dent (răng cưa Ionic / Corinthian), mod (công-xon Corinthian), trig: [x…] (triglyph Doric), frieze ('frieze' = diềm chạm), key
 * trả { top, proj (độ vươn cornice tính từ zf) }
 */
export function entab(acc, ord, x0, x1, y, zf, H, o = {}) {
  const key = o.key || 'stone', ck = o.capKey || 'carve', [pa, pf, pc] = ORD[ord].parts, A = H * pa, F = H * pf, Cn = H * pc, L = x1 - x0, xm = (x0 + x1) / 2, dep = o.dep ?? 1.0;
  const B = (k, w, h, yy, zfront, d = dep, xx = xm) => acc.add(k, boxB(w, h, d + (zfront - zf), xx, yy, zfront - (d + (zfront - zf)) / 2));
  if (ord === 'ionic' || ord === 'corinthian') { B(key, L, A * 0.3, y, zf); B(key, L, A * 0.32, y + A * 0.3, zf + A * 0.04); B(key, L, A * 0.24, y + A * 0.62, zf + A * 0.08); B(ck, L, A * 0.14, y + A * 0.86, zf + A * 0.14); }
  else { B(key, L, A * 0.85, y, zf); B(ck, L, A * 0.15, y + A * 0.85, zf + A * 0.08); }
  const yF = y + A;
  if (o.frieze === 'frieze') { B(key, L, F, yF, zf - 0.02); const f = new THREE.PlaneGeometry(L, F * 0.86); const uv = f.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * L / (F * 6)); f.translate(xm, yF + F / 2, zf + 0.001); acc.add('frieze', f); }
  else B(key, L, F, yF, zf);
  if (o.trig) for (const tx of o.trig) { if (tx < x0 + 0.2 || tx > x1 - 0.2) continue; const w = F * 0.66; acc.add(ck, boxB(w, F, 0.06, tx, yF, zf + 0.03)); for (const g of [-1, 1]) acc.add('groove', boxB(w * 0.12, F * 0.84, 0.02, tx + g * w * 0.17, yF, zf + 0.065)); acc.add(ck, boxB(w, A * 0.1, 0.05, tx, y + A * 0.72, zf + 0.1)); }
  const yC = yF + F;
  B(ck, L, Cn * 0.12, yC, zf + Cn * 0.1);                                                          // bed moulding
  if (o.dent === 'geo') { const w = Cn * 0.14, p = w * 1.5, n = Math.floor((L - 0.1) / p); for (let i = 0; i < n; i++) acc.add(ck, boxB(w, Cn * 0.18, Cn * 0.2, x0 + (L - n * p) / 2 + p * (i + 0.5), yC + Cn * 0.12, zf + Cn * 0.3)); B(key, L, Cn * 0.18, yC + Cn * 0.12, zf + Cn * 0.18); }
  else if (o.dent) B('dentil', L, Cn * 0.18, yC + Cn * 0.12, zf + Cn * 0.3);  // răng cưa: dải đá có texture răng (rẻ)
  if (o.mod) { const p = Cn * 0.9, n = Math.floor((L - 0.1) / p); for (let i = 0; i < n; i++) acc.add(ck, boxB(Cn * 0.22, Cn * 0.2, Cn * 0.72, x0 + (L - n * p) / 2 + p * (i + 0.5), yC + Cn * 0.3, zf + Cn * 0.36 + Cn * 0.36)); }
  if (o.mutule) { const p = o.mutule, n = Math.floor((L - 0.1) / p); for (let i = 0; i < n; i++) acc.add(ck, boxB(p * 0.6, Cn * 0.08, Cn * 0.7, x0 + (L - n * p) / 2 + p * (i + 0.5), yC + Cn * 0.42, zf + Cn * 0.55)); }
  const yK = yC + Cn * (o.dent || o.mod ? 0.5 : 0.3);
  B(key, L + 0.02, Cn * 0.08, yK - Cn * 0.08, zf + Cn * 0.55);
  B(key, L + 0.04, Cn * 0.3, yK, zf + Cn * 1.0);                                                  // corona (gờ chảy nước)
  B(ck, L + 0.06, (yC + Cn) - (yK + Cn * 0.3), yK + Cn * 0.3, zf + Cn * 1.08);                     // cymatium
  return { top: y + H, proj: Cn * 1.08 };
}
/** gờ / băng đá ngang (bandeau, gờ tầng) */
export function band(acc, x0, x1, y, h, zf, proj, key = 'stoneDk', dep = 0.8) { acc.add(key, boxB(x1 - x0, h, dep + proj, (x0 + x1) / 2, y, zf + proj - (dep + proj) / 2)); }

// ---------------------------------------------------------------- lan can con tiện quả lê (06 §2, §4.7)
/** con tiện dựng hình (dùng cho lan can ngắn: ban công, đình nhỏ) — chân tại y, cao h */
export function baluster(acc, x, y, z, h, key = 'stone', seg = 6) {
  const p = [[0, 0.1], [0.06, 0.1], [0.09, 0.075], [0.22, 0.13], [0.34, 0.165], [0.46, 0.17], [0.58, 0.14], [0.70, 0.085], [0.80, 0.06], [0.88, 0.09], [0.94, 0.12], [1, 0.12]];
  acc.add(key, lathe([[0.001, 0], ...p.map(([t, r]) => [r * h * 0.62, t * h]), [0.001, h]], x, y, z, seg));
}
/**
 * LAN CAN dọc x0..x1 (tâm mặt z = zc), chân tại y, cao h: đế + tay vịn đá + trụ đặc (dé) tại des[] (và hai đầu) + con tiện
 * đứng sát nhau (khe ≈ ½ bề rộng con tiện). geo = true → con tiện dựng hình; ngược lại → tấm cắt hình hai lớp (rẻ, cho mái dài).
 */
export function balus(acc, x0, x1, y, zc, o = {}) {
  const h = o.h || 1.1, key = o.key || 'stone', cut = o.cut || 'tileBalus', deW = o.deW || 0.55, dep = o.dep || 0.42, pitch = o.pitch || 0.3;
  const des = [...new Set([...(o.ends === false ? [] : [x0 + deW / 2]), ...(o.des || []).filter((d) => d > x0 + deW && d < x1 - deW), ...(o.ends === false ? [] : [x1 - deW / 2])].map((d) => +d.toFixed(3)))].sort((a, b) => a - b);
  const bnd = o.ends === false ? [x0 - deW / 2, ...des, x1 + deW / 2] : des;
  acc.add(key, boxB(x1 - x0, 0.2 * h, dep, (x0 + x1) / 2, y, zc));
  acc.add(key, boxB(x1 - x0 + 0.04, 0.12 * h, dep + 0.1, (x0 + x1) / 2, y + 0.88 * h, zc)); acc.add(o.capKey || 'stoneDk', boxB(x1 - x0, 0.05 * h, dep + 0.04, (x0 + x1) / 2, y + 0.84 * h, zc));
  for (const d of des) { acc.add(key, boxB(deW, h + 0.05, dep + 0.1, d, y, zc)); acc.add(o.capKey || 'stoneDk', boxB(deW + 0.1, 0.08, dep + 0.2, d, y + h + 0.05, zc)); }
  for (let i = 0; i < bnd.length - 1; i++) {
    const a = bnd[i] + deW / 2, b = bnd[i + 1] - deW / 2, L = b - a; if (L < 0.2) continue;
    if (o.geo) { const n = Math.max(1, Math.floor(L / pitch)); for (let j = 0; j < n; j++) baluster(acc, a + (L / n) * (j + 0.5), y + 0.2 * h, zc, 0.64 * h, key); }
    else for (const s of [-1, 1]) { const g = new THREE.PlaneGeometry(L, 0.64 * h), uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * Math.max(1, Math.round(L / pitch))); g.translate((a + b) / 2, y + 0.2 * h + 0.32 * h, zc + s * dep * 0.22); acc.add(cut, g); }
  }
  return des;
}
/** lan can theo đường gấp khúc pts [[x,z]…] (mặt bằng) — mỗi đoạn một khung cục bộ */
export function balusPath(acc, pts, y, o = {}) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az); if (L < 0.3) continue;
    const ry = Math.atan2(-(bz - az), bx - ax), sub = new Acc();
    const desL = (o.desStep ? Array.from({ length: Math.max(0, Math.round(L / o.desStep) - 1) }, (_, k) => -L / 2 + (L / Math.round(L / o.desStep)) * (k + 1)) : []);
    const des = balus(sub, -L / 2, L / 2, 0, 0, { ...o, des: desL });
    put(acc, sub, (ax + bx) / 2, y, (az + bz) / 2, ry);
    for (const d of des) out.push([(ax + bx) / 2 + Math.cos(ry) * d, (az + bz) / 2 - Math.sin(ry) * d]);
  }
  return out;
}

// ---------------------------------------------------------------- trang trí điêu khắc (06 §6: ≥ 3 biến thể trophée / pot à feu, ≥ 4 tư thế tượng)
/** pot à feu (bình đá có ngọn lửa) — 3 biến thể, đáy tại y, cao s */
export function potAFeu(acc, x, y, z, s, v = 0, key = 'carve', flameKey = null) {
  v = ((Math.round(v) % 3) + 3) % 3;
  const P = [
    [[0.001, 0], [0.2, 0], [0.2, 0.08], [0.1, 0.18], [0.28, 0.36], [0.24, 0.55], [0.15, 0.62], [0.18, 0.66], [0.001, 0.68]],
    [[0.001, 0], [0.18, 0], [0.18, 0.07], [0.08, 0.16], [0.28, 0.3], [0.25, 0.46], [0.16, 0.54], [0.12, 0.6], [0.001, 0.64]],
    [[0.001, 0], [0.22, 0], [0.22, 0.1], [0.11, 0.16], [0.3, 0.36], [0.22, 0.52], [0.13, 0.58], [0.001, 0.62]],
  ][v % 3];
  acc.add(key, lathe(P.map(([r, h]) => [r * s, h * s]), x, y, z, 6));
  const top = P[P.length - 1][1] * s;
  const fl = [[0.001, 0], [0.12, 0], [0.15, 0.08], [0.09, 0.16], [0.13, 0.22], [0.06, 0.3], [0.08, 0.34], [0.001, 0.42]];
  const g = lathe(fl.map(([r, h]) => [r * s, h * s]), 0, 0, 0, 5); g.rotateY(v * 0.7); g.translate(x, y + top, z); acc.add(flameKey || key, g);
  if (v % 3 === 2) for (const sx of [-1, 1]) { const t = new THREE.TorusGeometry(0.09 * s, 0.025 * s, 4, 8, Math.PI); t.rotateZ(sx * Math.PI / 2); t.translate(x + sx * 0.28 * s, y + 0.42 * s, z); acc.add(key, t); }
}
/** trophée d'armes (cụm chiến lợi phẩm: giáp ngực, mũ, khiên, cờ, giáo) — 3 biến thể; đáy tại y, cao s, mặt hướng ry */
export function trophy(acc, x, y, z, s, v = 0, ry = 0, key = 'carve') {
  v = ((Math.round(v) % 3) + 3) % 3;
  const t = new Acc(), k = key;
  t.add(k, boxB(0.8 * s, 0.1 * s, 0.5 * s, 0, 0, 0));
  // bó giáo / cờ xoè quạt phía sau
  const fan = v === 2 ? [-0.7, 0, 0.7] : [-0.6, 0.6];
  for (const a of fan) { const top = V(Math.sin(a) * 0.95 * s, 0.1 * s + Math.cos(a) * 1.25 * s, -0.16 * s); t.add(k, beam(V(0, 0.12 * s, -0.12 * s), top, 0.04 * s, 0.04 * s)); if (Math.abs(a) > 0.3) t.add(k, slabXY([[0, 0], [0.26, -0.04], [0.3, -0.28], [0.04, -0.24]].map(([p, q]) => [Math.sign(a) * p * s, q * s]), 0.025 * s, top.x, top.y - 0.04 * s, top.z)); }
  // giáp ngực (cuirasse) dẹt + váy giáp loe (lambrequins)
  const cu = lathe([[0.001, 0], [0.24, 0], [0.3, 0.06], [0.22, 0.14], [0.25, 0.32], [0.3, 0.5], [0.26, 0.58], [0.12, 0.64], [0.001, 0.64]].map(([r, h]) => [r * s, h * s]), 0, 0.1 * s, 0, 8); cu.scale(1, 1, 0.55); t.add(k, cu);
  for (const sx of [-1, 1]) t.add(k, new THREE.SphereGeometry(0.11 * s, 6, 4).scale(1, 0.8, 0.9).translate(sx * 0.27 * s, 0.68 * s, 0)); // giáp vai
  // mũ có chỏm lông
  t.add(k, lathe([[0.001, 0], [0.16, 0], [0.18, 0.05], [0.15, 0.17], [0.07, 0.25], [0.001, 0.27]].map(([r, h]) => [r * s, h * s]), 0, 0.74 * s, 0, 8));
  t.add(k, slabXY([[-0.04, 0], [0.04, 0], [0.2, 0.18], [0.12, 0.36], [-0.02, 0.4], [-0.1, 0.24]].map(([a, b]) => [a * s, b * s]), 0.06 * s, 0, 0.96 * s, 0));
  // khiên bầu dục hai bên (biến thể 1: khiên tròn + trống)
  for (const sx of [-1, 1]) { const g = new THREE.CylinderGeometry(0.22 * s, 0.22 * s, 0.05 * s, 10); g.rotateX(Math.PI / 2); g.scale(1, v === 1 ? 1 : 1.35, 1); g.rotateY(sx * 0.5); g.rotateZ(sx * 0.25); g.translate(sx * 0.4 * s, 0.4 * s, 0.02 * s); t.add(k, g); t.add(k, new THREE.SphereGeometry(0.06 * s, 5, 3).translate(sx * 0.4 * s, 0.4 * s, 0.07 * s)); }
  if (v === 1) { const d = new THREE.CylinderGeometry(0.17 * s, 0.17 * s, 0.26 * s, 10); d.rotateZ(Math.PI / 2); d.translate(0, 0.25 * s, 0.24 * s); t.add(k, d); }
  if (v === 2) for (const sx of [-1, 1]) t.add(k, beam(V(sx * 0.1 * s, 0.15 * s, 0.2 * s), V(sx * 0.55 * s, 0.25 * s, 0.25 * s), 0.12 * s, 0.12 * s)); // nòng pháo
  put(acc, t, x, y, z, ry);
}
/** tượng đứng khoác áo (draped figure) — 4+ tư thế; đáy (gồm bệ nhỏ) tại y, cao h, mặt hướng ry */
export function statue(acc, x, y, z, h, v = 0, ry = 0, key = 'statue', seg = 6) {
  v = ((Math.round(v) % 5) + 5) % 5; const s = h, t = new Acc(), k = key;
  t.add(k, boxB(0.38 * s, 0.05 * s, 0.32 * s, 0, 0, 0));
  const body = [[0.001, 0.05], [0.16, 0.05], [0.15, 0.25], [0.11, 0.46], [0.1, 0.56], [0.125, 0.72], [0.1, 0.8], [0.045, 0.83], [0.065, 0.9], [0.045, 0.97], [0.001, 0.98]];
  const g = lathe(body.map(([r, hh]) => [r * s, hh * s]), 0, 0, 0, seg); g.scale(1, 1, 0.72); t.add(k, g);
  t.add(k, slabXY([[-0.16, 0.06], [0.16, 0.06], [0.2, 0.3], [0.1, 0.5], [-0.12, 0.42]].map(([a, b]) => [a * s, b * s]), 0.06 * s, 0, 0, 0.07 * s, 0)); // vạt áo
  const sh = [V(-0.12 * s, 0.75 * s, 0), V(0.12 * s, 0.75 * s, 0)], arms = [
    [[-0.2, 0.5, 0.06], [0.24, 0.98, 0.04]], [[-0.26, 0.6, 0.12], [0.2, 0.48, 0.14]], [[-0.14, 0.46, 0.14], [0.3, 0.86, 0.08]], [[-0.28, 0.9, 0.05], [0.18, 0.52, 0.1]], [[-0.2, 0.62, 0.16], [0.22, 0.64, 0.16]],
  ][v % 5];
  arms.forEach(([ax, ay, az], i) => { const e = V(ax * s, ay * s, az * s); t.add(k, beam(sh[i], e, 0.05 * s, 0.05 * s)); });
  const [, [hx, hy, hz]] = arms; // đồ cầm tay: gậy / đuốc / vòng / khiên / lẵng
  if (v % 5 === 0) t.add(k, beam(V(hx * s, (hy - 0.5) * s, hz * s), V(hx * s, (hy + 0.12) * s, hz * s), 0.025 * s, 0.025 * s));
  else if (v % 5 === 1) { const w = new THREE.TorusGeometry(0.07 * s, 0.015 * s, 4, 10); w.translate(hx * s, hy * s, (hz + 0.02) * s); t.add(k, w); }
  else if (v % 5 === 2) t.add(k, cyl(0.03 * s, 0.06 * s, 0.14 * s, hx * s, hy * s, hz * s, 6));
  else if (v % 5 === 3) { const c = new THREE.CylinderGeometry(0.11 * s, 0.11 * s, 0.03 * s, 10); c.rotateX(Math.PI / 2); c.translate(0.2 * s, 0.5 * s, 0.14 * s); t.add(k, c); }
  else t.add(k, cyl(0.06 * s, 0.1 * s, 0.1 * s, 0, 0.6 * s, 0.2 * s, 7));
  put(acc, t, x, y, z, ry);
}
/** mascaron (mặt nạ đá) trên đá khoá: hình mặt có râu loe, nhô d */
export function mascaron(acc, x, y, z, s, key = 'carve') {
  const pts = [[0, -0.5], [0.3, -0.25], [0.42, -0.02], [0.32, 0.32], [0, 0.5], [-0.32, 0.32], [-0.42, -0.02], [-0.3, -0.25]];
  acc.add(key, slabXY(pts.map(([a, b]) => [a * s, b * s]), 0.12 * s, x, y, z + 0.06 * s));
  acc.add(key, slabXY([[-0.08, -0.05], [0.08, -0.05], [0.04, 0.12], [-0.04, 0.12]].map(([a, b]) => [a * s, b * s]), 0.08 * s, x, y, z + 0.14 * s)); // mũi
  for (const sx of [-1, 1]) acc.add('groove', boxB(0.1 * s, 0.05 * s, 0.03 * s, x + sx * 0.14 * s, y + 0.14 * s, z + 0.12 * s));
}
/** đá khoá vòm (claveau) nhô + mascaron tuỳ chọn */
export function keystone(acc, x, yTop, zf, w, h, d, mask = false, key = 'stoneDk') {
  acc.add(key, slabXY([[-w * 0.36, 0], [w * 0.36, 0], [w * 0.5, h], [-w * 0.5, h]], d, x, yTop - h * 0.35, zf + d / 2));
  if (mask) mascaron(acc, x, yTop - h * 0.35 + h * 0.5, zf + d, w * 0.9);
}
/** agrafe: đá khoá kéo dài thành công-xon chạm lá, đỉnh xoè vỏ sò, đỡ tới architrave (đầu cửa tầng chính) */
export function agrafe(acc, x, y0, y1, zf, w = 0.6, key = 'carve') {
  const h = y1 - y0; acc.add(key, slabXY([[-w * 0.3, 0], [w * 0.3, 0], [w * 0.42, h * 0.7], [w * 0.75, h * 0.78], [w * 0.55, h], [-w * 0.55, h], [-w * 0.75, h * 0.78], [-w * 0.42, h * 0.7]], 0.22, x, y0, zf + 0.11));
  acc.add(key, slabXY(Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * i / 6); return [Math.cos(a) * w * 0.9, Math.sin(a) * w * 0.7]; }).concat([[0, -0.05]]), 0.12, x, y0 + h * 0.35, zf + 0.26));
}
/** cartouche / huy chương / phù điêu bầu dục khung cuộn */
export function cartouche(acc, x, y, zf, w, h, key = 'carve', round = false) {
  const n = 12, out = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, wob = round ? 1 : 1 + 0.12 * Math.cos(4 * t); out.push([Math.cos(t) * w / 2 * wob, Math.sin(t) * h / 2 * wob]); }
  acc.add(key, slabXY(out, 0.1, x, y, zf + 0.05));
  acc.add(key, slabXY(out.map(([a, b]) => [a * 0.62, b * 0.62]), 0.1, x, y, zf + 0.12));
  if (!round) for (const sx of [-1, 1]) acc.add(key, slabXY([[0, 0], [0.18, 0.12], [0.12, -0.2]].map(([a, b]) => [sx * (a + 0.45) * w, b * h]), 0.08, x, y, zf + 0.06)); // cuộn hai bên
}
/** nhân sư nằm (sphinx) — biên dạng nhìn ngang đùn dày; chân tại y, dài l theo trục x cục bộ, quay ry */
export function sphinx(acc, x, y, z, l, ry = 0, key = 'statue') {
  const p = [[0, 0], [1, 0], [1, 0.12], [0.88, 0.16], [0.82, 0.3], [0.86, 0.5], [0.8, 0.62], [0.72, 0.6], [0.66, 0.46], [0.6, 0.36], [0.3, 0.33], [0.12, 0.3], [0.04, 0.22], [0, 0.12]];
  const t = new Acc(); t.add(key, slabXY(p.map(([a, b]) => [(a - 0.5) * l, b * l]), 0.26 * l, 0, 0, 0)); t.add(key, boxB(1.05 * l, 0.08 * l, 0.32 * l, 0, -0.08 * l, 0));
  put(acc, t, x, y + 0.08 * l, z, ry);
}
/** ngựa chồm (phù điêu fronton tàu ngựa, «3 con ngựa xe Apollo») — biên dạng đùn */
export function horse(acc, x, y, z, s, flip = 1, t = 0.3, key = 'carve') {
  const p = [[0, 0], [0.08, 0], [0.12, 0.28], [0.32, 0.3], [0.5, 0.26], [0.6, 0.02], [0.68, 0.02], [0.64, 0.36], [0.8, 0.5], [0.92, 0.78], [0.86, 0.82], [0.96, 0.92], [0.84, 0.96], [0.7, 0.8], [0.62, 0.66], [0.4, 0.6], [0.16, 0.56], [0.02, 0.62], [0.04, 0.48], [0.06, 0.38]];
  acc.add(key, slabXY(p.map(([a, b]) => [x + flip * (a - 0.5) * s, y + b * s * 0.8]), t, 0, 0, z + t / 2));
}
/** bồn cam trong hộp gỗ Versailles (caisse) — hộp xanh, trụ góc có quả cầu, thân, tán tròn có quả */
export function orangeTree(acc, x, z, s = 1, v = 0) {
  acc.add('boxGreen', boxB(1.1 * s, 1.0 * s, 1.1 * s, x, 0, z)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { acc.add('iron', boxB(0.1 * s, 1.08 * s, 0.1 * s, x + sx * 0.55 * s, 0, z + sz * 0.55 * s)); acc.add('iron', new THREE.SphereGeometry(0.08 * s, 6, 4).translate(x + sx * 0.55 * s, 1.15 * s, z + sz * 0.55 * s)); }
  acc.add('boxGreen', boxB(1.0 * s, 0.05, 1.0 * s, x, 1.0 * s, z));
  acc.add('stoneDk', cyl(0.08 * s, 0.06 * s, 1.0 * s, x, 1.0 * s, z, 6));
  const c = new THREE.IcosahedronGeometry(0.85 * s, 1), p = c.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = 1 + 0.08 * Math.sin(p.getX(i) * 7 + v) * Math.cos(p.getZ(i) * 5); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.95, p.getZ(i) * k); }
  c.computeVertexNormals(); c.translate(x, 2.55 * s, z); acc.add('leaf', c);
  for (let i = 0; i < 4; i++) { const a = i * 1.6 + v, h = 2.3 + (i % 3) * 0.25; acc.add('fruit', new THREE.SphereGeometry(0.07 * s, 5, 4).translate(x + Math.cos(a) * 0.8 * s, h * s, z + Math.sin(a) * 0.8 * s)); }
}

// ---------------------------------------------------------------- ô cửa trên mặt tường
/**
 * Dựng phần «trong lỗ» của một ô: kính chia ô lùi vào reveal, bậu, khung chỉ (chambranle), đá khoá. h = { kind:'arch'|'rect'|'oculus', x, y0, w, h, door, niche, glass }
 * zf = mặt tường; trả lỗ (đa giác) để khoét tường.
 */
export function opening(acc, h, zf, o = {}) {
  const rev = o.reveal ?? 0.35, poly = h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h) : h.kind === 'oculus' ? Array.from({ length: 16 }, (_, i) => [h.x + Math.cos((i / 16) * Math.PI * 2) * h.w / 2, h.y0 + h.w / 2 + Math.sin((i / 16) * Math.PI * 2) * h.w / 2]) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h);
  if (h.niche) { acc.add(o.wallKey || 'stone', slabHoles(poly.map(([a, b]) => [a, b]), [], zf - (h.nicheD || 0.6), 0.4)); }
  else if (!h.door) acc.add(h.glass || 'tileGlass', pane(poly, zf - rev));
  if (!h.door && !h.niche && h.kind !== 'oculus') acc.add(o.sillKey || 'stoneDk', boxB(h.w + 0.1, 0.12, rev + 0.12, h.x, h.y0 - 0.12, zf - rev / 2 + 0.06));
  if (o.frame) { const f = o.frame; acc.add(f.key || 'stoneDk', h.kind === 'oculus' ? (() => { const t = new THREE.TorusGeometry(h.w / 2 + f.w / 2, f.w / 2, 4, 16); t.translate(h.x, h.y0 + h.w / 2, zf + 0.02); return t; })() : ringFrame({ ...h, sill: !!f.sill }, f.w, zf, f.d || 0.08)); }
  if (o.key && h.kind === 'arch') keystone(acc, h.x, h.y0 + h.h, zf, o.key.w || 0.5, o.key.h || 0.7, o.key.d || 0.16, !!o.key.mask, o.key.k || 'stoneDk');
  return poly;
}
/**
 * TƯỜNG KHÍA RÃNH «à refends» (06 §2): lõi tường có lỗ + các hàng đá ngang nhô (mạch lõm giữa hàng), tránh lỗ và vành đá
 * vòm; quanh mỗi vòm là các viên đá vòm (claveaux) toả tia. holes: [{kind,x,y0,w,h}]
 */
export function refends(acc, x0, x1, y0, y1, zf, holes, o = {}) {
  const c = o.course || 0.5, pr = o.proj || 0.05, key = o.key || 'stone', vr = o.vous ?? 0.55;
  if (!o.tex) for (let yb = y0; yb < y1 - 0.05; yb += c) {
    const hh = Math.min(c, y1 - yb), ym = yb + hh / 2, cuts = [];
    for (const h of holes) { const hw = holeHalf(h, ym, h.kind === 'arch' && vr ? 0 : 0.02); if (hw == null) continue; let half = hw; if (h.kind === 'arch') { const r = h.w / 2, ys = h.y0 + h.h - r; if (ym > ys - 0.05 && vr) { const R = r + vr + 0.04, dy = ym - ys; half = dy >= R ? 0 : Math.sqrt(R * R - dy * dy); } } if (half > 0) cuts.push([h.x - half, h.x + half]); }
    cuts.sort((a, b) => a[0] - b[0]); let x = x0; const segs = [];
    for (const [a, b] of cuts) { if (a > x) segs.push([x, Math.min(a, x1)]); x = Math.max(x, b); } if (x < x1) segs.push([x, x1]);
    for (const [a, b] of segs) if (b - a > 0.08) acc.add(key, boxB(b - a, hh - 0.07, pr, (a + b) / 2, yb + 0.035, zf + pr / 2));
  }
  if (vr) for (const h of holes) if (h.kind === 'arch') {
    const r = h.w / 2, ys = h.y0 + h.h - r, n = o.nv || 9;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI + 0.012, a1 = ((i + 1) / n) * Math.PI - 0.012, mid = i === (n - 1) / 2, R = r + vr * (mid ? 1.35 : 1);
      const pts = [[Math.cos(a0) * r, Math.sin(a0) * r], [Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(a1) * R, Math.sin(a1) * R], [Math.cos(a1) * r, Math.sin(a1) * r]];
      acc.add(mid ? 'stoneDk' : key, slabXY(pts.map(([u, v]) => [h.x + u, ys + v]), mid ? pr * 3 : pr, 0, 0, zf + (mid ? pr * 1.5 : pr / 2)));
      if (mid && o.mask) mascaron(acc, h.x, ys + r + vr * 0.62, zf + pr * 3, vr * 0.95);
    }
  }
}

// ---------------------------------------------------------------- mái (Mansard / dốc) bằng phép co đa giác
/** offset đa giác kín (mặt bằng [[x,z]…]) vào trong d (mitre) */
export function insetPoly(poly, d) {
  const n = poly.length; let area = 0; for (let i = 0; i < n; i++) { const [x0, z0] = poly[i], [x1, z1] = poly[(i + 1) % n]; area += x0 * z1 - x1 * z0; }
  const sg = area > 0 ? 1 : -1, out = [];
  for (let i = 0; i < n; i++) {
    const p = poly[i], a = poly[(i + n - 1) % n], b = poly[(i + 1) % n];
    const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [b[0] - p[0], b[1] - p[1]], l1 = Math.hypot(...e1), l2 = Math.hypot(...e2);
    const n1 = [-sg * e1[1] / l1, sg * e1[0] / l1], n2 = [-sg * e2[1] / l2, sg * e2[0] / l2], dn = 1 + n1[0] * n2[0] + n1[1] * n2[1];
    out.push([p[0] + d * (n1[0] + n2[0]) / dn, p[1] + d * (n1[1] + n2[1]) / dn]);
  }
  return out;
}
/**
 * MÁI CO VÀO từ đường bao mép mái (đa giác kín): prof = [[d (co vào), h (cao trên chân)]…] — Mansard: [[0,0],[1.4,4],[5,5.6]].
 * Mặt mái hở (khoá tile…), nắp đỉnh phẳng (chì) đóng kín. Trả { top, ring(d) }
 */
export function insetRoof(acc, poly, y, prof, key = 'tileSlate', capKey = 'lead') {
  const rows = prof.map(([d, h]) => insetPoly(poly, d).map(([x, z]) => V(x, y + h, z)));
  rows.forEach((r) => r.reverse());
  acc.add(key, gridSurface(rows, true));
  const last = insetPoly(poly, prof[prof.length - 1][0]), yt = y + prof[prof.length - 1][1];
  const cap = new THREE.ShapeGeometry(new THREE.Shape(last.map(([x, z]) => new THREE.Vector2(x, -z)))); cap.rotateX(-Math.PI / 2); cap.translate(0, yt, 0); acc.add(capKey, cap);
  // bờ góc (gân chì) theo các đỉnh
  for (let i = 0; i < poly.length; i++) acc.add(capKey, ribAlong(prof.map(([d, h]) => { const q = insetPoly(poly, d)[i]; return V(q[0], y + h + 0.05, q[1]); }), 0.14, 0.1));
  return { top: yt };
}
/** cửa sổ mái (lucarne) trên dốc Mansard: khung đá, kính, đầu cong, mái nhỏ — đáy tại (x, y), mặt hướng ry */
export function lucarne(acc, x, y, z, ry, w = 1.3, h = 2.0, arched = false) {
  const t = new Acc();
  t.add('stone', boxB(w + 0.5, h, 1.4, 0, 0, -0.5));
  const poly = arched ? archPts(0, 0.35, w * 0.7, h - 0.55) : rectPts(-w * 0.35, 0.35, w * 0.35, h - 0.2);
  t.add('tileGlass4', pane(poly, 0.21));
  t.add('stoneDk', boxB(w + 0.7, 0.18, 1.6, 0, h, -0.5));
  if (arched) { const g = slabXY(Array.from({ length: 11 }, (_, i) => { const a = (i / 10) * Math.PI; return [Math.cos(a) * (w / 2 + 0.3), Math.sin(a) * 0.55]; }), 1.4, 0, h + 0.18, -0.5); t.add('lead', g); }
  else { t.add('lead', slabXY([[-(w / 2 + 0.35), 0], [w / 2 + 0.35, 0], [0, 0.75]], 1.5, 0, h + 0.18, -0.55)); }
  put(acc, t, x, y, z, ry);
}
/** ống khói gạch có mũ đá (mặt sân, tàu ngựa) */
export function chimney(acc, x, y, z, h = 2.6, ry = 0) { const t = new Acc(); t.add('brick', boxB(1.2, h, 0.7, 0, 0, 0)); t.add('stoneDk', boxB(1.4, 0.2, 0.9, 0, h, 0)); t.add('brick', boxB(0.4, 0.35, 0.4, -0.3, h + 0.2, 0)); t.add('brick', boxB(0.4, 0.35, 0.4, 0.3, h + 0.2, 0)); put(acc, t, x, y, z, ry); }

// ---------------------------------------------------------------- thềm đá + bậc (mỗi bậc một mặt đi được)
/**
 * Thềm chữ nhật W × D cao h, tâm (x, z): khối đá + gờ đầu thềm + chân; stairs: [{ side: 'z+'|'z-'|'x+'|'x-', c (toạ độ dọc cạnh), w }]
 * bậc cao ≤ 0,165 m, mặt bậc 0,36 m (thang Blondel 2R + T ≈ 0,65)
 */
export function terrace(acc, W, D, h, x = 0, z = 0, stairs = [], key = 'stone') {
  acc.add(key, boxB(W, h - 0.18, D, x, 0, z)); acc.add('stoneDk', boxB(W + 0.24, 0.18, D + 0.24, x, h - 0.18, z)); acc.add('stoneDk', boxB(W + 0.12, 0.25, D + 0.12, x, 0, z));
  acc.plat({ x, z, w: W, d: D, top: h });
  for (const s of stairs) {
    const n = Math.max(1, Math.ceil(h / 0.165)), rise = h / n, run = 0.36, ax = s.side[0] === 'z' ? 'z' : 'x', sg = s.side[1] === '+' ? 1 : -1, edge = ax === 'z' ? D / 2 : W / 2;
    for (let i = 0; i < n; i++) {
      const top = rise * (i + 1), off = edge + run * (n - i - 0.5);
      if (ax === 'z') { acc.add(key, boxB(s.w, top, run, x + s.c, 0, z + sg * off)); acc.plat({ x: x + s.c, z: z + sg * off, w: s.w, d: run + 0.02, top }); }
      else { acc.add(key, boxB(run, top, s.w, x + sg * off, 0, z + s.c)); acc.plat({ x: x + sg * off, z: z + s.c, w: run + 0.02, d: s.w, top }); }
    }
    for (const e of [-1, 1]) { const L = n * run; if (ax === 'z') acc.add('stoneDk', boxB(0.5, h, L, x + s.c + e * (s.w / 2 + 0.25), 0, z + sg * (edge + L / 2))); else acc.add('stoneDk', boxB(L, h, 0.5, x + sg * (edge + L / 2), 0, z + s.c + e * (s.w / 2 + 0.25))); }
  }
}
/** thềm tròn / đa giác bậc (đền tròn, colonnade) — bậc từ ngoài vào: radii[], cao mỗi bậc rise */
export function roundSteps(acc, radii, rise, key = 'stone', seg = 48, y0 = 0) {
  radii.forEach((r, i) => { acc.add(key, cyl(r, r, rise * (i + 1), 0, y0, 0, seg)); acc.plat({ poly: true, x: 0, z: 0, n: 16, a: r * Math.cos(Math.PI / 16), top: y0 + rise * (i + 1) }); });
}

/** ống đứng ngắn nằm ngang theo trục z (cuộn) — tiện ích */
export function cylZ(r, l, x, y, z, seg = 10) { const g = new THREE.CylinderGeometry(r, r, l, seg); g.rotateX(Math.PI / 2); g.translate(x, y, z); return g; }
export { mergeGeometries };

// ---------------------------------------------------------------- MẶT ĐỨNG MỘT THỨC (dùng chung cho khối nhỏ: Trianon, đình, nhà nguyện…)
/**
 * Mặt dài L (khung cục bộ, tường z = 0, ngoài +z): n ô cửa giữa các trụ pilaster (đơn / đôi), entablature, lan can + trụ đặc.
 * o: { y0, ord, colH, colW, ent, n, pairs, wallKey, pilKey, capKey, win: { kind, w, h, dy, glass }, door (ô cửa vào), open (ô mở), balH, vases, wallT,
 *      cornerPil (true: có pilaster ở hai đầu), fluted, mod, dent, frieze, keyMask }
 * trả { yE (chân entablature), yT (đỉnh entablature), top }
 */
export function ordFace(acc, L, o) {
  const y0 = o.y0 ?? 0, n = o.n, p = L / n, colH = o.colH, cw = o.colW, ent = o.ent ?? colH * ORD[o.ord].ent / ORD[o.ord].col, t = o.wallT ?? 0.7;
  const yE = y0 + (o.plinth ?? 0.4) + colH, yT = yE + ent, wk = o.wallKey || 'stone', pk = o.pilKey || wk;
  const holes = [];
  for (let i = 0; i < (o.noWin ? 0 : n); i++) {
    const xc = -L / 2 + p * (i + 0.5), w = o.win || { kind: 'arch', w: p * 0.45, h: colH * 0.75, dy: 0.5 };
    const door = o.door === i, open = o.open && o.open.includes(i);
    holes.push({ kind: w.kind || 'arch', x: xc, y0: door || open ? y0 : y0 + (w.dy ?? 0.5), w: door ? Math.max(2.4, w.w) : open ? w.ow || w.w : w.w, h: door ? Math.max(3.2, w.h + (w.dy ?? 0.5)) : open ? w.oh || w.h : w.h, door: door || open, glass: w.glass || 'tileGlass' });
  }
  acc.add(wk, slabHoles(rectPts(-L / 2, y0, L / 2, yT), holes.map((h) => (h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h))), 0, t));
  for (const h of holes) { opening(acc, h, 0, { reveal: 0.3, frame: o.frame === false ? null : { w: 0.16, d: 0.06, sill: h.kind === 'rect' && !h.door } }); if (h.kind === 'arch') keystone(acc, h.x, h.y0 + h.h + 0.03, 0, 0.42, 0.6, 0.14, !!o.keyMask, 'carve'); }
  acc.add(o.baseKey || 'stoneDk', boxB(L, o.plinth ?? 0.4, 0.25, 0, y0, 0.1));
  const px = []; for (let i = 0; i <= n; i++) { if (!o.cornerPil && (i === 0 || i === n)) continue; const x = -L / 2 + p * i, e = i === 0 ? 1 : i === n ? -1 : 0; if (o.pairs) { const g = cw * 1.25; px.push(e ? x + e * cw * 0.6 : x - g, e ? x + e * (cw * 0.6 + g * 2) : x + g); } else px.push(x + e * cw * 0.55); }
  for (const x of px) pilaster(acc, o.ord, x, y0 + (o.plinth ?? 0.4), 0, colH, cw, o.pilProj ?? 0.14, { key: pk, capKey: o.capKey, fluted: o.fluted });
  entab(acc, o.ord, -L / 2, L / 2, yE, 0.14, ent, { dent: o.dent, mod: o.mod, frieze: o.frieze, dep: t + 0.1, key: o.entKey || 'stone' });
  let top = yT;
  if (o.balH) { const des = balus(acc, -L / 2, L / 2, yT, -0.15, { h: o.balH, des: px, cut: o.cut, key: o.balKey }); top = yT + o.balH; if (o.vases) des.forEach((d, k) => { if (k % (o.vases) === 0) potAFeu(acc, d, yT + o.balH + 0.1, -0.15, 1.2, k); }); }
  return { yE, yT, top, px };
}
