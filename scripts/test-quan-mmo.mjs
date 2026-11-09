// Test tích hợp máy chủ MMO Huyền Quán (worker/quan-room.js) qua WebSocket thật.
// Cần `npm run dev:mmo` đang chạy (cổng 8788). Chạy: node scripts/test-quan-mmo.mjs [ws://127.0.0.1:8788]
import assert from 'node:assert/strict';
import { ROOM_CAP, CLOSE_SPAM, CLOSE_FULL } from '../src/game/protocol.js';

const BASE = process.argv[2] || 'ws://127.0.0.1:8788';
// mỗi lần chạy dùng dải phòng riêng để không đụng dữ liệu lần trước
const R0 = 30 + Math.floor(Math.random() * 15);
let passed = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function client(room = R0, name = 'Khách') {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${BASE}/ws/quan?room=${room}`);
    const c = { ws, inbox: [], closed: null, name };
    ws.onmessage = (e) => c.inbox.push(JSON.parse(e.data));
    ws.onclose = (e) => { c.closed = e.code; };
    ws.onerror = () => {};
    ws.onopen = () => resolve(c);
    setTimeout(() => reject(new Error('không mở được ' + BASE)), 8000);
  });
}
const send = (c, o) => c.ws.send(JSON.stringify(o));
async function wait(c, pred, ms = 3000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const i = c.inbox.findIndex(pred);
    if (i >= 0) return c.inbox.splice(i, 1)[0];
    await sleep(20);
  }
  throw new Error('hết giờ chờ gói: ' + pred.toString());
}
async function hello(c, extra = {}) { send(c, { t: 'hello', name: c.name, robe: '水', pid: 'test-' + Math.random().toString(36).slice(2, 10), ...extra }); return wait(c, (m) => m.t === 'welcome'); }
const step = async (name, fn) => { await fn(); passed++; console.log('✓', name); };

try {
  const a = await client(R0, 'Mây');
  const wa = await hello(a);
  await step('welcome: có id, phòng, danh sách rỗng', async () => {
    assert.ok(wa.you); assert.equal(wa.room, R0); assert.deepEqual(wa.players, []);
  });

  const b = await client(R0, 'Trúc');
  const wb = await hello(b);
  await step('người thứ hai thấy người thứ nhất; người thứ nhất nhận join + count=2', async () => {
    assert.equal(wb.players.length, 1); assert.equal(wb.players[0].name, 'Mây');
    const j = await wait(a, (m) => m.t === 'join');
    assert.equal(j.p.name, 'Trúc');
    await wait(a, (m) => m.t === 'count' && m.n === 2);
  });

  await step('di chuyển phát cho người khác, không dội lại chính mình', async () => {
    send(a, { t: 'mv', x: 5.5, y: 6.25, h: 1.5, s: 0 });
    const mv = await wait(b, (m) => m.t === 'mv');
    assert.deepEqual([mv.id, mv.x, mv.y, mv.h], [wa.you, 5.5, 6.25, 1.5]);
    await sleep(200);
    assert.ok(!a.inbox.some((m) => m.t === 'mv'));
  });

  await step('đổi phòng: tp cập nhật toạ độ cũ — mv sau cú nhảy không bị kẹp về chỗ cũ', async () => {
    send(b, { t: 'mv', x: 12, y: 34 }); // đi vài bước quanh sân — tiêu gói mvFirst sau hello
    await sleep(150);
    a.inbox.length = 0;
    send(b, { t: 'tp', x: 1125, y: 25 });                  // «vào điện»: nhảy > 25 ô (đúng probe: 20,30 → 1125,25)
    await sleep(150);
    send(b, { t: 'mv', x: 1125.5, y: 25.5, h: 0, s: 0 });  // bước đầu trong điện
    const mv = await wait(a, (m) => m.t === 'mv');
    assert.deepEqual([mv.x, mv.y], [1125.5, 25.5], 'mv sau tp phải đi qua, không bị sanityMv kẹp về 12,34');
    send(b, { t: 'mv', x: 1125.6, y: 25.6 });              // đi tiếp trong điện vẫn bình thường
    const mv2 = await wait(a, (m) => m.t === 'mv');
    assert.deepEqual([mv2.x, mv2.y], [1125.6, 25.6]);
    // đối chứng: nhảy thẳng KHÔNG qua tp (> 25 ô) → guard còn nguyên, bị kẹp về toạ độ cũ
    send(b, { t: 'mv', x: 1160, y: 25.6 }); // 34,4 ô > ngưỡng 25 ô
    const clamped = await wait(a, (m) => m.t === 'mv');
    assert.deepEqual([clamped.x, clamped.y], [1125.6, 25.6], 'nhảy không báo tp vẫn bị sanityMv kẹp');
    a.inbox.length = 0;
  });

  await step('Tàng Y Các: đổi trang bị phát cho người khác, món lạ bị lọc; người vào sau thấy trang bị', async () => {
    send(a, { t: 'cos', c: 'r:y_hoa,h:kim_quan,b:hack,m:hac' });
    const c = await wait(b, (m) => m.t === 'cos');
    assert.equal(c.id, wa.you); assert.equal(c.c, 'r:y_hoa,h:kim_quan,m:hac');
    const d = await client(R0, 'Sen'); const wd = await hello(d);
    assert.equal(wd.players.find((p) => p.id === wa.you)?.cos, 'r:y_hoa,h:kim_quan,m:hac');
    d.ws.close(); await wait(a, (m) => m.t === 'leave'); await wait(b, (m) => m.t === 'leave');
    a.inbox.length = 0; b.inbox.length = 0;
  });

  await step('cử chỉ + cụm từ soạn sẵn tới mọi người; chat tự do bị bỏ', async () => {
    send(b, { t: 'emo', e: 'bow', to: wa.you });
    const e = await wait(a, (m) => m.t === 'emo');
    assert.equal(e.e, 'bow'); assert.equal(e.to, wa.you); assert.equal(e.id, wb.you);
    send(b, { t: 'say', k: 'hi' });
    assert.equal((await wait(a, (m) => m.t === 'say')).k, 'hi');
    send(b, { t: 'say', k: 'lời tự do' });
    await sleep(300);
    assert.ok(!a.inbox.some((m) => m.t === 'say'));
  });

  await step('bồ đoàn: mỗi chỗ một người, đứng dậy trả chỗ', async () => {
    send(a, { t: 'sit' });
    const sa = await wait(a, (m) => m.t === 'seat');
    send(b, { t: 'sit' });
    const sb = await wait(b, (m) => m.t === 'seat');
    assert.notEqual(sa.i, sb.i); assert.ok(sa.i >= 0 && sb.i >= 0);
    await sleep(150);
    b.inbox = b.inbox.filter((m) => m.t !== 'seats'); // bỏ gói seats cũ (lúc mới ngồi)
    send(a, { t: 'stand' });
    const s = await wait(b, (m) => m.t === 'seats' && m.taken.length === 1);
    assert.deepEqual(s.taken, [sb.i]);
    send(b, { t: 'stand' });
  });

  await step('tên thô tục bị đổi thành «Khách»', async () => {
    const c = await client(R0, 'đéo ai');
    const w = await hello(c);
    assert.equal(w.renamed, 'Khách');
    const j = await wait(a, (m) => m.t === 'join');
    assert.equal(j.p.name, 'Khách');
    c.ws.close();
    await wait(a, (m) => m.t === 'leave' && m.id === w.you);
  });

  await step('báo cáo: ghi nhận một lần', async () => {
    send(a, { t: 'report', id: wb.you, why: 'spam' });
    await wait(a, (m) => m.t === 'reported' && m.id === wb.you);
    send(a, { t: 'report', id: wb.you, why: 'spam' });
    await sleep(300);
    assert.ok(!a.inbox.some((m) => m.t === 'reported'));
  });

  await step('rời phòng → leave + count giảm', async () => {
    b.ws.close();
    await wait(a, (m) => m.t === 'leave' && m.id === wb.you);
    await wait(a, (m) => m.t === 'count' && m.n === 1);
  });

  await step('spam > 20 gói/giây → bị ngắt (4002)', async () => {
    const s = await client(R0 + 1, 'Spam');
    await hello(s);
    for (let i = 0; i < 40; i++) send(s, { t: 'emo', e: 'wave' });
    for (let i = 0; i < 60 && s.closed == null; i++) await sleep(50);
    assert.equal(s.closed, CLOSE_SPAM);
  });

  await step(`phòng đầy ${ROOM_CAP} người → người tiếp theo nhận full (4001)`, async () => {
    const room = R0 + 2;
    const crowd = [];
    for (let i = 0; i < ROOM_CAP; i++) { const c = await client(room, 'K' + i); await hello(c); crowd.push(c); }
    const extra = await client(room, 'Thừa');
    await wait(extra, (m) => m.t === 'full');
    for (let i = 0; i < 60 && extra.closed == null; i++) await sleep(50);
    assert.equal(extra.closed, CLOSE_FULL);
    crowd.forEach((c) => c.ws.close());
  });

  a.ws.close();
  console.log(`\n${passed} test đạt`);
  process.exit(0);
} catch (e) {
  console.error('✗', e.message);
  console.log(`\n${passed} test đạt — CÓ LỖI`);
  process.exit(1);
}
