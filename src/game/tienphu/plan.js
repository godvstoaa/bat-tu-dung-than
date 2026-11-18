// ============================================================================
//  QUY HOẠCH TIÊN PHỦ 520 × 520 m (thuần JS, tất định). Khung cục bộ: gốc = tâm phủ, +z = cổng chính, mặt đảo y = 0.
//  Mỗi phủ một TỔNG MẶT BẰNG riêng theo nguyên mẫu (siteplans.js — docs/TIEN-PHU-MATBANG-MANIFEST.md); file này chuyển bản vẽ
//  thành quy hoạch đầy đủ (tường, cổng, lối, đèn, cây, vùng bài trí).
//  tienPlan(i) → { W, D, style, S (archkit-style), buildings, pavs, tower, walls, gates, water, islands, bridges, rockery,
//                  paths, trees, lamps, rocks, benches, statues, zones, gate, mound, towers: [] }
//  Hình học va chạm theo đặc tả (sàn, bậc, hố, hồ, tường bao, vách sảnh): tienCollision(plan) — dùng chung lúc nạp
//  (heaven.js) và test Node. Chi tiết nhỏ (cột, lan can, tượng, đèn, cây…) lấy từ chính lưới hình (tienphu/voxel.js).
// ============================================================================
import { tpStyle, FLOOR_THEMES } from './styles.js';
import { towerSpec, towerCollision, floorZone, LEVELS, FH } from './tower.js';
import { sitePlan } from './siteplans.js';
import { ARCH_FOOT } from './arch/footprints.gen.js';
import { FLORA, crownR } from './flora-spec.js';

/** gắn số đo kiến trúc thật (arch/footprints.gen.js) vào một nhà / đình: b.arch, b.foot, w/d = hộp chiếm đất, cx/cz = tâm hộp so với gốc,
 *  front = mép trước (cục bộ), plinth = cao nền, h = cao thân. Không có đặc tả → giữ nguyên (bộ dựng cũ). */
export function archFit(b, sid) {
  const key = `${sid}/${b.id}`, f = ARCH_FOOT[key]; if (!f) return b;
  const [x0, z0, x1, z1] = f.bb;
  return Object.assign(b, { arch: key, foot: f, w: x1 - x0, d: z1 - z0, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, front: z1, plinth: f.ph, h: Math.max(3, f.top - f.ph), body: f.body });
}
/** tâm hộp chiếm đất (cục bộ phủ) của nhà / đình đã archFit */
export const footCenter = (b) => { const c = Math.cos(b.ry || 0), s = Math.sin(b.ry || 0), cx = b.cx || 0, cz = b.cz || 0; return { x: b.x + c * cx + s * cz, z: b.z - s * cx + c * cz }; };

export const TP_W = 520, TP_D = 520;
const Q = Math.PI / 2;
const HW = TP_W / 2, HD = TP_D / 2;
export const POOL_LEVEL = -0.3;

/** rng tất định */
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** archkit-style STYLE từ phong cách tiên phủ (+ tuỳ biến màu của chủ phủ) */
export function archStyle(st, opts = null) {
  const h = st.hall, o = opts || {};
  return {
    name: `TP ${st.name}${o.key ? ` #${o.key}` : ''}`, fam: h.fam, roof: h.roof, roofCol: o.roofCol || st.roofCol, roofTint: o.roofCol || st.roofCol,
    wall: o.wallCol || st.wall, trim: o.trimCol || st.trim, water: 'lotus', fence: st.fence, trees: st.trees, floors: 2, plinth: h.plinth,
    portico: !!h.portico, dome: st.id === 'tancodien', arches: st.id === 'mughal' || st.id === 'gothic', turrets: st.id === 'gothic', timber: false,
  };
}

const CACHE = new Map();
/** quy hoạch tiên phủ thứ i (0 = Quân Thiên … 8 = Dương Thiên) — đọc TỔNG MẶT BẰNG riêng của phong cách (siteplans.js) */
export function tienPlan(i) {
  if (CACHE.has(i)) return CACHE.get(i);
  const st = tpStyle(i), r = rng(1009 + i * 7919), D = sitePlan(st);
  const P = { i, W: TP_W, D: TP_D, st, S: archStyle(st), site: D, buildings: [], pavs: [], walls: [], gates: [], water: [], islands: [], bridges: [], paths: [], trees: [], lamps: [], rocks: [], benches: [], statues: [], beds: [], zones: [], towers: [], rockery: null };
  const hp = st.hall.plinth;
  // ---------------- tường bao + cổng chính (giữa mặt Nam — cầu ngọc nối vào) + cổng hông theo bản vẽ
  const wallH = st.wallH, wallT = 1.6, gateW = 10;
  P.gate = { w: gateW };
  const seg = (x0, z0, x1, z1, h = wallH, t = wallT) => { const len = Math.hypot(x1 - x0, z1 - z0); if (len > 0.05) P.walls.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, len, ry: Math.atan2(-(z1 - z0), x1 - x0), h, t }); };
  P.gates.push({ id: 'main', x: 0, z: HD, ry: 0, w: gateW, main: true });
  for (const g of D.sideGates || []) P.gates.push({ id: g.id, x: g.x, z: g.z, w: g.w, ry: g.z <= -HD + 0.1 ? Math.PI : g.x >= HW - 0.1 ? -Q : Q });
  const side = (pick, along) => P.gates.filter(pick).map((g) => [along(g), g.w]).sort((a, b) => a[0] - b[0]);
  const run = (a0, a1, gaps, mk) => { let a = a0; for (const [c, w] of gaps) { if (c - w / 2 > a) mk(a, c - w / 2); a = c + w / 2; } if (a1 > a) mk(a, a1); };
  run(-HW, HW, side((g) => g.z >= HD - 0.1, (g) => g.x), (a, b) => seg(a, HD, b, HD));
  run(-HW, HW, side((g) => g.z <= -HD + 0.1, (g) => g.x), (a, b) => seg(a, -HD, b, -HD));
  run(-HD, HD, side((g) => g.x >= HW - 0.1, (g) => g.z), (a, b) => seg(HW, a, HW, b));
  run(-HD, HD, side((g) => g.x <= -HW + 0.1, (g) => g.z), (a, b) => seg(-HW, a, -HW, b));
  // tường trong (vòng thành / ngăn khu) theo bản vẽ
  for (const [x0, z0, x1, z1, h, t] of D.walls || []) seg(x0, z0, x1, z1, h, t);
  // ---------------- công trình theo bản vẽ (buildings[0] = công trình chính)
  for (const b of D.buildings) P.buildings.push(archFit({ floors: 1, back: false, ry: 0, plinth: hp, ...b }, st.id));
  // ---------------- lầu chính 10 tầng
  const spec = towerSpec(st);
  P.tower = { x: D.tower.x, z: D.tower.z, spec, name: `${st.id === 'nhatban' ? 'Thiên Thủ Các' : st.id === 'gothic' ? 'Tháp Lâu Đài' : st.id === 'artdeco' ? 'Thiên Kim Lâu' : st.id === 'mughal' ? 'Lăng Vọng Tinh' : st.id === 'tancodien' ? 'Thánh Điện Tháp' : st.id === 'taytang' ? 'Hồng Cung' : st.id === 'hue' ? 'Lầu Kiến Trung' : st.id === 'thai' ? 'Dusit Maha Prasat' : 'Thiên Tượng Lâu'} (10 tầng)` };
  // ---------------- nước, đảo, cầu, trang trí riêng phong cách
  for (const w of D.water) P.water.push({ level: POOL_LEVEL, floor: -1.9, ...w });
  P.islands.push(...(D.islands || []));
  P.bridges.push(...(D.bridges || []));
  for (const k of ['zen', 'fountain', 'moatIsle', 'flagPoles', 'stones', 'stupas', 'forecourt']) if (D[k]) P[k] = D[k];
  if (D.beds) P.beds.push(...D.beds);
  // ---------------- giả sơn / đài (bậc lên đỉnh) + đình đỉnh
  P.rockery = { stairW: 3.2, ...D.rockery };
  { const k = P.rockery, n = Math.round(k.h / 0.3); k.steps = n; k.rise = k.h / n; k.tread = 0.42; k.run = n * k.tread; }
  P.pavs.push({ id: 'summit', name: st.fam === 'western' || st.fam === 'modern' ? 'Đài Ngắm Cảnh' : 'Vọng Sơn Đình', x: P.rockery.x, z: P.rockery.z - 6, w: 9, d: 9, h: 3.6, octa: st.fam !== 'modern', y: P.rockery.h });
  for (const p of D.pavs) P.pavs.push(archFit({ h: 3.6, octa: false, ...p, octa: st.fam === 'modern' ? false : !!p.octa }, st.id));
  for (const il of P.islands) if (il.pav) P.pavs.push({ id: 'island', name: st.fam === 'asian' ? 'Hồ Tâm Đình' : 'Đình Giữa Hồ', x: il.x, z: il.z, w: 10, d: 10, h: 3.8, octa: true });
  // ---------------- lối đi lát: polyline → đoạn hộp (chồng nửa bề rộng ở khớp để không hở)
  for (const [w, ...pts] of D.paths) for (let k = 0; k + 1 < pts.length; k++) {
    const [x0, z0] = pts[k], [x1, z1] = pts[k + 1], len = Math.hypot(x1 - x0, z1 - z0); if (len < 0.1) continue;
    P.paths.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, w, d: len + (k + 2 < pts.length ? w * 0.5 : 0) + (k ? w * 0.5 : 0), ry: Math.atan2(x1 - x0, z1 - z0), poly: true });
  }
  // ---------------- tượng: trước công trình chính + trong cổng chính
  const main = P.buildings[0], fr = (b, u) => ({ x: b.x + Math.sin(b.ry) * u, z: b.z + Math.cos(b.ry) * u });
  if (D.statues) P.statues.push(...D.statues);
  for (const sx of [-1, 1]) { P.statues.push({ x: sx * 9, z: HD - 12, ry: 0, s: 2.4 }); const f = fr(main, main.d / 2 + 10), c = Math.cos(main.ry), s = Math.sin(main.ry); P.statues.push({ x: f.x + c * sx * 12, z: f.z - s * sx * 12, ry: main.ry, s: 2 }); }
  // ---------------- zones: vùng bài trí (k) — sảnh, tầng lầu, sân
  const zones = P.zones;
  P.buildings.forEach((b) => zones.push({ k: zones.length, kind: 'hall', id: b.id, name: b.name, x: b.x, z: b.z, w: b.arch && b.body[0] ? b.body[0] : b.w, d: b.arch && b.body[1] ? b.body[1] : b.d, h: b.arch ? Math.min(6, b.h) : b.floors > 1 ? 6 : b.h, plinth: b.plinth, ry: b.ry, back: !!b.back, main: !!b.main }));
  for (let f = 0; f <= LEVELS; f++) {
    const fz = floorZone(spec, f);
    zones.push({ k: zones.length, kind: 'hall', tower: true, floor: f, id: `floor${f + 1}`, name: f < LEVELS ? `Tầng ${f + 1} · ${FLOOR_THEMES[f].name}` : 'Vọng Đài', x: P.tower.x, z: P.tower.z, w: fz.half * 2, d: fz.half * 2, h: f < LEVELS ? FH - 0.4 : 3.2, plinth: fz.y, ry: 0, back: true, keep: fz.keep });
  }
  for (const y of D.yards || []) zones.push({ k: zones.length, kind: 'yard', ry: 0, keep: [], ...y });
  // ---------------- đèn dọc mọi lối (hai bên, mỗi 14 m, tránh công trình / nước) + cặp đèn trước công trình chính
  placeLamps(P);
  // ---------------- cây: hàng trong tường bao + rừng theo vùng của bản vẽ + cặp cây trước sảnh
  plantTrees(P, st, r, D);
  // ---------------- đá, ghế trong vùng rừng / vườn
  const G = D.groves || [];
  for (let k = 0; k < 24; k++) { const p = freeSpot(P, r, G[k % G.length], 3.5); if (p) P.rocks.push({ ...p, r: 0.8 + r() * 1.4, h: 0.8 + r() * 1.6 }); }
  for (let k = 0; k < 24; k++) { const p = freeSpot(P, r, G[(k + 1) % G.length], 2.5); if (p) P.benches.push({ ...p, ry: Math.floor(r() * 4) * Q }); }
  P.mound = { x: 0, z: -HD + 6, w: TP_W - 20, d: 8, kind: 'trees' };
  CACHE.set(i, P);
  return P;
}

/** đèn dọc lối: mỗi 14 m, hai bên (lệch rộng/2 + 1,2 m), bỏ chỗ vướng công trình / nước / đèn khác */
function placeLamps(P) {
  const L = blockers(P).filter((o) => !o.path);
  const okL = (x, z) => Math.abs(x) < HW - 4 && Math.abs(z) < HD - 4 && !hit(L, x, z, -1.5) && !P.lamps.some((l) => Math.hypot(l.x - x, l.z - z) < 7);
  for (const p of P.paths) {
    const n = Math.floor(p.d / 14), c = Math.cos(p.ry), s = Math.sin(p.ry);
    for (let k = 0; k <= n; k++) { const u = -p.d / 2 + (p.d - n * 14) / 2 + k * 14; for (const sd of [-1, 1]) { const lx = sd * (p.w / 2 + 1.2), x = p.x + c * lx + s * u, z = p.z - s * lx + c * u; if (okL(x, z)) P.lamps.push({ x, z }); } }
  }
}

// ---- vật chiếm chỗ (để trồng cây / đặt đá không đè lên) — hộp bao trục (AABB) của hình xoay
const aabb = (x, z, hw, hd, ry, mx = 0, mz = mx) => { const c = Math.abs(Math.cos(ry || 0)), s = Math.abs(Math.sin(ry || 0)); return { x, z, hw: c * hw + s * hd + mx, hd: s * hw + c * hd + mz }; };
function blockers(P) {
  if (P._bl) return P._bl;
  const L = [];
  for (const b of P.buildings) { if (b.arch) { const c = footCenter(b); L.push(aabb(c.x, c.z, b.w / 2 + 4, b.d / 2 + 4, b.ry)); continue; } const f = Math.sin(b.ry || 0), g = Math.cos(b.ry || 0); L.push(aabb(b.x + f * 1.5, b.z + g * 1.5, b.w / 2 + 6, b.d / 2 + 7.5, b.ry)); }
  for (const p of P.pavs) { const c = footCenter(p); L.push({ x: c.x, z: c.z, hw: p.w / 2 + 3, hd: p.d / 2 + 3 }); }
  const t = P.tower.spec.podium; L.push({ x: P.tower.x, z: P.tower.z + t.run / 2, hw: t.a + 6, hd: t.a + t.run / 2 + 6 });
  for (const w of P.water) L.push(w.shape === 'ellipse' ? { x: w.x, z: w.z, rx: w.rx + 4, rz: w.rz + 4 } : { x: w.x, z: w.z, hw: w.hw + 4, hd: w.hd + 4 });
  for (const p of P.paths) L.push({ ...aabb(p.x, p.z, p.w / 2, p.d / 2, p.ry, 1.2), path: true });
  for (const w of P.walls) L.push({ ...aabb(w.x, w.z, w.len / 2, w.t / 2, w.ry, 2), wall: true });
  const k = P.rockery; L.push({ x: k.x, z: k.z + k.run / 2, hw: k.w / 2 + 3, hd: k.d / 2 + k.run / 2 + 3 });
  for (const b of P.bridges) L.push(aabb(b.x, b.z, b.w / 2, b.len / 2, b.ry, 2));
  for (const b of P.beds) L.push({ x: b.x, z: b.z, hw: b.w / 2 + 1, hd: b.d / 2 + 1 });
  if (P.zen) L.push({ x: P.zen.x, z: P.zen.z, hw: P.zen.w / 2 + 2, hd: P.zen.d / 2 + 2 });
  if (P.fountain) L.push({ x: P.fountain.x, z: P.fountain.z, hw: P.fountain.r + 6, hd: P.fountain.r + 6 });
  if (P.forecourt) L.push({ x: P.forecourt.x, z: P.forecourt.z, hw: P.forecourt.w / 2, hd: P.forecourt.d / 2 });
  for (const s of P.stupas || []) L.push({ x: s.x, z: s.z, hw: s.r + 4, hd: s.r + 4 });
  for (const [x, z] of P.flagPoles || []) L.push({ x, z, hw: 2, hd: 2 });
  for (const g of P.gates) { const n = g.z >= HD - 0.1 ? [0, -1] : g.z <= -HD + 0.1 ? [0, 1] : g.x > 0 ? [-1, 0] : [1, 0]; L.push({ x: g.x + n[0] * 12, z: g.z + n[1] * 12, hw: g.main ? 22 : 12, hd: g.main ? 22 : 12 }); }
  P._bl = L; return L;
}
/** (x, z) cục bộ còn trống (không công trình / nước / cầu / cổng / lối lát) cách m — rải hoa cỏ (estate3d, DOHOA-MANIFEST §2.2) */
export function freeAt(P, x, z, m = 0.5) {
  if (Math.abs(x) > HW - 3 || Math.abs(z) > HD - 3 || hit(blockers(P).filter((o) => !o.path), x, z, m)) return false; // lối kiểm riêng bên dưới (lề 0,3 m — hoa viền sát lối)
  for (const p of P.paths) { const c = Math.cos(p.ry || 0), s = Math.sin(p.ry || 0), dx = x - p.x, dz = z - p.z; if (Math.abs(c * dx - s * dz) < p.w / 2 + 0.3 && Math.abs(s * dx + c * dz) < p.d / 2 + 0.3) return false; }
  return true;
}
const hit = (L, x, z, m = 0) => L.some((o) => (o.rx ? ((x - o.x) / (o.rx + m)) ** 2 + ((z - o.z) / (o.rz + m)) ** 2 < 1 : Math.abs(x - o.x) < o.hw + m && Math.abs(z - o.z) < o.hd + m));
function freeSpot(P, r, g, m) {
  const L = blockers(P), taken = [...P.trees, ...P.rocks, ...P.benches, ...P.lamps];
  const box = g || { x0: -HW + 12, z0: -HD + 12, x1: HW - 12, z1: HD - 12 };
  for (let t = 0; t < 60; t++) {
    const x = box.x0 + r() * (box.x1 - box.x0), z = box.z0 + r() * (box.z1 - box.z0);
    if (Math.abs(x) > HW - 8 || Math.abs(z) > HD - 8 || hit(L, x, z, m)) continue;
    if (taken.some((o) => Math.hypot(o.x - x, o.z - z) < m + 1.5)) continue;
    return { x, z };
  }
  return null;
}
function plantTrees(P, st, r, D) {
  if (FLORA[st.id]) return plantBig(P, st, r, D, FLORA[st.id]);
  return plantTreesOld(P, st, r, D);
}
/** CÂY CỔ THỤ theo «chữ ký» thực vật của phủ (flora-spec.FLORA; docs/TIEN-PHU-THUCVAT-MANIFEST.md §4). Mỗi cây { x, z, kind, s, R, role, row? } */
function plantBig(P, st, r, D, F) {
  const bld = [], pth = [], wal = [], wat = [], misc = [];
  for (const b of P.buildings) { if (b.arch) { const c = footCenter(b); bld.push(aabb(c.x, c.z, b.w / 2, b.d / 2, b.ry)); } else bld.push(aabb(b.x, b.z, b.w / 2 + 2, b.d / 2 + 3, b.ry)); }
  for (const p of P.pavs) { const c = footCenter(p); bld.push(aabb(c.x, c.z, p.w / 2, p.d / 2, p.ry)); }
  { const t = P.tower.spec.podium; bld.push({ x: P.tower.x, z: P.tower.z + t.run / 2, hw: t.a + 3, hd: t.a + t.run / 2 + 3 }); }
  for (const w of P.water) wat.push(w.shape === 'ellipse' ? { x: w.x, z: w.z, rx: w.rx, rz: w.rz } : { x: w.x, z: w.z, hw: w.hw, hd: w.hd });
  for (const p of P.paths) pth.push(aabb(p.x, p.z, p.w / 2, p.d / 2, p.ry));
  for (const w of P.walls) wal.push(aabb(w.x, w.z, w.len / 2, w.t / 2, w.ry));
  { const k = P.rockery; misc.push({ x: k.x, z: k.z + k.run / 2, hw: k.w / 2 + 2, hd: k.d / 2 + k.run / 2 + 2 }); }
  for (const b of P.bridges) misc.push(aabb(b.x, b.z, b.w / 2, b.len / 2, b.ry, 1));
  for (const b of P.beds) misc.push({ x: b.x, z: b.z, hw: b.w / 2, hd: b.d / 2 });
  if (P.zen) misc.push({ x: P.zen.x, z: P.zen.z, hw: P.zen.w / 2, hd: P.zen.d / 2 });
  if (P.fountain) misc.push({ x: P.fountain.x, z: P.fountain.z, hw: P.fountain.r + 3, hd: P.fountain.r + 3 });
  if (P.forecourt) misc.push({ x: P.forecourt.x, z: P.forecourt.z, hw: P.forecourt.w / 2, hd: P.forecourt.d / 2 });
  const inB = (o, x, z, m) => (o.rx ? ((x - o.x) / (o.rx + m)) ** 2 + ((z - o.z) / (o.rz + m)) ** 2 < 1 : Math.abs(x - o.x) < o.hw + m && Math.abs(z - o.z) < o.hd + m);
  const noYard = (D.yards || []).filter((y) => !(F.yardsOk || []).includes(y.id));
  const main = P.buildings.find((b) => b.main), mainZ = main ? footCenter(main).z : 0, clear = F.clear || 0;
  /** chỗ trồng hợp lệ cho cây bán kính tán R: xa nhà ≥ 0,75 R, xa lối 1,8 m, xa nước 1,5 m, xa tường ≥ max(4, clear); ngoài sân cấm và trục nghi lễ */
  const ok = (x, z, R, o = {}) => {
    const edge = Math.max(7, clear);
    if (Math.abs(x) > HW - edge || Math.abs(z) > HD - edge) return false;
    if (bld.some((b) => inB(b, x, z, R * 0.75 + 1))) return false;
    if (misc.some((b) => inB(b, x, z, o.small ? 1.2 : R * 0.4 + 1))) return false;
    if (pth.some((b) => inB(b, x, z, 1.8))) return false;
    if (wat.some((b) => inB(b, x, z, 1.5))) return false;
    if (wal.some((b) => inB(b, x, z, Math.max(4, clear)))) return false;
    if (!o.yard && noYard.some((y) => Math.abs(x - y.x) < y.w / 2 && Math.abs(z - y.z) < y.d / 2)) return false;
    if (!o.axis && F.axis && Math.abs(x) < F.axis && z > mainZ - 6) return false; // trục nghi lễ cổng → điện chính: trống
    const g = o.gap ?? 0.6; return !P.trees.some((t) => Math.hypot(t.x - x, t.z - z) < (o.row ? Math.min(o.row, (t.R + R) * 0.4) : g * (t.R + R)));
  };
  const add = (x, z, kind, s, role, extra = {}) => { const t = { x, z, kind, s, role, ...extra }; t.R = crownR(t); P.trees.push(t); return t; };
  const R0 = (kind, s = 1) => crownR({ kind, s });
  const pickMix = (mix) => { let u = r() * mix.reduce((a, m) => a + m[1], 0); for (const [k, w] of mix) if ((u -= w) <= 0) return k; return mix[0][0]; };
  // 1) hàng bách hai bên kênh (Taj: ≈ 80 cây mỗi bên, cách 3,5 m)
  if (F.canal) for (const w of P.water) {
    if (w.shape === 'ellipse') continue; const along = w.hd > w.hw, L = along ? w.hd : w.hw, off = (along ? w.hw : w.hd) + F.canal.off;
    if (L < 20) continue;
    for (let u = -L + 2; u <= L - 2; u += F.canal.gap) for (const sd of [-1, 1]) { const x = w.x + (along ? sd * off : u), z = w.z + (along ? u : sd * off); if (ok(x, z, 0.8, { row: 3, axis: true, gap: 0.2, small: true })) add(x, z, F.canal.kind, 1, 'canal', { row: true }); }
  }
  // 2) hàng cây dọc lối dài (đại lộ Versailles)
  if (F.rows) for (const p of P.paths) {
    if (p.d < F.rows.len) continue; const c = Math.cos(p.ry || 0), sn = Math.sin(p.ry || 0), n = Math.floor(p.d / F.rows.gap), R = R0(F.rows.kind);
    for (let k = 0; k <= n; k++) { const u = -p.d / 2 + (p.d - n * F.rows.gap) / 2 + k * F.rows.gap; for (const sd of [-1, 1]) { const lx = sd * (p.w / 2 + 3.2), x = p.x + c * lx + sn * u, z = p.z - sn * lx + c * u; if (ok(x, z, R, { row: F.rows.gap * 0.9, gap: 0.3 })) add(x, z, F.rows.kind, 1, 'avenue', { row: true }); } }
  }
  // 3) cặp đối xứng trước nhà chính / sảnh lớn (cổ thụ đôi Cung Vương phủ, cặp cây trước cổng Huế)
  if (F.pair) P.buildings.filter((b) => (F.pair.main ? b.main : b.w >= 20)).forEach((b, bi) => {
    const kind = F.pair.kinds[bi % F.pair.kinds.length], R = R0(kind, 1.1), c0 = footCenter(b), f = Math.sin(b.ry || 0), g = Math.cos(b.ry || 0), c = Math.cos(b.ry || 0), s = Math.sin(b.ry || 0);
    for (const sd of [-1, 1]) { const u = b.d / 2 + R * 0.75 + 3, v = sd * Math.max(b.w / 2 - 2, R * 0.9), x = c0.x + f * u + c * v, z = c0.z + g * u - s * v; if (ok(x, z, R, { axis: true, yard: true, gap: 0.5 })) add(x, z, kind, 1.1, 'pair'); }
  });
  const G = D.groves || [];
  // 4) cây đơn điểm nhấn (cổ thụ lớn nhất, đứng thoáng)
  if (F.spec) for (let k = 0, tries = 0; k < F.spec.n && tries < 600; tries++) { const g = G[tries % G.length]; if (!g) break; const x = g.x0 + r() * (g.x1 - g.x0), z = g.z0 + r() * (g.z1 - g.z0), R = R0(F.spec.kind, 1.12); if (ok(x, z, R, { gap: 1.05 })) { add(x, z, F.spec.kind, 1.1 + r() * 0.05, 'spec'); k++; } }
  // 5) hàng trong tường bao (một hoặc hai hàng)
  if (F.border) { const B = F.border; for (const inset of [B.inset, ...(B.double ? [B.inset + B.double] : [])]) { let i = 0; for (let u = -HW + inset; u <= HW - inset; u += B.gap) for (const [x, z] of [[u, HD - inset], [u, -HD + inset], [HW - inset, u], [-HW + inset, u]]) { const kind = B.kinds[i++ % B.kinds.length], R = R0(kind); if (ok(x, z, R, { row: B.gap * 0.8, gap: 0.3 })) add(x, z, kind, 0.95 + r() * 0.1, 'border', { row: true }); } } }
  // 6) rừng theo vùng của bản vẽ: lưới (bosquet / vườn quả) hoặc rải tự nhiên, khoảng cách theo tán
  for (const g of G) {
    const want = Math.max(4, Math.round(g.n * F.grove.k)); let n = 0;
    if (F.grove.grid) { const s0 = F.grove.grid; for (let x = g.x0 + s0 / 2; x < g.x1 && n < want; x += s0) for (let z = g.z0 + s0 / 2; z < g.z1 && n < want; z += s0) { const kind = pickMix(F.grove.mix), R = R0(kind); if (ok(x, z, R, { row: s0 * 0.9, gap: 0.3 })) { add(x, z, kind, 0.95 + r() * 0.1, 'grove', { row: true }); n++; } } }
    else for (let tries = 0; n < want && tries < want * 30; tries++) { const kind = pickMix(F.grove.mix), s = 0.85 + r() * 0.3, x = g.x0 + r() * (g.x1 - g.x0), z = g.z0 + r() * (g.z1 - g.z0), R = R0(kind, s); if (ok(x, z, R, { gap: F.grove.gap })) { add(x, z, kind, s, 'grove'); n++; } }
  }
  // 7) Versailles: thuỷ tùng chóp nón trên parterre + cam trong thùng dọc sân danh dự
  const yard = (id) => (D.yards || []).find((y) => y.id === id);
  if (F.topiary && yard('parterre')) { const y = yard('parterre'); for (let x = y.x - y.w / 2 + 4; x <= y.x + y.w / 2 - 4; x += F.topiary.gap) for (const z of [y.z - y.d / 2 + 3, y.z + y.d / 2 - 3]) if (ok(x, z, 1.2, { yard: true, axis: true, row: 3, small: true })) add(x, z, F.topiary.kind, 1, 'topiary', { row: true }); }
  if (F.tubs && yard('cour')) { const y = yard('cour'); for (let z = y.z - y.d / 2 + 3; z <= y.z + y.d / 2 - 3; z += F.tubs.gap) for (const x of [y.x - y.w / 2 + 2, y.x + y.w / 2 - 2]) if (ok(x, z, 1, { yard: true, axis: true, row: 2, small: true })) add(x, z, F.tubs.kind, 1, 'tub', { row: true }); }
  // tre (vườn Á Đông) giữ thủ tục cũ: một khóm ở vùng rừng đầu
  const g0 = G[0];
  if (g0 && (st.id === 'trunghoa' || st.id === 'nhatban')) for (let k = 0; k < 50; k++) { const x = g0.x0 + 10 + r() * 40, z = g0.z0 + 10 + r() * 30; if (ok(x, z, 1.2, { gap: 0.2 })) P.trees.push({ x, z, kind: 'bamboo', s: 0.9 + r() * 0.3, R: 1.2, role: 'bamboo' }); }
}
function plantTreesOld(P, st, r, D) {
  const T = st.trees, L = blockers(P), tk = () => T[Math.floor(r() * T.length)];
  const ok = (x, z, m = 2) => Math.abs(x) < HW - 4 && Math.abs(z) < HD - 4 && !hit(L, x, z, m) && !P.trees.some((t) => Math.hypot(t.x - x, t.z - z) < 4.2);
  // hàng trong tường bao (lùi 6 m), mỗi 9 m — chừa cổng
  for (let u = -HW + 8; u <= HW - 8; u += 9) for (const [x, z] of [[u, HD - 6], [u, -HD + 6], [HW - 6, u], [-HW + 6, u]]) if (ok(x, z, 1)) P.trees.push({ x, z, kind: tk(), s: 0.9 + r() * 0.35 });
  // cặp cây hoa đối xứng trước sảnh (Cung Vương phủ: hải đường cổ một cặp giữa sân)
  if (D.pairs) for (const b of P.buildings) { if (b.w < 25) continue; const f = Math.sin(b.ry), g = Math.cos(b.ry), c = Math.cos(b.ry), s = Math.sin(b.ry); for (const sx of [-1, 1]) { const u = b.d / 2 + 9, v = sx * (b.w / 2 - 3), x = b.x + f * u + c * v, z = b.z + g * u - s * v; if (ok(x, z, 1)) P.trees.push({ x, z, kind: tk(), s: 1.1 }); } }
  // rừng theo vùng của bản vẽ: mỗi vùng ~n cây (rải tất định)
  for (const g of D.groves || []) {
    let n = 0, tries = 0;
    while (n < g.n && tries++ < g.n * 40) { const x = g.x0 + r() * (g.x1 - g.x0), z = g.z0 + r() * (g.z1 - g.z0); if (ok(x, z, 2.5)) { P.trees.push({ x, z, kind: tk(), s: 0.85 + r() * 0.5 }); n++; } }
  }
  // rừng trúc (Á Đông) / hàng bách (Tây) ở vùng rừng đầu tiên
  const g0 = (D.groves || [])[0];
  if (g0) for (let k = 0; k < 60; k++) { const x = g0.x0 + 10 + r() * 40, z = g0.z0 + 10 + r() * 30; if (ok(x, z, 0.5)) P.trees.push({ x, z, kind: st.fam === 'asian' ? 'bamboo' : 'cypress', s: 0.9 + r() * 0.3 }); }
}

// ---------------------------------------------------------------------------
// VA CHẠM THEO ĐẶC TẢ (cục bộ phủ) — sàn / bậc / hố / hồ / tường bao / vách sảnh / giả sơn / lầu
// ---------------------------------------------------------------------------
/** { plats, polys, pits, pools, s2, s3, tall } — mọi toạ độ cục bộ phủ; y tuyệt đối (mặt đảo 0) */
/** lầu cổng chính dựng bằng archkit.gateHouse (chỉ kiểu cổng 'paifang' — estate3d): kích thước bệ + bậc, dùng chung cho hình & va chạm */
export function gateHouseSpec(P) {
  if (P.st.gate !== 'paifang') return [];
  const w = P.gate.w + 16.6, d = 9, ph = 0.9;
  return [{ z: P.D / 2 - 0.5, w, d, ph, W: w + 2.4, D: d + 2.4, n: Math.max(1, Math.round(ph / 0.22)), sw: Math.min(6, w * 0.3) }];
}

export function tienCollision(P) {
  const plats = [], polys = [], pits = [], pools = [], s2 = [], s3 = [], tall = [];
  // tường bao (2D) + đỉnh leo
  for (const w of P.walls) { s2.push({ x: w.x, z: w.z, hw: w.len / 2, hd: w.t / 2, ry: w.ry }); tall.push({ x: w.x, z: w.z, hw: w.len / 2, hd: w.t / 2, ry: w.ry, top: w.h + 0.4 }); }
  // lầu cổng kiểu bài lâu (estate3d › gateHouse w = cổng + 16,6, sâu 9, bệ 0,9 — archkit.plinth: W + 2,4, D + 2,4, 4 bậc 0,34 rộng 6):
  // bệ là NỀN đi được (trước đây không khai → người / lính gác lún 0,9 m trong bệ, voxel coi cả bệ là khối đặc) + bậc ngoài và trong sân
  for (const g of gateHouseSpec(P)) {
    plats.push({ x: 0, z: g.z, w: g.W, d: g.D, ry: 0, top: g.ph, bot: -1 });
    for (const sz of [1, -1]) for (let k = 0; k < g.n; k++) plats.push({ x: 0, z: g.z + sz * (g.D / 2 + (g.n - k - 0.5) * 0.34), w: g.sw, d: 0.36, ry: 0, top: (g.ph * (k + 1)) / g.n, bot: -1 });
  }
  // sảnh: nền (W = w + 2,4) + bậc trước / sau (archkit.plinth: n = round(h / 0,22), sâu 0,34, rộng min(6, 0,3 w)) + vách có khe cửa 2,4
  // nhà / đình dựng theo đặc tả kiến trúc (arch/): mặt đi được do bộ dựng khai (nền, bậc, nguyệt đài); vách, cột, lan can do voxel lấy từ lưới
  const archPlats = (b) => { const c = Math.cos(b.ry || 0), s = Math.sin(b.ry || 0); for (const q of b.foot.plats) { const x = b.x + c * q.x + s * q.z, z = b.z - s * q.x + c * q.z, y = b.y || 0; if (q.poly) polys.push({ poly: true, x, z, n: q.n, a: q.a, ry: (q.ry || 0) + (b.ry || 0), top: y + q.top, bot: y - 1 }); else plats.push({ x, z, w: q.w, d: q.d, ry: (q.ry || 0) + (b.ry || 0), top: y + q.top, bot: y - 1 }); } const fc = footCenter(b); tall.push({ x: fc.x, z: fc.z, hw: b.w / 2, hd: b.d / 2, ry: b.ry || 0, top: (b.y || 0) + b.foot.top + 1 }); };
  for (const b of P.buildings) {
    if (b.arch) { archPlats(b); continue; }
    const c = Math.cos(b.ry), s = Math.sin(b.ry), L = (ax, az) => ({ x: b.x + c * ax + s * az, z: b.z - s * ax + c * az });
    const asian = P.S.fam === 'asian', Wp = asian ? b.w + 2.4 : b.w + 0.2, Dp = asian ? b.d + 2.4 : b.d + 0.2, ph = asian ? b.plinth : Math.max(0.15, b.plinth);
    plats.push({ x: b.x, z: b.z, w: Wp, d: Dp, ry: b.ry, top: ph, bot: -1 });
    const n = Math.max(1, Math.round(ph / 0.22)), sw = Math.min(6, b.w * 0.3);
    for (const sz of b.back ? [1, -1] : [1]) for (let k = 0; k < n; k++) { const p = L(0, sz * (Dp / 2 + (n - k - 0.5) * 0.34)); plats.push({ x: p.x, z: p.z, w: sw, d: 0.36, ry: b.ry, top: (ph * (k + 1)) / n, bot: -1 }); }
    const hw = b.w / 2, hd = b.d / 2, t = 0.6, side = (b.w - 2.4) / 2, wy0 = ph, wy1 = ph + Math.min(b.h, 6);
    const box = (ax, az, bw, bd) => { const p = L(ax, az); s3.push({ x: p.x, z: p.z, hw: bw, hd: bd, ry: b.ry, y0: wy0 - 0.1, y1: wy1 }); };
    for (const sz of [1, -1]) { if (sz > 0 || b.back) for (const sx of [-1, 1]) box(sx * (1.2 + side / 2), sz * hd, side / 2, t / 2); else box(0, sz * hd, hw, t / 2); }
    for (const sx of [-1, 1]) box(sx * hw, 0, t / 2, hd);
    tall.push({ x: b.x, z: b.z, hw: Wp / 2, hd: Dp / 2, ry: b.ry, top: ph + b.h + 2.5 });
  }
  // đình: nền thấp 0,5 + đỉnh
  for (const p of P.pavs) {
    if (p.arch) { archPlats(p); continue; }
    const y = p.y || 0;
    plats.push({ x: p.x, z: p.z, w: p.w + 2.4, d: p.d + 2.4, ry: 0, top: y + 0.5, bot: y - 1 });
  }
  // lầu chính (cục bộ lầu → cục bộ phủ: tịnh tiến)
  { const T = towerCollision(P.tower.spec), ox = P.tower.x, oz = P.tower.z;
    for (const q of T.plats) (q.poly ? polys : plats).push({ ...q, x: q.x + ox, z: q.z + oz });
    for (const q of T.pits) pits.push({ ...q, x: q.x + ox, z: q.z + oz });
    for (const q of T.s3) s3.push({ ...q, x: q.x + ox, z: q.z + oz });
    for (const q of T.s2) s2.push({ ...q, x: q.x + ox, z: q.z + oz });
    for (const q of T.tall) tall.push({ ...q, x: q.x + ox, z: q.z + oz }); }
  // nước: hố khoét nền đảo + hồ đăng ký (bơi / lội)
  for (const w of P.water) {
    const shape = w.shape === 'ellipse' ? { rx: w.rx, rz: w.rz } : { hw: w.hw, hd: w.hd, rect: true };
    pits.push({ x: w.x, z: w.z, ry: 0, ...shape, bottom: w.floor, y0: -0.1, y1: 0.1 });
    pools.push({ x: w.x, z: w.z, ry: 0, ...shape, level: w.level, floor: w.floor });
  }
  // đảo giữa hồ: nền 0 (không base)
  for (const il of P.islands) polys.push({ poly: true, x: il.x, z: il.z, n: 16, a: il.r, ry: 0, top: 0, bot: -3 });
  if (P.moatIsle) plats.push({ x: P.moatIsle.x, z: P.moatIsle.z, w: P.moatIsle.hw * 2, d: P.moatIsle.hd * 2, ry: 0, top: 0, bot: -3 });
  // đá bước (Nhật)
  for (const s of P.stones || []) polys.push({ poly: true, x: s.x, z: s.z, n: 8, a: s.r, ry: 0, top: 0.12, bot: -2.5 });
  // cầu vòm: mặt cầu từng đoạn 0,5 m theo cung sin; bậc cuối sát bờ
  for (const b of P.bridges) {
    const n = Math.max(2, Math.round(b.len / 0.5)), c = Math.cos(b.ry), s = Math.sin(b.ry);
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n, u = -b.len / 2 + t * b.len, top = b.flat ? b.rise : b.rise * Math.sin(Math.PI * t);
      plats.push({ x: b.x + s * u, z: b.z + c * u, w: b.w, d: b.len / n + 0.02, ry: b.ry, top: Math.max(0.05, top), bot: top - 0.7 });
    }
    // lan can hai bên cầu (theo tầng: chỉ chặn trên mặt cầu, người bơi dưới gầm qua được)
    for (const sd of [-1, 1]) for (let k = 0; k < n; k += 2) {
      const t = (k + 1) / n, u = -b.len / 2 + t * b.len, top = b.flat ? b.rise : b.rise * Math.sin(Math.PI * t), ox = c * sd * (b.w / 2 - 0.1), oz = -s * sd * (b.w / 2 - 0.1);
      if (t < 0.04 || t > 0.96) continue;
      s3.push({ x: b.x + s * u + ox, z: b.z + c * u + oz, hw: 0.12, hd: b.len / n + 0.1, ry: b.ry, y0: top - 0.2, y1: top + 1.0 });
    }
  }
  // giả sơn: khối đặc + lối bậc khoét giữa mặt trước (bậc là nền), đứng được trên đỉnh (đỉnh leo = h)
  { const k = P.rockery, front = k.z + k.d / 2, cw = k.stairW / 2 + 0.3;
    const blk = (x0, x1, z0, z1) => { const x = (x0 + x1) / 2, z = (z0 + z1) / 2, hw = (x1 - x0) / 2, hd = (z1 - z0) / 2; s2.push({ x, z, hw, hd, ry: 0 }); tall.push({ x, z, hw, hd, ry: 0, top: k.h }); };
    const zc = front - k.run; // bậc chạy vào trong khối từ mép trước
    blk(k.x - k.w / 2, k.x - cw, zc, front); blk(k.x + cw, k.x + k.w / 2, zc, front); blk(k.x - k.w / 2, k.x + k.w / 2, k.z - k.d / 2, zc);
    for (let i = 1; i <= k.steps; i++) plats.push({ x: k.x, z: front - (i - 0.5) * k.tread, w: k.stairW, d: k.tread + 0.02, ry: 0, top: i * k.rise, bot: -1 });
    plats.push({ x: k.x, z: k.z - 6, w: 13, d: 13, ry: 0, top: k.h, bot: k.h - 1 });
  }
  return { plats, polys, pits, pools, s2, s3, tall };
}

/** tổng diện tích + vài số đếm (test / manifest §9) */
export function planStats(P) {
  return { area: P.W * P.D, buildings: P.buildings.length, pavs: P.pavs.length, trees: P.trees.length, lamps: P.lamps.length, bridges: P.bridges.length, rocks: P.rocks.length + P.benches.length + P.statues.length, zones: P.zones.length };
}
