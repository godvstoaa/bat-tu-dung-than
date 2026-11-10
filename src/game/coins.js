// ============================================================================
//  TIỀN KIM LOẠI (thuần) — vàng · bạc · đồng · hào · xu. Mọi số tiền lưu bằng XU (số nguyên).
//  1 hào = 10 xu · 1 đồng (= 1 văn cũ) = 10 hào = 100 xu · 1 lượng bạc = 1.000 đồng · 1 lượng vàng = 10 lượng bạc.
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §26 (P18).
// ============================================================================
export const XU = 1, HAO = 10, DONG = 100, BAC = 100_000, VANG = 1_000_000;
export const UNITS = [
  { id: 'vang', name: 'lượng vàng', short: 'V', icon: '🟡', v: VANG },
  { id: 'bac', name: 'lượng bạc', short: 'B', icon: '⚪', v: BAC },
  { id: 'dong', name: 'đồng', short: 'Đ', icon: '🟤', v: DONG },
  { id: 'hao', name: 'hào', short: 'h', icon: '', v: HAO },
  { id: 'xu', name: 'xu', short: 'x', icon: '', v: XU },
];
/** đồng (số thực, đơn vị cũ «văn») → xu, làm tròn tới xu */
export const fromDong = (d) => Math.round((Number(d) || 0) * DONG);
export const toDong = (xu) => (Number(xu) || 0) / DONG;

/** tách thành các bậc: [{ unit, n }] (bỏ bậc 0) */
export function split(xu) {
  let r = Math.max(0, Math.round(Math.abs(Number(xu) || 0)));
  const out = [];
  for (const u of UNITS) { const n = Math.floor(r / u.v); if (n) { out.push({ unit: u, n }); r -= n * u.v; } }
  return out;
}
const nf = (n) => n.toLocaleString('vi-VN');
/**
 * Hiển thị đầy đủ theo 2 bậc lớn nhất có nghĩa: «3 lượng vàng 4 lượng bạc», «15 đồng 5 hào», «36 xu», «0 đồng».
 * opts.max = số bậc tối đa (mặc định 2)
 */
export function fmt(xu, { max = 2 } = {}) {
  const neg = (Number(xu) || 0) < 0, parts = split(xu);
  if (!parts.length) return '0 đồng';
  return (neg ? '−' : '') + parts.slice(0, max).map((p) => `${nf(p.n)} ${p.unit.name}`).join(' ');
}
/** gọn cho HUD: «3V 4B», «15Đ 5h», «36x» */
export function short(xu) {
  const parts = split(xu);
  if (!parts.length) return '0Đ';
  return ((Number(xu) || 0) < 0 ? '−' : '') + parts.slice(0, 2).map((p) => `${nf(p.n)}${p.unit.short}`).join(' ');
}
/** đọc chuỗi «2 lượng bạc 30 đồng» / «1V 5B» / «150» (đồng) → xu; null nếu không đọc được */
export function parse(str) {
  const s = String(str ?? '').trim().toLowerCase();
  if (!s) return null;
  if (/^\d+([.,]\d+)?$/.test(s)) return fromDong(Number(s.replace(',', '.')));
  const re = /(\d+(?:[.,]\d+)?)\s*(lượng vàng|vàng|v|lượng bạc|bạc|b|đồng|đ|văn|hào|h|xu|x)/g;
  let m, total = 0, any = false;
  while ((m = re.exec(s))) {
    any = true;
    const n = Number(m[1].replace(',', '.')), u = m[2];
    const v = /vàng|^v$/.test(u) ? VANG : /bạc|^b$/.test(u) ? BAC : /đồng|^đ$|văn/.test(u) ? DONG : /hào|^h$/.test(u) ? HAO : XU;
    total += n * v;
  }
  return any ? Math.round(total) : null;
}

// --- quy đổi giá cũ (Phúc Khí) sang tiền — §26.2 -----------------------------------------------
/** xu cho mỗi Phúc Khí của giá cũ, theo nhóm hàng */
export const PHUC_RATE = { use: 4 * DONG, decor: 6 * DONG, cosmetic: 6 * DONG, service: 4 * DONG, fine: 4 * DONG };
/** chuẩn hoá giá { phuc?, xu?, ngoc? } → { xu?, ngoc? } (Phúc Khí không còn là tiền mua sắm) */
export function normPrice(p, kind = 'use') {
  if (!p) return p;
  const out = {};
  if (p.xu) out.xu = Math.round(p.xu);
  else if (p.phuc) out.xu = roundNice(p.phuc * (PHUC_RATE[kind] ?? PHUC_RATE.use));
  if (p.ngoc) out.ngoc = p.ngoc;
  return out;
}
/** làm tròn giá cho dễ đọc: < 1 lượng bạc → tới đồng chẵn; ≥ 1 lượng → tới 10 đồng */
export function roundNice(xu) {
  if (xu < BAC) return Math.max(DONG, Math.round(xu / DONG) * DONG);
  return Math.round(xu / (10 * DONG)) * 10 * DONG;
}
