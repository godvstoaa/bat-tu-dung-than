// ============================================================================
//  TEST VA CHẠM (thuần Node — chỉ obstacles.js, không three.js/DOM):
//   1) Tường Huyền Thành: đi đường ngang qua TỪNG đoạn tường + từng mối nối → phải bị chặn
//      (bản cũ chỉ chặn 1 khối giữa đoạn → lỗ hở ~8 m ở mối nối, đi xuyên được).
//   2) Cổng Nam (+Z): 2 đoạn bỏ qua → đường ngang phải thông (không bị chặn nhầm).
//   3) Viền vách nền bậc cấp (landmarks › terrace): đi từ hông phải bị chặn ở MẶT vách
//      (không trèo lên nóc), cửa bậc chính diện phải còn mở.
//  Mô phỏng đúng bước kiểm của game: blockedByBuilding = tâm người + 4 điểm lệch 0,3 m
//  (obstacles.js), người đi dừng ở mẫu bị chặn đầu tiên — xuyên = đến đích không gặp chặn nào.
// ============================================================================
import assert from 'node:assert/strict';
import { addBlock, cityWallBlocks, markTerraceEdges, blockedByBuilding } from '../src/game/obstacles.js';

const CITY_R = 158, N = 64;
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
// 1) Tường Huyền Thành — đường ngang qua từng đoạn + mối nối
// ---------------------------------------------------------------------------
const segMid = (i) => { const a = ((i + 0.5) / N) * Math.PI * 2; return { a, x: Math.cos(a) * CITY_R, z: Math.sin(a) * CITY_R }; };
const isGate = (i) => { const am = ((i + 0.5) / N) * Math.PI * 2; return Math.abs(Math.sin(am)) > 0.985 && Math.sin(am) > 0; };

for (const b of cityWallBlocks(CITY_R, N)) addBlock(b.x, b.z, b.r); // đăng ký đúng như landmarks.js › wallRing

// Điều kiện bỏ cổng của wallRing (sin điểm giữa > 0,985, dương) thực tế bỏ 4 đoạn i = 14–17
// (điểm giữa 14.5 và 17.5 cũng > 0,985) — cityWallBlocks dùng ĐÚNG điều kiện đó để khối chặn
// chỉ nằm chỗ có mesh tường; quảng rộng giữa cổng do footprint model city_gate (GLB) chặn.
check('tường: đúng 3 khối/đoạn × 60 đoạn tường (4 đoạn cổng bỏ) = 180 khối', () => {
  assert.equal(cityWallBlocks(CITY_R, N).length, 180);
});

check('cổng Nam: hành lang giữ (|x| < 5) qua tường thành còn thông', () => {
  assert.equal(march(-4.5, CITY_R, 4.5, CITY_R), null, 'hành lang cổng bị chặn nhầm');
});

for (let i = 0; i < N; i++) {
  if (isGate(i)) continue; // đoạn cổng (không mesh): chặn bởi footprint city_gate GLB — ngoài tầm test thuần
  const m = segMid(i);
  const hit = march(m.x - 14, m.z, m.x + 14, m.z);
  check(`tường · đoạn ${i}/64: đường ngang bị chặn (${m.x.toFixed(0)}, ${m.z.toFixed(0)})`, () => assert.ok(hit, `XUYÊN tường tại đoạn ${i}`));
}

// mối nối giữa hai đoạn tường — đúng chỗ hở ~8 m của bản cũ; nối nằm trọn trong quảng cổng (cả hai đoạn là cổng) thì bỏ
for (let i = 0; i < N; i++) {
  const j = (i + 1) % N;
  if (isGate(i) && isGate(j)) continue;
  const a = ((i + 1) / N) * Math.PI * 2, x = Math.cos(a) * CITY_R, z = Math.sin(a) * CITY_R;
  const hit = march(x - 14, z, x + 14, z);
  check(`mối nối đoạn ${i}–${j}: đường ngang bị chặn`, () => assert.ok(hit, `XUYÊN tường ở mối nối (${x.toFixed(1)}, ${z.toFixed(1)})`));
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
console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
