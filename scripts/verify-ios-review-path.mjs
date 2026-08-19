// ============================================================================
//  verify-ios-review-path.mjs — Án cổ → hiệu khảo → thi → 应期 → cite
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
  ok(tabText.includes('Đối'), 'có tab Đối');
  ok(!/Nghiệm/.test(tabText), 'nhãn tab không còn Nghiệm');
  ok(!/Hồ sơ|Bàn|So sánh/.test(tabText), 'không còn tab Hồ sơ / Bàn / So sánh');
  ok(await page.locator('#ios-tab-an').getAttribute('aria-selected') === 'true', 'Án là tab mặc định');
  ok(await page.locator('#ios-an-list .ios-list-item').count() >= 1, 'sổ có ≥1 bản in 教材');
  ok(await page.locator('#ios-an-list .ios-list-item').count() <= 2, 'không liệt kê 3 permutation plate');
  const listText = await page.locator('#ios-an-list').innerText();
  const anRoot = await page.locator('#ios-an-root').innerText();
  ok(/教材/.test(listText) && /印本/.test(listText), 'chip 教材 / 印本 hiện trên danh sách');
  ok(/四柱|未记/.test(listText), 'list có 四柱 / 未记');
  ok(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/.test(listText), 'list hiện 干支');
  ok(/Cha|Mẹ|Con|Chủ thể/.test(listText), 'án cổ là cụm trụ');
  ok(!/hồ sơ khách|Án mẫu/.test(listText), 'không gắn nhãn hồ sơ khách / Án mẫu');
  ok(!/Tạo án trống|ÁN TRỐNG/.test(anRoot), 'first paint không hiện Tạo án trống');
  ok(!/ngày sinh|thêm ngày sinh|giờ sinh/i.test(anRoot), 'first paint không nói thêm ngày sinh');
  ok(!/\d{4}-\d{2}-\d{2}/.test(anRoot), 'cold open không có dương lịch YYYY-MM-DD');
  ok(!/1995-08-12|09:30/.test(anRoot), 'cold open không hiện ngày/giờ sinh');
  ok(await page.locator('#ios-an-root input[type=date]').count() === 0, 'cold open Án không có input ngày');
  ok(await page.locator('#ios-an-root input[type=time]').count() === 0, 'cold open Án không có input giờ');
  ok(await page.locator('#ios-an-root input[type=radio]').count() === 0, 'cold open Án không có radio giới');
  ok(await page.locator('#ios-an-overflow-panel.hidden').count() === 1, 'panel Tạo án trống đang ẩn');
  ok(await page.locator('#birth-form').count() === 0, 'DOM không có #birth-form');
  ok(await page.locator('#ai-fab').count() === 0, 'DOM không có FAB Giải Mệnh');
  ok(await page.locator('header.hero').count() === 0, 'DOM không có hero web');

  const chrome = await page.evaluate(() => {
    return [...document.querySelectorAll('h1, h2, .ios-tabbar, .ios-btn-primary, .ios-lib-head')]
      .filter((n) => n.offsetParent !== null)
      .map((n) => n.innerText)
      .join(' ');
  });
  ok(!/luận mệnh|Giải Mệnh|vận thế hôm nay|hợp tuổi|cải mệnh|Lập lá số|sổ hồ sơ/i.test(chrome), 'chrome first screen không có CTA tiêu dùng');
  ok(/四柱|教材|校正|Lữ Đăng/i.test(chrome), 'first screen là 四柱 教材 / 校正');
  ok(!/\/100/.test(chrome), 'first screen không có điểm /100');
  await page.screenshot({ path: path.join(SHOTS, 'ios-01-cases.png') });

  await page.locator('#ios-an-list .ios-list-item').first().click();
  await page.waitForSelector('#ios-thi', { timeout: 20000 });
  await page.waitForSelector('#ios-hour-table', { timeout: 20000 });
  const hourBtns = await page.locator('#ios-hour-table .ios-shi-btn').count();
  ok(hourBtns >= 12, `Thi có ${hourBtns} 地支`);
  ok(await page.locator('#ios-nghiem input[type=date]').count() === 0, 'Đối không có input ngày');
  ok(await page.locator('#ios-nghiem input[type=time]').count() === 0, 'Đối không có input giờ');
  const doiFold = await page.evaluate(() => {
    const root = document.getElementById('ios-nghiem');
    if (!root) return '';
    const clone = root.cloneNode(true);
    clone.querySelectorAll('details').forEach((d) => d.remove());
    return clone.innerText;
  });
  ok(!/\d{4}-\d{2}-\d{2}/.test(doiFold), 'Đối (chưa mở details) không có YYYY-MM-DD');
  ok(await page.locator('#ios-solar-source').count() === 1, 'có #ios-solar-source');
  ok(!(await page.locator('#ios-solar-source').getAttribute('open')), 'solar source đang đóng');
  await page.waitForSelector('#ios-hieu-khao', { timeout: 20000 });
  await page.waitForSelector('#ios-family-tree', { timeout: 20000 });
  ok(await page.locator('#ios-family-tree svg').count() >= 1, 'Đối hiện bản in cụm trụ');
  ok(await page.locator('#ios-hieu-khao').count() === 1, 'có mục Hiệu khảo');
  const doi = await page.locator('#ios-nghiem').innerText();
  ok(/Hiệu khảo|合|歧/.test(doi), 'hiệu khảo có 合 / 歧');
  ok(!/Giải Mệnh|cải mệnh|luận mệnh|diễn giải mệnh/i.test(doi), 'Đối không có CTA tiêu dùng');
  await page.locator('#ios-thi').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(SHOTS, 'ios-02-tree.png') });

  await page.locator('#ios-hour-table').scrollIntoViewIfNeeded();
  await page.locator('#ios-hour-table .ios-shi-btn').first().click();
  await page.waitForSelector('#ios-thi-grade-line', { timeout: 30000 });
  const grade = await page.locator('#ios-nghiem-result').innerText();
  ok(/khớp khóa 教材|lệch khóa/.test(grade), 'Thi chấm khóa / lập luận');
  ok(/时辰|Tý|Sửu|Dần/.test(await page.locator('#ios-thi').innerText()), 'Thi có địa chi');
  ok(!/\/100/.test(grade), 'Thi không hiện điểm /100');
  ok(!/tốt nhất|giải mệnh|vận thế/i.test(grade), 'Thi không nói phẩm chất mệnh');
  const cites = page.locator('#ios-nghiem .ios-cite-ref');
  ok(await cites.count() >= 1, 'có ≥1 cite-ref mở được reader');
  ok(/子平真诠|渊海子平|穷通宝鉴|滴天髓|三命通会/.test(doi + grade), 'trích dẫn là kinh ưu tiên');

  await page.locator('#ios-yingqi').scrollIntoViewIfNeeded();
  const ying = await page.locator('#ios-yingqi').innerText();
  ok(await page.locator('#ios-yingqi .ios-yingqi-row').count() >= 1, 'có ≥1 hàng 应期');
  ok(/giữ|không giữ/.test(ying), '应期 là luật giữ / không giữ');
  ok(!/năm này tốt|运势|vận thế/i.test(ying), '应期 không nói vận hạn');
  await page.screenshot({ path: path.join(SHOTS, 'ios-03-hours.png') });

  await cites.first().click();
  await page.waitForSelector('.ios-reader-title', { timeout: 15000 });
  ok(await page.locator('.ios-subtab').count() >= 5, 'reader có ≥5 tab');
  ok(await page.locator('#ios-cite-hit, .ios-cite-hit, .ios-reader-title').count() >= 1, 'reader mở đoạn kinh');
  ok(await page.locator('a[href^="http"]').count() === 0, 'shell không có link http ngoài');
  await page.screenshot({ path: path.join(SHOTS, 'ios-04-cite.png') });

  const reviewDir = path.join(ROOT, 'public', 'review');
  fs.mkdirSync(reviewDir, { recursive: true });
  for (const name of ['ios-01-cases.png', 'ios-02-tree.png', 'ios-03-hours.png', 'ios-04-cite.png']) {
    fs.copyFileSync(path.join(SHOTS, name), path.join(reviewDir, name));
  }

  await browser.close();
  server.close();
  console.log(`[review-path] ${pass} PASS / ${fail} FAIL`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
