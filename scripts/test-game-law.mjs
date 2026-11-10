// ============================================================================
//  TEST HUYỀN THÀNH LUẬT + PHÁ HỦY (thuần Node): định tội theo Bát Môn / ngày xung / ngũ hành / tái phạm,
//  khung hình phạt, thi hành (phạt, giam, khổ sai, vĩnh viễn), chuộc tội, đại xá, vượt ngục; gỡ / dựng lại va chạm
//  của công trình bị phá; máy chủ chỉ nhận gói raze hợp lệ (ngoài thành, khớp toạ độ); Thiên Lao / Khoáng Sơn.
// ============================================================================
import assert from 'node:assert/strict';
import * as THREE from 'three';
import * as LAW from '../src/game/law.js';
import * as LIFE from '../src/game/life.js';
import * as COIN from '../src/game/coins.js';
import { createState } from '../src/game/state.js';
import { addFootprint, flushFootprints, razeFootprint, restoreFootprint, footprints } from '../src/game/collide.js';
import { solidAt, tallTopAt, blockedByBuilding, platformTop } from '../src/game/obstacles.js';
import { parseClient } from '../src/game/protocol.js';
import { CITY_OCT, ROOM_X0 } from '../src/game/terrain.js';
import * as PR from '../src/game/prison.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const T0 = 1_800_000_000_000;

check('Bát Môn theo hướng từ tâm thành: Khảm (Bắc) = Hưu Môn ×1,6 · Chấn (Đông) = Thương Môn ×0,8 · Ly = Cảnh ×1,2', () => {
  assert.equal(LAW.guaAt(0, -900).gate, 'Hưu Môn'); assert.equal(LAW.GATE_FACTOR['Hưu Môn'], 1.6);
  assert.equal(LAW.guaAt(900, 0).gate, 'Thương Môn'); assert.equal(LAW.GATE_FACTOR['Thương Môn'], 0.8);
  assert.equal(LAW.guaAt(0, 900).gate, 'Cảnh Môn');
});
check('phạm Thái Tuế: địa chi ngày xung địa chi năm sinh (chữ Hán và chữ Việt)', () => {
  assert.ok(LAW.clash('甲午', '子')); assert.ok(LAW.clash('Giáp Ngọ', 'Tý')); assert.ok(LAW.clash('丙申', '寅'));
  assert.ok(!LAW.clash('甲子', '子')); assert.ok(!LAW.clash('', '子'));
});
check('điểm tội = cỡ × Bát Môn × ngày × ngũ hành × tái phạm', () => {
  const base = { x: 900, z: 0, size: 80, wx: '木', yong: { primary: '火', ji: '金' }, dayGZ: '甲子', birthChi: '子', priors: 0 };
  const a = LAW.assess(base); // 10 × 0,8 × 1 × 1,3 (Mộc sinh Hỏa = sinh trợ Dụng thần) × 1
  assert.equal(a.points, Math.round(10 * 0.8 * 1.3));
  const b = LAW.assess({ ...base, x: 0, z: -900, wx: '水', dayGZ: '甲午', priors: 2 }); // 10 × 1,6 × 1,5 × 1 × 2
  assert.equal(b.points, 48);
  const c = LAW.assess({ ...base, wx: '金' }); // Kỵ thần ×0,7
  assert.equal(c.points, Math.round(10 * 0.8 * 0.7));
});
check('khung hình phạt: < 20 phạt tiền · 20–60 giam · > 60 khổ sai · tiền án thứ 7 vĩnh viễn', () => {
  assert.equal(LAW.sentenceFor(10).kind, 'fine'); assert.equal(LAW.sentenceFor(10).fine, 1000 * COIN.DONG); // 1 lượng bạc
  assert.equal(LAW.sentenceFor(40).kind, 'jail'); assert.equal(LAW.sentenceFor(40).minutes, 10);
  assert.equal(LAW.sentenceFor(90).kind, 'mine'); assert.equal(LAW.sentenceFor(90).quota, 30);
  assert.equal(LAW.sentenceFor(5, LAW.PERMA_AT - 1).kind, 'perma');
});
check('thi hành: phạt trừ tiền; không đủ tiền thì giam; giam hết giờ tự mãn hạn', () => {
  const s = createState(); s.phucKhi = 0; LIFE.lifeState(s).xu = 4000 * COIN.DONG;
  const r1 = LAW.convict(s, { points: 10, gate: 'Thương Môn' }, T0);
  assert.equal(r1.kind, 'fine'); assert.equal(LIFE.walletXu(s), 3000 * COIN.DONG); assert.equal(s.law.record.length, 1); assert.equal(LAW.serving(s, T0), null);
  LIFE.lifeState(s).xu = 10 * COIN.DONG;
  const r2 = LAW.convict(s, { points: 12, gate: 'Thương Môn' }, T0);
  assert.equal(r2.kind, 'jail'); assert.ok(LAW.serving(s, T0 + 60000)); assert.equal(LAW.serving(s, T0 + 60 * 60000), null);
});
check('giam: chuộc tội 120 đồng / phút còn lại; vượt ngục → hạn còn lại gấp đôi', () => {
  const s = createState(); LIFE.lifeState(s).xu = 0;
  LAW.convict(s, { points: 40 }, T0); // 10 phút
  LAW.escaped(s, T0); assert.equal(s.law.sentence.until, T0 + 20 * 60000);
  assert.equal(LAW.bailCost(s, T0), 2400 * COIN.DONG); assert.equal(LAW.bail(s, T0), false);
  LIFE.lifeState(s).xu = 2500 * COIN.DONG; assert.equal(LAW.bail(s, T0), true); assert.equal(LIFE.walletXu(s), 100 * COIN.DONG); assert.equal(LAW.serving(s, T0), null);
});
check('khổ sai: đào đủ quặng thì được tha; bỏ trốn gấp đôi phần còn lại', () => {
  const s = createState();
  LAW.convict(s, { points: 90 }, T0); // 30 quặng
  for (let i = 0; i < 10; i++) LAW.mineOre(s);
  LAW.escaped(s); assert.equal(s.law.sentence.quota, 50);
  let freed = false; for (let i = 0; i < 40 && !freed; i++) freed = LAW.mineOre(s);
  assert.ok(freed); assert.equal(LAW.serving(s), null);
});
check('tái phạm lần 7: khổ sai vĩnh viễn — đào mãi không tha, chỉ Đại Xá (Ngọc) mới thoát', () => {
  const s = createState(); LIFE.lifeState(s).xu = 1e9;
  for (let i = 0; i < LAW.PERMA_AT - 1; i++) LAW.convict(s, { points: 5 }, T0);
  const r = LAW.convict(s, { points: 5 }, T0); assert.equal(r.kind, 'perma');
  for (let i = 0; i < 500; i++) assert.equal(LAW.mineOre(s), false);
  assert.ok(LAW.serving(s));
  const W = { ngoc: 100 }; assert.equal(LAW.pardon(s, W), false);
  W.ngoc = 400; assert.equal(LAW.pardon(s, W), true); assert.equal(W.ngoc, 100); assert.equal(LAW.serving(s), null);
  assert.ok(s.law.record.length <= Math.ceil(LAW.PERMA_AT / 2));
});
check('lưu / đọc lại: state.law có trong khung (hydrate giữ lại)', () => {
  const s = createState(); assert.ok('law' in s);
});
check('phá công trình: gỡ ô va chạm + hạ đỉnh leo trèo; dựng lại thì chặn như cũ', () => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 6)); m.position.set(800, 2.5, 40); m.updateMatrixWorld(true);
  addFootprint(m, { base: 0, fill: false }); flushFootprints();
  const rec = footprints().at(-1);
  assert.ok(rec.own.cells.length > 0); assert.ok(blockedByBuilding(800, 37.2)); assert.ok(tallTopAt(800, 40) > 4.9);
  razeFootprint(rec);
  assert.ok(!solidAt(800, 37.2) && !blockedByBuilding(800, 37.2), 'đã sập: đi qua được'); assert.equal(tallTopAt(800, 40) > 0, false);
  restoreFootprint(rec);
  assert.ok(blockedByBuilding(800, 37.2)); assert.ok(tallTopAt(800, 40) > 4.9);
  assert.equal(LAW.structId(rec.x, rec.z), 's800:40');
});
check('máy chủ: gói raze chỉ nhận công trình ngoài thành, id khớp toạ độ ô', () => {
  const tile = (x, z) => ({ x: x / 1.6 + 10, y: z / 1.6 + 7 });
  const out = CITY_OCT + 60, t = tile(out, 0);
  assert.ok(parseClient(JSON.stringify({ t: 'raze', id: `s${out}:0`, x: t.x, y: t.y })));
  const i = tile(300, 0);
  assert.equal(parseClient(JSON.stringify({ t: 'raze', id: 's300:0', x: i.x, y: i.y })), null, 'trong thành: đại trận');
  assert.equal(parseClient(JSON.stringify({ t: 'raze', id: `s${out + 50}:0`, x: t.x, y: t.y })), null, 'id lệch toạ độ');
  assert.equal(parseClient(JSON.stringify({ t: 'raze', id: 'x<script>', x: t.x, y: t.y })), null);
});
check('Thiên Lao / Khoáng Sơn: nằm trên dải nội thất, có nền đi được, 14 mạch quặng; nhận diện chỗ đứng', () => {
  PR.registerPrison();
  for (const b of [PR.JAIL, PR.MINE]) { assert.ok(b.x - b.w / 2 > ROOM_X0); assert.equal(platformTop(b.x, b.z + 6), 0); }
  assert.equal(PR.ORES.length, 14);
  for (const o of PR.ORES) assert.equal(PR.prisonAt(o.x, o.z), 'mine');
  const j = PR.jailSpawn(), mn = PR.mineSpawn();
  assert.equal(PR.prisonAt(j.x, j.z), 'jail'); assert.equal(PR.prisonAt(mn.x, mn.z), 'mine');
  assert.ok(!blockedByBuilding(j.x, j.z) && !blockedByBuilding(mn.x, mn.z), 'chỗ áp giải tới phải trống');
  assert.equal(PR.prisonAt(0, 0), null);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
