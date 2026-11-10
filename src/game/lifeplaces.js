// ============================================================================
//  NƠI SINH HOẠT quanh Sơn Môn (thuần — vị trí, va chạm, điểm tương tác; lifeplaces3d.js dựng hình):
//   · Quầy cơm Sơn Môn (ngoài cổng Nam, dải trống phía Đông dọc tường Sơn Môn) — bán cơm bình dân, nơi giao nước
//   · Liêu xá Sơn Môn (sau quầy cơm) — thuê giường chung / phòng đơn, ngủ
//   · Giếng Đông (cuối dải trống, ~30 m — đường thẳng không vướng nhà) — múc nước (việc vặt gánh nước)
//   Vị trí chọn theo ô trống của lưới va chạm Nội Thành (nhà phố, dãy sạp, cột đèn).
//   · Hỏa Vân Tửu Lâu (công trình có sẵn ở Ly cung, (30, 120)) — tiểu nhị trước cửa: thực đơn tửu lâu
// ============================================================================
import { addSolidCircle } from './obstacles.js';
import { setOpenSpots } from './rooms.js';

export const KEY = 'life:sonmon';
export const STALL = { x: 38, z: 74, ry: Math.PI / 2, w: 6, d: 4 };    // quầy quay mặt về phía giếng (+x)
export const DORM = { x: 44, z: 89, ry: -Math.PI / 2, w: 15, d: 11 };   // liêu xá quay mặt về phía Tây (−x)
export const WELL = { x: 74, z: 73, r: 1.3 };
export const TAVERN_DOOR = { x: 16.8, z: 120 };
export const SPOTS = [
  { id: 'stall', kind: 'life', name: 'Quầy cơm Sơn Môn', verb: 'Ăn ở quầy cơm · giao nước', x: STALL.x + 4.4, z: STALL.z, r: 2.6, menu: 'stall' },
  { id: 'dorm', kind: 'life', name: 'Liêu xá Sơn Môn', verb: 'Thuê chỗ ngủ · ngủ', x: DORM.x - DORM.d / 2 - 1.6, z: DORM.z, r: 2.6 },
  { id: 'well', kind: 'life', name: 'Giếng Đông', verb: 'Múc nước gánh về quầy cơm', x: WELL.x - 2.4, z: WELL.z, r: 2.4 },
  { id: 'tavern', kind: 'life', name: 'Hỏa Vân Tửu Lâu', verb: 'Gọi món ở tửu lâu', x: TAVERN_DOOR.x, z: TAVERN_DOOR.z, r: 2.8, menu: 'tuu' },
];
export const spotById = (id) => SPOTS.find((s) => s.id === id);
/** quãng gánh nước (giếng → quầy) */
export const WATER_DIST = Math.hypot(spotById('well').x - spotById('stall').x, spotById('well').z - spotById('stall').z);

let done = false;
export function registerLifePlaces() {
  if (done) return; done = true;
  // quầy + liêu xá: va chạm theo hình khối model (lifeplaces3d → collide.addFootprint)
  addSolidCircle(WELL.x, WELL.z, WELL.r);
  setOpenSpots(KEY, SPOTS);
}
