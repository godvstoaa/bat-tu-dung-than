// ============================================================================
//  CÂY CỔ THỤ TIÊN PHỦ — sinh thủ tục theo LOÀI (docs/TIEN-PHU-THUCVAT-MANIFEST.md).
//  Mỗi loài: đường bao tán (dáng: vòm / ô / tháp / cột / bình / tầng mây / rủ / ngọn lửa), thân (cao phân cành, nghiêng,
//  vặn, bạnh gốc, rễ nổi), cành mọc bằng «space colonization» trong đường bao (cành tự lấp tán, không đối xứng máy móc),
//  bán kính cành theo quy tắc tiết diện (Leonardo), thẻ lá theo loại lá (vẽ canvas), pháp tuyến cầu của tán.
//  Đặc biệt: cọ (thân cong có vòng sẹo + tàu lá), đa (rễ phụ thõng), liễu (dải lá rủ).
//  Ra 3 cấp chi tiết: near (đủ), mid (bỏ cành nhỏ, ít thẻ to hơn), far (thân + cành chính + ~12 thẻ lớn).
//  Hình học tính một lần cho mỗi (loài, biến thể), dùng lại qua mọi phủ.
// ============================================================================
import * as THREE from 'three';

// ---------------------------------------------------------------- RNG
function rngOf(seed) { let s = (seed >>> 0) || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const hash3 = (x, y, z) => { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- LOÀI
// H: cao [min,max] m · cw: đường kính tán / H · cb: chân tán / H · trunk: bán kính thân ngang ngực (m) theo H 25 m
// form: dáng đường bao · lean: nghiêng thân (rad) · bend: cong thân · twist: vặn (rad trên cả thân) · flare: bạnh gốc
// roots: số rễ nổi · leader: thân chính xuyên tán (cây kim, cột) · trop: hướng cành (+ lên, − rủ) · flat: ép cành ngang (tầng)
// leaf: loại thẻ lá · lc: [màu lá chính, sáng, tối] · ls: cỡ thẻ (m) · dens: mật độ thẻ · bark: loại vỏ · bc: màu vỏ
export const SPECIES = {
  // ---- Trung Hoa (Cung Vương phủ / Ngự Hoa Viên)
  baichcn: { name: 'Trắc bách cổ (Platycladus orientalis)', H: [15, 20], cw: 0.62, cb: 0.18, trunk: 0.75, form: 'flame', lean: 0.12, bend: 0.5, twist: 2.4, flare: 0.5, roots: 5, trop: 0.25, leaf: 'scale', lc: ['#3c5a34', '#5d7a44', '#24391f'], ls: 1.5, dens: 1.15, bark: 'fibrous', bc: '#6e5440', gnarl: 0.22 , shell: 40},
  thongcn: { name: 'Thông dầu Bắc Kinh (Pinus tabuliformis)', H: [14, 18], cw: 1.0, cb: 0.42, trunk: 0.5, form: 'tiers', lean: 0.18, bend: 0.8, twist: 0.4, flare: 0.35, roots: 4, trop: 0.05, flat: 0.75, leaf: 'needle', lc: ['#3d5a3a', '#587652', '#26382a'], ls: 1.9, dens: 0.9, bark: 'plate', bc: '#7a5038', gnarl: 0.12 },
  hoe: { name: 'Hoè (Styphnolobium japonicum)', H: [18, 24], cw: 1.0, cb: 0.28, trunk: 0.72, form: 'dome', lean: 0.1, bend: 0.6, twist: 0.6, flare: 0.5, roots: 5, trop: 0.15, leaf: 'pinnate', lc: ['#4c6e36', '#6e8e48', '#2e4824'], ls: 1.7, dens: 1, bark: 'furrow', bc: '#5d5348', gnarl: 0.2 },
  bachqua: { name: 'Bạch quả (Ginkgo biloba)', H: [24, 30], cw: 0.55, cb: 0.2, trunk: 0.8, form: 'oval', lean: 0.03, bend: 0.2, twist: 0.2, flare: 0.4, roots: 4, leader: true, trop: 0.45, leaf: 'fan', lc: ['#6f8f3e', '#9cb556', '#46602a'], ls: 1.4, dens: 0.85, bark: 'furrow', bc: '#6a6058', gnarl: 0.08, autumn: '#e0b52e' },
  // ---- Nhật (Himeji / Nijō)
  kuromatsu: { name: "Thông đen Nhật (Pinus thunbergii)", H: [13, 18], cw: 1.05, cb: 0.4, trunk: 0.42, form: 'tiers', lean: 0.3, bend: 1.1, twist: 0.6, flare: 0.35, roots: 4, trop: 0.02, flat: 0.85, leaf: 'needle', lc: ['#2c4630', '#46634a', '#1b2c1f'], ls: 1.8, dens: 0.95, bark: 'plate', bc: '#4a3a30', gnarl: 0.16 },
  sakura: { name: 'Anh đào Somei-Yoshino cổ (Prunus × yedoensis)', H: [11, 14], cw: 1.55, cb: 0.22, trunk: 0.55, form: 'umbrella', lean: 0.15, bend: 0.7, twist: 0.5, flare: 0.45, roots: 5, trop: 0.05, leaf: 'blossom', lc: ['#f1c4d2', '#fbe3ea', '#c98aa0'], ls: 1.3, dens: 1.15, bark: 'banded', bc: '#4d3a36', gnarl: 0.18, spring: true },
  keyaki: { name: 'Zelkova (Zelkova serrata)', H: [24, 30], cw: 0.9, cb: 0.22, trunk: 0.85, form: 'vase', lean: 0.04, bend: 0.3, twist: 0.2, flare: 0.55, roots: 6, trop: 0.55, leaf: 'small', lc: ['#55753a', '#7c9a4c', '#33502a'], ls: 1.5, dens: 1, bark: 'smooth', bc: '#7d746a', gnarl: 0.1, autumn: '#c06a2a' },
  // ---- Tây Tạng (Potala / Norbulingka) — cao nguyên 3650 m: dương, liễu, bách xù; tán thưa, lá nhạt
  duonglhasa: { name: 'Dương Lhasa (Populus szechuanica var. tibetica)', H: [20, 26], cw: 0.42, cb: 0.22, trunk: 0.55, form: 'oval', lean: 0.04, bend: 0.3, twist: 0.2, flare: 0.3, roots: 3, leader: true, trop: 0.7, leaf: 'small', lc: ['#7d9a4e', '#a8bd6c', '#566e34'], ls: 1.3, dens: 0.75, bark: 'smooth', bc: '#a49c8c', gnarl: 0.06, autumn: '#d9b33a' , shell: 60},
  lieutang: { name: 'Liễu cổ Lhasa (Salix — «liễu Đường» Jokhang)', H: [12, 16], cw: 1.1, cb: 0.25, trunk: 0.85, form: 'dome', lean: 0.2, bend: 1.0, twist: 1.2, flare: 0.7, roots: 6, trop: 0.35, leaf: 'lance', lc: ['#7f9a58', '#a4bb78', '#566c3c'], ls: 1.3, dens: 0.85, bark: 'furrow', bc: '#6b5f52', gnarl: 0.3, pollard: true },
  buxu: { name: 'Bách xù Tây Tạng (Juniperus tibetica)', H: [14, 20], cw: 0.48, cb: 0.1, trunk: 0.6, form: 'cone', lean: 0.06, bend: 0.4, twist: 1.6, flare: 0.45, roots: 4, leader: true, trop: 0.3, leaf: 'scale', lc: ['#3e5a42', '#5d7a5c', '#26382c'], ls: 1.4, dens: 1.1, bark: 'fibrous', bc: '#7a5a46', gnarl: 0.18 , shell: 160},
  // ---- Gothic Anh (Beaumaris) — sồi, tần bì, thuỷ tùng
  soi: { name: 'Sồi Anh cổ (Quercus robur)', H: [20, 26], cw: 1.25, cb: 0.18, trunk: 1.05, form: 'dome', lean: 0.06, bend: 0.8, twist: 0.5, flare: 0.6, roots: 6, trop: 0.02, leaf: 'broad', lc: ['#4e6a34', '#6f8a46', '#32482a'], ls: 1.8, dens: 1.05, bark: 'furrow', bc: '#5e574e', gnarl: 0.3 },
  tanbi: { name: 'Tần bì (Fraxinus excelsior)', H: [22, 28], cw: 0.85, cb: 0.3, trunk: 0.65, form: 'oval', lean: 0.05, bend: 0.4, twist: 0.2, flare: 0.4, roots: 4, trop: 0.4, leaf: 'pinnate', lc: ['#5a7a3c', '#7e9a52', '#3a5428'], ls: 1.7, dens: 0.8, bark: 'furrow', bc: '#8a8478', gnarl: 0.1 },
  thuytung: { name: 'Thuỷ tùng cổ (Taxus baccata)', H: [12, 16], cw: 1.05, cb: 0.06, trunk: 0.95, form: 'dome', lean: 0.04, bend: 0.4, twist: 0.8, flare: 0.8, roots: 5, trop: 0.25, leaf: 'scale', lc: ['#25392a', '#3a5240', '#16231a'], ls: 1.5, dens: 1.25, bark: 'peel', bc: '#7b4a36', gnarl: 0.35, multi: 3 , shell: 70},
  // ---- Art Deco (Villa Cavrois — công viên Flandre: dẻ gai, đoạn, phong)
  degai: { name: 'Dẻ gai (Fagus sylvatica)', H: [24, 30], cw: 0.95, cb: 0.2, trunk: 0.75, form: 'oval', lean: 0.03, bend: 0.3, twist: 0.2, flare: 0.5, roots: 5, trop: 0.35, leaf: 'broad', lc: ['#4f7438', '#77984e', '#30502a'], ls: 1.6, dens: 1.1, bark: 'smooth', bc: '#8e8a82', gnarl: 0.06, autumn: '#b5662a' },
  // ---- Tân cổ điển (Versailles) — đoạn / dẻ ngựa hàng lối, cắt hộp
  doan: { name: 'Đoạn (Tilia × europaea) hàng lối', H: [20, 26], cw: 0.62, cb: 0.22, trunk: 0.6, form: 'oval', lean: 0.02, bend: 0.2, twist: 0.1, flare: 0.4, roots: 4, leader: true, trop: 0.45, leaf: 'broad', lc: ['#5c7e3c', '#80a052', '#3c5a2c'], ls: 1.5, dens: 1.15, bark: 'furrow', bc: '#6e675e', gnarl: 0.06 , shell: 50},
  dengua: { name: 'Dẻ ngựa (Aesculus hippocastanum)', H: [22, 28], cw: 0.85, cb: 0.2, trunk: 0.75, form: 'dome', lean: 0.03, bend: 0.4, twist: 0.3, flare: 0.5, roots: 5, trop: 0.2, leaf: 'palmate', lc: ['#4a6e34', '#6c8e48', '#2e4a24'], ls: 1.8, dens: 1.1, bark: 'plate', bc: '#6a5c50', gnarl: 0.15, candles: '#f4efe2' },
  // ---- Huế (Đại Nội) — đa, đại (sứ), thông ba lá, long não
  da: { name: 'Đa cổ thụ (Ficus benghalensis)', H: [18, 24], cw: 1.7, cb: 0.22, trunk: 1.3, form: 'umbrella', lean: 0.05, bend: 0.6, twist: 1.0, flare: 1.0, roots: 9, trop: 0.05, leaf: 'broad', lc: ['#3c5e2c', '#5c7e3e', '#24401c'], ls: 2.0, dens: 1.15, bark: 'smooth', bc: '#7e7468', gnarl: 0.35, aerial: 28, multi: 4 },
  dai: { name: 'Đại / sứ cổ (Plumeria rubra)', H: [8, 11], cw: 1.3, cb: 0.25, trunk: 0.45, form: 'umbrella', lean: 0.15, bend: 0.8, twist: 0.6, flare: 0.4, roots: 4, trop: 0.35, leaf: 'rosette', lc: ['#5a7a3a', '#7d9c50', '#3c5428'], ls: 1.5, dens: 0.55, bark: 'smooth', bc: '#8a8478', gnarl: 0.25, stubby: true, flowers: '#f6f1e2' },
  thongba: { name: 'Thông ba lá (Pinus kesiya)', H: [22, 28], cw: 0.55, cb: 0.45, trunk: 0.55, form: 'oval', lean: 0.06, bend: 0.4, twist: 0.3, flare: 0.3, roots: 4, leader: true, trop: 0.25, leaf: 'needle', lc: ['#4a6638', '#6a8452', '#2e4428'], ls: 1.8, dens: 0.85, bark: 'plate', bc: '#5e4334', gnarl: 0.08 },
  longnao: { name: 'Long não (Cinnamomum camphora)', H: [18, 24], cw: 1.15, cb: 0.2, trunk: 0.85, form: 'dome', lean: 0.07, bend: 0.6, twist: 0.6, flare: 0.6, roots: 6, trop: 0.15, leaf: 'small', lc: ['#4e7034', '#7a9a48', '#2f4a22'], ls: 1.6, dens: 1.15, bark: 'furrow', bc: '#5a4e44', gnarl: 0.2 },
  // ---- Thái (Đại Hoàng Cung) — cây mưa, me, bồ đề, dừa
  muamy: { name: 'Cây mưa (Samanea saman)', H: [18, 24], cw: 2.0, cb: 0.25, trunk: 1.0, form: 'umbrella', lean: 0.08, bend: 0.8, twist: 0.6, flare: 0.7, roots: 6, trop: -0.02, flat: 0.4, leaf: 'pinnate', lc: ['#4a6e2e', '#6e9244', '#2c4a1e'], ls: 2.0, dens: 1.0, bark: 'furrow', bc: '#5c5248', gnarl: 0.25 },
  me: { name: 'Me cổ thụ (Tamarindus indica)', H: [16, 22], cw: 1.1, cb: 0.22, trunk: 0.8, form: 'dome', lean: 0.1, bend: 0.7, twist: 0.7, flare: 0.55, roots: 5, trop: 0.1, leaf: 'pinnate', lc: ['#456a2c', '#6a8e42', '#2a461c'], ls: 1.7, dens: 1.2, bark: 'furrow', bc: '#4e443c', gnarl: 0.25 },
  bode: { name: 'Bồ đề (Ficus religiosa)', H: [18, 24], cw: 1.15, cb: 0.2, trunk: 0.95, form: 'dome', lean: 0.06, bend: 0.6, twist: 1.2, flare: 0.9, roots: 7, trop: 0.15, leaf: 'heart', lc: ['#4f7432', '#76984a', '#30501e'], ls: 1.8, dens: 1.0, bark: 'smooth', bc: '#8a8274', gnarl: 0.32, multi: 3 },
  dua: { name: 'Dừa (Cocos nucifera)', H: [16, 22], palm: 'coco', trunk: 0.22, lean: 0.22, bend: 0.5, leaf: 'frond', lc: ['#5b7a32', '#86a24c', '#3a5222'], bark: 'ring', bc: '#7e7466', fronds: 24, frondL: 5.2 },
  // ---- Mughal (Taj) — bách Ý hàng kênh, Ashoka, xoài
  bachy: { name: 'Bách Ý (Cupressus sempervirens) hàng kênh', H: [14, 18], cw: 0.16, cb: 0.04, trunk: 0.35, form: 'column', lean: 0.0, bend: 0.1, twist: 0.4, flare: 0.25, roots: 3, leader: true, trop: 0.9, leaf: 'scale', lc: ['#2d4630', '#46604a', '#1c2e20'], ls: 1.2, dens: 1.5, bark: 'fibrous', bc: '#5e4a3e', gnarl: 0.05 , shell: 260},
  ashoka: { name: 'Ashoka (Polyalthia longifolia)', H: [13, 17], cw: 0.24, cb: 0.03, trunk: 0.3, form: 'column', lean: 0.0, bend: 0.1, twist: 0.2, flare: 0.25, roots: 3, leader: true, trop: -0.35, leaf: 'lance', lc: ['#2f5a26', '#4c7a3a', '#1c3a18'], ls: 1.3, dens: 1.4, bark: 'smooth', bc: '#6a6258', gnarl: 0.04 , shell: 220},
  xoai: { name: 'Xoài cổ (Mangifera indica)', H: [16, 22], cw: 1.1, cb: 0.2, trunk: 0.85, form: 'dome', lean: 0.06, bend: 0.5, twist: 0.4, flare: 0.5, roots: 5, trop: 0.18, leaf: 'lance', lc: ['#2f5226', '#4e7438', '#1c3618'], ls: 1.8, dens: 1.25, bark: 'furrow', bc: '#4e463e', gnarl: 0.18 },
};

// ---------------------------------------------------------------- KẾT CẤU (canvas)
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function texOf(c, repeat) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; }
const hexRGB = (h) => { const v = parseInt(String(h).replace('#', ''), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }; // giá trị sRGB thô cho canvas (THREE.Color trả tuyến tính → texture tối đen)
const rgbS = (a, k = 1) => `rgb(${a.map((v) => Math.max(0, Math.min(255, v * k)) | 0)})`;

/** vỏ cây theo loại: furrow (rãnh dọc sâu) · plate (mảng vảy) · fibrous (thớ xơ xoắn) · smooth (nhẵn xám có vết) · banded (vạch ngang anh đào) · peel (bong mảng) · ring (sẹo vòng cọ) */
function barkTex(kind, col, seed) {
  const [c, g] = cv(128, 256), r = rngOf(seed), B = hexRGB(col);
  g.fillStyle = rgbS(B); g.fillRect(0, 0, 128, 256);
  const wrap = (fn) => { for (const ox of [-128, 0, 128]) for (const oy of [-256, 0, 256]) fn(ox, oy); };
  if (kind === 'ring') {
    for (let y = 0; y < 256; y += 10 + (r() * 6 | 0)) { g.fillStyle = rgbS(B, 0.62); g.fillRect(0, y, 128, 2 + r() * 2); g.fillStyle = rgbS(B, 1.12); g.fillRect(0, y + 3, 128, 3); }
    for (let i = 0; i < 300; i++) { g.fillStyle = rgbS(B, 0.8 + r() * 0.4); g.fillRect(r() * 128, r() * 256, 1 + r() * 3, 1); }
    return texOf(c, true);
  }
  if (kind === 'plate' || kind === 'peel') {
    for (let i = 0; i < (kind === 'plate' ? 110 : 60); i++) { const x = r() * 128, y = r() * 256, w = 10 + r() * 20, h = kind === 'plate' ? 12 + r() * 18 : 20 + r() * 40, k = kind === 'peel' ? 0.75 + r() * 0.7 : 0.8 + r() * 0.4;
      g.fillStyle = rgbS(kind === 'peel' && r() < 0.4 ? [B[0] * 1.3, B[1] * 1.0, B[2] * 0.75] : B, k); wrap((ox, oy) => { g.beginPath(); g.ellipse(x + ox, y + oy, w / 2, h / 2, (r() - 0.5) * 0.3, 0, Math.PI * 2); g.fill(); }); }
    g.strokeStyle = rgbS(B, 0.35); g.lineWidth = 1.6;
    for (let i = 0; i < 70; i++) { const x = r() * 128, y = r() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 22, y + (r() - 0.5) * 8); g.stroke(); }
  }
  if (kind === 'furrow' || kind === 'fibrous') {
    const n = kind === 'furrow' ? 16 : 34;
    for (let i = 0; i < n; i++) { let x = (i / n) * 128 + r() * 4; g.lineWidth = kind === 'furrow' ? 2.5 + r() * 3.5 : 1 + r() * 1.6; g.strokeStyle = rgbS(B, kind === 'furrow' ? 0.42 : 0.6 + r() * 0.2);
      g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= 256; y += 8) { x += (r() - 0.5) * (kind === 'furrow' ? 6 : 3) + (kind === 'fibrous' ? 0.8 : 0); g.lineTo(x, y); } g.stroke();
      if (x > 128) { g.beginPath(); g.moveTo(x - 128, 256); g.stroke(); } }
    for (let i = 0; i < 120; i++) { g.fillStyle = rgbS(B, 1.05 + r() * 0.25); g.fillRect(r() * 128, r() * 256, 2 + r() * 4, 6 + r() * 14); }
  }
  if (kind === 'smooth' || kind === 'banded') {
    for (let i = 0; i < 40; i++) { const x = r() * 128, y = r() * 256; g.fillStyle = rgbS(B, 0.85 + r() * 0.3); wrap((ox, oy) => { g.beginPath(); g.ellipse(x + ox, y + oy, 6 + r() * 14, 3 + r() * 8, 0, 0, Math.PI * 2); g.fill(); }); }
    if (kind === 'banded') for (let y = 6; y < 256; y += 14 + r() * 10) { g.fillStyle = rgbS(B, 0.6); for (let x = 0; x < 128; x += 9 + r() * 8) g.fillRect(x, y, 5 + r() * 6, 2); }
    else for (let i = 0; i < 26; i++) { g.strokeStyle = rgbS(B, 0.6); g.lineWidth = 1; const x = r() * 128, y = r() * 256; g.beginPath(); g.arc(x, y, 3 + r() * 5, 0.3, 2.8); g.stroke(); }
  }
  // địa y / rêu loang
  for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(${[110 + r() * 40, 128 + r() * 30, 80].map((v) => v | 0)},${0.12 + r() * 0.12})`; const x = r() * 128, y = r() * 256; wrap((ox, oy) => { g.beginPath(); g.ellipse(x + ox, y + oy, 4 + r() * 10, 6 + r() * 14, 0, 0, Math.PI * 2); g.fill(); }); }
  return texOf(c, true);
}

/** thẻ lá (256², alpha): mỗi loại một hình lá / cụm cành; màu lấy từ loài, có sáng-tối trong cụm */
function leafTex(kind, lc, seed, extra) {
  const S = 256, [c, g] = cv(S, S), r = rngOf(seed), A = hexRGB(lc[0]), Bh = hexRGB(lc[1]), Dk = hexRGB(lc[2]);
  const pick = (d) => { const t = r(); const base = t < 0.25 ? Bh : t < 0.7 ? A : Dk; return rgbS(base, 0.82 + r() * 0.3 - d * 0.25); };
  g.clearRect(0, 0, S, S);
  const twig = (x0, y0, x1, y1, w) => { g.strokeStyle = 'rgba(60,46,34,0.9)'; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + (r() - 0.5) * 20, (y0 + y1) / 2, x1, y1); g.stroke(); };
  const blob = (n, R, draw) => { for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), 0.65) * R; draw(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d * 0.92, d / R, a); } };
  if (kind === 'needle') {
    // búi kim thông: nhiều tia thẳng toả từ các điểm, đầu búi sáng
    blob(46, S * 0.36, (x, y, d) => { const n = 14 + (r() * 10 | 0), L = 16 + r() * 16; g.lineWidth = 1.3; for (let k = 0; k < n; k++) { const a = r() * Math.PI * 2; g.strokeStyle = pick(d); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L * 0.85); g.stroke(); } });
  } else if (kind === 'scale') {
    // nhánh vảy dẹt (trắc bách / bách / bách xù / thuỷ tùng): quạt nhánh nhỏ dày, mép lởm chởm
    blob(70, S * 0.38, (x, y, d, a) => { g.fillStyle = pick(d); g.save(); g.translate(x, y); g.rotate(a + (r() - 0.5)); for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(k * 4, (r() - 0.5) * 6, 7, 3.2, (r() - 0.5) * 0.8, 0, Math.PI * 2); g.fill(); } g.restore(); });
  } else if (kind === 'fan') {
    blob(120, S * 0.4, (x, y, d, a) => { g.fillStyle = pick(d); g.beginPath(); g.moveTo(x, y); g.arc(x, y, 9 + r() * 4, a - 0.9, a + 0.9); g.closePath(); g.fill(); });
  } else if (kind === 'pinnate' || kind === 'small') {
    // lá kép lông chim (hoè, me, cây mưa, tần bì) / lá nhỏ (zelkova, long não): nhiều lá chét nhỏ dọc cuống
    const rows = kind === 'pinnate' ? 30 : 0;
    for (let i = 0; i < rows; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), 0.6) * S * 0.36, x = S / 2 + Math.cos(a) * d, y = S / 2 + Math.sin(a) * d, ang = r() * Math.PI * 2, L = 26 + r() * 18;
      g.save(); g.translate(x, y); g.rotate(ang); g.strokeStyle = 'rgba(70,80,40,0.6)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-L / 2, 0); g.lineTo(L / 2, 0); g.stroke();
      for (let u = -L / 2; u < L / 2; u += 4) for (const sd of [-1, 1]) { g.fillStyle = pick(d / S * 2.4); g.beginPath(); g.ellipse(u, sd * 3.6, 3.2, 1.6, sd * 0.5, 0, Math.PI * 2); g.fill(); } g.restore(); }
    blob(kind === 'pinnate' ? 160 : 320, S * 0.4, (x, y, d) => { g.fillStyle = pick(d); g.beginPath(); g.ellipse(x, y, 4 + r() * 3, 2.2 + r() * 1.5, r() * 6.28, 0, Math.PI * 2); g.fill(); });
  } else if (kind === 'broad' || kind === 'palmate' || kind === 'heart') {
    blob(kind === 'palmate' ? 40 : 190, S * 0.4, (x, y, d) => {
      if (kind === 'palmate') { for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + r() * 0.3; g.fillStyle = pick(d); g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(9, 0, 9, 3.4, 0, 0, Math.PI * 2); g.fill(); g.restore(); } return; }
      const L = 7 + r() * 6, W = L * (kind === 'heart' ? 0.8 : 0.55); g.fillStyle = pick(d); g.save(); g.translate(x, y); g.rotate(r() * 6.28);
      g.beginPath(); if (kind === 'heart') { g.moveTo(0, -W); g.quadraticCurveTo(L, -W, L * 1.6, 0); g.quadraticCurveTo(L, W, 0, W); g.quadraticCurveTo(-L * 0.3, 0, 0, -W); } else g.ellipse(0, 0, L, W, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(20,30,10,0.35)'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-L, 0); g.lineTo(L, 0); g.stroke(); g.restore(); });
    if (extra?.candles) for (let i = 0; i < 9; i++) { const x = S / 2 + (r() - 0.5) * S * 0.6, y = S / 2 + (r() - 0.5) * S * 0.5; g.fillStyle = extra.candles; g.beginPath(); g.ellipse(x, y, 5, 13, 0, 0, Math.PI * 2); g.fill(); }
  } else if (kind === 'lance') {
    // lá mác dài (liễu, Ashoka, xoài): lá dài nhọn, hơi rủ
    blob(140, S * 0.4, (x, y, d) => { const L = 14 + r() * 10; g.fillStyle = pick(d); g.save(); g.translate(x, y); g.rotate(Math.PI / 2 + (r() - 0.5) * 1.4); g.beginPath(); g.moveTo(-L, 0); g.quadraticCurveTo(0, -3.4, L, 0); g.quadraticCurveTo(0, 3.4, -L, 0); g.fill(); g.restore(); });
  } else if (kind === 'blossom') {
    // anh đào nở: chùm hoa 5 cánh hồng nhạt dày, cành tối lộ
    for (let i = 0; i < 7; i++) twig(S / 2, S / 2, S / 2 + (r() - 0.5) * S * 0.8, S / 2 + (r() - 0.5) * S * 0.8, 2.2);
    blob(330, S * 0.42, (x, y, d) => { const R = 3.4 + r() * 2; g.fillStyle = pick(d * 0.6); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * R * 0.7, y + Math.sin(a) * R * 0.7, R * 0.62, 0, Math.PI * 2); g.fill(); } g.fillStyle = 'rgba(200,90,110,0.7)'; g.fillRect(x - 0.8, y - 0.8, 1.6, 1.6); });
  } else if (kind === 'rosette') {
    // đại / sứ: hoa thị lá dài ở đầu cành mập + chùm hoa trắng nhuỵ vàng
    for (let i = 0; i < 9; i++) { const x = S / 2 + (r() - 0.5) * S * 0.6, y = S / 2 + (r() - 0.5) * S * 0.55; for (let k = 0; k < 11; k++) { const a = k / 11 * Math.PI * 2 + r() * 0.3, L = 22 + r() * 10; g.fillStyle = pick(0.3); g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(L / 2, 0, L / 2, 5, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
      if (r() < 0.75) for (let k = 0; k < 7; k++) { const fx = x + (r() - 0.5) * 16, fy = y + (r() - 0.5) * 16; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.28 + 0.3; g.fillStyle = extra?.flowers || '#f6f1e2'; g.beginPath(); g.ellipse(fx + Math.cos(a) * 3.4, fy + Math.sin(a) * 3.4, 3.6, 2, a, 0, Math.PI * 2); g.fill(); } g.fillStyle = '#f0c040'; g.beginPath(); g.arc(fx, fy, 1.6, 0, 6.28); g.fill(); } }
  } else if (kind === 'frond') {
    // tàu dừa: sống giữa dọc theo v, lá chét hai bên rủ xiên
    const [c2, g2] = [c, g]; g2.clearRect(0, 0, S, S);
    g2.strokeStyle = rgbS(Dk, 1.1); g2.lineWidth = 4; g2.beginPath(); g2.moveTo(S / 2, 0); g2.lineTo(S / 2, S); g2.stroke();
    for (let y = 4; y < S; y += 3.2) { const L = (S * 0.48) * Math.sin(Math.PI * Math.min(1, (y / S) * 1.05 + 0.04)); for (const sd of [-1, 1]) { g2.strokeStyle = pick(r() * 0.4); g2.lineWidth = 2.4; g2.beginPath(); g2.moveTo(S / 2, y); g2.quadraticCurveTo(S / 2 + sd * L * 0.5, y + 6, S / 2 + sd * L, y + 22 + r() * 8); g2.stroke(); } }
    return texOf(c2);
  }
  return texOf(c);
}

// ---------------------------------------------------------------- HÌNH HỌC
function builder(withCol) {
  const pos = [], nor = [], uv = [], col = withCol ? [] : null, idx = [];
  return {
    pos, idx,
    v(p, n, u, w, c) { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); uv.push(u, w); if (col) col.push(c[0], c[1], c[2]); return pos.length / 3 - 1; },
    geo() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      if (col) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      g.setIndex(idx); g.computeBoundingSphere(); g.computeBoundingBox(); return g;
    },
  };
}
const _up = new THREE.Vector3(0, 1, 0), _x = new THREE.Vector3(1, 0, 0);
/** ống theo đường qua pts với bán kính rs[i]; noise(i, a) → hệ số bán kính (u bướu / bạnh); uRep: số lần lặp vỏ quanh chu vi */
function tube(B, pts, rs, sides, noise, uRep = 1, vScale = 0.5, cap = false) {
  const T = new THREE.Vector3(), N = new THREE.Vector3(), Bn = new THREE.Vector3(), P = new THREE.Vector3(), D = new THREE.Vector3(), prevN = new THREE.Vector3();
  let len = 0; const rows = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    T.subVectors(b, a).normalize();
    if (i === 0) N.crossVectors(Math.abs(T.y) > 0.95 ? _x : _up, T).normalize();
    else { N.copy(prevN).addScaledVector(T, -prevN.dot(T)); if (N.lengthSq() < 1e-6) N.crossVectors(_up, T); N.normalize(); } // khung song song: không xoắn đột ngột
    prevN.copy(N); Bn.crossVectors(T, N);
    if (i) len += pts[i].distanceTo(pts[i - 1]);
    const row = [];
    for (let s = 0; s <= sides; s++) {
      const ang = (s / sides) * Math.PI * 2; D.copy(N).multiplyScalar(Math.cos(ang)).addScaledVector(Bn, Math.sin(ang));
      const rr = rs[i] * (noise ? noise(i, ang) : 1);
      row.push(B.v(P.copy(pts[i]).addScaledVector(D, rr), D, (s / sides) * uRep, len * vScale));
    }
    rows.push(row);
  }
  for (let i = 0; i < rows.length - 1; i++) for (let s = 0; s < sides; s++) { const a = rows[i][s], b = rows[i][s + 1], c = rows[i + 1][s], d = rows[i + 1][s + 1]; B.idx.push(a, c, b, b, c, d); }
  if (cap) { const last = rows[rows.length - 1], ctr = B.v(pts[pts.length - 1], T, 0.5, len * vScale); for (let s = 0; s < sides; s++) B.idx.push(last[s], ctr, last[s + 1]); }
}

const Qt = new THREE.Quaternion(), Eu = new THREE.Euler();
/** thẻ lá w×h tâm c; pháp tuyến pha cầu quanh tâm tán ctr (75 %); màu đỉnh col */
function card(B, c, w, h, yaw, tilt, roll, ctr, col, sph = 0.75) {
  Qt.setFromEuler(Eu.set(tilt, yaw, roll, 'YXZ'));
  const ax = new THREE.Vector3(w / 2, 0, 0).applyQuaternion(Qt), ay = new THREE.Vector3(0, h / 2, 0).applyQuaternion(Qt), fn = new THREE.Vector3(0, 0, 1).applyQuaternion(Qt);
  const base = B.pos.length / 3;
  for (const [sx, sy, u, v] of [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]]) {
    const p = c.clone().addScaledVector(ax, sx).addScaledVector(ay, sy);
    const n = p.clone().sub(ctr).normalize(); n.y += 0.25; n.normalize(); if (fn.dot(n) < 0) fn.negate(); n.multiplyScalar(sph).addScaledVector(fn, 1 - sph).normalize();
    B.v(p, n, u, v, col);
  }
  B.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

// ---------- đường bao tán: bán kính tán theo t (0 chân tán → 1 ngọn), đã chuẩn hoá về 1
const PROFILE = {
  dome: (t) => Math.sqrt(Math.max(0, 1 - Math.pow(t * 2 - 0.9, 2) / 1.21)),
  umbrella: (t) => (t < 0.35 ? 0.82 + 0.18 * (t / 0.35) : Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.35) / 0.65, 2)))),
  oval: (t) => Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.03))), 0.8),
  cone: (t) => Math.max(0, (1 - t) * (0.85 + 0.15 * Math.sin(t * 9))),
  column: (t) => Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, t * 0.88 + 0.1))), 0.55) * (1 - t * 0.25),
  vase: (t) => Math.min(1, 0.28 + 0.9 * Math.sqrt(t)) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, t - 0.6) / 0.4, 2))),
  flame: (t) => Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, t * 0.82 + 0.1))), 0.9) * (1 - t * 0.3),
  tiers: (t) => Math.max(0, 1 - t * 0.55),
};

/**
 * Sinh một cây: loài sp (khoá SPECIES), seed. Trả { near, mid, far: { bark, leaf } BufferGeometry, H, R (bán kính tán), trunkR }.
 * Đơn vị thật (m), gốc (0,0,0).
 */
export function growTree(spKey, seed) {
  const sp = SPECIES[spKey]; if (sp.palm) return growPalm(sp, seed);
  const r = rngOf(Math.imul(seed ^ 0x9e3779b9, 2654435761) ^ (spKey.charCodeAt(0) * 7919 + spKey.length * 131)); r(); r();
  const H = sp.H[0] + (sp.H[1] - sp.H[0]) * r(), R = (H * sp.cw) / 2, yb = H * sp.cb;
  const trunkR = sp.trunk * (H / ((sp.H[0] + sp.H[1]) / 2)) * (0.9 + r() * 0.2); // sp.trunk = bán kính thân ngang ngực ở cỡ trung bình loài
  const la = r() * Math.PI * 2, lean = sp.lean * (0.6 + r() * 0.8);
  // ---- thân: đường cong từ gốc tới chân tán (hoặc tới ngọn nếu leader)
  const topT = sp.leader ? H * (sp.form === 'column' ? 0.8 : 0.86) : Math.max(yb + (H - yb) * 0.25, H * 0.32);
  const NT = 12, trunk = [];
  const ph = r() * 6, ph2 = r() * 6;
  for (let i = 0; i <= NT; i++) {
    const t = i / NT, y = t * topT, off = lean * y + sp.bend * Math.sin(t * 2.6 + ph) * t * 0.8;
    trunk.push(new THREE.Vector3(Math.cos(la) * off + Math.sin(t * 3.1 + ph2) * sp.bend * 0.25 * t, y, Math.sin(la) * off + Math.cos(t * 2.3 + ph) * sp.bend * 0.25 * t));
  }
  const crownC = new THREE.Vector3(trunk[NT].x * (sp.leader ? 0.5 : 1), yb + (H - yb) * 0.5, trunk[NT].z * (sp.leader ? 0.5 : 1));
  // ---- điểm hút trong đường bao (lệch tán theo hướng nắng + nhiễu thuỳ)
  const prof = PROFILE[sp.form] || PROFILE.dome, lobeA = r() * 6.28, lobes = 3 + (r() * 3 | 0), asym = 0.12 + r() * 0.12;
  const attr = [], NA = Math.round((sp.form === 'column' ? 260 : 520) * Math.min(1.4, Math.max(0.7, R / 9)));
  const tierN = 4 + (r() * 3 | 0), tierY = Array.from({ length: tierN }, (_, k) => yb + (H - yb) * (0.08 + (k / tierN) * 0.9 + (r() - 0.5) * 0.05)), tierA = tierY.map(() => r() * 6.28);
  for (let k = 0, guard = 0; attr.length < NA && guard < NA * 60; guard++) {
    const y = yb + (H - yb) * r(), t = (y - yb) / (H - yb), a = r() * Math.PI * 2;
    let rad = R * prof(t) * (1 + asym * Math.cos(a * lobes + lobeA) + 0.08 * Math.cos(a - la));
    if (sp.form === 'tiers') { // tầng mây: điểm chỉ nằm trong đĩa mỏng quanh vài cao độ, mỗi đĩa lệch một phía
      const j = tierY.reduce((b, ty, q) => (Math.abs(ty - y) < Math.abs(tierY[b] - y) ? q : b), 0);
      if (Math.abs(tierY[j] - y) > 0.9 + R * 0.06) continue;
      rad *= 0.55 + 0.45 * (0.5 + 0.5 * Math.cos(a - tierA[j]));
    }
    const d = Math.sqrt(r()) * rad; if (d < (sp.leader ? 0.6 : 0)) continue;
    attr.push(new THREE.Vector3(crownC.x + Math.cos(a) * d, y, crownC.z + Math.sin(a) * d)); k++;
  }
  // ---- space colonization
  const D = Math.max(0.45, H / 38), di = Math.max(R * 0.75, D * 8), dk = D * 1.7;
  const nodes = []; // { p, parent, kids: [], n }
  const addNode = (p, parent) => { const nd = { p, parent, kids: [], n: 0 }; if (parent >= 0) nodes[parent].kids.push(nodes.length); nodes.push(nd); return nodes.length - 1; };
  let prev = -1; for (const p of trunk) prev = addNode(p.clone(), prev);
  const trunkCount = nodes.length;
  const CS = di, grid = new Map(), gk = (p) => `${Math.floor(p.x / CS)},${Math.floor(p.y / CS)},${Math.floor(p.z / CS)}`;
  const gAdd = (i) => { const k = gk(nodes[i].p); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i); };
  // leader: chỉ nửa trên của thân được mọc cành (cây kim / cột mọc cành từ thân chính)
  for (let i = 0; i < nodes.length; i++) if (nodes[i].p.y > yb * 0.85 || i === nodes.length - 1) gAdd(i);
  const alive = attr.map(() => true), acc = new Map(), tmp = new THREE.Vector3();
  const tropV = new THREE.Vector3(0, sp.trop || 0, 0);
  for (let it = 0; it < 220; it++) {
    acc.clear(); let any = false;
    for (let a = 0; a < attr.length; a++) {
      if (!alive[a]) continue; const A = attr[a];
      const cx = Math.floor(A.x / CS), cy = Math.floor(A.y / CS), cz = Math.floor(A.z / CS);
      let best = -1, bd = di * di, kill = false;
      for (let ox = -1; ox <= 1 && !kill; ox++) for (let oy = -1; oy <= 1 && !kill; oy++) for (let oz = -1; oz <= 1; oz++) {
        const L = grid.get(`${cx + ox},${cy + oy},${cz + oz}`); if (!L) continue;
        for (const i of L) { const d2 = nodes[i].p.distanceToSquared(A); if (d2 < dk * dk) { kill = true; break; } if (d2 < bd) { bd = d2; best = i; } }
        if (kill) break;
      }
      if (kill) { alive[a] = false; continue; }
      if (best < 0) continue;
      any = true; tmp.subVectors(A, nodes[best].p).normalize();
      if (!acc.has(best)) acc.set(best, new THREE.Vector3()); acc.get(best).add(tmp);
    }
    if (!any) break;
    for (const [i, v] of acc) {
      v.normalize().add(tropV); if (sp.flat) v.y *= 1 - sp.flat; v.normalize();
      const p = nodes[i].p.clone().addScaledVector(v, D);
      // tránh cành chồng: bỏ nếu đã có nút con rất gần
      if (nodes[i].kids.some((k) => nodes[k].p.distanceToSquared(p) < D * D * 0.2)) continue;
      gAdd(addNode(p, i));
    }
  }
  // ---- đếm ngọn (cho bán kính theo quy tắc tiết diện) — duyệt ngược vì con luôn sau cha
  for (let i = nodes.length - 1; i >= 0; i--) { const nd = nodes[i]; nd.n = nd.kids.length ? nd.kids.reduce((s, k) => s + nodes[k].n, 0) : 1; }
  const nTot = nodes[0].n, rTip = 0.025, EXP = 2.3;
  const radOf = (i) => { const nd = nodes[i]; const rr = trunkR * Math.pow(nd.n / nTot, 1 / EXP); return Math.max(rTip, rr); };
  // ---- tách chuỗi: theo con nhiều ngọn nhất
  const chains = [];
  const walk = (start, fromParent) => {
    const pts = [], rs = [], ids = [];
    if (fromParent >= 0) { pts.push(nodes[fromParent].p); rs.push(radOf(start) * 1.05); ids.push(fromParent); }
    let i = start;
    for (;;) {
      pts.push(nodes[i].p); rs.push(radOf(i)); ids.push(i);
      const k = nodes[i].kids; if (!k.length) break;
      let main = k[0]; for (const q of k) if (nodes[q].n > nodes[main].n) main = q;
      for (const q of k) if (q !== main) walk(q, i);
      i = main;
    }
    chains.push({ pts, rs, ids, rmax: Math.max(...rs), trunk: start === 0 });
  };
  walk(0, -1);
  // bỏ bớt điểm trung gian ở chuỗi dài (thân 1 điểm / 2 nút, cành nhỏ 1 / 2)
  // ---- thân: bạnh gốc + u bướu + vặn
  const flareN = sp.roots || 4, gn = sp.gnarl || 0.1, twist = sp.twist || 0;
  const trunkNoise = (pts) => (i, ang) => {
    const y = pts[i].y, t = Math.min(1, y / Math.max(1, topT));
    const fl = 1 + (sp.flare || 0.4) * Math.pow(Math.max(0, 1 - y / (trunkR * 3.2)), 2.2) * (0.55 + 0.45 * Math.cos(ang * flareN + y * 0.2));
    const tw = ang + twist * t; const nz = 1 + gn * (0.5 * Math.sin(tw * 3 + y * 0.9) + 0.35 * Math.sin(tw * 5 - y * 1.7) + 0.25 * (hash3(Math.round(y * 2), Math.round(tw * 3), seed) - 0.5));
    return fl * nz;
  };
  // ---- dựng 3 cấp
  const bark = { near: builder(), mid: builder(), far: builder() };
  const uRepOf = (rr) => Math.max(1, Math.round(rr * 5));
  for (const ch of chains) {
    const isT = ch.trunk;
    for (const [lod, minR, sidesOf, step] of [['near', 0, (rr) => (rr > 0.5 ? 14 : rr > 0.2 ? 8 : rr > 0.08 ? 5 : 3), 1], ['mid', 0.09, (rr) => (rr > 0.5 ? 9 : rr > 0.2 ? 5 : 3), 2], ['far', trunkR * 0.32, (rr) => (rr > 0.5 ? 6 : 4), 3]]) {
      if (ch.rmax < minR) continue;
      // giảm điểm
      const P = [], Rr = [];
      for (let i = 0; i < ch.pts.length; i++) if (i === 0 || i === ch.pts.length - 1 || i % (isT ? 1 : step) === 0) { P.push(ch.pts[i]); Rr.push(ch.rs[i]); }
      if (P.length < 2) continue;
      // cấp mid/far: chỉ vẽ đoạn có bán kính đủ lớn
      let cut = P.length; if (minR > 0) { while (cut > 2 && Rr[cut - 1] < minR * 0.6) cut--; }
      const PP = P.slice(0, cut), RR = Rr.slice(0, cut); if (PP.length < 2) continue;
      tube(bark[lod], PP, RR, sidesOf(ch.rmax), isT ? trunkNoise(PP) : (i, a) => 1 + gn * 0.4 * Math.sin(a * 3 + i), uRepOf(ch.rmax), 0.35 / Math.max(0.25, ch.rmax), !isT);
    }
  }
  // ---- rễ nổi: ống ngắn từ chân thân toả ra, chìm xuống đất
  const roots = [];
  for (let k = 0; k < flareN; k++) {
    const a = (k / flareN) * Math.PI * 2 + r() * 0.5, L = trunkR * (2.2 + r() * 2.2) * (sp.flare || 0.5) * 1.6 + 0.6;
    const pts = []; for (let i = 0; i <= 5; i++) { const t = i / 5, d = trunkR * 0.6 + L * t; pts.push(new THREE.Vector3(Math.cos(a + (r() - 0.5) * 0.2 * t) * d, trunkR * 0.75 * (1 - t) * (1 - t) - 0.12 * t, Math.sin(a + (r() - 0.5) * 0.2 * t) * d)); }
    roots.push(pts);
    const rs = pts.map((_, i) => trunkR * 0.42 * (1 - i / 6) + 0.03);
    tube(bark.near, pts, rs, 6, null, 1, 0.5); tube(bark.mid, pts, rs, 4, null, 1, 0.5);
  }
  // ---- rễ phụ thõng (đa): từ cành ngang thả dây xuống đất, vài dây đã thành cột
  if (sp.aerial) {
    const cand = []; for (let i = trunkCount; i < nodes.length; i++) { const rr = radOf(i); if (rr > 0.12 && nodes[i].p.y > 4 && Math.hypot(nodes[i].p.x, nodes[i].p.z) > trunkR * 2.5) cand.push(i); }
    for (let k = 0; k < sp.aerial && cand.length; k++) {
      const i = cand[(r() * cand.length) | 0], top = nodes[i].p, thick = r() < 0.25, ground = thick || r() < 0.55;
      const bot = ground ? 0 : top.y * (0.25 + r() * 0.4), pts = [];
      for (let j = 0; j <= 6; j++) { const t = j / 6; pts.push(new THREE.Vector3(top.x + Math.sin(t * 3 + k) * 0.15, top.y + (bot - top.y) * t, top.z + Math.cos(t * 2 + k) * 0.15)); }
      const rr = thick ? 0.12 + r() * 0.18 : 0.025 + r() * 0.03, rs = pts.map((_, j) => rr * (thick ? 1 + (j / 6) * 0.6 : 1));
      tube(bark.near, pts, rs, thick ? 7 : 3, null, 1, 0.5); if (thick) { tube(bark.mid, pts, rs, 4, null, 1, 0.5); tube(bark.far, [pts[0], pts[6]], [rr, rr], 4, null, 1, 0.5); }
    }
  }
  // ---- thân phụ (multi): thuỷ tùng / bồ đề / đa nhiều thân dính
  if (sp.multi) for (let k = 1; k < sp.multi; k++) {
    const a = la + (k / sp.multi) * Math.PI * 2 + r(), d = trunkR * (0.7 + r() * 0.4), h = topT * (0.5 + r() * 0.4), pts = [];
    for (let j = 0; j <= 6; j++) { const t = j / 6; pts.push(new THREE.Vector3(Math.cos(a) * d * (1 - t * 0.6) + trunk[Math.round(t * NT * h / topT)].x * t, t * h, Math.sin(a) * d * (1 - t * 0.6) + trunk[Math.round(t * NT * h / topT)].z * t)); }
    const rs = pts.map((_, j) => trunkR * 0.55 * (1 - j / 9));
    tube(bark.near, pts, rs, 9, trunkNoise(pts), 2, 0.4); tube(bark.mid, pts, rs, 6, null, 2, 0.4); tube(bark.far, [pts[0], pts[6]], [rs[0], rs[6]], 5, null, 1, 0.4);
  }
  // ---- lá: cụm ở các nút có ít ngọn (đầu cành), trên chân tán
  const leaf = { near: builder(true), mid: builder(true), far: builder(true) };
  const tips = []; for (let i = trunkCount; i < nodes.length; i++) if (nodes[i].n <= 3 && nodes[i].p.y > yb * 0.7) tips.push(i);
  const budget = Math.round(1700 * (sp.dens || 1)), stepT = Math.max(1, tips.length / budget);
  const lc0 = new THREE.Color(sp.lc[0]);
  const colAt = (p) => { // trong tán sẫm, ngoài / trên sáng; lệch tông nhẹ
    const dd = p.distanceTo(crownC) / Math.max(1, R), up = (p.y - yb) / Math.max(1, H - yb), n = hash3(p.x, p.y, p.z);
    const k = 0.74 + 0.3 * Math.min(1, dd) + 0.14 * up + (n - 0.5) * 0.12; return [k * (0.97 + n * 0.06), k, k * (0.95 + (1 - n) * 0.06)];
  };
  const LS = (sp.ls || 1.5) * Math.min(1.5, Math.max(0.85, H / 20));
  const weep = sp.trop < -0.2, isScale = sp.leaf === 'scale', flatCard = sp.form === 'tiers' || sp.flat;
  for (let f = 0; f < tips.length; f += stepT) {
    const nd = nodes[tips[Math.floor(f)]], p = nd.p, par = nd.parent >= 0 ? nodes[nd.parent].p : p, dir = p.clone().sub(par).normalize();
    const col = colAt(p), n = isScale || flatCard ? 3 : 2;
    for (let k = 0; k < n; k++) {
      const c = p.clone().add(new THREE.Vector3((r() - 0.5) * LS * 0.6, (r() - 0.5) * LS * 0.4, (r() - 0.5) * LS * 0.6)).addScaledVector(dir, LS * 0.25);
      const s = LS * (0.8 + r() * 0.5);
      const tilt = flatCard ? (k === 0 ? -Math.PI / 2 + (r() - 0.5) * 0.5 : -Math.PI / 2 + (r() < 0.5 ? -1 : 1) * (0.6 + r() * 0.45)) : (r() - 0.5) * 1.6, yaw = r() * Math.PI * 2;
      card(leaf.near, c, s, weep ? s * 1.6 : s, yaw, tilt, (r() - 0.5) * 1.2, crownC, col);
      if (k === 0 && r() < 0.42) card(leaf.mid, c, s * 1.55, (weep ? s * 2.2 : s * 1.55), yaw, tilt, 0, crownC, col);
    }
  }
  if (sp.shell) {
    const nS = Math.round(sp.shell * Math.max(1, (H - yb) * R / 20));
    for (let k = 0; k < nS; k++) {
      const t = Math.pow(r(), 0.85), a = r() * Math.PI * 2, y = yb + (H - yb) * t, rad = R * prof(t) * (0.72 + r() * 0.3) * (1 + asym * 0.6 * Math.cos(a * lobes + lobeA));
      const c = new THREE.Vector3(crownC.x + Math.cos(a) * rad, y, crownC.z + Math.sin(a) * rad), s = LS * (0.7 + r() * 0.5) * (sp.form === 'column' ? 0.8 : 1);
      const col = colAt(c); card(leaf.near, c, s, weep ? s * 1.7 : s * 1.2, a + Math.PI / 2 + (r() - 0.5) * 1.2, (r() - 0.5) * 0.9, (r() - 0.5) * 0.8, crownC, col, 0.85);
      if (k % 3 === 0) card(leaf.mid, c, s * 1.6, (weep ? s * 2.4 : s * 1.8), a + Math.PI / 2, 0, 0, crownC, col, 0.85);
    }
    // ngọn: chóp lá che đầu thân chính
    const tp = new THREE.Vector3(crownC.x, H - LS * 0.6, crownC.z);
    for (let k = 0; k < 4; k++) card(leaf.near, tp, LS * 1.1, LS * 1.6, k * 0.8, (r() - 0.5) * 0.3, 0, crownC, colAt(tp), 0.8);
  }
  // far: ~14 thẻ lớn phủ đường bao
  for (let k = 0; k < 16; k++) {
    const t = 0.15 + 0.7 * r(), a = r() * Math.PI * 2, rad = R * prof(t) * 0.62, y = yb + (H - yb) * t;
    const c = new THREE.Vector3(crownC.x + Math.cos(a) * rad, y, crownC.z + Math.sin(a) * rad), s = Math.max(R, (H - yb) * 0.4) * 0.95;
    card(leaf.far, c, s, flatCard ? s * 0.6 : s, a + Math.PI / 2, flatCard ? -1.2 : (r() - 0.5) * 0.5, 0, crownC, colAt(c), 0.85);
  }
  // liễu: dải lá rủ từ đầu cành
  if (sp.pollard || sp.leaf === 'willow') {/* liễu Lhasa cắt ngọn: dáng đã do trop + vòm */}
  const out = {}; for (const l of ['near', 'mid', 'far']) out[l] = { bark: bark[l].geo(), leaf: leaf[l].geo() };
  return { ...out, H, R, trunkR, crownY: yb, tips: tips.length, nodes: nodes.length };
}

/** cọ (dừa): thân cong có vòng sẹo + tàu lá cong rủ (dải 6 đoạn, thẻ tàu); bẹ đỉnh; chùm quả */
function growPalm(sp, seed) {
  const r = rngOf(seed * 104729 + 17), H = sp.H[0] + (sp.H[1] - sp.H[0]) * r(), la = r() * Math.PI * 2, lean = sp.lean * (0.5 + r());
  const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14, off = Math.sin(t * Math.PI * 0.5) * lean * H * 0.55 + Math.sin(t * 5 + seed) * 0.15; pts.push(new THREE.Vector3(Math.cos(la) * off, t * H, Math.sin(la) * off)); }
  const rs = pts.map((p, i) => sp.trunk * (1 + 0.6 * Math.pow(1 - i / 14, 6)) * (1 - (i / 14) * 0.18));
  const bark = { near: builder(), mid: builder(), far: builder() }, leaf = { near: builder(true), mid: builder(true), far: builder(true) };
  tube(bark.near, pts, rs, 10, null, 1, 0.25); tube(bark.mid, pts.filter((_, i) => i % 2 === 0), rs.filter((_, i) => i % 2 === 0), 6, null, 1, 0.25); tube(bark.far, [pts[0], pts[7], pts[14]], [rs[0], rs[7], rs[14]], 4, null, 1, 0.25);
  const top = pts[14], ctr = top.clone().add(new THREE.Vector3(0, -0.5, 0));
  const nF = sp.fronds || 22;
  for (let k = 0; k < nF; k++) {
    const a = k * 2.39996 + r() * 0.3, up = 0.9 - (k / nF) * 1.5 + (r() - 0.5) * 0.2, L = (sp.frondL || 5) * (0.8 + r() * 0.35);
    // dải 6 đoạn theo cung parabol: đi ra + rủ xuống
    const seg = 6, dirH = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), side = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
    const P = []; for (let i = 0; i <= seg; i++) { const t = i / seg; P.push(top.clone().addScaledVector(dirH, L * t).add(new THREE.Vector3(0, L * (up * t - 0.75 * t * t), 0))); }
    for (const [lod, every, wk] of [['near', 1, 1], ['mid', 2, 1.15]]) {
      const B = leaf[lod]; const base = B.pos.length / 3; const ids = [];
      for (let i = 0; i <= seg; i += every) { const t = i / seg, w = L * 0.34 * Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.05)) * wk, droop = new THREE.Vector3(0, -w * 0.35, 0);
        const n = new THREE.Vector3(0, 1, 0), col = [0.85 + t * 0.2, 0.9 + t * 0.15, 0.85];
        ids.push(B.v(P[i].clone().addScaledVector(side, -w).add(droop), n, 0, t, col), B.v(P[i], n, 0.5, t, col), B.v(P[i].clone().addScaledVector(side, w).add(droop), n, 1, t, col)); }
      for (let i = 0; i < ids.length / 3 - 1; i++) { const a0 = ids[i * 3], b0 = ids[i * 3 + 1], c0 = ids[i * 3 + 2], a1 = ids[i * 3 + 3], b1 = ids[i * 3 + 4], c1 = ids[i * 3 + 5]; B.idx.push(a0, a1, b0, b0, a1, b1, b0, b1, c0, c0, b1, c1); }
      void base;
    }
    if (k % 3 === 0) card(leaf.far, top.clone().addScaledVector(dirH, L * 0.5).add(new THREE.Vector3(0, -L * 0.1, 0)), L * 0.9, L * 0.5, a + Math.PI / 2, -0.9, 0, ctr, [1, 1, 1], 0.3);
  }
  // chùm dừa + bẹ
  for (let k = 0; k < 7; k++) { const a = r() * 6.28, c = top.clone().add(new THREE.Vector3(Math.cos(a) * 0.35, -0.5 - r() * 0.3, Math.sin(a) * 0.35)); const sg = new THREE.SphereGeometry(0.17, 6, 5); sg.translate(c.x, c.y, c.z); const P2 = sg.attributes.position, N2 = sg.attributes.normal, U2 = sg.attributes.uv; const base = bark.near.pos.length / 3; for (let i = 0; i < P2.count; i++) bark.near.v(new THREE.Vector3(P2.getX(i), P2.getY(i), P2.getZ(i)), new THREE.Vector3(N2.getX(i), N2.getY(i), N2.getZ(i)), U2.getX(i), U2.getY(i)); for (let i = 0; i < sg.index.count; i++) bark.near.idx.push(base + sg.index.array[i]); }
  const out = {}; for (const l of ['near', 'mid', 'far']) out[l] = { bark: bark[l].geo(), leaf: leaf[l].geo() };
  return { ...out, H: H + 1.5, R: sp.frondL * 0.9, trunkR: sp.trunk * 1.3, crownY: H - 3, tips: nF, nodes: 15 };
}

// ---------------------------------------------------------------- VẬT LIỆU + BỘ ĐỆM
const WIND = { uTime: { value: 0 } };
export function windTick(t) { WIND.uTime.value = t; }
function leafMat(map) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.42, side: THREE.DoubleSide, vertexColors: true, roughness: 0.82, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = WIND.uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;').replace('#include <begin_vertex>', `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 ip = instanceMatrix[3].xyz;
  float hk = max(0.0, position.y - 3.0) * 0.012;
  transformed.x += sin(uTime * 1.2 + ip.x * 0.11 + position.y * 0.3 + position.z * 0.4) * hk;
  transformed.z += cos(uTime * 0.9 + ip.z * 0.13 + position.x * 0.4) * hk * 0.7;
  transformed.y += sin(uTime * 2.3 + position.x * 1.7 + position.z * 1.3) * hk * 0.25;
#endif`);
    // không lật pháp tuyến mặt sau (pháp tuyến cầu đã hướng ra ngoài) + xuyên sáng giả khi nắng sau lưng tán
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nnormal = normalize(vNormal);')
      // ánh trời lọt qua tán: lá trong bóng vẫn có màu (không đen kịt) — giả tán xạ / xuyên sáng
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * 0.13;');
  };
  m.customProgramCacheKey = () => 'tp-oldtree-leaf2';
  return m;
}
const TPL = new Map(); // `${sp}|${v}` → { geo: tree, mats }
const MATS = new Map();
export const VARIANTS = 3;
function matsOf(spKey, season) {
  const k = `${spKey}|${season}`; if (MATS.has(k)) return MATS.get(k);
  const sp = SPECIES[spKey];
  let lc = sp.lc;
  if (season === 2 && sp.autumn) { const a = new THREE.Color(sp.autumn); lc = [a.getHexString(), a.clone().offsetHSL(0, 0, 0.12).getHexString(), a.clone().offsetHSL(0, 0, -0.15).getHexString()].map((h) => '#' + h); }
  if (season === 1 && sp.spring) lc = sp.lc;
  if (season === 3 && !['scale', 'needle', 'frond'].includes(sp.leaf)) lc = ['#dfe6ea', '#f4f7f8', '#aab4ba'];
  const m = { bark: new THREE.MeshStandardMaterial({ map: barkTex(sp.bark, sp.bc, spKey.length * 31 + 7), roughness: 0.95, metalness: 0 }), leaf: leafMat(leafTex(sp.leaf, lc, spKey.length * 17 + 3, { candles: sp.candles, flowers: sp.flowers })) };
  MATS.set(k, m); return m;
}
export function treeTemplate(spKey, v) {
  const k = `${spKey}|${v}`; if (!TPL.has(k)) TPL.set(k, growTree(spKey, v * 1013 + 11)); return TPL.get(k);
}
/** bán kính thân (va chạm) và bán kính tán của loài ở cỡ s (trung bình biến thể) */
export function treeDims(spKey, s = 1) { const sp = SPECIES[spKey]; const H = ((sp.H[0] + sp.H[1]) / 2) * s; return { H, R: sp.palm ? (sp.frondL || 5) * 0.9 : (H * sp.cw) / 2, trunkR: (sp.palm ? sp.trunk * 1.3 : sp.trunk) * s }; }

export const NEAR = 70, MID = 170, FAR = 330, CELL = 90;
const tri = (g) => (g.index ? g.index.count : g.attributes.position.count) / 3;
/**
 * Trồng cây cổ thụ vào parent (cục bộ phủ). list: [{ x, z, kind (khoá SPECIES), s, v? }]. season 0..3.
 * Trả { group, update(lx, lz), ready (Promise), stats() } — giống flora.plantFlora để mansion3d gọi chung.
 * Sinh hình học dần (mỗi loài-biến thể một lượt rảnh) để không khựng khung.
 */
export function plantOldTrees(parent, list, season = 0) {
  const group = new THREE.Group(); group.name = 'oldtrees'; group.userData.noCollide = true; parent.add(group);
  const by = new Map();
  list.forEach((t, i) => { if (!SPECIES[t.kind]) return; const v = t.v ?? (((Math.abs(Math.round(t.x * 7 + t.z * 13)) + i) % VARIANTS)); const key = `${t.kind}|${v}`; if (!by.has(key)) by.set(key, { kind: t.kind, v, items: [] }); by.get(key).items.push(t); });
  const sets = [];
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color();
  const idle = (fn) => new Promise((res) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(() => res(fn()), { timeout: 400 }) : setTimeout(() => res(fn()), 0)));
  const ready = (async () => {
    for (const { kind, v, items } of by.values()) {
      const T = await idle(() => treeTemplate(kind, v)), mt = matsOf(kind, season);
      const cells = new Map();
      for (const it of items) { const k = `${Math.floor(it.x / CELL)},${Math.floor(it.z / CELL)}`; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(it); }
      for (const L of cells.values()) {
        const all = new Float32Array(L.length * 16), tint = new Float32Array(L.length * 3);
        L.forEach((it, i) => { const s = it.s || 1, ry = ((it.x * 12.9898 + it.z * 78.233) % 6.283); Q.setFromAxisAngle(_up, ry); M4.compose(V.set(it.x, 0, it.z), Q, S.set(s, s * (0.94 + ((i * 37) % 10) * 0.012), s)); M4.toArray(all, i * 16);
          const h = hash3(it.x, 1, it.z); C.setRGB(0.9 + h * 0.18, 0.94 + h * 0.1, 0.9 + (1 - h) * 0.14); C.toArray(tint, i * 3); });
        const lv = {};
        for (const l of ['near', 'mid', 'far']) {
          lv[l] = ['bark', 'leaf'].map((part) => { const im = new THREE.InstancedMesh(T[l === 'far' ? 'mid' : l][part], mt[part], L.length); im.castShadow = l === 'near'; im.receiveShadow = l !== 'far'; im.count = 0; im.visible = false; if (part === 'leaf') im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(L.length * 3).fill(1), 3); group.add(im); return im; });
        }
        sets.push({ items: L, all, tint, lv, T });
      }
      lx = Infinity;
    }
  })();
  let lx = Infinity, lz = Infinity, t0 = (typeof performance !== 'undefined' ? performance.now() : 0);
  function update(px, pz) {
    if (typeof performance !== 'undefined') windTick((performance.now() - t0) / 1000);
    if (Math.hypot(px - lx, pz - lz) < 10) return;
    lx = px; lz = pz;
    for (const st of sets) {
      const n = { near: 0, mid: 0, far: 0 };
      st.items.forEach((it, i) => {
        const d = Math.hypot(it.x - px, it.z - pz), l = d < NEAR ? 'near' : d < MID ? 'mid' : d < FAR ? 'far' : null; if (!l) return;
        const j = n[l]++; for (const im of st.lv[l]) { im.instanceMatrix.array.set(st.all.subarray(i * 16, i * 16 + 16), j * 16); if (im.instanceColor) im.instanceColor.array.set(st.tint.subarray(i * 3, i * 3 + 3), j * 3); }
      });
      for (const l of ['near', 'mid', 'far']) for (const im of st.lv[l]) { const was = im.count; im.count = n[l]; im.visible = n[l] > 0; if (n[l] || was) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; } if (n[l]) { im.boundingSphere = null; im.computeBoundingSphere(); } }
    }
  }
  return {
    group, update, ready,
    stats: () => sets.reduce((o, s) => { o.n += s.items.length; for (const l of ['near', 'mid', 'far']) { o[l] += s.lv[l][0].count; o.tris += s.lv[l].reduce((a, im) => a + im.count * tri(im.geometry), 0); } o.meshes += 6; return o; }, { n: 0, near: 0, mid: 0, far: 0, tris: 0, meshes: 0 }),
  };
}
