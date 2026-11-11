// ============================================================================
//  HUYỀN QUÁN MMO — giao thức dùng chung client (src/game/net.js) và máy chủ
//  (worker/quan-room.js). Thuần JS, không DOM → test bằng node. Chỉ dựa vào cosmetics.js (danh mục thuần).
//  docs/GAME-MMO-PROMPT-PLAN.md §P1.
//
//  Client → server                         Server → client
//   hello {name, robe, acc, cos, title, pid, tok?}     welcome {you, room, players[], seats}
//   cos   {c}  (đổi trang bị)                  cos {id, c}
//   mv    {x, y, h, s, a, w?, b?}            join {p} · leave {id} · count {n}
//         w: 0 khô · 1 lội · 2 bơi · 3 trên thuyền (b = loại thuyền 0 đò · 1 thuyền hoa · 2 thuyền buồm)
//   tp    {x, y}  (nhảy đổi phòng/xe ngựa)     mv {id, x, y, h, s}
//   emo   {e, to?}
//   say   {k}                               emo {id, e, to?} · say {id, k}
//   sit   {}  /  stand {}                   seat {i|-1} · seats {taken[]}
//   report {id, why}                        full {} (đóng 4001) · err {m}
//   ── P3 ──
//   solve {slot, date, ans}                 graded {slot, total, results, points, season, me}
//   lb {}                                   lb {season, top[], phai[], me}
//   inv {to} · inv_ok {coop} · inv_no {coop} inv {from, name, coop} · inv_no {name}
//   coop_start {} · coop_leave {}           coop {id, host, members[], started, key?}
//   coop_ans {step, ans, hints}             coop_step {step, by, ans, result} · coop_done {total, points} · coop_end {why}
//   ── Nhà riêng Thành Bát Quái (Estate DO) — q = số hỏi để client ghép câu trả lời ──
//   est_list {q}                            est_res {q, ok, list:[[h,name,likes]], mine}
//   est_get {q,h} · est_claim {q,h}         est_res {q, ok, err?, it?, c?, name?, likes?}
//   est_release {q,h} · est_like {q,h}      est_up {h, name|null, likes, layout?} (phát cả shard)
//   est_save {q,h,it,c}  (≤ 3600 ký tự)
//   ── Phá hủy công trình ngoài thành (law.js) ──
//   raze {id, x, y}                         razed {id, by} (phát cả shard) · welcome.razed [[id, tuổi ms]]
//   ── Việc làm (Guild DO, P2) — máy chủ chấm lương, vị trí lấy từ gói mv / tp đã kiểm ──
//   job_me {q} · job_board {q,k}            job_res {q, ok, err?, career?, contract?, shift?, owed?, holders?…}
//   job_apply {q,k,r,y?} · job_renew {q} · job_quit {q}
//   job_start {q,job,k?,y?} · job_end {q} · job_claim {q} · job_ores {q} · job_log {q}
//   job_task {q,seed,sc,node?,wl?,wl30?,sk?}  (sc = điểm mini-game 0–1)
//   ec {q,op,a}                              ec_res {q, ok, err?, …}   (kinh tế P8–P13 → Economy DO)
// ============================================================================

import { HALF, ROOM_X0, ROOM_X1, cityOctDist } from './terrain.js';
import { cleanCos } from './cosmetics.js';
import { LISTING_COUNT, roomOfH, decodeLayout, validLayout } from './estate-core.js';
import { COUPLETS } from './items.js';

export const VERSION = 1;
export const ROOM_CAP = 60;                 // người / shard
export const MAX_ROOMS = 50;
export const MOVE_HZ = 8;                    // client gửi vị trí tối đa 8 lần/giây
export const MSG_PER_SEC = 20;               // vượt → máy chủ đóng kết nối
export const GRID = { cols: 20, rows: 14 };
// Thế giới mở (terrain.js, v3 3328 m) = ±HALF/1,6 ô (1 ô = 1.6 m) quanh tâm sân (10, 7);
// phía Đông mở tới hết dải phòng nội thất (terrain.ROOM_X1: phòng tiệm / nhà / điện thờ)
export const WORLD_TILES = { minX: 10 - Math.ceil(HALF / 1.6), maxX: 10 + Math.ceil((ROOM_X1 + 40) / 1.6), minY: 7 - Math.ceil(HALF / 1.6), maxY: 7 + Math.ceil(HALF / 1.6) };
export const CLOSE_FULL = 4001;
export const CLOSE_SPAM = 4002;
export const CLOSE_BAD = 4003;

// Bồ đoàn ở Trà Thất (toạ độ ô) — mỗi chỗ một người, máy chủ giữ khoá.
// chỗ ngồi bồ đoàn Trà Thất (toạ độ ô) — theo bố cục Sơn Môn
// --- Lư Hương chung của phòng: 1 lư lớn + 8 lư nhỏ quanh Đại Đỉnh (court.js › BURNERS).
// Mỗi người thắp = 3 nén cháy INCENSE_MS; cắm lư lớn trước (≤ 15 người), đầy thì sang lư nhỏ vắng nhất (≤ 6 người / lư).
export const INCENSE_MS = 3 * 60 * 1000;     // = state.js › INCENSE_MS
export const BURNER_CAP = [15, 6, 6, 6, 6, 6, 6, 6, 6];
/** list: [{ k, at }] đang cháy → chỉ số lư cho người thắp tiếp theo (−1 nếu cả 9 lư đều đầy) */
export function pickBurner(list, now = Date.now()) {
  const n = BURNER_CAP.map(() => 0);
  for (const e of list || []) if (now - e.at < INCENSE_MS && n[e.k] !== undefined) n[e.k]++;
  if (n[0] < BURNER_CAP[0]) return 0;
  let best = -1;
  for (let k = 1; k < BURNER_CAP.length; k++) if (n[k] < BURNER_CAP[k] && (best < 0 || n[k] < n[best])) best = k;
  return best;
}
export const SEATS = [{ x: -16.5, y: 22.71875 }, { x: -15, y: 22.71875 }, { x: -13.5, y: 22.71875 }]; // = court.js › TEA_SEATS (test-game-state kiểm)

export const EMOTES = {
  bow: { icon: '🙇', text: 'cúi chào' },
  palm: { icon: '🙏', text: 'chắp tay' },
  clap: { icon: '👏', text: 'vỗ tay' },
  tea: { icon: '🍵', text: 'mời trà' },
  wave: { icon: '👋', text: 'vẫy tay' },
  think: { icon: '🤔', text: 'suy ngẫm' },
};

// Chat chỉ bằng cụm từ soạn sẵn (giai đoạn đầu — không có UGC tự do, Guideline 1.2).
export const PHRASES = {
  hi: 'Chào bạn!',
  join: 'Cùng giải án nhé?',
  thanks: 'Cảm ơn nhiều.',
  nice: 'Hay quá!',
  tea: 'Mời bạn chén trà.',
  learn: 'Mình đang học Tử Bình.',
  wait: 'Chờ mình chút.',
  bye: 'Hẹn gặp lại.',
};

export const ROBES = ['木', '火', '土', '金', '水'];
// Môn phái: bản sắc người chơi + xếp hạng theo phái (P3)
export const PHAI = { tubinh: 'Tử Bình', manh: 'Manh Phái', trichthien: 'Trích Thiên', cungthong: 'Cùng Thông' };
export const COOP_MAX = 4;
export const STEPS = ['pillars', 'wx', 'strength', 'yong', 'timing', 'advice'];

export const REPORT_REASONS = { name: 'Tên không phù hợp', spam: 'Làm phiền / spam', other: 'Lý do khác' };

// Lọc tên: bỏ ký tự điều khiển/zero-width, gộp khoảng trắng, ≤ 24 ký tự, chặn từ thô tục cơ bản.
const BAD = ['địt', 'dit me', 'đụ', 'lồn', 'cặc', 'buồi', 'đéo', 'fuck', 'shit', 'bitch', 'dm ', 'đm ', 'vcl', 'clm', 'cc '];
export function cleanName(raw) {
  let s = String(raw ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, '');
  s = s.replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
  const low = ` ${s.toLowerCase()} `;
  if (!s || BAD.some((w) => low.includes(w))) return null;
  return s;
}

// Danh hiệu: qua đúng bộ lọc của cleanName (ký tự điều khiển/zero-width, HTML, thô tục).
// Xấu/lỗi thì bỏ hẳn («») chứ không giữ nguyên — không chỉ slice.
export function cleanTitle(raw) {
  return cleanName(raw) || '';
}

const num = (v) => typeof v === 'number' && Number.isFinite(v);

// Chặn bước nhảy phi lý khi relay mv: quãng đi > ~40 m/gói (25 ô, 1 ô = 1,6 m) không thể
// là chuyển động hợp lệ (client tối đa ~4,7 ô/s, gửi ≤ 8 Hz) → kẹp về toạ độ cũ.
export const MV_JUMP_TILES = 25;
export function sanityMv(a, x, y) {
  const nx = Number.isFinite(x) ? x : a.x, ny = Number.isFinite(y) ? y : a.y;
  return Math.hypot(nx - a.x, ny - a.y) > MV_JUMP_TILES ? { x: a.x, y: a.y } : { x: nx, y: ny };
}

// Kiểm/chuẩn hoá một gói client gửi lên. Trả gói sạch hoặc null (bỏ qua).
export const EST_SAVE_MAX = 12600; // biệt phủ: tới 240 món (estate-core.LAYOUT_MAX_LEN 12000) + vỏ gói
const estH = (h) => Number.isInteger(h) && h >= 0 && h < LISTING_COUNT;
const estQ = (q) => (Number.isInteger(q) && q > 0 && q < 1e9 ? q : 0);
/** gói kinh tế: tên thao tác + giới hạn độ dài (lời luận thầy mệnh lý ≤ 4.000 ký tự × 3 bài sát hạch) */
export const EC_MAX = 16000;
export const EC_OP = /^(me|deposit|withdraw|set_tc|cellar_in|cellar_out|ice|drop|th_board|th_buy|th_sell|mk_board|mk_post|mk_cancel|mk_buy|plot_rent|plot_extend|plant|water|fert|harvest|butcher|mill|compost|fish|cook|eat|chef_greet|chef_join|vn_list|vn_rent|vn_fund|vn_take|vn_stock|vn_unstock|vn_menu|vn_open|vn_close|vn_buy|cv_propose|cv_answer|cv_view|cv_fund|cv_take|cv_divorce|cv_agree|cv_withdraw|dv_exam|dv_register|dv_list|dv_book|dv_mine|dv_deliver|dv_rate)$/;
export function parseClient(text) {
  if (typeof text !== 'string' || text.length > (text.startsWith('{"t":"est_save"') ? EST_SAVE_MAX : text.startsWith('{"t":"ec"') ? EC_MAX : 1024)) return null;
  let m;
  try { m = JSON.parse(text); } catch (e) { return null; }
  if (!m || typeof m !== 'object') return null;
  switch (m.t) {
    case 'hello': {
      const name = cleanName(m.name);
      return {
        t: 'hello', name: name || 'Khách',
        robe: ROBES.includes(m.robe) ? m.robe : '土',
        title: typeof m.title === 'string' ? cleanTitle(m.title) : '',
        phai: PHAI[m.phai] ? m.phai : '',
        look: m.look === 'hero_f' ? 'hero_f' : 'hero_m',
        acc: ROBES.includes(m.acc) ? m.acc : '', // màu đai = Hỷ thần (chỉ gửi màu, không gửi ngày sinh)
        cos: cleanCos(m.cos), // trang bị Tàng Y Các — chỉ món có trong danh mục, đúng ô
        pid: typeof m.pid === 'string' && /^[a-z0-9-]{8,40}$/i.test(m.pid) ? m.pid : null,
        tok: typeof m.tok === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(m.tok) ? m.tok : null, // vé tài khoản một lần (/api/auth/ws-token)
        badName: !name,
        // v4: nơi xuất hiện do khách chọn (spawn.js) — trong biên thế giới mới nhận, không thì máy chủ dùng START
        x: num(m.x) && num(m.y) && m.x >= WORLD_TILES.minX && m.y >= WORLD_TILES.minY && m.x <= WORLD_TILES.maxX && m.y <= WORLD_TILES.maxY ? m.x : null,
        y: num(m.x) && num(m.y) && m.x >= WORLD_TILES.minX && m.y >= WORLD_TILES.minY && m.x <= WORLD_TILES.maxX && m.y <= WORLD_TILES.maxY ? m.y : null,
      };
    }
    case 'mv':
      if (!num(m.x) || !num(m.y) || m.x < WORLD_TILES.minX || m.y < WORLD_TILES.minY || m.x > WORLD_TILES.maxX || m.y > WORLD_TILES.maxY) return null;
      return { t: 'mv', x: round2(m.x), y: round2(m.y), h: num(m.h) ? round2(m.h) : 0, s: m.s ? 1 : 0, a: num(m.a) ? Math.max(0, Math.min(420, Math.round(m.a))) : 0, w: [1, 2, 3, 4, 5, 6, 7].includes(m.w) ? m.w : 0, b: [3, 4, 5].includes(m.w) && [0, 1, 2].includes(m.b) ? m.b : 0, fs: Number.isInteger(m.fs) && m.fs >= 0 && m.fs <= 5 ? m.fs : 0 }; // fs: trạng thái bay (P15)
    case 'tp':
      // Nhảy xa hợp lệ do client chủ động (đổi phòng qua cửa điện, lên xe ngựa/đò sang
      // sảnh nghề): chỉ kiểm biên thế giới như mv — không kiểm bước nhảy vì cú nhảy là chủ đích.
      if (!num(m.x) || !num(m.y) || m.x < WORLD_TILES.minX || m.y < WORLD_TILES.minY || m.x > WORLD_TILES.maxX || m.y > WORLD_TILES.maxY) return null;
      return { t: 'tp', x: round2(m.x), y: round2(m.y) };
    case 'emo':
      if (!EMOTES[m.e]) return null;
      return { t: 'emo', e: m.e, to: typeof m.to === 'string' ? m.to.slice(0, 16) : undefined };
    case 'say':
      return PHRASES[m.k] ? { t: 'say', k: m.k } : null;
    case 'cos': return typeof m.c === 'string' ? { t: 'cos', c: cleanCos(m.c) } : null;
    case 'sit': return { t: 'sit' };
    case 'inc': return { t: 'inc' };
    case 'cung': return typeof m.to === 'string' ? { t: 'cung', to: m.to.slice(0, 16) } : null; // cúng cô hồn cho người đang ở cõi Ngạ quỷ (P21)
    case 'stand': return { t: 'stand' };
    case 'report':
      if (typeof m.id !== 'string' || !REPORT_REASONS[m.why]) return null;
      return { t: 'report', id: m.id.slice(0, 16), why: m.why };
    case 'solve':
      if (![0, 1, 2].includes(m.slot) || typeof m.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.date) || !m.ans || typeof m.ans !== 'object') return null;
      return { t: 'solve', slot: m.slot, date: m.date, ans: m.ans };
    case 'lb': return { t: 'lb' };
    case 'inv': return typeof m.to === 'string' ? { t: 'inv', to: m.to.slice(0, 16) } : null;
    case 'inv_ok': case 'inv_no': return typeof m.coop === 'string' ? { t: m.t, coop: m.coop.slice(0, 16) } : null;
    case 'coop_start': case 'coop_leave': return { t: m.t };
    case 'coop_ans':
      if (!Number.isInteger(m.step) || m.step < 0 || m.step >= STEPS.length) return null;
      return { t: 'coop_ans', step: m.step, ans: m.ans ?? null, hints: Number.isInteger(m.hints) ? m.hints : 0 };
    case 'est_list': return { t: 'est_list', q: estQ(m.q) };
    case 'est_get': case 'est_claim': case 'est_release': case 'est_like':
      return estH(m.h) ? { t: m.t, h: m.h, q: estQ(m.q) } : null;
    case 'est_save': {
      // bố cục: chuỗi mã gọn, giải ra ≤ 60 món bài trí hợp lệ, nằm gọn trong phòng, không chồng, đủ lối đi
      if (!estH(m.h) || typeof m.it !== 'string' || !Number.isInteger(m.c) || m.c < 0 || m.c >= COUPLETS.length) return null;
      const items = decodeLayout(m.it);
      if (!items || !validLayout(roomOfH(m.h), items)) return null;
      return { t: 'est_save', h: m.h, it: m.it, c: m.c, q: estQ(m.q) };
    }
    case 'job_me': case 'job_renew': case 'job_quit': case 'job_end': case 'job_claim': case 'job_ores': case 'job_log':
      return { t: m.t, q: estQ(m.q) };
    case 'job_board':
      return jobK(m.k) ? { t: m.t, k: m.k, q: estQ(m.q) } : null;
    case 'job_apply':
      if (!jobK(m.k) || !Number.isInteger(m.r) || m.r < 0 || m.r > 3) return null;
      return { t: m.t, k: m.k, r: m.r, y: jobYong(m.y), q: estQ(m.q) };
    case 'job_start':
      if (!JOB_IDS.includes(m.job) || !(m.k == null || jobK(m.k))) return null;
      return { t: m.t, job: m.job, k: m.k ?? null, y: jobYong(m.y), q: estQ(m.q) };
    case 'job_task':
      if (!Number.isInteger(m.seed) || m.seed <= 0 || !num(m.sc)) return null;
      return { t: m.t, seed: m.seed, sc: Math.max(0, Math.min(1, m.sc)), node: typeof m.node === 'string' && /^c\d{1,2}$/.test(m.node) ? m.node : null, wl: !!m.wl, wl30: !!m.wl30, sk: !!m.sk, ad: Number.isInteger(m.ad) ? Math.max(0, Math.min(4, m.ad)) : 0, q: estQ(m.q) };
    case 'ec': // kinh tế Phần II (P8–P13): op + tham số; Economy DO tự kiểm từng tham số
      if (typeof m.op !== 'string' || !EC_OP.test(m.op) || (m.a != null && (typeof m.a !== 'object' || Array.isArray(m.a)))) return null;
      return { t: 'ec', op: m.op, a: m.a || {}, q: estQ(m.q) };
    case 'raze': {
      // id = law.structId (mét làm tròn) — phải khớp toạ độ ô gửi kèm, ngoài tường thành, trong biên thế giới
      if (typeof m.id !== 'string' || !RAZE_ID.test(m.id) || !num(m.x) || !num(m.y)) return null;
      const [ix, iz] = m.id.slice(1).split(':').map(Number);
      if (Math.abs((m.x - 10) * 1.6 - ix) > 3 || Math.abs((m.y - 7) * 1.6 - iz) > 3) return null;
      if (cityOctDist(ix, iz) < RAZE_OUTSIDE || ix > ROOM_X0 - 40 || Math.hypot(ix, iz) > HALF) return null;
      return { t: 'raze', id: m.id, x: round2(m.x), y: round2(m.y) };
    }
    default: return null;
  }
}
export const RAZE_ID = /^s-?\d{1,4}:-?\d{1,4}$/;
// việc làm: mã nghề đợt 1 (= jobs.js › WORK) và Dụng / Hỷ / Kỵ thần khai báo (chỉ hành — không ngày sinh)
export const JOB_IDS = ['bep', 'phu', 'boc', 'mo', 'gom', 'den', 'huong', 'tra', 'cantra', 'may', 'vuon', 'moc', 'chep', 'ren', 'moigioi', 'phongthuy', 'kephat', 'lodan', 'phaohoa', 'laido', 'nguphu', 'buonmuoi', 'hamruou', 'tieuphu', 'kimhoan', 'thungan', 'baotieu', 'nhadich', 'thoxay', 'nongphu', 'thoda']; // = Object.keys(jobs.WORK)
const WX5 = ['木', '火', '土', '金', '水'];
const jobK = (k) => Number.isInteger(k) && k >= 0 && k < 200;
function jobYong(y) {
  if (!y || typeof y !== 'object' || !WX5.includes(y.primary)) return null;
  return { primary: y.primary, accent: WX5.includes(y.accent) ? y.accent : null, ji: WX5.includes(y.ji) ? y.ji : null };
}
export const RAZE_OUTSIDE = 20;      // phải cách tường Ngoại Thành ≥ 20 m (trong thành có hộ thành đại trận)
export const RAZE_REACH_TILES = 12;  // người phá phải đứng gần (≤ ~19 m) — máy chủ kiểm với toạ độ đã biết
export const RAZE_COOLDOWN_MS = 4000;
export const RAZE_KEEP = 400;        // tối đa số công trình nhớ đang bị phá / shard
export { RESPAWN_MS } from "./law.js";

function round2(v) { return Math.round(v * 100) / 100; }

// Bộ đếm tốc độ cửa sổ trượt 1 giây.
export function rateGate(limit = MSG_PER_SEC) {
  let start = 0, n = 0;
  return (now = Date.now()) => {
    if (now - start >= 1000) { start = now; n = 0; }
    n += 1;
    return n <= limit;
  };
}

// Nội suy vị trí người khác: tiến về đích với tốc độ tối đa, nhảy thẳng nếu quá xa (teleport).
export function approach(cur, goal, maxStep) {
  const dx = goal.x - cur.x, dy = goal.y - cur.y, d = Math.hypot(dx, dy);
  if (d > 4 || d <= maxStep) return { x: goal.x, y: goal.y };
  return { x: cur.x + (dx / d) * maxStep, y: cur.y + (dy / d) * maxStep };
}

// v4 (thành ×10): phát vị trí THEO VÙNG — người trong AOI_TILES (~600 m) nhận mọi gói mv; người xa chỉ nhận gói thưa
// (≤ 1 gói / AOI_FAR_MS) đủ cho bản đồ nhỏ — phòng 24 người khắp thành không còn dội gói cho tất cả.
export const AOI_TILES = Math.round(600 / 1.6), AOI_FAR_MS = 2000;
export const inAoi = (a, b) => Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0)) <= AOI_TILES;
