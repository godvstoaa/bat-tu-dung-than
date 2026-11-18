import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
// Xem cây Meshy đã đóng gói: K=soi,sakura LOD=near,mid,far node scripts/big-look.mjs → output/cay-look/big-<k…>-<lod>.jpg
const OUT = 'output/cay-look'; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('http://localhost:5180/tools/caycothu.html'); await p.waitForFunction(() => window.cayReady);
const groups = (process.env.K || 'soi').split(';');
for (const g of groups) for (const lod of (process.env.LOD || 'near').split(',')) {
  const r = await p.evaluate(([ks, lod]) => window.cay.big(ks, { lod }), [g.split(','), lod]).catch((e) => ({ err: String(e) }));
  if (r.err) { console.log(g, lod, r.err); continue; }
  const f = `${OUT}/big-${g.replace(/,/g, '-')}-${lod}.jpg`; writeFileSync(f, Buffer.from(r.png.split(',')[1], 'base64')); console.log(f, JSON.stringify(r.st));
}
if (errs.length) console.log('LỖI', [...new Set(errs)].slice(0, 6).join('\n'));
await b.close();
