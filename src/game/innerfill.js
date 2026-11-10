// ============================================================================
//  LẤP KÍN NỘI THÀNH — nhà phố chen vào mọi khoảng trống của 8 khu Bát Quái (batquai.js) mà không
//  đụng công trình, ruộng, ao, sân võ, lôi đài, cây, đèn, bia, biển tên, sư tử đá, NPC (chỗ đứng +
//  lộ trình), đường (đại lộ, đường vành, đại lộ chéo), Sơn Môn, nền + bậc Hậu Sơn, ô cổng, chân tường.
//  Thuần JS, tất định. Lưới chiếm chỗ 0,5 m; nhà xếp theo dãy quay mặt ra đường gần nhất:
//    · dãy sát chân tường nội (quay vào tâm) · hai bên đường vành · hai bên đại lộ khu.
// ============================================================================
import * as BQ from './batquai.js';
import { HOUSE_SPECS } from './cityblocks.js';

const C = 0.5, N = Math.ceil(340 / C), O = N / 2;
const key = (x, z) => { const i = Math.floor(x / C + O), j = Math.floor(z / C + O); return i < 0 || j < 0 || i >= N || j >= N ? -1 : j * N + i; };

function rand(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const distSeg = (x, z, [ax, az], [bx, bz]) => { const vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(x - ax - vx * t, z - az - vz * t); };

/** Lưới chiếm chỗ của bố cục Nội Thành (đã nới lề `pad` m quanh mọi vật) */
export function occupancy(pad = 1) {
  const occ = new Uint8Array(N * N);
  const markRect = (g, u, v, fu, fv) => { for (let a = -fu / 2 - pad; a <= fu / 2 + pad; a += C / 2) for (let b = -fv / 2 - pad; b <= fv / 2 + pad; b += C / 2) { const w = BQ.toWorld(g, u + a, v + b), k = key(w.x, w.z); if (k >= 0) occ[k] = 1; } };
  const markCircle = (x, z, r) => { const R = r + pad; for (let a = -R; a <= R; a += C / 2) for (let b = -R; b <= R; b += C / 2) if (a * a + b * b <= R * R) { const k = key(x + a, z + b); if (k >= 0) occ[k] = 1; } };
  for (const g of BQ.GUA) {
    const D = BQ.DISTRICTS[g.id];
    for (const b of D.buildings) { markRect(g, b.u, b.v, b.foot[0] + 2, b.foot[1] + 2); const bs = BQ.boardSpot(b); if (bs) { const w = BQ.toWorld(g, bs.u, bs.v); markCircle(w.x, w.z, 1.2); } }
    for (const [u, v] of D.houses) markRect(g, u, v, BQ.HOUSE_S, BQ.HOUSE_S / 1.49);
    for (const f of D.fields || []) markRect(g, f.u, f.v, f.w, f.d);
    if (D.pond) markRect(g, D.pond.u, D.pond.v, D.pond.w, D.pond.d);
    if (D.yard) markRect(g, D.yard.u, D.yard.v, D.yard.w, D.yard.d);
    if (D.arena) { const w = BQ.toWorld(g, D.arena.u, D.arena.v); markCircle(w.x, w.z, D.arena.r + 1.5); }
    for (const [u, v, r] of D.rocks || []) { const w = BQ.toWorld(g, u, v); markCircle(w.x, w.z, r / 2 + 1); }
    for (const [u, v] of D.trees) { const w = BQ.toWorld(g, u, v); markCircle(w.x, w.z, 4); }
    if (D.well) markCircle(D.well.x, D.well.z, 2.5);
    const st = D.stele || BQ.toWorld(g, BQ.STELE.u, BQ.STELE.v); markCircle(st.x, st.z, 1.8);
    if (g.id !== 'kan') for (const sv of [-1, 1]) { const w = BQ.toWorld(g, BQ.lionU(g), sv * BQ.LION.v); markCircle(w.x, w.z, 2); }
    for (const u of BQ.POST_U) for (const sv of [-1, 1]) { const w = BQ.toWorld(g, u, sv * BQ.POST_V); markCircle(w.x, w.z, 0.6); }
  }
  // NPC nội thành: chỗ đứng + lộ trình (chừa 1,6 m)
  for (const c of BQ.citizenList()) {
    const pts = c.path || [{ x: c.x, z: c.z }];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)]; for (let t = 0; t <= 1; t += 0.02) markCircle(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, 1.6); }
  }
  // Am Vân Cốc / hai NPC canon ở ngoài tường Bắc — ngoài phạm vi; phố chợ Ly (quầy, đèn, cổng chào, Lão Tùng)
  const li = BQ.guaById('li');
  for (let z = 80; z <= 132; z += 22) for (const sx of [-1, 1]) markRect(li, z + (sx > 0 ? 11 : 0), -sx * 10.5, 5.5, 4.7);
  for (let z = 74; z <= 134; z += 12) for (const sx of [-1, 1]) markCircle(sx * 6.5, z, 0.6);
  markRect(li, 104, 0, 4, 28); markCircle(6, 72, 2.5); markCircle(7.9, 70.4, 1.5);
  // đường + vùng cấm (duyệt mọi ô một lần)
  const roads = [{ pts: BQ.ringRoad(), w: BQ.RING_W }, ...BQ.diagonalAvenues()];
  for (const g of BQ.GUA) if (!(g.dir[0] && g.dir[1]) && g.id !== 'kan') {
    const w = g.id === 'li' ? 9 : 8, a = BQ.toWorld(g, 60, 0), b = BQ.toWorld(g, 160, 0);
    roads.push({ pts: [[a.x, a.z], [b.x, b.z]], w });
  }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; if (occ[k]) continue;
    const x = (i + 0.5 - O) * C, z = (j + 0.5 - O) * C;
    const o = Math.max(...BQ.GUA.map((g) => x * g.dir[0] + z * g.dir[1]));
    if (o > BQ.OCT_A - BQ.WALL_T / 2 - 3) { occ[k] = 1; continue; }                      // chân tường nội + lối chân tường
    if (Math.abs(x) < 62.4 + 2 && Math.abs(z) < 68.4 + 2) { occ[k] = 1; continue; }          // Sơn Môn
    if (Math.abs(x) < 48 && z < -68 && z > -156) { occ[k] = 1; continue; }                 // nền + bậc Hậu Sơn
    let bad = false;
    for (const g of BQ.GUA) { const l = BQ.toLocal(g, x, z), w = BQ.gateWidth(g), dep = w / 2.13; if (l.u > BQ.OCT_A - dep / 2 - 3 && Math.abs(l.v) < w / 2 + 3) { bad = true; break; } }
    if (!bad) for (const r of roads) { for (let s = 1; s < r.pts.length; s++) if (distSeg(x, z, r.pts[s - 1], r.pts[s]) < r.w / 2 + pad) { bad = true; break; } if (bad) break; }
    if (bad) occ[k] = 1;
  }
  return occ;
}
const RES = ['bq_house_2f', 'bq_house_tiled', 'lib_courtyard', 'bq_house_stone', 'bq_house_2f'];
const SHOP = ['bq_shop_lantern', 'bq_shop_lantern', 'bq_tavern', 'bq_teahouse'];

let CACHE = null;
/** Nhà chen vào Nội Thành: [{ id, x, z, ry, f, d, hw, hd, ys, g, u, v, lu, lv, door, inner: true(Nội Thành) }] */
export function innerHouses() {
  if (CACHE) return CACHE;
  const occ = occupancy(0.8), out = [];
  const freeRect = (g, u, v, lu, lv) => { for (let a = -lu / 2; a <= lu / 2; a += C / 2) for (let b = -lv / 2; b <= lv / 2; b += C / 2) { const w = BQ.toWorld(g, u + a, v + b), k = key(w.x, w.z); if (k < 0 || occ[k]) return false; } return true; };
  const take = (g, u, v, lu, lv) => { for (let a = -lu / 2 - 0.4; a <= lu / 2 + 0.4; a += C / 2) for (let b = -lv / 2 - 0.4; b <= lv / 2 + 0.4; b += C / 2) { const w = BQ.toWorld(g, u + a, v + b), k = key(w.x, w.z); if (k >= 0) occ[k] = 1; } };
  for (const g of BQ.GUA) {
    if (g.id === 'kan') continue;
    const r = rand(77 + BQ.GUA.indexOf(g) * 131);
    const [dx, dz] = g.dir, px = -dz, pz = dx;
    // quét lưới 1 m trên phần trống của khu (u 64…152): thử dựng nhà quay mặt về đại lộ khu (gần trục) hoặc về tâm
    // (xa trục); nhận khi khung + cửa đều trống, nằm trong nêm. Mẫu to trước, nhỏ dần khi không vừa.
    const uMin = dx && dz ? 104 : 64;
    for (let u = uMin; u <= 153; u += 1) for (let v = -u * BQ.TAN8; v <= u * BQ.TAN8; v += 1) {
      const w0 = BQ.toWorld(g, u, v), k0 = key(w0.x, w0.z);
      if (k0 < 0 || occ[k0]) continue;
      const faceAve = Math.abs(v) < 24;
      const front = faceAve ? (v > 0 ? [-px, -pz] : [px, pz]) : [-dx, -dz];
      for (let tries = 0; tries < 4; tries++) {
        const list = faceAve && r() < 0.6 ? SHOP : RES, id = list[Math.floor(r() * list.length)], sp = HOUSE_SPECS[id];
        const shrink = 1 - tries * 0.18, f = (sp.f[0] + r() * (sp.f[1] - sp.f[0])) * shrink, d = Math.min(10, f / sp.wd);
        if (f < 6) break;
        // tâm nhà sao cho góc (u, v) đang xét là góc «sau – trái» của nhà
        let cu, cv, lu, lv;
        if (faceAve) { lu = f; lv = d; cu = u + f / 2; cv = v > 0 ? v + d / 2 : v - d / 2; } else { lu = d; lv = f; cu = u + d / 2; cv = v + f / 2; }
        const inWedge = Math.abs(cv) + lv / 2 < (cu - lu / 2) * BQ.TAN8 - 3 && cu + lu / 2 < 153;
        if (!inWedge || !freeRect(g, cu, cv, lu, lv)) continue;
        const w = BQ.toWorld(g, cu, cv);
        const door = { x: w.x + front[0] * (d / 2 + 0.9), z: w.z + front[1] * (d / 2 + 0.9) }, kd = key(door.x, door.z);
        if (kd < 0 || occ[kd]) continue;
        take(g, cu, cv, lu, lv);
        for (let a = -1.4; a <= 1.4; a += C / 2) for (let b2 = -1.4; b2 <= 1.4; b2 += C / 2) { const k = key(door.x + a, door.z + b2); if (k >= 0) occ[k] = 1; } // giữ trống trước cửa
        out.push({ id, x: w.x, z: w.z, ry: BQ.faceDir(front[0], front[1]), f, d, hw: f / 2, hd: d / 2, ys: 1 + r() * 0.25, g: g.id, u: cu, v: cv, lu, lv, door, nt: true });
        break;
      }
    }
  }
  CACHE = out;
  return out;
}
