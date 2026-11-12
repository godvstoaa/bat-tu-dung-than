// ============================================================================
//  NHÀ RIÊNG — phần LÕI nhẹ (thuần JS, không dựng thành): hạng nhà, mã hoá bố cục, kiểm tra bài trí.
//  Máy chủ (worker/estate.js qua protocol.js) và client dùng chung — không kéo cityblocks vào worker.
//  LISTING_TIERS: hạng của từng căn rao bán theo chỉ số h (test-game-estate kiểm khớp estate.listings()).
// ============================================================================
import { ITEMS, ITEM } from './items.js';
import { estateLayout, PHU_PLAN, VILLA_STYLES, VILLAS_PER_DISTRICT, VILLA_W, VILLA_D, TIEN_PLAN } from './estate-layout.js';

export const TIERS = {
  tieuxa: { name: 'Tiểu Xá', w: 10, d: 8, h: 4.5, price: { xu: 2 * 100000 } }, // giá: tiền kim loại (P18) — 2 lượng bạc (≈ 1 tháng làm đều — §26.2)
  nhapho: { name: 'Nhà Phố', w: 13, d: 10, h: 5, price: { xu: 5 * 100000 } },
  tuhop: { name: 'Tứ Hợp Viện', w: 18, d: 14, h: 5.5, price: { xu: 12 * 100000 }, alt: { ngoc: 300 } },
  // khuôn viên đi bộ ngoài trời (mansions.js + estate-layout.js) — bài trí theo VÙNG (gian + sân vườn)
  bietphu: { name: 'Biệt Phủ', w: 100, d: 100, h: 8, price: { xu: 300 * 100000 }, alt: { ngoc: 2000 }, mansion: true },
  bietthu: { name: 'Biệt Thự', w: VILLA_W, d: VILLA_D, h: 6, price: { xu: 50 * 100000 }, alt: { ngoc: 480 }, mansion: true },
  // Cửu Trọng Thiên (NHA-DIADIEM-MANIFEST §2): 9 tiên phủ trên đảo trời — Quân Thiên giá gấp đôi (estate.priceOf)
  tienphu: { name: 'Tiên Phủ', w: 88, d: 84, h: 9, price: { xu: 1000 * 100000 }, alt: { ngoc: 6000 }, mansion: true },
};
export const MAX_ITEMS = 60;
export const MAX_ITEMS_PHU = 240;
export const PHU_COUNT = PHU_PLAN.length, VILLA_COUNT = VILLA_STYLES.length * VILLAS_PER_DISTRICT, TIEN_COUNT = TIEN_PLAN.length;
/** phong cách + kích thước khuôn viên của căn h (biệt phủ / biệt thự), null nếu là nhà phố */
export function estatePlanOfH(h) {
  if (h >= 0 && h < PHU_COUNT) return { kind: 'phu', ...PHU_PLAN[h] };
  if (h >= PHU_COUNT && h < PHU_COUNT + VILLA_COUNT) { const di = Math.floor((h - PHU_COUNT) / VILLAS_PER_DISTRICT); return { kind: 'villa', style: VILLA_STYLES[di], W: VILLA_W, D: VILLA_D, district: di }; }
  if (h >= TIEN_H0 && h < TIEN_H0 + TIEN_COUNT) { const t = TIEN_PLAN[h - TIEN_H0]; return { kind: 'phu', style: t.style, W: t.W, D: t.D, tien: t.id }; }
  return null;
}
const ZC = new Map();
/** vùng bài trí của căn h (khung cục bộ khuôn viên) */
export function zonesOfH(h) {
  if (!ZC.has(h)) { const p = estatePlanOfH(h); ZC.set(h, p ? estateLayout(p.kind, p.style, p.W, p.D).zones : []); }
  return ZC.get(h);
}
export const zoneOfH = (h, k) => zonesOfH(h)[k] || null;
/** «phòng» của một vùng (cho canPlace / snapWall / home-edit) */
export const zoneRoom = (z) => ({ w: z.w, d: z.d, h: z.h || 6, back: !!z.back, yard: z.kind === 'yard', keep: z.keep || [] });
export const SELL_BACK = 0.5;
// nhà phố rao bán (h ngay sau biệt phủ / biệt thự) — thứ tự hạng cố định (city4.streetListings đặt lô theo bảng này)
export const STREET_TIERS = ["tieuxa", "nhapho", "tuhop", "tieuxa", "tieuxa", "nhapho", "tieuxa", "nhapho", "tuhop", "tieuxa", "tieuxa", "nhapho", "tuhop", "tieuxa", "nhapho", "tuhop", "tieuxa", "tieuxa", "nhapho", "tieuxa", "nhapho", "tuhop", "tieuxa", "tieuxa", "nhapho", "tuhop", "tieuxa"];
export const STREET_H0 = PHU_COUNT + VILLA_COUNT;
// tiên phủ Cửu Trọng Thiên nối vào CUỐI sổ (h 283–291): không đổi chỉ số 283 căn cũ (máy chủ giữ chủ theo h)
export const TIEN_H0 = STREET_H0 + STREET_TIERS.length;
export const LISTING_TIERS = [...Array(PHU_COUNT).fill('bietphu'), ...Array(VILLA_COUNT).fill('bietthu'), ...STREET_TIERS, ...Array(TIEN_COUNT).fill('tienphu')];
export const LISTING_COUNT = LISTING_TIERS.length;
// phòng trong [w, d] (m) của các căn nhà phố theo thứ tự h sau biệt phủ / biệt thự = khung nhà ngoài trừ tường
// (estate.listings().room — test-game-estate kiểm khớp). Máy chủ kiểm bố cục theo bảng này.
export const LISTING_ROOMS = [[7.5,7.5],[7.5,7],[10,6.5],[8,8],[9,5],[7.5,7],[7.5,7.5],[7.5,7],[10.5,6.5],[8,8],[9.5,5.5],[7.5,7],[10.5,6.5],[7.5,6],[7.5,7],[10.5,7],[7.5,7.5],[7.5,7.5],[7.5,7],[7.5,7.5],[7.5,7],[10,6.5],[8.5,8.5],[11.5,7.5],[7.5,7],[11,7],[10,6.5]];
export function roomOfH(h) {
  const T = TIERS[LISTING_TIERS[h]]; if (!T) return null;
  const p = estatePlanOfH(h);
  if (p) return { ...T, w: p.W, d: p.D, zones: zonesOfH(h) };
  const r = LISTING_ROOMS[h - STREET_H0];
  return r ? { ...T, w: r[0], d: r[1] } : { ...T };
}
/** căn đi bộ ngoài trời (biệt phủ / biệt thự) — bài trí theo vùng */
export const isPhuH = (h) => !!TIERS[LISTING_TIERS[h]]?.mansion;
export const isMansionH = (h) => LISTING_TIERS[h] === 'bietphu' || LISTING_TIERS[h] === 'tienphu';
/** tiên phủ Cửu Trọng Thiên */
export const isTienH = (h) => LISTING_TIERS[h] === 'tienphu';

// --- bố cục: món { u (uid), i (id vật phẩm), x, z (m, cục bộ phòng, bội 0,25), r (0–3: ¼ vòng; 0 = quay về cửa +z) }
const CODE = new Map(ITEMS.map((it, k) => [it.id, k.toString(36)]));
const DECODE = new Map(ITEMS.map((it, k) => [k.toString(36), it.id]));
// món của biệt phủ thêm trường vùng k (zonesOfH): «mã,x,z,r,k»; nhà nhỏ giữ 4 trường (k = 0)
export function encodeLayout(items) {
  return items.map((m) => `${CODE.get(m.i)},${Math.round(m.x * 4)},${Math.round(m.z * 4)},${m.r & 3}${m.k ? `,${m.k}` : ''}`).join(';');
}
export const LAYOUT_MAX_LEN = 12000;
export function decodeLayout(str, max = MAX_ITEMS_PHU) {
  if (typeof str !== 'string' || !str) return [];
  if (str.length > LAYOUT_MAX_LEN || !/^[a-z0-9,;-]*$/.test(str)) return null;
  const out = [];
  for (const part of str.split(';')) {
    const [c, x, z, r, k = '0', extra] = part.split(',');
    const id = DECODE.get(c);
    if (extra !== undefined || !id || ITEM[id].kind !== 'decor' || !/^-?\d+$/.test(x) || !/^-?\d+$/.test(z) || !/^[0-3]$/.test(r) || !/^\d$/.test(k)) return null;
    out.push({ u: out.length + 1, i: id, x: Number(x) / 4, z: Number(z) / 4, r: Number(r), k: Number(k) });
    if (out.length > max) return null;
  }
  return out;
}

// --- hình học món trong phòng: khung chữ nhật (đã xoay ¼ vòng)
export function footOf(m) {
  const it = ITEM[m.i], [w, d] = it.foot;
  return m.r % 2 ? { w: d, d: w } : { w, d };
}
// đồ treo tường: bám vách — r chỉ hướng vách (0 vách sau, 1 vách phải, 3 vách trái); x/z là vị trí trên vách
export function snapWall(room, x, z) {
  const hw = room.w / 2 - 0.3, hd = room.d / 2 - 0.3;
  const dl = x + hw, dr = hw - x, db = z + hd;
  const m = Math.min(dl, dr, db);
  if (m === db) return { x: Math.max(-hw + 0.8, Math.min(hw - 0.8, x)), z: -hd, r: 0 };
  if (m === dr) return { x: hw, z: Math.max(-hd + 0.8, Math.min(hd - 2.6, z)), r: 1 };
  return { x: -hw, z: Math.max(-hd + 0.8, Math.min(hd - 2.6, z)), r: 3 };
}
const overlap = (a, b, pad = 0.02) => Math.abs(a.x - b.x) * 2 < a.w + b.w - pad && Math.abs(a.z - b.z) * 2 < a.d + b.d - pad;
const rectOf = (m) => ({ x: m.x, z: m.z, ...footOf(m) });
/** Có đặt được món m (mới hoặc dời) vào bố cục items không: { ok, reason } */
export function canPlace(room, items, m) {
  const it = ITEM[m.i];
  if (!it || it.kind !== 'decor') return { ok: false, reason: 'Không phải đồ bài trí.' };
  if (it.place === 'wall' && room.yard) return { ok: false, reason: 'Sân vườn không có vách để treo.' };
  if (it.place === 'wall') {
    const others = items.filter((o) => o.u !== m.u && ITEM[o.i].place === 'wall' && o.r === m.r);
    for (const o of others) if ((m.r % 2 ? Math.abs(o.z - m.z) : Math.abs(o.x - m.x)) * 2 < ITEM[o.i].foot[0] + it.foot[0]) return { ok: false, reason: 'Vách này đã treo đồ ở chỗ đó.' };
    return { ok: true };
  }
  const R = rectOf(m), hw = room.w / 2 - 0.55, hd = room.d / 2 - 0.55;
  if (R.x - R.w / 2 < -hw || R.x + R.w / 2 > hw || R.z - R.d / 2 < -hd || R.z + R.d / 2 > hd) return { ok: false, reason: room.yard ? 'Ra ngoài sân.' : 'Ra ngoài phòng.' };
  if (room.yard) { for (const k of room.keep || []) if (overlap(R, k, 0)) return { ok: false, reason: 'Để trống lối đi.' }; }
  // lối vào: dải giữa trước cửa phải trống (gian biệt phủ có cửa sau: cả dải sau)
  else if (overlap(R, { x: 0, z: room.d / 2 - 1.4, w: 2.6, d: 2.8 }, 0) || (room.back && overlap(R, { x: 0, z: -room.d / 2 + 1.4, w: 2.6, d: 2.8 }, 0))) return { ok: false, reason: 'Để trống lối vào cửa.' };
  for (const o of items) if (o.u !== m.u && ITEM[o.i].place !== 'wall' && overlap(R, rectOf(o))) return { ok: false, reason: `Vướng ${ITEM[o.i].name}.` };
  return { ok: true };
}
/** Mọi đồ có chức năng phải tới được từ cửa (dò đường lưới 0,5 m). Trả danh sách món không tới được. */
export function unreachable(room, items) {
  const C = 0.5, W = Math.floor((room.w - 1.1) / C), Dd = Math.floor((room.d - 1.1) / C), x0 = -(W * C) / 2, z0 = -(Dd * C) / 2;
  const block = new Uint8Array(W * Dd);
  const floors = items.filter((m) => ITEM[m.i].place !== 'wall');
  for (let j = 0; j < Dd; j++) for (let i = 0; i < W; i++) {
    const x = x0 + (i + 0.5) * C, z = z0 + (j + 0.5) * C;
    for (const m of floors) { const R = rectOf(m); if (Math.abs(x - R.x) < R.w / 2 + 0.25 && Math.abs(z - R.z) < R.d / 2 + 0.25) { block[j * W + i] = 1; break; } }
  }
  const seen = new Uint8Array(W * Dd), q = [];
  const si = Math.floor(W / 2), sj = Dd - 1;
  if (!block[sj * W + si]) { seen[sj * W + si] = 1; q.push(sj * W + si); }
  while (q.length) { const k = q.pop(), i = k % W, j = (k / W) | 0; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= W || jj >= Dd) continue; const kk = jj * W + ii; if (!block[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
  const bad = [];
  for (const m of items) {
    if (!ITEM[m.i].use) continue;
    const R = ITEM[m.i].place === 'wall' ? { x: m.x, z: m.z, w: 0.5, d: 0.5 } : rectOf(m);
    let ok = false;
    for (let j = 0; j < Dd && !ok; j++) for (let i = 0; i < W && !ok; i++) {
      if (!seen[j * W + i]) continue;
      const x = x0 + (i + 0.5) * C, z = z0 + (j + 0.5) * C;
      if (Math.abs(x - R.x) < R.w / 2 + 1.1 && Math.abs(z - R.z) < R.d / 2 + 1.1) ok = true;
    }
    if (!ok) bad.push(m);
  }
  return bad;
}
/** Kiểm cả bố cục (máy chủ + client): mọi món hợp lệ, không chồng, đủ lối đi */
/** đồ đã bài trí không còn vừa phòng (phòng thu nhỏ theo khung nhà ngoài): { keep, drop } — xếp lần lượt, món nào hỏng thì cất */
export function fitLayout(room, items) {
  const keep = [], drop = [];
  for (const m of items || []) { if ((m.k || 0) === 0 && canPlace(room, keep, m).ok) keep.push(m); else drop.push(m); }
  while (unreachable(room, keep).length && keep.length) drop.push(keep.pop());
  return { keep, drop };
}
export function validLayout(room, items) {
  if (!Array.isArray(items)) return false;
  if (room.mansion) { // biệt phủ: kiểm từng vùng
    if (items.length > MAX_ITEMS_PHU) return false;
    for (const z of room.zones || []) {
      const zr = zoneRoom(z), list = items.filter((m) => (m.k || 0) === z.k);
      if (list.length > MAX_ITEMS) return false;
      const placed = [];
      for (const m of list) { if (!canPlace(zr, placed, m).ok) return false; placed.push(m); }
      if (!zr.yard && unreachable(zr, list).length) return false;
    }
    return items.every((m) => (m.k || 0) < (room.zones || []).length);
  }
  if (items.length > MAX_ITEMS || items.some((m) => m.k)) return false;
  const placed = [];
  for (const m of items) { if (!canPlace(room, placed, m).ok) return false; placed.push(m); }
  return unreachable(room, items).length === 0;
}
