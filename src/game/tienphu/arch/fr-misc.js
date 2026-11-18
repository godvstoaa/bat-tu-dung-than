// ============================================================================
//  ORANGERIE · GRAND TRIANON · PETIT TRIANON — 06 › orangerie / grandtrianon / petittrianon.
// ============================================================================
import * as THREE from 'three';
import { Acc, recenter, boxB, box, lathe, slabXY, V, put, slabHoles, rectPts, archPts, opening, refends, pilaster, column, entab, band, balus, balusPath, potAFeu, statue, cartouche, keystone, orangeTree, ordFace, finishUV, terrace, insetRoof } from './fr-kit.js';

// ============================================================================ ORANGERIE (Hardouin-Mansart 1684–86)
/**
 * Hành lang giữa 60 × 14 cao ≈ 13,5 m: tường đá khối nhô (bossage) suốt mặt, dãy vòm lớn lặp đều kính đặt sâu trong lòng vòm
 * (tường dày 3 m), avant-corps giữa có 2 cặp cột TOSCAN (Ø 1,46, cao 7 D = 10,2) đỡ entablature; đỉnh là lan can sân thượng
 * Parterre du Midi (đi được). Hai cánh ngắn vuông góc mang hai thang CENT-MARCHES ôm hai bên; hàng cam trong hộp gỗ phía trước.
 */
export function frOrangerie(spec) {
  const acc = new Acc(), W = spec.W || 60, D = spec.D || 14, y0 = 0.4, Dc = 1.46, colH = 7 * Dc, ent = 1.75 * Dc;
  const yE = y0 + 0.4 + colH, yT = yE + ent, t = 3.0, acW = 13.6, cwW = 12, sideP = (W / 2 - cwW - acW / 2) / 2;   // 2 vòm mỗi bên giữa avant-corps và cánh thang
  acc.add('stoneDk', boxB(W + 1, y0, D + 1, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: W + 1, d: D + 1, top: y0 });
  // mặt trước: 3 vòm mỗi bên + avant-corps giữa (vòm cửa vào)
  const f = new Acc(), holes = [];
  for (const sg of [-1, 1]) for (let i = 0; i < 2; i++) holes.push({ kind: 'arch', x: sg * (acW / 2 + sideP * (i + 0.5)), y0: y0 + 0.9, w: 3.9, h: 9.2, glass: 'tileGlassO', zf: 0 });
  const door = { kind: 'arch', x: 0, y0, w: 3.6, h: 8.4, door: true, zf: 1.5 }, acH = [{ kind: 'arch', x: 0, y0: y0 + 0.9, w: 3.0, h: 0 }];
  for (const sg of [-1, 1]) {
    const xa = sg > 0 ? acW / 2 : -W / 2, xb = sg > 0 ? W / 2 : -acW / 2, hs = holes.filter((h) => Math.sign(h.x) === sg);
    f.add('oranRef', slabHoles(rectPts(xa, y0, xb, yT), hs.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, t));
    refends(f, xa, xb, y0 + 0.6, yE, 0, hs, { course: 0.62, proj: 0.08, vous: 0.7, nv: 9, key: 'oran' });
    for (const h of hs) { opening(f, h, 0, { reveal: 1.1 }); f.add('oranSh', boxB(h.w, 0.3, 1.1, h.x, h.y0 - 0.3, -0.55)); }
    entab(f, 'tuscan', xa, xb, yE, 0.06, ent, { dep: t, key: 'oran', capKey: 'oran' });
  }
  // avant-corps giữa nhô 1,5 m: cửa vòm + 2 cặp cột Toscan tự do trên bệ
  f.add('oranRef', slabHoles(rectPts(-acW / 2, y0, acW / 2, yT), [archPts(0, y0, door.w, door.h)], 1.5, t + 1.5));
  refends(f, -acW / 2, acW / 2, y0 + 0.6, yE, 1.5, [door], { course: 0.62, proj: 0.08, vous: 0.8, nv: 9, key: 'oran', mask: true });
  const zc = 1.5 + 0.35 + Dc / 2;
  for (const sg of [-1, 1]) for (const xx of [3.2, 5.4]) { const x = sg * xx; f.add('oranSh', boxB(Dc * 1.45, 0.4, Dc * 1.5, x, y0, zc)); column(f, 'tuscan', x, y0 + 0.4, zc, colH, Dc, { key: 'oran', capKey: 'oran', seg: 14 }); }
  entab(f, 'tuscan', -acW / 2, acW / 2, yE, zc + Dc * 0.42, ent, { dep: zc + Dc * 0.42 + t, key: 'oran', capKey: 'oran', mutule: 0.9 });
  // lan can sân thượng (Parterre du Midi phía trên) + bình trên trụ
  const des = balus(f, -W / 2, W / 2, yT, -0.3, { h: 1.1, des: [-acW / 2, acW / 2, ...holes.map((h) => h.x + sideP / 2 * Math.sign(h.x))], key: 'oran', capKey: 'oran' });
  balus(f, -acW / 2, acW / 2, yT, zc - 0.4, { h: 1.1, des: [-5.4, -3.2, 3.2, 5.4], key: 'oran', capKey: 'oran' });
  for (const x of [-5.4, -3.2, 3.2, 5.4]) potAFeu(f, x, yT + 1.15, zc - 0.4, 1.3, 2, 'oran');
  put(acc, f, 0, 0, D / 2, 0);
  // mặt sau + hai hồi: tường đá khía, ít ô (nửa chìm vào sườn dốc)
  for (const [L, x, z, ry] of [[W, 0, -D / 2, Math.PI], [D, W / 2, 0, Math.PI / 2], [D, -W / 2, 0, -Math.PI / 2]]) { const s = new Acc(); s.add('oranRef', boxB(L, yT - y0, t, 0, y0, -t / 2)); entab(s, 'tuscan', -L / 2, L / 2, yE, 0.06, ent, { dep: t, key: 'oran', capKey: 'oran' }); put(acc, s, x, 0, z, ry); }
  acc.add('oranSh', boxB(W - 2 * t, 0.6, D - 2 * t, 0, yE - 0.8, 0));                               // vòm trần (nắp)
  acc.add('oran', boxB(W, 0.3, D, 0, yT - 0.3, 0)); acc.plat({ x: 0, z: 0, w: W, d: D, top: yT });   // sân thượng đi được
  balusPath(acc, [[-W / 2 + 0.3, -D / 2 + 0.3], [W / 2 - 0.3, -D / 2 + 0.3]], yT, { h: 1.1, key: 'oran', capKey: 'oran', desStep: 6 });
  // hai cánh vuông góc + thang Cent-Marches (đi được: mỗi bậc một mặt)
  const nst = Math.ceil(yT / 0.165), rise = yT / nst, run = 0.35, Ls = nst * run, cw = cwW, sw = 9;
  for (const sg of [-1, 1]) {
    const xc = sg * (W / 2 - cw / 2), z0 = D / 2;
    for (let i = 0; i < nst; i++) { const top = yT - rise * i, z = z0 + run * (i + 0.5); acc.add('oran', boxB(sw, top, run, xc, 0, z)); acc.plat({ x: xc, z, w: sw, d: run + 0.02, top }); }
    // má thang: tường dốc + gờ vát theo dốc; mặt trong có dãy vòm thấp dần
    for (const e of [-1, 1]) {
      const xw = xc + e * (sw / 2 + (cw - sw) / 4), wt = (cw - sw) / 2, inner = e === -sg;
      const s = new Acc(), poly = [[0, 0], [Ls, 0], [Ls, 1.0], [0, yT + 1.0]];
      const hs = []; if (inner) for (const u of [3.0, 7.6, 12.2, 16.8]) { const top = yT * (1 - u / Ls) + 1.0 - 1.2; if (top > 4.5) hs.push(archPts(u, 0.4, 3.2, Math.min(8.5, top - 0.4))); }
      s.add('oranRef', slabHoles(poly, hs, 0, wt)); for (const hp of hs) s.add('tileGlassO', (() => { const g = new THREE.ShapeGeometry(new THREE.Shape(hp.map(([a, b]) => new THREE.Vector2(a, b)))); g.translate(0, 0, -wt + 0.2); return g; })());
      const cap = new THREE.BoxGeometry(Math.hypot(Ls, yT), 0.3, wt + 0.2); cap.rotateZ(Math.atan2(-yT, Ls)); cap.translate(Ls / 2, yT / 2 + 1.15, -wt / 2); s.add('oranSh', cap);
      put(acc, s, xw - wt / 2, 0, z0, -Math.PI / 2);                                               // trục u của mặt → +z thế giới
    }
  }
  // bồn cam trong hộp Versailles xếp hai hàng (06 orangerie §5.5)
  let k = 0; for (const zz of [D / 2 + 5, D / 2 + 10]) for (let x = -15; x <= 15; x += 5) orangeTree(acc, x, zz, 1, k++);
  const PD = D + Ls + 0.6, cz = (D / 2 + Ls - D / 2) / 2;
  recenter(acc, 0, -cz); finishUV(acc);
  return { acc, info: { W, D, PW: W + 1, PD, ph: y0, colH, colD: Dc, eave: yT, top: yT + 1.1 + 1.6, kind: 'orangerie' } };
}

// ============================================================================ GRAND TRIANON (Hardouin-Mansart, de Cotte 1687–88)
/**
 * Một tầng, mái phẳng sau lan can. Péristyle mở 40 × 12 giữa hai khối đầu: phía sân (+z) dãy vòm trên trụ, trước mỗi trụ trong
 * một cặp cột Campan (8 cột); phía vườn (−z) 7 cặp cột Ionic đá hồng incarnat tự do (14 cột) đỡ entablature thẳng.
 * Khối đầu: cửa vòm cao xen CẶP PILASTER ĐÁ HỒNG trên tường đá vàng (06 grandtrianon §5.1, §5.4). Lát cờ đen trắng.
 */
export function frGTrianon(spec) {
  const acc = new Acc(), W = spec.W || 50, D = spec.D || 18, pw = 40, pd = 12, ph = 0.9, Dc = 0.72, colH = 6.5, ent = 1.6, yE = ph + 0.4 + colH, yT = yE + ent;
  terrace(acc, W + 3, D + 3, ph, 0, 0, [{ side: 'z+', c: 0, w: 16 }, { side: 'z-', c: 0, w: 16 }]);
  acc.add('floorChk', boxB(pw - 0.4, 0.02, pd - 0.4, 0, ph, 0));
  // --- péristyle: phía sân (+z) dãy 5 vòm
  const bw = pw / 5, f = new Acc(), arches = [];
  for (let i = 0; i < 5; i++) arches.push({ kind: 'arch', x: -pw / 2 + bw * (i + 0.5), y0: ph, w: bw - 2.6, h: colH + 0.1, door: true });
  f.add('stone', slabHoles(rectPts(-pw / 2, ph, pw / 2, yT), arches.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 0.9));
  for (const h of arches) { keystone(f, h.x, h.y0 + h.h + 0.03, 0, 0.45, 0.6, 0.14, true, 'carve'); f.add('incarnat', (() => { const r = h.w / 2, ys = h.y0 + h.h - r, pts = []; for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; pts.push([h.x + (r + 0.2) * Math.cos(a), ys + (r + 0.2) * Math.sin(a)]); } for (let i = 10; i >= 0; i--) { const a = (i / 10) * Math.PI; pts.push([h.x + r * Math.cos(a), ys + r * Math.sin(a)]); } return slabHoles(pts, [], 0.06, 0.06); })()); }
  for (let i = 1; i < 5; i++) { const x = -pw / 2 + bw * i; for (const sx of [-0.62, 0.62]) { f.add('stoneDk', boxB(Dc * 1.5, 0.4, Dc * 1.5, x + sx, ph, 0.75)); column(f, 'ionic', x + sx, ph + 0.4, 0.75, colH, Dc, { key: 'campan', capKey: 'carve', seg: 10 }); } }
  entab(f, 'ionic', -pw / 2, pw / 2, yE, 0.18, ent, { dent: true, dep: 1.0 });
  for (let i = 1; i < 5; i++) { const x = -pw / 2 + bw * i; const e = new Acc(); entab(e, 'ionic', -1.2, 1.2, yE, 0.75 + Dc * 0.42, ent, { dent: true, dep: 0.9 }); put(f, e, x, 0, 0, 0); }
  balus(f, -pw / 2, pw / 2, yT, -0.2, { h: 1.1, des: Array.from({ length: 6 }, (_, i) => -pw / 2 + bw * i) });
  put(acc, f, 0, 0, pd / 2, 0);
  // --- phía vườn (−z): 7 cặp cột incarnat tự do trên bệ, entablature thẳng
  const g = new Acc();
  for (let i = 0; i < 7; i++) { const x = -pw / 2 + 2.2 + (i * (pw - 4.4)) / 6; for (const sx of [-0.62, 0.62]) { g.add('stoneDk', boxB(Dc * 1.5, 0.4, Dc * 1.5, x + sx, ph, 0)); column(g, 'ionic', x + sx, ph + 0.4, 0, colH, Dc, { key: 'incarnat', capKey: 'carve', seg: 10 }); } }
  entab(g, 'ionic', -pw / 2, pw / 2, yE, Dc * 0.45, ent, { dent: true, dep: 1.2 });
  balus(g, -pw / 2, pw / 2, yT, -0.3, { h: 1.1, des: Array.from({ length: 7 }, (_, i) => -pw / 2 + 2.2 + (i * (pw - 4.4)) / 6) });
  put(acc, g, 0, 0, -pd / 2 + 0.6, Math.PI);
  acc.add('coffer', (() => { const c = new THREE.PlaneGeometry(pw, pd - 1.2); const uv = c.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * pw / 2.4, uv.getY(i) * (pd - 1.2) / 2.4); c.rotateX(Math.PI / 2); c.translate(0, yE - 0.02, 0); return c; })());
  acc.add('lead', boxB(pw, 0.5, pd - 1, 0, yE, 0));
  // --- hai khối đầu 5 × 18: cửa vòm cao xen cặp pilaster đá hồng
  for (const sg of [-1, 1]) {
    const bx = sg * (pw / 2 + (W - pw) / 4), bw2 = (W - pw) / 2, faces = [[bw2, 1, bx, D / 2, 0], [bw2, 1, bx, -D / 2, Math.PI], [D, 3, bx + sg * bw2 / 2, 0, sg * Math.PI / 2]];
    for (const [L, n, x, z, ry] of faces) { const s = new Acc(); ordFace(s, L, { y0: ph, ord: 'ionic', colH, colW: 0.58, ent, n, pairs: true, cornerPil: true, pilKey: 'incarnat', win: { kind: 'arch', w: 1.9, h: 5.3, dy: 0.4 }, balH: 1.1, vases: 2, dent: true, wallT: 0.8 }); put(acc, s, x, 0, z, ry); }
    // mặt trong về phía péristyle (phần nhô ra ngoài péristyle)
    for (const sz of [-1, 1]) { const s = new Acc(); ordFace(s, (D - pd) / 2, { y0: ph, ord: 'ionic', colH, colW: 0.58, ent, n: 1, cornerPil: false, pilKey: 'incarnat', noWin: true, balH: 1.1, wallT: 0.8 }); put(acc, s, sg * pw / 2, 0, sz * (pd / 2 + (D - pd) / 4), -sg * Math.PI / 2); }
    acc.add('inside', boxB(bw2 - 1.4, 0.4, D - 1.4, bx, yE - 0.4, 0)); acc.add('lead', boxB(bw2, 0.3, D, bx, yT - 0.3, 0));
  }
  finishUV(acc);
  return { acc, info: { W, D, PW: W + 3, PD: D + 3 + 2 * Math.ceil(ph / 0.165) * 0.36, ph, colH, colD: Dc, eave: yT, top: yT + 1.1 + 1.25, kind: 'trianon' } };
}

// ============================================================================ PETIT TRIANON (Gabriel 1762–68)
/**
 * Khối lập phương 23,4 m, 5 ô mỗi mặt; thức CORINTHIAN KHỔNG LỒ xuyên 2 tầng trên; bốn mặt khác nhau (06 petittrianon §3):
 * tây (−x) 4 cột tự do có rãnh trên sân thượng · nam (+z, sân vào) tầng trệt khía + 4 pilaster · bắc (−z) 4 pilaster, tầng trệt
 * chìm dưới sân thượng · đông (+x) không cột không pilaster. Lan can phẳng KHÔNG tượng / trophée; diềm «à la grecque».
 * Nền dốc: sân thượng cao 4,5 m ôm mặt tây và bắc, có thang đôi (ảnh Commons «West_facade_of_Petit_Trianon_002.JPG»).
 */
export function frPTrianon(spec) {
  const acc = new Acc(), S = spec.S || 23.4, n = 5, p = S / n, G = 4.5, Dc = 0.85, colH = 8.5, ent = 2.1, yN = G, yE = yN + 0.35 + colH, yT = yE + ent, t = 0.8;
  const tw = 6.5;                                                                                   // bề rộng sân thượng tây / bắc
  // sân thượng chữ L (tây + bắc) + thang đôi ở mặt tây + tường chắn có cửa sổ tròn (œil-de-bœuf)
  const L1 = S + tw, cx = -tw / 2;
  acc.add('ptRef', boxB(tw, G, S + tw, -S / 2 - tw / 2, 0, -tw / 2)); acc.add('ptRef', boxB(S, G, tw, 0, 0, -S / 2 - tw / 2));
  acc.plat({ x: -S / 2 - tw / 2, z: -tw / 2, w: tw, d: S + tw, top: G }); acc.plat({ x: 0, z: -S / 2 - tw / 2, w: S, d: tw, top: G });
  acc.add('stoneDk', boxB(tw + 0.3, 0.25, S + tw + 0.3, -S / 2 - tw / 2, G - 0.25, -tw / 2)); acc.add('stoneDk', boxB(S + 0.3, 0.25, tw + 0.3, 0, G - 0.25, -S / 2 - tw / 2));
  for (const z of [-S / 2 + 3, S / 2 - 3]) { const o = new THREE.TorusGeometry(0.55, 0.12, 4, 14); o.rotateY(Math.PI / 2); o.translate(-S / 2 - tw - 0.02, 1.8, z); acc.add('stoneDk', o); acc.add('tileGlassR', (() => { const c = new THREE.CircleGeometry(0.55, 12); c.rotateY(-Math.PI / 2); c.translate(-S / 2 - tw + 0.05, 1.8, z); return c; })()); }
  // thang đôi (hai nhánh dốc chạy dọc mặt tây, gặp nhau ở chiếu nghỉ giữa)
  const nst = Math.ceil(G / 0.165), rise = G / nst, run = 0.34, sw = 2.4, xs = -S / 2 - tw - sw / 2;
  for (const sg of [-1, 1]) for (let i = 0; i < nst; i++) { const top = rise * (i + 1), z = sg * (3.2 + nst * run - run * (i + 0.5)); acc.add('ptStone', boxB(sw, top, run, xs, 0, z)); acc.plat({ x: xs, z, w: sw, d: run + 0.02, top }); }
  acc.add('ptStone', boxB(sw, G, 6.4, xs, 0, 0)); acc.plat({ x: xs, z: 0, w: sw, d: 6.4, top: G });
  for (const sg of [-1, 1]) { const Lr = nst * run, g = new THREE.BoxGeometry(0.4, 1.0, Math.hypot(Lr, G)); g.rotateX(sg * Math.atan2(G, Lr)); g.translate(xs - sw / 2 - 0.2, G / 2 + 0.6, sg * (3.2 + Lr / 2)); acc.add('ptStone', g); } // má thang dốc (tay vịn đá)
  balusPath(acc, [[-S / 2 - tw + 0.25, S / 2], [-S / 2 - tw + 0.25, 3.2]], G, { h: 1.0, cut: 'tileBalusP', key: 'ptStone', desStep: 2.4 });
  balusPath(acc, [[-S / 2 - tw + 0.25, -3.2], [-S / 2 - tw + 0.25, -S / 2 - tw + 0.25], [S / 2, -S / 2 - tw + 0.25]], G, { h: 1.0, cut: 'tileBalusP', key: 'ptStone', desStep: 2.4 });
  // bốn mặt
  const face = (side) => {
    const f = new Acc(), holes = [], showGround = side === 'S' || side === 'E', order = side !== 'E';
    for (let i = 0; i < n; i++) {
      const xc = -S / 2 + p * (i + 0.5);
      holes.push({ kind: 'rect', x: xc, y0: yN + 0.45, w: 1.75, h: 3.9, glass: 'tileGlass' });           // tầng chính: cửa cao
      holes.push({ kind: 'rect', x: xc, y0: yN + 5.45, w: 1.5, h: 1.65, glass: 'tileGlass3' });          // attic: gần vuông
      if (showGround) holes.push({ kind: side === 'S' && i === 2 ? 'arch' : 'rect', x: xc, y0: side === 'S' && i === 2 ? 0.2 : 0.9, w: side === 'S' && i === 2 ? 2.6 : 1.4, h: side === 'S' && i === 2 ? 3.6 : 2.4, door: side === 'S' && i === 2, glass: 'tileGlass4' });
    }
    f.add('ptStone', slabHoles(rectPts(-S / 2, yN, S / 2, yT), holes.filter((h) => h.y0 >= yN).map((h) => rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h)), 0, t));
    const gh = holes.filter((h) => h.y0 < yN);
    if (showGround) { f.add('ptRef', slabHoles(rectPts(-S / 2, 0, S / 2, yN), gh.map((h) => (h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h))), 0, t)); band(f, -S / 2, S / 2, yN - 0.3, 0.3, 0, 0.12); }
    for (const h of holes) {
      opening(f, h, 0, { reveal: 0.28, frame: { w: 0.16, d: 0.06, sill: h.kind === 'rect' && !h.door, key: 'ptStone' } });
      if (h.y0 === yN + 0.45) { const i = Math.round((h.x + S / 2) / p - 0.5), outer = i === 0 || i === n - 1; // mũ cửa: ô ngoài có gờ trên công-xon, ô giữa gờ thẳng
        f.add('ptStone', boxB(h.w + 0.7, 0.16, 0.36, h.x, h.y0 + h.h + 0.2, 0.18)); f.add('ptStone', boxB(h.w + 0.9, 0.12, 0.46, h.x, h.y0 + h.h + 0.36, 0.23));
        if (outer || !order) for (const sx of [-1, 1]) f.add('ptStone', boxB(0.2, 0.55, 0.3, h.x + sx * (h.w / 2 + 0.25), h.y0 + h.h - 0.35, 0.15)); }
    }
    band(f, -S / 2, S / 2, yN + 4.75, 0.22, 0, 0.06, 'ptStone');                                      // gờ sàn attic (mảnh)
    let ac = 0;
    if (order) {
      const xs4 = [1, 2, 3, 4].map((i) => -S / 2 + p * i);
      if (side === 'W') { ac = 0; for (const x of xs4) { f.add('ptStone', boxB(Dc * 1.4, 0.35, Dc * 1.4 + 0.6, x, yN, 1.35)); column(f, 'corinthian', x, yN + 0.35, ac + 0.25 + Dc * 0.7, colH, Dc, { key: 'ptStone', capKey: 'ptStone', fluted: 20, seg: 12 }); } }
      else for (const x of xs4) pilaster(f, 'corinthian', x, yN + 0.35, 0, colH, Dc, 0.2, { key: 'ptStone', capKey: 'ptStone', fluted: 6 });
    }
    // entablature (gờ có công-xon giống nhau 4 mặt) + ressaut trên cột mặt tây
    entab(f, 'corinthian', -S / 2, S / 2, yE, 0.12, ent, { mod: true, dep: t, key: 'ptStone', capKey: 'ptStone' });
    if (side === 'W') entab(f, 'corinthian', -p * 1.5 - 0.6, p * 1.5 + 0.6, yE, ac + 0.25 + Dc * 1.1, ent, { mod: true, dep: 1.6, key: 'ptStone', capKey: 'ptStone' });
    // diềm «à la grecque» trên frieze (dải chữ Hy Lạp)
    for (let x = -S / 2 + 0.4; x < S / 2 - 0.4; x += 0.9) { f.add('ptStone', boxB(0.55, 0.08, 0.04, x + 0.27, yE + ent * 0.4, 0.14)); f.add('ptStone', boxB(0.08, 0.3, 0.04, x + 0.51, yE + ent * 0.4, 0.14)); f.add('ptStone', boxB(0.3, 0.08, 0.04, x + 0.4, yE + ent * 0.4 + 0.22, 0.14)); }
    // lan can: ô con tiện xen tấm đặc, trụ trên mỗi trục cột / pilaster (KHÔNG tượng)
    const desX = [-S / 2, ...[1, 2, 3, 4].map((i) => -S / 2 + p * i), S / 2].map((x, i, a) => (i === 0 ? x + 0.3 : i === a.length - 1 ? x - 0.3 : x));
    balus(f, -S / 2, S / 2, yT, -0.1, { h: 1.15, des: desX, cut: 'tileBalusP', key: 'ptStone', capKey: 'ptStone', deW: 0.9 });
    return f;
  };
  const F = { S: [0, S / 2, 0], N: [0, -S / 2, Math.PI], E: [S / 2, 0, Math.PI / 2], W: [-S / 2, 0, -Math.PI / 2] };
  for (const [k, [x, z, ry]] of Object.entries(F)) put(acc, face(k), x, 0, z, ry);
  acc.add('inside', boxB(S - 2 * t, 0.4, S - 2 * t, 0, yN - 0.4, 0)); acc.add('inside', boxB(S - 2 * t, 0.35, S - 2 * t, 0, yN + 4.75, 0)); acc.add('inside', boxB(S - 2 * t, 0.4, S - 2 * t, 0, yE, 0)); acc.add('lead', boxB(S - 0.2, 0.3, S - 0.2, 0, yT - 0.25, 0));
  acc.add('ptStone', boxB(3.6, 0.15, 1.5, 0, 0, S / 2 + 0.75)); acc.plat({ x: 0, z: S / 2 + 0.75, w: 3.6, d: 1.5, top: 0.15 });
  const PW = S + tw + sw + 0.4, PD = S + tw;
  recenter(acc, (tw + sw) / 2, tw / 2); finishUV(acc);
  return { acc, info: { W: S, D: S, PW, PD, ph: 0.15, colH, colD: Dc, eave: yT, top: yT + 1.2, n, bays: Array(n).fill(p), kind: 'petittrianon' } };
}
