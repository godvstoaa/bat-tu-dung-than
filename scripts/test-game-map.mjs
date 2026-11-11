// v4 — bản đồ chi tiết (map-ui.js): dữ liệu, tìm kiếm theo tên / loại tiệm / thần miếu, chạm trúng icon / nhà, tên khu.
import assert from 'node:assert/strict';
import * as M from '../src/game/map-ui.js';

let n = 0; const test = (name, fn) => { fn(); n++; console.log('✓', name); };
const D = M.mapData();
test('dữ liệu: > 20.000 nhà vẽ được, đủ lớp icon (thầy bói, miếu, sảnh, trạm, bến, nhà bán, cổng), có tên phố', () => {
  assert.ok(D.houses.length > 20000);
  for (const l of M.LAYERS) assert.ok(D.pois.some((p) => p.layer === l.id), l.id);
  assert.ok(D.pois.filter((p) => p.layer === 'station').length === 41);
  assert.ok(D.streetLabels.length > 100);
});
test('tìm «thuốc» ra Dược Phòng gần nhất trước; «quan am» ra miếu thờ Quan Âm; «trạm» ra ga', () => {
  const r = M.searchMap('thuốc', 0, 560); assert.ok(r.length && r.some((x) => /Dược Phòng/.test(x.name)));
  for (let i = 1; i < r.length; i++) assert.ok(r[i].d >= r[i - 1].d);
  assert.ok(M.searchMap('quan am', 0, 0).every((x) => /Quan Âm/.test(x.name)));
  assert.ok(M.searchMap('ga ', 0, 0).some((x) => x.kind === 'station'));
  assert.deepEqual(M.searchMap('x', 0, 0), []);
});
test('chạm: trúng icon trạm khi phóng xa; trúng căn nhà khi phóng gần; chỗ trống ra «Điểm đã chọn»', () => {
  const st = D.pois.find((p) => p.layer === 'station');
  const v = { cx: st.x, cz: st.z, s: 0.5, w: 800, h: 600 };
  assert.equal(M.hitMap(v, 400, 300).kind, 'station');
  const e = D.houses.find((h) => h.kind === 'shop'), v2 = { cx: e.obb.x, cz: e.obb.z, s: 2, w: 800, h: 600 };
  assert.equal(M.hitMap(v2, 400, 300).house?.i, e.i);
  assert.equal(M.hitMap({ cx: 3000, cz: 3000, s: 1, w: 800, h: 600 }, 400, 300).kind, 'point');
});
test('tên khu theo vị trí; trạm gần nhất', () => {
  assert.equal(M.districtName(0, 0), 'Nội Thành'); assert.equal(M.districtName(0, 560), 'Ly Hỏa Thị'); assert.equal(M.districtName(0, 3000), 'Ngoài thành');
  const s = M.nearestStation(0, 2080); assert.ok(Math.hypot(s.x - 0, s.z - 2080) < 40);
});
console.log(`\n${n} test bản đồ đạt.`);
