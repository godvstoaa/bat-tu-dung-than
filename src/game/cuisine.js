// ============================================================================
//  ẨM THỰC & ĐẦU BẾP (P10 — thuần). Đặc tả §15–§16.
//  · Thực căn (0–1) tính TRÊN MÁY từ lá số (thucCan) — gửi lên chỉ con số, khoá đổi 30 ngày như Dụng thần.
//  · Chất lượng = 0,35 điểm mini-game + 0,25 độ tươi nguyên liệu + 0,2 tay nghề + 0,2 Thực căn; hạng 3 < 0,4 → hỏng mất trắng.
//  · Công thức bí truyền khoá theo tài khoản (p.recipes), món có ẤN KÝ (by) +30% giá trị; chép bộ nguyên liệu → trần 0,6.
//  · Bếp trưởng: 3 thử thách đạt (chất lượng ≥ 0,7, tươi ≥ 0,8) + thiện cảm ≥ 60 → nhận đồ đệ (tối đa 20 / bếp trưởng);
//    người hợp cách đầu bếp (Thực căn ≥ 0,6) thiện cảm tăng ×3. Bí truyền mở dần theo tay nghề bếp (100 / 400 / 1200).
//  · Ăn: hồi theo hạng × chất lượng × độ tươi; hạng 1 cộng độc tích; hạng 3 cho buff «No khí» (hiệu suất +15–25%, 4 giờ).
// ============================================================================
import { RECIPES, RECIPE_BY, CHEFS, ITEMS, TRIALS_NEED, AFFINITY_NEED, CHEF_CAP } from './econ-data.js';
import * as INV from './inventory.js';

const SINH = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const SKILL_STEPS = [100, 400, 1200];
export const skillNorm = (xp) => clamp01((xp || 0) / 1200);

/**
 * Thực căn = 0,5 T + 0,3 M + 0,2 K (§16.1).
 * dayWx: hành Nhật chủ; yong: { primary, accent, ji }; pct: tỉ lệ ngũ hành { 木: 0–100, … }
 */
export function thucCan({ dayWx, yong, pct = {} }) {
  const out = SINH[dayWx];
  const T = !out || !yong ? 0.3 : out === yong.primary ? 1 : out === yong.accent ? 0.7 : out === yong.ji ? 0 : 0.3;
  const m = (pct['木'] || 0), f = (pct['火'] || 0), w = (pct['水'] || 0);
  const M = Math.min(1, Math.min(m, f) / 20);
  const K = w >= 10 && f >= 10 ? clamp01(1 - Math.abs(w - f) / 40) : 0;
  return Math.round((0.5 * T + 0.3 * M + 0.2 * K) * 100) / 100;
}
/** nghề bếp tính quan hệ mệnh theo Hỏa HOẶC hành Thực Thần (lấy cái lợi hơn) — §16.1 */
export function cookWx(dayWx, yong, relation) {
  const a = '火', b = SINH[dayWx];
  if (!b || !relation) return a;
  const rank = { dung: 3, hy: 2, thuong: 1, ky: 0 };
  return (rank[relation(b, yong)] ?? 0) > (rank[relation(a, yong)] ?? 0) ? b : a;
}

/** bộ nguyên liệu trùng một công thức bí truyền (dùng khi kiểm món chép) */
const keyOf = (ing) => Object.keys(ing).sort().join('+');
const SECRET_KEYS = new Map(RECIPES.filter((r) => r.secret).map((r) => [keyOf(r.ing), r.id]));
export const isCopy = (r) => !r.secret && SECRET_KEYS.has(keyOf(r.ing));

export function quality({ score = 0, fresh = 1, skill = 0, tc = 0, copy = false }) {
  let q = 0.35 * clamp01(score) + 0.25 * clamp01(fresh) + 0.2 * clamp01(skill) + 0.2 * clamp01(tc);
  if (copy) q = Math.min(0.6, q);
  return Math.round(q * 100) / 100;
}
export const canCook = (p, r) => !!r && (!r.secret || (p.recipes || []).includes(r.id));

/**
 * nấu công thức id: lấy nguyên liệu (đồ sắp hỏng trước), tính chất lượng, cho món vào túi.
 * ctx: { score (mini-game 0–1), tc (Thực căn), u (ấn ký), now }
 * Trả { ok, qual, n, fresh, failed?, trial? } — «qual» (không phải q: q là mã gói mạng)
 */
export function cook(p, id, ctx = {}) {
  const now = ctx.now || Date.now(), r = RECIPE_BY[id];
  if (!r) return { ok: false, err: 'Không có công thức này.' };
  if (!canCook(p, r)) return { ok: false, err: 'Công thức bí truyền — chỉ đồ đệ được truyền mới nấu được.' };
  for (const [ing, n] of Object.entries(r.ing)) if (INV.count(p.inv, ing, now, 0.01) < n) return { ok: false, err: `Thiếu ${ITEMS[ing].n} (cần ${n}).` };
  const bag = p.inv.slice(); let fs = 0, fn = 0;
  for (const [ing, n] of Object.entries(r.ing)) { const t = INV.take(bag, ing, n, now, 0.01); if (ITEMS[ing].d) { fs += t.fresh * n; fn += n; } }
  const fresh = fn ? fs / fn : 1;
  const q = quality({ score: ctx.score, fresh, skill: skillNorm(p.cookXp), tc: ctx.tc ?? p.tc ?? 0, copy: isCopy(r) });
  p.cookXp = (p.cookXp || 0) + 4 + r.tier * 3;
  if (r.tier === 3 && q < 0.4) { p.inv = bag; return { ok: true, failed: true, qual: q, fresh, n: 0 }; }
  const st = INV.newStack(id, r.out, now, { q, by: r.secret ? ctx.u : null });
  if (!INV.add(bag, st, now)) return { ok: false, err: 'Túi đầy.' };
  p.inv = bag;
  const trial = trialCheck(p, id, q, fresh, now);
  return { ok: true, qual: q, fresh, n: r.out, trial };
}

// --- bếp trưởng --------------------------------------------------------------------------------------------
export function chefOf(p, chef) {
  p.chefs = p.chefs || {};
  return (p.chefs[chef] = p.chefs[chef] || { aff: 0, trials: [], disciple: false });
}
/** món vừa nấu có phải món thử thách của bếp trưởng nào không → ghi đạt khi q ≥ 0,7 và tươi ≥ 0,8 */
export function trialCheck(p, id, q, fresh) {
  const hits = [];
  for (const [cid, C] of Object.entries(CHEFS)) {
    if (!C.trials.includes(id)) continue;
    const s = chefOf(p, cid);
    if (q >= 0.7 && fresh >= 0.8 && !s.trials.includes(id)) {
      s.trials.push(id);
      s.aff = Math.min(100, s.aff + 12 * ((p.tc || 0) >= 0.6 ? 3 : 1));
      hits.push({ chef: cid, name: C.name, dish: id, done: s.trials.length });
    }
  }
  return hits.length ? hits : null;
}
/** trò chuyện / biếu món cho bếp trưởng: thiện cảm +2 (×3 nếu hợp cách đầu bếp), mỗi ngày tối đa 1 lần / bếp trưởng */
export function greet(p, chef, day) {
  if (!CHEFS[chef]) return { ok: false, err: 'bad' };
  const s = chefOf(p, chef);
  if (s.greet === day) return { ok: false, err: 'Hôm nay đã thưa chuyện rồi — mai lại ghé.' };
  s.greet = day; s.aff = Math.min(100, s.aff + 2 * ((p.tc || 0) >= 0.6 ? 3 : 1));
  return { ok: true, aff: s.aff };
}
/** xin làm đồ đệ: cần 3 thử thách đạt + thiện cảm ≥ 60 + bếp trưởng còn chỗ (taken = số đồ đệ hiện có) */
export function apprentice(p, chef, taken = 0) {
  const C = CHEFS[chef]; if (!C) return { ok: false, err: 'bad' };
  const s = chefOf(p, chef);
  if (s.disciple) return { ok: false, err: 'Bạn đã là đồ đệ.' };
  if (s.trials.length < TRIALS_NEED) return { ok: false, err: `${C.name}: «Nấu đạt ${TRIALS_NEED} món thử đã» (đạt ${s.trials.length}/${TRIALS_NEED}: ${C.trials.map((t) => ITEMS[t].n).join(', ')} — chất lượng ≥ 70%, nguyên liệu tươi ≥ 80%).` };
  if (s.aff < AFFINITY_NEED) return { ok: false, err: `${C.name} chưa đủ tin bạn (thiện cảm ${s.aff}/${AFFINITY_NEED}).` };
  if (taken >= CHEF_CAP) return { ok: false, err: `${C.name} đã đủ ${CHEF_CAP} đồ đệ.` };
  s.disciple = true; unlockSecrets(p);
  return { ok: true };
}
/** mở công thức bí truyền theo tay nghề bếp (Thợ 100 · Thợ cả 400 · Quản sự 1200) */
export function unlockSecrets(p) {
  p.recipes = p.recipes || [];
  const got = [];
  for (const r of RECIPES) {
    if (!r.secret || p.recipes.includes(r.id) || !p.chefs?.[r.secret]?.disciple) continue;
    if ((p.cookXp || 0) >= SKILL_STEPS[r.step - 1]) { p.recipes.push(r.id); got.push(r.id); }
  }
  return got;
}

/**
 * ăn một suất ở chồng i (túi). Trả hiệu ứng cho client áp vào life.js: { full, wake, hp, tox, buff, poison, name }
 * Đồ ôi không ăn được. Món tươi < 15% hạng 2–3: dễ ngộ độc (poison).
 */
export function eat(p, i, now = Date.now()) {
  const st = p.inv[i], d = st && ITEMS[st.id];
  if (!d || d.c !== 'dish') return { ok: false, err: 'Chỉ ăn được món đã nấu.' };
  const f = INV.freshness(st, now), q = st.q ?? 0.5;
  const t = INV.take(p.inv, st.id, 1, now); if (!t.ok) return { ok: false, err: 'Hết món.' };
  const k = (0.6 + 0.4 * q) * (0.5 + 0.5 * f);
  return {
    ok: true, name: d.n, tier: d.tier,
    full: Math.round(d.full * k), wake: Math.round(d.wake * k), hp: Math.round(d.hp * k * 10) / 10,
    tox: d.tox || 0, buff: d.buff ? Math.round((0.15 + 0.1 * q) * 100) / 100 : 0,
    poison: d.tier >= 2 && f < 0.15,
  };
}

/** độc tích (§15.3) — chạy ở client (life.js giữ L.tox): ăn hạng 1 +1,5; ngày không ăn hạng 1 −3; đủ 3 bữa hạng 2 −5 */
export function toxAfterMeal(L, tier, day) {
  L.toxDay = L.toxDay || { day, t1: 0, t2: 0 };
  if (L.toxDay.day !== day) { if (!L.toxDay.t1) L.tox = Math.max(0, (L.tox || 0) - 3); if (L.toxDay.t2 >= 3) L.tox = Math.max(0, (L.tox || 0) - 5); L.toxDay = { day, t1: 0, t2: 0 }; }
  if (tier === 1) { L.tox = Math.min(100, (L.tox || 0) + 1.5); L.toxDay.t1 += 1; }
  if (tier === 2) L.toxDay.t2 += 1;
  const tox = L.tox || 0;
  return tier === 1 ? (tox > 60 ? 0.15 : tox > 30 ? 0.05 : 0) : 0; // xác suất ngộ độc nhẹ bữa này
}
