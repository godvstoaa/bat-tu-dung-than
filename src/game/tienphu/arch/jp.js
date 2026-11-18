// ============================================================================
//  BỘ DỰNG THÀNH QUÁCH NHẬT (Himeji · Nijō · Osaka · Takamatsu · Edo) — theo docs/tienphu-nghiencuu/02-nhatban.md.
//  Loại hình: castleBlock (khối tường trát trắng nhiều tầng + mái hiên vòng + irimoya) → yagura (lầu góc thu tầng),
//  yaguraL (lầu chữ L hai tầng bằng nhau), kesho (lầu hóa trang + hành lang lầu), kura (kho trát), koraimon (cổng ngoài),
//  yaguramon (cổng lầu bắc qua hai khối đá), tenshu (Thiên Thủ — vỏ ngoài lầu 10 tầng theo towerSpec).
//  Mọi hàm trả { acc, info }. Dinh shoin / sukiya ở jp-res.js.
// ============================================================================
import * as THREE from 'three';
import {
  Acc, box, boxB, beam, slabXY, ribAlong, V, JP, ROOFK, FACE, frameM, put, place, panel, profU, rodX, rodZ,
  jpRoof, skirtRoof, shedRoof, roofProfileJ, karaHafu, triHafu, castleWin, hazama, hazamaRow, ishiOtoshi, hakama,
  stoneSeg, stoneBlock, sangi, batter, steps, shachi, oni, gegyo, crest,
} from './jp-kit.js';

/** 4 vách khối chữ nhật (mặt ngoài tại ±hx, ±hz) */
export function wallBox(acc, hx, hz, y0, y1, t = 0.4, key = 'plaster', skip = '') {
  const h = y1 - y0;
  if (!skip.includes('S')) acc.add(key, boxB(2 * hx, h, t, 0, y0, hz - t / 2));
  if (!skip.includes('N')) acc.add(key, boxB(2 * hx, h, t, 0, y0, -hz + t / 2));
  if (!skip.includes('E')) acc.add(key, boxB(t, h, 2 * hz - 2 * t, hx - t / 2, y0, 0));
  if (!skip.includes('W')) acc.add(key, boxB(t, h, 2 * hz - 2 * t, -hx + t / 2, y0, 0));
}
/** vị trí đều dọc mặt (nửa dài L) — n cửa, bỏ những chỗ trong vùng cấm [[u, nửa rộng]] */
export const spread = (L, n, avoid = [], margin = 1.0) => { const out = []; for (let i = 0; i < n; i++) { const u = -L + margin + ((2 * L - 2 * margin) * (i + 0.5)) / n; if (!avoid.some(([c, w]) => Math.abs(u - c) < w)) out.push(u); } return out; };
/** u của góc (sx, sz) trên mặt f (khung mặt: phải khi nhìn từ ngoài) */
export const cornerU = (f, sx, sz, hx, hz) => (f === 'S' ? sx * hx : f === 'N' ? -sx * hx : f === 'E' ? -sz * hz : sz * hz);

/**
 * KHỐI THÀNH (yagura / lầu / kho): tầng [{ hx, hz, h, over, root, slopes }] chồng lên nhau, mái hiên vòng 腰屋根 giữa tầng,
 * mái đỉnh irimoya (top: { over, ends, ridge: 'x'|'z', slopes, ridgeH, ridgeEnd, shachiS, dGk }); win(i, f, t, L) → [u | {u,w,h}]
 */
export function castleBlock(acc, o) {
  const sub = new Acc(), K = o.K || ROOFK.castle, mortar = !!o.mortar, rib = o.rib ?? 0.5;
  const T = []; let y = o.y0 ?? 0;
  for (const t of o.tiers) { T.push({ ...t, y0: y, y1: y + t.h }); y += t.h; }
  const fr = (i, f) => { const t = T[i], [nx, nz] = FACE[f]; return frameM(nx, nz, nx * t.hx, nz * t.hz); };
  const half = (i, f) => (f === 'S' || f === 'N' ? T[i].hx : T[i].hz);
  for (let i = 0; i < T.length - 1; i++) {
    const t = T[i], u = T[i + 1];
    const r = skirtRoof(sub, { hx: t.hx, hz: t.hz, over: t.over, ix: u.hx, iz: u.hz, root: u.y0 + (t.root ?? 0.5), K, rib, mortar, slopes: t.slopes || [[t.over, 0.4], 0.52] });
    t.yE = r.yE; t.skirt = r;
  }
  // vách tầng dưới dừng ngay dưới mặt mái hiên tại đường vách (không lòi dải trắng lên trên mái)
  T.forEach((t, i) => wallBox(sub, t.hx, t.hz, t.y0, i === T.length - 1 ? t.y1 + 0.28 : Math.min(t.y1 + 0.6, t.skirt.Y(0, 0, t.over) - 0.06), o.wallT ?? 0.4, o.wallKey || 'plaster', o.skipWall?.[i] || ''));
  const tt = T[T.length - 1], tp = o.top || {}, rz = tp.ridge === 'z', ov = tp.over ?? 1.2;
  const ex = (rz ? tt.hz : tt.hx) + ov, ez = (rz ? tt.hx : tt.hz) + ov;
  const prof = roofProfileJ(ez, tp.slopes || [[ov, 0.42], 0.62, 0.76, 0.86], Math.max(8, Math.ceil(ez / 0.7)));
  const yE = tt.y1 + 0.35 - prof.P(ov);
  const R = jpRoof(sub, {
    ex, ez, yE, prof, ends: tp.ends || ['irimoya', 'irimoya'], dG: ov + (ez - ov) * (tp.dGk ?? 0.42), K, rib, mortar, ridgeH: tp.ridgeH ?? 0.65,
    ridgeEnd: tp.ridgeEnd || 'oni', shachiS: tp.shachiS, soffit: ov * 0.85, m: rz ? new THREE.Matrix4().makeRotationY(Math.PI / 2) : null, caps: o.caps, lift: tp.lift ?? 0.18, gableWin: tp.gableWin,
  });
  tt.yE = yE; tt.roof = R;
  if (o.win) T.forEach((t, i) => { for (const f of 'SNEW') { const us = o.win(i, f, t, half(i, f)) || [], m = fr(i, f); for (const w of us) { const q = typeof w === 'number' ? { u: w } : w; castleWin(sub, m, q.u, t.y0 + (q.sill ?? o.sill ?? 1.1), q.w ?? o.winW ?? 1.0, q.h ?? o.winH ?? 1.1, { barKey: o.barKey || 'plaster', frameKey: o.frameKey || 'plaster' }); } } });
  if (o.hazama) T.forEach((t, i) => { for (const f of 'SNEW') { const L = half(i, f), us = (o.win?.(i, f, t, L) || []).map((w) => [typeof w === 'number' ? w : w.u, 0.9]); hazamaRow(sub, fr(i, f), -L + 0.3, L - 0.3, t.y0 + (o.hazY ?? 0.75), o.hazStep ?? 1.6, i % 2 ? 'vso' : 'osv', 0.17, (u) => us.some(([c, w]) => Math.abs(u - c) < w) || (o.hazSkip?.(i, f, u) ?? false)); } });
  if (o.deco) o.deco(sub, { T, fr, half, R, K, mortar });
  place(acc, sub, o.cx || 0, o.cz || 0, o.ry || 0);
  return { T, R, top: R.top };
}
const roofYAt = (t, v) => t.skirt.Y(0, 0, Math.max(0, t.over - v)); // cao mặt mái hiên vòng tại khoảng v ra ngoài vách tầng (giữa mặt)

// ---------------------------------------------------------------- LẦU GÓC (隅櫓) thu tầng
/**
 * spec: { base: { h, B, m }, tiers: [...], top: {...}, win: { [tier]: { S: n, … } }, hafu: [{ tier, face, kind: 'kara'|'chidori'|'chidoriBig', w, hk, u }],
 *         bays: [{ tier, face, u, w, kind: 'box'|'gable'|'hakama', corner: [sx, sz] }], crest, mortar }
 */
export function jpYagura(spec) {
  const acc = new Acc(), K = ROOFK.castle, base = spec.base || { h: 0 }, t0 = spec.tiers[0];
  let foot = { hx: t0.hx, hz: t0.hz };
  if (base.h) foot = stoneBlock(acc, { hx: t0.hx + (base.m ?? 0.35), hz: t0.hz + (base.m ?? 0.35), y0: 0, y1: base.h, B: base.B ?? 0.8, cap: 'stoneC', capT: 0.22 }).foot;
  const bayAvoid = (i, f) => (spec.bays || []).filter((b) => b.tier === i && b.face === f && b.kind !== 'hakama').map((b) => [b.u, b.w / 2 + 0.9]);
  const hafAvoid = (i, f) => (spec.hafu || []).filter((h) => h.tier === i && h.face === f && h.kind === 'kara').map((h) => [h.u || 0, 0.01]);
  const blk = castleBlock(acc, {
    y0: base.h, tiers: spec.tiers, top: spec.top, mortar: spec.mortar, caps: true, hazama: true,
    win: (i, f, t, L) => { const n = spec.win?.[i]?.[f] ?? Math.max(1, Math.round(L / 2.2)); return spread(L, n, bayAvoid(i, f).concat(hafAvoid(i, f)), 0.9).map((u) => ({ u, sill: 1.15, w: spec.winW ?? 0.95, h: Math.min(1.15, t.h - 2.0) })); },
    deco: (sub, c) => {
      for (const b of spec.bays || []) {
        const t = c.T[b.tier], m = c.fr(b.tier, b.face);
        if (b.kind === 'hakama') { const [sx, sz] = b.corner, L = c.half(b.tier, b.face), u = Math.sign(cornerU(b.face, sx, sz, t.hx, t.hz)) * (L - b.w / 2); hakama(sub, m, u, t.y0 + 0.15, b.w, b.h ?? 1.6, b.p ?? 0.55); }
        else ishiOtoshi(sub, m, b.u, t.y0 + (b.y ?? 1.0), b.w, b.h ?? 1.5, b.p ?? 0.75, { roof: b.kind === 'gable' ? 'gable' : b.roof === null ? null : 'shed', K, mortar: spec.mortar });
      }
      for (const h of spec.hafu || []) {
        const t = c.T[h.tier], m = c.fr(h.tier, h.face), nxt = c.T[h.tier + 1];
        if (h.kind === 'kara') { karaHafu(sub, m, { u: h.u || 0, f: t.over - 0.05, yE: t.yE - 0.02, w: h.w, hk: h.hk ?? h.w * 0.2, L: 2 * (h.hk ?? h.w * 0.2) + 1.8, K, mortar: spec.mortar, ornament: !spec.crest }); if (spec.crest) crest(sub, m, h.u || 0, t.yE + (h.hk ?? h.w * 0.2) - 0.45, t.over + 0.3, 0.28, 0); }
        else {
          const big = h.kind === 'chidoriBig', f = big ? t.over * 0.45 : t.over * 0.5, yb = roofYAt(t, f) + 0.12, top2 = big ? c.T[h.tier + 1].yE + 1.4 : null;
          const hh = big ? top2 - yb : h.h ?? h.w * 0.46, hw = h.w / 2, back = big ? c.half(h.tier, h.face) - c.half(h.tier + 2 < c.T.length ? h.tier + 2 : h.tier + 1, h.face) + 0.4 : c.half(h.tier, h.face) - (nxt ? c.half(h.tier + 1, h.face) : 0) + 0.6;
          triHafu(sub, m, { u: h.u || 0, f, yb, hw, h: hh, L: f + back, K, mortar: spec.mortar, win: (a, mm, u, y, H, ff) => { hazama(a, mm, u, y + H * 0.35, 'o', 0.18); if (H > 2.4) { hazama(a, mm, u - hw * 0.35, y + H * 0.18, 'v', 0.16); hazama(a, mm, u + hw * 0.35, y + H * 0.18, 'v', 0.16); } } });
        }
      }
    },
  });
  const t1 = blk.T[blk.T.length - 1];
  const PW = 2 * foot.hx, PD = 2 * foot.hz;
  return { acc, info: { W: 2 * t0.hx, D: 2 * t0.hz, PW: Math.max(PW, 2 * (t0.hx + t0.over)), PD: Math.max(PD, 2 * (t0.hz + t0.over)), ph: base.h, top: blk.top, eave: blk.T[0].yE, eave2: t1.yE, storeys: blk.T.length, kind: 'yagura' } };
}

// ---------------------------------------------------------------- LẦU CHỮ L hai tầng bằng nhau (乾櫓 Osaka, 総二階)
export function jpYaguraL(spec) {
  const acc = new Acc(), K = ROOFK.castle, a = spec.arm, d = spec.depth, bh = spec.base?.h ?? 0, H = spec.h;
  // cánh A dọc x (phía Bắc, z < 0), cánh B dọc z (phía Tây, x < 0); góc chung ở Tây Bắc
  const A = { cx: 0, cz: -(a - d) / 2, hx: a / 2, hz: d / 2 }, B = { cx: -(a - d) / 2, cz: 0, hx: d / 2, hz: a / 2 };
  if (bh) for (const w of [A, B]) stoneBlock(acc, { cx: w.cx, cz: w.cz, hx: w.hx + 0.35, hz: w.hz + 0.35, y0: 0, y1: bh, B: spec.base.B ?? 0.8, cap: 'stoneC', capT: 0.22, sangiOn: w === A });
  const tiers = (w) => [{ hx: w.hx, hz: w.hz, h: H[0], over: 1.0, root: 0.45, slopes: [[1.0, 0.42], 0.5] }, { hx: w.hx, hz: w.hz, h: H[1] }];
  const top = (ends) => ({ over: 1.25, ends, ridgeH: 0.65, ridgeEnd: 'oni', dGk: 0.4 });
  const winA = (i, f, t, L) => (f === 'S' ? spread(L, 2, [[a / 2 - d / 2, d / 2 + 0.2]]) : f === 'N' ? spread(L, i ? 5 : 4, [[0, 1.8]]) : f === 'E' ? spread(L, 2) : []);
  const winB = (i, f, t, L) => (f === 'W' ? spread(L, i ? 5 : 4, [[0, 1.8]]) : f === 'E' ? spread(L, 2, [[-(a / 2 - d / 2), d / 2 + 0.2]]) : f === 'S' ? spread(L, 2) : []);
  const bay = (face) => (sub, c) => { ishiOtoshi(sub, c.fr(0, face), 0, c.T[0].y0 + 0.9, 2.6, 1.7, 0.9, { roof: 'gable', K }); };
  // cánh A: nóc theo x, đầu −x (góc) chái, đầu +x irimoya
  castleBlock(acc, { ...A, y0: bh, tiers: tiers(A), top: top(['hip', 'irimoya']), win: winA, hazama: true, caps: true, deco: bay('N'), skipWall: ['', ''] });
  // cánh B: nóc theo z (quay π/2: x cục bộ → −z), đầu −x cục bộ (= +z, Nam) irimoya, đầu +x cục bộ (= −z, góc Bắc) chái
  castleBlock(acc, { ...B, y0: bh, tiers: tiers(B), top: { ...top(['irimoya', 'hip']), ridge: 'z' }, win: winB, hazama: true, caps: true, deco: bay('W') });
  const ext = a / 2 + 0.35 + (spec.base?.B ?? 0.8);
  return { acc, info: { W: a, D: a, PW: 2 * ext, PD: 2 * ext, ph: bh, top: bh + H[0] + H[1] + 4.5, storeys: 2, kind: 'yaguraL' } };
}

// ---------------------------------------------------------------- HÓA TRANG LÂU + hành lang lầu (百間廊下)
export function jpKesho(spec) {
  const acc = new Acc(), K = ROOFK.castle, ph = spec.ph, L = spec.corrL, w1 = spec.w1, w2 = spec.w2, hz = spec.d / 2, hc = spec.corrD / 2;
  const total = L + w1 + w2, x0 = -total / 2;
  const xc = x0 + L / 2, x1 = x0 + L + w1 / 2, x2 = x0 + L + w1 + w2 / 2;
  stoneBlock(acc, { cx: 0, cz: 0, hx: total / 2 + 0.35, hz: hz + 0.35, y0: 0, y1: ph, B: 0.35, cap: 'stoneC', capT: 0.2, plat: true });
  const wide = (n, L2, avoid) => spread(L2, n, avoid).map((u) => ({ u, w: 1.5, h: 1.25, sill: 1.0 }));
  // hành lang lầu: cửa vào giữa mặt trước (x = 0), cửa sổ nhỏ + lỗ bắn
  castleBlock(acc, {
    cx: xc, y0: ph, tiers: [{ hx: L / 2, hz: hc, h: 3.0 }], top: { over: 0.95, ends: ['irimoya', 'open'], ridgeH: 0.5, slopes: [[0.95, 0.42], 0.6, 0.72] },
    hazama: true, win: (i, f, t, LL) => (f === 'S' ? spread(LL, 6, [[-xc, 2.2]]) : f === 'N' ? spread(LL, 7) : f === 'W' ? [0] : []).map((u) => ({ u, w: 0.8, h: 0.9, sill: 1.2 })),
    hazSkip: (i, f, u) => f === 'S' && Math.abs(u + xc) < 2.2, caps: true,
    deco: (sub, c) => { // cửa vào: khung gỗ đen, 2 cánh mở, mái hiên nhỏ 庇
      const m = c.fr(0, 'S'), u = -xc;
      put(sub, m, 'void', box(2.6, 2.7, 0.06, u, ph + 1.35, 0.03));
      for (const s of [-1, 1]) { put(sub, m, 'black', box(0.3, 2.9, 0.3, u + s * 1.45, ph + 1.45, 0.12)); put(sub, m, 'iron', box(1.3, 2.6, 0.12, u + s * 1.95, ph + 1.32, 0.45, s * 0.0)); }
      put(sub, m, 'black', box(3.4, 0.35, 0.34, u, ph + 3.0, 0.14));
      shedRoof(sub, m, { u0: u - 2.0, u1: u + 2.0, p: 1.3, yW: ph + 3.95, yE: ph + 3.35, K });
    },
  });
  // phần 1 tầng (Tây)
  castleBlock(acc, {
    cx: x1, y0: ph, tiers: [{ hx: w1 / 2, hz, h: 3.4 }], top: { over: 1.1, ends: ['irimoya', 'open'], ridgeH: 0.6, slopes: [[1.1, 0.42], 0.62, 0.78] },
    win: (i, f, t, LL) => (f === 'S' ? wide(3, LL) : f === 'N' ? wide(3, LL) : []), hazama: false, caps: true,
  });
  // phần 2 tầng (Đông): tầng trên thu 0,5 m, mái hiên vòng + irimoya
  castleBlock(acc, {
    cx: x2, y0: ph, tiers: [{ hx: w2 / 2, hz, h: 3.4, over: 1.1, root: 0.45 }, { hx: w2 / 2 - 0.5, hz: hz - 0.45, h: 2.9 }],
    top: { over: 1.1, ends: ['irimoya', 'irimoya'], ridgeH: 0.6, ridgeEnd: 'shachi', shachiS: 0.7, slopes: [[1.1, 0.42], 0.62, 0.78] },
    win: (i, f, t, LL) => (f === 'S' || f === 'N' ? wide(2, LL) : f === 'E' ? wide(i ? 1 : 2, LL) : []), hazama: false, caps: true,
  });
  steps(acc, { x: 0, zTop: hz + 0.35, w: 3.0, h: ph });
  return { acc, info: { W: total, D: spec.d, PW: total + 0.7 + 0.7, PD: spec.d + 0.7 + Math.round(ph / 0.17) * 0.32 + 0.35, ph, top: ph + 3.4 + 2.9 + 3.2, storeys: 2, kind: 'kesho' } };
}

// ---------------------------------------------------------------- KHO TRÁT 土蔵 (米蔵 Nijō)
export function jpKura(spec) {
  const acc = new Acc(), K = ROOFK.castle, hx = spec.W / 2, hz = spec.D / 2, ph = spec.ph, H = spec.h;
  stoneBlock(acc, { hx: hx + 0.25, hz: hz + 0.25, y0: 0, y1: ph, B: 0.08, cap: 'stoneC', capT: 0.12, sangiOn: false, plat: true });
  const winU = [-hx * 0.55, hx * 0.55];
  castleBlock(acc, {
    y0: ph, tiers: [{ hx, hz, h: H }], wallT: 0.6, top: { over: 1.0, ends: ['irimoya', 'irimoya'], ridgeH: 0.7, slopes: [[1.0, 0.45], 0.75, 0.95], dGk: 0.45 },
    deco: (sub, c) => {
      for (const f of ['S', 'N']) {
        const m = c.fr(0, f);
        put(sub, m, 'plaster', box(2 * hx + 0.2, 1.3, 0.14, 0, ph + 0.65, 0.07)); put(sub, m, 'plaster2', box(2 * hx + 0.3, 0.14, 0.26, 0, ph + 1.3, 0.12)); // 腰巻 + 水切り
        for (const u of winU) { // cửa sổ nhỏ + hai cánh trát dày 土扉 mở
          put(sub, m, 'plaster', box(1.5, 1.5, 0.36, u, ph + 2.6, 0.18)); put(sub, m, 'void', box(0.9, 0.9, 0.05, u, ph + 2.6, 0.37));
          for (let i = 0; i < 4; i++) put(sub, m, 'iron', box(0.06, 0.9, 0.06, u - 0.34 + i * 0.23, ph + 2.6, 0.4));
          for (const s of [-1, 1]) put(sub, m, 'plaster2', box(0.62, 1.32, 0.22, u + s * 1.08, ph + 2.6, 0.18));
          shedRoof(sub, m, { u0: u - 1.0, u1: u + 1.0, p: 0.75, yW: ph + 3.9, yE: ph + 3.5, K });
        }
      }
      // cửa ra vào giữa mặt trước: khung bậc 段々 (3 vòng nổi), cánh trát dày mở ra, cửa trong 引戸 tối
      const m = c.fr(0, 'S'), dw = spec.doorW, dh = 2.8;
      put(sub, m, 'void', box(dw, dh, 0.06, 0, ph + dh / 2, 0.02));
      for (let k = 0; k < 3; k++) { const e = 0.35 + k * 0.22, t = 0.12 + k * 0.12; put(sub, m, k % 2 ? 'plaster2' : 'plaster', box(dw + 2 * e, 0.3, t, 0, ph + dh + e - 0.15, t / 2)); for (const s of [-1, 1]) put(sub, m, k % 2 ? 'plaster2' : 'plaster', box(0.3, dh + e, t, s * (dw / 2 + e - 0.15), ph + (dh + e) / 2, t / 2)); }
      for (const s of [-1, 1]) put(sub, m, 'plaster2', box(0.34, dh, dw / 2, s * (dw / 2 + 0.95), ph + dh / 2, dw / 4 + 0.36));
      shedRoof(sub, m, { u0: -dw / 2 - 1.2, u1: dw / 2 + 1.2, p: 1.6, yW: ph + dh + 1.6, yE: ph + dh + 1.0, K });
      for (const s of [-1, 1]) put(sub, m, 'black', beam(V(s * (dw / 2 + 0.9), ph + dh + 0.3, 0.1), V(s * (dw / 2 + 0.9), ph + dh + 1.0, 1.5), 0.16, 0.2)); // tay đỡ
      // hai cửa sổ thông gió đầu hồi
    },
  });
  steps(acc, { x: 0, zTop: hz + 0.25, w: spec.doorW + 0.6, h: ph, key: 'stoneC' });
  return { acc, info: { W: spec.W, D: spec.D, PW: spec.W + 0.5 + 2.0, PD: spec.D + 0.5 + 2.0, ph, top: ph + H + 4.0, kind: 'kura' } };
}

// ---------------------------------------------------------------- CỔNG NGOÀI KŌRAIMON 高麗門 (外桜田門)
export function jpKoraimon(spec) {
  const acc = new Acc(), K = { ...ROOFK.castle, edge: 'woodDk', barge: 'woodDk', gegyo: 'woodDk' }, gw = spec.open, xp = gw / 2 + 0.3, zr = -spec.back, H = spec.postH;
  for (const s of [-1, 1]) {
    acc.add('stoneC', boxB(1.1, 0.35, 1.3, s * xp, 0, 0)); acc.add('stoneC', boxB(0.7, 0.3, 0.7, s * xp, 0, zr));
    acc.add('black', boxB(0.62, H, 0.86, s * xp, 0.3, 0));                                             // 鏡柱 (bọc sắt đen)
    for (let i = 1; i < 5; i++) acc.add('iron', boxB(0.66, 0.12, 0.9, s * xp, 0.3 + (H * i) / 5, 0));
    acc.add('black', boxB(0.36, H * 0.66, 0.36, s * xp, 0.3, zr));                                     // 控柱
    for (const y of [1.6, 3.3]) acc.add('black', boxB(0.18, 0.3, -zr, s * xp, y, zr / 2));             // 貫
    // cánh cổng mở vào trong (bản lề ở trụ chính) — nằm dưới mái phụ
    acc.add('iron', boxB(0.16, spec.leafH, gw / 2 - 0.05, s * (xp - 0.45), 0.12, -(gw / 4) - 0.2));
  }
  acc.add('black', boxB(2 * xp + 1.4, 0.75, 0.62, 0, 0.3 + H - 2.0, 0));                               // 冠木 (cắm ngang trụ chính)
  acc.add('plaster', boxB(2 * xp - 0.62, 1.15, 0.3, 0, 0.3 + H - 1.25, 0));                            // ô tường nhỏ trên dầm (kiểu mới, sau Genna)
  acc.add('black', boxB(2 * xp - 0.62, 0.14, 0.34, 0, 0.3 + H - 0.62, 0));
  acc.add('black', boxB(2 * xp + 1.6, 0.3, 0.5, 0, 0.3 + H + 0.07, 0));                                // 桁
  acc.add('black', boxB(2 * xp - 0.6, 0.16, 0.2, 0, 0.12, 0));                                         // 蹴放 ngưỡng
  // mái chính kirizuma hẹp trên trụ chính (nóc theo x)
  const ov = 1.35, ez = 0.43 + ov, prof = roofProfileJ(ez, [[ov, 0.45], 0.62], 8), yE = 0.3 + H + 0.4 - prof.P(ov);
  const R = jpRoof(acc, { ex: xp + 1.35, ez, yE, prof, ends: ['gable', 'gable'], K, rib: 0.42, ridgeH: 0.55, ridgeEnd: 'oni', verge: 0.4, gableFace: false, soffit: ov, caps: true, gegyoS: 0.55, lift: 0.08 });
  // hai mái phụ (nóc theo z) trên khoảng trụ chính → trụ chống: hình chữ «コ» nhìn từ trên
  for (const s of [-1, 1]) {
    const ov2 = 0.55, ez2 = 0.35 + ov2, p2 = roofProfileJ(ez2, [[ov2, 0.45], 0.6], 6), y2 = 0.3 + H * 0.66 + 0.45 - p2.P(ov2);
    jpRoof(acc, { ex: (-zr) / 2 + 0.55, ez: ez2, yE: y2, prof: p2, ends: ['open', 'gable'], K, rib: 0.4, ridgeH: 0.4, verge: 0.3, gableFace: false, soffit: ov2, lift: 0, m: new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(s * xp, 0, zr / 2 - 0.3) });
    acc.add('black', boxB(0.3, 0.3, -zr + 0.4, s * xp, 0.3 + H * 0.66 - 0.05, zr / 2));
  }
  // tường đất trát trắng ôm hai bên (土塀): chân đá, thân trát, lỗ bắn, mái ngói trên đỉnh
  for (const s of [-1, 1]) {
    const L = spec.wing, cx = s * (xp + 0.4 + L / 2), sub = new Acc(), wh = 3.2;
    sub.add('stoneC', boxB(L, 0.5, 1.4, 0, 0, 0)); sub.add('plaster', boxB(L, wh - 0.5, 0.9, 0, 0.5, 0));
    const m = frameM(0, 1, 0, 0.45); hazamaRow(sub, m, -L / 2, L / 2, 1.6, 1.4, 'vos', 0.17);
    const pp = roofProfileJ(1.05, [[0.6, 0.42], 0.55], 4); jpRoof(sub, { ex: L / 2 + 0.05, ez: 1.05, yE: wh + 0.35 - pp.P(0.6), prof: pp, ends: ['open', 'open'], K, rib: 0.4, ridgeH: 0.35, ridgeW: 0.4, lift: 0, thick: 0.18 });
    place(acc, sub, cx, 0, 0);
  }
  return { acc, info: { W: 2 * xp + 0.62, D: -zr + 0.86, PW: 2 * (xp + 0.4 + spec.wing), PD: -zr + 2 * ov + 0.5, ph: 0, top: R.top, gate: gw, kind: 'koraimon' } };
}

// ---------------------------------------------------------------- CỔNG LẦU YAGURAMON 櫓門 (菱の門 Himeji): lầu bắc qua hai khối đá
export function jpYaguramon(spec) {
  const acc = new Acc(), K = ROOFK.castle, hx = spec.W / 2, hz = spec.D / 2, gap = spec.gap, hb = spec.stoneH, wb = hx - gap / 2;
  for (const s of [-1, 1]) stoneBlock(acc, { cx: s * (gap / 2 + wb / 2), hx: wb / 2, hz, y0: 0, y1: hb, B: s < 0 ? { S: 0.8, N: 0.8, W: 0.8, E: 0.12 } : { S: 0.8, N: 0.8, E: 0.8, W: 0.12 }, cap: 'stoneC', capT: 0.2 });
  // tầng cổng: trụ, dầm, hoa lăng 花菱, cánh cổng mở vào
  for (const s of [-1, 1]) for (const z of [hz - 0.8, -hz + 0.8]) { acc.add('frame', boxB(0.55, hb, 0.8, s * (gap / 2 - 0.3), 0, z)); }
  for (const z of [hz - 0.8, -hz + 0.8]) { acc.add('frame', boxB(gap + 0.4, 0.65, 0.7, 0, hb - 0.65, z)); }
  for (let i = -2; i <= 2; i++) { const hb2 = slabXY([[0, -0.32], [0.32, 0], [0, 0.32], [-0.32, 0]], 0.12, i * 1.1, hb - 0.32, hz - 0.4); acc.add(i % 2 ? 'frame' : 'gold', hb2); } // 花菱
  for (const s of [-1, 1]) acc.add('iron', boxB(0.18, hb - 0.85, gap / 2 - 0.2, s * (gap / 2 - 0.7), 0.1, hz - 0.9 - (gap / 4)));
  acc.add('void', boxB(gap - 0.6, hb - 0.7, 0.05, 0, 0, -hz + 0.5));
  // lầu trên: vách lộ cột 真壁 (cột gỗ + ô trát) từ hb tới hb + Hu
  const Hu = spec.upperH, y0 = hb, sub = new Acc();
  wallBox(sub, hx, hz, y0, y0 + Hu + 0.3, 0.32, 'plaster');
  for (const f of 'SNEW') {
    const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? hx : hz, m = frameM(nx, nz, nx * hx, nz * hz), n = Math.round((2 * L) / 1.97);
    for (let i = 0; i <= n; i++) put(sub, m, 'frame', box(0.26, Hu, 0.1, -L + (2 * L * i) / n, y0 + Hu / 2, 0.05));
    for (const y of [y0 + 0.15, y0 + 2.75, y0 + Hu - 0.3]) put(sub, m, 'frame', box(2 * L, 0.24, 0.12, 0, y, 0.06)); // 長押 / 貫
  }
  // mặt Nam & Bắc: hộp cửa sổ lồi 出格子 chứa 3 cửa song sơn mài đen (phụ kiện vàng) + 2 cửa sổ hình chuông 火灯窓
  for (const f of ['S', 'N']) {
    const [nx, nz] = FACE[f], m = frameM(nx, nz, 0, nz * hz), bw = 8.6, p = 0.75;
    put(sub, m, 'plaster', box(bw, 2.1, p, 0, y0 + 1.75, p / 2)); put(sub, m, 'frame', box(bw + 0.2, 0.2, p + 0.1, 0, y0 + 0.65, p / 2));
    for (const u of [-2.7, 0, 2.7]) { castleWin(sub, new THREE.Matrix4().multiplyMatrices(m, new THREE.Matrix4().makeTranslation(0, 0, p)), u, y0 + 1.05, 2.0, 1.25, { barKey: 'black', frameKey: 'black', sill: false }); put(sub, m, 'gold', box(2.1, 0.08, 0.06, u, y0 + 2.36, p + 0.2)); put(sub, m, 'gold', box(2.1, 0.08, 0.06, u, y0 + 1.02, p + 0.2)); }
    shedRoof(sub, m, { u0: -bw / 2 - 0.4, u1: bw / 2 + 0.4, p: p + 0.7, yW: y0 + 3.45, yE: y0 + 2.9, K });
    for (const s of [-1, 1]) { // 火灯窓: khung đen hình chuông
      const u = s * 6.6, out = [], inn = [];
      for (let i = 0; i <= 12; i++) { const t = i / 12, a = Math.PI * t; out.push([u + Math.cos(a) * 0.95, y0 + 2.0 + Math.sin(a) * 0.75 + (Math.abs(Math.cos(a)) < 0.25 ? 0.25 * (1 - Math.abs(Math.cos(a)) / 0.25) : 0)]); }
      const shape = [[u + 0.95, y0 + 0.9], ...out, [u - 0.95, y0 + 0.9]]; put(sub, m, 'black', panel(shape, 0.12, 0.08));
      const inner = shape.map(([x, y]) => [u + (x - u) * 0.8, y0 + 0.9 + (y - y0 - 0.9) * 0.88 + 0.1]); put(sub, m, 'void', panel(inner, 0.04, 0.16));
      for (let i = -2; i <= 2; i++) put(sub, m, 'black', box(0.06, 1.3, 0.06, u + i * 0.28, y0 + 1.75, 0.2));
    }
  }
  // mái hiên ngăn giữa tầng cổng và tầng lầu (mặt Nam, Bắc)
  for (const f of ['S', 'N']) { const [nx, nz] = FACE[f], m = frameM(nx, nz, 0, nz * hz); shedRoof(sub, m, { u0: -hx, u1: hx, p: 1.25, yW: y0 + 0.62, yE: y0 + 0.02, K, rib: 0.45 }); }
  // mái irimoya trên cùng
  const ov = 1.35, ez = hz + ov, prof = roofProfileJ(ez, [[ov, 0.42], 0.6, 0.72, 0.8], 10), yE = y0 + Hu + 0.4 - prof.P(ov);
  const R = jpRoof(sub, { ex: hx + ov, ez, yE, prof, ends: ['irimoya', 'irimoya'], dG: ov + hz * 0.42, K, rib: 0.48, ridgeH: 0.7, ridgeEnd: 'shachi', shachiS: 0.85, soffit: ov, caps: true, lift: 0.15 });
  place(acc, sub);
  return { acc, info: { W: spec.W, D: spec.D, PW: spec.W + 1.6, PD: spec.D + 2 * ov, ph: 0, top: R.top, gate: gap, storeys: 2, kind: 'yaguramon' } };
}

// ---------------------------------------------------------------- THIÊN THỦ CÁC (vỏ ngoài lầu 10 tầng theo towerSpec)
/**
 * Đại thiên thủ Himeji (vọng lâu hình, 5 重): 3 tầng chơi đầu nằm trong bệ đá ishigaki nghiêng cong (02 › tower §8),
 * thân trát trắng 7 tầng + Vọng Đài; mái 1 重 trên G4 · 2 重 trên G5 (irimoya-hafu lớn Đ/T, kara-hafu Nam) · 3 重 trên G6–G7
 * (irimoya đôi N/B) · 4 重 trên G8–G9 (chidori N/B, kara Đ/T) · 5 重 trên Vọng Đài (kara N/B, đầu hồi Đ/T, shachi).
 */
export function jpTenshu(ts, o = {}) {
  const acc = new Acc(), K = ROOFK.castle, FH = ts.FH, F = ts.floors, P = ts.podium, mortar = true, T = 0.3;
  // ---- thềm (天守台 đế): khối đá thấp + bậc trước (khớp towerCollision) + tường thấp trát có mái ngói quanh mép
  stoneBlock(acc, { hx: P.a, hz: P.a, y0: 0, y1: P.y, B: 0.3, cap: 'stoneC', capT: 0.3, plat: true });
  for (let i = 1; i <= P.steps; i++) { const top = i * P.rise, z = P.a + P.run - (i - 0.5) * P.tread; acc.add('stone', boxB(P.stairW, top, P.tread + 0.02, 0, 0, z)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top }); }
  const sw = P.stairW / 2;
  for (const s of [-1, 1]) acc.add('stoneC', slabXY([[P.a, 0], [P.a + P.run + 0.3, 0], [P.a + P.run + 0.3, 0.5], [P.a, P.y + 0.9]], 0.8, s * (sw + 0.4), 0, 0, -Math.PI / 2));
  { const pa = P.a - 0.3, segs = [[[-sw - 0.2, pa], [-pa, pa]], [[-pa, pa], [-pa, -pa]], [[-pa, -pa], [pa, -pa]], [[pa, -pa], [pa, pa]], [[pa, pa], [sw + 0.2, pa]]];
    for (const [[ax, az], [bx, bz]] of segs) { const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2, sub = new Acc(); sub.add('plaster', boxB(L, 1.1, 0.5, 0, P.y, 0)); sub.add('ridgeJp', boxB(L + 0.3, 0.12, 0.8, 0, P.y + 1.1, 0)); sub.add('ridgeJp', rodX(L + 0.3, 0.12, 0, P.y + 1.3, 0, 6)); hazamaRow(sub, frameM(0, 1, 0, 0.25), -L / 2, L / 2, P.y + 0.65, 2.2, 'osv', 0.13); place(acc, sub, (ax + bx) / 2, (az + bz) / 2, ry); } }
  // ---- bệ đá ishigaki (y = P.y → mặt G4): mặt nghiêng cong 扇の勾配, mặt trong bám vách 3 tầng chơi trong đá
  const yS = P.y, yT = F[3].y, Rt = F[3].a + 0.8, B = o.batter ?? 4.5, outer = (y) => Rt + batter(B, (y - yS) / (yT - yS));
  const hwD = 1.6, hD = 3.5;
  for (let k = 0; k < 3; k++) {
    const y0 = F[k].y, y1 = F[k + 1].y, vin = F[k].a - T;
    for (const [ax, s] of [['z', -1], ['x', 1], ['x', -1]]) stoneSeg(acc, 'stone', { ax, s, R: outer, Ra: outer, vin, uin: vin, y0: k ? y0 : yS, y1 });
    if (k) stoneSeg(acc, 'stone', { ax: 'z', s: 1, R: outer, Ra: outer, vin, uin: vin, y0, y1 });
    else { // mặt Nam tầng G1: chừa cổng vào hầm (rộng 3,2 m, cao 3,5 m)
      stoneSeg(acc, 'stone', { ax: 'z', s: 1, R: outer, Ra: outer, vin, uin: vin, y0: yS, y1, uR: -hwD });
      stoneSeg(acc, 'stone', { ax: 'z', s: 1, R: outer, Ra: outer, vin, uin: vin, y0: yS, y1, uL: hwD });
      stoneSeg(acc, 'stone', { ax: 'z', s: 1, R: outer, Ra: outer, vin, uin: vin, y0: yS + hD, y1, uL: -hwD, uR: hwD });
    }
  }
  sangi(acc, { Rx: outer, Rz: outer, y0: yS, y1: yT, hb: 0.75 });
  // cổng hầm: khung gỗ đen + đá đầu cổng + cánh sắt mở
  const zg = F[0].a + T;
  for (const s of [-1, 1]) { acc.add('black', boxB(0.4, hD, 0.4, s * (hwD - 0.2), yS, zg + 0.2)); acc.add('iron', boxB(0.14, hD - 0.3, hwD - 0.3, s * (hwD - 0.25), yS, zg + 0.5 + (hwD - 0.3) / 2)); }
  acc.add('black', boxB(2 * hwD + 0.4, 0.45, 0.45, 0, yS + hD - 0.2, zg + 0.2)); acc.add('stoneC', boxB(2 * hwD + 1.6, 0.8, outer(yS + hD) - zg + 0.2, 0, yS + hD, (outer(yS + hD) + zg) / 2));
  // ---- sàn trong (mỏng; game dựng sàn thật) để mặt cắt đọc được
  for (let k = 1; k < F.length; k++) acc.add('floorIn', boxB(2 * F[k].a - 0.6, 0.4, 2 * F[k].a - 0.6, 0, F[k].y - 0.4, 0));
  acc.add('floorIn', boxB(2 * ts.deck.a - 0.2, 0.4, 2 * ts.deck.a - 0.2, 0, ts.deck.y - 0.4, 0));
  // ---- thân trát trắng G4 … G10 (vách tại apothem a, dày 0,6 như va chạm)
  // ---- mái hiên vòng 1 重 … 4 重
  const RF = [[3, 4, 2.0], [4, 5, 2.0], [6, 7, 2.0], [8, 9, 1.9]], RR = {};
  RF.forEach(([k, u, ov], i) => {
    const h = F[k].a + T, iu = F[u].a + T, root = F[u].y + 0.6;
    RR[i + 1] = { ...skirtRoof(acc, { hx: h, hz: h, over: ov, ix: iu, iz: iu, root, K, rib: 0.6, ribW: 0.22, mortar, slopes: [[ov, 0.42], 0.52], lift: 0.18 }), h, ov, k };
  });
  for (let k = 3; k < F.length; k++) { const hx = F[k].a + T, r = Object.values(RR).find((q) => q.k === k), top = r ? r.Y(0, 0, r.ov) - 0.06 : (k + 1 < F.length ? F[k + 1].y : ts.deck.y) + 0.05; wallBox(acc, hx, hx, F[k].y, top, 0.6, 'plaster'); }
  // ---- Vọng Đài 望楼: sàn mở có lan can 高欄 (khớp va chạm vòng a + 0.05), cột đỡ mái 5 重
  const D = ts.deck, ad = D.a, yd = D.y, ph5 = o.deckH ?? 3.9;
  for (const f of 'SNEW') {
    const [nx, nz] = FACE[f], m = frameM(nx, nz, nx * (ad + 0.05), nz * (ad + 0.05)), L = ad + 0.05, n = Math.round((2 * L) / 3.4);
    put(acc, m, 'frame', box(2 * L + 1.2, 0.4, 0.6, 0, yd - 0.2, 0.3));                                            // 縁葛 mép sàn
    for (let i = 0; i <= n; i++) put(acc, m, 'woodDk', box(0.42, ph5, 0.42, -L + (2 * L * i) / n, yd + ph5 / 2, 0));     // cột
    put(acc, m, 'woodDk', box(2 * L + 0.4, 0.5, 0.45, 0, yd + ph5 - 0.25, 0)); put(acc, m, 'plaster', box(2 * L, 0.6, 0.2, 0, yd + ph5 + 0.25, -0.1));
    put(acc, m, 'black', box(2 * L + 0.3, 0.12, 0.18, 0, yd + 1.0, 0.12)); put(acc, m, 'black', box(2 * L + 0.3, 0.1, 0.14, 0, yd + 0.5, 0.12)); // 高欄 tay vịn
    for (let u = -L + 0.6; u < L; u += 0.9) put(acc, m, 'black', box(0.08, 1.0, 0.08, u, yd + 0.5, 0.12));
  }
  // ---- mái 5 重 irimoya (nóc Đông–Tây) + shachi
  const ov5 = 1.9, h5 = ad + T, ez5 = h5 + ov5, pr5 = roofProfileJ(ez5, [[ov5, 0.42], 0.62, 0.76, 0.86], Math.ceil(ez5 / 0.9)), yE5 = yd + ph5 + 0.55 - pr5.P(ov5);
  const R5 = jpRoof(acc, { ex: ez5, ez: ez5, yE: yE5, prof: pr5, ends: ['irimoya', 'irimoya'], dG: ov5 + h5 * 0.42, K, rib: 0.6, ribW: 0.22, mortar, ridgeH: 1.0, ridgeEnd: 'shachi', shachiS: 1.8, shachiKey: 'ridgeJp', soffit: ov5 * 0.9, lift: 0.2,
    gableWin: (sub, x, sx, yF, yA) => { const m = frameM(sx, 0, x + sx * 0.05, 0); hazama(sub, m, 0, yF + (yA - yF) * 0.35, 'o', 0.25); hazama(sub, m, -1.6, yF + 0.5, 'v', 0.2); hazama(sub, m, 1.6, yF + 0.5, 'v', 0.2); } });
  // ---- khung mặt từng tầng, cửa sổ, lỗ bắn
  const fr = (k, f, ex = 0) => { const [nx, nz] = FACE[f], h = (k >= F.length ? ad : F[k].a) + T + ex; return frameM(nx, nz, nx * h, nz * h); };
  const hafu = { 3: { E: 'kara' }, 4: { S: 'kara', E: 'big', W: 'big' }, 6: { S: 'dbl', N: 'dbl' }, 8: { S: 'chid', N: 'chid', E: 'kara', W: 'kara' } };
  const bay = { 3: { E: 8.0 }, 4: { S: 9.4 } };
  for (let k = 3; k < F.length; k++) {
    const hx = F[k].a + T;
    const y0 = F[k].y, sill = k === 3 ? 1.2 : 1.35, wh = k === 9 ? 1.45 : 1.25;
    for (const f of 'SNEW') {
      const m = fr(k, f), bw = bay[k]?.[f];
      const avoid = bw ? [[0, bw / 2 + 1.0]] : [];
      const n = Math.max(3, Math.round((2 * hx) / (k === 9 ? 3.4 : 4.6)));
      for (const u of spread(hx, n, avoid, 1.6)) castleWin(acc, m, u, y0 + sill, k === 9 ? 1.2 : 1.05, wh);
      if (k <= 5) hazamaRow(acc, m, -hx + 0.8, hx - 0.8, y0 + sill + wh + 0.55, 2.3, k % 2 ? 'vos' : 'osv', 0.17, (u) => spread(hx, n, avoid, 1.6).some((c) => Math.abs(u - c) < 0.9) || (bw && Math.abs(u) < bw / 2 + 0.6));
      if (bw) { // cửa sổ lồi có song 出格子窓 dưới kara-hafu
        put(acc, m, 'plaster', box(bw, 1.9, 0.85, 0, y0 + 1.95, 0.42)); put(acc, m, 'plaster', box(bw + 0.3, 0.22, 1.0, 0, y0 + 0.95, 0.5));
        const mm = new THREE.Matrix4().multiplyMatrices(m, new THREE.Matrix4().makeTranslation(0, 0, 0.85)); for (const u of spread(bw / 2, Math.round(bw / 1.6), [], 0.2)) castleWin(acc, mm, u, y0 + 1.25, 1.2, 1.3, { sill: false });
      }
      if (k === 9) { const n9 = Math.round((2 * hx) / 2.4); for (let i = 0; i <= n9; i++) put(acc, m, 'plaster2', box(0.34, FH - 0.6, 0.12, -hx + (2 * hx * i) / n9, y0 + 0.6 + (FH - 0.6) / 2, 0.06)); for (const y of [y0 + 1.15, y0 + 3.0, y0 + FH - 0.25]) put(acc, m, 'plaster2', box(2 * hx, 0.22, 0.14, 0, y, 0.07)); } // 真壁 lộ cột
    }
  }
  // hộc thả đá kiểu váy ở 3 góc tầng G4 (ĐB, ĐN, TN) — phóng 1,5 m cho thấy được (02 › tower §8)
  for (const [sx, sz] of [[1, -1], [1, 1], [-1, 1]]) for (const f of [sz > 0 ? 'S' : 'N', sx > 0 ? 'E' : 'W']) { const hx = F[3].a + T; hakama(acc, fr(3, f), Math.sign(cornerU(f, sx, sz, 1, 1)) * (hx - 0.85), F[3].y + 0.05, 1.6, 1.6, 0.65); }
  // ---- đầu hồi trên các lớp mái
  const yAtV = (r, v) => r.Y(0, 0, Math.max(0, r.ov - v));
  // 1 重 Đông: kara-hafu
  { const r = RR[1], m = fr(3, 'E'); karaHafu(acc, m, { f: r.ov - 0.05, yE: r.yE - 0.02, w: 9.6, hk: 1.7, L: 5.6, K, mortar, rib: 0.55, ribW: 0.2 }); }
  // 2 重 Nam: kara-hafu; Đông / Tây: đầu hồi irimoya lớn (mái gốc vọng lâu) chạm mái 3 重
  { const r = RR[2]; karaHafu(acc, fr(4, 'S'), { f: r.ov - 0.05, yE: r.yE - 0.02, w: 10.8, hk: 1.9, L: 6.0, K, mortar, rib: 0.55, ribW: 0.2 });
    for (const f of ['E', 'W']) { const fv = r.ov * 0.3, yb = yAtV(r, fv) + 0.15, top = RR[3].yE - 0.5; triHafu(acc, fr(4, f), { f: fv, yb, hw: 11.5, h: top - yb, L: fv + (F[4].a - F[5].a) + 1.2, K, mortar, rib: 0.6, ribW: 0.22, ef: 0.7, eo: 0.9, gegyoS: 1.9, hipBack: 0.85,
      win: (a, mm, u, y, H) => { castleWin(a, mm, u, y + H * 0.22, 2.4, 1.2); hazama(a, mm, u, y + H * 0.55, 'o', 0.3); hazama(a, mm, u - 4.2, y + 0.8, 'v', 0.22); hazama(a, mm, u + 4.2, y + 0.8, 'v', 0.22); hazama(a, mm, u - 2.2, y + 2.6, 's', 0.2); hazama(a, mm, u + 2.2, y + 2.6, 's', 0.2); } }); } }
  // 3 重 Nam / Bắc: irimoya đôi 比翼入母屋破風
  { const r = RR[3]; for (const f of ['S', 'N']) for (const u of [-5.0, 5.0]) { const fv = r.ov * 0.35, yb = yAtV(r, fv) + 0.15; triHafu(acc, fr(6, f), { u, f: fv, yb, hw: 4.4, h: 4.3, L: fv + (F[6].a - F[7].a) + 1.0, K, mortar, rib: 0.55, ribW: 0.2, win: (a, mm, uu, y, H) => { hazama(a, mm, uu, y + H * 0.4, 'o', 0.24); hazama(a, mm, uu - 1.8, y + 0.55, 'v', 0.18); hazama(a, mm, uu + 1.8, y + 0.55, 'v', 0.18); } }); } }
  // 4 重 Nam / Bắc: chidori-hafu; Đông / Tây: kara-hafu
  { const r = RR[4]; for (const f of ['S', 'N']) { const fv = r.ov * 0.5, yb = yAtV(r, fv) + 0.15; triHafu(acc, fr(8, f), { f: fv, yb, hw: 3.8, h: 3.6, L: fv + (F[8].a - F[9].a) + 1.0, K, mortar, rib: 0.55, ribW: 0.2, win: (a, mm, uu, y, H) => hazama(a, mm, uu, y + H * 0.38, 'o', 0.24) }); }
    for (const f of ['E', 'W']) karaHafu(acc, fr(8, f), { f: r.ov - 0.05, yE: r.yE - 0.02, w: 6.6, hk: 1.25, L: 4.0, K, mortar, rib: 0.55, ribW: 0.2 }); }
  // 5 重 Nam / Bắc: kara-hafu trên mép hiên mái đỉnh
  for (const f of ['S', 'N']) karaHafu(acc, frameM(0, FACE[f][1], 0, FACE[f][1] * h5), { f: ov5 - 0.05, yE: yE5 - 0.02, w: 7.6, hk: 1.45, L: 4.4, K, mortar, rib: 0.55, ribW: 0.2 });
  const foot = outer(yS);
  return { acc, info: { W: 2 * (F[3].a + T), D: 2 * (F[3].a + T), PW: 2 * P.a, PD: 2 * P.a + P.run, ph: P.y, top: R5.top, stoneTop: yT, stoneFoot: 2 * foot, n: 4, floors: F.length, eave: RR[1].yE, kind: 'tower' } };
}
