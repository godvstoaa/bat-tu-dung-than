// ============================================================================
//  TEST PHI HÀNH ĐỘC BẢN (P15 — flight.js + flight-poses.js), thuần Node: đủ 5 trạng thái theo đúng điều kiện;
//  tốc độ tăng tốc ×1,5 như nhau mọi vật cưỡi; bậc hiếm +5%/bậc tối đa +20%, trần chung +35%; 6 vật cưỡi đủ 5 tư thế,
//  không gói nào dùng lại tư thế của gói khác.
// ============================================================================
import assert from 'node:assert/strict';
import * as FL from '../src/game/flight.js';
import { POSES } from '../src/game/flight-poses.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const run = (F, inp, secs) => { for (let t = 0; t < secs; t += 1 / 30) FL.step(F, inp, 1 / 30); return F.s; };

check('máy trạng thái: cất cánh 0,8 s → trôi / hành trình / tăng tốc / bổ nhào → hạ cánh 0,6 s → tắt', () => {
  const F = FL.newFlight();
  assert.equal(run(F, { want: true }, 0.5), FL.FS.TAKEOFF);
  assert.equal(run(F, { want: true, speedH: 0 }, 0.5), FL.FS.HOVER);
  assert.equal(run(F, { want: true, speedH: 8 }, 0.1), FL.FS.CRUISE);
  assert.equal(run(F, { want: true, speedH: 8, sprint: true }, 0.1), FL.FS.BOOST);
  assert.equal(run(F, { want: true, speedH: 8, vy: -7 }, 0.1), FL.FS.BOOST, 'bổ nhào nhanh hơn 6 m/s');
  assert.equal(run(F, { want: false }, 0.3), FL.FS.LAND);
  assert.equal(run(F, { want: false }, 0.5), FL.FS.OFF);
  assert.ok(FL.liftOffset({ s: FL.FS.TAKEOFF, t: 0.4 }) > 1 && FL.liftOffset({ s: FL.FS.TAKEOFF, t: 0.4 }) < 2);
});
check('tốc độ: tăng tốc ×1,5 mọi vật cưỡi; bậc hiếm +5%/bậc (trần +20%); cộng pháp môn trần +35%', () => {
  const cruise = { s: FL.FS.CRUISE }, boost = { s: FL.FS.BOOST };
  assert.equal(FL.speedMul(cruise, 1), 1); assert.equal(FL.speedMul(boost, 1), 1.5);
  assert.ok(Math.abs(FL.speedMul(cruise, 3) - 1.1) < 1e-9); assert.ok(Math.abs(FL.speedMul(cruise, 5) - 1.2) < 1e-9);
  assert.ok(Math.abs(FL.speedMul(cruise, 5, 0.3) - 1.35) < 1e-9, 'trần chung');
  assert.equal(FL.speedMul(boost, 3) / FL.speedMul(cruise, 3), 1.5);
});
check('6 vật cưỡi × 5 tư thế; không gói nào trùng tư thế gói khác; ngồi xếp bằng đúng chỗ (Liên Hoa Đài, Hồ Lô)', () => {
  const ids = Object.keys(POSES); assert.deepEqual(ids.sort(), ['dai_sen', 'duc', 'hac', 'ho_lo_bay', 'kiem', 'may']);
  const sig = new Map();
  for (const id of ids) for (let s = 1; s <= 5; s++) {
    const P = POSES[id][s]; assert.ok(P, `${id} thiếu trạng thái ${s}`);
    const k = JSON.stringify([P.base, P.seat || '', P.lean, P.bones]); assert.ok(!sig.has(k) || sig.get(k) === id, `${id}/${s} trùng ${sig.get(k)}`); sig.set(k, id);
  }
  assert.equal(POSES.dai_sen[2].seat, 'calm'); assert.equal(POSES.ho_lo_bay[3].seat, 'tea'); assert.ok(POSES.hac[4].lean > POSES.hac[3].lean, 'hạc: cúi ôm cổ khi tăng tốc');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
