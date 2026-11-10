// ============================================================================
//  TEST HUYỀN HỌC · TU LUYỆN · LUÂN HỒI (P19–P21 — huyenhoc.js, realm.js, luanhoi.js), thuần Node.
// ============================================================================
import assert from 'node:assert/strict';
import * as HH from '../src/game/huyenhoc.js';
import * as RL from '../src/game/realm.js';
import * as LH from '../src/game/luanhoi.js';
import * as AD from '../src/game/amduc.js';
import * as LIFE from '../src/game/life.js';
import { createState } from '../src/game/state.js';

let pass = 0; const fails = [];
const check = (name, fn) => { try { fn(); pass++; console.log(`  ✓ ${name}`); } catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); } };
const fresh = () => { const s = createState(); const L = LIFE.lifeState(s); return { s, L }; };
const seq = (...v) => { let i = 0; return () => v[i++ % v.length]; };
const pay = (L) => (d) => LIFE.pay(L, d);

// --- P19 -------------------------------------------------------------------------------------------------------
check('P19 · mức Âm Đức / Nghiệp 5 bậc; không chỉ số nào là tiền', () => {
  const { L } = fresh(); assert.equal(HH.adLevel(L), 1); AD.adState(L).score = 20; assert.equal(HH.adLevel(L), 3); AD.adState(L).score = -2; assert.equal(HH.adLevel(L), 0);
  assert.equal(HH.ngLevel(L), 0); HH.addNghiep(L, 12); assert.equal(HH.ngLevel(L), 2); HH.addNghiep(L, 100); assert.equal(HH.ngLevel(L), 4);
});
check('P19 · bố thí +1 PK / 20 đồng (trần 20 / ngày), ẩn danh +0,5 Âm Đức / ngày; phóng sinh; sám hối; giải hạn', () => {
  const { s, L } = fresh(); L.xu = 1e6; s.phucKhi = 0;
  assert.equal(HH.bothi(s, L, 100, true, 'd', pay(L)).phuc, 5); assert.equal(AD.adScore(L), 0.5);
  HH.bothi(s, L, 1000, true, 'd', pay(L)); assert.equal(s.phucKhi, 20, 'trần 20 / ngày'); assert.equal(AD.adScore(L), 0.5, 'ẩn danh một lần / ngày');
  L.nghiep = 15; assert.ok(HH.phongsinh(s, L, pay(L)).ok); assert.equal(L.nghiep, 14); assert.equal(s.phucKhi, 22);
  s.phucKhi = 100; assert.ok(HH.samhoi(s, L).ok); assert.equal(s.phucKhi, 70); assert.equal(L.nghiep, 4);
  assert.ok(HH.giaihan(s, L, false, 1e12).ok); assert.equal(s.phucKhi, 40); assert.ok(L.hh.block > 1e12);
});
check('P19 · vận số ngày theo công thức; giải hạn chặn sự kiện dữ; Nghiệp nặng dễ gặp dữ', () => {
  const { s, L } = fresh(); s.phucKhi = 1000; AD.adState(L).score = 20;
  assert.equal(HH.vanSo(s, L, {}), Math.round(50 + 15 + 3 * 6));
  assert.equal(HH.vanSo(s, L, { clash: -1, thaiTue: true }), Math.round(50 + 15 + 18 - 8 - 6));
  const b = fresh(); b.L.nghiep = 70; b.s.phucKhi = 0; const r = HH.rollDay(b.s, b.L, 'x', {}, seq(0.99, 0.01, 0.1), 1e12); assert.ok(r.bad, 'nghiệp nặng gặp dữ');
  const c = fresh(); c.L.nghiep = 70; HH.giaihan(Object.assign(c.s, { phucKhi: 50 }), c.L, false, 1e12); assert.equal(HH.rollDay(c.s, c.L, 'x', {}, seq(0.99, 0.01, 0.1), 1e12).bad, null, 'giải hạn chặn');
});
// --- P20 -------------------------------------------------------------------------------------------------------
check('P20 · cảnh giới: đủ cấp chưa đột phá thì dừng ở đỉnh; người cũ giữ cảnh giới đang có', () => {
  const a = fresh(); RL.realmState(a.s, 3); assert.equal(RL.effectiveLevel(a.s, 12), 4, 'Phàm Nhân trần cấp 4');
  const old = fresh(); assert.equal(RL.effectiveLevel(old.s, 12), 12, 'người cũ cấp 12 giữ Trúc Cơ'); assert.equal(RL.realmOf(old.s, 12).name, 'Trúc Cơ');
});
check('P20 · đột phá cần Âm Đức / Nghiệp + tĩnh tọa; Kim Đan cần luận lá số; Nghiệp nặng → tâm ma mất 10% PK', () => {
  const { s, L } = fresh(); RL.realmState(s, 1);
  assert.ok(RL.breakthrough(s, L, 6, {}).ok, 'Luyện Khí: Âm Đức ≥ Bình Thường'); assert.equal(RL.realmOf(s, 6).name, 'Luyện Khí');
  assert.equal(RL.breakthrough(s, L, 11, {}).ok, false, 'Trúc Cơ cần Âm Đức Có Phúc');
  AD.adState(L).score = 6; assert.match(RL.breakthrough(s, L, 11, {}).missing.join(), /tĩnh tọa/);
  assert.ok(RL.breakthrough(s, L, 11, { meditated: 60 }).ok);
  assert.match(RL.canBreak(s, L, 16, {}).missing.join(), /lá số/);
  L.nghiep = 15; s.phucKhi = 500; const r = RL.breakthrough(s, L, 16, { meditated: 60, reading: true }); assert.ok(r.tamma); assert.equal(s.phucKhi, 450);
});
check('P20 · pháp môn 11 môn × 3 tầng, tầng sau gấp đôi, hợp mệnh rẻ 50%, cần cảnh giới; không môn nào sinh tiền', () => {
  assert.equal(RL.PHAP.length, 11);
  const { s } = fresh(); s.phucKhi = 10000;
  assert.equal(RL.learn(s, 'ngutphong', { yongWx: '水', realmIdx: 1 }).ok, false, 'cần Trúc Cơ');
  assert.equal(RL.phapCost(s, 'tichcoc', '土'), 25); assert.equal(RL.phapCost(s, 'tichcoc', '木'), 50);
  RL.learn(s, 'tichcoc', { yongWx: '木', realmIdx: 1 }); assert.equal(RL.phapCost(s, 'tichcoc', '木'), 100);
  RL.learn(s, 'tichcoc', { yongWx: '木', realmIdx: 1 }); RL.learn(s, 'tichcoc', { yongWx: '木', realmIdx: 1 });
  assert.equal(RL.phapEff(s, 'tichcoc'), 0.15); assert.equal(RL.learn(s, 'tichcoc', { realmIdx: 9 }).ok, false);
  for (const P of RL.PHAP) assert.doesNotMatch(P.text, /tiền công|kiếm tiền/);
});
// --- P21 -------------------------------------------------------------------------------------------------------
check('P21 · chỉ chết vì đói / bệnh nặng không chữa; còn lại ngất; Âm Đức cấp 4 vẫn cứu được', () => {
  const { L } = fresh(); L.full = 0; assert.equal(LH.causeOf(L).kind, 'death');
  L.full = 40; assert.equal(LH.causeOf(L).kind, 'faint');
  L.ill = { id: 'chanthuong', sev: 1, h: 13, cureAt: null }; assert.equal(LH.causeOf(L).kind, 'death');
  L.ill.cureAt = Date.now() + 1e6; assert.equal(LH.causeOf(L).kind, 'faint', 'đang chữa thì không chết');
  L.hp = 10; L.full = 2; assert.equal(LH.dying(L), true, 'cảnh báo trước khi chết');
});
check('P21 · cân nghiệp → 6 cõi; từ chối canh Mạnh Bà tụt một bậc', () => {
  assert.equal(LH.pathFor(130).id, 'thien'); assert.equal(LH.pathFor(90).id, 'atula'); assert.equal(LH.pathFor(40).id, 'nhan');
  assert.equal(LH.pathFor(0).id, 'sucsinh'); assert.equal(LH.pathFor(-30).id, 'ngaquy'); assert.equal(LH.pathFor(-100).id, 'diangu');
  assert.equal(LH.pathFor(130, true).id, 'atula');
  const { L } = fresh(); AD.adState(L).score = 10; L.nghiep = 2; assert.equal(LH.weigh(L, 4000), 30 + 20 - 8);
});
check('P21 · đầu thai: tiền mang theo −50%, Tiền Trang −20% tang phí, PK đang có −50%, PK tích lũy giữ; lá số hư cấu; Sổ Luân Hồi', () => {
  const { s, L } = fresh(); L.xu = 10000; L.bank = 5000; s.phucKhi = 400; s.xp = 9000; L.nghiep = 0; AD.adState(L).score = 10;
  s.player = { birth: { y: 1994, m: 5, d: 12 } };
  const r = LH.judge(s, L, { lifeXp: 6000, name: 'A', cause: 'chết đói', now: 1e12 });
  assert.equal(r.path.id, 'nhan'); assert.equal(r.lost.wallet, 5000); assert.equal(L.bank, 4000); assert.equal(s.phucKhi, 200); assert.equal(s.xp, 9000);
  assert.ok(r.charts.length >= 1 && r.charts.every((c) => c.fictional && c.year >= 1940 && c.year <= 2010));
  assert.deepEqual(s.player.birth, { y: 1994, m: 5, d: 12 }, 'ngày sinh thật không đổi');
  assert.equal(L.lives.length, 1); assert.equal(L.lives[0].cause, 'chết đói');
  const t = fresh(); AD.adState(t.L).score = 50; assert.equal(LH.judge(t.s, t.L, { lifeXp: 0, now: 1e12 }).charts.length, 3, 'Thiên đạo chọn 1 trong 3');
});
check('P21 · cõi dưới là đoạn chơi ngắn ≤ 25 phút, việc tốt rút ngắn, xong thì đầu thai Nhân đạo; Địa ngục đưa Nghiệp về Vướng Bận', () => {
  const { s, L } = fresh(); L.nghiep = 40; AD.adState(L).score = 0;
  const r = LH.judge(s, L, { lifeXp: 0, now: 1e12 }); assert.equal(r.path.id, 'diangu'); assert.ok(r.interlude.until - 1e12 <= 25 * 60000); assert.ok(L.nghiep <= 9);
  LH.shorten(L, 30, 1e12); assert.equal(LH.interludeDone(L, 1e12), true); assert.equal(L.afterlife, null);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
