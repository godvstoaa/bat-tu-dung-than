// ============================================================================
//  HUYỀN GIỚI — rừng: cây sinh thủ tục (trees.js) ba tầng chi tiết.
//    gần  (< near m)  cây đầy đủ, đổ bóng
//    vừa  (< mid m)   cùng hình học, không đổ bóng (máy yếu)
//    xa               «impostor»: chụp chính cây đó thành ảnh trên 2 mặt phẳng chéo
//  Thay cây khối nón / khối cầu flat-shading cũ (trông như đồ chơi, lạc tông cảnh).
//  Mỗi cây có tông màu riêng (instanceColor), tán đung đưa theo gió.
// ============================================================================
import * as THREE from 'three';
import { makePine, makeLeafTree, treeTextures } from './trees.js';

export const FOREST_Q = {
  low: { near: 60, mid: 170, nNear: 60, nMid: 220, imp: 128 },
  mid: { near: 80, mid: 220, nNear: 110, nMid: 380, imp: 192 },
  high: { near: 110, mid: 300, nNear: 180, nMid: 700, imp: 256 },
};
const VARIANTS = 2;
const SPECIES = { pine: { make: makePine, H: 13, seeds: [11, 23] }, leaf: { make: makeLeafTree, H: 10, seeds: [31, 47] } };

// tán: không lật pháp tuyến mặt sau (thẻ lá hai mặt), gió lay theo độ cao + vị trí cây
const windU = { uTime: { value: 0 } };
function foliageMaterial(map) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = windU.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 ip = instanceMatrix[3].xyz;
  float hk = max(0.0, position.y - 2.5) * 0.016;
  transformed.x += sin(uTime * 1.3 + ip.x * 0.11 + position.y * 0.4) * hk;
  transformed.z += cos(uTime * 1.1 + ip.z * 0.13 + position.x * 0.5) * hk * 0.7;
#endif`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nnormal = normalize(vNormal);');
  };
  m.customProgramCacheKey = () => 'foliage-v1';
  return m;
}

// Chụp cây thành ảnh albedo (không ánh sáng — cảnh sẽ chiếu sáng tấm impostor)
function bakeImpostor(renderer, meshes, height, W) {
  const scene = new THREE.Scene();
  let maxR = 0;
  for (const { geo, mat } of meshes) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: mat.map, alphaTest: mat.alphaTest || 0, side: THREE.DoubleSide }));
    scene.add(m);
    geo.computeBoundingBox(); const b = geo.boundingBox;
    maxR = Math.max(maxR, Math.abs(b.min.x), Math.abs(b.max.x), Math.abs(b.min.z), Math.abs(b.max.z));
  }
  const half = Math.max(maxR, height / 4) * 1.04;
  const H = Math.ceil(W * height / (2 * half) / 4) * 4;
  const cam = new THREE.OrthographicCamera(-half, half, height, 0, 0.1, 1000);
  cam.position.set(0, 0, 500); cam.lookAt(0, 0, 0);
  const rt = new THREE.WebGLRenderTarget(W, H);
  rt.texture.generateMipmaps = true; rt.texture.minFilter = THREE.LinearMipmapLinearFilter;
  const prev = { target: renderer.getRenderTarget(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha(), tm: renderer.toneMapping };
  renderer.setRenderTarget(rt); renderer.setClearColor(0x1a2412, 0); renderer.toneMapping = THREE.NoToneMapping;
  renderer.clear(); renderer.render(scene, cam);
  renderer.setRenderTarget(prev.target); renderer.setClearColor(prev.color, prev.alpha); renderer.toneMapping = prev.tm;
  scene.traverse((o) => { if (o.isMesh) o.material.dispose(); });
  // tấm chéo khớp đúng khung chụp (rộng 2·half, cao height)
  const geo = new THREE.BufferGeometry(), w = half;
  const pos = [-w, 0, 0, w, 0, 0, w, height, 0, -w, height, 0, 0, 0, -w, 0, 0, w, 0, height, w, 0, height, -w];
  const uv = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(8).fill([0, 1, 0]).flat(), 3));
  geo.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]);
  return { texture: rt.texture, geo };
}

/**
 * @param lists { pine: [{x,y,z,s,r}], leaf: [...] }
 * @returns { update(px, pz, t), occlusion(px, pz, cx, cz), count }
 */
export function createForest(group, renderer, lists, quality = 'mid') {
  const Q = FOREST_Q[quality] || FOREST_Q.mid;
  const TX = treeTextures();
  const kinds = [];
  for (const [kind, sp] of Object.entries(SPECIES)) {
    const barkMat = new THREE.MeshStandardMaterial({ map: kind === 'pine' ? TX.barkPine : TX.barkLeaf, roughness: 0.95 });
    const folMat = foliageMaterial(kind === 'pine' ? TX.needle : TX.leaf);
    const all = lists[kind] || [];
    for (let v = 0; v < VARIANTS; v++) {
      const T = sp.make(sp.seeds[v]);
      const trees = all.filter((_, i) => i % VARIANTS === v);
      if (!trees.length) continue;
      const nNear = Math.ceil(Q.nNear / (VARIANTS * 2)), nMid = Math.ceil(Q.nMid / (VARIANTS * 2));
      const mk = (geo, mat, n, shadow) => { const im = new THREE.InstancedMesh(geo, mat, n); im.count = 0; im.frustumCulled = false; im.castShadow = shadow; im.receiveShadow = true; im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3).fill(1), 3); group.add(im); return im; };
      const near = [mk(T.bark, barkMat, nNear, true), mk(T.foliage, folMat, nNear, true)];
      const mid = [mk(T.bark, barkMat, nMid, false), mk(T.foliage, folMat, nMid, quality === 'high')];
      const imp = bakeImpostor(renderer, [{ geo: T.bark, mat: barkMat }, { geo: T.foliage, mat: folMat }], T.height, Q.imp);
      const farMat = new THREE.MeshLambertMaterial({ map: imp.texture, alphaTest: 0.45, side: THREE.DoubleSide });
      const far = new THREE.InstancedMesh(imp.geo, farMat, trees.length);
      far.frustumCulled = false; far.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(trees.length * 3).fill(1), 3);
      group.add(far);
      const k0 = sp.H / T.height;
      trees.forEach((t, i) => {
        const h = ((i * 2654435761) >>> 0) % 1000 / 1000, w = ((i * 40503) >>> 0) % 997 / 997, k = 0.8 + h * 0.32;
        t.tint = new THREE.Color(k * (0.92 + w * 0.14), k, k * (0.86 + (1 - w) * 0.1));
        t.k = k0 * t.s;
      });
      kinds.push({ trees, near, mid, far, nNear, nMid, nearList: [] });
    }
  }

  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3(), SC = new THREE.Vector3();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  const mat = (t, s = 1) => M.compose(V.set(t.x, t.y, t.z), q.setFromAxisAngle(up, t.r), SC.setScalar(t.k * s));
  let last = { x: 1e9, z: 1e9 };
  function update(px, pz, time = 0) {
    windU.uTime.value = time;
    if (Math.hypot(px - last.x, pz - last.z) < 12) return;
    last = { x: px, z: pz };
    for (const K of kinds) {
      const cand = [];
      K.trees.forEach((t, i) => { const d = Math.hypot(t.x - px, t.z - pz); if (d < Q.mid) cand.push([d, i]); });
      cand.sort((a, b) => a[0] - b[0]);
      const band = new Uint8Array(K.trees.length);
      let nN = 0, nM = 0; K.nearList.length = 0;
      for (const [d, i] of cand) {
        const t = K.trees[i];
        if (d < Q.near && nN < K.nNear) { band[i] = 1; t.hid = false; mat(t); for (const im of K.near) { im.setMatrixAt(nN, M); im.setColorAt(nN, t.tint); } K.nearList.push(t); nN++; }
        else if (nM < K.nMid) { band[i] = 2; mat(t); for (const im of K.mid) { im.setMatrixAt(nM, M); im.setColorAt(nM, t.tint); } nM++; }
      }
      for (const im of K.near) { im.count = nN; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; }
      for (const im of K.mid) { im.count = nM; im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; }
      K.trees.forEach((t, i) => { if (band[i]) K.far.setMatrixAt(i, hidden); else { mat(t); K.far.setMatrixAt(i, M); } K.far.setColorAt(i, t.tint); });
      K.far.instanceMatrix.needsUpdate = true; K.far.instanceColor.needsUpdate = true;
    }
  }
  // cây gần chắn giữa camera và người chơi → thu nhỏ về 0
  const segDist = (x, z, ax, az, bx, bz) => { const vx = bx - ax, vz = bz - az; const tt = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz || 1))); return Math.hypot(x - ax - vx * tt, z - az - vz * tt); };
  function occlusion(px, pz, cx, cz) {
    for (const K of kinds) {
      let changed = false;
      K.nearList.forEach((t, n) => {
        const block = segDist(t.x, t.z, px, pz, cx, cz) < 4.2 * t.s && Math.hypot(t.x - px, t.z - pz) > 1.5;
        if (block !== !!t.hid) { t.hid = block; mat(t, block ? 0 : 1); for (const im of K.near) im.setMatrixAt(n, M); changed = true; }
      });
      if (changed) for (const im of K.near) im.instanceMatrix.needsUpdate = true;
    }
  }
  return { update, occlusion, count: kinds.reduce((a, K) => a + K.trees.length, 0) };
}
