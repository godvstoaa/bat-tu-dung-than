// scripts/tmp/fix-sky-glbs.mjs — vá 2 GLB quận đảo bay (chạy 1 lần, giữ làm bằng chứng):
//  1) lib_cau_van*.glb: xuất Blender gộp 24 linked-duplicate thành EXT_mesh_gpu_instancing
//     → GLB chứa CẢ DÃY 4 cầu (286 m). buildInstanced (assets.js) bỏ rơi instanceMatrix nên
//     mỗi cấu kiện render đúng 1/24 nội dung, ref=bbox 286 m → k=40/286=0,14 → bụi vô hình.
//     Vá: bake ƯỚT DUY NHẤT instance hàng cầu 1 (z=0, x nhỏ nhất) vào node.matrix, bỏ extension
//     → GLB = 1 cấu kiện 40 m đúng như landmarks.js giả định «một GLB = một cấu kiện».
//  2) lib_noi_that*.glb: 4 đạo cụ sai tỉ lệ ngay trong GLB (đo bằng GLTFLoader — đường nạp game):
//     nt_anthu 27,26×2,73×1,29 (thiết kế 2,2×0,7×1,05), nt_den_long_lon dẹt 1 cm, bình phong +
//     lư bạc sơn lơ lửng trên không. Vá: thay TRS node bằng ma trận nắn khung bao thế giới về
//     đúng HỘP THIẾT KẾ (gen_noi_that.py), đáy chạm y=0, tâm x/z=0 — placeProp chỉ cần fit chiều
//     cao là đúng tỉ lệ trở lại.
// Đo bằng three GLTFLoader + MeshoptDecoder (đúng đường decode của src/game/assets.js).
import './stub-dom.mjs';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

function readGlb(path) {
  const b = fs.readFileSync(path);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error('không phải GLB');
  const jsonLen = b.readUInt32LE(12);
  const json = JSON.parse(b.subarray(20, 20 + jsonLen).toString('utf8'));
  let off = 20 + jsonLen;
  const binLen = b.readUInt32LE(off);
  const bin = b.subarray(off + 8, off + 8 + binLen);
  const raw = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); // GLB nguyên vẹn cho loader.parse
  return { json, bin, raw };
}
function writeGlb(path, json, bin) {
  let jb = Buffer.from(JSON.stringify(json));
  while (jb.length % 4) jb = Buffer.concat([jb, Buffer.from(' ')]);
  let bb = Buffer.from(bin);
  while (bb.length % 4) bb = Buffer.concat([bb, Buffer.alloc(1)]);
  const total = 12 + 8 + jb.length + 8 + bb.length;
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0); out.writeUInt32LE(2, 4); out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jb.length, 12); out.write('JSON', 16, 'ascii'); jb.copy(out, 20);
  let o = 20 + jb.length;
  out.writeUInt32LE(bb.length, o); out.write('BIN\0', o + 4, 'ascii'); bb.copy(out, o + 8);
  fs.writeFileSync(path, out);
}
async function loadScene(path) {
  const { json, bin, raw } = readGlb(path);
  const g = await new Promise((res, rej) => loader.parse(raw, '', res, rej));
  g.scene.updateMatrixWorld(true);
  return { gltf: g, json, bin, raw };
}

// ---------------- 1) lib_cau_van: giữ 1 instance ----------------
async function fixCauVan(path) {
  const { gltf, json, bin, raw } = await loadScene(path);
  // mọi InstancedMesh theo thứ tự duyệt = thứ tự node có extension trong JSON
  const instanced = [];
  gltf.scene.traverse((o) => { if (o.isInstancedMesh) instanced.push(o); });
  const extNodes = (json.scenes[json.scene].nodes ?? []).map((i) => json.nodes[i]).filter((n) => n.extensions?.EXT_mesh_gpu_instancing);
  // nhóm InstancedMesh theo node: mesh đa primitive sinh nhiều InstancedMesh chung 1 bộ instance
  const byInst = new Map();
  for (const o of instanced) {
    const m = new THREE.Matrix4(); o.getMatrixAt(0, m);
    const key = m.toArray().map((v) => v.toFixed(4)).join(',');
    if (!byInst.has(key)) byInst.set(key, []);
    byInst.get(key).push(o);
  }
  const groups = [...byInst.values()];
  if (extNodes.length !== groups.length) throw new Error(`kỳ vọng ${groups.length} node extension, có ${extNodes.length}`);
  // ướt duy nhất instance hàng cầu 1: |z| nhỏ nhất, rồi x nhỏ nhất
  const pick = (o) => {
    let best = -1;
    const m = new THREE.Matrix4(), p = new THREE.Vector3();
    for (let i = 0; i < o.count; i++) {
      o.getMatrixAt(i, m); p.setFromMatrixPosition(m);
      const b0 = best < 0 ? null : (() => { const q = new THREE.Matrix4(); o.getMatrixAt(best, q); return new THREE.Vector3().setFromMatrixPosition(q); })();
      if (best < 0 || Math.abs(p.z) < Math.abs(b0.z) - 1e-4 || (Math.abs(p.z - b0.z) < 1e-4 && p.x < b0.x)) best = i;
    }
    const q = new THREE.Matrix4(); o.getMatrixAt(best, q);
    return q;
  };
  extNodes.forEach((n, i) => {
    const keep = pick(groups[i][0]);
    for (const o of groups[i]) { // kiểm tra mọi mesh trong nhóm cùng bộ instance
      const m0 = pick(o);
      if (m0.toArray().map((v) => +v.toFixed(4)).join(',') !== keep.toArray().map((v) => +v.toFixed(4)).join(',')) throw new Error('instance lệch giữa các primitive cùng node');
    }
    delete n.extensions.EXT_mesh_gpu_instancing;
    if (!Object.keys(n.extensions).length) delete n.extensions;
    delete n.translation; delete n.rotation; delete n.scale;
    n.matrix = keep.toArray().map((v) => +v.toFixed(6)); // column-major như glTF
  });
  json.extensionsUsed = (json.extensionsUsed ?? []).filter((e) => e !== 'EXT_mesh_gpu_instancing');
  writeGlb(path, json, bin);
  // đo lại
  const after = await loadScene(path);
  let inst = 0; after.gltf.scene.traverse((o) => { if (o.isInstancedMesh) inst++; });
  const b = new THREE.Box3().setFromObject(after.gltf.scene);
  const s = b.getSize(new THREE.Vector3());
  console.log(`[cau_van] ${path}: còn ${inst} InstancedMesh; đơn vị = ${s.x.toFixed(2)} × ${s.y.toFixed(2)} × ${s.z.toFixed(2)}  min=${b.min.toArray().map((v) => +v.toFixed(2))}`);
}

// ---------------- 2) lib_noi_that: nắn khung bao về hộp thiết kế ----------------
// hộp thiết kế (gen_noi_that.py): x/z đối xứng, đáy y=0
const DESIGN = {
  nt_anthu: { x: 2.2, y: 1.05, z: 0.7 },            // build_an_thu: W,D,H = 2.2, 0.7, 1.05
  nt_binhphongluarong: { x: 2.94, y: 2.2, z: 0.44 },// build_bp_lua: 6 cánh 0.52×2.2, cánh张开 ±20°
  nt_den_long_lon: { x: 0.82, y: 1.03, z: 0.82 },   // build_den: Ø0,82 (nón r0,31), cao 1,03
  nt_lubacson: { x: 1.0, y: 1.33, z: 1.0 },         // build_lu: chân xòe r0,435+đế, đỉnh 1,28+0,05
};
async function fixNoiThat(path) {
  const { gltf, json, bin, raw } = await loadScene(path);
  const topIdx = json.scenes[json.scene].nodes ?? [];
  for (const ni of topIdx) {
    const n = json.nodes[ni];
    const o = gltf.scene.children.find((c) => (c.name || '') === (n.name || '') && (n.name || '') !== '');
    if (!o || !DESIGN[n.name]) continue;
    const b = new THREE.Box3().setFromObject(o);
    const cur = b.getSize(new THREE.Vector3());
    const d = DESIGN[n.name];
    const sx = d.x / (cur.x || 1e-6), sy = d.y / (cur.y || 1e-6), sz = d.z / (cur.z || 1e-6);
    // K: p → S·(p − b.min) + target.min  (target.min = (−d.x/2, 0, −d.z/2))
    const old = new THREE.Matrix4();
    if (n.matrix) old.fromArray(n.matrix);
    else { old.compose(new THREE.Vector3(...(n.translation ?? [0, 0, 0])), new THREE.Quaternion().fromArray(n.rotation ?? [0, 0, 0, 1]), new THREE.Vector3(...(n.scale ?? [1, 1, 1]))); }
    const K = new THREE.Matrix4().set(sx, 0, 0, -d.x / 2 - sx * b.min.x, 0, sy, 0, -sy * b.min.y, 0, 0, sz, -d.z / 2 - sz * b.min.z, 0, 0, 0, 1);
    const M = K.multiply(old);
    delete n.translation; delete n.rotation; delete n.scale;
    n.matrix = M.toArray().map((v) => +v.toFixed(6));
  }
  writeGlb(path, json, bin);
  const after = await loadScene(path);
  for (const c of after.gltf.scene.children) {
    const b = new THREE.Box3().setFromObject(c);
    const s = b.getSize(new THREE.Vector3());
    console.log(`[noi_that] ${path} node "${c.name}" = ${s.x.toFixed(2)} × ${s.y.toFixed(2)} × ${s.z.toFixed(2)} min.y=${b.min.y.toFixed(3)}`);
  }
}

for (const f of ['lib_cau_van', 'lib_cau_van.hd', 'lib_cau_van.lod']) await fixCauVan(`public/models/${f}.glb`);
for (const f of ['lib_noi_that', 'lib_noi_that.hd', 'lib_noi_that.lod']) await fixNoiThat(`public/models/${f}.glb`);
console.log('DONE');
