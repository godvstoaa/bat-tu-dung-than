// ============================================================================
//  THỦY MÔN TƯỜNG NGOẠI THÀNH (docs/THUY-MON-MANIFEST.md) — chỗ sông Huyền Hà (2 nơi, rộng 63 m) và Nam Khê (23 m)
//  xuyên tường 34 m. Trước: thân tường đặc treo từ y = 1 ngang qua mặt sông (không vòm, không trụ). Nay theo nguyên mẫu:
//   · Đông Thủy Quan Nam Kinh (Minh, Hồng Vũ): 3 tầng vòm — tầng dưới cho nước qua (lưới sắt giữa), 2 tầng trên là
//     động tàng binh (藏兵洞) → ở đây: hàng vòm nước + hàng vòm tàng binh lõm + hàng lỗ châu mai;
//   · Bàn Môn Tô Châu: vòm nước 9,3 × 9,7 m, sâu 6 m, có RÃNH CỬA ÁP QUAN (闸槽) → lưới sắt kéo lên nằm trong rãnh;
//   · Đông Thành Thủy Quan Huế: cống vòm đá Ø 8,4 m, cửa áp quan nâng hạ, viền vòm nhiều lớp.
//  Hình (khung cục bộ của tường — X = pháp tuyến ra ngoài, Y lên (0 = chân tường), Z = dọc tường, tâm sông tại Z = zOff):
//   · thân gạch đứng X ∈ [IN0, OUT1], Z ∈ [−span/2, span/2], Y ∈ [WATER − 4, TOP]; hai lớp vỏ 1 m có vòm tàng binh lõm;
//   · vòm nước n nhịp (nhịp s 6,3–7,3 m, trụ 2,0 m), đỉnh vòm = mặt nước + 8,4 (tĩnh không thuyền 7 m của bridges);
//   · trụ có MŨI RẼ NƯỚC (đá) hai phía tới mặt nước + 3,2; viền vòm đá trắng 0,65 m + đá khoá; gờ đá ngang trên vòm;
//   · lưới áp quan sắt kéo lên (đáy cách đỉnh vòm 1,9 m), rãnh dọc hai bên chân vòm;
//   · lầu thủy quan trên đỉnh (cn.js, ngói xám, 5 / 3 gian).
//  Nhịp / trụ dùng chung với va chạm thuyền (bridges.waterGatePiers) qua waterGateBays().
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Acc } from '../tienphu/arch/kit.js';
import { cnHall, cnMats } from '../tienphu/arch/cn.js';
import { archMats, boxUV, SPAN, retex, consolidate, tiled } from './mats.js';
import { waterGateBays } from '../bridges.js';

/** đường viền vòm (cuốn bán nguyệt) trong mặt phẳng (z, y): chân y0, đỉnh yc, rộng s, tâm z — ngược chiều kim đồng hồ */
function archPath(z, s, y0, yc, seg = 18, r0 = s / 2) {
  const ys = yc - r0, pts = [new THREE.Vector2(z + r0, y0)];
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI; pts.push(new THREE.Vector2(z + Math.cos(a) * r0, ys + Math.sin(a) * r0)); }
  pts.push(new THREE.Vector2(z - r0, y0));
  return pts;
}
/** khối đùn theo X (bề dày tường) từ x0 tới x1 của hình (z, y) có lỗ */
function slabX(outer, holes, x0, x1) {
  const sh = new THREE.Shape(outer); for (const h of holes) sh.holes.push(new THREE.Path(h)); // chiều lỗ: ExtrudeGeometry tự đảo
  const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false, curveSegments: 1 });
  g.rotateY(-Math.PI / 2); g.translate(x1, 0, 0); // (z, y, d) → mặt hình nằm trong (Z, Y), bề dày theo X ∈ [x0, x1]
  return g;
}
/** viền ngoài (z, y) có KHUYẾT vòm mở xuống đáy (lỗ chạm mép làm hỏng tam giác hoá → khoét thẳng vào viền) */
function notched(z0, z1, y0, y1, arches) {
  const pts = [new THREE.Vector2(z0, y0)];
  for (const a of [...arches].sort((u, v) => u.z - v.z)) pts.push(...archPath(a.z, a.s, y0, a.yc).reverse()); // trái → qua đỉnh → phải
  pts.push(new THREE.Vector2(z1, y0), new THREE.Vector2(z1, y1), new THREE.Vector2(z0, y1));
  return pts;
}
/** vành vòm (đá viền) chân y0: vòm ngoài rộng so, trong rộng si — một đa giác khép (không lỗ) */
function ringPts(z, si, so, y0, yci, yco) {
  const out = archPath(z, so, y0, yco), inn = archPath(z, si, y0, yci).reverse();
  return [...out, ...inn];
}
const rectPts = (z0, z1, y0, y1) => [new THREE.Vector2(z0, y0), new THREE.Vector2(z1, y0), new THREE.Vector2(z1, y1), new THREE.Vector2(z0, y1)];

/**
 * span: bề dài thân thủy môn dọc tường (m) · zOff: tâm sông lệch so với tâm thân (m, theo Z) · wAlong: bề rộng mặt nước dọc tường
 * TOP: mặt đi đỉnh tường (y) · IN0 / OUT1: mặt trong / ngoài thân (X) · water: cao độ mặt nước (y, khung tường)
 * → THREE.Group (khung cục bộ tường, gốc ở tâm thân, y = 0 là chân tường)
 */
export function waterGateBody({ span, zOff = 0, wAlong, TOP, IN0 = -4.2, OUT1 = 3.5, water = -6 }) {
  const { n, s, p, centers, crown } = waterGateBays(wAlong);
  const yb = water - 4, yc = water + crown, hz = span / 2, skin = 1.0;
  const arches = centers.map((c) => ({ z: c + zOff, s, yc }));
  // TẦNG 2 + 3 (Đông Thủy Quan Nam Kinh: 3 tầng × 11 vòm, 2 tầng trên là động tàng binh): mỗi nhịp một vòm lõm sâu 2,6 m
  // thẳng trên vòm nước (tầng 2 rộng 0,75 s cao 6,5; tầng 3 rộng 0,55 s cao 5,5) + lỗ châu mai dưới mặt đi mỗi ~4 m
  const gal = [], loop = [], recess = 2.6;
  const y2 = yc + 2.8, y3 = y2 + 9.4;
  for (const c of centers) { gal.push(archPath(c + zOff, Math.min(6, s * 0.75), y2, y2 + 6.5)); gal.push(archPath(c + zOff, Math.min(4.6, s * 0.55), y3, y3 + 5.5)); }
  const yl = TOP - 4.6, nl = Math.max(3, Math.round((span - 6) / 4.2));
  for (let i = 0; i < nl; i++) { const z = -hz + 3 + (i + 0.5) * (span - 6) / nl; loop.push(archPath(z, 0.8, yl, yl + 1.8, 8)); }
  const outer = notched(-hz, hz, yb, TOP, arches);
  const B = { brick: [], stone: [], marble: [], iron: [], dark: [] };
  B.brick.push(slabX(outer, [], IN0 + recess, OUT1 - recess));                    // lõi
  for (const [x0, x1, xb] of [[OUT1 - recess, OUT1, OUT1 - recess], [IN0, IN0 + recess, IN0 + recess]]) {
    B.brick.push(slabX(outer, [...gal, ...loop], x0, x1));                        // hai lớp vỏ: vòm lõm 2,6 m
    for (const g of gal) B.dark.push(slabX(g, [], xb - 0.04, xb + 0.04));         // vách hậu động (gạch sẫm) — đọc được chiều sâu
  }
  // viền vòm đá trắng (0,65 m, nhô 0,3) + đá khoá; hai mặt
  for (const c of centers) {
    const z = c + zOff, ring = ringPts(z, s, s + 1.3, water + 1.2, yc, yc + 0.65);
    for (const [x0, x1] of [[OUT1, OUT1 + 0.3], [IN0 - 0.3, IN0]]) {
      B.marble.push(slabX(ring, [], x0, x1));
      B.marble.push(new THREE.BoxGeometry(x1 - x0 + 0.25, 1.1, 0.9).translate((x0 + x1) / 2, yc + 0.45, z)); // đá khoá
    }
    // lưới áp quan kéo lên: thanh đứng Ø 0,12 cách 0,32 + 3 thanh ngang, nằm trong rãnh giữa bề dày tường
    const xm = (IN0 + OUT1) / 2, yG = yc - 1.9, bars = [];
    for (let zz = -s / 2 + 0.25; zz <= s / 2 - 0.25; zz += 0.32) { const h = Math.min(TOP, yc + 1) - yG; bars.push(new THREE.BoxGeometry(0.12, h, 0.12).translate(xm, yG + h / 2, z + zz)); bars.push(new THREE.ConeGeometry(0.1, 0.35, 4).rotateX(Math.PI).translate(xm, yG - 0.17, z + zz)); }
    for (const yy of [yG + 0.3, yG + 1.2]) bars.push(new THREE.BoxGeometry(0.16, 0.16, s - 0.2).translate(xm, yy, z));
    for (const sz of [-1, 1]) bars.push(new THREE.BoxGeometry(0.5, yc - yb, 0.32).translate(xm, (yb + yc) / 2, z + sz * (s / 2 + 0.05))); // rãnh cửa (khe tối)
    B.iron.push(mergeGeometries(bars.map((q) => q.toNonIndexed()), false));
  }
  // trụ: mũi rẽ nước hai phía (lăng trụ ngũ giác, đá) + bệ đá dưới nước
  const nose = (dir) => { const w = p / 2, L = 3.0; const sh = new THREE.Shape([new THREE.Vector2(-w, 0), new THREE.Vector2(w, 0), new THREE.Vector2(w, L * 0.45), new THREE.Vector2(0, L), new THREE.Vector2(-w, L * 0.45)]); const g = new THREE.ExtrudeGeometry(sh, { depth: water + 3.2 - yb, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.rotateY(dir > 0 ? -Math.PI / 2 : Math.PI / 2); g.translate(0, yb, 0); return g; };
  const pierZ = [centers[0] - s / 2 - p / 2, ...centers.slice(0, -1).map((c, i) => (c + centers[i + 1]) / 2), centers[n - 1] + s / 2 + p / 2];
  for (const z of pierZ) {
    B.stone.push(nose(1).translate(OUT1, 0, z + zOff), nose(-1).translate(IN0, 0, z + zOff));
    // nắp mũi (dốc) — đá
    for (const [x, d] of [[OUT1 + 1.4, 1], [IN0 - 1.4, -1]]) B.stone.push(new THREE.CylinderGeometry(0.01, p * 0.62, 1.1, 4, 1).rotateY(Math.PI / 4).scale(1.9, 1, 1).translate(x + d * 0.1, water + 3.2 + 0.55, z + zOff));
  }
  // dải đá chân (mực nước ± ) và gờ đá ngang trên vòm, chạy suốt hai mặt (trừ lòng vòm: dải nằm dưới chân vòm / trên đỉnh vòm)
  for (const [x0, x1] of [[OUT1, OUT1 + 0.25], [IN0 - 0.25, IN0]]) {
    for (let i = 0; i <= n; i++) { const za = i === 0 ? -hz : arches[i - 1].z + s / 2, zb = i === n ? hz : arches[i].z - s / 2; if (zb - za > 0.05) B.stone.push(new THREE.BoxGeometry(x1 - x0, water + 1.2 - yb, zb - za).translate((x0 + x1) / 2, (yb + water + 1.2) / 2, (za + zb) / 2)); } // dải đá chân (mặt trụ)
    B.stone.push(new THREE.BoxGeometry(x1 - x0 + 0.2, 0.55, span).translate((x0 + x1) / 2, yc + 1.5, 0));
    B.stone.push(new THREE.BoxGeometry(x1 - x0 + 0.3, 0.45, span).translate((x0 + x1) / 2, TOP - 0.7, 0));
  }
  const AM = archMats(), MAT = { brick: AM.brick, stone: AM.stone, marble: AM.marble, iron: IRON(), dark: DARK() };
  const grp = new THREE.Group(); grp.name = 'watergate';
  for (const [k, list] of Object.entries(B)) {
    if (!list.length) continue;
    let geo = mergeGeometries(list.map((q) => (q.index ? q.toNonIndexed() : q)), false); list.forEach((q) => q.dispose());
    if (MAT[k].userData.tiled) geo = boxUV(geo, { span: SPAN[MAT[k].userData.tiled] }); else geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, MAT[k]); m.castShadow = m.receiveShadow = true; m.name = `wg-${k}`; grp.add(m);
  }
  // lầu thủy quan trên đỉnh (giữa sông), ngồi trên mặt đi giữa hai tường chắn
  grp.add(lou(n >= 5 ? [3.2, 3.6, 4.2, 3.6, 3.2] : [3.0, 3.8, 3.0], zOff, TOP, IN0, OUT1));
  return grp;
}
let IR = null, DK = null;
const DARK = () => (DK ||= tiled('brick', '#3f4447', { rough: 1, bump: 1.2 }));
const IRON = () => (IR ||= new THREE.MeshStandardMaterial({ color: '#23262a', roughness: 0.55, metalness: 0.65 }));
const LOU = new Map();
function lou(bays, zOff, TOP, IN0, OUT1) {
  const k = bays.length; if (!LOU.has(k)) {
    const acc = new Acc();
    cnHall({ acc, bays, D: 4.6, plinth: 0.45, colH: 3.8, colD: 0.34, dagong: 0.055, frontDoors: 'center1', backDoors: false, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.7, beasts: 3, lift: 0.55 } });
    const g = acc.build({ ...cnMats(), ...archMats() }, 'wg-lou'); retex(g); LOU.set(k, consolidate(g));
  }
  const o = LOU.get(k).clone(); o.rotation.y = Math.PI / 2; // mặt lầu nhìn ra ngoài thành (+X)
  o.position.set((IN0 + OUT1) / 2 - 0.35, TOP, zOff); return o;
}
