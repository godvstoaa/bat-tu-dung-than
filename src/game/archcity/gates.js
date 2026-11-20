// ============================================================================
//  SƠN MÔN + TƯỜNG BAO (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §3.1) — thay model Meshy gate_sect (14 × 8,2 m, 36 px/m)
//  và tường hộp đỏ 7,4 m. Nguyên mẫu: sơn môn Bạch Vân Quán (Bắc Kinh, 1443) — thân xây trát đỏ 3 vòm cuốn viền đá
//  Hán bạch ngọc, đơn diêm yết sơn, đấu củng, biển ngạch giữa; tường bao đỏ chân đá, nắp ngói hai mái.
//  Dựng bằng bộ kiến trúc Trung Hoa của tiên phủ (tienphu/arch/cn.js, kit.js — chỉ import) + vật liệu lặp theo mét.
//  Trục: X ngang, Y lên, mặt tiền +Z; gốc giữa đáy.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, slabXY } from '../tienphu/arch/kit.js';
import { cnRoof, dougongRow, cnMats } from '../tienphu/arch/cn.js';
import { retex, archMats, consolidate } from './mats.js';

/** đường viền mặt đứng một khối xây có các vòm cuốn mở từ đất: [{ cx, w, h }] (h = đỉnh vòm) — một đa giác kín */
function archOutline(W, H, arches, seg = 14) {
  const pts = [[-W / 2, 0]];
  for (const a of [...arches].sort((p, q) => p.cx - q.cx)) {
    const r = a.w / 2, yS = a.h - r;
    pts.push([a.cx - r, 0], [a.cx - r, yS]);
    for (let i = 1; i < seg; i++) { const t = Math.PI - (Math.PI * i) / seg; pts.push([a.cx + Math.cos(t) * r, yS + Math.sin(t) * r]); }
    pts.push([a.cx + r, yS], [a.cx + r, 0]);
  }
  pts.push([W / 2, 0], [W / 2, H], [-W / 2, H]);
  return pts;
}
/** dải viền vòm (hình móng ngựa): vòng ngoài r + b, vòng trong r — đa giác kín */
function archBand(a, b, seg = 14) {
  const r = a.w / 2, yS = a.h - r, out = [], inn = [];
  out.push([a.cx - r - b, 0]); for (let i = 0; i <= seg; i++) { const t = Math.PI - (Math.PI * i) / seg; out.push([a.cx + Math.cos(t) * (r + b), yS + Math.sin(t) * (r + b)]); } out.push([a.cx + r + b, 0]);
  inn.push([a.cx + r, 0]); for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; inn.push([a.cx + Math.cos(t) * r, yS + Math.sin(t) * r]); } inn.push([a.cx - r, 0]);
  return [...out, ...inn];
}
/** khối đùn từ đa giác mặt đứng (x, y) dày d, mặt trước tại z0 + d/2 */
function extrudeXY(pts, d, z0 = 0) {
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, z0 - d / 2);
  return g;
}

/** biển ngạch: canvas chữ vàng trên nền xanh sẫm, khung vàng */
function plaque(text, w, h) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / w);
  const g = c.getContext('2d'), H = c.height;
  g.fillStyle = '#1f3a52'; g.fillRect(0, 0, 1024, H);
  g.strokeStyle = '#d9a441'; g.lineWidth = 26; g.strokeRect(13, 13, 1024 - 26, H - 26);
  g.strokeStyle = '#8a5a1a'; g.lineWidth = 6; g.strokeRect(40, 40, 1024 - 80, H - 80);
  g.fillStyle = '#e8c165'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `bold ${Math.round(H * 0.6)}px "KaiTi","STKaiti","SimSun",serif`;
  g.fillText(text, 512, H * 0.53);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), [0, 0, 0, 0, 1, 1].map((k) => (k ? new THREE.MeshStandardMaterial({ map: t, roughness: 0.55 }) : new THREE.MeshStandardMaterial({ color: '#d9a441', roughness: 0.4, metalness: 0.5 }))));
  m.castShadow = true; m.name = 'plaque';
  return m;
}

/**
 * Sơn môn 3 vòm (nguyên mẫu Bạch Vân Quán). W rộng thân xây, D sâu; vòm giữa w × h, vòm bên ws × hs.
 * Trả { group, info: { W, D, H, arches } } — H = đỉnh vẫn thú.
 */
export function shanmen({ W = 22, D = 7, Hb = 7.2, mid = [4.6, 5.8], side = [3.2, 4.5], title = '玄 觀', tile = 'Green' } = {}) {
  const acc = new Acc();
  const sx = W * 0.3, arches = [{ cx: 0, w: mid[0], h: mid[1] }, { cx: -sx, w: side[0], h: side[1] }, { cx: sx, w: side[0], h: side[1] }];
  // nền đá + bậc trước / sau ở 3 vòm
  const P = 0.45;
  acc.add('stone', boxB(W + 1.6, P, D + 1.6, 0, 0, 0));
  for (const sz of [1, -1]) for (const a of arches) for (let k = 0; k < 3; k++) acc.add('stone', boxB(a.w + 0.8, P * (3 - k) / 3, 0.36, a.cx, 0, sz * (D / 2 + 0.8 + 0.18 + k * 0.36)));
  // thân xây trát đỏ có 3 vòm cuốn (đùn từ mặt đứng — lòng vòm thành đường hầm)
  const body = extrudeXY(archOutline(W, Hb, arches), D); body.translate(0, P, 0); acc.add('plasterRed', body);
  // chân tường đá 1,1 m (mặt trước / sau, giữa các vòm) + bó góc
  const xs = [-W / 2, ...arches.flatMap((a) => [a.cx - a.w / 2 - 0.42, a.cx + a.w / 2 + 0.42]).sort((p, q) => p - q), W / 2];
  for (let i = 0; i < xs.length; i += 2) for (const sz of [1, -1]) { const w = xs[i + 1] - xs[i]; if (w > 0.1) acc.add('stone', boxB(w, 1.1, 0.14, (xs[i] + xs[i + 1]) / 2, P, sz * (D / 2 + 0.06))); }
  for (const sxx of [-1, 1]) acc.add('stone', boxB(0.14, 1.1, D, sxx * (W / 2 + 0.06), P, 0));
  // viền vòm đá Hán bạch ngọc (dày 0,42, nhô 0,12) + đá khoá
  for (const a of arches) for (const sz of [1, -1]) {
    const band = extrudeXY(archBand(a, 0.42), 0.2, sz * (D / 2 + 0.06)); band.translate(0, P, 0); acc.add('marble', band);
    acc.add('marble', boxB(0.5, 0.62, 0.26, a.cx, P + a.h + 0.1, sz * (D / 2 + 0.08)));
  }
  // gờ gạch 3 lớp nhô dần (diêm đầu thân xây) + xà ngạch thải họa từng gian + đấu củng + mái yết sơn
  let y = P + Hb;
  for (let k = 0; k < 3; k++) { acc.add('brick', boxB(W + 0.2 + k * 0.24, 0.17, D + 0.2 + k * 0.24, 0, y, 0)); y += 0.17; }
  const bays = [[-W / 2, -sx + side[0] / 2 + 0.9], [-sx + side[0] / 2 + 0.9, sx - side[0] / 2 - 0.9], [sx - side[0] / 2 - 0.9, W / 2]];
  for (const sz of [1, -1]) bays.forEach(([x0, x1], i) => acc.add(i === 1 ? 'beam' : 'beam2', boxB(x1 - x0, 0.55, 0.3, (x0 + x1) / 2, y, sz * (D / 2 + 0.2))));
  for (const sxx of [-1, 1]) acc.add('beam', boxB(0.3, 0.55, D + 0.1, sxx * (W / 2 + 0.2), y, 0));
  y += 0.55;
  acc.add('col', boxB(W + 0.5, 0.14, D + 0.5, 0, y, 0)); y += 0.14;                   // bình bản phương
  const dk = 0.085, inset = 0.25;
  let dgH = 0;
  for (const sz of [1, -1]) dgH = dougongRow(acc, -W / 2 + inset, sz * (D / 2 + 0.2), W / 2 - inset, sz * (D / 2 + 0.2), y, 0, sz, dk, 1.05);
  for (const sxx of [-1, 1]) dougongRow(acc, sxx * (W / 2 + 0.2), -D / 2 + inset, sxx * (W / 2 + 0.2), D / 2 - inset, y, sxx, 0, dk, 1.05, 1);
  y += dgH;
  const roofs = cnRoof(acc, { W: W + 0.4, D: D + 0.4, yCol: y, over: 1.75, roof: { type: 'xieshan', tile, beasts: 5, ridgeH: 1.0, lift: 0.5 }, wallT: 0.6 });
  const top = Math.max(...roofs.map((r) => r.top)) + 1.0 * 2.3 * 0.75;
  const group = consolidate(retex(acc.build({ ...cnMats(), ...archMats() }, 'shanmen')));
  // biển ngạch giữa (mặt trước + sau) — trên vòm giữa, dưới gờ diêm
  const ph = Math.min(1.15, Hb - mid[1] - 0.55), pw = ph * 3.1;
  for (const sz of [1, -1]) { const p = plaque(title, pw, ph); p.position.set(0, P + mid[1] + 0.45 + ph / 2, sz * (D / 2 + 0.2)); if (sz < 0) p.rotation.y = Math.PI; group.add(p); }
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, info: { W, D, H: top, Hb: P + Hb, arches: arches.map((a) => ({ ...a })) } };
}

/**
 * Tường bao: chân đá + thân trát đỏ + gờ gạch + nắp ngói hai mái có bờ nóc. Đoạn thẳng (x0,z0)→(x1,z1) dày T, cao H tới nóc.
 * Gom vào acc (dựng nhiều đoạn rồi build một lần). Trụ bổ tường mỗi ~12 m.
 */
export function wallRun(acc, x0, z0, x1, z1, { T = 1.2, H = 5.0, body = 'plasterRed' } = {}) {
  const L = Math.hypot(x1 - x0, z1 - z0); if (L < 0.3) return;
  const ry = Math.atan2(x1 - x0, z1 - z0) - Math.PI / 2, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const put = (key, g) => { g.rotateY(ry); g.translate(cx, 0, cz); acc.add(key, g); };
  const capH = 0.75, bodyTop = H - capH;
  put('stone', boxB(L, 0.95, T + 0.24, 0, 0, 0));                                        // chân đá
  put(body, boxB(L, bodyTop - 0.95 - 0.3, T, 0, 0.95, 0));                               // thân
  put('brick', boxB(L, 0.15, T + 0.14, 0, bodyTop - 0.3, 0)); put('brick', boxB(L, 0.15, T + 0.3, 0, bodyTop - 0.15, 0)); // gờ gạch
  // nắp ngói: lăng trụ tam giác vươn 0,35 mỗi bên
  const w = T / 2 + 0.38, prof = [[-w, 0], [w, 0], [0.12, capH - 0.12], [-0.12, capH - 0.12]];
  const cap = slabXY(prof, L, 0, 0, 0, 0); cap.rotateY(Math.PI / 2); cap.translate(0, bodyTop, 0); put('tileGray', cap);
  const ridge = new THREE.CylinderGeometry(0.17, 0.17, L + 0.2, 10).rotateZ(Math.PI / 2); ridge.translate(0, H - 0.12, 0); put('ridgeGray', ridge);
  // trụ bổ tường (nhô 0,18) — chia đều, không sát hai đầu
  const n = Math.floor(L / 12);
  for (let k = 1; k < n; k++) { const t = k / n - 0.5; put('plasterRed', boxB(0.9, bodyTop - 0.95, T + 0.36, t * L, 0.95, 0)); }
}
/** dựng các đoạn tường (mảng [x0,z0,x1,z1]) thành một nhóm đã đổi vật liệu */
export function buildWalls(runs, opts) {
  const acc = new Acc();
  for (const r of runs) wallRun(acc, ...r, opts);
  return consolidate(retex(acc.build({ ...cnMats(), ...archMats() }, 'courtwall')));
}

/**
 * Bài lâu 4 trụ 3 gian 3 lâu 四柱三间三楼 (nguyên mẫu: bài lâu Chương Châu 8,5 × 9,57 m, Linh Thọ 8 × 12 m, Long Xương 9 × 11 m —
 * manifest §1). mid / side: bề rộng tim trụ gian giữa / gian bên; colH: cao trụ giữa tới xà; tile: màu ngói.
 * Lối đi gian giữa thông thủy mid − Ø trụ. Trả { group, info }.
 */
export function pailou({ mid = 5.2, side = 3.2, colH = 7.2, title = '', tile = 'Green', d = 0.62 } = {}) {
  const acc = new Acc();
  const xs = [-mid / 2 - side, -mid / 2, mid / 2, mid / 2 + side];
  const sideH = colH * 0.78;
  // trụ sơn son trên chân tảng + đá giáp trụ 夹杆石 + trống ôm 抱鼓石 hai mặt
  xs.forEach((x, i) => {
    const h = i === 1 || i === 2 ? colH + 2.3 : sideH + 1.9;          // trụ xuyên lên đỡ lâu
    acc.add('col', new THREE.CylinderGeometry(d / 2, d / 2 * 1.02, h, 16).translate(x, h / 2, 0));
    acc.add('stone', boxB(d + 0.5, 1.5, d + 0.5, x, 0, 0));
    for (const sz of [1, -1]) {
      acc.add('stone', boxB(0.42, 0.55, 1.15, x, 0, sz * (d / 2 + 0.6)));
      acc.add('stone', new THREE.CylinderGeometry(0.48, 0.48, 0.34, 18).rotateZ(Math.PI / 2).translate(x, 1.05, sz * (d / 2 + 0.55)));
    }
  });
  // xà ngạch lớn / nhỏ + biển giữa + ô hoa văn (花板) mỗi gian
  const beamRow = (x0, x1, y, h, key) => acc.add(key, boxB(x1 - x0, h, 0.38, (x0 + x1) / 2, y, 0));
  beamRow(xs[1], xs[2], colH, 0.62, 'beam'); beamRow(xs[1], xs[2], colH - 1.55, 0.42, 'beam2');
  for (const [a, b] of [[xs[0], xs[1]], [xs[2], xs[3]]]) { beamRow(a, b, sideH, 0.5, 'beam2'); beamRow(a, b, sideH - 1.2, 0.36, 'beam'); acc.add('door', boxB(b - a - d, 0.82, 0.12, (a + b) / 2, sideH - 0.84, 0)); }
  // ba lâu: mỗi lâu = bình bản + hàng đấu củng 2 mặt + mái vũ điện (hip)
  const lou = (x0, x1, y, D, over) => {
    acc.add('col', boxB(x1 - x0 + 0.3, 0.14, D, (x0 + x1) / 2, y, 0)); y += 0.14;
    const dk = 0.07; let h = 0;
    for (const sz of [1, -1]) h = dougongRow(acc, x0 + 0.2, sz * D / 2, x1 - 0.2, sz * D / 2, y, 0, sz, dk, 0.82);
    y += h;
    const sub = new Acc(), xc = (x0 + x1) / 2;                                          // cnRoof dựng quanh x = 0 → dời về giữa lâu
    const r = cnRoof(sub, { W: x1 - x0, D, yCol: y, over: 1.15, roof: { type: 'hip', tile, ridgeH: 0.42, lift: 0.45, beasts: 3 }, wallT: 0.4 });
    for (const [k, list] of sub.parts) for (const g of list) acc.add(k, g.translate(xc, 0, 0));
    return r;
  };
  const rMid = lou(xs[1] - 0.2, xs[2] + 0.2, colH + 0.62, 1.4);
  lou(xs[0] - 0.3, xs[1] + 0.1, sideH + 0.5, 1.2); lou(xs[2] - 0.1, xs[3] + 0.3, sideH + 0.5, 1.2);
  const group = consolidate(retex(acc.build({ ...cnMats(), ...archMats() }, 'pailou')));
  if (title) for (const sz of [1, -1]) { const p = plaque(title, Math.min(3.4, mid * 0.62), 1.05); p.position.set(0, colH - 1.05, sz * 0.22); if (sz < 0) p.rotation.y = Math.PI; group.add(p); }
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const W = mid + 2 * side + d, H = Math.max(...rMid.map((r) => r.top)) + 1.2;
  return { group, info: { W, H, gap: mid - d } };
}
