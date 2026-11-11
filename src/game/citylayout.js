// ============================================================================
//  BÁT QUÁI THÀNH v4 — bố cục thành (thuần JS, tất định, không three.js / DOM). Một nguồn cho: dựng 3D (giai đoạn 2),
//  va chạm, NPC, máy chủ, test Node. Thay cityblocks.js / innerfill.js / canals.js (các module cũ giữ nguyên tới khi
//  giai đoạn 2 đập bỏ thành cũ).
//
//  Hình thể: bát giác, 8 cung / 8 cổng theo Hậu Thiên (batquai.js › GUA, toWorld). Tường trung đoạn 2.125 m.
//    Nội Thành   ≤ 380   — Sơn Môn (≤ 190), đường Sơn Môn 200, PHỐ THẦY BÓI (vành 290), 4 đền, quảng trường trung tâm (Ly)
//    Trung Thành 380–1.050 — 8 khu chợ, mỗi khu một quảng trường chợ ở giao lộ đại lộ × vành 700
//    Ngoại Thành 1.050–2.125 — 8 khu, mỗi khu quanh một công trình trọng điểm cũ ở ~1.150–1.450 m (bảng NGOAI)
//  Đường: 8 đại lộ 32 m · vành 24 m ở 380 / 700 / 1.050 / 1.500 / 1.850 · phố nhánh 12 m chia ô ~120 × 80 m
//    (phố ngang theo u, phố dọc theo v, phố ranh giữa hai cung, đường nội tường 2.108) · ngõ 6 m giữa mỗi ô.
//  Lô: MỌI lô mặt đại lộ / vành / quảng trường là CỬA HÀNG có loại trong items.SHOP_TYPES; lô góc giao lộ lớn là
//    tửu lâu / trà lâu; mặt phố nhánh: tiệm nhỏ xen nhà ở; mặt ngõ: nhà ở. Phố theo chủ đề (phố thuốc, phố gốm…).
//    Mỗi khu (16 khu Trung + Ngoại) đủ mọi loại tiệm + đúng 1 Dịch Trạm, 1 Nha Môn, 1 Tiền Trang, 1 miếu.
//  Nước: sông Huyền Hà / Nam Khê / hồ Cùng Thông (waterways.js), kè đứng, 3 thủy môn, 5 cầu (3 cầu đại lộ, 2 cầu bộ).
//
//  Nhà sinh LƯỜI theo ô 256 m (cell), tất định theo hạt giống; id ổn định `${cellId}:${i}` (cellId = `${ix}_${iz}`).
//  API: cellsInRange(x, z, r) · cell(id) · cellIdAt(x, z) · cityCells() · houseAt(id) · shopAt(id) · districtOf(x, z)
//       districts() · stations() · spawnPoints() · bridges() · waterGates() · gates() · landmarks() · plazas() · roads()
//       blocks() · streets() · deckTop(b, t)
//  Khung cục bộ cung: u theo trục (tâm → cổng), v ngang (batquai.toWorld). Mọi toạ độ trả ra là mét thế giới (x, z).
// ============================================================================
import { GUA, TAN8, toWorld, toLocal, faceDir } from './batquai.js';
import { SHOP_TYPES } from './items.js';
import { HALF } from './terrain.js';
import { CITY_WALL_A, RIVER_ARC_U, QUAY_W, LAKE, isWater, waterGates as wGates, channels, octMax } from './waterways.js';

export const CITY = {
  A: CITY_WALL_A, WALL_T: 8, CELL: 256, SEED: 'huyen-thanh-v4',
  NOI_A: 380, TRUNG_A: 1050, SONMON_A: 190, RINGS: [380, 700, 1050, 1500, 1850],
  AVE_W: 32, RING_W: 24, STREET_W: 12, ALLEY_W: 6, COL: 120, ROW: 80, SETBACK: 1,
  GATE_W: 40, RIVER_U: RIVER_ARC_U, QUAY_W,
};
const SB = CITY.SETBACK, SW = CITY.STREET_W, AH = CITY.AVE_W / 2, C0 = AH + SB; // lô bắt đầu cách tim đại lộ 17 m
const vmax = (u) => u * TAN8 - SW / 2 - SB; // mép lô phía phố ranh giữa hai cung
const G = (id) => GUA.find((g) => g.id === id);
export const FRONT_KINDS = new Set(['avenue', 'ring', 'plaza']);
const SIDE_KINDS = new Set(['lane', 'street', 'boundary']);
const VILLA_BANDS = new Set(['g2', 'g3']); // Ngoại Thành ngoài vành 1.500: nhà vườn, không chia ngõ
const CORNER_TYPES = ['tuu', 'tralau'];
const UNIQUE_TYPES = ['dichtram', 'namon'];
export const STREET_TYPES = Object.keys(SHOP_TYPES).filter((k) => !CORNER_TYPES.includes(k) && !UNIQUE_TYPES.includes(k));
const STREET_NAME = { moc: 'Phố Thợ Mộc', gom: 'Phố Gốm', den: 'Phố Đèn Lồng', thuhoa: 'Phố Thư Họa', hoavien: 'Phố Hoa', phongthuy: 'Phố Địa Lý', huong: 'Phố Hương', tratrang: 'Phố Trà', duoc: 'Phố Thuốc', loren: 'Phố Lò Rèn' };

// --- tên khu
const TRUNG = { kan: 'Khảm Thủy Thị', qian: 'Càn Kim Thị', gen: 'Cấn Sơn Thị', zhen: 'Chấn Mộc Thị', xun: 'Tốn Phong Thị', li: 'Ly Hỏa Thị', kun: 'Khôn Điền Thị', dui: 'Đoài Trạch Thị' };
// Ngoại Thành: công trình trọng điểm cũ (world.js › HALLS id) làm tâm khu; uc = tâm quảng trường dọc đại lộ (Khôn / Tốn:
// Ly: đầu cầu bờ Bắc sông, Ly là cảng Nam Môn); side = bên đại lộ đặt công trình
export const NGOAI = {
  kan: { name: 'Khảm · Thư Lâu', hall: { id: 'thuvien', name: 'Thư Lâu' }, region: 'thulau', uc: 1350, side: 1 },
  qian: { name: 'Càn · Tử Bình', hall: { id: 'cachcuc', name: 'Sảnh Cách Cục' }, region: 'tubinh', uc: 1350, side: 1 },
  gen: { name: 'Cấn · Manh Phái', hall: { id: 'tuongphap', name: 'Sảnh Tượng Pháp' }, region: 'manh', uc: 1350, side: 1 },
  zhen: { name: 'Chấn · Lịch Đường', hall: { id: 'trach', name: 'Sảnh Trạch Nhật' }, region: 'lichduong', uc: 1350, side: 1 },
  xun: { name: 'Tốn · Cùng Thông Hồ', hall: { id: 'dieuhau', name: 'Sảnh Điều Hậu' }, region: 'cungthong', uc: 1150, side: -1 },
  li: { name: 'Ly · Nam Môn', hall: { id: 'namoncang', name: 'Nam Môn Cảng' }, region: 'thanh', uc: 1150, side: 1, port: true },
  kun: { name: 'Khôn · Trích Thiên', hall: { id: 'tuvi', name: 'Sảnh Tử Vi' }, region: 'trichthien', uc: 1150, side: 1 },
  dui: { name: 'Đoài · Phong Thủy Viên', hall: { id: 'duongtrach', name: 'Sảnh Dương Trạch' }, region: 'phongthuy', uc: 1350, side: 1 },
};
const NOI_TEMPLES = [
  { g: 'li', id: 'denchinh', name: 'Huyền Thiên Chính Điện' },
  { g: 'kan', id: 'vanxuong', name: 'Văn Xương Các' },
  { g: 'zhen', id: 'daumau', name: 'Đẩu Mẫu Điện' },
  { g: 'dui', id: 'laoquan', name: 'Lão Quân Điện' },
];

// --- tiện ích
const hash = (s) => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry = (seed) => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const W = (g, u, v) => toWorld(g, u, v);
const r1 = (x) => Math.round(x * 100) / 100;

// --- đường (đoạn thẳng thế giới). kind: avenue · ring · street · boi · boundary · lane · alley
const ROAD_DEF = {
  sm: { name: 'sm', a: 200, w: SW, kind: 'street', label: 'Đường Sơn Môn' },
  boi: { name: 'boi', a: 290, w: SW, kind: 'boi', label: 'Phố Thầy Bói' },
  wr: { name: 'wr', a: CITY.A - CITY.WALL_T / 2 - 3 - SW / 2, w: SW, kind: 'street', label: 'Đường Nội Tường' }, // 2112
};
for (const a of CITY.RINGS) ROAD_DEF[`r${a}`] = { name: `r${a}`, a, w: CITY.RING_W, kind: 'ring', label: `Vành ${a}` };
const BANDS = [
  { id: 'n1', ring: 'noi', in: ROAD_DEF.sm, out: ROAD_DEF.boi },
  { id: 'n2', ring: 'noi', in: ROAD_DEF.boi, out: ROAD_DEF.r380 },
  { id: 't1', ring: 'trung', in: ROAD_DEF.r380, out: ROAD_DEF.r700 },
  { id: 't2', ring: 'trung', in: ROAD_DEF.r700, out: ROAD_DEF.r1050 },
  { id: 'g1', ring: 'ngoai', in: ROAD_DEF.r1050, out: ROAD_DEF.r1500 },
  { id: 'g2', ring: 'ngoai', in: ROAD_DEF.r1500, out: ROAD_DEF.r1850 },
  { id: 'g3', ring: 'ngoai', in: ROAD_DEF.r1850, out: ROAD_DEF.wr },
];

// ============================================================================
//  CẦU (5) — 3 cầu đại lộ (Khôn, Ly, Tốn) + 2 cầu bộ trên phố dọc khu Ly. Mặt cầu: đỉnh 4,0 m trên mặt thành,
//  tĩnh không 9 m trên mặt nước (−6 → đáy dầm +3), dốc cosin dài 80 m mỗi đầu (dốc lớn nhất π/2 · 4 / 80 ≈ 7,9 %).
//  Khuôn như bridges.js (deckTop dùng chung): { x, z, ax, az, L, f, H, y0, y1, r0, r1, W, water, thick, piers }
// ============================================================================
const DECK = { thick: 1.0, clear: 9, ramp: 80 };
const DECK_H = -6 + DECK.clear + DECK.thick; // 4,0
const laneV = (k) => C0 + k * (CITY.COL + SW) + CITY.COL + SW / 2; // tim phố dọc thứ k (giữa cột k và k+1): 143, 275, 407…
function mkBridge(id, name, kind, g, u, v, Wd, road) {
  const p = W(g, u, v), half = 60 + QUAY_W; // nửa bề rộng sông trong thành + kè
  const L = half + DECK.ramp;
  const piers = (kind === 'road' ? [-34, 34] : [-30, 30]).map((t) => ({ x: r1(p.x + g.dir[0] * t), z: r1(p.z + g.dir[1] * t), r: kind === 'road' ? 3 : 1.6 }));
  return { id, name, kind, road, gua: g.id, x: r1(p.x), z: r1(p.z), ax: g.dir[0], az: g.dir[1], L, f: half, r0: DECK.ramp, r1: DECK.ramp, H: DECK_H, y0: 0, y1: 0, W: Wd, water: -6, thick: DECK.thick, clearance: DECK.clear, maxGrade: (Math.PI / 2) * DECK_H / DECK.ramp, piers };
}
const BRIDGES = [
  mkBridge('cau-khon', 'Khôn Nguyên Kiều', 'road', G('kun'), RIVER_ARC_U, 0, 30, 'av:kun'),
  mkBridge('cau-namon', 'Nam Môn Đại Kiều', 'road', G('li'), RIVER_ARC_U, 0, 30, 'av:li'),
  mkBridge('cau-ton', 'Tốn Phong Kiều', 'road', G('xun'), RIVER_ARC_U, 0, 30, 'av:xun'),
  mkBridge('cau-tay', 'Tây Thủy Kiều (cầu bộ)', 'foot', G('li'), RIVER_ARC_U, laneV(1), 6, 'lane'),
  mkBridge('cau-dong', 'Đông Thủy Kiều (cầu bộ)', 'foot', G('li'), RIVER_ARC_U, -laneV(1), 6, 'lane'),
];
/** cao độ mặt cầu tại toạ độ t dọc hướng băng qua (−L…L) — như bridges.deckTop */
export function deckTop(b, t) {
  const e = (k) => (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, k)))) / 2;
  if (t < -b.L || t > b.L) return 0;
  if (t < -b.L + b.r0) return b.y0 + (b.H - b.y0) * e((t + b.L) / b.r0);
  if (t > b.L - b.r1) return b.y1 + (b.H - b.y1) * e((b.L - t) / b.r1);
  return b.H;
}
const onBridge = (x, z, pad = 0) => BRIDGES.find((b) => { const t = (x - b.x) * b.ax + (z - b.z) * b.az, n = -(x - b.x) * b.az + (z - b.z) * b.ax; return Math.abs(t) <= b.L + pad && Math.abs(n) <= b.W / 2 + pad; }) || null;

// ============================================================================
//  ĐƯỜNG — cắt bỏ đoạn ngập nước (trừ chỗ có cầu: giữ, gắn bridge)
// ============================================================================
const ROADS = [];
function addRoad(kind, key, w, a, b, label) {
  const L = Math.hypot(b.x - a.x, b.z - a.z); if (L < 1) return;
  const n = Math.max(1, Math.ceil(L / 3));
  let run = null; const pieces = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
    const wet = isWater(x, z, 0.5), br = wet ? onBridge(x, z) : null;
    const st = wet ? (br ? br.id : null) : '';
    if (st === null) { if (run) { pieces.push(run); run = null; } continue; }
    if (run && run.st === st) { run.t1 = t; } else { if (run) pieces.push(run); run = { st, t0: t, t1: t }; }
  }
  if (run) pieces.push(run);
  // gộp các khúc khô / cầu liền nhau thành đoạn; khúc cầu gắn id cầu
  pieces.forEach((p, i) => {
    if ((p.t1 - p.t0) * L < 2) return;
    const pa = { x: r1(a.x + (b.x - a.x) * p.t0), z: r1(a.z + (b.z - a.z) * p.t0) }, pb = { x: r1(a.x + (b.x - a.x) * p.t1), z: r1(a.z + (b.z - a.z) * p.t1) };
    ROADS.push({ id: pieces.length > 1 ? `${key}#${i}` : key, kind, w, a: pa, b: pb, label: label || null, bridge: p.st || null });
  });
}

// ============================================================================
//  Ô PHỐ (block). Bước 1: lưới ô (u, v) mỗi cung × dải vành × nửa (s = ±1, bên phải / trái đại lộ) × hàng × cột.
// ============================================================================
const RAW = new Map();      // khoá `${g}|${band}|${s}|${row}|${col}` → ô thô
const RAW_LIST = [];
const ROWS_OF = {};         // `${g}|${band}` → [{ r0, r1 }]
function bandRows(band) {
  const u0 = band.in.a + band.in.w / 2 + SB, u1 = band.out.a - band.out.w / 2 - SB, U = u1 - u0;
  const n = Math.max(1, Math.round((U + SW) / (CITY.ROW + SW))), d = (U - (n - 1) * SW) / n;
  return Array.from({ length: n }, (_, i) => ({ r0: u0 + i * (d + SW), r1: u0 + i * (d + SW) + d }));
}
function rowCols(r0) {
  const W0 = vmax(r0) - C0;
  let n = Math.max(1, Math.round((W0 + SW) / (CITY.COL + SW)));
  if (n > 1 && W0 - (n - 1) * (CITY.COL + SW) < 40) n--;
  return n;
}
const districtId = (ring, gid) => (ring === 'noi' ? 'noi' : `${ring}-${gid}`);

for (const g of GUA) {
  for (const band of BANDS) {
    const rows = bandRows(band); ROWS_OF[`${g.id}|${band.id}`] = rows;
    for (const s of [1, -1]) {
      rows.forEach((row, ri) => {
        const n = rowCols(row.r0);
        for (let ci = 0; ci < n; ci++) {
          const last = ci === n - 1, c0 = C0 + ci * (CITY.COL + SW), c1 = c0 + CITY.COL;
          // đỉnh cục bộ (u, v ≥ 0) theo thứ tự: trong-gần, ngoài-gần, ngoài-xa, trong-xa
          const loc = [[row.r0, c0], [row.r1, c0], [row.r1, last ? vmax(row.r1) : c1], [row.r0, last ? vmax(row.r0) : c1]];
          const edges = [
            ci === 0 ? { kind: 'avenue', key: `av:${g.id}:${band.id}:${s}` } : { kind: 'lane', key: `ln:${g.id}:${band.id}:${s}:${ci - 1}` },
            ri === rows.length - 1 ? { kind: band.out.kind, key: `${band.out.name}:${g.id}:${s}:in` } : { kind: 'street', key: `x:${g.id}:${band.id}:${s}:${ri}` },
            last ? { kind: 'boundary', key: `bd:${g.id}:${band.id}:${s}` } : { kind: 'lane', key: `ln:${g.id}:${band.id}:${s}:${ci}` },
            ri === 0 ? { kind: band.in.kind, key: `${band.in.name}:${g.id}:${s}:out` } : { kind: 'street', key: `x:${g.id}:${band.id}:${s}:${ri - 1}` },
          ];
          const blk = { key: `${g.id}|${band.id}|${s}|${ri}|${ci}`, g, band, s, row: ri, col: ci, last, loc, edges, kind: 'lots', district: districtId(band.ring, g.id) };
          RAW.set(blk.key, blk); RAW_LIST.push(blk);
        }
      });
    }
  }
}
const locW = (blk, u, v) => W(blk.g, u, blk.s * v);
const rawPoly = (blk) => blk.loc.map(([u, v]) => locW(blk, u, v));
const polyDry = (P, pad) => { const c = centroid(P); for (const p of [...P, c, ...P.map((q, i) => mid(q, P[(i + 1) % P.length]))]) if (isWater(p.x, p.z, pad)) return false; return true; };
function centroid(P) { let x = 0, z = 0; for (const p of P) { x += p.x; z += p.z; } return { x: x / P.length, z: z / P.length }; }
function mid(a, b) { return { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 }; }

// --- Bước 2: quảng trường + đền / sảnh
const PLAZAS = [];   // { id, district, name, blocks: [rawKey], poly(s), centre }
const LANDMARKS = []; // { id, kind: 'sonmon'|'temple'|'hall', name, x, z, w, d, ry, district, door }
function plazaOf(id, district, name, keys) {
  const blocks = keys.map((k) => RAW.get(k)).filter(Boolean);
  for (const b of blocks) { b.kind = 'plaza'; b.plaza = id; }
  const polys = blocks.map((b) => rawPoly(b).map((p) => ({ x: r1(p.x), z: r1(p.z) })));
  const all = polys.flat(), c = centroid(all);
  const P = { id, district, name, blocks: blocks.map((b) => b.key), polys, centre: { x: r1(c.x), z: r1(c.z) } };
  PLAZAS.push(P); return P;
}
// Nội Thành: quảng trường trung tâm (cung Ly, dải n2) + 4 đền (dải n1, bên phải đại lộ)
plazaOf('plaza-noi', 'noi', 'Quảng Trường Huyền Thành', ['li|n2|1|0|0', 'li|n2|-1|0|0']);
for (const t of NOI_TEMPLES) {
  const b = RAW.get(`${t.g}|n1|1|0|0`); b.kind = 'temple';
  const P = rawPoly(b), c = centroid(P), g = G(t.g), l = toLocal(g, c.x, c.z);
  const door = W(g, l.u, (b.loc[0][1] - 1.5)); // trước mặt đại lộ
  LANDMARKS.push({ id: t.id, kind: 'temple', name: t.name, x: r1(c.x), z: r1(c.z), w: 44, d: 52, ry: faceDir(g.dir[1], -g.dir[0]), district: 'noi', block: b.key, poly: P.map((p) => ({ x: r1(p.x), z: r1(p.z) })), door: { x: r1(door.x), z: r1(door.z) } });
}
LANDMARKS.push({ id: 'sonmon', kind: 'sonmon', name: 'Huyền Thiên Sơn Môn', x: 0, z: 0, apothem: CITY.SONMON_A, district: 'noi', door: (() => { const p = W(G('li'), CITY.SONMON_A + 4, 0); return { x: r1(p.x), z: r1(p.z) }; })() });
// Trung Thành: quảng trường chợ ở giao lộ đại lộ × vành 700 (hàng cuối t1 + hàng đầu t2, cột 0, hai bên)
for (const g of GUA) {
  const t1 = ROWS_OF[`${g.id}|t1`].length - 1;
  plazaOf(`plaza-trung-${g.id}`, `trung-${g.id}`, `Chợ ${TRUNG[g.id]}`, [`${g.id}|t1|1|${t1}|0`, `${g.id}|t1|-1|${t1}|0`, `${g.id}|t2|1|0|0`, `${g.id}|t2|-1|0|0`]);
}
// Ngoại Thành: quảng trường công trình trọng điểm (dải g1, cột 0, các hàng khô gần uc)
for (const g of GUA) {
  const N = NGOAI[g.id], rows = ROWS_OF[`${g.id}|g1`];
  let pick = [];
  for (const s of [1, -1]) rows.forEach((row, ri) => { const k = `${g.id}|g1|${s}|${ri}|0`; if (Math.abs((row.r0 + row.r1) / 2 - N.uc) <= 90 && polyDry(rawPoly(RAW.get(k)), QUAY_W)) pick.push(k); });
  if (!pick.length) { // dự phòng: hàng khô gần nhất
    let best = null, bd = Infinity;
    for (const s of [1, -1]) rows.forEach((row, ri) => { const k = `${g.id}|g1|${s}|${ri}|0`, d = Math.abs((row.r0 + row.r1) / 2 - N.uc); if (d < bd && polyDry(rawPoly(RAW.get(k)), QUAY_W)) { bd = d; best = k; } });
    pick = [best];
  }
  const P = plazaOf(`plaza-ngoai-${g.id}`, `ngoai-${g.id}`, `Quảng Trường ${N.hall.name}`, pick);
  // công trình đặt giữa phần quảng trường bên `side` (hoặc bên còn lại nếu bên đó không có ô)
  const mine = P.blocks.map((k) => RAW.get(k)).filter((b) => b.s === N.side);
  const use = mine.length ? mine : P.blocks.map((k) => RAW.get(k));
  const u0 = Math.min(...use.map((b) => b.loc[0][0])), u1 = Math.max(...use.map((b) => b.loc[1][0])), sd = use[0].s;
  const uc = (u0 + u1) / 2, vc = C0 + CITY.COL / 2, c = W(g, uc, sd * vc), door = W(g, uc, sd * (C0 + 6));
  LANDMARKS.push({ id: N.hall.id, kind: N.port ? 'port' : 'hall', name: N.hall.name, x: r1(c.x), z: r1(c.z), w: 44, d: 34, ry: faceDir(g.dir[1] * sd, -g.dir[0] * sd), district: `ngoai-${g.id}`, plaza: P.id, region: N.region, door: { x: r1(door.x), z: r1(door.z) } });
}
// Bước 2b: cạnh ô kề quảng trường → mặt tiền 'plaza'
const NB = (b, e) => { // ô thô kề cạnh e (0 = phía đại lộ / cột trước, 1 = hàng ngoài, 2 = cột sau, 3 = hàng trong)
  const { g, band, s, row, col } = b, bi = BANDS.indexOf(band), rows = ROWS_OF[`${g.id}|${band.id}`];
  if (e === 1) return row < rows.length - 1 ? RAW.get(`${g.id}|${band.id}|${s}|${row + 1}|${col}`) : bi < BANDS.length - 1 ? RAW.get(`${g.id}|${BANDS[bi + 1].id}|${s}|0|${col}`) : null;
  if (e === 3) return row > 0 ? RAW.get(`${g.id}|${band.id}|${s}|${row - 1}|${col}`) : bi > 0 ? RAW.get(`${g.id}|${BANDS[bi - 1].id}|${s}|${ROWS_OF[`${g.id}|${BANDS[bi - 1].id}`].length - 1}|${col}`) : null;
  if (e === 2) return RAW.get(`${g.id}|${band.id}|${s}|${row}|${col + 1}`);
  return col > 0 ? RAW.get(`${g.id}|${band.id}|${s}|${row}|${col - 1}`) : RAW.get(`${g.id}|${band.id}|${-s}|${row}|0`);
};
const OPP = [2, 3, 0, 1];
for (const b of RAW_LIST) {
  if (b.kind !== 'plaza') continue;
  for (let e = 0; e < 4; e++) {
    const n = NB(b, e); if (!n || n.kind !== 'lots') continue;
    const oe = e === 0 && b.col === 0 ? 0 : OPP[e]; // hai ô cột 0 đối diện qua đại lộ: cạnh 0 nhìn nhau
    n.edges[oe] = { kind: 'plaza', key: `plaza:${b.plaza}:${n.district}`, plaza: b.plaza };
  }
}

// --- Bước 3: chia ô có ngõ (ngõ 6 m theo u ở giữa ô đủ sâu) → ô lô cuối cùng
const BLOCKS = [];
const MIN_SPLIT = 2 * 14 + CITY.ALLEY_W + 4;
for (const b of RAW_LIST) {
  if (b.kind !== 'lots') continue;
  const [[ua, va], [ub, vb], [, vc], [, vd]] = b.loc, depth = ub - ua;
  const vAt = (u) => (b.last ? vmax(u) : vd + (vc - vd) * ((u - ua) / (ub - ua)));
  const mk = (u0, u1, eIn, eOut, sub) => {
    const loc = [[u0, va], [u1, vb], [u1, vAt(u1)], [u0, vAt(u0)]];
    const poly = loc.map(([u, v]) => locW(b, u, v));
    BLOCKS.push({ id: `${b.key}|${sub}`, idx: BLOCKS.length, raw: b.key, g: b.g.id, band: b.band.id, s: b.s, row: b.row, col: b.col, district: b.district, loc, poly, edges: [b.edges[0], eOut, b.edges[2], eIn] });
  };
  if (depth >= MIN_SPLIT && !VILLA_BANDS.has(b.band.id)) {
    const um = (ua + ub) / 2, h = CITY.ALLEY_W / 2;
    const al = { kind: 'alley', key: `al:${b.key}` };
    mk(ua, um - h, b.edges[3], al, 0); mk(um + h, ub, al, b.edges[1], 1);
    const a = locW(b, um, va - SB - 2), z = locW(b, um, vAt(um) + SB + 2);
    addRoad('alley', `al:${b.key}`, CITY.ALLEY_W, a, z);
  } else mk(ua, ub, b.edges[3], b.edges[1], 'x');
}
// pháp tuyến hướng vào trong ô cho từng cạnh (đa giác lồi)
for (const B of BLOCKS) {
  const c = centroid(B.poly);
  B.edges = B.edges.map((e, i) => {
    const P = B.poly[i], Q = B.poly[(i + 1) % 4], L = Math.hypot(Q.x - P.x, Q.z - P.z) || 1, tx = (Q.x - P.x) / L, tz = (Q.z - P.z) / L;
    let nx = -tz, nz = tx; if ((c.x - P.x) * nx + (c.z - P.z) * nz < 0) { nx = -nx; nz = -nz; }
    return { ...e, i, P, Q, L, tx, tz, nx, nz };
  });
}

// --- Bước 4: chủ đề phố + lô đặc biệt mỗi khu
const THEME = new Map(); // key phố → loại tiệm chủ đề
const SPECIAL = new Map(); // `${blockId}#${edge}` → 'dichtram' | 'namon' | 'tientrang' | 'mieu'
const edgeDry = (B, e) => { for (let k = 1; k < 6; k++) { const t = k / 6, x = e.P.x + (e.Q.x - e.P.x) * t + e.nx * 8, z = e.P.z + (e.Q.z - e.P.z) * t + e.nz * 8; if (isWater(x, z, QUAY_W + 2)) return false; } return true; };
const DISTRICT_IDS = ['noi', ...GUA.map((g) => `trung-${g.id}`), ...GUA.map((g) => `ngoai-${g.id}`)];
{
  const per = new Map(DISTRICT_IDS.map((d) => [d, { front: [], side: [], frontSeen: new Set(), sideSeen: new Set() }]));
  for (const B of BLOCKS) for (const e of B.edges) {
    const D = per.get(B.district), cls = FRONT_KINDS.has(e.kind) ? 'front' : SIDE_KINDS.has(e.kind) ? 'side' : null;
    if (!cls) continue;
    const seen = D[`${cls}Seen`]; if (seen.has(e.key)) { if (edgeDry(B, e)) D[cls].find((x) => x.key === e.key).dry = true; continue; }
    seen.add(e.key); D[cls].push({ key: e.key, dry: edgeDry(B, e) });
  }
  for (const [d, D] of per) for (const cls of ['front', 'side']) {
    const list = [...D[cls].filter((x) => x.dry), ...D[cls].filter((x) => !x.dry)], off = hash(d + cls) % STREET_TYPES.length;
    list.forEach((x, i) => THEME.set(x.key, STREET_TYPES[(i + off) % STREET_TYPES.length]));
  }
  // lô đặc biệt: Dịch Trạm + Nha Môn mặt quảng trường của khu; Tiền Trang + miếu mặt phố ngang khô gần tâm khu
  for (const d of DISTRICT_IDS) {
    if (d === 'noi') continue;
    const own = PLAZAS.find((p) => p.district === d);
    const c = own.centre;
    const dist = (B, e) => Math.hypot((e.P.x + e.Q.x) / 2 - c.x, (e.P.z + e.Q.z) / 2 - c.z);
    const cand = (pred) => BLOCKS.filter((B) => B.district === d).flatMap((B) => B.edges.filter((e) => pred(e) && edgeDry(B, e)).map((e) => ({ B, e, d: dist(B, e) }))).sort((a, b) => a.d - b.d);
    const pz = cand((e) => e.kind === 'plaza' && e.plaza === own.id && e.L >= 40);
    const pz2 = pz.length >= 2 ? pz : [...pz, ...cand((e) => FRONT_KINDS.has(e.kind) && e.L >= 40)];
    const usedB = new Set();
    const take = (list, what) => { const x = list.find((y) => !usedB.has(y.B.id) && !SPECIAL.has(`${y.B.id}#${y.e.i}`)); if (!x) throw new Error(`citylayout: ${d} thiếu chỗ cho ${what}`); usedB.add(x.B.id); SPECIAL.set(`${x.B.id}#${x.e.i}`, what); };
    take(pz2, 'dichtram'); take(pz2, 'namon');
    const xs = cand((e) => e.kind === 'street' && e.key.startsWith('x:') && e.L >= 60);
    take(xs, 'tientrang'); take(xs, 'mieu');
  }
}

// ============================================================================
//  ĐƯỜNG (dữ liệu) — đại lộ, vành, Sơn Môn, Phố Thầy Bói, nội tường, phố ranh, phố ngang, phố dọc (+ ngõ ở bước 3)
// ============================================================================
for (const g of GUA) {
  addRoad('avenue', `av:${g.id}`, CITY.AVE_W, W(g, CITY.SONMON_A, 0), W(g, CITY.A + CITY.WALL_T / 2 + 24, 0), `Đại Lộ ${g.name} (${g.gate})`);
  for (const R of Object.values(ROAD_DEF)) addRoad(R.kind, `${R.name}:${g.id}`, R.w, W(g, R.a, -R.a * TAN8), W(g, R.a, R.a * TAN8), R.label);
  const bv = (u) => W(g, u, u * TAN8);
  addRoad('boundary', `bd:${g.id}`, SW, bv(ROAD_DEF.sm.a), bv(ROAD_DEF.wr.a), `Phố Ranh ${g.name}`);
  for (const band of BANDS) {
    const rows = ROWS_OF[`${g.id}|${band.id}`];
    for (const s of [1, -1]) {
      rows.forEach((row, ri) => {
        if (ri < rows.length - 1) { const u = row.r1 + SW / 2; addRoad('street', `x:${g.id}:${band.id}:${s}:${ri}`, SW, W(g, u, s * AH), W(g, u, s * u * TAN8)); }
        const n = rowCols(row.r0), uA = ri === 0 ? band.in.a : row.r0 - SW / 2, uB = ri === rows.length - 1 ? band.out.a : row.r1 + SW / 2;
        for (let k = 0; k < n - 1; k++) addRoad('lane', `ln:${g.id}:${band.id}:${s}:${k}:${ri}`, SW, W(g, uA, s * laneV(k)), W(g, uB, s * laneV(k)));
      });
    }
  }
}

// ============================================================================
//  LÔ (sinh lười theo ô phố, tất định) — OBB: tâm (x, z), trục mặt tiền (tx, tz), pháp tuyến ra phố (nx, nz)
// ============================================================================
const LOT = {
  front: { f: [11, 15], d: 16 }, sideShop: { f: [10, 13], d: 14 }, home: { f: [14, 18], d: 14 },
  alley: { f: [13, 17], d: 13 }, boi: { f: [6, 8], d: 10 }, special: { f: [22, 22], d: 22 },
  villa: { f: [20, 26], d: 22 }, // nhà vườn Ngoại Thành ngoài vành 1.500 (không chia ngõ)
};
const SIDE_SHOP_P = 0.15, THEME_P = 0.65;
function overlap(a, b) {
  for (const [ax, az] of [[a.tx, a.tz], [a.nx, a.nz], [b.tx, b.tz], [b.nx, b.nz]]) {
    const ra = a.hw * Math.abs(a.tx * ax + a.tz * az) + a.hd * Math.abs(a.nx * ax + a.nz * az);
    const rb = b.hw * Math.abs(b.tx * ax + b.tz * az) + b.hd * Math.abs(b.nx * ax + b.nz * az);
    if (Math.abs((b.x - a.x) * ax + (b.z - a.z) * az) >= ra + rb + 0.05) return false; // khe ≥ 5 cm (đã tính làm tròn 1 cm)
  }
  return true;
}
export const lotCorners = (o) => [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([i, j]) => ({ x: o.x + o.tx * o.hw * i + o.nx * o.hd * j, z: o.z + o.tz * o.hw * i + o.nz * o.hd * j }));
const insidePoly = (B, p) => B.edges.every((e) => (p.x - e.P.x) * e.nx + (p.z - e.P.z) * e.nz >= -0.05);
const LOTS_OF = new Map(); // block idx → lô
function genBlock(B) {
  let got = LOTS_OF.get(B.idx); if (got) return got;
  const rnd = mulberry(hash(`${CITY.SEED}|${B.id}`)), out = [];
  const pr = (e) => { const sp = SPECIAL.has(`${B.id}#${e.i}`), fr = FRONT_KINDS.has(e.kind); return fr ? (sp ? 0 : 1) : sp ? 2 : e.kind === 'boi' ? 3 : SIDE_KINDS.has(e.kind) ? 4 : 5; };
  const order = [...B.edges].sort((a, b) => pr(a) - pr(b) || a.i - b.i);
  for (const e of order) {
    const front = FRONT_KINDS.has(e.kind), theme = THEME.get(e.key);
    let special = SPECIAL.get(`${B.id}#${e.i}`) || null, nShop = 0, cur = 0;
    const prevK = B.edges[(e.i + 3) % 4].kind, nextK = B.edges[(e.i + 1) % 4].kind;
    while (cur < e.L - 5) {
      // chọn loại lô trước (quyết định kích thước)
      let cls, use, type = null;
      if (special) cls = 'special';
      else if (front) cls = 'front';
      else if (e.kind === 'boi') cls = 'boi';
      else if (e.kind === 'alley') cls = 'alley';
      else cls = rnd() < SIDE_SHOP_P ? 'sideShop' : VILLA_BANDS.has(B.band) ? 'villa' : 'home';
      const spec = LOT[cls], f = spec.f[0] + (spec.f[1] - spec.f[0]) * rnd(), D = spec.d;
      if (cur + f > e.L + 0.01) break;
      const along = cur + f / 2;
      const o = { x: e.P.x + e.tx * along + e.nx * D / 2, z: e.P.z + e.tz * along + e.nz * D / 2, tx: e.tx, tz: e.tz, nx: -e.nx, nz: -e.nz, hw: f / 2, hd: D / 2 };
      const C = lotCorners(o);
      if (!C.every((p) => insidePoly(B, p)) || out.some((q) => overlap(o, q)) || [...C, o].some((p) => isWater(p.x, p.z, QUAY_W))) { cur += 1.5; continue; }
      // góc giao lộ (mặt tiền lớn, kề phố không phải ngõ) → tửu lâu / trà lâu
      const corner = front && ((cur < 18 && prevK !== 'alley') || (cur + f > e.L - 18 && nextK !== 'alley'));
      if (special) { const sp = special; special = null; if (sp === 'dichtram' || sp === 'namon') { use = 'shop'; type = sp; } else if (sp === 'tientrang') use = 'service'; else use = 'temple'; o.special = sp; }
      else if (front || cls === 'sideShop') {
        use = 'shop';
        if (corner) type = CORNER_TYPES[hash(`${B.id}|${e.i}|${Math.round(cur)}`) & 1];
        else if (front) { // mặt tiền lớn: 3 / 4 tiệm theo chủ đề phố (tiệm đầu luôn đúng chủ đề), còn lại loại khác
          type = nShop++ % 4 !== 3 ? theme : STREET_TYPES[Math.floor(rnd() * STREET_TYPES.length)];
        } else type = theme && rnd() < THEME_P ? theme : STREET_TYPES[Math.floor(rnd() * STREET_TYPES.length)];
      } else use = cls === 'boi' ? 'fortune' : 'home';
      if (cls === 'villa') o.villa = true;
      o.use = use; if (type) o.type = type; o.front = e.kind; o.street = e.key; o.corner = corner; o.edge = e.i;
      out.push(o); cur += f + 0.1;
    }
  }
  got = out.map((o, i) => {
    const door = { x: r1(o.x + o.nx * (o.hd + 1.5)), z: r1(o.z + o.nz * (o.hd + 1.5)) };
    const rec = { block: B.id, bi: i, x: r1(o.x), z: r1(o.z), w: r1(o.hw * 2), d: r1(o.hd * 2), tx: o.tx, tz: o.tz, nx: o.nx, nz: o.nz, ry: faceDir(o.nx, o.nz), door, use: o.use, front: o.front, street: o.street, corner: o.corner, district: B.district };
    if (o.type) { rec.type = o.type; rec.name = SHOP_TYPES[o.type].name; }
    if (o.use === 'service') { rec.svc = 'tientrang'; rec.name = 'Tiền Trang'; }
    if (o.use === 'temple') rec.name = `Miếu ${districtName(B.district)}`;
    if (o.use === 'fortune') rec.name = 'Quán Thầy Bói';
    if (o.special) rec.special = o.special;
    if (o.villa) rec.villa = true;
    return rec;
  });
  LOTS_OF.set(B.idx, got);
  return got;
}

// ============================================================================
//  Ô THẾ GIỚI 256 m (cell) — chỉ mục ô phố / đường / mốc theo hộp bao
// ============================================================================
const NC = Math.round((2 * HALF) / CITY.CELL); // 32
const cid = (ix, iz) => `${ix}_${iz}`;
export const cellIdAt = (x, z) => cid(Math.max(0, Math.min(NC - 1, Math.floor((x + HALF) / CITY.CELL))), Math.max(0, Math.min(NC - 1, Math.floor((z + HALF) / CITY.CELL))));
const IDX = new Map(); // cellId → { blocks: [idx], roads: [i], marks: [i] }
const bucket = (id) => { let b = IDX.get(id); if (!b) IDX.set(id, (b = { blocks: [], roads: [], marks: [] })); return b; };
function indexBox(x0, z0, x1, z1, f) {
  const i0 = Math.max(0, Math.floor((x0 + HALF) / CITY.CELL)), i1 = Math.min(NC - 1, Math.floor((x1 + HALF) / CITY.CELL));
  const j0 = Math.max(0, Math.floor((z0 + HALF) / CITY.CELL)), j1 = Math.min(NC - 1, Math.floor((z1 + HALF) / CITY.CELL));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) f(bucket(cid(i, j)));
}
for (const B of BLOCKS) { const xs = B.poly.map((p) => p.x), zs = B.poly.map((p) => p.z); indexBox(Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs), (b) => b.blocks.push(B.idx)); }
ROADS.forEach((r, i) => indexBox(Math.min(r.a.x, r.b.x) - r.w, Math.min(r.a.z, r.b.z) - r.w, Math.max(r.a.x, r.b.x) + r.w, Math.max(r.a.z, r.b.z) + r.w, (b) => b.roads.push(i)));
LANDMARKS.forEach((m, i) => { const R = m.apothem ? m.apothem * 1.09 : Math.max(m.w, m.d); indexBox(m.x - R, m.z - R, m.x + R, m.z + R, (b) => b.marks.push(i)); });

const CELLS = new Map();
/** nội dung một ô 256 m: { id, ix, iz, x0, z0, x1, z1, houses, shops, roads, landmarks, bridges } — houses[i].id = `${id}:${i}` */
export function cell(id) {
  let c = CELLS.get(id); if (c) return c;
  const [ix, iz] = String(id).split('_').map(Number);
  if (!(ix >= 0 && ix < NC && iz >= 0 && iz < NC)) return null;
  const x0 = -HALF + ix * CITY.CELL, z0 = -HALF + iz * CITY.CELL, x1 = x0 + CITY.CELL, z1 = z0 + CITY.CELL;
  const b = IDX.get(id) || { blocks: [], roads: [], marks: [] };
  const houses = [];
  for (const bi of [...b.blocks].sort((p, q) => p - q)) for (const L of genBlock(BLOCKS[bi])) if (L.x >= x0 && L.x < x1 && L.z >= z0 && L.z < z1) houses.push(L);
  const hs = houses.map((L, i) => ({ id: `${id}:${i}`, cell: id, ...L }));
  c = {
    id, ix, iz, x0, z0, x1, z1, houses: hs, shops: hs.filter((h) => h.use === 'shop'),
    roads: b.roads.map((i) => ROADS[i]), landmarks: b.marks.map((i) => LANDMARKS[i]),
    bridges: BRIDGES.filter((br) => Math.abs(br.x - (x0 + x1) / 2) <= CITY.CELL / 2 + br.L && Math.abs(br.z - (z0 + z1) / 2) <= CITY.CELL / 2 + br.L),
  };
  CELLS.set(id, c);
  return c;
}
/** id các ô 256 m giao với hình tròn (x, z, r) */
export function cellsInRange(x, z, r) {
  const out = [];
  const i0 = Math.max(0, Math.floor((x - r + HALF) / CITY.CELL)), i1 = Math.min(NC - 1, Math.floor((x + r + HALF) / CITY.CELL));
  const j0 = Math.max(0, Math.floor((z - r + HALF) / CITY.CELL)), j1 = Math.min(NC - 1, Math.floor((z + r + HALF) / CITY.CELL));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const x0 = -HALF + i * CITY.CELL, z0 = -HALF + j * CITY.CELL;
    const dx = Math.max(x0 - x, 0, x - (x0 + CITY.CELL)), dz = Math.max(z0 - z, 0, z - (z0 + CITY.CELL));
    if (dx * dx + dz * dz <= r * r) out.push(cid(i, j));
  }
  return out;
}
/** mọi ô có nhà / đường của thành */
export const cityCells = () => [...IDX.keys()].filter((id) => IDX.get(id).blocks.length || IDX.get(id).roads.length).sort();
export function houseAt(id) { const [c, i] = String(id).split(':'); const C = cell(c); return (C && C.houses[Number(i)]) || null; }
export function shopAt(id) { const h = houseAt(id); return h && h.use === 'shop' ? h : null; }

// ============================================================================
//  KHU · GA XE NGỰA · ĐIỂM HỒI SINH · CỔNG
// ============================================================================
function districtName(id) { return DISTRICTS.find((d) => d.id === id)?.name || id; }
const DISTRICTS = [
  { id: 'noi', ring: 'noi', gua: null, name: 'Nội Thành', centre: { x: 0, z: 0 }, plaza: 'plaza-noi' },
  ...GUA.map((g) => ({ id: `trung-${g.id}`, ring: 'trung', gua: g.id, name: TRUNG[g.id], centre: PLAZAS.find((p) => p.id === `plaza-trung-${g.id}`).centre, plaza: `plaza-trung-${g.id}` })),
  ...GUA.map((g) => { const L = LANDMARKS.find((m) => m.district === `ngoai-${g.id}`); return { id: `ngoai-${g.id}`, ring: 'ngoai', gua: g.id, name: NGOAI[g.id].name, centre: { x: L.x, z: L.z }, plaza: `plaza-ngoai-${g.id}`, hall: L.id, region: NGOAI[g.id].region }; }),
];
export const districts = () => DISTRICTS;
/** khu chứa điểm (x, z): bản ghi khu, hoặc { id: 'ngoai-thanh-ngoai', ring: 'outside', gua } ngoài tường */
export function districtOf(x, z) {
  let best = GUA[0], bu = -Infinity;
  for (const g of GUA) { const u = x * g.dir[0] + z * g.dir[1]; if (u > bu) { bu = u; best = g; } }
  if (bu > CITY.A) return { id: 'outside', ring: 'outside', gua: best.id, name: 'Ngoài thành', u: bu };
  const ring = bu <= CITY.NOI_A ? 'noi' : bu <= CITY.TRUNG_A ? 'trung' : 'ngoai';
  return { ...DISTRICTS.find((d) => d.id === districtId(ring, best.id)), u: bu };
}
export const plazas = () => PLAZAS;
export const landmarks = () => LANDMARKS;
export const roads = () => ROADS;
export const blocks = () => BLOCKS.map(({ id, idx, g, band, s, row, col, district, poly, edges }) => ({ id, idx, g, band, s, row, col, district, poly, edges: edges.map(({ kind, key, plaza }) => ({ kind, key, plaza })) }));
export const bridges = () => BRIDGES;
/** tên + chủ đề mỗi phố có chủ đề: key → { theme, name } */
export const streets = () => new Map([...THEME].map(([k, t]) => [k, { theme: t, name: STREET_NAME[t] || `Phố ${SHOP_TYPES[t].name}` }]));
/** 8 cổng Ngoại Thành: { id, gua, name, x, z, ax, az, w } (tâm cổng trên tường) */
export const gates = () => GUA.map((g) => { const p = W(g, CITY.A, 0); return { id: `cong-${g.id}`, gua: g.id, name: g.gate, x: r1(p.x), z: r1(p.z), ax: g.dir[0], az: g.dir[1], w: CITY.GATE_W }; });
/** 3 thủy môn (sông vào / ra, Nam Khê vào) */
export const waterGates = () => wGates().map((w) => ({ ...w, x: r1(w.x), z: r1(w.z), inflow: w.inflow }));
export const water = () => ({ channels: channels().map(({ id, name, wIn, wOut, deep, pts }) => ({ id, name, wIn, wOut, deep, pts })), lake: LAKE, quayW: QUAY_W });

const STATIONS = (() => {
  const out = [], put = (id, name, kind, p, g, extra = {}) => out.push({ id, name, kind, x: r1(p.x), z: r1(p.z), ry: g ? faceDir(-g.dir[0], -g.dir[1]) : 0, district: districtOf(p.x, p.z).id, ...extra });
  put('ga-trungtam', 'Ga Quảng Trường Huyền Thành', 'center', PLAZAS[0].centre, null);
  for (const g of GUA) {
    put(`ga-cong-${g.id}`, `Ga ${g.gate}`, 'gate', W(g, CITY.A - 40, AH - 4), g);
    put(`ga-noi-${g.id}`, `Ga Nội Môn ${g.name}`, 'junction', W(g, 380 + 20, AH - 4), g);
    put(`ga-trung-${g.id}`, `Ga Chợ ${TRUNG[g.id]}`, 'plaza', W(g, 700 + 20, AH - 4), g, { plaza: `plaza-trung-${g.id}` });
    put(`ga-vanh-${g.id}`, `Ga Vành Ngoại ${g.name}`, 'junction', W(g, 1050 + 20, AH - 4), g);
    const L = LANDMARKS.find((m) => m.district === `ngoai-${g.id}`), l = toLocal(g, L.x, L.z);
    put(`ga-ngoai-${g.id}`, `Ga ${L.name}`, 'plaza', W(g, l.u, AH - 4), g, { plaza: `plaza-ngoai-${g.id}` });
  }
  return out;
})();
/** ga xe ngựa (~41): quảng trường, giao lộ đại lộ × vành 380 / 1.050, cổng */
export const stations = () => STATIONS;
/** điểm hồi sinh: Tân Thủ Môn (cổng Ly), quảng trường trung tâm, miếu mỗi khu (+ Chính Điện Nội Thành) */
export function spawnPoints() {
  const li = G('li'), tt = W(li, CITY.A - 30, 0), out = [
    { id: 'tanthumon', name: 'Tân Thủ Môn', kind: 'gate', x: r1(tt.x), z: r1(tt.z), district: districtOf(tt.x, tt.z).id },
    { id: 'trungtam', name: 'Quảng Trường Huyền Thành', kind: 'center', x: PLAZAS[0].centre.x, z: PLAZAS[0].centre.z, district: 'noi' },
  ];
  const dc = LANDMARKS.find((m) => m.id === 'denchinh');
  out.push({ id: 'mieu-noi', name: dc.name, kind: 'temple', x: dc.door.x, z: dc.door.z, district: 'noi' });
  for (const [k, sp] of SPECIAL) {
    if (sp !== 'mieu') continue;
    const B = BLOCKS.find((b) => b.id === k.split('#')[0]), m = genBlock(B).find((L) => L.special === 'mieu');
    if (m) out.push({ id: `mieu-${B.district}`, name: m.name, kind: 'temple', x: m.door.x, z: m.door.z, district: B.district });
  }
  return out;
}
