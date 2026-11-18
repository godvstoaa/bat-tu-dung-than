// ============================================================================
//  BỘ CẤU KIỆN KIẾN TRÚC THÁI RATTANAKOSIN (Đại Hoàng Cung Bangkok · Wat Phra Kaew) — theo docs/tienphu-nghiencuu/08-thai.md
//  Phần chung A1–A7: mái hồi nhiều lớp (son = tầng chồng theo chiều cao, lot = lớp lùi theo chiều dài, hạ dần ra đầu hồi),
//  bộ lamyong (chofa · bai raka · hang hong) trên MỌI hồi, trán hồi (na ban) thếp vàng, cột vuông góc lõm 12 góc đầu sen,
//  bệ chân sư tử / gờ bát, chóp prasat 5 / 7 tầng (12 góc lõm, hồi nhỏ 4 mặt → chuông ép 4 mặt → búp sen → mũi kim).
//  Khung cục bộ: gốc = tâm mặt bằng trên đất, +z = mặt tiền. Mặt ngói hở dùng khoá 'tile…'; mọi khối khác kín.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, beam, slabXY, lathe, V } from './kit.js';

/** màu — 08 › A6 (hex ước từ ảnh Commons) */
export const TH_COL = {
  wall: '#f2efe8', wallShade: '#e2ddd2', plinth: '#edeae3', plinthShade: '#c9c4b8', marble: '#e8e6e0', floor: '#8f8a82',
  gold: '#c9a23c', goldLt: '#e9c766', glassG: '#2f7d5b', glassB: '#2d5da1', glassR: '#a3242b', silver: '#cfcfd2',
  shutter: '#5a2a22', shutterG: '#3c5a55', shutterB: '#2b3f5e', redDoor: '#9e2a22', ceilRed: '#8e2420',
  tGreen: '#3f6a3b', tOrange: '#c8502e', tBlue: '#2e4d8c', tGray: '#6e6258', tLight: '#a8a59c', tUnglazed: '#7e766c', tYellow: '#d9a62c',
  bOrange: '#d9682b', bGreen: '#2f7a45', bYellow: '#d9a62c',
  stoneGray: '#8c8a85', libGreen: '#2f6e4e', lacquer: '#1c1a17', euCream: '#efe9dc', euBase: '#8a5a40', euTrim: '#d8d3c8', wood: '#6b3a22', naga: '#b8902e',
};

// ---------------------------------------------------------------- vật liệu (canvas thủ tục — chỉ trong trình duyệt)
function canvasTex(w, h, draw, rep = true) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const shade = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };
/** ngói men Thái: ngói dẹt đầu nhọn (krabueang) xếp so le — 1 đơn vị UV = 1 m (3 hàng × 3 viên) */
function tileTex(col) {
  return canvasTex(192, 192, (g, w, h) => {
    g.fillStyle = shade(col, 0.72); g.fillRect(0, 0, w, h);
    const cw = w / 3, rh = h / 3;
    for (let r = -1; r < 4; r++) for (let c = -1; c < 4; c++) {
      const x = c * cw + (r % 2 ? cw / 2 : 0), y = r * rh;
      g.beginPath(); g.moveTo(x + 3, y); g.lineTo(x + cw - 3, y); g.lineTo(x + cw - 3, y + rh * 0.78); g.lineTo(x + cw / 2, y + rh + 6); g.lineTo(x + 3, y + rh * 0.78); g.closePath();
      g.fillStyle = col; g.fill(); g.strokeStyle = shade(col, 0.55); g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.16)'; g.fillRect(x + 6, y + 3, 5, rh * 0.6);
    }
  });
}
/** trán hồi (na ban): nền kính lam, dây kanok vàng cuộn lửa, giữa là hình thần cưỡi Garuda (08 › A2, ubosot §7) */
function nabanTex() {
  return canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#1f3f7a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { g.fillStyle = ['#2d5da1', '#24508f', '#3a6db0', '#1a3768'][i % 4]; g.fillRect(Math.random() * w, Math.random() * h, 4, 4); }
    g.strokeStyle = TH_COL.goldLt; g.fillStyle = TH_COL.gold; g.lineWidth = 3;
    const flame = (x, y, s, dir) => { g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + dir * s * 0.5, y - s * 0.2, x + dir * s * 0.7, y - s * 0.9, x + dir * s * 0.2, y - s * 1.2); g.bezierCurveTo(x + dir * s * 0.45, y - s * 0.7, x + dir * s * 0.2, y - s * 0.35, x, y); g.fill(); g.stroke(); };
    for (let row = 0; row < 4; row++) for (let i = 0; i < 14; i++) { const x = 20 + i * 36 + (row % 2) * 18, y = 60 + row * 58; flame(x, y, 26, i % 2 ? 1 : -1); g.beginPath(); g.arc(x, y + 6, 6, 0, Math.PI * 2); g.stroke(); }
    // hình chính giữa: Narayana (Vishnu 4 tay, mũ chada nhọn) cưỡi Garuda dang cánh (ubosot §7, tower §3.6)
    const cx = w / 2, cy = h * 0.7, G = TH_COL.goldLt;
    g.fillStyle = G; g.strokeStyle = '#7a5a14'; g.lineWidth = 2;
    const P = (pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts.slice(1)) g.lineTo(x, y); g.closePath(); g.fill(); g.stroke(); };
    for (const s of [-1, 1]) { // cánh Garuda: 4 lớp lông vũ nhọn
      for (let k = 0; k < 4; k++) P([[cx + s * 20, cy - 10 + k * 10], [cx + s * (70 + k * 22), cy - 70 + k * 18], [cx + s * (110 + k * 14), cy - 52 + k * 22], [cx + s * (92 + k * 10), cy - 34 + k * 20], [cx + s * 26, cy + 6 + k * 8]]);
      P([[cx + s * 16, cy + 20], [cx + s * 30, cy + 44], [cx + s * 22, cy + 62], [cx + s * 8, cy + 46]]);                 // chân quặp
    }
    P([[cx - 22, cy - 26], [cx + 22, cy - 26], [cx + 18, cy + 30], [cx - 18, cy + 30]]);                                  // thân Garuda
    P([[cx - 12, cy - 26], [cx, cy - 46], [cx + 12, cy - 26]]);                                                         // mỏ
    P([[cx - 14, cy - 50], [cx + 14, cy - 50], [cx + 12, cy - 92], [cx - 12, cy - 92]]);                               // thân Narayana
    for (const s of [-1, 1]) { P([[cx + s * 12, cy - 86], [cx + s * 40, cy - 112], [cx + s * 46, cy - 106], [cx + s * 16, cy - 76]]); P([[cx + s * 12, cy - 70], [cx + s * 44, cy - 74], [cx + s * 44, cy - 66], [cx + s * 12, cy - 62]]); }
    g.beginPath(); g.arc(cx, cy - 100, 10, 0, Math.PI * 2); g.fill(); g.stroke();
    P([[cx - 9, cy - 108], [cx + 9, cy - 108], [cx + 3, cy - 128], [cx, cy - 148], [cx - 3, cy - 128]]);                 // mũ chada
    g.strokeStyle = TH_COL.goldLt; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
  }, false);
}
/** cột kính khảm: mép thếp vàng, lòng kính lục hoa thoi đỏ / lam (08 › A4) */
function colTex(field = TH_COL.glassG) {
  return canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = TH_COL.gold; g.fillRect(0, 0, w, h);
    g.fillStyle = field; g.fillRect(10, 0, w - 20, h);
    for (let y = 8; y < h; y += 24) { g.fillStyle = TH_COL.glassR; g.beginPath(); g.moveTo(w / 2, y); g.lineTo(w / 2 + 9, y + 10); g.lineTo(w / 2, y + 20); g.lineTo(w / 2 - 9, y + 10); g.fill(); g.fillStyle = TH_COL.goldLt; g.fillRect(w / 2 - 2, y + 8, 4, 4); }
    g.fillStyle = TH_COL.goldLt; g.fillRect(8, 0, 3, h); g.fillRect(w - 11, 0, 3, h);
  });
}
/** cánh cửa: sơn mài đen vẽ vàng (lai rot nam) với ô thoi và viền */
function doorTex(bg = '#1c1712') {
  return canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = TH_COL.gold; g.lineWidth = 5; g.strokeRect(8, 8, w - 16, h - 16); g.strokeRect(w / 2 - 1, 8, 2, h - 16);
    g.fillStyle = TH_COL.gold; for (let y = 30; y < h - 20; y += 34) for (const x of [w / 4, (3 * w) / 4]) { g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + 10, y); g.lineTo(x, y + 12); g.lineTo(x - 10, y); g.fill(); }
  }, false);
}
/** cửa chớp gỗ hai cánh có ô panô */
function shutterTex(col) {
  return canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h); g.strokeStyle = shade(col, 0.6); g.lineWidth = 3;
    for (const x of [4, w / 2 + 2]) for (let y = 6; y < h - 10; y += (h - 12) / 3) g.strokeRect(x, y, w / 2 - 6, (h - 12) / 3 - 6);
    g.fillStyle = shade(col, 0.5); g.fillRect(w / 2 - 1, 0, 2, h);
  }, false);
}
/** tường kính lục có thiên thần chắp tay (thepphanom) thếp vàng — Phra Mondop (library §3) */
function libTex() {
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = TH_COL.libGreen; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) { g.fillStyle = i % 2 ? '#357a57' : '#285f43'; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
    g.fillStyle = TH_COL.gold;
    for (const [x, y] of [[32, 40], [96, 104]]) { g.beginPath(); g.moveTo(x, y - 26); g.lineTo(x + 8, y - 6); g.lineTo(x + 16, y + 20); g.lineTo(x - 16, y + 20); g.lineTo(x - 8, y - 6); g.closePath(); g.fill(); g.beginPath(); g.arc(x, y - 12, 6, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = TH_COL.goldLt; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
  });
}
/** sơn mài đen vẽ hoa văn lửa vàng (lai kranok) — cột gỗ Sitalaphirom (sala1 §3) */
function lacquerTex() {
  return canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = TH_COL.lacquer; g.fillRect(0, 0, w, h); g.fillStyle = TH_COL.gold;
    for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(w / 2, y + 30); g.bezierCurveTo(w / 2 + 18, y + 20, w / 2 + 10, y + 8, w / 2, y); g.bezierCurveTo(w / 2 - 10, y + 8, w / 2 - 18, y + 20, w / 2, y + 30); g.fill(); }
    g.fillRect(2, 0, 3, h); g.fillRect(w - 5, 0, 3, h);
  });
}
/** vữa giả đá có mạch ngang (tầng nền Chakri) */
function rustTex() {
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = TH_COL.euBase; g.fillRect(0, 0, w, h); g.fillStyle = shade(TH_COL.euBase, 0.7);
    for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4);
    for (let r = 0; r < 4; r++) g.fillRect((r % 2 ? 0 : w / 2), r * 32, 3, 32);
  });
}

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
const withRep = (t, x, y) => { if (t) t.repeat.set(x, y); return t; };
let MATS = null;
export function thMats() {
  if (MATS) return MATS;
  const tile = (c) => { const t = tileTex(c); return std(t ? { map: t, roughness: 0.62, metalness: 0.0, side: THREE.DoubleSide } : { color: c, side: THREE.DoubleSide, roughness: 0.62 }); };
  const tex = (t, c, o = {}) => std(t ? { map: t, ...o } : { color: c, ...o });
  MATS = {
    wall: std({ color: TH_COL.wall, roughness: 0.92 }), wallShade: std({ color: TH_COL.wallShade, roughness: 0.92 }),
    plinth: std({ color: TH_COL.plinth, roughness: 0.9 }), plinthShade: std({ color: TH_COL.plinthShade, roughness: 0.9 }), marble: std({ color: TH_COL.marble, roughness: 0.5 }),
    floor: std({ color: TH_COL.floor }), stoneGray: std({ color: TH_COL.stoneGray, roughness: 0.85 }),
    gold: std({ color: TH_COL.gold, roughness: 0.32, metalness: 0.65 }), goldLt: std({ color: TH_COL.goldLt, roughness: 0.3, metalness: 0.6 }),
    naga: std({ color: TH_COL.naga, roughness: 0.35, metalness: 0.5 }), glass: std({ color: TH_COL.silver, roughness: 0.15, metalness: 0.4 }),
    naban: tex(nabanTex(), TH_COL.glassB, { roughness: 0.4, metalness: 0.3 }),
    colG: tex(withRep(colTex(TH_COL.glassG), 1, 0.6), TH_COL.gold, { roughness: 0.35, metalness: 0.35 }),
    colB: tex(withRep(colTex(TH_COL.glassB), 1, 0.6), TH_COL.gold, { roughness: 0.35, metalness: 0.35 }),
    colS: tex(withRep(colTex('#9a9aa0'), 1, 0.6), TH_COL.gold, { roughness: 0.3, metalness: 0.45 }),
    colLac: tex(withRep(lacquerTex(), 1, 0.7), TH_COL.lacquer, { roughness: 0.4 }), lacquer: std({ color: TH_COL.lacquer, roughness: 0.4 }),
    door: tex(doorTex(), '#1c1712', { roughness: 0.35 }), doorRed: tex(doorTex('#7d221b'), TH_COL.redDoor, { roughness: 0.45 }),
    shutter: tex(shutterTex(TH_COL.shutter), TH_COL.shutter), shutterG: tex(shutterTex(TH_COL.shutterG), TH_COL.shutterG), shutterB: tex(shutterTex(TH_COL.shutterB), TH_COL.shutterB),
    dark: std({ color: '#2a2420', roughness: 0.9 }), ceil: std({ color: TH_COL.ceilRed }),
    libWall: tex(withRep(libTex(), 0.8, 0.8), TH_COL.libGreen, { roughness: 0.3, metalness: 0.2 }),
    euWall: std({ color: TH_COL.euCream, roughness: 0.9 }), euTrim: std({ color: TH_COL.euTrim, roughness: 0.85 }), euBase: tex(withRep(rustTex(), 0.5, 0.5), TH_COL.euBase),
    wood: std({ color: TH_COL.wood, roughness: 0.75 }), water: std({ color: '#3d6f7a', roughness: 0.15 }),
    tileGreen: tile(TH_COL.tGreen), tileOrange: tile(TH_COL.tOrange), tileBlue: tile(TH_COL.tBlue), tileGray: tile(TH_COL.tGray),
    tileLight: tile(TH_COL.tLight), tileUnglazed: tile(TH_COL.tUnglazed), tileYellow: tile(TH_COL.tYellow),
    tileBOrange: tile(TH_COL.bOrange), tileBGreen: tile(TH_COL.bGreen), tileBYellow: tile(TH_COL.bYellow), tileBGold: tile(TH_COL.gold),
    edgeOrange: std({ color: TH_COL.bOrange, roughness: 0.4 }), edgeGreen: std({ color: TH_COL.bGreen, roughness: 0.4 }), edgeYellow: std({ color: TH_COL.bYellow, roughness: 0.4 }),
    edgeGold: std({ color: TH_COL.gold, roughness: 0.32, metalness: 0.6 }),
  };
  return MATS;
}

// ---------------------------------------------------------------- tiện ích hình
/** dựng vào Acc tạm rồi biến đổi bằng ma trận (giữ cả mặt đi được) */
export function xf(acc, m, fn) {
  const a = new Acc(); fn(a);
  for (const [k, list] of a.parts) for (const g of list) acc.add(k, g.applyMatrix4(m));
  if (a.plats && acc.plat) { const e = m.elements, c = e[0], s = e[8], ry = Math.atan2(s, c); for (const q of a.plats) { const p = new THREE.Vector3(q.x, 0, q.z).applyMatrix4(m); acc.plat({ ...q, x: p.x, z: p.z, ry: (q.ry || 0) + ry }); } }
  return a;
}
export const mRY = (ry, x = 0, y = 0, z = 0) => new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
/** tứ giác phẳng (mặt hở) với UV theo mét: p0→p1 = u, p0→p3 = v */
export function quad(p0, p1, p2, p3) {
  const g = new THREE.BufferGeometry(), P = [p0, p1, p2, p0, p2, p3];
  const lu = p0.distanceTo(p1), lv = p0.distanceTo(p3), lu2 = p3.distanceTo(p2);
  const uv = [[0, 0], [lu, 0], [lu2, lv], [0, 0], [lu2, lv], [0, lv]];
  g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap((p) => [p.x, p.y, p.z]), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv.flat(), 2)); g.computeVertexNormals(); return g;
}
/** UV phẳng chuẩn hoá theo hộp bao (mặt XY) — dùng cho trán hồi có hình giữa */
function planarUV(g) {
  g.computeBoundingBox(); const b = g.boundingBox, p = g.attributes.position, uv = [];
  for (let i = 0; i < p.count; i++) uv.push((p.getX(i) - b.min.x) / Math.max(1e-6, b.max.x - b.min.x), (p.getY(i) - b.min.y) / Math.max(1e-6, b.max.y - b.min.y));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return g;
}
/** UV quanh trục đứng (thân cột / thân chóp) */
function wrapUV(g, cx, cz, vScale = 1) {
  const p = g.attributes.position, uv = [];
  for (let i = 0; i < p.count; i++) uv.push((Math.atan2(p.getZ(i) - cz, p.getX(i) - cx) / (2 * Math.PI) + 0.5) * 4, p.getY(i) / vScale);
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return g;
}
/** đa giác vuông góc lõm 12 góc (ย่อมุมไม้สิบสอง): nửa cạnh s, mỗi bậc lõm k·s */
export function redentPts(s, k = 0.16) {
  const n = s * k, q = [[s, -(s - 2 * n)], [s, s - 2 * n], [s - n, s - 2 * n], [s - n, s - n], [s - 2 * n, s - n], [s - 2 * n, s]];
  const out = []; for (let r = 0; r < 4; r++) { const a = (r * Math.PI) / 2, c = Math.cos(a), sn = Math.sin(a); for (let i = r ? 0 : 0; i < q.length; i++) { if (i === 0) continue; const [x, y] = q[i]; out.push([x * c - y * sn, x * sn + y * c]); } }
  return out;
}
/** khối lăng trụ đứng từ đa giác XZ (pts [[x,z]]), đáy y0, cao h */
export function prism(pts, h, x = 0, y0 = 0, z = 0) {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([a, b]) => new THREE.Vector2(a, -b))), { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); g.translate(x, y0, z); return g;
}
/** khối 12 góc lõm */
export const redent = (s, h, x, y0, z, k = 0.16) => prism(redentPts(s, k), h, x, y0, z);
/** khối chóp cụt vuông (lathe 4 cạnh xoay 45° → mặt song song trục): prof [[nửa cạnh, y]] */
/** khối tròn xoay KÍN hai đầu (mặt cắt bản vẽ tô đen đúng chẵn lẻ) */
export function clathe(prof, x, y, z, seg = 16) { const p = [...prof]; if (p[0][0] > 0.002) p.unshift([0.001, p[0][1]]); if (p[p.length - 1][0] > 0.002) p.push([0.001, p[p.length - 1][1]]); return lathe(p, x, y, z, seg); }
export function sqLathe(prof, x, y, z) { const g = clathe(prof.map(([s, h]) => [s * Math.SQRT2, h]), 0, 0, 0, 4); g.rotateY(Math.PI / 4); g.translate(x, y, z); return g; }

// ---------------------------------------------------------------- hình bóng trang trí (đùn mỏng)
const mirror = (half) => [...half, ...[...half].reverse().map(([a, b]) => [-a, b])];
/** Garuda dang tay đỡ (chân đứng, hai tay giơ, cánh xoè) — cao 1 */
export const GARUDA = mirror([[0.0, 0], [0.12, 0], [0.16, 0.22], [0.1, 0.36], [0.2, 0.42], [0.42, 0.38], [0.55, 0.56], [0.36, 0.52], [0.2, 0.6], [0.3, 0.82], [0.24, 0.96], [0.16, 0.8], [0.1, 0.78], [0.08, 0.9], [0.0, 1.0]]);
/** hamsa (thiên nga) — đỡ chóp Aphorn Phimok */
export const HAMSA = [[-0.4, 0], [0.35, 0], [0.45, 0.18], [0.3, 0.34], [0.12, 0.38], [0.18, 0.62], [0.32, 0.86], [0.24, 1.0], [0.08, 0.86], [0.02, 0.62], [-0.12, 0.42], [-0.38, 0.36], [-0.52, 0.5], [-0.5, 0.2]];
/** dạ xoa / khỉ / thiên thần đỡ (người đứng giơ hai tay) — cao 1 */
export const ATLAS = mirror([[0, 0], [0.16, 0], [0.18, 0.4], [0.24, 0.62], [0.36, 0.7], [0.34, 1.0], [0.24, 1.0], [0.22, 0.8], [0.12, 0.74], [0.11, 0.86], [0.0, 0.96]]);
/** đầu Naga 5 đầu (hood) ở chân lan can bậc */
export const NAGA5 = (() => { const p = [[0.18, 0], [0.2, 0.3], [0.34, 0.42]]; const heads = [[0.62, 0.62], [0.44, 0.9], [0.0, 1.12]]; for (const [hx, hy] of heads) { p.push([hx + 0.1, hy - 0.12], [hx + 0.08, hy + 0.04], [hx - 0.02, hy + 0.12], [hx - 0.1, hy + 0.04]); } p.splice(p.length - 2); const half = p.filter(([x]) => x > 0.001); return [...half, [0, 1.24], ...[...half].reverse().map(([a, b]) => [-a, b])]; })();
/** dựng hình bóng (pts cao 1) đứng trong mặt phẳng vuông góc pháp tuyến (nx, nz), chân tại (x, y, z) */
export function figure(acc, key, pts, x, y, z, h, nx = 0, nz = 1, t = 0.12) {
  acc.add(key, slabXY(pts.map(([a, b]) => [a * h, b * h]), t, x, y, z, Math.atan2(nx, nz)));
}

// ---------------------------------------------------------------- cột vuông góc lõm 12 góc, đầu sen (08 › A4)
/** cột Thái: chân tảng sen, thân 12 góc lõm kính khảm, đầu cột tràng cánh sen thon dài; d = cạnh thân */
export function thColumn(acc, x, z, y0, h, d = 0.6, key = 'colG') {
  const s = d / 2, hb = Math.min(0.45, h * 0.08), hc = Math.min(1.1, h * 0.17);
  acc.add('gold', sqLathe([[s * 1.28, 0], [s * 1.28, hb * 0.3], [s * 1.08, hb * 0.55], [s * 1.18, hb * 0.75], [s * 1.02, hb], [0.001, hb]], x, y0, z));   // chân bua khwam
  acc.add(key, wrapUV(redent(s, h - hb - hc, x, y0 + hb, z), x, z, 1.4));
  // đầu sen (bua hua sao): vòng cổ + 2 tầng cánh sen loe ra + bàn đỡ
  acc.add('gold', sqLathe([[s * 1.02, 0], [s * 1.08, hc * 0.12], [s * 0.98, hc * 0.2], [s * 1.18, hc * 0.5], [s * 1.38, hc * 0.72], [s * 1.2, hc * 0.78], [s * 1.5, hc * 0.95], [s * 1.5, hc], [0.001, hc]], x, y0 + h - hc, z));
  for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2, nx = Math.sin(a), nz = Math.cos(a); acc.add('goldLt', slabXY([[-s * 0.55, 0], [s * 0.55, 0], [0, hc * 0.55]], 0.05, x + nx * s * 1.12, y0 + h - hc * 0.62, z + nz * s * 1.12, a)); }
  return { top: y0 + h };
}

// ---------------------------------------------------------------- bệ (ฐาน): chân → gờ sư tử → gờ bát (08 › A4)
const PLINTH_PROF = [[0, 0.12, 0], [0.12, 0.06, 0.09], [0.18, 0.1, -0.04], [0.28, 0.2, 0.16], [0.48, 0.08, 0.02], [0.56, 0.1, -0.06], [0.66, 0.22, 0.07], [0.88, 0.12, -0.08]];
/**
 * bệ chữ nhật nhiều gờ (tâm x, z; W × D; cao h) — có băng Garuda (garuda: bước m) và bậc (stairs: [{ side: 1|-1 (±z) | 'x+'|'x-', c, w, naga }])
 * Khai mặt đi được (acc.plat) cho mặt bệ và từng bậc.
 */
export function thPlinth(acc, { W, D, h, x = 0, z = 0, y0 = 0, key = 'plinth', shadeKey = 'plinthShade', garuda = 0, stairs = [], plat = true }) {
  const k = Math.min(1, h / 1.6);
  for (const [f, fh, ins] of PLINTH_PROF) {
    const i = ins * k * (h > 0.8 ? 1.4 : 1), hh = fh * h;
    acc.add(ins > 0.05 ? shadeKey : key, boxB(W - 2 * i, hh, D - 2 * i, x, y0 + f * h, z));
  }
  if (plat) acc.plat({ x, z, w: W, d: D, top: y0 + h });
  if (garuda) { // băng Garuda thếp vàng quặp Naga trên dải lõm (ubosot §3)
    const yb = y0 + 0.29 * h, gh = 0.18 * h, ins = 0.16 * k * 1.4 - 0.02;
    for (const [ax, az, bx, bz, nx, nz] of [[-W / 2, D / 2, W / 2, D / 2, 0, 1], [W / 2, -D / 2, -W / 2, -D / 2, 0, -1], [W / 2, D / 2, W / 2, -D / 2, 1, 0], [-W / 2, -D / 2, -W / 2, D / 2, -1, 0]]) {
      const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.floor(L / garuda));
      const sid = nz > 0 ? 1 : nz < 0 ? -1 : nx > 0 ? 'x+' : 'x-';
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, px = x + ax + (bx - ax) * t - nx * ins, pz = z + az + (bz - az) * t - nz * ins, along = nz ? px - x : pz - z; if (stairs.some((s) => s.side === sid && Math.abs(along - (s.c || 0)) < s.w / 2 + 0.8)) continue; figure(acc, 'gold', GARUDA, px, yb, pz, gh, nx, nz, 0.08); }
    }
  }
  for (const s of stairs) thStair(acc, { ...s, W, D, h, x, z, y0, key });
}
/** bậc lên bệ có lan can Naga 5 đầu (08 › A4): side ±1 theo z hoặc 'x+'/'x-'; c = tâm theo cạnh; w = rộng */
export function thStair(acc, { side, c = 0, w, W, D, h, x = 0, z = 0, y0 = 0, key = 'plinth', naga = true, tread = 0.32 }) {
  const n = Math.max(2, Math.round(h / 0.16)), rise = h / n, ax = side === 'x+' ? 1 : side === 'x-' ? -1 : 0, az = ax ? 0 : side;
  const ry = Math.atan2(ax, az), m = mRY(ry, x, 0, z), edge = ax ? W / 2 : D / 2, cl = side === 1 || side === 'x-' ? c : -c, run = n * tread;
  xf(acc, m, (a) => {
    for (let i = 0; i < n; i++) { const zz = edge + tread * (n - i - 0.5); a.add(i % 2 ? key : 'marble', boxB(w, y0 + rise * (i + 1), tread, cl, 0, zz)); a.plat({ x: cl, z: zz, w, d: tread + 0.02, top: y0 + rise * (i + 1) }); }
    for (const sx of [-1, 1]) {
      const xx = cl + sx * (w / 2 + 0.22);
      a.add(key, boxB(0.44, y0 + h * 0.25, run, xx, 0, edge + run / 2));                                                 // má bậc
      if (naga) {
        const top = V(xx, y0 + h + 0.55, edge - 0.3), bot = V(xx, y0 + 0.75, edge + run - 0.2);
        a.add('naga', beam(top, bot, 0.3, 0.42));                                                                    // thân Naga
        a.add(key, boxB(0.7, y0 + 0.45, 0.8, xx, 0, edge + run + 0.1));                                              // đế đầu Naga
        figure(a, 'naga', NAGA5, xx, y0 + 0.45, edge + run + 0.25, Math.max(1.1, Math.min(1.9, h * 0.75)), 0, 1, 0.16);  // đầu Naga 5 đầu ngẩng
      } else a.add(key, beam(V(xx, y0 + h + 0.5, edge - 0.2), V(xx, y0 + 0.6, edge + run), 0.3, 0.4));
    }
  });
  return n * tread;
}
/** lan can trắng Thái: trụ đầu búp sen (bua tum) mỗi ~2 m, tay vịn, song tiện; pts [[x,z]…] trên cao y */
export function thBalustrade(acc, pts, y, { h = 0.95, step = 2.0, key = 'plinth', gap = null, baluster = 0.32 } = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az); if (L < 0.2) continue;
    const n = Math.max(1, Math.round(L / step)), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2;
    for (let j = 0; j <= n; j++) { if (i > 0 && j === 0) continue; const t = j / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t; acc.add(key, boxB(0.26, h, 0.26, x, y, z)); acc.add('gold', clathe([[0.001, 0], [0.12, 0.02], [0.15, 0.12], [0.08, 0.3], [0.001, 0.42]], x, y + h, z, 6)); }
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    acc.add(key, box(L, 0.12, 0.2, mx, y + h - 0.06, mz, ry)); acc.add(key, box(L, 0.12, 0.24, mx, y + 0.06, mz, ry));
    const m = Math.max(1, Math.floor(L / baluster)); for (let j = 1; j < m; j++) { const t = j / m; acc.add(key, sqLathe([[0.05, 0], [0.08, 0.15], [0.05, 0.4], [0.07, 0.6], [0.04, h - 0.24], [0.001, h - 0.24]], ax + (bx - ax) * t, y + 0.12, az + (bz - az) * t)); }
  }
}

// ---------------------------------------------------------------- bộ lamyong trên một hồi (08 › A2)
/** chofa: sừng mỏ chim cong vút ở đỉnh hồi, nằm trong mặt phẳng dọc nóc (yz), cong ra ngoài theo dir (±1 theo z cục bộ) */
export function chofa(acc, x, y, z, h, dir = 1, ry = 0, key = 'gold') {
  const pts = [[-0.14, 0], [0.16, 0], [0.12, 0.3], [0.17, 0.52], [0.3, 0.74], [0.5, 0.94], [0.66, 1.02], [0.52, 1.03], [0.32, 0.9], [0.12, 0.72], [-0.02, 0.5], [-0.08, 0.26]];
  const g = slabXY(pts.map(([u, v]) => [dir * u * h, v * h]), Math.max(0.1, 0.11 * h), 0, 0, 0, -Math.PI / 2); g.rotateY(ry); g.translate(x, y, z); acc.add(key, g);
}
/** hang hong: đầu Naga ngẩng cong ra ngoài ở chân diềm hồi (mặt phẳng xy), sx = hướng ra ngoài */
export function hangHong(acc, x, y, z, s, sx, ry = 0, key = 'gold') {
  const pts = [[-0.1, -0.1], [0.45, -0.05], [0.72, 0.12], [0.86, 0.42], [0.78, 0.72], [0.62, 0.8], [0.66, 0.6], [0.6, 0.38], [0.42, 0.22], [0.15, 0.2], [-0.1, 0.25]];
  const g = slabXY(pts.map(([a, b]) => [sx * a * s, b * s]), 0.16, 0, 0, 0, 0); g.rotateY(ry); g.translate(x, y, z); acc.add(key, g);
}
/** một cạnh diềm hồi: ván lamyong vàng a→b (a cao) + hàng răng bai raka trên lưng; mặt phẳng z = z0 (hướng dz) */
export function lamyongEdge(acc, a, b, z0, { board = 0.42, raka = true, key = 'gold', tooth = 0.42 } = {}) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; let nx = -uy, ny = ux; if (ny < 0) { nx = -nx; ny = -ny; }
  const off = board * 0.5 + 0.06;
  acc.add(key, beam(V(a[0] + nx * off, a[1] + ny * off, z0), V(b[0] + nx * off, b[1] + ny * off, z0), 0.2, board));
  if (!raka) return;
  const n = Math.max(1, Math.floor(L / tooth)), base = off + board * 0.5, th = Math.min(0.42, board * 0.9), pts = [];
  for (let i = 0; i <= n; i++) { const t = (i * L) / n; pts.push([a[0] + ux * t + nx * base, a[1] + uy * t + ny * base]); if (i < n) { const tt = t + (L / n) * 0.3; pts.push([a[0] + ux * tt + nx * (base + th), a[1] + uy * tt + ny * (base + th)]); } }
  pts.push([b[0] + nx * (base - 0.08), b[1] + ny * (base - 0.08)], [a[0] + nx * (base - 0.08), a[1] + ny * (base - 0.08)]);
  acc.add(key, slabXY(pts, 0.07, 0, 0, z0));
}

// ---------------------------------------------------------------- MÁI HỒI THÁI (canonical: nóc chạy dọc z)
/**
 * Mặt cắt mái theo dải (son): bands từ nóc ra ngoài — mỗi dải { xs, xe, ys, ye, p } (|x|, cao tại xs / xe).
 * Dải chính chia đều [0, hw] nối bậc step (dải dưới luồn dưới dải trên ov), dải hiên (pikkanok) dốc pe từ hw ra hw + eave.
 */
export function thBands({ hw, p, son = 2, eave = 0, pe = null, step = 0.45, yBase, over = 0.55, ov = 0.4, nMain = null }) {
  nMain = nMain || Math.max(1, son - (eave > 0 ? 1 : 0)); const bands = [];
  const yR = yBase + p * hw + (nMain - 1) * step;
  let ye = yR;
  for (let k = 0; k < nMain; k++) {
    const xs = k ? (hw * k) / nMain - ov : 0, xe = (hw * (k + 1)) / nMain + (k === nMain - 1 && !(eave > 0) ? over : 0);
    const ys = k ? ye - step + p * ov : yR; ye = ys - p * (xe - xs); bands.push({ xs, xe, ys, ye, p, main: true });
  }
  if (eave > 0) { const q = pe ?? Math.min(0.72, p * 0.6), xs = hw - ov, ys = yBase - step + q * ov; bands.push({ xs, xe: hw + eave, ys, ye: ys - q * (hw + eave - xs), p: q, main: false }); }
  return { bands, yR, hw, yBase };
}
const bandAt = (B, d) => { let r = null; for (const b of B.bands) if (d >= b.xs - 1e-6 && d <= b.xe + 1e-6) r = b; return r; };
/** mặt dưới mái (để chân cột, đầu tường) tại khoảng cách d từ nóc */
export const bandY = (B, d) => { const b = bandAt(B, d); return b ? b.ys - b.p * (d - b.xs) : null; };

/**
 * một đoạn mái (lot) z ∈ [zA, zB], hạ dy; hồi lộ ở đầu front (zB) / back (zA).
 * Bl, Br: mặt cắt hai bên (−x, +x). Vẽ: mặt ngói + viền màu khác ở mép hiên & mép hồi, nóc, diềm, trán hồi, lamyong, chofa, hang hong.
 */
export function thRoofPiece(acc, { Bl, Br, zA, zB, dy = 0, front = false, back = false, tile = 'Green', border = 'Orange', eaveTile = null, eaveBorder = null, chofaH = 1.5, pedBot = null, pedFixed = false, edgeKey = null, scale = 1, truss = 0 }) {
  const ek = edgeKey || `edge${border}`;
  const sides = [[-1, Bl], [1, Br]];
  for (const [s, B] of sides) for (const b of B.bands) {
    const tk = `tile${b.main ? tile : eaveTile || tile}`, bk = `tileB${b.main ? border : eaveBorder || border}`;
    const P = (x, y, z) => V(s * x, y + dy, z);
    const y0 = b.ys, y1 = b.ye, bw = Math.min(0.55 * scale, (b.xe - b.xs) * 0.3), yb = y1 + b.p * bw, xb = b.xe - bw;
    // mặt ngói chính (chừa viền) — p0 ở mép trong
    const zi0 = zA + (back ? 0.5 * scale : 0), zi1 = zB - (front ? 0.5 * scale : 0);
    acc.add(tk, quad(P(b.xs, y0, zi0), P(b.xs, y0, zi1), P(xb, yb, zi1), P(xb, yb, zi0)));
    acc.add(bk, quad(P(xb, yb + 0.005, zA), P(xb, yb + 0.005, zB), P(b.xe, y1 + 0.005, zB), P(b.xe, y1 + 0.005, zA)));            // viền mép hiên
    if (front) acc.add(bk, quad(P(b.xs, y0, zi1), P(b.xs, y0, zB), P(xb, yb, zB), P(xb, yb, zi1)));
    if (back) acc.add(bk, quad(P(b.xs, y0, zA), P(b.xs, y0, zi0), P(xb, yb, zi0), P(xb, yb, zA)));
    acc.add('gold', beam(P(b.xe, y1 - 0.16, zA), P(b.xe, y1 - 0.16, zB), 0.12, 0.3));                                             // diềm mép hiên
    if (b.xs > 0.01) { // mặt đứng bậc giữa hai dải (kho song): dải trắng mỏng dưới mép dải trên
      acc.add('gold', beam(P(b.xs + 0.02, y0 + 0.02, zA), P(b.xs + 0.02, y0 + 0.02, zB), 0.06, 0.12));
    }
  }
  const yR = Math.max(Bl.yR, Br.yR) + dy;
  if (truss) { // vì kèo trong mái (khue): xà ngang, trụ giữa, kèo theo mặt dưới các dải chính — đọc được trên mặt cắt
    const n = Math.max(1, Math.round((zB - zA) / truss));
    for (let i = 0; i <= n; i++) {
      const z = zA + 0.6 + ((zB - zA - 1.2) * i) / n, yt = Math.min(Bl.yBase, Br.yBase) - 0.45 + dy;
      acc.add('wood', boxB(2 * Bl.hw, 0.42, 0.32, 0, yt, z)); acc.add('wood', boxB(0.36, yR - 0.5 - yt, 0.36, 0, yt, z));
      for (const [s, B] of sides) { const m = B.bands.filter((q) => q.main); acc.add('wood', beam(V(0, yR - 0.55, z), V(s * (m[m.length - 1].xe - 0.3), m[m.length - 1].ye + dy - 0.4, z), 0.3, 0.36)); acc.add('wood', beam(V(s * Bl.hw * 0.5, yt + 0.3, z), V(s * Bl.hw * 0.5, (yR + yt) / 2 - 0.2, z), 0.24, 0.24)); }
    }
    acc.add('wood', boxB(0.3, 0.36, zB - zA - 1, 0, yR - 0.7, (zA + zB) / 2));
  }
  acc.add(ek, boxB(0.42 * scale, 0.32 * scale, zB - zA, 0, yR - 0.08, (zA + zB) / 2));                                            // nóc
  acc.add('gold', boxB(0.16 * scale, 0.1, zB - zA, 0, yR + 0.24 * scale, (zA + zB) / 2));
  for (const [on, zf, dir] of [[front, zB, 1], [back, zA, -1]]) {
    if (!on) continue;
    // trán hồi: đường bao theo các dải chính hai bên, đáy ở pedBot (che kín tới tường / mái thấp phía trước)
    const yb = (pedBot ?? Math.min(Bl.yBase, Br.yBase) - 0.6) + (pedFixed ? 0 : dy), inset = 0.32 * scale;
    const half = (B, s) => { const pts = []; for (const b of B.bands.filter((q) => q.main)) { pts.push([s * b.xs, b.ys - inset + dy], [s * b.xe, b.ye - inset + dy]); } return pts; };
    const line = [...half(Bl, -1).reverse(), ...half(Br, 1)];
    // cắt đường bao ở cao yb (trán hồi của lot hạ thấp nhỏ hơn, chân luôn trên xà)
    const clip = []; for (let i = 0; i < line.length; i++) { const [x, y] = line[i]; if (i) { const [px, py] = line[i - 1]; if ((py - yb) * (y - yb) < 0) { const t = (yb - py) / (y - py); clip.push([px + (x - px) * t, yb]); } } if (y >= yb) clip.push([x, y]); }
    if (clip.length < 3) continue;
    const xL = clip[0][0], xR = clip[clip.length - 1][0], outline = [[xL, yb], ...clip.filter(([, y]) => y > yb + 1e-4), [xR, yb]];
    const ped = slabXY(outline, 0.18, 0, 0, zf - dir * 0.28 * scale); acc.add('naban', planarUV(ped));
    acc.add('gold', box(xR - xL, 0.28 * scale, 0.3, (xL + xR) / 2, yb + 0.14 * scale, zf - dir * 0.2 * scale));                         // xà chân trán hồi
    // lamyong mỗi dải: ván + bai raka; hang hong ở chân mỗi dải; chofa ở đỉnh
    for (const [s, B] of sides) for (const b of B.bands) {
      const a = [s * b.xs, b.ys + dy], e = [s * b.xe, b.ye + dy];
      lamyongEdge(acc, a, e, zf + dir * 0.02, { board: 0.42 * scale, tooth: 0.44 * scale });
      hangHong(acc, s * (b.xe + 0.05 * scale), b.ye + dy - 0.05, zf + dir * 0.02, 0.85 * scale * (b.main ? 1 : 0.8), s);
    }
    chofa(acc, 0, yR + 0.1 * scale, zf + dir * 0.05, chofaH, dir);
  }
  return { yR };
}

/**
 * MÁI HỒI THÁI hoàn chỉnh (nóc dọc z, tâm x = cx): đoạn chính [zMain] + lot hạ dần ở hai đầu.
 * R: { hw, p, son, eaveL, eaveR, pe, step, yBase, zMain: [zA, zB], lotsF: { n, len, drop }, lotsB, tile, border, chofaH, pedBot, scale }
 * trả { U(x, z) cao mặt dưới mái, yR, B (mặt cắt +x), pieces }
 */
export function thRoof(acc, R) {
  const cx = R.cx || 0, sc = R.scale || 1;
  const mk = (eave, over) => thBands({ hw: R.hw, p: R.p, son: R.son, eave, pe: R.pe, step: R.step ?? 0.45 * sc, yBase: R.yBase, over: over ?? R.over ?? 0.55 * sc, ov: 0.4 * sc, nMain: R.nMain });
  const Bl = mk(R.eaveL || 0, R.overL), Br = mk(R.eaveR || 0, R.overR);
  const pieces = [{ zA: R.zMain[0], zB: R.zMain[1], dy: 0, front: R.frontFace !== false, back: R.backFace !== false }];
  const F = R.lotsF || { n: 0 }, Bk = R.lotsB || { n: 0 };
  for (let j = 1; j <= F.n; j++) pieces.push({ zA: R.zMain[1] + (j - 1) * F.len - (j === 1 ? 0 : 0), zB: R.zMain[1] + j * F.len, dy: -j * F.drop, front: true, back: false });
  for (let j = 1; j <= Bk.n; j++) pieces.push({ zA: R.zMain[0] - j * Bk.len, zB: R.zMain[0] - (j - 1) * Bk.len, dy: -j * Bk.drop, front: false, back: true });
  xf(acc, new THREE.Matrix4().makeTranslation(cx, 0, 0), (a) => {
    for (const pc of pieces) thRoofPiece(a, { Bl, Br, ...pc, tile: R.tile, border: R.border, eaveTile: R.eaveTile, eaveBorder: R.eaveBorder, chofaH: (R.chofaH || 1.6) * (pc.dy ? 0.85 : 1), pedBot: R.pedBot != null ? R.pedBot : null, pedFixed: !!R.pedFixed, scale: sc, edgeKey: R.edgeKey, truss: pc.dy ? 0 : R.truss || 0 });
  });
  const U = (x, z) => {
    const pc = pieces.find((q) => z >= q.zA - 1e-6 && z <= q.zB + 1e-6) || pieces[0], B = x - cx < 0 ? Bl : Br, y = bandY(B, Math.abs(x - cx));
    return y == null ? null : y + pc.dy - 0.3;
  };
  return { U, yR: Bl.yR, Bl, Br, pieces };
}
/** mái hồi xoay: nóc dọc trục x (ry = π/2 quanh tâm) — dùng cho cánh chữ thập / mái cánh nhà dài */
export function thRoofX(acc, R, cz = 0) {
  let out; xf(acc, mRY(Math.PI / 2, 0, 0, cz), (a) => { out = thRoof(a, R); });
  return { ...out, U: (x, z) => out.U(-(z - cz), x) };
}

/** mái hiên vòng (lean-to) quanh khối chữ nhật: từ mép trong (ax, az) ở cao yIn ra mép ngoài (bx, bz) cao yOut; góc giao kiểu bờ chéo */
export function ringRoof(acc, { ax, az, bx, bz, yIn, yOut, tile = 'Green', border = 'Orange', cx = 0, cz = 0, skip = [] }) {
  const tk = `tile${tile}`, bk = `tileB${border}`, ek = `edge${border}`, bw = 0.5;
  const C = (x, y, z) => V(cx + x, y, cz + z);
  const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  sides.forEach(([sx, sz], i) => {
    if (skip.includes(i)) return;
    // tứ giác: cạnh trong (đoạn tường) → cạnh ngoài; bốn đỉnh theo hướng
    const inA = sz ? C(-ax, yIn, sz * az) : C(sx * ax, yIn, az), inB = sz ? C(ax, yIn, sz * az) : C(sx * ax, yIn, -az);
    const outA = sz ? C(-bx, yOut, sz * bz) : C(sx * bx, yOut, bz), outB = sz ? C(bx, yOut, sz * bz) : C(sx * bx, yOut, -bz);
    const t = (p, q, f) => p.clone().lerp(q, f);
    const f = 1 - bw / Math.max(0.6, sz ? bz - az : bx - ax);
    const mA = t(inA, outA, f), mB = t(inB, outB, f);
    acc.add(tk, quad(inA, inB, mB, mA)); acc.add(bk, quad(mA.clone().setY(mA.y + 0.005), mB.clone().setY(mB.y + 0.005), outB.clone().setY(outB.y + 0.005), outA.clone().setY(outA.y + 0.005)));
    acc.add('gold', beam(V(outA.x, outA.y - 0.15, outA.z), V(outB.x, outB.y - 0.15, outB.z), 0.12, 0.28));
    acc.add(ek, beam(V(inA.x, inA.y + 0.1, inA.z), V(outA.x, outA.y + 0.1, outA.z), 0.26, 0.26));                                 // bờ chéo góc
  });
}

// ---------------------------------------------------------------- tường trắng có ô cửa (khung nhọn thếp vàng)
/**
 * Tường chạy dọc x cục bộ (−L/2..L/2) ở z = 0, dày T, mặt ngoài +z; từ y0 cao H. openings: [{ u, w, y, h, kind: 'door'|'win', frame, leaf }]
 * frame: 'sum' (khung hồi nhọn — ซุ้มบันแถลง) · 'crown' (vương miện — ซุ้มทรงมงกุฎ) · 'arch' (vòm Âu) · 'plain'
 */
export function wallRun(acc, { L, y0, H, T = 0.6, openings = [], key = 'wall', shutter = 'shutter', door = 'door', pil = 0, plinthBand = true }) {
  const ops = [...openings].sort((a, b) => a.u - b.u); let x = -L / 2;
  for (const o of ops) {
    const l = o.u - o.w / 2; if (l > x + 0.01) acc.add(key, boxB(l - x, H, T, (x + l) / 2, y0, 0));
    if (o.y > 0.01) acc.add(key, boxB(o.w, o.y, T, o.u, y0, 0));
    if (o.y + o.h < H - 0.01) acc.add(key, boxB(o.w, H - o.y - o.h, T, o.u, y0 + o.y + o.h, 0));
    x = o.u + o.w / 2;
  }
  if (x < L / 2 - 0.01) acc.add(key, boxB(L / 2 - x, H, T, (x + L / 2) / 2, y0, 0));
  for (const o of ops) {
    const yb = y0 + o.y;
    acc.add('dark', boxB(o.w, 0.04, T, o.u, yb, 0));                                                                                // má cửa
    if (o.kind === 'door') { if (o.leaf !== 'open') acc.add(o.leafKey || door, boxB(o.w - 0.04, o.h, 0.1, o.u, yb, -T * 0.15)); else for (const s of [-1, 1]) acc.add(o.leafKey || door, boxB(0.1, o.h, o.w / 2, o.u + s * (o.w / 2 - 0.05), yb, -T / 2 - o.w / 4)); }
    else acc.add(o.leafKey || shutter, boxB(o.w - 0.04, o.h, 0.1, o.u, yb, -T * 0.2));
    windowFrame(acc, o.frame || 'sum', o.u, yb, o.w, o.h, T / 2);
  }
  if (pil) for (let u = -L / 2; u <= L / 2 + 1e-6; u += L / pil) { if (ops.some((o) => Math.abs(o.u - u) < o.w / 2 + 0.3)) continue; acc.add('wallShade', boxB(0.5, H, 0.16, u, y0, T / 2 + 0.08)); }
  if (plinthBand) acc.add('wallShade', boxB(L + 0.12, 0.35, T + 0.12, 0, y0, 0));
}
/** khung cửa thếp vàng nổi trên mặt tường (z = zf), lòng (u, yb, w × h) */
export function windowFrame(acc, kind, u, yb, w, h, zf) {
  const f = Math.min(0.24, w * 0.12), out = [];
  if (kind === 'arch') {
    const r = w / 2 + f, yc = yb + h - w / 2; out.push([u - r, yb - f]);
    for (let i = 0; i <= 10; i++) { const a = Math.PI - (Math.PI * i) / 10; out.push([u + Math.cos(a) * r, yc + Math.sin(a) * r]); }
    out.push([u + r, yb - f]);
    const hole = [[u - w / 2, yb]]; for (let i = 0; i <= 10; i++) { const a = Math.PI - (Math.PI * i) / 10; hole.push([u + Math.cos(a) * (w / 2), yc + Math.sin(a) * (w / 2)]); } hole.push([u + w / 2, yb]);
    return ringFrame(acc, out, hole, zf, 'euTrim');
  }
  const top = yb + h, x0 = u - w / 2 - f, x1 = u + w / 2 + f;
  if (kind === 'sum' || kind === 'sumS') { // khung hồi nhọn: tam giác hồi nhỏ trên lanh tô, đỉnh có ngọn lửa, hai chân hồi cong lên
    const ph = kind === 'sumS' ? Math.min(0.75, w * 0.4) : Math.min(1.6, w * 0.75), fin = kind === 'sumS' ? 0.25 : 0.45;
    out.push([x0, yb - f], [x1, yb - f], [x1, top + f], [x1 + f * 1.2, top + f], [x1 + f * 0.6, top + f * 2.2], [u + 0.12, top + f + ph], [u, top + f + ph + fin], [u - 0.12, top + f + ph], [x0 - f * 0.6, top + f * 2.2], [x0 - f * 1.2, top + f], [x0, top + f]);
  } else if (kind === 'crown') { // vương miện: 3 tầng thu nhỏ + mũi nhọn
    const ch = Math.min(2.6, w * 1.2); out.push([x0, yb - f], [x1, yb - f], [x1, top + f]);
    for (let i = 0; i < 3; i++) { const t0 = i / 3, t1 = (i + 1) / 3, wl = (x1 - x0) / 2 * (1 - t0 * 0.75), wh = (x1 - x0) / 2 * (1 - t1 * 0.75); out.push([u + wl + f * 0.4, top + f + ch * t0 * 0.8], [u + wh, top + f + ch * t1 * 0.8 - 0.05]); }
    out.push([u + 0.06, top + f + ch * 0.8], [u, top + f + ch], [u - 0.06, top + f + ch * 0.8]);
    for (let i = 2; i >= 0; i--) { const t0 = i / 3, t1 = (i + 1) / 3, wl = (x1 - x0) / 2 * (1 - t0 * 0.75), wh = (x1 - x0) / 2 * (1 - t1 * 0.75); out.push([u - wh, top + f + ch * t1 * 0.8 - 0.05], [u - wl - f * 0.4, top + f + ch * t0 * 0.8]); }
    out.push([x0, top + f]);
  } else out.push([x0, yb - f], [x1, yb - f], [x1, top + f], [x0, top + f]);
  ringFrame(acc, out, [[u - w / 2, yb], [u + w / 2, yb], [u + w / 2, top], [u - w / 2, top]], zf, 'gold');
}
function ringFrame(acc, out, hole, zf, key) {
  const s = new THREE.Shape(out.map(([a, b]) => new THREE.Vector2(a, b))); s.holes.push(new THREE.Path(hole.map(([a, b]) => new THREE.Vector2(a, b))));
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: false }); g.translate(0, 0, zf - 0.02); acc.add(key, g);
}

/** consol khan thuai / nak buean: thanh chéo đỡ mái hiên, hình rắn uốn, nằm trong mặt phẳng pháp tuyến (nx, nz) */
export function bracket(acc, x, y, z, nx, nz, len = 1.3, hgt = 1.6, key = 'gold') {
  const pts = [[0, 0], [0.16, 0], [0.22, 0.4], [0.45, 0.8], [0.85, 1.1], [1.05, 1.0], [1.0, 1.12], [0.8, 1.2], [0.4, 0.96], [0.1, 0.55], [0, 0.3]];
  const g = slabXY(pts.map(([a, b]) => [a * len, b * hgt]), 0.14, 0, 0, 0, -Math.PI / 2); g.rotateY(Math.atan2(nx, nz)); g.translate(x, y, z); acc.add(key, g);
}

// ---------------------------------------------------------------- CHÓP PRASAT / MONDOP (08 › A3)
/**
 * chóp tại (x, y, z) đáy nửa cạnh b, cao H; tiers = 5 (prasat) / 7 (maha prasat):
 * (1) đế 12 góc lõm · (2) n tầng chồng, mỗi tầng thân lõm + gờ mái + hồi nhỏ (bun thalaeng) 4 mặt
 * (3) «chuông» ép 4 mặt · (4) bua klum + pli thon vút · (5) giọt sương pha lê + mũi kim loại.
 * style 'mondop': tầng dày, thon đều kiểu tháp bậc vuông (busabok). sup: 'garuda'|'hamsa'|null đỡ 4 mặt đế.
 */
export function thSpire(acc, { x = 0, y, z = 0, b, H, tiers = 7, style = 'prasat', sup = null, key = 'gold' }) {
  const hBase = H * 0.08; acc.add(key, redent(b, hBase * 0.55, x, y, z)); acc.add('goldLt', sqLathe([[b * 1.06, 0], [b * 1.06, hBase * 0.12], [b * 0.9, hBase * 0.25], [b * 0.9, hBase * 0.45], [0.001, hBase * 0.45]], x, y + hBase * 0.55, z));
  let yy = y + hBase; const hT = H * (style === 'mondop' ? 0.46 : 0.36), r0 = b * 0.86, r1 = b * (style === 'mondop' ? 0.3 : 0.36);
  let sum = 0; const ws = []; for (let i = 0; i < tiers; i++) { const w = Math.pow(0.9, i); ws.push(w); sum += w; }
  for (let i = 0; i < tiers; i++) {
    const th = (hT * ws[i]) / sum, s = r0 + ((r1 - r0) * i) / Math.max(1, tiers - 1);
    acc.add(key, redent(s, th * 0.55, x, yy, z, 0.17));
    acc.add('goldLt', sqLathe([[s * 1.0, 0], [s * 1.12, th * 0.08], [s * 0.98, th * 0.28], [s * 0.86, th * 0.45], [0.001, th * 0.45]], x, yy + th * 0.55, z));
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2, nx = Math.sin(a), nz = Math.cos(a); acc.add(key, slabXY([[-s * 0.48, 0], [s * 0.48, 0], [s * 0.22, th * 0.4], [0, th * 0.78], [-s * 0.22, th * 0.4]], 0.06, x + nx * s * 1.02, yy + th * 0.42, z + nz * s * 1.02, a)); }
    yy += th;
  }
  // chuông ép 4 mặt (ram) — lathe 8 cạnh ép dẹt theo 4 trục
  const hb = H * (style === 'mondop' ? 0.07 : 0.1), rb = r1 * 0.95;
  const bell = sqLathe([[rb * 1.0, 0], [rb * 1.06, hb * 0.1], [rb * 0.92, hb * 0.3], [rb * 0.72, hb * 0.55], [rb * 0.5, hb * 0.78], [rb * 0.34, hb * 0.92], [0.001, hb]], x, yy, z); acc.add(key, bell); acc.add('goldLt', sqLathe([[rb * 1.12, 0], [rb * 1.12, hb * 0.08], [0.001, hb * 0.08]], x, yy - hb * 0.04, z)); yy += hb;
  // bua klum (búp sen nhiều vòng) + pli (mũi thon) + giọt sương
  const hp = y + H - yy, rp = rb * 0.45, prof = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8, r = rp * (1 - t * 0.85); prof.push([r * 1.18, hp * 0.62 * t], [r, hp * 0.62 * t + hp * 0.03]); }
  prof.push([rp * 0.12, hp * 0.82], [rp * 0.2, hp * 0.86], [0.03, hp * 0.9], [0.02, hp], [0.001, hp]);
  acc.add(key, clathe(prof, x, yy, z, 8));
  acc.add('glass', clathe([[0.001, 0], [rp * 0.24, 0.05], [rp * 0.26, rp * 0.3], [0.001, rp * 0.55]], x, yy + hp * 0.83, z, 8));
  if (sup) for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2 + Math.PI / 4, nx = Math.sin(a), nz = Math.cos(a), fh = hBase * 1.6; figure(acc, key, sup === 'hamsa' ? HAMSA : GARUDA, x + nx * b * 1.15, y - fh * 0.35, z + nz * b * 1.15, fh, nx, nz, 0.14); }
  return { top: y + H };
}

export { Acc, box, boxB, beam, slabXY, lathe, V };
