// ============================================================================
//  MẶT BẰNG & NHÀ HÀNG (P11 — thuần). Đặc tả §17, §18.2.
//  · 3 hạng: Quầy lề đường / Quán cơm bình dân / Tửu lâu thượng hạng — số chỗ có hạn (24 / 12 / 4).
//  · Ví tiệm TÁCH khỏi ví chủ: góp vốn / rút lãi ghi sổ. Định phí (thuê, giấy phép, than / băng / lương phụ) trừ lúc giờ Tý
//    dù bán được hay không (đóng cửa chỉ trừ thuê + giấy phép).
//  · Khách NPC mỗi ngày: chia «chiếc bánh» của vùng theo điểm quán (danh tiếng^0,6 × chất lượng × hệ số giá),
//    giá vượt 150% giá trị (đã tính ấn ký, độ tươi, khẩu vị) thì NPC không vào. Trần = sức chứa.
//  · Ví âm 3 ngày liên tiếp → niêm phong: mất hàng, mất cọc, phần âm chuyển thành nợ cá nhân của chủ.
// ============================================================================
import { ITEMS, REGIONS, VENUE_TIERS, NPC_RIVAL } from './econ-data.js';
import * as INV from './inventory.js';

const NOON = 5 * 3600000; // trưa giờ VN = 05:00 UTC

/** giá trị một suất (xu) tại vùng bán: gốc × ấn ký × tươi × khẩu vị (§15.2) */
export function dishValue(st, region, at = Date.now()) {
  const d = ITEMS[st.id]; if (!d) return 0;
  const f = INV.freshness(st, at), R = REGIONS[region] || REGIONS.trung;
  let v = d.b * 100 * (st.by ? 1.3 : 1) * (0.4 + 0.6 * f) * (R.like.includes(st.id) ? 1.2 : 1) * (0.7 + 0.6 * (st.q ?? 0.5));
  if (R.stale && f < R.stale) v *= 0.5;
  return Math.round(v);
}
/** hệ số giá: (giá trị / giá bán)^1,2, bằng 0 khi giá > 150% giá trị */
export const priceFactor = (value, price) => (price > 0 && price <= 1.5 * value ? Math.min(2, (value / price) ** 1.2) : 0);

/** các suất đang bán được (đúng hạng mặt bằng, còn tươi, có giá trên thực đơn) */
export function sellable(v, at) {
  const T = VENUE_TIERS[v.tier];
  return (v.stock || []).filter((st) => { const d = ITEMS[st.id]; return d?.c === 'dish' && T.tiers.includes(d.tier) && v.menu?.[st.id] > 0 && INV.freshness(st, at) > 0; });
}
/** điểm quán trong ngày */
export function score(v, at) {
  if (!v.open || v.sealed) return 0;
  const S = sellable(v, at); if (!S.length) return 0;
  let pf = 0, q = 0, n = 0;
  for (const st of S) { pf += priceFactor(dishValue(st, v.region, at), v.menu[st.id]) * st.n; q += (st.q ?? 0.5) * st.n; n += st.n; }
  return Math.pow(Math.max(1, v.rep) / 100, 0.6) * Math.max(0.2, q / n) * (pf / n);
}
export const dayCost = (v) => { const T = VENUE_TIERS[v.tier]; return (T.rent + T.license + (v.open ? T.fixed : 0)) * 100; };

/**
 * chốt sổ một ngày `day` (YYYY-MM-DD giờ VN). sumScore = tổng điểm các quán khác trong vùng (không gồm quán này).
 * Trả bản ghi sổ { day, cust, rev, cost, net, bal, sealed? }
 */
export function settleDay(v, day, sumScore = 0, rain = false) {
  const T = VENUE_TIERS[v.tier], R = REGIONS[v.region] || REGIONS.trung;
  const at = Date.parse(`${day}T00:00:00Z`) + NOON;
  const sc = score(v, at);
  let cust = 0, rev = 0, stale = 0, qs = 0;
  if (sc > 0) {
    const share = sc / (sc + sumScore + (NPC_RIVAL[v.region] || 1) * 0.35);
    cust = Math.min(T.cap, Math.floor(R.pop * share * (rain && v.tier === 'stall' ? 1 - T.rainCut : 1)));
    // khách chọn món theo hệ số giá (món đáng tiền bán trước)
    const S = sellable(v, at).map((st) => ({ st, w: priceFactor(dishValue(st, v.region, at), v.menu[st.id]) })).filter((x) => x.w > 0).sort((a, b) => b.w - a.w);
    let left = cust;
    for (const { st } of S) {
      if (left <= 0) break;
      const k = Math.min(left, st.n); left -= k; st.n -= k; rev += k * v.menu[st.id]; qs += (st.q ?? 0.5) * k;
      if (INV.freshness(st, at) < 0.3) stale += k;
    }
    cust -= left;
    v.stock = v.stock.filter((st) => st.n > 0);
  }
  INV.rot(v.stock || [], at);
  const cost = dayCost(v) + Math.round(rev * (T.tax || 0));
  v.bal = (v.bal || 0) + rev - cost;
  // danh tiếng
  if (cust > 0 && qs / cust >= 0.7) v.rep = Math.min(100, v.rep + 2);
  if (stale > 0) v.rep = Math.max(0, v.rep - 3);
  if (v.open && !cust) v.rep = Math.max(0, v.rep - 1);
  v.neg = v.bal < 0 ? (v.neg || 0) + 1 : 0;
  const rec = { day, cust, rev, cost, net: rev - cost, bal: v.bal };
  if (v.neg >= 3) { v.sealed = true; v.open = false; v.stock = []; rec.sealed = true; }
  v.log = [...(v.log || []), rec].slice(-14);
  v.day = day;
  return rec;
}
/** các ngày cần chốt giữa v.day (đã chốt) và hôm nay (chưa chốt hôm nay — chốt lúc qua giờ Tý) */
export function pendingDays(lastDay, today) {
  const out = []; if (!lastDay) return out;
  let t = Date.parse(`${lastDay}T00:00:00Z`) + 86400000; const end = Date.parse(`${today}T00:00:00Z`);
  while (t < end && out.length < 30) { out.push(new Date(t).toISOString().slice(0, 10)); t += 86400000; }
  return out;
}
/** mưa theo ngày (tất định) — quầy lề đường mất 60% khách */
export const rainy = (day) => { let h = 0; for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % 5 === 0; };
