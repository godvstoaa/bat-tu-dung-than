// ============================================================================
//  BẢN VẼ KIẾN TRÚC 9 TIÊN PHỦ (docs/TIEN-PHU-MATBANG-MANIFEST.md) — sinh từ CHÍNH số liệu dựng (siteplans.js → plan.js, tower.js)
//  nên mô hình 3D luôn đúng bản vẽ. Mỗi phủ: tổng mặt bằng + một tờ cho từng công trình (mặt bằng · mặt đứng chính · mặt đứng bên)
//  + lầu 10 tầng (mặt đứng toàn lầu, mặt bằng tầng điển hình) + từng đình + cổng & cầu. Ra: docs/tienphu-banve/<nn>-<id>/*.svg
//    node scripts/draw-tienphu.mjs
// ============================================================================
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tienPlan, TP_W, TP_D, footCenter } from '../src/game/tienphu/plan.js';
import { FH, LEVELS } from '../src/game/tienphu/tower.js';
import { FLOOR_THEMES } from '../src/game/tienphu/styles.js';

const OUT = 'docs/tienphu-banve', HW = TP_W / 2, HD = TP_D / 2;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = (v) => (Math.round(v * 10) / 10).toLocaleString('vi-VN');
const PAPER = '#f7f2e6', INK = '#2b241c', FONT = "font-family='Segoe UI, Arial, sans-serif'";
const dirName = (ry) => { const a = ((Math.round((ry || 0) / (Math.PI / 2)) % 4) + 4) % 4; return ['Nam (về cổng)', 'Đông', 'Bắc', 'Tây'][a] || `${f1(((ry || 0) * 180) / Math.PI)}°`; };
const gridLabel = (x, z) => `${String.fromCharCode(65 + Math.min(25, Math.max(0, Math.floor((x + HW) / 20))))}${Math.floor((z + HD) / 20) + 1}`;
/** chiều cao THÂN thực dựng (archkit-style.styledBuilding) */
const bodyH = (S, b) => (S.fam === 'asian' ? (b.floors > 1 ? b.h : Math.min(b.h, 6.2)) : (b.floors || 1) * 4.2);
const roofH = (S, b) => (S.fam === 'modern' ? 0.35 : S.fam === 'mughal' || S.dome ? 2.2 + Math.min(b.w, b.d) * 0.28 * 2.2 : S.roof === 'flat' ? 1.2 : S.roof === 'thai' ? Math.max(3, b.d * 0.5) : Math.max(2, b.d * 0.3));
const ROOF_TXT = { curved: 'mái cong lưu ly, đầu đao vểnh', irimoya: 'mái irimoya (đầu hồi Nhật)', flat: 'mái bằng có tường chắn (Tây Tạng)', gable: 'mái dốc đầu hồi nhọn (Gothic)', hip: 'mái chóp + vòm (tân cổ điển)', vn: 'mái cong Huế, đầu đao', thai: 'mái nhiều cấp dốc đứng (Thái)', onion: 'mái bằng + trống + vòm củ hành (Mughal)', deco: 'mái bằng đua (Art Deco)' };
const roofKind = (S) => (S.fam === 'modern' ? 'deco' : S.fam === 'mughal' ? 'onion' : S.roof);

function svgDoc(w, h, body) { return `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' ${FONT}><rect width='${w}' height='${h}' fill='${PAPER}'/>${body}</svg>`; }
const T = (x, y, s, t, o = '') => `<text x='${f(x)}' y='${f(y)}' font-size='${s}' ${/(^| )fill=/.test(o) ? '' : `fill='${INK}'`} ${o}>${esc(t)}</text>`;
const f = (v) => Math.round(v * 10) / 10;
const poly = (pts, st) => `<polygon points='${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}' ${st}/>`;
const rectPts = (x, z, hw, hd, ry) => { const c = Math.cos(ry || 0), s = Math.sin(ry || 0); return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([u, v]) => [x + c * u + s * v, z - s * u + c * v]); };
/** đường kích thước ngang / dọc */
function dimH(x0, x1, y, label, tick = 6) { return `<line x1='${f(x0)}' y1='${f(y)}' x2='${f(x1)}' y2='${f(y)}' stroke='${INK}' stroke-width='0.8'/><line x1='${f(x0)}' y1='${f(y - tick)}' x2='${f(x0)}' y2='${f(y + tick)}' stroke='${INK}'/><line x1='${f(x1)}' y1='${f(y - tick)}' x2='${f(x1)}' y2='${f(y + tick)}' stroke='${INK}'/>${T((x0 + x1) / 2, y - 4, 12, label, "text-anchor='middle'")}`; }
function dimV(y0, y1, x, label, tick = 6) { return `<line x1='${f(x)}' y1='${f(y0)}' x2='${f(x)}' y2='${f(y1)}' stroke='${INK}' stroke-width='0.8'/><line x1='${f(x - tick)}' y1='${f(y0)}' x2='${f(x + tick)}' y2='${f(y0)}' stroke='${INK}'/><line x1='${f(x - tick)}' y1='${f(y1)}' x2='${f(x + tick)}' y2='${f(y1)}' stroke='${INK}'/>${T(x + 8, (y0 + y1) / 2 + 4, 12, label)}`; }
function titleBlock(x, y, w, rows, title) {
  let s = `<rect x='${x}' y='${y}' width='${w}' height='${28 + rows.length * 20}' fill='#fffdf6' stroke='${INK}' stroke-width='1.5'/>` + T(x + 10, y + 20, 15, title, "font-weight='bold'");
  rows.forEach(([k, v], i) => { s += T(x + 10, y + 44 + i * 20, 12, k, "fill-opacity='0.7'") + T(x + 150, y + 44 + i * 20, 12, v); });
  return s;
}

// ------------------------------------------------------------------- TỔNG MẶT BẰNG
function masterPlan(P, n) {
  const st = P.st, D = P.site, S = 1080 / TP_W, ox = 70, oy = 90, X = (x) => ox + (x + HW) * S, Y = (z) => oy + (z + HD) * S, P2 = (pts) => pts.map(([x, z]) => [X(x), Y(z)]);
  let g = '';
  // lưới trục 20 m + nhãn
  for (let k = 0; k <= 26; k++) { const v = -HW + k * 20; g += `<line x1='${f(X(v))}' y1='${f(Y(-HD))}' x2='${f(X(v))}' y2='${f(Y(HD))}' stroke='#d8cfba' stroke-width='0.6'/><line x1='${f(X(-HW))}' y1='${f(Y(v))}' x2='${f(X(HW))}' y2='${f(Y(v))}' stroke='#d8cfba' stroke-width='0.6'/>`; if (k < 26) { g += T(X(v + 10), oy - 8, 10, String.fromCharCode(65 + k), "text-anchor='middle' fill-opacity='0.6'"); g += T(ox - 14, Y(v + 10) + 4, 10, String(k + 1), "text-anchor='middle' fill-opacity='0.6'"); } }
  g += `<rect x='${X(-HW)}' y='${Y(-HD)}' width='${TP_W * S}' height='${TP_D * S}' fill='#e9efd9' fill-opacity='0.55'/>`;
  if (P.forecourt) g += poly(P2(rectPts(P.forecourt.x, P.forecourt.z, P.forecourt.w / 2, P.forecourt.d / 2, 0)), "fill='#e6dcc4' stroke='#b8aa88' stroke-dasharray='4 3'");
  // nước, đảo
  for (const w of P.water) g += w.shape === 'ellipse' ? `<ellipse cx='${f(X(w.x))}' cy='${f(Y(w.z))}' rx='${f(w.rx * S)}' ry='${f(w.rz * S)}' fill='#a9cfe3' stroke='#4b7f9f' stroke-width='1.2'/>` : poly(P2(rectPts(w.x, w.z, w.hw, w.hd, 0)), "fill='#a9cfe3' stroke='#4b7f9f' stroke-width='1.2'");
  if (P.moatIsle) g += poly(P2(rectPts(P.moatIsle.x, P.moatIsle.z, P.moatIsle.hw, P.moatIsle.hd, 0)), "fill='#dfe8cc' stroke='none'");
  for (const il of P.islands) g += `<circle cx='${f(X(il.x))}' cy='${f(Y(il.z))}' r='${f(il.r * S)}' fill='#cfdcae' stroke='#7b8f5a'/>`;
  // lối, bồn hoa, vườn đá
  for (const p of P.paths) g += poly(P2(rectPts(p.x, p.z, p.w / 2, p.d / 2, p.ry)), "fill='#ddd2b8' stroke='#b4a581' stroke-width='0.5'");
  for (const b of P.beds) g += poly(P2(rectPts(b.x, b.z, b.w / 2, b.d / 2, 0)), "fill='#c3d9a4' stroke='#6f8d4b' stroke-width='0.6'");
  if (P.zen) { g += poly(P2(rectPts(P.zen.x, P.zen.z, P.zen.w / 2, P.zen.d / 2, 0)), "fill='#eee8d6' stroke='#9a9070'"); for (let k = 1; k < 8; k++) g += `<line x1='${f(X(P.zen.x - P.zen.w / 2))}' y1='${f(Y(P.zen.z - P.zen.d / 2 + (k * P.zen.d) / 8))}' x2='${f(X(P.zen.x + P.zen.w / 2))}' y2='${f(Y(P.zen.z - P.zen.d / 2 + (k * P.zen.d) / 8))}' stroke='#b9ae8c' stroke-width='0.5'/>`; }
  for (const b of P.bridges) g += poly(P2(rectPts(b.x, b.z, b.w / 2, b.len / 2, b.ry)), "fill='#b98d5c' stroke='#6b4a2a' stroke-width='0.8'");
  if (P.fountain) g += `<circle cx='${f(X(P.fountain.x))}' cy='${f(Y(P.fountain.z))}' r='${f(P.fountain.r * S)}' fill='#a9cfe3' stroke='#4b7f9f'/>`;
  // cây, đèn, đá
  const tc = { bamboo: '#7fae5a', cypress: '#3f6e45', hedge: '#5e8d4b', pine: '#476f45', peach: '#e7a3b6', sakura: '#efb7c6', plum: '#f1e4ea', willow: '#9ab866', maple: '#d06a3e', jacaranda: '#9a86d6', wisteria: '#ae9ad9', ginkgo: '#d4c55a' };
  for (const t of P.trees) g += `<circle cx='${f(X(t.x))}' cy='${f(Y(t.z))}' r='${f(1.9 * S)}' fill='${tc[t.kind] || '#86ab6d'}' fill-opacity='0.75'/>`;
  for (const l of P.lamps) g += `<circle cx='${f(X(l.x))}' cy='${f(Y(l.z))}' r='1.2' fill='#b07a1c'/>`;
  for (const s of P.stupas || []) g += `<circle cx='${f(X(s.x))}' cy='${f(Y(s.z))}' r='${f(s.r * S + 1)}' fill='#e2c25a' stroke='#8a6d1a'/>`;
  // giả sơn
  { const k = P.rockery; g += poly(P2(rectPts(k.x, k.z, k.w / 2, k.d / 2, 0)), "fill='#b9a58a' stroke='#6d5b44' stroke-width='1'") + poly(P2(rectPts(k.x, k.z + k.d / 2 + k.run / 2, k.stairW / 2, k.run / 2, 0)), "fill='#d8cbb2' stroke='#6d5b44' stroke-width='0.6'"); }
  // tường + cổng
  for (const w of P.walls) { const outer = Math.abs(Math.abs(w.x) - HW) < 1 || Math.abs(Math.abs(w.z) - HD) < 1; g += poly(P2(rectPts(w.x, w.z, w.len / 2, Math.max(w.t, outer ? 2.2 : 1.4) / 2, w.ry)), `fill='${outer ? '#5a4a3a' : '#7d6a55'}' stroke='none'`); }
  for (const gt of P.gates) g += `<circle cx='${f(X(gt.x))}' cy='${f(Y(gt.z))}' r='5' fill='#c0392b'/>` + T(X(gt.x) + (gt.x > 0 ? -8 : 8), Y(gt.z) + (gt.z > 0 ? -8 : gt.z < 0 ? 16 : 4), 10, gt.main ? 'Cổng chính' : `Cổng ${gt.id === 'east' ? 'Đông' : gt.id === 'west' ? 'Tây' : 'Bắc'}`, `text-anchor='${gt.x > 0 ? 'end' : gt.x < 0 ? 'start' : 'middle'}' fill='#8b1d12'`);
  // đình
  P.pavs.forEach((p, k) => { const pts = p.octa ? Array.from({ length: 8 }, (_, a) => [p.x + Math.cos(a * Math.PI / 4 + Math.PI / 8) * p.w / 2, p.z + Math.sin(a * Math.PI / 4 + Math.PI / 8) * p.d / 2]) : rectPts(p.x, p.z, p.w / 2, p.d / 2, 0); g += poly(P2(pts), "fill='#e0b06a' stroke='#6b4a2a' stroke-width='0.8'") + T(X(p.x), Y(p.z) + 3.5, 9, `Đ${k + 1}`, "text-anchor='middle' font-weight='bold'"); });
  // lầu
  { const t = P.tower, sp = t.spec, a = sp.podium.a, f0 = sp.floors[0].a; g += poly(P2(rectPts(t.x, t.z, a, a, 0)), "fill='#d9c7a6' stroke='#4a3a28' stroke-width='1.2'") + poly(P2(rectPts(t.x, t.z + a + sp.podium.run / 2, sp.podium.stairW / 2, sp.podium.run / 2, 0)), "fill='#efe3c8' stroke='#4a3a28' stroke-width='0.8'") + poly(P2(Array.from({ length: sp.n }, (_, q) => { const ang = (q / sp.n) * Math.PI * 2 + (sp.n === 4 ? Math.PI / 4 : Math.PI / sp.n); return [t.x + Math.cos(ang) * f0 * (sp.n === 4 ? Math.SQRT2 : 1), t.z + Math.sin(ang) * f0 * (sp.n === 4 ? Math.SQRT2 : 1)]; })), `fill='${st.roofCol || '#b8322a'}' fill-opacity='0.85' stroke='${INK}' stroke-width='1.2'`) + `<circle cx='${f(X(t.x))}' cy='${f(Y(t.z))}' r='13' fill='#fffdf6' stroke='${INK}' stroke-width='1.5'/>` + T(X(t.x), Y(t.z) + 5, 13, 'L', "text-anchor='middle' font-weight='bold'"); }
  // công trình
  P.buildings.forEach((b, k) => {
    if (b.arch) { // công trình dựng theo kiến trúc thật (arch/): hộp chiếm đất (nền, nguyệt đài, bậc) nét đứt + thân theo lưới cột
      const fc = footCenter(b), bw = b.body?.[0] || b.w * 0.7, bd = b.body?.[1] || b.d * 0.7, fx = Math.sin(b.ry), fz = Math.cos(b.ry);
      g += poly(P2(rectPts(fc.x, fc.z, b.w / 2, b.d / 2, b.ry)), "fill='#efe6d2' stroke='#7a6a52' stroke-width='0.8' stroke-dasharray='3 2'");
      g += poly(P2(rectPts(b.x, b.z, bw / 2, bd / 2, b.ry)), `fill='${b.main ? (st.roofCol || '#b8322a') : '#c98f6a'}' fill-opacity='0.9' stroke='${INK}' stroke-width='1.4'`);
      g += `<circle cx='${f(X(b.x))}' cy='${f(Y(b.z))}' r='10' fill='#fffdf6' stroke='${INK}'/>` + T(X(b.x), Y(b.z) + 4, 11, String(k + 1), "text-anchor='middle' font-weight='bold'");
      g += `<circle cx='${f(X(b.x + fx * (b.front + 1.5)))}' cy='${f(Y(b.z + fz * (b.front + 1.5)))}' r='2.4' fill='#c0392b'/>`; return;
    }
    const ph = b.plinth, nS = Math.max(1, Math.round(ph / 0.22)), run = nS * 0.34, asian = P.S.fam === 'asian', W = asian ? b.w + 2.4 : b.w + 0.2, Dp = asian ? b.d + 2.4 : b.d + 0.2;
    g += poly(P2(rectPts(b.x, b.z, W / 2, Dp / 2, b.ry)), "fill='#efe6d2' stroke='#7a6a52' stroke-width='0.8' stroke-dasharray='3 2'");
    const fx = Math.sin(b.ry), fz = Math.cos(b.ry), sw = Math.min(6, b.w * 0.3) / 2;
    for (const sd of b.back ? [1, -1] : [1]) g += poly(P2(rectPts(b.x + fx * sd * (Dp / 2 + run / 2), b.z + fz * sd * (Dp / 2 + run / 2), sw, run / 2, b.ry)), "fill='#efe6d2' stroke='#7a6a52' stroke-width='0.6'");
    g += poly(P2(rectPts(b.x, b.z, b.w / 2, b.d / 2, b.ry)), `fill='${b.main ? (st.roofCol || '#b8322a') : '#c98f6a'}' fill-opacity='0.9' stroke='${INK}' stroke-width='1.4'`);
    // vạch chéo mái
    const c = rectPts(b.x, b.z, b.w / 2, b.d / 2, b.ry).map(([x, z]) => [X(x), Y(z)]); g += `<line x1='${f(c[0][0])}' y1='${f(c[0][1])}' x2='${f(c[2][0])}' y2='${f(c[2][1])}' stroke='${INK}' stroke-opacity='0.35'/><line x1='${f(c[1][0])}' y1='${f(c[1][1])}' x2='${f(c[3][0])}' y2='${f(c[3][1])}' stroke='${INK}' stroke-opacity='0.35'/>`;
    g += `<circle cx='${f(X(b.x))}' cy='${f(Y(b.z))}' r='10' fill='#fffdf6' stroke='${INK}'/>` + T(X(b.x), Y(b.z) + 4, 11, String(k + 1), "text-anchor='middle' font-weight='bold'");
    const ax = X(b.x + fx * (Dp / 2 + run + 4)), ay = Y(b.z + fz * (Dp / 2 + run + 4)); g += `<circle cx='${f(ax)}' cy='${f(ay)}' r='2.4' fill='#c0392b'/>`; // cửa chính
  });
  // khung, Bắc, thước
  g += `<rect x='${X(-HW)}' y='${Y(-HD)}' width='${TP_W * S}' height='${TP_D * S}' fill='none' stroke='${INK}' stroke-width='2'/>`;
  const nx = X(HW) - 40, ny = oy + 50; g += `<polygon points='${nx},${ny - 30} ${nx - 10},${ny + 6} ${nx},${ny} ${nx + 10},${ny + 6}' fill='${INK}'/>` + T(nx, ny + 24, 14, 'B', "text-anchor='middle' font-weight='bold'");
  const sx = X(-HW), sy = Y(HD) + 34; for (const [a, b2, fl] of [[0, 20, 1], [20, 50, 0], [50, 100, 1]]) g += `<rect x='${f(sx + a * S)}' y='${sy}' width='${f((b2 - a) * S)}' height='7' fill='${fl ? INK : PAPER}' stroke='${INK}'/>`;
  for (const v of [0, 20, 50, 100]) g += T(sx + v * S, sy + 22, 11, `${v} m`, "text-anchor='middle'");
  g += T(sx + 120 * S, sy + 8, 12, `Lưới trục 20 m · gốc toạ độ = tâm phủ · phủ ${TP_W} × ${TP_D} m = ${(TP_W * TP_D).toLocaleString('vi-VN')} m²`);
  // chú giải bên phải
  const lx = ox + TP_W * S + 40; let ly = 90;
  g += T(lx, 40, 24, `TỔNG MẶT BẰNG — ${P.st.name.toUpperCase()}`, "font-weight='bold'") + T(lx, 66, 13, `Bản vẽ ${String(n).padStart(2, '0')}-00 · Nguyên mẫu: ${D.proto}`);
  const wrap = (txt, w) => { const out = []; let line = ''; for (const word of txt.split(' ')) { if ((line + ' ' + word).length > w) { out.push(line); line = word; } else line = line ? line + ' ' + word : word; } if (line) out.push(line); return out; };
  for (const l of wrap(`Ý đồ: ${D.concept}`, 92)) { g += T(lx, ly, 12, l); ly += 17; }
  ly += 10; g += T(lx, ly, 15, 'CÔNG TRÌNH (số trên bản vẽ — mỗi công trình có tờ riêng)', "font-weight='bold'"); ly += 8;
  const hdr = ['Số', 'Tên', 'Công năng', 'Rộng×Sâu', 'Thân/Tầng', 'Bệ', 'Mặt chính', 'Ô'];
  const cx = [0, 30, 230, 395, 470, 545, 585, 670]; ly += 18; hdr.forEach((h, q) => { g += T(lx + cx[q], ly, 11, h, "font-weight='bold'"); }); ly += 4; g += `<line x1='${lx}' y1='${ly}' x2='${lx + 700}' y2='${ly}' stroke='${INK}'/>`;
  P.buildings.forEach((b, k) => { ly += 17; [String(k + 1), b.name.slice(0, 28), (b.fn || '').slice(0, 24), `${f1(b.w)}×${f1(b.d)}`, `${f1(bodyH(P.S, b))} m/${b.floors}`, `${f1(b.plinth)}`, dirName(b.ry), gridLabel(b.x, b.z)].forEach((v, q) => { g += T(lx + cx[q], ly, 11, v, b.main && q === 1 ? "font-weight='bold'" : ''); }); });
  ly += 17; ['L', P.tower.name, '10 tầng + Vọng Đài', `${f1(P.tower.spec.floors[0].a * 2)}×${f1(P.tower.spec.floors[0].a * 2)}`, `${f1(P.tower.spec.deck.y)} m/10`, f1(P.tower.spec.podium.y), 'Nam', gridLabel(P.tower.x, P.tower.z)].forEach((v, q) => { g += T(lx + cx[q], ly, 11, v, "font-weight='bold'"); });
  ly += 26; g += T(lx, ly, 15, 'ĐÌNH · GIẢ SƠN · NƯỚC', "font-weight='bold'"); ly += 6;
  P.pavs.forEach((p, k) => { ly += 16; g += T(lx, ly, 11, `Đ${k + 1}  ${p.name} — ${f1(p.w)}×${f1(p.d)} m${p.octa ? ', bát giác' : ''}${p.y ? `, trên đỉnh giả sơn +${f1(p.y)} m` : ''} · ô ${gridLabel(p.x, p.z)}`); });
  ly += 16; g += T(lx, ly, 11, `Giả sơn / đài: ${P.rockery.name || ''} — ${f1(P.rockery.w)}×${f1(P.rockery.d)} m, cao ${f1(P.rockery.h)} m, ${P.rockery.steps} bậc`);
  ly += 16; g += T(lx, ly, 11, `Mặt nước: ${P.water.length} khối, ${Math.round(P.water.reduce((a, w) => a + (w.shape === 'ellipse' ? Math.PI * w.rx * w.rz : 4 * w.hw * w.hd), 0)).toLocaleString('vi-VN')} m² · cầu ${P.bridges.length} · đảo ${P.islands.length}`);
  ly += 16; g += T(lx, ly, 11, `Cây ${P.trees.length} · đèn ${P.lamps.length} · đá ${P.rocks.length} · ghế ${P.benches.length} · tường trong ${P.walls.filter((w) => w.len < 400 && !(Math.abs(Math.abs(w.x) - HW) < 1 || Math.abs(Math.abs(w.z) - HD) < 1)).length} đoạn`);
  ly += 26; g += T(lx, ly, 15, 'CHÚ GIẢI', "font-weight='bold'");
  const key = [['#c98f6a', 'công trình (nét đứt: bệ + bậc; chấm đỏ: cửa chính)'], [st.roofCol || '#b8322a', 'công trình chính / lầu 10 tầng (L)'], ['#e0b06a', 'đình (Đ)'], ['#a9cfe3', 'mặt nước'], ['#b98d5c', 'cầu'], ['#ddd2b8', 'lối lát'], ['#7d6a55', 'tường trong / tường bao (đậm)'], ['#b9a58a', 'giả sơn / đài'], ['#86ab6d', 'cây (màu theo loài)'], ['#b07a1c', 'đèn']];
  key.forEach(([c, t], q) => { const yy = ly + 14 + q * 18; g += `<rect x='${lx}' y='${yy - 10}' width='16' height='12' fill='${c}' stroke='${INK}' stroke-width='0.5'/>` + T(lx + 24, yy, 11, t); });
  return svgDoc(lx + 720, Math.max(oy + TP_D * S + 80, ly + 220), g);
}

// ------------------------------------------------------------------- TỜ CÔNG TRÌNH
function buildingSheet(P, b, n, k) {
  const S0 = P.S, asian = S0.fam === 'asian', ph = b.plinth, nS = Math.max(1, Math.round(ph / 0.22)), run = nS * 0.34, sw = Math.min(6, b.w * 0.3);
  const W = asian ? b.w + 2.4 : b.w + 0.2, Dp = asian ? b.d + 2.4 : b.d + 0.2, H = bodyH(S0, b), RH = roofH(S0, b), rk = roofKind(S0);
  let g = T(30, 40, 22, `${b.name}`, "font-weight='bold'") + T(30, 64, 13, `Bản vẽ ${String(n).padStart(2, '0')}-${String(k + 1).padStart(2, '0')} · ${P.st.name} · ${b.fn || ''}`);
  // ---- MẶT BẰNG (cửa chính quay xuống dưới trang)
  const s = Math.min(560 / (W + 10), 470 / (Dp + 2 * run + 12)), cx = 330, cy = 120 + (Dp / 2 + (b.back ? run : 0) + 6) * s;
  const X = (x) => cx + x * s, Y = (z) => cy + z * s;
  g += T(30, 100, 15, `MẶT BẰNG — tỉ lệ 1:${Math.round(1000 / (s * 0.2646))}`, "font-weight='bold'");
  g += `<rect x='${f(X(-W / 2))}' y='${f(Y(-Dp / 2))}' width='${f(W * s)}' height='${f(Dp * s)}' fill='#efe6d2' stroke='#7a6a52' stroke-dasharray='5 3'/>`;
  for (const sd of b.back ? [1, -1] : [1]) for (let q = 0; q < nS; q++) { const z0 = sd * (Dp / 2 + q * 0.34); g += `<rect x='${f(X(-sw / 2))}' y='${f(Math.min(Y(z0), Y(z0 + sd * 0.34)))}' width='${f(sw * s)}' height='${f(0.34 * s)}' fill='#f6efdc' stroke='#7a6a52' stroke-width='0.5'/>`; }
  // tường + cửa (2,4 m giữa mặt trước / sau)
  const wt = 0.3, door = 2.4, hw = b.w / 2, hd = b.d / 2;
  const wallSeg = (x0, z0, x1, z1) => `<line x1='${f(X(x0))}' y1='${f(Y(z0))}' x2='${f(X(x1))}' y2='${f(Y(z1))}' stroke='${INK}' stroke-width='${f(Math.max(2.5, wt * s))}'/>`;
  for (const sd of [1, -1]) { if (sd > 0 || b.back) { g += wallSeg(-hw, sd * hd, -door / 2, sd * hd) + wallSeg(door / 2, sd * hd, hw, sd * hd); g += `<path d='M ${f(X(-door / 2))} ${f(Y(sd * hd))} A ${f(door * s)} ${f(door * s)} 0 0 ${sd > 0 ? 0 : 1} ${f(X(door / 2))} ${f(Y(sd * hd + sd * door))}' fill='none' stroke='${INK}' stroke-width='0.6' stroke-dasharray='3 2'/>`; } else g += wallSeg(-hw, sd * hd, hw, sd * hd); }
  g += wallSeg(-hw, -hd, -hw, hd) + wallSeg(hw, -hd, hw, hd);
  // lưới cột (Á Đông: archkit.hall — gian = round(w/3,8), cột hiên lùi 0,7 m) / cửa sổ (Tây)
  if (asian) {
    const bays = Math.max(2, Math.round(b.w / 3.8)), bayW = (b.w + 1.4) / bays, sb = Math.max(1, Math.round(b.d / 3.8));
    for (let i = 0; i <= bays; i++) for (const sz of [1, -1]) g += `<circle cx='${f(X(-hw - 0.7 + i * bayW))}' cy='${f(Y(sz * (hd + 0.7)))}' r='${f(Math.max(2.5, 0.22 * s))}' fill='#8b2a1d'/>`;
    for (let j = 1; j < sb; j++) for (const sx of [1, -1]) g += `<circle cx='${f(X(sx * (hw + 0.7)))}' cy='${f(Y(-hd - 0.7 + (j * (b.d + 1.4)) / sb))}' r='${f(Math.max(2.5, 0.22 * s))}' fill='#8b2a1d'/>`;
    g += dimH(X(-hw - 0.7), X(-hw - 0.7 + bayW), Y(-Dp / 2) - 26, `gian ${f1(bayW)} m × ${bays}`);
  } else { for (let x = -hw + 2; x <= hw - 2; x += 3.5) if (Math.abs(x) > door) for (const sd of [1, -1]) g += `<rect x='${f(X(x - 0.6))}' y='${f(Y(sd * hd) - 2)}' width='${f(1.2 * s)}' height='4' fill='#7fa6c4'/>`; }
  g += dimH(X(-hw), X(hw), Y(Dp / 2 + run) + 30, `${f1(b.w)} m (thân)`) + dimH(X(-W / 2), X(W / 2), Y(Dp / 2 + run) + 58, `${f1(W)} m (bệ)`);
  g += dimV(Y(-hd), Y(hd), X(W / 2) + 26, `${f1(b.d)} m`) + dimV(Y(Dp / 2), Y(Dp / 2 + run), X(-W / 2) - 60, `${nS} bậc × 0,34`);
  g += T(X(0), Y(Dp / 2 + run) + 86, 12, `▼ MẶT CHÍNH — hướng ${dirName(b.ry)} · cửa ${door} m${b.back ? ' · có cửa sau' : ''}`, "text-anchor='middle'");
  // ---- MẶT ĐỨNG CHÍNH
  const es = Math.min(560 / (W + 8), 300 / (ph + H + RH + 4)), ex = 1010, ey = 140 + (ph + H + RH + 2) * es, EX = (x) => ex + x * es, EY = (y) => ey - y * es;
  g += T(700, 100, 15, `MẶT ĐỨNG CHÍNH — tỉ lệ 1:${Math.round(1000 / (es * 0.2646))}`, "font-weight='bold'");
  const elev = (wid, depthSide) => {
    let e = `<line x1='${f(EX(-wid / 2 - 4))}' y1='${f(EY(0))}' x2='${f(EX(wid / 2 + 4))}' y2='${f(EY(0))}' stroke='${INK}' stroke-width='2'/>`;
    const Wb = depthSide ? Dp : W, wb = depthSide ? b.d : b.w;
    e += `<rect x='${f(EX(-Wb / 2))}' y='${f(EY(ph))}' width='${f(Wb * es)}' height='${f(ph * es)}' fill='#cdbf9f' stroke='${INK}'/>`;
    e += `<rect x='${f(EX(-wb / 2))}' y='${f(EY(ph + H))}' width='${f(wb * es)}' height='${f(H * es)}' fill='${P.st.wall || '#e9dfc9'}' fill-opacity='0.8' stroke='${INK}'/>`;
    if (asian) { const bays = Math.max(2, Math.round((depthSide ? b.d : b.w) / 3.8)), bw = (wb + 1.4) / bays; for (let i = 0; i <= bays; i++) e += `<rect x='${f(EX(-wb / 2 - 0.7 + i * bw) - 0.22 * es)}' y='${f(EY(ph + H))}' width='${f(0.44 * es)}' height='${f(H * es)}' fill='#8b2a1d'/>`; }
    else for (let fl = 0; fl < (b.floors || 1); fl++) for (let x = -wb / 2 + 2; x <= wb / 2 - 2; x += 3.5) e += `<rect x='${f(EX(x - 0.6))}' y='${f(EY(ph + fl * 4.2 + 3.2))}' width='${f(1.2 * es)}' height='${f(2 * es)}' fill='#7fa6c4' stroke='${INK}' stroke-width='0.4'/>`;
    if (!depthSide) e += `<rect x='${f(EX(-1.2))}' y='${f(EY(ph + Math.min(3.4, H - 0.4)))}' width='${f(2.4 * es)}' height='${f(Math.min(3.4, H - 0.4) * es)}' fill='#6b3a22'/>`;
    const y0 = ph + H, ov = asian ? 1.6 : 0.4, L = -wb / 2 - ov, R = wb / 2 + ov, rc = P.st.roofCol || '#7a6a52';
    if (rk === 'deco') e += `<rect x='${f(EX(L - 0.8))}' y='${f(EY(y0 + 0.35))}' width='${f((R - L + 1.6) * es)}' height='${f(0.35 * es)}' fill='${rc}' stroke='${INK}'/>`;
    else if (rk === 'flat') e += `<rect x='${f(EX(-wb / 2 - 0.2))}' y='${f(EY(y0 + RH))}' width='${f((wb + 0.4) * es)}' height='${f(RH * es)}' fill='#7a2b22' stroke='${INK}'/>`;
    else if (rk === 'onion') { const r0 = Math.min(b.w, b.d) * 0.28; e += `<rect x='${f(EX(-wb / 2))}' y='${f(EY(y0 + 0.6))}' width='${f(wb * es)}' height='${f(0.6 * es)}' fill='#e6e0d4' stroke='${INK}'/><rect x='${f(EX(-r0 * 0.9))}' y='${f(EY(y0 + 2.2))}' width='${f(r0 * 1.8 * es)}' height='${f(2.2 * es)}' fill='#f2eee6' stroke='${INK}'/><path d='M ${f(EX(-r0))} ${f(EY(y0 + 2.2))} C ${f(EX(-r0 * 1.25))} ${f(EY(y0 + 2.2 + r0 * 1.3))}, ${f(EX(-r0 * 0.1))} ${f(EY(y0 + 2.2 + r0 * 1.7))}, ${f(EX(0))} ${f(EY(y0 + 2.2 + r0 * 2.2))} C ${f(EX(r0 * 0.1))} ${f(EY(y0 + 2.2 + r0 * 1.7))}, ${f(EX(r0 * 1.25))} ${f(EY(y0 + 2.2 + r0 * 1.3))}, ${f(EX(r0))} ${f(EY(y0 + 2.2))} Z' fill='#f7f5ef' stroke='${INK}'/>`; }
    else if (rk === 'thai') { for (let q = 0; q < 3; q++) { const sc = 1 - q * 0.22, hh = RH * (0.45 - q * 0.08), yb = y0 + q * RH * 0.3; e += poly([[EX(L * sc), EY(yb)], [EX(0), EY(yb + hh + RH * 0.25)], [EX(R * sc), EY(yb)]], `fill='${rc}' stroke='${INK}'`); } e += `<line x1='${f(EX(0))}' y1='${f(EY(y0 + RH))}' x2='${f(EX(0))}' y2='${f(EY(y0 + RH * 1.4))}' stroke='#c9a227' stroke-width='3'/>`; }
    else if (rk === 'gable') e += poly([[EX(L), EY(y0)], [EX(0), EY(y0 + RH * 1.4)], [EX(R), EY(y0)]], `fill='${rc}' stroke='${INK}'`);
    else { const up = rk === 'curved' || rk === 'vn' ? 1.2 : rk === 'irimoya' ? 0.6 : 0; e += `<path d='M ${f(EX(L - up))} ${f(EY(y0 + up))} Q ${f(EX(L + 2))} ${f(EY(y0 - 0.2))} ${f(EX(-wb * 0.28))} ${f(EY(y0 + RH * 0.75))} L ${f(EX(wb * 0.28))} ${f(EY(y0 + RH * 0.75))} Q ${f(EX(R - 2))} ${f(EY(y0 - 0.2))} ${f(EX(R + up))} ${f(EY(y0 + up))} L ${f(EX(R))} ${f(EY(y0))} L ${f(EX(L))} ${f(EY(y0))} Z' fill='${rc}' stroke='${INK}'/><line x1='${f(EX(-wb * 0.28))}' y1='${f(EY(y0 + RH * 0.75))}' x2='${f(EX(wb * 0.28))}' y2='${f(EY(y0 + RH * 0.75))}' stroke='${INK}' stroke-width='3'/>`; }
    if (S0.dome && rk !== 'onion') { const r0 = Math.min(b.w, b.d) * 0.28; e += `<path d='M ${f(EX(-r0))} ${f(EY(y0 + 2.2))} A ${f(r0 * es)} ${f(r0 * es)} 0 0 1 ${f(EX(r0))} ${f(EY(y0 + 2.2))} Z' fill='#7f9a9e' stroke='${INK}'/>`; }
    return e;
  };
  g += elev(W, false);
  g += dimV(EY(0), EY(ph), EX(W / 2) + 18, `bệ ${f1(ph)} m`) + dimV(EY(ph), EY(ph + H), EX(W / 2) + 18, `thân ${f1(H)} m (${b.floors} tầng)`) + dimV(EY(ph + H), EY(ph + H + RH), EX(W / 2) + 18, `mái ≈ ${f1(RH)} m`);
  // ---- MẶT ĐỨNG BÊN
  const ex2 = 1010, ey2 = ey + 120 + (ph + H + RH + 2) * es, prevEX = ex, prevEY = ey;
  g += T(700, ey + 70, 15, 'MẶT ĐỨNG BÊN (cùng tỉ lệ)', "font-weight='bold'");
  { const keepX = EX, keepY = EY; const EX2 = (x) => ex2 + x * es, EY2 = (y) => ey2 - y * es; const saveEX = EX, saveEY = EY; }
  g += `<g transform='translate(0, ${f(ey2 - prevEY)})'>${elev(Dp, true)}</g>`;
  // ---- KHUNG TÊN
  const rows = [['Mã / vị trí', `${b.id} · tâm (${f1(b.x)}, ${f1(b.z)}) m · ô lưới ${gridLabel(b.x, b.z)}`], ['Công năng', `${b.fn || ''} · bài trí mặc định: ${FLOOR_THEMES[b.theme ?? 1]?.name || ''}`], ['Kích thước', `thân ${f1(b.w)} × ${f1(b.d)} m · bệ ${f1(W)} × ${f1(Dp)} m · diện tích sàn ${Math.round(b.w * b.d * (b.floors || 1))} m²`], ['Chiều cao', `bệ ${f1(ph)} m · thân ${f1(H)} m · mái ≈ ${f1(RH)} m · đỉnh ≈ ${f1(ph + H + RH)} m`], ['Tầng / cửa', `${b.floors} tầng · cửa chính ${door} m hướng ${dirName(b.ry)}${b.back ? ' · cửa sau' : ''} · ${nS} bậc cao ${f1(ph / nS)} m`], ['Mái / vật liệu', `${ROOF_TXT[rk] || rk} · mái ${P.st.roofCol || ''} · tường ${P.st.wall || ''} · viền ${P.st.trim || ''}`], ['Dựng bằng', 'archkit-style.styledBuilding(S, b) — đúng số liệu tờ này (siteplans.js)']];
  g += titleBlock(30, 760, 1360, rows, `KHUNG TÊN — ${P.site.proto}`);
  return svgDoc(1420, 940, g);
}

// ------------------------------------------------------------------- LẦU 10 TẦNG
function towerSheet(P, n) {
  const t = P.tower, sp = t.spec, top = sp.deck.y + 6, s = Math.min(560 / (sp.podium.a * 2 + 20), 760 / (top + 4)), ex = 330, ey = 850, EX = (x) => ex + x * s, EY = (y) => ey - y * s;
  let g = T(30, 40, 22, `${t.name}`, "font-weight='bold'") + T(30, 64, 13, `Bản vẽ ${String(n).padStart(2, '0')}-L · ${P.st.name} · ${LEVELS} tầng kín + Vọng Đài · tâm (${f1(t.x)}, ${f1(t.z)}) ô ${gridLabel(t.x, t.z)}`);
  g += T(30, 96, 15, `MẶT ĐỨNG LẦU — tỉ lệ 1:${Math.round(1000 / (s * 0.2646))}`, "font-weight='bold'");
  g += `<line x1='${EX(-sp.podium.a - 8)}' y1='${EY(0)}' x2='${EX(sp.podium.a + 8)}' y2='${EY(0)}' stroke='${INK}' stroke-width='2'/>`;
  g += `<rect x='${f(EX(-sp.podium.a))}' y='${f(EY(sp.podium.y))}' width='${f(sp.podium.a * 2 * s)}' height='${f(sp.podium.y * s)}' fill='#cdbf9f' stroke='${INK}'/>`;
  sp.floors.forEach((fl, k) => {
    const y1 = k + 1 < sp.floors.length ? sp.floors[k + 1].y : sp.deck.y;
    g += `<rect x='${f(EX(-fl.a))}' y='${f(EY(y1 - 0.6))}' width='${f(fl.a * 2 * s)}' height='${f((y1 - 0.6 - fl.y) * s)}' fill='${P.st.wall || '#e9dfc9'}' fill-opacity='0.85' stroke='${INK}'/>`;
    g += `<rect x='${f(EX(-fl.slabA))}' y='${f(EY(y1))}' width='${f(fl.slabA * 2 * s)}' height='${f(0.6 * s)}' fill='${P.st.roofCol || '#7a6a52'}' stroke='${INK}' stroke-width='0.6'/>`;
    g += T(EX(fl.a) + 14, EY((fl.y + y1) / 2) + 4, 11, `T${k + 1} · +${f1(fl.y)} m · ${FLOOR_THEMES[k]?.name || ''} · ${f1(fl.a * 2)} m`);
  });
  g += `<rect x='${f(EX(-sp.deck.a))}' y='${f(EY(sp.deck.y + 1.1))}' width='${f(sp.deck.a * 2 * s)}' height='${f(1.1 * s)}' fill='none' stroke='${INK}' stroke-dasharray='3 2'/>` + T(EX(sp.deck.a) + 14, EY(sp.deck.y) + 4, 11, `Vọng Đài · +${f1(sp.deck.y)} m · lan can 1,1 m`);
  g += `<polygon points='${f(EX(-3))},${f(EY(sp.deck.y + 1.2))} ${f(EX(0))},${f(EY(sp.height))} ${f(EX(3))},${f(EY(sp.deck.y + 1.2))}' fill='#c9a227' stroke='${INK}'/>` + T(EX(4), EY(sp.height) + 4, 11, `đỉnh ${sp.crown || P.st.tower?.crown || ''} · +${f1(sp.height)} m`);
  g += dimV(EY(0), EY(sp.podium.y), EX(-sp.podium.a) - 30, `thềm ${f1(sp.podium.y)}`) + dimV(EY(sp.floors[0].y), EY(sp.floors[1].y), EX(-sp.podium.a) - 30, `tầng ${f1(FH)} m`);
  // mặt bằng tầng điển hình (tầng 1)
  const fl = sp.floors[0], ps = Math.min(520 / (sp.podium.a * 2 + 8), 520 / (sp.podium.a * 2 + sp.podium.run + 8)), px = 1050, py = 380, X = (x) => px + x * ps, Y = (z) => py + z * ps;
  g += T(760, 96, 15, `MẶT BẰNG TẦNG 1 (điển hình) — tỉ lệ 1:${Math.round(1000 / (ps * 0.2646))}`, "font-weight='bold'");
  g += `<rect x='${f(X(-sp.podium.a))}' y='${f(Y(-sp.podium.a))}' width='${f(sp.podium.a * 2 * ps)}' height='${f(sp.podium.a * 2 * ps)}' fill='#efe6d2' stroke='#7a6a52' stroke-dasharray='5 3'/><rect x='${f(X(-sp.podium.stairW / 2))}' y='${f(Y(sp.podium.a))}' width='${f(sp.podium.stairW * ps)}' height='${f(sp.podium.run * ps)}' fill='#f6efdc' stroke='#7a6a52'/>`;
  for (let q = 0; q < sp.podium.steps; q++) g += `<line x1='${f(X(-sp.podium.stairW / 2))}' y1='${f(Y(sp.podium.a + (q * sp.podium.run) / sp.podium.steps))}' x2='${f(X(sp.podium.stairW / 2))}' y2='${f(Y(sp.podium.a + (q * sp.podium.run) / sp.podium.steps))}' stroke='#7a6a52' stroke-width='0.4'/>`;
  const np = sp.n, R = fl.a / Math.cos(Math.PI / np), rot = np === 4 ? Math.PI / 4 : Math.PI / np;
  g += poly(Array.from({ length: np }, (_, q) => { const a = rot + (q / np) * Math.PI * 2; return [X(Math.cos(a) * R), Y(Math.sin(a) * R)]; }), `fill='${P.st.wall || '#e9dfc9'}' fill-opacity='0.6' stroke='${INK}' stroke-width='3'`);
  const sk = sp.stairs[0], zA = Math.min(sk.z0, sk.z1), zB = Math.max(sk.z0, sk.z1); g += `<rect x='${f(X(sk.x - 1))}' y='${f(Y(zA))}' width='${f(2 * ps)}' height='${f((zB - zA) * ps)}' fill='#d8c9a8' stroke='${INK}'/>` + T(X(sk.x) + 2.2 * ps, Y((sk.z0 + sk.z1) / 2), 11, `thang bộ 2,0 m · ${f1(Math.abs(sk.z1 - sk.z0))} m chạy`);
  g += `<circle cx='${f(X(sp.pad.x))}' cy='${f(Y(sp.pad.z))}' r='${f(1.3 * ps)}' fill='#bfe3f2' stroke='#3c7fa0' stroke-width='2'/>` + T(X(sp.pad.x) + 1.6 * ps, Y(sp.pad.z) + 4, 11, 'đĩa thang phép Ø 2,6 m');
  g += T(X(0), Y(sp.podium.a + sp.podium.run) + 28, 12, `▼ cửa chính (Nam) · thềm ${sp.podium.steps} bậc × ${f1(sp.podium.rise || sp.podium.y / sp.podium.steps)} m`, "text-anchor='middle'");
  g += dimH(X(-fl.a), X(fl.a), Y(-sp.podium.a) - 22, `${f1(fl.a * 2)} m (tầng 1)`) + dimH(X(-sp.podium.a), X(sp.podium.a), Y(-sp.podium.a) - 50, `${f1(sp.podium.a * 2)} m (thềm)`);
  const rows = sp.floors.map((q, k) => [`Tầng ${k + 1}`, `+${f1(q.y)} m · ${f1(q.a * 2)} × ${f1(q.a * 2)} m (${np} cạnh) · sàn đua ${f1(q.slabA * 2)} m · ${FLOOR_THEMES[k]?.name || ''}`]);
  g += titleBlock(760, 700, 640, [...rows.slice(0, 5), ['Vọng Đài', `+${f1(sp.deck.y)} m · ${f1(sp.deck.a * 2)} m · đỉnh +${f1(sp.height)} m`], ['Dựng bằng', 'tower3d.buildTower(towerSpec(st)) — số liệu tờ này']], 'KHUNG TÊN — LẦU 10 TẦNG');
  return svgDoc(1430, 920, g);
}

// ------------------------------------------------------------------- ĐÌNH
function pavSheet(P, p, n, k) {
  const s = Math.min(380 / (p.w + 8), 380 / (p.d + 8)), cx = 260, cy = 330, X = (x) => cx + x * s, Y = (z) => cy + z * s, H = p.h || 3.6;
  let g = T(30, 40, 20, p.name, "font-weight='bold'") + T(30, 62, 13, `Bản vẽ ${String(n).padStart(2, '0')}-Đ${k + 1} · ${P.st.name} · tâm (${f1(p.x)}, ${f1(p.z)}) ô ${gridLabel(p.x, p.z)}${p.y ? ` · trên đỉnh giả sơn +${f1(p.y)} m` : ''}`);
  g += T(30, 100, 15, 'MẶT BẰNG', "font-weight='bold'");
  const pts = p.octa ? Array.from({ length: 8 }, (_, a) => [Math.cos(a * Math.PI / 4 + Math.PI / 8) * p.w / 2, Math.sin(a * Math.PI / 4 + Math.PI / 8) * p.d / 2]) : [[-p.w / 2, -p.d / 2], [p.w / 2, -p.d / 2], [p.w / 2, p.d / 2], [-p.w / 2, p.d / 2]];
  g += poly(pts.map(([x, z]) => [X(x * 1.25), Y(z * 1.25)]), "fill='#efe6d2' stroke='#7a6a52' stroke-dasharray='5 3'") + poly(pts.map(([x, z]) => [X(x), Y(z)]), "fill='#f3e3c2' stroke='#2b241c' stroke-width='1.5'");
  for (const [x, z] of pts) g += `<circle cx='${f(X(x))}' cy='${f(Y(z))}' r='5' fill='#8b2a1d'/>`;
  g += dimH(X(-p.w / 2), X(p.w / 2), Y(p.d / 2) + 40, `${f1(p.w)} m`) + dimV(Y(-p.d / 2), Y(p.d / 2), X(p.w / 2) + 40, `${f1(p.d)} m`);
  const es = Math.min(380 / (p.w + 8), 300 / (H + 6)), ex = 860, ey = 520, EX = (x) => ex + x * es, EY = (y) => ey - y * es;
  g += T(600, 100, 15, 'MẶT ĐỨNG', "font-weight='bold'") + `<line x1='${EX(-p.w / 2 - 3)}' y1='${EY(0)}' x2='${EX(p.w / 2 + 3)}' y2='${EY(0)}' stroke='${INK}' stroke-width='2'/>`;
  g += `<rect x='${f(EX(-p.w / 2 - 0.6))}' y='${f(EY(0.5))}' width='${f((p.w + 1.2) * es)}' height='${f(0.5 * es)}' fill='#cdbf9f' stroke='${INK}'/>`;
  for (const x of [-p.w / 2 + 0.3, p.w / 2 - 0.3, ...(p.octa ? [-p.w * 0.2, p.w * 0.2] : [])]) g += `<rect x='${f(EX(x) - 0.15 * es)}' y='${f(EY(0.5 + H))}' width='${f(0.3 * es)}' height='${f(H * es)}' fill='#8b2a1d'/>`;
  const rk = roofKind(P.S), rc = P.st.roofCol || '#7a6a52', y0 = 0.5 + H, RH = Math.max(1.6, p.w * 0.35);
  g += rk === 'deco' || rk === 'flat' ? `<rect x='${f(EX(-p.w / 2 - 1))}' y='${f(EY(y0 + 0.4))}' width='${f((p.w + 2) * es)}' height='${f(0.4 * es)}' fill='${rc}' stroke='${INK}'/>` : poly([[EX(-p.w / 2 - 1.4), EY(y0)], [EX(0), EY(y0 + RH)], [EX(p.w / 2 + 1.4), EY(y0)]], `fill='${rc}' stroke='${INK}'`);
  g += dimV(EY(0), EY(0.5), EX(p.w / 2) + 26, 'bệ 0,5') + dimV(EY(0.5), EY(y0), EX(p.w / 2) + 26, `cột ${f1(H)} m`);
  g += titleBlock(30, 620, 1100, [['Loại', `${p.octa ? 'đình bát giác' : 'đình vuông / chữ nhật'} · ${ROOF_TXT[rk] || rk}`], ['Kích thước', `${f1(p.w)} × ${f1(p.d)} m · bệ 0,5 m · cột ${f1(H)} m`], ['Dựng bằng', 'archkit-style.styledPavilion(S, pv) — số liệu tờ này']], 'KHUNG TÊN — ĐÌNH');
  return svgDoc(1160, 760, g);
}

// ------------------------------------------------------------------- CỔNG & CẦU
function gatesBridgesSheet(P, n) {
  let g = T(30, 40, 20, `CỔNG & CẦU — ${P.st.name}`, "font-weight='bold'") + T(30, 62, 13, `Bản vẽ ${String(n).padStart(2, '0')}-C · cổng chính kiểu «${P.st.gate}» rộng ${P.gate.w} m giữa mặt Nam (nối cầu ngọc)`);
  let y = 100;
  for (const gt of P.gates) { g += T(30, y, 12, `• ${gt.main ? 'Cổng chính' : `Cổng ${gt.id === 'east' ? 'Đông' : gt.id === 'west' ? 'Tây' : 'Bắc'}`} — khe ${gt.w} m tại (${f1(gt.x)}, ${f1(gt.z)}) · tường cao ${P.st.wallH} m`); y += 18; }
  y += 10;
  P.bridges.forEach((b, k) => {
    const s = Math.min(420 / (b.len + 6), 60), x0 = 60, yy = y + 60;
    g += T(30, y + 12, 13, `Cầu ${k + 1} — dài ${f1(b.len)} m, rộng ${f1(b.w)} m, vồng ${f1(b.rise)} m${b.flat ? ' (cầu phẳng)' : ''} · tâm (${f1(b.x)}, ${f1(b.z)})`, "font-weight='bold'");
    g += `<rect x='${x0}' y='${yy - 8}' width='${f(b.len * s)}' height='${f(b.w * s * 0.4 + 8)}' fill='#d9b98c' stroke='${INK}'/>`;
    const pts = Array.from({ length: 21 }, (_, q) => { const t = q / 20; return [x0 + 520 + t * b.len * s, yy + 40 - (b.flat ? b.rise : b.rise * Math.sin(Math.PI * t)) * s]; });
    g += `<polyline points='${pts.map(([a, c]) => `${f(a)},${f(c)}`).join(' ')}' fill='none' stroke='${INK}' stroke-width='3'/><line x1='${x0 + 500}' y1='${yy + 40}' x2='${f(x0 + 540 + b.len * s)}' y2='${yy + 40}' stroke='#4b7f9f' stroke-width='2'/>`;
    g += T(x0, yy + 50, 11, 'mặt bằng') + T(x0 + 520, yy + 60, 11, 'mặt đứng (đường mặt cầu, nước xanh)');
    y += 120;
  });
  return svgDoc(1160, Math.max(400, y + 40), g);
}

// ------------------------------------------------------------------- CHẠY
// không xoá thư mục: tờ từng công trình (ct-*.png) do scripts/banve.mjs chiếu từ mô hình; ở đây chỉ vẽ tổng mặt bằng + cổng cầu
const index = [];
for (let i = 0; i < 9; i++) {
  const P = tienPlan(i), n = i + 1, dir = `${OUT}/${String(n).padStart(2, '0')}-${P.st.id}`, files = [];
  mkdirSync(dir, { recursive: true });
  const put = (name, svg, label) => { writeFileSync(`${dir}/${name}`, svg); files.push([name, label]); };
  put('00-tong-mat-bang.svg', masterPlan(P, n), 'Tổng mặt bằng');
  put('C-cong-cau.svg', gatesBridgesSheet(P, n), 'Cổng & cầu');
  if (false) writeFileSync(`${dir}/index.html`, `<!doctype html><meta charset='utf-8'><title>${esc(P.st.name)}</title><body style='background:#ddd;font-family:sans-serif'><h1>${n}. ${esc(P.st.name)} — ${esc(P.site.proto)}</h1><p>${esc(P.site.concept)}</p>${files.map(([fn, l]) => `<h3>${esc(l)}</h3><img src='${fn}' style='max-width:100%;background:#fff'>`).join('')}</body>`);
  index.push([`${String(n).padStart(2, '0')}-${P.st.id}`, P.st.name, P.site.proto, files.length]);
}
writeFileSync(`${OUT}/index.html`, `<!doctype html><meta charset='utf-8'><title>Bản vẽ 9 tiên phủ</title><body style='font-family:sans-serif;background:#eee'><h1>Bản vẽ kiến trúc 9 tiên phủ</h1><p>Sinh từ số liệu dựng (src/game/tienphu/siteplans.js) — node scripts/draw-tienphu.mjs</p>${index.map(([d, nm, pr, c]) => `<h2><a href='${d}/index.html'>${esc(nm)}</a> — ${c} tờ</h2><p>${esc(pr)}</p><a href='${d}/index.html'><img src='${d}/00-tong-mat-bang.svg' width='900'></a>`).join('')}</body>`);
console.log(index.map(([d, nm, , c]) => `${d}: ${c} tờ`).join('\n'));
