// ============================================================================
//  TEST NHÀ & XE (P4 — src/game/vehicles.js + life.js), thuần Node: mua, cưỡi, bảo trì, giữ xe, tủ đồ ăn, thức dậy cát tường,
//  và «hút tiền theo bậc giàu»: người càng nhiều tài sản (xe, nhà lớn) càng tốn bảo trì + thuế.
// ============================================================================
import assert from 'node:assert/strict';
import * as VE from '../src/game/vehicles.js';
import * as LIFE from '../src/game/life.js';
import * as ILL from '../src/game/illness.js';
import { BAC, DONG } from '../src/game/coins.js';
import { createState } from '../src/game/state.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const fresh = (xu = 0) => { const s = createState(); const L = LIFE.lifeState(s); L.xu = xu; return { s, L }; };
const payL = (L) => (a) => LIFE.pay(L, a);

check('5 bậc phương tiện: giá 3 / 15 / 60 / 400 / 2.000 lượng bạc, bậc tăng dần', () => {
  assert.deepEqual(Object.values(VE.VEHICLES).map((v) => v.price / BAC), [3, 15, 60, 400, 2000]);
  assert.deepEqual(Object.values(VE.VEHICLES).map((v) => v.tier), [1, 2, 3, 4, 5]);
});
check('mua trừ tiền; đã có / thiếu tiền bị từ chối; cưỡi ngựa nhanh ×1,6, lừa đỡ mệt 20%; xuống ngựa về ×1', () => {
  const { L } = fresh(20 * BAC);
  assert.equal(VE.buy(L, 'ngua', (x) => LIFE.payXu(L, x)).ok, true); assert.equal(L.xu, 5 * BAC);
  assert.equal(VE.buy(L, 'ngua', (x) => LIFE.payXu(L, x)).ok, false);
  assert.equal(VE.buy(L, 'xengua', (x) => LIFE.payXu(L, x)).ok, false);
  VE.ride(L, 'ngua'); assert.equal(VE.rideMods(L).speed, 1.6);
  VE.ride(L, null); assert.equal(VE.rideMods(L).speed, 1);
  const b = fresh(5 * BAC); VE.buy(b.L, 'lua', (x) => LIFE.payXu(b.L, x)); VE.ride(b.L, 'lua');
  const a = fresh(); LIFE.tick(a.L, 3600, { hour: 12, activity: 'walk' }); LIFE.tick(b.L, 3600, { hour: 12, activity: 'walk', drain: VE.rideMods(b.L).drain });
  assert.ok(Math.abs((80 - b.L.full) - 0.8 * (80 - a.L.full)) < 1e-6);
});
check('linh hạc: bay 60 giây rồi nghỉ 3 phút; phi kiếm không hao Tỉnh, bay nhanh ×1,5', () => {
  const { L } = fresh(); VE.garage(L).own.push('linhhac');
  assert.equal(VE.hacTakeoff(L, 1000), true); assert.equal(VE.hacFlying(L, 1000 + 59000), true); assert.equal(VE.hacFlying(L, 1000 + 61000), false);
  assert.equal(VE.hacReady(L, 1000 + 100000).ready, false); assert.equal(VE.hacReady(L, 1000 + 240001).ready, true);
  VE.garage(L).own.push('phikiem'); assert.equal(VE.rideMods(L).flyMul, 1.5); assert.equal(VE.rideMods(L).flyFree, true);
});
check('bảo trì mỗi ngày (xe + nhà), mỗi ngày một lần; nhà mua bằng Phúc Khí miễn 30 ngày; thiếu tiền ghi nợ; nợ 3 ngày liền thì trạm giữ xe', () => {
  const { L } = fresh(100 * DONG); VE.garage(L).own.push('ngua');
  const u = VE.dailyUpkeep(L, 'd1', { pay: payL(L), addDebt: (a) => ILL.addDebt(L, a), house: { tier: 'nhapho', free: false } });
  assert.equal(u.total, 40); assert.equal(L.van, 60);
  assert.equal(VE.dailyUpkeep(L, 'd1', { pay: payL(L), addDebt: () => {} }).total, 0, 'một lần mỗi ngày');
  assert.equal(VE.dailyUpkeep(L, 'd2', { pay: payL(L), addDebt: () => {}, house: { tier: 'nhapho', free: true } }).house, 0);
  L.xu = 0;
  for (let d = 3; d <= 5; d++) VE.dailyUpkeep(L, `d${d}`, { pay: payL(L), addDebt: (a) => ILL.addDebt(L, a) });
  assert.equal(VE.owns(L, 'ngua'), false, 'giữ xe'); assert.ok(L.debt >= 60);
});
check('hút tiền theo bậc giàu: người có nhà lớn + nhiều xe tốn bảo trì + thuế nhiều hơn hẳn người nghèo', () => {
  const day = (L, house) => VE.dailyUpkeep(L, 'x', { pay: payL(L), addDebt: () => {}, house }).total + LIFE.taxFor(LIFE.wealthDong(L));
  const poor = fresh(500 * DONG), mid = fresh(30 * BAC), rich = fresh(3000 * BAC);
  VE.garage(mid.L).own.push('lua'); VE.garage(rich.L).own.push('ngua', 'xengua', 'linhhac');
  const p = day(poor.L, null), m = day(mid.L, { tier: 'tieuxa' }), r = day(rich.L, { tier: 'bietphu' });
  assert.ok(p < m && m < r, `${p} < ${m} < ${r}`); assert.ok(r > 20 * m, 'giàu tốn gấp nhiều lần');
});
check('tủ đồ ăn: tối đa 12 món, giữ 3 ngày, quá hạn thì ôi', () => {
  const { L } = fresh(); for (let i = 0; i < 12; i++) assert.ok(VE.store(L, 'com', 0)); assert.equal(VE.store(L, 'com', 0), false);
  assert.equal(VE.takeOut(L, 0, 2 * 86400000).spoiled, false); assert.equal(VE.takeOut(L, 0, 4 * 86400000).spoiled, true);
});
check('thức dậy cát tường: may mắn 5–15% theo phong thủy, Khí huyết +10; may mắn giảm nguy cơ bệnh, tăng hiệu suất', () => {
  const { L } = fresh(); L.hp = 50;
  const b = VE.wakeBlessing(L, 100, Date.now() + 3600000); assert.equal(b.luck, 0.15); assert.equal(L.hp, 60);
  assert.equal(VE.wakeBlessing(L, 0, Date.now() + 3600000).luck, 0.05);
  assert.ok(Math.abs(LIFE.mods(L).work - 1.05) < 1e-9); assert.ok(Math.abs(ILL.riskMul(L, 'phonghan', { luck: 0.15 }) - 0.85) < 1e-9);
  L.wakeBuff.until = Date.now() - 1; assert.equal(VE.luckToday(L), 0);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
