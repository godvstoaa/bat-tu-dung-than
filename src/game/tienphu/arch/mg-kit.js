// ============================================================================
//  BỘ CẤU KIỆN MUGHAL (Shahjahani — quần thể Taj Mahal) — theo docs/tienphu-nghiencuu/09-mughal.md §A–§E.
//  Vòm nhọn bốn tâm · vòm nhiều múi · hốc vòm (niche) có chiều sâu · khung pishtaq + dải thư pháp + spandrel pietra dura ·
//  chhajja (mái đua đá trên consol) · cột Shahjahani · guldasta · chhatri bát giác 8 trụ · vòm bầu (amrud) + sen úp + finial ·
//  minaret 3 ban công · jali. Chỉ import (đọc) từ kit.js. Mọi khối kín; mặt hở đặt khoá bắt đầu bằng 'tile'.
// ============================================================================
import * as THREE from 'three';
import { box, boxB, ribAlong, gridSurface, V } from './kit.js';

/** hệ số chung cả khu: 1,06 × số đo thật (lầu 10 tầng FH 5 m buộc lăng ≈ cỡ thật — xem mg-spec.js / lầu) */
export const S = 1.06;

export const MG_COL = {
  marble: '#ece8df', vein: '#c9c3b8', red: '#a8624a', redLight: '#b97556', redDark: '#8a4b3b', inlay: '#e6e1d6',
  domeW: '#e8e4da', domeR: '#c27a55', black: '#1e1c1a', gold: '#c9a646', pave: '#9c5c46', niche: '#6e685e',
  pdRed: '#a8322b', pdGreen: '#3f6b45', pdBlue: '#2f5d8c', pdYellow: '#c9a24a', water: '#4d7f8f', grass: '#5d7a38',
};

// ---------------------------------------------------------------- vật liệu (canvas thủ tục — chỉ trong trình duyệt)
const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
function canvasTex(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
/** cẩm thạch Makrana: nền #ECE8DF, vân xám #C9C3B8 */
const marbleTex = (base = MG_COL.marble) => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(7);
  for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(150,142,128,${0.08 + r() * 0.12})`; g.lineWidth = 0.6 + r() * 1.4; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.3) * 60; y += (r() - 0.5) * 40; g.lineTo(x, y); } g.stroke(); }
});
/** sa thạch đỏ Fatehpur Sikri: hạt + mạch ghép khối mờ */
const redTex = (base = MG_COL.red) => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(11);
  for (let i = 0; i < 2200; i++) { g.fillStyle = r() < 0.5 ? 'rgba(80,30,20,0.10)' : 'rgba(230,170,130,0.10)'; g.fillRect(r() * w, r() * h, 2, 2); }
  g.strokeStyle = 'rgba(70,30,22,0.25)'; g.lineWidth = 1.2;
  for (let row = 0; row < 4; row++) { const y = (row * h) / 4; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 2; c++) { const x = ((c + (row % 2) * 0.5) * w) / 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 4); g.stroke(); } }
});
/** cẩm thạch ghép khối viền đen (thân minaret — «ốp đá viền đen giả khối») */
const blockTex = () => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = MG_COL.marble; g.fillRect(0, 0, w, h); g.strokeStyle = MG_COL.black; g.lineWidth = 3;
  for (let row = 0; row < 4; row++) { const y = (row * h) / 4 + 1; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 2; c++) { const x = ((c + (row % 2) * 0.5) * w) / 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 4); g.stroke(); } }
});
/** dải thư pháp: chữ thuluth đen khảm trên cẩm thạch, viền đen hai mép */
const calligTex = () => canvasTex(512, 128, (g, w, h) => {
  g.fillStyle = MG_COL.marble; g.fillRect(0, 0, w, h); g.fillStyle = MG_COL.black; g.fillRect(0, 4, w, 7); g.fillRect(0, h - 11, w, 7);
  const r = rng(5); g.strokeStyle = MG_COL.black; g.lineCap = 'round';
  for (let x = 14; x < w - 8; x += 9 + r() * 7) { g.lineWidth = 3 + r() * 2; const top = 26 + r() * 30; g.beginPath(); g.moveTo(x, 98); g.lineTo(x + (r() - 0.5) * 4, top); g.stroke(); if (r() < 0.45) { g.beginPath(); g.moveTo(x - 6, 96); g.quadraticCurveTo(x + 12, 112, x + 26, 92); g.stroke(); } if (r() < 0.3) { g.beginPath(); g.arc(x + 6, 60 + r() * 20, 4, 0, Math.PI * 2); g.stroke(); } }
});
/** pietra dura: dây leo hoa nhiều màu trên nền cẩm thạch (spandrel) */
const pduraTex = () => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = MG_COL.marble; g.fillRect(0, 0, w, h); const r = rng(3);
  g.strokeStyle = MG_COL.pdGreen; g.lineWidth = 3;
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(0, 30 + i * 64); for (let x = 0; x <= w; x += 16) g.lineTo(x, 30 + i * 64 + Math.sin(x / 20 + i) * 14); g.stroke(); }
  const cols = [MG_COL.pdRed, MG_COL.pdBlue, MG_COL.pdYellow, MG_COL.pdRed];
  for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, c = cols[i % 4]; g.fillStyle = c; for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2; g.beginPath(); g.ellipse(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 4, 2.4, a, 0, Math.PI * 2); g.fill(); } g.fillStyle = MG_COL.pdYellow; g.beginPath(); g.arc(x, y, 2.4, 0, Math.PI * 2); g.fill(); }
});
/** jali: tấm đá đục lỗ lưới sao (đường 0/45/90/135°) */
const jaliTex = (base) => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#2a231f'; g.fillRect(0, 0, w, h); g.strokeStyle = base; g.lineWidth = 6;
  for (let i = -4; i <= 8; i++) { const o = i * 32; g.beginPath(); g.moveTo(o, 0); g.lineTo(o, h); g.stroke(); g.beginPath(); g.moveTo(0, o); g.lineTo(w, o); g.stroke(); g.beginPath(); g.moveTo(o, 0); g.lineTo(o + h, h); g.stroke(); g.beginPath(); g.moveTo(o + h, 0); g.lineTo(o, h); g.stroke(); }
  g.lineWidth = 8; g.strokeRect(0, 0, w, h);
});
/** guldasta: thân hoa văn zigzag trắng-đỏ */
const zigzagTex = () => canvasTex(64, 64, (g, w, h) => {
  g.fillStyle = MG_COL.red; g.fillRect(0, 0, w, h); g.strokeStyle = MG_COL.inlay; g.lineWidth = 7;
  for (const y0 of [12, 44]) { g.beginPath(); g.moveTo(0, y0); for (let x = 0; x <= w; x += 16) g.lineTo(x + 8, y0 + ((x / 16) % 2 ? -10 : 10)); g.stroke(); }
});
/** trống vòm nhà phụ: «hoa văn khóa xen trắng-đỏ» (Archnet) */
const keyTex = () => canvasTex(256, 64, (g, w, h) => {
  for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? MG_COL.red : MG_COL.inlay; g.beginPath(); g.moveTo(i * 16, 0); g.lineTo(i * 16 + 16, 0); g.lineTo(i * 16 + 12, h); g.lineTo(i * 16 - 4, h); g.closePath(); g.fill(); }
  g.fillStyle = MG_COL.inlay; g.fillRect(0, 0, w, 5); g.fillRect(0, h - 5, w, 5);
});
/** sân lát sa thạch đỏ — ô hình học viền cẩm thạch */
const paveTex = (a, b) => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = a; g.fillRect(0, 0, w, h); g.strokeStyle = b; g.lineWidth = 4;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); }
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * 64 + 32, y = j * 64 + 32; g.beginPath(); g.moveTo(x, y - 20); g.lineTo(x + 20, y); g.lineTo(x, y + 20); g.lineTo(x - 20, y); g.closePath(); g.stroke(); }
});
/** vòm hốc iwan: lưới sao khắc chìm (muqarnas / net) */
const netTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#d8d2c4'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(90,82,70,0.55)'; g.lineWidth = 2;
  for (let i = -2; i <= 4; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + h, h); g.stroke(); g.beginPath(); g.moveTo(i * 32 + h, 0); g.lineTo(i * 32, h); g.stroke(); }
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.beginPath(); g.arc(i * 32 + 16, j * 32 + 16, 6, 0, Math.PI * 2); g.stroke(); }
});
/** dado: phù điêu cây hoa trong hốc nhiều múi (cẩm thạch) */
const dadoTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = MG_COL.marble; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,110,95,0.7)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(18, h - 8); g.lineTo(18, 46); g.quadraticCurveTo(64, -2, 110, 46); g.lineTo(110, h - 8); g.stroke();
  g.beginPath(); g.moveTo(64, h - 12); g.lineTo(64, 40); g.stroke();
  for (const [x, y] of [[64, 36], [46, 58], [82, 58], [50, 84], [78, 84]]) { g.beginPath(); g.ellipse(x, y, 7, 4, 0, 0, Math.PI * 2); g.stroke(); }
});
/** cửa: gỗ sẫm đính đinh đồng */
const doorTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = '#4a3324'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2b1d14'; g.lineWidth = 4; g.strokeRect(6, 6, w / 2 - 9, h - 12); g.strokeRect(w / 2 + 3, 6, w / 2 - 9, h - 12);
  g.fillStyle = '#b08a3e'; for (let y = 20; y < h; y += 22) for (let x = 16; x < w; x += 22) { g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill(); }
});

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.75, ...o });
let MATS = null;
/** vật liệu Mughal (khoá dùng trong acc) */
export function mgMats() {
  if (MATS) return MATS;
  const mt = marbleTex(), rt = redTex(), rtD = redTex(MG_COL.redDark), bt = blockTex(), ct = calligTex(), pd = pduraTex(), jw = jaliTex(MG_COL.marble), jr = jaliTex(MG_COL.redLight);
  const zz = zigzagTex(), kt = keyTex(), pv = paveTex(MG_COL.pave, MG_COL.inlay), pw = paveTex('#e4dfd3', '#b9b2a4'), nt = netTex(), dd = dadoTex(), dt = doorTex();
  const m = (t, o) => std(t ? { map: t, ...o } : o);
  MATS = {
    marble: m(mt, { color: mt ? '#ffffff' : MG_COL.marble, roughness: 0.45 }), marbleBlk: m(bt, { color: bt ? '#ffffff' : MG_COL.marble, roughness: 0.45 }),
    red: m(rt, { color: rt ? '#ffffff' : MG_COL.red }), redDk: m(rtD, { color: rtD ? '#ffffff' : MG_COL.redDark }),
    inlay: std({ color: MG_COL.inlay, roughness: 0.5 }), domeW: m(mt, { color: mt ? '#fbf8f2' : MG_COL.domeW, roughness: 0.4 }), domeR: std({ color: MG_COL.domeR, roughness: 0.7 }),
    gold: std({ color: MG_COL.gold, roughness: 0.3, metalness: 0.7 }), black: std({ color: MG_COL.black, roughness: 0.5 }),
    shade: std({ color: '#c9c2b3', roughness: 0.6 }), shadeR: std({ color: '#7a4232', roughness: 0.85 }),
    callig: m(ct, { color: ct ? '#ffffff' : MG_COL.black, roughness: 0.45 }), pdura: m(pd, { color: pd ? '#ffffff' : MG_COL.inlay, roughness: 0.45 }),
    jali: m(jw, { color: jw ? '#ffffff' : '#9a9286' }), jaliR: m(jr, { color: jr ? '#ffffff' : MG_COL.redDark }),
    zigzag: m(zz, { color: zz ? '#ffffff' : MG_COL.red }), drumKey: m(kt, { color: kt ? '#ffffff' : MG_COL.red }),
    pave: m(pv, { color: pv ? '#ffffff' : MG_COL.pave }), paveW: m(pw, { color: pw ? '#ffffff' : MG_COL.inlay, roughness: 0.5 }),
    tileVault: m(nt, { color: nt ? '#ffffff' : '#d8d2c4', side: THREE.DoubleSide }), tileVaultR: std({ color: '#93513d', side: THREE.DoubleSide }),
    dado: m(dd, { color: dd ? '#ffffff' : MG_COL.marble, roughness: 0.5 }), door: m(dt, { color: dt ? '#ffffff' : '#4a3324' }),
    water: std({ color: MG_COL.water, roughness: 0.08, metalness: 0.1 }), grass: std({ color: MG_COL.grass, roughness: 0.95 }),
  };
  return MATS;
}
/** cỡ ô texture theo khoá (m) — UV chiếu theo toạ độ thế giới */
const UVT = { marble: [5, 5], marbleBlk: [1.6, 1.6], red: [4, 4], redDk: [4, 4], callig: [3.2, 0.8], pdura: [2.4, 2.4], jali: [0.9, 0.9], jaliR: [0.9, 0.9], zigzag: [0.7, 0.7], drumKey: [2.4, 0.6], pave: [3, 3], paveW: [3, 3], tileVault: [1.6, 1.6], dado: [1.2, 1.2], door: [2.4, 4.0], domeW: [6, 6] };
/** gán UV chiếu thế giới (trục trội của pháp tuyến) cho mọi lưới đã gom — gọi một lần cuối bộ dựng */
export function finishUV(acc) {
  for (const [key, list] of acc.parts) {
    const [tu, tv] = UVT[key] || [4, 4];
    for (const g of list) {
      const p = g.attributes.position, n = p.count, uv = new Float32Array(n * 2), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), nn = new THREE.Vector3();
      for (let i = 0; i < n; i += 3) {
        a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
        nn.subVectors(c, b).cross(new THREE.Vector3().subVectors(a, b)); const ax = Math.abs(nn.x), ay = Math.abs(nn.y), az = Math.abs(nn.z);
        for (let k = 0; k < 3; k++) { const q = [a, b, c][k]; let u, v; if (ay >= ax && ay >= az) { u = q.x; v = q.z; } else if (ax >= az) { u = q.z; v = q.y; } else { u = q.x; v = q.y; } uv[(i + k) * 2] = u / tu; uv[(i + k) * 2 + 1] = v / tv; }
      }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    }
  }
}

// ---------------------------------------------------------------- hình cơ sở
/** lathe có góc bắt đầu (8 cạnh: phi0 = π/8 → cạnh phẳng quay ±z, ±x) — hồ sơ [[r, y], …] */
export function lathe2(prof, seg = 24, phi0 = 0, x = 0, y = 0, z = 0, flat = false, len = Math.PI * 2) {
  let g = new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(Math.max(0.001, r), h)), seg, phi0, len);
  if (flat) { g = g.toNonIndexed(); g.computeVertexNormals(); }
  g.translate(x, y, z); return g;
}
/** lathe bát giác (cạnh phẳng quay ±x, ±z): r theo apothem */
export const oct = (prof, x = 0, y = 0, z = 0) => lathe2(prof.map(([a, h]) => [a / Math.cos(Math.PI / 8), h]), 8, Math.PI / 8, x, y, z, true);
/** đa giác (x, y) [+ lỗ] đùn dày t theo −z (mặt ngoài tại z = 0) */
export function extXY(outer, holes = [], t = 0.3) {
  const sh = new THREE.Shape(outer.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 2 }); g.translate(0, 0, -t); return g;
}
/** tấm ngang từ đa giác [[x, z]] (+ lỗ), mặt trên tại y, dày t */
export function slabXZ(pts, y, t, holes = []) {
  const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z))));
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 2 }); g.rotateX(-Math.PI / 2); g.translate(0, y - t, 0); return g;
}
/** khối «loft» qua các tiết diện cùng số đỉnh (mỗi tiết diện là vòng kín [V…]) — tự sửa chiều quay mặt cho kín */
export function loft(secs) {
  const k = secs[0].length, pos = [];
  const tri = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let s = 0; s < secs.length - 1; s++) for (let i = 0; i < k; i++) { const a = secs[s][i], b = secs[s][(i + 1) % k], c = secs[s + 1][(i + 1) % k], d = secs[s + 1][i]; tri(a, b, c); tri(a, c, d); }
  for (let i = 1; i < k - 1; i++) { const A = secs[0]; tri(A[0], A[i + 1], A[i]); const B = secs[secs.length - 1]; tri(B[0], B[i], B[i + 1]); }
  // thể tích có dấu → lật nếu âm
  let vol = 0; for (let i = 0; i < pos.length; i += 9) vol += pos[i] * (pos[i + 4] * pos[i + 8] - pos[i + 5] * pos[i + 7]) - pos[i + 1] * (pos[i + 3] * pos[i + 8] - pos[i + 5] * pos[i + 6]) + pos[i + 2] * (pos[i + 3] * pos[i + 7] - pos[i + 4] * pos[i + 6]);
  if (vol < 0) for (let i = 0; i < pos.length; i += 9) for (let j = 0; j < 3; j++) { const t = pos[i + 3 + j]; pos[i + 3 + j] = pos[i + 6 + j]; pos[i + 6 + j] = t; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
}
/** hộp dọc đoạn a→b (mặt bằng), cao h từ y, dày t (lệch ngang off theo pháp tuyến trái) */
export function edgeBox(a, b, y, h, t, off = 0) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L;
  return box(L, h, t, (a[0] + b[0]) / 2 + nx * off, y + h / 2, (a[1] + b[1]) / 2 + nz * off, Math.atan2(-dz, dx));
}
/** đa giác đều n cạnh (cạnh phẳng quay ±z) apothem a, tâm (cx, cz) — ngược chiều kim đồng hồ nhìn từ trên (+y) */
export function ngon(n, a, cx = 0, cz = 0, rot = 0) {
  const r = a / Math.cos(Math.PI / n), out = [];
  for (let k = 0; k < n; k++) { const t = rot + Math.PI / 2 + Math.PI / n + (2 * Math.PI * k) / n; out.push([cx + Math.cos(t) * r, cz + Math.sin(t) * r]); }
  return out.reverse();
}
/** offset đa giác lồi (miter) ra ngoài d */
export function offsetPoly(pts, d) {
  const n = pts.length, area = pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * p[1], 0), sg = area > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const n1 = norm2([sg * (p[1] - a[1]), -sg * (p[0] - a[0])]), n2 = norm2([sg * (b[1] - p[1]), -sg * (b[0] - p[0])]);
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]]), c = m[0] * n1[0] + m[1] * n1[1];
    return [p[0] + (m[0] * d) / c, p[1] + (m[1] * d) / c];
  });
}
const norm2 = ([x, y]) => { const L = Math.hypot(x, y) || 1; return [x / L, y / L]; };

// ---------------------------------------------------------------- MẶT ĐỨNG cục bộ: x = ngang (phải khi nhìn từ ngoài), y = lên, z = pháp tuyến ra ngoài
export class Face {
  constructor(acc, M) { this.acc = acc; this.M = M; }
  /** mặt tại gốc (ox, oy, oz), pháp tuyến ngang (nx, nz) */
  static at(acc, ox, oy, oz, nx, nz) { const L = Math.hypot(nx, nz); nx /= L; nz /= L; return new Face(acc, new THREE.Matrix4().makeBasis(new THREE.Vector3(nz, 0, -nx), new THREE.Vector3(0, 1, 0), new THREE.Vector3(nx, 0, nz)).setPosition(ox, oy, oz)); }
  /** mặt con trong khung cục bộ của mặt này */
  sub(x, y, z, nx, nz) { const c = Face.at(null, x, y, z, nx, nz); return new Face(this.acc, this.M.clone().multiply(c.M)); }
  add(key, g) { if (!g) return g; g.applyMatrix4(this.M); this.acc.add(key, g); return g; }
  /** điểm cục bộ → thế giới */
  pt(x, y, z) { return new THREE.Vector3(x, y, z).applyMatrix4(this.M); }
}

// ---------------------------------------------------------------- VÒM
/** nửa vòm nhọn bốn tâm đơn vị: chân (1, 0) → đỉnh (0, 1) — cung nhỏ bán kính 0,62 tới 48°, rồi cung lớn tới đỉnh nhọn */
const UNIT = (() => {
  const r1 = 0.62, a = (48 * Math.PI) / 180, c1x = 1 - r1, ca = Math.cos(a), sa = Math.sin(a);
  const px = c1x + r1 * ca, py = r1 * sa, dy = 1 - py, r2 = (px * px + dy * dy) / (2 * (px * ca - dy * sa)), c2x = px - r2 * ca, c2y = py - r2 * sa;
  const pts = []; for (let i = 0; i <= 5; i++) { const t = (a * i) / 5; pts.push([c1x + r1 * Math.cos(t), r1 * Math.sin(t)]); }
  const f0 = Math.atan2(py - c2y, px - c2x), f1 = Math.atan2(1 - c2y, -c2x);
  for (let i = 1; i <= 6; i++) { const f = f0 + ((f1 - f0) * i) / 6; pts.push([c2x + r2 * Math.cos(f), c2y + r2 * Math.sin(f)]); }
  pts[pts.length - 1] = [0, 1]; return pts;
})();
/** đường vòm (phải → trái) nửa nhịp s, cao vòm rise, chân tại (cx, ys); cusps = số múi (vòm nhiều múi), 0 = trơn */
export function archCurve(cx, ys, s, rise, cusps = 0) {
  const R = UNIT.map(([x, y]) => [cx + x * s, ys + y * rise]), L = [...UNIT].reverse().slice(1).map(([x, y]) => [cx - x * s, ys + y * rise]);
  let pts = [...R, ...L];
  if (!cusps) return pts;
  // lấy mẫu lại theo chiều dài rồi khoét múi: offset vào trong = amp·(1 − √(1 − (2f − 1)²))
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = cum[cum.length - 1], N = cusps * 5, amp = Math.min(s * 0.16, (T / cusps) * 0.32), out = [];
  const at = (d) => { let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const f = (d - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]), p = pts[i - 1], q = pts[i]; return { p: [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f], t: norm2([q[0] - p[0], q[1] - p[1]]) }; };
  for (let j = 0; j <= N; j++) {
    const d = (j / N) * T, { p, t } = at(d), f = ((d / T) * cusps) % 1, o = amp * (1 - Math.sqrt(Math.max(0, 1 - (2 * f - 1) ** 2))) * Math.min(1, (j / N) * cusps * 1.5, ((N - j) / N) * cusps * 1.5);
    out.push([p[0] - t[1] * o, p[1] + t[0] * o]);
  }
  return out;
}
/** lỗ vòm kín (ngược chiều kim đồng hồ): đáy (cx ± w/2, y0), cột tới chân vòm hs, vòm cao rise */
export function archPoly(cx, y0, w, hs, rise, cusps = 0) {
  const c = archCurve(cx, y0 + hs, w / 2, rise, cusps), out = [[cx - w / 2, y0], [cx + w / 2, y0]];
  if (hs > 0.02) out.push([cx + w / 2, y0 + hs]);
  out.push(...c.slice(1, -1));
  if (hs > 0.02) out.push([cx - w / 2, y0 + hs]);
  return out;
}

/**
 * TƯỜNG có lỗ vòm trên mặt F: x0..x1, y0..y1, dày t (mặt ngoài z = z0)
 * ops: [{ cx, y (cao bậu), w, hs (cao tới chân vòm tính từ bậu), rise, cusps, kind: 'open'|'door'|'niche'|'jali'|'blind', d (sâu hốc), back (khoá tấm đáy) }]
 * lỗ chạm chân tường thành khe cửa của đường bao
 */
export function wall(F, key, { x0, x1, y0, y1, t = 0.8, z0 = 0, ops = [], shade = 'shade', rim = 0.3 }) {
  const holes = [], notch = [];
  for (const o of ops) (o.y <= y0 + 0.01 ? notch : holes).push(o);
  notch.sort((a, b) => a.cx - b.cx);
  const outer = [[x0, y0]];
  for (const o of notch) { const p = archPoly(o.cx, y0, o.w, o.hs, o.rise, o.cusps || 0); outer.push(p[0], ...p.slice(2).reverse(), p[1]); }
  outer.push([x1, y0], [x1, y1], [x0, y1]);
  const g = extXY(outer, holes.map((o) => archPoly(o.cx, o.y, o.w, o.hs, o.rise, o.cusps || 0)), t); g.translate(0, 0, z0); F.add(key, g);
  for (const o of ops) {
    const k = o.kind || 'niche';
    if (k === 'open') continue;
    if (k === 'door') { const p = archPoly(o.cx, o.y, o.w, o.hs, o.rise, o.cusps || 0), d = extXY(p, [], 0.12); d.translate(0, 0, z0 - t * 0.6); F.add('door', d); continue; }
    const d = o.d ?? (k === 'jali' ? 0.35 : k === 'blind' ? 0.3 : 1.2);
    niche(F, shade, o.back || (k === 'jali' ? 'jali' : shade), o.cx, o.y, o.w, o.hs, o.rise, z0 - t, d, o.cusps || 0, rim);
  }
}
/** hốc vòm sau lỗ: vành (má hốc + vòm hốc) sâu d từ z0, tấm đáy khoá back */
export function niche(F, keyRev, keyBack, cx, y, w, hs, rise, z0, d, cusps = 0, rim = 0.3) {
  const inner = archPoly(cx, y, w, hs, rise, cusps), outer = archPoly(cx, y - rim, w + 2 * rim, hs + rim, rise * (1 + (2 * rim) / w), 0);
  const ring = extXY(outer, [inner], d); ring.translate(0, 0, z0); F.add(keyRev, ring);
  const back = extXY(inner, [], 0.12); back.translate(0, 0, z0 - d + 0.12); F.add(keyBack, back);
}
/** khung chữ nhật (alfiz / panel) nổi proud trên mặt z0: trái, phải, trên (+ dưới nếu bottom) */
export function frame(F, key, x0, x1, y0, y1, bw, proud = 0.06, z0 = 0, bottom = false) {
  F.add(key, boxB(bw, y1 - y0, proud, x0 + bw / 2, y0, z0 + proud / 2)); F.add(key, boxB(bw, y1 - y0, proud, x1 - bw / 2, y0, z0 + proud / 2));
  F.add(key, boxB(x1 - x0, bw, proud, (x0 + x1) / 2, y1 - bw, z0 + proud / 2)); if (bottom) F.add(key, boxB(x1 - x0, bw, proud, (x0 + x1) / 2, y0, z0 + proud / 2));
}
/** spandrel: vùng giữa vòm và cạnh trên khung (x0..x1, tới yTop) — tấm mỏng khoá key (pietra dura / cẩm thạch) */
export function spandrel(F, key, cx, ys, w, rise, x0, x1, yTop, proud = 0.03, z0 = 0) {
  const c = archCurve(cx, ys, w / 2, rise);
  const pts = [[x1, ys], [x1, yTop], [x0, yTop], [x0, ys], ...[...c].reverse()];
  if (Math.abs(x0 - (cx - w / 2)) < 1e-3) pts.splice(3, 1);
  const g = extXY(pts.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-3), [], proud); g.translate(0, 0, z0 + proud); F.add(key, g);
}
/** gờ viền theo đường vòm (chỉ đúc) */
export function archRib(F, key, cx, ys, w, rise, z0 = 0, bw = 0.14, cusps = 0) {
  let c = archCurve(cx, ys, w / 2 + bw * 0.4, rise + bw * 0.4, cusps);
  const tgt = w > 6 ? 20 : 12; if (c.length > tgt + 2) { const k = Math.ceil(c.length / tgt); c = c.filter((_, i) => i % k === 0 || i === c.length - 1); }
  F.add(key, sweepXY(c, bw, bw * 0.6, z0 + bw * 0.3));
}
/** ống tiết diện chữ nhật (rộng w trong mặt phẳng, dày h theo z) chạy theo đường gấp khúc 2D trong mặt XY tại z — kín hai đầu */
export function sweepXY(pts, w, h, z = 0) {
  const n = pts.length, secs = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], t = norm2([b[0] - a[0], b[1] - a[1]]), q = [-t[1], t[0]], [x, y] = pts[i];
    secs.push([V(x + (q[0] * w) / 2, y + (q[1] * w) / 2, z - h / 2), V(x - (q[0] * w) / 2, y - (q[1] * w) / 2, z - h / 2), V(x - (q[0] * w) / 2, y - (q[1] * w) / 2, z + h / 2), V(x + (q[0] * w) / 2, y + (q[1] * w) / 2, z + h / 2)]);
  }
  return loft(secs);
}
/** ô vòm có khung (alfiz) đầy đủ: lỗ trong tường đã dựng — chỉ thêm khung + spandrel + gờ vòm */
export function archDress(F, o, keys) {
  const { cx, y, w, hs, rise } = o, m = o.m ?? Math.max(0.18, w * 0.09), bw = o.bw ?? Math.max(0.12, w * 0.045), yT = y + hs + rise + m;
  frame(F, keys.frame, cx - w / 2 - m - bw, cx + w / 2 + m + bw, y, yT + bw, bw, 0.05);
  spandrel(F, keys.spand, cx, y + hs, w, rise, cx - w / 2 - m, cx + w / 2 + m, yT, 0.025);
  archRib(F, keys.frame, cx, y + hs, w, rise, 0, Math.max(0.08, w * 0.025), o.cusps || 0);
}

// ---------------------------------------------------------------- MÁI ĐUA, LAN CAN
/** chhajja vòng quanh đa giác lồi poly [[x, z]] (mép tường) tại cao y: vươn out, hạ drop, dày th; consol mỗi ~step m */
export function chhajja(acc, key, poly, y, out, { drop = out * 0.38, th = 0.16, step = 1.1, keyC = key, consoles = true } = {}) {
  const O = offsetPoly(poly, out), I = offsetPoly(poly, -0.05), n = poly.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = I[i], b = I[j], c = O[j], d = O[i];
    acc.add(key, loft([[V(a[0], y, a[1]), V(b[0], y, b[1]), V(c[0], y - drop, c[1]), V(d[0], y - drop, d[1])], [V(a[0], y - th * 1.6, a[1]), V(b[0], y - th * 1.6, b[1]), V(c[0], y - drop - th, c[1]), V(d[0], y - drop - th, d[1])]].map((s) => s)));
    if (!consoles) continue;
    const p = poly[i], q = poly[j], L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = Math.max(1, Math.round(L / step)), nx = -(q[1] - p[1]) / L, nz = (q[0] - p[0]) / L;
    const sg = (offsetPoly(poly, 1)[i][0] - p[0]) * nx + (offsetPoly(poly, 1)[i][1] - p[1]) * nz > 0 ? 1 : -1;
    for (let k = 0; k < m; k++) {
      const t = (k + 0.5) / m, x = p[0] + (q[0] - p[0]) * t, z = p[1] + (q[1] - p[1]) * t, ry = Math.atan2(sg * nx, sg * nz), len = out * 0.7;
      const g = loft([[V(-0.09, 0, 0), V(0.09, 0, 0), V(0.09, -out * 0.9, 0), V(-0.09, -out * 0.9, 0)], [V(-0.09, -drop * 0.6, len), V(0.09, -drop * 0.6, len), V(0.09, -drop * 0.6 - out * 0.22, len), V(-0.09, -drop * 0.6 - out * 0.22, len)]]);
      g.rotateY(ry); g.translate(x, y - th * 1.6, z); acc.add(keyC, g);
    }
  }
}
/** lan can (parapet) quanh đường gấp khúc pts tại y: tường thấp + mũ + ô panel (khoá panel) */
export function parapet(acc, key, pts, y, h = 1.0, t = 0.3, { panel = null, closed = true, merlon = false } = {}) {
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue;
    acc.add(key, edgeBox(a, b, y, h * 0.85, t)); acc.add(key, edgeBox(a, b, y + h * 0.85, h * 0.15, t + 0.12));
    const m = Math.max(1, Math.round(L / 1.2));
    if (panel) for (let k = 0; k < m; k++) { const t0 = (k + 0.12) / m, t1 = (k + 0.88) / m, p = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], q = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]; acc.add(panel, edgeBox(p, q, y + h * 0.15, h * 0.55, t + 0.04)); }
    if (merlon) for (let k = 0; k < m; k++) { const tt = (k + 0.5) / m, x = a[0] + (b[0] - a[0]) * tt, z = a[1] + (b[1] - a[1]) * tt, ry = Math.atan2(-(b[1] - a[1]), b[0] - a[0]); acc.add(key, box(0.62, 0.4, t, x, y + h + 0.2, z, ry)); acc.add(key, box(0.36, 0.3, t, x, y + h + 0.55, z, ry)); }
  }
}

// ---------------------------------------------------------------- CỘT, GULDASTA
/** cột Shahjahani: chân ô nhiều múi, thân bát giác thuôn, đầu muqarnas loe, tấm đầu (Koch nguyên tắc 5) */
export function shahCol(acc, key, x, y, z, h, d, lod = 2) {
  const r = d / 2;
  if (lod === 0) { acc.add(key, lathe2([[0.001, 0], [r * 1.5, 0], [r * 1.05, h * 0.1], [r, h * 0.85], [r * 1.9, h], [0.001, h]], 4, Math.PI / 4, x, y, z, true)); return; }
  acc.add(key, oct([[0.001, 0], [r * 1.25, 0], [r * 1.25, h * 0.05], [r * 1.05, h * 0.08], [r * 1.15, h * 0.11], [r * 0.82, h * 0.16], [0.001, h * 0.16]], x, y, z));
  acc.add(key, oct([[0.001, 0], [r * 0.8, 0], [r * 0.7, h * 0.62], [0.001, h * 0.62]], x, y + h * 0.16, z));
  acc.add(key, oct([[0.001, 0], [r * 0.82, 0], [r * 1.0, 0.07 * h], [r * 1.22, 0.14 * h], [r * 1.45, 0.19 * h], [r * 1.45, 0.22 * h], [0.001, 0.22 * h]], x, y + h * 0.78, z));
}
/** guldasta: tháp nhọn trang trí — thân 8 cạnh có vòng gờ, nụ sen + chóp vòm nhỏ + finial; chân tại (x, y0, z) */
export function guldasta(acc, key, x, y0, z, h, d, budKey = key, gold = 'gold') {
  const r = d / 2, hs = h * 0.78;
  acc.add(key, oct([[0.001, 0], [r * 1.2, 0], [r * 1.2, h * 0.05], [r, h * 0.06], [r * 0.9, hs], [0.001, hs]], x, y0, z));
  for (let k = 1; k <= 4; k++) acc.add(budKey, oct([[0.001, 0], [r * 1.12, 0], [r * 1.12, 0.12 * r + 0.06], [0.001, 0.12 * r + 0.06]], x, y0 + (hs * k) / 4.6, z));
  acc.add(budKey, lathe2([[0.001, 0], [r * 1.3, 0], [r * 1.35, 0.08 * h], [r * 1.05, 0.12 * h], [r * 0.5, 0.18 * h], [r * 0.18, 0.2 * h], [0.001, 0.2 * h]], 12, 0, x, y0 + hs, z));
  acc.add(gold, lathe2([[0.001, 0], [r * 0.18, 0], [r * 0.28, h * 0.03], [r * 0.08, h * 0.06], [0.001, h * 0.09]], 8, 0, x, y0 + hs + 0.19 * h, z));
}

// ---------------------------------------------------------------- VÒM BẦU, SEN, FINIAL
/** biên dạng vòm bầu (amrud): cổ rn tại y = 0 → phình R tại mx·H → thu nhọn tới rTop tại H (đặc, đáy kín) */
export function bulbProf(rn, R, H, { mx = 0.3, rTop = 0.1 * R, shell = 0 } = {}) {
  const out = [];
  for (let i = 0; i <= 6; i++) { const t = i / 6; out.push([rn + (R - rn) * Math.sin((t * Math.PI) / 2) ** 0.9, mx * H * t]); }
  // phần trên: tròn đầy tới ~60 %, rồi cong ngược (lõm) thu về cổ sen — đỉnh củ hành của vòm amrud
  const TB = [[0.15, 0.985], [0.3, 0.94], [0.45, 0.86], [0.6, 0.74], [0.72, 0.6], [0.82, 0.44], [0.9, 0.29], [0.95, 0.19], [1, 0]];
  for (const [u, f] of TB) out.push([Math.max(rTop, R * f), mx * H + (H - mx * H) * u]);
  if (!shell) return [[0.001, 0], ...out, [0.001, H]];
  const inner = out.map(([r, y]) => [Math.max(0.02, r - shell), Math.min(y, H - shell)]).reverse();
  return [...out, [0.001, H], [0.001, H - shell], ...inner, out[0]];
}
/** bán kính biên dạng (mặt ngoài, y tăng dần) tại cao yy */
export function profR(prof, yy) {
  let best = 0; for (let i = 1; i < prof.length; i++) { const [r0, y0] = prof[i - 1], [r1, y1] = prof[i]; if (y1 <= y0) continue; if (yy >= y0 && yy <= y1) best = Math.max(best, r0 + ((r1 - r0) * (yy - y0)) / (y1 - y0)); }
  return best;
}
/** sen úp (cánh ôm đỉnh vòm, đầu cánh chĩa xuống) + đế + finial nhiều quả cầu + trăng lưỡi liềm (Taj: 9,6 m mạ vàng)
 *  y = cao chân đế sen trên vòm, rCap = bán kính vòm tại y, rAt(yy) = bán kính vòm ở cao yy (để cánh bám mặt vòm) */
export function lotusFinial(acc, { x = 0, y, z = 0, rCap, rAt = null, petalL, n = 16, fin, keyPetal, keyFin = 'gold', crescent = true, seg = 12 }) {
  const ra = rAt || ((yy) => rCap + (y - yy));
  for (let k = 0; k < n; k++) {
    const phi = (2 * Math.PI * k) / n, yt = y - petalL * 0.85, rb = rCap + 0.1, rt = ra(yt) + 0.1, L = Math.hypot(rt - rb, y - yt), tilt = Math.atan2(rt - rb, y - yt), w = ((2 * Math.PI * rb) / n) * 1.25;
    const g = extXY([[-w / 2, 0], [w / 2, 0], [w * 0.5, -L * 0.45], [0, -L], [-w * 0.5, -L * 0.45]], [], Math.max(0.03, 0.04 * L));
    g.rotateX(-tilt); g.rotateY(phi); g.translate(x + Math.sin(phi) * rb, y, z + Math.cos(phi) * rb); acc.add(keyPetal, g);
  }
  const ch = Math.max(0.15, rCap * 0.42);
  acc.add(keyPetal, lathe2([[0.001, -0.05], [rCap * 1.08, -0.05], [rCap * 1.02, ch * 0.3], [rCap * 0.62, ch * 0.75], [rCap * 0.32, ch], [0.001, ch]], seg >= 12 ? 16 : 8, 0, x, y, z));
  y += ch - 0.08 * fin;
  const f = fin, yb = y + 0.08 * f;
  acc.add(keyFin, lathe2([[0.001, 0], [0.09 * f, 0], [0.1 * f, 0.04 * f], [0.05 * f, 0.07 * f], [0.11 * f, 0.15 * f], [0.05 * f, 0.23 * f], [0.04 * f, 0.26 * f], [0.085 * f, 0.33 * f], [0.04 * f, 0.4 * f], [0.03 * f, 0.43 * f], [0.065 * f, 0.5 * f], [0.07 * f, 0.56 * f], [0.025 * f, 0.62 * f], [0.02 * f, 0.7 * f], [0.045 * f, 0.74 * f], [0.012 * f, 0.8 * f], [0.001, 0.82 * f]], seg, 0, x, yb, z));
  if (crescent) {
    const rc = 0.09 * f, pts = [];
    for (let i = 0; i <= 12; i++) { const t = ((190 + (160 * i) / 12) * Math.PI) / 180; pts.push([Math.cos(t) * rc, Math.sin(t) * rc]); }
    for (let i = 0; i <= 12; i++) { const t = ((350 - (160 * i) / 12) * Math.PI) / 180; pts.push([Math.cos(t) * rc * 0.78, Math.sin(t) * rc * 0.78 + rc * 0.32]); }
    const g = extXY(pts, [], 0.012 * f + 0.02); g.translate(x, yb + 0.86 * f, z + 0.006 * f); acc.add(keyFin, g);
  }
  return yb + 0.96 * f;
}

// ---------------------------------------------------------------- CHHATRI (bát giác 8 trụ — §D.8)
/**
 * chhatri tại (x, y, z): a = apothem mép chhajja; trụ ở vòng ap ≈ 0,72a; ph = cao trụ thông thủy; dome { R, H }; base (cao bệ)
 * keys: { body, dome, shade, gold, frame, panel }  · trả cao đỉnh
 */
export function chhatri(acc, { x = 0, y = 0, z = 0, a, ph, dome, base = 0, keys, n = 8, finial = 1 }) {
  const ap = a * 0.74, colD = Math.max(0.16, a * 0.13), K = keys, lod = a < 1.5 ? 0 : a < 3.2 ? 1 : 2;
  if (base > 0) { acc.add(K.body, oct([[0.001, 0], [ap + colD * 0.9, 0], [ap + colD * 0.9, base * 0.85], [ap + colD * 1.1, base], [0.001, base]], x, y, z)); }
  const y0 = y + base, R = ap / Math.cos(Math.PI / 8);
  const vs = ngon(8, ap, x, z);
  for (const [vx, vz] of vs) { shahCol(acc, K.body, vx, y0, vz, ph, colD, lod === 2 ? 2 : 0); if (lod === 2) { const dx = vx - x, dz = vz - z, L = Math.hypot(dx, dz); shahCol(acc, K.body, vx - (dx / L) * colD * 0.75, y0, vz - (dz / L) * colD * 0.75, ph, colD * 0.55, 0); } }
  // vòm nhiều múi giữa các trụ (tấm spandrel) + dầm
  const beamH = Math.max(0.25, a * 0.09), yb = y0 + ph;
  for (let i = 0; i < 8; i++) {
    const p = vs[i], q = vs[(i + 1) % 8], mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2, L = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = (mx - x), nz = (mz - z);
    const F = Face.at(acc, mx, 0, mz, nx, nz), w = L - colD, rise = Math.min(w * 0.42, ph * 0.3), hs = ph - rise - 0.04;
    const c = archCurve(0, y0 + hs, w / 2, rise, lod ? 5 : 0).filter((_, i, A) => lod || i % 3 === 0 || i === A.length - 1);
    const g = extXY([[w / 2 + colD * 0.3, y0 + hs], [w / 2 + colD * 0.3, yb], [-w / 2 - colD * 0.3, yb], [-w / 2 - colD * 0.3, y0 + hs], ...[...c].reverse().slice(1)], [], colD * 0.6); g.translate(0, 0, colD * 0.3); F.add(K.body, g);
    F.add(K.frame || K.body, box(L + colD * 0.3, beamH, colD * 1.1, 0, yb + beamH / 2, 0));
  }
  // chhajja + consol, diềm lan can thấp, trống nhỏ, vòm bầu, sen, finial
  const yc = yb + beamH;
  chhajja(acc, K.body, ngon(8, ap + colD * 0.5, x, z), yc + 0.05, a - ap - colD * 0.5, { drop: (a - ap) * 0.42, th: Math.max(0.1, a * 0.035), step: Math.max(0.6, a * 0.28), consoles: lod > 0 });
  const dr = dome.R, dh = Math.max(0.3, dome.H * 0.14);
  acc.add(K.body, oct([[0.001, 0], [Math.min(ap + colD * 0.4, dr * 1.02), 0], [Math.min(ap + colD * 0.4, dr * 1.02), dh * 0.7], [dr * 0.96, dh], [0.001, dh]], x, yc + 0.05, z));
  if (K.panel) acc.add(K.panel, oct([[0.001, 0], [Math.min(ap + colD * 0.4, dr * 1.02) + 0.02, 0], [Math.min(ap + colD * 0.4, dr * 1.02) + 0.02, dh * 0.3], [0.001, dh * 0.3]], x, yc + 0.05 + dh * 0.2, z));
  const yd = yc + 0.05 + dh;
  const bp = bulbProf(dr * 0.88, dr, dome.H, { mx: 0.32, rTop: dr * 0.12 });
  acc.add(K.dome, lathe2(lod ? bp : bp.filter((_, i) => i % 2 === 0 || i === bp.length - 1), lod ? 20 : 10, 0, x, yd, z));
  const yl = dome.H * 0.97;
  return lotusFinial(acc, { x, y: yd + yl, z, rCap: profR(bp, yl), rAt: (yy) => profR(bp, yy - yd), petalL: dr * 0.4, n: lod ? 12 : 0, fin: Math.max(0.8, dome.H * 0.55) * finial, keyPetal: K.dome, crescent: dome.H > 2.5, seg: lod === 2 ? 12 : lod ? 8 : 6 });
}

// ---------------------------------------------------------------- MINARET (Taj: 43,02 × 5,65 m — Koch; ban công 0,26 / 0,51 / 0,81 H)
export function minaret(acc, { x, y, z, H, D, keys }) {
  const r = D / 2, K = keys, hb = H * 0.05;
  // chân bát giác thấp có hốc
  acc.add(K.base, oct([[0.001, 0], [r * 1.25, 0], [r * 1.25, hb], [r * 1.12, hb * 1.15], [0.001, hb * 1.15]], x, y, z));
  const yS = y + hb * 1.15, Hs = H * 0.81 - hb * 1.15 + H * 0.01;
  acc.add(K.shaft, lathe2([[0.001, 0], [r * 1.02, 0], [r * 0.88, Hs], [0.001, Hs]], 28, 0, x, yS, z));
  for (const f of [0.26, 0.51, 0.81]) {
    const yb = y + H * f, rr = r * (1.02 - 0.14 * ((H * f - hb) / Hs)), ro = rr + D * 0.24;
    acc.add(K.trim, lathe2([[rr, -D * 0.34], [rr + 0.06, -D * 0.34], [ro, -0.12], [ro, 0.12], [rr, 0.12], [rr, -D * 0.34]], 28, 0, x, yb, z));  // sàn ban công trên consol liền
    for (let k = 0; k < 16; k++) { const t = (2 * Math.PI * k) / 16, g = box(0.18, D * 0.3, ro - rr, x + Math.sin(t) * (rr + (ro - rr) / 2), yb - D * 0.3, z + Math.cos(t) * (rr + (ro - rr) / 2), t); acc.add(K.trim, g); }
    acc.add(K.rail, lathe2([[ro - 0.12, 0], [ro, 0], [ro, 1.0], [ro - 0.12, 1.0], [ro - 0.12, 0]], 28, 0, x, yb + 0.12, z));
    acc.add(K.trim, lathe2([[ro - 0.16, 0], [ro + 0.04, 0], [ro + 0.04, 0.1], [ro - 0.16, 0.1], [ro - 0.16, 0]], 28, 0, x, yb + 1.12, z));
  }
  // đỉnh: chhatri bát giác 8 trụ (≈ 0,19 H)
  const yt = y + H * 0.81 + 1.2;
  return chhatri(acc, { x, y: yt, z, a: r * 1.1, ph: H * 0.065, dome: { R: r * 0.72, H: H * 0.07 }, keys: K.chhatri });
}

/** vòm bán (nửa đa giác) phủ hốc iwan: các hàng tiết diện theo đường vòm mặt trước — mặt hở, khoá 'tile…' */
export function iwanVault(F, key, facetPts, ys, s, rise) {
  const rows = UNIT.map(([u, v]) => facetPts.map(([x, z]) => V(x * u, ys + v * rise, z * u)));
  F.add(key, gridSurface(rows));
}
