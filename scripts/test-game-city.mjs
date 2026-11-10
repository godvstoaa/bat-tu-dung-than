// ============================================================================
//  TEST NGOẠI THÀNH BÁT QUÁI (thuần Node — cityblocks.js + batquai.js + terrain.js):
//   1) Quy mô: tường ngoài trung đoạn 420 (≥ ×7 diện tích Nội Thành), ≥ 1.700 nhà phố.
//   2) Nhà không đè nhau, không đè đường (đại lộ, vành phố, ngõ, phố ranh), không lấn ô cổng /
//      tường / Nội Thành / Am Vân Cốc / lô đặc biệt; nằm trong lòng Ngoại Thành.
//   3) Đi được: loang trên lưới 1 m từ cổng Nội Thành tới cả 8 cổng ngoài; mặt tiền mọi nhà
//      thông ra mạng đường (không nhà nào quay mặt vào ngõ cụt kín).
//   4) Địa hình phẳng trong thành, sông nằm ngoài tường.
//   5) Lộ trình / chỗ đứng dân phố không vướng nhà.
// ============================================================================
import assert from 'node:assert/strict';
import * as BQ from '../src/game/batquai.js';
import * as CB from '../src/game/cityblocks.js';
import * as T from '../src/game/terrain.js';
import * as CN from '../src/game/canals.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const C = CB.generateCity();

// 1) Quy mô
check(`diện tích Ngoại Thành ≥ 7 lần Nội Thành (${((CB.OUTER_A / BQ.OCT_A) ** 2).toFixed(2)}×)`, () => assert.ok((CB.OUTER_A / BQ.OCT_A) ** 2 >= 7));
check(`≥ 2.000 nhà phố (hiện ${C.houses.length})`, () => assert.ok(C.houses.length >= 2000));
check('cung nào cũng ≥ 180 nhà, có công trình mốc + lô chủ đề', () => {
  for (const g of BQ.GUA) {
    assert.ok(C.houses.filter((h) => h.g === g.id).length >= 180, g.name);
    assert.ok(C.landmarks.some((l) => l.g === g.id) && C.themes.some((t) => t.g === g.id), g.name);
  }
});
check('mọi model nhà có spec (wd, f, hd)', () => { for (const h of C.houses) assert.ok(CB.HOUSE_SPECS[h.id], h.id); });

// 2) Đè nhau / đè đường — OBB
const corners = (h) => { const c = Math.cos(h.ry), s = Math.sin(h.ry); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [h.x + c * a * h.hw + s * b * h.hd, h.z - s * a * h.hw + c * b * h.hd]); };
const axes = (h) => { const c = Math.cos(h.ry), s = Math.sin(h.ry); return [[c, -s], [s, c]]; };
function overlap(a, b, pad = 0.05) {
  const ca = corners(a), cb = corners(b);
  for (const [ax, az] of [...axes(a), ...axes(b)]) {
    const pa = ca.map(([x, z]) => x * ax + z * az), pb = cb.map(([x, z]) => x * ax + z * az);
    if (Math.max(...pa) - pad < Math.min(...pb) || Math.max(...pb) - pad < Math.min(...pa)) return false;
  }
  return true;
}
check('không nhà nào đè nhà khác (SAT, lưới băm 24 m)', () => {
  const grid = new Map(), K = (x, z) => `${Math.floor(x / 24)},${Math.floor(z / 24)}`;
  C.houses.forEach((h, i) => { const k = K(h.x, h.z); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
  let bad = 0, ex = '';
  C.houses.forEach((h, i) => {
    const gx = Math.floor(h.x / 24), gz = Math.floor(h.z / 24);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const j of grid.get(`${gx + a},${gz + b}`) || []) if (j > i && overlap(h, C.houses[j])) { bad++; ex ||= `${h.id}@(${h.x.toFixed(0)},${h.z.toFixed(0)}) ↔ ${C.houses[j].id}`; }
  });
  assert.equal(bad, 0, `${bad} cặp đè, vd ${ex}`);
});
const WALLS = C.walls.map((w) => ({ ...w, hw: w.len / 2, hd: CB.WALL_T / 2 }));
check(`tường rào nối mặt phố (${WALLS.length} khúc, ${WALLS.reduce((a, w) => a + w.len, 0).toFixed(0)} m) không đè nhà`, () => {
  const grid = new Map(), K = (x, z) => `${Math.floor(x / 24)},${Math.floor(z / 24)}`;
  C.houses.forEach((h) => { const k = K(h.x, h.z); (grid.get(k) || grid.set(k, []).get(k)).push(h); });
  let bad = 0, ex = '';
  for (const w of WALLS) { const gx = Math.floor(w.x / 24), gz = Math.floor(w.z / 24); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const h of grid.get(`${gx + a},${gz + b}`) || []) if (overlap(w, h, 0.02)) { bad++; ex ||= `(${w.x.toFixed(1)},${w.z.toFixed(1)}) ↔ ${h.id}`; } }
  assert.equal(bad, 0, `${bad} khúc tường đè nhà, vd ${ex}`);
});
const ROADS = CB.cityRoads();
const distSeg = (x, z, [ax, az], [bx, bz]) => { const vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(x - ax - vx * t, z - az - vz * t); };
function onRoad(x, z) { for (const r of ROADS) for (let i = 1; i < r.pts.length; i++) if (distSeg(x, z, r.pts[i - 1], r.pts[i]) < r.w / 2) return r.kind; return null; }
// lấy mẫu dày trong OBB nhà (co vào 0,2 m)
function samples(h, step = 1.2) {
  const out = [], c = Math.cos(h.ry), s = Math.sin(h.ry);
  for (let a = -h.hw + 0.2; a <= h.hw - 0.2; a += step) for (let b = -h.hd + 0.2; b <= h.hd - 0.2; b += step) out.push([h.x + c * a + s * b, h.z - s * a + c * b]);
  for (const p of corners({ ...h, hw: h.hw - 0.2, hd: h.hd - 0.2 })) out.push(p);
  return out;
}
check('không nhà / tường rào nào đè đường (đại lộ, vành, ngõ, phố ranh)', () => {
  let bad = 0, ex = '';
  for (const h of [...C.houses, ...WALLS]) for (const [x, z] of samples(h)) { const k = onRoad(x, z); if (k) { bad++; ex ||= `${h.id}@(${x.toFixed(1)},${z.toFixed(1)}) đè ${k}`; break; } }
  assert.equal(bad, 0, `${bad} nhà đè đường, vd ${ex}`);
});
const octMax = (x, z) => Math.max(...BQ.GUA.map((g) => x * g.dir[0] + z * g.dir[1]));
check('nhà nằm giữa Nội Thành (+10 m) và tường ngoài (−6 m), ngoài Am Vân Cốc', () => {
  for (const h of C.houses) for (const [x, z] of corners(h)) {
    const o = octMax(x, z);
    assert.ok(o > BQ.OCT_A + 10 && o < CB.OUTER_A - 6, `${h.id} lấn tường (${x.toFixed(0)}, ${z.toFixed(0)}) o=${o.toFixed(1)}`);
    for (const k of CB.KEEP_OUT) assert.ok(!(x > k.x0 && x < k.x1 && z > k.z0 && z < k.z1), `${h.id} lấn Am Vân Cốc`);
  }
});
check('nhà không lấn ô cổng Nội / Ngoại Thành', () => {
  for (const h of C.houses) for (const [x, z] of corners(h)) for (const g of BQ.GUA) {
    const l = BQ.toLocal(g, x, z), wi = BQ.gateWidth(g);
    assert.ok(!(l.u > CB.OUTER_A - CB.OUTER_GATE_D / 2 - 1 && Math.abs(l.v) < CB.OUTER_GATE_W / 2 + 1), `${h.id} lấn cổng ngoài ${g.gate}`);
    assert.ok(!(l.u > BQ.OCT_A - 5 && l.u < BQ.OCT_A + wi / 4 + 1 && Math.abs(l.v) < wi / 2 + 1), `${h.id} lấn cổng nội ${g.gate}`);
  }
});
check('lô công trình mốc / chủ đề không có nhà', () => {
  for (const r of [...C.landmarks, ...C.themes]) {
    const g = BQ.guaById(r.g);
    for (const h of C.houses.filter((q) => q.g === r.g)) assert.ok(!(h.u > r.u0 + 0.5 && h.u < r.u1 - 0.5 && h.v > r.v0 + 0.5 && h.v < r.v1 - 0.5), `nhà trong lô ${r.name}`);
    void g;
  }
});

// 3) Loang trên lưới 1 m
const S = 1, N = Math.ceil((CB.OUTER_A + 20) * 2 / S), O = N / 2;
const blocked = new Uint8Array(N * N);
const idx = (x, z) => { const i = Math.floor(x / S + O), j = Math.floor(z / S + O); return i < 0 || j < 0 || i >= N || j >= N ? -1 : j * N + i; };
const mark = (x, z) => { const k = idx(x, z); if (k >= 0) blocked[k] = 1; };
for (const h of [...C.houses, ...WALLS]) for (const [x, z] of samples(h, 0.5)) mark(x, z);
for (const r of [...C.landmarks, ...C.themes]) { const g = BQ.guaById(r.g); for (let u = r.u0; u <= r.u1; u += 0.5) for (let v = r.v0; v <= r.v1; v += 0.5) { const w = BQ.toWorld(g, u, v); mark(w.x, w.z); } }
for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = (i + 0.5 - O) * S, z = (j + 0.5 - O) * S, o = octMax(x, z); if (o > CB.OUTER_A - 3.5 || o < BQ.OCT_A + 3) blocked[j * N + i] = 1; }
// tường ngoài có 8 ô cổng: mở hành lang |v| < 5 qua tường
for (const g of BQ.GUA) for (let u = CB.OUTER_A - 6; u <= CB.OUTER_A + 6; u += 0.5) for (let v = -5; v <= 5; v += 0.5) { const w = BQ.toWorld(g, u, v), k = idx(w.x, w.z); if (k >= 0) blocked[k] = 0; }
const seen = new Uint8Array(N * N), q = [];
for (const g of BQ.GUA) { const w = BQ.toWorld(g, BQ.OCT_A + 12, 0), k = idx(w.x, w.z); if (!blocked[k]) { seen[k] = 1; q.push(k); } }
while (q.length) { const k = q.pop(), i = k % N, j = (k / N) | 0; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const kk = jj * N + ii; if (!blocked[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
check('từ cổng Nội Thành đi tới được cả 8 cổng ngoài', () => {
  for (const g of BQ.GUA) { const w = BQ.toWorld(g, CB.OUTER_A + 4, 0); assert.ok(seen[idx(w.x, w.z)], `không tới ${g.gate} ngoài`); }
});
check('cửa mọi nhà (trừ nhà sân trong) trống và thông ra mạng đường', () => {
  let bad = 0, ex = '';
  for (const h of C.houses) { if (!h.door) { assert.ok(h.inner); continue; } if (!seen[idx(h.door.x, h.door.z)]) { bad++; ex ||= `${h.id}@(${h.x.toFixed(0)},${h.z.toFixed(0)})`; } }
  assert.ok(bad <= C.houses.length * 0.01, `${bad} cửa bị kẹt, vd ${ex}`);
});
check('mặt tiền mọi nhà thông ra mạng đường', () => {
  let bad = 0, ex = '';
  for (const h of C.houses) {
    const fx = Math.sin(h.ry), fz = Math.cos(h.ry), x = h.x + fx * (h.hd + 1.6), z = h.z + fz * (h.hd + 1.6);
    if (!seen[idx(x, z)]) { bad++; ex ||= `${h.id}@(${h.x.toFixed(0)},${h.z.toFixed(0)})`; }
  }
  assert.ok(bad <= C.houses.length * 0.01, `${bad} nhà quay mặt vào chỗ kín, vd ${ex}`);
});

// 4) Địa hình
check('địa hình phẳng (|h| < 0,5 m) trong Ngoại Thành (trừ lòng kênh)', () => {
  for (let x = -680; x <= 680; x += 9) for (let z = -680; z <= 680; z += 9) if (T.cityOctDist(x, z) < 10 && !CN.inCanal(x, z, 0.5)) assert.ok(Math.abs(T.heightAt(x, z)) < 0.5, `h=${T.heightAt(x, z).toFixed(2)} tại (${x}, ${z})`);
});
check('sông Huyền Hà nằm ngoài tường ≥ 60 m', () => {
  for (let i = 1; i < T.RIVER.length; i++) { const [ax, az] = T.RIVER[i - 1], [bx, bz] = T.RIVER[i]; for (let t = 0; t <= 1; t += 0.02) assert.ok(T.cityOctDist(ax + (bx - ax) * t, az + (bz - az) * t) > 60); }
});

// 5) Dân phố
const houseGrid = new Map();
C.houses.forEach((h) => { const k = `${Math.floor(h.x / 24)},${Math.floor(h.z / 24)}`; (houseGrid.get(k) || houseGrid.set(k, []).get(k)).push(h); });
const inHouse = (x, z) => { const gx = Math.floor(x / 24), gz = Math.floor(z / 24); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const h of houseGrid.get(`${gx + a},${gz + b}`) || []) { const c = Math.cos(h.ry), s = Math.sin(h.ry), dx = x - h.x, dz = z - h.z; if (Math.abs(dx * c - dz * s) < h.hw + 0.4 && Math.abs(dx * s + dz * c) < h.hd + 0.4) return h; } return null; };
check(`dân phố (${C.walkers.length}) không đứng / đi xuyên nhà, trong thành`, () => {
  assert.ok(C.walkers.length >= 60);
  for (const n of C.walkers) {
    const pts = n.path || [{ x: n.x, z: n.z }];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
      for (let t = 0; t <= 1; t += 0.01) { const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t; const h = inHouse(x, z); assert.ok(!h, `${n.id} vướng ${h?.id} tại (${x.toFixed(0)}, ${z.toFixed(0)})`); assert.ok(octMax(x, z) < CB.OUTER_A - 3); }
    }
  }
});

check('thủy đạo Bát Môn: nạp ở Hưu Môn (Khảm), khẩu ở Đỗ Môn (Tốn), hào ôm Nội Thành; không nhà nào đè kênh; lòng kênh khắc thấp', () => {
  assert.deepEqual(CN.AVE_CANAL.gua, ['kan', 'xun']);
  assert.equal(BQ.guaById('kan').gate, 'Hưu Môn'); assert.equal(BQ.guaById('xun').gate, 'Đỗ Môn');
  assert.ok(CN.MOAT.a - CN.MOAT.w / 2 > BQ.OCT_A + 2.5, 'hào phải ngoài chân tường Nội Thành');
  for (const h of C.houses) {
    const c = Math.cos(h.ry), sn = Math.sin(h.ry);
    for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 0]]) { const x = h.x + c * a * h.hw + sn * b * h.hd, z = h.z - sn * a * h.hw + c * b * h.hd; assert.ok(!CN.inCanal(x, z), `nhà ${h.id} đè kênh tại (${x.toFixed(0)}, ${z.toFixed(0)})`); }
  }
  // thuyền lớn vào được (2026-11-10): hào ≥ 24 m, kênh giữa đại lộ ≥ 20 m, sâu ≥ 3 m dưới mặt nước; đường hai bờ khô
  assert.ok(CN.MOAT.w >= 24 && CN.AVE_CANAL.v1 - CN.AVE_CANAL.v0 >= 20, 'hào / kênh đủ rộng cho thuyền lớn');
  assert.ok(CN.CANAL_WATER - CN.CANAL_BED >= 3, 'kênh đủ sâu');
  assert.ok(T.heightAt(0, -CN.MOAT.a) < -3 && T.heightAt(0, -300) < -3 && T.heightAt(15, -300) > -0.5 && T.heightAt(-15, -300) > -0.5);
  const P = CN.flowPath(); assert.ok(P.length > 60 && P[0].z < -600 && P[P.length - 1].x > 400 && P[P.length - 1].z > 400, 'dòng chảy Bắc → Đông Nam');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
