// ============================================================================
//  SỔ KINH TẾ PHẦN II (thuần JS) — kho đồ (P8), sản xuất + chợ + Thương hội (P9), bếp (P10), nhà hàng (P11),
//  hộ tịch (P12), thầy mệnh lý (P13). worker/economy.js bọc lớp này trong Durable Object `Economy` (một bản toàn cục);
//  client NGOẠI TUYẾN chạy CHÍNH lớp này trên bộ nhớ máy (ctx.local = true: không có người chơi khác, không giao dịch).
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §9, §12–§19.
//
//  Lưu trữ (API như ctx.storage):
//   p:<u>       hồ sơ kinh tế { purse (xu), inv, cellar, plots, recipes, chefs, cookXp, tc, held[], debt, dep, th, civ, venue }
//   mk:<id>     tin ký gửi { id, u, name, st (chồng hàng), price (xu / đơn vị), at }
//   hist:<item> giá khớp gần đây [{ p, at }]          pair:<a|b> [{ v (xu), at }]       act:<ngày> [u…]
//   wild        trữ lượng cá { stock, at }            vn:<id> mặt bằng                  chef:<id> số đồ đệ
//   m:<id>      hôn thú                               prop:<u> lời cầu hôn gửi tới u     dv:<u> hồ sơ thầy · bk:<id> lượt xem
//   flow:<ngày> { faucet, sink } (xu)                 seq bộ đếm id
// ============================================================================
import { ITEMS, RECIPE_BY, CHEFS, VENUE_TIERS, REGIONS, PLOT } from './econ-data.js';
import * as INV from './inventory.js';
import * as PR from './production.js';
import * as MK from './market.js';
import * as CU from './cuisine.js';
import * as VN from './venue.js';
import * as CV from './civil.js';
import * as DV from './divination.js';

export const vnDay = (now = Date.now()) => new Date(now + 7 * 3600000).toISOString().slice(0, 10);
const DEP_CAP = { guest: 300, acct: 5000 }; // đồng / ngày chuyển từ ví máy lên ví máy chủ (cầu nối tới khi ví lên hẳn máy chủ)
const LOCK_TC = 30 * 86400000;
const okN = (n, max = 999) => Number.isInteger(n) && n > 0 && n <= max;
const err = (e) => ({ ok: false, err: e });

export class EconEngine {
  /** store: { get, put, delete, list }; opts.judge(messages) → Promise<string> (trọng tài LLM, tuỳ chọn) */
  constructor(store, opts = {}) { this.s = store; this.judge = opts.judge || null; }

  async id() { const n = ((await this.s.get('seq')) || 0) + 1; await this.s.put('seq', n); return n.toString(36); }
  async P(u) {
    const p = (await this.s.get(`p:${u}`)) || {};
    return { purse: 0, inv: [], plots: [], recipes: [], chefs: {}, cookXp: 0, tc: 0, tcAt: 0, held: [], debt: 0, ...p };
  }
  async save(u, p) { await this.s.put(`p:${u}`, p); }
  async flow(kind, xu, now) { if (!xu) return; const k = `flow:${vnDay(now)}`, f = (await this.s.get(k)) || { faucet: 0, sink: 0 }; f[kind] += Math.round(xu); await this.s.put(k, f); }
  async active(u, now) {
    const k = `act:${vnDay(now)}`, a = (await this.s.get(k)) || [];
    if (!a.includes(u) && a.length < 500) { a.push(u); await this.s.put(k, a); }
    const y = (await this.s.get(`act:${vnDay(now - 86400000)}`)) || [];
    return new Set([...a, ...y]).size;
  }

  /** điểm vào duy nhất: op + tham số, ctx = { uid (tài khoản đăng nhập), name, local, now } */
  async call(op, u, a = {}, ctx = {}) {
    if (!u) return err('Chưa có danh tính người chơi.');
    const now = ctx.now || Date.now(), f = this[`op_${op}`];
    if (typeof f !== 'function') return err('bad');
    const trade = ['mk_post', 'mk_buy', 'vn_rent', 'vn_buy', 'cv_propose', 'cv_answer', 'dv_register', 'dv_book', 'dv_exam'];
    if (trade.includes(op) && !ctx.uid && !ctx.local) return err('Cần đăng nhập tài khoản (khách không giao dịch với người khác).');
    try { await this.sweepDiv(now); await this.settleVenues(now); return await f.call(this, u, a, { ...ctx, now }); } catch (e) { return err('Lỗi máy chủ kinh tế.'); }
  }

  // ---------- hồ sơ & ví ----------
  async refresh(u, p, now) {
    INV.rot(p.inv, now); INV.settleCellar(INV.cellarOf(p), now); INV.rot(INV.cellarOf(p).list, now);
    // két giữ hết hạn → giải ngân
    const due = (p.held || []).filter((h) => h.until <= now);
    if (due.length) { for (const h of due) INV.ledger(p, `held:${h.k}`, h.xu, 'két giải ngân'); p.held = p.held.filter((h) => h.until > now); }
    // tin ký gửi hết hạn → trả hàng
    for (const [k, l] of await this.s.list({ prefix: 'mk:' })) if (l.u === u && now - l.at > MK.LIST_DAYS * MK.DAY) { if (INV.add(p.inv, l.st, now)) await this.s.delete(k); }
    CU.unlockSecrets(p); // két két / chốt sổ tiệm đã quét ở call() trước khi nạp hồ sơ
  }
  async op_me(u, a, ctx) {
    const p = await this.P(u); await this.refresh(u, p, ctx.now); await this.save(u, p);
    const debt = p.debt; if (debt) { p.debt = 0; await this.save(u, p); }
    return { ok: true, ...(await this.pub(u, p, ctx.now)), debt };
  }
  async pub(u, p, now) {
    const c = INV.cellarOf(p);
    const venue = p.venue ? await this.s.get(`vn:${p.venue}`) : null;
    const m = p.civ?.mid ? await this.s.get(`m:${p.civ.mid}`) : null;
    return {
      purse: p.purse, inv: INV.view(p.inv, now), cellar: { list: INV.view(c.list, now), ice: Math.round(c.ice * 10) / 10 },
      plots: p.plots.map((x, i) => ({ i, kind: x.kind, until: x.until, crop: x.crop, ready: x.ready, water: x.water, dry: !!x.dry, fert: !!x.fert, mul: x.crop ? Math.round(PR.yieldMul(x, now, { yong: p.yong }) * 100) / 100 : null })),
      recipes: p.recipes, chefs: p.chefs, cookXp: p.cookXp, tc: p.tc, held: (p.held || []).reduce((s, h) => s + h.xu, 0),
      venue: venue ? this.pubVenue(venue) : null, marriage: m ? this.pubMarriage(m, u) : null, props: (await this.s.get(`prop:${u}`)) || [],
    };
  }
  /** chuyển tiền từ ví máy lên ví máy chủ (có trần / ngày) — key chống gửi trùng */
  async op_deposit(u, a, ctx) {
    const xu = Math.round(Number(a.xu) || 0); if (xu <= 0) return err('bad');
    const p = await this.P(u), day = vnDay(ctx.now), cap = (ctx.uid ? DEP_CAP.acct : DEP_CAP.guest) * 100;
    if (a.k && (p.ops || []).some((o) => o.k === a.k)) return { ok: true, purse: p.purse, dup: true };
    if (!p.dep || p.dep.day !== day) p.dep = { day, xu: 0 };
    if (!ctx.local && p.dep.xu + xu > cap) return err(`Hôm nay chỉ gửi thêm được ${Math.max(0, cap - p.dep.xu) / 100} đồng lên ví chợ.`);
    const r = INV.ledger(p, a.k, xu, 'gửi lên'); if (!r.ok) return r;
    if (!r.dup) p.dep.xu += xu;
    await this.save(u, p); return { ok: true, purse: p.purse, dup: r.dup };
  }
  async op_withdraw(u, a, ctx) {
    const xu = Math.round(Number(a.xu) || 0); if (xu <= 0) return err('bad');
    const p = await this.P(u), r = INV.ledger(p, a.k, -xu, 'rút về'); if (!r.ok) return r;
    await this.save(u, p); return { ok: true, purse: p.purse, xu, dup: r.dup };
  }
  /** Thực căn (tính trên máy từ lá số) — khoá đổi 30 ngày */
  async op_set_tc(u, a, ctx) {
    const tc = Math.max(0, Math.min(1, Math.round((Number(a.tc) || 0) * 100) / 100)), p = await this.P(u);
    if (p.tcAt && p.tc !== tc && ctx.now - p.tcAt < LOCK_TC && !ctx.local) return { ok: true, tc: p.tc, locked: true };
    if (p.tc !== tc) { p.tc = tc; p.tcAt = ctx.now; }
    if (a.yong && !p.yong) p.yong = { primary: a.yong.primary };
    await this.save(u, p); return { ok: true, tc: p.tc };
  }
  async op_cellar_in(u, a, ctx) { return this.mut(u, ctx, (p) => INV.toCellar(p, a.i | 0, ctx.now)); }
  async op_cellar_out(u, a, ctx) { return this.mut(u, ctx, (p) => INV.fromCellar(p, a.i | 0, ctx.now)); }
  async op_ice(u, a, ctx) { return this.mut(u, ctx, (p) => (okN(a.n, 50) ? INV.loadIce(p, a.n, ctx.now) : err('bad'))); }
  async op_drop(u, a, ctx) { return this.mut(u, ctx, (p) => { const st = p.inv[a.i | 0]; if (!st) return err('bad'); p.inv.splice(a.i | 0, 1); return { ok: true }; }); }
  /** chạy f(p) trên hồ sơ, lưu khi ok, trả kèm bản công khai */
  async mut(u, ctx, f) {
    const p = await this.P(u); await this.refresh(u, p, ctx.now);
    const r = await f(p); if (!r || !r.ok) return r || err('bad');
    await this.save(u, p); return { ...r, ...(await this.pub(u, p, ctx.now)) };
  }
  /** trừ ví máy chủ cost đồng (sink) */
  async charge(p, dong, why, now) { const xu = Math.round(dong * 100); const r = INV.ledger(p, null, -xu, why); if (r.ok) await this.flow('sink', xu, now); return r; }

  // ---------- Thương hội (mồi khởi động) ----------
  async ref(id, now) { return MK.refPrice(id, (await this.s.get(`hist:${id}`)) || [], now); }
  async op_th_board(u, a, ctx) {
    const sell = [], buy = [], act = await this.active(u, ctx.now), fac = MK.thFactor(act), p = await this.P(u), day = vnDay(ctx.now);
    for (const id of Object.keys(ITEMS)) {
      const r = await this.ref(id, ctx.now);
      if (MK.thSells(id)) sell.push({ id, price: MK.thSellPrice(id, r) });
      if (MK.thBuys(id)) buy.push({ id, price: MK.thBuyPrice(id, r) });
    }
    const used = p.th?.day === day ? p.th.xu : 0;
    return { ok: true, sell, buy, quota: Math.round(MK.TH_QUOTA * 100 * fac), used, active: act };
  }
  async op_th_buy(u, a, ctx) {
    const id = String(a.id || ''), n = a.n | 0; if (!MK.thSells(id) || !okN(n, 200)) return err('Thương hội không bán món này.');
    const price = MK.thSellPrice(id, await this.ref(id, ctx.now)) * n;
    return this.mut(u, ctx, async (p) => {
      const bag = p.inv.slice(); if (!INV.add(bag, INV.newStack(id, n, ctx.now), ctx.now)) return err('Túi đầy.');
      const r = INV.ledger(p, a.k, -price, 'mua Thương hội'); if (!r.ok) return err(`Ví chợ không đủ ${price / 100} đồng — gửi tiền lên trước.`);
      if (!r.dup) { p.inv = bag; await this.flow('sink', price, ctx.now); }
      return { ok: true, paid: price };
    });
  }
  async op_th_sell(u, a, ctx) {
    return this.mut(u, ctx, async (p) => {
      const st = p.inv[a.i | 0], n = a.n | 0; if (!st || !okN(n, st.n)) return err('bad');
      if (!MK.thBuys(st.id)) return err('Thương hội chỉ thu thành phẩm (gạo, thịt xẻ, vải, da, cá khô, trứng) — không thu đồ ăn chín, không thu rác.');
      const day = vnDay(ctx.now), fac = MK.thFactor(ctx.local ? 0 : await this.active(u, ctx.now)), quota = Math.round(MK.TH_QUOTA * 100 * fac);
      if (!p.th || p.th.day !== day) p.th = { day, xu: 0 };
      const f = INV.freshness(st, ctx.now), unit = Math.round(MK.thBuyPrice(st.id, await this.ref(st.id, ctx.now)) * (0.4 + 0.6 * f)), tot = unit * n;
      if (p.th.xu + tot > quota) return err(`Hạn mức Thương hội hôm nay còn ${Math.max(0, quota - p.th.xu) / 100} đồng (giảm dần khi thành đông người buôn).`);
      INV.take(p.inv, st.id, n, ctx.now); INV.ledger(p, a.k, tot, 'bán Thương hội'); p.th.xu += tot;
      await this.flow('faucet', tot, ctx.now);
      return { ok: true, got: tot };
    });
  }

  // ---------- chợ ký gửi ----------
  async op_mk_board(u, a, ctx) {
    const out = [];
    for (const [, l] of await this.s.list({ prefix: 'mk:' })) {
      if (a.id && l.st.id !== a.id) continue;
      const f = INV.freshness(l.st, ctx.now); if (f <= 0) continue;
      out.push({ id: l.id, item: l.st.id, n: l.st.n, price: l.price, fresh: Math.round(f * 100) / 100, q: l.st.q ?? null, seal: !!l.st.by, mine: l.u === u, name: l.name });
    }
    out.sort((x, y) => x.price - y.price);
    const refs = {}; for (const id of new Set(out.map((x) => x.item))) refs[id] = await this.ref(id, ctx.now);
    return { ok: true, list: out.slice(0, 120), refs };
  }
  async op_mk_post(u, a, ctx) {
    const price = Math.round(Number(a.price) || 0), n = a.n | 0;
    if (price <= 0) return err('Giá không hợp lệ.');
    const mine = [...(await this.s.list({ prefix: 'mk:' })).values()].filter((l) => l.u === u).length;
    if (mine >= 12) return err('Mỗi người ký gửi tối đa 12 tin.');
    let lid = null;
    const r = await this.mut(u, ctx, async (p) => {
      const st = p.inv[a.i | 0]; if (!st || !okN(n, st.n)) return err('bad');
      if (ITEMS[st.id].c === 'waste') return err('Đồ ôi không ký gửi được.');
      const t = INV.take(p.inv, st.id, n, ctx.now); const stack = { ...t.taken[0], n, f0: t.fresh, t0: ctx.now };
      if (t.taken.length > 1) { stack.q = t.q ?? stack.q; }
      lid = await this.id();
      await this.s.put(`mk:${lid}`, { id: lid, u, name: String(ctx.name || '').slice(0, 24), st: stack, price, at: ctx.now });
      return { ok: true, id: lid };
    });
    return r;
  }
  async op_mk_cancel(u, a, ctx) {
    const l = await this.s.get(`mk:${a.id}`); if (!l || l.u !== u) return err('Không có tin này.');
    return this.mut(u, ctx, async (p) => {
      const fee = MK.storeFee(l.at, ctx.now); if (!INV.add(p.inv, l.st, ctx.now)) return err('Túi đầy.');
      INV.ledger(p, null, -Math.min(p.purse, fee), 'phí kho chợ'); await this.flow('sink', Math.min(p.purse, fee), ctx.now);
      await this.s.delete(`mk:${a.id}`); return { ok: true };
    });
  }
  async op_mk_buy(u, a, ctx) {
    const l = await this.s.get(`mk:${a.id}`), n = a.n | 0;
    if (!l) return err('Tin đã bán hết hoặc bị rút.');
    if (l.u === u) return err('Không mua hàng của chính mình.');
    if (!okN(n, l.st.n)) return err('bad');
    const ref = await this.ref(l.st.id, ctx.now), tot = l.price * n;
    const pk = MK.pairKey(u, l.u), plog = (await this.s.get(`pair:${pk}`)) || [];
    const hold = MK.band(l.price, ref, !!l.st.by) === 'hold' || MK.pairTotal(plog, ctx.now) + tot / 100 > MK.PAIR_CAP;
    const buyer = await this.P(u); await this.refresh(u, buyer, ctx.now);
    const bag = buyer.inv.slice(); const st = { ...l.st, n };
    if (!INV.add(bag, st, ctx.now)) return err('Túi đầy.');
    const r = INV.ledger(buyer, a.k, -tot, 'mua chợ'); if (!r.ok) return err(`Ví chợ không đủ ${tot / 100} đồng.`);
    if (r.dup) return { ok: true, dup: true, ...(await this.pub(u, buyer, ctx.now)) };
    buyer.inv = bag; await this.save(u, buyer);
    // người bán: trừ phí ký gửi + phí kho phần đã bán
    const seller = await this.P(l.u), fee = MK.saleFee(tot, 0) + MK.storeFee(l.at, ctx.now) * (n / l.st.n), net = Math.max(0, Math.round(tot - fee));
    if (hold) seller.held = [...(seller.held || []), { k: `${a.id}:${ctx.now}`, xu: net, until: ctx.now + MK.HOLD_MS, flag: 1 }];
    else INV.ledger(seller, `sale:${a.id}:${ctx.now}`, net, 'bán chợ');
    await this.save(l.u, seller); await this.flow('sink', tot - net, ctx.now);
    l.st.n -= n; if (l.st.n <= 0) await this.s.delete(`mk:${a.id}`); else await this.s.put(`mk:${a.id}`, l);
    const hist = (await this.s.get(`hist:${l.st.id}`)) || []; hist.push({ p: l.price, at: ctx.now }); await this.s.put(`hist:${l.st.id}`, hist.slice(-60));
    plog.push({ v: tot, at: ctx.now }); await this.s.put(`pair:${pk}`, plog.slice(-40));
    return { ok: true, paid: tot, hold, ...(await this.pub(u, buyer, ctx.now)) };
  }

  // ---------- sản xuất ----------
  async op_plot_rent(u, a, ctx) { return this.mut(u, ctx, async (p) => { const r = PR.rent(p, a.kind, ctx.now); if (!r.ok) return r; const c = await this.charge(p, r.cost, 'thuê thửa', ctx.now); return c.ok ? r : err(`Thuê thửa ${PLOT.rentWeek} đồng / tuần — ví chợ không đủ.`); }); }
  async op_plot_extend(u, a, ctx) { return this.mut(u, ctx, async (p) => { const c = await this.charge(p, PLOT.rentWeek, 'gia hạn thửa', ctx.now); if (!c.ok) return err('Ví chợ không đủ.'); return PR.extend(p, a.i | 0, ctx.now); }); }
  async op_plant(u, a, ctx) { return this.mut(u, ctx, (p) => PR.plant(p, a.i | 0, String(a.crop || ''), ctx.now)); }
  async op_water(u, a, ctx) { return this.mut(u, ctx, (p) => PR.water(p, a.i | 0, ctx.now)); }
  async op_fert(u, a, ctx) { return this.mut(u, ctx, (p) => PR.fertilize(p, a.i | 0, ctx.now)); }
  async op_harvest(u, a, ctx) { return this.mut(u, ctx, (p) => PR.harvest(p, a.i | 0, ctx.now, { yong: p.yong })); }
  async op_butcher(u, a, ctx) { return this.mut(u, ctx, (p) => PR.butcher(p, a.i | 0, ctx.now)); }
  async op_mill(u, a, ctx) { return this.mut(u, ctx, async (p) => { const bk = p.inv.slice(); const r = PR.mill(p, a.times | 0, ctx.now); if (!r.ok) return r; const c = await this.charge(p, r.cost, 'xay xát', ctx.now); if (!c.ok) { p.inv = bk; return err('Ví chợ không đủ phí xay.'); } return r; }); }
  async op_compost(u, a, ctx) { return this.mut(u, ctx, (p) => PR.compost(p, ctx.now)); }
  async op_fish(u, a, ctx) {
    const w = await this.s.get('wild');
    let wildOut = null;
    const r = await this.mut(u, ctx, (p) => { const x = PR.fish(p, w, a.score, ctx.now, ctx.now); wildOut = x.wild; return x; });
    if (wildOut) await this.s.put('wild', wildOut);
    return r;
  }

  // ---------- bếp & bếp trưởng ----------
  async op_cook(u, a, ctx) { return this.mut(u, ctx, (p) => CU.cook(p, String(a.id || ''), { score: a.score, tc: p.tc, u, now: ctx.now })); }
  async op_eat(u, a, ctx) { return this.mut(u, ctx, (p) => CU.eat(p, a.i | 0, ctx.now)); }
  async op_chef_greet(u, a, ctx) { return this.mut(u, ctx, (p) => CU.greet(p, String(a.chef || ''), vnDay(ctx.now))); }
  async op_chef_join(u, a, ctx) {
    const cid = String(a.chef || ''); if (!CHEFS[cid]) return err('bad');
    const taken = (await this.s.get(`chef:${cid}`)) || 0;
    const r = await this.mut(u, ctx, (p) => CU.apprentice(p, cid, taken));
    if (r.ok) await this.s.put(`chef:${cid}`, taken + 1);
    return r;
  }

  // ---------- mặt bằng & nhà hàng ----------
  async venues() { return [...(await this.s.list({ prefix: 'vn:' })).values()]; }
  pubVenue(v) { return { id: v.id, tier: v.tier, region: v.region, name: v.name, ownerName: v.ownerName, bal: v.bal, open: !!v.open, sealed: !!v.sealed, rep: v.rep, menu: v.menu, stock: INV.view(v.stock || []), log: v.log || [], neg: v.neg || 0 }; }
  async settleVenues(now) {
    const today = vnDay(now); if ((await this.s.get('vnday')) === today) return;
    const all = await this.venues();
    const days = new Set(); for (const v of all) if (!v.sealed) for (const d of VN.pendingDays(v.day, today)) days.add(d);
    for (const d of [...days].sort()) {
      const at = Date.parse(`${d}T05:00:00Z`), sc = new Map(all.map((v) => [v.id, VN.score(v, at)]));
      for (const v of all) {
        if (v.sealed || !VN.pendingDays(v.day, today).includes(d)) continue;
        const others = all.filter((o) => o.id !== v.id && o.region === v.region).reduce((s, o) => s + sc.get(o.id), 0);
        const before = v.bal, rec = VN.settleDay(v, d, others, VN.rainy(d));
        await this.flow('faucet', rec.rev, now); await this.flow('sink', rec.cost, now);
        if (rec.sealed) { const owner = await this.P(v.owner); owner.debt = (owner.debt || 0) + Math.max(0, -v.bal); owner.venue = null; v.bal = 0; await this.save(v.owner, owner); }
        void before;
      }
    }
    for (const v of all) await this.s.put(`vn:${v.id}`, v);
    await this.s.put('vnday', today);
  }
  async op_vn_list(u, a, ctx) {
    await this.settleVenues(ctx.now);
    const all = (await this.venues()).filter((v) => !v.sealed);
    const used = {}; for (const v of all) used[v.tier] = (used[v.tier] || 0) + 1;
    return { ok: true, list: all.map((v) => ({ ...this.pubVenue(v), stock: undefined, log: undefined, mine: v.owner === u })), used, tiers: VENUE_TIERS };
  }
  async op_vn_rent(u, a, ctx) {
    const T = VENUE_TIERS[a.tier], region = REGIONS[a.region] ? a.region : null;
    if (!T || !region) return err('bad');
    if (a.tier === 'diner' && region === 'noido') return err('Nội Thành chỉ cho mở tửu lâu thượng hạng (quán bình dân mở ở Trung Thành / ven sông / mỏ / thôn).');
    if (a.tier === 'fine' && region !== 'noido') return err('Tửu lâu thượng hạng chỉ mở ở Nội Thành.');
    const used = (await this.venues()).filter((v) => !v.sealed && v.tier === a.tier).length;
    if (used >= T.slots) return err(`Đã hết mặt bằng hạng ${T.name} (${T.slots} chỗ).`);
    let vid = null;
    const r = await this.mut(u, ctx, async (p) => {
      if (p.venue) return err('Mỗi người đứng tên tối đa một mặt bằng.');
      const first = T.rent + T.license * 7 + T.deposit * T.rent; // tiền thuê ngày đầu + giấy phép tuần đầu + cọc
      const c = await this.charge(p, first, 'mở mặt bằng', ctx.now); if (!c.ok) return err(`Cần ${first} đồng trong ví chợ (thuê ngày đầu + giấy phép tuần đầu${T.deposit ? ` + cọc ${T.deposit} ngày` : ''}).`);
      vid = await this.id(); p.venue = vid;
      await this.s.put(`vn:${vid}`, { id: vid, tier: a.tier, region, owner: u, ownerName: String(ctx.name || '').slice(0, 24), name: String(a.name || T.name).slice(0, 28), bal: 0, open: false, stock: [], menu: {}, rep: 30, neg: 0, day: vnDay(ctx.now), log: [], since: ctx.now });
      return { ok: true, id: vid };
    });
    return r;
  }
  async myVenue(u, p) { const v = p.venue ? await this.s.get(`vn:${p.venue}`) : null; return v && v.owner === u && !v.sealed ? v : null; }
  async vmut(u, ctx, f) {
    return this.mut(u, ctx, async (p) => { const v = await this.myVenue(u, p); if (!v) return err('Bạn chưa có mặt bằng (hoặc đã bị niêm phong).'); const r = await f(p, v); if (r.ok) await this.s.put(`vn:${v.id}`, v); return r; });
  }
  async op_vn_fund(u, a, ctx) { const xu = Math.round(Number(a.xu) || 0); return this.vmut(u, ctx, (p, v) => { if (xu <= 0) return err('bad'); const r = INV.ledger(p, a.k, -xu, 'góp vốn tiệm'); if (!r.ok) return r; if (!r.dup) v.bal += xu; return { ok: true }; }); }
  async op_vn_take(u, a, ctx) { const xu = Math.round(Number(a.xu) || 0); return this.vmut(u, ctx, (p, v) => { if (xu <= 0 || xu > v.bal) return err('Ví tiệm không đủ (chỉ rút được khi ví tiệm dương).'); v.bal -= xu; INV.ledger(p, a.k, xu, 'rút lãi tiệm'); return { ok: true }; }); }
  async op_vn_stock(u, a, ctx) {
    return this.vmut(u, ctx, (p, v) => {
      const st = p.inv[a.i | 0], n = a.n | 0; if (!st || !okN(n, st.n)) return err('bad');
      const d = ITEMS[st.id]; if (d.c !== 'dish') return err('Tiệm chỉ bày món đã nấu.');
      if (!VENUE_TIERS[v.tier].tiers.includes(d.tier)) return err(`${VENUE_TIERS[v.tier].name} không bán món hạng ${d.tier}.`);
      const t = INV.take(p.inv, st.id, n, ctx.now); for (const x of t.taken) v.stock.push(x); v.stock = INV.merge(v.stock, ctx.now);
      if (!v.menu[st.id]) v.menu[st.id] = Math.round(d.b * 100 * (st.by ? 1.3 : 1));
      return { ok: true };
    });
  }
  async op_vn_unstock(u, a, ctx) { return this.vmut(u, ctx, (p, v) => { const st = v.stock[a.i | 0]; if (!st) return err('bad'); if (!INV.add(p.inv, st, ctx.now)) return err('Túi đầy.'); v.stock.splice(a.i | 0, 1); return { ok: true }; }); }
  async op_vn_menu(u, a, ctx) { return this.vmut(u, ctx, (p, v) => { const id = String(a.id || ''), price = Math.round(Number(a.price) || 0); if (!ITEMS[id] || ITEMS[id].c !== 'dish' || price < 0) return err('bad'); if (price) v.menu[id] = price; else delete v.menu[id]; return { ok: true }; }); }
  async op_vn_open(u, a, ctx) { return this.vmut(u, ctx, (p, v) => { v.open = !!a.on; return { ok: true, open: v.open }; }); }
  async op_vn_close(u, a, ctx) {
    return this.mut(u, ctx, async (p) => {
      const v = await this.myVenue(u, p); if (!v) return err('bad');
      for (const st of v.stock) INV.add(p.inv, st, ctx.now);
      if (v.bal > 0) INV.ledger(p, null, v.bal, 'đóng tiệm'); else p.debt = (p.debt || 0) + Math.max(0, -v.bal);
      await this.s.delete(`vn:${v.id}`); p.venue = null; return { ok: true };
    });
  }
  /** người chơi mua món tại tiệm người khác — trong biên độ giao dịch giữa người chơi */
  async op_vn_buy(u, a, ctx) {
    const v = await this.s.get(`vn:${a.vid}`), id = String(a.id || ''), n = a.n | 0;
    if (!v || v.sealed || !v.open) return err('Tiệm đang đóng.');
    if (v.owner === u) return err('Món của tiệm mình thì lấy từ kho tiệm.');
    if (!okN(n, 20) || !v.menu[id]) return err('Tiệm không bán món này.');
    const ref = await this.ref(id, ctx.now), price = v.menu[id];
    if (MK.band(price, ref, true) === 'hold') return err('Giá món vượt biên độ giao dịch giữa người chơi.');
    if (INV.count(v.stock, id, ctx.now, 0.01) < n) return err('Tiệm hết món này.');
    const r = await this.mut(u, ctx, async (p) => {
      const pay = INV.ledger(p, a.k, -price * n, 'ăn tiệm'); if (!pay.ok) return err(`Ví chợ không đủ ${price * n / 100} đồng.`);
      if (pay.dup) return { ok: true, dup: true };
      const t = INV.take(v.stock, id, n, ctx.now, 0.01); for (const x of t.taken) INV.add(p.inv, x, ctx.now);
      v.bal += price * n; return { ok: true, paid: price * n };
    });
    if (r.ok && !r.dup) await this.s.put(`vn:${v.id}`, v);
    return r;
  }

  // ---------- hộ tịch ----------
  pubMarriage(m, u) { const o = m.a === u ? m.b : m.a; return { id: m.id, other: o, otherName: m.names?.[o] || '', tier: m.tier, tierName: CV.TIERS[m.tier].name, since: m.since, fund: m.fund, mine: m.by[u] || 0, status: m.status, div: m.div, title: CV.TIERS[m.tier].title || null, buffUntil: m.since + CV.TIERS[m.tier].buffDays * CV.D }; }
  async op_cv_propose(u, a, ctx) {
    const to = String(a.to || ''); if (!to || to === u) return err('Hãy chọn một người chơi khác.');
    const me = await this.P(u), b1 = CV.blocker(me, ctx.now); if (b1) return err(`Bạn ${b1}.`);
    const tp = await this.P(to), b2 = CV.blocker(tp, ctx.now); if (b2) return err(`Người ấy ${b2}.`);
    const list = ((await this.s.get(`prop:${to}`)) || []).filter((x) => ctx.now - x.at < CV.PROPOSAL_MS && x.from !== u);
    list.push({ from: u, name: String(ctx.name || '').slice(0, 24), phrase: CV.PHRASES[(a.phrase | 0) % CV.PHRASES.length], tier: CV.TIERS[a.tier] ? a.tier : 'hanvi', at: ctx.now });
    await this.s.put(`prop:${to}`, list.slice(-5));
    return { ok: true };
  }
  async op_cv_answer(u, a, ctx) {
    const list = (await this.s.get(`prop:${u}`)) || [], i = list.findIndex((x) => x.from === a.from);
    if (i < 0) return err('Lời cầu hôn đã hết hạn.');
    const pr = list[i]; list.splice(i, 1); await this.s.put(`prop:${u}`, list);
    if (!a.yes) return { ok: true, declined: true };
    const A = await this.P(pr.from), B = await this.P(u);
    const b = CV.blocker(A, ctx.now) || CV.blocker(B, ctx.now); if (b) return err(`Không thể kết hôn: ${b}.`);
    const assets = ((A.purse || 0) + (B.purse || 0)) / 100, fee = CV.cost(pr.tier, assets);
    // người cầu hôn trả lễ; không đủ thì người nhận lời trả phần còn lại
    const fromA = Math.min(A.purse, fee * 100), fromB = fee * 100 - fromA;
    if (fromB > B.purse) return err(`Lễ ${CV.TIERS[pr.tier].name} cần ${fee} đồng trong ví chợ của hai người.`);
    INV.ledger(A, null, -fromA, 'lễ cưới'); INV.ledger(B, null, -fromB, 'lễ cưới'); await this.flow('sink', fee * 100, ctx.now);
    const mid = await this.id(), m = CV.newMarriage(mid, pr.from, u, pr.tier, ctx.now); m.names = { [pr.from]: pr.name, [u]: String(ctx.name || '').slice(0, 24) };
    for (const [uu, P] of [[pr.from, A], [u, B]]) { const c = CV.civOf(P); c.mid = mid; c.wed = [...(c.wed || []), ctx.now].slice(-5); await this.save(uu, P); }
    await this.s.put(`m:${mid}`, m);
    return { ok: true, married: this.pubMarriage(m, u), fee };
  }
  async marriageOf(u) { const p = await this.P(u), m = p.civ?.mid ? await this.s.get(`m:${p.civ.mid}`) : null; return { p, m }; }
  async op_cv_view(u, a, ctx) {
    const { p, m } = await this.marriageOf(u); if (!m) return { ok: true, marriage: null, props: (await this.s.get(`prop:${u}`)) || [] };
    CV.upkeep(m, vnDay(ctx.now));
    const split = CV.finalize(m, ctx.now);
    if (split) {
      for (const [uu, xu] of Object.entries(split)) { const P = uu === u ? p : await this.P(uu); INV.ledger(P, `div:${m.id}`, xu, 'chia quỹ chung'); const c = CV.civOf(P); c.mid = null; c.last = ctx.now; await this.save(uu, P); }
      await this.s.put(`m:${m.id}`, m); return { ok: true, marriage: null, dissolved: split[u] || 0 };
    }
    await this.s.put(`m:${m.id}`, m);
    return { ok: true, marriage: this.pubMarriage(m, u), props: (await this.s.get(`prop:${u}`)) || [] };
  }
  async op_cv_fund(u, a, ctx) {
    const xu = Math.round(Number(a.xu) || 0); const { p, m } = await this.marriageOf(u); if (!m || xu <= 0) return err('bad');
    const r = INV.ledger(p, a.k, -xu, 'góp quỹ chung'); if (!r.ok) return r;
    if (!r.dup) { const c = CV.contribute(m, u, xu); if (!c.ok) { INV.ledger(p, null, xu, 'hoàn'); return c; } }
    await this.save(u, p); await this.s.put(`m:${m.id}`, m); return { ok: true, marriage: this.pubMarriage(m, u), purse: p.purse };
  }
  async op_cv_take(u, a, ctx) {
    const xu = Math.round(Number(a.xu) || 0); const { p, m } = await this.marriageOf(u); if (!m || xu <= 0) return err('bad');
    if (m.status !== 'REGISTERED') return err('Đang ly hôn — quỹ chung bị khoá chờ chia.');
    const w = CV.withdraw(m, xu); if (!w.ok) return w;
    INV.ledger(p, a.k, xu, 'rút quỹ chung'); await this.save(u, p); await this.s.put(`m:${m.id}`, m);
    return { ok: true, marriage: this.pubMarriage(m, u), purse: p.purse };
  }
  async op_cv_divorce(u, a, ctx) {
    const { p, m } = await this.marriageOf(u); if (!m) return err('Bạn chưa có hôn thú.');
    const mutual = !!(m.agree && m.agree.u !== u && ctx.now - m.agree.at < 3 * CV.D);
    const r = CV.fileDivorce(m, u, mutual, ctx.now); if (!r.ok) return r;
    const c = INV.ledger(p, a.k, -r.fee, 'án phí ly hôn'); if (!c.ok) { m.status = 'REGISTERED'; m.div = null; return err(`Án phí ${r.fee / 100} đồng — ví chợ không đủ.`); }
    await this.flow('sink', r.fee, ctx.now); await this.save(u, p); await this.s.put(`m:${m.id}`, m);
    return { ok: true, mutual, until: r.until, fee: r.fee };
  }
  /** bên kia bấm «thuận tình» trước → đơn sau được tính thuận tình */
  async op_cv_agree(u, a, ctx) { const { m } = await this.marriageOf(u); if (!m) return err('bad'); m.agree = { u, at: ctx.now }; await this.s.put(`m:${m.id}`, m); return { ok: true }; }
  async op_cv_withdraw(u, a, ctx) { const { m } = await this.marriageOf(u); if (!m) return err('bad'); const r = CV.withdrawDivorce(m, u); if (r.ok) await this.s.put(`m:${m.id}`, m); return r; }

  // ---------- thầy mệnh lý ----------
  async op_dv_exam(u, a, ctx) {
    const r = DV.exam(Array.isArray(a.texts) ? a.texts.map((t) => String(t).slice(0, DV.LEN[1])) : []);
    const prof = (await this.s.get(`dv:${u}`)) || { u, rep: 50, fee: 0, active: false, sigs: [], strikes: [], day: '', today: 0 };
    prof.exam = r.pass ? ctx.now : prof.exam || 0; prof.name = String(ctx.name || '').slice(0, 24);
    await this.s.put(`dv:${u}`, prof);
    return { ok: true, ...r };
  }
  async op_dv_register(u, a, ctx) {
    const prof = await this.s.get(`dv:${u}`); if (!prof?.exam) return err('Chưa qua bài sát hạch (luận 3 lá số mẫu).');
    if ((a.level | 0) < 10 && (a.realm | 0) < 2) return err('Cần cấp 10 hoặc cảnh giới Trúc Cơ.');
    if (prof.ban && prof.ban > ctx.now) return err('Đang bị treo nghề.');
    const R = DV.rankOf(prof.rep), fee = Math.round(Number(a.fee) || 0);
    if (fee < DV.MIN_FEE || fee > R.max) return err(`Giá mỗi quẻ ${DV.MIN_FEE}–${R.max} đồng (bậc ${R.name}).`);
    const p = await this.P(u);
    if (!prof.deposit) { const c = INV.ledger(p, a.k, -DV.DEPOSIT * 100, 'ký quỹ thầy'); if (!c.ok) return err(`Cần ký quỹ ${DV.DEPOSIT} đồng (2 lượng) trong ví chợ.`); prof.deposit = DV.DEPOSIT * 100; await this.save(u, p); }
    prof.fee = fee; prof.active = a.active !== false; prof.name = String(ctx.name || prof.name || '').slice(0, 24);
    await this.s.put(`dv:${u}`, prof);
    return { ok: true, fee, rank: R.name, purse: p.purse };
  }
  async op_dv_list(u, a, ctx) {
    const out = [];
    for (const [, d] of await this.s.list({ prefix: 'dv:' })) if (d.active && d.fee && !(d.ban > ctx.now)) out.push({ u: d.u, name: d.name, fee: d.fee, rep: d.rep, rank: DV.rankOf(d.rep).name, me: d.u === u });
    return { ok: true, list: out.sort((x, y) => y.rep - x.rep) };
  }
  async op_dv_book(u, a, ctx) {
    if (!a.consent) return err('Cần đồng ý chia sẻ hồ sơ rút gọn + tứ trụ.');
    const to = String(a.to || ''); if (to === u) return err('Không tự xem cho chính mình.');
    const d = await this.s.get(`dv:${to}`); if (!d?.active || !d.fee) return err('Thầy này không nhận khách.');
    const day = vnDay(ctx.now); if (d.day !== day) { d.day = day; d.today = 0; }
    if (d.today >= DV.PER_DAY) return err('Thầy đã đủ 10 lượt hôm nay.');
    const pk = `dvp:${MK.pairKey(u, to)}`, last = await this.s.get(pk);
    if (last && ctx.now - last < DV.PAIR_MS) return err('Mỗi cặp khách – thầy chỉ một lượt mỗi 7 ngày.');
    const ban = await this.s.get(`dvban:${MK.pairKey(u, to)}`); if (ban) return err('Hai tài khoản có quan hệ giao dịch dày — không xem cho nhau được.');
    const plog = (await this.s.get(`pair:${MK.pairKey(u, to)}`)) || []; if (plog.filter((x) => ctx.now - x.at < 30 * CV.D).length > 3) { await this.s.put(`dvban:${MK.pairKey(u, to)}`, ctx.now); return err('Hai tài khoản có quan hệ giao dịch dày — không xem cho nhau được.'); }
    const p = await this.P(u), fee = d.fee * 100, r = INV.ledger(p, a.k, -fee, 'đặt quẻ'); if (!r.ok) return err(`Ví chợ không đủ ${d.fee} đồng.`);
    if (r.dup) return { ok: true, dup: true };
    const id = await this.id();
    await this.s.put(`bk:${id}`, { id, c: u, cName: String(ctx.name || '').slice(0, 24), t: to, fee, q: String(a.q || '').slice(0, DV.Q_MAX), profile: DV.cleanProfile(a.profile), paid: ctx.now, due: ctx.now + DV.DUE_MS, status: 'paid' });
    await this.s.put(pk, ctx.now); d.today += 1; await this.s.put(`dv:${to}`, d); await this.save(u, p);
    return { ok: true, id, purse: p.purse };
  }
  async op_dv_mine(u, a, ctx) {
    await this.sweepDiv(ctx.now);
    const asC = [], asT = [];
    for (const [, b] of await this.s.list({ prefix: 'bk:' })) {
      const pub = { id: b.id, fee: b.fee, q: b.q, status: b.status, due: b.due, text: b.text || null, happy: b.happy ?? null, verdict: b.verdict || null, paid: b.paid };
      if (b.c === u) asC.push({ ...pub, thay: (await this.s.get(`dv:${b.t}`))?.name || '' });
      if (b.t === u && b.status !== 'settled') asT.push({ ...pub, profile: b.status === 'paid' ? b.profile : null });
    }
    return { ok: true, asC: asC.slice(-20), asT, prof: (await this.s.get(`dv:${u}`)) ? this.pubDiv(await this.s.get(`dv:${u}`)) : null };
  }
  pubDiv(d) { return { fee: d.fee, rep: d.rep, rank: DV.rankOf(d.rep).name, active: !!d.active, exam: !!d.exam, deposit: d.deposit || 0, ban: d.ban || 0 }; }
  async op_dv_deliver(u, a, ctx) {
    const b = await this.s.get(`bk:${a.id}`); if (!b || b.t !== u || b.status !== 'paid') return err('Không có lượt xem đang chờ.');
    if (ctx.now > b.due) return err('Đã quá hạn 24 giờ.');
    const d = await this.s.get(`dv:${u}`), text = String(a.text || '').slice(0, DV.LEN[1]);
    const l0 = DV.layer0(text, b.profile, d.sigs || []);
    if (l0.flags.includes('SHORT')) return err(`Lời luận cần ${DV.LEN[0]}–${DV.LEN[1]} ký tự.`);
    let l1 = null;
    if (this.judge && l0.pass) { try { l1 = DV.parseJudge(await this.judge(DV.judgePrompt(b.profile, b.q, text, l0))); } catch (e) { l1 = null; } }
    b.text = text; b.status = 'done'; b.done = ctx.now; b.l0 = { pass: l0.pass, score: l0.score, flags: l0.flags }; b.l1 = l1;
    d.sigs = [...(d.sigs || []), l0.sig].slice(-50); await this.s.put(`dv:${u}`, d);
    await this.s.put(`bk:${b.id}`, b);
    return { ok: true, l0: b.l0, l1 };
  }
  async op_dv_rate(u, a, ctx) {
    const b = await this.s.get(`bk:${a.id}`); if (!b || b.c !== u || b.status !== 'done') return err('Chưa có lời luận để đánh giá.');
    b.happy = !!a.happy; b.reason = String(a.reason || '').slice(0, 200); await this.s.put(`bk:${b.id}`, b);
    await this.sweepDiv(ctx.now);
    return { ok: true };
  }
  /** xử lý các lượt xem quá hạn / đủ điều kiện giải ngân */
  async sweepDiv(now) {
    for (const [k, b] of await this.s.list({ prefix: 'bk:' })) {
      let ch = false;
      if (b.status === 'paid' && now > b.due) { await this.payTo(b.c, b.fee, `dvr:${b.id}`); await this.repDelta(b.t, -5); b.status = 'settled'; b.verdict = 'Quá hạn — hoàn tiền khách'; ch = true; }
      if (b.status === 'done' && b.happy == null && now > b.done + DV.DUE_MS) { b.happy = true; ch = true; }
      if (b.status === 'done' && b.happy != null && now >= b.paid + DV.HOLD_MS) {
        const judge = { pass: !!b.l0?.pass && !(b.l1 && (b.l1.manipulation || b.l1.spam || b.l1.real)), logic: b.l1?.logic ?? b.l0?.score ?? 0 };
        const dec = DV.decide(b.happy, judge);
        if (dec.flag || b.l1?.decision === 'FLAG_FOR_REVIEW' && b.happy) { b.status = 'review'; b.reviewAt = now; b.verdict = 'Chờ admin duyệt'; }
        else {
          const d = (await this.s.get(`dv:${b.t}`)) || { rep: 50 }, tax = DV.rankOf(d.rep).tax;
          if (dec.payout) { const pay = Math.round(b.fee * dec.payout * (1 - tax)); await this.payTo(b.t, pay, `dvp:${b.id}`); await this.flow('sink', Math.round(b.fee * dec.payout * tax), now); }
          if (dec.refund) await this.payTo(b.c, Math.round(b.fee * dec.refund), `dvr:${b.id}`);
          await this.repDelta(b.t, dec.rep, dec.strike, now);
          b.status = 'settled'; b.verdict = dec.payout === 1 ? 'Giải ngân cho thầy' : dec.payout ? 'Thầy nhận 70%, hoàn khách 30%' : 'Hoàn tiền khách';
        }
        ch = true;
      }
      if (b.status === 'review' && now > b.reviewAt + DV.REVIEW_MS) { await this.payTo(b.c, b.fee, `dvr:${b.id}`); b.status = 'settled'; b.verdict = 'Quá 72 giờ không duyệt — hoàn khách'; ch = true; }
      if (b.status === 'settled' && b.profile && now > b.paid + DV.KEEP_PROFILE) { b.profile = null; b.q = ''; ch = true; }
      if (ch) await this.s.put(k, b);
    }
  }
  async payTo(u, xu, key) { const p = await this.P(u); INV.ledger(p, key, xu, 'két'); await this.save(u, p); }
  async repDelta(u, d, strike = false, now = Date.now()) {
    const x = await this.s.get(`dv:${u}`); if (!x) return;
    x.rep = Math.max(0, Math.min(100, (x.rep || 50) + d));
    if (strike) { x.strikes = [...(x.strikes || []), now].filter((t) => now - t < 30 * CV.D); if (x.strikes.length >= 3) { x.ban = now + 14 * CV.D; x.deposit = 0; x.active = false; } }
    await this.s.put(`dv:${u}`, x);
  }
  /** admin: hàng đợi duyệt + quyết định */
  async op_dv_review(u, a, ctx) {
    if (!ctx.admin) return err('forbidden');
    if (a.id) {
      const b = await this.s.get(`bk:${a.id}`); if (!b || b.status !== 'review') return err('bad');
      if (a.fraud) { await this.payTo(b.c, b.fee, `dvr:${b.id}`); await this.repDelta(b.t, -10, true, ctx.now); b.verdict = 'Admin: gian lận — hoàn khách, phạt thầy'; }
      else { const d = (await this.s.get(`dv:${b.t}`)) || { rep: 50 }; await this.payTo(b.t, Math.round(b.fee * (1 - DV.rankOf(d.rep).tax)), `dvp:${b.id}`); b.verdict = 'Admin: hợp lệ — giải ngân'; }
      b.status = 'settled'; await this.s.put(`bk:${b.id}`, b); return { ok: true };
    }
    const q = []; for (const [, b] of await this.s.list({ prefix: 'bk:' })) if (b.status === 'review') q.push({ id: b.id, fee: b.fee, q: b.q, text: b.text, l0: b.l0, l1: b.l1, happy: b.happy });
    return { ok: true, queue: q };
  }

  // ---------- bảng admin: dòng tiền & giá tham chiếu (§20.3) ----------
  async op_stats(u, a, ctx) {
    if (!ctx.admin && !ctx.local) return err('forbidden');
    const flows = []; for (const [k, f] of await this.s.list({ prefix: 'flow:' })) flows.push({ day: k.slice(5), ...f, ratio: f.faucet ? Math.round((f.sink / f.faucet) * 100) : null });
    const refs = {}; for (const id of ['gao', 'thit_ga', 'thit_lon', 'thit_bo', 'ca', 'rau', 'vai', 'ca_kho', 'trung', 'da']) refs[id] = { ref: await this.ref(id, ctx.now), base: MK.baseXu(id) };
    const vs = await this.venues(), purses = []; for (const [, p] of await this.s.list({ prefix: 'p:' })) purses.push(p.purse || 0);
    return { ok: true, flows: flows.slice(-14), refs, venues: { open: vs.filter((v) => !v.sealed && v.open).length, sealed: vs.filter((v) => v.sealed).length, total: vs.length }, money: purses.reduce((s, x) => s + x, 0), players: purses.length, active: await this.active('_admin', ctx.now) };
  }
}
