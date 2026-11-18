// ============================================================================
//  BỘ DỰNG DINH THỰ & VƯỜN NHẬT — theo docs/tienphu-nghiencuu/02-nhatban.md
//  shoin: dinh shoin-zukuri Ninomaru Goten (sàn gỗ trên cột + đá kê, hiên gỗ, cột vuông lộ, cửa trượt 舞良戸 / 明障子,
//         dải vữa trắng trên 長押, mái irimoya ngói rất to, đầu hồi 狐格子 + 懸魚 mạ vàng, rui kép 二軒; khối phụ gãy bậc)
//  umaya: chuồng ngựa chữ L Hikone (mái ván 杮葺, tường trên trắng / dưới ván đen, nhịp ngăn ngựa, lầu giếng)
//  chashitsu / chaya / azumaya / koshikake: sukiya Katsura (mái tranh dày dốc, cột còn vỏ, tường đất vàng nâu)
// ============================================================================
import * as THREE from 'three';
import {
  Acc, box, boxB, beam, slabXY, lathe, ribAlong, V, JP, ROOFK, FACE, frameM, put, place, panel, profU, rodX, rodZ,
  jpRoof, roofProfileJ, karaHafu, gegyo, steps, barkPost,
} from './jp-kit.js';

/** chia gian lẻ, gian giữa ≥ cMin */
export function bayList(L, target, cMin = 0) {
  let n = Math.max(1, 2 * Math.round((L / target - 1) / 2) + 1); const c = Math.max(cMin, L / n);
  if (n === 1) return [L];
  const o = (L - c) / (n - 1), out = []; for (let i = 0; i < n; i++) out.push(i === (n - 1) / 2 ? c : o); return out;
}
const edges = (bays) => { const L = bays.reduce((a, b) => a + b, 0), xs = [-L / 2]; for (const b of bays) xs.push(xs[xs.length - 1] + b); return xs; };

// ---------------------------------------------------------------- DINH SHOIN-ZUKURI
/**
 * khối dinh (cục bộ: nóc theo x): { W, D (tim cột ngoài), cx, cz, ry, ends, open: 'N'… (mặt nối khối khác: không vách / hiên),
 *   entrance: 'S' | 'E' (mặt có lối vào gian giữa), colH, over, slopes, ridgeH, interior }
 */
function shoinBlock(acc, b, S) {
  const sub = new Acc(), ph = S.ph, W = b.W, D = b.D, colH = b.colH ?? S.colH, over = b.over ?? S.over, ke = S.kureEn ?? 1.1, open = b.open || '';
  const bayX = bayList(W, S.bay ?? 2.45, b.entrance === 'S' ? 3.0 : 0), bayZ = bayList(D, S.bay ?? 2.45, b.entrance === 'E' ? 3.0 : 0);
  const xs = edges(bayX), zs = edges(bayZ);
  // sàn gỗ + chiếu + gầm tối + đá kê
  sub.add('floor', boxB(W + 0.32, 0.28, D + 0.32, 0, ph - 0.28, 0)); sub.plat({ x: 0, z: 0, w: W + 0.32, d: D + 0.32, top: ph });
  sub.add('void', boxB(W - 0.5, ph - 0.28, D - 0.5, 0, 0, 0));
  const iri = Math.min(2.4, Math.min(W, D) * 0.18);
  if (b.interior !== false) sub.add('tatami', boxB(W - 2 * iri, 0.05, D - 2 * iri, 0, ph, 0));
  const posts = []; for (const x of xs) for (const z of [-D / 2, D / 2]) posts.push([x, z]); for (const z of zs.slice(1, -1)) for (const x of [-W / 2, W / 2]) posts.push([x, z]);
  for (const [x, z] of posts) { sub.add('wood', boxB(0.3, colH, 0.3, x, ph, z)); sub.add('stoneC', boxB(0.55, 0.3, 0.55, x, 0, z)); sub.add('frame', boxB(0.22, ph - 0.58, 0.22, x, 0.3, z)); }
  // hiên gỗ ngoài 落縁 (thấp hơn sàn 0,15) + cột hiên + mặt đi được
  const yk = ph - 0.15;
  for (const f of 'SNEW') {
    if (open.includes(f)) continue;
    const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? W : D, cx = nx * (W / 2 + ke / 2 + 0.15), cz = nz * (D / 2 + ke / 2 + 0.15), along = nx === 0;
    const w = along ? L + 2 * ke + 0.3 : ke, d = along ? ke : L + 0.3;
    sub.add('engawa', boxB(w, 0.12, d, cx, yk - 0.12, cz)); sub.plat({ x: cx, z: cz, w, d, top: yk });
    sub.add('frame', boxB(along ? w : 0.14, 0.24, along ? 0.14 : d, cx + nx * (ke / 2), yk - 0.36, cz + nz * (ke / 2)));
    const ps = (along ? xs : zs); for (const p of ps) { const x = along ? p : cx + nx * (ke / 2 - 0.1), z = along ? cz + nz * (ke / 2 - 0.1) : p; sub.add('frame', boxB(0.16, yk - 0.24, 0.16, x, 0, z)); sub.add('stoneC', boxB(0.4, 0.2, 0.4, x, 0, z)); }
  }
  // mặt ngoài: theo gian — cửa trượt 舞良戸 (2 cánh, 2 ray), ô giấy 欄間, 長押, dải vữa trắng, 頭貫 + 桁
  const hD = Math.min(2.9, colH * 0.5), hT = 0.6, yN = ph + hD + 0.18 + hT, yTop = ph + colH;
  for (const f of 'SNEW') {
    const [nx, nz] = FACE[f], L = f === 'S' || f === 'N' ? W : D, m = frameM(nx, nz, nx * W / 2, nz * D / 2), E = (f === 'S' || f === 'N' ? xs : zs);
    if (open.includes(f)) { put(sub, m, 'wood', box(L + 0.4, 0.34, 0.34, 0, yTop - 0.17, 0)); continue; }
    put(sub, m, 'wood', box(L, 0.12, 0.26, 0, ph + 0.06, 0)); put(sub, m, 'wood', box(L, 0.18, 0.22, 0, ph + hD + 0.09, 0));
    put(sub, m, 'wood', box(L + 0.32, 0.26, 0.12, 0, yN + 0.13, 0.17)); put(sub, m, 'plaster', box(L, yTop - 0.34 - yN - 0.26, 0.14, 0, (yN + 0.26 + yTop - 0.34) / 2, 0.02));
    put(sub, m, 'wood', box(L + 0.4, 0.34, 0.34, 0, yTop - 0.17, 0));
    const ci = (E.length - 2) / 2, ent = b.entrance === f;
    for (let i = 0; i < E.length - 1; i++) {
      const u0 = E[i], u1 = E[i + 1], bw = u1 - u0 - 0.3, cu = (u0 + u1) / 2;
      put(sub, m, 'shoji', box(bw, hT, 0.06, cu, ph + hD + 0.18 + hT / 2, 0));
      if (ent && i === ci) continue;                                                                 // lối vào: cửa trượt đã kéo hết sang hai bên
      const shoji = (S.pattern || 'mmmsm')[i % (S.pattern || 'mmmsm').length] === 's' && f !== 'S';
      for (const s of [-1, 1]) put(sub, m, shoji ? 'shoji' : 'mairado', box(bw / 2 + 0.04, hD, 0.06, cu + s * (bw / 4), ph + hD / 2 + 0.12, s * 0.065));
    }
    if (S.gold) for (const u of E) put(sub, m, 'gold', box(0.2, 0.16, 0.05, u, yN + 0.13, 0.25));        // 釘隠 trên 長押
  }
  // nội thất (đọc được ở mặt bằng): cột lõi, vách fusuma quanh lõi 身舎 + vách ngăn giữa (chừa lối giữa)
  if (b.interior !== false) {
    const cw = W / 2 - iri, cd = D / 2 - iri, fh = hD + hT;
    for (const [x, z] of [[-cw, -cd], [cw, -cd], [-cw, cd], [cw, cd], [0, cd], [0, -cd], [-cw, 0], [cw, 0]]) sub.add('wood', boxB(0.26, colH - 0.4, 0.26, x, ph, z));
    const seg = (ax, az, bx, bz, gap = 0) => { const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2; const parts = gap ? [[-L / 2, -gap / 2], [gap / 2, L / 2]] : [[-L / 2, L / 2]]; for (const [u0, u1] of parts) { const u = (u0 + u1) / 2, c = Math.cos(ry), s = Math.sin(ry); sub.add('fusuma', box(u1 - u0, fh, 0.08, (ax + bx) / 2 + c * u, ph + fh / 2, (az + bz) / 2 - s * u, ry)); sub.add('plaster', box(u1 - u0, colH - fh - 0.6, 0.1, (ax + bx) / 2 + c * u, ph + fh + (colH - fh - 0.6) / 2, (az + bz) / 2 - s * u, ry)); } };
    seg(-cw, cd, cw, cd, 3.0); seg(-cw, -cd, cw, -cd); seg(-cw, -cd, -cw, cd); seg(cw, -cd, cw, cd); seg(-cw, 0, cw, 0, 3.0);
  }
  // mái irimoya (ngói bản), rui kép lộ dưới hiên
  const ez = D / 2 + over, ex = W / 2 + over, prof = roofProfileJ(ez, b.slopes || S.slopes, Math.max(10, Math.ceil(ez / 1.1)));
  const K = S.K || ROOFK.palace, yE = yTop + 0.42 - prof.P(over), th = 0.3, ends = b.ends || ['irimoya', 'irimoya'];
  // đầu 'open' (vùi vào mái khối chính) kéo dài thêm openExt để mặt cắt mái nằm gọn dưới nóc khối chính
  const ext = b.openExt || 0, sh = ext ? (ends[0] === 'open' ? -ext / 2 : ext / 2) : 0;
  const R0 = jpRoof(sub, { ex: ex + ext / 2, ez, yE, prof, ends, dG: over + (D / 2) * (S.dGk ?? 0.4), K, rib: 0.46, ribW: 0.21, ridgeH: b.ridgeH ?? S.ridgeH, ridgeW: 0.7, soffit: over - 0.12, thick: th, caps: true, lift: 0.2, gegyoS: Math.min(2.0, 0.6 + D * 0.06), verge: 0.6, m: sh ? new THREE.Matrix4().makeTranslation(sh, 0, 0) : null });
  const R = { ...R0, Y: (x, z, d) => R0.Y(x - sh, z, d), xEnd: (i, d) => R0.xEnd(i, d) + (i ? sh : -sh) };
  const rafter = (a, c) => { sub.add('wood', beam(a, c, 0.13, 0.16)); };
  for (const sz of [1, -1]) for (let x = -ex + 0.35; x < ex - 0.3; x += 0.55) {
    if (x < -R.xEnd(0, 0) + 0.2 || x > R.xEnd(1, 0) - 0.2) continue;
    const e = Math.max(0, Math.abs(x) - W / 2); if ((ends[x < 0 ? 0 : 1] === 'open') && e > 0) continue;
    const z0 = sz * (D / 2 + e), z1 = sz * (ez - 0.06), d0 = ez - Math.abs(z0), dm = over * 0.5;
    if (d0 < 0.3) continue;
    rafter(V(x, R.Y(x, z0, d0) - th - 0.12, z0), V(x, R.Y(x, sz * (ez - dm), dm) - th - 0.12, sz * (ez - dm)));
    rafter(V(x, R.Y(x, sz * (ez - dm - 0.4), dm + 0.4) - th - 0.02, sz * (ez - dm - 0.4)), V(x, R.Y(x, z1, 0.06) - th - 0.02, z1));
  }
  for (const i of [0, 1]) { if (ends[i] === 'open' || ends[i] === 'gable') continue; const sx = i ? 1 : -1; for (let z = -ez + 0.35; z < ez - 0.3; z += 0.55) { const e = Math.max(0, Math.abs(z) - D / 2), x0 = sx * (W / 2 + e), x1 = sx * (ex - 0.06), d0 = ex - Math.abs(x0), dm = over * 0.5; if (d0 < 0.3) continue; rafter(V(x0, R.Y(x0, z, d0) - th - 0.12, z), V(sx * (ex - dm), R.Y(sx * (ex - dm), z, dm) - th - 0.12, z)); rafter(V(sx * (ex - dm - 0.4), R.Y(sx * (ex - dm - 0.4), z, dm + 0.4) - th - 0.02, z), V(x1, R.Y(x1, z, 0.06) - th - 0.02, z)); } }
  // bậc gỗ 木階 ở lối vào (trừ khi có cổng hiên kara-hafu)
  if (b.entrance && !b.porch) { const [nx, nz] = FACE[b.entrance], L = b.entrance === 'S' ? W : D; const sub2 = new Acc(); steps(sub2, { x: 0, zTop: 0, w: 2.8, h: yk, key: 'engawa' }); for (const s of [-1, 1]) sub2.add('frame', boxB(0.16, yk + 0.6, Math.round(yk / 0.17) * 0.32, s * 1.48, 0, Math.round(yk / 0.17) * 0.16)); place(sub, sub2, nx * (W / 2 + ke + 0.15), nz * (D / 2 + ke + 0.15), Math.atan2(nx, nz)); }
  place(acc, sub, b.cx || 0, b.cz || 0, b.ry || 0);
  return { R, top: R.top, yE, ex, ez };
}

/** DINH SHOIN: nhiều khối (khối chính + khối phụ gãy bậc) + cổng hiên kara-hafu tuỳ chọn */
export function jpShoin(spec) {
  const acc = new Acc(), ph = spec.ph; let top = 0, eave = 0;
  for (const b of spec.blocks) { const r = shoinBlock(acc, b, spec); top = Math.max(top, r.top); eave = Math.max(eave, r.yE); }
  // cổng hiên 向唐破風 (mượn Kurumayose Nijō): 4 cột, dầm cầu vồng 虹梁, mái vỏ bách hinoki cong
  let PDf = 0;
  if (spec.porch) {
    const p = spec.porch, z0 = p.z0, z1 = z0 + p.d, hw = p.w / 2, yE = ph + p.h, K = ROOFK.hinoki;
    acc.add('floor', boxB(p.w + 0.4, 0.28, p.d, 0, ph - 0.28, z0 + p.d / 2)); acc.plat({ x: 0, z: z0 + p.d / 2, w: p.w + 0.4, d: p.d, top: ph });
    acc.add('void', boxB(p.w, ph - 0.28, p.d - 0.3, 0, 0, z0 + p.d / 2));
    for (const s of [-1, 1]) for (const z of [z0 + 0.4, z1 - 0.2]) { acc.add('wood', boxB(0.36, p.h, 0.36, s * (hw - 0.2), ph, z)); acc.add('stoneC', boxB(0.62, ph, 0.62, s * (hw - 0.2), 0, z)); acc.add('gold', boxB(0.4, 0.14, 0.4, s * (hw - 0.2), ph + 0.1, z)); }
    for (const z of [z0 + 0.4, z1 - 0.2]) { acc.add('wood', boxB(p.w, 0.5, 0.34, 0, yE - 0.95, z)); acc.add('gold', boxB(0.5, 0.36, 0.38, -hw + 0.4, yE - 0.88, z)); acc.add('gold', boxB(0.5, 0.36, 0.38, hw - 0.4, yE - 0.88, z)); }
    for (const s of [-1, 1]) acc.add('wood', boxB(0.3, 0.4, p.d, s * (hw - 0.2), yE - 0.5, z0 + p.d / 2));
    karaHafu(acc, frameM(0, 1, 0, z1), { f: 0.9, yE, w: p.w + 1.4, hk: p.hk, L: p.d + 1.5, K, rib: 1e6 });
    const n = Math.round(ph / 0.17); steps(acc, { x: 0, zTop: z1 + 0.05, w: p.w - 1.0, h: ph, key: 'engawa' }); PDf = z1 + n * 0.32;
    acc.add('gold', boxB(0.9, 0.9, 0.12, 0, yE - 0.8, z1 + 0.1)); // 蟇股
  }
  const bb = spec.bbox; const ke = (spec.kureEn ?? 1.1) + 0.15;
  return { acc, info: { W: bb[0], D: bb[1], PW: bb[0] + 2 * ke, PD: Math.max(bb[1] / 2 + ke, PDf) + bb[1] / 2 + ke, ph, top, eave, colH: spec.colH, kind: 'shoin' } };
}

// ---------------------------------------------------------------- CHUỒNG NGỰA chữ L (彦根城馬屋)
export function jpUmaya(spec) {
  const acc = new Acc(), K = ROOFK.kokera, d = spec.depth, h = spec.wallH, A = spec.armA, Bl = spec.armB;
  const bx0 = -A / 2, zA0 = -(Bl + d) / 2;                          // hộp bao: x ∈ [−A/2, A/2], z ∈ [−(B+d)/2, (B+d)/2]
  const wingA = { x0: -A / 2, x1: A / 2, z0: zA0, z1: zA0 + d }, wingB = { x0: -A / 2, x1: -A / 2 + d, z0: zA0 + d, z1: (Bl + d) / 2 };
  const wall = (ax, az, bx, bz, inner, nOff = 1) => { // vách dọc đoạn; inner = mặt nhìn sân (ngăn ngựa mở)
    const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2, n = Math.round(L / 2.7), c = Math.cos(ry), s = Math.sin(ry), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    const P = (u, y, v = 0) => [mx + c * u + s * v, y, mz - s * u + c * v];
    for (let i = 0; i <= n; i++) { const [x, , z] = P(-L / 2 + (L * i) / n, 0); acc.add('frame', boxB(0.26, h, 0.26, x, 0, z)); acc.add('stoneC', boxB(0.45, 0.2, 0.45, x, 0, z)); }
    acc.add('frame', box(L + 0.3, 0.32, 0.3, mx, h - 0.16, mz, ry));
    if (!inner) { acc.add('board', box(L, 1.45, 0.24, mx, 0.72, mz, ry)); acc.add('plaster', box(L, h - 1.6, 0.24, mx, 1.45 + (h - 1.6) / 2, mz, ry)); acc.add('frame', box(L + 0.1, 0.1, 0.3, mx, 1.47, mz, ry)); }
    else { acc.add('plaster', box(L, 0.7, 0.2, mx, h - 0.67, mz, ry)); for (let i = 0; i < n; i++) { const u = -L / 2 + (L * (i + 0.5)) / n, [x, , z] = P(u, 0); for (const y of [0.85, 1.25]) acc.add('wood', box(L / n - 0.3, 0.1, 0.1, x, y, z, ry)); } } // 馬栓棒 hai thanh chắn mỗi ngăn
    return { L, ry, n, P };
  };
  // cánh A (Đông–Tây, phía Bắc): mặt Bắc kín, mặt Nam mở ngăn ngựa; cánh B (Nam–Bắc, phía Tây): mặt Tây kín, mặt Đông mở
  const wa = wall(wingA.x0, wingA.z0, wingA.x1, wingA.z0, false); wall(wingA.x1, wingA.z0, wingA.x1, wingA.z1, false);
  wall(wingB.x1, wingA.z1, wingA.x1, wingA.z1, true); wall(wingA.x0, wingA.z0, wingA.x0, wingB.z1, false);
  wall(wingB.x0, wingB.z1, wingB.x1, wingB.z1, false); wall(wingB.x1, wingB.z1, wingB.x1, wingA.z1, true);
  // vách ngăn ngựa trong (ván thấp) + máng — dãy 馬立場 dọc lưng chuồng
  for (let x = wingB.x1 + 2.7; x < wingA.x1 - 4.5; x += 2.7) acc.add('board', boxB(0.1, 1.7, d * 0.55, x, 0, wingA.z0 + d * 0.3));
  for (let z = wingA.z1 + 2.7; z < wingB.z1 - 0.5; z += 2.7) acc.add('board', boxB(d * 0.55, 1.7, 0.1, wingB.x0 + d * 0.3, 0, z));
  acc.add('earth', boxB(A - 0.4, 0.04, d - 0.4, 0, 0, wingA.z0 + d / 2)); acc.add('earth', boxB(d - 0.4, 0.04, Bl - 0.2, wingB.x0 + d / 2, 0, (wingB.z0 + wingB.z1) / 2));
  // phòng chiếu quản lý ở đầu Đông: vách shōji mặt Nam
  acc.add('shoji', boxB(4.6, h - 1.0, 0.1, wingA.x1 - 2.6, 0.3, wingA.z1 - 0.05)); acc.add('floor', boxB(5.0, 0.5, d - 0.6, wingA.x1 - 2.8, 0, wingA.z0 + d / 2)); acc.add('tatami', boxB(4.8, 0.04, d - 0.8, wingA.x1 - 2.8, 0.5, wingA.z0 + d / 2));
  // cổng ra vào gần đầu Tây (mặt Bắc): khung + cánh ván mở
  { const u = -A / 2 + 7.5; acc.add('void', boxB(2.8, 2.6, 0.3, u, 0, wingA.z0)); for (const s of [-1, 1]) { acc.add('woodDk', boxB(0.3, 2.9, 0.4, u + s * 1.55, 0, wingA.z0)); acc.add('board', boxB(0.1, 2.5, 1.35, u + s * 1.3, 0.05, wingA.z0 + 0.75)); } acc.add('woodDk', boxB(3.6, 0.3, 0.4, u, 2.9, wingA.z0)); }
  // mái ván 杮葺 irimoya: cánh A (nóc theo x) + cánh B (nóc theo z, đầu Bắc vùi tới nóc cánh A)
  const ov = 0.95, sl = [[ov, 0.5], 0.92, 1.1];
  const pA = roofProfileJ(d / 2 + ov, sl, 8), yA = h + 0.3 - pA.P(ov);
  const RA = jpRoof(acc, { ex: A / 2 + ov, ez: d / 2 + ov, yE: yA, prof: pA, ends: ['irimoya', 'irimoya'], dG: ov + d * 0.2, K, rib: 1e6, thick: 0.18, ridgeH: 0.45, soffit: ov, lift: 0, verge: 0.4, m: new THREE.Matrix4().makeTranslation(0, 0, wingA.z0 + d / 2) });
  const zN = wingA.z0 + d / 2, zS = wingB.z1 + ov, Lb = zS - zN;
  jpRoof(acc, { ex: Lb / 2, ez: d / 2 + ov, yE: yA, prof: pA, ends: ['open', 'irimoya'], dG: ov + d * 0.2, K, rib: 1e6, thick: 0.18, ridgeH: 0.45, soffit: ov, lift: 0, verge: 0.4, m: new THREE.Matrix4().makeRotationY(-Math.PI / 2).setPosition(wingB.x0 + d / 2, 0, (zN + zS) / 2) });
  // lầu giếng 井戸屋形 trong sân, sát cánh A
  { const cx = 4, cz = wingA.z1 + 3.4, sub = new Acc(); for (const [x, z] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) sub.add('frame', boxB(0.18, 2.6, 0.18, x, 0, z));
    sub.add('stoneC', lathe([[0.75, 0], [0.75, 0.75], [0.55, 0.75], [0.55, 0.05]], 0, 0, 0, 14)); sub.add('void', boxB(0.9, 0.02, 0.9, 0, 0.72, 0)); sub.add('frame', rodX(2.6, 0.08, 0, 2.2, 0));
    const pw = roofProfileJ(1.9, [[0.5, 0.55], 0.9], 5); jpRoof(sub, { ex: 1.9, ez: 1.9, yE: 2.75 - pw.P(0.5), prof: pw, ends: ['gable', 'gable'], K, rib: 1e6, thick: 0.14, ridgeH: 0.3, verge: 0.3, gableFace: false, lift: 0, gegyoS: 0.35 }); place(acc, sub, cx, cz); }
  return { acc, info: { W: A, D: Bl + d, PW: A + 2 * ov, PD: Bl + d + 2 * ov, ph: 0, top: RA.top, eave: yA, kind: 'umaya' } };
}

// ---------------------------------------------------------------- TRÀ THẤT SUKIYA (松琴亭 Shōkintei, Katsura)
export function jpChashitsu(spec) {
  const acc = new Acc(), s = spec.s ?? 1.3, ph = spec.ph, W = spec.W, D = spec.D, dz = spec.doma, H = spec.colH, KT = ROOFK.thatch, KK = ROOFK.kokera;
  const zF = D / 2, zB = -D / 2;
  acc.add('floor', boxB(W, ph, D, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: W, d: D, top: ph }); acc.add('tatami', boxB(W - 0.4, 0.04, D - 0.4, 0, ph, 0));
  // hiên đất 土庇 (mặt trước) + đá cởi giày 沓脱石
  acc.add('doma', boxB(W + 1.2, 0.08, dz, 0, 0, zF + dz / 2)); acc.add('stoneC', boxB(1.6, ph - 0.12, 0.7, 0, 0, zF + 0.45)); acc.plat({ x: 0, z: zF + 0.45, w: 1.6, d: 0.7, top: ph - 0.12 });
  const xs = edges(bayList(W, 2.2 * s / 1.3 * 1.3, 2.9)), zs = edges(bayList(D, 2.2));
  for (const x of xs) for (const z of [zF, zB]) barkPost(acc, x, z, 0, ph + H, 0.1, 'bark', 0.03, x + z);
  for (const z of zs.slice(1, -1)) for (const x of [-W / 2, W / 2]) barkPost(acc, x, z, 0, ph + H, 0.1, 'bark', 0.03, z);
  for (const x of xs) barkPost(acc, x, zF + dz - 0.25, 0, H + ph - 0.55, 0.12, 'bark', 0.07, x * 2);               // cột thô hiên đất
  // mặt trước: shōji các gian, hai gian giữa đã mở (lối vào ≥ 2,4 m)
  const ci = (xs.length - 2) / 2;
  for (let i = 0; i < xs.length - 1; i++) { const x0 = xs[i] + 0.1, x1 = xs[i + 1] - 0.1, cx = (x0 + x1) / 2; acc.add('frame', boxB(x1 - x0, 0.12, 0.14, cx, ph + 1.85, zF)); if (i === ci) continue; for (const k of [-1, 1]) acc.add('shoji', boxB((x1 - x0) / 2 + 0.03, 1.8, 0.05, cx + k * (x1 - x0) / 4, ph + 0.02, zF + k * 0.04)); }
  acc.add('earth', boxB(W, H - 1.97, 0.16, 0, ph + 1.97, zF));
  // tường đất ba mặt kia + cửa sổ khung tre 下地窓
  for (const [ax, az, bx, bz] of [[-W / 2, zB, W / 2, zB], [-W / 2, zB, -W / 2, zF], [W / 2, zB, W / 2, zF]]) { const L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2; acc.add('earth', box(L, H, 0.18, (ax + bx) / 2, ph + H / 2, (az + bz) / 2, ry)); acc.add('frame', box(L, 0.1, 0.24, (ax + bx) / 2, ph + 1.85, (az + bz) / 2, ry)); }
  for (const z of [-1.2, 1.4]) { const g = new THREE.Matrix4(); for (const sx of [-1]) { const m = frameM(sx, 0, sx * W / 2 - sx * 0.02, z); put(acc, m, 'void', panel(Array.from({ length: 14 }, (_, i) => [Math.cos((i / 14) * Math.PI * 2) * 0.55, ph + 1.3 + Math.sin((i / 14) * Math.PI * 2) * 0.55]), 0.04, 0.1)); for (let k = -2; k <= 2; k++) { put(acc, m, 'bamboo', box(0.04, 1.0, 0.04, k * 0.2, ph + 1.3, 0.13)); put(acc, m, 'bamboo', box(1.0, 0.04, 0.04, 0, ph + 1.3 + k * 0.2, 0.14)); } } }
  // nội thất: hốc tường (giấy ô vuông xanh trắng 市松 trên vách sau và vách ngăn), lò đá
  acc.add('ichi', boxB(3.4, 1.5, 0.06, -W / 4, ph + 0.35, zB + 0.12)); acc.add('ichi', boxB(0.06, 1.2, 2.4, 0.4, ph + 0.5, -0.4)); acc.add('fusuma', boxB(0.08, 1.8, D * 0.45, 0.4, ph, D * 0.2));
  acc.add('stoneC', boxB(1.0, 0.18, 1.0, W * 0.28, ph, -0.6)); acc.add('void', boxB(0.6, 0.02, 0.6, W * 0.28, ph + 0.18, -0.6));
  // mái tranh irimoya dày, dốc (chiếm phần lớn chiều cao)
  const ov = spec.over, ez = D / 2 + ov, pf = roofProfileJ(ez, [[ov, 0.72], 1.15, 1.35], 10), yE = ph + H + 0.35 - pf.P(ov);
  const R = jpRoof(acc, { ex: W / 2 + ov, ez, yE, prof: pf, ends: ['irimoya', 'irimoya'], dG: ov + (D / 2) * 0.62, K: KT, rib: 1e6, thick: 0.6, ridgeH: 0.65, ridgeW: 0.9, soffit: ov, lift: 0, verge: 0.35, gegyoS: 0.01 });
  for (let x = -R.xEnd(0, R.dTop) + 0.4; x < R.xEnd(1, R.dTop) - 0.3; x += 1.1) acc.add('bamboo', box(0.12, 0.5, 1.35, x, R.yT + 0.2, 0)); // 烏踊り thanh tre trên nóc
  // mái ván 杮葺 hiên đất (庇) — thấp hơn mái tranh
  { const m = frameM(0, 1, 0, zF + ov * 0.4), L = dz + 0.55; put(acc, m, KK.tile, profU([[L, ph + H - 0.85], [L, ph + H - 0.77], [0, ph + H + 0.05], [0, ph + H - 0.03]], -W / 2 - 0.8, W / 2 + 0.8)); put(acc, m, KK.edge, box(W + 1.6, 0.12, 0.16, 0, ph + H - 0.85, L)); put(acc, m, 'frame', box(W + 1.2, 0.2, 0.2, 0, ph + H - 1.0, dz - 0.6)); }
  // trà thất 三畳台目 gắn phía Đông: tường đất, cửa chui 躙口, cửa sổ, mái ván riêng thấp
  { const tw = spec.tea[0], td = spec.tea[1], cx = W / 2 + tw / 2, cz = zB + td / 2, sub = new Acc();
    sub.add('floor', boxB(tw, ph, td, 0, 0, 0)); sub.add('tatami', boxB(tw - 0.3, 0.04, td - 0.3, 0, ph, 0)); sub.plat({ x: 0, z: 0, w: tw, d: td, top: ph });
    const h2 = H - 0.5; for (const [x, z] of [[tw / 2, td / 2], [tw / 2, -td / 2], [-tw / 2 + 0.1, td / 2]]) barkPost(sub, x, z, 0, ph + h2, 0.09, 'bark', 0.05, x * 3 + z);
    sub.add('earth', boxB(0.16, h2, td, tw / 2, ph, 0)); sub.add('earth', boxB(tw, h2, 0.16, 0, ph, -td / 2)); sub.add('earth', boxB(tw, h2, 0.16, 0, ph, td / 2));
    const m = frameM(1, 0, tw / 2, 0); put(sub, m, 'board', box(0.66, 0.72, 0.06, 0.4, ph + 0.3 + 0.36, 0.1)); put(sub, m, 'frame', box(0.9, 0.08, 0.12, 0.4, ph + 1.06, 0.1)); sub.add('stoneC', boxB(0.7, ph - 0.1, 0.5, tw / 2 + 0.4, 0, -0.4)); sub.plat({ x: tw / 2 + 0.4, z: -0.4, w: 0.7, d: 0.5, top: ph - 0.1 });
    for (const [f, u, y, w, h] of [['E', -0.9, 1.4, 0.7, 0.8], ['S', -0.5, 0.6, 0.8, 0.7], ['S', 0.9, 1.6, 0.6, 0.6], ['N', 0.6, 1.2, 0.7, 0.9]]) { const [nx, nz] = FACE[f], mm = frameM(nx, nz, nx * tw / 2, nz * td / 2); put(sub, mm, 'shoji', box(w, h, 0.04, u, ph + y, 0.08)); for (let k = 0; k < 4; k++) put(sub, mm, 'bamboo', box(0.035, h, 0.035, u - w / 2 + (w * (k + 0.5)) / 4, ph + y, 0.12)); } // 連子窓 / 下地窓
    const ov2 = 0.7, ez2 = td / 2 + ov2, p2 = roofProfileJ(ez2, [[ov2, 0.5], 0.75], 6);
    jpRoof(sub, { ex: tw / 2 + ov2 + 0.6, ez: ez2, yE: ph + h2 + 0.25 - p2.P(ov2), prof: p2, ends: ['open', 'irimoya'], dG: ov2 + td * 0.25, K: KK, rib: 1e6, thick: 0.16, ridgeH: 0.35, soffit: ov2, lift: 0, verge: 0.3, gegyoS: 0.4, m: new THREE.Matrix4().makeTranslation(-0.6, 0, 0) });
    place(acc, sub, cx, cz); }
  // phòng sau (thủy ốc, bếp): mái ngói một dốc 片流れ + máng tre
  { const bd = spec.back, sub = new Acc(); sub.add('earth', boxB(W, H - 0.6, 0.16, 0, ph, -bd)); for (const sx of [-1, 1]) sub.add('earth', boxB(0.16, H - 0.6, bd, sx * W / 2, ph, -bd / 2)); sub.add('floor', boxB(W, ph, bd, 0, 0, -bd / 2));
    const m = frameM(0, -1, 0, -bd); put(sub, m, 'tileJp', profU([[0.8, ph + H - 0.7], [0.8, ph + H - 0.62], [-bd - 0.2, ph + H + 0.3], [-bd - 0.2, ph + H + 0.22]], -W / 2 - 0.4, W / 2 + 0.4));
    for (let u = -W / 2 - 0.3; u < W / 2 + 0.3; u += 0.42) put(sub, m, 'ribJp', beam(V(u, ph + H - 0.6, 0.8), V(u, ph + H + 0.32, -bd - 0.2), 0.16, 0.14));
    put(sub, m, 'bamboo', rodX(W + 0.8, 0.09, 0, ph + H - 0.78, 0.95, 8)); place(acc, sub, 0, zB); }
  return { acc, info: { W: W + spec.tea[0], D: D + dz + spec.back, PW: W + spec.tea[0] + 2 * ov, PD: D + dz + spec.back + 2 * ov, ph, top: R.top + 0.3, eave: yE, kind: 'chashitsu' } };
}

// ---------------------------------------------------------------- QUÁN TRÀ ĐỈNH ĐỒI (賞花亭 Shōkatei): kirizuma tranh, hai mặt mở
export function jpChaya(spec) {
  const acc = new Acc(), W = spec.W, D = spec.D, H = spec.colH, KT = { ...ROOFK.thatch, gable: 'earth' };
  acc.add('doma', boxB(W + 0.6, 0.06, D + 0.6, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: W + 0.6, d: D + 0.6, top: 0.06 });
  // 6 cột còn vỏ: 4 góc + giữa hai cạnh dài
  for (const [x, z] of [[-W / 2, D / 2], [W / 2, D / 2], [-W / 2, -D / 2], [W / 2, -D / 2], [0, -D / 2], [0, D / 2]]) barkPost(acc, x, z, 0, H, 0.11, 'bark', 0.06, x + 2 * z);
  // chiếu ngồi hình «コ» quanh nền đất (Đông, Nam, Tây) — mặt đi được
  for (const [cx, cz, w, d] of [[-W / 2 + 0.5, -0.1, 1.0, D - 0.4], [W / 2 - 0.5, -0.1, 1.0, D - 0.4], [0, -D / 2 + 0.5, W - 2.0, 1.0]]) { acc.add('frame', boxB(w, 0.4, d, cx, 0, cz)); acc.add('tatami', boxB(w - 0.1, 0.05, d - 0.1, cx, 0.4, cz)); acc.plat({ x: cx, z: cz, w, d, top: 0.45 }); }
  acc.add('stoneC', boxB(0.8, 0.3, 0.8, 0, 0, 0.2)); acc.add('void', boxB(0.5, 0.02, 0.5, 0, 0.3, 0.2));  // lò trên nền đất
  // tường đất: mặt Đông (cửa sổ khung tre tròn lớn), mặt Nam (cửa sổ song tre + thủy ốc); mặt Bắc & Tây mở
  acc.add('earth', boxB(0.16, H, D, W / 2, 0, 0)); acc.add('earth', boxB(W, H, 0.16, 0, 0, -D / 2)); acc.add('earth', boxB(0.16, H, D * 0.35, -W / 2, 0, -D / 2 + D * 0.175));
  { const m = frameM(1, 0, W / 2, 0); put(acc, m, 'void', panel(Array.from({ length: 18 }, (_, i) => [Math.cos((i / 18) * Math.PI * 2) * 0.75, 1.5 + Math.sin((i / 18) * Math.PI * 2) * 0.75]), 0.04, 0.09)); for (let k = -3; k <= 3; k++) { put(acc, m, 'bamboo', box(0.035, 1.5, 0.04, k * 0.2, 1.5, 0.12)); put(acc, m, 'bamboo', box(1.5, 0.035, 0.04, 0, 1.5 + k * 0.2, 0.13)); } }
  { const m = frameM(0, -1, 0, -D / 2); put(acc, m, 'void', box(1.6, 0.7, 0.04, 0.6, 1.6, 0.09)); for (let k = 0; k < 8; k++) put(acc, m, 'bamboo', box(0.04, 0.7, 0.05, -0.1 + k * 0.2, 1.6, 0.13)); put(acc, m, 'wood', box(1.2, 0.45, 0.06, -1.3, 2.05, 0.1)); } // biển 賞花亭
  acc.add('frame', boxB(W + 0.3, 0.2, 0.2, 0, H - 0.2, D / 2)); acc.add('frame', boxB(0.2, 0.2, D + 0.3, -W / 2, H - 0.2, 0));
  // mái tranh kirizuma (nóc Đông–Tây), hồi đất
  const ov = spec.over, ez = D / 2 + ov, pf = roofProfileJ(ez, [[ov, 0.62], 1.0, 1.15], 8), yE = H + 0.3 - pf.P(ov);
  const R = jpRoof(acc, { ex: W / 2 + 0.75, ez, yE, prof: pf, ends: ['gable', 'gable'], K: KT, rib: 1e6, thick: 0.45, ridgeH: 0.5, ridgeW: 0.75, soffit: ov, lift: 0, verge: 0.65, gableFoot: ov, gegyoS: 0.01 });
  for (let x = -W / 2; x <= W / 2 + 0.01; x += W / 4) acc.add('bamboo', box(0.1, 0.42, 1.1, x, R.yT + 0.15, 0));
  // bồn rửa tay đá 手水鉢 + đá bước dẫn lên
  acc.add('stoneC', lathe([[0.45, 0], [0.5, 0.25], [0.48, 0.7], [0.38, 0.72], [0.36, 0.6], [0.001, 0.6]], 1.2, 0, D / 2 + 1.7, 12)); acc.add('water', boxB(0.5, 0.02, 0.5, 1.2, 0.6, D / 2 + 1.7));
  for (let i = 0; i < 5; i++) { const g = lathe([[0.42, 0], [0.45, 0.06], [0.38, 0.12], [0.001, 0.12]], -0.6 + (i % 2) * 0.5, 0, D / 2 + 1.2 + i * 0.75, 9); g.scale(1, 1, 0.8); acc.add('stoneC', g); }
  return { acc, info: { W, D, PW: W + 2 * 0.75, PD: D + 2 * ov + 4.0, ph: 0, top: R.top, eave: yE, kind: 'chaya' } };
}

// ---------------------------------------------------------------- ĐÌNH NGHỈ 卍亭 (四ツ腰掛): mái tranh chóp vuông, 4 ghế xoay chữ 卍
export function jpAzumaya(spec) {
  const acc = new Acc(), a = spec.a, H = spec.colH, KT = ROOFK.thatch;
  acc.add('stoneC', boxB(2 * a + 1.2, 0.12, 2 * a + 1.2, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: 2 * a + 1.2, d: 2 * a + 1.2, top: 0.12 });
  for (const [x, z] of [[-a, -a], [a, -a], [-a, a], [a, a]]) barkPost(acc, x, z, 0.12, H, 0.11, 'bark', 0.05, x * 3 + z);
  // 4 ghế: mỗi ghế dọc một cạnh, lệch về một góc (xoay 90° lần lượt) — 卍
  for (let k = 0; k < 4; k++) {
    const sub = new Acc(), L = a * 1.35;
    sub.add('engawa', boxB(L, 0.07, 0.5, a - L / 2 - 0.15, 0.48, a - 0.32)); for (const x of [a - 0.4, a - L + 0.1]) sub.add('frame', boxB(0.1, 0.48, 0.4, x, 0.12, a - 0.32));
    sub.add('board', boxB(L, 0.75, 0.05, a - L / 2 - 0.15, 0.55, a - 0.04)); sub.add('frame', boxB(L + 0.1, 0.08, 0.1, a - L / 2 - 0.15, 1.3, a - 0.04));
    sub.plat({ x: a - L / 2 - 0.15, z: a - 0.32, w: L, d: 0.5, top: 0.55 });
    place(acc, sub, 0, 0, (k * Math.PI) / 2);
  }
  for (const [x0, z0, x1, z1] of [[-a, a, a, a], [-a, -a, a, -a], [a, -a, a, a], [-a, -a, -a, a]]) acc.add('frame', beam(V(x0, H, z0), V(x1, H, z1), 0.16, 0.2));
  // mái hōgyō tranh: chóp vuông + nắp ngói + bảo châu
  const ov = spec.over, e = a + ov, pf = roofProfileJ(e, [[ov, 0.65], 1.0, 1.2], 8), yE = H + 0.4 - pf.P(ov);
  const R = jpRoof(acc, { ex: e, ez: e, yE, prof: pf, ends: ['hip', 'hip'], K: KT, rib: 1e6, thick: 0.4, hipW: 0.38, hipOni: false, soffit: ov, lift: 0,
    finial: (sub, yT) => { sub.add('ridgeJp', lathe([[0.7, -0.5], [0.55, 0], [0.32, 0.25], [0.001, 0.3]], 0, yT, 0, 10)); sub.add('ridgeJp', lathe([[0.16, 0], [0.24, 0.22], [0.12, 0.45], [0.001, 0.55]], 0, yT + 0.28, 0, 10)); } });
  return { acc, info: { W: 2 * a, D: 2 * a, PW: 2 * e, PD: 2 * e, ph: 0.12, top: R.yT + 0.85, eave: yE, kind: 'azumaya' } };
}

// ---------------------------------------------------------------- GHẾ CHỜ NGOÀI 外腰掛: yosemune tranh dài thấp, ghế ván, cột kunugi cong
export function jpKoshikake(spec) {
  const acc = new Acc(), W = spec.W, D = spec.D, H = spec.colH, KT = ROOFK.thatch;
  acc.add('stoneC', boxB(W + 0.8, 0.1, D + 0.6, 0, 0, 0)); acc.plat({ x: 0, z: 0, w: W + 0.8, d: D + 0.6, top: 0.1 });
  const xs = edges(bayList(W, 1.97));
  for (const x of xs) { barkPost(acc, x, D / 2, 0.1, H, 0.09, 'kunugi', 0.14, x * 5); barkPost(acc, x, -D / 2, 0.1, H, 0.09, 'kunugi', 0.08, x * 7 + 1); }
  acc.add('earth', boxB(W, H - 0.1, 0.14, 0, 0.1, -D / 2));
  { const m = frameM(0, 1, 0, -D / 2 + 0.07); put(acc, m, 'void', box(1.0, 0.55, 0.03, W * 0.3, 1.6, 0.02)); for (let k = 0; k < 6; k++) put(acc, m, 'bamboo', box(0.035, 0.55, 0.04, W * 0.3 - 0.45 + k * 0.18, 1.6, 0.05)); }
  acc.add('engawa', boxB(W - 0.2, 0.06, 0.55, 0, 0.42, -D / 2 + 0.42)); for (const x of xs) acc.add('frame', boxB(0.08, 0.32, 0.45, x, 0.1, -D / 2 + 0.42)); acc.plat({ x: 0, z: -D / 2 + 0.42, w: W - 0.2, d: 0.55, top: 0.48 });
  acc.add('frame', boxB(W + 0.3, 0.16, 0.16, 0, H - 0.05, D / 2)); acc.add('frame', boxB(W + 0.3, 0.16, 0.16, 0, H - 0.05, -D / 2));
  const ov = spec.over, ez = D / 2 + ov, pf = roofProfileJ(ez, [[ov, 0.6], 0.95], 6), yE = H + 0.3 - pf.P(ov);
  const R = jpRoof(acc, { ex: W / 2 + ov, ez, yE, prof: pf, ends: ['hip', 'hip'], K: KT, rib: 1e6, thick: 0.38, hipW: 0.32, hipOni: false, ridgeH: 0.4, ridgeW: 0.6, soffit: ov, lift: 0 });
  for (let i = 0; i < 6; i++) { const g = lathe([[0.36, 0], [0.38, 0.05], [0.32, 0.1], [0.001, 0.1]], -W / 2 + 0.6 + i * (W - 1.2) / 5, 0, D / 2 + ov + 0.4 + (i % 2) * 0.35, 9); g.scale(1.2, 1, 0.8); acc.add('stoneC', g); } // đá bước
  return { acc, info: { W, D, PW: W + 2 * ov, PD: D + 2 * ov + 1.0, ph: 0.1, top: R.top, eave: yE, kind: 'koshikake' } };
}
