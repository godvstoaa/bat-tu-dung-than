// ============================================================================
//  Nạp mô hình GLB (tạo bằng Meshy, nén bằng scripts/meshy-pack.mjs) — public/models/<id>.glb
//  - loadModel(id): tải 1 lần, cache; lỗi / thiếu file → null (game dùng mô hình procedural).
//  - placeModel(...): nhân bản, co giãn theo kích thước đích, đặt đáy đúng độ cao.
//  - instanceModel(...): mô hình lặp nhiều chỗ (nhà, cây) → InstancedMesh theo từng mesh con.
// ============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const cache = new Map();

// Công trình «trùm» (Meshy 4K): 3 bản — <id>.hd.glb (texture 2048, máy mạnh), <id>.glb (1024), <id>.lod.glb (giản lược, xa)
export const HD_IDS = new Set(['palace_grand', 'tower_nine', 'sect_gate_grand', 'cliff_palace', 'city_gate', 'sky_palace']);
// model thư viện cộng đồng (CC0, scripts/meshy-pack-library.mjs) cũng có đủ 3 bản hd / thường / lod
export const hasLod = (id) => HD_IDS.has(id) || id.startsWith('lib_');
let modelQuality = 'mid';
export function setModelQuality(q) { modelQuality = q; }

export function modelUrl(id) { return new URL(`models/${id}.glb`, document.baseURI).href; }

export function loadModel(id) {
  if (!cache.has(id)) {
    cache.set(id, loader.loadAsync(modelUrl(id)).then((g) => {
      g.scene.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        // vật liệu Meshy PBR: giữ nguyên, chỉ bật bóng + mipmap anisotropy
        for (const m of [].concat(o.material)) if (m.map) m.map.anisotropy = 4;
      });
      return g;
    }).catch((e) => { console.warn('[assets] không nạp được', id, e?.message || e); return null; }));
  }
  return cache.get(id);
}

// Kích thước khung bao của mô hình gốc (đã tính sẵn để co giãn).
function sizeOf(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  return { box, size: box.getSize(new THREE.Vector3()) };
}

/**
 * Đặt một bản sao mô hình.
 * @param fit { height | width | depth | max } — kích thước đích (m) theo một trục
 * @param at  { x, y, z, ry } — y là độ cao mặt đất (đáy mô hình đặt tại đây)
 */
export async function placeModel(parent, id, { fit = { max: 4 }, at = { x: 0, y: 0, z: 0, ry: 0 }, skinned = false, hd = true } = {}) {
  if (hasLod(id) && !skinned) return placeLod(parent, id, { fit, at, hd });
  const g = await loadModel(id);
  if (!g) return null;
  const obj = skinned ? cloneSkinned(g.scene) : g.scene.clone(true);
  const { size } = sizeOf(obj);
  const [k, v] = Object.entries(fit)[0];
  const ref = k === 'height' ? size.y : k === 'width' ? size.x : k === 'depth' ? size.z : Math.max(size.x, size.y, size.z);
  obj.scale.setScalar(v / (ref || 1));
  obj.rotation.y = at.ry || 0;
  obj.position.set(0, 0, 0);
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  obj.position.set(at.x - (b.min.x + b.max.x) / 2, at.y - b.min.y, at.z - (b.min.z + b.max.z) / 2);
  parent.add(obj);
  return { obj, animations: g.animations };
}

// Công trình trùm: THREE.LOD — gần dùng bản chi tiết (hd nếu máy mạnh), xa dùng bản giản lược.
// Biến đổi tính theo bản gần rồi áp chung cho cả hai (cùng khung bao gốc).
async function placeLod(parent, id, { fit, at, hd = true }) {
  const near = (hd && modelQuality === 'high' && (await loadModel(`${id}.hd`))) || (await loadModel(id));
  if (!near) return null;
  const far = await loadModel(`${id}.lod`);
  const nearObj = near.scene.clone(true);
  const { size } = sizeOf(nearObj);
  const [k, v] = Object.entries(fit)[0];
  const ref = k === 'height' ? size.y : k === 'width' ? size.x : k === 'depth' ? size.z : Math.max(size.x, size.y, size.z);
  const lod = new THREE.LOD();
  lod.addLevel(nearObj, 0);
  if (far) { const farObj = far.scene.clone(true); farObj.traverse((o) => { if (o.isMesh) o.castShadow = false; }); lod.addLevel(farObj, Math.max(v * 4, 80)); }
  lod.scale.setScalar(v / (ref || 1));
  lod.rotation.y = at.ry || 0;
  lod.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(nearObj);
  lod.position.set(at.x - (b.min.x + b.max.x) / 2, at.y - b.min.y, at.z - (b.min.z + b.max.z) / 2);
  parent.add(lod);
  return { obj: lod, animations: [] };
}

/**
 * Nhân bản tức thời: mỗi mesh con của GLB → 1 InstancedMesh (đủ cho nhà, cây lặp hàng chục lần).
 * items: [{ x, y, z, ry, s }] — s = kích thước đích theo `fitKey`.
 */
export async function instanceModel(parent, id, items, { fitKey = 'height' } = {}) {
  const g = await loadModel(id);
  if (!g || !items.length) return null;
  const root = g.scene;
  root.updateMatrixWorld(true);
  const { box, size } = sizeOf(root);
  const ref = fitKey === 'height' ? size.y : fitKey === 'width' ? size.x : Math.max(size.x, size.y, size.z);
  const center = box.getCenter(new THREE.Vector3());
  const group = new THREE.Group();
  const M = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  root.traverse((o) => {
    if (!o.isMesh) return;
    const im = new THREE.InstancedMesh(o.geometry, o.material, items.length);
    im.castShadow = true; im.receiveShadow = true;
    items.forEach((it, i) => {
      const k = it.s / (ref || 1);
      // dời gốc mô hình về (tâm x/z, đáy y), co giãn, xoay, đặt vào thế giới
      base.makeTranslation(-center.x, -box.min.y, -center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
      q.setFromAxisAngle(up, it.ry || 0);
      M.compose(new THREE.Vector3(it.x, it.y, it.z), q, new THREE.Vector3(1, 1, 1)).multiply(base).multiply(o.matrixWorld);
      im.setMatrixAt(i, M);
    });
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
  });
  parent.add(group);
  return group;
}

/**
 * Nhân bản tức thời có 2 mức chi tiết: gần dùng <id>.glb, xa dùng <id>.lod.glb.
 * Trả { group, update(px, pz) } — gọi update định kỳ (landmarks.update) để chia lại gần/xa.
 */
export async function instanceModelLod(parent, id, items, { fitKey = 'height', near = 90 } = {}) {
  const [gN, gF] = await Promise.all([loadModel(id), loadModel(`${id}.lod`)]);
  if (!gN || !items.length) return null;
  const build = (g) => {
    const root = g.scene; root.updateMatrixWorld(true);
    const { box, size } = sizeOf(root);
    const ref = fitKey === 'height' ? size.y : fitKey === 'width' ? size.x : Math.max(size.x, size.y, size.z);
    const center = box.getCenter(new THREE.Vector3());
    const meshes = [];
    root.traverse((o) => {
      if (!o.isMesh) return;
      const im = new THREE.InstancedMesh(o.geometry, o.material, items.length);
      im.castShadow = true; im.receiveShadow = true; im.count = 0; im.frustumCulled = false;
      meshes.push({ im, local: o.matrixWorld.clone() });
    });
    return { meshes, ref, center, minY: box.min.y };
  };
  const N = build(gN), F = gF ? build(gF) : null;
  const group = new THREE.Group();
  for (const m of N.meshes) group.add(m.im);
  if (F) for (const m of F.meshes) group.add(m.im);
  parent.add(group);
  const M = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  const write = (set, list) => {
    for (const { im, local } of set.meshes) {
      list.forEach((it, i) => {
        const k = it.s / (set.ref || 1);
        base.makeTranslation(-set.center.x, -set.minY, -set.center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
        q.setFromAxisAngle(up, it.ry || 0);
        M.compose(P.set(it.x, it.y, it.z), q, one).multiply(base).multiply(local);
        im.setMatrixAt(i, M);
      });
      im.count = list.length; im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
    }
  };
  let lastKey = '';
  const update = (px, pz) => {
    const nearL = [], farL = [];
    for (const it of items) (Math.hypot(it.x - px, it.z - pz) < near || !F ? nearL : farL).push(it);
    const key = nearL.map((it) => items.indexOf(it)).join(',');
    if (key === lastKey) return;
    lastKey = key;
    write(N, nearL); if (F) write(F, farL);
  };
  update(Infinity, Infinity);
  return { group, update };
}
