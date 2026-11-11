// ============================================================================
//  ĐO CHI PHÍ DÂN THÀNH MỖI KHUNG (Playwright, bản dev): đứng giữa phố có ~750 người đi đường, gọi
//  citizens.update + citizens.ui 600 lần (nhãn / bong bóng ghi DOM thật) → ms / khung; rồi giả lập CPU chậm 4× đo fps.
//    node scripts/bench-citizens.mjs [url]     mặc định http://127.0.0.1:5180/game.html
// ============================================================================
import { chromium } from 'playwright';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://127.0.0.1:5180/game.html';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addInitScript(() => localStorage.setItem('huyenquan:quality', 'low'));
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 60000 });
const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 60000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
// tới giữa cụm người đi đường đông nhất
const at = await page.evaluate(() => {
  const L = window.__hq.renderer.citizens.list.filter((n) => String(n.id).startsWith('pho5_'));
  let best = null, bn = -1;
  for (const a of L.filter((_, i) => i % 7 === 0)) { const k = L.filter((b) => Math.hypot(a.x - b.x, a.z - b.z) < 60).length; if (k > bn) { bn = k; best = a; } }
  window.__hq.api.travel(best.x, best.z, 'đo'); return { x: best.x, z: best.z, n: bn, total: window.__hq.renderer.citizens.list.length };
});
await page.waitForTimeout(15000);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
const bench = await page.evaluate((W) => {
  const C = window.__hq.renderer.citizens;
  const place = (el, x, y, z) => { el.style.display = ''; el.style.transform = `translate(${x.toFixed(1)}px,${z.toFixed(1)}px)`; return true; };
  const showBubble = (el, b) => { const on = !!b; el.hidden = !on; if (on && el.textContent !== b.text) el.textContent = b.text; };
  for (let i = 0; i < 60; i++) { C.update(1 / 60, i / 60, W, performance.now(), ''); C.ui(W, place, showBubble); }
  const t0 = performance.now(); let t = 1;
  for (let i = 0; i < 600; i++) { t += 1 / 60; C.update(1 / 60, t, W, performance.now(), ''); C.ui(W, place, showBubble); }
  return { msPerFrame: ((performance.now() - t0) / 600).toFixed(3), active: C.activeCount, dom: document.querySelectorAll('.hq-label').length };
}, { x: at.x, z: at.z });
const fps = () => page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 5000) requestAnimationFrame(f); else r((n / 5).toFixed(1)); }; requestAnimationFrame(f); }));
const f1 = await fps();
const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const f4 = await fps();
console.log(JSON.stringify({ ...at, ...bench, fps: f1, fpsCpu4x: f4 }));
await browser.close();
