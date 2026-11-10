// ============================================================================
//  NHÀ & XE (P4 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §6, §7.
//  · 5 bậc phương tiện mua ở Dịch Trạm bằng tiền kim loại; bảo trì (cỏ, chuồng, linh thực) trừ mỗi ngày — thiếu thì ghi nợ,
//    nợ bảo trì 3 ngày liền thì Dịch Trạm giữ xe (bán lại nửa giá trừ nợ).
//  · Nhà riêng: bảo trì theo hạng mỗi ngày (nhà mua bằng Phúc Khí / Ngọc miễn 30 ngày đầu).
//  · Tủ đồ ăn ở nhà: mua mang về, giữ 3 ngày rồi ôi (ăn đồ ôi → ngộ độc, illness.js).
//  · Biệt thự / biệt phủ: «Thức dậy cát tường» — ngủ dậy ở nhà được may mắn +5–15% cả ngày theo điểm phong thủy, Khí huyết +10.
//  Lưu trong state.life (L.garage, L.pantry, L.wakeBuff, L.upkeep) — khoá life được giữ nguyên khi nạp lại.
//  Tiền: giá tính bằng XU, bảo trì tính bằng ĐỒNG (cùng đơn vị với L.debt).
// ============================================================================
import { BAC, DONG } from './coins.js';
import { perkMul } from './fatequest.js';

export const VEHICLES = {
  lua: { name: 'Lừa', icon: '🫏', tier: 1, price: 3 * BAC, upkeep: 5, speed: 1.15, drain: 0.8, carry: 1, ground: true, desc: 'Đi đỡ mệt (hao No / Tỉnh −20%), chở được một thùng hàng.' },
  ngua: { name: 'Ngựa', icon: '🐎', tier: 2, price: 15 * BAC, upkeep: 20, speed: 1.6, drain: 0.9, carry: 2, ground: true, desc: 'Phi nhanh ×1,6 trên đường cái; mở việc giao hàng liên cung.' },
  xengua: { name: 'Xe ngựa', icon: '🐴', tier: 3, price: 60 * BAC, upkeep: 50, speed: 1.4, drain: 0.85, carry: 6, ground: true, desc: 'Chở 6 thùng — buôn bán, vận tải đường dài, áp tiêu.' },
  linhhac: { name: 'Linh hạc', icon: '🕊️', tier: 4, price: 400 * BAC, upkeep: 150, hop: 60, cool: 180, desc: 'Bay thấp 60 giây, nghỉ 3 phút — bay được cả khi chưa đủ cấp ngự kiếm.' },
  phikiem: { name: 'Phi kiếm thượng phẩm', icon: '🗡️', tier: 5, price: 2000 * BAC, upkeep: 2000, fly: 1.5, desc: 'Ngự kiếm nhanh ×1,5, không hao Tỉnh — biểu tượng địa vị.' },
};
export const SEIZE_DAYS = 3;
/** bảo trì nhà riêng (đồng / ngày) theo hạng */
export const HOUSE_UPKEEP = { tieuxa: 8, nhapho: 20, tuhop: 45, bietthu: 200, bietphu: 600 };
export const PANTRY_MS = 3 * 86400000, PANTRY_MAX = 12;
/** ngự kiếm cơ bản hao Tỉnh 6 / phút (phi kiếm thượng phẩm thì không) */
export const FLY_WAKE_PER_MIN = 6;

export function garage(L) {
  if (!L.garage || typeof L.garage !== 'object') L.garage = { own: [], ride: null, hacAt: 0, owe: {} };
  const g = L.garage;
  g.own = Array.isArray(g.own) ? g.own.filter((id) => VEHICLES[id]) : [];
  if (g.ride && !g.own.includes(g.ride)) g.ride = null;
  if (!g.owe || typeof g.owe !== 'object') g.owe = {};
  return g;
}
export const owns = (L, id) => garage(L).own.includes(id);
/** mua: spendXu(xu) → bool */
export function buy(L, id, spendXu) {
  const V = VEHICLES[id]; if (!V) return { ok: false, reason: 'Không có loại này.' };
  const g = garage(L);
  if (g.own.includes(id)) return { ok: false, reason: `Đã có ${V.name}.` };
  if (!spendXu(V.price)) return { ok: false, reason: 'Không đủ tiền.' };
  g.own.push(id);
  return { ok: true };
}
/** cưỡi / xuống (chỉ phương tiện đi đất) */
export function ride(L, id) {
  const g = garage(L);
  if (!id) { g.ride = null; return { ok: true }; }
  if (!g.own.includes(id) || !VEHICLES[id].ground) return { ok: false, reason: 'Chưa có phương tiện này.' };
  g.ride = id; return { ok: true };
}
/** hệ số di chuyển / hao chỉ số khi đang cưỡi (đứng yên trên ngựa vẫn tính hao như đi bộ) */
export function rideMods(L) {
  const g = garage(L), V = g.ride ? VEHICLES[g.ride] : null;
  return { speed: V?.speed || 1, drain: V?.drain || 1, carry: V?.carry || 0, flyMul: g.own.includes('phikiem') ? 1.5 : 1, flyFree: g.own.includes('phikiem') };
}
/** linh hạc: có bay được lúc này không, còn bao giây hồi */
export function hacReady(L, now = Date.now()) {
  const g = garage(L); if (!g.own.includes('linhhac')) return { has: false };
  const left = g.hacAt ? Math.max(0, g.hacAt + (VEHICLES.linhhac.hop + VEHICLES.linhhac.cool) * 1000 - now) : 0;
  return { has: true, ready: left === 0, left: Math.ceil(left / 1000) };
}
export function hacTakeoff(L, now = Date.now()) { const r = hacReady(L, now); if (!r.has || !r.ready) return false; garage(L).hacAt = now; return true; }
/** đang trong 60 giây bay của linh hạc? */
export const hacFlying = (L, now = Date.now()) => owns(L, 'linhhac') && now - (garage(L).hacAt || 0) < VEHICLES.linhhac.hop * 1000;

/**
 * Bảo trì mỗi ngày (gọi khi sang ngày): xe + nhà. pay(amtĐồng) → bool; addDebt(amtĐồng). house: { tier, free (miễn 30 ngày) } | null.
 * Trả { vehicles, house, seized: [id], total }.
 */
export function dailyUpkeep(L, dateStr, { pay, addDebt, house = null } = {}) {
  const g = garage(L);
  if (L.upkeepDay === dateStr) return { total: 0, seized: [] };
  L.upkeepDay = dateStr;
  let total = 0; const seized = [];
  for (const id of [...g.own]) {
    const c = VEHICLES[id].upkeep;
    if (pay(c)) { g.owe[id] = 0; total += c; continue; }
    addDebt(c); total += c; g.owe[id] = (g.owe[id] || 0) + 1;
    if (g.owe[id] >= SEIZE_DAYS) { // Dịch Trạm giữ xe: bán nửa giá, trừ vào nợ
      g.own = g.own.filter((x) => x !== id); if (g.ride === id) g.ride = null; delete g.owe[id];
      seized.push({ id, refund: Math.floor(VEHICLES[id].price / 2 / DONG) });
    }
  }
  let houseCost = 0;
  // Thổ vận (P5): bảo trì nhà −50%
  if (house && !house.free) { houseCost = Math.round((HOUSE_UPKEEP[house.tier] || 0) * perkMul(L, 'house')); if (houseCost && !pay(houseCost)) addDebt(houseCost); total += houseCost; }
  return { total, seized, house: houseCost };
}

// --- tủ đồ ăn ------------------------------------------------------------------------------------------
export function pantry(L) { if (!Array.isArray(L.pantry)) L.pantry = []; return L.pantry; }
export function store(L, foodId, now = Date.now()) {
  const p = pantry(L); if (p.length >= PANTRY_MAX) return false;
  p.push({ id: foodId, at: now }); return true;
}
/** lấy một món ra ăn: { id, spoiled } | null (món cũ nhất trước) */
export function takeOut(L, idx, now = Date.now()) {
  const p = pantry(L); const it = p[idx]; if (!it) return null;
  p.splice(idx, 1);
  return { id: it.id, spoiled: now - it.at > PANTRY_MS };
}

// --- thức dậy cát tường (biệt thự / biệt phủ) ---------------------------------------------------------------
/** score: điểm phong thủy nhà (0–100, homefs.scoreHome) → may mắn 5–15% cả ngày */
export function wakeBlessing(L, score, until) {
  const luck = 0.05 + 0.10 * Math.max(0, Math.min(1, (score || 0) / 100));
  L.wakeBuff = { until, luck: Math.round(luck * 100) / 100 };
  L.hp = Math.min(100, L.hp + 10);
  return L.wakeBuff;
}
export const luckToday = (L, now = Date.now()) => (L.wakeBuff && now < L.wakeBuff.until ? L.wakeBuff.luck : 0);
