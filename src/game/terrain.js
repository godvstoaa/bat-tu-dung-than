// ============================================================================
//  HUYỀN GIỚI — địa hình thế giới mở 2048 × 2048 (docs/DAI-THE-GIOI-DESIGN.md §C1–C2).
//  heightAt(x, z) thuần JS, có hạt giống, không DOM → dùng chung: dựng lưới (client),
//  va chạm, đặt cây, máy chủ kiểm vị trí, test node.
//  Toạ độ thế giới: gốc (0,0) = tâm Huyền Thành (quảng trường quán cũ), đơn vị ≈ 1 m,
//  Bắc = −Z. Huyền Thành là cao nguyên phẳng ở độ cao 0 (quán cũ đặt nguyên tại y = 0).
// ============================================================================

// THẾ GIỚI v3 (2026-11-10): toàn bộ địa hình bản cũ 2048 m PHÓNG ĐỀU ×1,6 — heightAt(x, z) = địa hình cũ
// tại (x/1,6, z/1,6). Mọi vùng, sông, sảnh nghề, bình đài giữ nguyên hình dạng tương đối (dốc thoải hơn),
// Ngoại Thành bát giác 420 → 672 (thêm vành biệt phủ). Hằng xuất ra (REGIONS, RIVER, CLEARINGS…) ở toạ độ MỚI.
import { inCanal, CANAL_BED, extCarve } from './canals.js';
import { riverCarve, RIVER_CTRL, WATER_LEVEL } from './waterways.js';
export const SCALE = 1.6;
const S0 = { HALF: 1024, EDGE: 960, CITY_OCT: 420, PEAK_PAD: 125 }; // hằng bản cũ (dùng bên trong heightOld)
export const WORLD = 3328;        // 13 chunk × 256 m (terrain-mesh.CHUNK)
export const HALF = WORLD / 2;
export const WATER = WATER_LEVEL;  // mực nước hồ / sông (-6, waterways.js)
export const CLOUD_SEA = -70;     // biển mây quanh rìa thế giới
export const EDGE = S0.EDGE * SCALE; // 1536 — bán kính bắt đầu đổ xuống biển mây
// dải không gian nội thất (phòng tiệm / nhà / điện thờ) ở rìa Đông, ngoài biển mây — rooms.js, world.js › ROOMS, protocol.WORLD_TILES
export const ROOM_X0 = HALF + 250; // 1914
export const ROOM_X1 = ROOM_X0 + 700; // mép Đông cùng của dải phòng

// --- simplex noise 2D (Gustavson), hoán vị theo hạt giống
function makeNoise(seed = 1) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  return (x, y) => {
    const s2 = (x + y) * F2; const i = Math.floor(x + s2), j = Math.floor(y + s2);
    const t = (i + j) * G2; const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0;
    for (const [dx, dy, gi] of [[x0, y0, perm[ii + perm[jj]]], [x1, y1, perm[ii + i1 + perm[jj + j1]]], [x2, y2, perm[ii + 1 + perm[jj + 1]]]]) {
      let tt = 0.5 - dx * dx - dy * dy;
      if (tt > 0) { tt *= tt; const g = G[gi & 7]; n += tt * tt * (g[0] * dx + g[1] * dy); }
    }
    return 70 * n; // ~[-1, 1]
  };
}

const n1 = makeNoise(2026), n2 = makeNoise(1105), n3 = makeNoise(77);
export const fbm = (x, z, oct = 5) => { let a = 0, f = 1, amp = 1, norm = 0; for (let i = 0; i < oct; i++) { a += amp * n1(x * f, z * f); norm += amp; f *= 2.03; amp *= 0.5; } return a / norm; };
const ridged = (x, z, oct = 5) => { let a = 0, f = 1, amp = 1, norm = 0; for (let i = 0; i < oct; i++) { const v = 1 - Math.abs(n2(x * f, z * f)); a += amp * v * v; norm += amp; f *= 2.1; amp *= 0.5; } return a / norm; };
const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

// --- các vùng (C1). kind: city (cao nguyên phẳng) · peak (núi tông môn) · valley · lake · plateau
const REGIONS0 = [
  { id: 'thanh', name: 'Huyền Thành', x: 0, z: 0, r: 450, kind: 'city', h: 0 }, // Bát Quái Thành: Ngoại Thành bát giác trung đoạn 420 (cityblocks.js)
  { id: 'tubinh', name: 'Tử Bình Phong', x: -620, z: -560, r: 230, kind: 'peak', h: 420 },
  { id: 'manh', name: 'Manh Phái Cốc', x: 640, z: -520, r: 230, kind: 'valley', h: 300 },
  { id: 'trichthien', name: 'Trích Thiên Đỉnh', x: -600, z: 600, r: 210, kind: 'peak', h: 380 },
  // hồ dời vào trong (2026-11-10): tâm (930, 900) r 250 m mới — bờ Đông / Nam trước đây tràn ra quá rìa thế giới (không có bờ)
  { id: 'cungthong', name: 'Cùng Thông Hồ', x: 581.25, z: 562.5, r: 156.25, kind: 'lake', h: -24 },
  { id: 'thulau', name: 'Thư Lâu Lâm', x: 0, z: -700, r: 160, kind: 'plateau', h: 110 },
  { id: 'phongthuy', name: 'Phong Thủy Viên', x: -820, z: 0, r: 150, kind: 'plateau', h: 55 },
  { id: 'lichduong', name: 'Lịch Đường', x: 820, z: 0, r: 150, kind: 'plateau', h: 55 },
];
export const REGIONS = REGIONS0.map((g) => ({ ...g, x: g.x * SCALE, z: g.z * SCALE, r: g.r * SCALE }));
export const SKY_ISLAND = { id: 'thienban', name: 'Thiên Bàn Đảo', x: 0, z: 300 * SCALE, r: 120 * SCALE, y: 520 };

// Sông Huyền Hà (waterways.js): sông lớn ~150 m từ rìa Tây → chân Trích Thiên → vòng Nam Ngoại Thành → hồ Cùng Thông.
// RIVER = điểm điều khiển tim sông (toạ độ mới) — giữ tên cũ cho nơi dùng.
export const RIVER = RIVER_CTRL;

// khoảng cách có dấu tới tường bát giác Ngoại Thành (trung đoạn CITY_OCT, âm = trong thành)
export const CITY_OCT = S0.CITY_OCT * SCALE; // 672 = cityblocks.OUTER_A (test-game-city kiểm khớp)
const OCT_DIRS = Array.from({ length: 8 }, (_, k) => [Math.cos(Math.PI / 2 + k * Math.PI / 4), Math.sin(Math.PI / 2 + k * Math.PI / 4)]);
const octMax = (x, z) => { let m = -Infinity; for (const [dx, dz] of OCT_DIRS) m = Math.max(m, x * dx + z * dz); return m; };
export function cityOctDist(x, z) { return octMax(x, z) - CITY_OCT; }
const cityOctDist0 = (x, z) => octMax(x, z) - S0.CITY_OCT;

// bán kính + độ cao bình đài trên đỉnh núi (landmarks.js đặt quần thể lên đây)
export const PEAK_PAD = S0.PEAK_PAD * SCALE;
export function peakPadH(g) { return g.h * 0.86 + 40; }

// sông Huyền Hà khắc theo mặt cắt thật (waterways.riverCarve, toạ độ mới) · thủy đạo Bát Môn trong thành (canals.js):
// lòng kênh / hào phẳng đáy −4,3 (mặt nước −0,8) · kênh dẫn ra sông + suối nạp (canals.extCarve)
export function heightAt(x, z) {
  const h = riverCarve(x, z, heightOld(x / SCALE, z / SCALE));
  return inCanal(x, z) ? Math.min(h, CANAL_BED) : extCarve(x, z, h);
}
function heightOld(x, z) {
  const REGIONS = REGIONS0, PEAK_PAD = S0.PEAK_PAD, cityOctDist = cityOctDist0, EDGE = S0.EDGE, HALF = S0.HALF;
  const r = Math.hypot(x, z);
  // nền: đồi thoai thoải + núi gợn khắp nơi
  let h = 28 + 34 * fbm(x / 420, z / 420) + 70 * Math.pow(ridged(x / 520 + 9, z / 520 - 3), 2.2);
  // dấu ấn vùng
  for (const g of REGIONS) {
    const d = Math.hypot(x - g.x, z - g.z);
    if (g.kind === 'peak') {
      const k = 1 - smooth(0, g.r * 1.6, d);
      h += g.h * Math.pow(k, 1.6) * (0.82 + 0.18 * ridged(x / 90, z / 90, 4));
    } else if (g.kind === 'valley') {
      const ring = smooth(g.r * 0.35, g.r * 0.9, d) * (1 - smooth(g.r * 1.1, g.r * 1.8, d));
      h += g.h * ring * (0.75 + 0.25 * ridged(x / 70, z / 70, 4));
      h = h * (0.35 + 0.65 * smooth(g.r * 0.2, g.r * 0.6, d)) + 8 * (1 - smooth(g.r * 0.2, g.r * 0.6, d));
    } else if (g.kind === 'lake') {
      const k = 1 - smooth(g.r * 0.55, g.r * 1.05, d);
      h = h * (1 - k) + (g.h + 6 * n3(x / 60, z / 60)) * k;
    }
  }
  // bình đài đỉnh núi tông môn: san phẳng chóp (đặt cung điện), quanh mép thành vách dựng
  for (const g of REGIONS) {
    if (g.kind !== 'peak') continue;
    const d = Math.hypot(x - g.x, z - g.z);
    const k = 1 - smooth(PEAK_PAD * 0.85, PEAK_PAD * 1.35, d);
    if (k > 0) h = h * (1 - k) + peakPadH(g) * k;
  }
  // cao nguyên phẳng (thành, thư lâu, phong thủy viên, lịch đường) — làm phẳng cuối cùng
  for (const g of REGIONS) {
    if (g.kind !== 'city' && g.kind !== 'plateau') continue;
    // thành: phẳng tới ngoài tường 15 m theo đúng hình bát giác, chuyển dốc trong ~100 m (không đè mạch núi tông môn)
    const k = g.kind === 'city' ? 1 - smooth(15, 120, cityOctDist(x, z)) : 1 - smooth(g.r * 0.85, g.r * 1.45, Math.hypot(x - g.x, z - g.z));
    h = h * (1 - k) + g.h * k;
  }
  // rìa thế giới đổ xuống biển mây
  if (r > EDGE) h = h * (1 - smooth(EDGE, HALF, r)) + CLOUD_SEA * smooth(EDGE, HALF, r);
  return h;
}

// Pháp tuyến / độ dốc (dùng cho tô màu + chặn đi bộ).
export function slopeAt(x, z, e = 1.5) {
  const hx = heightAt(x + e, z) - heightAt(x - e, z);
  const hz = heightAt(x, z + e) - heightAt(x, z - e);
  return Math.hypot(hx, hz) / (2 * e); // tan(góc dốc)
}

export function regionAt(x, z) {
  let best = null, bd = Infinity;
  for (const g of REGIONS) { const d = Math.hypot(x - g.x, z - g.z) / g.r; if (d < bd) { bd = d; best = g; } }
  return bd < 1.3 ? best : null;
}

export const MAX_WALK_SLOPE = Math.tan((42 * Math.PI) / 180);

// Đi bộ được không (ngoài sân quán): trong bản đồ, không quá dốc, không lội nước sâu.
export function walkable(x, z, fromX, fromZ) {
  if (Math.hypot(x, z) > EDGE + 20) return false;
  const h = heightAt(x, z);
  if (h < WATER - 1.2) return false;
  if (fromX != null) {
    const run = Math.hypot(x - fromX, z - fromZ) || 1e-6;
    if ((h - heightAt(fromX, fromZ)) / run > MAX_WALK_SLOPE) return false; // chỉ chặn leo dốc, xuống dốc thoải mái
  }
  return true;
}

// Rừng: mật độ cây theo noise + luật vùng (không trồng trên nước, đá dốc, quảng trường, tuyết cao)
// Sân trống quanh sảnh nghề (toạ độ khớp world.js › station.world) + quần thể cung điện
export const CLEARINGS = [[735, -36], [-806, 62], [480, 420], [0, -630], [-567, 503], [654, -441], [-521, -538]].map(([x, z]) => ({ x: x * SCALE, z: z * SCALE, r: 45 * SCALE }));
export function treeDensity(x, z) {
  for (const c of CLEARINGS) if (Math.hypot(x - c.x, z - c.z) < c.r) return 0;
  const h = heightAt(x, z);
  if (h < WATER + 1.5 || h > 330) return 0;
  if (cityOctDist(x, z) < 30) return 0; // Bát Quái Thành: cây đặt tay
  const s = slopeAt(x, z);
  if (s > 0.9) return 0;
  return Math.max(0, 0.55 + 0.6 * fbm(x / 160 + 40, z / 160 - 11, 3)) * (1 - smooth(0.5, 0.9, s));
}
