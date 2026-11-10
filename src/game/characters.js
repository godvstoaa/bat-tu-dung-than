// ============================================================================
//  Nhân vật Meshy có xương + động tác (scripts/meshy-gen.mjs rig/animate).
//  Mỗi GLB gộp nhiều clip theo đúng thứ tự action_ids trong assets-meshy/manifest.json.
//  createCharacter(id) → { obj, play(name), update(dt) }; thiếu file → null (dùng avatar procedural).
// ============================================================================
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { loadModel, warmObject, getModelQuality } from './assets.js';

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

// Vùng nhuộm theo từng mô hình (đo histogram texture gốc 2026-11-10): robe = áo ngoài → Dụng thần, sash = đai → Hỷ thần.
// h = tâm sắc độ (vòng 0–1), w = nửa bề rộng, s / v = ngưỡng bão hoà / sáng, ref = độ sáng điển hình (giữ sáng tối vải).
// hero_f: áo màu ngọc + đai đỏ (trước đây nhuộm ngược: màu chính rơi vào đai); master: lam tím than + đai tím.
const KEYS = {
  hero_m: { robe: { h: 0.008, w: 0.034, s: 0.58, v: 0.2, ref: 0.7 }, sash: { h: 0.485, w: 0.08, s: 0.22, v: 0.08, ref: 0.4 } },
  hero_f: { robe: { h: 0.465, w: 0.075, s: 0.28, v: 0.15, ref: 0.6 }, sash: { h: 0.975, w: 0.035, s: 0.58, v: 0.18, ref: 0.6 } },
  master: { robe: { h: 0.6, w: 0.045, s: 0.35, v: 0.06, ref: 0.27 }, sash: { h: 0.87, w: 0.06, s: 0.28, v: 0.08, ref: 0.3 } },
  npc_villager: { robe: { h: 0.0, w: 0.034, s: 0.58, v: 0.18, ref: 0.6 }, sash: null },
  npc_merchant: { robe: { h: 0.115, w: 0.03, s: 0.55, v: 0.3, ref: 0.7 }, sash: { h: 0.0, w: 0.03, s: 0.6, v: 0.2, ref: 0.6 } },
};
const keyVec = (k) => (k ? new THREE.Vector4(k.h, k.w, k.s, k.v) : new THREE.Vector4(0, -1, 2, 2));

// Vật liệu nhân vật (mọi nhân vật, có hoặc không nhuộm):
//  · nhuộm áo / đai theo KEYS · da: tán xạ ấm nhẹ (giả SSS) + mịn hơn · bỏ bản đồ kim loại Meshy (da, vải xám như bạc)
//  · viền sáng (rim) theo góc nhìn: dáng người tách khỏi nền, mặt dễ đọc ở khoảng cách camera thường
const MATS = new Map(); // dùng chung theo (vật liệu gốc, mô hình, màu) — không tạo chương trình shader mới cho mỗi bản sao
function charMaterial(mat, id, tint) {
  const P = tint?.primary ? (Array.isArray(tint.primary) ? tint.primary : WX_HSV[tint.primary] || WX_HSV.火) : null;
  const A = tint?.accent ? (Array.isArray(tint.accent) ? tint.accent : WX_HSV[tint.accent] || null) : null;
  const ck = `${mat.uuid}|${id}|${P ? P.join(',') : ''}|${A ? A.join(',') : ''}`;
  if (MATS.has(ck)) return MATS.get(ck);
  const K = KEYS[id] || KEYS.hero_m;
  const m = mat.clone();
  m.metalness = 0; m.metalnessMap = null;
  if (m.roughnessMap) m.roughness = Math.max(m.roughness, 0.75);
  if (m.map) m.map.anisotropy = 8;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uPri = { value: new THREE.Vector3(...(P || [0, 0, 0])) };
    sh.uniforms.uAcc = { value: new THREE.Vector3(...(A || [0, 0, 0])) };
    sh.uniforms.uTint = { value: new THREE.Vector2(P ? 1 : 0, A ? 1 : 0) };
    sh.uniforms.uKR = { value: keyVec(K.robe) }; sh.uniforms.uKS = { value: keyVec(K.sash) };
    sh.uniforms.uRef = { value: new THREE.Vector2(K.robe?.ref || 0.7, K.sash?.ref || 0.6) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uPri; uniform vec3 uAcc; uniform vec2 uTint; uniform vec4 uKR; uniform vec4 uKS; uniform vec2 uRef;
float hqSkin = 0.0;
vec3 hq_rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1.0e-10; return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x); }
vec3 hq_hsv2rgb(vec3 c){ vec4 K=vec4(1.,2./3.,1./3.,3.); vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www); return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y); }
float hq_hd(float a, float b){ float d = abs(a - b); return min(d, 1.0 - d); }
float hq_key(vec3 hsv, vec4 k){ float skinLike = step(0.028, hsv.x) * step(hsv.x, 0.1) * step(hsv.y, 0.66); return step(hq_hd(hsv.x, k.x), k.y) * step(k.z, hsv.y) * step(k.w, hsv.z) * (1.0 - skinLike); }
vec3 hq_recolor(vec3 hsv, vec3 t, float ref){ return hq_hsv2rgb(vec3(t.x, t.y * smoothstep(0.15, 0.55, hsv.y + 0.1), clamp(hsv.z * t.z / ref, 0., 1.))); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
{ vec3 hsv = hq_rgb2hsv(diffuseColor.rgb);
  float robe = uTint.x * hq_key(hsv, uKR), sash = uTint.y * hq_key(hsv, uKS) * (1.0 - robe);
  if (robe > 0.5) diffuseColor.rgb = hq_recolor(hsv, uPri, uRef.x);
  else if (sash > 0.5) diffuseColor.rgb = hq_recolor(hsv, uAcc, uRef.y);
  hqSkin = (1.0 - max(robe, sash)) * smoothstep(0.0, 0.02, hsv.x) * (1.0 - smoothstep(0.075, 0.095, hsv.x)) * smoothstep(0.13, 0.2, hsv.y) * (1.0 - smoothstep(0.5, 0.6, hsv.y)) * smoothstep(0.55, 0.7, hsv.z); }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.52, hqSkin);`)
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
export function enableHd() { if (hdOn || getModelQuality() === 'low') return; hdOn = true; for (const a of hdQueue.splice(0)) upgradeHd(...a); }
function upgradeHd(id, meshes, tint) {
  if (!hdOn) { hdQueue.push([id, meshes, tint]); return; }
  if (!HD.has(id)) HD.set(id, loadModel(`${id}.hd`).catch(() => null));
  HD.get(id).then((g) => {
    if (!g) return;
    let src = null; g.scene.traverse((o) => { if (!src && o.isMesh) src = [].concat(o.material)[0]; });
    if (!src?.map) return;
    for (const o of meshes) {
      const mm = [].concat(o.material)[0]; if (!mm || mm.userData.hd) continue;
      const hd = charMaterial(src, id, tint); hd.userData.hd = true;
      o.material = hd;
    }
  });
}
const FIT = new Map();
const VIEWER = new THREE.Vector3(), _wp = new THREE.Vector3();
/** render3d gọi mỗi khung: vị trí camera (giãn nhịp hoạt ảnh nhân vật ở xa) */
export function setViewer(v) { VIEWER.copy(v); }
// chiều cao thật (m, tính cả búi tóc): nam 1,76, nữ 1,66 — trước đây mọi người chơi 1,9 m nên nhà cửa trông thấp bé
export const HEIGHT = { hero_m: 1.76, hero_f: 1.66, master: 1.74, npc_villager: 1.6, npc_merchant: 1.72 };
export async function createCharacter(id, { height = HEIGHT[id] || 1.72, tint = null } = {}) {
  const g = await loadModel(id);
  if (!g) return null;
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
  upgradeHd(id, skinned, tint);
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
    const name = names[i] || clip.name;
    const a = mixer.clipAction(clip);
    if (ONCE.has(name)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = false; }
    actions[name] = a;
  });
  let current = null, base = 'idle', acc = 0, tickN = Math.floor(Math.random() * 4);
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
  // tư thế bay độc bản (P15 — flight-poses.js): ngồi xếp bằng nếu cần, nghiêng thân, ngắm từng xương theo bảng
  function pose(P, t = 0) {
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
      if (tickN % every !== 0) return;
      mixer.update(acc); acc = 0;
    },
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
