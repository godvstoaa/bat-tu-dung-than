// ============================================================================
//  verify-ios-review-path.mjs — Playwright: cold open → Thư viện → search → đọc
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
  ok(tabs.join(' ').includes('Thư viện') && tabs.join(' ').includes('Chart Lab'), 'có 5 tab research');
  ok(await page.locator('#ios-tab-library').getAttribute('aria-selected') === 'true', 'Thư viện mặc định');
  ok(!(await page.locator('header.hero').isVisible()), 'hero web ẩn khi shell active');

  await page.screenshot({ path: path.join(SHOTS, 'ios-01-library.png') });

  await page.fill('#ios-lib-q', '穷通宝鉴');
  await page.waitForTimeout(250);
  const first = page.locator('.ios-list-item').first();
  ok(await first.count() > 0, 'search 穷通宝鉴 có kết quả');
  await page.screenshot({ path: path.join(SHOTS, 'ios-02-search-han.png') });
  await first.click();
  await page.waitForSelector('.ios-reader-title', { timeout: 10000 });
  ok(await page.locator('.ios-subtab').count() >= 5, 'reader có ≥5 tab nội dung');
  ok(await page.locator('a[href^="http"]').count() === 0, 'shell không có link http ngoài');

  await page.getByRole('tab', { name: 'Nguồn' }).click();
  ok(await page.locator('.ios-source-row').count() > 0, 'tab Nguồn có tham chiếu');
  await page.screenshot({ path: path.join(SHOTS, 'ios-03-reader-sources.png') });

  await browser.close();
  server.close();
  console.log(`[review-path] ${pass} PASS / ${fail} FAIL`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
