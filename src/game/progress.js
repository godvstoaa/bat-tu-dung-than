// ============================================================================
//  TIẾN TRÌNH — cấp, gia trì nguyên tố, VIP (docs/GAME-V2-THIET-KE.md §S12)
//  Cấp tính theo Phúc Khí tích lũy cả đời (s.xp) — tiêu Phúc Khí không làm tụt cấp.
//  Gia trì theo hành Dụng thần của người chơi, mở dần theo cấp; VIP mở sớm bay + gia trì.
//  Thuần logic — test: scripts/test-game-progress.mjs
// ============================================================================
import { effectiveLevel } from './realm.js';

// xp cần để đạt cấp L: 20·(L−1)²  → L2: 20 · L3: 80 · L4: 180 · L6: 500 · L8: 980 · L10: 1620
export const xpFor = (L) => 20 * (L - 1) ** 2;
export const levelOf = (xp = 0) => Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 20)) + 1);
/** cấp hiệu lực: kẹp ở trần cảnh giới đã đột phá (P20 — realm.js); s không phải state đầy đủ thì dùng cấp thô */
export const effLevel = (s) => { const raw = levelOf(s?.xp || 0); return s && typeof s === 'object' ? effectiveLevel(s, raw) : raw; };

export const GIATRI = [
  { id: 'aura', lv: 2, vip: true, name: 'Hào quang hộ thể', desc: 'vòng sáng dưới chân theo màu hành' },
  { id: 'motes', lv: 4, vip: true, name: 'Linh khí quanh thân', desc: 'linh khí của hành bay quanh người' },
  { id: 'trail', lv: 6, vip: true, name: 'Vệt sáng bộ pháp', desc: 'để lại vệt sáng khi chạy' },
  { id: 'fly', lv: 8, vip: true, name: 'Ngự kiếm phi hành', desc: 'bay lượn trên kiếm, vượt núi sông' },
  { id: 'halo', lv: 10, vip: false, name: 'Pháp quang sau lưng', desc: 'vầng pháp quang lớn sau lưng' },
];

// tên gia trì riêng từng hành (hiện trong Sổ Mệnh)
export const WX_GIATRI = {
  木: { name: 'Thanh Mộc', mote: 'lá non', color: '#58c46a' },
  火: { name: 'Ly Hỏa', mote: 'đốm lửa', color: '#ff6a3c' },
  土: { name: 'Hậu Thổ', mote: 'bụi vàng', color: '#d9a64a' },
  金: { name: 'Canh Kim', mote: 'ánh kim', color: '#f2e6b8' },
  水: { name: 'Huyền Thủy', mote: 'giọt nước', color: '#4f9cff' },
};

export function vipActive(s, now = Date.now()) {
  return !!(s?.vip && s.vip.until > now);
}

/** Gia trì đã mở chưa: đủ cấp, hoặc VIP (với gia trì cho phép VIP mở sớm). */
export function unlocked(s, id, now = Date.now()) {
  const g = GIATRI.find((x) => x.id === id);
  if (!g) return false;
  return effLevel(s) >= g.lv || (g.vip && vipActive(s, now));
}

export function unlockedList(s, now = Date.now()) {
  return GIATRI.filter((g) => unlocked(s, g.id, now)).map((g) => g.id);
}

/** Tiến độ tới cấp sau: { level, xp, from, to, pct } */
export function levelInfo(s) {
  const xp = s?.xp || 0, raw = levelOf(xp), level = effLevel(s);
  const from = xpFor(level), to = xpFor(level + 1);
  return { level, raw, capped: level < raw, xp, from, to, pct: Math.round(((xp - from) / (to - from)) * 100) };
}

/** Gia trì vừa mở khi xp tăng từ a → b (để báo cho người chơi). */
export function newlyUnlocked(a, b) {
  const la = levelOf(a), lb = levelOf(b);
  return lb > la ? GIATRI.filter((g) => g.lv > la && g.lv <= lb) : [];
}
