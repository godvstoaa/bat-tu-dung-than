// ============================================================================
//  THÁNH ĐIỆN THÁP (lầu 10 tầng) — 06 › tower: tổng hợp Dôme des Invalides (thân vuông 2 thức chồng, trống 2 tầng có trụ
//  cuộn, vòm chì gân vàng, lanternon, obelisk) + Panthéon (trống có hàng cột Corinthian bao tròn) + Cordouan (đế 41 m, tháp
//  thức cột lùi dần). Chồng thức Doric → Ionic → Corinthian; mái phẳng ở mọi chỗ lùi tầng; lan can con tiện ở mỗi sân thượng.
//  VỎ NGOÀI dựng trên đặc tả lầu của game (towerSpec, FH = 5 m) với bản ghi đè TOWER_OVR (n = 16, a[10], podium) — báo lại.
//  Bên trong (sàn, thang, vách đa giác 16 cạnh) do game dựng; vỏ vuông / tròn ở đây bao ngoài vách đó.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, box, cyl, lathe, slabXY, V, put, slabHoles, rectPts, archPts, opening, refends, pilaster, column, entab, band, balus, balusPath, potAFeu, trophy, statue, cartouche, keystone, finishUV } from './fr-kit.js';
import { towerSpec } from '../tower.js';
import { TP_STYLES } from '../styles.js';

/** bản ghi đè lầu (đề nghị áp vào styles.js › tancodien.tower) — 06 tower §3, §8 */
export const TOWER_OVR = { n: 16, a: [16.0, 14.0, 14.0, 13.3, 13.3, 11.0, 11.0, 11.0, 11.0, 11.0], podium: 2.4 };
export const frTowerSpec = () => { const st = TP_STYLES.find((s) => s.id === 'tancodien'); return towerSpec({ ...st, tower: { ...st.tower, ...TOWER_OVR } }); };

const ring = (acc, key, prof, y, seg = 48) => acc.add(key, new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(r, h)), seg).translate(0, y, 0));
/** đặt mặt k quanh tâm: mặt phẳng tại bán kính (apothem) a, góc t */
const at = (acc, sub, a, t) => put(acc, sub, Math.sin(t) * a, 0, Math.cos(t) * a, t);

/** một mặt của tầng vuông có thức: 7 ô, avant-corps 3 ô giữa có 4 cột tự do; cửa hai tầng game (dưới cao, trên thấp) */
function orderFace(f, L, o) {
  const n = 7, p = L / n, y0 = o.y0, D = o.D, colH = o.colH, ent = o.ent, ord = o.ord, yP = y0 + o.plinth, yE = yP + colH, yT = yE + ent, t = 0.6, ac = 0.6;
  const lower = [], upper = [];
  for (let i = 0; i < n; i++) {
    const xc = -L / 2 + p * (i + 0.5), door = o.door && i === 3;
    lower.push({ kind: 'arch', x: xc, y0: door ? y0 : y0 + 0.4, w: door ? 2.6 : o.lw, h: door ? 3.9 : o.lh, door, glass: 'tileGlass', ac: i >= 2 && i <= 4 });
    upper.push({ kind: o.upKind || 'rect', x: xc, y0: y0 + 5 + o.uy, w: o.uw, h: o.uh, glass: 'tileGlass3', ac: i >= 2 && i <= 4 });
  }
  for (const [x0, x1, zf] of [[-L / 2, -p * 1.5, 0], [-p * 1.5, p * 1.5, ac], [p * 1.5, L / 2, 0]]) {
    const hs = [...lower, ...upper].filter((h) => h.x > x0 && h.x < x1);
    f.add('stone', slabHoles(rectPts(x0, y0, x1, yT), hs.map((h) => (h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h))), zf, t + zf));
    for (const h of hs) { opening(f, h, zf, { reveal: 0.3, frame: { w: 0.16, d: 0.06, sill: h.kind === 'rect' } }); if (h.kind === 'arch') keystone(f, h.x, h.y0 + h.h + 0.03, zf, 0.45, 0.6, 0.15, false, 'carve'); }
    f.add('stoneDk', boxB(x1 - x0, o.plinth, 0.3, (x0 + x1) / 2, y0, zf + 0.1));
    band(f, x0, x1, y0 + 4.85, 0.3, zf, 0.06);                                                         // gờ sàn tầng trên
    const zE = zf + (zf ? 0.25 + D * 1.05 : 0.15);
    entab(f, ord, x0, x1, yE, zE, ent, { dent: ord !== 'doric', mutule: ord === 'doric' ? p / 2 : 0, trig: ord === 'doric' ? Array.from({ length: 2 * n + 1 }, (_, i) => -L / 2 + (p / 2) * i) : null, dep: zE + t });
  }
  for (let i = 0; i <= n; i++) {
    const x = -L / 2 + p * i, e = i === 0 ? 1 : i === n ? -1 : 0, acx = i >= 2 && i <= 5, zf = i >= 3 && i <= 4 ? ac : 0;
    pilaster(f, ord, x + e * D * 0.55, yP, acx && i !== 2 && i !== 5 ? ac : 0, colH, D, 0.15, { capKey: 'carve' });
    if (acx) { const zc = ac + 0.25 + D * 0.6; f.add('stoneDk', boxB(D * 1.45, o.plinth, zc + D, x, y0, (zc + D) / 2)); column(f, ord, x, yP, zc, colH, D, { seg: 10 }); if (o.statues) { f.add('stoneDk', boxB(0.9, 0.5, 0.9, x, yT + 0.4, zc)); statue(f, x, yT + 0.9, zc, 2.6, i, 0, 'carve'); } }
  }
  if (o.medallions) for (const i of [2, 3, 4]) cartouche(f, -L / 2 + p * (i + 0.5) + p / 2 - p / 2, y0 + 5 + o.uy + o.uh + 0.75, ac, 1.0, 1.0, 'carve', true);
  return { yT };
}
/** tấm trống tròn (một cạnh của đa giác 24 cạnh) có lỗ cửa */
function drumPanel(acc, w, y0, y1, holes, t = 0.6) {
  acc.add('stone', slabHoles(rectPts(-w / 2 - 0.02, y0, w / 2 + 0.02, y1), holes.map((h) => (h.kind === 'arch' ? archPts(h.x, h.y0, h.w, h.h) : h.kind === 'oculus' ? Array.from({ length: 14 }, (_, i) => [h.x + Math.cos((i / 14) * Math.PI * 2) * h.w / 2, h.y0 + h.w / 2 + Math.sin((i / 14) * Math.PI * 2) * h.w / 2]) : rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h))), 0, t));
  for (const h of holes) opening(acc, h, 0, { reveal: 0.25, frame: { w: 0.14, d: 0.06, sill: h.kind === 'rect' } });
}

export function frTower(spec) {
  const ts = frTowerSpec(), acc = new Acc(), F = ts.floors, P = ts.podium, pa = P.a, Y = (k) => F[k].y;
  // ---------------- THỀM (podium) 44 × 44 × 2,4: tường khía rãnh, gờ, lan can (chừa miệng bậc), bậc rộng ở mặt chính
  acc.add('stoneRef', boxB(2 * pa, P.y - 0.25, 2 * pa, 0, 0, 0)); acc.add('stoneDk', boxB(2 * pa + 0.4, 0.25, 2 * pa + 0.4, 0, P.y - 0.25, 0)); acc.plat({ x: 0, z: 0, w: 2 * pa, d: 2 * pa, top: P.y });
  for (let i = 1; i <= P.steps; i++) { const top = i * P.rise, z = pa + P.run - (i - 0.5) * P.tread; acc.add('stone', boxB(P.stairW, top, P.tread + 0.02, 0, 0, z)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top }); }
  for (const sx of [-1, 1]) { const g = new THREE.BoxGeometry(0.7, 0.9, Math.hypot(P.run, P.y)); g.rotateX(Math.atan2(P.y, P.run)); g.translate(sx * (P.stairW / 2 + 0.35), P.y / 2 + 0.45, pa + P.run / 2); acc.add('stoneDk', g); acc.add('stone', boxB(0.7, P.y * 0.5, P.run, sx * (P.stairW / 2 + 0.35), 0, pa + P.run / 2)); }
  const sw = P.stairW / 2 + 0.2, e = pa - 0.3;
  balusPath(acc, [[-sw, e], [-e, e], [-e, -e], [e, -e], [e, e], [sw, e]], P.y, { h: 1.1, desStep: 3.6 });
  for (const [x, z] of [[-e, e], [e, e], [-e, -e], [e, -e]]) potAFeu(acc, x, P.y + 1.15, z, 1.8, x > 0 ? 1 : 2);
  // ---------------- TẦNG 0: soubassement à refends, 7 vòm mỗi mặt, mascaron; cửa chính mặt trước
  const s0 = F[0].a + 0.35, s1 = F[1].a + 0.35, s3 = F[3].a + 0.35;
  for (let k = 0; k < 4; k++) {
    const f = new Acc(), L = 2 * s0, p = L / 7, hs = [];
    for (let i = 0; i < 7; i++) { const door = k === 0 && i === 3; hs.push({ kind: 'arch', x: -L / 2 + p * (i + 0.5), y0: door ? Y(0) : Y(0) + 0.3, w: door ? 2.6 : 2.2, h: door ? 3.9 : 3.5, door, glass: 'tileGlass4' }); }
    f.add('stoneRef', slabHoles(rectPts(-L / 2, Y(0), L / 2, Y(1) - 0.4), hs.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 0.6));
    refends(f, -L / 2, L / 2, Y(0), Y(1) - 0.9, 0, hs, { tex: true, vous: 0.5, nv: 5, mask: true }); for (const h of hs) opening(f, h, 0, { reveal: 0.3 });
    entab(f, 'tuscan', -L / 2, L / 2, Y(1) - 1.3, 0.05, 0.9, { dep: 0.7 });
    at(acc, f, s0, (k * Math.PI) / 2);
  }
  const terraceSq = (half, y, balH = 1.1, orn = true) => {
    acc.add('stone', boxB(2 * half, 0.4, 2 * half, 0, y - 0.4, 0)); acc.add('stoneDk', boxB(2 * half + 0.2, 0.12, 2 * half + 0.2, 0, y - 0.4, 0)); acc.plat({ x: 0, z: 0, w: 2 * half, d: 2 * half, top: y });
    const h = half - 0.25; balusPath(acc, [[-h, h], [h, h], [h, -h], [-h, -h], [-h, h]], y, { h: balH, desStep: 3.4 });
    if (orn) for (const [x, z] of [[-h, h], [h, h], [-h, -h], [h, -h]]) trophy(acc, x, y + balH + 0.1, z, 2.6, x * z > 0 ? 0 : 1, Math.atan2(x, z));
  };
  terraceSq(F[1].slabA + 0.3, Y(1));                                                                 // sân thượng tầng 1 (trên soubassement)
  // ---------------- TẦNG 1–2: thức DORIC (D 0,925 × 8 = 7,4 + entablature triglyph 1,85)
  for (let k = 0; k < 4; k++) { const f = new Acc(); orderFace(f, 2 * s1, { y0: Y(1), ord: 'doric', D: 0.925, colH: 7.4, ent: 1.85, plinth: 0.35, lw: 1.9, lh: 3.8, uw: 1.5, uh: 2.0, uy: 0.8, door: k === 0 || k === 2 }); at(acc, f, s1, (k * Math.PI) / 2); }
  // ban công tầng 3 trên công-xon (dầm đá cuộn) — sàn vuông phủ sàn game
  terraceSq(F[3].slabA + 0.12, Y(3), 1.1, false);
  for (let k = 0; k < 4; k++) { const f = new Acc(); for (let i = 0; i <= 7; i++) { const x = -s1 + (2 * s1 / 7) * i; const c = slabXY([[0, 0], [0.35, 0], [1.75, 0.0], [1.75, 0.35], [0.5, -1.1], [0, -1.3]], 0.5, 0, 0, 0); c.rotateY(-Math.PI / 2); c.translate(x, Y(3) - 0.4, 0); f.add('carve', c); } at(acc, f, s1, (k * Math.PI) / 2); }
  // ---------------- TẦNG 3–4: thức IONIC (D 0,8 × 9 = 7,2 + 1,8) — cửa vòm cao kiểu étage noble, huy chương, tượng trên avant-corps
  for (let k = 0; k < 4; k++) { const f = new Acc(); orderFace(f, 2 * s3, { y0: Y(3), ord: 'ionic', D: 0.8, colH: 7.2, ent: 1.8, plinth: 0.3, lw: 1.8, lh: 4.0, uw: 1.3, uh: 1.4, uy: 0.6, door: k === 0 || k === 2, medallions: true, statues: false }); at(acc, f, s3, (k * Math.PI) / 2); }
  terraceSq(s3 + 0.65, Y(5));
  // tượng «Mười hai tháng» đứng trên lan can sân thượng tầng 5, ngay trên các cột avant-corps (06 tower §7)
  for (let k = 0; k < 4; k++) { const t = (k * Math.PI) / 2; for (const x of [-1.5, 1.5].map((u) => u * (2 * s3) / 7)) { const r = s3 + 0.4; const px = Math.sin(t) * r + Math.cos(t) * x, pz = Math.cos(t) * r - Math.sin(t) * x; statue(acc, px, Y(5) + 1.2, pz, 2.6, k * 2 + (x > 0 ? 1 : 0), t, 'carve'); } }
  // ---------------- TẦNG 5–6: TRỐNG TRÒN + hàng cột Corinthian tự do bao tròn (péristyle kiểu Panthéon, 24 cột D 0,8 × 10)
  const NP = 24, rD = F[5].a / Math.cos(Math.PI / 16) + 0.45, pwD = 2 * rD * Math.tan(Math.PI / NP);
  const isDoor = (i) => i === 0 || i === NP / 2;                                                   // trục ±z: cửa ra hành lang (tầng có ban công)
  for (let i = 0; i < NP; i++) {
    const t = (i / NP) * Math.PI * 2, f = new Acc();
    drumPanel(f, pwD, Y(5), Y(7) - 0.4, [isDoor(i) ? { kind: 'rect', x: 0, y0: Y(5), w: 2.4, h: 3.4, door: true } : { kind: 'arch', x: 0, y0: Y(5) + 0.3, w: 1.5, h: 3.6, glass: 'tileGlass' }, { kind: 'rect', x: 0, y0: Y(6) + 0.9, w: 1.2, h: 2.0, glass: 'tileGlass3' }]);
    at(acc, f, rD, t);
  }
  const rc = 12.9, colH = 8.0, Dc = 0.8;
  for (let i = 0; i < NP; i++) { const t = ((i + 0.5) / NP) * Math.PI * 2; column(acc, 'corinthian', Math.sin(t) * rc, Y(5), Math.cos(t) * rc, colH, Dc, { seg: 10, ry: t }); }
  ring(acc, 'stone', [[rD - 0.3, 0], [rc + 0.45, 0], [rc + 0.45, 0.6], [rc + 0.5, 0.62], [rc + 0.5, 1.2], [rc + 0.7, 1.35], [rc + 1.0, 1.6], [rc + 1.05, 2.0], [rD - 0.3, 2.0], [rD - 0.3, 0]], Y(5) + colH, 64);
  ring(acc, 'dentil', [[rc + 0.7, 0], [rc + 0.78, 0], [rc + 0.78, 0.15], [rc + 0.7, 0.15], [rc + 0.7, 0]], Y(5) + colH + 1.3, 64);
  // hành lang tầng 7 trên péristyle: lan can tròn + pot à feu
  const rr = rc + 0.75, rp = Array.from({ length: 49 }, (_, i) => [Math.sin((i / 48) * Math.PI * 2) * rr, Math.cos((i / 48) * Math.PI * 2) * rr]);
  balusPath(acc, rp, Y(7), { h: 1.05, desStep: 99 });
  for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2 + Math.PI / 8; potAFeu(acc, Math.sin(t) * rr, Y(7) + 1.1, Math.cos(t) * rr, 1.5, i); }
  // ---------------- TẦNG 7: attic trống — œil-de-bœuf, 8 cặp pilaster (Invalides)
  for (let i = 0; i < NP; i++) {
    const t = (i / NP) * Math.PI * 2, f = new Acc();
    drumPanel(f, pwD, Y(7), Y(8) - 0.4, isDoor(i) ? [{ kind: 'rect', x: 0, y0: Y(7), w: 2.4, h: 3.2, door: true }] : i % 3 === 0 ? [{ kind: 'oculus', x: 0, y0: Y(7) + 1.4, w: 1.6, glass: 'tileGlassR' }] : []);
    if (i % 3 !== 0) for (const sx of [-0.55, 0.55]) pilaster(f, 'corinthian', sx, Y(7) + 0.2, 0, 3.6, 0.5, 0.12, { light: true });
    at(acc, f, rD, t);
  }
  ring(acc, 'stone', [[rD - 0.3, 0], [rD + 0.25, 0], [rD + 0.45, 0.2], [rD + 0.7, 0.45], [rD - 0.3, 0.45], [rD - 0.3, 0]], Y(8) - 0.45, 48);
  // ---------------- TẦNG 8: trống trên — cửa vòm cao giữa 8 trụ cuộn (contreforts à volutes) đỡ hành lang tầng 9
  for (let i = 0; i < NP; i++) { const t = (i / NP) * Math.PI * 2, f = new Acc(); drumPanel(f, pwD, Y(8), Y(9) - 0.4, i % 3 === 0 ? [] : [{ kind: 'arch', x: 0, y0: Y(8) + 0.5, w: 1.3, h: 3.4, glass: 'tileGlass' }]); at(acc, f, rD, t); }
  for (let i = 0; i < 8; i++) {
    const t = ((3 * i + 1.5) / NP) * Math.PI * 2, f = new Acc(), dep = F[9].slabA - rD + 0.1;
    const prof = [[0, 0], [0.9, 0], [0.9, 0.5], [0.55, 1.0], [0.6, 2.8], [dep, 3.9], [dep, 4.6], [0, 4.6]];
    const g = slabXY(prof, 0.9, 0, 0, 0); g.rotateY(-Math.PI / 2); g.translate(0, Y(8), 0); f.add('stone', g);
    for (const [u, v, r0] of [[0.75, 0.55, 0.42], [dep - 0.4, 4.05, 0.5]]) { const s = new THREE.CylinderGeometry(r0, r0, 1.05, 12); s.rotateZ(Math.PI / 2); s.translate(0, Y(8) + v, u); f.add('carve', s); }
    at(acc, f, rD, t);
  }
  // hành lang tầng 9 (vành trên các trụ cuộn) + lan can
  ring(acc, 'stone', [[rD - 0.3, 0], [F[9].slabA + 0.15, 0], [F[9].slabA + 0.15, 0.4], [rD - 0.3, 0.4], [rD - 0.3, 0]], Y(9) - 0.4, 48);
  const r9 = F[9].slabA - 0.1, rp9 = Array.from({ length: 49 }, (_, i) => [Math.sin((i / 48) * Math.PI * 2) * r9, Math.cos((i / 48) * Math.PI * 2) * r9]);
  balusPath(acc, rp9, Y(9), { h: 1.05, desStep: 99 });
  for (let i = 0; i < 8; i++) { const t = ((3 * i + 1.5) / NP) * Math.PI * 2; potAFeu(acc, Math.sin(t) * r9, Y(9) + 1.1, Math.cos(t) * r9, 1.4, i + 1); }
  // ---------------- TẦNG 9: attic trên — cửa sổ chữ nhật, gờ đầu lớn mang Vọng Đài
  for (let i = 0; i < NP; i++) { const t = (i / NP) * Math.PI * 2, f = new Acc(); drumPanel(f, pwD, Y(9), ts.deck.y - 0.6, [isDoor(i) ? { kind: 'rect', x: 0, y0: Y(9), w: 2.4, h: 3.2, door: true } : { kind: 'rect', x: 0, y0: Y(9) + 1.0, w: 1.1, h: 2.2, glass: 'tileGlass4' }]); at(acc, f, rD, t); }
  const yd = ts.deck.y;
  ring(acc, 'stone', [[rD - 0.4, 0], [rD + 0.1, 0], [rD + 0.1, 0.25], [rD + 0.35, 0.35], [rD + 0.8, 0.6], [rD - 0.4, 0.6], [rD - 0.4, 0]], yd - 0.6, 64);
  // ---------------- VỌNG ĐÀI: vòng vòm mở 16 trụ (ngắm cảnh) + lan can thấp trong mỗi vòm
  const NA = 16, rA = rD - 0.15, wA = 2 * rA * Math.tan(Math.PI / NA), hA = 4.2;
  for (let i = 0; i < NA; i++) {
    const t = ((i + 0.5) / NA) * Math.PI * 2, f = new Acc(), h = { kind: 'arch', x: 0, y0: yd, w: wA - 1.3, h: 3.5, door: true };
    f.add('stone', slabHoles(rectPts(-wA / 2 - 0.02, yd, wA / 2 + 0.02, yd + hA), [archPts(0, yd, h.w, h.h)], 0, 0.7)); keystone(f, 0, yd + h.h + 0.03, 0, 0.4, 0.5, 0.15, true, 'carve');
    balus(f, -h.w / 2, h.w / 2, yd, -0.35, { h: 1.0, ends: false, geo: true, pitch: 0.32 });
    at(acc, f, rA, t);
  }
  ring(acc, 'stone', [[rA - 0.5, 0], [rA + 0.3, 0], [rA + 0.55, 0.3], [rA + 0.7, 0.55], [rA - 0.5, 0.55], [rA - 0.5, 0]], yd + hA, 64);
  // ---------------- VÒM CHÌ ovoid 12 múi, gân và trophée dát vàng; mắt vòm (oculus) cho lanternon
  const y0d = yd + hA + 0.55, Rd = rA + 0.35, Hd = 12.4, NS = 24;
  const prof = []; for (let i = 0; i <= NS; i++) { const u = i / NS, a = u * Math.PI / 2 * 0.92; prof.push([Rd * Math.cos(a) * (1 - 0.06 * Math.sin(2 * a)), Hd * Math.sin(a) / Math.sin(Math.PI / 2 * 0.92)]); }
  ring(acc, 'tileLead', prof, y0d, 64);                                                              // vỏ vòm (mặt hở hai phía)
  const topR = prof[prof.length - 1][0];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2, pts = prof.map(([r, h]) => V(Math.sin(t) * (r + 0.08), y0d + h + 0.08, Math.cos(t) * (r + 0.08)));
    for (let j = 0; j < pts.length - 1; j++) { const d = new THREE.Vector3().subVectors(pts[j + 1], pts[j]), g = new THREE.BoxGeometry(0.42, 0.22, d.length() + 0.05); g.lookAt(d); g.translate((pts[j].x + pts[j + 1].x) / 2, (pts[j].y + pts[j + 1].y) / 2, (pts[j].z + pts[j + 1].z) / 2); acc.add('gilt', g); }
    const tm = t + Math.PI / 12, [rq, hq] = prof[7]; trophy(acc, Math.sin(tm) * (rq - 0.1), y0d + hq - 0.6, Math.cos(tm) * (rq - 0.1), 2.6, i, tm, 'gilt');   // trophée giấu cửa mái
  }
  // ---------------- LANTERNON 8 cột Corinthian (mẫu Tháp Gió / lanternon Invalides) + vòm nhỏ + OBELISK + quả cầu + mặt trời Apollo
  const yl = y0d + Hd - 0.2;
  ring(acc, 'stone', [[0.001, 0], [topR + 0.4, 0], [topR + 0.4, 0.6], [0.001, 0.6]], yl, 24);
  for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2 + Math.PI / 8; column(acc, 'corinthian', Math.sin(t) * (topR - 0.2), yl + 0.6, Math.cos(t) * (topR - 0.2), 4.2, 0.42, { seg: 8, ry: t, capKey: 'gilt' }); }
  acc.add('tileGlassR', cyl(topR - 0.75, topR - 0.75, 4.0, 0, yl + 0.6, 0, 16));
  ring(acc, 'stone', [[0.001, 0], [topR + 0.2, 0], [topR + 0.2, 0.6], [topR + 0.5, 0.8], [topR + 0.55, 1.05], [0.001, 1.05]], yl + 4.8, 24);
  acc.add('gilt', lathe([[0.001, 0], [topR + 0.2, 0], [topR * 0.95, 0.6], [topR * 0.6, 1.4], [topR * 0.35, 1.7], [0.45, 2.0], [0.001, 2.05]], 0, yl + 5.85, 0, 16));
  const yo = yl + 7.9; acc.add('gold', boxB(0.9, 0.4, 0.9, 0, yo, 0)); acc.add('gold', (() => { const g = new THREE.CylinderGeometry(0.12, 0.38, 4.2, 4, 1); g.rotateY(Math.PI / 4); g.translate(0, yo + 0.4 + 2.1, 0); return g; })());
  acc.add('gold', new THREE.SphereGeometry(0.42, 12, 8).translate(0, yo + 5.0, 0));
  const sun = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 0.55 : 1.05; sun.push([Math.cos(a) * r, Math.sin(a) * r]); } acc.add('gold', slabXY(sun, 0.12, 0, yo + 6.2, 0));
  finishUV(acc);
  return { acc, info: { W: 2 * pa, D: 2 * pa, PW: 2 * pa, PD: 2 * pa + P.run, ph: P.y, eave: yd, top: yo + 7.3, n: ts.n, floors: F.length, kind: 'tower', ovr: TOWER_OVR } };
}
