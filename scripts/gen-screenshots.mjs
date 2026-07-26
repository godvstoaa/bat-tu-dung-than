// Generate App Store screenshots from live app (iPhone 6.7" = 1290×2796)
// Usage: node scripts/gen-screenshots.mjs
// Requires: dev server running OR production URL
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'resources/screenshots';
mkdirSync(OUT, { recursive: true });

// iPhone 15 Pro Max — 6.7" (Apple required size)
const DEVICE = { width: 430, height: 932, deviceScaleFactor: 3 };
const APP_URL = process.env.APP_URL || 'https://battu.god8.shop';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...DEVICE, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();

  const shots = [
    ['01-home', async () => { await page.goto(APP_URL); await sleep(3000); }],
    ['02-chart', async () => {
      // Fill birth data + run analysis
      await page.goto(APP_URL);
      await sleep(2000);
      try {
        await page.fill('#birth-date, [type="date"]', '1990-05-15').catch(() => {});
        await page.fill('#birth-time, [type="time"]', '10:00').catch(() => {});
        await page.click('button:has-text("Luận"), button:has-text("Phân tích"), button[type="submit"]').catch(() => {});
        await sleep(5000);
      } catch (e) {}
    }],
    ['03-ai-chat', async () => {
      await page.goto(APP_URL);
      await sleep(2000);
      try {
        await page.click('button:has-text("AI"), button:has-text("Trợ lý"), [data-tab="ai"]').catch(() => {});
        await sleep(2000);
      } catch (e) {}
    }],
    ['04-library', async () => {
      await page.goto(APP_URL + '/#thu-vien-huyen-hoc');
      await sleep(3000);
    }],
    ['05-schools', async () => {
      await page.goto(APP_URL + '#truong-phai');
      await sleep(3000);
    }],
    ['06-divination', async () => {
      await page.goto(APP_URL);
      await sleep(2000);
      try {
        await page.click('button:has-text("Dịch"), button:has-text("Gieo quẻ"), [data-tab="divination"]').catch(() => {});
        await sleep(2000);
      } catch (e) {}
    }],
  ];

  for (const [name, fn] of shots) {
    try {
      await fn();
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
      console.log(`✅ ${name}.png`);
    } catch (e) {
      console.log(`❌ ${name}: ${e.message.slice(0, 80)}`);
    }
  }

  await browser.close();
  console.log(`\nScreenshots in ${OUT}/ — dùng cho App Store Connect (iPhone 6.7")`);
})();
