// Bản xa nhân vật KHÔNG VỠ cho model UV vụn (vd hero_f / c19: giản lược giữ UV dừng ở 51k tam giác, sloppy làm loang texture):
// màu texture nướng vào ĐỈNH (COLOR_0) → hàn đỉnh theo vị trí (hết đường nối UV, giữ JOINTS/WEIGHTS của đỉnh đầu)
// → giản lược meshoptimizer tới đích. Bỏ UV + mọi texture. Giữ xương + clip.
//   node scripts/nhanvat-vclod.mjs <in.glb (chưa nén)> <out.glb> [tam_giác=8000]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { simplify, weld, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
const [inp, out, tgt = '8000'] = process.argv.slice(2);
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
let triIn = 0;
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const mat = p.getMaterial(), tex = mat?.getBaseColorTexture(), uv = p.getAttribute('TEXCOORD_0');
  if (!tex || !uv) continue;
  // texture thu về 512 (lọc trung bình) → lấy mẫu song tuyến tại UV
  const { data, info } = await sharp(Buffer.from(tex.getImage())).resize(512, 512, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, n = uv.getCount(), col = new Float32Array(n * 3), t = [0, 0];
  const fac = mat.getBaseColorFactor();
  for (let i = 0; i < n; i++) {
    uv.getElement(i, t); let u = (t[0] % 1 + 1) % 1, v = (t[1] % 1 + 1) % 1;
    const x = u * (W - 1), y = v * (H - 1), x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(W - 1, x0 + 1), y1 = Math.min(H - 1, y0 + 1), fx = x - x0, fy = y - y0;
    for (let c = 0; c < 3; c++) {
      const g = (xx, yy) => data[(yy * W + xx) * 3 + c] / 255;
      const s = (g(x0, y0) * (1 - fx) + g(x1, y0) * fx) * (1 - fy) + (g(x0, y1) * (1 - fx) + g(x1, y1) * fx) * fy;
      col[i * 3 + c] = toLin(s) * fac[c];
    }
  }
  p.setAttribute('COLOR_0', doc.createAccessor().setType('VEC3').setArray(col).setBuffer(uv.getBuffer()));
  // bỏ UV / pháp tuyến cũ (pháp tuyến tách theo nếp UV) → hàn theo vị trí
  for (const sem of p.listSemantics()) if (/^TEXCOORD|^TANGENT/.test(sem)) p.setAttribute(sem, null);
  const m2 = mat.clone().setBaseColorTexture(null).setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null).setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(0.85).setName('vclod');
  p.setMaterial(m2);
  triIn += p.getIndices().getCount() / 3;
}
// đỉnh trùng vị trí (tách theo nếp UV) nhận CÙNG màu trung bình → weld gộp được
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), col = p.getAttribute('COLOR_0'); if (!col) continue;
  const key = new Map(), a = [0, 0, 0], c = [0, 0, 0], n = pos.getCount();
  for (let i = 0; i < n; i++) { pos.getElement(i, a); const k = a.map((x) => Math.round(x * 1e4)).join(','); col.getElement(i, c); const e = key.get(k); if (e) { e.s[0] += c[0]; e.s[1] += c[1]; e.s[2] += c[2]; e.n++; e.i.push(i); } else key.set(k, { s: [...c], n: 1, i: [i] }); }
  for (const e of key.values()) { const m = [e.s[0] / e.n, e.s[1] / e.n, e.s[2] / e.n]; for (const i of e.i) col.setElement(i, m); }
}
// hàn: bỏ NORMAL để đỉnh trùng vị trí gộp hết (tính lại pháp tuyến ở client không cần — giữ bản trung bình)
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) p.setAttribute('NORMAL', null);
await doc.transform(weld({ tolerance: 0.0001 }), simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, (+tgt / triIn) * 1.0), error: 0.05, lockBorder: false }), prune());
// pháp tuyến mượt (cộng pháp tuyến mặt theo diện tích) — normals() của gltf-transform là pháp tuyến phẳng
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), idx = p.getIndices().getArray(), n = pos.getCount(), N = new Float32Array(n * 3), a = [0, 0, 0], b = [0, 0, 0], c = [0, 0, 0];
  for (let i = 0; i < idx.length; i += 3) { pos.getElement(idx[i], a); pos.getElement(idx[i + 1], b); pos.getElement(idx[i + 2], c);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const k of [idx[i], idx[i + 1], idx[i + 2]]) { N[k * 3] += nx; N[k * 3 + 1] += ny; N[k * 3 + 2] += nz; } }
  for (let k = 0; k < n; k++) { const l = Math.hypot(N[k * 3], N[k * 3 + 1], N[k * 3 + 2]) || 1; N[k * 3] /= l; N[k * 3 + 1] /= l; N[k * 3 + 2] /= l; }
  p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(N).setBuffer(pos.getBuffer()));
}
let triOut = 0; for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) triOut += p.getIndices().getCount() / 3;
await io.write(out, doc);
console.log('vclod', Math.round(triIn), '→', Math.round(triOut));
