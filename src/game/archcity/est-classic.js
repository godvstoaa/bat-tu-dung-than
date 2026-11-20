// ============================================================================
//  HỌ «CLASSIC» cho biệt phủ / biệt thự (docs/bietphu/00-HOP-DONG.md, docs/bietphu/classic.md) — bộ cấu kiện cổ điển Pháp của
//  tiên phủ (tienphu/arch/fr-kit.js, CHỈ import) + vật liệu lặp theo mét (archcity/mats.js), dựng lại theo THAM SỐ ở cỡ nhà ở
//  (tầng 4,2 m, cửa đi 2,6 × 3,4 m, cửa sổ ≈ 1,3 × 2,6 m) — không phóng / thu mẫu Versailles 100 m.
//   palladian — Palladio / Palladian Anh: chân tường khía rãnh, portico thức Ionic khổng lồ + trán tam giác có tượng, cửa sổ tầng
//               chính có trán tam giác / cung xen kẽ và lan can giả dưới bậu, mái ngói ống thấp, vòm trên trống (Villa La Rotonda,
//               Villa Emo, Chiswick House, Wanstead / Prior Park). Tháp «rotunda»: bệ vuông khía rãnh + 2 tầng đền tròn + vòm.
//   chateau   — lâu đài Loire (Chambord, Azay-le-Rideau, Cheverny): đá tuffeau, lưới pilaster chồng thức + gờ tầng, cửa croisée,
//               mái Mansart đá đen có lucarne Phục Hưng, tourelle treo góc mái nón, vòm vuông «à l'impériale» trên khối giữa,
//               ống khói đá cao. Tháp «donjon»: tháp vuông + 4 tourelle treo góc + mâchicoulis + mái chóp đá đen.
//   phap      — biệt thự Pháp (Hà Nội / Đà Lạt 1920–30, hôtel particulier Paris): 3 biến thể (mansard / mái ngói hông có trán /
//               mái «pavillon» dốc), cửa chớp, ban công sắt rèn, tầng trệt khía rãnh vữa.
//  Khuôn lô: vách trên chu vi w × d, khe cửa 2,6 m giữa mặt +z (và −z nếu back), sàn trong nhà ở b.plinth trống,
//  nền (w + 2,4) × (d + 2,4). Mọi phần dư (portico, tourelle, ban công, mái) vươn ra ngoài chu vi phía trên đầu người.
// ============================================================================
import * as THREE from 'three';
import {
  Acc, boxB, cyl, lathe, slabXY, beam, ribAlong, V, put, pane, slabHoles, rectPts, archPts, column, pilaster, entab, band, balus,
  keystone, refends, statue, potAFeu, cartouche, roundSteps, ORD,
} from '../tienphu/arch/fr-kit.js';
import {
  MID, classicMats, finisher, sanitize, flat, stairs, plinthBase, windowC, hoodC, balconyC, quoins, facade, fourFaces, spread, bayXs,
  roofC, rectPoly, squareLathe, finial, chimneyC, lucarneRen, lucarneMan, turret, pediment, latheF, holePoly,
} from './est-classic-kit.js';

const out = (acc, id, variant, info) => ({ acc: sanitize(acc), mats: classicMats(id, variant).mats, post: finisher(id, variant), midDrop: MID, info: { kind: 'est-classic', ...info } });
const storeysOf = (b) => { const n = Math.max(1, b.floors || Math.round(b.h / 4.2)), sh = b.h / n; return { n, sh, st: Array.from({ length: n }, (_, i) => ({ y0: b.plinth + i * sh, h: sh })) }; };
/** trần tối từng tầng (nhìn qua cửa sổ không thấy trời) — trên đầu người, không chạm kiểm sàn */
function ceilings(acc, b, st, t = 0.45) { for (const s of st) acc.add('inside', boxB(b.w - 2 * t - 0.05, 0.25, b.d - 2 * t - 0.05, 0, s.y0 + s.h - 0.3, 0)); }

// ============================================================================ PALLADIO
function hallPalladian(id, b, opt) {
  const acc = new Acc(), P = b.plinth, hw = b.w / 2, hd = b.d / 2, { n, sh, st } = storeysOf(b), grand = !opt.villa && b.w >= 30;
  const yE = P + b.h, entH = grand ? 1.9 : Math.min(1.45, 0.17 * b.h), Hc = b.h - entH, D = Hc / 9, Cn = entH * ORD.ionic.parts[2], ov = Cn * 1.08 + 0.05;
  // portico: lục trụ (grand) / tứ trụ, cột Ionic khổng lồ từ nền tới entablature, nhịp giữa 4 D, nhịp thường 3,25 D (eustyle)
  const nc = grand ? 6 : 4, s = 3.25 * D, cols = [];
  for (let i = 0; i < nc / 2; i++) { const x = 2 * D + i * s; cols.push(-x, x); } cols.sort((a, c) => a - c);
  const mids = cols.slice(1).map((x, i) => (x + cols[i]) / 2), xP = cols[nc - 1] + D * 0.9, e = 1.0;
  const outer = Math.max(1, Math.round((hw - e - xP) / 3.6)), xsF = [...spread(-hw + e, -xP, outer), ...mids, ...spread(xP, hw - e, outer)];
  const ciF = (xsF.length - 1) / 2, xsS = bayXs(b.d, 3.5, 1.0);
  const hoodOf = (i, ci) => (Math.abs(i - ci) % 2 ? 'seg' : 'tri');
  const win = (which, xs) => (si, i) => {
    const ci = (xs.length - 1) / 2, center = which !== 'side' && i === ci;
    if (si === 0) {
      if (center && (which === 'front' || b.back)) return { door: true, w: 2.6, h: Math.min(3.5, sh - 0.6), hood: grand ? null : 'cornice' };
      return grand ? { w: 1.2, h: 1.9, dy: 1.05, keystone: true } : { w: 1.2, h: 2.3, dy: 0.75, hood: hoodOf(i, ci) };
    }
    if (si === 1) return grand ? { w: 1.3, h: 2.6, dy: 0.6, hood: hoodOf(i, ci), apron: true } : { w: 1.15, h: Math.min(1.9, sh - entH - 0.95), dy: 0.42, hood: 'flat' };
    return { w: 1.2, h: Math.min(1.35, sh - entH - 0.7), dy: 0.55 };
  };
  const rustTo = grand ? P + sh - 0.15 : 0;
  fourFaces(acc, b, (which, L) => ({
    P, top: yE, storeys: st, xs: which === 'side' ? xsS : xsF, win: win(which, which === 'side' ? xsS : xsF),
    rust: grand ? { to: rustTo } : null, bands: grand ? [[rustTo, 0.3, 0.14], [P + 2 * sh + 0.02, 0.16, 0.08]] : [[P + sh - 0.1, 0.24, 0.1]],
    quoins: { from: grand ? rustTo + 0.3 : P, to: yE - entH, key: 'rust' }, ent: { ord: 'ionic', H: entH, mod: true },
  }));
  ceilings(acc, b, st);
  // --- portico trước: sàn nhô + bậc rộng, cột, entablature, trán + tượng đỉnh (acroteria)
  const zc = hd + (grand ? 1.0 : 0.85), x0 = cols[0] - D * 0.85, x1 = cols[nc - 1] + D * 0.85;
  plinthBase(acc, b, { front: false });
  const deck = zc + D * 0.72 + 0.12;
  acc.add('plinth', boxB(x1 - x0 + 1.0, P - 0.16, deck - hd, 0, 0, (hd + deck) / 2)); acc.add('step', boxB(x1 - x0 + 1.16, 0.16, deck - hd + 0.08, 0, P - 0.16, (hd + deck) / 2));
  acc.plat({ x: 0, z: (hd + deck) / 2, w: x1 - x0 + 1.0, d: deck - hd, top: P });
  stairs(acc, 0, deck, 1, x1 - x0 - (grand ? 1.2 : 0.4), P);
  for (const x of cols) column(acc, 'ionic', x, P, zc, Hc, D, { key: 'col', capKey: 'cap', baseKey: 'cap', seg: 16 });
  const zf = zc + D * 0.5;
  entab(acc, 'ionic', x0, x1, P + Hc, zf, entH, { key: 'trim', capKey: 'trim', mod: true, dep: zf - hd + 0.3 });
  const pitchM = 0.45, Hm = (hd + ov) * pitchM, pitchP = Math.min(0.4, (Hm - 0.6) / ((x1 - x0) / 2 + ov));
  const pd = pediment(acc, x0 - ov, x1 + ov, yE, zf + ov, pitchP, 0, 'tileRoof', { oculus: grand ? 0.75 : 0.5 });
  const sh2 = grand ? 2.1 : 1.5;
  statue(acc, 0, yE + pd.H + 0.25, zf + ov - 0.5, sh2, 1, 0, 'statue'); for (const sx of [-1, 1]) statue(acc, sx * (x1 + ov - 0.5), yE + 0.35, zf + ov - 0.45, sh2 * 0.9, sx > 0 ? 2 : 3, 0, 'statue');
  // --- mặt sau phủ: đền giả (4 pilaster khổng lồ + trán) quanh cửa hậu
  if (grand) {
    const t = new Acc(), xm = (xsF[ciF] + xsF[ciF + 1]) / 2, xo = (xsF[ciF + 1] + xsF[ciF + 2]) / 2;
    for (const x of [-xo, -xm, xm, xo]) pilaster(t, 'ionic', x, P, 0, Hc, 0.95, 0.2, { key: 'trim', capKey: 'cap' });
    entab(t, 'ionic', -xo - 0.7, xo + 0.7, P + Hc, 0.2, entH, { key: 'trim', capKey: 'trim', mod: true, dep: 0.6 });
    pediment(t, -xo - 0.7 - ov, xo + 0.7 + ov, yE, 0.2 + ov, Math.min(0.4, (Hm - 0.6) / (xo + 0.7 + ov)), -hd, 'tileRoof');
    put(acc, t, 0, 0, -hd, Math.PI);
  }
  // --- mái ngói ống bốn dốc thấp (24°) + ống khói vữa + (phủ) trống và vòm có đèn lồng
  roofC(acc, rectPoly(-hw - ov, -hd - ov, hw + ov, hd + ov), yE, [[0, 0], [hd + ov - 0.05, (hd + ov - 0.05) * pitchM]], 'tileRoof', 'tileRidge', { eaveKey: 'trim' });
  const roofH = (x, z) => pitchM * Math.min(hw + ov - Math.abs(x), hd + ov - Math.abs(z));
  const chs = grand ? [[-hw + 7, hd - 3.6], [hw - 7, hd - 3.6], [-hw + 7, -hd + 3.6], [hw - 7, -hd + 3.6]] : [[-hw + 3.2, 0], [hw - 3.2, 0]];
  for (const [x, z] of chs) chimneyC(acc, x, yE, z, 1.1, 0.7, roofH(x, z) + 1.5, { key: 'chim' });
  let top = yE + Hm;
  if (grand) top = domeDrum(acc, 0, 0, yE, Hm, 3.6);
  return out(acc, id, 0, { top, D, cols: nc });
}
/** trống tròn (pilaster dải + cửa sổ tròn) nhô khỏi nóc + gờ + vòm ngói bậc chân (La Rotonda) + đèn lồng */
function domeDrum(acc, x, z, yE, Hm, r) {
  const y1 = yE + Hm + 1.3;
  acc.add('wall', lathe([[r, 0], [r, y1 - yE]], x, yE, z, 24));
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; acc.add('trim', boxB(0.42, y1 - yE - Hm - 0.1, 0.16, x + Math.sin(a) * r, yE + Hm + 0.05, z + Math.cos(a) * r, a)); }
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2, yc = yE + Hm + 0.72, xx = x + Math.sin(a) * (r + 0.02), zz = z + Math.cos(a) * (r + 0.02); const t = new THREE.TorusGeometry(0.34, 0.08, 4, 14); t.rotateY(a); t.translate(xx, yc, zz); acc.add('trim', t); const c = new THREE.CircleGeometry(0.34, 12); c.rotateY(a); c.translate(xx, yc, zz); acc.add('tileGlass', c); }
  acc.add('trim', lathe([[r - 0.1, 0], [r + 0.12, 0.05], [r + 0.3, 0.28], [r + 0.42, 0.42], [r - 0.1, 0.48]], x, y1 - 0.05, z, 24));
  const yD = y1 + 0.43, R = r + 0.15;
  acc.add('tileRoof', latheF([[R + 0.15, 0], [R + 0.15, 0.22], [R - 0.15, 0.24], [R - 0.15, 0.46], [R - 0.4, 0.48], [R * 0.86, 1.1], [R * 0.66, 1.75], [R * 0.4, 2.2], [0.75, 2.4]], x, yD, z, 24));
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; acc.add('lead', ribAlong([[R - 0.4, 0.5], [R * 0.86, 1.12], [R * 0.66, 1.77], [R * 0.4, 2.22], [0.78, 2.42]].map(([rr, h]) => V(x + Math.sin(a) * (rr + 0.04), yD + h, z + Math.cos(a) * (rr + 0.04))), 0.12, 0.1)); }
  // đèn lồng: 6 trụ nhỏ + mũ chì + quả cầu
  const yl = yD + 2.4;
  acc.add('trim', cyl(0.85, 0.85, 0.15, x, yl, z, 12));
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; acc.add('trim', cyl(0.09, 0.08, 1.05, x + Math.sin(a) * 0.62, yl + 0.15, z + Math.cos(a) * 0.62, 6)); }
  acc.add('inside', cyl(0.42, 0.42, 1.05, x, yl + 0.15, z, 8));
  acc.add('trim', cyl(0.9, 0.9, 0.16, x, yl + 1.2, z, 12));
  acc.add('lead', lathe([[0.88, 0], [0.7, 0.3], [0.35, 0.55], [0.08, 0.7], [0.001, 0.72]], x, yl + 1.36, z, 12));
  finial(acc, x, yl + 2.0, z, 0.9);
  return yl + 2.9;
}

// ============================================================================ LÂU ĐÀI PHÁP (Loire)
function hallChateau(id, b, opt) {
  const acc = new Acc(), P = b.plinth, hw = b.w / 2, hd = b.d / 2, { n, sh, st } = storeysOf(b), grand = !opt.villa && b.w >= 30;
  const yE = P + b.h, entH = grand ? 1.25 : 0.95, ov = entH * ORD.ionic.parts[2] * 1.08 + 0.05, e = grand ? 2.3 : 1.7;
  // ô: khối giữa 3 ô (4,2 m) + hai cánh chia đều ≈ 3,7 m; nhà khách chia đều
  let xsF;
  if (grand) { const cw = 4.2, xa = cw * 1.5, k = Math.max(1, Math.round((hw - e - xa) / 3.8)); xsF = [...spread(-hw + e, -xa, k), -cw, 0, cw, ...spread(xa, hw - e, k)]; }
  else xsF = bayXs(b.w, 3.6, e);
  const xsS = bayXs(b.d, 3.8, e), sp = (xs) => xs.slice(1).map((x, i) => (x + xs[i]) / 2);
  const pilXs = (xs) => { const m = sp(xs), d0 = xs.length > 1 ? (xs[1] - xs[0]) / 2 : 1.5; return [xs[0] - d0, ...m, xs[xs.length - 1] + d0]; };
  const winH = [2.6, 2.75, 2.6, 2.0];
  const win = (which, xs) => (si, i) => {
    const ci = (xs.length - 1) / 2, center = which !== 'side' && i === ci, last = si === n - 1;
    if (si === 1 && center && which === 'front' && grand) return { w: 1.45, h: 2.75, dy: 0.15, cross: true, hood: 'tri' };
    if (si === 0 && center && (which === 'front' || b.back)) return { kind: 'arch', door: true, w: 2.6, h: Math.min(3.7, sh - 0.5), keystone: true };
    const h = last ? Math.min(winH[3], sh - entH - 0.95) : Math.min(winH[si] || 2.6, sh - 1.35);
    return { w: 1.45, h, dy: si === 0 ? 0.7 : 0.5, cross: true, hood: si > 0 && !last ? 'cornice' : null };
  };
  const rustTo = P + sh - 0.42, ords = ['doric', 'ionic', 'ionic', 'corinthian'];
  fourFaces(acc, b, (which, L) => {
    const xs = which === 'side' ? xsS : xsF;
    return {
      P, top: yE, storeys: st, xs, win: win(which, xs), rust: { to: rustTo, course: 0.48 },
      bands: st.slice(0, -1).map((s) => [s.y0 + s.h - 0.42, 0.42, 0.16]), pil: { xs: pilXs(xs), ords: n > 2 ? ords : ['doric', 'ionic'], W: 0.42, proj: 0.1, gap: 0.42 },
      ent: { ord: 'ionic', H: entH, mod: true },
    };
  });
  ceilings(acc, b, st);
  plinthBase(acc, b);
  // --- khung cửa chính (frontispice): cặp cột Doric hai bên cửa vòm, entablature, huy hiệu
  { const D = 0.46, H = Math.min(3.9, sh - 0.55), z = hd + 0.5;
    for (const sx of [-1, 1]) for (const x of [1.85, 2.6]) column(acc, 'doric', sx * x, P, z, H, D, { key: 'col', capKey: 'cap', baseKey: 'cap', seg: 12 });
    entab(acc, 'doric', -3.05, 3.05, P + H, z + D / 2, 0.85, { key: 'trim', capKey: 'trim', trig: [-2.6, -1.85, 0, 1.85, 2.6], dep: z + D / 2 - hd + 0.2 });
    balus(acc, -3.0, 3.0, P + H + 0.85, z, { h: 0.9, cut: 'tileBalus', key: 'trim', capKey: 'trim', deW: 0.4, dep: 0.4, des: [-1.85, 1.85] });
    for (const sx of [-1, 1]) potAFeu(acc, sx * 2.8, P + H + 1.8, z, 0.75, sx + 1, 'carve'); }
  // --- mái Mansart: dốc dưới 72° (lucarne) + dốc trên ≈ 23° (đá đen), bờ gãy + nóc chì
  const lowH = grand ? 4.2 : 3.6, lowI = grand ? 1.4 : 1.2, rr = hd + ov - 0.05, pu = grand ? 0.3 : 0.42, roofTop = lowH + (rr - lowI) * pu;
  const xc = grand ? 6.3 : 0; // phủ: khối giữa (3 ô) nhô cao một tầng attic + vòm riêng; hai cánh mái Mansart riêng
  if (!grand) roofC(acc, rectPoly(-hw - ov, -hd - ov, hw + ov, hd + ov), yE, [[0, 0], [lowI, lowH], [rr, roofTop]], 'slate', 'lead', { breakRib: true, eaveKey: 'trim' });
  else for (const sx of [-1, 1]) { const x0 = sx * xc, x1 = sx * (hw + ov), half = Math.abs(x1 - x0) / 2, r2 = Math.min(rr, half - 0.05); roofC(acc, rectPoly(Math.min(x0, x1), -hd - ov, Math.max(x0, x1), hd + ov), yE, [[0, 0], [lowI, lowH], [r2, lowH + (r2 - lowI) * pu]], 'slate', 'lead', { breakRib: true, eaveKey: 'trim' }); }
  const lw = grand ? 1.75 : 1.5, lh = grand ? 2.6 : 2.15;
  for (const [sz, xs] of [[1, xsF], [-1, xsF]]) for (const x of xs) { if (grand && Math.abs(x) < 6.6) continue; if (Math.abs(x) > hw - 1.2) continue; lucarneRen(acc, x, yE, sz * (hd + ov - 0.32), sz > 0 ? 0 : Math.PI, lw, lh); }
  for (const sx of [-1, 1]) for (const z of xsS) if (Math.abs(z) < hd - 1.9) lucarneRen(acc, sx * (hw + ov - 0.32), yE, z, sx * Math.PI / 2, lw, lh);
  // --- tourelle treo góc (phủ: 4 góc; nhà khách: 2 góc trước)
  const tr = grand ? 2.0 : 1.5, corners = grand ? [[-1, -1], [1, -1], [-1, 1], [1, 1]] : [[-1, 1], [1, 1]];
  for (const [sx, sz] of corners) {
    const a = Math.atan2(sx, sz), wins = st.slice(1).map((s) => [s.y0 + 0.6, a, 0.7, Math.min(1.6, s.h - 1.6)]);
    turret(acc, sx * (hw + 0.25), sz * (hd + 0.25), tr, P + sh - (grand ? 1.7 : 1.4), P + sh + 0.25, yE + (grand ? 1.5 : 0.8), { rings: st.slice(1).map((s) => s.y0 - 0.2), wins, roofH: tr * (grand ? 2.7 : 2.4), fin: grand ? 1.6 : 1.2 });
  }
  // --- khối giữa: vòm vuông «à l'impériale» (Cheverny) + đèn lồng; ống khói đá cao
  let top = yE + roofTop;
  if (grand) {
    // attic khối giữa: mặt trước / sau 3 cửa sổ croisée + pilaster + gờ; hai hồi tường đặc có cửa tròn; đá góc theo mép khối giữa
    const aH = 2.5, aE = 0.7, yA = yE + aH + aE;
    for (const [z, ry] of [[hd, 0], [-hd, Math.PI]]) {
      const f = new Acc(), L = 2 * xc, hs = [-4.2, 0, 4.2].map((x) => ({ kind: 'rect', x, y0: yE + 0.45, w: 1.3, h: 1.6, cross: true, glass: 'tileGlass' }));
      f.add('wall', slabHoles(rectPts(-L / 2, yE - 0.3, L / 2, yA), hs.map(holePoly), 0, 0.4)); for (const h of hs) windowC(f, h);
      for (const x of [-L / 2 + 0.3, -2.1, 2.1, L / 2 - 0.3]) pilaster(f, 'corinthian', x, yE, 0, aH, 0.42, 0.1, { key: 'trim', capKey: 'cap', light: true });
      entab(f, 'ionic', -L / 2 - 0.25, L / 2 + 0.25, yE + aH, 0, aE, { key: 'trim', capKey: 'trim', mod: true, dep: 0.5 });
      for (let y = P + 0.1, i = 0; y < yE + aH - 0.3; y += 0.48, i++) for (const sx of [-1, 1]) { const w = i % 2 ? 0.5 : 0.85; f.add('rust', boxB(w, 0.42, 0.08, sx * L / 2 + (i % 2 ? 0 : 0) , y, 0.04)); }
      put(acc, f, 0, 0, z, ry);
    }
    for (const sx of [-1, 1]) { const f = new Acc(), L = b.d; f.add('wall', slabHoles(rectPts(-L / 2, yE - 0.3, L / 2, yA), [], 0, 0.4)); entab(f, 'ionic', -L / 2 - 0.25, L / 2 + 0.25, yE + aH, 0, aE, { key: 'trim', capKey: 'trim', mod: true, dep: 0.5 }); put(acc, f, sx * xc, 0, 0, sx * Math.PI / 2); }
    // vòm vuông «à l'impériale»: chân loe lõm rồi phình lồi (Cheverny, Vaux-le-Vicomte)
    const ax = xc + 0.45, az = hd + 0.45, H = 7.4;
    acc.add('slate', squareLathe([[ax, 0], [ax * 0.93, 0.08 * H], [ax * 0.88, 0.2 * H], [ax * 0.9, 0.36 * H], [ax * 0.86, 0.5 * H], [ax * 0.72, 0.64 * H], [ax * 0.5, 0.78 * H], [ax * 0.26, 0.9 * H], [ax * 0.1, 0.97 * H], [0.001, H]], 0, yA, 0, ax, az));
    acc.add('lead', squareLathe([[ax + 0.1, 0], [ax + 0.1, 0.12], [ax - 0.1, 0.16], [0.001, 0.16]], 0, yA - 0.04, 0, ax + 0.1, az + 0.1));
    for (const sz of [-1, 1]) lucarneMan(acc, 0, yA + 0.35, sz * (az * 0.89), sz > 0 ? 0 : Math.PI, 1.3, 1.9, 'oeil', 2.2);
    const yl = yA + H * 0.93, la = 0.95;
    acc.add('trim', boxB(2 * la + 0.4, 0.3, 2 * la + 0.4, 0, yl, 0));
    for (let k = 0; k < 4; k++) { const f = new Acc(); f.add('trim', slabHoles(rectPts(-la, 0, la, 1.8), [archPts(0, 0.1, 0.95, 1.45, 8)], 0, 0.2)); f.add('inside', pane(rectPts(-0.5, 0.1, 0.5, 1.2), -0.3)); put(acc, f, Math.sin(k * Math.PI / 2) * la, yl + 0.3, Math.cos(k * Math.PI / 2) * la, k * Math.PI / 2); }
    acc.add('trim', boxB(2 * la + 0.5, 0.22, 2 * la + 0.5, 0, yl + 2.1, 0));
    acc.add('slate', squareLathe([[la + 0.2, 0], [la * 0.9, 0.42], [la * 0.5, 0.85], [0.001, 1.1]], 0, yl + 2.32, 0, la + 0.2, la + 0.2));
    finial(acc, 0, yl + 3.35, 0, 1.3); top = yl + 4.65;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) chimneyC(acc, sx * (hw - 9.2), yE + 1, sz * 2.4, 1.5, 0.85, roofTop + 1.4, { key: 'ash', panel: true });
  } else for (const sx of [-1, 1]) chimneyC(acc, sx * (hw - 3.6), yE + 1, 0, 1.3, 0.8, roofTop - 0.2, { key: 'ash', panel: true });
  return out(acc, id, 0, { top });
}

// ============================================================================ BIỆT THỰ PHÁP — 3 biến thể
function hallPhap(id, b, opt) {
  const v = ((opt.variant | 0) % 3 + 3) % 3, acc = new Acc(), P = b.plinth, hw = b.w / 2, hd = b.d / 2, { n, sh, st } = storeysOf(b);
  const yE = P + b.h, entH = 0.95, ov = entH * ORD.ionic.parts[2] * 1.08 + 0.05, last = n - 1;
  const xsF = v === 1 ? bayXs(b.w, 2.1, 0.8) : v === 2 ? [-hw + 2.2, 0, hw - 2.2] : bayXs(b.w, 3.4, 1.0), xsS = bayXs(b.d, 3.3, 1.2, false);
  const ci = (xsF.length - 1) / 2, ww = v === 1 ? 1.1 : 1.3;
  const winF = (which, xs) => (si, i) => {
    const c = (xs.length - 1) / 2, center = (which === 'front' || (which === 'back' && b.back)) && i === c;
    if (si === 0) {
      if (center) return v === 1 ? { door: true, w: 2.6, h: 3.35, hood: 'cornice' } : { kind: 'arch', door: true, w: 2.6, h: 3.5, keystone: true };
      if (which === 'side' && v === 1) return { w: ww, h: 2.3, dy: 0.8, shutter: true };
      return v === 2 ? { kind: 'arch', w: 1.25, h: 2.6, dy: 0.65, keystone: true } : v === 1 ? { w: ww, h: 2.3, dy: 0.8, shutter: true, hood: 'seg' } : { w: ww, h: 2.4, dy: 0.75, keystone: true };
    }
    if (si === last) { const hh = Math.min(v === 0 ? 2.35 : 1.9, sh - entH - 1.0); return { w: ww, h: hh, dy: v === 0 ? 0.15 : 0.5, shutter: true, hood: v === 2 ? 'seg' : null }; }
    // tầng chính: cửa sổ kiểu Pháp sát sàn (porte-fenêtre)
    if (center && which === 'front') {
      if (v === 0) return { w: 1.35, h: 2.9, dy: 0.15, shutter: true, hood: 'tri', balc: { dep: 0.75, ext: 0.45 } };
      if (v === 1) return { w: 1.25, h: 2.75, dy: 0.15, hood: 'tri', balc: { dep: 0.85, ext: 0.75, iron: false } };
      return { kind: 'arch', w: 1.7, h: 3.0, dy: 0.15, keystone: true, balc: { dep: 0.95, ext: 1.0, iron: false } };
    }
    return v === 0 ? { w: ww, h: 2.8, dy: 0.15, shutter: true, hood: 'cornice', balc: which === 'front' ? { dep: 0.35, ext: 0.12 } : null } : { w: ww, h: 2.45, dy: 0.5, shutter: true, hood: v === 1 ? 'cornice' : 'tri' };
  };
  fourFaces(acc, b, (which, L) => {
    const xs = which === 'side' ? xsS : xsF;
    return {
      P, top: yE, storeys: st, xs, win: winF(which, xs), t: 0.4,
      rust: v === 1 ? null : { to: P + sh - 0.2, course: 0.42 },
      bands: [[P + sh - 0.22, 0.26, 0.12], ...st.slice(1, -1).map((s) => [s.y0 + s.h - 0.06, 0.16, 0.08])],
      quoins: { from: v === 1 ? P : P + sh + 0.05, to: yE - entH, key: v === 2 ? 'trim' : 'rust' }, ent: { ord: 'ionic', H: entH, mod: true },
    };
  });
  ceilings(acc, b, st, 0.4);
  plinthBase(acc, b);
  // ban công sắt chạy suốt tầng trên cùng (Haussmann) — biến thể 0
  if (v === 0) { const t = new Acc(); balconyC(t, -hw + 0.55, hw - 0.55, st[last].y0 + 0.15 - 0.12, 0.62, {}); put(acc, t, 0, 0, hd, 0); }
  // --- mái
  let top;
  if (v === 0) {
    const lowH = 3.8, lowI = 1.0, rr = hd + ov - 0.05, pu = 0.34, H = lowH + (rr - lowI) * pu;
    roofC(acc, rectPoly(-hw - ov, -hd - ov, hw + ov, hd + ov), yE, [[0, 0], [lowI, lowH], [rr, H]], 'slate', 'lead', { breakRib: true, eaveKey: 'trim' });
    xsF.forEach((x, i) => lucarneMan(acc, x, yE, hd + ov - 0.3, 0, 1.3, 2.05, i === ci ? 'oeil' : 'arch'));
    xsF.forEach((x) => lucarneMan(acc, x, yE, -hd - ov + 0.3, Math.PI, 1.2, 1.9, 'arch'));
    for (const sx of [-1, 1]) chimneyC(acc, sx * (hw - 0.6), yE - 0.5, -hd * 0.35, 1.5, 0.75, H + 1.6, { key: 'chim' });
    finial(acc, -hw + ov + 3.3, yE + H, 0, 1.0); finial(acc, hw - ov - 3.3, yE + H, 0, 1.0);
    top = yE + H + 1.3;
  } else if (v === 1) {
    const pitch = 0.7, H = (hd + ov - 0.05) * pitch;
    roofC(acc, rectPoly(-hw - ov, -hd - ov, hw + ov, hd + ov), yE, [[0, 0], [hd + ov - 0.05, H]], 'tileRoof', 'tileRidge', { eaveKey: 'trim' });
    const xa = (xsF[ci + 1] + xsF[ci + 2]) / 2 + 0.2;
    pediment(acc, -xa - ov, xa + ov, yE, hd + ov, Math.min(0.5, (H - 0.6) / (xa + ov)), 0, 'tileRoof', { oculus: 0.45 });
    for (const sx of [-1, 1]) chimneyC(acc, sx * (hw - 1.6), yE, -1.2, 1.0, 0.65, (hw + ov - (hw - 1.6)) * pitch + 1.6, { key: 'chim' });
    top = yE + H;
  } else {
    const pitch = 1.25, rr = (hd + ov) * 0.84, H = rr * pitch;
    roofC(acc, rectPoly(-hw - ov, -hd - ov, hw + ov, hd + ov), yE, [[0, 0], [0.25, 0.32], [rr, H]], 'slate', 'lead', { eaveKey: 'trim' });
    // diềm sắt trên nóc phẳng (crête) + chóp
    const tw = hw + ov - rr, td = hd + ov - rr;
    for (const [a, c] of [[[-tw, -td], [tw, -td]], [[tw, -td], [tw, td]], [[tw, td], [-tw, td]], [[-tw, td], [-tw, -td]]]) { acc.add('iron', ribAlong([V(a[0], yE + H + 0.45, a[1]), V(c[0], yE + H + 0.45, c[1])], 0.05, 0.05)); const L = Math.hypot(c[0] - a[0], c[1] - a[1]); for (let k = 0; k <= Math.floor(L / 0.3); k++) { const u = k / Math.max(1, Math.floor(L / 0.3)); acc.add('railBar', boxB(0.03, 0.45, 0.03, a[0] + (c[0] - a[0]) * u, yE + H, a[1] + (c[1] - a[1]) * u)); } }
    for (const sx of [-1, 1]) finial(acc, sx * tw, yE + H, 0, 1.3);
    for (const x of [xsF[0], xsF[2]]) lucarneMan(acc, x, yE + 0.3, hd + ov - 0.6, 0, 1.25, 2.1, 'tri', 2.6);
    lucarneMan(acc, 0, yE + 0.3, -hd - ov + 0.6, Math.PI, 1.25, 2.1, 'tri', 2.6);
    for (const sx of [-1, 1]) chimneyC(acc, sx * (hw - 0.7), yE - 0.5, 1.4, 1.2, 0.7, H + 1.4, { key: 'chim' });
    top = yE + H + 1.4;
  }
  return out(acc, id, v, { top, variant: v });
}

// ============================================================================ THÁP
/** palladian «rotunda»: bệ vuông khía rãnh (4 cửa vòm) + lan can; đền tròn Ionic 12 cột quanh trống; trống attic cửa tròn;
 *  đền tròn Corinthian 8 cột; vòm ngói có gân chì; đèn lồng — Mausoleum Castle Howard (Hawksmoor), Radcliffe Camera, Tempietto */
function towerRotunda(id, t) {
  const acc = new Acc(), a = Math.min(t.w, t.d) * 0.42, y0 = 0.45, yC = 9.6;
  acc.add('plinth', boxB(2 * a + 1.6, y0, 2 * a + 1.6, 0, 0, 0)); acc.add('step', boxB(2 * a + 1.76, 0.14, 2 * a + 1.76, 0, y0 - 0.14, 0));
  for (let k = 0; k < 4; k++) {
    const f = new Acc(), L = 2 * a, door = { kind: 'arch', x: 0, y0, w: 2.2, h: 4.2, door: true };
    const ocs = [-1, 1].map((s) => ({ kind: 'arch', x: s * 2.25, y0: y0 + 4.8, w: 0.9, h: 1.6, glass: 'tileGlass' }));
    f.add('wall', slabHoles(rectPts(-L / 2, y0, L / 2, yC), [door, ...ocs].map(holePoly), 0, 0.6));
    refends(f, -L / 2, L / 2, y0 + 0.02, yC - 1.2, 0, [door, ...ocs], { course: 0.6, proj: 0.07, key: 'rust', vous: 0.45, nv: 7 });
    f.add('wood', pane(archPts(0, y0, 2.2, 4.2, 10), -0.35)); keystone(f, 0, y0 + 4.25, 0.07, 0.5, 0.7, 0.16, true, 'trim');
    for (const o of ocs) windowC(f, { ...o, keystone: true });
    entab(f, 'doric', -L / 2 - 0.4, L / 2 + 0.4, yC - 1.2, 0, 1.2, { key: 'trim', capKey: 'trim', trig: spread(-L / 2, L / 2, 6), dep: 0.8 });
    balus(f, -L / 2 - 0.3, L / 2 + 0.3, yC, -0.05, { h: 1.0, cut: 'tileBalus', key: 'trim', capKey: 'trim', des: [0], deW: 0.5 });
    for (const s of [-1, 1]) potAFeu(f, s * (L / 2 + 0.05), yC + 1.05, -0.05, 0.9, k + s, 'carve');
    put(acc, f, Math.sin(k * Math.PI / 2) * a, 0, Math.cos(k * Math.PI / 2) * a, k * Math.PI / 2);
  }
  acc.add('inside', boxB(2 * a - 1, 0.3, 2 * a - 1, 0, yC - 0.3, 0));
  // đền tròn 1: 12 cột Ionic quanh trống
  const R1 = 3.55, D1 = 0.66, H1 = 9 * D1, rc = 2.55, yS = yC + 0.05;
  roundSteps(acc, [R1 + 0.75, R1 + 0.5], 0.15, 'trim', 32, yS);
  const y1 = yS + 0.3;
  acc.add('wall', lathe([[rc, 0], [rc, H1 + 2.6]], 0, y1, 0, 24));
  for (let k = 0; k < 4; k++) { const ang = (k / 4) * Math.PI * 2 + Math.PI / 4, f = new Acc(); f.add('tileGlass', pane(archPts(0, 0, 1.1, 2.8, 8), 0.02)); f.add('trim', slabHoles(archPts(0, -0.12, 1.4, 3.06, 8), [archPts(0, 0, 1.1, 2.8, 8)], 0.12, 0.14)); put(acc, f, Math.sin(ang) * (rc - 0.06), y1 + 0.9, Math.cos(ang) * (rc - 0.06), ang); }
  for (let k = 0; k < 12; k++) { const ang = (k / 12) * Math.PI * 2; column(acc, 'ionic', Math.sin(ang) * R1, y1, Math.cos(ang) * R1, H1, D1, { key: 'col', capKey: 'cap', baseKey: 'cap', seg: 12, ry: ang }); }
  const yE1 = y1 + H1, E = [[rc - 0.05, 0], [R1 + 0.38, 0], [R1 + 0.38, 0.5], [R1 + 0.46, 0.55], [R1 + 0.46, 0.95], [R1 + 0.66, 1.05], [R1 + 0.8, 1.32], [R1 + 0.86, 1.45], [rc - 0.05, 1.45]];
  acc.add('trim', lathe(E, 0, yE1, 0, 36));
  acc.add('inside', new THREE.RingGeometry(rc, R1 + 0.38, 36, 1).rotateX(Math.PI / 2).translate(0, yE1 + 0.01, 0));
  acc.add('trim', lathe([[R1 + 0.3, 0], [R1 + 0.3, 0.75], [R1 + 0.4, 0.8], [R1 + 0.4, 0.92], [R1 - 0.05, 0.92], [R1 - 0.05, 0]], 0, yE1 + 1.45, 0, 36)); // parapet đặc
  // trống attic có cửa tròn
  const yA = yE1 + 1.45, yA1 = yA + 2.7;
  acc.add('wall', lathe([[rc, 0], [rc, yA1 - yA]], 0, yA, 0, 24));
  for (let k = 0; k < 8; k++) { const ang = (k / 8) * Math.PI * 2 + Math.PI / 8, x = Math.sin(ang) * (rc + 0.03), z = Math.cos(ang) * (rc + 0.03), yc = yA + 1.55; const tt = new THREE.TorusGeometry(0.36, 0.08, 4, 12); tt.rotateY(ang); tt.translate(x, yc, z); acc.add('trim', tt); acc.add('tileGlass', new THREE.CircleGeometry(0.36, 10).rotateY(ang).translate(x, yc, z)); }
  acc.add('trim', lathe([[rc - 0.1, 0], [rc + 0.1, 0.05], [rc + 0.35, 0.3], [rc - 0.1, 0.38]], 0, yA1 - 0.1, 0, 24));
  // đền tròn 2: 8 cột Corinthian quanh trống nhỏ
  const R2 = 2.2, D2 = 0.38, H2 = 10 * D2, rc2 = 1.45, y2 = yA1 + 0.28;
  acc.add('trim', cyl(R2 + 0.45, R2 + 0.45, 0.25, 0, yA1, 0, 24));
  acc.add('wall', lathe([[rc2, 0], [rc2, H2 + 0.9]], 0, y2, 0, 16));
  for (let k = 0; k < 4; k++) { const ang = (k / 4) * Math.PI * 2, f = new Acc(); f.add('tileGlass', pane(archPts(0, 0, 0.7, 1.9, 6), 0.02)); put(acc, f, Math.sin(ang) * (rc2 + 0.01), y2 + 0.7, Math.cos(ang) * (rc2 + 0.01), ang); }
  for (let k = 0; k < 8; k++) { const ang = (k / 8) * Math.PI * 2 + Math.PI / 8; column(acc, 'corinthian', Math.sin(ang) * R2, y2, Math.cos(ang) * R2, H2, D2, { key: 'col', capKey: 'cap', baseKey: 'cap', seg: 10, ry: ang }); }
  const yE2 = y2 + H2;
  acc.add('trim', lathe([[rc2 - 0.05, 0], [R2 + 0.25, 0], [R2 + 0.25, 0.4], [R2 + 0.45, 0.5], [R2 + 0.55, 0.75], [rc2 - 0.05, 0.75]], 0, yE2, 0, 24));
  // vòm + gân + đèn lồng
  const yD = yE2 + 0.75, R = R2 + 0.35;
  acc.add('tileRoof', latheF([[R, 0], [R * 0.98, 0.35], [R * 0.86, 1.2], [R * 0.64, 2.0], [R * 0.36, 2.55], [0.45, 2.75]], 0, yD, 0, 24));
  for (let k = 0; k < 8; k++) { const ang = (k / 8) * Math.PI * 2; acc.add('lead', ribAlong([[R * 0.98, 0.36], [R * 0.86, 1.22], [R * 0.64, 2.02], [R * 0.36, 2.57], [0.47, 2.77]].map(([r, h]) => V(Math.sin(ang) * (r + 0.04), yD + h, Math.cos(ang) * (r + 0.04))), 0.12, 0.1)); }
  const yl = yD + 2.72;
  for (let k = 0; k < 6; k++) { const ang = (k / 6) * Math.PI * 2; acc.add('trim', cyl(0.07, 0.06, 1.1, Math.sin(ang) * 0.45, yl, Math.cos(ang) * 0.45, 6)); }
  acc.add('inside', cyl(0.3, 0.3, 1.1, 0, yl, 0, 8)); acc.add('trim', cyl(0.62, 0.62, 0.14, 0, yl + 1.1, 0, 12));
  acc.add('lead', lathe([[0.6, 0], [0.45, 0.25], [0.15, 0.5], [0.001, 0.55]], 0, yl + 1.24, 0, 12));
  finial(acc, 0, yl + 1.75, 0, 1.6);
  return out(acc, id, 0, { top: yl + 3.35, kind: 'rotunda' });
}
/** chateau «donjon»: tháp vuông đá (chân xiên), 4 tầng cửa croisée, gờ tầng, mâchicoulis + lan can đá, mái chóp đá đen dốc có lucarne,
 *  4 tourelle treo góc mái nón — Donjon de Vincennes, tháp Chambord, Château de Langeais */
function towerDonjon(id, t) {
  const acc = new Acc(), a = Math.min(t.w, t.d) * 0.41, y0 = 0.5, yT = 24.5, lv = [y0, 6.0, 11.5, 17.0, 22.4];
  acc.add('plinth', boxB(2 * a + 1.4, y0, 2 * a + 1.4, 0, 0, 0));
  acc.add('ash', squareLathe([[a + 0.5, 0], [a + 0.02, 2.0], [0.001, 2.0]], 0, y0, 0, a + 0.5, a + 0.5)); // chân xiên (talus)
  for (let k = 0; k < 4; k++) {
    const f = new Acc(), L = 2 * a, holes = [];
    if (k === 0) holes.push({ kind: 'arch', x: 0, y0: y0 + 0.05, w: 2.0, h: 3.3, door: true, keystone: true, leaves: false });
    for (let l = 1; l < 4; l++) holes.push({ kind: 'rect', x: 0, y0: lv[l] + 0.8, w: 1.3, h: 2.5, cross: true, hood: 'cornice', glass: 'tileGlass' });
    for (const s of [-1, 1]) holes.push({ kind: 'rect', x: s * 2.3, y0: lv[1] + 1.3, w: 0.5, h: 1.2, glass: 'tileGlass' }, { kind: 'rect', x: s * 2.3, y0: lv[3] + 1.3, w: 0.5, h: 1.2, glass: 'tileGlass' });
    f.add('wall', slabHoles(rectPts(-L / 2, y0, L / 2, yT), holes.map(holePoly), 0, 0.7));
    for (const h of holes) windowC(f, h);
    if (k === 0) f.add('wood', pane(archPts(0, y0 + 0.05, 2.0, 3.3, 10), -0.4)); // cửa gỗ đóng (khối đặc va chạm)
    for (const y of lv.slice(1)) band(f, -L / 2 - 0.05, L / 2 + 0.05, y - 0.3, 0.3, 0, 0.14, 'trim', 0.7);
    // mâchicoulis: hàng công-xon + lan can đá nhô
    for (let x = -L / 2 + 0.3; x < L / 2 - 0.1; x += 0.62) f.add('trim', slabXY([[0, 0], [0.5, 0], [0.5, -0.3], [0.12, -0.9], [0, -0.9]], 0.3, 0, 0, 0).rotateY(-Math.PI / 2).translate(x, yT + 0.9, 0));
    f.add('ash', boxB(L + 1.0, 1.25, 0.32, 0, yT + 0.9, 0.38)); f.add('trim', boxB(L + 1.1, 0.16, 0.42, 0, yT + 2.15, 0.38));
    put(acc, f, Math.sin(k * Math.PI / 2) * a, 0, Math.cos(k * Math.PI / 2) * a, k * Math.PI / 2);
  }
  acc.add('inside', boxB(2 * a - 1.2, 0.3, 2 * a - 1.2, 0, yT, 0));
  const yr = yT + 1.0, ar = a + 0.15, H = ar * 1.75;
  roofC(acc, rectPoly(-ar, -ar, ar, ar), yr, [[0, 0], [ar - 0.06, H]], 'slate', 'lead', { eaveKey: 'lead' });
  for (let k = 0; k < 4; k++) lucarneRen(acc, Math.sin(k * Math.PI / 2) * (ar - 0.9), yr + 0.4, Math.cos(k * Math.PI / 2) * (ar - 0.9), k * Math.PI / 2, 1.25, 1.9, 2.0);
  finial(acc, 0, yr + H - 0.1, 0, 2.4);
  const tr = 1.3, c = a - 0.35;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const ang = Math.atan2(sx, sz); turret(acc, sx * c, sz * c, tr, 3.4, 5.6, yT + 2.4, { rings: lv.slice(2).map((y) => y - 0.3), wins: [[lv[2] + 1.0, ang, 0.55, 1.3], [lv[3] + 1.0, ang, 0.55, 1.3], [lv[4] + 0.3, ang, 0.5, 1.1]], roofH: 4.6, fin: 1.4 }); }
  return out(acc, id, 0, { top: yr + H + 2.3, kind: 'donjon' });
}

// ============================================================================ ĐÌNH BÊN NƯỚC
/** palladian: đền tròn mở (monopteros) 8 cột Ionic, vòm đá thấp có gân + quả thông — Temple de l'Amour (Mique), đền Ionic Chiswick */
function pavTholos(id, pv) {
  const acc = new Acc(), ph = 0.5, R = Math.min(pv.w, pv.d) / 2 - 0.75, D = 0.38, H = Math.max(3.4, pv.h), rs = [R + 1.3, R + 1.0];
  roundSteps(acc, rs, ph / 2, 'step', 32);
  acc.add('floor', cyl(R + 0.7, R + 0.7, 0.02, 0, ph, 0, 32));
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; column(acc, 'ionic', Math.sin(a) * R, ph, Math.cos(a) * R, H, D, { key: 'col', capKey: 'cap', baseKey: 'cap', seg: 12, ry: a }); }
  const yE = ph + H, E = [[R - 0.32, 0], [R + 0.25, 0], [R + 0.25, 0.3], [R + 0.3, 0.33], [R + 0.3, 0.55], [R + 0.48, 0.62], [R + 0.58, 0.82], [R + 0.62, 0.9], [R - 0.32, 0.9]];
  acc.add('trim', lathe(E, 0, yE, 0, 32));
  for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2; acc.add('carve', boxB(0.22, 0.18, 0.05, Math.sin(a) * (R + 0.32), yE + 0.36, Math.cos(a) * (R + 0.32), a)); }
  acc.add('inside', new THREE.CircleGeometry(R - 0.3, 24).rotateX(Math.PI / 2).translate(0, yE + 0.02, 0));
  const yD = yE + 0.9, Rd = R + 0.45;
  acc.add('trim', latheF([[Rd + 0.1, 0], [Rd + 0.1, 0.18], [Rd - 0.1, 0.2], [Rd - 0.1, 0.36], [Rd * 0.86, 0.75], [Rd * 0.62, 1.15], [Rd * 0.33, 1.42], [0.001, 1.5]], 0, yD, 0, 24));
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; acc.add('trim', ribAlong([[Rd - 0.1, 0.38], [Rd * 0.86, 0.77], [Rd * 0.62, 1.17], [Rd * 0.33, 1.44], [0.1, 1.52]].map(([r, h]) => V(Math.sin(a) * (r + 0.03), yD + h, Math.cos(a) * (r + 0.03))), 0.1, 0.08)); }
  acc.add('trim', cyl(0.3, 0.22, 0.25, 0, yD + 1.48, 0, 10)); acc.add('carve', lathe([[0.001, 0], [0.2, 0.05], [0.26, 0.3], [0.15, 0.6], [0.001, 0.75]], 0, yD + 1.73, 0, 10));
  acc.plat({ poly: true, x: 0, z: 0, n: 16, a: R + 0.9, top: ph });
  return out(acc, id, 0, { kind: 'tholos', top: yD + 2.5 });
}
/** chateau / phap: gloriette vuông — 4 trụ góc đá có đá góc, 4 vòm mở, entablature, vòm vuông đá đen «à l'impériale» + đèn lồng nhỏ */
function pavGloriette(id, pv) {
  const acc = new Acc(), ph = 0.5, a = Math.min(pv.w, pv.d) / 2 - 0.4, yS = ph, H = Math.max(3.6, pv.h + 0.3), yE = yS + H;
  acc.add('plinth', boxB(2 * a + 1.2, ph - 0.12, 2 * a + 1.2, 0, 0, 0)); acc.add('step', boxB(2 * a + 1.34, 0.12, 2 * a + 1.34, 0, ph - 0.12, 0));
  acc.add('floor', boxB(2 * a - 0.4, 0.02, 2 * a - 0.4, 0, ph, 0)); acc.plat({ x: 0, z: 0, w: 2 * a + 1.2, d: 2 * a + 1.2, top: ph });
  for (let k = 0; k < 4; k++) {
    const f = new Acc(), L = 2 * a, ow = L - 2.0, arch = { kind: 'arch', x: 0, y0: yS, w: ow, h: Math.min(H - 0.45, ow / 2 + 2.3), door: true };
    f.add('ash', slabHoles(rectPts(-L / 2, yS, L / 2, yE), [holePoly(arch)], 0, 0.5));
    windowC(f, { ...arch, keystone: true, fw: 0.2, leaves: false });
    quoins(f, L, yS, yE - 0.1, 'rust', 0.07, 0.75, 0.45);
    entab(f, 'doric', -L / 2 - 0.3, L / 2 + 0.3, yE, 0, 0.75, { key: 'trim', capKey: 'trim', trig: spread(-L / 2, L / 2, 5), dep: 0.6 });
    put(acc, f, Math.sin(k * Math.PI / 2) * a, 0, Math.cos(k * Math.PI / 2) * a, k * Math.PI / 2);
  }
  for (const [sx, sz] of [[0, 1], [0, -1]]) stairs(acc, 0, sz * (a + 0.6), sz, 2.4, ph, false);
  const yR = yE + 0.75, ax = a + 0.45;
  acc.add('inside', boxB(2 * a - 0.8, 0.2, 2 * a - 0.8, 0, yR - 0.2, 0));
  acc.add('slate', squareLathe([[ax, 0], [ax * 0.97, 0.45], [ax * 0.86, 1.1], [ax * 0.62, 1.75], [ax * 0.32, 2.3], [ax * 0.14, 2.6], [0.001, 2.75]], 0, yR, 0, ax, ax));
  acc.add('lead', squareLathe([[ax + 0.08, 0], [ax + 0.08, 0.1], [ax - 0.05, 0.14], [0.001, 0.14]], 0, yR - 0.04, 0, ax + 0.08, ax + 0.08));
  const yl = yR + 2.45;
  acc.add('trim', boxB(0.95, 0.9, 0.95, 0, yl, 0)); for (let k = 0; k < 4; k++) acc.add('inside', pane(archPts(0, 0, 0.42, 0.65, 6), 0.48).rotateY(k * Math.PI / 2).translate(0, yl + 0.12, 0));
  acc.add('lead', squareLathe([[0.6, 0], [0.45, 0.25], [0.2, 0.5], [0.001, 0.6]], 0, yl + 0.9, 0, 0.6, 0.6));
  finial(acc, 0, yl + 1.45, 0, 1.2);
  return out(acc, id, 0, { kind: 'gloriette', top: yl + 2.65 });
}

// ============================================================================ CỔNG
/** cánh cổng sắt rèn (song giáo đầu mạ vàng) rộng w, cao h, mở 90° vào trong: bản lề tại (xh, 0), cánh nằm dọc −z */
function leaf(acc, xh, w, h, sx) {
  const t = new Acc();
  t.add('iron', boxB(w, 0.07, 0.06, w / 2, 0.12, 0)); t.add('iron', boxB(w, 0.07, 0.06, w / 2, h * 0.78, 0)); t.add('iron', boxB(w, 0.06, 0.06, w / 2, 0.42, 0));
  for (const x of [0.04, w - 0.04]) t.add('iron', boxB(0.08, h * 0.86, 0.08, x, 0.05, 0));
  const g = new THREE.PlaneGeometry(w - 0.1, h - 0.05), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * Math.max(1, Math.round((w - 0.1) / 0.5))); g.translate(w / 2, h / 2 + 0.05, 0); t.add('tileGrille', g);
  for (let x = 0.4; x < w - 0.3; x += 0.75) { const r = new THREE.TorusGeometry(0.16, 0.022, 4, 12); r.translate(x, h * 0.6, 0); t.add('railBar', r); }
  put(acc, t, xh, 0, 0, Math.PI / 2); // cánh mở vào trong: trục cánh (+x cục bộ) quay về −z
}
/** vòm sắt trên cổng (couronnement): cung sắt + cuộn + huy hiệu mạ vàng */
function overthrow(acc, x0, x1, y, rise, k = 1) {
  const n = 12, pts = [], xm = (x0 + x1) / 2, a = (x1 - x0) / 2;
  for (let i = 0; i <= n; i++) { const u = -1 + (2 * i) / n; pts.push(V(xm + u * a, y + rise * (1 - u * u), 0)); }
  acc.add('iron', ribAlong(pts, 0.08, 0.08)); acc.add('iron', ribAlong(pts.map((p) => V(p.x, y + (p.y - y) * 0.55 + 0.12, 0)), 0.05, 0.05));
  for (let x = x0 + 0.3; x < x1 - 0.2; x += 0.24) { const u = (x - xm) / a; acc.add('railBar', boxB(0.03, rise * (1 - u * u) * 0.98, 0.03, x, y, 0)); }
  for (const s of [-1, 1]) { const r = new THREE.TorusGeometry(0.28 * k, 0.035, 4, 14); r.translate(xm + s * a * 0.5, y + rise * 0.45, 0); acc.add('railBar', r); }
  cartouche(acc, xm, y + rise + 0.25 * k, -0.05, 0.7 * k, 0.85 * k, 'gilt', true); acc.add('gilt', new THREE.SphereGeometry(0.14 * k, 8, 6).translate(xm, y + rise + 0.85 * k, 0));
}
/** trụ cổng đá khía rãnh + gờ mũ + bình / quả cầu / trophée */
function pier(acc, x, z, w, h, top = 'urn', v = 0) {
  acc.add('trim', boxB(w + 0.2, 0.35, w + 0.2, x, 0, z));
  for (let y = 0.35, i = 0; y < h - 0.5; y += 0.5, i++) acc.add(i % 2 ? 'ash' : 'rust', boxB(w + (i % 2 ? 0 : 0.06), Math.min(0.46, h - 0.5 - y), w + (i % 2 ? 0 : 0.06), x, y, z));
  acc.add('ash', boxB(w, h - 0.35, w, x, 0.35, z));
  acc.add('trim', boxB(w + 0.14, 0.18, w + 0.14, x, h - 0.5, z)); acc.add('trim', boxB(w + 0.3, 0.22, w + 0.3, x, h - 0.32, z)); acc.add('trim', boxB(w + 0.1, 0.1, w + 0.1, x, h - 0.1, z));
  if (top === 'urn') { acc.add('trim', boxB(w * 0.55, 0.3, w * 0.55, x, h, z)); acc.add('carve', lathe([[0.001, 0], [0.22, 0], [0.2, 0.1], [0.12, 0.2], [0.34, 0.45], [0.36, 0.62], [0.22, 0.82], [0.26, 0.9], [0.1, 1.0], [0.06, 1.18], [0.001, 1.25]].map(([r, y]) => [r * w * 0.95, y * w * 0.95]), x, h + 0.3, z, 10)); }
  else if (top === 'ball') { acc.add('trim', boxB(w * 0.5, 0.2, w * 0.5, x, h, z)); acc.add('trim', new THREE.SphereGeometry(w * 0.32, 12, 8).translate(x, h + 0.2 + w * 0.3, z)); }
  else if (top === 'fire') potAFeu(acc, x, h, z, w * 1.15, v, 'carve');
  else if (top === 'cap') { acc.add('tileRoof', squareLathe([[w * 0.75, 0], [w * 0.35, 0.3], [0.001, 0.42]], x, h + 0.02, z, w * 0.75, w * 0.75)); acc.add('carve', new THREE.SphereGeometry(0.1, 8, 6).translate(x, h + 0.5, z)); }
}
function gateFn(id, S, g, opt = {}) {
  const acc = new Acc(), villa = !!g.villa, v = villa ? ((opt.variant | 0) % 3 + 3) % 3 : 0, gw = g.w;
  if (villa) {
    const pw = v === 1 ? 0.62 : 0.55, ph = v === 1 ? 2.5 : 2.3, xp = gw / 2 + pw / 2 + 0.04;
    acc.add('step', boxB(gw, 0.08, 1.2, 0, 0, -0.3));
    for (const s of [-1, 1]) pier(acc, s * xp, -pw / 2, pw, ph, v === 0 ? 'ball' : v === 1 ? 'cap' : 'urn', s);
    for (const s of [-1, 1]) leaf(acc, s * gw / 2, gw / 2 - 0.04, v === 2 ? 1.9 : 1.75, s);
    if (v === 0) { const t = new Acc(); overthrow(t, -gw / 2, gw / 2, ph - 0.1, 0.75, 0.45); put(acc, t, 0, 0, -pw / 2, 0); }
    else if (v === 2) { acc.add('iron', boxB(gw, 0.08, 0.08, 0, ph - 0.25, -pw / 2)); for (let x = -gw / 2 + 0.1; x < gw / 2; x += 0.16) acc.add('railBar', boxB(0.025, 0.4, 0.025, x, ph - 0.25, -pw / 2)); }
    else { const t = new Acc(); overthrow(t, -gw / 2, gw / 2, ph - 0.35, 0.35, 0.4); put(acc, t, 0, 0, -pw / 2, 0); }
    return out(acc, id, v, { kind: 'gate-v', variant: v });
  }
  const pw = 1.3, ph = 4.6, xp = gw / 2 + pw / 2 + 0.05, chat = id !== 'palladian', topK = chat ? 'fire' : 'urn';
  acc.add('step', boxB(gw + 2 * pw + 1, 0.1, 2.6, 0, 0, -0.6));
  for (const s of [-1, 1]) pier(acc, s * xp, -pw / 2, pw, ph, topK, s + 1);
  for (const s of [-1, 1]) leaf(acc, s * gw / 2, gw / 2 - 0.05, 3.6, s);
  { const t = new Acc(); overthrow(t, -gw / 2, gw / 2, ph - 0.25, 1.7); put(acc, t, 0, 0, -pw / 2, 0); }
  // hai bên: tường thấp + hàng rào sắt + trụ nhỏ (palladian) / nhà gác cổng mái vòm vuông đá đen (chateau)
  const xs0 = xp + pw / 2, run = 3.6, pw2 = 0.85;
  for (const s of [-1, 1]) {
    const xm = s * (xs0 + run / 2), xe = s * (xs0 + run + pw2 / 2);
    if (!chat) {
      acc.add('ash', boxB(run, 0.75, 0.55, xm, 0, -0.3)); acc.add('trim', boxB(run + 0.05, 0.12, 0.65, xm, 0.75, -0.3));
      const gg = new THREE.PlaneGeometry(run, 1.9), uv = gg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * Math.round(run / 0.5)); gg.translate(xm, 0.87 + 0.95, -0.3); acc.add('tileGrille', gg);
      acc.add('iron', boxB(run, 0.06, 0.06, xm, 2.3, -0.3));
      pier(acc, xe, -0.3, pw2, 2.9, 'ball', s);
    } else {
      const lw = 3.2, ld = 3.2, lx = s * (xs0 + lw / 2 + 0.2), lz = -ld / 2 - 0.15, lh = 3.8, f = new Acc();
      f.add('ash', slabHoles(rectPts(-lw / 2, 0, lw / 2, lh), [rectPts(-0.55, 1.0, 0.55, 2.9)], 0, 0.4));
      windowC(f, { kind: 'rect', x: 0, y0: 1.0, w: 1.1, h: 1.9, cross: true, glass: 'tileGlass', hood: 'cornice' }); quoins(f, lw, 0.1, lh - 0.5, 'rust', 0.07, 0.7, 0.4);
      entab(f, 'doric', -lw / 2 - 0.25, lw / 2 + 0.25, lh - 0.6, 0, 0.6, { key: 'trim', capKey: 'trim', dep: 0.5 });
      put(acc, f, lx, 0, lz + ld / 2, 0);
      for (const [px, pz, ry] of [[lx, lz - ld / 2, Math.PI], [lx - lw / 2, lz, -Math.PI / 2], [lx + lw / 2, lz, Math.PI / 2]]) { const q = new Acc(); q.add('ash', boxB(ry === Math.PI ? lw : ld, lh, 0.4, 0, 0, -0.2)); quoins(q, ry === Math.PI ? lw : ld, 0.1, lh - 0.5, 'rust', 0.07, 0.7, 0.4); entab(q, 'doric', -(ry === Math.PI ? lw : ld) / 2 - 0.25, (ry === Math.PI ? lw : ld) / 2 + 0.25, lh - 0.6, 0, 0.6, { key: 'trim', capKey: 'trim', dep: 0.5 }); put(acc, q, px, 0, pz, ry); }
      acc.add('trim', boxB(lw + 0.3, 0.3, ld + 0.3, lx, 0, lz));
      const ax = lw / 2 + 0.3;
      acc.add('slate', squareLathe([[ax, 0], [ax * 0.95, 0.5], [ax * 0.78, 1.2], [ax * 0.5, 1.9], [ax * 0.2, 2.4], [0.001, 2.55]], lx, lh, lz, ax, ax * (ld + 0.6) / (lw + 0.6)));
      finial(acc, lx, lh + 2.45, lz, 1.2);
      acc.add('ash', boxB(0.3, 2.2, 0.4, s * (xs0 + 0.1), 0, -0.2));
    }
  }
  // trụ đá cặp bình ngoài cổng (khớp khối va chạm «sư tử / trụ cổng» tại ±(g.w/2 + 2,4), +2,4)
  for (const s of [-1, 1]) { acc.add('trim', boxB(1.4, 0.3, 1.9, s * (gw / 2 + 2.4), 0, 2.4)); acc.add('ash', boxB(1.1, 1.1, 1.6, s * (gw / 2 + 2.4), 0.3, 2.4)); acc.add('trim', boxB(1.3, 0.2, 1.8, s * (gw / 2 + 2.4), 1.4, 2.4)); acc.add('carve', lathe([[0.001, 0], [0.3, 0], [0.18, 0.15], [0.5, 0.5], [0.46, 0.75], [0.3, 0.85], [0.001, 0.88]], s * (gw / 2 + 2.4), 1.6, 2.4, 12)); acc.add('leaf', new THREE.IcosahedronGeometry(0.55, 1).scale(1, 0.8, 1).translate(s * (gw / 2 + 2.4), 2.6, 2.4)); }
  return out(acc, id, 0, { kind: 'gate' });
}

// ============================================================================ ĐĂNG KÝ
function hall(styleId, S, b, opt = {}) {
  if (styleId === 'palladian') return hallPalladian(styleId, b, opt);
  if (styleId === 'chateau') return hallChateau(styleId, b, opt);
  return hallPhap(styleId, b, opt);
}
function tower(styleId, S, t) { return styleId === 'palladian' ? towerRotunda(styleId, t) : towerDonjon(styleId, t); }
function pav(styleId, S, pv) { return styleId === 'palladian' ? pavTholos(styleId, pv) : pavGloriette(styleId, pv); }
function gate(styleId, S, g, opt = {}) { return gateFn(styleId, S, g, opt); }
export const FAMILY = { hall, tower, pav, gate };
