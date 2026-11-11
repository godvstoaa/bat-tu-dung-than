// ============================================================================
//  THÀNH v4 — LỚP GHÉP (thuần JS, tất định) giữa dữ liệu bố cục citylayout.js và các hệ trong game
//  (dựng 3D, cửa vào, tiệm, nhà rao bán, biệt phủ / biệt thự, phòng nội thất).
//
//  NHÀ RIÊNG GIỮ NGUYÊN CHỈ SỐ h (estate-core.LISTING_TIERS): 283 căn cùng hạng, cùng vùng bài trí / phòng trong —
//  chỉ DỜI CHỖ sang thành mới → người đã mua không mất nhà, đồ đạc bài trí vẫn hợp lệ (máy chủ kiểm theo h).
//    h 0–15   biệt phủ: mỗi cung 2 phủ trên hai khối đầu Ngoại Thành (dải g3, cột sát đại lộ, gộp hai hàng — phố
//             ngang giữa hai khối nhường cho khuôn viên); cổng quay ra đại lộ; kích thước theo PHU_PLAN.
//    h 16–255 biệt thự: 30 căn mỗi cung trên lô nhà vườn dải g2 / g3 (lô 22 m sâu, đủ 19 × 22).
//    h 256–282 nhà phố: Tiểu Xá / Nhà Phố / Tứ Hợp Viện trên lô nhà ở dải t2 / g1 (thứ tự hạng như LISTING_TIERS).
//  Nhà v4 nằm trong khuôn viên biệt phủ / trên lô biệt thự bị bỏ khỏi lớp nhà (khuôn viên tự dựng — mansions3d).
// ============================================================================
import * as L from './citylayout.js';
import { GUA, toWorld, toLocal } from './batquai.js';
import { PHU_PLAN, VILLA_STYLES, VILLAS_PER_DISTRICT, VILLA_W, VILLA_D } from './estate-layout.js';
import { LISTING_TIERS, PHU_COUNT, VILLA_COUNT } from './estate-core.js';
import { HOUSE_SPECS } from './cityblocks.js';

const band = (h) => String(h.block).split('|')[1];
const r1 = (v) => Math.round(v * 100) / 100;
let ALL = null;
/** mọi nhà v4 (sinh hết các ô một lần, giữ trong bộ nhớ) */
export function allHouses() {
  if (ALL) return ALL;
  ALL = [];
  for (const id of L.cityCells()) for (const h of L.cell(id).houses) ALL.push(h);
  return ALL;
}

// --- biệt phủ ----------------------------------------------------------------------------------------------
let PLOTS = null;
function plots() {
  if (PLOTS) return PLOTS;
  const B = L.blocks();
  const phu = [], removed = new Set(), dropRoad = [];
  GUA.forEach((g, gi) => {
    [1, -1].forEach((s, si) => {
      const k = gi * 2 + si, P = PHU_PLAN[k];
      const two = B.filter((b) => b.g === g.id && b.band === 'g3' && b.col === 0 && b.s === s && (b.row === 0 || b.row === 1));
      if (two.length < 2) return;
      let u0 = Infinity, u1 = -Infinity, va = Infinity, vb = -Infinity;
      for (const b of two) for (const p of b.poly) { const q = toLocal(g, p.x, p.z); u0 = Math.min(u0, q.u); u1 = Math.max(u1, q.u); va = Math.min(va, Math.abs(q.v)); vb = Math.max(vb, Math.abs(q.v)); }
      const uc = (u0 + u1) / 2, vIn = va + 2, vc = s * (vIn + P.D / 2); // mặt tiền (cổng) sát đại lộ
      const c = toWorld(g, uc, vc), p1 = toWorld(g, uc, vc - s); // hướng về đại lộ
      const fx = p1.x - c.x, fz = p1.z - c.z;
      phu.push({ k, g: g.id, x: r1(c.x), z: r1(c.z), ry: Math.atan2(fx, fz), W: P.W, D: P.D, style: P.style, u0, u1, vIn, vOut: vIn + P.D });
      dropRoad.push({ g, s, u0: u0 - 1, u1: u1 + 1, v0: va - 1, v1: vb + 1 });
    });
  });
  const inPhu = (x, z) => dropRoad.some((r) => { const q = toLocal(r.g, x, z); return q.u > r.u0 && q.u < r.u1 && q.v * r.s > r.v0 && q.v * r.s < r.v1; });
  for (const h of allHouses()) if (inPhu(h.x, h.z)) removed.add(h.id);
  // biệt thự: 30 lô nhà vườn mỗi cung, rải đều theo thứ tự id (tất định)
  const villas = [];
  GUA.forEach((g, gi) => {
    const cand = allHouses().filter((h) => h.use === 'home' && h.district === `ngoai-${g.id}` && (band(h) === 'g2' || band(h) === 'g3') && h.w >= VILLA_W && h.d >= VILLA_D - 0.1 && !removed.has(h.id))
      .sort((a, b) => (a.id < b.id ? -1 : 1));
    const step = Math.max(1, Math.floor(cand.length / VILLAS_PER_DISTRICT));
    for (let n = 0; n < VILLAS_PER_DISTRICT && n * step < cand.length; n++) {
      const h = cand[n * step]; removed.add(h.id);
      villas.push({ i: villas.length, n, district: gi, g: g.id, x: h.x, z: h.z, ry: h.ry, W: VILLA_W, D: VILLA_D, style: VILLA_STYLES[gi], house: h.id });
    }
  });
  // nhà phố: theo đúng thứ tự hạng LISTING_TIERS (mỗi cung tieuxa, nhapho, tuhop [+ tieuxa ở li kan zhen dui xun])
  const street = [], tiers = LISTING_TIERS.slice(PHU_COUNT + VILLA_COUNT);
  const BAND = { tieuxa: 't2', nhapho: 't2', tuhop: 'g1' };
  const used = {};
  tiers.forEach((t, j) => {
    const g = GUA[j % GUA.length], key = `${g.id}:${t}`, nth = (used[key] = (used[key] || 0) + 1);
    const cand = allHouses().filter((h) => h.use === 'home' && h.district.endsWith(`-${g.id}`) && band(h) === BAND[t] && !removed.has(h.id))
      .sort((a, b) => (t === 'tuhop' ? b.w * b.d - a.w * a.d : a.w * a.d - b.w * b.d) || (a.id < b.id ? -1 : 1));
    const h = cand[nth * 4 - 1] || cand[0]; if (!h) return;
    removed.add(h.id);
    street.push({ tier: t, g: g.id, house: h });
  });
  PLOTS = { phu, villas, street, removed, dropRoad: (x, z) => inPhu(x, z) };
  return PLOTS;
}
export const phuPlots = () => plots().phu;
/** nhà v4 đã nhường chỗ cho biệt phủ / biệt thự / nhà rao bán (không còn là tiệm / nhà gõ cửa) */
export const isRemoved = (id) => plots().removed.has(id);
export const villaPlots = () => plots().villas;
export const streetListings = () => plots().street;
/** điểm (x, z) nằm trong khuôn viên biệt phủ (đường phố đi qua đó không vẽ, không đi) */
export const inPhuPlot = (x, z) => plots().dropRoad(x, z);

// --- lớp nhà dựng 3D + va chạm ------------------------------------------------------------------------------
// mặt tiền theo loại tiệm (model đã đóng gói trong HOUSE_SPECS)
const FACADE = { tuu: 'bq_tavern', tralau: 'bq_teahouse', tratrang: 'bq_teashop', gom: 'bq_pottery', den: 'bq_lantern_shop', thuhoa: 'bq_bookstore', huong: 'bq_incense', duoc: 'bq_apothecary', loren: 'bq_forge', moc: 'bq_carpentry', hoavien: 'bq_moongate', phongthuy: 'bq_shop_lantern', dichtram: 'bq_inn', namon: 'bq_yamen' };
const RES_BY_GUA = {
  li: ['bq_house_2f', 'bq_house_tiled', 'lib_courtyard', 'bq_tower_house'], kun: ['bq_farmhouse', 'bq_house_stone', 'bq_granary', 'bq_rural_house'],
  dui: ['bq_house_2f', 'lib_courtyard', 'bq_house_tiled'], qian: ['bq_house_stone', 'lib_courtyard', 'bq_tower_house'],
  kan: ['bq_canal_house', 'bq_house_tiled', 'lib_courtyard', 'bq_stilt'], gen: ['bq_house_stone', 'lib_mtn_house', 'bq_rural_house'],
  zhen: ['bq_house_2f', 'bq_house_tiled', 'bq_tower_house'], xun: ['lib_courtyard', 'bq_house_2f', 'bq_canal_house'],
};
const GARDEN = ['lib_courtyard', 'bq_farmhouse', 'bq_house_stone'];
const FACADE_GAP = { bq_teahouse: 0.8, bq_tavern: 0.82, bq_lantern_shop: 0.86, bq_apothecary: 0.86, bq_moongate: 0.86, bq_pottery: 0.88, bq_carpentry: 0.88, bq_incense: 0.88, bq_bookstore: 0.88, bq_forge: 0.88, bq_inn: 0.86, bq_yamen: 0.86, bq_drum_tower: 0.8, bq_shop_lantern: 0.9, bq_teashop: 0.9 };
const WX_TINT = { 火: [1, 0.86, 0.82], 水: [0.86, 0.92, 1], 木: [0.88, 1, 0.86], 金: [1, 1, 1], 土: [1, 0.94, 0.82] };
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
export function modelOf(h) {
  if (h.use === 'shop') return FACADE[h.type] || 'bq_shop_lantern';
  if (h.use === 'fortune') return 'bq_incense';
  if (h.use === 'temple') return 'bq_drum_tower';
  if (h.use === 'service') return 'bq_yamen'; // Tiền Trang
  const g = String(h.district).split('-').pop(), b = band(h);
  const list = b === 'g2' || b === 'g3' ? GARDEN : RES_BY_GUA[g] || RES_BY_GUA.li;
  return list[hash(h.id) % list.length];
}
let RENDER = null;
/** nhà để dựng: { id, x, z, ry, hw, hd, f, lotF, d, id model, g, tint, y } (khuôn mẫu cũ của cityblocks3d.cityHouses) */
export function renderHouses() {
  if (RENDER) return RENDER;
  const { removed } = plots();
  RENDER = allHouses().filter((h) => !removed.has(h.id)).map((h) => {
    const g = String(h.district).split('-').pop(), G = GUA.find((q) => q.id === g);
    const model = modelOf(h), sp = HOUSE_SPECS[model];
    return { key: h.id, use: h.use, type: h.type, x: h.x, z: h.z, ry: h.ry, hw: h.w / 2, hd: h.d / 2, f: h.w, lotF: h.w * (FACADE_GAP[model] || 1), d: h.d, /* mặt tiền tiệm mái cong chừa khe (mái hiên không đâm vào nhau) */ id: model, g, ys: 1 + ((hash(h.id) % 9) - 3) * 0.02, tint: G ? WX_TINT[G.wx] : null, spec: sp };
  });
  return RENDER;
}
/** đường phố để vẽ / dẫn đường: CẮT bỏ phần chạy trong khuôn viên biệt phủ (đoạn dài bị cắt thành các khúc ngoài phủ) */
let R4 = null;
export function roads4() {
  if (R4) return R4;
  R4 = [];
  for (const r of L.roads()) {
    const len = Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z), n = Math.max(1, Math.ceil(len / 2)), pad = r.w / 2 + 1;
    const at = (t) => ({ x: r.a.x + (r.b.x - r.a.x) * t, z: r.a.z + (r.b.z - r.a.z) * t });
    // điểm «trong phủ» khi chính nó hoặc mép đường (±pad theo pháp tuyến) nằm trong khuôn viên
    const nx = -(r.b.z - r.a.z) / (len || 1), nz = (r.b.x - r.a.x) / (len || 1);
    const bad = (t) => { const p = at(t); return inPhuPlot(p.x, p.z) || inPhuPlot(p.x + nx * pad, p.z + nz * pad) || inPhuPlot(p.x - nx * pad, p.z - nz * pad); };
    let run = null, k = 0;
    for (let i = 0; i <= n; i++) {
      const t = i / n, b = bad(t);
      if (!b && run == null) run = t;
      if ((b || i === n) && run != null) { const t1 = b ? (i - 1) / n : t; if (t1 - run > 1e-6) R4.push({ ...r, id: `${r.id}#${k++}`, a: at(run), b: at(t1) }); run = null; }
    }
  }
  return R4;
}
// --- người đi đường (citizens.js extra): đi dọc vỉa hè đại lộ / vành, mỗi cung vài người mỗi dải ----------------
const WALK_LINES = {
  li: ['Đại lộ Cảnh Môn đông như hội!', 'Phố Thầy Bói Nội Thành xem quẻ linh lắm.', 'Lửa Ly vượng, buôn bán đắt hàng.'],
  kun: ['Ruộng Khôn được mùa, chợ đầy lúa mới.', 'Đi Sảnh Tử Vi thì qua cầu Khôn Nguyên.', 'Đất lành chim đậu.'],
  dui: ['Phong Thủy Viên phía Tây, thầy xem hướng nhà giỏi.', 'Trà lâu Đoài Trạch nghe kể chuyện hay.', 'Hồ Đoài sáng trăng đẹp lắm.'],
  qian: ['Sảnh Cách Cục cuối đại lộ Càn.', 'Lò rèn Càn Kim đỏ lửa suốt ngày.', 'Trời Càn cao, gió mạnh.'],
  kan: ['Thư Lâu phía Bắc, sách nhiều không đọc hết.', 'Phố Hương Khảm Thủy thơm suốt đêm.', 'Nước Khảm sâu, lòng người cũng sâu.'],
  gen: ['Sảnh Tượng Pháp ở Cấn Sơn Thị đi tiếp.', 'Đá Cấn cứng, nhà Cấn chắc.', 'Thành to quá, đi xe ngựa cho nhanh.'],
  zhen: ['Lịch Đường phía Đông, chọn ngày tốt ở đó.', 'Chấn Mộc Thị nhiều thuốc quý.', 'Sấm Chấn đầu xuân, cây cối đâm chồi.'],
  xun: ['Ra hồ Cùng Thông thuê đò chơi.', 'Gió Tốn đưa hương trà.', 'Tốn Phong Thị bán lụa đẹp.'],
};
const WALK_LOOKS = ['npc_merchant', 'npc_villager', 'hero_f', 'hero_m'];
const WALK_NAMES = ['Mạnh Sơn', 'Thu Hà', 'Lão Phúc', 'Cô Lan', 'Tiểu Bảo', 'Bá Hùng', 'Ngọc Mai', 'Văn Tài', 'Bà Năm', 'Chú Tư'];
let WALK = null;
export function walkers4() {
  if (WALK) return WALK;
  WALK = [];
  const WX = Object.fromEntries(GUA.map((g) => [g.id, g.wx]));
  const roads = L.roads().filter((r) => (r.kind === 'avenue' || r.kind === 'ring') && Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z) > 30);
  roads.forEach((r, i) => {
    if (i % 2) return; // cách một đoạn một người
    const dx = r.b.x - r.a.x, dz = r.b.z - r.a.z, l = Math.hypot(dx, dz), nx = -dz / l, nz = dx / l, off = (r.w / 2 - 2.5) * (i % 2 ? 1 : -1);
    const a = { x: r.a.x + nx * off + (dx / l) * 10, z: r.a.z + nz * off + (dz / l) * 10 }, b = { x: r.b.x + nx * off - (dx / l) * 10, z: r.b.z + nz * off - (dz / l) * 10 };
    if (inPhuPlot(a.x, a.z) || inPhuPlot(b.x, b.z)) return;
    const g = GUA.reduce((best, q) => (q.dir[0] * a.x + q.dir[1] * a.z > best.dir[0] * a.x + best.dir[1] * a.z ? q : best), GUA[0]).id;
    WALK.push({ id: `pho4_${i}`, name: WALK_NAMES[hash(`${i}`) % WALK_NAMES.length], role: 'Người đi đường', look: WALK_LOOKS[i % WALK_LOOKS.length], gua: g, wx: WX[g], lines: WALK_LINES[g], path: [a, b], x: a.x, z: a.z });
  });
  return WALK;
}
