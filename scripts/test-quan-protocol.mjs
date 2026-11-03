// Test giao thức MMO Huyền Quán (src/game/protocol.js). Chạy: node scripts/test-quan-protocol.mjs
import assert from 'node:assert/strict';
import * as P from '../src/game/protocol.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };
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
  assert.equal(P.parseClient(J({ t: 'mv', x: -700, y: 3 })), null);
  assert.equal(P.parseClient(J({ t: 'mv', x: 5, y: 999 })), null);
  assert.ok(P.parseClient(J({ t: 'mv', x: -300, y: 400 })), 'thế giới mở: toạ độ xa tâm vẫn hợp lệ');
  assert.equal(P.parseClient(J({ t: 'mv', x: 'a', y: 3 })), null);
  assert.deepEqual(P.parseClient(J({ t: 'mv', x: 3.14159, y: 2, h: 1.23456, s: true })), { t: 'mv', x: 3.14, y: 2, h: 1.23, s: 1, a: 0 });
  // độ cao ngự kiếm: kẹp 0–420, làm tròn
  assert.equal(P.parseClient(J({ t: 'mv', x: 1, y: 1, a: 999 })).a, 420);
  assert.equal(P.parseClient(J({ t: 'mv', x: 1, y: 1, a: 25.6 })).a, 26);
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

console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
