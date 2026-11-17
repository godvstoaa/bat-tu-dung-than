// Kiểm luồng chủ phủ tiên phủ trên trình duyệt (giả lập sở hữu trên máy): thang phép chọn tầng 6 + sổ tuỳ biến đổi mái / mùa rồi dựng lại.
// Chạy: node scripts/ui-tienphu.mjs (cần vite-dev ở cổng 5180). Ảnh: output/tienphu-after/ui-*.png
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:5180/game.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
const h = 283;
// giả lập làm chủ phủ (chỉ trên máy — không gửi máy chủ)
await page.evaluate(async (h) => { const I = await import('/src/game/items.js').catch(() => null); const hq = window.__hq; const H = hq.state.home || (hq.state.home = {}); H.own = { h, items: [], couplet: 0, opts: '' }; const M = await import('/src/game/mansions.js'); const p = M.estateByH(h).toWorld(0, 30); hq.api.travel(p.x, p.z, 'x'); }, h);
await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 });
const own = await page.evaluate(async () => { const I = await import('/src/game/inventory.js').catch(() => null); return !!window.__hq.state.home?.own; });
// thang phép: mở trạm, bấm Tầng 6
const lift = await page.evaluate((h) => { const hq = window.__hq; hq.openStation(`spot:est:${h}|lift`); const btns = [...document.querySelectorAll('#hq-panel-body button')].map((b) => b.textContent); const b = [...document.querySelectorAll('#hq-panel-body button')].find((x) => /Tầng 6/.test(x.textContent)); b?.click(); return { title: document.getElementById('hq-panel-title').textContent, btns: btns.length, y3: hq.player.phys?.y3 }; }, h);
await page.waitForTimeout(2500);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest').forEach((e) => e.remove()));
await page.screenshot({ path: 'output/tienphu-after/ui-lift-floor6.png' });
// sổ tuỳ biến: mở, đổi mái son đỏ + mùa thu, lưu → dựng lại
const cust = await page.evaluate((h) => { const hq = window.__hq; hq.openStation(`spot:est:${h}|custom`); const sels = [...document.querySelectorAll('#hq-panel-body select')]; if (sels.length) { sels[0].value = '4'; sels[0].dispatchEvent(new Event('change')); sels[6].value = '2'; sels[6].dispatchEvent(new Event('change')); } const save = [...document.querySelectorAll('#hq-panel-body button')].find((b) => /Lưu/.test(b.textContent)); save?.click(); return { title: document.getElementById('hq-panel-title').textContent, selects: sels.length, opts: hq.state.home.own.opts }; }, h);
await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.optsKey; }, h, { timeout: 150000, polling: 500 }).catch(() => {});
const cams = await page.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h), sp = m.tp.tower.spec; const t = m.toWorld(m.tp.tower.x, m.tp.tower.z), tf = m.toWorld(m.tp.tower.x + 60, m.tp.tower.z + 110); return { pos: [tf.x, 45, tf.z], look: [t.x, 25, t.z] }; }, h);
await page.evaluate((v) => window.__hq.renderer.setDebugCam(v), cams); await page.waitForTimeout(2500);
await page.screenshot({ path: 'output/tienphu-after/ui-custom-after.png' });
console.log(JSON.stringify({ own, lift, cust, optsKey: await page.evaluate((h) => window.__hq.renderer.mansions.builtRec(h)?.optsKey, h), errs }));
await browser.close();
