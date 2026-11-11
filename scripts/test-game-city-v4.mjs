// ============================================================================
//  TEST BÁT QUÁI THÀNH v4 (src/game/citylayout.js + terrain.js v4 + waterways.js) — thuần Node, không 3D.
//    node scripts/test-game-city-v4.mjs
//  Kiểm: thế giới 8.192 m · ≥ 18.000 nhà không chồng lấn, không lấn đường / công trình · 100 % lô mặt đại lộ / vành /
//  quảng trường là cửa hàng có chức năng · phố chủ đề · mỗi khu đủ dịch vụ · sông không đè nhà · thành phẳng, kè đứng ·
//  3 thủy môn · 5 cầu (dốc ≤ 8 %, tĩnh không ~9 m) · đi bộ từ Nội Thành tới mọi cổng / khu / cầu / ga / cửa nhà ·
//  sinh lười theo ô tất định (thứ tự sinh khác nhau → cùng kết quả, kiểm bằng tiến trình con).
// ============================================================================
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as C from '../src/game/citylayout.js';
import * as T from '../src/game/terrain.js';
import * as WW from '../src/game/waterways.js';
import { SHOP_TYPES } from '../src/game/items.js';
import { GUA, toLocal } from '../src/game/batquai.js';
import { WORLD_TILES } from '../src/game/protocol.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  const t0 = performance.now();
  try { fn(); pass++; console.log(`  ✓ ${name} (${Math.round(performance.now() - t0)} ms)`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}\n      ${e.message.split('\n').slice(0, 4).join('\n      ')}`); }
};
const A = C.CITY.A;
const TYPES = Object.keys(SHOP_TYPES);

// --- sinh toàn bộ thành (theo thứ tự ô xuôi)
const t0 = performance.now();
const CELL_IDS = C.cityCells();
const HOUSES = CELL_IDS.flatMap((id) => C.cell(id).houses);
console.log(`  · ${HOUSES.length} nhà trong ${CELL_IDS.length} ô — sinh ${Math.round(performance.now() - t0)} ms`);
const fnv = (s, h = 2166136261) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
const fingerprint = (hs) => { let h = 2166136261; for (const x of hs) h = fnv(`${x.id}|${x.x}|${x.z}|${x.w}|${x.d}|${x.use}|${x.type || ''}|${x.street}`, h); return h; };

check('thế giới 8.192 m: WORLD / HALF / biển mây / dải phòng / biên giao thức', () => {
  assert.equal(T.WORLD, 8192); assert.equal(T.HALF, 4096);
  assert.ok(T.EDGE >= 3700 && T.EDGE <= 3900, `EDGE ${T.EDGE}`);
  assert.equal(T.ROOM_X0, T.HALF + 250);
  assert.ok(WORLD_TILES.minX * 1.6 <= -T.HALF + 16 && WORLD_TILES.maxY * 1.6 >= T.HALF, 'WORLD_TILES phủ ±HALF');
  assert.ok((WORLD_TILES.maxX - 10) * 1.6 >= T.ROOM_X1, 'WORLD_TILES phủ dải phòng');
  assert.equal(T.CITY_OCT, A); assert.equal(A, 2125);
});

check('vùng: núi tông môn ngoài tường 2.600–3.300 m (cảnh nền), hồ Cùng Thông trong thành khu Tốn', () => {
  for (const id of ['tubinh', 'trichthien', 'manh', 'thulau', 'phongthuy', 'lichduong']) {
    const g = T.REGIONS.find((r) => r.id === id), d = Math.hypot(g.x, g.z);
    assert.ok(d >= 2600 && d <= 3300, `${id} cách tâm ${Math.round(d)}`);
    assert.ok(T.cityOctDist(g.x, g.z) - g.r > 200, `${id} lấn tường`);
  }
  assert.ok(T.heightAt(T.REGIONS.find((r) => r.id === 'tubinh').x, T.REGIONS.find((r) => r.id === 'tubinh').z) > 300);
  const L = T.REGIONS.find((r) => r.id === 'cungthong');
  assert.equal(C.districtOf(L.x, L.z).id, 'ngoai-xun');
  assert.ok(T.cityOctDist(L.x, L.z) + L.r < -300, 'hồ nằm gọn trong thành');
  assert.ok(T.heightAt(L.x, L.z) < T.WATER - 5);
});

check(`≥ 18.000 nhà; id ổn định "ô:i" duy nhất, nằm đúng ô; houseAt / shopAt tra lại được`, () => {
  assert.ok(HOUSES.length >= 18000, `chỉ ${HOUSES.length}`);
  const ids = new Set();
  for (const h of HOUSES) {
    assert.ok(/^\d+_\d+:\d+$/.test(h.id), h.id); assert.ok(!ids.has(h.id), `trùng ${h.id}`); ids.add(h.id);
    assert.equal(C.cellIdAt(h.x, h.z), h.cell, `${h.id} ngoài ô`);
  }
  for (let i = 0; i < HOUSES.length; i += 997) { const h = HOUSES[i]; assert.equal(C.houseAt(h.id), h); assert.equal(C.shopAt(h.id), h.use === 'shop' ? h : null); }
  assert.equal(C.houseAt('99_99:0'), null);
});

check('sinh lười tất định: tiến trình con sinh ô theo thứ tự NGƯỢC → cùng dấu vân tay', () => {
  const mine = fingerprint(HOUSES);
  const url = pathToFileURL(fileURLToPath(new URL('../src/game/citylayout.js', import.meta.url))).href;
  const code = `const C = await import(${JSON.stringify(url)}); const fnv=(s,h=2166136261)=>{for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;};
    const ids = C.cityCells(); const by = new Map(); for (const id of [...ids].reverse()) by.set(id, C.cell(id).houses);
    let h=2166136261; for (const id of ids) for (const x of by.get(id)) h=fnv(x.id+'|'+x.x+'|'+x.z+'|'+x.w+'|'+x.d+'|'+x.use+'|'+(x.type||'')+'|'+x.street,h); console.log(h);`;
  const other = Number(execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8' }).trim());
  assert.equal(other, mine);
});

// --- lưới băm không gian cho kiểm chồng lấn
const OBB = (h) => ({ x: h.x, z: h.z, tx: h.tx, tz: h.tz, nx: h.nx, nz: h.nz, hw: h.w / 2, hd: h.d / 2 });
const corners = (o) => C.lotCorners(o);
function sat(a, b, tol = 0.05) {
  for (const [ax, az] of [[a.tx, a.tz], [a.nx, a.nz], [b.tx, b.tz], [b.nx, b.nz]]) {
    const ra = a.hw * Math.abs(a.tx * ax + a.tz * az) + a.hd * Math.abs(a.nx * ax + a.nz * az);
    const rb = b.hw * Math.abs(b.tx * ax + b.tz * az) + b.hd * Math.abs(b.nx * ax + b.nz * az);
    if (Math.abs((b.x - a.x) * ax + (b.z - a.z) * az) >= ra + rb - tol) return false;
  }
  return true;
}
const segDist = (p, a, b) => { const vx = b.x - a.x, vz = b.z - a.z, l = vx * vx + vz * vz || 1, t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.z - a.z) * vz) / l)); return Math.hypot(p.x - a.x - vx * t, p.z - a.z - vz * t); };

check('không nhà nào chồng lấn nhà khác (OBB, mọi ô phố)', () => {
  const G = new Map(), S = 40, key = (i, j) => i * 100000 + j;
  HOUSES.forEach((h, k) => { const i = Math.floor(h.x / S), j = Math.floor(h.z / S); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const q = key(i + a, j + b); let l = G.get(q); if (!l) G.set(q, (l = [])); l.push(k); } });
  let bad = 0; const ex = [];
  HOUSES.forEach((h, k) => {
    const o = OBB(h);
    for (const m of G.get(key(Math.floor(h.x / S), Math.floor(h.z / S)))) if (m > k && sat(o, OBB(HOUSES[m]))) { bad++; if (ex.length < 3) ex.push(`${h.id} × ${HOUSES[m].id}`); }
  });
  assert.equal(bad, 0, ex.join(', '));
});

check('nhà không lấn đường (mọi loại, trong ô), Sơn Môn, đền, sảnh; nằm trong tường', () => {
  let bad = 0; const ex = [];
  const halls = C.landmarks().filter((m) => m.kind === 'hall' || m.kind === 'port').map((m) => ({ x: m.x, z: m.z, tx: Math.cos(m.ry), tz: -Math.sin(m.ry), nx: Math.sin(m.ry), nz: Math.cos(m.ry), hw: m.w / 2, hd: m.d / 2 }));
  for (const id of CELL_IDS) {
    const c = C.cell(id);
    for (const h of c.houses) {
      const o = OBB(h), P = [...corners(o), { x: h.x, z: h.z }, ...corners(o).map((p, i, a) => ({ x: (p.x + a[(i + 1) % 4].x) / 2, z: (p.z + a[(i + 1) % 4].z) / 2 }))];
      for (const r of c.roads) for (const p of P) if (segDist(p, r.a, r.b) < r.w / 2 - 0.1) { bad++; if (ex.length < 4) ex.push(`${h.id} lấn ${r.id} (${(segDist(p, r.a, r.b)).toFixed(2)} < ${r.w / 2})`); break; }
      if (WW.octMax(h.x, h.z) < C.CITY.SONMON_A + 5 || WW.octMax(h.x, h.z) > A - 8) { bad++; ex.push(`${h.id} ngoài vùng xây`); }
      for (const H of halls) if (sat(o, H)) { bad++; ex.push(`${h.id} đè sảnh`); }
    }
  }
  const temples = C.landmarks().filter((m) => m.kind === 'temple');
  for (const t of temples) for (const id of C.cellsInRange(t.x, t.z, 60)) for (const h of C.cell(id).houses) {
    const inside = (p) => { let s = 0; for (let i = 0; i < 4; i++) { const a = t.poly[i], b = t.poly[(i + 1) % 4]; const cr = (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x); s += Math.sign(cr); } return Math.abs(s) === 4; };
    if (inside(h)) { bad++; ex.push(`${h.id} trong khuôn đền ${t.id}`); }
  }
  assert.equal(bad, 0, ex.join('\n'));
});

check('100 % lô mặt đại lộ / vành / quảng trường là cửa hàng có loại trong SHOP_TYPES; góc giao lộ là tửu lâu / trà lâu; ngõ là nhà ở', () => {
  let front = 0, bad = 0, corner = 0; const ex = [];
  for (const h of HOUSES) {
    if (C.FRONT_KINDS.has(h.front)) {
      front++;
      if (h.use !== 'shop' || !SHOP_TYPES[h.type]) { bad++; if (ex.length < 3) ex.push(`${h.id} ${h.front} → ${h.use}/${h.type}`); }
      if (h.corner && !h.special) { corner++; if (!['tuu', 'tralau'].includes(h.type)) { bad++; ex.push(`${h.id} góc → ${h.type}`); } }
    }
    if (h.front === 'alley' && h.use !== 'home') { bad++; ex.push(`${h.id} ngõ → ${h.use}`); }
    if (h.use === 'shop') assert.ok(SHOP_TYPES[h.type], h.id);
  }
  assert.equal(bad, 0, ex.join(', '));
  assert.ok(front >= 4000, `chỉ ${front} lô mặt tiền lớn`); assert.ok(corner >= 300, `chỉ ${corner} lô góc`);
  console.log(`      ${front} lô mặt tiền lớn (đều là tiệm), ${corner} lô góc tửu / trà lâu, tổng ${HOUSES.filter((h) => h.use === 'shop').length} tiệm`);
});

check('phố chủ đề: mỗi phố mặt tiền ≥ 6 tiệm thường → loại chủ đề chiếm ≥ 40 %; có tên phố', () => {
  const ST = C.streets(), by = new Map();
  for (const h of HOUSES) if (h.use === 'shop' && C.FRONT_KINDS.has(h.front) && !h.corner && !h.special) { let l = by.get(h.street); if (!l) by.set(h.street, (l = [])); l.push(h.type); }
  let n = 0;
  for (const [k, l] of by) {
    if (l.length < 6) continue; n++;
    const th = ST.get(k); assert.ok(th, `phố ${k} không chủ đề`); assert.ok(th.name.startsWith('Phố'), th.name);
    const share = l.filter((t) => t === th.theme).length / l.length;
    assert.ok(share >= 0.4, `${k} (${th.name}): chủ đề ${Math.round(share * 100)} %`);
  }
  assert.ok(n >= 150, `chỉ ${n} phố chủ đề`);
});

check('mỗi khu (8 Trung + 8 Ngoại) đủ mọi loại tiệm SHOP_TYPES, đúng 1 Dịch Trạm, 1 Nha Môn, 1 Tiền Trang, 1 miếu; Nội Thành: Sơn Môn, 4 đền, Phố Thầy Bói', () => {
  const D = new Map();
  for (const h of HOUSES) { let d = D.get(h.district); if (!d) D.set(h.district, (d = { types: {}, svc: 0, mieu: 0, boi: 0 })); if (h.type) d.types[h.type] = (d.types[h.type] || 0) + 1; if (h.use === 'service' && h.svc === 'tientrang') d.svc++; if (h.use === 'temple') d.mieu++; if (h.use === 'fortune') d.boi++; }
  for (const dist of C.districts()) {
    if (dist.id === 'noi') continue;
    const d = D.get(dist.id); assert.ok(d, dist.id);
    const miss = TYPES.filter((t) => !d.types[t]); assert.deepEqual(miss, [], `${dist.name} thiếu ${miss}`);
    assert.equal(d.types.dichtram, 1, `${dist.name}: Dịch Trạm ${d.types.dichtram}`); assert.equal(d.types.namon, 1, `${dist.name}: Nha Môn ${d.types.namon}`);
    assert.equal(d.svc, 1, `${dist.name}: Tiền Trang ${d.svc}`); assert.equal(d.mieu, 1, `${dist.name}: miếu ${d.mieu}`);
  }
  const N = D.get('noi'); assert.ok(N.boi >= 150, `Phố Thầy Bói chỉ ${N.boi} quán`);
  const L = C.landmarks(); assert.ok(L.find((m) => m.kind === 'sonmon')); assert.equal(L.filter((m) => m.kind === 'temple' && m.district === 'noi').length, 4);
  assert.equal(C.districts().length, 17);
});

check('khu Ngoại Thành: 8 khu quanh 8 công trình cũ ở 1.050–1.500 m; districtOf khớp tâm khu', () => {
  const want = { kan: 'thuvien', qian: 'cachcuc', gen: 'tuongphap', zhen: 'trach', xun: 'dieuhau', li: 'namoncang', kun: 'tuvi', dui: 'duongtrach' };
  for (const d of C.districts()) {
    assert.equal(C.districtOf(d.centre.x, d.centre.z).id, d.id, `${d.id} tâm lệch khu`);
    if (d.ring !== 'ngoai') continue;
    assert.equal(d.hall, want[d.gua]);
    const u = WW.octMax(d.centre.x, d.centre.z); assert.ok(u >= 1050 && u <= 1500, `${d.name} tâm u ${Math.round(u)}`);
  }
  assert.equal(C.districtOf(0, 3000).ring, 'outside'); assert.equal(C.districtOf(0, 0).id, 'noi');
});

check('sông / hồ không đè nhà (mọi điểm mép lô cách mặt nước ≥ 2 m)', () => {
  let bad = 0; const ex = [];
  for (const h of HOUSES) {
    const o = OBB(h), cs = corners(o);
    for (let i = 0; i < 4 && !ex.includes(h.id); i++) {
      const a = cs[i], b = cs[(i + 1) % 4], n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 2);
      for (let k = 0; k <= n; k++) { const x = a.x + (b.x - a.x) * k / n, z = a.z + (b.z - a.z) * k / n; if (WW.isWater(x, z, 2)) { bad++; ex.push(h.id); break; } }
    }
  }
  assert.equal(bad, 0, ex.slice(0, 5).join(', '));
});

check('mặt thành phẳng y 0 (ngoài sông / hồ); lòng sông ≤ −8; kè đá thẳng đứng (lệch 1 m: 0 → ≤ −8)', () => {
  let n = 0;
  for (let x = -A; x <= A; x += 23) for (let z = -A; z <= A; z += 23) {
    if (T.cityOctDist(x, z) > -10 || WW.isWater(x, z, 1.5)) continue;
    n++; const h = T.heightAt(x, z); assert.ok(Math.abs(h) < 0.01, `(${x}, ${z}) cao ${h.toFixed(2)}`);
  }
  assert.ok(n > 25000, `chỉ ${n} điểm mẫu`);
  for (const ch of WW.channels()) for (const p of ch.pts) {
    if (WW.octMax(p.x, p.z) > A - 30 || Math.hypot(p.x - WW.LAKE.x, p.z - WW.LAKE.z) < WW.LAKE.r + 70) continue;
    const nx = -p.tz, nz = p.tx;
    assert.ok(T.heightAt(p.x, p.z) <= -8, `${ch.id} s ${Math.round(p.s)} nông`);
    for (const sg of [1, -1]) {
      const r = WW.riverNear(p.x + nx * sg * p.w, p.z + nz * sg * p.w); if (!r || r.ch !== ch.id) continue; // chỗ hợp lưu
      const wIn = T.heightAt(p.x + nx * sg * (p.w - 0.5), p.z + nz * sg * (p.w - 0.5)), wOut = T.heightAt(p.x + nx * sg * (p.w + 0.5), p.z + nz * sg * (p.w + 0.5));
      assert.ok(wIn <= -8 && Math.abs(wOut) < 0.01, `${ch.id} s ${Math.round(p.s)}: kè ${wIn.toFixed(1)} → ${wOut.toFixed(1)}`);
    }
  }
});

check('Huyền Hà rộng 120 m trong thành, chảy qua 3 khu Nam (Khôn / Ly / Tốn) + hồ; 3 thủy môn trên tường', () => {
  const main = WW.channelPoints('main'), inside = main.filter((p) => WW.octMax(p.x, p.z) < A - 300);
  assert.ok(inside.length > 100);
  for (const p of inside) assert.ok(Math.abs(p.w - 60) < 0.5, `rộng ${(p.w * 2).toFixed(0)} m`);
  const ds = new Set(inside.map((p) => C.districtOf(p.x, p.z).id));
  for (const d of ['ngoai-kun', 'ngoai-li', 'ngoai-xun']) assert.ok(ds.has(d), `không qua ${d}`);
  assert.ok(main.some((p) => Math.hypot(p.x - WW.LAKE.x, p.z - WW.LAKE.z) < 20), 'không qua hồ');
  const wg = C.waterGates(); assert.equal(wg.length, 3);
  for (const g of wg) { assert.ok(Math.abs(WW.octMax(g.x, g.z) - A) < 1, `${g.id} không trên tường`); for (const gt of C.gates()) assert.ok(Math.hypot(g.x - gt.x, g.z - gt.z) > 150, `${g.id} sát cổng ${gt.id}`); }
  assert.equal(wg.filter((g) => g.inflow).length, 2);
});

check('5 cầu: 3 cầu đại lộ (Khôn / Ly / Tốn) + 2 cầu bộ; mặt cầu dốc ≤ 8 %, tĩnh không ~9 m, phủ hết mặt nước, hai đầu trên đường', () => {
  const B = C.bridges(); assert.equal(B.length, 5);
  assert.equal(B.filter((b) => b.kind === 'road').length, 3); assert.equal(B.filter((b) => b.kind === 'foot').length, 2);
  const R = C.roads();
  for (const b of B) {
    let g = 0; for (let t = -b.L; t < b.L; t += 0.5) g = Math.max(g, Math.abs(C.deckTop(b, t + 0.5) - C.deckTop(b, t)) / 0.5);
    assert.ok(g <= 0.08, `${b.id} dốc ${(g * 100).toFixed(1)} %`);
    for (let t = -b.L + 1; t < b.L; t += 1) {
      const x = b.x + b.ax * t, z = b.z + b.az * t;
      if (WW.isWater(x, z, 0)) assert.ok(C.deckTop(b, t) - b.thick - b.water >= 8.9, `${b.id} tĩnh không ở t ${t}`);
    }
    for (const sg of [-1, 1]) {
      const x = b.x + b.ax * sg * b.L, z = b.z + b.az * sg * b.L;
      assert.ok(!WW.isWater(x, z, 5), `${b.id} đầu cầu ngập`);
      assert.ok(R.some((r) => !r.bridge && segDist({ x, z }, r.a, r.b) < r.w / 2 && (b.kind === 'road' ? r.kind === 'avenue' : r.kind === 'lane' || r.kind === 'ring')), `${b.id} đầu ${sg} không trên đường`);
    }
    assert.ok(R.some((r) => r.bridge === b.id) || b.kind === 'foot', `${b.id} không có đoạn đường cầu`);
    const u = WW.octMax(b.x, b.z); assert.ok(Math.abs(u - WW.RIVER_ARC_U) < 5);
  }
  for (const g of ['kun', 'li', 'xun']) assert.ok(B.some((b) => b.kind === 'road' && b.gua === g), `đại lộ ${g} không có cầu`);
});

check('đường: 8 đại lộ 32 m tới cổng, vành 24 m ở 380 / 700 / 1.050 / 1.500 / 1.850, phố nhánh 12 m, ngõ 6 m', () => {
  const R = C.roads();
  for (const g of GUA) {
    const av = R.filter((r) => r.kind === 'avenue' && r.id.startsWith(`av:${g.id}`)); assert.ok(av.length >= 1);
    assert.ok(av.every((r) => r.w === 32));
    const far = Math.max(...av.flatMap((r) => [WW.octMax(r.a.x, r.a.z), WW.octMax(r.b.x, r.b.z)])); assert.ok(far >= A, `đại lộ ${g.id} không tới cổng`);
    let cov = 0; for (const r of av) cov += Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z); assert.ok(cov >= A - C.CITY.SONMON_A - 1, `đại lộ ${g.id} đứt (${Math.round(cov)})`);
  }
  for (const a of C.CITY.RINGS) assert.ok(R.filter((r) => r.kind === 'ring' && r.id.startsWith(`r${a}:`) && r.w === 24).length >= 8, `vành ${a}`);
  assert.ok(R.filter((r) => r.kind === 'alley').every((r) => r.w === 6)); assert.ok(R.filter((r) => ['street', 'lane', 'boundary'].includes(r.kind)).every((r) => r.w === 12));
  assert.ok(R.filter((r) => r.kind === 'alley').length > 300);
  const roadWet = R.filter((r) => !r.bridge && (WW.isWater(r.a.x, r.a.z, -1) || WW.isWater(r.b.x, r.b.z, -1) || WW.isWater((r.a.x + r.b.x) / 2, (r.a.z + r.b.z) / 2, -1)));
  assert.deepEqual(roadWet.map((r) => r.id).slice(0, 5), [], 'đường ngập nước');
});

// --- ĐI BỘ: lưới 2 m, chặn = nhà, đền, sảnh, Sơn Môn, nước (trừ mặt cầu), tường (trừ cổng)
const STEP = 2, EXT = A + 40, N = Math.ceil((2 * EXT) / STEP);
const idx = (x, z) => { const i = Math.floor((x + EXT) / STEP), j = Math.floor((z + EXT) / STEP); return i < 0 || j < 0 || i >= N || j >= N ? -1 : j * N + i; };
const cx = (i) => -EXT + (i + 0.5) * STEP;
let REACH = null;
check('lưới đi bộ: dựng mặt nạ chặn + loang từ quảng trường Nội Thành', () => {
  const block = new Uint8Array(N * N);
  // tường + ngoài thành (chừa ô cổng)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = cx(i), z = cx(j), u = WW.octMax(x, z);
    if (u < A - 4) continue;
    let gate = false; for (const g of GUA) { const l = toLocal(g, x, z); if (l.u >= A - 6 && l.u <= A + 30 && Math.abs(l.v) <= C.CITY.GATE_W / 2) gate = true; }
    if (!gate) block[j * N + i] = 1;
  }
  // nước: dập đĩa dọc tim kênh + hồ
  const disk = (px, pz, r) => { const i0 = Math.floor((px - r + EXT) / STEP), i1 = Math.floor((px + r + EXT) / STEP), j0 = Math.floor((pz - r + EXT) / STEP), j1 = Math.floor((pz + r + EXT) / STEP); for (let j = Math.max(0, j0); j <= Math.min(N - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(N - 1, i1); i++) if (Math.hypot(cx(i) - px, cx(j) - pz) <= r) block[j * N + i] = 1; };
  for (const ch of WW.channels()) for (const p of ch.pts) if (Math.abs(p.x) < EXT && Math.abs(p.z) < EXT) disk(p.x, p.z, p.w);
  disk(WW.LAKE.x, WW.LAKE.z, WW.LAKE.r);
  // mặt cầu đi được
  for (const b of C.bridges()) for (let t = -b.L; t <= b.L; t += 1) for (let n = -b.W / 2 + 0.5; n <= b.W / 2 - 0.5; n += 1) { const k = idx(b.x + b.ax * t - b.az * n, b.z + b.az * t + b.ax * n); if (k >= 0) block[k] = 0; }
  // nhà / công trình (OBB)
  const stamp = (o) => {
    const R = Math.hypot(o.hw, o.hd), i0 = Math.floor((o.x - R + EXT) / STEP), i1 = Math.floor((o.x + R + EXT) / STEP), j0 = Math.floor((o.z - R + EXT) / STEP), j1 = Math.floor((o.z + R + EXT) / STEP);
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const dx = cx(i) - o.x, dz = cx(j) - o.z; if (Math.abs(dx * o.tx + dz * o.tz) <= o.hw && Math.abs(dx * o.nx + dz * o.nz) <= o.hd) block[j * N + i] = 1; }
  };
  for (const h of HOUSES) stamp(OBB(h));
  for (const m of C.landmarks()) {
    if (m.kind === 'sonmon') { for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (WW.octMax(cx(i), cx(j)) <= m.apothem) block[j * N + i] = 1; continue; }
    if (m.kind === 'temple') { const P = m.poly, c = { x: m.x, z: m.z }; const sh = P.map((p) => ({ x: c.x + (p.x - c.x) * 0.92, z: c.z + (p.z - c.z) * 0.92 })); const xs = sh.map((p) => p.x), zs = sh.map((p) => p.z); for (let z = Math.min(...zs); z <= Math.max(...zs); z += 1) for (let x = Math.min(...xs); x <= Math.max(...xs); x += 1) { let s = 0; for (let q = 0; q < 4; q++) { const a = sh[q], b = sh[(q + 1) % 4]; s += Math.sign((b.x - a.x) * (z - a.z) - (b.z - a.z) * (x - a.x)); } if (Math.abs(s) === 4) { const k = idx(x, z); if (k >= 0) block[k] = 1; } } continue; }
    stamp({ x: m.x, z: m.z, tx: Math.cos(m.ry), tz: -Math.sin(m.ry), nx: Math.sin(m.ry), nz: Math.cos(m.ry), hw: m.w / 2, hd: m.d / 2 });
  }
  // loang (8 hướng)
  const start = C.spawnPoints().find((s) => s.id === 'trungtam'), s0 = idx(start.x, start.z);
  assert.equal(block[s0], 0, 'điểm xuất phát bị chặn');
  REACH = new Uint8Array(N * N); const Q = new Int32Array(N * N); let qh = 0, qt = 0; Q[qt++] = s0; REACH[s0] = 1;
  while (qh < qt) { const k = Q[qh++], i = k % N, j = (k - i) / N; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const q = jj * N + ii; if (!REACH[q] && !block[q]) { REACH[q] = 1; Q[qt++] = q; } } }
  console.log(`      loang ${qt} ô (${Math.round(qt * STEP * STEP / 1e6 * 10) / 10} km²)`);
});
const reach = (x, z, r = 2.5) => { for (let dz = -r; dz <= r; dz += 1) for (let dx = -r; dx <= r; dx += 1) { const k = idx(x + dx, z + dz); if (k >= 0 && REACH[k]) return true; } return false; };

check('đi bộ từ Nội Thành tới 8 cổng, mọi tâm khu / quảng trường / sảnh / đền, 5 cầu (hai đầu + giữa), mọi ga, mọi điểm hồi sinh', () => {
  assert.ok(REACH, 'chưa dựng lưới');
  const miss = [];
  for (const g of GUA) { const l = { u: A - 20 }; const p = { x: g.dir[0] * l.u, z: g.dir[1] * l.u }; if (!reach(p.x, p.z)) miss.push(`cổng ${g.id}`); }
  for (const d of C.districts()) { // quảng trường: ≥ 60 % điểm mẫu (lưới 6 m, trừ công trình đứng giữa) tới được
    const P = C.plazas().find((p) => p.id === d.plaza); let n = 0, ok = 0;
    for (const poly of P.polys) for (let a = 0.05; a < 1; a += 0.1) for (let b = 0.05; b < 1; b += 0.1) {
      const x = poly[0].x + (poly[1].x - poly[0].x) * a + (poly[3].x - poly[0].x) * b + (poly[2].x - poly[1].x - poly[3].x + poly[0].x) * a * b;
      const z = poly[0].z + (poly[1].z - poly[0].z) * a + (poly[3].z - poly[0].z) * b + (poly[2].z - poly[1].z - poly[3].z + poly[0].z) * a * b;
      n++; if (reach(x, z, 0)) ok++;
    }
    if (ok < n * 0.6) miss.push(`quảng trường ${d.id} (${ok}/${n})`);
  }
  for (const m of C.landmarks()) if (!reach(m.door.x, m.door.z, 3)) miss.push(`cửa ${m.id}`);
  for (const b of C.bridges()) for (const t of [-b.L + 2, 0, b.L - 2]) if (!reach(b.x + b.ax * t, b.z + b.az * t)) miss.push(`cầu ${b.id} t ${t}`);
  for (const s of C.stations()) if (!reach(s.x, s.z)) miss.push(`ga ${s.id}`);
  for (const s of C.spawnPoints()) if (!reach(s.x, s.z, 3)) miss.push(`hồi sinh ${s.id}`);
  assert.deepEqual(miss, []);
});

check('đi bộ tới cửa MỌI nhà / tiệm (cửa trước mặt tiền)', () => {
  const miss = HOUSES.filter((h) => !reach(h.door.x, h.door.z));
  assert.equal(miss.length, 0, `${miss.length} cửa không tới được, vd ${miss.slice(0, 4).map((h) => `${h.id} ${h.use} ${h.front} (${h.door.x}, ${h.door.z})`).join('; ')}`);
});

check('ga xe ngựa ~40 (quảng trường, giao lộ đại lộ × vành, cổng) trên đại lộ khô; điểm hồi sinh: Tân Thủ Môn cổng Ly, trung tâm, miếu mỗi khu', () => {
  const S = C.stations(); assert.ok(S.length >= 36 && S.length <= 48, `${S.length} ga`);
  const kinds = {}; for (const s of S) kinds[s.kind] = (kinds[s.kind] || 0) + 1;
  assert.equal(kinds.gate, 8); assert.ok(kinds.plaza >= 16); assert.ok(kinds.junction >= 8); assert.equal(kinds.center, 1);
  assert.equal(new Set(S.map((s) => s.id)).size, S.length);
  const av = C.roads().filter((r) => r.kind === 'avenue');
  for (const s of S) { assert.ok(!WW.isWater(s.x, s.z, 5), `${s.id} ngập`); assert.ok(av.some((r) => segDist(s, r.a, r.b) < r.w / 2), `${s.id} không trên đại lộ`); }
  const P = C.spawnPoints();
  const tt = P.find((p) => p.id === 'tanthumon'), ly = C.gates().find((g) => g.gua === 'li'); assert.ok(Math.hypot(tt.x - ly.x, tt.z - ly.z) < 60, 'Tân Thủ Môn xa cổng Ly');
  assert.ok(P.find((p) => p.id === 'trungtam' && p.district === 'noi'));
  const temples = P.filter((p) => p.kind === 'temple'); assert.equal(temples.length, 17);
  assert.equal(new Set(temples.map((p) => p.district)).size, 17);
});

check('cellsInRange / cell: ô ngoài thành rỗng, tra theo bán kính đúng', () => {
  const ids = C.cellsInRange(0, 0, 300); assert.ok(ids.includes(C.cellIdAt(0, 0)) && ids.length >= 9 && ids.length <= 16, `${ids.length} ô`);
  const far = C.cell(C.cellIdAt(3500, -3500)); assert.equal(far.houses.length, 0);
  assert.equal(C.cell('40_2'), null);
  const c = C.cell(C.cellIdAt(500, 500)); assert.ok(c.houses.length > 50 && c.roads.length > 10, `ô (500, 500): ${c.houses.length} nhà`);
});

console.log(`\n${pass} đạt, ${fails.length} hỏng`);
if (fails.length) { console.log(fails.map((f) => '  - ' + f).join('\n')); process.exitCode = 1; }
