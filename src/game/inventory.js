// ============================================================================
//  KHO ĐỒ & ĐỘ TƯƠI (P8 — thuần, chạy cả client lẫn Durable Object `Economy`). Đặc tả §18.1, §19.2.
//  · Một chồng (stack): { id, n, f0, t0, cold, q, by, dur }
//      f0 = độ tươi tại mốc t0 (0–1); cold = đang để lạnh; q = chất lượng món (0–1); by = ấn ký người nấu; dur = độ bền đồ nghề.
//  · TÍNH LƯỜI: độ_tươi(t) = f0 − (t − t0) × hệ_số_bảo_quản / hạn_dùng. Đổi chỗ để thì CHỐT đoạn (f0, t0 mới).
//  · Hết tươi → «Đồ ôi» (chỉ ủ thành phân bón được).
//  · Hầm băng: tối đa 12 chồng; mỗi chồng tiêu 1 khối băng / 12 giờ. Hết băng → các chồng trở về để thường từ lúc cạn.
//  · Sổ tiền: thao tác có khoá (idempotency) — gửi lại cùng khoá trả đúng kết quả cũ, không trừ / cộng hai lần.
// ============================================================================
import { ITEMS, COLD } from './econ-data.js';

export const BAG_MAX = 40, CELLAR_MAX = 12, ICE_H = 12, HOUR = 3600000;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const coldK = (d) => (d && d.k != null ? d.k : COLD);

/** độ tươi hiện tại 0–1 (đồ không hỏng: 1) */
export function freshness(st, now = Date.now()) {
  const d = ITEMS[st.id];
  if (!d || !d.d) return 1;
  const h = Math.max(0, now - (st.t0 || now)) / HOUR;
  return clamp01((st.f0 ?? 1) - (h * (st.cold ? coldK(d) : 1)) / d.d);
}
/** chốt đoạn bảo quản (đổi cold) */
export function checkpoint(st, now, cold = st.cold) { st.f0 = freshness(st, now); st.t0 = now; st.cold = !!cold; return st; }

export function newStack(id, n, now = Date.now(), o = {}) {
  const d = ITEMS[id];
  const st = { id, n: Math.max(1, n | 0), f0: o.f0 ?? 1, t0: now, cold: !!o.cold };
  if (o.q != null) st.q = Math.round(clamp01(o.q) * 100) / 100;
  if (o.by) st.by = String(o.by).slice(0, 40);
  if (d?.dur) st.dur = o.dur ?? d.dur;
  return st;
}
/** đồ ôi: chuyển chồng hết tươi thành «oi» (giữ số lượng) */
export function rot(list, now = Date.now()) {
  let n = 0;
  for (const st of list) if (st.id !== 'oi' && ITEMS[st.id]?.d && freshness(st, now) <= 0) { st.id = 'oi'; st.f0 = 1; st.t0 = now; delete st.q; delete st.by; n += st.n; }
  return n;
}
/** gộp các chồng giống nhau (cùng món, cùng chỗ để, tươi lệch < 5%, cùng chất lượng làm tròn 0,05, cùng ấn ký) */
export function merge(list, now = Date.now()) {
  const out = [];
  for (const st of list) {
    if (!st.n) continue;
    const f = freshness(st, now), d = ITEMS[st.id];
    const m = d?.dur ? null : out.find((o) => o.id === st.id && !!o.cold === !!st.cold && (o.by || '') === (st.by || '')
      && Math.abs(freshness(o, now) - f) < 0.05 && Math.round((o.q ?? -1) * 20) === Math.round((st.q ?? -1) * 20));
    if (m) { const fm = freshness(m, now), tot = m.n + st.n; m.f0 = (fm * m.n + f * st.n) / tot; m.t0 = now; if (m.q != null) m.q = Math.round(((m.q * m.n + (st.q ?? m.q) * st.n) / tot) * 100) / 100; m.n = tot; }
    else out.push(st);
  }
  return out;
}
export const count = (list, id, now = Date.now(), minFresh = 0) => list.reduce((a, st) => a + (st.id === id && freshness(st, now) >= minFresh ? st.n : 0), 0);

/** thêm vào túi (gộp); trả false nếu túi đầy (BAG_MAX chồng) */
export function add(list, st, now = Date.now(), max = BAG_MAX) {
  const next = merge([...list, st], now);
  if (next.length > max) return false;
  list.length = 0; list.push(...next); return true;
}
/**
 * lấy n món id (ưu tiên đồ sắp hỏng trước — FEFO). Trả { ok, taken: [stack…], fresh (tươi trung bình), q (chất lượng trung bình) }.
 * Không đủ thì không lấy gì.
 */
export function take(list, id, n, now = Date.now(), minFresh = 0) {
  if (count(list, id, now, minFresh) < n) return { ok: false };
  const idx = list.map((st, i) => [st, i]).filter(([st]) => st.id === id && freshness(st, now) >= minFresh).sort((a, b) => freshness(a[0], now) - freshness(b[0], now));
  let need = n, fs = 0, qs = 0, qn = 0; const taken = [];
  for (const [st] of idx) {
    if (!need) break;
    const k = Math.min(need, st.n), f = freshness(st, now);
    taken.push({ ...st, n: k, f0: f, t0: now }); fs += f * k; if (st.q != null) { qs += st.q * k; qn += k; }
    st.n -= k; need -= k;
  }
  const keep = list.filter((st) => st.n > 0); list.length = 0; list.push(...keep);
  return { ok: true, taken, fresh: fs / n, q: qn ? qs / qn : null };
}
/** dùng đồ nghề (−1 độ bền); trả false nếu không có */
export function useTool(list, id) {
  const st = list.filter((s) => s.id === id && (s.dur ?? 1) > 0).sort((a, b) => (a.dur ?? 0) - (b.dur ?? 0))[0];
  if (!st) return false;
  st.dur = (st.dur ?? ITEMS[id].dur) - 1;
  if (st.dur <= 0) { st.n -= 1; st.dur = ITEMS[id].dur; if (st.n <= 0) list.splice(list.indexOf(st), 1); }
  return true;
}

// --- hầm băng --------------------------------------------------------------------------------------------
/** cellar: { list, ice, at } — chốt việc tiêu băng tới `now`; hết băng thì các chồng chuyển sang để thường từ lúc cạn */
export function settleCellar(c, now = Date.now()) {
  if (!c.at) c.at = now;
  const n = c.list.filter((s) => ITEMS[s.id]?.d).length;
  if (!n) { c.at = now; return c; }
  const hours = (now - c.at) / HOUR, need = (hours / ICE_H) * n;
  if (need <= c.ice) { c.ice -= need; c.at = now; return c; }
  const lastH = (c.ice / n) * ICE_H, dry = c.at + lastH * HOUR;
  for (const st of c.list) if (st.cold) checkpoint(st, dry, false);
  c.ice = 0; c.at = now; return c;
}
export function cellarOf(p) { if (!p.cellar) p.cellar = { list: [], ice: 0, at: 0 }; return p.cellar; }
/** chuyển chồng i từ túi vào hầm (cần băng) */
export function toCellar(p, i, now = Date.now()) {
  const c = settleCellar(cellarOf(p), now), st = p.inv[i];
  if (!st) return { ok: false, err: 'Không có món này.' };
  if (!ITEMS[st.id]?.d) return { ok: false, err: 'Món này không hỏng, không cần để hầm.' };
  if (c.ice < 1) return { ok: false, err: 'Hầm hết băng — nạp khối băng trước.' };
  if (c.list.length >= CELLAR_MAX) return { ok: false, err: `Hầm chỉ chứa ${CELLAR_MAX} chồng.` };
  p.inv.splice(i, 1); checkpoint(st, now, true); c.list.push(st); c.list = merge(c.list, now);
  return { ok: true };
}
export function fromCellar(p, i, now = Date.now()) {
  const c = settleCellar(cellarOf(p), now), st = c.list[i];
  if (!st) return { ok: false, err: 'Không có món này.' };
  checkpoint(st, now, false);
  if (!add(p.inv, st, now)) { checkpoint(st, now, true); return { ok: false, err: 'Túi đầy.' }; }
  c.list.splice(i, 1); return { ok: true };
}
/** nạp băng từ túi vào hầm */
export function loadIce(p, n, now = Date.now()) {
  const c = settleCellar(cellarOf(p), now), r = take(p.inv, 'bang', n, now);
  if (!r.ok) return { ok: false, err: 'Không đủ khối băng.' };
  c.ice += n;
  for (const st of c.list) if (!st.cold) checkpoint(st, now, true);
  return { ok: true, ice: c.ice };
}

// --- sổ tiền có khoá -------------------------------------------------------------------------------------
/** áp delta xu vào ví p.purse với khoá key; trả { ok, purse, dup } */
export function ledger(p, key, delta, why = '') {
  p.ops = p.ops || [];
  if (key && p.ops.some((o) => o.k === key)) return { ok: true, dup: true, purse: p.purse };
  if ((p.purse || 0) + delta < 0) return { ok: false, err: 'Ví máy chủ không đủ tiền.' };
  p.purse = (p.purse || 0) + Math.round(delta);
  p.ops.push({ k: key || `_${Date.now()}`, d: Math.round(delta), w: why.slice(0, 24), at: Date.now() });
  if (p.ops.length > 60) p.ops = p.ops.slice(-60);
  return { ok: true, purse: p.purse };
}

/** xem kho: mỗi chồng kèm độ tươi hiện tại (làm tròn) */
export const view = (list, now = Date.now()) => list.map((st, i) => ({ i, id: st.id, n: st.n, fresh: Math.round(freshness(st, now) * 100) / 100, cold: !!st.cold, q: st.q ?? null, by: st.by ? 1 : 0, dur: st.dur ?? null }));
