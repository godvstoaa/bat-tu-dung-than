// ============================================================================
//  TEST DI CHUYỂN TỰ DO (motion.js — thuần Node): nhảy / nhảy hai lần, lượn rơi chậm, chạy nhanh tốn thể lực,
//  leo bám công trình (chỉ VIP) rồi đứng trên mái, bước ra mép rơi xuống, bơi / lội / dòng chảy / gầm cầu (water.js).
// ============================================================================
import assert from 'node:assert/strict';
import * as MO from '../src/game/motion.js';
import { addSolidOBB, addTall } from '../src/game/obstacles.js';
import { MOAT, CANAL_WATER } from '../src/game/canals.js';
import * as T from '../src/game/terrain.js';
import * as MV from '../src/game/movement.js';
import { riverPoints } from '../src/game/waterways.js';
import { riverBridges, deckTop, bridgePlatforms } from '../src/game/bridges.js';
import { addPlatform } from '../src/game/obstacles.js';
// nền mặt cầu lớn (landmarks.js đăng ký lúc dựng — test tự đăng ký)
for (const b of riverBridges()) for (const q of bridgePlatforms(b)) addPlatform(q.x, q.z, q.w, q.d, q.ry, q.top, q.top - b.thick);

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const dt = 1 / 60, BASE = 5.6;
const run = (p, input, sec) => { let r; for (let t = 0; t < sec; t += dt) { r = MO.moveFree(p, input, dt, BASE); input.jump = false; } return r; };
const idle = { dx: 0, dz: 0 };
// khối nhà thử ở vùng phẳng (Ngoại Thành cung Chấn): 6 × 6 m, mái cao 10 m
const BX = 250, BZ = 0;
addSolidOBB(BX, BZ, 3, 3, 0); addTall(BX, BZ, 3, 3, 0, 10);

check('nhảy: bật lên rồi rơi về đất; nhảy hai lần (khinh công) cao hơn', () => {
  const p = { x: BX - 20, z: 0 }; run(p, idle, 0.2);
  assert.equal(p.y3, 0);
  let peak = 0; MO.moveFree(p, { ...idle, jump: true }, dt, BASE); for (let i = 0; i < 90; i++) { MO.moveFree(p, idle, dt, BASE); peak = Math.max(peak, p.y3); }
  assert.ok(peak > 1 && peak < 2, `đỉnh nhảy ${peak.toFixed(2)}`); assert.equal(p.y3, 0); assert.equal(p.air, false);
  let peak2 = 0; MO.moveFree(p, { ...idle, jump: true }, dt, BASE); for (let i = 0; i < 20; i++) MO.moveFree(p, idle, dt, BASE);
  MO.moveFree(p, { ...idle, jump: true }, dt, BASE); for (let i = 0; i < 120; i++) { MO.moveFree(p, idle, dt, BASE); peak2 = Math.max(peak2, p.y3); }
  assert.ok(peak2 > peak + 0.8, `nhảy hai lần ${peak2.toFixed(2)} > ${peak.toFixed(2)}`);
});
check('lượn: giữ Space khi rơi — rơi chậm (≤ 2,2 m/s) và lướt nhanh hơn', () => {
  const p = { x: BX - 20, z: 10, y3: 30, vy: 0, stamina: 100 };
  for (let i = 0; i < 60; i++) MO.moveFree(p, { dx: 1, dz: 0, hold: true }, dt, BASE);
  assert.ok(p.vy >= -MO.GLIDE_FALL - 1e-6 && p.gliding, `vy ${p.vy}`);
  const q = { x: BX - 20, z: 14, y3: 30, vy: 0, stamina: 100 };
  for (let i = 0; i < 60; i++) MO.moveFree(q, { dx: 1, dz: 0 }, dt, BASE);
  assert.ok(p.y3 > q.y3 + 5, 'lượn phải rơi chậm hơn'); assert.ok(p.x - (BX - 20) > q.x - (BX - 20), 'lượn lướt xa hơn');
});
check('chạy nhanh (Shift): nhanh gấp ~1,9, tốn thể lực; đứng nghỉ hồi lại', () => {
  const a = { x: BX - 60, z: 20 }, b = { x: BX - 60, z: 24 };
  run(a, { dx: 1, dz: 0 }, 1); run(b, { dx: 1, dz: 0, sprint: true }, 1);
  assert.ok((b.x - (BX - 60)) / (a.x - (BX - 60)) > 1.7);
  assert.ok(b.stamina < 95); const s0 = b.stamina; run(b, idle, 1); assert.ok(b.stamina > s0);
});
check('leo trèo: không VIP bị chặn (nhắc mở khoá); VIP đu bám leo lên tới mái 10 m rồi đứng trên mái', () => {
  const n = { x: BX - 3.8, z: BZ };
  const r = run(n, { dx: 1, dz: 0 }, 1);
  assert.equal(r.blockedMsg, 'climb'); assert.ok(n.x < BX - 3.2 && n.y3 < 0.1, 'không VIP không được leo');
  const v = { x: BX - 3.8, z: BZ };
  run(v, { dx: 1, dz: 0, canClimb: true }, 3.4);
  assert.ok(Math.abs(v.y3 - 10) < 0.2 && !v.air, `đứng trên mái: y=${v.y3.toFixed(2)}`); assert.ok(v.x > BX - 3, 'đã bước lên mái');
  // đi trên mái, bước ra mép bên kia: rơi xuống đất
  run(v, { dx: 1, dz: 0, canClimb: true }, 3);
  assert.ok(v.x > BX + 3 && Math.abs(v.y3) < 0.05, `rơi về đất: x=${v.x.toFixed(1)} y=${v.y3.toFixed(2)}`);
});
check('bơi: xuống hào thì nổi nhấp nhô quanh «mặt nước − 1 m», bơi chậm; đu người trèo lên kè 2,2 m (tốn thể lực)', () => {
  const p = { x: 60, z: -(MOAT.a + MOAT.w / 2 + 1.5) }; run(p, idle, 0.3); // bờ ngoài hào phía Bắc, lệch khỏi đại lộ Khảm
  assert.ok(Math.abs(p.y3 - 0) < 0.05, `đứng bờ y=${p.y3}`);
  run(p, { dx: 0, dz: 1 }, 1.5); // bước xuống hào
  let lo = 9, hi = -9; for (let i = 0; i < 180; i++) { MO.moveFree(p, idle, dt, BASE); if (i > 60) { lo = Math.min(lo, p.y3); hi = Math.max(hi, p.y3); } }
  assert.ok(p.swim, 'phải đang bơi');
  assert.ok(lo > CANAL_WATER - MO.FLOAT - 0.4 && hi < CANAL_WATER - MO.FLOAT + 0.4, `nổi ${lo.toFixed(2)}…${hi.toFixed(2)}`);
  const z0 = p.z; run(p, { dx: 0, dz: 1 }, 2); const v = (p.z - z0) / 2;
  assert.ok(v > 0.8 && v < 2, `bơi ${v.toFixed(2)} m/s`);
  const st = p.stamina; run(p, { dx: 0, dz: -1 }, 6); // bơi ngược ra bờ, trèo kè
  assert.ok(!p.swim && Math.abs(p.y3 - 0.35) < 0.6 && p.z < -(MOAT.a + MOAT.w / 2), `đã lên bờ: swim=${p.swim} y=${p.y3.toFixed(2)}`);
  assert.ok(p.stamina < st, 'trèo kè tốn thể lực');
});
// điểm giữa sông Huyền Hà (đoạn thẳng phía Nam thành) và hướng xuôi dòng
const RP = riverPoints().find((q) => q.x > -250 && q.x < -150);
check('sông: bơi thường ngược dòng giữa lạch gần như đứng yên (≤ 0,25 m/s), xuôi dòng nhanh hơn hẳn; gắng sức thì tiến được', () => {
  const up = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 100 }, dn = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 100 };
  run(up, idle, 0.5); run(dn, idle, 0.5);
  const a0 = [up.x, up.z], b0 = [dn.x, dn.z];
  run(up, { dx: -RP.tx, dz: -RP.tz }, 6); run(dn, { dx: RP.tx, dz: RP.tz }, 6);
  const prog = (p, o, sg) => ((p.x - o[0]) * RP.tx + (p.z - o[1]) * RP.tz) * sg / 6;
  const vu = prog(up, a0, -1), vd = prog(dn, b0, 1);
  assert.ok(up.swim && dn.swim, 'đang bơi giữa sông');
  assert.ok(vu < 0.25, `ngược dòng ${vu.toFixed(2)} m/s`); assert.ok(vd > 2, `xuôi dòng ${vd.toFixed(2)} m/s`);
  const sp = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 100 }; run(sp, idle, 0.5); const s0 = [sp.x, sp.z];
  run(sp, { dx: -RP.tx, dz: -RP.tz, sprint: true }, 4);
  assert.ok(prog(sp, s0, -1) * 6 / 4 > 0.6, 'gắng sức tiến được ngược dòng');
});
check('kiệt sức: không chìm, chỉ nổi và trôi theo dòng', () => {
  const p = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 0 }; run(p, idle, 0.5); const o = [p.x, p.z];
  run(p, { dx: -RP.tx, dz: -RP.tz }, 5);
  const d = (p.x - o[0]) * RP.tx + (p.z - o[1]) * RP.tz;
  assert.ok(p.swim && p.y3 > T.WATER - 1.5, 'vẫn nổi'); assert.ok(d > 3, `trôi xuôi ${d.toFixed(1)} m`);
});
check('lội: nước 0,5–1,3 m đi chậm còn ~0,6, không chạy nhanh được', () => {
  // tìm điểm ven sông sâu ~0,9 m
  let q = null;
  for (let o = RP.w - 1; o > 0 && !q; o -= 0.25) { const x = RP.x - RP.tz * o, z = RP.z + RP.tx * o, d = T.WATER - T.heightAt(x, z); if (d > 0.8 && d < 1.0) q = { x, z }; }
  assert.ok(q, 'có bãi nông');
  const p = { x: q.x, z: q.z }; run(p, idle, 0.5);
  assert.ok(p.wade && !p.swim, `đang lội (wade=${p.wade} swim=${p.swim})`);
  const w0 = [p.x, p.z]; MO.moveFree(p, { dx: RP.tx, dz: RP.tz, sprint: true }, 0.2, BASE);
  const v = Math.hypot(p.x - w0[0], p.z - w0[1]) / 0.2;
  assert.ok(Math.abs(v - BASE * MO.WADE.speed) < 0.3, `lội ${v.toFixed(2)} m/s`);
});
check('cầu: đi trên mặt Nam Môn Đại Kiều; bơi dưới gầm cầu không bị nhấc lên mặt cầu', () => {
  const b = riverBridges()[0];
  const top = { x: b.x, z: b.z }; run(top, idle, 0.4);
  assert.ok(Math.abs(top.y3 - deckTop(b, 0)) < 0.1, `trên cầu y=${top.y3.toFixed(1)} (mặt ${deckTop(b, 0).toFixed(1)})`);
  const sw = { x: b.x + 3, z: b.z + 5, y3: T.WATER - 1, stamina: 100 }; run(sw, idle, 1);
  assert.ok(sw.swim && sw.y3 < T.WATER + 0.5, `dưới gầm: swim=${sw.swim} y=${sw.y3.toFixed(1)}`);
});

// --- ĐẠP NƯỚC (P14 — movement.js) ---------------------------------------------------------------------------------
check('đạp nước: mặt sóng thành mặt đi được (không bơi), thân pháp tốn 2 thể lực / giây, hết thì rơi xuống bơi; đồ Ngọc không tốn sức', () => {
  const tp = MV.waterWalkOf({ level: 10, yong: { primary: '水' } }), item = MV.waterWalkOf({ owned: ['hai_ho_than'] });
  assert.equal(tp.id, 'thuy_thuong_phieu'); assert.equal(item.stamina, 0);
  assert.equal(MV.waterWalkOf({ level: 9, yong: { primary: '水' } }), null); assert.equal(MV.waterWalkOf({ level: 12, yong: { accent: '水' } }).id, 'thuy_thuong_phieu');
  assert.equal(MV.waterWalkOf({ level: 15, everPerk: true }).id, 'lang_ba'); assert.equal(MV.waterWalkOf({ level: 15 }), null);
  const p = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 100 };
  const go = (q, ww, secs) => { for (let i = 0; i < secs * 30; i++) MO.moveFree(q, { dx: 0, dz: 0, ww }, 1 / 30, 4); };
  go(p, tp, 1);
  const lv = MO.waterLevelAt(p.x, p.z, p.y3 - 0.1);
  assert.ok(!p.swim && p.waterWalk, 'đứng trên mặt nước'); assert.ok(Math.abs(p.y3 - (lv + 0.02)) < 0.15, `cao ${p.y3.toFixed(2)} vs mặt ${lv.toFixed(2)}`);
  const s1 = p.stamina; go(p, tp, 2); assert.ok(Math.abs((s1 - p.stamina) - 4) < 0.5, `tốn ${(s1 - p.stamina).toFixed(2)} / 2 giây`);
  go(p, tp, 60); assert.ok(p.swim && !p.waterWalk && p.wwLost, 'hết thể lực thì rơi xuống bơi');
  const q = { x: RP.x, z: RP.z, y3: T.WATER - 1, stamina: 50 }; go(q, item, 20); assert.ok(q.waterWalk && q.stamina >= 50, 'Hài Hộ Thân không tốn sức');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
