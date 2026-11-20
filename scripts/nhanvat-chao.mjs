import { chromium } from 'playwright';
import sharp from 'sharp';
const glb = process.argv[2], out = process.argv[3];
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--js-flags=--max-old-space-size=8000'] });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const tiles = [];
for (const [a, ts] of [['bow', [1.5, 3, 4.5, 6]], ['wave', [0.8, 1.6, 2.4, 3.2]]]) for (const t of ts) {
  const r = await p.evaluate(([u, a, t]) => window.nv.glb(u, { anim: a, t }), ['/' + glb, a, t]);
  const buf = Buffer.from(r.png.split(',')[1], 'base64');
  tiles.push(await sharp(buf).extract({ left: 500, top: 0, width: 500, height: 900 }).resize(250, 450).toBuffer());
}
await sharp({ create: { width: 1000, height: 900, channels: 3, background: '#fff' } }).composite(tiles.map((t, i) => ({ input: t, left: (i % 4) * 250, top: Math.floor(i / 4) * 450 }))).jpeg({ quality: 85 }).toFile(out);
await b.close();
