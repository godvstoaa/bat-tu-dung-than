// Giản lược mạnh cho bản nhìn-từ-xa (<id>.lod.glb) của công trình trùm.
// Mesh Meshy tách đỉnh theo đường nối UV → simplify thường không gộp được; dùng cờ «Permissive»
// của meshoptimizer cho phép gộp qua đường nối (lệch UV nhỏ, nhìn xa không thấy).
// Dùng: node scripts/meshy-lod.mjs <in.glb> <out.glb> [ratio=0.1 | t:<số tam giác đích>]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';

const [src, dst, ratioArg, mode] = process.argv.slice(2);
// mode «keepuv»: không gộp qua đường nối UV (texture không bị kéo sọc) — dừng ở mức sàn của mesh nếu không đạt đích
// mode «auto»: như keepuv; không đạt đích thì gộp qua đường nối có tính sai số UV
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(src);
let ratio = Number(ratioArg) || 0.1;
if (String(ratioArg || '').startsWith('t:')) {
  let tot = 0;
  for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) tot += (p.getIndices()?.getCount() || 0) / 3;
  ratio = Math.min(1, Number(ratioArg.slice(2)) / (tot || 1));
}
let before = 0, after = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION'), idx = prim.getIndices();
    if (!pos || !idx) continue;
    const positions = new Float32Array(pos.getArray());
    const indices = new Uint32Array(idx.getArray());
    if (ratio >= 0.999) { before += indices.length / 3; after += indices.length / 3; continue; }
    const target = Math.floor((indices.length * ratio) / 3) * 3;
    // giản lược mạnh (ratio nhỏ) cần nới sai số để đạt đúng số tam giác đích
    let out;
    if (mode === 'keepuv' || mode === 'auto') {
      [out] = MeshoptSimplifier.simplify(indices, positions, 3, target, 1, []);
      // «auto»: mesh nhiều đảo UV nhỏ không giảm nổi → gộp qua đường nối nhưng tính sai số UV (texture không kéo sọc)
      const uv = prim.getAttribute('TEXCOORD_0');
      if (mode === 'auto' && out.length > target * 1.6 && uv) {
        [out] = MeshoptSimplifier.simplifyWithAttributes(indices, positions, 3, new Float32Array(uv.getArray()), 2, [16, 16], null, target, 1, ['Permissive']);
      }
    } else {
      [out] = MeshoptSimplifier.simplify(indices, positions, 3, target, ratio < 0.2 ? 1 : 0.05, ['Permissive']);
    }
    before += indices.length / 3; after += out.length / 3;
    idx.setArray(out);
  }
}
await io.write(dst, doc);
console.log(`${src.split(/[\\/]/).pop()}: ${before} → ${after} tam giác`);
