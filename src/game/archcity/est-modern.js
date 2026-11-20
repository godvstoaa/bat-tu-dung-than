// ============================================================================
//  HỌ HIỆN ĐẠI cho biệt phủ / biệt thự (docs/bietphu/modern.md, hợp đồng docs/bietphu/00-HOP-DONG.md):
//   kinh     — Hiện Đại Kính: vách kính suốt đố thép mảnh có gân (Seagram / Farnsworth / Glass House), tấm sàn trắng
//              công-xôn, vách travertine hai hồi trượt ra ngoài mặt tiền (Barcelona Pavilion), tầng trên lùi lấy sân thượng.
//   toigian  — Tối Giản Hiện Đại: khối lập phương trắng (Villa Savoye: cửa băng, cột pilotis đỡ tầng công-xôn, vách gió
//              cong trên sân thượng) + bê tông trần lỗ ty (Tadao Ando: khung cửa hộp nhô, cửa sổ ô sâu).
//   nhietdoi — Nhiệt Đới Hiện Đại (Geoffrey Bawa / biệt thự Bali – Việt Nam đương đại): chân tường đá, mái bằng vươn sâu
//              2–2,4 m trần gỗ, lam gỗ đứng che nắng, ban công sâu lan can gỗ, cột gỗ mảnh.
//  Dựng ĐÚNG KHUÔN LÔ (estatekit.js): vách tầng trệt trên chu vi w × d, cửa đi giữa mặt +z 2,8 × 3,0 m mở (không cánh),
//  thêm cửa sau nếu b.back, sàn trong nhà trống ở cao độ b.plinth, nền (w + 2,4) × (d + 2,4) + bậc rộng min(6, 0,3 w).
//  Tầng = b.h / floors (4,2 m: kính 3,75 + sàn 0,45). Bộ dựng chung ở est-modern-kit.js (ad-kit tiên phủ + mats.js).
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, prism, cylY, F4, cw, win, rib, storey, cadre, slab, roofSkin, parapet, gRail, woodRail, louvers, hLouvers, podium, post, cruciform, styleMats, mergeAcc, curtains, doorLeaves } from './est-modern-kit.js';

// ---------------------------------------------------------------- bảng vật liệu từng phong cách (STYLES trong estate-layout.js)
//  'render' = vữa trắng canvas albedo cao (để khối trắng đọc là trắng), 'conc' = bê tông trần Ando; còn lại texture lặp mats.js
const PAL = {
  kinh: {
    wall: ['render', '#f3f2ee'], wall2: ['marble', '#ddd2bb'], slab: ['render', '#f7f6f3'], stone: ['marble', '#d8ceb8'], floor: ['marble', '#e9e5dc'],
    coping: ['marble', '#efece5'], roof: ['stone', '#a6a49e'], onyx: ['marble', '#c9a873'], wood: ['plank', '#7a5236'], water: ['marble', '#3f6f7a', { rough: 0.15 }],
    glass: ['#dce9f0', '#93acbb', '#4a5a63'], frame: '#25282c', rail: '#2a2d31', metal: '#2a2d31', curtain: '#f4efe6',
  },
  toigian: {
    wall: ['render', '#f6f5f1'], conc: 'conc', slab: ['render', '#f8f7f4'], stone: ['stone', '#cfcbc2'], floor: ['marble', '#dedad2'],
    coping: ['marble', '#ecebe6'], roof: ['stone', '#b3b0a8'], wood: ['plank', '#a7845e'], water: ['marble', '#4d8592', { rough: 0.15 }],
    glass: ['#dde8ee', '#97adb9', '#4a565d'], frame: '#7d838a', rail: '#7d838a', metal: '#6f747b', curtain: '#f2efe8',
  },
  nhietdoi: {
    wall: ['render', '#ebdfca'], wall2: ['stone', '#8f8475'], slab: ['render', '#f1ebdf'], stone: ['stone', '#7f766a'], floor: ['plank', '#8e6a48'],
    coping: ['stone', '#9a9081'], roof: ['plank', '#5a5046'], wood: ['plank', '#6e4c30'], lattice: ['plank', '#8a6440'], railWood: ['plank', '#5e4029'],
    soffit: ['plank', '#a57e55'], cushion: ['render', '#efe9dd'], water: ['marble', '#3f7a7a', { rough: 0.15 }],
    glass: ['#d6e4e2', '#86a19f', '#3a4842'], frame: '#3b2c20', rail: '#3b2c20', metal: '#2e2a26', curtain: '#efe6d4',
  },
};
/** biến thể biệt thự (opt.variant 1, 2): đổi màu vách / đá / gỗ trong bảng màu phong cách */
const PALV = {
  toigian: [{}, { wall: ['render', '#efe8dc'], stone: ['stone', '#bdb5a8'], curtain: '#e8ddcc' }, { wall: ['render', '#eceeee'], slab: ['render', '#f2f3f3'], stone: ['stone', '#a7a49d'], frame: '#2f3337', rail: '#2f3337' }],
  nhietdoi: [{}, { wall: ['render', '#e2d0b0'], wall2: ['stone', '#75685a'], roof: ['plank', '#463d35'], lattice: ['plank', '#7a5434'] }, { wall: ['render', '#efe9de'], wall2: ['stone', '#a69b8a'], lattice: ['plank', '#a07a4c'], roof: ['plank', '#6e5d4b'], wood: ['plank', '#8a6340'] }],
};
const MID = /^(railBar|railWood|lattice|fin|curtain|glassRail)/; // bậc vừa (> 75 m) bỏ lan can, lam, gân đố, rèm
const DOOR = { w: 2.8, h: 3.0 }, ST = 0.45;   // cửa đi thông thủy 2,8 × 3,0 m; sàn 0,45 m
const out = (styleId, acc, info, vr = 0) => { const M = styleMats(`${styleId}${vr}`, { ...PAL[styleId], ...(PALV[styleId]?.[vr] || {}) }); return { acc, mats: M.mats, post: M.post, midDrop: MID, info }; };

/** nền chung: bục (w + 2,4) × (d + 2,4) cao plinth, bậc giữa trước (và sau), mặt sàn trong nhà */
function base(acc, b, { key = 'stone' } = {}) {
  const sw = Math.min(6, 0.3 * b.w);
  podium(acc, b.w + 2.4, b.d + 2.4, b.plinth, { key, stairs: [{ side: 1, w: sw }, ...(b.back ? [{ side: -1, w: sw }] : [])] });
  acc.add('floor', boxB(b.w - 0.3, 0.03, b.d - 0.3, 0, b.plinth, 0));
}
const frame = (b) => { const n = Math.max(1, b.floors || 1), sh = b.h / n; return { W: b.w, D: b.d, ph: b.plinth, n, sh, gH: sh - ST, x0: -b.w / 2, x1: b.w / 2, z0: -b.d / 2, z1: b.d / 2, Y: (s) => b.plinth + s * sh }; };
/** các đoạn rèm «kéo dở» trên mặt dài L: bỏ trống vùng cửa giữa (|u − L/2| < 2) — mẫu cố định theo seed, trông có người ở */
function drape(L, seed) {
  const out = []; let u = 0.4, k = seed;
  while (u < L - 1.2) { k = (k * 7 + 3) % 11; const w = 0.7 + (k % 4) * 0.35; if (k % 3 !== 0 && (u + w < L / 2 - 2 || u > L / 2 + 2)) out.push([u, Math.min(L - 0.3, u + w)]); u += w + 1.2 + (k % 5) * 0.6; }
  return out;
}
/** tường hồi hình thang (dưới mái một dốc): mặt phẳng x, dày t, chân yb, đỉnh từ (z0, ya0) tới (z1, ya1) */
function wedgeX(acc, key, x, t, z0, z1, yb, ya0, ya1) {
  const s = new THREE.Shape([new THREE.Vector2(z0, yb), new THREE.Vector2(z1, yb), new THREE.Vector2(z1, ya1), new THREE.Vector2(z0, ya0)]);
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false }); g.rotateY(-Math.PI / 2); g.translate(x + t / 2, 0, 0); acc.add(key, g);
}

// ================================================================ KÍNH (Mies)
function kinhHall(acc, b) {
  const { W, D, ph, n, gH, x0, x1, z0, z1, Y } = frame(b), tr0 = [ph + DOOR.h], FIN = 0.09;
  base(acc, b);
  const floatBox = n === 2;  // nhà phụ: đế kính + hộp trắng lơ lửng công-xôn (Glass House / Brick House)
  const FF = F4(x0, x1, z0, z1);
  // tầng trệt: kính suốt mặt trước + sau; hồi travertine có khe kính đứng (hoặc kính một hồi ở nhà phụ)
  storey(acc, [x0, x1, z0, z1], ph, ph + gH, {
    f: [cw(W, ph, ph + gH, { m: 1.6, tr: tr0, door: DOOR })],
    b: [cw(W, ph, ph + gH, { m: 1.6, tr: tr0, door: b.back ? DOOR : null, mar: b.back ? 0 : W * 0.15 })],
    l: floatBox ? [cw(D, ph, ph + gH, { m: 1.6, tr: tr0 })] : [win(D - 1.6, 1.1, ph, ph + gH - 0.35, { kind: 'grid', m: 1.1, sill: false })],
    r: [win(D - 1.6, 1.1, ph, ph + gH - 0.35, { kind: 'grid', m: 1.1, sill: false }), win(1.6, 1.1, ph, ph + gH - 0.35, { kind: 'grid', m: 1.1, sill: false })],
  }, { key: 'wall2', t: 0.35, fin: FIN });
  curtains(acc, FF.f, drape(W, 3), ph + 0.05, ph + gH - 0.08); curtains(acc, FF.b, drape(W, 5), ph + 0.05, ph + gH - 0.08);
  doorLeaves(acc, FF.f, W / 2, DOOR.w, ph, DOOR.h); if (b.back) doorLeaves(acc, FF.b, W / 2, DOOR.w, ph, DOOR.h);
  // vách travertine trượt ra ngoài mặt tiền 1,6 m ở hai hồi (Barcelona Pavilion)
  for (const s of floatBox ? [1] : [-1, 1]) acc.add('wall2', boxB(0.35, gH, 1.6, s * (W / 2 - 0.175), ph, z1 + 0.8));
  if (floatBox) {
    const v = [x0 - 0.8, x1 + 1.8, z0 - 0.4, z1 + 1.6], L = v[1] - v[0], Dd = v[3] - v[2];
    slab(acc, 'slab', ...v, Y(1), ST);
    storey(acc, v, Y(1), Y(1) + gH, { f: [rib(L, Y(1) + 0.85, Y(1) + 2.65, { mar: 1.0, m: 1.6 })], b: [rib(L, Y(1) + 0.85, Y(1) + 2.65, { mar: 1.0, m: 1.6 })], l: [rib(Dd, Y(1) + 0.85, Y(1) + 2.65, { mar: 1.2, m: 1.6 })], r: [rib(Dd, Y(1) + 0.85, Y(1) + 2.65, { mar: 1.2, m: 1.6 })] }, { key: 'wall', t: 0.3 });
    curtains(acc, F4(...v).f, drape(L, 2).map(([a, c]) => [Math.max(1.05, a), Math.min(L - 1.05, c)]), Y(1) + 0.9, Y(1) + 2.6, { w: -0.4 });
    slab(acc, 'slab', ...v, Y(2), ST); parapet(acc, 'wall', v, Y(2), 0.35, { t: 0.2 }); roofSkin(acc, 'roof', ...v, Y(2), 0.25);
    return;
  }
  // tầng 2: tấm sàn công-xôn 2,2 m ra mặt tiền (ban công lan can kính), kính suốt 4 mặt có gân
  slab(acc, 'slab', x0 - 0.6, x1 + 0.6, z0 - 0.6, z1 + 2.2, Y(1), ST);
  gRail(acc, [[x0 - 0.45, z1 + 0.05], [x0 - 0.45, z1 + 2.05], [x1 + 0.45, z1 + 2.05], [x1 + 0.45, z1 + 0.05]], Y(1));
  const all = (L, y) => [cw(L, y, y + gH, { m: 1.6 })];
  storey(acc, [x0, x1, z0, z1], Y(1), Y(1) + gH, { f: all(W, Y(1)), b: all(W, Y(1)), l: all(D, Y(1)), r: all(D, Y(1)) }, { t: 0.3, fin: FIN });
  curtains(acc, FF.f, drape(W, 7), Y(1) + 0.05, Y(1) + gH - 0.08); curtains(acc, FF.l, drape(D, 1), Y(1) + 0.05, Y(1) + gH - 0.08); curtains(acc, FF.r, drape(D, 4), Y(1) + 0.05, Y(1) + gH - 0.08);
  if (n < 3) { slab(acc, 'slab', x0 - 1.4, x1 + 1.4, z0 - 1.4, z1 + 1.4, Y(2), ST); parapet(acc, 'metal', [x0 - 1.4, x1 + 1.4, z0 - 1.4, z1 + 1.4], Y(2), 0.1, { t: 0.06, cop: null }); roofSkin(acc, 'roof', x0, x1, z0, z1, Y(2), 0.3); return; }
  // tầng 3 lùi: khối kính 2/3 bề ngang, sân thượng phía trước và bên phải; mái tấm mỏng vươn 1,5 m
  slab(acc, 'slab', x0 - 0.6, x1 + 0.6, z0 - 0.6, z1 + 0.6, Y(2), ST); roofSkin(acc, 'floor', x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3, Y(2), 0);
  const tp = [x0, x0 + W * 0.64, z0, z1 - Math.min(3.2, D * 0.25)], tL = tp[1] - tp[0], tD = tp[3] - tp[2];
  gRail(acc, [[tp[1], z0 - 0.45], [x1 + 0.45, z0 - 0.45], [x1 + 0.45, z1 + 0.45], [x0 - 0.45, z1 + 0.45], [x0 - 0.45, tp[3] + 0.1]], Y(2));
  storey(acc, tp, Y(2), Y(2) + gH, { f: all(tL, Y(2)), b: all(tL, Y(2)), l: all(tD, Y(2)), r: all(tD, Y(2)) }, { t: 0.3, fin: FIN });
  curtains(acc, F4(...tp).f, drape(tL, 9), Y(2) + 0.05, Y(2) + gH - 0.08);
  const R = [tp[0] - 1.5, tp[1] + 1.5, tp[2] - 1.5, tp[3] + 1.5];
  slab(acc, 'slab', ...R, Y(3), ST); parapet(acc, 'metal', R, Y(3), 0.1, { t: 0.06, cop: null }); roofSkin(acc, 'roof', ...tp, Y(3), 0.3);
}

// ================================================================ TỐI GIẢN (Savoye + Ando)
/** vách gió cong trên sân thượng (solarium Villa Savoye): cung tâm (cx, cz) bán kính r từ a0 tới a1, dày t, cao h */
function curveWall(acc, key, cx, cz, r, a0, a1, y, h, t = 0.22) {
  const o = [], i = [], n = 14;
  for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; o.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); i.push([cx + Math.cos(a) * (r - t), cz + Math.sin(a) * (r - t)]); }
  acc.add(key, prism([...o, ...i.reverse()], y, h));
}
/** tầng trệt tối giản: tường (bê tông trần / vữa trắng) dày 0,4, vách kính lớn trong khung, cửa đi giữa, khe cửa đứng ở hồi */
function tgGround(acc, b, key) {
  const { W, D, ph, gH, x0, x1, z0, z1 } = frame(b), gw = Math.min(ph + 3.5, ph + gH - 0.4);
  storey(acc, [x0, x1, z0, z1], ph, ph + gH, {
    f: [cw(W, ph, gw, { m: 2.2, mar: Math.min(1.8, W * 0.12), door: DOOR })],
    b: b.back ? [cw(W, ph, gw, { m: 2.2, mar: W * 0.25, door: DOOR })] : [win(W / 2, W * 0.4, ph + 0.9, ph + 3.0, { kind: 'grid', m: 2.2 })],
    l: [win(D * 0.72, 0.75, ph + 0.25, gw, { kind: 'grid', m: 1, sill: false })],
    r: [win(D * 0.28, 0.75, ph + 0.25, gw, { kind: 'grid', m: 1, sill: false })],
  }, { key, t: 0.4 });
  const F = F4(x0, x1, z0, z1).f, m0 = Math.min(1.8, W * 0.12);
  curtains(acc, F, [[m0 + 0.1, m0 + 1.4], [W - m0 - 2.2, W - m0 - 0.1]], ph + 0.05, gw - 0.1, { w: -0.5 });
  doorLeaves(acc, F, W / 2, DOOR.w, ph, DOOR.h, { kind: 'wood', d: 0.2 }); if (b.back) doorLeaves(acc, F4(x0, x1, z0, z1).b, W / 2, DOOR.w, ph, DOOR.h, { kind: 'wood', d: 0.2 });
}
/** mép tường chắn cao h quanh mái v, trừ phần bị khối c (x0, x1, z0, z1) che: dựng 4 cạnh rồi cắt đoạn trong c */
function terraceWall(acc, key, v, c, y, h, t = 0.25) {
  const seg = (ax, az, bx, bz) => { const L = Math.hypot(bx - ax, bz - az); if (L < 0.3) return; const mx = (ax + bx) / 2, mz = (az + bz) / 2, w = Math.abs(bx - ax) > 0.01 ? L : t, d = Math.abs(bx - ax) > 0.01 ? t : L; acc.add(key, boxB(w, h, d, mx, y, mz)); acc.add('coping', boxB(w + 0.06, 0.06, d + 0.06, mx, y + h, mz)); };
  const inC = (x, z) => c && x > c[0] - 0.01 && x < c[1] + 0.01 && z > c[2] - 0.01 && z < c[3] + 0.01;
  const edges = [[v[0], v[3] - t / 2, v[1], v[3] - t / 2], [v[0] + t / 2, v[2] + t, v[0] + t / 2, v[3] - t], [v[0], v[2] + t / 2, v[1], v[2] + t / 2], [v[1] - t / 2, v[2] + t, v[1] - t / 2, v[3] - t]];
  for (const [ax, az, bx, bz] of edges) { // chia mỗi cạnh 40 bước, giữ đoạn liền ngoài khối c
    let run = null; const N = 40;
    for (let i = 0; i <= N; i++) { const s = i / N, x = ax + (bx - ax) * s, z = az + (bz - az) * s, ok = !inC(x, z) && i < N; if (ok && !run) run = [x, z]; if ((!ok || i === N) && run) { seg(run[0], run[1], x, z); run = null; } }
  }
}
function toigianHall(acc, b, villa, vr) {
  const { W, D, ph, n, gH, x0, x1, z0, z1, Y } = frame(b);
  base(acc, b);
  if (villa && vr === 1) { // «hộp Ando»: trệt vữa trắng kính suốt, hai tầng trên là MỘT khối bê tông trần công-xôn sang phải + ra trước, cửa sổ khung hộp, lô-gia khoét
    tgGround(acc, b, 'wall');
    const B = [x0 - 0.2, x1 + 1.8, z0, z1 + 1.2], L = B[1] - B[0], DB = B[3] - B[2], FB = F4(...B), y1 = Y(1), y2 = Y(2);
    slab(acc, 'conc', ...B, y1, ST); slab(acc, 'slab', B[0] + 0.4, B[1] - 0.4, B[2] + 0.4, B[3] - 0.4, y2, 0.3);
    const pw = 3.4, lg = [L * 0.56, L - 0.9];
    storey(acc, B, y1, y1 + 4.2, { f: [win(L * 0.3, pw, y1 + 0.5, y1 + 3.2, { kind: 'grid', m: 1.7, sill: false })], r: [win(DB * 0.5, 0.6, y1 + 0.3, y1 + 3.6, { kind: 'grid', m: 1, sill: false })], l: [win(DB * 0.35, 0.6, y1 + 0.3, y1 + 3.6, { kind: 'grid', m: 1, sill: false })], b: [rib(L, y1 + 1.0, y1 + 2.2, { mar: 1.5 })] }, { key: 'conc', t: 0.4 });
    cadre(acc, FB.f, L * 0.3 - pw / 2, L * 0.3 + pw / 2, y1 + 0.5, y1 + 3.2, { out: 0.6, e: 0.25, key: 'conc' });
    storey(acc, B, y2, y2 + gH, { f: [{ u0: lg[0], u1: lg[1], y0: y2, y1: y2 + gH, kind: 'void' }, win(L * 0.22, 2.6, y2 + 1.0, y2 + 1.6, { kind: 'grid', m: 1.3, sill: false })], r: [rib(DB, y2 + 1.1, y2 + 1.7, { mar: 1.2 })], l: [win(DB * 0.6, 0.6, y2 + 0.3, y2 + 3.4, { kind: 'grid', m: 1, sill: false })], b: [rib(L, y2 + 1.0, y2 + 2.2, { mar: 1.5 })] }, { key: 'conc', t: 0.4 });
    const zr = B[3] - 1.6, xa = B[0] + lg[0], xb = B[0] + lg[1];                                    // lô-gia khoét sâu 1,6 m
    storey(acc, [xa, xb, zr - 0.3, zr], y2, y2 + gH, { f: [cw(xb - xa, y2, y2 + gH, { m: 1.3, door: { w: 1.0, h: 2.6, dc: 0.6 } })], r: 'none', b: 'none', l: 'none' }, { t: 0.2 });
    for (const x of [xa + 0.2, xb - 0.2]) acc.add('conc', boxB(0.4, gH, 1.6, x, y2, zr + 0.8));
    gRail(acc, [[xa + 0.4, B[3] - 0.15], [xb - 0.4, B[3] - 0.15]], y2);
    slab(acc, 'conc', ...B, Y(3), ST); parapet(acc, 'conc', B, Y(3), 0.3, { t: 0.4, cop: 'coping' }); roofSkin(acc, 'roof', ...B, Y(3), 0.45);
    return;
  }
  if (villa && vr === 2) { // «hộp trắng xếp lệch»: trệt bê tông, tầng 2 lệch trái-trước, tầng 3 lệch phải-sau (Jenga), sân thượng lan can kính
    tgGround(acc, b, 'conc');
    const y1 = Y(1), y2 = Y(2), A = [x0 - 1.2, x1 - 1.6, z0 + 0.4, z1 + 1.6], B = [x0 + 2.6, x1 + 1.0, z0 - 0.6, z1 - 2.0];
    const LA = A[1] - A[0], DA = A[3] - A[2], LB = B[1] - B[0], DB = B[3] - B[2], FA = F4(...A), FB = F4(...B);
    slab(acc, 'slab', ...A, y1, ST);
    storey(acc, A, y1, y1 + gH, { f: [rib(LA, y1 + 0.9, y1 + 2.5, { mar: 0.8, m: 1.6 })], l: [win(DA * 0.5, DA * 0.5, y1 + 0.9, y1 + 2.5, { kind: 'grid', m: 1.4 })], r: [win(DA * 0.75, 0.6, y1 + 0.3, y1 + 3.4, { kind: 'grid', m: 1, sill: false })], b: [rib(LA, y1 + 1.0, y1 + 2.2, { mar: 1.5 })] }, { key: 'wall', t: 0.4 });
    curtains(acc, FA.f, [[1.0, 2.4], [LA - 3.6, LA - 1.0]], y1 + 0.95, y1 + 2.45, { w: -0.42 });
    slab(acc, 'slab', ...A, y2, ST); slab(acc, 'slab', ...B, y2 + 0.01, ST); roofSkin(acc, 'floor', ...A, y2, 0.3);
    const pw = Math.min(4.2, LB * 0.5);
    storey(acc, B, y2, y2 + gH, { f: [win(LB * 0.55, pw, y2 + 0.4, y2 + 3.1, { kind: 'grid', m: 2.1, sill: false })], r: [rib(DB, y2 + 1.0, y2 + 2.4, { mar: 0.9 })], l: [win(DB * 0.4, 0.6, y2 + 0.3, y2 + 3.4, { kind: 'grid', m: 1, sill: false })], b: [rib(LB, y2 + 1.0, y2 + 2.2, { mar: 1.2 })] }, { key: 'wall', t: 0.4 });
    cadre(acc, FB.f, LB * 0.55 - pw / 2, LB * 0.55 + pw / 2, y2 + 0.4, y2 + 3.1, { out: 0.5, e: 0.22 });
    gRail(acc, [[B[0], A[2] + 0.15], [A[0] + 0.15, A[2] + 0.15], [A[0] + 0.15, A[3] - 0.15], [A[1] - 0.15, A[3] - 0.15], [A[1] - 0.15, B[3]]], y2);
    slab(acc, 'slab', ...B, Y(3), ST); parapet(acc, 'wall', B, Y(3), 0.5); roofSkin(acc, 'roof', ...B, Y(3), 0.3);
    return;
  }
  tgGround(acc, b, 'conc');
  if (n < 2) { slab(acc, 'slab', x0, x1, z0, z1, Y(1), ST); parapet(acc, 'conc', [x0, x1, z0, z1], Y(1), 0.5); return; }
  // tầng 2: hộp trắng công-xôn ra trước (Savoye), cửa băng dài; nhà phụ — khối lệch sang phải + cửa sổ lớn khung hộp
  const sub = n === 2 && !villa, ov = villa ? 1.5 : 1.8;
  const v1 = sub ? [x0 + 1.4, x1 + 1.6, z0, z1 + 1.6] : [x0, x1, z0, z1 + ov], L1 = v1[1] - v1[0], D1 = v1[3] - v1[2];
  slab(acc, 'slab', ...v1, Y(1), ST);
  const y1 = Y(1), FF1 = F4(...v1);
  if (sub) {
    const pw = Math.min(5.2, L1 * 0.42);
    storey(acc, v1, y1, y1 + gH, { f: [win(L1 * 0.62, pw, y1 + 0.55, y1 + 3.15, { kind: 'grid', m: 1.8, sill: false })], r: [rib(D1, y1 + 1.0, y1 + 2.3, { mar: 1.0 })], l: [win(D1 * 0.5, 0.7, y1 + 0.4, y1 + 3.2, { kind: 'grid', m: 1, sill: false })], b: [rib(L1, y1 + 1.0, y1 + 2.3, { mar: 1.5 })] }, { key: 'wall', t: 0.45 });
    cadre(acc, FF1.f, L1 * 0.62 - pw / 2, L1 * 0.62 + pw / 2, y1 + 0.55, y1 + 3.15, { out: 0.55, e: 0.25 });
    curtains(acc, FF1.f, [[L1 * 0.62 - pw / 2 + 0.1, L1 * 0.62 - pw / 2 + 1.1]], y1 + 0.6, y1 + 3.1, { w: -0.5 });
  } else {
    storey(acc, v1, y1, y1 + gH, { f: [rib(L1, y1 + 0.95, y1 + 2.35, { mar: 1.2, m: 1.6 })], b: [rib(L1, y1 + 0.95, y1 + 2.35, { mar: 1.2, m: 1.6 })], l: [rib(D1, y1 + 0.95, y1 + 2.35, { mar: 1.0, m: 1.6 })], r: [rib(D1, y1 + 0.95, y1 + 2.35, { mar: 1.0, m: 1.6 })] }, { key: 'wall', t: 0.45 });
    curtains(acc, FF1.f, drape(L1, 6).map(([a, c]) => [Math.max(1.3, a), Math.min(L1 - 1.3, c)]).filter(([a, c]) => c - a > 0.4), y1 + 1.0, y1 + 2.3, { w: -0.5 });
    // cột pilotis tròn đỡ mép công-xôn (lệch khỏi trục cửa)
    for (const sx of [-1, 1]) acc.add('slab', cylY(0.17, y1 - ST - ph, sx * W * 0.3, ph, z1 + ov - 0.45, 14));
  }
  slab(acc, 'slab', ...v1, Y(2), ST);
  if (n < 3) { parapet(acc, 'wall', v1, Y(2), 0.55); roofSkin(acc, 'roof', ...v1, Y(2), 0.3); return; }
  // tầng 3: khối lập phương nhỏ lùi về góc sau-phải, sân thượng có tường chắn 1,1 m + vách gió cong
  const y2 = Y(2), v2 = [x1 - W * 0.42, x1, z0, z0 + D1 * 0.66], L2 = v2[1] - v2[0], D2 = v2[3] - v2[2];
  roofSkin(acc, 'floor', ...v1, y2, 0.3);
  terraceWall(acc, 'wall', v1, v2, y2, 1.1);
  const FF2 = F4(...v2), pw = Math.min(3.6, L2 * 0.5);
  storey(acc, v2, y2, y2 + gH, { f: [win(L2 * 0.4, pw, y2 + 0.5, y2 + 3.1, { kind: 'grid', m: 1.8, sill: false })], r: [rib(D2, y2 + 1.0, y2 + 2.2, { mar: 0.9 })], l: [win(D2 * 0.35, 0.7, y2 + 0.3, y2 + 3.2, { kind: 'grid', m: 1, sill: false })], b: [rib(L2, y2 + 1.0, y2 + 2.2, { mar: 1.2 })] }, { key: 'wall', t: 0.45 });
  cadre(acc, FF2.f, L2 * 0.4 - pw / 2, L2 * 0.4 + pw / 2, y2 + 0.5, y2 + 3.1, { out: 0.5, e: 0.22 });
  slab(acc, 'slab', ...v2, Y(3), ST); parapet(acc, 'wall', v2, Y(3), 0.5); roofSkin(acc, 'roof', ...v2, Y(3), 0.3);
  const tw = v2[0] - v1[0], r = Math.min(3.2, tw * 0.33);                                   // vách gió cong (solarium)
  curveWall(acc, 'wall', v1[0] + r + 0.8, v1[2] + r + 0.6, r, Math.PI * 0.5, Math.PI * 1.35, y2, 2.6);
  acc.add('wall', boxB(Math.min(4, tw * 0.35), 2.6, 0.22, v1[0] + r + 0.8 + Math.min(4, tw * 0.35) / 2, y2, v1[2] + 2 * r + 0.6 - 0.11));
}

// ================================================================ NHIỆT ĐỚI (Bawa / Bali – Việt Nam)
function tropicRoof(acc, R, yTop, { t = 0.4 } = {}) {
  slab(acc, 'slab', ...R, yTop, t);
  acc.add('soffit', boxB(R[1] - R[0] - 0.1, 0.03, R[3] - R[2] - 0.1, (R[0] + R[1]) / 2, yTop - t - 0.03, (R[2] + R[3]) / 2));
  parapet(acc, 'metal', [R[0] - 0.05, R[1] + 0.05, R[2] - 0.05, R[3] + 0.05], yTop - t - 0.05, t + 0.14, { t: 0.06, cop: null });
  roofSkin(acc, 'roof', ...R, yTop, 0.15);
}
/** sàn vươn (ban công + mái hiên) có trần gỗ dưới */
function deck(acc, R, y, t = 0.4) { slab(acc, 'slab', ...R, y, t); acc.add('soffit', boxB(R[1] - R[0] - 0.1, 0.03, R[3] - R[2] - 0.1, (R[0] + R[1]) / 2, y - t - 0.03, (R[2] + R[3]) / 2)); }
function ndGround(acc, b, mar) {
  const { W, D, ph, gH, x0, x1, z0, z1 } = frame(b), tr0 = [ph + DOOR.h];
  storey(acc, [x0, x1, z0, z1], ph, ph + gH, {
    f: [cw(W, ph, ph + gH, { m: 1.4, mar, tr: tr0, door: DOOR })],
    b: [cw(W, ph, ph + 3.4, { m: 1.4, mar: W * 0.22, tr: tr0, door: b.back ? DOOR : null })],
    l: [win(D * 0.5, D * 0.42, ph + 0.8, ph + 3.1, { kind: 'grid', m: 1.0, tr: [ph + 2.5] })],
    r: [win(D * 0.5, D * 0.42, ph + 0.8, ph + 3.1, { kind: 'grid', m: 1.0, tr: [ph + 2.5] })],
  }, { key: 'wall2', t: 0.4, fk: 'wood' });
  const FF = F4(x0, x1, z0, z1);
  curtains(acc, FF.f, [[mar + 0.1, mar + 1.2], [W - mar - 1.6, W - mar - 0.1]], ph + 0.05, ph + gH - 0.1, { w: -0.45 });
  doorLeaves(acc, FF.f, W / 2, DOOR.w, ph, DOOR.h, { kind: 'wood', d: 0.2 }); if (b.back) doorLeaves(acc, FF.b, W / 2, DOOR.w, ph, DOOR.h, { kind: 'wood', d: 0.2 });
}
function nhietdoiHall(acc, b, villa, vr) {
  const { W, D, ph, n, gH, x0, x1, z0, z1, Y } = frame(b);
  base(acc, b);
  const FF = F4(x0, x1, z0, z1), y1 = Y(1), y2 = Y(2);
  if (villa && vr === 1) { // «tầng mái chồng» (Bawa): ba lớp mái hiên nằm ngang vươn sâu, lam ngang, ban công bọc góc phải, tầng 3 ốp gỗ
    ndGround(acc, b, 2.0);
    const R1 = [x0 - 0.6, x1 + 2.2, z0 - 0.6, z1 + 1.8]; deck(acc, R1, y1);
    woodRail(acc, [[R1[0] + 0.1, z1], [R1[0] + 0.1, R1[3] - 0.1], [R1[1] - 0.1, R1[3] - 0.1], [R1[1] - 0.1, z0 - 0.5]], y1);
    storey(acc, [x0, x1, z0, z1], y1, y1 + gH, { f: [cw(W, y1, y1 + gH, { m: 1.2, mar: 0.5, tr: [y1 + 2.7] })], r: [cw(D, y1, y1 + gH, { m: 1.2, mar: 0.6, tr: [y1 + 2.7] })], b: [win(W * 0.5, W * 0.4, y1 + 0.9, y1 + 3.0, { kind: 'grid', m: 1.0 })], l: [win(D * 0.5, 1.2, y1 + 0.6, y1 + 3.2, { kind: 'grid', m: 1.2 })] }, { key: 'wall', t: 0.3, fk: 'wood' });
    hLouvers(acc, FF.f, 0.5, W * 0.45, y1 + 0.4, y1 + gH - 0.2, { off: 0.35, step: 0.28 }); hLouvers(acc, FF.r, 0.6, D * 0.5, y1 + 0.4, y1 + gH - 0.2, { off: 0.35, step: 0.28 });
    const R2 = [x0 - 1.6, x1 + 1.6, z0 - 1.6, z1 + 1.6]; deck(acc, R2, y2, 0.35);
    const v = [x0 + 0.6, x1 - 0.6, z0 + 0.6, z1 - 0.6], L = v[1] - v[0], DV = v[3] - v[2];
    storey(acc, v, y2, y2 + gH, { f: [cw(L, y2, y2 + gH, { m: 1.4, mar: 1.0, tr: [y2 + 2.7] })], r: [win(DV * 0.5, 1.4, y2 + 0.6, y2 + 3.2, { kind: 'grid', m: 1.4 })], l: [win(DV * 0.5, 1.4, y2 + 0.6, y2 + 3.2, { kind: 'grid', m: 1.4 })], b: [rib(L, y2 + 1.0, y2 + 2.6, { mar: 1.4 })] }, { key: 'wood', t: 0.3, fk: 'metal' });
    curtains(acc, F4(...v).f, [[1.1, 2.3], [L - 2.6, L - 1.1]], y2 + 0.05, y2 + gH - 0.1);
    tropicRoof(acc, [x0 - 2.3, x1 + 2.3, z0 - 2.3, z1 + 2.3], Y(3), { t: 0.42 });
    return;
  }
  if (villa && vr === 2) { // «màn lam hai tầng + mái một dốc» (biệt thự Việt đương đại): lam gỗ cao suốt tầng 2–3, mái nghiêng nâng về mặt tiền, cửa sổ mái
    ndGround(acc, b, 1.2);
    const R = [x0 - 0.4, x1 + 0.4, z0 - 0.4, z1 + 1.5];
    deck(acc, R, y1); deck(acc, R, y2);
    for (const y of [y1, y2]) {
      storey(acc, [x0, x1, z0, z1], y, y + gH, { f: [cw(W, y, y + gH, { m: 1.3, mar: 0.4, tr: [y + 2.7] })], b: [win(W * 0.3, W * 0.3, y + 0.9, y + 3.0, { kind: 'grid', m: 1.0 }), win(W * 0.72, W * 0.3, y + 0.9, y + 3.0, { kind: 'grid', m: 1.0 })], l: [win(D * 0.45, D * 0.4, y + 0.6, y + 3.2, { kind: 'grid', m: 1.0 })], r: [win(D * 0.55, D * 0.4, y + 0.6, y + 3.2, { kind: 'grid', m: 1.0 })] }, { key: 'wall', t: 0.3, fk: 'wood' });
      woodRail(acc, [[R[0] + 0.1, z1], [R[0] + 0.1, R[3] - 0.15], [R[1] - 0.1, R[3] - 0.15], [R[1] - 0.1, z1]], y, { h: 0.95 });
    }
    curtains(acc, FF.f, [[0.6, 1.8], [W - 2.2, W - 0.6]], y1 + 0.05, y1 + gH - 0.1);
    const Fs = F4(R[0], R[1], z0, R[3]).f, gap = 2.6, yT = Y(3) - 0.05;            // màn lam đứng cao 2 tầng ở mép ban công, chừa ô giữa
    louvers(acc, Fs, 0.15, (R[1] - R[0]) / 2 - gap / 2, y1, yT, { off: -0.12, step: 0.24, sd: 0.12 }); louvers(acc, Fs, (R[1] - R[0]) / 2 + gap / 2, R[1] - R[0] - 0.15, y1, yT, { off: -0.12, step: 0.24, sd: 0.12 });
    slab(acc, 'slab', x0, x1, z0, z1, Y(3), ST);
    const rise = 1.5, zb = z0 - 1.8, zf = z1 + 2.6, yb = Y(3), ang = Math.atan2(rise, zf - zb), Lr = Math.hypot(rise, zf - zb);  // mái một dốc nâng về trước
    const roof = new THREE.BoxGeometry(W + 3.6, 0.32, Lr); roof.rotateX(-ang); roof.translate(0, yb + rise / 2 + 0.16, (zb + zf) / 2); acc.add('roof', roof);
    const sof = new THREE.BoxGeometry(W + 3.5, 0.03, Lr - 0.1); sof.rotateX(-ang); sof.translate(0, yb + rise / 2 - 0.02, (zb + zf) / 2); acc.add('soffit', sof);
    const yAt = (z) => yb + ((z - zb) / (zf - zb)) * rise;
    for (const s of [-1, 1]) wedgeX(acc, 'wall', s * (W / 2 - 0.15), 0.3, z0, z1, yb, yAt(z0) + 0.02, yAt(z1) + 0.02);
    acc.add('wall', boxB(W, yAt(z0) - yb, 0.3, 0, yb, z0 + 0.15));
    storey(acc, [x0 + 0.3, x1 - 0.3, z1 - 0.3, z1], yb, yAt(z1), { f: [cw(W - 0.6, yb, yAt(z1), { m: 1.3 })], r: 'none', b: 'none', l: 'none' }, { t: 0.2, fk: 'wood' });  // cửa sổ mái (clerestory)
    return;
  }
  // ---- biến thể gốc (phủ, nhà phụ, biệt thự 0): ban công sâu, lam đứng tầng 2, tầng 3 ốp gỗ lùi, mái bằng lớn vươn 2,4 m
  ndGround(acc, b, Math.min(1.4, W * 0.1));
  if (n < 2) { tropicRoof(acc, [x0 - 2.2, x1 + 2.2, z0 - 2.2, z1 + 2.2], Y(1)); return; }
  const bf = villa ? 1.7 : 2.0, R1 = [x0 - 0.9, x1 + 0.9, z0 - 0.9, z1 + bf];
  deck(acc, R1, y1);
  woodRail(acc, [[R1[0] + 0.1, z1], [R1[0] + 0.1, R1[3] - 0.1], [R1[1] - 0.1, R1[3] - 0.1], [R1[1] - 0.1, z1]], y1);
  storey(acc, [x0, x1, z0, z1], y1, y1 + gH, {
    f: [cw(W, y1, y1 + gH, { m: 1.2, mar: 0.5, tr: [y1 + 2.7] })],
    b: [win(W * 0.3, W * 0.3, y1 + 0.9, y1 + 3.0, { kind: 'grid', m: 1.0 }), win(W * 0.72, W * 0.3, y1 + 0.9, y1 + 3.0, { kind: 'grid', m: 1.0 })],
    l: [win(D * 0.5, D * 0.5, y1 + 0.5, y1 + 3.2, { kind: 'grid', m: 1.0 })],
    r: [win(D * 0.5, D * 0.5, y1 + 0.5, y1 + 3.2, { kind: 'grid', m: 1.0 })],
  }, { key: 'wall', t: 0.3, fk: 'wood' });
  const gap = Math.min(4.4, W * 0.22);
  louvers(acc, FF.f, 0.5, W / 2 - gap / 2, y1, y1 + gH, { off: 0.4 }); louvers(acc, FF.f, W / 2 + gap / 2, W - 0.5, y1, y1 + gH, { off: 0.4 });
  curtains(acc, FF.f, [[W / 2 - gap / 2 + 0.2, W / 2 - 0.6]], y1 + 0.05, y1 + gH - 0.1);
  for (const k of ['l', 'r']) louvers(acc, FF[k], D * 0.25 - 0.1, D * 0.75 + 0.1, y1 + 0.3, y1 + gH - 0.1, { off: 0.25, step: 0.22 });
  if (n < 3) { // nhà phụ: mái bằng vươn 2 m, cột gỗ ở mép ban công
    tropicRoof(acc, [x0 - 2.0, x1 + 2.0, z0 - 1.6, z1 + bf + 0.4], Y(2));
    for (const x of [R1[0] + 0.25, R1[1] - 0.25]) post(acc, 'wood', x, R1[3] - 0.25, 0.2, y1, Y(2) - 0.43);
    return;
  }
  // tầng 3: khối ốp gỗ lùi sau-trái, sân thượng có mái che; mái bằng lớn vươn 2,4 m trần gỗ, cột gỗ mảnh
  const sb = Math.min(2.8, D * 0.22), v2 = [x0, x1 - W * 0.28, z0, z1 - sb], L2 = v2[1] - v2[0], D2 = v2[3] - v2[2];
  slab(acc, 'slab', x0 - 0.4, x1 + 0.4, z0 - 0.4, z1 + 0.4, y2, 0.4); roofSkin(acc, 'floor', x0 - 0.2, x1 + 0.2, z0 - 0.2, z1 + 0.2, y2, 0);
  storey(acc, v2, y2, y2 + gH, {
    f: [cw(L2, y2, y2 + gH, { m: 1.4, mar: 0.8, tr: [y2 + 2.7] })], r: [cw(D2, y2, y2 + gH, { m: 1.4, mar: 0.6, tr: [y2 + 2.7] })],
    b: [rib(L2, y2 + 1.0, y2 + 2.6, { mar: 1.5, m: 1.2 })], l: [win(D2 * 0.5, 1.2, y2 + 0.6, y2 + 3.2, { kind: 'grid', m: 1.2 })],
  }, { key: 'wood', t: 0.3, fk: 'metal' });
  curtains(acc, F4(...v2).f, [[0.9, 2.0], [L2 * 0.55, L2 * 0.55 + 1.2]], y2 + 0.05, y2 + gH - 0.1);
  woodRail(acc, [[x0 + 0.1, v2[3]], [x0 + 0.1, z1 + 0.25], [x1 + 0.25, z1 + 0.25], [x1 + 0.25, z0 - 0.25], [v2[1], z0 - 0.25]], y2);
  const R = [x0 - 2.4, x1 + 2.4, z0 - 2.4, z1 + 2.4];
  tropicRoof(acc, R, Y(3), { t: 0.45 });
  for (const x of [x0 + 0.3, x0 + W / 3, x0 + (2 * W) / 3, x1 - 0.3]) post(acc, 'wood', x, z1 + 0.15, 0.22, y2, Y(3) - 0.48);
  post(acc, 'wood', x1 + 0.15, z0 + 0.3, 0.22, y2, Y(3) - 0.48);
  hLouvers(acc, FF.l, D * 0.15, D * 0.85, y2 + 0.6, y2 + 2.6, { off: 0.0, key: 'lattice' }); // lam ngang hồi trái tầng 3
}

function hall(styleId, S, b, opt = {}) {
  const acc = new Acc(), villa = !!opt.villa, vr = villa ? (((opt.variant | 0) % 3) + 3) % 3 : 0;
  ({ kinh: kinhHall, toigian: toigianHall, nhietdoi: nhietdoiHall }[styleId])(acc, b, villa, vr);
  return out(styleId, acc, { kind: `est-modern-${styleId}`, villa, variant: vr }, vr);
}

// ================================================================ THÁP (~10 × 10, ~36 m)
function tower(styleId, S, t) {
  const acc = new Acc(), a = Math.min(8.4, t.w * 0.84), q = a / 2;
  if (styleId === 'kinh') { // tháp kính: sảnh kính 5,4 m, 6 tầng 4,5 m có tấm sàn trắng + ban công công-xôn xoay vòng, vương miện lam kính
    const h0 = 0.6, yL = h0 + 5.4, hs = Math.max(4.2, (t.h - yL - 3.0) / 6); podium(acc, t.w, t.d, h0, { stairs: [{ side: 1, w: 3.2 }] });
    const all = (L, y0, y1, o = {}) => [cw(L, y0, y1, { m: 1.4, ...o })];
    storey(acc, [-q, q, -q, q], h0, yL - 0.4, { f: all(a, h0, yL - 0.4, { tr: [h0 + 3.2], door: DOOR }), r: all(a, h0, yL - 0.4, { tr: [h0 + 3.2] }), b: all(a, h0, yL - 0.4, { tr: [h0 + 3.2] }), l: all(a, h0, yL - 0.4, { tr: [h0 + 3.2] }) }, { fin: 0.14 });
    const sides = ['f', 'r', 'b', 'l'], e = 0.4, ex = 0.75;
    for (let k = 0; k <= 6; k++) {
      const y = yL + k * hs, sd = sides[k % 4], P = [-q - e, q + e, -q - e, q + e];
      if (k > 0 && k < 6) { if (sd === 'f') P[3] += ex; if (sd === 'b') P[2] -= ex; if (sd === 'r') P[1] += ex; if (sd === 'l') P[0] -= ex; }
      slab(acc, 'slab', ...P, y, 0.4);
      if (k > 0 && k < 6) { const [a0, a1, b0, b1] = P, c = 0.08; const pts = { f: [[a0 + c, q + e], [a0 + c, b1 - c], [a1 - c, b1 - c], [a1 - c, q + e]], b: [[a1 - c, -q - e], [a1 - c, b0 + c], [a0 + c, b0 + c], [a0 + c, -q - e]], r: [[q + e, b1 - c], [a1 - c, b1 - c], [a1 - c, b0 + c], [q + e, b0 + c]], l: [[-q - e, b0 + c], [a0 + c, b0 + c], [a0 + c, b1 - c], [-q - e, b1 - c]] }[sd]; gRail(acc, pts, y); }
      if (k < 6) storey(acc, [-q, q, -q, q], y, y + hs - 0.4, { f: all(a, y, y + hs - 0.4), r: all(a, y, y + hs - 0.4), b: all(a, y, y + hs - 0.4), l: all(a, y, y + hs - 0.4) }, { fin: 0.14 });
    }
    const yc = yL + 6 * hs, c2 = q - 0.9; // vương miện: hộp kính lùi + lam đứng dày, tấm mái mỏng vươn
    storey(acc, [-c2, c2, -c2, c2], yc, yc + 2.6, { f: all(2 * c2, yc, yc + 2.6, { m: 0.6 }), r: all(2 * c2, yc, yc + 2.6, { m: 0.6 }), b: all(2 * c2, yc, yc + 2.6, { m: 0.6 }), l: all(2 * c2, yc, yc + 2.6, { m: 0.6 }) }, { fin: 0.3 });
    slab(acc, 'slab', -t.w / 2, t.w / 2, -t.d / 2, t.d / 2, yc + 3.0, 0.4); parapet(acc, 'metal', [-t.w / 2, t.w / 2, -t.d / 2, t.d / 2], yc + 3.0, 0.1, { t: 0.06, cop: null }); roofSkin(acc, 'roof', -c2, c2, -c2, c2, yc + 3.0, 0);
    acc.add('frame', cylY(0.06, 3.2, 0, yc + 3.0, 0, 8, 0.03));
    return out(styleId, acc, { kind: 'glass-tower' });
  }
  if (styleId === 'toigian') { // 5 khối lập phương trắng xếp lệch (khối đáy bê tông), khe kính lùi giữa các khối, cửa sổ khung hộp
    const h0 = 0.4; podium(acc, t.w, t.d, h0, { stairs: [{ side: 1, w: 3.2 }] });
    const C = [{ s: a, h: 7.0, dx: 0, dz: 0 }, { s: a - 0.6, h: 6.4, dx: 0.6, dz: -0.5 }, { s: a - 0.4, h: 6.4, dx: -0.6, dz: 0.55 }, { s: a - 0.8, h: 6.4, dx: 0.55, dz: 0.5 }, { s: a - 1.2, h: 6.0, dx: -0.45, dz: -0.45 }];
    const kinds = ['f', 'r', 'b', 'l'];
    let y = h0;
    C.forEach((c, i) => {
      const v = [c.dx - c.s / 2, c.dx + c.s / 2, c.dz - c.s / 2, c.dz + c.s / 2], FF = F4(...v), pk = kinds[(i + 1) % 4], sk = kinds[(i + 3) % 4], s = c.s;
      const ops = { f: [], r: [], b: [], l: [] }, pw = Math.min(4.2, s * 0.5), py0 = y + 1.4, py1 = y + 1.4 + pw * 0.85;
      ops[pk].push(win(s * (i % 2 ? 0.38 : 0.62), pw, py0, py1, { kind: 'grid', m: 2.1, sill: false }));
      ops[sk].push(rib(s, y + 2.4, y + 3.4, { mar: 0.9, m: 1.6 }));
      if (i === 0) ops.f = [cw(s, y, y + 3.6, { mar: s / 2 - 2.0, m: 1.0, door: DOOR })];
      for (const k of kinds) if (!ops[k].length && k !== 'f') ops[k].push(win(s * 0.5, 0.7, y + 1.0, y + c.h - 1.2, { kind: 'grid', m: 1, sill: false }));
      storey(acc, v, y, y + c.h, ops, { key: i === 0 ? 'conc' : 'wall', t: 0.4 });
      if (i > 0 || pk !== 'f') cadre(acc, FF[pk], s * (i % 2 ? 0.38 : 0.62) - pw / 2, s * (i % 2 ? 0.38 : 0.62) + pw / 2, py0, py1, { out: 0.5, e: 0.24 });
      slab(acc, i === 0 ? 'conc' : 'wall', ...v, y + c.h, 0.4);
      y += c.h;
      if (i < C.length - 1) { const nb = Math.min(c.s, C[i + 1].s) / 2 - 0.7, cx = (c.dx + C[i + 1].dx) / 2, cz = (c.dz + C[i + 1].dz) / 2, w = [cx - nb, cx + nb, cz - nb, cz + nb], L = 2 * nb; storey(acc, w, y, y + 0.55, { f: [cw(L, y, y + 0.55, { m: 1.2 })], r: [cw(L, y, y + 0.55, { m: 1.2 })], b: [cw(L, y, y + 0.55, { m: 1.2 })], l: [cw(L, y, y + 0.55, { m: 1.2 })] }, { t: 0.2 }); y += 0.55; }
    });
    const c = C[C.length - 1], v = [c.dx - c.s / 2, c.dx + c.s / 2, c.dz - c.s / 2, c.dz + c.s / 2];
    parapet(acc, 'wall', v, y, 0.6); roofSkin(acc, 'roof', ...v, y, 0.3);
    return out(styleId, acc, { kind: 'cube-tower' });
  }
  // nhietdoi: chân tháp đá 2 tầng, 5 tầng thân kính khung gỗ bọc lam gỗ đứng, tấm sàn vươn 0,6 m, đỉnh sân thượng có mái bằng lớn
  const h0 = 0.6, yb = h0 + 8.4, hs = Math.max(4.2, (t.h - yb - 3.6) / 5); podium(acc, t.w, t.d, h0, { stairs: [{ side: 1, w: 3.2 }] });
  storey(acc, [-q, q, -q, q], h0, yb, {
    f: [cw(a, h0, h0 + 3.6, { mar: a / 2 - 2.1, m: 1.0, door: DOOR, tr: [h0 + DOOR.h] }), win(a / 2, 3.2, h0 + 5.0, h0 + 7.4, { kind: 'grid', m: 1.1 })],
    r: [win(a / 2, 1.1, h0 + 0.9, h0 + 7.4, { kind: 'grid', m: 1.1, tr: [h0 + 4.2] })], l: [win(a / 2, 1.1, h0 + 0.9, h0 + 7.4, { kind: 'grid', m: 1.1, tr: [h0 + 4.2] })],
    b: [win(a / 2, 3.2, h0 + 5.0, h0 + 7.4, { kind: 'grid', m: 1.1 })],
  }, { key: 'wall2', t: 0.45, fk: 'wood' });
  const FF = F4(-q, q, -q, q);
  for (let k = 0; k < 5; k++) {
    const y = yb + k * hs;
    slab(acc, 'slab', -q - 0.6, q + 0.6, -q - 0.6, q + 0.6, y, 0.35);
    const ops = (L) => [cw(L, y, y + hs - 0.35, { m: 1.2, mar: 0.3 })];
    storey(acc, [-q, q, -q, q], y, y + hs - 0.35, { f: ops(a), r: ops(a), b: ops(a), l: ops(a) }, { key: 'wall', t: 0.3, fk: 'wood' });
    for (const s of ['f', 'r', 'b', 'l']) louvers(acc, FF[s], 0.25, a - 0.25, y, y + hs - 0.35, { off: 0.3, step: 0.25, rk: null });
  }
  const yt = yb + 5 * hs; slab(acc, 'slab', -q - 0.6, q + 0.6, -q - 0.6, q + 0.6, yt, 0.35); roofSkin(acc, 'floor', -q, q, -q, q, yt, 0);
  woodRail(acc, [[-q - 0.4, -q - 0.4], [-q - 0.4, q + 0.4], [q + 0.4, q + 0.4], [q + 0.4, -q - 0.4], [-q - 0.4, -q - 0.4]], yt);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) post(acc, 'wood', sx * (q - 0.3), sz * (q - 0.3), 0.26, yt, yt + 3.2);
  acc.add('wood', boxB(1.8, 3.2, 2.2, -q + 1.3, yt, -q + 1.5)); // buồng thang lên sân thượng (ốp gỗ)
  tropicRoof(acc, [-t.w / 2 - 0.6, t.w / 2 + 0.6, -t.d / 2 - 0.6, t.d / 2 + 0.6], yt + 3.65, { t: 0.45 });
  return out(styleId, acc, { kind: 'louver-tower' });
}

// ================================================================ ĐÌNH 7 × 7 (nhà hồ bơi / pergola, nền 0,5 m)
function pav(styleId, S, pv) {
  const acc = new Acc(), ph = 0.5, A = pv.w / 2, H = Math.max(3.2, pv.h);
  if (styleId === 'kinh') { // Barcelona Pavilion thu nhỏ: nền travertine, tấm mái mỏng trên 4 cột thép chữ thập crôm, vách onyx đứng tự do, vách kính, bể phản chiếu
    podium(acc, pv.w, pv.d, ph, { stairs: [{ side: 1, w: 2.6, cx: -0.6 }] });
    acc.add('water', boxB(2.3, 0.02, pv.d - 1.2, A - 1.55, ph, 0));
    slab(acc, 'slab', -A - 0.4, A - 1.9, -A - 0.3, A + 0.3, ph + H + 0.25, 0.25); parapet(acc, 'metal', [-A - 0.4, A - 1.9, -A - 0.3, A + 0.3], ph + H + 0.25, 0.06, { t: 0.05, cop: null });
    for (const [x, z] of [[-A + 0.9, -A + 1.4], [A - 3.3, -A + 1.4], [-A + 0.9, A - 1.4], [A - 3.3, A - 1.4]]) cruciform(acc, 'chrome', x, z, ph, ph + H);
    acc.add('onyx', boxB(3.2, H, 0.18, -0.6, ph, -A + 0.5));
    acc.add('wall2', boxB(0.25, H, 4.6, -A + 0.25, ph, -0.2));
    storey(acc, [-A + 1.6, A - 2.7, -1.2, -0.9], ph, ph + H, { f: [cw(2 * A - 4.3, ph, ph + H, { m: 1.2 })], r: 'none', b: 'none', l: 'none' }, { t: 0.1 });
    acc.add('wall2', boxB(2.4, 0.42, 0.62, -0.7, ph, A - 2.3)); for (const sx of [-1, 1]) acc.add('chrome', boxB(0.05, 0.05, 0.6, -0.7 + sx * 1.1, ph + 0.42, A - 2.3));
    return out(styleId, acc, { kind: 'pav-barcelona' });
  }
  if (styleId === 'toigian') { // Ando: tường bê tông chữ L có khe chữ thập (Nhà thờ Ánh sáng), mái bê tông công-xôn có khe trời, ghế bê tông
    podium(acc, pv.w, pv.d, ph, { key: 'conc', stairs: [{ side: 1, w: 2.8 }] });
    const Fb = F4(-A, A, -A, -A + 0.35).b, ops = [{ u0: A - 0.11, u1: A + 0.11, y0: ph + 0.7, y1: ph + H - 0.3 }, { u0: A - 1.1, u1: A + 1.1, y0: ph + H * 0.62, y1: ph + H * 0.62 + 0.22 }];
    storey(acc, [-A, A, -A, -A + 0.35], ph, ph + H, { b: ops.map((o) => ({ ...o, kind: 'void' })), f: 'none', l: 'none', r: 'none' }, { key: 'conc', t: 0.35 });
    void Fb;
    acc.add('conc', boxB(0.35, H, 4.2, -A + 0.175, ph, -A + 0.35 + 2.1));
    slab(acc, 'conc', -A, A, -A, 0.9, ph + H + 0.3, 0.3); slab(acc, 'conc', -A, A, 1.2, A + 0.4, ph + H + 0.3, 0.3);
    acc.add('frame', cylY(0.08, H, A - 0.6, ph, A - 0.3, 10));
    acc.add('conc', boxB(3.0, 0.45, 0.55, 0.4, ph, -A + 0.7)); acc.add('wood', boxB(2.9, 0.04, 0.5, 0.4, ph + 0.45, -A + 0.7));
    acc.add('water', boxB(pv.w - 1.2, 0.02, 1.6, 0, ph, A - 1.2));
    return out(styleId, acc, { kind: 'pav-ando' });
  }
  // nhietdoi: bale gỗ — 4 cột gỗ, dầm, mái bằng vươn rộng trần lam gỗ, vách lam sau, giường nghỉ
  podium(acc, pv.w, pv.d, ph, { stairs: [{ side: 1, w: 2.8 }] });
  const c = A - 0.75, yr = ph + H;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { post(acc, 'wood', sx * c, sz * c, 0.28, ph, yr); acc.add('stone', boxB(0.44, 0.3, 0.44, sx * c, ph, sz * c)); }
  for (const sz of [-1, 1]) acc.add('wood', boxB(2 * c + 0.5, 0.36, 0.22, 0, yr - 0.36, sz * c)); for (const sx of [-1, 1]) acc.add('wood', boxB(0.22, 0.3, 2 * c + 0.5, sx * c, yr - 0.66, 0));
  const R = [-A - 0.9, A + 0.9, -A - 0.9, A + 0.9];
  slab(acc, 'slab', ...R, yr + 0.45, 0.4); parapet(acc, 'metal', [R[0] - 0.05, R[1] + 0.05, R[2] - 0.05, R[3] + 0.05], yr, 0.5, { t: 0.06, cop: null }); roofSkin(acc, 'roof', ...R, yr + 0.45, 0.15);
  for (let x = R[0] + 0.25; x < R[1] - 0.1; x += 0.3) acc.add('lattice', boxB(0.07, 0.07, R[3] - R[2] - 0.3, x, yr - 0.07, 0));
  louvers(acc, F4(-c, c, -c, c).b, 0.3, 2 * c - 0.3, ph, ph + 2.4, { off: -0.1, step: 0.2 });
  acc.add('wood', boxB(2.4, 0.38, 1.7, 0, ph, -0.6)); acc.add('cushion', boxB(2.3, 0.16, 1.6, 0, ph + 0.38, -0.6));
  return out(styleId, acc, { kind: 'pav-bale' });
}

// ================================================================ CỔNG
/** cổng: gốc = tâm khe trên đường tường rào (z = 0), lối qua |x| < g.w/2 − 0,4 thông, nhà cổng lùi về −z */
function gate(styleId, S, g, opt = {}) {
  const acc = new Acc(), hw = g.w / 2;
  if (g.villa) { // biến thể: 0 hai trụ + tấm mái mỏng · 1 tường danh bạ + cột mảnh đỡ tấm mái công-xôn · 2 khung cổng (trụ + dầm) có giàn lam trên
    const vr = (((opt.variant | 0) % 3) + 3) % 3, nd = styleId === 'nhietdoi';
    const pk = styleId === 'toigian' ? (vr === 1 ? 'conc' : 'wall') : 'wall2', px = hw + 0.3, lk = nd ? 'lattice' : 'frame';
    const panel = (x0, z) => { for (let x = x0; x < x0 + g.w; x += 0.16) acc.add(lk, boxB(0.05, 1.8, 0.05, x, 0.08, z)); acc.add(nd ? 'wood' : 'frame', boxB(g.w + 0.1, 0.08, 0.08, x0 + g.w / 2, 1.88, z)); acc.add('frame', boxB(g.w + 0.1, 0.08, 0.08, x0 + g.w / 2, 0.02, z)); };
    acc.add('frame', boxB(g.w + 1.2, 0.02, 0.12, 0, 0, -0.75));
    if (vr === 1) {
      const wx = -px - 0.6;
      acc.add(pk, boxB(2.0, 2.5, 0.45, wx - 0.4, 0, -0.35)); acc.add('stone', boxB(2.2, 0.1, 0.6, wx - 0.4, 0, -0.35));
      acc.add('metal', boxB(0.7, 0.18, 0.02, wx - 0.4, 1.7, -0.12)); acc.add('chrome', boxB(0.12, 0.3, 0.1, wx + 0.3, 1.95, -0.08));
      post(acc, nd ? 'wood' : 'frame', px, 0.4, nd ? 0.2 : 0.12, 0, 2.9);
      if (nd) tropicRoof(acc, [wx - 1.6, px + 0.5, -1.3, 0.9], 3.2, { t: 0.3 }); else slab(acc, 'slab', wx - 1.4, px + 0.4, -1.2, 0.8, 3.1, 0.2);
      panel(wx - 1.4 - g.w + 1.6, -0.75 - 0.25);
      return out(styleId, acc, { kind: 'gate-v1' }, vr);
    }
    for (const sx of [-1, 1]) { acc.add(pk, boxB(0.55, vr === 2 ? 2.9 : 2.7, 0.55, sx * px, 0, -0.3)); acc.add('stone', boxB(0.7, 0.12, 0.7, sx * px, 0, -0.3)); }
    if (vr === 2) {
      acc.add(pk, boxB(2 * px + 0.55, 0.4, 0.55, 0, 2.9, -0.3));
      for (let z = -1.5; z <= 0.9; z += 0.3) acc.add(lk, boxB(2 * px + 1.4, 0.12, 0.06, 0, 3.3, z));
      for (const sx of [-1, 1]) acc.add(nd ? 'wood' : 'frame', boxB(0.1, 0.16, 2.6, sx * (px - 0.1), 3.3 - 0.16, -0.3));
    } else if (nd) tropicRoof(acc, [-px - 0.6, px + 0.6, -1.4, 0.8], 3.25, { t: 0.3 });
    else { slab(acc, 'slab', -px - 0.5, px + 1.4, -1.2, 0.7, 3.0, 0.22); parapet(acc, 'metal', [-px - 0.52, px + 1.42, -1.22, 0.72], 2.76, 0.3, { t: 0.04, cop: null }); }
    panel(px + 0.35, -0.75);
    return out(styleId, acc, { kind: `gate-v${vr}` }, vr);
  }
  const gx = hw + 0.5; // mép trong hai khối cổng (lối qua 8 m sạch)
  acc.add('stone', boxB(2 * gx + 12, 0.06, 7.5, 1.0, 0, -2.6)); // sân lát trước / dưới cổng
  if (styleId === 'kinh') {
    // nhà gác kính bên trái (mái tấm trắng vươn qua lối thành mái hiên công-xôn), vách travertine bên phải có cánh trượt lam thép đỗ phía sau
    const gh = [-gx - 4.6, -gx, -5.4, -1.0];
    slab(acc, 'stone', ...gh, 0.15, 0.09);
    storey(acc, gh, 0.15, 3.1, { f: [cw(4.6, 0.15, 3.1, { m: 1.15, tr: [2.4] })], l: [cw(4.4, 0.15, 3.1, { m: 1.1 })], b: [cw(4.6, 0.15, 3.1, { m: 1.15 })], r: [cw(4.4, 0.15, 3.1, { m: 1.1, door: { w: 1.0, h: 2.3, dc: 0.6 } })] }, { fin: 0.08, t: 0.25 });
    slab(acc, 'slab', -gx - 5.4, gx + 1.6, -6.0, 1.4, 3.55, 0.35); parapet(acc, 'metal', [-gx - 5.4, gx + 1.6, -6.0, 1.4], 3.55, 0.08, { t: 0.05, cop: null });
    acc.add('frame', boxB(0.18, 3.2, 0.18, gx + 1.0, 0, 0.9));
    acc.add('wall2', boxB(5.6, 2.8, 0.35, gx + 2.8, 0, -0.35));
    acc.add('metal', boxB(1.6, 0.22, 0.03, gx + 2.4, 1.9, 0.01));
    for (const [zz, off] of [[-0.75, 0], [-0.95, 0.2]]) { for (let x = gx + 0.3 + off; x < gx + 0.3 + off + 4.6; x += 0.18) acc.add('frame', boxB(0.06, 2.2, 0.04, x, 0.08, zz)); acc.add('frame', boxB(4.7, 0.08, 0.08, gx + 2.6 + off, 2.28, zz)); acc.add('frame', boxB(4.7, 0.08, 0.08, gx + 2.6 + off, 0.04, zz)); }
    acc.add('frame', boxB(2 * gx + 0.2, 0.02, 0.14, 0, 0.06, -0.85));
    return out(styleId, acc, { kind: 'gate-glass' });
  }
  if (styleId === 'toigian') {
    // hai khối bê tông trần (trái cao có khe ngang, phải thấp), tấm mái trắng công-xôn vươn từ khối trái qua lối, cánh trượt lam trắng đỗ sau khối phải
    acc.add('conc', boxB(5.2, 3.6, 4.2, -gx - 2.6, 0, -2.1 - 0.35));
    const Fl = F4(-gx - 5.2, -gx, -4.55, -0.35).f; void Fl;
    acc.add('frame', boxB(3.6, 0.18, 0.06, -gx - 2.6, 2.3, -0.33));
    acc.add('conc', boxB(5.0, 2.6, 0.4, gx + 2.5, 0, -0.4));
    slab(acc, 'slab', -gx - 2.0, gx + 0.8, -5.4, 1.2, 3.95, 0.3);
    for (const [zz, off] of [[-0.85, 0], [-1.05, 0.2]]) { for (let x = gx + 0.25 + off; x < gx + 0.25 + off + 4.5; x += 0.2) acc.add('frame', boxB(0.07, 2.1, 0.05, x, 0.08, zz)); acc.add('frame', boxB(4.6, 0.08, 0.08, gx + 2.5 + off, 2.18, zz)); }
    acc.add('frame', boxB(2 * gx + 0.2, 0.02, 0.14, 0, 0.06, -0.95));
    acc.add('slab', boxB(0.3, 2.8, 0.3, gx + 0.15 + 4.85, 0, -0.4 + 0.5));
    return out(styleId, acc, { kind: 'gate-concrete' });
  }
  // nhietdoi: hai trụ tường đá ốp, mái bằng gỗ vươn sâu trên 4 cột gỗ, cánh trượt lam gỗ đỗ sau tường phải
  acc.add('wall2', boxB(3.4, 2.9, 1.2, -gx - 1.7, 0, -0.9)); acc.add('wall2', boxB(5.2, 2.5, 0.5, gx + 2.6, 0, -0.5));
  acc.add('coping', boxB(3.5, 0.1, 1.3, -gx - 1.7, 2.9, -0.9)); acc.add('coping', boxB(5.3, 0.1, 0.6, gx + 2.6, 2.5, -0.5));
  for (const x of [-gx + 0.15, gx - 0.15]) for (const z of [0.9, -4.6]) post(acc, 'wood', x, z, 0.24, 0, 3.4);
  for (const x of [-gx + 0.15, gx - 0.15]) acc.add('wood', boxB(0.24, 0.32, 6.0, x, 3.08, -1.85));
  tropicRoof(acc, [-gx - 1.8, gx + 1.8, -6.2, 2.4], 3.85, { t: 0.42 });
  for (let x = -gx + 0.4; x < gx - 0.3; x += 0.3) acc.add('lattice', boxB(0.07, 0.07, 8.0, x, 3.3, -1.9));
  for (let x = gx + 0.3; x < gx + 4.9; x += 0.17) acc.add('lattice', boxB(0.06, 2.1, 0.06, x, 0.1, -0.95));
  acc.add('wood', boxB(4.7, 0.09, 0.09, gx + 2.6, 2.18, -0.95)); acc.add('frame', boxB(2 * gx + 0.2, 0.02, 0.14, 0, 0.06, -0.95));
  return out(styleId, acc, { kind: 'gate-tropical' });
}

void mergeAcc; void THREE;
export const FAMILY = { hall, tower, pav, gate };
