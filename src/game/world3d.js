// ============================================================================
//  HUYỀN GIỚI — dựng thế giới mở trong Three.js (docs/DAI-THE-GIOI-DESIGN.md §C2–C3, §C7).
//  Địa hình chunk 128 m + LOD (64/32/8 ô) + skirt chống nứt, tô màu theo độ cao/độ dốc;
//  trời tán xạ (Sky) + môi trường PMREM cho vật liệu PBR (GLB Meshy); nước phản chiếu
//  có gợn; rừng 2 tầng (cây 3D gần, billboard xa); biển mây quanh rìa.
// ============================================================================
import * as THREE from 'three';
import { span } from './perf.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import * as T from './terrain.js';
import { rng, cloudTex } from './textures.js';
import { platformTop, blockedByBuilding, solidCount } from './obstacles.js';
import { inCourt } from './court.js';
import { layersTexture, placeholderArray, waterNormalTexture } from './ground-tex.js';
import { gen } from './gen.js';
import { CHUNK, CHUNKS as N, groundAt, ROAD_RES } from './terrain-mesh.js';
import { roadField, makeRoadSampler, FIELD_RANGE } from './roads.js';
import { createGrass } from './grass.js';
import { createForest } from './forest.js';
import { tick as waterTick, waveGLSL, SHARED_UNIFORMS } from './water3d.js';

export const QUALITY = {
  // chunk 256 m (terrain-mesh.CHUNK): near 1 = 3×3 chunk quanh người chơi
  low: { near: 1, mid: 2, segNear: 48, segMid: 16, segFar: 6, treesNear: 160, bloom: false, shadow: 1024 },
  mid: { near: 1, mid: 2, segNear: 72, segMid: 24, segFar: 8, treesNear: 240, bloom: false, shadow: 1536 }, // bloom = 2 lượt toàn màn: máy tích hợp không gánh nổi
  high: { near: 1, mid: 2, segNear: 96, segMid: 32, segFar: 8, treesNear: 280, bloom: true, shadow: 2048 },
};

const PATCH = 400, PATCH_SEG = 128; // ô sóng bám camera (m, số ô)
const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Lưới chunk do Worker tính (terrain-mesh.js › chunkData) → BufferGeometry (rẻ, chỉ gói mảng)
function geomFrom(d) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(d.pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(d.nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(d.col, 3));
  g.setAttribute('aSplat', new THREE.BufferAttribute(d.spl, 4));
  g.setIndex(new THREE.BufferAttribute(d.idx, 1));
  g.computeBoundingSphere();
  g.userData.relief = d.relief;
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
  // kết cấu mặt đất: bản tạm 4×4 (cùng kiểu → không biên dịch lại shader), Worker sinh bản thật
  const TU = {
    uAlb: { value: placeholderArray(4, [[78, 98, 46], [118, 96, 70], [130, 124, 114], [140, 132, 118]], true) },
    uNrm: { value: placeholderArray(4, [[128, 128, 255]], false) },
  };
  const groundP = gen('ground', quality === 'low' ? 256 : 512).then((d) => {
    const old = [TU.uAlb.value, TU.uNrm.value];
    TU.uAlb.value = layersTexture(d.alb, d.S, d.n, true); TU.uNrm.value = layersTexture(d.nrm, d.S, d.n, false);
    old.forEach((t) => t.dispose());
  });
  const RF = roadField(ROAD_RES);
  const roadTex = new THREE.DataTexture(RF.data, RF.res, RF.res, THREE.RedFormat, THREE.UnsignedByteType);
  roadTex.magFilter = THREE.LinearFilter; roadTex.minFilter = THREE.LinearFilter; roadTex.needsUpdate = true;
  const roadAt = makeRoadSampler(RF);
  const terrainMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
  terrainMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, TU, { uRoad: { value: roadTex }, uWorld: { value: T.WORLD } });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aSplat;\nvarying vec4 vSplat;\nvarying vec3 vWP;\nvarying vec3 vWN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSplat = aSplat;\nvWP = (modelMatrix * vec4(position, 1.0)).xyz;\nvWN = normalize(mat3(modelMatrix) * normal);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform highp sampler2DArray uAlb; uniform highp sampler2DArray uNrm; uniform sampler2D uRoad; uniform float uWorld;
varying vec4 vSplat; varying vec3 vWP; varying vec3 vWN;
vec3 gTN = vec3(0.0, 0.0, 1.0);`)
      .replace('#include <map_fragment>', `
{
  vec2 wp = vWP.xz;
  vec2 uA = wp / 3.2;
  vec2 uB = vec2(wp.x * 0.7071 - wp.y * 0.7071, wp.x * 0.7071 + wp.y * 0.7071) / 13.0;
  vec2 dAx = dFdx(uA), dAy = dFdy(uA), dBx = dFdx(uB), dBy = dFdy(uB);
  float far = smoothstep(55.0, 150.0, length(vWP - cameraPosition));
  vec2 uM = wp / 61.0;
  float macro = textureGrad(uAlb, vec3(uM, 1.0), dFdx(uM), dFdy(uM)).a;
  float s = (0.5 - texture(uRoad, (wp + 0.5 * uWorld) / uWorld).r) * ${FIELD_RANGE.toFixed(1)} + (macro - 0.5) * 1.8;
  float wRoad = smoothstep(0.35, -0.35, s);
  float wVerge = smoothstep(2.4, 0.1, s) * (1.0 - wRoad);
  float w[4];
  float wBank = 1.0 - smoothstep(${(T.WATER + 1.2).toFixed(2)}, ${(T.WATER + 3.8).toFixed(2)}, vWP.y + (macro - 0.5) * 1.2);
  w[0] = vSplat.x * (1.0 - wRoad) * (1.0 - wVerge * 0.8) * (1.0 - wBank); w[1] = vSplat.y + wVerge * 1.3 + wBank * 1.6; w[2] = vSplat.z * (1.0 - wBank * 0.7); w[3] = wRoad * 2.0;
  vec4 c[4]; vec3 n[4]; float hmax = -9.0;
  for (int i = 0; i < 4; i++) {
    c[i] = vec4(0.0); n[i] = vec3(0.0, 0.0, 1.0);
    if (w[i] > 0.003 && i == 2) {
      vec3 bw = pow(abs(normalize(vWN)), vec3(4.0)); bw /= (bw.x + bw.y + bw.z);
      vec2 pzy = vWP.zy / 4.5, pxy = vWP.xy / 4.5, pxz = wp / 4.5;
      vec2 qzy = vec2(vWP.z * 0.8 + vWP.y * 0.6, vWP.y * 0.8 - vWP.z * 0.6) / 17.0, qxy = vec2(vWP.x * 0.8 + vWP.y * 0.6, vWP.y * 0.8 - vWP.x * 0.6) / 17.0, qxz = uB * 0.76;
      vec4 tx = mix(textureGrad(uAlb, vec3(pzy, 2.0), dFdx(pzy), dFdy(pzy)), textureGrad(uAlb, vec3(qzy, 2.0), dFdx(qzy), dFdy(qzy)), 0.4);
      vec4 ty = mix(textureGrad(uAlb, vec3(pxz, 2.0), dFdx(pxz), dFdy(pxz)), textureGrad(uAlb, vec3(qxz, 2.0), dFdx(qxz), dFdy(qxz)), 0.45);
      vec4 tz = mix(textureGrad(uAlb, vec3(pxy, 2.0), dFdx(pxy), dFdy(pxy)), textureGrad(uAlb, vec3(qxy, 2.0), dFdx(qxy), dFdy(qxy)), 0.4);
      c[i] = tx * bw.x + ty * bw.y + tz * bw.z;
      n[i] = vec3(0.0, 0.0, 1.0);
      hmax = max(hmax, c[i].a + w[i]);
    } else if (w[i] > 0.003) {
      vec4 a = textureGrad(uAlb, vec3(uA, float(i)), dAx, dAy), b = textureGrad(uAlb, vec3(uB, float(i)), dBx, dBy);
      c[i] = vec4(mix(mix(a.rgb, b.rgb, 0.35), b.rgb, far), mix(max(a.a, b.a * 0.9), b.a, far));
      n[i] = textureGrad(uNrm, vec3(uA, float(i)), dAx, dAy).xyz * 2.0 - 1.0;
      hmax = max(hmax, c[i].a + w[i]);
    }
  }
  vec3 alb = vec3(0.0), tn = vec3(0.0); float bs = 0.0;
  for (int i = 0; i < 4; i++) {
    float b = w[i] > 0.003 ? max(c[i].a + w[i] - (hmax - 0.28), 0.0) : 0.0;
    alb += c[i].rgb * b; tn += n[i] * b; bs += b;
  }
  alb /= max(bs, 1e-4); tn = normalize(tn / max(bs, 1e-4));
  float snow = vSplat.w;
  alb = mix(alb, vec3(0.92, 0.94, 0.97) * (0.86 + 0.14 * c[2].a), snow);
  tn.xy *= mix(1.0, 0.35, snow) * (1.0 - far * 0.6);
  gTN = normalize(tn);
  diffuseColor.rgb *= alb;
}`)
      .replace('#include <normal_fragment_maps>', `
{
  vec3 Tv = normalize((viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
  vec3 Bv = normalize((viewMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
  Tv = normalize(Tv - normal * dot(normal, Tv));
  Bv = normalize(Bv - normal * dot(normal, Bv) - Tv * dot(Tv, Bv));
  normal = normalize(Tv * gTN.x + Bv * gTN.y + normal * gTN.z);
}`);
  };
  terrainMat.customProgramCacheKey = () => 'terrain-splat-v4';

  // Cỏ thật: mật độ suy từ cùng trọng số lớp như shader (cỏ chỉ mọc nơi lớp cỏ thắng thế)
  const GB = new Float32Array(7);
  const grassSample = (x, z) => {
    let h = T.heightAt(x, z);
    if (inCourt(x, z) || h < T.WATER + 0.6 || Math.hypot(x, z) > T.EDGE) return [h, 0, 0];
    { const oo = T.cityOctDist(x, z); if (oo < -6 && oo > -(T.CITY_OCT - 166)) return [h, 0, 0]; } // phố Ngoại Thành lát đá / đất nện: không cỏ
    const e = 1.2, sl = Math.hypot(T.heightAt(x + e, z) - T.heightAt(x - e, z), T.heightAt(x, z + e) - T.heightAt(x, z - e)) / (2 * e);
    groundAt(x, z, h, sl, GB);
    let d = Math.max(0, Math.min(1, GB[0] * 1.15 - GB[1] * 0.9 - GB[2] * 1.6 - GB[3] * 3));
    if (d > 0) d *= sst(0.6, 2.8, roadAt(x, z));
    if (d > 0 && (platformTop(x, z) != null || blockedByBuilding(x, z))) d = 0;
    const dry = Math.max(0, Math.min(1, (h - 110) / 150 + T.fbm(x / 70 + 3, z / 70 - 5, 3) * 0.35 + T.fbm(x / 9, z / 9, 2) * 0.25));
    return [h, d, dry];
  };
  const grass = createGrass(scene, { quality, sample: grassSample, version: solidCount });
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
  // dựng chunk trong Worker (tối đa 3 việc song song); kết quả về thì thay hình học — luồng chính
  // chỉ gói mảng số (< 1 ms), không còn khung giật 15–30 ms mỗi lần qua ranh chunk
  const MORPH = new Map(); // geometry → { from, to, t }
  const MSTAT = { n: 0, skipped: 0, maxJump: 0, sumJump: 0, maxMs: 0, ms: 0, frames: 0 }; // đo (debug / kiểm)
  function startMorph(geo, oldGeo, oldSeg, seg, cx, cz) {
    const op = oldGeo.attributes.position.array, ovs = oldSeg + 1, ostep = CHUNK / oldSeg;
    const x0 = -T.HALF + cx * CHUNK, z0 = -T.HALF + cz * CHUNK;
    const oh = (i, j) => op[(Math.min(oldSeg, j) * ovs + Math.min(oldSeg, i)) * 3 + 1];
    const sample = (x, z) => { // nội suy theo đúng tam giác lưới cũ (a c b / b c d)
      const fx = Math.max(0, Math.min(oldSeg, (x - x0) / ostep)), fz = Math.max(0, Math.min(oldSeg, (z - z0) / ostep));
      const i = Math.min(oldSeg - 1, Math.floor(fx)), j = Math.min(oldSeg - 1, Math.floor(fz)), u = fx - i, v = fz - j;
      const a = oh(i, j), b = oh(i + 1, j), c = oh(i, j + 1), dd = oh(i + 1, j + 1);
      return u + v <= 1 ? a + (b - a) * u + (c - a) * v : dd + (c - dd) * (1 - u) + (b - dd) * (1 - v);
    };
    const p = geo.attributes.position, arr = p.array, n = p.count, vs = seg + 1, grid = vs * vs;
    const to = new Float32Array(n), from = new Float32Array(n);
    let maxD = 0;
    for (let k = 0; k < n; k++) {
      to[k] = arr[k * 3 + 1];
      from[k] = sample(arr[k * 3], arr[k * 3 + 2]) - (k >= grid ? 10 : 0); // viền thả (skirt) giữ −10 m
      maxD = Math.max(maxD, Math.abs(to[k] - from[k]));
    }
    if (maxD < 0.05) { MSTAT.skipped++; return; }
    MSTAT.n++; MSTAT.maxJump = Math.max(MSTAT.maxJump, maxD); MSTAT.sumJump += maxD;
    for (let k = 0; k < n; k++) arr[k * 3 + 1] = from[k];
    p.needsUpdate = true;
    MORPH.set(geo, { from, to, t: 0 });
  }
  function tickMorph(dt) {
    if (!MORPH.size) return;
    const t0 = performance.now();
    for (const [geo, m] of MORPH) {
      m.t = Math.min(1, m.t + dt / 0.6);
      const k = m.t * m.t * (3 - 2 * m.t), arr = geo.attributes.position.array;
      for (let i = 0; i < m.to.length; i++) arr[i * 3 + 1] = m.from[i] + (m.to[i] - m.from[i]) * k;
      geo.attributes.position.needsUpdate = true;
      if (m.t >= 1) { MORPH.delete(geo); geo.computeBoundingSphere(); }
    }
    const ms = performance.now() - t0; MSTAT.ms += ms; MSTAT.frames++; MSTAT.maxMs = Math.max(MSTAT.maxMs, ms);
  }
  let inFlight = 0;
  function place(d) {
    const geo = geomFrom(d), k = keyOf(d.cx, d.cz), old = chunks.get(k);
    const cast = d.seg >= Q.segMid && d.relief > 3;
    if (old) {
      // geomorph theo thời gian: đỉnh lưới mới bắt đầu ở độ cao của lưới cũ (nội suy) rồi trượt về độ cao thật trong ~0,6 s
      // — đồi núi không «nhảy» khi ô địa hình đổi độ chi tiết
      startMorph(geo, old.mesh.geometry, old.seg, d.seg, d.cx, d.cz);
      old.mesh.geometry.dispose(); old.mesh.geometry = geo; old.seg = d.seg; old.mesh.castShadow = cast;
    }
    else {
      const m = new THREE.Mesh(geo, terrainMat); m.receiveShadow = true; m.castShadow = cast; m.userData.terrain = true;
      group.add(m); chunks.set(k, { mesh: m, seg: d.seg });
    }
  }
  function buildSome() {
    while (queue.length && inFlight < 3) {
      const { i, j, seg } = queue.shift();
      inFlight++;
      gen('chunk', i, j, seg).then((d) => { inFlight--; place(d); }); // Worker trả theo thứ tự gửi → bản mới luôn tới sau
    }
  }
  // khởi tạo: toàn bộ ở mức xa (dựng trong Worker), rồi nâng dần quanh người chơi
  const farP = Promise.all(Array.from({ length: N * N }, (_, n) => gen('chunk', n % N, Math.floor(n / N), Q.segFar).then((d) => { if (!chunks.has(keyOf(d.cx, d.cz))) place(d); })));

  // --- nước (hồ, sông): màu theo độ sâu (nông trong, sâu thẫm), bọt mảnh ven bờ, gợn hai lớp
  // trôi khác hướng (không lộ ô lặp), phản chiếu trời qua môi trường PMREM.
  // Độ sâu đọc từ bản đồ độ cao thô của cả thế giới, nướng cuốn chiếu sau khi vào game.
  const halfTex = (data, n) => { const t = new THREE.DataTexture(data, n, n, THREE.RedFormat, THREE.HalfFloatType); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; };
  const WU = {
    uDepth: { value: halfTex(new Uint16Array(4).fill(THREE.DataUtils.toHalfFloat(-50)), 2) }, // tạm: «sâu» khắp nơi
    uWN: { value: waterNormalTexture({ nrm: new Uint8Array(16 * 4).fill(128).map((v, i) => (i % 4 === 2 || i % 4 === 3 ? 255 : v)), S: 4 }) },
    uFlow: { value: (() => { const t = new THREE.DataTexture(new Uint8Array([128, 128]), 1, 1, THREE.RGFormat); t.needsUpdate = true; return t; })() },
    uWorld: { value: T.WORLD }, uPatchC: { value: new THREE.Vector2(1e6, 1e6) }, uPatchR: { value: PATCH / 2 },
  };
  const depthP = gen('depth', 768).then((d) => { WU.uDepth.value.dispose(); WU.uDepth.value = halfTex(d.data, d.DEP); });
  const waterP = gen('water', 256).then((d) => { WU.uWN.value.dispose(); WU.uWN.value = waterNormalTexture(d); });
  // bản đồ dòng chảy (water.js › waterAt, RG 8 bit: 128 + v × 60) — pháp tuyến trôi theo dòng, sông nhìn thấy đang chảy
  const flowP = gen('flow', 256).then((d) => { const t = new THREE.DataTexture(d.data, d.N, d.N, THREE.RGFormat); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; WU.uFlow.value.dispose(); WU.uFlow.value = t; });
  // vật liệu nước thế giới; patch = lưới bám camera có sóng dời đỉnh (cùng công thức water.js › waveHeight × worldAmp)
  const makeWaterMat = (patch) => {
    const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.12, metalness: 0, transparent: true, depthWrite: false, envMapIntensity: 0.75 });
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, WU, SHARED_UNIFORMS);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', `#include <common>
varying vec3 vWWP;
${patch ? `${waveGLSL()}
uniform sampler2D uDepth; uniform float uWorld; uniform vec2 uPatchC; uniform float uPatchR;
float wAmp(vec2 p) { float d = max(0.0, -texture2D(uDepth, (p + 0.5 * uWorld) / uWorld).r); return (0.15 + 0.25 * smoothstep(1.0, 10.0, d)) * smoothstep(0.0, 1.5, d); }` : ''}`)
        .replace('#include <beginnormal_vertex>', patch ? `#include <beginnormal_vertex>
{ vec2 wp0 = (modelMatrix * vec4(position, 1.0)).xz; vec2 e = abs(wp0 - uPatchC);
  float fade = 1.0 - smoothstep(uPatchR * 0.72, uPatchR, max(e.x, e.y)), A = wAmp(wp0) * fade;
  vec2 gr = wvG(wp0) * A; objectNormal = normalize(vec3(-gr.x, 1.0, -gr.y)); }` : '#include <beginnormal_vertex>')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
${patch ? `{ vec2 wp0 = (modelMatrix * vec4(position, 1.0)).xz; vec2 e = abs(wp0 - uPatchC);
  float fade = 1.0 - smoothstep(uPatchR * 0.72, uPatchR, max(e.x, e.y));
  transformed.y += wvH(wp0) * wAmp(wp0) * fade; }` : ''}
vWWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
uniform sampler2D uDepth; uniform sampler2D uWN; uniform sampler2D uFlow; uniform float uWorld; uniform float uT; uniform vec2 uPatchC; uniform float uPatchR;
varying vec3 vWWP;
vec3 gWN = vec3(0.0, 0.0, 1.0);`)
        .replace('#include <map_fragment>', `
{
  vec2 wp = vWWP.xz;
  ${patch ? '' : 'vec2 pe = abs(wp - uPatchC); if (max(pe.x, pe.y) < uPatchR - 0.5) discard; // phần trong ô sóng do lưới bám camera vẽ'}
  vec2 wuv = (wp + 0.5 * uWorld) / uWorld;
  float d = max(0.0, -texture2D(uDepth, wuv).r);
  // flowmap hai pha: pháp tuyến trôi theo dòng chảy, đổi pha mỗi 4 giây (không lộ chỗ giãn)
  vec2 fl = (texture2D(uFlow, wuv).rg * 255.0 - 128.0) / 60.0;
  float ph0 = fract(uT * 0.25), ph1 = fract(uT * 0.25 + 0.5), wb = abs(0.5 - ph0) * 2.0;
  vec2 base1 = wp / 9.0 + vec2(uT * 0.021, uT * 0.013), base2 = vec2(wp.x * 0.8 - wp.y * 0.6, wp.x * 0.6 + wp.y * 0.8) / 23.0 - vec2(uT * 0.009, -uT * 0.016);
  vec2 o0 = fl * ph0 * 4.0 / 9.0, o1 = fl * ph1 * 4.0 / 9.0;
  vec3 n1 = mix(texture2D(uWN, base1 - o0).xyz, texture2D(uWN, base1 - o1).xyz, wb) * 2.0 - 1.0;
  vec3 n2 = mix(texture2D(uWN, base2 - o0 * 0.4).xyz, texture2D(uWN, base2 - o1 * 0.4).xyz, wb) * 2.0 - 1.0;
  float distK = smoothstep(40.0, 260.0, length(vWWP - cameraPosition));
  float fsp = clamp(length(fl), 0.0, 1.5);
  gWN = normalize(vec3((n1.xy + n2.xy) * mix(0.26, 0.08, distK) * (1.0 + fsp * 0.35), 1.0));
  vec3 shallow = vec3(0.13, 0.19, 0.13), deep = vec3(0.010, 0.040, 0.055);
  vec3 col = mix(shallow, deep, smoothstep(0.3, 6.0, d));
  float foam = (1.0 - smoothstep(0.05, 0.55, d)) * smoothstep(0.35, 0.75, texture2D(uWN, wp / 2.7 + uT * 0.03 - fl * ph0 * 0.4).r);
  foam += fsp * 0.12 * smoothstep(0.55, 0.9, texture2D(uWN, wp / 5.0 - fl * ph0 * 0.8).g); // vệt bọt trôi giữa dòng xiết
  col = mix(col, vec3(0.62, 0.66, 0.64), clamp(foam, 0.0, 1.0) * 0.6);
  diffuseColor.rgb = col;
  diffuseColor.a = clamp(mix(0.35, 0.93, smoothstep(0.1, 3.5, d)) + foam * 0.4, 0.0, 1.0);
}`)
        .replace('#include <normal_fragment_maps>', `
{
  vec3 Tv = normalize((viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz), Bv = normalize((viewMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
  normal = normalize(Tv * gWN.x + Bv * gWN.y + normal * gWN.z);
}`);
    };
    m.customProgramCacheKey = () => (patch ? 'water-v2-patch' : 'water-v2');
    return m;
  };
  const waterMat = makeWaterMat(false);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(T.WORLD * 1.1, T.WORLD * 1.1), waterMat);
  water.rotation.x = -Math.PI / 2; water.position.y = T.WATER; water.receiveShadow = true; water.renderOrder = 2; group.add(water);
  // ô sóng bám camera: PATCH × PATCH m, 128 × 128 ô, bắt theo lưới ô (đỉnh không trượt khi đi)
  const patchGeo = new THREE.PlaneGeometry(PATCH, PATCH, PATCH_SEG, PATCH_SEG); patchGeo.rotateX(-Math.PI / 2);
  const patch = new THREE.Mesh(patchGeo, makeWaterMat(true));
  patch.position.y = T.WATER; patch.receiveShadow = true; patch.renderOrder = 2; patch.frustumCulled = false; patch.visible = false; group.add(patch);
  const PCELL = PATCH / PATCH_SEG;
  const movePatch = (px, pz) => {
    // chỉ bật khi có nước sâu trong ô (lấy mẫu thưa) — trên núi / giữa thành thì không tốn 32k tam giác
    const cx = Math.round(px / PCELL) * PCELL, cz = Math.round(pz / PCELL) * PCELL;
    if (cx === patch.position.x && cz === patch.position.z && patch.userData.ok !== undefined) return;
    let wet = false; for (let a = -1; a <= 1 && !wet; a += 0.25) for (let b = -1; b <= 1 && !wet; b += 0.25) if (T.heightAt(cx + a * PATCH * 0.45, cz + b * PATCH * 0.45) < T.WATER - 0.5) wet = true;
    patch.position.x = cx; patch.position.z = cz; patch.userData.ok = wet; patch.visible = wet;
    WU.uPatchC.value.set(wet ? cx : 1e6, wet ? cz : 1e6);
  };

  // --- biển mây quanh rìa
  const clouds = new THREE.Group(); group.add(clouds);
  const cMat = new THREE.MeshBasicMaterial({ map: cloudTex(), transparent: true, opacity: 0.9, depthWrite: false, fog: true });
  const cr = rng(31);
  for (let i = 0; i < 70; i++) {
    const a = cr() * Math.PI * 2, d = T.EDGE * 0.94 + cr() * T.EDGE * 0.94;
    const c = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), cMat);
    c.position.set(Math.cos(a) * d, T.CLOUD_SEA + 10 + cr() * 25, Math.sin(a) * d); c.rotation.x = -Math.PI / 2; c.rotation.z = cr() * 6;
    c.scale.setScalar(400 + cr() * 400); c.userData.v = 2 + cr() * 3; clouds.add(c);
  }

  // --- rừng: vị trí tính trong Worker; cây dựng khi có kết quả
  let forest = null;
  const treesP = gen('trees').then((lists) => { forest = span('init:forest', () => createForest(group, renderer, lists, quality)); });

  // Mặt đất dưới chân (sân quán ở y = 0, ngoài sân theo địa hình)
  const groundY = (x, z) => { const p = platformTop(x, z); if (inCourt(x, z)) return p ?? 0; return Math.max(T.heightAt(x, z), T.WATER - 1.2, p ?? -1e9); };

  return {
    sky, water, waterPatch: patch, group, clouds, groundY, setSun, grass,
    occlusion: (...a) => forest?.occlusion(...a),
    get treeCount() { return forest?.count || 0; },
    /** Màn nạp chờ: kết cấu, toàn bộ địa hình mức xa, rừng, bản đồ độ sâu, rồi các chunk chi tiết quanh (px, pz). */
    async prepare(px, pz, onStep = () => {}) {
      onStep('Đang đắp núi sông…'); await Promise.all([groundP, farP, waterP]);
      onStep('Đang trồng rừng…'); await Promise.all([treesP, depthP]); // bản đồ dòng chảy (flowP) tới sau cũng được: chưa có thì nước lặng
      onStep('Đang dựng địa hình quanh bạn…');
      updateChunks(px, pz);
      while (queue.length || inFlight) { buildSome(); await new Promise((r) => setTimeout(r, 16)); }
      forest?.update(px, pz, 0);
    },
    terrainMeshes: () => [...chunks.values()].map((c) => c.mesh),
    update(px, pz, dt, t) {
      span('w:chunks', () => { updateChunks(px, pz); buildSome(); tickMorph(dt); }); if (forest) span('forest:update', () => forest.update(px, pz, t));
      span('grass:update', () => grass.update(px, groundY(px, pz), pz, t));
      waterTick(t); movePatch(px, pz); // đồng hồ nước chung (sóng shader = water.js) · ô sóng bám người chơi
      for (const c of clouds.children) { c.position.x += c.userData.v * dt; if (c.position.x > T.HALF * 1.8) c.position.x = -T.HALF * 1.8; }
    },
    get pending() { return queue.length + inFlight; },
    morphStats: () => ({ ...MSTAT, active: MORPH.size }),
  };
}
