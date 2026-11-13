// đọc JSON chunk của GLB: in cây node, mesh, extension gpu instancing + ma trận instance
import fs from 'node:fs';
const path = process.argv[2];
const b = fs.readFileSync(path);
const jsonLen = b.readUInt32LE(12);
const json = JSON.parse(b.subarray(20, 20 + jsonLen).toString('utf8'));
const binStart = 20 + jsonLen + 8;
const access = (acc) => {
  const bv = json.bufferViews[acc.bufferView];
  const off = binStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const n = acc.count || 0;
  const t = acc.type, c = t === 'MAT4' ? 16 : t === 'VEC3' ? 3 : t === 'VEC2' ? 2 : t === 'SCALAR' ? 1 : 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < c; j++) row.push(b.readFloatLE(off + (i * c + j) * 4));
    out.push(row);
  }
  return out;
};
console.log('== asset', json.asset?.version, 'extensionsUsed:', json.extensionsUsed);
const nodeName = (i) => (json.nodes[i]?.name ?? `#${i}`);
const meshOf = (i) => json.nodes[i]?.mesh != null ? json.meshes[json.nodes[i].mesh].name : null;
const dump = (i, d) => {
  const n = json.nodes[i] ?? {};
  const ext = n.extensions?.EXT_mesh_gpu_instancing;
  let inst = '';
  if (ext) {
    const attrs = ext.attributes;
    const mk = attrs.TRANSLATION ? access(json.accessors[attrs.TRANSLATION]) : null;
    const mr = attrs.ROTATION ? null : null;
    inst = ` [GPU-INST count=${mk ? mk.length : '?'} translations=${JSON.stringify(mk?.slice(0, 30))}]`;
  }
  console.log('  '.repeat(d) + `${nodeName(i)} mesh=${meshOf(i)}${n.scale ? ' scale=' + JSON.stringify(n.scale) : ''}${n.matrix ? ' matrix=' + JSON.stringify(n.matrix) : ''}${inst}`);
  for (const c of n.children ?? []) dump(c, d + 1);
};
json.scenes[json.scene].nodes.forEach((i) => dump(i, 0));
// bbox mesh
for (const [mi, m] of (json.meshes ?? []).entries()) {
  const pos = m.primitives[0].attributes.POSITION;
  const acc = json.accessors[pos];
  console.log(`mesh[${mi}] ${m.name} min=${JSON.stringify(acc.min)} max=${JSON.stringify(acc.max)}`);
}
