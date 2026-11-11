// ============================================================================
//  Nạp mô hình GLB (tạo bằng Meshy, nén bằng scripts/meshy-pack.mjs) — public/models/<id>.glb
//  - loadModel(id): tải 1 lần, cache; lỗi / thiếu file → null (game dùng mô hình procedural).
//  - placeModel(...): nhân bản, co giãn theo kích thước đích, đặt đáy đúng độ cao.
//  - instanceModel(...): mô hình lặp nhiều chỗ (nhà, cây) → InstancedMesh theo từng mesh con.
// ============================================================================
import * as THREE from 'three';
import { span } from './perf.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import modelFiles from 'virtual:model-files';

const loader = new GLTFLoader();
// (không dùng MeshoptDecoder.useWorkers: worker của nó dựng từ Function.toString → bản build đã nén
// tên hàm thì vỡ «workerProcess is not defined», giải nén treo vô hạn)
loader.setMeshoptDecoder(MeshoptDecoder);
const cache = new Map();
const MODEL_FILES = new Set(modelFiles); // file GLB có thật (vite.config › modelFiles)

// Công trình «trùm» (Meshy 4K): 3 bản — <id>.hd.glb (texture 2048, máy mạnh), <id>.glb (1024), <id>.lod.glb (giản lược, xa)
export const HD_IDS = new Set(['palace_grand', 'tower_nine', 'sect_gate_grand', 'cliff_palace', 'city_gate', 'sky_palace']);
// model thư viện cộng đồng (CC0, scripts/meshy-pack-library.mjs) cũng có đủ 3 bản hd / thường / lod
// id đã kèm bậc (vd «lib_lantern.lod») thì không thăm dò bậc nữa (trước đây sinh yêu cầu «lib_lantern.lod.mid» thừa)
export const hasLod = (id) => !id.includes('.') && (HD_IDS.has(id) || id.startsWith('lib_') || id.startsWith('bq_'));
let modelQuality = 'mid';
export const getModelQuality = () => modelQuality;
export function setModelQuality(q) {
  modelQuality = q;
  // bản .hd 300k / texture 2048 chỉ khi tự bật: localStorage «huyenquan:models» = 'ultra'
  try { if (localStorage.getItem('huyenquan:models') === 'ultra') modelQuality = 'ultra'; } catch (e) { /* ignore */ }
}

// «Hâm nóng» trước khi đưa vào cảnh: biên dịch shader song song + đẩy texture lên GPU dần từng
// khung (render3d.js gán) → mô hình nạp giữa lúc chơi không làm khựng khung hình.
let warmHook = null;
export function setWarmup(fn) { warmHook = fn; }
async function warm(obj) { if (warmHook) { try { await warmHook(obj); } catch (e) { /* vẫn hiển thị */ } } }
export const warmObject = warm;

/** Có model này không (tra danh sách file lúc build, không tải) — công trình có bậc thì đủ khi có .far / .lod / bản gốc */
export async function modelAvailable(id) {
  if (MODEL_FILES.size) return MODEL_FILES.has(id) || (hasLod(id) && (MODEL_FILES.has(`${id}.vc`) || MODEL_FILES.has(`${id}.far`) || MODEL_FILES.has(`${id}.lod`)));
  return !!(await loadModel(hasLod(id) ? `${id}.lod` : id));
}
export function modelUrl(id) { return new URL(`models/${id}.glb`, document.baseURI).href; }

/** Bản RIÊNG (không chung bộ đệm loadModel): hình học / vật liệu không bị nơi khác sửa — nhà phố nhân bản (cityblocks3d)
 *  từng hiện hình nát vì dùng chung lưới với mô hình đặt trong Sơn Môn. Tệp vẫn lấy từ bộ đệm HTTP của trình duyệt. */
const priv = new Map();
export function loadModelPrivate(id) {
  if (MODEL_FILES.size && !MODEL_FILES.has(id)) return Promise.resolve(null);
  if (!priv.has(id)) priv.set(id, fetch(modelUrl(id)).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then((buf) => new Promise((res, rej) => loader.parse(buf, '', res, rej))).catch(() => null));
  return priv.get(id);
}
export function loadModel(id) {
  if (!cache.has(id) && MODEL_FILES.size && !MODEL_FILES.has(id)) cache.set(id, Promise.resolve(null)); // không có file → khỏi gửi yêu cầu
  if (!cache.has(id)) {
    cache.set(id, fetch(modelUrl(id)).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((buf) => new Promise((res, rej) => span('glb:' + id, () => loader.parse(buf, '', res, rej)))).then((g) => {
      g.scene.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        // vật liệu Meshy PBR: giữ nguyên, chỉ bật bóng + mipmap anisotropy
        for (const m of [].concat(o.material)) if (m.map) m.map.anisotropy = 4;
      });
      return g;
    }).catch((e) => { console.warn('[assets] không nạp được', id, e?.message || e); return null; }));
  }
  return cache.get(id);
}

// Kích thước khung bao của mô hình gốc (đã tính sẵn để co giãn).
function sizeOf(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  return { box, size: box.getSize(new THREE.Vector3()) };
}

/**
 * Đặt một bản sao mô hình.
 * @param fit { height | width | depth | max } — kích thước đích (m) theo một trục
 * @param at  { x, y, z, ry } — y là độ cao mặt đất (đáy mô hình đặt tại đây)
 */
export async function placeModel(parent, id, { fit = { max: 4 }, at = { x: 0, y: 0, z: 0, ry: 0 }, skinned = false, hd = true } = {}) {
  if (hasLod(id) && !skinned) return placeLod(parent, id, { fit, at, hd });
  const g = await loadModel(id);
  if (!g) return null;
  const obj = skinned ? cloneSkinned(g.scene) : g.scene.clone(true);
  const { size } = sizeOf(obj);
  const [k, v] = Object.entries(fit)[0];
  const ref = k === 'height' ? size.y : k === 'width' ? size.x : k === 'depth' ? size.z : Math.max(size.x, size.y, size.z);
  obj.scale.setScalar(v / (ref || 1));
  obj.rotation.y = at.ry || 0;
  obj.position.set(0, 0, 0);
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  obj.position.set(at.x - (b.min.x + b.max.x) / 2, at.y - b.min.y, at.z - (b.min.z + b.max.z) / 2);
  await warm(obj);
  parent.add(obj);
  return { obj, animations: g.animations };
}

// Công trình trùm / prop thư viện: THREE.LOD NẠP LƯỜI theo khoảng cách (2026-11-10, sửa tải 38 s / 11,7 triệu tam giác):
//   · lúc đặt chỉ nạp bản xa <id>.lod.glb (~12k, texture 512) → vào game nhanh, ít MB;
//   · tới gần trong farD × 1,3 mới nạp bản giữa <id>.mid.glb (~20k, texture 1024; thiếu thì .lod1);
//   · thật gần (nearD × 1,5) và máy không yếu mới nạp bản thường <id>.glb (~80k) — dùng tới nearD;
//   · bản .hd (300k, texture 2048) CHỈ khi người chơi tự chọn chất lượng «ultra».
// Biến đổi tính theo khung bao của bản đầu tiên nạp được rồi áp chung cho mọi bậc (cùng khung bao gốc).
const LAZY = [];
const nearDist = (v) => Math.max(v * 1.0, 8);   // bản thường 80k: chỉ khi sát (tượng 1,2 m → 8 m; điện 30 m → 30 m)
const farDist = (v) => Math.max(v * 3.5, 40);   // bản giữa 20k tới đây, xa hơn là .lod 12k
const cullDist = (v) => (v >= 40 ? Infinity : Math.max(v * 22, 320)); // vật nhỏ ở rất xa: ẩn hẳn (sương đã che gần hết)
async function placeLod(parent, id, { fit, at, hd = true }) {
  // bậc xa: .vc (~9k, màu nướng vào đỉnh — scripts/meshy-vclod.mjs; không đường nối UV nên không vỡ mảnh) — thiếu thì
  // .far / .lod cũ (giản lược gộp qua đường nối UV: nhìn gần vỡ mảnh, texture kéo sọc — ảnh người chơi 2026-11-11)
  const first = (await loadModel(`${id}.vc`)) ? `${id}.vc` : (await loadModel(`${id}.far`)) ? `${id}.far` : (await loadModel(`${id}.lod`)) ? `${id}.lod` : null;
  const vc = first === `${id}.vc`;
  const g0 = first ? await loadModel(first) : await loadModel(id);
  if (!g0) return null;
  const obj0 = g0.scene.clone(true);
  const { size } = sizeOf(obj0);
  const [k, v] = Object.entries(fit)[0];
  const ref = k === 'height' ? size.y : k === 'width' ? size.x : k === 'depth' ? size.z : Math.max(size.x, size.y, size.z);
  const lod = new THREE.LOD();
  const L = { id, lod, v, x: at.x, z: at.z, has: new Set(), busy: false, hd };
  // .vc dùng cho cả bậc giữa lẫn xa (bỏ .mid 20k — cũng vỡ mảnh khi nhìn gần): ngoài nearD là .vc, trong nearD là bản gốc
  if (first) { obj0.traverse((o) => { if (o.isMesh) o.castShadow = false; }); lod.addLevel(obj0, vc ? nearDist(v) : farDist(v), 0.08); L.has.add('far'); if (vc) L.has.add('mid'); L.farObj = obj0; }
  if (Number.isFinite(cullDist(v))) lod.addLevel(new THREE.Object3D(), cullDist(v));
  else { lod.addLevel(obj0, 0); L.has.add('near'); L.has.add('mid'); }
  lod.scale.setScalar(v / (ref || 1));
  lod.rotation.y = at.ry || 0;
  lod.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj0);
  lod.position.set(at.x - (b.min.x + b.max.x) / 2, at.y - b.min.y, at.z - (b.min.z + b.max.z) / 2);
  await warm(lod);
  parent.add(lod);
  LAZY.push(L);
  return { obj: lod, animations: [] };
}
async function addLazyLevel(L, tier) {
  L.busy = true;
  try {
    let g = null;
    if (tier === 'mid') g = (await loadModel(`${L.id}.mid`)) || (await loadModel(`${L.id}.lod1`));
    else g = (modelQuality === 'ultra' && L.hd && (await loadModel(`${L.id}.hd`))) || (await loadModel(L.id));
    L.has.add(tier);
    if (!g) return;
    const o = g.scene.clone(true);
    await warm(o);
    // bậc mới đặt ở khoảng: near → 0 ; mid → nearD (hoặc 0 nếu chưa có near)
    if (tier === 'near') {
      const mid = L.lod.levels.find((l) => l.object.userData.tier === 'mid');
      if (mid) mid.distance = nearDist(L.v);
      o.userData.tier = 'near';
      L.lod.addLevel(o, 0, 0.08);
    } else {
      o.userData.tier = 'mid';
      L.lod.addLevel(o, L.has.has('near') ? nearDist(L.v) : 0, 0.08); // trễ 8%: đứng / xoay camera sát ngưỡng không nhấp nháy bậc
    }
    // bậc xa không đổ bóng; bậc gần / giữa đổ bóng
    L.lod.updateMatrixWorld(true);
  } finally { L.busy = false; }
}
/** Gọi định kỳ (landmarks.update) với vị trí người chơi: nạp / nhả bậc chi tiết theo khoảng cách. */
let lazyBusy = 0;
export function tickLazyLods(px, pz) {
  tickInstances(px, pz);
  for (const L of LAZY) {
    if (L.busy || lazyBusy > 2) continue;
    const d = Math.hypot(L.x - px, L.z - pz);
    let tier = null;
    if (!L.has.has('mid') && d < farDist(L.v) * 1.3) tier = 'mid';
    else if (!L.has.has('near') && L.has.has('mid') && d < nearDist(L.v) * (modelQuality === 'low' ? 1.1 : 1.5)) tier = 'near'; // máy yếu cũng nạp bản gốc khi đứng sát (bản rút gọn nhìn gần vỡ mảnh)
    if (!tier) continue;
    lazyBusy++;
    addLazyLevel(L, tier).finally(() => { lazyBusy--; });
  }
}
/**
 * Màn nạp: chờ công trình quanh chỗ xuất phát lên bản giữa (.mid) — trước đây mở màn bằng bản xa 6k (thô, texture nhoè)
 * rồi mới nhảy bậc trước mắt người chơi. Nạp dồn (không giới hạn 2 việc / lượt) tới khi xong hoặc hết giờ.
 */
export async function settleLods(px, pz, R = 90, ms = 5000) {
  const t0 = performance.now();
  const pending = () => LAZY.some((L) => !L.has.has('mid') && Math.hypot(L.x - px, L.z - pz) < Math.min(R, farDist(L.v) * 1.3))
    || INST.some((E) => E.upgrade && !E.upgrade.done && E.items.some((it) => Math.hypot(it.x - px, it.z - pz) < Math.min(R, E.upgrade.near)));
  while (pending() && performance.now() - t0 < ms) {
    tickInstances(px, pz);
    for (const L of LAZY) if (!L.busy && !L.has.has('mid') && Math.hypot(L.x - px, L.z - pz) < Math.min(R, farDist(L.v) * 1.3)) { lazyBusy++; addLazyLevel(L, 'mid').finally(() => { lazyBusy--; }); }
    await new Promise((r) => setTimeout(r, 120));
  }
}
export const lazyLodStats = () => ({ n: LAZY.length, mid: LAZY.filter((l) => l.has.has('mid')).length, near: LAZY.filter((l) => l.has.has('near')).length });

/**
 * Nhân bản tức thời: mỗi mesh con của GLB → 1 InstancedMesh (đủ cho nhà, cây lặp hàng chục lần).
 * items: [{ x, y, z, ry, s }] — s = kích thước đích theo `fitKey`.
 */
export async function instanceModel(parent, id, items, { fitKey = 'height' } = {}) {
  // model thư viện (80k+) nhân bản → bản xa nhẹ (.far / .lod) lúc dựng. Ít bản (≤ 4: đình, tháp, vài cây cảnh)
  // thì khi người chơi tới gần mới nạp thêm bản giữa .mid (20k) và thay vào (2026-11-10: trước đây nạp .mid ngay
  // trên màn nạp — ~5 MB cho các công trình chưa chắc đã nhìn thấy gần).
  const tiers = [`${id}.vc`, `${id}.far`, `${id}.lod`, `${id}.mid`, id];
  let g = null; if (hasLod(id)) { for (const t of tiers) if ((g = await loadModel(t))) break; } else g = await loadModel(id);
  if (!g || !items.length) return null;
  const group = new THREE.Group();
  let sets = buildInstanced(g, items, fitKey, group);
  await warm(group);
  parent.add(group);
  // nhân bản rải rộng (hàng cây, cổng phường, đèn…): chỉ vẽ các bản trong tầm — bản sao ngoài tầm vẫn tốn
  // cả lượt vẽ lẫn lượt bóng vì khung bao của InstancedMesh phủ hết. Va chạm đã cắt lát lúc dựng (không phụ thuộc).
  const E = { items, sets, lo: sets, hi: null, group, cut: Math.max(Math.max(...items.map((it) => it.s)) * 24, 260), lx: Infinity, lz: Infinity, cull: items.length > 3 };
  if (hasLod(id) && items.length <= 4) {
    const near = Math.max(Math.max(...items.map((it) => it.s)) * 4, 70);
    E.upgrade = { near, busy: false, done: false, run: async () => {
      const gm = (await loadModel(id)) || (await loadModel(`${id}.mid`)); if (!gm) return; // tới gần: bản gốc (bản .mid nhìn gần vỡ mảnh)
      const tmp = new THREE.Group(); const ns = buildInstanced(gm, items, fitKey, tmp);
      await warm(tmp);
      for (const { im } of E.sets) group.remove(im);
      for (const { im } of ns) group.add(im);
      sets = E.sets = E.hi = ns; E.lx = Infinity;
    } };
  }
  if (E.cull || E.upgrade) INST.push(E);
  return group;
}
function buildInstanced(g, items, fitKey, group) {
  const root = g.scene;
  root.updateMatrixWorld(true);
  const { box, size } = sizeOf(root);
  const ref = fitKey === 'height' ? size.y : fitKey === 'width' ? size.x : Math.max(size.x, size.y, size.z);
  const center = box.getCenter(new THREE.Vector3());
  const M = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  const sets = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const im = new THREE.InstancedMesh(o.geometry, o.material, items.length);
    im.castShadow = true; im.receiveShadow = true;
    const all = new Float32Array(items.length * 16);
    items.forEach((it, i) => {
      const k = it.s / (ref || 1);
      // dời gốc mô hình về (tâm x/z, đáy y), co giãn, xoay, đặt vào thế giới
      base.makeTranslation(-center.x, -box.min.y, -center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
      q.setFromAxisAngle(up, it.ry || 0);
      M.compose(new THREE.Vector3(it.x, it.y, it.z), q, new THREE.Vector3(1, 1, 1)).multiply(base).multiply(o.matrixWorld);
      im.setMatrixAt(i, M); M.toArray(all, i * 16);
    });
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
    sets.push({ im, all });
  });
  return sets;
}
const INST = [];
function tickInstances(px, pz) {
  for (const E of INST) {
    const U = E.upgrade;
    if (U && !U.busy && !U.done && E.items.some((it) => Math.hypot(it.x - px, it.z - pz) < U.near)) { U.busy = true; U.run().catch(() => {}).finally(() => { U.busy = false; U.done = true; }); }
    // bản gốc chỉ khi còn ở gần; đi xa (> 1,5 × tầm nâng) trả về bản nhẹ — trước đây nâng rồi giữ mãi: 2 đèn lồng 80k
    // tam giác vẫn vẽ (cả bóng) khi người chơi ở cách 640 m (đo 2026-11-12: 160k tam giác / khung)
    if (U && U.done && E.hi) {
      const want = E.items.some((it) => Math.hypot(it.x - px, it.z - pz) < U.near * 1.5) ? E.hi : E.lo;
      if (E.sets !== want) { for (const { im } of E.sets) E.group.remove(im); for (const { im } of want) E.group.add(im); E.sets = want; E.lx = Infinity; }
    }
    if (!E.cull || Math.hypot(px - E.lx, pz - E.lz) < 20) continue;
    E.lx = px; E.lz = pz;
    const keep = [];
    E.items.forEach((it, i) => { if (Math.hypot(it.x - px, it.z - pz) < E.cut) keep.push(i); });
    for (const { im, all } of E.sets) {
      const dst = im.instanceMatrix.array;
      keep.forEach((i, n) => dst.set(all.subarray(i * 16, i * 16 + 16), n * 16));
      im.count = keep.length; im.visible = keep.length > 0; im.instanceMatrix.needsUpdate = true;
    }
  }
}

/**
 * Nhân bản tức thời có 2 mức chi tiết: gần dùng <id>.glb, xa dùng <id>.lod.glb.
 * Trả { group, update(px, pz) } — gọi update định kỳ (landmarks.update) để chia lại gần/xa.
 */
export async function instanceModelLod(parent, id, items, { fitKey = 'height', near = 45 } = {}) {
  const [gM, gF] = await Promise.all([loadModel(id), (await loadModel(`${id}.vc`)) || loadModel(`${id}.lod`)]); // gần: bản gốc · xa: .vc (không vỡ mảnh)
  const gN = gM || (hasLod(id) ? await loadModel(`${id}.mid`) : null);
  if (!gN || !items.length) return null;
  const build = (g) => {
    const root = g.scene; root.updateMatrixWorld(true);
    const { box, size } = sizeOf(root);
    const ref = fitKey === 'height' ? size.y : fitKey === 'width' ? size.x : Math.max(size.x, size.y, size.z);
    const center = box.getCenter(new THREE.Vector3());
    const meshes = [];
    root.traverse((o) => {
      if (!o.isMesh) return;
      const im = new THREE.InstancedMesh(o.geometry, o.material, items.length);
      im.castShadow = true; im.receiveShadow = true; im.count = 0; im.frustumCulled = false;
      meshes.push({ im, local: o.matrixWorld.clone() });
    });
    return { meshes, ref, center, minY: box.min.y };
  };
  const N = build(gN), F = gF ? build(gF) : null;
  const group = new THREE.Group();
  for (const m of N.meshes) group.add(m.im);
  if (F) for (const m of F.meshes) group.add(m.im);
  await warm(group);
  parent.add(group);
  const M = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  const write = (set, list) => {
    for (const { im, local } of set.meshes) {
      list.forEach((it, i) => {
        const k = it.s / (set.ref || 1);
        base.makeTranslation(-set.center.x, -set.minY, -set.center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
        q.setFromAxisAngle(up, it.ry || 0);
        M.compose(P.set(it.x, it.y, it.z), q, one).multiply(base).multiply(local);
        im.setMatrixAt(i, M);
      });
      im.count = list.length; im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
    }
  };
  // null (không phải ''): lần đầu danh sách «gần» rỗng có khoá '' — so với '' sẽ bỏ qua lần ghi đầu,
  // mọi bản sao ở lại count 0 → cắt lát va chạm thấy 0 nhà (cả dãy phố đi xuyên được)
  let lastKey = null;
  const update = (px, pz) => {
    const nearL = [], farL = [];
    for (const it of items) (Math.hypot(it.x - px, it.z - pz) < near || !F ? nearL : farL).push(it);
    const key = nearL.map((it) => items.indexOf(it)).join(',');
    if (key === lastKey) return;
    lastKey = key;
    write(N, nearL); if (F) write(F, farL);
  };
  update(Infinity, Infinity);
  return { group, update };
}
