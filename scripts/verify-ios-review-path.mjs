// ============================================================================
//  verify-ios-review-path.mjs — Án → cây → xếp 12 giờ → đoạn kinh thật
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
  const tabText = tabs.join(' ');
  ok(tabText.includes('Án') && tabText.includes('Thư viện'), 'có tab Án + Thư viện');
  ok(tabText.includes('Nghiệm'), 'có tab Nghiệm');
  ok(!/Hồ sơ|Bàn|So sánh/.test(tabText), 'không còn tab Hồ sơ / Bàn / So sánh');
  ok(await page.locator('#ios-tab-an').getAttribute('aria-selected') === 'true', 'Án là tab mặc định');
  ok(await page.locator('#ios-an-list .ios-list-item').count() >= 1, 'sổ có ≥1 án gia tộc');
  const listText = await page.locator('#ios-an-list').innerText();
  ok(/giờ chưa rõ/.test(listText), 'án mẫu có thành viên giờ chưa rõ');
  ok(/Cha|Mẹ|Con|Chủ thể/.test(listText), 'án mẫu là cụm gia tộc');
  ok(await page.locator('#birth-form').count() === 0, 'DOM không có #birth-form');
  ok(await page.locator('#ai-fab').count() === 0, 'DOM không có FAB Giải Mệnh');
  ok(await page.locator('header.hero').count() === 0, 'DOM không có hero web');

  const chrome = await page.evaluate(() => {
    return [...document.querySelectorAll('h1, h2, .ios-tabbar, .ios-btn-primary, .ios-lib-head')]
      .filter((n) => n.offsetParent !== null)
      .map((n) => n.innerText)
      .join(' ');
  });
  ok(!/luận mệnh|Giải Mệnh|vận thế hôm nay|hợp tuổi|cải mệnh|Lập lá số|sổ hồ sơ mệnh lý/i.test(chrome), 'chrome first screen không có CTA tiêu dùng');
  ok(/Án|Lữ Đăng|Hiệu chỉnh giờ|校正/i.test(chrome), 'first screen là sổ án / hiệu chỉnh giờ');
  ok(!/\/100/.test(chrome), 'first screen không có điểm /100');
  await page.screenshot({ path: path.join(SHOTS, 'ios-01-cases.png') });

  await page.locator('#ios-an-list .ios-list-item').first().click();
  await page.waitForSelector('#ios-family-tree', { timeout: 20000 });
  ok(await page.locator('#ios-family-tree svg').count() >= 1, 'mở án hiện chòm sao gia tộc');
  ok(await page.locator('#ios-run-btn').count() === 1, 'có CTA Chạy nghiệm / Xếp 12 giờ');
  const tree = await page.locator('#ios-nghiem').innerText();
  ok(!/Giải Mệnh|cải mệnh|luận mệnh|diễn giải mệnh/i.test(tree), 'nghiệm không có CTA tiêu dùng');
  await page.screenshot({ path: path.join(SHOTS, 'ios-02-tree.png') });

  await page.locator('#ios-run-btn').click();
  await page.waitForSelector('#ios-hour-table', { timeout: 30000 });
  await page.locator('#ios-hour-table').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const hourRows = await page.locator('#ios-hour-table tbody tr').count();
  ok(hourRows >= 12, `bảng 12 giờ có ${hourRows} hàng`);
  const result = await page.locator('#ios-nghiem-result').innerText();
  ok(/时辰|Tý|Sửu|Dần/.test(result), 'bảng giờ có địa chi');
  ok(!/\/100/.test(result), 'kết quả không hiện điểm /100');
  const cites = page.locator('#ios-nghiem-result .ios-cite-ref');
  ok(await cites.count() >= 1, 'có ≥1 cite-ref mở được reader');
  ok(/子平真诠|渊海子平|穷通宝鉴|滴天髓|三命通会/.test(result), 'trích dẫn là kinh ưu tiên');
  await page.screenshot({ path: path.join(SHOTS, 'ios-03-hours.png') });

  await cites.first().click();
  await page.waitForSelector('.ios-reader-title', { timeout: 15000 });
  ok(await page.locator('.ios-subtab').count() >= 5, 'reader có ≥5 tab');
  ok(await page.locator('#ios-cite-hit, .ios-cite-hit, .ios-reader-title').count() >= 1, 'reader mở đoạn kinh');
  ok(await page.locator('a[href^="http"]').count() === 0, 'shell không có link http ngoài');
  await page.screenshot({ path: path.join(SHOTS, 'ios-04-cite.png') });

  await browser.close();
  server.close();
  console.log(`[review-path] ${pass} PASS / ${fail} FAIL`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
