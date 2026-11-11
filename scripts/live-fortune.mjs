// ============================================================================
//  KIỂM THẦY BÓI AI TRÊN BẢN LIVE (Playwright): khách mới (ngày sinh thử) → tân thủ «Dẫn đường» tới Thầy Tử Bình →
//  hỏi một câu → đợi câu trả lời, xem nguồn là AI thật (có huy hiệu Neo) hay luận cục bộ.
//    node scripts/live-fortune.mjs [url]     mặc định https://battu.god8.shop/game.html
// ============================================================================
import { chromium } from 'playwright';

const URL_ = process.argv.find((a) => a.startsWith('http')) || 'https://battu.god8.shop/game.html';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' })).newPage(); // UA thường: worker chặn «HeadlessChrome» (chống cào)
await page.addInitScript(() => { try { localStorage.setItem('huyenquan:quality', 'low'); } catch (e) { /* ignore */ } }); // kiểm AI, không kiểm đồ hoạ: cố định mức thấp → bộ tự hạ chất lượng không tải lại trang giữa chừng
const errs = [];
page.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
const ai = [];
page.on('response', async (r) => { if (/\/zai|\/groq|chat\/completions/.test(r.url())) { let b = ''; try { b = r.status() >= 400 ? (await r.text()).slice(0, 300) : ''; } catch (e) { /* luồng */ } ai.push(`${r.status()} ${r.url().replace(/^https?:\/\/[^/]+/, '')} ${b}`); } });
page.on('console', (m) => { if (/ai|zai|persona|llm/i.test(m.text())) ai.push('console ' + m.type() + ': ' + m.text().slice(0, 200)); });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
if (await page.$('#hq-gate input[name=date]')) {
  const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
  if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
}
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 30000 });
await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 120000 });
await page.waitForTimeout(3000);
const tut = await page.locator('.hq-tut').innerText().catch(() => '');
console.log('tân thủ:', tut.split('\n')[0]);
await page.locator('.hq-tut [data-a=go]').click();
await page.waitForSelector('.hq-master-ask input', { timeout: 60000 });
console.log('khung chat:', (await page.locator('.hq-panel').innerText()).split('\n').slice(0, 4).join(' | '));
const q = 'Năm nay công việc của tôi thế nào, nên tập trung vào điều gì?';
await page.fill('.hq-master-ask input', q);
await page.press('.hq-master-ask input', 'Enter');
await page.waitForFunction(() => { const a = [...document.querySelectorAll('.hq-msg.a')].at(-1); return a && !a.classList.contains('streaming') && document.querySelectorAll('.hq-msg.a').length >= 2; }, null, { timeout: 120000 });
const ans = await page.evaluate(() => { const a = [...document.querySelectorAll('.hq-msg.a')].at(-1); return { text: a.innerText.slice(0, 900), neo: a.querySelector('.hq-neo')?.innerText || '' }; });
console.log('TRẢ LỜI:\n' + ans.text);
console.log('nguồn:', /cục bộ/i.test(ans.neo) ? 'LUẬN CỤC BỘ (không có AI)' : `AI thật — ${ans.neo}`);
console.log('gợi ý tiếp:', await page.evaluate(() => [...document.querySelectorAll('.hq-choice')].map((b) => b.textContent).join(' · ')));
const tut2 = await page.locator('.hq-tut').innerText().catch(() => '');
console.log('tân thủ sau khi hỏi:', tut2.split('\n')[0]);
console.log('mạng AI:', JSON.stringify(ai.slice(0, 20), null, 1));
console.log(errs.length ? 'lỗi trang: ' + errs.join(' | ') : 'không lỗi trang');
await browser.close();
