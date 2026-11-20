// ============================================================================
//  PHONG HOÁ MẶT TƯỜNG THÀNH (docs/VET-BAN-TUONG-MANIFEST.md §2) — shader trên bản sao vật liệu lặp theo mét
//  (archcity/mats.tiled): theo toạ độ thế giới, không thêm decal / texture. s = toạ độ dọc mặt tường (chiếu xz lên tiếp
//  tuyến lấy từ pháp tuyến), y = cao độ. Vệt nước dưới mũ tường · vệt muối trắng (mặt ngoài) · vệt sẫm dưới máng thoát nước
//  mỗi 48 m (mặt trong, như tường Tây An) · ẩm + rêu chân tường (mặt Bắc nặng hơn) · mảng vá gạch · loang lớn.
// ============================================================================
import * as THREE from 'three';

export const SPOUT_STEP = 48; // m — máng thoát nước mặt trong (Tây An: 40–60 m)
const GLSL = /* glsl */ `
float wHash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float wHash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(wHash2(i), wHash2(i + vec2(1, 0)), f.x), mix(wHash2(i + vec2(0, 1)), wHash2(i + vec2(1, 1)), f.x), f.y); }
`;
/** bản sao vật liệu m có phong hoá. top: cao độ mặt đi (y thế giới), ground: chân tường */
export function weathered(m, { top = 32.5, ground = 0, spout = SPOUT_STEP } = {}) {
  const w = m.clone(), base = m.onBeforeCompile;
  w.userData = { ...m.userData, weather: true };
  w.onBeforeCompile = (sh, r) => {
    base?.call(m, sh, r);
    sh.uniforms.uWTop = { value: top }; sh.uniforms.uWGround = { value: ground }; sh.uniforms.uWSpout = { value: spout };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 wp = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    wp = instanceMatrix * wp;
  #endif
    vWP = (modelMatrix * wp).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal); }`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vWP; varying vec3 vWN; uniform float uWTop; uniform float uWGround; uniform float uWSpout;
${GLSL}`).replace('#include <map_fragment>', `#include <map_fragment>
  {
    vec3 n = normalize(vWN);
    float vert = 1.0 - smoothstep(0.75, 0.92, abs(n.y));                 // chỉ mặt đứng / mặt dốc
    vec2 t = normalize(vec2(-n.z, n.x) + vec2(1e-5));
    float s = dot(vWP.xz, t), y = vWP.y, fromTop = uWTop - y;
    bool outer = dot(n.xz, vWP.xz) > 0.0;                                 // pháp tuyến hướng ra xa tâm thành
    // 1 · vệt nước dưới mũ tường (cột 0,45 m, ~45 %, dài 3–16 m)
    float c1 = floor(s / 0.6), f1 = fract(s / 0.6);
    float len = mix(4.0, 22.0, wHash(c1 + 17.0) * wHash(c1 + 3.0) + 0.15);
    float streak = step(0.42, wHash(c1)) * (1.0 - smoothstep(0.0, len, fromTop)) * smoothstep(-0.3, 0.6, fromTop);
    streak *= smoothstep(0.0, 0.3, f1) * smoothstep(1.0, 0.7, f1) * (0.6 + 0.4 * wNoise(vec2(s * 2.0, y * 0.6)));
    // 1b · vệt dưới lỗ răng cưa (bước 3,1 m): nước dồn qua khe, vệt sẫm rộng 0,9 m dài 6–14 m
    float dK = abs(fract(s / 3.1) - 0.5) * 3.1, ck = floor(s / 3.1);
    float kreno = (1.0 - smoothstep(0.15, 0.55, dK)) * (1.0 - smoothstep(0.0, mix(6.0, 14.0, wHash(ck + 41.0)), fromTop)) * step(0.3, fromTop) * step(0.35, wHash(ck + 7.0));
    // 2 · vệt muối trắng (mặt ngoài, cột 1,1 m, 12 %, dài 1–4 m)
    float c2 = floor(s / 1.1), f2 = fract(s / 1.1);
    float salt = outer ? step(0.88, wHash(c2 + 5.0)) * (1.0 - smoothstep(0.0, mix(1.0, 4.0, wHash(c2 + 9.0)), fromTop - 0.4)) * step(0.4, fromTop) * smoothstep(0.0, 0.35, f2) * smoothstep(1.0, 0.65, f2) : 0.0;
    // 3 · máng thoát nước mặt trong: vệt sẫm rộng 1,4 m suốt chiều cao dưới miệng máng
    float dS = abs(fract(s / uWSpout + 0.5) - 0.5) * uWSpout;
    float spout = outer ? 0.0 : (1.0 - smoothstep(0.5, 1.3 + 0.3 * wNoise(vec2(y * 0.5, s)), dS)) * step(0.7, fromTop) * (0.75 + 0.25 * wNoise(vec2(s * 3.0, y * 0.4)));
    // 6 · loang lớn
    float blot = smoothstep(0.45, 0.9, wNoise(vec2(s * 0.08, y * 0.12))) + 0.5 * smoothstep(0.5, 0.95, wNoise(vec2(s * 0.31 + 7.0, y * 0.21)));
    float dirt = clamp(streak * 0.42 + kreno * 0.3 + spout * 0.55 + blot * 0.22, 0.0, 0.72) * vert;
    vec3 col = diffuseColor.rgb * (1.0 - dirt);
    col = mix(col, vec3(0.86, 0.85, 0.80), salt * 0.18 * vert);
    // 4 · ẩm + rêu chân tường (mặt Bắc ×1,35), mép trên lấm tấm muối
    float band = 3.6 + (wNoise(vec2(s * 0.15, 3.7)) - 0.5) * 2.0;
    float foot = (1.0 - smoothstep(0.0, band, y - uWGround)) * vert * (n.z < -0.3 ? 1.0 : 0.74);
    col = mix(col, col * vec3(0.52, 0.62, 0.40), clamp(foot, 0.0, 1.0) * 0.85);
    float rim = smoothstep(0.25, 0.0, abs(y - uWGround - band)) * step(0.62, wNoise(vec2(s * 1.7, y * 2.3)));
    col = mix(col, vec3(0.82, 0.81, 0.76), rim * 0.22 * vert);
    // 5 · mảng vá 3,2 × 1,6 m (10 %)
    vec2 cell = floor(vec2(s / 3.2, y / 1.6));
    float pick = step(0.9, wHash2(cell + 3.1)), tone = wHash2(cell) > 0.5 ? 1.09 : 0.90;
    col *= mix(1.0, tone, pick * vert * step(1.5, fromTop));
    diffuseColor.rgb = col;
  }`);
  };
  const key = m.customProgramCacheKey?.() || '';
  w.customProgramCacheKey = () => `${key}|wallWeather`;
  return w;
}

/** máng thoát nước đá (miệng máng nhô 1,4 m) — hình một cái, gốc tại mặt tường, hướng +X (ra khỏi mặt) */
export function spoutGeometry() {
  const parts = [
    new THREE.BoxGeometry(1.4, 0.16, 0.56).translate(0.7, 0, 0),                 // đáy máng
    new THREE.BoxGeometry(1.4, 0.24, 0.1).translate(0.7, 0.2, 0.23),             // thành máng
    new THREE.BoxGeometry(1.4, 0.24, 0.1).translate(0.7, 0.2, -0.23),
    new THREE.BoxGeometry(0.5, 0.5, 0.9).translate(0.05, 0.1, 0),                 // đá đỡ ngàm vào tường
  ];
  const g = new THREE.BufferGeometry(); // gộp tay (tránh phụ thuộc thứ tự thuộc tính)
  const pos = [], nor = [], uv = [];
  for (const p of parts) { const q = p.toNonIndexed(); pos.push(...q.attributes.position.array); nor.push(...q.attributes.normal.array); uv.push(...q.attributes.uv.array); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}
