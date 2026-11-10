// ============================================================================
//  TEST TÀI KHOẢN (thuần Node): chuẩn hoá email / số điện thoại, mã OTP, giới hạn tần suất, LỌC NGÀY GIỜ SINH khỏi
//  bản lưu đám mây và ghép lại khi tải về, mã công khai ổn định (giữ công thức cũ), gói hello mang vé tài khoản.
// ============================================================================
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as A from '../src/game/auth-core.js';
import { parseClient } from '../src/game/protocol.js';
import { createState } from '../src/game/state.js';

let pass = 0;
const fails = [];
const check = async (name, fn) => {
  try { await fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};

await check('chuẩn hoá email: hạ chữ thường, bỏ khoảng trắng; định dạng sai bị loại', () => {
  assert.equal(A.normEmail('  An.Nguyen@Gmail.COM '), 'an.nguyen@gmail.com');
  for (const bad of ['', 'abc', 'a@b', 'a b@c.com', '<x>@y.com', 'a@b..com'.replace('..', '.') + ' x']) assert.equal(A.normEmail(bad), null, bad);
});
await check('chuẩn hoá số điện thoại VN → E.164 (+84); số lạ / nước ngoài bị loại', () => {
  assert.equal(A.normPhone('0912 345 678'), '+84912345678');
  assert.equal(A.normPhone('84987654321'), '+84987654321');
  assert.equal(A.normPhone('+84 (0)3-123'), null);
  assert.equal(A.normPhone('+12025550123'), null);
  assert.equal(A.normPhone('0212345678'), null); // đầu số cố định
  assert.equal(A.maskKey('phone', '+84912345678'), '+849*****678');
  assert.equal(A.maskKey('email', 'an.nguyen@gmail.com'), 'an***@gmail.com');
});
await check('mã OTP 6 số ngẫu nhiên, so sánh thời gian hằng; băm có muối', async () => {
  const seen = new Set(); for (let i = 0; i < 200; i++) { const c = A.otpCode(); assert.match(c, /^\d{6}$/); seen.add(c); }
  assert.ok(seen.size > 190);
  assert.ok(A.safeEqual('abc', 'abc')); assert.ok(!A.safeEqual('abc', 'abd')); assert.ok(!A.safeEqual('abc', 'abcd'));
  assert.notEqual(await A.sha256('s1' + '123456'), await A.sha256('s2' + '123456'));
  assert.match(A.randomToken(32), /^[A-Za-z0-9_-]{43}$/);
});
await check('giới hạn gửi mã: 3 lần / 15 phút mỗi email, cửa sổ trượt mở lại sau đó', () => {
  let h = [], t = 1e12;
  for (let i = 0; i < 3; i++) { const r = A.rateCheck(h, A.OTP_LIMITS.key, t + i * 1000); assert.ok(r.ok); h = r.hits; }
  assert.equal(A.rateCheck(h, A.OTP_LIMITS.key, t + 5000).ok, false);
  assert.ok(A.rateCheck(h, A.OTP_LIMITS.key, t + 16 * 60000).ok);
});
await check('mã công khai ổn định: giữ đúng công thức cũ (nhà mua theo pid không đổi chủ); tài khoản có mã riêng', async () => {
  const old = createHash('sha256').update('huyenquan:abc12345-x').digest().subarray(0, 6).toString('hex');
  assert.equal(await A.stableId('abc12345-x'), old);
  assert.notEqual(await A.stableId(A.accountPid('u1')), await A.stableId(A.accountPid('u2')));
});
await check('LỌC NGÀY SINH: bản lưu đám mây không còn ngày giờ sinh (nhân vật, Sổ Mệnh, khách hỏi việc), giữ Dụng thần', () => {
  const s = createState();
  s.player = { name: 'Gió', birth: { y: 1995, m: 5, d: 5, h: 8, mi: 30, gender: 'nam' }, yong: { primary: '水', accent: '金', ji: '火' }, robe: '水' };
  s.profiles = [{ id: 'p1', label: 'Bản thân', year: 1995, month: 5, day: 5, hour: 8, minute: 30, gender: 'nam' }, { id: 'p2', label: 'Mẹ', year: 1970, month: 1, day: 2, hour: null, minute: null, gender: 'nữ' }];
  s.caseLog = [{ npc: { call: 'bác Ba', year: 1960, month: 3, day: 9, hour: 7 }, score: 80 }];
  s.cloud = { uid: 'x', rev: 3 };
  const c = A.cloudBody(s);
  assert.equal(A.hasBirth(c), false);
  assert.equal(c.player.birth, undefined); assert.deepEqual(c.player.yong, s.player.yong);
  assert.equal(c.profiles[0].label, 'Bản thân'); assert.equal(c.profiles[0].year, undefined); assert.equal(c.profiles[0].gender, 'nam');
  assert.equal(c.caseLog[0].npc.year, undefined); assert.equal(c.caseLog[0].score, 80);
  assert.equal(c.cloud, undefined, 'khoá chỉ dùng trên máy không lên mây');
  assert.ok(!JSON.stringify(c).includes('1995'));
  assert.ok(A.hasBirth(s));
});
await check('tải về máy cũ: ghép lại ngày sinh trên máy; máy mới thiếu ngày sinh → phải nhập lại', () => {
  const local = { player: { name: 'Gió', birth: { y: 1995, m: 5, d: 5 } }, profiles: [{ id: 'p1', label: 'Bản thân', year: 1995, month: 5, day: 5, hour: 8, minute: 30 }, { id: 'p9', label: 'Mới', year: 2001, month: 1, day: 1 }] };
  const cloud = { player: { name: 'Gió', yong: { primary: '水' } }, profiles: [{ id: 'p1', label: 'Bản thân', gender: 'nam' }], phucKhi: 900 };
  const m = A.mergeCloud(cloud, local);
  assert.equal(m.player.birth.y, 1995); assert.equal(m.profiles[0].year, 1995); assert.equal(m.profiles[0].gender, 'nam'); assert.equal(m.phucKhi, 900);
  assert.ok(m.profiles.some((p) => p.id === 'p9'), 'hồ sơ chỉ có trên máy được giữ');
  assert.ok(A.needsBirth(A.mergeCloud(cloud, {})));
  assert.ok(!A.needsBirth(m));
});
await check('gói hello: nhận vé tài khoản đúng dạng, bỏ vé sai dạng (vẫn vào như khách)', () => {
  const ok = parseClient(JSON.stringify({ t: 'hello', name: 'Gió', pid: 'abc12345', tok: A.randomToken(24) }));
  assert.ok(ok.tok);
  const bad = parseClient(JSON.stringify({ t: 'hello', name: 'Gió', pid: 'abc12345', tok: 'x"; drop' }));
  assert.equal(bad.tok, null); assert.equal(bad.pid, 'abc12345');
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
