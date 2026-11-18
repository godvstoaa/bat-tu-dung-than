// ============================================================================
//  BỘ DỰNG KIẾN TRÚC MUGHAL – BA TƯ (quần thể Taj Mahal) theo LOẠI HÌNH — docs/tienphu-nghiencuu/09-mughal.md.
//  tower  : Lăng Taj (Rauza) làm vỏ lầu 10 tầng — bệ cẩm thạch, thân vuông vát góc, 4 pishtaq, trống cao, vòm bầu đôi vỏ,
//           4 chhatri mái, 4 minaret tách rời ở góc bệ.
//  gate   : Đại Môn (Darwaza-i Rauza)      · masjid : Masjid / Jawab (3 vòm, pishtaq giữa, tháp góc)
//  court  : Khawasspura (sân 4 cánh hiên vòm nhiều múi) · naubat : Naubat Khana (2 tầng + chhatri)
//  octTomb: Saheli Burj (lăng bát giác 1 vòm) · burj : tháp-đình bát giác + chhatri · chhatri · baradari (12 cửa)
//  Mọi hàm trả { acc, info }. Quy ước: gốc = tâm mặt bằng trên đất, +z = mặt tiền.
// ============================================================================
import { Acc, box, boxB } from './kit.js';
import {
  S, Face, wall, frame, spandrel, archRib, archDress, archCurve, extXY, slabXZ, oct, lathe2, edgeBox, ngon, chhajja, parapet,
  shahCol, guldasta, bulbProf, lotusFinial, profR, chhatri, minaret, iwanVault, finishUV,
} from './mg-kit.js';

// ---------------------------------------------------------------- bộ khoá vật liệu theo thứ bậc màu (Koch: chỉ lăng trắng toàn phần)
export const KR = { wall: 'red', frame: 'inlay', band: 'callig', spand: 'pdura', spand2: 'red', shade: 'shadeR', jali: 'jaliR', vault: 'tileVaultR', dado: 'red', trim: 'red', guld: 'zigzag', bud: 'inlay', dome: 'domeW', floor: 'pave', base: 'redDk' };
export const KW = { wall: 'marble', frame: 'black', band: 'callig', spand: 'pdura', spand2: 'marble', shade: 'shade', jali: 'jali', vault: 'tileVault', dado: 'dado', trim: 'marble', guld: 'marble', bud: 'marble', dome: 'domeW', floor: 'paveW', base: 'marble' };
const chKeys = (K, dome = K.dome) => ({ body: K.trim, dome, frame: K.trim, panel: K.frame, gold: 'gold' });

// ---------------------------------------------------------------- bậc thang (mỗi bậc một mặt đi được)
function steps(acc, key, { x, z, nx, nz, w, h, tread = 0.34 }) {
  const n = Math.max(2, Math.round(h / 0.16)), rise = h / n, ry = Math.atan2(nx, nz);
  for (let i = 0; i < n; i++) {
    const dist = tread * (n - i - 0.5), cx = x + nx * dist, cz = z + nz * dist, top = rise * (i + 1);
    acc.add(key, box(w, top, tread + 0.01, cx, top / 2, cz, ry)); acc.plat({ x: cx, z: cz, w, d: tread + 0.02, ry, top });
  }
  for (const sd of [-1, 1]) { const ox = nz * sd * (w / 2 + 0.3), oz = -nx * sd * (w / 2 + 0.3); acc.add(key, box(0.6, h * 0.55, n * tread, x + ox + nx * (n * tread) / 2, h * 0.275, z + oz + nz * (n * tread) / 2, ry)); }
  return n * tread;
}
/** nền chữ nhật: khối + gờ mép + mặt lát; khai mặt đi được */
function plinthBox(acc, K, W, D, h, x = 0, z = 0) {
  acc.add(K.base, boxB(W, h - 0.15, D, x, 0, z)); acc.add(K.trim, boxB(W + 0.12, 0.15, D + 0.12, x, h - 0.15, z));
  acc.add(K.floor, boxB(W - 0.4, 0.02, D - 0.4, x, h, z)); acc.plat({ x, z, w: W, d: D, top: h });
}

// ---------------------------------------------------------------- PISHTAQ: khung chữ nhật nhô cao + vòm nhọn bốn tâm + hốc iwan nửa bát giác 2 tầng
/**
 * trên mặt F (z = 0 là mặt ngoài): w rộng khung, y0 sàn, top đỉnh khung, ow / apex / rise lỗ vòm (apex tính từ y0),
 * depth sâu hốc, ledge cao gờ phân tầng (từ y0), door { w } cửa ở mặt hậu hốc, gH cao guldasta trên đỉnh khung
 */
export function pishtaq(F, K, o) {
  const { w, y0, top, ow, apex, rise, t = 1.2, depth: D, ledge } = o, hs = apex - rise, s = ow / 2;
  wall(F, K.wall, { x0: -w / 2, x1: w / 2, y0, y1: top, t, ops: [{ cx: 0, y: y0, w: ow, hs, rise, kind: 'open' }], shade: K.shade });
  // khung: viền ngoài · dải thư pháp chữ U ngược · spandrel pietra dura · gờ vòm · hàng ô panel trên dải
  const g = Math.max(0.15, ow * 0.035), bb = o.band ?? Math.max(0.45, w * 0.05), yB = y0 + apex + g, dadoH = o.dadoH ?? Math.min(1.2, apex * 0.06);
  frame(F, K.frame, -w / 2, w / 2, y0, top, Math.max(0.18, w * 0.012), 0.08);
  frame(F, K.band, -s - g - bb, s + g + bb, y0 + dadoH, yB + bb, bb, 0.05);
  spandrel(F, K.spand, 0, y0 + hs, ow, rise, -s - g, s + g, yB, 0.03);
  archRib(F, K.frame, 0, y0 + hs, ow, rise, 0, Math.max(0.12, ow * 0.012));
  const yP0 = yB + bb + 0.35, yP1 = top - 0.45;
  if (yP1 - yP0 > 0.8) { const n = Math.max(3, Math.round(w / 2.6)), pw = (w - 0.8) / n; for (let i = 0; i < n; i++) { const x = -w / 2 + 0.4 + pw * (i + 0.5); frame(F, K.frame, x - pw * 0.42, x + pw * 0.42, yP0, yP1, Math.max(0.08, pw * 0.07), 0.04, 0, true); archRib(F, K.frame, x, yP0 + (yP1 - yP0) * 0.35, pw * 0.62, (yP1 - yP0) * 0.4, 0.02, 0.07, 3); } }
  for (const sx of [-1, 1]) F.add(K.dado, boxB(w / 2 - s - g - bb - 0.3, dadoH, 0.05, sx * (s + g + bb + (w / 2 - s - g - bb) / 2), y0, 0.025));
  // guldasta kẹp khung: thân gắn dọc mép khung + tháp nhọn trên đỉnh
  if (o.gH) { const gd = o.gd ?? Math.max(0.6, w * 0.035); for (const sx of [-1, 1]) { const p = F.pt(sx * (w / 2 + gd * 0.15), y0, gd * 0.2); F.acc.add(K.guld, oct([[0.001, 0], [gd / 2, 0], [gd / 2, top - y0], [0.001, top - y0]], p.x, y0, p.z)); guldasta(F.acc, K.guld, p.x, top, p.z, o.gH, gd, K.bud); } }
  // hốc iwan: 5 mặt nửa bát giác (2 tầng hốc vòm mỗi mặt) + vòm lưới phủ + sàn
  const b = 0.414 * s, k = Math.max(0.3, D - (s - b)), P = [[s, 0], [s, -k], [b, -D], [-b, -D], [-s, -k], [-s, 0]], tf = 0.8;
  for (let i = 0; i < 5; i++) {
    const [ax, az] = P[i], [bx, bz] = P[i + 1], L = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / L, dz = (bz - az) / L;
    const Ff = F.sub((ax + bx) / 2, 0, (az + bz) / 2, dz, -dx), back = i === 2, ww = Math.min(L * 0.62, 5.5), r = ww * 0.5, ops = [];
    if (back && o.door) { const dw = Math.max(2.4, o.door.w); ops.push({ cx: 0, y: y0, w: dw, hs: Math.max(1.6, Math.min(ledge - 0.9, (o.door.h ?? 99)) - dw * 0.5), rise: dw * 0.5, kind: o.door.kind || 'open' }); }
    else ops.push({ cx: 0, y: y0 + dadoH, w: ww, hs: ledge - 0.7 - dadoH - r, rise: r, kind: 'niche', d: 0.9, back: back ? K.jali : K.shade });
    const yu = y0 + ledge + 0.6, ytop = y0 + hs - 0.4, uw = Math.min(ww, (ytop - yu) * 0.9);
    if (ytop - yu > 1.2) ops.push({ cx: 0, y: yu, w: uw, hs: Math.max(0.3, ytop - yu - uw * 0.5), rise: uw * 0.5, kind: back ? 'jali' : 'niche', d: back ? 0.4 : 0.8, back: back ? K.jali : K.shade });
    wall(Ff, K.wall, { x0: -L / 2 - tf * 0.42, x1: L / 2 + tf * 0.42, y0, y1: y0 + hs, t: tf, ops, shade: K.shade });
    for (const op of ops) archDress(Ff, op, { frame: K.frame, spand: K.spand2 });
    Ff.add(K.frame, boxB(L, 0.28, 0.22, 0, y0 + ledge, 0.11));
  }
  F.add(K.floor, slabXZ(P, y0 + 0.02, 0.2));
  const Pd = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const [ax, az] = P[i], [bx, bz] = P[i + 1]; Pd.push([ax + ((bx - ax) * j) / 3, az + ((bz - az) * j) / 3]); } Pd.push(P[5]);
  iwanVault(F, K.vault, Pd, y0 + hs, s, rise);
  // khối xây sau khung: trên vòm + hai trụ bên hốc
  const dd = D + tf - t;
  F.add(K.wall, boxB(w - 0.02, top - (y0 + apex) - 0.05, dd, 0, y0 + apex + 0.05, -t - dd / 2));
  for (const sx of [-1, 1]) F.add(K.wall, boxB(w / 2 - s - 0.05, top - y0, dd, sx * (s + 0.05 + (w / 2 - s - 0.05) / 2), y0, -t - dd / 2));
  return { depth: D + tf };
}

/** ô 2 tầng hốc vòm chồng nhau (cánh hai bên pishtaq, mặt vát) — x0..x1, y0..y1, gờ phân tầng split */
export function twoTier(F, K, { x0, x1, y0, y1, split, t = 0.9, d = 1.6, lower = 'niche', upper = 'niche', dado = 0.8, cusps = 0, backL, backU, wf = 0.62, dress = true }) {
  const bw = x1 - x0, cx = (x0 + x1) / 2, m = Math.max(0.35, bw * 0.1), ops = [];
  const add = (yl, yt, kind, back) => { const w = Math.min(bw * wf, (yt - yl) * 0.62), r = w * 0.5; ops.push({ cx, y: yl, w, hs: Math.max(0.2, yt - yl - r), rise: r, kind, d: kind === 'jali' ? 0.4 : d, back, cusps }); };
  const ylo = lower === 'open' || lower === 'door' ? y0 : y0 + dado;
  add(ylo, split - m, lower, backL || (lower === 'jali' ? K.jali : K.shade));
  if (upper) add(split + m * 0.6, y1 - m, upper, backU || (upper === 'jali' ? K.jali : K.shade));
  wall(F, K.wall, { x0, x1, y0, y1, t, ops, shade: K.shade });
  if (dress) for (const op of ops) archDress(F, op, { frame: K.frame, spand: K.spand });
  F.add(K.frame, boxB(bw, 0.24, 0.16, cx, split - 0.12, 0.08));
  if (lower !== 'open' && lower !== 'door' && dado > 0.3) F.add(K.dado, boxB(bw - 0.3, dado, 0.04, cx, y0, 0.02));
  frame(F, K.frame, x0, x1, y0, y1, 0.12, 0.05);
}

/** tháp góc bát giác: thân khối đặc có panel nổi (3 tầng ô vòm mù) + chhajja + chhatri đỉnh (Đại Môn, Masjid) */
function octTurret(acc, K, { x, z, a, y0, h, chh, tiers = 3, dome = K.dome, out = [Math.sign(x), Math.sign(z)] }) {
  acc.add(K.wall, oct([[0.001, 0], [a + 0.12, 0], [a + 0.12, 0.6], [a, 0.7], [a, h], [0.001, h]], x, y0, z));
  const side = 2 * a * Math.tan(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const t = (2 * Math.PI * k) / 8, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, x + nx * a, 0, z + nz * a, nx, nz), pw = side * 0.72, th = (h - 1.2) / tiers;
    if (nx * out[0] + nz * out[1] < -0.2) continue;   // mặt quay vào khối nhà: khuất
    for (let i = 0; i < tiers; i++) { const yb = y0 + 0.9 + i * th, yt = yb + th - 0.35; frame(F, K.frame, -pw / 2, pw / 2, yb, yt, Math.max(0.07, pw * 0.06), 0.04, 0, true); archRib(F, K.frame, 0, yb + (yt - yb) * 0.55, pw * 0.66, (yt - yb) * 0.3, 0.02, 0.08, 0); }
  }
  chhajja(acc, K.trim, ngon(8, a, x, z), y0 + h, Math.max(0.5, a * 0.2), { step: 0.9 });
  return chhatri(acc, { x, y: y0 + h + 0.05, z, ...chh, keys: chKeys(K, dome) });
}

/** trống thấp + vòm bầu + sen + finial (nhà phụ: Masjid / Jawab / lăng phụ) */
function domeOn(acc, K, { x, z, y, rd, hd, rn, R, H, fin, key = K.dome, drumKey = 'drumKey' }) {
  acc.add(K.trim, lathe2([[0.001, 0], [rd + 0.35, 0], [rd + 0.35, 0.4], [rd, 0.5], [0.001, 0.5]], 32, 0, x, y, z));
  acc.add(drumKey, lathe2([[0.001, 0], [rd, 0], [rd, hd], [0.001, hd]], 32, 0, x, y + 0.5, z));
  acc.add(K.trim, lathe2([[0.001, 0], [rd + 0.05, 0], [rd + 0.3, 0.25], [rd + 0.3, 0.45], [0.001, 0.45]], 32, 0, x, y + 0.5 + hd, z));
  const yb = y + 0.95 + hd, bp = bulbProf(rn, R, H, { mx: 0.3, rTop: R * 0.1 }); acc.add(key, lathe2(bulbProf(rn, R, H, { mx: 0.3, rTop: R * 0.1, shell: Math.max(0.35, R * 0.05) }), 32, 0, x, yb, z));
  return lotusFinial(acc, { x, y: yb + H * 0.975, z, rCap: profR(bp, H * 0.975), rAt: (yy) => profR(bp, yy - yb), petalL: R * 0.4, n: 16, fin, keyPetal: key });
}

// ============================================================================ LĂNG (lầu 10 tầng)
/** ts = towerSpec(bản ghi đè mughal) — tầng 0 trong bệ, tầng 1 = mặt bệ, tầng 6 = sân mái, tầng 6–9 trong trống / vòm đôi vỏ */
export function mgTomb(ts) {
  const acc = new Acc(), K = KW, P = ts.podium, F0 = ts.floors, yP = P.y, y1 = F0[1].y, yR = F0[6].y;
  const PL = F0[0].a + 0.3, B = 28.45 * S, cut = 6.6 * S, pa = P.a;
  // ---- thềm sa thạch đỏ (podium game) + bậc trước + lan can mép
  acc.add('redDk', boxB(2 * pa, yP - 0.1, 2 * pa, 0, 0, 0)); acc.add('pave', boxB(2 * pa, 0.1, 2 * pa, 0, yP - 0.1, 0)); acc.plat({ x: 0, z: 0, w: 2 * pa, d: 2 * pa, top: yP });
  for (let i = 1; i <= P.steps; i++) { const z = pa + P.run - (i - 0.5) * P.tread; acc.add('redDk', boxB(P.stairW, i * P.rise, P.tread + 0.01, 0, 0, z)); acc.plat({ x: 0, z, w: P.stairW, d: P.tread + 0.02, top: i * P.rise }); }
  const sw = P.stairW / 2 + 0.2, pe = pa - 0.25;
  parapet(acc, 'red', [[-sw, pe], [-pe, pe], [-pe, -pe], [pe, -pe], [pe, pe], [sw, pe]], yP, 1.1, 0.4, { panel: 'jaliR', closed: false });
  // ---- bệ cẩm thạch (cao 5 m trên thềm): 4 mặt chuỗi ô vòm mù nhiều múi + cửa tầng 0 giữa mặt trước + gờ đỉnh
  const hP = y1 - yP, nA = 21, sp = (2 * PL) / nA;
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * PL, 0, nz * PL, nx, nz), L = k % 2 ? PL - 1.6 : PL;
    const ops = [];
    for (let i = 0; i < nA; i++) { const cx = -PL + sp * (i + 0.5); if (Math.abs(cx) > L - sp * 0.4) continue; const door = k === 0 && i === (nA - 1) / 2; ops.push(door ? { cx, y: yP, w: 3.0, hs: 2.4, rise: 1.4, kind: 'open', cusps: 7 } : { cx, y: yP + 0.55, w: sp * 0.62, hs: hP - 0.55 - 1.15 - sp * 0.31, rise: sp * 0.31, kind: 'blind', d: 0.35, cusps: 7, back: 'shade' }); }
    wall(F, 'marble', { x0: -L, x1: L, y0: yP, y1: y1 - 0.5, t: 1.6, ops });
    for (const op of ops) archDress(F, op, { frame: 'inlay', spand: 'marble' });
    F.add('marble', boxB(2 * L, 0.35, 0.3, 0, yP, 0.15));
  }
  acc.add('marble', boxB(2 * PL + 0.5, 0.2, 2 * PL + 0.5, 0, y1 - 0.5, 0)); acc.add('marble', boxB(2 * PL + 0.8, 0.12, 2 * PL + 0.8, 0, y1 - 0.3, 0));
  acc.add('paveW', boxB(2 * PL + 0.3, 0.18, 2 * PL + 0.3, 0, y1 - 0.18, 0));
  // ---- 4 minaret tách rời ở góc bệ (cao 43,02 × S, Ø 5,65 × S)
  const mz = PL - 3.9;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) minaret(acc, { x: sx * mz, y: y1, z: sz * mz, H: 43.02 * S, D: 5.65 * S, keys: { base: 'marble', shaft: 'marbleBlk', trim: 'marble', rail: 'marble', chhatri: { body: 'marble', dome: 'domeW', frame: 'marble', panel: 'black', gold: 'gold' } } });
  // ---- thân lăng: vuông vát góc; 4 mặt chính = pishtaq + 2 ô 2 tầng mỗi bên; 4 mặt vát = 2 tầng hốc
  const wP = 22.7 * S, ow = 13.85 * S, apex = 20.6 * S, rise = ow * 0.5, D = B - F0[1].a - 0.3, ledge = 9.2 * S, topP = y1 + 27 * S;
  const xs = B - cut;
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * B, 0, nz * B, nx, nz);
    pishtaq(F, K, { w: wP, y0: y1, top: topP, ow, apex, rise, t: 1.4, depth: D, ledge, door: { w: 3.2 }, gH: 33 * S - 27 * S, gd: 1.0, band: 1.3 });
    for (const sx of [-1, 1]) twoTier(F, K, { x0: sx > 0 ? wP / 2 : -xs, x1: sx > 0 ? xs : -wP / 2, y0: y1, y1: yR, split: y1 + 12.4, t: 1.0, d: 2.4, lower: 'niche', upper: 'niche', backL: 'jali', backU: 'jali', dado: 1.0 });
  }
  const cl = cut * Math.SQRT2, d0 = (2 * B - cut) / 2;
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
    const Fc = Face.at(acc, sx * d0, 0, sz * d0, sx, sz);
    twoTier(Fc, K, { x0: -cl / 2, x1: cl / 2, y0: y1, y1: yR, split: y1 + 12.4, t: 1.0, d: 2.0, lower: 'niche', upper: 'niche', backL: 'jali', backU: 'jali', dado: 1.0 });
  }
  const body = [[xs, B], [B, xs], [B, -xs], [xs, -B], [-xs, -B], [-B, -xs], [-B, xs], [-xs, B]].reverse();
  // guldasta ở 8 góc khung (giao mặt chính – mặt vát)
  for (const [x, z] of body) { acc.add('marble', oct([[0.001, 0], [0.55, 0], [0.55, yR + 1.1 - y1], [0.001, yR + 1.1 - y1]], x, y1, z)); guldasta(acc, 'marble', x, yR + 1.1, z, 5.6, 1.1, 'marble'); }
  // diềm mái + lan can mái (ô panel) + sân mái
  chhajja(acc, 'marble', body, yR - 0.15, 0.45, { drop: 0.15, th: 0.25, step: 1.6 });
  parapet(acc, 'marble', body.map(([x, z]) => [x * 0.985, z * 0.985]), yR, 1.1, 0.5, { panel: 'shade' });
  const ring32 = (r) => Array.from({ length: 32 }, (_, i) => { const t = (2 * Math.PI * i) / 32; return [Math.sin(t) * r, Math.cos(t) * r]; });
  acc.add('paveW', slabXZ(body, yR - 0.03, 0.6, [ring32(12.4)]));
  // lan can đa giác sàn mái (đúng va chạm game: tầng 6 có hành lang, apothem slabA − 0,15) — dạng jali thấp
  parapet(acc, 'marble', ngon(8, F0[6].slabA - 0.15), yR, 1.1, 0.25, { panel: 'jali' });
  // ---- 4 chhatri mái ở 4 góc chéo quanh trống (ngang chhajja 9,5 × S, vòm Ø 8 × S, cao 14 × S)
  const cc = 17 * S;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) chhatri(acc, { x: sx * cc, y: yR, z: sz * cc, a: 4.75 * S, ph: 4 * S, base: 1.0, dome: { R: 4 * S, H: 5.3 * S }, keys: { body: 'marble', dome: 'domeW', frame: 'marble', panel: 'black', gold: 'gold' } });
  // ---- trống cao 12 × S (Ø ngoài 24,5 × S): vỏ hở 2 cửa (tầng 6 có hành lang: cửa trước / sau), 16 ô vòm mù (8 ô jali — lệch nhỏ), dải thư pháp
  const Ro = 12.25 * S, Ri = Ro - 0.6, yD = yR + 12 * S, gap = 3.6 / Ro;
  for (const p0 of [gap / 2, Math.PI + gap / 2]) {
    acc.add('marble', lathe2([[Ri, 0], [Ro, 0], [Ro, yD - yR], [Ri, yD - yR], [Ri, 0]], 28, p0, 0, yR, 0, false, Math.PI - gap));
    for (const e of [p0, p0 + Math.PI - gap]) acc.add('marble', box(0.25, yD - yR, Ro - Ri, Math.sin(e) * (Ri + Ro) / 2, (yR + yD) / 2, Math.cos(e) * (Ri + Ro) / 2, e + Math.PI / 2));
  }
  for (const sz of [1, -1]) {
    const F = Face.at(acc, 0, 0, sz * (Ro - 0.12), 0, sz);
    wall(F, 'marble', { x0: -1.95, x1: 1.95, y0: yR, y1: yD, t: 0.5, ops: [{ cx: 0, y: yR, w: 2.8, hs: 2.4, rise: 1.3, kind: 'open', cusps: 5 }] });
    archDress(F, { cx: 0, y: yR, w: 2.8, hs: 2.4, rise: 1.3 }, { frame: 'black', spand: 'pdura' });
  }
  acc.add('marble', lathe2([[Ro - 0.2, 0], [Ro + 0.4, 0], [Ro + 0.4, 0.5], [Ro + 0.1, 0.8], [Ro - 0.2, 0.8], [Ro - 0.2, 0]], 64, 0, 0, yR, 0));
  acc.add('callig', lathe2([[Ro - 0.1, 0], [Ro + 0.06, 0], [Ro + 0.06, 1.5], [Ro - 0.1, 1.5], [Ro - 0.1, 0]], 64, 0, 0, yD - 3.0, 0));
  acc.add('marble', lathe2([[Ro - 0.1, 0], [Ro + 0.2, 0], [Ro + 0.45, 0.35], [Ro + 0.45, 0.6], [Ro - 0.1, 0.6], [Ro - 0.1, 0]], 64, 0, 0, yD - 0.6, 0));
  for (let i = 0; i < 16; i++) {
    const phi = ((i + 0.5) * 2 * Math.PI) / 16, nx = Math.sin(phi), nz = Math.cos(phi), F = Face.at(acc, nx * Ro, 0, nz * Ro, nx, nz), w = 2.9, ys = yR + 1.6;
    const poly = [[-w / 2, ys], [w / 2, ys], [w / 2, ys + 5.0], ...archCurve(0, ys + 5.0, w / 2, 1.6).slice(1, -1), [-w / 2, ys + 5.0]];
    const g = extXY(poly, [], 0.14); g.translate(0, 0, 0.1); F.add(i % 2 ? 'jali' : 'shade', g);
    archRib(F, 'black', 0, ys + 5.0, w, 1.6, 0.08, 0.14); frame(F, 'black', -w / 2 - 0.35, w / 2 + 0.35, ys - 0.3, ys + 7.2, 0.12, 0.12);
  }
  // ---- vòm bầu đôi vỏ (vỏ ngoài 0,5 m — lòng rỗng chứa tầng 7–10): cổ 12,15 × S → phình 13,75 × S, cao (tới chân sen) 22,6 × S
  const Hb = 22.6 * S, bp = bulbProf(Ro - 0.07, 13.75 * S, Hb, { mx: 0.3, rTop: 0.6 }), bo = bp.slice(1, -1);
  acc.add('domeW', lathe2(bulbProf(Ro - 0.07, 13.75 * S, Hb, { mx: 0.3, rTop: 0.6, shell: 0.5 }), 64, 0, 0, yD, 0));
  const yl = Hb * 0.982, top = lotusFinial(acc, { x: 0, y: yD + yl, z: 0, rCap: profR(bo, yl), rAt: (yy) => profR(bo, yy - yD), petalL: 5.0, n: 20, fin: 9.6 * S, keyPetal: 'domeW' });
  finishUV(acc);
  return { acc, info: { W: 2 * pa, D: 2 * pa, PW: 2 * pa, PD: 2 * pa + P.run, ph: y1, podium: yP, eave: yR, top, n: ts.n, floors: ts.floors.length, kind: 'tower', plinth: 2 * PL, body: 2 * B, drum: yD } };
}

// ============================================================================ ĐẠI MÔN (Darwaza-i Rauza)
export function mgGate(sp) {
  const acc = new Acc(), K = KR, W = sp.W, D = sp.D, ph = sp.plinth, ta = sp.ta, eave = sp.eave, fTop = sp.frameTop, aTop = sp.arcadeTop;
  const tx = W / 2 - ta, tz = D / 2 - ta, side = ta * Math.tan(Math.PI / 8);
  plinthBox(acc, K, W + 1.6, D + 1.6, ph);
  for (const sz of [1, -1]) steps(acc, 'redDk', { x: 0, z: sz * (D / 2 + 0.8), nx: 0, nz: sz, w: sp.ow, h: ph });
  acc.add('pave', boxB(W - 2, 0.04, D - 2, 0, ph, 0));
  const xw = tx - side;              // mép cánh giáp tháp góc
  for (const sz of [1, -1]) {
    const F = Face.at(acc, 0, 0, sz * D / 2, 0, sz);
    pishtaq(F, K, { w: sp.wP, y0: ph, top: fTop, ow: sp.ow, apex: sp.apex, rise: sp.ow * 0.48, t: 1.4, depth: sp.iwanD, ledge: sp.ledge, door: { w: 3.6 }, gH: sp.guldTop - fTop, gd: 1.0, band: 1.0 });
    for (const sx of [-1, 1]) twoTier(F, K, { x0: sx > 0 ? sp.wP / 2 : -xw - 0.3, x1: sx > 0 ? xw + 0.3 : -sp.wP / 2, y0: ph, y1: eave - 0.4, split: ph + (eave - ph) * 0.5, t: 1.0, d: 1.8, lower: 'niche', upper: 'niche', backL: 'door', backU: 'jaliR', dado: 0.9 });
    // dãy 11 vòm cuốn nhỏ + chhajja + 11 chhatri trắng trên đỉnh pishtaq
    const n = 11, L = sp.chRow, pw = L / n, yA = fTop;
    const ops = []; for (let i = 0; i < n; i++) ops.push({ cx: -L / 2 + pw * (i + 0.5), y: yA + 0.3, w: pw * 0.66, hs: (aTop - yA) - 0.3 - 0.5 - pw * 0.33, rise: pw * 0.33, kind: 'niche', d: 0.6, cusps: 3 });
    wall(F, K.wall, { x0: -sp.wP / 2, x1: sp.wP / 2, y0: yA, y1: aTop, t: 1.4, ops, shade: K.shade });
    for (const op of ops) archRib(F, K.frame, op.cx, op.y + op.hs, op.w, op.rise, 0, 0.08, 0);
    F.add(K.wall, boxB(sp.wP, aTop - yA, 3.0, 0, yA, -2.9));
    const cpts = [[-sp.wP / 2, 0.3], [sp.wP / 2, 0.3], [sp.wP / 2, -4.4], [-sp.wP / 2, -4.4]].map(([x, z]) => { const p = F.pt(x, 0, z); return [p.x, p.z]; });
    chhajja(acc, K.trim, sz > 0 ? cpts.reverse() : cpts, aTop, 0.55, { step: 1.0 });
    for (let i = 0; i < n; i++) { const p = F.pt(-L / 2 + pw * (i + 0.5), 0, -0.6); chhatri(acc, { x: p.x, y: aTop + 0.05, z: p.z, a: pw * 0.5, ph: 2.0, base: 0.25, dome: { R: 1.35 * S / 2, H: 1.5 }, keys: chKeys(K) }); }
  }
  for (const sx of [1, -1]) {
    const F = Face.at(acc, sx * W / 2, 0, 0, sx, 0), zw = tz - side + 0.3, c = 4.8;
    twoTier(F, K, { x0: -zw, x1: -c, y0: ph, y1: eave - 0.4, split: ph + (eave - ph) * 0.5, t: 1.0, lower: 'niche', upper: 'niche', backL: 'jaliR', backU: 'jaliR' });
    twoTier(F, K, { x0: c, x1: zw, y0: ph, y1: eave - 0.4, split: ph + (eave - ph) * 0.5, t: 1.0, lower: 'niche', upper: 'niche', backL: 'jaliR', backU: 'jaliR' });
    twoTier(F, K, { x0: -c, x1: c, y0: ph, y1: eave - 0.4, split: eave - 4.2, t: 1.0, lower: 'niche', upper: 'jali', backL: 'jaliR', wf: 0.72 });
  }
  // mái bằng + lan can (ô panel) trên hai cánh; tháp góc bát giác đội chhatri
  const roof = [[xw + 0.3, D / 2], [W / 2, tz - side + 0.3], [W / 2, -(tz - side + 0.3)], [xw + 0.3, -D / 2], [-(xw + 0.3), -D / 2], [-W / 2, -(tz - side + 0.3)], [-W / 2, tz - side + 0.3], [-(xw + 0.3), D / 2]].reverse();
  acc.add(K.wall, slabXZ(roof, eave - 0.4, 0.5)); acc.add(K.floor, slabXZ(roof.map(([x, z]) => [x * 0.99, z * 0.99]), eave - 0.38, 0.04));
  chhajja(acc, K.trim, roof, eave - 0.45, 0.6, { step: 1.1 });
  parapet(acc, K.wall, roof.map(([x, z]) => [x * 0.985, z * 0.985]), eave - 0.4, 1.0, 0.45, { panel: K.frame });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) octTurret(acc, K, { x: sx * tx, z: sz * tz, a: ta, y0: ph, h: aTop - ph - 0.2, chh: { a: sp.turretChh, ph: 2.4, base: 0.4, dome: { R: 3.5 * S / 2, H: 2.5 } }, tiers: 2 });
  // nội thất: sảnh bát giác giữa (4 cửa trục) + tiền sảnh nối hai iwan; sàn
  const ha = sp.hall, hh = eave - 2.5;
  for (let k = 0; k < 8; k++) {
    const t = (2 * Math.PI * k) / 8, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * ha, 0, nz * ha, -nx, -nz), L = 2 * ha * Math.tan(Math.PI / 8) + 0.6;
    wall(F, K.wall, { x0: -L / 2, x1: L / 2, y0: ph, y1: hh, t: 0.8, z0: 0.8, ops: k % 2 ? [] : [{ cx: 0, y: ph, w: 3.6, hs: 6.5, rise: 1.8, kind: 'open' }], shade: K.shade });
  }
  for (const sz of [1, -1]) for (const sx of [-1, 1]) acc.add(K.wall, boxB(0.8, hh - ph, D / 2 - sp.iwanD - 1.2 - ha, sx * 2.6, ph, sz * (ha + (D / 2 - sp.iwanD - 1.2 - ha) / 2)));
  acc.add(K.wall, slabXZ(ngon(8, ha + 0.4), hh + 0.4, 0.4));
  // vách ngăn cánh (giữa trục trung tâm và dãy phòng hai bên), cửa giữa
  const zp = D / 2 - sp.iwanD - 2.2;
  for (const sx of [-1, 1]) { const Fp = Face.at(acc, sx * sp.wP / 2, 0, 0, sx, 0); wall(Fp, K.wall, { x0: -zp, x1: zp, y0: ph, y1: eave - 0.4, t: 0.8, z0: 0.4, ops: [{ cx: 0, y: ph, w: 2.4, hs: 3.0, rise: 1.2, kind: 'open' }], shade: K.shade }); }
  finishUV(acc);
  return { acc, info: { W, D, PW: W + 1.6, PD: D + 1.6 + 2 * Math.round(ph / 0.16) * 0.34, ph, eave, top: sp.guldTop, kind: 'gate' } };
}

// ============================================================================ MASJID / JAWAB
export function mgMasjid(sp) {
  const acc = new Acc(), K = KR, W = sp.W, D = sp.D, ph = sp.plinth, ta = sp.ta, eave = sp.eave, yRoof = eave - 1.1;
  const tx = W / 2 - ta, tz = D / 2 - ta, side = ta * Math.tan(Math.PI / 8), xw = tx - side, zw = tz - side;
  plinthBox(acc, K, W + 1.4, D + 1.4, ph);
  steps(acc, 'redDk', { x: 0, z: D / 2 + 0.7, nx: 0, nz: 1, w: sp.ow, h: ph });
  // mặt tiền: pishtaq giữa + mỗi bên 2 gian (cửa vòm dưới thông vào sảnh + hốc vòm trên)
  const F = Face.at(acc, 0, 0, D / 2, 0, 1);
  pishtaq(F, K, { w: sp.wP, y0: ph, top: sp.pTop, ow: sp.ow, apex: sp.apex, rise: sp.ow * 0.48, t: 1.3, depth: sp.iwanD, ledge: sp.ledge, door: { w: 3.2, h: sp.ledge - 0.6 }, gH: sp.guldTop - sp.pTop, gd: 0.9, band: 0.9 });
  const bw = (xw + 0.3 - sp.wP / 2) / 2;
  for (const sx of [-1, 1]) for (let j = 0; j < 2; j++) {
    const a = sp.wP / 2 + j * bw, b = a + bw, x0 = sx > 0 ? a : -b, x1 = sx > 0 ? b : -a;
    twoTier(F, K, { x0, x1, y0: ph, y1: yRoof, split: ph + (yRoof - ph) * 0.56, t: 1.1, lower: 'open', upper: 'niche', backU: 'jaliR', wf: 0.64 });
    if (j === 0) { const p = F.pt(sx * (sp.wP / 2 + bw), 0, 0.25); acc.add(K.guld, oct([[0.001, 0], [0.38, 0], [0.38, eave - ph], [0.001, eave - ph]], p.x, ph, p.z)); guldasta(acc, K.guld, p.x, eave, p.z, 3.2, 0.76, K.bud); }
  }
  // hậu (tường qibla): panel 2 tầng hốc mù; mihrab nhô ở giữa (chỉ Masjid)
  const Fb = Face.at(acc, 0, 0, -D / 2, 0, -1), nb = 5, bb = (2 * xw + 0.6) / nb;
  for (let i = 0; i < nb; i++) twoTier(Fb, K, { x0: -xw - 0.3 + i * bb, x1: -xw - 0.3 + (i + 1) * bb, y0: ph, y1: yRoof, split: ph + (yRoof - ph) * 0.5, t: 1.1, d: 0.35, lower: 'blind', upper: 'blind', dado: 0.9, dress: true });
  if (sp.mihrab) { acc.add(K.wall, boxB(6.0, 13.5, 2.0, 0, ph, -D / 2 - 1.0)); acc.add(K.trim, boxB(6.4, 0.4, 2.4, 0, ph + 13.5, -D / 2 - 1.0)); const Fm = Face.at(acc, 0, 0, -D / 2 - 2.0, 0, -1); frame(Fm, K.frame, -2.8, 2.8, ph + 0.5, ph + 13.2, 0.18, 0.05, 0, true); archRib(Fm, K.frame, 0, ph + 8.5, 3.6, 2.4, 0.02, 0.14, 0); }
  for (const sx of [1, -1]) { const Fs = Face.at(acc, sx * W / 2, 0, 0, sx, 0); twoTier(Fs, K, { x0: -zw - 0.3, x1: zw + 0.3, y0: ph, y1: yRoof, split: ph + (yRoof - ph) * 0.5, t: 1.1, d: 0.4, lower: 'blind', upper: 'jali', backU: 'jaliR', wf: 0.5 }); }
  // nội thất: 3 gian (vách ngang có vòm lớn), sàn kẻ ô thảm (Masjid) / lát hình học (Jawab)
  for (const sx of [-1, 1]) { const Fi = Face.at(acc, sx * sp.wP / 2, 0, -1.0, sx, 0); wall(Fi, K.wall, { x0: -D / 2 + 1.1, x1: D / 2 - 2.4, y0: ph, y1: yRoof, t: 1.2, z0: 0.6, ops: [{ cx: 0, y: ph, w: 7.0, hs: 9.0, rise: 3.4, kind: 'open', cusps: 9 }], shade: K.shade }); }
  acc.add(sp.mihrab ? 'pave' : 'paveW', boxB(W - 2.4, 0.03, D - 2.4, 0, ph, 0));
  if (sp.mihrab) for (let r = 0; r < 6; r++) acc.add('black', boxB(2 * xw - 3, 0.04, 0.12, 0, ph + 0.01, -D / 2 + 2.4 + r * 2.4));
  const roof = [[xw + 0.3, D / 2], [W / 2, zw + 0.3], [W / 2, -zw - 0.3], [xw + 0.3, -D / 2], [-xw - 0.3, -D / 2], [-W / 2, -zw - 0.3], [-W / 2, zw + 0.3], [-xw - 0.3, D / 2]].reverse();
  acc.add(K.wall, slabXZ(roof, yRoof, 0.6));
  chhajja(acc, K.trim, roof, yRoof - 0.05, 0.65, { step: 1.1 });
  parapet(acc, K.wall, roof.map(([x, z]) => [x * 0.988, z * 0.985]), yRoof, 1.1, 0.4, { panel: 'jaliR' });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) octTurret(acc, K, { x: sx * tx, z: sz * tz, a: ta, y0: ph, h: eave + 1.0 - ph, chh: { a: sp.turretChh, ph: 2.2, base: 0.3, dome: { R: 1.2, H: 1.8 } }, tiers: 4 });
  // 3 vòm bầu trắng trên trống thấp khóa xen trắng-đỏ
  const tc = domeOn(acc, K, { x: 0, z: sp.domeZ, y: yRoof, rd: sp.dC.R * 0.9, hd: 1.6, rn: sp.dC.R * 0.88, R: sp.dC.R, H: sp.dC.H, fin: sp.dC.fin });
  for (const sx of [-1, 1]) domeOn(acc, K, { x: sx * sp.dSx, z: sp.domeZ, y: yRoof, rd: sp.dS.R * 0.9, hd: 1.2, rn: sp.dS.R * 0.88, R: sp.dS.R, H: sp.dS.H, fin: sp.dS.fin });
  finishUV(acc);
  return { acc, info: { W, D, PW: W + 1.4, PD: D + 1.4 + Math.round(ph / 0.16) * 0.34 + (sp.mihrab ? 0 : 0), ph, eave, top: tc, kind: 'masjid' } };
}

// ============================================================================ KHAWASSPURA (sân 4 cánh)
export function mgCourt(sp) {
  const acc = new Acc(), K = KR, W = sp.W, D = sp.D, ph = sp.plinth, dw = sp.wing, vd = sp.veranda, colH = sp.colH, yTop = ph + sp.wallH;
  const cx = W / 2 - dw, cz = D / 2 - dw;
  plinthBox(acc, K, W + 1.2, D + 1.2, ph);
  // tường bao ngoài: hốc vòm mù đều nhịp; cổng (pishtaq nhỏ) giữa mặt bắc (+z, giáp vườn)
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2, nx = Math.sin(t), nz = Math.cos(t), half = k % 2 ? W / 2 : D / 2, L = k % 2 ? D / 2 : W / 2 - 1.0;
    const F = Face.at(acc, nx * half, 0, nz * half, nx, nz), n = Math.round((2 * L) / 3.9), pw = (2 * L) / n, ops = [];
    for (let i = 0; i < n; i++) { const x = -L + pw * (i + 0.5); if (k === 0 && Math.abs(x) < sp.portal.w / 2 + 0.4) continue; ops.push({ cx: x, y: ph + 0.6, w: pw * 0.56, hs: sp.wallH - 2.4 - pw * 0.28, rise: pw * 0.28, kind: 'blind', d: 0.3, cusps: 0 }); }
    wall(F, K.wall, { x0: -L, x1: L, y0: ph, y1: yTop, t: 1.0, ops, shade: K.shade });
    for (const op of ops) { const m = 0.25, bw = 0.12; frame(F, K.frame, op.cx - op.w / 2 - m - bw, op.cx + op.w / 2 + m + bw, op.y, op.y + op.hs + op.rise + m + bw, bw, 0.05); }
    if (k === 0) pishtaq(F, K, { w: sp.portal.w, y0: ph, top: ph + sp.portal.top, ow: sp.portal.ow, apex: sp.portal.apex, rise: sp.portal.ow * 0.5, t: 1.0, depth: sp.portal.d, ledge: sp.portal.apex * 0.55, door: { w: 3.0 }, gH: 2.6, gd: 0.6, band: 0.5 });
  }
  // lối xuyên cánh bắc từ cổng tới hiên
  { const za = cz + vd + 0.7, zb = D / 2 - sp.portal.d - 1.8; for (const sx of [-1, 1]) acc.add(K.wall, boxB(0.8, sp.wallH - 1.0, zb - za, sx * 2.0, ph, (za + zb) / 2)); }
  // hiên vòm nhiều múi quay vào sân + dãy phòng (hujra) sau hiên
  const sides = [{ nx: 0, nz: -1, half: cz, L: cx, n: sp.bx }, { nx: 0, nz: 1, half: cz, L: cx, n: sp.bx }, { nx: -1, nz: 0, half: cx, L: cz, n: sp.bz }, { nx: 1, nz: 0, half: cx, L: cz, n: sp.bz }];
  for (const s of sides) {
    // mặt hướng vào sân: gốc trên mép sân (−n·half), pháp tuyến −n (về tâm)
    const F = Face.at(acc, s.nx * s.half, 0, s.nz * s.half, -s.nx, -s.nz), pw = (2 * s.L) / s.n;
    for (let i = 0; i <= s.n; i++) shahCol(acc, K.wall, ...(() => { const p = F.pt(-s.L + pw * i, ph, -0.45); return [p.x, ph, p.z]; })(), colH, 0.62);
    const ys = ph + colH, rise = Math.min(pw * 0.42, 1.5);
    for (let i = 0; i < s.n; i++) {
      const x = -s.L + pw * (i + 0.5), w = pw - 0.62, c = archCurve(x, ys, w / 2, rise, 7);
      const g = extXY([[x + pw / 2, ys], [x + pw / 2, yTop - 0.7], [x - pw / 2, yTop - 0.7], [x - pw / 2, ys], ...[...c].reverse().slice(1)], [], 0.7); g.translate(0, 0, -0.1); F.add(K.wall, g);
      archRib(F, K.frame, x, ys, w, rise, 0.0, 0.07, 7);
    }
    F.add(K.trim, boxB(2 * s.L + 0.6, 0.35, 0.9, 0, yTop - 0.7, -0.35));
    // tường phòng sau hiên: mỗi gian một cửa vòm + ô jali trên
    const ops = []; for (let i = 0; i < s.n; i++) { const x = -s.L + pw * (i + 0.5); const gate = s.nz === 1 && Math.abs(x) < pw / 2; ops.push(gate ? { cx: x, y: ph, w: 3.0, hs: 2.6, rise: 1.2, kind: 'open' } : { cx: x, y: ph, w: 1.3, hs: 1.8, rise: 0.6, kind: 'door' }); if (!gate && i % 2 === 0) ops.push({ cx: x, y: ph + 3.0, w: 0.9, hs: 0.5, rise: 0.4, kind: 'jali', back: 'jaliR' }); }
    wall(F, K.wall, { x0: -s.L - vd, x1: s.L + vd, y0: ph, y1: yTop - 0.7, t: 0.7, z0: -vd, ops, shade: K.shade });
    // vách ngăn phòng mỗi 2 gian
    for (let i = 0; i <= s.n; i += 2) { const p0 = F.pt(-s.L + pw * i, 0, -vd - 0.7), p1 = F.pt(-s.L + pw * i, 0, -dw + 1.0); if (s.nz === 1 && Math.abs(-s.L + pw * i) < 3) continue; acc.add(K.wall, edgeBox([p0.x, p0.z], [p1.x, p1.z], ph, sp.wallH - 1.0, 0.5)); }
    const cp = [[-s.L - 0.3, 0.35], [s.L + 0.3, 0.35], [s.L + 0.3, -1], [-s.L - 0.3, -1]].map(([x, z]) => { const p = F.pt(x, 0, z); return [p.x, p.z]; });
    const area = cp.reduce((a, p, i) => a + p[0] * cp[(i + 1) % 4][1] - cp[(i + 1) % 4][0] * p[1], 0); chhajja(acc, K.trim, area > 0 ? cp : cp.reverse(), yTop - 0.35, 0.7, { step: 1.0 });
  }
  // mái bằng (khung có lỗ sân) + lan can ngoài và trong
  const outer = [[-W / 2, D / 2], [W / 2, D / 2], [W / 2, -D / 2], [-W / 2, -D / 2]], inner = [[-cx, cz], [cx, cz], [cx, -cz], [-cx, -cz]];
  acc.add(K.wall, slabXZ(outer, yTop, 0.5, [inner.map(([x, z]) => [x * 1.005, z * 1.005])]));
  parapet(acc, K.wall, outer.map(([x, z]) => [x * 0.993, z * 0.992]).reverse(), yTop, 1.0, 0.4, { panel: K.frame });
  parapet(acc, K.wall, inner.map(([x, z]) => [x * 1.01, z * 1.01]).reverse(), yTop, 0.8, 0.3, {});
  // sân trong: charbagh 4 ô cỏ trũng, lối đi nâng (khiyaban) chữ thập, bể nước ở tâm
  acc.add(K.floor, boxB(2 * cx, 0.04, 2 * cz, 0, ph, 0)); acc.plat({ x: 0, z: 0, w: 2 * cx, d: 2 * cz, top: ph });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) acc.add('grass', boxB(cx - 3.5, 0.05, cz - 3.5, sx * (cx / 2 + 0.75), ph - 0.15, sz * (cz / 2 + 0.75)));
  acc.add(K.trim, boxB(3.0, 0.25, 2 * cz - 1, 0, ph, 0)); acc.add(K.trim, boxB(2 * cx - 1, 0.25, 3.0, 0, ph, 0));
  acc.add(K.trim, boxB(6.4, 0.5, 6.4, 0, ph, 0)); acc.add('water', boxB(5.6, 0.04, 5.6, 0, ph + 0.42, 0));
  steps(acc, 'redDk', { x: 0, z: D / 2 + 0.6, nx: 0, nz: 1, w: sp.portal.ow, h: ph });
  finishUV(acc);
  return { acc, info: { W, D, PW: W + 1.2, PD: D + 1.2 + Math.max(2, Math.round(ph / 0.16)) * 0.34, ph, eave: yTop, top: ph + sp.portal.top + 2.6 * 1.0, colH, colD: 0.62, bays: [sp.bx, sp.bz], kind: 'court' } };
}

// ============================================================================ NAUBAT KHANA
export function mgNaubat(sp) {
  const acc = new Acc(), K = KR, W = sp.W, D = sp.D, ph = sp.plinth, y1 = ph + sp.h1, y2 = y1 + 0.5 + sp.h2;
  plinthBox(acc, K, W + 1.0, D + 1.0, ph);
  steps(acc, 'redDk', { x: 0, z: D / 2 + 0.5, nx: 0, nz: 1, w: 4.0, h: ph });
  // tầng dưới: 3 vòm nhiều múi giữa (giữa là cửa, hai bên bịt jali) + panel hai bên
  const F = Face.at(acc, 0, 0, D / 2, 0, 1), aw = sp.aw, ap = aw + 0.9;
  const lo = [-1, 0, 1].map((i) => ({ cx: i * ap, y: i === 0 ? ph : ph + 0.6, w: aw, hs: sp.h1 - 1.0 - aw * 0.5 - (i === 0 ? 0 : 0.6), rise: aw * 0.5, kind: i === 0 ? 'open' : 'jali', back: 'jaliR', cusps: 7 }));
  wall(F, K.wall, { x0: -1.5 * ap - 0.2, x1: 1.5 * ap + 0.2, y0: ph, y1, t: 0.9, ops: lo, shade: K.shade });
  for (const op of lo) archDress(F, op, { frame: K.frame, spand: K.spand2 });
  for (const sx of [-1, 1]) twoTier(F, K, { x0: sx > 0 ? 1.5 * ap + 0.2 : -W / 2, x1: sx > 0 ? W / 2 : -1.5 * ap - 0.2, y0: ph, y1, split: ph + sp.h1 * 0.55, t: 0.9, d: 0.35, lower: 'blind', upper: 'blind', wf: 0.5 });
  // tầng trên: loggia 3 vòm mở trên cột (lùi sâu 2,4 m) + jali hai bên
  const up = [-1, 0, 1].map((i) => ({ cx: i * ap, y: y1 + 0.5, w: aw + 0.2, hs: sp.h2 - 0.9 - (aw + 0.2) * 0.5, rise: (aw + 0.2) * 0.5, kind: 'open', cusps: 7 }));
  wall(F, K.wall, { x0: -1.5 * ap - 0.2, x1: 1.5 * ap + 0.2, y0: y1 + 0.5, y1: y2, t: 0.8, ops: up, shade: K.shade });
  for (const op of up) { archRib(F, K.frame, op.cx, op.y + op.hs, op.w, op.rise, 0, 0.1, 7); }
  for (const x of [-ap / 2, ap / 2, -1.5 * ap, 1.5 * ap]) { const p = F.pt(x, 0, -0.4); shahCol(acc, K.wall, p.x, y1 + 0.5, p.z, sp.h2 - 0.9 - (aw + 0.2) * 0.5, 0.55); }
  const Fl = Face.at(acc, 0, 0, D / 2 - 2.4, 0, 1); wall(Fl, K.wall, { x0: -1.5 * ap, x1: 1.5 * ap, y0: y1 + 0.5, y1: y2, t: 0.6, ops: [{ cx: 0, y: y1 + 0.5, w: 2.0, hs: 2.4, rise: 1.0, kind: 'door' }, { cx: -ap, y: y1 + 1.2, w: 1.6, hs: 1.6, rise: 0.8, kind: 'jali', back: 'jaliR' }, { cx: ap, y: y1 + 1.2, w: 1.6, hs: 1.6, rise: 0.8, kind: 'jali', back: 'jaliR' }], shade: K.shade });
  for (const sx of [-1, 1]) twoTier(F, K, { x0: sx > 0 ? 1.5 * ap + 0.2 : -W / 2, x1: sx > 0 ? W / 2 : -1.5 * ap - 0.2, y0: y1 + 0.5, y1: y2, split: y1 + 0.5 + sp.h2 * 0.5, t: 0.9, d: 0.4, lower: 'jali', upper: 'blind', backL: 'jaliR', wf: 0.5 });
  // hậu + hai hồi: panel 2 tầng hốc mù
  for (const [nx, nz, L] of [[0, -1, W / 2], [1, 0, D / 2], [-1, 0, D / 2]]) {
    const Fs = Face.at(acc, nx * W / 2 + 0 * nz, 0, nz * D / 2, nx, nz), n = Math.max(1, Math.round((2 * L) / 5)), bw = (2 * L) / n;
    for (let i = 0; i < n; i++) for (const [ya, yb] of [[ph, y1], [y1 + 0.5, y2]]) twoTier(Fs, K, { x0: -L + i * bw, x1: -L + (i + 1) * bw, y0: ya, y1: yb, split: (ya + yb) / 2, t: 0.9, d: 0.3, lower: 'blind', upper: null, wf: 0.5, dado: 0.5 });
  }
  const rect = [[-W / 2, D / 2], [W / 2, D / 2], [W / 2, -D / 2], [-W / 2, -D / 2]].reverse();
  acc.add(K.wall, slabXZ(rect, y1 + 0.5, 0.5)); chhajja(acc, K.trim, rect, y1 + 0.4, 0.75, { step: 1.0 });
  acc.add(K.wall, slabXZ(rect, y2 + 0.4, 0.4)); chhajja(acc, K.trim, rect, y2 + 0.3, 0.85, { step: 1.0 });
  parapet(acc, K.wall, rect.map(([x, z]) => [x * 0.985, z * 0.97]), y2 + 0.4, 0.9, 0.35, { panel: K.frame });
  // tường vườn liền hai bên: dãy vòm mù + lỗ châu mai kangura
  for (const sx of [-1, 1]) {
    const L = sp.stub, Fw = Face.at(acc, sx * (W / 2 + L / 2), 0, -D / 2 + 0.6, 0, 1), ops = [];
    for (let i = 0; i < 2; i++) ops.push({ cx: -L / 2 + (L / 2) * (i + 0.5), y: 0.6, w: L * 0.3, hs: sp.stubH - 2.2 - L * 0.15, rise: L * 0.15, kind: 'blind', d: 0.3, cusps: 5 });
    wall(Fw, K.wall, { x0: -L / 2, x1: L / 2, y0: 0, y1: sp.stubH, t: 1.2, ops, shade: K.shade });
    for (const op of ops) archDress(Fw, op, { frame: K.frame, spand: K.wall });
    parapet(acc, K.wall, [[sx * W / 2, -D / 2 + 0.0], [sx * (W / 2 + L), -D / 2 + 0.0]], sp.stubH, 0.3, 1.2, { closed: false, merlon: true });
  }
  // chhatri cẩm thạch trắng 8 cột ở tâm mái
  const top = chhatri(acc, { x: 0, y: y2 + 0.4, z: 0, a: sp.chh.a, ph: sp.chh.ph, base: 0.5, dome: { R: sp.chh.R, H: sp.chh.H }, keys: { body: 'marble', dome: 'domeW', frame: 'marble', panel: 'black', gold: 'gold' } });
  finishUV(acc);
  return { acc, info: { W, D, PW: W + 2 * sp.stub, PD: D + 1.0 + Math.round(ph / 0.16) * 0.34, ph, eave: y2, top, kind: 'naubat', storeys: 2 } };
}

// ============================================================================ LĂNG PHỤ BÁT GIÁC (Saheli Burj)
export function mgOctTomb(sp) {
  const acc = new Acc(), K = KR, Ap = sp.plinthA, hp = sp.plinth, Ab = sp.bodyA, yE = hp + sp.bodyH;
  // bệ bát giác có tầng vòm cuốn (3 vòm / mặt × 8 = 24 vòm) cửa jali + lan can ô
  const sideP = 2 * Ap * Math.tan(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const t = (2 * Math.PI * k) / 8, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * Ap, 0, nz * Ap, nx, nz), L = sideP / 2 + 0.5, pw = sideP / 3;
    const ops = [-1, 0, 1].map((i) => ({ cx: i * pw, y: 0.5, w: pw * 0.62, hs: hp - 1.3 - pw * 0.31, rise: pw * 0.31, kind: 'jali', back: 'jaliR', d: 0.5, cusps: 7 }));
    wall(F, K.wall, { x0: -L, x1: L, y0: 0, y1: hp, t: 1.2, ops, shade: K.shade });
    for (const op of ops) archDress(F, op, { frame: K.frame, spand: K.wall });
  }
  acc.add(K.wall, slabXZ(ngon(8, Ap + 0.25), hp, 0.5)); acc.add(K.floor, slabXZ(ngon(8, Ap - 0.2), hp + 0.02, 0.04)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: Ap, top: hp });
  chhajja(acc, K.trim, ngon(8, Ap), hp - 0.2, 0.35, { drop: 0.1, th: 0.2, consoles: false });
  // lan can quanh mép bệ, chừa miệng bậc giữa mặt trước: đi từ (sw, mép trước) vòng qua phải → sau → trái → (−sw, mép trước)
  const sw = 1.7, vv = ngon(8, Ap - 0.2), zf = Ap - 0.2, iR = vv.findIndex(([x, z]) => Math.abs(z - zf) < 1e-6 && x > 0);
  const rail = [[sw, zf]]; for (let c = 0; c < 8; c++) { const q = vv[(iR + c) % 8]; rail.push(q); if (c > 0 && Math.abs(q[1] - zf) < 1e-6) break; }
  rail.push([-sw, zf]); parapet(acc, K.wall, rail, hp, 1.0, 0.3, { panel: 'jaliR', closed: false });
  steps(acc, 'redDk', { x: 0, z: Ap, nx: 0, nz: 1, w: 2 * sw - 0.2, h: hp, tread: 0.3 });
  // thân bát giác: mỗi mặt một vòm lớn trong khung (pishtaq nhỏ); mặt trước là cửa
  const sideB = 2 * Ab * Math.tan(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const t = (2 * Math.PI * k) / 8, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * Ab, 0, nz * Ab, nx, nz), L = sideB / 2, w = sideB * 0.56;
    const op = k === 0 ? { cx: 0, y: hp, w: Math.max(2.6, w * 0.6), hs: sp.bodyH * 0.6 - 1.3, rise: 1.3, kind: 'open', cusps: 7 } : { cx: 0, y: hp + 0.6, w, hs: sp.bodyH * 0.72 - 0.6 - w * 0.5, rise: w * 0.5, kind: 'niche', d: 1.4, back: 'jaliR' };
    wall(F, K.wall, { x0: -L - 0.35, x1: L + 0.35, y0: hp, y1: yE, t: 1.0, ops: [op], shade: K.shade });
    if (k === 0) { const o2 = { cx: 0, y: hp, w, hs: sp.bodyH * 0.72 - w * 0.5, rise: w * 0.5 }; archDress(F, o2, { frame: K.frame, spand: K.wall }); const g = extXY([[-w / 2, hp + op.hs + op.rise + 0.4], [w / 2, hp + op.hs + op.rise + 0.4], [w / 2, hp + o2.hs], ...archCurve(0, hp + o2.hs, w / 2, w * 0.5).slice(1, -1), [-w / 2, hp + o2.hs]], [], 0.3); g.translate(0, 0, -0.7); F.add('jaliR', g); }
    else archDress(F, op, { frame: K.frame, spand: K.wall });
    frame(F, K.frame, -L + 0.15, L - 0.15, hp, yE - 0.3, 0.14, 0.05);
  }
  const vb = ngon(8, Ab);
  for (const [x, z] of vb) { acc.add(K.guld, oct([[0.001, 0], [0.32, 0], [0.32, sp.bodyH + 1.0], [0.001, sp.bodyH + 1.0]], x, hp, z)); guldasta(acc, K.guld, x, yE + 1.0, z, 2.6, 0.64, K.bud); }
  chhajja(acc, K.trim, vb, yE, 0.55, { step: 0.9 });
  acc.add(K.wall, slabXZ(ngon(8, Ab + 0.1), yE, 0.5));
  parapet(acc, K.wall, ngon(8, Ab - 0.15), yE, 0.9, 0.3, { panel: K.frame });
  // trống thấp + vòm bầu sa thạch đỏ (theo ảnh; Wikipedia ghi trắng — xem nghiên cứu)
  const top = domeOn(acc, K, { x: 0, z: 0, y: yE, rd: sp.dome.rd, hd: sp.dome.hd, rn: sp.dome.rd * 0.98, R: sp.dome.R, H: sp.dome.H, fin: sp.dome.fin, key: 'domeR', drumKey: 'red' });
  acc.add(K.floor, slabXZ(ngon(8, Ab - 1.0), hp + 0.05, 0.05)); acc.add('marble', boxB(1.2, 1.0, 2.6, 0, hp, 0));
  finishUV(acc);
  return { acc, info: { W: 2 * Ap, D: 2 * Ap, PW: 2 * Ap / Math.cos(Math.PI / 8), PD: 2 * Ap + Math.round(hp / 0.16) * 0.3, ph: hp, eave: yE, top, n: 8, kind: 'octTomb' } };
}

// ============================================================================ THÁP-ĐÌNH BÁT GIÁC (burj: Mehtab Bagh / bến sông)
export function mgBurj(sp) {
  const acc = new Acc(), K = KR, a = sp.a, hb = sp.hb, ht = sp.ht, y2 = hb + ht, side = 2 * a * Math.tan(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const t = (2 * Math.PI * k) / 8, nx = Math.sin(t), nz = Math.cos(t), F = Face.at(acc, nx * a, 0, nz * a, nx, nz), L = side / 2 + 0.5;
    // chân trơn (mặt trước có cửa / bến)
    wall(F, K.wall, { x0: -L, x1: L, y0: 0, y1: hb, t: 1.2, ops: k === 0 ? [{ cx: 0, y: 0, w: 2.6, hs: Math.min(hb - 2.0, 3.0), rise: 1.3, kind: 'open' }] : [], shade: K.shade });
    if (k === 0) archDress(F, { cx: 0, y: 0, w: 2.6, hs: Math.min(hb - 2.0, 3.0), rise: 1.3 }, { frame: K.frame, spand: K.wall });
    F.add(K.trim, boxB(side + 0.6, 0.4, 0.3, 0, hb - 0.4, 0.15));
    // tầng hốc vòm nhọn trong khung
    const w = side * 0.56, op = { cx: 0, y: hb + 0.5, w, hs: ht - 1.6 - w * 0.5, rise: w * 0.5, kind: sp.openTier ? 'open' : 'niche', d: 1.2, back: K.shade };
    wall(F, K.wall, { x0: -L, x1: L, y0: hb, y1: y2, t: 1.0, ops: [op], shade: K.shade });
    archDress(F, op, { frame: K.frame, spand: K.wall });
  }
  acc.add(K.wall, slabXZ(ngon(8, a + 0.2), y2, 0.5)); acc.add(K.floor, slabXZ(ngon(8, a - 0.5), y2 + 0.02, 0.04));
  chhajja(acc, K.trim, ngon(8, a), y2 - 0.05, 0.7, { step: 1.0 });
  parapet(acc, K.wall, ngon(8, a - 0.15), y2, 0.9, 0.3, { panel: K.frame });
  const top = chhatri(acc, { x: 0, y: y2, z: 0, a: sp.chh.a, ph: sp.chh.ph, base: sp.chh.base, dome: { R: sp.chh.R, H: sp.chh.H }, keys: chKeys(K, sp.domeKey) });
  acc.add(K.floor, slabXZ(ngon(8, a - 1.2), 0.04, 0.04)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: a - 1.2, top: 0.04 });
  finishUV(acc);
  return { acc, info: { W: 2 * a, D: 2 * a, PW: (2 * a) / Math.cos(Math.PI / 8) + 1.4, PD: (2 * a) / Math.cos(Math.PI / 8) + 1.4, ph: 0, eave: y2, top, n: 8, kind: 'burj' } };
}

// ============================================================================ CHHATRI đứng riêng
export function mgChhatri(sp) {
  const acc = new Acc(), K = sp.white ? KW : KR, ba = sp.baseA, hb = sp.baseH;
  acc.add(K.base, oct([[0.001, 0], [ba, 0], [ba, hb - 0.15], [ba + 0.1, hb - 0.15], [ba + 0.1, hb], [0.001, hb]]));
  acc.add(K.floor, slabXZ(ngon(8, ba - 0.3), hb + 0.02, 0.03)); acc.plat({ poly: true, x: 0, z: 0, n: 8, a: ba, top: hb });
  steps(acc, K.base, { x: 0, z: ba, nx: 0, nz: 1, w: 2.4, h: hb });
  const top = chhatri(acc, { x: 0, y: hb, z: 0, a: sp.a, ph: sp.ph, base: 0.35, dome: { R: sp.R, H: sp.H }, keys: { body: K.trim, dome: 'domeW', frame: K.trim, panel: sp.white ? 'black' : 'inlay', gold: 'gold' } });
  finishUV(acc);
  return { acc, info: { W: 2 * ba, D: 2 * ba, PW: (2 * ba) / Math.cos(Math.PI / 8), PD: (2 * ba) / Math.cos(Math.PI / 8) / 2 + ba + Math.round(hb / 0.16) * 0.34, ph: hb, eave: hb + 0.35 + sp.ph, top, n: 8, colH: sp.ph, kind: 'chhatri' } };
}

// ============================================================================ BARADARI (12 cửa: 3 vòm mỗi mặt)
export function mgBaradari(sp) {
  const acc = new Acc(), K = KR, W = sp.W, ph = sp.plinth, pier = sp.pier, colH = sp.colH, rise = sp.rise, yB = ph + colH + rise + 0.7, yR = yB + 0.45;
  const p = [-1, -1 / 3, 1 / 3, 1].map((t) => t * (W / 2 - pier / 2));
  plinthBox(acc, K, W + 1.4, W + 1.4, ph);
  for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) steps(acc, 'redDk', { x: nx * (W / 2 + 0.7), z: nz * (W / 2 + 0.7), nx, nz, w: p[2] - p[1] - pier, h: ph });
  for (const x of p) for (const z of p) { acc.add(K.wall, boxB(pier, 0.35, pier, x, ph, z)); shahCol(acc, K.wall, x, ph + 0.35, z, colH - 0.35, pier * 0.9); }
  // vòm nhiều múi giữa các trụ theo cả hai phương (12 vòm ngoài + 12 vòm trong)
  for (const dir of [0, 1]) for (const c of p) for (let i = 0; i < 3; i++) {
    const a0 = p[i], a1 = p[i + 1], mid = (a0 + a1) / 2, F = dir ? Face.at(acc, c, 0, mid, 1, 0) : Face.at(acc, mid, 0, c, 0, 1), sp2 = a1 - a0, w = sp2 - pier, ys = ph + colH;
    const cv = archCurve(0, ys, w / 2, rise, 7), g = extXY([[sp2 / 2, ys], [sp2 / 2, yB], [-sp2 / 2, yB], [-sp2 / 2, ys], ...[...cv].reverse().slice(1)], [], pier * 0.8); g.translate(0, 0, pier * 0.4); F.add(K.wall, g);
    if (Math.abs(c) > W / 2 - pier) { archRib(F, K.frame, 0, ys, w, rise, pier * 0.42, 0.09, 7); frame(F, K.frame, -sp2 / 2 + pier * 0.5, sp2 / 2 - pier * 0.5, ys - 0.2, yB - 0.15, 0.1, 0.05, pier * 0.4); }
  }
  const sq = [[-W / 2, W / 2], [W / 2, W / 2], [W / 2, -W / 2], [-W / 2, -W / 2]].reverse();
  acc.add(K.wall, slabXZ(sq, yR, 0.45)); chhajja(acc, K.trim, sq, yB + 0.05, 1.0, { step: 1.1 });
  parapet(acc, K.wall, sq.map(([x, z]) => [x * 0.98, z * 0.98]), yR, 1.0, 0.35, { panel: 'jaliR' });
  acc.add(K.trim, boxB(2.8, 0.45, 2.8, 0, ph, 0)); acc.add('water', boxB(2.3, 0.03, 2.3, 0, ph + 0.4, 0)); acc.add('marble', cylB(0.12, 0.8, 0, ph + 0.4, 0));
  finishUV(acc);
  return { acc, info: { W, D: W, PW: W + 1.4 + 2 * Math.round(ph / 0.16) * 0.34, PD: W + 1.4 + 2 * Math.round(ph / 0.16) * 0.34, ph, eave: yB, top: yR + 1.0, colH, colD: pier * 0.9, bays: [p[1] - p[0], p[2] - p[1], p[3] - p[2]], kind: 'baradari' } };
}
const cylB = (r, h, x, y, z) => lathe2([[0.001, 0], [r, 0], [r, h], [0.001, h]], 10, 0, x, y, z);
