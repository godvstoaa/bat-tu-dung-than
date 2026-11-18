// ============================================================================
//  ĐÌNH / TIỂU CÔNG TRÌNH VƯỜN VERSAILLES — 06 › summit, colonnade, amour, bosq1, bosq2, canalW, menag.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, box, cyl, lathe, slabXY, V, put, slabHoles, rectPts, archPts, opening, pilaster, column, entab, band, balus, potAFeu, statue, cartouche, keystone, mascaron, sphinx, ordFace, finishUV, roundSteps, ringFrame } from './fr-kit.js';

/** đặt mặt k của đa giác đều n cạnh apothem a (mặt k hướng góc t = 2πk/n + rot, ngoài +z cục bộ) */
const faceAt = (acc, sub, n, a, k, rot = 0) => { const t = (2 * Math.PI * k) / n + rot; put(acc, sub, Math.sin(t) * a, 0, Math.cos(t) * a, t); };
const side = (n, a) => 2 * a * Math.tan(Math.PI / n);
/** khối đa giác đều (đùn) đáy y, cao h */
function prism(n, a, y, h, rot = 0) { const R = a / Math.cos(Math.PI / n), pts = []; for (let k = 0; k < n; k++) { const t = (2 * Math.PI * k) / n + Math.PI / n + rot; pts.push(new THREE.Vector2(Math.sin(t) * R, Math.cos(t) * R)); } const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: h, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, y + h, 0); return g; }
/** đá tảng giả sơn (rocher): khối đa diện méo */
function rock(acc, x, y, z, s, k) { const g = new THREE.IcosahedronGeometry(s, 0), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const f = 0.75 + 0.5 * Math.abs(Math.sin(p.getX(i) * 3.1 + k) * Math.cos(p.getZ(i) * 2.3 + k)); p.setXYZ(i, p.getX(i) * f, p.getY(i) * f * 0.7, p.getZ(i) * f); } g.computeVertexNormals(); g.translate(x, y, z); acc.add('rock', g); }

// ============================================================================ summit — Belvédère (Mique 1778–81)
export function frBelvedere(spec) {
  const acc = new Acc(), n = 8, a = 4.2, ph = 1.5, colH = 4.6, pa = a + 0.9, L = side(n, a);
  acc.add('ptStone', prism(n, pa, 0, ph)); acc.add('stoneDk', prism(n, pa + 0.12, ph - 0.18, 0.18)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: pa, top: ph });
  for (let k = 0; k < 22; k++) { const t = (k / 22) * Math.PI * 2 + 0.13, r = pa + 0.6 + (k % 3) * 0.5; if (Math.abs(Math.sin(t * 2)) < 0.3 && r < pa + 1.5) continue; rock(acc, Math.sin(t) * r, 0.2, Math.cos(t) * r, 0.7 + (k % 4) * 0.25, k); } // gò đá giả
  // 4 thang theo 4 hướng chính, mỗi thang 2 nhân sư (Deschamps 1778)
  const nst = Math.ceil(ph / 0.165), rise = ph / nst, run = 0.36;
  for (let s = 0; s < 4; s++) {
    const t = (s * Math.PI) / 2, st = new Acc();
    for (let i = 0; i < nst; i++) { const top = rise * (i + 1), z = pa + run * (nst - i - 0.5); st.add('ptStone', boxB(2.0, top, run, 0, 0, z)); st.plat({ x: 0, z, w: 2.0, d: run + 0.02, top }); }
    for (const sx of [-1, 1]) { st.add('ptStone', boxB(0.8, 0.9, 2.0, sx * 1.5, 0, pa + nst * run - 0.9)); sphinx(st, sx * 1.5, 0.9, pa + nst * run - 0.9, 1.7, Math.PI / 2, 'ptStone'); }
    put(acc, st, 0, 0, 0, t);
  }
  // thân bát giác: 4 cửa đi vòm (hướng chính) xen 4 cửa sổ, phù điêu trên đầu cửa
  for (let k = 0; k < n; k++) {
    const f = new Acc(), door = k % 2 === 0;
    const r = ordFace(f, L, { y0: ph, ord: 'tuscan', colH, colW: 0.42, ent: 1.0, n: 1, cornerPil: true, wallKey: 'ptStone', entKey: 'ptStone', capKey: 'ptStone', win: door ? { kind: 'arch', w: 1.5, h: 3.5, dy: 0, ow: 1.5, oh: 3.5 } : { kind: 'rect', w: 1.1, h: 2.2, dy: 0.9, glass: 'tileGlass4' }, open: door ? [0] : [], balH: 1.0, cut: 'tileBalusP', balKey: 'ptStone', wallT: 0.5 });
    if (door) { f.add('tileGlass', archPtsPane(0, ph, 1.5, 3.5)); }
    cartouche(f, 0, ph + (door ? 4.15 : 3.75), 0, 1.3, 0.55, 'ptStone');
    faceAt(acc, f, n, a, k);
  }
  acc.add('inside', prism(n, a - 0.4, ph + colH, 0.4)); acc.add('lead', lathe([[0.001, 0], [a - 0.3, 0], [a * 0.75, 0.9], [a * 0.35, 1.5], [0.001, 1.6]], 0, ph + 0.4 + colH + 1.0, 0, 16));
  finishUV(acc);
  return { acc, info: { W: 2 * pa, D: 2 * pa, PW: 2 * (pa + nst * run), PD: 2 * (pa + nst * run), ph, colH, eave: ph + 0.4 + colH + 1.0, top: ph + 0.4 + colH + 2.0, n, kind: 'pavilion' } };
}
const archPtsPane = (x, y0, w, h) => { const g = new THREE.ShapeGeometry(new THREE.Shape(archPts(x, y0, w, h).map(([a, b]) => new THREE.Vector2(a, b)))); g.translate(0, 0, -0.35); return g; };

// ============================================================================ colonnade — Bosquet de la Colonnade (Hardouin-Mansart 1685)
/** vòng khép kín 32 vòm trên 32 cột Ionic (cột + pilaster sau), cột đá màu xen kẽ, vòm Carrara có đá khoá, pot à feu trên mỗi cột, bồn nước dưới vòm, nhóm tượng ở tâm */
export function frColonnade(spec) {
  const acc = new Acc(), N = spec.n || 32, rA = spec.r || 16, y0 = 0.45, D = 0.45, colH = 9 * D, imp = 0.35, ys = y0 + colH + imp;
  roundSteps(acc, [rA + 2.6, rA + 2.2], y0 / 2, 'carrara', 48);
  const step = (2 * Math.PI) / N, cols = ['languedoc', 'turquin', 'violette'];
  const w = 2 * rA * Math.sin(step / 2), sup = 0.62, r = (w - sup) / 2, ye = ys + r + 0.45;
  for (let k = 0; k < N; k++) {
    const t = k * step, key = cols[k % 3], sub = new Acc();
    sub.add('carrara', boxB(0.75, 0.3, 1.5, 0, y0, 0));
    column(sub, 'ionic', 0, y0 + 0.3, 0.4, colH - 0.3, D, { key, capKey: 'carrara', baseKey: 'carrara', seg: 7, ry: 0, noEye: true });
    pilaster(sub, 'ionic', 0, y0 + 0.3, -0.42, colH - 0.3, D, 0.12, { key, capKey: 'carrara' });
    sub.add('carrara', boxB(0.55, colH, 0.4, 0, y0, -0.62));                                          // trụ lưng pilaster
    sub.add('carrara', boxB(sup + 0.08, imp, 1.5, 0, y0 + colH, -0.05));                               // đệm chân vòm
    potAFeu(sub, 0, ye + 0.82, 0, 1.25, k, 'carrara');
    put(acc, sub, Math.sin(t) * rA, 0, Math.cos(t) * rA, t + Math.PI);                                // pilaster quay ra ngoài, cột quay vào tâm
    // tấm vòm giữa trụ k và k+1
    const tm = t + step / 2, a = new Acc(), pts = [[-w / 2, ys], [-r, ys]];
    for (let i = 0; i <= 8; i++) { const q = Math.PI - (i / 8) * Math.PI; pts.push([Math.cos(q) * r, ys + Math.sin(q) * r]); }
    pts.push([r, ys], [w / 2, ys], [w / 2, ye], [-w / 2, ye]);
    a.add('carrara', slabXY(pts, 1.3, 0, 0, 0.05)); a.add('carrara', slabXY([[-0.2, 0], [0.2, 0], [0.26, 0.5], [-0.26, 0.5]], 1.45, 0, ys + r - 0.15, 0.05));
    if (k % 8 === 0) for (const sx of [-1, 1]) cartouche(a, sx * (r + 0.05), ys + r * 0.55, 0.6, 0.38, 0.38, 'carrara', true); // phù điêu tam giác vòm (cách 4 vòm)
    if (k % 8 !== 7) { a.add('carrara', lathe([[0.001, 0], [0.22, 0], [0.13, 0.4], [0.58, 0.62], [0.55, 0.8], [0.001, 0.72]], 0, y0, 0, 6)); a.add('water', cyl(0.5, 0.5, 0.02, 0, y0 + 0.74, 0, 6)); } // bồn nước dưới vòm (4 lối vào không bồn)
    put(acc, a, Math.sin(tm) * rA * Math.cos(step / 2), 0, Math.cos(tm) * rA * Math.cos(step / 2), tm);
  }
  // entablature vòng (trắng Carrara) — biên dạng kín quay tròn
  const e = [[rA - 0.75, 0], [rA + 0.75, 0], [rA + 0.75, 0.42], [rA + 0.95, 0.52], [rA + 1.0, 0.82], [rA - 1.0, 0.82], [rA - 0.95, 0.52], [rA - 0.75, 0.42], [rA - 0.75, 0]];
  acc.add('carrara', new THREE.LatheGeometry(e.map(([x, y]) => new THREE.Vector2(x, y)), 64).translate(0, ye, 0));
  acc.plat({ poly: true, x: 0, z: 0, n: 16, a: rA + 2.0, top: y0 });
  // nhóm tượng ở tâm («Pluton bắt cóc Proserpine», Girardon) trên bệ tròn có phù điêu
  roundSteps(acc, [3.4, 2.8], 0.25, 'carrara', 32, y0);
  acc.add('carrara', lathe([[0.001, 0], [1.4, 0], [1.4, 0.3], [1.15, 0.45], [1.15, 1.9], [1.35, 2.05], [1.35, 2.3], [0.001, 2.3]], 0, y0 + 0.5, 0, 24));
  statue(acc, 0, y0 + 2.8, 0, 3.1, 3, 0.4, 'statue', 10); { const g = new Acc(); statue(g, 0, 0, 0, 2.2, 4, 0, 'statue', 10); for (const l of g.parts.values()) for (const q of l) { q.rotateZ(-1.15); q.translate(-0.55, y0 + 4.3, 0.25); acc.add('statue', q); } } sphinx(acc, 0.9, y0 + 2.8, -0.7, 1.1, 2.4, 'statue'); // Pluton nhấc Proserpine chéo người + Cerbère dưới chân
  finishUV(acc);
  return { acc, info: { W: 2 * (rA + 2.6), D: 2 * (rA + 2.6), PW: 2 * (rA + 2.6), PD: 2 * (rA + 2.6), ph: y0, colH, colD: D, eave: ye + 0.82, top: ye + 0.82 + 1.25 + 0.2, n: N, kind: 'colonnade' } };
}

// ============================================================================ amour — Temple de l'Amour (Mique 1778)
export function frAmour(spec) {
  const acc = new Acc(), rs = [7.75, 7.3, 6.9, 6.5, 6.15, 5.8, 5.4], rise = 0.2, ph = rs.length * rise, rc = 4.62, D = 0.7, colH = 7.0, ent = 1.75, yE = ph + colH, yT = yE + ent;
  roundSteps(acc, rs, rise, 'amour', 64);                                                              // 7 bậc tròn
  acc.add('amour', cyl(5.05, 5.05, 0.05, 0, ph, 0, 48));
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2; column(acc, 'corinthian', Math.sin(t) * rc, ph, Math.cos(t) * rc, colH, D, { key: 'amour', capKey: 'amour', baseKey: 'amour', fluted: 16, seg: 12, ry: t }); }
  // entablature tròn: architrave 3 dải · diềm chạm · gờ có răng
  const e = [[rc - 0.45, 0], [rc + 0.42, 0], [rc + 0.42, 0.18], [rc + 0.46, 0.2], [rc + 0.46, 0.5], [rc + 0.42, 0.52], [rc + 0.42, 1.05], [rc + 0.62, 1.15], [rc + 0.66, 1.25], [rc + 0.95, 1.45], [rc + 1.0, 1.75], [rc - 0.6, 1.75], [rc - 0.6, 1.2], [rc - 0.45, 1.1], [rc - 0.45, 0]];
  acc.add('amour', new THREE.LatheGeometry(e.map(([x, y]) => new THREE.Vector2(x, y)), 64).translate(0, yE, 0));
  for (let k = 0; k < 48; k++) { const t = (k / 48) * Math.PI * 2; const g = new THREE.BoxGeometry(0.35, 0.3, 0.06); g.rotateY(t); g.translate(Math.sin(t) * (rc + 0.47), yE + 0.78, Math.cos(t) * (rc + 0.47)); acc.add('amour', g); } // hoa chạm trên diềm
  // trần ô lõm (caissons) có hoa hồng
  const c = new THREE.CircleGeometry(rc - 0.45, 40), uv = c.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 5, uv.getY(i) * 5); c.rotateX(Math.PI / 2); c.translate(0, yE + 0.02, 0); acc.add('coffer', c);
  // vòm thấp có bậc chân + gân
  const dp = [[rc + 0.85, 0], [rc + 0.85, 0.25], [rc + 0.7, 0.3], [rc + 0.7, 0.5], [rc + 0.5, 0.55], [rc + 0.2, 1.1], [rc - 0.5, 1.7], [rc - 1.6, 2.2], [rc - 3.0, 2.5], [0.001, 2.6]];
  acc.add('amour', lathe([[0.001, 0], ...dp], 0, yT, 0, 48));
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2 + Math.PI / 12; const pts = dp.slice(4).map(([r, h]) => V(Math.sin(t) * (r + 0.04), yT + h + 0.04, Math.cos(t) * (r + 0.04))); for (let i = 0; i < pts.length - 1; i++) { const d = new THREE.Vector3().subVectors(pts[i + 1], pts[i]), g = new THREE.BoxGeometry(0.16, 0.1, d.length()); g.lookAt(d); g.translate((pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2, (pts[i].z + pts[i + 1].z) / 2); acc.add('amour', g); } }
  // tượng thần Ái tình ở tâm (L'Amour se taillant un arc…, theo Bouchardon) trên bệ
  acc.add('amour', lathe([[0.001, 0], [0.75, 0], [0.75, 0.15], [0.6, 0.25], [0.6, 1.2], [0.72, 1.32], [0.72, 1.45], [0.001, 1.45]], 0, ph, 0, 16));
  statue(acc, 0, ph + 1.45, 0, 1.9, 0, 0.3, 'statue');
  acc.plat({ poly: true, x: 0, z: 0, n: 16, a: 5.0, top: ph });
  finishUV(acc);
  return { acc, info: { W: 2 * rs[0], D: 2 * rs[0], PW: 2 * rs[0], PD: 2 * rs[0], ph, colH, colD: D, eave: yT, top: yT + 2.6, n: 12, kind: 'tholos' } };
}

// ============================================================================ bosq1 — Pavillon Français (Gabriel 1749–50)
/** chữ thập: phòng giữa bát giác (4 cửa vòm ở mặt chéo, 8 cột Corinthian áp hai bên cửa) + 4 phòng nhỏ chữ nhật (3 cửa sổ đầu thẳng mỗi phòng);
 *  lan can xen 8 nhóm tượng trẻ em và 8 bình; vòm thấp phòng giữa nhô lên; bậc tròn bao ngoài (06 bosq1 §2–§5) */
export function frPavFrancais(spec) {
  const acc = new Acc(), R = spec.R || 8.5, ph = 0.5, a = 4.3, aw = 5.6, ae = 7.0, H = 5.0, ent = 1.0, yE = ph + 0.3 + H, yT = yE + ent, wk = 'ptStone';
  roundSteps(acc, [R, R - 0.4], ph / 2, wk, 48);
  // phòng giữa bát giác: 4 mặt chéo có cửa vòm + 2 cột Corinthian áp
  const L = side(8, a);
  for (let k = 1; k < 8; k += 2) {
    const f = new Acc(); ordFace(f, L, { y0: ph, ord: 'corinthian', colH: H, colW: 0.4, ent, n: 1, cornerPil: false, wallKey: wk, entKey: wk, capKey: wk, win: { kind: 'arch', w: 1.7, h: 3.8, dy: 0, glass: 'tileGlass' }, wallT: 0.5, mod: true, balH: 1.0, cut: 'tileBalusP', balKey: wk });
    for (const sx of [-1, 1]) column(f, 'corinthian', sx * 1.25, ph + 0.4, 0.38, H - 0.1, 0.4, { key: wk, capKey: wk, seg: 10 });
    mascaron(f, 0, ph + 4.35, 0.1, 0.5, wk);
    faceAt(acc, f, 8, a, k);
  }
  // 4 phòng nhỏ: mặt đầu 1 cửa sổ + hai mặt bên mỗi mặt 1 cửa sổ (đầu thẳng, công-xon chạm)
  const win = { kind: 'rect', w: 1.3, h: 3.0, dy: 0.7, glass: 'tileGlass' };
  for (let s = 0; s < 4; s++) {
    const t = (s * Math.PI) / 2, arm = new Acc(), dep = ae - a * 0.92;
    const fe = new Acc(); ordFace(fe, aw, { y0: ph, ord: 'corinthian', colH: H, colW: 0.4, ent, n: 1, cornerPil: true, wallKey: wk, entKey: wk, capKey: wk, win, wallT: 0.5, balH: 1.0, cut: 'tileBalusP', balKey: wk }); put(arm, fe, 0, 0, ae, 0);
    for (const sx of [-1, 1]) { const fs = new Acc(); ordFace(fs, dep, { y0: ph, ord: 'corinthian', colH: H, colW: 0.4, ent, n: 1, cornerPil: false, wallKey: wk, entKey: wk, capKey: wk, win: { ...win, w: 1.0 }, wallT: 0.5, balH: 1.0, cut: 'tileBalusP', balKey: wk }); put(arm, fs, sx * aw / 2, 0, ae - dep / 2, sx * Math.PI / 2); }
    for (const sx of [-1, 1]) { statue(arm, sx * (aw / 2 - 0.3) - 0.2, yT + 1.05, ae - 0.25, 1.3, s * 2 + (sx > 0 ? 1 : 0), 0, wk); statue(arm, sx * (aw / 2 - 0.3) + 0.25, yT + 1.05, ae - 0.35, 1.05, s * 2 + 3, 0.6, wk); }   // nhóm trẻ em
    for (const sx of [-1, 1]) potAFeu(arm, sx * aw / 2, yT + 1.05, ae - dep / 2, 0.95, s + 1, wk);                                    // bình
    arm.add('inside', boxB(aw - 1, 0.4, dep, 0, yE - 0.4, ae - dep / 2 - 0.3)); arm.add('lead', boxB(aw - 0.3, 0.3, dep, 0, yT - 0.3, ae - dep / 2 - 0.2));
    put(acc, arm, 0, 0, 0, t);
  }
  acc.add('inside', prism(8, a - 0.3, yE - 0.4, 0.4));
  // trống + vòm thấp phòng giữa
  acc.add(wk, cyl(a * 0.92, a * 0.92, 1.2, 0, yT, 0, 24)); acc.add('stoneDk', cyl(a * 0.97, a * 0.97, 0.22, 0, yT + 1.2, 0, 24));
  acc.add('lead', lathe([[0.001, 0], [a * 0.95, 0], [a * 0.82, 0.9], [a * 0.5, 1.7], [0.001, 2.0]], 0, yT + 1.42, 0, 24)); potAFeu(acc, 0, yT + 3.35, 0, 0.9, 1, 'gilt');
  acc.plat({ poly: true, x: 0, z: 0, n: 16, a: R - 0.5, top: ph });
  finishUV(acc);
  return { acc, info: { W: 2 * R, D: 2 * R, PW: 2 * R, PD: 2 * R, ph, colH: H, eave: yT, top: yT + 4.3, kind: 'pavilion' } };
}

// ============================================================================ bosq2 — Pavillon Frais (Gabriel 1751–53)
/** một phòng chữ nhật tường đá ốp GIÀN MẮT CÁO XANH, gờ, lan can, mái chì phẳng; vườn trước bao bằng dãy VÒM GIÀN (cao 3,5, rộng 2,35)
 *  có 2 bồn bầu dục viền đá đỏ Languedoc; cổng vườn hai trụ đỡ giỏ hoa */
export function frPavFrais(spec) {
  const acc = new Acc(), W = spec.W || 10.9, D = spec.D || 9.1, ph = 0.4, H = 4.6, gw = spec.gw || 16, gd = spec.gd || 12;
  const zH = -gd / 2 - 0.2;                                                                   // nhà ở phía sau vườn
  const house = new Acc();
  house.add('satory', boxB(W + 0.6, ph, D + 0.6, 0, 0, 0)); house.plat({ x: 0, z: 0, w: W + 0.6, d: D + 0.6, top: ph });
  const faces = [[W, 3, 0, D / 2, 0, 1], [W, 3, 0, -D / 2, Math.PI, -1], [D, 2, W / 2, 0, Math.PI / 2, -1], [D, 2, -W / 2, 0, -Math.PI / 2, -1]];
  for (const [L, n, x, z, ry, door] of faces) {
    const f = new Acc(), p = L / n, holes = [];
    for (let i = 0; i < n; i++) holes.push({ kind: 'arch', x: -L / 2 + p * (i + 0.5), y0: door > 0 && i === 1 ? ph : ph + 0.6, w: door > 0 && i === 1 ? 2.4 : 1.4, h: door > 0 && i === 1 ? 3.5 : 2.9, door: door > 0 && i === 1, glass: 'tileGlass4' });
    f.add('satory', slabHoles(rectPts(-L / 2, ph, L / 2, ph + H), holes.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 0.5));
    for (const h of holes) opening(f, h, 0, { reveal: 0.25, frame: { w: 0.14, d: 0.12, key: 'trellisW' } });
    // giàn mắt cáo ốp tường giữa các ô + pilaster giàn
    for (let i = 0; i <= n; i++) { const x = -L / 2 + p * i; f.add('trellisW', boxB(0.42, H, 0.16, x + (i === 0 ? 0.21 : i === n ? -0.21 : 0), ph, 0.08)); }
    for (let i = 0; i < n; i++) { const xc = -L / 2 + p * (i + 0.5); for (const sx of [-1, 1]) { const wpan = (p - holes[i].w) / 2 - 0.45; if (wpan < 0.2) continue; const g = new THREE.PlaneGeometry(wpan, H - 0.4), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * wpan * 2.5, uv.getY(j) * (H - 0.4) * 2.5); g.translate(xc + sx * (holes[i].w / 2 + 0.2 + wpan / 2), ph + 0.2 + (H - 0.4) / 2, 0.05); f.add('tileTrellis', g); } }
    entab(f, 'tuscan', -L / 2, L / 2, ph + H, 0.08, 0.7, { dep: 0.55, key: 'satory', capKey: 'satory' });
    balus(f, -L / 2, L / 2, ph + H + 0.7, -0.15, { h: 0.9, des: [0], key: 'satory', capKey: 'satory' });
    put(house, f, x, 0, z, ry);
  }
  house.add('inside', boxB(W - 1, 0.4, D - 1, 0, ph + H - 0.4, 0)); house.add('lead', boxB(W - 0.2, 0.3, D - 0.2, 0, ph + H + 0.4, 0));
  put(acc, house, 0, 0, zH - D / 2 + 0.2, 0);
  // vườn trước: dãy vòm giàn (trụ + cung + ô giàn) quanh 3 cạnh
  const arc = (x0, z0, x1, z1) => {
    const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 2.35)), ry = Math.atan2(-(z1 - z0), x1 - x0), s = new Acc(), p = L / n;
    for (let i = 0; i <= n; i++) s.add('trellisW', boxB(0.16, 3.5, 0.16, -L / 2 + p * i, 0, 0));
    for (let i = 0; i < n; i++) { const xc = -L / 2 + p * (i + 0.5), t = new THREE.TorusGeometry(p / 2 - 0.08, 0.07, 4, 8, Math.PI); t.translate(xc, 3.5 - p / 2 + 0.1, 0); s.add('trellisW', t); const g = new THREE.PlaneGeometry(p, 0.9), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * p * 2.5, uv.getY(j) * 2.2); g.translate(xc, 3.95, 0); s.add('tileTrellis', g); }
    s.add('trellisW', boxB(L + 0.16, 0.14, 0.2, 0, 4.4, 0));
    put(acc, s, (x0 + x1) / 2, 0, (z0 + z1) / 2, ry);
  };
  arc(-gw / 2, -gd / 2, -gw / 2, gd / 2); arc(gw / 2, gd / 2, gw / 2, -gd / 2); arc(-gw / 2, gd / 2, -2.2, gd / 2); arc(2.2, gd / 2, gw / 2, gd / 2);
  // cổng vườn: hai trụ đá đỡ giỏ hoa
  for (const sx of [-1, 1]) { acc.add('satory', boxB(0.8, 3.2, 0.8, sx * 2.2, 0, gd / 2)); acc.add('stoneDk', boxB(1.0, 0.2, 1.0, sx * 2.2, 3.2, gd / 2)); acc.add('trellisW', lathe([[0.001, 0], [0.25, 0], [0.45, 0.35], [0.5, 0.5], [0.001, 0.5]], sx * 2.2, 3.4, gd / 2, 10)); for (let k = 0; k < 6; k++) acc.add(k % 2 ? 'fruit' : 'flower', new THREE.SphereGeometry(0.16, 6, 4).translate(sx * 2.2 + Math.cos(k) * 0.28, 3.95 + (k % 3) * 0.08, gd / 2 + Math.sin(k) * 0.28)); }
  // hai bồn bầu dục viền đá đỏ Languedoc
  for (const sx of [-1, 1]) { const b = lathe([[0.001, 0], [1.9, 0], [1.9, 0.45], [1.7, 0.45], [1.7, 0.2], [0.001, 0.2]], 0, 0, 0, 24); b.scale(1, 1, 0.62); b.translate(sx * 3.8, 0, 1.0); acc.add('languedoc', b); const wa = cyl(1.7, 1.7, 0.02, 0, 0.32, 0, 24); wa.scale(1, 1, 0.62); wa.translate(sx * 3.8, 0, 1.0); acc.add('water', wa); }
  acc.add('floor', boxB(gw, 0.02, gd, 0, 0, 0));
  finishUV(acc);
  return { acc, info: { W, D, PW: gw + 0.4, PD: gd + D + 0.8, ph, colH: H, eave: ph + H + 0.7, top: ph + H + 1.6, kind: 'pavilion' } };
}

// ============================================================================ canalW — đình cẩm thạch trắng có vòm (Bosquet des Dômes, H.-Mansart 1677)
export function frCanalPav(spec) {
  const acc = new Acc(), a = spec.a || 3.6, ph = 0.5, H = 4.2, D = 0.46, ent = 1.05, yE = ph + 0.3 + H, yT = yE + ent, pa = a + 0.9;
  acc.add('carrara', boxB(2 * pa, ph, 2 * pa, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: 2 * pa, d: 2 * pa, top: ph });
  for (const [sx, sz] of [[0, -1], [1, 0], [-1, 0]]) for (let i = 0; i < 3; i++) { const top = (ph / 3) * (i + 1), o = pa + 0.36 * (2 - i + 0.5); const g = sx ? boxB(0.36, top, 3.2, sx * o, 0, 0) : boxB(3.2, top, 0.36, 0, 0, sz * o); acc.add('carrara', g); acc.plat(sx ? { x: sx * o, z: 0, w: 0.38, d: 3.2, top } : { x: 0, z: sz * o, w: 3.2, d: 0.38, top }); }
  // bến về phía kênh (+z): thềm 3 m + bậc xuống mặt nước, hai cọc buộc thuyền
  acc.add('carrara', boxB(6.0, ph, 3.0, 0, 0, pa + 1.5)); acc.plat({ x: 0, z: pa + 1.5, w: 6.0, d: 3.0, top: ph });
  for (let i = 0; i < 3; i++) { const top = (ph / 3) * (i + 1); acc.add('carrara', boxB(6.0, top, 0.36, 0, 0, pa + 3 + 0.36 * (2 - i + 0.5))); acc.plat({ x: 0, z: pa + 3 + 0.36 * (2 - i + 0.5), w: 6.0, d: 0.38, top }); }
  for (const sx of [-1, 1]) { acc.add('carrara', cyl(0.18, 0.15, 1.0, sx * 2.6, ph, pa + 2.6, 8)); acc.add('gilt', new THREE.SphereGeometry(0.16, 8, 6).translate(sx * 2.6, ph + 1.1, pa + 2.6)); }
  for (let k = 0; k < 4; k++) { const f = new Acc(); ordFace(f, 2 * a, { y0: ph, ord: 'ionic', colH: H, colW: D, ent, n: 1, cornerPil: true, wallKey: 'carrara', pilKey: 'carrara', capKey: 'carrara', entKey: 'carrara', win: { kind: 'arch', w: 2.6, h: 4.0, dy: 0, ow: 2.6, oh: 4.0 }, open: [0], keyMask: true, dent: true, balH: 0.9, cut: 'tileBalusW', balKey: 'carrara', wallT: 0.6 }); cartouche(f, 0, ph + 4.55, 0, 1.0, 0.4, 'carrara'); faceAt(acc, f, 4, a, k); }
  for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) potAFeu(acc, x * (a - 0.3), yT + 0.95, z * (a - 0.3), 1.0, x + z + 2, 'carrara');
  acc.add('carrara', cyl(a - 0.6, a - 0.6, 0.9, 0, yT, 0, 24)); acc.add('carrara', cyl(a - 0.45, a - 0.45, 0.18, 0, yT + 0.9, 0, 24));
  acc.add('lead', lathe([[0.001, 0], [a - 0.5, 0], [a * 0.82, 0.9], [a * 0.55, 1.75], [0.25, 2.25], [0.001, 2.3]], 0, yT + 1.08, 0, 24));
  potAFeu(acc, 0, yT + 3.3, 0, 1.0, 0, 'gilt');
  acc.add('coffer', (() => { const c = new THREE.CircleGeometry(a - 0.5, 24); c.rotateX(Math.PI / 2); c.translate(0, yE - 0.05, 0); return c; })());
  finishUV(acc);
  return { acc, info: { W: 2 * a, D: 2 * a, PW: 2 * (pa + 1.1), PD: pa * 2 + 1.1 + 4.1, ph, colH: H, colD: D, eave: yT, top: yT + 4.3, kind: 'pavilion' } };
}

// ============================================================================ menag — Ménagerie royale (Le Vau 1662–68, đã mất)
/** nhà bát giác 2 tầng, BAN CÔNG SẮT VÒNG QUANH tầng 1, VÒM ARDOISE + đèn lồng nhỏ; sân bát giác có 7 chuồng xoè quạt (tường thấp + lưới sắt) */
export function frMenagerie(spec) {
  const acc = new Acc(), a = 4.3, ph = 0.4, G = 5.0, U = 4.5, Rc = spec.Rc || 10, L = side(8, a), y1 = ph + G, y2 = y1 + U, yC = y2 + 0.7;
  acc.add('stoneDk', prism(8, a + 0.6, 0, ph)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: a + 0.6, top: ph });
  for (let k = 0; k < 8; k++) {
    const f = new Acc(), door = k % 2 === 0, hs = [];
    hs.push({ kind: 'arch', x: 0, y0: door ? ph : ph + 0.8, w: door ? 2.4 : 1.4, h: door ? 3.6 : 2.8, door, glass: 'tileGlass4' });
    hs.push({ kind: 'rect', x: 0, y0: y1 + 0.15, w: 1.3, h: 2.9, glass: 'tileGlass' });
    f.add('stoneRef', slabHoles(rectPts(-L / 2, ph, L / 2, y1), [archPts(0, hs[0].y0, hs[0].w, hs[0].h)], 0, 0.6));
    f.add('stone', slabHoles(rectPts(-L / 2, y1, L / 2, y2), [rectPts(-0.65, y1 + 0.15, 0.65, y1 + 3.05)], 0, 0.6));
    for (const h of hs) opening(f, h, 0, { reveal: 0.28, frame: { w: 0.15, d: 0.06 }, key: h.kind === 'arch' ? { mask: true } : null });
    for (const sx of [-1, 1]) for (let q = 0, y = ph; y < y2 - 0.3; y += 0.55, q++) f.add('stoneDk', boxB(q % 2 ? 0.7 : 0.45, 0.5, 0.08, sx * (L / 2 - (q % 2 ? 0.35 : 0.22)), y, 0.04)); // chaînes góc
    band(f, -L / 2, L / 2, y1 - 0.3, 0.3, 0, 0.1);
    entab(f, 'tuscan', -L / 2, L / 2, y2, 0.06, 0.7, { mutule: 0.5, dep: 0.6 });
    // ban công: sàn trên công-xon + lan can sắt
    f.add('stoneDk', boxB(L + 0.85, 0.2, 1.1, 0, y1 - 0.05, 0.55)); for (const sx of [-0.8, 0.8]) { const c = slabXY([[0, 0], [1.0, 0], [0.08, -0.65]], 0.25, 0, 0, 0); c.rotateY(-Math.PI / 2); c.translate(sx, y1 - 0.05, 0); f.add('stoneDk', c); } // công-xon
    const gr = new THREE.PlaneGeometry(L + 0.85, 1.0), uv = gr.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * Math.round((L + 0.85) / 0.25) / 4); gr.translate(0, y1 + 0.65, 1.05); f.add('tileGrille', gr); f.add('iron', boxB(L + 0.85, 0.06, 0.08, 0, y1 + 1.1, 1.05));
    faceAt(acc, f, 8, a, k);
  }
  acc.plat({ poly: true, x: 0, z: 0, n: 8, a: a + 1.05, top: y1 + 0.15 });
  acc.add('inside', prism(8, a - 0.4, y1 - 0.4, 0.4)); acc.add('inside', prism(8, a - 0.4, y2 - 0.4, 0.4));
  // vòm ardoise (Le Vau — chưa theo mái phẳng) + đèn lồng
  const dp = [[a + 0.5, 0], [a + 0.25, 0.5], [a * 0.95, 1.5], [a * 0.75, 2.4], [a * 0.42, 3.0], [0.9, 3.25]];
  { const g = lathe([[0.001, 0], ...dp, [0.001, 3.25]], 0, 0, 0, 8); g.rotateY(Math.PI / 8); g.translate(0, yC, 0); acc.add('slate', g); }
  acc.add('lead', cyl(0.85, 0.85, 1.0, 0, yC + 3.25, 0, 8)); acc.add('slate', lathe([[0.001, 0], [1.0, 0], [0.5, 0.6], [0.001, 0.9]], 0, yC + 4.25, 0, 8)); acc.add('gilt', new THREE.SphereGeometry(0.22, 8, 6).translate(0, yC + 5.3, 0));
  // sân bát giác + 7 chuồng xoè quạt (tường thấp đá + lưới sắt); phần quạt trước (+z) là sân danh dự để ngỏ
  for (let k = 0; k < 8; k++) {
    const t0 = (k * Math.PI) / 4 + Math.PI / 8, Lc = side(8, Rc), f = new Acc(), front = k === 0;
    if (!front) { f.add('stone', boxB(Lc, 1.2, 0.5, 0, 0, 0)); const g = new THREE.PlaneGeometry(Lc, 1.4), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * Math.round(Lc / 0.6)); g.translate(0, 1.9, 0); f.add('tileGrille', g); }
    else for (const sx of [-1, 1]) { f.add('stone', boxB(Lc / 2 - 1.6, 1.2, 0.5, sx * (Lc / 4 + 0.8), 0, 0)); f.add('stone', boxB(0.7, 2.6, 0.7, sx * 1.6, 0, 0)); potAFeu(f, sx * 1.6, 2.6, 0, 0.9, k + sx); }
    faceAt(acc, f, 8, Rc, k);
    const tv = t0, wall = new Acc(), Lw = Rc / Math.cos(Math.PI / 8) - a - 0.6;  // tường ngăn chuồng theo hướng đỉnh bát giác
    if (k !== 0 && k !== 7) { wall.add('stone', boxB(0.4, 1.2, Lw, 0, 0, 0)); wall.add('stoneDk', boxB(0.5, 0.12, Lw, 0, 1.2, 0)); put(acc, wall, Math.sin(tv) * (a + 0.6 + Lw / 2), 0, Math.cos(tv) * (a + 0.6 + Lw / 2), tv); }
    else if (k === 7) { wall.add('stone', boxB(0.4, 1.2, Lw, 0, 0, 0)); put(acc, wall, Math.sin(tv) * (a + 0.6 + Lw / 2), 0, Math.cos(tv) * (a + 0.6 + Lw / 2), tv); }
  }
  // tường ngăn thứ 8 (giữa quạt trước và quạt k = 1)
  { const tv = Math.PI / 8 - Math.PI / 4, wall = new Acc(), Lw = Rc / Math.cos(Math.PI / 8) - a - 0.6; wall.add('stone', boxB(0.4, 1.2, Lw, 0, 0, 0)); put(acc, wall, Math.sin(tv) * (a + 0.6 + Lw / 2), 0, Math.cos(tv) * (a + 0.6 + Lw / 2), tv); }
  finishUV(acc);
  const PR = Rc / Math.cos(Math.PI / 8) + 0.3;
  return { acc, info: { W: 2 * a, D: 2 * a, PW: 2 * PR, PD: 2 * PR, ph, colH: G + U, eave: yC, top: yC + 5.5, n: 8, kind: 'pavilion' } };
}
