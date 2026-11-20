// ============================================================================
//  HỌ MUGHAL cho biệt phủ (docs/bietphu/mughal-tudor.md) — bộ cấu kiện Mughal của tiên phủ (tienphu/arch/mg-kit.js,
//  mg-build.js — CHỈ import) + vật liệu lặp theo mét (archcity/mats.js: cẩm thạch, sa thạch đỏ = stone nhuộm đỏ).
//  Nguyên mẫu (docs/tienphu-nghiencuu/09-mughal.md + nguồn ngoài, xem doc):
//   · chính đường: lăng Itimad-ud-Daulah (Agra 1622–28 — khối vuông thấp cẩm thạch trắng, tháp góc bát giác đội chhatri,
//     khảm pietra dura) + mặt pishtaq hai phía của Diwan-i-Khas / lăng Humayun (iwan giữa, hai bên lưới ô vòm theo tầng)
//     + vòm bầu trên trống (Taj, thu nhỏ theo nhà ở). Tầng 4,2 m, cửa iwan 2,8 × 3,4 m, ô cửa jali cao 2,3–2,9 m.
//   · nhà khách: cổng phụ lăng Humayun / haveli Rambagh — sa thạch đỏ viền cẩm thạch trắng (Koch: chỉ nhà chủ trắng toàn phần).
//   · tháp: minaret Taj (3 ban công ở 0,26 / 0,51 / 0,81 H, chhatri đỉnh) trên bệ bát giác sa thạch.
//   · đình: chhatri bát giác 8 trụ Shahjahani (Shalimar Bagh / Rambagh) trên bệ thấp.
//   · cổng: Darwaza-i Rauza thu nhỏ — pishtaq hai mặt, hành lang vòm xuyên, tháp góc bát giác đội chhatri, hàng chhatri trên đỉnh.
//  Khuôn lô (estatekit.js): vách trên chu vi w × d, cửa iwan giữa +z (và −z nếu back) thông, sàn trong ở b.plinth trống.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB } from '../tienphu/arch/kit.js';
import {
  Face, wall, frame, archRib, archDress, archCurve, extXY, slabXZ, oct, lathe2, ngon, chhajja, parapet,
  guldasta, bulbProf, lotusFinial, profR, chhatri, minaret, finishUV, mgMats, sweepXY,
} from '../tienphu/arch/mg-kit.js';
import { pishtaq, twoTier } from '../tienphu/arch/mg-build.js';
import { tiled, retex, consolidate } from './mats.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// khoá theo thứ bậc màu: nhà chủ cẩm thạch trắng (viền khảm đen, spandrel pietra dura); nhà phụ sa thạch đỏ viền trắng
const KW = { wall: 'marble', frame: 'black', band: 'callig', spand: 'pdura', spand2: 'marble', shade: 'shade', jali: 'jali', vault: 'tileVault', dado: 'carveM', trim: 'marble', guld: 'marble', bud: 'marble', dome: 'domeW', floor: 'paveW', base: 'plinthR', panel: 'carveM', cons: 'carveM' };
const KR = { wall: 'red', frame: 'inlay', band: 'callig', spand: 'pdura', spand2: 'red', shade: 'shadeR', jali: 'jaliR', vault: 'tileVaultR', dado: 'carveR', trim: 'red', guld: 'zigzag', bud: 'inlay', dome: 'domeW', floor: 'pave', base: 'plinthR', panel: 'carveR', cons: 'carveR' };
// sau finishUV (UV theo khoá gốc của kit) đổi tên khoá chi tiết → «carve…» để bậc vừa (> 75 m) tự bỏ (MID_DROP)
const REKEY = { black: 'carveB', callig: 'carveC', pdura: 'carveP', dado: 'carveD', inlay: 'carveW', gold: 'carveG' };
function rekey(acc) { const out = new Acc(); out.plats = acc.plats; for (const [k, l] of acc.parts) for (const g of l) out.add(REKEY[k] || k, g); return out; }

let OV = null;
/** vật liệu lặp theo mét (≥ 256 px/m) thay cho texture canvas 256 px của kit trên mọi mặt lớn */
function over() {
  if (OV) return OV;
  const marble = tiled('marble', '#f1ede4', { rough: 0.55, bump: 0.5 }), red = tiled('stone', '#b67e66', { rough: 0.95 }), redDk = tiled('stone', '#9c6553', { rough: 1 });
  OV = {
    marble, domeW: tiled('marble', '#f7f4ee', { rough: 0.45, bump: 0.4 }), carveW: tiled('marble', '#ece6d8', { rough: 0.5, bump: 0.4 }),
    shade: tiled('marble', '#c9c2b4', { rough: 0.7, bump: 0.4 }), red, redDk, shadeR: tiled('stone', '#82503f', { rough: 1 }),
    plinthR: redDk, carveR: redDk, marbleBlk: tiled('stone', '#efebe2', { rough: 0.6, bump: 0.7 }), stepR: tiled('stone', '#a87260', { rough: 1 }), pave: tiled('stone', '#a87462', { rough: 1 }), paveW: tiled('marble', '#e3ddd0', { rough: 0.6, bump: 0.5 }),
  };
  OV.carveS = OV.shade; OV.carveM = OV.marble;
  return OV;
}
const matsOf = () => { const M = mgMats(); return { ...M, carveB: M.black, carveC: M.callig, carveP: M.pdura, carveD: M.dado, carveG: M.gold, ...over() }; };
const post = (g) => { retex(g, over()); return consolidate(g); };
const done = (acc, info) => { finishUV(acc); return { acc: rekey(acc), mats: matsOf(), post, info }; };

// ---------------------------------------------------------------- cấu kiện nhỏ
/** bậc thang (mỗi bậc một mặt đi được) + hai má bậc; trả chiều dài chạy */
function steps(acc, key, { x, z, nx, nz, w, h, tread = 0.32, cheek = 'plinthR' }) {
  const n = Math.max(2, Math.round(h / 0.16)), rise = h / n, ry = Math.atan2(nx, nz);
  for (let i = 0; i < n; i++) { const dist = tread * (n - i - 0.5), cx = x + nx * dist, cz = z + nz * dist, top = rise * (i + 1); acc.add(key, box(w, top, tread + 0.01, cx, top / 2, cz, ry)); acc.plat({ x: cx, z: cz, w, d: tread + 0.02, ry, top }); }
  for (const sd of [-1, 1]) { const ox = nz * sd * (w / 2 + 0.3), oz = -nx * sd * (w / 2 + 0.3), L = n * tread; acc.add(cheek, box(0.6, h * 0.6, L, x + ox + (nx * L) / 2, h * 0.3, z + oz + (nz * L) / 2, ry)); acc.add(cheek, box(0.7, 0.12, L, x + ox + (nx * L) / 2, h * 0.6 + 0.06, z + oz + (nz * L) / 2, ry)); }
  return n * tread;
}
/** biên dạng (z, y) đùn dọc x từ x0 tới x1 trong mặt F */
function alongX(F, key, prof, x0, x1) { const g = extXY(prof, [], x1 - x0); g.rotateY(-Math.PI / 2); g.translate(x0, 0, 0); F.add(key, g); }
/** chhajja thẳng (mái đua đá dốc trên consol) dọc mặt F từ x0 tới x1, mép trong ở cao y, vươn out */
function chRun(F, key, keyC, x0, x1, y, out, { th = 0.13, step = 1.15, cons = true } = {}) {
  const drop = out * 0.36;
  alongX(F, key, [[-0.12, y], [out, y - drop], [out, y - drop - th], [-0.12, y - th * 1.8]], x0, x1);
  if (!cons) return;
  const m = Math.max(1, Math.round((x1 - x0) / step));
  for (let k = 0; k < m; k++) { const xc = x0 + ((x1 - x0) * (k + 0.5)) / m; alongX(F, keyC, [[0, y - th * 1.6], [out * 0.72, y - drop * 0.72 - th], [out * 0.72, y - drop * 0.72 - th - 0.14], [0.25, y - th * 1.6 - out * 0.85], [0, y - th * 1.6 - out * 0.85]], xc - 0.08, xc + 0.08); }
}
/** tháp góc bát giác (guldasta lớn) từ y0 tới y1: chân giật, vành tầng, chhajja đỉnh, chhatri */
function cornerTurret(acc, K, { x, z, a, y0, y1, rings = [], chh, cap = false }) {
  acc.add(K.wall, oct([[0.001, 0], [a + 0.14, 0], [a + 0.14, 0.55], [a, 0.68], [a, y1 - y0], [0.001, y1 - y0]], x, y0, z));
  for (const y of rings) acc.add(K.trim, oct([[0.001, 0], [a + 0.09, 0], [a + 0.09, 0.22], [0.001, 0.22]], x, y - 0.11, z));
  chhajja(acc, K.trim, ngon(8, a, x, z), y1, Math.max(0.45, a * 0.32), { step: 0.8, consoles: a > 1.1 });
  acc.add(K.trim, oct([[0.001, 0], [a + 0.02, 0], [a + 0.02, 0.3], [0.001, 0.3]], x, y1, z));
  if (cap) { // nắp vòm bầu đặc trên tháp (không trụ) — guldasta lớn
    const R = a * 0.92, Hh = a * 1.5, bp = bulbProf(a * 0.8, R, Hh, { mx: 0.3, rTop: R * 0.1 });
    acc.add('domeW', lathe2(bp.filter((_, i) => i % 2 === 0 || i === bp.length - 1), 10, 0, x, y1 + 0.3, z));
    acc.add('gold', lathe2([[0.001, 0], [0.09, 0], [0.04, 0.3], [0.1, 0.45], [0.001, 0.8]], 6, 0, x, y1 + 0.3 + Hh * 0.97, z));
    return y1 + 0.3 + Hh + 0.8;
  }
  return chhatri(acc, { x, y: y1 + 0.3, z, ...chh, keys: { body: K.trim === 'red' ? 'red' : 'marble', dome: 'domeW', frame: K.trim, panel: K.frame, gold: 'gold' } });
}
/** trống + vòm bầu + sen + finial (vòm nhà ở: trống thấp có ô vòm mù) */
function domeOn(acc, K, { x = 0, z = 0, y, rd, hd, R, H, fin, panels = 12 }) {
  acc.add(K.trim, lathe2([[0.001, 0], [rd + 0.4, 0], [rd + 0.4, 0.35], [rd, 0.45], [0.001, 0.45]], 24, 0, x, y, z));
  acc.add(K.wall, lathe2([[0.001, 0], [rd, 0], [rd, hd], [0.001, hd]], 24, 0, x, y + 0.45, z));
  for (let i = 0; i < panels; i++) {
    const phi = ((i + 0.5) * 2 * Math.PI) / panels, F = Face.at(acc, x + Math.sin(phi) * rd, 0, z + Math.cos(phi) * rd, Math.sin(phi), Math.cos(phi)), w = ((2 * Math.PI * rd) / panels) * 0.5, ys = y + 0.85;
    const poly = [[-w / 2, ys], [w / 2, ys], [w / 2, ys + hd - 1.2 - w * 0.5], ...archCurve(0, ys + hd - 1.2 - w * 0.5, w / 2, w * 0.5).slice(1, -1), [-w / 2, ys + hd - 1.2 - w * 0.5]];
    const g = extXY(poly, [], 0.1); g.translate(0, 0, 0.04); F.add(K.shade, g);
  }
  acc.add(K.trim, lathe2([[0.001, 0], [rd + 0.05, 0], [rd + 0.32, 0.22], [rd + 0.32, 0.42], [0.001, 0.42]], 24, 0, x, y + 0.45 + hd, z));
  const yb = y + 0.87 + hd, bp = bulbProf(rd * 0.96, R, H, { mx: 0.3, rTop: R * 0.1 });
  acc.add(K.dome, lathe2(bp, 24, 0, x, yb, z));
  return lotusFinial(acc, { x, y: yb + H * 0.975, z, rCap: profR(bp, H * 0.975), rAt: (yy) => profR(bp, yy - yb), petalL: R * 0.38, n: 14, fin, keyPetal: K.dome, seg: 10 });
}

/** một dải mặt đứng x0..x1 (mặt F) chia nb gian × n tầng: mỗi gian một ô vòm (tầng trệt vòm nhiều múi + jali, tầng trên cửa sổ
 *  jharokha jali), khung panel khảm, gờ tầng; chhajja trên tầng trệt và ở diềm mái */
function facadeRun(F, K, { x0, x1, P, n, sh, t = 0.9, bayW = 3.9, low = 'jali', cuspsLow = 5 }) {
  const L = x1 - x0; if (L < 0.8) return;
  const nb = Math.max(1, Math.round(L / bayW)), bw = L / nb;
  for (let i = 0; i < n; i++) {
    const y0 = P + i * sh, y1 = y0 + sh, ops = [];
    for (let j = 0; j < nb; j++) {
      const cx = x0 + bw * (j + 0.5);
      if (bw < 1.6) continue;
      if (i === 0) { const w = Math.min(2.0, bw * 0.5); ops.push({ cx, y: y0 + 0.5, w, hs: sh - 0.5 - 1.05 - w / 2, rise: w / 2, kind: low, back: K.jali, d: 0.35, cusps: cuspsLow }); }
      else { const w = Math.min(1.5, bw * 0.4); ops.push({ cx, y: y0 + 0.95, w, hs: sh - 0.95 - 1.05 - w / 2, rise: w / 2, kind: 'jali', back: K.jali, d: 0.4, cusps: i === n - 1 ? 3 : 0 }); }
    }
    wall(F, K.wall, { x0, x1, y0, y1, t, ops, shade: K.shade, rim: 0.22 });
    for (const op of ops) archDress(F, op, { frame: K.frame, spand: K.spand });
    for (let j = 0; j < nb; j++) { const cx = x0 + bw * (j + 0.5); frame(F, K.panel, cx - bw / 2 + 0.16, cx + bw / 2 - 0.16, y0 + 0.22, y1 - 0.3, 0.07, 0.04); }
    if (i > 0) F.add(K.trim, boxB(L, 0.24, 0.2, (x0 + x1) / 2, y0 - 0.12, 0.1));
  }
  F.add(K.dado, boxB(L, 0.4, 0.06, (x0 + x1) / 2, P, 0.03));
  if (n > 1) chRun(F, K.trim, K.cons, x0, x1, P + sh - 0.02, 0.7);
  chRun(F, K.trim, K.cons, x0, x1, P + n * sh - 0.02, 0.95);
}

/** nền (w + 2,4) × (d + 2,4) cao P: khối sa thạch đỏ, panel khảm trắng, gờ mép, mặt lát; bậc giữa trước (và sau nếu back) */
function basePlinth(acc, K, b) {
  const PW = b.w + 2.4, PD = b.d + 2.4, h = b.plinth, sw = Math.min(6, b.w * 0.3);
  acc.add('plinthR', boxB(PW, h - 0.18, PD, 0, 0, 0));
  acc.add('plinthR', boxB(PW + 0.24, 0.3, PD + 0.24, 0, 0, 0));
  acc.add('stepR', boxB(PW + 0.14, 0.18, PD + 0.14, 0, h - 0.18, 0));
  acc.add(K.floor, boxB(PW - 0.1, 0.03, PD - 0.1, 0, h - 0.01, 0)); acc.plat({ x: 0, z: 0, w: PW, d: PD, top: h });
  // panel khảm cẩm thạch trên mặt bệ (Itimad-ud-Daulah): khung chữ nhật + vòm mù nông, chừa chỗ bậc
  if (h >= 1.2) for (const [nx, nz, L] of [[0, 1, PW], [0, -1, PW], [1, 0, PD], [-1, 0, PD]]) {
    const F = Face.at(acc, (nx * PW) / 2, 0, (nz * PD) / 2, nx, nz), n = Math.max(2, Math.round(L / 2.6)), pw = L / n;
    for (let i = 0; i < n; i++) {
      const cx = -L / 2 + pw * (i + 0.5); if (nz && (nz > 0 || b.back) && Math.abs(cx) < sw / 2 + 0.9) continue;
      frame(F, 'inlay', cx - pw / 2 + 0.2, cx + pw / 2 - 0.2, 0.42, h - 0.32, 0.1, 0.03, 0, true);
      if (h >= 2) { const s2 = pw * 0.21, ys = 0.42 + (h - 0.74) * 0.5, c = archCurve(cx, ys, s2, (h - 0.74) * 0.3); F.add('inlay', sweepXY([[cx + s2, 0.6], ...c, [cx - s2, 0.6]], 0.07, 0.04, 0.02)); }
    }
  }
  for (const sz of b.back ? [1, -1] : [1]) steps(acc, 'stepR', { x: 0, z: (sz * PD) / 2, nx: 0, nz: sz, w: sw, h });
}

// ============================================================================ NHÀ (chính đường / nhà khách)
function hall(styleId, S, b, opt = {}) {
  const villa = !!opt.villa, main = b.id === 'main' && !villa, K = main ? KW : KR, acc = new Acc();
  const hw = b.w / 2, hd = b.d / 2, P = b.plinth, H = b.h, n = Math.max(1, b.floors || Math.round(H / 4.2)), sh = H / n, yT = P + H, t = 0.9;
  basePlinth(acc, K, b);
  // pishtaq giữa (+z, và −z nếu back): khung nhô 0,4 m, cao vượt lan can; iwan nửa bát giác, cửa hậu 2,8 × 3,4 m mở
  const wP = clamp(b.w * 0.3, 7.4, 14), ow = clamp(wP * 0.56, 5.0, 7.6), apex = clamp(H * 0.78, 6.4, 10.4), proj = 0.45;
  const D = Math.min(clamp(ow * 0.45, 2.0, 3.3), hd / 2 + proj - 1.0 - 0.35);   // hốc iwan không lấn tia kiểm vách ở z = ±d/4
  const pTop = yT + (main ? 2.6 : 1.5), ta = main ? 1.3 : 0.95;
  const piO = { w: wP, y0: P, top: pTop, ow, apex, rise: ow * 0.5, t: 1.2, depth: D, ledge: sh, door: { w: 2.8, h: 3.4 }, gH: main ? 2.8 : 1.9, gd: main ? 0.72 : 0.56, band: main ? 0.62 : 0.5, dadoH: 0.45 };
  const sides = [{ sz: 1, pi: true }, { sz: -1, pi: !!b.back }];
  for (const { sz, pi } of sides) {
    const F = Face.at(acc, 0, 0, sz * hd, 0, sz);
    if (pi) {
      pishtaq(F.sub(0, 0, proj, 0, 1), K, piO);
      // lan can jali quanh nóc khối xây sau khung pishtaq (sân thượng nhỏ, như lưng pishtaq Humayun)
      const zF = hd + proj - 1.25, zB = hd + proj - 1.2 - (D + 0.8 - 1.2) + 0.15, x = wP / 2 - 0.15;
      parapet(acc, K.wall, [[-x, zF], [-x, zB], [x, zB], [x, zF]].map(([a, c]) => [a * sz, c * sz]), pTop, 0.7, 0.25, { panel: K.jali, closed: false });
    }
    const xs = pi ? wP / 2 : 0, xe = hw - ta * 0.6;
    if (pi) for (const sx of [-1, 1]) facadeRun(F, K, { x0: sx > 0 ? xs : -xe, x1: sx > 0 ? xe : -xs, P, n, sh, t });
    else facadeRun(F, K, { x0: -xe, x1: xe, P, n, sh, t });
    // lan can mái (jali thấp) — chừa khung pishtaq
    const segs = pi ? [[-hw, -wP / 2 + 0.1], [wP / 2 - 0.1, hw]] : [[-hw, hw]];
    for (const [a, c] of segs) parapet(acc, K.wall, [[a * sz, sz * (hd - 0.15)], [c * sz, sz * (hd - 0.15)]], yT, 0.85, 0.3, { panel: K.jali, closed: false });
  }
  for (const sx of [-1, 1]) {
    const F = Face.at(acc, sx * hw, 0, 0, sx, 0), ze = hd - ta * 0.6;
    facadeRun(F, K, { x0: -ze, x1: ze, P, n, sh, t });
    parapet(acc, K.wall, [[sx * (hw - 0.15), -hd], [sx * (hw - 0.15), hd]], yT, 0.85, 0.3, { panel: K.jali, closed: false });
  }
  // mái bằng (vỏ) + trần tầng trệt (chừa hốc iwan)
  const rect = [[-hw, hd], [hw, hd], [hw, -hd], [-hw, -hd]].reverse();
  acc.add(K.wall, slabXZ(rect, yT, 0.4));
  if (n > 1) {
    const zf = hd + proj - D - 1.0, zb = b.back ? -zf : -hd + 0.2, yc = P + sh;
    acc.add(K.wall, slabXZ([[-wP / 2, zf], [wP / 2, zf], [wP / 2, zb], [-wP / 2, zb]].reverse(), yc, 0.3));
    for (const sx of [-1, 1]) { const a = sx > 0 ? wP / 2 : -hw + 0.2, c = sx > 0 ? hw - 0.2 : -wP / 2; acc.add(K.wall, slabXZ([[a, hd - 0.2], [c, hd - 0.2], [c, -hd + 0.2], [a, -hd + 0.2]].reverse(), yc, 0.3)); }
  }
  // tháp góc bát giác đội chhatri (Itimad-ud-Daulah); vòng gờ theo tầng
  const rings = Array.from({ length: n - 1 }, (_, i) => P + (i + 1) * sh);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cornerTurret(acc, K, { x: sx * hw, z: sz * hd, a: ta, y0: P, y1: yT + (main ? 1.6 : 1.0), rings, cap: villa && sz < 0, chh: main ? { a: 1.6, ph: 2.2, base: 0.3, dome: { R: 1.15, H: 1.8 } } : { a: 1.15, ph: 1.7, base: 0.25, dome: { R: 0.85, H: 1.3 } } });
  // vòm bầu trắng trên trống giữa mái (nhà chủ)
  let top = pTop + piO.gH;
  if (main) { const rd = clamp(Math.min(b.d, b.w) * 0.22, 2.6, 4.0); top = Math.max(top, domeOn(acc, K, { y: yT, rd, hd: 2.2, R: rd * 1.13, H: rd * 1.13 * 1.42, fin: rd * 0.5 })); }
  return done(acc, { kind: 'est-mughal', top, wP, ow, storeys: n });
}

// ============================================================================ THÁP: minaret Taj trên bệ bát giác
function tower(styleId, S, t) {
  const acc = new Acc(), K = KR, a = Math.min(t.w, t.d) * 0.42, hb = 3.2;
  // bệ bát giác sa thạch đỏ: mỗi mặt một hốc vòm mù trong khung trắng, cửa vào mặt trước; gờ, lan can jali
  const side = 2 * a * Math.tan(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const th = (2 * Math.PI * k) / 8, nx = Math.sin(th), nz = Math.cos(th), F = Face.at(acc, nx * a, 0, nz * a, nx, nz), L = side / 2 + 0.42;
    const op = k === 0 ? { cx: 0, y: 0, w: 1.4, hs: 1.75, rise: 0.7, kind: 'door' } : { cx: 0, y: 0.5, w: side * 0.5, hs: hb - 1.3 - side * 0.25, rise: side * 0.25, kind: 'niche', d: 0.5, cusps: 5 };
    wall(F, K.wall, { x0: -L, x1: L, y0: 0, y1: hb, t: 0.9, ops: [op], shade: K.shade, rim: 0.18 });
    archDress(F, op, { frame: K.frame, spand: K.spand2 });
  }
  acc.add(K.wall, oct([[0.001, 0], [a - 0.6, 0], [a - 0.6, hb], [0.001, hb]]));
  chhajja(acc, K.trim, ngon(8, a), hb, 0.55, { step: 0.9 });
  acc.add(K.floor, slabXZ(ngon(8, a - 0.05), hb + 0.04, 0.06));
  parapet(acc, K.wall, ngon(8, a - 0.15), hb, 0.85, 0.25, { panel: K.jali });
  // minaret: thân cẩm thạch ghép khối viền đen, 3 ban công trên consol, chhatri đỉnh
  const H = t.h - hb - 2.6, Dm = clamp(H / 7.6, 3.4, 4.6);
  const top = minaret(acc, { x: 0, y: hb, z: 0, H, D: Dm, keys: { base: 'marble', shaft: 'marbleBlk', trim: 'marble', rail: 'marble', chhatri: { body: 'marble', dome: 'domeW', frame: 'marble', panel: 'black', gold: 'gold' } } });
  return done(acc, { kind: 'minaret', top });
}

// ============================================================================ ĐÌNH: chhatri bát giác 8 trụ bên mặt nước
function pav(styleId, S, pv) {
  const acc = new Acc(), K = KW, ba = Math.min(pv.w, pv.d) / 2 - 0.15, hb = 0.5;
  acc.add('plinthR', oct([[0.001, 0], [ba, 0], [ba, hb - 0.14], [0.001, hb - 0.14]]));
  acc.add('stepR', oct([[0.001, 0], [ba + 0.08, 0], [ba + 0.08, 0.14], [0.001, 0.14]], 0, hb - 0.14, 0));
  acc.add('paveW', oct([[0.001, 0], [ba - 0.1, 0], [ba - 0.1, 0.02], [0.001, 0.02]], 0, hb, 0)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: ba, top: hb });
  steps(acc, 'stepR', { x: 0, z: ba, nx: 0, nz: 1, w: 2.2, h: hb, tread: 0.34 });
  const a = Math.max(3.2, ba - 0.15), top = chhatri(acc, { x: 0, y: hb, z: 0, a, ph: Math.max(3.1, pv.h), base: 0.3, dome: { R: a * 0.66, H: a * 0.95 }, keys: { body: 'marble', dome: 'domeW', frame: 'marble', panel: 'black', gold: 'gold' } });
  // ghế đá thấp giữa các trụ (trừ lối vào)
  const ap = a * 0.74, vs = ngon(8, ap);
  for (let i = 0; i < 8; i++) { const p = vs[i], q = vs[(i + 1) % 8], mz = (p[1] + q[1]) / 2; if (mz > ap * 0.9) continue; const g = box(Math.hypot(q[0] - p[0], q[1] - p[1]) - 0.3, 0.45, 0.42, (p[0] + q[0]) / 2, hb + 0.3 + 0.225, mz, Math.atan2(-(q[1] - p[1]), q[0] - p[0])); acc.add('marble', g); }
  return done(acc, { kind: 'chhatri-pav', top });
}

// ============================================================================ CỔNG
function gate(styleId, S, g) {
  const acc = new Acc(), K = KR;
  if (g.villa) {
    // biệt thự: hai trụ bát giác đội chhatri nhỏ + vòm nhiều múi nối trên
    const w = g.w + 0.4, pa = 0.6, hp = 3.6;
    for (const sx of [-1, 1]) cornerTurret(acc, K, { x: sx * (w / 2 + pa), z: 0, a: pa, y0: 0, y1: hp, rings: [1.2], chh: { a: 0.85, ph: 1.2, base: 0.15, dome: { R: 0.6, H: 0.9 } } });
    const F = Face.at(acc, 0, 0, 0.25, 0, 1), c = archCurve(0, hp - 1.0, w / 2, 0.9, 5);
    const gg = extXY([[w / 2, hp - 1.0], [w / 2, hp + 0.5], [-w / 2, hp + 0.5], [-w / 2, hp - 1.0], ...[...c].reverse().slice(1)], [], 0.5); F.add(K.wall, gg);
    archRib(F, K.frame, 0, hp - 1.0, w, 0.9, 0.02, 0.08, 5);
    chRun(F, K.trim, K.trim, -w / 2, w / 2, hp + 0.5, 0.4, { cons: false });
    return done(acc, { kind: 'gate-v' });
  }
  // phủ: Darwaza thu nhỏ — rộng g.w + 2 × 4,6, sâu 8 m (mặt ngoài z = 0, lùi về −z); lối xuyên vòm rộng ow ≥ g.w
  const ow = g.w + 0.4, pier = 4.6, W = ow + 2 * pier, Dg = 8.0, ph = 0.25, eave = 10.6, fTop = 13.4, apex = 9.6, rise = ow * 0.42, hs = apex - rise;
  acc.add('pave', boxB(W + 1.2, ph, Dg + 1.2, 0, 0, -Dg / 2)); acc.plat({ x: 0, z: -Dg / 2, w: W + 1.2, d: Dg + 1.2, top: ph });
  for (const [sz, z0] of [[1, 0], [-1, -Dg]]) {
    const F = Face.at(acc, 0, 0, z0, 0, sz);
    // khung pishtaq: tường mặt có vòm lớn xuyên, dải thư pháp, spandrel pietra dura, gờ vòm, ô panel trên vòm
    wall(F, K.wall, { x0: -W / 2, x1: W / 2, y0: ph, y1: fTop, t: 1.2, ops: [{ cx: 0, y: ph, w: ow, hs, rise, kind: 'open' }], shade: K.shade });
    const bb = 0.6, gg = 0.2, yB = ph + apex + gg, s = ow / 2;
    frame(F, K.frame, -W / 2, W / 2, ph, fTop, 0.22, 0.08);
    frame(F, K.band, -s - gg - bb, s + gg + bb, ph + 0.5, yB + bb, bb, 0.05);
    const c = archCurve(0, ph + hs, s, rise); F.add(K.spand, (() => { const e = extXY([[s + gg, ph + hs], [s + gg, yB], [-s - gg, yB], [-s - gg, ph + hs], ...[...c].reverse().slice(1, -1)], [], 0.03); e.translate(0, 0, 0.03); return e; })());
    archRib(F, K.frame, 0, ph + hs, ow, rise, 0, 0.14, 0);
    // hàng ô vòm mù nhiều múi trên vòm lớn (dãy vòm cuốn dưới hàng chhatri của Darwaza)
    { const x0 = -s - gg - bb, L = 2 * (s + gg + bb), m = 5, pw = L / m, ya = yB + bb + 0.3, yb = fTop - 0.4; for (let i = 0; i < m; i++) { const xc = x0 + pw * (i + 0.5); frame(F, K.frame, xc - pw * 0.42, xc + pw * 0.42, ya, yb, 0.08, 0.04, 0, true); archRib(F, K.frame, xc, ya + (yb - ya) * 0.32, pw * 0.56, (yb - ya) * 0.42, 0.02, 0.07, 3); } }
    // hai trụ: 2 tầng hốc vòm (tầng dưới cửa gỗ, trên jali)
    for (const sx of [-1, 1]) twoTier(F, K, { x0: sx > 0 ? s + gg + bb + 0.1 : -W / 2 + 1.0, x1: sx > 0 ? W / 2 - 1.0 : -s - gg - bb - 0.1, y0: ph, y1: eave - 0.3, split: ph + (eave - ph) * 0.5, t: 0.9, d: 1.0, lower: 'niche', upper: 'jali', backL: 'door', backU: K.jali, dado: 0.7, wf: 0.6 });
    // dãy vòm cuốn nhỏ trên đỉnh khung + chhajja (hàng chhatri đặt sau)
    chRun(F, K.trim, K.trim, -W / 2 + 0.2, W / 2 - 0.2, fTop, 0.6, { step: 1.6 });
  }
  // khối xây hai trụ (giữa hai mặt) + vòm hành lang nhọn xuyên (mặt hở) + mái bằng
  for (const sx of [-1, 1]) acc.add(K.wall, boxB(pier - 0.2, eave - ph, Dg - 2.4, sx * (ow / 2 + (pier - 0.2) / 2), ph, -Dg / 2));
  { const c = archCurve(0, ph + hs, ow / 2, rise), rows = []; for (const z of [-1.2, -Dg + 1.2]) rows.push(c.map(([x, y]) => new THREE.Vector3(x, y, z))); const gs = new THREE.BufferGeometry(); const pos = []; for (let i = 0; i < c.length - 1; i++) { const a0 = rows[0][i], a1 = rows[0][i + 1], b0 = rows[1][i], b1 = rows[1][i + 1]; pos.push(...a0.toArray(), ...b0.toArray(), ...a1.toArray(), ...a1.toArray(), ...b0.toArray(), ...b1.toArray()); } gs.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gs.computeVertexNormals(); acc.add(K.vault, gs); }
  acc.add(K.wall, boxB(ow + 0.2, fTop - (ph + apex) - 0.2, Dg - 2.4, 0, ph + apex + 0.1, -Dg / 2));
  for (const sx of [-1, 1]) acc.add(K.wall, boxB(pier, fTop - eave + 0.3, Dg - 2.4, sx * (ow / 2 + pier / 2), eave - 0.3, -Dg / 2));
  acc.add(K.wall, slabXZ([[-W / 2, 0], [W / 2, 0], [W / 2, -Dg], [-W / 2, -Dg]].reverse(), fTop, 0.3));
  parapet(acc, K.wall, [[-W / 2 + 0.2, -0.2], [W / 2 - 0.2, -0.2], [W / 2 - 0.2, -Dg + 0.2], [-W / 2 + 0.2, -Dg + 0.2]].reverse(), fTop, 0.75, 0.3, { panel: K.jali });
  // hàng 3 chhatri trắng trên đỉnh (Darwaza-i Rauza có 11) + 4 tháp góc bát giác đội chhatri
  for (let i = 0; i < 3; i++) chhatri(acc, { x: -ow / 2 + (ow * (i + 0.5)) / 3, y: fTop, z: -Dg / 2, a: 0.82, ph: 1.5, base: 0.2, dome: { R: 0.58, H: 0.95 }, keys: { body: 'marble', dome: 'domeW', frame: 'marble', panel: K.frame, gold: 'gold' } });
  let top = 0;
  for (const sx of [-1, 1]) for (const z of [0, -Dg]) top = cornerTurret(acc, K, { x: sx * W / 2, z, a: 0.95, y0: 0, y1: fTop + 1.2, cap: z < 0, rings: [ph + (eave - ph) * 0.5, eave], chh: { a: 1.2, ph: 1.7, base: 0.2, dome: { R: 0.85, H: 1.3 } } });
  return done(acc, { kind: 'gate', top, W, D: Dg });
}

export const FAMILY = { hall, tower, pav, gate };
