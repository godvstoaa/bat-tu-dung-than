// ============================================================================
//  SỔ VIỆC LÀM (thuần JS, chạy được cả trong worker) — chỗ làm có hạn, ca làm, chấm lương, sổ tiền công.
//  worker/guild.js bọc lớp này trong Durable Object `Guild` (một bản toàn cục, như Estate); test chạy với
//  MemStore (scripts/test-game-jobs.mjs). Client chỉ gửi hành động + điểm mini-game; MÁY CHỦ tính tiền.
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §3.3, §4, §5, §9.
//
//  Lưu trữ (khoá → giá trị, API giống ctx.storage của DO):
//   c:<u>      hồ sơ nghề { skill:{job:xp}, rep, fines, shifts, flags, yong, yongAt, day, dayShifts }
//   k:<k>      người giữ chỗ ở tiệm k: [{ r, i, u, n, since, until, last }]
//   own:<u>    hợp đồng đang giữ { k, r, i, since, until, last }   (mỗi người tối đa một chỗ)
//   s:<u>      ca đang làm { id, job, k, at, start, until, n, purse (phần nghìn văn), chain, durs, scores, task, … }
//   l:<u>:<id> sổ tiền công { amt, job, n, quit, at, claimed }
//   ore        mạch quặng mỏ dân sự { id: [số lần còn, mốc tính hồi] }
// ============================================================================
import { cityShops } from './shops.js';
import { GUA } from './batquai.js';
import { slotOrigin, shopSize } from './roomgrid.js';
import { ROOM_X0 } from './terrain.js';
import * as J from './jobs.js';
import { inZone, open as zoneOpen } from './jobzones.js';

// --- Mỏ Dân Sự Khoáng Sơn (dải nội thất phía Đông, cạnh mỏ khổ sai) ---------------------------------
export const CMINE = { key: 'job:mine', name: 'Mỏ Dân Sự Khoáng Sơn', x: ROOM_X0 + 505, z: 340, w: 56, d: 44 };
export const ORE = { charges: 3, regenMs: 4 * 60000, reach: 3.4 };
export const ORE_NODES = Array.from({ length: 10 }, (_, i) => {
  const col = i % 5, row = Math.floor(i / 5);
  return { id: `c${i}`, x: CMINE.x - 20 + col * 10 + (row ? 4 : 0), z: CMINE.z - 12 + row * 11 + ((col % 2) ? 2 : -1) };
});
export const cmineSpawn = () => ({ x: CMINE.x, z: CMINE.z + CMINE.d / 2 - 5 });
export const inCMine = (p) => !!p && Math.abs(p.x - CMINE.x) <= CMINE.w / 2 + 1 && Math.abs(p.z - CMINE.z) <= CMINE.d / 2 + 1;

// --- chỗ làm: tiệm tuyển người + phòng nội thất + vị trí ngoài phố ----------------------------------------
const WX_OF = Object.fromEntries(GUA.map((g) => [g.id, g.wx]));
let WP = null;
/** Map k → { k, type, job, name, owner, g, wx, room:{x,z,w,d}, city:{x,z}|null } cho mọi tiệm tuyển người và Lò Rèn */
export function workplaces() {
  if (WP) return WP;
  WP = new Map();
  for (const s of cityShops()) {
    const job = J.JOB_OF_SHOP[s.type] || null;
    if (!job && s.type !== J.MINE_SHOP) continue;
    const [w, d] = shopSize(s.type), o = slotOrigin(s.k);
    WP.set(s.k, { k: s.k, type: s.type, job, name: s.name, owner: s.owner, g: s.g, wx: WX_OF[s.g], room: { x: o.x, z: o.z, w, d }, city: s.house ? { x: s.house.x, z: s.house.z } : null });
  }
  return WP;
}
export const workplace = (k) => workplaces().get(k) || null;
export const inRoom = (k, p) => { const w = workplace(k); return !!(w && p && Math.abs(p.x - w.room.x) <= w.room.w / 2 + 1 && Math.abs(p.z - w.room.z) <= w.room.d / 2 + 1); };
/** 8 dịch trạm theo vòng (góc quanh tâm thành) — phu áp hàng sang trạm kế bên */
let RING = null;
export function postRing() {
  if (RING) return RING;
  RING = [...workplaces().values()].filter((w) => w.type === 'dichtram' && w.city).sort((a, b) => Math.atan2(a.city.z, a.city.x) - Math.atan2(b.city.z, b.city.x)).map((w) => w.k);
  return RING;
}
export function nextPost(k, dir) { const r = postRing(), i = r.indexOf(k); return i < 0 ? r[0] : r[(i + (dir > 0 ? 1 : r.length - 1)) % r.length]; }
export function postDist(a, b) { const A = workplace(a)?.city, B = workplace(b)?.city; return A && B ? Math.hypot(A.x - B.x, A.z - B.z) : 0; }

// --- bộ nhớ trong RAM (test) cùng API với ctx.storage của Durable Object ------------------------------------
export class MemStore {
  constructor() { this.m = new Map(); }
  async get(k) { const v = this.m.get(k); return v === undefined ? undefined : structuredClone(v); }
  async put(k, v) { if (typeof k === 'object') { for (const [a, b] of Object.entries(k)) this.m.set(a, structuredClone(b)); } else this.m.set(k, structuredClone(v)); }
  async delete(k) { for (const x of Array.isArray(k) ? k : [k]) this.m.delete(x); }
  async list({ prefix = '' } = {}) { return new Map([...this.m].filter(([k]) => k.startsWith(prefix)).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => [k, structuredClone(v)])); }
}

const okYong = (y) => !!(y && typeof y === 'object' && ['木', '火', '土', '金', '水'].includes(y.primary));
const cleanYong = (y) => (okYong(y) ? { primary: y.primary, accent: ['木', '火', '土', '金', '水'].includes(y.accent) ? y.accent : null, ji: ['木', '火', '土', '金', '水'].includes(y.ji) ? y.ji : null } : null);
const sameYong = (a, b) => !!a && !!b && a.primary === b.primary && a.accent === b.accent && a.ji === b.ji;
export const YONG_LOCK_MS = 30 * 86400000; // đổi Dụng thần khai báo tối đa 1 lần / 30 ngày (§1.3)
const rid = (rand) => Math.floor(rand() * 1e9).toString(36).padStart(6, '0');

export const LAYOUT_VER = 5; // v5 (THANH-MANIFEST): lô chia lại theo ô chu vi + sân trong → chỉ số tiệm k đổi lần nữa
export class GuildEngine {
  /** store: { get, put, delete, list } — ctx.storage của DO hoặc MemStore */
  constructor(store) { this.s = store; }
  /**
   * v4 (thành ×10): chỉ số tiệm k đổi (8.100 tiệm mới) → bỏ mọi chỗ giữ / hợp đồng theo k cũ một lần (tay nghề, uy tín, Dụng
   * thần GIỮ NGUYÊN). Người đang giữ chỗ chỉ cần nhận lại chỗ ở tiệm mới. Gọi một lần lúc DO khởi động (worker/guild.js).
   */
  async migrate() {
    if ((await this.s.get('layoutVer')) === LAYOUT_VER) return false;
    for (const pre of ['k:', 'own:']) { const m = await this.s.list({ prefix: pre }); const keys = [...m.keys()]; for (let i = 0; i < keys.length; i += 128) await this.s.delete(keys.slice(i, i + 128)); }
    await this.s.put('layoutVer', LAYOUT_VER);
    return true;
  }

  // ---------- hồ sơ nghề ----------
  async career(u) {
    const c = (await this.s.get(`c:${u}`)) || {};
    return { skill: {}, rep: 50, fines: 0, shifts: 0, flags: 0, yong: null, yongAt: 0, day: '', dayShifts: 0, ...c };
  }
  /** Dụng thần khai báo: lần đầu nhận ngay; đổi sau đó tối đa 1 lần / 30 ngày (không «đổi mệnh» lấy lợi) */
  setYong(c, y, now) {
    const v = cleanYong(y);
    if (!v || sameYong(v, c.yong)) return false;
    if (c.yong && now - (c.yongAt || 0) < YONG_LOCK_MS) return 'locked';
    c.yong = v; c.yongAt = now; return true;
  }
  relOf(c, job) { return J.relation(J.WORK[job].wx, c.yong); }
  pubCareer(c, job) {
    const out = { rep: c.rep, shifts: c.shifts, fines: c.fines, skill: {}, rank: {}, yong: !!c.yong };
    for (const id of Object.keys(J.WORK)) { const sk = Math.floor(c.skill[id] || 0); out.skill[id] = sk; out.rank[id] = J.rankOf(sk, c.rep, this.relOf(c, id)); }
    if (job) out.rel = this.relOf(c, job);
    return out;
  }

  // ---------- chỗ làm ----------
  /** người giữ chỗ ở tiệm k (dọn chỗ hết hạn / bỏ không quá 24 giờ — người bỏ không bị trừ uy tín) */
  async seats(k, now) {
    const list = (await this.s.get(`k:${k}`)) || [];
    const keep = [], gone = [];
    for (const h of list) (now > h.until || now - Math.max(h.since, h.last || 0) > J.SHIFT.idleMs ? gone : keep).push(h);
    if (gone.length) {
      await this.s.put(`k:${k}`, keep);
      for (const h of gone) {
        const own = await this.s.get(`own:${h.u}`);
        if (own && own.k === k) await this.s.delete(`own:${h.u}`);
        if (now - Math.max(h.since, h.last || 0) > J.SHIFT.idleMs && now <= h.until) { const c = await this.career(h.u); c.rep = Math.max(0, c.rep + J.SHIFT.idleRep); await this.s.put(`c:${h.u}`, c); }
      }
    }
    return keep;
  }
  async contract(u, now) {
    const own = await this.s.get(`own:${u}`);
    if (!own) return null;
    const list = await this.seats(own.k, now);
    const h = list.find((x) => x.u === u);
    if (!h) { await this.s.delete(`own:${u}`); return null; }
    return { k: own.k, r: h.r, i: h.i, since: h.since, until: h.until, last: h.last || 0 };
  }

  /** bảng Chiêu công của tiệm k */
  async board(k, u, now) {
    const w = workplace(k);
    if (!w || !w.job) return { ok: false, err: 'bad' };
    const list = await this.seats(k, now), c = await this.career(u);
    return {
      ok: true, k, job: w.job, layout: J.SEATS[w.type],
      holders: list.map((h) => [h.r, h.i, h.n, h.u === u ? 1 : 0]),
      contract: await this.contract(u, now), career: this.pubCareer(c, w.job), shift: await this.pubShiftOf(u, now),
    };
  }

  async apply(u, name, k, rank, yong, now) {
    const w = workplace(k);
    if (!w || !w.job || !Number.isInteger(rank) || rank < 0 || rank > 3 || !(J.SEATS[w.type][rank] > 0)) return { ok: false, err: 'bad' };
    const cur = await this.contract(u, now);
    if (cur) return cur.k === k ? { ok: true, contract: cur } : { ok: false, err: 'have', contract: cur };
    const c = await this.career(u);
    const yl = this.setYong(c, yong, now);
    const rel = this.relOf(c, w.job), may = J.rankOf(c.skill[w.job] || 0, c.rep, rel);
    if (rank > may) { if (yl === true) await this.s.put(`c:${u}`, c); return { ok: false, err: 'rank', may }; }
    const list = await this.seats(k, now);
    const taken = new Set(list.filter((h) => h.r === rank).map((h) => h.i));
    let i = 0; while (taken.has(i)) i++;
    if (i >= J.SEATS[w.type][rank]) return { ok: false, err: 'full' };
    const h = { r: rank, i, u, n: String(name || 'Khách').slice(0, 24), since: now, until: now + J.SHIFT.holdMs, last: 0 };
    list.push(h);
    await this.s.put({ [`k:${k}`]: list, [`own:${u}`]: { k, r: rank, i, since: now, until: h.until, last: 0 }, [`c:${u}`]: c });
    return { ok: true, contract: { k, r: rank, i, since: now, until: h.until, last: 0 } };
  }

  /** gia hạn thêm 3 ngày — chỉ khi đã vào ca trong 24 giờ qua */
  async renew(u, now) {
    const cur = await this.contract(u, now);
    if (!cur) return { ok: false, err: 'none' };
    if (now - (cur.last || 0) > J.SHIFT.idleMs) return { ok: false, err: 'idle' };
    const list = await this.seats(cur.k, now), h = list.find((x) => x.u === u);
    h.until = now + J.SHIFT.holdMs;
    await this.s.put({ [`k:${cur.k}`]: list, [`own:${u}`]: { ...cur, until: h.until } });
    return { ok: true, contract: { ...cur, until: h.until } };
  }

  async quit(u, now) {
    const sh = await this.s.get(`s:${u}`);
    const ended = sh && J.WORK[sh.job].shop ? await this.end(u, now) : null;
    const cur = await this.contract(u, now);
    if (!cur) return { ok: true, ended };
    const list = (await this.seats(cur.k, now)).filter((x) => x.u !== u);
    await this.s.put(`k:${cur.k}`, list);
    await this.s.delete(`own:${u}`);
    return { ok: true, ended };
  }

  // ---------- ca làm ----------
  pubTask(sh) { const t = sh.task; return t ? { seed: t.seed, from: t.from ?? null, dest: t.dest ?? null, minMs: t.minMs } : null; }
  pubShift(sh) { return { id: sh.id, job: sh.job, k: sh.k, start: sh.start, until: sh.until, n: sh.n, max: J.SHIFT.tasks, purse: Math.floor(sh.purse / 1000), rank: sh.rank, rel: sh.rel, palace: sh.palace, task: this.pubTask(sh) }; }
  async pubShiftOf(u, now) { const sh = await this.liveShift(u, now); return sh ? this.pubShift(sh) : null; }
  /** ca đang chạy (hết giờ thì tự tan ca, ghi sổ để nhận sau) */
  async liveShift(u, now) {
    const sh = await this.s.get(`s:${u}`);
    if (!sh) return null;
    if (now >= sh.until) { await this.end(u, now, true); return null; }
    return sh;
  }
  newTask(sh, now, rand) {
    const t = { seed: 1 + Math.floor(rand() * 1e9), at: now, minMs: J.WORK[sh.job].minSec * 1000 };
    if (sh.job === 'phu') {
      const from = sh.at ?? sh.k, dest = nextPost(from, rand() < 0.5 ? -1 : 1);
      t.from = from; t.dest = dest; t.minMs = Math.round((postDist(from, dest) / J.SHIFT.phuSpeed) * 1000);
    }
    sh.task = t;
  }

  /** vào ca: nghề trong tiệm cần giữ chỗ ở đúng tiệm và đứng trong tiệm; thợ mỏ đứng trong mỏ dân sự */
  async start(u, jobId, k, yong, pos, now, rand = Math.random) {
    const job = J.WORK[jobId];
    if (!job) return { ok: false, err: 'bad' };
    if (await this.liveShift(u, now)) return { ok: false, err: 'busy' };
    const c = await this.career(u);
    this.setYong(c, yong, now);
    const day = J.vnDay(now);
    if (c.day !== day) { c.day = day; c.dayShifts = 0; }
    if (c.dayShifts >= J.SHIFT.perDay) return { ok: false, err: 'daycap' };
    const rel = this.relOf(c, jobId);
    let rank, palace = 1, kk = null;
    if (job.shop) {
      const cur = await this.contract(u, now), w = workplace(k);
      if (!w || w.job !== jobId) return { ok: false, err: 'bad' };
      if (!cur || cur.k !== k) return { ok: false, err: 'noseat' };
      if (!inRoom(k, pos)) return { ok: false, err: 'far' };
      rank = cur.r; palace = J.palaceBonus(w.wx, job.wx); kk = k;
    } else if (job.zone) { // nghề ngoài tiệm (P7): đứng trong khu làm, không giữ chỗ
      if (!zoneOpen(jobId, now)) return { ok: false, err: 'closed' };
      if (!inZone(jobId, pos)) return { ok: false, err: 'far' };
      rank = J.rankOf(c.skill[jobId] || 0, c.rep, rel);
    } else {
      if (!inCMine(pos)) return { ok: false, err: 'far' };
      rank = J.rankOf(c.skill[jobId] || 0, c.rep, rel);
    }
    c.dayShifts += 1;
    const sh = { id: `${now.toString(36)}${rid(rand)}`, job: jobId, k: kk, at: kk, start: now, until: now + J.SHIFT.ms, n: 0, purse: 0, xp: 0, chain: 0, durs: [], scores: [], rank, rel, palace, mishaps: 0 };
    this.newTask(sh, now, rand);
    await this.s.put({ [`s:${u}`]: sh, [`c:${u}`]: c });
    return { ok: true, shift: this.pubShift(sh), career: this.pubCareer(c, jobId) };
  }

  async ores(now) {
    const st = (await this.s.get('ore')) || {};
    const out = {};
    for (const o of ORE_NODES) {
      let [n, at] = st[o.id] || [ORE.charges, now];
      if (n < ORE.charges) { const g = Math.floor((now - at) / ORE.regenMs); if (g > 0) { n = Math.min(ORE.charges, n + g); at = n >= ORE.charges ? now : at + g * ORE.regenMs; } } else at = now;
      out[o.id] = [n, at];
    }
    return out;
  }

  /**
   * xong một việc. m: { seed, score (0–1), node?, wakeLow?, wakeLow30?, sick? } · pos: { x, z } (m) do máy chủ biết.
   * Trả kết quả việc + việc kế tiếp; đủ 8 việc thì tự tan ca (end).
   */
  async task(u, m, pos, now, rand = Math.random) {
    const sh = await this.s.get(`s:${u}`);
    if (!sh) return { ok: false, err: 'noshift' };
    if (now >= sh.until) { const end = await this.end(u, now, true); return { ok: false, err: 'ended', end }; }
    const t = sh.task, job = J.WORK[sh.job];
    if (!t || m.seed !== t.seed) return { ok: false, err: 'seed', task: this.pubTask(sh) };
    const dt = now - t.at;
    if (dt < t.minMs) return { ok: false, err: 'fast', wait: t.minMs - dt };
    if (dt > J.SHIFT.maxTaskMs) { this.newTask(sh, now, rand); await this.s.put(`s:${u}`, sh); return { ok: false, err: 'slow', task: this.pubTask(sh) }; }
    // vị trí: phu phải tới dịch trạm đích; nghề trong tiệm đứng trong tiệm; thợ mỏ đứng cạnh mạch còn quặng
    let ore = null;
    if (sh.job === 'phu') { if (!inRoom(t.dest, pos)) return { ok: false, err: 'far' }; }
    else if (job.shop) { if (!inRoom(sh.k, pos)) return { ok: false, err: 'far' }; }
    else if (job.zone) { if (!inZone(sh.job, pos)) return { ok: false, err: 'far' }; }
    else {
      const node = ORE_NODES.find((o) => o.id === m.node);
      if (!node || !inCMine(pos) || Math.hypot(pos.x - node.x, pos.z - node.z) > ORE.reach) return { ok: false, err: 'far' };
      ore = await this.ores(now);
      if (ore[node.id][0] <= 0) return { ok: false, err: 'empty', ready: ore[node.id][1] + ORE.regenMs };
    }
    const c = await this.career(u);
    // chống treo máy: nhịp quá đều → không tính việc này, giao việc mới, ghi cờ
    sh.durs = [...sh.durs, dt].slice(-8);
    if (J.botLike(sh.durs)) {
      c.flags += 1; sh.durs = []; this.newTask(sh, now, rand);
      await this.s.put({ [`s:${u}`]: sh, [`c:${u}`]: c });
      return { ok: false, err: 'bot', task: this.pubTask(sh) };
    }
    let score = Math.max(0, Math.min(1, Number(m.score) || 0));
    if (J.tooPerfect([...sh.scores, score])) { score = Math.min(score, 0.85); c.flags += 1; }
    sh.scores = [...sh.scores, score].slice(-10);
    // rủi ro lao động
    let mishap = null;
    // Âm Đức cấp ≥ 2: rủi ro −50% (P17)
    if (rand() < J.riskP(sh.rel, { wakeLow: !!m.wakeLow, sick: !!m.sick }) * ((m.ad | 0) >= 2 ? 0.5 : 1)) { const r = rand(); mishap = r < 0.4 ? 'nga' : r < 0.8 ? 'hong' : 'phat'; }
    const res = J.taskPay(job, score, { rel: sh.rel, rank: sh.rank, palace: sh.palace, chain: sh.chain, wakeLow30: !!m.wakeLow30, sick: !!m.sick });
    let got = 0;
    if (!mishap) got = Math.round(res.pay * 1000);
    else if (mishap === 'hong') got = -Math.min(sh.purse, Math.round(2 * res.pay * 1000)); // bồi 2 lần giá việc (trừ vào tiền ca)
    else if (mishap === 'phat') c.rep = Math.max(0, c.rep - 1);
    sh.purse += got;
    sh.chain = !mishap && score >= 0.7 ? sh.chain + 1 : 0;
    if (mishap) sh.mishaps += 1;
    const xp = mishap ? 0 : res.xp;
    c.skill[sh.job] = Math.round(((c.skill[sh.job] || 0) + xp) * 100) / 100;
    sh.n += 1;
    if (ore) { const [n, at] = ore[m.node]; ore[m.node] = [n - 1, n >= ORE.charges ? now : at]; await this.s.put('ore', ore); }
    if (sh.job === 'phu') sh.at = t.dest;
    const out = { ok: true, n: sh.n, max: J.SHIFT.tasks, score, perf: res.perf, pay: Math.round(got / 100) / 10, purse: Math.floor(sh.purse / 1000), mishap, rel: sh.rel, xp: Math.round(xp * 100) / 100, skill: Math.floor(c.skill[sh.job]) };
    await this.s.put(`c:${u}`, c);
    if (sh.n >= J.SHIFT.tasks) { await this.s.put(`s:${u}`, sh); out.end = await this.end(u, now); return out; }
    this.newTask(sh, now, rand);
    await this.s.put(`s:${u}`, sh);
    out.task = this.pubTask(sh);
    return out;
  }

  /** tan ca: trước giờ với < 4 việc = bỏ ca (50%, uy tín −5); auto = máy chủ tự đóng ca hết giờ (để nhận sau) */
  async end(u, now, auto = false) {
    const sh = await this.s.get(`s:${u}`);
    if (!sh) return { ok: false, err: 'noshift' };
    const c = await this.career(u);
    const timeUp = now >= sh.until, quit = !timeUp && sh.n < J.SHIFT.minFull;
    const paid = Math.floor((sh.purse / 1000) * (quit ? J.SHIFT.quitPay : 1));
    if (quit) c.rep = Math.max(0, c.rep + J.SHIFT.quitRep);
    else if (sh.n > 0) { c.rep = Math.min(100, c.rep + J.SHIFT.doneRep); c.shifts += 1; }
    const writes = { [`c:${u}`]: c, [`l:${u}:${sh.id}`]: { amt: paid, job: sh.job, n: sh.n, quit, at: now, claimed: !auto } };
    if (sh.k != null && J.WORK[sh.job].shop && sh.n > 0) {
      const list = await this.seats(sh.k, now), h = list.find((x) => x.u === u);
      if (h) { h.last = now; writes[`k:${sh.k}`] = list; const own = await this.s.get(`own:${u}`); if (own) writes[`own:${u}`] = { ...own, last: now }; }
    }
    await this.s.put(writes);
    await this.s.delete(`s:${u}`);
    await this.prune(u);
    return { ok: true, paid, quit, n: sh.n, job: sh.job, auto, rep: c.rep, skill: Math.floor(c.skill[sh.job] || 0), rank: J.rankOf(c.skill[sh.job] || 0, c.rep, sh.rel) };
  }
  /** giữ 40 dòng sổ gần nhất mỗi người (dòng chưa nhận không xoá) */
  async prune(u) {
    const rows = [...(await this.s.list({ prefix: `l:${u}:` }))];
    const old = rows.filter(([, v]) => v.claimed).slice(0, Math.max(0, rows.length - 40)).map(([k]) => k);
    if (old.length) await this.s.delete(old);
  }
  /** tiền ca máy chủ đã tự đóng (người chơi rớt mạng / thoát game) — nhận một lần */
  async claim(u) {
    const rows = await this.s.list({ prefix: `l:${u}:` });
    let amt = 0; const w = {}, items = [];
    for (const [k, v] of rows) if (!v.claimed) { amt += v.amt; items.push({ job: v.job, n: v.n, amt: v.amt, quit: v.quit }); w[k] = { ...v, claimed: true }; }
    if (items.length) await this.s.put(w);
    return { ok: true, amt, items };
  }
  async me(u, now) {
    const c = await this.career(u);
    const rows = await this.s.list({ prefix: `l:${u}:` });
    let owed = 0; for (const v of rows.values()) if (!v.claimed) owed += v.amt;
    const shift = await this.pubShiftOf(u, now);
    // liveShift có thể vừa tự đóng ca → tính lại số nợ
    if (!shift) { owed = 0; for (const v of (await this.s.list({ prefix: `l:${u}:` })).values()) if (!v.claimed) owed += v.amt; }
    return { ok: true, career: this.pubCareer(c), contract: await this.contract(u, now), shift, owed, yongLocked: !!(c.yong && now - c.yongAt < YONG_LOCK_MS) };
  }
  /** sổ tiền công gần nhất của một người (bảng «Lý lịch nghề») */
  async ledger(u) {
    const rows = [...(await this.s.list({ prefix: `l:${u}:` }))].map(([, v]) => v);
    return { ok: true, rows: rows.slice(-12).reverse() };
  }
}
