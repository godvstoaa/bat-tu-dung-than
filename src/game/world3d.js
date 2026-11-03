// ============================================================================
//  HUYỀN GIỚI — dựng thế giới mở trong Three.js (docs/DAI-THE-GIOI-DESIGN.md §C2–C3, §C7).
//  Địa hình chunk 128 m + LOD (64/32/8 ô) + skirt chống nứt, tô màu theo độ cao/độ dốc;
//  trời tán xạ (Sky) + môi trường PMREM cho vật liệu PBR (GLB Meshy); nước phản chiếu
//  có gợn; rừng 2 tầng (cây 3D gần, billboard xa); biển mây quanh rìa.
// ============================================================================
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import * as T from './terrain.js';
import { rng, cloudTex } from './textures.js';
import { platformTop } from './obstacles.js';

const CHUNK = 128;
const N = T.WORLD / CHUNK; // 16 × 16 chunk
export const QUALITY = {
  low: { near: 1, mid: 2, segNear: 32, segMid: 16, segFar: 6, treesNear: 160, bloom: false, shadow: 1024 },
  mid: { near: 1, mid: 3, segNear: 48, segMid: 24, segFar: 8, treesNear: 240, bloom: true, shadow: 1536 },
  high: { near: 2, mid: 4, segNear: 64, segMid: 32, segFar: 8, treesNear: 320, bloom: true, shadow: 2048 },
};

// Sân quán cũ (±16 × ±11.5 m) nằm đúng y = 0 → hạ địa hình 8 cm để không chập với mặt sân lát đá.
const inCourt = (x, z) => Math.abs(x) < 16.4 && Math.abs(z) < 11.8;

const C = {
  grass: new THREE.Color('#5f9a3c'), grass2: new THREE.Color('#8db24a'), dry: new THREE.Color('#b8a862'),
  rock: new THREE.Color('#857a6e'), rock2: new THREE.Color('#5e5650'), snow: new THREE.Color('#f2f6fa'),
  sand: new THREE.Color('#cdb987'), bed: new THREE.Color('#3b5550'), stone: new THREE.Color('#9a8f80'),
};
const tmp = new THREE.Color();
const mixC = new THREE.Color(); // trộn riêng — KHÔNG dùng chung với `out` (lỗi cũ: đè hết thành màu đá)

function colorAt(x, z, h, s, out) {
  if (h < T.WATER - 0.5) return out.copy(C.bed);
  if (h < T.WATER + 1.4) return out.copy(C.sand);
  const v = 0.5 + 0.5 * Math.sin(x * 0.07 + Math.cos(z * 0.05) * 3);
  out.copy(C.grass).lerp(C.grass2, v * 0.6).lerp(C.dry, Math.max(0, Math.min(1, (h - 120) / 140)));
  const rockK = Math.max(0, Math.min(1, (s - 0.55) / 0.4));
  out.lerp(mixC.copy(C.rock).lerp(C.rock2, v), rockK);
  if (h > 290) out.lerp(C.snow, Math.max(0, Math.min(1, (h - 290) / 60)) * (1 - rockK * 0.6));
  // phố Huyền Thành: lát đá quanh quảng trường
  const rr = Math.hypot(x, z);
  if (rr < 150 && h < 2) out.lerp(C.stone, Math.max(0, 1 - Math.max(0, rr - 30) / 120) * 0.55);
  return out;
}

function buildChunkGeometry(cx, cz, seg) {
  const x0 = -T.HALF + cx * CHUNK, z0 = -T.HALF + cz * CHUNK, step = CHUNK / seg;
  const vs = seg + 1;
  const ring = seg * 4; // đỉnh skirt
  const total = vs * vs + ring;
  const pos = new Float32Array(total * 3), col = new Float32Array(total * 3), nor = new Float32Array(total * 3);
  const idx = [];
  // lấy mẫu thêm 1 vòng viền ngoài chunk → pháp tuyến ở mép tính giống hệt chunk bên cạnh (hết đường kẻ)
  const W = vs + 2;
  const H = new Float32Array(W * W);
  for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
    const x = x0 + (i - 1) * step, z = z0 + (j - 1) * step;
    let h = T.heightAt(x, z);
    if (inCourt(x, z)) h -= 0.08;
    H[j * W + i] = h;
  }
  const hAt = (i, j) => H[(j + 1) * W + (i + 1)];
  for (let j = 0; j < vs; j++) for (let i = 0; i < vs; i++) {
    const k = (j * vs + i) * 3;
    const h = hAt(i, j);
    pos[k] = x0 + i * step; pos[k + 1] = h; pos[k + 2] = z0 + j * step;
    const dx = (hAt(i + 1, j) - hAt(i - 1, j)) / (2 * step), dz = (hAt(i, j + 1) - hAt(i, j - 1)) / (2 * step);
    const n = Math.hypot(dx, 1, dz);
    nor[k] = -dx / n; nor[k + 1] = 1 / n; nor[k + 2] = -dz / n;
    colorAt(pos[k], pos[k + 2], h, Math.hypot(dx, dz), tmp);
    col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b;
  }
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) {
    const a = j * vs + i, b = a + 1, c = a + vs, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  // skirt: viền thả xuống 10 m che kẽ hở giữa chunk khác LOD
  const border = [];
  for (let i = 0; i < seg; i++) border.push(i);
  for (let j = 0; j < seg; j++) border.push(j * vs + seg);
  for (let i = seg; i > 0; i--) border.push(seg * vs + i);
  for (let j = seg; j > 0; j--) border.push(j * vs);
  const base = vs * vs;
  border.forEach((v, n) => {
    const k = (base + n) * 3;
    for (let c = 0; c < 3; c++) { pos[k + c] = pos[v * 3 + c]; col[k + c] = col[v * 3 + c]; nor[k + c] = nor[v * 3 + c]; }
    pos[k + 1] -= 10;
  });
  for (let n = 0; n < border.length; n++) {
    const a = border[n], b = border[(n + 1) % border.length], a2 = base + n, b2 = base + ((n + 1) % border.length);
    idx.push(a, b, a2, b, b2, a2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

// Texture chi tiết (hạt đất / cỏ) — nhân với màu đỉnh
function detailTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); const r = rng(5);
  g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) { const v = 150 + r() * 105 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Gợn nước: normal map sinh bằng canvas
function waterNormals() {
  const S = 256; const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'); const img = g.createImageData(S, S); const r = rng(9);
  const waves = Array.from({ length: 10 }, () => ({ kx: (r() - 0.5) * 0.4, kz: (r() - 0.5) * 0.4, p: r() * 6 }));
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let dx = 0, dz = 0;
    for (const w of waves) { const ph = (x * w.kx + y * w.kz) * Math.PI * 2 / 6.4 * 4 + w.p; dx += Math.cos(ph) * w.kx; dz += Math.cos(ph) * w.kz; }
    const k = (y * S + x) * 4;
    img.data[k] = 128 + dx * 160; img.data[k + 1] = 128 + dz * 160; img.data[k + 2] = 255; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Billboard cây (2 mặt phẳng chéo) — canvas có alpha
function treeCard(kind) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#4a3020'; g.fillRect(58, 170, 12, 86);
  if (kind === 'pine') {
    g.fillStyle = '#25462f';
    for (let k = 0; k < 4; k++) { const y = 30 + k * 42, w = 26 + k * 14; g.beginPath(); g.moveTo(64, y - 30); g.lineTo(64 - w, y + 34); g.lineTo(64 + w, y + 34); g.closePath(); g.fill(); }
  } else {
    for (const [x, y, rr, col] of [[64, 110, 52, '#3f6b33'], [40, 130, 34, '#4c7a3a'], [88, 128, 36, '#36602e'], [64, 70, 38, '#4f7f3c']]) { g.fillStyle = col; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill(); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function crossGeo(w, h) {
  const a = new THREE.PlaneGeometry(w, h); a.translate(0, h / 2, 0);
  const b = a.clone(); b.rotateY(Math.PI / 2);
  const g = new THREE.BufferGeometry();
  const merge = (geos) => { const pos = [], uv = [], nor = [], idx = []; let off = 0; for (const x of geos) { pos.push(...x.attributes.position.array); uv.push(...x.attributes.uv.array); nor.push(...x.attributes.normal.array); for (const i of x.index.array) idx.push(i + off); off += x.attributes.position.count; } g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx); };
  merge([a, b]);
  return g;
}
function pineGeo() {
  const parts = [new THREE.CylinderGeometry(0.35, 0.6, 6, 6).translate(0, 3, 0)];
  [[5.5, 5, 5], [4.4, 4.4, 8], [3.2, 3.8, 10.6], [1.9, 3.2, 12.8]].forEach(([r, h, y]) => parts.push(new THREE.ConeGeometry(r, h, 7).translate(0, y, 0)));
  return mergeSimple(parts);
}
function leafGeo() {
  const parts = [new THREE.CylinderGeometry(0.3, 0.5, 5, 6).translate(0, 2.5, 0)];
  [[0, 7, 0, 3.6], [2.2, 6, 0.8, 2.6], [-2, 6.2, -0.6, 2.7], [0.4, 8.6, -0.4, 2.4]].forEach(([x, y, z, r]) => parts.push(new THREE.IcosahedronGeometry(r, 0).translate(x, y, z)));
  return mergeSimple(parts);
}
function mergeSimple(geos) {
  const pos = [], nor = []; const col = [];
  geos.forEach((g0, n) => {
    const g = g0.index ? g0.toNonIndexed() : g0; g.computeVertexNormals();
    pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array);
    const cc = n === 0 ? [0.29, 0.19, 0.12] : [1, 1, 1];
    for (let i = 0; i < g.attributes.position.count; i++) col.push(...cc);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return g;
}

export function createWorld(scene, renderer, { quality = 'mid' } = {}) {
  const Q = QUALITY[quality] || QUALITY.mid;
  const group = new THREE.Group(); scene.add(group);

  // --- trời tán xạ + môi trường PMREM
  const sky = new Sky(); sky.scale.setScalar(20000); scene.add(sky);
  const su = sky.material.uniforms;
  su.turbidity.value = 6; su.rayleigh.value = 1.6; su.mieCoefficient.value = 0.005; su.mieDirectionalG.value = 0.82;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene(); const envSky = new Sky(); envSky.scale.setScalar(1000); envScene.add(envSky);
  let envRT = null, lastEnvSun = new THREE.Vector3(9, 9, 9);
  function setSun(dir) {
    su.sunPosition.value.copy(dir);
    if (dir.distanceTo(lastEnvSun) > 0.08) {
      envSky.material.uniforms.sunPosition.value.copy(dir);
      Object.assign(envSky.material.uniforms, { turbidity: su.turbidity, rayleigh: su.rayleigh, mieCoefficient: su.mieCoefficient, mieDirectionalG: su.mieDirectionalG });
      envRT?.dispose(); envRT = pmrem.fromScene(envScene, 0.02); scene.environment = envRT.texture; lastEnvSun.copy(dir);
    }
  }

  // --- địa hình
  const terrainMat = new THREE.MeshStandardMaterial({ vertexColors: true, map: detailTex(), roughness: 0.96, metalness: 0 });
  terrainMat.map.repeat.set(CHUNK / 6, CHUNK / 6);
  // UV theo toạ độ thế giới cho texture chi tiết
  terrainMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\n vMapUv = (mapTransform * vec3(position.xz / 128.0, 1.0)).xy;\n#endif');
  };
  const chunks = new Map(); // key → { mesh, seg }
  const queue = [];
  const keyOf = (cx, cz) => cx * 100 + cz;
  function wantSeg(cx, cz, pcx, pcz) {
    const d = Math.max(Math.abs(cx - pcx), Math.abs(cz - pcz));
    return d <= Q.near ? Q.segNear : d <= Q.mid ? Q.segMid : Q.segFar;
  }
  let pcx = -1, pcz = -1;
  function updateChunks(px, pz) {
    const cx = Math.floor((px + T.HALF) / CHUNK), cz = Math.floor((pz + T.HALF) / CHUNK);
    if (cx === pcx && cz === pcz && !queue.length) return;
    if (cx !== pcx || cz !== pcz) {
      pcx = cx; pcz = cz; queue.length = 0;
      const all = [];
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const seg = wantSeg(i, j, cx, cz);
        const have = chunks.get(keyOf(i, j));
        if (!have || have.seg !== seg) all.push({ i, j, seg, d: Math.max(Math.abs(i - cx), Math.abs(j - cz)) });
      }
      all.sort((a, b) => a.d - b.d);
      queue.push(...all);
    }
  }
  function buildSome(budgetMs = 6) {
    const t0 = performance.now();
    while (queue.length && performance.now() - t0 < budgetMs) {
      const { i, j, seg } = queue.shift();
      const geo = buildChunkGeometry(i, j, seg);
      const k = keyOf(i, j);
      const old = chunks.get(k);
      if (old) { old.mesh.geometry.dispose(); old.mesh.geometry = geo; old.seg = seg; old.mesh.castShadow = seg >= Q.segMid; }
      else {
        const m = new THREE.Mesh(geo, terrainMat); m.receiveShadow = true; m.castShadow = seg >= Q.segMid; m.userData.terrain = true;
        group.add(m); chunks.set(k, { mesh: m, seg });
      }
    }
  }
  // khởi tạo: toàn bộ ở mức xa (nhanh), rồi nâng dần quanh người chơi
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const m = new THREE.Mesh(buildChunkGeometry(i, j, Q.segFar), terrainMat); m.receiveShadow = true; m.userData.terrain = true; group.add(m); chunks.set(keyOf(i, j), { mesh: m, seg: Q.segFar }); }

  // --- nước (hồ, sông) — một mặt phẳng lớn ở mực nước
  const wn = waterNormals(); wn.repeat.set(160, 160);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(T.WORLD * 1.1, T.WORLD * 1.1), new THREE.MeshStandardMaterial({ color: '#1f5a66', roughness: 0.06, metalness: 0.15, normalMap: wn, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.86 }));
  water.rotation.x = -Math.PI / 2; water.position.y = T.WATER; water.receiveShadow = true; group.add(water);

  // --- biển mây quanh rìa
  const clouds = new THREE.Group(); group.add(clouds);
  const cMat = new THREE.MeshBasicMaterial({ map: cloudTex(), transparent: true, opacity: 0.9, depthWrite: false, fog: true });
  const cr = rng(31);
  for (let i = 0; i < 70; i++) {
    const a = cr() * Math.PI * 2, d = 900 + cr() * 900;
    const c = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), cMat);
    c.position.set(Math.cos(a) * d, T.CLOUD_SEA + 10 + cr() * 25, Math.sin(a) * d); c.rotation.x = -Math.PI / 2; c.rotation.z = cr() * 6;
    c.scale.setScalar(260 + cr() * 260); c.userData.v = 2 + cr() * 3; clouds.add(c);
  }

  // --- rừng: vị trí từ treeDensity, 2 loài
  const trees = { pine: [], leaf: [] };
  const tr = rng(17);
  for (let x = -T.EDGE; x < T.EDGE; x += 11) for (let z = -T.EDGE; z < T.EDGE; z += 11) {
    const px = x + (tr() - 0.5) * 9, pz = z + (tr() - 0.5) * 9;
    const dn = T.treeDensity(px, pz);
    if (tr() > dn * 0.75) continue;
    const h = T.heightAt(px, pz);
    (h > 140 || tr() < 0.35 ? trees.pine : trees.leaf).push({ x: px, y: h - 0.3, z: pz, s: 0.75 + tr() * 0.7, r: tr() * 6.28 });
  }
  const mk = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const far = {}, near = {};
  for (const kind of ['pine', 'leaf']) {
    const list = trees[kind];
    const fm = new THREE.InstancedMesh(crossGeo(kind === 'pine' ? 11 : 12, kind === 'pine' ? 16 : 11), new THREE.MeshLambertMaterial({ map: treeCard(kind), alphaTest: 0.5, side: THREE.DoubleSide }), list.length);
    list.forEach((t, i) => { q.setFromAxisAngle(up, t.r); sc.setScalar(t.s); ps.set(t.x, t.y, t.z); mk.compose(ps, q, sc); fm.setMatrixAt(i, mk); });
    fm.instanceMatrix.needsUpdate = true; fm.frustumCulled = false; group.add(fm); far[kind] = fm;
    const nm = new THREE.InstancedMesh(kind === 'pine' ? pineGeo() : leafGeo(), new THREE.MeshStandardMaterial({ vertexColors: true, color: kind === 'pine' ? '#2c5a3a' : '#4d7d3a', roughness: 0.85, flatShading: true }), Q.treesNear);
    nm.castShadow = true; nm.receiveShadow = true; nm.count = 0; nm.frustumCulled = false; group.add(nm); near[kind] = nm;
  }
  let lastTreeAt = new THREE.Vector3(1e9, 0, 0);
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  function updateTrees(px, pz) {
    if (Math.hypot(px - lastTreeAt.x, pz - lastTreeAt.z) < 30) return;
    lastTreeAt.set(px, 0, pz);
    const R = 170;
    for (const kind of ['pine', 'leaf']) {
      const list = trees[kind]; let n = 0;
      list.forEach((t, i) => {
        const close = Math.hypot(t.x - px, t.z - pz) < R && n < Q.treesNear;
        q.setFromAxisAngle(up, t.r); sc.setScalar(t.s); ps.set(t.x, t.y, t.z); mk.compose(ps, q, sc);
        if (close) { nearList[kind][n] = t; t.hid = false; near[kind].setMatrixAt(n++, mk); far[kind].setMatrixAt(i, hidden); } else far[kind].setMatrixAt(i, mk);
      });
      nearList[kind].length = n; near[kind].count = n; near[kind].instanceMatrix.needsUpdate = true; far[kind].instanceMatrix.needsUpdate = true;
    }
  }

  // Mặt đất dưới chân (sân quán ở y = 0, ngoài sân theo địa hình)
  const groundY = (x, z) => { if (inCourt(x, z)) return 0; const p = platformTop(x, z); return Math.max(T.heightAt(x, z), T.WATER - 1.2, p ?? -1e9); };

  // Cây chắn giữa camera và người chơi: thu nhỏ về 0 (xét cây gần, rẻ: ≤ vài trăm cây)
  const nearList = { pine: [], leaf: [] };
  const segDist = (px, pz, ax, az, bx, bz) => { const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz || 1))); return Math.hypot(px - ax - vx * t, pz - az - vz * t); };
  function occlusion(px, pz, cx, cz) {
    for (const kind of ['pine', 'leaf']) {
      const nm = near[kind]; let changed = false;
      nearList[kind].forEach((tt, i) => {
        const block = segDist(tt.x, tt.z, px, pz, cx, cz) < 5.5 * tt.s && Math.hypot(tt.x - px, tt.z - pz) > 1.5;
        if (block !== !!tt.hid) { tt.hid = block; q.setFromAxisAngle(up, tt.r); sc.setScalar(block ? 0 : tt.s); ps.set(tt.x, tt.y, tt.z); mk.compose(ps, q, sc); nm.setMatrixAt(i, mk); changed = true; }
      });
      if (changed) nm.instanceMatrix.needsUpdate = true;
    }
  }

  return {
    sky, water, group, clouds, groundY, setSun, occlusion, treeCount: trees.pine.length + trees.leaf.length,
    terrainMeshes: () => [...chunks.values()].map((c) => c.mesh),
    update(px, pz, dt, t) {
      updateChunks(px, pz); buildSome(); updateTrees(px, pz);
      wn.offset.x = (t * 0.004) % 1; wn.offset.y = (t * 0.0027) % 1;
      for (const c of clouds.children) { c.position.x += c.userData.v * dt; if (c.position.x > 1900) c.position.x = -1900; }
    },
    get pending() { return queue.length; },
  };
}
