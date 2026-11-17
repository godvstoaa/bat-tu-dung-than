// ============================================================================
//  CÂY TIÊN PHỦ bằng MODEL THẬT (docs/TIEN-PHU-DOHOA-MANIFEST.md §2.1): loài trong plan → model GLB đã kiểm bằng mắt
//  (tree_peach · lib_blossom · lib_willow · lib_bonsai · lib_lib_tree_broad3d), «cây hoá» dáng bonsai (thu thân, nâng tán —
//  cùng kỹ thuật CAY-QUAN-MANIFEST), nhuộm tán theo loài / mùa (mặt nạ lá trên màu đỉnh), nhân bản 2 bậc:
//  gần ≤ 55 m bản .vc (~5k), xa ≤ 300 m bản .vc2 (~1k), xa hơn ẩn. Loài chưa có model (cypress, hedge, palm, bamboo) → null
//  (estate3d dựng thủ tục như cũ). Va chạm KHÔNG lấy từ lưới này (nhóm noCollide) — trụ thân ẩn ở lớp proxy (trunkProxy).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { loadModel } from '../assets.js';

// [model, cao min, cao max, thin, lift, màu tán (null = gốc)]
const SP = {
  pine: ['lib_bonsai', 7, 10, 0.6, 0.34, null],
  peach: ['tree_peach', 4.5, 6, 0.65, 0.34, null], sakura: ['tree_peach', 4.8, 6.2, 0.65, 0.34, null],
  camellia: ['tree_peach', 4, 5.2, 0.65, 0.34, null],
  plum: ['lib_blossom', 4.5, 6, 0.65, 0.34, null], osmanthus: ['lib_blossom', 4.5, 6, 0.65, 0.34, '#e8c95a'],
  magnolia: ['lib_blossom', 5, 6.5, 0.65, 0.34, null], frangi: ['lib_blossom', 4.2, 5.5, 0.65, 0.34, null],
  jacaranda: ['lib_blossom', 5, 7, 0.65, 0.34, '#8a6ad0'],
  willow: ['lib_willow', 6, 8.5, 0.6, 0.36, '#8fb35a'], wisteria: ['lib_willow', 4.5, 6, 0.6, 0.36, '#a58ad8'],
  // lá rộng: model lá CHÙM (mai / đào / liễu) nhuộm theo loài — model lib_lib_tree_broad3d (lá thẻ phẳng) trông như cắm giấy (ảnh sau lần 2)
  ginkgo: ['lib_blossom', 7, 9.5, 0.65, 0.34, '#d8c84a'], maple: ['lib_blossom', 5.5, 7.5, 0.65, 0.34, '#c8452a'],
  olive: ['tree_peach', 5, 6.5, 0.65, 0.34, '#8fa07a'], birch: ['lib_blossom', 7, 9, 0.6, 0.36, '#9cc46a'],
  banyan: ['lib_willow', 8, 10.5, 0.6, 0.36, '#4f7a3a'],
  // chưa có model → dáng thủ tục chất lượng cao trong cùng hệ nhân bản (procGeo): bách = ngọn lửa xanh nhiều múi, giậu = khối bo gồ ghề
  cypress: ['@cypress', 6, 9, 1, 0, null], hedge: ['@hedge', 1.1, 1.4, 1, 0, null],
};
const SEASON = [null, '#f2a6c0', '#d0602a', '#eef2f4'];
export const NEAR = 55, FAR = 240, CELL = 80; // FAR 300 → 240 m: sương đã che, −17 % fps khi vẽ tới 300 m
/** loài có model không */
export const hasModel = (kind) => !!SP[kind];
/** chiều cao (m) của cây trong plan: s ∈ [0,85; 1,4] → nội suy trong khoảng của loài */
export const treeHeight = (t) => { const s = SP[t.kind]; const k = Math.min(1, Math.max(0, ((t.s || 1) - 0.85) / 0.55)); return s[1] + (s[2] - s[1]) * k; };
/** bán kính thân (va chạm) */
export const trunkR = (h) => Math.min(0.4, Math.max(0.18, h * 0.045));
/** khối va chạm của cây (cục bộ phủ): { r } trụ thân, hoặc { w, d } hộp (giậu) — cao 2,2 m; bách: tán sát đất nên trụ = bán kính tán */
export function treeProxy(t) { const h = treeHeight(t); if (t.kind === 'hedge') return { w: h * 1.5, d: h * 1.5, h }; if (t.kind === 'cypress') return { r: h * 0.1, h: 2.2 }; return { r: trunkR(h), h: 2.2 }; }
const hashN = (x, y, z) => { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return v - Math.floor(v); };
/** hình học thủ tục cao 1, gốc (0,0,0), màu đỉnh: bách Ý (thân + tán lửa 6 múi gồ) · giậu cắt tỉa (khối bo, mặt gồ) */
function procGeo(kind, tint) {
  const col = new THREE.Color(), parts = [];
  const paint = (g, fn) => { const P = g.attributes.position, C = new Float32Array(P.count * 3); for (let i = 0; i < P.count; i++) { fn(P.getX(i), P.getY(i), P.getZ(i), col); C[i * 3] = col.r; C[i * 3 + 1] = col.g; C[i * 3 + 2] = col.b; } g.setAttribute('color', new THREE.BufferAttribute(C, 3)); return g; };
  const base = new THREE.Color(tint || (kind === 'hedge' ? '#3f7a3a' : '#2f5e34'));
  if (kind === 'cypress') {
    const trunk = new THREE.CylinderGeometry(0.012, 0.02, 0.12, 6); trunk.translate(0, 0.06, 0); parts.push(paint(trunk, (x, y, z, c) => c.set('#4a3326')));
    const fol = new THREE.IcosahedronGeometry(1, 3), P = fol.attributes.position;
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i), y = P.getY(i), z = P.getZ(i), t = (y + 1) / 2, a = Math.atan2(z, x);
      // dáng lửa: phình ở 35 % chiều cao, nhọn đỉnh; 6 múi dọc + gồ nhỏ
      const prof = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.78 + 0.08)), 0.9) * (1 - t * 0.35), lobe = 1 + 0.09 * Math.cos(a * 6 + t * 5) + 0.07 * (hashN(x, y, z) - 0.5);
      P.setXYZ(i, x * 0.13 * prof * lobe, 0.08 + t * 0.92, z * 0.13 * prof * lobe);
    }
    parts.push(paint(fol.toNonIndexed(), (x, y, z, c) => { const n = hashN(x * 9, y * 9, z * 9); c.copy(base).offsetHSL(0.01 * (n - 0.5), 0, (y - 0.5) * 0.12 + (n - 0.5) * 0.08); }));
  } else {
    const box = new THREE.BoxGeometry(1.5, 1, 1.5, 10, 6, 10), P = box.attributes.position;
    for (let i = 0; i < P.count; i++) {
      let x = P.getX(i), y = P.getY(i), z = P.getZ(i);
      // bo góc: kéo đỉnh về khối bo bán kính 0,18; gồ lá ±3 cm
      const r = 0.18, cx = Math.max(-0.75 + r, Math.min(0.75 - r, x)), cy = Math.max(-0.5 + r, Math.min(0.5 - r, y)), cz = Math.max(-0.75 + r, Math.min(0.75 - r, z));
      let dx = x - cx, dy = y - cy, dz = z - cz; const d = Math.hypot(dx, dy, dz) || 1; if (d > r) { dx *= r / d; dy *= r / d; dz *= r / d; }
      const bump = 1 + (hashN(x * 7, y * 7, z * 7) - 0.5) * 0.12;
      P.setXYZ(i, cx + dx * bump, cy + dy * bump + 0.5, cz + dz * bump);
    }
    parts.push(paint(box.toNonIndexed(), (x, y, z, c) => { const n = hashN(x * 13, y * 13, z * 13); c.copy(base).offsetHSL(0, 0, (y - 0.5) * 0.14 + (n - 0.5) * 0.1); }));
  }
  const geo = mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)));
  geo.computeVertexNormals(); geo.computeBoundingSphere();
  return Promise.resolve(geo);
}

// ---------- khuôn hình học: gộp lưới, gốc thân về (0,0,0), cao 1, cây hoá, nhuộm tán
const GEO = new Map();
function prep(id, tier, thin, lift, tint) {
  const k = `${id}|${tier}|${thin}|${lift}|${tint}`;
  if (GEO.has(k)) return GEO.get(k);
  const pr = loadModel(`${id}.${tier}`).then((g) => {
    if (!g) return null;
    g.scene.updateMatrixWorld(true);
    const parts = [];
    g.scene.traverse((o) => {
      if (!o.isMesh) return;
      const src = o.geometry, n = src.attributes.position.count, out = new THREE.BufferGeometry();
      const P = new Float32Array(n * 3), C = new Float32Array(n * 3).fill(0.5), ca = src.attributes.color;
      for (let i = 0; i < n; i++) { P[i * 3] = src.attributes.position.getX(i); P[i * 3 + 1] = src.attributes.position.getY(i); P[i * 3 + 2] = src.attributes.position.getZ(i); if (ca) { C[i * 3] = ca.getX(i); C[i * 3 + 1] = ca.getY(i); C[i * 3 + 2] = ca.getZ(i); } }
      out.setAttribute('position', new THREE.BufferAttribute(P, 3)); out.setAttribute('color', new THREE.BufferAttribute(C, 3));
      if (src.index) out.setIndex(new THREE.BufferAttribute(Uint32Array.from(src.index.array), 1));
      out.applyMatrix4(o.matrixWorld); parts.push(out);
    });
    if (!parts.length) return null;
    const same = parts.every((p) => p.index) ? parts : parts.map((p) => (p.index ? p.toNonIndexed() : p)); // mergeGeometries đòi đồng nhất chỉ số
    const geo = same.length > 1 ? mergeGeometries(same) : same[0]; if (!geo) return null;
    geo.computeBoundingBox();
    const b = geo.boundingBox, ht = b.max.y - b.min.y || 1, P = geo.attributes.position, C = geo.attributes.color;
    let sx = 0, sz = 0, cn = 0; for (let i = 0; i < P.count; i++) if (P.getY(i) < b.min.y + ht * 0.06) { sx += P.getX(i); sz += P.getZ(i); cn++; }
    geo.translate(-(cn ? sx / cn : (b.min.x + b.max.x) / 2), -b.min.y, -(cn ? sz / cn : (b.min.z + b.max.z) / 2)); geo.scale(1 / ht, 1 / ht, 1 / ht);
    // mặt nạ lá: đỉnh sáng (> 0,45) hoặc lục bão hoà, ở trên 25 % chiều cao
    const col = new THREE.Color(), hsl = {}, leaf = new Uint8Array(P.count);
    for (let i = 0; i < P.count; i++) { col.setRGB(C.getX(i), C.getY(i), C.getZ(i)); col.getHSL(hsl, THREE.SRGBColorSpace); leaf[i] = P.getY(i) > 0.25 && (hsl.l > 0.45 || (hsl.s > 0.25 && hsl.h > 0.12 && hsl.h < 0.45)) ? 1 : 0; }
    // cây hoá (dáng bonsai → dáng cây): thân thu về tâm từng lát cao, tán bắt đầu ở `lift` thay vì 30 %
    if (thin < 1 || lift) {
      const NS = 24, cx = new Float32Array(NS), cz = new Float32Array(NS), nn = new Float32Array(NS);
      for (let i = 0; i < P.count; i++) { if (leaf[i]) continue; const s = Math.min(NS - 1, Math.floor(P.getY(i) * NS)); cx[s] += P.getX(i); cz[s] += P.getZ(i); nn[s]++; }
      let px = 0, pz = 0; for (let s = 0; s < NS; s++) { if (nn[s]) { px = cx[s] / nn[s]; pz = cz[s] / nn[s]; } cx[s] = px; cz[s] = pz; }
      for (let i = 0; i < P.count; i++) {
        const y = P.getY(i), s = Math.min(NS - 1, Math.floor(y * NS)), t = Math.min(1, Math.max(0, (y - 0.22) / 0.33)), kk = thin + (1 - thin) * t * t * (3 - 2 * t);
        const ny = y < 0.3 ? y * (lift / 0.3) : lift + (y - 0.3) * ((1 - lift) / 0.7);
        P.setXYZ(i, cx[s] + (P.getX(i) - cx[s]) * kk, ny, cz[s] + (P.getZ(i) - cz[s]) * kk);
      }
    }
    if (tint) {
      const T = new THREE.Color(tint), th = {}; T.getHSL(th, THREE.SRGBColorSpace);
      for (let i = 0; i < P.count; i++) { if (!leaf[i]) continue; col.setRGB(C.getX(i), C.getY(i), C.getZ(i)); col.getHSL(hsl, THREE.SRGBColorSpace); col.setHSL(th.h + (hsl.l - 0.5) * 0.04, th.s, Math.min(0.92, th.l * (0.75 + hsl.l * 0.5)), THREE.SRGBColorSpace); C.setXYZ(i, col.r, col.g, col.b); }
    }
    geo.computeVertexNormals();
    // pháp tuyến cầu cho tán (CAY-QUAN-MANIFEST §1): tán sáng như một khối mềm, không gãy từng mặt
    { const N = geo.attributes.normal; let ax = 0, ay = 0, az = 0, an = 0;
      for (let i = 0; i < P.count; i++) if (leaf[i]) { ax += P.getX(i); ay += P.getY(i); az += P.getZ(i); an++; }
      if (an) { ax /= an; ay /= an; az /= an; const v = new THREE.Vector3(), w = new THREE.Vector3();
        for (let i = 0; i < P.count; i++) { if (!leaf[i]) continue; v.set(P.getX(i) - ax, (P.getY(i) - ay) * 1.3 + 0.08, P.getZ(i) - az).normalize(); w.set(N.getX(i), N.getY(i), N.getZ(i)); if (w.dot(v) < 0) w.negate(); v.multiplyScalar(0.75).addScaledVector(w, 0.25).normalize(); N.setXYZ(i, v.x, v.y, v.z); } } }
    geo.computeBoundingSphere();
    return geo;
  }).catch(() => null);
  GEO.set(k, pr);
  return pr;
}

const tri = (g) => (g.index ? g.index.count : g.attributes.position.count) / 3;
const MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0, side: THREE.DoubleSide });
// (đã thử Lambert cho bậc xa: không nhận ánh sáng môi trường của cảnh → hàng cây xa tối đen; fps trung vị không khác — bỏ)
// tán hai mặt KHÔNG lật pháp tuyến ở mặt sau: pháp tuyến tán đã hướng ra ngoài tâm (pháp tuyến cầu) — three lật theo gl_FrontFacing
// thì nửa số lá (mặt sau quay về camera) nhận pháp tuyến hướng vào trong → đen sì (ảnh sau lần 1, output/tienphu-dohoa/after)
for (const mt of [MAT]) {
  mt.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n\tnormal = normalize( vNormal );'); };
  mt.customProgramCacheKey = () => 'tp-flora-noflip';
}

/**
 * Trồng cây có model vào parent (toạ độ cục bộ phủ). list: [{ x, z, kind, s }] (chỉ loài hasModel), season 0..3.
 * Trả { group, update(lx, lz) — toạ độ CỤC BỘ người chơi, gọi mỗi khung (tự giãn nhịp) , ready: Promise }.
 */
export function plantFlora(parent, list, season = 0) {
  const group = new THREE.Group(); group.name = 'flora'; group.userData.noCollide = true; parent.add(group);
  const bySp = new Map();
  for (const t of list) { const s = SP[t.kind]; if (!s) continue; const key = `${s[0]}|${s[3]}|${s[4]}|${SEASON[season] || s[5] || ''}`; if (!bySp.has(key)) bySp.set(key, { s, tint: SEASON[season] || s[5], items: [] }); bySp.get(key).items.push({ x: t.x, z: t.z, h: treeHeight(t), ry: t.kind === 'hedge' ? 0 : ((t.x * 12.9898 + t.z * 78.233) % 6.283) }); }
  const sets = [];
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3(), S = new THREE.Vector3();
  const ready = Promise.all([...bySp.values()].map(async ({ s, tint, items }) => {
    const [gn, gf] = s[0].startsWith('@') ? await Promise.all([procGeo(s[0].slice(1), tint), procGeo(s[0].slice(1), tint)]) : await Promise.all([prep(s[0], 'vc', s[3], s[4], tint), prep(s[0], 'vc2', s[3], s[4], tint)]);
    const near = gn || gf, far = gf || gn; if (!near) return;
    // chia ô CELL m: mỗi ô một cặp InstancedMesh có khung bao riêng → three loại ô ngoài khung nhìn (cả lượt bóng).
    // Một khối phủ cả phủ (bản đầu) bắt GPU xử lý cả cây sau lưng camera: −13 fps ở sân Quân Thiên (đo $TEMP/tpg/perf.mjs).
    const cells = new Map();
    for (const it of items) { const k = `${Math.floor(it.x / CELL)},${Math.floor(it.z / CELL)}`; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(it); }
    for (const list of cells.values()) {
      const all = new Float32Array(list.length * 16);
      list.forEach((it, i) => { Q.setFromAxisAngle(UP, it.ry); M4.compose(V.set(it.x, 0, it.z), Q, S.set(it.h, it.h, it.h)); M4.toArray(all, i * 16); });
      const mk = (geo, cast) => { const im = new THREE.InstancedMesh(geo, MAT, list.length); im.castShadow = cast; im.receiveShadow = cast; im.count = 0; im.visible = false; group.add(im); return im; };
      sets.push({ items: list, all, near: mk(near, true), far: mk(far, false) });
    }
    lx = Infinity; // ép tính lại khi bộ mới vào
  }));
  let lx = Infinity, lz = Infinity;
  function update(px, pz) {
    if (Math.hypot(px - lx, pz - lz) < 12) return;
    lx = px; lz = pz;
    for (const st of sets) {
      let a = 0, b = 0; const A = st.near.instanceMatrix.array, B = st.far.instanceMatrix.array;
      st.items.forEach((it, i) => { const d = Math.hypot(it.x - px, it.z - pz); if (d < NEAR) A.set(st.all.subarray(i * 16, i * 16 + 16), 16 * a++); else if (d < FAR) B.set(st.all.subarray(i * 16, i * 16 + 16), 16 * b++); });
      for (const [im, n] of [[st.near, a], [st.far, b]]) { const was = im.count; im.count = n; im.visible = n > 0; if (n) { im.instanceMatrix.needsUpdate = true; im.boundingSphere = null; im.computeBoundingSphere(); } else if (was) im.instanceMatrix.needsUpdate = true; }
    }
  }
  return { group, update, ready, stats: () => sets.reduce((o, s) => { o.n += s.items.length; o.near += s.near.count; o.far += s.far.count; o.tris += s.near.count * tri(s.near.geometry) + s.far.count * tri(s.far.geometry); o.meshes += 2; return o; }, { n: 0, near: 0, far: 0, tris: 0, meshes: 0 }) };
}
