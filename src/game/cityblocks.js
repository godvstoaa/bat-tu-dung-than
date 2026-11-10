// ============================================================================
//  NGOẠI THÀNH BÁT QUÁI — bộ sinh phố (thuần JS, tất định theo seed; test Node đọc trực tiếp).
//  Nội Thành = batquai.js (tường trung đoạn 158). Ngoại Thành: tường bát giác trung đoạn 420,
//  8 cổng lớn hướng 8 vùng, 8 đại lộ hướng tâm 14 m, 7 vành phố bát giác (vành giữa 290 rộng 10 m),
//  ngõ dọc mỗi cung, phố ranh giữa hai cung. Lô phố giữa các đường: nhà liền dãy quanh chu vi quay
//  ra phố, sân trong ở giữa; lô sát đại lộ / vành giữa là cửa hàng. Mỗi cung: 1 công trình mốc +
//  1 lô chủ đề (chợ, ruộng, hồ, sân võ, ao, non bộ, đấu trường, dược viên).
//  Khung cục bộ như batquai.js: u theo trục cung (tâm → cổng), v ngang. Trong hình nêm cung
//  (|v| ≤ u·tan 22,5°) điểm ở trong bát giác trung đoạn a ⇔ u ≤ a.
// ============================================================================
import { GUA, OCT_A, TAN8, toWorld, gateWidth, faceDir } from './batquai.js';
import { inCanal, aveHalf, AVE_CANAL } from './canals.js';
import { PHU_PLAN, VILLA_STYLES, VILLAS_PER_DISTRICT, VILLA_W, VILLA_D } from './estate-layout.js';

// v3 (2026-11-10): tường 420 cũ thành tường TRUNG THÀNH (lưới phố dân bên trong giữ nguyên); ngoài nó là
// VÀNH PHỦ 430–672: mỗi cung một quảng trường VIP (công trình mốc + lô chủ đề) hai bên đại lộ và 2 biệt phủ
// (mansions.js), tường Ngoại Thành mới trung đoạn 672 (= terrain.CITY_OCT, thế giới phóng ×1,6).
export const TRUNG_A = 420, OUTER_A = 672, MID_A = 290;
export const OUTER_GATE_W = 56, OUTER_GATE_D = OUTER_GATE_W / 2.13; // city_gate (rộng/sâu 2,13) — cả cổng Trung Thành lẫn Ngoại Thành
// vành phủ: đường vành trong (sát tường Trung Thành) · đường vành ngoài · ngõ ±74 giữa quảng trường và phủ
export const BELT = { ringIn: { a: 438, w: 12 }, ringOut: { a: 652, w: 8 }, laneV: 74, laneW: 6, u0: 452, u1: 602, uMax: 646, plazaV: [20, 70], sideV: 80 }; // plaza từ v 20: đại lộ có kênh rộng 19 mỗi bên
// khu biệt thự (bên phải đại lộ mỗi cung): phố nội khu vuông góc đại lộ (u cố định), lô hai bên phố
export const VILLA_STREETS = [{ u: 500, w: 7 }, { u: 576, w: 7 }, { u: 630, w: 7 }];
export const GRAND_W = 14, LANE_W = 5, BOUND_W = 6;
// vành phố bát giác (trung đoạn a, bề rộng w): sát tường nội · … · vành giữa · … · sát tường ngoại
// (2026-11-10) bỏ vành 0 (u 174–180) và dãy lô đầu: hào Nội Thành nới ra 25,5 m tới u 188, bờ kè đi bộ 188–195,5
export const RINGS = [{ a: 198, w: 5 }, { a: 228, w: 5 }, { a: 258, w: 5 }, { a: MID_A, w: 10 }, { a: 320, w: 5 }, { a: 350, w: 5 }, { a: 378, w: 5 }, { a: 406, w: 6 }];
export const LANES_V = [46, 86, 126]; // ngõ dọc (|v|) mỗi cung, song song đại lộ
const SETBACK = 1;                    // nhà lùi khỏi mép đường
export const wedge = (u) => u * TAN8; // nửa bề ngang hình nêm cung tại u

// Mẫu nhà: wd = rộng/sâu của model, f = khoảng mặt tiền (m), hd = cao/rộng (khối xa), màu khối xa
export const HOUSE_SPECS = {
  lib_courtyard: { wd: 1.49, f: [10, 12], hd: 0.49, wall: '#d8cfbd', roof: '#4a5058' },
  bq_house_2f: { wd: 1.05, f: [8, 10], hd: 0.89, wall: '#e2dccd', roof: '#3d4650' },
  bq_house_tiled: { wd: 0.98, f: [8, 10], hd: 0.66, wall: '#cdbfa6', roof: '#5a4a3e' },
  bq_house_stone: { wd: 1.6, f: [9, 11], hd: 0.45, wall: '#a9a294', roof: '#4e4a46' },
  bq_farmhouse: { wd: 1.66, f: [10, 12], hd: 0.54, wall: '#c9b48e', roof: '#3f4a52' },
  lib_mtn_house: { wd: 1.0, f: [8, 10], hd: 0.78, wall: '#b8a07e', roof: '#463c36' },
  bq_shop_lantern: { wd: 1.13, f: [7.5, 9], hd: 0.99, wall: '#8a4a32', roof: '#2f3438' },
  bq_tavern: { wd: 0.92, f: [9, 11], hd: 0.87, wall: '#e7dfcf', roof: '#a8432f' },
  bq_teahouse: { wd: 1.1, f: [10, 12], hd: 0.94, wall: '#efe9dc', roof: '#b0432c' },
  // --- chỉ dùng ở lớp hình (citylook.js): nhà đặc trưng theo cung + mặt tiền cửa hàng (không vào THEME_MIX →
  //     không đổi bố cục thành, chỉ số nhà / cửa hàng / nhà rao bán giữ nguyên)
  bq_canal_house: { wd: 0.99, f: [8, 10], hd: 0.46, wall: '#d8d0c0', roof: '#3d4650', look: true },
  bq_stilt: { wd: 1.19, f: [8, 10], hd: 0.39, wall: '#8a6a4a', roof: '#4a3a2e', look: true },
  bq_granary: { wd: 0.99, f: [8, 10], hd: 1.54, wall: '#c9a86a', roof: '#6a5a3a', look: true },
  bq_rural_house: { wd: 1.0, f: [8, 10], hd: 0.59, wall: '#c9b48e', roof: '#5a4a3e', look: true },
  bq_tower_house: { wd: 0.92, f: [8, 10], hd: 1.57, wall: '#e2dccd', roof: '#3d4650', look: true },
  bq_carpentry: { wd: 1.12, f: [8, 10], hd: 0.8, wall: '#9a7a52', roof: '#3a3a3a', look: true },
  bq_pottery: { wd: 1.11, f: [8, 10], hd: 0.8, wall: '#c9b892', roof: '#4a4038', look: true },
  bq_lantern_shop: { wd: 1.36, f: [8, 10], hd: 0.8, wall: '#a8452c', roof: '#2f3438', look: true },
  bq_bookstore: { wd: 1.06, f: [8, 10], hd: 0.8, wall: '#d8cfbd', roof: '#3d4650', look: true },
  bq_moongate: { wd: 1.67, f: [8, 10], hd: 0.6, wall: '#e6e0d2', roof: '#39404a', look: true },
  bq_incense: { wd: 1.03, f: [8, 10], hd: 0.8, wall: '#8a2a1c', roof: '#2f3438', look: true },
  bq_teashop: { wd: 0.71, f: [8, 10], hd: 1.0, wall: '#d6ccb2', roof: '#4a3a2e', look: true },
  bq_apothecary: { wd: 1.70, f: [8, 10], hd: 0.6, wall: '#c9b993', roof: '#3d4650', look: true },
  bq_forge: { wd: 0.90, f: [8, 10], hd: 0.8, wall: '#5a4a3e', roof: '#2e2a28', look: true },
  bq_inn: { wd: 1.33, f: [8, 10], hd: 0.7, wall: '#c9b48e', roof: '#3f4a52', look: true },
  bq_yamen: { wd: 1.10, f: [8, 10], hd: 0.75, wall: '#8a2a1c', roof: '#2f3438', look: true },
  bq_drum_tower: { wd: 1.19, f: [8, 10], hd: 1.1, wall: '#8a3a2a', roof: '#2f3438', look: true },
};
const RES = [['lib_courtyard', 3], ['bq_house_2f', 3], ['bq_house_tiled', 3], ['bq_house_stone', 2], ['bq_farmhouse', 1], ['lib_mtn_house', 1]];
const SHOP = [['bq_shop_lantern', 4], ['bq_tavern', 2], ['bq_teahouse', 1], ['bq_house_2f', 1]];
const THEME_MIX = { // pha trộn nhà theo chủ đề cung
  li: { res: RES, shop: SHOP, shopLanes: true },
  kun: { res: [['bq_farmhouse', 4], ['bq_house_stone', 3], ['lib_mtn_house', 2], ['bq_house_tiled', 1]], shop: SHOP },
  dui: { res: [['bq_house_2f', 3], ['lib_courtyard', 2], ['bq_house_tiled', 2]], shop: [['bq_teahouse', 3], ['bq_shop_lantern', 2], ['bq_tavern', 1]] },
  qian: { res: [['bq_house_stone', 3], ['lib_courtyard', 3], ['bq_house_tiled', 1]], shop: SHOP },
  kan: { res: [['lib_courtyard', 3], ['bq_house_tiled', 2], ['bq_house_2f', 2]], shop: SHOP },
  gen: { res: [['bq_house_stone', 3], ['lib_mtn_house', 3], ['bq_house_tiled', 1]], shop: SHOP },
  zhen: { res: RES, shop: [['bq_tavern', 3], ['bq_shop_lantern', 3]] },
  xun: { res: [['lib_courtyard', 3], ['bq_house_2f', 2], ['bq_farmhouse', 1]], shop: [['bq_teahouse', 2], ['bq_shop_lantern', 2]] },
};
// Công trình mốc + lô chủ đề mỗi cung (u, v: tâm lô mong muốn; chọn lô gần nhất)
export const LANDMARK = {
  li: { model: ['lib_pagoda_red'], name: 'Chu Tước Lâu' },
  kun: { model: ['bq_array_hall', 'hall_main'], name: 'Hậu Thổ Từ' },
  dui: { model: ['bq_stage', 'lib_wood_pavilion'], name: 'Đại Hý Đài' },
  qian: { model: ['bq_sword_tower', 'library_tower'], name: 'Thiên Kiếm Lâu' },
  kan: { model: ['lib_pagoda5'], name: 'Huyền Thủy Tháp' },
  gen: { model: ['bq_pagoda', 'lib_pagoda_red'], name: 'Trấn Nhạc Tháp' },
  zhen: { model: ['bq_thunder_hall', 'hall_main'], name: 'Phong Lôi Điện' },
  xun: { model: ['bq_library_pagoda', 'lib_pagoda5'], name: 'Thanh Phong Các' },
};
export const THEME = {
  li: { kind: 'market', name: 'Chu Tước Đại Thị' }, kun: { kind: 'fields', name: 'Linh Điền Khôn Nguyên' },
  dui: { kind: 'lake', name: 'Đoài Trạch Hồ' }, qian: { kind: 'yard', name: 'Càn Nguyên Giáo Trường' },
  kan: { kind: 'pond', name: 'Khảm Thủy Đàm' }, gen: { kind: 'rocks', name: 'Cấn Sơn Thạch Lâm' },
  zhen: { kind: 'arena', name: 'Chấn Lôi Đấu Trường' }, xun: { kind: 'herbs', name: 'Tốn Phong Dược Viên' },
};
// lô mốc / chủ đề: quảng trường VIP vành phủ — mốc bên phải đại lộ, chủ đề bên trái
const belt = (s) => { const [a, b] = BELT.plazaV, v0 = s > 0 ? a : -b, v1 = s > 0 ? b : -a; return { u0: BELT.u0 + 4, u1: BELT.u1 - 2, v0, v1, u: (BELT.u0 + 4 + BELT.u1 - 2) / 2, v: (v0 + v1) / 2, w: BELT.u1 - 2 - BELT.u0 - 4, d: v1 - v0 }; };
/**
 * VÀNH PHỦ — quy hoạch mỗi cung (nêm 452 ≤ u ≤ 646):
 *  · giữa: quảng trường VIP (|v| < 68) · ngõ ±74 hai bên;
 *  · bên TRÁI (v < 0): 2 biệt phủ (estate-layout.PHU_PLAN, 4.550–10.000 m²) — phủ 1 quay cổng về đường vành trong,
 *    phủ 2 lùi sau, quay cổng ra ngõ −74;
 *  · bên PHẢI (v > 0): khu biệt thự 30 lô 19 × 22 m quanh 3 phố nội khu, dải công viên giữa hai cặp dãy.
 * Trả { k, g, x, z, ry, W, D, style, name? } — ry: hướng +z cục bộ (mặt tiền) theo quy ước three.js.
 */
export function mansionPlots() {
  const out = [];
  GUA.forEach((g, gi) => {
    const [dx, dz] = g.dir, k1 = gi * 2, P1 = PHU_PLAN[k1], P2 = PHU_PLAN[k1 + 1];
    const u1 = BELT.u0 + P1.D / 2, v1 = -(BELT.sideV + P1.W / 2), w1 = toWorld(g, u1, v1);
    out.push({ k: k1, g: g.id, x: w1.x, z: w1.z, ry: Math.atan2(-dx, -dz), W: P1.W, D: P1.D, style: P1.style, u0: BELT.u0, u1: BELT.u0 + P1.D, v0: -BELT.sideV - P1.W, v1: -BELT.sideV });
    const ua = Math.max(BELT.u0 + P1.D + 8, BELT.uMax - P2.W), u2 = ua + P2.W / 2, v2 = -(BELT.sideV + P2.D / 2), w2 = toWorld(g, u2, v2);
    out.push({ k: k1 + 1, g: g.id, x: w2.x, z: w2.z, ry: Math.atan2(-dz, dx), W: P2.W, D: P2.D, style: P2.style, u0: ua, u1: ua + P2.W, v0: -BELT.sideV - P2.D, v1: -BELT.sideV });
  });
  return out;
}
/** 240 lô biệt thự (8 khu × 30): { i, district, g, x, z, ry, W, D, style, u, v } */
let VCACHE = null;
export function villaLots() {
  if (VCACHE) return VCACHE;
  const out = [];
  GUA.forEach((g, gi) => {
    const [dx, dz] = g.dir, lots = [];
    const rows = [];
    for (const st of VILLA_STREETS) {
      rows.push({ u0: st.u - st.w / 2 - VILLA_D, face: 1 });   // phía trong phố: cổng quay +u
      rows.push({ u0: st.u + st.w / 2, face: -1 });             // phía ngoài phố: cổng quay −u
    }
    for (const r of rows) {
      if (r.u0 < BELT.u0 + 18 || r.u0 + VILLA_D > BELT.uMax + 1) continue;
      const vmax = wedge(r.u0) - BOUND_W / 2 - 3;
      for (let v = BELT.sideV + 0.5; v + VILLA_W <= vmax; v += VILLA_W + 1) {
        const u = r.u0 + VILLA_D / 2, vc = v + VILLA_W / 2, w = toWorld(g, u, vc);
        lots.push({ g: g.id, x: w.x, z: w.z, ry: r.face > 0 ? Math.atan2(dx, dz) : Math.atan2(-dx, -dz), u, v: vc });
      }
    }
    lots.slice(0, VILLAS_PER_DISTRICT).forEach((l, n) => out.push({ ...l, i: out.length, n, district: gi, W: VILLA_W, D: VILLA_D, style: VILLA_STYLES[gi] }));
  });
  VCACHE = out;
  return out;
}

// Vùng cấm xây (thế giới): Am Vân Cốc + bàn thoại Khổng (landmarks.js, sau Hậu Sơn), 2 NPC canon
export const KEEP_OUT = [{ x0: -86, x1: -24, z0: -186, z1: -138 }];

// --- ngẫu nhiên tất định (mulberry32)
function rand(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, list) => { const tot = list.reduce((s, [, w]) => s + w, 0); let x = r() * tot; for (const [id, w] of list) if ((x -= w) < 0) return id; return list[0][0]; };

/** Ô cổng nội/ngoại trong khung cung g: điểm (u, v) có lấn ô cổng không */
function inGateZone(g, u, v) {
  const wi = gateWidth(g), di = wi / (g.id === 'kan' ? 2.76 : 2.13);
  if (u < OCT_A + di / 2 + 3 && Math.abs(v) < wi / 2 + 3) return true;
  if (u > TRUNG_A - OUTER_GATE_D / 2 - 3 && Math.abs(v) < OUTER_GATE_W / 2 + 3) return true;
  return false;
}
const inKeepOut = (x, z) => KEEP_OUT.some((k) => x > k.x0 && x < k.x1 && z > k.z0 && z < k.z1);

/** Lô phố của cung g: [{ g, u0, u1, v0, v1 }] (v0 < v1, đã trừ bề rộng đường + lùi) */
export function blocksOf(g) {
  const out = [];
  for (let i = 0; i < RINGS.length - 1; i++) {
    const u0 = RINGS[i].a + RINGS[i].w / 2 + SETBACK, u1 = RINGS[i + 1].a - RINGS[i + 1].w / 2 - SETBACK;
    const edges = [GRAND_W / 2, ...LANES_V];
    for (const s of [1, -1]) {
      for (let k = 0; k < edges.length; k++) {
        const vin = (k === 0 ? aveHalf(g.id, s, edges[0]) : edges[k] + LANE_W / 2) + SETBACK; // kênh Bát Môn bên phải đại lộ Khảm / Tốn
        const vout = k + 1 < edges.length ? edges[k + 1] - LANE_W / 2 - SETBACK : wedge(u1) - BOUND_W / 2 - SETBACK;
        if (vin + 10 > wedge(u0) - BOUND_W / 2) continue; // phần trong của lô đã ra ngoài nêm
        if (vout - vin < 12) continue;
        out.push({ g, ring: i, lane: k, s, u0, u1, v0: s > 0 ? vin : -vout, v1: s > 0 ? vout : -vin });
      }
    }
  }
  return out;
}

/** OBB (thế giới) của nhà tâm (u, v) khung g, dọc u = lu, ngang v = lv; front = hướng mặt tiền (đơn vị, thế giới) */
function makeHouse(g, id, u, v, lu, lv, front, f, d, ys = 1) {
  const w = toWorld(g, u, v);
  const ry = faceDir(front[0], front[1]);
  // nửa kích thước theo trục của model: ngang (x cục bộ) = mặt tiền f, sâu (z cục bộ) = d; ys = kéo cao (tầng)
  // cửa: giữa mặt tiền, lùi ra 0,9 m — bước tới đây là vào được nội thất (homes.js)
  const door = { x: w.x + front[0] * (d / 2 + 0.9), z: w.z + front[1] * (d / 2 + 0.9) };
  return { id, x: w.x, z: w.z, ry, f, d, hw: f / 2, hd: d / 2, ys, g: g.id, u, v, lu, lv, door };
}
// 4 góc (u, v) của khung chữ nhật trục u/v
const cornersUV = (u, v, lu, lv) => [[u - lu / 2, v - lv / 2], [u + lu / 2, v - lv / 2], [u + lu / 2, v + lv / 2], [u - lu / 2, v + lv / 2]];
function okUV(g, u, v, lu, lv) {
  for (const [cu, cv] of cornersUV(u, v, lu, lv)) {
    if (Math.abs(cv) > wedge(cu) - BOUND_W / 2 - 0.5) return false;
    if (cu < RINGS[0].a + RINGS[0].w / 2 || cu > RINGS[RINGS.length - 1].a - RINGS[RINGS.length - 1].w / 2) return false;
    if (inGateZone(g, cu, cv)) return false;
    const w = toWorld(g, cu, cv);
    if (inKeepOut(w.x, w.z) || inCanal(w.x, w.z, 0.8)) return false;
  }
  return true;
}

// đoạn tường rào trên cạnh lô từ a tới b (toạ độ dọc cạnh), dày 0,5 m sát mép lô; cắt thành khúc ≤ 4 m, bỏ khúc lấn nêm / cổng
export const WALL_H = 2.6, WALL_T = 0.5;
function wallPieces(g, edge, b, a, c) {
  const out = [], alongV = edge === 'u0' || edge === 'u1', n = Math.max(1, Math.ceil((c - a) / 4));
  for (let i = 0; i < n; i++) {
    const p0 = a + (c - a) * i / n, p1 = a + (c - a) * (i + 1) / n, m = (p0 + p1) / 2, L = p1 - p0;
    let u, v, lu, lv;
    if (edge === 'u0') { u = b.u0 + WALL_T / 2; v = m; lu = WALL_T; lv = L; }
    else if (edge === 'u1') { u = b.u1 - WALL_T / 2; v = m; lu = WALL_T; lv = L; }
    else if (edge === 'v0') { u = m; v = b.v0 + WALL_T / 2; lu = L; lv = WALL_T; }
    else { u = m; v = b.v1 - WALL_T / 2; lu = L; lv = WALL_T; }
    if (!okUV(g, u, v, lu, lv)) continue;
    const w = toWorld(g, u, v);
    // hộp: dài L theo cạnh; ry = hướng trục dọc cạnh
    const [dx, dz] = g.dir, ax = alongV ? [-dz, dx] : [dx, dz];
    out.push({ x: w.x, z: w.z, len: L + 0.02, ry: Math.atan2(-ax[1], ax[0]), g: g.id });
  }
  return out;
}

/** Sinh cả Ngoại Thành (tất định). Trả { houses, landmarks, themes, interiors, walkers, blocks } */
let CACHE = null;
export function generateCity() {
  if (CACHE) return CACHE;
  const houses = [], landmarks = [], themes = [], trees = [], allBlocks = [], walls = [];
  for (const g of GUA) {
    const r = rand(1000 + GUA.indexOf(g) * 7919);
    const mix = THEME_MIX[g.id];
    const blocks = blocksOf(g);
    allBlocks.push(...blocks);
    // công trình mốc + lô chủ đề: quảng trường VIP ở vành phủ (lưới phố Trung Thành toàn nhà dân)
    const lm = belt(1), th = belt(-1);
    landmarks.push({ g: g.id, ...LANDMARK[g.id], ...lm, W: Math.min(lm.w, lm.d) - 6 });
    themes.push({ g: g.id, ...THEME[g.id], ...th });
    for (const b of blocks) {
      if (b.special) continue;
      const bu = b.u1 - b.u0, bv = b.v1 - b.v0;
      const shopU0 = RINGS[b.ring].a === MID_A, shopU1 = RINGS[b.ring + 1].a === MID_A, shopV = b.lane === 0;
      const maxDu = Math.min(10.5, bu / 2 - 2.5), maxDv = Math.min(10.5, bv / 2 - 2.5);
      const used = { u0: 0, u1: 0, v0: 0, v1: 0 };
      // một dãy nhà dọc cạnh: along = 'v' (cạnh u0/u1, nhà quay ±u) hoặc 'u' (cạnh v0/v1, nhà quay ±v)
      const row = (edge, shop) => {
        const alongV = edge === 'u0' || edge === 'u1';
        const maxD = alongV ? maxDu : maxDv;
        const t0 = alongV ? b.v0 : b.u0 + used.u0 + 0.6;
        let t = t0;
        const end = alongV ? b.v1 : b.u1 - used.u1 - 0.6; // dãy dọc u nằm giữa hai dãy góc
        const list = shop || (mix.shopLanes && r() < 0.6) ? mix.shop : mix.res;
        const cover = [];
        while (true) {
          let id = pick(r, list), sp = HOUSE_SPECS[id];
          let f = sp.f[0] + r() * (sp.f[1] - sp.f[0]), d = f / sp.wd;
          if (d > maxD) { f = maxD * sp.wd; d = maxD; }
          if (f < 7) { id = 'bq_house_stone'; sp = HOUSE_SPECS[id]; d = Math.min(maxD, 8); f = d * sp.wd; }
          if (t + f > end) { // không vừa: thử nhà hẹp (lầu hàng / nhà đá thu mặt tiền) để lấp nốt khoảng cuối dãy
            const room = end - t;
            if (room < 5.5) break;
            id = room < 7.5 ? 'bq_house_stone' : 'bq_shop_lantern'; sp = HOUSE_SPECS[id];
            f = Math.min(room - 0.2, id === 'bq_shop_lantern' ? 9 : 8); d = Math.min(maxD, f / sp.wd);
          }
          const c = t + f / 2;
          let u, v, lu, lv, front;
          const [dx, dz] = g.dir, px = -dz, pz = dx; // trục u (dx,dz), trục v (px,pz)
          if (edge === 'u0') { u = b.u0 + d / 2; v = c; lu = d; lv = f; front = [-dx, -dz]; }
          else if (edge === 'u1') { u = b.u1 - d / 2; v = c; lu = d; lv = f; front = [dx, dz]; }
          else if (edge === 'v0') { u = c; v = b.v0 + d / 2; lu = f; lv = d; front = [-px, -pz]; }
          else { u = c; v = b.v1 - d / 2; lu = f; lv = d; front = [px, pz]; }
          const ys = id === 'lib_courtyard' ? 1 : (shop ? 1.1 : 1) + r() * 0.28; // cao thấp khác nhau (một hai tầng)
          if (okUV(g, u, v, lu, lv)) { houses.push(makeHouse(g, id, u, v, lu, lv, front, f, d, ys)); used[edge] = Math.max(used[edge], d); cover.push([t, t + f]); }
          t += f + 0.06 + r() * 0.14; // nhà liền vách: khe 6–20 cm (khu dân thường san sát)
        }
        // tường rào nối các khoảng trống trên mặt phố (sát mép lô) — mặt phố liền một dải như phố thật
        let a = t0;
        for (const [c0, c1] of [...cover, [end + 0.6, end + 0.6]]) {
          if (c0 - a > 1.2) walls.push(...wallPieces(g, edge, b, a + 0.1, c0 - 0.1));
          a = Math.max(a, c1);
        }
      };
      row('u0', shopU0); row('u1', shopU1);
      row('v0', b.s > 0 ? shopV : false); row('v1', b.s < 0 ? shopV : false);
      // sân trong: nhà tứ hợp lớn / vườn cây / để trống
      const iu0 = b.u0 + used.u0 + 2, iu1 = b.u1 - used.u1 - 2, iv0 = b.v0 + used.v0 + 2, iv1 = b.v1 - used.v1 - 2;
      const iw = iu1 - iu0, id2 = iv1 - iv0;
      if (iw >= 9 && id2 >= 9) {
        const x = r(), cu = (iu0 + iu1) / 2, cv = (iv0 + iv1) / 2;
        if (x < 0.62 && iw >= 17 && id2 >= 17) {
          // khu dân thường chen chúc: lấp sân trong bằng lưới nhà nhỏ liền vách, hẻm 1,2 m
          const S = 7.6, gap = 1.2, nu = Math.floor((iw + gap) / (S + gap)), nv = Math.floor((id2 + gap) / (S + gap));
          const ou = iu0 + (iw - (nu * S + (nu - 1) * gap)) / 2, ov = iv0 + (id2 - (nv * S + (nv - 1) * gap)) / 2;
          for (let a = 0; a < nu; a++) for (let c = 0; c < nv; c++) {
            const cu2 = ou + a * (S + gap) + S / 2, cv2 = ov + c * (S + gap) + S / 2;
            const id = r() < 0.5 ? 'bq_house_stone' : 'bq_house_tiled', sp = HOUSE_SPECS[id], f = S, d = Math.min(S, f / sp.wd);
            const front = c % 2 ? [-g.dir[1], g.dir[0]] : [g.dir[1], -g.dir[0]];
            if (okUV(g, cu2, cv2, S, S)) houses.push({ ...makeHouse(g, id, cu2, cv2, S, S, front, f, d, 0.9 + r() * 0.2), inner: true, door: null });
          }
        } else if (x < 0.8) {
          const sp = HOUSE_SPECS.lib_courtyard, f = Math.min(iw, id2 * sp.wd, 16) - 0.6, d = f / sp.wd;
          if (okUV(g, cu, cv, f, d)) houses.push({ ...makeHouse(g, 'lib_courtyard', cu, cv, f, d, [g.dir[0], g.dir[1]], f, d), inner: true, door: null }); // nhà sân trong: không cửa ra phố
        } else if (x < 0.95) {
          const n = 2 + Math.floor(r() * 3);
          for (let k = 0; k < n; k++) {
            const tu = iu0 + 2 + r() * (iw - 4), tv = iv0 + 2 + r() * (id2 - 4);
            if (okUV(g, tu, tv, 2, 2)) { const w = toWorld(g, tu, tv); trees.push({ x: w.x, z: w.z, g: g.id, kind: g.id === 'gen' || g.id === 'qian' ? 'tree_pine' : r() < 0.5 ? 'lib_blossom' : 'lib_willow' }); }
          }
        }
      }
    }
  }
  CACHE = { houses, landmarks, themes, trees, walls, blocks: allBlocks, walkers: makeWalkers() };
  return CACHE;
}

// ---------------------------------------------------------------------------
// Đường Ngoại Thành (roads.js vẽ vào địa hình): đại lộ, vành phố, ngõ dọc, phố ranh cung
// ---------------------------------------------------------------------------
function octagon(a) { const R = a / Math.cos(Math.PI / 8), pts = []; for (let k = 0; k <= 8; k++) { const ang = Math.PI / 2 + Math.PI / 8 + k * Math.PI / 4; pts.push([Math.cos(ang) * R, Math.sin(ang) * R]); } return pts; }
export function cityRoads() {
  const L = [];
  for (const g of GUA) {
    const di = gateWidth(g) / 2.13;
    const a = toWorld(g, OCT_A + di / 2, 0), b = toWorld(g, OUTER_A + OUTER_GATE_D / 2 + 6, 0);
    // đại lộ Khảm / Tốn: kênh 22 m giữa đại lộ → hai làn đường hai bên bờ (v ±15, rộng 8)
    if (AVE_CANAL.gua.includes(g.id)) for (const s of [1, -1]) { const p = toWorld(g, OCT_A + di / 2, s * 15), q = toWorld(g, OUTER_A + OUTER_GATE_D / 2 + 6, s * 15); L.push({ pts: [[p.x, p.z], [q.x, q.z]], w: 8, kind: 'grand', g: g.id }); }
    else L.push({ pts: [[a.x, a.z], [b.x, b.z]], w: GRAND_W, kind: 'grand', g: g.id });
    for (const s of [1, -1]) for (const lv of LANES_V) {
      const uStart = Math.max(RINGS[0].a, (lv + LANE_W) / TAN8);
      if (uStart >= RINGS[RINGS.length - 1].a) continue;
      const p = toWorld(g, uStart, s * lv), q = toWorld(g, RINGS[RINGS.length - 1].a, s * lv);
      L.push({ pts: [[p.x, p.z], [q.x, q.z]], w: LANE_W, kind: 'lane', g: g.id });
    }
  }
  for (const R of RINGS) L.push({ pts: octagon(R.a), w: R.w, kind: R.a === MID_A ? 'mid' : 'ring' });
  // vành phủ: hai đường vành + ngõ ±74 (lối vào quảng trường VIP và hông biệt phủ)
  for (const R of [BELT.ringIn, BELT.ringOut]) L.push({ pts: octagon(R.a), w: R.w, kind: 'belt' });
  for (const g of GUA) for (const s of [1, -1]) {
    const p = toWorld(g, BELT.ringIn.a, s * BELT.laneV), q = toWorld(g, BELT.ringOut.a, s * BELT.laneV);
    L.push({ pts: [[p.x, p.z], [q.x, q.z]], w: BELT.laneW, kind: 'lane', g: g.id });
  }
  // phố nội khu biệt thự (bên phải đại lộ): từ ngõ +74 tới mép nêm
  for (const g of GUA) for (const st of VILLA_STREETS) {
    const p = toWorld(g, st.u, BELT.laneV), q = toWorld(g, st.u, wedge(st.u) - BOUND_W / 2 - 1);
    L.push({ pts: [[p.x, p.z], [q.x, q.z]], w: st.w, kind: 'villa', g: g.id });
  }
  // phố ranh giữa hai cung: dọc đường chéo đỉnh bát giác — một đoạn trong lưới phố Trung Thành, một đoạn trong
  // vành phủ (tháp góc tường Trung Thành nằm đúng đường chéo nên hai đoạn không nối)
  for (let k = 0; k < 8; k++) {
    const ang = Math.PI / 2 + Math.PI / 8 + k * Math.PI / 4, c = Math.cos(Math.PI / 8);
    for (const [r0, r1] of [[RINGS[0].a / c, RINGS[RINGS.length - 1].a / c], [BELT.ringIn.a / c, BELT.ringOut.a / c]]) {
      L.push({ pts: [[Math.cos(ang) * r0, Math.sin(ang) * r0], [Math.cos(ang) * r1, Math.sin(ang) * r1]], w: BOUND_W, kind: 'bound' });
    }
  }
  return L;
}

// ---------------------------------------------------------------------------
// Dân phố: người đi đường (ngõ dọc, đại lộ), người bán trước cửa hàng đại lộ, lính 8 cổng ngoài
// ---------------------------------------------------------------------------
const SURNAME = ['Lý', 'Trần', 'Vương', 'Triệu', 'Tô', 'Hà', 'Lưu', 'Mạnh', 'Tiêu', 'Đường', 'Diệp', 'Hàn', 'Lâm', 'Bạch', 'Từ', 'Ôn'];
const GIVEN = ['Đại', 'Nhị', 'Tam', 'Tứ', 'Phúc', 'Lộc', 'An', 'Bình', 'Thanh', 'Hoa', 'Nguyệt', 'Lan', 'Mai', 'Trúc', 'Sơn', 'Hải'];
const ROLE_LINES = {
  li: ['Chu Tước Đại Thị hôm nay đông như hội!', 'Hàng Nam Cương mới về, mại vô!', 'Lửa Ly vượng, buôn bán đắt hàng.'],
  kun: ['Năm nay linh mễ được mùa.', 'Đất Khôn nuôi người, người phải biết ơn đất.', 'Kho Hậu Thổ đầy ắp lương.'],
  dui: ['Ra Đoài Trạch Hồ ngắm sen chưa?', 'Tối nay Đại Hý Đài diễn tuồng mới.', 'Trà sen hồ Đoài là ngon nhất thành.'],
  qian: ['Thiên Kiếm Lâu lại tuyển đệ tử.', 'Giáo trường Càn Nguyên luyện từ canh năm.', 'Kiếm khí Tây Bắc ngút trời.'],
  kan: ['Nước Khảm Thủy Đàm chưa bao giờ cạn.', 'Thuyền chở hàng từ Thư Lâu vừa cập.', 'Hưu Môn phía Bắc yên tĩnh lắm.'],
  gen: ['Thạch lâm Cấn Sơn là một trận đồ sống.', 'Trấn Nhạc Tháp giữ cho đất khỏi động.', 'Đi Sinh Môn làm ăn mới thuận.'],
  zhen: ['Đấu trường Chấn Lôi chiều nay có trận lớn!', 'Nghe tiếng trống Phong Lôi Điện chưa?', 'Thương Môn hướng Đông, kẻ săn người bắt.'],
  xun: ['Dược viên Tốn Phong thơm cả phố.', 'Thanh Phong Các có sách phong thủy cổ.', 'Gió Đông Nam mát, cây cối tốt tươi.'],
};
const COMMON_LINES = ['Thành Bát Quái to quá, đi cả ngày chưa hết một cung.', 'Khách từ phương xa tới à?', 'Vào Nội Thành thì đi thẳng đại lộ này.', 'Trời hôm nay đẹp, đi dạo phố thôi.'];
const LOOKS = ['npc_villager', 'npc_merchant', 'hero_f', 'hero_m', 'npc_villager', 'hero_f'];
function makeWalkers() {
  const out = [];
  for (const g of GUA) {
    const r = rand(5000 + GUA.indexOf(g) * 104729);
    const nm = () => `${SURNAME[Math.floor(r() * SURNAME.length)]} ${GIVEN[Math.floor(r() * GIVEN.length)]}`;
    const lines = [...ROLE_LINES[g.id], COMMON_LINES[Math.floor(r() * COMMON_LINES.length)]];
    const W = (u, v) => { const w = toWorld(g, u, v); return { x: w.x, z: w.z }; };
    const id = (k) => `pho_${g.id}_${k}`;
    // đi dọc đại lộ (lệch tâm 3 m, hai chiều — đại lộ có kênh: đi trên đường hai bờ v ±15) và hai ngõ dọc v = ±46
    const av = AVE_CANAL.gua.includes(g.id) ? 15 : 3, u0 = RINGS[0].a + 4;
    out.push({ id: id(0), name: nm(), role: 'Người đi đường', look: LOOKS[Math.floor(r() * LOOKS.length)], gua: g.id, wx: g.wx, lines, path: [W(u0, av), W(394, av)] });
    out.push({ id: id(1), name: nm(), role: 'Người đi đường', look: LOOKS[Math.floor(r() * LOOKS.length)], gua: g.id, wx: g.wx, lines, path: [W(390, -av), W(u0 + 4, -av)] });
    out.push({ id: id(2), name: nm(), role: 'Dân phố', look: LOOKS[Math.floor(r() * LOOKS.length)], gua: g.id, wx: g.wx, lines, path: [W(214, LANES_V[0]), W(402, LANES_V[0])] });
    out.push({ id: id(3), name: nm(), role: 'Dân phố', look: LOOKS[Math.floor(r() * LOOKS.length)], gua: g.id, wx: g.wx, lines, path: [W(398, -LANES_V[0]), W(214, -LANES_V[0])] });
    // đi vòng trên vành giữa (một đoạn trong cung)
    out.push({ id: id(4), name: nm(), role: 'Phu khuân vác', look: 'npc_villager', gua: g.id, wx: g.wx, lines, path: [W(MID_A, -100), W(MID_A, 100)] });
    // người bán đứng trước cửa hàng đại lộ (mép đại lộ, giữa hai cột đèn)
    const mv = AVE_CANAL.gua.includes(g.id) ? 18 : 6;
    for (const [k, u] of [[5, 236], [6, 344]]) out.push({ id: id(k), name: nm(), role: 'Người bán hàng', look: 'npc_merchant', gua: g.id, wx: g.wx, lines: ['Mời khách xem hàng!', ...lines.slice(0, 2)], x: W(u, k === 5 ? mv : -mv).x, z: W(u, k === 5 ? mv : -mv).z, path: null });
    // lính gác cổng ngoài
    for (const [k, sv] of [[7, 5], [8, -5]]) { const p = W(OUTER_A - OUTER_GATE_D / 2 - 8, AVE_CANAL.gua.includes(g.id) ? sv * 3.4 : sv); out.push({ id: id(k), name: `Lính ${g.gate.replace('Môn', 'Ngoại')}`, role: 'Thủ thành Ngoại Thành', look: 'hero_m', gua: g.id, wx: g.wx, lines: [`Đây là cổng ngoài hướng ${g.name} — ${g.gate}.`, 'Ra khỏi cổng là đường lên tông môn.'], x: p.x, z: p.z, path: null }); }
  }
  for (const n of out) if (n.path) { n.x = n.path[0].x; n.z = n.path[0].z; }
  return out;
}

/** Cổng ngoài của cung g (thế giới) — đường tới sảnh nghề bắt đầu ngay ngoài cổng */
export const outerGate = (g, extra = 0) => toWorld(g, OUTER_A + OUTER_GATE_D / 2 + extra, 0);
