// ============================================================================
//  TEST BỆNH TẬT · Y QUÁN · NỢ (P3 — src/game/illness.js + life.js + law.js), thuần Node
// ============================================================================
import assert from 'node:assert/strict';
import * as ILL from '../src/game/illness.js';
import * as LIFE from '../src/game/life.js';
import * as LAW from '../src/game/law.js';
import { createState } from '../src/game/state.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const fresh = () => { const s = createState(); const L = LIFE.lifeState(s); ILL.illState(L); return { s, L }; };
const T0 = 1.8e12;
const seq = (...v) => { let i = 0; return () => v[i++ % v.length]; };

check('6 bệnh, giá thuốc 120–1.200 đồng, tạng theo ngũ hành', () => {
  assert.equal(Object.keys(ILL.ILLS).length, 6);
  for (const I of Object.values(ILL.ILLS)) for (const p of I.drug) assert.ok(p >= 120 && p <= 1200);
  assert.equal(ILL.ILLS.phonghan.wx, '金'); assert.equal(ILL.ILLS.tamhoa.wx, '火'); assert.equal(ILL.ILLS.hanthap.wx, '水');
});
check('hậu quả: đi chậm 50%, làm việc −70%, ba chỉ số tụt gấp đôi', () => {
  const a = fresh(), b = fresh();
  ILL.catchIll(b.L, 'suynhuoc', 0, Date.now());
  assert.equal(LIFE.mods(b.L).speed, 0.5); assert.ok(Math.abs(LIFE.mods(b.L).work - 0.3) < 1e-9); assert.equal(LIFE.mods(b.L).sick, true);
  LIFE.tick(a.L, 3600, { hour: 12 }); LIFE.tick(b.L, 3600, { hour: 12 });
  assert.ok(Math.abs((80 - b.L.full) - 2 * (80 - a.L.full)) < 1e-6);
  assert.ok(LIFE.warnings(b.L).includes('ốm'));
});
check('nguy cơ: hành yếu ×1,5 · phẩm phục đúng Dụng thần ×0,7 · ăn đủ 3 bữa ×0,9 · đan dược miễn dịch 1 ngày', () => {
  const { L } = fresh();
  assert.equal(ILL.riskMul(L, 'phonghan', { weakWx: '金' }), 1.5);
  assert.ok(Math.abs(ILL.riskMul(L, 'phonghan', { robeMatch: true, mealsToday: 3 }) - 0.63) < 1e-9);
  ILL.elixir(L, T0); assert.equal(ILL.riskMul(L, 'phonghan', {}, T0 + 1000), 0);
});
check('phát bệnh: ngủ bờ bụi 15%/đêm, giường chung có hàn thấp; đói mệt > 1 giờ chơi → suy nhược; thức trắng 2 đêm → tâm hỏa; ngã khi làm → chấn thương', () => {
  let r = fresh(); assert.equal(ILL.nightIll(r.L, 'street', 0.15, {}, seq(0.1), T0).id, 'phonghan');
  r = fresh(); assert.equal(ILL.nightIll(r.L, 'street', 0.15, {}, seq(0.2), T0), null);
  r = fresh(); assert.equal(ILL.nightIll(r.L, 'dorm', 0.05, {}, seq(0.3, 0.01), T0).id, 'hanthap');
  r = fresh(); r.L.full = 10; ILL.tickIll(r.L, 1800, {}, seq(0.99), T0); assert.equal(r.L.ill, null); assert.equal(ILL.tickIll(r.L, 2400, {}, seq(0.99), T0).caught.id, 'suynhuoc');
  r = fresh(); assert.equal(ILL.markNightAwake(r.L, '2026-11-10', {}, T0), null); assert.equal(ILL.markNightAwake(r.L, '2026-11-11', {}, T0).id, 'tamhoa');
  r = fresh(); assert.equal(ILL.injury(r.L, seq(0.1), T0).sev, 1);
  r = fresh(); for (let i = 0; i < 4; i++) assert.equal(ILL.coldWork(r.L, 'd', {}, seq(0.01), T0), null); assert.equal(ILL.coldWork(r.L, 'd', {}, seq(0.01), T0).id, 'hanthap');
});
check('phong hàn nhẹ: 6 giờ chơi có ngủ đủ tự khỏi; 30% chuyển nặng; bệnh khác không tự khỏi', () => {
  let r = fresh(); ILL.catchIll(r.L, 'phonghan', 0, T0); r.L.wake = 70;
  assert.ok(ILL.tickIll(r.L, 6.1 * 3600, {}, seq(0.5), T0).healed); assert.equal(r.L.ill, null);
  r = fresh(); ILL.catchIll(r.L, 'phonghan', 0, T0); assert.ok(ILL.tickIll(r.L, 6.1 * 3600, {}, seq(0.1), T0).worse); assert.equal(r.L.ill.sev, 1);
  r = fresh(); ILL.catchIll(r.L, 'tamhoa', 0, T0); ILL.tickIll(r.L, 48 * 3600, {}, seq(0.5), T0); assert.equal(r.L.ill.id, 'tamhoa');
});
check('chữa: Dược Phòng chỉ bệnh nhẹ; Y Quán khám 80 + thuốc, hợp Dụng thần −20% và khỏi nhanh gấp đôi; thiếu tiền → ghi nợ', () => {
  const { L } = fresh(); ILL.catchIll(L, 'chanthuong', 1, T0);
  assert.equal(ILL.quote(L, 'duoc', '金').ok, false);
  const q = ILL.quote(L, 'yquan', '金'); assert.equal(q.price, 80 + 960); assert.equal(q.fast, true);
  L.xu = 500 * 100;
  const r = ILL.treat(L, 'yquan', '金', (a) => LIFE.pay(L, a), T0);
  assert.equal(r.owed, 1040); assert.equal(L.debt, 1040); assert.equal(r.ms, ILL.CURE_MS[1] / 2);
  assert.ok(ILL.tickIll(L, 1, {}, Math.random, T0 + r.ms + 1).healed); assert.equal(L.ill, null);
  const b = fresh(); ILL.catchIll(b.L, 'phonghan', 0, T0); const rb = ILL.treat(b.L, 'duoc', null, (a) => LIFE.pay(b.L, a), T0); assert.equal(rb.price, 150); assert.equal(rb.owed, 0);
});
check('nợ: lãi 2%/ngày, trần 3 lần gốc; > 1 lượng quá 7 ngày → khổ sai trừ nợ 15 đồng/quặng; trả nợ', () => {
  const { s, L } = fresh(); ILL.addDebt(L, 1200, T0);
  let court = false, day = 0;
  for (day = 1; day <= 8; day++) { const d = ILL.dailyDebt(L, `d${day}`, T0 + day * 86400000); court = court || d.court; }
  assert.ok(court); assert.ok(L.debt > 1200 && L.debt <= 3600);
  for (day = 9; day <= 200; day++) ILL.dailyDebt(L, `d${day}`, T0 + day * 86400000);
  assert.equal(L.debt, 3600, 'trần 3 lần gốc');
  const S = LAW.debtSentence(s, L.debt, ILL.ORE_DONG); assert.equal(S.quota, 240);
  LAW.mineOre(s); assert.equal(L.debt, 3585);
  for (let i = 1; i < 240; i++) LAW.mineOre(s);
  assert.equal(L.debt, 0); assert.equal(LAW.serving(s), null); assert.equal(LAW.lawState(s).record.length, 0, 'nợ không ghi tiền án');
  const b = fresh(); ILL.addDebt(b.L, 100, T0); b.L.xu = 60 * 100; assert.equal(ILL.repay(b.L, 60, (a) => LIFE.pay(b.L, a)), 60); assert.equal(b.L.debt, 40);
});
check('ngất: viện phí 300 đồng, thiếu thì ghi nợ; tiền gửi Tiền Trang không mất', () => {
  const { L } = fresh(); L.xu = 100 * 100; L.bank = 5000;
  const f = LIFE.faint(L, T0); assert.equal(f.fee, 300); assert.equal(f.owed, 200); assert.equal(L.xu, 0); assert.equal(L.debt, 200); assert.equal(L.bank, 5000);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
