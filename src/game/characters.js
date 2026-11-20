// ============================================================================
//  Nhân vật Meshy có xương + động tác (scripts/meshy-gen.mjs rig/animate).
//  Mỗi GLB gộp nhiều clip theo đúng thứ tự action_ids trong assets-meshy/manifest.json.
//  createCharacter(id) → { obj, play(name), update(dt) }; thiếu file → null (dùng avatar procedural).
// ============================================================================
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { loadModel, warmObject, getModelQuality, modelAvailable } from './assets.js';

// tên động tác theo thứ tự action_ids đã gửi Meshy
// (GLB đóng gói bằng scripts/nhanvat-pack.mjs đã đặt tên clip theo tên game — tên clip được ưu tiên; bảng này cho GLB cũ)
export const CHAR_ANIMS = {
  hero_m: ['idle', 'walk', 'run', 'sit', 'bow', 'wave'],
  hero_f: ['idle', 'walk', 'run', 'sit', 'bow', 'wave'],
  master: ['idle', 'sit', 'bow'],
  npc_villager: ['idle', 'wave', 'walk'],
  npc_merchant: ['idle', 'bow', 'walk'],
};
// cử chỉ thêm (preset Meshy đợt 2, file <id>.anim.glb tải sau khi vào game — manifest §11)
const GEST_X = ['agree', 'scratch', 'hip', 'listen', 'shrug', 'pickup', 'rub'];
const ONCE = new Set(['bow', 'wave', 'hello', 'pick', ...GEST_X]);
// Thư viện động tác ghép từ model Meshy cộng đồng (docs/NHAN-VAT-MESHY-MANIFEST.md §4): mỗi bản sao bốc kiểu đi riêng,
// đứng yên thì đổi kiểu đứng ngẫu nhiên 6–14 s một lần (thở thường / lắc vai / vươn vai / trò chuyện / uống trà / nói / nhìn quanh)
const IDLE_V = ['idle', 'idle2', 'idle3', 'chat', 'drink', 'talk', 'look', 'idle4', 'idle5', 'idle6', 'idle7', 'breathe', 'breathe2', 'sway'];
const WALK_V = ['walk', 'walk2', 'walk3', 'walk4', 'walk5'];
const KNOWN = new Set(['idle', 'walk', 'run', 'sit', 'bow', 'wave', ...IDLE_V, ...WALK_V, 'hello', 'pick', ...GEST_X]);
// động tác thêm: tải một lần mỗi mô hình, chỉ sau khi đã vào game (enableHd) — không làm chậm màn nạp
const ANIMX = new Map(); const lateQueue = [];
let started = false;
function afterStart(fn) { if (started) fn(); else lateQueue.push(fn); }
function loadAnims(id) { if (!ANIMX.has(id)) ANIMX.set(id, loadModel(`${id}.anim`).catch(() => null)); return ANIMX.get(id); }

// ---------------------------------------------------------------------------
// Ngồi xếp bằng trên bồ đoàn (động tác «sit» của Meshy là ngồi ghế — trên sàn trông lơ lửng).
// Chạy trên nền «idle» (thân trên vẫn thở), rồi bẻ từng xương cho xương chĩa đúng hướng đích
// trong khung của nhân vật (+z = trước mặt, +y = lên). Cách «ngắm xương» này không phụ thuộc trục
// cục bộ của rig. Hông hạ xuống sát bồ đoàn.
// ---------------------------------------------------------------------------
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _d = new THREE.Vector3(), _t = new THREE.Vector3();
const _q = new THREE.Quaternion(), _wq = new THREE.Quaternion(), _pq = new THREE.Quaternion(), _rq = new THREE.Quaternion();
const _v = new THREE.Vector3(), _u = new THREE.Vector3();
function aim(bone, child, dir, rootQ) {
  if (!bone || !child) return;
  _t.copy(dir).normalize().applyQuaternion(rootQ);
  bone.getWorldPosition(_a); child.getWorldPosition(_b); _d.subVectors(_b, _a);
  if (_d.lengthSq() < 1e-10) return;
  _q.setFromUnitVectors(_d.normalize(), _t);
  bone.getWorldQuaternion(_wq); _wq.premultiply(_q);
  bone.parent.getWorldQuaternion(_pq).invert();
  bone.quaternion.copy(_pq.multiply(_wq));
  bone.updateMatrixWorld(true);
}
const ease = (x) => x * x * (3 - 2 * x);
const lerpDir = (out, a, b, k) => out.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
const SEAT_HIP = 0.27; // độ cao hông khi ngồi bồ đoàn (m, so với chân)

// Phẩm phục theo ngũ hành (HSV đích): áo ngoài = Dụng thần, đai = Hỷ thần (docs/GAME-V2-THIET-KE.md §S2)
export const WX_HSV = {
  木: [0.36, 0.62, 0.62],  // xanh lục tùng
  火: [0.99, 0.80, 0.82],  // đỏ son
  土: [0.10, 0.70, 0.80],  // vàng thổ hoàng
  金: [0.12, 0.10, 0.95],  // trắng bạc ánh kim
  水: [0.62, 0.62, 0.42],  // lam huyền (đen ánh xanh)
};

// NPC dân phân hoá theo 8 cung Bát Quái (charPlan docs/GAME-AAA-MODEL-THANH-PHO.md §3.3): mỗi cung một
// bộ màu nhuộm bám 60-30-10 — 60% áo ngoài chủ đạo (primary, sắc pha nhuộm thực, không neon) · 30% áo
// trong giữ màu ngà #F5F2E9 tự nhiên của texture (không nhuộm — không có vùng khoá riêng cho lớp trong)
// · 10% đai nâu sẫm (accent so le #5C2223 / #664228 theo cung). render3d dùng cho npc_villager /
// npc_merchant đứng ở sân; tint là mảng HSV nên vào đúng khuôn charMaterial (primary→robe, accent→sash).
export const NPC_TINT = {
  kham: { primary: [0.592, 0.437, 0.439], accent: [0.997, 0.63, 0.361] },  // Khảm · Bắc — lam thẫm, đai nâu đỏ
  gen: { primary: [0.099, 0.515, 0.639], accent: [0.07, 0.608, 0.4] },     // Cấn · Đông Bắc — vàng đất, đai nâu gỗ
  chan: { primary: [0.271, 0.393, 0.478], accent: [0.997, 0.63, 0.361] },  // Chấn · Đông — xanh rêu, đai nâu đỏ
  xun: { primary: [0.269, 0.337, 0.627], accent: [0.07, 0.608, 0.4] },     // Tốn · Đông Nam — mộc non nhạt, đai nâu gỗ
  li: { primary: [0.016, 0.65, 0.561], accent: [0.07, 0.608, 0.4] },       // Ly · Nam — đỏ nâu trầm, đai nâu gỗ
  kun: { primary: [0.091, 0.483, 0.592], accent: [0.997, 0.63, 0.361] },   // Khôn · Tây Nam — nâu vàng, đai nâu đỏ
  dui: { primary: [0.565, 0.223, 0.722], accent: [0.997, 0.63, 0.361] },   // Đoài · Tây — ánh bạc xanh, đai nâu đỏ
  qian: { primary: [0.111, 0.104, 0.788], accent: [0.07, 0.608, 0.4] },    // Càn · Tây Bắc — trắng ngà sẫm, đai nâu gỗ
};

// Vùng nhuộm theo từng mô hình (đo histogram texture gốc 2026-11-10): robe = áo ngoài → Dụng thần, sash = đai → Hỷ thần.
// h = tâm sắc độ (vòng 0–1), w = nửa bề rộng, s / v = ngưỡng bão hoà / sáng, ref = độ sáng điển hình (giữ sáng tối vải).
// hero_f: áo màu ngọc + đai đỏ (trước đây nhuộm ngược: màu chính rơi vào đai); master: lam tím than + đai tím.
// 2026-11-18 hero_m / hero_f thay bằng model Meshy cộng đồng: hero_m áo lam (h 0,60, ~50 % texture) + đai vàng (h 0,115);
// hero_f (c19) áo trắng, mảng váy xám lam độ bão hoà thấp (h 0,58, s≈0,19) → full: nhuộm đủ độ bão hoà đích (không nhân theo s gốc)
const KEYS = {
  hero_m: { robe: { h: 0.6, w: 0.07, s: 0.15, v: 0.03, ref: 0.4 }, sash: { h: 0.115, w: 0.035, s: 0.5, v: 0.4, ref: 0.82 } },
  hero_f: { robe: { h: 0.58, w: 0.08, s: 0.08, v: 0.08, ref: 0.4, full: 1 }, sash: null },
  npc_lao: { robe: null, sash: null }, npc_ba: { robe: null, sash: null }, npc_nu: { robe: null, sash: null },
  master: { robe: { h: 0.6, w: 0.045, s: 0.35, v: 0.06, ref: 0.27 }, sash: { h: 0.87, w: 0.06, s: 0.28, v: 0.08, ref: 0.3 } },
  npc_villager: { robe: { h: 0.0, w: 0.034, s: 0.58, v: 0.18, ref: 0.6 }, sash: null },
  npc_merchant: { robe: { h: 0.115, w: 0.03, s: 0.55, v: 0.3, ref: 0.7 }, sash: { h: 0.0, w: 0.03, s: 0.6, v: 0.2, ref: 0.6 } },
};
const keyVec = (k) => (k ? new THREE.Vector4(k.h, k.w, k.s, k.v) : new THREE.Vector4(0, -1, 2, 2));

// Vật liệu nhân vật (mọi nhân vật, có hoặc không nhuộm):
//  · nhuộm áo / đai theo KEYS · da: tán xạ ấm nhẹ (giả SSS) + mịn hơn · bỏ bản đồ kim loại Meshy (da, vải xám như bạc)
//  · viền sáng (rim) theo góc nhìn: dáng người tách khỏi nền, mặt dễ đọc ở khoảng cách camera thường
// Chớp mắt (docs/NHAN-VAT-MESHY-MANIFEST.md §10): model Meshy không có mí rời → shader phủ màu da mí (lấy texture ngay trên mắt)
// xuống vùng mắt theo UV. Đo bằng scripts/nhanvat-eyes.mjs: c = tâm mắt (UV), a = tới góc ngoài, b = tới mí trên.
const EYES_RAW = {
  hero_m: [[0.4359, 0.55654, 0.00327, -0.00606, 0.00166, 0.00088], [0.50752, 0.423, 0.00299, 0.00697, 0.00181, -0.00072]],
  hero_f: [[0.40042, 0.64151, -0.00657, -0.00094, 0.00077, -0.0022, 0.3, 1.2], [0.42748, 0.65014, 0.00591, 0.00268, 0.00059, -0.00174, 0.3, 1.2]],
  master: [[0.98384, 0.21472, 0.0042, 0.00194, -0.00069, 0.00092], [0.4856, 0.21085, -0.00147, 0.0051, 0.00113, 0.00002]],
  npc_villager: [[0.69948, 0.75958, 0.00578, 0.00435, -0.00079, 0.00142], [0.7704, 0.35589, 0.0098, -0.01104, -0.00183, -0.002]],
  npc_merchant: [[0.78218, 0.53464, 0.00445, -0.00778, 0.00165, 0.0009], [0.28489, 0.60899, -0.00914, 0.00398, 0.0007, 0.00218]],
  npc_lao: [[0.17217, 0.38112, -0.00337, 0.00391, -0.00112, -0.00067], [0.39426, 0.08917, 0.00298, -0.0046, -0.00096, -0.00085]],
  npc_ba: [[0.25871, 0.50498, -0.00145, 0.0047, -0.0013, -0.00018, 0.4], [0.23111, 0.23193, -0.0014, 0.00513, 0.00184, 0.00062, 0.4]],
  npc_nu: [[0.75891, 0.483, 0.0036, 0.00428, -0.0013, 0.00116, 0.8, 1.15], [0.74126, 0.46533, -0.00434, -0.0038, -0.00115, 0.00119, 0.8, 1.15]],
};
// [lift, sc] tuỳ chọn: lấy màu da cao thêm lift × b (mắt kẻ viền đậm), phóng vùng mắt × sc
// mỗi mắt → 3 vec4: (tâm, lift, sc) · nghịch đảo [a b] (uv → toạ độ mắt: x dọc góc mắt, y lên mí) · (a, b) để lấy màu da phía trên
function eyeVecs(id) {
  const E = EYES_RAW[id]; const out = [];
  for (let i = 0; i < 2; i++) {
    const [cx, cy, ax, ay, bx, by, lift = 0, sc = 1] = E ? E[i] : [0, 0, 1, 0, 0, 1];
    const det = ax * by - bx * ay || 1;
    out.push(new THREE.Vector4(cx, cy, lift, sc), new THREE.Vector4(by / det, -bx / det, -ay / det, ax / det), new THREE.Vector4(ax, ay, bx, by));
  }
  return out;
}
// bản sao vật liệu theo nhân vật (chỉ lưới gần, chỉ id có EYES): cùng chương trình shader, riêng uBlink
function instMat(shared, uB) {
  const m = shared.clone();
  m.userData = { ...shared.userData };
  m.onBeforeCompile = (sh, r) => { shared.onBeforeCompile(sh, r); sh.uniforms.uBlink = uB; };
  m.customProgramCacheKey = shared.customProgramCacheKey;
  return m;
}

const MATS = new Map(); // dùng chung theo (vật liệu gốc, mô hình, màu) — không tạo chương trình shader mới cho mỗi bản sao
function charMaterial(mat, id, tint) {
  const P = tint?.primary ? (Array.isArray(tint.primary) ? tint.primary : WX_HSV[tint.primary] || WX_HSV.火) : null;
  const A = tint?.accent ? (Array.isArray(tint.accent) ? tint.accent : WX_HSV[tint.accent] || null) : null;
  const ck = `${mat.uuid}|${id}|${P ? P.join(',') : ''}|${A ? A.join(',') : ''}`;
  if (MATS.has(ck)) return MATS.get(ck);
  const K = KEYS[id] || KEYS.hero_m;
  const m = mat.clone();
  m.metalness = 0; m.metalnessMap = null;
  // Meshy cộng đồng (hero_m, npc_lao, npc_ba, npc_nu) xuất kèm emissive = chính texture màu × 1 → nhân vật tự sáng:
  // phẳng bệt, đêm vẫn sáng như ngày, áo nhuộm lộ màu gốc, mắt cũ hiện xuyên mí khi chớp. Nhân vật không tự phát sáng.
  if (!globalThis.__charEmissive) { m.emissiveMap = null; if (m.emissive) m.emissive.setRGB(0, 0, 0); } // __charEmissive: ảnh so sánh (scripts/nhanvat-light.mjs)
  if (m.roughnessMap) m.roughness = Math.max(m.roughness, 0.75);
  if (m.map) m.map.anisotropy = 8;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uPri = { value: new THREE.Vector3(...(P || [0, 0, 0])) };
    sh.uniforms.uAcc = { value: new THREE.Vector3(...(A || [0, 0, 0])) };
    sh.uniforms.uTint = { value: new THREE.Vector2(P ? 1 : 0, A ? 1 : 0) };
    sh.uniforms.uKR = { value: keyVec(K.robe) }; sh.uniforms.uKS = { value: keyVec(K.sash) };
    sh.uniforms.uRef = { value: new THREE.Vector2(K.robe?.ref || 0.7, K.sash?.ref || 0.6) };
    sh.uniforms.uFull = { value: new THREE.Vector2(K.robe?.full || 0, K.sash?.full || 0) };
    sh.uniforms.uBlink = { value: 0 }; sh.uniforms.uEye = { value: eyeVecs(id) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uPri; uniform vec3 uAcc; uniform vec2 uTint; uniform vec4 uKR; uniform vec4 uKS; uniform vec2 uRef; uniform vec2 uFull;
float hqSkin = 0.0; float hqLid = 0.0;
vec3 hq_rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1.0e-10; return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x); }
vec3 hq_hsv2rgb(vec3 c){ vec4 K=vec4(1.,2./3.,1./3.,3.); vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www); return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y); }
float hq_hd(float a, float b){ float d = abs(a - b); return min(d, 1.0 - d); }
float hq_key(vec3 hsv, vec4 k){ float skinLike = step(0.028, hsv.x) * step(hsv.x, 0.1) * step(hsv.y, 0.66); return step(hq_hd(hsv.x, k.x), k.y) * step(k.z, hsv.y) * step(k.w, hsv.z) * (1.0 - skinLike); }
vec3 hq_recolor(vec3 hsv, vec3 t, float ref, float full){ return hq_hsv2rgb(vec3(t.x, t.y * max(full, smoothstep(0.15, 0.55, hsv.y + 0.1)), clamp(hsv.z * t.z / ref, 0., 1.))); }`)
      .replace('void main() {', `uniform float uBlink; uniform vec4 uEye[6];
#ifdef USE_MAP
// mí trên khép xuống: y > mép mí → màu da lấy ngay trên mắt (cùng cột x), mép mí sẫm như hàng mi
vec3 hq_lid(vec3 col, vec2 uv, vec4 k0, vec4 k1, vec4 k2){
  vec2 d = uv - k0.xy; vec2 q = vec2(dot(k1.xy, d), dot(k1.zw, d));
  q /= max(k0.w, 0.5);
  float r = q.x * q.x / 1.69 + q.y * q.y / 2.9;
  if (r > 1.0) return col;
  float edge = mix(1.7, -1.35, uBlink) + 0.45 * uBlink * q.x * q.x;
  float cov = smoothstep(edge - 0.1, edge + 0.1, q.y) * (1.0 - smoothstep(0.8, 1.0, r));
  // da gò má ngay dưới mắt (trên mắt hay dính mi / lông mày); trung bình 4 điểm → mí không sọc dọc
  vec2 s0 = k0.xy + k2.xy * q.x * 0.8 - k2.zw * (1.8 + k0.z), sx = k2.xy * 0.3, sy = k2.zw * 0.55;
  vec3 skin = (texture2D(map, s0 - sx).rgb + texture2D(map, s0 + sx).rgb + texture2D(map, s0 - sx - sy).rgb + texture2D(map, s0 + sx - sy).rgb) * 0.2325;
  float lash = (1.0 - smoothstep(0.0, 0.32, abs(q.y - edge - 0.08))) * smoothstep(0.2, 0.6, uBlink);
  hqLid = max(hqLid, cov);
  return mix(col, mix(skin, skin * 0.28, lash), cov);
}
#endif
void main() {`)
      .replace('#include <color_fragment>', `#include <color_fragment>
#ifdef USE_MAP
if (uBlink > 0.002) { diffuseColor.rgb = hq_lid(diffuseColor.rgb, vMapUv, uEye[0], uEye[1], uEye[2]); diffuseColor.rgb = hq_lid(diffuseColor.rgb, vMapUv, uEye[3], uEye[4], uEye[5]); }
#endif
{ vec3 hsv = hq_rgb2hsv(diffuseColor.rgb);
  float robe = uTint.x * hq_key(hsv, uKR), sash = uTint.y * hq_key(hsv, uKS) * (1.0 - robe);
  if (robe > 0.5) diffuseColor.rgb = hq_recolor(hsv, uPri, uRef.x, uFull.x);
  else if (sash > 0.5) diffuseColor.rgb = hq_recolor(hsv, uAcc, uRef.y, uFull.y);
  hqSkin = (1.0 - max(robe, sash)) * smoothstep(0.0, 0.02, hsv.x) * (1.0 - smoothstep(0.075, 0.095, hsv.x)) * smoothstep(0.13, 0.2, hsv.y) * (1.0 - smoothstep(0.5, 0.6, hsv.y)) * smoothstep(0.55, 0.7, hsv.z); }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.52, hqSkin);
roughnessFactor = mix(roughnessFactor, 0.6, hqLid);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = normalize(mix(normal, nonPerturbedNormal, hqLid)); // mí khép: bỏ khối nhãn cầu của normal map`)
      .replace('#include <opaque_fragment>', `{ float ndv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  float rim = pow(1.0 - ndv, 3.0);
  outgoingLight += diffuseColor.rgb * vec3(1.0, 0.55, 0.42) * hqSkin * 0.16;   // tán xạ dưới da (ấm, không gắt)
  outgoingLight += vec3(1.0, 0.94, 0.84) * rim * (0.12 + 0.1 * hqSkin); }      // viền sáng
#include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => `hq-char-${id}-${P ? P.join(',') : ''}-${A ? A.join(',') : ''}`;
  MATS.set(ck, m);
  return m;
}

const HD = new Map();
// ảnh 2048 chỉ nạp SAU khi đã vào game (main.js gọi enableHd khi màn nạp mở) — không làm chậm màn nạp (+6 MB)
let hdOn = false; const hdQueue = [];
// máy yếu / điện thoại (chất lượng low): giữ ảnh 1024 (đỡ 6 MB tải + VRAM)
export function enableHd() {
  if (!started) { started = true; for (const f of lateQueue.splice(0)) f(); } // động tác thêm: mọi máy (file nhỏ ~0,25 MB / mô hình)
  if (hdOn || getModelQuality() === 'low') return; hdOn = true; for (const a of hdQueue.splice(0)) upgradeHd(...a);
}
function upgradeHd(id, meshes, tint, uB = null, owned = null) {
  if (!hdOn) { hdQueue.push([id, meshes, tint, uB, owned]); return; }
  if (!HD.has(id)) HD.set(id, loadModel(`${id}.hd`).catch(() => null));
  HD.get(id).then((g) => {
    if (!g) return;
    let src = null; g.scene.traverse((o) => { if (!src && o.isMesh) src = [].concat(o.material)[0]; });
    if (!src?.map) return;
    for (const o of meshes) {
      const mm = [].concat(o.material)[0]; if (!mm || mm.userData.hd) continue;
      let hd = charMaterial(src, id, tint);
      if (uB) { hd = instMat(hd, uB); owned?.push(hd); }
      hd.userData.hd = true; o.material = hd;
    }
  });
}
const FIT = new Map();
const VIEWER = new THREE.Vector3(), _wp = new THREE.Vector3();
/** render3d gọi mỗi khung: vị trí camera (giãn nhịp hoạt ảnh nhân vật ở xa) */
export function setViewer(v) { VIEWER.copy(v); }
// chiều cao thật (m, tính cả búi tóc): nam 1,76, nữ 1,66 — trước đây mọi người chơi 1,9 m nên nhà cửa trông thấp bé
export const HEIGHT = { hero_m: 1.76, hero_f: 1.66, master: 1.74, npc_villager: 1.6, npc_merchant: 1.72, npc_lao: 1.66, npc_ba: 1.54, npc_nu: 1.63 };
// LOD nhân vật (docs/NHAN-VAT-MESHY-MANIFEST.md §9): <id>.lod.glb (≤ 4–9k tam giác, texture 512) mang xương + mọi clip, là gốc;
// lưới gần <id>.glb (không clip) chỉ tải khi nhân vật lần đầu vào vòng NEAR_LOAD m, gắn vào CÙNG bộ xương (khớp tên xương).
// Hiện lưới gần khi camera < NEAR_IN m, về lưới xa khi > NEAR_OUT m (giữa hai mốc giữ bậc đang có — không nhấp nháy).
const NEAR_LOAD = 25, NEAR_IN = 15, NEAR_OUT = 18;
export async function createCharacter(id, { height = HEIGHT[id] || 1.72, tint = null } = {}) {
  const lod = await modelAvailable(`${id}.lod`);
  const g = (lod && (await loadModel(`${id}.lod`))) || (await loadModel(id));
  if (!g) return null;
  const tiered = !!(lod && g);
  const obj = cloneSkinned(g.scene);
  const owned = []; // (giữ cho dispose cũ — vật liệu nhân vật nay dùng chung theo MATS, không hủy theo bản sao)
  const skinned = [];
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    o.material = Array.isArray(o.material) ? o.material.map((mm) => charMaterial(mm, id, tint)) : charMaterial(o.material, id, tint);
    skinned.push(o);
  });
  // texture 2048 (bản .hd: cùng lưới, cùng UV) nạp sau khi nhân vật đã hiện — mặt, tóc, hoa văn áo rõ gấp đôi
  // (có LOD: chỉ lưới gần được nâng, xem loadNear)
  if (!tiered) upgradeHd(id, skinned, tint);
  // Meshy rig dùng cm + khung xương thu 0.01 → khung bao thường sai ×100; đo chính xác theo da (skinning)
  // đo theo da (skinning, chính xác) rất tốn với rig nặng (hàng trăm nghìn đỉnh) → đo MỘT lần mỗi mô hình,
  // các bản sao sau dùng lại tỉ lệ (khách hỏi việc / người chơi khác xuất hiện không còn khựng)
  let fit = FIT.get(id);
  if (!fit) {
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj, true);
    // khối cầu cắt khung nhìn: đo một lần theo da (tư thế gốc), nới ×1,7 cho động tác (vung tay, ngồi, cúi chào)
    const spheres = skinned.map((o) => { if (!o.isSkinnedMesh) return null; o.computeBoundingSphere(); const b = o.boundingSphere.clone(); b.radius *= 1.7; return b; });
    fit = { h: box.getSize(new THREE.Vector3()).y || 1, minY: box.min.y, spheres };
    FIT.set(id, fit);
  }
  // trước đây frustumCulled = false: nhân vật sau lưng camera vẫn vẽ cả lượt màu lẫn lượt bóng
  skinned.forEach((o, i) => { const b = fit.spheres?.[i]; if (b) { o.boundingSphere = b.clone(); o.frustumCulled = true; } else o.frustumCulled = false; });
  const k = height / fit.h;
  obj.scale.multiplyScalar(k);
  obj.position.y -= fit.minY * k; // chân chạm đất
  obj.updateMatrixWorld(true);
  const root = new THREE.Group(); root.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  const names = CHAR_ANIMS[id] || [];
  const actions = {};
  g.animations.forEach((clip, i) => {
    const name = KNOWN.has(clip.name) ? clip.name : names[i] || clip.name;
    const a = mixer.clipAction(clip);
    if (ONCE.has(name)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = false; }
    actions[name] = a;
  });
  let current = null, base = 'idle', acc = 0, tickN = Math.floor(Math.random() * 4); const myRate = 0.88 + Math.random() * 0.24;
  // biến thể: kiểu đi cố định theo bản sao, kiểu đứng đổi dần; ghi đè xương (ngồi / cầm / bay) → giữ idle gốc
  let idles, walks, myWalk, gestures;
  // người già (lão nông, bà lão) đi run run 60 % — nếu đã có clip walk4
  const pools = () => {
    idles = IDLE_V.filter((n) => actions[n]); walks = WALK_V.filter((n) => actions[n]);
    myWalk = actions.walk4 && /npc_lao|npc_ba/.test(id) && Math.random() < 0.6 ? 'walk4' : walks.length ? walks[Math.floor(Math.random() * walks.length)] : 'walk';
    gestures = /^npc_|^master$/.test(id) ? ['hello', 'pick', 'bow', ...GEST_X].filter((n) => actions[n]) : [];
  };
  pools();
  let curIdle = 'idle', varyT = 0, nextVary = 4 + Math.random() * 8, overrideT = 9;
  const resolve = (n) => (n === 'walk' ? myWalk : n === 'idle' ? curIdle : n);
  function fadeTo(name, d = 0.25) {
    const next = actions[resolve(name)] || actions[name] || actions.idle;
    if (!next || next === current) return;
    next.reset().setEffectiveWeight(1).fadeIn(d).play();
    // nhịp riêng mỗi người ở kiểu đứng (0,88–1,12×): hai người lỡ trùng pha sẽ trôi lệch nhau, không cử động khớp nhau cả lượt
    next.setEffectiveTimeScale(IDLE_V.includes(Object.keys(actions).find((k) => actions[k] === next)) ? myRate : 1);
    // lệch pha mỗi lần vào clip lặp (không chỉ lúc tạo): trước đây ai đổi về «idle» cũng bắt đầu từ giây 0 → 1,7 cặp / khung
    // cùng clip cùng pha trong vòng 12 người (scripts/nhanvat-dongtac.mjs); cử chỉ một lần vẫn chạy từ đầu
    if (!ONCE.has(Object.keys(actions).find((k) => actions[k] === next))) next.time = Math.random() * next.getClip().duration;
    if (current) current.fadeOut(d);
    current = next;
  }
  function vary(dt) {
    overrideT += dt;
    if (base !== 'idle' || idles.length < 2 || (current && ONCE.has(Object.keys(actions).find((k) => actions[k] === current)))) return;
    if (overrideT < 1) { if (curIdle !== 'idle') { curIdle = 'idle'; fadeTo('idle', 0.4); } return; }
    if ((varyT += dt) < nextVary) return;
    varyT = 0; nextVary = 6 + Math.random() * 8;
    if (gestures.length && Math.random() < 0.12) { const gname = gestures[Math.floor(Math.random() * gestures.length)]; fadeTo(gname, 0.3); return; }
    const pool = idles.filter((n) => n !== curIdle);
    curIdle = Math.random() < 0.25 ? 'idle' : pool[Math.floor(Math.random() * pool.length)]; // 20 kiểu đứng → về «idle» gốc 25 %
    fadeTo('idle', 0.6);
  }
  // động tác thêm (<id>.anim.glb): gắn vào CÙNG mixer — rãnh khớp theo tên xương
  afterStart(() => loadAnims(id).then((ga) => {
    if (!ga || gone) return;
    for (const clip of ga.animations) {
      if (!KNOWN.has(clip.name) || actions[clip.name]) continue;
      const a = mixer.clipAction(clip);
      if (ONCE.has(clip.name)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = false; }
      actions[clip.name] = a;
    }
    const wasWalk = myWalk; pools();
    if (base === 'walk' && current === actions[wasWalk] && myWalk !== wasWalk) fadeTo('walk', 0.4);
  }));
  mixer.addEventListener('finished', (e) => { if (ONCE.has(Object.keys(actions).find((k) => actions[k] === e.action))) fadeTo(base, 0.3); });
  fadeTo('idle', 0);
  // xương cho tư thế ngồi
  const bone = {};
  obj.traverse((o) => { if (o.isBone) bone[o.name] = o; });
  const baseY = obj.position.y;
  let hipRest = null, side = 1, seated = false;
  // rig thiếu xương thì cảnh báo MỘT lần mỗi nhân vật (không im lặng, cũng không spam mỗi khung)
  let rigWarned = false;
  const warnRig = (missing) => { if (rigWarned) return; rigWarned = true; console.warn(`[characters] rig thiếu xương (${missing.join(', ')}) — bỏ qua tư thế ngồi/cầm (id=${id})`); };
  function seat(mode, t = 0) {
    overrideT = 0;
    if (!bone.Hips || !bone.LeftUpLeg) { warnRig(['Hips', 'LeftUpLeg'].filter((n) => !bone[n])); return 0; }
    root.updateMatrixWorld(true);
    root.getWorldQuaternion(_rq);
    if (hipRest == null) {
      // hông lúc đứng (so với chân) + bên trái nằm ở x dương hay âm trong khung nhân vật
      root.getWorldPosition(_u); bone.Hips.getWorldPosition(_v); hipRest = _v.y - _u.y;
      bone.LeftUpLeg.getWorldPosition(_a); _a.sub(_v).applyQuaternion(_rq.clone().invert()); side = _a.x >= 0 ? 1 : -1;
    }
    seated = true;
    obj.position.y = baseY - (hipRest - SEAT_HIP);
    obj.updateMatrixWorld(true);
    // chân xếp bằng: đùi chĩa ra trước-ngoài, cẳng chân bắt chéo vào giữa
    for (const [L, s] of [['Left', side], ['Right', -side]]) {
      aim(bone[`${L}UpLeg`], bone[`${L}Leg`], _v.set(s * 0.64, -0.1, 0.76), _rq);
      aim(bone[`${L}Leg`], bone[`${L}Foot`], _v.set(-s * 0.95, -0.04, -0.12), _rq);
      aim(bone[`${L}Foot`], bone[`${L}ToeBase`], _v.set(-s * 0.3, -0.2, 0.9), _rq);
    }
    // tay: «tea» — tay phải cầm chén, thỉnh thoảng nâng lên nhấp; tay trái đặt lên gối
    //      «write» — hai tay đặt trên án, tay phải đưa bút; «calm» — hai tay đặt lên gối
    const sR = -side, sL = side;
    let sip = 0;
    if (mode === 'tea') {
      const ph = (t % 7.5) / 7.5; // mỗi 7,5 s nhấp một ngụm: nâng 0,55→0,66, giữ, hạ 0,8→0,9
      sip = ph < 0.55 ? 0 : ph < 0.66 ? ease((ph - 0.55) / 0.11) : ph < 0.8 ? 1 : ph < 0.9 ? 1 - ease((ph - 0.8) / 0.1) : 0;
      aim(bone.RightArm, bone.RightForeArm, lerpDir(_v, [sR * 0.2, -0.8, 0.56], [sR * 0.26, -0.1, 0.96], sip), _rq);
      aim(bone.RightForeArm, bone.RightHand, lerpDir(_v, [-sR * 0.42, 0.5, 0.76], [-sR * 0.38, 0.9, -0.2], sip), _rq);
      aim(bone.LeftArm, bone.LeftForeArm, _v.set(sL * 0.22, -0.9, 0.32), _rq);
      aim(bone.LeftForeArm, bone.LeftHand, _v.set(sL * 0.3, -0.38, 0.88), _rq);
    } else if (mode === 'write') {
      const w = Math.sin(t * 2.4) * 0.08;
      aim(bone.RightArm, bone.RightForeArm, _v.set(sR * 0.2, -0.62, 0.72), _rq);
      aim(bone.RightForeArm, bone.RightHand, _v.set(-sR * (0.3 + w), -0.38, 0.9), _rq);
      aim(bone.LeftArm, bone.LeftForeArm, _v.set(sL * 0.24, -0.64, 0.7), _rq);
      aim(bone.LeftForeArm, bone.LeftHand, _v.set(-sL * 0.42, -0.36, 0.84), _rq);
    } else {
      for (const [L, s] of [['Left', sL], ['Right', sR]]) {
        aim(bone[`${L}Arm`], bone[`${L}ForeArm`], _v.set(s * 0.22, -0.9, 0.3), _rq);
        aim(bone[`${L}ForeArm`], bone[`${L}Hand`], _v.set(s * 0.3, -0.36, 0.88), _rq);
      }
    }
    return sip;
  }
  // --- bậc gần: tải muộn, gắn vào bộ xương của bậc xa ---
  let near = null, nearState = tiered ? 'none' : 'ready', showNear = !tiered, gone = false;
  // chớp mắt: 2,5–6,5 s / lần, 15 % chớp đôi; khép 70 ms · giữ 40 ms · mở 150 ms (chỉ khi lưới gần đang hiện)
  const uB = EYES_RAW[id] && tiered ? { value: 0 } : null;
  let blinkT = Math.random() * 3, blinkAt = 1 + Math.random() * 4;
  let blinkFix = null;
  function blink(dt) {
    if (!uB) return;
    if (blinkFix != null) { uB.value = blinkFix; return; }
    if (!showNear) { uB.value = 0; return; }
    const p = (blinkT += dt) - blinkAt;
    if (p < 0) { uB.value = 0; return; }
    uB.value = p < 0.07 ? p / 0.07 : p < 0.11 ? 1 : p < 0.26 ? 1 - (p - 0.11) / 0.15 : 0;
    if (p >= 0.26) { blinkT = 0; blinkAt = Math.random() < 0.15 ? 0.12 : 2.5 + Math.random() * 4; }
  }
  function loadNear() {
    nearState = 'loading';
    loadModel(id).then(async (gn) => {
      if (!gn || gone) { nearState = 'none'; return; }
      const byName = {}; obj.traverse((o) => { if (o.isBone) byName[o.name] = o; });
      const list = [];
      gn.scene.traverse((src) => {
        if (!src.isSkinnedMesh) return;
        const bones = src.skeleton.bones.map((b) => byName[b.name]);
        if (bones.some((b) => !b)) return;
        const parent = (src.parent?.name && obj.getObjectByName(src.parent.name)) || skinned[0]?.parent || obj;
        const wrap = (mm) => { const sm = charMaterial(mm, id, tint); if (!uB) return sm; const im = instMat(sm, uB); owned.push(im); return im; };
        const mats = Array.isArray(src.material) ? src.material.map(wrap) : wrap(src.material);
        const m = new THREE.SkinnedMesh(src.geometry, mats);
        m.position.copy(src.position); m.quaternion.copy(src.quaternion); m.scale.copy(src.scale);
        m.bind(new THREE.Skeleton(bones, src.skeleton.boneInverses), src.bindMatrix);
        m.castShadow = true; m.receiveShadow = true;
        const b = fit.spheres?.[0]; if (b) { m.boundingSphere = b.clone(); m.frustumCulled = true; } else m.frustumCulled = false;
        m.visible = false; parent.add(m); list.push(m);
      });
      if (!list.length) { nearState = 'none'; console.warn(`[characters] lưới gần ${id} không khớp xương bậc xa — giữ bậc xa`); return; }
      await warmObject(root).catch(() => {}); // biên dịch shader lưới gần trước khi hiện (không khựng lúc đổi bậc)
      if (gone) return;
      near = list; nearState = 'ready'; upgradeHd(id, near, tint, uB, owned);
    }).catch(() => { nearState = 'none'; });
  }
  function tier(d) {
    if (!tiered) return;
    if (nearState === 'none' && (d < NEAR_LOAD || globalThis.__charLod === false)) loadNear();
    if (nearState !== 'ready') return;
    if (globalThis.__charLod === false) d = 0; // đo so sánh (scripts/perf-nhanvat.mjs): ép bậc gần mọi khoảng cách
    const want = showNear ? d < NEAR_OUT : d < NEAR_IN;
    if (want === showNear) return;
    showNear = want;
    for (const m of near) m.visible = want;
    for (const m of skinned) m.visible = !want;
  }
  function unseat() { if (seated) { seated = false; obj.position.y = baseY; } }
  // cầm đồ (quạt, phất trần, la bàn…) khi đứng: tay phải đưa lên trước ngực
  function hold(t = 0) {
    overrideT = 0;
    if (!bone.RightArm || !bone.Hips) { warnRig(['RightArm', 'Hips'].filter((n) => !bone[n])); return; }
    root.updateMatrixWorld(true);
    root.getWorldQuaternion(_rq);
    if (hipRest == null) {
      root.getWorldPosition(_u); bone.Hips.getWorldPosition(_v); hipRest = _v.y - _u.y;
      bone.LeftUpLeg.getWorldPosition(_a); _a.sub(_v).applyQuaternion(_rq.clone().invert()); side = _a.x >= 0 ? 1 : -1;
    }
    const sR = -side, sway = Math.sin(t * 1.3) * 0.05;
    aim(bone.RightArm, bone.RightForeArm, _v.set(sR * 0.22, -0.82, 0.42), _rq);
    aim(bone.RightForeArm, bone.RightHand, _v.set(-sR * (0.3 + sway), 0.5, 0.8), _rq);
  }
  // tư thế bay độc bản (P15 — flight-poses.js): ngồi xếp bằng nếu cần, nghiêng thân, ngắm từng xương theo bảng
  function pose(P, t = 0) {
    overrideT = 0;
    if (!P || !bone.Hips) return;
    root.updateMatrixWorld(true); root.getWorldQuaternion(_rq);
    if (hipRest == null) {
      root.getWorldPosition(_u); bone.Hips.getWorldPosition(_v); hipRest = _v.y - _u.y;
      bone.LeftUpLeg.getWorldPosition(_a); _a.sub(_v).applyQuaternion(_rq.clone().invert()); side = _a.x >= 0 ? 1 : -1;
    }
    if (P.seat) seat(P.seat, t); else unseat();
    const spine = bone.Spine02 || bone.Spine01 || bone.Spine;
    if (P.lean && spine && bone.neck) aim(spine, bone.neck, _v.set(0, Math.cos(P.lean), Math.sin(P.lean)), _rq);
    for (const [b, c, v] of P.bones) { const s = b.startsWith('Left') ? side : -side; aim(bone[b], bone[c], _v.set(v[0] * s, v[1], v[2]), _rq); }
  }
  await warmObject(root); // shader + texture sẵn trước khi nhân vật hiện ra
  return {
    seat, unseat, hold, pose,
    hand: (right = true) => bone[right ? 'RightHand' : 'LeftHand'] || null,
    bone: (name) => bone[name] || null,
    id, obj: root, actions,
    // trạng thái nền (idle/walk/run/sit) — đổi mượt; động tác một lần (bow/wave) chen vào rồi trả về nền
    setBase(name) { if (name !== base) { base = name; if (!current || !ONCE.has(Object.keys(actions).find((k) => actions[k] === current))) fadeTo(name); } },
    play(name) { if (actions[name]) fadeTo(name, 0.15); },
    // hoạt ảnh thưa dần theo khoảng cách tới camera (> 18 m: nửa nhịp, > 35 m: 1/4 nhịp) — dồn dt, không chậm đi
    update(dt) {
      acc += dt; tickN++;
      root.getWorldPosition(_wp);
      const d = VIEWER.distanceTo(_wp), every = d > 35 ? 4 : d > 18 ? 2 : 1;
      tier(d); blink(dt);
      if (tickN % every !== 0) return;
      vary(acc);
      mixer.update(acc); acc = 0;
    },
    has: (name) => !!actions[name],
    // dọn GPU theo instance: dừng mixer + hủy material đã clone ở trên.
    // (geometry dùng chung với GLB trong cache assets.js — cache sở hữu, KHÔNG hủy.)
    lodState: () => ({ tiered, near: showNear, nearState }),
    clipNow: () => { const n = Object.keys(actions).find((k) => actions[k] === current); return n ? [n, current.time] : null; },
    blinkState: () => (uB ? uB.value : null),
    _blinkSet: (v) => { blinkFix = v; }, // ảnh kiểm (scripts/nhanvat-blink.mjs)
    dispose() {
      gone = true;
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot());
      for (const m of owned) m.dispose();
      owned.length = 0;
    },
  };
}
