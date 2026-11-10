// ============================================================================
//  TownShard — một "phòng" Huyền Quán (≤ ROOM_CAP người). Durable Object dùng
//  WebSocket Hibernation API: phòng vắng / im lặng thì DO ngủ, không tốn CPU.
//  Trạng thái từng người nằm trong attachment của socket → sống qua hibernation.
//  Giao thức: src/game/protocol.js · Kế hoạch: docs/GAME-MMO-PROMPT-PLAN.md §P1
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import * as P from '../src/game/protocol.js';
import { stableId, accountPid } from '../src/game/auth-core.js';

const MAX_REPORTS = 500;
const HELLO_TIMEOUT_MS = 30000; // socket nối mà không hello bị đóng sau ~30 giây

function rid() {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10);
}

// u = mã ổn định để client «ẩn người này» qua các lần kết nối (băm định danh thiết bị, không lộ pid)
const pub = (a) => ({ id: a.id, u: a.u, name: a.name, robe: a.robe, acc: a.acc, cos: a.cos || '', look: a.look, title: a.title, x: a.x, y: a.y, h: a.h, s: a.s, a: a.a || 0, w: a.w || 0, b: a.b || 0 });


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
  /** hương đang cháy trong phòng (lưu storage — sống qua hibernation), đã bỏ nén tàn */
  async incList(now = Date.now()) { const l = (await this.ctx.storage.get('inc')) || []; return l.filter((e) => now - e.at < P.INCENSE_MS); }
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
      // có vé tài khoản (đã đăng nhập): mã công khai theo tài khoản, không theo thiết bị
      let acct = null;
      if (m.tok && this.env.ACCOUNTS) { try { acct = await this.env.ACCOUNTS.get(this.env.ACCOUNTS.idFromName('accounts')).consumeWsToken(m.tok); } catch (e) { acct = null; } }
      const uid = acct?.uid || null;
      Object.assign(a, { uid, ready: true, name: m.name, robe: m.robe, acc: m.acc, cos: m.cos, look: m.look, title: m.title, pid: m.pid, u: await stableId(uid ? accountPid(uid) : m.pid, a.id), x: 11.875, y: 33.875, h: 0, s: 0, helloAt: 0, mvFirst: true }); // = world.js › START (giữa sân Sơn Môn)
      ws.serializeAttachment(a);
      this.send(ws, {
        t: 'welcome', v: P.VERSION, you: a.id, room: a.room, renamed: m.badName ? a.name : undefined,
        players: this.ready().filter(([w]) => w !== ws).map(([, b]) => pub(b)),
        seats: this.seatsTaken(),
        razed: await this.razedList(),
        inc: (await this.incList()).map((e) => [e.k, Date.now() - e.at]),
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
        a.x = m.x; a.y = m.y; a.h = m.h; a.s = m.s; a.a = m.a || 0; a.w = m.w || 0; a.b = m.b || 0; a.fs = m.fs || 0;
        ws.serializeAttachment(a);
        this.broadcast({ t: 'mv', id: a.id, x: m.x, y: m.y, h: m.h, s: m.s, a: a.a, w: a.w, b: a.b, fs: a.fs }, ws);
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
      case 'cung': {
        const tg = this.ready().find(([, b]) => b.id === m.to);
        if (tg && tg[1].w === 6 && m.to !== a.id) { this.send(tg[0], { t: 'cung', from: a.id, name: a.name }); this.send(ws, { t: 'cung_ok', to: m.to }); }
        else this.send(ws, { t: 'err', m: 'Vong hồn ấy đã siêu thoát hoặc không còn ở đây.' });
        break;
      }
      case 'inc': {
        // Thắp hương chung: mỗi người một tuần nhang một lúc; máy chủ chọn lư (lớn trước, đầy thì lư nhỏ vắng nhất)
        const now = Date.now();
        if (a.incAt && now - a.incAt < P.INCENSE_MS) break;
        const list = await this.incList(now);
        const k = P.pickBurner(list, now);
        if (k < 0) { this.send(ws, { t: 'err', m: 'Chín lư hương đều đã kín nhang, chờ một tuần nhang tàn nhé.' }); break; }
        a.incAt = now; ws.serializeAttachment(a);
        list.push({ k, at: now });
        await this.ctx.storage.put('inc', list.slice(-200));
        this.broadcast({ t: 'inc', k, ago: 0, id: a.id });
        break;
      }
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
      case 'raze': {
        // công trình ngoài thành bị phá: người phá phải đứng gần, ≤ 1 lần / 4 s; nhớ tới khi tự dựng lại (20 phút)
        const now = Date.now();
        if (now - (a.razeAt || 0) < P.RAZE_COOLDOWN_MS) break;
        if (Math.hypot(m.x - a.x, m.y - a.y) > P.RAZE_REACH_TILES) break;
        a.razeAt = now; ws.serializeAttachment(a);
        const map = await this.razedMap(now);
        if (map.has(m.id)) break;
        map.set(m.id, now);
        if (map.size > P.RAZE_KEEP) map.delete(map.keys().next().value);
        await this.ctx.storage.put('razed', [...map]);
        this.broadcast({ t: 'razed', id: m.id, by: a.id });
        break;
      }
      case 'est_list': case 'est_get': case 'est_claim': case 'est_release': case 'est_save': case 'est_like':
        await this.estate(ws, a, m);
        break;
      case 'ec': await this.econ(ws, a, m); break;
      case 'job_me': case 'job_board': case 'job_apply': case 'job_renew': case 'job_quit': case 'job_start':
      case 'job_task': case 'job_end': case 'job_claim': case 'job_ores': case 'job_log':
        await this.guild(ws, a, m);
        break;
      default:
    }
  }

  // Sổ công trình đang bị phá (sống qua hibernation nhờ storage); hết 20 phút tự dựng lại → bỏ khỏi sổ
  async razedMap(now = Date.now()) {
    if (!this.razed) this.razed = new Map((await this.ctx.storage.get('razed')) || []);
    for (const [id, at] of this.razed) if (now - at >= P.RESPAWN_MS) this.razed.delete(id);
    return this.razed;
  }
  async razedList() { const now = Date.now(); return [...(await this.razedMap(now))].map(([id, at]) => [id, now - at]); }

  // Nhà riêng: chuyển sang Estate DO (một bản toàn cục), trả est_res cho người hỏi; mua / bán / khen /
  // đổi bố cục thì phát est_up cho cả shard (shard khác thấy khi tải lại sổ).
  async estate(ws, a, m) {
    const env = this.env;
    if (!env.ESTATE) { this.send(ws, { t: 'est_res', q: m.q, ok: false, err: 'off' }); return; }
    let r;
    try {
      const st = env.ESTATE.get(env.ESTATE.idFromName('estate'));
      if (m.t === 'est_list') r = await st.list(a.u);
      else if (m.t === 'est_get') r = await st.get(m.h);
      else if (m.t === 'est_claim') r = await st.claim(m.h, a.u, a.name);
      else if (m.t === 'est_release') r = await st.release(m.h, a.u);
      else if (m.t === 'est_save') r = await st.save(m.h, a.u, m.it, m.c);
      else r = await st.like(m.h, a.u);
    } catch (e) { r = { ok: false, err: 'error' }; }
    this.send(ws, { t: 'est_res', q: m.q, ...r });
    if (!r.ok) return;
    if (m.t === 'est_claim') this.broadcast({ t: 'est_up', h: m.h, name: a.name, likes: 0, layout: true });
    else if (m.t === 'est_release') this.broadcast({ t: 'est_up', h: m.h, name: null });
    else if (m.t === 'est_save') this.broadcast({ t: 'est_up', h: m.h, name: a.name, likes: r.likes, layout: true }, ws);
    else if (m.t === 'est_like') this.broadcast({ t: 'est_up', h: m.h, name: r.name, likes: r.likes });
  }

  // Việc làm: chuyển sang Guild DO (một bản toàn cục). Vị trí = toạ độ máy chủ đã biết (ô → mét, như world.tileToWorld).
  async guild(ws, a, m) {
    const env = this.env;
    if (!env.GUILD || !a.u) { this.send(ws, { t: 'job_res', q: m.q, ok: false, err: 'off' }); return; }
    const pos = { x: (a.x - 10) * 1.6, z: (a.y - 7) * 1.6 };
    let r;
    try {
      const g = env.GUILD.get(env.GUILD.idFromName('guild'));
      switch (m.t) {
        case 'job_me': r = await g.me(a.u); break;
        case 'job_board': r = await g.board(m.k, a.u); break;
        case 'job_apply': r = await g.apply(a.u, a.name, m.k, m.r, m.y); break;
        case 'job_renew': r = await g.renew(a.u); break;
        case 'job_quit': r = await g.quit(a.u); break;
        case 'job_start': r = await g.start(a.u, m.job, m.k, m.y, pos); break;
        case 'job_task': r = await g.task(a.u, { seed: m.seed, score: m.sc, node: m.node, wakeLow: m.wl, wakeLow30: m.wl30, sick: m.sk, ad: m.ad }, pos); break;
        case 'job_end': r = await g.end(a.u); break;
        case 'job_claim': r = await g.claim(a.u); break;
        case 'job_ores': r = await g.ores(); break;
        default: r = await g.ledger(a.u);
      }
    } catch (e) { r = { ok: false, err: 'error' }; }
    this.send(ws, { t: 'job_res', ...r, q: m.q });
  }

  // Kinh tế Phần II: chuyển sang Economy DO (một bản toàn cục). uid = tài khoản đăng nhập (khách không giao dịch).
  async econ(ws, a, m) {
    const env = this.env;
    if (!env.ECONOMY || !a.u) { this.send(ws, { t: 'ec_res', q: m.q, ok: false, err: 'off' }); return; }
    let r;
    try { r = await env.ECONOMY.get(env.ECONOMY.idFromName('economy')).call(m.op, a.u, m.a, { uid: a.uid || null, name: a.name }); }
    catch (e) { r = { ok: false, err: 'error' }; }
    this.send(ws, { t: 'ec_res', ...r, q: m.q }); // q (mã gói) đứng SAU: kết quả có trường q riêng (chất lượng món)
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
