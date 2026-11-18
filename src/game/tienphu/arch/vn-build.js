// ============================================================================
//  BỘ DỰNG CUNG ĐÌNH HUẾ THEO LOẠI HÌNH — docs/tienphu-nghiencuu/07-hue.md.
//  vnBuild: nhà rường / điện có chái + hiên, mái CHỒNG DIÊM (mái hạ vòng quanh + cổ diêm + mái thượng),
//           NHÀ KÉP «trùng thiềm điệp ốc» (hai mái thượng song song nối máng xối, trần vỏ cua), gác nhiều tầng thu gian
//           (Hiển Lâm Các), lầu 2 tầng (Phu Văn Lâu, Ngũ Phụng), phương đình 16 cột (trên nền, trên nước, trên đài).
//  vnLang: hồi lang (hành lang có mái hai dốc).   vnTower: lầu 10 tầng vuông (gác kiểu Hiển Lâm trên đài kiểu Ngọ Môn).
//  Khung cục bộ: gốc = tâm mặt bằng trên mặt đất, +z = mặt tiền. Mọi hàm trả { acc, info }.
// ============================================================================
import * as THREE from 'three';
import { Acc } from './kit.js';
import { columnRing } from '../tower.js';
import {
  tbox, bandX, put, steps, vnBase, vnCol, keBracket, slopeRoof, ridgeBand, coDiem, ornament,
  doorBay, shapedWin, plasterBay, panelBay, glassBay, woodRail, ganhRail, daoOrn, box, boxB, cyl, beam, slabXY, lathe, V,
} from './vn-kit.js';

const sum = (a) => a.reduce((s, x) => s + x, 0);
const ORN_H = { gourd: 2.04, longGourd: 2.04, sun: 1.9, taiji: 1.9 };

// ---------------------------------------------------------------- vách một cạnh (dựng dọc u, rồi xoay vào cạnh chữ nhật)
/** 4 cạnh của chữ nhật R: { key, ry, x, z, toU(world) } — u là toạ độ dọc cạnh trong khung cục bộ của cạnh */
function rectSides(R) {
  return {
    front: { ry: 0, x: 0, z: R.zF, toU: (w) => w, axis: 'x' },
    back: { ry: Math.PI, x: 0, z: R.zB, toU: (w) => -w, axis: 'x' },
    right: { ry: Math.PI / 2, x: R.xR, z: 0, toU: (w) => -w, axis: 'z' },
    left: { ry: -Math.PI / 2, x: R.xL, z: 0, toU: (w) => w, axis: 'z' },
  };
}
/** dựng một gian vách theo kiểu: door / doorOpen / plaster / panel / glass / glassDoor / rail / open */
function bay(acc, kind, u0, u1, y0, h, o = {}) {
  if (!kind || kind === 'open') return;
  if (kind === 'door' || kind === 'doorOpen') doorBay(acc, u0, u1, y0, Math.min(h, o.doorH ?? h), { open: kind === 'doorOpen', glass: o.glass });
  else if (kind === 'plaster') plasterBay(acc, u0, u1, y0, h, { win: o.win, r: o.r ?? 0.7 });
  else if (kind === 'panel') panelBay(acc, u0, u1, y0, h, { win: o.win, r: o.r ?? 0.55 });
  else if (kind === 'glass' || kind === 'glassDoor') glassBay(acc, u0, u1, y0, h, { door: kind === 'glassDoor' });
  else if (kind === 'rail') woodRail(acc, u0, u1, y0, { h: 0.7 });
  else if (kind === 'ganh') ganhRail(acc, u0, u1, y0, { h: 0.85 });
  // phần trên cửa (tới đáy xà / mái): ván son
  if ((kind === 'door' || kind === 'doorOpen') && o.doorH && h - o.doorH > 0.15) acc.add('beam', boxB(u1 - u0, h - o.doorH, 0.16, (u0 + u1) / 2, y0 + o.doorH, 0));
}
/** dựng dãy gian dọc một cạnh: divs = mốc theo toạ độ thế giới (tăng dần), kinds(i, n) → kiểu gian i */
function sideBays(acc, S, divs, y0, h, kinds, opts = {}) {
  put(acc, (t) => {
    for (let i = 0; i < divs.length - 1; i++) {
      const a = S.toU(divs[i]), b = S.toU(divs[i + 1]), u0 = Math.min(a, b), u1 = Math.max(a, b), k = kinds(i, divs.length - 1);
      const o = typeof opts === 'function' ? opts(i, divs.length - 1) : opts;
      bay(t, k, u0 + 0.12, u1 - 0.12, y0, h, o);
    }
  }, S.ry, S.x, S.z);
}

// ---------------------------------------------------------------- ĐIỆN / NHÀ / ĐÌNH / GÁC (dựng chung)
/**
 * spec: bays (gian theo x, lẻ, chái ở hai đầu), spans (nhịp theo chiều sâu, từ trước ra sau; nhịp đầu / cuối là hiên / chái),
 *  ph (cao nền), base { mx, mzF, mzB, stairs: [{ side, cx, w, n, rail }], floor }, court: [{ w, d, h, stairs: [{cx, w}] }] (sân 2 cấp),
 *  water: true (đứng trên nước), dai: { h, m } (đài gạch), colQ (cột quân / cột hiên), colD, colKey,
 *  front / back / ends: kiểu vách tầng trệt ('hien' | 'door' | 'glass' | 'panel' | 'rail' | 'open' | 'plaster'), chaiWin, glassDoors,
 *  low: { over, s } (mái hạ), tiers: [{ kind: 'codiem', h } | { kind: 'storey', h, hx, hz, bal, walls, win, low }],
 *  top: { over, ridge (cao đỉnh bờ nóc trên nền), split (chỉ số hàng cột máng xối — nhà kép), minR, ridgeH, ornS },
 *  tile, orn, ornFront, dao, daoS
 */
export function vnBuild(spec) {
  if (spec.dai) return onDai(spec);
  const acc = new Acc(), T = spec.tile || 'Yellow', bays = spec.bays, spans = spec.spans, nX = bays.length, nZ = spans.length;
  const W = sum(bays), D = sum(spans), ph = spec.ph, colD = spec.colD || 0.45, colKey = spec.colKey || 'col';
  const xs = [-W / 2]; for (const b of bays) xs.push(xs[xs.length - 1] + b);
  const zs = [D / 2]; for (const s of spans) zs.push(zs[zs.length - 1] - s);
  const ci = Math.floor(nX / 2);
  const O = { xL: xs[0], xR: xs[nX], zF: zs[0], zB: zs[nZ] }, I = { xL: xs[1], xR: xs[nX - 1], zF: zs[1], zB: zs[nZ - 1] };
  // --- nền (+ sân 2 cấp phía trước, hoặc trụ trên nước)
  const b = spec.base || {}, mx = b.mx ?? 0.9, mzF = b.mzF ?? mx, mzB = b.mzB ?? mzF;
  const PW = W + 2 * mx, PDn = D + mzF + mzB, bz = (mzF - mzB) / 2;
  let frontZ = bz + PDn / 2, PD = PDn;
  const stairs = b.stairs ?? [{ side: 1, cx: 0, w: Math.min(bays[ci] * 0.8, 4.4) }];
  if (spec.water) {
    acc.add('stone', tbox(PW, 0.35, PDn, 0, ph - 0.35, bz, 2)); acc.add('court', tbox(PW - 0.3, 0.02, PDn - 0.3, 0, ph, bz, 0.76));
    acc.add('stoneDark', tbox(PW + 0.1, 0.1, PDn + 0.1, 0, ph - 0.1, bz, 1)); acc.plat({ x: 0, z: bz, w: PW, d: PDn, top: ph });
    for (const x of xs) for (const z of zs) if (x === xs[0] || x === xs[nX] || z === zs[0] || z === zs[nZ]) acc.add('stone', tbox(0.7, ph - 0.35, 0.7, x, 0, z, 1));
    for (const s of stairs) steps(acc, { x: s.cx || 0, z: s.side > 0 ? bz + PDn / 2 : bz - PDn / 2, side: s.side, w: s.w, h: ph, rail: s.rail ?? 'scroll' });
  } else if (spec.court) {
    vnBase(acc, { W: PW, D: PDn, h: ph, z: bz, stairs: stairs.filter((s) => s.side < 0) });
    let zf = frontZ, yPrev = ph, prevStairs = stairs.filter((s) => s.side > 0);
    for (const c of spec.court) {
      acc.add('stone', tbox(c.w, c.h - 0.1, c.d, 0, 0, zf + c.d / 2, 2)); acc.add('stoneDark', tbox(c.w + 0.1, 0.1, c.d + 0.1, 0, c.h - 0.1, zf + c.d / 2, 1));
      acc.add('court', tbox(c.w - 0.3, 0.02, c.d - 0.3, 0, c.h, zf + c.d / 2, 0.76)); acc.add('stoneDark', tbox(c.w + 0.2, 0.16, c.d + 0.2, 0, 0, zf + c.d / 2, 1));
      acc.plat({ x: 0, z: zf + c.d / 2, w: c.w, d: c.d, top: c.h });
      for (const s of prevStairs) steps(acc, { x: s.cx || 0, z: zf, side: 1, w: s.w, h: yPrev - c.h, y0: c.h, n: s.n, rail: s.rail ?? 'dragon' });
      // phẩm sơn: hai hàng bia đá nhỏ dọc dũng đạo (sân Đại Triều Nghi)
      if (c.pham) for (const sx of [-1, 1]) for (let k = 0; k < c.pham; k++) { const zz = zf + 1.4 + (k * (c.d - 2.4)) / Math.max(1, c.pham - 1); acc.add('stoneDark', boxB(0.42, 0.75, 0.22, sx * (c.phamX || 7), c.h, zz)); acc.add('stoneDark', boxB(0.5, 0.08, 0.3, sx * (c.phamX || 7), c.h + 0.75, zz)); }
      zf += c.d; yPrev = c.h; prevStairs = c.stairs || [{ cx: 0, w: 4 }];
    }
    for (const s of prevStairs) steps(acc, { x: s.cx || 0, z: zf, side: 1, w: s.w, h: yPrev, n: s.n, rail: s.rail ?? 'dragon' });
    PD = zf - (bz - PDn / 2); frontZ = zf;
  } else vnBase(acc, { W: PW, D: PDn, h: ph, z: bz, stairs, floor: b.floor });
  // --- độ cao: mái hạ
  const colQ = spec.colQ, low = spec.low || { over: 1.6, s: 0.45 }, tiers = spec.levels || [{ kind: 'codiem', h: 0.9 }];
  const rectOf = (t) => (t.hx ? { xL: -t.hx, xR: t.hx, zF: (I.zF + I.zB) / 2 + t.hz, zB: (I.zF + I.zB) / 2 - t.hz } : { ...I });
  const grow = (R, d) => ({ xL: R.xL - d, xR: R.xR + d, zF: R.zF + d, zB: R.zB - d });
  const ringRise = (E, Ri, over, s) => { const run = Math.max(E.zF - Ri.zF, Ri.zB - E.zB); const o = Math.min(over, 0.6 * run); return s * (0.6 * o + (run - o)); };
  // vòng 0: mái hạ từ cột quân tới tầng trên / cổ diêm
  const E0 = grow(O, low.over), y0 = ph + colQ + 0.38 - 0.6 * low.s * low.over;
  const R1 = rectOf(tiers[0]), R1i = grow(R1, tiers[0].bal || 0), y1 = y0 + ringRise(E0, R1i, low.over, low.s);
  slopeRoof(acc, E0, R1i, y0, y1, { tile: T, over: low.over, dao: spec.dao || 'dragon', daoS: spec.daoS || 1, rib: spec.rib });
  acc.add('stoneDark', boxB(R1i.xR - R1i.xL + 0.3, 0.12, 0.3, (R1i.xL + R1i.xR) / 2, y1 - 0.02, R1i.zF)); // bờ chặn chân cổ diêm
  // --- cột: quân (vòng ngoài), cái (vòng trong / cổ diêm), cột giữa nhà
  const yTopFirst = y1 + (tiers[0].h || 0.9);
  for (let i = 0; i <= nX; i++) for (let j = 0; j <= nZ; j++) {
    const x = xs[i], z = zs[j], outer = i === 0 || i === nX || j === 0 || j === nZ;
    if (outer) { vnCol(acc, x, z, ph, colQ, colD, colKey); continue; }
    const onR1 = (Math.abs(x - R1.xL) < 0.05 || Math.abs(x - R1.xR) < 0.05) && z <= R1.zF + 0.05 && z >= R1.zB - 0.05 || (Math.abs(z - R1.zF) < 0.05 || Math.abs(z - R1.zB) < 0.05) && x >= R1.xL - 0.05 && x <= R1.xR + 0.05;
    if (onR1) vnCol(acc, x, z, ph, yTopFirst - ph, colD * 1.08, colKey);
    else if (spec.interior !== false) vnCol(acc, x, z, ph, y1 - ph + 0.4, colD * 1.05, colKey);
  }
  // xà đầu cột quân + kẻ chìa ra đỡ mái hạ
  const yb = ph + colQ;
  for (const [ax, az, bx, bz2] of [[O.xL, O.zF, O.xR, O.zF], [O.xL, O.zB, O.xR, O.zB], [O.xL, O.zB, O.xL, O.zF], [O.xR, O.zB, O.xR, O.zF]]) {
    acc.add('beam', beam(V(ax, yb + 0.12, az), V(bx, yb + 0.12, bz2), 0.32, 0.42)); acc.add('gold', beam(V(ax, yb - 0.12, az), V(bx, yb - 0.12, bz2), 0.34, 0.06));
  }
  for (let i = 0; i <= nX; i++) for (const [z, nz] of [[O.zF, 1], [O.zB, -1]]) { const nx = i === 0 ? -1 : i === nX ? 1 : 0; keBracket(acc, xs[i], z, yb - 0.1, nx * 0.7071 + (nx ? 0 : 0), nz * (nx ? 0.7071 : 1), low.over * 0.62); }
  for (let j = 1; j < nZ; j++) for (const [x, nx] of [[O.xL, -1], [O.xR, 1]]) keBracket(acc, x, zs[j], yb - 0.1, nx, 0, low.over * 0.62);
  // --- vách tầng trệt
  walls0(acc, spec, { xs, zs, O, I, ph, colQ, y1, ci, R1 });
  // --- các tầng trên (cổ diêm / tầng lầu) và mái
  let yBase = y1, Rk = R1, eave = y0;
  let top = 0;
  for (let k = 0; k < tiers.length; k++) {
    const t = tiers[k], last = k === tiers.length - 1;
    let yTopK;
    if (t.kind === 'codiem') { coDiem(acc, Rk, yBase - 0.06, t.h); yTopK = yBase + t.h; }
    else yTopK = storey(acc, t, Rk, yBase, xs, zs, I);
    if (!last) {
      const tn = tiers[k + 1], Rn = rectOf(tn), Rni = grow(Rn, tn.bal || 0), lo = t.low || low;
      const Ek = grow(Rk, lo.over), yk0 = yTopK + 0.38 - 0.6 * lo.s * lo.over, yk1 = yk0 + ringRise(Ek, Rni, lo.over, lo.s);
      slopeRoof(acc, Ek, Rni, yk0, yk1, { tile: T, over: lo.over, dao: spec.dao || 'dragon', daoS: (spec.daoS || 1) * 0.85, rib: spec.rib });
      // cột cái tầng trên (đứng trên xà tầng dưới)
      for (const [x, z] of [[Rn.xL, Rn.zF], [Rn.xR, Rn.zF], [Rn.xR, Rn.zB], [Rn.xL, Rn.zB]]) acc.add(spec.colKey || 'col', cyl(colD * 0.48, colD * 0.46, (tn.h || 0.9) + yk1 - yTopK + 0.4, x, yTopK - 0.4, z, 10));
      yBase = yk1; Rk = Rn;
    } else top = topRoofs(acc, spec, Rk, yTopK, T, ph, xs, zs);
  }
  // lan can đá quanh nền (Phu Văn Lâu: cao 0,55–0,65 m, ngắt ở bậc trước, trái, phải)
  if (spec.baseRail) {
    const gap = spec.baseRail.gap ?? 2.6, hR = spec.baseRail.h ?? 0.6, e = 0.2;
    const seg = (t, L, open) => { const parts = open ? [[-L / 2, -gap / 2], [gap / 2, L / 2]] : [[-L / 2, L / 2]]; for (const [u0, u1] of parts) { t.add('stone', boxB(u1 - u0, hR - 0.1, 0.26, (u0 + u1) / 2, ph, 0)); t.add('stoneDark', boxB(u1 - u0 + 0.06, 0.1, 0.34, (u0 + u1) / 2, ph + hR - 0.1, 0)); const n = Math.max(1, Math.round((u1 - u0) / 1.6)); for (let i = 0; i <= n; i++) t.add('stoneDark', boxB(0.3, hR + 0.15, 0.32, u0 + ((u1 - u0) * i) / n, ph, 0)); } };
    const op = spec.baseRail.open || ['front', 'left', 'right'];
    put(acc, (t) => seg(t, PW - 2 * e, op.includes('front')), 0, 0, bz + PDn / 2 - e); put(acc, (t) => seg(t, PW - 2 * e, op.includes('back')), Math.PI, 0, bz - PDn / 2 + e);
    put(acc, (t) => seg(t, PDn - 2 * e, op.includes('right')), Math.PI / 2, PW / 2 - e, bz); put(acc, (t) => seg(t, PDn - 2 * e, op.includes('left')), -Math.PI / 2, -PW / 2 + e, bz);
  }
  for (const x of spec.extras || []) { if (x.kind === 'drum') drum(acc, x.x, ph, x.z); else if (x.kind === 'bell') bell(acc, x.x, ph, x.z); else if (x.kind === 'stele') stele(acc, x.x, x.z, x.ry || 0); }
  const ext = platExtent(acc.plats);
  const info = { W, D, PW: ext.w, PD: ext.d, cx: ext.cx, cz: ext.cz, ph, colH: colQ, colD, eave, top, bays: [...bays], spans: [...spans], n: nX, front: frontZ, kind: spec.kind || 'hall' };
  return { acc, info };
}
/** mái thượng (một nhà, hoặc hai nhà song song — nhà kép) trên chữ nhật R từ độ cao yTop */
function topRoofs(acc, spec, R, yTop, T, ph, xs, zs) {
  const tp = spec.top || {}, over = tp.over ?? 1.3, ridgeH = tp.ridgeH ?? 0.75, ornS = tp.ornS ?? 1;
  const Tr = { xL: R.xL - over, xR: R.xR + over, zF: R.zF + over, zB: R.zB - over };
  const zg = tp.split != null ? zs[tp.split] : null;
  const houses = zg != null ? [{ zF: Tr.zF, zB: zg, front: true }, { zF: zg, zB: Tr.zB }] : [{ zF: Tr.zF, zB: Tr.zB }];
  const ezMax = Math.max(...houses.map((h) => (h.zF - h.zB) / 2));
  const yR = ph + tp.ridge - (0.16 + ridgeH + 0.28) - ornS * (ORN_H[spec.orn] ?? 0) * 0;
  const s = tp.s ?? Math.max(0.3, (yR - yTop - 0.38) / Math.max(0.5, ezMax - over));
  const y0 = yTop + 0.38 - 0.6 * s * over;
  let top = 0;
  for (const h of houses) {
    const ez = (h.zF - h.zB) / 2, zc = (h.zF + h.zB) / 2, ex = (Tr.xR - Tr.xL) / 2, cx = (Tr.xL + Tr.xR) / 2;
    const rx = Math.min(ex - 0.3, Math.max(ex - ez, (tp.minR ?? 0.3) * ex));
    const rise = s * (0.6 * Math.min(over, 0.6 * ez) + ez - Math.min(over, 0.6 * ez)), yr = y0 + rise;
    const mask = zg == null ? null : h.front ? [true, true, false, false] : [false, false, true, true];
    slopeRoof(acc, { ...Tr, zF: h.zF, zB: h.zB }, { xL: cx - rx, xR: cx + rx, zF: zc, zB: zc }, y0, yr, { tile: T, over, dao: spec.dao || 'dragon', daoS: spec.daoS || 1, daoMask: mask, rib: spec.rib });
    const orn = h.front && spec.ornFront !== undefined ? spec.ornFront : spec.orn;
    top = Math.max(top, ridgeBand(acc, cx - rx, cx + rx, zc, yr - 0.08, { h: ridgeH, tile: T, orn, s: (h.front ? 0.85 : 1) * ornS }));
    // vì kèo trong mỗi nhà (chồng rường – giả thủ ở nhà trước, kèo ở nhà sau) tại các hàng cột trong
    if (spec.truss !== false) {
      // vì kèo trong nhà (chồng rường – giả thủ): xà chồng 3 lớp ngắn dần + trụ, nằm gọn dưới mặt mái
      const o = Math.min(over, 0.6 * ez), dAt = (yy) => (yy <= y0 + s * 0.6 * o ? (yy - y0) / (s * 0.6) : o + (yy - y0 - s * 0.6 * o) / s);
      const yA = yTop + 0.15, yB = yr - 0.55, lev = 3, dy = (yB - yA) / lev;
      for (let i = 1; i < xs.length - 1; i++) {
        const x = xs[i]; if (Math.abs(x - cx) > rx - 0.4) continue;
        let hPrev = 0;
        for (let q = 0; q < lev; q++) {
          const y = yA + q * dy, half = Math.max(0.35, ez - dAt(y + 0.42 + 0.3));
          acc.add(q % 2 ? 'wood' : 'beam', boxB(0.3, 0.42, 2 * half, x, y, zc));
          if (q) for (const sz of [-1, 1]) acc.add('wood', boxB(0.3, dy - 0.42, 0.3, x, y - dy + 0.42, zc + sz * Math.min(half, hPrev) * 0.8));
          hPrev = half;
        }
        acc.add('wood', boxB(0.3, yB - (yA + (lev - 1) * dy) - 0.42, 0.3, x, yA + (lev - 1) * dy + 0.42, zc));
      }
    }
  }
  if (zg != null) {
    // máng xối + trần vỏ cua (thừa lưu) nối hai nhà
    acc.add('stoneDark', boxB(Tr.xR - Tr.xL - 0.6, 0.22, 0.6, (Tr.xL + Tr.xR) / 2, y0 - 0.1, zg));
    const rows = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (i / 8), z = zg + Math.cos(a) * 1.6, y = yTop - 0.55 + Math.sin(a) * 0.3; rows.push([V(R.xL, y, z), V(R.xR, y, z)]); }
    acc.add('tileCeil', new THREE.BufferGeometry().copy(gridOf(rows)));
  }
  return top;
}
import { gridSurface } from './kit.js';
const gridOf = (rows) => gridSurface(rows);

/** vách tầng trệt theo kiểu mặt tiền / hậu / hồi */
function walls0(acc, spec, { xs, zs, O, I, ph, colQ, y1, ci, R1 }) {
  const nX = xs.length - 1, nZ = zs.length - 1, front = spec.front || 'hien', back = spec.back || 'plaster', ends = spec.ends || 'plaster';
  const chaiWin = spec.chaiWin === undefined ? 'round' : spec.chaiWin, glass = !!spec.glassDoors, h0 = colQ;
  const doorH = Math.min(colQ - 0.25, spec.doorH ?? 4.2);
  const So = rectSides(O);
  const centerOpen = (i) => i === ci;
  const one = (S, divs, y, h, kinds, opts) => sideBays(acc, S, divs, y, h, kinds, opts);
  const facade = (mode, S, Sin, zIn, isBack = false) => {
    if (mode === 'hien') {
      // hiên: cửa bảng khoa ở hàng cột trong (các gian giữa), chái hai đầu là tường vữa có cửa sổ tròn chữ Thọ
      const hIn = (y1 - ph) - 0.05;
      one(Sin, xs.slice(1, nX), ph, hIn, (i) => (centerOpen(i + 1) && (!isBack || spec.backOpen) ? 'doorOpen' : 'door'), { doorH, glass });
      one(S, [xs[0], xs[1]], ph, h0, () => 'plaster', { win: chaiWin, r: 0.7 });
      one(S, [xs[nX - 1], xs[nX]], ph, h0, () => 'plaster', { win: chaiWin, r: 0.7 });
      // tường hồi hiên (giữa chái và hiên)
      for (const x of [xs[1], xs[nX - 1]]) put(acc, (t) => plasterBay(t, -Math.abs(S.z - zIn) / 2 + 0.2, Math.abs(S.z - zIn) / 2 - 0.2, ph, h0, {}), Math.PI / 2, x, (S.z + zIn) / 2);
    } else if (mode === 'door') one(S, xs, ph, h0, (i, n) => (centerOpen(i) ? 'doorOpen' : (i === 0 || i === n - 1) && chaiWin ? 'plaster' : 'door'), (i) => ({ doorH, glass, win: chaiWin, r: 0.6 }));
    else if (mode === 'glass') one(S, xs, ph, h0, (i) => (centerOpen(i) ? 'glassDoor' : 'glass'));
    else if (mode === 'panel') one(S, xs, ph, h0, (i) => (centerOpen(i) ? 'doorOpen' : 'panel'), (i) => ({ doorH, win: i === ci - 1 || i === ci + 1 ? 'round' : null }));
    else if (mode === 'rail') one(S, xs, ph, h0, (i) => (centerOpen(i) ? 'open' : 'rail'));
    else if (mode === 'plaster') one(S, xs, ph, h0, () => 'plaster', (i, n) => ({ win: (i === 1 || i === n - 2) && n > 4 ? chaiWin : null }));
    else if (mode === 'doorsClosed') one(S, xs, ph, h0, (i, n) => ((i === 0 || i === n - 1) ? 'plaster' : 'door'), { doorH, glass });
  };
  const Sin = rectSides({ ...O, zF: zs[1], zB: zs[nZ - 1] });
  facade(front, So.front, Sin.front, zs[1]);
  facade(back, So.back, Sin.back, zs[nZ - 1], true);
  // hai hồi
  for (const S of [So.right, So.left]) {
    const divs = [...zs].reverse(), n = divs.length - 1, mid = Math.floor(n / 2);
    if (ends === 'plaster') sideBays(acc, S, divs, ph, h0, () => 'plaster', (i) => ({ win: spec.endWin && i === mid ? spec.endWin : null, r: 0.6 }));
    else if (ends === 'glass') sideBays(acc, S, divs, ph, h0, (i) => (spec.endDoor && i === mid ? 'glassDoor' : 'glass'));
    else if (ends === 'panel') sideBays(acc, S, divs, ph, h0, (i) => (spec.endDoor && i === mid ? 'doorOpen' : 'panel'), (i) => ({ doorH, win: i !== mid ? 'square' : null }));
    else if (ends === 'rail') sideBays(acc, S, divs, ph, h0, (i) => (spec.endDoor && i === mid ? 'open' : 'rail'));
  }
}
/** tầng lầu (gác): sàn + ban công lan can con tiện, vách «thượng song hạ bản» có cửa sổ hình, cột ở góc; trả cao đỉnh tầng */
function storey(acc, t, R, yB, xs, zs, I) {
  const bal = t.bal || 0, h = t.h, Wd = R.xR - R.xL, Dd = R.zF - R.zB, cx = (R.xL + R.xR) / 2, cz = (R.zF + R.zB) / 2;
  acc.add('wood', boxB(Wd + 2 * bal + 0.3, 0.25, Dd + 2 * bal + 0.3, cx, yB - 0.25, cz));
  acc.add('beam', bandX(Wd + 2 * bal + 0.36, 0.3, 0.06, cx, yB - 0.3, cz + Dd / 2 + bal + 0.18, 1)); acc.add('beam', bandX(Wd + 2 * bal + 0.36, 0.3, 0.06, cx, yB - 0.3, cz - Dd / 2 - bal - 0.18, 1));
  if (bal > 0.2) {
    const B = { xL: R.xL - bal, xR: R.xR + bal, zF: R.zF + bal, zB: R.zB - bal }, S = rectSides(B);
    for (const k of ['front', 'back', 'right', 'left']) { const s = S[k], L = k === 'front' || k === 'back' ? B.xR - B.xL : B.zF - B.zB; put(acc, (tt) => woodRail(tt, -L / 2, L / 2, yB, { h: 0.9 }), s.ry, s.x || (k === 'front' || k === 'back' ? cx : 0), s.z || (k === 'right' || k === 'left' ? cz : 0)); }
  }
  // chia gian: dùng lưới cột nếu cạnh trùng lưới, không thì chia đều theo nx / nz
  const gridX = xs.filter((x) => x >= R.xL - 0.05 && x <= R.xR + 0.05), gridZ = zs.filter((z) => z <= R.zF + 0.05 && z >= R.zB - 0.05).reverse();
  const divX = gridX.length >= 2 && Math.abs(gridX[0] - R.xL) < 0.06 && Math.abs(gridX[gridX.length - 1] - R.xR) < 0.06 ? gridX : Array.from({ length: (t.nx || 1) + 1 }, (_, i) => R.xL + (Wd * i) / (t.nx || 1));
  const divZ = gridZ.length >= 2 && Math.abs(gridZ[0] - R.zB) < 0.06 && Math.abs(gridZ[gridZ.length - 1] - R.zF) < 0.06 ? gridZ : Array.from({ length: (t.nz || 1) + 1 }, (_, i) => R.zB + (Dd * i) / (t.nz || 1));
  const S = rectSides(R), win = t.win || {};
  const midX = Math.floor((divX.length - 1) / 2), midZ = Math.floor((divZ.length - 1) / 2);
  sideBays(acc, S.front, divX, yB, h, () => 'panel', (i, n) => ({ win: n === 1 ? (win.front || 'round') : i === midX ? (win.front || 'round') : (win.frontSide || null), r: Math.min(0.75, h * 0.2) }));
  sideBays(acc, S.back, divX, yB, h, () => 'panel', (i, n) => ({ win: i === midX || n === 1 ? (win.back || win.front || 'round') : null, r: Math.min(0.75, h * 0.2) }));
  for (const s of [S.right, S.left]) sideBays(acc, s, divZ, yB, h, () => 'panel', (i, n) => ({ win: i === midZ || n === 1 ? (win.ends || 'square') : (win.endSide || null), r: Math.min(0.6, h * 0.17) }));
  for (const x of divX) for (const z of [R.zF, R.zB]) acc.add('beam', boxB(0.3, h, 0.3, x, yB, z));
  for (const z of divZ) for (const x of [R.xL, R.xR]) acc.add('beam', boxB(0.3, h, 0.3, x, yB, z));
  for (const [x, z, nx, nz] of [[R.xL, R.zF, -0.707, 0.707], [R.xR, R.zF, 0.707, 0.707], [R.xR, R.zB, 0.707, -0.707], [R.xL, R.zB, -0.707, -0.707]]) keBracket(acc, x, z, yB + h - 0.05, nx, nz, (t.low?.over || 1.4) * 0.6);
  // xà đầu tầng
  for (const [ax, az, bx, bz] of [[R.xL, R.zF, R.xR, R.zF], [R.xL, R.zB, R.xR, R.zB], [R.xL, R.zB, R.xL, R.zF], [R.xR, R.zB, R.xR, R.zF]]) acc.add('beam', beam(V(ax, yB + h + 0.15, az), V(bx, yB + h + 0.15, bz), 0.3, 0.36));
  return yB + h;
}
/** công trình đặt trên đài gạch (lầu Ngũ Phụng trên đài Ngọ Môn): đài + nữ tường gạch hoa + bậc sau 21 cấp × 0,22 */
function onDai(spec) {
  const { dai, ...rest } = spec, inner = vnBuild(rest), acc = new Acc(), H = dai.h, m = dai.m ?? 1.0;
  const PW = inner.info.PW + 2 * m, PDb = inner.info.PD + 2 * m, n = dai.n || 21, tread = 0.3, run = n * tread, sw = dai.stairW || 3.2;
  acc.add('brickGrey', tbox(PW, H - 0.6, PDb, 0, 0.6, 0, 1.2)); acc.add('stone', tbox(PW + 0.3, 0.6, PDb + 0.3, 0, 0, 0, 2));
  acc.add('stoneDark', tbox(PW + 0.16, 0.14, PDb + 0.16, 0, H - 0.14, 0, 1)); acc.add('court', tbox(PW - 0.2, 0.02, PDb - 0.2, 0, H, 0, 0.76));
  acc.plat({ x: 0, z: 0, w: PW, d: PDb, top: H });
  // gờ chỉ + ô cuốn giả trên thân đài
  for (const [L, ry, x, z] of [[PW, 0, 0, PDb / 2], [PW, Math.PI, 0, -PDb / 2], [PDb, Math.PI / 2, PW / 2, 0], [PDb, -Math.PI / 2, -PW / 2, 0]]) put(acc, (t) => {
    t.add('stoneDark', boxB(L, 0.14, 0.12, 0, H - 0.9, 0.04));
    const k = Math.max(1, Math.floor(L / 3.4)); for (let i = 0; i < k; i++) { const u = -L / 2 + (L * (i + 0.5)) / k, arch = []; for (let a = 0; a <= 12; a++) { const th = Math.PI * (a / 12); arch.push([u + Math.cos(th) * 0.8, 2.4 + Math.sin(th) * 0.8]); } t.add('stoneDark', slabXY([[u + 0.8, 0.9], ...arch, [u - 0.8, 0.9]], 0.06, 0, 0, 0.06)); }
  }, ry, x, z);
  steps(acc, { x: 0, z: -PDb / 2, side: -1, w: sw, h: H, n, tread, rail: 'scroll' });
  // nữ tường lan can gạch hoa men quanh mặt đài, chừa miệng bậc sau
  const e = 0.25;
  put(acc, (t) => ganhRail(t, -PW / 2 + e, PW / 2 - e, H), 0, 0, PDb / 2 - e);
  put(acc, (t) => { ganhRail(t, -PW / 2 + e, -sw / 2 - 0.3, H); ganhRail(t, sw / 2 + 0.3, PW / 2 - e, H); }, Math.PI, 0, -PDb / 2 + e);
  for (const sx of [-1, 1]) put(acc, (t) => ganhRail(t, -PDb / 2 + e, PDb / 2 - e, H), sx * Math.PI / 2, sx * (PW / 2 - e), 0);
  put(acc, (t) => { for (const [k, l] of inner.acc.parts) for (const g of l) t.add(k, g); for (const p of inner.acc.plats) t.plat(p); }, 0, 0, 0, H);
  const ex = platExtent(acc.plats), info = { ...inner.info, PW: ex.w, PD: ex.d, cx: ex.cx, cz: ex.cz, ph: H + inner.info.ph, top: inner.info.top + H, dai: H, kind: 'lau-dai', front: PDb / 2 };
  info.eave = inner.info.eave + H;
  return { acc, info };
}

// ---------------------------------------------------------------- HỒI LANG (hành lang có mái hai dốc)
/** spec: { path: [[x, z], …], w, colH, bay, ph, tile } */
export function vnLang(spec) {
  const acc = spec.acc || new Acc(), P = spec.path, w = spec.w || 3, colH = spec.colH || 2.8, ph = spec.ph ?? 0.3, T = spec.tile || 'Green', s = spec.s ?? 0.5, over = 0.8;
  for (let i = 0; i < P.length - 1; i++) {
    const [ax, az] = P[i], [bx, bz] = P[i + 1], L0 = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / L0, dz = (bz - az) / L0;
    const e0 = i > 0 ? w / 2 : 0, e1 = i < P.length - 2 ? w / 2 : 0, L = L0 + e0 + e1, mx = (ax + bx) / 2 + dx * (e1 - e0) / 2, mz = (az + bz) / 2 + dz * (e1 - e0) / 2;
    put(acc, (t) => {
      t.add('stone', tbox(L, ph, w + 0.6, 0, 0, 0, 2)); t.add('court', tbox(L - 0.1, 0.02, w + 0.4, 0, ph, 0, 0.76)); t.plat({ x: 0, z: 0, w: L, d: w + 0.6, top: ph });
      const n = Math.max(1, Math.round(L0 / (spec.bay || 3.2)));
      for (let k = 0; k <= n; k++) for (const sz of [-1, 1]) { const u = -L / 2 + e0 + (L0 * k) / n; vnCol(t, u, sz * w / 2, ph, colH, 0.3, 'col'); }
      for (const sz of [-1, 1]) { t.add('beam', boxB(L, 0.34, 0.26, 0, ph + colH, sz * w / 2)); t.add('gold', boxB(L, 0.05, 0.28, 0, ph + colH - 0.06, sz * w / 2)); if (spec.rail !== false) woodRail(t, -L / 2 + e0 + 0.2, L / 2 - e1 - 0.2, ph, { h: 0.55, step: 0.4 }); }
      const y0 = ph + colH + 0.38 - 0.6 * s * over, rise = s * (0.6 * over + w / 2);
      slopeRoof(t, { xL: -L / 2 - 0.4, xR: L / 2 + 0.4, zF: w / 2 + over, zB: -w / 2 - over }, { xL: -L / 2 - 0.4, xR: L / 2 + 0.4, zF: 0, zB: 0 }, y0, y0 + rise, { tile: T, over, ends: false, rib: 0.45 });
      t.add(`cap${T}`, tubeXL(L + 0.9, 0.17, 0, y0 + rise + 0.14, 0));
      for (const u of [-L / 2 + 0.05, L / 2 - 0.05]) t.add('beam', slabXY([[-w / 2, ph + colH + 0.15], [w / 2, ph + colH + 0.15], [0, y0 + rise - 0.1]], 0.12, u, 0, 0, Math.PI / 2));
      for (let k = 0; k <= n; k++) { const u = -L / 2 + e0 + (L0 * k) / n; t.add('beam', boxB(0.24, 0.3, w, u, ph + colH, 0)); t.add('wood', boxB(0.2, rise * 0.7, 0.2, u, ph + colH + 0.3, 0)); }
    }, Math.atan2(-dz, dx), mx, mz);
  }
  const xsP = P.map((p) => p[0]), zsP = P.map((p) => p[1]);
  return { acc, info: { W: Math.max(...xsP) - Math.min(...xsP) + w, D: Math.max(...zsP) - Math.min(...zsP) + w, PW: Math.max(...xsP) - Math.min(...xsP) + w + 0.6, PD: Math.max(...zsP) - Math.min(...zsP) + w + 0.6, ph, top: ph + colH + 2.2, kind: 'lang' } };
}
const tubeXL = (L, r, x, y, z) => new THREE.CylinderGeometry(r, r, L, 8).rotateZ(Math.PI / 2).translate(x, y, z);

// ---------------------------------------------------------------- BIA, TRỐNG, CHUÔNG
export function stele(acc, x, z, ry = 0) {
  put(acc, (t) => {
    t.add('stone', tbox(1.3, 0.5, 0.8, 0, 0, 0, 1)); t.add('stoneDark', tbox(0.95, 1.9, 0.26, 0, 0.5, 0, 1));
    t.add('stoneDark', slabXY([[-0.6, 0], [0.6, 0], [0.45, 0.32], [0, 0.42], [-0.45, 0.32]], 0.34, 0, 2.4, 0));
  }, ry, x, z);
}
export function drum(acc, x, y, z) {
  acc.add('wood', boxB(0.12, 1.5, 0.12, x - 0.6, y, z)); acc.add('wood', boxB(0.12, 1.5, 0.12, x + 0.6, y, z)); acc.add('wood', boxB(1.4, 0.12, 0.2, x, y + 0.3, z));
  acc.add('beam', new THREE.CylinderGeometry(0.62, 0.62, 0.8, 18).rotateX(Math.PI / 2).translate(x, y + 1.15, z));
  acc.add('skin', new THREE.CylinderGeometry(0.6, 0.6, 0.84, 18).rotateX(Math.PI / 2).scale(1, 1, 1).translate(x, y + 1.15, z).scale(1, 1, 1));
}
export function bell(acc, x, y, z) {
  for (const sx of [-1, 1]) acc.add('beam', boxB(0.2, 3.0, 0.2, x + sx * 0.9, y, z)); acc.add('beam', boxB(2.2, 0.24, 0.26, x, y + 2.9, z));
  acc.add('bronze', lathe([[0.001, 1.8], [0.25, 1.8], [0.42, 1.65], [0.47, 1.2], [0.5, 0.6], [0.56, 0.2], [0.6, 0], [0.001, 0]].map(([r, v]) => [r, v]), x, y + 0.95, z, 18));
  acc.add('bronze', boxB(0.2, 0.25, 0.08, x, y + 2.72, z));
}

// ---------------------------------------------------------------- LẦU 10 TẦNG (vuông, kiểu Hiển Lâm Các xếp chồng trên đài Ngọ Môn)
/**
 * ts = towerSpec(style) — n = 4 bắt buộc (07 › lầu §3: lầu / gác cung đình vuông, KHÔNG bát giác).
 * Mỗi tầng: vách «thượng song hạ bản» ở a (cửa giữa trước / sau, cửa sổ tròn trước / sau, vuông hai bên, quạt / khánh xen kẽ),
 * hiên quanh (cột son đúng vị trí va chạm columnRing), lan can gỗ con tiện, mái hiên hoàng lưu ly; ở 3 bước thu gian
 * (tầng 2, 5, 8) mái lớn + dải cổ diêm; Vọng Đài: phương đình 16 cột mái chồng diêm, bờ nóc lưỡng long chầu hồ lô.
 */
export function vnTower(ts, { tile = 'Yellow', cdFloors = [1, 4, 7] } = {}) {
  const acc = new Acc(), FH = ts.FH, P = ts.podium, pa = P.a, H = P.y;
  // --- đài: thân gạch vồ, chân đá Thanh, gờ, ô cuốn giả, nữ tường gạch hoa men; bậc trước khớp va chạm (towerCollision)
  acc.add('brickGrey', tbox(2 * pa, H - 0.7, 2 * pa, 0, 0.7, 0, 1.2)); acc.add('stone', tbox(2 * pa + 0.4, 0.7, 2 * pa + 0.4, 0, 0, 0, 2));
  acc.add('stoneDark', tbox(2 * pa + 0.24, 0.18, 2 * pa + 0.24, 0, H - 0.18, 0, 1)); acc.add('court', tbox(2 * pa - 0.3, 0.02, 2 * pa - 0.3, 0, H, 0, 0.76));
  acc.plat({ x: 0, z: 0, w: 2 * pa, d: 2 * pa, top: H });
  for (const [ry, x, z] of [[0, 0, pa], [Math.PI, 0, -pa], [Math.PI / 2, pa, 0], [-Math.PI / 2, -pa, 0]]) put(acc, (t) => {
    t.add('stoneDark', boxB(2 * pa, 0.16, 0.14, 0, H - 1.0, 0.05));
    const k = 7; for (let i = 0; i < k; i++) { const u = -pa + (2 * pa * (i + 0.5)) / k; if (ry === 0 && Math.abs(u) < P.stairW / 2 + 1) continue; const arch = []; for (let a = 0; a <= 14; a++) { const th = Math.PI * (a / 14); arch.push([u + Math.cos(th) * 1.3, 2.3 + Math.sin(th) * 1.3]); } t.add('stoneDark', slabXY([[u + 1.3, 0.9], ...arch, [u - 1.3, 0.9]], 0.08, 0, 0, 0.06)); t.add('brickGrey', slabXY([[u + 1.05, 0.9], ...arch.map(([a, b]) => [u + (a - u) * 0.8, 2.3 + (b - 2.3) * 0.8]), [u - 1.05, 0.9]], 0.06, 0, 0, 0.1)); }
  }, ry, x, z);
  for (let i = 1; i <= P.steps; i++) { const z = pa + P.run - (i - 0.5) * P.tread; acc.add('stoneDark', tbox(P.stairW, i * P.rise, P.tread, 0, 0, z, 1)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top: i * P.rise }); }
  const sw = P.stairW / 2;
  for (const sx of [-1, 1]) { // thành bậc rồng
    const x = sx * (sw + 0.35); acc.add('stone', beam(V(x, H + 0.45, pa), V(x, 0.5, pa + P.run - 0.2), 0.62, 0.55)); acc.add('stone', tbox(0.62, H * 0.45, P.run, x, 0, pa + P.run / 2, 1));
    acc.add('stone', slabXY([[0, 0], [1.1, 0], [1.3, 0.3], [1.2, 0.8], [1.45, 1.1], [1.3, 1.35], [1.0, 1.25], [0.8, 0.95], [0.4, 0.85], [0, 0.85]], 0.6, x, 0, pa + P.run - 1.2, -Math.PI / 2));
  }
  { const e = pa - 0.3; put(acc, (t) => { ganhRail(t, -e, -sw - 0.7, H, { h: 1.1 }); ganhRail(t, sw + 0.7, e, H, { h: 1.1 }); }, 0, 0, e); put(acc, (t) => ganhRail(t, -e, e, H, { h: 1.1 }), Math.PI, 0, -e); for (const sx of [-1, 1]) put(acc, (t) => ganhRail(t, -e, e, H, { h: 1.1 }), sx * Math.PI / 2, sx * e, 0); }
  // --- các tầng
  const sq = (a) => ({ xL: -a, xR: a, zF: a, zB: -a });
  const ringSlab = (aIn, aOut, y, t, key) => { const s = new THREE.Shape([[-aOut, -aOut], [aOut, -aOut], [aOut, aOut], [-aOut, aOut]].map(([x, z]) => new THREE.Vector2(x, z))); s.holes.push(new THREE.Path([[-aIn, -aIn], [-aIn, aIn], [aIn, aIn], [aIn, -aIn]].map(([x, z]) => new THREE.Vector2(x, z)))); const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, y, 0); acc.add(key, g); };
  const gian = (k) => (k < 2 ? 9 : k < 5 ? 7 : k < 8 ? 5 : 3);
  const bayW = (nb, L) => { const h = (nb - 1) / 2, w = []; for (let i = 0; i < nb; i++) { const d = Math.abs(i - h); w.push(i === 0 || i === nb - 1 ? 0.62 : d === 0 ? 1 : d === 1 ? 0.92 : 0.84); } const s = sum(w); return w.map((x) => (x * L) / s); };
  const nf = ts.floors.length;
  ts.floors.forEach((f, k) => {
    const y = f.y, a = f.a, sA = f.slabA, cd = cdFloors.includes(k), cdH = 0.9;
    const rIn = (k < nf - 1 ? ts.floors[k + 1].slabA : ts.deck.a + 0.25) - 0.05;
    const yTop = y + FH - 0.45 - (cd ? cdH : 0), over = cd ? 2.4 : 2.1, s = cd ? 0.5 : 0.42;
    const E = sq(sA + over), run = sA + over - rIn, oo = Math.min(over, 0.6 * run), yE = yTop - s * (0.6 * oo + run - oo);
    const roofY = (r) => { const dd = sA + over - r; return dd <= oo ? yE + s * 0.6 * dd : yE + s * (0.6 * oo + dd - oo); };
    // sàn hiên (vành) — tầng trệt đứng trên đài
    if (k) { ringSlab(a - 0.35, sA, y, 0.4, 'wood'); for (const [ry, x, z] of [[0, 0, sA], [Math.PI, 0, -sA], [Math.PI / 2, sA, 0], [-Math.PI / 2, -sA, 0]]) put(acc, (t) => { t.add('beam', bandX(2 * sA + 0.1, 0.42, 0.08, 0, y - 0.43, 0.04, 1)); t.add('gold', boxB(2 * sA + 0.12, 0.05, 0.1, 0, y - 0.1, 0.05)); }, ry, x, z); }
    else ringSlab(a - 0.35, sA, y + 0.03, 0.12, 'stoneDark');
    // vách tầng ở a: gian thu theo bậc 9 → 7 → 5 → 3 nhịp (7 → 5 → 3 → 1 gian)
    const bw = bayW(gian(k), 2 * a), divs = [-a]; for (const w of bw) divs.push(divs[divs.length - 1] + w);
    const ci = Math.floor(bw.length / 2), hw = FH - 0.4, dH = 3.3;
    const shapes = ['fan', 'khanh'];
    for (const [ry, x, z, face] of [[0, 0, a, 'front'], [Math.PI, 0, -a, 'back'], [Math.PI / 2, a, 0, 'side'], [-Math.PI / 2, -a, 0, 'side']]) put(acc, (t) => {
      for (let i = 0; i < bw.length; i++) {
        const u0 = divs[i] + 0.15, u1 = divs[i + 1] - 0.15, main = face !== 'side';
        if (i === ci && main) doorBay(t, u0, u1, y, dH + 0.6, { open: true, lienBa: 0.55 });
        else if (i === ci) panelBay(t, u0, u1, y, dH + 0.6, { win: 'square', r: 0.7 });
        else panelBay(t, u0, u1, y, dH + 0.6, { win: main ? (Math.abs(i - ci) === 1 ? 'round' : shapes[i % 2]) : (Math.abs(i - ci) === 1 ? 'square' : shapes[i % 2]), r: Math.min(0.62, (u1 - u0) * 0.22) });
        t.add('lienBa', bandX(u1 - u0, hw - dH - 0.6 - 0.2, 0.1, (u0 + u1) / 2, y + dH + 0.6, 0, 1.6));
      }
      for (const u of divs) t.add('beam', boxB(0.34, hw, 0.34, u, y, 0));
      t.add('beam', boxB(2 * a + 0.3, 0.22, 0.36, 0, y + hw - 0.22, 0));
    }, ry, x, z);
    // cột hiên (đúng vị trí va chạm), xà, kẻ
    const rc = sA - 0.7, colTop = roofY(rc) - y - 0.32;
    for (const [x, z] of columnRing(4, rc, ts.colStep || 3.6)) vnCol(acc, x, z, y, colTop, 0.56, 'col');
    for (const [ry, x, z] of [[0, 0, rc], [Math.PI, 0, -rc], [Math.PI / 2, rc, 0], [-Math.PI / 2, -rc, 0]]) put(acc, (t) => { t.add('beam', boxB(2 * rc + 0.3, 0.36, 0.3, 0, y + colTop - 0.2, 0)); t.add('gold', boxB(2 * rc + 0.32, 0.05, 0.32, 0, y + colTop - 0.3, 0)); }, ry, x, z);
    for (const [x, z] of columnRing(4, rc, ts.colStep || 3.6)) { const ax = Math.abs(x), az = Math.abs(z), nx = ax >= az - 0.01 ? Math.sign(x) : 0, nz = az >= ax - 0.01 ? Math.sign(z) : 0, L = Math.hypot(nx, nz) || 1; keBracket(acc, x, z, y + colTop - 0.2, nx / L, nz / L, Math.min(1.6, over * 0.65)); }
    // lan can gỗ con tiện mép hiên (tầng trệt chừa lối trước / sau ± 2,2 m — khớp va chạm)
    const re = sA - 0.15;
    for (const [ry, x, z, open] of [[0, 0, re, k === 0], [Math.PI, 0, -re, k === 0], [Math.PI / 2, re, 0, false], [-Math.PI / 2, -re, 0, false]]) put(acc, (t) => { if (open) { woodRail(t, -re, -2.2, y); woodRail(t, 2.2, re, y); } else woodRail(t, -re, re, y); }, ry, x, z);
    // mái hiên tầng (hoàng lưu ly), cổ diêm ở bước thu gian
    slopeRoof(acc, E, sq(rIn), yE, yTop, { tile, over, dao: 'dragon', daoS: cd ? 1.15 : 0.9, rib: 0.55, hipW: 0.34 });
    if (cd) coDiem(acc, sq(rIn), yTop - 0.04, cdH + 0.02, 0.24);
  });
  // --- Vọng Đài: vành sàn, lan can, phương đình 16 cột (12 cột quân + 4 cột cái), mái chồng diêm, lưỡng long chầu hồ lô
  const Dk = ts.deck, yd = Dk.y, last = ts.floors[nf - 1];
  ringSlab(last.a - 0.35, Dk.a + 0.25, yd, 0.4, 'wood');
  for (const [ry, x, z] of [[0, 0, Dk.a + 0.05], [Math.PI, 0, -Dk.a - 0.05], [Math.PI / 2, Dk.a + 0.05, 0], [-Math.PI / 2, -Dk.a - 0.05, 0]]) put(acc, (t) => { woodRail(t, -Dk.a, Dk.a, yd, { h: 1.05 }); t.add('beam', bandX(2 * Dk.a + 0.6, 0.42, 0.08, 0, yd - 0.43, 0.24, 1)); }, ry, x, z);
  const rq = Dk.a - 0.4, rc = 4.4, cq = 3.3, lo = { over: 1.8, s: 0.42 };
  const qs = [-rq, -rq / 3, rq / 3, rq];
  for (const x of qs) for (const z of qs) if (Math.abs(x) > rq - 0.01 || Math.abs(z) > rq - 0.01) vnCol(acc, x, z, yd, cq, 0.5, 'col');
  for (const [ry, x, z] of [[0, 0, rq], [Math.PI, 0, -rq], [Math.PI / 2, rq, 0], [-Math.PI / 2, -rq, 0]]) put(acc, (t) => { t.add('beam', boxB(2 * rq + 0.3, 0.38, 0.3, 0, yd + cq, 0)); }, ry, x, z);
  for (const x of qs) for (const z of qs) if (Math.abs(x) > rq - 0.01 || Math.abs(z) > rq - 0.01) { const nx = Math.abs(x) > rq - 0.01 ? Math.sign(x) : 0, nz = Math.abs(z) > rq - 0.01 ? Math.sign(z) : 0, L = Math.hypot(nx, nz); keBracket(acc, x, z, yd + cq - 0.1, nx / L, nz / L, 1.1); }
  const E0 = sq(rq + lo.over), y0 = yd + cq + 0.38 - 0.6 * lo.s * lo.over, runD = rq + lo.over - rc, y1 = y0 + lo.s * (0.6 * lo.over + runD - lo.over);
  slopeRoof(acc, E0, sq(rc), y0, y1, { tile, over: lo.over, dao: 'dragon', daoS: 1.25, rib: 0.55 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) vnCol(acc, sx * rc, sz * rc, yd, y1 + 0.9 - yd, 0.6, 'col');
  coDiem(acc, sq(rc), y1 - 0.05, 0.95);
  const top = topRoofs(acc, { tile, orn: 'longGourd', dao: 'dragon', daoS: 1.1, truss: false, top: { over: 1.4, s: 0.72, ridgeH: 0.8, ornS: 1.25, minR: 0.36 } }, sq(rc), y1 + 0.95, tile, 0, [], []);
  return { acc, info: { W: 2 * pa, D: 2 * pa, PW: 2 * pa, PD: 2 * pa + P.run, ph: H, top, eave: ts.floors[0].y + 3.6, n: ts.n, floors: nf, kind: 'tower' } };
}
export { ornament, daoOrn, box, cyl };

// ---------------------------------------------------------------- GHÉP nhiều khối (xoay được); chiếm đất tính từ mặt đi được (nền, bậc)
export function vnCompound(spec, build) {
  const acc = new Acc(); let top = 0;
  let first = null;
  for (const part of spec.parts) {
    const { acc: a, info } = build(part); if (!first) first = info;
    put(acc, (t) => { for (const [k, l] of a.parts) for (const g of l) t.add(k, g); for (const p of a.plats) t.plat(p); }, part.ry || 0, part.at[0], part.at[1]);
    top = Math.max(top, info.top || 0);
  }
  const e = platExtent(acc.plats);
  return { acc, info: { ...first, W: e.w, D: e.d, PW: e.w, PD: e.d, cx: e.cx, cz: e.cz, top, kind: 'compound' } };
}
/** chiếm đất (nền + bậc) = bao các mặt đi được */
export function platExtent(plats) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const p of plats) {
    const c = Math.cos(p.ry || 0), s = Math.sin(p.ry || 0), hw = p.poly ? p.a : p.w / 2, hd = p.poly ? p.a : p.d / 2;
    for (const [u, v] of [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]]) { const x = p.x + c * u + s * v, z = p.z - s * u + c * v; x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  }
  return { w: x1 - x0, d: z1 - z0, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2 };
}
