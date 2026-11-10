// ============================================================================
//  PHÒNG RIÊNG NGOÀI BẢN ĐỒ (thuần JS) — mỗi cửa hàng, mỗi nhà rao bán / nhà riêng, mỗi công trình mốc
//  một phòng nội thất riêng trên lưới phía Đông Nam ngoài biển mây (x ROOM_X0 … +660, z −230…−920), trong
//  biên máy chủ (protocol.WORLD_TILES). Toạ độ tất định theo khoá → người chơi khác cùng shard vào
//  cùng căn thì thấy nhau. Kèm bảng «điểm tương tác» trong phòng (hàng bày bán, chủ tiệm, đồ dùng
//  trong nhà) để world.js › nearestStation trả trạm ảo.
// ============================================================================
import { cityShops, shopByHouse } from './shops.js';
import { listings, TIERS } from './estate.js';
import { generateCity } from './cityblocks.js';
import { SHOP_TYPES } from './items.js';
import { setDynFloor } from './obstacles.js';
import * as BQ from './batquai.js';
import { COLS, STEP, X0, Z0, slotOrigin, shopSize } from './roomgrid.js';

export const TEMPLE_NB = ['Càn Nguyên Kiếm Các', 'Trấn Sơn Bảo Tháp', 'Bát Môn Trận Đường', 'Lôi Âm Điện'];
let SPECS = null, BY_KEY = null;
/** Mọi phòng: [{ key, kind, slot, origin, w, d, h, ... }] */
export function roomSpecs() {
  if (SPECS) return SPECS;
  const out = [];
  for (const s of cityShops()) {
    const [w, d, h] = shopSize(s.type);
    out.push({ key: `shop:${s.k}`, kind: 'shop', shop: s, type: s.type, title: s.name, w, d, h });
  }
  while (out.length < 60) out.push(null); // chừa chỗ thêm cửa hàng sau này mà không dời phòng nhà
  for (const l of listings()) { const T = TIERS[l.tier]; if (T.mansion) continue; out.push({ key: `est:${l.h}`, kind: 'home', listing: l, title: l.name, w: l.room?.w || T.w, d: l.room?.d || T.d, h: T.h }); }
  while (out.length < 100) out.push(null);
  generateCity().landmarks.forEach((lm, n) => out.push({ key: `lm:${n}`, kind: 'temple', lm, title: lm.name, w: 24, d: 22, h: 11 }));
  // công trình có tên Nội Thành không làm cửa hàng: điện / các / tháp vào thắp hương được
  for (const g of BQ.GUA) for (const b of BQ.DISTRICTS[g.id].buildings) if (TEMPLE_NB.includes(b.name)) out.push({ key: `nb:${TEMPLE_NB.indexOf(b.name)}`, kind: 'temple', nb: b, g: g.id, title: b.name, w: 24, d: 22, h: 11 });
  out.forEach((r, k) => { if (r) { r.slot = k; r.origin = slotOrigin(k); r.id = r.key; } });
  SPECS = out.filter(Boolean);
  BY_KEY = new Map(SPECS.map((r) => [r.key, r]));
  return SPECS;
}
export const roomByKey = (key) => { roomSpecs(); return BY_KEY.get(key) || null; };
/** Phòng chứa điểm (x, z) (mét thế giới) */
export function roomAtDyn(x, z) {
  if (x < X0 - STEP / 2 || z > Z0 + STEP / 2) return null;
  const col = Math.round((x - X0) / STEP), row = Math.round((Z0 - z) / STEP);
  if (col < 0 || col >= COLS || row < 0) return null;
  roomSpecs();
  const r = SPECS.find((q) => q.slot === row * COLS + col);
  if (!r || Math.abs(x - r.origin.x) > r.w / 2 + 1 || Math.abs(z - r.origin.z) > r.d / 2 + 1) return null;
  return r;
}
/** Chỗ đứng khi vừa bước vào (gần cửa trong) và chỗ lối ra */
export const insideOf = (r) => ({ x: r.origin.x, z: r.origin.z + r.d / 2 - 2.6 });
export const exitOf = (r) => ({ x: r.origin.x, z: r.origin.z + r.d / 2 - 1.1 });

// --- điểm tương tác trong phòng (do interior-build dựng xong thì ghi vào)
const SPOTS = new Map(); // key → [{ id, kind, name, verb, x, z, r, open? … }]
export function setRoomSpots(key, list) { SPOTS.set(key, list); }
export function clearRoomSpots(key) { SPOTS.delete(key); }
export function spotNear(x, z, maxR = 1.6) {
  const r = roomAtDyn(x, z); if (!r) return null;
  let best = null, bd = Infinity;
  for (const s of SPOTS.get(r.key) || []) { const d = Math.hypot(s.x - x, s.z - z); if (d <= (s.r || maxR) && d < bd) { bd = d; best = s; } }
  return best;
}
export const roomSpots = (key) => SPOTS.get(key) || OPEN.get(key)?.list || [];

// --- điểm tương tác NGOÀI TRỜI (biệt phủ: cổng phủ, đồ đạc trong gian / sân vườn — mansion3d.js ghi vào)
// key → { list, box: { x0, z0, x1, z1 } } — tra theo khung bao trước cho nhanh
const OPEN = new Map();
export function setOpenSpots(key, list) {
  if (!list.length) { OPEN.delete(key); return; }
  const box = { x0: Infinity, z0: Infinity, x1: -Infinity, z1: -Infinity };
  for (const s of list) { box.x0 = Math.min(box.x0, s.x - 3); box.z0 = Math.min(box.z0, s.z - 3); box.x1 = Math.max(box.x1, s.x + 3); box.z1 = Math.max(box.z1, s.z + 3); }
  OPEN.set(key, { list, box });
}
export function clearOpenSpots(key) { OPEN.delete(key); }
/** điểm ngoài trời gần (x, z) nhất trong bán kính của nó: { key, s } | null */
export function openSpotNear(x, z, maxR = 1.6) {
  let best = null, bd = Infinity;
  for (const [key, e] of OPEN) {
    if (x < e.box.x0 || x > e.box.x1 || z < e.box.z0 || z > e.box.z1) continue;
    for (const s of e.list) { const d = Math.hypot(s.x - x, s.z - z); if (d <= (s.r || maxR) && d < bd) { bd = d; best = { key, s }; } }
  }
  return best;
}

// sàn đi được: trong khung phòng (chừa 0,7 m sát vách) — ngoài sàn là biển mây
setDynFloor(X0 - STEP, (x, z) => { const r = roomAtDyn(x, z); return r && Math.abs(x - r.origin.x) < r.w / 2 - 0.7 && Math.abs(z - r.origin.z) < r.d / 2 - 0.7 ? 0 : null; });

// nguồn dữ liệu nhà riêng (main.js đặt): key 'est:h' → { mode: 'sale'|'own'|'visit'|'sold', items, couplet, owner, likes }
let homeProvider = () => ({ mode: 'sale', items: [], couplet: 0 });
export function setHomeProvider(fn) { homeProvider = fn; }
export const homeInfoOf = (key) => homeProvider(key) || { mode: 'sale', items: [], couplet: 0 };
export { shopByHouse, SHOP_TYPES };
