// ============================================================================
//  KHUÔN VIÊN ĐI BỘ (thuần JS, tất định) — 16 BIỆT PHỦ + 240 BIỆT THỰ ở vành phủ Ngoại Thành.
//  Lô do cityblocks.mansionPlots / villaLots quy hoạch; bố cục trong lô theo phong thủy và phong cách
//  (estate-layout.estateLayout). Mỗi «khuôn viên» (unit): { h (chỉ số căn rao bán), kind 'phu'|'villa', name,
//  style, S, W, D, x, z, ry, layout, zones, toWorld, gate, facing } — h khớp estate-core (0–15 phủ, 16–255 biệt thự).
//  Xuất cả hình học va chạm (tường rào có khe cổng, vách nhà có khe cửa, nền, mặt nước, gò sau) và người trong phủ.
// ============================================================================
import * as BQ from './batquai.js';
import { mansionPlots, villaLots, BELT } from './cityblocks.js';
import { estateLayout, STYLES, VILLA_DISTRICT_NAME, compassOf } from './estate-layout.js';
import { PHU_COUNT } from './estate-core.js';

const PHU_NAME = {
  li: ['Chu Tước Phủ', 'Ly Minh Phủ'], kun: ['Hậu Đức Phủ', 'Khôn Ninh Phủ'], dui: ['Duyệt Trạch Phủ', 'Minh Nguyệt Phủ'],
  qian: ['Càn Nguyên Phủ', 'Thiên Hành Phủ'], kan: ['Huyền Thủy Phủ', 'Thanh Tuyền Phủ'], gen: ['Trấn Nhạc Phủ', 'Cấn Sơn Phủ'],
  zhen: ['Phong Lôi Phủ', 'Thanh Long Phủ'], xun: ['Thanh Phong Phủ', 'Bách Thảo Phủ'],
};
/** cửa nhà (khung cục bộ nhà): giữa mặt trước (+z), mặt sau nếu back */
export const DOOR_W = 2.4;

function makeUnit(base) {
  const g = BQ.guaById(base.g), S = STYLES[base.style];
  const L = estateLayout(base.kind, base.style, base.W, base.D);
  const u = { ...base, wx: g.wx, S, layout: L, zones: L.zones, halls: L.zones.filter((z) => z.kind === 'hall') };
  u.toWorld = (lx, lz) => toW(u, lx, lz);
  const gw = toW(u, 0, base.D / 2 + (base.kind === 'phu' ? 4.5 : 1.8)); u.gate = { x: gw.x, z: gw.z };
  u.facing = compassOf(Math.sin(base.ry), Math.cos(base.ry));
  u.walls = fenceList(u);
  return u;
}
let CACHE = null;
/** mọi khuôn viên: [16 phủ (h 0–15), 240 biệt thự (h 16–255)] */
export function estates() {
  if (CACHE) return CACHE;
  const phu = mansionPlots().map((p) => makeUnit({ ...p, h: p.k, kind: 'phu', name: PHU_NAME[p.g][p.k % 2] }));
  const villas = villaLots().map((l) => makeUnit({ ...l, k: l.i, h: PHU_COUNT + l.i, kind: 'villa', name: `${VILLA_DISTRICT_NAME[l.district]} số ${l.n + 1}` }));
  CACHE = [...phu, ...villas];
  return CACHE;
}
export const mansions = () => estates().filter((u) => u.kind === 'phu');
export const estateByH = (h) => estates()[h] || null;
export const mansion = (k) => mansions()[k] || null;
function toW(m, lx, lz) { const c = Math.cos(m.ry), s = Math.sin(m.ry); return { x: m.x + c * lx + s * lz, z: m.z - s * lx + c * lz }; }
/** thế giới → cục bộ khuôn viên */
export function toLocal(m, x, z) { const c = Math.cos(m.ry), s = Math.sin(m.ry), dx = x - m.x, dz = z - m.z; return { x: c * dx - s * dz, z: s * dx + c * dz }; }
// lưới tra nhanh khuôn viên theo ô 64 m
let GRID = null;
function grid() {
  if (GRID) return GRID;
  GRID = new Map();
  for (const m of estates()) {
    const R = Math.hypot(m.W, m.D) / 2 + 2;
    for (let i = Math.floor((m.x - R) / 64); i <= Math.floor((m.x + R) / 64); i++) for (let j = Math.floor((m.z - R) / 64); j <= Math.floor((m.z + R) / 64); j++) {
      const k = `${i},${j}`; if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(m);
    }
  }
  return GRID;
}
/** khuôn viên chứa điểm (x, z) thế giới (trong tường rào) */
export function mansionAt(x, z, pad = 0) {
  for (const m of grid().get(`${Math.floor(x / 64)},${Math.floor(z / 64)}`) || []) { const l = toLocal(m, x, z); if (Math.abs(l.x) <= m.W / 2 + pad && Math.abs(l.z) <= m.D / 2 + pad) return m; }
  return null;
}
/** khuôn viên gần điểm (để dựng chi tiết / tra nhanh): danh sách trong bán kính r */
export function estatesNear(x, z, r) { return estates().filter((m) => Math.hypot(m.x - x, m.z - z) < r); }
/** gian chứa điểm (cục bộ khuôn viên) */
export function hallAtLocal(m, lx, lz) {
  for (const h of m.halls) {
    const c = Math.cos(h.ry), s = Math.sin(h.ry), dx = lx - h.x, dz = lz - h.z, ax = c * dx - s * dz, az = s * dx + c * dz;
    if (Math.abs(ax) < h.w / 2 && Math.abs(az) < h.d / 2) return h;
  }
  return null;
}

/** Tường rào (khung cục bộ): { x, z, len, ry, h, t } — khe cổng giữa mặt tiền, phủ có thêm cửa hậu */
function fenceList(m) {
  const W = [], hw = m.W / 2, hd = m.D / 2, phu = m.kind === 'phu';
  const H = phu ? ({ iron: 2.4, hedge: 1.8, modern: 2.2 }[m.S.fence] || 4) : ({ iron: 1.6, hedge: 1.4, modern: 1.4 }[m.S.fence] || 2), T = phu ? 0.8 : 0.6;
  const seg = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0); if (len > 0.05) W.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, len, ry: Math.atan2(-(z1 - z0), x1 - x0), h: H, t: T }); };
  const gw = m.layout.gate.w / 2;
  seg(-hw, hd, -gw, hd); seg(gw, hd, hw, hd);
  if (phu) { seg(-hw, -hd, -1.6, -hd); seg(1.6, -hd, hw, -hd); } else seg(-hw, -hd, hw, -hd);
  seg(-hw, -hd, -hw, hd); seg(hw, -hd, hw, hd);
  return W;
}

/** mặt nước chia phần: ao (elip) có cầu trên trục · bể / kênh hai bên trục · vườn hoa có đài phun giữa · vườn đá */
export function waterParts(m) {
  const out = [], phu = m.kind === 'phu';
  for (const w of m.layout.water) {
    const onAxis = Math.abs(w.x) < 0.1, pw = phu ? 2.6 : 1.2;
    if (w.kind === 'pond' || w.kind === 'lotus') out.push({ shape: 'ellipse', x: w.x, z: w.z, rx: w.w / 2, rz: w.d / 2, kind: w.kind, bridge: onAxis ? { x: 0, z0: w.z + w.d / 2 + 1.5, z1: w.z - w.d / 2 - 1.5, w: phu ? 2.8 : 1.6 } : null });
    else if (w.kind === 'pool' || w.kind === 'canal') {
      if (onAxis) for (const sx of [-1, 1]) out.push({ shape: 'rect', x: sx * (pw + (w.w / 2 - pw) / 2), z: w.z, w: w.w / 2 - pw, d: w.d, kind: w.kind });
      else out.push({ shape: 'rect', x: w.x, z: w.z, w: w.w, d: w.d, kind: w.kind });
      if (w.kind === 'canal' && onAxis) out.push({ shape: 'fountain', x: 0, z: w.z, r: phu ? 2.2 : 0.9, kind: w.kind });
    } else if (w.kind === 'parterre') {
      if (onAxis) for (const sx of [-1, 1]) for (const sz of [-1, 1]) out.push({ shape: 'hedge', x: sx * (pw + (w.w / 2 - pw) / 2), z: w.z + sz * w.d / 4, w: Math.max(0.8, w.w / 2 - pw - 1), d: Math.max(0.8, w.d / 2 - 1.4), kind: w.kind });
      else out.push({ shape: 'hedge', x: w.x, z: w.z - w.d / 4, w: w.w - 0.6, d: w.d / 2 - 0.6, kind: w.kind });
      out.push({ shape: 'fountain', x: w.x, z: onAxis ? w.z : w.z + w.d / 4, r: phu ? 2.6 : 0.8, kind: w.kind });
    } else if (w.kind === 'zen') {
      out.push({ shape: 'gravel', x: w.x, z: w.z, w: w.w, d: w.d, kind: w.kind });
      const k = phu ? 1 : 0.35;
      for (let i = 0; i < 5; i++) out.push({ shape: 'rock', x: w.x + (i - 2) * w.w / 5.5 + (i % 2 ? 1.2 : -0.8) * k, z: w.z + (i % 2 ? w.d / 5 : -w.d / 6), r: (0.9 + (i % 3) * 0.4) * k, kind: w.kind });
    }
  }
  return out;
}

/** Hình học va chạm của một khuôn viên (thế giới): { obbs: [{x,z,hw,hd,ry}], plats: [{x,z,w,d,ry,top}] } */
export function mansionSolids(m) {
  const obbs = [], plats = [], L = m.layout, phu = m.kind === 'phu';
  const W = (lx, lz) => toW(m, lx, lz);
  const box = (lx, lz, hw, hd, lry = 0) => { const p = W(lx, lz); obbs.push({ x: p.x, z: p.z, hw, hd, ry: lry + m.ry }); };
  for (const w of m.walls) box(w.x, w.z, w.len / 2, w.t / 2, w.ry);
  // nhà: 4 vách (khe cửa trước / sau) + nền
  for (const h of L.buildings) {
    const c = Math.cos(h.ry), s = Math.sin(h.ry), Lc = (ax, az) => ({ x: h.x + c * ax + s * az, z: h.z - s * ax + c * az });
    const t = 0.6, hw = h.w / 2, hd = h.d / 2, side = (h.w - DOOR_W) / 2; // ≥ 0,5 m: luôn phủ tâm ô lưới va chạm (0,5 m), vách mỏng hơn lọt người
    for (const sz of [1, -1]) {
      if (sz > 0 || h.back) for (const sx of [-1, 1]) { const p = Lc(sx * (DOOR_W / 2 + side / 2), sz * hd); box(p.x, p.z, side / 2, t / 2, h.ry); }
      else { const p = Lc(0, sz * hd); box(p.x, p.z, hw, t / 2, h.ry); }
    }
    for (const sx of [-1, 1]) { const p = Lc(sx * hw, 0); box(p.x, p.z, t / 2, hd, h.ry); }
    const pc = W(h.x, h.z); plats.push({ x: pc.x, z: pc.z, w: h.w + (phu ? 2.4 : 1.2), d: h.d + (phu ? 2.4 : 1.2), ry: h.ry + m.ry, top: h.plinth });
  }
  for (const pv of L.pavs) { const pc = W(pv.x, pv.z); plats.push({ x: pc.x, z: pc.z, w: pv.w + 1.2, d: pv.d + 1.2, ry: m.ry, top: 0.5 }); }
  for (const t of L.towers || []) box(t.x, t.z, t.w * 0.42, t.d * 0.42); // tháp: khối đặc
  // mặt nước / đài phun / bồn cây / đá
  for (const p of waterParts(m)) {
    if (p.shape === 'ellipse') {
      const st = phu ? 1 : 0.5;
      for (let a = -p.rx; a <= p.rx; a += st) for (let b = -p.rz; b <= p.rz; b += st) {
        if ((a / p.rx) ** 2 + (b / p.rz) ** 2 > 1 || (p.bridge && Math.abs(a) < p.bridge.w / 2 + 0.3)) continue;
        box(p.x + a, p.z + b, st * 0.55, st * 0.55);
      }
      if (p.bridge) { const pb = W(p.bridge.x, (p.bridge.z0 + p.bridge.z1) / 2); plats.push({ x: pb.x, z: pb.z, w: p.bridge.w, d: Math.abs(p.bridge.z0 - p.bridge.z1), ry: m.ry, top: 0.45 }); }
    } else if (p.shape === 'rect' || p.shape === 'hedge') box(p.x, p.z, p.w / 2, p.d / 2);
    else if (p.shape === 'fountain' || p.shape === 'rock') box(p.x, p.z, p.r, p.r);
  }
  // gò sau (tọa sơn): đá / bờ rào cây chắn kín; rặng cây chỉ chặn gốc
  if (L.mound.kind !== 'trees') box(L.mound.x, L.mound.z, L.mound.w / 2, L.mound.d / 2);
  for (const t of L.trees) { const r = t.kind === 'bamboo' || t.kind === 'hedge' ? (phu ? 1.1 : 0.6) : 0.45; box(t.x, t.z, r, r); }
  if (phu) for (const sx of [-1, 1]) box(sx * (L.gate.w / 2 + 2.4), m.D / 2 + 2.4, 0.8, 1.1); // sư tử / trụ cổng
  return { obbs, plats };
}

// ---------------------------------------------------------------------------
// Người trong phủ — toạ độ cục bộ → thế giới; hướng nghỉ = hướng phủ (nhìn ra cổng). Biệt thự: không có
// ---------------------------------------------------------------------------
const HO = ['Trương', 'Vương', 'Lý', 'Triệu', 'Chu', 'Ngô', 'Trịnh', 'Tôn', 'Hà', 'Lục'];
const TEN_NAM = ['Phúc', 'Thọ', 'An', 'Trung', 'Nghĩa', 'Tín', 'Lộc', 'Bảo'];
const TEN_NU = ['Xuân', 'Thu', 'Hạnh', 'Liên', 'Cúc', 'Đào', 'Nguyệt', 'Mai'];
export function mansionNpcs(m, info = {}) {
  if (m.kind !== 'phu') return [];
  const mode = info.mode || 'sale', owner = info.owner || '', L = m.layout, main = L.buildings[0];
  const pick = (arr, k) => arr[(m.h * 7 + k * 3) % arr.length];
  const at = (lx, lz) => { const p = m.toWorld(lx, lz); return { x: p.x, z: p.z }; };
  const path = (pts) => { const P = pts.map(([x, z]) => at(x, z)); return { path: P, x: P[0].x, z: P[0].z }; };
  const base = { gua: m.g, wx: m.wx, near: 45 }, face = m.ry, hw = m.W / 2, hd = m.D / 2;
  const west = m.S.fam === 'western' || m.S.fam === 'modern';
  const out = [];
  const gateLines = {
    sale: [`${m.name} đang rao bán — giấy tờ ở ngay cổng, hoặc hỏi Nha Môn Địa Ốc.`, `Phủ ${m.W * m.D} m², kiểu ${m.S.name}, ${m.facing.text}.`, 'Ngài cứ vào xem, chủ cũ dặn mở cổng cho khách.'],
    own: [`Bẩm ${owner || 'chủ nhân'}, phủ vẫn yên ổn.`, 'Mời chủ nhân vào, quản gia đang chờ trước chính đường.', 'Đêm nay tiểu nhân canh cổng, chủ nhân cứ yên giấc.'],
    visit: [`Đây là ${m.name} của ${owner}.`, 'Chủ nhân dặn: khách tới chơi cứ tự nhiên dạo vườn.', 'Xin đừng động vào đồ trong nhà, khách quan.'],
  }[mode] || [];
  for (const sx of [-1, 1]) out.push({ ...base, id: `phu${m.h}_gac${sx}`, name: `${pick(HO, sx + 2)} ${pick(TEN_NAM, sx + 4)}`, role: west ? 'Bảo vệ' : 'Gác cổng phủ', look: 'hero_m', lines: gateLines, ...at(sx * (L.gate.w / 2 + 1), hd + 1.4), path: null, face });
  const qgLines = {
    sale: ['Tiểu nhân trông phủ thay chủ cũ — đã lâu chưa có người ở.', `Nhà chính ${m.facing.text} — ${m.facing.trach}, sau lưng có gò, trước mặt có nước: thế tọa sơn hướng thủy.`, 'Mua phủ rồi có thể bày đồ cả trong nhà lẫn ngoài vườn.'],
    own: ['Gian nào cũng chờ chủ nhân bài trí — đồ mua ở các tiệm trong thành.', 'Bàn thờ tựa vách sau, nhìn ra cửa thì phong thủy tốt.', 'Nước trước nhà là minh đường, giữ cho trong thì tài lộc tụ.', 'Mỗi ngày chủ nhân về phủ, khí lành lại tụ thêm.'],
    visit: [`${owner} đi vắng, mời khách dạo một vòng.`, 'Chính đường bày biện theo ý chủ nhân, đẹp lắm phải không?', 'Khách thấy được thì ra cổng khen phủ một tiếng nhé.'],
  }[mode] || [];
  const fz = main.z + main.d / 2 + main.plinth;
  out.push({ ...base, id: `phu${m.h}_qg`, name: `${mode === 'sale' ? 'Lão' : 'Quản gia'} ${pick(HO, 1)}`, role: mode === 'sale' ? 'Người trông phủ' : 'Quản gia', look: 'master', lines: qgLines, ...at(Math.min(6, main.w / 3), fz + 2.4), path: null, face });
  out.push({ ...base, id: `phu${m.h}_vuon`, name: `Thím ${pick(TEN_NU, 2)}`, role: 'Người làm vườn', look: 'npc_villager', lines: ['Cây trong phủ phải tỉa đều tay mới đẹp.', 'Cá dưới nước đớp mồi tung tăng.', 'Gò sau phủ trồng thêm cây cho vững thế tọa sơn.'], ...path([[-hw + 7, hd - 9], [-3, hd - 9], [hw - 7, hd - 9]]) });
  if (mode !== 'sale') {
    out.push({ ...base, id: `phu${m.h}_hau`, name: `A ${pick(TEN_NU, 5)}`, role: west ? 'Người giúp việc' : 'Thị nữ', look: 'hero_f', lines: ['Trà mới pha, mời khách.', 'Chính đường vừa lau dọn xong.', 'Tối nay thắp đèn quanh hồ nhé.'], ...path([[-main.w / 2 + 2, fz + 4], [main.w / 2 - 2, fz + 4]]) });
  }
  return out;
}

export { BELT };
