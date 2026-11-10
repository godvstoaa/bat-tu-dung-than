// ============================================================================
//  TEST CỬA TRONG THÀNH + PHÒNG LƯỚI (homes.js + rooms.js + world.js — thuần Node):
//   · mọi nhà phố có cửa; cửa phân loại: cửa hàng / nhà rao bán / điện / gõ cửa; mọi phòng có cửa;
//   · cửa không nằm trong nhà / tường rào nào; doorNear / houseAt tìm đúng;
//   · phòng lưới không chồng nhau, không chồng điện thờ cũ, nằm trong biên máy chủ; sàn đi được;
//   · trạm cửa ảo vào đúng phòng, lối ra đưa về đúng cửa vừa vào;
//   · nhà dân: gõ cửa có người đáp (câu tất định theo ngày), có khi chỉ đường tới tiệm / nhà rao bán.
// ============================================================================
import assert from 'node:assert/strict';
import * as HM from '../src/game/homes.js';
import * as CB from '../src/game/cityblocks.js';
import * as RM from '../src/game/rooms.js';
import { ROOMS, stationById, nearestStation, stationAt, blockedAt, roomAt } from '../src/game/world.js';
import { WORLD_TILES } from '../src/game/protocol.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const E = HM.enterables(), C = CB.generateCity(), SPECS = RM.roomSpecs();
const T = (x, z) => ({ x: x / 1.6 + 10, y: z / 1.6 + 7 });
const W = (t) => ({ x: (t.x - 10) * 1.6, z: (t.y - 7) * 1.6 });

check(`≥ 2.200 cửa (hiện ${E.length}); đủ 4 loại; mọi phòng lưới có đúng một cửa ngoài phố`, () => {
  assert.ok(E.length >= 2200);
  const n = {}; for (const e of E) n[e.kind] = (n[e.kind] || 0) + 1;
  assert.ok(n.shop >= 40 && n.est >= 25 && n.temple >= 8 && n.knock > 2000, JSON.stringify(n));
  for (const r of SPECS) assert.equal(E.filter((e) => e.key === r.key).length, 1, r.key);
  for (const e of E) if (e.kind === 'knock') assert.equal(e.key, null); else assert.ok(RM.roomByKey(e.key), e.key);
});
check('công trình mốc 8 phường + công trình có tên Nội Thành đều có cửa', () => {
  for (const l of C.landmarks) assert.ok(E.some((e) => e.name === l.name && e.kind === 'temple'), l.name);
  for (const n of ['Đan Dược Các', 'Hỏa Vân Tửu Lâu', 'Lôi Âm Điện', 'Tàng Phong Lâu', 'Đoài Duyệt Trà Lâu']) assert.ok(E.some((e) => e.name === n), n);
});
const inBox = (b, x, z, pad = 0) => { const c = Math.cos(b.ry), s = Math.sin(b.ry), px = x - b.x, pz = z - b.z; return Math.abs(px * c - pz * s) < b.hw + pad && Math.abs(px * s + pz * c) < b.hd + pad; };
check('cửa không nằm trong nhà / tường rào nào (lưới băm)', () => {
  const boxes = [...C.houses, ...C.walls.map((w) => ({ ...w, hw: w.len / 2, hd: CB.WALL_T / 2 }))];
  const grid = new Map(), K = (x, z) => `${Math.floor(x / 20)},${Math.floor(z / 20)}`;
  for (const b of boxes) { const k = K(b.x, b.z); (grid.get(k) || grid.set(k, []).get(k)).push(b); }
  let bad = 0, ex = '';
  for (const e of E) { const gx = Math.floor(e.door.x / 20), gz = Math.floor(e.door.z / 20); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const q of grid.get(`${gx + a},${gz + b}`) || []) if (inBox(q, e.door.x, e.door.z, 0.25)) { bad++; ex ||= `${e.name}@(${e.door.x.toFixed(0)},${e.door.z.toFixed(0)})`; } }
  assert.equal(bad, 0, `${bad} cửa kẹt, vd ${ex}`);
});
check('doorNear tìm đúng cửa; houseAt bấm giữa nhà ra đúng nhà', () => {
  for (const e of E.filter((_, i) => i % 37 === 0)) {
    assert.equal(HM.doorNear(e.door.x + 0.3, e.door.z - 0.2, 1)?.i, e.i);
    if (e.obb) assert.equal(HM.houseAt(e.obb.x, e.obb.z)?.i, e.i);
  }
});
check(`${SPECS.length} phòng lưới không chồng nhau, không chồng điện thờ cũ, trong biên máy chủ`, () => {
  const all = [...ROOMS, ...SPECS];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    assert.ok(Math.abs(a.origin.x - b.origin.x) > (a.w + b.w) / 2 + 2 || Math.abs(a.origin.z - b.origin.z) > (a.d + b.d) / 2 + 2, `${a.id} ↔ ${b.id}`);
  }
  for (const r of SPECS) for (const [dx, dz] of [[-1, -1], [1, 1]]) { const t = T(r.origin.x + dx * r.w / 2, r.origin.z + dz * r.d / 2); assert.ok(t.x > WORLD_TILES.minX && t.x < WORLD_TILES.maxX && t.y > WORLD_TILES.minY && t.y < WORLD_TILES.maxY, r.key); }
});
check('sàn phòng đi được (trong khung), ngoài sàn là biển mây (chặn)', () => {
  for (const r of SPECS.filter((_, i) => i % 7 === 0)) {
    const ins = RM.insideOf(r);
    assert.equal(blockedAt(T(ins.x, ins.z).x, T(ins.x, ins.z).y), false, r.key);
    assert.equal(roomAt(ins.x, ins.z)?.id, r.key);
    assert.equal(blockedAt(T(r.origin.x + r.w / 2 + 2, r.origin.z).x, T(r.origin.x + r.w / 2 + 2, r.origin.z).y), true, `${r.key} ngoài sàn`);
  }
});
check('đứng trước cửa → trạm cửa ảo vào đúng phòng; lối ra → về đúng cửa vừa vào', () => {
  for (const kind of ['shop', 'est', 'temple']) {
    const e = E.find((q) => q.kind === kind);
    const st = nearestStation(T(e.door.x, e.door.z));
    assert.ok(st && st.kind === 'door' && st.room === e.key, `không có trạm cửa tại ${e.name}`);
    assert.equal(stationById(st.id), st);
    const r = RM.roomByKey(e.key), to = W(st.to);
    assert.ok(Math.abs(to.x - r.origin.x) < r.w / 2 && Math.abs(to.z - r.origin.z) < r.d / 2, 'vào sai phòng');
    const ex = stationById(`exit:${e.key}`);
    assert.ok(ex && ex.kind === 'exit', 'thiếu lối ra');
    const back = W(ex.to);
    assert.ok(Math.hypot(back.x - e.back.x, back.z - e.back.z) < 0.01, 'ra không đúng cửa');
    assert.ok(Math.hypot(back.x - e.door.x, back.z - e.door.z) < 2, 'đứng ra quá xa cửa');
    // đứng sát lối ra trong phòng → trạm lối ra
    const ew = RM.exitOf(r);
    assert.equal(nearestStation(T(ew.x, ew.z - 0.3))?.id, ex.id);
  }
});
check('điểm tương tác trong phòng (rooms.setRoomSpots) → trạm ảo spot, tra lại được theo id', () => {
  const r = SPECS[0], o = r.origin;
  RM.setRoomSpots(r.key, [{ id: 'owner', kind: 'owner', name: 'Chủ', verb: 'Hỏi', x: o.x, z: o.z - 2, r: 1.2 }]);
  const st = nearestStation(T(o.x, o.z - 1.5));
  assert.equal(st?.kind, 'spot'); assert.equal(st.data.kind, 'owner');
  assert.equal(stationById(st.id)?.data.id, 'owner');
  RM.clearRoomSpots(r.key);
});
check('bấm vào thân nhà → đi tới cửa nhà đó (nhà dân: trạm gõ cửa)', () => {
  const e = E.find((q) => q.obb && q.kind === 'knock');
  const st = stationAt(T(e.obb.x, e.obb.z).x, T(e.obb.x, e.obb.z).y);
  assert.ok(st && st.id === `knock:${e.i}` && st.kind === 'knock');
});
check('gõ cửa: chủ nhà đáp, câu tất định theo ngày, có câu chỉ đường', () => {
  const ks = E.filter((q) => q.kind === 'knock').slice(0, 300);
  const a = HM.knockReply(ks[3], 10, '2026-11-10', HM.nearbyHint(ks[3]));
  assert.equal(a, HM.knockReply(ks[3], 10, '2026-11-10', HM.nearbyHint(ks[3])));
  assert.ok(/^Họ /.test(a));
  const lines = new Set(ks.map((e) => HM.knockReply(e, 15, '2026-11-10', HM.nearbyHint(e))));
  assert.ok(lines.size >= 8, `chỉ ${lines.size} câu khác nhau`);
  assert.ok([...lines].some((l) => /Nha Môn|ghé/.test(l)), 'không có câu chỉ đường');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
