// ============================================================================
//  NHÀ Ở NHẬT 2 TẦNG cho biệt phủ / biệt thự «nhatban» (docs/bietphu/jp.md) — dựng theo tham số bằng bộ khung tiên phủ
//  jp-kit.js (CHỈ import): jpRoof (irimoya / kirizuma), skirtRoof (下屋 mái hiên vòng), karaHafu, stoneBlock (石垣), steps.
//  Nguyên mẫu: dinh shoin-zukuri 2 tầng thời Edo cuối — Seisonkaku 成巽閣 (Kanazawa 1863, tầng dưới buke shoin, tầng trên
//  sukiya), Hiunkaku 飛雲閣 (Nishi Hongan-ji), lầu ngự điện trên nền đá thành (御殿 trên 石垣); biệt thự: machiya Kyōto
//  (格子 song gỗ tầng trệt, 虫籠窓 cửa sổ trát tầng lửng, mái kirizuma ngói + 下屋).
//  Khuôn lô (archcity/estatekit.js): vách trên chu vi w × d, cửa giữa +z (và −z nếu back) mở thông ≥ 2,4 m,
//  sàn chiếu ở b.plinth trống, nền (w + 2,4) × (d + 2,4) mặt trên ở b.plinth (hiên ván 縁 phủ cả vành 1,2 m).
// ============================================================================
import * as THREE from 'three';
import {
  Acc, box, boxB, beam, slabXY, lathe, V, FACE, frameM, put, place, jpRoof, skirtRoof, roofProfileJ, karaHafu, steps, stoneBlock, jpMats,
} from '../tienphu/arch/jp-kit.js';
import { bayList } from '../tienphu/arch/jp-res.js';
import { tiled } from './mats.js';
import { strawTex, strawEndTex } from './est-jp-tex.js';

/** nhân UV (texture canvas lặp: chiếu, giấy ô cờ…) để 1 ô texture = 1 tấm thật */
export const uvScale = (g, su, sv) => { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); return g; };
export const edges = (bays) => { const L = bays.reduce((a, b) => a + b, 0), xs = [-L / 2]; for (const b of bays) xs.push(xs[xs.length - 1] + b); return xs; };

// ---------------------------------------------------------------- vật liệu: jp-kit (texture canvas cửa giấy, cửa ván, ô cờ đầu hồi…)
// + vật liệu lặp theo mét archcity/mats.js (vữa, gỗ, đá, ngói) — gắn qua retex(over) sau khi tách base / shell
const DS = THREE.DoubleSide;
let OVER = null;
export function jpOver() {
  if (OVER) return OVER;
  OVER = {
    plaster: tiled('plaster', '#fbf8f1', { rough: 0.95 }), plaster2: tiled('plaster', '#e6e1d6', { rough: 0.95 }),
    wood: tiled('plank', '#6e5239', { rough: 0.85 }), frame: tiled('plank', '#4d3a2a', { rough: 0.9 }), woodDk: tiled('plank', '#2e2925', { rough: 0.8 }),
    black: tiled('lacquer', '#1d1b19', { rough: 0.45 }),
    engawa: tiled('plank', '#8c6f50', { rough: 0.75 }), ceil: tiled('plank', '#a3845f', { rough: 0.9 }), board: tiled('plank', '#2f2721', { rough: 0.9 }),
    stone: tiled('stone', '#9b958a', { rough: 1, bump: 1.3 }), stoneC: tiled('stone', '#b2ac9e', { rough: 1 }), step: tiled('stone', '#aaa498', { rough: 1 }),
    tileJp: tiled('tile', '#8d9398', { rough: 0.7, side: DS }), ribJp: tiled('tile', '#80868b', { rough: 0.65 }), ridgeJp: tiled('tile', '#6a6f74', { rough: 0.6 }),
    tileSoffitWood: tiled('plank', '#5a4330', { rough: 0.9, side: DS }), tileSoffitW: tiled('plaster', '#ece8df', { rough: 0.95, side: DS }),
    carveRafter: tiled('plank', '#5d4531', { rough: 0.9 }), koshiBar: tiled('plank', '#3a2c21', { rough: 0.85 }), railBar: tiled('plank', '#3d3027', { rough: 0.85 }),
    tileJp2: tiled('tile', '#6f7d8e', { rough: 0.55, side: DS }), ribJp2: tiled('tile', '#647283', { rough: 0.5 }), ridgeJp2: tiled('tile', '#535f6e', { rough: 0.5 }),   // ngói 銀鼠 ánh lam
    earthWall: tiled('plaster', '#cdb58e', { rough: 1 }), bambooFence: tiled('plank', '#9c8a58', { rough: 0.8 }),
  };
  return OVER;
}
let MATS = null;
export function jpEstMats() {
  if (MATS) return MATS;
  const J = jpMats();
  const kaya = strawTex([118, 104, 80], { seed: 3, course: 48, blotch: 0.2 }), kEnd = strawEndTex([140, 124, 94], 4);   // 茅葺 kaya xám nâu (Katsura)
  const mk = (t, c, o = {}) => new THREE.MeshStandardMaterial({ roughness: 1, ...(t ? { map: t } : { color: c }), ...o });
  MATS = { ...J, ...jpOver(), floorTatami: J.tatami, floorToko: J.engawa, kitsune: J.lattice, scroll: J.ichi, glassDk: J.void,
    tileThatch: mk(kaya, '#7a6b52', { side: DS }), thatchEdge: mk(kEnd, '#8a7a5c') };
  return MATS;
}
/** khoá mái nhà ở: ngói bản xám, đầu hồi ô cờ 狐格子 sơn đen + 懸魚 vàng (bậc vừa bỏ ribJp / carveRafter / koshiBar) */
export const HOUSE_K = { tile: 'tileJp', rib: 'ribJp', edge: 'wood', ridge: 'ridgeJp', soffit: 'tileSoffitWood', gable: 'kitsune', barge: 'wood', gegyo: 'gold', oni: 'ridgeJp', fit: 'gold' };
export const HOUSE_KV = { ...HOUSE_K, gable: 'plaster', gegyo: 'wood', fit: null };   // biệt thự: hồi trát trắng, không vàng
export const HOUSE_K2 = { ...HOUSE_KV, tile: 'tileJp2', rib: 'ribJp2', ridge: 'ridgeJp2', oni: 'ridgeJp2' };      // ngói xám lam
export const KOKERA_K = { tile: 'tileKokera', edge: 'kokeraEdge', ridge: 'kokeraEdge', soffit: 'tileSoffitWood', gable: 'earthWall', barge: 'frame', gegyo: 'frame', oni: 'kokeraEdge' }; // mái ván 杮葺

/** rui kép 二軒 lộ dưới hiên một mái jpRoof R (nửa vách hx, hz; mép hiên ex, ez) — khoá carveRafter (bậc vừa bỏ) */
export function rafters(acc, R, { hx, hz, ex, ez, th, ends = ['hip', 'hip'], step = 0.55, key = 'carveRafter', ring = false }) {
  const rf = (a, c) => acc.add(key, beam(a, c, 0.12, 0.15)), dmx = ex - hx, dmz = ez - hz;
  for (const sz of [1, -1]) for (let x = -ex + 0.35; x < ex - 0.3; x += step) {
    const e = Math.max(0, Math.abs(x) - hx); if (ends[x < 0 ? 0 : 1] === 'gable' && e > 0) continue;
    const z0 = sz * (hz + e), z1 = sz * (ez - 0.06), d0 = ez - Math.abs(z0), dm = dmz * 0.5; if (d0 < 0.3) continue;
    rf(V(x, R.Y(x, z0, d0) - th - 0.12, z0), V(x, R.Y(x, sz * (ez - dm), dm) - th - 0.12, sz * (ez - dm)));
    rf(V(x, R.Y(x, sz * (ez - dm - 0.3), dm + 0.3) - th - 0.02, sz * (ez - dm - 0.3)), V(x, R.Y(x, z1, 0.06) - th - 0.02, z1));
  }
  for (const i of [0, 1]) {
    if (ends[i] === 'gable') continue; const sx = i ? 1 : -1;
    for (let z = -ez + 0.35; z < ez - 0.3; z += step) {
      const e = Math.max(0, Math.abs(z) - hz), x0 = sx * (hx + e), x1 = sx * (ex - 0.06), d0 = ex - Math.abs(x0), dm = dmx * 0.5; if (d0 < 0.3) continue;
      rf(V(x0, R.Y(x0, z, d0) - th - 0.12, z), V(sx * (ex - dm), R.Y(sx * (ex - dm), z, dm) - th - 0.12, z));
      rf(V(sx * (ex - dm - 0.3), R.Y(sx * (ex - dm - 0.3), z, dm + 0.3) - th - 0.02, z), V(x1, R.Y(x1, z, 0.06) - th - 0.02, z));
    }
  }
}

/** nền: 石垣 đá đẽo (切込接, nghiêng nhẹ, góc 算木積) + gầm tối có cột chống 束 và dầm mép 縁葛 + sàn hiên ván phủ cả mặt nền ở plinth,
 *  bậc đá giữa trước (và sau nếu back) rộng min(6, 0,3 w) có má bậc đá */
export function jpPlinth(acc, b, { stoneKey = 'stone', capKey = 'stoneC' } = {}) {
  const ph = b.plinth, PW = b.w + 2.4, PD = b.d + 2.4, sw = Math.min(6, b.w * 0.3), big = ph >= 1.6;
  const yS = big ? ph - 0.66 : Math.max(0.28, ph - 0.58), yB = ph - 0.12;
  stoneBlock(acc, { hx: PW / 2, hz: PD / 2, y0: 0, y1: yS, B: big ? 0.3 : 0.05, p: 1.6, cap: capKey, capT: 0.16, sangiOn: big });
  if (stoneKey !== 'stone') for (const k of ['stone']) { const L = acc.parts.get(k); if (L) { acc.parts.delete(k); for (const g of L) acc.add(stoneKey, g); } }
  acc.add('void', boxB(PW - 0.56, yB - yS, PD - 0.56, 0, yS, 0));                                  // gầm (縁の下) lùi 0,28
  for (const [ax, L, o] of [['x', PW, PD / 2], ['x', PW, -PD / 2], ['z', PD, PW / 2], ['z', PD, -PW / 2]]) {
    const n = Math.max(2, Math.round(L / 1.95));
    acc.add('frame', ax === 'x' ? boxB(L, 0.22, 0.2, 0, yB - 0.22, o - Math.sign(o) * 0.1) : boxB(0.2, 0.22, L, o - Math.sign(o) * 0.1, yB - 0.22, 0));
    for (let i = 0; i <= n; i++) { const u = -L / 2 + 0.2 + ((L - 0.4) * i) / n; acc.add('frame', ax === 'x' ? boxB(0.15, yB - 0.22 - yS, 0.15, u, yS, o - Math.sign(o) * 0.22) : boxB(0.15, yB - 0.22 - yS, 0.15, o - Math.sign(o) * 0.22, yS, u)); }
  }
  acc.add('engawa', boxB(PW, 0.12, PD, 0, yB, 0)); acc.plat({ x: 0, z: 0, w: PW, d: PD, top: ph });
  for (const dir of b.back ? [1, -1] : [1]) {
    const zTop = dir * PD / 2, run = steps(acc, { x: 0, zTop, w: sw, h: ph, dir, key: 'step' });
    for (const s of [-1, 1]) acc.add(capKey, slabXY([[0, 0], [run + 0.25, 0], [run + 0.25, 0.32], [0, ph + 0.18]].map(([a, y]) => [zTop + dir * a, y]), 0.4, s * (sw / 2 + 0.2), 0, 0, -Math.PI / 2));
  }
  return { PW, PD, sw, yS };
}

/** một mặt nhà (khung mặt m, dài L, mép gian E): kiểu 'shoin' (cửa trượt 舞良戸 / 明障子, 欄間, 長押, 小壁 vữa), 'upper' (腰壁 + cửa sổ giấy),
 *  'machiya' (song gỗ 格子 trước cửa giấy), 'plain' (vách trát kín + 1 cửa sổ song), 'mushiko' (vách trát + cửa sổ 虫籠窓) — open: chỉ số gian bỏ trống */
export function jpFace(acc, m, { L, E, y0, yTop, kind = 'shoin', open = [], hD = 2.35, pattern = 'mmsm', gold = false, wallKey = 'plaster' }) {
  const hT = 0.42, yK = y0 + hD;
  put(acc, m, 'wood', box(L + 0.3, 0.28, 0.3, 0, yTop - 0.14, 0));                                      // 桁 / 頭貫
  if (kind === 'shoin' || kind === 'machiya') {
    put(acc, m, 'wood', box(L, 0.1, 0.24, 0, y0 + 0.05, 0)); put(acc, m, 'wood', box(L, 0.16, 0.2, 0, yK + 0.08, 0));   // 敷居, 鴨居
    const yN = yK + 0.16 + hT;
    put(acc, m, 'wood', box(L + 0.3, 0.22, 0.11, 0, yN + 0.11, 0.16));                                     // 長押
    if (yTop - 0.28 > yN + 0.22) put(acc, m, wallKey, box(L, yTop - 0.28 - (yN + 0.22), 0.13, 0, (yTop - 0.28 + yN + 0.22) / 2, 0.01));
    for (let i = 0; i < E.length - 1; i++) {
      const u0 = E[i], u1 = E[i + 1], bw = u1 - u0 - 0.26, cu = (u0 + u1) / 2;
      put(acc, m, 'shoji', box(bw, hT, 0.05, cu, yK + 0.16 + hT / 2, 0));                                   // 欄間 giấy
      if (open.includes(i)) continue;
      const p = pattern[i % pattern.length], key = kind === 'machiya' ? 'shoji' : p === 's' ? 'shoji' : 'mairado';
      for (const s of [-1, 1]) put(acc, m, key, box(bw / 2 + 0.04, hD - 0.06, 0.05, cu + s * (bw / 4), y0 + 0.1 + (hD - 0.06) / 2, s * 0.045));
      if (kind === 'machiya') { const n = Math.round(bw / 0.105); for (let k = 0; k < n; k++) put(acc, m, 'koshiBar', box(0.045, hD - 0.1, 0.06, u0 + 0.13 + (bw * (k + 0.5)) / n, y0 + 0.1 + (hD - 0.1) / 2, 0.16)); put(acc, m, 'koshiBar', box(bw, 0.08, 0.08, cu, yK - 0.02, 0.16)); put(acc, m, 'koshiBar', box(bw, 0.08, 0.08, cu, y0 + 0.14, 0.16)); }
    }
    if (gold) for (const u of E) put(acc, m, 'gold', box(0.2, 0.15, 0.05, u, yN + 0.11, 0.24));            // 釘隠
  } else if (kind === 'upper') {
    const ys = y0 + 0.82, yw = ys + 1.32;
    put(acc, m, wallKey, box(L, 0.82, 0.13, 0, y0 + 0.41, 0.01)); put(acc, m, 'wood', box(L + 0.1, 0.1, 0.24, 0, ys, 0.02));
    put(acc, m, 'wood', box(L, 0.14, 0.2, 0, yw + 0.07, 0)); put(acc, m, wallKey, box(L, yTop - 0.28 - (yw + 0.14), 0.13, 0, (yTop - 0.28 + yw + 0.14) / 2, 0.01));
    for (let i = 0; i < E.length - 1; i++) {
      const u0 = E[i], u1 = E[i + 1], bw = u1 - u0 - 0.26, cu = (u0 + u1) / 2;
      for (const s of [-1, 1]) put(acc, m, 'shoji', box(bw / 2 + 0.03, yw - ys - 0.04, 0.05, cu + s * (bw / 4), (ys + yw) / 2, s * 0.04));
    }
  } else { // plain / mushiko: vách trát kín, chân ván đen
    put(acc, m, 'board', box(L, 0.95, 0.15, 0, y0 + 0.475, 0.02)); put(acc, m, wallKey, box(L, yTop - 0.28 - (y0 + 0.95), 0.13, 0, (yTop - 0.28 + y0 + 0.95) / 2, 0.01));
    put(acc, m, 'wood', box(L + 0.06, 0.08, 0.2, 0, y0 + 0.97, 0.03));
    if (kind === 'mushiko') {
      const n = Math.max(1, Math.round(L / 3.2)), hh = Math.min(0.75, (yTop - y0) * 0.32), yc = (y0 + yTop) / 2 + 0.15;
      for (let k = 0; k < n; k++) { const cu = -L / 2 + (L * (k + 0.5)) / n; put(acc, m, 'void', box(1.8, hh, 0.05, cu, yc, 0.07)); for (let j = 0; j < 9; j++) put(acc, m, 'plaster', box(0.09, hh, 0.12, cu - 0.9 + (1.8 * (j + 0.5)) / 9, yc, 0.11)); put(acc, m, 'plaster', box(2.0, 0.08, 0.14, cu, yc - hh / 2 - 0.04, 0.11)); }
    } else {
      const n = Math.max(1, Math.round(L / 6));
      for (let k = 0; k < n; k++) { const cu = -L / 2 + (L * (k + 0.5)) / n, yc = y0 + 1.6; put(acc, m, 'void', box(1.2, 0.9, 0.05, cu, yc, 0.07)); for (let j = 0; j < 8; j++) put(acc, m, 'koshiBar', box(0.05, 0.9, 0.06, cu - 0.6 + (1.2 * (j + 0.5)) / 8, yc, 0.12)); put(acc, m, 'wood', box(1.4, 0.08, 0.2, cu, yc - 0.49, 0.1)); put(acc, m, 'wood', box(1.4, 0.08, 0.16, cu, yc + 0.49, 0.1)); }
    }
  }
}

/** cột vuông vát trên mọi điểm gian của chu vi hx × hz */
function postsRing(acc, xs, zs, hx, hz, y0, h, s = 0.26) {
  const pts = []; for (const x of xs) for (const z of [-hz, hz]) pts.push([x, z]); for (const z of zs.slice(1, -1)) for (const x of [-hx, hx]) pts.push([x, z]);
  for (const [x, z] of pts) acc.add('wood', boxB(s, h, s, x, y0, z));
}

/**
 * NHÀ NHẬT 2 TẦNG trên nền: b = { w, d, h, plinth, back, floors }, o = {
 *   h1 (cao trệt tới chân mái hiên vòng), h2 (cao tầng trên), ins (lùi tầng trên), ov1, ov2 (vươn hiên), bay,
 *   lower: { S, N, E, W } (kiểu mặt trệt), upper (kiểu mặt lầu, 'upper' | 'mushiko'), ends (mái đỉnh), ridgeH, K, gold, kara (軒唐破風 trên mái hiên vòng trước) }
 */
export function jpHouse(b, o = {}) {
  const acc = new Acc(), w = b.w, d = b.d, ph = b.plinth, hw = w / 2, hd = d / 2, K = o.K || HOUSE_K;
  jpPlinth(acc, b);
  acc.add('floorTatami', uvScale(boxB(w - 0.3, 0.035, d - 0.3, 0, ph - 0.015, 0), (w - 0.3) / 1.91, (d - 0.3) / 0.955));  // chiếu Kyō-ma 1,91 × 0,955
  const bay = o.bay ?? 2.4, xs = edges(bayList(w, bay, 3.2)), zs = edges(bayList(d, bay)), ci = (xs.length - 2) / 2;
  const two = (b.floors || 1) > 1, ins = o.ins ?? 1.4, w2 = w - 2 * ins, d2 = d - 2 * ins, y2 = ph + o.h1, ov1 = o.ov1 ?? 1.8;
  // ---- mái hiên vòng 下屋 (nhà 2 tầng) — tính trước để vách trệt dừng ngay dưới mặt dưới mái
  let yW = ph + o.h1, skirt = null;
  if (two) {
    skirt = skirtRoof(acc, { hx: hw, hz: hd, over: ov1, ix: w2 / 2, iz: d2 / 2, root: y2 + 0.5, K, rib: o.rib ?? 0.46, ribW: 0.2, lift: 0.1, slopes: o.slopes1 || [[ov1, 0.4], 0.5] });
    yW = skirt.Y(0, hd, ov1) - 0.3;
    rafters(acc, skirt, { hx: hw, hz: hd, ex: skirt.ex, ez: skirt.ez, th: 0.26, ring: true });
  }
  // ---- trệt: cột, mặt nhà, trần
  postsRing(acc, xs, zs, hw, hd, ph, yW - ph);
  const lw = o.lower || {};
  for (const f of 'SNEW') {
    const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? w : d, E = f === 'S' || f === 'N' ? xs : zs, m = frameM(nx, nz, nx * hw, nz * hd);
    const open = f === 'S' || (f === 'N' && b.back) ? [ci] : [];
    jpFace(acc, m, { L, E, y0: ph, yTop: yW, kind: lw[f] || 'shoin', open, pattern: f === 'S' ? (o.patS || 'msms') : 'mmms', gold: !!o.gold, wallKey: o.wallKey });
  }
  acc.add('ceil', boxB(w - 0.3, 0.06, d - 0.3, 0, yW - 0.36, 0));
  for (let x = -hw + 1.0; x < hw - 0.5; x += 0.9) acc.add('frame', boxB(0.05, 0.05, d - 0.4, x, yW - 0.41, 0));        // 竿縁 trần ván
  // ---- nội thất: 床の間 + 違棚 ở vách sau, lệch trái (chừa cửa hậu)
  {
    const tw = Math.min(3.6, w * 0.22), xt = -Math.min(hw - tw / 2 - 0.5, Math.max(tw / 2 + 1.8, w * 0.22)), zt = -hd + 0.16, hh = Math.min(yW - ph - 0.6, 2.6);
    acc.add('floorToko', boxB(tw, 0.16, 0.9, xt, ph, zt + 0.45)); acc.add('earthWall', boxB(tw, hh, 0.06, xt, ph + 0.16, zt + 0.03));
    acc.add('fusuma', boxB(0.62, 1.5, 0.03, xt, ph + 0.75, zt + 0.08)); acc.add('bark', boxB(0.14, hh + 0.16, 0.14, xt + tw / 2, ph, zt + 0.9));
    acc.add('frame', boxB(tw + 0.1, 0.18, 0.12, xt, ph + hh, zt + 0.9)); acc.add('plaster', boxB(tw, yW - 0.4 - (ph + hh + 0.18), 0.1, xt, ph + hh + 0.18, zt + 0.9));
    const xc = xt + tw / 2 + 1.0; acc.add('floorToko', boxB(1.8, 0.12, 0.8, xc, ph, zt + 0.4)); acc.add('fusuma', boxB(1.8, 0.7, 0.04, xc, ph + 0.12, zt + 0.82));
    acc.add('wood', boxB(0.95, 0.05, 0.42, xc - 0.42, ph + 1.25, zt + 0.25)); acc.add('wood', boxB(0.95, 0.05, 0.42, xc + 0.42, ph + 1.45, zt + 0.25)); acc.add('wood', boxB(0.05, 0.25, 0.42, xc, ph + 1.25, zt + 0.25)); // 違棚
    acc.add('fusuma', boxB(1.8, 0.55, 0.04, xc, yW - 0.4 - 0.55, zt + 0.82));
  }
  let top = yW, R = null;
  if (two) {
    // ---- lầu: sàn, cột, mặt nhà (cửa sổ giấy / 虫籠窓), mái đỉnh
    const hx2 = w2 / 2, hz2 = d2 / 2, xs2 = edges(bayList(w2, bay, 0)), zs2 = edges(bayList(d2, bay)), yT = y2 + o.h2;
    acc.add('frame', boxB(w2 + 0.1, 0.3, d2 + 0.1, 0, y2 - 0.3, 0));
    postsRing(acc, xs2, zs2, hx2, hz2, y2 - 0.3, yT - y2 + 0.3);
    for (const f of 'SNEW') { const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? w2 : d2, E = f === 'S' || f === 'N' ? xs2 : zs2; jpFace(acc, frameM(nx, nz, nx * hx2, nz * hz2), { L, E, y0: y2, yTop: yT + 0.1, kind: (o.upperF && o.upperF[f]) || o.upper || 'upper', wallKey: o.wallKey2 || o.wallKey }); }
    // mái đỉnh: nóc theo x (平入り) hoặc theo z — đầu hồi quay ra đường (妻入り, ridgeZ)
    const rz = !!o.ridgeZ, lx = rz ? hz2 : hx2, lz = rz ? hx2 : hz2, sub = rz ? new Acc() : acc;
    const ov2 = o.ov2 ?? 2.0, ex = lx + ov2, ez = lz + ov2, prof = roofProfileJ(ez, o.slopes2 || [[ov2, 0.42], 0.55, 0.68, 0.8], Math.max(10, Math.ceil(ez / 0.9)));
    const ends = o.ends || ['irimoya', 'irimoya'], yE = yT + 0.42 - prof.P(ov2);
    R = jpRoof(sub, { ex, ez, yE, prof, ends, dG: ov2 + lz * 0.42, K, rib: o.rib ?? 0.46, ribW: 0.2, ridgeH: o.ridgeH ?? 0.9, ridgeW: 0.62, soffit: ov2 - 0.1, thick: 0.3, caps: true, lift: 0.16, verge: ends[0] === 'gable' ? 0.75 : 0.55, gegyoS: Math.min(1.5, 0.5 + 2 * lz * 0.07) });
    rafters(sub, R, { hx: lx, hz: lz, ex, ez, th: 0.3, ends });
    if (rz) { // vách hồi trên (妻壁) có thanh 貫 lộ
      for (const sx of [-1, 1]) for (const yy of [yT + 0.35, yT + 1.0]) { const hwid = Math.max(0.3, lz - (yy - yT) / 0.62); sub.add('wood', boxB(0.14, 0.16, 2 * hwid, sx * (lx + 0.02), yy, 0)); }
      place(acc, sub, 0, 0, Math.PI / 2);
    }
    // lan can gỗ 手摺 trước cửa sổ lầu mặt tiền (đứng trên mái hiên vòng)
    if (o.rail) {
      const zr = hz2 + 0.42, yb = y2 + 0.45, yr = y2 + 1.25; acc.add('railBar', boxB(w2 - 0.4, 0.09, 0.12, 0, yr, zr)); acc.add('railBar', boxB(w2 - 0.4, 0.07, 0.1, 0, yb + 0.12, zr));
      for (let x = -hx2 + 0.3; x <= hx2 - 0.29; x += 0.24) acc.add('railBar', boxB(0.05, yr - yb, 0.05, x, yb, zr));
      for (const x of [-hx2 + 0.2, hx2 - 0.2, 0]) acc.add('railBar', box(0.1, 0.1, 0.5, x, yb + 0.1, zr - 0.25));
    }
    top = R.top;
  }
  // ---- 軒唐破風 trên mái hiên vòng, giữa mặt trước (dinh chính)
  if (o.kara && skirt) {
    const kw = Math.min(w * 0.2, xs[ci + 1] - xs[ci] + 2.6), hk = kw * 0.21;
    karaHafu(acc, frameM(0, 1, 0, hd), { f: ov1 - 0.05, yE: skirt.yE - 0.02, w: kw, hk, L: 2 * hk + 1.6, K, rib: 0.42, ribW: 0.18 });
  }
  return { acc, info: { kind: 'jp-house', top, yW, y2, bays: xs.length - 1 } };
}
