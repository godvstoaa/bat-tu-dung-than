// ============================================================================
//  TEST VA CHẠM (thuần Node — chỉ obstacles.js, không three.js/DOM):
//   1) Tường bát giác Bát Quái Thành: đi ngang qua mọi cạnh (ngoài ô cổng) và mọi đỉnh → bị chặn;
//      hành lang giữa 8 cổng (Bát Môn) phải thông.
//   3) Viền vách nền bậc cấp (landmarks › terrace): đi từ hông phải bị chặn ở MẶT vách
//      (không trèo lên nóc), cửa bậc chính diện phải còn mở.
//  Mô phỏng đúng bước kiểm của game: blockedByBuilding = tâm người + 4 điểm lệch 0,3 m
//  (obstacles.js), người đi dừng ở mẫu bị chặn đầu tiên — xuyên = đến đích không gặp chặn nào.
// ============================================================================
import assert from 'node:assert/strict';
import { addBlock, markTerraceEdges, blockedByBuilding } from '../src/game/obstacles.js';
import { octWallBlocks, wallSegments, octVertices, GUA, OCT_A, TAN8, gateHalf, toWorld } from '../src/game/batquai.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};

// Đi thẳng từ A tới B, bước 5 cm; trả mẫu bị chặn ĐẦU TIÊN hoặc null (đi tới đích = xuyên).
function march(x0, z0, x1, z1, step = 0.05) {
  const d = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(d / step));
  for (let k = 0; k <= n; k++) {
    const t = k / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
    if (blockedByBuilding(x, z)) return { x, z };
  }
  return null;
}

// ---------------------------------------------------------------------------
// 1) Tường bát giác Bát Quái Thành — đường cắt ngang qua từng cạnh (ngoài ô cổng) + từng đỉnh
// ---------------------------------------------------------------------------
for (const b of octWallBlocks()) addBlock(b.x, b.z, b.r); // đăng ký đúng như batquai3d.js › octWall
for (const p of octVertices()) addBlock(p.x, p.z, 6.8);     // tháp góc

check('tường: 16 đoạn (8 cạnh × 2 bên cổng)', () => assert.equal(wallSegments().length, 16));
for (const g of GUA) {
  const L = OCT_A * TAN8, h = gateHalf(g);
  check(`cổng ${g.gate}: hành lang giữa (|v| < 5) qua tường còn thông`, () => {
    const a = toWorld(g, OCT_A - 9, 0), b = toWorld(g, OCT_A + 9, 0);
    assert.equal(march(a.x, a.z, b.x, b.z), null, 'hành lang cổng bị chặn nhầm');
  });
  for (let v = -L + 1; v <= L - 1; v += 3.1) {
    if (Math.abs(v) < h + 1) continue; // ô cổng: model cổng chặn (ngoài tầm test thuần)
    const a = toWorld(g, OCT_A - 14, v), b = toWorld(g, OCT_A + 14, v);
    check(`tường cung ${g.name} · v=${v.toFixed(1)}: đường ngang bị chặn`, () => assert.ok(march(a.x, a.z, b.x, b.z), `XUYÊN tường (${a.x.toFixed(0)}, ${a.z.toFixed(0)})`));
  }
}
for (const p of octVertices()) {
  const n = Math.hypot(p.x, p.z);
  check(`đỉnh tường (${p.x.toFixed(0)}, ${p.z.toFixed(0)}): đi chéo qua bị chặn`, () => assert.ok(march(p.x * (1 - 14 / n), p.z * (1 - 14 / n), p.x * (1 + 14 / n), p.z * (1 + 14 / n))));
}

// ---------------------------------------------------------------------------
// 2) Viền vách nền bậc cấp — không trèo lên nóc từ hông, cửa bậc vẫn mở
// ---------------------------------------------------------------------------
// 2a. Nền thẳng (ry = 0) 190×160 tại (1000, 500), cửa bậc rộng w·0,22 như terrace()
{
  const X = 1000, Z = 500, W = 190, D = 160, HW = W * 0.49, HD = D * 0.49, STAIR = W * 0.11;
  markTerraceEdges(X, Z, 0, W * 0.98, D * 0.98, { stairW: STAIR });
  const hit = march(X - HW - 22, Z, X - HW + 22, Z);
  check('nền thẳng: đi từ HÔNG trái → bị chặn trước mặt vách', () => {
    assert.ok(hit, 'XUYÊN vách hông từ ngoài vào lòng nền');
    assert.ok(hit.x > X - HW - 3, `bị chặn quá xa mặt vách (x=${hit.x.toFixed(2)}, vách ở ${X - HW})`);
  });
  check('nền thẳng: đi từ HÔNG phải → bị chặn trước mặt vách', () => {
    const h2 = march(X + HW + 22, Z, X + HW - 22, Z);
    assert.ok(h2 && h2.x < X + HW + 3, 'XUYÊN vách hông phải');
  });
  check('nền thẳng: đi từ MÉP SAU → bị chặn', () => {
    const h3 = march(X, Z - HD - 22, X, Z - HD + 22);
    assert.ok(h3 && h3.z < Z - HD + 3, 'XUYÊN mép sau');
  });
  check('nền thẳng: mặt bậc GIỮA (trong cửa w·0,22) → còn đi lên được', () => {
    assert.equal(march(X, Z + HD + 22, X, Z + HD - 22), null, 'cửa bậc giữa bị chặn nhầm');
  });
  check('nền thẳng: mặt bậc TRÁNH khối giữa (ngoài cửa w·0,22) → bị chặn', () => {
    const h4 = march(X + STAIR + 4, Z + HD + 22, X + STAIR + 4, Z + HD - 22);
    assert.ok(h4, 'trèo lên nóc từ mép trước ngoài cửa bậc');
  });
}
// 2b. Nền XOAY ry = 0,7 rad 150×120 tại (−1000, 500) — vách phải xoay theo nền
{
  const X = -1000, Z = 500, RY = 0.7, W = 150, D = 120, HW = W * 0.49, HD = D * 0.49, STAIR = W * 0.11;
  markTerraceEdges(X, Z, RY, W * 0.98, D * 0.98, { stairW: STAIR });
  const w = (lx, lz) => [X + Math.cos(RY) * lx + Math.sin(RY) * lz, Z - Math.sin(RY) * lx + Math.cos(RY) * lz];
  // vách phải (local x = +HW): đi từ ngoài (local x 95) vào trong (local x 55)
  const [ax, az] = w(95, 0), [bx, bz] = w(55, 0);
  const hit = march(ax, az, bx, bz);
  check('nền xoay 0,7 rad: đi qua vách phải → bị chặn ở mặt vách', () => {
    assert.ok(hit, 'XUYÊN vách phải của nền xoay');
    // đổi điểm bị chặn về local: phải còn trước/nghĩa là sát mặt vách (≤ 2 m trong)
    const dx = hit.x - X, dz = hit.z - Z;
    const lx = Math.cos(RY) * dx - Math.sin(RY) * dz;
    assert.ok(lx >= HW - 2, `bị chặn quá sâu trong nền (local x=${lx.toFixed(2)}, vách ở ${HW.toFixed(2)})`);
  });
  // cửa bậc chính diện (local x = 0, qua mép trước local z = +HD) → mở
  const [cx, cz] = w(0, HD + 22), [dx2, dz2] = w(0, HD - 22);
  check('nền xoay: cửa bậc giữa mặt trước → còn đi lên được', () => {
    assert.equal(march(cx, cz, dx2, dz2), null, 'cửa bậc của nền xoay bị chặn nhầm');
  });
  // mặt trước ngoài cửa → chặn
  const [ex, ez] = w(STAIR + 4, HD + 22), [fx, fz] = w(STAIR + 4, HD - 22);
  check('nền xoay: mặt trước ngoài cửa bậc → bị chặn', () => {
    assert.ok(march(ex, ez, fx, fz), 'trèo lên nóc từ mép trước ngoài cửa bậc (nền xoay)');
  });
}

// ---------------------------------------------------------------------------
// 4) Đặc hoá công trình lớn (collide.js › solidifyCells): viền tường có khe → lòng điện phải đặc,
//    đường hầm thông hai đầu (cổng thành) phải còn thông.
// ---------------------------------------------------------------------------
{
  const { solidifyCells } = await import('../src/game/collide.js');
  const key = (i, j) => (i + 32768) * 65536 + (j + 32768);
  const has = (out, i, j) => out.some(([a, b]) => a === i && b === j);
  // viền chữ nhật 40×20 ô, mặt trước hở 3 khe rộng 2, 3, 6 ô
  const ring = new Set();
  for (let i = 0; i <= 40; i++) for (const j of [0, 20]) { const gap = j === 20 && ((i >= 5 && i <= 6) || (i >= 15 && i <= 17) || (i >= 28 && i <= 33)); if (!gap) ring.add(key(i, j)); }
  for (let j = 0; j <= 20; j++) { ring.add(key(0, j)); ring.add(key(40, j)); }
  check('đặc hoá r=4: khe ≤ 8 ô được đóng, lòng điện đặc', () => {
    const out = solidifyCells(ring, 4);
    assert.ok(has(out, 20, 10), 'lòng điện vẫn rỗng');
    assert.ok(has(out, 16, 20) && has(out, 30, 20), 'khe trên viền chưa được đóng');
  });
  check('đặc hoá r=1: khe rộng hơn 2 ô → lòng thông ra ngoài, không lấp', () => {
    const out = solidifyCells(ring, 1);
    assert.ok(!has(out, 20, 10), 'lấp nhầm lòng có cửa rộng');
  });
  // đường hầm: hai tường song song dài 30 ô, cách nhau 16 ô (8 m) — hai đầu mở
  const tun = new Set();
  for (let i = 0; i <= 30; i++) { tun.add(key(i, 0)); tun.add(key(i, 16)); }
  check('đặc hoá: đường hầm thông hai đầu không bị lấp', () => {
    const out = solidifyCells(tun, 4);
    assert.ok(!has(out, 15, 8), 'đường hầm cổng thành bị lấp');
  });
}

// ---------------------------------------------------------------------------
console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
