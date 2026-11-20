// ============================================================================
//  BIỆT VIỆN BALI (họ «jp», docs/bietphu/jp.md) — không có bộ kit riêng: ghép từ jp-kit.js (jpRoof / skirtRoof / steps, CHỈ import)
//  + vật liệu lặp theo mét archcity/mats.js (gạch đỏ bata merah, đá paras, gỗ, sơn son) + texture tranh alang-alang / sợi ijuk
//  vẽ canvas lặp theo mét (512 px/m).
//  Nguyên mẫu: Puri Saren Agung Ubud (bale tường gạch đỏ + paras chạm, cửa kori son vàng, mái tranh), Pura Taman Ayun Mengwi 1634
//  (meru tumpang solas 11 mái ijuk đen trên bệ xây + buồng gỗ sơn đỏ đen; candi bentar ngăn sân), Kerta Gosa / Bale Kambang
//  Klungkung (bale mái hai tầng trên nền cao), bale bengong vườn.
//   · nhà: bale trên bataran gạch đỏ + gờ paras, vách gạch có trụ paras chạm, cửa kori, cửa sổ song gỗ, hàng cột saka son
//     ngoài vách đỡ mái tranh dốc 36–45° dày 0,45 m; nhà chính mái 2 tầng (tumpang) có dải song thông gió giữa hai tầng
//   · tháp: meru 11 tầng mái ijuk ≈ 30 m · đình: bale bengong 4 cột mái chóp tranh · cổng: candi bentar (cổng chẻ đôi không mái)
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, beam, slabXY, lathe, V, FACE, frameM, put, place, jpRoof, skirtRoof, roofProfileJ, steps } from '../tienphu/arch/jp-kit.js';
import { bayList } from '../tienphu/arch/jp-res.js';
import { tiled, retex, consolidate } from './mats.js';
import { edges, rafters } from './est-jp-house.js';

import { strawTex, strawEndTex, polengTex } from './est-jp-tex.js';

const DS = THREE.DoubleSide;
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.9, ...o });
const mapM = (t, color, o = {}) => std(t ? { map: t, color: '#ffffff', ...o } : { color, ...o });
let MATS = null, OVER = null;
function baliMats() {
  if (MATS) return MATS;
  const thatch = strawTex([118, 101, 74], { seed: 11, blotch: 0.24, shadow: 0.42 }), ijuk = strawTex([44, 40, 35], { strands: 8000, len: [50, 150], course: 72, shadow: 0.5, hi: 0.12, blotch: 0.1, seed: 7 });
  const tEnd = strawEndTex([150, 130, 96]), iEnd = strawEndTex([58, 52, 46], 9);
  MATS = {
    thatch: mapM(thatch, '#8f7a58', { side: DS, roughness: 1 }), thatchEdge: mapM(tEnd, '#8a7454', { roughness: 1 }),
    ijuk: mapM(ijuk, '#2e2924', { side: DS, roughness: 1 }), ijukRidge: mapM(iEnd, '#25211d', { roughness: 1 }),
    gold: std({ color: '#c9a24a', roughness: 0.35, metalness: 0.7 }), void: std({ color: '#141210', roughness: 1 }),
    statuePoleng: mapM(polengTex(), '#888888', { roughness: 0.95 }), terracotta: std({ color: '#a85a3a', roughness: 0.85 }),
  };
  return MATS;
}
function baliOver() {
  if (OVER) return OVER;
  const brick = (c) => tiled('brick', c, { rough: 1, bump: 1.25 }), paras = (c) => tiled('stone', c, { rough: 1, bump: 0.9 });
  OVER = {
    baseBrick: brick('#bd5e40'), brick: brick('#b85a3c'), brickDk: brick('#9c4a33'),
    baseParas: paras('#c9c2ac'), parasBand: paras('#cbc4ae'), parasDk: paras('#918d7d'), stepParas: paras('#bdb6a0'), floorPara: paras('#b9b29c'),
    carveParas: tiled('marble', '#bdb59c', { rough: 1, bump: 1.6 }), carveSpire: tiled('marble', '#b9b199', { rough: 1, bump: 1.4 }), statueStone: paras('#8e8a7c'), carveGold: tiled('marble', '#c49a46', { rough: 0.45, metal: 0.55, bump: 1.4 }),
    col: tiled('lacquer', '#7c2418', { rough: 0.6 }), colDk: tiled('lacquer', '#2a1d18', { rough: 0.6 }),
    woodB: tiled('plank', '#5b3f29', { rough: 0.85 }), woodNeck: tiled('plank', '#3a2a20', { rough: 0.85 }),
    latticeBali: tiled('lacquer', '#b48d3c', { rough: 0.45, metal: 0.4 }), ceilBamboo: tiled('plank', '#a88c5a', { rough: 0.9 }),
    soffitBamboo: tiled('plank', '#b29662', { rough: 0.9, side: DS }), carveRafter: tiled('plank', '#8a6d44', { rough: 0.9 }),
  };
  return OVER;
}
const finish = (g) => consolidate(retex(g, baliOver()));
const allMats = () => ({ ...baliMats(), ...baliOver() });
const out = (acc, info) => ({ acc, mats: allMats(), post: finish, info });

const THATCH_K = { tile: 'thatch', edge: 'thatchEdge', ridge: 'ijukRidge', soffit: 'soffitBamboo', gable: 'thatchEdge', barge: 'thatchEdge', gegyo: 'thatchEdge', oni: 'ijukRidge' };
const IJUK_K = { tile: 'ijuk', edge: 'ijukRidge', ridge: 'ijukRidge', soffit: 'soffitBamboo', gable: 'ijukRidge', barge: 'ijukRidge', gegyo: 'ijukRidge', oni: 'ijukRidge' };

// ---------------------------------------------------------------- linh kiện
/** murdha / bảo đỉnh: chóp tiện vàng (hoặc đất nung) */
function murdha(acc, x, y, z, s = 1, key = 'gold') {
  acc.add(key, lathe([[0.32, 0], [0.36, 0.12], [0.2, 0.22], [0.26, 0.42], [0.12, 0.6], [0.17, 0.8], [0.06, 1.15], [0.1, 1.3], [0.001, 1.75]].map(([r, h]) => [r * s, h * s]), x, y, z, 10));
}
/** tượng giữ cửa dwarapala ngồi trên bệ, quấn vải poleng ca rô đen trắng (giản lược) — khoá statue (bậc vừa bỏ) */
function dwarapala(acc, x, z, y0 = 0, s = 1) {
  acc.add('parasBand', boxB(0.7 * s, 0.55 * s, 0.7 * s, x, y0, z));
  acc.add('statueStone', lathe([[0.3, 0], [0.34, 0.25], [0.26, 0.55], [0.22, 0.8], [0.12, 0.88], [0.15, 1.0], [0.14, 1.12], [0.001, 1.2]].map(([r, h]) => [r * s, h * s]), x, y0 + 0.55 * s, z, 9));
  acc.add('statuePoleng', lathe([[0.36, 0], [0.37, 0.3], [0.001, 0.3]].map(([r, h]) => [r * s, h * s]), x, y0 + 0.62 * s, z, 9));
}
/** bataran: bệ gạch đỏ chân paras, gờ paras hai lớp trên đỉnh, ô chạm paras trên thân, trụ góc; bậc giữa có má gạch + tượng giữ cửa */
function bataran(acc, { PW, PD, h, sw = 0, back = false, cx = 0, cz = 0, statues = true }) {
  const sub = new Acc(), foot = Math.min(0.32, h * 0.3), band = Math.min(0.34, h * 0.32), body = h - foot - band;
  sub.add('baseParas', boxB(PW + 0.16, foot, PD + 0.16, 0, 0, 0));
  if (body > 0.05) sub.add('baseBrick', boxB(PW, body, PD, 0, foot, 0));
  sub.add('baseParas', boxB(PW + 0.14, band * 0.5, PD + 0.14, 0, h - band, 0)); sub.add('baseParas', boxB(PW + 0.04, band * 0.5, PD + 0.04, 0, h - band * 0.5, 0));
  sub.add('floorPara', boxB(PW - 0.1, 0.02, PD - 0.1, 0, h - 0.015, 0)); sub.plat({ x: 0, z: 0, w: PW, d: PD, top: h });
  if (body > 0.6) for (const f of 'SNEW') {
    const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? PW : PD, m = frameM(nx, nz, nx * PW / 2, nz * PD / 2), n = Math.max(1, Math.round(L / 2.6));
    for (let i = 0; i < n; i++) { const u = -L / 2 + (L * (i + 0.5)) / n; if ((f === 'S' || (f === 'N' && back)) && Math.abs(u) < sw / 2 + 1.0) continue; put(sub, m, 'carveParas', box(Math.min(1.4, L / n - 0.6), body * 0.62, 0.07, u, foot + body / 2, 0.03)); put(sub, m, 'parasBand', box(Math.min(1.4, L / n - 0.6) + 0.16, 0.08, 0.1, u, foot + body * 0.81 + 0.04, 0.05)); put(sub, m, 'parasBand', box(Math.min(1.4, L / n - 0.6) + 0.16, 0.08, 0.1, u, foot + body * 0.19 - 0.04, 0.05)); }
    for (const s of [-1, 1]) put(sub, m, 'parasBand', box(0.42, body, 0.12, s * (L / 2 - 0.21), foot + body / 2, 0.05));
  }
  if (sw) for (const dir of back ? [1, -1] : [1]) {
    const zTop = dir * PD / 2, run = steps(sub, { x: 0, zTop, w: sw, h, dir, key: 'stepParas' });
    for (const s of [-1, 1]) {
      const xs = s * (sw / 2 + 0.3);
      sub.add('baseBrick', slabXY([[0, 0], [run + 0.35, 0], [run + 0.35, 0.55], [0, h + 0.55]].map(([a, y]) => [zTop + dir * a, y]), 0.6, xs, 0, 0, -Math.PI / 2));
      sub.add('parasBand', slabXY([[0, h + 0.55], [run + 0.35, 0.55], [run + 0.35, 0.72], [0, h + 0.72]].map(([a, y]) => [zTop + dir * a, y]), 0.72, xs, 0, 0, -Math.PI / 2));
      if (statues) dwarapala(sub, xs, zTop + dir * (run + 0.1), 0.72, Math.min(1.2, 0.75 + h * 0.2));
    }
  }
  place(acc, sub, cx, cz);
}
/** cột saka son: chân đá paras, thân sơn son, 3 vòng vàng, đầu cột chạm vàng */
function saka(acc, x, z, y0, H, s = 0.3) {
  acc.add('parasBand', boxB(s + 0.26, 0.42, s + 0.26, x, y0, z)); acc.add('carveParas', boxB(s + 0.16, 0.12, s + 0.16, x, y0 + 0.42, z));
  acc.add('col', boxB(s, H - 0.54 - 0.32, s, x, y0 + 0.54, z));
  for (const t of [0.12, 0.55, 0.88]) acc.add('gold', boxB(s + 0.04, 0.06, s + 0.04, x, y0 + 0.54 + (H - 0.86) * t, z));
  acc.add('carveGold', boxB(s + 0.22, 0.32, s + 0.22, x, y0 + H - 0.32, z));
}
/** một mặt vách gạch: trụ paras có đầu chạm ở mép gian, chân paras, diềm paras chạm trên đỉnh, cửa kori ở gian mở, cửa sổ song gỗ các gian khác */
function baliWall(acc, m, { L, E, y0, H, door = -1, dh = 2.75, win = true }) {
  const foot = 0.45, fr = 0.42, yT = y0 + H;
  put(acc, m, 'parasBand', box(L + 0.2, 0.3, 0.42, 0, yT - fr - 0.15 + 0.3, 0.02)); put(acc, m, 'parasBand', box(L + 0.3, 0.14, 0.5, 0, yT - 0.07, 0.03));
  put(acc, m, 'carveParas', box(L, fr - 0.14, 0.34, 0, yT - fr + (fr - 0.14) / 2 - 0.0, 0.02));
  for (let u = -L / 2 + 0.35; u < L / 2 - 0.2; u += 0.7) put(acc, m, 'carveParas', box(0.36, 0.2, 0.08, u, yT - fr * 0.55, 0.2));        // hoa văn karang dọc diềm
  put(acc, m, 'woodB', box(L + 0.5, 0.24, 0.3, 0, yT + 0.12, 0));                                                          // lambang
  for (let i = 0; i < E.length - 1; i++) {
    const u0 = E[i] + 0.27, u1 = E[i + 1] - 0.27, bw = u1 - u0, cu = (u0 + u1) / 2, hb = yT - fr - y0;
    if (i === door) {
      const dw = Math.min(2.7, bw - 0.6), side = (bw - dw) / 2 - 0.3;
      for (const s of [-1, 1]) { if (side > 0.05) { put(acc, m, 'brick', box(side, hb - foot, 0.3, cu + s * (dw / 2 + 0.3 + side / 2), y0 + foot + (hb - foot) / 2, 0)); put(acc, m, 'parasBand', box(side, foot, 0.36, cu + s * (dw / 2 + 0.3 + side / 2), y0 + foot / 2, 0.01)); }
        put(acc, m, 'col', box(0.3, dh, 0.4, cu + s * (dw / 2 + 0.15), y0 + dh / 2, 0.02)); put(acc, m, 'carveGold', box(0.14, dh - 0.3, 0.06, cu + s * (dw / 2 + 0.15), y0 + dh / 2, 0.24));
        put(acc, m, 'col', box(0.08, dh - 0.1, dw / 2 - 0.05, cu + s * (dw / 2 - 0.06), y0 + (dh - 0.1) / 2 + 0.03, -(dw / 4) - 0.2)); // cánh kori mở vào
        put(acc, m, 'carveGold', box(0.03, dh * 0.7, dw / 2 - 0.35, cu + s * (dw / 2 - 0.11), y0 + dh * 0.5, -(dw / 4) - 0.2)); }
      put(acc, m, 'col', box(dw + 0.6, 0.3, 0.4, 0, y0 + dh + 0.15, 0.02).translate(cu, 0, 0));
      if (hb - dh - 0.3 > 0.05) put(acc, m, 'brick', box(dw + 0.6, hb - dh - 0.3, 0.3, cu, y0 + dh + 0.3 + (hb - dh - 0.3) / 2, 0));
      put(acc, m, 'carveGold', slabXY([[-dw / 2 - 0.3, 0], [dw / 2 + 0.3, 0], [dw / 2 - 0.1, 0.45], [0.4, 0.7], [0, 0.95], [-0.4, 0.7], [-dw / 2 + 0.1, 0.45]], 0.1, cu, y0 + dh + 0.3, 0.2)); // mahkota cửa
      continue;
    }
    put(acc, m, 'parasBand', box(bw, foot, 0.36, cu, y0 + foot / 2, 0.01));
    if (!win || bw < 1.6) { put(acc, m, 'brick', box(bw, hb - foot, 0.3, cu, y0 + foot + (hb - foot) / 2, 0)); continue; }
    const ww = Math.min(1.35, bw - 0.9), ys = y0 + 1.0, wh = Math.min(1.5, hb - 1.6), side = (bw - ww) / 2;
    for (const s of [-1, 1]) put(acc, m, 'brick', box(side, hb - foot, 0.3, cu + s * (ww / 2 + side / 2), y0 + foot + (hb - foot) / 2, 0));
    put(acc, m, 'brick', box(ww, ys - y0 - foot, 0.3, cu, (ys + y0 + foot) / 2, 0)); put(acc, m, 'brick', box(ww, hb + y0 - ys - wh, 0.3, cu, (ys + wh + y0 + hb) / 2, 0));
    put(acc, m, 'colDk', box(ww, wh, 0.05, cu, ys + wh / 2, -0.08)); put(acc, m, 'col', box(ww - 0.2, wh - 0.2, 0.04, cu, ys + wh / 2, -0.04));
    put(acc, m, 'woodB', box(ww + 0.3, 0.14, 0.4, cu, ys + wh + 0.07, 0.04)); put(acc, m, 'parasBand', box(ww + 0.4, 0.12, 0.45, cu, ys - 0.06, 0.06));
    for (const s of [-1, 1]) put(acc, m, 'woodB', box(0.14, wh, 0.34, cu + s * (ww / 2 + 0.07), ys + wh / 2, 0.03));
    const nb = Math.round(ww / 0.17); for (let k = 0; k < nb; k++) put(acc, m, 'latticeBali', box(0.06, wh, 0.07, cu - ww / 2 + (ww * (k + 0.5)) / nb, ys + wh / 2, 0.06));
    put(acc, m, 'latticeBali', box(ww, 0.06, 0.07, cu, ys + wh * 0.62, 0.07));
  }
  for (const u of E) { put(acc, m, 'parasBand', box(0.54, H - fr, 0.44, u, y0 + (H - fr) / 2, 0.02)); put(acc, m, 'carveParas', box(0.66, 0.4, 0.52, u, yT - fr - 0.2, 0.02)); put(acc, m, 'carveParas', box(0.66, 0.3, 0.52, u, y0 + 0.15, 0.02)); }
}

// ---------------------------------------------------------------- NHÀ (bale)
function hall(styleId, S, b, opt = {}) {
  const acc = new Acc(), w = b.w, d = b.d, ph = b.plinth, hw = w / 2, hd = d / 2, PW = w + 2.4, PD = d + 2.4, sw = Math.min(6, w * 0.3);
  bataran(acc, { PW, PD, h: ph, sw, back: !!b.back });
  acc.add('floorPara', boxB(w - 0.2, 0.025, d - 0.2, 0, ph - 0.005, 0));
  const tiers = b.id === 'main' && !opt.villa ? 2 : 1, wallH = tiers === 2 ? 3.7 : 3.3, co = 0.95, yC = ph + wallH - 0.35;
  const xs = edges(bayList(w, 3.0, 3.6)), zs = edges(bayList(d, 3.0)), ci = (xs.length - 2) / 2;
  for (const f of 'SNEW') { const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? w : d, E = f === 'S' || f === 'N' ? xs : zs; baliWall(acc, frameM(nx, nz, nx * hw, nz * hd), { L, E, y0: ph, H: wallH, door: f === 'S' || (f === 'N' && b.back) ? ci : -1 }); }
  // hàng cột saka ngoài vách (cách 0,95 m) + xà lambang + xà nối vào vách
  const cx = hw + co, cz = hd + co, cxs = edges(bayList(2 * cx, 3.0, 3.6)), czs = edges(bayList(2 * cz, 3.0));
  const cols = []; for (const x of cxs) for (const z of [-cz, cz]) cols.push([x, z]); for (const z of czs.slice(1, -1)) for (const x of [-cx, cx]) cols.push([x, z]);
  for (const [x, z] of cols) { saka(acc, x, z, ph, yC - ph); const wx = Math.abs(x) > hw ? Math.sign(x) * hw : x, wz = Math.abs(z) > hd ? Math.sign(z) * hd : z; acc.add('woodB', beam(V(x, yC + 0.12, z), V(wx, yC + 0.12, wz), 0.18, 0.22)); }
  for (const [ax, L, o] of [['x', 2 * cx, cz], ['x', 2 * cx, -cz], ['z', 2 * cz, cx], ['z', 2 * cz, -cx]]) acc.add('woodB', ax === 'x' ? boxB(L + 0.4, 0.26, 0.26, 0, yC, o) : boxB(0.26, 0.26, L + 0.4, o, yC, 0));
  acc.add('ceilBamboo', boxB(w - 0.3, 0.05, d - 0.3, 0, ph + wallH - 0.3, 0));
  for (let x = -hw + 0.6; x < hw - 0.3; x += 1.2) acc.add('woodB', boxB(0.12, 0.12, d - 0.4, x, ph + wallH - 0.42, 0));
  // mái tranh
  let top;
  const ov = 1.15;
  if (tiers === 2) {
    const ins = Math.min(2.6, d * 0.16), ix = hw - ins, iz = hd - ins, root = yC + 0.42 + 1.0 * (co + ins), hc = 1.5;
    const sk = skirtRoof(acc, { hx: cx, hz: cz, over: ov, ix, iz, root, K: THATCH_K, rib: 1e6, lift: 0.08, slopes: [[ov, 0.8], 1.0] });
    rafters(acc, sk, { hx: cx, hz: cz, ex: sk.ex, ez: sk.ez, th: 0.26, step: 0.42 });
    // dải song thông gió giữa hai tầng mái
    const yb = root - 0.5, yt = root + hc;
    for (const f of 'SNEW') {
      const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? 2 * ix : 2 * iz, m = frameM(nx, nz, nx * ix, nz * iz), n = Math.max(2, Math.round(L / 2.4));
      put(acc, m, 'void', box(L, yt - yb, 0.06, 0, (yb + yt) / 2, -0.1)); put(acc, m, 'woodB', box(L + 0.3, 0.22, 0.3, 0, yt - 0.11, 0)); put(acc, m, 'woodB', box(L + 0.2, 0.18, 0.28, 0, yb + 0.5, 0));
      for (let i = 0; i <= n; i++) put(acc, m, 'col', box(0.24, yt - yb, 0.24, -L / 2 + (L * i) / n, (yb + yt) / 2, 0));
      for (let u = -L / 2 + 0.15; u < L / 2; u += 0.22) put(acc, m, 'latticeBali', box(0.06, yt - yb - 0.8, 0.06, u, (yb + 0.68 + yt - 0.22) / 2, 0.04));
    }
    const ov2 = 1.1, ex = ix + ov2, ez = iz + ov2, prof = roofProfileJ(ez, [[ov2, 0.85], 1.15, 1.3], Math.max(10, Math.ceil(ez / 0.8)));
    const R = jpRoof(acc, { ex, ez, yE: yt + 0.3 - prof.P(ov2), prof, ends: ['hip', 'hip'], K: THATCH_K, rib: 1e6, thick: 0.55, hipW: 0.34, hipOni: false, ridgeH: 0.5, ridgeW: 0.55, soffit: ov2 - 0.1, lift: 0.1 });
    rafters(acc, R, { hx: ix, hz: iz, ex, ez, th: 0.55, step: 0.42 });
    for (const sx of [-1, 1]) murdha(acc, sx * (ex - ez), R.yT + 0.4, 0, 0.9);
    murdha(acc, 0, R.yT + 0.4, 0, 1.15);
    top = R.top;
  } else {
    const ex = cx + ov, ez = cz + ov, prof = roofProfileJ(ez, [[ov, 0.85], 1.12, 1.25], Math.max(10, Math.ceil(ez / 0.8)));
    const R = jpRoof(acc, { ex, ez, yE: yC + 0.42 - prof.P(ov), prof, ends: ['hip', 'hip'], K: THATCH_K, rib: 1e6, thick: 0.55, hipW: 0.34, hipOni: false, ridgeH: 0.45, ridgeW: 0.5, soffit: ov - 0.1, lift: 0.1 });
    rafters(acc, R, { hx: cx, hz: cz, ex, ez, th: 0.55, step: 0.42 });
    for (const sx of [-1, 1]) murdha(acc, sx * Math.max(0, ex - ez), R.yT + 0.38, 0, 0.8);
    top = R.top;
  }
  // nội thất: bệ gỗ chạm (bale) + bàn thờ nhỏ sát vách sau bên trái
  { const xt = -Math.min(hw - 2, Math.max(3, w * 0.24)); acc.add('woodB', boxB(2.6, 0.5, 0.8, xt, ph, -hd + 0.6)); acc.add('carveGold', boxB(2.4, 0.3, 0.05, xt, ph + 0.12, -hd + 1.02)); acc.add('col', boxB(1.2, 1.2, 0.5, xt, ph + 0.5, -hd + 0.45)); acc.add('carveGold', boxB(1.0, 0.9, 0.04, xt, ph + 0.62, -hd + 0.72)); }
  return out(acc, { kind: tiers === 2 ? 'bale-tumpang' : 'bale', top });
}

// ---------------------------------------------------------------- THÁP MERU 11 mái ijuk
function tower(styleId, S, t) {
  const acc = new Acc(), k = Math.min(1, t.w / 10), n = 11;
  // bệ xây hai cấp + bậc trước
  bataran(acc, { PW: 8.8 * k, PD: 8.8 * k, h: 0.5, statues: false });
  bataran(acc, { PW: 7.6 * k, PD: 7.6 * k, h: 1.25, cx: 0, cz: 0, statues: false });
  steps(acc, { x: 0, zTop: 3.8 * k, w: 1.8, h: 1.25, key: 'stepParas' });
  // buồng thờ (gedong) gạch đỏ + paras, cửa kori son vàng
  const gy = 1.25, gH = 2.9, ga = 2.4 * k, E = edges(bayList(2 * ga, 1.6, 1.8));
  for (const f of 'SNEW') { const [nx, nz] = FACE[f]; baliWall(acc, frameM(nx, nz, nx * ga, nz * ga), { L: 2 * ga, E, y0: gy, H: gH, win: false, door: -1 }); }
  { const m = frameM(0, 1, 0, ga); put(acc, m, 'col', box(1.3, 2.0, 0.12, 0, gy + 1.0, 0.18)); put(acc, m, 'carveGold', box(1.0, 1.7, 0.05, 0, gy + 1.0, 0.26)); put(acc, m, 'carveGold', slabXY([[-0.8, 0], [0.8, 0], [0, 0.6]], 0.1, 0, gy + 2.0, 0.24)); }
  acc.add('brick', boxB(2 * ga - 0.6, gH, 2 * ga - 0.6, 0, gy, 0));
  // cột gỗ đen đỏ đỡ chồng mái
  const y0 = gy + gH + 0.55, a0 = 4.35 * k, aT = 0.95 * k, yTop = Math.min(t.h - 4, 30.5), ht = (yTop - y0 - 1.6) / (n - 1);
  for (const s of [-1, 1]) for (const q of [-1, 1]) acc.add('colDk', boxB(0.3, y0 - gy - gH, 0.3, s * (ga - 0.2), gy + gH, q * (ga - 0.2)));
  acc.add('col', boxB(2 * ga + 0.2, 0.3, 2 * ga + 0.2, 0, y0 - 0.55, 0));
  let top = 0;
  for (let i = 0; i < n; i++) {
    const a = a0 - ((a0 - aT) * i) / (n - 1), an = i < n - 1 ? a0 - ((a0 - aT) * (i + 1)) / (n - 1) : 0, yE = y0 + i * ht;
    const neck = i < n - 1 ? Math.max(0.35, an - 0.62 * k) : 0, prof = roofProfileJ(a, i < n - 1 ? [[0.55, 0.5], 0.7] : [[0.55, 0.5], 0.85, 1.25], 8);
    const last = i === n - 1;
    const R = jpRoof(acc, { ex: a, ez: a, yE, prof, ends: ['hip', 'hip'], dMax: last ? Infinity : a - neck + 0.05, K: IJUK_K, rib: 1e6, thick: 0.34, hipW: 0.22, hipOni: false, soffit: Math.min(0.55, a - neck), lift: 0.05,
      finial: last ? (sub, yT) => { murdha(sub, 0, yT - 0.1, 0, 1.25); sub.add('terracotta', lathe([[0.42, 0], [0.3, 0.25], [0.001, 0.3]], 0, yT - 0.2, 0, 10)); } : null });
    if (!last) {
      const yN = yE + prof.P(a - neck) - 0.3, yN2 = y0 + (i + 1) * ht + 0.15;                  // cổ gỗ giữa hai mái: từ dưới mặt mái này tới trong lớp mái trên
      acc.add('woodNeck', boxB(2 * neck, Math.max(0.3, yN2 - yN), 2 * neck, 0, yN, 0)); acc.add('col', boxB(2 * neck + 0.06, 0.12, 2 * neck + 0.06, 0, yN + 0.1, 0));
      acc.add('gold', boxB(2 * neck + 0.04, 0.05, 2 * neck + 0.04, 0, Math.max(yN + 0.3, yN2) - 0.12, 0));
    }
    top = Math.max(top, R.top, R.yT + 2.2);
  }
  return out(acc, { kind: 'meru', tiers: n, top });
}

// ---------------------------------------------------------------- ĐÌNH: bale bengong 4 cột, mái chóp tranh
function pav(styleId, S, pv) {
  const acc = new Acc(), h0 = 0.5, a = Math.min(pv.w, pv.d) / 2 - 0.95, H = Math.max(2.9, pv.h);
  bataran(acc, { PW: pv.w, PD: pv.d, h: h0, sw: 2.2, statues: false });
  for (const [x, z] of [[-a, -a], [a, -a], [-a, a], [a, a]]) saka(acc, x, z, h0, H, 0.26);
  for (const [x0, z0, x1, z1] of [[-a, a, a, a], [-a, -a, a, -a], [a, -a, a, a], [-a, -a, -a, a]]) { acc.add('woodB', beam(V(x0, h0 + H + 0.12, z0), V(x1, h0 + H + 0.12, z1), 0.24, 0.26)); acc.add('carveGold', beam(V(x0, h0 + H - 0.05, z0), V(x1, h0 + H - 0.05, z1), 0.06, 0.1)); }
  // ghế ván chạm hai bên (Đông, Tây) + lan can thấp sau
  for (const s of [-1, 1]) { acc.add('woodB', boxB(0.55, 0.08, 2 * a - 0.5, s * (a - 0.35), h0 + 0.42, 0)); acc.add('carveParas', boxB(0.45, 0.42, 2 * a - 0.7, s * (a - 0.35), h0, 0)); }
  acc.add('latticeBali', boxB(2 * a - 0.3, 0.06, 0.08, 0, h0 + 0.9, -a)); for (let x = -a + 0.3; x < a - 0.2; x += 0.3) acc.add('latticeBali', boxB(0.05, 0.85, 0.06, x, h0, -a));
  const ov = 1.35, e = a + ov, prof = roofProfileJ(e, [[ov, 0.85], 1.2, 1.38], 9);
  const R = jpRoof(acc, { ex: e, ez: e, yE: h0 + H + 0.4 - prof.P(ov), prof, ends: ['hip', 'hip'], K: THATCH_K, rib: 1e6, thick: 0.5, hipW: 0.32, hipOni: false, soffit: ov, lift: 0.08,
    finial: (sub, yT) => { sub.add('ijukRidge', lathe([[0.55, -0.35], [0.38, 0], [0.001, 0.2]], 0, yT, 0, 10)); murdha(sub, 0, yT + 0.1, 0, 0.95); } });
  rafters(acc, R, { hx: a, hz: a, ex: e, ez: e, th: 0.5, step: 0.36 });
  return out(acc, { kind: 'bale-bengong', top: R.yT + 1.8 });
}

// ---------------------------------------------------------------- CỔNG: candi bentar (chẻ đôi, không mái)
/** một nửa candi: mặt chẻ phẳng tại x = x0 (hướng vào lối), nửa còn lại xếp tầng giật cấp như nửa ngọn tháp; s = ±1 */
function candiHalf(acc, x0, s, zc, r0, k = 1) {
  const sl = (x1, y0, h, rx, rz, key) => acc.add(key, boxB(rx, h, 2 * rz, x0 + s * rx / 2, y0, zc));
  let y = 0.45 * k;
  const tiers = [[0.35, r0, 'parasBand'], [0.4, r0 * 0.93, 'baseBrick'], [0.25, r0 * 0.97, 'parasBand'], [3.0, r0 * 0.82, 'brick'], [0.22, r0 * 0.9, 'parasBand'], [0.3, r0 * 0.95, 'parasBand']];
  for (const [h, r, key] of tiers) { sl(0, y, h * k, r * k, r * k * 0.92, key); y += h * k; }
  // thân: ô chạm paras mặt ngoài (+z) và hông (s·x), hoa văn karang
  const yb = 0.45 * k + (0.35 + 0.4 + 0.25) * k, hb = 3.0 * k, rb = r0 * 0.82 * k;
  acc.add('carveParas', boxB(rb * 0.62, hb * 0.66, 0.08, x0 + s * rb * 0.5, yb + hb * 0.17, zc + rb * 0.92 + 0.02));
  acc.add('carveParas', boxB(0.08, hb * 0.66, rb * 1.1, x0 + s * (rb + 0.02), yb + hb * 0.17, zc));
  acc.add('carveGold', boxB(rb * 0.3, 0.5 * k, 0.1, x0 + s * rb * 0.5, yb + hb * 0.72, zc + rb * 0.92 + 0.08));
  for (const q of [-1, 1]) acc.add('parasBand', boxB(0.36, hb, 0.36, x0 + s * (rb - 0.18), yb, zc + q * (rb * 0.92 - 0.18)));
  // mũ giật cấp (7 tầng) với chóp nhỏ ở góc ngoài
  let r = r0 * 0.86;
  for (let i = 0; i < 7; i++) {
    const h = (0.82 - i * 0.04) * k, rr = r * k;
    acc.add(i % 2 ? 'brick' : 'brickDk', boxB(rr, h * 0.7, 2 * rr * 0.92, x0 + s * rr / 2, y, zc)); acc.add('parasBand', boxB(rr + 0.08, h * 0.3, 2 * rr * 0.92 + 0.12, x0 + s * (rr + 0.08) / 2, y + h * 0.7, zc));
    for (const q of [-1, 1]) acc.add('carveSpire', lathe([[0.16, 0], [0.12, 0.2], [0.14, 0.32], [0.001, 0.62]].map(([a, b]) => [a * k * (1 - i * 0.07), b * k * (1 - i * 0.06)]), x0 + s * (rr - 0.14 * k), y + h, zc + q * (rr * 0.92 - 0.14 * k), 6));
    acc.add('carveParas', boxB(0.1, h * 0.5, rr * 0.9, x0 + s * (rr + 0.02), y + h * 0.1, zc));
    y += h; r *= 0.82;
  }
  acc.add('parasBand', boxB(r * k, 0.6 * k, 2 * r * k * 0.92, x0 + s * r * k / 2, y, zc)); murdha(acc, x0 + s * 0.02, y + 0.6 * k, zc, 0.55 * k, 'carveParas');
  return y + 1.5 * k;
}
function gate(styleId, S, g) {
  const acc = new Acc(), k = g.villa ? 0.5 : 1, x0 = g.w / 2, r0 = 3.0 * k, zc = -r0 * 0.92 - 0.02, wingL = g.villa ? 1.6 : 2.4;
  // nền đá thấp có bậc hai phía
  acc.add('baseParas', boxB(2 * (x0 + r0 + 0.4), 0.45 * k, 2 * r0 + 0.6, 0, 0, zc)); acc.plat({ x: 0, z: zc, w: 2 * x0, d: 2 * r0 + 0.6, top: 0.45 * k });
  for (const dir of [1, -1]) { const sub = new Acc(); steps(sub, { x: 0, zTop: zc + dir * (r0 + 0.3), w: 2 * x0 - 0.4, h: 0.45 * k, dir, key: 'stepParas' }); place(acc, sub); }
  let top = 0;
  for (const s of [-1, 1]) top = candiHalf(acc, s * x0, s, zc, r0, k);
  // tường rào gạch đỏ hai bên (chân + mũ paras)
  for (const s of [-1, 1]) {
    const xa = s * (x0 + r0 * 0.9), xb = s * (x0 + r0 * 0.9 + wingL), cx = (xa + xb) / 2, wh = 2.4 * Math.max(0.8, k);
    acc.add('parasBand', boxB(wingL, 0.4, 0.8, cx, 0, -0.4)); acc.add('brick', boxB(wingL, wh - 0.6, 0.6, cx, 0.4, -0.4));
    acc.add('parasBand', boxB(wingL + 0.1, 0.18, 0.78, cx, 0.4 + wh - 0.6, -0.4)); acc.add('parasBand', boxB(wingL, 0.22, 0.5, cx, wh - 0.02, -0.4));
    acc.add('carveParas', boxB(wingL * 0.5, 0.8, 0.06, cx, 0.9, -0.08));
  }
  return out(acc, { kind: 'candi-bentar', top });
}

export const BALI = { hall, tower, pav, gate };
