// ============================================================================
//  BỘ CẤU KIỆN CUNG ĐÌNH HUẾ (triều Nguyễn) — vật liệu, họa tiết thủ tục và cấu kiện nhận diện.
//  Căn cứ: docs/tienphu-nghiencuu/07-hue.md (C1 tỉ lệ, C2 vật liệu / màu, C3 sai lầm phải tránh, C4 nhận diện).
//  Khác Trung Hoa (cn.js): không đấu củng (dùng kẻ / con-xon), mái thẳng gần như phẳng (chỉ gãy nhẹ ở lá mái),
//  bờ nóc ô hộc pháp lam, đầu đao đắp rồng / phượng sành sứ, cổ diêm «nhất thi nhất họa», cửa bảng khoa + liên ba ô thơ.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, cyl, beam, slabXY, lathe, gridSurface, ribAlong, V } from './kit.js';

export const VN = {
  tileY: '#D8A02A', tileYL: '#F0C24B', tileYD: '#9C6E16', tileG: '#2F7F6E', tileT: '#A0583A',
  son: '#8B1A1A', gold: '#C8A040', silver: '#B9B6AE', stone: '#5F656B', court: '#B5643F', floorY: '#D7B04A', floorG: '#4E8A55',
  brick: '#8C8A82', plaster: '#E2D6B8', plBlue: '#2B5BA6', plGreen: '#3D8C5C', plYellow: '#E2B436', plWhite: '#F2EFE6',
  ssBg: '#DCE6EE', ssBlue: '#3A62A8', black: '#2a1c16', lacq: '#3D7A4E',
};

// ---------------------------------------------------------------- họa tiết canvas (chỉ có trong trình duyệt)
function tex(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
/** cổ diêm «nhất thi nhất họa»: ô thơ (nền ngà, chữ lam) xen ô họa (pháp lam lam / lục) trong khung son thếp — 07 C1.5, main §5.5 */
const coDiemTex = () => tex(512, 128, (g, w, h) => {
  g.fillStyle = '#5c1210'; g.fillRect(0, 0, w, h);
  g.fillStyle = VN.gold; g.fillRect(0, 5, w, 5); g.fillRect(0, h - 10, w, 5);
  const A = [14, 242], B = [270, 498];
  g.fillStyle = '#efe3c0'; g.fillRect(A[0], 18, A[1] - A[0], h - 36);
  g.strokeStyle = VN.plBlue; g.lineWidth = 3; g.strokeRect(A[0] + 6, 24, A[1] - A[0] - 12, h - 48);
  g.fillStyle = '#1d2f5e';
  for (let c = 0; c < 6; c++) for (let r = 0; r < 5; r++) { const x = A[0] + 24 + c * 34, y = 34 + r * 14; g.fillRect(x, y, 13, 3); g.fillRect(x + 5, y - 4, 3, 10); if ((c + r) % 2) g.fillRect(x + 1, y + 5, 11, 2); }
  g.fillStyle = VN.plBlue; g.fillRect(B[0], 18, B[1] - B[0], h - 36);
  g.fillStyle = VN.plGreen; g.beginPath(); g.moveTo(B[0] + 8, h - 20); g.lineTo(B[0] + 64, 42); g.lineTo(B[0] + 120, h - 20); g.fill();
  g.fillStyle = '#2e6e48'; g.beginPath(); g.moveTo(B[0] + 84, h - 20); g.lineTo(B[0] + 150, 56); g.lineTo(B[0] + 222, h - 20); g.fill();
  g.fillStyle = VN.plYellow; g.beginPath(); g.arc(B[1] - 34, 40, 11, 0, 7); g.fill();
  g.fillStyle = VN.plWhite; for (let i = 0; i < 5; i++) { const x = B[0] + 30 + i * 40, y = h - 30; for (let p = 0; p < 4; p++) { g.beginPath(); g.arc(x + Math.cos(p * 1.57) * 4, y + Math.sin(p * 1.57) * 4, 3.5, 0, 7); g.fill(); } }
  g.strokeStyle = VN.gold; g.lineWidth = 4; g.strokeRect(A[0], 18, A[1] - A[0], h - 36); g.strokeRect(B[0], 18, B[1] - B[0], h - 36);
});
/** ô hộc pháp lam bờ nóc / bờ quyết: khung vàng, ô lam hoa trắng xen ô lục điểm vàng — main §3 «bờ nóc ô hộc pháp lam» */
const phapLamTex = () => tex(512, 64, (g, w, h) => {
  g.fillStyle = VN.plYellow; g.fillRect(0, 0, w, h);
  for (const [x0, col, dot] of [[10, VN.plBlue, VN.plWhite], [266, VN.plGreen, VN.plYellow]]) {
    g.fillStyle = col; g.fillRect(x0, 9, 236, h - 18);
    g.strokeStyle = '#7a5410'; g.lineWidth = 2; g.strokeRect(x0 + 4, 13, 228, h - 26);
    g.fillStyle = dot; for (let i = 0; i < 4; i++) { const cx = x0 + 30 + i * 58, cy = h / 2; for (let p = 0; p < 5; p++) { g.beginPath(); g.arc(cx + Math.cos(p * 1.256) * 6, cy + Math.sin(p * 1.256) * 6, 4, 0, 7); g.fill(); } g.fillStyle = VN.plYellow; g.beginPath(); g.arc(cx, cy, 3, 0, 7); g.fill(); g.fillStyle = dot; }
  }
});
/** liên ba: dải ô thơ chạm, sơn son thếp vàng (248 ô thơ ở Thái Hòa — main §7) */
const lienBaTex = () => tex(512, 64, (g, w, h) => {
  g.fillStyle = '#6e1512'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    const x = 8 + i * 128; g.fillStyle = VN.gold; g.fillRect(x, 8, 112, h - 16); g.fillStyle = '#7d1c16'; g.fillRect(x + 5, 13, 102, h - 26);
    g.fillStyle = '#e0c272'; for (let c = 0; c < 6; c++) for (let r = 0; r < 3; r++) g.fillRect(x + 14 + c * 15, 18 + r * 10, 8, 3);
  }
});
/** cột son vẽ rồng mây thếp vàng (hai hàng cột giữa Thái Hòa — main §3) */
const colTex = (base = VN.son, ink = VN.gold) => tex(128, 512, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  g.strokeStyle = ink; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath();
  for (let y = 40; y <= h - 40; y += 4) { const x = w / 2 + Math.sin(y / 38) * (w * 0.42); if (y === 40) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
  g.lineWidth = 2; for (let y = 48; y < h - 48; y += 10) { const x = w / 2 + Math.sin(y / 38) * (w * 0.42); g.beginPath(); g.arc(x, y, 7, 0, Math.PI); g.stroke(); }
  g.lineWidth = 3; for (let i = 0; i < 14; i++) { const x = rnd() * w, y = 30 + rnd() * (h - 60); g.beginPath(); g.arc(x, y, 7, 0, 4.5); g.stroke(); g.beginPath(); g.arc(x + 9, y + 2, 5, 3, 7); g.stroke(); }
  g.fillStyle = ink; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14);
});
/** cửa bảng khoa (bức bàn): khung son, ô song thếp, ô giữa chữ Thọ tròn, ván dưới — main §3, 52 cánh */
const doorTex = (glass = false) => tex(128, 320, (g, w, h) => {
  g.fillStyle = VN.son; g.fillRect(0, 0, w, h);
  const lx = 12, ly = 12, lw = w - 24, lh = h * 0.5;
  g.fillStyle = glass ? '#9fb7bd' : '#3b1d12'; g.fillRect(lx, ly, lw, lh);
  g.strokeStyle = VN.gold; g.lineWidth = glass ? 3 : 5;
  if (glass) { g.strokeRect(lx + lw / 3, ly, 1, lh); g.strokeRect(lx + 2 * lw / 3, ly, 1, lh); g.strokeRect(lx, ly + lh / 2, lw, 1); }
  else { for (let x = lx + 9; x < lx + lw; x += 13) { g.beginPath(); g.moveTo(x, ly); g.lineTo(x, ly + lh); g.stroke(); } for (let y = ly + 14; y < ly + lh; y += 26) { g.beginPath(); g.moveTo(lx, y); g.lineTo(lx + lw, y); g.stroke(); } }
  g.strokeStyle = VN.gold; g.lineWidth = 4; g.strokeRect(lx, ly, lw, lh);
  const my = ly + lh + 34; g.fillStyle = '#6e1512'; g.fillRect(lx, ly + lh + 10, lw, 48);
  g.strokeStyle = VN.gold; g.lineWidth = 3; g.beginPath(); g.arc(w / 2, my, 16, 0, 7); g.stroke(); g.fillStyle = VN.gold; g.fillRect(w / 2 - 9, my - 2, 18, 4); g.fillRect(w / 2 - 2, my - 10, 4, 20);
  g.fillStyle = '#7a1a16'; g.fillRect(lx, ly + lh + 70, lw, h - (ly + lh + 70) - 12);
  g.strokeStyle = VN.gold; g.lineWidth = 3; g.strokeRect(lx + 8, ly + lh + 78, lw - 16, h - (ly + lh + 78) - 22);
});
/** vách «thượng song hạ bản» (lầu, gác): trên song gỗ thếp, dưới ván son khung vàng — lầu 10 tầng §3 */
const panelTex = () => tex(128, 256, (g, w, h) => {
  g.fillStyle = VN.son; g.fillRect(0, 0, w, h);
  const ty = 10, th = h * 0.52; g.fillStyle = '#2f1a10'; g.fillRect(8, ty, w - 16, th);
  g.strokeStyle = VN.gold; g.lineWidth = 3; for (let x = 18; x < w - 8; x += 14) { g.beginPath(); g.moveTo(x, ty); g.lineTo(x, ty + th); g.stroke(); }
  for (let y = ty + 20; y < ty + th; y += 32) { g.beginPath(); g.moveTo(8, y); g.lineTo(w - 8, y); g.stroke(); }
  g.lineWidth = 4; g.strokeRect(8, ty, w - 16, th);
  g.fillStyle = '#741814'; g.fillRect(8, ty + th + 12, w - 16, h - ty - th - 22); g.strokeStyle = VN.gold; g.lineWidth = 3; g.strokeRect(16, ty + th + 20, w - 32, h - ty - th - 38);
});
const stoneTex = () => tex(256, 128, (g, w, h) => {
  g.fillStyle = VN.stone; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '255,255,255' : '0,0,0'},0.05)`; g.fillRect(rnd() * w, rnd() * h, 6, 3); }
  g.strokeStyle = '#3f4448'; g.lineWidth = 2;
  for (let r = 0; r < 2; r++) { const y = (r * h) / 2; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 3; c++) { const x = ((c + (r % 2) * 0.5) * w) / 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 2); g.stroke(); } }
});
const courtTex = (col = VN.court, line = '#86452c') => tex(128, 128, (g, w, h) => {
  g.fillStyle = col; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(0,0,0,${0.03 + 0.05 * rnd()})`; g.fillRect((i % 2) * 64, Math.floor(i / 2) * 64, 64, 64); }
  g.strokeStyle = line; g.lineWidth = 3; for (const p of [0, 64]) { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, h); g.stroke(); g.beginPath(); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); }
});
const brickTex = () => tex(256, 256, (g, w, h) => {
  g.fillStyle = VN.brick; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(0,0,0,${0.04 * rnd()})`; g.fillRect(rnd() * w, rnd() * h, 30, 14); }
  g.strokeStyle = '#a7a59c'; g.lineWidth = 2;
  for (let r = 0; r < 12; r++) { const y = (r * h) / 12; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 6; c++) { const x = ((c + (r % 2) * 0.5) * w) / 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 12); g.stroke(); } }
});
/** lan can gạch hoa men (đồng tiền) vàng / lục — Ngọ Môn, Minh Viễn */
const ganhHoaTex = () => tex(128, 128, (g, w, h) => {
  g.fillStyle = '#2a3a2c'; g.fillRect(0, 0, w, h);
  g.strokeStyle = VN.plGreen; g.lineWidth = 14; g.strokeRect(0, 0, w, h);
  g.strokeStyle = VN.plYellow; g.lineWidth = 9;
  for (const [x, y] of [[0, 0], [w, 0], [0, h], [w, h], [w / 2, h / 2]]) { g.beginPath(); g.arc(x, y, w / 2 - 6, 0, 7); g.stroke(); }
  g.fillStyle = VN.plGreen; g.fillRect(w / 2 - 10, h / 2 - 10, 20, 20);
});
/** sành sứ khảm (mảnh bát men lam, lục, vàng, trắng) — đầu đao, bờ quyết */
const sanhSuTex = () => tex(128, 128, (g, w, h) => {
  g.fillStyle = '#d9e2e6'; g.fillRect(0, 0, w, h);
  const cols = [VN.ssBlue, VN.plGreen, VN.plYellow, '#f2efe6', '#2f6a8a', '#b8462e'];
  for (let i = 0; i < 160; i++) { g.fillStyle = cols[Math.floor(rnd() * cols.length)]; const x = rnd() * w, y = rnd() * h, s = 4 + rnd() * 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y + rnd() * 4); g.lineTo(x + s * 0.6, y + s); g.lineTo(x - 2, y + s * 0.7); g.fill(); }
});
/** cửa sổ tròn chữ Thọ (chái Thái Hòa Ø 1,4 m) */
const thoTex = () => tex(128, 128, (g, w, h) => {
  g.fillStyle = '#3b1d12'; g.fillRect(0, 0, w, h);
  g.strokeStyle = VN.gold; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.stroke();
  g.lineWidth = 7; g.beginPath(); g.moveTo(30, 64); g.lineTo(98, 64); g.moveTo(64, 22); g.lineTo(64, 106); g.moveTo(40, 40); g.lineTo(88, 40); g.moveTo(40, 88); g.lineTo(88, 88); g.moveTo(40, 40); g.lineTo(40, 52); g.moveTo(88, 76); g.lineTo(88, 88); g.stroke();
});

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
const withMap = (t, col, extra = {}) => std(t ? { map: t, ...extra } : { color: col, ...extra });
let MATS = null;
/** vật liệu Huế (khoá vật liệu dùng trong acc) */
export function vnMats() {
  if (MATS) return MATS;
  const DS = THREE.DoubleSide;
  MATS = {
    stone: withMap(stoneTex(), VN.stone), stoneDark: std({ color: '#4c5155' }), court: withMap(courtTex(), VN.court),
    floorY: withMap(courtTex(VN.floorY, '#9c7a2a'), VN.floorY), brickGrey: withMap(brickTex(), VN.brick), plaster: std({ color: VN.plaster }),
    col: withMap(colTex(), VN.son, { roughness: 0.5 }), colBlack: withMap(colTex(VN.black, '#b8963c'), VN.black, { roughness: 0.5 }),
    colSilver: withMap(colTex(VN.son, VN.silver), VN.son, { roughness: 0.5 }),
    beam: std({ color: VN.son, roughness: 0.55 }), beamBlack: std({ color: VN.black, roughness: 0.55 }), gold: std({ color: VN.gold, roughness: 0.35, metalness: 0.55 }),
    door: withMap(doorTex(false), VN.son), doorGlass: withMap(doorTex(true), VN.son), panel: withMap(panelTex(), VN.son),
    lienBa: withMap(lienBaTex(), VN.son), coDiem: withMap(coDiemTex(), VN.plBlue), phapLam: withMap(phapLamTex(), VN.plBlue, { roughness: 0.35 }),
    sanhSu: withMap(sanhSuTex(), VN.ssBg, { roughness: 0.35 }), ganhHoa: withMap(ganhHoaTex(), VN.plGreen, { roughness: 0.4 }),
    tileYellow: std({ color: VN.tileY, roughness: 0.4, side: DS }), ribYellow: std({ color: '#c38d1f', roughness: 0.35 }), capYellow: std({ color: VN.tileYL, roughness: 0.35 }),
    tileGreen: std({ color: VN.tileG, roughness: 0.4, side: DS }), ribGreen: std({ color: '#25685a', roughness: 0.35 }), capGreen: std({ color: '#3f9480', roughness: 0.35 }),
    tileTerra: std({ color: VN.tileT, roughness: 0.75, side: DS }), ribTerra: std({ color: '#8a4a30', roughness: 0.75 }), capTerra: std({ color: '#b36a48', roughness: 0.7 }),
    tileCeil: std({ color: '#7a2418', roughness: 0.7, side: DS }), tileWin: withMap(thoTex(), '#3b1d12', { side: DS }),
    wood: std({ color: '#6b3a22' }), glass: std({ color: '#a9c3c6', roughness: 0.15, metalness: 0.3 }),
    sun: std({ color: '#c8442a', roughness: 0.4 }), bronze: std({ color: '#5e5130', roughness: 0.4, metalness: 0.6 }), skin: std({ color: '#e8d8b0' }),
    water: std({ color: '#4e7f86', roughness: 0.2 }),
  };
  return MATS;
}

// ---------------------------------------------------------------- hình có UV theo mét (để họa tiết lặp đúng tỉ lệ)
/** hộp đáy tại y; UV mỗi mặt = kích thước / unit (u) — họa tiết lặp mỗi `unit` mét */
export function tbox(w, h, d, x, y, z, unit = 1, ry = 0, vUnit = unit) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, (uv.getX(i) * dims[f][0]) / unit, (uv.getY(i) * dims[f][1]) / vUnit); }
  if (ry) g.rotateY(ry); g.translate(x, y + h / 2, z); return g;
}
/** dải (băng) dọc trục x: họa tiết lặp mỗi `panel` m theo chiều dài, chiều cao trải đúng 0..1 */
export function bandX(L, h, t, x, y, z, panel, ry = 0) {
  const g = new THREE.BoxGeometry(L, h, t), uv = g.attributes.uv, su = L / panel;
  for (const f of [2, 3, 4, 5]) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setX(i, uv.getX(i) * su); }
  if (ry) g.rotateY(ry); g.translate(x, y + h / 2, z); return g;
}
/** dầm nối a→b có họa tiết lặp theo chiều dài (bờ quyết pháp lam) */
export function bandBeam(a, b, w, h, panel) {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length(), g = new THREE.BoxGeometry(w, h, L), uv = g.attributes.uv, s = L / panel;
  for (const f of [0, 1]) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setX(i, uv.getX(i) * s); }
  for (const f of [2, 3]) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setY(i, uv.getY(i) * s); }
  const m = new THREE.Matrix4().lookAt(new THREE.Vector3(), d, Math.abs(d.y / L) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0));
  g.applyMatrix4(m); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); return g;
}
/** ống tròn nằm dọc trục x */
export const tubeX = (L, r, x, y, z, seg = 8) => new THREE.CylinderGeometry(r, r, L, seg).rotateZ(Math.PI / 2).translate(x, y, z);
/** dựng một nhóm cấu kiện trong khung cục bộ rồi xoay ry quanh y và đặt tại (x, y, z) — kể cả mặt đi được */
export function put(acc, fn, ry = 0, x = 0, z = 0, y = 0) {
  const t = new Acc(); fn(t);
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
  for (const [k, l] of t.parts) for (const g of l) acc.add(k, g.applyMatrix4(m));
  const c = Math.cos(ry), s = Math.sin(ry);
  for (const p of t.plats) acc.plat({ ...p, x: x + c * p.x + s * p.z, z: z - s * p.x + c * p.z, ry: (p.ry || 0) + ry, top: p.top + y });
}

// ---------------------------------------------------------------- nền, bậc, cột
/** bậc đá Thanh với thành bậc (rồng hoặc cuốn thư) hai bên; side +1 = ra +z; khai từng bậc là mặt đi được */
export function steps(acc, { x = 0, z, side = 1, w, h, n, tread = 0.34, rail = 'scroll', y0 = 0 }) {
  n = n || Math.max(2, Math.round(h / 0.17)); const rise = h / n;
  for (let i = 0; i < n; i++) {
    const zc = z + side * tread * (n - i - 0.5), top = y0 + rise * (i + 1);
    acc.add('stoneDark', tbox(w, top, tread, x, 0, zc, 1)); acc.plat({ x, z: zc, w, d: tread + 0.02, top });
  }
  if (!rail) return;
  const L = n * tread;
  for (const sx of [-1, 1]) {
    const rx = x + sx * (w / 2 + 0.22), a = V(rx, y0 + h + 0.32, z), b = V(rx, y0 + 0.34, z + side * (L - 0.15));
    acc.add('stone', beam(a, b, 0.42, 0.42)); acc.add('stone', tbox(0.42, Math.max(0.3, y0 + h * 0.4), L, rx, 0, z + side * L / 2, 1));
    // đầu thành bậc: rồng ngóc đầu (bậc điện vua) hoặc cuốn thư
    const head = rail === 'dragon'
      ? [[0, 0], [0.75, 0], [0.9, 0.2], [0.85, 0.55], [1.05, 0.75], [0.95, 0.95], [0.7, 0.9], [0.55, 0.7], [0.3, 0.62], [0, 0.6]]
      : [[0, 0], [0.6, 0], [0.72, 0.25], [0.6, 0.55], [0.38, 0.6], [0.3, 0.42], [0.45, 0.34], [0.32, 0.22], [0, 0.3]];
    acc.add('stone', slabXY(head.map(([u, v]) => [u * 1.0, v * 1.0]), 0.4, rx, y0, z + side * (L - 0.75), side > 0 ? -Math.PI / 2 : Math.PI / 2));
  }
}
/** nền bó vỉa đá Thanh, mặt lát gạch Bát Tràng (C1.6); khai mặt đi được */
export function vnBase(acc, { W, D, h, x = 0, z = 0, floor = 'court', stairs = [] }) {
  acc.add('stone', tbox(W, h - 0.12, D, x, 0, z, 2));
  acc.add('stoneDark', tbox(W + 0.12, 0.12, D + 0.12, x, h - 0.12, z, 1));
  acc.add(floor, tbox(W - 0.4, 0.02, D - 0.4, x, h, z, 0.76));
  acc.add('stoneDark', tbox(W + 0.2, 0.18, D + 0.2, x, 0, z, 1));                              // đá chân nền
  acc.plat({ x, z, w: W, d: D, top: h });
  for (const s of stairs) steps(acc, { x: x + (s.cx || 0), z: s.side > 0 ? z + D / 2 : z - D / 2, side: s.side, w: s.w, h, n: s.n, rail: s.rail, tread: s.tread });
}
/** cột gỗ (thu đầu 4 %) trên chân tảng đá Thanh hai cấp: dưới vuông, trên tròn (Phu Văn Lâu, 31 cm) */
export function vnCol(acc, x, z, y0, h, d, key = 'col') {
  acc.add(key, cyl(d / 2, d / 2 * 0.96, h, x, y0, z, 12));
  acc.add('stoneDark', boxB(d * 1.55, 0.14, d * 1.55, x, y0, z));
  acc.add('stoneDark', cyl(d * 0.66, d * 0.58, 0.16, x, y0 + 0.14, z, 12));
}
/** kẻ (con-xon) chạm đỡ mái chìa — ở đầu cột, chĩa ra ngoài theo (nx, nz); thay cho đấu củng (C1.5, C3.4) */
export function keBracket(acc, x, z, y, nx, nz, L = 1.2, key = 'beam') {
  const pts = [[0, -0.55], [0.14, -0.55], [0.5, -0.32], [0.9, -0.12], [L, 0.04], [L, 0.22], [0.82, 0.12], [0.4, 0.02], [0, 0]];
  acc.add(key, slabXY(pts, 0.18, x, y, z, Math.atan2(-nz, nx)));
  acc.add('gold', slabXY([[L - 0.18, 0.04], [L + 0.05, 0.1], [L + 0.05, 0.24], [L - 0.18, 0.2]], 0.2, x, y, z, Math.atan2(-nz, nx)));
}

// ---------------------------------------------------------------- MÁI HUẾ
/** hệ số độ cao theo phần ngang t (0 = mép hiên, 1 = trong): lá mái chìa thoải hơn (gãy nhẹ tại tk), còn lại thẳng — C3.3 */
const prof = (tk, r = 0.6) => { const n = r * tk + (1 - tk); return (t) => (t <= tk ? (r * t) / n : (r * tk + (t - tk)) / n); };
/**
 * Mái dốc giữa chữ nhật mép hiên E (ở y0) và chữ nhật trong I (ở y1). I suy biến theo z → mái chái (vũ điện) có bờ nóc
 * dài 2·(I.xR − I.xL); I là khung cổ diêm → mái hạ (chồng diêm). Mặt phẳng thẳng, gãy nhẹ ở lá mái (tk).
 * E, I: { xL, xR, zB, zF }. o: { tile: 'Yellow'|'Green'|'Terra', over (để đặt chỗ gãy), rib (bước ngói ống), ends (false → mái hai dốc),
 *      dao: 'dragon'|'phoenix'|null, daoS (cỡ), hip (khoá bờ quyết) }
 * trả { corners: [{ x, z, y, dx, dz }] (đầu bờ quyết), Y(t) }
 */
export function slopeRoof(acc, E, I, y0, y1, o = {}) {
  const T = o.tile || 'Yellow', tileK = `tile${T}`, ribK = `rib${T}`, capK = `cap${T}`;
  const runF = E.zF - I.zF, runB = I.zB - E.zB, runR = E.xR - I.xR, runL = I.xL - E.xL;
  const tk = Math.min(0.6, (o.over ?? 1.5) / Math.max(0.5, Math.max(runF, runB))), f = prof(tk, o.kick ?? 0.6), Y = (t) => y0 + (y1 - y0) * f(t);
  const ts = tk > 0.02 ? [0, tk, 1] : [0, 1], rib = o.rib ?? 0.5, rw = o.ribW ?? 0.16;
  const faces = [
    { A: [E.xL, E.zF], B: [E.xR, E.zF], A1: [I.xL, I.zF], B1: [I.xR, I.zF], out: [0, 1], run: runF },
    { A: [E.xR, E.zB], B: [E.xL, E.zB], A1: [I.xR, I.zB], B1: [I.xL, I.zB], out: [0, -1], run: runB },
  ];
  if (o.ends !== false) faces.push(
    { A: [E.xR, E.zF], B: [E.xR, E.zB], A1: [I.xR, I.zF], B1: [I.xR, I.zB], out: [1, 0], run: runR },
    { A: [E.xL, E.zB], B: [E.xL, E.zF], A1: [I.xL, I.zB], B1: [I.xL, I.zF], out: [-1, 0], run: runL });
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  for (const F of faces) {
    if (F.run < 0.05) continue;
    let rows = ts.map((t) => { const a = lerp(F.A, F.A1, t), b = lerp(F.B, F.B1, t); return [V(a[0], Y(t), a[1]), V(b[0], Y(t), b[1])]; });
    // hướng pháp tuyến ra ngoài + lên
    const n0 = new THREE.Vector3().subVectors(rows[1][0], rows[0][0]).cross(new THREE.Vector3().subVectors(rows[0][1], rows[0][0]));
    if (n0.x * F.out[0] + n0.z * F.out[1] + n0.y * 0.3 < 0) rows = rows.map((r) => [r[1], r[0]]);
    acc.add(tileK, gridSurface(rows));
    // ngói ống: chạy từ mép vào trong tới khi chạm bờ quyết
    const L = Math.hypot(F.B[0] - F.A[0], F.B[1] - F.A[1]), ux = (F.B[0] - F.A[0]) / L, uz = (F.B[1] - F.A[1]) / L;
    const sA1 = (F.A1[0] - F.A[0]) * ux + (F.A1[1] - F.A[1]) * uz, sB1 = (F.B1[0] - F.A[0]) * ux + (F.B1[1] - F.A[1]) * uz;
    const inx = -F.out[0], inz = -F.out[1];
    for (let s = rib / 2; s < L - rib / 4; s += rib) {
      let tEnd = 1;
      if (s < sA1) tEnd = sA1 > 1e-6 ? s / sA1 : 1; else if (s > sB1) tEnd = L - sB1 > 1e-6 ? (L - s) / (L - sB1) : 1;
      tEnd -= rw / Math.max(0.5, F.run); if (tEnd < 0.04) continue;
      const pts = ts.filter((t) => t < tEnd).concat([tEnd]).map((t) => V(F.A[0] + ux * s + inx * F.run * t, Y(t) + rw * 0.42, F.A[1] + uz * s + inz * F.run * t));
      acc.add(ribK, ribAlong(pts, rw, rw * 0.85));
    }
    // diềm mép (hàng ngói đầu tròn + lá mái)
    acc.add(capK, beam(V(F.A[0], y0 - 0.06, F.A[1]), V(F.B[0], y0 - 0.06, F.B[1]), 0.26, 0.24));
    if (o.ends === false) {
      // đầu hồi mái hai dốc (hồi lang, nhà vỏ cua): ván bưng tam giác
      for (const [p, p1] of [[F.A, F.A1], [F.B, F.B1]]) { const g = [V(p[0], y0, p[1]), V(p1[0], y1, p1[1])]; acc.add(capK, ribAlong(g, 0.3, 0.3)); }
    }
  }
  // bờ quyết (bờ góc) có ô hộc pháp lam + đầu đao
  const corners = [];
  if (o.ends !== false) [[E.xL, E.zF, I.xL, I.zF], [E.xR, E.zF, I.xR, I.zF], [E.xR, E.zB, I.xR, I.zB], [E.xL, E.zB, I.xL, I.zB]].forEach(([cx, cz, ix, iz], ci) => {
    const P = (t) => V(cx + (ix - cx) * t, Y(t) + 0.2, cz + (iz - cz) * t), hw = o.hipW ?? 0.36;
    const pts = ts.map(P);
    for (let i = 0; i < pts.length - 1; i++) { acc.add('phapLam', bandBeam(pts[i], pts[i + 1], hw, hw * 0.9, 1.0)); acc.add(capK, beam(V(pts[i].x, pts[i].y + hw * 0.5, pts[i].z), V(pts[i + 1].x, pts[i + 1].y + hw * 0.5, pts[i + 1].z), hw * 0.75, 0.12)); }
    const dl = Math.hypot(cx - ix, cz - iz) || 1, dx = (cx - ix) / dl, dz = (cz - iz) / dl;
    corners.push({ x: cx, z: cz, y: y0, dx, dz });
    if (o.dao && (!o.daoMask || o.daoMask[ci])) daoOrn(acc, o.dao, cx - dx * 0.25, y0 + 0.08, cz - dz * 0.25, dx, dz, o.daoS || 1);
  });
  return { corners, Y, tk };
}
/** đầu đao: rồng (giao) đắp sành sứ uốn ngược lên ở đầu bờ quyết; phượng cho cung Thái hậu (Diên Thọ §5.2) */
export function daoOrn(acc, kind, x, y, z, dx, dz, s = 1) {
  const dragon = [[-0.4, 0], [0.4, 0], [0.85, 0.12], [1.15, 0.42], [1.25, 0.82], [1.12, 1.18], [0.9, 1.34], [0.66, 1.26], [0.8, 1.12], [0.92, 0.9], [0.86, 0.6], [0.64, 0.4], [0.3, 0.3], [-0.4, 0.3]];
  const phoenix = [[-0.4, 0], [0.5, 0], [0.9, 0.18], [1.05, 0.46], [0.92, 0.58], [1.12, 0.92], [1.42, 1.42], [1.18, 1.32], [0.92, 0.98], [0.7, 0.92], [0.6, 1.16], [0.4, 1.06], [0.48, 0.8], [0.24, 0.42], [-0.4, 0.3]];
  const pts = (kind === 'phoenix' ? phoenix : dragon).map(([u, v]) => [u * s, v * s]);
  acc.add('sanhSu', slabXY(pts, 0.2 * s, x, y, z, Math.atan2(-dz, dx)));
  // vây / sừng nhỏ cho rồng
  if (kind !== 'phoenix') acc.add('sanhSu', slabXY([[0.95, 1.2], [1.05, 1.5], [0.85, 1.32]].map(([u, v]) => [u * s, v * s]), 0.12 * s, x, y, z, Math.atan2(-dz, dx)));
}
/** BỜ NÓC: đế, dải ô hộc pháp lam, ống bao nóc; hai đầu cuốn thư; giữa: 'sun' (lưỡng long chầu nhật) · 'gourd' (hồ lô) · 'taiji' (thái cực) */
export function ridgeBand(acc, x0, x1, z, y, { h = 0.8, tile = 'Yellow', orn = 'gourd', s = 1 } = {}) {
  const L = x1 - x0, cx = (x0 + x1) / 2, cap = `cap${tile}`;
  acc.add(cap, boxB(L + 0.5, 0.16, 0.62, cx, y, z));
  acc.add('phapLam', bandX(L + 0.2, h, 0.4, cx, y + 0.16, z, 1.0));
  acc.add('gold', boxB(L + 0.24, 0.05, 0.44, cx, y + 0.16 + h * 0.08, z)); acc.add('gold', boxB(L + 0.24, 0.05, 0.44, cx, y + 0.16 + h * 0.86, z));
  acc.add(cap, tubeX(L + 0.4, 0.2, cx, y + 0.16 + h + 0.08, z));
  const yt = y + 0.16 + h + 0.2;
  // hai đầu bờ: cuốn thư (đuôi rồng cuộn) quay vào trong
  const curl = [[0, 0], [0.5, 0], [0.62, 0.28], [0.56, 0.7], [0.32, 0.9], [0.08, 0.8], [0.22, 0.66], [0.34, 0.44], [0.2, 0.28], [0, 0.32]];
  for (const sx of [-1, 1]) acc.add('sanhSu', slabXY(curl.map(([u, v]) => [-sx * u * s * 1.3, v * s * 1.3]), 0.3, cx + sx * (L / 2 + 0.25), yt - 0.35, z));
  return ornament(acc, orn, cx, yt - 0.1, z, s, L);
}
/** vật trang trí giữa nóc */
export function ornament(acc, orn, x, y, z, s = 1, L = 6) {
  if (!orn) return y;
  let top = y;
  const R = 0.55 * s, yc = y + R + 0.35 * s;
  if (orn === 'gourd' || orn === 'longGourd') {
    const p = [[0.42, 0], [0.42, 0.14], [0.28, 0.22], [0.34, 0.34], [0.5, 0.58], [0.52, 0.78], [0.4, 0.98], [0.2, 1.08], [0.26, 1.18], [0.34, 1.34], [0.32, 1.52], [0.18, 1.66], [0.08, 1.74], [0.08, 1.98], [0.001, 2.04]];
    acc.add('gold', lathe(p.map(([r, v]) => [r * s, v * s]), x, y, z, 14)); top = y + 2.04 * s;
  } else if (orn === 'sun' || orn === 'taiji') {
    const disc = new THREE.CylinderGeometry(R, R, 0.2, 24).rotateX(Math.PI / 2).translate(x, yc, z);
    acc.add(orn === 'sun' ? 'sun' : 'phapLam', disc);
    acc.add('gold', new THREE.TorusGeometry(R, 0.06 * s, 6, 24).translate(x, yc, z));
    if (orn === 'taiji') { acc.add('capYellow', new THREE.CylinderGeometry(R * 0.5, R * 0.5, 0.24, 16).rotateX(Math.PI / 2).translate(x - R * 0.3, yc + R * 0.25, z)); acc.add('sun', new THREE.CylinderGeometry(R * 0.2, R * 0.2, 0.28, 12).rotateX(Math.PI / 2).translate(x + R * 0.3, yc - R * 0.25, z)); }
    const star = []; for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, r = (i % 2 ? 1.18 : 1.42) * R; star.push([Math.cos(a) * r, Math.sin(a) * r]); }
    acc.add('gold', slabXY(star, 0.08, x, yc, z - 0.08));
    acc.add('stoneDark', boxB(0.3 * s, 0.4 * s, 0.24, x, y, z)); top = yc + 1.42 * R;
  }
  if (orn === 'sun' || orn === 'longGourd') { // lưỡng long chầu nhật / chầu hồ lô: hai rồng uốn khúc trên bờ nóc, đầu ngóc về giữa
    const len = Math.min(3.2 * s, L * 0.36), g0 = orn === 'sun' ? R * 1.45 : 0.55 * s;
    for (const sx of [-1, 1]) {
      const top_ = [], bot = [], N = 18;
      for (let i = 0; i <= N; i++) { const u = i / N, xx = (g0 + (1 - u) * len), yy = 0.26 * s + 0.2 * s * Math.sin(u * Math.PI * 3) + (u > 0.8 ? (u - 0.8) * 3 * s : 0); top_.push([xx, yy + 0.13 * s]); bot.push([xx, yy - 0.13 * s]); }
      const head = [[g0 - 0.05, 0.95 * s], [g0 - 0.2 * s, 0.82 * s], [g0 - 0.05, 0.68 * s]];
      const pts = [...bot, ...head, ...top_.reverse()].map(([u, v]) => [sx * u, v]);
      acc.add('sanhSu', slabXY(pts, 0.18, x, y, z));
    }
  }
  return top;
}
/** dải cổ diêm quanh chữ nhật I, từ y lên h: ô hộc thơ / họa, gờ trên dưới, trụ góc */
export function coDiem(acc, I, y, h, t = 0.28) {
  const W = I.xR - I.xL, D = I.zF - I.zB, cx = (I.xL + I.xR) / 2, cz = (I.zF + I.zB) / 2;
  acc.add('coDiem', bandX(W, h, t, cx, y, I.zF, 2.4)); acc.add('coDiem', bandX(W, h, t, cx, y, I.zB, 2.4, Math.PI));
  acc.add('coDiem', bandX(D, h, t, I.xR, y, cz, 2.4, Math.PI / 2)); acc.add('coDiem', bandX(D, h, t, I.xL, y, cz, 2.4, -Math.PI / 2));
  for (const [yy, hh] of [[y - 0.08, 0.12], [y + h - 0.02, 0.14]]) { acc.add('beam', boxB(W + 0.12, hh, t + 0.1, cx, yy, I.zF)); acc.add('beam', boxB(W + 0.12, hh, t + 0.1, cx, yy, I.zB)); acc.add('beam', boxB(t + 0.1, hh, D + 0.12, I.xL, yy, cz)); acc.add('beam', boxB(t + 0.1, hh, D + 0.12, I.xR, yy, cz)); }
  for (const [x, z] of [[I.xL, I.zF], [I.xR, I.zF], [I.xR, I.zB], [I.xL, I.zB]]) acc.add('beam', boxB(t + 0.14, h, t + 0.14, x, y, z));
}

// ---------------------------------------------------------------- vách, cửa (khung cục bộ: dọc trục x từ u0 tới u1, mặt ngoài +z, z = 0)
/** cửa bảng khoa n cánh + khung + dải liên ba trên; open: chừa lối giữa ≥ 2,4 m (bỏ các cánh giữa) */
export function doorBay(acc, u0, u1, y0, h, { open = false, glass = false, lienBa = 0.55, leaf = 0.95 } = {}) {
  const W = u1 - u0, n = Math.max(2, Math.round((W - 0.3) / leaf)), w = (W - 0.3) / n, hd = h - lienBa - 0.12;
  acc.add('beam', boxB(0.15, h, 0.22, u0 + 0.075, y0, 0)); acc.add('beam', boxB(0.15, h, 0.22, u1 - 0.075, y0, 0));
  acc.add('beam', boxB(W, 0.12, 0.24, (u0 + u1) / 2, y0 + hd, 0)); acc.add('stoneDark', boxB(W, 0.1, 0.3, (u0 + u1) / 2, y0, 0));
  if (lienBa > 0) acc.add('lienBa', bandX(W - 0.3, lienBa, 0.12, (u0 + u1) / 2, y0 + hd + 0.12, 0, 1.6));
  let skip = 0; if (open) skip = Math.min(n, Math.max(2, Math.ceil(2.6 / w))); if (open && (n - skip) % 2) skip++;
  const s0 = (n - skip) / 2;
  for (let i = 0; i < n; i++) { if (open && i >= s0 && i < s0 + skip) continue; acc.add(glass ? 'doorGlass' : 'door', boxB(w - 0.03, hd - 0.1, 0.08, u0 + 0.15 + w * (i + 0.5), y0 + 0.1, 0)); }
  if (open) acc.add('gold', boxB(Math.min(W - 0.4, skip * w), 0.08, 0.26, (u0 + u1) / 2, y0 + hd - 0.12, 0));
}
/** cửa sổ hình (tròn chữ Thọ / vuông / rẻ quạt / chiếc khánh): khung thếp + mặt song — tâm (u, y), bán kính r */
export function shapedWin(acc, kind, u, y, r, fill = 'tileWin', z0 = 0) {
  let pts;
  if (kind === 'square') pts = [[-r, -r], [r, -r], [r, r], [-r, r]];
  else if (kind === 'fan') { pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.18 + 0.64 * i / 12); pts.push([Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.35 - r * 0.75]); } for (let i = 12; i >= 0; i--) { const a = Math.PI * (0.18 + 0.64 * i / 12); pts.push([Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45 - r * 0.75]); } }
  else if (kind === 'khanh') pts = [[-r * 1.2, r * 0.1], [-r * 0.2, r * 0.75], [0, r * 0.55], [r * 0.2, r * 0.75], [r * 1.2, r * 0.1], [r * 0.9, -r * 0.35], [0, -r * 0.05], [-r * 0.9, -r * 0.35]];
  else { pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } }
  const outer = pts.map(([a, b]) => new THREE.Vector2(a * 1.16 + Math.sign(a) * 0.05, b * 1.16 + Math.sign(b) * 0.05)), inner = pts.map(([a, b]) => new THREE.Vector2(a, b));
  const sh = new THREE.Shape(outer); sh.holes.push(new THREE.Path(inner));
  const fr = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false }); fr.translate(u, y, z0 + 0.02); acc.add('gold', fr);
  const f = new THREE.ShapeGeometry(new THREE.Shape(inner)); const uv = f.attributes.uv, R = r * 1.4;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / (2 * R) + 0.5, uv.getY(i) / (2 * R) + 0.5);
  f.translate(u, y, z0 + 0.12); acc.add(fill, f);
}
/** tường vữa vôi (chái, hồi): đế đá, khung son, cửa sổ tròn tuỳ chọn */
export function plasterBay(acc, u0, u1, y0, h, { win = null, r = 0.7, t = 0.36 } = {}) {
  const W = u1 - u0, cx = (u0 + u1) / 2;
  acc.add('plaster', boxB(W, h, t, cx, y0, 0)); acc.add('stoneDark', boxB(W + 0.04, 0.45, t + 0.08, cx, y0, 0));
  acc.add('beam', boxB(W, 0.16, t + 0.06, cx, y0 + h - 0.16, 0));
  if (W > 1.6) { acc.add('beam', boxB(W - 0.6, 0.06, 0.05, cx, y0 + 0.7, t / 2)); acc.add('beam', boxB(W - 0.6, 0.06, 0.05, cx, y0 + h - 0.55, t / 2)); acc.add('beam', boxB(0.06, h - 1.31, 0.05, u0 + 0.3, y0 + 0.7, t / 2)); acc.add('beam', boxB(0.06, h - 1.31, 0.05, u1 - 0.3, y0 + 0.7, t / 2)); }
  if (win && W > 2 * r + 0.4) shapedWin(acc, win, cx, y0 + Math.min(h * 0.55, h - r - 0.7), r, 'tileWin', t / 2 - 0.1);
}
/** vách gỗ «thượng song hạ bản» (lầu, gác) + cửa sổ hình tuỳ chọn */
export function panelBay(acc, u0, u1, y0, h, { win = null, r = 0.55 } = {}) {
  const W = u1 - u0, cx = (u0 + u1) / 2;
  acc.add('beam', boxB(0.14, h, 0.2, u0 + 0.07, y0, 0)); acc.add('beam', boxB(0.14, h, 0.2, u1 - 0.07, y0, 0));
  const n = Math.max(1, Math.round((W - 0.28) / 1.1)), w = (W - 0.28) / n;
  for (let i = 0; i < n; i++) acc.add('panel', boxB(w - 0.03, h - 0.1, 0.1, u0 + 0.14 + w * (i + 0.5), y0 + 0.05, 0));
  acc.add('beam', boxB(W, 0.12, 0.22, cx, y0 + h - 0.12, 0));
  if (win && W > 2 * r + 0.3) shapedWin(acc, win, cx, y0 + h * 0.55, r);
}
/** cửa kính khung gỗ (Trường Du Tạ, Diên Thọ) */
export function glassBay(acc, u0, u1, y0, h, { door = false } = {}) {
  const W = u1 - u0, cx = (u0 + u1) / 2;
  acc.add('beam', boxB(W, 0.6, 0.18, cx, y0, 0)); acc.add('beam', boxB(W, 0.12, 0.2, cx, y0 + h - 0.12, 0));
  acc.add('beam', boxB(0.12, h, 0.2, u0 + 0.06, y0, 0)); acc.add('beam', boxB(0.12, h, 0.2, u1 - 0.06, y0, 0));
  const n = Math.max(2, Math.round(W / 0.8));
  if (door) { const dw = Math.min(W - 0.3, 2.6); for (const sx of [-1, 1]) if (W - dw > 0.5) acc.add('glass', boxB((W - dw) / 2 - 0.12, h - 0.8, 0.04, cx + sx * (dw / 2 + (W - dw) / 4), y0 + 0.6, 0)); return; }
  acc.add('glass', boxB(W - 0.24, h - 0.72, 0.04, cx, y0 + 0.6, 0));
  for (let i = 1; i < n; i++) acc.add('beam', boxB(0.05, h - 0.72, 0.08, u0 + (W * i) / n, y0 + 0.6, 0));
  acc.add('beam', boxB(W - 0.24, 0.05, 0.08, cx, y0 + 0.6 + (h - 0.72) * 0.62, 0));
}
/** lan can gỗ con tiện (lầu, gác, hiên) */
export function woodRail(acc, u0, u1, y0, { h = 0.95, step = 0.32, key = 'beam' } = {}) {
  const W = u1 - u0, cx = (u0 + u1) / 2; if (W < 0.3) return;
  acc.add(key, boxB(W, 0.1, 0.16, cx, y0 + h - 0.1, 0)); acc.add(key, boxB(W, 0.1, 0.14, cx, y0 + 0.06, 0));
  const n = Math.max(1, Math.round(W / step)); for (let i = 1; i < n; i++) acc.add('gold', boxB(0.06, h - 0.26, 0.06, u0 + (W * i) / n, y0 + 0.16, 0));
}
/** nữ tường lan can gạch hoa men (Ngọ Môn, đài lầu) */
export function ganhRail(acc, u0, u1, y0, { h = 1.0, t = 0.4 } = {}) {
  const W = u1 - u0, cx = (u0 + u1) / 2; if (W < 0.3) return;
  acc.add('ganhHoa', tbox(W, h - 0.16, t * 0.7, cx, y0, 0, 0.42, 0, (h - 0.16) / Math.max(1, Math.round((h - 0.16) / 0.42))));
  acc.add('stoneDark', boxB(W + 0.02, 0.16, t, cx, y0 + h - 0.16, 0));
  const n = Math.max(1, Math.round(W / 2.4)); for (let i = 0; i <= n; i++) acc.add('brickGrey', boxB(0.42, h + 0.1, t + 0.04, u0 + (W * i) / n, y0, 0));
}
export { box, boxB, cyl, beam, slabXY, lathe, V };
