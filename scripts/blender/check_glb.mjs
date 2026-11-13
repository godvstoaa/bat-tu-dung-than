// check_glb.mjs — kiểm GLB: magic 'glTF', đếm tam giác (accessor primitive), COLOR_0, bbox.
// Dùng: node scripts/blender/check_glb.mjs <file.glb> [ngưỡng-tam-giác]
import fs from 'node:fs';
const [p, limitArg] = process.argv.slice(2);
const limit = Number(limitArg) || 50000;
const buf = fs.readFileSync(p);
const magic = buf.toString('ascii', 0, 4);
const ver = buf.readUInt32LE(4);
const jsonLen = buf.readUInt32LE(12);
const jsonType = buf.toString('ascii', 16, 20);
const g = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
let tris = 0, colorPrims = 0, prims = [];
for (const m of g.meshes) for (const pr of m.primitives) {
  const t = pr.indices != null ? g.accessors[pr.indices].count / 3 : g.accessors[pr.attributes.POSITION].count / 3;
  tris += t;
  const hasColor = !!pr.attributes.COLOR_0; if (hasColor) colorPrims++;
  prims.push(`${m.name}:${pr.material != null ? g.materials[pr.material].name : '?'}:${t}tri${hasColor ? '' : ':NO-COLOR_0'}`);
}
let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
for (const m of g.meshes) for (const pr of m.primitives) {
  const a = g.accessors[pr.attributes.POSITION];
  for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], a.min[i]); mx[i] = Math.max(mx[i], a.max[i]); }
}
const ok = magic === 'glTF' && jsonType === 'JSON' && ver === 2 && tris <= limit;
console.log(JSON.stringify({
  file: p, magic, jsonType, ver, bytes: buf.length, tris: Math.round(tris), limit,
  trisOk: tris <= limit, colorPrims, totalPrims: g.meshes.reduce((s, m) => s + m.primitives.length, 0),
  materials: g.materials.map((m) => m.name + (m.alphaMode ? ':' + m.alphaMode : '')),
  meshes: g.meshes.map((m) => m.name), prims,
  bbox: { min: mn.map((v) => +v.toFixed(2)), max: mx.map((v) => +v.toFixed(2)) }, ok,
}, null, 1));
process.exit(ok ? 0 : 1);
