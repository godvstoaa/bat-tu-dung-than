// Attach to the user's real Chrome (remote-debug port 9222) — already logged in.
import { chromium } from 'playwright';
import fs from 'fs';
fs.mkdirSync('_tmp', { recursive: true });

let browser;
try {
  browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
} catch (e) {
  console.log('CONNECT FAIL:', e.message);
  process.exit(1);
}
const ctx = browser.contexts()[0];
const existing = ctx.pages();
let page = existing.find(p => /appstoreconnect\.apple\.com/.test(p.url()));
if (!page) {
  page = await ctx.newPage();
  await page.goto('https://appstoreconnect.apple.com/apps', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('goto err', e.message));
}
await page.waitForTimeout(4000);
await page.bringToFront().catch(() => {});
await page.screenshot({ path: '_tmp/asc-shot.png' });
const url = page.url();
const title = await page.title().catch(() => '');
const body = await page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
console.log('URL:', url);
console.log('TITLE:', title);
console.log('LOGGED_IN:', /My Apps|Apps \| App Store Connect|Tài khoản|Account/.test(body) && !/sign in|đăng nhập|Apple ID/i.test(body.slice(0, 400)));
console.log('BODY(snippet):', body.replace(/\s+/g, ' ').slice(0, 280));
// list existing ASC tabs
console.log('TABS:', JSON.stringify(existing.map(p => p.url()).filter(u => u.includes('appstoreconnect'))));
await browser.close(); // disconnects only; Chrome keeps running
