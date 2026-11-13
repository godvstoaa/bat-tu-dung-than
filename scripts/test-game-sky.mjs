// ============================================================================
//  TEST QUẬN ĐẢO BAY «THIÊN BÀN» (docs/GAME-TROI-THIET-KE.md — thuần Node, không three.js/DOM).
//   1) Nền bát giác mỗi đảo: đứng trên đảo KHÔNG rơi (moveFree giữ y 460), rời mép đảo THÌ rơi.
//   2) Bát giác nội tiếp đĩa R: không có điểm nền nào xa tâm hơn R (không «đi trên không» ngoài đĩa),
//      mọi hướng đều có nền tới ít nhất 0,765·R (16 cạnh: 8 đỉnh tới R, 8 đáy thung tới 0,7654·R).
//   3) Cầu vân: dọc 4 cầu, nền liền mạch ở y 460 từ mép đảo này sang mép đảo kia; không hở > 0,5 m.
//   4) Cao độ y-aware: đi/bay DƯỚI đảo (y thấp) không bị nhấc lên 460 — platformTop(x,z) không y
//      trả terrain (spawn 3,43 không bị kẹp camera 460,6); y 460 thì nền tính.
//  Chạy: node scripts/test-game-sky.mjs
// ============================================================================
import assert from 'node:assert/strict';
import { SKY_DISTRICT, SKY_BRIDGES, SKY_Y, heightAt } from '../src/game/terrain.js';
import { platformTop } from '../src/game/obstacles.js';
import { moveFree, groundHeight, surfaceAt } from '../src/game/motion.js';

let passed = 0;
const fails = [];
const test = (name, fn) => {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log('  ✗', name, '\n   ', e.message); }
};

// một giây mô phỏng (60 khung) — như test-game-motion.mjs
const run = (p, input, dt, secs) => { for (let i = 0; i < Math.round(secs / dt); i++) moveFree(p, input, dt, 5.6); };

// ---------------------------------------------------------------------------
// 1) Đứng trên mỗi đảo KHÔNG rơi — moveFree với y3 = 460, không nhập phím
// ---------------------------------------------------------------------------
for (const s of SKY_DISTRICT) {
  test(`đảo ${s.id}: đứng tâm đảo (y 460) 2 giây — không rơi, y giữ ${SKY_Y}`, () => {
    const p = { x: s.x, z: s.z, y3: SKY_Y, vy: 0, stamina: 100 };
    run(p, { dx: 0, dz: 0, mag: 0 }, 1 / 60, 2);
    assert.equal(p.air, false, 'bị coi là trên không');
    assert.ok(Math.abs(p.y3 - SKY_Y) < 0.01, `y3 = ${p.y3}`);
    assert.equal(groundHeight(s.x, s.z, SKY_Y), SKY_Y, 'groundHeight tại tâm đảo');
  });
  // rời mép: đi thẳng ra ngoài tới khi rơi
  test(`đảo ${s.id}: đi ra ngoài mép (xa tâm > R + 5) — RƠI (air, y giảm)`, () => {
    const ux = 0.9239, uz = 0.3827; // hướng 22,5° — đáy thung của bát giác (mép gần nhất)
    const p = { x: s.x + ux * s.r * 0.5, z: s.z + uz * s.r * 0.5, y3: SKY_Y, vy: 0, stamina: 100 };
    const secs = (s.r * 0.5 + 8) / 5.6 + 1; // đi đủ xa ra ngoài mép + dư
    run(p, { dx: ux, dz: uz, mag: 1 }, 1 / 60, secs);
    assert.ok(p.y3 < SKY_Y - 5, `vẫn đứng y ${p.y3} ngoài mép đảo`);
  });
}

// ---------------------------------------------------------------------------
// 2) Bát giác nội tiếp: mọi điểm nền ≤ R; mọi hướng có nền ≥ 0,765·R (hợp 2 vuông = 16 cạnh)
// ---------------------------------------------------------------------------
for (const s of SKY_DISTRICT) {
  test(`đảo ${s.id}: nền không vượt đĩa R=${s.r} và phủ mọi hướng tới ≥ 0,765·R`, () => {
    // hành lang cầu là nền đi được HỢP LỆ ngoài mép đĩa — bỏ qua điểm trong vành đai 4 m quanh tim cầu
    const onBridge = (x, z) => SKY_BRIDGES.some((b) => {
      const vx = b.b.x - b.a.x, vz = b.b.z - b.a.z, L = Math.hypot(vx, vz);
      const t = ((x - b.a.x) * vx + (z - b.a.z) * vz) / (L * L);
      return t >= -0.001 && t <= 1.001 && Math.hypot(x - b.a.x - vx * t, z - b.a.z - vz * t) <= 4;
    });
    let beyond = 0, worst = Infinity;
    for (let k = 0; k < 720; k++) {
      const a = (k / 720) * Math.PI * 2, r = s.r * 1.005; // vừa ngoài mép đĩa
      const x = s.x + Math.cos(a) * r, z = s.z + Math.sin(a) * r;
      if (platformTop(x, z, SKY_Y) === SKY_Y && !onBridge(x, z)) beyond++;
      // mép gần nhất theo hướng: bước vào 0,25 m tới khi có nền (hướng có cầu chỉ rộng hơn — không che thung bát giác)
      let rr = s.r + 4;
      for (let q = 0; q < 500; q++) { const rq = rr - q * 0.25, px = s.x + Math.cos(a) * rq, pz = s.z + Math.sin(a) * rq; if (platformTop(px, pz, SKY_Y) === SKY_Y) { worst = Math.min(worst, rq); break; } }
    }
    assert.equal(beyond, 0, `${beyond}/720 điểm nền xa tâm hơn R (ngoài hành lang cầu)`);
    assert.ok(worst >= 0.76 * s.r, `hướng mỏng nhất chỉ tới ${worst.toFixed(1)} m (< 0,765·R = ${(0.7654 * s.r).toFixed(1)})`);
  });
}

// ---------------------------------------------------------------------------
// 3) Cầu vân liền mạch: dọc đường thẳng 2 điểm neo, lấy mẫu 0,5 m — nền 460 liên tục
// ---------------------------------------------------------------------------
assert.ok(SKY_BRIDGES.length >= 4, 'thiếu cầu (cần ≥ 4: B1–B4)');
for (const b of SKY_BRIDGES) {
  test(`cầu ${b.id}: đi bộ hết cầu không hở (mẫu 0,5 m, y 460)`, () => {
    const L = Math.hypot(b.b.x - b.a.x, b.b.z - b.a.z), n = Math.ceil(L / 0.5);
    let gap = null;
    for (let k = 0; k <= n; k++) {
      const t = k / n, x = b.a.x + (b.b.x - b.a.x) * t, z = b.a.z + (b.b.z - b.a.z) * t;
      if (platformTop(x, z, SKY_Y) !== SKY_Y) { gap = { x, z }; break; }
    }
    assert.ok(!gap, `hở nền tại (${gap?.x.toFixed(1)}, ${gap?.z.toFixed(1)})`);
  });
  test(`cầu ${b.id}: đi bằng moveFree từ đảo chủ sang đảo kia — không rơi giữa đường`, () => {
    const p = { x: b.a.x - b.ux * 4, z: b.a.z - b.uz * 4, y3: SKY_Y, vy: 0, stamina: 100 };
    run(p, { dx: b.ux, dz: b.uz, mag: 1 }, 1 / 60, Math.ceil(Math.hypot(b.b.x - p.x, b.b.z - p.z) / 5.6) + 1);
    assert.ok(p.y3 > SKY_Y - 0.5, `rơi giữa cầu (y ${p.y3.toFixed(1)})`);
    assert.ok(Math.hypot(p.x - b.b.x, p.z - b.b.z) < 12, `chưa tới đầu xa (còn ${Math.hypot(p.x - b.b.x, p.z - b.b.z).toFixed(1)} m)`);
  });
  test(`cầu ${b.id}: rộng ≥ 4 m (vân lộ) — nền có tại lệch ±2 m vuông góc tâm cầu`, () => {
    const mx = (b.a.x + b.b.x) / 2, mz = (b.a.z + b.b.z) / 2, px = -b.uz, pz = b.ux;
    for (const o of [-2, 0, 2]) assert.equal(platformTop(mx + px * o, mz + pz * o, SKY_Y), SKY_Y, `lệch ${o} m mất nền`);
  });
}

// ---------------------------------------------------------------------------
// 4) Cao độ y-aware — không nhấc người dưới đảo / camera 2D lên 460
// ---------------------------------------------------------------------------
test('spawn (3, 43) DƯỚI đảo chủ: platformTop không y → terrain, không phải 460', () => {
  assert.notEqual(platformTop(3, 43), SKY_Y, 'lời gọi 2D bị nhấc lên nền đảo');
  assert.ok(Math.abs(groundHeight(3, 43) - heightAt(3, 43)) < 0.01, 'groundHeight không y đổi ở dưới đảo');
});
test('đi dưới đảo (y thấp) không bị nhấc; đứng y 460 thì nền tính', () => {
  assert.notEqual(platformTop(0, 0, 5), SKY_Y, 'bay/đi y 5 dưới đảo bị tính nền trời'); // (0,0) có bậc sân quán 2 m — hợp lệ, không phải 460
  assert.equal(platformTop(500, -260, 10), null);
  assert.equal(platformTop(0, 0, SKY_Y), SKY_Y);
  assert.equal(platformTop(500, -260, SKY_Y), SKY_Y);
});
test('dưới gầm cầu (y thấp hơn bot 457) không bị nhấc lên mặt cầu', () => {
  const b = SKY_BRIDGES[0], m = { x: (b.a.x + b.b.x) / 2, z: (b.a.z + b.b.z) / 2 };
  assert.equal(platformTop(m.x, m.z, 100), null, 'người y 100 dưới cầu bị đứng trên mặt cầu');
  assert.equal(platformTop(m.x, m.z, SKY_Y - 2), SKY_Y, 'trên cầu thì nền 460');
});
test('rơi từ mép đảo xuống đất: đáp terrain, không kẹt giữa trời', () => {
  const s = SKY_DISTRICT[1]; // quanthinh
  const p = { x: s.x + 0.9239 * (s.r + 2), z: s.z + 0.3827 * (s.r + 2), y3: SKY_Y, vy: 0, stamina: 100 };
  run(p, { dx: 0, dz: 0, mag: 0 }, 1 / 60, 12);
  const h = heightAt(p.x, p.z);
  assert.ok(p.y3 <= h + 0.05, `y ${p.y3.toFixed(1)} > terrain ${h.toFixed(1)} — lơ lửng`);
  assert.ok(Math.abs(p.y3 - h) < 0.01 || p.y3 >= h - 0.01, 'đáp sai dưới mặt đất');
});
test('surfaceAt trên đảo: floor 460, không solid, không nước', () => {
  const s = surfaceAt(0, 0, SKY_Y);
  assert.equal(s.floor, SKY_Y);
  assert.equal(s.solid, false);
  assert.equal(s.water, null);
});

// ---------------------------------------------------------------------------
console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : `\n${passed} test đạt`);
for (const f of fails) console.log('  - ' + f);
process.exit(fails.length ? 1 : 0);
