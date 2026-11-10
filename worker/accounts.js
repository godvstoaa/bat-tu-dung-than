// ============================================================================
//  ACCOUNTS — Durable Object duy nhất («accounts»): tài khoản, danh tính đăng nhập (Google / email / điện thoại),
//  phiên (chỉ lưu băm), mã OTP (chỉ lưu băm), vé WebSocket một lần, bản lưu đám mây (đã lọc ngày sinh).
//  Worker (worker/auth.js) gọi qua RPC. Không có mật khẩu.
//  Lưu trữ KV:
//    acct:<uid> → { uid, created, name, guestLinked, deleteAt }      id:<kind>:<key> → uid      ids:<uid> → [[kind,key]]
//    ses:<sha(sid)> → { uid, exp, seen }      sesof:<uid> → [sha]      otp:<kind>:<key> → { h, salt, exp, tries }
//    rl:k:<kind>:<key> / rl:ip:<ipHash> → [thời điểm]      ws:<tok> → { uid, exp }      gs:<state> → { v, exp, link }
//    save:<uid> → { rev, n, len, updated }      savec:<uid>:<i> → mảnh JSON      del:<uid> → hạn xoá
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import * as A from '../src/game/auth-core.js';

const DAY = 86400000;
const okKind = (k) => k === 'google' || k === 'email' || k === 'phone' || k === 'apple';

export class Accounts extends DurableObject {
  get s() { return this.ctx.storage; }

  // --- OTP -----------------------------------------------------------------
  /** tạo mã gửi cho email / số (Worker gửi đi). Trả { ok, code } | { ok:false, err } */
  async otpSend(kind, key, ipHash, now = Date.now()) {
    if (kind !== 'email' && kind !== 'phone') return { ok: false, err: 'bad' };
    const rk = `rl:k:${kind}:${key}`, ri = `rl:ip:${ipHash}`;
    const a = A.rateCheck(await this.s.get(rk), A.OTP_LIMITS.key, now);
    const b = A.rateCheck(await this.s.get(ri), A.OTP_LIMITS.ip, now);
    if (!a.ok || !b.ok) return { ok: false, err: 'rate' };
    const code = A.otpCode(), salt = A.randomToken(12);
    await this.s.put({ [rk]: a.hits, [ri]: b.hits, [`otp:${kind}:${key}`]: { h: await A.sha256(salt + code), salt, exp: now + A.OTP_TTL_MS, tries: 0 } });
    return { ok: true, code };
  }
  /** kiểm mã: đúng → xoá mã, trả { ok } ; sai quá OTP_TRIES lần → huỷ mã */
  async otpCheck(kind, key, code, now = Date.now()) {
    const k = `otp:${kind}:${key}`, o = await this.s.get(k);
    if (!o || now > o.exp) { if (o) await this.s.delete(k); return { ok: false, err: 'expired' }; }
    if (!/^\d{6}$/.test(String(code || ''))) return { ok: false, err: 'wrong' };
    if (!A.safeEqual(await A.sha256(o.salt + code), o.h)) {
      o.tries += 1;
      if (o.tries >= A.OTP_TRIES) { await this.s.delete(k); return { ok: false, err: 'locked' }; }
      await this.s.put(k, o); return { ok: false, err: 'wrong', left: A.OTP_TRIES - o.tries };
    }
    await this.s.delete(k);
    return { ok: true };
  }

  // --- tài khoản / danh tính ------------------------------------------------
  /** đăng nhập bằng danh tính đã xác minh: có rồi thì trả uid, chưa có thì tạo tài khoản mới */
  async login(kind, key, name = '', now = Date.now()) {
    if (!okKind(kind) || !key) return { ok: false, err: 'bad' };
    let uid = await this.s.get(`id:${kind}:${key}`), isNew = false;
    if (!uid) {
      uid = A.newUid(now); isNew = true;
      await this.s.put({ [`acct:${uid}`]: { uid, created: now, name: String(name || '').slice(0, 24), guestLinked: false, deleteAt: null }, [`id:${kind}:${key}`]: uid, [`ids:${uid}`]: [[kind, key]] });
    } else {
      const acct = await this.s.get(`acct:${uid}`);
      if (acct?.deleteAt) { acct.deleteAt = null; await this.s.put(`acct:${uid}`, acct); await this.s.delete(`del:${uid}`); } // đăng nhập lại trong hạn chờ xoá → huỷ xoá
    }
    return { ok: true, uid, isNew };
  }
  /** gắn thêm danh tính vào tài khoản đang đăng nhập */
  async link(uid, kind, key) {
    if (!okKind(kind) || !key || !(await this.s.get(`acct:${uid}`))) return { ok: false, err: 'bad' };
    const cur = await this.s.get(`id:${kind}:${key}`);
    if (cur && cur !== uid) return { ok: false, err: 'taken' };
    if (cur === uid) return { ok: true };
    const ids = (await this.s.get(`ids:${uid}`)) || [];
    ids.push([kind, key]);
    await this.s.put({ [`id:${kind}:${key}`]: uid, [`ids:${uid}`]: ids });
    return { ok: true };
  }
  async me(uid) {
    const acct = await this.s.get(`acct:${uid}`); if (!acct) return null;
    const ids = (await this.s.get(`ids:${uid}`)) || [];
    const save = await this.s.get(`save:${uid}`);
    return { uid, name: acct.name, created: acct.created, deleteAt: acct.deleteAt, ids: ids.map(([k, v]) => ({ kind: k, label: k === 'google' ? 'Google' : A.maskKey(k, v) })), saveRev: save?.rev || 0, saveAt: save?.updated || null };
  }
  /** đánh dấu đã chuyển dữ liệu khách sang tài khoản; trả cờ cũ (chỉ chuyển một lần) */
  async markGuestLinked(uid) {
    const acct = await this.s.get(`acct:${uid}`); if (!acct) return { ok: false };
    const was = acct.guestLinked; acct.guestLinked = true; await this.s.put(`acct:${uid}`, acct);
    return { ok: true, was };
  }

  // --- phiên ----------------------------------------------------------------
  async createSession(uid, now = Date.now()) {
    const sid = A.randomToken(32), h = await A.sha256(sid);
    const list = ((await this.s.get(`sesof:${uid}`)) || []).slice(-9); // tối đa 10 thiết bị
    const drop = ((await this.s.get(`sesof:${uid}`)) || []).filter((x) => !list.includes(x));
    if (drop.length) await this.s.delete(drop.map((x) => `ses:${x}`));
    list.push(h);
    await this.s.put({ [`ses:${h}`]: { uid, exp: now + A.SESSION_DAYS * DAY, seen: now }, [`sesof:${uid}`]: list });
    return { sid, maxAge: A.SESSION_DAYS * 86400 };
  }
  /** uid của phiên (gia hạn trượt mỗi ngày một lần) hoặc null */
  async sessionUid(sid, now = Date.now()) {
    if (typeof sid !== 'string' || sid.length < 20 || sid.length > 80) return null;
    const h = await A.sha256(sid), k = `ses:${h}`, v = await this.s.get(k);
    if (!v) return null;
    if (now > v.exp) { await this.s.delete(k); return null; }
    if (now - v.seen > DAY) { v.seen = now; v.exp = now + A.SESSION_DAYS * DAY; await this.s.put(k, v); }
    return v.uid;
  }
  async logout(sid) {
    if (typeof sid !== 'string') return { ok: true };
    const h = await A.sha256(sid), v = await this.s.get(`ses:${h}`);
    if (v) { await this.s.delete(`ses:${h}`); const l = ((await this.s.get(`sesof:${v.uid}`)) || []).filter((x) => x !== h); await this.s.put(`sesof:${v.uid}`, l); }
    return { ok: true };
  }

  // --- vé WebSocket một lần (hello của TownShard) ---------------------------
  async wsToken(uid, now = Date.now()) {
    const tok = A.randomToken(24);
    await this.s.put(`ws:${tok}`, { uid, exp: now + A.WS_TOKEN_MS });
    return tok;
  }
  async consumeWsToken(tok, now = Date.now()) {
    if (typeof tok !== 'string' || !/^[A-Za-z0-9_-]{20,64}$/.test(tok)) return null;
    const v = await this.s.get(`ws:${tok}`); if (!v) return null;
    await this.s.delete(`ws:${tok}`);
    if (now > v.exp) return null;
    const acct = await this.s.get(`acct:${v.uid}`);
    return acct ? { uid: v.uid, name: acct.name } : null;
  }

  // --- Google OAuth: state + PKCE verifier (10 phút) ------------------------
  async putOAuthState(state, verifier, link, now = Date.now()) { await this.s.put(`gs:${state}`, { v: verifier, link: link || null, exp: now + 600000 }); }
  async takeOAuthState(state, now = Date.now()) {
    if (typeof state !== 'string' || state.length > 80) return null;
    const v = await this.s.get(`gs:${state}`); if (!v) return null;
    await this.s.delete(`gs:${state}`);
    return now > v.exp ? null : v;
  }

  // --- bản lưu đám mây ------------------------------------------------------
  async getSave(uid) {
    const m = await this.s.get(`save:${uid}`); if (!m) return null;
    const parts = await this.s.get(Array.from({ length: m.n }, (_, i) => `savec:${uid}:${i}`));
    let text = ''; for (let i = 0; i < m.n; i++) text += parts.get(`savec:${uid}:${i}`) || '';
    return { rev: m.rev, updated: m.updated, body: text };
  }
  /** ghi bản lưu nếu baseRev khớp (chống hai máy ghi đè nhau); text = JSON đã lọc ngày sinh (Worker kiểm) */
  async putSave(uid, baseRev, text, now = Date.now()) {
    if (typeof text !== 'string' || text.length > A.SAVE_MAX) return { ok: false, err: 'big' };
    const m = await this.s.get(`save:${uid}`), rev = m?.rev || 0;
    if ((baseRev | 0) !== rev) return { ok: false, err: 'conflict', rev };
    const n = Math.max(1, Math.ceil(text.length / A.SAVE_CHUNK)), put = {};
    for (let i = 0; i < n; i++) put[`savec:${uid}:${i}`] = text.slice(i * A.SAVE_CHUNK, (i + 1) * A.SAVE_CHUNK);
    put[`save:${uid}`] = { rev: rev + 1, n, len: text.length, updated: now };
    await this.s.put(put);
    if (m && m.n > n) await this.s.delete(Array.from({ length: m.n - n }, (_, i) => `savec:${uid}:${n + i}`));
    return { ok: true, rev: rev + 1, updated: now };
  }

  // --- xoá / xuất -----------------------------------------------------------
  /** yêu cầu xoá: khoá tài khoản 7 ngày (đăng nhập lại = huỷ), rồi xoá vĩnh viễn trong alarm */
  async requestDelete(uid, now = Date.now()) {
    const acct = await this.s.get(`acct:${uid}`); if (!acct) return { ok: false };
    acct.deleteAt = now + 7 * DAY;
    const ses = (await this.s.get(`sesof:${uid}`)) || [];
    if (ses.length) await this.s.delete(ses.map((h) => `ses:${h}`));
    await this.s.put({ [`acct:${uid}`]: acct, [`sesof:${uid}`]: [], [`del:${uid}`]: acct.deleteAt });
    const cur = await this.s.getAlarm(); if (!cur || cur > acct.deleteAt) await this.s.setAlarm(acct.deleteAt);
    return { ok: true, deleteAt: acct.deleteAt };
  }
  async purge(uid) {
    const ids = (await this.s.get(`ids:${uid}`)) || [], m = await this.s.get(`save:${uid}`);
    const keys = [`acct:${uid}`, `ids:${uid}`, `sesof:${uid}`, `save:${uid}`, `del:${uid}`, ...ids.map(([k, v]) => `id:${k}:${v}`)];
    if (m) for (let i = 0; i < m.n; i++) keys.push(`savec:${uid}:${i}`);
    await this.s.delete(keys);
    return { ok: true };
  }
  async alarm() {
    const now = Date.now(); let next = null;
    for (const [k, at] of await this.s.list({ prefix: 'del:' })) {
      if (at <= now) await this.purge(k.slice(4)); else next = next == null ? at : Math.min(next, at);
    }
    if (next) await this.s.setAlarm(next);
  }
  async exportData(uid) {
    const me = await this.me(uid); if (!me) return null;
    const save = await this.getSave(uid);
    return { account: me, save: save ? { rev: save.rev, updated: save.updated, state: JSON.parse(save.body || 'null') } : null };
  }
}
