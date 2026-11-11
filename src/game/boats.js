// ============================================================================
//  THUYỀN (thuần — main.js lái thuyền thuê, boats3d.js vẽ, test Node). Đơn vị mét, giây; hướng h = atan2(dx, dz)
//  (cùng quy ước player.h). Mô hình vật rắn 2D trong mặt nước:
//   · lực đẩy: chèo (đò, thuyền hoa) hoặc buồm theo góc gió (water.wind) — buồm vô dụng khi ngược gió < 40°;
//   · cản dị hướng: dọc thân thấp, ngang thân rất cao → thuyền không trượt ngang, có quán tính;
//   · bánh lái chỉ ăn khi có tốc độ so với nước (đò chèo xoay tại chỗ được chậm);
//   · dòng chảy (water.waterAt) cuốn thuyền; mắc cạn khi bất kỳ điểm thân nào nông hơn mớn nước;
//   · tĩnh không cầu / thủy môn (bridges.clearanceAt) nhỏ hơn chiều cao thuyền thì không qua; va trụ cầu thì nảy nhẹ.
//  Bến thuê thuyền: DOCKS (2 bến hào, 2 bến kênh, 3 bến sông, 1 bến hồ) — tính tất định từ địa hình.
// ============================================================================
import * as T from './terrain.js';
import { waterAt, wind } from './water.js';
import { clearanceAt, piers } from './bridges.js';
import { GUA } from './batquai.js';
import { riverPoints } from './waterways.js';

// idx = mã trong gói mạng (mv.b); price = văn mỗi 30 phút thuê
export const BOAT_TYPES = {
  do: { idx: 0, name: 'Đò chèo', len: 6, beam: 1.6, height: 1.6, draft: 0.4, thrust: 1.1, sprint: 1.5, cf: 0.18, turn: 0.9, spin: 0.45, sail: false, price: 10, icon: '🛶' },
  hoa: { idx: 1, name: 'Thuyền hoa', len: 14, beam: 3.6, height: 4.2, draft: 0.9, thrust: 0.7, sprint: 1.35, cf: 0.08, turn: 0.42, spin: 0.12, sail: false, price: 40, icon: '🏮' },
  buom: { idx: 2, name: 'Thuyền buồm', len: 22, beam: 5, height: 12, draft: 1.8, thrust: 0.18, sprint: 1, cf: 0.035, turn: 0.26, spin: 0.04, sail: true, price: 80, icon: '⛵' },
};
export const TYPE_BY_IDX = Object.values(BOAT_TYPES).reduce((m, t) => { m[t.idx] = t; return m; }, {});
export const typeId = (t) => Object.keys(BOAT_TYPES).find((k) => BOAT_TYPES[k] === t);
export const RENT_MS = 30 * 60000;

export function createBoat(type, x, z, h = 0) {
  const T0 = typeof type === 'string' ? BOAT_TYPES[type] : type;
  return { type: T0, id: typeId(T0), x, z, h, vx: 0, vz: 0, wr: 0, grounded: false, blocked: null, sail: 0 };
}
const fwd = (h) => ({ x: Math.sin(h), z: Math.cos(h) });
/** các điểm lấy mẫu thân thuyền (thế giới): mũi, lái, hai mạn giữa, tâm */
export function hullPoints(b, x = b.x, z = b.z, h = b.h) {
  const f = fwd(h), r = { x: f.z, z: -f.x }, L = b.type.len / 2 - 0.3, B = b.type.beam / 2 - 0.15;
  return [[L, 0], [-L, 0], [0, B], [0, -B], [L * 0.55, B * 0.7], [L * 0.55, -B * 0.7], [-L * 0.6, B * 0.8], [-L * 0.6, -B * 0.8], [0, 0]]
    .map(([a, c]) => ({ x: x + f.x * a + r.x * c, z: z + f.z * a + r.z * c }));
}
/** vị trí (x, z, h) thuyền có đậu được không: null = được; 'shallow' | 'land' | 'low' (tĩnh không thấp) | 'pier' */
export function hullBlock(b, x, z, h) {
  for (const p of hullPoints(b, x, z, h)) {
    const w = waterAt(p.x, p.z);
    if (!w) return 'land';
    if (w.depth < b.type.draft + 0.1) return 'shallow';
    if (clearanceAt(p.x, p.z) < b.type.height) return 'low';
  }
  for (const q of piers()) if (Math.hypot(q.x - x, q.z - z) < q.r + b.type.beam / 2 + Math.min(b.type.len / 2, 3)) {
    // trụ: kiểm theo điểm thân
    for (const p of hullPoints(b, x, z, h)) if (Math.hypot(q.x - p.x, q.z - p.z) < q.r) return 'pier';
  }
  return null;
}
/** lực đẩy buồm (m/s²) theo góc giữa hướng thuyền và hướng gió thổi tới */
export function sailPush(b, W = wind()) {
  const f = fwd(b.h), cos = f.x * W.dx + f.z * W.dz; // 1 = xuôi gió, −1 = ngược gió
  const ang = Math.acos(Math.max(-1, Math.min(1, cos))); // 0 xuôi … π ngược
  // xuôi gió 0,8 · gió ngang (beam reach) 1 · ngược gió trong 40° = 0
  const eff = ang <= Math.PI / 2 ? 0.8 + 0.2 * (ang / (Math.PI / 2)) : 1 - (ang - Math.PI / 2) / (Math.PI / 2 - 0.7);
  return Math.max(0, eff) * W.speed * b.type.thrust * 1.6;
}
/**
 * Một bước. input: { throttle (−1…1: tiến / lùi, buồm: kéo buồm lên), rudder (−1…1: trái / phải), sprint }.
 * t = đồng hồ nước (gió). Trả { speed (so với bờ), rel (so với nước), blocked }.
 */
export function stepBoat(b, input, dt, t = 0) {
  const TY = b.type, f = fwd(b.h), r = { x: f.z, z: -f.x };
  const w = waterAt(b.x, b.z), flow = w ? w.flow : { x: 0, z: 0 };
  let relx = b.vx - flow.x, relz = b.vz - flow.z;
  let vf = relx * f.x + relz * f.z, vs = relx * r.x + relz * r.z;
  const th = Math.max(-1, Math.min(1, input.throttle || 0));
  // lực đẩy
  let push = 0;
  if (TY.sail) {
    b.sail += ((th > 0 ? 1 : 0) - b.sail) * Math.min(1, dt * 0.8); // kéo / hạ buồm từ từ
    push = sailPush(b, wind(t)) * b.sail + (th < 0 ? -0.15 : 0) + (th > 0 && b.sail < 0.2 ? 0.12 : 0); // chèo phụ khi buồm chưa căng
  } else push = th * TY.thrust * (input.sprint && th > 0 ? TY.sprint : 1) * (th < 0 ? 0.5 : 1);
  // cản: dọc (bình phương + tuyến tính), ngang rất lớn
  vf += (push - TY.cf * vf * Math.abs(vf) - 0.05 * vf) * dt;
  vs *= Math.exp(-dt * 4.5);
  // bánh lái: hiệu quả theo tốc độ so với nước (lùi thì đảo chiều); chèo xoay tại chỗ (spin) cho thuyền nhỏ
  const rud = Math.max(-1, Math.min(1, input.rudder || 0));
  const yawAcc = rud * (TY.turn * Math.min(1, Math.abs(vf) / 1.6) * Math.sign(vf || 1) + TY.spin * (1 - Math.min(1, Math.abs(vf) / 1.2)));
  b.wr += (yawAcc - b.wr) * Math.min(1, dt * 2.2);
  const nh = b.h + b.wr * dt;
  const nf = fwd(nh), nr = { x: nf.z, z: -nf.x };
  // vận tốc thế giới mới = dòng chảy + (dọc, ngang) theo hướng mới
  let nvx = flow.x + nf.x * vf + nr.x * vs, nvz = flow.z + nf.z * vf + nr.z * vs;
  const nx = b.x + nvx * dt, nz = b.z + nvz * dt;
  const blk = hullBlock(b, nx, nz, nh);
  if (!blk) { b.x = nx; b.z = nz; b.h = nh; b.vx = nvx; b.vz = nvz; b.grounded = false; b.blocked = null; }
  else {
    // thử chỉ xoay / chỉ trượt; không được thì dừng (mắc cạn / chạm trụ: nảy ngược nhẹ)
    if (!hullBlock(b, b.x, b.z, nh)) b.h = nh; else b.wr = 0;
    const bounce = blk === 'pier' || blk === 'low' ? -0.35 : -0.1;
    b.vx = flow.x * 0 + (b.vx - flow.x) * bounce; b.vz = (b.vz - flow.z) * bounce;
    const bx = b.x + b.vx * dt, bz = b.z + b.vz * dt;
    if (!hullBlock(b, bx, bz, b.h)) { b.x = bx; b.z = bz; }
    b.grounded = blk === 'shallow' || blk === 'land'; b.blocked = blk;
  }
  return { speed: Math.hypot(b.vx, b.vz), rel: vf, blocked: b.blocked };
}

// ---------------------------------------------------------------------------
// BẾN THUYỀN — chỗ đứng trên bờ (người thuê) + chỗ thả thuyền ngoài nước (spawn) + loại thuyền được thuê
// ---------------------------------------------------------------------------
const Wg = (g, u, v) => ({ x: g.dir[0] * u - g.dir[1] * v, z: g.dir[1] * u + g.dir[0] * v });
const axisH = (g) => Math.atan2(g.dir[0], g.dir[1]); // hướng h dọc trục u (ra ngoài)
/** chỗ thả thuyền: từ chỗ đứng trên bờ đi dần ra nước (hướng dx, dz) tới chỗ đủ chỗ cho thuyền lớn nhất được thuê */
function spawnFrom(stand, dx, dz, h, types) {
  const big = createBoat(types[types.length - 1], 0, 0, h);
  for (let d = 2; d < 160; d += 1) { const x = stand.x + dx * d, z = stand.z + dz * d; if (!hullBlock(big, x, z, h)) { const e = Math.min(4, big.type.beam); return { x: x + dx * e, z: z + dz * e, h }; } }
  return { x: stand.x + dx * 20, z: stand.z + dz * 20, h };
}
/** bến ven sông: từ điểm tim sông đi sang bờ side (±1) tới chỗ khô; thả thuyền ra phía lạch */
function riverDock(id, name, frac, side, types) {
  const P = riverPoints(), p = P[Math.round(frac * (P.length - 1))], nx = -p.tz * side, nz = p.tx * side;
  let stand = null;
  for (let o = 0; o < 220 && !stand; o += 1) { const x = p.x + nx * o, z = p.z + nz * o; if (T.heightAt(x, z) > T.WATER + 0.4) stand = { x: x + nx * 2, z: z + nz * 2 }; }
  return { id, name, kind: 'river', x: stand.x, z: stand.z, spawn: spawnFrom(stand, -nx, -nz, Math.atan2(p.tx, p.tz), types), types };
}
let DOCK_CACHE = null;
export function docks() {
  if (DOCK_CACHE) return DOCK_CACHE;
  const out = [];
  // v4: hào / kênh Bát Môn cũ đã bỏ — bến chỉ còn trên sông Huyền Hà (trong thành, bờ kè có bậc) và hồ Cùng Thông
  // sông: dưới Nam Môn Đại Kiều (bờ Bắc), gần Trích Thiên, cửa sông vào hồ
  const P = riverPoints();
  const fracAt = (x) => { let bi = 0, bd = Infinity; P.forEach((p, i) => { const d = Math.abs(p.x - x); if (d < bd) { bd = d; bi = i; } }); return bi / (P.length - 1); };
  out.push(riverDock('river_nammon', 'Bến Nam Môn', fracAt(-170), -1, ['do', 'hoa', 'buom'])); // thượng lưu cầu 170 m — đủ chỗ lấy hướng lọt nhịp giữa
  out.push(riverDock('river_trichthien', 'Bến Trích Thiên', fracAt(-700), -1, ['do', 'hoa', 'buom']));
  out.push(riverDock('river_cuasong', 'Bến Cửa Sông', fracAt(640), -1, ['do', 'hoa', 'buom']));
  // hồ Cùng Thông: bờ Tây Bắc (hướng về thành)
  { const L = T.REGIONS.find((r) => r.id === 'cungthong'), dx = -0.7071, dz = -0.7071;
    let stand = null;
    for (let d = 0; d < 500 && !stand; d += 1) { const x = L.x + dx * d, z = L.z + dz * d; if (T.heightAt(x, z) > T.WATER + 0.4) stand = { x: x + dx * 2, z: z + dz * 2 }; }
    const types = ['do', 'hoa', 'buom'];
    out.push({ id: 'lake', name: 'Bến Cùng Thông Hồ', kind: 'lake', x: stand.x, z: stand.z, spawn: spawnFrom(stand, -dx, -dz, Math.atan2(-dx, -dz), types), types }); }
  DOCK_CACHE = out;
  return out;
}
export const dockById = (id) => docks().find((d) => d.id === id) || null;
export function dockNear(x, z, r = 28) { let best = null, bd = r; for (const d of docks()) { const e = Math.min(Math.hypot(d.x - x, d.z - z), Math.hypot(d.spawn.x - x, d.spawn.z - z)); if (e < bd) { bd = e; best = d; } } return best; }
/** chỗ khô gần thuyền để bước lên bờ (trong reach m tính từ mạn) — null nếu không có */
export function shoreNear(b, reach = 6) {
  let best = null, bd = Infinity;
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2, dx = Math.sin(ang), dz = Math.cos(ang);
    for (let d = b.type.beam / 2; d < b.type.beam / 2 + reach; d += 0.5) {
      const x = b.x + dx * d, z = b.z + dz * d;
      if (!waterAt(x, z)) { if (d < bd) { bd = d; best = { x: x + dx * 0.8, z: z + dz * 0.8 }; } break; }
    }
  }
  return best;
}
/** tiền trả khi trả thuyền: quá giờ thuê tính thêm theo phút (giá 30 phút / 30) */
export const overdueFee = (type, rentedAt, now = Date.now()) => Math.max(0, Math.ceil((now - rentedAt - RENT_MS) / 60000)) * Math.ceil(type.price / 30);
