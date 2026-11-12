// ============================================================================
//  TEST THỦY HỆ (thuần Node): sông Huyền Hà ~150 m có lạch sâu, hào / kênh thành đủ cho thuyền lớn, không công
//  trình nào đè lên mặt nước, tuyến thuyền liền từ hào qua thủy môn ra sông, tĩnh không cầu, bến thuyền, vật lý thuyền
//  (quán tính, không trượt ngang, mắc cạn, gió, dòng chảy). Vật lý bơi / lội: test-game-motion.mjs.
//    node scripts/test-game-water.mjs
// ============================================================================
import assert from 'node:assert/strict';
import * as T from '../src/game/terrain.js';
import * as CN from '../src/game/canals.js';
import * as W from '../src/game/waterways.js';
import { waterAt, wind } from '../src/game/water.js';
import { renderHouses } from '../src/game/city4.js';
import * as LAYOUT from '../src/game/citylayout.js';
import { innerHouses } from '../src/game/innerfill.js';
import * as BQ from '../src/game/batquai.js';
import { estates } from '../src/game/mansions.js';
import * as BR from '../src/game/bridges.js';
import * as B from '../src/game/boats.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}\n      ${e.message.split('\n')[0]}`); }
};
const wet = (x, z) => CN.inCanal(x, z) || T.heightAt(x, z) < T.WATER - 0.4 || ((n) => !!n && n.d < n.hw)(CN.extNear(x, z));

const wetW = (x, z) => T.heightAt(x, z) < T.WATER - 0.4;
check('v4 sông Huyền Hà: mặt nước 100–240 m mọi mặt cắt (trong thành ~120 m giữa kè đứng), lạch sâu ≥ 6 m', () => {
  const P = W.riverPoints();
  for (let i = 30; i < P.length - 60; i += 20) {
    const p = P[i], nx = -p.tz, nz = p.tx;
    if (Math.hypot(p.x, p.z) > T.EDGE - 80) continue;
    { const L = LAYOUT.water().lake; if (Math.hypot(p.x - L.x, p.z - L.z) < L.r + 160) continue; } // cửa sông loe vào hồ
    let w = 0, lane = 0;
    for (let t = -140; t <= 140; t += 1) { const d = T.WATER - T.heightAt(p.x + nx * t, p.z + nz * t); if (d > 0) w++; if (d >= 6) lane++; }
    assert.ok(w >= 100 && w <= 240, `s ${Math.round(p.s)}: rộng ${w} m`);
    assert.ok(lane >= 60, `s ${Math.round(p.s)}: lạch ${lane} m`);
  }
});
check('v4 sông xuyên phía Nam thành (qua tường ở thủy môn), đổ vào hồ Cùng Thông trong thành; hồ có bờ khép kín', () => {
  const P = W.riverPoints(), inside = P.filter((p) => T.cityOctDist(p.x, p.z) < -50);
  assert.ok(inside.length > 50, 'sông phải chảy qua thành');
  for (const p of inside) assert.ok(p.z > 600, `sông trong thành chỉ ở nửa Nam (${Math.round(p.x)}, ${Math.round(p.z)})`);
  const L = LAYOUT.water().lake;
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2; let shore = false;
    for (let r = 0; r < 700 && !shore; r += 4) { const x = L.x + Math.cos(ang) * r, z = L.z + Math.sin(ang) * r; if (T.heightAt(x, z) > T.WATER && !W.riverNear(x, z)) shore = true; }
    assert.ok(shore || W.riverNear(L.x + Math.cos(ang) * 200, L.z + Math.sin(ang) * 200), `hồ không có bờ hướng ${a}`);
  }
});
check('v4 không còn hào / kênh Bát Môn cũ: đại lộ, quảng trường khô ráo (nước trong thành chỉ là sông / hồ)', () => {
  for (const g of BQ.GUA) for (let u = 200; u < 2100; u += 25) { const p = BQ.toWorld(g, u, 0); if (W.riverNear(p.x, p.z) || Math.hypot(p.x - LAYOUT.water().lake.x, p.z - LAYOUT.water().lake.z) < LAYOUT.water().lake.r + 30) continue; assert.equal(waterAt(p.x, p.z), null, `${g.id} u ${u} ngập`); }
});
check('v4 không công trình nào đè lên mặt nước (nhà phố, nhà chen Sơn Môn, công trình trọng điểm, biệt phủ / biệt thự)', () => {
  const hits = [];
  const obb = (x, z, hw, hd, ry, name) => {
    const c = Math.cos(ry), s = Math.sin(ry);
    for (let a = -1; a <= 1; a += 0.25) for (let b = -1; b <= 1; b += 0.25) { const lx = a * hw, lz = b * hd; if (wetW(x + lx * c + lz * s, z - lx * s + lz * c)) { hits.push(name); return; } }
  };
  renderHouses().forEach((h) => obb(h.x, h.z, h.hw, h.hd, h.ry, `nhà ${h.key}`));
  innerHouses().forEach((h, i) => obb(h.x, h.z, h.hw, h.hd, h.ry, `nhà Sơn Môn #${i}`));
  LAYOUT.landmarks().filter((l) => l.w).forEach((l) => obb(l.x, l.z, l.w / 2, l.d / 2, l.ry || 0, l.name));
  for (const m of estates()) if (!m.heaven) obb(m.x, m.z, (m.W || 100) / 2, (m.D || 100) / 2, m.ry || 0, `phủ ${m.h}`);
  assert.equal(hits.length, 0, hits.slice(0, 5).join(', '));
});
check('v4 5 cầu qua sông: tĩnh không ≥ 8 m giữa lòng; thuyền hoa (4,2 m) qua được; thuyền buồm (12 m) bị cầu / thủy môn chặn', () => {
  const R = BR.riverBridges(); assert.equal(R.length, 5);
  for (const b of R) { const cl = BR.clearanceAt(b.x, b.z); assert.ok(cl >= 8 && cl < B.BOAT_TYPES.buom.height, `${b.id} tĩnh không ${cl.toFixed(1)}`); assert.ok(cl >= B.BOAT_TYPES.hoa.height); }
  for (const g of BR.waterGates()) { const cl = BR.clearanceAt(g.x, g.z); assert.ok(cl >= B.BOAT_TYPES.hoa.height && cl < B.BOAT_TYPES.buom.height, `${g.id} ${cl}`); }
});
check('v4 tuyến thuyền hoa dọc sông trong thành: lọt qua cả 5 cầu, không mắc cạn / vướng trụ', () => {
  const P = W.riverPoints().filter((p) => T.cityOctDist(p.x, p.z) < -40);
  const boat = B.createBoat('hoa', 0, 0, 0); let bad = 0, ex = '';
  for (let i = 0; i + 1 < P.length; i++) { const a = P[i], b = P[i + 1]; for (const off of [-10, 10]) { const x = a.x - a.tz * off, z = a.z + a.tx * off; const r = B.hullBlock(boat, x, z, Math.atan2(b.x - a.x, b.z - a.z)); if (r) { bad++; ex ||= `(${Math.round(x)}, ${Math.round(z)}) ${r}`; } } }
  assert.equal(bad, 0, `${bad} chỗ vướng, vd ${ex}`);
});
check('v4 bến thuyền: 4 bến (3 bến sông trong thành + hồ), chỗ đứng khô, chỗ thả đủ rộng', () => {
  const D = B.docks(); assert.equal(D.length, 4);
  for (const d of D) {
    assert.ok(!waterAt(d.x, d.z), `${d.id}: chỗ đứng ngập nước`);
    const big = B.createBoat(d.types.at(-1), d.spawn.x, d.spawn.z, d.spawn.h);
    assert.equal(B.hullBlock(big, big.x, big.z, big.h), null, `${d.id}: thả ${d.types.at(-1)} vướng`);
  }
});
check('thuyền: có quán tính, không trượt ngang khi rẽ; ngừng chèo thì trôi chậm dần; đâm vào nông thì mắc cạn', () => {
  const d = B.dockById('lake'), b = B.createBoat('do', d.spawn.x, d.spawn.z, d.spawn.h), dt = 1 / 30;
  for (let i = 0; i < 30 * 8; i++) B.stepBoat(b, { throttle: 1 }, dt);
  const v0 = Math.hypot(b.vx, b.vz); assert.ok(v0 > 1.5 && v0 < 3.5, `đò ${v0.toFixed(2)} m/s`);
  let side = 0; for (let i = 0; i < 30 * 3; i++) { B.stepBoat(b, { throttle: 1, rudder: 1 }, dt); const f = { x: Math.sin(b.h), z: Math.cos(b.h) }; side = Math.max(side, Math.abs(b.vx * f.z - b.vz * f.x)); }
  assert.ok(side < 0.6, `trượt ngang ${side.toFixed(2)} m/s`);
  for (let i = 0; i < 30; i++) B.stepBoat(b, { throttle: 0 }, dt);
  const v1 = Math.hypot(b.vx, b.vz); assert.ok(v1 > 0.5 && v1 < v0, `thả chèo 1 s còn ${v1.toFixed(2)} m/s`);
  // lái thẳng vào bờ: phải dừng lại vì mắc cạn, không lên cạn
  const c = B.createBoat('hoa', d.spawn.x, d.spawn.z, d.spawn.h + Math.PI);
  let got = null; for (let i = 0; i < 30 * 40 && !got; i++) got = B.stepBoat(c, { throttle: 1 }, dt).blocked;
  assert.ok(got === 'shallow' || got === 'land', `không mắc cạn (${got})`); assert.ok(waterAt(c.x, c.z), 'thuyền vẫn ở dưới nước');
});
check('thuyền buồm: gió ngang chạy nhanh nhất, ngược gió (< 40°) không có lực đẩy; dòng chảy cuốn thuyền thả trôi', () => {
  const Wd = wind(0), b = B.createBoat('buom', 0, 0, 0);
  const at = (deg) => { b.h = Math.atan2(Wd.dx, Wd.dz) + (deg * Math.PI) / 180; return B.sailPush(b, Wd); };
  assert.ok(at(90) > at(0) && at(0) > 0, 'gió ngang > xuôi gió > 0'); assert.equal(at(170), 0);
  const P = W.riverPoints(), p = P[Math.floor(P.length * 0.55)], f = B.createBoat('do', p.x, p.z, Math.atan2(-p.tz, p.tx));
  for (let i = 0; i < 300; i++) B.stepBoat(f, {}, 1 / 30);
  const drift = (f.x - p.x) * p.tx + (f.z - p.z) * p.tz; assert.ok(drift > 5, `trôi xuôi ${drift.toFixed(1)} m / 10 s`);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
