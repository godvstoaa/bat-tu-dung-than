// ============================================================================
//  HUYỀN GIỚI — cỏ thật quanh người chơi (thay «thảm xanh» phẳng).
//  • Hàng chục nghìn khóm cỏ, mỗi khóm 3–5 ngọn cong, vuốt nhọn, gốc tối ngọn sáng.
//  • Vị trí xoay vòng (toroidal) theo người chơi: khóm đứng yên trong thế giới, chỉ «quấn» ở rìa
//    bán kính (nơi đã thu nhỏ về 0) → không có cảnh cỏ trượt theo chân.
//  • Độ cao + mật độ + độ khô đọc từ một trường nướng sẵn trên CPU (cuốn chiếu vài hàng/khung),
//    nên cỏ không mọc trên đường, sân lát, nước, đá dốc, dưới chân công trình.
//  • Gió hai tần số + cơn giật; cỏ rạp quanh chân người chơi.
// ============================================================================
import * as THREE from 'three';
import { rng } from './textures.js';

export const GRASS_Q = {
  low: { n: 7000, blades: 4, r: 22, res: 72 },
  mid: { n: 16000, blades: 5, r: 30, res: 96 },
  high: { n: 28000, blades: 6, r: 38, res: 120 },
};
const SEG = 3;          // đốt mỗi ngọn
const MARGIN = 14;      // trường nướng rộng hơn bán kính cỏ để kịp nướng lại khi đi

function tuftGeometry(blades) {
  const pos = [], bl = [], idx = [];
  const r = rng(404);
  for (let b = 0; b < blades; b++) {
    const ang = (b / blades) * Math.PI * 2 + r() * 1.2, off = 0.04 + r() * 0.2, hk = r(), lean = 0.25 + r() * 0.75;
    const base = pos.length / 3;
    for (let s = 0; s < SEG; s++) {
      const y = s / SEG;
      pos.push(-0.5, y, 0, 0.5, y, 0);
      bl.push(ang, off, hk, lean, ang, off, hk, lean);
    }
    pos.push(0, 1, 0); bl.push(ang, off, hk, lean);
    for (let s = 0; s < SEG - 1; s++) { const a = base + s * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const a = base + (SEG - 1) * 2; idx.push(a, a + 1, a + 2);
  }
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aBlade', new THREE.Float32BufferAttribute(bl, 4));
  g.setIndex(idx);
  return g;
}

/**
 * @param scene
 * @param {object} o
 * @param {'low'|'mid'|'high'} o.quality
 * @param {(x:number, z:number) => [number, number, number]} o.sample  → [độ cao, mật độ 0..1, độ khô 0..1]
 * @param {() => number} [o.version]  đổi giá trị khi chướng ngại thay đổi (mô hình vừa nạp) → nướng lại
 */
export function createGrass(scene, { quality = 'mid', sample, version = () => 0 }) {
  const Q = GRASS_Q[quality] || GRASS_Q.mid;
  const AREA = Q.r * 2, SIZE = 2 * (Q.r + MARGIN), RES = Q.res;
  const geo = tuftGeometry(Q.blades);
  const inst = new Float32Array(Q.n * 4), r = rng(909);
  const side = Math.ceil(Math.sqrt(Q.n)), cell = AREA / side;
  for (let i = 0; i < Q.n; i++) {
    const gx = i % side, gz = (i / side) | 0;
    inst[i * 4] = (gx + r()) * cell; inst[i * 4 + 1] = (gz + r()) * cell; inst[i * 4 + 2] = r(); inst[i * 4 + 3] = r();
  }
  // xáo thứ tự khóm → cắt bớt instanceCount (máy yếu) vẫn phủ đều cả vùng
  for (let i = Q.n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); for (let c = 0; c < 4; c++) { const t = inst[i * 4 + c]; inst[i * 4 + c] = inst[j * 4 + c]; inst[j * 4 + c] = t; } }
  geo.setAttribute('aInst', new THREE.InstancedBufferAttribute(inst, 4));
  geo.instanceCount = Q.n;

  const field = new THREE.DataTexture(new Float32Array(RES * RES * 4), RES, RES, THREE.RGBAFormat, THREE.FloatType);
  field.minFilter = field.magFilter = THREE.NearestFilter; field.needsUpdate = true;

  const U = {
    uField: { value: field }, uFieldOrigin: { value: new THREE.Vector2(1e6, 1e6) }, uFieldSize: { value: SIZE }, uRes: { value: RES },
    uCenter: { value: new THREE.Vector3() }, uPlayer: { value: new THREE.Vector3(1e6, 0, 1e6) },
    uTime: { value: 0 }, uRadius: { value: Q.r }, uArea: { value: AREA }, uReady: { value: 0 },
  };
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.82, metalness: 0, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
uniform highp sampler2D uField; uniform vec2 uFieldOrigin; uniform float uFieldSize; uniform float uRes;
uniform vec3 uCenter; uniform vec3 uPlayer; uniform float uTime; uniform float uRadius; uniform float uArea; uniform float uReady;
attribute vec4 aInst; attribute vec4 aBlade;
varying vec3 vGCol; varying float vGY;
vec3 gPos;
vec4 gField(vec2 w) {
  vec2 f = (w - uFieldOrigin) / uFieldSize * uRes - 0.5;
  ivec2 i = ivec2(floor(f)); vec2 t = fract(f); ivec2 m = ivec2(int(uRes) - 1);
  vec4 a = texelFetch(uField, clamp(i, ivec2(0), m), 0), b = texelFetch(uField, clamp(i + ivec2(1, 0), ivec2(0), m), 0);
  vec4 c = texelFetch(uField, clamp(i + ivec2(0, 1), ivec2(0), m), 0), d = texelFetch(uField, clamp(i + ivec2(1, 1), ivec2(0), m), 0);
  vec4 v = mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
  vec2 q = (w - uFieldOrigin) / uFieldSize;
  if (q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) v.g = 0.0;
  return v;
}`)
      .replace('#include <beginnormal_vertex>', `
vec2 rel = mod(aInst.xy - uCenter.xz + 0.5 * uArea, uArea) - 0.5 * uArea;
vec2 root = uCenter.xz + rel;
vec4 F = gField(root);
float keep = step(aInst.z, F.g) * uReady;
float sc = keep * smoothstep(uRadius, uRadius * 0.7, length(rel)) * smoothstep(0.8, 2.6, distance(root, cameraPosition.xz) + max(0.0, cameraPosition.y - F.r - 1.5));
float ang = aBlade.x + aInst.w * 6.2831;
vec2 dir = vec2(cos(ang), sin(ang)), sd = vec2(-dir.y, dir.x);
float H = (0.22 + 0.42 * aBlade.z) * (0.6 + 0.55 * F.g) * mix(1.0, 0.7, F.b) * (0.75 + 0.5 * fract(aInst.w * 7.13)) * sc;
float y = position.y;
float wdt = position.x * (0.034 + 0.018 * aBlade.z) * (1.0 - y * 0.92) * sc;
float wind = sin(uTime * 1.7 + root.x * 0.23 + root.y * 0.17) * 0.55 + sin(uTime * 2.9 + root.x * 0.71 - root.y * 0.45) * 0.22;
float gust = 0.55 + 0.45 * sin(uTime * 0.37 + root.x * 0.021 + root.y * 0.013);
vec2 wv = vec2(0.82, 0.48) * wind * gust * 0.32;
vec2 away = root - uPlayer.xz; float pd = length(away);
float tr = smoothstep(1.0, 0.15, pd) * step(abs(uPlayer.y - F.r), 1.5);
vec2 push = (pd > 0.001 ? away / pd : vec2(0.0)) * tr * 1.1;
vec2 bendv = dir * aBlade.w * 0.38 + wv + push;
float k2 = y * y;
vec2 xz = root + dir * aBlade.y * sc + sd * wdt + bendv * k2 * H;
gPos = vec3(xz.x, F.r - 0.04 + y * H * (1.0 - 0.45 * tr) - dot(bendv, bendv) * k2 * H * 0.18, xz.y);
vec3 objectNormal = normalize(vec3(dir.x * 0.35, 1.0, dir.y * 0.35) + vec3(bendv.x, 0.0, bendv.y) * 0.3);
float rr = fract(aInst.w * 13.7);
vec3 lush = mix(vec3(0.045, 0.085, 0.018), vec3(0.085, 0.13, 0.03), rr);
vec3 dryc = vec3(0.24, 0.2, 0.075);
vec3 tip = mix(lush, dryc, clamp(F.b + (fract(aInst.w * 31.1) > 0.93 ? 0.6 : 0.0), 0.0, 1.0));
if (aInst.w > 0.985 && aBlade.z > 0.6) tip = aInst.z < 0.33 ? vec3(0.8, 0.78, 0.7) : aInst.z < 0.66 ? vec3(0.8, 0.55, 0.05) : vec3(0.35, 0.2, 0.55);
vGCol = mix(tip * 0.45, tip, smoothstep(0.0, 0.9, y));
vGY = y;`)
      .replace('#include <begin_vertex>', 'vec3 transformed = gPos;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGCol; varying float vGY;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= vGCol;')
      .replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nnormal = normalize(vNormal);');
  };
  mat.customProgramCacheKey = () => 'grass-v2';
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.castShadow = false; mesh.renderOrder = 1;
  scene.add(mesh);

  // --- nướng trường (cuốn chiếu để không giật khung hình)
  let bake = null, bakedAt = null, bakedVer = -1;
  const buf = new Float32Array(RES * RES * 4);
  function start(cx, cz) {
    bake = { ox: cx - SIZE / 2, oz: cz - SIZE / 2, row: 0, ver: version() };
  }
  function step(budgetMs) {
    const t0 = performance.now(), st = SIZE / RES;
    while (bake && bake.row < RES && performance.now() - t0 < budgetMs) {
      const j = bake.row++, z = bake.oz + (j + 0.5) * st;
      for (let i = 0; i < RES; i++) {
        const v = sample(bake.ox + (i + 0.5) * st, z), k = (j * RES + i) * 4;
        buf[k] = v[0]; buf[k + 1] = v[1]; buf[k + 2] = v[2]; buf[k + 3] = 1;
      }
    }
    if (bake && bake.row >= RES) {
      field.image.data.set(buf); field.needsUpdate = true;
      U.uFieldOrigin.value.set(bake.ox, bake.oz); U.uReady.value = 1;
      bakedAt = { x: bake.ox + SIZE / 2, z: bake.oz + SIZE / 2 }; bakedVer = bake.ver; bake = null;
    }
  }
  let lastVerCheck = 0;
  return {
    mesh,
    update(px, py, pz, t, { visible = true } = {}) {
      mesh.visible = visible;
      U.uTime.value = t; U.uCenter.value.set(px, 0, pz); U.uPlayer.value.set(px, py, pz);
      const now = performance.now();
      const far = !bakedAt || Math.hypot(px - bakedAt.x, pz - bakedAt.z) > MARGIN * 0.6;
      let stale = false;
      if (now - lastVerCheck > 1000) { lastVerCheck = now; stale = version() !== bakedVer; }
      if ((far || stale) && !bake) start(px, pz);
      if (bake) step(bakedAt ? 3 : 5);
    },
    setDensity(k) { geo.instanceCount = Math.max(0, Math.round(Q.n * Math.min(1, k))); },
    dispose() { scene.remove(mesh); geo.dispose(); mat.dispose(); field.dispose(); },
  };
}
