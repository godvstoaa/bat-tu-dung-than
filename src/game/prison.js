// ============================================================================
//  THIÊN LAO + KHOÁNG SƠN (thuần JS — bố cục, va chạm, điểm tương tác; prison3d.js dựng hình).
//  Nằm trên dải không gian nội thất phía Đông (ngoài biển mây, x > ROOM_X0), hàng z dương — cách xa phòng
//  lưới (z ≤ −230) và các điện thờ (z = 0). Nền (addPlatform) chính là hàng rào: ra khỏi nền là không đi được
//  (world.blockedAt chỉ cho đi trên nền ở dải này), ngự kiếm bị khoá khi đang thụ án (main.js).
// ============================================================================
import { ROOM_X0 } from './terrain.js';
import { addPlatform, addSolidRect, addSolidCircle } from './obstacles.js';
import { setOpenSpots } from './rooms.js';

export const JAIL = { key: 'law:jail', name: 'Thiên Lao', x: ROOM_X0 + 160, z: 330, w: 44, d: 34 };
export const MINE = { key: 'law:mine', name: 'Khoáng Sơn', x: ROOM_X0 + 390, z: 340, w: 96, d: 74 };
// mạch quặng: 14 điểm rải trong mỏ (tất định) — đá linh thạch có vân sáng
export const ORES = Array.from({ length: 14 }, (_, i) => {
  const a = i * 2.39996, r = 10 + (i % 5) * 6.2;
  return { id: `ore${i}`, x: MINE.x + Math.cos(a) * r * 1.25, z: MINE.z - 4 + Math.sin(a) * r * 0.82 };
});
// phòng giam: 4 gian dọc vách Bắc của Thiên Lao (trang trí — cửa song mở, người tù đi lại trong sân lao)
export const CELLS = [-15, -5, 5, 15].map((dx) => ({ x: JAIL.x + dx, z: JAIL.z - JAIL.d / 2 + 4, w: 8, d: 7 }));
export const jailSpawn = () => ({ x: JAIL.x, z: JAIL.z + 4 });
export const mineSpawn = () => ({ x: MINE.x, z: MINE.z + MINE.d / 2 - 6 });
const inBox = (b, x, z, pad = 0) => Math.abs(x - b.x) <= b.w / 2 + pad && Math.abs(z - b.z) <= b.d / 2 + pad;
/** đang ở đâu: 'jail' | 'mine' | null */
export const prisonAt = (x, z) => (inBox(JAIL, x, z, 1) ? 'jail' : inBox(MINE, x, z, 1) ? 'mine' : null);

let done = false;
/** Đăng ký nền, vách, điểm tương tác (một lần) */
export function registerPrison() {
  if (done) return; done = true;
  for (const b of [JAIL, MINE]) {
    addPlatform(b.x, b.z, b.w, b.d, 0, 0);
    // vách bao 0,6 m (nền đã chặn — vách để camera / leo trèo không lọt)
    addSolidRect(b.x - b.w / 2, b.z - b.d / 2, b.x + b.w / 2, b.z - b.d / 2 + 0.6);
    addSolidRect(b.x - b.w / 2, b.z + b.d / 2 - 0.6, b.x + b.w / 2, b.z + b.d / 2);
    addSolidRect(b.x - b.w / 2, b.z - b.d / 2, b.x - b.w / 2 + 0.6, b.z + b.d / 2);
    addSolidRect(b.x + b.w / 2 - 0.6, b.z - b.d / 2, b.x + b.w / 2, b.z + b.d / 2);
  }
  // vách ngăn giữa các gian lao (song cửa mặt trước để ngỏ)
  for (const c of CELLS) { addSolidRect(c.x - c.w / 2, c.z - c.d / 2, c.x - c.w / 2 + 0.6, c.z + c.d / 2); addSolidRect(c.x + c.w / 2 - 0.6, c.z - c.d / 2, c.x + c.w / 2, c.z + c.d / 2); }
  for (const o of ORES) addSolidCircle(o.x, o.z, 1.1);
  setOpenSpots(JAIL.key, [
    { id: 'warden', kind: 'law', name: 'Cai Ngục', verb: 'Hỏi cai ngục · hạn tù', x: JAIL.x, z: JAIL.z + JAIL.d / 2 - 4, r: 2 },
    { id: 'book', kind: 'law', name: 'Bia Huyền Thành Luật', verb: 'Đọc bộ luật', x: JAIL.x - 12, z: JAIL.z + JAIL.d / 2 - 4, r: 2 },
  ]);
  setOpenSpots(MINE.key, [
    { id: 'overseer', kind: 'law', name: 'Giám Mỏ', verb: 'Gặp Giám Mỏ · Đại Xá', x: MINE.x, z: MINE.z + MINE.d / 2 - 3, r: 2.2 },
    ...ORES.map((o) => ({ id: o.id, kind: 'ore', name: 'Mạch linh khoáng', verb: 'Đào quặng', x: o.x, z: o.z, r: 2.4 })),
  ]);
}
