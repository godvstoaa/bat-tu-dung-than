// ============================================================================
//  TÀU NGỰA (Grande / Petite Écurie, Hardouin-Mansart 1679–82) — 06 › stableW / stableE.
//  Mặt lõm cung (dây cung ≈ 70 m) ôm sân, 2 tầng (tầng trệt dãy vòm à refends, tầng 1 cửa chữ nhật) + MÁI MANSARD ardoise
//  có cửa sổ mái và ống khói (khác mặt vườn lâu đài) · hai đầu là lầu góc (pavillon) · giữa là cổng ốp đá khối nhô (bossage)
//  mang fronton tạc 3 ngựa xe Apollo · sau cổng: manège chữ nhật (Grande) hoặc rotunda tròn mái vòm (Petite) · lưới sắt đầu
//  giáo dát vàng khép sân (ảnh Commons «Versailles_-_Grande_Écurie.jpg»). Mặt hông / mặt ngoài gạch đỏ chân đá, góc xây chaînes.
// ============================================================================
import * as THREE from 'three';
import { Acc, recenter, boxB, box, lathe, slabXY, V, put, slabHoles, rectPts, archPts, opening, refends, pilaster, entab, band, balus, potAFeu, cartouche, keystone, horse, insetRoof, lucarne, chimney, finishUV, ringFrame } from './fr-kit.js';

const H1 = 6.0, H2 = 4.5, CORN = 0.9;                  // tầng trệt vòm · tầng 1 · gờ đầu (06 stableW §2: diềm ≈ 10–11 m)

/** một đoạn mặt đứng n ô (khung cục bộ, mặt z = 0, ngoài +z), chân y0; key 'stone' (mặt hướng lâu đài) | 'brick' (mặt hông) */
function stableRow(acc, L, n, y0, o = {}) {
  const key = o.key || 'stone', brick = key === 'brick', p = L / n, t = 0.8, yF = y0 + H1, yC = yF + H2, gh = [], uh = [];
  for (let i = 0; i < n; i++) {
    const xc = -L / 2 + p * (i + 0.5), door = o.door === i;
    gh.push({ kind: 'arch', x: xc, y0: door ? y0 : y0 + 0.25, w: door ? 2.8 : Math.min(2.6, p * 0.62), h: door ? 4.9 : 4.5, door, glass: 'tileGlass4' });
    uh.push({ kind: 'rect', x: xc, y0: yF + 0.9, w: Math.min(1.5, p * 0.38), h: 2.5, glass: 'tileGlass4' });
  }
  acc.add(brick ? 'brick' : 'stoneRef', slabHoles(rectPts(-L / 2, y0, L / 2, yF), gh.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, t));
  acc.add(brick ? 'brick' : 'stone', slabHoles(rectPts(-L / 2, yF, L / 2, yC), uh.map((h) => rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h)), 0, t));
  for (const h of gh) { opening(acc, h, 0, { reveal: 0.3, frame: brick ? { w: 0.25, d: 0.05, key: 'brickTrim' } : null }); refends(acc, h.x - 0.1, h.x + 0.1, y0, y0 + 0.1, 0, [h], { tex: true, vous: brick ? 0 : 0.45, nv: 5 }); keystone(acc, h.x, h.y0 + h.h + 0.02, 0, 0.45, 0.6, 0.14, !brick); }
  for (const h of uh) { opening(acc, h, 0, { reveal: 0.25, frame: { w: 0.18, d: 0.06, sill: true, key: brick ? 'brickTrim' : 'stoneDk' } }); acc.add(brick ? 'brickTrim' : 'stoneDk', boxB(h.w + 0.6, 0.18, 0.3, h.x, h.y0 + h.h + 0.18, 0.15)); }
  acc.add('stoneDk', boxB(L, 0.5, t + 0.12, 0, y0, -t / 2 + 0.06));                                  // chân đá
  band(acc, -L / 2, L / 2, yF - 0.05, 0.35, 0, 0.1, brick ? 'brickTrim' : 'stoneDk');              // gờ tầng
  entab(acc, 'tuscan', -L / 2, L / 2, yC, 0.04, CORN, { mutule: 0.55, dep: t, key: brick ? 'brickTrim' : 'stone' });
  return { yC: yC + CORN };
}
/** chaînes d'angle: đá góc dài – ngắn xen kẽ trên tường gạch (hoặc đá nhô ở mặt đá) */
function quoins(acc, x, y0, y1, z, sx, sz, key = 'brickTrim') {
  let k = 0; for (let y = y0; y < y1 - 0.3; y += 0.62, k++) { const L = k % 2 ? 0.9 : 0.55; acc.add(key, boxB(0.06 + (sx ? L : 0.06), 0.56, 0.06 + (sz ? L : 0.06), x - sx * L / 2, y, z - sz * L / 2)); }
}

/** lầu chữ nhật (lầu góc / manège): 4 mặt — mặt trước đá, hông + sau gạch (hoặc toàn đá); mái Mansard có cửa mái */
function pavilionBlock(acc, w, d, y0, o = {}) {
  const nF = Math.max(1, Math.round(w / 4)), nS = Math.max(1, Math.round(d / 4.2));
  const faces = [[w, nF, 0, d / 2, 0, o.frontKey || 'stone', o.door], [w, nF, 0, -d / 2, Math.PI, o.backKey || 'brick'], [d, nS, w / 2, 0, Math.PI / 2, o.sideKey || 'brick'], [d, nS, -w / 2, 0, -Math.PI / 2, o.sideKey || 'brick']];
  let yC = 0;
  for (const [L, n, x, z, ry, key, door] of faces) { const f = new Acc(); yC = stableRow(f, L, n, y0, { key, door: door ? Math.floor(n / 2) : -1 }).yC; put(acc, f, x, 0, z, ry); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { quoins(acc, sx * (w / 2 + 0.03), y0 + 0.5, yC - CORN, sz * (d / 2 + 0.03), sx, 0); quoins(acc, sx * (w / 2 + 0.03), y0 + 0.5, yC - CORN, sz * (d / 2 + 0.03), 0, sz); }
  acc.add('inside', boxB(w - 1.4, 0.4, d - 1.4, 0, y0 + H1 - 0.4, 0)); acc.add('inside', boxB(w - 1.4, 0.4, d - 1.4, 0, yC - CORN - 0.4, 0));
  const r = insetRoof(acc, rectPts(-w / 2 - 0.4, -d / 2 - 0.4, w / 2 + 0.4, d / 2 + 0.4), yC, [[0, 0], [1.3, 3.6], [Math.min(w, d) / 2 + 0.2, 3.6 + (Math.min(w, d) / 2 - 1.1) * 0.32]]);
  for (let i = 0; i < nF; i++) for (const sz of [1, -1]) lucarne(acc, -w / 2 + (w / nF) * (i + 0.5), yC + 0.1, sz * (d / 2 - 0.5), sz > 0 ? 0 : Math.PI, 1.2, 1.9, i % 2 === 0);
  return { yC, top: r.top };
}

/** CỔNG GIỮA: khối nhô ốp đá khối (bossage), vòm cổng lớn mở, gờ Toscan, FRONTON tạc 3 ngựa + cartouche huy hiệu; mái Mansard sau */
function gatePavilion(acc, w, d, y0) {
  const H = 12.6, ent = 1.25, yE = y0 + H, f = new Acc();
  const gate = { kind: 'arch', x: 0, y0, w: 5.0, h: 8.6, door: true };
  f.add('stoneRef', slabHoles(rectPts(-w / 2, y0, w / 2, yE), [archPts(0, y0, gate.w, gate.h)], 0, 1.2));
  refends(f, -w / 2, w / 2, y0 + 0.6, yE - 0.2, 0, [gate], { course: 0.6, proj: 0.1, vous: 0.9, nv: 9, mask: true });   // bossage nổi + đá vòm toả tia
  for (const sx of [-1, 1]) for (let k = 0, y = y0; y < yE - 0.6; y += 0.6, k++) f.add('stoneDk', boxB(k % 2 ? 1.3 : 0.9, 0.52, 0.22, sx * (w / 2 - (k % 2 ? 0.65 : 0.45)), y + 0.04, 0.11)); // góc đá khối
  entab(f, 'tuscan', -w / 2 - 0.2, w / 2 + 0.2, yE, 0.15, ent, { mutule: 0.6, dep: 1.3 });
  // fronton tam giác: tường tympan + hai gờ dốc + gờ ngang
  const pw = w + 0.4, ph = pw * 0.24, yP = yE + ent;
  f.add('stone', slabXY([[-pw / 2, 0], [pw / 2, 0], [0, ph]], 0.9, 0, yP, -0.3));
  for (const sx of [-1, 1]) { const g = new THREE.BoxGeometry(Math.hypot(pw / 2, ph) + 0.5, 0.42, 1.4); g.rotateZ(-sx * Math.atan2(ph, pw / 2)); g.translate(sx * pw / 4, yP + ph / 2 + 0.12, 0.25); f.add('stoneDk', g); }
  f.add('stoneDk', boxB(pw + 0.3, 0.3, 1.3, 0, yP, 0.2));
  // tympan: 3 ngựa xe Apollo quanh huy hiệu (06 stableW §5.2, §7)
  horse(f, -3.2, yP + 0.35, 0.18, 2.4, 1, 0.28); horse(f, -1.4, yP + 0.35, 0.22, 2.7, 1, 0.3); horse(f, 3.2, yP + 0.35, 0.18, 2.4, -1, 0.28);
  cartouche(f, 0.9, yP + ph * 0.42, 0.18, 1.3, 1.5, 'carve', true);
  potAFeu(f, 0, yP + ph + 0.15, 0, 1.6, 2); for (const sx of [-1, 1]) potAFeu(f, sx * (pw / 2 - 0.2), yP + 0.3, 0.2, 1.4, 0);
  // hai mặt bên + sau đá trơn khía
  put(acc, f, 0, 0, d / 2, 0);
  for (const [L, x, z, ry] of [[d, w / 2, 0, Math.PI / 2], [d, -w / 2, 0, -Math.PI / 2], [w, 0, -d / 2, Math.PI]]) {
    const s = new Acc(), hb = ry === Math.PI ? [{ kind: 'arch', x: 0, y0, w: 5.0, h: 8.6, door: true }] : [];
    s.add('stoneRef', slabHoles(rectPts(-L / 2, y0, L / 2, yE), hb.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 1.0)); entab(s, 'tuscan', -L / 2, L / 2, yE, 0.1, ent, { dep: 1.1 }); put(acc, s, x, 0, z, ry);
  }
  acc.add('inside', boxB(w - 1.6, yE - y0 - 8.6, d - 1.6, 0, y0 + 8.6, 0));                          // trần lối cổng
  const r = insetRoof(acc, rectPts(-w / 2 - 0.3, -d / 2 - 0.3, w / 2 + 0.3, d / 2 - 0.6), yE + ent, [[0, 0], [1.3, 3.8], [w / 2 - 0.5, 5.6]]);
  return { top: Math.max(r.top, yP + ph + 1.8), yE };
}

/** đoạn cánh cung: các ô dọc cung bán kính R (mặt trước hướng tâm), từ góc a0 đến a1; tâm cung (0, zc) */
function arcWing(acc, R, dep, zc, a0, a1, y0, nb) {
  const da = (a1 - a0) / nb; let yC = 0;
  for (let i = 0; i < nb; i++) {
    const a = a0 + da * (i + 0.5), Lf = 2 * R * Math.sin(Math.abs(da) / 2) + 0.12, Lb = 2 * (R + dep) * Math.sin(Math.abs(da) / 2) + 0.12;
    const f = new Acc(); yC = stableRow(f, Lf, 1, y0, { key: 'stone' }).yC; put(acc, f, R * Math.sin(a), 0, zc - R * Math.cos(a), -a);
    const b = new Acc(); stableRow(b, Lb, 1, y0, { key: 'brick' }); put(acc, b, (R + dep) * Math.sin(a), 0, zc - (R + dep) * Math.cos(a), Math.PI - a);
    lucarne(acc, (R + 0.6) * Math.sin(a), yC + 0.1, zc - (R + 0.6) * Math.cos(a), -a, 1.2, 1.9, i % 2 === 0);
    if (i % 2 === 1) chimney(acc, (R + dep * 0.5) * Math.sin(a), yC + 4.6, zc - (R + dep * 0.5) * Math.cos(a), 2.4, -a);
  }
  // mái Mansard theo cung (đa giác: mép trước + mép sau) — 06 §4.1: Mansard chỉ ở tàu ngựa và mặt sân
  const front = [], back = [], N = nb * 2;
  for (let i = 0; i <= N; i++) { const a = a0 + ((a1 - a0) * i) / N; front.push([(R - 0.4) * Math.sin(a), zc - (R - 0.4) * Math.cos(a)]); back.push([(R + dep + 0.4) * Math.sin(a), zc - (R + dep + 0.4) * Math.cos(a)]); }
  insetRoof(acc, [...front, ...back.reverse()], yC, [[0, 0], [1.3, 3.6], [dep / 2 + 0.3, 3.6 + (dep / 2 - 1.0) * 0.3]]);
  const fl = []; for (let i = 0; i <= N; i++) { const a = a0 + ((a1 - a0) * i) / N; fl.push([(R + 0.8) * Math.sin(a), zc - (R + 0.8) * Math.cos(a)]); }
  const inner = []; for (let i = N; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / N; inner.push([(R + dep - 0.8) * Math.sin(a), zc - (R + dep - 0.8) * Math.cos(a)]); }
  const g = new THREE.ExtrudeGeometry(new THREE.Shape([...fl, ...inner].map(([x, z]) => new THREE.Vector2(x, -z))), { depth: 0.4, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, y0 + H1 - 0.4, 0); acc.add('inside', g.clone().translate(0, H2, 0)); acc.add('inside', g);
  return { yC };
}

/**
 * spec: { chord (70), sag, dep (sâu dãy 11,5), manege: 'rect' | 'round' }
 * Khung: +z = mặt hướng lâu đài (lõm), gốc = tâm khung bao.
 */
export function frStable(spec) {
  const acc = new Acc(), C = spec.chord || 70, s = spec.sag || 12, dep = spec.dep || 11.5, y0 = 0.3;
  const R = (C * C / 4 + s * s) / (2 * s), am = Math.asin(C / 2 / R);
  const gw = 15, gd = 15, pw = 12, pd = 14;                                                                   // cổng · lầu góc
  const zMid = 0, zc = zMid + R;
  const ag = (gw / 2) / R, ae = am - pw / R;
  for (const sg of [-1, 1]) arcWing(acc, R, dep, zc, sg * ag, sg * ae, y0, 5);
  // lầu góc hai đầu cung (thẳng, tiếp tuyến), mặt trước đá — hông và sau gạch
  let pTop = 0, pC = 0;
  for (const sg of [-1, 1]) { const a = sg * (am - pw / 2 / R), rr = R + dep / 2 - 0.6, b = new Acc(); const q = pavilionBlock(b, pw, pd, y0, { sideKey: 'brick', backKey: 'brick' }); pTop = q.top; pC = q.yC; put(acc, b, rr * Math.sin(a), 0, zc - rr * Math.cos(a), -a); }
  // cổng giữa nhô ra trước cung
  const gA = new Acc(); const gr = gatePavilion(gA, gw, gd, y0); put(acc, gA, 0, 0, zMid + 1.5 - gd / 2, 0);
  // sau cổng: manège
  const zBack = zMid - dep, mz = zBack - (spec.manege === 'round' ? 8.5 : 13) + 0.5;
  let mTop = 0;
  if (spec.manege === 'round') mTop = rotunda(acc, 0, mz, 8.5, y0);
  else { const m = new Acc(); const q = pavilionBlock(m, 16.75, 26, y0, { frontKey: 'stone', sideKey: 'stone', backKey: 'stone' }); mTop = q.top; put(acc, m, 0, 0, zBack - 13 + 0.5, 0); }
  // lưới sắt đầu giáo dát vàng khép sân giữa hai lầu góc (cổng giữa mở 4,4 m) + trụ đá có pot à feu
  const ex = (R + 0.6) * Math.sin(am - pw / R) - 0.0, ez = zc - (R - 1.2) * Math.cos(am - pw / R);
  const gx = ex - 1.2, gz = ez + 1.5;
  for (const sg of [-1, 1]) {
    const xs = [sg * 2.2, sg * gx]; const L = Math.abs(xs[1] - xs[0]), n = Math.round(L / 5.5);
    for (let k = 0; k <= n; k++) { const x = xs[0] + (xs[1] - xs[0]) * (k / n); acc.add('stone', boxB(0.8, 3.4, 0.8, x, 0, gz)); acc.add('stoneDk', boxB(1.0, 0.25, 1.0, x, 3.4, gz)); potAFeu(acc, x, 3.65, gz, 1.1, k, 'carve'); }
    for (let k = 0; k < n; k++) { const xa = xs[0] + (xs[1] - xs[0]) * (k / n), xb = xs[0] + (xs[1] - xs[0]) * ((k + 1) / n), Lk = Math.abs(xb - xa) - 0.8; const g = new THREE.PlaneGeometry(Lk, 3.0), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * Math.round(Lk / 0.6)); g.translate((xa + xb) / 2, 1.9, gz); acc.add('tileGrille', g); acc.add('stoneDk', boxB(Lk, 0.4, 0.5, (xa + xb) / 2, 0, gz)); }
  }
  // khung bao
  const zMin = (spec.manege === 'round' ? mz - 8.5 - 0.6 : zBack - 26 + 0.5 - 0.6), zMax = gz + 0.5;
  const xMax = Math.max(gx + 0.5, (R + dep) * Math.sin(am) + 2);
  recenter(acc, 0, -(zMax + zMin) / 2); finishUV(acc);
  return { acc, info: { W: C, D: zMax - zMin, PW: 2 * xMax, PD: zMax - zMin, ph: y0, eave: pC, top: Math.max(pTop, gr.top, mTop), kind: 'stable', storeys: 2 } };
}

/** ROTUNDA manège tròn (Petite Écurie, 06 stableE §5.3): trống đá 20 mặt, cửa vòm cao xen pilaster, gờ, vòm ardoise + lồng đèn */
function rotunda(acc, x, z, r, y0) {
  const n = 20, H = 11.5, side = 2 * r * Math.tan(Math.PI / n);
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2, f = new Acc(), win = k % 2 === 0 && k !== 5;
    const hs = win ? [{ kind: 'arch', x: 0, y0: y0 + 1.6, w: 1.7, h: 5.6, glass: 'tileGlass' }] : [];
    f.add('stoneRef', slabHoles(rectPts(-side / 2 - 0.03, y0, side / 2 + 0.03, y0 + H), hs.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 0.8));
    for (const h of hs) { opening(f, h, 0, { reveal: 0.3, frame: { w: 0.18, d: 0.06 } }); keystone(f, 0, h.y0 + h.h + 0.03, 0, 0.42, 0.55, 0.14, true); }
    if (!win) f.add('stoneDk', boxB(0.7, H - 1.6, 0.12, 0, y0 + 0.8, 0.06));
    entab(f, 'tuscan', -side / 2 - 0.05, side / 2 + 0.05, y0 + H, 0.05, 1.0, { dep: 0.9 });
    put(acc, f, x + Math.sin(a) * r, 0, z + Math.cos(a) * r, a);
  }
  const yb = y0 + H + 1.0, prof = [[r + 0.5, 0], [r + 0.45, 0.4], [r * 0.95, 2.2], [r * 0.82, 4.3], [r * 0.6, 6.1], [r * 0.32, 7.2], [1.6, 7.5]];
  acc.add('slate', lathe([[0.001, 0], ...prof, [0.001, 7.5]], x, yb, z, 32));
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; acc.add('lead', ribGeo(prof, a, x, yb, z)); }
  acc.add('stone', lathe([[0.001, 0], [1.7, 0], [1.7, 0.3], [1.3, 0.3], [1.3, 2.0], [1.6, 2.1], [0.001, 2.1]], x, yb + 7.5, z, 12));
  acc.add('slate', lathe([[0.001, 0], [1.6, 0], [1.1, 0.8], [0.4, 1.4], [0.001, 1.5]], x, yb + 9.6, z, 12));
  acc.add('gilt', new THREE.SphereGeometry(0.35, 8, 6).translate(x, yb + 11.3, z));
  return yb + 11.7;
}
function ribGeo(prof, a, x, y, z) { const pts = prof.map(([r, h]) => V(x + Math.sin(a) * (r + 0.05), y + h + 0.05, z + Math.cos(a) * (r + 0.05))); const out = []; for (let i = 0; i < pts.length - 1; i++) { const d = new THREE.Vector3().subVectors(pts[i + 1], pts[i]); const g = new THREE.BoxGeometry(0.2, 0.16, d.length()); g.lookAt(d); g.translate((pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2, (pts[i].z + pts[i + 1].z) / 2); out.push(g.toNonIndexed()); } return mergeAll(out); }
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
const mergeAll = (l) => mergeGeometries(l, false);
