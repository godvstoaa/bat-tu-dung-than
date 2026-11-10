// ============================================================================
//  SẢN XUẤT (P9 — thuần). Thửa ruộng / chuồng thuê theo tuần (tối đa 4), cây & vật nuôi lớn theo GIỜ THẬT (tính lười),
//  tưới mỗi 12 giờ (lỡ hạn −30%), đúng mùa vụ +20%, Dụng thần Thổ (nông) +20%, bón phân +10%.
//  Lò mổ xẻ con theo bảng §13.3 (cần dao mổ), xay xát 2 lúa → 1 gạo, ngư phủ thả lưới vào trữ lượng hoang dã có hồi.
//  Đặc tả §13.3. Mọi hàm nhận p (hồ sơ kinh tế của người chơi: { inv, plots, purse … }).
// ============================================================================
import { CROPS, PLOT, BUTCHER, MILL, WILD, ITEMS } from './econ-data.js';
import * as INV from './inventory.js';

const H = 3600000, WEEK = 7 * 86400000;
/** mùa vụ theo tháng (giờ Việt Nam) — cây đúng mùa +20% (thay «tiết khí hợp») */
export const SEASON = { rau: [1, 12], lua: [4, 9], bong: [3, 8], tra: [2, 5] };
export const inSeason = (crop, now = Date.now()) => { const s = SEASON[crop]; if (!s) return false; const m = new Date(now + 7 * H).getUTCMonth() + 1; return m >= s[0] && m <= s[1]; };
export const plotsOf = (p) => (p.plots = Array.isArray(p.plots) ? p.plots : []);

/** thuê thêm một thửa (engine trừ tiền purse = PLOT.rentWeek đồng); kind: 'ruong' | 'chuong' */
export function rent(p, kind, now = Date.now()) {
  const P = plotsOf(p).filter((x) => x.until > now);
  if (P.length >= PLOT.max) return { ok: false, err: `Mỗi người tối đa ${PLOT.max} thửa / chuồng.` };
  if (!['ruong', 'chuong'].includes(kind)) return { ok: false, err: 'bad' };
  p.plots = [...P, { kind, until: now + WEEK, crop: null, at: 0, ready: 0, water: 0, dry: false, fert: false }];
  return { ok: true, cost: PLOT.rentWeek };
}
/** gia hạn thửa i thêm một tuần */
export function extend(p, i, now = Date.now()) { const x = plotsOf(p)[i]; if (!x) return { ok: false, err: 'Không có thửa này.' }; x.until = Math.max(x.until, now) + WEEK; return { ok: true, cost: PLOT.rentWeek }; }

/** gieo / thả: cần giống trong túi; ruộng cần cuốc; chuồng cần cám */
export function plant(p, i, crop, now = Date.now()) {
  const x = plotsOf(p)[i], C = CROPS[crop];
  if (!x || x.until <= now) return { ok: false, err: 'Thửa đã hết hạn thuê.' };
  if (!C || C.kind !== x.kind) return { ok: false, err: x.kind === 'chuong' ? 'Chuồng chỉ nuôi gà, lợn, bò.' : 'Ruộng chỉ trồng rau, lúa, bông, chè.' };
  if (x.crop) return { ok: false, err: 'Thửa đang có cây / con.' };
  if (!INV.count(p.inv, C.seed, now)) return { ok: false, err: `Thiếu ${ITEMS[C.seed].n}.` };
  if (C.feed && INV.count(p.inv, 'cam', now) < C.feed) return { ok: false, err: `Cần ${C.feed} cám chăn nuôi.` };
  if (x.kind === 'ruong' && !INV.useTool(p.inv, 'cuoc')) return { ok: false, err: 'Cần cuốc (mua ở Thương hội / thợ rèn).' };
  INV.take(p.inv, C.seed, 1, now); if (C.feed) INV.take(p.inv, 'cam', C.feed, now);
  Object.assign(x, { crop, at: now, ready: now + C.h * H, water: now, dry: false, fert: false });
  return { ok: true, ready: x.ready };
}
/** tưới (ruộng) / cho ăn (chuồng): lỡ quá 12 giờ kể từ lần trước thì ghi «khô» (−30% lúc thu) */
export function water(p, i, now = Date.now()) {
  const x = plotsOf(p)[i];
  if (!x || !x.crop) return { ok: false, err: 'Thửa trống.' };
  if (now - x.water > PLOT.waterH * H && Math.min(now, x.ready) - x.water > PLOT.waterH * H) x.dry = true;
  x.water = now; return { ok: true, dry: x.dry };
}
export function fertilize(p, i, now = Date.now()) {
  const x = plotsOf(p)[i];
  if (!x || !x.crop || x.kind !== 'ruong') return { ok: false, err: 'Chỉ bón cho ruộng đang trồng.' };
  if (x.fert) return { ok: false, err: 'Đã bón rồi.' };
  if (!INV.take(p.inv, 'phan', 1, now).ok) return { ok: false, err: 'Cần phân bón (ủ từ đồ ôi).' };
  x.fert = true; return { ok: true };
}
/** hệ số sản lượng hiện tại */
export function yieldMul(x, now = Date.now(), ctx = {}) {
  let m = 1;
  const lastGap = Math.min(now, x.ready) - x.water;
  if (x.dry || lastGap > PLOT.waterH * H) m -= PLOT.dryLoss;
  if (x.kind === 'ruong' && inSeason(x.crop, x.at)) m += PLOT.jieqi;
  if (x.kind === 'ruong' && ctx.yong?.primary === '土') m += 0.2;
  if (x.fert) m += PLOT.fert;
  return Math.max(0.3, m);
}
/** thu hoạch: trả { ok, got: { id: n } } */
export function harvest(p, i, now = Date.now(), ctx = {}) {
  const x = plotsOf(p)[i];
  if (!x || !x.crop) return { ok: false, err: 'Thửa trống.' };
  if (now < x.ready) return { ok: false, err: `Chưa tới lúc thu (còn ${Math.ceil((x.ready - now) / 60000)} phút).` };
  const C = CROPS[x.crop], m = yieldMul(x, now, ctx), got = {};
  for (const [id, n] of Object.entries(C.out)) got[id] = ITEMS[id].c === 'live' ? n : Math.max(1, Math.floor(n * m));
  const bag = p.inv.slice();
  for (const [id, n] of Object.entries(got)) if (!INV.add(bag, INV.newStack(id, n, now), now)) return { ok: false, err: 'Túi đầy — bán bớt hoặc cất hầm.' };
  p.inv = bag;
  Object.assign(x, { crop: null, at: 0, ready: 0, dry: false, fert: false });
  return { ok: true, got, mul: m };
}
/** lò mổ: xẻ một con sống ở chồng i */
export function butcher(p, i, now = Date.now()) {
  const st = p.inv[i], out = st && BUTCHER[st.id];
  if (!out) return { ok: false, err: 'Chỉ xẻ gà, lợn, bò sống.' };
  if (!INV.count(p.inv, 'dao', now)) return { ok: false, err: 'Cần dao mổ.' };
  const bag = p.inv.slice(); INV.take(bag, st.id, 1, now);
  for (const [id, n] of Object.entries(out)) if (!INV.add(bag, INV.newStack(id, n, now), now)) return { ok: false, err: 'Túi đầy.' };
  INV.useTool(bag, 'dao'); p.inv = bag;
  return { ok: true, got: out };
}
/** xay xát `times` lượt (2 lúa → 1 gạo); engine trừ phí MILL.fee × times đồng */
export function mill(p, times, now = Date.now()) {
  times = Math.max(1, Math.min(50, times | 0));
  if (INV.count(p.inv, 'lua', now) < MILL.in.lua * times) return { ok: false, err: `Cần ${MILL.in.lua * times} lúa.` };
  const bag = p.inv.slice(); INV.take(bag, 'lua', MILL.in.lua * times, now);
  if (!INV.add(bag, INV.newStack('gao', MILL.out.gao * times, now), now)) return { ok: false, err: 'Túi đầy.' };
  p.inv = bag; return { ok: true, got: { gao: times }, cost: MILL.fee * times };
}
/** ủ phân: đồ ôi → phân bón 1:1 (chỉ người có ruộng) */
export function compost(p, now = Date.now()) {
  if (!plotsOf(p).some((x) => x.kind === 'ruong' && x.until > now)) return { ok: false, err: 'Cần có thửa ruộng để ủ phân.' };
  const n = INV.count(p.inv, 'oi', now); if (!n) return { ok: false, err: 'Không có đồ ôi.' };
  const bag = p.inv.slice(); INV.take(bag, 'oi', n, now); INV.add(bag, INV.newStack('phan', n, now), now); p.inv = bag;
  return { ok: true, got: { phan: n } };
}
/** trữ lượng hoang dã: { stock, at } hồi 10% cap / giờ */
export function wildNow(w, now = Date.now(), kind = 'fish') { const W = WILD[kind]; const s = w || { stock: W.cap, at: now }; return { stock: Math.min(W.cap, s.stock + ((now - s.at) / H) * W.cap * W.regen), at: now }; }
/** thả lưới: score 0–1 (mini-game); ăn vào trữ lượng chung */
export function fish(p, w, score, now = Date.now(), seed = now) {
  const s = wildNow(w, now), Y = WILD.fish.yield;
  if (s.stock < 1) return { ok: false, err: 'Khúc sông này cạn cá — chờ cá về (hồi 10% mỗi giờ).', wild: s };
  const r = (k) => { const x = Math.sin(seed * 9301 + k * 49297) * 233280; return x - Math.floor(x); };
  const sc = Math.max(0, Math.min(1, Number(score) || 0));
  const ca = Math.min(Math.floor(s.stock), Math.round(Y.ca[0] + (Y.ca[1] - Y.ca[0]) * sc)), tom = sc > 0.6 && r(1) < 0.5 ? 1 : 0;
  const got = {}; if (ca) got.ca = ca; if (tom) got.tom = tom;
  const bag = p.inv.slice();
  for (const [id, n] of Object.entries(got)) if (!INV.add(bag, INV.newStack(id, n, now), now)) return { ok: false, err: 'Túi đầy.', wild: s };
  p.inv = bag; s.stock -= ca + tom;
  return { ok: true, got, wild: s };
}
