// check_dao_vua.mjs — đo dao_vua bằng ĐÚNG đường game dùng: three.js GLTFLoader (assets.js sizeOf / Box3).
// Dùng: node scripts/blender/check_dao_vua.mjs <file.glb>...
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';

// Node không có DOM: GLTFLoader (three 0.170) nhánh EXT_texture_webp gọi `new Image()` dò hỗ trợ
// (detectSupport) và self.URL trong loadImageSource → 'Image is not defined' làm sập cả parse.
// Script chỉ đo HÌNH HỌC nên stub tối tiểu: self = globalThis, Image stub onload async height 1 →
// webp đi tiếp vào loadTextureImage, ở đó lỗi nạp ảnh (TextureLoader cần document) bị .catch(()=>null)
// nuốt thành texture null — geometry vẫn đo đủ. (BỎ plugin webp KHÔNG được: nhánh fallback
// parser.loadTexture sập "reading 'uri'" vì texture webp không có source JSON — đã thử thực nghiệm.)
globalThis.self = globalThis;
globalThis.Image = class { constructor() { this.width = 0; this.height = 0; } set src(v) { this._s = v; queueMicrotask(() => { this.height = 1; if (this.onload) this.onload(); }); } get src() { return this._s; } };

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
