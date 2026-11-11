// ============================================================================
//  HUYỀN QUÁN MMO — client mạng. Offline-first: không kết nối được thì game vẫn chơi
//  đơn như cũ; có mạng thì thấy người thật trong cùng phòng (shard).
//  Giao thức: ./protocol.js · Máy chủ: worker/quan-room.js
// ============================================================================
import * as P from './protocol.js';

const PID_KEY = 'huyenquan:pid';
const BLOCK_KEY = 'huyenquan:blocked';

function serverBase() {
  try {
    const q = new URLSearchParams(location.search).get('server');
    if (q) return q;
    const saved = localStorage.getItem('huyenquan:server');
    if (saved) return saved;
  } catch (e) { /* ignore */ }
  const native = !!window.Capacitor?.isNativePlatform?.();
  if (native) return 'wss://battu.god8.shop';
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;
}

export function pid() {
  try {
    let v = localStorage.getItem(PID_KEY);
    if (!v) { v = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 36); localStorage.setItem(PID_KEY, v); }
    return v;
  } catch (e) { return null; }
}

function loadBlocked() { try { return new Set(JSON.parse(localStorage.getItem(BLOCK_KEY) || '[]')); } catch (e) { return new Set(); } }

/**
 * @param {object} o
 * @param {() => {name, robe, title}} o.profile — hồ sơ hiện tại của khách
 * @param {(ev) => void} o.onEvent — sự kiện cho UI: status, count, join, leave, emo, say, renamed, reported
 */
export function createNet({ profile, onEvent = () => {}, token = null }) {
  const others = new Map(); // id → người chơi khác (đã lọc người bị ẩn)
  const blocked = loadBlocked();
  let ws = null, me = null, room = 0, status = 'off', count = 0, seats = [];
  let incense = []; // hương chung của phòng: [{ k: chỉ số lư, at: giờ máy này, mine }]
  let retry = 0, retryTimer = 0, stopped = true;
  let lastSent = { x: -1, y: -1, s: -1, h: 0, at: 0 };
  let seatWaiter = null;   // hàm resolve đang chờ máy chủ trả seat
  let seatPending = null;  // promise của lượt xin ghế đang chạy (để gọi chồng dùng lại)

  const set = (s) => { if (status !== s) { status = s; onEvent({ t: 'status', status: s, room }); } };

  // --- nhà riêng (Estate DO qua TownShard): sổ căn đã bán, bố cục đã tải, lời hứa chờ trả lời
  const sold = new Map();   // h → { name, likes }
  const layouts = new Map(); // h → { it, c, at }
  const waiting = new Map(); // q → resolve
  let q = 0, mine = null;
  function ask(o, ms = 5000) {
    if (!(ws && ws.readyState === 1 && me)) return Promise.resolve({ ok: false, err: 'offline' });
    const id = ++q;
    return new Promise((resolve) => {
      waiting.set(id, resolve);
      ws.send(JSON.stringify({ ...o, q: id }));
      setTimeout(() => { if (waiting.has(id)) { waiting.delete(id); resolve({ ok: false, err: 'timeout' }); } }, ms);
    });
  }
  const estate = {
    onChange: null,
    online: () => status === 'online' && !!me,
    info: (h) => sold.get(h) || null,
    get mine() { return mine; },
    cached: (h) => layouts.get(h) || null,
    async get(h) { const r = await ask({ t: 'est_get', h }); if (r.ok) layouts.set(h, { it: r.it || '', c: r.c | 0, at: Date.now() }); return r; },
    async claim(h) { const r = await ask({ t: 'est_claim', h }); if (r.ok) { mine = h; layouts.set(h, { it: '', c: 0, at: Date.now() }); } return r; },
    async release(h) { const r = await ask({ t: 'est_release', h }); if (r.ok) { mine = null; sold.delete(h); layouts.delete(h); } return r; },
    async save(h, it, c) { const r = await ask({ t: 'est_save', h, it, c }); if (r.ok) layouts.set(h, { it, c, at: Date.now() }); return r; },
    like: (h) => ask({ t: 'est_like', h }),
    refresh: () => ask({ t: 'est_list' }),
  };
  // --- việc làm (Guild DO qua TownShard, P2): máy chủ chấm lương theo vị trí nó biết → gửi kèm vị trí hiện tại
  //     ngay trước mỗi lệnh (where() do work.js cấp; sau khi nối lại máy chủ đặt người chơi về sân Sơn Môn)
  const jask = (o) => { const p = guild.where?.(); if (p && ws && ws.readyState === 1 && me) ws.send(JSON.stringify({ t: 'tp', x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100 })); return ask(o); };
  // --- kinh tế Phần II (Economy DO qua TownShard, P8–P13)
  const econ = { online: () => status === 'online' && !!me, call: (op, a = {}) => ask({ t: 'ec', op, a }, 8000) };
  const guild = {
    where: null,
    online: () => status === 'online' && !!me,
    me: () => jask({ t: 'job_me' }),
    board: (k) => jask({ t: 'job_board', k }),
    apply: (k, r, y) => jask({ t: 'job_apply', k, r, y }),
    renew: () => jask({ t: 'job_renew' }),
    quit: () => jask({ t: 'job_quit' }),
    start: (job, k, y) => jask({ t: 'job_start', job, k, y }),
    task: (o) => jask({ t: 'job_task', ...o }),
    end: () => jask({ t: 'job_end' }),
    claim: () => jask({ t: 'job_claim' }),
    ores: () => jask({ t: 'job_ores' }),
    log: () => jask({ t: 'job_log' }),
  };

  async function connect() {
    if (stopped) return;
    clearTimeout(retryTimer);
    set('connecting');
    // đã đăng nhập tài khoản: xin vé một lần cho hello (account.js) — không có thì vào như khách (pid)
    let tok = null;
    if (token) { try { tok = await token(); } catch (e) { tok = null; } }
    if (stopped) return;
    let sock;
    try { sock = new WebSocket(`${serverBase()}/ws/quan?room=${room}`); } catch (e) { scheduleRetry(); return; }
    ws = sock;
    sock.onopen = () => {
      retry = 0;
      const p = profile();
      sock.send(JSON.stringify({ t: 'hello', name: p.name, robe: p.robe, acc: p.accent, cos: p.cos || '', look: p.look, title: p.title, pid: pid(), tok: tok || undefined, x: p.x, y: p.y }));
    };
    sock.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch (_) { return; } handle(m); };
    sock.onclose = (e) => {
      if (ws !== sock) return;
      ws = null; me = null; others.clear(); count = 0;
      onEvent({ t: 'count', n: 0 });
      if (e.code === P.CLOSE_FULL && room < P.MAX_ROOMS - 1) { room += 1; connect(); return; }
      set('off');
      scheduleRetry();
    };
    sock.onerror = () => {};
  }

  function scheduleRetry() {
    if (stopped) return;
    retry = Math.min(retry + 1, 6);
    retryTimer = setTimeout(connect, Math.min(30000, 1500 * 2 ** (retry - 1)));
  }

  function upsert(p) {
    if (blocked.has(p.u)) return;
    const o = others.get(p.id) || { id: p.id, bubble: null };
    Object.assign(o, { u: p.u, look: p.look, name: p.name, robe: p.robe, acc: p.acc || '', cos: p.cos || '', title: p.title, tx: p.x, ty: p.y, th: p.h, s: p.s, w: p.w || 0, b: p.b || 0 });
    if (o.x == null) { o.x = p.x; o.y = p.y; o.h = p.h; }
    others.set(p.id, o);
  }

  function bubble(id, text) {
    const o = id === me ? null : others.get(id);
    if (o) o.bubble = { text, until: performance.now() + 3800 };
  }

  function handle(m) {
    switch (m.t) {
      case 'welcome':
        me = m.you; room = m.room; seats = m.seats || [];
        incense = Array.isArray(m.inc) ? m.inc.filter((e) => Array.isArray(e) && P.BURNER_CAP[e[0]] && e[1] >= 0).map(([k, ago]) => ({ k, at: Date.now() - ago })) : [];
        others.clear();
        for (const p of m.players) upsert(p);
        count = m.players.length + 1;
        set('online');
        onEvent({ t: 'count', n: count });
        if (m.renamed) onEvent({ t: 'renamed', name: m.renamed });
        lastSent.at = 0;
        estate.refresh();
        if (Array.isArray(m.razed)) onEvent({ t: 'razed', list: m.razed });
        break;
      case 'join': upsert(m.p); onEvent({ t: 'join', name: m.p.name }); break;
      case 'leave': others.delete(m.id); break;
      case 'cos': { const o = others.get(m.id); if (o) o.cos = m.c || ''; break; }
      case 'count': count = m.n; onEvent({ t: 'count', n: m.n }); break;
      case 'mv': {
        const o = others.get(m.id);
        if (o) { o.tx = m.x; o.ty = m.y; o.th = m.h; o.s = m.s; o.a = m.a || 0; o.w = m.w || 0; o.b = m.b || 0; o.fs = m.fs || 0; }
        break;
      }
      case 'emo': {
        if (blocked.has(m.u)) break;
        const E = P.EMOTES[m.e];
        if (!E) break;
        bubble(m.id, E.icon);
        onEvent({ t: 'emo', id: m.id, self: m.id === me, toMe: m.to === me, e: m.e, name: others.get(m.id)?.name });
        break;
      }
      case 'say': {
        if (blocked.has(m.u)) break;
        const text = P.PHRASES[m.k];
        if (!text) break;
        bubble(m.id, text);
        onEvent({ t: 'say', id: m.id, self: m.id === me, text, name: others.get(m.id)?.name });
        break;
      }
      case 'seat': seatWaiter?.(m.i); seatWaiter = null; seatPending = null; break;
      case 'seats': seats = m.taken || []; break;
      case 'cung': onEvent({ t: 'cung', from: m.from, name: m.name }); break;
      case 'cung_ok': onEvent({ t: 'cung_ok', to: m.to }); break;
      case 'inc': if (P.BURNER_CAP[m.k]) { incense.push({ k: m.k, at: Date.now() - (m.ago | 0), mine: m.id === me }); if (incense.length > 240) incense.splice(0, incense.length - 240); } break;
      case 'reported': onEvent({ t: 'reported', id: m.id }); break;
      case 'err': onEvent({ t: 'err', m: m.m }); break;
      case 'razed': if (m.by !== me) onEvent({ t: 'razed', list: [[m.id, 0]] }); break;
      case 'job_res': case 'ec_res': { const fn = waiting.get(m.q); if (fn) { waiting.delete(m.q); fn(m); } break; }
      case 'est_res': {
        const fn = waiting.get(m.q); if (fn) { waiting.delete(m.q); fn(m); }
        if (m.list) { sold.clear(); for (const [h, name, likes] of m.list) sold.set(h, { name, likes }); mine = m.mine ?? null; onEvent({ t: 'estate' }); }
        break;
      }
      case 'est_up': {
        // có người mua / bán / khen / đổi bố cục: cập nhật sổ, bỏ bố cục cũ để lần vào sau tải lại
        if (m.name) sold.set(m.h, { name: m.name, likes: m.likes | 0 }); else sold.delete(m.h);
        if (m.layout) layouts.delete(m.h);
        estate.onChange?.(m.h);
        break;
      }
      default:
    }
  }

  const send = (o) => { if (ws && ws.readyState === 1 && me) ws.send(JSON.stringify(o)); };

  return {
    get status() { return status; },
    get count() { return count; },
    get room() { return room; },
    get me() { return me; },
    get seats() { return seats; },
    /** hương đang cháy của phòng (đã lọc nén tàn) */
    incense(now = Date.now()) { incense = incense.filter((e) => now - e.at < P.INCENSE_MS); return incense; },
    lightIncense() { send({ t: 'inc' }); },
    offerGhost(id) { send({ t: 'cung', to: id }); },
    others,
    estate,
    guild,
    econ,
    start() { if (!stopped) return; stopped = false; connect(); },
    stop() { stopped = true; clearTimeout(retryTimer); if (ws) { const s = ws; ws = null; s.close(1000); } others.clear(); set('off'); },
    // Gọi mỗi khung hình: gửi vị trí (≤ 8 Hz, chỉ khi đổi — kể cả đổi hướng h) + nội suy người khác.
    tick(dt, self) {
      const now = performance.now();
      if (me && now - lastSent.at > 1000 / P.MOVE_HZ) {
        const s = self.sitting ? 1 : 0;
        const a = Math.round(self.alt || 0);
        const h = self.h || 0, w = self.w || 0, b = self.b || 0, fs = self.fs || 0;
        if (Math.abs(self.x - lastSent.x) > 0.02 || Math.abs(self.y - lastSent.y) > 0.02 || Math.abs(h - lastSent.h) > 0.02 || s !== lastSent.s || a !== lastSent.a || w !== lastSent.w || b !== lastSent.b || fs !== lastSent.fs) {
          send({ t: 'mv', x: self.x, y: self.y, h, s, a, w, b, fs });
          lastSent = { x: self.x, y: self.y, s, a, h, w, b, fs, at: now };
        }
      }
      const step = 3.5 * 1.35 * dt; // nhanh hơn tốc độ đi chút để đuổi kịp
      for (const o of others.values()) {
        const n = P.approach(o, { x: o.tx, y: o.ty }, (o.w === 3 || o.w === 4) ? step * 1.6 : step); // trên thuyền / đang cưỡi ngựa (thuyền buồm tới ~7 m/s): đuổi nhanh hơn
        o.moving = Math.hypot(n.x - o.x, n.y - o.y) > 1e-3;
        o.x = n.x; o.y = n.y; o.h = o.th;
        if (o.bubble && now > o.bubble.until) o.bubble = null;
      }
    },
    emote(e, to) { send({ t: 'emo', e, to }); },
    say(k) { send({ t: 'say', k }); },
    // Nhảy xa hợp lệ do client chủ động (đổi phòng qua cửa điện, lên xe ngựa/đò): báo máy
    // chủ cập nhật toạ độ cũ để các gói mv sau cú nhảy không bị sanityMv kẹp về chỗ cũ.
    // Ngoại tuyến → send tự bỏ qua.
    teleport(x, y) { send({ t: 'tp', x, y }); },
    // Xin một bồ đoàn ở Trà Thất. Máy chủ không trả lời / hết chỗ → -1 (không có ghế —
    // các đường THẤT BẠI không bao giờ trả số ảo, vì 1 là chỉ số ghế hợp lệ). Ngoại tuyến
    // thì khác: offline-first (mất mạng vẫn chơi đơn) → cấp ghế cục bộ để ngồi trà vẫn
    // chạy — không có người thật nên không cần máy chủ khoá chỗ. Gọi chồng khi waiter
    // chưa xong thì dùng lại cùng promise, không gửi thêm gói sit.
    requestSeat() {
      if (!me) return Promise.resolve(1); // ngoại tuyến: ghế cục bộ (SEATS[1] = bồ đoàn giữa)
      if (seatWaiter) return seatPending;
      return (seatPending = new Promise((resolve) => {
        seatWaiter = resolve;
        send({ t: 'sit' });
        setTimeout(() => { if (seatWaiter === resolve) { seatWaiter = null; seatPending = null; resolve(-1); } }, 1500);
      }));
    },
    stand() { send({ t: 'stand' }); },
    // đổi trang bị (Tàng Y Các) → người khác thấy ngay
    setCos(c) { send({ t: 'cos', c }); },
    report(id, why) { send({ t: 'report', id, why }); },
    raze(id, x, y) { send({ t: 'raze', id, x, y }); },
    // ẩn theo mã ổn định u (bền qua kết nối lại), xoá khỏi cảnh ngay
    block(id) { const o = others.get(id); if (!o) return; blocked.add(o.u); others.delete(id); try { localStorage.setItem(BLOCK_KEY, JSON.stringify([...blocked].slice(-200))); } catch (e) { /* ignore */ } },
    unblockAll() { blocked.clear(); try { localStorage.removeItem(BLOCK_KEY); } catch (e) { /* ignore */ } },
    get blockedCount() { return blocked.size; },
  };
}
