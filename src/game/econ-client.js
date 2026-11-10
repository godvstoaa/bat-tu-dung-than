// ============================================================================
//  CẦU NỐI KINH TẾ PHẦN II phía client — một API `call(op, args)` cho mọi bảng (econ-ui.js):
//   · đang nối máy chủ → gói `ec` tới Economy DO (sổ máy chủ, giao dịch với người khác, chống gian);
//   · ngoại tuyến / khách chưa nối → chạy CHÍNH EconEngine trên bộ nhớ máy (localStorage) — chơi một mình đủ vòng
//     trồng → xay → nấu → ăn / bán Thương hội; không có người chơi khác nên chợ, hôn nhân, thầy mệnh lý tắt.
//  Ví máy (life.xu) và ví chợ (purse) là HAI ví: gửi lên / rút về qua deposit / withdraw (có khoá chống gửi trùng).
// ============================================================================
import { EconEngine } from './econ-core.js';

const KEY = 'hq-econ-v1';
class LocalStore {
  constructor() { this.m = new Map(); try { const o = JSON.parse(localStorage.getItem(KEY) || '{}'); for (const [k, v] of Object.entries(o)) this.m.set(k, v); } catch (e) { /* bản lưu hỏng → bắt đầu lại */ } this.t = 0; }
  flush() { clearTimeout(this.t); this.t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(this.m))); } catch (e) { /* đầy bộ nhớ */ } }, 200); }
  async get(k) { const v = this.m.get(k); return v === undefined ? undefined : structuredClone(v); }
  async put(k, v) { if (typeof k === 'object') { for (const [a, b] of Object.entries(k)) this.m.set(a, structuredClone(b)); } else this.m.set(k, structuredClone(v)); this.flush(); }
  async delete(k) { for (const x of Array.isArray(k) ? k : [k]) this.m.delete(x); this.flush(); }
  async list({ prefix = '' } = {}) { return new Map([...this.m].filter(([k]) => k.startsWith(prefix)).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => [k, structuredClone(v)])); }
}

export function createEcon({ net, getState }) {
  let local = null;
  const eng = () => (local = local || new EconEngine(new LocalStore()));
  let srvOff = false; // máy chủ đang nối nhưng chưa bật Economy DO → dùng sổ trên máy cho cả phiên (không trộn hai sổ)
  const online = () => !!net?.econ?.online?.() && !srvOff;
  let seq = 0;
  /** khoá chống gửi trùng cho thao tác tiền */
  const key = () => `${Date.now().toString(36)}${(++seq).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  async function call(op, a = {}) {
    if (['deposit', 'withdraw', 'th_buy', 'th_sell', 'mk_buy', 'vn_fund', 'vn_take', 'vn_buy', 'cv_fund', 'cv_take', 'cv_divorce', 'dv_register', 'dv_book'].includes(op) && !a.k) a = { ...a, k: key() };
    if (online()) {
      const r = await net.econ.call(op, a);
      if (r && r.err === 'off') srvOff = true;
      else if (r && r.err !== 'offline') return r;
    }
    const s = getState(), u = s.player?.pid || s.pid || 'local';
    return eng().call(op, u, a, { local: true, name: s.player?.name || '' });
  }
  return { call, online, mode: () => (online() ? 'server' : 'local') };
}
