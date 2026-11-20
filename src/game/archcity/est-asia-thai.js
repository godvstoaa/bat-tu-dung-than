// ============================================================================
//  HỌ «ASIA» — CUNG ĐIỆN THÁI LAN (thai, chỉ phủ) cho biệt phủ (docs/bietphu/asia.md). Bộ cấu kiện tiên phủ th-kit.js /
//  th-build.js (CHỈ import) theo docs/tienphu-nghiencuu/08-thai.md (A1–A7) + vật liệu lặp theo mét (archcity/mats.js).
//   · nhà (chính / Đông Sương): PHRA THINANG điện ở 2 tầng tường trắng — khối dài nóc dọc mặt tiền (lô quay cạnh dài ra
//     sân), mái 3 dải (2 son + dải hiên) ngói đỏ cam viền xanh, lot hạ ở hai đầu hồi; vào nhà qua MUKH (hồi nhô) giữa mặt
//     tiền như Dusit / Chakri (A7.1: vào ở đầu hồi), chính điện thêm 2 mukh nhỏ hai bên (nhịp 3 lầu của Chakri);
//     hiên cột vuông 12 góc lõm đầu sen, consol khan thuai, cửa khung hồi nhọn (sum), bệ chân sư tử + băng Garuda, bậc Naga
//   · tháp: CHEDI chuông vàng kiểu Tích Lan (Phra Si Rattana Chedi, Wat Phra Kaew 1855): 3 bệ 12 góc lõm, đế sen, chuông,
//     ba vòng malai, balang có cột, 20 đĩa vòng plong chanai, búp plee, mũi + giọt sương
//   · đình: sala mở (Sitalaphirom / sala rai) · cổng: cổng tường trắng hai trụ, cánh đỏ, mái hồi lamyong hai mặt
// ============================================================================
import * as THREE from 'three';
import {
  Acc, boxB, beam, V, mRY, xf, thMats, thColumn, thPlinth, thBalustrade, thRoof, thRoofX, wallRun, bracket, redent, sqLathe, clathe, figure, GARUDA,
} from '../tienphu/arch/th-kit.js';
import { thHall } from '../tienphu/arch/th-build.js';
import { tiled, retex, consolidate } from './mats.js';

// ---------------------------------------------------------------- vật liệu
/** ngói krabueang (dẹt đầu nhọn) xếp so le, xám trung tính để nhuộm theo màu vật liệu — 256 px / 1 m (UV quad theo mét) */
function tileTex() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), w = 256, cw = w / 4, rh = w / 4;
  g.fillStyle = '#6a6a6a'; g.fillRect(0, 0, w, w);
  let sd = 5; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  for (let r = -1; r < 5; r++) for (let k = -1; k < 5; k++) {
    const x = k * cw + (r % 2 ? cw / 2 : 0), y = r * rh, l = 205 + Math.floor(rnd() * 40);
    g.beginPath(); g.moveTo(x + 3, y); g.lineTo(x + cw - 3, y); g.lineTo(x + cw - 3, y + rh * 0.72); g.lineTo(x + cw / 2, y + rh + 8); g.lineTo(x + 3, y + rh * 0.72); g.closePath();
    g.fillStyle = `rgb(${l},${l},${l})`; g.fill(); g.strokeStyle = '#4a4a4a'; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(x + 7, y + 4, 6, rh * 0.55);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
let MT = null;
function mats(S) {
  if (MT) return MT;
  const T = tileTex(), D = THREE.DoubleSide;
  const tile = (col, rough = 0.5) => new THREE.MeshStandardMaterial(T ? { map: T, color: col, roughness: rough, side: D } : { color: col, roughness: rough, side: D });
  const roof = '#' + new THREE.Color(S.roofCol).lerp(new THREE.Color('#d2582c'), 0.55).getHexString(), border = '#2f7a45';   // đỏ cam (A6: #C8502E)
  const over = {
    wall: tiled('plaster', S.wall, { rough: 0.95 }), wallShade: tiled('plaster', '#ddd6c8', { rough: 0.95 }), plinth: tiled('plaster', '#efebe2', { rough: 0.9 }),
    plinthShade: tiled('plaster', '#c9c2b4', { rough: 0.9 }), baluster: tiled('plaster', '#efebe2', { rough: 0.9 }), marble: tiled('marble', '#ece9e1', { bump: 0.5 }),
    floor: tiled('marble', '#b9b2a6', { bump: 0.5 }), ceil: tiled('lacquer', '#8a2a20', { rough: 0.7 }), wood: tiled('plank', '#6b3a22'),
    chedi: tiled('brick', '#e2b448', { rough: 0.32, metal: 0.65, bump: 0.6 }), stone: tiled('stone', '#9a958c'),
  };
  const M = thMats();
  MT = { over, mats: { ...M, tileRed: tile(roof), tileBGreen: tile(border), tileGreen: tile('#3f6a3b'), tileBOrange: tile('#d9682b'), edgeGreen: new THREE.MeshStandardMaterial({ color: border, roughness: 0.4 }), baluster: M.plinth, chedi: M.gold } };
  return MT;
}
const out = (acc, S, info) => { const M = mats(S); return { acc, mats: M.mats, post: (g) => consolidate(retex(g, M.over)), midDrop: /^(baluster|goldLt|naga)/, info }; };
const odd = (n) => (n % 2 ? n : n + 1);

// ---------------------------------------------------------------- NHÀ: Phra Thinang 2 tầng, mukh giữa mặt tiền
export function thaiHall(styleId, S, b) {
  const acc = new Acc(), main = b.id === 'main', W = b.w, D = b.d, hd = D / 2, ph = b.plinth, H = b.h, T = 0.45;
  const set = 1.1, zF = hd - set, zB = b.back ? -(hd - set) : -hd, zc = (zF + zB) / 2, Db = zF - zB;            // tường lùi 1,1 m: hiên cột ngoài chu vi
  const h1 = +(H * 0.53).toFixed(2), h2 = +(H - h1).toFixed(2), yW = ph + H;
  // ---- bệ chân sư tử + băng Garuda (chính điện) + bậc Naga + lan can trắng búp sen quanh mép bệ
  const sw = Math.min(6, W * 0.3), stairs = [{ side: 1, c: 0, w: sw }]; if (b.back) stairs.push({ side: -1, c: 0, w: sw });
  thPlinth(acc, { W: W + 2.4, D: D + 2.4, h: ph, key: 'plinth', garuda: main ? 1.5 : 0, stairs });
  acc.add('floor', boxB(W + 1.8, 0.03, D + 1.8, 0, ph, 0));
  { const e = 0.2, x1 = W / 2 + 1.2 - e, z1 = hd + 1.2 - e, g = sw / 2 + 0.45;
    const front = [[-g, z1], [-x1, z1], [-x1, -z1]], back = b.back ? [[-g, -z1]] : [[x1, -z1], [x1, z1], [g, z1]];
    thBalustrade(acc, [...front, ...back], ph, { h: 0.85, step: 2.4, key: 'baluster', baluster: 0.42 });
    if (b.back) thBalustrade(acc, [[g, -z1], [x1, -z1], [x1, z1], [g, z1]], ph, { h: 0.85, step: 2.4, key: 'baluster', baluster: 0.42 }); }
  // ---- mái chính: nóc dọc x, 2 son + dải hiên phủ hiên cột, lot hạ ở hai đầu hồi, ngói đỏ cam viền xanh
  const yBase = yW + 0.55, p = 0.84, hw = Db / 2 + 0.3, eF = set + 0.95, eB = b.back ? set + 0.95 : 0.8;
  const R = thRoofX(acc, { hw, p, son: 3, nMain: 2, eaveL: eF, eaveR: eB, pe: 0.5, yBase, tile: 'Red', border: 'Green', zMain: [-(W / 2 - 1.0), W / 2 - 1.0], lotsF: { n: 1, len: 1.5, drop: 1.0 }, lotsB: { n: 1, len: 1.5, drop: 1.0 }, chofaH: main ? 2.1 : 1.6, pedBot: yW - 0.25, pedFixed: true, truss: 0 }, zc);
  // ---- mukh: hồi nhô giữa mặt tiền (cửa vào), chính điện thêm 2 mukh nhỏ (nhịp 3 lầu Chakri)
  const mk = [{ x: 0, hw: main ? 4.2 : 2.9, lots: main ? 2 : 1 }]; if (main) mk.push({ x: -W * 0.31, hw: 2.7, lots: 1 }, { x: W * 0.31, hw: 2.7, lots: 1 });
  const zCol = hd + 0.75, mukhs = [];
  for (const m of mk) {
    const zA = zc + Math.max(0.6, hw - m.hw - 0.4), front = hd + 0.5;
    const r = thRoof(acc, { cx: m.x, hw: m.hw, p, son: 2, nMain: 1, eaveL: 0.55, eaveR: 0.55, yBase, tile: 'Red', border: 'Green', zMain: [zA, front], lotsF: { n: m.lots, len: 0.85, drop: 0.85 }, backFace: false, chofaH: m.x ? 1.6 : 2.0, pedBot: yW - 0.1, pedFixed: true, scale: m.x ? 0.85 : 1 });
    mukhs.push({ ...m, r });
  }
  const U = (x, z) => { let y = R.U(x, z) ?? yW; for (const m of mukhs) if (Math.abs(x - m.x) < m.hw + 0.5) { const yy = m.r.U(x, z); if (yy != null) y = Math.max(y, yy); } return y; };
  // ---- tường trắng 2 tầng: cửa giữa khung hồi nhọn (mở), cửa sổ khung sum + cửa chớp, trụ ốp, gờ tầng vàng
  // mỗi tầng một dải tường (wallRun không chồng ô cửa cùng u); cửa đi: cánh gấp sát mặt trong tường, lòng cửa thông
  const win = (L, n, y, h, skip = []) => { const ops = [], st = L / n; for (let i = 0; i < n; i++) { const u = -L / 2 + st * (i + 0.5); if (skip.some((s) => Math.abs(u - s) < 1.9)) continue; ops.push({ u, w: Math.min(1.25, st * 0.42), y, h, kind: 'win', frame: 'sum' }); } return ops; };
  const wall2 = (a, L, n, withDoor) => {
    const dw = 2.6, dh = 3.2;
    wallRun(a, { L, y0: ph, H: h1, T, openings: [...(withDoor ? [{ u: 0, w: dw, y: 0, h: dh, kind: 'door', frame: 'sum', leaf: 'open', leafKey: 'doorTmp' }] : []), ...win(L, n, 1.0, h1 * 0.5, withDoor ? [0] : [])], pil: n, shutter: 'shutter' });
    wallRun(a, { L, y0: ph + h1, H: h2, T, openings: win(L, n, 0.8, h2 * 0.5), pil: n, shutter: 'shutter', plinthBand: false });
    a.parts.delete('doorTmp');
    if (withDoor) for (const s of [-1, 1]) a.add('door', boxB(dw / 2 - 0.06, dh, 0.1, s * (dw / 2 + dw / 4 + 0.05), ph, -T / 2 - 0.07));
  };
  const nF = odd(Math.round(W / 3.3));
  xf(acc, mRY(0, 0, 0, zF - T / 2), (a) => wall2(a, W, nF, true));
  xf(acc, mRY(Math.PI, 0, 0, zB + T / 2), (a) => wall2(a, W, nF, !!b.back));
  for (const sx of [-1, 1]) { const nE = Math.max(2, Math.round(Db / 3.6)); xf(acc, mRY(sx * Math.PI / 2, sx * (W / 2 - T / 2), 0, zc), (a) => wall2(a, Db - 2 * T + 0.01, nE, false)); }
  for (const yy of [ph + h1, yW]) { acc.add('gold', boxB(W + 0.24, 0.2, Db + 0.24, 0, yy - 0.2, zc)); acc.add('wallShade', boxB(W + 0.36, 0.28, Db + 0.36, 0, yy - 0.55, zc)); }
  acc.add('ceil', boxB(W - 2 * T, 0.3, Db - 2 * T, 0, ph + h1 - 0.3, zc)); acc.add('ceil', boxB(W - 0.4, 0.12, Db - 0.4, 0, yW - 0.1, zc));    // sàn lầu + trần
  // ---- hiên cột ngoài chu vi (mặt trước, và sau nếu back): cột 12 góc lõm, xà vàng, consol, trần đỏ
  const n = odd(Math.round(W / 3.4)), cols = [];
  for (const [zz, sz] of [[zCol, 1], ...(b.back ? [[-zCol, -1]] : [])]) {
    for (let i = 0; i <= n; i++) {
      const x = -W / 2 - 0.3 + ((W + 0.6) * i) / n;
      if (sz > 0 && mukhs.some((m) => Math.abs(x - m.x) < m.hw + 0.6)) continue;
      cols.push({ x, z: zz, sz });
    }
    if (sz > 0) for (const m of mukhs) for (const s of [-1, 1]) cols.push({ x: m.x + s * (m.hw - 0.35), z: zz, sz, mukh: true });
  }
  for (const c of cols) { const top = U(c.x, c.z) - 0.35; c.top = top; thColumn(acc, c.x, c.z, ph, top - 0.4 - ph, main ? 0.58 : 0.48, 'colG'); acc.add('gold', boxB(0.75, 0.4, 0.75, c.x, top - 0.4, c.z)); bracket(acc, c.x, top - 1.9, c.z + c.sz * 0.3, 0, c.sz, 0.95, 1.4); }
  for (const sz of b.back ? [1, -1] : [1]) {
    const row = cols.filter((c) => c.sz === sz).sort((a2, b2) => a2.x - b2.x);
    for (let i = 0; i < row.length - 1; i++) { const a2 = row[i], c2 = row[i + 1]; if (c2.x - a2.x > 6) continue; acc.add('gold', beam(V(a2.x, a2.top - 0.25, a2.z), V(c2.x, c2.top - 0.25, c2.z), 0.4, 0.42)); }
    acc.add('ceil', boxB(W + 0.6, 0.1, set + 0.75, 0, Math.min(...row.map((c) => c.top)) - 0.05, sz * (hd - set / 2 + 0.375)));
  }
  // consol dưới lot đầu hồi (tường hồi) — khan thuai
  for (const sx of [-1, 1]) for (let z = zB + 1.6; z <= zF - 1.5; z += 2.8) bracket(acc, sx * W / 2, yW - 1.9, z, sx, 0, 1.1, 1.5);
  return out(acc, S, { W, D, ph, top: R.yR + (main ? 2.1 : 1.6), kind: 'thai-phrathinang' });
}

// ---------------------------------------------------------------- THÁP: chedi chuông vàng (Phra Si Rattana Chedi)
export function thaiTower(styleId, S, t) {
  const acc = new Acc(), A = Math.min(t.w, t.d) / 2 - 0.25, Htop = Math.min(36, t.h - 1);
  let y = 0;
  // 3 bệ 12 góc lõm trắng viền vàng (gờ sư tử / gờ bát)
  for (const [k, h] of [[1, 1.3], [0.86, 1.15], [0.74, 1.0]]) {
    const s = A * k;
    acc.add('wall', redent(s, h - 0.2, 0, y, 0, 0.14)); acc.add('gold', redent(s * 1.02, 0.12, 0, y + h - 0.32, 0, 0.14)); acc.add('wallShade', redent(s * 0.97, 0.2, 0, y + h - 0.2, 0, 0.14));
    y += h;
  }
  // 4 chedi nhỏ ở góc bệ trên (chedi thít — như các chedi phụ quanh bệ Tích Lan) — bậc vừa bỏ (goldLt)
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) acc.add('goldLt', clathe([[0.42, 0], [0.42, 0.25], [0.36, 0.3], [0.4, 0.75], [0.3, 1.05], [0.14, 1.2], [0.1, 1.5], [0.05, 2.1], [0.001, 2.3]], sx * A * 0.63, y, sz * A * 0.63, 10));
  const R0 = A * 0.66, L = (pts, seg = 36) => clathe(pts, 0, y, 0, seg);
  // đế sen tròn 3 vòng (thân tròn kiểu Tích Lan)
  acc.add('chedi', L([[R0 * 1.06, 0], [R0 * 1.06, 0.3], [R0 * 0.98, 0.42], [R0, 0.7], [R0 * 0.92, 0.82], [R0 * 0.94, 1.1], [R0 * 0.86, 1.2]])); y += 1.2;
  // ba vòng malai (vòng hoa) + chuông (ong rakhang): thân gần thẳng, vai tròn — rộng hơn cao như Phra Si Rattana
  const rB = R0 * 0.86, bH = rB * 1.4;
  acc.add('chedi', L([[rB, 0], [rB * 1.02, 0.25], [rB * 0.95, 0.35], [rB * 0.97, 0.6], [rB * 0.9, 0.7], [rB * 0.92, 0.95], [rB * 0.86, 1.05]])); y += 1.05;
  const bell = []; for (let i = 0; i <= 16; i++) { const u = i / 16, r = rB * 0.86 * (1.0 + 0.05 * Math.sin(u * Math.PI) - 0.56 * Math.pow(u, 2.6)); bell.push([r, u * bH]); }
  acc.add('chedi', L(bell)); y += bH;
  // balang (hộp vuông trên chuông) + gờ, cột sao harn quanh cổ
  const bl = rB * 0.32;
  acc.add('chedi', sqLathe([[bl * 1.25, 0], [bl * 1.25, 0.25], [bl, 0.35], [bl, 1.4], [bl * 1.3, 1.5], [bl * 1.3, 1.75], [0.001, 1.75]], 0, y, 0)); y += 1.75;
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; acc.add('gold', boxB(0.14, 1.2, 0.14, Math.cos(a) * bl * 0.8, y, Math.sin(a) * bl * 0.8)); }
  acc.add('chedi', L([[bl * 0.95, 0], [bl * 0.95, 1.2], [bl * 1.05, 1.32], [0.001, 1.32]], 16)); y += 1.32;
  // plong chanai: 20 đĩa vòng thu dần + plee (búp) + mũi kim + giọt sương
  const rH = (Htop - y) * 0.6, rr0 = bl * 0.95, prof = [];
  for (let i = 0; i < 20; i++) { const u0 = i / 20, u1 = (i + 1) / 20, r = rr0 * (1 - 0.82 * u0); prof.push([r * 1.08, u0 * rH], [r * 1.08, u0 * rH + rH * 0.025], [r * 0.9, u0 * rH + rH * 0.03], [r * 0.9 * (1 - 0.82 * (u1 - u0)), u1 * rH]); }
  acc.add('chedi', L(prof, 20)); y += rH;
  const pH = Htop - y, rp = rr0 * 0.2;
  acc.add('chedi', L([[rp, 0], [rp * 1.45, pH * 0.12], [rp * 1.2, pH * 0.24], [rp * 0.5, pH * 0.4], [rp * 0.28, pH * 0.6], [0.05, pH * 0.85], [0.03, pH], [0.001, pH]], 16));
  acc.add('glass', clathe([[0.001, 0], [0.16, 0.08], [0.18, 0.22], [0.001, 0.4]], 0, y + pH * 0.78, 0, 10));
  return out(acc, S, { kind: 'thai-chedi', top: Htop });
}

// ---------------------------------------------------------------- ĐÌNH: sala mở (Sitalaphirom — sala1 trong th-spec)
export function thaiPav(styleId, S, pv) {
  const a = Math.min(pv.w, pv.d) - 1.6;
  const r = thHall({
    W: a * 0.86, L: a, ph: 0.5, wallH: Math.max(2.9, pv.h - 0.4), colD: 0.36, colKey: 'colG', open: true, stairW: 2.4,
    roof: { p: 1.1, son: 2, eave: 0.9, tile: 'Red', border: 'Green', lotsF: { n: 1, drop: 0.7 }, lotsB: { n: 1, drop: 0.7 }, chofaH: 1.1, scale: 0.72 },
  });
  return out(r.acc, S, { ...r.info, kind: 'thai-sala' });
}

// ---------------------------------------------------------------- CỔNG: tường trắng 2 trụ, cánh cổng đỏ mở, mái hồi lamyong
export function thaiGate(styleId, S, g) {
  const acc = new Acc(), cw = g.w + 0.4, zc = -1.0, Dg = 2.0, pw = 1.6, hP = 5.8, xP = cw / 2 + pw / 2;
  for (const sx of [-1, 1]) {
    const x = sx * xP;
    thPlinth(acc, { W: pw + 0.5, D: Dg + 0.5, h: 0.5, x, z: zc, plat: false });
    acc.add('wall', boxB(pw, hP - 0.5, Dg, x, 0.5, zc)); acc.add('gold', boxB(pw + 0.12, 0.18, Dg + 0.12, x, hP - 0.4, zc)); acc.add('wallShade', boxB(pw + 0.2, 0.26, Dg + 0.2, x, hP - 0.75, zc));
    for (const sz of [1, -1]) acc.add('wallShade', boxB(pw * 0.6, hP - 2.4, 0.08, x, 1.3, zc + sz * (Dg / 2 + 0.04)));
    // cánh cổng gỗ son mở vào trong (Grand Palace «gigantic red doors»)
    acc.add('doorRed', boxB(0.14, 4.0, cw / 2 - 0.1, x - sx * (pw / 2 + 0.1), 0.05, zc - Dg / 2 - cw / 4 - 0.05));
    // tường rào hai bên: tường trắng có ô khung sum mù, răng cưa trên đỉnh
    const wl = 3.2, xw = sx * (xP + pw / 2 + wl / 2);
    xf(acc, mRY(0, xw, 0, zc), (q) => wallRun(q, { L: wl, y0: 0, H: 3.4, T: 0.6, openings: [{ u: 0, w: 1.0, y: 1.0, h: 1.4, kind: 'win', frame: 'sum', leafKey: 'dark' }], pil: 1 }));
    for (let k = 0; k < 3; k++) acc.add('wall', boxB(0.6, 0.55, 0.6, xw - wl / 2 + 0.5 + k * 1.1, 3.4, zc));
  }
  acc.add('wall', boxB(cw + 0.1, 1.1, Dg, 0, hP - 1.0, zc)); acc.add('gold', boxB(cw + 0.2, 0.16, Dg + 0.14, 0, hP - 1.05, zc));
  for (const sz of [1, -1]) acc.add('naban', boxB(cw * 0.5, 0.7, 0.06, 0, hP - 0.85, zc + sz * (Dg / 2 + 0.03)));
  // mái hồi nóc dọc lối đi: hồi trước + sau, 2 son, lot hạ, đủ lamyong (chofa, bai raka, hang hong)
  const yBase = hP + 0.5;
  thRoof(acc, { hw: cw / 2 + pw + 0.2, p: 0.95, son: 2, nMain: 1, eaveL: 0.7, eaveR: 0.7, yBase, tile: 'Red', border: 'Green', zMain: [zc - Dg / 2 - 0.2, zc + Dg / 2 + 0.2], lotsF: { n: 1, len: 0.7, drop: 0.8 }, lotsB: { n: 1, len: 0.7, drop: 0.8 }, chofaH: 1.6, pedBot: hP - 0.05, pedFixed: true, scale: 0.9 });
  acc.add('stone', boxB(cw, 0.08, Dg + 1.2, 0, 0, zc));
  return out(acc, S, { kind: 'thai-pratu' });
}
