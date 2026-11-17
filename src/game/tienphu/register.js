// ============================================================================
//  ĐĂNG KÝ VA CHẠM THEO ĐẶC TẢ của một tiên phủ vào thế giới (thuần JS — test Node dùng được). Cục bộ phủ → thế giới
//  bằng m.toWorld + m.ry. Sàn lầu / bậc / hố / hồ / tường / vách / lan can thang (TIEN-PHU-MANIFEST §4, §5).
// ============================================================================
import { addPlatform, addPolyPlatform, addPit, addSolid3, addSolidOBB, addTall } from '../obstacles.js';
import { addPool } from '../water.js';
import { tienCollision } from './plan.js';

const DONE = new Set();
/** m: khuôn viên (mansions.estates — m.tp = tienPlan) */
export function registerTien(m) {
  if (DONE.has(m.h)) return; DONE.add(m.h);
  const C = tienCollision(m.tp), W = (x, z) => m.toWorld(x, z), R = m.ry;
  for (const q of C.plats) { const p = W(q.x, q.z); addPlatform(p.x, p.z, q.w, q.d, (q.ry || 0) + R, q.top, q.bot ?? -Infinity, false, !!q.base); }
  for (const q of C.polys) { const p = W(q.x, q.z); addPolyPlatform(p.x, p.z, q.n, q.a, (q.ry || 0) + R, q.top, q.bot ?? -Infinity, !!q.base); }
  for (const q of C.pits) { const p = W(q.x, q.z); addPit({ ...q, x: p.x, z: p.z, ry: (q.ry || 0) + R }); }
  for (const q of C.pools) { const p = W(q.x, q.z); addPool({ ...q, x: p.x, z: p.z, ry: (q.ry || 0) + R }); }
  for (const q of C.s3) { const p = W(q.x, q.z); addSolid3(p.x, p.z, q.hw, q.hd, (q.ry || 0) + R, q.y0, q.y1); }
  for (const q of C.s2) { const p = W(q.x, q.z); addSolidOBB(p.x, p.z, q.hw, q.hd, (q.ry || 0) + R); }
  for (const q of C.tall) { const p = W(q.x, q.z); addTall(p.x, p.z, q.hw, q.hd, (q.ry || 0) + R, q.top); }
  return C;
}
