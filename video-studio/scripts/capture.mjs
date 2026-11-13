// Chụp tư liệu cho video giới thiệu: app Bát Tự + game Huyền Quán.
// Chạy từ thư mục gốc app:  node video-studio/scripts/capture.mjs
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('video-studio/public/shots');
await mkdir(OUT, { recursive: true });

const server = await createServer({ server: { port: 4190, host: '127.0.0.1' }, logLevel: 'warn' });
await server.listen();
const BASE = server.resolvedUrls.local[0];
console.log('dev:', BASE);

const browser = await chromium.launch({
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
});
const errors = [];
const mk = async (vp = { width: 1920, height: 1080 }) => {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  return { ctx, page };
};
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name) });

// ---------- APP ----------
{
  const { ctx, page } = await mk();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('#result.reveal-run', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await shot(page, 'app-00.png');
  await page.fill('#date', '1992-08-16');
  await page.fill('#time', '09:30');
  await page.fill('#birth-name', 'Huyền Minh');
  await page.click('button.btn-primary[type=submit]');
  await page.waitForTimeout(5000);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('app height', H);
  // lấy các card kết quả, chụp từng card đầu tiên nổi bật
  const cards = await page.$$('#result > .card');
  console.log('cards', cards.length);
  let i = 1;
  for (const c of cards) {
    if (i > 14) break;
    if (!(await c.isVisible())) continue;
    await c.evaluate((el) => { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); });
    await page.waitForTimeout(700);
    await shot(page, `app-${String(i++).padStart(2, '0')}.png`);
  }
  // mobile
  const m = await mk({ width: 430, height: 932 });
  await m.page.goto(BASE, { waitUntil: 'networkidle' });
  await m.page.waitForTimeout(2500);
  await shot(m.page, 'app-mobile-00.png');
  await m.page.evaluate(() => window.scrollTo(0, 1400));
  await m.page.waitForTimeout(900);
  await shot(m.page, 'app-mobile-01.png');
  await m.ctx.close();
  await ctx.close();
}

// ---------- GAME ----------
{
  const { ctx, page } = await mk();
  await page.goto(BASE + 'game.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#hq-gate-form', { timeout: 30000 });
  await page.waitForTimeout(1500);
  const f = page.locator('#hq-gate-form');
  await f.locator('input[name=name]').fill('Huyền Minh');
  await f.locator('input[name=date]').fill('1992-08-16');
  await f.locator('input[name=time]').fill('09:30');
  await shot(page, 'game-00-gate.png');
  await f.locator('button[type=submit]').click();
  await page.waitForTimeout(3500);
  await shot(page, 'game-01-rite.png');
  await page.click('#hq-wear').catch((e) => console.log('wear?', e.message));
  await page.waitForTimeout(20000);
  await shot(page, 'game-02-world.png');
  // đi dạo vài hướng
  const walk = async (key, ms, name) => {
    await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key);
    await page.waitForTimeout(1500);
    await shot(page, name);
  };
  await walk('w', 3000, 'game-03.png');
  await walk('d', 1800, 'game-04.png');
  await walk('w', 3500, 'game-05.png');
  await walk('a', 2500, 'game-06.png');
  await walk('w', 4000, 'game-07.png');
  await ctx.close();
}

console.log('errors:', errors.slice(0, 10));
await browser.close();
await server.close();
