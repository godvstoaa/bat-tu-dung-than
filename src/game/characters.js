// ============================================================================
//  Nhân vật Meshy có xương + động tác (scripts/meshy-gen.mjs rig/animate).
//  Mỗi GLB gộp nhiều clip theo đúng thứ tự action_ids trong assets-meshy/manifest.json.
//  createCharacter(id) → { obj, play(name), update(dt) }; thiếu file → null (dùng avatar procedural).
// ============================================================================
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { loadModel } from './assets.js';

// tên động tác theo thứ tự action_ids đã gửi Meshy
export const CHAR_ANIMS = {
  hero_m: ['idle', 'walk', 'run', 'sit', 'bow', 'wave'],
  hero_f: ['idle', 'walk', 'run', 'sit', 'bow', 'wave'],
  master: ['idle', 'sit', 'bow'],
  npc_villager: ['idle', 'wave', 'walk'],
  npc_merchant: ['idle', 'bow', 'walk'],
};
const ONCE = new Set(['bow', 'wave']);

// Phẩm phục theo ngũ hành (HSV đích): áo ngoài = Dụng thần, đai = Hỷ thần (docs/GAME-V2-THIET-KE.md §S2)
export const WX_HSV = {
  木: [0.36, 0.62, 0.62],  // xanh lục tùng
  火: [0.99, 0.80, 0.82],  // đỏ son
  土: [0.10, 0.70, 0.80],  // vàng thổ hoàng
  金: [0.12, 0.10, 0.95],  // trắng bạc ánh kim
  水: [0.62, 0.62, 0.42],  // lam huyền (đen ánh xanh)
};

// Thay sắc độ vùng áo ngoài (đỏ bão hòa) và đai (xanh ngọc) trên texture Meshy — giữ da, tóc, lót trắng.
function tintMaterial(mat, primary, accent) {
  const m = mat.clone();
  const P = WX_HSV[primary] || WX_HSV.火, A = WX_HSV[accent] || null;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uPri = { value: new THREE.Vector3(...P) };
    sh.uniforms.uAcc = { value: new THREE.Vector3(...(A || [0, 0, 0])) };
    sh.uniforms.uHasAcc = { value: A ? 1 : 0 };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uPri; uniform vec3 uAcc; uniform float uHasAcc;
vec3 hq_rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1.0e-10; return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x); }
vec3 hq_hsv2rgb(vec3 c){ vec4 K=vec4(1.,2./3.,1./3.,3.); vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www); return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y); }
vec3 hq_recolor(vec3 hsv, vec3 t){ return hq_hsv2rgb(vec3(t.x, t.y * smoothstep(0.2, 0.6, hsv.y), clamp(hsv.z * t.z / 0.78, 0., 1.))); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
{ vec3 hsv = hq_rgb2hsv(diffuseColor.rgb);
  float robe = step(0.45, hsv.y) * max(step(hsv.x, 0.045), step(0.93, hsv.x)) * step(0.18, hsv.z);
  float sash = uHasAcc * step(0.22, hsv.y) * step(0.40, hsv.x) * step(hsv.x, 0.57);
  if (robe > 0.5) diffuseColor.rgb = hq_recolor(hsv, uPri);
  else if (sash > 0.5) diffuseColor.rgb = hq_recolor(hsv, uAcc); }`);
  };
  m.customProgramCacheKey = () => `hq-tint-${primary}-${accent || ''}`;
  return m;
}

export async function createCharacter(id, { height = 1.9, tint = null } = {}) {
  const g = await loadModel(id);
  if (!g) return null;
  const obj = cloneSkinned(g.scene);
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    if (tint?.primary) o.material = Array.isArray(o.material) ? o.material.map((mm) => tintMaterial(mm, tint.primary, tint.accent)) : tintMaterial(o.material, tint.primary, tint.accent);
  });
  // Meshy rig dùng cm + khung xương thu 0.01 → khung bao thường sai ×100; đo chính xác theo da (skinning)
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj, true);
  const size = box.getSize(new THREE.Vector3());
  obj.scale.multiplyScalar(height / (size.y || 1));
  obj.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(obj, true);
  obj.position.y -= b2.min.y; // chân chạm đất
  const root = new THREE.Group(); root.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  const names = CHAR_ANIMS[id] || [];
  const actions = {};
  g.animations.forEach((clip, i) => {
    const name = names[i] || clip.name;
    const a = mixer.clipAction(clip);
    if (ONCE.has(name)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = false; }
    actions[name] = a;
  });
  let current = null, base = 'idle';
  function fadeTo(name, d = 0.25) {
    const next = actions[name] || actions.idle;
    if (!next || next === current) return;
    next.reset().setEffectiveWeight(1).fadeIn(d).play();
    if (current) current.fadeOut(d);
    current = next;
  }
  mixer.addEventListener('finished', (e) => { if (ONCE.has(Object.keys(actions).find((k) => actions[k] === e.action))) fadeTo(base, 0.3); });
  fadeTo('idle', 0);
  return {
    id, obj: root, actions,
    // trạng thái nền (idle/walk/run/sit) — đổi mượt; động tác một lần (bow/wave) chen vào rồi trả về nền
    setBase(name) { if (name !== base) { base = name; if (!current || !ONCE.has(Object.keys(actions).find((k) => actions[k] === current))) fadeTo(name); } },
    play(name) { if (actions[name]) fadeTo(name, 0.15); },
    update(dt) { mixer.update(dt); },
    has: (name) => !!actions[name],
  };
}
