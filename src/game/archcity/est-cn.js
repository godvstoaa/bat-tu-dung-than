// ============================================================================
//  HỌ TRUNG HOA / GIANG NAM / HANOK cho biệt phủ (docs/BIET-PHU-MANIFEST.md §3.1) — bộ dựng tiên phủ cn.js (CHỈ import)
//  + vật liệu lặp theo mét (archcity/mats.js). Dựng ĐÚNG KHUÔN LÔ (estatekit.js):
//   · lưới cột = w × d (vách trên chu vi), gian giữa ≥ 4,6 m có cửa bức bàn mở 2 cánh giữa (≥ 2,3 m thông thủy)
//   · nền (w + 2,4) × (d + 2,4) cao b.plinth, bậc giữa trước (và sau nếu back), lan can đá khi nền ≥ 1 m
//   · nhà 2 tầng (b.floors > 1): cnLou (tầng dưới h1, tầng trên h2, hành lang lan can) — mái hiên cao ≈ b.h
//  Phong cách: cungdinh — cột son, ngói lưu ly xanh, đấu củng, 5 linh vật; giangnam — vách vôi trắng, cột gỗ sẫm,
//  ngói xám mỏng, đầu đao vểnh mạnh (Tô Châu); hanok — vách vôi trắng khung gỗ nâu sáng, ngói xám, mái yết sơn cong
//  hiền, không đấu củng, nền đá thô.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, box, slabXY } from '../tienphu/arch/kit.js';
import { cnHall, cnLou, cnMats, cnPavilion, cnRoof, platform, balustrade, geshanBay, column } from '../tienphu/arch/cn.js';
import { archMats, retex, consolidate, tiled } from './mats.js';
import { pagoda } from './temple.js';

const ST = {
  cungdinh: { tile: 'Green', dk: 0.075, beasts: 5, lift: 0.55, fly: 0.2, over: {}, base: 'marble' },
  // nhà dân / sĩ phu: không thải họa cung đình (xà, đấu, cửa) — gỗ mộc, cửa song gỗ sẫm giấy trắng
  giangnam: { tile: 'Gray', dk: 0, beasts: 0, lift: 1.0, fly: 0.3, over: () => ({ col: wood(), beam: wood(), beam2: wood(), gold: wood(), door: doorTint('#8a7466'), dougongB: wood(), dougong: wood(), plaster: archMats().plasterWhite, brick: archMats().plasterWhite }), base: 'stone' },
  hanok: { tile: 'Gray', dk: 0, beasts: 0, lift: 0.6, fly: 0.24, over: () => ({ col: woodL(), beam: woodL(), beam2: woodL(), gold: woodL(), door: doorTint('#b59c80'), dougongB: woodL(), dougong: woodL(), plaster: archMats().plasterWhite, brick: archMats().plasterWhite }), base: 'stone' },
};
let WD = null, WL = null;
const wood = () => (WD ||= tiled('plank', '#4a3324', { rough: 0.9 }));      // cột gỗ sẫm Giang Nam
const woodL = () => (WL ||= tiled('plank', '#9a7650', { rough: 0.95 }));    // gỗ thông mộc Hanok
const DT = new Map();
/** cửa song (texture canvas của cnMats: khung son + giấy) nhuộm màu gỗ — retex không đụng khoá 'door' nên thay vật liệu trực tiếp */
const doorTint = (c) => { if (!DT.has(c)) { const m = cnMats().door.clone(); m.color.set(c); DT.set(c, m); } return DT.get(c); };
const overOf = (id) => (typeof ST[id].over === 'function' ? ST[id].over() : ST[id].over);

/** chia bề rộng W thành n gian lẻ: gian giữa c (≥ 4,6 cho cửa 2,4 m), các gian còn lại thu dần 6 % mỗi bậc ra hồi */
export function fitBays(W, { target = 4.4, cMin = 4.6, cMax = 6.2 } = {}) {
  let n = Math.max(3, Math.round(W / target)); if (n % 2 === 0) n += W / n > target ? 1 : -1; n = Math.max(3, n);
  const c = Math.min(cMax, Math.max(cMin, (W / n) * 1.12)), ci = (n - 1) / 2;
  const wts = Array.from({ length: n }, (_, i) => (i === ci ? 0 : 1 - 0.06 * Math.abs(i - ci))), sw = wts.reduce((a, b) => a + b, 0);
  return wts.map((w, i) => (i === ci ? c : ((W - c) * w) / sw));
}
/** chép hình của src sang dst, bỏ hình mà drop(key, hộp bao) trả true (đục khe cửa sau trong vách gạch của cnLou) */
function mergeInto(dst, src, drop = () => false) {
  for (const [key, list] of src.parts) for (const geo of list) { geo.computeBoundingBox(); if (!drop(key, geo.boundingBox)) dst.add(key, geo); }
  dst.plats.push(...src.plats);
}
const finish = (styleId) => (g) => { retex(g, overOf(styleId)); return consolidate(g); };
const matsOf = () => ({ ...cnMats(), ...archMats() });

/** nền (w + 2,4) × (d + 2,4) + bậc giữa + lan can đá (nền ≥ 1 m) — khớp mansionSolids plats (archkit.plinth cũ) */
function basePlinth(acc, b, styleId) {
  const PW = b.w + 2.4, PD = b.d + 2.4, h = b.plinth, sw = Math.min(6, b.w * 0.3);
  const stairs = [{ side: 1, cx: 0, w: sw }]; if (b.back) stairs.push({ side: -1, cx: 0, w: sw });
  platform(acc, { W: PW, D: PD, h, stairs });
  if (h >= 1 && styleId === 'cungdinh') { // bạch ngọc lan can quanh mép nền, chừa lối bậc
    const e = 0.25, x0 = -PW / 2 + e, x1 = PW / 2 - e, z0 = -PD / 2 + e, z1 = PD / 2 - e, g = sw / 2 + 0.3;
    balustrade(acc, [[-g, z1], [x0, z1], [x0, z0], ...(b.back ? [[-g, z0]] : [[x1, z0]]), ...(b.back ? [] : [[x1, z1], [g, z1]])], h, { h: 1.0, step: 1.9 });
    if (b.back) { balustrade(acc, [[g, z1], [x1, z1], [x1, z0], [g, z0]], h, { h: 1.0, step: 1.9 }); }
  }
}

function hall(styleId, S, b, opt = {}) {
  const st = ST[styleId], villa = !!opt.villa, acc = new Acc(), V = villa ? (opt.variant | 0) % 3 : 0;
  basePlinth(acc, b, styleId);
  // biến thể biệt thự: 0 — lầu 3 gian yết sơn · 1 — nhà 1 tầng cao, mái ngạnh sơn (硬山, tường hồi gạch lên tận mái) ·
  // 2 — lầu 5 gian hẹp, mái vũ điện (庑殿) thấp hiền
  const bays = fitBays(b.w, villa ? (V === 2 ? { target: 2.5, cMin: 3.0, cMax: 3.2 } : { target: 3.8, cMin: 4.0, cMax: 4.6 }) : {}), D = b.d, ci = (bays.length - 1) / 2;
  const roof = { type: V === 1 ? 'gable' : V === 2 ? 'hip' : 'xieshan', tile: st.tile, beasts: villa ? 0 : st.beasts, ridgeH: villa ? 0.55 : b.id === 'main' ? 1.0 : 0.75, lift: V === 2 ? st.lift * 0.6 : st.lift, fly: st.fly };
  const dk = villa || b.id !== 'main' ? 0 : st.dk; // đấu củng chỉ ở chính đường (nhà ở phụ không có — đúng lệ, và nhẹ)
  const common = { bays, D, plinth: b.plinth, noPlatform: true, dagong: dk, colD: Math.min(0.62, 0.075 * Math.max(...bays)), frontDoors: 'center1', roof };
  const two = (b.floors || 1) > 1 && V !== 1;
  let r;
  if (two) {
    // b.h = cao hiên trên nền: tầng dưới ~45 %, tầng trên ~35 % (phần còn lại: sàn + đấu củng + xà)
    const h1 = Math.max(3.4, b.h * 0.44), h2 = Math.max(2.9, b.h * 0.34);
    const ciw = bays[ci], yRoof = b.plinth + h1 + h2 + 0.25;
    const drop = (key, bb) => (b.back && key === 'brick' && bb.max.z < -D / 2 + 1.2 && bb.min.x > -ciw / 2 - 0.05 && bb.max.x < ciw / 2 + 0.05 && bb.min.y < b.plinth + h1 * 0.6)
      || (V === 2 && key === 'wood' && bb.max.y > yRoof); // mái vũ điện thấp: trụ / xà gồ khung mái (dựng cho yết sơn) đâm thủng mái → bỏ (khuất trong mái)
    r = cnLou({ ...common, h1, h2, colH: h2 }); mergeInto(acc, r.acc, drop);
    if (b.back) geshanBay(acc, -ciw / 2 + 0.15, ciw / 2 - 0.15, -D / 2, b.plinth, h1 - 0.9, 4, true);  // cửa hậu mở (khe va chạm mặt sau)
  } else {
    r = cnHall({ ...common, acc, colH: villa ? 4.3 : Math.max(3.6, b.h * 0.62), backDoors: false });
  }
  return { acc, mats: matsOf(), post: finish(styleId), info: { ...r.info, kind: 'est-cn' } };
}

/** tháp Thanh Long: cungdinh / giangnam — bảo tháp lâu các bát giác (9 / 7 tầng); hanok — chung các 2 tầng (gác chuông) */
function tower(styleId, S, t) {
  if (styleId === 'hanok') {
    const acc = new Acc(), b = { w: 9.6, d: 8.0, plinth: 1.2, back: true };
    basePlinth(acc, { ...b, w: 7.6, d: 6.0 }, styleId);
    const r = cnLou({ bays: [2.6, 3.6, 2.6], D: 6.0, plinth: 1.2, noPlatform: true, open: true, h1: 4.4, h2: 3.6, colH: 3.6, colD: 0.38, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.6, lift: 0.6, fly: 0.24 } }); mergeInto(acc, r.acc);
    // đại hồng chung treo tầng trên
    const bell = new THREE.LatheGeometry([[0.001, 0], [0.75, 0], [0.8, 0.15], [0.62, 0.6], [0.58, 1.3], [0.4, 1.55], [0.001, 1.6]].map(([x, y]) => new THREE.Vector2(x, y)), 18); bell.translate(0, r.info.y1 + 0.9, 0); acc.add('gold', bell);
    return { acc, mats: matsOf(), post: finish(styleId), info: { kind: 'bell' } };
  }
  const tiers = styleId === 'cungdinh' ? 7 : 5, a0 = Math.min(3.6, t.w * 0.36), h = (t.h - 1.4 - 4.6 - 4.5) / (tiers - 1);
  const g = pagoda({ n: 8, a0, tiers, h0: 4.6, h: Math.max(2.9, h), shrink: styleId === 'cungdinh' ? 0.075 : 0.085, tile: styleId === 'cungdinh' ? 'Green' : 'Gray', wall: styleId === 'cungdinh' ? 'plasterRed' : 'plasterWhite', dk: 0.1 }); // dk > 0 bắt buộc (pagoda chia bước theo dk); bậc vừa bỏ đấu củng
  return { group: g, info: { kind: 'pagoda', tiers } };
}

/** đình bên mặt nước: bát giác (octa) / vuông một vành mái, ghế lan can, bảo đỉnh */
function pav(styleId, S, pv) {
  const st = ST[styleId], n = pv.octa ? 8 : 4, a = Math.min(pv.w, pv.d) / 2 - 0.8;
  const r = cnPavilion({ n, a, colH: Math.max(3.2, pv.h), colD: 0.32, plinth: 0.5, tiers: styleId === 'cungdinh' ? 2 : 1, over: 1.3, tile: st.tile, dagong: 0, lift: st.lift });
  return { acc: r.acc, mats: matsOf(), post: finish(styleId), info: r.info };
}

/** cổng: phủ — môn lâu 3 gian (cửa giữa mở, 2 gian bên tường gạch + cửa sổ), mặt trước sát tường rào; biệt thự — cổng
 *  trụ gạch có mái ngói nhỏ (thùy hoa môn giản lược). Gốc = tâm khe cổng trên đường tường rào; nhà cổng lùi vào trong (−z). */
function gate(styleId, S, g) {
  const st = ST[styleId], acc = new Acc();
  if (g.villa) { // môn tráo (門罩): hai trụ vôi + mi đá + mũ ngói nhỏ hai mái vươn 0,5 m — kiểu cổng nhà Giang Nam / Hanok
    const w = g.w, ph = 2.9;
    for (const sx of [-1, 1]) { acc.add('brick', boxB(0.7, ph + 0.5, 0.8, sx * (w / 2 + 0.35), 0, 0)); acc.add('stone', boxB(0.8, 0.45, 0.9, sx * (w / 2 + 0.35), 0, 0)); }
    acc.add('stone', boxB(w + 1.4, 0.32, 0.8, 0, ph, 0));                       // mi cửa đá
    acc.add('col', boxB(w + 0.2, 0.18, 0.5, 0, ph - 0.18, 0));                  // xà cửa
    for (const sx of [-1, 1]) acc.add('marble', boxB(0.12, ph - 0.2, 0.86, sx * (w / 2 - 0.02), 0, 0)); // bó khung đá
    cnRoof(acc, { W: w + 1.4, D: 0.8, yCol: ph + 0.75, over: 0.5, roof: { type: 'gable', tile: st.tile, ridgeH: 0.28, lift: 0, fly: 0.1 }, wallT: 0.1 });
    return { acc, mats: matsOf(), post: finish(styleId), info: { kind: 'gate-v' } };
  }
  const bays = [Math.max(3.2, (g.w + 9 - 4.6) / 2), 4.6, Math.max(3.2, (g.w + 9 - 4.6) / 2)], D = 6.2;
  const r = cnHall({ acc, bays, D, plinth: 0.9, noPlatform: true, colH: 4.6, colD: 0.42, dagong: 0, frontDoors: 'center1', backDoors: false, roof: { type: 'xieshan', tile: st.tile, ridgeH: 0.7, beasts: styleId === 'cungdinh' ? 3 : 0, lift: st.lift, fly: st.fly } });
  // cổng là lối đi: đục vách sau gian giữa bằng cách dựng lại phần sau mở — cnHall đã đặt gạch; thay bằng nền + bậc hai phía
  const W = bays.reduce((a, b) => a + b, 0);
  platform(acc, { W: W + 1.6, D: D + 1.6, h: 0.9, stairs: [{ side: 1, cx: 0, w: 4.0 }, { side: -1, cx: 0, w: 4.0 }] });
  for (const k of acc.parts.keys()) for (const geo of acc.parts.get(k)) geo.translate(0, 0, -D / 2 - 0.8);
  // khe xuyên gian giữa (bỏ gạch / cửa ở vách sau giữa — đã dựng trong cnHall): lọc lại
  const ci = bays[1] / 2;
  for (const key of ['brick', 'door']) { const L = acc.parts.get(key); if (!L) continue; acc.parts.set(key, L.filter((geo) => { geo.computeBoundingBox(); const bb = geo.boundingBox; return !(bb.max.z < -D - 0.3 && bb.min.x > -ci - 0.05 && bb.max.x < ci + 0.05 && bb.min.y < 0.9 + 3.6); })); }
  // cửa giữa mở hẳn (bỏ hai cánh còn lại của bức bàn giữa mặt trước)
  { const L = acc.parts.get('door'); acc.parts.set('door', L.filter((geo) => { geo.computeBoundingBox(); const bb = geo.boundingBox; return !(Math.abs((bb.min.z + bb.max.z) / 2 + 0.8) < 0.3 && bb.min.x > -ci && bb.max.x < ci && bb.max.y < 0.9 + 3.8); })); }
  return { acc, mats: matsOf(), post: finish(styleId), info: { ...r.info, kind: 'gate' } };
}

export const FAMILY = { hall, tower, pav, gate };
