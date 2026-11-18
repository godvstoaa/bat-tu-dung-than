// ============================================================================
//  BỘ DỰNG KIẾN TRÚC CUNG ĐÌNH THANH (Cung Vương phủ) — theo docs/tienphu-nghiencuu/01-trunghoa.md và
//  docs/TIEN-PHU-KIENTRUC-MANIFEST.md §4. Hệ tỉ lệ 《工程做法》 nhân hệ số khu k (mặc định 1,5).
//  Loại hình: hall (điện / đường / hiên / trai — yết sơn, ngạnh sơn, quyển bằng, câu liên đáp; có / không đấu củng),
//  lou (lâu 2 tầng có hành lang), pavilion (đình chóp vuông / lục / bát giác, 1–3 vành mái, hoặc yết sơn chữ nhật),
//  gate (cổng: môn lâu 3 / 5 gian), tower (lầu các bát giác nhiều tầng có bình tọa).
//  Mọi hàm trả { acc, info } — acc: bộ gom theo khoá vật liệu (kit.Acc), info: số đo thật đã dựng (cho bản vẽ / kiểm).
// ============================================================================
import * as THREE from 'three';
import { Acc, box, boxB, cyl, beam, slabXY, lathe, rectRoof, polyRoof, roofProfile, ridgeGeo, silhouette, V } from './kit.js';
import { columnRing } from '../tower.js';

export const CN_COL = {
  stone: '#b9bcb6', marble: '#e6e2d6', col: '#9e2a22', beam: '#2b5c8a', beam2: '#2e7d5b', gold: '#c8a042', door: '#8e2620',
  brick: '#7e8183', tileGreen: '#3e7b4f', tileGray: '#5f6467', tileYellow: '#d8a62a', floor: '#4a4d4f', plaster: '#b4372c',
  lattice: '#3a2416', paper: '#efe6cf',
};

// ---------------------------------------------------------------- vật liệu (canvas thủ tục — chỉ trong trình duyệt)
function canvasTex(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
/** thải họa toàn tử 旋子彩画: 箍头 hai đầu · 藻头 hoa xoáy · 枋心 giữa (xanh lam / xanh lục xen nhau, điểm vàng) */
function caihuaTex(alt = false) {
  return canvasTex(512, 64, (g, w, h) => {
    const A = alt ? CN_COL.beam2 : CN_COL.beam, B = alt ? CN_COL.beam : CN_COL.beam2;
    g.fillStyle = A; g.fillRect(0, 0, w, h);
    g.fillStyle = B; g.fillRect(0, 0, 40, h); g.fillRect(w - 40, 0, 40, h);                       // 箍头
    g.fillStyle = CN_COL.gold; g.fillRect(38, 0, 4, h); g.fillRect(w - 42, 0, 4, h);
    for (const x0 of [44, w - 150]) { for (let i = 0; i < 3; i++) { g.strokeStyle = '#e8e2d0'; g.lineWidth = 3; g.beginPath(); g.arc(x0 + 18 + i * 34, h / 2, 14, 0, Math.PI * 2); g.stroke(); g.fillStyle = CN_COL.gold; g.beginPath(); g.arc(x0 + 18 + i * 34, h / 2, 4, 0, Math.PI * 2); g.fill(); } } // 旋花
    g.fillStyle = B; g.beginPath(); g.moveTo(170, h / 2); g.lineTo(196, 8); g.lineTo(w - 196, 8); g.lineTo(w - 170, h / 2); g.lineTo(w - 196, h - 8); g.lineTo(196, h - 8); g.closePath(); g.fill(); // 枋心
    g.strokeStyle = CN_COL.gold; g.lineWidth = 3; g.stroke();
  });
}
/** cửa bức bàn: khung đỏ, ô song «bộ bộ cẩm» 步步锦 nâu sẫm trên nền giấy, tấm váy dưới */
function geshanTex() {
  return canvasTex(128, 320, (g, w, h) => {
    g.fillStyle = CN_COL.door; g.fillRect(0, 0, w, h);
    const lx = 12, ly = 14, lw = w - 24, lh = h * 0.56;
    g.fillStyle = CN_COL.paper; g.fillRect(lx, ly, lw, lh);
    g.strokeStyle = CN_COL.lattice; g.lineWidth = 5;
    for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) { const x = lx + 6 + c * (lw - 12) / 3, y = ly + 6 + r * (lh - 12) / 7; g.strokeRect(x + (r % 2) * 6, y, (lw - 12) / 3 - 12, (lh - 12) / 7 - 6); }
    g.strokeStyle = CN_COL.gold; g.lineWidth = 2; g.strokeRect(lx, ly, lw, lh);
    g.fillStyle = '#7a1f1a'; g.fillRect(lx, ly + lh + 12, lw, 18);                                // 绦环板
    g.fillRect(lx, ly + lh + 42, lw, h - (ly + lh + 42) - 14);                                      // 裙板
    g.strokeStyle = CN_COL.gold; g.strokeRect(lx + 8, ly + lh + 50, lw - 16, h - (ly + lh + 50) - 22);
  });
}
function brickTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = CN_COL.brick; g.fillRect(0, 0, w, h); g.strokeStyle = '#a9aaa4'; g.lineWidth = 2;
    for (let r = 0; r < 16; r++) { const y = (r * h) / 16; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 8; c++) { const x = ((c + (r % 2) * 0.5) * w) / 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h / 16); g.stroke(); } }
  });
}
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, ...o });
let MATS = null;
/** vật liệu Trung Hoa (khoá vật liệu dùng trong acc) */
export function cnMats() {
  if (MATS) return MATS;
  const ch = caihuaTex(false), ch2 = caihuaTex(true), gs = geshanTex(), br = brickTex();
  if (br) { br.wrapS = br.wrapT = THREE.RepeatWrapping; }
  MATS = {
    stone: std({ color: CN_COL.stone }), marble: std({ color: CN_COL.marble, roughness: 0.6 }), col: std({ color: CN_COL.col, roughness: 0.55 }),
    beam: std(ch ? { map: ch } : { color: CN_COL.beam }), beam2: std(ch2 ? { map: ch2 } : { color: CN_COL.beam2 }),
    dougong: std({ color: CN_COL.beam2, roughness: 0.7 }), dougongB: std({ color: CN_COL.beam, roughness: 0.7 }), gold: std({ color: CN_COL.gold, roughness: 0.35, metalness: 0.6 }),
    door: std(gs ? { map: gs } : { color: CN_COL.door }), brick: std(br ? { map: br } : { color: CN_COL.brick }),
    tileGreen: std({ color: CN_COL.tileGreen, roughness: 0.45, side: THREE.DoubleSide }), ribGreen: std({ color: '#346b43', roughness: 0.4 }),
    tileGray: std({ color: CN_COL.tileGray, roughness: 0.7, side: THREE.DoubleSide }), ribGray: std({ color: '#53585b', roughness: 0.7 }),
    ridgeGreen: std({ color: '#2f6640', roughness: 0.45 }), ridgeGray: std({ color: '#4b5053', roughness: 0.7 }), edgeYellow: std({ color: CN_COL.tileYellow, roughness: 0.4 }),
    plaster: std({ color: CN_COL.plaster }), floor: std({ color: CN_COL.floor }), wood: std({ color: '#6b3a22' }), paper: std({ color: CN_COL.paper }),
  };
  return MATS;
}

// ---------------------------------------------------------------- cấu kiện
/** nền đá 台明: khối + viền đá đầu 阶条石 + đá góc + bậc 踏跺 có 垂带 tại các gian cho trước */
export function platform(acc, { W, D, h, x = 0, z = 0, stairs = [] }) {
  acc.add('stone', boxB(W, h - 0.12, D, x, 0, z)); acc.plat({ x, z, w: W, d: D, top: h });
  acc.add('marble', boxB(W + 0.06, 0.12, D + 0.06, x, h - 0.12, z));                            // 阶条石
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) acc.add('marble', boxB(0.5, h - 0.12, 0.5, x + sx * (W / 2 - 0.22), 0, z + sz * (D / 2 - 0.22))); // 角柱石
  for (const s of stairs) { // { side: 1 (trước, +z) / -1 (sau), cx, w }
    const n = Math.max(2, Math.round(h / 0.16)), rise = h / n, run = 0.34, zE = z + s.side * D / 2;
    for (let i = 0; i < n; i++) { acc.add('stone', boxB(s.w, rise * (i + 1), run, x + s.cx, 0, zE + s.side * (run * (n - i - 0.5)))); acc.plat({ x: x + s.cx, z: zE + s.side * (run * (n - i - 0.5)), w: s.w, d: run + 0.02, top: rise * (i + 1) }); }
    for (const sx of [-1, 1]) { // 垂带 dốc hai bên
      const a = V(x + s.cx + sx * (s.w / 2 + 0.25), h, zE), b = V(x + s.cx + sx * (s.w / 2 + 0.25), 0.2, zE + s.side * n * run);
      acc.add('marble', beam(a, b, 0.5, 0.3)); acc.add('stone', boxB(0.5, Math.max(0.2, h * 0.15), n * run, x + s.cx + sx * (s.w / 2 + 0.25), 0, zE + s.side * n * run / 2));
    }
  }
  return { top: h, W, D };
}
/** lan can đá 寻杖栏杆 theo đường gấp khúc (y = mặt nền): trụ đầu sen mỗi ~1,9 m, tay vịn, tấm hoa bình */
export function balustrade(acc, pts, y, { h = 1.1, step = 1.9, key = 'marble' } = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / step)), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2;
    for (let j = 0; j <= n; j++) { if (i > 0 && j === 0) continue; const t = j / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t; acc.add(key, boxB(0.24, h, 0.24, x, y, z)); acc.add(key, lathe([[0.001, 0], [0.16, 0.05], [0.17, 0.16], [0.1, 0.3], [0.001, 0.36]], x, y + h, z, 8)); }
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    acc.add(key, box(L, 0.1, 0.12, mx, y + h * 0.82, mz, ry));                                    // 寻杖
    acc.add(key, box(L, h * 0.42, 0.1, mx, y + 0.12 + h * 0.21, mz, ry));                          // 栏板
    acc.add(key, box(L, 0.12, 0.2, mx, y + 0.06, mz, ry));                                         // 地栿
  }
}
/** cột tròn có thu đầu 1 % + chân tảng 柱础 */
export function column(acc, x, z, y0, h, d, key = 'col') {
  acc.add(key, cyl(d / 2, d / 2 * 0.99, h, x, y0, z, 14));
  acc.add('stone', lathe([[d * 0.95, 0], [d * 0.95, 0.1], [d * 0.72, 0.22], [d * 0.55, 0.26]], x, y0, z, 14));
}
/** một bộ đấu củng (五踩: 1 đấu lớn, 2 tầng củng vươn ra trước, 2 vươn ngang) — gốc tại (0,0,0), hướng ra +z; dk = đấu khẩu (m) */
export function dougongSet(dk, ry = 0) {
  const g = [], k = dk;
  g.push(boxB(3 * k, 2 * k, 3 * k, 0, 0, 0));                                                     // 坐斗
  g.push(boxB(2.0 * k, 1.4 * k, 9.2 * k, 0, 2 * k, 1.5 * k)); g.push(boxB(9.2 * k, 1.4 * k, 1.4 * k, 0, 2 * k, 0)); // 头翘 + 正心瓜栱
  g.push(boxB(1.6 * k, 1.2 * k, 1.6 * k, 0, 3.4 * k, 4.6 * k));                                   // 十八斗
  g.push(boxB(2.0 * k, 1.4 * k, 12.2 * k, 0, 4.6 * k, 3 * k)); g.push(boxB(12.2 * k, 1.4 * k, 1.4 * k, 0, 4.6 * k, 0)); g.push(boxB(10 * k, 1.4 * k, 1.4 * k, 0, 4.6 * k, 4.6 * k)); // 二翘 / 昂 + 万栱 + 外拽瓜栱
  g.push(boxB(1.6 * k, 1.2 * k, 1.6 * k, 0, 6 * k, 9 * k));
  g.push(boxB(2.0 * k, 1.6 * k, 14 * k, 0, 7.2 * k, 3.8 * k)); g.push(boxB(14 * k, 1.4 * k, 1.4 * k, 0, 7.2 * k, 9 * k)); // 耍头 + 厢栱
  g.push(boxB(2 * k, 1.8 * k, 10 * k, 0, 8.8 * k, 3 * k));                                        // 撑头木 / 桁椀
  const m = new THREE.Matrix4().makeRotationY(ry);
  return g.map((x) => x.applyMatrix4(m));
}
/** hàng đấu củng trên 平板枋 dọc đoạn (ax,az)→(bx,bz), mặt ngoài theo pháp tuyến (nx,nz); trả chiều cao bộ */
export function dougongRow(acc, ax, az, bx, bz, y, nx, nz, dk, spacing, alt = 0) {
  const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / spacing)), ry = Math.atan2(nx, nz);
  for (let i = 0; i <= n; i++) { const t = i / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t; for (const g of dougongSet(dk, ry)) { g.translate(x, y, z); acc.add((i + alt) % 2 ? 'dougong' : 'dougongB', g); } }
  return 10.6 * dk;
}
/** cửa bức bàn 隔扇 trong một gian (x0..x1) trên mặt phẳng z (mặt ngoài +z nếu side = 1): n cánh, khung 抱框 + 横披 */
export function geshanBay(acc, x0, x1, z, y0, h, n = 4, open = false) {
  const w = (x1 - x0 - 0.3) / n, hh = h * 0.84;
  acc.add('col', boxB(0.15, h, 0.2, x0 + 0.075, y0, z)); acc.add('col', boxB(0.15, h, 0.2, x1 - 0.075, y0, z)); // 抱框
  acc.add('col', boxB(x1 - x0, 0.22, 0.22, (x0 + x1) / 2, y0 + hh, z));                           // 中槛
  acc.add('door', boxB(x1 - x0 - 0.3, h - hh - 0.22, 0.08, (x0 + x1) / 2, y0 + hh + 0.22, z));     // 横披 (ô song trên)
  for (let i = 0; i < n; i++) { if (open && (i === n / 2 - 1 || i === n / 2)) continue; acc.add('door', boxB(w - 0.04, hh, 0.09, x0 + 0.15 + w * (i + 0.5), y0, z)); }
}
/** cửa sổ hạm song 槛窗 trên tường thấp 槛墙 */
export function windowBay(acc, x0, x1, z, y0, h, n = 4) {
  const wall = h * 0.3; acc.add('brick', boxB(x1 - x0, wall, 0.5, (x0 + x1) / 2, y0, z));
  geshanBay(acc, x0, x1, z, y0 + wall, h - wall, n);
}
/** vẫn thú 吻兽 (biên dạng: miệng ngậm bờ, đuôi cuộn lên) — chân tại (x, y, z), quay mặt vào trong theo hướng sx */
export function chiwen(acc, x, y, z, hgt, sx, key) {
  const s = hgt / 1.0, pts = [[0, 0], [0.62, 0], [0.62, 0.18], [0.36, 0.3], [0.5, 0.52], [0.6, 0.78], [0.5, 1.0], [0.3, 0.92], [0.4, 0.74], [0.24, 0.6], [0.06, 0.62], [0.12, 0.42], [0, 0.36]];
  acc.add(key, silhouette(pts.map(([a, b]) => [-sx * a, b]), 0.28 * s, x, y, z, 0, s));
}
/** linh vật 仙人走兽 trên bờ góc: n con (đầu là tiên cưỡi gà) xếp từ đầu bờ vào trong */
export function beasts(acc, ridgePts, n, size, key) {
  if (!ridgePts || ridgePts.length < 2 || !n) return;
  const a = ridgePts[0], b = ridgePts[Math.min(ridgePts.length - 1, 3)], dir = new THREE.Vector3().subVectors(b, a).normalize(), ry = Math.atan2(dir.x, dir.z);
  const body = [[-0.3, 0], [0.3, 0], [0.32, 0.4], [0.2, 0.55], [0.26, 0.85], [0.08, 1.0], [-0.06, 0.8], [-0.24, 0.5], [-0.32, 0.34]];
  for (let i = 0; i < n; i++) { const t = 0.7 * size + i * 0.62 * size, p = a.clone().addScaledVector(dir, t); acc.add(key, silhouette(body, 0.22, p.x, p.y + 0.12, p.z, ry + Math.PI / 2, size)); }
}
/** đầu rui (hàng vuông xanh dưới mép hiên) dọc một cạnh */
function rafterEnds(acc, x0, x1, z, y, step, sz = 1, ry = 0) {
  for (let x = x0 + step / 2; x < x1; x += step) { const g = box(0.16, 0.16, 0.5, 0, 0, 0); g.translate(x, y, z - sz * 0.2); if (ry) g.rotateY(ry); acc.add('dougongB', g); }
}

/** ghế lan can 美人靠 giữa hai cột (đình, thủy tạ) */
export function benchRail(acc, ax, az, bx, bz, y) {
  const L = Math.hypot(bx - ax, bz - az); if (L < 0.5) return; const ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2, mx = (ax + bx) / 2, mz = (az + bz) / 2;
  acc.add('col', box(L, 0.1, 0.42, mx, y + 0.48, mz, ry)); acc.add('col', box(L, 0.45, 0.08, mx, y + 0.24, mz, ry)); acc.add('col', box(L, 0.07, 0.08, mx, y + 0.95, mz, ry));
  const n = Math.max(2, Math.round(L / 0.5)); for (let i = 0; i <= n; i++) { const t = i / n; acc.add('col', box(0.06, 0.45, 0.06, ax + (bx - ax) * t, y + 0.75, az + (bz - az) * t)); }
}
/** xà gồ tròn dọc trục x */
const purlin = (L, r, y, z) => new THREE.CylinderGeometry(r, r, L, 10).rotateZ(Math.PI / 2).translate(0, y, z);

// ---------------------------------------------------------------- MÁI hoàn chỉnh trên khung chữ nhật
/**
 * roof: { type: 'xieshan'|'gable'|'xuanshan'|'hip'|'juanpeng'|'goulianda'|'ring', tile: 'Green'|'Gray', beasts, ridgeH, lift, edge: 'Yellow'? }
 * khung cột W × D (tim cột), yCol = cao mặt trên kết cấu đỡ mái tại tim cột, over = mái vươn ngang từ tim cột
 */
export function cnRoof(acc, { W, D, yCol, over, roof, zc = 0, wallT = 0.9 }) {
  const t = roof.tile || 'Gray', tile = `tile${t}`, rib = `rib${t}`, ridge = `ridge${t}`;
  const juan = roof.type === 'juanpeng' || roof.type === 'goulianda';
  const gableish = ['gable', 'juanpeng', 'goulianda', 'xuanshan'].includes(roof.type);
  const ezBase = D / 2 + over, exBase = gableish ? W / 2 + (roof.type === 'xuanshan' ? over * 0.7 : wallT) : W / 2 + over;
  const flySlope = roof.fly ?? 0.2, yEdge = yCol - over * flySlope;
  const nq = roof.n || 2, span = (D + 2 * over) / nq;
  const parts = roof.type === 'goulianda' ? Array.from({ length: nq }, (_, i) => ({ zc: zc + D / 2 + over - span * (i + 0.5), ez: span / 2 })) : [{ zc, ez: ezBase }];
  const out = [];
  for (const p of parts) {
    const slopes = roof.slopes || [[over, flySlope], 0.5, 0.7, 0.9];
    const prof = roofProfile(p.ez, juan ? slopes.slice(0, -1).concat([0.75]) : slopes, juan ? Math.min(2.2, p.ez * 0.22) : 0, 20);
    const type = gableish ? 'gable' : roof.type;
    const dG = type === 'xieshan' ? over + (D / 2) * 0.32 : 0;
    const r = rectRoof({ type, ex: exBase, ez: p.ez, yE: yEdge, zc: p.zc, prof, dG, lift: gableish ? 0 : (roof.lift ?? 0.55), rib: 0.42, ribW: 0.17, thick: 0.28 });
    acc.add(tile, r.tiles); if (r.ribs) acc.add(rib, r.ribs); acc.add(roof.edge ? `edge${roof.edge}` : ridge, r.eaveEdge);
    // bờ góc / bờ đứng
    const rh = roof.ridgeH || 0.8;
    for (const pts of r.ridges) acc.add(roof.edge ? `edge${roof.edge}` : ridge, ridgeGeo(pts, 0.42, 0.42));
    // bờ nóc 正脊 + vẫn thú (không có ở quyển bằng)
    if (!juan) {
      acc.add(ridge, boxB(2 * r.ridgeX + 0.4, rh, 0.55, 0, r.top - 0.1, p.zc)); acc.add(ridge, boxB(2 * r.ridgeX + 0.6, 0.14, 0.7, 0, r.top - 0.1, p.zc));
      for (const sx of [-1, 1]) chiwen(acc, sx * (r.ridgeX + 0.1), r.top + rh * 0.4, p.zc, rh * 2.3, sx, ridge);
    } else acc.add(ridge, boxB(2 * r.ridgeX, 0.3, 1.6, 0, r.top - 0.18, p.zc));            // nóc tròn: hàng ngói bao nóc
    // linh vật trên 4 bờ góc (mái có bờ góc)
    if (roof.beasts && (roof.type === 'xieshan' || roof.type === 'hip')) for (const pts of r.ridges.slice(0, 4)) beasts(acc, pts, roof.beasts, 0.55, ridge);
    // tam giác hồi yết sơn: ván sơn hoa đỏ + ván bác phong viền vàng
    for (const gb of r.gable) {
      acc.add('plaster', slabXY(gb.pts, 0.12, gb.x - gb.sx * 0.1, 0, 0, -Math.PI / 2));
      const top = gb.pts.length / 2;
      const left = gb.pts.slice(0, top).map(([z, y]) => V(gb.x + gb.sx * 0.05, y + 0.05, z)), right = gb.pts.slice(top).map(([z, y]) => V(gb.x + gb.sx * 0.05, y + 0.05, z));
      acc.add('col', ridgeGeo(left, 0.12, 0.55)); acc.add('col', ridgeGeo(right, 0.12, 0.55));
      for (const [z, y] of [gb.pts[Math.floor(top / 2)]]) acc.add('gold', box(0.08, 0.5, 0.5, gb.x + gb.sx * 0.02, y - 0.6, z));
    }
    // hàng đầu rui dưới mép hiên (hai mặt dài)
    for (const sz of [1, -1]) rafterEnds(acc, -exBase + 0.3, exBase - 0.3, p.zc + sz * (p.ez - 0.1), yEdge - 0.32, 0.5, sz);
    out.push({ ...r, zc: p.zc, ez: p.ez, ex: exBase });
  }
  return out;
}

// ---------------------------------------------------------------- LOẠI HÌNH: ĐIỆN / ĐƯỜNG (1 tầng)
/**
 * spec: { bays: [m…] (rộng từng gian, lẻ), D (sâu tim cột), corr (hành lang trước, 0 = không), corrBack, colH, colD,
 *         plinth, yuetai: {w, d, h}, dagong: dk (m) | 0, roof: {...}, walls: 'gable'|'brickSides', frontDoors: 'all'|'center3' }
 */
export function cnHall(spec) {
  const acc = spec.acc || new Acc(), bays = spec.bays, W = bays.reduce((a, b) => a + b, 0), D = spec.D, ph = spec.plinth;
  const xs = [-W / 2]; for (const b of bays) xs.push(xs[xs.length - 1] + b);
  const colH = spec.colH, colD = spec.colD || 0.07 * Math.max(...bays) / 1.0;
  const dk = spec.dagong || 0, dgH = dk ? 10.6 * dk : 0, beamH = Math.max(0.5, colD * 1.1);
  const over = dk ? (21 + 6) * dk : 0.3 * colH;
  const pOut = Math.max(0.8 * over, 2 * colD) + (spec.roof.type === 'gable' || spec.roof.type === 'juanpeng' || spec.roof.type === 'goulianda' ? 0.6 : 0);
  const PW = W + 2 * pOut, PD = D + 2 * pOut, ci = Math.floor(bays.length / 2);
  const stairs = [{ side: 1, cx: (xs[ci] + xs[ci + 1]) / 2, w: bays[ci] }];
  if (spec.stairs3 && bays.length >= 5) for (const i of [ci - 1, ci + 1]) stairs.push({ side: 1, cx: (xs[i] + xs[i + 1]) / 2, w: bays[i] * 0.8 });
  if (spec.backStair) stairs.push({ side: -1, cx: 0, w: bays[ci] * 0.8 });
  let zFront = 0;
  if (spec.yuetai && !spec.noPlatform) { // nguyệt đài phía trước, thấp hơn nền chính
    const Y = spec.yuetai, z0 = PD / 2 + Y.d / 2;
    platform(acc, { W: Y.w, D: Y.d, h: Y.h, z: z0, stairs: [] });
    const n = Math.max(2, Math.round(Y.h / 0.16)); for (let i = 0; i < n; i++) { acc.add('stone', boxB(Y.w * 0.36, (Y.h / n) * (i + 1), 0.34, 0, 0, z0 + Y.d / 2 + 0.34 * (n - i - 0.5))); acc.plat({ x: 0, z: z0 + Y.d / 2 + 0.34 * (n - i - 0.5), w: Y.w * 0.36, d: 0.36, top: (Y.h / n) * (i + 1) }); }
    for (let i = 0; i < Math.max(2, Math.round((ph - Y.h) / 0.16)); i++) { const m = Math.max(2, Math.round((ph - Y.h) / 0.16)), r = (ph - Y.h) / m; acc.add('stone', boxB(bays[ci], Y.h + r * (i + 1), 0.34, 0, 0, PD / 2 + 0.34 * (m - i - 0.5))); acc.plat({ x: 0, z: PD / 2 + 0.34 * (m - i - 0.5), w: bays[ci], d: 0.36, top: Y.h + r * (i + 1) }); }
    balustrade(acc, [[-Y.w * 0.18, z0 + Y.d / 2 - 0.2], [-Y.w / 2 + 0.2, z0 + Y.d / 2 - 0.2], [-Y.w / 2 + 0.2, z0 - Y.d / 2 + 0.3]], Y.h);
    balustrade(acc, [[Y.w * 0.18, z0 + Y.d / 2 - 0.2], [Y.w / 2 - 0.2, z0 + Y.d / 2 - 0.2], [Y.w / 2 - 0.2, z0 - Y.d / 2 + 0.3]], Y.h);
    zFront = Y.d + 0.34 * Math.max(2, Math.round(Y.h / 0.16));
    stairs.length = 0;
  }
  if (!spec.noPlatform) platform(acc, { W: PW, D: PD, h: ph, stairs }); else acc.add('floor', boxB(W + 2 * colD + (spec.slabOut || 0) * 2, 0.35, D + 2 * colD + (spec.slabOut || 0) * 2, 0, ph - 0.35, (spec.slabOut || 0) * 0.5));
  acc.add('floor', boxB(W + 2 * colD, 0.03, D + 2 * colD, 0, ph, 0));
  const zF = D / 2, zB = -D / 2, zIn = spec.corr ? zF - spec.corr : zF, zBin = spec.corrBack ? zB + spec.corrBack : zB;
  const y0 = ph, yTop = ph + colH;
  // cột: hàng trước, hàng sau, hai hồi (các hàng trong theo hành lang)
  const zRows = [zF, zB]; if (spec.corr) zRows.push(zIn); if (spec.corrBack) zRows.push(zBin);
  for (const x of xs) for (const z of zRows) column(acc, x, z, y0, colH, colD);
  for (const x of [xs[0], xs[xs.length - 1]]) for (let z = zB + 4.5; z < zF - 2; z += Math.max(3.6, (D) / Math.max(2, Math.round(D / 5.5)))) if (!zRows.some((r) => Math.abs(r - z) < 1.5)) column(acc, x, z, y0, colH, colD);
  // xà 额枋 hai lớp + 平板枋 quanh chu vi (thải họa)
  const ring = [[xs[0], zF, xs[xs.length - 1], zF, 0, 1], [xs[0], zB, xs[xs.length - 1], zB, 0, -1], [xs[0], zB, xs[0], zF, -1, 0], [xs[xs.length - 1], zB, xs[xs.length - 1], zF, 1, 0]];
  for (let i = 0; i < bays.length; i++) for (const z of [zF, zB]) {
    acc.add(i % 2 ? 'beam2' : 'beam', boxB(bays[i] - colD * 0.6, beamH, colD * 0.82, (xs[i] + xs[i + 1]) / 2, yTop - beamH, z));
    acc.add(i % 2 ? 'beam' : 'beam2', boxB(bays[i] - colD * 0.6, beamH * 0.7, colD * 0.72, (xs[i] + xs[i + 1]) / 2, yTop - beamH * 2.15, z));
    acc.add('gold', boxB(bays[i] - colD * 0.6, beamH * 0.42, colD * 0.6, (xs[i] + xs[i + 1]) / 2, yTop - beamH * 1.45, z)); // 由额垫板 (đỏ / vàng)
  }
  for (const x of [xs[0], xs[xs.length - 1]]) acc.add('beam', boxB(colD * 0.82, beamH, D - colD, x, yTop - beamH, 0));
  if (dk) {
    for (const [ax, az, bx, bz, nx, nz] of ring) acc.add('col', boxB(Math.abs(bx - ax) + colD, 0.22 * 1, Math.abs(bz - az) + colD, (ax + bx) / 2, yTop, (az + bz) / 2)); // 平板枋
    for (const [ax, az, bx, bz, nx, nz] of ring) dougongRow(acc, ax, az, bx, bz, yTop + 0.22, nx, nz, dk, 11 * dk * 1.0);
  }
  const yCol = yTop + (dk ? 0.22 + dgH + 0.45 : 0.15);
  // mặt tiền: cửa bức bàn mọi gian (hoặc gian giữa là cửa, các gian khác là cửa sổ trên tường thấp)
  const dH = colH - beamH * 2.2;
  if (!spec.open) for (let i = 0; i < bays.length; i++) {
    const center = Math.abs(i - ci) <= (spec.frontDoors === 'center3' ? 1 : spec.frontDoors === 'center1' ? 0 : 99);
    if (center) geshanBay(acc, xs[i] + colD / 2, xs[i + 1] - colD / 2, zIn, y0, dH, bays[i] > 6 ? 6 : 4, i === ci);
    else windowBay(acc, xs[i] + colD / 2, xs[i + 1] - colD / 2, zIn, y0, dH, 4);
  }
  // mặt hậu và hai hồi
  const gableWalls = ['gable', 'juanpeng', 'goulianda'].includes(spec.roof.type);
  const wallT = gableWalls ? 0.9 : 0.6;
  if (!spec.open) for (let i = 0; i < bays.length; i++) {
    if (spec.backDoors && i === ci) geshanBay(acc, xs[i] + colD / 2, xs[i + 1] - colD / 2, zBin, y0, dH, 4);
    else acc.add('brick', boxB(bays[i], colH - beamH * 2.2, wallT, (xs[i] + xs[i + 1]) / 2, y0, zBin - (spec.corrBack ? 0 : wallT * 0.3)));
  }
  if (spec.open) { const r = [[xs[0], zF], [xs[xs.length - 1], zF], [xs[xs.length - 1], zB], [xs[0], zB], [xs[0], zF]]; for (let i = 0; i < 4; i++) { const [ax, az] = r[i], [bx, bz] = r[i + 1]; if (i === 0) { benchRail(acc, ax, az, -bays[ci] / 2, az, y0); benchRail(acc, bays[ci] / 2, az, bx, bz, y0); } else benchRail(acc, ax, az, bx, bz, y0); } }
  if (!gableWalls && !spec.open) for (const x of [xs[0], xs[xs.length - 1]]) { acc.add('brick', boxB(wallT, colH - beamH * 2.2, zIn - zBin, x, y0, (zIn + zBin) / 2)); }
  // 雀替 (con sẻ) dưới xà ở đầu cột mặt trước
  for (let i = 0; i < xs.length; i++) for (const sd of [-1, 1]) { if ((i === 0 && sd < 0) || (i === xs.length - 1 && sd > 0)) continue; const len = Math.min(1.6, bays[Math.min(bays.length - 1, sd < 0 ? i - 1 : i)] * 0.22); acc.add('beam2', slabXY([[0, 0], [len, 0], [len * 0.25, -beamH * 1.2], [0, -beamH * 1.4]].map(([a, b]) => [sd * a, b]), 0.2, xs[i], yTop - beamH * 2.15, zF)); }
  // mái
  if (spec.roof.type === 'flat') { // mái bằng + lan can gỗ quanh sân thượng
    const Wf = W + 2 * colD + 1.2, Df = D + 2 * colD + 1.2;
    acc.add('col', boxB(Wf, 0.45, Df, 0, yTop + 0.05, 0)); acc.add('stone', boxB(Wf + 0.2, 0.3, Df + 0.2, 0, yTop + 0.5, 0));
    for (const sz of [1, -1]) acc.add('beam', boxB(Wf + 0.3, 0.42, 0.12, 0, yTop + 0.1, sz * (Df / 2 + 0.06))); for (const sx of [1, -1]) acc.add('beam2', boxB(0.12, 0.42, Df + 0.3, sx * (Wf / 2 + 0.06), yTop + 0.1, 0));
    balustrade(acc, [[-Wf / 2, Df / 2], [Wf / 2, Df / 2], [Wf / 2, -Df / 2], [-Wf / 2, -Df / 2], [-Wf / 2, Df / 2]], yTop + 0.8, { h: 1.0, step: 1.2, key: 'col' });
    return { acc, info: { W, D, PW, PD, ph, colH, colD, yCol: yTop + 0.8, top: yTop + 1.8, over: 0, bays, xs, kind: 'flat' } };
  }
  if (spec.roof.type === 'none') return { acc, info: { W, D, PW, PD, ph, colH, colD, yCol, top: yCol, over, bays, xs, kind: 'storey' } };
  const roofs = cnRoof(acc, { W, D, yCol, over, roof: spec.roof, wallT });
  // khung đỡ mái 梁架: tại mỗi tim cột ngang (缝) — xà chồng tầng, trụ ngắn 瓜柱, xà gồ 檩 dọc nhà
  for (const rr of roofs) {
    const steps = [over, over + (rr.ez - over) / 3, over + (2 * (rr.ez - over)) / 3, rr.ez - 0.05], yAt = (d) => rr.Y(0, rr.zc + rr.ez - d, d) - 0.45;
    for (const d of steps.slice(0, -1)) for (const sz of [1, -1]) acc.add('wood', purlin(2 * (Math.min(rr.ex, rr.xe(d)) - 0.25), 0.24, yAt(d), rr.zc + sz * (rr.ez - d)));
    acc.add('wood', purlin(2 * (Math.max(1, rr.ridgeX) - 0.25), 0.26, yAt(steps[3]), rr.zc));
    for (const x of xs.slice(1, -1)) {
      let yPrev = yTop;
      for (let k = 0; k < 3; k++) {
        const d = steps[k], half = rr.ez - d, y = yAt(d) - 0.55;
        acc.add(k % 2 ? 'beam2' : 'beam', boxB(colD * 0.8, 0.55 + 0.1 * (2 - k), 2 * half + 0.6, x, y - 0.1 * (2 - k), rr.zc));
        if (k > 0) for (const sz of [1, -1]) acc.add('wood', boxB(0.36, y - yPrev, 0.36, x, yPrev, rr.zc + sz * half));
        yPrev = y + 0.55;
      }
      acc.add('wood', boxB(0.36, yAt(steps[3]) - yPrev, 0.36, x, yPrev, rr.zc));             // 脊瓜柱
    }
  }
  // tường hồi ngạnh sơn: từ nền lên theo mặt mái + 墀头 (đầu hồi) ở hai góc trước
  if (gableWalls) {
    const r = roofs[0];
    for (const sx of [-1, 1]) {
      const x = sx * (W / 2 + wallT / 2 - 0.15), zf = D / 2 + Math.min(over * 0.75, 1.6), wf = spec.wallFrom ?? ph;
      const top = []; for (const rr of roofs) for (let i = 0; i <= 24; i++) { const z = rr.zc + rr.ez - (2 * rr.ez * i) / 24; if (Math.abs(z) > zf + 0.01) continue; const d = rr.ez - Math.abs(z - rr.zc); top.push([z, rr.Y(x, z, d) + 0.25]); }
      top.sort((a, b) => b[0] - a[0]);
      const front = r.Y(x, zf, r.ez - Math.abs(zf - r.zc));
      const poly = [[-zf, wf], [zf, wf], [zf, front + 0.25], ...top.filter(([z]) => z < zf && z > -zf), [-zf, front + 0.25]];
      acc.add('brick', slabXY(poly, wallT, x, 0, 0, -Math.PI / 2));
      for (const sz of [1, -1]) for (let k = 0; k < 4; k++) acc.add(k % 2 ? 'marble' : 'brick', boxB(wallT + 0.1 + k * 0.08, 0.24, 0.6 + k * 0.18, x, yCol - 1.0 + k * 0.24, sz * (zf - 0.3 + k * 0.09))); // 墀头 nhô bậc
    }
  }
  const top = Math.max(...roofs.map((r) => r.top)) + (spec.roof.type === 'juanpeng' || spec.roof.type === 'goulianda' ? 0.15 : (spec.roof.ridgeH || 0.8) * 2.2);
  return { acc, info: { W, D, PW, PD, ph, colH, colD, eave: yCol - over * (spec.roof.fly ?? 0.2), top, over, bays, xs, front: PD / 2 + zFront, kind: 'hall' } };
}

// ---------------------------------------------------------------- LÂU 2 TẦNG (Hậu Tráo Lâu, môn phòng lâu…)
/** spec: như hall + h1 (cao cột tầng 1), h2 (tầng 2), hành lang tầng 2 phía trước có lan can, backWindows: 'shaped' */
export function cnLou(spec) {
  const acc = new Acc(), h1 = spec.h1;
  const lower = cnHall({ ...spec, acc, colH: h1, roof: { type: 'none' }, backDoors: false });
  const y1 = spec.plinth + h1 + 0.25;
  const upper = cnHall({ ...spec, acc, noPlatform: true, yuetai: null, plinth: y1, colH: spec.h2, wallFrom: 0, stairs3: false });
  const zF = spec.D / 2;
  for (let i = 0; i < spec.bays.length; i++) {
    const x0 = lower.info.xs[i], x1 = lower.info.xs[i + 1];
    acc.add('col', boxB(x1 - x0, 0.08, 0.12, (x0 + x1) / 2, y1 + 1.0, zF)); acc.add('col', boxB(x1 - x0, 0.12, 0.16, (x0 + x1) / 2, y1 + 0.05, zF));
    for (let x = x0 + 0.3; x < x1 - 0.2; x += 0.3) acc.add('col', boxB(0.05, 0.95, 0.05, x, y1 + 0.1, zF));
  }
  if (spec.backWindows === 'shaped') {
    const shapes = ['circle', 'octa', 'fan', 'gourd', 'plum', 'hex', 'square', 'leaf'];
    for (let i = 0; i < spec.bays.length; i++) {
      const x = (lower.info.xs[i] + lower.info.xs[i + 1]) / 2;
      shapedWindow(acc, shapes[i % shapes.length], x, y1 + spec.h2 * 0.5, -spec.D / 2 - 0.5, 0.95);
      shapedWindow(acc, shapes[(i + 3) % shapes.length], x, spec.plinth + h1 * 0.55, -spec.D / 2 - 0.5, 0.8);
    }
  }
  return { acc, info: { ...upper.info, ph: spec.plinth, PW: lower.info.PW, PD: lower.info.PD, storeys: 2, y1, kind: 'lou' } };
}
/** khung cửa sổ hình (vành đá trắng + ô song) trên mặt phẳng z, hướng ra −z */
export function shapedWindow(acc, kind, x, y, z, r) {
  const ring = (n, rr, rot = 0) => Array.from({ length: n }, (_, i) => { const a = rot + (2 * Math.PI * i) / n; return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  let out;
  if (kind === 'circle') out = ring(24, r);
  else if (kind === 'octa') out = ring(8, r, Math.PI / 8);
  else if (kind === 'hex') out = ring(6, r);
  else if (kind === 'square') out = [[-r, -r * 0.8], [r, -r * 0.8], [r, r * 0.8], [-r, r * 0.8]];
  else if (kind === 'fan') out = [...Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (0.15 + (0.7 * i) / 12); return [Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3 - r * 0.6]; }), ...Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (0.85 - (0.7 * i) / 12); return [Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5 - r * 0.6]; })];
  else if (kind === 'gourd') out = Array.from({ length: 36 }, (_, i) => { const a = (2 * Math.PI * i) / 36, s = Math.sin(a); const rr = s > 0.2 ? r * 0.5 : r * 0.75; return [Math.cos(a) * rr, s * r * 0.95]; });
  else if (kind === 'plum') out = Array.from({ length: 40 }, (_, i) => { const a = (2 * Math.PI * i) / 40, rr = r * (0.82 + 0.18 * Math.cos(5 * a)); return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  else out = Array.from({ length: 20 }, (_, i) => { const a = (2 * Math.PI * i) / 20; return [Math.cos(a) * r * 0.7, Math.sin(a) * r * (1 - 0.3 * Math.cos(a))]; });
  const shape = new THREE.Shape(out.map(([a, b]) => new THREE.Vector2(a * 1.2, b * 1.2))); shape.holes.push(new THREE.Path(out.map(([a, b]) => new THREE.Vector2(a, b))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false }); g.translate(x, y, z - 0.09); acc.add('marble', g);
  const f = new THREE.ShapeGeometry(new THREE.Shape(out.map(([a, b]) => new THREE.Vector2(a, b)))); f.rotateY(Math.PI); f.translate(x, y, z - 0.2); acc.add('door', f);
}

// ---------------------------------------------------------------- ĐÌNH đa giác (toản tiêm 攒尖) 1–3 vành mái
/** spec: { n: 4|6|8, a (apothem vòng cột ngoài), colH, colD, plinth, tiers, over, tile, dagong } */
export function cnPavilion(spec) {
  const acc = new Acc(), n = spec.n, ph = spec.plinth, T = spec.tiers || 1, rot = 0;
  const R = (a) => a / Math.cos(Math.PI / n), vert = (a, k) => { const t = rot + (2 * Math.PI * k) / n + Math.PI / n; return [Math.cos(t) * R(a), Math.sin(t) * R(a)]; };
  const a0 = spec.a, colD = spec.colD || 0.45, tile = spec.tile || 'Gray', dk = spec.dagong || 0, over0 = spec.over || 1.6;
  const pa = a0 + over0 * 0.75 + 0.4, pv = Array.from({ length: n }, (_, k) => vert(pa, k));
  const base = new THREE.ExtrudeGeometry(new THREE.Shape(pv.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: ph, bevelEnabled: false }); base.rotateX(-Math.PI / 2); acc.add('stone', base); acc.plat({ poly: true, x: 0, z: 0, n, a: pa, top: ph });
  const nst = Math.max(2, Math.round(ph / 0.16)); for (let i = 0; i < nst; i++) { acc.add('stone', boxB(2.4, (ph / nst) * (i + 1), 0.34, 0, 0, pa + 0.34 * (nst - i - 0.5))); acc.plat({ x: 0, z: pa + 0.34 * (nst - i - 0.5), w: 2.4, d: 0.36, top: (ph / nst) * (i + 1) }); }
  const tiers = []; for (let t = 0; t < T; t++) tiers.push({ a: a0 * (1 - 0.3 * t), h: t === 0 ? spec.colH : spec.colH * 0.5, over: over0 * (1 - 0.12 * t) });
  for (let k = 0; k < n; k++) { const [x, z] = vert(a0, k); column(acc, x, z, ph, spec.colH, colD); }
  for (let k = 0; k < n; k++) { const [ax, az] = vert(a0, k - 1), [bx, bz] = vert(a0, k); const mz = (az + bz) / 2, mx = (ax + bx) / 2; if (mz > a0 * 0.7 && Math.abs(mx) < a0 * 0.75) continue; benchRail(acc, ax, az, bx, bz, ph); }
  let y = ph + spec.colH, yTop = y;
  for (let t = 0; t < T; t++) {
    const { a, over } = tiers[t];
    for (let k = 0; k < n; k++) {
      const [ax, az] = vert(a, k - 1), [bx, bz] = vert(a, k);
      acc.add(k % 2 ? 'beam' : 'beam2', beam(V(ax, y - 0.35, az), V(bx, y - 0.35, bz), 0.4, 0.55));
      if (dk) { const mx = (ax + bx) / 2, mz = (az + bz) / 2, L = Math.hypot(mx, mz); dougongRow(acc, ax, az, bx, bz, y, mx / L, mz / L, dk, 11 * dk); }
    }
    const yc = y + (dk ? 10.6 * dk + 0.3 : 0.1), ae = a + over, last = t === T - 1, aNext = last ? 0 : tiers[t + 1].a;
    if (!last) for (let k = 0; k < n; k++) { const [x, z] = vert(aNext, k); column(acc, x, z, y - 0.6, yc - y + 0.6 + tiers[t + 1].h + 0.4, colD * 0.9); }
    const run = last ? ae : ae - aNext;
    const prof = roofProfile(run, last ? [[over, 0.3], 0.55, 0.8, 1.05] : [[over, 0.3], 0.55], 0, 14);
    const r = polyRoof({ n, ae, yE: yc - over * 0.25, prof, lift: spec.lift ?? 0.5, rot, ribW: 0.14, rib: 0.38 });
    acc.add(`tile${tile}`, r.tiles); if (r.ribs) acc.add(`rib${tile}`, r.ribs); acc.add(`ridge${tile}`, r.eaveEdge);
    for (const pts of r.ridges) acc.add(`ridge${tile}`, ridgeGeo(pts, 0.3, 0.3));
    if (!last) {
      const yb = r.top - 0.15, hb = tiers[t + 1].h;
      for (let k = 0; k < n; k++) { const [ax, az] = vert(aNext, k - 1), [bx, bz] = vert(aNext, k), L = Math.hypot(bx - ax, bz - az), ry = Math.atan2(bx - ax, bz - az) + Math.PI / 2; acc.add('door', box(L - colD, hb * 0.75, 0.1, (ax + bx) / 2, yb + hb * 0.42, (az + bz) / 2, ry)); }
      y = yb + hb + 0.4;
    } else {
      acc.add('gold', lathe([[0.9, 0], [0.75, 0.3], [0.5, 0.45], [0.62, 0.8], [0.6, 1.2], [0.3, 1.5], [0.38, 1.75], [0.001, 2.3]], 0, r.top - 0.2, 0, 12));
      yTop = r.top + 2.1;
    }
  }
  return { acc, info: { W: 2 * pa, D: 2 * pa, PW: 2 * pa, PD: 2 * pa, ph, colH: spec.colH, top: yTop, n, kind: 'pavilion' } };
}

// ---------------------------------------------------------------- GHÉP nhiều khối (chính điện + nhĩ phòng / bão hạ / thùy hoa môn)
/** spec.parts: [{ ...đặc tả con, at: [x, z], ry }] — build(part) dựng khối con */
export function cnCompound(spec, build) {
  const acc = new Acc(); let top = 0, minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, ph = 0;
  for (const part of spec.parts) {
    const { acc: a, info } = build(part);
    const m = new THREE.Matrix4().makeRotationY(part.ry || 0).setPosition(part.at[0], 0, part.at[1]);
    for (const [k, list] of a.parts) for (const g of list) acc.add(k, g.clone().applyMatrix4(m));
    const c = Math.cos(part.ry || 0), sn = Math.sin(part.ry || 0); for (const q of a.plats) acc.plat({ ...q, x: part.at[0] + c * q.x + sn * q.z, z: part.at[1] - sn * q.x + c * q.z, ry: (q.ry || 0) + (part.ry || 0) });
    top = Math.max(top, info.top); ph = Math.max(ph, info.ph || 0);
    const hw = (info.PW || info.W) / 2, hd = (info.PD || info.D) / 2;
    minX = Math.min(minX, part.at[0] - hw); maxX = Math.max(maxX, part.at[0] + hw); minZ = Math.min(minZ, part.at[1] - hd); maxZ = Math.max(maxZ, part.at[1] + hd);
  }
  return { acc, info: { W: maxX - minX, D: maxZ - minZ, PW: maxX - minX, PD: maxZ - minZ, top, ph, kind: 'compound' } };
}

// ---------------------------------------------------------------- LẦU CÁC NHIỀU TẦNG (Thiên Tượng Lâu) theo đặc tả lầu của game
/**
 * Dựng VỎ NGOÀI lầu các bát giác (nguyên mẫu Ứng Huyện Mộc Tháp + Phật Hương Các, 01 › lầu 10 tầng) từ towerSpec của game:
 *  thềm đá trắng có lan can đầu sen · mỗi tầng: vòng cột (3 gian / cạnh), vách bức bàn 4 mặt chính + cửa sổ 4 mặt chéo,
 *  đấu củng + vành mái ngói ống, bình tọa (ban công) có lan can son · Vọng Đài: đình mở 8 cột + mái chóp bát giác + bảo đỉnh.
 * ts = towerSpec(style) (tower.js): { n, FH, floors[{y,a,gal,slabA}], deck{y,a}, podium{y,a,stairW,steps,rise,tread,run} }
 */
export function cnTower(ts, { tile = 'Green', dk = 0.1 } = {}) {
  const acc = new Acc(), n = ts.n, FH = ts.FH, P = ts.podium, rot = 0;
  const R = (a) => a / Math.cos(Math.PI / n), vert = (a, k) => { const t = rot + (2 * Math.PI * k) / n + Math.PI / n; return [Math.cos(t) * R(a), Math.sin(t) * R(a)]; };
  const sides = (a) => Array.from({ length: n }, (_, k) => { const [x0, z0] = vert(a, k - 1), [x1, z1] = vert(a, k), t = rot + (2 * Math.PI * k) / n; return { k, x0, z0, x1, z1, mx: (x0 + x1) / 2, mz: (z0 + z1) / 2, len: Math.hypot(x1 - x0, z1 - z0), nx: Math.cos(t), nz: Math.sin(t), ry: Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2 }; });
  const polySlab = (a, y, t, key) => { const pv = Array.from({ length: n }, (_, k) => vert(a, k)); const g = new THREE.ExtrudeGeometry(new THREE.Shape(pv.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: t, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); acc.add(key, g); };
  // thềm vuông 2 cạnh = 2·P.a, cao P.y: khối đá + gờ đá trắng + lan can (chừa miệng bậc) + bậc trước
  platform(acc, { W: 2 * P.a, D: 2 * P.a, h: P.y, stairs: [{ side: 1, cx: 0, w: P.stairW }] });
  const pa = P.a - 0.3, sw = P.stairW / 2 + 0.2;
  balustrade(acc, [[-sw, pa], [-pa, pa], [-pa, -pa], [pa, -pa], [pa, pa], [sw, pa]], P.y);
  ts.floors.forEach((f, k) => {
    const y = f.y, a = f.a, H = FH - 0.4;
    if (k) { polySlab(f.slabA - 0.02, y - 0.44, 0.42, 'wood'); polySlab(f.slabA + 0.08, y - 0.46, 0.18, 'col'); } // sàn bình tọa (gỗ, viền son)
    // vòng cột ngoài: đỉnh + 2 cột giữa mỗi cạnh (3 gian / cạnh — Ứng Huyện 24 cột)
    const colD = 0.5, ring = sides(a + 0.62);           // vòng cột ngoài vách lầu (vách game dày 0,6 ở apothem a)
    if (f.gal && ts.columns) for (const [cx, cz] of columnRing(n, f.slabA - 0.7, ts.colStep)) column(acc, cx, cz, y, H - 0.9, colD); // cột hành lang đúng chỗ cột va chạm của game (tower.js › columnRing)
    else for (const s of ring) for (const t of [0, 1 / 3, 2 / 3]) column(acc, s.x0 + (s.x1 - s.x0) * t, s.z0 + (s.z1 - s.z0) * t, y, H - 0.9, colD);
    // vách: bức bàn ở 4 mặt chính (N, S, Đ, T), cửa sổ hạm song ở 4 mặt chéo; cửa giữa mặt trước / sau để mở
    for (const s of sides(a + 0.36)) {                  // tấm bức bàn phủ ngoài vách game
      const main = n === 8 ? s.k % 2 === 0 : true, u = (s.len / 2) - 0.3, ux = (s.x1 - s.x0) / s.len, uz = (s.z1 - s.z0) / s.len;
      const g = new Acc();
      if (main) for (let j = 0; j < 3; j++) geshanBay(g, -u + (2 * u * j) / 3, -u + (2 * u * (j + 1)) / 3, 0, y, H - 1.5, 4, j === 1 && (s.nz > 0.9 || s.nz < -0.9));
      else for (let j = 0; j < 3; j++) windowBay(g, -u + (2 * u * j) / 3, -u + (2 * u * (j + 1)) / 3, 0, y, H - 1.5, 4);
      const m = new THREE.Matrix4().makeRotationY(Math.atan2(s.nx, s.nz)).setPosition(s.mx, 0, s.mz);
      for (const [key, list] of g.parts) for (const geo of list) acc.add(key, geo.applyMatrix4(m));
      acc.add(s.k % 2 ? 'beam' : 'beam2', box(s.len + 0.3, 0.6, 0.55, s.mx + s.nx * 0.2, y + H - 1.25, s.mz + s.nz * 0.2, s.ry)); // 额枋 thải họa
    }
    // đấu củng dưới vành mái
    for (const s of ring) dougongRow(acc, s.x0, s.z0, s.x1, s.z1, y + H - 0.95, s.nx, s.nz, dk, 11 * dk * 2.2, s.k);
    // vành mái (mái hiên vòng) từ vách ra ngoài, mép dưới sàn bình tọa tầng trên
    const over = 3.6, yTopRoof = y + FH - 0.45, run = over + 0.6;
    const prof = roofProfile(run, [[over * 0.6, 0.25], 0.42], 0, 8);
    const r = polyRoof({ n, ae: a + over, yE: yTopRoof - prof.H, prof, lift: 0.7, rot, ribW: 0.18, rib: 0.6 });
    acc.add(`tile${tile}`, r.tiles); if (r.ribs) acc.add(`rib${tile}`, r.ribs); acc.add(`ridge${tile}`, r.eaveEdge);
    for (const pts of r.ridges) acc.add(`ridge${tile}`, ridgeGeo(pts, 0.28, 0.28));
    for (const s of sides(a + over)) { const [cx, cz] = [s.x1, s.z1]; acc.add('gold', cyl(0.12, 0.05, 0.7, cx, yTopRoof - prof.H - 0.75, cz, 6)); } // chuông gió góc
    // bình tọa tầng trên: lan can son quanh mép sàn + đấu củng bình tọa (hàng ngắn dưới sàn)
    const nf = ts.floors[k + 1];
    if (nf && nf.gal) {
      const ra = nf.slabA - 0.15, rs = sides(ra);
      for (const s of rs) { acc.add('col', box(s.len, 0.12, 0.14, s.mx, nf.y + 1.0, s.mz, s.ry)); acc.add('beam2', box(s.len, 0.3, 0.18, s.mx, nf.y + 0.15, s.mz, s.ry)); const m = Math.max(2, Math.round(s.len / 1.6)); for (let i = 0; i <= m; i++) { const t = i / m; acc.add('col', boxB(0.16, 1.1, 0.16, s.x0 + (s.x1 - s.x0) * t, nf.y, s.z0 + (s.z1 - s.z0) * t)); } }
    }
  });
  // Vọng Đài: lan can + đình mở 8 cột + mái chóp bát giác 2 vành + bảo đỉnh
  const D = ts.deck, top = D.y;
  polySlab(D.a + 0.25, top - 0.4, 0.4, 'wood'); polySlab(D.a + 0.33, top - 0.42, 0.18, 'col');
  for (const s of sides(D.a + 0.05)) { acc.add('col', box(s.len, 0.12, 0.14, s.mx, top + 1.0, s.mz, s.ry)); const m = Math.max(2, Math.round(s.len / 1.6)); for (let i = 0; i <= m; i++) { const t = i / m; acc.add('col', boxB(0.16, 1.1, 0.16, s.x0 + (s.x1 - s.x0) * t, top, s.z0 + (s.z1 - s.z0) * t)); } }
  const ap = D.a - 1.6, ch = 4.4;
  for (let k = 0; k < n; k++) { const [x, z] = vert(ap, k); column(acc, x, z, top, ch, 0.5); }
  for (const s of sides(ap)) { acc.add(s.k % 2 ? 'beam' : 'beam2', box(s.len, 0.55, 0.45, s.mx, top + ch - 0.3, s.mz, s.ry)); dougongRow(acc, s.x0, s.z0, s.x1, s.z1, top + ch, s.nx, s.nz, dk, 11 * dk * 1.3, s.k); }
  const yc = top + ch + 10.6 * dk + 0.3, ae1 = ap + 2.6, aIn = ap * 0.62;
  const p1 = roofProfile(ae1 - aIn, [[2.6, 0.28], 0.5], 0, 10), r1 = polyRoof({ n, ae: ae1, yE: yc - 0.6, prof: p1, lift: 0.6, rot });
  acc.add(`tile${tile}`, r1.tiles); if (r1.ribs) acc.add(`rib${tile}`, r1.ribs); acc.add(`ridge${tile}`, r1.eaveEdge); for (const pts of r1.ridges) acc.add(`ridge${tile}`, ridgeGeo(pts, 0.3, 0.3));
  const yb = r1.top - 0.1; polySlab(aIn, yb, 2.2, 'door');
  const p2 = roofProfile(aIn + 2.2, [[2.2, 0.28], 0.6, 0.9, 1.15], 0, 14), r2 = polyRoof({ n, ae: aIn + 2.2, yE: yb + 2.2 - 0.5, prof: p2, lift: 0.6, rot });
  acc.add(`tile${tile}`, r2.tiles); if (r2.ribs) acc.add(`rib${tile}`, r2.ribs); acc.add(`ridge${tile}`, r2.eaveEdge); for (const pts of r2.ridges) acc.add(`ridge${tile}`, ridgeGeo(pts, 0.32, 0.32));
  acc.add('gold', lathe([[1.4, 0], [1.1, 0.5], [0.7, 0.7], [0.95, 1.3], [0.9, 2.0], [0.45, 2.5], [0.6, 2.9], [0.15, 3.4], [0.2, 4.2], [0.001, 4.8]], 0, r2.top - 0.3, 0, 14));
  return { acc, info: { W: 2 * P.a, D: 2 * P.a, PW: 2 * P.a, PD: 2 * P.a, ph: P.y, top: r2.top + 4.5, n, floors: ts.floors.length, kind: 'tower' } };
}
