// Test giao thức MMO Huyền Quán (src/game/protocol.js + net.js). Chạy: node scripts/test-quan-protocol.mjs
import assert from 'node:assert/strict';
import * as P from '../src/game/protocol.js';
import { createNet } from '../src/game/net.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };
const testA = (name, fn) => pending.push((async () => { try { await fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } })());
const pending = [];
const J = (o) => JSON.stringify(o);

test('Lọc tên: ký tự điều khiển, HTML, độ dài, từ thô tục', () => {
  assert.equal(P.cleanName('  Mây​  Thong   Thả '), 'Mây Thong Thả');
  assert.equal(P.cleanName('<b>Trúc</b>'), 'bTrúc/b');
  assert.equal(P.cleanName('x'.repeat(40)).length, 24);
  assert.equal(P.cleanName('đéo ai'), null);
  assert.equal(P.cleanName('   '), null);
});

test('hello: tên xấu → «Khách», áo sai → Thổ, pid sai → null', () => {
  const h = P.parseClient(J({ t: 'hello', name: 'fuck you', robe: 'X', pid: '../x' }));
  assert.equal(h.name, 'Khách'); assert.equal(h.badName, true); assert.equal(h.robe, '土'); assert.equal(h.pid, null);
  const ok = P.parseClient(J({ t: 'hello', name: 'Sương', robe: '水', pid: 'abcd1234-ef' }));
  assert.equal(ok.name, 'Sương'); assert.equal(ok.robe, '水'); assert.equal(ok.pid, 'abcd1234-ef');
});

test('mv: chặn toạ độ ngoài bản đồ / NaN, làm tròn', () => {
  assert.equal(P.parseClient(J({ t: 'mv', x: -2700, y: 3 })), null); // thế giới v4 8.192 m: biên ±2.560 ô
  assert.equal(P.parseClient(J({ t: 'mv', x: 5, y: 2700 })), null);
  assert.ok(P.parseClient(J({ t: 'mv', x: -300, y: 400 })), 'thế giới mở: toạ độ xa tâm vẫn hợp lệ');
  assert.equal(P.parseClient(J({ t: 'mv', x: 'a', y: 3 })), null);
  assert.deepEqual(P.parseClient(J({ t: 'mv', x: 3.14159, y: 2, h: 1.23456, s: true })), { t: 'mv', x: 3.14, y: 2, h: 1.23, s: 1, a: 0, w: 0, b: 0, fs: 0 });
  // trạng thái nước: 2 = bơi; 3 = trên thuyền, b = loại thuyền; giá trị lạ → 0
  assert.deepEqual([P.parseClient(J({ t: 'mv', x: 1, y: 1, w: 2 })).w, P.parseClient(J({ t: 'mv', x: 1, y: 1, w: 3, b: 2 })).b, P.parseClient(J({ t: 'mv', x: 1, y: 1, w: 9, b: 2 })).w, P.parseClient(J({ t: 'mv', x: 1, y: 1, w: 2, b: 2 })).b], [2, 2, 0, 0]);
  // độ cao ngự kiếm: kẹp 0–420, làm tròn
  assert.equal(P.parseClient(J({ t: 'mv', x: 1, y: 1, a: 999 })).a, 420);
  assert.equal(P.parseClient(J({ t: 'mv', x: 1, y: 1, a: 25.6 })).a, 26);
});

// ── tp: nhảy đổi phòng do client chủ động — cùng biên thế giới như mv, làm tròn; ──
test('tp: đúng biên thế giới như mv, làm tròn; ngoài bản đồ / NaN bị bỏ', () => {
  assert.deepEqual(P.parseClient(J({ t: 'tp', x: 1125.256, y: 25 })), { t: 'tp', x: 1125.26, y: 25 }); // vào điện xa > 25 ô vẫn hợp lệ
  assert.equal(P.parseClient(J({ t: 'tp', x: -2700, y: 3 })), null);
  assert.equal(P.parseClient(J({ t: 'tp', x: 5, y: 2700 })), null);
  assert.equal(P.parseClient(J({ t: 'tp', x: 'a', y: 3 })), null);
});

test('emo / say chỉ nhận mã có sẵn (không chat tự do)', () => {
  assert.ok(P.parseClient(J({ t: 'emo', e: 'bow' })));
  assert.equal(P.parseClient(J({ t: 'emo', e: '<script>' })), null);
  assert.equal(P.parseClient(J({ t: 'say', k: 'hi' })).k, 'hi');
  assert.equal(P.parseClient(J({ t: 'say', k: 'free text' })), null);
});

test('gói rác / quá dài / loại lạ bị bỏ', () => {
  assert.equal(P.parseClient('{bad json'), null);
  assert.equal(P.parseClient('x'.repeat(600)), null);
  assert.equal(P.parseClient(J({ t: 'admin' })), null);
  assert.equal(P.parseClient(J({ t: 'report', id: 'a', why: 'nope' })), null);
  assert.ok(P.parseClient(J({ t: 'report', id: 'a1', why: 'spam' })));
});

test('Giới hạn tốc độ 20 gói/giây', () => {
  const gate = P.rateGate(20);
  let ok = 0; for (let i = 0; i < 25; i++) if (gate(1000)) ok++;
  assert.equal(ok, 20);
  assert.equal(gate(2001), true, 'sang giây mới được gửi lại');
});

test('Nội suy: bước tối đa, nhảy thẳng khi quá xa', () => {
  assert.deepEqual(P.approach({ x: 0, y: 0 }, { x: 1, y: 0 }, 0.25), { x: 0.25, y: 0 });
  assert.deepEqual(P.approach({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.25), { x: 10, y: 0 });
  assert.deepEqual(P.approach({ x: 0, y: 0 }, { x: 0.1, y: 0 }, 0.25), { x: 0.1, y: 0 });
});

// ── Vá audit: title phải qua bộ lọc tương tự cleanName ──
test('title: qua bộ lọc cleanName — HTML/ký tự điều khiển/thô tục bị lọc, không chỉ slice', () => {
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: '<b>Đại sư</b>' })).title, 'bĐại sư/b');
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: 'a\u0000b\u200bc' })).title, 'abc');
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: '   ' })).title, '');
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: 'đéo ai' })).title, '');
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: 'dm ' })).title, '');
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: 'x'.repeat(40) })).title.length, 24);
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương', title: 123 })).title, ''); // không phải chuỗi → ''
  assert.equal(P.parseClient(J({ t: 'hello', name: 'Sương' })).title, '');             // thiếu → ''
  assert.equal(P.cleanTitle('Thám Hoa'), 'Thám Hoa'); // danh hiệu đẹp thì giữ nguyên
});

// ── Vá audit: sanity mv dùng chung máy chủ (NaN / bước nhảy > ~40 m/gói ≈ 25 ô → kẹp về toạ độ cũ) ──
test('sanityMv: NaN/Infinity → giữ trục cũ; bước nhảy quá 25 ô (~40 m) → kẹp về toạ độ cũ', () => {
  const a = { x: 10, y: 7 };
  assert.deepEqual(P.sanityMv(a, NaN, NaN), { x: 10, y: 7 }); // NaN cả hai trục → về toạ độ cũ
  assert.deepEqual(P.sanityMv(a, NaN, 8), { x: 10, y: 8 });   // NaN ở x → giữ x cũ, y hợp lệ thì qua
  assert.deepEqual(P.sanityMv(a, 11, Infinity), { x: 11, y: 7 }); // Infinity ở y → giữ y cũ
  assert.deepEqual(P.sanityMv(a, 10.5, 7.5), { x: 10.5, y: 7.5 });
  assert.deepEqual(P.sanityMv(a, 10 + 24, 7), { x: 34, y: 7 });      // 24 ô ≈ 38,4 m — qua
  assert.deepEqual(P.sanityMv(a, 10 + 25, 7), { x: 35, y: 7 });      // đúng ngưỡng 25 ô = 40 m — qua
  assert.deepEqual(P.sanityMv(a, 10 + 25.01, 7), { x: 10, y: 7 });   // vượt 40 m — kẹp
  assert.deepEqual(P.sanityMv(a, 10, 7 - 26), { x: 10, y: 7 });      // nhảy −41,6 m — kẹp
});

// ── Mock môi trường browser để test net.js trong node (WebSocket/location/window giả) ──
class FakeWS {
  constructor(url) { FakeWS.last = this; this.url = url; this.readyState = 0; this.sent = []; }
  send(d) { this.sent.push(d); }
  close(code, reason) { this.readyState = 3; try { this.onclose?.({ code, reason }); } catch (e) { /* ignore */ } }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
globalThis.WebSocket = FakeWS;
globalThis.location = { search: '', protocol: 'https:', host: 'test.local' };
globalThis.window = {};
// Tạo client net, mở kết nối giả và trả lời welcome → đủ điều kiện gửi gói lên.
const mkNet = () => {
  const net = createNet({ profile: () => ({ name: 'Tâm', robe: '土', title: '' }) });
  net.start();
  const sock = FakeWS.last;
  sock.readyState = 1; // WebSocket thật tự mở; mock phải mở tay trước onopen
  sock.onopen();
  sock.onmessage({ data: J({ t: 'welcome', you: 'me', room: 0, seats: [], players: [] }) });
  return { net, sock };
};

// ── Vá audit: hợp đồng seat — đường THẤT BẠI (máy chủ timeout/hết chỗ) → -1 «không có
// ghế»; ngoại tuyến là offline-first (main.js «mất mạng vẫn chơi đơn») → trả ghế cục bộ
// hợp lệ để ngồi trà vẫn chạy khi không có mạng. ──
testA('seat hợp đồng: ngoại tuyến → ghế cục bộ hợp lệ (≥ 0), không phải -1', async () => {
  const net = createNet({ profile: () => ({ name: 'Tâm', robe: '土', title: '' }) });
  const i = await net.requestSeat();
  assert.ok(i >= 0 && i < P.SEATS.length, `ngoại tuyến phải trả chỉ số ghế hợp lệ để ngồi trà được (nhận ${i})`);
});

testA('seat: gọi chồng khi waiter chưa xong → dùng lại cùng promise; máy chủ trả seat → nhận đúng chỉ số', async () => {
  const { net, sock } = mkNet();
  const p1 = net.requestSeat();
  const p2 = net.requestSeat();
  assert.equal(p1, p2, 'gọi lần 2 khi waiter chưa xong phải trả cùng promise');
  sock.onmessage({ data: J({ t: 'seat', i: 1 }) });
  assert.equal(await p1, 1);
  const p3 = net.requestSeat();
  assert.notEqual(p3, p1, 'vòng cũ đã xong thì gọi lại phải tạo promise mới');
  sock.onmessage({ data: J({ t: 'seat', i: 2 }) });
  assert.equal(await p3, 2);
});

testA('seat: máy chủ không trả lời → timeout ~1,5 s resolve -1', async () => {
  const { net } = mkNet();
  const t0 = Date.now();
  assert.equal(await net.requestSeat(), -1);
  assert.ok(Date.now() - t0 >= 1400, 'phải chờ đủ ~1,5 s rồi mới trả -1');
});

// ── Vá audit: điều kiện gửi mv thêm thay đổi heading và cập nhật lastSent.h ──
testA('mv: đổi heading phải gửi mv (kể cả đứng yên) và ghi lastSent.h; đứng nguyên thì không gửi', async () => {
  const { net, sock } = mkNet();
  await sleep(140); // trong node performance.now() tính từ lúc khởi động — qua cửa 8 Hz trước tick đầu
  sock.sent = [];
  net.tick(0.02, { x: 5, y: 5, h: 0.4, sitting: false, alt: 0 });
  let mv = sock.sent.map((d) => JSON.parse(d)).find((m) => m.t === 'mv');
  assert.ok(mv, 'vị trí mới phải gửi mv');
  assert.equal(mv.h, 0.4);
  await sleep(140); // qua cửa 8 Hz (MOVE_HZ)
  sock.sent = [];
  net.tick(0.02, { x: 5, y: 5, h: 1.2, sitting: false, alt: 0 }); // chỉ quay người
  mv = sock.sent.map((d) => JSON.parse(d)).find((m) => m.t === 'mv');
  assert.ok(mv, 'đổi h mà đứng yên vẫn phải gửi mv');
  assert.equal(mv.h, 1.2);
  await sleep(140);
  sock.sent = [];
  net.tick(0.02, { x: 5, y: 5, h: 1.2, sitting: false, alt: 0 }); // không đổi gì
  assert.equal(sock.sent.length, 0, 'không đổi gì thì không gửi gói nào');
});

test('lư hương chung: lư lớn nhận 15 người, đầy thì sang lư nhỏ vắng nhất; nén tàn thì nhả chỗ; 9 lư kín thì −1', () => {
  const now = 1e12, L = [];
  assert.equal(P.parseClient(J({ t: 'inc', k: 5 })).t, 'inc');
  for (let i = 0; i < 15; i++) { assert.equal(P.pickBurner(L, now), 0); L.push({ k: 0, at: now }); }
  const k1 = P.pickBurner(L, now); assert.ok(k1 >= 1 && k1 <= 8); L.push({ k: k1, at: now });
  const k2 = P.pickBurner(L, now); assert.notEqual(k2, k1, 'lư nhỏ vắng nhất');
  assert.equal(P.pickBurner(L, now + P.INCENSE_MS + 1), 0, 'nén tàn → lư lớn trống lại');
  const full = []; P.BURNER_CAP.forEach((c, k) => { for (let i = 0; i < c; i++) full.push({ k, at: now }); });
  assert.equal(P.pickBurner(full, now), -1);
  assert.ok(P.BURNER_CAP.reduce((a, b) => a + b, 0) >= P.ROOM_CAP, 'đủ lư cho cả phòng');
});

await Promise.all(pending);
console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
