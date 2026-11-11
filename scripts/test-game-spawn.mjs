// v4 — nơi xuất hiện (spawn.js) + hướng dẫn tân thủ (tutorial.js) + máy chủ nhận nơi xuất hiện trong biên (protocol hello).
import assert from 'node:assert/strict';
import * as SP from '../src/game/spawn.js';
import * as TUT from '../src/game/tutorial.js';
import { parseClient, WORLD_TILES, inAoi, AOI_TILES, AOI_FAR_MS } from '../src/game/protocol.js';

let n = 0; const test = (name, fn) => { fn(); n++; console.log('✓', name); };
const plaza = { x: 3, z: 43 }, now = 1e12;
const templeOf = (w) => ({ x: 100, z: 200, name: `Miếu ${w}` });

test('lần đầu: chỉ Tân Thủ', () => {
  const o = SP.spawnOptions({ firstTime: true, plaza, now });
  assert.equal(o.length, 1); assert.equal(o[0].id, 'tanthu'); assert.ok(o[0].def);
});
test('các lần sau: chỗ lần trước (mặc định) · nhà · miếu hợp mệnh · sân Sơn Môn', () => {
  const o = SP.spawnOptions({ lastPos: { x: 5, z: 6, at: now - 1000 }, home: { x: 9, z: 9, name: 'Tiểu xá' }, templeOf, plaza, yong: '水', now });
  assert.deepEqual(o.map((x) => x.id), ['last', 'home', 'menh', 'plaza']);
  assert.ok(o[0].def); assert.equal(o.filter((x) => x.def).length, 1);
  assert.match(o[2].label, /Thủy/); assert.match(o[2].label, /Miếu kan/);
});
test('vị trí cũ quá 30 ngày / hỏng → bỏ; không nhà, không Dụng thần → chỉ còn sân', () => {
  const o = SP.spawnOptions({ lastPos: { x: 5, z: 6, at: now - 31 * 86400000 }, plaza, now });
  assert.deepEqual(o.map((x) => x.id), ['plaza']); assert.ok(o[0].def);
  assert.deepEqual(SP.spawnOptions({ lastPos: { x: NaN, z: 1, at: now }, plaza, now }).map((x) => x.id), ['plaza']);
});
test('mỗi Dụng thần ứng một cung có miếu', () => { for (const w of ['水', '木', '火', '土', '金']) assert.ok(SP.WARD_OF_WX[w]); });
test('không lưu vị trí trong dải phòng nội thất / toạ độ hỏng', () => {
  assert.ok(SP.savablePos(10, 10, 1914)); assert.ok(!SP.savablePos(1900, 10, 1914)); assert.ok(!SP.savablePos(NaN, 0, 1914));
});
test('tân thủ: đi đúng thứ tự, làm trước bước sau thì tới lượt tự qua, thưởng cộng dồn, hết thì done', () => {
  const s = {};
  assert.equal(TUT.current(s).id, 'chart');
  assert.equal(TUT.advance(s, 'buy'), null); // làm trước bước 5 → ghi nhận, chưa qua
  let r = TUT.advance(s, 'chart'); assert.equal(r.step, 1); assert.equal(r.reward, 5);
  r = TUT.advance(s, 'askMaster'); assert.equal(TUT.current(s).id, 'que');
  TUT.advance(s, 'que'); r = TUT.advance(s, 'travel'); // bước 4 xong → bước 5 (buy) đã làm trước → qua luôn
  assert.equal(TUT.current(s).id, 'shift'); assert.equal(r.reward, 10);
  for (const e of ['shift', 'pray', 'estate']) r = TUT.advance(s, e);
  assert.ok(r.finished); assert.equal(TUT.current(s), null); assert.equal(TUT.advance(s, 'chart'), null);
});
test('tân thủ: bỏ qua → không còn bước; sự kiện lạ không làm gì', () => {
  const s = {}; assert.equal(TUT.advance(s, 'xyz'), null); TUT.skip(s); assert.equal(TUT.current(s), null); assert.equal(TUT.advance(s, 'chart'), null);
});
test('máy chủ: hello mang nơi xuất hiện trong biên thì nhận, ngoài biên / hỏng thì bỏ (dùng START)', () => {
  const ok = parseClient(JSON.stringify({ t: 'hello', name: 'An', x: 20, y: 30 }));
  assert.equal(ok.x, 20); assert.equal(ok.y, 30);
  const out = parseClient(JSON.stringify({ t: 'hello', name: 'An', x: WORLD_TILES.maxX + 5, y: 30 }));
  assert.equal(out.x, null); assert.equal(out.y, null);
  const bad = parseClient(JSON.stringify({ t: 'hello', name: 'An', x: 'a', y: 30 }));
  assert.equal(bad.x, null);
});
test('phát theo vùng: trong ~600 m là gần, xa hơn là xa; gói xa thưa ≥ 1 giây', () => {
  assert.ok(inAoi({ x: 0, y: 0 }, { x: AOI_TILES - 1, y: 0 })); assert.ok(!inAoi({ x: 0, y: 0 }, { x: AOI_TILES + 5, y: 0 }));
  assert.ok(Math.abs(AOI_TILES * 1.6 - 600) < 2); assert.ok(AOI_FAR_MS >= 1000);
});
console.log(`\n${n} test xuất hiện + tân thủ + phát theo vùng đạt.`);
