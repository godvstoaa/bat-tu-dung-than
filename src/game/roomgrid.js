// ============================================================================
//  LƯỚI PHÒNG NỘI THẤT (thuần, không phụ thuộc) — gốc toạ độ mỗi ô phòng và cỡ phòng tiệm theo loại.
//  Tách khỏi rooms.js để máy chủ (worker/guild.js qua guild-core.js) biết người chơi có đứng trong tiệm không
//  mà không phải nạp cả bộ dựng phòng.
// ============================================================================
import { ROOM_X0 } from './terrain.js';

// v4 (thành ×10, ~8.100 tiệm): lưới 76 cột × ~121 hàng (2.280 m × 3.630 m, trong biên thế giới z ≥ −4.096)
export const COLS = 76, STEP = 30, X0 = ROOM_X0, Z0 = -230;
export const SLOT_EST = 9000, SLOT_TEMPLE = 9100; // dải chỉ số: tiệm 0–8.999 · nhà rao bán · miếu
export const slotOrigin = (k) => ({ x: X0 + (k % COLS) * STEP, z: Z0 - Math.floor(k / COLS) * STEP });
// [rộng, sâu, cao] (m) — loại không có trong bảng: 14 × 12 × 6
export const SHOP_SIZE = { moc: [20, 16, 6], gom: [16, 13, 6], hoavien: [16, 14, 6], tuu: [20, 16, 7], tralau: [18, 15, 6], namon: [20, 16, 8], dichtram: [16, 12, 6], phongthuy: [16, 14, 7] };
export const shopSize = (type) => SHOP_SIZE[type] || [14, 12, 6];
