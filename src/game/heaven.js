// ============================================================================
//  CỬU TRỌNG THIÊN (thuần JS, tất định — docs/TIEN-PHU-MANIFEST.md §2; trước đó NHA-DIADIEM-MANIFEST §2):
//  chín đảo trời ở dải không gian phía Đông, mỗi đảo một TIÊN PHỦ 520 × 520 m (gấp 4,42 phủ Cung Vương 61.120 m²).
//   · đảo giữa Quân Thiên (cổng quay Nam) + quảng trường 70 m phía Nam có Nam Thiên Môn
//   · 4 đảo chính phương cách tâm 900 m (Hoài Nam Tử «Thiên văn huấn»: Thương Đông, Huyền Bắc, Hạo Tây, Viêm Nam)
//   · 4 đảo góc ở (±795, ±795) xoay 45° (Biến Đông Bắc, U Tây Bắc, Chu Tây Nam, Dương Đông Nam); cổng mọi đảo quay vào tâm
//   · cầu ngọc rộng 10 m: đảo giữa ↔ 4 chính phương (theo trục) và ↔ 4 góc (theo đường chéo, từ góc đảo giữa)
//  Toàn vùng trong biên máy chủ: x ∈ [ROOM_X0, ROOM_X0 + 2360] (protocol.WORLD_TILES), z ∈ [570, 2930] (xa Thiên Lao / mỏ).
//  Đi lại: vật lý thật (motion.moveFree) — nền đảo / cầu; lan can mép đảo + hai bên cầu là VẬT CẢN (chừa miệng cầu).
// ============================================================================
import { ROOM_X0 } from './terrain.js';
import { TIEN_PLAN } from './estate-layout.js';
import { TIEN_H0 } from './estate-core.js';
import { addPlatform, addSolidOBB, addOpenZone, addTall } from './obstacles.js';
import { addDryZone } from './water.js';
import { setOpenSpots } from './rooms.js';
import { TP_W, TP_D } from './tienphu/plan.js';

export const HEAVEN = { key: 'heaven', name: 'Cửu Trọng Thiên', cx: ROOM_X0 + 1180, cz: 1750, R: 900, Rd: 795, margin: 10, apron: 14, plazaD: 70, bridgeW: 10, half: 1180 };

// THIÊN THÊ (goal G-6.1): thang mây ngoài tường Đông Sơn Môn (khoảng trống 16 × 24 m dò bằng lưới va chạm — ra cổng Bắc sân
// rồi rẽ Đông là tới). Chỗ cũ (56, −163) kẹt giữa tường gạch và nhà dân.
export const THIEN_THE = { x: 78, z: -50 };
export const inHeaven = (x, z) => Math.abs(x - HEAVEN.cx) < HEAVEN.half && Math.abs(z - HEAVEN.cz) < HEAVEN.half;

const toW = (m, lx, lz) => { const c = Math.cos(m.ry), s = Math.sin(m.ry); return { x: m.x + c * lx + s * lz, z: m.z - s * lx + c * lz }; };

let CACHE = null;
/**
 * { plots: [{ i, h, id, name, g, style, W, D, x, z, ry, dir }], islands: [{ i, x, z, hw, hd, ry, centre? }],
 *   bridges: [{ i, x, z, len, w, ry, a:{x,z}, b:{x,z} }], gate: { x, z }, arrive: { x, z }, rails: [{ax,az,bx,bz}] }
 */
export function heavenLayout() {
  if (CACHE) return CACHE;
  const { cx, cz, R, Rd, margin, apron, plazaD, bridgeW } = HEAVEN;
  const plots = [], islands = [], bridges = [];
  const hw = TP_W / 2 + margin, hd = TP_D / 2 + margin;
  TIEN_PLAN.forEach((t, i) => {
    const [dx, dz] = t.dir, n = Math.hypot(dx, dz) || 1, ux = dx / n, uz = dz / n;
    const centre = !dx && !dz, diag = !!dx && !!dz;
    const dist = centre ? 0 : diag ? Rd * Math.SQRT2 : R;
    const x = cx + ux * dist, z = cz + uz * dist;
    const ry = centre ? 0 : Math.atan2(-ux, -uz); // cổng (+z cục bộ) quay vào tâm; đảo giữa quay Nam (Nam Thiên Môn)
    const p = { i, h: TIEN_H0 + i, id: t.id, name: `${t.name} Phủ`, g: t.g, style: t.style, W: TP_W, D: TP_D, x, z, ry, dir: [ux, uz] };
    plots.push(p);
    if (centre) islands.push({ i, x: cx, z: cz + plazaD / 2, hw, hd: hd + plazaD / 2, ry: 0, centre: true });
    else {
      const c = toW(p, 0, apron / 2);
      islands.push({ i, x: c.x, z: c.z, hw, hd: hd + apron / 2, ry });
    }
  });
  // cầu: từ mép đảo giữa (theo hướng) tới mép sân trước cổng đảo ngoài — chồng 3 m vào nền hai đầu
  const C = islands.find((s) => s.centre), cH = { x0: cx - C.hw, x1: cx + C.hw, z0: cz - hd, z1: cz + hd + plazaD };
  plots.forEach((p) => {
    if (!p.i) return;
    const [ux, uz] = p.dir, diag = Math.abs(ux) > 0.01 && Math.abs(uz) > 0.01;
    // tia từ tâm đảo giữa ra theo (ux, uz): khoảng tới mép chữ nhật đảo giữa
    const tx = ux > 0 ? (cH.x1 - cx) / ux : ux < 0 ? (cH.x0 - cx) / ux : Infinity, tz = uz > 0 ? (cH.z1 - cz) / uz : uz < 0 ? (cH.z0 - cz) / uz : Infinity;
    const r0 = Math.min(tx, tz) - 3;
    const r1 = Math.hypot(p.x - cx, p.z - cz) - (TP_D / 2 + margin + apron) + 3;
    const a = { x: cx + ux * r0, z: cz + uz * r0 }, b = { x: cx + ux * r1, z: cz + uz * r1 };
    bridges.push({ i: p.i, x: (a.x + b.x) / 2, z: (a.z + b.z) / 2, len: r1 - r0, w: bridgeW, ry: Math.atan2(ux, uz), a, b, diag });
  });
  // Nam Thiên Môn ở mép Nam quảng trường (cổng mở ra cầu Nam sang Viêm Thiên); điểm đến giữa quảng trường
  const gate = { x: cx, z: cz + hd + plazaD - 8 }, arrive = { x: cx, z: cz + hd + plazaD / 2 };
  const rails = railSegments(islands, bridges, gate);
  CACHE = { plots, islands, bridges, gate, arrive, rails, plazaHalf: hd };
  return CACHE;
}
export const tienPlot = (h) => heavenLayout().plots.find((p) => p.h === h) || null;

/** lan can mép đảo (chừa miệng cầu) + hai bên cầu: đoạn thẳng [{ ax, az, bx, bz }] — heaven3d dựng, registerHeaven chặn */
function railSegments(islands, bridges, gate) {
  const out = [];
  const gapAt = (x, z) => bridges.some((b) => { const ux = (b.b.x - b.a.x) / b.len, uz = (b.b.z - b.a.z) / b.len, dx = x - b.a.x, dz = z - b.a.z, along = dx * ux + dz * uz, side = Math.abs(dx * uz - dz * ux); return side < b.w / 2 + 0.4 && along > -4 && along < b.len + 4; })
    || Math.hypot(x - gate.x, z - gate.z) < 6;
  const W = (s, lx, lz) => { const c = Math.cos(s.ry), sn = Math.sin(s.ry); return [s.x + c * lx + sn * lz, s.z - sn * lx + c * lz]; };
  const edge = (ax, az, bx, bz) => {
    const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 3));
    let run = null;
    for (let i = 0; i < n; i++) {
      const x0 = ax + (bx - ax) * (i / n), z0 = az + (bz - az) * (i / n), x1 = ax + (bx - ax) * ((i + 1) / n), z1 = az + (bz - az) * ((i + 1) / n);
      if (gapAt((x0 + x1) / 2, (z0 + z1) / 2)) { if (run) { out.push(run); run = null; } continue; }
      if (run) { run.bx = x1; run.bz = z1; } else run = { ax: x0, az: z0, bx: x1, bz: z1 };
    }
    if (run) out.push(run);
  };
  for (const s of islands) { const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => W(s, a * (s.hw - 0.3), b * (s.hd - 0.3))); for (let i = 0; i < 4; i++) edge(...q[i], ...q[(i + 1) % 4]); }
  for (const b of bridges) for (const sd of [-1, 1]) {
    const ux = (b.b.x - b.a.x) / b.len, uz = (b.b.z - b.a.z) / b.len, ox = uz * sd * (b.w / 2 - 0.25), oz = -ux * sd * (b.w / 2 - 0.25);
    out.push({ ax: b.a.x + ux * 4 + ox, az: b.a.z + uz * 4 + oz, bx: b.b.x - ux * 4 + ox, bz: b.b.z - uz * 4 + oz });
  }
  return out;
}

let done = false;
/** nền đi được (đảo base + cầu) + lan can chặn + vùng mở / khô + điểm «Hạ phàm» — gọi một lần lúc dựng cảnh */
export function registerHeaven() {
  if (done) return; done = true;
  const L = heavenLayout(), { cx, cz, half } = HEAVEN;
  for (const s of L.islands) addPlatform(s.x, s.z, s.hw * 2, s.hd * 2, s.ry, 0, -Infinity, false, true); // base: lòng hồ tiên phủ khoét qua
  for (const b of L.bridges) addPlatform(b.x, b.z, b.w, b.len + 6, b.ry, 0);
  for (const r of L.rails) { const len = Math.hypot(r.bx - r.ax, r.bz - r.az); const ry = Math.atan2(-(r.bz - r.az), r.bx - r.ax); addSolidOBB((r.ax + r.bx) / 2, (r.az + r.bz) / 2, len / 2, 0.3, ry); addTall((r.ax + r.bx) / 2, (r.az + r.bz) / 2, len / 2, 0.3, ry, 1.15); }
  addOpenZone(cx - half, cz - half, cx + half, cz + half);
  addDryZone(cx - half - 40, cz - half - 40, cx + half + 40, cz + half + 40);
  setOpenSpots(HEAVEN.key, [
    { id: 'down', kind: 'heaven', name: 'Nam Thiên Môn', verb: 'Hạ phàm · về Sơn Môn', x: L.arrive.x + 3.5, z: L.arrive.z + 2, r: 2.6 },
    { id: 'up', kind: 'heaven', name: 'Thiên Thê', verb: 'Bước lên thang mây · Cửu Trọng Thiên', x: THIEN_THE.x, z: THIEN_THE.z + 3, r: 3 },
  ]);
}
