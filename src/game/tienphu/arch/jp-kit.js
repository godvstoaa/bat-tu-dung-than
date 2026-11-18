// ============================================================================
//  BỘ KHUNG RIÊNG PHONG CÁCH NHẬT (thành quách Edo · dinh shoin-zukuri · sukiya) — theo docs/tienphu-nghiencuu/02-nhatban.md.
//  Vật liệu / texture thủ tục, khung mặt (face frame), mái Nhật (irimoya / yosemune / kirizuma / hōgyō / mái hiên vòng)
//  có biên dạng 反り nhẹ, mép hiên gần thẳng (§1.3, §1.5 mục 1 — KHÔNG vểnh kiểu Trung Hoa), sọc vữa mạch ngói (Himeji),
//  đầu hồi chidori-hafu / kara-hafu / irimoya-hafu, bệ đá ishigaki nghiêng cong (扇の勾配) có góc 算木積,
//  cửa sổ song, lỗ bắn 狭間, hộc thả đá 石落とし, shachi 鯱, onigawara 鬼瓦, gegyo 懸魚.
//  Chỉ jp.js / nhatban.js import file này.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Acc, box, boxB, cyl, beam, slabXY, lathe, ribAlong, silhouette, V } from './kit.js';

// ---------------------------------------------------------------- bảng màu (02 §1.4 và §6 từng mục)
export const JP = {
  plaster: '#F2F0EA', plaster2: '#E3E0D7', stone: '#9C968A', stoneJ: '#6E695F', tile: '#5E6266', rib: '#6B6F73', mortar: '#E8E6E0',
  wood: '#7A5C40', woodDk: '#3A3632', frame: '#6B4F36', black: '#1C1A18', iron: '#2E2C2A', gold: '#C9A24A', engawa: '#9A7B58',
  hinoki: '#5A3E2E', kokera: '#7A6A55', thatch: '#8C7A5A', earth: '#C8A97E', board: '#3A2E26', tatami: '#C9C08A', shoji: '#F4F1E6',
  fusuma: '#D4AF37', bark: '#5C4A3A', kunugi: '#4E3D30', ichiB: '#3E5A8C', ichiW: '#F2F2EE', doma: '#8A7660', sugi: '#C9A57A',
};

// ---------------------------------------------------------------- texture canvas (chỉ trong trình duyệt)
let SEED = 7; const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);
function canvasTex(w, h, draw, repeat = false) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; SEED = 7; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
const shade = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };
/** đá thành 打込接: hàng đá cao thấp xen, mạch tối (1 ô = 2,5 m) */
const stoneTex = () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = JP.stoneJ; g.fillRect(0, 0, w, h);
  let y = 0; while (y < h) { const rh = 34 + rnd() * 46; let x = -rnd() * 60; while (x < w) { const bw = 50 + rnd() * 90; g.fillStyle = shade(JP.stone, 0.82 + rnd() * 0.32); g.beginPath(); g.moveTo(x + 3 + rnd() * 4, y + 3); g.lineTo(x + bw - 3, y + 2 + rnd() * 5); g.lineTo(x + bw - 2 - rnd() * 5, y + rh - 3); g.lineTo(x + 3, y + rh - 2 - rnd() * 4); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x + 6, y + 5, bw * 0.5, 4); x += bw; } y += rh; }
}, true);
/** cửa trượt gỗ 舞良戸: khung, ván, nẹp ngang mảnh 舞良子 */
const mairadoTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = '#4a3726'; g.fillRect(0, 0, w, h); g.fillStyle = '#6e5238'; g.fillRect(9, 9, w - 18, h - 18);
  g.strokeStyle = '#3b2b1d'; g.lineWidth = 2; for (let y = 16; y < h - 12; y += 7) { g.beginPath(); g.moveTo(9, y); g.lineTo(w - 9, y); g.stroke(); }
  g.fillStyle = '#4a3726'; g.fillRect(9, h * 0.62, w - 18, 6);
});
/** vách giấy 明障子: giấy washi + song kumiko + ván chân (腰板) */
const shojiTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = JP.shoji; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a6a48'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
  g.lineWidth = 2; for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo((w * i) / 3, 0); g.lineTo((w * i) / 3, h * 0.8); g.stroke(); }
  for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, (h * 0.8 * i) / 8); g.lineTo(w, (h * 0.8 * i) / 8); g.stroke(); }
  g.fillStyle = '#7a5c40'; g.fillRect(0, h * 0.8, w, h * 0.2); g.fillStyle = '#5e4630'; g.fillRect(0, h * 0.8, w, 4);
});
/** fusuma nền vàng (tranh tùng Kanō) + khung sơn đen + núm kéo */
const fusumaTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = JP.fusuma; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(${40 + rnd() * 30},${80 + rnd() * 40},${50},0.55)`; g.beginPath(); g.ellipse(rnd() * w, h * (0.2 + rnd() * 0.5), 14 + rnd() * 18, 6 + rnd() * 6, 0, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = '#4b3220'; g.lineWidth = 5; g.beginPath(); g.moveTo(w * 0.3, h); g.bezierCurveTo(w * 0.4, h * 0.6, w * 0.2, h * 0.5, w * 0.55, h * 0.3); g.stroke();
  g.strokeStyle = '#1c1a18'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = '#1c1a18'; g.beginPath(); g.arc(w - 18, h * 0.55, 5, 0, Math.PI * 2); g.fill();
});
/** đầu hồi 狐格子 (song ô cờ sơn đen) — 1 ô texture = 1 m, mỗi m 4 ô */
const latticeTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#2a221d'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5b4634'; g.lineWidth = 5;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo((w * i) / 4, 0); g.lineTo((w * i) / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, (h * i) / 4); g.lineTo(w, (h * i) / 4); g.stroke(); }
  g.fillStyle = JP.gold; for (let i = 0; i <= 4; i++) for (let j = 0; j <= 4; j++) g.fillRect((w * i) / 4 - 2, (h * j) / 4 - 2, 4, 4);
}, true);
/** mái tranh 茅葺: sợi cỏ dọc dốc (1 ô = 1,5 m) */
const thatchTex = () => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = JP.thatch; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { const x = rnd() * w, y = rnd() * h, l = 10 + rnd() * 26; g.strokeStyle = shade(JP.thatch, 0.7 + rnd() * 0.55); g.lineWidth = 1 + rnd() * 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 3, y + l); g.stroke(); }
}, true);
/** mái ván mỏng 杮葺: hàng ván so le (1 ô = 1 m) */
const kokeraTex = () => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = JP.kokera; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 16; r++) { const y = (r * h) / 16; let x = (r % 2) * 9 - 9; while (x < w) { const bw = 12 + rnd() * 10; g.fillStyle = shade(JP.kokera, 0.78 + rnd() * 0.4); g.fillRect(x + 1, y + 1, bw - 1, h / 16 - 2); x += bw; } g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, y + h / 16 - 2, w, 2); }
}, true);
/** vách ván chồng có nẹp 簓子下見板 (đen) */
const boardTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = JP.board; g.fillRect(0, 0, w, h); g.strokeStyle = '#211913'; g.lineWidth = 3;
  for (let y = 10; y < h; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.fillStyle = '#2a201a'; for (let x = 12; x < w; x += 32) g.fillRect(x, 0, 7, h);
});
/** cánh cổng bọc sắt sơn đen, đinh tán, đai sắt */
const ironTex = () => canvasTex(128, 256, (g, w, h) => {
  g.fillStyle = JP.black; g.fillRect(0, 0, w, h); g.fillStyle = '#34312d';
  for (const y of [0.12, 0.38, 0.62, 0.88]) g.fillRect(0, h * y - 6, w, 12);
  g.fillStyle = '#4a463f'; for (let i = 0; i < 6; i++) for (let j = 0; j < 12; j++) { g.beginPath(); g.arc(12 + i * 21, 10 + j * 21, 3, 0, Math.PI * 2); g.fill(); }
});
/** giấy ô vuông xanh trắng 市松 (Shōkintei) */
const ichiTex = () => canvasTex(128, 128, (g, w, h) => { for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { g.fillStyle = (i + j) % 2 ? JP.ichiB : JP.ichiW; g.fillRect((i * w) / 6, (j * h) / 6, w / 6 + 1, h / 6 + 1); } });
/** tường đất 聚楽 (đốm rơm) */
const earthTex = () => canvasTex(128, 128, (g, w, h) => { g.fillStyle = JP.earth; g.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++) { g.fillStyle = shade(JP.earth, 0.8 + rnd() * 0.35); g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); } }, true);
/** chiếu tatami có viền đen */
const tatamiTex = () => canvasTex(128, 128, (g, w, h) => { g.fillStyle = JP.tatami; g.fillRect(0, 0, w, h); g.strokeStyle = '#a99f6c'; g.lineWidth = 1; for (let y = 0; y < h; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.fillStyle = '#2b2a22'; g.fillRect(0, 0, w, 5); g.fillRect(0, h - 5, w, 5); }, true);

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
const map = (t, color, o = {}) => std(t ? { map: t, ...o } : { color, ...o });
let MATS = null;
/** vật liệu Nhật — khoá dùng trong acc; khoá bắt đầu bằng 'tile' là mặt hở (mặt mái, mặt dưới hiên) */
export function jpMats() {
  if (MATS) return MATS;
  const DS = THREE.DoubleSide;
  MATS = {
    plaster: std({ color: JP.plaster, roughness: 0.92 }), plaster2: std({ color: JP.plaster2, roughness: 0.92 }),
    stone: map(stoneTex(), JP.stone), stoneC: std({ color: '#aaa496', roughness: 0.9 }), stoneDk: std({ color: JP.stoneJ }),
    void: std({ color: '#141210', roughness: 1 }), floor: std({ color: '#8a6a48' }), floorIn: std({ color: '#6f5a44' }), engawa: std({ color: JP.engawa, roughness: 0.7 }),
    wood: std({ color: JP.wood, roughness: 0.75 }), woodDk: std({ color: JP.woodDk, roughness: 0.75 }), frame: std({ color: JP.frame }), black: std({ color: JP.black, roughness: 0.4 }),
    gold: std({ color: JP.gold, roughness: 0.35, metalness: 0.7 }), iron: map(ironTex(), JP.black, { roughness: 0.5 }),
    mairado: map(mairadoTex(), '#6e5238'), shoji: map(shojiTex(), JP.shoji, { roughness: 0.95 }), fusuma: map(fusumaTex(), JP.fusuma, { roughness: 0.5, metalness: 0.2 }),
    lattice: map(latticeTex(), '#2a221d'), tatami: map(tatamiTex(), JP.tatami), earth: map(earthTex(), JP.earth, { roughness: 1 }),
    board: map(boardTex(), JP.board), ichi: map(ichiTex(), JP.ichiB), bark: std({ color: JP.bark, roughness: 1 }), kunugi: std({ color: JP.kunugi, roughness: 1 }),
    bamboo: std({ color: '#8f8a55', roughness: 0.6 }), doma: std({ color: JP.doma, roughness: 1 }), water: std({ color: '#2d3c3c', roughness: 0.15, metalness: 0.3 }),
    sugi: std({ color: JP.sugi }),
    // mái
    tileJp: std({ color: JP.tile, roughness: 0.6, side: DS }), ribJp: std({ color: JP.rib, roughness: 0.55 }), ridgeJp: std({ color: '#55595d', roughness: 0.55 }),
    mortar: std({ color: JP.mortar, roughness: 0.9 }),
    tileHinoki: std({ color: JP.hinoki, roughness: 0.95, side: DS }), hinokiEdge: std({ color: '#4a3326', roughness: 0.95 }),
    tileKokera: map(kokeraTex(), JP.kokera, { side: DS, roughness: 0.95 }), kokeraEdge: std({ color: '#6a5b48', roughness: 0.95 }),
    tileThatch: map(thatchTex(), JP.thatch, { side: DS, roughness: 1 }), thatchEdge: map(thatchTex(), '#7a6a4c', { roughness: 1, color: '#cfc2a6' }), thatchRidge: std({ color: '#4c4030', roughness: 1 }),
    tileSoffitW: std({ color: JP.plaster, roughness: 0.95, side: DS }), tileSoffitWood: std({ color: '#5e4630', roughness: 0.9, side: DS }), tileSoffitBark: std({ color: '#6a5a44', roughness: 1, side: DS }),
  };
  return MATS;
}
/** bộ khoá vật liệu mái theo loại lợp */
export const ROOFK = {
  castle: { tile: 'tileJp', rib: 'ribJp', edge: 'plaster', ridge: 'ridgeJp', mortar: 'mortar', soffit: 'tileSoffitW', gable: 'plaster', barge: 'plaster', gegyo: 'plaster', oni: 'ridgeJp' },
  palace: { tile: 'tileJp', rib: 'ribJp', edge: 'wood', ridge: 'ridgeJp', soffit: 'tileSoffitWood', gable: 'lattice', barge: 'wood', gegyo: 'gold', oni: 'ridgeJp', fit: 'gold' },
  hinoki: { tile: 'tileHinoki', edge: 'hinokiEdge', ridge: 'ridgeJp', soffit: 'tileSoffitWood', gable: 'lattice', barge: 'wood', gegyo: 'gold', oni: 'ridgeJp', fit: 'gold' },
  kokera: { tile: 'tileKokera', edge: 'kokeraEdge', ridge: 'kokeraEdge', soffit: 'tileSoffitWood', gable: 'plaster', barge: 'frame', gegyo: 'frame', oni: 'kokeraEdge' },
  thatch: { tile: 'tileThatch', edge: 'thatchEdge', ridge: 'thatchRidge', soffit: 'tileSoffitBark', gable: 'bamboo', barge: 'bark', gegyo: 'bark', oni: 'thatchRidge' },
};

// ---------------------------------------------------------------- khung mặt & tiện ích
/** ma trận khung mặt: x cục bộ = u (phải khi nhìn từ ngoài vào), z cục bộ = pháp tuyến ra ngoài, gốc (ox, oy, oz) */
export function frameM(nx, nz, ox = 0, oz = 0, oy = 0) { const m = new THREE.Matrix4().makeRotationY(Math.atan2(nx, nz)); m.setPosition(ox, oy, oz); return m; }
export const FACE = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] };
export const put = (acc, m, key, g) => (g ? acc.add(key, m ? g.applyMatrix4(m) : g) : null);
/** chép acc con vào acc cha qua phép đặt (x, z, ry) — kể cả mặt đi được */
export function place(dst, src, x = 0, z = 0, ry = 0, y = 0) {
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z), c = Math.cos(ry), s = Math.sin(ry);
  for (const [k, list] of src.parts) for (const g of list) dst.add(k, g.applyMatrix4(m));
  for (const q of src.plats) dst.plat({ ...q, x: x + c * q.x + s * q.z, z: z - s * q.x + c * q.z, ry: (q.ry || 0) + ry, top: q.top + y });
  return dst;
}
/** lưới tứ giác có uv cho trước (mét) */
export function gridUV(rows, uvs) {
  const nI = rows.length, nJ = rows[0].length, pos = [], uv = [], idx = [];
  for (let i = 0; i < nI; i++) for (let j = 0; j < nJ; j++) { const p = rows[i][j]; pos.push(p.x, p.y, p.z); uv.push(uvs[i][j][0], uvs[i][j][1]); }
  for (let i = 0; i < nI - 1; i++) for (let j = 0; j < nJ - 1; j++) { const a = i * nJ + j, b = a + 1, c = a + nJ, d = c + 1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
/** đa giác (u, y) đùn dày t theo v, đặt tại mặt v = v0 (khung mặt) */
export const panel = (pts, t, v0 = 0) => slabXY(pts, t, 0, 0, v0);
/** biên dạng (v, y) đùn dọc u từ u0 tới u1 (khung mặt) — dùng cho bậu, hộc chìa, gờ */
export function profU(pts, u0, u1) {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([v, y]) => new THREE.Vector2(v, y))), { depth: u1 - u0, bevelEnabled: false });
  g.rotateY(-Math.PI / 2); g.translate(u1, 0, 0); return g;
}
/** thanh tròn ngang dọc trục x (xà gồ, cây ngói nóc) */
export const rodX = (L, r, x, y, z, seg = 8) => new THREE.CylinderGeometry(r, r, L, seg).rotateZ(Math.PI / 2).translate(x, y, z);
export const rodZ = (L, r, x, y, z, seg = 8) => new THREE.CylinderGeometry(r, r, L, seg).rotateX(Math.PI / 2).translate(x, y, z);

// ---------------------------------------------------------------- linh kiện trang trí
/** shachi 鯱 (cá đầu hổ, đuôi vểnh) — biên dạng trong mặt phẳng (x, y), chân tại gốc; dir = +1 đầu quay về +x */
const SHACHI = [[-0.32, 0], [0.42, 0], [0.5, 0.18], [0.36, 0.3], [0.44, 0.42], [0.3, 0.5], [0.18, 0.62], [0.12, 0.8], [0.2, 0.98], [0.42, 1.12], [0.5, 1.32], [0.3, 1.24], [0.12, 1.12], [-0.04, 1.3], [-0.16, 1.22], [-0.08, 1.02], [-0.16, 0.86], [-0.3, 0.74], [-0.24, 0.56], [-0.4, 0.4], [-0.3, 0.24], [-0.42, 0.12]];
export function shachi(acc, m, x, y, z, s, dir, key, ry = 0) { put(acc, m, key, silhouette(SHACHI.map(([a, b]) => [-dir * a, b]), 0.34, x, y, z, ry, s)); }
/** onigawara 鬼瓦: khối + hai tai, mặt quay theo ry (0 = nhìn +z) */
export function oni(acc, m, x, y, z, s, ry, key) {
  const pts = [[-0.5, 0], [0.5, 0], [0.5, 0.62], [0.68, 0.98], [0.32, 0.86], [0.18, 1.02], [-0.18, 1.02], [-0.32, 0.86], [-0.68, 0.98], [-0.5, 0.62]];
  put(acc, m, key, silhouette(pts, 0.3, x, y, z, ry, s));
}
/** gegyo 懸魚 (猪目懸魚: thân giọt nước có vây hai bên) treo dưới đỉnh đầu hồi; mặt quay theo ry */
const GEGYO = [[0, 0], [0.22, -0.04], [0.92, -0.16], [0.7, -0.34], [0.34, -0.3], [0.42, -0.62], [0.26, -0.92], [0, -1.15], [-0.26, -0.92], [-0.42, -0.62], [-0.34, -0.3], [-0.7, -0.34], [-0.92, -0.16], [-0.22, -0.04]];
export function gegyo(acc, m, x, y, z, s, ry, key) { put(acc, m, key, silhouette(GEGYO, 0.16, x, y, z, ry, s)); }
/** huy hiệu tròn (葵紋 / 桐紋) — đĩa vàng nhỏ */
export function crest(acc, m, x, y, z, r, ry, key = 'gold') { const g = new THREE.CylinderGeometry(r, r, 0.08, 14).rotateX(Math.PI / 2); g.rotateY(ry); g.translate(x, y, z); put(acc, m, key, g); }

// ---------------------------------------------------------------- MÁI NHẬT
/**
 * Mái chữ nhật cục bộ (nóc chạy theo x, tâm (0,0)), đặt bằng ma trận o.m.
 *  ex, ez: nửa kích thước tới MÉP HIÊN; yE: cao mép hiên giữa cạnh dài; prof: roofProfile(run = ez, …)
 *  ends: [đầu −x, đầu +x] ∈ 'hip' (mái chái / yosemune) | 'irimoya' (chái + đầu hồi) | 'gable' (kirizuma, hồi mở ra tới ex) | 'open' (vùi vào khối khác)
 *  dG: khoảng ngang từ mép hiên tới chân đầu hồi irimoya; verge: mái chìa qua mặt hồi; dMax: dừng ở d = dMax (mái hiên vòng 腰屋根)
 *  lift: nhích góc (m, NHỎ — mái Nhật gần thẳng); rib: bước ngói ống (≥ 1e3 = không có); mortar: sọc vữa trắng hai bên ngói ống (Himeji)
 *  K: khoá vật liệu (ROOFK.*); ridgeH: cao bờ nóc; ridgeEnd: 'shachi' | 'oni'; soffit: bề sâu mặt dưới hiên (0 = không)
 *  trả { top (đỉnh bờ nóc), yT (mặt nóc), Y(x,z,d), xEnd(i,d), dTop }
 */
export function jpRoof(acc, o) {
  const { ex, ez, yE, prof, ends = ['irimoya', 'irimoya'], lift = 0.22, liftPow = 4, rib = 0.45, ribW = 0.2, mortar = false, thick = 0.28, soffit = 0, verge = 0.5, K } = o;
  const sub = new Acc(), P = prof.P, run = prof.run, dMax = o.dMax ?? Infinity, dTop = Math.min(run, dMax), ring = dMax < run - 1e-6;
  const dG = o.dG ?? 0, UVS = 1;
  const typ = (i) => (ring ? 'hip' : ends[i]);
  const xEnd = (i, d) => { const t = typ(i); if (t === 'hip') return Math.max(0, ex - d); if (t === 'irimoya') return d <= dG + 1e-4 ? ex - d : ex - dG + verge; return ex; };
  const Lf = (x, z) => lift * Math.pow(Math.min(1, Math.abs(x) / ex), liftPow) * Math.pow(Math.min(1, Math.abs(z) / ez), liftPow);
  const Y = (x, z, d) => yE + P(d) + Lf(x, z);
  let ds = prof.ds.filter((d) => d < dTop - 0.05); ds.push(dTop);
  if (!ring && (typ(0) === 'irimoya' || typ(1) === 'irimoya')) { ds = ds.filter((d) => Math.abs(d - dG) > 0.15); ds.push(dG, dG + 0.003); ds.sort((a, b) => a - b); }
  const dsR = ds.filter((d, i) => i === 0 || d - ds[i - 1] > 0.05);                                     // mẫu cho gân ngói (bỏ điểm trùng ở chân hồi)
  const NX = o.nx || 16;
  // ---- hai mặt dài (±z)
  for (const sz of [1, -1]) {
    const rows = [], uvs = [];
    for (const d of ds) { const xl = -xEnd(0, d), xr = xEnd(1, d), z = sz * (ez - d), r = [], u = []; for (let j = 0; j <= NX; j++) { const x = xl + ((xr - xl) * j) / NX; r.push(V(x, Y(x, z, d), z)); u.push([x / UVS, d * 1.15]); } rows.push(sz > 0 ? r : r.reverse()); uvs.push(sz > 0 ? u : u.reverse()); }
    sub.add(K.tile, gridUV(rows, uvs));
    if (rib < 1e3) for (let x = -ex + rib / 2; x <= ex - rib / 2 + 1e-6; x += rib) {
      const pts = [], mp = [];
      for (const d of dsR) { if (x < -xEnd(0, d) + ribW || x > xEnd(1, d) - ribW) break; const z = sz * (ez - d), y = Y(x, z, d); pts.push(V(x, y + ribW * 0.42, z)); if (mortar) mp.push(V(x, y + 0.03, z)); }
      if (pts.length > 1) { sub.add(K.rib, ribAlong(pts, ribW, ribW * 0.85)); if (mortar) sub.add(K.mortar, ribAlong(mp, ribW * 1.9, 0.06)); if (o.caps) { const p = pts[0], c = new THREE.CylinderGeometry(ribW * 0.62, ribW * 0.62, 0.08, 7).rotateX(Math.PI / 2); c.translate(p.x, p.y - ribW * 0.15, p.z + sz * 0.04); sub.add(K.rib, c); } }
    }
    const x0 = -xEnd(0, 0), x1 = xEnd(1, 0), e = [];
    for (let j = 0; j <= NX; j++) { const x = x0 + ((x1 - x0) * j) / NX; e.push(V(x, Y(x, sz * ez, 0) - thick / 2, sz * ez)); }
    sub.add(K.edge, ribAlong(e, 0.24, thick));
    if (soffit) {
      const rr = [], uu = []; for (const d of [0, soffit]) { const xl = -xEnd(0, Math.min(d, 1e9)), xr = xEnd(1, d), z = sz * (ez - d), r = [], u = []; for (let j = 0; j <= 8; j++) { const x = xl + ((xr - xl) * j) / 8; r.push(V(x, Y(x, z, d) - thick, z)); u.push([x, d]); } rr.push(r); uu.push(u); }
      sub.add(K.soffit, gridUV(rr, uu));
    }
  }
  // ---- hai đầu (±x): chái của hip / irimoya
  for (const i of [0, 1]) {
    const t = typ(i), sx = i ? 1 : -1;
    if (t === 'hip' || t === 'irimoya') {
      const dEnd = t === 'hip' ? dTop : dG, dsE = ds.filter((d) => d <= dEnd + 1e-4); if (dsE[dsE.length - 1] < dEnd - 1e-4) dsE.push(dEnd);
      const rows = [], uvs = [];
      for (const d of dsE) { const w = Math.max(0, ez - d), x = sx * (ex - d), r = [], u = []; for (let j = 0; j <= 10; j++) { const z = -w + (2 * w * j) / 10; r.push(V(x, Y(x, z, d), z)); u.push([z, d * 1.15]); } rows.push(sx > 0 ? r.reverse() : r); uvs.push(sx > 0 ? u.reverse() : u); }
      if (rows.length > 1) sub.add(K.tile, gridUV(rows, uvs));
      if (rib < 1e3) for (let z = -ez + rib / 2; z <= ez - rib / 2 + 1e-6; z += rib) {
        const pts = [], mp = [];
        for (const d of dsE) { if (Math.abs(z) > ez - d - ribW) break; const x = sx * (ex - d), y = Y(x, z, d); pts.push(V(x, y + ribW * 0.42, z)); if (mortar) mp.push(V(x, y + 0.03, z)); }
        if (pts.length > 1) { sub.add(K.rib, ribAlong(pts, ribW, ribW * 0.85)); if (mortar) sub.add(K.mortar, ribAlong(mp, ribW * 1.9, 0.06)); }
      }
      const e = []; for (let j = 0; j <= 10; j++) { const z = -ez + (2 * ez * j) / 10; e.push(V(sx * ex, Y(sx * ex, z, 0) - thick / 2, z)); } sub.add(K.edge, ribAlong(e, 0.24, thick));
      if (soffit) { const rr = [], uu = []; for (const d of [0, soffit]) { const w = ez - d, x = sx * (ex - d), r = [], u = []; for (let j = 0; j <= 6; j++) { const z = -w + (2 * w * j) / 6; r.push(V(x, Y(x, z, d) - thick, z)); u.push([z, d]); } rr.push(r); uu.push(u); } sub.add(K.soffit, gridUV(rr, uu)); }
      // bờ chái 隅棟 (góc → nóc / chân hồi) + ngói quỷ ở đầu dưới
      const rw = o.hipW ?? 0.36;
      for (const sz of [1, -1]) {
        const pts = dsE.map((d) => V(sx * (ex - d), Y(sx * (ex - d), sz * (ez - d), d) + rw * 0.35, sz * (ez - d)));
        sub.add(K.ridge, ribAlong(pts, rw, rw * 1.1));
        if (o.hipOni !== false) oni(sub, null, sx * (ex - 0.25), Y(sx * ex, sz * ez, 0.25) + rw * 0.1, sz * (ez - 0.25), rw * 1.3, Math.atan2(sx, sz), K.oni);
      }
    }
    if (t === 'irimoya' && !ring) {
      const x = sx * (ex - dG), dsG = ds.filter((d) => d >= dG), pts = [];
      for (const d of dsG) pts.push([ez - d, Y(x, ez - d, d)]);
      for (const d of [...dsG].reverse()) pts.push([-(ez - d), Y(x, -(ez - d), d)]);
      sub.add(K.gable, slabXY(pts, 0.2, x - sx * 0.1, 0, 0, -Math.PI / 2));
      const yF = Y(x, ez - dG, dG);
      sub.add(K.edge, boxB(0.5, 0.18, 2 * (ez - dG) + 0.2, x + sx * 0.12, yF - 0.18, 0));            // 水切り gờ chân hồi
      // ván gió 破風板 + bờ xuôi 降棟
      for (const sz of [1, -1]) {
        const bp = dsG.map((d) => V(x + sx * (verge - 0.1), Y(x, sz * (ez - d), d) - 0.12, sz * (ez - d)));
        sub.add(K.barge, ribAlong(bp, 0.16, 0.6));
        const rp = dsG.map((d) => V(x + sx * 0.12, Y(x, sz * (ez - d), d) + 0.2, sz * (ez - d)));
        sub.add(K.ridge, ribAlong(rp, 0.34, 0.42));
        oni(sub, null, x + sx * 0.12, yF + 0.15, sz * (ez - dG - 0.2), 0.55, Math.atan2(0, sz), K.oni);
        if (K.fit) { const p = bp[0]; sub.add(K.fit, box(0.2, 0.62, 0.5, p.x, p.y, p.z - sz * 0.2)); }
      }
      const yA = Y(x, 0, dTop);
      gegyo(sub, null, x + sx * (verge - 0.06), yA - 0.25, 0, o.gegyoS ?? Math.min(1.6, 0.25 + ez * 0.09), sx > 0 ? Math.PI / 2 : -Math.PI / 2, K.gegyo);
      if (K.fit) sub.add(K.fit, box(0.22, 0.7, 0.9, x + sx * (verge - 0.04), yA - 0.2, 0));
      if (o.gableWin) o.gableWin(sub, x, sx, yF, yA);
    }
    if (t === 'gable') { // kirizuma: ván gió ở mép hồi x = ±ex, mặt hồi lùi verge
      const xg = sx * (ex - verge), dsA = ds;
      if (o.gableFace !== false) { const pts = []; for (const d of dsA) pts.push([ez - d, Y(xg, ez - d, d)]); for (const d of [...dsA].reverse()) pts.push([-(ez - d), Y(xg, -(ez - d), d)]); pts.push([-(ez - (o.gableFoot ?? verge)), Y(xg, 0, o.gableFoot ?? verge)]); sub.add(K.gable, slabXY(pts.filter(([z]) => Math.abs(z) <= ez - (o.gableFoot ?? verge) + 1e-3), 0.16, xg, 0, 0, -Math.PI / 2)); }
      for (const sz of [1, -1]) { const bp = dsA.map((d) => V(sx * (ex - 0.08), Y(sx * ex, sz * (ez - d), d) - 0.12, sz * (ez - d))); sub.add(K.barge, ribAlong(bp, 0.16, Math.max(0.4, thick * 1.1))); }
      gegyo(sub, null, sx * (ex - 0.02), Y(sx * ex, 0, dTop) - 0.3, 0, o.gegyoS ?? 0.7, sx > 0 ? Math.PI / 2 : -Math.PI / 2, K.gegyo);
    }
  }
  // ---- bờ nóc 大棟 (chồng ngói 熨斗 + ngói úp) + shachi / ngói quỷ
  const xl = -xEnd(0, dTop), xr = xEnd(1, dTop), yT = Y(0, 0, dTop), rh = o.ridgeH ?? 0.8, rw = o.ridgeW ?? Math.max(0.5, rh * 0.62);
  let top = yT;
  if (!ring && xr - xl > 0.2) {
    sub.add(K.ridge, boxB(xr - xl, rh, rw, (xl + xr) / 2, yT - 0.2, 0));
    sub.add(K.ridge, rodX(xr - xl + 0.2, rw * 0.42, (xl + xr) / 2, yT - 0.2 + rh, 0, 8));
    if (mortar) for (const f of [0.35, 0.7]) sub.add(K.mortar, boxB(xr - xl, 0.05, rw + 0.04, (xl + xr) / 2, yT - 0.2 + rh * f, 0));
    else if (K.rib && rh > 0.5) for (const f of [0.22, 0.44, 0.66]) sub.add(K.rib, boxB(xr - xl, 0.07, rw + 0.05, (xl + xr) / 2, yT - 0.2 + rh * f, 0)); // lớp ngói 熨斗 chồng
    top = yT - 0.2 + rh + rw * 0.42;
    for (const [xx, dir] of [[xl, 1], [xr, -1]]) {
      if (o.ridgeEnd === 'shachi') { shachi(sub, null, xx + dir * 0.15, yT - 0.2 + rh * 0.6, 0, o.shachiS || rh * 2.2, dir, o.shachiKey || K.ridge); top = Math.max(top, yT - 0.2 + rh * 0.6 + 1.32 * (o.shachiS || rh * 2.2)); }
      else oni(sub, null, xx - dir * 0.05, yT - 0.2, 0, rh * 1.15, dir > 0 ? -Math.PI / 2 : Math.PI / 2, K.oni);
    }
  } else if (!ring && o.finial) { o.finial(sub, yT); }
  for (const [k, list] of sub.parts) for (const g of list) acc.add(k, o.m ? g.applyMatrix4(o.m) : g);
  return { top, yT, Y, xEnd, dTop, ex, ez, yE };
}

/** mái hiên vòng (腰屋根) quanh khối chữ nhật nửa (hx, hz) từ mép hiên (vươn over) lên tới vách khối trên nửa (ix, iz) tại cao root */
export function skirtRoof(acc, { cx = 0, cz = 0, hx, hz, over, ix, iz, root, slopes = [[0.6, 0.38], 0.5], K, rib = 0.5, ribW = 0.2, mortar = false, lift = 0.12, ry = 0 }) {
  const ex = hx + over, ez = hz + over, run = Math.max(ex - ix, ez - iz) + 0.25;
  const prof = roofProfileJ(ez, slopes, Math.max(10, Math.ceil(ez / 0.9)));
  const yE = root - prof.P(ez - iz);
  // dMax tính theo cạnh dài (z); cạnh ngắn dùng cùng d nên mái x dừng ở ex − d ≥ ix khi ex − ix ≤ ez − iz
  const dMax = Math.max(ez - iz, ex - ix) + 0.25;
  const m = new THREE.Matrix4().makeRotationY(ry).setPosition(cx, 0, cz);
  return { ...jpRoof(acc, { ex, ez, yE, prof, dMax: Math.min(dMax, ez - 0.01), K, rib, ribW, mortar, lift, thick: 0.26, soffit: over * 0.85, m }), yE, ex, ez, run };
}
/** biên dạng mái (gọi lại kit.roofProfile qua import động tránh vòng) */
import { roofProfile } from './kit.js';
export const roofProfileJ = (run, slopes, steps = 14) => roofProfile(run, slopes, 0, steps);

/**
 * KARA-HAFU 唐破風 (đầu hồi cong lồi giữa, lõm hai bên — むくり) trên mép hiên, khung mặt (u, y, v ra ngoài).
 *  u: tâm, f: vị trí mặt trước (v), yE: cao mép hiên tại mặt trước, w: rộng, hk: độ vồng giữa, L: sâu vùi vào mái sau
 */
export function karaHafu(acc, m, { u = 0, f, yE, w, hk, L, K, rib = 0.42, ribW = 0.18, mortar = false, ornament = true }) {
  const hw = w / 2, N = 28, pr = (s) => Math.pow((1 + Math.cos(Math.PI * Math.max(-1, Math.min(1, s)))) / 2, 1.1);
  const yc = (x) => yE + hk * pr((x - u) / hw);
  const rows = [], uvs = [];
  for (const v of [f + 0.3, f - L]) { const r = [], q = []; for (let j = 0; j <= N; j++) { const x = u - hw - 0.3 + ((w + 0.6) * j) / N; r.push(V(x, yc(x) + 0.05, v)); q.push([x, v]); } rows.push(r); uvs.push(q); }
  put(acc, m, K.tile, gridUV(rows, uvs));
  if (rib < 1e3) for (let x = u - hw + rib / 2; x < u + hw; x += rib) { const a = V(x, yc(x) + 0.05 + ribW * 0.42, f + 0.3), b = V(x, yc(x) + 0.05 + ribW * 0.42, f - L); put(acc, m, K.rib, beam(a, b, ribW, ribW * 0.85)); if (mortar) put(acc, m, K.mortar, beam(V(a.x, a.y - ribW * 0.39, a.z), V(b.x, b.y - ribW * 0.39, b.z), ribW * 1.9, 0.06)); }
  const bp = []; for (let j = 0; j <= N; j++) { const x = u - hw - 0.3 + ((w + 0.6) * j) / N; bp.push(V(x, yc(x) - 0.28, f + 0.18)); }
  put(acc, m, K.barge, ribAlong(bp, 0.3, 0.62));                                                              // ván gió cong 唐破風板
  const face = [[u - hw, yE - 0.55], [u + hw, yE - 0.55]]; for (let j = N; j >= 0; j--) { const x = u - hw + (w * j) / N; face.push([x, yc(x) - 0.4]); }
  put(acc, m, K.gable, panel(face, 0.24, f - 0.05));
  put(acc, m, K.ridge, rodZ(L + 0.4, 0.17, u, yc(u) + 0.2, f + 0.1 - L / 2, 8));                              // ngói úp sống
  if (ornament) gegyo(acc, m, u, yE + hk - 0.62, f + 0.3, Math.min(1.1, w * 0.1), 0, K.gegyo);                 // 兎毛通
  if (K.fit) for (const s of [-1, 1]) put(acc, m, K.fit, box(0.5, 0.5, 0.34, u + s * (hw + 0.1), yE - 0.3, f + 0.2));
  return { top: yE + hk + 0.4 };
}
/**
 * ĐẦU HỒI TAM GIÁC trên mặt mái (千鳥破風 chidori-hafu / 入母屋破風 lớn) — khung mặt.
 *  u: tâm, f: mặt hồi (v), yb: cao chân hồi, hw: nửa rộng, h: cao, L: sâu vùi vào thân; ef: mái chìa trước mặt hồi; eo: mái xuống thấp hơn chân
 */
export function triHafu(acc, m, { u = 0, f, yb, hw, h, L, ef = 0.55, eo = 0.6, K, rib = 0.45, ribW = 0.18, mortar = false, win = null, gegyoS = null, hipBack = 0 }) {
  const s = h / hw;
  for (const sd of [-1, 1]) {
    // hipBack (0…1): mép dưới mặt mái lên chéo về phía sau như bờ chái của irimoya (入母屋破風 lớn) thay vì nằm ngang
    const loF = V(u + sd * (hw + eo), yb - eo * s, f + ef), hiF = V(u, yb + h + 0.12, f + ef), hiB = V(u, yb + h + 0.12, f - L);
    const loB = V(u + sd * (hw + eo) * (1 - hipBack), yb - eo * s + (h + eo * s) * hipBack * 0.97, f - L);
    const lowAt = (v) => { const t = (f + ef - v) / (ef + L); return loF.clone().lerp(loB, t); };
    const rows = [[loF, hiF], [loB, hiB]];
    put(acc, m, K.tile, gridUV(sd > 0 ? rows : rows.map((r) => [...r].reverse()), [[[0, 0], [hw, 0]], [[0, L], [hw, L]]]));
    if (rib < 1e3) for (let v = f + ef - rib / 2; v > f - L; v -= rib) {
      const lo = lowAt(v), hi = V(u, yb + h + 0.12, v); if (Math.abs(lo.x - u) < 0.5) break;
      const a = lo.clone().lerp(hi, 0.04), b = hi.clone().lerp(lo, 0.06); a.y += ribW * 0.5; b.y += ribW * 0.5;
      put(acc, m, K.rib, beam(a, b, ribW, ribW * 0.85)); if (mortar) put(acc, m, K.mortar, beam(V(a.x, a.y - ribW * 0.4, a.z), V(b.x, b.y - ribW * 0.4, b.z), 0.06, ribW * 1.9));
    }
    put(acc, m, K.barge, beam(V(u + sd * (hw + eo), yb - eo * s - 0.2, f + ef - 0.06), V(u, yb + h - 0.08, f + ef - 0.06), 0.16, 0.58));   // ván gió
    put(acc, m, K.edge, beam(V(loF.x, loF.y - 0.12, loF.z), V(loB.x, loB.y - 0.12, loB.z), 0.22, 0.24));
    if (hipBack) put(acc, m, K.ridge, beam(V(loF.x, loF.y + 0.15, loF.z - 0.3), V(loB.x, loB.y + 0.15, loB.z), 0.36, 0.4)); // bờ chái
  }
  put(acc, m, K.gable, panel([[u - hw, yb], [u + hw, yb], [u, yb + h]], 0.22, f - 0.08));
  put(acc, m, K.ridge, boxB(0.42, 0.42, L + ef, u, yb + h + 0.05, f + ef / 2 - L / 2));                          // sống hồi
  oni(acc, m, u, yb + h - 0.1, f + ef - 0.05, 0.55, 0, K.oni);
  gegyo(acc, m, u, yb + h - 0.45, f + ef + 0.04, gegyoS ?? Math.min(1.4, 0.25 + hw * 0.16), 0, K.gegyo);
  if (K.fit) put(acc, m, K.fit, box(0.6, 0.7, 0.2, u, yb + h - 0.3, f + ef + 0.02));
  if (win) win(acc, m, u, yb, h, f);
  return { top: yb + h + 0.5 };
}

// ---------------------------------------------------------------- tường thành: cửa sổ song, lỗ bắn, hộc thả đá
/** cửa sổ song đứng (格子窓) trên mặt tường v = 0 (khung mặt): khung trát nổi, bậu 水切り, ô tối, n song trát trắng / đen */
export function castleWin(acc, m, u, y0, w, h, { bars = 0, barKey = 'plaster', frameKey = 'plaster', sill = true } = {}) {
  const n = bars || Math.max(3, Math.round(w / 0.26));
  put(acc, m, frameKey, box(w + 0.36, 0.2, 0.18, u, y0 + h + 0.1, 0.09));
  if (sill) put(acc, m, frameKey, box(w + 0.5, 0.16, 0.3, u, y0 - 0.08, 0.15));
  for (const s of [-1, 1]) put(acc, m, frameKey, box(0.18, h, 0.18, u + s * (w / 2 + 0.09), y0 + h / 2, 0.09));
  put(acc, m, 'void', box(w, h, 0.05, u, y0 + h / 2, 0.025));
  for (let i = 0; i < n; i++) put(acc, m, barKey, box(0.1, h, 0.12, u - w / 2 + (w * (i + 0.5)) / n, y0 + h / 2, 0.1));
}
/** lỗ bắn 狭間: 'o' tròn (súng), 'v' tam giác, 's' vuông, 'r' chữ nhật đứng (cung) */
export function hazama(acc, m, u, y, kind = 'o', r = 0.2) {
  let pts;
  if (kind === 'o') pts = Array.from({ length: 10 }, (_, i) => [u + Math.cos((i / 10) * 2 * Math.PI) * r, y + Math.sin((i / 10) * 2 * Math.PI) * r]);
  else if (kind === 'v') pts = [[u - r * 1.1, y - r * 0.8], [u + r * 1.1, y - r * 0.8], [u, y + r * 1.1]];
  else if (kind === 's') pts = [[u - r, y - r], [u + r, y - r], [u + r, y + r], [u - r, y + r]];
  else pts = [[u - r * 0.5, y - r * 1.6], [u + r * 0.5, y - r * 1.6], [u + r * 0.5, y + r * 1.6], [u - r * 0.5, y + r * 1.6]];
  put(acc, m, 'void', panel(pts, 0.05, 0.03));
}
/** dãy lỗ bắn xen kiểu dọc đoạn [u0, u1] */
export function hazamaRow(acc, m, u0, u1, y, step = 1.8, kinds = 'ovs', r = 0.2, skip = null) {
  let i = 0; for (let u = u0 + step / 2; u < u1; u += step, i++) { if (skip && skip(u)) continue; hazama(acc, m, u, y, kinds[i % kinds.length], r); }
}
/** hộc thả đá / cửa sổ lồi 出窓型石落とし: hộp chìa p, đáy vát (lỗ thả đá), mặt trước có song; roof: 'shed' | 'gable' | null */
export function ishiOtoshi(acc, m, u, y0, w, h, p, { roof = 'shed', K, mortar = false } = {}) {
  const prf = [[0, y0 - p * 0.9], [p, y0], [p, y0 + h], [0, y0 + h]];
  put(acc, m, 'plaster', profU(prf, u - w / 2, u + w / 2));
  put(acc, m, 'void', profU([[0.02, y0 - p * 0.9 + 0.12], [p - 0.04, y0 - 0.02], [p - 0.04, y0 + 0.05], [0.02, y0 - p * 0.9 + 0.2]], u - w / 2 + 0.15, u + w / 2 - 0.15)); // khe thả đá dưới đáy
  const g = new THREE.Matrix4().makeTranslation(0, 0, p);
  const mm = m ? m.clone().multiply(g) : g; castleWin(acc, mm, u, y0 + h * 0.3, w - 0.5, h * 0.5, { sill: false });
  if (roof === 'shed') shedRoof(acc, m, { u0: u - w / 2 - 0.3, u1: u + w / 2 + 0.3, p: p + 0.45, yW: y0 + h + 0.55, yE: y0 + h + 0.1, K });
  if (roof === 'gable') triHafu(acc, m, { u, f: p + 0.15, yb: y0 + h + 0.15, hw: w / 2 + 0.1, h: w * 0.42, L: p + 0.6, ef: 0.35, eo: 0.35, K, rib: 0.4, mortar });
}
/** mái hiên một dốc nhỏ (庇) có ngói ống: từ vách (v0, yW) ra mép (p, yE), dọc u0 → u1 (khung mặt) */
export function shedRoof(acc, m, { u0, u1, v0 = 0, p, yW, yE, K, rib = 0.4, ribW = 0.16 }) {
  put(acc, m, K.tile, gridUV([[V(u0, yE, p), V(u1, yE, p)], [V(u0, yW, v0), V(u1, yW, v0)]], [[[u0, 0], [u1, 0]], [[u0, p], [u1, p]]]));
  if (K.rib && rib < 1e3) for (let u = u0 + rib / 2; u < u1; u += rib) put(acc, m, K.rib, beam(V(u, yE + ribW * 0.42, p), V(u, yW + ribW * 0.42, v0), ribW, ribW * 0.85));
  put(acc, m, K.edge, box(u1 - u0, 0.16, 0.18, (u0 + u1) / 2, yE - 0.08, p));
  put(acc, m, K.ridge || K.edge, box(u1 - u0, 0.18, 0.3, (u0 + u1) / 2, yW + 0.05, v0 + 0.1));
}
/** hộc thả đá kiểu váy hakama 袴型 ở góc tường: chân tường phình ra, đỉnh vát */
export function hakama(acc, m, u, y0, w, h, p) {
  put(acc, m, 'plaster', profU([[0, y0 - 0.2], [p, y0 + 0.25], [p, y0 + h], [0, y0 + h + p * 1.2]], u - w / 2, u + w / 2));
  put(acc, m, 'void', profU([[0.04, y0 - 0.12], [p - 0.05, y0 + 0.25], [p - 0.05, y0 + 0.3], [0.04, y0 - 0.06]], u - w / 2 + 0.12, u + w / 2 - 0.12));
}

// ---------------------------------------------------------------- BỆ ĐÁ ISHIGAKI nghiêng cong
/** độ nghiêng cong 扇の勾配: lệch ra ngoài so với đỉnh tại cao y (t = 0 chân, 1 đỉnh) — dốc thoải ở chân, gần đứng ở đỉnh */
export const batter = (B, t, p = 1.8) => B * Math.pow(Math.max(0, 1 - t), p);
/**
 * một đoạn mặt đá (khối kín): mặt có pháp tuyến theo trục ax ('x'|'z') dấu s; R(y) = khoảng tâm → mặt ngoài; Ra(y) = mặt kề (để cắt vát góc);
 * vin, uin: mặt trong (thẳng đứng); uL / uR: đầu đoạn phẳng (null = góc vát)
 */
export function stoneSeg(acc, key, { ax, s, R, Ra, vin, uin, y0, y1, uL = null, uR = null, N = 9, cx = 0, cz = 0 }) {
  const toW = (u, v, y) => (ax === 'z' ? V(cx + s * u, y, cz + s * v) : V(cx + s * v, y, cz - s * u));
  const secs = [];
  for (let i = 0; i <= N; i++) {
    const y = y0 + ((y1 - y0) * i) / N, ro = R(y), ra = Ra(y);
    secs.push([toW(uL ?? -uin, vin, y), toW(uR ?? uin, vin, y), toW(uR ?? ra, ro, y), toW(uL ?? -ra, ro, y)]);
  }
  const pos = [], tri = (a, b, c) => pos.push(a, b, c);
  for (let i = 0; i < N; i++) for (let j = 0; j < 4; j++) { const a = secs[i][j], b = secs[i][(j + 1) % 4], c = secs[i + 1][(j + 1) % 4], d = secs[i + 1][j]; tri(a, b, c); tri(a, c, d); }
  const b0 = secs[0], b1 = secs[N]; tri(b0[0], b0[2], b0[1]); tri(b0[0], b0[3], b0[2]); tri(b1[0], b1[1], b1[2]); tri(b1[0], b1[2], b1[3]);
  // hướng mặt: pháp tuyến phải chỉ ra xa trục đoạn (tâm tiết diện)
  const P = [], UV = [];
  for (let k = 0; k < pos.length; k += 3) {
    let [a, b, c] = [pos[k], pos[k + 1], pos[k + 2]];
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const cen = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    const yy = Math.max(y0, Math.min(y1, cen.y)), ii = Math.round(((yy - y0) / (y1 - y0)) * N), sc = secs[ii];
    const sec = new THREE.Vector3().add(sc[0]).add(sc[1]).add(sc[2]).add(sc[3]).divideScalar(4);
    const out = Math.abs(n.y) > 0.9 * n.length() ? new THREE.Vector3(0, cen.y > (y0 + y1) / 2 ? 1 : -1, 0) : new THREE.Vector3(cen.x - sec.x, 0, cen.z - sec.z);
    if (n.dot(out) < 0) [b, c] = [c, b];
    P.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    const horizX = Math.abs(n.x) > Math.abs(n.z);
    for (const q of [a, b, c]) UV.push((horizX ? q.z : q.x) / 2.5, (Math.abs(n.y) > 0.9 * n.length() ? (horizX ? q.x : q.z) : q.y) / 2.5);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.computeVertexNormals();
  acc.add(key, g); return g;
}
/** góc đá 算木積 (đá dài đặt xen hai phương) dọc cạnh góc của khối nghiêng */
export function sangi(acc, { cx = 0, cz = 0, Rx, Rz, y0, y1, corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]], hb = 0.62 }) {
  const n = Math.max(2, Math.round((y1 - y0) / hb));
  for (const [sx, sz] of corners) for (let i = 0; i < n; i++) {
    const ya = y0 + ((y1 - y0) * i) / n, yb = y0 + ((y1 - y0) * (i + 1)) / n, ym = (ya + yb) / 2, x = sx * Rx(ym), z = sz * Rz(ym), L = 1.5 + (i % 3) * 0.25, Sh = 0.7;
    const g = i % 2 ? boxB(L, yb - ya - 0.03, Sh, cx + x - sx * (L / 2 - 0.04), ya, cz + z - sz * (Sh / 2 - 0.04)) : boxB(Sh, yb - ya - 0.03, L, cx + x - sx * (Sh / 2 - 0.04), ya, cz + z - sz * (L / 2 - 0.04));
    const pp = g.attributes.position; for (let k = 0; k < pp.count; k++) { const y = pp.getY(k); pp.setX(k, pp.getX(k) + sx * (Rx(y) - Rx(ym))); pp.setZ(k, pp.getZ(k) + sz * (Rz(y) - Rz(ym))); } // nghiêng theo mặt đá
    g.computeVertexNormals(); acc.add('stoneC', g);
  }
}
/** khối đá thành chữ nhật (nửa đỉnh hx, hz) cao y0 → y1, nghiêng B (từng mặt: {S,N,E,W} hoặc số), rỗng giữa (ẩn) + nắp, góc 算木積 */
export function stoneBlock(acc, { cx = 0, cz = 0, hx, hz, y0 = 0, y1, B = 1, p = 1.8, cap = 'stone', capT = 0.25, sangiOn = true, plat = false }) {
  const b = (f) => (typeof B === 'number' ? B : B[f] ?? 0), H = y1 - y0, t = (y) => (y - y0) / H;
  const Rf = { S: (y) => hz + batter(b('S'), t(y), p), N: (y) => hz + batter(b('N'), t(y), p), E: (y) => hx + batter(b('E'), t(y), p), W: (y) => hx + batter(b('W'), t(y), p) };
  const vin = Math.max(0.3, Math.min(hx, hz) - 1.6);
  // mỗi mặt: góc vát theo mặt kề (dùng mặt kề lớn hơn — khối gần đối xứng)
  const ix = Math.max(0.2, hx - 1.6), iz = Math.max(0.2, hz - 1.6);
  stoneSeg(acc, 'stone', { cx, cz, ax: 'z', s: 1, R: Rf.S, Ra: (y) => Math.max(Rf.E(y), Rf.W(y)), vin: iz, uin: ix, y0, y1 });
  stoneSeg(acc, 'stone', { cx, cz, ax: 'z', s: -1, R: Rf.N, Ra: (y) => Math.max(Rf.E(y), Rf.W(y)), vin: iz, uin: ix, y0, y1 });
  stoneSeg(acc, 'stone', { cx, cz, ax: 'x', s: 1, R: Rf.E, Ra: (y) => Math.max(Rf.S(y), Rf.N(y)), vin: ix, uin: iz, y0, y1 });
  stoneSeg(acc, 'stone', { cx, cz, ax: 'x', s: -1, R: Rf.W, Ra: (y) => Math.max(Rf.S(y), Rf.N(y)), vin: ix, uin: iz, y0, y1 });
  acc.add('stone', boxB(2 * ix + 0.2, H - 0.05, 2 * iz + 0.2, cx, y0, cz));                                   // lõi đặc (mặt cắt tô đen)
  if (cap) acc.add(cap, boxB(2 * hx + 0.1, capT, 2 * hz + 0.1, cx, y1 - capT + 0.02, cz));
  if (sangiOn) sangi(acc, { cx, cz, Rx: (y) => Math.max(Rf.E(y), Rf.W(y)), Rz: (y) => Math.max(Rf.S(y), Rf.N(y)), y0, y1 });
  if (plat) acc.plat({ x: cx, z: cz, w: 2 * hx, d: 2 * hz, top: y1 });
  return { R: Rf, foot: { hx: hx + Math.max(b('E'), b('W')), hz: hz + Math.max(b('S'), b('N')) } };
}
/** bậc đá thẳng (khai mặt đi được từng bậc): từ đất lên h, mép trên tại z = zTop, đi ra +z (dir = 1) */
export function steps(acc, { x = 0, zTop, w, h, run = 0.32, dir = 1, key = 'stone', ry = 0 }) {
  const n = Math.max(1, Math.round(h / 0.17)), r = h / n, sub = new Acc();
  for (let i = 0; i < n; i++) { const top = r * (n - i), z = dir * (run * (i + 0.5)); sub.add(key, boxB(w, top, run + 0.01, 0, 0, z)); sub.plat({ x: 0, z, w, d: run + 0.02, top }); }
  place(acc, sub, x, zTop, ry); return n * run;
}
/** cột còn vỏ hơi cong (皮付柱 / kunugi): ống gấp khúc nhẹ */
export function barkPost(acc, x, z, y0, h, r, key = 'bark', bend = 0.08, seed = 1) {
  const pts = []; for (let i = 0; i <= 4; i++) { const t = i / 4; pts.push(V(x + Math.sin(seed * 3.1 + t * 2.2) * bend * Math.sin(Math.PI * t), y0 + h * t, z + Math.cos(seed * 1.7 + t * 1.9) * bend * Math.sin(Math.PI * t))); }
  for (let i = 0; i < 4; i++) { const a = pts[i], b = pts[i + 1], g = new THREE.CylinderGeometry(r * (1 - 0.06 * (i + 1)), r * (1 - 0.06 * i), a.distanceTo(b) + 0.02, 7); const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); g.applyQuaternion(q); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); acc.add(key, g); }
}
export { Acc, box, boxB, cyl, beam, slabXY, lathe, ribAlong, silhouette, V, mergeGeometries };
