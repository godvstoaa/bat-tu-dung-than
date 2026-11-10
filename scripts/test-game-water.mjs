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
import { generateCity } from '../src/game/cityblocks.js';
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

check('sông Huyền Hà: mặt nước 140–215 m mọi mặt cắt, lạch sâu ≥ 6 m rộng ≥ 90 m, sâu nhất 8–11 m', () => {
  const P = W.riverPoints();
  for (let i = 30; i < P.length - 60; i += 20) {
    const p = P[i], nx = -p.tz, nz = p.tx;
    let w = 0, lane = 0, deep = 0;
    for (let t = -140; t <= 140; t += 1) { const d = T.WATER - T.heightAt(p.x + nx * t, p.z + nz * t); if (d > 0) w++; if (d >= 6) lane++; deep = Math.max(deep, d); }
    assert.ok(w >= 140 && w <= 215, `s ${Math.round(p.s)}: rộng ${w} m`);
    assert.ok(lane >= 90, `s ${Math.round(p.s)}: lạch ${lane} m`);
    assert.ok(deep >= 8 && deep <= 11.5, `s ${Math.round(p.s)}: sâu ${deep.toFixed(1)} m`);
  }
});
check('sông cách tường Ngoại Thành ≥ 90 m; đổ vào hồ Cùng Thông; hồ có bờ khép kín (không tràn ra biển mây)', () => {
  for (const p of W.riverPoints()) if (Math.hypot(p.x, p.z) < T.EDGE - 50) assert.ok(T.cityOctDist(p.x, p.z) - p.w > 90, `mép sông sát tường tại (${Math.round(p.x)}, ${Math.round(p.z)})`);
  const L = T.REGIONS.find((r) => r.id === 'cungthong'), end = W.riverPoints().at(-1);
  assert.ok(Math.hypot(end.x - L.x, end.z - L.z) < L.r * 0.8, 'cửa sông trong lòng hồ');
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2; let shore = false;
    for (let r = 0; r < 700 && !shore; r += 4) { const x = L.x + Math.cos(ang) * r, z = L.z + Math.sin(ang) * r; if (Math.hypot(x, z) > T.EDGE - 20) break; if (T.heightAt(x, z) > T.WATER && !W.riverNear(x, z)) shore = true; }
    assert.ok(shore || W.riverNear(L.x + Math.cos(ang) * 200, L.z + Math.sin(ang) * 200), `hồ không có bờ hướng ${a}`);
  }
});
check('hào ≥ 24 m, kênh giữa đại lộ ≥ 20 m, sâu ≥ 3 m; kênh dẫn Tốn → sông liền mặt nước, đổ đúng mực sông', () => {
  assert.ok(CN.MOAT.w >= 24 && CN.AVE_CANAL.v1 - CN.AVE_CANAL.v0 >= 20 && CN.CANAL_WATER - CN.CANAL_BED >= 3);
  const end = CN.LINK.at(-1);
  assert.ok(Math.abs(end[2] - T.WATER) < 0.01 && W.riverNear(end[0], end[1]), 'kênh dẫn tới sông');
  for (let i = 0; i + 1 < CN.LINK.length; i++) for (let t = 0; t < 1; t += 0.1) {
    const [ax, az] = CN.LINK[i], [bx, bz] = CN.LINK[i + 1], x = ax + (bx - ax) * t, z = az + (bz - az) * t, w = waterAt(x, z);
    assert.ok(w && w.depth >= 3, `kênh dẫn cạn tại (${Math.round(x)}, ${Math.round(z)})`);
  }
});
check('không công trình nào đè lên mặt nước (nhà phố, nhà chen Nội Thành, công trình mốc, khu Nội Thành, biệt phủ / biệt thự)', () => {
  const hits = [];
  const obb = (x, z, hw, hd, ry, name) => {
    const c = Math.cos(ry), s = Math.sin(ry);
    for (let a = -1; a <= 1; a += 0.25) for (let b = -1; b <= 1; b += 0.25) { const lx = a * hw, lz = b * hd; if (wet(x + lx * c + lz * s, z - lx * s + lz * c)) { hits.push(name); return; } }
  };
  const C = generateCity();
  C.houses.forEach((h, i) => obb(h.x, h.z, h.hw, h.hd, h.ry, `nhà #${i}`));
  innerHouses().forEach((h, i) => obb(h.x, h.z, h.hw, h.hd, h.ry, `nhà Nội Thành #${i}`));
  (C.landmarks || []).forEach((l) => obb(l.x, l.z, (l.w || 20) / 2, (l.d || 20) / 2, l.ry || 0, l.name));
  for (const g of BQ.GUA) for (const b of BQ.DISTRICTS[g.id].buildings) { const w = BQ.toWorld(g, b.u, b.v); obb(w.x, w.z, (b.fit?.width || 12) / 2, (b.fit?.width || 12) / 2, 0, b.name || 'công trình'); }
  for (const m of estates()) obb(m.x, m.z, (m.W || 100) / 2, (m.D || 100) / 2, m.ry || 0, `phủ ${m.h}`);
  assert.equal(hits.length, 0, hits.slice(0, 5).join(', '));
});
check('cầu thành: tĩnh không ≥ 5,5 m giữa lòng vòm; thuyền hoa (4,2 m) qua được, thuyền buồm (12 m) bị thủy môn chặn', () => {
  for (const b of BR.cityBridges()) {
    const c = { x: b.x + b.ax * (b.archT || 0), z: b.z + b.az * (b.archT || 0) };
    assert.ok(BR.clearanceAt(c.x, c.z) >= 5.49, `${b.id} tĩnh không ${BR.clearanceAt(c.x, c.z).toFixed(2)}`);
  }
  for (const g of BR.waterGates()) { const cl = BR.clearanceAt(g.x, g.z); assert.ok(cl >= B.BOAT_TYPES.hoa.height && cl < B.BOAT_TYPES.buom.height, `${g.id} ${cl}`); }
  const rb = BR.riverBridges()[0]; assert.ok(BR.clearanceAt(rb.x, rb.z) >= 14, 'Nam Môn Đại Kiều tĩnh không ≥ 14 m');
});
check('tuyến thuyền hoa liền mạch: bến hào → hào (Đông) → kênh Tốn → thủy môn → kênh dẫn → sông, không mắc cạn / vướng cầu', () => {
  const pts = [...CN.flowPath().slice(Math.floor(CN.flowPath().length * 0.35)), ...CN.LINK.map(([x, z]) => ({ x, z }))];
  const dense = [];
  for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1], n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 2); for (let k = 0; k < n; k++) dense.push({ x: a.x + (b.x - a.x) * k / n, z: a.z + (b.z - a.z) * k / n, h: Math.atan2(b.x - a.x, b.z - a.z) }); }
  const boat = B.createBoat('hoa', 0, 0, 0);
  for (const p of dense) assert.equal(B.hullBlock(boat, p.x, p.z, p.h), null, `vướng tại (${Math.round(p.x)}, ${Math.round(p.z)}): ${B.hullBlock(boat, p.x, p.z, p.h)}`);
  const sail = B.createBoat('buom', 0, 0, 0), gate = BR.waterGates().find((g) => g.id.includes('672'));
  assert.equal(B.hullBlock(sail, gate.x, gate.z, Math.atan2(gate.ax, gate.az)), 'low', 'thuyền buồm không qua thủy môn');
});
check('bến thuyền: 8 bến, chỗ đứng khô, chỗ thả đủ rộng cho thuyền lớn nhất được thuê', () => {
  const D = B.docks(); assert.equal(D.length, 8);
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
