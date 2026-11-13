// check_dao_vua.mjs — đo dao_vua bằng ĐÚNG đường game dùng: three.js GLTFLoader (assets.js sizeOf / Box3).
// Dùng: node scripts/blender/check_dao_vua.mjs <file.glb>...
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';

const files = process.argv.slice(2);
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const load = (f) => new Promise((res, rej) => loader.parse(fs.readFileSync(f).buffer, '', res, rej));
for (const f of files) {
  const g = await load(f);
  let tris = 0, meshes = 0;
  g.scene.traverse((o) => {
    if (o.isMesh) { meshes++; tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }
  });
  const b = new THREE.Box3().setFromObject(g.scene);
  const size = new THREE.Vector3(); b.getSize(size);
  console.log(JSON.stringify({
    file: f.split(/[\\/]/).pop(), tris: Math.round(tris), meshes,
    width: +size.x.toFixed(2), height: +size.y.toFixed(2), depth: +size.z.toFixed(2),
    bottom: +b.min.y.toFixed(2), top: +b.max.y.toFixed(2),
    fitWidth520_scale: +(520 / size.x).toFixed(4),
    yard_lands_at_SKY_Y_err_m: +(63.52 - Math.abs(b.min.y)).toFixed(2), // sai số sân so với hằng số landmarks.js:187
  }));
}
