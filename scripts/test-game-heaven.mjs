// ============================================================================
//  CỬU TRỌNG THIÊN + MENU ĐỊA ĐIỂM (NHA-DIADIEM-MANIFEST §4) — node scripts/test-game-heaven.mjs
// ============================================================================
import assert from 'node:assert/strict';
import * as EC from '../src/game/estate-core.js';
import * as E from '../src/game/estate.js';
import * as MS from '../src/game/mansions.js';
import * as HV from '../src/game/heaven.js';
import * as PU from '../src/game/places-ui.js';
import { platformTop } from '../src/game/obstacles.js';
import { JAIL, MINE } from '../src/game/prison.js';
import { CMINE } from '../src/game/guild-core.js';
import { ROOM_X0, ROOM_X1 } from '../src/game/terrain.js';
import { WORLD_TILES } from '../src/game/protocol.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const L = HV.heavenLayout(), T = MS.estates().filter((m) => m.heaven);
HV.registerHeaven();

check('9 tiên phủ ở h 283–291 (cuối sổ), mỗi phủ một phương / tên / phong cách; nhà phố h 256–282 không đổi', () => {
  assert.equal(EC.TIEN_H0, 283); assert.equal(EC.LISTING_COUNT, 292);
  assert.equal(T.length, 9); T.forEach((m, i) => { assert.equal(m.h, 283 + i); assert.equal(MS.estateByH(m.h), m); });
  assert.equal(new Set(T.map((m) => m.name)).size, 9); assert.equal(new Set(T.map((m) => m.style)).size, 9);
  assert.equal(new Set(L.plots.map((p) => p.dir.map((v) => v.toFixed(2)).join())).size, 9, 'mỗi phủ một phương');
  const ls = E.listings(); for (let h = 283; h < 292; h++) { assert.equal(ls[h].tier, 'tienphu'); assert.ok(E.isPhu(ls[h])); assert.ok(EC.isPhuH(h) && EC.isMansionH(h) && EC.isTienH(h)); }
  for (let h = 256; h < 283; h++) assert.ok(!E.isPhu(ls[h]) && ls[h].hi != null, `h ${h} phải là nhà phố`);
  assert.equal(E.priceOf(ls[283]).xu, 2 * E.priceOf(ls[284]).xu, 'Quân Thiên giá gấp đôi');
  for (let h = 283; h < 292; h++) { const r = EC.roomOfH(h); assert.ok(r.zones.length >= 4, 'tiên phủ có vùng bài trí'); }
});
check('vị trí: trong biên máy chủ, cách Thiên Lao / mỏ / lưới phòng; đảo không chồng nhau', () => {
  const cor = L.islands.flatMap((s) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const c = Math.cos(s.ry), n = Math.sin(s.ry); return { x: s.x + c * a * s.hw + n * b * s.hd, z: s.z - n * a * s.hw + c * b * s.hd }; }));
  const xs = cor.map((p) => p.x), zs = cor.map((p) => p.z);
  assert.ok(Math.min(...xs) > ROOM_X0 + 200 && Math.max(...xs) < ROOM_X1, 'trong dải phía Đông');
  assert.ok(Math.max(...xs) < (WORLD_TILES.maxX - 10) * 1.6, 'trong biên máy chủ');
  for (const P of [JAIL, MINE, CMINE]) assert.ok(Math.min(...zs) - (P.z + P.d / 2) >= 550, `cách ${P.name} ${(Math.min(...zs) - P.z - P.d / 2).toFixed(0)} m`);
  assert.ok(Math.min(...zs) > 0, 'không đụng lưới phòng (z ≤ −230)');
  const IS = L.islands.filter((q) => !q.apron); // thềm Nam Thiên Môn cố ý liền quảng trường giữa
  for (let i = 0; i < IS.length; i++) for (let j = i + 1; j < IS.length; j++) { const a = IS[i], b = IS[j]; assert.ok(Math.hypot(a.x - b.x, a.z - b.z) > Math.hypot(a.hw, a.hd) * 0 + Math.max(a.hw, a.hd) + Math.max(b.hw, b.hd) - 10, `đảo ${i} chồng ${j}`); }
});
check('đi được: từ Nam Thiên Môn qua cầu tới cổng mọi tiên phủ (mỗi bước 1 m đều có nền)', () => {
  assert.equal(platformTop(L.arrive.x, L.arrive.z), 0);
  assert.ok(Math.hypot(L.gate.x - L.arrive.x, L.gate.z - L.arrive.z) >= 20, 'điểm đến cách cổng ≥ 20 m (camera không lọt thân cổng)');
  assert.equal(platformTop(L.gate.x, L.gate.z), 0, 'cổng đứng trên thềm');
  for (const b of L.bridges) {
    const m = T.find((q) => q.k === b.i), C = HV.HEAVEN, sx = Math.abs(b.a.x - C.cx) < 1 ? 1 : Math.sign(b.a.x - C.cx);
    // quảng trường giữa: đi vòng lối ngoài tường phủ Quân Thiên (cách tâm 65 m — tường ở 50 m, mép đảo 80 m)
    const pts = [L.arrive, { x: C.cx + sx * 65, z: C.cz + 65 }, { x: C.cx + sx * 65, z: Math.max(C.cz - 65, Math.min(C.cz + 65, b.a.z)) }, b.a, b.b, m.gate];
    for (let k = 0; k + 1 < pts.length; k++) { const p = pts[k], q = pts[k + 1], n = Math.ceil(Math.hypot(q.x - p.x, q.z - p.z)); for (let t = 0; t <= n; t++) { const x = p.x + (q.x - p.x) * t / Math.max(1, n), z = p.z + (q.z - p.z) * t / Math.max(1, n); assert.ok(platformTop(x, z) != null, `${m.name}: hụt nền ở (${x.toFixed(1)}, ${z.toFixed(1)})`); } }
  }
  assert.ok(HV.inHeaven(L.arrive.x, L.arrive.z) && !HV.inHeaven(0, 0));
  assert.ok(Math.hypot(HV.THIEN_THE.x, HV.THIEN_THE.z) < 150 && !HV.inHeaven(HV.THIEN_THE.x, HV.THIEN_THE.z), 'Thiên Thê ở Sơn Môn');
});
check('menu Địa điểm: 8 thẻ đều có dòng, dòng đi được có toạ độ, có ăn / ngủ / làm / nhà đất / Cửu Trọng Thiên', () => {
  const ctx = { me: () => ({ x: 0, z: 60 }), own: null, homeSpot: () => null, estateInfo: () => null, contract: null, stations: [], icon: {}, deskDone: () => false, level: 1 };
  for (const t of PU.TABS) {
    const R = PU.rowsOf(t.id, ctx).filter((r) => !r.head); assert.ok(R.length >= 1, `thẻ ${t.name} trống`);
    for (const r of R) assert.ok(r.x != null || r.st || r.act || r.tab || r.info || r.home, `${t.name}: «${r.name}» không có chỗ đi`);
  }
  const est = PU.rowsOf('estate', ctx);
  assert.equal(est.filter((r) => r.ic === '🏯' && /Thiên Phủ/.test(r.name)).length, 9, '9 tiên phủ');
  assert.equal(est.filter((r) => r.ic === '🏯' && !/Thiên Phủ/.test(r.name)).length, 16, '16 biệt phủ');
  assert.equal(est.filter((r) => r.ic === '🏡').length, 8, '8 khu biệt thự');
  assert.ok(PU.rowsOf('eat', ctx).filter((r) => !r.head).length >= 10, 'ít nhất 10 chỗ ăn');
  assert.ok(PU.rowsOf('work', ctx).filter((r) => !r.head).length >= 20, 'đủ nghề');
  assert.ok(PU.rowsOf('travel', ctx).some((r) => /Cửu Trọng Thiên/.test(r.name)));
  const own = { ...ctx, own: { h: 290 }, homeSpot: () => ({ x: 1, z: 2 }) };
  assert.ok(/Viêm Thiên Phủ/.test(PU.rowsOf('home', own)[0].name), 'nhà tôi = tiên phủ đã mua');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:\n  - ${fails.join('\n  - ')}` : '');
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
