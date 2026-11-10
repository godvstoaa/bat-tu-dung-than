// ============================================================================
//  TÀI KHOẢN — lõi thuần (Worker + client + test Node dùng chung; chỉ cần Web Crypto).
//   · chuẩn hoá định danh: email (hạ chữ thường), số điện thoại (E.164, mặc định +84)
//   · mã OTP 6 số, băm SHA-256 kèm muối; so sánh thời gian hằng
//   · LỌC NGÀY GIỜ SINH khỏi bản lưu đám mây (ràng buộc cố định: ngày sinh chỉ ở trên máy) và ghép lại khi tải về
//   · stableId: mã công khai ổn định của người chơi (TownShard / Estate) từ pid khách hoặc «acct:<uid>»
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §1
// ============================================================================

export const OTP_TTL_MS = 10 * 60000;
export const OTP_TRIES = 5;
export const SESSION_DAYS = 30;
export const WS_TOKEN_MS = 60000;
export const SAVE_MAX = 900_000;           // ký tự JSON tối đa một bản lưu
export const SAVE_CHUNK = 100_000;         // DO storage: giá trị ≤ 128 KiB → chia mảnh
// giới hạn gửi mã: [số lần, cửa sổ ms]
export const OTP_LIMITS = { key: [[3, 15 * 60000], [10, 24 * 3600000]], ip: [[20, 3600000]] };

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export function normEmail(s) {
  const v = String(s || '').trim().toLowerCase();
  return v.length <= 254 && /^[^\s@<>()",;:]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v) ? v : null;
}
/** số điện thoại → E.164; số VN viết 0xxxxxxxxx → +84xxxxxxxxx. Chỉ nhận +84 (mở thêm sau). */
export function normPhone(s) {
  let v = String(s || '').replace(/[\s.()-]/g, '');
  if (/^0\d{9}$/.test(v)) v = '+84' + v.slice(1);
  if (/^84\d{9}$/.test(v)) v = '+' + v;
  return /^\+84[35789]\d{8}$/.test(v) ? v : null;
}
export function normKey(kind, key) { return kind === 'email' ? normEmail(key) : kind === 'phone' ? normPhone(key) : null; }
/** che định danh khi hiện / xuất: an***@gmail.com · +84 9** *** 123 */
export function maskKey(kind, key) {
  if (kind === 'email') { const [a, d] = key.split('@'); return `${a.slice(0, 2)}***@${d}`; }
  if (kind === 'phone') return `${key.slice(0, 4)}*****${key.slice(-3)}`;
  return kind;
}

export function randomToken(bytes = 32) {
  const a = new Uint8Array(bytes); crypto.getRandomValues(a);
  return btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function otpCode() {
  const a = new Uint32Array(1); crypto.getRandomValues(a);
  return String(a[0] % 1_000_000).padStart(6, '0');
}
export async function sha256(s) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(s))); }
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
/** ULID-lite: thời gian + ngẫu nhiên, sắp theo thời gian tạo */
export function newUid(now = Date.now()) { return now.toString(36).padStart(9, '0') + randomToken(9).replace(/[-_]/g, 'x').slice(0, 12); }

/** mã công khai ổn định (12 hex) — giữ nguyên công thức cũ của quan-room.js để nhà đã mua theo pid không đổi chủ */
export async function stableId(pid, fallback = '') {
  const d = await crypto.subtle.digest('SHA-256', enc.encode('huyenquan:' + (pid || fallback)));
  return [...new Uint8Array(d)].slice(0, 6).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const accountPid = (uid) => `acct:${uid}`;

/** cửa sổ trượt: hits = mảng thời điểm; trả { ok, hits } (đã cắt bớt các lần quá cũ) */
export function rateCheck(hits, limits, now = Date.now()) {
  const maxW = Math.max(...limits.map(([, w]) => w));
  const h = (hits || []).filter((t) => now - t < maxW);
  for (const [n, w] of limits) if (h.filter((t) => now - t < w).length >= n) return { ok: false, hits: h };
  return { ok: true, hits: [...h, now] };
}

// ---------------------------------------------------------------------------
// LỌC NGÀY GIỜ SINH: bỏ mọi khoá `birth`, và với object có đủ year + month + day (hồ sơ Sổ Mệnh, khách hỏi việc…)
// thì bỏ year / month / day / hour / minute. Giữ lại kết quả suy ra (yong, robe, accent, can chi…) — không suy ngược được.
// ---------------------------------------------------------------------------
const BIRTH_FIELDS = ['year', 'month', 'day', 'hour', 'minute'];
const isBirthObj = (o) => o && typeof o === 'object' && !Array.isArray(o) && 'year' in o && 'month' in o && 'day' in o;
export function scrubBirth(v) {
  if (Array.isArray(v)) return v.map(scrubBirth);
  if (!v || typeof v !== 'object') return v;
  const out = {};
  const b = isBirthObj(v);
  for (const [k, x] of Object.entries(v)) {
    if (k === 'birth') continue;
    if (b && BIRTH_FIELDS.includes(k)) continue;
    out[k] = scrubBirth(x);
  }
  return out;
}
/** có còn sót dữ liệu ngày sinh không (máy chủ kiểm lại trước khi ghi) */
export function hasBirth(v) {
  if (Array.isArray(v)) return v.some(hasBirth);
  if (!v || typeof v !== 'object') return false;
  if ('birth' in v || (isBirthObj(v) && BIRTH_FIELDS.some((k) => v[k] != null))) return true;
  return Object.values(v).some(hasBirth);
}
/** bản lưu đám mây: state đã lọc (bỏ cả khoá chỉ dùng trên máy) */
export function cloudBody(state) {
  const { cloud, ...rest } = state || {};
  return scrubBirth(rest);
}
/** ghép bản tải về với ngày sinh trên máy: player.birth + hồ sơ Sổ Mệnh (khớp theo id) */
export function mergeCloud(cloud, local) {
  const s = { ...cloud };
  if (local?.player?.birth && s.player) s.player = { ...s.player, birth: local.player.birth };
  if (Array.isArray(s.profiles)) {
    const byId = new Map((local?.profiles || []).map((p) => [p.id, p]));
    s.profiles = s.profiles.map((p) => { const l = byId.get(p.id); if (!l) return p; const q = { ...p }; for (const k of BIRTH_FIELDS) if (l[k] !== undefined) q[k] = l[k]; return q; });
    // hồ sơ chỉ có trên máy (thêm khi offline) giữ lại
    for (const l of local?.profiles || []) if (!s.profiles.some((p) => p.id === l.id)) s.profiles.push(l);
  }
  return s;
}
/** bản đám mây thiếu ngày sinh của nhân vật → máy mới phải nhập lại */
export const needsBirth = (s) => !!s?.player && !s.player.birth;
