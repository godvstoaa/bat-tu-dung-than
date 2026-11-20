// ============================================================================
//  HỌ «ASIA» — PHỦ ĐỆ HUẾ (hue) và NHÀ VƯỜN HUẾ (nhavuon) cho biệt phủ / biệt thự (docs/bietphu/asia.md).
//  Bộ dựng tiên phủ Huế vn-build.js / vn-kit.js (CHỈ import) + vật liệu lặp theo mét (archcity/mats.js).
//  NHÀ Ở, không phải cung vua: gỗ nâu (không sơn son thếp vàng), ngói âm dương / ngói liệt màu S.roofCol (không hoàng
//  lưu ly), tường hồi gạch trát vôi, cửa bàn khoa gỗ, đầu đao và bờ nóc đắp vôi khảm sành sứ.
//   · chính đường phủ: nhà rường KÉP «trùng thiềm điệp ốc» (Từ đường Tuy Lý Vương, Vỹ Dạ) — nhà trước + nhà sau nối máng
//     xối, nóc sau cao hơn nóc trước; thêm mái chồng diêm + cổ diêm «nhất thi nhất họa» vì lô đòi hai tầng hiên (b.h = 11)
//   · nhà phụ (Đông / Tây Sương): nhà rường 3 gian 2 chái chồng diêm
//   · biệt thự: nhà rường 3 gian 2 chái MỘT mái (nhà vườn An Hiên) — dựng riêng từ cấu kiện vn-kit
//   · tháp: gác chuông 2 tầng trên đài gạch (theo lầu Ngũ Phụng Đông, Ngọ Môn) · đình: thủy đình 16 cột 2 tầng mái
//     (Trường Du Tạ) · cổng phủ: tam quan gạch trụ biểu (cổng Tuy Lý Vương phủ) · cổng biệt thự: hai trụ gạch có mái
// ============================================================================
import * as THREE from 'three';
import { Acc } from '../tienphu/arch/kit.js';
import { vnBuild, bell as bellGeo } from '../tienphu/arch/vn-build.js';
import {
  vnMats, tbox, put, steps, vnBase, vnCol, keBracket, slopeRoof, ridgeBand, coDiem, doorBay, plasterBay, panelBay, woodRail, ganhRail,
  box, boxB, beam, slabXY, V, ornament, daoOrn,
} from '../tienphu/arch/vn-kit.js';
import { tiled, retex, consolidate } from './mats.js';

// ---------------------------------------------------------------- vật liệu: lặp theo mét + họa tiết gỗ nhà ở (canvas)
const C = { wood: '#5b3820', woodD: '#3f2617', woodL: '#8a6038', ink: '#24180f', cream: '#e8dcbc', plaster: '#d8cba8', stone: '#7e8488', stoneD: '#5c6266' };
function cv(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
/** vân gỗ: các sợi dọc sẫm / sáng trên nền */
function grain(g, x, y, w, h, base, k = 1) {
  g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let i = 0; i < w * 0.6 * k; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '255,230,200' : '20,10,4'},${0.04 + rnd() * 0.07})`; g.fillRect(x + rnd() * w, y, 1 + rnd() * 2, h); }
}
/** cửa bàn khoa Huế (một cánh ~0,95 × 2,5 m, 256 × 640 px ≈ 270 px/m): thượng song (song tiện dọc + lá gió), giữa ô hộc chạm
 *  chữ Thọ, dưới ván bưng có khung — gỗ mộc nâu, không sơn son */
const doorTex = () => cv(256, 640, (g, w, h) => {
  grain(g, 0, 0, w, h, C.wood);
  const fx = 18, fw = w - 36, top = 18, sH = h * 0.46;
  g.fillStyle = C.ink; g.fillRect(fx, top, fw, sH);                                                // lòng song tối (nhìn vào trong nhà)
  for (let x = fx + 10; x < fx + fw - 4; x += 22) { grain(g, x, top, 9, sH, C.woodL, 0.5); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x + 8, top, 2, sH); }
  for (const y of [top + sH * 0.33, top + sH * 0.66]) { grain(g, fx, y - 5, fw, 10, C.woodL, 0.5); }
  g.strokeStyle = C.woodD; g.lineWidth = 8; g.strokeRect(fx, top, fw, sH);
  const my = top + sH + 16, mh = 92; grain(g, fx, my, fw, mh, '#6a4428');                         // ô hộc giữa
  g.strokeStyle = '#2e1c10'; g.lineWidth = 5; g.strokeRect(fx + 10, my + 10, fw - 20, mh - 20);
  g.strokeStyle = '#c9a76a'; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, my + mh / 2, 26, 0, 7); g.stroke();
  g.fillStyle = '#c9a76a'; g.fillRect(w / 2 - 15, my + mh / 2 - 3, 30, 6); g.fillRect(w / 2 - 3, my + mh / 2 - 17, 6, 34);
  const ly = my + mh + 16, lh = h - ly - 18; grain(g, fx, ly, fw, lh, '#61401f');                    // ván bưng dưới
  g.strokeStyle = '#2e1c10'; g.lineWidth = 6; g.strokeRect(fx + 14, ly + 14, fw - 28, lh - 28);
  g.strokeStyle = 'rgba(255,220,170,0.25)'; g.lineWidth = 2; g.strokeRect(fx + 20, ly + 20, fw - 40, lh - 40);
});
/** vách «thượng song hạ bản» (gác, lầu): trên song gỗ, dưới ván ô hộc — 256 × 512 cho ô 1,1 × 2,8 m */
const panelTex = () => cv(256, 512, (g, w, h) => {
  grain(g, 0, 0, w, h, C.wood);
  const top = 16, sH = h * 0.5; g.fillStyle = C.ink; g.fillRect(16, top, w - 32, sH);
  for (let x = 28; x < w - 20; x += 24) grain(g, x, top, 9, sH, C.woodL, 0.5);
  grain(g, 16, top + sH / 2 - 5, w - 32, 10, C.woodL, 0.5);
  g.strokeStyle = C.woodD; g.lineWidth = 8; g.strokeRect(16, top, w - 32, sH);
  const ly = top + sH + 18, lh = h - ly - 16; grain(g, 16, ly, w - 32, lh, '#61401f');
  g.strokeStyle = '#2e1c10'; g.lineWidth = 6; g.strokeRect(30, ly + 12, w - 60, lh - 24);
});
/** liên ba: diềm gỗ chạm (hồi văn chữ Công hai mép + ô hộc hoa thị bốn cánh) trên cửa — 512 px / 1,6 m */
const lienBaTex = () => cv(512, 112, (g, w, h) => {
  grain(g, 0, 0, w, h, C.woodD);
  g.strokeStyle = '#9c7444'; g.lineWidth = 3;
  for (const y0 of [6, h - 18]) { g.beginPath(); for (let x = 0; x <= w; x += 24) { g.moveTo(x, y0 + 12); g.lineTo(x, y0); g.lineTo(x + 16, y0); g.lineTo(x + 16, y0 + 8); g.lineTo(x + 8, y0 + 8); } g.stroke(); }
  for (let i = 0; i < 4; i++) {
    const x = 10 + i * 128, y = 26, cw = 108, ch = h - 52;
    g.fillStyle = C.ink; g.fillRect(x, y, cw, ch); g.strokeStyle = '#8a6438'; g.lineWidth = 4; g.strokeRect(x, y, cw, ch);
    const cx = x + cw / 2, cy = y + ch / 2;
    g.fillStyle = '#a07a48';
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2 + Math.PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(a) * 11, cy + Math.sin(a) * 11, 12, 6, a, 0, 7); g.fill(); }
    g.fillStyle = '#c8a46a'; g.beginPath(); g.arc(cx, cy, 6, 0, 7); g.fill();
    g.strokeStyle = '#a07a48'; g.lineWidth = 3;
    for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(cx + sx * 24, cy); g.bezierCurveTo(cx + sx * 34, cy - 18, cx + sx * 48, cy - 10, cx + sx * 44, cy + 2); g.bezierCurveTo(cx + sx * 40, cy + 12, cx + sx * 32, cy + 6, cx + sx * 36, cy); g.stroke(); }
  }
});
/** cổ diêm «nhất thi nhất họa» nhà ở: khung gỗ, ô thơ (nền ngà, chữ mực) xen ô họa (sơn thủy thủy mặc) — 1024 px / 2,4 m */
const coDiemTex = () => cv(1024, 224, (g, w, h) => {
  grain(g, 0, 0, w, h, C.woodD);
  const cell = w / 2;
  for (let i = 0; i < 2; i++) {
    const x = i * cell + 22, cw = cell - 44, y = 26, ch = h - 52;
    if (i === 0) { g.fillStyle = C.cream; g.fillRect(x, y, cw, ch); g.fillStyle = '#2a2018';
      for (let c = 0; c < 9; c++) for (let r = 0; r < 4; r++) { const xx = x + cw - 40 - c * 48, yy = y + 22 + r * 40; g.fillRect(xx, yy, 22, 3); g.fillRect(xx + 9, yy - 8, 3, 22); g.fillRect(xx + 2, yy + 9, 18, 2); if ((c + r) % 3) g.fillRect(xx + 16, yy - 4, 3, 12); } }
    else {
      const sky = g.createLinearGradient(0, y, 0, y + ch); sky.addColorStop(0, '#efe8d4'); sky.addColorStop(1, '#d9d2b8'); g.fillStyle = sky; g.fillRect(x, y, cw, ch);
      const hill = (x0, x1, yb, peak, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x0, yb); g.quadraticCurveTo(x0 + (x1 - x0) * 0.3, peak, x0 + (x1 - x0) * 0.5, peak + 6); g.quadraticCurveTo(x0 + (x1 - x0) * 0.75, peak + 20, x1, yb); g.fill(); };
      hill(x + 10, x + cw * 0.6, y + ch, y + 30, 'rgba(90,110,100,0.55)'); hill(x + cw * 0.35, x + cw - 6, y + ch, y + 50, 'rgba(60,80,72,0.7)');
      g.fillStyle = 'rgba(239,232,212,0.8)'; g.fillRect(x, y + ch * 0.62, cw, 10);
      g.strokeStyle = '#3a2e22'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 70, y + ch - 30); g.quadraticCurveTo(x + 90, y + ch - 24, x + 112, y + ch - 30); g.stroke();
      g.beginPath(); g.moveTo(x + 40, y + ch); g.quadraticCurveTo(x + 30, y + 70, x + 52, y + 40); g.stroke(); g.fillStyle = 'rgba(40,60,40,0.7)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + 52 + k * 7 - 18, y + 40 + (k % 2) * 8, 14, 6, 0.4, 0, 7); g.fill(); }
      g.fillStyle = '#9a3a2a'; g.fillRect(x + cw - 34, y + 12, 14, 18);
    }
    g.strokeStyle = '#9a7a48'; g.lineWidth = 6; g.strokeRect(x - 5, y - 5, cw + 10, ch + 10);
    g.strokeStyle = '#2a1a10'; g.lineWidth = 2; g.strokeRect(x - 10, y - 10, cw + 20, ch + 20);
  }
});
const MT = new Map();
/** bộ vật liệu theo bảng màu: roof (ngói), plaster (tường vôi) — biến thể biệt thự đổi màu ngói / vách trong bảng màu Huế */
function mats(S, pal = {}) {
  const roof = new THREE.Color(pal.roof || S.roofCol).multiplyScalar(pal.roof ? 1 : 1.35), rc = '#' + roof.getHexString(), rd = '#' + roof.clone().multiplyScalar(0.82).getHexString();
  const pl = pal.plaster || C.plaster, key = rc + pl;
  if (MT.has(key)) return MT.get(key);
  const map = (t, col) => new THREE.MeshStandardMaterial(t ? { map: t, roughness: 0.75 } : { color: col, roughness: 0.75 });
  const D = THREE.DoubleSide;
  // khoá lặp theo mét (retex đổi UV + vật liệu); khoá canvas giữ UV của cấu kiện (vào mats của Acc.build)
  const over = {
    tileTerra: tiled('tile', rc, { rough: 0.85, side: D }), ribTerra: tiled('tile', rd, { rough: 0.85 }), capTerra: tiled('tile', rd, { rough: 0.85 }),
    stone: tiled('stone', C.stone), stoneDark: tiled('stone', C.stoneD), court: tiled('stone', '#b06a48'), brickGrey: tiled('brick', '#a49f94', { bump: 1.2 }),
    plaster: tiled('plaster', pl), phapLam: tiled('plaster', '#d9d3c4'),
    col: tiled('plank', '#6a4024', { rough: 0.8 }), woodD: tiled('plank', C.woodD, { rough: 0.85 }), beam: tiled('plank', '#553219', { rough: 0.8 }), wood: tiled('plank', '#6b4428'),
    gold: tiled('lacquer', '#a8864a', { rough: 0.55, metal: 0.25 }),
  };
  const M = { over, mats: { ...vnMats(), door: map(doorTex(), C.wood), doorGlass: map(doorTex(), C.wood), panel: map(panelTex(), C.wood), lienBa: map(lienBaTex(), C.woodD), coDiem: map(coDiemTex(), C.woodD) } };
  MT.set(key, M); return M;
}
const out = (acc, S, info, pal) => { const M = mats(S, pal); return { acc, mats: M.mats, post: (g) => consolidate(retex(g, M.over)), info }; };

// ---------------------------------------------------------------- lưới gian / nhịp
/** n gian lẻ: gian giữa rộng nhất, kề giữa ~95 %, chái ~66 % gian giữa (07 › C1.1) */
function hueBays(W, n) {
  const ci = (n - 1) / 2, w = Array.from({ length: n }, (_, i) => { const d = Math.abs(i - ci); return i === 0 || i === n - 1 ? 0.66 : d === 0 ? 1 : 1 - 0.05 * d; });
  const s = w.reduce((a, b) => a + b, 0); return w.map((x) => +((x * W) / s).toFixed(3));
}
/** nền khuôn lô: (w + 2,4) × (d + 2,4), bậc giữa min(6, 0,3 w) trước (+ sau nếu back) */
const baseOf = (b, rail = 'scroll') => {
  const sw = Math.min(6, b.w * 0.3), st = [{ side: 1, cx: 0, w: sw, rail }]; if (b.back) st.push({ side: -1, cx: 0, w: sw, rail });
  return { mx: 1.2, mzF: 1.2, mzB: 1.2, stairs: st };
};

// ---------------------------------------------------------------- NHÀ (phủ: chồng diêm; biệt thự: một mái)
export function hueHall(styleId, S, b, opt = {}) {
  if (opt.villa) return villaHall(S, b, opt.variant);
  const main = b.id === 'main', n = Math.max(3, Math.round(b.w / (main ? 4.6 : 4.2)) | 1), hien = 1.4;
  const Din = b.d - 2 * hien;
  const spans = main ? [hien, Din * 0.24, Din * 0.21, Din * 0.25, Din * 0.30, hien].map((x) => +x.toFixed(3)) : [hien, Din / 2, Din / 2, hien];
  const colQ = main ? 5.0 : 3.7, cd = main ? 1.9 : 1.1;
  const spec = {
    bays: hueBays(b.w, n), spans, ph: b.plinth, colQ, colD: main ? 0.46 : 0.38, base: baseOf(b),
    front: 'hien', back: b.back ? 'door' : 'plaster', ends: 'plaster', backOpen: true, chaiWin: 'round', doorH: 3.4, tile: 'Terra', rib: 0.6,
    low: { over: main ? 1.8 : 1.4, s: main ? 0.56 : 0.5 }, levels: [{ kind: 'codiem', h: cd }],
    top: main ? { over: 1.4, s: 0.9, split: 3, ridgeH: 0.65, ornS: 0.95 } : { over: 1.2, s: 0.8, ridgeH: 0.5, ornS: 0.65, minR: 0.3 },
    orn: main ? 'longGourd' : 'gourd', ornFront: 'gourd', dao: 'dragon', daoS: main ? 0.85 : 0.7, truss: false,
  };
  const r = vnBuild(spec);
  return out(r.acc, S, { ...r.info, kind: 'hue-' + (main ? 'nhakep' : 'nharuong') });
}

/**
 * BIỆT THỰ nhà vườn — 3 biến thể (opt.variant, căn kề nhau khác nhau):
 *  0 · nhà rường 3 gian 2 chái MỘT mái có chái (An Hiên: ngói liệt, bờ nóc rồng chầu hồ lô), chái tường vôi cửa sổ tròn
 *  1 · nhà rường 3 gian 2 chái CHỒNG DIÊM (mái hạ + cổ diêm + mái thượng), ngói âm dương rêu xám, tường vàng hoàng thổ
 *  2 · nhà rường KÉP một tầng mái (nhà trước nông + nhà sau sâu, nối máng xối — Từ đường Tuy Lý Vương thu nhỏ), 5 gian đều,
 *      mặt tiền cửa bàn khoa + vách thượng song hạ bản, lan can gỗ mép hiên, ngói đỏ tươi, tường trắng vôi
 */
const VILLA_PAL = [{}, { roof: '#6e5a4c', plaster: '#d6b87e' }, { roof: '#b0583a', plaster: '#e6e0d0' }];
function villaHall(S, b, variant = 0) {
  const v = ((variant | 0) % 3 + 3) % 3, pal = VILLA_PAL[v], ph = b.plinth, hien = 1.4;
  if (v === 1) {
    const r = vnBuild({
      bays: hueBays(b.w, 5), spans: [hien, (b.d - 2 * hien) / 2, (b.d - 2 * hien) / 2, hien], ph, colQ: 3.1, colD: 0.3, base: baseOf(b),
      front: 'hien', back: 'plaster', ends: 'plaster', chaiWin: 'round', doorH: 3.0, tile: 'Terra', rib: 0.6,
      low: { over: 1.15, s: 0.5 }, levels: [{ kind: 'codiem', h: 0.85 }], top: { over: 1.0, s: 0.86, ridgeH: 0.42, ornS: 0.5, minR: 0.3 }, orn: 'gourd', dao: 'dragon', daoS: 0.5, truss: false,
    });
    return out(r.acc, S, { ...r.info, kind: 'hue-nhavuon-chongdiem' }, pal);
  }
  const acc = new Acc(), kep = v === 2, bays = kep ? Array(5).fill(b.w / 5) : hueBays(b.w, 5);
  const spans = kep ? [hien, 2.4, b.d - 2 * hien - 2.4, hien] : [hien, (b.d - 2 * hien) / 2, (b.d - 2 * hien) / 2, hien];
  const xs = [-b.w / 2]; for (const w of bays) xs.push(xs[xs.length - 1] + w);
  const zs = [b.d / 2]; for (const s of spans) zs.push(zs[zs.length - 1] - s);
  const nX = bays.length, nZ = spans.length, colQ = kep ? 3.5 : 3.3, colD = 0.3;
  vnBase(acc, { W: b.w + 2.4, D: b.d + 2.4, h: ph, stairs: baseOf(b).stairs });
  const over = 1.25, ez = b.d / 2 + over, ex = b.w / 2 + over, s = kep ? 0.9 : 0.98;                         // dốc ~42–44°, lá mái thoải 0,6
  const y0 = ph + colQ + 0.45 - 0.6 * s * over;
  for (let i = 0; i <= nX; i++) for (let j = 0; j <= nZ; j++) {
    const x = xs[i], z = zs[j], outer = i === 0 || i === nX || j === 0 || j === nZ;
    vnCol(acc, x, z, ph, outer ? colQ : colQ + (kep ? 0.5 : 1.1), outer ? colD : colD * 1.12);
  }
  const yb = ph + colQ;
  for (const [ax, az, bx, bz] of [[xs[0], zs[0], xs[nX], zs[0]], [xs[0], zs[nZ], xs[nX], zs[nZ]], [xs[0], zs[nZ], xs[0], zs[0]], [xs[nX], zs[nZ], xs[nX], zs[0]]]) acc.add('beam', beam(V(ax, yb + 0.12, az), V(bx, yb + 0.12, bz), 0.26, 0.34));
  for (let i = 0; i <= nX; i++) for (const [z, nz] of [[zs[0], 1], [zs[nZ], -1]]) keBracket(acc, xs[i], z, yb - 0.08, i === 0 ? -0.7071 : i === nX ? 0.7071 : 0, nz * (i === 0 || i === nX ? 0.7071 : 1), over * 0.6);
  // vách: hiên trước — cửa bàn khoa ở hàng cột trong (gian giữa mở); chái: tường vôi cửa sổ tròn (0) / vách gỗ (2)
  const zi = zs[1], ci = 2, dH = 3.0, i0 = kep ? 0 : 1, i1 = kep ? nX : nX - 1;
  put(acc, (t) => {
    for (let i = i0; i < i1; i++) {
      const a = xs[i] + 0.12, c = xs[i + 1] - 0.12;
      if (kep && (i === 0 || i === nX - 1)) panelBay(t, a, c, ph, colQ, { win: 'round', r: 0.5 });
      else { doorBay(t, a, c, ph, dH, { open: i === ci, lienBa: 0.45 }); t.add('beam', boxB(c - a, colQ - dH, 0.16, (a + c) / 2, ph + dH, 0)); }
    }
  }, 0, 0, zi);
  if (!kep) for (const [a, c] of [[xs[0], xs[1]], [xs[nX - 1], xs[nX]]]) put(acc, (t) => plasterBay(t, a + 0.1, c - 0.1, ph, colQ, { win: 'round', r: 0.55 }), 0, 0, zs[0]);
  for (const x of kep ? [xs[0], xs[nX]] : [xs[1], xs[nX - 1]]) put(acc, (t) => plasterBay(t, -hien / 2 + 0.15, hien / 2 - 0.15, ph, colQ, {}), Math.PI / 2, x, (zs[0] + zi) / 2);
  if (kep) put(acc, (t) => { for (let i = 0; i < nX; i++) if (i !== ci) woodRail(t, xs[i] + 0.2, xs[i + 1] - 0.2, ph, { h: 0.6, step: 0.28 }); }, 0, 0, zs[0]);
  put(acc, (t) => { for (let i = 0; i < nX; i++) plasterBay(t, -xs[i + 1] + 0.1, -xs[i] - 0.1, ph, colQ, { win: i === 1 || i === nX - 2 ? 'square' : null, r: 0.45 }); }, Math.PI, 0, zs[nZ]);
  for (const sx of [-1, 1]) put(acc, (t) => { for (let j = kep ? 1 : 0; j < nZ; j++) plasterBay(t, -zs[j] + 0.1, -zs[j + 1] - 0.1, ph, colQ, { win: j === (kep ? 2 : 1) ? 'round' : null, r: 0.5 }); }, sx * Math.PI / 2, sx * xs[nX], 0);
  // trần / gác lửng gỗ trên hàng cột trong
  acc.add('wood', boxB(xs[nX - 1] - xs[1] + 0.3, 0.2, zs[1] - zs[nZ - 1] + 0.3, 0, yb + 0.25, 0));
  let top;
  if (!kep) {
    const yR = y0 + s * (0.6 * over + ez - over), rx = Math.max(0.6, ex - ez);
    slopeRoof(acc, { xL: -ex, xR: ex, zF: ez, zB: -ez }, { xL: -rx, xR: rx, zF: 0, zB: 0 }, y0, yR, { tile: 'Terra', over, dao: 'dragon', daoS: 0.55, rib: 0.6, kick: 0.62 });
    top = ridgeBand(acc, -rx, rx, 0, yR - 0.08, { h: 0.45, tile: 'Terra', orn: 'longGourd', s: 0.55 });
    for (let i = 1; i < nX; i++) acc.add('beam', beam(V(xs[i], yb + 0.2, zs[0]), V(xs[i], yb + 0.2 + s * (zs[0] - zi), zi), 0.16, 0.22));
  } else {
    // nhà kép: nhà trước (hiên + 1 nhịp) và nhà sau (nhịp sâu + hậu), nối máng xối ở hàng cột zs[2]; nóc sau cao hơn
    const zg = zs[2]; top = 0;
    for (const [zF, zB, front] of [[ez, zg, true], [zg, -ez, false]]) {
      const hz = (zF - zB) / 2, zc = (zF + zB) / 2, rx = Math.max(0.6, ex - hz), yR = y0 + s * (0.6 * over + hz - over);
      slopeRoof(acc, { xL: -ex, xR: ex, zF, zB }, { xL: -rx, xR: rx, zF: zc, zB: zc }, y0, yR, { tile: 'Terra', over, dao: 'dragon', daoS: 0.5, rib: 0.6, kick: 0.62, daoMask: front ? [true, true, false, false] : [false, false, true, true] });
      top = Math.max(top, ridgeBand(acc, -rx, rx, zc, yR - 0.08, { h: 0.4, tile: 'Terra', orn: front ? null : 'longGourd', s: 0.5 }));
    }
    acc.add('stoneDark', boxB(2 * ex - 0.6, 0.2, 0.5, 0, y0 - 0.12, zg));
  }
  return out(acc, S, { W: b.w, D: b.d, ph, top, kind: kep ? 'hue-nhavuon-kep' : 'hue-nhavuon' }, pal);
}

// ---------------------------------------------------------------- THÁP: gác chuông 2 tầng trên đài gạch
export function hueTower(styleId, S, t) {
  const acc = new Acc(), A = Math.min(t.w, t.d) - 0.4, H = 3.8;                                          // đài 9,6 m vuông cao 3,8 m
  acc.add('brickGrey', tbox(A, H - 0.6, A, 0, 0.6, 0, 1.2)); acc.add('stone', tbox(A + 0.3, 0.6, A + 0.3, 0, 0, 0, 2));
  acc.add('stoneDark', tbox(A + 0.2, 0.16, A + 0.2, 0, H - 0.16, 0, 1)); acc.add('court', tbox(A - 0.2, 0.02, A - 0.2, 0, H, 0, 0.76));
  // mặt đài: cửa cuốn vòm giữa (bịt — tháp là khối đặc), gờ chỉ, ô cuốn giả hai bên
  for (const [ry, x, z] of [[0, 0, A / 2], [Math.PI, 0, -A / 2], [Math.PI / 2, A / 2, 0], [-Math.PI / 2, -A / 2, 0]]) put(acc, (q) => {
    q.add('stoneDark', boxB(A, 0.14, 0.12, 0, H - 0.9, 0.04));
    for (const [u, r, y] of [[0, 1.2, 1.6], [-2.9, 0.65, 1.7], [2.9, 0.65, 1.7]]) { const arch = []; for (let a = 0; a <= 14; a++) { const th = Math.PI * (a / 14); arch.push([u + Math.cos(th) * r, y + Math.sin(th) * r]); } q.add('stoneDark', slabXY([[u + r + 0.18, 0.6], ...arch.map(([a, b2]) => [u + (a - u) * (1 + 0.18 / r), y + (b2 - y) * (1 + 0.18 / r)]), [u - r - 0.18, 0.6]], 0.06, 0, 0, 0.05)); q.add('woodD', slabXY([[u + r, 0.6], ...arch, [u - r, 0.6]], 0.05, 0, 0, 0.09)); }
  }, ry, x, z);
  const e = A / 2 - 0.22; for (const [ry, x, z] of [[0, 0, e], [Math.PI, 0, -e], [Math.PI / 2, e, 0], [-Math.PI / 2, -e, 0]]) put(acc, (q) => ganhRail(q, -e, e, H, { h: 0.9, t: 0.36 }), ry, x, z);
  // gác 2 tầng: tầng dưới thoáng (chuông đồng treo giữa), tầng trên vách thượng song hạ bản, cửa sổ tròn / khánh
  const r = vnBuild({
    bays: [1.6, 3.4, 1.6], spans: [1.6, 3.4, 1.6], ph: 0.5, colQ: 3.2, colD: 0.36, base: { mx: 0.35, stairs: [] }, interior: false, truss: false,
    front: 'open', back: 'open', ends: 'open', tile: 'Terra', rib: 0.6, low: { over: 1.3, s: 0.46 },
    levels: [{ kind: 'storey', h: 2.6, bal: 0.5, win: { front: 'round', ends: 'khanh' } }], top: { over: 1.1, s: 0.72, ridgeH: 0.45, ornS: 0.6, minR: 0.3 }, orn: 'gourd', dao: 'dragon', daoS: 0.75,
  });
  put(acc, (q) => { for (const [k, l] of r.acc.parts) for (const g of l) q.add(k, g); }, 0, 0, 0, H);
  bellGeo(acc, 0, H + 0.5, 0);
  return out(acc, S, { kind: 'hue-gacchuong', top: r.info.top + H });
}

// ---------------------------------------------------------------- ĐÌNH: thủy đình 16 cột 2 tầng mái (Trường Du Tạ «một gian bốn chái»)
export function huePav(styleId, S, pv) {
  const W = Math.min(pv.w, pv.d) - 1.2, c = W * 0.44, s = (W - c) / 2;
  const r = vnBuild({
    kind: 'dinh', bays: [s, c, s], spans: [s, c, s], ph: 0.5, colQ: 2.8, colD: 0.3, interior: false, truss: false, tile: 'Terra', rib: 0.6,
    base: { mx: 0.6, stairs: [{ side: 1, cx: 0, w: 2.2 }] }, front: 'rail', back: 'rail', ends: 'rail', endDoor: false, chaiWin: null,
    low: { over: 1.1, s: 0.44 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 0.9, s: 0.7, ridgeH: 0.4, ornS: 0.45, minR: 0.3 }, orn: 'gourd', dao: 'dragon', daoS: 0.6,
  });
  return out(r.acc, S, { ...r.info, kind: 'hue-thuydinh' });
}

// ---------------------------------------------------------------- CỔNG
/** trụ biểu: thân gạch trát vôi, đế đá, gờ chỉ, lồng đèn (ô trống bốn mặt) + mũ mái + búp sen đỉnh */
function truBieu(acc, x, z, a, h) {
  acc.add('stone', tbox(a + 0.3, 0.5, a + 0.3, x, 0, z, 1));
  acc.add('plaster', boxB(a, h - 0.5, a, x, 0.5, z));
  for (const y of [1.3, h - 1.9]) acc.add('stoneDark', boxB(a + 0.14, 0.12, a + 0.14, x, y, z));
  for (const sx of [-1, 1]) acc.add('brickGrey', tbox(0.14, h - 3.4, a + 0.06, x + sx * (a / 2 - 0.05), 1.45, z, 1));    // đường chỉ gạch hai mép
  acc.add('plaster', boxB(a * 0.8, 0.9, a * 0.8, x, h, z)); acc.add('woodD', boxB(a * 0.84, 0.5, a * 0.5, x, h + 0.2, z)); acc.add('woodD', boxB(a * 0.5, 0.5, a * 0.84, x, h + 0.2, z));
  acc.add('capTerra', boxB(a + 0.4, 0.14, a + 0.4, x, h + 0.9, z)); acc.add('capTerra', box(a * 0.7, 0.22, a * 0.7, x, h + 1.15, z, Math.PI / 4));
  ornament(acc, 'gourd', x, h + 1.26, z, 0.32);
}
/** mái nhỏ hai dốc có chái trên cổng / trên tường (ngói âm dương, đầu đao sành sứ) */
function capRoof(acc, x, w, d, y, z, { s = 0.62, over = 0.45, daoS = 0.45, orn = null, ridgeH = 0.32 } = {}) {
  const ex = w / 2 + over, ez = d / 2 + over, rx = Math.max(0.3, ex - ez), yR = y + s * ez;
  slopeRoof(acc, { xL: x - ex, xR: x + ex, zF: z + ez, zB: z - ez }, { xL: x - rx, xR: x + rx, zF: z, zB: z }, y, yR, { tile: 'Terra', over, dao: 'dragon', daoS, rib: 0.6 });
  return ridgeBand(acc, x - rx, x + rx, z, yR - 0.06, { h: ridgeH, tile: 'Terra', orn, s: Math.max(0.35, daoS) });
}
export function hueGate(styleId, S, g, opt = {}) {
  const acc = new Acc();
  const vv = ((opt.variant | 0) % 3 + 3) % 3;
  if (g.villa && vv === 1) { // cổng trụ biểu đôi: hai trụ vôi có lồng đèn + búp sen, xà gỗ có liên ba, không mái
    const w = g.w + 0.3, a = 0.56, zc = -0.4;
    for (const sx of [-1, 1]) truBieu(acc, sx * (w / 2 + a / 2), zc, a, 3.3);
    acc.add('beam', boxB(w + 0.2, 0.24, 0.26, 0, 2.7, zc)); acc.add('lienBa', boxB(w - 0.2, 0.42, 0.08, 0, 2.28, zc + 0.04)); acc.add('beam', boxB(w + 0.2, 0.14, 0.22, 0, 2.18, zc));
    acc.add('capTerra', boxB(w + 0.3, 0.16, 0.4, 0, 2.94, zc));
    acc.add('stoneDark', boxB(w, 0.08, 1.0, 0, 0, zc));
    return out(acc, S, { kind: 'hue-trubieu' }, VILLA_PAL[2]);
  }
  if (g.villa && vv === 2) { // cổng xây cuốn vòm: tường vôi một khối, vòm bán nguyệt, mái ngói nhỏ + mặt nhật sành sứ
    const r = (g.w + 0.3) / 2, yc = 2.25, Wt = 2 * r + 1.8, Ht = 4.4, zc = -0.4, Dt = 0.7, arch = [];
    for (let i = 0; i <= 16; i++) { const th = Math.PI * (1 - i / 16); arch.push([Math.cos(th) * r, yc + Math.sin(th) * r]); }
    acc.add('plaster', slabXY([[-Wt / 2, 0.3], [-r, 0.3], ...arch, [r, 0.3], [Wt / 2, 0.3], [Wt / 2, Ht], [-Wt / 2, Ht]], Dt, 0, 0, zc));
    acc.add('stone', tbox(Wt + 0.16, 0.3, Dt + 0.16, 0, 0, zc, 1));
    const ring = []; for (let i = 0; i <= 16; i++) { const th = Math.PI * (1 - i / 16); ring.push([Math.cos(th) * (r + 0.22), yc + Math.sin(th) * (r + 0.22)]); }
    for (const sz of [1, -1]) acc.add('stoneDark', slabXY([...ring, ...arch.slice().reverse()], 0.06, 0, 0, zc + sz * (Dt / 2 + 0.03)));
    for (const sz of [1, -1]) acc.add('stoneDark', boxB(Wt + 0.1, 0.12, 0.08, 0, Ht - 0.5, zc + sz * (Dt / 2 + 0.04)));
    capRoof(acc, 0, Wt, Dt, Ht + 0.1, zc, { s: 0.6, over: 0.4, daoS: 0.45, orn: 'sun', ridgeH: 0.3 });
    acc.add('stoneDark', boxB(2 * r, 0.08, Dt + 0.6, 0, 0, zc));
    return out(acc, S, { kind: 'hue-congvom' }, VILLA_PAL[1]);
  }
  if (g.villa) { // cổng nhà vườn: hai trụ gạch vôi + mái ngói nhỏ trên xà gỗ (cổng ngõ An Hiên)
    const w = g.w + 0.3, a = 0.62, zc = -0.45;
    for (const sx of [-1, 1]) { const x = sx * (w / 2 + a / 2); acc.add('stone', tbox(a + 0.2, 0.3, a + 0.2, x, 0, zc, 1)); acc.add('plaster', boxB(a, 2.55, a, x, 0.3, zc)); acc.add('stoneDark', boxB(a + 0.1, 0.1, a + 0.1, x, 2.85, zc)); acc.add('brickGrey', tbox(a * 0.92, 0.22, a * 0.92, x, 0.9, zc, 1)); }
    acc.add('beam', boxB(w + 2 * a + 0.2, 0.26, 0.3, 0, 2.95, zc)); acc.add('beam', boxB(w + 0.2, 0.16, 0.22, 0, 2.55, zc));
    for (const sx of [-1, 1]) keBracket(acc, sx * (w / 2 + a / 2), zc, 2.9, 0, 1, 0.5);
    acc.add('lienBa', boxB(w - 0.2, 0.36, 0.08, 0, 2.6, zc + 0.06));
    capRoof(acc, 0, w + 2 * a, 0.5, 3.3, zc, { s: 0.7, over: 0.4, daoS: 0.4, orn: 'gourd', ridgeH: 0.26 });
    acc.add('stoneDark', boxB(w, 0.08, 1.2, 0, 0, zc));
    return out(acc, S, { kind: 'hue-congngo' });
  }
  // cổng tam quan (Tuy Lý Vương phủ: gạch, 3 cửa, trán đắp mặt trời + rồng sành sứ) — cửa giữa = khe cổng g.w
  const zc = -0.9, D = 1.5, cw = g.w + 0.4, a = 1.0, sw = 2.6, hC = 5.6, hS = 3.6;
  const xi = cw / 2 + a / 2, xo = xi + a / 2 + sw + a / 2;
  for (const sx of [-1, 1]) { truBieu(acc, sx * xi, zc, a, 7.6); truBieu(acc, sx * xo, zc, a * 0.9, 6.4); }
  // trán cửa giữa: dầm gạch trên khe, bảng biển, cuốn thư sành sứ, mái chồng nhỏ 2 tầng
  acc.add('plaster', boxB(cw, 1.5, D, 0, hC, zc)); acc.add('stoneDark', boxB(cw + 0.2, 0.14, D + 0.16, 0, hC, zc)); acc.add('stoneDark', boxB(cw + 0.2, 0.12, D + 0.16, 0, hC + 1.38, zc));
  for (const sz of [1, -1]) { acc.add('woodD', boxB(3.4, 0.9, 0.08, 0, hC + 0.3, zc + sz * (D / 2 + 0.03))); acc.add('lienBa', boxB(3.0, 0.62, 0.06, 0, hC + 0.44, zc + sz * (D / 2 + 0.07))); }
  for (const sz of [1, -1]) for (const sx of [-1, 1]) acc.add('sanhSu', slabXY([[0, 0], [1.6, 0], [1.9, 0.3], [1.5, 0.6], [1.1, 0.42], [0.6, 0.62], [0, 0.42]].map(([u, v]) => [sx * (cw / 2 - 0.4 - u * 0.9), hC + 0.35 + v]), 0.06, 0, 0, zc + sz * (D / 2 + 0.05)));
  capRoof(acc, 0, cw + 0.2, D, hC + 1.55, zc, { s: 0.5, over: 0.55, daoS: 0.55 });
  acc.add('plaster', boxB(cw * 0.55, 0.9, D * 0.7, 0, hC + 2.15, zc)); acc.add('coDiem', boxB(cw * 0.55 - 0.1, 0.62, D * 0.7 + 0.04, 0, hC + 2.27, zc));
  const top = capRoof(acc, 0, cw * 0.55, D * 0.7, hC + 3.05, zc, { s: 0.62, over: 0.5, daoS: 0.5, orn: 'sun', ridgeH: 0.36 });
  // hai cửa bên: tường gạch vôi, khung cửa gỗ cánh bàn khoa đóng, trán + mái nhỏ
  for (const sx of [-1, 1]) {
    const x = sx * (xi + a / 2 + sw / 2);
    acc.add('plaster', boxB(sw, hS + 0.9 - 2.9, D * 0.8, x, 2.9, zc));
    put(acc, (q) => doorBay(q, -sw / 2 + 0.05, sw / 2 - 0.05, 0.12, 2.8, { open: false, lienBa: 0.35 }), 0, x, zc);
    acc.add('stoneDark', boxB(sw, 0.12, D * 0.8 + 0.1, x, 0, zc)); acc.add('stoneDark', boxB(sw + 0.1, 0.12, D * 0.8 + 0.12, x, hS + 0.8, zc));
    capRoof(acc, x, sw, D * 0.8, hS + 0.95, zc, { s: 0.55, over: 0.45, daoS: 0.4 });
  }
  // ngưỡng đá, hai bậc thấp hai phía (không cản lối)
  acc.add('stoneDark', boxB(cw, 0.1, D + 0.4, 0, 0, zc)); acc.add('court', boxB(2 * xo + 1, 0.04, 3.2, 0, 0, zc - 0.2));
  return out(acc, S, { kind: 'hue-tamquan', top });
}
