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

// Thay sắc độ vùng áo ngoài (đỏ bão hòa) và đai (xanh ngọc) trên texture Meshy — giữ da, tóc, lót trắng.
function tintMaterial(mat, primary, accent) {
  const m = mat.clone();
  // primary / accent: hành (木…) hoặc HSV tự chọn [h, s, v] (phẩm phục Tàng Y Các)
  const P = Array.isArray(primary) ? primary : WX_HSV[primary] || WX_HSV.火;
  const A = Array.isArray(accent) ? accent : WX_HSV[accent] || null;
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
  m.customProgramCacheKey = () => `hq-tint-${P.join(',')}-${A ? A.join(',') : ''}`;
  return m;
}

export async function createCharacter(id, { height = 1.9, tint = null } = {}) {
  const g = await loadModel(id);
  if (!g) return null;
  const obj = cloneSkinned(g.scene);
  const owned = []; // material đã clone cho RIÊNG instance này (texture bên trong dùng chung cache GLB — không hủy)
  const tinted = (mm) => { const c = tintMaterial(mm, tint.primary, tint.accent); owned.push(c); return c; };
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    if (tint?.primary) o.material = Array.isArray(o.material) ? o.material.map(tinted) : tinted(o.material);
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
  // xương cho tư thế ngồi
  const bone = {};
  obj.traverse((o) => { if (o.isBone) bone[o.name] = o; });
  const baseY = obj.position.y;
  let hipRest = null, side = 1, seated = false;
  // rig thiếu xương thì cảnh báo MỘT lần mỗi nhân vật (không im lặng, cũng không spam mỗi khung)
  let rigWarned = false;
  const warnRig = (missing) => { if (rigWarned) return; rigWarned = true; console.warn(`[characters] rig thiếu xương (${missing.join(', ')}) — bỏ qua tư thế ngồi/cầm (id=${id})`); };
  function seat(mode, t = 0) {
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
  function unseat() { if (seated) { seated = false; obj.position.y = baseY; } }
  // cầm đồ (quạt, phất trần, la bàn…) khi đứng: tay phải đưa lên trước ngực
  function hold(t = 0) {
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
  return {
    seat, unseat, hold,
    hand: (right = true) => bone[right ? 'RightHand' : 'LeftHand'] || null,
    bone: (name) => bone[name] || null,
    id, obj: root, actions,
    // trạng thái nền (idle/walk/run/sit) — đổi mượt; động tác một lần (bow/wave) chen vào rồi trả về nền
    setBase(name) { if (name !== base) { base = name; if (!current || !ONCE.has(Object.keys(actions).find((k) => actions[k] === current))) fadeTo(name); } },
    play(name) { if (actions[name]) fadeTo(name, 0.15); },
    update(dt) { mixer.update(dt); },
    has: (name) => !!actions[name],
    // dọn GPU theo instance: dừng mixer + hủy material đã clone ở trên.
    // (geometry dùng chung với GLB trong cache assets.js — cache sở hữu, KHÔNG hủy.)
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot());
      for (const m of owned) m.dispose();
      owned.length = 0;
    },
  };
}
