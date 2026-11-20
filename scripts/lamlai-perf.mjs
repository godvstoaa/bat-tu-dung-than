// ĐO A/B nhà thủ tục (archcity/houses.js) vs mẫu Meshy cũ: lệnh vẽ, tam giác, FPS tại các góc nhìn cố định.
//   node scripts/lamlai-perf.mjs [url]
import { chromium } from 'playwright';
const URL_ = process.argv[2] || 'http://localhost:5181/game.html';
const SPOTS = [{ n: 'cong', x: 0, z: 92, cam: [0, 4, 112], look: [0, 7, 66] }, { n: 'pho', x: 0, z: 88, cam: [2, 3, 96], look: [-18, 4, 82] }, { n: 'ngoai', x: 0, z: 260, cam: [4, 4, 250], look: [0, 5, 300] }, { n: 'san', x: 0, z: 30, cam: [0, 6, 30], look: [0, 7, 67] }];
async function run(noProc) {
  const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  if (noProc) await page.addInitScript(() => { globalThis.__noProcHouse = true; });
  await page.goto(URL_, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hq-gate button', { timeout: 60000 });
  if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
  const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 60000 });
  const t0 = Date.now(); await go.first().click();
  await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
  const load = (Date.now() - t0) / 1000;
  const out = { load };
  for (const s of SPOTS) {
    await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [s.x, s.z]); await page.waitForTimeout(10000);
    await page.evaluate((c) => window.__hq.renderer.setDebugCam(c), { pos: s.cam, look: s.look }); await page.waitForTimeout(4000);
    const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(f); else r(+(n / 4).toFixed(1)); }; requestAnimationFrame(f); }));
    const st = await page.evaluate(() => window.__hq.renderer.frameStats());
    out[s.n] = { fps, ...st };
  }
  await browser.close();
  return out;
}
const A = await run(true), B = await run(false);
console.log('tải (s): Meshy', A.load.toFixed(1), '· thủ tục', B.load.toFixed(1));
for (const s of SPOTS) console.log(`${s.n.padEnd(6)} Meshy: ${A[s.n].fps} fps, ${A[s.n].calls} lệnh vẽ, ${(A[s.n].tris / 1e6).toFixed(2)} tr tg | thủ tục: ${B[s.n].fps} fps, ${B[s.n].calls} lệnh vẽ, ${(B[s.n].tris / 1e6).toFixed(2)} tr tg, tex ${B[s.n].tex}`);
