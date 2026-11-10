// ============================================================================
//  CỬA HÀNG THÀNH BÁT QUÁI (thuần JS, tất định) — chọn căn mặt đại lộ / vành giữa làm cửa hàng theo
//  chủ đề cung, đổi mặt tiền sang model đúng loại, đặt tên tiệm + chủ tiệm. Thêm 6 công trình có tên ở
//  Nội Thành và 8 Dịch Trạm sát 8 cổng ngoài, 1 Nha Môn Địa Ốc (cung Ly, sát cổng Nội Thành).
// ============================================================================
import * as BQ from './batquai.js';
import { generateCity, HOUSE_SPECS } from './cityblocks.js';
import { SHOP_TYPES } from './items.js';
import { AVE_CANAL } from './canals.js';

// tỉ lệ rộng/sâu của model mặt tiền (đo từ GLB đã đóng gói) — để mặt tiền nằm gọn trong khung nhà cũ
// (đo bản .lod: scripts/meshy-pack-library.mjs in tỉ lệ khung bao) — lấy từ HOUSE_SPECS cho khỏi lệch hai nơi
export const FACADE_WD = Object.fromEntries(Object.entries(HOUSE_SPECS).map(([id, sp]) => [id, sp.wd]));
SHOP_TYPES.may = { name: 'Tiệm May Tàng Y', facade: 'bq_shop_lantern', owner: 'Thợ May', look: 'hero_f', wall: '#e3dccb', floor: 'wood', sells: [], svc: ['may'] };

const WARD_SHOPS = {
  li: ['namon', 'tuu', 'den', 'tratrang', 'may'],
  kun: ['gom', 'hoavien', 'duoc', 'moc'],
  dui: ['tralau', 'thuhoa', 'tratrang', 'den'],
  qian: ['loren', 'moc', 'phongthuy', 'tuu'],
  kan: ['huong', 'hoavien', 'gom', 'tralau'],
  gen: ['phongthuy', 'huong', 'thuhoa', 'loren'],
  zhen: ['moc', 'tuu', 'loren', 'duoc'],
  xun: ['duoc', 'hoavien', 'thuhoa', 'tratrang'],
};
// tên hiệu: [tiền tố theo phường] + [tên loại] — chủ tiệm có họ theo phường
const PREFIX = { li: ['Chu Tước', 'Hồng Vân', 'Đan Hà', 'Liệt Hỏa', 'Cảnh Môn'], kun: ['Hậu Thổ', 'Kim Điền', 'Phong Niên', 'Khôn Nguyên'], dui: ['Đoài Duyệt', 'Thu Thủy', 'Liên Trì', 'Minh Nguyệt'], qian: ['Thiên Hành', 'Càn Nguyên', 'Lăng Tiêu', 'Bạch Hổ'], kan: ['Huyền Thủy', 'Bắc Thần', 'Thanh Tuyền', 'Hưu Môn'], gen: ['Trấn Nhạc', 'Thạch Lâm', 'Cấn Sơn', 'Sinh Môn'], zhen: ['Phong Lôi', 'Thanh Long', 'Chấn Thiên', 'Thương Môn'], xun: ['Thanh Phong', 'Bách Thảo', 'Tốn Mộc', 'Đỗ Môn'] };
const SURNAME = { li: 'Hồng', kun: 'Điền', dui: 'Liễu', qian: 'Lăng', kan: 'Thủy', gen: 'Thạch', zhen: 'Lôi', xun: 'Diệp' };
const GIVEN = ['Bá', 'Trọng', 'Thúc', 'Quý', 'Nương', 'Cô', 'Lão', 'Tiểu'];

const front = (h) => [Math.sin(h.ry), Math.cos(h.ry)];
// căn ở góc đại lộ (|v| < 24 — đầu dãy nhà quay ra vành phố, sát đại lộ): khách đi đại lộ thấy ngay
// đại lộ có kênh giữa (Khảm / Tốn) rộng 19 m mỗi bên → dãy nhà mặt đại lộ lùi ra xa hơn
function onAvenue(g, h) { void front; return Math.abs(h.v) < (AVE_CANAL.gua.includes(g.id) ? 36 : 24); }

let CACHE = null;
/** [{ k, type, name, owner, g, house, hi (chỉ số trong city.houses) | null, inner?:name, facade, fit }] */
export function cityShops() {
  if (CACHE) return CACHE;
  const C = generateCity(), out = [], used = new Set();
  const INNER = { 'Đan Dược Các': 'duoc', 'Hỏa Vân Tửu Lâu': 'tuu', 'Đoài Duyệt Trà Lâu': 'tralau', 'Tàng Phong Lâu': 'thuhoa', 'Khôn Nguyên Thương': 'gom', 'Nông Gia Đình': 'hoavien' };
  const taken = new Set(Object.keys(INNER));
  const add = (type, g, hi, name, extra = {}) => {
    const T = SHOP_TYPES[type], h = hi != null ? C.houses[hi] : null;
    const k = out.length, gv = GIVEN[(k * 5 + 3) % GIVEN.length];
    out.push({ k, type, name, owner: `${T.owner} ${SURNAME[g.id] || 'Lý'} ${gv}`, g: g.id, hi, house: h, facade: T.facade, ...extra });
    if (hi != null) used.add(hi);
  };
  for (const g of BQ.GUA) {
    const cands = C.houses.map((h, i) => ({ h, i })).filter(({ h, i }) => h.g === g.id && h.door && !h.inner && h.f >= 8 && onAvenue(g, h) && !used.has(i));
    const pick = (u0) => { let best = null; for (const c of cands) { if (used.has(c.i)) continue; const d = Math.abs(c.h.u - u0); if (!best || d < best.d) best = { ...c, d }; } return best; };
    const list = WARD_SHOPS[g.id];
    list.forEach((type, j) => {
      const u0 = type === 'namon' ? 178 : 196 + (j * 168) / Math.max(1, list.length);
      const c = pick(u0); if (!c) return;
      // tên hiệu không trùng tiệm khác hay công trình có tên Nội Thành (vd «Đoài Duyệt Trà Lâu»)
      let name = type === 'namon' ? 'Nha Môn Địa Ốc' : type === 'may' ? 'Tiệm May Tàng Y' : '';
      for (let k = 0; !name || taken.has(name); k++) name = `${PREFIX[g.id][(j + k) % PREFIX[g.id].length]} ${SHOP_TYPES[type].name}`;
      taken.add(name);
      add(type, g, c.i, name);
    });
    const dt = pick(392);
    if (dt) add('dichtram', g, dt.i, `Dịch Trạm ${g.gate.replace('Môn', 'Ngoại')}`);
  }
  // công trình có tên ở Nội Thành làm cửa hàng (cửa ở homes.js › enterables, mặt tiền giữ nguyên)
  for (const g of BQ.GUA) for (const b of BQ.DISTRICTS[g.id].buildings) if (INNER[b.name]) add(INNER[b.name], g, null, b.name, { inner: b.name, facade: null });
  // khung mặt tiền: rộng = min(mặt tiền nhà, sâu nhà · tỉ lệ model) → nằm gọn trong khung va chạm cũ
  for (const s of out) if (s.house && s.facade) s.fit = Math.min(s.house.f, s.house.d * (FACADE_WD[s.facade] || 1)) * 0.98;
  CACHE = out;
  return out;
}
/** chỉ số nhà (city.houses) → cửa hàng */
export function shopByHouse() { const m = new Map(); for (const s of cityShops()) if (s.hi != null) m.set(s.hi, s); return m; }
