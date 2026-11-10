// ============================================================================
//  BỆNH TẬT, Y QUÁN, NỢ (P3 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §2.3, §3.6.
//  · 6 bệnh; loại bệnh nghiêng theo hành yếu của lá số (dùng Dụng thần làm hành «thiếu» — tạng phủ Đông y).
//  · Hậu quả: đi chậm 50%, làm việc −70%, ba chỉ số tụt nhanh gấp đôi. Không tự khỏi (trừ phong hàn nhẹ: 6 giờ chơi
//    có ngủ đủ thì khỏi, nhưng 30% chuyển nặng).
//  · Chữa: Dược Phòng (thang thuốc — chỉ bệnh nhẹ: phong hàn, ngộ độc) · Y Quán (gian sau Dược Phòng: khám 80 đồng +
//    thuốc; bắt mạch hợp Dụng thần → khỏi nhanh gấp đôi, −20% giá). Không đủ tiền vẫn được chữa — ghi nợ viện phí.
//  · Nợ: lãi 2% / ngày, trần 3 lần gốc. Nợ > 1 lượng bạc quá 7 ngày → Nha Môn xử khổ sai trừ nợ (15 đồng / quặng).
//  Mọi số tiền ở đây tính bằng ĐỒNG (life.pay / L.debt cùng đơn vị).
// ============================================================================
import { perkMul } from './fatequest.js';
import { effects as adEffects } from './amduc.js';

export const ILLS = {
  phonghan: { name: 'Phong hàn', note: 'cảm sốt', organ: 'Phế', wx: '金', mild: true, drug: [150, 420] },
  suynhuoc: { name: 'Suy nhược', note: 'đói, mệt kéo dài', organ: 'Tỳ', wx: '土', drug: [320, 320] },
  chanthuong: { name: 'Chấn thương', note: 'ngã, tai nạn lao động', organ: null, wx: null, drug: [900, 1200] },
  ngodoc: { name: 'Ngộ độc', note: 'ăn đồ ôi', organ: 'Tỳ', wx: '土', mild: true, drug: [150, 380] },
  tamhoa: { name: 'Tâm hỏa', note: 'mất ngủ, thức trắng', organ: 'Tâm', wx: '火', drug: [450, 450] },
  hanthap: { name: 'Hàn thấp', note: 'đau xương, ẩm lạnh', organ: 'Thận', wx: '水', drug: [600, 600] },
};
export const EXAM = 80;                       // đồng — phí khám Y Quán
export const CURE_MS = [15 * 60000, 45 * 60000]; // sau khi uống thuốc: nhẹ 15 phút, nặng 45 phút thật (hợp Dụng thần: một nửa)
export const SELF_HEAL_H = 6;                 // phong hàn nhẹ: 6 giờ chơi
export const DEBT_RATE = 0.02, DEBT_CAP = 3, DEBT_COURT = 1000, DEBT_DAYS = 7, ORE_DONG = 15;

const DAY = 86400000;
/** trạng thái (trong state.life): L.ill = { id, sev (0 nhẹ / 1 nặng), at, h (giờ chơi đã mang bệnh), cureAt, fast } | null */
export function illState(L) {
  if (L.ill === undefined) L.ill = null;
  if (!L.med) L.med = { lowH: 0, nights: [], coldWork: { day: '', n: 0 }, immuneUntil: 0, debtSince: 0, debtBase: 0, debtDay: '' };
  return L.ill;
}
export const isSick = (L) => !!(L.ill && !(L.ill.cureAt && L.ill.cureAt <= Date.now()));

/**
 * hệ số nguy cơ mắc bệnh id: hành yếu (Dụng thần) trùng tạng → ×1,5; phẩm phục đúng Dụng thần → ×0,7 (−30%);
 * ăn đủ 3 bữa hôm nay → ×0,9 (miễn dịch +10); đang miễn dịch (đan dược) → 0.
 */
export function riskMul(L, id, ctx = {}, now = Date.now()) {
  illState(L);
  if (L.med.immuneUntil > now) return 0;
  let k = 1;
  if (ctx.weakWx && ILLS[id].wx === ctx.weakWx) k *= 1.5;
  if (ctx.robeMatch) k *= 0.7;
  if ((ctx.mealsToday || 0) >= 3) k *= 0.9;
  if (ctx.luck) k *= 1 - ctx.luck; // thức dậy cát tường (P4)
  return k;
}
/** mắc bệnh (không chồng — đang bệnh thì bệnh nặng thắng) */
export function catchIll(L, id, sev = 0, now = Date.now()) {
  illState(L);
  if (L.ill && !L.ill.cureAt && (L.ill.sev >= sev)) return null;
  L.ill = { id, sev, at: now, h: 0, cureAt: null, fast: false };
  return L.ill;
}
/** thử phát bệnh với xác suất p (đã nhân riskMul) */
export function roll(L, id, p, ctx, rand = Math.random, sev = 0, now = Date.now()) {
  const q = p * riskMul(L, id, ctx, now);
  return q > 0 && rand() < q ? catchIll(L, id, sev, now) : null;
}

/** ảnh hưởng lên life.mods: { speed, work, decay } */
export function effects(L, now = Date.now()) {
  if (!L.ill || (L.ill.cureAt && L.ill.cureAt <= now)) return { speed: 1, work: 1, decay: 1 };
  const healing = !!L.ill.cureAt; // đã uống thuốc: đỡ nhiều
  return healing ? { speed: 0.85, work: 0.8, decay: 1.2 } : { speed: 0.5, work: 0.3, decay: 2 };
}

/**
 * Trôi theo giờ chơi (gọi cùng life.tick). ctx: { hour, weakWx, robeMatch, mealsToday, swimming, slept (giờ ngủ vừa qua) }
 * Trả { caught, healed, worse } để báo người chơi.
 */
export function tickIll(L, dtSec, ctx = {}, rand = Math.random, now = Date.now()) {
  illState(L);
  const h = dtSec / 3600, out = {};
  // khỏi sau khi uống thuốc
  if (L.ill?.cureAt && L.ill.cureAt <= now) { out.healed = L.ill; L.ill = null; return out; }
  if (L.ill) {
    L.ill.h += h;
    // phong hàn nhẹ tự khỏi sau 6 giờ chơi nếu ngủ đủ (Tỉnh ≥ 50) — 30% chuyển nặng
    if (L.ill.id === 'phonghan' && L.ill.sev === 0 && !L.ill.cureAt && L.ill.h >= SELF_HEAL_H) {
      if (rand() < 0.3) { L.ill.sev = 1; L.ill.h = 0; out.worse = L.ill; }
      else if (L.wake >= 50) { out.healed = L.ill; L.ill = null; }
    }
    return out;
  }
  // suy nhược: No < 20 hoặc Tỉnh < 20 kéo dài quá 1 giờ chơi
  if (L.full < 20 || L.wake < 20) { L.med.lowH += h; if (L.med.lowH > 1) { out.caught = catchIll(L, 'suynhuoc', 0, now); L.med.lowH = 0; return out; } }
  else L.med.lowH = Math.max(0, L.med.lowH - h);
  // Khí huyết < 40: dễ phong hàn (8% / giờ); bơi đêm: 15% / giờ
  if (L.hp < 40) { const c = roll(L, 'phonghan', 0.08 * h, ctx, rand, 0, now); if (c) { out.caught = c; return out; } }
  const night = (ctx.hour ?? 12) >= 23 || (ctx.hour ?? 12) < 5;
  if (ctx.swimming && night) { const c = roll(L, 'phonghan', 0.15 * h, ctx, rand, 0, now); if (c) { out.caught = c; return out; } }
  return out;
}

/** ngủ qua đêm (bù giờ offline): chỗ ngủ kind với tỉ lệ ốm LODGING.ill; giường chung có thể hàn thấp */
export function nightIll(L, kind, illP, ctx = {}, rand = Math.random, now = Date.now()) {
  if (!illP) return null;
  const id = kind === 'dorm' && rand() < 0.5 ? 'hanthap' : 'phonghan';
  return roll(L, id, illP, ctx, rand, 0, now);
}
/** thức đêm (đang chơi giờ Sửu–Dần): 2 đêm liền → tâm hỏa */
export function markNightAwake(L, dateStr, ctx = {}, now = Date.now()) {
  illState(L);
  const n = L.med.nights;
  if (n[n.length - 1] === dateStr) return null;
  n.push(dateStr); if (n.length > 4) n.shift();
  const prev = n[n.length - 2];
  if (prev && (Date.parse(dateStr) - Date.parse(prev)) <= DAY + 1) return catchIll(L, 'tamhoa', 0, now);
  return null;
}
/** tai nạn lao động (job mishap «ngã») → chấn thương (40% nặng) */
export const injury = (L, rand = Math.random, now = Date.now()) => catchIll(L, 'chanthuong', rand() < 0.4 ? 1 : 0, now);
/** làm nghề hành Thủy / thợ mỏ: quá 4 ca trong ngày thì 25% hàn thấp mỗi ca sau */
export function coldWork(L, dateStr, ctx = {}, rand = Math.random, now = Date.now()) {
  illState(L);
  const c = L.med.coldWork; if (c.day !== dateStr) { c.day = dateStr; c.n = 0; }
  c.n += 1;
  return c.n > 4 ? roll(L, 'hanthap', 0.25, ctx, rand, 0, now) : null;
}

/**
 * Báo giá chữa: place 'duoc' (thang thuốc) | 'yquan' (khám + thuốc). yong = Dụng thần người bệnh.
 * Trả { ok, price (đồng), fast, reason }.
 */
export function quote(L, place, yong) {
  const ill = L.ill; if (!ill || ill.cureAt) return { ok: false, reason: ill?.cureAt ? 'Đã uống thuốc — đang hồi phục.' : 'Bạn không có bệnh.' };
  const I = ILLS[ill.id];
  if (place === 'duoc' && !(I.mild && ill.sev === 0)) return { ok: false, reason: `${I.name}${ill.sev ? ' nặng' : ''} phải sang Y Quán để thầy bắt mạch.` };
  const drug = Math.round((I.drug[ill.sev] || I.drug[0]) * perkMul(L, 'med') * adEffects(L).med); // Mộc vận (P5): thuốc −30%
  if (place === 'duoc') return { ok: true, price: drug, fast: false };
  // Y Quán: thầy bắt mạch theo ngũ hành — kê đơn hợp Dụng thần (luôn được khi biết lá số) → nhanh gấp đôi, thuốc −20%
  const fast = !!yong;
  return { ok: true, price: EXAM + Math.round(drug * (fast ? 0.8 : 1)), fast };
}
/** chữa: trả tiền (thiếu thì ghi nợ viện phí), bắt đầu hồi phục. pay(amtĐồng) → bool. */
export function treat(L, place, yong, pay, now = Date.now()) {
  const q = quote(L, place, yong); if (!q.ok) return q;
  let owed = 0;
  if (!pay(q.price)) { owed = q.price; addDebt(L, owed, now); }
  const ms = CURE_MS[L.ill.sev] * (q.fast ? 0.5 : 1);
  L.ill.cureAt = now + ms; L.ill.fast = q.fast;
  return { ...q, owed, cureAt: L.ill.cureAt, ms };
}
/** đan dược (hiếm): khỏi ngay, miễn dịch 1 ngày */
export function elixir(L, now = Date.now()) { illState(L); L.ill = null; L.med.immuneUntil = now + DAY; return true; }

// --- nợ ---------------------------------------------------------------------------------------------
export function addDebt(L, amt, now = Date.now()) {
  illState(L);
  if (!(L.debt > 0)) { L.med.debtSince = now; L.med.debtBase = 0; }
  L.debt = (L.debt || 0) + amt; L.med.debtBase += amt;
}
/** trả nợ bằng tiền mang theo (đồng); trả hết thì xoá mốc */
export function repay(L, amt, pay) {
  amt = Math.min(Math.max(0, Math.floor(amt)), L.debt || 0);
  if (!amt || !pay(amt)) return 0;
  L.debt -= amt; L.med.debtBase = Math.max(0, L.med.debtBase - amt);
  if (L.debt <= 0) { L.debt = 0; L.med.debtSince = 0; L.med.debtBase = 0; }
  return amt;
}
/**
 * Sang ngày mới: lãi 2% / ngày (trần 3 lần gốc). Trả { interest, court } — court = true khi nợ > 1 lượng quá 7 ngày
 * (main.js giao Nha Môn: khổ sai trừ nợ).
 */
export function dailyDebt(L, dateStr, now = Date.now()) {
  illState(L);
  if (L.med.debtDay === dateStr) return { interest: 0 };
  L.med.debtDay = dateStr;
  if (!(L.debt > 0)) return { interest: 0 };
  if (!L.med.debtBase) L.med.debtBase = L.debt;
  if (!L.med.debtSince) L.med.debtSince = now;
  const cap = L.med.debtBase * DEBT_CAP;
  const interest = Math.max(0, Math.min(Math.ceil(L.debt * DEBT_RATE), cap - L.debt));
  L.debt += interest;
  const court = L.debt > DEBT_COURT && now - L.med.debtSince > DEBT_DAYS * DAY;
  return { interest, court };
}
/** số quặng khổ sai để trừ hết nợ */
export const oresForDebt = (debt) => Math.ceil(Math.max(0, debt) / ORE_DONG);
