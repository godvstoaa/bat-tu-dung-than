// Test tích hợp máy chủ MMO Huyền Quán (worker/quan-room.js) qua WebSocket thật.
// Cần `npm run dev:mmo` đang chạy (cổng 8788). Chạy: node scripts/test-quan-mmo.mjs [ws://127.0.0.1:8788]
import assert from 'node:assert/strict';
import { ROOM_CAP, CLOSE_SPAM, CLOSE_FULL } from '../src/game/protocol.js';
import { encodeLayout, LISTING_COUNT } from '../src/game/estate-core.js';
import { workplaces, CMINE } from '../src/game/guild-core.js';

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

  await step('v4 phát theo vùng: người ở xa (> 600 m) chỉ nhận gói thưa (≤ 1 gói / 2 giây)', async () => {
    send(b, { t: 'mv', x: 1200, y: 34 }); await sleep(2200); a.inbox.length = 0; // B ra xa A (đang ở sân)
    for (let i = 0; i < 6; i++) { send(b, { t: 'mv', x: 1200 + i * 0.2, y: 34 }); await sleep(60); }
    await sleep(300);
    assert.ok(a.inbox.filter((m) => m.t === 'mv').length <= 1, 'xa thì thưa');
    send(b, { t: 'tp', x: 12, y: 34 }); await sleep(150);
  });

  await step('đổi phòng: tp cập nhật toạ độ cũ — mv sau cú nhảy không bị kẹp về chỗ cũ', async () => {
    send(b, { t: 'mv', x: 12, y: 34 }); // đi vài bước quanh sân — tiêu gói mvFirst sau hello
    await sleep(150);
    send(a, { t: 'tp', x: 1120, y: 25 }); await sleep(100); // v4 phát theo vùng: A đứng cùng khu với B (trong ~600 m) mới nhận mọi gói
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

  await step('lư hương chung: thắp phát cho cả phòng, lư lớn trước, mỗi người một tuần nhang; người vào sau thấy nhang đang cháy', async () => {
    send(a, { t: 'inc' });
    const ia = await wait(b, (m) => m.t === 'inc');
    assert.equal(ia.k, 0); assert.equal(ia.ago, 0);
    await wait(a, (m) => m.t === 'inc');
    a.inbox = a.inbox.filter((m) => m.t !== 'inc'); b.inbox = b.inbox.filter((m) => m.t !== 'inc');
    send(a, { t: 'inc' }); // đang cháy → bỏ qua
    await sleep(300);
    assert.ok(!b.inbox.some((m) => m.t === 'inc'), 'một người không thắp chồng');
    const c = await client(R0, 'Khách Hương');
    const w = await hello(c);
    assert.ok(Array.isArray(w.inc) && w.inc.some(([k, ago]) => k === 0 && ago >= 0 && ago < 60000));
    c.ws.close();
    await wait(a, (m) => m.t === 'leave' && m.id === w.you);
    a.inbox = a.inbox.filter((m) => m.t !== 'join' && m.t !== 'leave' && m.t !== 'count'); // không để gói của khách thử lẫn sang bước sau
  });

  await step('kinh tế (Economy DO): khách gửi tiền có trần, chống gửi trùng, mua → nấu → ăn; mã gói q không bị trường kết quả đè; khách không ký gửi được', async () => {
    const ask = async (op, x = {}) => { const q = 900 + Math.floor(Math.random() * 1e5); send(a, { t: 'ec', op, a: x, q }); return wait(a, (m) => m.t === 'ec_res' && m.q === q, 6000); };
    assert.match((await ask('deposit', { xu: 40000, k: 'big' })).err, /300 đồng/);
    assert.ok((await ask('deposit', { xu: 20000, k: 'd1' })).ok);
    assert.ok((await ask('deposit', { xu: 20000, k: 'd1' })).dup);
    assert.ok((await ask('th_buy', { id: 'gao', n: 1, k: 'b1' })).ok);
    const ck = await ask('th_buy', { id: 'rau', n: 1, k: 'b2' }); assert.ok(ck.ok);
    const c2 = await ask('cook', { id: 'chao_rau', score: 0.8 }); assert.ok(c2.ok && c2.n === 3 && c2.qual > 0 && c2.qual <= 1, JSON.stringify(c2).slice(0, 200));
    const e = await ask('eat', { i: c2.inv.findIndex((s) => s.id === 'chao_rau') }); assert.ok(e.ok && e.full > 0);
    assert.match((await ask('mk_post', { i: 0, n: 1, price: 300 })).err, /đăng nhập/);
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

  // --- Nhà riêng Thành Bát Quái (Estate DO dùng chung mọi shard)
  {
    const ea = await client(R0 + 4, 'Chủ'); await hello(ea);
    const eb = await client(R0 + 4, 'Khách'); await hello(eb);
    let q = 100;
    const ask = async (c, o) => { const id = ++q; send(c, { ...o, q: id }); return wait(c, (m) => m.t === 'est_res' && m.q === id); };
    const lst = await ask(ea, { t: 'est_list' });
    const free = [...Array(LISTING_COUNT).keys()].filter((h) => !lst.list.some(([x]) => x === h));
    assert.ok(free.length >= 2, 'cần ≥ 2 căn trống (xoá .wrangler state nếu đầy)');
    const [h1, h2] = free;
    await step('nhà: mua căn trống được; người thứ hai mua cùng căn → taken; mỗi người một căn → limit', async () => {
      const r = await ask(ea, { t: 'est_claim', h: h1 }); assert.equal(r.ok, true);
      const up = await wait(eb, (m) => m.t === 'est_up' && m.h === h1); assert.equal(up.name, 'Chủ');
      assert.equal((await ask(eb, { t: 'est_claim', h: h1 })).err, 'taken');
      assert.equal((await ask(ea, { t: 'est_claim', h: h2 })).err, 'limit');
      const l2 = await ask(ea, { t: 'est_list' }); assert.equal(l2.mine, h1); assert.ok(l2.list.some(([x, n]) => x === h1 && n === 'Chủ'));
    });
    const it = encodeLayout([{ u: 1, i: 'ban_tho', x: 0, z: -3, r: 0 }, { u: 2, i: 'ban_tra', x: 2.5, z: -0.5, r: 0 }]);
    await step('nhà: người không phải chủ không lưu được; chủ lưu bố cục → khách est_get thấy đúng', async () => {
      assert.equal((await ask(eb, { t: 'est_save', h: h1, it, c: 2 })).err, 'notowner');
      assert.equal((await ask(ea, { t: 'est_save', h: h1, it, c: 2 })).ok, true);
      const g = await ask(eb, { t: 'est_get', h: h1 }); assert.equal(g.it, it); assert.equal(g.c, 2); assert.equal(g.name, 'Chủ');
    });
    await step('nhà: bố cục sai (đè nhau / ra ngoài phòng) bị máy chủ bỏ, không trả lời', async () => {
      const bad = encodeLayout([{ u: 1, i: 'ban_tho', x: 0, z: -3, r: 0 }, { u: 2, i: 'ban_tho', x: 0.5, z: -3, r: 0 }]);
      send(ea, { t: 'est_save', h: h1, it: bad, c: 0, q: 9999 });
      await sleep(400); assert.ok(!ea.inbox.some((m) => m.q === 9999));
      const g = await ask(eb, { t: 'est_get', h: h1 }); assert.equal(g.it, it);
    });
    await step('nhà: khen mỗi người một lần, chủ không tự khen; bán lại → căn trống', async () => {
      const k1 = await ask(eb, { t: 'est_like', h: h1 }); assert.equal(k1.ok, true); assert.equal(k1.likes, 1);
      assert.equal((await ask(eb, { t: 'est_like', h: h1 })).err, 'dup');
      assert.equal((await ask(ea, { t: 'est_like', h: h1 })).err, 'self');
      assert.equal((await ask(eb, { t: 'est_release', h: h1 })).err, 'notowner');
      assert.equal((await ask(ea, { t: 'est_release', h: h1 })).ok, true);
      assert.equal((await ask(eb, { t: 'est_get', h: h1 })).err, 'empty');
      const l3 = await ask(ea, { t: 'est_list' }); assert.equal(l3.mine, null);
    });
    ea.ws.close(); eb.ws.close();
  }

  // --- Việc làm (Guild DO, P2): máy chủ giữ chỗ, kiểm vị trí theo toạ độ nó biết, chặn làm vội
  {
    const wa = await client(R0 + 5, 'Thợ'); await hello(wa);
    let q = 500;
    const ask = async (o) => { const id = ++q; send(wa, { ...o, q: id }); return wait(wa, (m) => m.t === 'job_res' && m.q === id); };
    const tile = (p) => ({ x: p.x / 1.6 + 10, y: p.z / 1.6 + 7 });
    const taverns = [...workplaces().values()].filter((w) => w.type === 'tuu');
    await step('việc làm: job_me có hồ sơ nghề mới (uy tín 50); bảng Chiêu công tửu lâu 3·3·1·1 chỗ', async () => {
      const me = await ask({ t: 'job_me' }); assert.equal(me.ok, true); assert.equal(me.career.rep, 50); assert.equal(me.shift, null);
      const b = await ask({ t: 'job_board', k: taverns[0].k }); assert.equal(b.ok, true); assert.deepEqual(b.layout, [3, 3, 1, 1]);
    });
    let k = null;
    await step('việc làm: xin chỗ Học việc; đứng ngoài tiệm thì không vào ca được (far); vào tiệm thì vào ca, làm vội bị chặn', async () => {
      for (const w of taverns) { const r = await ask({ t: 'job_apply', k: w.k, r: 0, y: { primary: '火', accent: '木', ji: '水' } }); if (r.ok) { k = w.k; break; } assert.equal(r.err, 'full'); }
      assert.ok(k != null, 'mọi tửu lâu hết chỗ Học việc (xoá .wrangler state)');
      assert.equal((await ask({ t: 'job_start', job: 'bep', k })).err, 'far');
      const room = workplaces().get(k).room, t = tile(room);
      send(wa, { t: 'tp', x: t.x, y: t.y });
      const s = await ask({ t: 'job_start', job: 'bep', k }); assert.equal(s.ok, true, s.err); assert.equal(s.shift.rel, 'dung'); assert.ok(s.shift.task.seed > 0);
      const f = await ask({ t: 'job_task', seed: s.shift.task.seed, sc: 0.7 }); assert.equal(f.err, 'fast');
      const e = await ask({ t: 'job_end' }); assert.equal(e.ok, true); assert.equal(e.quit, true); assert.equal(e.paid, 0);
      const qq = await ask({ t: 'job_quit' }); assert.equal(qq.ok, true);
    });
    await step('việc làm: thợ mỏ không cần chỗ, phải đứng trong mỏ dân sự; mạch quặng có sổ', async () => {
      const t = tile({ x: CMINE.x, z: CMINE.z }); send(wa, { t: 'tp', x: t.x, y: t.y });
      const s = await ask({ t: 'job_start', job: 'mo' }); assert.equal(s.ok, true, s.err);
      const o = await ask({ t: 'job_ores' }); assert.equal(o.ok, true); assert.equal(Object.keys(o.ores).length, 10);
      const e = await ask({ t: 'job_end' }); assert.equal(e.ok, true);
      assert.equal((await ask({ t: 'job_start', job: 'xx' }).catch(() => ({ err: 'dropped' }))).err, 'dropped');
    });
    wa.ws.close();
  }

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
