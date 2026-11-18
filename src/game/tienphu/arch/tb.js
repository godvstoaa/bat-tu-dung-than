// ============================================================================
//  BỘ DỰNG KIẾN TRÚC TÂY TẠNG (Potala, Shöl, Lukhang, Norbulingka) — theo docs/tienphu-nghiencuu/03-taytang.md.
//  Ngôn ngữ chung (03 › A1–A5):
//   · tường xây NGHIÊNG MẶT NGOÀI liên tục (thu phân 收分, công trình lớn 10 %, nhà dân 2–5 %), mặt trong thẳng đứng
//   · mái bằng đất arga có tường chắn mái + gờ đá; dải PENBEY (cành tamarisk bó, nâu đỏ) dưới đỉnh tường của nhà tôn giáo /
//     quý tộc, gắn đĩa đồng mạ vàng; nhà dân Shöl: tường chắn trơn (không penbey)
//   · cửa sổ: viền đen HÌNH THANG (hẹp trên rộng dưới), lanh tô nhiều lớp rui nhỏ nhô ra (三椽三盖), rèm vải sọc shambu
//   · cột bên trong: thân vuông vát cạnh, đấu vuông bo-gyab + đà cung gzhu chạm sơn, xà gdung
//   · mái vàng kiểu Hán nhỏ (gyaphib) chỉ đặt TRÊN mái bằng của điện quan trọng; gyaltsen (ống cờ đồng vàng) ở góc mái
//  Loại hình: block (khối tường nghiêng: điện, nhà sân trong, dãy tăng phòng, môn lâu, điện kinh luân, đình mái vàng),
//  lukhang (mandala 3 tầng trên đảo tròn), lakepav (đình Hán ven hồ), chorten (tháp cổng Pargo Kaling), stage (sân Deyang),
//  islandpav (Tsokyil Phodrang), compound (ghép khối), tower (Hồng Cung 10 tầng).
//  Mọi hàm trả { acc, info }. Khung: gốc = tâm mặt bằng trên mặt đất, +z = mặt tiền, đơn vị m.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, cyl, beam, slabXY, lathe as latheOpen, polyRoof, roofProfile, ridgeGeo, silhouette, V } from './kit.js';
import { cnRoof, cnPavilion, dougongRow, balustrade, benchRail, column as cnColumn } from './cn.js';

// ---------------------------------------------------------------- màu (03 › A2, hex gần đúng)
export const TB = {
  white: '#EEE9DD', red: '#8E2A22', penbey: '#5A2620', penbeyD: '#4E1F1A', black: '#1B1716', roofGold: '#C9A43A', gold: '#D4AF37',
  arga: '#A39C90', yellow: '#D2A23C', wood: '#8B1E1A', brown: '#6B3A22', stone: '#8A7F6E', stoneL: '#9A948A', grid: '#5C1E16',
  parBR: '#6A2E24', parBlk: '#2A2422', rail: '#CFCAC0', blue: '#1F4E8C', green: '#2E7D4F', yel: '#E3B23C', red2: '#A3231C',
  w2: '#F4F1EA', yak: '#1F1A18', dull: '#A88A3A', chorten: '#F2EFE6', lyellow: '#E6D8A6', grass: '#5f7a3c', shambuR: '#B22A22',
};

// ---------------------------------------------------------------- texture thủ tục (chỉ trong trình duyệt)
function rnd(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function canvasTex(w, h, draw, repeat = true) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
/** vôi quét tay: vệt chảy dọc + mạch xây mờ */
const washTex = (base, dark, light, seed = 7) => canvasTex(256, 256, (g, w, h) => {
  const r = rnd(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
  g.globalAlpha = 0.16; for (let i = 0; i < 80; i++) { g.fillStyle = r() < 0.55 ? dark : light; g.fillRect(r() * w, 0, 2 + r() * 9, h * (0.25 + r() * 0.75)); }
  g.globalAlpha = 0.1; g.strokeStyle = dark; g.lineWidth = 2; for (let y = 6; y < h; y += 26) { g.beginPath(); g.moveTo(0, y + r() * 4); g.lineTo(w, y + r() * 4); g.stroke(); }
  g.globalAlpha = 1;
});
/** đá hộc granite xếp lớp */
const stoneTex = () => canvasTex(256, 256, (g, w, h) => {
  const r = rnd(3); g.fillStyle = '#5f564b'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h;) { const rh = 14 + r() * 18; for (let x = -r() * 30; x < w;) { const rw = 22 + r() * 44, v = (112 + r() * 38) | 0; g.fillStyle = `rgb(${v + 26},${v + 16},${v})`; g.fillRect(x + 2, y + 2, rw - 3, rh - 3); x += rw; } y += rh; }
});
/** penbey: đầu cành bó dày đặc + đường nối lớp */
const penbeyTex = (base) => canvasTex(256, 128, (g, w, h) => {
  const r = rnd(5); g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 3200; i++) { g.fillStyle = r() < 0.5 ? '#74352d' : '#3f1813'; g.fillRect(r() * w, r() * h, 1.6, 2 + r() * 3); }
  g.fillStyle = 'rgba(0,0,0,0.28)'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 2);
});
/** lanh tô: hàng đầu rui vuông ngũ sắc + dải «tinh tinh mộc» đỏ chấm trắng (03 › A2) — 1 lặp = 0,8 m */
const lintelTex = () => canvasTex(128, 64, (g, w, h) => {
  g.fillStyle = TB.black; g.fillRect(0, 0, w, h);
  const cols = [TB.blue, TB.green, TB.red2, TB.yel];
  for (let i = 0; i < 4; i++) { const x = i * 32 + 4; g.fillStyle = cols[i]; g.fillRect(x, 4, 24, 30); g.fillStyle = TB.w2; g.fillRect(x + 9, 13, 6, 12); }
  g.fillStyle = TB.red2; g.fillRect(0, 40, w, 21); g.fillStyle = TB.w2; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(8 + i * 16, 50, 3.2, 0, 7); g.fill(); }
});
/** rèm vải shambu: sọc trắng / lam / trắng / đỏ, nếp gấp dọc — 1 lặp = 0,4 m */
const shambuTex = () => canvasTex(64, 64, (g, w, h) => {
  for (const [c, a, z] of [[TB.w2, 0, 0.16], [TB.blue, 0.16, 0.4], [TB.w2, 0.4, 0.47], [TB.shambuR, 0.47, 0.92], [TB.w2, 0.92, 1]]) { g.fillStyle = c; g.fillRect(0, a * h, w, (z - a) * h + 1); }
  for (let x = 0; x < w; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, 'rgba(0,0,0,0.28)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.1)'); gr.addColorStop(1, 'rgba(0,0,0,0.28)'); g.fillStyle = gr; g.fillRect(x, 0, 8, h); }
}, false);
/** cửa sổ gỗ đỏ: khung, song chia ô, lòng tối */
const winTex = (frame = TB.wood, pane = '#241a16', cols = 3, rows = 4) => canvasTex(96, 128, (g, w, h) => {
  g.fillStyle = frame; g.fillRect(0, 0, w, h); g.fillStyle = pane;
  const m = 8, cw = (w - 2 * m) / cols, rh = (h - 2 * m) / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { g.fillRect(m + i * cw + 3, m + j * rh + 3, cw - 6, rh - 6); g.strokeStyle = 'rgba(160,60,40,0.55)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(m + i * cw + cw / 2, m + j * rh + 3); g.lineTo(m + i * cw + cw / 2, m + (j + 1) * rh - 3); g.stroke(); }
  g.strokeStyle = TB.yel; g.lineWidth = 2; g.strokeRect(3, 3, w - 6, h - 6);
}, false);
/** Nhật Quang điện: kính sát sàn, khung đỏ dày, rèm vàng trên (03 › main §5.6) */
const glassTex = () => canvasTex(128, 96, (g, w, h) => {
  g.fillStyle = TB.wood; g.fillRect(0, 0, w, h);
  g.fillStyle = '#7f97a4'; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) g.fillRect(6 + i * 30, 34 + j * 30, 26, 26);
  g.fillStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 4; i++) g.fillRect(8 + i * 30, 36, 6, 50);
  g.fillStyle = TB.yel; g.fillRect(0, 0, w, 30); g.fillStyle = 'rgba(0,0,0,0.2)'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 3, 30);
}, false);
/** cửa gỗ đỏ: nẹp sắt đen, đinh vàng, khoen */
const doorTex = () => canvasTex(128, 192, (g, w, h) => {
  g.fillStyle = TB.wood; g.fillRect(0, 0, w, h); g.fillStyle = '#5e140f'; g.fillRect(w / 2 - 1, 0, 2, h);
  for (const y of [22, 70, 120, 168]) { g.fillStyle = '#141110'; g.fillRect(0, y, w, 9); g.fillStyle = TB.gold; for (let x = 6; x < w; x += 12) { g.beginPath(); g.arc(x, y + 4.5, 2.4, 0, 7); g.fill(); } }
  g.strokeStyle = TB.gold; g.lineWidth = 3; for (const x of [w / 2 - 14, w / 2 + 14]) { g.beginPath(); g.arc(x, 100, 7, 0, 7); g.stroke(); }
}, false);
/** sơn đầu cột / đà cung: dải lam – lục – đỏ, cánh sen vàng */
const capTex = () => canvasTex(128, 64, (g, w, h) => {
  g.fillStyle = TB.green; g.fillRect(0, 0, w, h * 0.3); g.fillStyle = TB.blue; g.fillRect(0, h * 0.3, w, h * 0.4); g.fillStyle = TB.red2; g.fillRect(0, h * 0.7, w, h * 0.3);
  for (let x = 0; x < w; x += 16) { g.fillStyle = TB.yel; g.beginPath(); g.ellipse(x + 8, h * 0.5, 6, 11, 0, 0, 7); g.fill(); g.fillStyle = TB.w2; g.beginPath(); g.ellipse(x + 8, h * 0.5, 2.5, 6, 0, 0, 7); g.fill(); }
  g.fillStyle = TB.w2; for (let x = 4; x < w; x += 10) g.fillRect(x, h * 0.78, 4, 4);
});
/** xà sơn kiểu Tạng: nền đỏ, hàng cánh sen nhiều màu, viền vàng */
const beamTex = (alt) => canvasTex(256, 32, (g, w, h) => {
  g.fillStyle = alt ? TB.green : TB.red2; g.fillRect(0, 0, w, h); g.fillStyle = TB.yel; g.fillRect(0, 0, w, 3); g.fillRect(0, h - 3, w, 3);
  const cs = [TB.blue, TB.green, TB.yel, TB.red2, TB.w2];
  for (let i = 0; i < 16; i++) { g.fillStyle = cs[(i + (alt ? 2 : 0)) % 5]; g.beginPath(); g.moveTo(i * 16, h - 4); g.quadraticCurveTo(i * 16 + 8, 2, i * 16 + 16, h - 4); g.fill(); }
});
const flagTex = () => canvasTex(160, 32, (g, w, h) => {
  [TB.blue, '#f6f4ee', '#c3302a', '#2f8a4c', '#e8c23a'].forEach((c, i) => { g.fillStyle = c; g.fillRect(i * 32 + 1, 0, 30, h); g.fillStyle = 'rgba(0,0,0,0.35)'; for (let y = 6; y < h - 4; y += 5) g.fillRect(i * 32 + 6, y, 20, 1); });
});
const maniTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = TB.red2; g.fillRect(0, 0, w, h); g.fillStyle = TB.gold; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14); g.fillRect(0, 40, w, 4); g.fillRect(0, 84, w, 4);
  g.strokeStyle = TB.gold; g.lineWidth = 3; const r = rnd(11); for (let x = 6; x < w; x += 20) { g.beginPath(); g.moveTo(x, 52); g.lineTo(x + 6, 60); g.lineTo(x + 2, 70); g.lineTo(x + 10, 76); g.stroke(); g.beginPath(); g.arc(x + 8, 50 + r() * 2, 3, 0, 7); g.stroke(); }
});
const mandalaTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = TB.blue; g.fillRect(0, 0, w, h); const c = w / 2;
  for (const [r, col] of [[60, TB.red2], [50, TB.yel], [42, TB.green], [34, TB.w2], [24, TB.red2], [12, TB.yel]]) { g.fillStyle = col; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill(); }
  g.strokeStyle = TB.w2; g.lineWidth = 3; g.strokeRect(c - 30, c - 30, 60, 60);
}, false);
const shelfTex = () => canvasTex(64, 64, (g, w, h) => {
  g.fillStyle = '#3b2416'; g.fillRect(0, 0, w, h);
  for (let y = 2; y < h; y += 10) for (let x = 2; x < w; x += 6) { g.fillStyle = (x + y) % 3 ? '#a6855c' : '#8c6b45'; g.fillRect(x, y, 4, 7); }
});
const argaTex = () => canvasTex(128, 128, (g, w, h) => { const r = rnd(9); g.fillStyle = TB.arga; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { g.fillStyle = r() < 0.5 ? 'rgba(80,72,62,0.18)' : 'rgba(255,255,255,0.12)'; g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 4, 0, 7); g.fill(); } });
const yakTex = () => canvasTex(64, 64, (g, w, h) => { g.fillStyle = TB.yak; g.fillRect(0, 0, w, h); g.fillStyle = TB.w2; g.fillRect(0, h * 0.12, w, 4); g.fillRect(0, h * 0.85, w, 4); g.fillStyle = TB.blue; g.fillRect(0, h * 0.2, w, 3); for (let x = 8; x < w; x += 16) { g.fillStyle = TB.w2; g.fillRect(x, h * 0.4, 6, 14); } });

/** đơn vị lặp texture (m) cho UV toạ độ thế giới */
const UNIT = { wallW: 4, wallR: 4, wallY: 4, wallLY: 4, wallS: 3, penbey: 2, penbeyD: 2, arga: 4, parBR: 4, parBlk: 4, chorten: 4 };
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
let MATS = null;
export function tbMats() {
  if (MATS) return MATS;
  const m = (tex, color, o = {}) => std(tex ? { map: tex, ...o } : { color, ...o });
  MATS = {
    wallW: m(washTex(TB.white, '#d6cfbd', '#fbf8f0'), TB.white), wallR: m(washTex(TB.red, '#6e1f18', '#a1372d', 8), TB.red), wallY: m(washTex(TB.yellow, '#b88a2c', '#e2b858', 9), TB.yellow),
    wallLY: m(washTex(TB.lyellow, '#cdbd88', '#f2e7c0', 10), TB.lyellow), wallS: m(stoneTex(), TB.stone), chorten: m(washTex(TB.chorten, '#ddd8cb', '#ffffff', 12), TB.chorten),
    penbey: m(penbeyTex(TB.penbey), TB.penbey, { roughness: 1 }), penbeyD: m(penbeyTex(TB.penbeyD), TB.penbeyD, { roughness: 1 }),
    parBR: std({ color: TB.parBR }), parBlk: std({ color: TB.parBlk }), coping: std({ color: '#4a4038' }), black: std({ color: TB.black, roughness: 0.7 }), dark: std({ color: '#120e0c' }),
    win: m(winTex(), TB.wood), winS: m(winTex(TB.wood, '#241a16', 2, 3), TB.wood), winG: m(glassTex(), TB.wood, { roughness: 0.4 }), gridW: m(winTex(TB.grid, '#1c1411', 4, 4), TB.grid), gridF: std({ color: TB.grid }),
    lintel: m(lintelTex(), TB.red2), shambu: m(shambuTex(), TB.shambuR, { roughness: 1 }), yak: m(yakTex(), TB.yak, { roughness: 1 }),
    col: std({ color: TB.wood, roughness: 0.6 }), capT: m(capTex(), TB.blue), beamT: m(beamTex(false), TB.red2), door: m(doorTex(), TB.wood),
    arga: m(argaTex(), TB.arga), floor: std({ color: '#6b4a32' }), wood: std({ color: TB.brown }),
    gold: std({ color: TB.gold, roughness: 0.32, metalness: 0.75 }), flag: m(flagTex(), '#c3302a', { roughness: 1, side: THREE.DoubleSide }), mani: m(maniTex(), TB.red2, { roughness: 0.5 }),
    mandala: m(mandalaTex(), TB.blue), shelf: m(shelfTex(), '#3b2416'), grass: std({ color: TB.grass, roughness: 1 }), water: std({ color: '#4d7a74', roughness: 0.2 }),
    // khoá dùng chung với bộ dựng Trung Hoa (cnRoof / cnPavilion / dougongRow / balustrade / column)
    stone: m(stoneTex(), TB.stone), marble: std({ color: TB.rail, roughness: 0.7 }), beam: m(beamTex(false), TB.red2), beam2: m(beamTex(true), TB.green),
    dougong: std({ color: TB.green, roughness: 0.7 }), dougongB: std({ color: TB.blue, roughness: 0.7 }), plaster: std({ color: '#9b2b1f' }), paper: std({ color: '#efe6cf' }), brick: std({ color: TB.white }),
    tileGold: std({ color: TB.roofGold, roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide }), ribGold: std({ color: '#b8932f', roughness: 0.3, metalness: 0.7 }), ridgeGold: std({ color: TB.gold, roughness: 0.3, metalness: 0.75 }),
    tileDull: std({ color: TB.dull, roughness: 0.55, metalness: 0.4, side: THREE.DoubleSide }), ribDull: std({ color: '#93782f', roughness: 0.55, metalness: 0.4 }), ridgeDull: std({ color: '#8d7430', roughness: 0.55, metalness: 0.4 }),
  };
  return MATS;
}

// ---------------------------------------------------------------- hình học cơ sở
function triGeo(pos) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g; }
/** UV theo toạ độ thế giới (chiếu theo trục pháp tuyến trội) — texture tường lặp đúng tỉ lệ trên mọi khối */
function worldUV(geo, unit) {
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    n.subVectors(c, b).cross(new THREE.Vector3().subVectors(a, b)); const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let j = 0; j < 3; j++) { const x = p.getX(i + j), y = p.getY(i + j), z = p.getZ(i + j); const [u, v] = ay >= ax && ay >= az ? [x, z] : ax >= az ? [z, y] : [x, y]; uv[(i + j) * 2] = u / unit; uv[(i + j) * 2 + 1] = v / unit; }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo;
}
/** thêm vào acc; khoá tường được gán UV toạ độ thế giới */
function put(acc, key, geo) { if (!geo) return; if (geo.index) geo = geo.toNonIndexed(); if (UNIT[key]) worldUV(geo, UNIT[key]); acc.add(key, geo); return geo; }
/** khối 6 mặt từ 8 đỉnh (4 đáy rồi 4 đỉnh, cùng thứ tự vòng) — tự lật chiều cho pháp tuyến ra ngoài; mặt phẳng → kín */
function hexa(p) {
  const pos = [];
  for (const [a, b, c, d] of [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]) pos.push(...p[a], ...p[b], ...p[c], ...p[a], ...p[c], ...p[d]);
  let vol = 0; for (let i = 0; i < pos.length; i += 9) { const [ax, ay, az, bx, by, bz, cx, cy, cz] = pos.slice(i, i + 9); vol += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx); }
  if (vol < 0) for (let i = 0; i < pos.length; i += 9) for (let j = 0; j < 3; j++) { const t = pos[i + 3 + j]; pos[i + 3 + j] = pos[i + 6 + j]; pos[i + 6 + j] = t; }
  return triGeo(pos);
}
/** khối cụt chữ nhật (tường nghiêng đặc): đáy w0 × d0 tại y0, đỉnh thu vào ix / iz mỗi bên */
function frustum(w0, d0, y0, h, ix, iz, x = 0, z = 0) {
  const q = (w, d, y) => [[x - w / 2, y, z - d / 2], [x + w / 2, y, z - d / 2], [x + w / 2, y, z + d / 2], [x - w / 2, y, z + d / 2]];
  return hexa([...q(w0, d0, y0), ...q(w0 - 2 * ix, d0 - 2 * iz, y0 + h)]);
}
/** hộp tâm (x, y, z) với UV kéo theo kích thước (texture lặp đúng bề ngang: uw m mỗi lặp) */
function bxT(w, h, d, x, y, z, uw = 1, vh = 0, ry = 0) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) { const f = Math.floor(i / 4); const su = f < 2 ? d / uw : w / uw, sv = vh ? (f === 2 || f === 3 ? d / vh : h / vh) : 1; uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); }
  if (ry) g.rotateY(ry); g.translate(x, y, z); return g;
}
const xf = (g, M) => g.applyMatrix4(M);
/** chép mọi phần (và mặt đi được) của acc con vào acc cha qua phép đặt (x, z, ry) */
function mergeInto(dst, src, x = 0, z = 0, ry = 0, y = 0) {
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
  for (const [k, list] of src.parts) for (const g of list) dst.add(k, g.clone().applyMatrix4(m));
  const c = Math.cos(ry), s = Math.sin(ry);
  for (const q of src.plats || []) dst.plat({ ...q, x: x + c * q.x + s * q.z, z: z - s * q.x + c * q.z, ry: (q.ry || 0) + ry, top: q.top + y });
}
function bbox(acc) { const b = new THREE.Box3(); for (const l of acc.parts.values()) for (const g of l) { g.computeBoundingBox(); b.union(g.boundingBox); } return b; }
const r2 = (v) => Math.round(v * 100) / 100;
/** khối tròn xoay KÍN (thêm nắp đáy / đỉnh ở trục) — mặt cắt bản vẽ cần khối kín */
function latheC(prof, x, y, z, seg) { const p = prof.slice(); if (p[0][0] > 0.002) p.unshift([0.001, p[0][1]]); if (p[p.length - 1][0] > 0.002) p.push([0.001, p[p.length - 1][1]]); return latheOpen(p, x, y, z, seg); }

// ---------------------------------------------------------------- khung mặt tường nghiêng
/**
 * Khung một khối chữ nhật có tường nghiêng: W × D là mặt NGOÀI tại cao yRef, thu k (m / m) mỗi bên.
 * Mặt f: 0 trước (+z), 1 phải (+x), 2 sau (−z), 3 trái (−x). Toạ độ mặt: u dọc mặt (trái → phải khi nhìn từ ngoài), n pháp tuyến ra ngoài.
 */
export function frame({ W, D, yRef = 0, k = 0, cx = 0, cz = 0 }) {
  const A = (f) => (f % 2 ? D : W) / 2, N0 = (f) => (f % 2 ? W : D) / 2, nOut = (f, y) => N0(f) - k * (y - yRef);
  const ang = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  const P = (f, u, n, y) => (f === 0 ? [cx + u, y, cz + n] : f === 1 ? [cx + n, y, cz - u] : f === 2 ? [cx - u, y, cz - n] : [cx - n, y, cz + u]);
  const len = (f, y) => 2 * (A(f) - k * (y - yRef));
  /** ma trận đặt chi tiết trên mặt f tại (u, y), nhô dn khỏi mặt ngoài, nghiêng theo tường */
  const M = (f, u, y, dn = 0, tilt = true) => {
    const [x, , z] = P(f, u, nOut(f, y) + dn, y), m = new THREE.Matrix4().makeTranslation(x, y, z);
    m.multiply(new THREE.Matrix4().makeRotationY(ang[f])); if (tilt && k) m.multiply(new THREE.Matrix4().makeRotationX(-Math.atan(k))); return m;
  };
  const dims = (y) => [W - 2 * k * (y - yRef), D - 2 * k * (y - yRef)];
  const grow = (e) => frame({ W: W + 2 * e, D: D + 2 * e, yRef, k, cx, cz });
  return { W, D, yRef, k, cx, cz, A, N0, nOut, P, len, M, ang, dims, grow };
}
/** một đoạn tường mặt f từ ua → ub (đầu mA / mB: cắt vát 45° ở góc), y0 → y1, dày T tại chân (mặt trong đứng) */
function wseg(acc, key, F, f, ua, ub, mA, mB, y0, y1, T, par = false) {
  const A = F.A(f), N0 = F.N0(f), um = (n) => A - (N0 - n), pts = [];
  for (const y of [y0, y1]) {
    const no = F.nOut(f, y), nIn = par ? no - T : F.nOut(f, y0) - T;
    pts.push(F.P(f, mA ? -um(no) : ua, no, y), F.P(f, mB ? um(no) : ub, no, y), F.P(f, mB ? um(nIn) : ub, nIn, y), F.P(f, mA ? -um(nIn) : ua, nIn, y));
  }
  put(acc, key, hexa(pts));
}
/**
 * vòng 4 tường có lỗ mở: open = [{ f, u0, u1, y0, y1 }] (cửa, lối cổng). par: mặt trong song song mặt ngoài (vỏ dày đều).
 * Lỗ mở sát chân dải: tách phần dưới (hai bên cửa) và một khối liền phía trên — mạch nối chỉ là một đường ngang ở đỉnh cửa.
 */
export function wring(acc, key, F, y0, y1, T, open = [], par = false) {
  for (let f = 0; f < 4; f++) {
    const os = open.filter((o) => o.f === f && o.y0 < y1 - 0.01 && o.y1 > y0 + 0.01).sort((a, b) => a.u0 - b.u0);
    const split = (ya, yb, list) => {
      let u = null;
      for (const o of list) {
        wseg(acc, key, F, f, u ?? 0, o.u0, u === null, false, ya, yb, T, par);
        if (o.y0 > ya + 0.01) wseg(acc, key, F, f, o.u0, o.u1, false, false, ya, Math.min(o.y0, yb), T, par);
        if (o.y1 < yb - 0.01) wseg(acc, key, F, f, o.u0, o.u1, false, false, Math.max(o.y1, ya), yb, T, par);
        u = o.u1;
      }
      wseg(acc, key, F, f, u ?? 0, 0, u === null, true, ya, yb, T, par);
    };
    const low = os.filter((o) => o.y0 <= y0 + 0.01);
    if (low.length && low.length === os.length) {
      const yc = Math.min(y1, Math.max(...low.map((o) => o.y1)));
      split(y0, yc, low);
      if (yc < y1 - 0.01) wseg(acc, key, F, f, 0, 0, true, true, yc, y1, T, par);
    } else split(y0, y1, os);
  }
}

// ---------------------------------------------------------------- cấu kiện nhận diện
/**
 * CỬA SỔ Tây Tạng trong khung cục bộ (ô cửa w × h, đáy y = 0, mặt tường z = 0, ra ngoài +z) rồi đặt bằng ma trận M:
 *  viền đen hình thang (hẹp trên rộng dưới, có «sừng» tuỳ chọn) dày 0,18 · ô cửa gỗ lùi sâu 0,11 · lanh tô 1–2 lớp rui nhỏ nhô
 *  (三椽三盖) · rèm shambu. kind: 'std' | 'slit' (khe sáng tường đá) | 'rabsel' (cửa sổ lồi gỗ) | 'glass' (Nhật Quang điện)
 */
export function tbWindow(acc, M, { w, h, kind = 'std', horns = false, layers = 1, curtain = true, pane = 'win' }) {
  const add = (key, g) => acc.add(key, xf(g, M));
  const slit = kind === 'slit', bb = slit ? 0.12 + 0.15 * w : 0.2 * w + 0.12, bt = slit ? 0.05 : 0.06 * w + 0.05, sb = slit ? 0.12 : 0.2 * h + 0.06, top = h + 0.06;
  let outer = [[-w / 2 - bb, -sb], [w / 2 + bb, -sb], [w / 2 + bt, top], [-w / 2 - bt, top]];
  if (horns) outer = [[-w / 2 - bb, -sb], [w / 2 + bb, -sb], [w / 2 + bt, top - 0.05], [w / 2 + bt + 0.17, top + 0.17], [w / 2 + bt - 0.06, top], [-w / 2 - bt + 0.06, top], [-w / 2 - bt - 0.17, top + 0.17], [-w / 2 - bt, top - 0.05]];
  const sh = new THREE.Shape(outer.map(([a, b]) => new THREE.Vector2(a, b)));
  sh.holes.push(new THREE.Path([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]].map(([a, b]) => new THREE.Vector2(a, b))));
  const fr = new THREE.ExtrudeGeometry(sh, { depth: 0.18, bevelEnabled: false }); fr.translate(0, 0, -0.04); add('black', fr);
  if (kind === 'rabsel') { // cửa sổ lồi gỗ nhô 0,75 m: đáy, công-xôn, má, mặt song, mái nhỏ
    const p = 0.75;
    add('col', box(w + 0.5, 0.16, p + 0.1, 0, -0.08, p / 2)); for (const s of [-1, 1]) { add('col', slabXY([[0, 0], [0, -0.55], [0.18, -0.55], [p, -0.05], [p, 0]], 0.14, s * (w / 2 - 0.05), 0, 0, -Math.PI / 2)); }
    for (const s of [-1, 1]) add('col', box(0.14, h, p, s * (w / 2 + 0.18), h / 2, p / 2));
    add('win', box(w + 0.24, h, 0.07, 0, h / 2, p - 0.02));
    add('col', box(w + 0.6, 0.1, p + 0.3, 0, h + 0.1, p / 2 + 0.05)); add('lintel', bxT(w + 0.7, 0.16, p + 0.42, 0, h + 0.23, p / 2 + 0.1, 0.8)); add('black', box(w + 0.84, 0.08, p + 0.55, 0, h + 0.35, p / 2 + 0.14));
    if (curtain) add('shambu', bxT(w + 0.3, Math.min(0.45, h * 0.24), 0.04, 0, h - Math.min(0.45, h * 0.24) / 2 + 0.02, p + 0.12, 0.4));
    return;
  }
  add(slit ? 'dark' : kind === 'glass' ? 'winG' : pane, box(w, h, 0.08, 0, h / 2, 0.03));
  if (slit) { add('black', box(w + 0.24, 0.08, 0.22, 0, top + 0.04, 0.08)); return; }
  // lanh tô: ván đỏ → hàng đầu rui → ván đen; lớp 2: thêm một hàng rui + ván
  add('col', box(w + 0.34, 0.1, 0.34, 0, top + 0.05, 0.13)); add('lintel', bxT(w + 0.48, 0.16, 0.48, 0, top + 0.18, 0.2, 0.8)); add('black', box(w + 0.62, 0.08, 0.6, 0, top + 0.3, 0.26));
  if (layers > 1) { add('lintel', bxT(w + 0.76, 0.14, 0.72, 0, top + 0.41, 0.32, 0.8)); add('black', box(w + 0.9, 0.08, 0.84, 0, top + 0.52, 0.38)); }
  if (curtain) { const ch = Math.min(0.5, 0.26 * h + 0.08); add('shambu', bxT(w + 0.26, ch, 0.04, 0, top - ch / 2, 0.33, 0.4)); }
}
/** CỬA RA VÀO (lỗ mở do tường cắt sẵn): viền đen hình thang hai má, khung gỗ, lanh tô 2 lớp, rèm shambu lớn, cánh cửa mở vào trong */
export function tbDoor(acc, M, w, h, { closed = false, depth = 1.2 } = {}) {
  const add = (key, g) => acc.add(key, xf(g, M));
  for (const s of [-1, 1]) { add('black', slabXY([[0, 0], [0.62, 0], [0.3, h + 0.12], [0, h + 0.12]].map(([a, b]) => [s * (w / 2 + a), b]), 0.16, 0, 0, 0.03)); add('col', box(0.2, h + 0.1, 0.22, s * (w / 2 + 0.1), (h + 0.1) / 2, 0.08)); }
  add('lintel', bxT(w + 0.4, 0.26, 0.24, 0, h + 0.2, 0.1, 0.8));
  add('col', box(w + 0.9, 0.12, 0.5, 0, h + 0.39, 0.2)); add('lintel', bxT(w + 1.1, 0.2, 0.7, 0, h + 0.55, 0.3, 0.8)); add('black', box(w + 1.3, 0.1, 0.9, 0, h + 0.7, 0.4));
  add('lintel', bxT(w + 1.5, 0.18, 1.05, 0, h + 0.84, 0.48, 0.8)); add('black', box(w + 1.7, 0.1, 1.2, 0, h + 0.98, 0.56));
  add('shambu', bxT(w + 0.5, 0.62, 0.05, 0, h + 0.02 - 0.31, 0.42, 0.4));
  if (closed) for (const s of [-1, 1]) add('door', box(w / 2 - 0.02, h, 0.12, s * w / 4, h / 2, -0.35));
  else for (const s of [-1, 1]) add('door', box(0.1, h - 0.05, Math.min(w / 2, depth), s * (w / 2 - 0.07), (h - 0.05) / 2, -0.1 - Math.min(w / 2, depth) / 2));
}
/** CỘT trong nhà / hiên: thân vuông vát cạnh, đấu vuông bo-gyab, đà cung gzhu chạm sơn (dir 0: đà theo x, 1: theo z) */
export function tbColumn(acc, x, z, y0, h, d = 0.36, dir = 0) {
  const g = new THREE.CylinderGeometry(d * 0.6, d * 0.64, h - 0.6, 8); g.rotateY(Math.PI / 8); g.translate(x, y0 + (h - 0.6) / 2, z); acc.add('col', g);
  acc.add('stone', boxB(d * 1.5, 0.12, d * 1.5, x, y0, z));
  acc.add('capT', boxB(d * 1.4, 0.2, d * 1.4, x, y0 + h - 0.6, z));
  const L = d * 5.4, pts = [[-L / 2, 0.4], [L / 2, 0.4], [L / 2, 0.27], [L * 0.38, 0.22], [L * 0.32, 0.12], [L * 0.16, 0.07], [d * 0.62, 0], [-d * 0.62, 0], [-L * 0.16, 0.07], [-L * 0.32, 0.12], [-L * 0.38, 0.22], [-L / 2, 0.27]];
  const b = slabXY(pts, d * 0.85, 0, 0, 0); if (dir) b.rotateY(Math.PI / 2); b.translate(x, y0 + h - 0.4, z); acc.add('capT', b);
}
/** GYALTSEN — ống cờ chiến thắng đồng mạ vàng (03 › A3.10): thân trụ nhiều tầng diềm, lọng, búp đỉnh */
const GY = [[0.06, 0], [0.08, 0.25], [0.06, 0.3], [0.22, 0.34], [0.26, 0.42], [0.24, 0.86], [0.31, 0.9], [0.31, 0.96], [0.22, 0.99], [0.22, 1.24], [0.29, 1.28], [0.29, 1.33], [0.16, 1.37], [0.32, 1.45], [0.12, 1.6], [0.05, 1.62], [0.09, 1.72], [0.03, 1.8], [0.001, 2.0]];
export function gyaltsen(acc, x, y, z, s = 1) { acc.add('gold', latheC(GY.map(([r, h]) => [r * s, h * s]), x, y, z, 8)); }
/** cờ chiến thắng khung đồng phủ lụa đen, đỉnh đinh ba vàng (Potala — 03 › A3.10) */
export function blackBanner(acc, x, y, z, s = 1) {
  acc.add('yak', latheC([[0.05, 0], [0.05, 0.3], [0.3, 0.34], [0.34, 0.8], [0.32, 1.25], [0.2, 1.32], [0.001, 1.33]].map(([r, h]) => [r * s, h * s]), x, y, z, 8));
  acc.add('gold', latheC([[0.22, 1.3], [0.24, 1.38], [0.05, 1.44], [0.04, 1.75], [0.001, 1.76]].map(([r, h]) => [r * s, h * s]), x, y, z, 8));
  acc.add('gold', box(0.36 * s, 0.04 * s, 0.04 * s, x, y + 1.72 * s, z)); for (const t of [-1, 0, 1]) acc.add('gold', boxB(0.04 * s, (t ? 0.22 : 0.3) * s, 0.04 * s, x + t * 0.17 * s, y + 1.72 * s, z));
}
/** BÌNH BÁU (bumpa) trên nóc mái vàng */
export function bumpa(acc, x, y, z, s = 1) { acc.add('gold', latheC([[0.42, 0], [0.32, 0.12], [0.26, 0.2], [0.44, 0.42], [0.46, 0.6], [0.3, 0.82], [0.12, 0.9], [0.15, 1.0], [0.07, 1.1], [0.11, 1.25], [0.001, 1.55]].map(([r, h]) => [r * s, h * s]), x, y, z, 10)); }
/** cành cờ cầu nguyện ở góc mái nhà dân (03 › sholhouse §5.4) */
export function flagTwig(acc, x, y, z, s = 1) {
  acc.add('wood', cyl(0.05, 0.04, 2.2 * s, x, y, z, 6)); acc.add('flag', bxT(0.5 * s, 0.9 * s, 0.03, x + 0.27 * s, y + 1.65 * s, z, 0.5));
  acc.add('flag', bxT(0.45 * s, 0.7 * s, 0.03, x, y + 1.45 * s, z + 0.26 * s, 0.5, 0, Math.PI / 2)); acc.add('wood', latheC([[0.16, 0], [0.22, 0.25], [0.001, 0.5]].map(([r, h]) => [r * s, h * s]), x, y + 2.2 * s, z, 6));
}
/** dây cờ cầu nguyện căng giữa hai điểm (dải ô vải 5 màu) */
export function flagLine(acc, a, b, n = 0) {
  const L = a.distanceTo(b), m = n || Math.max(3, Math.round(L / 0.55)), sag = L * 0.06;
  for (let i = 0; i < m; i++) {
    const t = (i + 0.5) / m, p = a.clone().lerp(b, t); p.y -= sag * 4 * t * (1 - t);
    const g = bxT(0.36, 0.42, 0.02, 0, -0.21, 0, 0.36 * 5); g.rotateY(Math.atan2(b.x - a.x, b.z - a.z) + Math.PI / 2); g.translate(p.x, p.y, p.z);
    // chỉ dùng 1/5 ô texture mỗi lá: dời u theo i
    const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) + (i % 5) * 0.2); acc.add('flag', g);
  }
  acc.add('wood', beam(a, b, 0.02, 0.02));
}
/** PHÁP LUÂN + ĐÔI NAI (祥麟法轮) trong khung cục bộ (đáy tại 0, mặt +z); s ≈ cao / 2,2 m */
export function wheelDeer(acc, M, s = 1, deer = true) {
  const add = (key, g) => acc.add(key, xf(g, M)), R = 0.62 * s, cy = 0.52 * s + R;
  const ring = new THREE.Shape(); ring.absarc(0, 0, R, 0, Math.PI * 2, false); const hole = new THREE.Path(); hole.absarc(0, 0, R * 0.8, 0, Math.PI * 2, true); ring.holes.push(hole);
  const rg = new THREE.ExtrudeGeometry(ring, { depth: 0.14 * s, bevelEnabled: false, curveSegments: 16 }); rg.translate(0, cy, 0.05); add('gold', rg);
  for (let i = 0; i < 8; i++) { const g = box(0.07 * s, R * 1.6, 0.1 * s, 0, 0, 0); g.rotateZ((i * Math.PI) / 8); g.translate(0, cy, 0.12 * s); add('gold', g); }
  const hub = new THREE.CylinderGeometry(0.18 * R, 0.18 * R, 0.22 * s, 12); hub.rotateX(Math.PI / 2); hub.translate(0, cy, 0.12 * s); add('gold', hub);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, g = box(0.1 * s, 0.22 * s, 0.1 * s, 0, 0, 0); g.rotateZ(a); g.translate(Math.sin(a) * R * 1.08, cy + Math.cos(a) * R * 1.08, 0.1 * s); add('gold', g); } // tia lửa vành
  add('gold', slabXY(Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (i / 12); return [Math.cos(a) * R * 0.95, Math.sin(a) * 0.5 * s]; }), 0.2 * s, 0, 0, 0.1 * s)); // đài sen
  if (deer) { // nai nằm, ngẩng đầu nhìn pháp luân
    const pts = [[0, 0], [0.95, 0], [1.02, 0.18], [0.92, 0.32], [0.86, 0.5], [0.98, 0.72], [1.1, 0.92], [1.12, 1.05], [1.0, 1.0], [0.93, 1.12], [0.86, 0.98], [0.78, 0.78], [0.66, 0.5], [0.3, 0.46], [0.08, 0.4], [-0.06, 0.24]];
    for (const sd of [-1, 1]) add('gold', slabXY(pts.map(([a, b]) => [sd * (R + 0.15 * s + (1.15 - a) * 0.75 * s), b * 0.75 * s]), 0.16 * s, 0, 0, 0.08 * s));
  }
}
/** đĩa đồng mạ vàng («gương») gắn trên penbey */
function medallion(acc, M, r) { const g = new THREE.CylinderGeometry(r, r, 0.08, 14); g.rotateX(Math.PI / 2); g.translate(0, 0, 0.06); acc.add('gold', xf(g, M)); const b = new THREE.CylinderGeometry(r * 0.45, r * 0.55, 0.14, 10); b.rotateX(Math.PI / 2); b.translate(0, 0, 0.1); acc.add('gold', xf(b.clone(), M)); }

/** DẢI PENBEY quanh khối: penbey nâu đỏ (y0 → y1) + hàng đầu xà dưới + dải trắng trên + đĩa vàng mỗi `gold` m (03 › A1, A5.4) */
export function penbeyBand(acc, F, y0, y1, { gold = 2.6, T = 0.7, key = 'penbey', wheel = 0, skip = [], beamEnds = true, open = [] } = {}) {
  wring(acc, key, F.grow(0.05), y0, y1, T, open.map((o) => ({ ...o, y0: y0 - 1 })));
  if (beamEnds) for (let f = 0; f < 4; f++) acc.add('lintel', xf(bxT(F.len(f, y0) + 0.2, 0.2, 0.26, 0, -0.12, 0.05, 0.8), F.M(f, 0, y0, 0)));
  wring(acc, 'wallW', F.grow(0.03), y1, y1 + 0.16, Math.min(T, 0.5), open.map((o) => ({ ...o, y0: y0 - 1 })));
  if (gold) for (let f = 0; f < 4; f++) {
    const L = F.len(f, (y0 + y1) / 2) - 2, n = Math.max(1, Math.floor(L / gold)), r = Math.min(0.42, (y1 - y0) * 0.2);
    for (let i = 0; i <= n; i++) { const u = -L / 2 + (L * i) / n; if (f === 0 && wheel && Math.abs(u) < wheel * 1.6) continue; if (skip.some(([sf, a, b]) => sf === f && u > a && u < b)) continue; medallion(acc, F.M(f, u, (y0 + y1) / 2, 0.05), r); }
  }
  if (wheel) wheelDeer(acc, F.M(0, 0, y0 + 0.15, 0.08), wheel);
}
/** khung đặt cửa sổ hàng theo mặt: trả các u (cách đều step, chừa lề và vùng bỏ) */
function rowUs(len, step, margin, f, skip, w, pair = 0) {
  const L = len - 2 * margin; if (L < 0) return [];
  const n = Math.max(0, Math.floor(L / step)), us = []; for (let i = 0; i <= n; i++) { const u = n ? -L / 2 + (L * i) / n : 0; if (pair) us.push(u - pair / 2, u + pair / 2); else us.push(u); }
  return us.filter((u) => !skip.some(([sf, a, b]) => sf === f && u + w / 2 + 0.3 > a && u - w / 2 - 0.3 < b));
}

// ---------------------------------------------------------------- bậc thang
/** bậc đá thẳng từ đất lên h theo hướng dir (+1: đi ra +z), đặt tại cx, mép trên ở z0; má bậc (flank) tường xây có mặt trên dốc */
export function stoneStair(acc, { cx = 0, z0, w, h, rise = 0.16, tread = 0.32, dir = 1, key = 'stone', flank = null, ft = 0.9, along = 'z', guard = 0.9 }) {
  const n = Math.max(2, Math.round(h / rise)), rr = h / n, run = n * tread;
  for (let i = 1; i <= n; i++) {
    const c = z0 + dir * (run - (i - 0.5) * tread);
    if (along === 'z') { acc.add(key, boxB(w, rr * i, tread, cx, 0, c)); acc.plat({ x: cx, z: c, w, d: tread + 0.02, top: rr * i }); }
    else { acc.add(key, boxB(tread, rr * i, w, c, 0, cx)); acc.plat({ x: c, z: cx, w: tread + 0.02, d: w, top: rr * i }); }
  }
  if (flank) for (const s of [-1, 1]) {
    const x0 = cx + s * (w / 2), x1 = cx + s * (w / 2 + ft), zA = z0 - dir * 0.3, zB = z0 + dir * run;
    const P = (x, y, z) => (along === 'z' ? [x, y, z] : [z, y, x]);
    put(acc, flank, hexa([P(x0, 0, zA), P(x1, 0, zA), P(x1, 0, zB), P(x0, 0, zB), P(x0, h + guard, zA), P(x1, h + guard, zA), P(x1, guard * 0.5, zB), P(x0, guard * 0.5, zB)]));
    acc.add('coping', beam(V(...P((x0 + x1) / 2, h + guard + 0.08, zA)), V(...P((x0 + x1) / 2, guard * 0.5 + 0.08, zB)), ft + 0.16, 0.16));
  }
  return run;
}
/** cầu thang men theo mặt tường (dốc ngoài tường — Potala): chạy dọc trục x từ xa (cao 0 + y0) tới xb (cao y0 + h), tại z = zc; lan can trắng phía ngoài */
function wallStair(acc, { xa, xb, zc, w, y0 = 0, h, out = 1, rise = 0.2 }) {
  const n = Math.max(2, Math.round(h / rise)), rr = h / n, dir = Math.sign(xb - xa), tread = Math.abs(xb - xa) / n;
  for (let i = 1; i <= n; i++) { const x = xa + dir * (i - 0.5) * tread; acc.add('stone', boxB(tread, y0 + rr * i, w, x, 0, zc)); acc.plat({ x, z: zc, w: tread + 0.02, d: w, top: y0 + rr * i }); }
  // tường lan can trắng nghiêng phía ngoài (mặt trên dốc theo bậc)
  const zo = zc + out * (w / 2 + 0.3), zi = zo - out * 0.6, g = 0.9;
  put(acc, 'wallW', hexa([[xa, 0, zi], [xb, 0, zi], [xb, 0, zo + out * 0.15], [xa, 0, zo + out * 0.15], [xa, y0 + g, zi], [xb, y0 + h + g, zi], [xb, y0 + h + g, zo], [xa, y0 + g, zo]]));
  acc.add('parBR', beam(V(xa, y0 + g + 0.08, zo - out * 0.3), V(xb, y0 + h + g + 0.08, zo - out * 0.3), 0.75, 0.16));
}

// ---------------------------------------------------------------- MÁI VÀNG kiểu Hán (gyaphib) — trên mái bằng
/**
 * gyaphib: điện nhỏ mái yết sơn đơn diêm ngói đồng mạ vàng, đỡ bằng đấu củng sơn màu (03 › lau10 §3.6, summit §3).
 * o: { x, z, y (chân), W, D (lưới cột), colH, over, dk, walls: 'red'|'lattice'|'none', gy (gyaltsen góc), hex (lục giác: a = apothem) }
 */
export function gyaphib(dst, o) {
  const acc = new Acc(), colH = o.colH ?? 2.2, dk = o.dk ?? 0.05, y0 = 0.3;
  if (o.hex) { // lục giác: vòng 6 cột, vách, đấu củng, mái chóp 6 cạnh, búp đỉnh
    const n = 6, a = o.hex, R = a / Math.cos(Math.PI / n), vert = (rr, k) => { const t = (2 * Math.PI * k) / n + Math.PI / n; return [Math.cos(t) * rr, Math.sin(t) * rr]; };
    const base = new THREE.CylinderGeometry(R + 0.5, R + 0.6, y0, n); base.rotateY(Math.PI / n + Math.PI / 2); base.translate(0, y0 / 2, 0); acc.add('stone', base);
    for (let k = 0; k < n; k++) { const [x, z] = vert(R, k); cnColumn(acc, x, z, y0, colH, 0.3); const [ax, az] = vert(R, k - 1), mx = (ax + x) / 2, mz = (az + z) / 2, L = Math.hypot(x - ax, z - az), ry = Math.atan2(x - ax, z - az) + Math.PI / 2;
      acc.add(o.walls === 'lattice' ? 'win' : 'wallR', box(L - 0.3, colH - 0.5, 0.14, mx * 0.97, y0 + (colH - 0.5) / 2, mz * 0.97, ry)); acc.add(k % 2 ? 'beam' : 'beam2', box(L, 0.36, 0.3, mx, y0 + colH - 0.2, mz, ry));
      dougongRow(acc, ax, az, x, z, y0 + colH, mx / Math.hypot(mx, mz), mz / Math.hypot(mx, mz), dk, 11 * dk * 1.4, k); }
    const ae = a + (o.over ?? 1.2), yE = y0 + colH + 10.6 * dk + 0.25, prof = roofProfile(ae, [[o.over ?? 1.2, 0.3], 0.62, 0.95], 0, 12);
    const r = polyRoof({ n, ae, yE: yE - 0.25, prof, lift: 0.45, rot: 0, rib: 0.32, ribW: 0.12 });
    acc.add('tileGold', r.tiles); if (r.ribs) acc.add('ribGold', r.ribs); acc.add('ridgeGold', r.eaveEdge); for (const p of r.ridges) acc.add('ridgeGold', ridgeGeo(p, 0.22, 0.22));
    for (let k = 0; k < n; k++) { const [x, z] = vert(R * (ae / a) / Math.cos(0), k); acc.add('gold', cyl(0.08, 0.03, 0.5, x * 0.98, yE - 0.75, z * 0.98, 6)); }
    gyaltsen(acc, 0, r.top - 0.15, 0, 1.0 * (o.s ?? 1));
    mergeInto(dst, acc, o.x || 0, o.z || 0, o.ry || 0, o.y || 0); return { top: (o.y || 0) + r.top + 2 };
  }
  const W = o.W, D = o.D, over = o.over ?? 1.2;
  acc.add('stone', boxB(W + 0.8, y0, D + 0.8, 0, 0, 0));
  if (o.walls !== 'none') acc.add(o.walls === 'lattice' ? 'win' : 'wallR', boxB(W - 0.5, colH - 0.45, D - 0.5, 0, y0, 0));
  if (o.walls !== 'lattice' && o.walls !== 'none') { acc.add('gold', boxB(1.1, 1.7, 0.08, 0, y0, D / 2 - 0.22)); acc.add('black', boxB(1.5, 1.95, 0.05, 0, y0, D / 2 - 0.26)); }
  const nx = o.noCols ? -1 : Math.max(1, Math.round(W / 2.2)), nz = o.noCols ? 0 : Math.max(1, Math.round(D / 2.2));
  for (let i = 0; i <= nx; i++) for (const sz of [-1, 1]) cnColumn(acc, -W / 2 + (W * i) / nx, sz * D / 2, y0, colH, 0.3);
  for (let j = 1; j < nz; j++) for (const sx of [-1, 1]) cnColumn(acc, sx * W / 2, -D / 2 + (D * j) / nz, y0, colH, 0.3);
  if (!o.noCols) { for (const sz of [-1, 1]) acc.add(sz > 0 ? 'beam' : 'beam2', boxB(W + 0.3, 0.36, 0.3, 0, y0 + colH - 0.36, sz * D / 2));
    for (const sx of [-1, 1]) acc.add('beam2', boxB(0.3, 0.36, D + 0.3, sx * W / 2, y0 + colH - 0.36, 0)); }
  else acc.add('beam', boxB(W + 0.3, colH, D + 0.3, 0, y0, 0));
  const ring = [[-W / 2, D / 2, W / 2, D / 2, 0, 1], [-W / 2, -D / 2, W / 2, -D / 2, 0, -1], [-W / 2, -D / 2, -W / 2, D / 2, -1, 0], [W / 2, -D / 2, W / 2, D / 2, 1, 0]];
  for (const [ax, az, bx, bz, nxx, nzz] of ring) { acc.add('col', boxB(Math.abs(bx - ax) + 0.32, 0.16, Math.abs(bz - az) + 0.32, (ax + bx) / 2, y0 + colH, (az + bz) / 2)); dougongRow(acc, ax, az, bx, bz, y0 + colH + 0.16, nxx, nzz, dk, 11 * dk * 1.3); }
  const yCol = y0 + colH + 0.16 + 10.6 * dk + 0.2;
  const rs = cnRoof(acc, { W, D, yCol, over, roof: { type: 'xieshan', tile: 'Gold', ridgeH: o.ridgeH ?? 0.5, lift: 0.45, fly: 0.22 }, wallT: 0.4 });
  const rr = rs[0]; bumpa(acc, 0, rr.top + (o.ridgeH ?? 0.5) - 0.12, 0, Math.min(1.3, W / 6));
  if (o.gy !== false) for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const x = sx * (W / 2 + over - 0.25), z = sz * (D / 2 + over - 0.25); gyaltsen(acc, x, rr.Y(x, z, 0.25) + 0.12, z, 0.55); }
  mergeInto(dst, acc, o.x || 0, o.z || 0, o.ry || 0, o.y || 0);
  return { top: (o.y || 0) + rr.top + (o.ridgeH ?? 0.5) + 1.6 };
}

// ---------------------------------------------------------------- LOẠI HÌNH: KHỐI TƯỜNG NGHIÊNG (điện, nhà sân trong, dãy phòng, môn lâu…)
/**
 * spec: {
 *   W, D (mặt ngoài tại cao nền ph), k (thu), y0 (chân, 0), ph (cao sàn / mặt bệ), base: 'stone'|'white'|'red', baseSlits: [y…],
 *   H (cao thân: mặt mái arga tại ph + H), wall: khoá tường, Ttop / Tbot (dày tường đỉnh / chân), storeys: [cao sàn tuyệt đối…],
 *   parapet: { h, key, corners, flags, gyaltsen, banners }, penbey: { h, gold, wheel } (chỉ nhà tôn giáo / quý tộc),
 *   door: { w, h } (mặt trước, giữa) · passage: { w, h } (lối cổng xuyên trước–sau) · doors: [{ f, u, w, h }],
 *   rows: [{ y, w, h, kind, step, faces, horns, layers, skip }] cửa sổ · court: { w, d, g (hành lang gỗ), yG } sân trong,
 *   cols: { xs, zs, h } lưới cột trong · stair: { w, flank, key } bậc trước · cx, cz (dời tâm), acc
 * }
 */
export function tbBlock(s) {
  const acc = s.acc || new Acc(), k = s.k ?? 0.04, y0 = s.y0 ?? 0, ph = s.ph ?? 0.6, cx = s.cx || 0, cz = s.cz || 0;
  const W = s.W, D = s.D, yR = ph + s.H, para = s.parapet?.h ?? 0.9, yTop = yR + para, wallKey = s.wall || 'wallW';
  const F = frame({ W, D, yRef: ph, k, cx, cz });
  // --- bệ / chân tường đá (nghiêng liên tục cùng tường thân)
  if (ph > y0 + 0.05) {
    put(acc, s.base === 'white' ? 'wallW' : s.base === 'red' ? 'wallR' : 'wallS', frustum(W + 2 * k * (ph - y0), D + 2 * k * (ph - y0), y0, ph - y0, k * (ph - y0), k * (ph - y0), cx, cz));
    for (const y of s.baseSlits || []) for (let f = 0; f < 4; f++) for (const u of rowUs(F.len(f, y), s.slitStep || 3.2, 1.5, f, [[0, -(s.stair?.w || s.door?.w || 0) / 2 - 1.5, (s.stair?.w || s.door?.w || 0) / 2 + 1.5]], 0.5)) tbWindow(acc, F.M(f, u, y), { w: 0.42, h: 0.95, kind: 'slit' });
  }
  acc.plat({ x: cx, z: cz, w: W, d: D, top: ph });
  // --- tường thân: chia dải theo sàn (mặt trong đứng, lùi bậc mỗi sàn — tường dày chân, mỏng đỉnh)
  const open = [];
  if (s.door) open.push({ f: 0, u0: -s.door.w / 2, u1: s.door.w / 2, y0: ph - 1, y1: ph + s.door.h });
  if (s.passage) for (const f of [0, 2]) open.push({ f, u0: -s.passage.w / 2, u1: s.passage.w / 2, y0: y0 - 1, y1: y0 + s.passage.h });
  for (const d of s.doors || []) open.push({ f: d.f, u0: d.u - d.w / 2, u1: d.u + d.w / 2, y0: (d.y ?? ph) - 1, y1: (d.y ?? ph) + d.h });
  const gaps = (s.gaps || []).map((g) => ({ f: g.f, u0: g.u0, u1: g.u1, y0: yR - 0.02, y1: yTop + 3 }));
  open.push(...gaps);
  const ys = [s.passage ? y0 : ph, ...(s.storeys || []).filter((y) => y > ph + 0.5 && y < yR - 0.5), yR, yTop];
  const Tt = s.Ttop ?? 0.6, Tb = s.Tbot ?? Tt + 0.4;
  // vỏ ngoài dày đều Tt (một dải tới mái + một dải tường chắn) → mặt ngoài liền, không vạch tầng; lót trong theo từng sàn (mặt trong đứng)
  wring(acc, wallKey, F, ys[0], yR, Tt, open, true); wring(acc, wallKey, F, yR, yTop, Tt, open, true);
  const FL = F.grow(-Tt + 0.01);
  for (let i = 0; i < ys.length - 2; i++) { const tTop = Tt + (Tb - Tt) * (yTop - ys[i + 1]) / (yTop - ys[0]), extra = tTop + k * (ys[i + 1] - ys[i]) - Tt; if (extra > 0.06) wring(acc, wallKey, FL, ys[i], ys[i + 1], extra + 0.01, open); }
  // lối cổng xuyên khối (môn lâu): hai vách lối qua + trần
  if (s.passage) { const [, di] = F.dims(y0), dIn = di - 2 * Tb + 0.2; for (const sx of [-1, 1]) put(acc, wallKey, boxB(0.5, s.passage.h + 0.45, dIn, cx + sx * (s.passage.w / 2 + 0.25), y0, cz)); put(acc, 'floor', boxB(s.passage.w + 1.0, 0.4, dIn, cx, y0 + s.passage.h + 0.45, cz)); acc.add('beamT', boxB(s.passage.w, 0.3, dIn, cx, y0 + s.passage.h + 0.15, cz)); }
  // sàn trong + mái arga (khoét sân trong nếu có)
  const inner = (y, T) => { const [w, d] = F.dims(y); return [w - 2 * T, d - 2 * T]; };
  const slab = (y, t, key, T) => {
    const [wi, di] = inner(y, T);
    if (!s.court) { put(acc, key, boxB(wi, t, di, cx, y - t, cz)); return; }
    const cw = s.court.w - 2 * (s.court.ov || 0), cd = s.court.d - 2 * (s.court.ov || 0), ccx = cx + (s.court.x || 0), ccz = cz + (s.court.z || 0);
    put(acc, key, boxB(wi, t, (cz + di / 2) - (ccz + cd / 2), cx, y - t, ((cz + di / 2) + (ccz + cd / 2)) / 2)); put(acc, key, boxB(wi, t, (ccz - cd / 2) - (cz - di / 2), cx, y - t, ((ccz - cd / 2) + (cz - di / 2)) / 2));
    put(acc, key, boxB((ccx - cw / 2) - (cx - wi / 2), t, cd, ((ccx - cw / 2) + (cx - wi / 2)) / 2, y - t, ccz)); put(acc, key, boxB((cx + wi / 2) - (ccx + cw / 2), t, cd, ((cx + wi / 2) + (ccx + cw / 2)) / 2, y - t, ccz));
  };
  acc.add(s.court ? 'arga' : 'floor', boxB(...(() => { const [w, d] = inner(ph, 0.2); return [w, 0.04, d]; })(), cx, ph, cz));
  for (const y of (s.storeys || []).filter((y) => y > ph + 0.5 && y < yR - 0.5)) slab(y, 0.35, 'floor', Tt * 0.5);
  if (s.court) s.court.ov = s.court.g || 0;
  slab(yR, 0.45, 'arga', 0.3);
  if (s.court) s.court.ov = 0;
  // --- sân trong: tường quanh sân (đứng), hành lang gỗ tầng trên trên cột, lan can (03 › printing, sholoffice, sholhouse §4)
  if (s.court) {
    const C = s.court, ccx = cx + (C.x || 0), ccz = cz + (C.z || 0), g = C.g || 0, yG = C.yG ?? ph + (yR - ph) / 2;
    const CF = frame({ W: C.w + 1.0, D: C.d + 1.0, yRef: ph, k: 0, cx: ccx, cz: ccz });
    wring(acc, wallKey, CF, ph, yR, 0.5, [{ f: 0, u0: -1.4, u1: 1.4, y0: ph - 1, y1: ph + 2.8 }, { f: 2, u0: -1.4, u1: 1.4, y0: ph - 1, y1: ph + 2.8 }]);
    // lối vào từ cổng trước tới sân: hai vách ngăn
    const zIn = cz + inner(ph, 0)[1] / 2;
    const zA = zIn - Tb, zB = ccz + C.d / 2 + 0.5;
    if (zA - zB > 0.2) for (const sx of [-1, 1]) put(acc, wallKey, boxB(0.4, yG - ph - 0.35, zA - zB, cx + sx * 1.6, ph, (zA + zB) / 2));
    // cửa sổ quay vào sân (tầng dưới nhỏ, tầng trên lớn hơn)
    const IF = frame({ W: C.w, D: C.d, yRef: ph, k: 0, cx: ccx, cz: ccz });
    const inM = (f, u, y) => IF.M(f, u, y, 0).multiply(new THREE.Matrix4().makeRotationY(Math.PI));
    for (let f = 0; f < 4; f++) for (const [y, w, h] of [[ph + 0.9, 0.8, 1.1], [yG + 0.7, 1.2, 1.5]]) for (const u of rowUs(IF.len(f, y), 2.6, 1.4, f, [[0, -1.6, 1.6], [2, -1.6, 1.6]], w)) tbWindow(acc, inM(f, u, y), { w, h, layers: 1 });
    if (g) { // hành lang gỗ: sàn nhô, cột, lan can, xà sơn
      const gw = C.w - 2 * g, gd = C.d - 2 * g;
      for (const [w, d, x, z] of [[C.w, g, 0, C.d / 2 - g / 2], [C.w, g, 0, -C.d / 2 + g / 2], [g, gd, -C.w / 2 + g / 2, 0], [g, gd, C.w / 2 - g / 2, 0]]) put(acc, 'floor', boxB(w, 0.3, d, ccx + x, yG - 0.3, ccz + z));
      const cs = []; const nx = Math.max(1, Math.round(gw / 2.4)), nz = Math.max(1, Math.round(gd / 2.4));
      for (let i = 0; i <= nx; i++) for (const sz of [-1, 1]) cs.push([-gw / 2 + (gw * i) / nx, sz * gd / 2]);
      for (let j = 1; j < nz; j++) for (const sx of [-1, 1]) cs.push([sx * gw / 2, -gd / 2 + (gd * j) / nz]);
      for (const [x, z] of cs) { tbColumn(acc, ccx + x, ccz + z, ph, yG - ph - 0.3, 0.3, Math.abs(z) > gd / 2 - 0.01 ? 0 : 1); tbColumn(acc, ccx + x, ccz + z, yG, yR - yG - 0.45, 0.28, Math.abs(z) > gd / 2 - 0.01 ? 0 : 1); }
      for (const [w, d, x, z] of [[gw + 0.3, 0.3, 0, gd / 2], [gw + 0.3, 0.3, 0, -gd / 2], [0.3, gd, -gw / 2, 0], [0.3, gd, gw / 2, 0]]) { acc.add('beamT', boxB(w, 0.3, d, ccx + x, yG - 0.6, ccz + z)); acc.add('beamT', boxB(w, 0.3, d, ccx + x, yR - 0.75, ccz + z)); acc.add('col', boxB(w, 0.08, d * 0.4, ccx + x, yG + 0.95, ccz + z)); acc.add('col', boxB(w, 0.12, d * 0.6, ccx + x, yG, ccz + z)); }
      for (const [x, z] of cs) acc.add('col', boxB(0.08, 0.95, 0.08, ccx + x, yG, ccz + z));
      // diềm mái nhô vào sân (đầu rui)
      for (const [w, d, x, z] of [[gw + 0.6, 0.5, 0, gd / 2 - 0.1], [gw + 0.6, 0.5, 0, -gd / 2 + 0.1], [0.5, gd, -gw / 2 + 0.1, 0], [0.5, gd, gw / 2 - 0.1, 0]]) acc.add('lintel', bxT(w, 0.2, d, ccx + x, yR - 0.35, ccz + z, 0.8));
    }
    put(acc, 'arga', boxB(C.w - 0.1, 0.06, C.d - 0.1, ccx, ph, ccz));
  }
  // --- cột trong (lưới ô cột ≈ 2–4 m), đà gzhu + xà gdung
  if (s.cols) { const h = s.cols.h ?? ((s.storeys || [])[0] ?? yR) - ph - 0.35; for (const x of s.cols.xs) for (const z of s.cols.zs) tbColumn(acc, cx + x, cz + z, ph, h, s.cols.d ?? 0.42, 0); for (const z of s.cols.zs) acc.add('beamT', boxB(s.cols.xs[s.cols.xs.length - 1] - s.cols.xs[0] + 1.2, 0.34, 0.36, cx + (s.cols.xs[0] + s.cols.xs[s.cols.xs.length - 1]) / 2, ph + h, cz + z)); }
  // --- cửa vào chính
  if (s.door) tbDoor(acc, F.M(0, 0, ph, 0), s.door.w, s.door.h, { depth: 1.0 });
  for (const d of s.doors || []) tbDoor(acc, F.M(d.f, d.u, d.y ?? ph, 0), d.w, d.h, { depth: 0.8 });
  if (s.passage) for (const f of [0, 2]) tbDoor(acc, F.M(f, 0, y0, 0), s.passage.w, s.passage.h, { depth: 1.4 });
  if (s.stair) stoneStair(acc, { cx, z0: cz + F.nOut(0, ph), w: s.stair.w, h: ph - y0, flank: s.stair.flank || null, ft: s.stair.ft ?? 0.6, key: s.stair.key || 'stone', guard: s.stair.guard ?? 0.8 });
  // giá ván khắc kinh xếp kín tường trong (dấu hiệu chức năng nhà in — 03 › printing §5.4)
  if (s.shelves) { const T0 = Tt + (Tb - Tt) * (yTop - ys[1]) / (yTop - ys[0]) + k * (ys[1] - ys[0]); const hS = (ys[1] - ph) - 0.6;
    for (let f = 0; f < 4; f++) { const L = F.len(f, ph) - 2 * (T0 + 0.7), segs = f === 0 ? [[-L / 2, -2.2], [2.2, L / 2]] : [[-L / 2, L / 2]];
      for (const [a, b2] of segs) if (b2 - a > 0.5) acc.add('shelf', xf(bxT(b2 - a, hS, 0.55, (a + b2) / 2, hS / 2, 0, 1.0, 1.0), F.M(f, 0, ph, -(T0 + 0.3), false))); } }
  // --- hàng cửa sổ
  const doorSkip = [];
  if (s.door) doorSkip.push([0, -s.door.w / 2 - 1.2, s.door.w / 2 + 1.2]);
  if (s.passage) for (const f of [0, 2]) doorSkip.push([f, -s.passage.w / 2 - 1.4, s.passage.w / 2 + 1.4]);
  for (const d of s.doors || []) doorSkip.push([d.f, d.u - d.w / 2 - 1, d.u + d.w / 2 + 1]);
  for (const r of s.rows || []) for (const f of r.faces || [0, 1, 2, 3]) {
    const near = (r.y < ph + (s.door?.h ?? 0) + 1.5 || (s.passage && r.y < y0 + s.passage.h + 1.6)) ? doorSkip : [];
    const us = r.us?.[f] ?? rowUs(F.len(f, r.y), r.step || 3.2, r.margin ?? 1.6, f, [...near, ...(r.skip || []), ...(s.skip || [])], r.w, r.pair || 0);
    for (const u of us) tbWindow(acc, F.M(f, u, r.y), { w: r.w, h: r.h, kind: r.rabsel && r.rabsel[0] === f && u > r.rabsel[1] && u < r.rabsel[2] ? 'rabsel' : r.kind || 'std', horns: r.horns ?? s.horns, layers: r.layers || 1, curtain: r.curtain ?? true, pane: r.pane });
  }
  // --- penbey / tường chắn mái / gờ
  if (s.penbey) penbeyBand(acc, F, yTop - s.penbey.h, yTop - 0.18, { gold: s.penbey.gold ?? 2.6, wheel: s.penbey.wheel || 0, T: 0.6, key: s.penbey.key || 'penbey', beamEnds: true, open: gaps, skip: gaps.map((g) => [g.f, g.u0 - 0.5, g.u1 + 0.5]) });
  else if (s.parapet?.key && s.parapet.key !== wallKey) wring(acc, s.parapet.key, F.grow(0.03), yR - (s.parapet.band ?? 0.25), yTop, 0.5, gaps);
  else if (s.beamEnds !== false) for (let f = 0; f < 4; f++) acc.add('lintel', xf(bxT(F.len(f, yR - 0.3) + 0.1, 0.18, 0.2, 0, 0, 0.04, 0.8), F.M(f, 0, yR - 0.3, 0)));
  wring(acc, 'coping', F.grow(0.12), yTop, yTop + 0.16, 0.85, gaps.map((g) => ({ ...g, y0: yTop - 1 })));
  // máng thoát nước mái (đầu gỗ nhô)
  for (let f = 0; f < 4; f++) for (const u of [-0.3, 0.3]) acc.add('wood', xf(box(0.2, 0.18, 0.9, 0, 0, 0.3), F.M(f, u * F.len(f, yR), yR + 0.08, 0, false)));
  // góc mái: trụ góc chữ L / cành cờ / gyaltsen / cờ đen
  const pc = s.parapet || {};
  const [wt, dt] = F.dims(yTop + 0.16);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = cx + sx * (wt / 2 - 0.45), z = cz + sz * (dt / 2 - 0.45), yc = yTop + 0.16;
    if (pc.corners) { acc.add(pc.key || wallKey, boxB(0.9, 0.45, 0.32, x - sx * 0.1, yc, z + sz * 0.1)); acc.add(pc.key || wallKey, boxB(0.32, 0.45, 0.9, x + sx * 0.1, yc, z - sz * 0.1)); }
    if (pc.flags) flagTwig(acc, x, yc + (pc.corners ? 0.45 : 0), z, 1.3);
    if (pc.gyaltsen) gyaltsen(acc, x, yc, z, pc.gyaltsen);
    if (pc.banners) blackBanner(acc, x, yc, z, pc.banners);
  }
  const b = bbox(acc);
  const cg = s.cols ? { bays: s.cols.xs.slice(1).map((x, i) => r2(x - s.cols.xs[i])), colH: r2(s.cols.h ?? ((s.storeys || [])[0] ?? yR) - ph - 0.35), colD: s.cols.d ?? 0.42 } : {};
  const info = { W, D, ...cg, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph, eave: yR, top: r2(b.max.y), kind: s.kind || 'block', F, yR, yTop, x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) };
  return { acc, info };
}

// ---------------------------------------------------------------- các loại hình cụ thể
/** BẠCH CUNG (03 › main): khối trắng 7 hàng cửa trên chân đá, 3 thang gỗ giữa hai tường penbey, Nhật Quang điện, pháo đài tròn */
export function tbPalace(s) {
  const r = tbBlock({ ...s, kind: 'palace' }), acc = r.acc, F = r.info.F, ph = s.ph;
  // 3 thang gỗ song song (giữa riêng Đạt Lai) — mặt trên dốc ≈ 38°, hai bên tường penbey đỏ thẫm (03 › main §5.4–5.5)
  const T3 = s.triple, rise = 0.2, tread = 0.26, n = Math.round(ph / rise), rr = ph / n, run = n * tread, z0 = F.nOut(0, ph) - 0.05;
  let x = -T3.ws.reduce((a, b) => a + b, 0) / 2 - (T3.ws.length - 1) * T3.gap / 2;
  const walls = [x - T3.flank];
  T3.ws.forEach((w, i) => {
    const xc = x + w / 2;
    for (let j = 1; j <= n; j++) { const zc = z0 + run - (j - 0.5) * tread; acc.add('wood', boxB(w - 0.1, 0.07, tread + 0.04, xc, rr * j - 0.07, zc)); acc.plat({ x: xc, z: zc, w, d: tread + 0.02, top: rr * j }); }
    for (const sx of [-1, 1]) acc.add('col', beam(V(xc + sx * (w / 2 - 0.08), ph + 0.1, z0), V(xc + sx * (w / 2 - 0.08), 0.1, z0 + run + 0.1), 0.14, 0.34)); // má thang gỗ
    for (const sx of [-1, 1]) acc.add('col', beam(V(xc + sx * (w / 2 - 0.1), ph + 1.0, z0), V(xc + sx * (w / 2 - 0.1), 1.0, z0 + run), 0.08, 0.08)); // tay vịn
    x += w; if (i < T3.ws.length - 1) { walls.push(x); x += T3.gap; }
  });
  walls.push(x);
  // tường ngăn (penbey) giữa các thang và hai tường bên dày
  const flankAt = (xa, xb) => { put(acc, 'penbeyD', hexa([[xa, 0, z0 - 0.4], [xb, 0, z0 - 0.4], [xb, 0, z0 + run + 0.3], [xa, 0, z0 + run + 0.3], [xa, ph + 1.3, z0 - 0.4], [xb, ph + 1.3, z0 - 0.4], [xb, 1.0, z0 + run + 0.3], [xa, 1.0, z0 + run + 0.3]])); acc.add('coping', beam(V((xa + xb) / 2, ph + 1.4, z0 - 0.4), V((xa + xb) / 2, 1.1, z0 + run + 0.3), xb - xa + 0.16, 0.16)); };
  flankAt(walls[0], walls[0] + T3.flank); flankAt(walls[walls.length - 1], walls[walls.length - 1] + T3.flank);
  for (let i = 1; i < walls.length - 1; i++) flankAt(walls[i], walls[i] + T3.gap);
  // chiếu nghỉ trước cửa (gỗ) + rèm yak lớn trên cửa
  put(acc, 'wood', boxB(T3.ws.reduce((a, b) => a + b, 0) + T3.gap * 2, 0.2, 1.4, 0, ph - 0.2, z0 + 0.5));
  // Nhật Quang điện (tầng 7): dải kính sát sàn quay mặt tiền, ban công gỗ, rèm vàng (03 › main §3.4, §5.6)
  const N = s.nyiwo; if (N && N.penthouse) { // tầng 7 lùi trên mái: Nhật Quang điện, mặt kính rèm vàng, hiên gỗ, penbey, cờ đen
    const P7 = N.penthouse, yR = r.info.yR;
    const pr = tbBlock({ acc, W: P7.W, D: P7.D, k: 0.03, y0: yR - 0.45, ph: yR, H: P7.H, cz: P7.cz, wall: 'wallW', Ttop: 0.5, Tbot: 0.6, rows: [{ y: yR + 0.9, w: 1.0, h: 1.3, step: 2.8, faces: [1, 2, 3] }], penbey: { h: 1.2, gold: 2.0 }, parapet: { h: 0.7, banners: 1.0 } });
    const PF = pr.info.F, n = P7.n, wg = (P7.W - 4) / n, zf = PF.nOut(0, yR);
    for (let i = 0; i < n; i++) tbWindow(acc, PF.M(0, -(P7.W - 4) / 2 + wg * (i + 0.5), yR + 0.35), { w: wg - 0.5, h: P7.H - 1.75, kind: 'glass', layers: 2, curtain: false });
    for (let i = 0; i <= n; i++) { const [x, , z] = PF.P(0, -(P7.W - 4) / 2 + wg * i, zf + 1.9, yR); tbColumn(acc, x, z, yR, P7.H - 0.9, 0.3); }
    const M = PF.M(0, 0, yR, 0, false); acc.add('arga', xf(box(P7.W - 2, 0.3, 2.4, 0, P7.H - 0.75, 1.2), M)); acc.add('lintel', xf(bxT(P7.W - 1.8, 0.2, 2.5, 0, P7.H - 0.98, 1.25, 0.8), M)); acc.add('penbey', xf(box(P7.W - 1.7, 0.5, 0.2, 0, P7.H - 0.35, 2.4), M));
  }
  if (N && !N.penthouse) {
    const y = N.y, M = F.M(0, 0, y, 0);
    for (let i = 0; i < N.n; i++) { const u = -N.w / 2 + (N.w / N.n) * (i + 0.5); tbWindow(acc, F.M(0, u, y), { w: N.w / N.n - 0.5, h: N.h, kind: 'glass', layers: 2, curtain: false }); }
    acc.add('col', xf(box(N.w + 1.2, 0.2, 1.3, 0, -0.15, 0.6), M)); acc.add('col', xf(box(N.w + 1.2, 0.1, 0.1, 0, 0.95, 1.2), M));
    for (let i = 0; i <= N.n * 3; i++) acc.add('col', xf(box(0.08, 0.95, 0.08, -N.w / 2 - 0.6 + ((N.w + 1.2) * i) / (N.n * 3), 0.45, 1.2), M));
    for (const sx of [-1, 1]) acc.add('col', xf(slabXY([[0, 0], [0, -1.1], [0.25, -1.1], [1.2, -0.1], [1.2, 0]], 0.2, 0, 0, 0, -Math.PI / 2).translate(sx * N.w / 2, -0.15, 0), M));
  }
  // pháo đài tròn đầu Đông (tượng trưng mặt trời — 03 › main §5.7)
  const B = s.bastion; if (B) {
    const prof = [[B.r + B.k * B.h, 0], [B.r, B.h], [B.r - 0.6, B.h], [B.r - 0.6, B.h + 1.0], [0.001, B.h + 1.0]];
    acc.add('wallW', latheC(prof.slice(0, 2).concat([[0.001, B.h]]), B.x, 0, B.z, 32)); acc.add('wallS', latheC([[B.r + B.k * B.h + 0.05, 0], [B.r + B.k * (B.h - 3) + 0.05, 3], [0.001, 3]], B.x, 0, B.z, 32));
    acc.add('penbey', latheC([[B.r + 0.06 + B.k * 1.6, B.h - 1.6], [B.r + 0.06, B.h + 0.9], [0.001, B.h + 0.9], [0.001, B.h - 1.6]], B.x, 0, B.z, 32)); acc.add('coping', latheC([[B.r + 0.2, B.h + 0.9], [B.r + 0.2, B.h + 1.1], [0.001, B.h + 1.1]], B.x, 0, B.z, 32));
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + 0.2; for (const [y, w, h] of [[4.5, 0.42, 0.95], [9.5, 0.6, 1.1], [14.5, 0.8, 1.3]]) { if (y > B.h - 2) continue; const rr2 = B.r + B.k * (B.h - y); const m = new THREE.Matrix4().makeTranslation(B.x + Math.sin(a) * rr2, y, B.z + Math.cos(a) * rr2).multiply(new THREE.Matrix4().makeRotationY(a)).multiply(new THREE.Matrix4().makeRotationX(-Math.atan(B.k))); tbWindow(acc, m, { w, h, kind: y < 6 ? 'slit' : 'std' }); } }
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; const m = new THREE.Matrix4().makeTranslation(B.x + Math.sin(a) * (B.r + 0.1), B.h - 0.35, B.z + Math.cos(a) * (B.r + 0.1)).multiply(new THREE.Matrix4().makeRotationY(a)); medallion(acc, m, 0.3); }
  }
  const b = bbox(acc);
  return { acc, info: { ...r.info, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z), top: r2(b.max.y), kind: 'palace' } };
}

/** hiên cột trước (dratsang — 03 › seminary): 2 tầng cột đỏ, sàn lửng, lan can, rèm yak đen, tường hai bên, mái penbey */
function portico(acc, { w, d, z0, ph, yMid, yR, n = 6, para = 0.9, penbey = true }) {
  const zf = z0 + d, xs = Array.from({ length: n }, (_, i) => -w / 2 + 0.6 + ((w - 1.2) * i) / (n - 1));
  for (const x of xs) { tbColumn(acc, x, zf - 0.4, ph, yMid - ph - 0.3, 0.42); tbColumn(acc, x, zf - 0.4, yMid, yR - yMid - 0.45, 0.36); tbColumn(acc, x, z0 + d * 0.45, ph, yMid - ph - 0.3, 0.42); }
  acc.add('beamT', boxB(w, 0.36, 0.42, 0, yMid - 0.66, zf - 0.4)); acc.add('beamT', boxB(w, 0.36, 0.42, 0, yR - 0.81, zf - 0.4));
  put(acc, 'floor', boxB(w, 0.3, d, 0, yMid - 0.3, z0 + d / 2)); put(acc, 'arga', boxB(w + 0.6, 0.45, d + 0.3, 0, yR - 0.45, z0 + d / 2));
  acc.add('col', boxB(w, 0.1, 0.12, 0, yMid + 0.95, zf - 0.15)); for (let x = -w / 2; x <= w / 2 + 0.01; x += 0.5) acc.add('col', boxB(0.07, 0.95, 0.07, x, yMid, zf - 0.15));
  acc.add('yak', bxT(w - 0.6, 1.3, 0.06, 0, yR - 1.6, zf - 0.05, 1.0, 1.3)); // rèm lông yak đen treo trước hiên tầng trên
  // tường hai bên hiên (bích hoạ Tứ Thiên Vương bên trong — chưa vẽ)
  for (const sx of [-1, 1]) put(acc, 'wallW', hexa([[sx * w / 2, ph, z0], [sx * (w / 2 + 1.0), ph, z0], [sx * (w / 2 + 1.0), ph, zf], [sx * w / 2, ph, zf], [sx * w / 2, yR + para, z0], [sx * (w / 2 + 0.75), yR + para, z0], [sx * (w / 2 + 0.75), yR + para, zf - 0.25], [sx * w / 2, yR + para, zf - 0.25]]));
  const PF = frame({ W: w + 2.0, D: d, yRef: ph, k: 0, cx: 0, cz: z0 + d / 2 });
  if (penbey) { wring(acc, 'penbey', PF.grow(0.05), yR - 1.2, yR + para - 0.18, 0.45); for (const u of [-w / 2 + 1, -w / 4, w / 4, w / 2 - 1]) medallion(acc, PF.M(0, u, yR - 0.2, 0.05), 0.32); acc.add('lintel', xf(bxT(w + 2.2, 0.2, 0.26, 0, -0.12, 0.05, 0.8), PF.M(0, 0, yR - 1.2, 0))); }
  wring(acc, 'coping', PF.grow(0.12), yR + para, yR + para + 0.16, 0.6);
}
/** TĂNG HỌC VIỆN (03 › seminary): cánh 2 tầng, hiên cột + rèm yak, penbey có gương đồng, khối cửa mái nâng giữa, pháp luân đôi nai */
export function tbSeminary(s) {
  const r = tbBlock({ ...s, kind: 'seminary' }), acc = r.acc, F = r.info.F, P = s.porch, z0 = F.nOut(0, s.ph) - 0.3;
  portico(acc, { w: P.w, d: P.d, z0, ph: s.ph, yMid: s.ph + P.h1, yR: r.info.yR, para: s.parapet?.h ?? 0.9 });
  acc.plat({ x: 0, z: z0 + P.d / 2, w: P.w, d: P.d, top: s.ph }); put(acc, 'stone', boxB(P.w + 2, s.ph, P.d + 0.4, 0, 0, z0 + P.d / 2 + 0.1));
  stoneStair(acc, { z0: z0 + P.d + 0.3, w: P.stairW, h: s.ph, flank: 'wallW', ft: 0.7 });
  // khối cửa mái (clerestory) — gian giữa kinh đường nâng cao lấy sáng
  const C = s.clere, yC = r.info.yR;
  const cr = tbBlock({ acc, W: C.w, D: C.d, k: 0.02, y0: yC - 0.45, ph: yC, H: C.h, wall: 'wallW', Ttop: 0.4, Tbot: 0.5, cz: C.z || 0, rows: [{ y: yC + 0.6, w: 1.0, h: 1.0, step: 2.2, faces: [0, 2], margin: 1.2 }], penbey: { h: 1.1, gold: 1.8 }, parapet: { h: 0.6, gyaltsen: 0.75 } });
  // pháp luân + đôi nai trên mép mái trước, trên hiên (dấu hiệu chùa / học viện — 03 › seminary §5.5)
  const yT = r.info.yTop + 0.16; wheelDeer(acc, new THREE.Matrix4().makeTranslation(0, yT, z0 + P.d - 0.6), 1.15);
  const b = bbox(acc);
  return { acc, info: { ...r.info, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z), top: r2(b.max.y), kind: 'seminary', clere: cr.info.top } };
}
/** TĂNG PHÒNG (03 › dormE): dãy 2 tầng trắng, mặt sân là hành lang cột gỗ đỏ 2 tầng, cửa phòng + cửa sổ đều */
export function tbDorm(s) {
  const r = tbBlock({ ...s, kind: 'dorm' }), acc = r.acc, F = r.info.F, G = s.gallery, ph = s.ph, yR = r.info.yR, yM = ph + G.h1;
  const z0 = F.nOut(0, ph), zf = z0 + G.d, n = Math.round(s.W / G.step);
  put(acc, 'stone', boxB(s.W + 0.2 + 2 * s.k * ph, ph, G.d + 0.2, 0, 0, z0 + G.d / 2)); acc.plat({ x: 0, z: z0 + G.d / 2, w: s.W, d: G.d, top: ph });
  for (let i = 0; i <= n; i++) { const x = -s.W / 2 + 0.4 + ((s.W - 0.8) * i) / n; tbColumn(acc, x, zf - 0.3, ph, yM - ph - 0.3, 0.34); tbColumn(acc, x, zf - 0.3, yM, yR - yM - 0.45, 0.3); }
  put(acc, 'floor', boxB(s.W, 0.3, G.d, 0, yM - 0.3, z0 + G.d / 2)); put(acc, 'arga', boxB(s.W + 0.3, 0.45, G.d + 0.25, 0, yR - 0.45, z0 + G.d / 2));
  acc.add('beamT', boxB(s.W, 0.3, 0.36, 0, yM - 0.62, zf - 0.3)); acc.add('beamT', boxB(s.W, 0.3, 0.36, 0, yR - 0.77, zf - 0.3));
  acc.add('col', boxB(s.W, 0.1, 0.12, 0, yM + 0.95, zf - 0.1)); for (let x = -s.W / 2; x <= s.W / 2 + 0.01; x += 0.45) acc.add('col', boxB(0.06, 0.95, 0.06, x, yM, zf - 0.1));
  const PF = frame({ W: s.W, D: G.d, yRef: ph, k: 0, cz: z0 + G.d / 2 });
  wring(acc, 'penbey', PF.grow(0.05), yR - 0.2, yR + (s.parapet?.h ?? 0.8) - 0.18, 0.4); for (let x = -s.W / 2 + 2; x < s.W / 2 - 1; x += 4) medallion(acc, PF.M(0, x, yR + 0.25, 0.05), 0.2);
  acc.add('lintel', xf(bxT(s.W + 0.2, 0.2, 0.26, 0, -0.12, 0.05, 0.8), PF.M(0, 0, yR - 0.2, 0))); wring(acc, 'coping', PF.grow(0.12), yR + (s.parapet?.h ?? 0.8), yR + (s.parapet?.h ?? 0.8) + 0.16, 0.5);
  // cửa phòng (dưới, trên) + cửa sổ nhỏ quay ra sân
  for (let i = 0; i < n; i++) { const x = -s.W / 2 + 0.4 + ((s.W - 0.8) * (i + 0.5)) / n; if (Math.abs(x) < 2.2) continue; for (const y of [ph, yM]) { acc.add('door', xf(box(0.9, 2.0, 0.1, 0, 1.0, 0.05), F.M(0, x - 0.55, y, 0))); acc.add('black', xf(box(1.15, 2.15, 0.06, 0, 1.07, 0.01), F.M(0, x - 0.55, y, 0))); tbWindow(acc, F.M(0, x + 0.75, y + 0.9), { w: 0.7, h: 0.9 }); } }
  stoneStair(acc, { z0: zf + 0.1, w: 3.2, h: ph, flank: 'wallW', ft: 0.6 });
  // thang gỗ dốc ở đầu dãy lên hành lang trên
  const xe = s.W / 2 - 1.2; for (let j = 1; j <= 14; j++) acc.add('wood', boxB(1.0, 0.06, 0.28, xe, ph + (G.h1 * j) / 14 - 0.06, zf - 0.6 - (j - 0.5) * 0.2 * (G.d - 1) / 3));
  const b = bbox(acc);
  return { acc, info: { ...r.info, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z), top: r2(b.max.y), kind: 'dorm' } };
}
/** ĐIỆN KINH LUÂN Mani Lhakhang (03 › east1): khối trắng vuông, bánh xe lớn ở tâm, hàng bánh xe nhỏ dọc hai tường, lư hương sang-khang */
export function tbMani(s) {
  const r = tbBlock({ ...s, kind: 'mani' }), acc = r.acc, F = r.info.F, ph = s.ph, yR = r.info.yR, Wh = s.wheel;
  // bánh xe lớn: bệ, trụ, thân trụ đỏ chữ mani vàng, nắp, chuông trên trục, khung đỡ trên
  acc.add('stone', boxB(Wh.d + 0.6, 0.3, Wh.d + 0.6, 0, ph, 0));
  const body = new THREE.CylinderGeometry(Wh.d / 2, Wh.d / 2, Wh.h, 24, 1, false); body.translate(0, ph + 0.5 + Wh.h / 2, 0); acc.add('mani', body);
  acc.add('gold', latheC([[Wh.d / 2 + 0.06, 0], [Wh.d / 2 + 0.06, 0.12], [0.2, 0.4], [0.001, 0.45]], 0, ph + 0.5 + Wh.h, 0, 24)); acc.add('gold', latheC([[0.001, -0.12], [Wh.d / 2 + 0.06, -0.12], [Wh.d / 2 + 0.06, 0]], 0, ph + 0.5, 0, 24));
  acc.add('wood', cyl(0.08, 0.08, yR - ph, 0, ph, 0, 8)); acc.add('wood', boxB(0.2, 0.2, 3.4, 0, yR - 0.9, 0)); acc.add('gold', latheC([[0.001, 0], [0.16, 0.05], [0.18, 0.28], [0.06, 0.32]], 0.5, yR - 1.25, 0, 10));
  for (const sx of [-1, 1]) acc.add('col', beam(V(sx * 0.6, ph + 0.5 + Wh.h * 0.35, 0), V(sx * (Wh.d / 2 + 0.25), ph + 0.5 + Wh.h * 0.35, 0), 0.08, 0.08)); // tay quay
  // hàng bánh xe nhỏ dọc tường hai bên (khung gỗ, mái hiên nhỏ)
  for (const f of [1, 3]) {
    const L = F.len(f, ph) - 1.6, n = s.smallN || 8;
    for (let i = 0; i < n; i++) { const u = -L / 2 + (L * (i + 0.5)) / n, M = F.M(f, u, ph - 0.2, 0.5, false); const g = new THREE.CylinderGeometry(0.17, 0.17, 0.5, 12); g.translate(0, 0.95, 0.05); acc.add('mani', xf(g, M)); acc.add('wood', xf(box(0.04, 1.2, 0.04, 0, 0.8, 0.05), M)); }
    const M0 = F.M(f, 0, ph - 0.2, 0.5, false); acc.add('col', xf(box(L + 0.4, 0.12, 0.6, 0, 0.6, 0.05), M0)); acc.add('col', xf(box(L + 0.4, 0.12, 0.6, 0, 1.35, 0.05), M0));
    acc.add('wood', xf(box(L + 0.8, 0.1, 1.1, 0, 2.0, 0.15), M0)); acc.add('lintel', xf(bxT(L + 0.8, 0.14, 1.0, 0, 1.88, 0.15, 0.8), M0));
    for (const t of [-1, 1]) acc.add('col', xf(box(0.14, 2.2, 0.14, t * (L / 2 + 0.15), 1.0, 0.4), M0));
  }
  // lư hương sang-khang trắng trước cửa
  const zs = F.nOut(0, 0) + s.sangZ, xs = s.sangX ?? 3.6; acc.add('chorten', boxB(1.4, 0.9, 1.4, xs, 0, zs)); acc.add('chorten', latheC([[0.55, 0], [0.5, 0.9], [0.18, 1.3], [0.18, 1.9], [0.001, 1.9]], xs, 0.9, zs, 12)); acc.add('dark', box(0.4, 0.35, 0.05, xs, 0.5, zs + 0.72));
  acc.add('gold', latheC([[0.22, 0], [0.1, 0.15], [0.001, 0.4]], xs, 2.8, zs, 8));
  const b = bbox(acc);
  return { acc, info: { ...r.info, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z), top: r2(b.max.y), kind: 'mani' } };
}
/** ĐÌNH MÁI VÀNG trên khối tường (gyaphib đơn lẻ — 03 › summit A): thân đỏ có hiên 2 cột, penbey, đấu củng, yết sơn vàng, gyaltsen 4 góc */
export function tbShrine(s) {
  const acc = new Acc(), ph = s.ph, H = s.H, W = s.W, D = s.D, k = s.k ?? 0.04;
  put(acc, 'wallS', frustum(W + 1.2 + 2 * k * ph, D + 1.2 + 2 * k * ph, 0, ph, k * ph, k * ph)); acc.plat({ x: 0, z: 0, w: W + 1.2, d: D + 1.2, top: ph });
  stoneStair(acc, { z0: (D + 1.2) / 2, w: 2.4, h: ph, flank: 'wallW', ft: 0.5 });
  const pd = s.porch, F = frame({ W, D: D - pd, yRef: ph, k: 0.04, cz: -pd / 2 });
  wring(acc, s.wall || 'wallR', F, ph, ph + H, 0.6, [{ f: 0, u0: -1.2, u1: 1.2, y0: ph - 1, y1: ph + 2.6 }]); tbDoor(acc, F.M(0, 0, ph, 0), 2.4, 2.6);
  for (const f of [1, 2, 3]) for (const u of [-1.4, 1.4]) tbWindow(acc, F.M(f, u, ph + 1.1), { w: 0.6, h: 0.9 });
  for (const sx of [-1, 1]) { put(acc, s.wall || 'wallR', hexa([[sx * (W / 2 - 0.8), ph, D / 2 - pd], [sx * W / 2, ph, D / 2 - pd], [sx * W / 2, ph, D / 2], [sx * (W / 2 - 0.8), ph, D / 2], [sx * (W / 2 - 0.8), ph + H, D / 2 - pd], [sx * (W / 2 - 0.04 * H), ph + H, D / 2 - pd], [sx * (W / 2 - 0.04 * H), ph + H, D / 2], [sx * (W / 2 - 0.8), ph + H, D / 2]])); }
  for (const sx of [-1, 1]) tbColumn(acc, sx * 1.6, D / 2 - 0.3, ph, H - 0.1, 0.36);
  put(acc, 'floor', boxB(W, 0.05, D, 0, ph, 0));
  // penbey quanh thân dưới mái
  const PF = frame({ W, D, yRef: ph, k: 0.04 }); penbeyBand(acc, PF, ph + H, ph + H + s.pb, { gold: 1.4, T: 0.5, beamEnds: true });
  gyaphib(acc, { y: ph + H + s.pb + 0.16 - 0.3, W: s.gW, D: s.gD, colH: 0.45, over: s.over, dk: s.dk ?? 0.05, walls: 'none', noCols: true, gy: true, ridgeH: 0.45, z: -0.15 });
  const b = bbox(acc);
  return { acc, info: { W, D, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph, eave: ph + H + s.pb, top: r2(b.max.y), kind: 'shrine', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}
/** ZHASHA — khối trắng bậc theo sườn (03 › zhasha §8): các bậc là khối tường nghiêng chồng lùi, cầu thang dốc men tường lên sân thượng */
export function tbTiers(s) {
  const acc = new Acc();
  for (const t of s.tiers) tbBlock({ ...s.common, ...t, acc });
  for (const st of s.stairs || []) { wallStair(acc, st); if (st.land) acc.plat(st.land); }
  for (const p of s.terraces || []) acc.plat(p);
  const b = bbox(acc);
  return { acc, info: { W: s.tiers[0].W, D: r2(b.max.z - b.min.z), PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph: s.common.ph ?? s.tiers[0].ph, eave: s.tiers[0].ph + s.tiers[0].H, top: r2(b.max.y), kind: 'tiers', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}
/** GHÉP nhiều khối (nhà dân Shöl hai nhà sát nhau) */
export function tbCompound(s, build) {
  const acc = new Acc(); let ph = 0;
  for (const p of s.parts) { const { acc: a, info } = build(p); mergeInto(acc, a, p.at[0], p.at[1], p.ry || 0); ph = Math.max(ph, info.ph || 0); }
  const b = bbox(acc);
  return { acc, info: { W: r2(b.max.x - b.min.x), D: r2(b.max.z - b.min.z), PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph, top: r2(b.max.y), kind: 'compound', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}

/** LUKHANG (03 › lukhang): đảo tròn kè đá, mandala vuông 3 tầng thu nhỏ (16 / 11 / 7 m), hành lang cột bao tầng 1, 4 cửa, penbey từng tầng, mái lục giác vàng */
export function tbLukhang(s) {
  const acc = new Acc(), I = s.island, yI = I.h;
  // đảo: kè đá + mặt cỏ
  acc.add('stone', latheC([[I.r + 0.6, -0.6], [I.r + 0.25, yI - 0.1], [I.r, yI], [0.001, yI]], 0, 0, 0, 40)); acc.add('grass', cyl(I.r - 0.1, I.r - 0.1, 0.06, 0, yI, 0, 40)); acc.plat({ poly: true, x: 0, z: 0, n: 16, a: I.r - 0.3, top: yI + 0.06 });
  const T1 = s.t1, pw = T1.w + 0.8, ph = yI + T1.plinth;
  acc.add('stone', boxB(pw, T1.plinth, pw, 0, yI, 0)); acc.add('marble', boxB(pw + 0.06, 0.12, pw + 0.06, 0, ph - 0.12, 0)); acc.plat({ x: 0, z: 0, w: pw, d: pw, top: ph });
  for (let f = 0; f < 4; f++) { const a = (f * Math.PI) / 2, g = new Acc(); stoneStair(g, { z0: pw / 2, w: 3.0, h: T1.plinth, flank: 'wallW', ft: 0.4 }); mergeInto(acc, g, 0, 0, a, yI); }
  // tầng 1: lõi tường trắng 4 cửa + hành lang cột bao
  const y1 = ph + T1.h, C1 = frame({ W: T1.core, D: T1.core, yRef: ph, k: 0.03 });
  wring(acc, 'wallW', C1, ph, y1, 0.8, [0, 1, 2, 3].map((f) => ({ f, u0: -1.3, u1: 1.3, y0: ph - 1, y1: ph + 2.8 })));
  for (let f = 0; f < 4; f++) { tbDoor(acc, C1.M(f, 0, ph, 0), 2.6, 2.8); for (const u of [-3.4, 3.4]) tbWindow(acc, C1.M(f, u, ph + 1.2), { w: 0.8, h: 1.2 }); }
  const ga = T1.w / 2 - 0.5, nc = 6;
  for (let i = 0; i <= nc; i++) for (const f of [0, 1, 2, 3]) { if (i === nc) continue; const t = -ga + (2 * ga * i) / nc, [x, z] = f === 0 ? [t, ga] : f === 1 ? [ga, -t] : f === 2 ? [-t, -ga] : [-ga, t]; tbColumn(acc, x, z, ph, T1.h - 0.45, 0.34, f % 2); }
  for (const [w, d, x, z] of [[2 * ga + 0.4, 0.36, 0, ga], [2 * ga + 0.4, 0.36, 0, -ga], [0.36, 2 * ga, ga, 0], [0.36, 2 * ga, -ga, 0]]) acc.add('beamT', boxB(w, 0.34, d, x, y1 - 0.79, z));
  put(acc, 'arga', boxB(T1.w, 0.45, T1.w, 0, y1 - 0.45, 0)); put(acc, 'floor', boxB(T1.core - 1.4, 0.04, T1.core - 1.4, 0, ph, 0));
  const G1 = frame({ W: T1.w, D: T1.w, yRef: y1, k: 0 }); penbeyBand(acc, G1, y1 - 0.75, y1 + 0.5, { gold: 2.0, T: 0.45 }); wring(acc, 'coping', G1.grow(0.12), y1 + 0.66, y1 + 0.8, 0.6);
  // tầng 2 (kiểu Hán): vách vàng nhạt, cửa sổ song lớn, vòng cột hiên trên sân thượng tầng 1, penbey, mái bằng
  const T2 = s.t2, y2 = y1 + T2.h, C2 = frame({ W: T2.core, D: T2.core, yRef: y1, k: 0.02 });
  wring(acc, 'wallLY', C2, y1, y2, 0.5, [0, 1, 2, 3].map((f) => ({ f, u0: -0.9, u1: 0.9, y0: y1 - 1, y1: y1 + 2.3 })));
  for (let f = 0; f < 4; f++) { acc.add('door', xf(box(1.8, 2.3, 0.1, 0, 1.15, -0.25), C2.M(f, 0, y1, 0))); for (const u of [-2.4, 2.4]) tbWindow(acc, C2.M(f, u, y1 + 0.9), { w: 1.3, h: 1.4, pane: 'win', layers: 1 }); }
  const ga2 = T2.w / 2 - 0.4; for (let i = 0; i < 4; i++) for (const f of [0, 1, 2, 3]) { const t = -ga2 + (2 * ga2 * i) / 4, [x, z] = f === 0 ? [t, ga2] : f === 1 ? [ga2, -t] : f === 2 ? [-t, -ga2] : [-ga2, t]; tbColumn(acc, x, z, y1, T2.h - 0.45, 0.3, f % 2); }
  put(acc, 'arga', boxB(T2.w, 0.4, T2.w, 0, y2 - 0.4, 0));
  const G2 = frame({ W: T2.w, D: T2.w, yRef: y2, k: 0 }); penbeyBand(acc, G2, y2 - 0.65, y2 + 0.4, { gold: 1.6, T: 0.4 }); wring(acc, 'coping', G2.grow(0.12), y2 + 0.56, y2 + 0.7, 0.5);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) gyaltsen(acc, sx * (T2.w / 2 - 0.35), y2 + 0.7, sz * (T2.w / 2 - 0.35), 0.6);
  // tầng 3: điện lục giác mái vàng kiểu Mông Cổ / Hán có chóp (03 › lukhang §2: «hor phibs tog can»)
  const g3 = gyaphib(acc, { y: y2 + 0.1, hex: s.t3.a, colH: s.t3.h, over: s.t3.over, dk: 0.045, walls: 'lattice', s: 1.1 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) gyaltsen(acc, sx * (T1.w / 2 - 0.3), y1 + 0.8, sz * (T1.w / 2 - 0.3), 0.55);
  const b = bbox(acc);
  return { acc, info: { W: T1.w, D: T1.w, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph, eave: y1, top: r2(b.max.y), storeys: 3, kind: 'lukhang', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}

/** HỒ TÂM ĐÌNH — theo Tsokyil Phodrang, Norbulingka (03 › island B): thềm đá lan can, tầng 1 tường Tạng, tầng 2 đình Hán mái vàng yết sơn */
export function tbIslandPav(s) {
  const acc = new Acc(), T = s.terrace;
  put(acc, 'stone', boxB(T.w, T.h, T.w, 0, 0, 0)); acc.add('marble', boxB(T.w + 0.06, 0.12, T.w + 0.06, 0, T.h - 0.12, 0)); acc.plat({ x: 0, z: 0, w: T.w, d: T.w, top: T.h });
  const pa = T.w / 2 - 0.3, sw = 1.7; balustrade(acc, [[-sw, pa], [-pa, pa], [-pa, -pa], [pa, -pa], [pa, pa], [sw, pa]], T.h, { key: 'marble' });
  stoneStair(acc, { z0: T.w / 2, w: 3.0, h: T.h, key: 'stone', flank: 'marble', ft: 0.35 });
  const r = tbBlock({ acc, W: s.W, D: s.W, k: 0.03, y0: T.h, ph: T.h + 0.15, H: s.H, wall: 'wallW', Ttop: 0.6, Tbot: 0.8, door: { w: 2.5, h: 2.7 }, rows: [{ y: T.h + 1.2, w: 0.9, h: 1.3, step: 2.6, margin: 1.4 }], penbey: { h: 0.9, gold: 1.6 }, parapet: { h: 0.6 } });
  gyaphib(acc, { y: r.info.yR, W: s.gW, D: s.gW, colH: s.colH, over: s.over, dk: 0.05, walls: 'lattice', ridgeH: 0.45 });
  const b = bbox(acc);
  return { acc, info: { W: s.W, D: s.W, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph: T.h, eave: r.info.yR, top: r2(b.max.y), storeys: 2, kind: 'islandpav', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}

/** ĐÌNH HÁN VEN HỒ (Norbulingka / vườn Lukhang — 03 › lake1, lake2): đình vuông cột trống mái vàng, lan can đá, rèm shambu dưới xà, dây cờ */
export function tbLakePav(s) {
  const { acc, info } = cnPavilion({ n: 4, a: s.a, colH: s.colH, colD: s.colD ?? 0.34, plinth: s.plinth, tiers: 1, over: s.over, tile: s.tile, dagong: s.dk || 0, lift: s.lift ?? 0.4 });
  const R = s.a / Math.cos(Math.PI / 4), vert = (k) => { const t = (2 * Math.PI * k) / 4 + Math.PI / 4; return [Math.cos(t) * R, Math.sin(t) * R]; };
  for (let k = 0; k < 4; k++) { const [ax, az] = vert(k - 1), [bx, bz] = vert(k), L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2; acc.add('shambu', bxT(L - 0.4, 0.45, 0.04, (ax + bx) / 2 * 1.02, s.plinth + s.colH - 0.95, (az + bz) / 2 * 1.02, 0.4, 0, ry)); }
  if (s.rail) { const pa = info.W / 2 - 0.25, sw = 1.5; balustrade(acc, [[-sw, pa], [-pa, pa], [-pa, -pa], [pa, -pa], [pa, pa], [sw, pa]], s.plinth, { h: 0.9, step: 1.4, key: 'marble' }); }
  if (s.flags) { const top = V(0, info.top - 0.4, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const p = V(sx * (info.W / 2 + 1.6), 0, sz * (info.W / 2 + 1.6)); acc.add('wood', cyl(0.06, 0.05, 3.2, p.x, 0, p.z, 6)); flagLine(acc, top, V(p.x, 3.1, p.z)); } }
  const b = bbox(acc);
  return { acc, info: { ...info, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), top: r2(b.max.y), eave: s.plinth + s.colH, x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z), kind: 'lakepav' } };
}

/** CHORTEN CỔNG Pargo Kaling (03 › ramp1): đế vuông có lối qua giữa (trần vẽ mandala), 3 cấp thềm, bình bầu chuông Kadampa, harmika, 13 vòng, lọng, nhật nguyệt */
export function tbChorten(s) {
  const acc = new Acc(), B = s.base, pw = s.pass.w, phH = s.pass.h, k = 0.03;
  const F = frame({ W: B.w, D: B.w, yRef: 0, k });
  wring(acc, 'chorten', F, 0, B.h, B.w / 2 - pw / 2 - 0.1, [{ f: 0, u0: -pw / 2, u1: pw / 2, y0: -1, y1: phH }, { f: 2, u0: -pw / 2, u1: pw / 2, y0: -1, y1: phH }]);
  const [wt] = F.dims(B.h); put(acc, 'chorten', boxB(wt - 0.1, B.h - phH, B.w - 0.6, 0, phH, 0)); // khối đặc trên lối qua
  acc.add('mandala', boxB(pw, 0.04, B.w - 1.2, 0, phH - 0.04, 0)); // trần lối qua vẽ mandala
  for (const f of [0, 2]) { const M = F.M(f, 0, 0, 0); for (const sd of [-1, 1]) acc.add('wallR', xf(box(0.3, phH, 0.08, sd * (pw / 2 + 0.15), phH / 2, 0.03), M)); acc.add('lintel', xf(bxT(pw + 0.9, 0.25, 0.4, 0, phH + 0.12, 0.15, 0.8), M)); acc.add('black', xf(box(pw + 1.1, 0.1, 0.55, 0, phH + 0.3, 0.22), M)); }
  // hàng đá mani dọc chân (đề xuất 03 › ramp1 §7)
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) acc.add('stone', boxB(0.45, 0.35, 0.18, sx * (B.w / 2 + 0.3), 0, -B.w / 2 + 0.7 + i * (B.w - 1.4) / 5));
  // dải đỏ trên đế + 3 cấp thềm (sư tử toạ / bậc) trắng viền đỏ
  wring(acc, 'wallR', F.grow(0.03), B.h - 0.5, B.h, 0.4); let y = B.h;
  acc.add('coping', boxB(wt + 0.3, 0.14, wt + 0.3, 0, y, 0)); y += 0.14;
  for (const [w, h] of s.steps) { put(acc, 'chorten', boxB(w, h, w, 0, y, 0)); acc.add('wallR', boxB(w + 0.04, 0.12, w + 0.04, 0, y + h - 0.16, 0)); y += h; }
  // bình (bumpa) bầu chuông, bệ sen
  const bp = s.bumpa, yb = y;
  acc.add('chorten', latheC([[bp.r + 0.25, 0], [bp.r + 0.25, 0.25], [bp.r, 0.3], [bp.r * 1.04, bp.h * 0.35], [bp.r * 0.98, bp.h * 0.62], [bp.r * 0.8, bp.h * 0.86], [bp.r * 0.45, bp.h], [0.001, bp.h]], 0, yb, 0, 28));
  acc.add('wallR', latheC([[bp.r + 0.28, 0.24], [bp.r + 0.28, 0.32], [0.001, 0.32]], 0, yb, 0, 28));
  acc.add('gold', box(1.0, 1.1, 0.12, 0, yb + bp.h * 0.5, bp.r * 1.02)); acc.add('dark', box(0.7, 0.85, 0.05, 0, yb + bp.h * 0.5, bp.r * 1.08)); // khám (gtor-phug)
  y = yb + bp.h;
  // harmika
  const hm = s.harmika; put(acc, 'chorten', boxB(hm.w, hm.h, hm.w, 0, y, 0)); acc.add('wallR', boxB(hm.w + 0.04, 0.2, hm.w + 0.04, 0, y + hm.h - 0.35, 0)); acc.add('coping', boxB(hm.w + 0.4, 0.15, hm.w + 0.4, 0, y + hm.h, 0)); y += hm.h + 0.15;
  // trụ 13 vòng (bhumi) mạ vàng, côn
  const sp = s.spire, prof = [];
  for (let i = 0; i < 13; i++) { const t0 = i / 13, t1 = (i + 0.85) / 13, r0 = sp.r0 + (sp.r1 - sp.r0) * t0, r1 = sp.r0 + (sp.r1 - sp.r0) * t1; prof.push([r0, sp.h * t0], [r0, sp.h * t1], [r1 * 0.86, sp.h * t1], [r1 * 0.86, sp.h * (i + 1) / 13]); }
  prof.push([0.001, sp.h]); acc.add('gold', latheC(prof, 0, y, 0, 16)); y += sp.h;
  // lọng + nhật nguyệt + búp
  acc.add('gold', latheC([[0.15, 0], [sp.r1 * 1.9, 0.12], [sp.r1 * 1.9, 0.3], [0.3, 0.55], [0.12, 0.65]], 0, y, 0, 16)); y += 0.65;
  const moon = Array.from({ length: 19 }, (_, i) => { const a = Math.PI * (i / 18); return [Math.cos(a) * 0.55, -Math.sin(a) * 0.55 + 0.55]; }).concat(Array.from({ length: 19 }, (_, i) => { const a = Math.PI * (1 - i / 18); return [Math.cos(a) * 0.4, -Math.sin(a) * 0.3 + 0.55]; }));
  acc.add('gold', slabXY(moon, 0.1, 0, y, 0)); const sun = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16); sun.rotateX(Math.PI / 2); sun.translate(0, y + 0.85, 0); acc.add('gold', sun);
  acc.add('gold', latheC([[0.12, 0], [0.16, 0.2], [0.001, 0.6]], 0, y + 1.15, 0, 10)); y += 1.75;
  // dây cờ từ lọng xuống 4 góc đế
  if (s.flags) { const a = V(0, y - 2.4, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) flagLine(acc, a, V(sx * (B.w / 2 + 3.5), 0.4, sz * (B.w / 2 + 3.5))); for (const sx of [-1, 1]) for (const sz of [-1, 1]) acc.add('stone', boxB(0.5, 0.5, 0.5, sx * (B.w / 2 + 3.5), 0, sz * (B.w / 2 + 3.5))); }
  const b = bbox(acc);
  return { acc, info: { W: B.w, D: B.w, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph: 0, eave: B.h, top: r2(y), kind: 'chorten', pass: pw, x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}

/** SÂN DEYANG SHAR — sân khấu múa cham (bổ sung game) + cột cờ darchen + 2 lư hương sang-khang (03 › deyang §8) */
export function tbStage(s) {
  const acc = new Acc(), w = s.w, h = s.h;
  put(acc, 'wallS', boxB(w, h - 0.1, w, 0, 0, 0)); put(acc, 'arga', boxB(w - 0.1, 0.1, w - 0.1, 0, h - 0.1, 0)); acc.add('wallW', boxB(w + 0.06, 0.16, w + 0.06, 0, h - 0.26, 0)); acc.plat({ x: 0, z: 0, w, d: w, top: h });
  for (let f = 0; f < 4; f++) { const g = new Acc(); stoneStair(g, { z0: w / 2, w: 3.0, h, key: 'stone' }); mergeInto(acc, g, 0, 0, (f * Math.PI) / 2); }
  // darchen: cột gỗ cao, đỉnh búp lông yak + lọng, dây cờ toả xuống 4 góc
  const zc = -w / 2 + 1.6; acc.add('stone', boxB(1.4, 0.7, 1.4, 0, h, zc)); acc.add('wood', cyl(0.18, 0.12, s.pole, 0, h + 0.7, zc, 10));
  acc.add('yak', latheC([[0.001, 0], [0.45, 0.3], [0.4, 0.9], [0.001, 1.3]], 0, h + 0.7 + s.pole - 0.4, zc, 10)); acc.add('gold', latheC([[0.12, 0], [0.18, 0.25], [0.001, 0.6]], 0, h + 0.7 + s.pole + 0.9, zc, 8));
  for (let i = 0; i < 4; i++) acc.add('flag', bxT(0.06, 3.2, 0.5, 0.25 * Math.cos(i * 1.57), h + 0.7 + s.pole - 4.3, zc + 0.25 * Math.sin(i * 1.57), 0.5, 0, i * 1.57));
  const top = V(0, h + 0.7 + s.pole - 1.2, zc);
  for (const [x, z] of [[-w / 2 + 0.4, w / 2 - 0.4], [w / 2 - 0.4, w / 2 - 0.4], [-w / 2 + 0.4, -w / 2 + 0.4], [w / 2 - 0.4, -w / 2 + 0.4]]) { acc.add('wood', cyl(0.05, 0.04, 1.2, x, h, z, 6)); flagLine(acc, top, V(x, h + 1.15, z)); }
  // hai lư hương sang-khang (bếp trắng, ống khói tròn) trước sân khấu
  for (const sx of [-1, 1]) { const x = sx * (w / 2 - 1.6), z = w / 2 + 2.6; acc.add('chorten', boxB(1.6, 1.0, 1.6, x, 0, z)); acc.add('chorten', latheC([[0.62, 0], [0.55, 1.0], [0.2, 1.4], [0.2, 2.1], [0.001, 2.1]], x, 1.0, z, 12)); acc.add('dark', box(0.45, 0.4, 0.05, x, 0.55, z + 0.81)); acc.add('gold', latheC([[0.24, 0], [0.12, 0.15], [0.001, 0.45]], x, 3.1, z, 8)); }
  const b = bbox(acc);
  return { acc, info: { W: w, D: w, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph: h, top: r2(b.max.y), kind: 'stage', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}

// ---------------------------------------------------------------- LẦU 10 TẦNG — HỒNG CUNG (03 › lau10)
/**
 * Vỏ ngoài Hồng Cung từ towerSpec của game (n = 4): bệ đá trắng nghiêng 3 hàng khe sáng (地垄墙) · khối lăng trụ đỏ tường
 * nghiêng LIÊN TỤC 10 % (không thu bậc) · mỗi tầng 1 hàng cửa viền đen · dải cửa lưới đứng 7 tầng giữa mặt Nam ·
 * T10 toàn penbey gắn pháp luân đôi nai + đĩa vàng · mái arga có gyaphib (mái vàng yết sơn + lục giác) và gyaltsen.
 */
export function tbTower(ts, o = {}) {
  const acc = new Acc(), FH = ts.FH, P = ts.podium, fl = ts.floors, k = 0.1, a0 = fl[0].a;
  // bệ: khối đặc trắng nghiêng (cạnh đỉnh = 2·P.a = mặt đi được của game), chân đá xám, 3 hàng khe sáng, tường chắn có miệng bậc
  const FP = frame({ W: 2 * P.a, D: 2 * P.a, yRef: P.y, k });
  put(acc, 'wallW', frustum(2 * P.a + 2 * k * P.y, 2 * P.a + 2 * k * P.y, 0, P.y, k * P.y, k * P.y)); acc.plat({ x: 0, z: 0, w: 2 * P.a, d: 2 * P.a, top: P.y });
  wring(acc, 'wallS', FP.grow(0.05), 0, 2.2, 1.0); put(acc, 'arga', boxB(2 * P.a - 0.4, 0.06, 2 * P.a - 0.4, 0, P.y, 0));
  const sw = P.stairW / 2;
  for (const y of [2.6, 5.2, 7.8]) for (let f = 0; f < 4; f++) for (const u of rowUs(FP.len(f, y), 3.2, 1.8, f, [[0, -sw - 2.2, sw + 2.2]], 0.45)) tbWindow(acc, FP.M(f, u, y), { w: 0.45, h: 1.0, kind: 'slit' });
  wring(acc, 'wallW', FP, P.y, P.y + 1.1, 0.7, [{ f: 0, u0: -sw, u1: sw, y0: P.y - 1, y1: P.y + 5 }]); wring(acc, 'parBR', FP.grow(0.03), P.y + 0.75, P.y + 1.1, 0.5, [{ f: 0, u0: -sw, u1: sw, y0: P.y - 1, y1: P.y + 5 }]);
  wring(acc, 'coping', FP.grow(0.12), P.y + 1.1, P.y + 1.26, 0.9, [{ f: 0, u0: -sw - 0.12, u1: sw + 0.12, y0: P.y, y1: P.y + 5 }]);
  // đại thang trước bệ: bậc đá + hai tường má đỏ thẫm (penbey) mặt trên dốc
  for (let i = 1; i <= P.steps; i++) { const z = P.a + P.run - (i - 0.5) * P.tread; acc.add('stone', boxB(P.stairW, i * P.rise, P.tread, 0, 0, z)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top: i * P.rise }); }
  for (const s of [-1, 1]) { const x0 = s * sw, x1 = s * (sw + 1.3), zA = P.a - 0.6, zB = P.a + P.run + 0.2; put(acc, 'penbeyD', hexa([[x0, 0, zA], [x1, 0, zA], [x1, 0, zB], [x0, 0, zB], [x0, P.y + 1.1, zA], [x1, P.y + 1.1, zA], [x1, 1.1, zB], [x0, 1.1, zB]])); acc.add('coping', beam(V((x0 + x1) / 2, P.y + 1.2, zA), V((x0 + x1) / 2, 1.2, zB), 1.46, 0.18)); }
  // thân: tường đỏ nghiêng liên tục — mặt ngoài tại chân tầng k = a_k + 0,8, mặt trong đứng a_k − 0,3 (vách va chạm của game: a ± 0,3)
  const FT = frame({ W: 2 * (a0 + 0.8), D: 2 * (a0 + 0.8), yRef: fl[0].y, k: (0.5 / FH) });
  const doorW = o.doorW ?? 3.2, doorH = 3.8;
  const dOpen = [{ f: 0, u0: -doorW / 2, u1: doorW / 2, y0: fl[0].y - 1, y1: fl[0].y + doorH }], FTL = FT.grow(-0.49);
  wring(acc, 'wallR', FT, fl[0].y, ts.deck.y, 0.5, dOpen, true); // vỏ đỏ liền một khối từ chân tới mái
  fl.forEach((f) => wring(acc, 'wallR', FTL, f.y, f.y + FH, FTL.nOut(0, f.y) - (f.a - 0.3), dOpen)); // lót trong: mặt trong đứng tại a − 0,3 mỗi tầng
  tbDoor(acc, FT.M(0, 0, fl[0].y, 0), doorW, doorH, { depth: 1.2 });
  // cửa sổ: mỗi tầng một hàng (bệ 3 hàng khe + 10 tầng = 13 hàng nhìn ngoài — 03 › lau10 §4)
  const G = o.grid; // dải cửa lưới giữa mặt trước
  fl.forEach((f, i) => {
    if (i === fl.length - 1) return; // T10 là dải penbey
    const y = f.y + (i === 0 ? 1.3 : 1.2), [w, h] = i === 0 ? [0.85, 1.25] : i < 4 ? [1.0, 1.6] : [1.15, 1.85];
    for (let fc = 0; fc < 4; fc++) {
      const skip = [];
      if (fc === 0 && i >= G.k0 && i <= G.k1) skip.push([0, -G.w / 2 - 0.9, G.w / 2 + 0.9]);
      if (fc === 0 && i === 0) skip.push([0, -doorW / 2 - 1.6, doorW / 2 + 1.6]);
      for (const u of rowUs(FT.len(fc, y), 3.4, 2.0, fc, skip, w)) tbWindow(acc, FT.M(fc, u, y), { w, h, layers: i >= 4 ? 2 : 1 });
    }
  });
  // dải cửa lưới đứng (竖向大窗格) — khung gỗ nâu sẫm, ô song lớn, lanh tô + rèm mỗi tầng, hai má đen (03 › lau10 §4–5)
  const yG0 = fl[G.k0].y + 0.5, yG1 = fl[G.k1].y + FH - 0.2;
  for (const s of [-1, 1]) for (let i = G.k0; i <= G.k1; i++) { const y = fl[i].y; acc.add('black', xf(box(0.7, FH, 0.2, s * (G.w / 2 + 0.35), FH / 2, 0.06), FT.M(0, 0, y, 0))); }
  acc.add('black', xf(slabXY([[-G.w / 2 - 1.6, -1.0], [G.w / 2 + 1.6, -1.0], [G.w / 2 + 0.7, 0], [-G.w / 2 - 0.7, 0]], 0.2, 0, 0, 0.06), FT.M(0, 0, yG0, 0)));
  for (let i = G.k0; i <= G.k1; i++) {
    const y = fl[i].y, M = FT.M(0, 0, y, 0), wi = (G.w - (G.n + 1) * 0.3) / G.n, hy = 0.55, hh = FH - 1.55;
    acc.add('gridF', xf(box(G.w, 0.32, 0.36, 0, hy - 0.16, 0.12), M));
    for (let j = 0; j <= G.n; j++) acc.add('gridF', xf(box(0.3, hh, 0.34, -G.w / 2 + 0.15 + j * (wi + 0.3), hy + hh / 2, 0.12), M));
    for (let j = 0; j < G.n; j++) { const u = -G.w / 2 + 0.3 + wi / 2 + j * (wi + 0.3); acc.add('gridW', xf(box(wi, hh, 0.08, u, hy + hh / 2, 0.02), M)); acc.add('shambu', xf(bxT(wi + 0.1, 0.42, 0.04, u, hy + hh - 0.21, 0.36, 0.4), M)); }
    acc.add('col', xf(box(G.w + 0.4, 0.1, 0.4, 0, hy + hh + 0.05, 0.17), M)); acc.add('lintel', xf(bxT(G.w + 0.6, 0.18, 0.56, 0, hy + hh + 0.19, 0.24, 0.8), M)); acc.add('black', xf(box(G.w + 0.8, 0.09, 0.72, 0, hy + hh + 0.32, 0.3), M));
    acc.add('lintel', xf(bxT(G.w + 1.0, 0.16, 0.86, 0, hy + hh + 0.45, 0.37, 0.8), M)); acc.add('black', xf(box(G.w + 1.2, 0.09, 1.0, 0, hy + hh + 0.58, 0.44), M));
  }
  // T10: penbey cả tầng + pháp luân đôi nai giữa mặt trước + đĩa vàng; trên: dải trắng, gờ đá; tường chắn mái (lan can Vọng Đài)
  const top = fl[fl.length - 1], yP0 = top.y + 0.2, yDeck = ts.deck.y;
  wring(acc, 'wallR', FT, yDeck, yDeck + 0.95, 0.6);
  penbeyBand(acc, FT, yP0, yDeck + 0.95, { gold: 2.6, T: 0.9, wheel: 2.3, skip: [[0, -6.5, 6.5]] });
  for (const u of [-5.4, 5.4]) medallion(acc, FT.M(0, u, yP0 + 2.6, 0.05), 0.75);
  wring(acc, 'coping', FT.grow(0.12), yDeck + 1.11, yDeck + 1.3, 1.0);
  // mái arga + gyaphib (03 › lau10 §8: 1 lớn giữa + mái nhỏ; 5 yết sơn + 2 lục giác ở nguyên mẫu — ở đây 3 yết sơn + 2 lục giác)
  const aD = ts.deck.a - 0.3; put(acc, 'arga', boxB(2 * aD, 0.4, 2 * aD, 0, yDeck - 0.4, 0));
  for (const g of o.gyaphib || []) gyaphib(acc, { ...g, y: yDeck });
  const [wt] = FT.dims(yDeck + 1.3);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) gyaltsen(acc, sx * (wt / 2 - 0.6), yDeck + 1.3, sz * (wt / 2 - 0.6), 1.4);
  for (const [x, z] of [[0, -(wt / 2 - 0.6)], [-(wt / 2 - 0.6), -6], [wt / 2 - 0.6, -6], [-(wt / 2 - 0.6), 6], [wt / 2 - 0.6, 6]]) blackBanner(acc, x, yDeck + 1.3, z, 1.2);
  const b = bbox(acc);
  return { acc, info: { W: 2 * a0, D: 2 * a0, PW: r2(b.max.x - b.min.x), PD: r2(b.max.z - b.min.z), ph: P.y, eave: yDeck, top: r2(b.max.y), n: 4, floors: fl.length, kind: 'tower', x0: r2(b.min.x), x1: r2(b.max.x), z0: r2(b.min.z), z1: r2(b.max.z) } };
}
