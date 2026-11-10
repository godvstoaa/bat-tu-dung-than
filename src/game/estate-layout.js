// ============================================================================
//  QUY HOẠCH TRONG KHUÔN VIÊN (thuần JS, tất định, KHÔNG phụ thuộc cityblocks — máy chủ dùng được qua estate-core):
//  phong cách kiến trúc + bố cục một biệt phủ (4.550–10.000 m²) hoặc một biệt thự (lô ~420 m²) theo phong thủy:
//    · TỌA SƠN: dải gò / rặng cây sau lưng nhà chính (hậu chẩm);
//    · HƯỚNG THỦY: mặt nước (minh đường) trước nhà chính, lối chính theo trục giữa, cổng ở mặt tiền;
//    · TẢ THANH LONG (bên trái khi đứng trong nhà nhìn ra = +x cục bộ) nhà phụ cao; HỮU BẠCH HỔ (−x) đình thấp;
//    · đường đi không chĩa thẳng vào cửa chính (mặt nước / cầu / bồn hoa đỡ giữa trục).
//  Khung cục bộ: gốc = tâm lô, +z = mặt tiền (cổng), lô rộng W (trục x) × sâu D (trục z). ry gian: 0 = cửa quay +z.
//  Trả: { buildings, zones, water, mound, pavs, paths, trees, gate, fence } — mansion3d.js dựng, mansions.js va chạm,
//  estate-core lấy `zones` để kiểm bố cục bài trí (k = chỉ số vùng).
// ============================================================================
const Q = Math.PI / 2;

/** Phong cách: fam asian | western | modern | mughal · roof · water · fence · trees · bảng màu */
export const STYLES = {
  cungdinh: { name: 'Cung Đình Trung Hoa', fam: 'asian', roof: 'curved', roofCol: '#6f9a64', wall: '#9a3324', trim: '#d9a441', water: 'pond', fence: 'redwall', trees: ['pine', 'ginkgo', 'peach', 'willow', 'plum', 'osmanthus'], sig: 'pagoda9', wings: true, floors: 1, plinth: 1.1 },
  moorish: { name: 'Tây Ban Nha – Moorish', fam: 'western', roof: 'flat', roofCol: '#b5562e', wall: '#f1e9da', trim: '#2f6b8a', water: 'canal', fence: 'stucco', trees: ['palm', 'cypress', 'olive', 'jacaranda', 'frangi'], sig: 'minaret', arches: true, floors: 2, plinth: 0.5 },
  hue: { name: 'Phủ Đệ Huế', fam: 'asian', roof: 'vn', roofCol: '#7a4a32', wall: '#6b3e26', trim: '#c9a24a', water: 'lotus', fence: 'brick', trees: ['palm', 'frangi', 'banyan', 'plum', 'bamboo'], sig: 'bell', wings: true, floors: 1, plinth: 0.8 },
  tuscan: { name: 'Biệt Thự Tuscan', fam: 'western', roof: 'hip', roofCol: '#b8613a', wall: '#e2c48e', trim: '#6b4a2a', water: 'parterre', fence: 'stone', trees: ['cypress', 'olive', 'magnolia', 'hedge', 'jacaranda'], sig: 'campanile', floors: 2, plinth: 0.4 },
  nhatban: { name: 'Dinh Thự Nhật Bản', fam: 'asian', roof: 'irimoya', roofCol: '#3a3d42', wall: '#ece6d6', trim: '#3b2a1e', water: 'zen', fence: 'bamboo', trees: ['sakura', 'maple', 'pine', 'bamboo', 'wisteria'], sig: 'tenshu', floors: 1, plinth: 0.7 },
  kinh: { name: 'Hiện Đại Kính', fam: 'modern', roof: 'flat', roofCol: '#e8e8e4', wall: '#f2f2ef', trim: '#2a2d31', water: 'pool', fence: 'modern', trees: ['birch', 'maple', 'olive', 'hedge', 'ginkgo'], sig: 'glass', glass: true, floors: 2, plinth: 0.3 },
  palladian: { name: 'Tân Cổ Điển Palladio', fam: 'western', roof: 'hip', roofCol: '#5c6168', wall: '#ece3cf', trim: '#ffffff', water: 'parterre', fence: 'iron', trees: ['cypress', 'magnolia', 'hedge', 'olive', 'birch'], sig: 'rotunda', portico: true, dome: true, floors: 2, plinth: 1.0 },
  chateau: { name: 'Lâu Đài Pháp', fam: 'western', roof: 'mansard', roofCol: '#3e4a5a', wall: '#ddd6c6', trim: '#f5f2ea', water: 'parterre', fence: 'iron', trees: ['hedge', 'cypress', 'maple', 'magnolia', 'wisteria'], sig: 'donjon', turrets: true, floors: 3, plinth: 0.8 },
  giangnam: { name: 'Viên Lâm Giang Nam', fam: 'asian', roof: 'curved', roofCol: '#3e434a', wall: '#ece8de', trim: '#3b2a1e', water: 'pond', fence: 'whitewall', trees: ['willow', 'bamboo', 'plum', 'osmanthus', 'ginkgo'], sig: 'pagoda7', wings: true, floors: 2, plinth: 0.5 },
  toigian: { name: 'Tối Giản Hiện Đại', fam: 'modern', roof: 'flat', roofCol: '#ffffff', wall: '#fbfbf8', trim: '#8a8f96', water: 'pool', fence: 'modern', trees: ['olive', 'birch', 'hedge', 'jacaranda', 'maple'], sig: 'cube', floors: 2, plinth: 0.2 },
  hanok: { name: 'Hanok Hàn Quốc', fam: 'asian', roof: 'curved', roofCol: '#4a4e55', wall: '#efe9da', trim: '#6b4a2a', water: 'pond', fence: 'stonewall', trees: ['pine', 'maple', 'sakura', 'ginkgo', 'camellia'], sig: 'bellhanok', wings: true, floors: 1, plinth: 0.9 },
  tudor: { name: 'Trang Viên Tudor', fam: 'western', roof: 'gable', roofCol: '#4a3a34', wall: '#efe6d2', trim: '#3a2a20', water: 'lawn', fence: 'hedge', trees: ['maple', 'birch', 'hedge', 'pine', 'magnolia'], sig: 'clock', timber: true, floors: 2, plinth: 0.4 },
  thai: { name: 'Cung Điện Thái Lan', fam: 'asian', roof: 'thai', roofCol: '#a8322a', wall: '#f3eee2', trim: '#e0b040', water: 'lotus', fence: 'whitewall', trees: ['palm', 'frangi', 'banyan', 'jacaranda', 'camellia'], sig: 'stupa', floors: 1, plinth: 1.2 },
  nhietdoi: { name: 'Nhiệt Đới Hiện Đại', fam: 'modern', roof: 'flat', roofCol: '#6a5a46', wall: '#e6dccb', trim: '#7a5a3a', water: 'pool', fence: 'modern', trees: ['palm', 'frangi', 'banyan', 'jacaranda', 'bamboo'], sig: 'wood', louver: true, floors: 2, plinth: 0.3 },
  mughal: { name: 'Cung Điện Mughal', fam: 'mughal', roof: 'onion', roofCol: '#f4f1ea', wall: '#f4f1ea', trim: '#b0503a', water: 'canal', fence: 'redstone', trees: ['cypress', 'palm', 'jacaranda', 'camellia', 'osmanthus'], sig: 'minaret2', arches: true, floors: 2, plinth: 1.4 },
  bali: { name: 'Biệt Viện Bali', fam: 'asian', roof: 'thatch', roofCol: '#8a6a3a', wall: '#d8c8a8', trim: '#5a4630', water: 'pool', fence: 'stone', trees: ['palm', 'frangi', 'banyan', 'camellia', 'bamboo'], sig: 'meru', floors: 1, plinth: 0.8 },
  // phong cách khu biệt thự
  diatrunghai: { name: 'Địa Trung Hải', fam: 'western', roof: 'hip', roofCol: '#c0653b', wall: '#f6f1e6', trim: '#2f6b8a', water: 'pool', fence: 'stucco', trees: ['olive', 'cypress', 'palm'], arches: true, floors: 2, plinth: 0.3 },
  nhavuon: { name: 'Nhà Vườn Huế', fam: 'asian', roof: 'vn', roofCol: '#7a4a32', wall: '#7a4a2e', trim: '#c9a24a', water: 'lotus', fence: 'brick', trees: ['palm', 'frangi', 'peach'], floors: 1, plinth: 0.6 },
  phap: { name: 'Biệt Thự Pháp', fam: 'western', roof: 'mansard', roofCol: '#4a5566', wall: '#f0e3c4', trim: '#ffffff', water: 'parterre', fence: 'iron', trees: ['hedge', 'maple', 'cypress'], floors: 2, plinth: 0.5 },
};
/** 16 biệt phủ (thứ tự = cung × bên — cityblocks.mansionPlots): phong cách + kích thước W × D (m) */
export const PHU_PLAN = [
  { style: 'cungdinh', W: 100, D: 100 }, { style: 'moorish', W: 80, D: 80 },   // Ly
  { style: 'hue', W: 90, D: 90 }, { style: 'tuscan', W: 75, D: 80 },          // Khôn
  { style: 'nhatban', W: 90, D: 95 }, { style: 'kinh', W: 70, D: 70 },         // Đoài
  { style: 'palladian', W: 100, D: 95 }, { style: 'chateau', W: 85, D: 95 },   // Càn
  { style: 'giangnam', W: 95, D: 90 }, { style: 'toigian', W: 65, D: 70 },     // Khảm
  { style: 'hanok', W: 85, D: 85 }, { style: 'tudor', W: 75, D: 80 },          // Cấn
  { style: 'thai', W: 85, D: 90 }, { style: 'nhietdoi', W: 70, D: 75 },        // Chấn
  { style: 'mughal', W: 100, D: 90 }, { style: 'bali', W: 80, D: 80 },          // Tốn
];
/** 8 khu biệt thự (theo thứ tự GUA: li kun dui qian kan gen zhen xun) */
export const VILLA_STYLES = ['diatrunghai', 'nhavuon', 'nhatban', 'phap', 'toigian', 'hanok', 'nhietdoi', 'giangnam'];
export const VILLA_DISTRICT_NAME = ['Hải Vân Uyển', 'Hương Giang Viên', 'Anh Hoa Lý', 'Lục Hoa Trang', 'Bạch Thạch Khu', 'Tùng Vân Thôn', 'Lục Diệp Uyển', 'Thủy Hương Phường'];
export const VILLAS_PER_DISTRICT = 30;
export const VILLA_W = 19, VILLA_D = 22;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Bố cục một khuôn viên. kind: 'phu' | 'villa'.
 *  zones: [{ k, kind: 'hall'|'yard', id, name, x, z, w, d, h, plinth, ry, back?, main?, keep? }]
 */
export function estateLayout(kind, styleId, W, D) {
  const S = STYLES[styleId], hw = W / 2, hd = D / 2;
  const phu = kind === 'phu';
  const out = { style: styleId, S, W, D, buildings: [], zones: [], water: [], pavs: [], towers: [], trees: [], paths: [], mound: null, gate: { w: phu ? 8 : 3.2 }, fence: S.fence };
  // --- tọa sơn: dải sau lưng
  const hb = phu ? clamp(D * 0.13, 8, 13) : 2.2;
  out.mound = { x: 0, z: -hd + 1 + hb / 2, w: W - (phu ? 8 : 2.5), d: hb, kind: !phu ? 'hedge' : S.fam === 'asian' ? 'rock' : S.fam === 'modern' ? 'hedge' : 'trees' };
  // --- nhà chính
  const wm = phu ? clamp(W * 0.46, 24, 44) : 12, dm = phu ? clamp(D * 0.2, 13, 19) : 9;
  // thế giới tu tiên: nhà chính cao lớn — Á Đông phủ: chính điện hai tầng hiên ~11 m trên nền đá trắng 2,4 m;
  // Tây / hiện đại phủ: 3–4 tầng (4,2 m / tầng); biệt thự: 2–3 tầng
  const floors = phu ? (S.fam === 'asian' ? 2 : Math.max(3, S.floors + 1)) : Math.max(2, Math.min(3, S.floors + 1));
  const hm = S.fam === 'asian' ? (phu ? 11 : 7.2) : 4.2 * floors;
  const zm = -hd + 1 + hb + (phu ? 4 : 1.5) + dm / 2;
  const plinth = phu ? (S.fam === 'asian' || S.fam === 'mughal' ? Math.max(2.4, S.plinth * 2) : Math.max(1.2, S.plinth)) : Math.min(0.9, S.plinth + 0.3);
  const main = { id: 'main', name: phu ? 'Chính Đường' : 'Nhà chính', x: 0, z: zm, w: wm, d: dm, h: hm, floors, plinth, ry: 0, back: phu, main: true };
  out.buildings.push(main);
  // --- minh đường: mặt nước trước nhà chính
  const fz0 = zm + dm / 2 + (phu ? 5 : 1) + plinth; // mép trước nhà + sân
  const gz = hd - (phu ? 6 : 1.2);                    // trong cổng
  // biệt thự: bể / ao nhỏ bên Thanh Long (+x), lối giữa vẫn thẳng ra cổng
  const wd = phu ? clamp((gz - fz0) * 0.42, 9, 22) : 3, ww = phu ? clamp(W * 0.42, 18, 40) : 5;
  const wz = phu ? fz0 + 2 + wd / 2 : (fz0 + gz) / 2, wx = phu ? 0 : 4.6;
  const water = { kind: S.water, x: wx, z: wz, w: ww, d: wd };
  if (S.water !== 'lawn') out.water.push(water);
  // lối chính: trục giữa — mặt nước kiểu ao có cầu trên trục, kiểu bể / kênh tách hai bên trục
  out.paths.push({ x: 0, z: (fz0 + gz) / 2, w: phu ? 4 : 1.6, d: gz - fz0 + 1 });
  // --- tả Thanh Long (+x): nhà phụ cao · hữu Bạch Hổ (−x): đình thấp
  if (phu) {
    const wg = clamp(D * 0.22, 14, 22), dg = clamp(W * 0.12, 8, 12), xg = hw - 4 - dg / 2, zg = clamp(zm + dm / 2 + 6 + wg / 2, -hd + 20, gz - wg / 2 - 4);
    out.buildings.push({ id: 'guest', name: S.fam === 'western' || S.fam === 'modern' ? 'Nhà Khách' : 'Đông Sương', x: xg, z: zg, w: wg, d: dg, h: S.fam === 'asian' ? 7.4 : 4.2 * 2, floors: 2, plinth: Math.max(0.8, plinth * 0.5), ry: -Q });
    if (S.wings) out.buildings.push({ id: 'wing', name: 'Tây Sương', x: -xg, z: zg, w: wg, d: dg, h: 7.4, floors: 2, plinth: Math.max(0.8, plinth * 0.5), ry: Q });
    // VỌNG LÂU / tháp cao (~30 m) bên Thanh Long phía sau — tả Thanh Long cao hơn hữu Bạch Hổ
    const tx0 = wm / 2 + 4, tx1 = hw - 4, tz0 = -hd + 1 + hb + 1, tz1 = Math.min(zg - wg / 2 - 2, zm + dm / 2);
    const ts = Math.min(10, tx1 - tx0, tz1 - tz0);
    if (ts >= 7) out.towers.push({ id: 'tower', name: S.fam === 'asian' ? 'Vọng Tiên Lâu' : S.fam === 'modern' ? 'Tháp Kính' : S.fam === 'mughal' ? 'Tháp Minaret' : 'Tháp Chuông', x: (tx0 + tx1) / 2, z: (tz0 + tz1) / 2, w: ts, d: ts, h: 26 + ts });
    // hữu Bạch Hổ: đình thấp bên mặt nước
    out.pavs.push({ id: 'waterpav', name: S.fam === 'asian' ? 'Thủy Tạ' : S.fam === 'modern' ? 'Nhà Hồ Bơi' : 'Vọng Đình', x: -(ww / 2 + 6), z: wz, w: 7, d: 7, h: 3.4, octa: S.fam === 'asian' || S.fam === 'mughal' });
  }
  // --- vùng bài trí
  const zones = [];
  out.buildings.forEach((b, i) => zones.push({ k: i, kind: 'hall', id: b.id, name: b.name, x: b.x, z: b.z, w: b.w, d: b.d, h: Math.min(b.h, S.fam === 'asian' ? b.h / (b.floors > 1 ? 1.6 : 1) : 4.2), plinth: b.plinth, ry: b.ry, back: !!b.back, main: !!b.main }));
  // sân trước (giữa mặt nước và cổng) · vườn bên Bạch Hổ cạnh nhà chính
  const fy0 = phu ? wz + wd / 2 + 1 : fz0 + 0.2, fy1 = gz - 0.5;
  if (fy1 - fy0 > 3) {
    // bề ngang: không lấn nhà phụ / đình nằm cùng dải z
    let half = phu ? hw - 6 : hw - 1.5;
    for (const b of [...out.buildings, ...out.pavs]) {
      const sw = Math.abs(Math.sin(b.ry || 0)) > 0.5, bx = (sw ? b.d : b.w) / 2 + 1.2, bz = (sw ? b.w : b.d) / 2 + 1.2;
      if (b.z + bz > fy0 && b.z - bz < fy1 && Math.abs(b.x) > 0.1) half = Math.min(half, Math.abs(b.x) - bx - 0.5);
    }
    const zd = fy1 - fy0, zc = (fy0 + fy1) / 2;
    const keep = [{ x: 0, z: 0, w: phu ? 5 : 2, d: zd }];
    if (!phu) keep.push({ x: wx, z: wz - zc, w: ww + 0.6, d: wd + 0.6 });
    zones.push({ k: zones.length, kind: 'yard', id: 'front', name: phu ? 'Tiền Viện' : 'Sân trước', x: 0, z: zc, w: half * 2, d: zd, ry: 0, keep });
  }
  if (phu) {
    const sx0 = -hw + 4, sx1 = -wm / 2 - 3, sz0 = -hd + 1 + hb + 1, sz1 = zm + dm / 2 + 3;
    if (sx1 - sx0 > 6) zones.push({ k: zones.length, kind: 'yard', id: 'side', name: 'Vườn Bạch Hổ', x: (sx0 + sx1) / 2, z: (sz0 + sz1) / 2, w: sx1 - sx0, d: sz1 - sz0, ry: 0, keep: [] });
  } else {
    const sx0 = -hw + 1, sx1 = -main.w / 2 - 0.6;
    if (sx1 - sx0 > 2.5) zones.push({ k: zones.length, kind: 'yard', id: 'side', name: 'Vườn hông', x: (sx0 + sx1) / 2, z: zm, w: sx1 - sx0, d: dm, ry: 0, keep: [] });
  }
  out.zones = zones;
  // --- cây theo phong cách (tất định)
  const T = S.trees, tk = (i) => T[i % T.length];
  if (phu) {
    for (let i = 0; i < 7; i++) out.trees.push({ x: -hw + 6 + i * (W - 12) / 6, z: out.mound.z + (i % 2 ? 2 : -2), kind: tk(i) });          // rặng sau (hậu chẩm)
    // hai hàng cây dọc tường bên (đủ mọi loại của phong cách, xen kẽ)
    let n = 1; for (const sx of [-1, 1]) for (let z = gz - 2; z > -hd + 1 + hb + 2; z -= 7) out.trees.push({ x: sx * (hw - 2.2), z, kind: tk(n++) });
  } else {
    out.trees.push({ x: -hw + 2, z: gz - 2.2, kind: tk(0) }, { x: hw - 2, z: out.mound.z, kind: tk(1) }, { x: -hw + 2, z: out.mound.z, kind: tk(2) });
  }
  return out;
}

/** Tên hướng (la bàn 8 hướng) từ véc-tơ hướng cửa (thế giới: +x Đông, −z Bắc) */
export function compassOf(dx, dz) {
  const a = (Math.atan2(dx, -dz) * 180 / Math.PI + 360) % 360; // 0 = Bắc, 90 = Đông
  const names = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const gua = ['Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài', 'Càn'];
  const i = Math.round(a / 45) % 8, back = (i + 4) % 8;
  const dong = [0, 2, 3, 4].includes(back); // Đông tứ trạch: tọa Khảm, Chấn, Tốn, Ly
  return { name: names[i], gua: gua[i], back: gua[back], text: `Tọa ${gua[back]} hướng ${gua[i]} (cửa nhìn ${names[i]})`, trach: dong ? 'Đông tứ trạch' : 'Tây tứ trạch', dong };
}
