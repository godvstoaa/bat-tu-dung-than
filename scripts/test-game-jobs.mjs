// ============================================================================
//  TEST P2 — VIỆC LÀM THEO MỆNH: luật thuần (jobs.js) + sổ máy chủ (guild-core.js, chạy với MemStore).
//  hệ số mệnh / bậc / cung · cân bằng 2 ca ≈ ngày sống tối thiểu · trần chỗ làm · ca, bỏ ca, tự đóng ca ·
//  chống treo máy (nhanh quá, nhịp đều, điểm đẹp quá) · vị trí · phu áp hàng · mạch quặng cạn / hồi · khoá Dụng thần.
//    node scripts/test-game-jobs.mjs
// ============================================================================
import assert from 'node:assert/strict';
import * as J from '../src/game/jobs.js';
import * as P from '../src/game/protocol.js';
import * as JZ from '../src/game/jobzones.js';
import { GuildEngine, MemStore, workplaces, workplace, postRing, nextPost, postDist, ORE_NODES, ORE, CMINE, YONG_LOCK_MS } from '../src/game/guild-core.js';

let pass = 0;
const fails = [];
const check = async (name, fn) => {
  try { await fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}\n      ${e.stack?.split('\n').slice(0, 3).join('\n      ')}`); }
};
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const H = 3600000, MIN = 60000;
const T0 = Date.UTC(2026, 10, 10, 2, 0, 0); // 9 giờ sáng giờ Việt Nam
// rand tất định: không rủi ro (0.99) trừ khi test cần
const safe = () => 0.99;
const W = workplaces();
const shopOf = (type) => [...W.values()].find((w) => w.type === type);
const center = (k) => ({ x: workplace(k).room.x, z: workplace(k).room.z });
const fire = shopOf('tuu'), pot = shopOf('gom'), herb = shopOf('duoc'), post = shopOf('dichtram');
const yongFire = { primary: '火', accent: '木', ji: '水' };
const yongNeutral = { primary: '木', accent: '水', ji: '金' }; // Hỏa / Thổ bình thường

console.log('Luật nghề (jobs.js)');
await check('31 nghề = 30 nghề đặc tả §4.2 (6 mỗi hành) + cân trà; mọi loại tiệm (15) tuyển người; nghề ngoài tiệm có khu làm thật', () => {
  const per = {}; for (const w of Object.values(J.WORK)) per[w.wx] = (per[w.wx] || 0) + 1;
  assert.equal(Object.keys(J.WORK).length, 31);
  for (const wx of ['木', '火', '土', '金', '水']) assert.ok(per[wx] >= 6, wx);
  const Z = JZ.zones(); for (const w of Object.values(J.WORK)) if (w.zone) assert.ok(Z[w.id] && (Z[w.id].spots.length || Z[w.id].rooms?.length), w.id);
  assert.deepEqual(Object.keys(J.WORK).sort(), [...P.JOB_IDS].sort());
  for (const [t, j] of Object.entries(J.JOB_OF_SHOP)) { assert.equal(J.WORK[j].shop, t); assert.ok(J.SEATS[t]?.length === 4, t); assert.ok(['fire', 'herbs', 'wheel', 'ore', 'deliver'].includes(J.WORK[j].game)); }
  for (const w of Object.values(J.WORK)) if (w.theme?.items && w.game === 'herbs') assert.ok(w.theme.items.length >= 12, w.id);
  const n = (t) => [...W.values()].filter((w) => w.type === t).length;
  // v4 (thành ×10): mỗi lô mặt phố lớn là tiệm — hàng trăm chỗ làm mỗi loại, 16 dịch trạm (mỗi khu Trung / Ngoại một trạm)
  for (const t of ['tuu', 'duoc', 'gom', 'loren']) assert.ok(n(t) >= 100, `${t}: ${n(t)}`);
  assert.equal(n('dichtram'), 16);
  assert.equal(postRing().length, 16);
});
await check('nghề ngoài tiệm: chỉ vào ca / làm việc trong khu làm (bến, rừng, cổng, phòng tiệm); pháo hoa chỉ đêm rằm 18–23 giờ', async () => {
  const g = new GuildEngine(new MemStore()), now = Date.parse('2026-06-10T03:00:00Z');
  const dock = JZ.zones().laido.spots[0];
  assert.equal((await g.start('U', 'laido', null, null, { x: 0, z: 0 }, now)).err, 'far');
  const s = await g.start('U', 'laido', null, null, { x: dock.x + 3, z: dock.z }, now); assert.ok(s.ok);
  const t = s.shift.task;
  assert.equal((await g.task('U', { seed: t.seed, score: 0.8 }, { x: 0, z: 0 }, now + 20000)).err, 'far');
  assert.ok((await g.task('U', { seed: t.seed, score: 0.8 }, { x: dock.x, z: dock.z }, now + 20000)).ok);
  const W = workplaces(), tuu = [...W.values()].find((w) => w.type === 'tuu');
  assert.ok(JZ.inZone('hamruou', { x: tuu.room.x, z: tuu.room.z }), 'ủ rượu trong phòng Tửu Lâu');
  assert.ok(!JZ.inZone('hamruou', { x: dock.x, z: dock.z }));
  // trăng tròn 2026-06-29 ~23:57 UTC → rằm; 20 giờ VN là 13:00 UTC
  assert.ok(JZ.isRam(Date.parse('2026-06-29T13:00:00Z')) && !JZ.isRam(Date.parse('2026-06-15T13:00:00Z')));
  assert.ok(JZ.open('phaohoa', Date.parse('2026-06-29T13:00:00Z'))); assert.ok(!JZ.open('phaohoa', Date.parse('2026-06-29T03:00:00Z')));
  const ph = JZ.zones().phaohoa.spots[0];
  assert.equal((await g.start('V', 'phaohoa', null, null, { x: ph.x, z: ph.z }, Date.parse('2026-06-15T13:00:00Z'))).err, 'closed');
  assert.ok((await g.start('V', 'phaohoa', null, null, { x: ph.x, z: ph.z }, Date.parse('2026-06-29T13:00:00Z'))).ok);
});
await check('bậc tay nghề: Học việc → Thợ (100) → Thợ cả (400) → Quản sự (1200, uy tín ≥ 60); nghề Kỵ dừng ở Thợ', () => {
  assert.equal(J.rankOf(0), 0); assert.equal(J.rankOf(100), 1); assert.equal(J.rankOf(400), 2); assert.equal(J.rankOf(1200, 50), 2); assert.equal(J.rankOf(1200, 60), 3);
  assert.equal(J.rankOf(5000, 90, 'ky'), 1);
});
await check('tiền một việc: Dụng ×2 (Thợ cả ×2,5) · Hỷ ×1,3 · Kỵ ×0,5 và trần hiệu suất 0,6 · cung sinh hành nghề +10% · bệnh ×0,7', () => {
  const b = J.WORK.bep, p = (o) => J.taskPay(b, 0.5, o).pay;
  const base = p({});
  assert.ok(near(p({ rel: 'dung' }), base * 2)); assert.ok(near(p({ rel: 'dung', rank: 2 }), base * 2.5 * 1.25 / 0.8));
  assert.ok(near(p({ rel: 'hy' }), base * 1.3));
  assert.equal(J.taskPay(b, 1, { rel: 'ky' }).perf, 0.6);
  assert.ok(near(p({ palace: J.palaceBonus('木', '火') }), base * 1.1)); assert.equal(J.palaceBonus('水', '火'), 1);
  assert.ok(near(p({ sick: true }), base * 0.7));
  assert.ok(J.taskPay(b, 0.5, { chain: 5 }).perf > J.taskPay(b, 0.5, {}).perf);
});
await check('CÂN BẰNG: Học việc, mệnh bình thường, hiệu suất 1,0, 2 ca × 8 việc ≈ ngày sống tối thiểu (78–90 văn) ở mọi nghề', () => {
  const score = (1 - 0.3) / 1.2;
  for (const job of Object.values(J.WORK)) {
    const day = 16 * J.taskPay(job, score, { rank: 0 }).pay;
    assert.ok(day >= 76 && day <= 98, `${job.name}: ${day.toFixed(1)} văn`);
  }
});
await check('chống treo máy: nhịp đều (độ lệch < 0,12 s) bị nghi; người thật lệch vài giây thì không; điểm tuyệt đối 8/10 việc bị kẹp', () => {
  assert.equal(J.botLike([30000, 30050, 30010, 29990, 30030, 30020]), true);
  assert.equal(J.botLike([31000, 28000, 35000, 30500, 29000, 33000]), false);
  assert.equal(J.tooPerfect([1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.6]), true); assert.equal(J.tooPerfect([1, 1, 0.8, 0.7, 1, 0.9]), false);
});

console.log('Sổ việc làm (guild-core.js)');
await check('xin việc: bậc theo tay nghề, mỗi người một chỗ, hết chỗ thì báo đầy', async () => {
  const G = new GuildEngine(new MemStore());
  assert.equal((await G.apply('a', 'A', fire.k, 1, yongNeutral, T0)).err, 'rank'); // chưa đủ tay nghề làm Thợ
  const r = await G.apply('a', 'A', fire.k, 0, yongNeutral, T0); assert.ok(r.ok); assert.equal(r.contract.r, 0);
  assert.equal((await G.apply('a', 'A', pot.k, 0, yongNeutral, T0)).err, 'have');
  for (const u of ['b', 'c']) assert.ok((await G.apply(u, u, fire.k, 0, null, T0)).ok);
  assert.equal((await G.apply('d', 'D', fire.k, 0, null, T0)).err, 'full'); // tửu lâu 3 chỗ Học việc
  const bd = await G.board(fire.k, 'a', T0);
  assert.equal(bd.holders.length, 3); assert.equal(bd.holders.filter((h) => h[3]).length, 1); assert.deepEqual(bd.layout, [3, 3, 1, 1]);
  assert.equal((await G.apply('x', 'X', 9999, 0, null, T0)).err, 'bad');
});
await check('vào ca: phải giữ chỗ đúng tiệm, đứng trong tiệm; không chồng ca; tối đa 3 ca / ngày', async () => {
  const G = new GuildEngine(new MemStore());
  assert.equal((await G.start('a', 'bep', fire.k, null, center(fire.k), T0)).err, 'noseat');
  await G.apply('a', 'A', fire.k, 0, yongNeutral, T0);
  assert.equal((await G.start('a', 'bep', fire.k, null, { x: 0, z: 0 }, T0)).err, 'far');
  assert.equal((await G.start('a', 'gom', fire.k, null, center(fire.k), T0)).err, 'bad');
  const s = await G.start('a', 'bep', fire.k, null, center(fire.k), T0, safe); assert.ok(s.ok); assert.equal(s.shift.max, 8); assert.ok(s.shift.task.seed);
  assert.equal((await G.start('a', 'bep', fire.k, null, center(fire.k), T0 + 1000)).err, 'busy');
  await G.end('a', T0 + 2000);
  await G.start('a', 'bep', fire.k, null, center(fire.k), T0 + 3000); await G.end('a', T0 + 4000);
  await G.start('a', 'bep', fire.k, null, center(fire.k), T0 + 5000); await G.end('a', T0 + 6000);
  assert.equal((await G.start('a', 'bep', fire.k, null, center(fire.k), T0 + 7000)).err, 'daycap');
  assert.ok((await G.start('a', 'bep', fire.k, null, center(fire.k), T0 + 24 * H)).ok, 'sang ngày mới thì làm tiếp');
});
await check('làm việc: sai mã việc / nhanh quá / ra khỏi tiệm bị từ chối; máy chủ tự tính tiền theo mệnh; đủ 8 việc tự tan ca và ghi sổ', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', fire.k, 0, yongFire, T0);
  const s = await G.start('a', 'bep', fire.k, yongFire, center(fire.k), T0, safe);
  assert.equal(s.shift.rel, 'dung');
  let task = s.shift.task, t = T0, total = 0, last;
  assert.equal((await G.task('a', { seed: task.seed + 1, score: 0.6 }, center(fire.k), t + 30000, safe)).err, 'seed');
  assert.equal((await G.task('a', { seed: task.seed, score: 0.6 }, center(fire.k), t + 5000, safe)).err, 'fast');
  assert.equal((await G.task('a', { seed: task.seed, score: 0.6 }, { x: 0, z: 0 }, t + 30000, safe)).err, 'far');
  const gaps = [31000, 27000, 36000, 29500, 41000, 26000, 33000, 38000];
  for (let i = 0; i < 8; i++) {
    t += gaps[i];
    last = await G.task('a', { seed: task.seed, score: 0.5 + i * 0.03 }, center(fire.k), t, safe);
    assert.ok(last.ok, `việc ${i + 1}: ${last.err}`); total += last.pay; task = last.task;
  }
  assert.ok(last.end && last.end.ok && !last.end.quit); assert.equal(last.end.n, 8);
  assert.ok(Math.abs(last.end.paid - total) <= 1, `${last.end.paid} ≈ ${total}`);
  const expect = 8 * J.taskPay(J.WORK.bep, 0.6, { rel: 'dung', rank: 0, palace: J.palaceBonus(fire.wx, '火') }).pay;
  assert.ok(Math.abs(last.end.paid - expect) < 15, `Dụng thần: ${last.end.paid} ~ ${expect.toFixed(0)}`);
  const me = await G.me('a', t + 1000); assert.equal(me.shift, null); assert.equal(me.owed, 0); assert.ok(me.career.skill.bep >= 8);
  assert.equal(me.career.rep, 51);
});
await check('bỏ ca (tan ca sớm với < 4 việc): nhận 50%, uy tín −5; ca trọn: uy tín +1', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', pot.k, 0, null, T0);
  const s = await G.start('a', 'gom', pot.k, null, center(pot.k), T0, safe);
  const r = await G.task('a', { seed: s.shift.task.seed, score: 0.6 }, center(pot.k), T0 + 20000, safe);
  const e = await G.end('a', T0 + 40000);
  assert.equal(e.quit, true); assert.equal(e.paid, Math.floor(r.purse * 0.5)); assert.equal(e.rep, 45);
});
await check('rớt mạng: ca hết giờ máy chủ tự đóng (không tính bỏ ca), tiền chờ nhận một lần', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', herb.k, 0, null, T0);
  const s = await G.start('a', 'boc', herb.k, null, center(herb.k), T0, safe);
  await G.task('a', { seed: s.shift.task.seed, score: 0.7 }, center(herb.k), T0 + 20000, safe);
  const me = await G.me('a', T0 + 31 * MIN);
  assert.equal(me.shift, null); assert.ok(me.owed > 0);
  const c1 = await G.claim('a'), c2 = await G.claim('a');
  assert.equal(c1.amt, me.owed); assert.equal(c2.amt, 0);
});
await check('rủi ro: Kỵ thần dễ gặp nạn; hỏng hàng bồi 2 lần giá việc vào tiền ca, bị phạt trừ uy tín', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', pot.k, 0, { primary: '木', accent: '水', ji: '土' }, T0);
  const s = await G.start('a', 'gom', pot.k, null, center(pot.k), T0, safe);
  assert.equal(s.shift.rel, 'ky');
  const ok = await G.task('a', { seed: s.shift.task.seed, score: 0.9 }, center(pot.k), T0 + 20000, safe);
  assert.ok(ok.purse > 0 || ok.pay > 0); assert.ok(ok.perf <= 0.6);
  let seq = [0.05, 0.5]; // trúng rủi ro (0,05 < 8%), loại «hỏng hàng» (0,4 ≤ 0,5 < 0,8)
  const hong = await G.task('a', { seed: ok.task.seed, score: 0.9 }, center(pot.k), T0 + 50000, () => seq.shift() ?? 0.99);
  assert.equal(hong.mishap, 'hong'); assert.ok(hong.pay < 0); assert.equal(hong.purse, 0);
  seq = [0.05, 0.9];
  const phat = await G.task('a', { seed: hong.task.seed, score: 0.9 }, center(pot.k), T0 + 77000, () => seq.shift() ?? 0.99);
  assert.equal(phat.mishap, 'phat');
  const me = await G.me('a', T0 + 80000); assert.equal(me.career.rep, 49);
});
await check('chống treo máy trên máy chủ: 6 việc nhịp đều → việc thứ 6 không được tính, ghi cờ', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', herb.k, 0, null, T0);
  let r = await G.start('a', 'boc', herb.k, null, center(herb.k), T0, safe), task = r.shift.task, t = T0, bot = null;
  for (let i = 0; i < 6; i++) { t += 20000 + (i % 2) * 30; r = await G.task('a', { seed: task.seed, score: 0.6 }, center(herb.k), t, safe); if (!r.ok) { bot = r; break; } task = r.task; }
  assert.ok(bot && bot.err === 'bot', 'phải bị nghi bot'); assert.ok(bot.task.seed);
});
await check('điểm «đẹp quá» liên tục bị kẹp 0,85', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', herb.k, 0, null, T0);
  let r = await G.start('a', 'boc', herb.k, null, center(herb.k), T0, safe), task = r.shift.task, t = T0;
  const gaps = [21000, 25000, 19000, 30000, 22000, 28000, 24000, 35000];
  for (let i = 0; i < 8; i++) { t += gaps[i]; r = await G.task('a', { seed: task.seed, score: 1 }, center(herb.k), t, safe); assert.ok(r.ok, r.err); task = r.task; if (i >= 7) assert.equal(r.score, 0.85); }
});
await check('phu dịch trạm: hàng đi sang trạm kế bên, giao sai chỗ bị từ chối, nhanh hơn 12 m/s bị từ chối', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', post.k, 0, null, T0);
  const s = await G.start('a', 'phu', post.k, null, center(post.k), T0, () => 0.2);
  const t = s.shift.task;
  assert.equal(t.from, post.k); assert.equal(t.dest, nextPost(post.k, -1)); assert.ok(postDist(t.from, t.dest) > 150);
  assert.ok(near(t.minMs, Math.round(postDist(t.from, t.dest) / 12 * 1000), 1));
  assert.equal((await G.task('a', { seed: t.seed, score: 0.7 }, center(t.dest), T0 + t.minMs - 2000, safe)).err, 'fast');
  assert.equal((await G.task('a', { seed: t.seed, score: 0.7 }, center(post.k), T0 + t.minMs + 30000, safe)).err, 'far');
  const ok = await G.task('a', { seed: t.seed, score: 0.7 }, center(t.dest), T0 + t.minMs + 30000, () => 0.7);
  assert.ok(ok.ok); assert.equal(ok.task.from, t.dest); // chuyến sau đi tiếp từ trạm vừa giao
});
await check('thợ mỏ: không cần chỗ làm nhưng phải ở trong mỏ dân sự, cạnh mạch; mạch 3 lần thì cạn, 4 phút hồi một lần', async () => {
  const G = new GuildEngine(new MemStore());
  const inMine = { x: CMINE.x, z: CMINE.z };
  assert.equal((await G.start('a', 'mo', null, null, { x: 0, z: 0 }, T0)).err, 'far');
  let r = await G.start('a', 'mo', null, null, inMine, T0, safe); assert.ok(r.ok); let task = r.shift.task, t = T0;
  const node = ORE_NODES[0], at = { x: node.x + 1, z: node.z };
  assert.equal((await G.task('a', { seed: task.seed, score: 0.6, node: node.id }, inMine, t + 20000, safe)).err, 'far');
  for (let i = 0; i < ORE.charges; i++) { t += 15000 + i * 3000; r = await G.task('a', { seed: task.seed, score: 0.6, node: node.id }, at, t, safe); assert.ok(r.ok, r.err); task = r.task; }
  t += 12000;
  assert.equal((await G.task('a', { seed: task.seed, score: 0.6, node: node.id }, at, t, safe)).err, 'empty');
  const o = await G.ores(t + ORE.regenMs + 1000); assert.ok(o[node.id][0] >= 1);
});
await check('giữ chỗ: quá 24 giờ không vào ca thì mất chỗ và uy tín −3; gia hạn chỉ khi vừa đi làm', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', fire.k, 0, null, T0);
  assert.equal((await G.renew('a', T0 + 1000)).err, 'idle');
  const b = await G.board(fire.k, 'z', T0 + 25 * H);
  assert.equal(b.holders.length, 0);
  const me = await G.me('a', T0 + 25 * H); assert.equal(me.contract, null); assert.equal(me.career.rep, 47);
  // đi làm đều thì gia hạn được
  await G.apply('b', 'B', fire.k, 0, null, T0);
  const s = await G.start('b', 'bep', fire.k, null, center(fire.k), T0 + H, safe);
  let task = s.shift.task, t = T0 + H;
  for (const g of [25000, 31000, 22000, 40000]) { t += g; const r = await G.task('b', { seed: task.seed, score: 0.6 }, center(fire.k), t, safe); task = r.task; }
  await G.end('b', t + 1000);
  const rn = await G.renew('b', t + 2000); assert.ok(rn.ok); assert.ok(rn.contract.until > T0 + J.SHIFT.holdMs);
  const q = await G.quit('b', t + 3000); assert.ok(q.ok); assert.equal((await G.board(fire.k, 'z', t + 4000)).holders.length, 0);
});
await check('Dụng thần khai báo: lần đầu nhận, đổi lại phải chờ 30 ngày', async () => {
  const G = new GuildEngine(new MemStore());
  await G.apply('a', 'A', fire.k, 0, yongFire, T0);
  await G.quit('a', T0 + 1);
  await G.apply('a', 'A', fire.k, 0, yongNeutral, T0 + 2);
  let me = await G.me('a', T0 + 3);
  assert.equal(me.career.rel, undefined); assert.equal(me.yongLocked, true);
  const s = await G.start('a', 'bep', fire.k, yongNeutral, center(fire.k), T0 + 10, safe); assert.equal(s.shift.rel, 'dung');
  await G.end('a', T0 + 20); await G.quit('a', T0 + 30);
  await G.apply('a', 'A', fire.k, 0, yongNeutral, T0 + YONG_LOCK_MS + 1);
  const s2 = await G.start('a', 'bep', fire.k, yongNeutral, center(fire.k), T0 + YONG_LOCK_MS + 10, safe); assert.equal(s2.shift.rel, 'thuong');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
