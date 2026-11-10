// ============================================================================
//  MẶT NƯỚC DÙNG CHUNG (kênh, hào, kênh dẫn, sông, hồ): sóng dời đỉnh cùng công thức với water.js (WAVES, wind),
//  pháp tuyến hai lớp trôi theo dòng chảy, Fresnel / phản chiếu trời (PMREM). Đồng hồ nước chung: tick(t) mỗi khung.
// ============================================================================
import * as THREE from 'three';
import { WAVES, AMP, wind, setWaterTime, waterTime } from './water.js';

/** đồng hồ nước (giây) — world3d gọi tick mỗi khung; motion / thuyền đọc water.waterTime() để nổi khớp mặt sóng */
export const time = waterTime;
const SHARED = { uT: { value: 0 }, uWindA: { value: 0 } };
export function tick(t) { setWaterTime(t); SHARED.uT.value = t; SHARED.uWindA.value = wind(t).a; }

/** GLSL: float wvH(vec2 p) — độ cao sóng chuẩn hoá (nhân biên độ ngoài), cùng hằng số với water.waveHeight */
export const waveGLSL = () => `
uniform float uT; uniform float uWindA;
float wvH(vec2 p) {
  float h = 0.0, c, s;
${WAVES.map((w) => `  c = cos(uWindA + ${w.ang.toFixed(4)}); s = sin(uWindA + ${w.ang.toFixed(4)}); h += ${w.a.toFixed(4)} * sin(${w.k.toFixed(5)} * (p.x * c + p.y * s) - ${w.w.toFixed(5)} * uT + ${w.ph.toFixed(4)});`).join('\n')}
  return h;
}
vec2 wvG(vec2 p) {
  vec2 g = vec2(0.0); float c, s, q;
${WAVES.map((w) => `  c = cos(uWindA + ${w.ang.toFixed(4)}); s = sin(uWindA + ${w.ang.toFixed(4)}); q = ${(w.a * w.k).toFixed(5)} * cos(${w.k.toFixed(5)} * (p.x * c + p.y * s) - ${w.w.toFixed(5)} * uT + ${w.ph.toFixed(4)}); g += vec2(q * c, q * s);`).join(String.fromCharCode(10))}
  return g;
}`;
export const SHARED_UNIFORMS = SHARED;

let NORMAL = null;
function waterNormal() {
  if (NORMAL) return NORMAL;
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), img = g.createImageData(N, N);
  const waves = Array.from({ length: 9 }, (_, i) => ({ kx: Math.round(Math.cos(i * 2.4) * (2 + i)), kz: Math.round(Math.sin(i * 2.4) * (2 + i)), a: 1 / (1 + i * 0.6), p: i * 1.7 }));
  const H = (x, z) => waves.reduce((s2, w) => s2 + w.a * Math.sin(((w.kx * x + w.kz * z) / N) * Math.PI * 2 + w.p), 0);
  for (let z = 0; z < N; z++) for (let x = 0; x < N; x++) {
    const dx = H(x + 1, z) - H(x - 1, z), dz = H(x, z + 1) - H(x, z - 1), l = Math.hypot(dx * 6, dz * 6, 1), o = (z * N + x) * 4;
    img.data[o] = 128 + (-dx * 6 / l) * 127; img.data[o + 1] = 128 + (-dz * 6 / l) * 127; img.data[o + 2] = 128 + (1 / l) * 127; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0); NORMAL = new THREE.CanvasTexture(c); NORMAL.wrapS = NORMAL.wrapT = THREE.RepeatWrapping;
  return NORMAL;
}

const CACHE = new Map();
/**
 * Vật liệu mặt nước cho lưới đặt sẵn (kênh / hào / kênh dẫn): đỉnh dời theo sóng (lưới cần đủ ô — ≤ 4 m),
 * pháp tuyến trôi theo hướng dòng chảy flow (vec2 thế giới, m/s). kind → biên độ AMP.
 */
export function waterMaterial({ kind = 'canal', flow = [0, 0], color = '#173c42', tile = 1 } = {}) {
  const key = `${kind}:${flow.join(',')}:${color}:${tile}`;
  if (CACHE.has(key)) return CACHE.get(key);
  // (phản chiếu vừa phải: clearcoat 1 + nhám 0,05 làm mặt kênh loang lổ trắng như giấy bạc dưới trời sáng)
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.16, metalness: 0.02, clearcoat: 0.35, clearcoatRoughness: 0.12, normalMap: waterNormal(), normalScale: new THREE.Vector2(0.16, 0.16), envMapIntensity: 0.65, transparent: true, opacity: 0.92 });
  const U = { uAmp: { value: AMP[kind] ?? 0.1 }, uFlow: { value: new THREE.Vector2(flow[0], flow[1]) }, uTile: { value: tile } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, SHARED, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\n${waveGLSL()}\nuniform float uAmp; varying vec2 vWP;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vec4 wpos = modelMatrix * vec4(transformed, 1.0); vWP = wpos.xz;
transformed.y += wvH(wpos.xz) * uAmp;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uT; uniform vec2 uFlow; uniform float uTile; varying vec2 vWP;')
      .replace('#include <normal_fragment_maps>', `
      { vec2 fl = uFlow * uT * 0.12;
        vec2 uvA = vWP / (13.0 * uTile) + vec2(uT * 0.011, uT * 0.007) - fl * 0.6, uvB = vec2(vWP.x * 0.8 - vWP.y * 0.6, vWP.x * 0.6 + vWP.y * 0.8) / (5.9 * uTile) + vec2(-uT * 0.009, uT * 0.014) - fl;
        vec3 nA = texture2D(normalMap, uvA).xyz * 2.0 - 1.0, nB = texture2D(normalMap, uvB).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3((nA.xy + nB.xy) * normalScale, nA.z * nB.z));
        normal = normalize(tbn * mapN); }`);
  };
  m.customProgramCacheKey = () => 'water-shared-v4';
  if (kind === 'pond') { m.normalScale.set(0.09, 0.09); m.opacity = 0.9; m.envMapIntensity = 0.55; m.roughness = 0.1; m.clearcoat = 0.25; } // hồ sen: mặt êm, lăn tăn nhẹ
  CACHE.set(key, m);
  return m;
}
