// ============================================================================
//  TEST BỐ CỤC BÁT QUÁI THÀNH (thuần Node — chỉ batquai.js + court.js):
//   1) Hướng Hậu Thiên đúng: Ly Nam, Khảm Bắc, Chấn Đông, Đoài Tây, Càn Tây Bắc, Khôn Tây Nam,
//      Cấn Đông Bắc, Tốn Đông Nam; hào từng quẻ; Bát Môn khớp cung cố định Kỳ Môn.
//   2) Tường bát giác: khối chặn khít (không hở > 1 m giữa hai khối), chừa đúng 8 ô cổng.
//   3) Công trình / nhà / sân / ruộng / ao không đè nhau, không lấn đại lộ, đường vành,
//      Sơn Môn, nền Hậu Sơn, ô cổng, chân tường; nằm trong lòng thành.
//   4) NPC: chỗ đứng + lộ trình đi lại không xuyên vật cản nào ở trên.
//  Khung chiếm đất lấy từ batquai.js › foot (ước theo tỉ lệ model) — rasterize ô 0,5 m.
// ============================================================================
import assert from 'node:assert/strict';
import * as BQ from '../src/game/batquai.js';
import { COURT } from '../src/game/court.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const G = Object.fromEntries(BQ.GUA.map((g) => [g.id, g]));

// ---------------------------------------------------------------------------
// 1) Hậu Thiên Bát Quái
// ---------------------------------------------------------------------------
const EXPECT = { li: [0, 1, 'Cảnh Môn', [1, 0, 1]], kan: [0, -1, 'Hưu Môn', [0, 1, 0]], zhen: [1, 0, 'Thương Môn', [1, 0, 0]], dui: [-1, 0, 'Kinh Môn', [1, 1, 0]],
  qian: [-1, -1, 'Khai Môn', [1, 1, 1]], kun: [-1, 1, 'Tử Môn', [0, 0, 0]], gen: [1, -1, 'Sinh Môn', [0, 0, 1]], xun: [1, 1, 'Đỗ Môn', [0, 1, 1]] };
for (const [id, [sx, sz, gate, lines]] of Object.entries(EXPECT)) {
  check(`Hậu Thiên: ${G[id].name} đúng hướng, hào, ${gate}`, () => {
    assert.equal(Math.sign(G[id].dir[0]), sx); assert.equal(Math.sign(G[id].dir[1]), sz);
    assert.equal(G[id].gate, gate); assert.deepEqual(G[id].lines, lines);
  });
}
check('khung cục bộ: toWorld ↔ toLocal khớp, trục dài đơn vị', () => {
  for (const g of BQ.GUA) {
    assert.ok(Math.abs(Math.hypot(...g.dir) - 1) < 1e-9);
    const w = BQ.toWorld(g, 117, -23), l = BQ.toLocal(g, w.x, w.z);
    assert.ok(Math.abs(l.u - 117) < 1e-9 && Math.abs(l.v + 23) < 1e-9);
  }
});

// ---------------------------------------------------------------------------
// 2) Tường bát giác
// ---------------------------------------------------------------------------
const blocks = BQ.octWallBlocks();
const hitWall = (x, z) => blocks.some((b) => (x - b.x) ** 2 + (z - b.z) ** 2 < b.r * b.r);
function march(x0, z0, x1, z1, hit, step = 0.1) {
  const d = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(d / step));
  for (let k = 0; k <= n; k++) { const t = k / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t; if (hit(x, z)) return { x, z }; }
  return null;
}
for (const g of BQ.GUA) {
  const L = BQ.OCT_A * BQ.TAN8, h = BQ.gateHalf(g);
  check(`tường cung ${g.name}: đi xuyên mặt tường (ngoài ô cổng) bị chặn ở mọi chỗ`, () => {
    for (let v = -L + 0.5; v <= L - 0.5; v += 1.7) {
      if (Math.abs(v) < h + 1) continue;
      const a = BQ.toWorld(g, BQ.OCT_A - 8, v), b = BQ.toWorld(g, BQ.OCT_A + 8, v);
      assert.ok(march(a.x, a.z, b.x, b.z, hitWall), `XUYÊN tường tại v=${v.toFixed(1)}`);
    }
  });
  check(`cổng ${g.gate}: hành lang giữa (|v| ≤ 5) không bị khối tường chặn`, () => {
    const a = BQ.toWorld(g, BQ.OCT_A - 10, 0), b = BQ.toWorld(g, BQ.OCT_A + 10, 0);
    assert.equal(march(a.x, a.z, b.x, b.z, hitWall), null);
  });
}
check('góc đỉnh tường: đi chéo qua đỉnh bị chặn', () => {
  for (const p of BQ.octVertices()) {
    const n = Math.hypot(p.x, p.z);
    assert.ok(march(p.x * (1 - 10 / n), p.z * (1 - 10 / n), p.x * (1 + 10 / n), p.z * (1 + 10 / n), hitWall), `xuyên đỉnh (${p.x.toFixed(0)}, ${p.z.toFixed(0)})`);
  }
});

// ---------------------------------------------------------------------------
// 3) Bố cục khu — rasterize mọi khung chiếm đất ra ô 0,5 m
// ---------------------------------------------------------------------------
const C = 0.5, key = (x, z) => `${Math.floor(x / C)},${Math.floor(z / C)}`;
const owner = new Map(); // ô → tên vật
const shapes = [];
function rect(g, u, v, fu, fv, name) { shapes.push({ name, g, kind: 'rect', u, v, fu, fv }); }
function circle(x, z, r, name) { shapes.push({ name, kind: 'circle', x, z, r }); }
function cellsOf(s, fn) {
  if (s.kind === 'circle') { for (let x = s.x - s.r; x <= s.x + s.r; x += C / 2) for (let z = s.z - s.r; z <= s.z + s.r; z += C / 2) if ((x - s.x) ** 2 + (z - s.z) ** 2 <= s.r * s.r) fn(x, z); return; }
  for (let a = -s.fu / 2; a <= s.fu / 2; a += C / 2) for (let b = -s.fv / 2; b <= s.fv / 2; b += C / 2) { const w = BQ.toWorld(s.g, s.u + a, s.v + b); fn(w.x, w.z); }
}
for (const g of BQ.GUA) {
  const D = BQ.DISTRICTS[g.id];
  for (const b of D.buildings) {
    rect(g, b.u, b.v, b.foot[0], b.foot[1], `${g.name}·${b.name || b.model[0]}`);
    if (b.over) shapes[shapes.length - 1].over = `${g.name}·${b.over}`; // thủy tạ dựng trên mặt ao
    const bs = BQ.boardSpot(b);
    if (bs) { const w = BQ.toWorld(g, bs.u, bs.v); circle(w.x, w.z, 0.7, `${g.name}·biển ${b.name}`); }
  }
  for (const [u, v] of D.houses) rect(g, u, v, BQ.HOUSE_S, BQ.HOUSE_S / 1.49, `${g.name}·nhà (${u},${v})`);
  for (const f of D.fields || []) rect(g, f.u, f.v, f.w, f.d, `${g.name}·ruộng`);
  if (D.pond) rect(g, D.pond.u, D.pond.v, D.pond.w, D.pond.d, `${g.name}·ao`);
  if (D.yard) rect(g, D.yard.u, D.yard.v, D.yard.w, D.yard.d, `${g.name}·sân võ`);
  if (D.arena) { const w = BQ.toWorld(g, D.arena.u, D.arena.v); circle(w.x, w.z, D.arena.r, `${g.name}·lôi đài`); }
  for (const [u, v, r] of D.rocks || []) { const w = BQ.toWorld(g, u, v); circle(w.x, w.z, r / 2, `${g.name}·đá`); }
  for (const [u, v] of D.trees) { const w = BQ.toWorld(g, u, v); circle(w.x, w.z, 1.5, `${g.name}·cây`); }
  if (D.well) circle(D.well.x, D.well.z, 1.4, `${g.name}·giếng`);
  { const s2 = D.stele || BQ.toWorld(g, BQ.STELE.u, BQ.STELE.v); circle(s2.x, s2.z, 1, `${g.name}·bia`); }
  if (g.id !== 'kan') for (const sv of [-1, 1]) { const w = BQ.toWorld(g, BQ.lionU(g), sv * BQ.LION.v); circle(w.x, w.z, 1.5, `${g.name}·sư tử đá`); }
  if (g.id !== 'li' && g.id !== 'kan') {
    for (const u of BQ.POST_U) for (const sv of [-1, 1]) { const w = BQ.toWorld(g, u, sv * BQ.POST_V); circle(w.x, w.z, 0.3, `${g.name}·đèn`); }
  }
}
// nhà chen Nội Thành (innerfill.js) — phải không đè gì ở trên
const { innerHouses } = await import('../src/game/innerfill.js');
const INNER = innerHouses();
for (const h of INNER) shapes.push({ name: `${G[h.g].name}·nhà chen (${h.u.toFixed(0)},${h.v.toFixed(0)})`, kind: 'rect', g: G[h.g], u: h.u, v: h.v, fu: h.lu, fv: h.lv });
check(`nhà chen Nội Thành: ≥ 120 nhà (hiện ${INNER.length})`, () => assert.ok(INNER.length >= 120));
// phố chợ Ly sẵn có (landmarks.js): quầy x ±10,5 (z 80/102/124 trái, 91/113/135 phải), đèn x ±6,5 z 74…146
for (let z = 80; z <= 132; z += 22) for (const sx of [-1, 1]) shapes.push({ name: 'Ly·quầy chợ', kind: 'rect', g: G.li, u: z + (sx > 0 ? 11 : 0), v: -sx * 10.5, fu: 5.5, fv: 4.7 });
for (let z = 74; z <= 138; z += 12) for (const sx of [-1, 1]) circle(sx * 6.5, z, 0.3, 'Ly·đèn'); // landmarks: đèn tới z 134 (trước cổng)

check('mọi vật trong lòng thành, cách chân tường ≥ 3 m', () => {
  for (const s of shapes) cellsOf(s, (x, z) => assert.ok(BQ.insideOct(x, z, BQ.OCT_A - BQ.WALL_T / 2 - 0.5), `${s.name} lấn tường (${x.toFixed(1)}, ${z.toFixed(1)})`));
});
check('không vật nào đè lên vật khác', () => {
  for (const s of shapes) {
    const mine = new Set();
    cellsOf(s, (x, z) => mine.add(key(x, z)));
    for (const k of mine) { const o = owner.get(k); assert.ok(!o || o === s || s.over === o.name || o.over === s.name, `${s.name} đè ${o?.name} tại ô ${k}`); owner.set(k, s); }
  }
});
const inCourtBox = (x, z) => Math.abs(x) < COURT.x1 + COURT.wall + 0.5 && Math.abs(z) < COURT.z1 + COURT.wall + 0.5;
const inTerrace = (x, z) => Math.abs(x) < 46 && z < -79 && z > -153;
const distSeg = (x, z, [ax, az], [bx, bz]) => { const vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(x - ax - vx * t, z - az - vz * t); };
const ring = BQ.ringRoad();
const onRing = (x, z) => ring.some((p, i) => i > 0 && distSeg(x, z, ring[i - 1], p) < BQ.RING_W / 2);
const aveW = (g) => (g.id === 'li' ? 9 : g.dir[0] && !g.dir[1] ? 8 : BQ.AVE_W);
const onAvenue = (x, z) => BQ.GUA.some((g) => { if (g.id === 'kan') return false; const l = BQ.toLocal(g, x, z); return l.u > 60 && l.u < BQ.OCT_A && Math.abs(l.v) < aveW(g) / 2; });
const inGate = (x, z) => BQ.GUA.some((g) => { const l = BQ.toLocal(g, x, z), w = BQ.gateWidth(g), dep = w / 2.13; return l.u > BQ.OCT_A - dep / 2 - 1 && Math.abs(l.v) < w / 2 + 1; });
const bad = (x, z) => (inCourtBox(x, z) && 'Sơn Môn') || (inTerrace(x, z) && 'nền Hậu Sơn') || (inGate(x, z) && 'ô cổng') || null;
check('không vật nào lấn Sơn Môn, nền Hậu Sơn, ô cổng', () => {
  for (const s of shapes) cellsOf(s, (x, z) => { const b = bad(x, z); assert.ok(!b, `${s.name} lấn ${b} (${x.toFixed(1)}, ${z.toFixed(1)})`); });
});
check('không công trình nào lấn đại lộ / đường vành (đèn, bia, quầy chợ được phép ở mép)', () => {
  for (const s of shapes) {
    if (/đèn|bia|quầy|biển/.test(s.name)) continue;
    cellsOf(s, (x, z) => { assert.ok(!onAvenue(x, z), `${s.name} lấn đại lộ (${x.toFixed(1)}, ${z.toFixed(1)})`); assert.ok(!onRing(x, z), `${s.name} lấn đường vành (${x.toFixed(1)}, ${z.toFixed(1)})`); });
  }
});
check('đường vành không xuyên Sơn Môn / nền Hậu Sơn, khép kín, trong lòng thành', () => {
  assert.deepEqual(ring[0], ring[ring.length - 1]);
  for (let i = 1; i < ring.length; i++) {
    const [ax, az] = ring[i - 1], [bx, bz] = ring[i];
    for (let t = 0; t <= 1; t += 0.01) {
      const x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      for (const [ox, oz] of [[0, 0], [3, 0], [-3, 0], [0, 3], [0, -3]]) {
        assert.ok(!inCourtBox(x + ox, z + oz), `vành xuyên Sơn Môn (${x.toFixed(1)}, ${z.toFixed(1)})`);
        assert.ok(!inTerrace(x + ox, z + oz), `vành xuyên nền Hậu Sơn (${x.toFixed(1)}, ${z.toFixed(1)})`);
      }
      assert.ok(BQ.insideOct(x, z, BQ.OCT_A - 10));
    }
  }
});

// ---------------------------------------------------------------------------
// 4) NPC
// ---------------------------------------------------------------------------
const cits = BQ.citizenList();
const blockedNpc = (x, z) => { for (const [ox, oz] of [[0, 0], [0.35, 0], [-0.35, 0], [0, 0.35], [0, -0.35]]) { const o = owner.get(key(x + ox, z + oz)); if (o && !/sân võ/.test(o.name)) return o.name; } /* sân võ: nền cát đi được */ return bad(x, z); };
check(`đủ NPC: ≥ 30 người, khu nào cũng có (hiện ${cits.length})`, () => {
  assert.ok(cits.length >= 30);
  for (const g of BQ.GUA) assert.ok(cits.some((c) => c.gua === g.id), `cung ${g.name} không có NPC`);
  assert.equal(new Set(cits.map((c) => c.id)).size, cits.length, 'trùng id');
});
for (const c of cits) {
  check(`NPC ${c.name}: ${c.path ? 'lộ trình' : 'chỗ đứng'} không vướng vật cản`, () => {
    const pts = c.path || [{ x: c.x, z: c.z }];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
      const hit = march(a.x, a.z, b.x, b.z, (x, z) => !!blockedNpc(x, z), 0.25);
      assert.equal(hit, null, hit ? `vướng ${blockedNpc(hit.x, hit.z)} tại (${hit.x.toFixed(1)}, ${hit.z.toFixed(1)})` : '');
      assert.ok(BQ.insideOct(a.x, a.z, BQ.OCT_A - 4));
    }
    assert.ok(c.lines.length >= 1);
  });
}
check('NPC không đứng chồng nhau (cách ≥ 1,5 m)', () => {
  const st = cits.filter((c) => !c.path);
  for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) assert.ok(Math.hypot(st[i].x - st[j].x, st[i].z - st[j].z) >= 1.5, `${st[i].name} ↔ ${st[j].name}`);
});

check('cửa nhà chen Nội Thành trống (không trong vật nào), ngoài Sơn Môn', () => {
  for (const h of INNER) { const o = owner.get(key(h.door.x, h.door.z)); assert.ok(!o, `cửa ${h.id}@(${h.x.toFixed(0)},${h.z.toFixed(0)}) kẹt trong ${o?.name}`); assert.ok(!inCourtBox(h.door.x, h.door.z)); }
});
check('NPC nội thành không vướng nhà chen', () => {
  for (const c of cits) for (const p of c.path || [{ x: c.x, z: c.z }]) { const o = owner.get(key(p.x, p.z)); assert.ok(!o || !/nhà chen/.test(o.name), `${c.name} vướng ${o?.name}`); }
});
console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
