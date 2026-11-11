// ============================================================================
//  KIỂM PHỐ TRÊN BẢN LIVE (Playwright): khách mới → bản đồ (M) → tìm trạm xe ngựa → «Đi xe tới đây» (tân thủ < cấp 5
//  miễn phí) → chụp phố quanh trạm, đo fps / lệnh vẽ. Không cần bản dev (window.__hq).
//    node scripts/live-travel.mjs [url] [từ khoá trạm…]     ảnh ra shots/live-travel-*.png
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'https://battu.god8.shop/game.html';
const QS = process.argv.slice(2).filter((a) => !a.startsWith('http'));
const queries = QS.length ? QS : ['ga Đông', 'ga Nam', 'ga Tây'];
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
page.on('response', (r) => { if (r.status() >= 400 && /models\//.test(r.url())) errs.push(`${r.status()} ${r.url().split('/').pop()}`); });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 120000 });
await page.waitForTimeout(2000);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest').forEach((e) => e.remove()));
const fps = () => page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(f); else r((n / 4).toFixed(1)); }; requestAnimationFrame(f); }));
for (const [i, q] of queries.entries()) {
  await page.keyboard.press('m');
  await page.waitForSelector('.hq-mapfull', { timeout: 15000 });
  await page.locator('.hq-mapfull input').first().fill(q);
  await page.waitForTimeout(600);
  const rows = page.locator('.hq-mapfull .hq-row-btn');
  if (!(await rows.count())) { console.log(q, ': không thấy kết quả'); await page.keyboard.press('Escape'); continue; }
  const name = (await rows.first().innerText()).split('\n')[0];
  await rows.first().click(); await page.waitForTimeout(500);
  const btn = page.locator('.hq-mapfull button', { hasText: /Đi xe tới đây|Xe tới ga/ });
  if (!(await btn.count())) { console.log(q, ': không có nút đi xe'); await page.keyboard.press('Escape'); continue; }
  await btn.first().click();
  await page.waitForTimeout(12000); // xe chạy + nạp model quanh trạm
  await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
  console.log(`${q} → ${name} · fps ${await fps()}`);
  await page.screenshot({ path: `shots/live-travel-${i + 1}.png` });
}
console.log(errs.length ? 'lỗi: ' + errs.join(' | ') : 'không lỗi trang / model');
await browser.close();
