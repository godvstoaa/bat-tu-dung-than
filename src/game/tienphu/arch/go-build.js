// ============================================================================
//  BỘ DỰNG GOTHIC ANH THEO LOẠI HÌNH — docs/tienphu-nghiencuu/04-gothic.md. Mỗi hàm nhận đặc tả (spec-go.js) và trả { acc, info }.
//  Loại hình: hallH (đại sảnh chữ H), chapel (nhà nguyện cung điện 2 tầng), kitchen (tháp bếp + dãy kho), solar (khối 3 tầng + tháp vệ sinh),
//  lodging (dãy phòng: nhà khách / doanh trại / thư các), mews (chuồng đá + khung gỗ), roundTower (tháp tròn / đài canh),
//  stand (khán đài gỗ đấu thương), arbour (giàn vườn quả), keep (lầu 10 tầng — thân đa giác giật cấp, 3 tháp canh).
//  Khung cục bộ: gốc = tâm mặt bằng trên mặt đất, +z = mặt tiền, x = bề ngang.
// ============================================================================
import * as THREE from 'three';
import {
  Acc, Fr, box, boxB, cyl, beam, lathe, ribAlong, V, ext, extU, prism, polyCyl, pverts, psides, archPts, apexOf, outline, foil,
  wallFace, openingParts, freeSpans, stringProf, plinthProf, buttress, pinnacle, crenelRun, crenelRing, crenelPoly, annulus,
  gableRoof, pyramidRoof, finialAt, eaveCourse, quoins, chimney, silh, EAGLE, LION, CREN, finishUV, holeOf, traceryHoles,
} from './go-kit.js';

const PI = Math.PI, TP50 = Math.tan((50 * PI) / 180);

// ---------------------------------------------------------------- tiện ích
function infoOf(acc, o) {
  const bb = new THREE.Box3(); for (const l of acc.parts.values()) for (const g of l) { g.computeBoundingBox(); bb.union(g.boundingBox); }
  return { PW: +(2 * Math.max(-bb.min.x, bb.max.x)).toFixed(1), PD: +(2 * Math.max(-bb.min.z, bb.max.z)).toFixed(1), top: +bb.max.y.toFixed(1), ...o };
}
/** bậc đá ra ngoài mặt tường (khung mặt Ff) trước cửa u, rộng w, lên cao h; khai mặt đi được */
function stepsOut(Ff, acc, key, { u, w, t, h, tread = 0.32, w0 = null }) {
  if (h <= 0.05) return;
  const n = Math.max(2, Math.round(h / 0.165)), rise = h / n, s0 = w0 ?? t / 2 + 0.25;
  for (let i = 0; i < n; i++) { const z = s0 + tread * (n - i - 0.5); Ff.add(acc, key, boxB(w, rise * (i + 1), tread, u, 0, z)); Ff.plat(acc, { x: u, z, w, d: tread + 0.02, top: rise * (i + 1) }); }
  Ff.plat(acc, { x: u, z: 0, w, d: t + 0.6, top: h });
}
const op = (u, w, y0, ys, o = {}) => ({ u, w, y0, ys, ...o });
/** khung mặt tường của khối chữ nhật L × D (khung F tại tâm) */
function faceFrames(F, L, D, t) {
  const h = D / 2;
  return {
    front: { F: F.sub(0, h - t / 2, 0), u0: -L / 2, u1: L / 2, full: L },
    back: { F: F.sub(0, -(h - t / 2), PI), u0: -L / 2, u1: L / 2, full: L },
    right: { F: F.sub(L / 2 - t / 2, 0, PI / 2), u0: -(h - t), u1: h - t, full: D },
    left: { F: F.sub(-(L / 2 - t / 2), 0, -PI / 2), u0: -(h - t), u1: h - t, full: D },
  };
}

// ---------------------------------------------------------------- KHỐI NHÀ MỘT NHỊP (range) — dùng chung
/**
 * o: { L, D, t, eave (cao đỉnh tường), ph (cao sàn), pitch, c (mã đá), roof (khoá mái), ends: [trái −x, phải +x] ∈ 'coped'|'verge'|'abut',
 *      ops: { front, back, left, right: [ô mở] }, butt: { front|back|left|right: [u], d, bw, h, stages, pin }, strings: [y], floors: [y],
 *      quoins, corbels, chim: [{ face, u, yTop, y0, oct }], finial, skip: [mặt bỏ], steps: false, gableKey, ov }
 */
export function range(F, acc, o) {
  const c = o.c, key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, { L, D, t = 1, eave, ph = 0.8, pitch = 50, ov = 0.4 } = o, h = D / 2;
  const ends = o.ends || ['coped', 'coped'], skip = o.skip || [], ops = o.ops || {}, P = pitch * PI / 180, tp = Math.tan(P), th = 0.28, tv = th / Math.cos(P);
  const fr = faceFrames(F, L, D, t), endOf = { left: ends[0], right: ends[1] };
  const rise = 0.32, gf = (u) => eave + tv + rise + (h - Math.abs(u)) * tp, yA = gf(0);
  for (const [nm, f] of Object.entries(fr)) {
    if (skip.includes(nm) || endOf[nm] === 'abut') continue;
    const e = endOf[nm], my = ops[nm] || [];
    let top = eave;
    if (e === 'coped') top = [[f.u1, eave], [h, eave], [h, gf(h)], [0, yA], [-h, gf(-h)], [-h, eave], [f.u0, eave]];
    if (e === 'verge') top = [[f.u1, eave], [h, eave], [0, eave + h * tp], [-h, eave], [f.u0, eave]];
    wallFace(f.F, acc, { key: e === 'verge' && o.gableKey ? o.gableKey : key, dress, u0: f.u0, u1: f.u1, top, t, ops: my });
    // chân tường giật vát
    const ex = nm === 'front' || nm === 'back' ? 0.25 : t; f.F.add(acc, base, extU(plinthProf(t, ph + 0.1), f.u0 - ex, f.u1 + ex));
    // gờ chỉ
    for (const y of o.strings || []) for (const [a, b] of freeSpans(f.u0 - (ex > 0.3 ? t : 0.25), f.u1 + (ex > 0.3 ? t : 0.25), y, my)) f.F.add(acc, dress, extU(stringProf(t, y), a, b));
    if (e === 'coped') { // đá lợp hồi + đá chân hồi + hoa đầu hồi
      const e2 = 0.14, ct = 0.3, cs = ct / Math.cos(P), ye = yA - (h + e2) * tp;
      f.F.add(acc, dress, ext([[-h - e2, ye], [0, yA], [h + e2, ye], [h + e2, ye + cs], [0, yA + cs], [-h - e2, ye + cs]], null, t + 0.2, -(t + 0.2) / 2));
      for (const s of [-1, 1]) f.F.add(acc, dress, boxB(0.75, 0.55, t + 0.26, s * (h - 0.25), gf(h) - 0.42, 0));
      finialAt(f.F, acc, dress, 0, yA + cs - 0.05, 0, o.finial || 'pin');
    }
    if (o.quoins) { const half = f.full / 2; quoins(f.F, acc, dress, { uEdge: -half, s: 1, y0: ph + 0.4, y1: eave, t }); quoins(f.F, acc, dress, { uEdge: half, s: -1, y0: ph + 0.4, y1: eave, t }); }
    if ((nm === 'front' || nm === 'back') && o.eaveCourse !== false) eaveCourse(f.F, acc, dress, { u0: f.u0, u1: f.u1, y: eave, t, corbels: !!o.corbels });
    if (o.steps !== false) for (const q of my) if (q.door && !q.noSteps && q.y0 <= ph + 0.05) stepsOut(f.F, acc, base, { u: q.u, w: q.w + 0.8, t, h: ph });
    const B = o.butt; if (B && B[nm]) for (const u of B[nm]) buttress(f.F, acc, key, dress, { u, t, d: B.d, bw: B.bw, h: B.h, stages: B.stages || 2, pin: B.pin || 0 });
  }
  for (const ch of o.chim || []) chimney(fr[ch.face].F, acc, key, dress, { u: ch.u, t, yE: eave, yTop: ch.yTop, y0: ch.y0 || 0, oct: ch.oct !== false, bw: ch.bw || 1.8, d: ch.d || 0.9 });
  // mái
  const xEnd = (e, s) => (e === 'coped' ? s * (L / 2 - t / 2) : e === 'verge' ? s * (L / 2 + ov) : s * L / 2);
  const r = gableRoof(F, acc, o.roof || 'slate', { xl: xEnd(ends[0], -1), xr: xEnd(ends[1], 1), D, yE: eave, pitch, ov, th, ridgeKey: o.ridgeKey || 'ridge' });
  // sàn
  F.add(acc, 'floor', boxB(L - 2 * t + 0.1, 0.3, D - 2 * t + 0.1, 0, ph - 0.3, 0)); F.plat(acc, { x: 0, z: 0, w: L - 2 * t, d: D - 2 * t, top: ph });
  for (const y of o.floors || []) F.add(acc, 'oak', boxB(L - 2 * t + 0.1, 0.3, D - 2 * t + 0.1, 0, y - 0.3, 0));
  return { yRidge: r.yRidge, yTop: yA + 0.4, tp, tv, eave };
}

/** KHỐI THÁP / HIÊN CHỮ NHẬT (mái bằng chì sau lan can răng cưa, hoặc mái chóp): o.top = 'crenel' | 'pyramid' */
export function blockTower(F, acc, o) {
  const c = o.c, key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, { W, D, t = 1, h, ph = 0.8 } = o, skip = o.skip || [], ops = o.ops || {};
  const fr = faceFrames(F, W, D, t);
  for (const [nm, f] of Object.entries(fr)) {
    if (skip.includes(nm)) continue; const my = ops[nm] || [];
    wallFace(f.F, acc, { key, dress, u0: f.u0, u1: f.u1, top: h, t, ops: my });
    const ex = nm === 'front' || nm === 'back' ? 0.25 : t; f.F.add(acc, base, extU(plinthProf(t, (o.plinthH ?? ph) + 0.1), f.u0 - ex, f.u1 + ex));
    for (const y of o.strings || []) for (const [a, b] of freeSpans(f.u0 - (ex > 0.3 ? t : 0.25), f.u1 + (ex > 0.3 ? t : 0.25), y, my)) f.F.add(acc, dress, extU(stringProf(t, y), a, b));
    if (o.steps !== false) for (const q of my) if (q.door && q.y0 <= ph + 0.05 && ph > 0.1) stepsOut(f.F, acc, base, { u: q.u, w: q.w + 0.8, t, h: ph });
    if (o.top === 'crenel') { f.F.add(acc, dress, extU(stringProf(t, h - 0.3, 0.2, 0.3), f.u0 - (ex > 0.3 ? t : 0.2), f.u1 + (ex > 0.3 ? t : 0.2))); crenelRun(f.F, acc, key, dress, { u0: -f.full / 2, u1: f.full / 2, y: h, wc: t / 2 - CREN.pt / 2 }); }
    if (o.quoins) { quoins(f.F, acc, dress, { uEdge: -f.full / 2, s: 1, y0: ph + 0.4, y1: h - 0.4, t }); quoins(f.F, acc, dress, { uEdge: f.full / 2, s: -1, y0: ph + 0.4, y1: h - 0.4, t }); }
    const B = o.butt; if (B && B[nm]) for (const u of B[nm]) buttress(f.F, acc, key, dress, { u, t, d: B.d, bw: B.bw, h: B.h, stages: B.stages || 2 });
  }
  if (o.top === 'crenel') F.add(acc, 'lead', boxB(W - 2 * t + 0.4, 0.2, D - 2 * t + 0.4, 0, h - 0.2, 0));
  F.add(acc, 'floor', boxB(W - 2 * t + 0.1, 0.3, D - 2 * t + 0.1, 0, ph - 0.3, 0)); if (o.plat !== false) F.plat(acc, { x: 0, z: 0, w: W - 2 * t, d: D - 2 * t, top: ph });
  for (const y of o.floors || []) F.add(acc, 'oak', boxB(W - 2 * t + 0.1, 0.3, D - 2 * t + 0.1, 0, y - 0.3, 0));
  return { top: o.top === 'crenel' ? h + CREN.bh + CREN.mh : h };
}

/** đèn lồng thoát khói (louvre) bát giác gỗ có nan chớp + mũ chì + chong chóng */
function louvre(F, acc, { a, y, h, cap, key = 'oak', capKey = 'lead', vane = true }) {
  const vs = pverts(8, a);
  for (const [x, z] of vs) F.add(acc, key, boxB(0.18, h, 0.18, x, y, z));
  for (const s of psides(8, a)) { const f = F.sub(s.mx, s.mz, s.ry); for (let i = 0; i < 4; i++) { const g = box(s.len - 0.1, 0.06, 0.32, 0, 0, 0); g.rotateX(-0.6); g.translate(0, y + 0.35 + (i * (h - 0.6)) / 3.2, 0); f.add(acc, key, g); } f.add(acc, 'dark', boxB(s.len - 0.05, h - 0.2, 0.04, 0, y + 0.1, -0.25)); f.add(acc, key, boxB(s.len, 0.14, 0.24, 0, y + h - 0.1, 0)); }
  F.add(acc, key, polyCyl(8, a + 0.1, a + 0.1, 0.25, 0, y - 0.25, 0));
  const yA = y + h + cap; pyramidRoof(F, acc, capKey, { n: 8, a: a + 0.35, y: y + h, yA, th: 0.12 });
  if (!vane) return yA;
  F.add(acc, 'iron', cyl(0.04, 0.03, 1.4, 0, yA - 0.1, 0, 6)); F.add(acc, 'gold', ext([[0, 0], [0.7, 0.15], [0.7, 0.35], [0, 0.4]], null, 0.03, -0.015).translate(0, yA + 0.9, 0));
  return yA + 1.4;
}

// ---------------------------------------------------------------- ĐẠI SẢNH CHỮ H (Penshurst Baron's Hall + hai cánh ngang)
export function hallH(s) {
  const acc = new Acc(), F = Fr.at(), ph = s.ph, H = s.hall, Wg = s.wing, c = s.c;
  const hw = H.L / 2, hd = H.D / 2, t = H.t, eave = ph + H.eaveH, bay = H.L / H.bays;
  const bayC = Array.from({ length: H.bays }, (_, i) => -hw + bay * (i + 0.5)), bounds = Array.from({ length: H.bays - 1 }, (_, i) => -hw + bay * (i + 1));
  const win = (u) => op(u, H.win.w, ph + H.win.y0, ph + H.win.ys, { tr: { n: 2, cusp: 3, transom: 0.42, oc: 4 } });
  const porchU = bayC[0];
  // mặt trước: cửa sổ cao bay 2…n, cửa giữa (yêu cầu game) dưới ô cửa sổ ngắn, cửa vào lối bình phong sau cổng hiên
  const front = [], back = [];
  for (const u of bayC.slice(1)) { if (Math.abs(u) < 0.1) { front.push(op(0, s.door.w, ph, ph + s.door.ys, { door: true, head: 'equi' })); front.push(op(0, H.win.w, ph + s.door.ys + apexOf(s.door.w) + 1.0, ph + H.win.ys, { tr: { n: 2, cusp: 3, oc: 4 } })); } else front.push(win(u)); }
  front.push(op(porchU, 2.4, ph, ph + 3.2, { door: true, noSteps: true }));
  for (const u of bayC.slice(1)) back.push(win(-u));
  back.push(op(-porchU, 2.0, ph, ph + 2.8, { door: true }));                                       // cửa bắc lối bình phong
  const hall = range(F, acc, { L: H.L, D: H.D, t, eave, ph, c, roof: 'roofHall', ends: ['coped', 'coped'], ops: { front, back }, corbels: true,
    butt: { front: bounds, back: bounds, d: 1.3, bw: 1.0, h: eave - 1.2, stages: 2 }, strings: [ph + H.win.y0 - 0.45], finial: 'cross' });
  // đèn lồng thoát khói giữa nóc (trên lò sưởi giữa sàn)
  F.add(acc, 'lead', boxB(2.9, 0.6, 2.9, 0, hall.yRidge - 0.6, 0));
  const lvTop = louvre(F, acc, { a: H.louvre.a, y: hall.yRidge, h: H.louvre.h, cap: 1.2 });
  // vì kèo gỗ hạt dẻ lộ (arch-braced collar) ở mỗi ranh gian — thấy trong mặt cắt
  const zi = hd - t, yRi = hall.yRidge - 0.6;
  for (const x of bounds) {
    for (const sz of [-1, 1]) { acc.add('chestnut', beam(V(x, eave - 0.2, sz * zi), V(x, yRi, 0), 0.3, 0.35)); acc.add('chestnut', boxB(0.3, 3.2, 0.3, x, eave - 3.4, sz * (zi - 0.15))); acc.add('chestnut', boxB(0.4, 0.5, 0.6, x, eave - 3.9, sz * (zi - 0.2)));
      const pts = [], Hb = 3.2 + (yRi - eave) * 0.62; for (let i = 0; i <= 8; i++) { const a = (i / 8) * (PI / 2); pts.push(V(x, eave - 3.2 + Math.sin(a) * Hb, sz * (2.0 + (zi - 0.2 - 2.0) * Math.cos(a)))); } acc.add('chestnut', ribAlong(pts, 0.26, 0.3)); }
    acc.add('chestnut', boxB(0.3, 0.32, 2 * 2.2, x, eave + (yRi - eave) * 0.62 - 0.16, 0));
  }
  // nội thất: lò sưởi bát giác giữa sàn, bục (dais) đầu trên, bình phong + ban công nhạc công đầu dưới
  F.add(acc, 'dressS', polyCyl(8, 1.1, 1.1, 0.25, 0, ph, 0)); F.add(acc, 'dark', polyCyl(8, 0.7, 0.7, 0.05, 0, ph + 0.25, 0));
  F.add(acc, 'oak', boxB(2.4, 0.35, H.D - 2 * t, hw - t - 1.2, ph, 0)); F.plat(acc, { x: hw - t - 1.2, z: 0, w: 2.4, d: H.D - 2 * t, top: ph + 0.35 });
  F.add(acc, 'oak', boxB(1.0, 0.8, 5, hw - t - 1.4, ph + 0.35, 0));                                  // bàn chính
  const xs = -hw + t + 3.4; for (const [z0, z1] of [[-hd + t, -1.6], [-0.4, 0.4], [1.6, hd - t]]) F.add(acc, 'oak', boxB(0.25, 3.4, z1 - z0, xs, ph, (z0 + z1) / 2)); // bình phong 2 lối
  F.add(acc, 'oak', boxB(0.25, 0.6, H.D - 2 * t, xs, ph + 2.8, 0)); F.add(acc, 'oak', boxB(3.2, 0.3, H.D - 2 * t, xs - 1.6, ph + 3.4, 0)); F.add(acc, 'oak', boxB(0.15, 1.0, H.D - 2 * t, xs + 0.05, ph + 3.7, 0)); // ban công nhạc công
  // hai cánh ngang (cross-wing): phục vụ (−x) và solar (+x) — nóc dọc z, đầu hồi đá ra mặt tiền
  for (const sx of [-1, 1]) {
    const Fw = F.sub(sx * (hw + Wg.D / 2), Wg.dz || 0, PI / 2), we = ph + Wg.eaveH, f1 = ph + Wg.f1, isSolar = sx > 0;
    const gFront = isSolar
      ? [op(0, 1.5, ph + 1.1, ph + 2.7, { head: 'square', tr: { n: 2, cusp: 3 } }), op(0, 2.8, f1 + 0.7, f1 + 3.0, { tr: { n: 3, cusp: 3, oc: 4 } }), op(0, 0.7, we + 1.6, we + 3.0, { tr: { n: 1, cusp: 3 } })]
      : [op(-2.6, 1.4, ph + 1.1, ph + 2.7, { head: 'square', tr: { n: 2, cusp: 3 } }), op(2.4, 1.6, ph, ph + 2.2, { door: true }), op(0, 1.9, f1 + 0.7, f1 + 2.5, { tr: { n: 2, cusp: 3, oc: 3 } }), op(0, 0.7, we + 1.6, we + 3.0, { tr: { n: 1, cusp: 3 } })];
    const gBack = [op(0, 1.6, f1 + 0.8, f1 + 2.5, { tr: { n: 2, cusp: 3, oc: 3 } }), op(0, 1.2, ph + 1.2, ph + 2.6, { head: 'square', tr: { n: 2 } })];
    const outer = [op(-4.5, 1.4, f1 + 0.9, f1 + 2.6, { tr: { n: 2, cusp: 3, oc: 3 } }), op(4.5, 1.4, f1 + 0.9, f1 + 2.6, { tr: { n: 2, cusp: 3, oc: 3 } }), op(-4.5, 0.18, ph + 1.2, ph + 2.6, { slit: true }), op(4.5, 0.18, ph + 1.2, ph + 2.6, { slit: true })];
    // trong khung cánh: trái (−x cục bộ) = mặt tiền thế giới (+z); trước cục bộ (+z) = thế giới ±x (phía ngoài với cánh +x)
    const ops = sx > 0 ? { left: gFront, right: gBack, front: outer } : { left: gFront, right: gBack, back: outer };
    const chim = isSolar ? [{ face: 'front', u: 0, yTop: we + Wg.D / 2 * TP50 + 2.2 }] : [{ face: 'back', u: 6.5, yTop: we + Wg.D / 2 * TP50 + 1.8 }];
    if (!isSolar) ops.back = (ops.back || []).filter((q) => Math.abs(q.u - 6.5) > 1.5);
    range(Fw, acc, { L: Wg.L, D: Wg.D, t: 1.0, eave: we, ph, c, roof: 'roofHall', ends: ['coped', 'coped'], ops, floors: [f1], strings: [f1 + 0.1], quoins: true, finial: 'pin', chim,
      butt: { left: [-Wg.D / 2 + 0.5, Wg.D / 2 - 0.5], d: 0.9, bw: 0.9, h: we - 1.5, stages: 2 } });
  }
  // cổng hiên 2 tầng ở đầu dưới (cạnh cánh phục vụ), mái chì sau lan can răng cưa
  const Pc = s.porch, Fp = F.sub(porchU, hd + Pc.D / 2 - 0.3, 0);
  blockTower(Fp, acc, { W: Pc.W, D: Pc.D + 0.6, t: 0.8, h: ph + Pc.h, ph, c, top: 'crenel', skip: ['back'], strings: [ph + 3.7],
    ops: { front: [op(0, 2.4, ph, ph + 2.7, { door: true }), op(0, 1.3, ph + 4.4, ph + 5.6, { tr: { n: 2, cusp: 3, oc: 3 } })], left: [op(0.3, 0.7, ph + 1.3, ph + 2.6, { tr: { n: 1, cusp: 3 } })], right: [op(0.3, 0.7, ph + 1.3, ph + 2.6, { tr: { n: 1, cusp: 3 } })] },
    butt: { front: [-Pc.W / 2 + 0.35, Pc.W / 2 - 0.35], d: 0.6, bw: 0.6, h: ph + Pc.h - 1.6, stages: 2 } });
  return { acc: finishUV(acc), info: infoOf(acc, { W: H.L + 2 * Wg.D, D: Wg.L, ph, eave, ridge: +hall.yRidge.toFixed(1), louvreTop: +lvTop.toFixed(1), bays: Array(H.bays).fill(bay), kind: 'hallH' }) };
}

// ---------------------------------------------------------------- NHÀ NGUYỆN (Sainte-Chapelle thu nhỏ): nóc dọc z, mặt tây = +z, apse đông = −z
export function chapel(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, ph = s.ph;
  const hw = s.W / 2, t = s.t, eave = s.eave, zW = s.zW, nb = s.bays, bay = s.bay, zA = zW - nb * bay, R = hw, pitch = 60, P = pitch * PI / 180, tp = Math.tan(P), tv = 0.3 / Math.cos(P);
  const yRidge = eave + tv + hw * tp, lowTop = ph + s.lowH, gy0 = s.up.y0 + s.up.h + 0.35;
  const upW = (u, w) => op(u, w, s.up.y0, s.up.y0 + s.up.h - apexOf(w), { tr: w > 3 ? { pairs: true, cusp: 3, oc: 6, subOc: 4 } : { n: 2, cusp: 3, oc: 4 }, glass: 'stained' });
  const lowW = (u) => op(u, 1.3, ph + 1.4, ph + 3.0, { tr: { n: 1, cusp: 3 }, glass: 'stained' });
  const bz = Array.from({ length: nb + 1 }, (_, i) => zW - i * bay), cz = Array.from({ length: nb }, (_, i) => zW - (i + 0.5) * bay);
  // tường dọc hai bên: phải (+x) u = −z, trái (−x) u = +z
  for (const sx of [1, -1]) {
    const Ff = F.sub(sx * (hw - t / 2), 0, sx * PI / 2), uz = (z) => -sx * z, u0 = Math.min(uz(zW), uz(zA)), u1 = Math.max(uz(zW), uz(zA));
    const ops = []; for (const z of cz) { ops.push(upW(uz(z), s.up.w)); ops.push(lowW(uz(z))); }
    wallFace(Ff, acc, { key, dress, u0, u1, top: eave, t, ops });
    Ff.add(acc, base, extU(plinthProf(t, ph + 0.1), u0, u1));
    for (const [a, b] of freeSpans(u0, u1, lowTop + 0.15, ops)) Ff.add(acc, dress, extU(stringProf(t, lowTop + 0.15), a, b));
    Ff.add(acc, dress, extU(stringProf(t, s.up.y0 - 0.5, 0.2, 0.32), u0, u1));                 // gờ bậu cửa sổ tầng trên
    eaveCourse(Ff, acc, dress, { u0, u1, y: eave, t, corbels: true });
    piercedParapet(Ff, acc, dress, { u0, u1, y: eave, t });
    for (const z of bz.slice(1)) buttress(Ff, acc, key, dress, { u: uz(z), t, d: s.butt.d, bw: s.butt.bw, h: eave, stages: 3, pin: s.butt.pin });
    for (const z of cz) gablet(Ff, acc, dress, { u: uz(z), w: s.up.w + 0.8, y: gy0, h: eave + 2.8 - gy0, t });
  }
  // apse: nửa thập giác (5 mặt), cửa sổ hẹp cao + trụ ốp hướng tâm + đầu hồi nhỏ
  const nA = 5, aO = R * Math.cos(PI / (2 * nA)), apseV = [];
  for (let i = 0; i <= nA; i++) { const th = PI + (PI * i) / nA; apseV.push([R * Math.cos(th), zA + R * Math.sin(th)]); }
  for (let i = 0; i < nA; i++) {
    const thm = PI + (PI * (i + 0.5)) / nA, nx = Math.cos(thm), nz = Math.sin(thm), len = 2 * R * Math.sin(PI / (2 * nA));
    const Ff = F.sub(nx * (aO - t / 2), zA + nz * (aO - t / 2), Math.atan2(nx, nz)), ops = [upW(0, Math.min(2.3, len - 1.2)), lowW(0)];
    wallFace(Ff, acc, { key, dress, u0: -len / 2 - 0.2, u1: len / 2 + 0.2, top: eave, t, ops });
    Ff.add(acc, base, extU(plinthProf(t, ph + 0.1), -len / 2, len / 2)); Ff.add(acc, dress, extU(stringProf(t, s.up.y0 - 0.5, 0.2, 0.32), -len / 2, len / 2));
    eaveCourse(Ff, acc, dress, { u0: -len / 2, u1: len / 2, y: eave, t, corbels: true }); piercedParapet(Ff, acc, dress, { u0: -len / 2, u1: len / 2, y: eave, t });
    gablet(Ff, acc, dress, { u: 0, w: Math.min(2.3, len - 1.2) + 0.7, y: gy0, h: eave + 2.4 - gy0, t });
  }
  for (let i = 1; i < nA; i++) { const [x, z] = apseV[i], th = PI + (PI * i) / nA, nx = Math.cos(th), nz = Math.sin(th); buttress(F.sub(x - nx * t / 2, z - nz * t / 2, Math.atan2(nx, nz)), acc, key, dress, { u: 0, t, d: s.butt.d, bw: s.butt.bw, h: eave, stages: 3, pin: s.butt.pin }); }
  // mặt tây (+z): cửa tầng dưới, cửa tầng trên, cửa sổ hoa hồng, đầu hồi đá có hoa thập tự
  const Fw = F.sub(0, zW - t / 2, 0), rose = s.rose, gfun = (u) => eave + tv + 0.3 + (hw - Math.abs(u)) * tp, yA = gfun(0);
  const wOps = [op(0, 2.6, ph, ph + 2.6, { door: true }), op(0, 2.4, lowTop + 0.3, lowTop + 2.6, { door: true, hood: false })];
  const roseHole = foil(0, rose.y, rose.r, 0, 0, 48);
  Fw.add(acc, key, ext([[-hw, 0], [hw, 0], [hw, eave], [hw, gfun(hw)], [0, yA], [-hw, gfun(-hw)], [-hw, eave]], [...wOps.map(holeOf), roseHole], t, -t / 2));
  for (const q of wOps) openingParts(Fw, acc, q, t, dress);
  roseWindow(Fw, acc, dress, { y: rose.y, r: rose.r, t });
  const cs = 0.3 / Math.cos(P), ye = yA - (hw + 0.14) * tp; Fw.add(acc, dress, ext([[-hw - 0.14, ye], [0, yA], [hw + 0.14, ye], [hw + 0.14, ye + cs], [0, yA + cs], [-hw - 0.14, ye + cs]], null, t + 0.2, -(t + 0.2) / 2));
  finialAt(Fw, acc, 'gold', 0, yA + cs - 0.05, 0, 'cross+');
  for (let i = 0; i < 5; i++) { const u = -2.6 + i * 1.3, oo = op(u, 0.8, rose.y + rose.r + 0.8, rose.y + rose.r + 2.2 + (2 - Math.abs(i - 2)) * 0.7, {}); Fw.add(acc, base, ext(outline(oo), null, 0.03, t / 2 + 0.01)); Fw.add(acc, dress, ext(frameArch(oo, 0.12), null, 0.16, t / 2)); if (oo.w > 0) Fw.add(acc, dress, ext(outline(oo), traceryHoles({ ...oo, tr: { n: 1, cusp: 3 } }), 0.06, t / 2 + 0.02)); } // vòm mù trên hoa hồng
  Fw.add(acc, dress, boxB(2 * hw + 1.6, 0.3, 1.3, 0, eave - 0.3, t / 2 + 0.35)); piercedParapet(Fw, acc, dress, { u0: -hw - 0.5, u1: hw + 0.5, y: eave, t: t + 1.9 }); eaveCourse(Fw, acc, dress, { u0: -hw, u1: hw, y: eave - 0.3, t, corbels: true });
  { const yo = eave + (yA - eave) * 0.42, ro = 1.15; Fw.add(acc, base, ext(foil(0, yo, ro, 0, 0, 36), null, 0.03, t / 2 + 0.01)); Fw.add(acc, dress, ext(foil(0, yo, ro + 0.25, 0, 0, 36), [foil(0, yo, ro, 0, 0, 36)], 0.18, t / 2)); Fw.add(acc, dress, ext(foil(0, yo, ro, 0, 0, 36), [foil(0, yo, ro * 0.84, 6, 0.26, 48)], 0.08, t / 2 + 0.02)); }
  // tháp cầu thang bát giác hai góc tây + chóp nhỏ
  for (const sx of [-1, 1]) {
    const x = sx * (hw + 0.3), z = zW - 0.2, a = 1.35, top = eave + 3.2;
    acc.add(key, polyCyl(8, a + 0.15, a, top, x, 0, z)); acc.add(base, polyCyl(8, a + 0.4, a + 0.2, ph + 0.4, x, 0, z));
    for (const y of [lowTop + 0.15, s.up.y0 - 0.5, eave]) acc.add(dress, polyCyl(8, a + 0.18, a + 0.1, 0.28, x, y, z));
    for (let y = ph + 2; y < top - 2; y += 3.2) { const th = (sx > 0 ? 0 : PI) + ((y * 7) % 3 - 1) * 0.6; acc.add('dark', box(0.14, 1.0, 0.06, x + Math.cos(th) * (a + 0.02), y, z + Math.sin(th) * (a + 0.02), PI / 2 - th)); }
    for (const sd of psides(8, a + 0.05)) { const g = ext([[-0.5, 0], [0.5, 0], [0, 1.1]], [foil(0, 0.42, 0.18, 3, 0.3, 18)], 0.12, -0.06); g.rotateY(sd.ry); g.translate(x + sd.mx, top, z + sd.mz); acc.add(dress, g); }
    pyramidRoof(F, acc, 'lead', { n: 8, a: a - 0.1, y: top, yA: top + 5.0, cx: x, cz: z, th: 0.15 }); finialAt(F, acc, 'gold', x, top + 4.9, z, 'ball');
  }
  // cổng hiên 2 tầng phía tây: tầng dưới 3 vòm mở, tầng trên hành lang vòm + lan can thủng
  const pD = s.porch.D, Fp = F.sub(0, zW + pD / 2, 0), ph2 = lowTop + 0.3, pTop = s.porch.h;
  const arch3 = (y0, ys, wc, ws) => [op(0, wc, y0, ys, { hood: true }), op(-hw * 0.62, ws, y0, ys + (wc - ws) * 0.4, {}), op(hw * 0.62, ws, y0, ys + (wc - ws) * 0.4, {})];
  const pf = [...arch3(ph, ph + 2.4, 3.0, 2.0), ...arch3(ph2, ph2 + 2.6, 2.6, 1.8)].map((q) => ({ ...q, open: true }));
  Fp.sub(0, pD / 2 - 0.35, 0).add(acc, key, ext([[-hw, 0], [hw, 0], [hw, pTop], [-hw, pTop]], pf.map(holeOf), 0.7, -0.35));
  for (const q of pf) { const Fq = Fp.sub(0, pD / 2 - 0.35, 0); Fq.add(acc, dress, ext(frameArch(q, 0.16), null, 0.3, 0.35 - 0.24)); Fq.add(acc, dress, ext(hoodArch(q), null, 0.12, 0.36)); }
  for (const sx of [-1, 1]) { const Fs = Fp.sub(sx * (hw - 0.35), 0, sx * PI / 2), so = [op(0, 1.4, ph, ph + 2.4, {}), op(0, 1.3, ph2, ph2 + 2.3, {})]; Fs.add(acc, key, ext([[-pD / 2, 0], [pD / 2, 0], [pD / 2, pTop], [-pD / 2, pTop]], so.map(holeOf), 0.7, -0.35)); for (const q of so) Fs.add(acc, dress, ext(frameArch(q, 0.14), null, 0.26, 0.11)); }
  Fp.add(acc, 'dress' + c, boxB(2 * hw, 0.4, pD, 0, lowTop - 0.1, 0)); Fp.add(acc, 'lead', boxB(2 * hw - 0.2, 0.2, pD - 0.2, 0, pTop - 0.2, 0));
  piercedParapet(Fp.sub(0, pD / 2 - 0.35, 0), acc, dress, { u0: -hw, u1: hw, y: pTop, t: 0.7 }); for (const sx of [-1, 1]) piercedParapet(Fp.sub(sx * (hw - 0.35), 0, sx * PI / 2), acc, dress, { u0: -pD / 2, u1: pD / 2, y: pTop, t: 0.7 });
  Fp.add(acc, base, boxB(2 * hw + 0.4, ph, pD + 0.3, 0, 0, 0.1)); Fp.plat(acc, { x: 0, z: 0, w: 2 * hw - 1.4, d: pD - 0.7, top: ph });
  stepsOut(Fp.sub(0, pD / 2 - 0.35, 0), acc, base, { u: 0, w: 3.6, t: 0.7, h: ph });
  // mái chì 60° + mái apse + gờ hoa huệ vàng trên nóc + chóp mảnh (flèche)
  const Fr90 = F.sub(0, 0, PI / 2);                                                                 // x cục bộ = −z thế giới
  const r = gableRoof(Fr90, acc, 'lead', { xl: -(zW - t / 2), xr: -zA, D: 2 * hw, yE: eave, pitch, ov: 0.05, th: 0.3 });
  const yE2 = eave + tv - 0.05 * tp;
  for (let i = 0; i < nA; i++) { const [x0, z0] = apseV[i], [x1, z1] = apseV[i + 1]; acc.add('lead', prism([V(x0, yE2, z0), V(x1, yE2, z1), V(0, r.yRidge, zA)].reverse(), 0.3)); }
  for (let z = zA + 0.4; z < zW - 0.6; z += 0.9) acc.add('gold', ext([[-0.1, 0], [0.1, 0], [0.1, 0.25], [0.24, 0.42], [0.08, 0.38], [0, 0.62], [-0.08, 0.38], [-0.24, 0.42], [-0.1, 0.25]], null, 0.06, -0.03).rotateY(PI / 2).translate(0, r.yRidge + 0.12, z));
  const fz = s.fleche.z, fa = 1.1, fy = r.yRidge - 1.2;
  acc.add('lead', polyCyl(8, fa, fa, 4.6, 0, fy, fz));
  for (const sd of psides(8, fa + 0.02)) { const f = F.sub(sd.mx, fz + sd.mz, sd.ry); f.add(acc, 'dark', ext(outline({ u: 0, w: 0.5, y0: fy + 1.8, ys: fy + 3.2 }), null, 0.03, 0)); f.add(acc, 'gold', ext([[-0.45, fy + 4.6], [0.45, fy + 4.6], [0, fy + 5.5]], null, 0.08, -0.04)); }
  pyramidRoof(F, acc, 'lead', { n: 8, a: fa + 0.05, y: fy + 4.6, yA: fy + 4.6 + s.fleche.h, cz: fz, th: 0.12 });
  for (let i = 1; i < 7; i++) { const yy = fy + 4.6 + (s.fleche.h * i) / 7.5, rr = (fa + 0.05) / Math.cos(PI / 8) * (1 - i / 7.5); for (const [x, z] of pverts(8, 1, 0)) acc.add('gold', box(0.16, 0.16, 0.16, (x * rr) / 1.08, yy, fz + (z * rr) / 1.08)); }
  finialAt(F, acc, 'gold', 0, fy + 4.5 + s.fleche.h, fz, 'cross+');
  // tầng dưới: sàn đá, vòm tầng trên (sàn đá dày); nội thất tối giản
  acc.add('floor', boxB(2 * hw - 2 * t, 0.3, zW - zA + R * 0.8, 0, ph - 0.3, (zW + zA - R * 0.8) / 2)); F.plat(acc, { x: 0, z: (zW + zA) / 2, w: 2 * hw - 2 * t, d: zW - zA - 0.4, top: ph });
  acc.add(dress, boxB(2 * hw - 2 * t, 0.6, zW - zA, 0, lowTop - 0.3, (zW + zA) / 2));
  for (const z of bz.slice(1, -1)) acc.add(dress, ext(archBand(2 * hw - 2 * t, s.up.y0 + 6.5, 0.5), null, 0.4, -0.2).translate(0, 0, z));
  return { acc: finishUV(acc), info: infoOf(acc, { W: s.W, D: zW - zA + R + pD, ph, eave, ridge: +r.yRidge.toFixed(1), bays: Array(nb).fill(bay), kind: 'chapel' }) };
}
/** lan can thủng (trefoil arcade) ở đầu tường — Sainte-Chapelle */
function piercedParapet(Ff, acc, dress, { u0, u1, y, t, h = 1.0 }) {
  const L = u1 - u0, n = Math.max(1, Math.floor(L / 0.62)), st = L / n, holes = [];
  for (let i = 0; i < n; i++) { const u = u0 + st * (i + 0.5); holes.push(foil(u, y + h * 0.5, Math.min(0.24, st * 0.36), 4, 0.32, 24)); }
  Ff.add(acc, dress, ext([[u0, y], [u1, y], [u1, y + h], [u0, y + h]], holes, 0.26, t / 2 - 0.12));
  Ff.add(acc, dress, boxB(L, 0.12, 0.34, (u0 + u1) / 2, y + h, t / 2 + 0.01));
}
/** đầu hồi nhỏ (gablet) trên cửa sổ: tam giác có lỗ ba thuỳ, đá lợp hai rìa có móc lá, hoa đầu */
function gablet(Ff, acc, dress, { u, w, y, h, t }) {
  const g = ext([[u - w / 2, y], [u + w / 2, y], [u, y + h]], [foil(u, y + h * 0.4, w * 0.15, 4, 0.28, 32)], 0.3, t / 2 + 0.05); Ff.add(acc, dress, g);
  for (const s of [-1, 1]) { const a = V(u + (s * w) / 2, y + 0.05, t / 2 + 0.2), b = V(u, y + h + 0.05, t / 2 + 0.2); Ff.add(acc, dress, beam(a, b, 0.2, 0.2)); for (let i = 1; i < 4; i++) { const p = a.clone().lerp(b, i / 4); Ff.add(acc, dress, box(0.2, 0.2, 0.24, p.x + s * 0.06, p.y + 0.12, p.z)); } }
  finialAt(Ff, acc, dress, u, y + h - 0.05, t / 2 + 0.2, 'pin');
}
function frameArch(o, b) { const hw = o.w / 2, inner = archPts(o.w, o.ys, o.head || 'equi', 8, o.u), outer = archPts(o.w + 2 * b, o.ys, o.head || 'equi', 8, o.u).reverse(); return [[o.u - hw - b, o.y0], [o.u - hw, o.y0], ...inner, [o.u + hw, o.y0], [o.u + hw + b, o.y0], ...outer]; }
function hoodArch(o) { const wo = o.w + 0.75, wi = o.w + 0.45, a = archPts(wo, o.ys, 'equi', 8, o.u), b = archPts(wi, o.ys, 'equi', 8, o.u).reverse(); return [[o.u - wo / 2, o.ys - 0.3], ...a, [o.u + wo / 2, o.ys - 0.3], [o.u + wi / 2, o.ys - 0.3], ...b, [o.u - wi / 2, o.ys - 0.3]]; }
function archBand(w, ys, b) { const a = archPts(w, ys, 'equi', 10, 0), i = archPts(w - 2 * b, ys, 'equi', 10, 0).reverse(); return [[-w / 2, ys - 6], ...a, [w / 2, ys - 6], [w / 2 - b, ys - 6], ...i, [-w / 2 + b, ys - 6]]; }
/** cửa sổ hoa hồng: kính màu + song đá 12 cánh + vòng khung + gờ mũ tròn */
function roseWindow(Ff, acc, dress, { y, r, t }) {
  const wg = t / 2 - 0.35, holes = [foil(0, y, r * 0.26, 6, 0.3, 42)], r1 = r * 0.4, r2 = r * 0.93, pw = r * 0.155;
  const petal = traceryHoles({ u: 0, w: pw + 0.2, y0: r1 - 0.1, ys: r2 - apexOf(pw + 0.2), tr: { n: 1, cusp: 3, m: 0.1 } })[0];
  for (let i = 0; i < 12; i++) { const th = (i * PI) / 6 + PI / 2, c = Math.cos(th), sn = Math.sin(th); holes.push(petal.map(([u, v]) => [-u * sn + v * c, y + u * c + v * sn])); const b = th + PI / 12; holes.push(foil(Math.cos(b) * r * 0.83, y + Math.sin(b) * r * 0.83, r * 0.085, 4, 0.3, 20)); }
  const circ = (rr) => foil(0, y, rr, 0, 0, 56);
  Ff.add(acc, 'stained', ext(circ(r), null, 0.04, wg - 0.03)); Ff.add(acc, dress, ext(circ(r), holes, 0.16, wg));
  Ff.add(acc, dress, ext(circ(r + 0.4), [circ(r)], 0.3, t / 2 - 0.22)); Ff.add(acc, dress, ext(circ(r + 0.7), [circ(r + 0.5)], 0.16, t / 2 + 0.06));
}

// ---------------------------------------------------------------- BẾP (Stanton Harcourt / Glastonbury): tháp vuông + mái chóp bát giác + đèn lồng; dãy kho
export function kitchen(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, key = 'wall' + c, dress = 'dress' + c, ph = s.ph, K = s.kit, S = s.store;
  const Fk = F.sub(K.x, 0, 0), wt = ph + K.h, kt = 1.0;
  const kOps = (side) => side === 'front' ? [op(0, 1.6, ph, ph + 2.2, { door: true }), op(0, 1.0, ph + 6.0, ph + 8.2, { tr: { n: 1, cusp: 3 } })] : side === 'left' ? [op(-2, 1.0, ph + 6.0, ph + 8.2, { tr: { n: 1, cusp: 3 } }), op(2, 1.0, ph + 6.0, ph + 8.2, { tr: { n: 1, cusp: 3 } })] : side === 'back' ? [op(0, 1.0, ph + 6.0, ph + 8.2, { tr: { n: 1, cusp: 3 } })] : [];
  blockTower(Fk, acc, { W: K.W, D: K.W, t: kt, h: wt, ph, c, top: 'crenel', strings: [ph + 4.6], ops: { front: kOps('front'), left: kOps('left'), back: kOps('back') }, quoins: false,
    butt: { front: [-K.W / 2 + 0.45, K.W / 2 - 0.45], back: [-K.W / 2 + 0.45, K.W / 2 - 0.45], left: [-K.W / 2 + 0.45 + kt, K.W / 2 - 0.45 - kt], right: [], d: 0.9, bw: 0.9, h: wt - 1.8, stages: 2 } });
  // máng xối đầu thú (gargoyle) ở gờ đầu tường
  for (const [x, z, ry] of [[K.W / 2 + 0.2, 0, PI / 2], [-K.W / 2 - 0.2, 0, -PI / 2], [0, K.W / 2 + 0.2, 0], [0, -K.W / 2 - 0.2, PI], [K.W / 4, K.W / 2 + 0.2, 0], [-K.W / 4, -K.W / 2 - 0.2, PI]]) { const g = boxB(0.36, 0.36, 1.5, 0, 0, 0); g.rotateY(ry); g.translate(x, wt - 0.6, z); Fk.add(acc, dress, g); silh(Fk, acc, dress, LION, 1.0, 0.4, x + Math.sin(ry) * 0.9, wt - 0.75, z + Math.cos(ry) * 0.9, ry + PI / 2); }
  // tháp cầu thang góc sau phải (Stanton)
  { const x = K.W / 2 - 0.6, z = -K.W / 2 + 0.6, a = 1.3, top = wt + 3.2; Fk.add(acc, key, polyCyl(8, a, a, top, x, 0, z)); Fk.add(acc, dress, polyCyl(8, a + 0.1, a + 0.05, 0.25, x, wt - 0.3, z));
    for (const y of [ph + 3, ph + 6, ph + 9, wt + 1]) Fk.add(acc, 'dark', box(0.12, 0.9, 0.05, x + a + 0.01, y, z, PI / 2)); crenelPoly(Fk.sub(x, z, 0), acc, key, dress, { n: 8, ac: a - 0.2, y: top, c: { ...CREN, mw: 1.0, cw: 0.5, mh: 0.8, bh: 0.9, pt: 0.4 } }); Fk.add(acc, 'lead', polyCyl(8, a - 0.3, a - 0.3, 0.15, x, top, z)); }
  // mái chóp bát giác ngói đá từ trong lan can + đèn lồng hai tầng thoát khói + sư tử Harcourt
  const aB = K.W / 2 - kt - 0.1, yA = wt + K.roofH, aT = K.lantern.a, yT = pyramidRoof(Fk, acc, 'stoneSlate', { n: 8, a: aB, y: wt - 0.1, yA, aTop: aT, th: 0.3 });
  for (const sd of psides(8, aB * 0.86)) { const f = Fk.sub(sd.mx, sd.mz, sd.ry); f.add(acc, 'dark', boxB(0.9, 0.35, 0.05, 0, wt + (yA - wt) * 0.14 - 0.1, 0.08)); f.add(acc, 'stoneSlate', boxB(1.2, 0.12, 0.6, 0, wt + (yA - wt) * 0.14 + 0.3, 0)); } // lỗ khói quanh chân mái
  const lt = louvre(Fk, acc, { a: aT, y: yT, h: K.lantern.h, cap: 1.2, key: 'oak', capKey: 'stoneSlate', vane: false });
  Fk.add(acc, 'lead', boxB(K.W - 2 * kt + 0.3, 0.15, K.W - 2 * kt + 0.3, 0, wt - 0.25, 0));
  Fk.add(acc, 'stoneSlate', boxB(0.5, 0.25, 0.5, 0, lt - 0.15, 0)); silh(Fk, acc, 'gold', LION, 0.9, 0.3, 0, lt + 0.08, 0, 0);
  // dãy kho (buttery / pantry / kho lương) 2 tầng, nóc dọc x, đầu hồi đông bằng đá; cửa giữa nhà (x = 0)
  const Fs = F.sub(S.x, S.z, 0), sh = S.D / 2, se = ph + S.eaveH, f1 = ph + S.f1, uDoor = -S.x;
  const front = [op(uDoor, 2.4, ph, ph + 2.6, { door: true, head: 'four' })]; for (const u of [-8.5, -3.5, 4.5, 9]) { if (Math.abs(u - uDoor) > 2) front.push(op(u, 1.2, ph + 1.2, ph + 2.6, { head: 'square', tr: { n: 2, cusp: 3 } })); front.push(op(u, 0.75, f1 + 0.8, f1 + 2.2, { tr: { n: 1, cusp: 3 } })); }
  const back = [op(-4, 0.2, ph + 1.2, ph + 2.6, { slit: true }), op(4, 0.2, ph + 1.2, ph + 2.6, { slit: true }), op(0, 0.75, f1 + 0.8, f1 + 2.2, { tr: { n: 1, cusp: 3 } }), op(7, 1.4, ph, ph + 2.0, { door: true, head: 'four' })];
  range(Fs, acc, { L: S.L, D: S.D, t: 0.9, eave: se, ph, c, roof: 'stoneSlate', ends: ['abut', 'coped'], ops: { front, back, right: [op(0, 1.4, f1 + 0.6, f1 + 2.2, { tr: { n: 2, cusp: 3, oc: 3 } })] }, floors: [f1], quoins: true, finial: 'ball' });
  return { acc: finishUV(acc), info: infoOf(acc, { W: K.W + S.L, D: K.W, ph, eave: wt, kitchenTop: +(lt + 0.5).toFixed(1), kind: 'kitchen' }) };
}

// ---------------------------------------------------------------- SOLAR (Ludlow Great Chamber): khối 3 tầng, cửa sổ tầng 1 lớn nhất, ống khói đá, tháp vệ sinh
export function solar(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, ph = s.ph, B = s.block, f1 = ph + B.f1, f2 = ph + B.f2, eave = ph + B.eaveH, hd = B.D / 2;
  const big = (u) => op(u, 2.0, f1 + 0.8, f1 + 3.0, { tr: { n: 2, cusp: 3, transom: 0.5, oc: 4 } });
  const small = (u) => op(u, 1.4, f2 + 0.6, f2 + 2.2, { head: 'square', tr: { n: 2, cusp: 3 } });
  const front = [op(0, 2.4, ph, ph + 2.6, { door: true, head: 'four' }), op(-5.5, 1.2, ph + 1.4, ph + 2.8, { head: 'square', tr: { n: 2 } }), op(5.5, 1.2, ph + 1.4, ph + 2.8, { head: 'square', tr: { n: 2 } }), big(-4.2), big(4.2), small(-5.5), small(0), small(5.5)];
  const back = [big(6.5), small(6.5), op(6.5, 0.18, ph + 1.3, ph + 2.8, { slit: true }), op(-0.5, 0.18, ph + 1.3, ph + 2.8, { slit: true })];
  const gable = [op(0, 1.8, f1 + 0.8, f1 + 3.0, { tr: { n: 2, cusp: 3, oc: 4 } }), op(0, 1.2, f2 + 0.6, f2 + 2.1, { head: 'square', tr: { n: 2, cusp: 3 } }), op(0, 0.6, eave + 1.4, eave + 2.6, { tr: { n: 1, cusp: 3 } }), op(0, 0.18, ph + 1.3, ph + 2.8, { slit: true })];
  const r = range(F, acc, { L: B.L, D: B.D, t: 1.1, eave, ph, c, roof: 'slate', ends: ['coped', 'coped'], ops: { front, back, left: gable, right: gable }, floors: [f1, f2], strings: [f1 + 0.2, f2 + 0.2], quoins: true, finial: 'pin', corbels: false,
    chim: [{ face: 'back', u: 3.4, yTop: eave + hd * TP50 + 2.0 }] });
  // tháp vệ sinh (garderobe) 4 tầng nhô ra mặt sau, mái chì sau lan can răng cưa; máng xả ở chân
  const G = s.garderobe, Fg = F.sub(G.x, -hd - G.D / 2 + 0.4, 0);
  blockTower(Fg, acc, { W: G.W, D: G.D + 0.8, t: 0.8, h: ph + G.h, ph, c, top: 'crenel', skip: ['front'], strings: [f1 + 0.2, f2 + 0.2], quoins: true, plat: false,
    ops: { back: [op(0, 0.16, ph + 2, ph + 3.2, { slit: true }), op(0, 0.16, f1 + 1.2, f1 + 2.4, { slit: true }), op(0, 0.16, f2 + 1, f2 + 2.2, { slit: true }), op(0, 0.16, ph + G.h - 3.0, ph + G.h - 1.8, { slit: true })], left: [op(0, 0.16, f1 + 1.2, f1 + 2.4, { slit: true })], right: [op(0, 0.16, f2 + 1.2, f2 + 2.4, { slit: true })] } });
  Fg.add(acc, 'dark', ext(outline({ u: 0, w: 1.2, y0: 0.05, ys: 0.9 }), null, 0.05, -(G.D + 0.8) / 2 - 0.02));
  return { acc: finishUV(acc), info: infoOf(acc, { W: B.L, D: B.D + G.D, ph, eave, ridge: +r.yRidge.toFixed(1), storeys: 3, kind: 'solar' }) };
}

// ---------------------------------------------------------------- DÃY PHÒNG: nhà khách (Dartington tây), doanh trại (Dartington đông), thư các (Merton)
export function lodging(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, ph = s.ph, L = s.L, D = s.D, t = s.t, eave = ph + s.eaveH, f1 = ph + s.f1, hd = D / 2, v = s.variant;
  const front = [], back = [], chim = [], left = [], right = [];
  let extra = () => {};
  if (v === 'guest') {
    const nU = s.units, uw = L / nU, porches = s.porches;
    for (let i = 0; i < nU; i++) {
      const xc = -L / 2 + uw * (i + 0.5), pn = porches.reduce((a, p) => (Math.abs(p - xc) < Math.abs(a - xc) ? p : a), porches[0]), aw = Math.sign(xc - pn) * 0.8, x = xc + aw;
      front.push(op(x, 1.4, ph + 1.1, ph + 2.7, { head: 'square', tr: { n: 2, cusp: 3, transom: 0.5 } }));
      for (const dx of [-1.05, 1.05]) front.push(op(x + dx, 1.3, f1 + 0.9, f1 + 2.8, { head: 'square', tr: { n: 2, cusp: 3, transom: 0.5 } }));
      chim.push({ face: 'back', u: -xc, yTop: eave + hd * TP50 + 1.6 });
      back.push(op(-(xc + 2.3), 0.7, f1 + 1.0, f1 + 2.3, { tr: { n: 1, cusp: 3 } }), op(-(xc - 2.3), 0.7, ph + 1.2, ph + 2.4, { tr: { n: 1, cusp: 3 } }));
    }
    for (const p of porches) front.push(op(p, Math.abs(p) < 0.1 ? 2.4 : 2.0, ph, ph + 2.4, { door: true, head: 'four', noSteps: true }));
    left.push(op(0, 1.3, f1 + 0.9, f1 + 2.8, { head: 'square', tr: { n: 2, cusp: 3, transom: 0.5 } }), op(0, 0.6, eave + 1.2, eave + 2.4, { tr: { n: 1, cusp: 3 } })); right.push(...left);
    extra = () => { for (const p of porches) { // cổng hiên 2 tầng có mái riêng (đầu hồi ra trước), cửa vòm 4 tâm
      const pw = Math.abs(p) < 0.1 ? 3.6 : 3.2, pdp = 3.0, Fp = F.sub(p, hd + pdp / 2 - 0.3, PI / 2), pe = ph + 4.6;
      range(Fp, acc, { L: pdp + 0.6, D: pw, t: 0.6, eave: pe, ph, c, roof: 'slate', ends: ['coped', 'abut'], skip: [], finial: 'ball', quoins: true, eaveCourse: true, ov: 0.25,
        ops: { left: [op(0, Math.abs(p) < 0.1 ? 2.4 : 2.0, ph, ph + 2.3, { door: true, head: 'four' }), op(0, 1.1, ph + 3.0, ph + 4.0, { head: 'square', tr: { n: 2, cusp: 3 } })] } }); } };
  } else if (v === 'barracks') {
    const St = s.stair;
    front.push(op(0, 2.4, ph, ph + 2.4, { door: true, head: 'four' }));
    for (let u = -L / 2 + 2.5; u <= L / 2 - 2.5; u += 4.0) {
      const under = Math.abs(Math.abs(u) - (St.uLand + 0.8 + St.run / 2)) < St.run / 2 + 1.4;
      if (Math.abs(u) > 2.4 && !under) front.push(op(u, 0.7, ph + 1.3, ph + 2.5, { head: 'square', tr: { n: 1, cusp: 3 } }));
      if (Math.abs(Math.abs(u) - St.uLand) > 1.4) front.push(op(u, 0.7, f1 + 1.0, f1 + 2.2, { tr: { n: 1, cusp: 3 } }));
    }
    for (const sx of [-1, 1]) front.push(op(sx * St.uLand, 1.2, f1, f1 + 1.8, { door: true, noSteps: true }));
    const busy = [...s.privies.map((x) => -x), 14, -14]; for (let u = -L / 2 + 2.5; u <= L / 2 - 2.5; u += 3) { if (busy.some((b) => Math.abs(b - u) < 2.2)) continue; back.push(Math.round((u + 30) / 3) % 2 ? op(u, 0.18, ph + 1.3, ph + 2.6, { slit: true }) : op(u, 0.6, f1 + 1.1, f1 + 2.2, { head: 'square', tr: { n: 1, cusp: 3 } })); }
    for (const x of [-14, 14]) chim.push({ face: 'back', u: -x, yTop: eave + hd * TP50 + 1.2, oct: false });
    left.push(op(0, 0.6, eave + 1.2, eave + 2.4, { tr: { n: 1, cusp: 3 } }), op(0, 0.18, ph + 1.3, ph + 2.6, { slit: true })); right.push(...left);
    extra = () => {
      const Ff = F.sub(0, hd - t / 2, 0), dress = 'dress' + c, base = 'base' + c;
      for (const sx of [-1, 1]) { // cầu thang đá ngoài chạy dọc mặt sân lên cửa tầng trên + tường lan can
        const n = Math.round((f1) / 0.172), rise = f1 / n, tr = St.run / n, w0 = t / 2, w1 = t / 2 + St.w, uL = sx * St.uLand;
        for (let i = 0; i < n; i++) { const u = sx * (St.uLand + 0.8 + St.run - tr * (i + 0.5)); Ff.add(acc, dress, boxB(tr + 0.02, rise * (i + 1), St.w, u, 0, (w0 + w1) / 2)); Ff.plat(acc, { x: u, z: (w0 + w1) / 2, w: tr, d: St.w, top: rise * (i + 1) }); }
        Ff.add(acc, dress, boxB(1.6, f1, St.w, uL, 0, (w0 + w1) / 2)); Ff.plat(acc, { x: uL, z: (w0 + w1) / 2, w: 1.6, d: St.w, top: f1 });
        const uS = sx * (St.uLand + 0.8 + St.run), uE = sx * (St.uLand - 0.8), pts = sx > 0 ? [[uE, 0], [uS, 0], [uS, 1.0], [uS - sx * St.run, f1 + 1.0], [uE, f1 + 1.0]] : [[uS, 0], [uE, 0], [uE, f1 + 1.0], [uS - sx * St.run, f1 + 1.0], [uS, 1.0]];
        Ff.add(acc, 'wall' + c, ext(pts, null, 0.3, w1));
        Ff.add(acc, dress, beam(V(uS, 1.0 + 0.08, w1 + 0.15), V(uS - sx * St.run, f1 + 1.08, w1 + 0.15), 0.4, 0.16)); Ff.add(acc, dress, boxB(1.6 + 0.2, 0.16, 0.4, uL, f1 + 1.0, w1 + 0.15));
        Ff.add(acc, 'dark', boxB(1.0, 1.0, 0.05, sx * (St.uLand + St.run * 0.55), 0, w1 + 0.31));     // vòm gầm thang
      }
      for (const x of s.privies) { // cánh vệ sinh chung nhô ra mặt sau, mái một dốc
        const Fp = F.sub(x, -hd - 1.25 + 0.3, 0), pw = 2.6, pd = 2.5, pe = ph + 5.6;
        blockTower(Fp, acc, { W: pw, D: pd + 0.6, t: 0.6, h: pe, ph, c, skip: ['front'], plat: false, ops: { back: [op(0, 0.16, f1 + 1.0, f1 + 2.0, { slit: true }), op(0, 0.9, 0.05, 0.6, { head: 'round', hood: false, glass: 'dark' })], left: [op(0, 0.16, ph + 1.4, ph + 2.4, { slit: true })], right: [op(0, 0.16, ph + 1.4, ph + 2.4, { slit: true })] } });
        Fp.add(acc, 'slate', prism([V(-pw / 2 - 0.3, pe + 0.1, -(pd + 0.6) / 2 - 0.3), V(pw / 2 + 0.3, pe + 0.1, -(pd + 0.6) / 2 - 0.3), V(pw / 2 + 0.3, pe + 1.1, (pd + 0.6) / 2), V(-pw / 2 - 0.3, pe + 1.1, (pd + 0.6) / 2)].reverse(), 0.22));
      }
    };
  } else { // thư các Merton: tầng 1 hàng cửa sổ hẹp một ô đầu lá năm thuỳ, bước 2,5 m; tầng trệt cửa sổ 2 ô
    const W = s.win;
    for (let u = -W.n2 * W.step; u <= W.n2 * W.step + 0.01; u += W.step) { front.push(op(u, W.w, f1 + 0.9, f1 + 0.9 + W.h - apexOf(W.w), { tr: { n: 1, cusp: 5 } })); back.push(op(u, W.w, f1 + 0.9, f1 + 0.9 + W.h - apexOf(W.w), { tr: { n: 1, cusp: 5 } })); }
    front.push(op(0, 2.4, ph, ph + 2.4, { door: true, head: 'four' }));
    for (const u of [-12.5, -6.2, 6.2, 12.5]) { front.push(op(u, 1.4, ph + 1.1, ph + 2.6, { head: 'square', tr: { n: 2, cusp: 3 } })); back.push(op(u, 1.4, ph + 1.1, ph + 2.6, { head: 'square', tr: { n: 2, cusp: 3 } })); }
    const gw = [op(0, 2.1, f1 + 1.0, f1 + 3.9, { tr: { n: 2, cusp: 5, transom: 0.42, oc: 4 } }), op(0, 1.3, ph + 1.1, ph + 2.6, { head: 'square', tr: { n: 2, cusp: 3 } })];
    left.push(...gw); right.push(...gw);
  }
  const r = range(F, acc, { L, D, t, eave, ph, c, roof: s.roof || 'slate', ends: ['coped', 'coped'], ops: { front, back, left, right }, floors: [f1], chim, quoins: true, finial: s.finial || 'pin', strings: s.strings ? s.strings.map((y) => ph + y) : [], corbels: !!s.corbels, butt: s.butt });
  extra();
  return { acc: finishUV(acc), info: infoOf(acc, { W: L, D, ph, eave, ridge: +r.yRidge.toFixed(1), storeys: 2, kind: v }) };
}

// ---------------------------------------------------------------- CHUỒNG NGỰA & ƯNG (Kenilworth): tầng dưới đá đỏ, tầng trên khung gỗ thanh chéo, mái ngói đất nung
export function mews(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, ph = s.ph, L = s.L, D = s.D, t = 0.8, yS = ph + s.stoneH, eave = ph + s.eaveH, hd = D / 2, mx0 = L / 2 - s.mewsL;
  const fr = faceFrames(F, L, D, t), tw = 0.24;
  const lower = { front: [], back: [], left: [], right: [] };
  lower.front.push(op(0, 2.8, ph, ph + 2.2, { door: true, head: 'four', noSteps: true }));
  for (const u of [-16, 8 - 0]) lower.front.push(op(u, 1.8, ph, ph + 1.9, { door: true, head: 'four', noSteps: true }));
  for (let u = -19.5; u < mx0 - 1; u += 3.2) if (![0, -16, 8].some((d) => Math.abs(u - d) < 2.4)) lower.front.push(op(u, 0.8, ph + 1.3, ph + 2.3, { head: 'square' }));
  for (let u = mx0 + 1.6; u < L / 2 - 1; u += 2.6) lower.front.push(op(u, 1.5, ph + 0.9, ph + 2.6, { head: 'square', hood: false, grille: true }));
  for (let u = -18; u < L / 2 - 2; u += 4.5) lower.back.push(op(u, 0.8, ph + 1.3, ph + 2.3, { head: 'square' }));
  lower.left.push(op(0, 1.8, ph, ph + 1.9, { door: true, head: 'four', noSteps: true }));
  for (const [nm, f] of Object.entries(fr)) {
    wallFace(f.F, acc, { key, dress, u0: f.u0, u1: f.u1, top: yS, t, ops: lower[nm] });
    const ex = nm === 'front' || nm === 'back' ? 0.2 : t; f.F.add(acc, base, extU(plinthProf(t, ph + 0.05, 0.18), f.u0 - ex, f.u1 + ex));
    f.F.add(acc, dress, extU(stringProf(t, yS - 0.25, 0.12, 0.25), f.u0 - (ex > 0.3 ? t : 0.15), f.u1 + (ex > 0.3 ? t : 0.15)));
    for (const q of lower[nm]) if (q.grille) for (let i = 1; i < 6; i++) f.F.add(acc, 'oakD', boxB(0.08, q.ys - q.y0, 0.1, q.u - q.w / 2 + (q.w * i) / 6, q.y0, 0));
    if (nm === 'front') { stepsOut(f.F, acc, base, { u: 0, w: 3.6, t, h: ph, tread: 0.5 }); for (const u of [-16, 8]) stepsOut(f.F, acc, base, { u, w: 2.6, t, h: ph, tread: 0.5 }); }
    if (nm === 'left') stepsOut(f.F, acc, base, { u: 0, w: 2.6, t, h: ph, tread: 0.5 });
  }
  // tầng trên khung gỗ: ngưỡng, cột cách 1,5 m, đà giữa, thanh chéo kiểu «gậy xù xì» (ragged staff), ô trát vữa; khu chuồng ưng: cửa chớp gỗ
  const up = (Ff, u0, u1, yb, yt, mews0 = Infinity, loft = null, sg = 1) => {
    const wP = 0.05;
    Ff.add(acc, 'plaster', ext([[u0, yb], [u1, yb], [u1, yt], [u0, yt]], loft ? [outline({ ...loft, head: 'square' })] : null, 0.14, -0.07));
    Ff.add(acc, 'oakD', boxB(u1 - u0 + 0.1, 0.26, 0.3, (u0 + u1) / 2, yb, wP)); Ff.add(acc, 'oakD', boxB(u1 - u0 + 0.1, 0.24, 0.3, (u0 + u1) / 2, yt - 0.24, wP));
    const n = Math.max(1, Math.round((u1 - u0) / 1.5)), st = (u1 - u0) / n, ym = (yb + yt) / 2;
    for (let i = 0; i <= n; i++) Ff.add(acc, 'oakD', boxB(tw, yt - yb, tw, u0 + st * i, yb, wP + 0.02));
    for (let i = 0; i < n; i++) {
      const a = u0 + st * i, b = a + st, m = (a + b) / 2;
      if (loft && Math.abs(m - loft.u) < loft.w / 2 + st / 2) continue;
      if (sg * m > mews0) { for (let k = 0; k < 7; k++) { const g = box(st - tw, 0.05, 0.22, m, 0, 0); g.rotateX(-0.55); g.translate(0, yb + 0.45 + (k * (yt - yb - 0.7)) / 6.2, wP + 0.06); Ff.add(acc, 'oak', g); } continue; }
      Ff.add(acc, 'oakD', boxB(st, 0.18, 0.22, m, ym - 0.09, wP));
      const s1 = i % 2 ? 1 : -1, A = V(m - (s1 * st) / 2, yb + 0.2, wP + 0.05), B = V(m + (s1 * st) / 2, ym, wP + 0.05), C = V(m - (s1 * st) / 2, yt - 0.2, wP + 0.05);
      Ff.add(acc, 'oakD', beam(A, B, 0.18, 0.16)); Ff.add(acc, 'oakD', beam(B, C, 0.18, 0.16));
      for (const p of [A.clone().lerp(B, 0.5), B.clone().lerp(C, 0.5)]) Ff.add(acc, 'oakD', box(0.3, 0.12, 0.14, p.x - s1 * 0.12, p.y + 0.12, p.z)); // mấu «xù xì»
    }
  };
  const ld = { u: 0, w: 1.3, y0: yS + 0.3, ys: eave - 0.5 };
  up(fr.front.F, -L / 2, L / 2, yS, eave, mx0, ld); up(fr.back.F, -L / 2, L / 2, yS, eave, mx0, null, -1);
  fr.front.F.add(acc, 'boards', boxB(ld.w - 0.1, ld.ys - ld.y0, 0.08, 0, ld.y0, -0.25)); fr.front.F.add(acc, 'oakD', boxB(0.3, 0.3, 2.2, 0, eave - 0.3, 1.0)); fr.front.F.add(acc, 'iron', box(0.12, 0.36, 0.36, 0, eave - 0.55, 1.9)); fr.front.F.add(acc, 'iron', boxB(0.03, 1.8, 0.03, 0, eave - 2.55, 1.9));
  for (const [nm, sx] of [['left', -1], ['right', 1]]) { // đầu hồi khung gỗ + ván gió (bargeboard)
    const Ff = fr[nm].F, tp = TP50, gy = (u) => eave + (hd - Math.abs(u)) * tp;
    up(Ff, -hd, hd, yS, eave, sx > 0 ? -Infinity : Infinity);
    const tri = [[-hd, eave], [hd, eave], [0, gy(0)]]; Ff.add(acc, 'plaster', ext(tri, null, 0.14, -0.07));
    for (const u of [-hd / 2, 0, hd / 2]) Ff.add(acc, 'oakD', boxB(tw, gy(u) - eave - 0.1, tw, u, eave, 0.07));
    Ff.add(acc, 'oakD', boxB(D, 0.24, 0.3, 0, eave, 0.05)); Ff.add(acc, 'oakD', boxB(D * 0.5, 0.2, 0.26, 0, eave + hd * tp * 0.5, 0.05));
    for (const s2 of [-1, 1]) Ff.add(acc, 'oak', beam(V(s2 * (hd + 0.45), eave - 0.55, 0.55), V(0, gy(0) + 0.35, 0.55), 0.06, 0.4));
    Ff.add(acc, 'oak', boxB(0.14, 1.0, 0.14, 0, gy(0) + 0.1, 0.55));
  }
  for (const y of [yS]) F.add(acc, 'oak', boxB(L - 2 * t, 0.3, D - 2 * t, 0, y - 0.15, 0));
  const r = gableRoof(F, acc, 'clay', { xl: -L / 2 - 0.45, xr: L / 2 + 0.45, D, yE: eave, pitch: 50, ov: 0.5, th: 0.24, ridgeKey: 'ridgeClay' });
  F.add(acc, 'ridgeClay', new THREE.CylinderGeometry(0.17, 0.17, L + 0.9, 10).rotateZ(PI / 2).translate(0, r.yRidge + 0.14, 0));
  F.add(acc, 'floor', boxB(L - 2 * t, 0.3, D - 2 * t, 0, ph - 0.3, 0)); F.plat(acc, { x: 0, z: 0, w: L - 2 * t, d: D - 2 * t, top: ph });
  for (let x = -L / 2 + t + 1; x < mx0 - 0.5; x += 2.0) for (const sz of [-1, 1]) F.add(acc, 'oak', boxB(0.12, 1.4, 2.0, x, ph, sz * (hd - t - 1.0))); // vách ngăn chuồng (stall)
  F.add(acc, key, boxB(0.6, yS - ph, D - 2 * t, mx0, ph, 0));                                       // tường ngăn khu chuồng ưng
  for (let i = 0; i < 6; i++) F.add(acc, 'oak', boxB(0.1, 1.2, 0.1, mx0 + 1.5 + (i % 3) * 2.6, ph, -1 + Math.floor(i / 3) * 2.2)); // cọc đậu
  return { acc: finishUV(acc), info: infoOf(acc, { W: L, D, ph, eave, ridge: +r.yRidge.toFixed(1), storeys: 2, kind: 'mews' }) };
}

// ---------------------------------------------------------------- THÁP TRÒN (tháp góc Harlech / Bodiam / Conwy, đài canh)
export function roundTower(s) {
  const acc = new Acc(), F = Fr.at(), c = s.c, key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, r = s.r, yw = s.yw, bh = s.batter.h, bd = s.batter.d, gy = s.ground || 0;
  if (s.pad) { F.add(acc, base, boxB(s.pad.w, s.pad.h, s.pad.w, 0, 0, 0)); F.add(acc, dress, boxB(s.pad.w + 0.08, 0.12, s.pad.w + 0.08, 0, s.pad.h - 0.12, 0)); F.plat(acc, { x: 0, z: 0, w: s.pad.w, d: s.pad.w, top: s.pad.h }); stepsOut(F.sub(0, s.pad.w / 2, 0), acc, base, { u: 0, w: 2.2, t: 0, h: s.pad.h, w0: 0.02 }); }
  const y0 = s.pad ? s.pad.h : gy;
  acc.add(key, lathe([[0.001, y0], [r + bd, y0], [r + bd, y0 + 0.2], [r, y0 + bh], [r, yw], [0.001, yw]], 0, 0, 0, 44));
  acc.add(base, lathe([[0.001, y0 - 0.01], [r + bd + 0.03, y0 - 0.01], [r + bd + 0.03, y0 + 0.2], [r + bd * 0.12 + 0.03, y0 + bh * 0.88], [0.001, y0 + bh * 0.88]], 0, 0, 0, 44));
  const ring = (y, p = 0.14, hh = 0.26, rr = r) => acc.add(dress, lathe([[rr - 0.12, y], [rr + p, y], [rr + p, y + hh * 0.45], [rr + 0.01, y + hh], [rr - 0.12, y + hh], [rr - 0.12, y]], 0, 0, 0, 44));
  for (const y of s.strings || []) ring(y);
  ring(yw - 0.42, 0.22, 0.42);
  crenelRing(F, acc, key, dress, { r: r + 0.01, y: yw });
  acc.add('lead', cyl(r - 0.5, r - 0.5, 0.16, 0, yw - 0.16, 0, 32));
  // khe bắn / cửa sổ hai ô trên mặt cong (khung tiếp tuyến)
  const tang = (a, rr, y = 0) => F.sub(Math.cos(a) * rr, Math.sin(a) * rr, PI / 2 - a, y);
  for (const q of s.slits || []) { const Fq = tang(q.a, r + 0.02); const o = { u: 0, w: 0.14, y0: q.y, ys: q.y + (q.h || 1.6), cross: q.cross }; Fq.add(acc, 'dark', ext(holeOfSlit(o), null, 0.05, 0.0)); Fq.add(acc, dress, ext([[-0.34, o.y0 - 0.22], [0.34, o.y0 - 0.22], [0.34, o.ys + 0.22], [-0.34, o.ys + 0.22]], [holeOfSlit(o)], 0.05, -0.03)); }
  for (const q of s.wins || []) { const Fq = tang(q.a, r + 0.03); panelWindow(Fq, acc, dress, op(0, q.w || 1.3, q.y0, q.ys, { tr: q.tr || { n: 2, cusp: 3, oc: 3 }, head: q.head })); }
  { const dw = s.doorW || 1.5, dy = y0 + 0.02, Fq = tang(PI / 2, r + bd + 0.2); F.add(acc, key, boxB(dw + 1.4, 3.3, bd + 0.5, 0, y0, r + bd / 2 - 0.05)); Fq.add(acc, dress, boxB(dw + 1.6, 0.3, 0.3, 0, y0 + 3.2, -0.1)); panelWindow(Fq, acc, dress, op(0, dw, dy, dy + 1.8, { door: true })); }
  // tháp canh nhỏ mọc từ đường tuần tra
  const T = s.turret; let top = yw + CREN.bh + CREN.mh;
  if (T) {
    const rc = r - T.r - 0.15, tx = Math.cos(T.a) * rc, tz = Math.sin(T.a) * rc, th = yw + T.h;
    acc.add(key, cyl(T.r, T.r, th - yw + 0.3, tx, yw - 0.3, tz, 24));
    acc.add(dress, lathe([[T.r - 0.1, th - 0.38], [T.r + 0.16, th - 0.38], [T.r + 0.16, th - 0.22], [T.r + 0.01, th - 0.05], [T.r - 0.1, th - 0.05], [T.r - 0.1, th - 0.38]], tx, 0, tz, 24));
    crenelRing(F, acc, key, dress, { cx: tx, cz: tz, r: T.r + 0.01, y: th, c: { ...CREN, mw: 1.2, cw: 0.55, mh: 0.85, bh: 0.9, pt: 0.35 } });
    acc.add('lead', cyl(T.r - 0.3, T.r - 0.3, 0.12, tx, th - 0.12, tz, 18));
    for (const [aa, yy] of [[T.a, yw + 2.2], [T.a + 1.4, yw + 4.0], [T.a - 1.2, yw + 3.1]]) acc.add('dark', box(0.12, 0.9, 0.05, tx + Math.cos(aa) * (T.r + 0.01), yy, tz + Math.sin(aa) * (T.r + 0.01), PI / 2 - aa));
    { const aa = T.a + PI, Fq = F.sub(tx + Math.cos(aa) * (T.r + 0.02), tz + Math.sin(aa) * (T.r + 0.02), PI / 2 - aa); panelWindow(Fq, acc, dress, op(0, 0.8, yw, yw + 1.5, { door: true, hood: false })); }
    top = th + 0.9 + 0.85;
    if (T.flag) { acc.add('iron', cyl(0.06, 0.05, 4.5, tx, th, tz, 6)); const g = boxB(0.04, 1.1, 1.8, 0, 0, 0); g.translate(tx, th + 3.2, tz + 0.95); acc.add('cloth', g); top = th + 4.5; }
  }
  return { acc: finishUV(acc), info: infoOf(acc, { W: 2 * (r + bd), D: 2 * (r + bd), ph: s.pad ? s.pad.h : 0, wallWalk: yw, parapetTop: top, kind: 'roundTower' }) };
}
const holeOfSlit = (o) => holeOf({ ...o, slit: true });
/** cửa sổ / cửa dán trên mặt cong (không khoét tường): kính tối + song đá + khung + gờ mũ */
function panelWindow(Ff, acc, dress, o) {
  const ol = outline(o);
  if (o.door) { Ff.add(acc, 'door', ext(ol, null, 0.06, 0.0)); Ff.add(acc, dress, ext(frameArch(o, 0.18), null, 0.16, 0.0)); }
  else { Ff.add(acc, 'glass', ext(ol, null, 0.04, -0.02)); if (o.tr) Ff.add(acc, dress, ext(ol, traceryHoles(o), 0.08, 0.0)); Ff.add(acc, dress, ext(frameArch(o, 0.14), null, 0.14, 0.0)); Ff.add(acc, dress, boxB(o.w + 0.4, 0.14, 0.3, o.u, o.y0 - 0.2, 0.05)); }
  if (o.hood !== false && (o.head || 'equi') !== 'square') Ff.add(acc, dress, ext(hoodArch(o), null, 0.1, 0.1));
}

// ---------------------------------------------------------------- KHÁN ĐÀI ĐẤU THƯƠNG (khán đài gỗ trong Livre des tournois; Smithfield 1390)
export function stand(s) {
  const acc = new Acc(), F = Fr.at(), L = s.L, Dd = s.D, y1 = s.y1, y2 = s.y2, eave = s.eave, hd = Dd / 2, pd = 0.26;
  const xs = Array.from({ length: Math.round(L / 2) + 1 }, (_, i) => -L / 2 + (L * i) / Math.round(L / 2)), zs = [hd, 0, -hd];
  for (const x of xs) for (const z of zs) acc.add('chestnut', boxB(pd, z === 0 ? y2 + 0.2 : eave, pd, x, 0, z));
  for (const x of xs) for (const z of zs) acc.add('chestnut', boxB(0.5, 0.12, 0.5, x, 0, z));
  for (const y of [y1, y2]) { acc.add('boards', boxB(L + 0.3, 0.16, Dd + 0.3, 0, y - 0.16, 0)); for (const z of zs) acc.add('chestnut', boxB(L, 0.3, 0.22, 0, y - 0.46, z)); for (const x of xs) acc.add('chestnut', boxB(0.22, 0.3, Dd, x, y - 0.46, 0)); }
  // giằng chéo khung dưới
  for (let i = 0; i < xs.length - 1; i++) { const a = xs[i], b = xs[i + 1], s1 = i % 2 ? 1 : -1; acc.add('chestnut', beam(V(s1 > 0 ? a : b, 0.3, -hd), V(s1 > 0 ? b : a, y1 - 0.5, -hd), 0.14, 0.14)); }
  // bậc ghế ngồi trên sàn 1 và 2 (3 bậc), lan can trước treo vải thêu huy hiệu
  for (const y of [y1, y2]) {
    for (let k = 0; k < 3; k++) acc.add('boards', boxB(L - 0.4, 0.42 * (k + 1), 0.8, 0, y, -hd + 0.6 + k * 0.85 - 0.2));
    acc.add('chestnut', boxB(L + 0.2, 0.12, 0.16, 0, y + 1.0, hd + 0.05));
    for (const x of xs) acc.add('chestnut', boxB(0.12, 1.0, 0.12, x, y, hd + 0.05));
    const g = boxB(L, 1.25, 0.04, 0, y - 0.5, hd + 0.16); acc.add('cloth', g);
    for (let i = 0; i < 14; i++) { const x = -L / 2 + 0.5 + i * (L - 1) / 13; acc.add('cloth', ext([[-0.22, 0], [0.22, 0], [0, -0.4]], null, 0.04, 0).translate(x, y - 0.5, hd + 0.16)); }
  }
  // vải che tầng dưới hai bên và sau
  acc.add('cloth', boxB(L, y1 - 0.5, 0.04, 0, 0.3, -hd - 0.1)); for (const sx of [-1, 1]) acc.add('cloth', boxB(0.04, y1 - 0.5, Dd, sx * (L / 2 + 0.1), 0.3, 0));
  // mái ván hai dốc, đầu hồi để hở có ván gió; ô hoàng gia giữa nhô 1 m, mái cao hơn 1,5 m, đầu hồi ra trước
  const rr = gableRoof(F, acc, 'boards', { xl: -L / 2 - 0.4, xr: L / 2 + 0.4, D: Dd, yE: eave, pitch: s.pitch, ov: 0.5, th: 0.12, ridgeKey: 'chestnut' });
  const K = s.royal, kx = K.w / 2, kz0 = hd, kz1 = hd + K.out, ke = eave + K.up * 0.35;
  for (const x of [-kx, kx]) acc.add('chestnut', boxB(0.3, ke, 0.3, x, 0, kz1));
  acc.add('boards', boxB(K.w + 0.4, 0.16, K.out + 0.3, 0, y2 - 0.16, (kz0 + kz1) / 2)); acc.add('cloth', boxB(K.w, 1.3, 0.04, 0, y2 - 0.5, kz1 + 0.18)); acc.add('chestnut', boxB(K.w + 0.2, 0.12, 0.16, 0, y2 + 1.0, kz1 + 0.06));
  acc.add('cloth', boxB(K.w - 0.4, 2.6, 0.04, 0, y2 + 0.6, -hd + 0.25));                             // khăn hoàng gia (cloth of estate)
  const Fk = F.sub(0, 0, PI / 2), kr = gableRoof(Fk, acc, 'boards', { xl: -(kz1 + 0.3), xr: 0.5, D: K.w, yE: ke, pitch: 48, ov: 0.4, th: 0.12, ridgeKey: 'chestnut' });
  const gT = [[-kx, ke], [kx, ke], [0, ke + kx * Math.tan(48 * PI / 180)]]; acc.add('cloth', ext(gT, [foil(0, ke + 0.8, 0.45, 4, 0.3, 30)], 0.05, kz1 + 0.15));
  for (const sx of [-1, 1]) acc.add('chestnut', beam(V(sx * (kx + 0.45), ke - 0.4, kz1 + 0.6), V(0, kr.yRidge + 0.3, kz1 + 0.6), 0.06, 0.36));
  for (const sx of [-1, 1]) { const Fg = F.sub(sx * (L / 2 + 0.2), 0, sx * PI / 2); for (const s2 of [-1, 1]) Fg.add(acc, 'chestnut', beam(V(s2 * (hd + 0.5), eave - 0.5, 0.25), V(0, rr.yRidge + 0.2, 0.25), 0.06, 0.34)); Fg.add(acc, 'chestnut', boxB(Dd, 0.22, 0.2, 0, eave - 0.2, 0)); }
  // cờ hiệu: cột trên hai đầu nóc + đỉnh ô hoàng gia
  for (const [x, y, z, h] of [[-L / 2, rr.yRidge, 0, 3.5], [L / 2, rr.yRidge, 0, 3.5], [0, kr.yRidge, kz1, 4.2]]) { acc.add('chestnut', cyl(0.07, 0.05, h, x, y, z, 6)); acc.add('gold', lathe([[0.001, 0], [0.14, 0.1], [0.001, 0.28]], x, y + h, z, 8)); acc.add('cloth', ext([[0, 0], [2.2, -0.35], [0, -0.7]], null, 0.03, -0.015).translate(x, y + h - 0.2, z)); }
  // cầu thang gỗ phía sau: đất → sàn 1 (bên trái), sàn 1 → sàn 2 (bên phải, trong lòng)
  const flight = (xa, xb, z, ya, yb) => { const n = Math.round((yb - ya) / 0.18), rise = (yb - ya) / n, run = (xb - xa) / n; for (let i = 0; i < n; i++) { const x = xa + run * (i + 0.5); acc.add('boards', boxB(Math.abs(run) + 0.02, 0.06, 1.0, x, ya + rise * (i + 1) - 0.06, z)); F.plat(acc, { x, z, w: Math.abs(run), d: 1.0, top: ya + rise * (i + 1) }); } acc.add('chestnut', beam(V(xa, ya, z - 0.5), V(xb, yb, z - 0.5), 0.1, 0.3)); acc.add('chestnut', beam(V(xa, ya, z + 0.5), V(xb, yb, z + 0.5), 0.1, 0.3)); acc.add('chestnut', beam(V(xa, ya + 1.0, z - 0.55), V(xb, yb + 1.0, z - 0.55), 0.08, 0.08)); };
  flight(-L / 2 + 0.6, -L / 2 + 0.6 + 4.6, -hd - 0.7, 0, y1); flight(L / 2 - 0.6, L / 2 - 0.6 - 7.8, -hd - 0.7, 0, y2);
  F.plat(acc, { x: 0, z: 0, w: L, d: Dd, top: y1 }); F.plat(acc, { x: 0, z: 0, w: L, d: Dd, top: y2 }); F.plat(acc, { x: 0, z: (kz0 + kz1) / 2, w: K.w, d: K.out, top: y2 });
  // hàng rào gỗ thấp mép sân đấu (lists) phía trước
  for (let x = -L / 2; x <= L / 2 + 0.01; x += 2) acc.add('chestnut', boxB(0.14, 1.2, 0.14, x, 0, kz1 + 0.9));
  for (const y of [0.55, 1.1]) acc.add('chestnut', boxB(L, 0.1, 0.1, 0, y, kz1 + 0.9));
  return { acc: finishUV(acc), info: infoOf(acc, { W: L, D: Dd, ph: y1, eave, kind: 'stand' }) };
}

// ---------------------------------------------------------------- GIÀN VƯỜN QUẢ (herber / arbour: giàn mắt cáo gỗ phủ nho + hồng, ghế cỏ chữ U, đài nước)
export function arbour(s) {
  const acc = new Acc(), F = Fr.at(), W = s.W, hw = W / 2, H = s.colH, top = s.top, R = (() => { let a = 7; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
  acc.add('turf', boxB(W + 1.2, 0.08, W + 1.2, 0, 0, 0)); F.plat(acc, { x: 0, z: 0, w: W + 1.2, d: W + 1.2, top: 0.08 });
  const posts = []; for (let i = 0; i <= 4; i++) for (const z of [-hw, hw]) posts.push([-hw + (W * i) / 4, z]); for (let i = 1; i < 4; i++) for (const x of [-hw, hw]) posts.push([x, -hw + (W * i) / 4]);
  for (const [x, z] of posts) acc.add('willow', boxB(0.16, H, 0.16, x, 0.08, z));
  // vòm giàn: vòng cung dọc x mỗi 1 m, nan dọc mỗi 0,5 m
  const arcY = (z) => H + (top - H) * Math.sqrt(Math.max(0, 1 - (z / hw) ** 2));
  for (let x = -hw; x <= hw + 0.01; x += 1.0) { const pts = []; for (let i = 0; i <= 12; i++) { const z = -hw + (W * i) / 12; pts.push(V(x, arcY(z), z)); } acc.add('willow', ribAlong(pts, 0.08, 0.08)); }
  for (let z = -hw; z <= hw + 0.01; z += 0.5) acc.add('willow', box(W, 0.05, 0.05, 0, arcY(z) + 0.06, z));
  // mắt cáo ba mặt (trái, phải, sau) — lối vào mặt trước (+z)
  const lattice = (Ff, L) => { for (let k = -12; k <= 12; k++) { const a = k * 0.6; for (const s2 of [-1, 1]) { const u0 = Math.max(-L / 2, a - H / 2), u1 = Math.min(L / 2, a + H / 2); if (u1 - u0 < 0.1) continue; const y0 = 0.6 + (s2 > 0 ? u0 - (a - H / 2) : (a + H / 2) - u0) * ((H - 0.7) / H), y1 = 0.6 + (s2 > 0 ? u1 - (a - H / 2) : (a + H / 2) - u1) * ((H - 0.7) / H); Ff.add(acc, 'willow', beam(V(u0, y0, 0), V(u1, y1, 0), 0.05, 0.05)); } } };
  lattice(F.sub(0, -hw, 0), W); lattice(F.sub(-hw, 0, PI / 2), W); lattice(F.sub(hw, 0, PI / 2), W);
  // ghế cỏ chữ U: viền gạch, mặt cỏ
  const bench = [[0, -hw + 0.55, W - 0.6, 0.6], [-hw + 0.55, 0.3, 0.6, W - 1.7], [hw - 0.55, 0.3, 0.6, W - 1.7]];
  for (const [x, z, w, d] of bench) { acc.add('brick', boxB(w, 0.4, d, x, 0.08, z)); acc.add('turf', boxB(w - 0.06, 0.08, d - 0.06, x, 0.48, z)); F.plat(acc, { x, z, w, d, top: 0.56 }); }
  // đài nước nhỏ chảy tràn (bát giác)
  acc.add('dressS', polyCyl(8, 0.95, 0.95, 0.5, 0, 0.08, 0)); acc.add('water', polyCyl(8, 0.78, 0.78, 0.05, 0, 0.5, 0)); acc.add('dressS', lathe([[0.001, 0], [0.18, 0], [0.12, 0.6], [0.32, 0.75], [0.3, 0.85], [0.001, 0.9]], 0, 0.55, 0, 10));
  // tán nho + hồng leo phủ giàn (cụm lá dẹt, phân bố ngẫu nhiên tất định)
  const blob = (x, y, z, r, sy = 0.55) => { const g = new THREE.IcosahedronGeometry(r, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const k = 0.75 + 0.5 * R(); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * sy, p.getZ(i) * k); } g.translate(x, y, z); g.computeVertexNormals(); acc.add('leaf', g); };
  for (let i = 0; i < 70; i++) { const x = -hw + W * R(), z = -hw + W * R(); blob(x, arcY(z) + 0.12, z, 0.45 + 0.35 * R()); }
  for (const [x, z] of posts) { if (R() < 0.3) continue; for (let k = 0; k < 4; k++) blob(x + (R() - 0.5) * 0.25, 0.5 + k * 0.7 + R() * 0.2, z + (R() - 0.5) * 0.25, 0.2 + 0.08 * R(), 1.8); }
  for (let i = 0; i < 40; i++) { const x = -hw + W * R(), z = -hw + W * R(); acc.add('rose', new THREE.IcosahedronGeometry(0.09, 0).translate(x, arcY(z) + 0.38, z)); }
  return { acc: finishUV(acc), info: infoOf(acc, { W, D: W, ph: 0, colH: H, kind: 'arbour' }) };
}

// ---------------------------------------------------------------- LẦU 10 TẦNG: «Tháp Đại Bàng» (Eagle Tower, Caernarfon) theo đặc tả lầu của game
/**
 * ts = towerSpec(style) (tower.js). Thân đa giác n cạnh, tường dày (mặt trong ở a − 0,3 = vách va chạm của game), dải đá màu (Caernarfon),
 * giật cấp ở tầng có hành lang (gal): đường tuần tra trên hàng consol + lan can răng cưa; cửa sổ hai ô ở mặt chính tầng trên, khe bắn chữ thập;
 * chân xiên; bệ vuông có lan can răng cưa và bậc trước; đỉnh: lan can răng cưa + 3 tháp canh đa giác (đặt lệch, không đều) có tượng đại bàng.
 */
export function keep(ts, o = {}) {
  const acc = new Acc(), F = Fr.at(), n = ts.n, FH = ts.FH, P = ts.podium, c = o.c || 'B', key = 'wall' + c, dress = 'dress' + c, base = 'base' + c, out = 0.45;
  // bệ (chemise) vuông: khối đá chân xiên, gờ đầu, lan can răng cưa chừa miệng bậc, bậc trước
  F.add(acc, base, boxB(2 * P.a, P.y, 2 * P.a, 0, 0, 0)); F.plat(acc, { x: 0, z: 0, w: 2 * P.a, d: 2 * P.a, top: P.y });
  for (const [x, z, ry, L] of [[0, -P.a, PI, 2 * P.a], [P.a, 0, PI / 2, 2 * P.a], [-P.a, 0, -PI / 2, 2 * P.a]]) { const f = F.sub(x, z, ry); f.add(acc, base, extU([[-0.5, 0], [0.6, 0], [0, 1.6], [-0.5, 1.6]], -L / 2 - 0.6, L / 2 + 0.6)); f.add(acc, dress, extU([[-0.4, P.y - 0.3], [0.12, P.y - 0.3], [0.12, P.y], [-0.4, P.y]], -L / 2, L / 2)); crenelRun(f, acc, key, dress, { u0: -L / 2, u1: L / 2, y: P.y, wc: -CREN.pt / 2 }); }
  { const f = F.sub(0, P.a, 0), sw = P.stairW / 2 + 0.6; f.add(acc, base, extU([[-0.5, 0], [0.6, 0], [0, 1.6], [-0.5, 1.6]], -P.a - 0.6, P.a + 0.6)); f.add(acc, dress, extU([[-0.4, P.y - 0.3], [0.12, P.y - 0.3], [0.12, P.y], [-0.4, P.y]], -P.a, P.a));
    crenelRun(f, acc, key, dress, { u0: -P.a, u1: -sw, y: P.y, wc: -CREN.pt / 2 }); crenelRun(f, acc, key, dress, { u0: sw, u1: P.a, y: P.y, wc: -CREN.pt / 2 });
    for (let i = 0; i < P.steps; i++) { const z = P.run - (i + 0.5) * P.tread; f.add(acc, base, boxB(P.stairW, P.rise * (i + 1), P.tread, 0, 0, z)); f.plat(acc, { x: 0, z, w: P.stairW, d: P.tread + 0.02, top: P.rise * (i + 1) }); }
    for (const sx of [-1, 1]) { f.add(acc, key, ext([[0, 0], [P.run, 0], [P.run, 1.0], [0.0, P.y + 1.0]], null, 0.6, -0.3).rotateY(-PI / 2).translate(sx * (P.stairW / 2 + 0.3), 0, 0)); }
  }
  // thân: mỗi tầng 8 mặt tường có lỗ (cửa, cửa sổ hai ô, khe chữ thập)
  const rot = 0, fronts = (sd) => sd.nz > 0.99, backs = (sd) => sd.nz < -0.99;
  ts.floors.forEach((f, k) => {
    const ao = f.a + out, tw = out + 0.3, wc = ao - tw / 2, y0 = k ? f.y - 0.45 : P.y - 0.6, y1 = f.y + FH - (k === ts.floors.length - 1 ? 0 : 0);
    for (const sd of psides(n, wc, rot)) {
      const L = 2 * ao * Math.tan(PI / n), ops = [], card = Math.abs(sd.nx) > 0.99 || Math.abs(sd.nz) > 0.99;
      const door = (fronts(sd) && (k === 0 || f.gal)) || (backs(sd) && f.gal);
      if (door) ops.push(op(0, 2.4, f.y, f.y + 2.5, { door: true }));
      if (!door && card && k > 0) ops.push(op(0, 1.7, f.y + 1.1, f.y + 2.9, { tr: { n: 2, cusp: 3, oc: 3 } }));
      if (!card || k === 0) { if (!door) ops.push(op(0, 0.16, f.y + 1.2, f.y + 3.2, { slit: true, cross: true })); else { ops.push(op(-L / 2 + 1.6, 0.16, f.y + 1.4, f.y + 3.0, { slit: true })); ops.push(op(L / 2 - 1.6, 0.16, f.y + 1.4, f.y + 3.0, { slit: true })); } }
      if (card && k > 0 && !door) { ops.push(op(-L / 2 + 1.7, 0.16, f.y + 1.5, f.y + 3.0, { slit: true })); ops.push(op(L / 2 - 1.7, 0.16, f.y + 1.5, f.y + 3.0, { slit: true })); }
      const Ff = F.sub(sd.mx, sd.mz, sd.ry);
      wallFace(Ff, acc, { key, dress, u0: -L / 2, u1: L / 2, yb: y0, top: y1, t: tw, ops });
      if (k === 0) for (const [ua, ub] of door ? [[-L / 2, -1.75], [1.75, L / 2]] : [[-L / 2, L / 2]]) { const ea = ua < -L / 2 + 0.01 ? 0.62 : 0, eb = ub > L / 2 - 0.01 ? 0.62 : 0; Ff.add(acc, base, prism([V(ua - ea, P.y - 0.2, tw / 2 + 1.0), V(ub + eb, P.y - 0.2, tw / 2 + 1.0), V(ub + eb * 0.08, P.y + 3.2, tw / 2 - 0.02), V(ua - ea * 0.08, P.y + 3.2, tw / 2 - 0.02)], 1.0)); } // chân xiên (chừa lối cửa)
    }
    // giật cấp ở tầng có hành lang: sàn đá trên hàng consol 3 bậc, lan can răng cưa ở mép
    if (f.gal && k > 0) {
      const aPrev = ts.floors[k - 1].a + out, aS = f.slabA;
      F.add(acc, dress, polyCyl(n, aS, aS, 0.42, 0, f.y - 0.42, 0));
      for (const sd of psides(n, aPrev, rot)) { const Ff = F.sub(sd.mx, sd.mz, sd.ry), m = Math.max(2, Math.round(sd.len / 1.3)); for (let i = 0; i <= m; i++) { const u = -sd.len / 2 + 0.4 + ((sd.len - 0.8) * i) / m; Ff.add(acc, dress, extU([[-0.3, f.y - 1.3], [0.12, f.y - 1.3], [0.12, f.y - 1.0], [(aS - aPrev) * 0.6, f.y - 0.85], [(aS - aPrev) * 0.6, f.y - 0.6], [aS - aPrev, f.y - 0.42], [-0.3, f.y - 0.42]], u - 0.2, u + 0.2)); } }
      crenelPoly(F, acc, key, dress, { n, ac: aS - CREN.pt / 2, y: f.y, rot });
    }
    // gờ chỉ đầu mỗi tầng (dải ngang)
    if (k > 0 && !f.gal) F.add(acc, dress, polyCyl(n, ao + 0.12, ao + 0.12, 0.22, 0, f.y - 0.3, 0));
  });
  // đỉnh: sàn chì, gờ chỉ, lan can răng cưa; 3 tháp canh bát giác đặt lệch có tượng đại bàng
  const D = ts.deck, aT = D.a + out;
  F.add(acc, 'lead', polyCyl(n, D.a + 0.2, D.a + 0.2, 0.2, 0, D.y - 0.2, 0)); F.add(acc, dress, polyCyl(n, aT + 0.22, aT + 0.22, 0.4, 0, D.y - 0.5, 0));
  crenelPoly(F, acc, key, dress, { n, ac: aT - CREN.pt / 2 + 0.05, y: D.y, rot });
  const vs = pverts(n, aT, rot), tops = [];
  for (const [vi, hh] of [[0, o.turretH || 13], [3, (o.turretH || 13) - 1.6], [5, (o.turretH || 13) + 0.8]]) {
    const [vx, vz] = vs[vi], rr = Math.hypot(vx, vz), cx = (vx / rr) * (rr - 1.2), cz = (vz / rr) * (rr - 1.2), ta = o.turretA || 3, th = D.y + hh;
    F.add(acc, key, polyCyl(8, ta, ta, th - D.y + 1.0, cx, D.y - 1.0, cz)); F.add(acc, dress, polyCyl(8, ta + 0.18, ta + 0.18, 0.35, cx, th - 0.4, cz));
    for (const y of [D.y + 2.5, D.y + 6.5]) F.add(acc, dress, polyCyl(8, ta + 0.1, ta + 0.1, 0.2, cx, y, cz));
    for (const sd of psides(8, ta, 0)) { const Ff = F.sub(cx + sd.mx, cz + sd.mz, sd.ry); const hi = sd.k % 2 === 0; if (hi) panelWindow(Ff, acc, dress, op(0, 1.0, D.y + 3.4, D.y + 4.9, { tr: { n: 2, cusp: 3, oc: -1 } })); else Ff.add(acc, 'dark', boxB(0.14, 1.3, 0.05, 0, D.y + 7.6 + (sd.k % 3) * 0.6, 0.02)); }
    crenelPoly(F.sub(cx, cz, 0), acc, key, dress, { n: 8, ac: ta - 0.2, y: th, c: { ...CREN, mw: 1.4, cw: 0.6 } });
    F.add(acc, 'lead', polyCyl(8, ta - 0.4, ta - 0.4, 0.15, cx, th - 0.1, cz));
    const ang = Math.atan2(cz, cx), [mxv, mzv] = [cx + Math.cos(ang) * (ta - 0.2), cz + Math.sin(ang) * (ta - 0.2)];
    silh(F, acc, dress, EAGLE, 1.5, 0.45, mxv, th + CREN.bh + CREN.mh, mzv, PI / 2 - ang);
    tops.push(th + CREN.bh + CREN.mh + 2.3);
  }
  return { acc: finishUV(acc), info: infoOf(acc, { W: 2 * P.a, D: 2 * P.a, ph: P.y, n, floors: ts.floors.length, a: ts.floors.map((f) => f.a), kind: 'tower' }) };
}
