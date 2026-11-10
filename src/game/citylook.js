// ============================================================================
//  BẢN SẮC PHỐ (thuần JS, tất định) — lớp HÌNH đặt lên bố cục cityblocks.js mà KHÔNG đổi bố cục
//  (chỉ số nhà, cửa hàng, nhà rao bán, va chạm giữ nguyên):
//   · cửa hàng: mặt tiền đúng loại tiệm (shops.js › facade, fit);
//   · nhà đặc trưng theo cung: Khảm nhà ven kênh / nhà sàn, Khôn kho lương / nhà quê, Cấn nhà quê,
//     Càn – Chấn – Ly nhà tháp ở góc phố; không hai căn cùng mẫu liền nhau trong một dãy;
//   · nhịp cao thấp: nhà góc / mặt đại lộ cao hơn, ngõ sau thấp;
//   · tông màu theo hành của cung (Ly ấm đỏ, Khảm lam xám, Chấn / Tốn lục, Càn / Đoài trắng bạc,
//     Khôn / Cấn vàng đất) + lệch sáng tối từng căn.
//  16 phường có tên: 8 cung × (Nội phường trong vành giữa, Ngoại phường ngoài vành giữa).
// ============================================================================
import * as BQ from './batquai.js';
import { generateCity, HOUSE_SPECS, MID_A } from './cityblocks.js';
import { innerHouses } from './innerfill.js';
import { cityShops } from './shops.js';

const WX_TINT = { 火: [0.82, 0.38, 0.29], 水: [0.35, 0.48, 0.6], 木: [0.42, 0.6, 0.35], 金: [0.78, 0.8, 0.85], 土: [0.78, 0.63, 0.31] };
const STRENGTH = 0.25;
// nhà đặc trưng theo cung: { thay: [mẫu gốc bị thay], by: [mẫu mới], p: xác suất, corner: chỉ nhà góc }
const VARIANT = {
  kan: [{ from: ['bq_house_tiled', 'bq_house_2f', 'lib_courtyard'], by: ['bq_canal_house', 'bq_stilt'], p: 0.6 }],
  kun: [{ from: ['bq_farmhouse', 'bq_house_tiled', 'bq_house_stone'], by: ['bq_granary', 'bq_rural_house'], p: 0.55 }],
  gen: [{ from: ['bq_house_tiled', 'bq_house_stone'], by: ['bq_rural_house'], p: 0.4 }],
  qian: [{ from: ['bq_house_stone', 'bq_house_tiled', 'lib_courtyard'], by: ['bq_tower_house'], p: 0.55, corner: true }],
  zhen: [{ from: ['bq_house_2f', 'bq_house_tiled', 'lib_courtyard'], by: ['bq_tower_house'], p: 0.5, corner: true }],
  li: [{ from: ['bq_house_2f'], by: ['bq_tower_house'], p: 0.3, corner: true }],
  xun: [{ from: ['bq_house_tiled'], by: ['bq_canal_house'], p: 0.3 }],
};
// mẫu cùng tỉ lệ (thay khi hai căn liền nhau trùng mẫu mà cung không có mẫu đặc trưng)
const SIMILAR = {
  bq_house_stone: ['bq_farmhouse', 'lib_courtyard'], bq_farmhouse: ['bq_house_stone', 'lib_courtyard'], lib_courtyard: ['bq_house_stone', 'bq_farmhouse'],
  bq_house_tiled: ['lib_mtn_house', 'bq_house_2f'], lib_mtn_house: ['bq_house_tiled', 'bq_house_2f'], bq_house_2f: ['bq_house_tiled', 'lib_mtn_house'],
  bq_shop_lantern: ['bq_tavern', 'bq_house_2f'], bq_tavern: ['bq_shop_lantern', 'bq_teahouse'], bq_teahouse: ['bq_tavern', 'bq_shop_lantern'],
  bq_tower_house: ['bq_house_2f'], bq_canal_house: ['bq_stilt', 'bq_house_tiled'], bq_stilt: ['bq_canal_house'], bq_granary: ['bq_rural_house'], bq_rural_house: ['bq_granary', 'bq_house_tiled'],
};
/** 16 phường: [Nội phường, Ngoại phường] mỗi cung */
export const WARDS = {
  li: ['Chu Tước Phường', 'Liệt Hỏa Phường'], kun: ['Hậu Thổ Phường', 'Phong Niên Phường'],
  dui: ['Minh Nguyệt Phường', 'Liên Trì Phường'], qian: ['Thiên Hành Phường', 'Bạch Hổ Phường'],
  kan: ['Huyền Thủy Phường', 'Thanh Tuyền Phường'], gen: ['Trấn Nhạc Phường', 'Thạch Lâm Phường'],
  zhen: ['Phong Lôi Phường', 'Thanh Long Phường'], xun: ['Thanh Phong Phường', 'Bách Thảo Phường'],
};
export const wardName = (g, u) => WARDS[g]?.[u < MID_A ? 0 : 1] || '';

function hash(n) { let h = (n * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }

let CACHE = null;
/** Song song với [...generateCity().houses, ...innerHouses()]: [{ id, f, ys, tint:[r,g,b] }] */
export function houseLooks() {
  if (CACHE) return CACHE;
  const C = generateCity(), all = [...C.houses, ...innerHouses()];
  const shops = new Map(cityShops().filter((s) => s.hi != null && s.facade).map((s) => [s.hi, s]));
  const out = new Array(all.length);
  let prev = null;
  all.forEach((h, i) => {
    let id = h.id, f = h.f, ys = h.ys || 1;
    const sh = i < C.houses.length ? shops.get(i) : null;
    const corner = Math.abs(h.v) < 24;
    if (sh) { id = sh.facade; f = sh.fit; ys = 1; }
    else if (!h.inner) {
      for (const rule of VARIANT[h.g] || []) {
        if (!rule.from.includes(id) || (rule.corner && !corner) || hash(i * 7 + 1) >= rule.p) continue;
        id = rule.by[Math.floor(hash(i * 13 + 5) * rule.by.length)];
        break;
      }
      // không hai căn cùng mẫu liền nhau (cùng dãy: tâm gần hơn tổng nửa mặt tiền + 2 m)
      if (prev && prev.id === id && Math.hypot(prev.x - h.x, prev.z - h.z) < (prev.f + f) / 2 + 2) {
        const alt = (VARIANT[h.g] || []).flatMap((r) => r.by).find((x) => x !== id) || (h.id !== id ? h.id : null) || (SIMILAR[id] || []).find((x) => x !== id);
        if (alt) id = alt;
      }
      // nhịp cao thấp: góc phố / mặt đại lộ cao hơn, nhà sâu trong lô thấp
      if (corner) ys = Math.min(1.6, ys * 1.15); else if (Math.abs(h.v) > 110) ys = Math.max(0.95, ys * 0.92);
    }
    const sp = HOUSE_SPECS[id] || HOUSE_SPECS[h.id];
    if (id !== h.id && !sh) f = Math.min(h.f, h.d * sp.wd) * 0.98; // mẫu mới nằm gọn trong khung nhà cũ
    const c = WX_TINT[BQ.guaById(h.g)?.wx] || WX_TINT.土, b = 0.92 + hash(i * 31 + 7) * 0.16;
    const tint = c.map((v) => (1 - STRENGTH + STRENGTH * v) * b);
    out[i] = { id, f, ys, tint };
    prev = { id, x: h.x, z: h.z, f };
  });
  CACHE = out;
  return out;
}
