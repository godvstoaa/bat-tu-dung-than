// ============================================================================
//  VẬT LIỆU KIẾN TRÚC LẶP THEO MÉT (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §2.2, §3.2).
//  Một bộ texture 1024² dùng chung cho mọi công trình (scripts/gen-arch-tex.py → public/textures/arch/) — mật độ
//  texel cố định theo mét (512 px/m ngói, 533 gạch, 256 vữa …) bất kể công trình to nhỏ → nét mà nhẹ (~1,9 MB cả bộ).
//  UV: chiếu hộp theo mét trên lưới cục bộ (boxUV) — mái: u dọc mép hiên, v xuôi dốc (rãnh ngói chạy xuống).
//  Độ nhám đọc ở kênh alpha ảnh pháp tuyến.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const SPAN = { tile: 2.0, brick: 1.92, plaster: 4.0, lacquer: 1.0, plank: 2.0, stone: 2.4, marble: 2.0 };
const loader = new THREE.TextureLoader();
const TEX = new Map();
function tex(name, color) {
  const k = `${name}_${color ? 'c' : 'n'}`;
  if (TEX.has(k)) return TEX.get(k);
  const t = loader.load(new URL(`textures/arch/${k}.webp`, document.baseURI).href);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  TEX.set(k, t); return t;
}
/** vật liệu lặp: texture `kind`, màu nhuộm `color`, nhám cơ sở `rough` (× alpha ảnh pháp tuyến), độ nổi `bump` */
export function tiled(kind, color, { rough = 1, bump = 1, metal = 0, side } = {}) {
  const m = new THREE.MeshStandardMaterial({ map: tex(kind, true), normalMap: tex(kind, false), color: new THREE.Color(color), roughness: rough, metalness: metal });
  m.normalScale.set(bump, bump);
  if (side) m.side = side;
  m.userData.tiled = kind;
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * texture2D( normalMap, vNormalMapUv ).a;');
  };
  m.customProgramCacheKey = () => 'archTiled';
  return m;
}

let MATS = null;
/** bộ vật liệu theo khoá — khớp khoá của bộ dựng tienphu/arch/cn.js (+ khoá riêng của archcity) */
export function archMats() {
  if (MATS) return MATS;
  const D = THREE.DoubleSide;
  MATS = {
    // mái: ngói xám mộc / ngói lưu ly vàng / xanh lục — cùng một texture, khác màu nhuộm và độ nhám
    tileGray: tiled('tile', '#7d8489', { rough: 0.95, side: D }), ribGray: tiled('tile', '#6f767b', { rough: 0.95 }), ridgeGray: tiled('tile', '#5d6366', { rough: 0.95 }),
    tileGreen: tiled('tile', '#3f8a55', { rough: 0.55, side: D }), ribGreen: tiled('tile', '#367a4a', { rough: 0.55 }), ridgeGreen: tiled('tile', '#2f6b40', { rough: 0.55 }),
    tileYellow: tiled('tile', '#e0a83a', { rough: 0.5, side: D }), ribYellow: tiled('tile', '#d39a2c', { rough: 0.5 }), ridgeYellow: tiled('tile', '#c18a25', { rough: 0.5 }),
    edgeYellow: tiled('tile', '#d39a2c', { rough: 0.5 }),
    col: tiled('lacquer', '#a3291f', { rough: 0.9 }), wood: tiled('plank', '#6b4428', { rough: 1 }), plank: tiled('plank', '#8a6a48', { rough: 1 }),
    stone: tiled('stone', '#c2c3bd', { rough: 1 }), floor: tiled('stone', '#8c8e8a', { rough: 1 }), marble: tiled('marble', '#ece8dc', { rough: 1, bump: 0.6 }),
    brick: tiled('brick', '#9a9fa2', { rough: 1, bump: 1.2 }), brickDark: tiled('brick', '#7d8285', { rough: 1, bump: 1.2 }),
    plaster: tiled('plaster', '#a8382a', { rough: 1 }), plasterRed: tiled('plaster', '#97392b', { rough: 1 }), plasterWhite: tiled('plaster', '#e4ded0', { rough: 1 }),
  };
  return MATS;
}

/** UV chiếu hộp theo mét (lưới không chỉ số). roof = true: u dọc mép hiên, v xuôi dốc ×1,13 (mặt dốc ~28°) */
export function boxUV(geo, { roof = false, span = 1, index = false } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const p = g.attributes.position, n = p.count, uv = new Float32Array(n * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  for (let i = 0; i + 2 < n; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    e1.subVectors(b, a); e2.subVectors(c, a); e1.cross(e2);
    const ax = Math.abs(e1.x), ay = Math.abs(e1.y), az = Math.abs(e1.z);
    for (let k = 0; k < 3; k++) {
      const v = k === 0 ? a : k === 1 ? b : c; let U, V;
      if (roof && ay > 0.05 * (ax + az)) { if (ax > az) { U = v.z; V = v.x * 1.13; } else { U = v.x; V = v.z * 1.13; } }
      else if (ay >= ax && ay >= az) { U = v.x; V = v.z; }
      else if (ax >= az) { U = v.z; V = v.y; }
      else { U = v.x; V = v.y; }
      uv[(i + k) * 2] = U / span; uv[(i + k) * 2 + 1] = V / span;
    }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (!g.attributes.normal) g.computeVertexNormals();
  if (index) g.setIndex(Array.from({ length: n }, (_, i) => i)); // models.mergeStatic chỉ gộp lưới có chỉ số
  return g;
}

const ROOFKEY = /^(tile|rib|ridge|edge)/;
/**
 * Đổi một nhóm do Acc.build (tienphu/arch/kit.js) dựng sang vật liệu lặp: lưới nào có khoá trong archMats() → UV theo mét + vật liệu mới;
 * khoá khác (door, beam, beam2, dougong, gold, paper …: texture canvas theo UV gốc) giữ nguyên.
 * over: { khoá: vật liệu } thay riêng (vd. tường đỏ / trắng).
 */
export function retex(group, over = {}) {
  const M = { ...archMats(), ...over };
  group.traverse((o) => {
    if (!o.isMesh) return;
    const mat = M[o.name]; if (!mat) return;
    if (!mat.userData.tiled) { o.material = mat; return; } // vật liệu thay thẳng (vd. cửa song nhuộm màu): giữ UV gốc
    const span = SPAN[mat.userData.tiled] || 1;
    o.geometry = boxUV(o.geometry, { roof: ROOFKEY.test(o.name), span });
    o.material = mat;
  });
  return group;
}

// gộp lưới cùng ảnh texture thành MỘT lưới (màu từng vật liệu nướng vào màu đỉnh) — nhà nhân bản theo mẫu: mỗi lưới = 1 lệnh vẽ / bậc
const FAM = new Map();
function famMat(m) {
  const key = m.map ? m.map.uuid : m.metalness > 0.3 ? 'metal' : 'flat';
  if (!FAM.has(key)) { const c = m.clone(); c.color = new THREE.Color(1, 1, 1); c.vertexColors = true; c.onBeforeCompile = m.onBeforeCompile; c.customProgramCacheKey = m.customProgramCacheKey; c.userData = { ...m.userData }; c.side = THREE.DoubleSide; FAM.set(key, c); }
  return [key, FAM.get(key)];
}
export function consolidate(group) {
  const by = new Map();
  group.updateMatrixWorld(true);
  const keep = [];
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (Array.isArray(o.material) || o.userData.keep) { keep.push(o); return; }   // biển ngạch (khung + mặt chữ) giữ riêng
    const m = o.material, [key, fm] = famMat(m);
    const g = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()).applyMatrix4(o.matrixWorld);
    for (const a of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(a)) g.deleteAttribute(a);
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    const c = m.color || new THREE.Color(1, 1, 1), col = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < col.length; i += 3) { col[i] = c.r; col[i + 1] = c.g; col[i + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (!by.has(key)) by.set(key, { mat: fm, list: [] });
    by.get(key).list.push(g);
  });
  const out = new THREE.Group(); out.name = group.name;
  for (const [key, { mat, list }] of by) { const m = new THREE.Mesh(mergeGeometries(list, false), mat); m.name = `fam:${key.slice(0, 8)}`; m.castShadow = m.receiveShadow = true; out.add(m); }
  for (const o of keep) { o.updateMatrixWorld(true); const c = o.clone(); c.matrix.copy(o.matrixWorld); c.matrix.decompose(c.position, c.quaternion, c.scale); out.add(c); }
  return out;
}

/**
 * Vật liệu CHIẾU BA MẶT theo mét thế giới (không cần UV) — cho đồ dựng bằng hộp / trụ mặc định (UV 0–1 mỗi mặt → texture kéo giãn):
 * models.materials() (đài thầy, đình trà, thuyền, đồ nội thất …). Chỉ ảnh màu (pháp tuyến giữ của lưới); nhám cố định.
 */
export function triplanar(kind, color, { rough = 0.85, metal = 0, side, span = SPAN[kind] || 1 } = {}) {
  const m = new THREE.MeshStandardMaterial({ map: tex(kind, true), color: new THREE.Color(color), roughness: rough, metalness: metal });
  if (side) m.side = side;
  m.userData.tri = kind;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTriSpan = { value: span };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vTriP; varying vec3 vTriN;')
      .replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 tp = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    tp = instanceMatrix * tp;
  #endif
    vTriP = (modelMatrix * tp).xyz; vTriN = normalize(mat3(modelMatrix) * objectNormal); }`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vTriP; varying vec3 vTriN; uniform float uTriSpan;')
      .replace('#include <map_fragment>', `
  { vec3 tw = pow(abs(normalize(vTriN)), vec3(4.0)); tw /= (tw.x + tw.y + tw.z + 1e-5);
    vec3 p = vTriP / uTriSpan;
    vec4 sx = texture2D(map, p.zy), sy = texture2D(map, p.xz), sz = texture2D(map, p.xy);
    diffuseColor *= sx * tw.x + sy * tw.y + sz * tw.z; }`);
  };
  m.customProgramCacheKey = () => 'archTri';
  return m;
}
