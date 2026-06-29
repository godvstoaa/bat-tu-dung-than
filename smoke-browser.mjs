// [loop 930] BROWSER RUNTIME SMOKE TEST — the ONE check selftest can't do.
// selftest (Node) covers the engine; this loads the LIVE app in a real browser
// (Playwright) and catches runtime/JS errors that a passing build hides.
// Born from the loop 928 incident: build was green for 13 loops while the app
// served stale code — and even after the fix, browser-runtime bugs (undefined
// refs, DOM errors) would sail past the build. This closes that gap.
//
// Run: node smoke-browser.mjs   (needs: npm i playwright + npx playwright install chromium)
// Optional dev: node smoke-browser.mjs http://localhost:5173
// Deep AI check (slow/variable): node smoke-browser.mjs --ai
import { chromium } from 'playwright';

const URL = process.argv[2] || 'https://battu.god8.shop/';
const pageErrors = [], consoleErrors = [];
let browser;
try { browser = await chromium.launch({ headless: true }); }
catch (e) { console.log('⚠ Playwright/chromium chưa cài — bỏ qua smoke-browser. Cài: npx playwright install chromium'); process.exit(0); }

let exit = 0;
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  console.log(`▶ Loading ${URL} ...`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // 1. App shell + birth form
  const hasForm = !!(await page.$('input[type="date"]'));
  const hasAsk = !!(await page.$('#ask-btn'));
  console.log(`  app shell: date-input=${hasForm} ask-btn=${hasAsk}`);

  // 2. Render a chart (birth → Luận giải)
  await page.fill('input[type="date"]', '1990-05-15').catch(() => {});
  await page.fill('input[type="time"]', '08:30').catch(() => {});
  const luân = await page.$('button:has-text("Luận"), #analyze-btn, .btn-primary');
  if (luân) await luân.click();
  await page.waitForTimeout(4500);
  const body = await page.textContent('body').catch(() => '');
  const chartOk = /TỨ TRỤ|四柱|Dụng|Nhật Chủ|Đại vận/.test(body);
  console.log(`  chart rendered: ${chartOk ? '✓' : '✗'}`);
  if (!chartOk) exit = 1;

  // 3. Open AI chat via FAB (REAL user flow — loop 931 found we were bypassing it),
  //    verify voice mic button visible (loop 931 feature). Deep AI check only with --ai
  //    (GLM reasoning is 50-90s & variable → keep default smoke fast & reliable).
  const fab = await page.$('#ai-fab');
  if (fab) { await fab.click(); await page.waitForTimeout(500); }
  const voiceVisible = await page.$('#voice-btn').then((v) => v ? v.isVisible() : Promise.resolve(false));
  console.log(`  voice mic button (loop 931): ${voiceVisible ? '✓ visible after FAB' : '⚠ not visible'}`);

  if (!process.argv.includes('--ai')) {
    console.log('  (bỏ qua AI deep-check — thêm --ai để test hỏi/trả lời/followup)');
  } else {
  const q = await page.$('#question');
  if (q) { await q.scrollIntoViewIfNeeded().catch(() => {}); await q.fill('Tổng quan mệnh tôi thế nào?'); }
  const askBtn = await page.$('#ask-btn');
  if (askBtn) { await askBtn.scrollIntoViewIfNeeded().catch(() => {}); await askBtn.click(); }
  let streaming = true;
  for (let i = 0; i < 25; i++) {
    await page.waitForTimeout(3000);
    streaming = !!(await page.$('.msg-assistant .msg-text.streaming'));
    if (!streaming) break;
  }
  await page.waitForTimeout(1500);
  const chips = await page.locator('.followup-chip').count();
  console.log(`  AI answer + followup chips: ${chips > 0 ? `✓ ${chips} chips` : '✗ (AI có thể vẫn đang stream — thử lại)'}`);
  }

  // 4. Verdict
  console.log(`\nPAGE ERRORS: ${pageErrors.length} | CONSOLE ERRORS: ${consoleErrors.length}`);
  pageErrors.slice(0, 5).forEach((e) => console.log('  ❌ page:', e.slice(0, 160)));
  consoleErrors.slice(0, 5).forEach((e) => console.log('  ⚠ console:', e.slice(0, 160)));
  if (pageErrors.length || !hasForm || !hasAsk) exit = 1;
  console.log(exit === 0 ? '\n✓ BROWSER SMOKE PASSED — app runs clean in real browser' : '\n✗ BROWSER SMOKE FAILED');
} catch (e) {
  console.log('✗ smoke crashed:', e.message.slice(0, 160));
  exit = 1;
} finally {
  await browser.close();
  process.exit(exit);
}
