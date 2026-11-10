// ============================================================================
//  MỎ DÂN SỰ KHOÁNG SƠN (thuần — nền, vách, điểm tương tác; jobplaces3d.js dựng hình).
//  Dải nội thất phía Đông, cạnh mỏ khổ sai (prison.js) nhưng tách hẳn: thợ mỏ làm thuê lấy Văn, không phải tù.
//  Xuống mỏ bằng xe goòng ở Lò Rèn (interior-build › điểm 'job:cart'), về bằng xe goòng trong mỏ.
// ============================================================================
import { addPlatform, addSolidRect, addSolidCircle } from './obstacles.js';
import { setOpenSpots } from './rooms.js';
import { CMINE, ORE_NODES } from './guild-core.js';

export { CMINE, ORE_NODES };
export const CART = { x: CMINE.x - CMINE.w / 2 + 6, z: CMINE.z + CMINE.d / 2 - 6 };
export const BOSS = { x: CMINE.x + 6, z: CMINE.z + CMINE.d / 2 - 4 };

let done = false;
export function registerJobPlaces() {
  if (done) return; done = true;
  const b = CMINE;
  addPlatform(b.x, b.z, b.w, b.d, 0, 0);
  addSolidRect(b.x - b.w / 2, b.z - b.d / 2, b.x + b.w / 2, b.z - b.d / 2 + 0.6);
  addSolidRect(b.x - b.w / 2, b.z + b.d / 2 - 0.6, b.x + b.w / 2, b.z + b.d / 2);
  addSolidRect(b.x - b.w / 2, b.z - b.d / 2, b.x - b.w / 2 + 0.6, b.z + b.d / 2);
  addSolidRect(b.x + b.w / 2 - 0.6, b.z - b.d / 2, b.x + b.w / 2, b.z + b.d / 2);
  for (const o of ORE_NODES) addSolidCircle(o.x, o.z, 1.1);
  setOpenSpots(CMINE.key, [
    { id: 'boss', kind: 'job', name: 'Đốc công mỏ', verb: 'Gặp đốc công · vào ca / tan ca', x: BOSS.x, z: BOSS.z, r: 2.2 },
    { id: 'cart', kind: 'job', name: 'Xe goòng về thành', verb: 'Lên xe goòng về Lò Rèn', x: CART.x + 2.6, z: CART.z, r: 2.4 },
    ...ORE_NODES.map((o) => ({ id: o.id, kind: 'job', ore: true, name: 'Mạch quặng', verb: 'Đào quặng', x: o.x, z: o.z + 2.2, r: 2.2 })),
  ]);
}
