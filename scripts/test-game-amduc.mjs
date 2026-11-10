// ============================================================================
//  TEST ÂM ĐỨC (P17 — src/game/amduc.js), thuần Node: chuỗi điều độ → cấp; quên ngày → tạm ngừng, 2 ngày điều độ bật lại
//  ở cấp cũ trừ 1; thoát chết một lần; tổn hao; chỉ đăng nhập không đủ; hiệu ứng gắn vào life / illness / guild.
// ============================================================================
import assert from 'node:assert/strict';
import * as AD from '../src/game/amduc.js';
import * as LIFE from '../src/game/life.js';
import * as ILL from '../src/game/illness.js';
import * as J from '../src/game/jobs.js';
import { GuildEngine, MemStore } from '../src/game/guild-core.js';
import { createState } from '../src/game/state.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const fresh = () => LIFE.lifeState(createState());
const day = (n) => { const t = new Date(Date.UTC(2026, 10, 1 + n, 12)); return t.toISOString().slice(0, 10); };
const goodDay = (L) => AD.tickDay(L, { minutes: 25, meal: true, slept: true }) || AD.tickDay(L, { meal: true });
function live(L, from, n, good = true) { for (let i = from; i < from + n; i++) { AD.enterDay(L, day(i)); if (good) goodDay(L); } AD.enterDay(L, day(from + n)); }

check('chỉ đăng nhập không đủ: phải chơi ≥ 20 phút, ăn ≥ 2 bữa, ngủ đúng chỗ', () => {
  const L = fresh(); AD.enterDay(L, day(0)); AD.tickDay(L, { minutes: 300 }); AD.enterDay(L, day(1));
  assert.equal(AD.adState(L).score, 0);
  const M = fresh(); AD.enterDay(M, day(0)); goodDay(M); AD.enterDay(M, day(1)); assert.equal(AD.adState(M).score, 1);
});
check('chuỗi → cấp: 1–3 c1 · 4–7 c2 · 8–14 c3 · 15+ c4 (hiệu ứng cộng dồn)', () => {
  const L = fresh(); live(L, 0, 3); assert.equal(AD.tier(L), 1);
  live(L, 3, 1); assert.equal(AD.tier(L), 2); live(L, 4, 4); assert.equal(AD.tier(L), 3); live(L, 8, 7); assert.equal(AD.tier(L), 4);
  const e = AD.effects(L); assert.equal(e.fullRate, 0.95); assert.equal(e.risk, 0.5); assert.equal(e.order, 1.1); assert.equal(e.save, true);
});
check('quên một ngày: không mất điểm, tạm ngừng; 2 ngày điều độ liền → trở lại cấp cũ trừ 1', () => {
  const L = fresh(); live(L, 0, 9); assert.equal(AD.tier(L), 3); const sc = AD.adState(L).score;
  AD.enterDay(L, day(10)); AD.enterDay(L, day(11)); // ngày 10 quên (chỉ vào, không sinh hoạt)
  assert.equal(AD.adState(L).score, sc, 'không mất điểm'); assert.equal(AD.tier(L), 0, 'tạm ngừng');
  goodDay(L); AD.enterDay(L, day(12)); assert.equal(AD.tier(L), 0, 'mới 1 ngày');
  goodDay(L); AD.enterDay(L, day(13)); assert.equal(AD.tier(L), 2, 'cấp cũ 3 − 1');
  const M = fresh(); live(M, 0, 5); AD.enterDay(M, day(9)); assert.ok(AD.adState(M).paused, 'vắng nhiều ngày cũng là quên');
});
check('thoát chết một lần ở cấp 4: Khí huyết 1, Âm Đức về 0; hết lượt thì ngất như thường', () => {
  const L = fresh(); live(L, 0, 15); assert.equal(AD.adState(L).saveReady, true);
  L.hp = 0; assert.equal(AD.trySave(L), true); assert.equal(L.hp, 1); assert.equal(AD.adState(L).score, 0); assert.equal(AD.tier(L), 0);
  assert.equal(AD.trySave(L), false);
});
check('tổn hao: kết án −5, bỏ ca −2, bỏ mặc bệnh −3; Âm Đức âm không phạt, chỉ mất trợ lực', () => {
  const L = fresh(); live(L, 0, 2); AD.penalize(L, 'convict'); assert.equal(AD.adState(L).score, -3); assert.equal(AD.tier(L), 0);
  AD.penalize(L, 'quit'); AD.penalize(L, 'neglect'); assert.equal(AD.adState(L).score, -8);
  assert.equal(LIFE.mods(L).speed, 1, 'không phạt thêm');
});
check('hiệu ứng thật: No tụt chậm 5% (c1), thuốc −5% (c2), máy chủ giảm rủi ro việc làm một nửa (c2)', () => {
  const a = fresh(), b = fresh(); live(b, 0, 4);
  LIFE.tick(a, 3600, { hour: 12 }); LIFE.tick(b, 3600, { hour: 12 }); assert.ok(Math.abs((80 - b.full) - 0.95 * (80 - a.full)) < 1e-6);
  ILL.catchIll(b, 'phonghan', 0); assert.equal(ILL.quote(b, 'duoc', null).price, Math.round(150 * 0.95));
  assert.ok(J.riskP('ky', {}) * 0.5 < J.riskP('ky', {}));
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
