import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
// Xem nhanh một / nhiều công trình: ID=trunghoa/main,… V=persp,front,side,plan,section node scripts/banve-look.mjs → output/banve-look/<phong-cách>-<id>-<view>.png
const OUT = process.env.OUT || 'output/banve-look'; mkdirSync(OUT, { recursive: true });
const ids = (process.env.ID || 'trunghoa/main').split(','), views = (process.env.V || 'persp,front,side,plan,section').split(',');
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('http://localhost:5180/tools/banve.html');
await p.waitForFunction(() => window.banveReady || false, null, { timeout: 60000 }).catch(() => {});
if (errs.length) { console.log('LỖI', errs.join('\n')); }
for (const id of ids) for (const v of views) {
  const r = await p.evaluate(([id, v]) => window.banve.render(id, v), [id, v]).catch((e) => ({ err: String(e) }));
  if (r.err) { console.log(id, v, r.err); continue; }
  writeFileSync(`${OUT}/${id.replace('/', '-')}-${v}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log(id, v, 'px/m', r.pxPerM?.toFixed?.(2), 'tris', r.info.tris, 'top', r.info.top?.toFixed?.(1));
}
await b.close();
