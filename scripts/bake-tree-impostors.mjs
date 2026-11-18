// Chụp ảnh xa (impostor) cho mọi cây Meshy tiên phủ → public/models/lib_tp_<m>.imp.png + src/game/tienphu/imp.gen.js (cạnh ô S)
// node scripts/bake-tree-impostors.mjs   (máy dev đang chạy ở :5180)
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { BIG } from '../src/game/tienphu/flora-spec.js';
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1200, height: 700 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:5180/tools/caycothu.html'); await p.waitForFunction(() => window.cayReady);
const out = {}, done = new Set();
for (const [k, s] of Object.entries(BIG)) {
  if (!s.m || done.has(s.m)) continue; done.add(s.m);
  const r = await p.evaluate((k) => window.cay.imp(k), k).catch((e) => ({ err: String(e) }));
  if (r.err) { console.log(k, r.err); continue; }
  writeFileSync(`public/models/lib_tp_${s.m}.imp.png`, Buffer.from(r.png.split(',')[1], 'base64')); out[s.m] = r.S; console.log(s.m, 'S', r.S);
}
writeFileSync('src/game/tienphu/imp.gen.js', `// SINH TỰ ĐỘNG bởi scripts/bake-tree-impostors.mjs — cạnh ô ảnh xa (theo cao cây = 1)\nexport const IMP_S = ${JSON.stringify(out)};\n`);
if (errs.length) console.log('LỖI', errs.slice(0, 4).join('\n'));
await b.close();
