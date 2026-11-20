import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
// Bảng ảnh mọi động tác của một GLB nhân vật (mỗi clip: ảnh trước + 3/4 ở 40 % thời lượng): node scripts/nhanvat-clips.mjs <glb> <ảnh ra>
const [glb, out] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const first = await p.evaluate((u) => window.nv.glb(u, {}), '/' + glb);
const names = first.info.clips.map((c) => c.split('(')[0]);
const tiles = [];
for (const n of names) {
  const dur = +first.info.clips.find((c) => c.startsWith(n + '(')).match(/\(([\d.]+)s/)[1];
  const r = await p.evaluate(([u, a, t]) => window.nv.glb(u, { anim: a, t }), ['/' + glb, n, dur * 0.4]);
  const buf = Buffer.from(r.png.split(',')[1], 'base64');
  tiles.push(await sharp(buf).extract({ left: 0, top: 0, width: 1000, height: 900 }).resize(400, 360).composite([{ input: Buffer.from(`<svg width="400" height="30"><rect width="400" height="30" fill="black"/><text x="6" y="21" font-size="18" fill="white" font-family="sans-serif">${n} (${dur}s)</text></svg>`), top: 0, left: 0 }]).jpeg().toBuffer());
}
const cols = 4, rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: 400 * cols, height: 360 * rows, channels: 3, background: '#777' } }).composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * 400, top: Math.floor(i / cols) * 360 }))).jpeg({ quality: 82 }).toFile(out);
console.log(out, names.join(' '));
await b.close();
