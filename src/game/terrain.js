// ============================================================================
//  HUYỀN GIỚI — địa hình thế giới mở 8192 × 8192 (v4; gốc 2048) (docs/DAI-THE-GIOI-DESIGN.md §C1–C2).
//  heightAt(x, z) thuần JS, có hạt giống, không DOM → dùng chung: dựng lưới (client),
//  va chạm, đặt cây, máy chủ kiểm vị trí, test node.
//  Toạ độ thế giới: gốc (0,0) = tâm Huyền Thành (quảng trường quán cũ), đơn vị ≈ 1 m,
//  Bắc = −Z. Huyền Thành là cao nguyên phẳng ở độ cao 0 (quán cũ đặt nguyên tại y = 0).
// ============================================================================

// THẾ GIỚI v4 (2026-11-11): 8.192 m (32 chunk × 256). Bát Quái Thành v4 (citylayout.js) tường bát giác trung đoạn
// 2.125 m — cao nguyên PHẲNG y 0 tới ngoài tường 40 m; trong thành chỉ có sông Huyền Hà / Nam Khê và hồ Cùng Thông
// (bờ kè đá thẳng đứng, waterways.js). Núi / cao nguyên tông môn đẩy ra ngoài tường (~2.600–3.300) làm cảnh nền.
// Biển mây từ ~3.800. Địa hình tự nhiên giữ "nét" bản v3 (nhiễu ở toạ độ x/1,6), vùng đặt thẳng ở toạ độ mới.
// (Bản v3: thủy đạo Bát Môn canals.js khắc vào thành — v4 bỏ, thành mới không còn hào / kênh cũ.)
import { riverCarve, RIVER_CTRL, WATER_LEVEL, CITY_WALL_A, CITY_FLAT_A, LAKE, lakeBed, octMax } from './waterways.js';
export const SCALE = 1.6;          // tỉ lệ nhiễu so với bản 2048 m gốc (giữ nét đồi núi)
export const WORLD = 8192;         // 32 chunk × 256 m (terrain-mesh.CHUNK)
export const HALF = WORLD / 2;     // 4096
export const WATER = WATER_LEVEL;  // mực nước hồ / sông (-6, waterways.js)
export const CLOUD_SEA = -70;      // biển mây quanh rìa thế giới
export const EDGE = 3800;          // bán kính bắt đầu đổ xuống biển mây
// dải không gian nội thất (phòng tiệm / nhà / điện thờ) ở rìa Đông, ngoài biển mây — rooms.js, world.js › ROOMS, protocol.WORLD_TILES
export const ROOM_X0 = HALF + 250; // 4346
export const ROOM_X1 = ROOM_X0 + 2320; // mép Đông cùng của dải phòng (v4: lưới phòng 76 cột × 30 m — roomgrid.js)

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

// --- các vùng (C1). kind: city (cao nguyên phẳng) · peak (núi tông môn) · valley · lake · plateau. Toạ độ mét v4.
// Núi tông môn ngoài tường theo hướng cung tương ứng (r = 2.950 từ tâm); hồ Cùng Thông trong thành (khu Tốn).
const RD = 2950, D2 = RD * Math.SQRT1_2;
export const REGIONS = [
  { id: 'thanh', name: 'Huyền Thành', x: 0, z: 0, r: 2200, kind: 'city', h: 0 }, // Bát Quái Thành v4 (citylayout.js), tường trung đoạn 2.125
  { id: 'tubinh', name: 'Tử Bình Phong', x: -D2, z: -D2, r: 368, kind: 'peak', h: 420 },   // Càn (Tây Bắc)
  { id: 'manh', name: 'Manh Phái Cốc', x: D2, z: -D2, r: 368, kind: 'valley', h: 300 },    // Cấn (Đông Bắc)
  { id: 'trichthien', name: 'Trích Thiên Đỉnh', x: -D2, z: D2, r: 336, kind: 'peak', h: 380 }, // Khôn (Tây Nam)
  { id: 'cungthong', name: 'Cùng Thông Hồ', x: LAKE.x, z: LAKE.z, r: LAKE.r, kind: 'lake', h: LAKE.bedMid }, // TRONG thành, khu Tốn
  { id: 'thulau', name: 'Thư Lâu Lâm', x: 0, z: -RD, r: 256, kind: 'plateau', h: 110 },   // Khảm (Bắc)
  { id: 'phongthuy', name: 'Phong Thủy Viên', x: -RD, z: 0, r: 240, kind: 'plateau', h: 55 }, // Đoài (Tây)
  { id: 'lichduong', name: 'Lịch Đường', x: RD, z: 0, r: 240, kind: 'plateau', h: 55 },   // Chấn (Đông)
];
// QUẬN ĐẢO BAY «THIÊN BÀN» (docs/GAME-TROI-THIET-KE.md §1.1): 9 đảo trời, mặt nền cùng y 460.
// Đây là NGUỒN TOẠ ĐỘ DUY NHẤT cho cảnh (landmarks.js › SPOTS), nền đi được (registerSkyDistrict dưới đây)
// và nhãn (PLACES). r = bán kính đĩa đảo = mảng nền bát giác nội tiếp.
import { addPlatform } from './obstacles.js';
export const SKY_DISTRICT = [
  { id: 'thienban', name: 'Thiên Bàn Đảo', x: 0, z: 0, y: 460, r: 260 },        // đảo CHỦ Ø520 quanh sky_palace
  { id: 'quanthinh', name: 'Quan Tinh Đảo', x: 500, z: -260, y: 460, r: 130 },   // lầu các quan tinh
  { id: 'thudao', name: 'Thư Đạo Đảo', x: -500, z: -280, y: 460, r: 130 },      // thư các
  { id: 'laungoc', name: 'Lầu Ngọc Đảo', x: 20, z: -640, y: 460, r: 130 },      // 2 lầu song sinh
  { id: 'thiendan', name: 'Thiên Đàn Đảo', x: -40, z: 640, y: 460, r: 130 },    // đài tế tròn
  { id: 'thienquan', name: 'Thiền Quán Đảo', x: -640, z: 420, y: 460, r: 130 }, // 3 thảo lư
  { id: 'ansi', name: 'Ứn Sĩ Đảo', x: 640, z: 420, y: 460, r: 90 },             // hermit + núi đá
  { id: 'duocvien', name: 'Dược Viên Đảo', x: 1290, z: 60, y: 460, r: 90 },     // vườn dược
  { id: 'vancanh', name: 'Vân Cảnh Đảo', x: -1290, z: 60, y: 460, r: 90 },      // đình tròn
];
// tham chiếu cũ (đảo chủ) — mọi nơi chỉ dùng .x/.z thì vẫn đúng; y 520 → 460, r 192 → 260 theo layout mới
export const SKY_ISLAND = SKY_DISTRICT[0];

// Cầu vân B1–B4 (§1.2): đảo chủ ↔ 4 đảo gần. Đoạn neo CHỐT THEO MÉP NỀN BÁT GIÁC THẬT (không phải R−8 của
// đĩa — bát giác 2 hình vuông chỉ tới R ở 8 hướng đỉnh, giữa hai đỉnh chỉ tới 0,707R·√2/… → neo theo R−8
// sẽ HỞ 8–45 m tuỳ hướng, người bước từ đảo xuống cầu thì rơi). neo = reach(θ) − 6 (chồng 6 m vào nền).
const skyOctReach = (R, ux, uz) => Math.max((R * Math.SQRT1_2) / Math.max(Math.abs(ux), Math.abs(uz)), R / (Math.abs(ux) + Math.abs(uz)));
export const SKY_Y = 460;                                   // mặt nền chung 9 đảo + cầu (§6.4)
export const SKY_BRIDGE_W = 5, SKY_SEG = 40;                // cầu rộng 5 m (vân lộ ≥ 4 m — không cần lan can kín), cấu kiện 40 m
// mỗi cầu: id, a/b (điểm neo trên nền đảo), ux/uz (đơn vị hướng), segs (tâm từng cấu kiện 40 m; ry = hướng nền)
export const SKY_BRIDGES = [];
{
  const pair = (a, b) => {
    const A = SKY_DISTRICT.find((s) => s.id === a), B = SKY_DISTRICT.find((s) => s.id === b);
    const d = Math.hypot(B.x - A.x, B.z - A.z), ux = (B.x - A.x) / d, uz = (B.z - A.z) / d;
    const a0 = { x: A.x + ux * (skyOctReach(A.r, ux, uz) - 6), z: A.z + uz * (skyOctReach(A.r, ux, uz) - 6) };
    const b0 = { x: B.x - ux * (skyOctReach(B.r, ux, uz) - 6), z: B.z - uz * (skyOctReach(B.r, ux, uz) - 6) };
    const span = Math.hypot(b0.x - a0.x, b0.z - a0.z), n = Math.ceil(span / SKY_SEG), segs = [];
    for (let k = 0; k < n; k++) {
      const t = a0.x + ux * (SKY_SEG * k + SKY_SEG / 2), w = a0.z + uz * (SKY_SEG * k + SKY_SEG / 2);
      segs.push({ x: t, z: w, ry: Math.atan2(ux, uz) }); // ry nền: trục d (40 m) dọc u — quy ước obstacles.local
    }
    return { id: `${a}-${b}`, a: a0, b: b0, ux, uz, segs };
  };
  for (const [a, b] of [['thienban', 'quanthinh'], ['thienban', 'thudao'], ['thienban', 'laungoc'], ['thienban', 'thiendan']]) SKY_BRIDGES.push(pair(a, b));
}

// Nền đi được của quận (§1.3: mỗi đảo 2 lệnh bát giác nội tiếp; cầu: mỗi cấu kiện 1 nền bot 457 — bay / đi
// dưới cầu không bị nhấc). Đăng ký ngay lúc nạp module: mọi nơi dùng platformTop (motion đi bộ, world.blockedAt,
// world3d.groundY) đều thấy nền đồng thời — nền sky bị platformTop bỏ qua khi lời gọi không có y (obstacles.js).
export function registerSkyDistrict() {
  for (const s of SKY_DISTRICT) {
    const w = s.r * Math.SQRT2;
    addPlatform(s.x, s.z, w, w, 0, SKY_Y, SKY_Y - 5, true);        // vuông dọc trục
    addPlatform(s.x, s.z, w, w, Math.PI / 4, SKY_Y, SKY_Y - 5, true); // vuông xoay 45° → hợp = 16 cạnh nội tiếp đĩa R
  }
  for (const b of SKY_BRIDGES) for (const q of b.segs) addPlatform(q.x, q.z, SKY_BRIDGE_W, SKY_SEG, q.ry, SKY_Y, SKY_Y - 3, true);
}
registerSkyDistrict();

// Sông Huyền Hà (waterways.js) — RIVER = điểm điều khiển tim sông chính, giữ tên cũ cho nơi dùng.
export const RIVER = RIVER_CTRL;

// khoảng cách có dấu tới tường bát giác Ngoại Thành (trung đoạn CITY_OCT, âm = trong thành)
export const CITY_OCT = CITY_WALL_A; // 2125 = citylayout.CITY.A (test-game-city-v4 kiểm khớp)
export function cityOctDist(x, z) { return octMax(x, z) - CITY_OCT; }

// bán kính + độ cao bình đài trên đỉnh núi (landmarks.js đặt quần thể lên đây)
export const PEAK_PAD = 125 * SCALE;
export function peakPadH(g) { return g.h * 0.86 + 40; }

const CITY_BLEND = 240; // từ mép phẳng (tường + 40) chuyển dần về địa hình tự nhiên trong 240 m
// Trong thành: phẳng y 0, chỉ khắc sông (kè đứng) + hồ. Ngoài: địa hình tự nhiên, bờ sông dốc, rìa biển mây.
export function heightAt(x, z) {
  const oct = octMax(x, z);
  if (oct <= CITY_FLAT_A) {
    const lb = lakeBed(x, z);
    const h = riverCarve(x, z, 0);
    return lb == null ? h : Math.min(h, lb);
  }
  let h = natural(x, z);
  if (oct < CITY_FLAT_A + CITY_BLEND) h *= smooth(CITY_FLAT_A, CITY_FLAT_A + CITY_BLEND, oct);
  h = riverCarve(x, z, h);
  const r = Math.hypot(x, z);
  if (r > EDGE) { const k = smooth(EDGE, HALF, r); h = h * (1 - k) + CLOUD_SEA * k; }
  return h;
}
// địa hình tự nhiên ngoài thành (nhiễu ở toạ độ thu nhỏ X = x / 1,6 để giữ nét đồi núi v3)
function natural(x, z) {
  const X = x / SCALE, Z = z / SCALE;
  let h = 28 + 34 * fbm(X / 420, Z / 420) + 70 * Math.pow(ridged(X / 520 + 9, Z / 520 - 3), 2.2);
  for (const g of REGIONS) {
    const d = Math.hypot(x - g.x, z - g.z);
    if (g.kind === 'peak') {
      const k = 1 - smooth(0, g.r * 1.6, d);
      if (k > 0) h += g.h * Math.pow(k, 1.6) * (0.82 + 0.18 * ridged(X / 90, Z / 90, 4));
    } else if (g.kind === 'valley') {
      if (d > g.r * 1.8) continue;
      const ring = smooth(g.r * 0.35, g.r * 0.9, d) * (1 - smooth(g.r * 1.1, g.r * 1.8, d));
      h += g.h * ring * (0.75 + 0.25 * ridged(X / 70, Z / 70, 4));
      h = h * (0.35 + 0.65 * smooth(g.r * 0.2, g.r * 0.6, d)) + 8 * (1 - smooth(g.r * 0.2, g.r * 0.6, d));
    }
  }
  // bình đài đỉnh núi tông môn: san phẳng chóp (đặt cung điện), quanh mép thành vách dựng
  for (const g of REGIONS) {
    if (g.kind !== 'peak') continue;
    const k = 1 - smooth(PEAK_PAD * 0.85, PEAK_PAD * 1.35, Math.hypot(x - g.x, z - g.z));
    if (k > 0) h = h * (1 - k) + peakPadH(g) * k;
  }
  // cao nguyên phẳng ngoài thành (thư lâu, phong thủy viên, lịch đường)
  for (const g of REGIONS) {
    if (g.kind !== 'plateau') continue;
    const k = 1 - smooth(g.r * 0.85, g.r * 1.45, Math.hypot(x - g.x, z - g.z));
    if (k > 0) h = h * (1 - k) + g.h * k;
  }
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
  if (cityOctDist(x, z) < 30) return 0; // Bát Quái Thành: cây đặt tay
  for (const c of CLEARINGS) if (Math.hypot(x - c.x, z - c.z) < c.r) return 0;
  const h = heightAt(x, z);
  if (h < WATER + 1.5 || h > 330) return 0;
  const s = slopeAt(x, z);
  if (s > 0.9) return 0;
  return Math.max(0, 0.55 + 0.6 * fbm(x / 160 + 40, z / 160 - 11, 3)) * (1 - smooth(0.5, 0.9, s));
}
