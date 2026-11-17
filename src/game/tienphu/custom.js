// ============================================================================
//  TUỲ BIẾN TIÊN PHỦ của chủ phủ (thuần JS — client + máy chủ dùng chung; TIEN-PHU-MANIFEST §7).
//  Mỗi tuỳ chọn là một chỉ số nhỏ; mã hoá thành chuỗi «a3b1c0…» (chữ = mã tuỳ chọn, số = chỉ số; chủ đề tầng: 10 chữ số
//  sau «t»). 0 ở mọi mục = mặc định của phong cách. Chuỗi ≤ 64 ký tự, chỉ [a-z0-9].
// ============================================================================
import { FLOOR_THEMES } from './styles.js';

export const OPTIONS = [
  { id: 'roof', code: 'a', name: 'Màu mái', choices: [{ name: 'Theo phong cách' }, { name: 'Lưu ly vàng', col: '#e8b828' }, { name: 'Ngọc bích', col: '#2f8a64' }, { name: 'Lam ngọc', col: '#2e5e9a' }, { name: 'Son đỏ', col: '#b8322a' }, { name: 'Huyền hắc', col: '#2a2c30' }, { name: 'Bạc trắng', col: '#d8d6cc' }, { name: 'Tử kim', col: '#6a4a8a' }] },
  { id: 'wall', code: 'b', name: 'Màu tường', choices: [{ name: 'Theo phong cách' }, { name: 'Bạch ngọc', col: '#f4f1ea' }, { name: 'Son đỏ', col: '#a8231c' }, { name: 'Ngà', col: '#e8dcc0' }, { name: 'Lam nhạt', col: '#c8d8e8' }, { name: 'Đất nung', col: '#c0704a' }, { name: 'Xám đá', col: '#9a968c' }, { name: 'Lục nhạt', col: '#cfe0c8' }] },
  { id: 'trim', code: 'c', name: 'Màu cột / viền', choices: [{ name: 'Theo phong cách' }, { name: 'Son đỏ', col: '#a8231c' }, { name: 'Vàng kim', col: '#d4a72c' }, { name: 'Gỗ mun', col: '#2e2018' }, { name: 'Bạch kim', col: '#e8e8ee' }, { name: 'Ngọc lục', col: '#2e6b4f' }] },
  { id: 'floor', code: 'd', name: 'Sàn trong lầu', choices: [{ name: 'Theo phong cách' }, { name: 'Gỗ lim', col: '#7a4a2a', kind: 'wood' }, { name: 'Cẩm thạch', col: '#ece8e0', kind: 'marble' }, { name: 'Ngọc thạch', col: '#9ccab0', kind: 'jade' }, { name: 'Gạch men hoa', col: '#c8b48a', kind: 'tile' }, { name: 'Thảm đỏ', col: '#8a1e1e', kind: 'carpet' }, { name: 'Trúc', col: '#c8b070', kind: 'bamboo' }] },
  { id: 'lamp', code: 'e', name: 'Kiểu đèn', choices: [{ name: 'Theo phong cách' }, { name: 'Đèn đá' }, { name: 'Đèn lồng đỏ' }, { name: 'Đèn sắt' }, { name: 'Đèn ngọc' }] },
  { id: 'lake', code: 'f', name: 'Mặt hồ', choices: [{ name: 'Sen hồng' }, { name: 'Cá chép gấm' }, { name: 'Trong vắt' }, { name: 'Suối ngọc' }] },
  { id: 'season', code: 'g', name: 'Mùa cây', choices: [{ name: 'Hạ lục (mặc định)' }, { name: 'Xuân đào' }, { name: 'Thu phong' }, { name: 'Đông tùng tuyết' }] },
  { id: 'banner', code: 'h', name: 'Màu cờ phướn', choices: [{ name: 'Theo phong cách' }, { name: 'Đỏ', col: '#b8322a' }, { name: 'Vàng', col: '#e3b12e' }, { name: 'Lam', col: '#2e5e9a' }, { name: 'Lục', col: '#2f7a4a' }, { name: 'Trắng', col: '#f4f1ea' }] },
  { id: 'crown', code: 'i', name: 'Đỉnh lầu', choices: [{ name: 'Nguyên bản' }, { name: 'Dát vàng' }, { name: 'Ngọc phát quang' }] },
  { id: 'rail', code: 'j', name: 'Lan can', choices: [{ name: 'Theo phong cách' }, { name: 'Bạch ngọc' }, { name: 'Gỗ son' }, { name: 'Đồng thau' }] },
];
export const OPT_BY_ID = Object.fromEntries(OPTIONS.map((o) => [o.id, o]));
const BY_CODE = Object.fromEntries(OPTIONS.map((o) => [o.code, o]));
export const defaultOpts = () => ({ ...Object.fromEntries(OPTIONS.map((o) => [o.id, 0])), themes: FLOOR_THEMES.map((_, k) => k) });

/** { roof: 2, …, themes: [10 chỉ số chủ đề] } → «a2…t0123456789» */
export function encodeOpts(o) {
  const d = { ...defaultOpts(), ...(o || {}) };
  let s = '';
  for (const op of OPTIONS) if (d[op.id]) s += `${op.code}${d[op.id]}`;
  const th = (d.themes || []).slice(0, 10);
  if (th.some((v, k) => v !== k)) s += `t${th.map((v) => (v >= 10 ? 'z' : v)).join('')}`; // z = để trống (chủ phủ tự bài trí)
  return s;
}
/** chuỗi → tuỳ chọn hợp lệ (bỏ mục lạ / quá phạm vi); null nếu chuỗi hỏng */
export function decodeOpts(s) {
  const out = defaultOpts();
  if (!s) return out;
  if (typeof s !== 'string' || s.length > 64 || !/^[a-z0-9]*$/.test(s)) return null;
  const re = /(t)([0-9z]{10})|([a-j])(\d+)/g; let m, seen = 0;
  while ((m = re.exec(s))) {
    seen += m[0].length;
    if (m[1] === 't') { out.themes = [...m[2]].map((c) => (c === 'z' ? 10 : Number(c))); continue; }
    const op = BY_CODE[m[3]], v = Number(m[4]);
    if (!op || !(v >= 0 && v < op.choices.length)) return null;
    out[op.id] = v;
  }
  return seen === s.length ? out : null;
}
/** màu đã tuỳ biến (null = theo phong cách) */
export const optCol = (o, id) => OPT_BY_ID[id].choices[o?.[id] || 0]?.col || null;
