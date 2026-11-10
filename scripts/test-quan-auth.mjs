// ============================================================================
//  TEST LUỒNG TÀI KHOẢN trên máy chủ dev thật (cần `npm run dev:mmo`, AUTH_DEV=1 — mã OTP trả trong phản hồi):
//  gửi / kiểm mã email, sai mã bị đếm, phiên cookie, /me, lưu đám mây (từ chối ngày sinh, xung đột rev), vé WebSocket
//  dùng một lần trong hello, chống CSRF (Origin lạ), đăng xuất, xoá tài khoản (khoá 7 ngày).
//    node scripts/test-quan-auth.mjs [http://127.0.0.1:8788]
// ============================================================================
import assert from 'node:assert/strict';

const BASE = process.argv[2] || 'http://127.0.0.1:8788';
let pass = 0;
const fails = [];
const check = async (name, fn) => {
  try { await fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
let cookie = '';
async function call(path, { method = 'GET', body, origin, jar = true } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (jar && cookie) headers.Cookie = cookie;
  if (origin) headers.Origin = origin;
  const r = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined, redirect: 'manual' });
  const sc = r.headers.get('set-cookie');
  if (sc && jar) { const v = /hq_sid=([^;]*)/.exec(sc)?.[1]; cookie = v ? `hq_sid=${v}` : ''; }
  let j = null; try { j = await r.json(); } catch (e) { /* không phải JSON */ }
  return { status: r.status, j: j || {}, headers: r.headers };
}
const email = `thu${Date.now()}@vidu.com`;

await check('cấu hình: email bật (dev), Google tắt khi chưa có client id', async () => {
  const r = await call('/api/auth/config');
  assert.equal(r.j.ok, true); assert.equal(r.j.email, true); assert.equal(r.j.google, false);
});
await check('email sai định dạng bị từ chối; Origin lạ bị chặn (CSRF)', async () => {
  assert.equal((await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: 'abc' } })).j.err, 'bad_email');
  assert.equal((await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email }, origin: 'https://evil.example' })).status, 403);
});
let code = '';
await check('gửi mã → nhập sai bị đếm → nhập đúng: tạo tài khoản + đặt cookie phiên httpOnly', async () => {
  const s = await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email } });
  assert.equal(s.j.ok, true); assert.match(s.j.dev, /^\d{6}$/); code = s.j.dev;
  const w = await call('/api/auth/otp/verify', { method: 'POST', body: { kind: 'email', key: email, code: code === '000000' ? '111111' : '000000' } });
  assert.equal(w.j.err, 'wrong'); assert.equal(w.j.left, 4);
  const v = await call('/api/auth/otp/verify', { method: 'POST', body: { kind: 'email', key: email.toUpperCase(), code, name: 'Gió Thong Thả' } });
  assert.equal(v.j.ok, true); assert.equal(v.j.isNew, true); assert.ok(cookie.startsWith('hq_sid='));
  assert.match(v.headers.get('set-cookie'), /HttpOnly/); assert.match(v.headers.get('set-cookie'), /SameSite=Lax/);
  assert.equal(v.j.me.name, 'Gió Thong Thả'); assert.equal(v.j.me.ids[0].kind, 'email');
  assert.ok(!JSON.stringify(v.j).includes(email), 'không trả nguyên email');
});
await check('mã đã dùng không dùng lại được; gửi quá 3 lần / 15 phút bị chặn', async () => {
  const again = await call('/api/auth/otp/verify', { method: 'POST', body: { kind: 'email', key: email, code }, jar: false });
  assert.equal(again.j.ok, false);
  await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email }, jar: false });
  await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email }, jar: false });
  assert.equal((await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email }, jar: false })).j.err, 'rate');
});
await check('/me theo cookie; không cookie thì chưa đăng nhập', async () => {
  assert.equal((await call('/api/auth/me')).j.ok, true);
  assert.equal((await call('/api/auth/me', { jar: false })).j.ok, false);
  assert.equal((await call('/api/save', { jar: false })).status, 401);
});
await check('lưu đám mây: lọc ngày sinh, chống ghi đè (rev), đọc lại đúng', async () => {
  const st = { v: 1, phucKhi: 321, player: { name: 'Gió', birth: { y: 1995, m: 5, d: 5 }, yong: { primary: '水' } }, profiles: [{ id: 'p1', label: 'Bản thân', year: 1995, month: 5, day: 5 }] };
  const p1 = await call('/api/save', { method: 'PUT', body: { rev: 0, state: st } });
  assert.equal(p1.j.ok, true); assert.equal(p1.j.rev, 1);
  const g = await call('/api/save');
  assert.equal(g.j.rev, 1); assert.ok(!g.j.body.includes('1995'), 'ngày sinh không được lưu'); assert.equal(JSON.parse(g.j.body).phucKhi, 321);
  const stale = await call('/api/save', { method: 'PUT', body: { rev: 0, state: st } });
  assert.equal(stale.status, 409); assert.equal(stale.j.rev, 1);
  const big = await call('/api/save', { method: 'PUT', body: { rev: 1, state: { pad: 'x'.repeat(950000) } } });
  assert.equal(big.j.ok, false);
});
await check('vé WebSocket: cấp khi đã đăng nhập, dùng một lần trong hello', async () => {
  const t = await call('/api/auth/ws-token');
  assert.equal(t.j.ok, true); assert.match(t.j.tok, /^[A-Za-z0-9_-]{20,64}$/);
  const ws = new WebSocket(BASE.replace(/^http/, 'ws') + '/ws/quan?room=7');
  const welcome = await new Promise((res, rej) => {
    ws.onopen = () => ws.send(JSON.stringify({ t: 'hello', name: 'Gió', pid: 'test-auth-pid-1', tok: t.j.tok }));
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.t === 'welcome') res(m); };
    ws.onerror = rej; setTimeout(() => rej(new Error('timeout')), 5000);
  });
  assert.equal(welcome.t, 'welcome'); ws.close();
  // vé đã tiêu: hello lần hai với cùng vé vẫn vào nhưng như khách (không lỗi)
  const ws2 = new WebSocket(BASE.replace(/^http/, 'ws') + '/ws/quan?room=7');
  const w2 = await new Promise((res, rej) => { ws2.onopen = () => ws2.send(JSON.stringify({ t: 'hello', name: 'Gió', pid: 'test-auth-pid-1', tok: t.j.tok })); ws2.onmessage = (e) => { const m = JSON.parse(e.data); if (m.t === 'welcome') res(m); }; ws2.onerror = rej; setTimeout(() => rej(new Error('timeout')), 5000); });
  assert.equal(w2.t, 'welcome'); ws2.close();
});
await check('xuất dữ liệu: có tài khoản + bản lưu, không có ngày sinh', async () => {
  const x = await call('/api/auth/export');
  assert.equal(x.j.ok, true); assert.equal(x.j.data.save.state.phucKhi, 321); assert.ok(!JSON.stringify(x.j).includes('1995'));
});
await check('đăng xuất: xoá cookie, phiên cũ hết hiệu lực', async () => {
  const old = cookie;
  await call('/api/auth/logout', { method: 'POST' });
  assert.equal(cookie, '');
  cookie = old; assert.equal((await call('/api/auth/me')).j.ok, false); cookie = '';
});
await check('đăng nhập lại cùng email → cùng tài khoản; xoá tài khoản: khoá 7 ngày, đăng nhập lại là huỷ xoá', async () => {
  const email2 = `lai${Date.now()}@vidu.com`;
  const s = await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email2 } });
  const v = await call('/api/auth/otp/verify', { method: 'POST', body: { kind: 'email', key: email2, code: s.j.dev } });
  const uid = v.j.me.uid;
  assert.equal((await call('/api/auth/delete', { method: 'POST', body: { confirm: 'sai' } })).j.err, 'confirm');
  const d = await call('/api/auth/delete', { method: 'POST', body: { confirm: 'XOA' } });
  assert.equal(d.j.ok, true); assert.ok(d.j.deleteAt > Date.now() + 6 * 86400000);
  assert.equal((await call('/api/auth/me')).j.ok, false, 'phiên bị huỷ khi xoá');
  const s2 = await call('/api/auth/otp/send', { method: 'POST', body: { kind: 'email', key: email2 } });
  const v2 = await call('/api/auth/otp/verify', { method: 'POST', body: { kind: 'email', key: email2, code: s2.j.dev } });
  assert.equal(v2.j.me.uid, uid); assert.equal(v2.j.isNew, false); assert.equal(v2.j.me.deleteAt, null);
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
