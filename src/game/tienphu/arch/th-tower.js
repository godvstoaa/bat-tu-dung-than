// ============================================================================
//  LẦU 10 TẦNG PHONG CÁCH THÁI — vỏ ngoài dựng từ towerSpec của game (tower.js), theo 08-thai.md › tower §8:
//  · một họ chóp duy nhất (busabok / prasat của Dusit) — không đặt ngọn prang lên thân prasat (A7.5)
//  · 3 cấp lùi kiểu Loha Prasat / sân đi vòng kiểu prang Wat Arun: cấp 1 tầng 1–4 (34 m) · cấp 2 tầng 5–7 (26 m) ·
//    cấp 3 tầng 8–10 (20 m — nghiên cứu đề xuất 19 m, nâng lên 20 m để đạt điều kiện 2a ≥ 20 m của game)
//  · mỗi cấp: hành lang cột 12 góc có mái hiên (sân đi vòng), diềm mái vòng ở chân sân trên có mukh hồi + chofa giữa mỗi mặt,
//    tượng đỡ dưới diềm (dạ xoa · khỉ · thiên thần — Wat Arun), chóp busabok 5 tầng ở 4 góc
//  · tầng 10 = Dusit thu nhỏ: 4 mukh hồi nhiều lớp quay 4 hướng; Vọng Đài có đình prasat mở, chóp 7 tầng (maha prasat), Garuda đỡ
//  Khung cục bộ lầu: gốc = tâm lầu trên mặt đảo, +z = mặt tiền; vách ở apothem a (dày WALL_T), cửa 2,4 m như va chạm game.
// ============================================================================
import * as THREE from 'three';
import {
  Acc, box, boxB, beam, V, xf, mRY, thColumn, thPlinth, thStair, thBalustrade, thRoof, thRoofX, ringRoof, wallRun, bracket, thSpire, redent, redentPts, prism, figure, ATLAS, GARUDA,
} from './th-kit.js';
import { columnRing, DOOR_W, WALL_T } from '../tower.js';

/** bản ghi đè lầu Thái (báo lại để áp vào styles.js › thai.tower) */
export const TH_TOWER = { n: 4, a: [17, 17, 17, 17, 13, 13, 13, 10, 10, 10], podium: 2.85, gal: [0, 4, 7, 9], setback: true };
const SIDES = [[0, 1], [1, 0], [0, -1], [-1, 0]];

export function thTower(ts, { tile = 'Green', border = 'Orange' } = {}) {
  const acc = new Acc(), FH = ts.FH, P = ts.podium, F = ts.floors, T = WALL_T;
  // ---- bệ vuông 46,8 m cao 2,85 m (Dusit): gờ sư tử + gờ bát, băng Garuda quặp Naga, bậc mặt trước lan can Naga 5 đầu
  thPlinth(acc, { W: 2 * P.a, D: 2 * P.a, h: P.y, garuda: 1.6, stairs: [], plat: false });
  thStair(acc, { side: 1, c: 0, w: P.stairW, W: 2 * P.a, D: 2 * P.a, h: P.y, tread: P.tread });
  const pa = P.a - 0.25, sw = P.stairW / 2 + 0.25;
  thBalustrade(acc, [[-sw, pa], [-pa, pa], [-pa, -pa], [pa, -pa], [pa, pa], [sw, pa]], P.y, { h: 1.1, step: 2.4 });
  const ATL = ['gold', 'gold', 'gold'];
  F.forEach((f, k) => {
    const a = f.a, y = f.y, H = FH - 0.4, nf = F[k + 1], lvlTop = !nf || nf.a < a || nf.gal;
    // sàn (tầng trên mặt bệ đã có), viền gờ bát
    if (k) { acc.add('floor', boxB(2 * f.slabA, 0.4, 2 * f.slabA, 0, y - 0.4, 0)); acc.add('gold', boxB(2 * f.slabA + 0.12, 0.14, 2 * f.slabA + 0.12, 0, y - 0.3, 0)); }
    // ---- vách 4 mặt: cửa giữa (trước nếu tầng 1 / có hành lang; sau nếu có hành lang), cửa sổ khung hồi nhọn, trụ ốp
    for (const [nx, nz] of SIDES) {
      const front = nz > 0, back = nz < 0, door = (front && (k === 0 || f.gal)) || (back && f.gal);
      const L = 2 * a + T, nw = Math.max(3, Math.round((2 * a) / 5.6)) | 1, ops = [];
      for (let i = 0; i < nw; i++) { const u = -a + (2 * a * (i + 0.5)) / nw; if (Math.abs(u) < 1.6 && door) continue; ops.push({ u, w: 1.5, y: 0.9, h: 2.3, kind: 'win', frame: 'sumS' }); }
      if (door) ops.push({ u: 0, w: DOOR_W, y: 0, h: 3.0, kind: 'door', frame: 'sumS', leaf: 'open' });
      xf(acc, mRY(Math.atan2(nx, nz), nx * a, 0, nz * a), (g) => { wallRun(g, { L, y0: y, H, T, openings: ops, key: 'wall', shutter: 'shutter', pil: 0 }); for (let i = 0; i <= nw; i++) { const u = -a + (2 * a * i) / nw; if (door && Math.abs(u) < 2) continue; g.add('wallShade', prism(redentPts(0.38, 0.2), H - 0.5, u, y, T / 2)); } });
    }
    // góc lõm 12 góc (ย่อมุมไม้สิบสอง) ở 4 góc thân
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) acc.add('wallShade', prism(redentPts(0.75, 0.2), H, sx * a, y, sz * a));
    // gờ đầu tường mỗi tầng
    acc.add('gold', boxB(2 * a + 1.0, 0.18, 2 * a + 1.0, 0, y + H - 0.5, 0)); acc.add('wallShade', boxB(2 * a + 0.9, 0.32, 2 * a + 0.9, 0, y + H - 0.32, 0));
    // ---- hành lang cột (sân đi vòng): cột 12 góc đúng vị trí va chạm game (columnRing), xà, mái hiên từ vách ra ngoài
    if (f.gal) {
      const ring = columnRing(ts.n, f.slabA - 0.7, ts.colStep), yIn = y + H - 0.1, ao = f.slabA + 0.9, pe = 0.3, yOut = yIn - pe * (ao - a);
      const cTop = yIn - pe * (f.slabA - 0.7 - a) - 0.45;
      for (const [x, z] of ring) { thColumn(acc, x, z, y, cTop - y - 0.35, 0.62, 'colG'); acc.add('gold', boxB(0.8, 0.35, 0.8, x, cTop - 0.35, z)); }
      const ca = f.slabA - 0.7;
      for (const [nx, nz] of SIDES) xf(acc, mRY(Math.atan2(nx, nz)), (g) => { g.add('gold', boxB(2 * ca + 0.6, 0.42, 0.5, 0, cTop - 0.05, ca)); g.add('ceil', boxB(2 * ca, 0.34, 0.34, 0, cTop - 0.38, ca)); });
      ringRoof(acc, { ax: a - 0.1, az: a - 0.1, bx: ao, bz: ao, yIn, yOut, tile, border });
      acc.add('ceil', boxB(2 * ca, 0.08, 2 * ca, 0, cTop + 0.42, 0));
      for (const [x, z] of ring) { const nx = Math.abs(Math.abs(x) - ca) < 0.05 ? Math.sign(x) : 0, nz = nx ? 0 : Math.sign(z); bracket(acc, x + nx * 0.32, cTop - 1.3, z + nz * 0.32, nx, nz, 0.8, 1.1); }
      if (k !== F.length - 1) for (const [nx, nz] of SIDES) xf(acc, mRY(Math.atan2(nx, nz)), (g) => thRoof(g, { hw: 2.5, p: 0.95, son: 1, yBase: yOut + 0.45, tile, border, zMain: [a - 0.3, ao + 0.45], backFace: false, chofaH: 1.1, pedBot: cTop + 0.05, pedFixed: true, scale: 0.75 }));
      // tầng 10 (Dusit thu nhỏ): 4 mukh hồi nhiều lớp quay 4 hướng, nóc từ vách ra ngoài hành lang
      if (k === F.length - 1) for (const [nx, nz] of SIDES) xf(acc, mRY(Math.atan2(nx, nz)), (g) => thRoof(g, { hw: 4.2, p: 1.05, son: 2, nMain: 1, eaveL: 0.9, eaveR: 0.9, yBase: yIn - 0.9, tile, border, zMain: [a - 0.4, ao - 1.2], lotsF: { n: 2, len: 0.9, drop: 0.75 }, chofaH: 1.5, pedBot: cTop + 0.1, pedFixed: true, scale: 0.85 }));
    }
    // ---- diềm mái vòng ở chân sân cấp trên + mukh hồi giữa mỗi mặt + tượng đỡ + chóp busabok 4 góc (cấp 1, 2, 3)
    if (nf && nf.gal && k !== 0) {
      const lv = nf.a < a ? (a === 17 ? 0 : 1) : 2, ai = Math.max(a, nf.slabA) - 0.05, ao = ai + 2.2, yIn = nf.y - 0.45, yOut = yIn - 0.55 * (ao - ai);
      ringRoof(acc, { ax: ai, az: ai, bx: ao, bz: ao, yIn, yOut, tile, border });
      // tượng đỡ trên gờ bát dưới diềm: dạ xoa (cấp 1) · khỉ (cấp 2) · thiên thần (cấp 3) — Wat Arun
      for (const [nx, nz] of SIDES) for (let u = -a + 1.6; u <= a - 1.5; u += 2.4) { if (Math.abs(u) < 3.2) continue; const x = nz ? u : nx * (a + 0.3), z = nz ? nz * (a + 0.3) : u; figure(acc, ATL[lv], ATLAS, x, yIn - 1.95, z, 1.7 - lv * 0.2, nx, nz, 0.16); }
      for (const [nx, nz] of SIDES) { xf(acc, mRY(Math.atan2(nx, nz)), (g) => { g.add('wallShade', boxB(2 * a + 0.8, 0.26, 0.7, 0, yIn - 2.0, a + 0.1)); thRoof(g, { hw: 2.6, p: 0.8, son: 1, yBase: yOut + 0.35, tile, border, zMain: [ai - 0.2, ao + 0.5], backFace: false, chofaH: 1.0, pedBot: yOut - 0.3, pedFixed: true, scale: 0.7 }); }); }
      // chóp busabok trên diềm: 4 góc + giữa mỗi nửa cạnh (cấp 1, 2) — dãy chóp kiểu Loha Prasat (24 / 12 chóp)
      const sc = ai + 1.1, sb = 0.95 - lv * 0.12, top = yIn + 7.0 - lv * 1.2, spots = [];
      for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) spots.push([sx * sc, sz * sc, sb, top]);
      if (lv < 2) for (const [nx, nz] of SIDES) for (const t of [-0.55, 0.55]) { const u = t * ai; spots.push([nz ? u : nx * sc, nz ? nz * sc : u, sb * 0.7, top - 1.6]); }
      for (const [x, z, b, tp] of spots) { acc.add('wall', redent(b * 1.25, yIn - yOut + 0.6, x, yOut - 0.2, z)); thSpire(acc, { x, y: yIn + 0.4, z, b, H: tp - yIn - 0.4, tiers: 5, style: 'mondop' }); }
    } else if (nf && !lvlTop) { // dải gờ giữa các tầng trong một cấp: gờ bát vàng + hàng cánh sen
      acc.add('wallShade', boxB(2 * a + 1.3, 0.22, 2 * a + 1.3, 0, nf.y - 0.4, 0)); acc.add('gold', boxB(2 * a + 1.1, 0.16, 2 * a + 1.1, 0, nf.y - 0.18, 0));
    }
  });
  // ---- Vọng Đài: sàn mở + lan can trắng (đúng vòng va chạm), đình prasat mở 4 cụm cột góc, mái chữ thập, chóp 7 tầng Garuda đỡ
  const D = ts.deck, top = D.y;
  acc.add('floor', boxB(2 * (D.a + 0.25), 0.4, 2 * (D.a + 0.25), 0, top - 0.4, 0)); acc.add('gold', boxB(2 * D.a + 0.7, 0.16, 2 * D.a + 0.7, 0, top - 0.3, 0));
  thBalustrade(acc, [[-D.a, D.a], [D.a, D.a], [D.a, -D.a], [-D.a, -D.a], [-D.a, D.a]], top, { h: 1.05, step: 2.5 });
  const ap = 7.2, ch = 3.4, cols = [];
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) cols.push([sx * ap, sz * ap], [sx * (ap - 1.1), sz * ap], [sx * ap, sz * (ap - 1.1)]);
  for (const [x, z] of cols) { thColumn(acc, x, z, top, ch, 0.55, 'colG'); acc.add('gold', boxB(0.75, 0.35, 0.75, x, top + ch, z)); }
  for (const [nx, nz] of SIDES) xf(acc, mRY(Math.atan2(nx, nz)), (g) => { g.add('gold', boxB(2 * ap + 0.6, 0.45, 0.5, 0, top + ch + 0.3, ap)); g.add('ceil', boxB(2 * ap, 0.35, 0.36, 0, top + ch - 0.05, ap)); });
  acc.add('ceil', boxB(2 * ap, 0.1, 2 * ap, 0, top + ch + 0.75, 0));
  const yB = top + ch + 1.1, hw = 3.6, Rc = { hw, p: 1.0, son: 2, nMain: 1, eaveL: 1.0, eaveR: 1.0, yBase: yB, tile, border, zMain: [-ap + 0.6, ap - 0.6], lotsF: { n: 2, len: 0.9, drop: 0.8 }, lotsB: { n: 2, len: 0.9, drop: 0.8 }, chofaH: 1.6, pedBot: top + ch + 0.8, pedFixed: true, scale: 0.85 };
  const rz = thRoof(acc, Rc); thRoofX(acc, Rc);
  for (const [nx, nz] of SIDES) for (const s of [-1, 1]) bracket(acc, nz ? s * (ap - 0.5) : nx * ap, top + ch - 0.9, nz ? nz * ap : s * (ap - 0.5), nx, nz, 0.9, 1.2);
  const yS = rz.yR - 0.4, b = 2.6, topAll = 71;
  acc.add('gold', redent(b * 1.05, yS - yB + 0.6, 0, yB - 0.6, 0));
  thSpire(acc, { y: yS, b, H: topAll - yS, tiers: 7, sup: 'garuda' });
  return { acc, info: { W: 2 * P.a, D: 2 * P.a, PW: 2 * P.a, PD: 2 * P.a + P.run, ph: P.y, top: topAll, n: ts.n, floors: F.length, kind: 'tower' } };
}
