// scripts/tmp/verify-fixes.mjs — kiểm chứng 4 vá game sau sửa (đường nạp/đường công thức THẬT của game):
//  1) cầu vân: GLB 1 cấu kiện + công thức buildInstanced (assets.js) cho bản 40 m nhìn thấy được
//  2) lib_noi_that: 4 đạo cụ đúng hộp thiết kế
//  3) exit villa: đích trên đảo — probe terrain vẫn sai (bằng chứng lỗi) nhưng toY3=460 đứng vững
//  4) protocol mv: cao độ tuyệt đối «ay» qua parseClient
import './stub-dom.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { SKY_BRIDGES, SKY_DISTRICT, SKY_Y, heightAt } from '../../src/game/terrain.js';
import { groundHeight, moveFree } from '../../src/game/motion.js';
import { parseClient } from '../../src/game/protocol.js';
// interior.js không import trực tiếp được trong node (kéo 'virtual:model-files' của vite) —
// tính lại toạ độ CỬA theo đúng doorOn() trong interior.js:462-471 (offset chép nguyên văn)
const isle = (id) => SKY_DISTRICT.find((s) => s.id === id);
const VILLA_DOORS = [
  ['villa_daisanh', 'thienban', -139, -33],
  ['villa_thuca', 'thudao', 10, 6],
  ['villa_thiendan', 'thiendan', 2, -26],
  ['villa_tieuquan', 'thienquan', -21, 12],
].map(([id, is, dx, dz]) => ({ id, door: { x: isle(is).x + dx, z: isle(is).z + dz } }));

let passed = 0; const fails = [];
const test = (name, fn) => { try { fn(); passed++; console.log('  ✓', name); } catch (e) { fails.push(name); console.log('  ✗', name, '\n   ', e.message); } };

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const load = async (p) => {
  const b = fs.readFileSync(p);
  const g = await new Promise((res, rej) => loader.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '', res, rej));
  g.scene.updateMatrixWorld(true);
  return g;
};

// ------------------------------------------------------------------ 1) CẦU VÂN
{
  const g = await load('public/models/lib_cau_van.glb');
  let inst = 0; g.scene.traverse((o) => { if (o.isInstancedMesh) inst++; });
  test('GLB lib_cau_van: không còn EXT_mesh_gpu_instancing (đã bake 1 cấu kiện)', () => assert.equal(inst, 0));
  // đúng công thức buildInstanced (assets.js: sizeOf → ref theo fitKey width; base dời gốc + co k; M.compose × base × matrixWorld)
  const box = new THREE.Box3().setFromObject(g.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const ref = size.x; // fitKey 'width'
  const S = 46.45;    // landmarks.js
  const k = S / (ref || 1);
  const worldBox = new THREE.Box3();
  const M = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  g.scene.traverse((o) => {
    if (!o.isMesh) return;
    base.makeTranslation(-center.x, -box.min.y, -center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
    M.compose(new THREE.Vector3(0, SKY_Y - 3.22, 0), q.setFromAxisAngle(up, 0), new THREE.Vector3(1, 1, 1)).multiply(base).multiply(o.matrixWorld);
    const gbb = o.geometry.boundingBox ?? o.geometry.computeBoundingBox();
    worldBox.union(gbb.clone().applyMatrix4(M));
  });
  const w = worldBox.getSize(new THREE.Vector3());
  test(`cấu kiện đặt tại (0, ${SKY_Y - 3.22}, 0): khung bao thế giới ${w.x.toFixed(1)} × ${w.y.toFixed(1)} × ${w.z.toFixed(1)} m (lỗi cũ: 0,279 × 0,011 × 0,033)`, () => {
    assert.ok(Math.abs(w.x - 46.45) < 0.2, `rộng ${w.x}`);
    assert.ok(Math.abs(w.y - 4.32) < 0.05, `cao ${w.y}`);
    assert.ok(Math.abs(w.z - 4.9) < 0.05, `sâu ${w.z}`);
    assert.ok(w.x > 40, 'phải ≥ sàn 40 m');
  });
  const top = worldBox.max.y, bot = worldBox.min.y;
  const deckTop = SKY_Y - 3.22 + (0.165 - box.min.y); // mặt ván đầu cấu kiện = item.y + (0,165 − min khung bao)
  test(`mặt ván FLUSH nền ${SKY_Y}: ván ${deckTop.toFixed(2)}, khung [${bot.toFixed(1)}, ${top.toFixed(1)}] (vòm đỡ/mây dưới, lan can trên)`, () => {
    assert.ok(Math.abs(deckTop - SKY_Y) < 0.05, `ván ${deckTop} vs nền ${SKY_Y}`);
    assert.ok(bot > 455 && bot < SKY_Y - 1, `đáy ${bot}`);
    assert.ok(top > SKY_Y && top < SKY_Y + 2, `đỉnh ${top}`);
  });
  const nSegs = SKY_BRIDGES.reduce((n, b) => n + b.segs.length, 0);
  test(`4 cầu đủ ${nSegs} đoạn nền (terrain) — model đặt từng đoạn`, () => assert.ok(nSegs >= 24, `chỉ ${nSegs}`));
}

// ------------------------------------------------------------------ 2) NỘI THẤT
{
  const g = await load('public/models/lib_noi_that.glb');
  const want = { nt_anthu: [2.2, 1.05, 0.7], nt_binhphongluarong: [2.94, 2.2, 0.44], nt_den_long_lon: [0.82, 1.03, 0.82], nt_lubacson: [1.0, 1.33, 1.0] };
  for (const [name, [x, y, z]] of Object.entries(want)) {
    const o = g.scene.children.find((c) => c.name === name);
    test(`lib_noi_that "${name}" đúng hộp thiết kế ${x}×${y}×${z} m, đáy chạm sàn`, () => {
      assert.ok(o, 'thiếu node');
      const b = new THREE.Box3().setFromObject(o);
      const s = b.getSize(new THREE.Vector3());
      assert.ok(Math.abs(s.x - x) < 0.02 && Math.abs(s.y - y) < 0.02 && Math.abs(s.z - z) < 0.02, `${s.x.toFixed(2)}×${s.y.toFixed(2)}×${s.z.toFixed(2)}`);
      assert.ok(Math.abs(b.min.y) < 0.01, `min.y ${b.min.y.toFixed(3)}`);
    });
  }
}

// ------------------------------------------------------------------ 3) EXIT VILLA
{
  const terrainY3 = (x, z) => groundHeight(x, z, heightAt(x, z) + 1); // main.js:850
  for (const r of VILLA_DOORS) {
    test(`villa ${r.id}: probe terrain tại cửa đảo cho Y=đường phố (bằng chứng lỗi cũ — phải dùng toY3)`, () => {
      const y = terrainY3(r.door.x, r.door.z);
      assert.ok(y < 455, `probe ${y} nhưng nền đảo bot 455`);
    });
    test(`villa ${r.id}: đặt chân toY3=${SKY_Y} tại cửa → đứng vững trên đảo 2 giây, không rơi`, () => {
      assert.equal(groundHeight(r.door.x, r.door.z, SKY_Y), SKY_Y, 'groundHeight 460 tại cửa');
      const p = { x: r.door.x, z: r.door.z, y3: SKY_Y, vy: 0, stamina: 100 };
      for (let i = 0; i < 120; i++) moveFree(p, { dx: 0, dz: 0, mag: 0 }, 1 / 60, 5.6);
      assert.ok(!p.air && Math.abs(p.y3 - SKY_Y) < 0.01, `y3 = ${p.y3}`);
    });
  }
}

// ------------------------------------------------------------------ 4) PROTOCOL mv.ay
{
  const mv = (o) => parseClient(JSON.stringify({ t: 'mv', x: 11, y: 33, ...o }));
  test('mv.ay=460 (đứng đảo bay) → parseClient giữ nguyên 460', () => assert.equal(mv({ ay: 460 }).ay, 460));
  test('mv.ay=1204 → kẹp 1000', () => assert.equal(mv({ ay: 1204 }).ay, 1000));
  test('mv.ay=-5 → kẹp 0', () => assert.equal(mv({ ay: -5 }).ay, 0));
  test('mv không có ay → null (client cũ)', () => assert.equal(mv({}).ay, null));
  test('mv.ay="460" (chuỗi) → null', () => assert.equal(mv({ ay: '460' }).ay, null));
  test('mv cũ (a=100) vẫn parse như trước — không đổi ý nghĩa trường a', () => { const m = mv({ a: 100 }); assert.equal(m.a, 100); assert.equal(m.ay, null); });
}

console.log(`\n${passed} pass, ${fails.length} fail${fails.length ? ' → ' + fails.join('; ') : ''}`);
process.exit(fails.length ? 1 : 0);
