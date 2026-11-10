// ============================================================================
//  SINH TỒN + TIỀN VĂN (thuần JS — client, test Node; P2 chuyển nguyên module lên máy chủ giữ sổ).
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §2–§3, §6.
//   · 3 chỉ số 0–100: NO (bụng), TỈNH (tinh thần / giấc ngủ), KHÍ HUYẾT (sức khoẻ). Giảm theo giờ chơi thật.
//   · Tiền kim loại (P18, coins.js): ví lưu XU (L.xu, số nguyên); 1 đồng (= 1 văn cũ) = 100 xu. API giữ đơn vị ĐỒNG
//    (earn / pay / L.van đọc ra đồng) để nơi gọi cũ không đổi; earnXu / payXu cho chỗ cần chính xác tới xu.
//    Chỉ kiếm bằng làm việc / buôn bán; không đổi từ Phúc Khí / Âm Đức / Ngọc.
//   · Ăn (theo nơi bán), trọ / ngủ (theo cấp chỗ ngủ), thuế thân theo bậc giàu (giờ Tý mỗi ngày), bù giờ offline.
//   · Khí huyết về 0 → NGẤT (main.js đưa về Sơn Môn, mất 20% Văn mang theo — P3 thay bằng Y Quán + viện phí).
// ============================================================================

import * as C from './coins.js';
import * as ILL from './illness.js';
import { perkMul } from './fatequest.js';
import * as AD from './amduc.js';

export const START_VAN = 300;           // đồng (= văn cũ) — ví lưu bằng xu
export const LUONG = 1000;
// tốc độ / giờ chơi
export const RATE = { full: 10, wake: 7, hpLow: 4, hpRegen: 2 };
export const NIGHT_WAKE = 2;      // thức trắng giờ Tý → Dần (23h–5h): Tỉnh tụt ×2
export const OFFLINE = { factor: 0.25, floorFull: 30, floorHp: 40, maxSleepH: 8 };
export const ACT = { idle: 1, walk: 1, run: 1.5, swim: 1.5, carry: 1.3, work: 1.3 }; // hệ số tiêu hao No theo hoạt động

// thực đơn: nơi bán → món. full / wake / hp cộng thêm; spoil = giờ để lâu thì ôi (P3: ngộ độc)
export const FOOD = {
  com: { name: 'Cơm bình dân', price: 15, full: 35, icon: '🍚' },
  banhbao: { name: 'Bánh bao', price: 6, full: 15, icon: '🥟' },
  mi: { name: 'Mì nước', price: 10, full: 25, icon: '🍜' },
  nuoc: { name: 'Bát nước vối', price: 2, full: 2, wake: 2, icon: '🥣' },
  tra: { name: 'Trà nóng', price: 5, wake: 8, icon: '🍵', cap: 2 },          // tối đa 2 chén / 6 giờ
  tiec: { name: 'Bữa tửu lâu', price: 60, full: 60, hp: 5, icon: '🍲' },
  ruou: { name: 'Bầu rượu ấm', price: 25, full: 5, hp: 3, wake: -4, icon: '🍶' },
  lienhoa: { name: 'Trà liên hoa thượng hạng', price: 40, wake: 15, hp: 4, icon: '🪷', cap: 2 },
  dimsum: { name: 'Điểm tâm trà lâu', price: 22, full: 22, wake: 3, icon: '🥮' },
};
export const MENUS = {
  stall: ['com', 'banhbao', 'mi', 'nuoc'],            // quầy cơm Sơn Môn / hàng rong
  tuu: ['com', 'mi', 'tiec', 'ruou'],                 // tửu lâu
  tralau: ['tra', 'dimsum', 'lienhoa', 'banhbao'],    // trà lâu
  tratrang: ['tra', 'lienhoa'],                       // trà trang
};
// chỗ ngủ: Tỉnh hồi mỗi giờ ngủ; ill = tỉ lệ ốm mỗi đêm (P3 dùng); rob = tỉ lệ bị móc túi
export const LODGING = {
  street: { name: 'Ngủ bờ ngủ bụi', price: 0, wake: 6, ill: 0.15, rob: 0.05 },
  dorm: { name: 'Giường chung liêu xá', price: 30, wake: 9, ill: 0.05 },
  room: { name: 'Phòng đơn khách điếm', price: 80, wake: 12, hp: 5 },
  house: { name: 'Nhà riêng', price: 0, wake: 14 },
  villa: { name: 'Biệt thự · biệt phủ', price: 0, wake: 16, hp: 10 },
};
export const BED_NIGHT_MS = 12 * 3600000; // một lần trả tiền trọ giữ chỗ 12 giờ thật
// thuế thân / ngày theo bậc giàu (tổng Văn + tài sản quy Văn)
export const TAX = [[1 * LUONG, 0], [10 * LUONG, 5], [100 * LUONG, 30], [1000 * LUONG, 200]];
export const taxFor = (wealth) => { for (const [cap, t] of TAX) if (wealth < cap) return t; return Math.round(wealth * 0.004); };
export const tierOf = (wealth) => { let i = 0; for (const [cap] of TAX) { if (wealth < cap) return i; i++; } return i; };

const clamp = (v) => Math.max(0, Math.min(100, v));
/** trạng thái sinh tồn trong state (khoá state.life) */
export function lifeState(s, now = Date.now()) {
  if (!s.life || typeof s.life !== 'object') s.life = { full: 80, wake: 80, hp: 90, xu: START_VAN * C.DONG, last: now, teaAt: [], bed: null, taxDay: null, debt: 0, fainted: 0, earned: 0, spent: 0 };
  const L = s.life;
  // ví cũ (P1): văn + phần lẻ → xu; một lần duy nhất: «lộc đổi chế độ» — Phúc Khí thôi là tiền mua sắm (§31.2)
  if (L.xu === undefined) {
    const own = Object.getOwnPropertyDescriptor(L, 'van');
    const van = own && 'value' in own ? Number(L.van) || 0 : START_VAN;
    L.xu = Math.round(van * C.DONG + (Number(L.vanFrac) || 0) * C.DONG);
    delete L.van; delete L.vanFrac;
    if (!s.coinGift && (s.phucKhi || 0) > 0) { const g = Math.min(2 * C.BAC, C.roundNice(Math.round((s.phucKhi || 0) * 0.1) * C.PHUC_RATE.use)); if (g > 0) { L.xu += g; s.coinGift = { xu: g, at: now, shown: false }; } }
  }
  for (const [k, v] of Object.entries({ bank: 0, full: 80, wake: 80, hp: 90, last: now, teaAt: [], bed: null, taxDay: null, debt: 0, fainted: 0, earned: 0, spent: 0 })) if (L[k] === undefined) L[k] = v;
  // L.van: đọc / ghi bằng ĐỒNG (không lưu — JSON chỉ giữ L.xu)
  if (!Object.getOwnPropertyDescriptor(L, 'van')?.get) {
    Object.defineProperty(L, 'van', { configurable: true, enumerable: false, get() { return Math.floor(this.xu / C.DONG); }, set(v) { this.xu = Math.round((Number(v) || 0) * C.DONG); } });
  }
  return L;
}

/** giờ địa phương 23–5 = Tý → Dần */
const isNight = (hour) => hour >= 23 || hour < 5;

/**
 * Trôi thời gian khi đang chơi (gọi ~mỗi giây). ctx: { activity, hour, workMul }. Trả { fainted } khi Khí huyết vừa về 0.
 */
export function tick(L, dtSec, ctx = {}) {
  const h = dtSec / 3600;
  const act = (ACT[ctx.activity] || 1) * (ctx.drain || 1), sick = ILL.effects(L).decay; // drain: cưỡi lừa / ngựa đỡ mệt (P4) // đang bệnh: ba chỉ số tụt nhanh gấp đôi (P3)
  L.full = clamp(L.full - RATE.full * act * sick * AD.effects(L).fullRate * h); // Âm Đức c1: No tụt chậm 5% (P17)
  L.wake = clamp(L.wake - RATE.wake * (isNight(ctx.hour ?? 12) ? NIGHT_WAKE : 1) * (ctx.workMul || 1) * sick * h);
  let dh = 0;
  if (L.full < 20) dh -= RATE.hpLow;
  if (L.wake < 20) dh -= RATE.hpLow;
  if (L.full > 50 && L.wake > 50) dh += RATE.hpRegen;
  const before = L.hp;
  if (dh < 0) dh *= sick;
  L.hp = clamp(L.hp + dh * h);
  return { fainted: before > 0 && L.hp <= 0 };
}

/** ảnh hưởng lên di chuyển / làm việc */
export function mods(L) {
  const weak = L.full < 20 || L.wake < 20, ill = ILL.effects(L), luck = L.wakeBuff && Date.now() < L.wakeBuff.until ? L.wakeBuff.luck : 0;
  return {
    sick: ill.work < 1,
    speed: (weak ? 0.85 : 1) * ill.speed,
    sprint: L.wake >= 10,
    staminaCap: Math.round(40 + 0.6 * L.wake),
    work: (L.wake < 30 ? 0.8 : 1) * (L.full < 20 ? 0.8 : 1) * ill.work * (1 + luck), // thức dậy cát tường: may mắn +5–15%
    luck,
  };
}
/** cảnh báo cho HUD / NPC: ['đói', 'buồn ngủ', 'yếu'] */
export function warnings(L) {
  const w = [];
  if (L.full < 20) w.push('đói'); if (L.wake < 20) w.push('buồn ngủ'); if (L.hp < 30) w.push('yếu'); if (L.ill && !L.ill.cureAt) w.push('ốm');
  return w;
}

// --- tiền ---------------------------------------------------------------------
/** cộng tiền (cho phép lẻ — phần lẻ tích lại tới đủ 1 văn) */
/** cộng tiền: amt tính bằng ĐỒNG (cho phép lẻ — chính xác tới xu). Trả số xu đã cộng. */
export function earn(L, amt) { return earnXu(L, C.fromDong(Math.max(0, amt))); }
export function earnXu(L, xu) { xu = Math.max(0, Math.round(xu)); L.xu += xu; L.earned += xu / C.DONG; return xu; }
/** trừ tiền: amt bằng ĐỒNG; false nếu không đủ */
export function pay(L, amt) { return payXu(L, C.fromDong(amt)); }
export function payXu(L, xu) {
  xu = Math.round(xu);
  if (xu <= 0) return true;
  if (L.xu < xu) return false;
  L.xu -= xu; L.spent += xu / C.DONG; return true;
}
/** ví của state (xu) — cho mua sắm ở tiệm / nhà / phạt */
export const walletXu = (s) => lifeState(s).xu;
export const spendXu = (s, xu) => payXu(lifeState(s), xu);
export const gainXu = (s, xu) => earnXu(lifeState(s), xu);

// --- ăn -------------------------------------------------------------------------
/** ăn món id ở nơi bán (menu); trả { ok, err } — err: 'menu' | 'money' | 'full' | 'cap' */
export function eat(L, id, menu, now = Date.now()) {
  const f = FOOD[id];
  if (!f || (menu && !MENUS[menu]?.includes(id))) return { ok: false, err: 'menu' };
  if ((f.full || 0) > 0 && L.full >= 98 && !(f.wake > 0)) return { ok: false, err: 'full' };
  if (f.cap) { L.teaAt = (L.teaAt || []).filter((t) => now - t < 6 * 3600000); if (L.teaAt.length >= f.cap) return { ok: false, err: 'cap' }; }
  if (!pay(L, Math.round(f.price * perkMul(L, 'food') * 100) / 100)) return { ok: false, err: 'money' }; // Hỏa vận (P5): −20%
  if (f.cap) L.teaAt.push(now);
  if ((f.full || 0) >= 25) { const d = new Date(now).toDateString(); if (L.meals?.day !== d) L.meals = { day: d, n: 0 }; L.meals.n += 1; } // ăn đủ 3 bữa: miễn dịch +10 (P3)
  L.full = clamp(L.full + (f.full || 0)); L.wake = clamp(L.wake + (f.wake || 0)); L.hp = clamp(L.hp + (f.hp || 0));
  return { ok: true, food: f };
}

// --- trọ / ngủ ------------------------------------------------------------------
/** thuê chỗ ngủ (giữ 12 giờ thật) */
export function rentBed(L, kind, now = Date.now()) {
  const g = LODGING[kind]; if (!g || !g.price) return { ok: false, err: 'kind' };
  if (L.bed && L.bed.kind === kind && L.bed.until > now) return { ok: true, already: true };
  if (!pay(L, g.price)) return { ok: false, err: 'money' };
  L.bed = { kind, until: now + BED_NIGHT_MS };
  return { ok: true };
}
export const hasBed = (L, kind, now = Date.now()) => !!(L.bed && L.bed.kind === kind && L.bed.until > now);
/** ngủ h giờ ở chỗ kind: Tỉnh hồi theo cấp, No tụt 3/giờ, Khí huyết +2/giờ khi No > 30 (+ thưởng chỗ tốt) */
export function sleep(L, hours, kind) {
  const g = LODGING[kind] || LODGING.street, h = Math.max(0, Math.min(OFFLINE.maxSleepH, hours));
  L.wake = clamp(L.wake + g.wake * h);
  L.full = clamp(L.full - 3 * h);
  if (L.full > 30) L.hp = clamp(L.hp + 2 * h + (g.hp || 0) * (h / 8));
  return { hours: h, lodging: g };
}

// --- bù giờ offline ---------------------------------------------------------------
/**
 * Thời gian vắng mặt: chỉ số giảm 25% tốc độ (có sàn); nếu thoát game ở chỗ ngủ đã trả / nhà riêng → coi như ngủ;
 * ngoài đường → ngủ bờ bụi (Tỉnh hồi 50%, 5% bị móc túi 10% Văn). ctx: { lodging, rand }
 */
export function catchUp(L, now = Date.now(), ctx = {}) {
  const ms = now - (L.last || now); L.last = now;
  if (ms < 60000) return { hours: 0 };
  const hours = ms / 3600000, rand = ctx.rand || Math.random;
  const f = OFFLINE.factor;
  L.full = Math.max(Math.min(L.full, OFFLINE.floorFull), clamp(L.full - RATE.full * f * hours));
  const kind = ctx.lodging || 'street';
  const slept = Math.min(OFFLINE.maxSleepH, hours);
  const rep = { hours, slept, lodging: kind };
  if (kind === 'street') {
    L.wake = clamp(L.wake + LODGING.street.wake * 0.5 * slept);
    if (hours >= 1 && rand() < LODGING.street.rob) { const lost = Math.floor(L.xu * 0.1); L.xu -= lost; rep.robbed = lost / C.DONG; rep.robbedXu = lost; }
  } else sleep(L, slept, kind);
  return rep;
}

// --- thuế thân (giờ Tý mỗi ngày, gọi khi sang ngày mới) ------------------------------
// --- Tiền Trang (§26.1): gửi tiền giữ an toàn (móc túi / tiền thuốc khi ngất chỉ lấy tiền mang theo), mỗi lần gửi / rút
// mất 0,5% phí (tối thiểu 1 đồng) — hố hút tiền nhỏ, không có lãi. Thuế thân tính trên cả tiền gửi.
export const BANK_FEE = 0.005;
export const bankFee = (xu) => Math.max(C.DONG, Math.round(Math.max(0, xu) * BANK_FEE));
/** gửi xu từ ví vào Tiền Trang: { ok, fee, reason } */
export function deposit(L, xu) {
  xu = Math.round(xu);
  if (!(xu > C.DONG)) return { ok: false, reason: 'Gửi tối thiểu hơn 1 đồng.' };
  if (L.xu < xu) return { ok: false, reason: 'Trong túi không đủ.' };
  const fee = Math.round(bankFee(xu) * perkMul(L, 'bank')); // Kim vận (P5): miễn phí
  L.xu -= xu; L.bank = (L.bank || 0) + xu - fee; L.spent += fee / C.DONG;
  return { ok: true, fee };
}
/** rút xu từ Tiền Trang ra ví (phí trừ vào số rút): { ok, fee, reason } */
export function withdraw(L, xu) {
  xu = Math.round(xu);
  if (!(xu > C.DONG)) return { ok: false, reason: 'Rút tối thiểu hơn 1 đồng.' };
  if ((L.bank || 0) < xu) return { ok: false, reason: 'Tiền gửi không đủ.' };
  const fee = Math.round(bankFee(xu) * perkMul(L, 'bank'));
  L.bank -= xu; L.xu += xu - fee; L.spent += fee / C.DONG;
  return { ok: true, fee };
}
/** tổng tài sản tiền (đồng, gồm tiền gửi) — cho thuế thân / bậc giàu */
export const wealthDong = (L) => Math.floor(((L.xu || 0) + (L.bank || 0)) / C.DONG);

export function dailyTax(L, wealth, today) {
  if (L.taxDay === today) return { due: 0 };
  L.taxDay = today;
  const t = taxFor(wealth);
  if (!t) return { due: 0 };
  if (pay(L, t)) return { due: t, paid: true };
  L.debt += t; return { due: t, paid: false };
}

/** ngất (P3): khiêng về Y Quán cấp cứu — viện phí 300 đồng (thiếu thì ghi nợ), tỉnh lại Khí huyết 30, No 40, Tỉnh 40 */
export const FAINT_FEE = 300;
export function faint(L, now = Date.now()) {
  const paidXu = Math.min(L.xu, FAINT_FEE * C.DONG); L.xu -= paidXu; L.spent += paidXu / C.DONG;
  const owed = FAINT_FEE - paidXu / C.DONG; if (owed > 0) ILL.addDebt(L, owed, now);
  const fee = FAINT_FEE;
  L.hp = 30; L.full = Math.max(L.full, 40); L.wake = Math.max(L.wake, 40); L.fainted += 1;
  return { fee, owed: Math.max(0, owed) };
}
