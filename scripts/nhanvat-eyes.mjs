import { chromium } from 'playwright';
// Đo mắt cho chớp mắt (characters.js EYES). Điểm ảnh (0–1) đo trên output/nhanvat/eyes/<id>.jpg — tâm, góc ngoài, mí trên mỗi mắt.
const M = {
  hero_m: [0.09, [[0.316, 0.722], [0.237, 0.703], [0.316, 0.698]], [[0.70, 0.722], [0.783, 0.703], [0.70, 0.698]]],
  hero_f: [0.09, [[0.239, 0.798], [0.128, 0.778], [0.239, 0.756]], [[0.70, 0.791], [0.80, 0.767], [0.70, 0.758]]],
  master: [0.09, [[0.322, 0.672], [0.233, 0.667], [0.322, 0.653]], [[0.728, 0.669], [0.817, 0.667], [0.728, 0.65]]],
  npc_villager: [0.09, [[0.35, 0.513], [0.258, 0.505], [0.35, 0.492]], [[0.691, 0.513], [0.783, 0.508], [0.691, 0.492]]],
  npc_merchant: [0.14, [[0.342, 0.658], [0.258, 0.653], [0.342, 0.638]], [[0.708, 0.658], [0.808, 0.647], [0.708, 0.633]]],
  npc_lao: [0.16, [[0.313, 0.655], [0.258, 0.65], [0.313, 0.638]], [[0.65, 0.655], [0.708, 0.65], [0.65, 0.638]]],
  npc_ba: [0.11, [[0.272, 0.461], [0.206, 0.461], [0.272, 0.439]], [[0.661, 0.461], [0.733, 0.467], [0.661, 0.436]]],
  npc_nu: [0.04, [[0.253, 0.53], [0.167, 0.52], [0.253, 0.503]], [[0.658, 0.53], [0.75, 0.52], [0.658, 0.503]]],
};
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const out = {};
for (const id of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(M)) {
  const [up, L, R] = M[id];
  await p.evaluate(([u, a]) => window.nv.face(u, { up: a }), [`/public/models/${id}.hd.glb`, up]);
  out[id] = await p.evaluate(([l, r]) => [window.nv.eye(...l), window.nv.eye(...r)], [L, R]);
  console.log(id, JSON.stringify(out[id]));
}
await b.close();
