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

function pid() {
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
export function createNet({ profile, onEvent = () => {} }) {
  const others = new Map(); // id → người chơi khác (đã lọc người bị ẩn)
  const blocked = loadBlocked();
  let ws = null, me = null, room = 0, status = 'off', count = 0, seats = [];
  let retry = 0, retryTimer = 0, stopped = true;
  let lastSent = { x: -1, y: -1, s: -1, h: 0, at: 0 };
  let seatWaiter = null;

  const set = (s) => { if (status !== s) { status = s; onEvent({ t: 'status', status: s, room }); } };

  function connect() {
    if (stopped) return;
    clearTimeout(retryTimer);
    set('connecting');
    let sock;
    try { sock = new WebSocket(`${serverBase()}/ws/quan?room=${room}`); } catch (e) { scheduleRetry(); return; }
    ws = sock;
    sock.onopen = () => {
      retry = 0;
      const p = profile();
      sock.send(JSON.stringify({ t: 'hello', name: p.name, robe: p.robe, acc: p.accent, look: p.look, title: p.title, pid: pid() }));
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
    Object.assign(o, { u: p.u, look: p.look, name: p.name, robe: p.robe, title: p.title, tx: p.x, ty: p.y, th: p.h, s: p.s });
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
        others.clear();
        for (const p of m.players) upsert(p);
        count = m.players.length + 1;
        set('online');
        onEvent({ t: 'count', n: count });
        if (m.renamed) onEvent({ t: 'renamed', name: m.renamed });
        lastSent.at = 0;
        break;
      case 'join': upsert(m.p); onEvent({ t: 'join', name: m.p.name }); break;
      case 'leave': others.delete(m.id); break;
      case 'count': count = m.n; onEvent({ t: 'count', n: m.n }); break;
      case 'mv': {
        const o = others.get(m.id);
        if (o) { o.tx = m.x; o.ty = m.y; o.th = m.h; o.s = m.s; o.a = m.a || 0; }
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
      case 'seat': seatWaiter?.(m.i); seatWaiter = null; break;
      case 'seats': seats = m.taken || []; break;
      case 'reported': onEvent({ t: 'reported', id: m.id }); break;
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
    others,
    start() { if (!stopped) return; stopped = false; connect(); },
    stop() { stopped = true; clearTimeout(retryTimer); if (ws) { const s = ws; ws = null; s.close(1000); } others.clear(); set('off'); },
    // Gọi mỗi khung hình: gửi vị trí (≤ 8 Hz, chỉ khi đổi) + nội suy người khác.
    tick(dt, self) {
      const now = performance.now();
      if (me && now - lastSent.at > 1000 / P.MOVE_HZ) {
        const s = self.sitting ? 1 : 0;
        const a = Math.round(self.alt || 0);
        if (Math.abs(self.x - lastSent.x) > 0.02 || Math.abs(self.y - lastSent.y) > 0.02 || s !== lastSent.s || a !== lastSent.a) {
          send({ t: 'mv', x: self.x, y: self.y, h: self.h || 0, s, a });
          lastSent = { x: self.x, y: self.y, s, a, at: now };
        }
      }
      const step = 3.5 * 1.35 * dt; // nhanh hơn tốc độ đi chút để đuổi kịp
      for (const o of others.values()) {
        const n = P.approach(o, { x: o.tx, y: o.ty }, step);
        o.moving = Math.hypot(n.x - o.x, n.y - o.y) > 1e-3;
        o.x = n.x; o.y = n.y; o.h = o.th;
        if (o.bubble && now > o.bubble.until) o.bubble = null;
      }
    },
    emote(e, to) { send({ t: 'emo', e, to }); },
    say(k) { send({ t: 'say', k }); },
    // Xin một bồ đoàn ở Trà Thất. Offline → chỗ giữa; online → máy chủ cấp (-1 = kín chỗ).
    requestSeat() {
      if (!me) return Promise.resolve(1);
      return new Promise((resolve) => {
        seatWaiter = resolve;
        send({ t: 'sit' });
        setTimeout(() => { if (seatWaiter === resolve) { seatWaiter = null; resolve(1); } }, 1500);
      });
    },
    stand() { send({ t: 'stand' }); },
    report(id, why) { send({ t: 'report', id, why }); },
    // ẩn theo mã ổn định u (bền qua kết nối lại), xoá khỏi cảnh ngay
    block(id) { const o = others.get(id); if (!o) return; blocked.add(o.u); others.delete(id); try { localStorage.setItem(BLOCK_KEY, JSON.stringify([...blocked].slice(-200))); } catch (e) { /* ignore */ } },
    unblockAll() { blocked.clear(); try { localStorage.removeItem(BLOCK_KEY); } catch (e) { /* ignore */ } },
    get blockedCount() { return blocked.size; },
  };
}
