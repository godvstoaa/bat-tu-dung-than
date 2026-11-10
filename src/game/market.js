// ============================================================================
//  CHỢ KÝ GỬI & THƯƠNG HỘI (P9 — thuần). Đặc tả §13.4, §18.2–§18.3.
//  · Giá tham chiếu = trung vị giá khớp 7 ngày, kẹp [0,5×, 2×] giá gốc; chưa có giao dịch = giá gốc.
//  · Biên độ giao dịch giữa người chơi: [0,3×, 3×] tham chiếu (ấn ký ×1,3). Ngoài biên độ KHÔNG chặn cứng mà vào KÉT 24 giờ
//    và gắn cờ cả hai bên. Một cặp giao dịch > 20 lượng / 7 ngày cũng vào két.
//  · Phí ký gửi 3% khi bán (Thương Đạo giảm tới 3%), phí kho 1 đồng / chồng / ngày, tin đăng hết hạn sau 7 ngày (trả hàng).
//  · Thương hội Huyền Thành (mồi khởi động): BÁN nguyên liệu giá trần (+40%), THU thành phẩm giá sàn (−40%), hạn mức
//    2 lượng / tài khoản / ngày, giảm tuyến tính 100% (≤ 10 người hoạt động) → 0 (≥ 30). Không thu đồ ăn chín, không thu rác.
// ============================================================================
import { ITEMS } from './econ-data.js';

export const DAY = 86400000, FEE = 0.03, STORE_FEE = 1, LIST_DAYS = 7, HOLD_MS = DAY, PAIR_CAP = 20 * 1000; // đồng
export const BAND = [0.3, 3], SEAL = 1.3, TH_UP = 1.4, TH_DOWN = 0.6, TH_QUOTA = 2000; // đồng / tài khoản / ngày

/** giá gốc (xu) */
export const baseXu = (id) => Math.round((ITEMS[id]?.b || 0) * 100);
/** trung vị giá khớp 7 ngày (xu / đơn vị), kẹp [0,5×, 2×] gốc */
export function refPrice(id, hist = [], now = Date.now()) {
  const b = baseXu(id), xs = hist.filter((h) => now - h.at <= 7 * DAY).map((h) => h.p).sort((a, c) => a - c);
  if (!xs.length) return b;
  const m = xs.length % 2 ? xs[(xs.length - 1) / 2] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2;
  return Math.round(Math.max(0.5 * b, Math.min(2 * b, m)));
}
/** 'ok' | 'hold' — đơn giá có nằm trong biên độ không */
export function band(price, ref, sealed = false) {
  const r = ref * (sealed ? SEAL : 1);
  return price >= BAND[0] * r && price <= BAND[1] * r ? 'ok' : 'hold';
}
/** phí ký gửi khi bán (xu) — cut = giảm phí từ Thương Đạo (0–0,03) */
export const saleFee = (total, cut = 0) => Math.round(total * Math.max(0, FEE - Math.max(0, cut)));
/** phí kho: 1 đồng / chồng / ngày nằm chợ (làm tròn lên ngày) */
export const storeFee = (since, now = Date.now()) => Math.ceil(Math.max(1, now - since) / DAY) * STORE_FEE * 100;

/** hạn mức Thương hội theo số người hoạt động 24 giờ qua */
export const thFactor = (active) => Math.max(0, Math.min(1, (30 - active) / 20));
export const thSellPrice = (id, ref) => Math.round(ref * TH_UP); // người chơi MUA của Thương hội
export const thBuyPrice = (id, ref) => Math.round(ref * TH_DOWN); // Thương hội THU của người chơi
export const thSells = (id) => !!ITEMS[id]?.raw;
export const thBuys = (id) => !!ITEMS[id]?.fin;

/** tổng giá trị (đồng) giữa một cặp trong 7 ngày */
export function pairTotal(log = [], now = Date.now()) { return log.filter((x) => now - x.at <= 7 * DAY).reduce((a, x) => a + x.v, 0) / 100; }
export const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
