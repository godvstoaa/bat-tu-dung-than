// ============================================================================
//  BỘ DỰNG THEO LOẠI HÌNH — PHONG CÁCH THÁI (08-thai.md). Mọi hàm trả { acc, info }.
//   thHall    — điện / sảnh / sala vào ở ĐẦU HỒI (+z): bệ nhiều gờ, hiên cột 12 góc, tường trắng cửa khung nhọn,
//               mái hồi nhiều son + lot hạ dần ra hai đầu, trán hồi vàng, lamyong; tuỳ chọn nhiều nóc song song (modules),
//               cánh ngang (cross: trimuk / chữ thập), nhiều tầng (storeys), mở (open).
//   thPrasat  — đình / điện chữ thập có chóp prasat 5 / 7 tầng (Aphorn Phimok, đình đỉnh núi, Aisawan trên nước).
//   thMondop  — mondop vuông 4 cửa, chóp 7 tầng (Phra Mondop).
//   thChakri  — thân Âu 3 tầng + mái Thái + 3 chóp 7 tầng (Chakri Maha Prasat).
//   thLong    — điện dài trên tường thành, mặt tiền cạnh dài, lầu giữa chóp 5 tầng (Sutthaisawan).
//   thTower   — vỏ ngoài lầu 10 tầng (Dusit + Wat Arun + Loha Prasat) từ towerSpec của game.
// ============================================================================
import * as THREE from 'three';
import {
  Acc, box, boxB, beam, slabXY, V, xf, mRY, thColumn, thPlinth, thStair, thBalustrade, thRoof, thRoofX, ringRoof, wallRun, windowFrame,
  bracket, thSpire, redent, sqLathe, figure, ATLAS, GARUDA, NAGA5, lamyongEdge, chofa, hangHong, quad,
} from './th-kit.js';
import { columnRing, polySides, FH, DOOR_W, WALL_T } from '../tower.js';

const odd = (n) => (n % 2 ? n : n + 1);
const spread = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

// ---------------------------------------------------------------- ĐIỆN / SẢNH vào ở đầu hồi
/**
 * spec: { W, L (thân tường, x × z), ph, wallH | storeys: [h…], v (hiên cột hai bên), f / b (hiên trước / sau), colD, colStep,
 *   roof: { p, son, pe, step, tile, border, eaveTile, eaveBorder, eave (dải hiên khi không có hiên cột), lotsF: { n, drop }, lotsB, chofaH },
 *   modules (số nóc song song), cross: { hw, len, z } (cánh ngang), doors: { n, w, h }, backDoors, win: { n, frame, h, y }, endWin,
 *   open, rail, garuda, wallKey, colKey, plinth: { m, key }, stairW, backStair, shutter }
 */
export function thHall(spec) {
  const acc = spec.acc || new Acc(), R = spec.roof, W = spec.W, L = spec.L, ph = spec.ph;
  const v = spec.v || 0, f = spec.f || 0, bk = spec.b || 0, open = !!spec.open, colD = spec.colD || 0.6, step = spec.colStep || 3.0;
  const storeys = spec.storeys || [spec.wallH], yW = ph + storeys.reduce((a, b) => a + b, 0);
  const xo = W / 2 + v, zf = L / 2 + f, zb = -(L / 2 + bk);
  const mods = spec.modules || 1, Wm = W / mods, eaveW = v > 0 ? v + (R.over ?? 1.0) : R.eave ?? 0;
  const yBase = yW + (R.lift ?? 0.55), pedBot = yW - 0.25;
  const lotLen = (n, depth) => (n ? Math.max(0.9, (depth + 0.9 - 0.25) / n) : 0);
  const LF = R.lotsF || { n: 0 }, LB = R.lotsB || { n: 0 };
  const zMainB = LF.n ? L / 2 + 0.25 : zf + (R.gableOver ?? 0.8), zMainA = LB.n ? -L / 2 - 0.25 : zb - (R.gableOver ?? 0.8);
  const roofs = [];
  for (let i = 0; i < mods; i++) {
    const cx = -W / 2 + Wm * (i + 0.5), outerL = i === 0, outerR = i === mods - 1;
    roofs.push({ cx, w: Wm, r: thRoof(acc, {
      cx, hw: mods > 1 ? Wm / 2 : W / 2 + 0.3, p: R.p, son: R.son, nMain: Math.max(1, R.son - (eaveW > 0 ? 1 : 0)), frontFace: R.frontFace, backFace: R.backFace, pe: R.pe, step: R.step, yBase, tile: R.tile, border: R.border, eaveTile: R.eaveTile, eaveBorder: R.eaveBorder,
      eaveL: outerL ? eaveW : 0, eaveR: outerR ? eaveW : 0, overL: outerL ? undefined : 0, overR: outerR ? undefined : 0,
      zMain: [zMainA, zMainB], lotsF: { n: LF.n, len: lotLen(LF.n, f), drop: LF.drop || 1 }, lotsB: { n: LB.n, len: lotLen(LB.n, bk), drop: LB.drop || 1 },
      chofaH: R.chofaH || 1.6, pedBot, pedFixed: R.pedFixed !== false, truss: open ? 0 : 4.5, scale: R.scale || 1,
    }) });
  }
  const roofAt = (x) => roofs.find((q) => x >= q.cx - q.w / 2 - 1e-6 && x <= q.cx + q.w / 2 + 1e-6) || (x < 0 ? roofs[0] : roofs[roofs.length - 1]);
  const lotDy = (z) => { const pc = roofs[0].r.pieces.find((q) => z >= q.zA - 1e-6 && z <= q.zB + 1e-6); return pc ? pc.dy : 0; };
  let cross = null;
  if (spec.cross) { // cánh ngang (trimuk / chữ thập): nóc dọc x, hồi ở hai đầu ±x
    const C = spec.cross, xl = W / 2 + C.len;
    cross = thRoofX(acc, { hw: C.hw, p: R.p, son: Math.max(1, R.son - 1), step: R.step, yBase: yBase - (C.drop || 0), tile: R.tile, border: R.border, zMain: [-xl - 0.8, xl + 0.8], chofaH: (R.chofaH || 1.6) * 0.9, pedBot: pedBot - (C.drop || 0), scale: R.scale || 1, over: 0.5 }, C.z || 0);
  }
  const U = (x, z) => { let y = roofAt(x).r.U(x, z); if (cross && Math.abs(z - (spec.cross.z || 0)) < spec.cross.hw + 0.4) { const yc = cross.U(x, z); if (yc != null && (y == null || yc > y)) y = yc; } return y ?? yW; };

  // ---- cột: hàng hai bên, hàng trước / sau (lẻ gian để chừa gian giữa), hoặc vòng cột đình mở
  const cols = [], key = spec.colKey || 'colG';
  const pushCol = (x, z, top) => { if (!cols.some((c) => Math.abs(c.x - x) < 0.3 && Math.abs(c.z - z) < 0.3)) cols.push({ x, z, top }); };
  const tieY = (z) => pedBot + (R.pedFixed === false ? lotDy(z) : 0) - 0.05;
  const rowX = (z, xs, under) => xs.forEach((x) => pushCol(x, z, Math.abs(x) <= W / 2 + 0.31 && under ? Math.min(U(x, z), tieY(z)) : U(x, z)));
  if (open) {
    const nx = odd(Math.max(1, Math.round(W / step))), nz = Math.max(1, Math.round(L / step));
    rowX(L / 2, spread(-W / 2, W / 2, nx), true); rowX(-L / 2, spread(-W / 2, W / 2, nx), true);
    for (const x of [-W / 2, W / 2]) spread(-L / 2, L / 2, nz).forEach((z) => pushCol(x, z, U(x, z)));
  } else {
    if (v > 0) { const n = Math.max(1, Math.round((zf - zb) / step)); for (const x of [-xo, xo]) spread(zb, zf, n).forEach((z) => pushCol(x, z, U(x, z))); }
    if (f > 0) { rowX(zf, spread(-xo, xo, odd(Math.max(1, Math.round((2 * xo) / step)))), true); if (!v) for (const x of [-xo, xo]) spread(L / 2, zf, Math.max(1, Math.round(f / step))).slice(1).forEach((z) => pushCol(x, z, Math.min(U(x, z), tieY(z)))); }
    if (bk > 0) { rowX(zb, spread(-xo, xo, odd(Math.max(1, Math.round((2 * xo) / step)))), true); if (!v) for (const x of [-xo, xo]) spread(zb, -L / 2, Math.max(1, Math.round(bk / step))).slice(0, -1).forEach((z) => pushCol(x, z, Math.min(U(x, z), tieY(z)))); }
    if (spec.cross) { const C = spec.cross, xe = W / 2 + C.len; for (const sx of [-1, 1]) for (const sz of [-1, 1]) pushCol(sx * xe, (C.z || 0) + sz * (C.hw - 0.3), U(sx * xe, (C.z || 0) + sz * (C.hw - 0.3))); }
  }
  let colH = 0;
  for (const c of cols) { const h = c.top - 0.45 - ph; colH = Math.max(colH, h); thColumn(acc, c.x, c.z, ph, h, colD, key); acc.add('gold', boxB(colD * 1.3, 0.45, colD * 1.3, c.x, c.top - 0.45, c.z)); }
  // xà đầu cột nối các cột cùng hàng (gờ vàng + dải đỏ)
  const link = (a, b) => { const ya = a.top - 0.25, yb = b.top - 0.25; acc.add('gold', beam(V(a.x, ya, a.z), V(b.x, yb, b.z), 0.42, 0.5)); acc.add('ceil', beam(V(a.x, ya - 0.42, a.z), V(b.x, yb - 0.42, b.z), 0.3, 0.34)); };
  const rows = new Map(); for (const c of cols) { const k1 = 'x' + c.x.toFixed(2), k2 = 'z' + c.z.toFixed(2); if (!rows.has(k1)) rows.set(k1, []); if (!rows.has(k2)) rows.set(k2, []); rows.get(k1).push(c); rows.get(k2).push(c); }
  for (const [k, list] of rows) { if (list.length < 2) continue; list.sort((a, b) => (k[0] === 'x' ? a.z - b.z : a.x - b.x)); for (let i = 0; i < list.length - 1; i++) { const a = list[i], b = list[i + 1]; if (Math.hypot(a.x - b.x, a.z - b.z) < step * 1.8) link(a, b); } }
  // consol đỡ mái hiên ở đầu cột ngoài
  for (const c of cols) { const nx = Math.abs(c.x) >= xo - 0.3 ? Math.sign(c.x) : 0, nz = !nx ? Math.sign(c.z) : 0; if (nx || (!open && v === 0)) continue; if (Math.abs(c.x) >= W / 2 + 0.31 || open) bracket(acc, c.x + nx * colD * 0.5, c.top - 1.7, c.z + nz * colD * 0.5, nx || (open ? Math.sign(c.x) : 0), nz, 0.9, 1.3); }
  for (const c of cols) if (Math.abs(Math.abs(c.x) - xo) < 0.3 && (v > 0 || open)) bracket(acc, c.x + Math.sign(c.x) * colD * 0.5, c.top - 1.8, c.z, Math.sign(c.x), 0, 1.0, 1.35);

  // ---- tường thân (trắng), cửa khung nhọn ở đầu hồi, cửa sổ hai bên
  const T = 0.6, wk = spec.wallKey || 'wall', D0 = spec.doors || { n: 1 }, dw = D0.w || 2.6, dh = D0.h || Math.min(storeys[0] * 0.66, 5.4);
  if (!open) {
    const doorsAt = (n) => (n === 3 ? [-W * 0.3, 0, W * 0.3] : n === 2 ? [-W * 0.22, W * 0.22] : [0]);
    for (const [sz, n] of [[1, D0.n || 1], [-1, spec.backDoors ?? 0]]) {
      const ops = []; let y0 = ph;
      storeys.forEach((h, si) => {
        if (si === 0) for (const u of doorsAt(n)) if (n) ops.push({ u, w: u ? dw * 0.82 : dw, y: 0, h: u ? dh * 0.9 : dh, kind: 'door', frame: spec.doorFrame || 'crown', leaf: u || sz < 0 ? 'shut' : 'open', leafKey: spec.doorKey });
        const ew = spec.endWin ?? 0; if (ew && (si > 0 || n < 3)) for (let i = 0; i < ew; i++) { const u = (i % 2 ? 1 : -1) * W * (0.24 + 0.14 * Math.floor(i / 2)); if (!ops.some((o) => Math.abs(o.u - u) < 1.6 && o.y < h + (y0 - ph))) ops.push({ u, w: 1.2, y: y0 - ph + h * 0.32, h: h * 0.42, kind: 'win', frame: spec.win?.frame || 'sum' }); }
        y0 += h;
      });
      xf(acc, mRY(sz > 0 ? 0 : Math.PI, 0, 0, sz * (L / 2 - T / 2)), (a) => wallRun(a, { L: W, y0: ph, H: yW - ph, T, openings: ops, key: wk, shutter: spec.shutter || 'shutter', pil: spec.pilEnd || 0 }));
    }
    const nw = spec.win?.n ?? Math.max(2, Math.round(L / 3.6));
    for (const sx of [-1, 1]) {
      const ops = []; let y0 = 0;
      storeys.forEach((h) => { for (let i = 0; i < nw; i++) { const u = -L / 2 + 1.2 + ((L - 2.4) * (i + 0.5)) / nw; const wh = spec.win?.h ?? h * 0.42, wy = spec.win?.y ?? h * 0.3; ops.push({ u, w: spec.win?.w ?? 1.25, y: y0 + wy, h: wh, kind: 'win', frame: spec.win?.frame || 'sum' }); } y0 += h; });
      xf(acc, mRY((sx * Math.PI) / 2, sx * (W / 2 - T / 2), 0, 0), (a) => wallRun(a, { L: L - 2 * T + 0.01, y0: ph, H: yW - ph, T, openings: ops, key: wk, shutter: spec.shutter || 'shutter', pil: nw }));
    }
    // gờ đầu tường + tầng giữa
    let yy = ph; for (const h of storeys) { yy += h; acc.add('gold', boxB(W + 0.24, 0.22, L + 0.24, 0, yy - 0.22, 0)); acc.add(wk === 'wall' ? 'wallShade' : wk, boxB(W + 0.4, 0.3, L + 0.4, 0, yy - 0.6, 0)); }
    // consol khan thuai dưới dải hiên khi không có hiên cột
    if (!v && eaveW > 0) for (const sx of [-1, 1]) for (let z = -L / 2 + 1.4; z <= L / 2 - 1.3; z += 2.6) bracket(acc, sx * W / 2, yW - 1.9, z, sx, 0, Math.min(1.3, eaveW * 0.8), 1.6);
  } else if (spec.rail !== false) { // đình mở: lan can thấp giữa cột, chừa gian giữa mặt trước
    const hx = W / 2, hz = L / 2, gap = Math.max(1.4, dw / 2);
    thBalustrade(acc, [[-gap, hz], [-hx, hz], [-hx, -hz], [hx, -hz], [hx, hz], [gap, hz]], ph, { h: 0.7, step: 1.6, key: spec.railKey || 'plinth' });
  }
  // trần đỏ sao vàng dưới mái (che lõi mái khi nhìn từ dưới)
  acc.add('ceil', boxB(W + (open ? 0 : -0.6), 0.12, L - 0.6, 0, yW - 0.1, 0));
  if (v > 0) for (const sx of [-1, 1]) acc.add('ceil', boxB(v - 0.2, 0.1, zf - zb, sx * (W / 2 + v / 2), U(sx * (W / 2 + v * 0.5), 0) - 0.2, (zf + zb) / 2));

  // ---- bệ + bậc + sàn
  const pm = spec.plinth?.m ?? (v || f || open ? colD * 0.7 + 0.5 : Math.max(0.8, eaveW * 0.4));
  const crossX = spec.cross ? W / 2 + spec.cross.len : 0, PWh = Math.max(xo, crossX) + pm, zF = zf + pm, zB = zb - pm;
  const sw = spec.stairW || Math.max(dw + 1.2, 3.4);
  const stairs = spec.noStair ? [] : [{ side: spec.stairSide || 1, c: 0, w: sw, naga: spec.naga !== false }];
  if (spec.backStair) stairs.push({ side: -1, c: 0, w: sw * 0.8, naga: spec.naga !== false });
  thPlinth(acc, { W: 2 * PWh, D: zF - zB, h: ph, z: (zF + zB) / 2, key: spec.plinth?.key || 'plinth', garuda: spec.garuda || 0, stairs });
  acc.add('floor', boxB(2 * PWh - 0.6, 0.03, zF - zB - 0.6, 0, ph, (zF + zB) / 2));
  const run = Math.max(2, Math.round(ph / 0.16)) * 0.32 + (spec.naga !== false ? 0.6 : 0);
  const top = Math.max(...roofs.map((q) => q.r.yR)) + 0.1 + (R.chofaH || 1.6) * 1.03;
  return { acc, info: { W: 2 * xo, D: zf - zb, PW: 2 * PWh, PD: zF - zB + run + (spec.backStair ? run : 0), ph, colH: colH || null, colD, eave: Math.min(...roofs.map((q) => bandYEdge(q.r))), top, kind: 'hall', storeys: storeys.length } };
}
const bandYEdge = (r) => Math.min(...r.Br.bands.map((b) => b.ye));
export { bandYEdge };

/** điện / đình xoay 90° (nóc dọc x — sala rai vào ở cạnh dài): dựng như thHall rồi quay, bậc ở cạnh 'x+' thành +z */
export function thHallRot(spec) {
  const r = thHall({ ...spec, stairSide: 'x+' }), acc = new Acc();
  xf(acc, mRY(-Math.PI / 2), (a) => { for (const [k, l] of r.acc.parts) for (const g of l) a.add(k, g); for (const q of r.acc.plats) a.plat(q); });
  const i = r.info; return { acc, info: { ...i, W: i.D, D: i.W, PW: i.PD, PD: i.PW } };
}

// ---------------------------------------------------------------- ĐÌNH / ĐIỆN CHỮ THẬP CÓ CHÓP PRASAT
const NAGA_SMALL = NAGA5;
/** bậc thẳng (tâm x = 0) từ đất lên cao h, mép trên ở z = edge, dài ra +z; lan can Naga hai bên */
function nagaStair(a, { h, edge, w, tr = 0.3, naga = true }) {
  const n = Math.max(2, Math.round(h / 0.16));
  for (let i = 0; i < n; i++) { const zz = edge + tr * (n - i - 0.5), top = (h / n) * (i + 1); a.add(i % 2 ? 'plinth' : 'marble', boxB(w, top, tr, 0, 0, zz)); a.plat({ x: 0, z: zz, w, d: tr + 0.02, top }); }
  for (const sx of [-1, 1]) {
    const xx = sx * (w / 2 + 0.22);
    a.add('plinth', boxB(0.44, h * 0.3, n * tr, xx, 0, edge + (n * tr) / 2));
    if (naga) { a.add('naga', beam(V(xx, h + 0.55, edge - 0.2), V(xx, 0.75, edge + n * tr), 0.26, 0.38)); a.add('plinth', boxB(0.6, 0.38, 0.7, xx, 0, edge + n * tr + 0.15)); figure(a, 'naga', NAGA_SMALL, xx, 0.38, edge + n * tr + 0.15, Math.min(1.5, 0.7 + h * 0.3), 0, 1, 0.16); }
  }
  return n * tr;
}
/**
 * spec: { armZ, armX (nửa dài cánh tới hàng cột), aw (nửa rộng cánh), colH, colD, colKey, cluster (cột / góc),
 *   base: [{ m, h }] (bệ bậc cấp từ dưới lên, m = lề ngoài hộp bao chữ thập) | water: { h, W, D, bridge, bridgeW }
 *   roof: { p, son, eave, tile, border, lots: { n, len, drop }, chofaH, scale }, spire: { tiers, top (cao tuyệt đối), sup, style }, rail }
 */
export function thPrasat(spec) {
  const acc = new Acc(), aw = spec.aw, aZ = spec.armZ, aX = spec.armX, R = spec.roof, colD = spec.colD || 0.34, key = spec.colKey || 'colG';
  let ph = 0, PWh = Math.max(aX, aw), PDh = Math.max(aZ, aw), front = 0;
  if (spec.water) { // sàn nổi trên dãy trụ vòm trong nước (Aisawan, Bang Pa-In — sala2 §3)
    const Wt = spec.water; ph = Wt.h; PWh = Wt.W / 2; PDh = Wt.D / 2;
    for (const [L, x, z, ry] of [[Wt.W, 0, Wt.D / 2 - 0.3, 0], [Wt.W, 0, -Wt.D / 2 + 0.3, 0], [Wt.D - 0.6, Wt.W / 2 - 0.3, 0, Math.PI / 2], [Wt.D - 0.6, -Wt.W / 2 + 0.3, 0, Math.PI / 2]]) {
      const n = Math.max(2, Math.round(L / 2.4)), sh = new THREE.Shape([new THREE.Vector2(-L / 2, -0.4), new THREE.Vector2(L / 2, -0.4), new THREE.Vector2(L / 2, ph - 0.38), new THREE.Vector2(-L / 2, ph - 0.38)]);
      for (let i = 0; i < n; i++) { const cx = -L / 2 + (L * (i + 0.5)) / n, hw = (L / n) * 0.32, yt = ph - 0.75, pts = [new THREE.Vector2(cx - hw, -0.4)]; for (let k = 0; k <= 8; k++) { const ang = Math.PI - (Math.PI * k) / 8; pts.push(new THREE.Vector2(cx + Math.cos(ang) * hw, yt - hw + Math.sin(ang) * hw)); } pts.push(new THREE.Vector2(cx + hw, -0.4)); sh.holes.push(new THREE.Path(pts)); }
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false }); g.translate(0, 0, -0.3); g.rotateY(ry); g.translate(x, 0, z); acc.add('plinth', g);
    }
    for (let i = 1; i < 4; i++) acc.add('plinth', boxB(0.5, ph - 0.38 + 0.4, Wt.D - 1.2, -Wt.W / 2 + (Wt.W * i) / 4, -0.4, 0));
    acc.add('marble', boxB(Wt.W + 0.3, 0.38, Wt.D + 0.3, 0, ph - 0.38, 0)); acc.plat({ x: 0, z: 0, w: Wt.W, d: Wt.D, top: ph });
    acc.add('wallShade', boxB(Wt.W + 0.5, 0.18, Wt.D + 0.5, 0, ph - 0.56, 0));
    const bw = Wt.bridgeW || 3, bl = Wt.bridge || 7, gap = bw / 2;
    thBalustrade(acc, [[-gap, PDh - 0.15], [-PWh + 0.15, PDh - 0.15], [-PWh + 0.15, -PDh + 0.15], [PWh - 0.15, -PDh + 0.15], [PWh - 0.15, PDh - 0.15], [gap, PDh - 0.15]], ph, { h: 0.9, step: 2.2 });
    // cầu nối bờ: bậc thoải, lan can con tiện, trụ vòm dưới cầu
    const n = Math.max(3, Math.round(ph / 0.16)), rise = ph / n, tr = bl / n;
    for (let i = 0; i < n; i++) { const zz = PDh + tr * (i + 0.5), top = ph - rise * i; acc.add('marble', boxB(bw, 0.3, tr + 0.02, 0, top - 0.3, zz)); acc.plat({ x: 0, z: zz, w: bw, d: tr + 0.02, top }); }
    for (let i = 1; i < n; i += 2) acc.add('plinth', boxB(bw * 0.7, ph - rise * i - 0.3 + 0.4, 0.5, 0, -0.4, PDh + tr * i));
    for (const sx of [-1, 1]) { const xx = sx * (gap + 0.12); acc.add('plinth', beam(V(xx, ph + 0.9, PDh), V(xx, rise + 0.9, PDh + bl), 0.22, 0.16)); acc.add('plinth', beam(V(xx, ph + 0.05, PDh), V(xx, rise + 0.05, PDh + bl), 0.24, 0.16)); for (let i = 0; i <= n; i++) acc.add('plinth', boxB(0.1, 0.85, 0.1, xx, ph - rise * i + 0.05, PDh + tr * Math.min(i, n - 0.3))); }
    front = bl;
  } else {
    let y = 0; const tiers = spec.base || [{ m: 0.8, h: 0.6 }];
    tiers.forEach((t, i) => { const W = 2 * (Math.max(aX, aw) + t.m), D = 2 * (Math.max(aZ, aw) + t.m); thPlinth(acc, { W, D, h: t.h, y0: y, key: i % 2 ? 'marble' : 'plinth', stairs: [] }); y += t.h; });
    ph = y; const m0 = tiers[0].m, mt = tiers[tiers.length - 1].m; PWh = Math.max(aX, aw) + m0; PDh = Math.max(aZ, aw) + m0;
    const edge = Math.max(aZ, aw) + mt, sw = Math.max(2.4, Math.min(aw * 2 - 0.4, 3.2));
    const run = nagaStair(acc, { h: ph, edge, w: sw, tr: Math.max(0.28, (PDh - edge + 1.2) / Math.max(2, Math.round(ph / 0.16))), naga: spec.naga !== false });
    front = Math.max(0, edge + run - PDh) + 0.5;
    const rail = Math.max(aX, aw) + mt - 0.2, railZ = edge - 0.2;
    if (spec.rail !== false) thBalustrade(acc, [[-sw / 2 - 0.35, railZ], [-rail, railZ], [-rail, -railZ], [rail, -railZ], [rail, railZ], [sw / 2 + 0.35, railZ]], ph, { h: 0.8, step: 1.8 });
  }
  acc.add('floor', boxB(2 * Math.max(aX, aw) + 1, 0.03, 2 * aw + 1, 0, ph, 0)); acc.add('floor', boxB(2 * aw + 1, 0.03, 2 * Math.max(aZ, aw) + 1, 0, ph, 0));
  // ---- mái chữ thập: cánh dọc z và cánh dọc x, mỗi đầu cánh các lot lồng nhau; hai nóc cùng cao → khe mái ở 4 góc
  const yBase = ph + spec.colH + 0.6, lots = R.lots || { n: 1, len: 0.8, drop: 0.7 }, hw = aw + 0.25, sc = R.scale || 0.7;
  const mk = (arm) => { const end = arm + 0.6, zc = Math.max(hw + 0.3, end - lots.n * lots.len), len = (end - zc) / Math.max(1, lots.n); return { hw, p: R.p, son: R.son || 2, nMain: 1, eaveL: R.eave ?? 0.8, eaveR: R.eave ?? 0.8, yBase, tile: R.tile, border: R.border, edgeKey: R.edgeKey, zMain: [-zc, zc], lotsF: { ...lots, len }, lotsB: { ...lots, len }, chofaH: R.chofaH || 1.1, pedBot: yBase - 0.8, pedFixed: true, scale: sc }; };
  const rz = thRoof(acc, mk(aZ)), rx = thRoofX(acc, mk(aX));
  const U = (x, z) => { const a = Math.abs(x) <= hw + 1.2 ? rz.U(x, z) : null, b = Math.abs(z) <= hw + 1.2 ? rx.U(x, z) : null; return Math.max(a ?? -1e9, b ?? -1e9); };
  // ---- cột theo cụm ở các góc chữ thập (Aphorn: 2–3 cột mỗi góc mukh)
  const cl = spec.cluster || 1, dd = colD * 1.6, cols = [];
  const corner = (x, z, ex, ez) => { cols.push([x, z]); if (cl >= 2) cols.push([x - ex * dd, z - ez * dd]); if (cl >= 3) cols.push([x - (ex ? 0 : Math.sign(x)) * dd, z - (ez ? 0 : Math.sign(z)) * dd]); };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { corner(sx * aw, sz * aZ, 0, sz); corner(sx * aX, sz * aw, sx, 0); if (spec.inner !== false) cols.push([sx * aw, sz * aw]); }
  const yb = yBase - 0.85;
  for (const [x, z] of cols) { thColumn(acc, x, z, ph, yb - 0.3 - ph, colD, key); acc.add('gold', boxB(colD * 1.4, 0.3, colD * 1.4, x, yb - 0.3, z)); }
  // xà quanh chu vi chữ thập + trần đỏ
  const ring = [[aw, aZ], [aw, aw], [aX, aw], [aX, -aw], [aw, -aw], [aw, -aZ], [-aw, -aZ], [-aw, -aw], [-aX, -aw], [-aX, aw], [-aw, aw], [-aw, aZ], [aw, aZ]];
  for (let i = 0; i < ring.length - 1; i++) { const [ax, az] = ring[i], [bx, bz] = ring[i + 1]; acc.add('gold', beam(V(ax, yb + 0.2, az), V(bx, yb + 0.2, bz), 0.3, 0.4)); acc.add('ceil', beam(V(ax, yb - 0.15, az), V(bx, yb - 0.15, bz), 0.22, 0.3)); }
  acc.add('ceil', boxB(2 * aX, 0.1, 2 * aw, 0, yb + 0.3, 0)); acc.add('ceil', boxB(2 * aw, 0.1, 2 * aZ, 0, yb + 0.3, 0));
  for (const [x, z] of cols) { const nx = Math.abs(Math.abs(x) - aX) < 0.05 ? Math.sign(x) : 0, nz = Math.abs(Math.abs(z) - aZ) < 0.05 ? Math.sign(z) : 0; if (nx || nz) bracket(acc, x + nx * colD * 0.5, yb - 1.0, z + nz * colD * 0.5, nx, nz, 0.55, 0.9); }
  void U;
  // ---- chóp ở giao điểm (đế vuông lõm ngồi trên giao nóc)
  const SP = spec.spire, yS = rz.yR - 0.3, b = aw * (SP.bk || 0.72);
  acc.add('gold', redent(b * 1.04, yS - yb, 0, yb, 0));
  thSpire(acc, { y: yS, b, H: SP.top - yS, tiers: SP.tiers, sup: SP.sup, style: SP.style || 'prasat' });
  return { acc, info: { W: 2 * Math.max(aX, aw), D: 2 * Math.max(aZ, aw), PW: 2 * PWh, PD: 2 * PDh + front, ph, colH: yb - 0.3 - ph, colD, eave: yBase - (R.eave ?? 0.8), top: SP.top, kind: 'prasat' } };
}

// ---------------------------------------------------------------- MONDOP (thư viện kinh Phra Mondop)
/**
 * spec: { S (nửa cạnh tường), ca (nửa cạnh vòng cột), perSide (cột / cạnh), base: [{ m, h, key }], wallH, colD, wallKey,
 *   roof: { p, tile, border, chofaH }, mukh: { hw }, spire: { tiers, top } }
 */
export function thMondop(spec) {
  const acc = new Acc(), S = spec.S, ca = spec.ca, R = spec.roof, colD = spec.colD || 0.6;
  let y = 0; const tiers = spec.base;
  tiers.forEach((t) => { const W = 2 * (ca + t.m); thPlinth(acc, { W, D: W, h: t.h, y0: y, key: t.key || 'marble', stairs: [] }); y += t.h; });
  const ph = y, PWh = ca + tiers[0].m, edgeTop = ca + tiers[tiers.length - 1].m, sw = 2.8;
  // 4 cầu thang lan can Naga (library §2) xuyên các tầng bệ
  let run = 0; const ntr = Math.max(2, Math.round(ph / 0.16));
  for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) xf(acc, mRY(Math.atan2(nx, nz)), (a) => { run = nagaStair(a, { h: ph, edge: edgeTop, w: sw, tr: Math.max(0.28, (PWh - edgeTop + 1.6) / ntr) }); });
  const rail = edgeTop - 0.2;
  for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) xf(acc, mRY(Math.atan2(nx, nz)), (a) => { thBalustrade(a, [[-rail, rail], [-sw / 2 - 0.35, rail]], ph, { h: 0.8 }); thBalustrade(a, [[sw / 2 + 0.35, rail], [rail, rail]], ph, { h: 0.8 }); });
  acc.add('floor', boxB(2 * ca + 1.2, 0.03, 2 * ca + 1.2, 0, ph, 0));
  // ---- thân vuông: tường kính lục thiên thần vàng, 4 cửa mũ vương miện (library §3)
  const yW = ph + spec.wallH, T = 0.7;
  for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) xf(acc, mRY(Math.atan2(nx, nz), nx * (S - T / 2), 0, nz * (S - T / 2)), (a) =>
    wallRun(a, { L: 2 * S, y0: ph, H: spec.wallH, T, key: spec.wallKey || 'libWall', openings: [{ u: 0, w: 2.6, y: 0, h: spec.wallH * 0.6, kind: 'door', frame: 'crown', leaf: nz > 0 ? 'open' : 'shut', leafKey: 'door' }], pil: 4 }));
  acc.add('gold', boxB(2 * S + 0.3, 0.3, 2 * S + 0.3, 0, yW - 0.3, 0));
  // ---- 20 cột vòng ngoài (library §2), xà, consol; mái hiên vòng từ đầu tường ra hàng cột
  const per = spec.perSide || 6, cols = [];
  for (let i = 0; i < per; i++) { const t = -ca + (2 * ca * i) / (per - 1); for (const [x, z] of [[t, ca], [t, -ca], [ca, t], [-ca, t]]) if (!cols.some(([a2, b2]) => Math.abs(a2 - x) < 0.1 && Math.abs(b2 - z) < 0.1)) cols.push([x, z]); }
  const ao = ca + 1.1, yIn = yW + 0.3, pe = 0.62, yOut = yIn - pe * (ao - S), cTop = yIn - pe * (ca - S) - 0.45;
  for (const [x, z] of cols) { thColumn(acc, x, z, ph, cTop - ph - 0.4, colD, spec.colKey || 'colG'); acc.add('gold', boxB(colD * 1.3, 0.4, colD * 1.3, x, cTop - 0.4, z)); }
  for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) xf(acc, mRY(Math.atan2(nx, nz)), (a) => { a.add('gold', boxB(2 * ca + 0.5, 0.42, 0.46, 0, cTop - 0.02, ca)); a.add('ceil', boxB(2 * ca, 0.34, 0.34, 0, cTop - 0.36, ca)); for (let i = 0; i < per; i++) bracket(a, -ca + (2 * ca * i) / (per - 1), cTop - 1.4, ca + colD * 0.5, 0, 1, 0.8, 1.2); });
  ringRoof(acc, { ax: S - 0.2, az: S - 0.2, bx: ao, bz: ao, yIn, yOut, tile: R.tile, border: R.border });
  acc.add('ceil', boxB(2 * ca, 0.1, 2 * ca, 0, cTop + 0.4, 0));
  // mukh: mái hồi nhỏ giữa mỗi mặt, nóc vuông góc mặt, trán hồi vàng trên cửa
  const M = spec.mukh || { hw: 2.2 };
  for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) xf(acc, mRY(Math.atan2(nx, nz)), (a) => thRoof(a, { hw: M.hw, p: R.p * 0.9, son: 1, yBase: yOut + 0.5, tile: R.tile, border: R.border, zMain: [S - 0.6, ao + 0.35], backFace: false, chofaH: 0.9, pedBot: cTop + 0.05, pedFixed: true, scale: 0.7 }));
  // mái chữ thập trên thân (4 hồi), rồi chóp mondop 7 tầng
  const hw = S + 0.4, yBase = yW + 1.3, Rc = { hw, p: R.p, son: 2, nMain: 2, yBase, tile: R.tile, border: R.border, zMain: [-hw - 0.5, hw + 0.5], chofaH: R.chofaH || 1.4, pedBot: yW + 0.3, pedFixed: true, over: 0.4, scale: 0.85 };
  const rz = thRoof(acc, Rc); thRoofX(acc, Rc);
  const yS = rz.yR - 0.4, b = S * 0.6; acc.add('gold', redent(b * 1.05, 0.8, 0, yS - 0.4, 0));
  thSpire(acc, { y: yS, b, H: spec.spire.top - yS, tiers: spec.spire.tiers, style: 'mondop', sup: 'garuda' });
  return { acc, info: { W: 2 * ca, D: 2 * ca, PW: 2 * (edgeTop + run), PD: 2 * (edgeTop + run), ph, colH: cTop - ph, colD, eave: yOut, top: spec.spire.top, kind: 'mondop' } };
}
