// ============================================================================
//  QUY HOẠCH TIÊN PHỦ 520 × 520 m (thuần JS, tất định — docs/TIEN-PHU-MANIFEST.md §6). Khung cục bộ: gốc = tâm phủ,
//  +z = cổng chính, mặt đảo y = 0. Học theo phủ Cung Vương (61.120 m²): tiền viện · khu ở 3 trục · hậu hoa viên.
//  tienPlan(i) → { W, D, style, S (archkit-style), buildings, pavs, tower, walls, gates, water, islands, bridges, rockery,
//                  paths, trees, lamps, rocks, benches, statues, zones, gate, mound, towers: [] }
//  Hình học va chạm theo đặc tả (sàn, bậc, hố, hồ, tường bao, vách sảnh): tienCollision(plan) — dùng chung lúc nạp
//  (heaven.js) và test Node. Chi tiết nhỏ (cột, lan can, tượng, đèn, cây…) lấy từ chính lưới hình (tienphu/voxel.js).
// ============================================================================
import { tpStyle, FLOOR_THEMES } from './styles.js';
import { towerSpec, towerCollision, floorZone, LEVELS, FH } from './tower.js';

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
/** quy hoạch tiên phủ thứ i (0 = Quân Thiên … 8 = Dương Thiên) */
export function tienPlan(i) {
  if (CACHE.has(i)) return CACHE.get(i);
  const st = tpStyle(i), r = rng(1009 + i * 7919);
  const P = { i, W: TP_W, D: TP_D, st, S: archStyle(st), buildings: [], pavs: [], walls: [], gates: [], water: [], islands: [], bridges: [], paths: [], trees: [], lamps: [], rocks: [], benches: [], statues: [], beds: [], zones: [], towers: [], rockery: null };
  const hp = st.hall.plinth;
  // ---------------- tường bao + 4 cổng
  const wallH = st.wallH, wallT = 1.6, gateW = 10, sideGW = 7;
  P.gate = { w: gateW };
  const seg = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0); if (len > 0.05) P.walls.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, len, ry: Math.atan2(-(z1 - z0), x1 - x0), h: wallH, t: wallT }); };
  seg(-HW, HD, -gateW / 2, HD); seg(gateW / 2, HD, HW, HD);
  seg(-HW, -HD, -sideGW / 2, -HD); seg(sideGW / 2, -HD, HW, -HD);
  for (const sx of [-1, 1]) { seg(sx * HW, -HD, sx * HW, 40 - sideGW / 2); seg(sx * HW, 40 + sideGW / 2, sx * HW, HD); }
  P.gates.push({ id: 'main', x: 0, z: HD, ry: 0, w: gateW, main: true }, { id: 'back', x: 0, z: -HD, ry: Math.PI, w: sideGW }, { id: 'east', x: HW, z: 40, ry: -Q, w: sideGW }, { id: 'west', x: -HW, z: 40, ry: Q, w: sideGW });
  // ---------------- công trình (sảnh một tầng — archkit-style) · cửa +z cục bộ (ry 0) trừ khi ghi khác
  const B = (o) => { const b = { floors: 2, back: false, ry: 0, plinth: hp, ...o }; P.buildings.push(b); return b; };
  const main = B({ id: 'main', name: st.id === 'trunghoa' ? 'Thái Hoà Điện' : 'Chính Điện', x: 0, z: 100, w: 56, d: 30, h: 13, back: true, main: true, plinth: Math.max(hp, 2.4) });
  B({ id: 'eastfront', name: 'Khách Sảnh', x: 150, z: 130, w: 40, d: 20, h: 9 });
  B({ id: 'eastback', name: 'Nội Viện', x: 150, z: 38, w: 44, d: 22, h: 9, back: true });
  B({ id: 'westfront', name: 'Tàng Thư Các', x: -150, z: 130, w: 40, d: 20, h: 9 });
  B({ id: 'westback', name: 'Luyện Công Đường', x: -150, z: 38, w: 44, d: 22, h: 9, back: true });
  for (const sx of [-1, 1]) B({ id: sx < 0 ? 'guardw' : 'guarde', name: sx < 0 ? 'Tây Môn Phòng' : 'Đông Môn Phòng', x: sx * 34, z: 232, w: 14, d: 9, h: 5.5, floors: 1, plinth: 0.6 });
  B({ id: 'theater', name: 'Hí Lâu', x: 190, z: -150, w: 40, d: 24, h: 10, ry: -Q });
  for (const sx of [-1, 1]) B({ id: sx < 0 ? 'backw' : 'backe', name: sx < 0 ? 'Hậu Lâu Tây' : 'Hậu Lâu Đông', x: sx * 58, z: -236, w: 76, d: 14, h: 9 });
  // ---------------- lầu chính 10 tầng
  const spec = towerSpec(st), TZ = 4;
  P.tower = { x: 0, z: TZ, spec, name: `${st.id === 'nhatban' ? 'Thiên Thủ Các' : st.id === 'gothic' ? 'Tháp Lâu Đài' : st.id === 'artdeco' ? 'Thiên Kim Lâu' : st.id === 'mughal' ? 'Vọng Tinh Tháp' : st.id === 'tancodien' ? 'Thánh Điện Tháp' : 'Thiên Tượng Lâu'} (10 tầng)` };
  // ---------------- hậu hoa viên theo phong cách
  water(P, st, r);
  // giả sơn có lối bậc lên đỉnh + đình trên đỉnh (không cho Mughal / Art Deco: thay bằng đài ngắm cảnh hình học)
  P.rockery = { x: -188, z: -180, w: 52, d: 38, h: st.id === 'artdeco' || st.id === 'mughal' ? 6 : 9, kind: st.id === 'artdeco' || st.id === 'mughal' || st.id === 'tancodien' ? 'terrace' : 'rock', stairW: 3.2 };
  { const k = P.rockery, n = Math.round(k.h / 0.3); k.steps = n; k.rise = k.h / n; k.tread = 0.42; k.run = n * k.tread; }
  P.pavs.push({ id: 'summit', name: st.fam === 'western' || st.fam === 'modern' ? 'Đài Ngắm Cảnh' : 'Vọng Sơn Đình', x: P.rockery.x, z: P.rockery.z - 6, w: 9, d: 9, h: 3.6, octa: st.fam !== 'modern', y: P.rockery.h });
  P.pavs.push({ id: 'waterside', name: st.fam === 'asian' ? 'Thủy Tạ' : 'Vọng Hồ Đình', x: -112, z: -100, w: 12, d: 10, h: 3.8, octa: false });
  for (const [x, z] of [[-130, -232], [130, -232], [-222, -84], [222, -70], [-62, -58], [62, -58]]) P.pavs.push({ id: `pav${P.pavs.length}`, name: 'Đình', x, z, w: 8, d: 8, h: 3.4, octa: st.fam !== 'modern' });
  for (const il of P.islands) if (il.pav) P.pavs.push({ id: 'island', name: st.fam === 'asian' ? 'Hồ Tâm Đình' : 'Đình Giữa Hồ', x: il.x, z: il.z, w: 10, d: 10, h: 3.8, octa: true });
  // ---------------- lối đi lát
  const path = (x, z, w, d, ry = 0) => P.paths.push({ x, z, w, d, ry });
  path(0, (HD - 2 + main.z + main.d / 2 + 6) / 2, 9, HD - 2 - (main.z + main.d / 2 + 6));    // trục chính cổng → chính điện
  path(0, (main.z - main.d / 2 - 6 + spec.podium.a + spec.podium.run + TZ) / 2, 9, main.z - main.d / 2 - 6 - (spec.podium.a + spec.podium.run + TZ)); // chính điện → lầu
  { const zb = TZ - spec.podium.a; path(0, (zb - 50) / 2, 6, zb + 50); }                         // sau lầu → hoa viên
  path(0, 168, 330, 6); path(150, 100, 6, 140); path(-150, 100, 6, 140);                         // ngang tiền viện + trục Đông / Tây
  path(0, -50, 470, 5);                                                                          // ngang đầu hoa viên
  for (const sx of [-1, 1]) path(sx * 236, -150, 5, 200);                                        // dọc hai bên hoa viên
  path(0, -250, 470, 4);                                                                         // ngang sau
  // ---------------- đèn (trục chính hai bên mỗi 12 m, hoa viên mỗi 18 m)
  for (let z = HD - 10; z > main.z + main.d / 2 + 8; z -= 12) for (const sx of [-1, 1]) P.lamps.push({ x: sx * 7.5, z });
  for (let z = main.z - main.d / 2 - 8; z > TZ + spec.podium.a + spec.podium.run + 2; z -= 10) for (const sx of [-1, 1]) P.lamps.push({ x: sx * 7.5, z });
  for (let x = -228; x <= 228; x += 19) { if (Math.abs(x) > 6) P.lamps.push({ x, z: -46 }); P.lamps.push({ x, z: -246 }); }
  for (let z = -60; z >= -236; z -= 18) for (const sx of [-1, 1]) P.lamps.push({ x: sx * 230, z });
  for (let x = -150; x <= 150; x += 25) if (Math.abs(x) > 8) P.lamps.push({ x, z: 172 });
  // ---------------- tượng trước cổng / trước chính điện
  for (const sx of [-1, 1]) { P.statues.push({ x: sx * 9, z: HD - 12, ry: 0, s: 2.4 }); P.statues.push({ x: sx * 12, z: main.z + main.d / 2 + 10, ry: 0, s: 2 }); }
  // ---------------- zones: vùng bài trí (k) — sảnh, tầng lầu, sân
  const zones = P.zones;
  P.buildings.forEach((b) => zones.push({ k: zones.length, kind: 'hall', id: b.id, name: b.name, x: b.x, z: b.z, w: b.w, d: b.d, h: b.floors > 1 ? 6 : b.h, plinth: b.plinth, ry: b.ry, back: !!b.back, main: !!b.main }));
  for (let f = 0; f <= LEVELS; f++) {
    const fz = floorZone(spec, f);
    zones.push({ k: zones.length, kind: 'hall', tower: true, floor: f, id: `floor${f + 1}`, name: f < LEVELS ? `Tầng ${f + 1} · ${FLOOR_THEMES[f].name}` : 'Vọng Đài', x: 0, z: TZ, w: fz.half * 2, d: fz.half * 2, h: f < LEVELS ? FH - 0.4 : 3.2, plinth: fz.y, ry: 0, back: true, keep: fz.keep });
  }
  zones.push({ k: zones.length, kind: 'yard', id: 'front', name: 'Tiền Viện', x: 0, z: 196, w: 220, d: 44, ry: 0, keep: [{ x: 0, z: 0, w: 12, d: 44 }] });
  zones.push({ k: zones.length, kind: 'yard', id: 'wyard', name: 'Luyện Võ Trường', x: -150, z: 85, w: 60, d: 36, ry: 0, keep: [{ x: 0, z: 0, w: 7, d: 36 }] });
  zones.push({ k: zones.length, kind: 'yard', id: 'eyard', name: 'Đông Viện', x: 150, z: 85, w: 60, d: 36, ry: 0, keep: [{ x: 0, z: 0, w: 7, d: 36 }] });
  zones.push({ k: zones.length, kind: 'yard', id: 'garden', name: 'Hoa Viên', x: 160, z: -85, w: 70, d: 40, ry: 0, keep: [] });
  // ---------------- cây (≥ 500): hàng dọc tường + rừng hoa viên + sân trong — tránh mọi công trình / nước / lối
  plantTrees(P, st, r);
  // ---------------- đá, ghế quanh hồ / vườn
  for (let k = 0; k < 24; k++) { const p = freeSpot(P, r, -40, -240, 3.5); if (p) P.rocks.push({ ...p, r: 0.8 + r() * 1.4, h: 0.8 + r() * 1.6 }); }
  for (let k = 0; k < 24; k++) { const p = freeSpot(P, r, -40, -240, 2.5); if (p) P.benches.push({ ...p, ry: Math.floor(r() * 4) * Q }); }
  P.mound = { x: 0, z: -HD + 6, w: TP_W - 20, d: 8, kind: 'trees' };
  // nhà chính cho mansionNpcs / vùng chính chủ: buildings[0]
  CACHE.set(i, P);
  return P;
}

function water(P, st, r) {
  const W = P.water, I = P.islands, Br = P.bridges;
  const pool = (o) => W.push({ level: POOL_LEVEL, floor: -1.9, ...o });
  const arch = (x, z0, z1, w = 4.5, rise = 1.6, ry = 0) => Br.push({ x, z: (z0 + z1) / 2, len: Math.abs(z1 - z0) + 3, w, rise, ry });
  switch (st.water) {
    case 'stroll': {
      pool({ shape: 'ellipse', x: -45, z: -125, rx: 72, rz: 42 }); pool({ shape: 'ellipse', x: 58, z: -168, rx: 62, rz: 36 }); pool({ shape: 'ellipse', x: -8, z: -206, rx: 46, rz: 24 });
      I.push({ x: -52, z: -122, r: 9, pav: false, lantern: true });
      arch(58, -130, -206, 4, 2.6); // taikobashi
      arch(-8, -180, -232, 3.5, 1.4);
      // đá bước qua hồ A (nền nhỏ mặt 0,12)
      for (let k = 0; k <= 16; k++) { const t = k / 16, x = -112 + t * 60, z = -125 + Math.sin(t * Math.PI) * 18; P.stones = P.stones || []; P.stones.push({ x, z, r: 0.75 }); }
      P.zen = { x: 140, z: -92, w: 70, d: 40 };
      break;
    }
    case 'mirror':
      pool({ shape: 'rect', x: 0, z: -98, hw: 18, hd: 30, floor: -1.1 }); pool({ shape: 'rect', x: 0, z: -186, hw: 18, hd: 30, floor: -1.1 });
      P.fountain = { x: 0, z: -142, r: 6 };
      for (const zc of [-98, -186]) Br.push({ x: 0, z: zc, len: 42, w: 4.5, rise: 1.0, ry: Q });
      for (const sx of [-1, 1]) for (const zc of [-100, -186]) for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) P.beds.push({ x: sx * (56 + a * 22), z: zc - 9 + b * 18, w: 18, d: 13 });
      break;
    case 'moat': {
      const ox = 125, oz0 = -228, oz1 = -66, ix = 100, iz0 = -203, iz1 = -91;
      pool({ shape: 'rect', x: 0, z: (iz1 + oz1) / 2, hw: ox, hd: (oz1 - iz1) / 2 }); pool({ shape: 'rect', x: 0, z: (oz0 + iz0) / 2, hw: ox, hd: (iz0 - oz0) / 2 });
      for (const sx of [-1, 1]) pool({ shape: 'rect', x: sx * (ix + ox) / 2, z: (iz0 + iz1) / 2, hw: (ox - ix) / 2, hd: (iz1 - iz0) / 2 });
      arch(0, oz1 + 2, iz1 - 2, 6, 1.2); arch(0, iz0 + 2, oz0 - 2, 6, 1.2);
      P.moatIsle = { x: 0, z: (iz0 + iz1) / 2, hw: ix, hd: (iz1 - iz0) / 2 };
      for (const [x, z] of [[-60, -147], [60, -147]]) P.pavs.push({ id: `sala${x}`, name: 'Sala', x, z, w: 12, d: 9, h: 3.8, octa: false });
      P.stupas = [[-80, -120], [80, -120], [-80, -175], [80, -175], [0, -147]].map(([x, z], k) => ({ x, z, h: k === 4 ? 16 : 9, r: k === 4 ? 4 : 2.5 }));
      break;
    }
    case 'charbagh':
      pool({ shape: 'rect', x: 0, z: -146, hw: 3.5, hd: 92, floor: -1.2 }); pool({ shape: 'rect', x: 0, z: -146, hw: 92, hd: 3.5, floor: -1.2 }); pool({ shape: 'rect', x: 0, z: -146, hw: 11, hd: 11, floor: -1.2 });
      for (const [x, z, ry] of [[0, -100, 0], [0, -192, 0], [-50, -146, Q], [50, -146, Q]]) Br.push({ x, z, len: ry ? 9 : 9, w: 4, rise: 0.3, ry: ry ? Q : 0, flat: true });
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) P.beds.push({ x: sx * (26 + a * 44), z: -146 + sz * (26 + b * 44), w: 36, d: 36 });
      break;
    default: // 'lake' — hồ elip tự nhiên + đảo + 2 cầu vòm (phủ Cung Vương)
      pool({ shape: 'ellipse', x: 0, z: -142, rx: 104, rz: 54 });
      I.push({ x: 0, z: -142, r: 15, pav: true });
      arch(0, -142 + 54 + 2, -142 + 15, 4.5, 1.8); arch(0, -142 - 15, -142 - 54 - 2, 4.5, 1.8);
      if (st.flags) P.flagPoles = [[-120, -90], [120, -90], [-120, -195], [120, -195]];
  }
}

// ---- vật chiếm chỗ (để trồng cây / đặt đá không đè lên)
function blockers(P) {
  if (P._bl) return P._bl;
  const L = [];
  for (const b of P.buildings) { const sw = Math.abs(Math.sin(b.ry)) > 0.5; L.push({ x: b.x, z: b.z, hw: (sw ? b.d : b.w) / 2 + 6, hd: (sw ? b.w : b.d) / 2 + 9 }); }
  for (const p of P.pavs) L.push({ x: p.x, z: p.z, hw: p.w / 2 + 3, hd: p.d / 2 + 3 });
  const t = P.tower.spec.podium; L.push({ x: P.tower.x, z: P.tower.z + t.run / 2, hw: t.a + 6, hd: t.a + t.run / 2 + 6 });
  for (const w of P.water) L.push(w.shape === 'ellipse' ? { x: w.x, z: w.z, rx: w.rx + 4, rz: w.rz + 4 } : { x: w.x, z: w.z, hw: w.hw + 4, hd: w.hd + 4 });
  for (const p of P.paths) L.push({ x: p.x, z: p.z, hw: p.w / 2 + 1.2, hd: p.d / 2 + 1.2, path: true });
  const k = P.rockery; L.push({ x: k.x, z: k.z + k.run / 2, hw: k.w / 2 + 3, hd: k.d / 2 + k.run / 2 + 3 });
  for (const b of P.bridges) { const sw = Math.abs(Math.sin(b.ry)) > 0.5; L.push({ x: b.x, z: b.z, hw: (sw ? b.len : b.w) / 2 + 2, hd: (sw ? b.w : b.len) / 2 + 2 }); }
  for (const b of P.beds) L.push({ x: b.x, z: b.z, hw: b.w / 2 + 1, hd: b.d / 2 + 1 });
  if (P.zen) L.push({ x: P.zen.x, z: P.zen.z, hw: P.zen.w / 2 + 2, hd: P.zen.d / 2 + 2 });
  if (P.fountain) L.push({ x: P.fountain.x, z: P.fountain.z, hw: 20, hd: 10 });
  if (P.moatIsle) for (const s of P.stupas) L.push({ x: s.x, z: s.z, hw: s.r + 4, hd: s.r + 4 });
  for (const g of P.gates) L.push({ x: g.x * 0.96, z: g.z * 0.96, hw: 22, hd: 22 });
  P._bl = L; return L;
}
/** (x, z) cục bộ còn trống (không công trình / nước / cầu / cổng / lối lát) cách m — rải hoa cỏ (estate3d, DOHOA-MANIFEST §2.2) */
export function freeAt(P, x, z, m = 0.5) {
  if (Math.abs(x) > HW - 3 || Math.abs(z) > HD - 3 || hit(blockers(P).filter((o) => !o.path), x, z, m)) return false; // lối kiểm riêng bên dưới (lề 0,3 m — hoa viền sát lối)
  for (const p of P.paths) { const c = Math.cos(p.ry || 0), s = Math.sin(p.ry || 0), dx = x - p.x, dz = z - p.z; if (Math.abs(c * dx - s * dz) < p.w / 2 + 0.3 && Math.abs(s * dx + c * dz) < p.d / 2 + 0.3) return false; }
  return true;
}
const hit = (L, x, z, m = 0) => L.some((o) => (o.rx ? ((x - o.x) / (o.rx + m)) ** 2 + ((z - o.z) / (o.rz + m)) ** 2 < 1 : Math.abs(x - o.x) < o.hw + m && Math.abs(z - o.z) < o.hd + m));
function freeSpot(P, r, z0, z1, m) {
  const L = blockers(P), taken = [...P.trees, ...P.rocks, ...P.benches, ...P.lamps];
  for (let t = 0; t < 40; t++) {
    const x = -HW + 12 + r() * (TP_W - 24), z = z1 + r() * (z0 - z1);
    if (hit(L, x, z, m)) continue;
    if (taken.some((o) => Math.hypot(o.x - x, o.z - z) < m + 1.5)) continue;
    return { x, z };
  }
  return null;
}
function plantTrees(P, st, r) {
  const T = st.trees, L = blockers(P), tk = () => T[Math.floor(r() * T.length)];
  const ok = (x, z, m = 2) => !hit(L, x, z, m) && !P.trees.some((t) => Math.hypot(t.x - x, t.z - z) < 4.2);
  // hàng dọc trong tường (lùi 6 m), mỗi 9 m — chừa cổng
  for (let u = -HW + 8; u <= HW - 8; u += 9) for (const [x, z] of [[u, HD - 6], [u, -HD + 6], [HW - 6, u], [-HW + 6, u]]) if (ok(x, z, 1)) P.trees.push({ x, z, kind: tk(), s: 0.9 + r() * 0.35 });
  // hàng thứ hai sau lưng (tọa sơn)
  for (let x = -HW + 12; x <= HW - 12; x += 8) if (ok(x, -HD + 13, 1)) P.trees.push({ x, z: -HD + 13, kind: tk(), s: 1.0 + r() * 0.4 });
  // rừng hoa viên + sân trong (rải tất định)
  let tries = 0;
  while (P.trees.length < 560 && tries++ < 12000) {
    const x = -HW + 10 + r() * (TP_W - 20), z = -HD + 10 + r() * (TP_D - 20);
    const garden = z < -40, court = Math.abs(x) > 90 && z > -40 && z < 230;
    if (!garden && !court) continue;
    if (ok(x, z, 2.5)) P.trees.push({ x, z, kind: tk(), s: 0.85 + r() * 0.5 });
  }
  // rừng trúc (Á Đông) / hàng thông (Tây)
  const bx = 212, bz = -222;
  for (let k = 0; k < 70; k++) { const x = bx + (r() - 0.5) * 30, z = bz + (r() - 0.5) * 22; if (!hit(L, x, z, 0.5)) P.trees.push({ x, z, kind: st.fam === 'asian' ? 'bamboo' : 'cypress', s: 0.9 + r() * 0.3 }); }
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
  for (const b of P.buildings) {
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
