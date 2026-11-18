import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
// Xem cây cổ thụ: SP=hoe,soi LOD=near|mid|far AERIAL=1 node scripts/cay-look.mjs → output/cay-look/<loài>-<lod>.png
const OUT = process.env.OUT || 'output/cay-look'; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
await p.goto('http://localhost:5180/tools/caycothu.html');
await p.waitForFunction(() => window.cayReady || false, null, { timeout: 60000 }).catch(() => {});
const all = await p.evaluate(() => window.cay.list);
const sps = process.env.SP ? process.env.SP.split(',') : all;
for (const sp of sps) for (const lod of (process.env.LOD || 'near').split(',')) {
  const r = await p.evaluate(([sp, lod, a, s, d]) => window.cay.render(sp, { lod, aerial: !!a, season: +s || 0, dbg: d }), [sp, lod, process.env.AERIAL, process.env.SEASON, process.env.DBG || '']).catch((e) => ({ err: String(e) }));
  if (r.err) { console.log(sp, lod, r.err); continue; }
  writeFileSync(`${OUT}/${sp}-${lod}${process.env.AERIAL ? '-a' : ''}${process.env.DBG ? '-' + process.env.DBG : ''}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log(sp.padEnd(11), lod, 'H', r.info.H.join('/'), 'R', r.info.R.join('/'), 'thân', r.info.trunk.join('/'), 'tg', JSON.stringify(r.info.tris[0]), r.info.ms + 'ms');
}
if (errs.length) console.log('LỖI/CẢNH BÁO', [...new Set(errs)].slice(0, 8).join('\n'));
await b.close();
