// ============================================================================
//  KIỂM BẢN ĐỒ CHI TIẾT TRÊN BẢN LIVE (Playwright): khách mới → vào game 3D → phím M mở bản đồ →
//  chụp toàn cảnh, phóng to, tìm «thuốc», bấm kết quả (thẻ địa điểm), đặt dấu → chụp bản đồ nhỏ có mũi tên.
//    node scripts/live-map.mjs [url]     ảnh ra shots/live-map-*.png
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL_ = process.argv.find((a) => a.startsWith('http')) || 'https://battu.god8.shop/game.html';
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 30000 });
await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 120000 });
await page.waitForTimeout(3000);
const mode = await page.evaluate(() => (document.querySelector('canvas')?.getContext ? 'canvas' : '?') + ' · 3dfail=' + !!document.querySelector('.hq-3dfail'));
console.log('chế độ:', mode);
await page.screenshot({ path: 'shots/live-map-0-game.png' });
await page.keyboard.press('m');
await page.waitForSelector('.hq-mapfull', { timeout: 15000 });
await page.waitForTimeout(800);
await page.screenshot({ path: 'shots/live-map-1-open.png' });
const box = await page.locator('.hq-mapfull canvas').first().boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.mouse.move(cx, cy);
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -300); await page.waitForTimeout(150); }
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/live-map-2-zoom.png' });
for (let i = 0; i < 9; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(120); }
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/live-map-3-whole.png' });
const search = page.locator('.hq-mapfull input').first();
await search.fill('thuốc');
await page.waitForTimeout(600);
const results = await page.locator('.hq-mapfull .hq-row-btn').allInnerTexts().catch(() => []);
console.log('tìm «thuốc»:', results.slice(0, 5).join(' | '));
if (results.length) { await page.locator('.hq-mapfull .hq-row-btn').first().click(); await page.waitForTimeout(700); }
await page.screenshot({ path: 'shots/live-map-4-card.png' });
const card = await page.locator('.hq-mapfull').innerText().catch(() => '');
console.log('thẻ:', card.split('\n').filter((l) => /Đặt dấu|Xe|Đi bộ|m$|km/.test(l)).slice(0, 6).join(' | '));
const pinBtn = page.locator('.hq-mapfull button', { hasText: /Đặt dấu/ });
if (await pinBtn.count()) { await pinBtn.first().click(); await page.waitForTimeout(300); }
await page.keyboard.press('Escape');
await page.waitForTimeout(800);
const pinTxt = await page.locator('.hq-pin-txt').innerText().catch(() => '(không thấy)');
console.log('dấu trên bản đồ nhỏ:', pinTxt);
await page.screenshot({ path: 'shots/live-map-5-mini.png' });
console.log(errs.length ? 'lỗi trang: ' + errs.join(' | ') : 'không lỗi trang');
await browser.close();
