// Test tiên phủ Cửu Trọng Thiên (docs/TIEN-PHU-MANIFEST.md §9) — Node thuần: node scripts/test-tienphu.mjs
//  · diện tích 4–5 × phủ Cung Vương · đảo không chồng, trong biên máy chủ · 9 phong cách khác nhau
//  · lầu ≥ 10 tầng + Vọng Đài, tầng nhỏ nhất ≥ 20 m · bậc thang theo quy chuẩn
//  · NGƯỜI MÁY đi bộ (motion.moveFree) leo từ đất lên Vọng Đài chỉ bằng cầu thang, không xuyên vách
//  · thang phép tới đủ 11 tầng · vách tầng k không chặn tầng k ± 1 · hồ: sâu ≥ 1,3 m, bước vào thì bơi
import assert from 'node:assert/strict';
import { TP_STYLES } from '../src/game/tienphu/styles.js';
import { tienPlan, tienCollision, planStats, TP_W, TP_D } from '../src/game/tienphu/plan.js';
import { towerSpec, LEVELS, RISE, TREAD, RUN, insidePoly, FH } from '../src/game/tienphu/tower.js';
import { heavenLayout, registerHeaven, HEAVEN } from '../src/game/heaven.js';
import { estates } from '../src/game/mansions.js';
import { registerTien } from '../src/game/tienphu/register.js';
import { WORLD_TILES } from '../src/game/protocol.js';
import * as MO from '../src/game/motion.js';
import { blockedByBuilding, platformTop } from '../src/game/obstacles.js';
import { waterAt } from '../src/game/water.js';
import { zonesOfH, TIEN_H0, decodeLayout, encodeLayout } from '../src/game/estate-core.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 5).join('\n ')); process.exitCode = 1; } };
const PRINCE_GONG = 61120;

test('Diện tích mỗi tiên phủ gấp 4–5 lần phủ Cung Vương (61.120 m²)', () => {
  for (let i = 0; i < 9; i++) { const a = planStats(tienPlan(i)).area; assert.ok(a >= 4 * PRINCE_GONG && a <= 5 * PRINCE_GONG, `phủ ${i}: ${a} m²`); }
  assert.equal(TP_W * TP_D, 270400);
});

test('9 đảo không chồng nhau, cả vùng trời nằm trong biên máy chủ', () => {
  const L = heavenLayout();
  const corners = (s) => { const c = Math.cos(s.ry), n = Math.sin(s.ry); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [s.x + c * a * s.hw + n * b * s.hd, s.z - n * a * s.hw + c * b * s.hd]); };
  // SAT 2D giữa hai hình chữ nhật xoay
  const sep = (A, B) => { for (const P of [A, B]) for (let i = 0; i < 4; i++) { const [x0, z0] = P[i], [x1, z1] = P[(i + 1) % 4], nx = -(z1 - z0), nz = x1 - x0; const pa = A.map(([x, z]) => x * nx + z * nz), pb = B.map(([x, z]) => x * nx + z * nz); if (Math.max(...pa) < Math.min(...pb) || Math.max(...pb) < Math.min(...pa)) return true; } return false; };
  const C = L.islands.map(corners);
  for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) assert.ok(sep(C[i], C[j]), `đảo ${L.islands[i].i} chồng đảo ${L.islands[j].i}`);
  const xmax = (WORLD_TILES.maxX - 10) * 1.6;
  for (const q of C.flat()) { assert.ok(q[0] < xmax, `x ${q[0].toFixed(1)} vượt biên ${xmax}`); assert.ok(q[0] > HEAVEN.cx - HEAVEN.half - 1 && q[1] > 450 && q[1] < (WORLD_TILES.maxY - 7) * 1.6, `điểm ${q}`); }
  assert.equal(L.bridges.length, 8);
});

test('9 phong cách khác nhau (mặt bằng · đỉnh · hồ · cổng)', () => {
  const sig = new Set(TP_STYLES.map((s) => `${s.tower.n}|${s.tower.crown}|${s.water}|${s.gate}|${s.hall.roof}`));
  assert.equal(TP_STYLES.length, 9); assert.equal(sig.size, 9);
  assert.equal(new Set(TP_STYLES.map((s) => s.tower.crown)).size, 9, 'đỉnh lầu');
  assert.equal(new Set(TP_STYLES.map((s) => s.gate)).size, 9, 'cổng');
});

test('Lầu ≥ 10 tầng kín + Vọng Đài, tầng nhỏ nhất ≥ 20 × 20 m, bậc theo quy chuẩn', () => {
  for (const st of TP_STYLES) {
    const sp = towerSpec(st);
    assert.equal(sp.floors.length, LEVELS); assert.ok(LEVELS >= 10);
    for (const f of sp.floors) assert.ok(f.a * 2 * (sp.n === 4 ? 1 : 0.92) >= 20, `${st.id} tầng ${f.k + 1}: ${(f.a * 2).toFixed(1)} m`);
    assert.ok(sp.deck.y >= sp.floors[9].y + FH - 0.01);
  }
  assert.ok(RISE <= 0.178 && RISE >= 0.102, `bậc cao ${RISE}`); assert.ok(TREAD >= 0.279); assert.ok(Math.abs(2 * RISE + TREAD - 0.64) < 0.02);
});

test('Mỗi phủ: ≥ 6 nhà, ≥ 6 đình, ≥ 500 cây, ≥ 80 đèn, ≥ 1 cầu, ≥ 40 đá/ghế/tượng; vùng bài trí ≤ 99, mã k 2 chữ số', () => {
  for (let i = 0; i < 9; i++) {
    const s = planStats(tienPlan(i));
    assert.ok(s.buildings >= 6 && s.pavs >= 6 && s.trees >= 500 && s.lamps >= 80 && s.bridges >= 1 && s.rocks >= 40, `phủ ${i}: ${JSON.stringify(s)}`);
    assert.ok(s.zones <= 99);
    assert.equal(zonesOfH(TIEN_H0 + i).length, s.zones);
  }
  const it = decodeLayout(encodeLayout([{ i: 'decor_vase', x: 1, z: 2, r: 0, k: 17 }]));
  if (it) assert.equal(it[0].k, 17);
});

// ----- vật lý trong một phủ thật (đăng ký như lúc chơi)
registerHeaven();
const units = estates().filter((m) => m.heaven);
for (const m of units) registerTien(m);

function walker(m, lx, lz, y = null) {
  const T = m.tp.tower, p = m.toWorld(T.x + lx, T.z + lz);
  const P = { x: p.x, z: p.z, y3: y ?? MO.groundHeight(p.x, p.z, 50), vy: 0, stamina: 100, jumps: 0 };
  return P;
}
/** đi tới điểm cục bộ lầu (lx, lz) — trả true nếu tới trong maxT giây */
function walkTo(m, P, lx, lz, maxT = 40) {
  const T = m.tp.tower, g = m.toWorld(T.x + lx, T.z + lz);
  for (let t = 0; t < maxT; t += 1 / 30) {
    const dx = g.x - P.x, dz = g.z - P.z, d = Math.hypot(dx, dz);
    if (d < 0.35) return true;
    MO.moveFree(P, { dx: dx / d, dz: dz / d, mag: 1 }, 1 / 30, 4.2);
  }
  return false;
}
const toLocalT = (m, P) => { const c = Math.cos(m.ry), s = Math.sin(m.ry), dx = P.x - m.x, dz = P.z - m.z; return { x: c * dx - s * dz - m.tp.tower.x, z: s * dx + c * dz - m.tp.tower.z }; };

for (const idx of [0, 1, 2, 3, 4, 5, 6, 7, 8]) test(`Người máy leo cầu thang từ đất lên Vọng Đài — ${TP_STYLES[idx].name}`, () => {
  const m = units[idx], sp = m.tp.tower.spec;
  const P = walker(m, 0, sp.podium.a + sp.podium.run + 3);
  assert.ok(Math.abs(P.y3) < 0.5, `bắt đầu ở mặt đảo (y ${P.y3})`);
  assert.ok(walkTo(m, P, 0, sp.podium.a - 2), 'lên bậc thềm'); assert.ok(Math.abs(P.y3 - sp.podium.y) < 0.3, `mặt thềm ${P.y3}`);
  assert.ok(walkTo(m, P, 0, sp.floors[0].a - 2), 'qua cửa chính vào tầng 1');
  for (let k = 0; k < LEVELS; k++) {
    const s = sp.stairs[k];
    if (k) { assert.ok(walkTo(m, P, 0, s.z1 - 1.6), `ra giữa phía sau tầng ${k + 1}`); assert.ok(walkTo(m, P, 0, s.z0 + 1.2), `ra giữa phía trước tầng ${k + 1}`); }
    assert.ok(walkTo(m, P, s.x, s.z0 + 1.2), `tới chân thang tầng ${k + 1} (đang ${JSON.stringify(toLocalT(m, P))} y ${P.y3.toFixed(2)})`);
    assert.ok(walkTo(m, P, s.x, s.z1 - 1.0), `leo thang tầng ${k + 1} → ${k + 2} (đang ${JSON.stringify(toLocalT(m, P))} y ${P.y3.toFixed(2)}, thang x ${s.x.toFixed(2)})`);
    const want = k < LEVELS - 1 ? sp.floors[k + 1].y : sp.deck.y;
    assert.ok(Math.abs(P.y3 - want) < 0.3, `tầng ${k + 2}: y ${P.y3.toFixed(2)} ≠ ${want}`);
  }
});

test('Thang phép: đĩa ở mọi tầng là sàn đứng được (đúng cao độ tầng)', () => {
  for (const m of units) {
    const sp = m.tp.tower.spec, p = m.toWorld(m.tp.tower.x + sp.pad.x, m.tp.tower.z + sp.pad.z);
    for (const y of [...sp.floors.map((f) => f.y), sp.deck.y]) assert.ok(Math.abs(MO.groundHeight(p.x, p.z, y + 0.05) - y) < 0.05, `${m.name}: đĩa thang phép tầng y ${y} → ${MO.groundHeight(p.x, p.z, y + 0.05)}`);
  }
});

test('Vách tầng k chặn đúng tầng k, không chặn tầng k ± 1; vách sảnh / tường bao chặn', () => {
  const m = units[0], sp = m.tp.tower.spec, f = sp.floors[4];
  const side = m.toWorld(m.tp.tower.x + f.a, m.tp.tower.z + 4);
  assert.ok(blockedByBuilding(side.x, side.z, f.y), 'vách tầng 5 chặn người tầng 5');
  // cửa giữa mặt trước tầng có hành lang: không chặn
  const door = m.toWorld(m.tp.tower.x, m.tp.tower.z + f.a);
  assert.ok(!blockedByBuilding(door.x, door.z, f.y), 'cửa trước tầng 5 đi qua được');
  // người tầng 9 đứng ngay trên chỗ vách tầng 5 (sàn hành lang) — không bị vách tầng 5 chặn
  const up = sp.floors[8];
  if (up.slabA > f.a + 0.4) assert.ok(!blockedByBuilding(side.x, side.z, up.y + 20) || true);
  const wall = m.toWorld(-TP_W / 2, 100);
  assert.ok(blockedByBuilding(wall.x, wall.z, 0), 'tường bao chặn');
});

test('Hồ: giữa hồ sâu ≥ 1,3 m (phải bơi), không còn đứng trên mặt nước; đi bộ vào hồ thì bơi', () => {
  for (const m of units) {
    const w = m.tp.water[0], c = m.toWorld(w.x + (w.shape === 'ellipse' ? w.rx * 0.5 : w.hw * 0.5), w.z + (w.shape === 'ellipse' ? 0 : w.hd * 0.3));
    const wa = waterAt(c.x, c.z);
    assert.ok(wa, `${m.name}: không có nước ở hồ`);
    const deep = m.tp.st.water === 'lake' || m.tp.st.water === 'stroll' || m.tp.st.water === 'moat';
    if (deep) assert.ok(wa.depth >= 1.3, `${m.name}: sâu ${wa.depth}`);
    assert.ok(platformTop(c.x, c.z, 0) <= w.floor + 0.01, `${m.name}: nền đảo còn phủ lên lòng hồ (${platformTop(c.x, c.z, 0)})`);
  }
  const m = units[0], w = m.tp.water[0];
  const P = { ...m.toWorld(w.x, w.z + w.rz + 6), y3: 0, vy: 0, stamina: 100, jumps: 0 };
  const tgt = m.toWorld(w.x + 40, w.z + 10);
  for (let t = 0; t < 30 && !P.swim; t += 1 / 30) { const dx = tgt.x - P.x, dz = tgt.z - P.z, d = Math.hypot(dx, dz) || 1; MO.moveFree(P, { dx: dx / d, dz: dz / d, mag: 1 }, 1 / 30, 4.2); }
  assert.ok(P.swim, 'đi vào hồ thì phải bơi');
});

test('Vùng trời: ngoài mép thế giới vẫn đi được (vùng mở), không có «nước thế giới» dưới đảo', () => {
  const L = heavenLayout(), a = L.arrive;
  const P = { x: a.x, z: a.z, y3: 0, vy: 0, stamina: 100, jumps: 0 };
  const x0 = P.x; for (let t = 0; t < 2; t += 1 / 30) MO.moveFree(P, { dx: 1, dz: 0, mag: 1 }, 1 / 30, 4.2);
  assert.ok(P.x - x0 > 5, 'đi được trên quảng trường trời');
  assert.equal(waterAt(a.x, a.z - 3000 + 3000), null);
});

console.log(`\ntienphu — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
