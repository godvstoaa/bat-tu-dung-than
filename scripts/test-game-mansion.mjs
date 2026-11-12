// ============================================================================
//  TEST KHUÔN VIÊN (mansions.js, estate-layout.js, cityblocks.mansionPlots / villaLots — thuần Node):
//   · 16 biệt phủ 4.000–10.000 m², mỗi phủ một phong cách; 240 biệt thự 300–500 m², 8 khu × 30, mỗi khu một phong cách;
//   · tất cả nằm gọn trong vành phủ, không đè nhau, không đè đường / quảng trường VIP / nhà phố;
//   · phong thủy: gò sau lưng nhà chính, mặt nước trước nhà, nhà phụ bên Thanh Long; hướng cửa ghi được;
//   · đi bộ được: từ ngoài cổng tới trong mọi nhà, sân, qua cầu; tường rào kín;
//   · người trong phủ không đứng / đi xuyên vật cản; lời theo trạng thái phủ.
// ============================================================================
import assert from 'node:assert/strict';
import * as MS from '../src/game/mansions.js';
import * as CB from '../src/game/cityblocks.js';
import * as LAYOUT from '../src/game/citylayout.js';
import { roads4, renderHouses } from '../src/game/city4.js';
import * as BQ from '../src/game/batquai.js';
import * as EL from '../src/game/estate-layout.js';
import * as T from '../src/game/terrain.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
// v6: tiên phủ Cửu Trọng Thiên (heaven) ở dải phía Đông — kiểm riêng trong test-game-heaven.mjs
const E = MS.estates().filter((m) => !m.heaven), P = E.filter((m) => m.kind === 'phu'), V = E.filter((m) => m.kind === 'villa');
const octMax = (x, z) => Math.max(...BQ.GUA.map((g) => x * g.dir[0] + z * g.dir[1]));
const corners = (m, pad = 0) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => m.toWorld(a * (m.W / 2 + pad), b * (m.D / 2 + pad)));
function sat(A, B) {
  for (const poly of [A, B]) for (let i = 0; i < 4; i++) {
    const p = poly[i], q = poly[(i + 1) % 4], nx = -(q.z - p.z), nz = q.x - p.x;
    const pr = (P2) => P2.map((v) => v.x * nx + v.z * nz), a = pr(A), b = pr(B);
    if (Math.max(...a) <= Math.min(...b) + 1e-6 || Math.max(...b) <= Math.min(...a) + 1e-6) return false;
  }
  return true;
}

check('16 biệt phủ 4.000–10.000 m², 16 phong cách; 240 biệt thự 300–500 m², 8 khu × 30, mỗi khu một phong cách', () => {
  assert.equal(P.length, 16); assert.equal(V.length, 240);
  for (const m of P) assert.ok(m.W * m.D >= 4000 && m.W * m.D <= 10000, `${m.name} ${m.W * m.D} m²`);
  assert.equal(new Set(P.map((m) => m.style)).size, 16);
  for (const m of V) assert.ok(m.W * m.D >= 300 && m.W * m.D <= 500);
  for (let d = 0; d < 8; d++) assert.equal(V.filter((m) => m.district === d).length, 30);
  assert.equal(new Set(V.map((m) => m.style)).size, 8);
  assert.equal(new Set(E.map((m) => m.name)).size, E.length, 'trùng tên');
  E.forEach((m, i) => assert.equal(m.h, i, 'h phải khớp thứ tự rao bán'));
  assert.equal(T.CITY_OCT, LAYOUT.CITY.A); // v4: tường Ngoại Thành 2.125
});
check('v4: nằm trong Ngoại Thành (vành 1.500 → tường 2.125), không đè nhau', () => {
  for (const m of E) for (const c of corners(m)) { const o = octMax(c.x, c.z); assert.ok(o > 1500 && o < LAYOUT.CITY.A - 4, `${m.name} góc o=${o.toFixed(1)}`); }
  const C = E.map((m) => corners(m, 0.3));
  for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) {
    if (Math.hypot(E[i].x - E[j].x, E[i].z - E[j].z) > 160) continue;
    assert.ok(!sat(C[i], C[j]), `${E[i].name} đè ${E[j].name}`);
  }
});
check('v4: không đè đường (đại lộ, vành, phố, ngõ — trừ đoạn nhường cho khuôn viên phủ), không đè nhà phố còn lại', () => {
  const roads = roads4();
  for (const m of E) {
    const poly = corners(m, -0.2);
    for (const r of roads) {
      const ax = r.a.x, az = r.a.z, bx = r.b.x, bz = r.b.z, L = Math.hypot(bx - ax, bz - az) || 1, ux = (bx - ax) / L, uz = (bz - az) / L, nx = -uz, nz = ux, hw = r.w / 2;
      if (Math.hypot((ax + bx) / 2 - m.x, (az + bz) / 2 - m.z) > L / 2 + 150) continue;
      const road = [{ x: ax + nx * hw, z: az + nz * hw }, { x: bx + nx * hw, z: bz + nz * hw }, { x: bx - nx * hw, z: bz - nz * hw }, { x: ax - nx * hw, z: az - nz * hw }];
      assert.ok(!sat(poly, road), `${m.name} đè đường ${r.kind} ${r.id}`);
    }
  }
  for (const h of renderHouses()) assert.equal(MS.mansionAt(h.x, h.z, 1), null, `nhà phố ${h.key} trong khuôn viên`);
});
check('phong thủy: gò sau nhà chính, mặt nước trước nhà, nhà phụ bên Thanh Long (+x); hướng cửa ghi được', () => {
  for (const m of E) {
    const L = m.layout, main = L.buildings[0];
    assert.ok(L.mound.z < main.z - main.d / 2, `${m.name}: gò không ở sau lưng`);
    for (const w of L.water) assert.ok(w.z > main.z + main.d / 2, `${m.name}: nước không ở trước nhà`);
    const guest = L.buildings.find((b) => b.id === 'guest'); if (guest) assert.ok(guest.x > 0, `${m.name}: nhà khách phải bên Thanh Long`);
    assert.match(m.facing.text, /^Tọa \S+ hướng \S+/);
  }
  assert.equal(EL.compassOf(0, 1).name, 'Nam'); assert.equal(EL.compassOf(0, 1).back, 'Khảm'); assert.equal(EL.compassOf(0, 1).trach, 'Đông tứ trạch');
});
check('vùng bài trí không đè nhau, không đè nhà / đình / mặt nước, nằm trong tường rào', () => {
  for (const m of [...P, V[0], V[100]]) {
    const L = m.layout, rect = (b, pad) => { const sw = Math.abs(Math.sin(b.ry || 0)) > 0.5, w = sw ? b.d : b.w, d = sw ? b.w : b.d; return { x0: b.x - w / 2 - pad, x1: b.x + w / 2 + pad, z0: b.z - d / 2 - pad, z1: b.z + d / 2 + pad }; };
    const ov = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.z0 < b.z1 && b.z0 < a.z1;
    const Z = m.zones;
    for (let i = 0; i < Z.length; i++) for (let j = i + 1; j < Z.length; j++) assert.ok(!ov(rect(Z[i], Z[i].kind === 'hall' ? 1 : 0), rect(Z[j], Z[j].kind === 'hall' ? 1 : 0)), `${m.name}: ${Z[i].name} đè ${Z[j].name}`);
    for (const z of Z) { const r = rect(z, 0); assert.ok(r.x0 > -m.W / 2 && r.x1 < m.W / 2 && r.z0 > -m.D / 2 && r.z1 < m.D / 2, `${m.name}: ${z.name} ra ngoài tường`); }
    for (const z of Z.filter((q) => q.kind === 'yard')) {
      for (const p of L.pavs) assert.ok(!ov(rect(z, 0), rect(p, 0.5)), `${m.name}: ${z.name} đè ${p.name}`);
      if (m.kind === 'phu') for (const w of L.water) assert.ok(!ov(rect(z, 0), { x0: w.x - w.w / 2, x1: w.x + w.w / 2, z0: w.z - w.d / 2, z1: w.z + w.d / 2 }), `${m.name}: ${z.name} đè mặt nước`);
    }
  }
});

// --- đi bộ: lưới 0,5 m trong khung cục bộ, từ ngoài cổng
function walkTest(m) {
  const S = 0.5, X0 = -m.W / 2 - 8, Z0 = -m.D / 2 - 8, W = Math.ceil((m.W + 16) / S), D = Math.ceil((m.D + 16) / S);
  const block = new Uint8Array(W * D);
  const { obbs } = MS.mansionSolids(m);
  for (const o of obbs) {
    const c = MS.toLocal(m, o.x, o.z), ry = o.ry - m.ry, cs = Math.cos(ry), sn = Math.sin(ry), R = Math.hypot(o.hw, o.hd);
    for (let i = Math.floor((c.x - R - X0) / S); i <= Math.ceil((c.x + R - X0) / S); i++) for (let j = Math.floor((c.z - R - Z0) / S); j <= Math.ceil((c.z + R - Z0) / S); j++) {
      if (i < 0 || j < 0 || i >= W || j >= D) continue;
      const px = X0 + (i + 0.5) * S - c.x, pz = Z0 + (j + 0.5) * S - c.z, lx = px * cs - pz * sn, lz = px * sn + pz * cs;
      if (Math.abs(lx) <= o.hw && Math.abs(lz) <= o.hd) block[j * W + i] = 1;
    }
  }
  const free = (i, j) => { for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= W || jj >= D || block[jj * W + ii]) return false; } return true; };
  const idx = (x, z) => [Math.floor((x - X0) / S), Math.floor((z - Z0) / S)];
  const flood = (x, z, extra = () => false) => {
    const seen = new Uint8Array(W * D), q = [], [si, sj] = idx(x, z); seen[sj * W + si] = 1; q.push(sj * W + si);
    while (q.length) {
      const k = q.pop(), i = k % W, j = (k / W) | 0;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ii = i + a, jj = j + b; if (ii < 1 || jj < 1 || ii >= W - 1 || jj >= D - 1) continue;
        const kk = jj * W + ii; if (seen[kk] || !free(ii, jj) || extra(X0 + (ii + 0.5) * S, Z0 + (jj + 0.5) * S)) continue;
        seen[kk] = 1; q.push(kk);
      }
    }
    return seen;
  };
  const gw = m.layout.gate.w / 2 + 0.5, hd = m.D / 2, main = m.layout.buildings[0];
  const shut = (x, z) => (Math.abs(x) < gw && z > hd - 2 && z < hd + 2) || (m.kind === 'phu' && Math.abs(x) < 2.2 && z < -hd + 2 && z > -hd - 2);
  const inner = flood(0, main.z + main.d / 2 + main.plinth + 2.2, shut);
  for (let k = 0; k < inner.length; k++) if (inner[k]) { const x = X0 + (k % W + 0.5) * S, z = Z0 + (((k / W) | 0) + 0.5) * S; assert.ok(Math.abs(x) < m.W / 2 + 0.6 && Math.abs(z) < m.D / 2 + 0.6, `${m.name}: lọt ra ngoài tường tại (${x.toFixed(1)}, ${z.toFixed(1)})`); }
  const seen = flood(0, hd + 4);
  const reach = (x, z, what) => { const [i, j] = idx(x, z); let ok = false; for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) if (seen[(j + b) * W + i + a]) ok = true; assert.ok(ok, `${m.name}: không tới ${what} (${x.toFixed(1)}, ${z.toFixed(1)})`); };
  for (const h of m.layout.buildings) reach(h.x, h.z, h.name);
  for (const z of m.zones.filter((q) => q.kind === 'yard')) reach(z.x, z.z, z.name);
  for (const w of MS.waterParts(m)) if (w.bridge) reach(w.x, w.z, 'giữa cầu');
}
check('đi bộ: mọi biệt phủ — từ cổng tới mọi nhà, sân, cầu; tường rào kín', () => { for (const m of P) walkTest(m); });
check('đi bộ: biệt thự mỗi khu (một căn) — từ cổng vào nhà, ra sân; tường rào kín', () => { for (let d = 0; d < 8; d++) walkTest(V[d * 30 + 7]); });

check('người trong phủ: gác cổng · quản gia · gia nhân theo trạng thái; không đứng / đi xuyên vật cản', () => {
  for (const m of P) {
    const sale = MS.mansionNpcs(m, { mode: 'sale' }), own = MS.mansionNpcs(m, { mode: 'own', owner: 'Lan' }), visit = MS.mansionNpcs(m, { mode: 'visit', owner: 'Lan' });
    assert.ok(sale.length >= 4 && sale.some((n) => /rao bán/.test(n.lines.join(' '))), `${m.name}: gác cổng rao bán`);
    assert.ok(own.length > sale.length, `${m.name}: phủ có chủ phải đông người hơn`);
    assert.ok(visit.some((n) => n.lines.some((l) => l.includes('Lan'))), `${m.name}: khách thăm nghe tên chủ`);
    const { obbs } = MS.mansionSolids(m);
    const hit = (x, z) => obbs.some((o) => { const c = Math.cos(o.ry), sn = Math.sin(o.ry), dx = x - o.x, dz = z - o.z, lx = dx * c - dz * sn, lz = dx * sn + dz * c; return Math.abs(lx) < o.hw + 0.3 && Math.abs(lz) < o.hd + 0.3; });
    for (const n of own) {
      const pts = n.path || [{ x: n.x, z: n.z }];
      for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[k + 1] || a; for (let t = 0; t <= 1; t += 0.02) { const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t; assert.ok(!hit(x, z), `${m.name}: ${n.role} vướng tại (${x.toFixed(1)}, ${z.toFixed(1)})`); } }
    }
  }
  assert.equal(MS.mansionNpcs(V[0], { mode: 'sale' }).length, 0);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
