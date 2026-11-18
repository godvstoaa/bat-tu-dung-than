// ============================================================================
//  CÂY CỔ THỤ TIÊN PHỦ bằng MODEL MESHY (CC0) — docs/TIEN-PHU-THUCVAT-MANIFEST.md §3.
//  Mỗi loài 3 bản (scripts/meshy-pack-trees.mjs): lib_tp_<m>.near (UV + texture, ~50k — cây trong 45 m, giữ chi tiết),
//  .vc (màu đỉnh ~12k, 45–140 m), .vc2 (màu đỉnh ~1,6k, 140–330 m). Bản xa KHÔNG giản lược qua đường nối UV → không kéo sọc.
//  Chuẩn hoá: bỏ đế đất / chậu đi kèm model (nếu có), gốc thân về (0,0,0), cao 1 → nhân bản co theo chiều cao thật của loài.
//  Loài không có model Meshy đúng loài → cây thủ tục oldtree.js (cùng 3 cấp).
// ============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { modelUrl } from '../assets.js';
import { plantOldTrees, SPECIES as PROC } from './oldtree.js';

import { BIG, bigHeight, bigProxy } from './flora-spec.js';
import { IMP_S } from './imp.gen.js';
export { BIG, bigHeight, bigProxy };
export const isBig = (kind) => !!BIG[kind];

// ---------------------------------------------------------------- tải + chuẩn hoá
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const RAW = new Map();
function loadRaw(id) { // không qua assets.loadModel: danh sách file của máy dev đóng băng lúc khởi động (virtual:model-files)
  if (!RAW.has(id)) RAW.set(id, fetch(modelUrl(id)).then((r) => (r.ok ? r.arrayBuffer() : null)).then((b) => (b ? new Promise((res, rej) => loader.parse(b, '', res, rej)) : null)).catch(() => null));
  return RAW.get(id);
}
/** gộp mọi lưới của GLB thành { geo, mat } (một vật liệu — Meshy xuất 1 vật liệu; nhiều thì lấy cái đầu, giữ màu đỉnh nếu có) */
function flatten(g) {
  g.scene.updateMatrixWorld(true);
  const parts = []; let mat = null;
  g.scene.traverse((o) => { if (!o.isMesh) return; const ge = o.geometry.clone();
    // bản nén meshopt lượng tử hoá (Int16 chuẩn hoá ±1): đổi về Float32 TRƯỚC khi biến đổi — không thì toạ độ thế giới bị kẹp ±1 → hình kéo sọc
    for (const [k, a] of Object.entries(ge.attributes)) if (a.normalized || !(a.array instanceof Float32Array)) { const f = new Float32Array(a.count * a.itemSize); for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) f[i * a.itemSize + c] = a.getComponent(i, c); ge.setAttribute(k, new THREE.BufferAttribute(f, a.itemSize)); }
    ge.applyMatrix4(o.matrixWorld); for (const k of Object.keys(ge.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) ge.deleteAttribute(k); parts.push(ge); mat = mat || [].concat(o.material)[0]; });
  if (!parts.length) return null;
  const keys = ['position', 'normal', 'uv', 'color'].filter((k) => parts.every((p) => p.attributes[k]));
  for (const p of parts) for (const k of Object.keys(p.attributes)) if (!keys.includes(k)) p.deleteAttribute(k);
  const same = parts.every((p) => p.index) ? parts : parts.map((p) => (p.index ? p.toNonIndexed() : p));
  return { geo: same.length > 1 ? mergeGeometries(same) : same[0], mat };
}
/** chuẩn từ bản near: { cut (y bỏ đế), cx, cz (tâm gốc), y0, ht } — áp chung cho 3 bản (cùng toạ độ nguồn) */
function frameOf(geo, keep) {
  geo.computeBoundingBox(); const b = geo.boundingBox, P = geo.attributes.position, ht = b.max.y - b.min.y, W = Math.max(b.max.x - b.min.x, b.max.z - b.min.z);
  // quét lát 1 %: đế đất / chậu = lát dưới cùng rộng; thân = lát hẹp đầu tiên phía trên
  const NS = 100, ex = new Float32Array(NS).fill(0), mnx = new Float32Array(NS).fill(1e9), mxx = new Float32Array(NS).fill(-1e9), mnz = new Float32Array(NS).fill(1e9), mxz = new Float32Array(NS).fill(-1e9);
  for (let i = 0; i < P.count; i++) { const s = Math.min(NS - 1, Math.floor(((P.getY(i) - b.min.y) / ht) * NS)); const x = P.getX(i), z = P.getZ(i); if (x < mnx[s]) mnx[s] = x; if (x > mxx[s]) mxx[s] = x; if (z < mnz[s]) mnz[s] = z; if (z > mxz[s]) mxz[s] = z; }
  for (let s = 0; s < NS; s++) ex[s] = mxx[s] > mnx[s] ? Math.max(mxx[s] - mnx[s], mxz[s] - mnz[s]) : 0;
  let cutS = 0;
  if (!keep && ex[0] > W * 0.3) { for (let s = 1; s < 25; s++) if (ex[s] > 0 && ex[s] < W * 0.16) { cutS = s; break; } } // có đế: cắt ở lát thân đầu tiên
  const cut = b.min.y + (cutS / NS) * ht;
  // tâm gốc = tâm lát thân ngay trên chỗ cắt
  let sx = 0, sz = 0, n = 0; const s0 = cutS, s1 = cutS + 3;
  for (let i = 0; i < P.count; i++) { const s = Math.floor(((P.getY(i) - b.min.y) / ht) * NS); if (s >= s0 && s <= s1) { sx += P.getX(i); sz += P.getZ(i); n++; } }
  return { cut, cx: n ? sx / n : (b.min.x + b.max.x) / 2, cz: n ? sz / n : (b.min.z + b.max.z) / 2, ht: b.max.y - cut, sunk: cutS ? 0 : 0.01 };
}
/** bỏ tam giác nằm hẳn dưới mặt cắt, dời gốc, co về cao 1 */
function applyFrame(geo, F) {
  let g = geo;
  if (F.cut > -1e8) {
    const P = g.attributes.position, I = g.index ? g.index.array : null, n = I ? I.length : P.count, keep = [];
    const lim = F.cut + F.ht * 0.004;
    for (let t = 0; t < n; t += 3) { const a = I ? I[t] : t, b2 = I ? I[t + 1] : t + 1, c = I ? I[t + 2] : t + 2; if (P.getY(a) < lim && P.getY(b2) < lim && P.getY(c) < lim) continue; keep.push(a, b2, c); }
    if (I) g.setIndex(keep); else { g = g.toNonIndexed(); }
  }
  g.translate(-F.cx, -F.cut + F.ht * F.sunk, -F.cz); g.scale(1 / F.ht, 1 / F.ht, 1 / F.ht);
  if (!g.attributes.normal) g.computeVertexNormals();
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}
const WIND = { uTime: { value: 0 } };
function windify(m, key) {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = WIND.uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;').replace('#include <begin_vertex>', `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 ip = instanceMatrix[3].xyz;
  float hk = max(0.0, position.y - 0.32) * 0.011;
  transformed.x += sin(uTime * 1.1 + ip.x * 0.11 + position.y * 6.0 + position.z * 9.0) * hk;
  transformed.z += cos(uTime * 0.85 + ip.z * 0.13 + position.x * 8.0) * hk * 0.7;
#endif`);
  };
  m.customProgramCacheKey = () => 'tp-bigtree-' + key;
  return m;
}
/** ẢNH XA (impostor) — 2 tấm chéo, mỗi tấm một hướng chụp sẵn từ bản near (scripts/bake-tree-impostors.mjs): 4 tam giác / cây,
 *  không vỡ hình như bản giản lược 1,6k (đã thấy dẻ ngựa thành mảnh vụn, đoạn mất thân). S = cạnh ô theo cao cây = 1. */
function impostor(id, S) {
  const tex = new THREE.TextureLoader().load(new URL(`models/${id}.imp.png`, document.baseURI).href); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const h = S / 2, n0 = new THREE.Vector3(0, 0.9, 0.44).normalize(), n1 = new THREE.Vector3(0.44, 0.9, 0).normalize(); // hướng lên trời: tấm không đen khi nắng sau lưng
  const yt = 0.72, pos = [-h, 0, 0, h, 0, 0, h, S, 0, -h, S, 0, 0, 0, h, 0, 0, -h, 0, S, -h, 0, S, h, -h, yt, h, h, yt, h, h, yt, -h, -h, yt, -h]; // tấm 3 nằm ngang trong tán: ảnh nhìn từ trên
  const t = 1 / 3, uv = [0, 0, t, 0, t, 1, 0, 1, t, 0, 2 * t, 0, 2 * t, 1, t, 1, 2 * t, 0, 1, 0, 1, 1, 2 * t, 1];
  const nor = [...[0, 1, 2, 3].flatMap(() => n0.toArray()), ...[0, 1, 2, 3].flatMap(() => n1.toArray()), ...[0, 1, 2, 3].flatMap(() => [0, 1, 0])];
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11]); geo.computeBoundingSphere();
  const mat = new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide, emissive: 0x2a3322, emissiveMap: tex }); // chút ánh trời lọt tán (như bản near)
  // mặt sau tấm: three lật pháp tuyến (DoubleSide) → chĩa xuống đất → cây đen; giữ pháp tuyến hướng trời như lá cây
  mat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nnormal = normalize(vNormal);'); };
  mat.customProgramCacheKey = () => 'tp-bigtree-imp';
  return { geo, mat };
}
const TPL = new Map();
/** khuôn 3 cấp của loài: { near, mid, far: { geo, mat } } — null nếu chưa có model */
export function bigTemplate(kind) {
  if (TPL.has(kind)) return TPL.get(kind);
  const b = BIG[kind];
  const pr = (async () => {
    if (b.proc) return null;
    const id = `lib_tp_${b.m}`, imp = IMP_S[b.m], [gn, gv, gv2] = await Promise.all([loadRaw(`${id}.near`), loadRaw(`${id}.vc`), imp ? null : loadRaw(`${id}.vc2`)]);
    const fn = gn && flatten(gn), fv = gv && flatten(gv), fv2 = gv2 && flatten(gv2); if (!fn && !fv) return null;
    const F = frameOf((fn || fv).geo, b.keep);
    const out = {};
    if (fn) { const m = fn.mat.clone(); m.metalness = 0; m.roughness = Math.max(0.75, m.roughness ?? 0.9); m.metalnessMap = null; m.side = THREE.FrontSide; out.near = { geo: applyFrame(fn.geo, F), mat: windify(m, 'n') }; }
    const vcMat = (k) => windify(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 }), k);
    if (fv) out.mid = { geo: applyFrame(fv.geo, F), mat: vcMat('v') };
    if (fv2) out.far = { geo: applyFrame(fv2.geo, F), mat: out.mid?.mat || vcMat('v') };
    if (imp) out.far = impostor(id, imp);
    out.near = out.near || out.mid; out.mid = out.mid || out.near; out.far = out.far || out.mid;
    { const g = out.near.geo; g.computeBoundingBox(); const bb = g.boundingBox; out.ww = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z); } // tỉ lệ rộng tán / cao của model
    return out;
  })();
  TPL.set(kind, pr); return pr;
}

export const NEAR = 45, MID = 110, FAR = 330, CELL = 130; // ô 130 m: ít bộ nhân bản → ít lệnh vẽ (đo: 90 m → +117 lệnh vẽ ở phủ Trung Hoa)
const tri = (g) => (g.index ? g.index.count : g.attributes.position.count) / 3;
const hash = (x, z) => { const v = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return v - Math.floor(v); };
/**
 * Trồng cây cổ thụ (plan.trees có kind ∈ BIG) vào parent (cục bộ phủ). Trả { group, update(lx, lz), ready, stats } — mansion3d gọi như flora.
 * Cây hàng (t.row) lệch cỡ ±5 %, nghiêng 0; cây tự do lệch ±15 %, nghiêng 0–6°.
 */
export function plantBigTrees(parent, list, season = 0) {
  const group = new THREE.Group(); group.name = 'bigtrees'; group.userData.noCollide = true; parent.add(group);
  const proc = list.filter((t) => BIG[t.kind]?.proc).map((t) => ({ ...t, kind: BIG[t.kind].proc, s: bigHeight(t) / ((PROC[BIG[t.kind].proc].H[0] + PROC[BIG[t.kind].proc].H[1]) / 2) }));
  const procSet = proc.length ? plantOldTrees(group, proc, season) : null;
  const by = new Map(); for (const t of list) { if (!BIG[t.kind] || BIG[t.kind].proc) continue; if (!by.has(t.kind)) by.set(t.kind, []); by.get(t.kind).push(t); }
  const sets = [];
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color();
  const ready = Promise.all([...by.entries()].map(async ([kind, items]) => {
    const T = await bigTemplate(kind); if (!T) return;
    const kx = Math.min(1.6, Math.max(0.75, BIG[kind].w / (T.ww || BIG[kind].w))); // co ngang cho khớp tán đo được của loài (cây mưa tán 1,45 × cao …)
    const cells = new Map();
    for (const it of items) { const k = `${Math.floor(it.x / CELL)},${Math.floor(it.z / CELL)}`; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(it); }
    for (const L of cells.values()) {
      const all = new Float32Array(L.length * 16), tint = new Float32Array(L.length * 3);
      L.forEach((it, i) => {
        const h = bigHeight(it), r1 = hash(it.x, it.z), r2 = hash(it.z + 3.1, it.x - 7.7), row = !!it.row;
        const lean = row ? 0 : (r2 - 0.5) * 0.2; // ±5,7°
        E.set(Math.cos(r1 * 6.28) * lean, row ? (it.ry || 0) : r1 * 6.283, Math.sin(r1 * 6.28) * lean); Q.setFromEuler(E);
        const w = kx * (1 + (r2 - 0.5) * (row ? 0.06 : 0.22)); // tán ±11 % ngang, đã co theo loài
        M4.compose(V.set(it.x, -0.05, it.z), Q, S.set(h * w, h, h * w)); M4.toArray(all, i * 16);
        const k = 0.92 + r2 * 0.16; C.setRGB(k * (0.96 + r1 * 0.08), k, k * (0.96 + (1 - r1) * 0.06)); C.toArray(tint, i * 3);
      });
      const lv = {};
      // bóng chỉ cây ≤ 45 m: cấp trung đổ bóng nhân đôi ~0,9 tr tam giác lượt bóng (đo Versailles: cây ăn 18 fps)
      for (const l of ['near', 'mid', 'far']) { const im = new THREE.InstancedMesh(T[l].geo, T[l].mat, L.length); im.castShadow = l === 'near'; im.receiveShadow = l === 'near'; im.count = 0; im.visible = false; im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(L.length * 3).fill(1), 3); group.add(im); lv[l] = im; }
      sets.push({ items: L, all, tint, lv });
    }
    lx = Infinity;
  }));
  let lx = Infinity, lz = Infinity; const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  function update(px, pz) {
    if (typeof performance !== 'undefined') WIND.uTime.value = (performance.now() - t0) / 1000;
    procSet?.update(px, pz);
    if (Math.hypot(px - lx, pz - lz) < 8) return;
    lx = px; lz = pz;
    for (const st of sets) {
      const n = { near: 0, mid: 0, far: 0 };
      st.items.forEach((it, i) => {
        const d = Math.hypot(it.x - px, it.z - pz), l = d < NEAR ? 'near' : d < MID ? 'mid' : d < FAR ? 'far' : null; if (!l) return;
        const im = st.lv[l], j = n[l]++; im.instanceMatrix.array.set(st.all.subarray(i * 16, i * 16 + 16), j * 16); im.instanceColor.array.set(st.tint.subarray(i * 3, i * 3 + 3), j * 3);
      });
      for (const l of ['near', 'mid', 'far']) { const im = st.lv[l], was = im.count; im.count = n[l]; im.visible = n[l] > 0; if (n[l] || was) { im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; } if (n[l]) { im.boundingSphere = null; im.computeBoundingSphere(); } }
    }
  }
  return {
    group, update, ready: Promise.all([ready, procSet?.ready]),
    stats: () => { const o = sets.reduce((o, s) => { o.n += s.items.length; for (const l of ['near', 'mid', 'far']) { o[l] += s.lv[l].count; o.tris += s.lv[l].count * tri(s.lv[l].geometry); } o.meshes += 3; return o; }, { n: 0, near: 0, mid: 0, far: 0, tris: 0, meshes: 0 }); if (procSet) { const p = procSet.stats(); for (const k of Object.keys(o)) o[k] += p[k] || 0; } return o; },
  };
}
