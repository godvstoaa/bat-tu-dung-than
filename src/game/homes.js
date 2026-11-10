// ============================================================================
//  CỬA NHÀ TRONG THÀNH — phân loại mọi cửa (Ngoại Thành + nhà chen Nội Thành + công trình mốc +
//  công trình có tên Nội Thành) thành:
//    · 'shop'   — cửa hàng (shops.js) → phòng riêng `shop:k` (rooms.js)
//    · 'est'    — nhà rao bán / nhà riêng của người chơi (estate.js) → phòng `est:h`
//    · 'temple' — công trình mốc phường / điện có tên → phòng `lm:n` / `nb:i`
//    · 'knock'  — nhà dân: cửa đóng, gõ cửa thì chủ nhà đáp một câu qua khe cửa
//  Thuần JS (không three.js / DOM) — world.js biến thành trạm cửa ảo.
// ============================================================================
import * as BQ from './batquai.js';
import { generateCity } from './cityblocks.js';
import { innerHouses } from './innerfill.js';
import { cityShops } from './shops.js';
import { listings } from './estate.js';
import { TEMPLE_NB } from './rooms.js';

const SURNAME = ['Lý', 'Trần', 'Vương', 'Triệu', 'Tô', 'Hà', 'Lưu', 'Mạnh', 'Tiêu', 'Đường', 'Diệp', 'Hàn', 'Lâm', 'Bạch', 'Từ', 'Ôn', 'Chu', 'Ngô', 'Tạ', 'Phan'];

let LIST = null, GRID = null, BY_KEY = null;
const GC = 8; // ô băm cửa (m)
/** Mọi cửa: [{ i, kind, key (phòng) | null, name, door:{x,z}, back:{x,z} (đứng ngoài cửa khi ra), obb?, g }] */
export function enterables() {
  if (LIST) return LIST;
  const out = [];
  const push = (kind, key, name, door, frontX, frontZ, obb = null, g = null, extra = {}) => {
    out.push({ i: out.length, kind, key, name, door, back: { x: door.x + frontX * 1.4, z: door.z + frontZ * 1.4 }, obb, g, ...extra });
  };
  const C = generateCity();
  const shopByHi = new Map(), shopByInner = new Map();
  for (const s of cityShops()) { if (s.hi != null) shopByHi.set(s.hi, s); if (s.inner) shopByInner.set(s.inner, s); }
  const estByHi = new Map(), estByObj = new Map();
  for (const l of listings()) { if (l.hi != null) estByHi.set(l.hi, l); else estByObj.set(l.house, l); }
  const houses = [...C.houses.map((h, i) => ({ h, i })), ...innerHouses().map((h) => ({ h, i: null }))];
  for (const { h, i } of houses) {
    if (!h.door) continue;
    const fx = Math.sin(h.ry), fz = Math.cos(h.ry);
    const shop = i != null ? shopByHi.get(i) : null, est = i != null ? estByHi.get(i) : estByObj.get(h);
    if (shop) push('shop', `shop:${shop.k}`, shop.name, h.door, fx, fz, h, h.g, { shop });
    else if (est) push('est', `est:${est.h}`, est.name, h.door, fx, fz, h, h.g, { est });
    else push('knock', null, `nhà họ ${SURNAME[(out.length * 7 + 3) % SURNAME.length]}`, h.door, fx, fz, h, h.g);
  }
  C.landmarks.forEach((lm, n) => {
    const g = BQ.guaById(lm.g), sv = Math.sign(lm.v) || 1;
    const d = BQ.toWorld(g, lm.u, lm.v - sv * (lm.d / 2 + 0.6)); // mép lô phía đại lộ (ngoài nền công trình)
    const [dx, dz] = g.dir;
    push('temple', `lm:${n}`, lm.name, d, dz * sv, -dx * sv, null, lm.g);
  });
  for (const g of BQ.GUA) for (const b of BQ.DISTRICTS[g.id].buildings) {
    const shop = shopByInner.get(b.name), ti = TEMPLE_NB.indexOf(b.name);
    if (!shop && ti < 0) continue;
    const sv = Math.sign(b.v) || 1, [dx, dz] = g.dir;
    let d, f;
    if (b.face === 'center') { d = BQ.toWorld(g, b.u - b.foot[0] / 2 - 1.2, b.v); f = [-dx, -dz]; }
    else { d = BQ.toWorld(g, b.u, b.v - sv * (b.foot[1] / 2 + 1.2)); f = [dz * sv, -dx * sv]; }
    if (shop) push('shop', `shop:${shop.k}`, b.name, d, f[0], f[1], null, g.id, { shop });
    else push('temple', `nb:${ti}`, b.name, d, f[0], f[1], null, g.id);
  }
  LIST = out;
  GRID = new Map(); BY_KEY = new Map();
  for (const e of out) {
    const k = `${Math.floor(e.door.x / GC)},${Math.floor(e.door.z / GC)}`; (GRID.get(k) || GRID.set(k, []).get(k)).push(e);
    if (e.key && !BY_KEY.has(e.key)) BY_KEY.set(e.key, e);
  }
  return out;
}
/** cửa ngoài phố dẫn vào phòng `key` */
export const doorOfRoom = (key) => { enterables(); return BY_KEY.get(key) || null; };
/** Cửa gần nhất trong bán kính r (m) quanh (x, z) */
export function doorNear(x, z, r = 2) {
  enterables();
  let best = null, bd = r;
  const cx = Math.floor(x / GC), cz = Math.floor(z / GC);
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const e of GRID.get(`${cx + a},${cz + b}`) || []) {
    const d = Math.hypot(e.door.x - x, e.door.z - z);
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}
/** Nhà mà điểm (x, z) nằm trong khung (bấm vào nhà → đi tới cửa) */
export function houseAt(x, z) {
  enterables();
  const cx = Math.floor(x / GC), cz = Math.floor(z / GC);
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (const e of GRID.get(`${cx + a},${cz + b}`) || []) {
    const h = e.obb; if (!h) continue;
    const c = Math.cos(h.ry), s = Math.sin(h.ry), px = x - h.x, pz = z - h.z;
    if (Math.abs(px * c - pz * s) <= h.hw && Math.abs(px * s + pz * c) <= h.hd) return e;
  }
  return null;
}

// ---------------------------------------------------------------------------
// GÕ CỬA — chủ nhà đáp qua khe cửa: câu theo hành phường + giờ trong ngày + hạt giống ngày;
// thỉnh thoảng chỉ đường tới cửa hàng / nhà rao bán gần đó (gợi ý chơi).
// ---------------------------------------------------------------------------
const BY_WX = {
  火: ['Ai đấy? À, khách lạ. Nhà đang nấu cơm, không tiện mời vào.', 'Phường Ly nóng nực, khách đi đường nhớ uống nước.', 'Tối nay có hội đèn lồng ở đại lộ, khách ghé xem nhé.'],
  水: ['Ai gõ cửa đấy? Trời ẩm, khách đứng mái hiên kẻo ướt.', 'Nhà vừa giặt đồ ra kênh, chưa dọn kịp, xin lỗi khách.', 'Phường Khảm yên tĩnh lắm, khách cứ thong thả dạo.'],
  木: ['Khách tìm ai? Nhà này họ làm vườn, đi hái thuốc cả rồi.', 'Mùi thảo dược đấy, nhà đang sắc thuốc cho ông.', 'Gió Tốn mát lắm, khách đi tiếp ra cổng tròn mà xem.'],
  金: ['Ai đó? Ông nhà đang mài kiếm, khách thông cảm.', 'Phường này nhiều thợ rèn, ồn một chút khách đừng phiền.', 'Khách tìm lò rèn thì đi thêm vài nhà nữa.'],
  土: ['Ai đấy? Mùa gặt bận lắm, khách thông cảm.', 'Lúa năm nay được mùa, cả nhà ra đồng cả.', 'Nhà đơn sơ, khách đi đường cẩn thận.'],
};
const BY_HOUR = [[5, 10, 'Sáng sớm đã có khách, chắc có việc gấp?'], [11, 13, 'Đang giờ cơm trưa, khách ăn gì chưa?'], [19, 23, 'Tối rồi, khách về nghỉ sớm đi.'], [0, 4, 'Khuya khoắt ai gõ cửa thế này…']];
function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
/** Câu đáp khi gõ cửa nhà e (kind 'knock'). hint: { shop?, est? } — tên nơi gợi ý gần đó */
export function knockReply(e, hour = 12, dayKey = '', hint = null) {
  const wx = BQ.guaById(e.g || 'li')?.wx || '土', h = hash(`${dayKey}|${e.i}`);
  const who = `Họ ${e.name.replace(/^nhà họ /, '')}`;
  if (hint && h % 4 === 0) {
    if (hint.est) return `${who}: Nghe nói ${hint.est} gần đây đang rao bán, khách hỏi Nha Môn Địa Ốc xem.`;
    if (hint.shop) return `${who}: Khách cần mua đồ thì ghé ${hint.shop}, ngay mấy nhà bên kia.`;
  }
  const hr = BY_HOUR.find(([a, b]) => hour >= a && hour <= b);
  if (hr && h % 3 === 0) return `${who}: ${hr[2]}`;
  const pool = BY_WX[wx] || BY_WX.土;
  return `${who}: ${pool[h % pool.length]}`;
}
/** nơi gợi ý gần cửa e nhất (≤ 120 m): cửa hàng / nhà rao bán */
export function nearbyHint(e) {
  enterables();
  let shop = null, est = null, ds = 120, de = 120;
  for (const o of LIST) {
    if (o.kind !== 'shop' && o.kind !== 'est') continue;
    const d = Math.hypot(o.door.x - e.door.x, o.door.z - e.door.z);
    if (o.kind === 'shop' && d < ds) { ds = d; shop = o.name; }
    if (o.kind === 'est' && d < de) { de = d; est = o.name; }
  }
  return { shop, est };
}
