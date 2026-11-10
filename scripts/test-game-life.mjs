// ============================================================================
//  TEST SINH TỒN + VĂN + VIỆC THEO MỆNH (thuần Node): chỉ số trôi theo giờ chơi, đêm thức trắng, Khí huyết tụt / hồi,
//  ngất, ăn (tiền, no, giới hạn trà), trọ / ngủ, bù giờ offline (sàn, ngủ bờ bụi, móc túi), thuế thân theo bậc,
//  hệ số Dụng / Hỷ / Kỵ thần, chấm điểm gánh nước, và CÂN BẰNG: một giờ gánh nước ≈ một ngày sống tối thiểu.
// ============================================================================
import assert from 'node:assert/strict';
import * as LIFE from '../src/game/life.js';
import * as J from '../src/game/jobs.js';
import { WATER_DIST } from '../src/game/lifeplaces.js';
import { createState } from '../src/game/state.js';
import * as I from '../src/game/items.js';
import { TIERS } from '../src/game/estate-core.js';
import * as COIN from '../src/game/coins.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const fresh = () => LIFE.lifeState(createState(), 1e12);
const near = (a, b, e = 0.01) => Math.abs(a - b) <= e;

check('khởi tạo: No 80 · Tỉnh 80 · Khí huyết 90 · 300 văn; state.life có trong khung lưu', () => {
  const s = createState(); assert.ok('life' in s);
  const L = LIFE.lifeState(s); assert.equal(L.full, 80); assert.equal(L.van, LIFE.START_VAN);
});
check('trôi 1 giờ chơi: No −10 (chạy ×1,5), Tỉnh −7, ban đêm (giờ Tý) Tỉnh tụt gấp đôi', () => {
  const a = fresh(); LIFE.tick(a, 3600, { activity: 'walk', hour: 10 }); assert.ok(near(a.full, 70) && near(a.wake, 73));
  const b = fresh(); LIFE.tick(b, 3600, { activity: 'run', hour: 23 }); assert.ok(near(b.full, 65) && near(b.wake, 66));
});
check('đói / buồn ngủ dưới 20: Khí huyết tụt 4/giờ mỗi thứ; no và tỉnh trên 50: hồi 2/giờ; về 0 thì ngất', () => {
  const a = fresh(); a.full = 10; a.wake = 10; a.hp = 50; LIFE.tick(a, 3600, { hour: 12 }); assert.ok(near(a.hp, 42, 0.01));
  const b = fresh(); b.hp = 50; LIFE.tick(b, 3600, { hour: 12 }); assert.ok(near(b.hp, 52));
  const c = fresh(); c.full = 0; c.wake = 0; c.hp = 0.5; assert.equal(LIFE.tick(c, 600, { hour: 12 }).fainted, true);
  c.van = 500; const f = LIFE.faint(c); assert.equal(f.fee, 300); assert.equal(c.van, 200); assert.equal(c.hp, 30); // P3: viện phí Y Quán 300 đồng
});
check('ảnh hưởng: đói / mệt đi chậm ×0,85; Tỉnh < 10 không chạy nhanh được; trần thể lực = 40 + 0,6 × Tỉnh', () => {
  const a = fresh(); assert.equal(LIFE.mods(a).speed, 1); assert.equal(LIFE.mods(a).staminaCap, 88);
  a.wake = 5; const m = LIFE.mods(a); assert.equal(m.speed, 0.85); assert.equal(m.sprint, false); assert.equal(m.staminaCap, 43);
});
check('ăn: trừ Văn, cộng No; thiếu tiền / no căng / sai thực đơn bị từ chối; trà tối đa 2 chén / 6 giờ', () => {
  const L = fresh(); L.full = 30;
  assert.equal(LIFE.eat(L, 'com', 'stall').ok, true); assert.equal(L.van, 285); assert.equal(L.full, 65);
  assert.equal(LIFE.eat(L, 'tiec', 'stall').err, 'menu');
  L.full = 99; assert.equal(LIFE.eat(L, 'com', 'stall').err, 'full');
  const t0 = 1e12;
  assert.ok(LIFE.eat(L, 'tra', 'tralau', t0).ok); assert.ok(LIFE.eat(L, 'tra', 'tralau', t0 + 1).ok);
  assert.equal(LIFE.eat(L, 'tra', 'tralau', t0 + 2).err, 'cap'); assert.ok(LIFE.eat(L, 'tra', 'tralau', t0 + 7 * 3600000).ok);
  L.van = 3; L.full = 10; assert.equal(LIFE.eat(L, 'com', 'stall').err, 'money');
});
check('trọ: giường chung 30 văn giữ 12 giờ; ngủ 8 giờ hồi Tỉnh theo cấp, No tụt 3/giờ', () => {
  const L = fresh(), t = 1e12;
  assert.ok(LIFE.rentBed(L, 'dorm', t).ok); assert.equal(L.van, 270); assert.ok(LIFE.hasBed(L, 'dorm', t + 11 * 3600000)); assert.ok(!LIFE.hasBed(L, 'dorm', t + 13 * 3600000));
  assert.ok(LIFE.rentBed(L, 'dorm', t + 1).already, 'thuê lại khi còn hạn không mất tiền'); assert.equal(L.van, 270);
  L.wake = 10; L.full = 60; LIFE.sleep(L, 8, 'dorm'); assert.equal(L.wake, 82); assert.equal(L.full, 36);
  L.wake = 10; LIFE.sleep(L, 8, 'villa'); assert.equal(L.wake, 100);
});
check('vắng mặt: chỉ số giảm 25% có sàn (No ≥ 30); ở chỗ trọ = ngủ; ngoài đường hồi nửa, có thể bị móc túi', () => {
  const L = fresh(), t0 = L.last;
  L.full = 80; L.wake = 20; L.van = 200;
  let rep = LIFE.catchUp(L, t0 + 48 * 3600000, { lodging: 'street', rand: () => 0 });
  assert.equal(L.full, 30); assert.equal(rep.robbed, 20); assert.equal(L.van, 180); assert.equal(L.wake, 44);
  L.wake = 20; L.full = 80;
  rep = LIFE.catchUp(L, L.last + 9 * 3600000, { lodging: 'dorm', rand: () => 0 });
  assert.equal(rep.robbed, undefined); assert.equal(L.wake, 92);
  assert.equal(LIFE.catchUp(L, L.last + 30000).hours, 0);
});
check('thuế thân theo bậc giàu, mỗi ngày một lần; không đủ tiền thì ghi nợ', () => {
  assert.equal(LIFE.taxFor(500), 0); assert.equal(LIFE.taxFor(5000), 5); assert.equal(LIFE.taxFor(50000), 30); assert.equal(LIFE.taxFor(500000), 200); assert.equal(LIFE.taxFor(2e6), 8000);
  const L = fresh(); L.van = 5000;
  assert.equal(LIFE.dailyTax(L, L.van, '2026-11-10').due, 5); assert.equal(L.van, 4995);
  assert.equal(LIFE.dailyTax(L, L.van, '2026-11-10').due, 0, 'cùng ngày không thu lại');
  L.van = 2; const r = LIFE.dailyTax(L, 50000, '2026-11-11'); assert.equal(r.paid, false); assert.equal(L.debt, 30);
});
check('tiền lẻ: ví lưu bằng xu — công 0,35 đồng ×10 = 3 đồng 5 hào, không mất phần lẻ (P18)', () => {
  const L = fresh(), x0 = L.xu; let got = 0;
  for (let i = 0; i < 10; i++) got += LIFE.earn(L, 0.35);
  assert.equal(got, 350); assert.equal(L.xu, x0 + 350); assert.equal(L.van, LIFE.START_VAN + 3);
  assert.ok(!JSON.stringify(L).includes('"van"'), 'L.van chỉ là cách đọc, không lưu');
});
check('chuyển ví cũ: văn + phần lẻ → xu; lộc đổi chế độ 10% Phúc Khí × 4 đồng, trần 2 lượng bạc, chỉ một lần', () => {
  const s = { life: { full: 80, wake: 80, hp: 90, van: 120, vanFrac: 0.5, last: Date.now() }, phucKhi: 300 };
  const L = LIFE.lifeState(s);
  assert.equal(L.xu, 12050 + 12000); assert.equal(s.coinGift.xu, 12000);
  LIFE.lifeState(s); assert.equal(L.xu, 24050, 'không cộng lại lần hai');
  const r = { life: { van: 0, last: Date.now() }, phucKhi: 1e6 }; LIFE.lifeState(r); assert.equal(r.life.xu, 200000, 'trần 2 lượng bạc');
});
check('mệnh: nghề hợp Dụng thần ×2 tiền · Hỷ thần ít mệt ×0,7, tay nghề ×1,6 · Kỵ thần ×0,5, mệt ×2, hiệu suất trần 0,6, có rủi ro', () => {
  const yong = { primary: '水', accent: '金', ji: '土' }, job = J.JOBS.ganhnuoc, safe = () => 0.99;
  assert.equal(J.relation('水', yong), 'dung'); assert.equal(J.relation('金', yong), 'hy'); assert.equal(J.relation('土', yong), 'ky'); assert.equal(J.relation('火', yong), 'thuong');
  const d = J.settle(job, 1, { yong, rand: safe }), n = J.settle(job, 1, { yong: { primary: '火' }, rand: safe });
  assert.ok(near(d.pay, n.pay * 2, 1e-9));
  const h = J.settle({ ...job, wx: '金' }, 1, { yong, rand: safe }); assert.ok(near(h.wake, job.wakeCost * 0.7, 1e-9)); assert.ok(near(h.xp, 1.6, 1e-9));
  const k = J.settle({ ...job, wx: '土' }, 1.4, { yong, rand: safe }); assert.equal(k.perf, 0.6); assert.ok(near(k.wake, job.wakeCost * 2, 1e-9));
  assert.ok(J.riskOf('ky') > J.riskOf('dung') + 0.06);
  const bad = J.settle({ ...job, wx: '土' }, 1, { yong, rand: () => 0.01 }); assert.ok(bad.mishap); assert.equal(bad.pay, 0);
});
check('gánh nước: đi đều = hiệu suất ~1; chậm thì giảm; chạy làm sánh nước', () => {
  const walk = 5.6, t = WATER_DIST / (walk * 0.8);
  assert.ok(near(J.waterPerf(WATER_DIST, t, 0, walk), 1.05, 0.01));
  assert.ok(J.waterPerf(WATER_DIST, t * 2, 0, walk) < 0.6);
  assert.ok(J.waterPerf(WATER_DIST, t * 0.7, 5, walk) < J.waterPerf(WATER_DIST, t * 0.7, 0, walk) * 0.7);
});
check('CÂN BẰNG (bẫy thu nhập): một giờ gánh nước mệnh bình thường ≈ một ngày sống tối thiểu (70–95 văn), Tỉnh tụt 35–55', () => {
  const walk = 5.6, carry = WATER_DIST / (walk * 0.8), back = WATER_DIST / walk, trip = carry + back + 3;
  const trips = Math.floor(3600 / trip), L = fresh(); L.van = 0; L.vanFrac = 0;
  const yong = { primary: '火', accent: '木', ji: '金' }; // Thủy là hành bình thường với mệnh này
  for (let i = 0; i < trips; i++) { const r = J.settle(J.JOBS.ganhnuoc, J.waterPerf(WATER_DIST, carry, 0, walk), { yong, rand: () => 0.5 }); LIFE.earn(L, r.pay); L.wake -= r.wake; }
  LIFE.tick(L, 3600, { activity: 'carry', hour: 10 });
  const day = 3 * LIFE.FOOD.com.price + 5 + LIFE.LODGING.dorm.price;
  assert.equal(day, 80);
  assert.ok(L.van >= 70 && L.van <= 95, `thu ${L.van} văn / giờ (${trips} chuyến)`);
  const drop = 80 - L.wake; assert.ok(drop >= 35 && drop <= 55, `Tỉnh tụt ${drop.toFixed(1)}`);
});

check('Tiền Trang: gửi / rút mất 0,5% (tối thiểu 1 đồng); móc túi và ngất không đụng tiền gửi; thuế tính cả tiền gửi', () => {
  const s = createState(); const L = LIFE.lifeState(s); L.xu = 2 * COIN.BAC;
  assert.equal(LIFE.deposit(L, 3 * COIN.BAC).ok, false, 'không đủ');
  const r = LIFE.deposit(L, 2 * COIN.BAC); assert.ok(r.ok); assert.equal(r.fee, 1000); assert.equal(L.xu, 0); assert.equal(L.bank, 2 * COIN.BAC - 1000);
  assert.equal(LIFE.bankFee(50 * COIN.DONG), COIN.DONG, 'phí tối thiểu 1 đồng');
  assert.equal(LIFE.wealthDong(L), 1990);
  const w = LIFE.withdraw(L, COIN.BAC); assert.ok(w.ok); assert.equal(L.xu, COIN.BAC - 500); assert.equal(L.bank, COIN.BAC - 1000);
  assert.equal(LIFE.withdraw(L, 5 * COIN.BAC).ok, false);
  const before = L.bank; L.hp = 0; LIFE.faint?.(L); assert.equal(L.bank, before, 'ngất: tiền gửi còn nguyên');
});

// P18 §26.2 — mô phỏng: lương ca (jobs.taskPay, bậc lên theo tay nghề) − sống tối thiểu 80 đồng − 1 nén hương/ngày − thuế thân
function simDays(rel, shifts, score, target, days = 120) {
  let dong = LIFE.START_VAN, skill = 0;
  for (let d = 1; d <= days; d++) {
    for (let s = 0; s < shifts; s++) for (let k = 0; k < J.SHIFT.tasks; k++) { const r = J.taskPay(J.WORK.gom, score, { rel, rank: J.rankOf(skill, 60, rel), chain: k }); dong += r.pay; skill += r.xp; }
    dong -= 80 + I.ITEM.huong_thuong.price.xu / COIN.DONG + LIFE.taxFor(dong);
    if (dong >= target) return d;
  }
  return null;
}
check('cân bằng tiền kim loại (P18): 2 ca/ngày → đồ bài trí rẻ sau vài ngày, Tiểu Xá ≈ 1 tháng; Dụng thần nhanh hơn, Kỵ thần không dư', () => {
  const xa = TIERS.tieuxa.price.xu / COIN.DONG;
  const avg = simDays('thuong', 2, 0.75, xa), lazy = simDays('thuong', 2, 0.6, xa), dung = simDays('dung', 2, 0.65, xa), hard = simDays('thuong', 3, 0.65, xa);
  assert.ok(avg >= 25 && avg <= 50, `trung bình ${avg} ngày`);
  assert.ok(lazy && lazy <= 75, `làm ẩu ${lazy} ngày`); assert.ok(dung < avg && hard < avg, `${dung} / ${hard} < ${avg}`);
  assert.equal(simDays('ky', 2, 0.6, xa), null, 'nghề Kỵ thần không để dành nổi');
  const lantern = I.ITEM.den_long_do.price.xu / COIN.DONG;
  assert.ok(simDays('thuong', 2, 0.75, LIFE.START_VAN + lantern) <= 12, 'đèn lồng sau vài ngày');
  assert.ok(I.ITEM.huong_thuong.price.xu <= 20 * COIN.DONG, 'đồ tiêu hao mua được hằng ngày');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
