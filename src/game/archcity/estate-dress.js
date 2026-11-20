// ============================================================================
//  ĐỒ NGOÀI NHÀ CỦA BIỆT PHỦ / BIỆT THỰ (docs/BIET-PHU-MANIFEST.md §3.3–§3.4):
//   · tường rào theo kiểu (estate-layout STYLES.fence) bằng vật liệu lặp theo mét + đỉnh tường đúng kiểu (mũ ngói hai
//     mái cho tường Á Đông, gờ đá cho tường Tây, nẹp kim loại cho tường hiện đại, song sắt trên chân đá cho tường sắt);
//   · cây: 20 «loài phong cách» cũ (archkit-style.styledTree — nón / khối đa diện) ánh xạ sang model Meshy CC0 lib_tp_*
//     của tiên phủ (tienphu/bigtrees.plantBigTrees, 3 bậc chi tiết, gió) ở CỠ VƯỜN NHÀ (khoá e_* thêm lúc chạy).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bigTemplate, BIG, bigHeight } from '../tienphu/bigtrees.js';
import { archMats, boxUV, SPAN, tiled, triplanar } from './mats.js';

// ---------------------------------------------------------------- cây
// loài cũ → model lib_tp_* + dải cao (m) ở cỡ vườn nhà (cây tiên phủ 17–30 m quá to cho sân 20 m). Chọn bằng mắt từ
// output/cay-look/m-big.png: tán tròn dày (đoạn, xoài) cho quế / ô liu; cột thon (bạch y) cho bách Ý; dừa cho cọ.
const E = {
  e_pine: { m: 'kuromatsu', H: [5.5, 8], r: 0.3, w: 0.9 }, e_ginkgo: { m: 'bachqua', H: [9, 12], r: 0.35, w: 0.55 },
  e_peach: { m: 'sakura', H: [4, 5.5], r: 0.22, w: 1.2 }, e_plum: { m: 'sakura', H: [3.8, 5], r: 0.2, w: 1.15 },
  e_sakura: { m: 'sakura', H: [5, 6.5], r: 0.25, w: 1.25 }, e_willow: { m: 'lieutang', H: [6.5, 9], r: 0.4, w: 1.0 },
  e_osmanthus: { m: 'doan', H: [5, 6.5], r: 0.25, w: 0.65 }, e_magnolia: { m: 'hoe', H: [7, 9], r: 0.3, w: 0.9 },
  e_palm: { m: 'dua', H: [8, 11], r: 0.2, w: 0.45 }, e_cypress: { m: 'bachy', H: [7, 10], r: 0.25, w: 0.14 },
  e_olive: { m: 'xoai', H: [4.5, 6], r: 0.25, w: 0.85 }, e_jacaranda: { m: 'muamy', H: [6, 8], r: 0.3, w: 1.3 },
  e_frangi: { m: 'dai', H: [4, 5.5], r: 0.2, w: 1.0 }, e_banyan: { m: 'da', H: [9, 12], r: 0.6, w: 1.3 },
  e_bamboo: { m: 'bachy', H: [6, 8], r: 0.3, w: 0.18 }, e_maple: { m: 'keyaki', H: [6, 8], r: 0.3, w: 0.85 },
  e_wisteria: { m: 'muamy', H: [4.5, 5.5], r: 0.25, w: 1.35 }, e_birch: { m: 'duonglhasa', H: [8, 11], r: 0.2, w: 0.45 },
  e_camellia: { m: 'camchau', H: [2.6, 3.3], r: 0.6, w: 0.6, solid: true }, e_hedge: { m: 'camchau', H: [1.7, 2.2], r: 0.7, w: 0.6, solid: true },
  e_ginkgoS: { m: 'bachqua', H: [7, 9], r: 0.3, w: 0.55 },
};
for (const [k, v] of Object.entries(E)) if (!BIG[k]) BIG[k] = v;
const KIND = (k) => (E[`e_${k}`] ? `e_${k}` : 'e_osmanthus');
/**
 * list: [{ kind (loài cũ), x, z }] trong khung cục bộ của khuôn viên → { group, update(lx, lz) } (lx, lz: người chơi, khung cục bộ).
 * Trồng riêng (không qua plantBigTrees): cùng khuôn 3 cấp lib_tp_* nhưng NGƯỠNG CẤP theo cỡ cây vườn — bản gần (~50k tam giác)
 * chỉ trong 14 m, bản vừa (~12k) tới 40 m, xa hơn bản xa (~1,6k / tấm). Đo 2026-11-20 phủ Mughal: ngưỡng cổ thụ 45 m làm
 * cả vườn ở bản gần → 1,3 triệu tam giác, −11 fps.
 */
const T_NEAR = 14, T_MID = 40;
/** nạp sẵn khuôn 3 cấp các loài (dịch chuyển: nạp trong lúc lớp phủ che màn) — list: loài cũ */
export const prefetchTrees = (kinds) => Promise.all([...new Set(kinds.map(KIND))].map((k) => bigTemplate(k).catch(() => null)));
export function estateTrees(parent, list, { villa = false } = {}) {
  const group = new THREE.Group(); group.name = 'est-trees'; group.userData.shared = true; group.userData.dynamic = true; parent.add(group);
  const items = list.map((t, i) => ({ kind: KIND(t.kind), x: t.x, z: t.z, s: (villa ? 0.85 : 0.95) + ((i * 0.37) % 1) * 0.25, r: ((i * 0.618) % 1) }));
  const by = new Map(); for (const it of items) { if (!by.has(it.kind)) by.set(it.kind, []); by.get(it.kind).push(it); }
  const sets = [], M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3();
  let lx = Infinity, lz = Infinity;
  const ready = Promise.all([...by].map(async ([kind, L]) => {
    const T = await bigTemplate(kind); if (!T) return;
    const kx = Math.min(1.6, Math.max(0.75, BIG[kind].w / (T.ww || BIG[kind].w)));
    const all = new Float32Array(L.length * 16);
    L.forEach((it, i) => { const h = bigHeight(it); E.set((it.r - 0.5) * 0.12, it.r * 6.283, 0); Q.setFromEuler(E); const w = kx * (0.92 + it.r * 0.16); M4.compose(V.set(it.x, -0.05, it.z), Q, S.set(h * w, h, h * w)); M4.toArray(all, i * 16); });
    const lv = {};
    for (const l of ['near', 'mid', 'far']) { const im = new THREE.InstancedMesh(T[l].geo, T[l].mat, L.length); im.count = 0; im.visible = false; im.castShadow = l !== 'far'; im.receiveShadow = l === 'near'; im.frustumCulled = false; group.add(im); lv[l] = im; }
    sets.push({ L, all, lv }); lx = Infinity;
  }));
  function update(px, pz) {
    if (Math.hypot(px - lx, pz - lz) < 3) return; lx = px; lz = pz;
    for (const st of sets) {
      const n = { near: 0, mid: 0, far: 0 };
      st.L.forEach((it, i) => { const d = Math.hypot(it.x - px, it.z - pz), l = d < T_NEAR ? 'near' : d < T_MID ? 'mid' : 'far'; st.lv[l].instanceMatrix.array.set(st.all.subarray(i * 16, i * 16 + 16), n[l]++ * 16); });
      for (const l of ['near', 'mid', 'far']) { const im = st.lv[l]; im.count = n[l]; im.visible = n[l] > 0; im.instanceMatrix.needsUpdate = true; }
    }
  }
  return { group, update, ready };
}

// ---------------------------------------------------------------- tường rào
let FM = null;
function fenceMats() {
  if (FM) return FM;
  const A = archMats(), D = THREE.DoubleSide;
  FM = {
    redwall: A.plasterRed, whitewall: A.plasterWhite, stucco: tiled('plaster', '#efe6d4', { rough: 1 }), brick: tiled('brick', '#9a5a40', { rough: 1, bump: 1.2 }),
    redstone: tiled('stone', '#b0644a', { rough: 1 }), stone: tiled('stone', '#b9b2a2', { rough: 1 }), stonewall: tiled('stone', '#a9a59a', { rough: 1 }),
    bamboo: tiled('plank', '#a88d5a', { rough: 0.9 }), modern: tiled('plaster', '#ecebe6', { rough: 0.9 }), iron: A.stone,
    capTile: A.tileGray, capTileRed: tiled('tile', '#a8553a', { rough: 0.8, side: D }), capStone: A.marble, capMetal: tiled('stone', '#3a3d40', { rough: 0.5, metal: 0.6 }),
    base: A.stone, ironBar: new THREE.MeshStandardMaterial({ color: '#1f2326', roughness: 0.45, metalness: 0.7 }), wood: A.wood,
  };
  return FM;
}
const CAP = { redwall: 'capTile', whitewall: 'capTile', brick: 'capTileRed', stonewall: 'capTile', stucco: 'capTileRed', redstone: 'capStone', stone: 'capStone', modern: 'capMetal', bamboo: 'capTile' };
/** mũ ngói hai mái dọc tường: lăng trụ tam giác rộng t + 0,5, cao 0,45, UV mái (rãnh ngói xuôi dốc) */
function coping(len, t, h0) {
  const w = t / 2 + 0.28, s = new THREE.Shape([new THREE.Vector2(-w, 0), new THREE.Vector2(w, 0), new THREE.Vector2(0.06, 0.42), new THREE.Vector2(-0.06, 0.42)]);
  const g = new THREE.ExtrudeGeometry(s, { depth: len + 0.2, bevelEnabled: false }); g.rotateY(Math.PI / 2); g.translate(-(len + 0.2) / 2, h0, 0);
  return g;
}
/** list: [{ x, z, len, ry, h, t }] (khung cục bộ khuôn viên) → THREE.Group (≤ 4 lưới) */
export function estateFence(S, list, { villa = false } = {}) {
  const M = fenceMats(), f = S.fence, by = new Map(), add = (k, g) => { if (!by.has(k)) by.set(k, []); by.get(k).push(g); };
  const place = (g, w) => { g.rotateY(w.ry); g.translate(w.x, 0, w.z); return g; };
  for (const w of list) {
    if (f === 'hedge') continue; // bờ rào cây: estateHedge (cây camchau) — mansion3d trồng dọc tường
    if (f === 'iron') {
      add('base', place(new THREE.BoxGeometry(w.len, 0.7, w.t).translate(0, 0.35, 0), w));
      add('capStone', place(new THREE.BoxGeometry(w.len + 0.1, 0.12, w.t + 0.12).translate(0, 0.76, 0), w));
      const bars = []; const n = Math.max(2, Math.round(w.len / 0.16));
      for (let i = 0; i <= n; i++) { const x = -w.len / 2 + (w.len * i) / n; bars.push(new THREE.CylinderGeometry(0.018, 0.018, w.h - 0.8, 4).translate(x, 0.82 + (w.h - 0.8) / 2, 0)); if (i % 6 === 0) bars.push(new THREE.ConeGeometry(0.045, 0.16, 4).translate(x, w.h + 0.08, 0)); }
      for (const y of [0.95, w.h - 0.15]) bars.push(new THREE.BoxGeometry(w.len, 0.05, 0.04).translate(0, y, 0));
      for (let x = -w.len / 2; x <= w.len / 2 + 0.01; x += Math.max(3, w.len / Math.max(1, Math.round(w.len / 4)))) add('stone', place(new THREE.BoxGeometry(0.55, w.h + 0.25, 0.55).translate(x, (w.h + 0.25) / 2, 0), w));
      add('ironBar', place(mergeGeometries(bars.map((b) => b.toNonIndexed()), false), w));
      continue;
    }
    if (f === 'bamboo') {
      add('stone', place(new THREE.BoxGeometry(w.len, 0.35, w.t).translate(0, 0.17, 0), w));
      const poles = []; for (let x = -w.len / 2; x <= w.len / 2; x += 0.12) poles.push(new THREE.CylinderGeometry(0.05, 0.05, w.h - 0.35, 5).translate(x, 0.35 + (w.h - 0.35) / 2, 0).toNonIndexed());
      for (const y of [0.9, w.h - 0.5]) poles.push(new THREE.BoxGeometry(w.len, 0.08, 0.16).translate(0, y, 0.08).toNonIndexed());
      add('bamboo', place(mergeGeometries(poles, false), w));
      add(CAP.bamboo, place(coping(w.len, 0.25, w.h), w));
      continue;
    }
    const body = f in M ? f : 'whitewall';
    add(body, place(new THREE.BoxGeometry(w.len, w.h, w.t).translate(0, w.h / 2, 0), w));
    // chân tường đá cao 0,5 (trừ tường đá / gạch) + trụ bổ tường mỗi ~6 m (tường dài trên 8 m)
    if (!['stone', 'stonewall', 'redstone', 'modern'].includes(f)) add('base', place(new THREE.BoxGeometry(w.len + 0.04, 0.5, w.t + 0.08).translate(0, 0.25, 0), w));
    if (w.len > 8 && f !== 'modern') { const n = Math.round(w.len / 6); for (let i = 0; i <= n; i++) add(body, place(new THREE.BoxGeometry(0.5, w.h, w.t + 0.24).translate(-w.len / 2 + (w.len * i) / n, w.h / 2, 0), w)); }
    const cap = CAP[f] || 'capStone';
    if (cap === 'capTile' || cap === 'capTileRed') add(cap, place(coping(w.len, w.t, w.h), w));
    else add(cap, place(new THREE.BoxGeometry(w.len + 0.1, cap === 'capMetal' ? 0.08 : 0.2, w.t + (cap === 'capMetal' ? 0.06 : 0.2)).translate(0, w.h + (cap === 'capMetal' ? 0.04 : 0.1), 0), w));
  }
  const g = new THREE.Group(); g.name = 'est-fence';
  for (const [k, list2] of by) {
    const mat = M[k]; const span = SPAN[mat.userData?.tiled] || 1;
    const geo = mergeGeometries(list2.map((x) => (x.index ? x.toNonIndexed() : x)), false);
    const fin = mat.userData?.tiled ? boxUV(geo, { roof: k.startsWith('capTile'), span }) : geo;
    if (!fin.attributes.normal) fin.computeVertexNormals();
    const m = new THREE.Mesh(fin, mat); m.castShadow = m.receiveShadow = true; m.name = `fence:${k}`; g.add(m);
  }
  g.userData.dynamic = true;
  return g;
}
/** điểm trồng bờ rào cây (fence 'hedge') dọc các đoạn tường: [{ kind: 'hedge', x, z }] mỗi 1,6 m */
export function hedgeRow(list) {
  const out = [];
  for (const w of list) { const n = Math.max(1, Math.round(w.len / 1.6)), c = Math.cos(w.ry), s = Math.sin(w.ry); for (let i = 0; i < n; i++) { const u = -w.len / 2 + (w.len * (i + 0.5)) / n; out.push({ kind: 'hedge', x: w.x + c * u, z: w.z - s * u }); } }
  return out;
}

// ---------------------------------------------------------------- đá tự nhiên, viền ao, non bộ
// đá: khối 20 mặt chia 3 lần, đẩy theo nhiễu giá trị 3 tầng (mặt gãy lớn + gợn nhỏ), dẹt theo loài; texture đá chiếu
// ba mặt theo mét (mats.triplanar) — thay khối 12 mặt phẳng đen (archkit.pond / rockery). 4 biến thể, vẽ nhân bản.
const hash3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi, sm = (t) => t * t * (3 - 2 * t);
  let v = 0; for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) v += hash3(xi + a, yi + b, zi + c) * (a ? sm(xf) : 1 - sm(xf)) * (b ? sm(yf) : 1 - sm(yf)) * (c ? sm(zf) : 1 - sm(zf));
  return v;
}
const ROCKS = new Map();
/** biến thể đá v (0–3): taihu = đá Thái Hồ (cao, nhiều hõm); thường = tảng dẹt */
function rockGeo(v, taihu = false) {
  const key = `${v}:${taihu}`; if (ROCKS.has(key)) return ROCKS.get(key);
  const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, q = new THREE.Vector3(), o = v * 17.3;
  for (let i = 0; i < p.count; i++) {
    q.fromBufferAttribute(p, i);
    const n = 0.55 * vnoise(q.x * 1.3 + o, q.y * 1.3, q.z * 1.3) + 0.3 * vnoise(q.x * 3.1, q.y * 3.1 + o, q.z * 3.1) + 0.15 * vnoise(q.x * 7, q.y * 7, q.z * 7 + o);
    let k = 0.62 + n * 0.75; if (taihu) k *= 0.75 + 0.5 * Math.abs(Math.sin(q.y * 5 + o + q.x * 3)); // hõm xoáy đá Thái Hồ
    q.multiplyScalar(k); q.y = q.y < 0 ? q.y * 0.3 : q.y; p.setXYZ(i, q.x, q.y, q.z);
  }
  if (taihu) g.scale(0.6, 1.6, 0.55); else g.scale(1, 0.62, 0.85);
  g.computeVertexNormals(); g.computeBoundingBox(); g.translate(0, -g.boundingBox.min.y - 0.12, 0); // chân lún 0,12 m
  ROCKS.set(key, g); return g;
}
let RM = null; const rockMat = () => (RM ||= triplanar('stone', '#9a958a', { rough: 0.95, span: 1.6 }));
/** đá rải: list [{ x, z, s (cỡ m), ry, taihu? }] → nhóm nhân bản theo biến thể */
export function rocks(list) {
  const g = new THREE.Group(), by = new Map(), M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  list.forEach((r, i) => { const k = `${i % 4}:${!!r.taihu}`; if (!by.has(k)) by.set(k, []); by.get(k).push(r); });
  for (const [k, L] of by) {
    const [v, t] = k.split(':'); const im = new THREE.InstancedMesh(rockGeo(+v, t === 'true'), rockMat(), L.length);
    L.forEach((r, i) => { Q.setFromAxisAngle(up, r.ry ?? i * 2.3); M4.compose(P.set(r.x, r.y || 0, r.z), Q, S.setScalar(r.s)); im.setMatrixAt(i, M4); });
    im.castShadow = im.receiveShadow = true; im.computeBoundingSphere(); g.add(im);
  }
  g.userData.dynamic = true; g.userData.shared = true; // hình đá dùng chung giữa các khuôn viên
  return g;
}
let KM = null;
/** viền ao: bờ đá xếp (vành elip rộng 0,7 cao 0,32, đá tấm) + đá tảng rải không đều (thưa phía trục cầu) */
export function pondRim(p, seed = 1) {
  const g = new THREE.Group(), w = 0.7;
  const sh = new THREE.Shape(); sh.absellipse(0, 0, p.rx + w, p.rz + w, 0, Math.PI * 2);
  const hole = new THREE.Path(); hole.absellipse(0, 0, p.rx - 0.05, p.rz - 0.05, 0, Math.PI * 2, true); sh.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 1, curveSegments: 64 });
  geo.rotateX(-Math.PI / 2); geo.translate(p.x, 0, p.z);
  const kerb = new THREE.Mesh(boxUV(geo, { span: SPAN.stone }), (KM ||= tiled('stone', '#b8b2a4', { rough: 1 }))); kerb.castShadow = kerb.receiveShadow = true; g.add(kerb);
  let s = seed * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const list = [], n = Math.round((p.rx + p.rz) * 0.9);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.3, ca = Math.cos(a), sa = Math.sin(a);
    if (p.bridge && Math.abs(p.rx * ca) < p.bridge.w / 2 + 1.2) continue; // chừa đầu cầu
    if (r() < 0.35) continue;
    const sz = 0.5 + r() * 0.9, out = 0.35 + r() * 0.6;
    list.push({ x: p.x + ca * (p.rx + out), z: p.z + sa * (p.rz + out), s: sz, ry: r() * 6.28 });
  }
  g.add(rocks(list));
  g.userData.dynamic = true;
  return g;
}
/** non bộ (gò tọa sơn Á Đông): 3–5 cụm đá Thái Hồ cao 2–4,5 m + đá tảng chân, trong dải m { x, z, w, d } */
export function rockery(m, seed = 3) {
  let s = seed * 7919 + 13; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const list = [], nC = Math.max(3, Math.round(m.w / 14));
  for (let c = 0; c < nC; c++) {
    const cx = m.x - m.w / 2 + (m.w * (c + 0.5)) / nC + (r() - 0.5) * 3, cz = m.z + (r() - 0.5) * m.d * 0.4;
    list.push({ x: cx, z: cz, s: 2 + r() * 1.6, taihu: true, ry: r() * 6.28 });
    for (let i = 0; i < 4; i++) list.push({ x: cx + (r() - 0.5) * 4, z: cz + (r() - 0.5) * Math.min(4, m.d), s: 0.7 + r() * 1.0, taihu: r() < 0.4, ry: r() * 6.28 });
  }
  return rocks(list);
}
