import { chromium } from 'playwright';
import { writeFileSync, readdirSync, mkdirSync } from 'node:fs';
// Ảnh nhận dạng nhanh cho mọi GLB trong một thư mục (phục vụ từ máy dev): node scripts/glb-thumbs.mjs output/tmp/dl
const dir = process.argv[2], out = dir + '/thumb'; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--js-flags=--max-old-space-size=8000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('http://localhost:5180/tools/caycothu.html'); await p.waitForFunction(() => window.cayReady);
for (const f of readdirSync(dir).filter((x) => x.endsWith('.glb'))) {
  const r = await p.evaluate((u) => window.cay.glb(u), '/' + dir + '/' + f).catch((e) => ({ err: String(e).slice(0, 120) }));
  if (r.err) { console.log(f, r.err); continue; }
  writeFileSync(`${out}/${f.replace('.glb', '.jpg')}`, Buffer.from(r.png.split(',')[1], 'base64')); console.log(f, r.tris, 'tg', 'rộng', r.w, r.d);
}
await b.close();
