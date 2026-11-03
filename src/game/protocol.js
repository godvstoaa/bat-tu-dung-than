// ============================================================================
//  HUYỀN QUÁN MMO — giao thức dùng chung client (src/game/net.js) và máy chủ
//  (worker/quan-room.js). Thuần JS, không DOM, không phụ thuộc → test bằng node.
//  docs/GAME-MMO-PROMPT-PLAN.md §P1.
//
//  Client → server                         Server → client
//   hello {name, robe, acc, title, pid}          welcome {you, room, players[], seats}
//   mv    {x, y, h, s}                      join {p} · leave {id} · count {n}
//   emo   {e, to?}                          mv {id, x, y, h, s}
//   say   {k}                               emo {id, e, to?} · say {id, k}
//   sit   {}  /  stand {}                   seat {i|-1} · seats {taken[]}
//   report {id, why}                        full {} (đóng 4001) · err {m}
//   ── P3 ──
//   solve {slot, date, ans}                 graded {slot, total, results, points, season, me}
//   lb {}                                   lb {season, top[], phai[], me}
//   inv {to} · inv_ok {coop} · inv_no {coop} inv {from, name, coop} · inv_no {name}
//   coop_start {} · coop_leave {}           coop {id, host, members[], started, key?}
//   coop_ans {step, ans, hints}             coop_step {step, by, ans, result} · coop_done {total, points} · coop_end {why}
// ============================================================================

export const VERSION = 1;
export const ROOM_CAP = 60;                 // người / shard
export const MAX_ROOMS = 50;
export const MOVE_HZ = 8;                    // client gửi vị trí tối đa 8 lần/giây
export const MSG_PER_SEC = 20;               // vượt → máy chủ đóng kết nối
export const GRID = { cols: 20, rows: 14 };
// Thế giới mở 2048 m = ±640 ô (1 ô = 1.6 m) quanh tâm sân (10, 7)
// ±640 ô = bản đồ chính; mở rộng phía Đông tới 1200 ô cho các điện thờ (world.js › ROOMS, x ≈ 1500–1800 m)
export const WORLD_TILES = { minX: 10 - 640, maxX: 10 + 1200, minY: 7 - 640, maxY: 7 + 640 };
export const CLOSE_FULL = 4001;
export const CLOSE_SPAM = 4002;
export const CLOSE_BAD = 4003;

// Bồ đoàn ở Trà Thất (toạ độ ô) — mỗi chỗ một người, máy chủ giữ khoá.
export const SEATS = [{ x: 2.25, y: 3.45 }, { x: 3.75, y: 3.45 }, { x: 5.25, y: 3.45 }];

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

const num = (v) => typeof v === 'number' && Number.isFinite(v);

// Kiểm/chuẩn hoá một gói client gửi lên. Trả gói sạch hoặc null (bỏ qua).
export function parseClient(text) {
  if (typeof text !== 'string' || text.length > 1024) return null;
  let m;
  try { m = JSON.parse(text); } catch (e) { return null; }
  if (!m || typeof m !== 'object') return null;
  switch (m.t) {
    case 'hello': {
      const name = cleanName(m.name);
      return {
        t: 'hello', name: name || 'Khách',
        robe: ROBES.includes(m.robe) ? m.robe : '土',
        title: typeof m.title === 'string' ? m.title.slice(0, 24) : '',
        phai: PHAI[m.phai] ? m.phai : '',
        look: m.look === 'hero_f' ? 'hero_f' : 'hero_m',
        acc: ROBES.includes(m.acc) ? m.acc : '', // màu đai = Hỷ thần (chỉ gửi màu, không gửi ngày sinh)
        pid: typeof m.pid === 'string' && /^[a-z0-9-]{8,40}$/i.test(m.pid) ? m.pid : null,
        badName: !name,
      };
    }
    case 'mv':
      if (!num(m.x) || !num(m.y) || m.x < WORLD_TILES.minX || m.y < WORLD_TILES.minY || m.x > WORLD_TILES.maxX || m.y > WORLD_TILES.maxY) return null;
      return { t: 'mv', x: round2(m.x), y: round2(m.y), h: num(m.h) ? round2(m.h) : 0, s: m.s ? 1 : 0, a: num(m.a) ? Math.max(0, Math.min(420, Math.round(m.a))) : 0 };
    case 'emo':
      if (!EMOTES[m.e]) return null;
      return { t: 'emo', e: m.e, to: typeof m.to === 'string' ? m.to.slice(0, 16) : undefined };
    case 'say':
      return PHRASES[m.k] ? { t: 'say', k: m.k } : null;
    case 'sit': return { t: 'sit' };
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
    default: return null;
  }
}

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
