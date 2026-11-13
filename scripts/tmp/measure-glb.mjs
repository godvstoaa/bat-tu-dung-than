import './stub-dom.mjs';
// Đo kích thước node GLB bằng đúng đường decode của game: three GLTFLoader + MeshoptDecoder (assets.js)
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const raw = fs.readFileSync(process.argv[2]); const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
const g = await new Promise((res, rej) => loader.parse(buf, '', res, rej));
g.scene.updateMatrixWorld(true);
const full = new THREE.Box3().setFromObject(g.scene);
const s = full.getSize(new THREE.Vector3());
console.log(`SCENE bbox size = ${s.x.toFixed(2)} x ${s.y.toFixed(2)} x ${s.z.toFixed(2)}  min=${full.min.toArray().map(v=>v.toFixed(2))} max=${full.max.toArray().map(v=>v.toFixed(2))}`);
for (const o of g.scene.children) {
  const b = new THREE.Box3().setFromObject(o);
  const sz = b.getSize(new THREE.Vector3());
  const inst = o.isInstancedMesh ? ` [InstancedMesh count=${o.count}]` : '';
  console.log(`node "${o.name}"${inst} size=${sz.x.toFixed(2)} x ${sz.y.toFixed(2)} x ${sz.z.toFixed(2)} min.y=${b.min.y.toFixed(2)} pos=${o.position.toArray().map(v=>v.toFixed(2))} scale=${o.scale.toArray().map(v=>v.toFixed(3))}`);
  if (o.isInstancedMesh) {
    const m = new THREE.Matrix4();
    for (let i = 0; i < Math.min(o.count, 30); i++) {
      o.getMatrixAt(i, m);
      const p = new THREE.Vector3().setFromMatrixPosition(m);
      console.log(`   inst[${i}] pos=${p.toArray().map(v=>v.toFixed(1)).join(',')} sx=${m.elements[0].toFixed(3)}`);
    }
  }
}
