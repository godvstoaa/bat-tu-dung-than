// Chụp app bản mobile (đã lập lá số) theo từng nấc cuộn. node video-studio/scripts/capture-mobile.mjs
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('video-studio/public/mob');
await mkdir(OUT, { recursive: true });
const server = await createServer({ server: { port: 4191, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const BASE = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/m-000.png` });
await page.fill('#date', '1992-08-16');
await page.fill('#time', '09:30');
await page.fill('#birth-name', 'Huyền Minh');
await page.click('button.btn-primary[type=submit]');
await page.waitForTimeout(5000);
// mốc tiêu đề các card để biết chụp gì
const heads = await page.$$eval('#result > .card', (els) => els.filter((e) => e.offsetParent).map((e) => ({ y: Math.round(e.getBoundingClientRect().top + scrollY), t: (e.querySelector('h2,h3,.card-title,summary')?.textContent || '').trim().slice(0, 50) })));
console.log(JSON.stringify(heads, null, 0));
let n = 1;
for (const h of heads.slice(0, 30)) {
  await page.evaluate((y) => window.scrollTo(0, y - 10), h.y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/m-${String(n++).padStart(3, '0')}.png` });
}
await browser.close();
await server.close();
