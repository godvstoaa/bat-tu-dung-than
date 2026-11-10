// Giản lược «sloppy» (bỏ qua đường nối UV) — cho bản xa khi meshy-lod / gltf-transform simplify không ăn (đỉnh rời theo UV).
// node scripts/meshy-sloppy.mjs in.glb out.glb [tỉ_lệ=0.08] rồi đóng gói: gltf-transform optimize … --texture-size 512 --compress meshopt --simplify false
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { dequantize } from '@gltf-transform/functions';
const [,, inp, out, ratio = '0.08'] = process.argv;
await MeshoptDecoder.ready; await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
await doc.transform(dequantize());
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION').getArray(), idx = p.getIndices().getArray();
  const target = Math.floor(idx.length * Number(ratio) / 3) * 3;
  const [ni, err] = MeshoptSimplifier.simplifySloppy(Uint32Array.from(idx), Float32Array.from(pos), 3, null, target, 0.02);
  // gọn đỉnh không dùng
  const used = new Map(); const remap = new Uint32Array(ni.length);
  ni.forEach((v, i) => { if (!used.has(v)) used.set(v, used.size); remap[i] = used.get(v); });
  for (const sem of p.listSemantics()) {
    const a = p.getAttribute(sem), n = a.getElementSize(), src = a.getArray(), dst = new src.constructor(used.size * n);
    for (const [o, nn] of used) for (let k = 0; k < n; k++) dst[nn * n + k] = src[o * n + k];
    a.setArray(dst);
  }
  p.getIndices().setArray(remap);
  console.log('tris', idx.length / 3, '→', remap.length / 3, 'verts', used.size, 'err', err.toFixed(4));
}
await io.write(out, doc);
