// Wait for user to log into App Store Connect in the debug Chrome (port 9222).
import { chromium } from 'playwright';
import fs from 'fs';
fs.mkdirSync('_tmp', { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0];
let page = ctx.pages().find(p => /appstoreconnect\.apple\.com/.test(p.url()));
if (!page) { page = await ctx.newPage(); }
try { await page.goto('https://appstoreconnect.apple.com/apps', { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) {}
try { await page.bringToFront(); } catch (e) {}
console.log('Waiting for login in the debug Chrome window…');

let logged = false;
for (let i = 0; i < 100; i++) {            // up to ~5 min
  const url = page.url();
  const body = await page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
  if (/appstoreconnect\.apple\.com\/(apps|web)/.test(url) && /My Apps|Apps \| App Store Connect/.test(body)) {
    logged = true; break;
  }
  await page.waitForTimeout(3000);
}
await page.screenshot({ path: '_tmp/asc-shot.png' });
console.log('LOGGED_IN:', logged);
console.log('URL:', page.url());
await browser.close();   // disconnect only; Chrome keeps running
