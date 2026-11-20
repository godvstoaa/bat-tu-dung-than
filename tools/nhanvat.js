// Trang xem nhân vật: window.nv.glb(url, { h, anim, t }) → ảnh 3 ô (toàn thân trước, 3/4, cận mặt) + số đo
// Dùng để so model hiện có (public/models) với model ứng viên Meshy cùng ánh sáng, cùng góc, cùng chiều cao.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
const W = 1500, H = 900;
const rd = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
rd.setSize(W, H); rd.toneMapping = THREE.ACESFilmicToneMapping; rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap; rd.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(rd.domElement);
const sc = new THREE.Scene(); sc.background = new THREE.Color('#bcd0dc'); sc.fog = new THREE.Fog('#bcd0dc', 30, 120);
sc.add(new THREE.HemisphereLight('#dfeaf2', '#5a5640', 1.2));
const sun = new THREE.DirectionalLight('#fff1dc', 2.6); sun.position.set(4, 8, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 30 }); sun.shadow.bias = -0.0003; sc.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#8a8670', roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; sc.add(ground);
const held = new THREE.Group(); sc.add(held);
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const CACHE = new Map();
window.nv = {
  // url: đường dẫn GLB; h: chiều cao đích (m); anim: chỉ số / tên clip để dựng tư thế; t: giây trong clip
  async glb(url, { h = 1.75, anim = null, t = 0.4, label = '', clipsFrom = null } = {}) {
    held.clear();
    let g = CACHE.get(url); if (!g) { g = await loader.loadAsync(url); CACHE.set(url, g); }
    const o = cloneSkinned(g.scene);
    let tris = 0, bones = 0, skinned = 0, mats = new Set(), tex = new Set(), verts = 0;
    o.traverse((m) => {
      if (m.isBone) bones++;
      if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (m.isSkinnedMesh) skinned++; m.frustumCulled = false;
        tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; verts += m.geometry.attributes.position.count;
        for (const mt of [].concat(m.material)) { mats.add(mt); for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) if (mt[k]?.image) tex.add(`${k}:${mt[k].image.width}`); } }
    });
    const mixer = new THREE.AnimationMixer(o);
    // clipsFrom: lấy clip của GLB khác (cùng tên xương MeshyRig) — kiểm tra ghép hoạt ảnh cũ vào model mới; bỏ rãnh vị trí (khác cỡ xương)
    let anims = g.animations;
    if (clipsFrom) { let g2 = CACHE.get(clipsFrom); if (!g2) { g2 = await loader.loadAsync(clipsFrom); CACHE.set(clipsFrom, g2); } anims = window.nvMode === 'local' ? window.nv.retarget(g2, g, 'pre') : window.nv.bake(g2, g); }
    const clips = anims.map((c) => `${c.name}(${c.duration.toFixed(1)}s)`);
    if (anims.length && anim != null) { const c = typeof anim === 'number' ? anims[anim] : anims.find((x) => x.name === anim); if (c) { mixer.clipAction(c).play(); mixer.update(t); } }
    o.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(o, true), s = b.getSize(new THREE.Vector3()), k = h / (s.y || 1);
    o.scale.multiplyScalar(k); o.position.set(-(b.min.x + b.max.x) / 2 * k, -b.min.y * k, -(b.min.z + b.max.z) / 2 * k);
    held.add(o); o.updateMatrixWorld(true);
    // 3 ô: trước toàn thân | 3/4 toàn thân | cận đầu-vai (mặt chiếm khung)
    rd.setScissorTest(true); const cw = W / 3;
    const views = [
      { pos: [0, h * 0.55, 4.0], at: [0, h * 0.5, 0], fov: 34 },
      { pos: [2.6, h * 0.62, 2.9], at: [0, h * 0.5, 0], fov: 34 },
      { pos: [0.25, h * 0.9, 0.95], at: [0, h * 0.88, 0], fov: 30 },
    ];
    views.forEach((v, i) => { const cam = new THREE.PerspectiveCamera(v.fov, cw / H, 0.05, 200); cam.position.set(...v.pos); cam.lookAt(...v.at); rd.setViewport(i * cw, 0, cw, H); rd.setScissor(i * cw, 0, cw, H); rd.render(sc, cam); });
    rd.setScissorTest(false);
    const png = rd.domElement.toDataURL('image/jpeg', 0.85);
    return { png, info: { label, tris: Math.round(tris), verts, bones, skinned, mats: mats.size, tex: [...tex], clips, rawH: +s.y.toFixed(3), ratioWH: +(s.x / s.y).toFixed(2) } };
  },
};
// ghép hoạt ảnh giữa 2 rig MeshyRig khác tư thế nghỉ: delta = inv(nghỉ nguồn)·q, q' = nghỉ đích·delta (mode 'pre') hoặc q·inv(nguồn)·đích ('post')
window.nv.retarget = (src, dst, mode = 'pre') => {
  const rest = (g) => { const m = {}; g.scene.traverse((o) => { if (o.isBone) m[o.name] = { q: o.quaternion.clone(), p: o.position.clone() }; }); return m; };
  const S = rest(src), D = rest(dst);
  const k = D.Hips && S.Hips ? D.Hips.p.length() / (S.Hips.p.length() || 1) : 1;
  const q = new THREE.Quaternion(), a = new THREE.Quaternion();
  return src.animations.map((c) => new THREE.AnimationClip(c.name, c.duration, c.tracks.flatMap((tr) => {
    const [bn, prop] = tr.name.split('.'); const s = S[bn], d = D[bn]; if (!s || !d) return [];
    if (prop === 'quaternion') { const v = tr.values.slice(); const si = s.q.clone().invert();
      for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i); if (mode === 'pre') a.copy(d.q).multiply(si).multiply(q); else a.copy(q).multiply(si).multiply(d.q); a.toArray(v, i); }
      return [new THREE.QuaternionKeyframeTrack(tr.name, tr.times, v)]; }
    if (prop === 'position' && bn === 'Hips') { const v = tr.values.slice(); for (let i = 0; i < v.length; i += 3) { v[i] = d.p.x + (v[i] - s.p.x) * k; v[i + 1] = d.p.y + (v[i + 1] - s.p.y) * k; v[i + 2] = d.p.z + (v[i + 2] - s.p.z) * k; } return [new THREE.VectorKeyframeTrack(tr.name, tr.times, v)]; }
    return [];
  })));
};
// ghép theo KHÔNG GIAN THẾ GIỚI: mỗi khung, độ xoay thế giới của xương nguồn so với tư thế nghỉ nguồn được áp lên xương đích
// (Wd = Ws·Ws_nghỉ⁻¹·Wd_nghỉ), rồi đổi về cục bộ theo cha đích. Không phụ thuộc trục cục bộ / nút Armature của từng rig.
window.nv.bake = (src, dst, fps = 30, only = null) => {
  const sObj = cloneSkinned(src.scene), dObj = cloneSkinned(dst.scene);
  const bones = (o) => { const m = {}; o.traverse((b) => { if (b.isBone) m[b.name] = b; }); return m; };
  const SB = bones(sObj), DB = bones(dObj);
  sObj.updateMatrixWorld(true); dObj.updateMatrixWorld(true);
  const names = Object.keys(DB).filter((n) => SB[n]);
  // thứ tự cha trước con
  const depth = (b) => { let d = 0; while (b.parent) { d++; b = b.parent; } return d; };
  names.sort((a, b) => depth(DB[a]) - depth(DB[b]));
  const wq = (b) => b.getWorldQuaternion(new THREE.Quaternion());
  // tư thế nghỉ = tư thế gắn da (inverseBindMatrices), KHÔNG phải TRS của nút (Meshy ghi TRS = một khung hoạt ảnh)
  const bind = (o) => { const m = {}; o.traverse((x) => { if (x.isSkinnedMesh) x.skeleton.bones.forEach((b, i) => { if (m[b.name]) return; const M = x.skeleton.boneInverses[i].clone().invert(); const p = new THREE.Vector3(), r = new THREE.Quaternion(), sc = new THREE.Vector3(); M.decompose(p, r, sc); m[b.name] = { r, p }; }); }); return m; };
  const SBind = bind(sObj), DBind = bind(dObj);
  // bù khác biệt tư thế nghỉ (T ↔ A): C xoay hướng xương nghỉ đích về hướng xương nghỉ nguồn → Wd = Ws·Ws_nghỉ⁻¹·C·Wd_nghỉ
  // (xương lá — bàn tay, đầu, ngón chân — dùng C của xương cha để cổ tay không gập)
  const child = {}; for (const n of names) { const c = SB[n].children.find((x) => x.isBone && DB[x.name] && SBind[x.name] && DBind[x.name]); if (c) child[n] = c.name; }
  const Cq = {};
  for (const n of names) {
    if (child[n] && SBind[n] && DBind[n] && !/Hips|Spine|neck|Head/.test(n)) {
      const sd = SBind[child[n]].p.clone().sub(SBind[n].p).normalize(), dd = DBind[child[n]].p.clone().sub(DBind[n].p).normalize();
      Cq[n] = new THREE.Quaternion().setFromUnitVectors(dd, sd);
    }
  }
  for (const n of names) if (!Cq[n]) { let p = SB[n].parent; while (p && p.isBone && !Cq[p.name]) p = p.parent; Cq[n] = p && p.isBone && Cq[p.name] && !/Hips|Spine|neck|Head/.test(n) ? Cq[p.name] : new THREE.Quaternion(); }
  const sRest = {}, dRest = {}, dRestLocal = {}; for (const n of names) { sRest[n] = SBind[n]?.r || wq(SB[n]); dRest[n] = Cq[n].clone().multiply(DBind[n]?.r || wq(DB[n])); dRestLocal[n] = DB[n].quaternion.clone(); }
  const sHip0 = SB.Hips.getWorldPosition(new THREE.Vector3()), dHip0 = DB.Hips.getWorldPosition(new THREE.Vector3());
  const sRoot = new THREE.Box3().setFromObject(sObj, true), dRoot = new THREE.Box3().setFromObject(dObj, true);
  const k = (dHip0.y - dRoot.min.y) / ((sHip0.y - sRoot.min.y) || 1);
  const mixer = new THREE.AnimationMixer(sObj);
  const q = new THREE.Quaternion(), pq = new THREE.Quaternion(), v = new THREE.Vector3(), m4 = new THREE.Matrix4();
  return src.animations.filter((c) => !only || only.includes(c.name)).map((c) => {
    mixer.stopAllAction(); const act = mixer.clipAction(c); act.reset().play();
    const N = Math.max(2, Math.round(c.duration * fps) + 1), times = new Float32Array(N);
    const qv = Object.fromEntries(names.map((n) => [n, new Float32Array(N * 4)])), hp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t = Math.min(c.duration, i / fps); times[i] = t; mixer.setTime(t); sObj.updateMatrixWorld(true);
      for (const n of names) {
        q.copy(wq(SB[n])).multiply(sRest[n].clone().invert()).multiply(dRest[n]); // thế giới đích mong muốn
        const par = DB[n].parent; par.getWorldQuaternion(pq); const loc = pq.invert().multiply(q);
        DB[n].quaternion.copy(loc); DB[n].updateMatrixWorld(true); loc.toArray(qv[n], i * 4);
      }
      // hông: dời theo nguồn (tỉ lệ chiều cao hông), đổi về khung cha
      SB.Hips.getWorldPosition(v); v.sub(sHip0).multiplyScalar(k).add(dHip0);
      m4.copy(DB.Hips.parent.matrixWorld).invert(); v.applyMatrix4(m4); v.toArray(hp, i * 3);
    }
    act.stop();
    for (const n of names) DB[n].quaternion.copy(dRestLocal[n]);
    const tracks = names.map((n) => new THREE.QuaternionKeyframeTrack(`${n}.quaternion`, times, qv[n]));
    tracks.push(new THREE.VectorKeyframeTrack('Hips.position', times, hp));
    return new THREE.AnimationClip(c.name, c.duration, tracks);
  });
};
// đóng gói: lưới + xương của model mới (src) + clip của model cũ (clipsFrom) đã ghép, đúng thứ tự tên đích (names)
// → GLB base64. Bỏ hoạt ảnh gốc của model mới (game đọc clip theo THỨ TỰ, characters.js CHAR_ANIMS).
// preset Meshy (thư viện ~600 động tác, gắn trên khung xương Mixamo 66 xương — assets-meshy/library/chars/preset/):
// 'preset:<Tên>' = khung có da _armature.glb + clip <Tên>.glb; đổi tên xương Mixamo → MeshyRig để nv.bake khớp theo tên
const PRESET_DIR = '/assets-meshy/library/chars/preset/';
const MIX2MR = { Spine1: 'Spine01', Spine2: 'Spine02', Neck: 'neck', HeadTop_End: 'head_end' };
const mixName = (n) => { const b = n.replace(/^mixamorig[:_]?/, ''); return MIX2MR[b] || b; };
let PRESET_ARM = null;
async function loadPreset(name) {
  if (!PRESET_ARM) { PRESET_ARM = await loader.loadAsync(PRESET_DIR + '_armature.glb'); PRESET_ARM.scene.traverse((o) => { if (o.isBone) o.name = mixName(o.name); }); }
  const an = await loader.loadAsync(PRESET_DIR + name + '.glb');
  const c = an.animations[0].clone(); c.name = name;
  for (const t of c.tracks) { const i = t.name.lastIndexOf('.'); t.name = mixName(t.name.slice(0, i)) + t.name.slice(i); }
  return { scene: PRESET_ARM.scene, animations: [c] };
}
window.nv.loadPreset = loadPreset;
window.nv.pack = async (src, spec) => {
  // spec: [[tên đích, url GLB nguồn clip, tên clip nguồn], …] — ghép từng clip sang xương model mới, đặt tên đích
  const g = await loader.loadAsync(src); const byFile = new Map();
  for (const [as, from, name] of spec) { if (!byFile.has(from)) byFile.set(from, []); byFile.get(from).push([as, name]); }
  const out = [], miss = [];
  for (const [from, list] of byFile) {
    const g2 = from.startsWith('preset:') ? await loadPreset(from.slice(7)) : await loader.loadAsync(from);
    const baked = window.nv.bake(g2, g, 30, list.map((x) => x[1]));
    for (const [as, name] of list) { const c = baked.find((x) => x.name === name); if (!c) { miss.push(name); continue; } const k = c.clone(); k.name = as; out.push(k); }
  }
  out.sort((a, b) => spec.findIndex((x) => x[0] === a.name) - spec.findIndex((x) => x[0] === b.name));
  // spec[3] = { arms: 0..1 }: tay (vai → ngón) lấy theo clip idle, trộn arms phần của clip gốc
  // (tay áo rộng của hero_f vỡ khi giơ tay: cúi chào giữ tay như lúc đứng, vẫy tay giảm biên độ)
  const idle = out.find((c) => c.name === 'idle');
  for (const [as, , , opt] of spec) {
    const c = out.find((x) => x.name === as); if (!opt || !c || !idle) continue;
    for (const tr of c.tracks) {
      if (!/Shoulder|Arm|Hand/i.test(tr.name) || !tr.name.endsWith('.quaternion')) continue;
      const it = idle.tracks.find((x) => x.name === tr.name); if (!it) continue;
      const ip = it.createInterpolant(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
      for (let i = 0; i < tr.times.length; i++) {
        const v = ip.evaluate(tr.times[i] % idle.duration); qa.fromArray(v); qb.fromArray(tr.values, i * 4);
        qa.slerp(qb, opt.arms).toArray(tr.values, i * 4);
      }
    }
  }
  const glb = await new GLTFExporter().parseAsync(g.scene, { binary: true, animations: out, onlyVisible: false });
  const u8 = new Uint8Array(glb); let b = ''; for (let i = 0; i < u8.length; i += 0x8000) b += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { b64: btoa(b), clips: out.map((c) => `${c.name}:${c.duration.toFixed(1)}s`), miss };
};
window.nvReady = true;
// đo mắt cho chớp mắt (characters.js EYES): nv.face(url,{h}) → ảnh chính diện đầu 900×900 (tư thế gốc, không ánh nắng gắt);
// nv.pick([[x,y],…]) → toạ độ UV dưới các điểm ảnh đó (bắn tia vào lưới đã gắn xương)
let FACE = null;
window.nv.face = async (url, { h = 1.75, up = 0.09, dist = 0.42, size = 900 } = {}) => {
  held.clear();
  let g = CACHE.get(url); if (!g) { g = await loader.loadAsync(url); CACHE.set(url, g); }
  const o = cloneSkinned(g.scene); o.traverse((m) => { if (m.isMesh) m.frustumCulled = false; });
  o.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(o, true), s = b.getSize(new THREE.Vector3()), k = h / (s.y || 1);
  o.scale.multiplyScalar(k); o.position.set(-(b.min.x + b.max.x) / 2 * k, -b.min.y * k, -(b.min.z + b.max.z) / 2 * k);
  held.add(o); o.updateMatrixWorld(true);
  let head = null; o.traverse((x) => { if (x.isBone && /^head$/i.test(x.name)) head = x; });
  const hp = head ? head.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(0, h * 0.9, 0);
  const at = hp.clone().add(new THREE.Vector3(0, up, 0));
  const cam = new THREE.PerspectiveCamera(30, 1, 0.02, 50); cam.position.set(at.x, at.y, at.z + dist); cam.lookAt(at);
  rd.setSize(size, size); rd.setViewport(0, 0, size, size); rd.render(sc, cam);
  const png = rd.domElement.toDataURL('image/jpeg', 0.9); rd.setSize(W, H);
  FACE = { cam, o };
  return { png, head: head?.name || null };
};
window.nv.pick = (pts) => {
  const rc = new THREE.Raycaster(), out = [];
  for (const [x, y] of pts) {
    rc.setFromCamera(new THREE.Vector2(x * 2 - 1, 1 - y * 2), FACE.cam);
    const hit = rc.intersectObject(FACE.o, true).find((h) => h.uv);
    out.push(hit ? [+hit.uv.x.toFixed(4), +hit.uv.y.toFixed(4)] : null);
  }
  return out;
};
// mắt bền hơn: lưới 7×7 điểm quanh mắt, giữ điểm cùng độ sâu (±2 cm, bỏ tóc mái phía trước) và cùng mảnh UV với tâm,
// khớp bình phương tối thiểu uv = U0 + J·(s − c) → tâm UV, trục góc mắt a, trục mí trên b, tỉ lệ điểm cùng mảnh (phủ)
window.nv.eye = (c, o, t) => {
  const rc = new THREE.Raycaster();
  const hitsAt = (x, y) => { rc.setFromCamera(new THREE.Vector2(x * 2 - 1, 1 - y * 2), FACE.cam); return rc.intersectObject(FACE.o, true).filter((h) => h.uv); };
  const h0 = hitsAt(...c)[0]; if (!h0) return null;
  const d0 = h0.distance, u0 = h0.uv.clone();
  const ax = [o[0] - c[0], o[1] - c[1]], by = [t[0] - c[0], t[1] - c[1]];
  const S = [];
  let tot = 0;
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
    const s = [c[0] + ax[0] * i / 2.5 + by[0] * j / 1.5, c[1] + ax[1] * i / 2.5 + by[1] * j / 1.5]; tot++;
    const h = hitsAt(...s).sort((p, q) => Math.abs(p.distance - d0) - Math.abs(q.distance - d0))[0];
    if (!h || Math.abs(h.distance - d0) > 0.02 || h.uv.distanceTo(u0) > 0.06) continue;
    S.push([s[0] - c[0], s[1] - c[1], h.uv.x, h.uv.y]);
  }
  // giải 3×3 (1, dx, dy) cho từng thành phần uv
  const fit = (k) => { const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], v = [0, 0, 0];
    for (const p of S) { const r = [1, p[0], p[1]]; for (let a = 0; a < 3; a++) { v[a] += r[a] * p[k]; for (let b = 0; b < 3; b++) M[a][b] += r[a] * r[b]; } }
    const m = new THREE.Matrix3().set(...M[0], ...M[1], ...M[2]).invert().elements; // cột chính
    return [0, 1, 2].map((a) => m[a] * v[0] + m[3 + a] * v[1] + m[6 + a] * v[2]); };
  const U = fit(2), V = fit(3);
  const J = (d) => [U[1] * d[0] + U[2] * d[1], V[1] * d[0] + V[2] * d[1]];
  const r4 = (x) => +x.toFixed(5);
  return { c: [r4(U[0]), r4(V[0])], a: J(ax).map(r4), b: J(by).map(r4), cover: +(S.length / tot).toFixed(2) };
};
