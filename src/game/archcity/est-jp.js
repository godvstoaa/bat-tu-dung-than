// ============================================================================
//  HỌ «jp» cho biệt phủ (docs/bietphu/jp.md, hợp đồng docs/bietphu/00-HOP-DONG.md):
//   · nhatban — Dinh Thự Nhật Bản (phủ + khu biệt thự Anh Hoa Lý): bộ khung tiên phủ jp-kit / jp.js / jp-res.js (CHỈ import)
//       nhà: dinh 2 tầng shoin-zukuri trên nền đá thành (est-jp-house.js) · biệt thự: machiya Kyōto 2 tầng
//       tháp: thiên thủ nhỏ 4 tầng mái trên 石垣 (jpYagura) · đình: azumaya mái tranh chóp vuông (jpAzumaya) trên nền đá
//       cổng phủ: nagaya-mon 長屋門 (cổng yakuimon giữa + hai dãy nhà lính) · cổng biệt thự: munamon 棟門
//   · bali — Biệt Viện Bali (chỉ phủ): est-jp-bali.js (bale trên bataran gạch đỏ + đá paras, mái tranh alang-alang,
//       tháp meru 11 tầng mái ijuk, đình bale bengong, cổng candi bentar)
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, beam, slabXY, V, FACE, frameM, put, place, jpRoof, roofProfileJ, steps, hazamaRow, castleWin } from '../tienphu/arch/jp-kit.js';
import { jpYagura } from '../tienphu/arch/jp.js';
import { jpAzumaya } from '../tienphu/arch/jp-res.js';
import { retex, consolidate } from './mats.js';
import { jpHouse, jpEstMats, jpOver, HOUSE_K, HOUSE_KV, HOUSE_K2, KOKERA_K, rafters } from './est-jp-house.js';
import { BALI } from './est-jp-bali.js';

const finish = (g) => consolidate(retex(g, jpOver()));
const res = (r, kind) => ({ acc: r.acc, mats: jpEstMats(), post: finish, info: { ...(r.info || {}), kind } });

// ---------------------------------------------------------------- NHÀ
/** nhà chính / đông sương / biệt thự — b.h là cao hiên trên nền: trệt h1 + lầu h2 ≈ b.h − 1 */
function hall(styleId, S, b, opt = {}) {
  if (styleId === 'bali') return BALI.hall(styleId, S, b, opt);
  if (opt.villa) {
    // 3 biến thể (hợp đồng §3 «Biến thể biệt thự»): 0 machiya Kyōto (平入り kirizuma ngói xám, trệt song 千本格子, lầu 虫籠窓)
    //   1 nhà sukiya võ gia (irimoya mái ván 杮葺, vách đất 聚楽, trệt cửa giấy 7 gian hẹp, lầu cửa sổ giấy quanh)
    //   2 nhà 妻入り đầu hồi ra đường (kirizuma nóc dọc, ngói xám lam, 3 gian rộng, lan can 手摺 trước cửa sổ lầu)
    const v = (opt.variant | 0) % 3, h1 = Math.max(3.6, b.h * 0.54), h2 = Math.max(2.8, b.h * 0.4);
    const P = [
      { h1, h2, ins: 0.9, ov1: 1.15, ov2: 0.95, bay: 2.2, K: HOUSE_KV, ends: ['gable', 'gable'], ridgeH: 0.55,
        lower: { S: 'machiya', N: 'plain', E: 'plain', W: 'plain' }, upperF: { S: 'mushiko', N: 'upper', E: 'mushiko', W: 'mushiko' },
        slopes1: [[1.15, 0.42], 0.5], slopes2: [[0.95, 0.45], 0.55, 0.62] },
      { h1: h1 - 0.15, h2, ins: 1.15, ov1: 1.35, ov2: 1.3, bay: 1.8, K: KOKERA_K, rib: 1e6, ends: ['irimoya', 'irimoya'], ridgeH: 0.42, wallKey: 'earthWall', patS: 'ssms',
        lower: { S: 'shoin', N: 'shoin', E: 'plain', W: 'shoin' }, upper: 'upper', slopes1: [[1.35, 0.45], 0.55], slopes2: [[1.3, 0.48], 0.62, 0.74] },
      { h1: h1 + 0.1, h2: h2 + 0.15, ins: 0.75, ov1: 1.0, ov2: 0.85, bay: 3.4, K: HOUSE_K2, ends: ['gable', 'gable'], ridgeZ: true, rail: true, ridgeH: 0.5, patS: 'mmmm',
        lower: { S: 'shoin', N: 'plain', E: 'plain', W: 'plain' }, upperF: { S: 'upper', N: 'mushiko', E: 'plain', W: 'plain' },
        slopes1: [[1.0, 0.4], 0.48], slopes2: [[0.85, 0.5], 0.62, 0.7] },
    ][v];
    return res(jpHouse(b, P), ['machiya', 'sukiya', 'tsumairi'][v]);
  }
  const main = b.id === 'main';
  const h1 = main ? Math.max(4.4, b.h * 0.46) : Math.max(3.9, b.h * 0.56), h2 = main ? Math.max(3.6, b.h * 0.36) : Math.max(3.0, b.h * 0.42);
  const r = jpHouse(b, main
    ? { h1, h2, ins: 1.8, ov1: 2.0, ov2: 2.3, bay: 2.4, gold: true, kara: true, ridgeH: 1.15, slopes1: [[2.0, 0.4], 0.5], slopes2: [[2.3, 0.4], 0.55, 0.68, 0.8] }
    : { h1, h2, ins: 1.3, ov1: 1.6, ov2: 1.8, bay: 2.3, ridgeH: 0.85, slopes1: [[1.6, 0.4], 0.5], slopes2: [[1.8, 0.42], 0.56, 0.7], patS: 'mmsm' });
  return res(r, main ? 'shoin-2' : 'shoin-2s');
}

// ---------------------------------------------------------------- THÁP
/** thiên thủ nhỏ 4 重 (tầng tháp hình 層塔型, kiểu Marugame / Uwajima phóng cao): bệ 石垣 7 m nghiêng cong, thân trát trắng thu tầng,
 *  chidori-hafu / kara-hafu xen mặt, hộc thả đá, shachi — vừa lô 10 × 10 (chân đá ≤ 10 m), cao ≈ 31 m */
function tower(styleId, S, t) {
  if (styleId === 'bali') return BALI.tower(styleId, S, t);
  const k = Math.min(1, t.w / 10), bh = 8.0;
  const r = jpYagura({
    base: { h: bh, B: 0.75 * k, m: 0.28 },
    tiers: [
      { hx: 3.6 * k, hz: 3.3 * k, h: 4.8, over: 1.5, root: 0.5, slopes: [[1.5, 0.42], 0.52] },
      { hx: 3.0 * k, hz: 2.75 * k, h: 4.0, over: 1.35, root: 0.5, slopes: [[1.35, 0.42], 0.52] },
      { hx: 2.4 * k, hz: 2.2 * k, h: 3.7, over: 1.25, root: 0.5, slopes: [[1.25, 0.42], 0.52] },
      { hx: 1.95 * k, hz: 1.75 * k, h: 3.5 },
    ],
    top: { over: 1.3, ridge: 'x', ridgeH: 0.6, ridgeEnd: 'shachi', shachiS: 0.8 },
    win: { 0: { S: 2, N: 2, E: 2, W: 2 }, 1: { S: 2, N: 2, E: 2, W: 2 }, 2: { S: 1, N: 1, E: 2, W: 2 }, 3: { S: 2, N: 2, E: 1, W: 1 } },
    hafu: [{ tier: 0, face: 'S', kind: 'chidori', w: 3.6, h: 1.7 }, { tier: 0, face: 'N', kind: 'chidori', w: 3.6, h: 1.7 },
      { tier: 1, face: 'E', kind: 'chidori', w: 2.8, h: 1.35 }, { tier: 1, face: 'W', kind: 'chidori', w: 2.8, h: 1.35 }, { tier: 2, face: 'S', kind: 'kara', w: 2.6, hk: 0.6 }],
    bays: [{ tier: 0, face: 'E', u: 0, w: 2.0 }, { tier: 0, face: 'W', u: 0, w: 2.0 }],
    winW: 0.85, mortar: true,
  });
  // cửa vào ở chân bệ đá (mặt Nam): khung gỗ đen + cánh sắt + bậc đá
  const acc = r.acc, z0 = 3.3 * k + 0.28 + 0.75 * k + 0.02;
  acc.add('void', boxB(1.8, 2.5, 0.06, 0, 0, z0)); for (const s of [-1, 1]) acc.add('black', boxB(0.32, 2.7, 0.36, s * 1.05, 0, z0)); acc.add('black', boxB(2.6, 0.36, 0.4, 0, 2.6, z0));
  acc.add('iron', boxB(0.9, 2.45, 0.1, -0.5, 0, z0 + 0.05)); acc.add('stoneC', boxB(3.0, 0.16, 1.0, 0, 0, z0 + 0.5));
  return res(r, 'tenshu');
}

// ---------------------------------------------------------------- ĐÌNH
/** đình bên ao: azumaya 東屋 mái tranh chóp vuông 宝形 (Manji-tei Katsura) phóng ×1,3, trên nền đá 0,5 m có bậc */
function pav(styleId, S, pv) {
  if (styleId === 'bali') return BALI.pav(styleId, S, pv);
  const acc = new Acc(), a = Math.min(pv.w, pv.d) / 2 - 1.05, y0 = 0.38;
  acc.add('stone', boxB(pv.w, y0, pv.d, 0, 0, 0)); acc.add('stoneC', boxB(pv.w + 0.12, 0.1, pv.d + 0.12, 0, y0 - 0.08, 0));
  steps(acc, { x: 0, zTop: pv.d / 2, w: 2.2, h: y0 + 0.02, key: 'step' });
  const r = jpAzumaya({ a, colH: Math.max(2.8, pv.h - 0.4), over: 1.05 });
  place(acc, r.acc, 0, 0, 0, y0);
  return { acc, mats: jpEstMats(), post: finish, info: { ...r.info, kind: 'azumaya' } };
}

// ---------------------------------------------------------------- CỔNG
const GATE_K = { ...HOUSE_K, edge: 'woodDk', barge: 'woodDk', gable: 'plaster', gegyo: 'gold' };
/** mái kirizuma (nóc theo x) nhỏ: nửa dài ex, nửa sâu ez (tới mép hiên), cao mép yE, tâm (cx, cz) */
function gableRoof(acc, { ex, ez, yE, cx = 0, cz = 0, slopes = [[0.9, 0.45], 0.58], K = GATE_K, ridgeH = 0.55, ends = ['gable', 'gable'], rib = 0.46, ov = 1.0 }) {
  const prof = roofProfileJ(ez, slopes, 8);
  return jpRoof(acc, { nx: 10, ex, ez, yE, prof, ends, K, rib, ribW: 0.18, ridgeH, ridgeW: 0.5, verge: 0.5, gableFace: ends[0] === 'gable' ? true : undefined, soffit: ov, caps: true, lift: 0.06, thick: 0.24, gegyoS: 0.6, dG: ov + (ez - ov) * 0.4, m: new THREE.Matrix4().makeTranslation(cx, 0, cz) });
}

/** cổng phủ: NAGAYA-MON 長屋門 (cổng dinh võ gia thời Edo — vd. Akamon Kaga-yashiki 1827, nagaya-mon Hagi / Kakunodate):
 *  gian cổng giữa kiểu yakuimon 薬医門 (2 trụ chính + 2 trụ chống, xà 冠木, mái kirizuma ngói cao hơn) lối mở g.w, cánh gỗ nẹp sắt mở vào trong;
 *  hai dãy nhà lính 2 bên: tường dưới ván đen / 海鼠壁 trát ô ngói, trên vữa trắng, cửa sổ song 武者窓, mái irimoya thấp. Mặt ngoài sát z = 0. */
function gatePhu(acc, g) {
  const gw = g.w, xp = gw / 2 + 0.28, zf = -0.45, zr = -4.0, H = 5.1, wingL = 4.6, wd = 4.2, wh = 3.4;
  for (const s of [-1, 1]) {
    acc.add('stoneC', boxB(0.9, 0.3, 0.9, s * xp, 0, zf)); acc.add('stoneC', boxB(0.62, 0.25, 0.62, s * xp, 0, zr));
    acc.add('woodDk', boxB(0.5, H, 0.62, s * xp, 0.3, zf));                                  // 本柱
    acc.add('woodDk', boxB(0.34, H - 0.6, 0.34, s * xp, 0.25, zr));                             // 控柱
    for (const y of [2.9, H - 0.4]) acc.add('woodDk', boxB(0.22, 0.32, zf - zr, s * xp, y, (zf + zr) / 2));   // 貫
    acc.add('board', boxB(0.12, H - 0.75, gw / 2 - 0.15, s * (xp - 0.42), 0.3, zf - 0.32 - (gw / 2 - 0.15) / 2)); // cánh cổng mở vào trong
    for (const y of [0.9, 2.3, 3.7]) acc.add('iron', boxB(0.15, 0.12, gw / 2 - 0.25, s * (xp - 0.42), 0.3 + y, zf - 0.32 - (gw / 2 - 0.15) / 2));
  }
  acc.add('woodDk', boxB(2 * xp + 1.2, 0.62, 0.66, 0, 0.3 + H - 0.62, zf));                       // 冠木
  acc.add('woodDk', boxB(2 * xp + 0.6, 0.3, 0.4, 0, 0.3 + H + 0.25, zr));
  for (let x = -xp; x <= xp + 1e-6; x += (2 * xp) / 5) acc.add('woodDk', boxB(0.2, 0.26, zf - zr + 0.9, x, 0.3 + H, (zf + zr) / 2)); // xà đỡ kèo
  acc.add('gold', boxB(0.7, 0.7, 0.08, 0, 0.3 + H - 0.66, zf + 0.36));                                // huy hiệu 家紋
  gableRoof(acc, { ex: xp + 1.3, ez: (zf - zr) / 2 + 1.55, yE: 0.3 + H + 0.75, cz: (zf + zr) / 2, slopes: [[1.55, 0.45], 0.62], ridgeH: 0.7, ov: 1.55, rib: 0.52 });
  // hai dãy nhà lính 長屋 (nóc theo x): vách mặt ngoài sát z = 0
  for (const s of [-1, 1]) {
    const x0 = s * (xp + 0.35), x1 = s * (xp + 0.35 + wingL), cx = (x0 + x1) / 2, sub = new Acc(), hz = wd / 2;
    sub.add('stoneC', boxB(wingL, 0.4, wd, 0, 0, 0));
    for (const [z, f] of [[hz, 'S'], [-hz, 'N']]) {
      const m = frameM(0, Math.sign(z), 0, z);
      put(sub, m, 'board', box(wingL, 1.2, 0.3, 0, 0.4 + 0.6, -0.12)); put(sub, m, 'plaster', box(wingL, wh - 1.2, 0.3, 0, 0.4 + 1.2 + (wh - 1.2) / 2, -0.12));
      put(sub, m, 'woodDk', box(wingL + 0.1, 0.12, 0.34, 0, 1.62, -0.1));
      if (f === 'S') castleWin(sub, m, 0, 0.4 + 1.85, 2.2, 0.85, { barKey: 'woodDk', frameKey: 'woodDk' }); // 武者窓
    }
    for (const xx of [-wingL / 2, wingL / 2]) { sub.add('board', boxB(0.3, 1.2, wd, xx - Math.sign(xx) * 0.15, 0.4, 0)); sub.add('plaster', boxB(0.3, wh - 1.2, wd, xx - Math.sign(xx) * 0.15, 1.6, 0)); }
    const r = gableRoof(sub, { ex: wingL / 2 + 0.9, ez: hz + 0.9, yE: 0.4 + wh + 0.3, ends: s < 0 ? ['irimoya', 'gable'] : ['gable', 'irimoya'], slopes: [[0.9, 0.45], 0.6], ridgeH: 0.5, ov: 0.9, rib: 0.58 });
    rafters(sub, r, { hx: wingL / 2, hz, ex: wingL / 2 + 0.9, ez: hz + 0.9, th: 0.24, ends: s < 0 ? ['hip', 'gable'] : ['gable', 'hip'], step: 0.8 });
    place(acc, sub, cx, -hz);
  }
  return { kind: 'nagayamon' };
}
/** cổng biệt thự: MUNAMON 棟門 — 2 trụ, xà 冠木, mái kirizuma ngói nhỏ, cánh ván mở vào; hai đoạn tường đất trát có mái ngói 築地塀 */
function gateVilla(acc, g, v = 0) {
  // biến thể: 0 ngói xám + tường trát 築地塀 · 1 mái ván 杮葺 + hàng rào tre 建仁寺垣 · 2 ngói xám lam + tường ván cháy 焼杉
  const xp = g.w / 2 + 0.22, H = 2.75, KR = v === 1 ? { ...KOKERA_K, gable: 'plaster' } : { ...(v === 2 ? HOUSE_K2 : GATE_K), gegyo: 'woodDk', fit: null }, rib = v === 1 ? 1e6 : 0.5;
  for (const s of [-1, 1]) {
    acc.add('stoneC', boxB(0.5, 0.18, 0.5, s * xp, 0, -0.3)); acc.add('woodDk', boxB(0.3, H, 0.36, s * xp, 0.15, -0.3));
    acc.add('board', boxB(0.08, H - 0.45, g.w / 2 - 0.1, s * (xp - 0.24), 0.18, -0.55 - (g.w / 2 - 0.1) / 2));
    const sub = new Acc(), L = 1.6;
    if (v === 1) { // 建仁寺垣: nan tre đứng sát nhau, 3 nẹp ngang, cọc tre
      sub.add('stoneC', boxB(L, 0.12, 0.3, 0, 0, 0)); sub.add('bambooFence', boxB(L, 1.75, 0.08, 0, 0.12, 0));
      for (const y of [0.45, 1.05, 1.62]) sub.add('bamboo', boxB(L + 0.04, 0.06, 0.16, 0, y, 0)); for (let x = -L / 2 + 0.05; x < L / 2; x += 0.13) sub.add('bambooFence', boxB(0.06, 1.7, 0.05, x, 0.14, 0.06));
      sub.add('bamboo', boxB(L + 0.1, 0.1, 0.12, 0, 1.87, 0));
    } else {       // tường trát / ván cháy + mái ngói
      sub.add('stoneC', boxB(L, 0.35, 0.7, 0, 0, 0)); sub.add(v === 2 ? 'board' : 'plaster', boxB(L, 1.75, 0.5, 0, 0.35, 0)); sub.add('woodDk', boxB(L, 0.08, 0.54, 0, 1.2, 0));
      gableRoof(sub, { ex: L / 2 + 0.05, ez: 0.75, yE: 2.15, ends: ['gable', 'gable'], slopes: [[0.45, 0.42], 0.5], ridgeH: 0.3, rib, ov: 0.45, K: KR });
    }
    place(acc, sub, s * (xp + 0.3 + L / 2), -0.3);
  }
  acc.add('woodDk', boxB(2 * xp + 0.9, 0.34, 0.4, 0, 0.15 + H - 0.5, -0.3)); acc.add('woodDk', boxB(2 * xp + 0.3, 0.2, 0.3, 0, 0.15 + H, -0.3));
  gableRoof(acc, { ex: xp + 0.85, ez: 1.1, yE: 0.15 + H + 0.28, cz: -0.3, slopes: [[0.8, 0.45], 0.6], ridgeH: 0.45, ov: 0.8, rib, K: KR });
  return { kind: 'munamon', variant: v };
}
function gate(styleId, S, g, opt = {}) {
  if (styleId === 'bali') return BALI.gate(styleId, S, g);
  const acc = new Acc(), info = g.villa ? gateVilla(acc, g, (opt.variant | 0) % 3) : gatePhu(acc, g);
  return { acc, mats: jpEstMats(), post: finish, info };
}

export const FAMILY = { hall, tower, pav, gate };
