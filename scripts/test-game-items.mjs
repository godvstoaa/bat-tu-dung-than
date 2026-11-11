// ============================================================================
//  TEST VẬT PHẨM + CỬA HÀNG (items.js, shops.js — thuần Node):
//   · danh mục hợp lệ (id duy nhất, giá, hành, khung, model / thủ tục), mọi loại tiệm có hàng / dịch vụ;
//   · mua / bán / giới hạn 12 món; bán lại < giá mua; giá Ngọc trừ Ngọc; đan dược;
//   · hàng hiếm + giảm giá tất định theo ngày;
//   · cửa hàng: cung nào cũng có ≥ 4 tiệm, mọi loại tiệm có chi nhánh, không trùng căn rao bán,
//     mặt tiền nằm gọn trong khung nhà cũ.
// ============================================================================
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as I from '../src/game/items.js';
import * as LIFE from '../src/game/life.js';
import * as COIN from '../src/game/coins.js';
import { cityShops } from '../src/game/shops.js';
import { listings } from '../src/game/estate.js';
import { createState, recordCase } from '../src/game/state.js';
import * as BQ from '../src/game/batquai.js';
import { renderHouses, modelOf } from '../src/game/city4.js';
import { generateCity, HOUSE_SPECS } from '../src/game/cityblocks.js';
import { innerHouses } from '../src/game/innerfill.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
// fresh(đồng): ví tiền kim loại (P18) — Phúc Khí không còn mua được đồ
const fresh = (dong = 1000) => { const s = createState(); s.phucKhi = 0; s.wardrobe = null; I.homeState(s); LIFE.lifeState(s).xu = dong * COIN.DONG; return s; };
const wal = (s) => LIFE.walletXu(s);

check(`danh mục ${I.ITEMS.length} món hợp lệ`, () => {
  const ids = new Set();
  for (const it of I.ITEMS) {
    assert.ok(!ids.has(it.id), `trùng ${it.id}`); ids.add(it.id);
    assert.ok((it.price.xu > 0) !== (it.price.ngoc > 0) && !it.price.phuc, `${it.id}: giá phải là tiền HOẶC Ngọc`);
    if (it.kind === 'decor') {
      assert.ok(I.WX_NAME[it.wx], `${it.id}: thiếu hành`);
      assert.ok(it.foot[0] > 0 && it.foot[1] > 0, `${it.id}: khung`);
      assert.ok(it.model || it.proc, `${it.id}: không có cách dựng`);
      if (it.model) assert.ok(fs.existsSync(`public/models/${it.model}.glb`), `${it.id}: thiếu public/models/${it.model}.glb`);
    } else assert.ok(it.use, `${it.id}: đồ dùng thiếu use`);
  }
  for (const [t, T] of Object.entries(I.SHOP_TYPES)) assert.ok(I.itemsOfShop(t).length || (T.svc || []).length, `${t}: không bán gì cũng không có dịch vụ`);
});
check('mua trừ tiền vào túi (Ghế Thái Sư 240 đồng); thiếu tiền bị từ chối; tối đa 12 chiếc / món', () => {
  const s = fresh(10000);
  assert.equal(I.ITEM.ghe_tanh.price.xu, 240 * COIN.DONG);
  assert.ok(I.buyItem(s, 'ghe_tanh').ok); assert.equal(wal(s), (10000 - 240) * COIN.DONG); assert.equal(I.invCount(s, 'ghe_tanh'), 1);
  const poor = fresh(10); assert.equal(I.buyItem(poor, 'giuong').ok, false); assert.equal(wal(poor), 10 * COIN.DONG);
  for (let k = 0; k < 11; k++) assert.ok(I.buyItem(s, 'ghe_tanh').ok);
  assert.equal(I.buyItem(s, 'ghe_tanh').ok, false, 'chiếc thứ 13');
  assert.ok(I.buyItem(s, 'huong_thuong', 20).ok, 'đồ dùng không giới hạn 12');
});
check('bán lại < giá mua (một nửa, làm tròn xuống); giá Ngọc trừ Ngọc', () => {
  const s = fresh(1000);
  I.buyItem(s, 'den_long_do'); const before = wal(s);
  const r = I.sellItem(s, 'den_long_do'); assert.ok(r.ok); assert.equal(wal(s) - before, 75 * COIN.DONG);
  for (const it of I.ITEMS) { const p = I.sellPrice(it); assert.ok((p.xu || 0) < (it.price.xu || 1) && (p.ngoc || 0) < (it.price.ngoc || 1), it.id); }
  const w = I.homeState(s) && s.wardrobe; void w;
  assert.equal(I.buyItem(s, 'ky_lan').ok, false, 'chưa có Ngọc');
});
check('đan dược: Tốc Hành Tán cộng dồn thời gian; Thanh Tâm Đan mỗi ngày một viên, +25% án', () => {
  const s = fresh(1000), now = 1e12;
  I.buyItem(s, 'tochanh', 2);
  assert.ok(I.useBuff(s, 'tochanh', now).ok); assert.ok(I.useBuff(s, 'tochanh', now).ok);
  assert.equal(I.activeBuff(s, 'speed', now).until, now + 20 * 60000);
  assert.equal(I.activeBuff(s, 'speed', now + 21 * 60000), null);
  I.buyItem(s, 'thanhtam', 2);
  const d = s.daily.date;
  assert.ok(I.useBuff(s, 'thanhtam', now, d).ok); assert.equal(I.useBuff(s, 'thanhtam', now, d).ok, false);
  const a = fresh(0), b = fresh(0); I.homeState(b).buffs.case = { date: b.daily.date };
  const ga = recordCase(a, { kind: 'npc', slot: 0, name: 'x', total: 1 }), gb = recordCase(b, { kind: 'npc', slot: 0, name: 'x', total: 1 });
  assert.ok(gb > ga, `${gb} > ${ga}`);
});
check('hàng hiếm + giảm giá tất định theo ngày, đúng loại tiệm', () => {
  const r1 = I.dailyRare('moc', 3, '2026-11-10'), r2 = I.dailyRare('moc', 3, '2026-11-10');
  assert.equal(r1?.id, r2?.id); assert.ok(!r1 || r1.rare);
  const d = I.dailyDeal('gom', 1, '2026-11-10');
  assert.ok(d && I.ITEM[d.id].cat === 'gom' && d.xu < I.ITEM[d.id].price.xu && d.xu % COIN.DONG === 0);
  const days = new Set(Array.from({ length: 20 }, (_, k) => I.dailyDeal('moc', 2, `2026-11-${10 + k}`).id));
  assert.ok(days.size >= 3, 'giảm giá không xoay vòng');
});
const S = cityShops();
check(`v4: ${S.length} cửa hàng: cung nào cũng ≥ 500 tiệm, mọi loại tiệm có chi nhánh, 16 dịch trạm + 16 nha môn + 16 tiền trang`, () => {
  for (const g of BQ.GUA) assert.ok(S.filter((s) => s.g === g.id).length >= 500, g.id);
  for (const t of Object.keys(I.SHOP_TYPES)) if (t !== 'may') assert.ok(S.some((s) => s.type === t), `thiếu ${t}`); // Tiệm May: quầy Thợ May trong sân Sơn Môn
  for (const t of ['dichtram', 'namon', 'tientrang']) assert.equal(S.filter((s) => s.type === t).length, 16, t);
  assert.equal(new Set(S.map((s) => s.k)).size, S.length, 'trùng k');
});
check('cửa hàng không trùng căn rao bán; mặt tiền gọn trong khung nhà cũ', () => {
  const est = new Set(listings().filter((l) => l.hi != null).map((l) => l.hi));
  for (const s of S) {
    if (s.hi != null) assert.ok(!est.has(s.hi), `${s.name} trùng nhà rao bán`);
    if (s.house && s.facade) assert.ok(s.fit > 3 && s.fit <= s.house.f + 1e-6, `${s.name}: fit ${s.fit}`);
  }
});

check('v4 bản sắc phố: ≥ 20 mẫu nhà, tiệm đúng mặt tiền theo loại, nhà theo cung (Khảm nhà ven sông, Khôn kho lương)', () => {
  const R = renderHouses();
  assert.ok(new Set(R.map((h) => h.id)).size >= 20);
  for (const h of R) { assert.ok(HOUSE_SPECS[h.id], h.id); assert.ok(h.lotF <= h.f + 1e-6, `${h.key} tràn lô`); }
  const byKey = new Map(R.map((h) => [h.key, h]));
  for (const s of S) if (s.hi != null && s.type !== 'tientrang') assert.equal(byKey.get(s.hi).id, modelOf({ use: 'shop', type: s.type }), s.name);
  const by = (g, id) => R.some((h) => h.g === g && h.id === id);
  assert.ok(by('kan', 'bq_canal_house') && by('kun', 'bq_granary'));
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
