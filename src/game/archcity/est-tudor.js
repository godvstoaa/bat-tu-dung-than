// ============================================================================
//  HỌ TUDOR cho biệt phủ (docs/bietphu/mughal-tudor.md) — bộ cấu kiện Gothic Anh của tiên phủ (tienphu/arch/go-kit.js —
//  CHỈ import: khung Fr, ext, mái hai dốc gableRoof, cửa vòm bốn tâm, lan can răng cưa, góc đá quoins) + vật liệu lặp
//  theo mét (archcity/mats.js: gạch đỏ, vữa vôi, gỗ sồi sẫm, đá vàng).
//  Nguyên mẫu (docs/tienphu-nghiencuu/04-gothic.md + nguồn ngoài, xem doc):
//   · nhà: Little Moreton Hall (Cheshire, 1504–1610 — khung gỗ lộ đen trên vữa trắng, tầng trên nhô (jetty) 0,4 m mỗi tầng,
//     ô tứ diệp (quatrefoil), dãy cửa sổ liền «long gallery» tầng áp mái, đầu hồi gỗ có diềm chạm) + Compton Wynyates
//     (tầng trệt gạch đỏ, cửa sổ đá song đứng – song ngang, cửa sổ lồi (bay), ống khói gạch xoắn chụm 3).
//   · tháp: Anne Boleyn's Gate / Clock Court, Hampton Court — tháp gạch 4 tháp góc bát giác nắp chì hình củ, lan can răng cưa,
//     mặt đồng hồ, chòi chuông gỗ trên mái.
//   · đình: nhà vườn khung gỗ (banqueting house) — trụ + thanh giằng cong vòm bốn tâm, lan can tiện, đầu hồi gỗ chạm.
//   · cổng: Great Gatehouse Hampton Court — vòm bốn tâm (Tudor arch) xuyên, tháp góc bát giác, cửa sổ lồi đá trên vòm, răng cưa.
//  Khuôn lô (estatekit.js): vách tầng trệt trên chu vi w × d, cửa giữa +z (và −z nếu back) mở, sàn trong ở b.plinth trống.
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, cyl, lathe, beam, V, Fr, ext, outline, foil, gableRoof, quoins, crenelRun, crenelPoly, polyCyl, goMats, finishUV } from '../tienphu/arch/go-kit.js';
import { loft, archCurve } from '../tienphu/arch/mg-kit.js';
import { tiled, retex, consolidate } from './mats.js';

const PI = Math.PI;
const rect = (u0, y0, u1, y1) => [[u0, y0], [u1, y0], [u1, y1], [u0, y1]];
/** lỗ vòm Tudor (bốn tâm dẹt, đỉnh hơi nhọn: cao vòm 0,3 w) — nới ra e mỗi phía; đường vòm lấy archCurve của mg-kit */
function tudorHole({ u = 0, w, y0, ys, rise = w * 0.3 }, e = 0) { return [[u - w / 2 - e, y0 - e], [u + w / 2 + e, y0 - e], ...archCurve(u, ys, w / 2 + e, rise + e * 0.7)]; }
/** tấm chạm spandrel trên vòm Tudor: chữ nhật u ± (w/2 + m), từ chân vòm ys tới yTop, trừ lòng vòm */
function spandrelPoly(u, w, ys, rise, yTop, m = 0.06) { const c = archCurve(u, ys, w / 2, rise); return [[u + w / 2 + m, ys], [u + w / 2 + m, yTop], [u - w / 2 - m, yTop], [u - w / 2 - m, ys], ...[...c].reverse()]; }
let OV = null;
/** vật liệu lặp theo mét (≥ 256 px/m) cho mọi mặt lớn; mái ngói đất nung + kính chì lấy của goMats (256 / 427 px/m) */
function over() {
  if (OV) return OV;
  const timber = tiled('plank', '#3a2b22', { rough: 0.9 }), stone = tiled('stone', '#cdbb93', { rough: 1 });
  OV = {
    brick: tiled('brick', '#b4644a', { rough: 1, bump: 1.3 }), brickD: tiled('brick', '#8e4b38', { rough: 1, bump: 1.3 }),
    plaster: tiled('plaster', '#efe7d4', { rough: 1 }), timber, carveT: timber, lattice: timber,
    dress: stone, plinthS: tiled('stone', '#a99a7c', { rough: 1 }), stepS: tiled('stone', '#b5a586', { rough: 1 }), floorS: tiled('stone', '#8f8a7e', { rough: 1 }),
  };
  return OV;
}
let RM = null;
const roofMat = () => (RM ||= (() => { const c = goMats().clay; const m = c.clone(); m.color = new THREE.Color('#7c726e'); m.side = THREE.DoubleSide; return m; })());
const matsOf = () => ({ ...goMats(), ...over(), clay: roofMat(), dial: new THREE.MeshStandardMaterial({ color: '#22355e', roughness: 0.5 }) });
const post = (g) => { retex(g, over()); return consolidate(g); };
const done = (acc, info) => { finishUV(acc); return { acc, mats: matsOf(), post, info }; };
const bx = (F, acc, key, u0, u1, y0, y1, w0, w1) => F.add(acc, key, boxB(u1 - u0, y1 - y0, w1 - w0, (u0 + u1) / 2, y0, (w0 + w1) / 2));

// ---------------------------------------------------------------- cửa sổ đá song đứng (Compton Wynyates) trong tường dày t (mặt ngoài w = t/2)
function stoneWin(F, acc, { u, w, y0, h, n = 3, transom = true }, t) {
  const f = t / 2;
  bx(F, acc, 'glass', u - w / 2, u + w / 2, y0, y0 + h, f - t * 0.62, f - t * 0.58);
  for (const s of [-1, 1]) bx(F, acc, 'dress', u + s * (w / 2) - 0.1 + s * 0.1, u + s * (w / 2) + 0.1 + s * 0.1, y0 - 0.12, y0 + h + 0.2, f - 0.3, f + 0.07);
  bx(F, acc, 'dress', u - w / 2 - 0.2, u + w / 2 + 0.2, y0 + h, y0 + h + 0.22, f - 0.3, f + 0.07);
  bx(F, acc, 'dress', u - w / 2 - 0.26, u + w / 2 + 0.26, y0 - 0.16, y0, f - 0.3, f + 0.14);
  for (let i = 1; i < n; i++) bx(F, acc, 'dress', u - w / 2 + (i * w) / n - 0.06, u - w / 2 + (i * w) / n + 0.06, y0, y0 + h, f - 0.36, f - 0.12);
  if (transom) bx(F, acc, 'dress', u - w / 2, u + w / 2, y0 + h * 0.62, y0 + h * 0.62 + 0.11, f - 0.36, f - 0.12);
  // gờ mũ (label) có hai đầu thả
  bx(F, acc, 'dress', u - w / 2 - 0.42, u + w / 2 + 0.42, y0 + h + 0.24, y0 + h + 0.38, f, f + 0.17);
  for (const s of [-1, 1]) bx(F, acc, 'dress', u + s * (w / 2 + 0.28) - 0.07, u + s * (w / 2 + 0.28) + 0.07, y0 + h + 0.02, y0 + h + 0.38, f, f + 0.17);
}
/** cửa đi vòm bốn tâm (Tudor arch) mở: khung đá hai lớp, hai cánh gỗ mở vào sát má cửa (không chặn lối) */
function tudorDoor(F, acc, { u = 0, w, y0, ys }, t, leaves = true) {
  const f = t / 2, o = { u, w, y0, ys };
  F.add(acc, 'dress', ext(tudorHole(o, 0.3), [tudorHole(o)], 0.18, f - 0.08));
  F.add(acc, 'dress', ext(tudorHole(o, 0.12), [tudorHole(o)], t * 0.7, f - t * 0.66));
  // spandrel + gờ mũ vuông trên vòm bốn tâm
  const top = ys + w * 0.3 + 0.5;
  bx(F, acc, 'dress', u - w / 2 - 0.5, u + w / 2 + 0.5, top, top + 0.16, f, f + 0.18);
  for (const s of [-1, 1]) bx(F, acc, 'dress', u + s * (w / 2 + 0.36) - 0.07, u + s * (w / 2 + 0.36) + 0.07, ys - 0.1, top + 0.16, f, f + 0.18);
  if (leaves) { const lw = w / 2 - 0.1, lh = ys - y0 + w * 0.18; for (const s of [-1, 1]) F.add(acc, 'door', boxB(0.09, lh, lw, u + s * (w / 2 - 0.06), y0, f - t + 0.05 - lw / 2)); }
}

// ---------------------------------------------------------------- tường khung gỗ lộ (half-timber) trên vữa: hình học thật
/**
 * tường mặt F (mặt ngoài w = t/2), u0..u1, y0..y1. wins: [{ u, w, h }] cùng bậu sill (cao tuyệt đối), đầu cửa = sill + h.
 * low: hoa văn dải dưới bậu — 'stud' (song dày 0,55 m) | 'quatre' (ô tứ diệp Little Moreton) | 'chev' (giằng chữ V)
 */
function timberWall(F, acc, { u0, u1, y0, y1, t = 0.3, wins = [], sill, low = 'stud', studs = 0.55 }) {
  const f = t / 2, tw = f + 0.07, wf = f - 0.04, holes = wins.map((o) => rect(o.u - o.w / 2, sill, o.u + o.w / 2, sill + o.h));
  F.add(acc, 'plaster', ext(rect(u0, y0, u1, y1), holes, t, -f));
  const T = (key, a, b, ya, yb, w0 = wf, w1 = tw) => bx(F, acc, key, a, b, ya, yb, w0, w1);
  T('timber', u0, u1, y0, y0 + 0.26); T('timber', u0, u1, y1 - 0.24, y1);
  const yh = wins.length ? Math.max(...wins.map((o) => sill + o.h)) : y0 + (y1 - y0) * 0.75;
  T('timber', u0, u1, sill - 0.18, sill); T('timber', u0, u1, yh, yh + 0.2);
  // trụ: hai đầu + má mọi cửa sổ + trụ chính mỗi ~2,4 m
  const posts = [u0 + 0.15, u1 - 0.15];
  for (const o of wins) posts.push(o.u - o.w / 2 - 0.1, o.u + o.w / 2 + 0.1);
  for (let u = u0 + 2.4; u < u1 - 1.2; u += 2.4) if (!wins.some((o) => Math.abs(u - o.u) < o.w / 2 + 0.6) && !posts.some((p) => Math.abs(p - u) < 0.9)) posts.push(u);
  for (const p of posts) T('timber', p - 0.13, p + 0.13, y0, y1);
  const free = (u, band) => !posts.some((p) => Math.abs(p - u) < 0.3) && !(band === 1 && wins.some((o) => Math.abs(u - o.u) < o.w / 2 + 0.12));
  const bands = [[y0 + 0.26, sill - 0.18], [sill, yh], [yh + 0.2, y1 - 0.24]];
  bands.forEach(([ya, yb], bi) => {
    if (yb - ya < 0.25) return;
    if (bi === 0 && low !== 'stud') {
      // dải dưới: ô vuông giữa các trụ (bỏ trụ phụ), mỗi ô một tứ diệp hoặc giằng chữ V
      const ps = [...posts].sort((a, b) => a - b);
      for (let i = 0; i < ps.length - 1; i++) {
        const a = ps[i] + 0.13, b = ps[i + 1] - 0.13, L = b - a, m = Math.max(1, Math.round(L / (yb - ya)));
        for (let k = 0; k < m; k++) {
          const c0 = a + (L * k) / m, c1 = a + (L * (k + 1)) / m, cu = (c0 + c1) / 2, cy = (ya + yb) / 2, r = Math.min(c1 - c0, yb - ya) * 0.46;
          if (k) T('timber', c0 - 0.08, c0 + 0.08, ya, yb);
          if (low === 'quatre' && r > 0.18) F.add(acc, 'carveT', ext(foil(cu, cy, r, 4, 0.34, 24), [foil(cu, cy, r * 0.74, 4, 0.34, 24)], 0.1, wf));
          else for (const s of [-1, 1]) F.add(acc, 'carveT', beam(V(cu, ya + 0.02, tw - 0.05), V(cu + s * (c1 - c0) * 0.45, yb - 0.02, tw - 0.05), 0.1, 0.13));
        }
      }
      return;
    }
    for (let u = u0 + studs; u < u1 - 0.2; u += studs) if (free(u, bi)) T('timber', u - 0.085, u + 0.085, ya, yb, wf, tw - 0.02);
  });
  // ô kính chì: kính lùi, song gỗ đứng mỗi ~0,45 m + song ngang
  for (const o of wins) {
    bx(F, acc, 'glass', o.u - o.w / 2, o.u + o.w / 2, sill, sill + o.h, f - t * 0.7, f - t * 0.66);
    const n = Math.max(2, Math.round(o.w / 0.48));
    for (let i = 1; i < n; i++) bx(F, acc, 'lattice', o.u - o.w / 2 + (i * o.w) / n - 0.045, o.u - o.w / 2 + (i * o.w) / n + 0.045, sill, sill + o.h, f - t * 0.66, f - 0.02);
    if (o.h > 1.3) bx(F, acc, 'lattice', o.u - o.w / 2, o.u + o.w / 2, sill + o.h * 0.64, sill + o.h * 0.64 + 0.08, f - t * 0.66, f - 0.02);
  }
}
/** dầm nhô (jetty): dầm bressumer chạm + đầu dầm sàn + ván bụng giữa mặt dưới (w0) và mặt trên (w1) — cao y */
function jetty(F, acc, { u0, u1, y, w0, w1 }) {
  bx(F, acc, 'timber', u0, u1, y - 0.34, y + 0.02, w1 - 0.26, w1 + 0.02);
  bx(F, acc, 'timber', u0, u1, y - 0.36, y - 0.3, w0 - 0.1, w1);
  for (let u = u0 + 0.3; u < u1 - 0.2; u += 0.55) bx(F, acc, 'carveT', u - 0.07, u + 0.07, y - 0.5, y - 0.36, w0 - 0.05, w1 - 0.1);
}
/** đầu hồi gỗ trong khung Fg (u ngang hồi, mặt ngoài w = 0,15): tam giác vữa + xà, trụ vua, xà kẹp, song, giằng xương cá,
 *  ván diềm chạm theo mái (vươn ov) + chóp và quả treo; win: cửa sổ ở chân hồi */
function timberGable(Fg, acc, { h, yb, tp, ov = 0.45, win = null, herring = true, finial = true }) {
  const t = 0.3, f = 0.15, tw = f + 0.07, wf = f - 0.04, ya = yb + h * tp, Y = (u) => yb + (h - Math.abs(u)) * tp;
  const holes = win ? [rect(-win.w / 2, yb + 0.5, win.w / 2, yb + 0.5 + win.h)] : [];
  Fg.add(acc, 'plaster', ext([[-h, yb], [h, yb], [0, ya]], holes, t, -f));
  bx(Fg, acc, 'timber', -h, h, yb, yb + 0.26, wf, tw);
  const yc = yb + (ya - yb) * 0.5, hc = h * 0.5;
  bx(Fg, acc, 'timber', -hc, hc, yc - 0.11, yc + 0.11, wf, tw);
  bx(Fg, acc, 'timber', -0.13, 0.13, win ? yb + 0.5 + win.h : yb, ya - 0.2, wf, tw);
  for (const s of [-1, 1]) Fg.add(acc, 'timber', beam(V(s * (h - 0.15), yb + 0.15, f + 0.02), V(0, ya - 0.1, f + 0.02), 0.11, 0.24));
  // song đứng dưới xà kẹp (bỏ chỗ cửa sổ), giằng xương cá trên xà kẹp
  for (let u = -h + 0.6; u < h - 0.4; u += 0.55) { if (Math.abs(u) < 0.35 || (win && Math.abs(u) < win.w / 2 + 0.15)) continue; const top = Math.min(yc - 0.11, Y(u) - 0.25); if (top - yb > 0.5) bx(Fg, acc, 'timber', u - 0.08, u + 0.08, yb + 0.26, top, wf, tw - 0.02); }
  if (herring) for (let k = 0; k < 6; k++) { const yy = yc + 0.25 + k * 0.5, hw = Math.max(0, (ya - yy) / tp - 0.35); if (hw < 0.5) break; for (const s of [-1, 1]) Fg.add(acc, 'carveT', beam(V(s * 0.15, yy + 0.3, tw - 0.05), V(s * Math.min(hw, 1.1), yy, tw - 0.05), 0.09, 0.12)); }
  if (win) { bx(Fg, acc, 'glass', -win.w / 2, win.w / 2, yb + 0.5, yb + 0.5 + win.h, -0.05, -0.01); const n = Math.max(2, Math.round(win.w / 0.48)); for (let i = 1; i < n; i++) bx(Fg, acc, 'lattice', -win.w / 2 + (i * win.w) / n - 0.045, -win.w / 2 + (i * win.w) / n + 0.045, yb + 0.5, yb + 0.5 + win.h, -0.01, f); bx(Fg, acc, 'timber', -win.w / 2 - 0.2, win.w / 2 + 0.2, yb + 0.36, yb + 0.5, wf, tw + 0.05); }
  // ván diềm (bargeboard) theo mái + chóp (finial) + quả treo (pendant)
  const hb = h + ov, yE = ya - hb * tp;
  for (const s of [-1, 1]) Fg.add(acc, 'carveT', beam(V(s * hb, yE - 0.12, f + ov * 0.55), V(0, ya + 0.12, f + ov * 0.55), 0.08, 0.42));
  if (!finial) return ya;
  Fg.add(acc, 'carveT', boxB(0.22, 1.0, 0.22, 0, ya - 0.55, f + ov * 0.55));
  Fg.add(acc, 'carveT', lathe([[0.001, 0], [0.15, 0.04], [0.08, 0.18], [0.15, 0.3], [0.001, 0.48]], 0, ya + 0.45, f + ov * 0.55, 8));
  Fg.add(acc, 'carveT', lathe([[0.001, 0], [0.13, 0.25], [0.07, 0.45], [0.12, 0.6], [0.001, 0.7]], 0, ya - 1.3, f + ov * 0.55, 8));
  return ya;
}

// ---------------------------------------------------------------- ống khói gạch xoắn chụm (Compton Wynyates / Hampton Court)
function twistShaft(acc, x, z, y0, h, r = 0.3, dir = 1) {
  const secs = [];
  for (let s = 0; s <= 6; s++) { const y = y0 + (h * s) / 6, rot = (dir * s * PI) / 9, sec = []; for (let k = 0; k < 8; k++) { const a = rot + (k * PI) / 4, rr = k % 2 ? r * 0.78 : r; sec.push(V(x + Math.cos(a) * rr, y, z + Math.sin(a) * rr)); } secs.push(sec); }
  acc.add('brick', loft(secs));
  acc.add('brickD', polyCyl(8, r * 1.05, r * 1.05, 0.3, x, y0 - 0.05, z));
  acc.add('brickD', polyCyl(8, r * 1.2, r * 1.3, 0.35, x, y0 + h, z));
}
/** khối ống khói: thân gạch (x, z) rộng bw (dọc ax), sâu bd, từ y0 tới y1, rồi n ống xoắn cao hs; ax = 'x' | 'z' hướng hàng ống */
function stack(acc, { x, z, y0, y1, bw, bd, n = 3, hs = 2.4, ax = 'x' }) {
  const W = ax === 'x' ? bw : bd, D = ax === 'x' ? bd : bw;
  acc.add('brick', boxB(W, y1 - y0, D, x, y0, z));
  acc.add('brickD', boxB(W + 0.22, 0.28, D + 0.22, x, y1 - 0.5, z)); acc.add('dress', boxB(W + 0.14, 0.14, D + 0.14, x, y1, z));
  const sp = bw / n;
  for (let i = 0; i < n; i++) { const o = -bw / 2 + sp * (i + 0.5); twistShaft(acc, ax === 'x' ? x + o : x, ax === 'x' ? z : z + o, y1 + 0.14, hs, Math.min(0.34, sp * 0.4), i % 2 ? -1 : 1); }
  return y1 + 0.14 + hs + 0.35;
}

/** nền đá (w + 2,4) × (d + 2,4) cao P + bậc giữa trước (và sau nếu back) */
function basePlinth(acc, b) {
  const PW = b.w + 2.4, PD = b.d + 2.4, h = b.plinth, sw = Math.min(6, b.w * 0.3);
  acc.add('plinthS', boxB(PW, h - 0.12, PD, 0, 0, 0)); acc.add('dress', boxB(PW + 0.12, 0.14, PD + 0.12, 0, h - 0.14, 0));
  acc.add('floorS', boxB(PW - 0.1, 0.03, PD - 0.1, 0, h - 0.01, 0)); acc.plat({ x: 0, z: 0, w: PW, d: PD, top: h });
  for (const sz of b.back ? [1, -1] : [1]) {
    const n = Math.max(2, Math.round(h / 0.16)), rise = h / n, tr = 0.33;
    for (let i = 0; i < n; i++) { const dist = tr * (n - i - 0.5), cz = sz * (PD / 2 + dist), top = rise * (i + 1); acc.add('stepS', box(sw, top, tr + 0.01, 0, top / 2, cz)); acc.plat({ x: 0, z: cz, w: sw, d: tr + 0.02, top }); }
    for (const s of [-1, 1]) acc.add('plinthS', boxB(0.5, h * 0.7, n * tr, s * (sw / 2 + 0.25), 0, sz * (PD / 2 + (n * tr) / 2)));
  }
}

// ============================================================================ NHÀ
/**
 * Trang viên Tudor: tầng trệt gạch (cửa sổ đá, cửa sổ lồi, góc đá), tầng trên khung gỗ nhô 0,4 m / tầng (mặt trước + sau),
 * tầng trên cùng «long gallery» dãy kính liền; mái ngói 47° đầu hồi gỗ; hồi ngang (cross gable) trên mặt tiền; khối cửa
 * (porch) nhô ở giữa; ống khói gạch xoắn ở hai đầu hồi và trên nóc.
 */
function hall(styleId, S, b, opt = {}) {
  const villa = !!opt.villa, main = b.id === 'main' && !villa, acc = new Acc();
  const hw = b.w / 2, hd = b.d / 2, P = b.plinth, n = Math.max(1, b.floors || Math.round(b.h / 4.2)), sh = b.h / n, yT = P + b.h, tB = 0.6, tT = 0.3, J = 0.4;
  basePlinth(acc, b);
  const jet = (s) => (s === 0 ? 0 : Math.min(s, 2) * J);         // nhô theo tầng (tối đa 2 bậc)
  const plane = (s) => hd + jet(s);
  const pitch = 47, tp = Math.tan((pitch * PI) / 180);
  // ---- bố trí ô mặt tiền: khối cửa giữa (rộng pw), cửa sổ lồi hai bên, cửa sổ thường ra tới đầu hồi
  const pw = clamp(b.w * 0.14, 3.6, 4.8), porch = b.w >= 14, pd = 1.1;
  const slotsOf = (L, avoid) => { const out = []; const m = Math.max(1, Math.round((L - avoid) / 3.6)); for (let i = 0; i < m; i++) out.push(avoid + ((L - avoid) * (i + 0.5)) / m); return out; };
  const sideU = slotsOf(hw - 0.9, porch ? pw / 2 + 0.6 : 1.8);                         // tâm ô ở nửa phải (đối xứng)
  const bayU = main && sideU.length >= 3 ? sideU[0] : null;                               // cửa sổ lồi ở ô trong cùng
  // ---- tầng trệt gạch: trước / sau / hai đầu
  const faces = [
    { F: Fr.at(0, hd - tB / 2, 0), L: hw, door: true, front: true },
    { F: Fr.at(0, -(hd - tB / 2), PI), L: hw, door: !!b.back, front: false },
  ];
  for (const fc of faces) {
    const F = fc.F, wins = [], holes = [];
    const doorW = 2.6, ys = P + 2.25;
    for (const s of [-1, 1]) for (const u of sideU) {
      const uu = s * u, isBay = fc.front && bayU != null && Math.abs(u - bayU) < 1e-6;
      if (isBay) { holes.push(rect(uu - 1.3, P + 0.85, uu + 1.3, P + 3.3)); continue; }
      const w = u > hw - 2.4 ? 1.5 : 2.1; wins.push({ u: uu, w, y0: P + 1.0, h: 2.1, n: w > 2 ? 3 : 2 });
    }
    if (fc.door) holes.push(tudorHole({ u: 0, w: doorW, y0: P, ys }));
    else wins.push({ u: 0, w: 1.8, y0: P + 1.0, h: 2.1, n: 3 });
    F.add(acc, 'brick', ext(rect(-hw, P, hw, P + sh), [...holes, ...wins.map((o) => rect(o.u - o.w / 2, o.y0, o.u + o.w / 2, o.y0 + o.h))], tB, -tB / 2));
    for (const o of wins) stoneWin(F, acc, o, tB);
    if (fc.door) tudorDoor(F, acc, { w: doorW, y0: P, ys }, tB);
    for (const s of [-1, 1]) quoins(F, acc, 'dress', { uEdge: s * hw, s: -s, y0: P, y1: P + sh, t: tB });
    bx(F, acc, 'dress', -hw, hw, P, P + 0.32, tB / 2 - 0.1, tB / 2 + 0.1);                          // chân tường vát
  }
  for (const sx of [-1, 1]) {
    const F = Fr.at(sx * (hw - tB / 2), 0, sx * PI / 2), L = hd, wins = [];
    for (const u of [-L * 0.62, L * 0.62]) wins.push({ u, w: 1.5, y0: P + 1.0, h: 2.1, n: 2 });
    F.add(acc, 'brick', ext(rect(-hd, P, hd, P + sh), wins.map((o) => rect(o.u - o.w / 2, o.y0, o.u + o.w / 2, o.y0 + o.h)), tB, -tB / 2));
    for (const o of wins) stoneWin(F, acc, o, tB);
    for (const s of [-1, 1]) quoins(F, acc, 'dress', { uEdge: s * hd, s: -s, y0: P, y1: P + sh, t: tB });
    bx(F, acc, 'dress', -hd, hd, P, P + 0.32, tB / 2 - 0.1, tB / 2 + 0.1);
  }
  // ---- cửa sổ lồi (canted bay) tầng trệt — kính chì gần kín, bệ gạch, mái chì
  if (bayU != null) for (const s of [-1, 1]) {
    const u = s * bayU, pj = 0.95, wf = 1.8, wsd = Math.hypot(pj, 0.4), F0 = Fr.at(u, hd, 0);
    const ang = Math.atan2(0.4, pj);   // mặt bên nghiêng
    const defs = [{ x: 0, z: pj, ry: 0, w: wf }, { x: -(wf / 2 + 0.2), z: pj / 2, ry: -(PI / 2 - ang), w: wsd }, { x: wf / 2 + 0.2, z: pj / 2, ry: PI / 2 - ang, w: wsd }];
    for (const d of defs) {
      const F = F0.sub(d.x, d.z - 0.12, d.ry);
      bx(F, acc, 'brick', -d.w / 2, d.w / 2, P, P + 0.85, -0.12, 0.12);
      bx(F, acc, 'dress', -d.w / 2 - 0.05, d.w / 2 + 0.05, P + 0.85, P + 1.0, -0.14, 0.18);
      bx(F, acc, 'glass', -d.w / 2, d.w / 2, P + 1.0, P + 3.25, -0.04, 0);
      const m = Math.max(2, Math.round(d.w / 0.55)); for (let i = 0; i <= m; i++) bx(F, acc, 'dress', -d.w / 2 + (i * d.w) / m - 0.06, -d.w / 2 + (i * d.w) / m + 0.06, P + 1.0, P + 3.25, -0.06, 0.12);
      bx(F, acc, 'dress', -d.w / 2, d.w / 2, P + 2.4, P + 2.5, -0.06, 0.12);
      bx(F, acc, 'dress', -d.w / 2 - 0.08, d.w / 2 + 0.08, P + 3.25, P + 3.55, -0.14, 0.2);
    }
    // mái chì dốc về tường (bên dưới dầm nhô tầng 2)
    F0.add(acc, 'lead', slopeSlab(wf / 2 + 0.45, pj + 0.3, P + 3.55, P + 3.95));
    F0.add(acc, 'dress', boxB(wf + 1.0, 0.2, pj + 0.2, 0, P + 3.4, (pj + 0.2) / 2));
  }
  // ---- khối cửa (porch) giữa: tầng trệt gạch nhô pd, vòm bốn tâm mở; tầng trên gỗ nhô thêm
  const pf = hd + pd;
  if (porch) {
    const F = Fr.at(0, pf - tB / 2, 0), dW = 2.8, ys = P + 2.3;
    F.add(acc, 'brick', ext(rect(-pw / 2, P, pw / 2, P + sh), [tudorHole({ u: 0, w: dW, y0: P, ys })], tB, -tB / 2));
    tudorDoor(F, acc, { w: dW, y0: P, ys }, tB, false);
    if (pw / 2 - 0.9 > dW / 2 + 0.4) for (const s of [-1, 1]) quoins(F, acc, 'dress', { uEdge: s * pw / 2, s: -s, y0: P, y1: P + sh, t: tB });   // góc đá chỉ khi không lấn vòm
    // tấm huy hiệu trên vòm
    bx(F, acc, 'dress', -0.7, 0.7, P + 3.5, P + 4.05, tB / 2, tB / 2 + 0.08);
    for (const s of [-1, 1]) { const Fs = Fr.at(s * (pw / 2 - tB / 2), hd + pd / 2, s * PI / 2); Fs.add(acc, 'brick', ext(rect(-pd / 2 - 0.05, P, pd / 2 + 0.05, P + sh), [], tB, -tB / 2)); }
    acc.add('floorS', boxB(pw, 0.03, pd, 0, P, hd + pd / 2));
  }
  // ---- tầng trên: khung gỗ nhô; tầng trên cùng là long gallery
  for (let s = 1; s < n; s++) {
    const y0 = P + s * sh, y1 = y0 + sh, top = s === n - 1, sill = y0 + (top ? 0.75 : 0.95), wh = top ? 2.0 : 1.85;
    for (const sz of [1, -1]) {
      const F = Fr.at(0, sz * (plane(s) - tT / 2), sz > 0 ? 0 : PI), wins = [];
      if (top) { const m = Math.max(3, Math.round((2 * hw - 1.6) / 2.35)); for (let i = 0; i < m; i++) { const u = -hw + 0.8 + ((2 * hw - 1.6) * (i + 0.5)) / m; if (!(sz > 0 && porch && Math.abs(u) < pw / 2 + 0.2)) wins.push({ u, w: 1.7, h: wh }); } }
      else for (const k of [-1, 1]) for (const u of sideU) wins.push({ u: k * u, w: u > hw - 2.4 ? 1.4 : Math.abs(u - (bayU ?? -9)) < 1e-6 ? 2.4 : 1.9, h: wh });
      if (!(sz > 0 && porch) && !top) wins.push({ u: 0, w: 1.6, h: wh });
      timberWall(F, acc, { u0: -hw - jet(s) * 0, u1: hw, y0, y1, t: tT, wins, sill, low: top ? 'chev' : (main ? 'quatre' : 'stud') });
      jetty(F, acc, { u0: -hw, u1: hw, y: y0, w0: tT / 2 - jet(s) + jet(s - 1), w1: tT / 2 });
    }
    for (const sx of [-1, 1]) {
      const F = Fr.at(sx * (hw - tT / 2), 0, sx * PI / 2), L = plane(s), wins = [{ u: -hd * 0.6, w: 1.4, h: wh }, { u: hd * 0.6, w: 1.4, h: wh }];
      timberWall(F, acc, { u0: -L, u1: L, y0, y1, t: tT, wins, sill, low: 'stud' });
    }
    if (porch) {
      const pp = pf + J * s, F = Fr.at(0, pp - tT / 2, 0);
      timberWall(F, acc, { u0: -pw / 2 - 0.3, u1: pw / 2 + 0.3, y0, y1, t: tT, wins: [{ u: 0, w: 2.2, h: wh }], sill, low: 'quatre' });
      jetty(F, acc, { u0: -pw / 2 - 0.3, u1: pw / 2 + 0.3, y: y0, w0: tT / 2 - J, w1: tT / 2 });
      for (const sx of [-1, 1]) { const Fs = Fr.at(sx * (pw / 2 + 0.3 - tT / 2), (pp + plane(s)) / 2, sx * PI / 2); timberWall(Fs, acc, { u0: -(pp - plane(s)) / 2, u1: (pp - plane(s)) / 2, y0, y1, t: tT, wins: [], sill, low: 'stud' }); }
    }
  }
  // ---- trần tầng trệt (dầm sàn lộ) — giữ sàn trống bên dưới
  acc.add('timber', boxB(2 * hw - 0.6, 0.28, 2 * hd - 0.6, 0, P + sh - 0.28, 0));
  for (let x = -hw + 1.2; x < hw - 0.8; x += 1.8) acc.add('carveT', boxB(0.22, 0.3, 2 * hd - 0.7, x, P + sh - 0.58, 0));
  // ---- mái chính: hai dốc 47°, đầu hồi gỗ hai đầu
  const hT = plane(n - 1), Fm = Fr.at(0, 0, 0);
  const R = gableRoof(Fm, acc, 'clay', { xl: -hw - 0.35, xr: hw + 0.35, D: 2 * hT, yE: yT, pitch, ov: 0.5, th: 0.24, ridgeKey: 'brickD' });
  for (const sx of [-1, 1]) timberGable(Fr.at(sx * (hw - 0.15), 0, sx * PI / 2), acc, { h: hT, yb: yT, tp, ov: 0.35, win: null, finial: false });
  let top = R.yRidge;
  // ---- hồi ngang trên mặt tiền (và mặt sau): khối cửa + hai hồi bên (Little Moreton: đầu hồi nhô thêm 0,3 m)
  const gables = [];
  if (porch) gables.push({ x: 0, w: pw + 0.6, z: pf + J * Math.min(n - 1, 2), sz: 1 });
  // hồi bên: ô gần 0,6 hw không chồng hồi khối cửa và cách đầu hồi ≥ 0,8 m
  const gw = clamp(b.w * 0.18, 4.2, 6.4), gx = [...sideU].sort((a, c) => Math.abs(a - hw * 0.62) - Math.abs(c - hw * 0.62)).find((u) => u - gw / 2 >= (porch ? pw / 2 + 0.9 : 0.6) && u + gw / 2 <= hw - 0.8);
  if (gx != null) for (const s of [-1, 1]) { gables.push({ x: s * gx, w: gw, z: hT + 0.3, sz: 1 }); if (b.back || main) gables.push({ x: s * gx * 0.9, w: gw, z: hT + 0.3, sz: -1 }); }
  for (const g of gables) {
    const Fg = Fr.at(g.x, g.sz * (g.z - 0.15), g.sz > 0 ? 0 : PI), h = g.w / 2;
    timberGable(Fg, acc, { h, yb: yT, tp, ov: 0.4, win: { w: Math.min(2.4, g.w * 0.45), h: 1.4 } });
    bx(Fg, acc, 'plaster', -h, h, yT - 0.05, yT + 0.25, 0.15 - (g.z - hT) - 0.05, 0.1);
    jetty(Fg, acc, { u0: -h, u1: h, y: yT, w0: 0.15 - (g.z - hT), w1: 0.15 });
    // mái hồi ngang: nóc chạy theo z từ mép hồi vào mái chính
    const Fr2 = Fr.at(g.x, 0, g.sz > 0 ? PI / 2 : -PI / 2);
    gableRoof(Fr2, acc, 'clay', { xl: -(g.z + 0.45), xr: -Math.max(1.0, hT - h * 1.6), D: g.w, yE: yT, pitch, ov: 0.4, th: 0.22, ridgeKey: 'brickD' });
  }
  // ---- ống khói: hai đầu hồi (bầu lò gạch áp tường ngoài) + một cụm trên nóc
  for (const sx of [-1, 1]) {
    const x = sx * (hw + 0.5);
    acc.add('brick', boxB(1.0, R.yRidge - 1.4, 2.6, x, 0, 0));
    for (const yy of [P + sh, P + 2 * sh]) acc.add('dress', boxB(1.2, 0.18, 2.8, x, yy - 0.3, 0));
    top = Math.max(top, stack(acc, { x, z: 0, y0: R.yRidge - 1.4, y1: R.yRidge + 0.4, bw: 2.4, bd: 1.0, n: 3, hs: 2.3, ax: 'z' }));
  }
  if (b.w >= 20) for (const sx of [-1, 1]) top = Math.max(top, stack(acc, { x: sx * hw * 0.42, z: 0, y0: R.yRidge - 2.2, y1: R.yRidge + 0.5, bw: 2.0, bd: 0.95, n: 2, hs: 2.2, ax: 'x' }));
  return done(acc, { kind: 'est-tudor', top, storeys: n, ridge: R.yRidge });
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/** tấm dốc (mái chì cửa sổ lồi): nửa rộng hx, sâu dz (từ tường z = 0 ra), cao ở mép yLo, ở tường yHi */
function slopeSlab(hx, dz, yLo, yHi) { const g = new THREE.BoxGeometry(2 * hx, 0.1, Math.hypot(dz, yHi - yLo)); g.rotateX(Math.atan2(yHi - yLo, dz)); g.translate(0, (yLo + yHi) / 2, dz / 2); return g.toNonIndexed(); }

// ============================================================================ THÁP ĐỒNG HỒ (Anne Boleyn's Gate, Hampton Court)
function ogeeCap(acc, key, x, y, z, r, h) {
  acc.add(key, lathe([[0.001, 0], [r * 1.08, 0], [r * 1.08, 0.12], [r * 0.92, 0.18], [r * 1.06, h * 0.2], [r * 1.02, h * 0.34], [r * 0.78, h * 0.5], [r * 0.4, h * 0.63], [r * 0.18, h * 0.76], [r * 0.12, h * 0.9], [0.001, h]], x, y, z, 12));
  acc.add('gold', lathe([[0.001, 0], [0.08, 0], [0.04, 0.4], [0.12, 0.55], [0.001, 0.8]], x, y + h, z, 6));
  acc.add('iron', box(0.04, 0.5, 0.6, x, y + h + 1.0, z + 0.2));
  return y + h + 1.3;
}
function tower(styleId, S, t) {
  const acc = new Acc(), s = Math.min(t.w, t.d) * 0.34, ta = 0.85, yB = Math.max(20, t.h - 12), tB = 0.8, cr = { mw: 1.1, cw: 0.45, mh: 0.7, bh: 0.85, pt: 0.4 };
  acc.add('plinthS', boxB(2 * s + 1.2, 0.4, 2 * s + 1.2, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: 2 * s + 1.2, d: 2 * s + 1.2, top: 0.4 });
  const stages = [0.4, 5.6, 10.8, 16.0, yB];
  for (let k = 0; k < 4; k++) {
    const ry = (k * PI) / 2, F = Fr.at(Math.sin(ry) * (s - tB / 2), Math.cos(ry) * (s - tB / 2), ry), holes = [], wins = [];
    if (k === 0) holes.push(tudorHole({ u: 0, w: 2.0, y0: 0.4, ys: 2.6 }));
    else wins.push({ u: 0, w: 1.3, y0: 2.0, h: 1.8, n: 2, transom: false });
    wins.push({ u: 0, w: 1.6, y0: 7.2, h: 2.2, n: 2 });
    if (k % 2 === 0) wins.push({ u: 0, w: 2.0, y0: 11.9, h: 2.6, n: 3 }); else wins.push({ u: 0, w: 1.3, y0: 12.2, h: 2.2, n: 2 });
    if (k % 2) wins.push({ u: 0, w: 1.3, y0: yB - 4.2, h: 2.4, n: 2 });
    F.add(acc, 'brick', ext(rect(-s, 0.4, s, yB), [...holes, ...wins.map((o) => rect(o.u - o.w / 2, o.y0, o.u + o.w / 2, o.y0 + o.h))], tB, -tB / 2));
    for (const o of wins) stoneWin(F, acc, o, tB);
    if (k === 0) tudorDoor(F, acc, { w: 2.0, y0: 0.4, ys: 2.6 }, tB, false), F.add(acc, 'door', boxB(2.0, 2.9, 0.1, 0, 0.4, -0.2));
    for (const y of stages.slice(1)) bx(F, acc, 'dress', -s, s, y - 0.3, y, tB / 2 - 0.05, tB / 2 + 0.16);
    // mặt đồng hồ (trước / sau): mặt số xanh lam, vành + 12 vạch + kim mạ vàng, khung đá vuông
    if (k % 2 === 0) {
      const cy = yB - 3.4, R = Math.min(1.75, s * 0.55), w = tB / 2 + 0.06;
      bx(F, acc, 'dress', -R - 0.35, R + 0.35, cy - R - 0.35, cy + R + 0.35, tB / 2, tB / 2 + 0.1);
      const disc = new THREE.CylinderGeometry(R, R, 0.08, 32); disc.rotateX(PI / 2); disc.translate(0, cy, w + 0.08); F.add(acc, 'dial', disc);
      const ring = new THREE.TorusGeometry(R, 0.07, 4, 32); ring.translate(0, cy, w + 0.13); F.add(acc, 'gold', ring);
      for (let i = 0; i < 12; i++) { const a = (i * PI) / 6, g = box(0.08, 0.3, 0.05, Math.sin(a) * R * 0.8, cy + Math.cos(a) * R * 0.8, w + 0.14); g.translate(-Math.sin(a) * R * 0.8, -(cy + Math.cos(a) * R * 0.8), 0); g.rotateZ(-a); g.translate(Math.sin(a) * R * 0.8, cy + Math.cos(a) * R * 0.8, 0); F.add(acc, 'gold', g); }
      for (const [L, a] of [[R * 0.55, 0.9], [R * 0.78, -0.6]]) { const g = box(0.09, L, 0.04, 0, L / 2, 0); g.rotateZ(a); g.translate(0, cy, w + 0.16); F.add(acc, 'gold', g); }
    }
  }
  acc.add('floorS', boxB(2 * s - 0.6, 0.05, 2 * s - 0.6, 0, 0.4, 0));
  acc.add('lead', boxB(2 * s, 0.3, 2 * s, 0, yB - 0.3, 0));
  // lan can răng cưa giữa các tháp góc
  for (let k = 0; k < 4; k++) { const ry = (k * PI) / 2, F = Fr.at(Math.sin(ry) * (s - cr.pt / 2), Math.cos(ry) * (s - cr.pt / 2), ry); crenelRun(F, acc, 'brick', 'dress', { u0: -s + ta, u1: s - ta, y: yB, c: cr, slits: false }); }
  // 4 tháp góc bát giác: vành đá theo tầng, răng cưa, nắp chì củ
  let top = 0;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * s, z = sz * s, h = yB + 3.2;
    acc.add('brick', polyCyl(8, ta, ta, h, x, 0, z));
    for (const y of stages.slice(1)) acc.add('dress', polyCyl(8, ta + 0.08, ta + 0.08, 0.26, x, y - 0.28, z));
    acc.add('dress', polyCyl(8, ta + 0.18, ta + 0.1, 0.3, x, h, z));
    top = Math.max(top, ogeeCap(acc, 'lead', x, h + 0.3, z, ta * 0.95, 2.6));
  }
  // chòi chuông gỗ bát giác trên mái: 8 trụ, vòm bốn tâm, nắp chì củ
  const ya = yB, ar = 1.25, ph = 2.6;
  acc.add('lead', polyCyl(8, ar + 0.3, ar + 0.2, 0.6, 0, ya, 0));
  const R8 = ar / Math.cos(PI / 8);
  for (let k = 0; k < 8; k++) { const a = (k * PI) / 4 + PI / 8; acc.add('timber', boxB(0.2, ph, 0.2, Math.cos(a) * R8, ya + 0.6, Math.sin(a) * R8)); }
  acc.add('timber', polyCyl(8, ar + 0.12, ar + 0.12, 0.35, 0, ya + 0.6 + ph, 0));
  const bell = lathe([[0.001, 0], [0.55, 0], [0.5, 0.15], [0.38, 0.55], [0.34, 0.95], [0.18, 1.08], [0.001, 1.1]], 0, ya + 1.4, 0, 12); acc.add('gold', bell);
  top = Math.max(top, ogeeCap(acc, 'lead', 0, ya + 0.95 + ph, 0, ar + 0.2, 3.4));
  return done(acc, { kind: 'clock', top });
}

// ============================================================================ ĐÌNH: nhà vườn khung gỗ
function pav(styleId, S, pv) {
  const acc = new Acc(), W = Math.min(pv.w, pv.d) - 1.2, hb = 0.5, eave = hb + Math.max(3.2, pv.h), h = W / 2, pitch = 50, tp = Math.tan((pitch * PI) / 180);
  acc.add('brick', boxB(W + 0.6, hb - 0.1, W + 0.6, 0, 0, 0)); acc.add('dress', boxB(W + 0.7, 0.12, W + 0.7, 0, hb - 0.12, 0));
  acc.add('floorS', boxB(W + 0.4, 0.03, W + 0.4, 0, hb - 0.01, 0)); acc.plat({ x: 0, z: 0, w: W + 0.6, d: W + 0.6, top: hb });
  for (let i = 0; i < 3; i++) { const top = (hb * (i + 1)) / 3, cz = h + 0.3 + 0.33 * (3 - i - 0.5); acc.add('stepS', box(2.0, top, 0.34, 0, top / 2, cz)); acc.plat({ x: 0, z: cz, w: 2, d: 0.35, top }); }
  // trụ góc + trụ giữa, xà đầu cột, thanh giằng cong (vòm bốn tâm) giữa trụ
  const ps = [-h, 0, h], y0 = hb, y1 = eave;
  for (const x of ps) for (const z of ps) if (Math.abs(x) === h || Math.abs(z) === h) acc.add('timber', boxB(0.26, y1 - y0, 0.26, x, y0, z));
  for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const F = Fr.at(nx * h, nz * h, Math.atan2(nx, nz));
    bx(F, acc, 'timber', -h - 0.13, h + 0.13, y1 - 0.32, y1, -0.14, 0.14);
    for (const c of [-h / 2, h / 2]) {   // ô vòm bốn tâm giữa hai trụ: tấm gỗ chạm có lỗ vòm
      const aw = h - 0.26, ys = y1 - 0.32 - 0.3 - aw * 0.3;
      F.add(acc, 'carveT', ext(spandrelPoly(c, aw, ys, aw * 0.3, y1 - 0.32, 0.0), [], 0.1, -0.05));
      if (nz !== 1) { bx(F, acc, 'timber', c - h / 2, c + h / 2, y0 + 0.85, y0 + 0.98, -0.07, 0.07); for (let u = c - h / 2 + 0.2; u < c + h / 2 - 0.1; u += 0.22) F.add(acc, 'lattice', lathe([[0.001, 0], [0.05, 0], [0.04, 0.2], [0.07, 0.4], [0.035, 0.6], [0.05, 0.85], [0.001, 0.85]], u, y0, 0, 6)); }
    }
  }
  // mái hai dốc (nóc theo z, hồi quay trước / sau) + đầu hồi gỗ hai mặt
  const Fm = Fr.at(0, 0, PI / 2);
  const R = gableRoof(Fm, acc, 'clay', { xl: -h - 0.5, xr: h + 0.5, D: W, yE: y1, pitch, ov: 0.45, th: 0.2, ridgeKey: 'brickD' });
  for (const sz of [1, -1]) timberGable(Fr.at(0, sz * (h + 0.02), sz > 0 ? 0 : PI), acc, { h, yb: y1, tp, ov: 0.45, win: null, herring: true });
  return done(acc, { kind: 'garden-house', top: R.yRidge + 1.6 });
}

// ============================================================================ CỔNG
function gate(styleId, S, g) {
  const acc = new Acc();
  if (g.villa) {
    const w = g.w + 0.3;
    for (const sx of [-1, 1]) { const x = sx * (w / 2 + 0.45); acc.add('brick', boxB(0.9, 2.9, 0.9, x, 0, 0)); acc.add('dress', boxB(1.1, 0.25, 1.1, x, 0, 0)); acc.add('dress', boxB(1.1, 0.2, 1.1, x, 2.9, 0)); acc.add('dress', lathe([[0.001, 0], [0.18, 0], [0.12, 0.15], [0.3, 0.45], [0.001, 0.8]], x, 3.1, 0, 10)); }
    const F = Fr.at(0, 0, 0);
    F.add(acc, 'brick', ext(spandrelPoly(0, w, 2.5, w * 0.22, 3.5, 0.05), [], 0.5, -0.25));
    bx(F, acc, 'dress', -w / 2 - 0.1, w / 2 + 0.1, 3.5, 3.68, -0.32, 0.32);
    return done(acc, { kind: 'gate-v' });
  }
  // phủ: Great Gatehouse (Hampton Court) thu nhỏ — vòm bốn tâm xuyên rộng ow ≥ g.w, hai khối phòng gác, 4 tháp góc bát giác
  const ow = g.w + 0.3, pier = 3.0, W = ow + 2 * pier, Dg = 6.0, tB = 1.0, ys = 3.7, apex = ys + ow * 0.3, yB = 10.6, cr = { mw: 1.2, cw: 0.5, mh: 0.75, bh: 0.9, pt: 0.45 };
  acc.add('floorS', boxB(W, 0.12, Dg + 1.0, 0, 0, -Dg / 2)); acc.plat({ x: 0, z: -Dg / 2, w: W, d: Dg + 1, top: 0.12 });
  const o = { u: 0, w: ow, y0: 0, ys };
  for (const [z, ry] of [[-tB / 2, 0], [-Dg + tB / 2, PI]]) {
    const F = Fr.at(0, z, ry), front = ry === 0, wins = [];
    if (front) wins.push({ u: -W / 2 + 1.5, w: 1.1, y0: 2.0, h: 1.8, n: 2, transom: false }, { u: W / 2 - 1.5, w: 1.1, y0: 2.0, h: 1.8, n: 2, transom: false });
    wins.push({ u: -W / 2 + 1.5, w: 1.2, y0: 7.6, h: 1.9, n: 2 }, { u: W / 2 - 1.5, w: 1.2, y0: 7.6, h: 1.9, n: 2 });
    const ow2 = { u: 0, w: 2.6, y0: 7.3, h: 2.2, n: 3 };
    F.add(acc, 'brick', ext(rect(-W / 2, 0, W / 2, yB), [tudorHole(o), ...wins.map((q) => rect(q.u - q.w / 2, q.y0, q.u + q.w / 2, q.y0 + q.h)), rect(ow2.u - ow2.w / 2, ow2.y0, ow2.u + ow2.w / 2, ow2.y0 + ow2.h)], tB, -tB / 2));
    for (const q of wins) stoneWin(F, acc, q, tB);
    // khung vòm đá hai lớp + gờ mũ vuông, spandrel đá
    F.add(acc, 'dress', ext(tudorHole(o, 0.45), [tudorHole(o)], 0.2, tB / 2 - 0.1));
    bx(F, acc, 'dress', -ow / 2 - 0.7, ow / 2 + 0.7, apex + 0.5, apex + 0.68, tB / 2, tB / 2 + 0.2);
    for (const s of [-1, 1]) bx(F, acc, 'dress', s * (ow / 2 + 0.55) - 0.08, s * (ow / 2 + 0.55) + 0.08, ys - 0.2, apex + 0.68, tB / 2, tB / 2 + 0.2);
    // cửa sổ lồi đá trên vòm (oriel trên consol) + tấm huy hiệu
    const pj = 0.7, Fo = F.sub(0, tB / 2, 0);
    for (let i = 0; i < 4; i++) bx(Fo, acc, 'dress', -1.6 + i * 0.12, 1.6 - i * 0.12, ow2.y0 - 0.6 - i * 0.18, ow2.y0 - 0.42 - i * 0.18, 0, pj - i * 0.16);
    bx(Fo, acc, 'dress', -1.65, 1.65, ow2.y0 - 0.45, ow2.y0, 0, pj);
    bx(Fo, acc, 'glass', -1.5, 1.5, ow2.y0, ow2.y0 + ow2.h, pj - 0.12, pj - 0.08);
    for (let i = 0; i <= 4; i++) bx(Fo, acc, 'dress', -1.5 + i * 0.75 - 0.07, -1.5 + i * 0.75 + 0.07, ow2.y0, ow2.y0 + ow2.h, pj - 0.14, pj + 0.02);
    for (const s of [-1, 1]) bx(Fo, acc, 'glass', s * 1.55 - 0.03, s * 1.55 + 0.03, ow2.y0, ow2.y0 + ow2.h, 0.05, pj - 0.1);
    bx(Fo, acc, 'dress', -1.5, 1.5, ow2.y0 + 1.35, ow2.y0 + 1.45, pj - 0.14, pj + 0.02);
    bx(Fo, acc, 'dress', -1.75, 1.75, ow2.y0 + ow2.h, ow2.y0 + ow2.h + 0.3, -0.05, pj + 0.12);
    bx(Fo, acc, 'lead', -1.7, 1.7, ow2.y0 + ow2.h + 0.3, ow2.y0 + ow2.h + 0.42, -0.05, pj + 0.05);
    // khiên huy hiệu trên hai spandrel của vòm (hoa hồng Tudor / khiên)
    for (const s of [-1, 1]) { const u = s * (ow / 2 - 0.75), y = ys + 0.9; Fo.add(acc, 'gold', ext([[u - 0.28, y + 0.68], [u + 0.28, y + 0.68], [u + 0.28, y + 0.26], [u, y], [u - 0.28, y + 0.26]].reverse(), [], 0.06, 0.02)); }
    crenelRun(F, acc, 'brick', 'dress', { u0: -W / 2 + 1.2, u1: W / 2 - 1.2, y: yB, c: cr, slits: false });
    bx(F, acc, 'dress', -W / 2, W / 2, yB - 0.3, yB, tB / 2 - 0.05, tB / 2 + 0.16);
    bx(F, acc, 'dress', -W / 2, W / 2, 5.9, 6.15, tB / 2 - 0.05, tB / 2 + 0.12);
  }
  // hai khối phòng gác + khối trên lối qua + trần gỗ lối qua
  for (const sx of [-1, 1]) acc.add('brick', boxB(pier, yB, Dg - 2 * tB, sx * (ow / 2 + pier / 2), 0, -Dg / 2));
  acc.add('brick', boxB(ow + 0.1, yB - apex - 0.5, Dg - 2 * tB, 0, apex + 0.5, -Dg / 2));
  acc.add('timber', boxB(ow, 0.3, Dg - 2 * tB, 0, apex + 0.2, -Dg / 2));
  for (let z = -tB - 0.4; z > -Dg + tB + 0.2; z -= 0.8) acc.add('carveT', boxB(ow, 0.22, 0.2, 0, apex, z));
  acc.add('lead', boxB(W, 0.2, Dg, 0, yB - 0.2, -Dg / 2));
  for (const sx of [-1, 1]) { const F = Fr.at(sx * (W / 2 - cr.pt / 2), -Dg / 2, sx * PI / 2); crenelRun(F, acc, 'brick', 'dress', { u0: -Dg / 2 + 1.2, u1: Dg / 2 - 1.2, y: yB, c: cr, slits: false }); }
  // 4 tháp góc bát giác (trước có nắp chì củ, sau răng cưa)
  let top = 0;
  for (const sx of [-1, 1]) for (const z of [0, -Dg]) {
    const x = sx * W / 2, a = 1.25, h = yB + 2.6;
    acc.add('brick', polyCyl(8, a, a, h, x, 0, z));
    acc.add('dress', polyCyl(8, a + 0.12, a + 0.12, 0.35, x, 0, z));
    for (const y of [3.4, 6.1, yB - 0.3]) acc.add('dress', polyCyl(8, a + 0.07, a + 0.07, 0.22, x, y, z));
    for (const y of [2.0, 4.5, 7.5, 10.4]) acc.add('dark', box(0.12, 0.9, 0.06, x + sx * 0.0, y, z + (z === 0 ? a + 0.01 : -a - 0.01)));
    if (z === 0) { acc.add('dress', polyCyl(8, a + 0.2, a + 0.1, 0.3, x, h, z)); top = Math.max(top, ogeeCap(acc, 'lead', x, h + 0.3, z, a * 0.92, 2.4)); }
    else crenelPoly(Fr.at(x, z, 0), acc, 'brick', 'dress', { n: 8, ac: a - 0.2, y: h - 0.9, c: { mw: 0.38, cw: 0.3, mh: 0.6, bh: 0.9, pt: 0.35 } });
  }
  return done(acc, { kind: 'gate', top, W, D: Dg });
}

export const FAMILY = { hall, tower, pav, gate };
