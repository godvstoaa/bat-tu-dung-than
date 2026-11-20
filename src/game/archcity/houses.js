// ============================================================================
//  NHÀ PHỐ THỦ TỤC (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §3.1, đợt 3) — thay 31 mẫu Meshy (texture 1024 kéo cả nhà
//  → 20–50 px/m; nhà 1 tầng có căn cao 2,9 m). Chiều cao theo NGƯỜI, không theo bề ngang lô:
//    nền 0,45 · tầng 1 cao 3,4 (cửa thông thủy ≥ 2,3) · tầng 2 2,9 · tầng 3 2,8 · mái dốc ~28° vươn 0,9.
//  Nhà chỉ co giãn ngang (bề ngang lô ÷ bề ngang chuẩn) và sâu (kẹp 0,8–1,3) — cao giữ nguyên (±4 %).
//  Mỗi mẫu Meshy cũ ↔ một biến thể (VARIANTS) → luật «không trùng nhà bên cạnh» của city4.pick vẫn đúng.
//  Hai bậc: near (đủ cấu kiện, gân ngói) · mid (bỏ gân ngói, đầu rui, cửa song gộp tấm) — cùng vật liệu lặp theo mét.
//  Trục: X ngang mặt tiền, Y lên, mặt tiền +Z, gốc giữa đáy.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, slabXY } from '../tienphu/arch/kit.js';
import { cnRoof, cnMats, column, geshanBay, benchRail } from '../tienphu/arch/cn.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { archMats, retex, consolidate } from './mats.js';


const P = 0.45, H1 = 3.4, H2 = 2.9, H3 = 2.8;

/** cửa đi 2 cánh gỗ (ván + khung sơn) trong khoảng x0..x1 của mặt z */
function doorLeaf(acc, x, z, y0, w = 1.5, h = 2.35) {
  acc.add('col', boxB(w + 0.3, 0.2, 0.22, x, y0 + h, z));                     // mi cửa
  for (const sx of [-1, 1]) acc.add('col', boxB(0.15, h, 0.22, x + sx * (w / 2 + 0.07), y0, z));
  acc.add('plank', boxB(w, h, 0.08, x, y0, z - 0.04));
  acc.add('stone', boxB(w + 0.6, 0.16, 0.5, x, y0 - 0.16, z + 0.1));           // ngưỡng đá
}
/** cửa sổ song gỗ (khung + tấm song cn 'door') */
function windowLeaf(acc, x, z, y0, w, h) {
  acc.add('col', boxB(w + 0.24, 0.14, 0.2, x, y0 + h, z)); acc.add('col', boxB(w + 0.24, 0.14, 0.2, x, y0 - 0.14, z));
  for (const sx of [-1, 1]) acc.add('col', boxB(0.12, h, 0.2, x + sx * (w / 2 + 0.06), y0, z));
  acc.add('door', boxB(w, h, 0.06, x, y0, z - 0.05));
}
/** tam giác hồi (tường) từ đỉnh tường yW lên nóc yR, dày t, tại x */
function gableEnd(acc, key, D, yW, yR, x, t = 0.4) {
  const g = slabXY([[-D / 2, 0], [D / 2, 0], [0.25, yR - yW], [-0.25, yR - yW]], t, 0, 0, 0, 0);
  g.rotateY(Math.PI / 2); g.translate(x, yW, 0); acc.add(key, g);
}

/**
 * spec: { W (rộng chuẩn), D (sâu), floors 1–3, bays (số gian, lẻ), kind: 'shop'|'res'|'stone'|'court', wall, roof: 'gable'|'xieshan'|'hip',
 *         tile, balcony (tầng 2 nhô lan can), lowLevel (true = bậc vừa) }
 */
export function buildHouse(spec, lowLevel = false) {
  const { W = 10, D = 8, floors = 1, bays = 3, kind = 'res', wall = 'plasterWhite', roof = 'gable', tile = 'Gray', balcony = false, colKey = 'col', storeyGap = 0 } = spec;
  const acc = new Acc();
  const bw = W / bays, xs = Array.from({ length: bays + 1 }, (_, i) => -W / 2 + i * bw);
  const zF = D / 2, wt = 0.36;
  // nền + bậc cửa
  acc.add('stone', boxB(W + 0.5, P, D + 0.5, 0, 0, 0));
  acc.add('stone', boxB(Math.min(W * 0.6, 4), P * 0.5, 0.5, 0, 0, zF + 0.5));
  const hs = [H1, H2, H3].slice(0, floors), yF = [P]; for (const h of hs) yF.push(yF[yF.length - 1] + h + storeyGap);
  const yWall = yF[floors];
  // tường hồi + tường sau (cả chiều cao), chân tường gạch 0,9 m
  const side = wall === 'plank' || wall === 'stone' ? wall : 'brick'; // hồi tường: gạch xanh (ngạnh sơn), nhà gỗ / đá giữ vật liệu
  for (const sx of [-1, 1]) { acc.add(side, boxB(wt, yWall - P, D, sx * (W / 2 - wt / 2), P, 0)); acc.add('stone', boxB(wt + 0.06, 0.6, D + 0.06, sx * (W / 2 - wt / 2), P, 0)); }
  acc.add(wall, boxB(W, yWall - P, wt, 0, P, -zF + wt / 2)); acc.add('brick', boxB(W + 0.06, 0.9, wt + 0.06, 0, P, -zF + wt / 2));
  // từng tầng mặt tiền
  for (let f = 0; f < floors; f++) {
    const y0 = yF[f], h = hs[f], zf = zF - (f > 0 && balcony ? 0 : 0);
    // xà ngang đầu tầng + cột mặt tiền
    acc.add(colKey, boxB(W, 0.3, 0.3, 0, y0 + h - 0.3, zf));
    if (!lowLevel) for (const x of xs) column(acc, Math.max(-W / 2 + 0.16, Math.min(W / 2 - 0.16, x)), zf, y0, h - 0.3, 0.3, colKey);
    else for (const x of xs) acc.add(colKey, boxB(0.3, h - 0.3, 0.3, Math.max(-W / 2 + 0.16, Math.min(W / 2 - 0.16, x)), y0, zf));
    for (let i = 0; i < bays; i++) {
      const x0 = xs[i] + 0.16, x1 = xs[i + 1] - 0.16, xc = (x0 + x1) / 2, w = x1 - x0, mid = i === (bays - 1) / 2;
      if (f === 0 && kind === 'shop') {
        // cửa hàng: cả gian là cửa bức bàn (tấm song), dưới quầy ván thấp 0,9
        if (lowLevel) acc.add('door', boxB(w, h - 0.3, 0.08, xc, y0, zf - 0.08));
        else geshanBay(acc, x0, x1, zf - 0.08, y0, h - 0.3, Math.max(2, Math.round(w / 0.75)), mid);
      } else if (f === 0 && mid) {
        acc.add(wall, boxB(w, h - 0.3, wt, xc, y0, zf - wt / 2 - 0.1));
        if (!lowLevel) doorLeaf(acc, xc, zf - 0.02, y0, Math.min(1.6, w * 0.45), 2.35);
        else acc.add('plank', boxB(Math.min(1.6, w * 0.45), 2.35, 0.08, xc, y0, zf));
      } else {
        acc.add(wall, boxB(w, h - 0.3, wt, xc, y0, zf - wt / 2 - 0.1));
        if (f === 0 && wall !== 'plank' && wall !== 'stone') acc.add('brick', boxB(w, 0.85, wt + 0.04, xc, y0, zf - wt / 2 - 0.1));
        const ww = Math.min(1.8, w * 0.55), wh = f === 0 ? 1.3 : 1.25, wy = y0 + (f === 0 ? 1.05 : 0.75);
        if (!lowLevel) windowLeaf(acc, xc, zf - 0.02, wy, ww, wh); else acc.add('door', boxB(ww, wh, 0.06, xc, wy, zf - 0.05));
      }
    }
    if (f > 0 && balcony) { // ban công: sàn nhô 0,8 + lan can song gỗ
      acc.add('plank', boxB(W - 0.2, 0.16, 0.85, 0, y0 - 0.16, zF + 0.42));
      if (!lowLevel) benchRail(acc, -W / 2 + 0.2, zF + 0.8, W / 2 - 0.2, zF + 0.8, y0 - 0.5);
      else acc.add(colKey, boxB(W - 0.2, 0.9, 0.08, 0, y0, zF + 0.8));
    }
    if (f > 0 && !balcony) acc.add('tileGray', boxB(W + 0.2, 0.12, 0.7, 0, y0 - 0.15, zF + 0.3)); // mái hiên ngang lưng tầng (diêm)
  }
  // biển hiệu ngang trên cửa tiệm (gỗ sơn — chữ do lớp đồ phố)
  if (kind === 'shop') acc.add(colKey, boxB(Math.min(3.2, W * 0.4), 0.7, 0.12, 0, yF[1] - 0.95 + (floors > 1 ? 0.35 : 0), zF + 0.2));
  // mái
  const rType = roof === 'gable' ? 'gable' : roof;
  const sub = new Acc();
  const rr = cnRoof(sub, { W: W - (rType === 'gable' ? 0.8 : 0), D, yCol: yWall + 0.25, over: 0.9, roof: { type: rType, tile, ridgeH: 0.45, lift: rType === 'gable' ? 0 : 0.35, beasts: 0, fly: 0.25 }, wallT: 0.4 });
  for (const [k, list] of sub.parts) { if (lowLevel && (/^rib/.test(k) || k === 'dougongB')) continue; for (const g of list) acc.add(k, g); }
  const top = Math.max(...rr.map((r) => r.top));
  if (rType === 'gable') for (const sx of [-1, 1]) gableEnd(acc, side, D + 0.2, yWall, top - 0.15, sx * (W / 2 - 0.2), 0.42);
  const raw = acc.build({ ...cnMats(), ...archMats() }, 'house');
  retex(raw);
  const group = consolidate(raw);
  return { group, W, D, H: top + 0.45 * 2.3 * 0.6 };
}

// ---------------------------------------------------------------- 31 biến thể ↔ mẫu Meshy cũ (id giữ nguyên trong bố cục)
// floors / kind / tường / mái / ngói khác nhau → mỗi mẫu một dáng (luật không trùng 2 nhà liền kề vẫn đúng ở mức hình)
const V = (floors, kind, wall, roof = 'gable', extra = {}) => ({ floors, kind, wall, roof, ...extra });
export const VARIANTS = {
  bq_tower_house: V(3, 'shop', 'plasterWhite', 'xieshan', { bays: 3, W: 9, D: 9, balcony: true }),
  bq_house_2f: V(2, 'res', 'plasterWhite', 'gable', { W: 11, D: 9, balcony: true }),
  bq_teashop: V(2, 'shop', 'plank', 'xieshan', { W: 9, D: 9, balcony: true, colKey: 'col' }),
  bq_shop_lantern: V(2, 'shop', 'plank', 'gable', { W: 8, D: 8, bays: 3 }),
  bq_house_stone: V(1, 'res', 'stone', 'gable', { W: 10, D: 7, colKey: 'wood' }),
  lib_lib_house_a1: V(1, 'res', 'plasterWhite', 'gable', { W: 11, D: 7.5 }),
  bq_granary: V(2, 'res', 'plank', 'xieshan', { W: 9, D: 9, colKey: 'wood' }),
  lib_mtn_house: V(1, 'res', 'plank', 'xieshan', { W: 10, D: 8, colKey: 'wood' }),
  lib_courtyard: V(1, 'res', 'plasterWhite', 'gable', { W: 12, D: 8, bays: 5 }),
  lib_lib_house_a2: V(2, 'shop', 'plasterWhite', 'gable', { W: 11, D: 8, balcony: true }),
  bq_forge: V(1, 'shop', 'brick', 'gable', { W: 9, D: 8, colKey: 'wood' }),
  lib_house_c2: V(2, 'res', 'plank', 'gable', { W: 7.5, D: 7, colKey: 'wood' }),
  bq_carpentry: V(1, 'shop', 'plank', 'gable', { W: 9, D: 8, colKey: 'wood' }),
  bq_canal_house: V(2, 'res', 'plasterWhite', 'gable', { W: 9, D: 8, colKey: 'wood', tile: 'Gray' }),
  bq_house_tiled: V(1, 'res', 'brick', 'xieshan', { W: 10, D: 8 }),
  lib_lib_house_b1: V(1, 'shop', 'plasterWhite', 'gable', { W: 8, D: 7.5, bays: 3 }),
  bq_bookstore: V(2, 'shop', 'plasterWhite', 'xieshan', { W: 10, D: 9 }),
  bq_incense: V(1, 'shop', 'plasterWhite', 'xieshan', { W: 8, D: 8 }),
  bq_tavern: V(3, 'shop', 'plank', 'xieshan', { W: 10, D: 10, balcony: true }),
  bq_farmhouse: V(1, 'res', 'plasterWhite', 'xieshan', { W: 12, D: 8, bays: 5, colKey: 'wood' }),
  bq_teahouse: V(2, 'shop', 'plank', 'xieshan', { W: 10, D: 10, balcony: true }),
  bq_pottery: V(1, 'shop', 'brick', 'xieshan', { W: 10, D: 8, colKey: 'wood' }),
  lib_house_c1: V(1, 'res', 'plank', 'gable', { W: 7.5, D: 7, colKey: 'wood' }),
  lib_lib_house_b2: V(2, 'res', 'brick', 'gable', { W: 8, D: 8 }),
  bq_lantern_shop: V(2, 'shop', 'plasterWhite', 'xieshan', { W: 9, D: 9, balcony: true }),
  bq_stilt: V(1, 'res', 'plank', 'gable', { W: 9, D: 7, colKey: 'wood', storeyGap: 0 }),
  bq_moongate: V(1, 'res', 'plasterWhite', 'xieshan', { W: 12, D: 8, bays: 5 }),
  bq_yamen: V(2, 'res', 'plasterRed', 'hip', { W: 14, D: 11, bays: 5 }),
  bq_apothecary: V(1, 'shop', 'plasterWhite', 'xieshan', { W: 12, D: 9, bays: 5 }),
  bq_inn: V(3, 'res', 'plasterWhite', 'xieshan', { W: 13, D: 11, bays: 5, balcony: true }),
  bq_drum_tower: V(3, 'res', 'plasterRed', 'hip', { W: 11, D: 11, bays: 3 }),
};
const CACHE = new Map();
/** { near: { scene }, mid: { scene }, W, D, H } — dạng giống GLTF để cityblocks3d.instancedSet dùng được */
export function procHouse(id) {
  if (!VARIANTS[id]) return null;
  if (!CACHE.has(id)) {
    const n = buildHouse(VARIANTS[id], false), m = buildHouse(VARIANTS[id], true);
    CACHE.set(id, { near: { scene: n.group }, mid: { scene: m.group }, W: n.W, D: n.D, H: n.H });
  }
  return CACHE.get(id);
}
export const isProcHouse = (id) => !!VARIANTS[id] && !globalThis.__noProcHouse; // __noProcHouse: đo A/B với mẫu Meshy cũ

/** bậc xa (68–220 m): khối tường + lăng trụ mái, màu đỉnh, ~40 tam giác */
const FARC = new Map(), WALLC = { plasterWhite: '#e9e4d8', plasterRed: '#a33a2b', plank: '#8a6a48', stone: '#b9bab4', brick: '#8e9396' };
let FARMAT = null;
export function procFar(id) {
  const v = VARIANTS[id]; if (!v) return null;
  if (!FARC.has(id)) {
    const p = procHouse(id), W = p.W, D = p.D, yW = P + [H1, H2, H3].slice(0, v.floors || 1).reduce((a, b) => a + b, 0), top = p.H - 0.6;
    const box = new THREE.BoxGeometry(W, yW, D).translate(0, yW / 2, 0).toNonIndexed();
    const roof = slabXY([[-D / 2 - 0.9, 0], [D / 2 + 0.9, 0], [0, top - yW]], W + 0.6, 0, 0, 0, 0); roof.rotateY(Math.PI / 2); roof.translate(0, yW - 0.1, 0);
    const r2 = roof.index ? roof.toNonIndexed() : roof;
    const paint = (g, hex) => { const c = new THREE.Color(hex), a = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < a.length; i += 3) { a[i] = c.r; a[i + 1] = c.g; a[i + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };
    const tileC = { Gray: '#5d6468', Green: '#3f7a50', Yellow: '#c99a2e' }[v.tile || 'Gray'];
    FARMAT ||= new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 });
    const m = new THREE.Mesh(mergeGeometries([paint(box, WALLC[v.wall] || '#e0dacb'), paint(r2, tileC)].map((g) => { g.computeVertexNormals(); return g; }), false), FARMAT);
    const sc = new THREE.Group(); sc.add(m); FARC.set(id, { scene: sc });
  }
  return FARC.get(id);
}
