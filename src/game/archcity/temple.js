// ============================================================================
//  CÔNG TRÌNH SÂN SƠN MÔN (docs/CONG-TRINH-LAM-LAI-MANIFEST.md goal 2) — thay Meshy palace_grand / hall_main /
//  lib_pavilion2 / lib_pagoda5 / lib_pagoda_red / lib_wood_pavilion (1 texture cho cả công trình → mờ, hình đúc chảy).
//  Nguyên mẫu quần thể đạo quán Bạch Vân Quán / cung đình Thanh: Chính Đường (Tam Thanh điện) 9 gian yết sơn ngói vàng
//  có đấu củng; điện phụ Đông / Tây 5 gian ngói xanh; chung lâu / cổ lâu 2 tầng; bảo tháp lâu các bát giác 5 tầng (Bắc)
//  và tháp vuông 3 tầng (Nam); đình Tàng Y 1 gian mở. Bộ dựng tiên phủ cn.js + vật liệu lặp theo mét.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, beam, lathe, polyRoof, roofProfile, ridgeGeo, V, box } from '../tienphu/arch/kit.js';
import { cnHall, cnLou, cnMats, column, dougongRow, geshanBay, platform, balustrade } from '../tienphu/arch/cn.js';
import { archMats, retex, consolidate } from './mats.js';

const finish = (acc, name) => {
  const g = acc.build({ ...cnMats(), ...archMats() }, name);
  retex(g);
  return consolidate(g); // gộp theo ảnh texture: ~8 lưới / công trình (trước gộp ~15 → lệnh vẽ +30 % ở cổng — đo lamlai-perf)
};
export const TEMPLE_SPECS = {
  // Chính Đường 9 gian (rộng ~42 m — khớp MAIN_HALL.w 44, va chạm court.js z −46…−17)
  main: { type: 'hall', bays: [3.6, 4.2, 4.8, 5.4, 6.0, 5.4, 4.8, 4.2, 3.6], D: 15, corr: 2.6, colH: 6.2, colD: 0.62, plinth: 1.2, dagong: 0.095, stairs3: true, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile: 'Yellow', beasts: 7, ridgeH: 1.2, lift: 0.6 } },
  side: { type: 'hall', bays: [3.6, 4.2, 4.8, 4.2, 3.6], D: 10.5, corr: 2.0, colH: 4.6, plinth: 0.9, dagong: 0.075, frontDoors: 'all', backDoors: false, roof: { type: 'xieshan', tile: 'Green', beasts: 5, ridgeH: 0.9, lift: 0.5 } },
  bell: { type: 'lou', bays: [3.0, 3.8, 3.0], D: 9.2, corr: 1.2, h1: 4.6, h2: 3.8, colH: 3.8, plinth: 1.0, frontDoors: 'center1', backDoors: true, roof: { type: 'xieshan', tile: 'Green', ridgeH: 0.75, lift: 0.6, beasts: 3 } },
  kiosk: { type: 'hall', bays: [5.6], D: 3.8, colH: 3.1, plinth: 0.3, open: true, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.5, lift: 0.4 } },
};
const CACHE = new Map();
export function templeGroup(id) {
  if (CACHE.has(id)) return CACHE.get(id);
  let g = null;
  if (TEMPLE_SPECS[id]) { const s = TEMPLE_SPECS[id], r = (s.type === 'lou' ? cnLou : cnHall)({ ...s }); g = finish(r.acc, `tp:${id}`); g.userData.info = r.info; }
  else if (id === 'pagodaN') g = pagoda({ n: 8, a0: 3.6, tiers: 5, h0: 4.4, h: 3.1, shrink: 0.11, tile: 'Green', wall: 'plasterRed' });
  else if (id === 'pagodaS') g = pagoda({ n: 4, a0: 3.4, tiers: 3, h0: 4.2, h: 3.2, shrink: 0.14, tile: 'Gray', wall: 'plasterRed' });
  CACHE.set(id, g); return g;
}

/**
 * Bảo tháp lâu các (楼阁式塔) n cạnh, `tiers` tầng: đế tu di đá, mỗi tầng thân trát + cột góc + xà thải họa + đấu củng +
 * vành mái hiên (polyRoof vòng), thu nhỏ `shrink` mỗi tầng; chóp tháp đồng (tháp sát) trên mái cuối.
 */
export function pagoda({ n = 8, a0 = 3.6, tiers = 5, h0 = 4.4, h = 3.1, shrink = 0.11, tile = 'Green', wall = 'plasterRed', dk = 0.065 } = {}) {
  const acc = new Acc();
  const R = (a) => a / Math.cos(Math.PI / n), vert = (a, k) => { const t = (2 * Math.PI * k) / n + Math.PI / n; return [Math.cos(t) * R(a), Math.sin(t) * R(a)]; };
  const poly = (a, y, t, key) => { const pv = Array.from({ length: n }, (_, k) => vert(a, k)); const g = new THREE.ExtrudeGeometry(new THREE.Shape(pv.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: t, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); acc.add(key, g); };
  // đế tu di 2 cấp + bậc
  const pb = a0 + 2.6; poly(pb, 0, 0.9, 'stone'); poly(pb - 0.5, 0.9, 0.5, 'marble');
  for (let i = 0; i < 4; i++) acc.add('stone', boxB(2.4, 1.4 * (i + 1) / 4, 0.36, 0, 0, R(pb) * Math.cos(Math.PI / n) + 0.36 * (4 - i - 0.5)));
  let y = 1.4, top = y;
  for (let t = 0; t < tiers; t++) {
    const a = a0 * (1 - shrink * t), hh = t === 0 ? h0 : h, over = Math.max(1.0, 1.7 - 0.1 * t);
    // thân: vách đặc (cửa cuốn ở 4 mặt chính) + cột góc
    poly(a - 0.1, y, hh - 0.6, wall);
    for (let k = 0; k < n; k++) { const [x, z] = vert(a, k); column(acc, x, z, y, hh - 0.6, 0.36); }
    for (let k = 0; k < n; k++) {
      const [ax, az] = vert(a, k - 1), [bx, bz] = vert(a, k), mx = (ax + bx) / 2, mz = (az + bz) / 2, L = Math.hypot(mx, mz), len = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2;
      acc.add(k % 2 ? 'beam' : 'beam2', beam(V(ax, y + hh - 0.85, az), V(bx, y + hh - 0.85, bz), 0.32, 0.45));
      if (n === 4 || k % 2 === 0) acc.add('door', box(Math.min(1.6, len * 0.5), Math.min(2.3, hh - 1.2), 0.12, mx * 1.01, y + Math.min(2.3, hh - 1.2) / 2 + 0.05, mz * 1.01, ry));
      dougongRow(acc, ax, az, bx, bz, y + hh - 0.62, mx / L, mz / L, dk, 11 * dk * 1.6, k);
    }
    const yc = y + hh - 0.62 + 10.6 * dk + 0.15, ae = a + over, last = t === tiers - 1, aN = last ? 0 : a0 * (1 - shrink * (t + 1));
    const run = last ? ae : ae - aN + 0.2;
    const prof = roofProfile(run, last ? [[over, 0.32], 0.6, 0.9, 1.15] : [[over, 0.32], 0.5], 0, 12);
    const r = polyRoof({ n, ae, yE: yc - over * 0.25, prof, lift: 0.45, ribW: 0.13, rib: 0.36 });
    acc.add(`tile${tile}`, r.tiles); if (r.ribs) acc.add(`rib${tile}`, r.ribs); acc.add(`ridge${tile}`, r.eaveEdge);
    for (const pts of r.ridges) acc.add(`ridge${tile}`, ridgeGeo(pts, 0.26, 0.26));
    if (!last) { poly(aN + 0.25, r.top - 0.3, 0.45, 'wood'); y = r.top + 0.15; }                          // bình tọa tầng trên
    else { acc.add('gold', lathe([[0.7, 0], [0.55, 0.3], [0.35, 0.5], [0.5, 0.9], [0.48, 1.3], [0.2, 1.6], [0.32, 1.9], [0.24, 2.3], [0.3, 2.7], [0.12, 3.1], [0.16, 3.4], [0.001, 4.2]], 0, r.top - 0.2, 0, 12)); top = r.top + 4; }
  }
  const g = finish(acc, `pagoda${n}`); g.userData.info = { top, a0 };
  return g;
}
