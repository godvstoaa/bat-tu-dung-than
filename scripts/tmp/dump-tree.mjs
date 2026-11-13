import './stub-dom.mjs';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const raw = fs.readFileSync(process.argv[2]);
const g = await new Promise((res, rej) => loader.parse(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '', res, rej));
g.scene.updateMatrixWorld(true);
const dump = (o, d) => {
  const b = new THREE.Box3().setFromObject(o);
  const s = b.isEmpty ? null : b.getSize(new THREE.Vector3());
  console.log('  '.repeat(d) + `${o.type} "${o.name}" size=${s ? `${s.x.toFixed(2)}x${s.y.toFixed(2)}x${s.z.toFixed(2)}` : '-'} min=${s ? b.min.toArray().map(v=>+v.toFixed(2)) : '-'} pos=${o.position.toArray().map(v=>+v.toFixed(2))} scale=${o.scale.toArray().map(v=>+v.toFixed(3))}`);
  if (o.isInstancedMesh) {
    const m = new THREE.Matrix4();
    for (let i = 0; i < Math.min(o.count, 3); i++) { o.getMatrixAt(i, m); console.log('  '.repeat(d + 1) + `inst[${i}] = [${m.toArray().map(v=>+v.toFixed(3)).join(', ')}]`); }
    if (o.count > 3) { o.getMatrixAt(o.count - 1, m); console.log('  '.repeat(d + 1) + `inst[last] = [${m.toArray().map(v=>+v.toFixed(3)).join(', ')}]`); }
  }
  for (const c of o.children) dump(c, d + 1);
};
dump(g.scene, 0);
