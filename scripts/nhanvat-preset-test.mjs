// Ghép mọi preset Meshy đã tải (assets-meshy/library/chars/preset/*.glb) lên một nhân vật → GLB thử + bảng ảnh động tác
//   node scripts/nhanvat-preset-test.mjs [nguồn lưới=cA76_namlam.glb] [ảnh ra=output/nhanvat/preset/sheet.jpg]
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const src = '/assets-meshy/library/chars/' + (process.argv[2] || 'cA76_namlam.glb'), out = process.argv[3] || 'output/nhanvat/preset/sheet.jpg';
const names = fs.readdirSync('assets-meshy/library/chars/preset').filter((f) => f.endsWith('.glb') && !f.startsWith('_')).map((f) => f.replace('.glb', ''));
fs.mkdirSync(path.dirname(out), { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--js-flags=--max-old-space-size=8000'] });
const p = await b.newPage(); await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
const r = await p.evaluate(([s, c]) => window.nv.pack(s, c), [src, names.map((n) => [n, 'preset:' + n, n])]);
await b.close();
const glb = out.replace(/\.jpg$/, '.glb'); fs.writeFileSync(glb, Buffer.from(r.b64, 'base64'));
console.log('clip', r.clips.length, 'thiếu', r.miss.join(',') || '—');
execFileSync(process.execPath, ['scripts/nhanvat-clips.mjs', glb, out], { stdio: 'inherit' });
