// ============================================================================
//  HỌ «WEST» cho biệt phủ / biệt thự (docs/bietphu/00-HOP-DONG.md, docs/bietphu/west.md):
//   · moorish     — Tây Ban Nha – Moorish (Alhambra / Generalife / Real Alcázar Sevilla): vữa trắng, mái bằng có răng cưa
//                   (almenas), hiên cuốn vòm nhiều múi trên cột Nasrid, vòm móng ngựa + alfiz, cửa sổ đôi (ajimez), dải gạch men
//                   (azulejo) xanh; nhà chính có qubba mái ngói men xanh; tháp: minaret kiểu Giralda / Kutubiyya.
//   · tuscan      — biệt thự Tuscan (Villa Medici Careggi / Fiesole, Villa di Poggio a Caiano, nhà trại Tuscany): vữa vàng đất,
//                   khung cửa đá pietra serena, đá góc, mái chóp cụt ngói ống thấp vươn sâu trên xà gỗ, loggia cuốn tròn trên
//                   cột thức Tuscan, tháp altana giữa mái; tháp: campanile Romanesque Tuscany.
//   · diatrunghai — biệt thự Địa Trung Hải (Andalucía / Provence / Santorini): vôi trắng, mái chóp cụt ngói đỏ + génoise,
//                   cửa vòm tròn, cửa chớp xanh, ban công sắt, hiên cuốn trụ vữa.
//  Dựng ĐÚNG KHUÔN LÔ: vách trên chu vi w × d (hiên lùi ≤ 1,6 m), khe cửa 2,4 m giữa mặt +z (+ mặt −z nếu back), sàn trống ở
//  b.plinth, nền (w + 2,4) × (d + 2,4) với bậc giữa. Cấu kiện: est-west-kit.js (tienphu/arch CHỈ import).
// ============================================================================
import * as THREE from 'three';
import {
  sweepXY, archCurve,
  Acc, box, boxB, lathe, beam, V, westMats, finishWest, Fc, sides, archPoly, archRise, wallPanel, dressOp, nasridCol, tuscanCol,
  arcade, ring, cornice, quoins, plinthBase, hipRoof, gableRoof, merlonParapet, balustrade, ironRail, chimney, extXY,
} from './est-west-kit.js';

const PI = Math.PI;
const SID = (s) => (s === 'moorish' || s === 'tuscan' ? s : 'diatrunghai');

// ---------------------------------------------------------------- thông số phong cách
const ST = {
  moorish: { t: 0.6, bay: 4.1, loggiaBays: 5, rec: 0.95, arcA: 0.78 },
  tuscan: { t: 0.55, bay: 3.85, loggiaBays: 3, rec: 0.95, arcA: 0.78 },
  diatrunghai: { t: 0.42, bay: 3.9, loggiaBays: 3, rec: 1.05, arcA: 0.72 },
};
/** chia cao b.h thành nF tầng: tầng trệt cao hơn (≤ 4,5), các tầng trên bằng nhau (Tuscan: tầng áp mái thấp) */
function floorsOf(style, h, nF) {
  if (nF <= 1) return [h];
  if (style === 'tuscan' && nF >= 3) { const f2 = Math.min(3.7, h * 0.29), f0 = (h - f2) / 2; return [f0, f0, f2].concat(Array(nF - 3).fill(f2)); }
  const f0 = Math.min(4.5, h / nF + 0.3), r = (h - f0) / (nF - 1); return [f0, ...Array(nF - 1).fill(r)];
}
const oddN = (L, bay) => { let n = Math.max(1, Math.round(L / bay)); if (n % 2 === 0) n += L / n > bay ? 1 : -1; return Math.max(1, n); };

// ---------------------------------------------------------------- ô cửa theo phong cách / tầng
/** cửa sổ tầng k ở toạ độ cx (mặt ngoài); y0 = cao sàn tầng; where: 'out' (vách chu vi) · 'log' (vách trong hiên) */
function winOf(style, k, nF, cx, y0, fh, where = 'out', big = false) {
  if (style === 'moorish') {
    if (where === 'log') return { cx, y: y0 + 1.35, w: 1.3, hs: 0.9, kind: 'horse', dress: { sill: 'marble', alfiz: 'azul', lattice: true, glass: true } };
    if (k === 0) return { cx, y: y0 + 1.0, w: 1.15, hs: 1.75, kind: 'rect', dress: { sill: 'marble', grille: true, frame: 'wood', surround: 'trim', bw: 0.16 } };
    if (k === 1) return { cx, y: y0 + 0.95, w: 1.95, pair: 0.26, hs: 1.25, kind: 'horse', dress: { sill: 'marble', alfiz: 'azul', colonnette: 'marble', frame: null, lattice: false } };
    return { cx, y: y0 + 0.95, w: 1.05, hs: 1.05, kind: 'horse', dress: { sill: 'marble', alfiz: 'trim', lattice: true } };
  }
  if (style === 'tuscan') {
    const top = k === nF - 1 && nF >= 3;
    if (where === 'log') return { cx, y: y0 + 0.7, w: 1.25, hs: 2.2, kind: 'rect', dress: { surround: 'ashlar', cap: 'ashlar', frame: 'wood', sill: 'ashlar' } };
    if (top) return { cx, y: y0 + 1.05, w: 0.95, hs: 0.95, kind: 'rect', dress: { surround: 'ashlar', sill: 'ashlar', frame: 'wood', bw: 0.17 } };
    if (k === 0) return { cx, y: y0 + 1.05, w: 1.2, hs: 1.85, kind: 'rect', dress: { surround: 'ashlar', cap: 'ashlar', sill: 'ashlar', consoles: 'ashlar', grille: true, frame: 'wood' } };
    if (big) return { cx, y: y0 + 0.08, w: 1.45, hs: 2.75, kind: 'rect', dress: { surround: 'ashlar', cap: 'ashlar', frame: 'wood', shutter: true } };
    return { cx, y: y0 + 0.85, w: 1.2, hs: 2.25, kind: 'rect', dress: { surround: 'ashlar', cap: 'ashlar', sill: 'ashlar', frame: 'wood', shutter: true } };
  }
  // Địa Trung Hải
  if (where === 'log') return { cx, y: y0 + 0.75, w: 1.25, hs: 1.6, kind: 'round', dress: { surround: 'trim', bw: 0.12, frame: 'wood', shutter: true, sill: 'trim' } };
  if (k === 0) return { cx, y: y0 + 0.9, w: 1.2, hs: 1.45, kind: 'round', dress: { surround: 'trim', bw: 0.14, frame: 'wood', shutter: true, sill: 'trim', grille: false } };
  if (big) return { cx, y: y0 + 0.08, w: 1.35, hs: 2.45, kind: 'rect', dress: { surround: 'trim', bw: 0.14, frame: 'wood', shutter: true } };
  const small = k === nF - 1 && nF >= 3;
  return { cx, y: y0 + 0.9, w: small ? 1.0 : 1.15, hs: small ? 1.4 : 1.85, kind: 'rect', dress: { surround: 'trim', bw: 0.14, frame: 'wood', shutter: true, sill: 'trim' } };
}
function doorOf(style, cx, y0) {
  if (style === 'moorish') return { cx, y: y0, w: 2.5, hs: 1.42, kind: 'horse', dress: { door: true, alfiz: 'azul' } };
  if (style === 'tuscan') return { cx, y: y0, w: 2.5, hs: 1.95, kind: 'round', dress: { door: true, surround: 'ashlar', bw: 0.3 } };
  return { cx, y: y0, w: 2.5, hs: 1.95, kind: 'round', dress: { door: true, surround: 'trim', bw: 0.16 } };
}

/** lưới trám (sebka) nổi trên mặt F trong khung x0..x1 × y0..y1 (gờ vữa) — khoá lattice (bậc vừa bỏ) */
function sebka(F, x0, x1, y0, y1, z = 0.02, cell = 0.55, key = 'lattice') {
  const k = 1.6, W = x1 - x0, H = y1 - y0;
  for (const s of [1, -1]) for (let c = -H / k; c < W + H / k; c += cell) {
    // đường y = y0 + s·k·(x − x0 − c) (s = −1: gốc ở cạnh trên)
    const pts = [];
    for (const [xa, ya] of [[x0, null], [x1, null], [null, y0], [null, y1]]) {
      let x, y; if (xa != null) { x = xa; y = s > 0 ? y0 + k * (x - x0 - c) : y1 - k * (x - x0 - c); } else { y = ya; x = s > 0 ? x0 + c + (y - y0) / k : x0 + c + (y1 - y) / k; }
      if (x >= x0 - 1e-6 && x <= x1 + 1e-6 && y >= y0 - 1e-6 && y <= y1 + 1e-6) pts.push([x, y]);
    }
    if (pts.length < 2) continue; pts.sort((a, b) => a[0] - b[0]); const [a, b] = [pts[0], pts[pts.length - 1]]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.1) continue;
    F.add(key, beam(V(a[0], a[1], z), V(b[0], b[1], z), 0.06, 0.05));
  }
  F.add('trim', boxB(W + 0.12, 0.08, 0.06, (x0 + x1) / 2, y0 - 0.08, z)); F.add('trim', boxB(W + 0.12, 0.08, 0.06, (x0 + x1) / 2, y1, z));
}

// ================================================================= NHÀ (hall)
/** cấu hình theo biến thể: log 'ground' (hiên cuốn tầng trệt, ban công trên) · 'upper' (hành lang cuốn tầng 2, galería) · 'none';
 *  roof 'hip' | 'gable' | 'flat'; bays (gian mặt tiền); skip: gian tầng trệt bỏ trống cạnh cửa; canopy: mái hắt ngói trên cửa
 *  (tejaroz); balcony: ban công sắt gian giữa tầng 2; mirador: chòi vọng trên mái */
function varOf(st, villa, v) {
  if (st === 'diatrunghai' && villa) return [
    { log: 'ground', roof: 'hip', bays: 3 },
    { log: 'none', roof: 'gable', bays: 5, skip: [1], canopy: true, balcony: true },
    { log: 'upper', roof: 'hip', bays: 3, canopy: true, mirador: true },
  ][v % 3];
  return { log: 'ground', roof: st === 'moorish' ? 'flat' : 'hip', bays: null };
}
function hall(styleId, S, b, opt = {}) {
  const st = SID(styleId), cfg = ST[st], villa = !!opt.villa, vv = villa ? (opt.variant | 0) % 3 : 0, VC = varOf(st, villa, vv), acc = new Acc();
  const W = b.w, D = b.d, hw = W / 2, hd = D / 2, P = b.plinth, nF = Math.max(1, b.floors || 1), t = villa ? Math.min(cfg.t, 0.45) : cfg.t;
  const fl = floorsOf(st, b.h, nF), ys = [P]; for (const h of fl) ys.push(ys[ys.length - 1] + h);
  const yW = ys[nF];
  // nền + bậc
  const sw = Math.min(6, 0.3 * W), stairs = [{ side: 'f', w: sw }]; if (b.back) stairs.push({ side: 'b', w: sw });
  plinthBase(acc, W + 2.4, D + 2.4, P, stairs);

  // ---- lưới gian
  const nf = VC.bays || oddN(W, villa ? 3.9 : cfg.bay), s = W / nf, ci = (nf - 1) / 2, xs = Array.from({ length: nf }, (_, i) => -hw + s * (i + 0.5));
  const ns = Math.max(2, Math.round(D / cfg.bay)), ss = (D - 2 * t) / ns, zs = Array.from({ length: ns }, (_, i) => -hd + t + ss * (i + 0.5));
  const nl = villa ? nf : Math.min(nf, cfg.loggiaBays), Lg = nl * s, lx0 = -Lg / 2, lx1 = Lg / 2;
  const logK = nf >= 3 ? (VC.log === 'ground' ? 0 : VC.log === 'upper' ? 1 : -1) : -1;
  const SD = sides(acc, W, D);
  const sideF = { r: new Fc(acc, PI / 2, hw, 0), l: new Fc(acc, -PI / 2, -hw, 0) };
  const bigMid = logK === 0 || VC.balcony;
  const skipG = (i) => VC.skip && VC.skip.includes(Math.abs(i - ci));

  // ---- vách từng tầng
  for (let k = 0; k < nF; k++) {
    const y0 = ys[k], y1 = ys[k + 1], fh = y1 - y0;
    const front = [], back = [];
    xs.forEach((x, i) => {
      const mid = i === ci;
      if (k === logK && x > lx0 && x < lx1) return;                       // trong hiên: vách lùi riêng
      if (k === 0 && mid) { front.push(doorOf(st, x, y0)); return; }
      if (k === 0 && skipG(i)) return;
      front.push(winOf(st, k, nF, x, y0, fh, 'out', k === 1 && mid && bigMid));
    });
    xs.forEach((x, i) => { if (k === 0 && skipG(i)) return; back.push(k === 0 && i === ci && b.back ? doorOf(st, -x, y0) : winOf(st, k, nF, -x, y0, fh)); });
    const fF = SD.f.F;
    if (k === logK) {
      if (lx0 > -hw + 0.05) { wallPanel(fF, 'wall', -hw, lx0, y0, y1, t, front.filter((o) => o.cx < lx0)); wallPanel(fF, 'wall', lx1, hw, y0, y1, t, front.filter((o) => o.cx > lx1)); }
    } else wallPanel(fF, 'wall', -hw, hw, y0, y1, t, front);
    for (const o of front) dressOp(fF, o, t);
    wallPanel(SD.b.F, 'wall', -hw, hw, y0, y1, t, back); for (const o of back) dressOp(SD.b.F, o, t);
    for (const sd of ['r', 'l']) {
      const ops = zs.map((z) => winOf(st, k, nF, z, y0, fh));
      wallPanel(sideF[sd], 'wall', -hd + t, hd - t, y0, y1, t, ops); for (const o of ops) dressOp(sideF[sd], o, t);
    }
    if (k > 0) acc.add('wall', boxB(W - 2 * t + 0.02, 0.24, D - 2 * t + 0.02, 0, y0 - 0.24, 0));   // sàn tầng trên
  }
  if (logK >= 0) loggia(acc, st, { W, D, t, ys, xs, s, ci, Lg, lx0, lx1, cfg, k: logK });
  if (VC.canopy) canopy(acc, 0, ys[0] + 3.55, hd, 3.4);
  if (VC.balcony) {
    const yb = ys[1], z1 = hd + 0.85; acc.add('trim', boxB(2.6, 0.16, 0.95, 0, yb - 0.16, hd + 0.42));
    for (const sx of [-1, 1]) acc.add('trim', boxB(0.18, 0.42, 0.7, sx * 1.05, yb - 0.58, hd + 0.35));
    ironRail(acc, [-1.22, z1], [1.22, z1], yb); for (const sx of [-1, 1]) ironRail(acc, [sx * 1.22, hd + 0.02], [sx * 1.22, z1], yb);
  }

  // ---- gờ tầng, chân tường (chừa khe cửa / hiên), đá góc
  const gF = [logK === 0 ? [lx0 - 0.05, lx1 + 0.05] : [-1.75, 1.75]], gB = b.back ? [[-1.75, 1.75]] : [];
  if (st === 'moorish') {
    for (let k = 1; k < nF; k++) ring(acc, 'azul', W, D, ys[k] - 0.12, 0.3, 0.05);
    baseRing(acc, 'trim', W, D, P, 0.5, 0.04, gF, gB);
  } else if (st === 'tuscan') {
    for (let k = 1; k < nF; k++) { ring(acc, 'ashlar', W, D, ys[k] - 0.05, 0.2, 0.1); ring(acc, 'ashlar', W, D, ys[k] + 0.15, 0.06, 0.05); }
    baseRing(acc, 'ashlar', W, D, P, 0.75, 0.06, gF, gB); baseRing(acc, 'ashlar', W, D, P + 0.75, 0.1, 0.12, gF, gB);
    quoins(acc, 'ashlar', W, D, P + 0.85, yW - 0.1);
  } else {
    baseRing(acc, 'ashlar', W, D, P, 0.55, 0.03, gF, gB);
    for (let k = 1; k < nF; k++) ring(acc, 'trim', W, D, ys[k] - 0.04, 0.14, 0.05);
    if (vv === 1) quoins(acc, 'trim', W, D, P + 0.6, yW - 0.1, 0, 0, 0.5);
  }

  // ---- đỉnh: mái
  let top = yW;
  if (st === 'moorish') top = moorTop(acc, { W, D, yW, t, b, xs, s, nf, villa });
  else if (st === 'tuscan') {
    const yc = cornice(acc, 'trim', W, D, yW - 0.55, [[0.2, 0.05], [0.16, 0.16], [0.14, 0.3]]);
    const r = hipRoof(acc, { W, D, yw: yc, over: villa ? 0.9 : 1.25, slope: 0.4, keys: { rafter: 'wood' }, rafter: 0.62 }); top = r.top;
    if (!villa && b.id === 'main' && W >= 20) top = Math.max(top, belvedere(acc, 'tuscan', { y0: yc - 0.5, Wa: Math.min(8.2, 2 * s + 0.6), Da: 6.2, h: 7.0, nA: [3, 2] }));
    chimney(acc, -hw + 2.6, yc + 0.6, -hd + 2.2, 2.2, 1.0); chimney(acc, hw - 2.6, yc + 0.6, -hd + 2.2, 2.2, 1.0);
  } else {
    // génoise: hai hàng ngói ống dưới diềm (Provence / Andalucía) + phào
    let yc = cornice(acc, 'trim', W, D, yW - 0.3, [[0.16, 0.04], [0.14, 0.12]]);
    if (VC.roof === 'gable') {
      let yy = yc; for (const [h, o] of [[0.13, 0.22], [0.13, 0.34]]) { for (const sz of [1, -1]) acc.add('ribR', boxB(W + 2 * o, h, o + 0.25, 0, yy, sz * (hd + o - (o + 0.25) / 2))); yy += h; }
      yc = yy;
      const r = gableRoof(acc, { W, D, yw: yc, over: 0.55, overG: 0.3, slope: 0.4, t, keys: { soffit: 'trim' } }); top = r.top;
      chimney(acc, hw - 1.6, yc + 0.6, -1.4, 1.9, 0.9);
    } else {
      yc = cornice(acc, 'ribR', W, D, yc, [[0.13, 0.22], [0.13, 0.34]]);
      const r = hipRoof(acc, { W, D, yw: yc, over: 0.55, slope: 0.38, keys: { soffit: 'trim' } }); top = r.top;
      if (VC.mirador) top = Math.max(top, belvedere(acc, 'diatrunghai', { cx: -hw + 2.3, cz: -hd + 2.4, y0: yc - 0.4, Wa: 3.6, Da: 3.6, h: 3.9, nA: [1, 1], over: 0.45 }));
      else chimney(acc, hw - 2.0, yc + 0.4, -0.4, 1.6, 0.9);
    }
  }
  return { acc, mats: westMats(st, vv), post: finishWest(), info: { kind: 'est-west', style: st, variant: vv, floors: fl.map((f) => +f.toFixed(2)), top: +top.toFixed(1) } };
}

/** mái hắt ngói nhỏ trên cửa (tejaroz Andalucía / auvent Provence) trên hai công-xon gỗ, nhô d từ mặt vách z0 */
function canopy(acc, cx, y, z0, w, d = 1.0) {
  for (const sx of [-1, 1]) { acc.add('wood', boxB(0.14, 0.16, d, cx + sx * (w / 2 - 0.3), y - 0.16, z0 + d / 2)); acc.add('wood', beam(V(cx + sx * (w / 2 - 0.3), y - 0.9, z0 + 0.05), V(cx + sx * (w / 2 - 0.3), y - 0.12, z0 + d * 0.8), 0.12, 0.12)); }
  const g = new Acc(); hipRoof(g, { W: w, D: d * 2, yw: y + 0.1, over: 0.15, slope: 0.45, keys: { soffit: 'wood' } });
  // nửa trước của mái chóp (ép phần z < 0 về sát vách)
  for (const [k, l] of g.parts) for (const geo of l) { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) if (p.getZ(i) < 0) p.setZ(i, 0); geo.translate(cx, 0, z0); acc.add(k, geo); }
}

/** hiên cuốn tầng k: vách lùi rec (cửa chính / cửa sổ), dãy vòm phía trước, trần gỗ, lan can.
 *  k = 0: dãy vòm đứng trên nền ngoài chu vi (arcA) + ban công tầng 2 trên hiên; k = 1: dãy vòm trên chu vi, vách lùi 1,7 m (galería) */
function loggia(acc, st, { W, D, t, ys, xs, s, ci, Lg, lx0, lx1, cfg, k }) {
  const hd = D / 2, up = k > 0, yb = ys[k], top = ys[k + 1], fh = top - yb;
  const rec = up ? 1.7 : Math.min(cfg.rec, 1.55 - t), aZ = up ? -0.4 : cfg.arcA, tA = 0.4;
  const FR = new Fc(acc, 0, 0, hd - rec), FA = new Fc(acc, 0, 0, hd + aZ + tA / 2), full = Lg >= W - 0.05;
  // vách lùi
  const ops = [], inL = xs.map((x, i) => [x, i]).filter(([x]) => x > lx0 && x < lx1);
  for (const [x, i] of inL) ops.push(!up && i === ci ? doorOf(st, 0, yb) : up ? winOf(st, 1, 3, x, yb, fh, 'out', true) : winOf(st, 0, 1, x, yb, fh, 'log'));
  wallPanel(FR, 'wall', lx0 + (full ? t : 0), lx1 - (full ? t : 0), yb, top, t, ops); for (const o of ops) dressOp(FR, o, t);
  if (st === 'moorish') { // dải gạch men (azulejo) chân tường hiên cao 1,2 m, viền trắng
    const drs = ops.filter((o) => o.dress.door);
    for (const [a, b] of spans(lx0 + (full ? t : 0), lx1 - (full ? t : 0), drs, 0.32)) { acc.add('azul', boxB(b - a, 1.2, 0.04, (a + b) / 2, yb, hd - rec + 0.02)); acc.add('azulW', boxB(b - a, 0.08, 0.06, (a + b) / 2, yb + 1.2, hd - rec + 0.03)); }
  }
  // vách hồi hai đầu hiên
  const zA = hd + aZ + tA, zr = hd - rec;
  for (const sx of [-1, 1]) acc.add('wall', boxB(0.55, fh, zA - zr, sx * (Lg / 2 + (full ? -0.275 : 0.275)), yb, (zA + zr) / 2));
  // dãy vòm
  const arches = []; let yS, col, colMax = 0.75, archKey = null;
  if (st === 'moorish') {
    const wc = Math.min(2.9, s - 0.9), rc = archRise('horse', wc); yS = top - 0.28 - rc;
    for (const [x, i] of inL) {
      if (i === ci) arches.push({ cx: x, w: wc, kind: 'horse' });
      else { const w = (s - 0.62 - 0.34) / 2; arches.push({ cx: x - (w + 0.34) / 2, w, kind: 'lobed', lobes: 3 }, { cx: x + (w + 0.34) / 2, w, kind: 'lobed', lobes: 3 }); }
    }
    col = (x, z, g) => { const c = worldOf(FA, x, z); if (g > 0.5) for (const d of [-g / 4, g / 4]) nasridCol(acc, 'marble', c[0] + d, yb, c[2], yS - yb, 0.12); else nasridCol(acc, 'marble', c[0], yb, c[2], yS - yb, 0.13); };
    archKey = 'trim';
  } else if (st === 'tuscan') {
    const w = s - 0.55, r = archRise('round', w); yS = top - 0.5 - r;
    for (const [x] of inL) arches.push({ cx: x, w, kind: 'round' });
    col = (x, z) => { const c = worldOf(FA, x, z); tuscanCol(acc, 'pietra', c[0], yb, c[2], yS - yb, 0.4); };
    archKey = 'ashlar';
  } else {
    const w = s - (up ? 0.5 : 0.62), r = archRise('round', w); yS = top - (up ? 0.5 : 0.42) - r;
    for (const [x] of inL) arches.push({ cx: x, w, kind: 'round' });
    if (up) col = (x, z) => { const c = worldOf(FA, x, z); tuscanCol(acc, 'trim', c[0], yb, c[2], yS - yb, 0.3); }; else { col = null; colMax = 0; }
    archKey = 'trim';
  }
  arcade(FA, { key: 'wall', arches, y0: yb, ys: yS, yTop: top, t: tA, x0: lx0, x1: lx1, col, colMax, archKey, archBw: st === 'tuscan' ? 0.2 : 0.12 });
  if (st === 'moorish') { // lưới trám sebka trên vòm hai bên + alfiz quanh vòm giữa + dải men
    for (const [x, i] of inL) if (i !== ci) sebka(FA, x - s / 2 + 0.45, x + s / 2 - 0.45, yS + archRise('lobed', (s - 0.96) / 2) + 0.25, top - 0.45, 0.03);
    const wc = arches.find((a) => a.kind === 'horse'); if (wc) dressOp(FA, { cx: wc.cx, y: yS, w: wc.w, hs: 0, kind: 'horse', dress: { glass: false, open: true, alfiz: 'azul' } }, tA);
    FA.add('azul', boxB(Lg, 0.2, 0.05, 0, top - 0.32, 0.025));
  }
  if (st === 'tuscan') FA.add('ashlar', boxB(Lg + 0.3, 0.32, tA + 0.12, 0, top - 0.32, -tA / 2)); // trabeazione
  // trần hiên gỗ (alfarje / cassettoni) + dầm
  const zc0 = zr, zc1 = up ? hd : zA - tA / 2;
  acc.add(st === 'diatrunghai' ? 'trim' : 'wood', boxB(Lg - (full ? 2 * t : 0), 0.22, zc1 - zc0, 0, top - 0.22, (zc0 + zc1) / 2));
  if (st !== 'diatrunghai') for (let x = lx0 + 0.5; x < lx1 - 0.3; x += 0.7) acc.add('wood', boxB(0.14, 0.18, zc1 - zc0, x, top - 0.4, (zc0 + zc1) / 2));
  if (up) { // lan can sắt giữa các vòm (galería) + sàn hành lang
    const zr2 = hd - tA / 2; for (const a of arches) ironRail(acc, [a.cx - a.w / 2 + 0.02, zr2], [a.cx + a.w / 2 - 0.02, zr2], yb, { h: 0.95 });
    acc.add('trim', boxB(Lg - 2 * t, 0.06, rec, 0, yb, hd - rec / 2));
    return;
  }
  acc.add('trim', boxB(Lg + 0.1, 0.08, aZ + tA + 0.12, 0, top, hd + (aZ + tA + 0.1) / 2));
  // lan can ban công tầng 2 trên hiên
  const zb = hd + aZ + tA - 0.12, yb2 = top + 0.08;
  if (st === 'tuscan') { balustrade(acc, [lx0 + 0.1, zb], [lx1 - 0.1, zb], yb2, { h: 1.0 }); for (const sx of [-1, 1]) balustrade(acc, [sx * (Lg / 2 - 0.1), hd + 0.05], [sx * (Lg / 2 - 0.1), zb], yb2, { h: 1.0, posts: 5 }); }
  else if (st === 'diatrunghai') { ironRail(acc, [lx0 + 0.25, zb], [lx1 - 0.25, zb], yb2); for (const sx of [-1, 1]) ironRail(acc, [sx * (Lg / 2 - 0.25), hd + 0.05], [sx * (Lg / 2 - 0.25), zb], yb2); }
  else { // Moorish: lan can gỗ tiện kiểu mudéjar trên dải vữa thấp
    const pts = [[lx0 + 0.15, hd + 0.05], [lx0 + 0.15, zb], [lx1 - 0.15, zb], [lx1 - 0.15, hd + 0.05]];
    for (let i = 0; i < 3; i++) balustrade(acc, pts[i], pts[i + 1], yb2, { h: 0.95, rail: 'wood', bal: 'balusterW', pitch: 0.2, dep: 0.16, posts: 2.0 });
  }
}
/** chân tường quanh chu vi, chừa khe gF (mặt +z) / gB (mặt −z) [[x0, x1]] */
function baseRing(acc, key, W, D, y, h, out, gF = [], gB = []) {
  const dep = out + 0.25, hw = W / 2, hd = D / 2;
  for (const [sz, gaps] of [[1, gF], [-1, gB]]) {
    let a = -hw - out; const segs = []; for (const [g0, g1] of [...gaps].sort((p, q) => p[0] - q[0])) { if (g0 > a) segs.push([a, g0]); a = Math.max(a, g1); } if (hw + out > a) segs.push([a, hw + out]);
    for (const [x0, x1] of segs) if (x1 - x0 > 0.05) acc.add(key, boxB(x1 - x0, h, dep, (x0 + x1) / 2, y, sz * (hd + out - dep / 2)));
  }
  acc.add(key, boxB(dep, h, D, hw + out - dep / 2, y, 0)); acc.add(key, boxB(dep, h, D, -hw - out + dep / 2, y, 0));
}
const spans = (x0, x1, ops, pad) => { const out = []; let a = x0; for (const o of [...ops].sort((p, q) => p.cx - q.cx)) { const l = o.cx - o.w / 2 - pad; if (l > a) out.push([a, l]); a = o.cx + o.w / 2 + pad; } if (x1 > a) out.push([a, x1]); return out; };

/** đỉnh nhà Moorish: sàn mái + diềm men + lan can răng cưa; nhà chính: qubba giữa (mái ngói men xanh, cửa sổ đôi trên cao) */
function moorTop(acc, { W, D, yW, t, b, xs, s, nf, villa }) {
  const hw = W / 2, hd = D / 2, big = !villa && b.id === 'main' && W >= 20, T = big ? 4.6 : 0;
  acc.add('trim', boxB(W - 0.1, 0.3, D - 0.1, 0, yW - 0.3, 0));
  ring(acc, 'azul', W, D, yW - 0.62, 0.34, 0.04); ring(acc, 'trim', W, D, yW - 0.28, 0.28, 0.1);
  const e = 0.17, C = [[-hw + e, -hd + e], [hw - e, -hd + e], [hw - e, hd - e], [-hw + e, hd - e]];
  if (!T) merlonParapet(acc, 'wall', C, yW, { h: 0.85, t: 0.35 });
  else for (let i = 0; i < 4; i++) { // lan can giữa các tháp góc
    const a = C[i], c = C[(i + 1) % 4], L = Math.hypot(c[0] - a[0], c[1] - a[1]), u = [(c[0] - a[0]) / L, (c[1] - a[1]) / L];
    merlonParapet(acc, 'wall', [[a[0] + u[0] * (T - e), a[1] + u[1] * (T - e)], [c[0] - u[0] * (T - e), c[1] - u[1] * (T - e)]], yW, { h: 0.85, t: 0.35, closed: false });
  }
  let top = yW + 1.8;
  if (T) { // tháp góc (torreón, Alcázar Sevilla): nhô 3,6 m trên mái, mỗi mặt ngoài một cửa sổ móng ngựa, dải men, răng cưa
    const hT = 3.6, tq = 0.5;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const cx = sx * (hw - T / 2), cz = sz * (hd - T / 2), Q = sides(acc, T, T, cx, cz);
      for (const k of ['f', 'b', 'r', 'l']) {
        const x0 = k === 'r' || k === 'l' ? -T / 2 + tq : -T / 2, outward = (k === 'f' && sz > 0) || (k === 'b' && sz < 0) || (k === 'r' && sx > 0) || (k === 'l' && sx < 0);
        const ops = outward ? [{ cx: 0, y: yW + 0.9, w: 1.0, hs: 1.0, kind: 'horse', dress: { alfiz: 'azul', lattice: true, sill: 'marble' } }] : [];
        wallPanel(Q[k].F, 'wall', x0, -x0, yW - 0.05, yW + hT, tq, ops); for (const o of ops) dressOp(Q[k].F, o, tq);
      }
      ring(acc, 'azul', T, T, yW + hT - 0.62, 0.3, 0.04, cx, cz); ring(acc, 'trim', T, T, yW + hT - 0.3, 0.3, 0.1, cx, cz);
      acc.add('trim', boxB(T - 0.2, 0.25, T - 0.2, cx, yW + hT - 0.25, cz));
      merlonParapet(acc, 'wall', [[cx - T / 2 + e, cz - T / 2 + e], [cx + T / 2 - e, cz - T / 2 + e], [cx + T / 2 - e, cz + T / 2 - e], [cx - T / 2 + e, cz + T / 2 - e]], yW + hT, { h: 0.8, t: 0.34, pitch: 1.05 });
    }
    top = yW + hT + 1.7;
    // tejaroz: mái hắt gỗ chạm vươn sâu ngói men xanh trên 3 gian giữa mặt tiền (Palacio de Pedro I, Alcázar Sevilla 1364)
    const wT = s * 3 + 0.4, yT = yW - 0.75, dT = 1.5;
    for (let x = -wT / 2 + 0.25; x <= wT / 2 - 0.2; x += 0.42) { acc.add('wood', boxB(0.16, 0.22, dT, x, yT - 0.22, hd + dT / 2 - 0.1)); acc.add('wood', boxB(0.16, 0.2, dT * 0.6, x, yT - 0.42, hd + dT * 0.3 - 0.1)); }
    acc.add('wood', boxB(wT, 0.12, 0.2, 0, yT - 0.5, hd + 0.08)); acc.add('wood', boxB(wT + 0.1, 0.16, 0.12, 0, yT - 0.2, hd + dT - 0.1));
    const g = new Acc(); hipRoof(g, { W: wT, D: dT * 2, yw: yT + 0.05, over: 0.2, slope: 0.5, keys: { tile: 'tileG', rib: 'ribG', ridge: 'ridgeR', soffit: 'wood' }, rib: 0.32 });
    for (const [k, l] of g.parts) for (const geo of l) { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) if (p.getZ(i) < 0) p.setZ(i, 0); geo.translate(0, 0, hd); acc.add(k, geo); }
    for (const x of [-s, 0]) sebka(new Fc(acc, 0, 0, hd), x + 0.95, x + s - 0.95, yT - 2.1, yT - 0.75, 0.03, 0.5);
  }
  if (big) { // qubba: 3 gian giữa nhô cao 4,2 m (sảnh Đại sứ / đình sân Sư Tử)
    const Wq = s * 3 - 0.6, Dq = Math.min(D - 5, 10.5), h = 4.2, y0 = yW, tq = 0.5, Q = sides(acc, Wq, Dq);
    for (const k of ['f', 'b', 'r', 'l']) {
      const L = Q[k].L, n = Math.max(2, Math.round(L / 3.0)), ops = [];
      for (let i = 0; i < n; i++) ops.push({ cx: -L / 2 + (L * (i + 0.5)) / n, y: y0 + 1.5, w: 1.6, pair: 0.22, hs: 1.0, kind: 'lobed', lobes: 2, dress: { alfiz: 'azul', colonnette: 'marble', lattice: true } });
      const x0 = k === 'r' || k === 'l' ? -L / 2 + tq : -L / 2, x1 = -x0, ok = ops.filter((o) => o.cx - o.w / 2 > x0 + 0.2 && o.cx + o.w / 2 < x1 - 0.2);
      wallPanel(Q[k].F, 'wall', x0, x1, y0, y0 + h, tq, ok); for (const o of ok) dressOp(Q[k].F, o, tq);
    }
    ring(acc, 'azul', Wq, Dq, y0 + h - 0.6, 0.3, 0.04);
    const yc = cornice(acc, 'trim', Wq, Dq, y0 + h - 0.3, [[0.16, 0.06], [0.14, 0.18]]);
    const r = hipRoof(acc, { W: Wq, D: Dq, yw: yc, over: 0.95, slope: 0.5, keys: { tile: 'tileG', rib: 'ribG', ridge: 'ridgeR', rafter: 'wood' }, rafter: 0.5 });
    yamur(acc, 0, r.top - 0.1, 0, 0.9); top = Math.max(top, r.top + 1.6);
  }
  return top;
}
/** yamur: cột đồng 3 quả cầu vàng trên đỉnh (minaret Almohad) */
function yamur(acc, x, y, z, s = 1) {
  acc.add('gold', lathe([[0.001, 0], [0.07 * s, 0], [0.05 * s, 1.5 * s], [0.001, 1.5 * s]], x, y, z, 6));
  for (const [yy, r] of [[0.35, 0.26], [0.85, 0.2], [1.25, 0.14]]) { const g = new THREE.SphereGeometry(r * s, 10, 7); g.translate(x, y + yy * s, z); acc.add('gold', g); }
}

/** chòi vọng (altana / colombaia Tuscan giữa mái · mirador Andalucía): tháp vuông Wa × Da tâm (cx, cz) từ y0 cao h, phần trên
 *  là lô gia cuốn tròn mở (nA = [số vòm mặt dài, mặt ngắn]), sàn trong, đá góc (Tuscan), mái chóp cụt ngói vươn trên xà */
function belvedere(acc, st, { cx = 0, cz = 0, y0, Wa, Da, h, nA = [3, 2], over = 1.0 }) {
  const tq = 0.42, Q = sides(acc, Wa, Da, cx, cz), yL = y0 + h - 3.2, tus = st === 'tuscan';
  for (const k of ['f', 'b', 'r', 'l']) {
    const F = Q[k].F, L = Q[k].L, n = k === 'f' || k === 'b' ? nA[0] : nA[1], x0 = k === 'r' || k === 'l' ? -L / 2 + tq : -L / 2, x1 = -x0;
    const ops = []; for (let i = 0; i < n; i++) ops.push({ cx: -L / 2 + (L * (i + 0.5)) / n, y: yL + 0.5, w: Math.min(1.7, L / n - 0.75), hs: 1.4, kind: 'round', dress: { open: true, glass: false, surround: tus ? 'ashlar' : 'trim', bw: 0.14 } });
    wallPanel(F, 'wall', x0, x1, y0, y0 + h, tq, ops);
    for (const o of ops) { dressOp(F, o, tq); F.add(tus ? 'ashlar' : 'trim', boxB(o.w + 0.3, 0.12, tq + 0.12, o.cx, o.y - 0.12, -tq / 2)); if (!tus) ironRail({ add: (kk, g) => F.add(kk, g) }, [o.cx - o.w / 2, 0.06], [o.cx + o.w / 2, 0.06], o.y, { h: 0.8 }); }
  }
  acc.add('wall', boxB(Wa - 2 * tq, 0.2, Da - 2 * tq, cx, yL + 0.3, cz));
  ring(acc, tus ? 'ashlar' : 'trim', Wa, Da, yL + 0.25, 0.18, 0.08, cx, cz);
  if (tus) quoins(acc, 'ashlar', Wa, Da, y0 + 0.4, y0 + h - 0.2, cx, cz);
  const yc = cornice(acc, 'trim', Wa, Da, y0 + h - 0.35, [[0.17, 0.05], [0.15, 0.16]], cx, cz);
  const r = hipRoof(acc, { W: Wa, D: Da, yw: yc, over, slope: 0.4, cx, cz, keys: tus ? { rafter: 'wood' } : { soffit: 'trim' }, rafter: 0.6 });
  return r.top;
}

// ================================================================= THÁP (tower)
function tower(styleId, S, tw) {
  const st = SID(styleId);
  if (st === 'tuscan') return campanile(tw);
  if (st === 'moorish') return minaretTower(tw);
  return null;
}
/** minaret Almohad (Giralda Sevilla 1184–98 / Kutubiyya Marrakesh): thân vuông gạch, cột cửa sổ ajimez giữa mỗi mặt, ô sebka
 *  hai bên phần trên, sân thượng răng cưa, đèn lồng (yamur) nhỏ có vòm cuốn, mũ ngói men + 3 quả cầu vàng */
function minaretTower(tw) {
  const acc = new Acc(), H = tw.h || 36, A = Math.min(7.2, tw.w * 0.72), t = 0.9, yB = 1.6, yT = H * 0.76;
  plinthBase(acc, A + 1.6, A + 1.6, 0.6, [{ side: 'f', w: 2.6 }], 0, 0, { cheeks: false });
  acc.add('ashlar', boxB(A + 0.5, yB - 0.6, A + 0.5, 0, 0.6, 0));
  const Q = sides(acc, A, A);
  const levels = []; for (let y = yB + 2.6; y < yT - 3.2; y += 4.4) levels.push(y);
  for (const k of ['f', 'b', 'r', 'l']) {
    const x0 = k === 'r' || k === 'l' ? -A / 2 + t : -A / 2, x1 = -x0, ops = [];
    levels.forEach((y, i) => ops.push(i % 2 ? { cx: 0, y, w: 1.9, pair: 0.26, hs: 1.25, kind: 'horse', dress: { alfiz: 'trim', colonnette: 'marble', glass: true } } : { cx: 0, y, w: 1.0, hs: 1.35, kind: 'lobed', lobes: 3, dress: { alfiz: 'trim', glass: true, lattice: false } }));
    if (k === 'f') ops.unshift({ cx: 0, y: yB, w: 1.9, hs: 1.5, kind: 'horse', dress: { door: true, alfiz: 'azul' } });
    wallPanel(Q[k].F, 'brick', x0, x1, yB, yT, t, ops); for (const o of ops) dressOp(Q[k].F, o, t);
    // ô sebka hai bên phần trên thân (Giralda)
    const ySb = yT - 10.5; for (const sx of [-1, 1]) { const xa = sx * (A / 2 - 0.55), xb = sx * 1.75; sebka(Q[k].F, Math.min(xa, xb), Math.max(xa, xb), ySb, yT - 1.4, 0.03, 0.62, 'lattice'); Q[k].F.add('trim', boxB(0.1, yT - 1.4 - ySb, 0.06, xa, ySb, 0.03)); }
  }
  // lõi tối sau cửa sổ (nhìn vào không thấy trống)
  acc.add('shade', boxB(A - 2 * t - 0.6, yT - yB - 0.4, A - 2 * t - 0.6, 0, yB + 0.2, 0));
  ring(acc, 'azul', A, A, yT - 1.1, 0.5, 0.05); ring(acc, 'trim', A, A, yT - 0.4, 0.4, 0.14);
  acc.add('brick', boxB(A - 0.2, 0.3, A - 0.2, 0, yT - 0.3, 0));
  merlonParapet(acc, 'brick', [[-A / 2 + 0.2, -A / 2 + 0.2], [A / 2 - 0.2, -A / 2 + 0.2], [A / 2 - 0.2, A / 2 - 0.2], [-A / 2 + 0.2, A / 2 - 0.2]], yT, { h: 0.9, t: 0.4, mw: 0.66, pitch: 1.2, mh: 0.85, cap: 'trim' });
  // đèn lồng (yamur): thân vuông nhỏ, mỗi mặt vòm móng ngựa mở, mũ ngói men xanh
  const a = A * 0.46, hL = Math.max(4.6, (H - yT) - 4.4), tl = 0.45, Ql = sides(acc, a, a);
  for (const k of ['f', 'b', 'r', 'l']) {
    const x0 = k === 'r' || k === 'l' ? -a / 2 + tl : -a / 2, op = { cx: 0, y: yT + 1.1, w: a - 1.5, hs: 1.3, kind: 'horse', dress: { open: true, glass: false, alfiz: 'azul' } };
    wallPanel(Ql[k].F, 'brick', x0, -x0, yT, yT + hL, tl, [op]); dressOp(Ql[k].F, op, tl);
    sebka(Ql[k].F, -a / 2 + 0.35, a / 2 - 0.35, yT + hL - 1.35, yT + hL - 0.5, 0.03, 0.45);
  }
  acc.add('gold', lathe([[0.001, 0], [0.5, 0], [0.48, 0.25], [0.3, 0.7], [0.2, 1.4], [0.001, 1.6]], 0, yT + 0.1, 0, 12)); // lồng đèn đồng bên trong
  const yc = cornice(acc, 'trim', a, a, yT + hL - 0.3, [[0.14, 0.05], [0.14, 0.16]]);
  const r = hipRoof(acc, { W: a, D: a, yw: yc, over: 0.45, slope: 0.95, keys: { tile: 'tileG', rib: 'ribG', ridge: 'ridgeR', soffit: 'wood' }, rib: 0.32 });
  yamur(acc, 0, r.top - 0.15, 0, Math.min(1.4, (H - r.top + 0.15) / 1.5));
  return { acc, mats: westMats('moorish'), post: finishWest(), info: { kind: 'minaret', top: +(r.top + 1.5).toFixed(1) } };
}
/** campanile Romanesque Tuscany (vd. campanile Pieve di Romena, San Gimignano, Badia a Passignano): thân vuông đá, gờ chia tầng,
 *  cửa sổ hẹp → monofora → bifora; tầng chuông mở 2 vòm tròn mỗi mặt + chuông đồng; diềm vòm treo (archetti pensili);
 *  mái chóp cụt ngói thấp vươn ra, thánh giá sắt */
function campanile(tw) {
  const acc = new Acc(), H = tw.h || 36, A = Math.min(6.6, tw.w * 0.66), t = 0.85, yB = 1.4, yBell = H * 0.72, hBell = 5.6;
  plinthBase(acc, A + 1.4, A + 1.4, 0.45, [{ side: 'f', w: 2.4 }], 0, 0, { cheeks: false });
  acc.add('ashlar', boxB(A + 0.36, yB - 0.45, A + 0.36, 0, 0.45, 0));
  const Q = sides(acc, A, A), stages = [yB, yB + 7.6, yB + 14.4, yBell];
  for (let si = 0; si < stages.length - 1; si++) {
    const y0 = stages[si], y1 = stages[si + 1];
    for (const k of ['f', 'b', 'r', 'l']) {
      const x0 = k === 'r' || k === 'l' ? -A / 2 + t : -A / 2, x1 = -x0, ops = [];
      if (si === 0 && k === 'f') ops.push({ cx: 0, y: y0, w: 1.6, hs: 2.0, kind: 'round', dress: { door: true, surround: 'ashlar', bw: 0.26 } });
      else if (si === 0) ops.push({ cx: 0, y: y0 + 3.6, w: 0.32, hs: 1.3, kind: 'round', dress: { glass: true } });
      if (si === 1) ops.push({ cx: 0, y: y0 + 2.4, w: 0.8, hs: 1.8, kind: 'round', dress: { surround: 'trim', bw: 0.14, glass: true } });
      if (si === 2) ops.push({ cx: 0, y: y0 + 2.2, w: 1.9, pair: 0.26, hs: 1.9, kind: 'round', dress: { surround: 'trim', bw: 0.14, colonnette: 'marble', glass: true } });
      wallPanel(Q[k].F, 'ashlar', x0, x1, y0, y1, t, ops); for (const o of ops) dressOp(Q[k].F, o, t);
    }
    if (si > 0) { ring(acc, 'trim', A, A, y0 - 0.1, 0.22, 0.12); archetti(acc, A, y0 - 0.7); }
  }
  acc.add('shade', boxB(A - 2 * t - 0.5, yBell - yB - 0.5, A - 2 * t - 0.5, 0, yB + 0.3, 0));
  // tầng chuông: 2 vòm mở mỗi mặt, cột giữa
  ring(acc, 'trim', A, A, yBell - 0.15, 0.25, 0.14); archetti(acc, A, yBell - 0.8);
  for (const k of ['f', 'b', 'r', 'l']) {
    const x0 = k === 'r' || k === 'l' ? -A / 2 + t : -A / 2, w = (A - 2.4) / 2, ops = [-1, 1].map((s) => ({ cx: s * (w / 2 + 0.3), y: yBell + 0.9, w, hs: 2.4, kind: 'round', dress: { open: true, glass: false, surround: 'trim', bw: 0.16 } }));
    wallPanel(Q[k].F, 'ashlar', x0, -x0, yBell, yBell + hBell, t, ops); for (const o of ops) dressOp(Q[k].F, o, t);
    Q[k].F.add('ashlar', boxB(A - 0.3, 0.14, 0.22, 0, yBell + 0.76, 0.06));
  }
  acc.add('ashlar', boxB(A - 0.2, 0.3, A - 0.2, 0, yBell + 0.6, 0));
  const yb = yBell + 3.2; acc.add('gold', lathe([[0.001, 0], [0.78, 0], [0.8, 0.12], [0.6, 0.55], [0.52, 1.25], [0.32, 1.5], [0.001, 1.55]], 0, yb - 0.6, 0, 18));
  acc.add('wood', boxB(A - 2 * t + 0.2, 0.3, 0.3, 0, yb + 0.95, 0));
  archetti(acc, A, yBell + hBell - 0.75);
  const yc = cornice(acc, 'trim', A, A, yBell + hBell - 0.2, [[0.18, 0.08], [0.16, 0.2]]);
  const r = hipRoof(acc, { W: A, D: A, yw: yc, over: 0.85, slope: 0.42, keys: { rafter: 'wood' }, rafter: 0.55 });
  acc.add('iron', boxB(0.1, 2.0, 0.1, 0, r.top - 0.2, 0)); acc.add('iron', box(0.9, 0.09, 0.09, 0, r.top + 1.25, 0));
  acc.add('gold', lathe([[0.001, 0], [0.18, 0.05], [0.2, 0.2], [0.001, 0.35]], 0, r.top - 0.2, 0, 8));
  return { acc, mats: westMats('tuscan'), post: finishWest(), info: { kind: 'campanile', top: +(r.top + 1.8).toFixed(1) } };
}
/** diềm vòm treo (archetti pensili Romanesque) quanh thân vuông A tại y: dải vòm nhỏ nổi + gờ trên */
function archetti(acc, A, y, n = 0) {
  const Q = sides(acc, A, A), w = 0.55;
  for (const k of ['f', 'b', 'r', 'l']) {
    const m = Math.max(3, Math.round(A / w)), ww = A / m, holes = [];
    for (let i = 0; i < m; i++) holes.push(archPoly('round', -A / 2 + ww * (i + 0.5), y, ww - 0.12, 0.08, { seg: 6 }));
    const outer = [[-A / 2, y], ...holes.flatMap((p) => [p[0], ...p.slice(2).reverse(), p[1]]), [A / 2, y], [A / 2, y + ww / 2 + 0.28], [-A / 2, y + ww / 2 + 0.28]];
    Q[k].F.add('trim', extXY(outer, [], 0.1, 0.1));
  }
}

// ================================================================= ĐÌNH (pav)
function pav(styleId, S, pv) {
  const st = SID(styleId), acc = new Acc(), a = Math.min(pv.w, pv.d), P = 0.5, half = a / 2 - 0.35;
  plinthBase(acc, a, a, P, ['f', 'b', 'l', 'r'].map((side) => ({ side, w: 2.2 })), 0, 0, { cheeks: false });
  const Q = sides(acc, 2 * half, 2 * half), tA = 0.34;
  let yTop;
  if (st === 'moorish') { // đình sân Sư Tử (Alhambra): cột Nasrid chùm ở góc, 3 vòm nhiều múi mỗi mặt (giữa rộng), sebka, mái ngói chóp
    const ys = P + 2.55, yT = P + 4.15, wc = 2.0, wsd = (2 * half - wc - 2 * 0.62 - 2 * 0.3) / 2;
    for (const k of ['f', 'b', 'r', 'l']) {
      const arches = [{ cx: 0, w: wc, kind: 'lobed', lobes: 4 }, { cx: -(wc / 2 + 0.31 + wsd / 2), w: wsd, kind: 'lobed', lobes: 3 }, { cx: wc / 2 + 0.31 + wsd / 2, w: wsd, kind: 'lobed', lobes: 3 }];
      const x0 = -half, x1 = half;
      arcade(Q[k].F, { arches, y0: P, ys, yTop: yT, t: tA, x0, x1, colMax: 0.7, col: (x, z) => nasridCol(acc, 'marble', ...worldOf(Q[k].F, x, z), ys - P, 0.11), archKey: 'trim' });
      sebka(Q[k].F, -wc / 2 - 0.1, wc / 2 + 0.1, ys + 1.12, yT - 0.18, 0.03, 0.42);
      for (const sx of [-1, 1]) { const ca = worldOf(Q[k].F, sx * (half - 0.14), -tA / 2); nasridCol(acc, 'marble', ca[0], P, ca[2], ys - P, 0.11); }
    }
    ring(acc, 'azul', 2 * half, 2 * half, yT - 0.35, 0.22, 0.03);
    const yc = cornice(acc, 'wood', 2 * half, 2 * half, yT, [[0.14, 0.05], [0.12, 0.22], [0.1, 0.4]]);
    acc.add('wood', boxB(2 * half - 0.4, 0.12, 2 * half - 0.4, 0, yT - 0.12, 0));
    const r = hipRoof(acc, { W: 2 * half, D: 2 * half, yw: yc, over: 0.75, slope: 0.55, keys: { soffit: 'wood' } });
    yamur(acc, 0, r.top - 0.15, 0, 0.6); yTop = r.top + 1;
    // fuente: chậu đá 12 cạnh
    acc.add('marble', lathe([[0.001, 0], [0.75, 0], [0.75, 0.42], [0.62, 0.45], [0.6, 0.12], [0.001, 0.12]], 0, P, 0, 12));
    acc.add('marble', lathe([[0.001, 0], [0.12, 0], [0.1, 0.55], [0.3, 0.7], [0.32, 0.78], [0.001, 0.82]], 0, P, 0, 10));
  } else { // lô gia Tuscan / Địa Trung Hải: 2 vòm tròn mỗi mặt trên cột thức Tuscan, gờ, mái ngói chóp vươn trên xà
    const w = (2 * half - 3 * 0.5) / 2, rr = w / 2, ys = P + 2.55, yT = ys + rr + 0.55;
    for (const k of ['f', 'b', 'r', 'l']) {
      const arches = [-1, 1].map((s) => ({ cx: s * (w / 2 + 0.25), w, kind: 'round' }));
      arcade(Q[k].F, { arches, y0: P, ys, yTop: yT, t: tA, x0: -half, x1: half, colMax: 0.6, col: (x, z) => { const c = worldOf(Q[k].F, x, z); tuscanCol(acc, st === 'tuscan' ? 'pietra' : 'trim', c[0], P, c[2], ys - P, 0.36); }, pierKey: st === 'tuscan' ? 'ashlar' : 'wall', endPier: true, archKey: st === 'tuscan' ? 'ashlar' : 'trim', archBw: 0.18 });
    }
    const yc = cornice(acc, st === 'tuscan' ? 'ashlar' : 'trim', 2 * half, 2 * half, yT - 0.05, [[0.16, 0.05], [0.14, 0.16]]);
    acc.add('wood', boxB(2 * half - 0.4, 0.12, 2 * half - 0.4, 0, yT - 0.4, 0));
    const r = hipRoof(acc, { W: 2 * half, D: 2 * half, yw: yc, over: 0.9, slope: 0.42, keys: { rafter: 'wood' }, rafter: 0.5 }); yTop = r.top;
    acc.add('ashlar', lathe([[0.001, 0], [0.2, 0], [0.24, 0.2], [0.12, 0.35], [0.16, 0.5], [0.001, 0.62]], 0, r.top - 0.2, 0, 8));
  }
  return { acc, mats: westMats(st), post: finishWest(), info: { kind: 'pav', top: +yTop.toFixed(1) } };
}
/** toạ độ thế giới (x, z) của điểm (x, ·, z) cục bộ trên mặt F */
function worldOf(F, x, z) { const p = F.pt(x, 0, z); return [p.x, 0, p.z]; }

// ================================================================= CỔNG (gate)
function gate(styleId, S, g, opt = {}) {
  const st = SID(styleId), acc = new Acc(), villa = !!g.villa, vv = villa ? (opt.variant | 0) % 3 : 0;
  const F = new Fc(acc, 0, 0, 0);
  if (villa) return villaGate(acc, F, st, g, vv);
  const w = g.w + 0.4, Wg = w + 7.2, Dg = 6.0, t = 1.0;
  if (st === 'moorish') { // Puerta de la Justicia (Alhambra 1348): tháp cổng vòm móng ngựa lớn trong alfiz, vòm trong thấp hơn, răng cưa
    const kind = 'horse', rise = archRise(kind, w), hs = 2.4, H = hs + rise + 2.6;
    const Fb = new Fc(acc, PI, 0, -Dg);
    wallPanel(F, 'wall', -Wg / 2, Wg / 2, 0, H, t, [{ cx: 0, y: 0, w, hs, kind }]);
    dressOp(F, { cx: 0, y: 0, w, hs, kind, dress: { open: true, alfiz: 'azul' } }, t);
    // vòng vòm thứ hai (dải đá nhạt) + ô sebka hai bên alfiz + diềm 5 vòm mù nhiều múi trên đỉnh (Bab Agnaou / Puerta de la Justicia)
    F.add('trim', sweepXY(archCurve('horse', 0, hs, w + 0.9), 0.32, 0.12, 0.06));
    const xa = w / 2 + 0.75; for (const sx of [-1, 1]) sebka(F, Math.min(sx * xa, sx * (Wg / 2 - 0.7)), Math.max(sx * xa, sx * (Wg / 2 - 0.7)), 1.2, hs + rise - 0.4, 0.03, 0.6);
    for (let i = -2; i <= 2; i++) { const o = { cx: i * 1.45, y: hs + rise + 0.75, w: 0.9, hs: 0.35, kind: 'lobed', lobes: 3 }; F.add('shade', extXY(archPoly(o.kind, o.cx, o.y, o.w, o.hs, o), [], 0.05, 0.02)); F.add('trim', sweepXY(archCurve('lobed', o.cx, o.y + o.hs, o.w + 0.12, o), 0.1, 0.08, 0.05)); }
    const rb = archRise('round', w); wallPanel(Fb, 'wall', -Wg / 2, Wg / 2, 0, H, t, [{ cx: 0, y: 0, w, hs: hs + 0.3, kind: 'round' }]);
    for (const sx of [-1, 1]) acc.add('wall', boxB((Wg - w) / 2 - 0.1, H, Dg - 2 * t, sx * (Wg / 4 + w / 4 + 0.05), 0, -Dg / 2));
    // vòm trần lối đi (thùng) + dải men chân tường lối đi
    const vault = []; for (let i = 0; i <= 10; i++) { const f = (PI * i) / 10; vault.push([w / 2 * Math.cos(f), hs + 0.3 + (w / 2) * Math.sin(f)]); }
    { const gv = extXY([[w / 2 + 0.3, hs + 0.3], [w / 2 + 0.3, H - 0.6], [-w / 2 - 0.3, H - 0.6], [-w / 2 - 0.3, hs + 0.3], ...vault.slice().reverse()], [], Dg - 2 * t + 0.1, 0); gv.translate(0, 0, -t + 0.05); acc.add('wall', gv); }
    for (const sx of [-1, 1]) acc.add('azul', boxB(0.05, 1.2, Dg - 2 * t, sx * (w / 2 + 0.03), 0, -Dg / 2));
    ironGate(acc, w, hs + 0.2, -t - 0.15, 'in');
    // mặt trên: tay khắc «bàn tay» bỏ qua; dải men + răng cưa
    ring(acc, 'azul', Wg, Dg, H - 0.75, 0.35, 0.04, 0, -Dg / 2); ring(acc, 'trim', Wg, Dg, H - 0.4, 0.4, 0.1, 0, -Dg / 2);
    acc.add('trim', boxB(Wg - 0.2, 0.3, Dg - 0.2, 0, H - 0.3, -Dg / 2));
    merlonParapet(acc, 'wall', [[-Wg / 2 + 0.2, 0.2 - Dg], [Wg / 2 - 0.2, 0.2 - Dg], [Wg / 2 - 0.2, -0.2], [-Wg / 2 + 0.2, -0.2]], H, { h: 0.8, t: 0.38 });
    // tường cánh hai bên, mũ ngói
    for (const sx of [-1, 1]) { const x0 = sx * (Wg / 2), L = 3.2, h = 4.2; acc.add('wall', boxB(L, h, 0.6, x0 + (sx * L) / 2, 0, -0.3)); hipRoof(acc, { W: L + 0.1, D: 0.7, yw: h + 0.05, over: 0.15, slope: 0.55, cx: x0 + (sx * L) / 2, cz: -0.3, keys: { rib: null, soffit: null } }); }
    return { acc, mats: westMats(st), post: finishWest(), info: { kind: 'gate', h: +H.toFixed(1) } };
  }
  // Tuscan / Địa Trung Hải: cổng vòm tròn đá (porta), viền đá vòm (bugnato), gờ + mái ngói chóp cụt, cánh sắt
  const kind = 'round', rise = archRise(kind, w), hs = 2.8, H = hs + rise + 1.4, Dt = 3.4, key = st === 'tuscan' ? 'ashlar' : 'wall';
  const Fb = new Fc(acc, PI, 0, -Dt);
  for (const FF of [F, Fb]) { wallPanel(FF, key, -Wg / 2, Wg / 2, 0, H, 0.8, [{ cx: 0, y: 0, w, hs, kind }]); dressOp(FF, { cx: 0, y: 0, w, hs, kind, dress: { open: true, surround: st === 'tuscan' ? 'ashlar' : 'trim', bw: 0.5 } }, 0.8); }
  for (const sx of [-1, 1]) acc.add(key, boxB((Wg - w) / 2 - 0.1, H, Dt - 1.6, sx * (Wg / 4 + w / 4 + 0.05), 0, -Dt / 2));
  { const vault = []; for (let i = 0; i <= 12; i++) { const f = (PI * i) / 12; vault.push([(w / 2) * Math.cos(f), hs + (w / 2) * Math.sin(f)]); } const gv = extXY([[w / 2 + 0.3, hs], [w / 2 + 0.3, H - 0.3], [-w / 2 - 0.3, H - 0.3], [-w / 2 - 0.3, hs], ...vault.reverse()], [], Dt - 1.5, 0); gv.translate(0, 0, -0.75); acc.add(key, gv); }
  if (st === 'tuscan') { for (let y = 0.5; y < hs; y += 0.55) for (const sx of [-1, 1]) for (const FF of [F]) FF.add('ashlar', boxB((Wg - w) / 2 - 0.6, 0.06, 0.06, sx * (w / 2 + 0.3 + ((Wg - w) / 2 - 0.6) / 2), y, 0.03)); }
  ring(acc, st === 'tuscan' ? 'ashlar' : 'trim', Wg, Dt, H - 0.6, 0.2, 0.12, 0, -Dt / 2);
  const yc = cornice(acc, 'trim', Wg, Dt, H - 0.3, [[0.16, 0.06], [0.16, 0.2]], 0, -Dt / 2);
  hipRoof(acc, { W: Wg, D: Dt, yw: yc, over: 0.8, slope: 0.42, cz: -Dt / 2, keys: { rafter: st === 'tuscan' ? 'wood' : null, soffit: st === 'tuscan' ? 'soffit' : 'trim' }, rafter: 0.6 });
  if (st === 'tuscan') { // vòm đá múi (conci bugnati) xen dài ngắn + đá khoá + huy hiệu (stemma) Medici
    const R0 = w / 2 + 0.05, n = 17;
    for (let i = 0; i < n; i++) { if (i === (n - 1) / 2) continue; const f = (PI * (i + 0.5)) / n, L = i % 2 ? 0.7 : 1.0, r = R0 + L / 2, g = box((PI * R0) / n - 0.04, L, 0.16, 0, 0, 0); g.rotateZ(f - PI / 2); g.translate(r * Math.cos(f), hs + r * Math.sin(f), 0.08); F.add('pietra', g); }
    F.add('pietra', boxB(0.85, 1.0, 0.26, 0, hs + R0 - 0.2, 0.13));
    const sh = lathe([[0.001, 0], [0.34, 0], [0.38, 0.25], [0.34, 0.55], [0.18, 0.75], [0.001, 0.8]], 0, 0, 0, 4); sh.scale(1, 1, 0.2); sh.translate(0, hs + R0 - 0.1, 0.3); F.add('marble', sh);
  }
  ironGate(acc, w, hs + 0.4, -0.85, 'in');
  for (const sx of [-1, 1]) { const x0 = sx * (Wg / 2), L = 3.0, h = 3.4; acc.add(key, boxB(L, h, 0.6, x0 + (sx * L) / 2, 0, -0.3)); hipRoof(acc, { W: L + 0.1, D: 0.7, yw: h + 0.05, over: 0.15, slope: 0.5, cx: x0 + (sx * L) / 2, cz: -0.3, keys: { rib: null, soffit: null } }); acc.add('ashlar', lathe([[0.001, 0], [0.32, 0], [0.32, 0.15], [0.18, 0.3], [0.32, 0.65], [0.1, 0.95], [0.001, 1.0]], x0 + sx * 0.4, h + 0.1, -0.3, 10)); }
  return { acc, mats: westMats(st), post: finishWest(), info: { kind: 'gate' } };
}
/** cổng biệt thự (3 biến thể): 0 vòm tròn trong tường vữa, mũ ngói chóp cụt · 1 hai trụ vữa có mũ ngói chóp + quả cầu gốm, vòm sắt
 *  trên cánh (cancela Andalucía) · 2 vòm + tháp chuông nhỏ (espadaña) giữa đỉnh, mái ngói hai bên. Lối qua |x| < w/2 − 0,4 thông. */
function villaGate(acc, F, st, g, vv) {
  const w = g.w + 0.2, pw = 0.75, hs = 2.35, kind = st === 'moorish' ? 'horse' : 'round', rise = archRise(kind, w), d = 0.6, W = w + 2 * pw;
  const wing = (L, h) => { for (const sx of [-1, 1]) { const x0 = sx * (W / 2), cx = x0 + (sx * L) / 2; acc.add('wall', boxB(L, h, 0.4, cx, 0, -0.2)); acc.add('ashlar', boxB(L, 0.3, 0.46, cx, 0, -0.2)); hipRoof(acc, { W: L, D: 0.45, yw: h + 0.06, over: 0.12, slope: 0.5, cx, cz: -0.2, keys: { rib: null, soffit: null } }); } };
  const dress = st === 'tuscan' ? { open: true, surround: 'ashlar', bw: 0.22 } : st === 'moorish' ? { open: true, alfiz: 'azul' } : { open: true, surround: 'trim', bw: 0.14 };
  if (vv === 1) { // hai trụ + vòm sắt
    const H = 2.9, ph = 0.84;
    for (const sx of [-1, 1]) {
      const x = sx * (w / 2 + ph / 2);
      acc.add('ashlar', boxB(ph + 0.14, 0.45, ph + 0.14, x, 0, -d / 2)); acc.add('wall', boxB(ph, H, ph, x, 0, -d / 2));
      acc.add('trim', boxB(ph + 0.16, 0.12, ph + 0.16, x, H, -d / 2)); acc.add('trim', boxB(ph + 0.06, 0.1, ph + 0.06, x, H - 0.12, -d / 2));
      const r = hipRoof(acc, { W: ph + 0.1, D: ph + 0.1, yw: H + 0.3, over: 0.12, slope: 0.7, cx: x, cz: -d / 2, keys: { soffit: null }, rib: 0.3 });
      acc.add('tileR', lathe([[0.001, 0], [0.14, 0.02], [0.2, 0.18], [0.12, 0.36], [0.04, 0.42], [0.06, 0.5], [0.001, 0.55]], x, r.top - 0.3, -d / 2, 10));
    }
    const arc = []; for (let i = 0; i <= 12; i++) { const f = (PI * i) / 12; arc.push(V((w / 2) * Math.cos(f), H - 0.1 + 0.7 * Math.sin(f), -d / 2)); }
    for (let i = 0; i < 12; i++) acc.add('iron', beam(arc[i], arc[i + 1], 0.06, 0.06));
    for (let i = 1; i < 12; i++) if (i % 2) acc.add('railBar', beam(V(arc[i].x, H - 0.1, -d / 2), arc[i], 0.03, 0.03));
    acc.add('iron', box(w, 0.06, 0.06, 0, H - 0.1, -d / 2));
    ironGate(acc, w, H - 0.25, -d / 2 + 0.05, 'in');
    wing(1.8, 1.9);
    return { acc, mats: westMats(st, vv), post: finishWest(), info: { kind: 'gate-v', variant: vv } };
  }
  const H = hs + rise + 0.55;
  wallPanel(F, 'wall', -W / 2, W / 2, 0, H, d, [{ cx: 0, y: 0, w, hs, kind }]);
  for (const sx of [-1, 1]) F.add('ashlar', boxB(pw + 0.12, 0.35, d + 0.12, sx * (w / 2 + pw / 2), 0, -d / 2));
  dressOp(F, { cx: 0, y: 0, w, hs, kind, dress }, d);
  ironGate(acc, w, hs + rise * 0.5, -d, 'in');
  if (vv === 2) { // espadaña: đầu tường cong bậc giữa đỉnh, lỗ vòm treo chuông
    F.add('trim', boxB(W + 0.16, 0.1, d + 0.16, 0, H, -d / 2));
    for (const sx of [-1, 1]) hipRoof(acc, { W: W / 2 - 0.7, D: d + 0.1, yw: H + 0.12, over: 0.12, slope: 0.5, cx: sx * (W / 4 + 0.35), cz: -d / 2, keys: { soffit: null } });
    const eW = 1.5, eH = 1.75, y0 = H, prof = [[-eW / 2, y0], [eW / 2, y0], [eW / 2, y0 + eH * 0.55]];
    for (let i = 0; i <= 8; i++) { const f = (PI * i) / 8; prof.push([(eW / 2) * Math.cos(f), y0 + eH * 0.55 + (eH * 0.45) * Math.sin(f)]); }
    prof.push([-eW / 2, y0 + eH * 0.55]);
    F.add('wall', extXY(prof, [archPoly('round', 0, y0 + 0.35, 0.62, 0.45, { seg: 8 })], 0.4, -d / 2 + 0.2));
    acc.add('trim', lathe([[0.001, 0], [0.09, 0], [0.12, 0.2], [0.04, 0.32], [0.001, 0.36]], 0, y0 + eH, -d / 2, 8));
    acc.add('gold', lathe([[0.001, 0], [0.24, 0], [0.24, 0.05], [0.17, 0.25], [0.14, 0.4], [0.001, 0.44]], 0, y0 + 0.47, -d / 2, 10));
    acc.add('iron', boxB(0.04, 1.0, 0.04, 0, y0 + eH, -d / 2));
    wing(1.6, 2.1);
    return { acc, mats: westMats(st, vv), post: finishWest(), info: { kind: 'gate-v', variant: vv } };
  }
  F.add('trim', boxB(W + 0.2, 0.12, d + 0.2, 0, H, -d / 2));
  hipRoof(acc, { W: W + 0.1, D: d + 0.1, yw: H + 0.12, over: 0.3, slope: 0.55, cx: 0, cz: -d / 2, keys: { soffit: null } });
  wing(1.6, 2.1);
  return { acc, mats: westMats(st, vv), post: finishWest(), info: { kind: 'gate-v', variant: vv } };
}

/** hai cánh cổng sắt mở vào trong (áp hai má lối đi, vuông góc mặt cổng tại z0) — rộng w, cao h */
function ironGate(acc, w, h, z0, dir = 'in') {
  const lw = w / 2 - 0.05;
  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 - 0.08), zc = z0 - lw / 2;
    for (const y of [0.12, h * 0.45, h - 0.08]) acc.add('iron', box(0.06, 0.07, lw, x, y, zc));
    acc.add('iron', boxB(0.07, h, 0.07, x, 0, z0 - 0.04)); acc.add('iron', boxB(0.07, h, 0.07, x, 0, z0 - lw));
    const n = Math.round(lw / 0.14); for (let i = 1; i < n; i++) acc.add('railBar', boxB(0.03, h - 0.1 + 0.25 * Math.sin((PI * i) / n), 0.03, x, 0.05, z0 - (lw * i) / n));
  }
}

export const FAMILY = { hall, tower, pav, gate };
