// ============================================================================
//  TEST NHIỆM VỤ MỆNH (P5 — src/game/fatequest.js), thuần Node: chỉ người ĐÚNG MỆNH, ĐÚNG GIỜ, ĐÚNG CHỖ mới thấy;
//  một nhiệm vụ / ngày; thưởng ×3–6 lương ngày; chuỗi 7 ngày mở đặc quyền theo hành, đặc quyền giảm giá đúng chỗ.
// ============================================================================
import assert from 'node:assert/strict';
import * as FQ from '../src/game/fatequest.js';
import * as LIFE from '../src/game/life.js';
import * as ILL from '../src/game/illness.js';
import * as VE from '../src/game/vehicles.js';
import { createState } from '../src/game/state.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const fresh = () => { const s = createState(); return LIFE.lifeState(s); };
const D = '2026-11-11';

check('5 hành × 3 nhiệm vụ; thưởng ×3–6 lương ngày; canh giờ đúng đặc tả', () => {
  for (const wx of ['水', '火', '木', '金', '土']) assert.equal(FQ.QUESTS.filter((q) => q.wx === wx).length, 3);
  for (const q of FQ.QUESTS) assert.ok(q.mul >= 3 && q.mul <= 6);
  assert.ok(FQ.inHours('水', 22) && FQ.inHours('水', 0) && !FQ.inHours('水', 2));
  assert.ok(FQ.inHours('火', 10) && !FQ.inHours('火', 13));
  assert.ok(FQ.inHours('木', 4) && !FQ.inHours('木', 8));
  assert.ok(FQ.inHours('金', 16) && !FQ.inHours('金', 20));
  assert.ok(FQ.inHours('土', 8) && FQ.inHours('土', 20) && FQ.inHours('土', 2) && FQ.inHours('土', 14) && !FQ.inHours('土', 10));
});
check('chỉ người đúng mệnh + đúng giờ + đúng chỗ mới thấy; người khác đứng đó không thấy; làm rồi thì hôm nay không thấy nữa', () => {
  const L = fresh(), q = FQ.questFor(D, '水', 'p1'), sp = FQ.spotFor(q, D);
  const at = (o) => FQ.visibleFor({ L, wx: '水', pid: 'p1', dateStr: D, hour: 22, x: sp.x, z: sp.z, ...o });
  assert.ok(at({}), 'đúng cả ba thì thấy');
  assert.equal(at({ hour: 12 }), null, 'sai giờ');
  assert.equal(at({ x: sp.x + 200 }), null, 'sai chỗ');
  assert.equal(at({ wx: '火' }), null, 'người mệnh Hỏa đứng đó cũng không thấy');
  assert.equal(at({ wx: null }), null, 'chưa có lá số');
  FQ.complete(L, q, D); assert.equal(at({}), null, 'làm rồi');
});
check('nhiệm vụ đổi theo ngày, tất định; điểm nằm trong cung đúng hành', () => {
  const a = FQ.questFor(D, '金', 'x'), b = FQ.questFor(D, '金', 'x'); assert.equal(a.id, b.id);
  const days = new Set(Array.from({ length: 12 }, (_, i) => FQ.questFor(`2026-12-${String(i + 1).padStart(2, '0')}`, '金', 'x').id)); assert.ok(days.size >= 2);
  for (const q of FQ.QUESTS) { const sp = FQ.spotFor(q, D); assert.ok(Math.hypot(sp.x, sp.z) > 200 && Math.hypot(sp.x, sp.z) < 700, q.id); }
});
check('thưởng + chuỗi 7 ngày liền → đặc quyền 7 ngày; đứt ngày thì về 1', () => {
  const L = fresh(); const q = FQ.QUESTS.find((x) => x.id === 'tieclon');
  let r; for (let d = 1; d <= 7; d++) r = FQ.complete(L, q, `2026-11-${String(d).padStart(2, '0')}`, 1e12);
  assert.equal(r.reward, 320); assert.ok(r.perk); assert.equal(r.perk.wx, '火');
  assert.equal(FQ.complete(L, q, '2026-11-07').ok, false, 'một lần mỗi ngày');
  assert.equal(FQ.complete(L, q, '2026-11-09', 1e12).streak, 1, 'đứt ngày');
});
check('đặc quyền giảm giá đúng chỗ: Hỏa ăn −20%, Kim Tiền Trang miễn phí, Mộc thuốc −30%, Thổ bảo trì nhà −50%', () => {
  const L = fresh(); L.xu = 1e7;
  L.fate = { perk: { wx: '火', until: Date.now() + 1e6 } }; L.full = 30; LIFE.eat(L, 'com', 'stall'); assert.equal(L.spent, 12);
  L.fate.perk.wx = '金'; assert.equal(LIFE.deposit(L, 100000).fee, 0);
  L.fate.perk.wx = '木'; ILL.catchIll(L, 'phonghan', 0); assert.equal(ILL.quote(L, 'duoc', null).price, 105);
  L.fate.perk.wx = '土'; assert.equal(VE.dailyUpkeep(L, 'z', { pay: () => true, addDebt: () => {}, house: { tier: 'tuhop', free: false } }).house, 23);
  L.fate.perk.until = Date.now() - 1; assert.equal(FQ.perkMul(L, 'house'), 1, 'hết hạn');
});
check('gợi ý NPC không nói toạ độ, chỉ canh giờ + cung + hành', () => {
  const t = FQ.hint(FQ.QUESTS[0]); assert.match(t, /Khảm/); assert.match(t, /Thủy/); assert.doesNotMatch(t, /\d{3}/);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
