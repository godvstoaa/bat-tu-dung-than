// ============================================================================
//  CỬA HÀNG THÀNH BÁT QUÁI (thuần JS, tất định) — chọn căn mặt đại lộ / vành giữa làm cửa hàng theo
//  chủ đề cung, đổi mặt tiền sang model đúng loại, đặt tên tiệm + chủ tiệm. Thêm 6 công trình có tên ở
//  Nội Thành và 8 Dịch Trạm sát 8 cổng ngoài, 1 Nha Môn Địa Ốc (cung Ly, sát cổng Nội Thành).
// ============================================================================
import * as BQ from './batquai.js';
const guaById = (id) => BQ.GUA.find((g) => g.id === id);
import { HOUSE_SPECS } from './cityblocks.js';
import { allHouses, isRemoved } from './city4.js';
import { SHOP_TYPES } from './items.js';

// tỉ lệ rộng/sâu của model mặt tiền (đo từ GLB đã đóng gói) — để mặt tiền nằm gọn trong khung nhà cũ
// (đo bản .lod: scripts/meshy-pack-library.mjs in tỉ lệ khung bao) — lấy từ HOUSE_SPECS cho khỏi lệch hai nơi
export const FACADE_WD = Object.fromEntries(Object.entries(HOUSE_SPECS).map(([id, sp]) => [id, sp.wd]));
SHOP_TYPES.tientrang = { name: 'Tiền Trang', facade: 'bq_yamen', owner: 'Chưởng Quỹ', look: 'master', wall: '#8a6a3a', floor: 'stone', sells: [], svc: ['tientrang', 'cho'] }; // v4: mỗi khu một Tiền Trang (citylayout use 'service')
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


let CACHE = null;
const hashS = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/**
 * v4 (thành ×10, city4.js / citylayout.js): MỌI lô mặt đại lộ / vành / quảng trường là tiệm thật (~8.400 tiệm) + 6 công trình
 * có tên trong Sơn Môn. [{ k, type, name, owner, g, house, hi (id nhà v4 «ô:i») | null, inner?, facade, fit }]
 * k = thứ tự ổn định (id nhà v4 sắp xếp) — khoá phòng `shop:k`, chỗ làm, giá ngày.
 */
export function cityShops() {
  if (CACHE) return CACHE;
  const out = [];
  const INNER = { 'Đan Dược Các': 'duoc', 'Hỏa Vân Tửu Lâu': 'tuu', 'Đoài Duyệt Trà Lâu': 'tralau', 'Tàng Phong Lâu': 'thuhoa', 'Khôn Nguyên Thương': 'gom', 'Nông Gia Đình': 'hoavien' };
  const add = (type, g, house, name, extra = {}) => {
    const T = SHOP_TYPES[type]; if (!T) return;
    const k = out.length, gv = GIVEN[hashS(`${k}`) % GIVEN.length];
    out.push({ k, type, name, owner: `${T.owner} ${SURNAME[g] || 'Lý'} ${gv}`, g, hi: house ? house.id : null, house, facade: T.facade, ...extra });
  };
  const list = allHouses().filter((h) => (h.use === 'shop' || h.use === 'service') && !isRemoved(h.id)).sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const h of list) {
    const g = String(h.district).split('-').pop(), pre = PREFIX[g] || PREFIX.li;
    const type = h.use === 'service' ? 'tientrang' : h.type, T = SHOP_TYPES[type]; if (!T) continue;
    const name = type === 'tientrang' ? `Tiền Trang ${guaById(g)?.name || ''}`.trim() : h.type === 'namon' ? `Nha Môn ${guaById(g)?.name || ''}`.trim() : h.type === 'dichtram' ? `Dịch Trạm ${guaById(g)?.name || ''}`.trim() : `${pre[hashS(h.id) % pre.length]} ${T.name}`;
    add(type, g, { ...h, f: h.w }, name);
  }
  for (const g of BQ.GUA) for (const b of BQ.DISTRICTS[g.id].buildings) if (INNER[b.name]) add(INNER[b.name], g.id, null, b.name, { inner: b.name, facade: null });
  for (const s of out) if (s.house) s.fit = s.house.w * 0.98;
  CACHE = out;
  return out;
}
/** chỉ số nhà (city.houses) → cửa hàng */
export function shopByHouse() { const m = new Map(); for (const s of cityShops()) if (s.hi != null) m.set(s.hi, s); return m; }
