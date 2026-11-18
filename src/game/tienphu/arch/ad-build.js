// ============================================================================
//  BỘ DỰNG ART DECO — nhà theo khối (biệt thự Mallet-Stevens: khối lập phương ghép nhiều cao độ, gạch sọc / trát trắng,
//  cửa băng khung mảnh, sân thượng lan can ống, pergola, mái hiên công-xôn, góc bo tròn) + các phần riêng (rạp, hồ bơi,
//  squash, gara) + lầu setback + 7 tiểu công trình. Theo docs/tienphu-nghiencuu/05-artdeco.md.
//  Mọi hàm trả { acc, info }. Mặt đi được khai bằng acc.plat (nền, bậc, sân thượng có lối lên).
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, slabXY, lathe, silhouette, V } from './kit.js';
import { AD, prism, rrect, insetR, ringPrism, tube, cylY, face, fbox, faceMat, uOf, wallOpen, fillOpening, storeyOps, tubeRail, pergola, canopy, steps, finalizeUV, bandUV } from './ad-kit.js';

// ---------------------------------------------------------------- KHỐI (một hộp nhiều tầng, góc bo, tường có ô cửa sâu)
/**
 * B: { x: [x0, x1], z: [z0, z1], y0, n (số tầng), sh (cao tầng), mat, t (dày tường), r: { fl, fr, bl, br } (bo góc),
 *      faces: { f, r, b, l: mẫu | [mẫu từng tầng] }, ex: { f: [{ u: [a, b] (so với giữa mặt) | at: [x, z], w, y: [y0, y1], kind, m, tr, door, open, fk }] },
 *      hide: ['l', …] (mặt khuất, không dựng), roof: 'terrace' | 'parapet' | 'cornice' | 'none', par (cao tường chắn mái), walk (sân thượng đi được),
 *      void: { [tầng]: [x0, x1, z0, z1] } (khoảng thông tầng) }
 */
export function block(acc, B, ctx) {
  const [x0, x1] = B.x, [z0, z1] = B.z, r = B.r || {}, t = B.t ?? 0.35, key = B.mat || 'brick', n = B.n || 1, sh = B.sh, y0 = B.y0 ?? ctx.ph;
  const lim = Math.min((x1 - x0) / 2, (z1 - z0) / 2), R = (k) => Math.min(r[k] || 0, lim), yTop = y0 + n * sh;
  const F = { f: face(x0 + R('fl'), z1, x1 - R('fr'), z1, 0, 1), r: face(x1, z1 - R('fr'), x1, z0 + R('br'), 1, 0), b: face(x1 - R('br'), z0, x0 + R('bl'), z0, 0, -1), l: face(x0, z0 + R('bl'), x0, z1 - R('fl'), -1, 0) };
  for (const [fk, Fc] of Object.entries(F)) {
    if (Fc.L < 0.05 || (B.hide || []).includes(fk)) continue;
    const pats = B.faces?.[fk]; let ops = [];
    for (let s = 0; s < n; s++) ops.push(...storeyOps(Array.isArray(pats) ? pats[Math.min(s, pats.length - 1)] : pats, Fc.L, y0 + s * sh, sh));
    for (const e of B.ex?.[fk] || []) {
      const uc = e.at ? uOf(Fc, e.at[0], e.at[1]) : Fc.L / 2 + (e.u[0] + e.u[1]) / 2, w = e.at ? e.w : e.u[1] - e.u[0];
      const o = { kind: 'grid', m: 1.2, tr: [], ...e, u0: uc - w / 2, u1: uc + w / 2, y0: e.y[0], y1: e.y[1], _ex: true };
      if (e.door) o.door = { c: uc + (e.door.dc || 0), w: e.door.w, h: e.door.h };
      if (e.ts) { o.tr = []; for (let y = o.y0 + e.ts; y < o.y1 - 0.3; y += e.ts) o.tr.push(y); }
      ops = ops.flatMap((p) => (!p._ex && p.y0 < o.y1 && p.y1 > o.y0 && p.u0 < o.u1 + 0.6 && p.u1 > o.u0 - 0.6 ? [[p.u0, Math.min(p.u1, o.u0 - 0.6)], [Math.max(p.u0, o.u1 + 0.6), p.u1]].filter(([a, b]) => b - a >= 0.9 && (p.kind === 'band' || b - a >= p.u1 - p.u0 - 1e-3)).map(([a, b]) => ({ ...p, u0: a, u1: b })) : [p]));
      ops.push(o);
    }
    wallOpen(acc, Fc, y0, yTop, ops, key, t); for (const o of ops) fillOpening(acc, Fc, o, t);
  }
  // góc bo: vòng một phần tư (gạch khuôn cong — 26 khuôn Bonzel, 05 §1c)
  const corner = (cx, cz, rr, a0) => { if (rr < 0.05) return; const o = [], i = []; for (let k = 0; k <= 10; k++) { const a = a0 + (Math.PI / 2) * (k / 10); o.push([cx + Math.cos(a) * rr, cz + Math.sin(a) * rr]); i.push([cx + Math.cos(a) * Math.max(0.01, rr - t), cz + Math.sin(a) * Math.max(0.01, rr - t)]); } acc.add(key, prism([...o, ...i.reverse()], y0, yTop - y0)); };
  corner(x1 - R('fr'), z1 - R('fr'), R('fr'), 0); corner(x0 + R('fl'), z1 - R('fl'), R('fl'), Math.PI / 2); corner(x0 + R('bl'), z0 + R('bl'), R('bl'), Math.PI); corner(x1 - R('br'), z0 + R('br'), R('br'), 1.5 * Math.PI);
  // sàn các tầng (sàn bê tông) — trừ khoảng thông tầng
  const inner = rrect(x0 + t, x1 - t, z0 + t, z1 - t, insetR(r, t));
  for (let s = 1; s < n; s++) { const v = B.void?.[s]; acc.add('floor', prism(inner, y0 + s * sh - 0.3, 0.3, v ? [rrect(v[0], v[1], v[2], v[3])] : [])); }
  // mái phẳng: sàn mái + tường chắn mái + gờ (coping) + lan can ống nếu là sân thượng
  const roof = B.roof || 'terrace', par = B.par ?? (roof === 'parapet' ? 0.9 : 0.45);
  if (roof !== 'none') acc.add('floor', prism(inner, yTop - 0.32, 0.32));
  if (roof === 'terrace' || roof === 'parapet') {
    acc.add(key, ringPrism(x0, x1, z0, z1, r, t, yTop, par));
    acc.add('coping', ringPrism(x0, x1, z0, z1, r, t + 0.04, yTop + par, 0.08, 0.04));
    if (roof === 'terrace') {
      const ins = 0.16, pts = rrect(x0 + ins, x1 - ins, z0 + ins, z1 - ins, insetR(r, ins), 3);
      tubeRail(acc, pts, yTop + par + 0.08, { h: Math.max(0.5, 1.1 - par - 0.08), skip: (x, z) => ctx.covered(x, z, yTop, B) || (B.railGap || []).some(([a, b, c, d]) => x > a && x < b && z > c && z < d) });
    }
  } else if (roof === 'cornice') { acc.add(key, ringPrism(x0, x1, z0, z1, r, t, yTop, 0.3)); acc.add('concW', prism(rrect(x0 - 0.45, x1 + 0.45, z0 - 0.45, z1 + 0.45, insetR(r, -0.45)), yTop + 0.3, 0.22)); }
  if (B.walk) acc.plat({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, w: x1 - x0 - 2 * t, d: z1 - z0 - 2 * t, top: yTop });
  ctx.grow(x0, x1, z0, z1, yTop + (roof === 'terrace' ? 1.1 : roof === 'parapet' ? par + 0.08 : roof === 'cornice' ? 0.52 : 0));
  return { yTop, F };
}

/** ngữ cảnh dựng: danh sách khối (để cắt lan can bị khối cao hơn che), hộp bao */
function makeCtx(ph, blocks) {
  const ctx = { ph, bb: [Infinity, -Infinity, Infinity, -Infinity], top: 0 };
  const list = blocks.map((B) => ({ B, x: B.x, z: B.z, y0: B.y0 ?? ph, top: (B.y0 ?? ph) + (B.n || 1) * B.sh }));
  ctx.covered = (x, z, y, self) => list.some((q) => q.B !== self && q.top > y + 0.3 && q.y0 <= y + 0.3 && x > q.x[0] - 0.05 && x < q.x[1] + 0.05 && z > q.z[0] - 0.05 && z < q.z[1] + 0.05);
  ctx.grow = (x0, x1, z0, z1, top) => { const b = ctx.bb; b[0] = Math.min(b[0], x0); b[1] = Math.max(b[1], x1); b[2] = Math.min(b[2], z0); b[3] = Math.max(b[3], z1); ctx.top = Math.max(ctx.top, top); };
  return ctx;
}

// ---------------------------------------------------------------- PHẦN PHỤ (extras) dùng chung
const EXTRA = {
  pergola: (acc, e, ctx) => { pergola(acc, e); ctx.top = Math.max(ctx.top, e.y0 + e.h); },
  canopy: (acc, e, ctx) => { canopy(acc, e); ctx.top = Math.max(ctx.top, e.y + (e.t || 0.18)); },
  /** ban công công-xôn: tấm + lan can ống 3 phía (mặt tường ở phía −nz) */
  balcony: (acc, e) => { const [x0, x1] = e.x, [z0, z1] = e.z; acc.add('concW', prism(rrect(x0, x1, z0, z1, e.r || {}), e.y - 0.2, 0.2)); const s = e.side || 1, zi = s > 0 ? z0 : z1, zo = s > 0 ? z1 - 0.1 : z0 + 0.1; tubeRail(acc, [[x0 + 0.1, zi], [x0 + 0.1, zo], [x1 - 0.1, zo], [x1 - 0.1, zi]], e.y, { closed: false, step: 1.2 }); },
  steps: (acc, e, ctx) => { const L = steps(acc, e); const sx = e.dir === '+x' ? 1 : e.dir === '-x' ? -1 : 0, sz = e.dir === '+z' ? 1 : e.dir === '-z' ? -1 : 0; ctx.grow(Math.min(e.cx, e.cx + sx * L) - (sz ? e.w / 2 + 0.4 : 0), Math.max(e.cx, e.cx + sx * L) + (sz ? e.w / 2 + 0.4 : 0), Math.min(e.cz, e.cz + sz * L) - (sx ? e.w / 2 + 0.4 : 0), Math.max(e.cz, e.cz + sz * L) + (sx ? e.w / 2 + 0.4 : 0), 0); },
  flag: (acc, e, ctx) => { acc.add('steel', cylY(0.07, e.h, e.x, e.y, e.z, 8, 0.04)); acc.add('gold', new THREE.SphereGeometry(0.14, 8, 6).translate(e.x, e.y + e.h + 0.1, e.z)); ctx.top = Math.max(ctx.top, e.y + e.h + 0.25); },
  /** biển chữ (hộp mỏng, UV mặc định: chữ đọc đúng từ mặt ngoài) */
  sign: (acc, e) => acc.add(e.key, box(e.w, e.h, e.d || 0.12, e.x, e.y, e.z, e.ry || 0)),
  box: (acc, e) => acc.add(e.key, boxB(e.w, e.h, e.d, e.x, e.y, e.z, e.ry || 0)),
  /** đèn tường tròn kim loại */
  /** khai mặt đi được (sàn quanh hồ bơi…) */
  plats: (acc, e) => { for (const q of e.list) acc.plat(q); },
  /** vòng dải màu quanh khối (dải vàng «tango» Molitor) */
  ring: (acc, e) => acc.add(e.key, ringPrism(e.x[0], e.x[1], e.z[0], e.z[1], e.r || {}, e.t || 0.1, e.y, e.h, e.out || 0.03)),
  lamps: (acc, e) => { for (const [x, z] of e.at) { acc.add('gold', cylY(0.16, 0.5, x, e.y, z + (e.nz || 0) * 0.12, 10)); acc.add('glow', cylY(0.12, 0.3, x, e.y + 0.1, z + (e.nz || 0) * 0.2, 10)); } },
};

// ---------------------------------------------------------------- LOẠI HÌNH: NHÀ KHỐI (biệt thự, cánh, xưởng, gara, hồ bơi, phòng tập, rạp)
/**
 * spec: { ph, W, D, plinth: { rects: [{ x, z, r, faces }], mat, rail, gaps: [[x0, x1, side]] }, blocks: [B…], extras: [{ f, … }],
 *         sub: [{ at: [x, z], ry, plinth, blocks, extras }] (nhóm khối xoay — xưởng chéo 45°), special: tên hàm riêng }
 */
export function adVilla(spec) {
  const acc = new Acc(), ph = spec.ph;
  const ctx = makeCtx(ph, spec.blocks);
  buildPlinth(acc, spec, ctx);
  for (const B of spec.blocks) block(acc, B, ctx);
  for (const e of spec.extras || []) (SPECIAL[e.f] || EXTRA[e.f])(acc, e, ctx, spec);
  finalizeUV(acc);
  for (const sg of spec.sub || []) { // nhóm xoay: dựng riêng, UV trước khi xoay, rồi gộp
    const a2 = new Acc(), c2 = makeCtx(sg.ph ?? ph, sg.blocks);
    const m = new THREE.Matrix4().makeRotationY(sg.ry || 0).setPosition(sg.at[0], 0, sg.at[1]), mi = m.clone().invert();
    c2.covered = ((base) => (x, z, y, self) => { if (base(x, z, y, self)) return true; const p = V(x, 0, z).applyMatrix4(m); return ctx.covered(p.x, p.z, y, null); })(c2.covered);
    buildPlinth(a2, { ...spec, ...sg, ph: sg.ph ?? ph }, c2);
    for (const B of sg.blocks) block(a2, B, c2);
    for (const e of sg.extras || []) (SPECIAL[e.f] || EXTRA[e.f])(a2, e, c2, spec);
    finalizeUV(a2);
    for (const [k, list] of a2.parts) for (const g of list) acc.add(k, g.applyMatrix4(m));
    const c = Math.cos(sg.ry || 0), s = Math.sin(sg.ry || 0); for (const q of a2.plats) acc.plat({ ...q, x: sg.at[0] + c * q.x + s * q.z, z: sg.at[1] - s * q.x + c * q.z, ry: (q.ry || 0) + (sg.ry || 0) });
    const [bx0, bx1, bz0, bz1] = c2.bb; for (const [x, z] of [[bx0, bz0], [bx1, bz0], [bx0, bz1], [bx1, bz1]]) { const p = V(x, 0, z).applyMatrix4(m); ctx.grow(p.x, p.x, p.z, p.z, c2.top); }
    void mi;
  }
  const [bx0, bx1, bz0, bz1] = ctx.bb;
  return { acc, info: { W: spec.W, D: spec.D, PW: +(bx1 - bx0).toFixed(2), PD: +(bz1 - bz0).toFixed(2), bbox: [bx0, bx1, bz0, bz1].map((v) => +v.toFixed(2)), ph, eave: spec.eave, top: +ctx.top.toFixed(2), kind: spec.kindName || 'villa', blocks: spec.blocks.length } };
}
/** bệ / tầng hầm nửa chìm (Cavrois: rez-de-jardin có cửa sổ hầm) — tường gạch rỗng có sàn trên, lan can ống quanh mép lộ */
function buildPlinth(acc, spec, ctx) {
  const P = spec.plinth; if (!P) return; const ph = spec.ph;
  for (const p of P.rects) {
    const B = { x: p.x, z: p.z, r: p.r || {}, y0: 0, n: 1, sh: ph, mat: P.mat || 'brick', t: 0.4, faces: p.faces || {}, roof: 'none' };
    block(acc, B, { ...ctx, grow: ctx.grow });
    acc.add('coping', ringPrism(p.x[0], p.x[1], p.z[0], p.z[1], p.r || {}, 0.4, ph - 0.12, 0.12, 0.03));
    acc.add('floor', prism(rrect(p.x[0] + 0.4, p.x[1] - 0.4, p.z[0] + 0.4, p.z[1] - 0.4, insetR(p.r, 0.4)), ph - 0.3, 0.3, (p.holes || []).map((h) => rrect(...h))));
    if (!p.noPlat) acc.plat({ x: (p.x[0] + p.x[1]) / 2, z: (p.z[0] + p.z[1]) / 2, w: p.x[1] - p.x[0], d: p.z[1] - p.z[0], top: ph });
    if (P.rail !== false && ph >= 0.5) {
      const ins = 0.18, pts = rrect(p.x[0] + ins, p.x[1] - ins, p.z[0] + ins, p.z[1] - ins, insetR(p.r, ins), 3);
      const gap = (x, z) => (P.gaps || []).some(([a, b, c, d]) => x > a && x < b && z > c && z < d);
      tubeRail(acc, pts, ph, { h: 1.0, skip: (x, z) => gap(x, z) || ctx.covered(x, z, ph - 0.25, null) || (P.rects.some((q) => q !== p && x > q.x[0] && x < q.x[1] && z > q.z[0] && z < q.z[1])) });
    }
  }
}

// ---------------------------------------------------------------- PHẦN RIÊNG (special) — gọi từ extras { f: tên }
const SPECIAL = {
  /** biệt thự: tầng belvedere trên tháp + 2 tấm «cánh» ngang mỏng (05 main §3.6, §5.2) */
  belvedere: (acc, e, ctx) => {
    const [x0, x1] = e.x, [z0, z1] = e.z;
    for (const [y, o] of [[e.y, 0.9], [e.y + e.h, 1.2]]) acc.add('concW', prism(rrect(x0 - o, x1 + o, z0 - o, z1 + o, { fl: 0.6, fr: 0.6, bl: 0.6, br: 0.6 }), y, 0.22));
    ctx.top = Math.max(ctx.top, e.y + e.h + 0.22);
  },
  /** sảnh kính hai tầng thông: đố lưới + sàn gác lửng bên trong (05 main §4) */
  mezz: (acc, e) => { acc.add('floor', boxB(e.x[1] - e.x[0], 0.3, e.z[1] - e.z[0], (e.x[0] + e.x[1]) / 2, e.y - 0.3, (e.z[0] + e.z[1]) / 2)); tubeRail(acc, [[e.x[0], e.z[1] - 0.1], [e.x[1], e.z[1] - 0.1]], e.y, { closed: false, h: 1.0 }); },
  /** giếng trời kính màu Barillet (salon rose Noailles) */
  skylight: (acc, e, ctx) => {
    const [x0, x1] = e.x, [z0, z1] = e.z, y = e.y, h = e.h, mid = new Acc();
    for (const F of [face(x0, z1, x1, z1, 0, 1), face(x1, z1, x1, z0, 1, 0), face(x1, z0, x0, z0, 0, -1), face(x0, z0, x0, z1, -1, 0)]) {
      const n = Math.max(1, Math.round(F.L / 1.2)); for (let i = 0; i < n; i++) acc.add(e.key || 'stained', fbox(F, (F.L * i) / n + 0.03, (F.L * (i + 1)) / n - 0.03, y, y + h, -0.05, -0.02));
      for (let i = 0; i <= n; i++) acc.add('frame', fbox(F, (F.L * i) / n - 0.03, (F.L * i) / n + 0.03, y, y + h, -0.07, 0));
    }
    acc.add(e.key || 'stained', boxB(x1 - x0, 0.05, z1 - z0, (x0 + x1) / 2, y + h, (z0 + z1) / 2));
    for (let x = x0; x <= x1 + 1e-3; x += (x1 - x0) / Math.round((x1 - x0) / 1.2)) acc.add('frame', boxB(0.06, 0.1, z1 - z0, x, y + h, (z0 + z1) / 2));
    acc.add('coping', ringPrism(x0, x1, z0, z1, {}, 0.12, y + h, 0.14, 0.06)); void mid;
    ctx.top = Math.max(ctx.top, y + h + 0.14);
  },
  /** rạp: mái hiên marquee cong viền đèn + 3 vây đứng mang chữ + dải faience đen (05 cinema §3, §5) */
  cinemaFront: (acc, e, ctx) => {
    const zf = e.zf, y = e.my;
    acc.add('faiB', prism(rrect(-e.mw / 2, e.mw / 2, zf - 0.3, zf + e.md, { fl: 2.8, fr: 2.8 }), y, 0.55));                   // marquee (mép cong)
    acc.add('gold', ringPrism(-e.mw / 2, e.mw / 2, zf - 0.3, zf + e.md, { fl: 2.8, fr: 2.8 }, 0.05, y + 0.38, 0.1, 0.03));        // nẹp đồng
    const lp = rrect(-e.mw / 2 + 0.25, e.mw / 2 - 0.25, zf, zf + e.md - 0.25, { fl: 2.55, fr: 2.55 }, 6);
    for (let i = 0; i < lp.length; i++) { const [ax, az] = lp[i], [bx, bz] = lp[(i + 1) % lp.length]; if (az < zf + 0.05 && bz < zf + 0.05) continue; const L = Math.hypot(bx - ax, bz - az), m = Math.max(1, Math.round(L / 0.55)); for (let j = 0; j < m; j++) { const t = (j + 0.5) / m; acc.add('glow', box(0.16, 0.08, 0.16, ax + (bx - ax) * t, y - 0.04, az + (bz - az) * t)); } } // viền đèn
    for (const [x, h, w] of [[0, e.h0, 1.5], [-e.fx, e.h1, 0.9], [e.fx, e.h1, 0.9]]) {
      acc.add('faience', boxB(w, h - y - 0.55, e.fd, x, y + 0.55, zf + e.fd / 2 - 0.4));
      for (const s of [-1, 1]) acc.add('faiB', boxB(0.08, h - y - 0.55, e.fd + 0.02, x + s * (w / 2 + 0.02), y + 0.55, zf + e.fd / 2 - 0.4)); // viền đen
      acc.add('faiB', boxB(w + 0.2, 0.25, e.fd + 0.2, x, h, zf + e.fd / 2 - 0.4));
      for (let k = 1; k <= 3; k++) acc.add('faiB', boxB(w + 0.06, 0.12, e.fd + 0.06, x, h - 0.6 * k - 0.4, zf + e.fd / 2 - 0.4));
    }
    const sh = e.h0 - y - 2.2; acc.add('signCine', box(1.54, sh, 1.6, 0, y + 0.55 + 0.6 + sh / 2, zf + e.fd - 1.25));                // chữ trên hai mặt bên vây giữa
    acc.add('signCine', box(1.2, sh, 0.06, 0, y + 0.55 + 0.6 + sh / 2, zf + e.fd - 0.37));                                            // và mặt trước vây
    ctx.top = Math.max(ctx.top, e.h0 + 0.25);
  },
  /** dải faience đen ngang + gờ trên mặt tiền rạp */
  bands: (acc, e) => { for (const y of e.ys) acc.add('faiB', boxB(e.w, 0.16, 0.08, 0, y, e.z)); },
  /** trụ tường (pilaster) gạch dọc tường khán phòng */
  pilasters: (acc, e) => { for (const s of [-1, 1]) for (let z = e.z[0] + e.step / 2; z < e.z[1]; z += e.step) acc.add(e.key, boxB(0.3, e.h, 0.8, s * (e.x + 0.15), e.y0, z)); },
  /** HỒ BƠI trong nhà (Noailles 15 × 7 × 1,27; Cavrois cầu nhảy): lòng bể gạch trắng, nước, bậc xuống, cầu nhảy, thang inox */
  pool: (acc, e, ctx) => {
    const [x0, x1] = e.x, [z0, z1] = e.z, ph = ctx.ph, d = e.depth, yW = ph - 0.25;
    acc.add('poolTile', boxB(x1 - x0 + 0.6, 0.3, z1 - z0 + 0.6, (x0 + x1) / 2, ph - d - 0.3, (z0 + z1) / 2));
    for (const [w, dd, x, z] of [[x1 - x0 + 0.6, 0.3, (x0 + x1) / 2, z0 - 0.15], [x1 - x0 + 0.6, 0.3, (x0 + x1) / 2, z1 + 0.15], [0.3, z1 - z0, x0 - 0.15, (z0 + z1) / 2], [0.3, z1 - z0, x1 + 0.15, (z0 + z1) / 2]]) acc.add('poolTile', boxB(w, d, dd, x, ph - d, z));
    acc.add('water', boxB(x1 - x0, 0.06, z1 - z0, (x0 + x1) / 2, yW - 0.06, (z0 + z1) / 2));
    acc.add('faiB', boxB(x1 - x0 - 1, 0.012, 0.25, (x0 + x1) / 2, ph - d + 0.001, (z0 + z1) / 2));                                   // vạch đáy
    acc.add('poolTile', ringPrism(x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3, {}, 0.3, ph - 0.02, 0.05, 0));
    acc.plat({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, w: x1 - x0, d: z1 - z0, top: ph - d });
    const nst = Math.round(d / 0.3); for (let i = 1; i < nst; i++) { const top = ph - d + (d * i) / nst, xx = x1 - 0.35 * (nst - i - 0.5); acc.add('poolTile', boxB(0.35, top - (ph - d), 3.2, xx, ph - d, z0 + 1.6)); acc.plat({ x: xx, z: z0 + 1.6, w: 0.37, d: 3.2, top }); }
    acc.add('chrome', boxB(0.6, 0.5, 0.9, x0 - 0.5, ph, 0)); acc.add('chrome', boxB(0.55, 0.08, 3.6, x0 + 1.1, ph + 0.75, 0)); acc.add('wood', boxB(0.5, 0.06, 3.4, x0 + 1.2, ph + 0.83, 0)); // cầu nhảy
    for (const sz of [-1, 1]) acc.add('chrome', tube(V(x0 - 0.5, ph, sz * 0.32), V(x0 - 0.5, ph + 1.0, sz * 0.32), 0.03));
    for (const sz of [-1, 1]) acc.add('chrome', tube(V(x1 - 2.4, ph - 1.2, z1 - 0.15 + sz * 0), V(x1 - 2.4, ph + 0.9, z1 + 0.25), 0.03));
  },
  /** trần lưới dầm ô vuông + gạch kính trên sàn mái (Noailles: « lưới dầm bê tông » — POP IA83000028) */
  coffers: (acc, e) => {
    const [x0, x1] = e.x, [z0, z1] = e.z, y = e.y;
    for (let x = x0 + e.step; x < x1 - 0.1; x += e.step) acc.add('concW', boxB(0.3, 0.6, z1 - z0, x, y - 0.6, (z0 + z1) / 2));
    for (let z = z0 + e.step; z < z1 - 0.1; z += e.step) acc.add('concW', boxB(x1 - x0, 0.6, 0.3, (x0 + x1) / 2, y - 0.6, z));
    for (let x = x0 + e.step / 2; x < x1; x += e.step) for (let z = z0 + e.step / 2; z < z1; z += e.step) for (const [dx, dz] of [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]]) acc.add('gblock', boxB(0.42, 0.05, 0.42, x + dx, e.yr, z + dz));
  },
  /** dãy cabin thay đồ xanh Molitor dọc tường trong */
  cabins: (acc, e) => { const n = Math.round((e.x[1] - e.x[0]) / 1.2); for (let i = 0; i < n; i++) { const x = e.x[0] + 1.2 * (i + 0.5); acc.add('cabin', boxB(1.06, 2.3, 0.08, x, e.y, e.z)); acc.add('chrome', cylY(0.12, 0.04, x, e.y + 1.7, e.z + 0.05, 10).rotateX(0)); acc.add('render', boxB(0.12, 2.6, 1.2, x + 0.6, e.y, e.z - 0.6)); } acc.add('render', boxB(e.x[1] - e.x[0], 0.12, 1.3, (e.x[0] + e.x[1]) / 2, e.y + 2.6, e.z - 0.6)); },
  /** cửa sổ tròn kiểu tàu thuỷ trên một mặt tường (ô vuông khoét tường + tấm có lỗ tròn + vành crôm) */
  portholes: (acc, e, ctx, spec) => {
    const F = face(...e.face), m = faceMat(F), r = e.r || 0.42;
    for (const u of e.us) {
      const sq = new THREE.Shape([new THREE.Vector2(-r - 0.25, -r - 0.25), new THREE.Vector2(r + 0.25, -r - 0.25), new THREE.Vector2(r + 0.25, r + 0.25), new THREE.Vector2(-r - 0.25, r + 0.25)]);
      const hole = new THREE.Path(); hole.absarc(0, 0, r, 0, Math.PI * 2, true); sq.holes.push(hole);
      const g = new THREE.ExtrudeGeometry(sq, { depth: 0.2, bevelEnabled: false, curveSegments: 16 }); g.translate(u, e.y, -0.2); acc.add(e.key || 'render', g.applyMatrix4(m));
      const rg = new THREE.Shape(); rg.absarc(0, 0, r + 0.08, 0, Math.PI * 2, false); const h2 = new THREE.Path(); h2.absarc(0, 0, r, 0, Math.PI * 2, true); rg.holes.push(h2);
      const g2 = new THREE.ExtrudeGeometry(rg, { depth: 0.06, bevelEnabled: false, curveSegments: 16 }); g2.translate(u, e.y, 0); acc.add('chrome', g2.applyMatrix4(m));
      const gl = new THREE.CylinderGeometry(r, r, 0.02, 16); gl.rotateX(Math.PI / 2); gl.translate(u, e.y, -0.12); acc.add('glass', gl.applyMatrix4(m));
    }
    void spec; void ctx;
  },
  /** cầu thang ngoài lên sân thượng (Noailles hồ bơi) dọc một mặt, lan can ống phía ngoài */
  extStair: (acc, e, ctx) => {
    const n = Math.round(e.h / 0.17), r = e.h / n, run = 0.28, x = e.x, w = e.w;
    for (let i = 1; i <= n; i++) { const z = e.z0 - run * (i - 0.5), top = r * i; acc.add('concW', boxB(w, 0.18, run + 0.02, x, top - 0.18, z)); acc.plat({ x, z, w, d: run + 0.02, top }); }
    acc.add('concW', slabXY([[e.z0, 0], [e.z0 - n * run, e.h - 0.2], [e.z0 - n * run, 0]].map(([z, y]) => [-z, y]), 0.25, x + w / 2 - 0.12, 0, 0, Math.PI / 2));
    tubeRail(acc, [[x + w / 2 - 0.05, e.z0], [x + w / 2 - 0.05, e.z0 - n * run]], 0, { closed: false, h: 1.0 });
    acc.add('rail', tube(V(x + w / 2 - 0.05, 1.0, e.z0), V(x + w / 2 - 0.05, e.h + 1.0, e.z0 - n * run), 0.032));
    acc.plat({ x, z: e.z0 - n * run - 0.8, w, d: 1.6, top: e.h });
    ctx.grow(x - w / 2, x + w / 2, e.z0 - n * run, e.z0, e.h);
  },
};

// ---------------------------------------------------------------- LẦU 10 TẦNG SETBACK (Thiên Kim Lâu)
/**
 * Vỏ ngoài lầu setback (05 › lầu §3–§8): bệ granite đen · đế 3 tầng góc bo r 3 gạch sọc, 5 khoang/mặt, cổng đồng + quạt sunburst +
 * chữ «THIÊN KIM LÂU» · thân 3 tầng: trụ đá vôi liền 3 tầng, spandrel nhôm chevron lùi giữa trụ · đầu tháp 4 tầng: 3 khoang, góc
 * cắt bậc, nẹp crôm · dải zigzag dưới mỗi bậc lùi · linh vật thép ở 4 góc bậc lùi thứ hai · Vọng Đài + khối chóp 14 m (không đi
 * được) + 5 vòm bậc toả tia có cửa tam giác (Chrysler) + cột buồm 4 bậc (Empire State).
 * ts = towerSpec(style) (tower.js): { n = 4, FH, floors[{ y, a, gal, slabA }], deck { y, a }, podium { y, a, stairW, steps, rise, tread, run } }
 */
export function adTower(ts) {
  const acc = new Acc(), P = ts.podium, FH = ts.FH, Fl = ts.floors, T = 0.6;
  // --- bệ granite đen + mặt sàn + bậc trước + gờ + lan can ống (khe bậc)
  acc.add('granite', boxB(2 * P.a, P.y - 0.1, 2 * P.a, 0, 0, 0)); acc.add('floor', boxB(2 * P.a - 0.8, 0.1, 2 * P.a - 0.8, 0, P.y - 0.1, 0)); acc.add('coping', ringPrism(-P.a, P.a, -P.a, P.a, {}, 0.4, P.y - 0.1, 0.1, 0.02));
  acc.plat({ x: 0, z: 0, w: 2 * P.a, d: 2 * P.a, top: P.y });
  for (let i = 1; i <= P.steps; i++) { const z = P.a + P.run - (i - 0.5) * P.tread, top = i * P.rise; acc.add('granite', boxB(P.stairW, top, P.tread + 0.01, 0, 0, z)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top }); }
  for (const s of [-1, 1]) acc.add('granite', boxB(0.7, P.y * 0.5 + 1, P.run, s * (P.stairW / 2 + 0.35), 0, P.a + P.run / 2));
  const pe = P.a - 0.3, sw = P.stairW / 2 + 0.1;
  for (const [ax, az, bx, bz] of [[-sw, pe, -pe, pe], [-pe, pe, -pe, -pe], [-pe, -pe, pe, -pe], [pe, -pe, pe, pe], [pe, pe, sw, pe]]) { acc.add('granite', box(Math.abs(bx - ax) + 0.4, 0.4, Math.abs(bz - az) + 0.4, (ax + bx) / 2, P.y + 0.2, (az + bz) / 2)); }
  tubeRail(acc, [[-sw, pe], [-pe, pe], [-pe, -pe], [pe, -pe], [pe, pe], [sw, pe]], P.y + 0.4, { closed: false, h: 0.7, bars: [0.35] });
  // --- nhóm tầng theo bậc lùi
  const groups = []; Fl.forEach((f, k) => { const g = groups[groups.length - 1]; if (g && g.a === f.a) g.ks.push(k); else groups.push({ a: f.a, ks: [k] }); });
  groups.forEach((G, gi) => {
    const A = G.a + T / 2, rc = gi === 0 ? 3 : 0, yG0 = Fl[G.ks[0]].y, yG1 = Fl[G.ks[G.ks.length - 1]].y + FH - 0.4;
    const faces = [face(-A + rc, A, A - rc, A, 0, 1), face(A, A - rc, A, -A + rc, 1, 0), face(A - rc, -A, -A + rc, -A, 0, -1), face(-A, -A + rc, -A, A - rc, -1, 0)];
    const bays = gi === 0 || gi === 1 ? 5 : 3, style = gi === 0 ? 'base' : gi === 1 ? 'shaft' : 'top', pw = style === 'shaft' ? 1.2 : 1.4;
    // tâm các trụ: đế chia đều; thân trụ góc sát góc; đầu tháp trụ góc lùi 1,3 m (góc cắt bậc — 05 lầu §3.4)
    const pierCenters = (L) => { const e = style === 'base' ? 0 : style === 'shaft' ? pw / 2 : 1.3, out = []; for (let b = 0; b <= bays; b++) out.push(e + ((L - 2 * e) * b) / bays); return out; };
    for (const k of G.ks) {
      const f = Fl[k], y0 = f.y, y1 = f.y + FH - 0.4;
      // sàn (tầng có sân thượng: sàn phủ tới mép bậc lùi)
      if (k) acc.add('floor', prism(rrect(-f.slabA, f.slabA, -f.slabA, f.slabA, gi === 0 || (f.gal && groups[gi - 1] === groups[0]) ? { fl: 3, fr: 3, bl: 3, br: 3 } : {}), f.y - 0.4, 0.4));
      faces.forEach((F, fi) => {
        const L = F.L, ops = [], front = fi === 0, back = fi === 2, pc = pierCenters(L);
        for (let b = 0; b < bays; b++) {
          const c = (pc[b] + pc[b + 1]) / 2, gap = pc[b + 1] - pc[b], mid = b === (bays - 1) / 2;
          const doorHere = mid && ((front && (k === 0 || f.gal)) || (back && f.gal));
          if (style === 'base') {
            const w = gap - 1.4;
            if (doorHere && k === 0) ops.push({ u0: c - w / 2, u1: c + w / 2, y0, y1: y0 + 3.3, kind: 'door', door: { c, w: 2.4, h: 3.0 }, fk: 'gold', m: 0.5, tr: [y0 + 2.4] });
            else if (doorHere) ops.push({ u0: c - 1.8, u1: c + 1.8, y0, y1: y0 + 3.3, kind: 'door', door: { c, w: 2.4, h: 2.9 }, m: 0.6, tr: [] });
            else ops.push({ u0: c - w / 2, u1: c + w / 2, y0: y0 + 0.9, y1: y0 + 3.7, kind: 'band', m: 1.1, tr: [y0 + 3.0] });
          } else {
            const w = gap - pw - 0.2;
            if (doorHere) ops.push({ u0: c - 1.8, u1: c + 1.8, y0, y1: y0 + 3.4, kind: 'door', door: { c, w: 2.4, h: 3.0 }, m: 0.6, tr: [] });
            else if (style === 'shaft') ops.push({ u0: c - w / 2, u1: c + w / 2, y0: y0 + 1.15, y1: y0 + 4.15, kind: 'band', m: 1.05, tr: [y0 + 3.4], sill: false });
            else { ops.push({ u0: c - w / 2, u1: c - 0.2, y0: y0 + 0.9, y1: y0 + 4.3, kind: 'tall', m: 1.0, tr: [y0 + 3.5], sill: false }); ops.push({ u0: c + 0.2, u1: c + w / 2, y0: y0 + 0.9, y1: y0 + 4.3, kind: 'tall', m: 1.0, tr: [y0 + 3.5], sill: false }); }
          }
        }
        wallOpen(acc, F, y0, y1, ops, gi === 0 ? 'brick' : 'lime', T); for (const o of ops) fillOpening(acc, F, o, T);
        // spandrel nhôm chevron (lùi giữa trụ) dưới mỗi cửa sổ thân / đầu tháp
        if (style !== 'base') for (const o of ops) if (o.kind !== 'door') { const ya = k === G.ks[0] ? y0 + 0.05 : y0 - 0.75, yb = o.y0; acc.add('spandrel', fbox(F, o.u0, o.u1, ya, yb, -0.05, 0.02)); if (k === G.ks[G.ks.length - 1]) acc.add('spandrel', fbox(F, o.u0, o.u1, o.y1, y1 - 0.05, -0.05, 0.02)); }
        // cổng chính: quạt sunburst đồng trên nền granite + chữ tên lầu (05 lầu §5.6)
        if (k === 0 && front) {
          const c = L / 2, m = faceMat(F), yb = y0 + 3.35, rF = 1.55;
          const semi = new THREE.Shape(); semi.moveTo(-rF, 0); semi.absarc(0, 0, rF, Math.PI, 0, true); semi.lineTo(-rF, 0);
          const sg = new THREE.ExtrudeGeometry(semi, { depth: 0.12, bevelEnabled: false, curveSegments: 20 }); sg.translate(c, yb, 0); acc.add('granite', sg.applyMatrix4(m));
          for (let i = 0; i < 11; i++) { const a = Math.PI * (i + 0.5) / 11, g = new THREE.BoxGeometry(rF * 0.92, 0.07, 0.06); g.translate(rF * 0.46, 0, 0); g.rotateZ(a); g.translate(c, yb, 0.15); acc.add('gold', g.applyMatrix4(m)); }
          const ring = new THREE.Shape(); ring.absarc(0, 0, rF + 0.12, 0, Math.PI, false); ring.absarc(0, 0, rF - 0.02, Math.PI, 0, true);
          const rg = new THREE.ExtrudeGeometry(ring, { depth: 0.18, bevelEnabled: false, curveSegments: 20 }); rg.translate(c, yb, 0); acc.add('gold', rg.applyMatrix4(m));
          acc.add('signTower', fbox(F, c - 3.6, c + 3.6, y0 + 5.05, y0 + 5.8, -0.02, 0.14));
          acc.add('gold', fbox(F, c - 2.25, c + 2.25, y0 + 3.3, y0 + 3.42, -0.05, 0.22));
          for (const s of [-1, 1]) acc.add('gold', fbox(F, c + s * 2.2 - 0.12, c + s * 2.2 + 0.12, y0, y0 + 3.42, -0.05, 0.22));
        }
      });
      // góc bo (đế)
      if (rc) for (const [cx, cz, a0] of [[A - rc, A - rc, 0], [-A + rc, A - rc, Math.PI / 2], [-A + rc, -A + rc, Math.PI], [A - rc, -A + rc, 1.5 * Math.PI]]) { const o = [], i = []; for (let q = 0; q <= 12; q++) { const a = a0 + (Math.PI / 2) * (q / 12); o.push([cx + Math.cos(a) * rc, cz + Math.sin(a) * rc]); i.push([cx + Math.cos(a) * (rc - T), cz + Math.sin(a) * (rc - T)]); } acc.add('brick', prism([...o, ...i.reverse()], y0, y1 - y0)); }
      if (k === 9 || Fl[k + 1]?.a !== f.a) acc.add('floor', prism(rrect(-A, A, -A, A, rc ? { fl: rc, fr: rc, bl: rc, br: rc } : {}), y1, 0.4));
    }
    // trụ dọc liên tục suốt nhóm (đá vôi), góc cắt bậc ở đầu tháp, nẹp crôm tầng 9–10
    if (style !== 'base') faces.forEach((F) => {
      const yA = yG0, yB = yG1 + 0.95, k8 = Fl.find((f) => f.k === 8);
      for (const u of pierCenters(F.L)) {
        acc.add('lime', fbox(F, u - pw / 2, u + pw / 2, yA, yB, -0.1, 0.45));
        if (style === 'top' && k8 && k8.a === G.a) acc.add('chrome', fbox(F, u - 0.08, u + 0.08, k8.y, yG1 + 0.6, 0.45, 0.53));
      }
      if (style === 'top') for (const [a, b] of [[0, 0.35], [F.L - 0.35, F.L]]) acc.add('lime', fbox(F, a, b, yA, yB - 0.3, -0.1, 0.2)); // bậc thụt ở góc
    });
    // dải zigzag hai màu dưới bậc lùi (Chrysler 24–27) + tường chắn + lan can ống trên sân thượng bậc lùi
    {
      const nf = gi < groups.length - 1 ? Fl[groups[gi + 1].ks[0]] : { y: ts.deck.y, slabA: ts.deck.a + 0.25 }, yz = nf.y - 1.45;
      faces.forEach((F) => { const g = fbox(F, 0, F.L, yz, yz + 0.75, -0.05, 0.06); bandUV(g, F, yz, 0.75, 2); acc.add('zig', g); });
      if (rc) acc.add('faiB', ringPrism(-A, A, -A, A, { fl: rc, fr: rc, bl: rc, br: rc }, 0.2, yz, 0.75, 0.04));
      const so = A, si = Math.min(nf.slabA - 0.1, A - 0.35), rr = rc ? { fl: rc, fr: rc, bl: rc, br: rc } : {};
      acc.add(gi === 0 ? 'brick' : 'lime', prism(rrect(-so, so, -so, so, rr), nf.y - 0.4, 0.9, [rrect(-si, si, -si, si, insetR(rr, so - si))]));
      acc.add('coping', prism(rrect(-so - 0.05, so + 0.05, -so - 0.05, so + 0.05, insetR(rr, -0.05)), nf.y + 0.5, 0.1, [rrect(-si + 0.02, si - 0.02, -si + 0.02, si - 0.02, insetR(rr, so - si + 0.02))]));
      const ri = (so + si) / 2; tubeRail(acc, rrect(-ri, ri, -ri, ri, insetR(rr, so - ri), 3), nf.y + 0.6, { h: 0.5, bars: [0.25], step: 1.8 });
    }
    // linh vật thép ở 4 góc bậc lùi thứ hai (đại bàng Chrysler tầng 61)
    if (gi === 1) for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const pts = [[0, -0.45], [0.7, -0.55], [1.5, -0.45], [2.1, -0.25], [2.55, -0.05], [2.35, -0.4], [2.75, -0.1], [2.6, 0.12], [2.2, 0.3], [1.6, 0.5], [0.9, 0.62], [0.2, 0.6], [0, 0.4]];
      acc.add('steel', silhouette(pts, 0.7, sx * (A - 0.3), Fl[groups[2].ks[0]].y - 0.9, sz * (A - 0.3), Math.atan2(-sz, sx)));
    }
  });
  // --- Vọng Đài: khối chóp 14 m (cạnh 2 × 7, có cửa mở 4 mặt) — không đi được bên trên
  const D = ts.deck, ctx = makeCtx(D.y, []), yc = D.y + 5;
  block(acc, { x: [-7, 7], z: [-7, 7], y0: D.y, n: 1, sh: 5, mat: 'lime', t: 0.4, faces: { f: 'door:2.6', b: 'door:2.6', l: 'door:2.6', r: 'door:2.6' }, roof: 'none' }, ctx);
  acc.add('floor', prism(rrect(-6.6, 6.6, -6.6, 6.6), yc - 0.3, 0.3));
  for (const F of [face(-7, 7, 7, 7, 0, 1), face(7, 7, 7, -7, 1, 0), face(7, -7, -7, -7, 0, -1), face(-7, -7, -7, 7, -1, 0)]) {
    for (const u of [0.6, 3.4, F.L - 3.4, F.L - 0.6]) acc.add('lime', fbox(F, u - 0.5, u + 0.5, D.y, yc + 0.6, 0, 0.35));
    for (const u of [3.4, F.L - 3.4]) acc.add('chrome', fbox(F, u - 0.08, u + 0.08, D.y + 0.4, yc + 0.4, 0.35, 0.43));
    const g = fbox(F, 0, F.L, yc - 0.9, yc - 0.2, -0.02, 0.05); bandUV(g, F, yc - 0.9, 0.7, 2); acc.add('zig', g);
  }
  // --- 5 vòm bậc toả tia (Nirosta, Chrysler — 05 lầu §2, §5.2): mỗi bậc = 4 tấm vòm móng ngựa đứng (dải 1 m) quanh một lõi
  //     vuông; bậc sau lùi 1,1 m và nâng 2 m → mặt đứng là các vòng cung lồng nhau; 7 cửa tam giác sáng toả tia trên mỗi dải
  let archTop = yc;
  for (let i = 0; i < 5; i++) {
    const s = 6.6 - 1.1 * i, yb = yc + 2.0 * i, hv = 1.0, bw = 1.0, ri = s - bw, N = 20;
    const pl = [[-s, 0], [-ri, 0], [-ri, hv]]; for (let q = 1; q < N; q++) { const a = Math.PI - (Math.PI * q) / N; pl.push([Math.cos(a) * ri, hv + Math.sin(a) * ri]); }
    pl.push([ri, hv], [ri, 0], [s, 0], [s, hv]); for (let q = 1; q < N; q++) { const a = (Math.PI * q) / N; pl.push([Math.cos(a) * s, hv + Math.sin(a) * s]); } pl.push([-s, hv]);
    acc.add('steel', boxB(2 * (s - 0.3), i === 4 ? hv + s * 0.8 : 2.0 + hv * 0.2, 2 * (s - 0.3), 0, yb, 0));                          // lõi
    for (let f = 0; f < 4; f++) {
      const ry = (f * Math.PI) / 2, g = slabXY(pl, 0.25, 0, yb, s - 0.125); g.rotateY(ry); acc.add('chrome', g);
      for (let j = 0; j < 7; j++) {
        const th = (Math.PI * (j + 0.5)) / 7, c = Math.cos(th), sn = Math.sin(th), rc = s - bw / 2, L = 0.72, hw = Math.min(0.3, rc * Math.sin(Math.PI / 14) * 0.85);
        const tri = [[c * (rc + L / 2), hv + sn * (rc + L / 2)], [c * (rc - L / 2) - sn * hw, hv + sn * (rc - L / 2) + c * hw], [c * (rc - L / 2) + sn * hw, hv + sn * (rc - L / 2) - c * hw]];
        const t = slabXY(tri, 0.05, 0, yb, s + 0.02); t.rotateY(ry); acc.add('glow', t);
      }
    }
    archTop = yb + hv + s;
  }
  // --- cột buồm 4 bậc + trụ tròn + chóp nón + cột cờ (Empire State)
  let ym = archTop - 1.6;
  for (const w of [2.0, 1.5, 1.1, 0.8]) { acc.add('steel', boxB(w, 0.7, w, 0, ym, 0)); acc.add('chrome', boxB(w + 0.08, 0.08, w + 0.08, 0, ym + 0.62, 0)); ym += 0.7; }
  acc.add('steel', cylY(0.34, 1.4, 0, ym, 0, 16)); ym += 1.4; acc.add('chrome', cylY(0.34, 1.4, 0, ym, 0, 16, 0.05)); ym += 1.4; acc.add('steel', cylY(0.05, 2.0, 0, ym, 0, 8, 0.03)); ym += 2.0;
  return { acc, info: { W: 2 * P.a, D: 2 * P.a, PW: 2 * P.a, PD: 2 * P.a, ph: P.y, eave: D.y, top: +ym.toFixed(2), n: ts.n, floors: Fl.length, a: Fl.map((f) => f.a), kind: 'tower' } };
}

// ================================================================ ĐÌNH / TIỂU CÔNG TRÌNH
const done = (acc, info) => { finalizeUV(acc); return { acc, info }; };

/** summit — belvédère Cavrois + tháp Pavillon du Tourisme: thân vuông gạch, 3 cánh buồm ngang, phòng tròn kính 360°, mái đĩa, cột cờ */
export function adBelvedere(s) {
  const acc = new Acc(), ph = s.ph, ctx = makeCtx(ph, []);
  acc.add('stone', boxB(9, 0.2, 9, 0, 0, 0)); acc.add('stone', boxB(7.6, ph - 0.2, 7.6, 0, 0.2, 0)); acc.plat({ x: 0, z: 0, w: 9, d: 9, top: 0.2 }); acc.plat({ x: 0, z: 0, w: 7.6, d: 7.6, top: ph });
  const hs = s.shaft / 2, yS = ph + s.shaftH;
  block(acc, { x: [-hs, hs], z: [-hs, hs], y0: ph, n: 2, sh: s.shaftH / 2, mat: 'brick', t: 0.3, faces: { f: ['door:1.4', 'blank'], b: ['tall:1', 'blank'], l: ['tall:1', 'blank'], r: ['tall:1', 'blank'] }, roof: 'none' }, ctx);
  acc.add('clock', cylY(0.62, 0.08, 0, 0, 0, 24).rotateX(Math.PI / 2).translate(0, ph + 4.3, hs + 0.02)); acc.add('gold', prism(circ(0.72, 24), 0, 0.1, [circ(0.62, 24)]).rotateX(Math.PI / 2).translate(0, ph + 4.3, hs + 0.12));
  for (let i = 0; i < 3; i++) { const w = s.sail - 0.9 * i, y = yS - 1.6 + 0.6 * i; acc.add('concW', boxB(w, 0.14, w, 0, y, 0)); }        // 3 cánh buồm ngang (cổ tháp)
  const R = s.room / 2, y0 = yS, yR = y0 + s.roomH;
  acc.add('floor', cylY(R + 0.25, 0.3, 0, y0 - 0.05, 0, 32));
  acc.add('render', prism(circ(R, 32), y0 + 0.25, 0.65, [circ(R - 0.25, 32)]));
  acc.add('glass', prism(circ(R - 0.1, 32), y0 + 0.9, s.roomH - 1.05, [circ(R - 0.13, 32)]));
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; acc.add('frame', boxB(0.06, s.roomH - 1.0, 0.08, Math.cos(a) * (R - 0.08), y0 + 0.9, Math.sin(a) * (R - 0.08), -a)); }
  acc.add('frame', prism(circ(R - 0.05, 32), y0 + 2.0, 0.05, [circ(R - 0.17, 32)]));
  acc.add('concW', cylY(s.disc / 2, 0.3, 0, yR - 0.15, 0, 40)); acc.add('coping', cylY(s.disc / 2 + 0.04, 0.08, 0, yR + 0.15, 0, 40));
  EXTRA.flag(acc, { x: 0, z: 0, y: yR + 0.23, h: s.flag }, ctx);
  return done(acc, { W: 9, D: 9, PW: 9, PD: 9, ph, eave: yR, top: ctx.top, kind: 'belvedere' });
}
const circ = (r, n, cx = 0, cz = 0) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cz + Math.sin(a) * r]; });
/** điểm cung tròn qua 3 điểm (mặt bằng) */
function arc3(p0, pm, p1, n) {
  const [ax, az] = p0, [bx, bz] = pm, [cx, cz] = p1, d = 2 * (ax * (bz - cz) + bx * (cz - az) + cx * (az - bz));
  const ux = ((ax * ax + az * az) * (bz - cz) + (bx * bx + bz * bz) * (cz - az) + (cx * cx + cz * cz) * (az - bz)) / d, uz = ((ax * ax + az * az) * (cx - bx) + (bx * bx + bz * bz) * (ax - cx) + (cx * cx + cz * cz) * (bx - ax)) / d;
  const r = Math.hypot(ax - ux, az - uz); let a0 = Math.atan2(az - uz, ax - ux), a1 = Math.atan2(cz - uz, cx - ux), am = Math.atan2(bz - uz, bx - ux);
  const norm = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); let sw = norm(a1 - a0); if (norm(am - a0) > sw) sw -= 2 * Math.PI;
  return Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (sw * i) / n; return [ux + Math.cos(a) * r, uz + Math.sin(a) * r]; });
}

/** gaz1 — sảnh Eltham: mặt bằng tam giác cạnh cong, 3 lối ở 3 đỉnh vát, tường kính ghép tam giác trắng-hồng, vòm nông gạch kính, quả cầu sáng */
export function adGlassDome(s) {
  const acc = new Acc(), ph = s.ph, Rv = s.Rv, ctx = makeCtx(ph, []);
  const dir = (k) => Math.PI / 2 + (k * 2 * Math.PI) / 3, P = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
  const outline = []; for (let k = 0; k < 3; k++) { const a = dir(k), b = dir(k + 1); outline.push(...arc3(P(a + 0.2, Rv + 0.9), P((a + b) / 2, s.rMid + 0.9), P(b - 0.2, Rv + 0.9), 10)); }
  for (const [i, h] of [[0, 0.15], [1, 0.3], [2, ph]]) acc.add('stone', prism(outline.map(([x, z]) => { const L = Math.hypot(x, z); return [(x * (L - 0.3 * i)) / L, (z * (L - 0.3 * i)) / L]; }), 0, h));
  acc.plat({ x: 0, z: 0, w: 2 * Rv, d: 2 * Rv, top: ph }); for (const [w, h] of [[2 * Rv + 1.8, 0.15], [2 * Rv + 1.2, 0.3]]) acc.plat({ x: 0, z: 0, w, d: w, top: h });
  const yR = ph + s.wallH;
  for (let k = 0; k < 3; k++) {
    const a = dir(k), b = dir(k + 1), pts = arc3(P(a + 0.24, Rv), P((a + b) / 2, s.rMid), P(b - 0.24, Rv), 9);
    for (const [x, z] of [pts[0], pts[pts.length - 1]]) acc.add('brick', boxB(0.7, s.wallH, 0.7, x, ph, z));                     // trụ hai bên lối vào
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, ry = Math.atan2(-(z1 - z0), x1 - x0);
      acc.add('concW', box(L + 0.02, 0.6, 0.3, mx, ph + 0.3, mz, ry)); acc.add('triGlass', box(L, s.wallH - 0.9, 0.06, mx, ph + 0.6 + (s.wallH - 0.9) / 2, mz, ry));
      acc.add('frame', boxB(0.07, s.wallH - 0.6, 0.12, x0, ph + 0.6, z0)); acc.add('concW', box(L + 0.05, 0.3, 0.32, mx, yR - 0.15, mz, ry));
    }
  }
  // vành vòm + vòm bê tông lắp gạch kính (Ø 8,9 × 1,27 — 05 gaz1 §8), mắt kính đỉnh
  const Rd = s.dome / 2, yd = yR;
  acc.add('concW', prism(circ(Rd + 0.35, 40), yd, 0.45, [circ(Rd - 0.6, 40)]));
  const prof = []; const H = s.domeH; for (let i = 0; i <= 10; i++) { const t = i / 10, r = Rd * Math.cos(t * Math.PI / 2 * 0.92) + 0.001; prof.push([Math.max(0.7, r), yd + 0.45 + H * Math.sin(t * Math.PI / 2 * 0.92) / Math.sin(Math.PI / 2 * 0.92)]); }
  const inner = prof.map(([r, y]) => [Math.max(0.55, r - 0.18), y - 0.18]).reverse();
  const shape = [...prof, [0.55, prof[prof.length - 1][1]], ...inner, [Rd - 0.18, yd + 0.45], prof[0]];
  acc.add('dome', lathe(shape, 0, 0, 0, 40));
  acc.add('glow', lathe([[0.001, 0], [0.62, 0], [0.62, 0.08], [0.001, 0.1]], 0, prof[prof.length - 1][1] - 0.05, 0, 20));
  // quả cầu sáng xoay (Guevrekian 1925) trên chân đồng
  acc.add('gold', cylY(0.12, 1.1, 0, ph, 0, 10, 0.06)); acc.add('glow', new THREE.SphereGeometry(0.6, 20, 14).translate(0, ph + 1.75, 0)); acc.add('gold', cylY(0.45, 0.12, 0, ph, 0, 16));
  return done(acc, { W: s.W, D: s.W, PW: 2 * (Rv + 0.9), PD: 2 * (Rv + 0.9), ph, eave: yR, top: prof[prof.length - 1][1] + 0.05, kind: 'glassdome' });
}

/** gaz2 — đình tennis: phòng thay đồ gạch vàng, khán đài 3 bậc, mái công-xôn mỏng nhô về sân, nửa kia pergola, bảng điểm Deco */
export function adTennis(s) {
  const acc = new Acc(), ph = s.ph, ctx = makeCtx(ph, []), hw = s.W / 2, hd = s.D / 2;
  acc.add('stone', boxB(s.W, ph, s.D, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: s.W, d: s.D, top: ph });
  block(acc, { x: [-hw, -hw + 5], z: [-hd, 2.5], y0: ph, n: 1, sh: s.h, mat: 'brick', t: 0.3, faces: { f: 'door:1.3', l: 'small:2', b: 'small:2', r: 'blank' }, roof: 'none' }, ctx);
  const x0 = -hw + 5.1, tiers = [[1.0, 3.6, 0.45], [-1.2, 1.0, 0.9], [-3.4, -1.2, 1.35]];
  for (const [za, zb, h] of tiers) { acc.add('concW', boxB(hw - x0 - 0.3, h, zb - za, (x0 + hw - 0.3) / 2, ph, (za + zb) / 2)); acc.add('wood', boxB(hw - x0 - 0.5, 0.06, 0.4, (x0 + hw - 0.3) / 2, ph + h, zb - 0.3)); acc.plat({ x: (x0 + hw - 0.3) / 2, z: (za + zb) / 2, w: hw - x0 - 0.3, d: zb - za, top: ph + h }); }
  acc.add('brick', boxB(hw - x0, 1.9, 0.3, (x0 + hw) / 2, ph, -hd + 0.15));
  const yr = ph + s.h;
  canopy(acc, { x: [-hw - 0.2, 2.2], z: [-hd - 0.2, hd + 1.6], y: yr, t: 0.2, r: { fr: 1.2 }, edge: 'coping' });                // mái công-xôn nhô về sân
  for (const z of [-hd + 0.4, 2.0]) acc.add('frame', cylY(0.08, s.h, 2.0, ph, z, 8));
  pergola(acc, { x: [2.2, hw - 0.2], z: [-hd + 0.3, hd - 0.4], y0: ph, h: s.h + 0.1, dir: 'x', post: 3.0, slat: 0.55 });
  // bảng điểm + cột cờ
  for (const x of [hw - 1.6, hw - 0.4]) acc.add('frame', cylY(0.06, 3.0, x, ph, hd - 0.2, 8)); acc.add('score', box(2.0, 1.0, 0.12, hw - 1.0, ph + 3.2, hd - 0.2));
  EXTRA.flag(acc, { x: -hw + 0.6, z: hd - 0.4, y: ph, h: 6.0 }, ctx);
  return done(acc, { W: s.W, D: s.D, PW: s.W, PD: s.D, ph, eave: yr, top: Math.max(ctx.top, yr + 0.2), kind: 'tennis' });
}

/** gaz3 — sân thượng-pergola Cavrois: tường gạch thấp chữ L, cột vuông mảnh, nửa trong mái bê tông, nửa ngoài pergola, ghế xây + giá sách */
export function adReading(s) {
  const acc = new Acc(), ph = s.ph, ctx = makeCtx(ph, []), h = s.W / 2, yt = ph + s.h;
  acc.add('stone', boxB(s.W, ph, s.W, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: s.W, d: s.W, top: ph });
  steps(acc, { cx: 0, cz: h, w: 2.2, h: ph, dir: '+z', cheek: null });
  acc.add('brick', boxB(s.W, 2.2, 0.35, 0, ph, -h + 0.175)); acc.add('brick', boxB(0.35, 2.2, s.W - 0.35, -h + 0.175, ph, 0.175));
  acc.add('coping', boxB(s.W + 0.1, 0.08, 0.45, 0, ph + 2.2, -h + 0.175)); acc.add('coping', boxB(0.45, 0.08, s.W - 0.3, -h + 0.175, ph + 2.2, 0.175));
  for (const [x, z] of [[-h + 0.35, h - 0.35], [0, h - 0.35], [h - 0.35, h - 0.35], [h - 0.35, 0], [h - 0.35, -h + 0.35], [0, 0]]) acc.add('concW', boxB(0.2, s.h - 0.45, 0.2, x, ph, z));
  acc.add('concW', prism(rrect(-h - 0.3, h + 0.3, -h - 0.3, 0.2, {}), yt - 0.3, 0.3));                                             // nửa trong: mái kín
  pergola(acc, { x: [-h + 0.35, h - 0.35], z: [0.2, h - 0.35], y0: ph, h: s.h, dir: 'x', post: 4.3, slat: 0.5, posts: false });   // nửa ngoài: dầm thưa
  acc.add('wood', boxB(s.W - 1.6, 0.08, 0.5, 0.4, ph + 0.45, -h + 0.65)); acc.add('concW', boxB(s.W - 1.6, 0.45, 0.5, 0.4, ph, -h + 0.65)); // ghế băng xây
  for (let i = 0; i < 4; i++) { acc.add('wood', boxB(0.4, 0.04, 3.0, -h + 0.55, ph + 0.5 + 0.42 * i, -0.4)); for (let j = 0; j < 9; j++) acc.add(j % 3 ? 'book' : 'book2', boxB(0.26, 0.32, 0.07 + (j % 2) * 0.03, -h + 0.55, ph + 0.54 + 0.42 * i, -1.7 + 0.3 * j)); }
  acc.add('wood', boxB(0.42, 1.8, 0.04, -h + 0.55, ph, -1.9)); acc.add('wood', boxB(0.42, 1.8, 0.04, -h + 0.55, ph, 1.1));
  tubeRail(acc, [[-h + 0.4, h - 0.12], [-1.2, h - 0.12]], ph, { closed: false, h: 1.0 }); tubeRail(acc, [[1.2, h - 0.12], [h - 0.12, h - 0.12], [h - 0.12, -h + 0.4]], ph, { closed: false, h: 1.0 });
  return done(acc, { W: s.W, D: s.W, PW: s.W, PD: s.W + 1.0, ph, eave: yt, top: yt, kind: 'reading' });
}

/** gaz4 — đầu hồ gương Cavrois: đài bán nguyệt, cột vuông mảnh, tấm mái mỏng bán nguyệt, bậc xuống nước, quả cầu sáng */
export function adMirrorPav(s) {
  const acc = new Acc(), ph = s.ph, R = s.R, zf = s.zf, yt = ph + s.h;
  const half = (r, n = 24) => [...Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI + (Math.PI * i) / n; return [Math.cos(a) * r, zf + Math.sin(a) * r]; })];
  const hring = (r0, r1) => [...half(r0), ...half(r1).reverse()];
  acc.add('stone', prism(half(R + 0.3), 0, ph - 0.18)); acc.add('brick', prism(hring(R + 0.35, R - 0.2), ph - 0.18, 0.18)); acc.add('floor', prism(half(R - 0.2), ph - 0.18, 0.18));
  acc.plat({ x: 0, z: zf - R / 2, w: 2 * R, d: R, top: ph });
  for (let i = 1; i <= 3; i++) { const top = (ph * (4 - i)) / 4, z = zf + 0.35 * (i - 0.5); acc.add('stone', boxB(2 * R + 0.6, top, 0.36, 0, 0, z)); acc.plat({ x: 0, z, w: 2 * R + 0.6, d: 0.36, top }); }
  acc.add('mirror', boxB(2 * R + 2, 0.06, 1.6, 0, 0.02, zf + 1.05 + 0.8)); acc.add('brick', ringPrism(-R - 1.15, R + 1.15, zf + 1.05, zf + 2.85, {}, 0.15, 0, 0.14));
  const pts = half(R - 0.3, 6); for (const [x, z] of pts) acc.add('concW', boxB(0.18, s.h - 0.16, 0.18, x, ph, z));
  acc.add('concW', prism(half(R + 0.4), yt - 0.16, 0.16)); acc.add('coping', prism(hring(R + 0.44, R + 0.2), yt - 0.05, 0.07));
  acc.add('concW', prism([...half(R - 1.0, 16), ...half(R - 1.5, 16).reverse()], ph, 0.45));                                     // ghế băng cong
  acc.add('gold', cylY(0.1, 0.9, 0, ph, zf - 0.4, 10)); acc.add('glow', new THREE.SphereGeometry(0.45, 18, 12).translate(0, ph + 1.35, zf - 0.4));
  return done(acc, { W: 2 * R, D: R, PW: 2 * R + 2.3, PD: R + 3.3, ph, eave: yt, top: yt, kind: 'mirrorPav' });
}

/** gaz5 — 4 «cây lập phương» bê tông anh em Martel (Expo 1925): thân chữ thập sắc cạnh, lá tấm phẳng — 4 biến thể gắn lá */
export function adCubistTrees(s) {
  const acc = new Acc(), h = s.W / 2, H = s.treeH;
  acc.add('pave', boxB(s.W, 0.08, s.W, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: s.W, d: s.W, top: 0.08 });
  const q = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  q.forEach(([sx, sz], vi) => {
    const cx = sx * (h - 1.75), cz = sz * (h - 1.75);
    acc.add('grass', boxB(3.2, 0.12, 3.2, cx, 0.08, cz)); acc.add('hedge', ringPrism(cx - 1.6, cx + 1.6, cz - 1.6, cz + 1.6, {}, 0.3, 0.08, 0.38));
    acc.add('conc', boxB(0.7, H, 0.22, cx, 0.2, cz)); acc.add('conc', boxB(0.22, H, 0.7, cx, 0.2, cz));                          // thân chữ thập
    const leaf = (w, d, y, ry = 0, rx = 0, ox = 0, oz = 0) => { const g = new THREE.BoxGeometry(w, 0.09, d); if (rx) g.rotateX(rx); g.rotateY(ry); g.translate(cx + ox, y, cz + oz); acc.add('conc', g); };
    if (vi === 0) [[2.2, 2.6], [1.8, 3.6], [1.5, 4.6], [1.2, 5.5], [2.6, H + 0.15]].forEach(([w, y], i) => leaf(w, w, y, i % 2 ? Math.PI / 4 : 0));            // tầng ngang xoay so le
    else if (vi === 1) { for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2, y = 2.4 + i * 0.85; const g = new THREE.BoxGeometry(1.5, 1.5, 0.09); g.translate(0.75 + 0.35, 0, 0); g.rotateY(a); g.translate(cx, y + 0.75, cz); acc.add('conc', g); } leaf(2.4, 2.4, H + 0.15); } // lá đứng xoắn
    else if (vi === 2) { [[2.6, 0.5], [3.4, -0.5], [4.2, 0.5], [5.0, -0.5]].forEach(([y, rx], i) => leaf(1.6, 1.4, y, i * 0.4, rx, 0, 0)); leaf(2.2, 2.2, H + 0.15, 0.3); }          // lá nghiêng
    else { for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; leaf(1.1, 1.1, 2.6 + i * 0.95, 0, 0, Math.cos(a) * 0.75, Math.sin(a) * 0.75); } leaf(2.0, 2.0, H - 0.6, Math.PI / 4); leaf(2.6, 2.6, H + 0.15); } // chong chóng
  });
  acc.add('concW', boxB(2.4, 0.45, 0.6, 0, 0.08, 0)); acc.add('concW', boxB(0.6, 0.45, 2.4, 0, 0.08, 0));
  return done(acc, { W: s.W, D: s.W, PW: s.W, PD: s.W, ph: 0.08, eave: H, top: H + 0.3, kind: 'cubist' });
}

/** gaz6 — vườn lập thể Guevrekian (Noailles 1926): tam giác vuông, ô bàn cờ cỏ / gạch xếp bậc, bồn cây hộp, tường hồng thấp, tượng ở đỉnh trục */
export function adTriGarden(s) {
  const acc = new Acc(), h = s.W / 2;
  acc.add('pave', prism([[-h, -h], [h, -h], [-h, h]], 0, 0.12)); acc.plat({ x: -h / 2, z: -h / 2, w: h, d: h, top: 0.12 });
  for (let i = 0; i < s.W; i++) for (let j = 0; j < s.W; j++) {
    const x0 = -h + i, z0 = -h + j, sum = i + j; if (sum > s.W - 1) continue;
    const lvl = sum < 3 ? 3 : sum < 5 ? 2 : sum < 6 ? 1 : 0, top = 0.12 + 0.18 * lvl, k = (i + j) % 2 ? 'grass' : 'pave';
    if (sum === s.W - 1) acc.add(k, prism([[x0 + 0.02, z0 + 0.02], [x0 + 0.98, z0 + 0.02], [x0 + 0.02, z0 + 0.98]], 0.12, top - 0.12 + 0.04));
    else { acc.add(k, boxB(0.98, top - 0.12 + 0.04, 0.98, x0 + 0.5, 0.12, z0 + 0.5)); if (lvl) acc.plat({ x: x0 + 0.5, z: z0 + 0.5, w: 1, d: 1, top: top + 0.04 }); }
  }
  acc.add('renderPink', boxB(s.W, 1.2, 0.25, 0, 0.12, -h + 0.125)); acc.add('renderPink', boxB(0.25, 1.2, s.W - 0.25, -h + 0.125, 0.12, 0.125));
  acc.add('coping', boxB(s.W + 0.05, 0.06, 0.3, 0, 1.32, -h + 0.125)); acc.add('coping', boxB(0.3, 0.06, s.W - 0.2, -h + 0.125, 1.32, 0.125));
  for (const [x, z, sz] of [[-h + 2.3, -h + 0.9, 0.8], [-h + 0.9, -h + 2.3, 0.8], [-h + 4.3, -h + 0.9, 0.6], [-h + 0.9, -h + 4.3, 0.6]]) { acc.add('renderPink', boxB(sz, sz, sz, x, 0.66, z)); acc.add('hedge', boxB(sz - 0.12, 0.5, sz - 0.12, x, 0.66 + sz, z)); }
  acc.add('stone', boxB(0.8, 1.0, 0.8, -h + 0.9, 0.66, -h + 0.9));
  const fig = [[0, 0], [0.35, 0], [0.4, 0.5], [0.15, 0.8], [0.45, 1.2], [0.2, 1.45], [0.25, 1.75], [0.05, 1.9], [-0.15, 1.6], [-0.4, 1.45], [-0.2, 1.1], [-0.35, 0.6]];
  for (const ry of [Math.PI / 4, -Math.PI / 4]) acc.add('bronze', silhouette(fig, 0.28, -h + 0.9, 1.66, -h + 0.9, ry, 0.95));
  return done(acc, { W: s.W, D: s.W, PW: s.W, PD: s.W, ph: 0.12, eave: 1.3, top: 1.66 + 1.9 * 0.95, kind: 'trigarden' });
}
