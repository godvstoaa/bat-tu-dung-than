// ============================================================================
//  HUYỀN HỌC — ba chỉ số (P19 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §27, §28.
//  · Phúc Khí (state.phucKhi — có sẵn, tiêu được), Âm Đức (amduc.js — chỉ thấy MỨC), Nghiệp Lực (L.nghiep — nợ nhân quả,
//    chỉ thấy MỨC). Không chỉ số nào là tiền: không mua bán / chuyển / đổi ra vàng bạc hay Ngọc.
//  · Việc thiện: bố thí (+1 Phúc Khí / 20 đồng, trần 20 / ngày; ẩn danh +0,5 Âm Đức / ngày), phóng sinh (30 đồng: +2 PK,
//    +1 ÂĐ, −1 Nghiệp), sám hối (−30 PK, −10 Nghiệp), công quả. Giải hạn: 30 PK chặn sự kiện dữ ngày kế, 80 PK cả tuần.
//  · Vận số ngày = 50 + 0,02·PK (trần +15) + mức ÂĐ×6 − mức Nghiệp×8 ± hợp / xung ngày (±8) − phạm Thái Tuế (−6) + cấp vận khí×2.
//    Mỗi ngày tối đa 1 sự kiện lành + 1 dữ, rút theo vận.
// ============================================================================
import { adState, tier as adTier, adScore } from './amduc.js';

export const AD_LEVELS = [{ min: -Infinity, name: 'Bạc Phúc' }, { min: 0, name: 'Bình Thường' }, { min: 5, name: 'Có Phúc' }, { min: 15, name: 'Phúc Dày' }, { min: 40, name: 'Đại Phúc Đức' }];
export const NG_LEVELS = [{ max: 0, name: 'Trong Sạch' }, { max: 9, name: 'Vướng Bận' }, { max: 29, name: 'Nặng Nợ' }, { max: 59, name: 'Nghiệp Chướng' }, { max: Infinity, name: 'Tội Nghiệt' }];
/** mức Âm Đức 0–4 (Bạc Phúc → Đại Phúc Đức) */
export function adLevel(L) { const s = adScore(L); let i = 0; AD_LEVELS.forEach((x, k) => { if (s >= x.min) i = k; }); return i; }
/** mức Nghiệp 0–4 (Trong Sạch → Tội Nghiệt) */
export function ngLevel(L) { const n = Math.max(0, L.nghiep || 0); return NG_LEVELS.findIndex((x) => n <= x.max); }
export const ngWords = ['khí sắc trong sáng, lòng không vướng bận', 'ấn đường hơi mờ, có việc nhỏ chưa xong', 'khí sắc u ám, e có nợ cũ chưa trả', 'mây đen phủ ấn đường, nghiệp chướng đè nặng', 'tội nghiệt chồng chất, mau sám hối kẻo muộn'];

function day(L, dateStr) { if (!L.hh || L.hh.day !== dateStr) L.hh = { day: dateStr, given: 0, anon: false, good: null, bad: null, ...(L.hh?.block ? { block: L.hh.block } : {}) }; return L.hh; }
export function addNghiep(L, n) { L.nghiep = Math.max(0, Math.round(((L.nghiep || 0) + n) * 10) / 10); return L.nghiep; }
/** bố thí ở đền / chùa: dong đồng. pay(dong) → bool. Trả { ok, phuc, ad } */
export function bothi(s, L, dong, anon, dateStr, pay) {
  const H = day(L, dateStr);
  if (!(dong >= 20)) return { ok: false, reason: 'Bố thí ít nhất 20 đồng.' };
  if (!pay(dong)) return { ok: false, reason: 'Không đủ tiền.' };
  const phuc = Math.max(0, Math.min(20 - H.given, Math.floor(dong / 20))); H.given += phuc;
  s.phucKhi = (s.phucKhi || 0) + phuc; s.xp = (s.xp || 0) + phuc;
  let ad = 0; if (anon && !H.anon) { H.anon = true; ad = 0.5; adState(L).score += 0.5; }
  return { ok: true, phuc, ad };
}
export const PHONGSINH_DONG = 30;
export function phongsinh(s, L, pay) {
  if (!pay(PHONGSINH_DONG)) return { ok: false, reason: `Mua cá phóng sinh cần ${PHONGSINH_DONG} đồng.` };
  s.phucKhi = (s.phucKhi || 0) + 2; s.xp = (s.xp || 0) + 2; adState(L).score += 1; addNghiep(L, -1);
  return { ok: true };
}
export function samhoi(s, L) {
  if ((s.phucKhi || 0) < 30) return { ok: false, reason: 'Sám hối cần 30 Phúc Khí.' };
  if (!(L.nghiep > 0)) return { ok: false, reason: 'Lòng trong sạch, không có gì phải sám hối.' };
  s.phucKhi -= 30; addNghiep(L, -10); return { ok: true };
}
/** giải hạn: week = true → 80 PK cả tuần, không thì 30 PK chặn sự kiện dữ ngày kế. discount: Kim Đan −30% (realm.js) */
export function giaihan(s, L, week, now = Date.now(), discount = 1) {
  const cost = Math.round((week ? 80 : 30) * discount);
  if ((s.phucKhi || 0) < cost) return { ok: false, reason: `Giải hạn cần ${cost} Phúc Khí.` };
  s.phucKhi -= cost; L.hh = L.hh || {}; L.hh.block = Math.max(L.hh.block || 0, now + (week ? 7 : 2) * 86400000);
  return { ok: true, cost };
}
/** vận số ngày (0–100). ctx: { clash (xung ngày −1 / hợp +1 / 0), thaiTue (bool) } */
export function vanSo(s, L, ctx = {}) {
  const v = 50 + Math.min(15, 0.02 * (s.phucKhi || 0)) + adLevel(L) * 6 - ngLevel(L) * 8 + (ctx.clash || 0) * 8 - (ctx.thaiTue ? 6 : 0) + adTier(L) * 2;
  return Math.max(0, Math.min(100, Math.round(v)));
}
export const GOOD = { quynhan: 'Quý nhân phù trợ — tiền công hôm nay hậu hơn 20%', nhatcua: 'Nhặt được của rơi' };
export const BAD = { benh: 'Cảm mạo vặt', moctui: 'Bị móc túi ở chợ', tainan: 'Sơ ý bị thương' };
/**
 * Rút sự kiện ngày (gọi khi vào ngày): mỗi ngày tối đa 1 lành + 1 dữ. Giải hạn chặn dữ. rand: () → [0, 1).
 * Trả { good, bad, van } — main.js áp hiệu ứng (tiền, bệnh, …).
 */
export function rollDay(s, L, dateStr, ctx = {}, rand = Math.random, now = Date.now()) {
  const H = day(L, dateStr);
  if (H.rolled) return { van: H.van, good: H.good, bad: H.bad };
  H.rolled = true; const van = H.van = vanSo(s, L, ctx);
  if (rand() < Math.max(0, (van - 45) / 90)) H.good = rand() < 0.6 ? 'quynhan' : 'nhatcua';
  const blocked = (L.hh.block || 0) > now;
  if (!blocked && rand() < Math.max(0, (60 - van) / 80 + ngLevel(L) * 0.05)) { const r = rand(); H.bad = r < 0.4 ? 'benh' : r < 0.75 ? 'moctui' : 'tainan'; }
  return { van, good: H.good, bad: H.bad, blocked };
}
export const goodBonus = (L, dateStr) => (L.hh?.day === dateStr && L.hh.good === 'quynhan' ? 1.2 : 1);
