// App Store Connect browser driver — persistent profile (login persists across runs).
// Usage: node scripts/asc-drive.mjs peek    (goto + 12s + screenshot + close — see state)
//        node scripts/asc-drive.mjs wait    (goto + poll 240s for login + screenshot)
import { chromium } from 'playwright';
import fs from 'fs';
const mode = process.argv[2] || 'peek';
const PROFILE = path => '_tmp/asc-profile';
const SHOT = '_tmp/asc-shot.png';
fs.mkdirSync('_tmp', { recursive: true });

const ctx = await chromium.launchPersistentContext('_tmp/asc-profile', {
  headless: false,
  viewport: { width: 1280, height: 900 },
  args: ['--disable-blink-features=AutomationControlled'],
});
const page = await ctx.newPage();
try {
  await page.goto('https://appstoreconnect.apple.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
} catch (e) { console.log('goto err', e.message); }
await page.waitForTimeout(4000);
await page.screenshot({ path: SHOT });
console.log('initial url:', page.url());

if (mode === 'wait') {
  let logged = false;
  for (let i = 0; i < 78; i++) {
    const url = page.url();
    const bodyTxt = await page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
    if (url.includes('/apps') || /My Apps|Ứng dụng của tôi|Apps \| App Store Connect/.test(bodyTxt)) {
      logged = true; break;
    }
    await page.waitForTimeout(3000);
  }
  await page.screenshot({ path: SHOT });
  console.log('logged_in:', logged, 'final url:', page.url());
}
await ctx.close();
console.log('DONE mode=' + mode);
