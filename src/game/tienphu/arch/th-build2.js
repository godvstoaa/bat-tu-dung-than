// ============================================================================
//  BỘ DỰNG THÁI (2): thChakri — «người Tây đội mũ chada» (thân Phục Hưng Ý 3 tầng + mái Thái + 3 chóp 7 tầng)
//                    thLong   — điện dài trên tường thành, mặt tiền cạnh dài, lầu giữa chóp 5 tầng (Sutthaisawan)
//  Theo docs/tienphu-nghiencuu/08-thai.md mục main, officeE; A7.10 (Chakri không được toàn Thái / toàn Âu).
// ============================================================================
import {
  Acc, box, boxB, beam, slabXY, V, xf, mRY, thColumn, thPlinth, thBalustrade, thRoof, thRoofX, wallRun, windowFrame, bracket, thSpire, redent, figure, GARUDA,
} from './th-kit.js';

/** mặt tường kiểu Âu theo tầng (dọc x cục bộ, mặt ngoài +z): floors [{ h, key, n, kind: 'arch'|'win', w, wh, wy, ped, door }] */
function euFacade(acc, { L, y0, floors, T = 0.6, shutter = 'shutterB', pil = true, door = null }) {
  let y = y0;
  floors.forEach((F, fi) => {
    const ops = [], n = F.n, bay = L / n;
    for (let i = 0; i < n; i++) {
      const u = -L / 2 + bay * (i + 0.5);
      if (fi === 0 && door && Math.abs(u) < bay * 0.6) ops.push({ u: 0, w: door.w, y: 0, h: door.h, kind: 'door', frame: 'arch', leaf: 'open', leafKey: 'doorRed' });
      else ops.push({ u, w: F.w ?? Math.min(1.3, bay * 0.5), y: F.wy ?? F.h * 0.22, h: F.wh ?? F.h * 0.55, kind: 'win', frame: F.kind === 'win' ? 'plain' : 'arch', leafKey: shutter });
    }
    wallRun(acc, { L, y0: y, H: F.h, T, openings: ops, key: F.key, shutter, plinthBand: false });
    if (pil && fi > 0) for (let i = 0; i <= n; i++) { const u = -L / 2 + bay * i; acc.add('euTrim', boxB(0.5, F.h - 0.5, 0.2, u, y + 0.15, T / 2 + 0.1)); acc.add('euTrim', boxB(0.66, 0.3, 0.3, u, y + F.h - 0.65, T / 2 + 0.12)); }
    if (F.ped) for (const o of ops) if (o.kind === 'win') { const yt = y + o.y + o.h + 0.3, hw = o.w / 2 + 0.35; acc.add('euTrim', slabXY([[o.u - hw, yt], [o.u + hw, yt], [o.u, yt + 0.6]], 0.2, 0, 0, T / 2 + 0.1)); }
    y += F.h;
    acc.add('euTrim', boxB(L + 0.1, 0.32, T + 0.36, 0, y - 0.32, 0));                                            // gờ tầng
  });
  return y;
}

// ---------------------------------------------------------------- CHAKRI MAHA PRASAT
/**
 * spec: { L (dài mặt tiền), D (sâu khối trước), floors: [h…] (3 tầng), ph, proj: [lầu bên, lầu giữa], back: { W, D },
 *   wingRoof: { p, son, tile, border }, pavRoof: { p, hwSide, hwCenter }, spires: { side, center } (cao đỉnh), balcony: { d, w } }
 */
export function thChakri(spec) {
  const acc = new Acc(), L = spec.L, D = spec.D, F = spec.floors, ph = spec.ph, sec = L / 5, T = 0.6;
  const yC = ph + F.reduce((a, b) => a + b, 0), BK = spec.back, zBack = -D / 2 - BK.D;
  const fl = (n) => [{ h: F[0], key: 'euBase', n, kind: 'arch', wh: F[0] * 0.55, wy: F[0] * 0.18 }, { h: F[1], key: 'euWall', n, kind: 'arch', ped: true }, { h: F[2], key: 'euWall', n, kind: 'arch' }];
  const secs = [{ k: 'pav', proj: spec.proj[0], n: 3 }, { k: 'wing', proj: 0, n: 7 }, { k: 'center', proj: spec.proj[1], n: 3 }, { k: 'wing', proj: 0, n: 7 }, { k: 'pav', proj: spec.proj[0], n: 3 }];
  // ---- nền thấp + sàn
  const zFmax = D / 2 + spec.proj[1] + spec.balcony.d;
  thPlinth(acc, { W: L + 1.6, D: D + 1.6, h: ph, z: 0, stairs: [] });
  thPlinth(acc, { W: BK.W + 1.6, D: BK.D + 0.8, h: ph, z: -D / 2 - BK.D / 2, stairs: [], plat: true });
  for (let y = ph, i = 0; i < F.length; y += F[i], i++) { acc.add('floor', boxB(L - 1, 0.35, D - 1, 0, y + F[i] - 0.35, 0)); acc.add('floor', boxB(BK.W - 1, 0.35, BK.D, 0, y + F[i] - 0.35, -D / 2 - BK.D / 2)); }
  // ---- năm đoạn mặt tiền: lầu bên · cánh · lầu giữa · cánh · lầu bên (main §4)
  secs.forEach((S, i) => {
    const x0 = -L / 2 + i * sec, cx = x0 + sec / 2, zF = D / 2 + S.proj;
    xf(acc, mRY(0, cx, 0, zF - T / 2), (a) => euFacade(a, { L: sec, y0: ph, floors: fl(S.n), door: S.k === 'center' ? { w: 3.2, h: 3.5 } : null }));
    if (S.proj > 0) for (const sx of [-1, 1]) xf(acc, mRY(sx * Math.PI / 2, cx + sx * (sec / 2 - T / 2), 0, D / 2 + S.proj / 2), (a) => euFacade(a, { L: S.proj + 0.01, y0: ph, floors: fl(1).map((q) => ({ ...q, n: 1, w: 0.01, wh: 0.01 })), pil: false }));
    if (S.k !== 'center') xf(acc, mRY(Math.PI, cx, 0, -D / 2 + T / 2), (a) => euFacade(a, { L: sec, y0: ph, floors: fl(S.n).map((q) => ({ ...q, ped: false })), pil: false }));
    // gờ mái (entablature) theo đoạn, lan can trên gờ ở cánh
    acc.add('euTrim', boxB(sec + 0.2, 0.55, 0.9, cx, yC, zF + 0.15)); acc.add('euWall', boxB(sec + 0.1, 0.5, 0.7, cx, yC + 0.55, zF)); acc.add('euTrim', boxB(sec + 0.4, 0.3, 1.2, cx, yC + 1.05, zF + 0.2));
    if (S.proj > 0 || S.k === 'center') acc.add('euTrim', boxB(sec - 1, 1.35, S.proj + 0.5, cx, yC, D / 2 + S.proj / 2 - 0.2));
  });
  for (const sx of [-1, 1]) xf(acc, mRY(sx * Math.PI / 2, sx * (L / 2 - T / 2), 0, 0), (a) => euFacade(a, { L: D, y0: ph, floors: fl(4), pil: true }));
  acc.add('euTrim', boxB(L + 0.3, 0.55, D + 0.3, 0, yC, 0)); acc.add('euWall', boxB(L, 0.5, D, 0, yC + 0.55, 0)); acc.add('euTrim', boxB(L + 0.6, 0.3, D + 0.6, 0, yC + 1.05, 0));
  // ---- sảnh Bắc–Nam phía sau (dáng chữ T, main §2)
  for (const sx of [-1, 1]) xf(acc, mRY(sx * Math.PI / 2, sx * (BK.W / 2 - T / 2), 0, -D / 2 - BK.D / 2), (a) => euFacade(a, { L: BK.D, y0: ph, floors: fl(6).map((q) => ({ ...q, ped: false })), pil: true }));
  xf(acc, mRY(Math.PI, 0, 0, zBack + T / 2), (a) => euFacade(a, { L: BK.W, y0: ph, floors: fl(3), pil: true }));
  acc.add('euTrim', boxB(BK.W + 0.3, 0.55, BK.D, 0, yC, -D / 2 - BK.D / 2)); acc.add('euWall', boxB(BK.W, 0.5, BK.D, 0, yC + 0.55, -D / 2 - BK.D / 2));
  // ---- ban công lầu giữa + cầu thang đôi đổ xuống sân (main §3, §5.3)
  const B = spec.balcony, zF2 = D / 2 + spec.proj[1], yb = ph + F[0], bw = B.w;
  acc.add('euTrim', boxB(bw, 0.45, B.d, 0, yb - 0.45, zF2 + B.d / 2)); acc.plat({ x: 0, z: zF2 + B.d / 2, w: bw, d: B.d, top: yb });
  for (const sx of [-1, 1]) for (const xx of [bw / 2 - 0.5, 2.0]) acc.add('euTrim', boxB(0.6, yb - 0.45, 0.6, sx * xx, 0, zF2 + B.d - 0.4));
  const n = Math.max(2, Math.round((yb - ph) / 0.17)), rise = (yb - ph) / n, tr = 0.3, sw = B.d - 0.2;
  for (const sx of [-1, 1]) {
    for (let i = 0; i < n; i++) { const xx = sx * (bw / 2 + tr * (n - i - 0.5)), top = ph + rise * (i + 1); acc.add(i % 2 ? 'marble' : 'euTrim', boxB(tr, top, sw, xx, 0, zF2 + B.d / 2)); acc.plat({ x: xx, z: zF2 + B.d / 2, w: tr + 0.02, d: sw, top }); }
    const x0 = sx * bw / 2, x1 = sx * (bw / 2 + n * tr);
    acc.add('euTrim', beam(V(x0, yb + 0.95, zF2 + B.d), V(x1, ph + rise + 0.95, zF2 + B.d), 0.24, 0.18)); acc.add('euTrim', beam(V(x0, yb + 0.05, zF2 + B.d), V(x1, ph + rise + 0.05, zF2 + B.d), 0.3, 0.2));
    for (let i = 0; i <= n; i += 2) acc.add('euTrim', boxB(0.12, 0.9, 0.12, sx * (bw / 2 + tr * i), yb - rise * i + 0.05, zF2 + B.d));
    acc.add('euTrim', boxB(0.5, 1.4, 0.5, x1, ph, zF2 + B.d)); acc.add('gold', boxB(0.3, 0.5, 0.3, x1, ph + 1.4, zF2 + B.d));
  }
  thBalustrade(acc, [[-bw / 2 + 0.2, zF2 + 0.2], [-bw / 2 + 0.2, zF2 + B.d - 0.15], [bw / 2 - 0.2, zF2 + B.d - 0.15], [bw / 2 - 0.2, zF2 + 0.2]], yb, { h: 1.0, step: 1.8, key: 'euTrim' });
  // ---- mái Thái: một mái dài suốt mặt tiền (nóc dọc x, lùi tầng — mukh lùi 4 tầng: 3 son + lot đầu hồi), ngói đỏ cam viền xanh
  const yBase = yC + 1.35, WR = spec.wingRoof;
  thRoofX(acc, { hw: D / 2 + 0.25, p: WR.p, son: WR.son, nMain: WR.son - 1, eaveL: 1.3, eaveR: 1.3, pe: WR.p * 0.8, yBase, tile: WR.tile, border: WR.border, zMain: [-L / 2 + 1.1, L / 2 - 1.1], lotsF: { n: 1, len: 1.6, drop: 1.0 }, lotsB: { n: 1, len: 1.6, drop: 1.0 }, chofaH: 1.6, pedBot: yC + 1.0, pedFixed: true, truss: 0 });
  // ---- ba lầu: mái hồi quay ra mặt tiền (lầu giữa 2 lớp hồi), nóc cắt ngang mái dài, chóp 7 tầng ở giao nóc
  const PR = spec.pavRoof, sp = spec.spires;
  [[0, PR.hwSide, sp.side, spec.proj[0], 1], [2, PR.hwCenter, sp.center, spec.proj[1], 2], [4, PR.hwSide, sp.side, spec.proj[0], 1]].forEach(([i, hw, top, proj, lots]) => {
    const cx = -L / 2 + sec * (i + 0.5), zA = i === 2 ? zBack - 0.8 : -D / 2 - 0.9, zB = D / 2 + proj + 0.6 - lots * 1.1;
    const r = thRoof(acc, { cx, hw, p: PR.p, son: 2, nMain: 1, eaveL: 1.0, eaveR: 1.0, yBase, tile: WR.tile, border: WR.border, zMain: [zA, zB], lotsF: { n: lots, len: 1.1, drop: 1.1 }, lotsB: { n: 0 }, chofaH: 2.0, pedBot: yC + 1.0, pedFixed: true });
    const yS = r.yR - 0.4, b = hw * (i === 2 ? 0.46 : 0.42);
    acc.add('gold', redent(b * 1.05, 1.2, cx, yS - 0.8, 0));
    thSpire(acc, { x: cx, y: yS, z: 0, b, H: top - yS, tiers: 7, sup: 'garuda' });
  });
  return { acc, info: { W: L, D: D + BK.D, PW: L + 1.6, PD: zFmax + 0.4 - (zBack - 0.8), zMin: zBack - 0.8, zMax: zFmax + 0.4, ph, eave: yBase - 1.3 * WR.p * 0.8, top: sp.center, storeys: 3, kind: 'chakri' } };
}

// ---------------------------------------------------------------- ĐIỆN DÀI TRÊN TƯỜNG THÀNH (Sutthaisawan)
/**
 * spec: { L, D (sâu thân), base (cao tường thành), floors: [h1, h2], cw (rộng lầu giữa), cproj, nWin (cửa / cánh / tầng),
 *   roof: { p, tile, border, eave }, center: { hw, p }, spire: { tiers, top } }
 */
export function thLong(spec) {
  const acc = new Acc(), L = spec.L, D = spec.D, ph = spec.base, F = spec.floors, cw = spec.cw, cp = spec.cproj, T = 0.6, R = spec.roof;
  const yW = ph + F[0] + F[1];
  // ---- tường thành trắng có hàng ô vòm mù (officeE §3.1), mặt trên là sàn điện
  acc.add('wall', boxB(L + 1.2, ph - 0.3, D + 1.6, 0, 0, 0)); acc.add('wallShade', boxB(L + 1.5, 0.3, D + 1.9, 0, ph - 0.3, 0)); acc.plat({ x: 0, z: 0, w: L + 1.2, d: D + 1.6, top: ph });
  acc.add('wallShade', boxB(L + 1.5, 0.3, D + 1.9, 0, 0, 0));
  const zw = D / 2 + 0.8;
  for (let x = -L / 2 + 1.4; x <= L / 2 - 1.3; x += 2.6) { if (Math.abs(x) < cw / 2 + 1.0) continue; acc.add('dark', boxB(1.2, 1.2, 0.05, x, 0.45, zw + 0.01)); windowFrame(acc, 'arch', x, 0.45, 1.2, 1.4, zw - 0.04); }
  for (let x = -L / 2 + 2; x <= L / 2 - 1.9; x += 1.2) acc.add('wall', boxB(0.6, 0.5, 0.5, x, ph + 0.0, -D / 2 - 0.55));                // răng cưa tường thành mặt sau
  // bậc lên giữa (chân tường → sàn điện), lan can trắng
  const n = Math.max(2, Math.round(ph / 0.16)), tr = 0.3, sw = 3.0;
  for (let i = 0; i < n; i++) { const zz = zw + tr * (n - i - 0.5), top = (ph / n) * (i + 1); acc.add(i % 2 ? 'plinth' : 'marble', boxB(sw, top, tr, 0, 0, zz)); acc.plat({ x: 0, z: zz, w: sw, d: tr + 0.02, top }); }
  for (const sx of [-1, 1]) { acc.add('plinth', boxB(0.4, ph + 0.9, n * tr, sx * (sw / 2 + 0.2), 0, zw + (n * tr) / 2)); }
  // ---- hai cánh: 2 tầng, 9 cửa mỗi tầng sát nhau (officeE §2), cửa chớp lục xám
  const wingL = (L - cw) / 2, fl = (nn) => [{ h: F[0], n: nn, y: 0.6, hh: F[0] * 0.62 }, { h: F[1], n: nn, y: 0.6, hh: F[1] * 0.66 }];
  const run = (a, len, floors, door = false) => {
    const ops = []; let y = 0;
    floors.forEach((Q, fi) => { for (let i = 0; i < Q.n; i++) { const u = -len / 2 + (len * (i + 0.5)) / Q.n; if (door && fi === 0 && Math.abs(u) < len / Q.n * 0.6) ops.push({ u: 0, w: 2.6, y: 0, h: 3.0, kind: 'door', frame: 'sum', leaf: 'open' }); else ops.push({ u, w: Math.min(1.2, (len / Q.n) * 0.62), y: y + Q.y, h: Q.hh, kind: 'win', frame: 'sum', leafKey: 'shutterG' }); } y += Q.h; });
    wallRun(a, { L: len, y0: ph, H: F[0] + F[1], T, openings: ops, key: 'wall', shutter: 'shutterG', pil: floors[0].n });
    a.add('wallShade', boxB(len + 0.1, 0.3, T + 0.3, 0, ph + F[0] - 0.15, 0));
  };
  for (const sx of [-1, 1]) {
    const cx = sx * (cw / 2 + wingL / 2);
    xf(acc, mRY(0, cx, 0, D / 2 - T / 2), (a) => run(a, wingL, fl(spec.nWin)));
    xf(acc, mRY(Math.PI, cx, 0, -D / 2 + T / 2), (a) => run(a, wingL, fl(spec.nWin)));
    xf(acc, mRY(sx * Math.PI / 2, sx * (L / 2 - T / 2), 0, 0), (a) => run(a, D, fl(2)));
  }
  // ---- lầu giữa nhô ra, ban công gỗ tầng trên (officeE §3.3)
  const zc = D / 2 + cp;
  xf(acc, mRY(0, 0, 0, zc - T / 2), (a) => run(a, cw, fl(3), true));
  xf(acc, mRY(Math.PI, 0, 0, -D / 2 + T / 2), (a) => run(a, cw, fl(3)));
  for (const sx of [-1, 1]) acc.add('wall', boxB(T, F[0] + F[1], cp + 0.1, sx * (cw / 2 - T / 2), ph, D / 2 + cp / 2 - 0.05));
  acc.add('gold', boxB(L + 0.24, 0.24, D + 0.24, 0, yW - 0.24, 0)); acc.add('gold', boxB(cw + 0.24, 0.24, cp + 0.24, 0, yW - 0.24, D / 2 + cp / 2));
  acc.add('floor', boxB(L - 1, 0.3, D - 1, 0, ph + F[0] - 0.3, 0));
  const yb = ph + F[0], bd = 1.5;
  acc.add('wood', boxB(cw - 1.2, 0.3, bd, 0, yb - 0.3, zc + bd / 2));
  for (const sx of [-1, 1]) for (const xx of [cw / 2 - 1.0, 1.6]) acc.add('wood', beam(V(sx * xx, yb - 1.6, zc), V(sx * xx, yb - 0.3, zc + bd - 0.2), 0.18, 0.2));
  for (let x = -cw / 2 + 0.7; x <= cw / 2 - 0.69; x += 0.32) acc.add('wood', boxB(0.07, 0.95, 0.07, x, yb, zc + bd - 0.08));
  acc.add('wood', boxB(cw - 1.2, 0.1, 0.16, 0, yb + 0.95, zc + bd - 0.08)); for (const sx of [-1, 1]) acc.add('wood', boxB(0.1, 1.05, bd, sx * (cw / 2 - 0.65), yb, zc + bd / 2));
  // ---- mái cánh: nóc dọc x, 2 son + dải hiên, hồi nhỏ có chofa ở hai đầu; mái lầu giữa chữ thập + chóp mondop 5 tầng
  const yBase = yW + 0.55;
  for (const sx of [-1, 1]) {
    const inner = cw / 2 - 0.5, outer = L / 2 + 0.8 - 1.1, zMain = sx > 0 ? [inner, outer] : [-outer, -inner];
    thRoofX(acc, { hw: D / 2 + 0.3, p: R.p, son: 2, nMain: 1, eaveL: R.eave, eaveR: R.eave, yBase, tile: R.tile, border: R.border, zMain, lotsF: { n: sx > 0 ? 1 : 0, len: 1.1, drop: 0.9 }, lotsB: { n: sx < 0 ? 1 : 0, len: 1.1, drop: 0.9 }, frontFace: sx > 0, backFace: sx < 0, chofaH: 1.3, pedBot: yW - 0.2, pedFixed: true });
  }
  for (const sx of [-1, 1]) for (let x = sx * (cw / 2 + 1.2); Math.abs(x) < L / 2 - 0.8; x += sx * 2.4) for (const sz of [-1, 1]) bracket(acc, x, yW - 1.8, sz * D / 2, 0, sz, Math.min(1.2, R.eave * 0.8), 1.5);
  const C = spec.center, Rc = { hw: C.hw, p: C.p, son: 2, nMain: 1, eaveL: 0.9, eaveR: 0.9, yBase: yBase + 0.3, tile: R.tile, border: R.border, chofaH: 1.6, pedBot: yW - 0.1, pedFixed: true };
  const rz = thRoof(acc, { ...Rc, zMain: [-D / 2 - 0.8, zc + 0.8 - 1.0], lotsF: { n: 1, len: 1.0, drop: 0.9 } });
  thRoofX(acc, { ...Rc, zMain: [-cw / 2 - 0.4, cw / 2 + 0.4], frontFace: false, backFace: false });
  const yS = rz.yR - 0.4, b = C.hw * 0.4; acc.add('gold', redent(b * 1.05, 1.0, 0, yS - 0.6, 0));
  thSpire(acc, { y: yS, b, H: spec.spire.top - yS, tiers: spec.spire.tiers, style: 'mondop', sup: 'garuda' });
  const PDf = zw + n * tr + 0.3;
  return { acc, info: { W: L, D, PW: L + 1.6, PD: PDf + D / 2 + 0.8, zMin: -D / 2 - 0.8, zMax: PDf, ph, eave: yBase - R.eave * R.p * 0.6, top: spec.spire.top, storeys: 2, kind: 'long' } };
}
