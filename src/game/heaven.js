// ============================================================================
//  CỬU TRỌNG THIÊN (thuần JS, tất định — NHA-DIADIEM-MANIFEST §2): chín đảo trời ở dải không gian phía Đông.
//   · đảo giữa Quân Thiên (phủ 100 × 100 m + quảng trường ngọc 30 m) · 8 đảo ngoài cách tâm R = 280 m theo 8 phương
//     (Hoài Nam Tử «Thiên văn huấn»: Thương Đông, Biến Đông Bắc, Huyền Bắc, U Tây Bắc, Hạo Tây, Chu Tây Nam, Viêm Nam, Dương Đông Nam)
//   · mỗi đảo một tiên phủ, cổng quay vào tâm · 8 cầu ngọc rộng 6 m nối quảng trường giữa với sân trước cổng mỗi đảo
//   · Nam Thiên Môn ở mép Nam quảng trường giữa — điểm đến / «Hạ phàm»
//  Dải phía Đông: ra khỏi nền (addPlatform) là không đi được → nền đảo + cầu chính là lối đi (như Thiên Lao, prison.js).
// ============================================================================
import { ROOM_X0 } from './terrain.js';
import { TIEN_PLAN } from './estate-layout.js';
import { TIEN_H0 } from './estate-core.js';
import { addPlatform } from './obstacles.js';
import { setOpenSpots } from './rooms.js';

export const HEAVEN = { key: 'heaven', name: 'Cửu Trọng Thiên', cx: ROOM_X0 + 1300, cz: 1300, R: 280, plaza: 30, margin: 12, apron: 10, bridgeW: 6, half: 460 };
const PLAZA_HALF = 50 + HEAVEN.plaza; // nửa cạnh nền đảo giữa (phủ 100 m + quảng trường)

/** đang ở vùng trời (dựng cảnh, ẩn Thiên Lao / mỏ, bỏ minimap thành) */
export const inHeaven = (x, z) => Math.abs(x - HEAVEN.cx) < HEAVEN.half && Math.abs(z - HEAVEN.cz) < HEAVEN.half;

const toW = (m, lx, lz) => { const c = Math.cos(m.ry), s = Math.sin(m.ry); return { x: m.x + c * lx + s * lz, z: m.z - s * lx + c * lz }; };

let CACHE = null;
/**
 * { plots: [{ i, h, id, name, g, style, W, D, x, z, ry, dir }], islands: [{ i, x, z, hw, hd, ry, centre? }],
 *   bridges: [{ i, x, z, len, w, ry, a:{x,z}, b:{x,z} }], gate: { x, z }, arrive: { x, z } }
 */
export function heavenLayout() {
  if (CACHE) return CACHE;
  const { cx, cz, R, margin, apron, bridgeW } = HEAVEN;
  const plots = [], islands = [], bridges = [];
  TIEN_PLAN.forEach((t, i) => {
    const [dx, dz] = t.dir, n = Math.hypot(dx, dz) || 1, ux = dx / n, uz = dz / n;
    const centre = !dx && !dz;
    const x = cx + ux * (centre ? 0 : R), z = cz + uz * (centre ? 0 : R);
    const ry = centre ? 0 : Math.atan2(-ux, -uz); // cổng (+z cục bộ) quay vào tâm; đảo giữa quay về Nam Thiên Môn
    const p = { i, h: TIEN_H0 + i, id: t.id, name: `${t.name} Phủ`, g: t.g, style: t.style, W: t.W, D: t.D, x, z, ry, dir: [ux, uz] };
    plots.push(p);
    if (centre) islands.push({ i, x: cx, z: cz, hw: PLAZA_HALF, hd: PLAZA_HALF, ry: 0, centre: true });
    else {
      const c = toW(p, 0, apron / 2); // nền = phủ + lề mỗi bên + sân trước cổng
      islands.push({ i, x: c.x, z: c.z, hw: t.W / 2 + margin, hd: t.D / 2 + margin + apron / 2, ry });
      // cầu: từ mép quảng trường giữa (ô vuông — phương chéo chạm góc) tới mép sân trước cổng
      const r0 = (Math.abs(ux) > 0.01 && Math.abs(uz) > 0.01 ? PLAZA_HALF * Math.SQRT2 : PLAZA_HALF) - 3;
      const r1 = R - (t.D / 2 + margin + apron) + 3;
      const a = { x: cx + ux * r0, z: cz + uz * r0 }, b = { x: cx + ux * r1, z: cz + uz * r1 };
      bridges.push({ i, x: (a.x + b.x) / 2, z: (a.z + b.z) / 2, len: r1 - r0, w: bridgeW, ry, a, b });
    }
  });
  // Nam Thiên Môn đứng trên THỀM riêng (44 × 22 m) ngoài mép Nam quảng trường: điểm đến cách cổng ≥ 20 m — camera sau lưng
  // người chơi không lọt vào thân cổng (bản live 2026-11-12: điểm đến sát cổng → màn hình toàn cột đỏ)
  islands.push({ i: -1, x: cx, z: cz + PLAZA_HALF + 11, hw: 22, hd: 11, ry: 0, apron: true });
  const gate = { x: cx, z: cz + PLAZA_HALF + 13 }, arrive = { x: cx, z: cz + PLAZA_HALF - 10 };
  CACHE = { plots, islands, bridges, gate, arrive, plazaHalf: PLAZA_HALF };
  return CACHE;
}
export const tienPlot = (h) => heavenLayout().plots.find((p) => p.h === h) || null;

let done = false;
/** nền đi được (đảo + cầu) + điểm «Hạ phàm» ở Nam Thiên Môn — gọi một lần lúc dựng cảnh */
export function registerHeaven() {
  if (done) return; done = true;
  const L = heavenLayout();
  for (const s of L.islands) addPlatform(s.x, s.z, s.hw * 2, s.hd * 2, s.ry, 0);
  for (const b of L.bridges) addPlatform(b.x, b.z, b.w, b.len, b.ry, 0);
  setOpenSpots(HEAVEN.key, [{ id: 'down', kind: 'heaven', name: 'Nam Thiên Môn', verb: 'Hạ phàm · về Sơn Môn', x: L.arrive.x + 3.5, z: L.arrive.z + 2, r: 2.6 }]);
}
