import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
// node scripts/nhanvat-face.mjs <id> [up] [dist]  → output/nhanvat/eyes/<id>.jpg (chính diện đầu, lưới 10 % kẻ sẵn)
// node scripts/nhanvat-face.mjs <id> up dist 'x,y;x,y;…' → in UV dưới các điểm (toạ độ 0–1 của ảnh)
const [id, up = '0.09', dist = '0.42', pts] = process.argv.slice(2);
mkdirSync('output/nhanvat/eyes', { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const r = await p.evaluate(([u, a, d]) => window.nv.face(u, { up: +a, dist: +d }), [`/public/models/${id}.hd.glb`, up, dist]);
if (pts) console.log(JSON.stringify(await p.evaluate((q) => window.nv.pick(q), pts.split(';').map((s) => s.split(',').map(Number)))));
else {
  const sharp = (await import('sharp')).default;
  let svg = '<svg width="900" height="900" xmlns="http://www.w3.org/2000/svg">';
  for (let i = 1; i < 20; i++) { const v = i * 45, c = i % 2 ? 'rgba(255,255,0,0.25)' : 'rgba(255,0,0,0.5)'; svg += `<line x1="${v}" y1="0" x2="${v}" y2="900" stroke="${c}"/><line x1="0" y1="${v}" x2="900" y2="${v}" stroke="${c}"/>`; if (i % 2 === 0) svg += `<text x="${v + 2}" y="12" font-size="12" fill="red">${i * 5}</text><text x="2" y="${v - 2}" font-size="12" fill="red">${i * 5}</text>`; }
  svg += '</svg>';
  await sharp(Buffer.from(r.png.split(',')[1], 'base64')).composite([{ input: Buffer.from(svg) }]).jpeg().toFile(`output/nhanvat/eyes/${id}.jpg`);
  console.log(id, r.head);
}
await b.close();
