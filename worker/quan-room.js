// ============================================================================
//  TownShard — một "phòng" Huyền Quán (≤ ROOM_CAP người). Durable Object dùng
//  WebSocket Hibernation API: phòng vắng / im lặng thì DO ngủ, không tốn CPU.
//  Trạng thái từng người nằm trong attachment của socket → sống qua hibernation.
//  Giao thức: src/game/protocol.js · Kế hoạch: docs/GAME-MMO-PROMPT-PLAN.md §P1
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import * as P from '../src/game/protocol.js';

const MAX_REPORTS = 500;
const HELLO_TIMEOUT_MS = 30000; // socket nối mà không hello bị đóng sau ~30 giây

function rid() {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10);
}

// u = mã ổn định để client «ẩn người này» qua các lần kết nối (băm định danh thiết bị, không lộ pid)
const pub = (a) => ({ id: a.id, u: a.u, name: a.name, robe: a.robe, acc: a.acc, cos: a.cos || '', look: a.look, title: a.title, x: a.x, y: a.y, h: a.h, s: a.s, a: a.a || 0 });

async function stableId(pid, fallback) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('huyenquan:' + (pid || fallback)));
  return [...new Uint8Array(d)].slice(0, 6).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class TownShard extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.gates = new WeakMap(); // ws → bộ đếm tốc độ (mất khi ngủ — chấp nhận được)
    this.lastSweep = 0;         // quét socket không hello dẹt khi broadcast, ≤ 1 lần / 5 s
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected websocket', { status: 426 });
    const url = new URL(request.url);
    const room = Math.max(0, Math.min(P.MAX_ROOMS - 1, parseInt(url.searchParams.get('room') || '0', 10) || 0));
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    if (this.occupied() >= P.ROOM_CAP) {
      // phòng đầy (đếm cả socket chưa hello): socket thường (không hibernation) chỉ để báo rồi đóng — client thử phòng kế
      server.accept();
      server.send(JSON.stringify({ t: 'full', room }));
      server.close(P.CLOSE_FULL, 'room full');
    } else {
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment({ id: rid(), room, ready: false, seat: -1, helloAt: Date.now() });
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  // Số socket đang mở (kể cả socket chưa hello) — ROOM_CAP tính cả người chưa chào.
  occupied(gone = null) { return this.ctx.getWebSockets().filter((w) => w !== gone).length; }

  // Đóng những socket nối mà không chào (giữ chỗ ảo). Gọi dẹt khi broadcast — đủ đều.
  sweepIdle(now = Date.now()) {
    for (const w of this.ctx.getWebSockets()) {
      const b = w.deserializeAttachment();
      if (b && !b.ready && b.helloAt && now - b.helloAt > HELLO_TIMEOUT_MS) {
        try { w.close(P.CLOSE_BAD, 'hello timeout'); } catch (e) { /* đã đóng */ }
      }
    }
  }

  // Socket đã chào (hello). `gone` = socket đang đóng, loại khỏi mọi phép đếm.
  ready(gone = null) { return this.ctx.getWebSockets().filter((w) => w !== gone).map((w) => [w, w.deserializeAttachment()]).filter(([, a]) => a && a.ready); }

  send(ws, obj) { try { ws.send(JSON.stringify(obj)); } catch (e) { /* socket đã đóng */ } }
  broadcast(obj, except = null) {
    const now = Date.now();
    if (now - this.lastSweep > 5000) { this.lastSweep = now; this.sweepIdle(now); }
    const text = JSON.stringify(obj);
    for (const [w] of this.ready(except)) { try { w.send(text); } catch (e) { /* bỏ qua */ } }
  }
  seatsTaken(gone = null) { return this.ready(gone).map(([, a]) => a.seat).filter((i) => i >= 0); }
  count(gone = null) { return this.ready(gone).length; }

  async webSocketMessage(ws, data) {
    let gate = this.gates.get(ws);
    if (!gate) { gate = P.rateGate(P.MSG_PER_SEC); this.gates.set(ws, gate); }
    if (!gate()) { ws.close(P.CLOSE_SPAM, 'too many messages'); return; }
    const m = P.parseClient(typeof data === 'string' ? data : '');
    if (!m) return;
    const a = ws.deserializeAttachment();
    if (!a) return;

    if (m.t === 'hello') {
      if (a.ready) return;
      // Kiểm ROOM_CAP lại NGAY TRƯỚC khi chào (đếm cả socket chưa hello — không tính
      // chính socket này): vượt thì đóng 4001, client tự thử phòng kế.
      if (this.occupied(ws) >= P.ROOM_CAP) {
        this.send(ws, { t: 'full', room: a.room });
        ws.close(P.CLOSE_FULL, 'room full');
        return;
      }
      Object.assign(a, { ready: true, name: m.name, robe: m.robe, acc: m.acc, cos: m.cos, look: m.look, title: m.title, pid: m.pid, u: await stableId(m.pid, a.id), x: 11.875, y: 33.875, h: 0, s: 0, helloAt: 0, mvFirst: true }); // = world.js › START (giữa sân Sơn Môn)
      ws.serializeAttachment(a);
      this.send(ws, {
        t: 'welcome', v: P.VERSION, you: a.id, room: a.room, renamed: m.badName ? a.name : undefined,
        players: this.ready().filter(([w]) => w !== ws).map(([, b]) => pub(b)),
        seats: this.seatsTaken(),
      });
      this.broadcast({ t: 'join', p: pub(a) }, ws);
      this.broadcast({ t: 'count', n: this.count() });
      return;
    }
    if (!a.ready) return;

    switch (m.t) {
      case 'mv': {
        // Sanity relay: chặn NaN và bước nhảy phi lý (kẹp về toạ độ cũ của người gửi).
        // Gói đầu sau hello cho qua — khách reconnect vào vị trí xa chỗ xuất phát là hợp lệ
        // (máy chủ reset về START khi hello); parseClient đã chặn biên thế giới.
        if (a.mvFirst) a.mvFirst = false;
        else { const c = P.sanityMv(a, m.x, m.y); m.x = c.x; m.y = c.y; }
        a.x = m.x; a.y = m.y; a.h = m.h; a.s = m.s; a.a = m.a || 0;
        ws.serializeAttachment(a);
        this.broadcast({ t: 'mv', id: a.id, x: m.x, y: m.y, h: m.h, s: m.s, a: a.a }, ws);
        break;
      }
      case 'tp': {
        // Nhảy xa hợp lệ do client chủ động (vào/ra điện, lên xe ngựa/đò): cập nhật toạ độ
        // cũ NGAY để sanityMv không kẹp các gói mv sau cú nhảy về chỗ đứng cũ (lỗi «đứng
        // hình» trên máy người khác sau mỗi lần đổi phòng). Vẫn qua rateGate + biên thế
        // giới ở parseClient; vị trí mới phát cho mọi người qua gói mv kế tiếp của client.
        a.x = m.x; a.y = m.y; ws.serializeAttachment(a);
        break;
      }
      case 'cos':
        a.cos = m.c; ws.serializeAttachment(a);
        this.broadcast({ t: 'cos', id: a.id, c: m.c }, ws);
        break;
      case 'emo':
        this.broadcast({ t: 'emo', id: a.id, u: a.u, e: m.e, to: m.to });
        break;
      case 'say':
        this.broadcast({ t: 'say', id: a.id, u: a.u, k: m.k });
        break;
      case 'sit': {
        if (a.seat < 0) {
          const taken = this.seatsTaken();
          const free = P.SEATS.findIndex((_, i) => !taken.includes(i));
          a.seat = free; ws.serializeAttachment(a);
        }
        this.send(ws, { t: 'seat', i: a.seat });
        this.broadcast({ t: 'seats', taken: this.seatsTaken() });
        break;
      }
      case 'stand':
        if (a.seat >= 0) { a.seat = -1; ws.serializeAttachment(a); this.broadcast({ t: 'seats', taken: this.seatsTaken() }); }
        break;
      case 'report': {
        const target = this.ready().find(([, b]) => b.id === m.id);
        // Đối tượng vắng / tự báo mình / kho báo cáo đầy → trả err về cho người báo, không im lặng.
        if (!target) { this.send(ws, { t: 'err', m: 'Người này không còn trong phòng.' }); break; }
        if (m.id === a.id) { this.send(ws, { t: 'err', m: 'Không thể tự báo mình.' }); break; }
        const key = `report:${a.pid || a.id}:${m.id}`;
        if (await this.ctx.storage.get(key)) break; // mỗi người báo một lần / đối tượng
        const n = (await this.ctx.storage.get('report:count')) || 0;
        if (n >= MAX_REPORTS) { this.send(ws, { t: 'err', m: 'Kho báo cáo đã đầy — thử lại sau.' }); break; }
        await this.ctx.storage.put(key, { at: Date.now(), room: a.room, why: m.why, target: { id: m.id, name: target[1].name, pid: target[1].pid }, by: a.pid || a.id });
        await this.ctx.storage.put('report:count', n + 1);
        this.send(ws, { t: 'reported', id: m.id });
        break;
      }
      default:
    }
  }

  async webSocketClose(ws) { this.left(ws); }
  async webSocketError(ws) { this.left(ws); }

  left(ws) {
    const a = ws.deserializeAttachment();
    if (!a || !a.ready) return;
    a.ready = false; a.seat = -1;
    try { ws.serializeAttachment(a); } catch (e) { /* socket đã đóng */ }
    this.broadcast({ t: 'leave', id: a.id }, ws);
    this.broadcast({ t: 'count', n: this.count(ws) }, ws);
    this.broadcast({ t: 'seats', taken: this.seatsTaken(ws) }, ws);
  }
}
