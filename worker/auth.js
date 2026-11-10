// ============================================================================
//  /api/auth/* + /api/save — đăng nhập không mật khẩu (Google OAuth + PKCE, mã OTP email / SMS), phiên cookie
//  httpOnly, vé WebSocket, bản lưu đám mây (đã lọc ngày giờ sinh), xoá / xuất dữ liệu.
//  Sổ: Durable Object Accounts (worker/accounts.js). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §1.
//
//  Biến môi trường (wrangler secret put …):
//    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET   — OAuth client (Google Cloud Console), redirect: <origin>/api/auth/google/callback
//    RESEND_API_KEY, MAIL_FROM                — gửi mã qua email (vd MAIL_FROM = "Huyền Quán <no-reply@god8.shop>")
//    SMS_* (chưa chọn nhà cung cấp)           — gửi mã qua SMS; chưa có thì đăng nhập số điện thoại tắt
//    PUBLIC_ORIGIN (tuỳ chọn)                 — origin công khai để dựng redirect URI (mặc định origin của request)
//    AUTH_DEV = "1"                           — CHỈ máy dev (npm run dev:mmo): trả mã OTP trong phản hồi thay vì gửi
// ============================================================================
import * as A from '../src/game/auth-core.js';

const COOKIE = 'hq_sid';
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
const accounts = (env) => env.ACCOUNTS.get(env.ACCOUNTS.idFromName('accounts'));
const dev = (env) => env.AUTH_DEV === '1';

function cookieOf(request, name) {
  for (const part of (request.headers.get('Cookie') || '').split(';')) {
    const i = part.indexOf('='); if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}
function setCookie(url, value, maxAge) {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
const originOf = (env, url) => (env.PUBLIC_ORIGIN || url.origin).replace(/\/$/, '');
// POST có cookie: chỉ nhận từ cùng origin (chống CSRF; SameSite=Lax là lớp thứ hai)
function sameOrigin(request, env, url) {
  const o = request.headers.get('Origin');
  return !o || o === url.origin || o === originOf(env, url) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o);
}
async function body(request) { try { return await request.json(); } catch (e) { return {}; } }
async function ipHash(request) { return (await A.sha256('ip:' + (request.headers.get('CF-Connecting-IP') || 'local'))).slice(0, 24); }

export async function sessionOf(request, env) {
  const sid = cookieOf(request, COOKIE);
  if (!sid) return null;
  const uid = await accounts(env).sessionUid(sid);
  return uid ? { sid, uid } : null;
}
async function startSession(env, url, uid, payload = {}) {
  const st = accounts(env);
  const { sid, maxAge } = await st.createSession(uid);
  return json({ ok: true, me: await st.me(uid), ...payload }, 200, { 'Set-Cookie': setCookie(url, sid, maxAge) });
}

// --- gửi mã -----------------------------------------------------------------
async function sendEmail(env, to, code) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM, to: [to], subject: `Mã đăng nhập Huyền Quán: ${code}`,
      text: `Mã đăng nhập Huyền Quán của bạn là ${code}. Mã có hiệu lực 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua thư này.`,
      html: `<p>Mã đăng nhập <b>Huyền Quán</b> của bạn:</p><p style="font-size:28px;letter-spacing:6px;font-weight:700">${code}</p><p>Mã có hiệu lực 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua thư này.</p>`,
    }),
  });
  return r.ok;
}
const channel = (env, kind) => (kind === 'email' ? !!(env.RESEND_API_KEY && env.MAIL_FROM) : false) || dev(env); // SMS: chưa có nhà cung cấp

export async function handleAuth(request, env, url) {
  if (!env.ACCOUNTS) return json({ ok: false, err: 'off' }, 503);
  const p = url.pathname, method = request.method;
  if (method === 'POST' && !sameOrigin(request, env, url)) return json({ ok: false, err: 'origin' }, 403);
  const st = accounts(env);

  if (p === '/api/auth/config') return json({ ok: true, google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET), email: channel(env, 'email'), phone: channel(env, 'phone'), dev: dev(env) });

  if (p === '/api/auth/me') {
    const s = await sessionOf(request, env);
    return json(s ? { ok: true, me: await st.me(s.uid) } : { ok: false });
  }

  // --- mã OTP: gửi / kiểm ---------------------------------------------------
  if (p === '/api/auth/otp/send' && method === 'POST') {
    const b = await body(request), kind = b.kind, key = A.normKey(kind, b.key);
    if (!key) return json({ ok: false, err: kind === 'phone' ? 'bad_phone' : 'bad_email' }, 400);
    if (!channel(env, kind)) return json({ ok: false, err: kind === 'phone' ? 'sms_off' : 'mail_off' }, 503);
    const r = await st.otpSend(kind, key, await ipHash(request));
    if (!r.ok) return json(r, 429);
    if (dev(env)) return json({ ok: true, dev: r.code }); // máy dev: hiện mã ngay (không gửi thật)
    const sent = kind === 'email' ? await sendEmail(env, key, r.code) : false;
    return sent ? json({ ok: true }) : json({ ok: false, err: 'send_failed' }, 502);
  }
  if (p === '/api/auth/otp/verify' && method === 'POST') {
    const b = await body(request), kind = b.kind, key = A.normKey(kind, b.key);
    if (!key) return json({ ok: false, err: 'bad' }, 400);
    const c = await st.otpCheck(kind, key, String(b.code || '').trim());
    if (!c.ok) return json(c, 400);
    const s = await sessionOf(request, env);
    if (b.link && s) { const l = await st.link(s.uid, kind, key); return json(l.ok ? { ok: true, me: await st.me(s.uid) } : l, l.ok ? 200 : 409); }
    const r = await st.login(kind, key, String(b.name || '').slice(0, 24));
    return r.ok ? startSession(env, url, r.uid, { isNew: r.isNew }) : json(r, 400);
  }

  // --- Google OAuth 2.0 (Authorization Code + PKCE) --------------------------
  if (p === '/api/auth/google/start') {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return json({ ok: false, err: 'google_off' }, 503);
    const state = A.randomToken(18), verifier = A.randomToken(48);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const s = url.searchParams.get('link') === '1' ? await sessionOf(request, env) : null;
    await st.putOAuthState(state, verifier, s?.uid || null);
    const q = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: `${originOf(env, url)}/api/auth/google/callback`, response_type: 'code', scope: 'openid email profile', state, code_challenge: challenge, code_challenge_method: 'S256', prompt: 'select_account' });
    return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${q}`, 302);
  }
  if (p === '/api/auth/google/callback') {
    const back = (q) => Response.redirect(`${originOf(env, url)}/game.html?auth=${q}`, 302);
    const code = url.searchParams.get('code'), saved = await st.takeOAuthState(url.searchParams.get('state'));
    if (!code || !saved) return back('fail');
    const tr = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: `${originOf(env, url)}/api/auth/google/callback`, grant_type: 'authorization_code', code_verifier: saved.v }),
    });
    if (!tr.ok) return back('fail');
    const tok = await tr.json();
    // id_token nhận thẳng từ máy chủ token của Google qua TLS (kèm client secret) → kiểm các claim là đủ
    const claims = decodeJwt(tok.id_token);
    const now = Math.floor(Date.now() / 1000);
    if (!claims || claims.aud !== env.GOOGLE_CLIENT_ID || !['https://accounts.google.com', 'accounts.google.com'].includes(claims.iss) || claims.exp < now || !claims.sub) return back('fail');
    if (saved.link) { const l = await st.link(saved.link, 'google', claims.sub); return back(l.ok ? 'linked' : 'taken'); }
    const r = await st.login('google', claims.sub, (claims.given_name || claims.name || '').slice(0, 24));
    if (!r.ok) return back('fail');
    const { sid, maxAge } = await st.createSession(r.uid);
    return new Response(null, { status: 302, headers: { Location: `${originOf(env, url)}/game.html?auth=ok`, 'Set-Cookie': setCookie(url, sid, maxAge), 'Cache-Control': 'no-store' } });
  }

  // --- các lệnh cần đăng nhập ---------------------------------------------------
  const s = await sessionOf(request, env);
  if (p === '/api/auth/logout' && method === 'POST') {
    if (s) await st.logout(s.sid);
    return json({ ok: true }, 200, { 'Set-Cookie': setCookie(url, '', 0) });
  }
  if (!s) return json({ ok: false, err: 'auth' }, 401);

  if (p === '/api/auth/ws-token') return json({ ok: true, tok: await st.wsToken(s.uid) });
  if (p === '/api/auth/claim-guest' && method === 'POST') {
    // lần đầu liên kết: chuyển căn nhà mua bằng mã khách sang tài khoản (Estate DO). pid = mã thiết bị bí mật của khách.
    const b = await body(request);
    if (typeof b.pid !== 'string' || !/^[a-z0-9-]{8,40}$/i.test(b.pid)) return json({ ok: false, err: 'bad' }, 400);
    const g = await st.markGuestLinked(s.uid);
    if (!g.ok || g.was) return json({ ok: true, moved: false });
    let moved = false;
    if (env.ESTATE) { try { const r = await env.ESTATE.get(env.ESTATE.idFromName('estate')).rekey(await A.stableId(b.pid), await A.stableId(A.accountPid(s.uid))); moved = !!r.moved; } catch (e) { /* bỏ qua */ } }
    return json({ ok: true, moved });
  }
  if (p === '/api/auth/delete' && method === 'POST') {
    const b = await body(request);
    if (b.confirm !== 'XOA') return json({ ok: false, err: 'confirm' }, 400);
    const r = await st.requestDelete(s.uid);
    return json(r, 200, { 'Set-Cookie': setCookie(url, '', 0) });
  }
  if (p === '/api/auth/export') return json({ ok: true, data: await st.exportData(s.uid) }, 200, { 'Content-Disposition': 'attachment; filename="huyenquan-du-lieu.json"' });

  if (p === '/api/save') {
    if (method === 'GET') { const v = await st.getSave(s.uid); return json(v ? { ok: true, rev: v.rev, updated: v.updated, body: v.body } : { ok: true, rev: 0, body: null }); }
    if (method === 'PUT' || method === 'POST') {
      const b = await body(request);
      if (!b.state || typeof b.state !== 'object') return json({ ok: false, err: 'bad' }, 400);
      // ràng buộc cố định: ngày giờ sinh không lên máy chủ — client đã lọc, máy chủ lọc lại cho chắc
      const clean = A.scrubBirth(b.state);
      if (A.hasBirth(clean)) return json({ ok: false, err: 'birth' }, 400);
      const r = await st.putSave(s.uid, b.rev | 0, JSON.stringify(clean));
      return json(r, r.ok ? 200 : r.err === 'conflict' ? 409 : 413);
    }
  }
  return json({ ok: false, err: 'not_found' }, 404);
}

function decodeJwt(t) {
  try {
    const part = String(t).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const txt = new TextDecoder().decode(Uint8Array.from(atob(part + '='.repeat((4 - (part.length % 4)) % 4)), (c) => c.charCodeAt(0)));
    return JSON.parse(txt);
  } catch (e) { return null; }
}
export const _test = { cookieOf, decodeJwt, setCookie };
