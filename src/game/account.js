// ============================================================================
//  TÀI KHOẢN — client: đăng nhập (Google / mã email / mã SMS), vé WebSocket, đồng bộ bản lưu đám mây.
//  Ngày giờ sinh KHÔNG lên mây (auth-core.cloudBody lọc; máy chủ lọc lại). Máy mới: ghép bản mây với ngày sinh
//  trên máy, thiếu thì người chơi nhập lại ở cổng.
//  state.cloud = { uid, rev, at } — chỉ ở trên máy (cloudBody bỏ khoá này).
// ============================================================================
import { cloudBody, mergeCloud } from './auth-core.js';
import { pid } from './net.js';

const api = async (path, opt = {}) => {
  try {
    const r = await fetch(path, { credentials: 'same-origin', headers: opt.body ? { 'Content-Type': 'application/json' } : {}, ...opt, body: opt.body ? JSON.stringify(opt.body) : undefined });
    const j = await r.json().catch(() => ({ ok: false, err: 'bad_response' }));
    return { status: r.status, ...j };
  } catch (e) { return { ok: false, err: 'offline' }; }
};

export function createAccount({ getState, storageKey, storage, onChange = () => {} }) {
  let me = null, config = null, ready = false, dirty = false, pushing = false, timer = 0;
  const native = !!window.Capacitor?.isNativePlatform?.(); // bản app: phiên cookie khác origin — làm sau (Sign in with Apple)

  async function init() {
    if (native) { ready = true; return null; }
    const [c, m] = await Promise.all([api('/api/auth/config'), api('/api/auth/me')]);
    config = c.ok ? c : null;
    me = m.ok ? m.me : null;
    ready = true; onChange();
    return me;
  }
  const loggedIn = () => !!me;

  // --- đăng nhập ---------------------------------------------------------------
  const google = (link = false) => { location.href = `/api/auth/google/start${link ? '?link=1' : ''}`; };
  const sendCode = (kind, key) => api('/api/auth/otp/send', { method: 'POST', body: { kind, key } });
  async function verify(kind, key, code, link = false) {
    const r = await api('/api/auth/otp/verify', { method: 'POST', body: { kind, key, code, link, name: getState().player?.name || '' } });
    if (r.ok) { me = r.me; onChange(); }
    return r;
  }
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); me = null; const s = getState(); delete s.cloud; save(s); onChange(); }
  const exportUrl = '/api/auth/export';
  async function remove() { const r = await api('/api/auth/delete', { method: 'POST', body: { confirm: 'XOA' } }); if (r.ok) { me = null; onChange(); } return r; }
  async function wsToken() { if (!me) return null; const r = await api('/api/auth/ws-token'); return r.ok ? r.tok : null; }

  // --- đồng bộ ------------------------------------------------------------------
  const save = (s) => { try { storage.setItem(storageKey, JSON.stringify(s)); } catch (e) { /* đầy bộ nhớ */ } };
  /**
   * Sau đăng nhập (hoặc mở game khi đã đăng nhập). Trả:
   *  { action: 'none' } · { action: 'pushed' } · { action: 'choose', cloud } (máy này chưa gắn tài khoản, mây đã có tiến độ)
   *  { action: 'reload' } (đã thay bằng bản mây mới hơn — tải lại trang)
   */
  async function sync() {
    if (!me) return { action: 'none' };
    const s = getState();
    // lần đầu gắn tài khoản trên máy này: chuyển căn nhà mua bằng mã khách sang tài khoản (máy chủ chỉ làm một lần)
    if (!s.cloud) await api('/api/auth/claim-guest', { method: 'POST', body: { pid: pid() } });
    const r = await api('/api/save');
    if (!r.ok) return { action: 'none', err: r.err };
    if (!r.body) { await push(true); return { action: 'pushed' }; }
    const linked = s.cloud?.uid === me.uid;
    if (linked && (s.cloud.rev | 0) >= r.rev) return { action: 'none' };
    let cloud; try { cloud = JSON.parse(r.body); } catch (e) { return { action: 'none', err: 'bad_save' }; }
    if (!linked) return { action: 'choose', cloud, rev: r.rev, updated: r.updated };
    useCloud(cloud, r.rev);
    return { action: 'reload' };
  }
  /** nhận bản mây (ghép ngày sinh trên máy) — gọi xong thì tải lại trang */
  function useCloud(cloud, rev) {
    const merged = mergeCloud(cloud, getState());
    merged.cloud = { uid: me.uid, rev, at: Date.now() };
    save(merged);
  }
  /** giữ tiến độ máy này: ghi đè bản mây */
  async function keepLocal(rev) { const s = getState(); s.cloud = { uid: me.uid, rev, at: 0 }; return push(true); }

  async function push(force = false) {
    if (!me || pushing || (!dirty && !force)) return { ok: true };
    pushing = true; dirty = false;
    const s = getState();
    const base = s.cloud?.uid === me.uid ? s.cloud.rev | 0 : 0;
    const r = await api('/api/save', { method: 'PUT', body: { rev: base, state: cloudBody(s) } });
    pushing = false;
    if (r.ok) { s.cloud = { uid: me.uid, rev: r.rev, at: r.updated }; save(s); onChange(); }
    else if (r.err === 'conflict') { dirty = false; onChange({ conflict: true }); }
    else dirty = true; // mất mạng: thử lại lượt sau
    return r;
  }
  /** main.save() gọi: đánh dấu cần đẩy, gom mỗi 20 giây một lần */
  function touch() {
    if (!me) return;
    dirty = true;
    if (!timer) timer = setTimeout(() => { timer = 0; push(); }, 20000);
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', () => { if (me && dirty) { try { navigator.sendBeacon?.('/api/save', new Blob([JSON.stringify({ rev: getState().cloud?.rev | 0, state: cloudBody(getState()) })], { type: 'application/json' })); } catch (e) { /* bỏ qua */ } } });

  return {
    init, sync, useCloud, keepLocal, push, touch, google, sendCode, verify, logout, remove, wsToken, exportUrl,
    get me() { return me; }, get config() { return config; }, get ready() { return ready; }, loggedIn, native,
    get synced() { const s = getState(); return !!me && s.cloud?.uid === me.uid && !dirty; },
  };
}
