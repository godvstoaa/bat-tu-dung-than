// ============================================================================
//  verify-ios-review-path.mjs — cold open hồ sơ → mở case → bảng + trích dẫn
// ============================================================================
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist-ios');
const SHOTS = path.join(ROOT, 'test-results');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { console.log(`  PASS  ${msg}`); pass++; }
  else { console.log(`  FAIL  ${msg}`); fail++; }
}

function contentType(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.json')) return 'application/json; charset=utf-8';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.webmanifest')) return 'application/manifest+json';
  return 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/') urlPath = '/index.html';
      const file = path.join(DIST, urlPath.replace(/^\//, ''));
      if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); res.end('not found'); return;
      }
      res.writeHead(200, { 'Content-Type': contentType(file) });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('Thiếu dist-ios — chạy npm run build:ios trước');
    process.exit(1);
  }
  const server = await startServer();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  console.log(`[review-path] ${base}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('#ios-root', { timeout: 15000 });

  const tabs = await page.locator('.ios-tab').allTextContents();
  ok(tabs.join(' ').includes('Hồ sơ') && tabs.join(' ').includes('Thư viện'), 'có tab Hồ sơ + Thư viện');
  ok(tabs.join(' ').includes('Bàn') && tabs.join(' ').includes('So sánh'), 'có tab Bàn + So sánh');
  ok(await page.locator('#ios-tab-cases').getAttribute('aria-selected') === 'true', 'Hồ sơ là tab mặc định');
  ok(await page.locator('#ios-case-list .ios-list-item').count() >= 2, 'sổ có ≥2 hồ sơ (kể cả case mẫu)');
  ok(await page.locator('#birth-form').count() === 0, 'DOM không có #birth-form');
  ok(await page.locator('#ai-fab').count() === 0, 'DOM không có FAB Giải Mệnh');
  ok(await page.locator('header.hero').count() === 0, 'DOM không có hero web');

  const chrome = await page.evaluate(() => {
    return [...document.querySelectorAll('h1, h2, .ios-tabbar, .ios-btn-primary')]
      .filter((n) => n.offsetParent !== null)
      .map((n) => n.innerText)
      .join(' ');
  });
  ok(!/Giải Mệnh|vận thế hôm nay|hợp tuổi|cải mệnh|Lập lá số/i.test(chrome), 'chrome first screen không có CTA tiêu dùng');
  ok(/Hồ sơ|Lữ Đăng/i.test(chrome), 'first screen là sổ hồ sơ');
  await page.screenshot({ path: path.join(SHOTS, 'ios-01-cases.png') });

  await page.locator('#ios-case-list .ios-list-item').first().click();
  await page.waitForSelector('#ios-case-desk .ios-table', { timeout: 15000 });
  const desk = await page.locator('#ios-panel-desk').innerText();
  ok(/庚午/.test(desk) && /辛亥/.test(desk), 'case mẫu ra Tứ Trụ 庚午…辛亥');
  ok(await page.locator('#ios-case-cites .ios-cite-ref').count() >= 3, 'mỗi diễn giải có locator kinh');
  ok(/子平真诠|渊海子平|穷通宝鉴|滴天髓|三命通会/.test(desk), 'trích dẫn kinh có tên');
  ok(!/Giải Mệnh|vận thế hôm nay|hợp tuổi|cải mệnh/i.test(desk), 'bàn không có CTA tiêu dùng');
  ok(!/\/100/.test(desk), 'bàn không hiện điểm /100');
  await page.screenshot({ path: path.join(SHOTS, 'ios-02-desk.png') });

  await page.getByRole('tab', { name: 'So sánh' }).click();
  await page.waitForSelector('#ios-compare-out .ios-table', { timeout: 15000 });
  const cmp = await page.locator('#ios-panel-compare').innerText();
  ok(/Tứ Trụ/.test(cmp) && /Dụng thần/.test(cmp), 'so sánh là bảng hai hồ sơ');
  ok(!/\bXem hợp\b|CTA hợp/i.test(cmp), 'so sánh không phải CTA xem hợp');
  await page.screenshot({ path: path.join(SHOTS, 'ios-03-compare.png') });

  await page.getByRole('tab', { name: 'Thư viện' }).click();
  await page.waitForSelector('#ios-lib-q', { timeout: 15000 });
  await page.fill('#ios-lib-q', '穷通宝鉴');
  await page.waitForTimeout(250);
  const libItems = page.locator('#ios-panel-library .ios-list-item');
  ok(await libItems.count() > 0, 'thư viện search 穷通宝鉴 có kết quả');
  await libItems.first().click();
  await page.waitForSelector('.ios-reader-title', { timeout: 10000 });
  ok(await page.locator('.ios-subtab').count() >= 5, 'reader có ≥5 tab');
  ok(await page.locator('a[href^="http"]').count() === 0, 'shell không có link http ngoài');
  await page.screenshot({ path: path.join(SHOTS, 'ios-04-library.png') });

  await browser.close();
  server.close();
  console.log(`[review-path] ${pass} PASS / ${fail} FAIL`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
