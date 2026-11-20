import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
// Ảnh so sánh nhân vật: node scripts/nhanvat-look.mjs <thư mục có .glb> [anim] — ảnh vào <thư mục>/look/, số đo in ra JSON
const dir = process.argv[2], anim = process.argv[3] ?? null, clipsFrom = process.argv[4] || null, tag = process.argv[5] || '', out = dir + '/look'; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--js-flags=--max-old-space-size=8000'] });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const all = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith('.glb'))) {
  const r = await p.evaluate(([u, a, cf, tt]) => window.nv.glb(u, { anim: a == null ? null : isNaN(+a) ? a : +a, clipsFrom: cf, t: tt }), ['/' + dir + '/' + f, anim, clipsFrom, +(process.env.T || 0.3)]).catch((e) => ({ err: String(e).slice(0, 200) }));
  if (r.err) { console.log(f, r.err); continue; }
  writeFileSync(`${out}/${f.replace('.glb', tag + '.jpg')}`, Buffer.from(r.png.split(',')[1], 'base64'));
  all[f] = { ...r.info, MB: +(statSync(dir + '/' + f).size / 1e6).toFixed(2) }; console.log(f, JSON.stringify(all[f]));
}
writeFileSync(out + '/info.json', JSON.stringify(all, null, 1));
await b.close();
